// ====================================
// GALAXY RAIDERS - hardcore-rank.js
// HC-25: Dynamic Rank Foundation
// Sistema de rank dinamico hardcore
// ====================================

// Estado interno del rank
var _hardcoreRank = {
  value: 0,
  level: 1,
  multiplier: 1.00,
  lastReason: '',
  lastChangeAt: 0
};

// Lectura segura de la config de rank desde GALAXY_CONFIG
function _hardcoreRankReadConfig() {
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return { enabled: false, baseLevel: 0 };
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : { enabled: false, baseLevel: 0 };
  return {
    enabled: !!(r.enabled),
    baseLevel: (typeof r.baseLevel === 'number') ? r.baseLevel : 0
  };
}

function _hardcoreRankIsEnabled() {
  return _hardcoreRankReadConfig().enabled;
}

// Calcular nivel a partir del valor (0-100)
function _hardcoreRankCalcLevel(val) {
  if (typeof val !== 'number' || val <= 0) return 1;
  if (val >= 100) return 5;
  if (val < 20) return 1;
  if (val < 40) return 2;
  if (val < 60) return 3;
  if (val < 80) return 4;
  return 5;
}

// Calcular multiplicador a partir del nivel
function _hardcoreRankCalcMultiplier(lvl) {
  var map = [0, 1.00, 1.12, 1.25, 1.37, 1.50];
  var idx = Math.min(5, Math.max(1, (typeof lvl === 'number') ? lvl : 1));
  return map[idx];
}

// Recalcular nivel y multiplicador desde el valor actual
function _hardcoreRankRecalc() {
  _hardcoreRank.value = Math.max(0, Math.min(100, _hardcoreRank.value));
  _hardcoreRank.level = Math.max(1, Math.min(5, _hardcoreRankCalcLevel(_hardcoreRank.value)));
  _hardcoreRank.multiplier = Math.max(1.00, Math.min(1.50, _hardcoreRankCalcMultiplier(_hardcoreRank.level)));
}

// ============================================================
// HELPERS GLOBALES SEGUROS
// ============================================================

window.getHardcoreRankState = function() {
  return {
    value: _hardcoreRank.value,
    level: _hardcoreRank.level,
    multiplier: _hardcoreRank.multiplier,
    lastReason: _hardcoreRank.lastReason,
    lastChangeAt: _hardcoreRank.lastChangeAt
  };
};

window.getHardcoreRankValue = function() {
  return _hardcoreRank.value;
};

window.getHardcoreRankLevel = function() {
  return _hardcoreRank.level;
};

window.getHardcoreRankMultiplier = function() {
  return _hardcoreRank.multiplier;
};

window.isHardcoreRankActive = function() {
  if (typeof isHardcoreEnabled !== 'function') return false;
  if (!isHardcoreEnabled()) return false;
  return _hardcoreRankIsEnabled();
};

window.addHardcoreRank = function(amount, reason) {
  if (!_hardcoreRankIsEnabled()) return;
  var amt = (typeof amount === 'number' && amount > 0) ? amount : 0;
  if (amt <= 0) return;
  _hardcoreRank.value = Math.min(100, _hardcoreRank.value + amt);
  if (reason && typeof reason === 'string') _hardcoreRank.lastReason = reason;
  _hardcoreRank.lastChangeAt = Date.now();
  _hardcoreRankRecalc();
};

window.reduceHardcoreRank = function(amount, reason) {
  if (!_hardcoreRankIsEnabled()) return;
  var amt = (typeof amount === 'number' && amount > 0) ? amount : 0;
  if (amt <= 0) return;
  _hardcoreRank.value = Math.max(0, _hardcoreRank.value - amt);
  if (reason && typeof reason === 'string') _hardcoreRank.lastReason = reason;
  _hardcoreRank.lastChangeAt = Date.now();
  _hardcoreRankRecalc();
};

window.resetHardcoreRank = function() {
  _hardcoreRank.value = 0;
  _hardcoreRank.level = 1;
  _hardcoreRank.multiplier = 1.00;
  _hardcoreRank.lastReason = '';
  _hardcoreRank.lastChangeAt = 0;
};

// ============================================================
// HC-27: MODIFICADORES DE DIFICULTAD POR RANK
// ============================================================

window.getHardcoreRankBulletSpeedMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;
  var m = _hardcoreRank.multiplier;
  if (typeof m !== 'number') return 1.00;
  return 1.00 + (m - 1.00) * 0.24;
};

window.getHardcoreRankCooldownMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;
  var m = _hardcoreRank.multiplier;
  if (typeof m !== 'number') return 1.00;
  return 1.00 - (m - 1.00) * 0.24;
};

window.getHardcoreRankPatternIntensity = function() {
  if (!_hardcoreRankIsEnabled()) return 1;
  var m = _hardcoreRank.multiplier;
  if (typeof m !== 'number') return 1;
  var val = Math.round(1 + (m - 1.00) * 2.0);
  return Math.max(1, Math.min(2, val));
};

window.getHardcoreRankScoreMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;
  var lvl = _hardcoreRank.level;
  if (typeof lvl !== 'number') return 1.00;
  var map = [0, 1.00, 1.10, 1.20, 1.35, 1.50];
  var idx = Math.min(5, Math.max(1, lvl));
  return map[idx];
};

// ============================================================
// HUD DEBUG OPCIONAL
// ============================================================

function drawHardcoreRankDebug(ctx) {
  if (!ctx) return;
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return;
  var dbg = (cfg.debug && typeof cfg.debug === 'object') ? cfg.debug : {};
  if (!dbg.showRank) return;
  if (typeof H === 'undefined') return;

  var bulletMult = (typeof window.getHardcoreRankBulletSpeedMultiplier === 'function')
    ? window.getHardcoreRankBulletSpeedMultiplier() : 1.00;
  var cdMult = (typeof window.getHardcoreRankCooldownMultiplier === 'function')
    ? window.getHardcoreRankCooldownMultiplier() : 1.00;
  var scoreMult = (typeof window.getHardcoreRankScoreMultiplier === 'function')
    ? window.getHardcoreRankScoreMultiplier() : 1.00;
  var reason = (_hardcoreRank.lastReason && typeof _hardcoreRank.lastReason === 'string' && _hardcoreRank.lastReason.length > 0)
    ? _hardcoreRank.lastReason : '-';

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '6px "Press Start 2P"';

  ctx.fillStyle = 'rgba(255,165,0,0.88)';
  ctx.fillText('RANK L' + _hardcoreRank.level, 6, H - 69);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.fillText('VALUE ' + _hardcoreRank.value.toFixed(1), 6, H - 58);

  ctx.fillStyle = 'rgba(255,200,100,0.72)';
  ctx.fillText('BULLET x' + bulletMult.toFixed(2), 6, H - 47);

  ctx.fillStyle = 'rgba(100,200,255,0.72)';
  ctx.fillText('CD x' + cdMult.toFixed(2), 6, H - 36);

  ctx.fillStyle = 'rgba(255,255,150,0.78)';
  ctx.fillText('SCORE x' + scoreMult.toFixed(2), 6, H - 25);

  ctx.fillStyle = 'rgba(200,200,200,0.55)';
  ctx.fillText('LAST ' + reason, 6, H - 14);

  ctx.restore();
}
