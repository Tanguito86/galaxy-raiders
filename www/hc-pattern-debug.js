// ============================================================
// GALAXY RAIDERS — hc-pattern-debug.js
// HC-PD-01: Initial debug overlay
// HC-PD-02: Expanded telemetry — dominant threat, support, lane
//           risk, readability load, telegraph queue, warnings
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

  function _pdClassification() {
    try {
      return !!(global.HC_PATTERN_DIRECTOR && global.HC_PATTERN_DIRECTOR.runtimeClassification !== false);
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

  function _dominanceColor(dom) {
    if (dom === 'primary') return '#ff6644';
    if (dom === 'support') return '#ffaa44';
    return '#88ccff';
  }

  function _laneColor(risk) {
    if (risk === 'high') return '#ff4444';
    if (risk === 'medium') return '#ffaa44';
    if (risk === 'low') return '#88ccff';
    return '#44ff44';
  }

  function _densityColor(cls) {
    if (cls === 'high') return '#ff4444';
    if (cls === 'medium') return '#ffaa44';
    return '#44ff44';
  }

  function _loadColor(load, max) {
    if (max <= 0) return '#888';
    var pct = load / max;
    if (pct >= 0.8) return '#ff4444';
    if (pct >= 0.5) return '#ffaa44';
    return '#44ff44';
  }

  var _shortIds = {
    aimedShot: 'snpr', aimedBurst: 'b-rst', aimedColumn: 'col', aimedArc: 'arc',
    aimedSpread: 'spd', radialRing: 'ring', laneColumn: 'lane', rotatingArcs: 'r-arc',
    mineField: 'mine', tractorBeam: 'beam', satelliteOrbit: 'sat', wideFan: 'fan',
    downwardSpread: 'd-spd', suppressorFan: 'sup', flankerCross: 'crss', baiterSpread: 'bait',
    diverPursuit: 'dive', chaserBurst: 'chas', delayedBurst: 'dly', arcWave: 'wave',
    chargeImpact: 'impc', teleportWave: 'tp', imperialCrossfire: 'imp', fortressVolley: 'fort',
    splitFan: 'splt', counterShot: 'cntr'
  };

  function _shortId(id) {
    return _shortIds[id] || (id.length > 5 ? id.substring(0, 4) : id);
  }

  function _pdDrawDebugPanel(ctx) {
    if (!ctx) return;
    if (!_pdDebugEnabled()) return;

    var W = typeof global.W === 'number' ? global.W : 360;
    var H = typeof global.H === 'number' ? global.H : 640;

    var panelX = 4;
    var panelY = 108;
    var panelW = 136;
    var lineH = 6;
    var rows = 27;
    var padding = 4;
    var panelH = rows * lineH + padding * 2;

    if (!_pdHasInstance()) {
      _drawMiniStatus(ctx, panelX, panelY);
      return;
    }

    var st = global.HC_PATTERN_DIRECTOR_INSTANCE.getState();
    if (!st) {
      _drawMiniStatus(ctx, panelX, panelY);
      return;
    }

    ctx.save();

    // Background
    ctx.globalAlpha = 0.52;
    ctx.fillStyle = '#000';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#ff9944';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    var x = panelX + padding;
    var y = panelY + padding;
    ctx.font = '4px "Press Start 2P"';
    ctx.textAlign = 'left';

    // ---- HEADER ----
    ctx.globalAlpha = 0.80;
    ctx.fillStyle = '#ff9944';
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText('HC-PD', x, y + 5);
    ctx.font = '4px "Press Start 2P"';

    var statusX = x + 38;
    var enabled = _pdActive();
    var classifying = _pdClassification();
    ctx.globalAlpha = enabled ? 0.75 : 0.35;
    ctx.fillStyle = enabled ? '#44ff44' : '#ff4444';
    ctx.fillText(enabled ? 'ACTIVE' : 'STBY', statusX, y + 5);

    if (!enabled && classifying) {
      ctx.globalAlpha = 0.60;
      ctx.fillStyle = '#88ccff';
      ctx.fillText(' CLASS', statusX + 31, y + 5);
    }

    // ---- SEPARATOR ----
    y += 8;
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#ff9944';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(panelX + panelW - padding, y);
    ctx.stroke();
    y += 4;

    ctx.globalAlpha = 0.72;

    // ---- BUDGET BAR ----
    var budgetPct = st.maxBudget > 0 ? st.budget / st.maxBudget : 0;
    var budgetColor = budgetPct > 0.8 ? '#ff4444' : budgetPct > 0.5 ? '#ffaa44' : '#44ff44';
    ctx.fillStyle = '#888';
    ctx.fillText('THREAT', x, y);
    ctx.fillStyle = budgetColor;
    ctx.fillText(_safeNum(st.budget, 0) + '/' + st.maxBudget, x + 40, y);

    // Mini bar
    var barW = panelW - padding * 2 - 48;
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 72, y - 3, barW, 5);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = budgetColor;
    ctx.fillRect(x + 72, y - 3, barW * Math.min(1, budgetPct), 5);
    y += lineH + 1;

    // ---- DOMINANT THREAT ----
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = '#aaa';
    ctx.fillText('DOM:', x, y);
    if (st.dominantPattern) {
      var dp = st.dominantPattern;
      ctx.fillStyle = '#ff6644';
      ctx.fillText(_shortId(dp.id), x + 18, y);
      ctx.fillStyle = '#888';
      ctx.fillText(_safeStr(dp.category || dp.class, '?'), x + 50, y);
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('none', x + 18, y);
    }
    y += lineH;

    // ---- DOMINANCE COUNT ----
    var domPct = st.dominantMax > 0 ? st.dominantCount / st.dominantMax : 0;
    var domColor = domPct >= 1 ? '#ff4444' : '#ffaa44';
    ctx.fillStyle = '#888';
    ctx.fillText('PRI:', x, y);
    ctx.fillStyle = domColor;
    ctx.fillText(st.simultaneousPrimaryCount + '/' + st.dominantMax, x + 18, y);
    ctx.fillStyle = '#666';
    ctx.fillText('SUP:' + (st.supportPatterns ? st.supportPatterns.length : 0), x + 48, y);
    ctx.fillStyle = '#558';
    ctx.fillText('UTL:' + (st.utilityPatterns ? st.utilityPatterns.length : 0), x + 78, y);
    y += lineH;

    // ---- DENSITY ----
    ctx.fillStyle = '#888';
    ctx.fillText('DENSITY:', x, y);
    ctx.fillStyle = _densityColor(st.activeDensityClass);
    ctx.fillText(st.activeDensityClass || '?', x + 42, y);

    ctx.fillStyle = '#888';
    ctx.fillText('B:' + _safeNum(st.bulletCount), x + 72, y);
    ctx.fillText('C:' + _safeNum(st.convergencePct * 100, 0) + '%', x + 98, y);
    y += lineH;

    // ---- READABILITY LOAD ----
    var readMax = st.readabilityMax || 8;
    var readColor = _loadColor(st.readabilityLoad, readMax);
    ctx.fillStyle = '#888';
    ctx.fillText('READ:', x, y);
    ctx.fillStyle = readColor;
    ctx.fillText(_safeNum(st.readabilityLoad, 0) + '/' + readMax, x + 28, y);

    // Mini bar
    var readPct = readMax > 0 ? st.readabilityLoad / readMax : 0;
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 56, y - 3, barW * 0.6, 5);
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = readColor;
    ctx.fillRect(x + 56, y - 3, barW * 0.6 * Math.min(1, readPct), 5);
    y += lineH + 1;

    // ---- STATUS LINE ----
    ctx.globalAlpha = 0.65;
    if (st.densityCheck && st.densityCheck.exceeded) {
      ctx.fillStyle = '#ff4444';
      ctx.fillText('DENSITY OVER', x, y);
    } else {
      ctx.fillStyle = '#44ff44';
      ctx.fillText('DENSITY OK', x, y);
    }
    ctx.fillStyle = '#888';
    ctx.fillText('ACT:' + st.totalActivations, x + 60, y);
    y += lineH;

    // ---- SEPARATOR ----
    y += 1;
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#ff9944';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(panelX + panelW - padding, y);
    ctx.stroke();
    y += 3;

    // ---- ACTIVE PATTERNS LIST ----
    if (st.activePatterns && st.activePatterns.length > 0) {
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = '#ffaa44';
      ctx.fillText('ACTIVE (' + st.activePatterns.length + '):', x, y);
      y += lineH;

      var maxShow = Math.min(st.activePatterns.length, 8);
      for (var i = 0; i < maxShow; i++) {
        var p = st.activePatterns[i];
        ctx.globalAlpha = 0.68;
        ctx.fillStyle = _dominanceColor(p.dominance);
        ctx.fillText(_shortId(p.id), x + 3, y);
        ctx.fillStyle = _laneColor(p.laneRisk);
        ctx.fillText(_safeStr(p.laneRisk, '?').substring(0, 3), x + 32, y);
        ctx.fillStyle = '#666';
        ctx.fillText('w' + p.weight, x + 52, y);
        ctx.fillText('r' + p.readabilityCost, x + 70, y);
        ctx.fillText(_safeStr(p.source, '?').substring(0, 4), x + 88, y);
        y += lineH;
      }

      if (st.activePatterns.length > maxShow) {
        ctx.globalAlpha = 0.50;
        ctx.fillStyle = '#666';
        ctx.fillText('  +' + (st.activePatterns.length - maxShow) + ' more', x + 3, y);
        y += lineH;
      }
    } else {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#666';
      ctx.fillText('(no active patterns)', x, y);
      y += lineH;
    }

    // ---- SEPARATOR ----
    y += 1;
    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = '#ffaa44';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(panelX + panelW - padding, y);
    ctx.stroke();
    y += 3;

    // ---- WARNINGS ----
    if (st.warnings && st.warnings.length > 0) {
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = '#ff6644';
      ctx.fillText('WARN (' + st.warnings.length + '):', x, y);
      y += lineH;

      var maxWarn = Math.min(st.warnings.length, 5);
      for (var w = 0; w < maxWarn; w++) {
        var warn = st.warnings[w];
        ctx.globalAlpha = 0.70;
        ctx.fillStyle = '#ffaa44';
        var wl = warn.length > 32 ? warn.substring(0, 30) + '..' : warn;
        ctx.fillText('  ' + wl, x + 2, y);
        y += lineH;
      }
    } else {
      ctx.globalAlpha = 0.40;
      ctx.fillStyle = '#44ff44';
      ctx.fillText('_ no warnings', x, y);
      y += lineH;
    }

    // ---- FREQUENCY TOPS ----
    if (st.patternFrequency && Object.keys(st.patternFrequency).length > 0) {
      y += 2;
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#888';
      ctx.fillText('TOP:', x, y);
      y += lineH;

      var sorted = Object.keys(st.patternFrequency).sort(function (a, b) {
        return (st.patternFrequency[b] || 0) - (st.patternFrequency[a] || 0);
      }).slice(0, 3);

      for (var f = 0; f < sorted.length; f++) {
        var freqId = sorted[f];
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = '#aaa';
        ctx.fillText(_shortId(freqId), x + 3, y);
        ctx.fillStyle = '#666';
        ctx.fillText('x' + (st.patternFrequency[freqId] || 0), x + 32, y);
        y += lineH;
      }
    }

    ctx.restore();
  }

  function _drawMiniStatus(ctx, panelX, panelY) {
    ctx.save();
    ctx.globalAlpha = 0.50;
    ctx.fillStyle = '#000';
    ctx.fillRect(panelX, panelY, 100, 20);
    ctx.globalAlpha = 0.60;
    ctx.fillStyle = '#888';
    ctx.font = '4px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.fillText('HC-PD: no instance', panelX + 4, panelY + 12);
    ctx.restore();
  }

  // ============================================================
  // STANDALONE TELEMETRY MINI PANEL — compact, always-on if enabled
  // ============================================================

  function _pdDrawTelemetryMini(ctx) {
    if (!ctx) return;
    if (!_pdDebugEnabled()) return;
    if (!_pdHasInstance()) return;

    var st = global.HC_PATTERN_DIRECTOR_INSTANCE.getTelemetrySnapshot
      ? global.HC_PATTERN_DIRECTOR_INSTANCE.getTelemetrySnapshot()
      : null;
    if (!st) return;

    var W = typeof global.W === 'number' ? global.W : 360;
    var x = W - 80;
    var y = 4;
    var w = 76;
    var h = 32;

    ctx.save();

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#4488ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    ctx.globalAlpha = 0.72;
    ctx.font = '3px "Press Start 2P"';

    var lx = x + 3;
    var ly = y + 7;
    var lh = 6;

    ctx.fillStyle = '#888';
    ctx.fillText('PAT DIR', lx, ly);

    ly += lh;
    ctx.fillStyle = '#aaa';
    ctx.fillText('B:' + _safeNum(st.budgetPct * 100, 0) + '%', lx, ly);
    ctx.fillText('D:' + _safeNum(st.primaryCount), lx + 34, ly);
    ctx.fillText('BL:' + _safeNum(st.bulletCount), lx + 52, ly);

    ly += lh;
    ctx.fillStyle = st.warningCount > 0 ? '#ffaa44' : '#44ff44';
    ctx.fillText('W:' + st.warningCount, lx, ly);
    ctx.fillStyle = '#aaa';
    ctx.fillText('L:' + _safeStr(st.laneRiskMax), lx + 22, ly);
    ctx.fillText('R:' + _safeNum(st.readabilityPct * 100, 0) + '%', lx + 38, ly);

    ctx.restore();
  }

  // ============================================================
  // EXPORT
  // ============================================================

  global.drawPatternDirectorDebug = _pdDrawDebugPanel;
  global.drawPatternDirectorTelemetry = _pdDrawTelemetryMini;

})(window);
