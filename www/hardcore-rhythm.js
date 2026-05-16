// ====================================
// GALAXY RAIDERS - hardcore-rhythm.js
// HC-78: Stage Pressure & Wave Rhythm Pass
// ====================================

// Returns a multiplier for wave transition pause (levelClearTimer)
// Lower = shorter pause = more pressure
// 1.00 = normal breathing room, ~0.75 = quick transition
function _hardcoreRhythmWavePauseMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  // Invert: higher pressure → shorter pause
  // MAX(1.18) → ~0.80, LOW(1.00) → 1.00
  var scale = 1.00 / p;
  return Math.max(0.75, Math.min(1.00, scale));
}

// Returns a multiplier for set piece intro timer
// Lower = enemies become active faster
function _hardcoreRhythmIntroMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  var scale = 1.00 / p;
  return Math.max(0.72, Math.min(1.00, scale));
}

// Returns a multiplier for enemy entry delays (staggered arrival)
// Lower = enemies arrive faster, less dramatic pacing
function _hardcoreRhythmEntryDelayMultiplier() {
  if (typeof window.getHardcorePressureMultiplier !== 'function') return 1.00;
  var p = window.getHardcorePressureMultiplier();
  var scale = 1.00 / p;
  return Math.max(0.70, Math.min(1.00, scale));
}

// ============================================================
// GLOBAL HELPERS
// ============================================================

window.getHardcoreRhythmWavePause = function(baseMs) {
  if (typeof isHardcoreEnabled !== 'function' || !isHardcoreEnabled()) return baseMs;
  if (typeof window.isHardcoreRankActive !== 'function' || !window.isHardcoreRankActive()) return baseMs;
  if (typeof window.isHardcorePressureActive !== 'function' || !window.isHardcorePressureActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmWavePauseMultiplier());
};

window.getHardcoreRhythmIntro = function(baseMs) {
  if (typeof isHardcoreEnabled !== 'function' || !isHardcoreEnabled()) return baseMs;
  if (typeof window.isHardcoreRankActive !== 'function' || !window.isHardcoreRankActive()) return baseMs;
  if (typeof window.isHardcorePressureActive !== 'function' || !window.isHardcorePressureActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmIntroMultiplier());
};

window.getHardcoreRhythmEntryDelay = function(baseMs) {
  if (typeof isHardcoreEnabled !== 'function' || !isHardcoreEnabled()) return baseMs;
  if (typeof window.isHardcoreRankActive !== 'function' || !window.isHardcoreRankActive()) return baseMs;
  if (typeof window.isHardcorePressureActive !== 'function' || !window.isHardcorePressureActive()) return baseMs;
  return Math.round(baseMs * _hardcoreRhythmEntryDelayMultiplier());
};
