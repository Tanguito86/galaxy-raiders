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
  if (typeof p !== 'number' || !isFinite(p) || p <= 0) return 1.00;
  var scale = 1.00 / p;
  var cfg = _hardcoreRhythmReadConfig();
  var minScale = (typeof cfg.wavePauseMinScale === 'number' && isFinite(cfg.wavePauseMinScale)) ? cfg.wavePauseMinScale : 0.75;
  if (typeof minScale !== 'number' || !isFinite(minScale)) minScale = 0.75;
  return Math.max(minScale, Math.min(1.00, scale));
}

function _hardcoreRhythmIntroMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  if (typeof p !== 'number' || !isFinite(p) || p <= 0) return 1.00;
  var scale = 1.00 / p;
  var cfg = _hardcoreRhythmReadConfig();
  var minScale = (typeof cfg.introMinScale === 'number' && isFinite(cfg.introMinScale)) ? cfg.introMinScale : 0.72;
  if (typeof minScale !== 'number' || !isFinite(minScale)) minScale = 0.72;
  return Math.max(minScale, Math.min(1.00, scale));
}

function _hardcoreRhythmEntryDelayMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  if (typeof p !== 'number' || !isFinite(p) || p <= 0) return 1.00;
  var scale = 1.00 / p;
  var cfg = _hardcoreRhythmReadConfig();
  var minScale = (typeof cfg.entryDelayMinScale === 'number' && isFinite(cfg.entryDelayMinScale)) ? cfg.entryDelayMinScale : 0.70;
  if (typeof minScale !== 'number' || !isFinite(minScale)) minScale = 0.70;
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
  if (typeof baseMs !== 'number' || !isFinite(baseMs) || baseMs <= 0) return (typeof baseMs === 'number') ? baseMs : 0;
  if (!window.isHardcoreRhythmActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmWavePauseMultiplier());
};

window.getHardcoreRhythmIntro = function(baseMs) {
  if (typeof baseMs !== 'number' || !isFinite(baseMs) || baseMs <= 0) return (typeof baseMs === 'number') ? baseMs : 0;
  if (!window.isHardcoreRhythmActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmIntroMultiplier());
};

window.getHardcoreRhythmEntryDelay = function(baseMs) {
  if (typeof baseMs !== 'number' || !isFinite(baseMs) || baseMs <= 0) return (typeof baseMs === 'number') ? baseMs : 0;
  if (!window.isHardcoreRhythmActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmEntryDelayMultiplier());
};

window.getHardcoreRhythmState = function() {
  var active = window.isHardcoreRhythmActive();
  var wp = active ? _hardcoreRhythmWavePauseMultiplier() : 1.00;
  var im = active ? _hardcoreRhythmIntroMultiplier() : 1.00;
  var ed = active ? _hardcoreRhythmEntryDelayMultiplier() : 1.00;
  if (typeof wp !== 'number' || !isFinite(wp)) wp = 1.00;
  if (typeof im !== 'number' || !isFinite(im)) im = 1.00;
  if (typeof ed !== 'number' || !isFinite(ed)) ed = 1.00;
  return {
    active: active,
    wavePauseScale: Number(wp.toFixed(2)),
    introScale: Number(im.toFixed(2)),
    entryDelayScale: Number(ed.toFixed(2))
  };
};
