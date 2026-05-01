// =====================
// GALAXY RAIDERS - audio.js
// =====================

// === AUDIO SFX 80s (sin archivos) ===
let AC = null;
let masterGain = null;
let sfxEnabled = true;
let sfxVol = 0.35;

function initAudio() {
  if (AC) return;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = AC.createGain();
    masterGain.gain.value = sfxVol;
    masterGain.connect(AC.destination);
  } catch (e) {
    console.error('AudioContext error:', e);
  }
}

function ensureAudioUnlocked() {
  if (!AC) initAudio();
  if (AC && AC.state === 'suspended') AC.resume();
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

function tone({ type='square', f=440, f2=null, dur=0.08, vol=0.6, attack=0.003, decay=0.06 }) {
  if (!sfxEnabled || isMuted) return;
  ensureAudioUnlocked();
  const t0 = AC.currentTime;

  const o = AC.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);

  const g = AC.createGain();
  g.gain.value = 0.0001;

  o.connect(g);
  g.connect(masterGain);

  envGain(g, t0, attack, decay);
  o.start(t0);
  o.stop(t0 + attack + decay + 0.02);
}

function noise({ dur=0.12, vol=0.5, attack=0.002, decay=0.10, hp=800, lp=8000 }) {
  if (!sfxEnabled || isMuted) return;
  ensureAudioUnlocked();
  const t0 = AC.currentTime;

  const bufferSize = Math.max(1, Math.floor(AC.sampleRate * dur));
  const buffer = AC.createBuffer(1, bufferSize, AC.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);

  const src = AC.createBufferSource();
  src.buffer = buffer;

  const hpF = AC.createBiquadFilter();
  hpF.type = 'highpass';
  hpF.frequency.setValueAtTime(hp, t0);

  const lpF = AC.createBiquadFilter();
  lpF.type = 'lowpass';
  lpF.frequency.setValueAtTime(lp, t0);

  const g = AC.createGain();
  g.gain.value = 0.0001;

  src.connect(hpF);
  hpF.connect(lpF);
  lpF.connect(g);
  g.connect(masterGain);

  envGain(g, t0, attack, decay);
  src.start(t0);
  src.stop(t0 + attack + decay + 0.02);
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
  tone({ type:'square', f:randPitch(520), f2:randPitch(420), dur:0.04, vol:VOL.hit, attack:0.002, decay:0.05 });
}

function sfxEnemyKill() {
  tone({ type:'sawtooth', f:randPitch(220), f2:randPitch(110), dur:0.08, vol:VOL.kill, attack:0.002, decay:0.10 });
  noise({ dur:0.09, vol:VOL.hit, attack:0.002, decay:0.10, hp:500, lp:6000 });
}

function sfxBigExplosion() {
  const mix = (typeof MUSIC_DUCKING !== 'undefined' && MUSIC_DUCKING.bigExplosion)
    ? MUSIC_DUCKING.bigExplosion
    : { level: 0.38, ms: 240 };
  duck(mix.ms, mix.level);
  tone({ type:'sine', f:randPitch(80), f2:randPitch(40), dur:0.15, vol:VOL.big, attack:0.003, decay:0.15 });
  noise({ dur:0.18, vol:VOL.big * 0.8, attack:0.002, decay:0.18, hp:120, lp:2000 });
}

function sfxPowerUp() {
  tone({ type:'square', f:randPitch(660), f2:randPitch(990), dur:0.08, vol:VOL.power, attack:0.002, decay:0.10 });
  setTimeout(() => tone({ type:'square', f:randPitch(880), f2:randPitch(1320), dur:0.07, vol:VOL.power * 0.8, attack:0.002, decay:0.09 }), 60);
}

function sfxPlayerHit() {
  const mix = (typeof MUSIC_DUCKING !== 'undefined' && MUSIC_DUCKING.playerHit)
    ? MUSIC_DUCKING.playerHit
    : { level: 0.50, ms: 170 };
  duck(mix.ms, mix.level);
  tone({ type:'square', f:randPitch(180), f2:randPitch(120), dur:0.10, vol:VOL.playerHit, attack:0.002, decay:0.12 });
  noise({ dur:0.08, vol:VOL.hit, attack:0.002, decay:0.10, hp:200, lp:1800 });
}

function sfxBossWarning() {
  const mix = (typeof MUSIC_DUCKING !== 'undefined' && MUSIC_DUCKING.bossWarning)
    ? MUSIC_DUCKING.bossWarning
    : { level: 0.58, ms: 150 };
  duck(mix.ms, mix.level);
  tone({ type:'square', f:880, dur:0.06, vol:VOL.hit, attack:0.002, decay:0.08 });
  setTimeout(() => tone({ type:'square', f:880, dur:0.06, vol:VOL.hit, attack:0.002, decay:0.08 }), 120);
}

function sfxImperialTelegraph() {
  tone({ type:'square', f:randPitch(420, 0.02), f2:randPitch(520, 0.02), dur:0.05, vol:VOL.hit * 0.9, attack:0.002, decay:0.06 });
  setTimeout(() => tone({ type:'square', f:randPitch(560, 0.02), f2:randPitch(690, 0.02), dur:0.05, vol:VOL.hit, attack:0.002, decay:0.06 }), 55);
}

function sfxUIClick() {
  tone({ type:'square', f:randPitch(1040), f2:randPitch(920), dur:0.02, vol:VOL.ui, attack:0.001, decay:0.03 });
}

function sfxConfirm() {
  tone({ type:'square', f:randPitch(660), f2:randPitch(990), dur:0.05, vol:VOL.hit, attack:0.002, decay:0.06 });
}

// Desbloquear audio con primer toque
document.addEventListener('pointerdown', ensureAudioUnlocked, { once: true });
