// =====================
// GALAXY RAIDERS - audio-bus.js
// HC-AUD-01: Lightweight mixer bus foundation
// Load AFTER audio.js, BEFORE music.js
// =====================

var audioBuses = null;

function createAudioBuses() {
  if (audioBuses) return audioBuses;
  if (!AC) return null;

  try {
    // HC-AUD-stabilization: transparent safety limiter before destination
    var _limiter = null;
    try {
      _limiter = AC.createDynamicsCompressor();
      _limiter.threshold.setValueAtTime(-4, AC.currentTime);
      _limiter.knee.setValueAtTime(0, AC.currentTime);
      _limiter.ratio.setValueAtTime(12, AC.currentTime);
      _limiter.attack.setValueAtTime(0.003, AC.currentTime);
      _limiter.release.setValueAtTime(0.050, AC.currentTime);
      _limiter.connect(AC.destination);
    } catch(e) { _limiter = null; }

    var master = AC.createGain();
    master.gain.value = 1.0;
    master.connect(_limiter || AC.destination);

    var music = AC.createGain();
    music.gain.value = 1.0;
    music.connect(master);

    var sfx = AC.createGain();
    sfx.gain.value = 1.0;
    sfx.connect(master);

    var ui = AC.createGain();
    ui.gain.value = 1.0;
    ui.connect(master);

    var boss = AC.createGain();
    boss.gain.value = 1.0;
    boss.connect(master);

    var ambience = AC.createGain();
    ambience.gain.value = 1.0;
    ambience.connect(master);

    audioBuses = {
      master: master,
      music: music,
      sfx: sfx,
      ui: ui,
      boss: boss,
      ambience: ambience
    };

    return audioBuses;
  } catch (e) {
    return null;
  }
}

function ensureAudioBuses() {
  if (!audioBuses) createAudioBuses();
  return !!audioBuses;
}

// =====================
// BUS VOLUME CONTROL
// =====================

function setBusVolume(busName, value, rampMs) {
  if (!ensureAudioBuses()) return;
  var bus = audioBuses[busName];
  if (!bus) return;
  var t = AC.currentTime;
  var target = Math.max(0, Math.min(2.0, Number(value) || 0));
  if (rampMs && rampMs > 0) {
    bus.gain.cancelScheduledValues(t);
    bus.gain.setValueAtTime(bus.gain.value, t);
    bus.gain.linearRampToValueAtTime(target, t + rampMs / 1000);
  } else {
    bus.gain.value = target;
  }
}

function getBusVolume(busName) {
  if (!audioBuses || !audioBuses[busName]) return 1.0;
  return audioBuses[busName].gain.value;
}

function setMasterMute(muted) {
  if (!ensureAudioBuses()) return;
  var t = AC.currentTime;
  var target = muted ? 0.0001 : 1.0;
  audioBuses.master.gain.cancelScheduledValues(t);
  audioBuses.master.gain.setValueAtTime(audioBuses.master.gain.value, t);
  audioBuses.master.gain.linearRampToValueAtTime(target, t + 0.020);
}

// =====================
// SFX ROUTING HELPERS
// =====================

function sfxBusNode() {
  if (audioBuses && audioBuses.sfx) return audioBuses.sfx;
  return masterGain || AC.destination;
}

function bossBusNode() {
  if (audioBuses && audioBuses.boss) return audioBuses.boss;
  return sfxBusNode();
}

function uiBusNode() {
  if (audioBuses && audioBuses.ui) return audioBuses.ui;
  return sfxBusNode();
}

function ambienceBusNode() {
  if (audioBuses && audioBuses.ambience) return audioBuses.ambience;
  return sfxBusNode();
}

// =====================
// LIGHTWEIGHT SPAM GUARD
// =====================

var _sfxCooldowns = {};

function sfxGuard(key, minIntervalMs) {
  var now = AC ? AC.currentTime * 1000 : Date.now();
  var last = _sfxCooldowns[key] || 0;
  if (now - last < (minIntervalMs || 50)) return false;
  _sfxCooldowns[key] = now;
  return true;
}

// =====================
// POLYPHONY LIMITER
// =====================

var _activeVoiceCount = 0;
var _maxVoices = 96;

function voiceStart() {
  if (_activeVoiceCount >= _maxVoices) return false;
  _activeVoiceCount++;
  return true;
}

function voiceEnd() {
  _activeVoiceCount = Math.max(0, _activeVoiceCount - 1);
}

// =====================
// REACTIVE BUS DUCKING
// =====================

var _duckState = {
  music: { until: 0, level: 1.0, restore: 1.0 },
  sfx: { until: 0, level: 1.0, restore: 1.0 },
  ambience: { until: 0, level: 1.0, restore: 1.0 }
};

function requestBusDuck(busName, ms, level) {
  if (!ensureAudioBuses()) return;
  if (!_duckState[busName]) return;
  var now = AC.currentTime;
  var duckMs = Math.max(0, Number(ms) || 160);
  var duckLevel = Math.max(0.05, Math.min(1.0, Number(level) || 0.5));
  var d = _duckState[busName];
  if (now >= d.until) {
    d.level = 1.0;
    d.restore = audioBuses[busName].gain.value; // snapshot pre-duck gain
  }
  d.level = Math.min(d.level, duckLevel);
  d.until = Math.max(d.until, now + duckMs / 1000);
  _applyBusDuck(busName);
}

function _applyBusDuck(busName) {
  if (!audioBuses || !audioBuses[busName]) return;
  var d = _duckState[busName];
  var now = AC.currentTime;
  var ducking = now < d.until;
  var target = ducking ? d.level : d.restore; // restore to pre-duck gain
  if (!ducking) { d.level = 1.0; d.restore = 1.0; }
  var bus = audioBuses[busName];
  bus.gain.cancelScheduledValues(now);
  bus.gain.setValueAtTime(bus.gain.value, now);
  bus.gain.linearRampToValueAtTime(target, now + (ducking ? 0.010 : 0.150));
}

function refreshBusDucking() {
  var keys = ['music', 'sfx', 'ambience'];
  for (var i = 0; i < keys.length; i++) {
    _applyBusDuck(keys[i]);
  }
}

// =====================
// OGG MUSIC PLAYER POOL
// =====================

var _oggPool = [];
var _currentOgg = null;

function oggRegister(key, src, loop) {
  if (!key || !src) return;
  // Remove existing slot for this key
  _oggPool = _oggPool.filter(function (s) { return s.key !== key; });
  try {
    var audio = new Audio();
    audio.preload = 'auto';
    audio.loop = !!loop;
    audio.volume = 0;
    audio.src = src;
    audio.load();
    _oggPool.push({ key: key, el: audio, src: src, loop: !!loop });
  } catch (e) {}
}

function oggPlay(key, fadeInMs) {
  oggStop(60);
  for (var i = 0; i < _oggPool.length; i++) {
    if (_oggPool[i].key === key) {
      var el = _oggPool[i].el;
      el.loop = _oggPool[i].loop;
      el.currentTime = 0;
      el.volume = 0;
      var playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }

      if (fadeInMs && fadeInMs > 0) {
        var steps = 20;
        var stepMs = Math.max(10, fadeInMs / steps);
        var stepVol = 1.0 / steps;
        var vol = 0;
        var iv = setInterval(function () {
          vol += stepVol;
          if (vol >= 1.0 || !el || el.paused) {
            if (el) el.volume = 1.0;
            clearInterval(iv);
          } else {
            el.volume = Math.min(1.0, vol);
          }
        }, stepMs);
        el._oggFadeIv = iv;
      } else {
        el.volume = 1.0;
      }
      _currentOgg = el;
      return true;
    }
  }
  return false;
}

function oggStop(fadeOutMs) {
  if (!_currentOgg) return;
  var el = _currentOgg;
  _currentOgg = null;
  if (el._oggFadeIv) { clearInterval(el._oggFadeIv); el._oggFadeIv = null; }

  if (fadeOutMs && fadeOutMs > 0) {
    var startVol = el.volume || 1;
    var steps = 15;
    var stepMs = Math.max(8, fadeOutMs / steps);
    var stepVol = startVol / steps;
    var iv = setInterval(function () {
      startVol -= stepVol;
      if (startVol <= 0.01) {
        el.volume = 0;
        el.pause();
        clearInterval(iv);
      } else {
        el.volume = Math.max(0, startVol);
      }
    }, stepMs);
  } else {
    el.volume = 0;
    el.pause();
  }
}

// =====================
// INIT: Wire existing nodes
// =====================

function wireAudioBuses() {
  if (!AC || !audioBuses) return;
  initAudioBuses();
}

function initAudioBuses() {
  if (!AC || !audioBuses) return;

  // Re-wire existing masterGain (SFX) through sfxBus -> masterBus
  if (typeof masterGain !== 'undefined' && masterGain) {
    try {
      masterGain.disconnect();
      masterGain.connect(audioBuses.sfx);
    } catch (e) { /* node may not be connected yet */ }
  }

  // Re-wire existing musicBusGain through musicBus -> masterBus
  if (typeof musicBusGain !== 'undefined' && musicBusGain) {
    try {
      musicBusGain.disconnect();
      musicBusGain.connect(audioBuses.music);
    } catch (e) { /* node may not be connected yet */ }
  }
}

// =====================
// HC-AUD-02: BUS MIX PRESETS
// =====================

function applyBossFightMix(rampMs) {
  if (!ensureAudioBuses()) return;
  setBusVolume('music', 0.74, rampMs || 400);
  setBusVolume('boss', 1.0, rampMs || 300);
  setBusVolume('ambience', 0.65, rampMs || 500);
  setBusVolume('sfx', 1.0, rampMs || 200);
}

function applyStageMix(rampMs) {
  if (!ensureAudioBuses()) return;
  // Stage: balanced, music present but SFX dominant
  setBusVolume('music', 0.82, rampMs || 500);
  setBusVolume('boss', 1.0, rampMs || 300);
  setBusVolume('ambience', 0.70, rampMs || 500);
  setBusVolume('sfx', 1.0, rampMs || 200);
}

function applyVictoryMix(rampMs) {
  if (!ensureAudioBuses()) return;
  // Victory: music forward, sfx/ambience back
  setBusVolume('music', 0.92, rampMs || 600);
  setBusVolume('sfx', 0.75, rampMs || 400);
  setBusVolume('ambience', 0.50, rampMs || 600);
  setBusVolume('boss', 0.80, rampMs || 400);
}
