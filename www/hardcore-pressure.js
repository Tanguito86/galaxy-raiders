// ====================================
// GALAXY RAIDERS - hardcore-pressure.js
// HC-43/44: Enemy Wave Pressure Director
// ====================================

var _hardcorePressure = {
  level: 'NORMAL',
  multiplier: 1.00
};

function _hardcorePressureReadConfig() {
  if (typeof getPressureConfig === 'function') return getPressureConfig();
  return { enabled: true, minMultiplier: 1.00, maxMultiplier: 1.18, levels: { LOW: 1.00, NORMAL: 1.06, HIGH: 1.12, MAX: 1.18 } };
}

function _hardcorePressureClampMultiplier(val) {
  if (typeof val !== 'number' || !isFinite(val)) return 1.00;
  var cfg = _hardcorePressureReadConfig();
  var min = (typeof cfg.minMultiplier === 'number' && cfg.minMultiplier >= 1.00) ? cfg.minMultiplier : 1.00;
  var max = (typeof cfg.maxMultiplier === 'number' && cfg.maxMultiplier <= 1.18) ? cfg.maxMultiplier : 1.18;
  return Math.max(min, Math.min(max, val));
}

function _hardcorePressureClampCooldownScale(val) {
  if (typeof val !== 'number' || !isFinite(val)) return 1.00;
  var cfg = _hardcorePressureReadConfig();
  var minScale = (typeof cfg.maxMultiplier === 'number') ? 1.00 / cfg.maxMultiplier : 1.00 / 1.18;
  // clamp between 1/maxMultiplier (~0.84) and 1.00
  return Math.max(minScale, Math.min(1.00, val));
}

function _hardcorePressureRecalc() {
  var rankLevel = (typeof window.getHardcoreRankLevel === 'function')
    ? window.getHardcoreRankLevel()
    : 1;

  var cfg = _hardcorePressureReadConfig();
  var levels = (cfg.levels && typeof cfg.levels === 'object') ? cfg.levels : { LOW: 1.00, NORMAL: 1.06, HIGH: 1.12, MAX: 1.18 };

  switch (rankLevel) {
    case 1:
      _hardcorePressure.level = 'LOW';
      _hardcorePressure.multiplier = (typeof levels.LOW === 'number') ? levels.LOW : 1.00;
      break;
    case 2:
    case 3:
      _hardcorePressure.level = 'NORMAL';
      _hardcorePressure.multiplier = (typeof levels.NORMAL === 'number') ? levels.NORMAL : 1.06;
      break;
    case 4:
      _hardcorePressure.level = 'HIGH';
      _hardcorePressure.multiplier = (typeof levels.HIGH === 'number') ? levels.HIGH : 1.12;
      break;
    case 5:
      _hardcorePressure.level = 'MAX';
      _hardcorePressure.multiplier = (typeof levels.MAX === 'number') ? levels.MAX : 1.18;
      break;
    default:
      _hardcorePressure.level = 'NORMAL';
      _hardcorePressure.multiplier = 1.00;
      break;
  }

  _hardcorePressure.multiplier = _hardcorePressureClampMultiplier(_hardcorePressure.multiplier);
}

// ============================================================
// HELPERS GLOBALES
// ============================================================

window.isHardcorePressureActive = function() {
  if (typeof isHardcoreEnabled === 'function' && !isHardcoreEnabled()) return false;
  if (typeof window.isHardcoreRankActive === 'function' && !window.isHardcoreRankActive()) return false;
  var cfg = _hardcorePressureReadConfig();
  return !!(cfg.enabled);
};

window.getHardcorePressureState = function() {
  if (!window.isHardcorePressureActive()) {
    return { level: 'NORMAL', multiplier: 1.00 };
  }
  _hardcorePressureRecalc();
  return {
    level: _hardcorePressure.level,
    multiplier: _hardcorePressure.multiplier
  };
};

window.getHardcorePressureLevel = function() {
  return window.getHardcorePressureState().level;
};

window.getHardcorePressureMultiplier = function() {
  var st = window.getHardcorePressureState();
  return _hardcorePressureClampMultiplier(st.multiplier);
};

window.getHardcorePressureCooldownScale = function() {
  var mult = window.getHardcorePressureMultiplier();
  if (typeof mult !== 'number' || !isFinite(mult) || mult <= 0) return 1.00;
  return _hardcorePressureClampCooldownScale(1.00 / mult);
};
