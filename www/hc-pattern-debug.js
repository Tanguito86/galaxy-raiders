// ============================================================
// GALAXY RAIDERS — hc-pattern-debug.js
// HC-PD-01: Initial debug overlay
// HC-PD-02: Expanded telemetry
// HC-PD-03: Budget audit display — limits, lane score,
//           telegraph overlap, dangerous combos, history trend
// HC-PD-04: Soft gating advice section
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

  function _pctColor(pct, soft, hard) {
    if (hard > 0 && pct >= hard / (hard || 1)) return '#ff4444';
    if (soft > 0 && pct >= soft / (hard || 1)) return '#ffaa44';
    return '#44ff44';
  }

  function _scoreColor(score, max) {
    if (max <= 0) return '#888';
    if (score >= max) return '#ff4444';
    if (score >= max * 0.6) return '#ffaa44';
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

  function _drawMiniBar(ctx, x, y, w, h, pct, softPct, color) {
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, w, h);
    if (softPct > 0) {
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#ffaa44';
      ctx.fillRect(x, y, w * Math.min(1, softPct), h);
    }
    ctx.globalAlpha = 0.50;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w * Math.min(1, pct), h);
  }

  function _drawHistoryTrend(ctx, x, y, w, h, history, key, maxVal) {
    if (!history || history.length < 2) return;
    var len = Math.min(history.length, 60);
    var slice = history.slice(-len);
    var stepX = w / (len - 1);
    maxVal = maxVal || 10;

    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.5);
    ctx.lineTo(x + w, y + h * 0.5);
    ctx.stroke();

    ctx.globalAlpha = 0.60;
    ctx.strokeStyle = '#ff9944';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i < len; i++) {
      var val = slice[i][key] || 0;
      var px = x + i * stepX;
      var py = y + h - (val / maxVal) * h;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  function _pdDrawDebugPanel(ctx) {
    if (!ctx) return;
    if (!_pdDebugEnabled()) return;

    var W = typeof global.W === 'number' ? global.W : 360;

    var panelX = 4;
    var panelY = 94;
    var panelW = 142;
    var lineH = 6;
    var rows = 31;
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
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = '#ff9944';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    var x = panelX + padding;
    var y = panelY + padding;
    ctx.font = '4px "Press Start 2P"';
    ctx.textAlign = 'left';

    // ---- HEADER ----
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = '#ff9944';
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText('HC-PD AUDIT', x, y + 5);
    ctx.font = '4px "Press Start 2P"';

    var enabled = _pdActive();
    ctx.globalAlpha = enabled ? 0.75 : 0.35;
    ctx.fillStyle = enabled ? '#44ff44' : '#ff8844';
    ctx.fillText(enabled ? 'ACT' : 'OBS', x + 68, y + 5);

    y += 8;
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#ff9944';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(panelX + panelW - padding, y);
    ctx.stroke();
    y += 4;

    // ---- THREAT BUDGET ----
    ctx.globalAlpha = 0.75;
    var budgetPct = st.maxBudget > 0 ? st.budget / st.maxBudget : 0;
    var budgetSoft = st.softBudget || 8;
    var budgetColor = _pctColor(st.budget, budgetSoft, st.maxBudget);
    ctx.fillStyle = '#888';
    ctx.fillText('BUDGET', x, y);
    ctx.fillStyle = budgetColor;
    ctx.fillText(_safeNum(st.budget) + '/' + st.maxBudget, x + 38, y);
    if (st.budget >= st.softBudget) {
      ctx.fillText('!', x + 36, y);
    }
    _drawMiniBar(ctx, x + 64, y - 3, panelW - 68, 5, budgetPct, budgetSoft / st.maxBudget, budgetColor);
    y += lineH;

    // ---- READABILITY ----
    var readMax = st.readabilityMax || 8;
    var readSoft = st.readabilitySoft || 6;
    var readPct = readMax > 0 ? st.readabilityLoad / readMax : 0;
    var readColor = _pctColor(st.readabilityLoad, readSoft, readMax);
    ctx.fillStyle = '#888';
    ctx.fillText('READ', x, y);
    ctx.fillStyle = readColor;
    ctx.fillText(_safeNum(st.readabilityLoad) + '/' + readMax, x + 38, y);
    _drawMiniBar(ctx, x + 64, y - 3, panelW - 68, 5, readPct, readSoft / readMax, readColor);
    y += lineH;

    // ---- DOMINANCE ----
    ctx.fillStyle = '#888';
    ctx.fillText('PRI', x, y);
    ctx.fillStyle = _scoreColor(st.simultaneousPrimaryCount, st.dominantMax);
    ctx.fillText(st.simultaneousPrimaryCount + '/' + st.dominantMax, x + 18, y);
    ctx.fillStyle = '#666';
    ctx.fillText('S:' + (st.supportPatterns ? st.supportPatterns.length : 0), x + 42, y);
    ctx.fillText('U:' + (st.utilityPatterns ? st.utilityPatterns.length : 0), x + 63, y);
    // HC-PD-03: Dominant pattern
    if (st.dominantPattern) {
      ctx.fillStyle = '#ff6644';
      ctx.fillText(_shortId(st.dominantPattern.id), x + 82, y);
    }
    y += lineH;

    // ---- LANE RISK ----
    ctx.fillStyle = '#888';
    ctx.fillText('LANE', x, y);
    ctx.fillStyle = _scoreColor(st.laneRiskScore, 5);
    ctx.fillText('S:' + _safeNum(st.laneRiskScore), x + 28, y);
    ctx.fillStyle = '#666';
    ctx.fillText('H:' + _safeNum(st.highLaneRiskCount), x + 52, y);
    ctx.fillText('SC:' + _safeNum(st.spaceControlCount), x + 68, y);
    ctx.fillStyle = _laneColor(st.highestLaneRisk);
    ctx.fillText(st.highestLaneRisk ? st.highestLaneRisk.substring(0, 3) : '-', x + 88, y);
    y += lineH;

    // ---- TELEGRAPH ----
    ctx.fillStyle = '#888';
    ctx.fillText('TEL', x, y);
    var tgColor = st.telegraphOverlap ? '#ff4444' : (st.missingTelegraphCount > 0 ? '#ffaa44' : '#44ff44');
    ctx.fillStyle = tgColor;
    ctx.fillText('A:' + _safeNum(st.activeTelegraphCount), x + 24, y);
    ctx.fillText('M:' + _safeNum(st.missingTelegraphCount), x + 48, y);
    if (st.telegraphOverlap) {
      ctx.fillStyle = '#ff4444';
      ctx.fillText('OVRLP', x + 72, y);
    }
    y += lineH;

    // ---- DANGEROUS COMBO ----
    if (st.dangerousCombo) {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#ff4444';
      ctx.fillText('COMBO!', x, y);
      ctx.fillText(st.dangerousCombo.length > 30 ? st.dangerousCombo.substring(0, 28) + '..' : st.dangerousCombo, x + 32, y);
      y += lineH;
    }

    // ---- HC-PD-04: ADVICE SECTION ----
    var advice = global.HC_PATTERN_DIRECTOR_INSTANCE.getSoftGatingAdvice
      ? global.HC_PATTERN_DIRECTOR_INSTANCE.getSoftGatingAdvice()
      : null;
    if (advice && advice.lastAdvice) {
      y += 1;
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = '#88ccff';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(panelX + panelW - padding, y);
      ctx.stroke();
      y += 3;

      var la = advice.lastAdvice;
      var recColor = '#44ff44';
      if (la.recommendation === 'avoid' || la.recommendation === 'delay' && la.severity === 'critical') recColor = '#ff4444';
      else if (la.recommendation === 'delay' || la.recommendation === 'isolate') recColor = '#ffaa44';
      else if (la.recommendation === 'telegraph' || la.recommendation === 'soften') recColor = '#88ccff';

      ctx.globalAlpha = 0.80;
      ctx.fillStyle = '#88ccff';
      ctx.fillText('ADVICE', x, y);
      ctx.fillStyle = recColor;
      ctx.fillText(la.recommendation.toUpperCase(), x + 36, y);
      y += lineH;

      ctx.globalAlpha = 0.68;
      ctx.fillStyle = '#aaa';
      ctx.fillText('last:', x, y);
      ctx.fillText(_safeStr(la.patternId, '?').length > 8 ? _safeStr(la.patternId).substring(0, 7) : _safeStr(la.patternId, '?'), x + 22, y);
      ctx.fillStyle = recColor;
      ctx.fillText(la.severity || '?', x + 52, y);
      ctx.fillStyle = '#888';
      ctx.fillText('B:' + _safeNum(la.predictedBudget) + ' R:' + _safeNum(la.predictedReadability), x + 76, y);
      y += lineH;

      // Cooldown flags
      var cd = advice.cooldownState || {};
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#666';
      var cdPri = cd.framesSincePrimary < cd.minPrimary;
      var cdSni = cd.framesSinceSniper < cd.minSniper;
      var cdWall = cd.framesSinceWall < cd.minWall;
      ctx.fillStyle = cdPri ? '#ffaa44' : '#444';
      ctx.fillText('P' + cd.framesSincePrimary, x, y);
      ctx.fillStyle = cdSni ? '#ffaa44' : '#444';
      ctx.fillText(' S' + cd.framesSinceSniper, x + 28, y);
      ctx.fillStyle = cdWall ? '#ffaa44' : '#444';
      ctx.fillText(' W' + cd.framesSinceWall, x + 56, y);
      y += lineH;

      // Recent telemetry
      var tel = (advice.telemetry || []).slice(-3);
      if (tel.length > 0) {
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = '#555';
        ctx.fillText('recent:', x, y);
        ctx.fillText(tel.map(function (t) { return t.rec.substring(0, 3); }).join(' '), x + 32, y);
        y += lineH;
      }
    }

    // ---- SEPARATOR ----
    y += 1;
    ctx.globalAlpha = 0.10;
    ctx.strokeStyle = '#ff9944';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(panelX + panelW - padding, y);
    ctx.stroke();
    y += 3;

    // ---- WARNINGS ----
    if (st.warnings && st.warnings.length > 0) {
      ctx.globalAlpha = 0.80;
      ctx.fillStyle = '#ff6644';
      ctx.fillText('WARN (' + st.warnings.length + ')', x, y);
      y += lineH;

      var maxWarn = Math.min(st.warnings.length, 6);
      for (var w = 0; w < maxWarn; w++) {
        var warn = st.warnings[w];
        ctx.globalAlpha = 0.70;
        // Color-code by prefix
        var wColor = '#ffaa44';
        if (warn.indexOf('BUDGET_HARD') === 0 || warn.indexOf('COMBO') === 0) wColor = '#ff4444';
        else if (warn.indexOf('BUDGET_SOFT') === 0 || warn.indexOf('READ_HARD') === 0) wColor = '#ff6622';
        else if (warn.indexOf('MULTI') === 0 || warn.indexOf('LANE') === 0) wColor = '#ffaa44';
        ctx.fillStyle = wColor;
        var wl = warn.length > 36 ? warn.substring(0, 34) + '..' : warn;
        ctx.fillText(' ' + wl, x + 1, y);
        y += lineH;
      }
    } else {
      ctx.globalAlpha = 0.40;
      ctx.fillStyle = '#44ff44';
      ctx.fillText('_ clean', x, y);
      y += lineH;
    }

    // ---- SEPARATOR ----
    y += 1;
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = '#ffaa44';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(panelX + panelW - padding, y);
    ctx.stroke();
    y += 3;

    // ---- ACTIVE PATTERNS (compact) ----
    if (st.activePatterns && st.activePatterns.length > 0) {
      var maxShow = Math.min(st.activePatterns.length, 5);
      for (var i = 0; i < maxShow; i++) {
        var p = st.activePatterns[i];
        ctx.globalAlpha = 0.60;
        ctx.fillStyle = _dominanceColor(p.dominance);
        ctx.fillText(_shortId(p.id), x + 2, y);
        ctx.fillStyle = _laneColor(p.laneRisk);
        ctx.fillText(p.laneRisk ? p.laneRisk.substring(0, 3) : '?', x + 28, y);
        ctx.fillStyle = '#555';
        ctx.fillText('w' + p.weight, x + 46, y);
        ctx.fillStyle = _densityColor(p.densityClass);
        ctx.fillText('d' + (p.densityClass || '?').substring(0, 1), x + 66, y);
        ctx.fillStyle = '#555';
        ctx.fillText(_safeStr(p.source, '?').substring(0, 3), x + 82, y);
        y += lineH;
      }
    }

    // ---- HISTORY TREND ----
    if (st.auditHistory && st.auditHistory.length >= 2) {
      y += 2;
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = '#888';
      ctx.fillText('TREND', x, y);
      ctx.fillText('w:' + _safeNum(st.auditHistory[st.auditHistory.length - 1].w), x + 30, y);
      ctx.fillText('p:' + _safeNum(st.auditHistory[st.auditHistory.length - 1].p), x + 54, y);
      ctx.fillText('n:' + _safeNum(st.auditHistory[st.auditHistory.length - 1].n), x + 72, y);
      y += lineH;
      _drawHistoryTrend(ctx, x + 2, y, panelW - 8, 10, st.auditHistory, 'w', st.maxBudget || 10);
      y += 12;
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
  // TELEMETRY MINI PANEL
  // ============================================================

  function _pdDrawTelemetryMini(ctx) {
    if (!ctx) return;
    if (!_pdDebugEnabled()) return;
    if (!_pdHasInstance()) return;

    var st = global.HC_PATTERN_DIRECTOR_INSTANCE.getBudgetAudit
      ? global.HC_PATTERN_DIRECTOR_INSTANCE.getBudgetAudit()
      : null;
    if (!st) return;

    var W = typeof global.W === 'number' ? global.W : 360;
    var x = W - 82;
    var y = 4;
    var w = 78;
    var h = 30;

    ctx.save();

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#4488ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    ctx.globalAlpha = 0.70;
    ctx.font = '3px "Press Start 2P"';
    var lx = x + 3;
    var ly = y + 5;
    var lh = 6;

    ctx.fillStyle = '#888';
    ctx.fillText('PAT AUDIT', lx, ly);
    ly += lh + 1;

    var summary = st.summary || {};
    if (summary.critical) {
      ctx.fillStyle = '#ff4444';
      ctx.fillText('CRITICAL', lx, ly);
    } else if (summary.tense) {
      ctx.fillStyle = '#ffaa44';
      ctx.fillText('TENSE', lx, ly);
    } else {
      ctx.fillStyle = '#44ff44';
      ctx.fillText('CLEAN', lx, ly);
    }
    ly += lh;

    ctx.fillStyle = '#aaa';
    ctx.fillText('B:' + st.threatWeight + '/' + st.threatWeightMax, lx, ly);
    ctx.fillText('R:' + st.readabilityLoad + '/' + st.readabilityMax, lx + 38, ly);
    ly += lh;
    ctx.fillText('P:' + st.primaryThreatCount, lx, ly);
    ctx.fillText('L:' + st.laneRiskScore, lx + 18, ly);
    ctx.fillText('W:' + st.warningCount, lx + 34, ly);
    if (st.dangerousCombo) {
      ctx.fillStyle = '#ff4444';
      ctx.fillText('C!', lx + 52, ly);
    }

    ctx.restore();
  }

  // ============================================================
  // EXPORT
  // ============================================================

  global.drawPatternDirectorDebug = _pdDrawDebugPanel;
  global.drawPatternDirectorTelemetry = _pdDrawTelemetryMini;

})(window);
