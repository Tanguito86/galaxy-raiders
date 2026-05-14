// ====================================
// GALAXY RAIDERS - hardcore-combo.js
// HC-30: Combo System Foundation
// ====================================

var _hardcoreCombo = {
  count: 0,
  multiplier: 1.00,
  lastReason: '',
  lastChangeAt: 0,
  activeUntil: 0,
  lastBreakAt: 0,
  lastBreakReason: '',
  lastExpiredAt: 0,
  expiredCount: 0,
  expiredMultiplier: 1.00,
  _breakSfxArmed: false
};

function _hardcoreComboReadConfig() {
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return { enabled: false, timeoutMs: 2500, maxMultiplier: 2.0, graceMs: 350, warningMs: 700 };
  var c = (cfg.combo && typeof cfg.combo === 'object') ? cfg.combo : { enabled: false, timeoutMs: 2500, maxMultiplier: 2.0, graceMs: 350, warningMs: 700 };
  return {
    enabled: !!(c.enabled),
    timeoutMs: (typeof c.timeoutMs === 'number') ? c.timeoutMs : 2500,
    maxMultiplier: (typeof c.maxMultiplier === 'number') ? c.maxMultiplier : 2.0,
    graceMs: (typeof c.graceMs === 'number') ? c.graceMs : 350,
    warningMs: (typeof c.warningMs === 'number') ? c.warningMs : 700
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
  var now = Date.now();
  var cfg = _hardcoreComboReadConfig();

  // Combo activo expirado: entrar en grace
  if (_hardcoreCombo.count > 0 && now > _hardcoreCombo.activeUntil) {
    _hardcoreCombo.expiredCount = _hardcoreCombo.count;
    _hardcoreCombo.expiredMultiplier = _hardcoreCombo.multiplier;
    _hardcoreCombo.lastExpiredAt = now;
    _hardcoreCombo.count = 0;
    _hardcoreCombo.multiplier = 1.00;
    _hardcoreCombo.lastReason = 'timeout';
    _hardcoreCombo.lastChangeAt = now;
    _hardcoreCombo.activeUntil = 0;
    _hardcoreCombo._breakSfxArmed = true;
  }

  // Grace expirado: break definitivo
  if (_hardcoreCombo.expiredCount > 0 && now - _hardcoreCombo.lastExpiredAt >= cfg.graceMs) {
    _hardcoreCombo.expiredCount = 0;
    _hardcoreCombo.expiredMultiplier = 1.00;
    _hardcoreCombo.lastBreakAt = now;
    _hardcoreCombo.lastBreakReason = 'timeout';
    if (_hardcoreCombo._breakSfxArmed) {
      _hardcoreCombo._breakSfxArmed = false;
      if (typeof AudioEngine !== 'undefined' && AudioEngine && typeof AudioEngine.playSfx === 'function') {
        AudioEngine.playSfx('comboBreak');
      }
    }
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
    activeUntil: _hardcoreCombo.activeUntil,
    lastBreakAt: _hardcoreCombo.lastBreakAt,
    lastBreakReason: _hardcoreCombo.lastBreakReason,
    lastExpiredAt: _hardcoreCombo.lastExpiredAt,
    expiredCount: _hardcoreCombo.expiredCount,
    expiredMultiplier: _hardcoreCombo.expiredMultiplier
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

  // Grace recovery: kill within grace window recovers combo
  if (_hardcoreCombo.expiredCount > 0 && _hardcoreCombo.count === 0) {
    _hardcoreCombo.count = _hardcoreCombo.expiredCount + 1;
    _hardcoreCombo.expiredCount = 0;
    _hardcoreCombo.expiredMultiplier = 1.00;
    _hardcoreCombo.lastExpiredAt = 0;
    _hardcoreCombo._breakSfxArmed = false;
    _hardcoreComboRefreshWindow();
    if (reason && typeof reason === 'string') _hardcoreCombo.lastReason = reason;
    _hardcoreCombo.lastChangeAt = Date.now();
    _hardcoreComboRecalc();
    return;
  }

  _hardcoreCombo.count++;
  _hardcoreComboRefreshWindow();
  if (reason && typeof reason === 'string') _hardcoreCombo.lastReason = reason;
  _hardcoreCombo.lastChangeAt = Date.now();
  _hardcoreComboRecalc();
};

window.refreshHardcoreComboWindow = function() {
  if (!_hardcoreComboIsEnabled()) return;
  _hardcoreComboCheckTimeout();

  // Grace recovery via graze: restore expired combo without adding count
  if (_hardcoreCombo.expiredCount > 0 && _hardcoreCombo.count === 0) {
    _hardcoreCombo.count = _hardcoreCombo.expiredCount;
    _hardcoreCombo.expiredCount = 0;
    _hardcoreCombo.expiredMultiplier = 1.00;
    _hardcoreCombo.lastExpiredAt = 0;
    _hardcoreCombo._breakSfxArmed = false;
    _hardcoreComboRefreshWindow();
    _hardcoreComboRecalc();
    return;
  }

  if (_hardcoreCombo.count > 0) {
    _hardcoreComboRefreshWindow();
  }
};

window.breakHardcoreCombo = function(reason) {
  if (!_hardcoreComboIsEnabled()) return;
  if (_hardcoreCombo.count === 0 && _hardcoreCombo.expiredCount === 0) return;
  _hardcoreCombo.count = 0;
  _hardcoreCombo.multiplier = 1.00;
  _hardcoreCombo.lastChangeAt = Date.now();
  if (reason && typeof reason === 'string') _hardcoreCombo.lastReason = reason;
  _hardcoreCombo.activeUntil = 0;
  _hardcoreCombo.lastBreakAt = Date.now();
  _hardcoreCombo.lastBreakReason = (reason && typeof reason === 'string') ? reason : 'break';
  _hardcoreCombo.expiredCount = 0;
  _hardcoreCombo.expiredMultiplier = 1.00;
  _hardcoreCombo.lastExpiredAt = 0;
  _hardcoreCombo._breakSfxArmed = false;
  if (typeof AudioEngine !== 'undefined' && AudioEngine && typeof AudioEngine.playSfx === 'function') {
    AudioEngine.playSfx('comboBreak');
  }
};

window.resetHardcoreCombo = function() {
  _hardcoreCombo.count = 0;
  _hardcoreCombo.multiplier = 1.00;
  _hardcoreCombo.lastReason = '';
  _hardcoreCombo.lastChangeAt = 0;
  _hardcoreCombo.activeUntil = 0;
  _hardcoreCombo.lastBreakAt = 0;
  _hardcoreCombo.lastBreakReason = '';
  _hardcoreCombo.lastExpiredAt = 0;
  _hardcoreCombo.expiredCount = 0;
  _hardcoreCombo.expiredMultiplier = 1.00;
  _hardcoreCombo._breakSfxArmed = false;
};

// ============================================================
// HUD
// ============================================================

window.drawHardcoreComboHUD = function(ctx) {
  if (!ctx) return;
  _hardcoreComboCheckTimeout();
  if (typeof H === 'undefined') return;

  var now = Date.now();
  var cfg = _hardcoreComboReadConfig();
  var count = _hardcoreCombo.count;
  var mult = _hardcoreCombo.multiplier;
  var y = 56;
  var breakMs = (count <= 0 && _hardcoreCombo.expiredCount <= 0 && _hardcoreCombo.lastBreakAt > 0) ? now - _hardcoreCombo.lastBreakAt : 9999;
  var showingBreak = count <= 0 && _hardcoreCombo.expiredCount <= 0 && breakMs < 900;
  var inGrace = _hardcoreCombo.expiredCount > 0;
  var comboColor = '#fff';
  var comboAlpha = 1.0;
  var glowAlpha = 0;

  if (!showingBreak && count <= 0 && !inGrace) return;

  if (count >= 40) {
    comboColor = '#ffdd44';
    var gPulse = 0.55 + 0.45 * Math.sin(now * 0.012);
    comboAlpha = gPulse;
    glowAlpha = 0.14 + 0.06 * Math.sin(now * 0.015);
  } else if (count >= 20) {
    comboColor = '#ffaa33';
    var pPulse = 0.65 + 0.35 * Math.sin(now * 0.01);
    comboAlpha = pPulse;
    glowAlpha = 0.06 + 0.04 * Math.sin(now * 0.012);
  } else if (count >= 10) {
    comboColor = '#ff77aa';
    comboAlpha = 0.88;
  }

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';

  if (showingBreak) {
    var fadeAlpha = 1.0 - (breakMs / 900);
    ctx.font = '9px "Press Start 2P"';
    ctx.globalAlpha = fadeAlpha;
    ctx.fillStyle = '#ff3355';
    ctx.fillText('COMBO BREAK', 6, y + 6);
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // Grace state: flash the combo label
  if (inGrace) {
    var gracePulse = 0.45 + 0.55 * Math.sin(now * 0.018);
    ctx.font = '6px "Press Start 2P"';
    ctx.globalAlpha = gracePulse;
    ctx.fillStyle = '#ff8855';
    ctx.fillText('GRACE', 6, y);
    ctx.font = '7px "Press Start 2P"';
    ctx.globalAlpha = gracePulse * 0.8;
    ctx.fillStyle = '#ffcc88';
    ctx.fillText(_hardcoreCombo.expiredCount + ' x' + _hardcoreCombo.expiredMultiplier.toFixed(2), 6, y + 13);

    // Grace timer bar
    var graceRemaining = cfg.graceMs - (now - _hardcoreCombo.lastExpiredAt);
    var graceRatio = Math.min(1, Math.max(0, graceRemaining / cfg.graceMs));
    var barX = 6;
    var barY = y + 22;
    var barW = 52;
    var barH = 3;
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#444';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.globalAlpha = 0.55 + 0.25 * gracePulse;
    ctx.fillStyle = '#f84';
    ctx.fillRect(barX, barY, Math.round(barW * graceRatio), barH);
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  ctx.globalAlpha = comboAlpha;

  // COMBO label
  ctx.font = '6px "Press Start 2P"';
  ctx.fillStyle = 'rgba(200,120,220,0.82)';
  ctx.fillText('COMBO', 6, y);

  // Count + multiplier
  ctx.font = '7px "Press Start 2P"';
  ctx.fillStyle = comboColor;
  ctx.fillText(count + ' x' + mult.toFixed(2), 6, y + 13);

  // Glow overlay (40+)
  if (glowAlpha > 0) {
    ctx.globalAlpha = glowAlpha;
    ctx.fillStyle = '#ffeebb';
    ctx.fillText(count + ' x' + mult.toFixed(2), 6 + 1, y + 13 + 1);
    ctx.fillText(count + ' x' + mult.toFixed(2), 6 - 1, y + 13 - 1);
  }

  // Timer bar
  var barX = 6;
  var barY = y + 22;
  var barW = 52;
  var barH = 3;
  var remaining = Math.max(0, _hardcoreCombo.activeUntil - now);
  var total = cfg.timeoutMs;
  var ratio = Math.min(1, Math.max(0, remaining / total));

  // Warning pulse when below warningMs
  var inWarning = remaining > 0 && remaining < cfg.warningMs;
  var barAlpha = inWarning ? (0.45 + 0.55 * Math.sin(now * 0.025)) : 0.72;

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#444';
  ctx.fillRect(barX, barY, barW, barH);

  ctx.globalAlpha = barAlpha;
  var barColor = inWarning ? '#f80' : (ratio > 0.6 ? '#6f6' : ratio > 0.25 ? '#ff6' : '#f44');
  ctx.fillStyle = barColor;
  ctx.fillRect(barX, barY, Math.round(barW * ratio), barH);

  ctx.globalAlpha = 1;
  ctx.restore();
};

// ============================================================
// HC-36: DEBUG PANEL COMBINADO
// ============================================================

window.drawHardcoreSystemsDebug = function(ctx) {
  if (!ctx) return;
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return;
  var dbg = (cfg.debug && typeof cfg.debug === 'object') ? cfg.debug : {};
  if (!dbg.showHardcoreSystems) return;
  if (typeof H === 'undefined' || typeof W === 'undefined') return;

  var now = Date.now();
  var panelX = W - 118;
  var panelY = 44;
  var panelW = 112;
  var lineH = 10;
  var y = panelY + 8;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.globalAlpha = 0.62;
  ctx.fillStyle = '#000';
  ctx.fillRect(panelX, panelY, panelW, lineH * 11 + 10);
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = '#0ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelW, lineH * 11 + 10);
  ctx.globalAlpha = 1;

  ctx.font = '6px "Press Start 2P"';

  // --- RANK ---
  var rLevel = (typeof window.getHardcoreRankLevel === 'function') ? window.getHardcoreRankLevel() : 1;
  var rValue = (typeof window.getHardcoreRankValue === 'function') ? window.getHardcoreRankValue() : 0;
  var rBullet = (typeof window.getHardcoreRankBulletSpeedMultiplier === 'function') ? window.getHardcoreRankBulletSpeedMultiplier() : 1.00;
  var rCD = (typeof window.getHardcoreRankCooldownMultiplier === 'function') ? window.getHardcoreRankCooldownMultiplier() : 1.00;
  var rScore = (typeof window.getHardcoreRankScoreMultiplier === 'function') ? window.getHardcoreRankScoreMultiplier() : 1.00;

  ctx.fillStyle = '#f80';
  ctx.fillText('RANK L' + rLevel, panelX + 6, y); y += lineH;
  ctx.fillStyle = '#ffb';
  ctx.fillText('VAL ' + rValue.toFixed(1), panelX + 6, y); y += lineH;
  ctx.fillStyle = '#fb8';
  ctx.fillText('BUL x' + rBullet.toFixed(2), panelX + 6, y); y += lineH;
  ctx.fillStyle = '#8bf';
  ctx.fillText('CD  x' + rCD.toFixed(2), panelX + 6, y); y += lineH;
  ctx.fillStyle = '#ff8';
  ctx.fillText('SCR x' + rScore.toFixed(2), panelX + 6, y); y += lineH;

  // --- COMBO ---
  var cCount = (typeof window.getHardcoreComboCount === 'function') ? window.getHardcoreComboCount() : 0;
  var cMult = (typeof window.getHardcoreComboMultiplier === 'function') ? window.getHardcoreComboMultiplier() : 1.00;
  var cState = (typeof window.getHardcoreComboState === 'function') ? window.getHardcoreComboState() : { activeUntil: 0, lastBreakReason: '' };

  y += 4;
  ctx.fillStyle = '#d8f';
  ctx.fillText('COMBO ' + cCount, panelX + 6, y); y += lineH;
  ctx.fillStyle = '#faf';
  ctx.fillText('MULT x' + cMult.toFixed(2), panelX + 6, y); y += lineH;

  // Combo timer bar
  if (cCount > 0 && cState.activeUntil > 0) {
    var remaining = Math.max(0, cState.activeUntil - now);
    var total = 2500;
    var ratio = Math.min(1, Math.max(0, remaining / total));
    var barX = panelX + 6;
    y += 1;
    ctx.fillStyle = '#333';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(barX, y, panelW - 12, 3);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = ratio > 0.5 ? '#6f6' : ratio > 0.2 ? '#ff6' : '#f44';
    ctx.fillRect(barX, y, Math.round((panelW - 12) * ratio), 3);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
};
