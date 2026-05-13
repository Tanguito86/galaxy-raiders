// ====================================
// GALAXY RAIDERS - hardcore-combo.js
// HC-30: Combo System Foundation
// ====================================

var _hardcoreCombo = {
  count: 0,
  multiplier: 1.00,
  lastReason: '',
  lastChangeAt: 0,
  activeUntil: 0
};

function _hardcoreComboReadConfig() {
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return { enabled: false, timeoutMs: 2500, maxMultiplier: 2.0 };
  var c = (cfg.combo && typeof cfg.combo === 'object') ? cfg.combo : { enabled: false, timeoutMs: 2500, maxMultiplier: 2.0 };
  return {
    enabled: !!(c.enabled),
    timeoutMs: (typeof c.timeoutMs === 'number') ? c.timeoutMs : 2500,
    maxMultiplier: (typeof c.maxMultiplier === 'number') ? c.maxMultiplier : 2.0
  };
}

function _hardcoreComboIsEnabled() {
  return _hardcoreComboReadConfig().enabled;
}

function _hardcoreComboCalcMultiplier(count) {
  if (typeof count !== 'number' || count < 0) return 1.00;
  if (count < 5) return 1.00;
  if (count < 10) return 1.10;
  if (count < 20) return 1.25;
  if (count < 40) return 1.50;
  return 2.00;
}

function _hardcoreComboRefreshWindow() {
  var cfg = _hardcoreComboReadConfig();
  _hardcoreCombo.activeUntil = Date.now() + cfg.timeoutMs;
}

function _hardcoreComboRecalc() {
  _hardcoreCombo.multiplier = _hardcoreComboCalcMultiplier(_hardcoreCombo.count);
}

function _hardcoreComboCheckTimeout() {
  if (_hardcoreCombo.count > 0 && Date.now() > _hardcoreCombo.activeUntil) {
    _hardcoreCombo.count = 0;
    _hardcoreCombo.multiplier = 1.00;
    _hardcoreCombo.lastReason = 'timeout';
    _hardcoreCombo.lastChangeAt = Date.now();
    _hardcoreCombo.activeUntil = 0;
  }
}

// ============================================================
// HELPERS GLOBALES
// ============================================================

window.getHardcoreComboState = function() {
  _hardcoreComboCheckTimeout();
  return {
    count: _hardcoreCombo.count,
    multiplier: _hardcoreCombo.multiplier,
    lastReason: _hardcoreCombo.lastReason,
    lastChangeAt: _hardcoreCombo.lastChangeAt,
    activeUntil: _hardcoreCombo.activeUntil
  };
};

window.getHardcoreComboCount = function() {
  _hardcoreComboCheckTimeout();
  return _hardcoreCombo.count;
};

window.getHardcoreComboMultiplier = function() {
  _hardcoreComboCheckTimeout();
  return _hardcoreCombo.multiplier;
};

window.addHardcoreCombo = function(reason) {
  if (!_hardcoreComboIsEnabled()) return;
  _hardcoreComboCheckTimeout();
  _hardcoreCombo.count++;
  _hardcoreComboRefreshWindow();
  if (reason && typeof reason === 'string') _hardcoreCombo.lastReason = reason;
  _hardcoreCombo.lastChangeAt = Date.now();
  _hardcoreComboRecalc();
};

window.refreshHardcoreComboWindow = function() {
  if (!_hardcoreComboIsEnabled()) return;
  _hardcoreComboCheckTimeout();
  if (_hardcoreCombo.count > 0) {
    _hardcoreComboRefreshWindow();
  }
};

window.breakHardcoreCombo = function(reason) {
  if (!_hardcoreComboIsEnabled()) return;
  if (_hardcoreCombo.count === 0) return;
  _hardcoreCombo.count = 0;
  _hardcoreCombo.multiplier = 1.00;
  _hardcoreCombo.lastChangeAt = Date.now();
  if (reason && typeof reason === 'string') _hardcoreCombo.lastReason = reason;
  _hardcoreCombo.activeUntil = 0;
};

window.resetHardcoreCombo = function() {
  _hardcoreCombo.count = 0;
  _hardcoreCombo.multiplier = 1.00;
  _hardcoreCombo.lastReason = '';
  _hardcoreCombo.lastChangeAt = 0;
  _hardcoreCombo.activeUntil = 0;
};

// ============================================================
// HUD
// ============================================================

window.drawHardcoreComboHUD = function(ctx) {
  if (!ctx) return;
  _hardcoreComboCheckTimeout();
  if (_hardcoreCombo.count <= 0) return;
  if (typeof H === 'undefined') return;

  var x = 128;
  var y = 56;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  ctx.font = '6px "Press Start 2P"';
  ctx.fillStyle = 'rgba(255,120,200,0.82)';
  ctx.fillText('COMBO', 6, y);

  ctx.font = '7px "Press Start 2P"';
  ctx.fillStyle = '#fff';
  ctx.fillText(_hardcoreCombo.count + ' x' + _hardcoreCombo.multiplier.toFixed(2), 6, y + 12);

  ctx.restore();
};
