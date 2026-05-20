// ============================================================
// GALAXY RAIDERS — hc-pattern-debug.js
// HC-PD-01: Pattern Director debug overlay (optional)
// ============================================================
// SAFE: Only renders when debug.enabled is true.
// No gameplay changes. Overlays only.
// ============================================================

(function (global) {
  'use strict';

  function _pdDebugEnabled() {
    try {
      if (typeof global.getPatternDirectorConfig !== 'function') return false;
      var cfg = global.getPatternDirectorConfig();
      return !!(cfg && cfg.debug && cfg.debug.enabled);
    } catch (e) {
      return false;
    }
  }

  function _pdHasInstance() {
    return !!(global.HC_PATTERN_DIRECTOR_INSTANCE && typeof global.HC_PATTERN_DIRECTOR_INSTANCE.getState === 'function');
  }

  function _pdActive() {
    try {
      return !!(global.HC_PATTERN_DIRECTOR && global.HC_PATTERN_DIRECTOR.enabled);
    } catch (e) {
      return false;
    }
  }

  function _safeNum(val, dec) {
    if (typeof val !== 'number' || !isFinite(val)) return '-';
    return dec !== undefined ? val.toFixed(dec) : String(val);
  }

  function _safeStr(val, fallback) {
    return (val !== undefined && val !== null) ? String(val) : (fallback || '-');
  }

  function _pdDrawDebugPanel(ctx) {
    if (!ctx) return;
    if (!_pdDebugEnabled()) return;

    var W = typeof global.W === 'number' ? global.W : 360;
    var H = typeof global.H === 'number' ? global.H : 640;

    var panelX = 4;
    var panelY = 160;
    var panelW = 130;
    var lineH = 7;
    var rows = 14;
    var panelH = rows * lineH + 6;

    ctx.save();

    // Background
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#000';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.globalAlpha = 0.20;
    ctx.strokeStyle = '#ff9944';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Title
    ctx.globalAlpha = 0.80;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillStyle = '#ff9944';
    ctx.textAlign = 'left';
    ctx.fillText('HC-PD', panelX + 4, panelY + 7);

    // Enabled indicator
    var enabled = _pdActive();
    ctx.globalAlpha = enabled ? 0.75 : 0.40;
    ctx.fillStyle = enabled ? '#44ff44' : '#ff4444';
    ctx.font = '4px "Press Start 2P"';
    ctx.fillText(enabled ? 'ACTIVE' : 'STANDBY', panelX + 4, panelY + 15);

    // Separator
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#ff9944';
    ctx.beginPath();
    ctx.moveTo(panelX + 4, panelY + 19);
    ctx.lineTo(panelX + panelW - 4, panelY + 19);
    ctx.stroke();

    if (!_pdHasInstance()) {
      ctx.globalAlpha = 0.50;
      ctx.fillStyle = '#888';
      ctx.font = '4px "Press Start 2P"';
      ctx.fillText('instance: N/A', panelX + 4, panelY + 27);
      ctx.restore();
      return;
    }

    var st = global.HC_PATTERN_DIRECTOR_INSTANCE.getState();
    if (!st) {
      ctx.globalAlpha = 0.50;
      ctx.fillStyle = '#888';
      ctx.font = '4px "Press Start 2P"';
      ctx.fillText('state: N/A', panelX + 4, panelY + 27);
      ctx.restore();
      return;
    }

    ctx.globalAlpha = 0.72;
    ctx.font = '4px "Press Start 2P"';

    var y = panelY + 27;

    // Budget
    var budgetPct = st.maxBudget > 0 ? st.budget / st.maxBudget : 0;
    var budgetColor = budgetPct > 0.8 ? '#ff4444' : budgetPct > 0.5 ? '#ffaa44' : '#44ff44';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'left';
    ctx.fillText('budget:', panelX + 4, y);
    ctx.fillStyle = budgetColor;
    ctx.fillText(_safeNum(st.budget, 0) + '/' + st.maxBudget, panelX + 42, y);

    y += lineH;

    // Dominant
    var domPct = st.dominantMax > 0 ? st.dominantCount / st.dominantMax : 0;
    var domColor = domPct >= 1 ? '#ff4444' : '#ffaa44';
    ctx.fillStyle = '#aaa';
    ctx.fillText('dominant:', panelX + 4, y);
    ctx.fillStyle = domColor;
    ctx.fillText(st.dominantCount + '/' + st.dominantMax, panelX + 52, y);

    y += lineH;

    // Bullets
    var bulletCount = st.bulletCount || 0;
    var bulletColor = bulletCount > 30 ? '#ff4444' : bulletCount > 15 ? '#ffaa44' : '#44ff44';
    ctx.fillStyle = '#aaa';
    ctx.fillText('bullets:', panelX + 4, y);
    ctx.fillStyle = bulletColor;
    ctx.fillText(_safeNum(bulletCount), panelX + 46, y);

    y += lineH;

    // Convergence
    var convPct = st.convergencePct || 0;
    var convColor = convPct > 0.5 ? '#ff4444' : convPct > 0.25 ? '#ffaa44' : '#44ff44';
    ctx.fillStyle = '#aaa';
    ctx.fillText('converg:', panelX + 4, y);
    ctx.fillStyle = convColor;
    ctx.fillText(_safeNum(convPct * 100, 0) + '%', panelX + 46, y);

    y += lineH;

    // Density check
    if (st.densityCheck) {
      var dc = st.densityCheck;
      var dcColor = dc.exceeded ? '#ff4444' : '#44ff44';
      ctx.fillStyle = '#aaa';
      ctx.fillText('density:', panelX + 4, y);
      ctx.fillStyle = dcColor;
      ctx.fillText(dc.exceeded ? 'OVER' : 'OK', panelX + 42, y);

      y += lineH;
      if (dc.exceeded) {
        ctx.fillStyle = '#ff6644';
        ctx.fillText('  ' + _safeStr(dc.metric) + ':' + _safeNum(dc.value, 1) + '>' + _safeNum(dc.cap, 1), panelX + 4, y);
        y += lineH;
      }
    }

    // Escape lanes
    ctx.fillStyle = '#aaa';
    ctx.fillText('esc lanes:', panelX + 4, y);
    ctx.fillStyle = '#88ccff';
    ctx.fillText(st.dominantMax > 0 ? 'preserved' : 'free', panelX + 52, y);

    y += lineH;

    // Active patterns list
    if (st.activePatterns && st.activePatterns.length > 0) {
      y += 2;
      ctx.fillStyle = '#ff9944';
      ctx.fillText('patterns:', panelX + 4, y);
      y += lineH;

      for (var i = 0; i < Math.min(st.activePatterns.length, 5); i++) {
        var p = st.activePatterns[i];
        var pColor = p.dominant ? '#ff6644' : '#88ccff';
        ctx.fillStyle = pColor;
        var label = _safeStr(p.origin) + ':' + _safeStr(p.type || p.role);
        if (label.length > 18) label = label.substring(0, 16) + '..';
        ctx.fillText(label, panelX + 6, y);
        y += lineH;
      }

      if (st.activePatterns.length > 5) {
        ctx.fillStyle = '#666';
        ctx.fillText('  +' + (st.activePatterns.length - 5) + ' more', panelX + 6, y);
        y += lineH;
      }
    }

    // Warnings
    if (st.warnings && st.warnings.length > 0) {
      y += 2;
      ctx.fillStyle = '#ffaa44';
      ctx.fillText('warnings:', panelX + 4, y);
      y += lineH;

      for (var w = 0; w < Math.min(st.warnings.length, 3); w++) {
        ctx.fillStyle = '#ffaa44';
        var wl = st.warnings[w];
        if (wl.length > 22) wl = wl.substring(0, 20) + '..';
        ctx.fillText('  ' + wl, panelX + 6, y);
        y += lineH;
      }
    }

    ctx.restore();
  }

  // ============================================================
  // EXPORT
  // ============================================================

  global.drawPatternDirectorDebug = _pdDrawDebugPanel;

})(window);
