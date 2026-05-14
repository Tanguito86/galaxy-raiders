// ====================================
// GALAXY RAIDERS - hardcore-pressure.js
// HC-43: Enemy Wave Pressure Director
// ====================================

var _hardcorePressure = {
  level: 'NORMAL',
  multiplier: 1.00
};

function _hardcorePressureRecalc() {
  var rankLevel = (typeof window.getHardcoreRankLevel === 'function')
    ? window.getHardcoreRankLevel()
    : 1;

  switch (rankLevel) {
    case 1:
      _hardcorePressure.level = 'LOW';
      _hardcorePressure.multiplier = 1.00;
      break;
    case 2:
    case 3:
      _hardcorePressure.level = 'NORMAL';
      _hardcorePressure.multiplier = 1.06;
      break;
    case 4:
      _hardcorePressure.level = 'HIGH';
      _hardcorePressure.multiplier = 1.12;
      break;
    case 5:
      _hardcorePressure.level = 'MAX';
      _hardcorePressure.multiplier = 1.18;
      break;
    default:
      _hardcorePressure.level = 'NORMAL';
      _hardcorePressure.multiplier = 1.00;
      break;
  }
}

function _hardcorePressureActive() {
  if (typeof isHardcoreEnabled === 'function' && !isHardcoreEnabled()) return false;
  if (typeof window.isHardcoreRankActive === 'function' && !window.isHardcoreRankActive()) return false;
  return true;
}

// ============================================================
// HELPERS GLOBALES
// ============================================================

window.getHardcorePressureState = function() {
  if (!_hardcorePressureActive()) {
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
  return window.getHardcorePressureState().multiplier;
};

window.getHardcorePressureCooldownScale = function() {
  var mult = window.getHardcorePressureMultiplier();
  if (typeof mult !== 'number' || mult <= 0) return 1.00;
  return Math.max(0.82, 1.00 / mult);
};
