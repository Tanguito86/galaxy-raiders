// =====================
// GALAXY RAIDERS - audio.js
// HC-AUD-01: Refactored with bus routing + spam control
// =====================

var AC = null;
var masterGain = null;
var sfxEnabled = true;
var sfxVol = 0.35;
var audioUnlocked = false;

function initAudio() {
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = AC.createGain();
    masterGain.gain.value = sfxVol;

    // Create bus topology (audio-bus.js)
    if (typeof createAudioBuses === 'function') {
      createAudioBuses();
      if (audioBuses) {
        masterGain.connect(audioBuses.sfx);
        if (typeof initAudioBuses === 'function') initAudioBuses();
        // HC-AUD-02: Apply bus mix — music slightly under SFX so gameplay dominates
        if (typeof setBusVolume === 'function') {
          setBusVolume('music', 0.82, 0);
          setBusVolume('ambience', 0.70, 0);
          setBusVolume('sfx', 1.0, 0);
          setBusVolume('boss', 1.0, 0);
          setBusVolume('ui', 0.90, 0);
        }
      } else {
        masterGain.connect(AC.destination);
      }
    } else {
      masterGain.connect(AC.destination);
    }
  } catch (e) {}
}

function ensureAudioUnlocked() {
  if (audioUnlocked) return;
  if (!AC) initAudio();
  if (!AC) return;
  if (AC.state === 'suspended') {
    AC.resume().then(function () {
      audioUnlocked = true;
    }).catch(function () {});
  } else if (AC.state === 'running') {
    audioUnlocked = true;
  }
}

function duck(ms = 120, level = 0.35) {
  if (typeof requestMusicDuck === 'function') {
    requestMusicDuck(ms, level);
  }
}

function envGain(g, t0, a, d) {
  g.gain.cancelScheduledValues(t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(1.0, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d);
}

function tone({ type='square', f=440, f2=null, dur=0.08, vol=0.6, attack=0.003, decay=0.06, bus }) {
  if (!sfxEnabled || isMuted || !audioUnlocked) return;
  if (typeof voiceStart === 'function' && !voiceStart()) return;

  var t0 = AC.currentTime;
  var out = bus || masterGain;
  if (!out) return;

  var o = AC.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);

  var g = AC.createGain();
  g.gain.value = 0.0001;

  o.connect(g);
  g.connect(out);

  var endTime = t0 + attack + decay + 0.02;
  envGain(g, t0, attack, decay);
  o.start(t0);
  o.stop(endTime);

  o.onended = function () {
    if (typeof voiceEnd === 'function') voiceEnd();
    try { g.disconnect(); } catch (e) {}
  };
}

function noise({ dur=0.12, vol=0.5, attack=0.002, decay=0.10, hp=800, lp=8000, bus }) {
  if (!sfxEnabled || isMuted || !audioUnlocked) return;
  if (typeof voiceStart === 'function' && !voiceStart()) return;

  var t0 = AC.currentTime;
  var out = bus || masterGain;
  if (!out) return;

  var bufferSize = Math.max(1, Math.floor(AC.sampleRate * dur));
  var buffer = AC.createBuffer(1, bufferSize, AC.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);

  var src = AC.createBufferSource();
  src.buffer = buffer;

  var hpF = AC.createBiquadFilter();
  hpF.type = 'highpass';
  hpF.frequency.setValueAtTime(hp, t0);

  var lpF = AC.createBiquadFilter();
  lpF.type = 'lowpass';
  lpF.frequency.setValueAtTime(lp, t0);

  var g = AC.createGain();
  g.gain.value = 0.0001;

  src.connect(hpF);
  hpF.connect(lpF);
  lpF.connect(g);
  g.connect(out);

  envGain(g, t0, attack, decay);
  src.start(t0);

  var endTime = t0 + attack + decay + 0.02;
  src.stop(endTime);

  src.onended = function () {
    if (typeof voiceEnd === 'function') voiceEnd();
    try { g.disconnect(); } catch (e) {}
    try { hpF.disconnect(); } catch (e) {}
    try { lpF.disconnect(); } catch (e) {}
  };
}

// Balance de volúmenes
const VOL = {
  shoot: 0.25,
  hit: 0.35,
  kill: 0.45,
  big: 0.55,
  power: 0.40,
  playerHit: 0.50,
  ui: 0.25
};

// Variación de pitch anti-repetición
function randPitch(base, spread = 0.05) {
  return base * (1 + (Math.random() * 2 - 1) * spread);
}

// === SFX ARCADE 80s ===
function sfxShoot() {
  tone({ type:'square', f:randPitch(880), f2:randPitch(760), dur:0.03, vol:VOL.shoot, attack:0.002, decay:0.03 });
}

function sfxShootByWeapon(type) {
  switch (type) {
    case 'double':
      tone({ type:'square', f: randPitch(760), f2: randPitch(680), vol: VOL.shoot, dur:0.03, attack:0.002, decay:0.03 });
      break;
    case 'spread':
      tone({ type:'square', f: randPitch(820), f2: randPitch(700), vol: VOL.shoot, dur:0.03, attack:0.002, decay:0.03 });
      break;
    case 'machine':
      tone({ type:'square', f: randPitch(920), f2: randPitch(840), vol: VOL.shoot * 0.9, dur:0.02, attack:0.002, decay:0.02 });
      break;
    case 'laser':
      tone({ type:'sawtooth', f: randPitch(1200), f2: randPitch(600), vol: VOL.shoot * 1.1, dur:0.06, attack:0.002, decay:0.06 });
      break;
    default:
      sfxShoot();
  }
}

function sfxEnemyHit() {
  if (typeof sfxGuard === 'function' && !sfxGuard('enemyHit', 30)) return;
  tone({ type:'square', f:randPitch(520), f2:randPitch(420), dur:0.04, vol:VOL.hit, attack:0.002, decay:0.05 });
}

function sfxEnemyKill() {
  tone({ type:'sawtooth', f:randPitch(220), f2:randPitch(110), dur:0.08, vol:VOL.kill, attack:0.002, decay:0.10 });
  noise({ dur:0.09, vol:VOL.hit, attack:0.002, decay:0.10, hp:500, lp:6000 });
}

function sfxBigExplosion() {
  var mix = (typeof MUSIC_DUCKING !== 'undefined' && MUSIC_DUCKING.bigExplosion)
    ? MUSIC_DUCKING.bigExplosion
    : { level: 0.38, ms: 240 };
  duck(mix.ms, mix.level);
  if (typeof requestBusDuck === 'function') requestBusDuck('sfx', mix.ms * 0.6, 0.65);
  var bossOut = typeof bossBusNode === 'function' ? bossBusNode() : undefined;
  tone({ type:'sine', f:randPitch(80), f2:randPitch(40), dur:0.15, vol:VOL.big, attack:0.003, decay:0.15, bus: bossOut });
  noise({ dur:0.18, vol:VOL.big * 0.8, attack:0.002, decay:0.18, hp:120, lp:2000, bus: bossOut });
}

function sfxPowerUp() {
  tone({ type:'square', f:randPitch(660), f2:randPitch(990), dur:0.08, vol:VOL.power, attack:0.002, decay:0.10 });
  setTimeout(() => tone({ type:'square', f:randPitch(880), f2:randPitch(1320), dur:0.07, vol:VOL.power * 0.8, attack:0.002, decay:0.09 }), 60);
}

function sfxPlayerHit() {
  var mix = (typeof MUSIC_DUCKING !== 'undefined' && MUSIC_DUCKING.playerHit)
    ? MUSIC_DUCKING.playerHit
    : { level: 0.50, ms: 170 };
  duck(mix.ms, mix.level);
  if (typeof requestBusDuck === 'function') requestBusDuck('sfx', mix.ms * 0.5, 0.55);
  tone({ type:'square', f:randPitch(180), f2:randPitch(120), dur:0.10, vol:VOL.playerHit, attack:0.002, decay:0.12, bus: typeof bossBusNode === 'function' ? bossBusNode() : undefined });
  noise({ dur:0.08, vol:VOL.hit, attack:0.002, decay:0.10, hp:200, lp:1800, bus: typeof bossBusNode === 'function' ? bossBusNode() : undefined });
}

function sfxBossWarning() {
  var mix = (typeof MUSIC_DUCKING !== 'undefined' && MUSIC_DUCKING.bossWarning)
    ? MUSIC_DUCKING.bossWarning
    : { level: 0.58, ms: 150 };
  duck(mix.ms, mix.level);
  var bossOut = typeof bossBusNode === 'function' ? bossBusNode() : undefined;
  tone({ type:'square', f:880, dur:0.06, vol:VOL.hit, attack:0.002, decay:0.08, bus: bossOut });
  setTimeout(function () { tone({ type:'square', f:880, dur:0.06, vol:VOL.hit, attack:0.002, decay:0.08, bus: bossOut }); }, 120);
}

function sfxImperialTelegraph() {
  tone({ type:'square', f:randPitch(420, 0.02), f2:randPitch(520, 0.02), dur:0.05, vol:VOL.hit * 0.9, attack:0.002, decay:0.06 });
  setTimeout(() => tone({ type:'square', f:randPitch(560, 0.02), f2:randPitch(690, 0.02), dur:0.05, vol:VOL.hit, attack:0.002, decay:0.06 }), 55);
}

function sfxUIClick() {
  if (typeof sfxGuard === 'function' && !sfxGuard('uiClick', 25)) return;
  tone({ type:'square', f:randPitch(1040), f2:randPitch(920), dur:0.02, vol:VOL.ui, attack:0.001, decay:0.03, bus: typeof uiBusNode === 'function' ? uiBusNode() : undefined });
}

function sfxConfirm() {
  tone({ type:'square', f:randPitch(660), f2:randPitch(990), dur:0.05, vol:VOL.hit, attack:0.002, decay:0.06 });
}

// HC-VS-04D: stage opening jingle — ascending arpeggio
function sfxStageStart() {
  var notes = [60, 64, 67, 72]; // C4 E4 G4 C5
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'square', f:midiToFreq(m), f2:midiToFreq(m + 0.3), dur:0.06, vol:VOL.power * 0.55, attack:0.003, decay:0.07 });
      duck(80, 0.55);
    }, i * 65);
  });
}

// HC-VS-04D: new threat reveal — descending warning
function sfxNewThreat() {
  duck(160, 0.52);
  var bossOut = typeof bossBusNode === 'function' ? bossBusNode() : undefined;
  tone({ type:'sawtooth', f:660, f2:330, dur:0.12, vol:VOL.playerHit * 0.65, attack:0.003, decay:0.14, bus: bossOut });
  setTimeout(function () {
    tone({ type:'square', f:440, f2:220, dur:0.08, vol:VOL.hit * 0.5, attack:0.002, decay:0.10, bus: bossOut });
  }, 140);
}

// HC-VS-04D: setpiece escalation sting — sharp double-tap
function sfxSetpieceEscalate() {
  duck(120, 0.48);
  var bossOut = typeof bossBusNode === 'function' ? bossBusNode() : undefined;
  tone({ type:'square', f:880, f2:1100, dur:0.04, vol:VOL.hit * 0.7, attack:0.001, decay:0.05, bus: bossOut });
  setTimeout(function () {
    tone({ type:'square', f:1100, f2:1320, dur:0.04, vol:VOL.hit * 0.65, attack:0.001, decay:0.05, bus: bossOut });
  }, 50);
}

// HC-VS-04D: boss descent rumble — building tension
var _bossDescentOsc = null;
var _bossDescentGain = null;
function sfxBossDescentStart() {
  if (!sfxEnabled || isMuted || !audioUnlocked || !AC) return;
  if (_bossDescentOsc) {
    try { _bossDescentOsc.stop(); } catch(e) {}
    _bossDescentOsc = null;
    _bossDescentGain = null;
  }
  duck(1400, 0.45);
  var t0 = AC.currentTime;
  var out = (typeof bossBusNode === 'function' ? bossBusNode() : masterGain);
  _bossDescentOsc = AC.createOscillator();
  _bossDescentOsc.type = 'sawtooth';
  _bossDescentOsc.frequency.setValueAtTime(55, t0);
  _bossDescentOsc.frequency.exponentialRampToValueAtTime(180, t0 + 1.2);
  _bossDescentGain = AC.createGain();
  _bossDescentGain.gain.setValueAtTime(0.06, t0);
  _bossDescentGain.gain.exponentialRampToValueAtTime(0.14, t0 + 1.0);
  _bossDescentGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5);
  _bossDescentOsc.connect(_bossDescentGain);
  _bossDescentGain.connect(out);
  _bossDescentOsc.start(t0);
  _bossDescentOsc.stop(t0 + 1.55);
}
function sfxBossDescentStop() {
  if (_bossDescentOsc) {
    try { _bossDescentOsc.stop(); } catch(e) {}
    _bossDescentOsc = null;
    _bossDescentGain = null;
  }
}

// === HC-42: HARDCORE SYSTEMS AUDIO FEEDBACK ===

var lastGrazeSfx = 0;

function sfxGraze() {
  var now = typeof globalTime !== 'undefined' ? globalTime : Date.now();
  if (now - lastGrazeSfx < 90) return;
  lastGrazeSfx = now;
  tone({ type:'sine', f:randPitch(3200, 0.03), dur:0.015, vol:VOL.ui * 0.28, attack:0.001, decay:0.025 });
}

function sfxComboBreak() {
  noise({ dur:0.06, vol:VOL.hit * 0.55, attack:0.002, decay:0.07, hp:180, lp:900 });
  tone({ type:'square', f:randPitch(180), f2:randPitch(80), dur:0.08, vol:VOL.hit * 0.45, attack:0.003, decay:0.10 });
}

function sfxRankUp() {
  var notes = [70, 75, 79];
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'square', f:midiToFreq(m), dur:0.05, vol:VOL.power * 0.40, attack:0.002, decay:0.06 });
    }, i * 50);
  });
}

function sfxRankDown() {
  var notes = [79, 72, 67];
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'triangle', f:midiToFreq(m), dur:0.06, vol:VOL.power * 0.35, attack:0.003, decay:0.07 });
    }, i * 55);
  });
}

// === MUSICAL HELPERS ===
function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// C minor pentatonic (C, Eb, F, G, Bb) spanning C4(60) to C6(84)
var PENTATONIC = [60, 63, 65, 67, 70, 72, 75, 77, 79, 82, 84];
var PENTATONIC_LEN = 5;

// === MEDAL SFX v2 (musical) ===
var lastMedalPickupSfx = 0;

function sfxMedalPickup(chain) {
  var now = typeof globalTime !== 'undefined' ? globalTime : Date.now();
  if (now - lastMedalPickupSfx < 70) return;
  lastMedalPickupSfx = now;

  var idx = (chain || 0) % PENTATONIC_LEN;
  var oct = Math.min(Math.floor((chain || 0) / 15), 2);
  var freq = midiToFreq(PENTATONIC[idx] + oct * 12);

  tone({ type:'sine', f:freq, f2:freq * 1.012, dur:0.04, vol:VOL.ui * 1.1, attack:0.002, decay:0.06 });
}

function sfxMedalTierUp() {
  var notes = [72, 75, 79]; // C5, Eb5, G5
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'square', f:midiToFreq(m), dur:0.06, vol:VOL.power * 0.55, attack:0.003, decay:0.07 });
    }, i * 65);
  });
}

function sfxMedalDown() {
  var notes = [67, 63, 60]; // G4, Eb4, C4
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'triangle', f:midiToFreq(m), dur:0.10, vol:VOL.ui * 0.5, attack:0.005, decay:0.12 });
    }, i * 85);
  });
}

function sfxPerfectWave() {
  var notes = [72, 77, 79, 84]; // C5, F5, G5, C6
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'square', f:midiToFreq(m), dur:0.08, vol:VOL.power * 0.75, attack:0.003, decay:0.09 });
    }, i * 95);
  });
}

function sfxBossMedalRain() {
  var notes = [84, 79, 75, 72]; // C6, G5, Eb5, C5
  notes.forEach(function(m, i) {
    setTimeout(function() {
      tone({ type:'sine', f:midiToFreq(m), dur:0.05, vol:VOL.power * 0.35, attack:0.002, decay:0.06 });
    }, i * 60);
  });
}

function sfxFeverActivated() {
  var notes = [60, 63, 65, 67, 70, 72]; // C4→C5 minor pentatonic
  notes.forEach(function(m, i) {
    setTimeout(function() {
      var oscType = i >= 4 ? 'sine' : 'square';
      tone({ type:oscType, f:midiToFreq(m), dur:0.06, vol:VOL.power * 0.65, attack:0.003, decay:0.07 });
    }, i * 75);
  });
}

// Unlock audio only from trusted user gestures
function _audioGestureUnlock() {
  if (audioUnlocked) return;
  ensureAudioUnlocked();
  if (audioUnlocked) {
    document.removeEventListener('pointerdown', _audioGestureUnlock);
    document.removeEventListener('touchstart', _audioGestureUnlock);
    document.removeEventListener('keydown', _audioGestureUnlock);
    document.removeEventListener('click', _audioGestureUnlock);
  }
}

document.addEventListener('pointerdown', _audioGestureUnlock);
document.addEventListener('touchstart', _audioGestureUnlock);
document.addEventListener('keydown', _audioGestureUnlock);
document.addEventListener('click', _audioGestureUnlock);
