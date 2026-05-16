// ====================================
// GALAXY RAIDERS - hardcore-rhythm.js
// HC-78/79: Stage Pressure & Wave Rhythm Pass
// ====================================

function _hardcoreRhythmReadConfig() {
  if (typeof getRhythmConfig === 'function') return getRhythmConfig();
  return { enabled: true, wavePauseMinScale: 0.75, introMinScale: 0.72, entryDelayMinScale: 0.70 };
}

function _hardcoreRhythmWavePauseMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  var scale = 1.00 / p;
  var cfg = _hardcoreRhythmReadConfig();
  var minScale = (typeof cfg.wavePauseMinScale === 'number') ? cfg.wavePauseMinScale : 0.75;
  return Math.max(minScale, Math.min(1.00, scale));
}

function _hardcoreRhythmIntroMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  var scale = 1.00 / p;
  var cfg = _hardcoreRhythmReadConfig();
  var minScale = (typeof cfg.introMinScale === 'number') ? cfg.introMinScale : 0.72;
  return Math.max(minScale, Math.min(1.00, scale));
}

function _hardcoreRhythmEntryDelayMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  var scale = 1.00 / p;
  var cfg = _hardcoreRhythmReadConfig();
  var minScale = (typeof cfg.entryDelayMinScale === 'number') ? cfg.entryDelayMinScale : 0.70;
  return Math.max(minScale, Math.min(1.00, scale));
}

// ============================================================
// GLOBAL HELPERS
// ============================================================

window.isHardcoreRhythmActive = function() {
  if (typeof isHardcoreEnabled !== 'function' || !isHardcoreEnabled()) return false;
  if (typeof window.isHardcoreRankActive !== 'function' || !window.isHardcoreRankActive()) return false;
  if (typeof window.isHardcorePressureActive !== 'function' || !window.isHardcorePressureActive()) return false;
  var cfg = _hardcoreRhythmReadConfig();
  return !!(cfg.enabled);
};

window.getHardcoreRhythmWavePause = function(baseMs) {
  if (!window.isHardcoreRhythmActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmWavePauseMultiplier());
};

window.getHardcoreRhythmIntro = function(baseMs) {
  if (!window.isHardcoreRhythmActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmIntroMultiplier());
};

window.getHardcoreRhythmEntryDelay = function(baseMs) {
  if (!window.isHardcoreRhythmActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmEntryDelayMultiplier());
};

window.getHardcoreRhythmState = function() {
  var active = window.isHardcoreRhythmActive();
  return {
    active: active,
    wavePauseScale: active ? Number(_hardcoreRhythmWavePauseMultiplier().toFixed(2)) : 1.00,
    introScale: active ? Number(_hardcoreRhythmIntroMultiplier().toFixed(2)) : 1.00,
    entryDelayScale: active ? Number(_hardcoreRhythmEntryDelayMultiplier().toFixed(2)) : 1.00
  };
};
