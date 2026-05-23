// =====================
// GALAXY RAIDERS - render-entities.js (HC-94 pass / HC-RD-01 readability / HC-RD-02 clarity)
// =====================

function getEnemyBulletRenderStyle(b) {
  if (!b.kind && !b.color) return { kind: 'boss', color: '#ffdd44' };

  const kind = b.kind || 'basic';
  var style = 'default';
  var color = b.color;

  if (kind === 'basic' && b.sourceType) {
    var st = b.sourceType;
    if (st === 'alien3') {
      style = 'tank';
      color = color || '#ff7722';
    } else if (st === 'alien4' || st === 'alien5' || st === 'alien_mini') {
      style = 'fast';
      color = color || '#ff5577';
    } else if (st === 'alien6') {
      style = 'splitter';
      color = color || '#ff55aa';
    } else {
      color = color || '#ff5050';
    }
  }

  if (kind === 'fortress') return { kind, color: color || '#ffc66f', style };
  if (kind === 'split_fan') return { kind, color: color || '#7effd8', style };
  if (kind === 'crossfire_a') return { kind, color: color || '#ffb15a', style };
  if (kind === 'crossfire_b') return { kind, color: color || '#ff6a6a', style };
  if (kind === 'orb') return { kind, color: color || '#72f6ff', style };
  if (kind === 'basic') return { kind, color: color || '#ff5050', style };

  if (b.color) return { kind: 'basic', color: b.color, style: 'default' };
  if (Math.abs(b.vx || 0) > 0.7) return { kind: 'crossfire_a', color: '#ff9a6a', style: 'default' };
  if ((b.w || 0) <= 6 && (b.h || 0) <= 6) return { kind: 'orb', color: '#ff8c8c', style: 'default' };
  return { kind: 'basic', color: '#ff5050', style: 'default' };
}

// --- HC-94 / HC-RD-02: directional trail helper ---
function _drawEnemyTrail(b, color, steps, maxAlpha, lenMul) {
  var vx = b.vx || 0;
  var vy = b.vy || 0;
  if (vx === 0 && vy === 0) return;
  var w = b.w || 4;
  var h = b.h || 10;
  var mul = lenMul || 1.5;
  var _trailAlphaMul = (typeof getBulletClarityConfig === 'function')
    ? (getBulletClarityConfig().motion || {}).trailAlphaMul || 0.72
    : 0.72;
  for (var s = 0; s < steps; s++) {
    var t = (s + 1) / steps;
    var ox = -vx * mul * t;
    var oy = -vy * mul * t;
    ctx.globalAlpha = maxAlpha * (1 - t) * _trailAlphaMul;
    ctx.fillStyle = color;
    ctx.fillRect(b.x + ox, b.y + oy, w, h);
  }
}

function _snap(v) {
  return Math.round(Number(v) || 0);
}

function _drawPixelThreatCore(b, color, mode) {
  var x = _snap(b.x);
  var y = _snap(b.y);
  var w = Math.max(3, _snap(b.w || 4));
  var h = Math.max(4, _snap(b.h || 10));
  var cx = x + Math.floor(w / 2);
  var cy = y + Math.floor(h / 2);
  var outline = '#050308';

  ctx.save();
  ctx.globalAlpha = 1;

  if (mode === 'orb') {
    var r = Math.max(3, Math.ceil(Math.max(w, h) * 0.5));
    ctx.fillStyle = outline;
    ctx.fillRect(cx - 1, cy - r - 1, 2, 2);
    ctx.fillRect(cx - r - 1, cy - 1, 2, 2);
    ctx.fillRect(cx + r - 1, cy - 1, 2, 2);
    ctx.fillRect(cx - 1, cy + r - 1, 2, 2);
    ctx.fillRect(cx - r + 1, cy - r + 1, r * 2 - 2, r * 2 - 2);

    ctx.fillStyle = color;
    ctx.fillRect(cx - r + 2, cy - r + 2, r * 2 - 4, r * 2 - 4);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.68;
    ctx.fillRect(cx - 1, cy - 2, 2, 4);
    ctx.fillRect(cx - 2, cy - 1, 4, 2);
    ctx.restore();
    return;
  }

  var cap = mode === 'boss' ? 2 : 1;
  ctx.fillStyle = outline;
  ctx.fillRect(x - cap, y - 1, w + cap * 2, h + 2);
  ctx.fillRect(x - 1, y - cap, w + 2, h + cap * 2);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);

  ctx.globalAlpha = 0.38;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), 1);

  ctx.globalAlpha = mode === 'fast' ? 0.86 : 0.62;
  ctx.fillRect(cx - 1, y + 2, 2, Math.max(2, h - 4));

  if (mode === 'boss' || mode === 'tank') {
    ctx.globalAlpha = 0.72;
    ctx.fillRect(x + 1, cy - 1, Math.max(1, w - 2), 2);
  }

  if (mode === 'fast') {
    ctx.globalAlpha = 0.72;
    ctx.fillRect(cx - 1, y + h, 2, 2);
  }

  ctx.restore();
}

function drawEnemyBullet(b) {
  var _rs = getEnemyBulletRenderStyle(b);
  var kind = _rs.kind;
  var color = _rs.color;
  var style = _rs.style || 'default';
  const x = b.x;
  const y = b.y;
  const w = b.w || 4;
  const h = b.h || 10;
  ctx.save();

  drawHardcoreBulletEnhancement(ctx, b, kind === 'boss');

  if (kind === 'boss') {
    var _clarity = (typeof getBulletClarityConfig === 'function') ? getBulletClarityConfig() : null;
    var _outlineCfg = (_clarity && _clarity.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1, bossLineWidth: 1.5 };
    var _motionCfg = (_clarity && _clarity.motion) || { bossTrailSteps: 4 };
    var _densityCfg = (_clarity && _clarity.density) || { outerHaloCap: 0.10 };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg.outerHaloCap, 0.10);
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 5, w + 10, h + 10);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- DIRECTIONAL TRAIL (HC-RD-02: enhanced steps) ---
    _drawEnemyTrail(b, color, _motionCfg.bossTrailSteps || 4, 0.10, 2.0);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg.color || '#050308';
    ctx.lineWidth = _outlineCfg.bossLineWidth || 1.5;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(2, h - 2));

    // --- CORE PULSE ---
    var bp = 0.5 + 0.5 * Math.sin(globalTime * 0.05 + x * 0.01);
    ctx.globalAlpha = 0.30 + bp * 0.15;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + Math.floor(w * 0.25), y + Math.floor(h * 0.25), Math.max(2, Math.floor(w * 0.5)), Math.max(2, Math.floor(h * 0.5)));

    _drawPixelThreatCore(b, color, 'boss');

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'orb') {
    var _clarity2 = (typeof getBulletClarityConfig === 'function') ? getBulletClarityConfig() : null;
    var _outlineCfg2 = (_clarity2 && _clarity2.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1, orbConcentric: true };
    var _motionCfg2 = (_clarity2 && _clarity2.motion) || { orbTrailSteps: 3 };
    var _densityCfg2 = (_clarity2 && _clarity2.density) || { outerHaloCap: 0.10 };
    var _typeLang = (_clarity2 && _clarity2.typeLanguage) || { heavyInnerOutline: true };

    const r = Math.max(2, Math.max(w, h) * 0.5);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg2.outerHaloCap, 0.10);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.fill();

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.fill();

    // --- TRAIL (HC-RD-02: enhanced) ---
    _drawEnemyTrail(b, color, _motionCfg2.orbTrailSteps || 3, 0.12, 2.5);

    // --- BODY ---
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg2.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg2.color || '#050308';
    ctx.lineWidth = _outlineCfg2.lineWidth || 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // --- HC-RD-02: CONCENTRIC INNER OUTLINE for heavy orbs ---
    if (_outlineCfg2.orbConcentric && _typeLang.heavyInnerOutline) {
      ctx.globalAlpha = (_outlineCfg2.alpha || 0.42) * 0.65;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, r * 0.55), 0, Math.PI * 2);
      ctx.stroke();
    }

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r * 0.45), 0, Math.PI * 2);
    ctx.fill();

    _drawPixelThreatCore(b, color, 'orb');

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // --- HC-RD-02: SHARED TRAIL for rect-based bullets (enhanced steps) ---
  var _clarity3 = (typeof getBulletClarityConfig === 'function') ? getBulletClarityConfig() : null;
  var _motionCfg3 = (_clarity3 && _clarity3.motion) || { sharedTrailSteps: 3 };
  var _densityCfg3 = (_clarity3 && _clarity3.density) || { outerHaloCap: 0.10 };
  _drawEnemyTrail(b, color, _motionCfg3.sharedTrailSteps || 3, 0.08, 2.0);

  if (kind === 'fortress') {
    var _outlineCfg3 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1 };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.12);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg3.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg3.color || '#050308';
    ctx.lineWidth = _outlineCfg3.lineWidth || 1;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- SCORCH MARK ---
    ctx.globalAlpha = 0.40;
    ctx.fillStyle = '#ffe4b0';
    ctx.fillRect(x + Math.max(1, Math.floor(w * 0.5)), y, 1, h);

    _drawPixelThreatCore(b, color, 'tank');

    ctx.restore();
    return;
  }

  if (kind === 'split_fan') {
    var _outlineCfg4 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1 };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.12);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg4.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg4.color || '#050308';
    ctx.lineWidth = _outlineCfg4.lineWidth || 1;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- VELOCITY SMEAR ---
    ctx.globalAlpha = 0.30;
    ctx.fillRect(x - (b.vx || 0) * 0.6, y - 3, w, 3);

    _drawPixelThreatCore(b, color, 'split');

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'crossfire_a' || kind === 'crossfire_b') {
    var _outlineCfg5 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1 };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.12);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg5.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg5.color || '#050308';
    ctx.lineWidth = _outlineCfg5.lineWidth || 1;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- TIP HIGHLIGHT ---
    ctx.globalAlpha = 0.40;
    ctx.fillRect(x, y - 2, w, 3);

    _drawPixelThreatCore(b, color, 'fast');

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (style === 'tank') {
    var _outlineCfg6 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, tankLineWidth: 1.5 };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.12);
    ctx.fillStyle = color;
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);

    // --- MID GLOW ---
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = color;
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: THICK CONTRAST OUTLINE for tank ---
    ctx.globalAlpha = _outlineCfg6.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg6.color || '#050308';
    ctx.lineWidth = _outlineCfg6.tankLineWidth || 1.5;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(2, h - 2));

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + Math.floor(h * 0.5) - 1, Math.max(1, w - 2), 2);

  } else if (style === 'fast') {
    var _outlineCfg7 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1 };
    var _typeLang2 = (_clarity3 && _clarity3.typeLanguage) || { fastDirectionalTip: true };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.10);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    // --- BODY (offset for speed feel) ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y, Math.max(1, w - 2), h);

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg7.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg7.color || '#050308';
    ctx.lineWidth = _outlineCfg7.lineWidth || 1;
    ctx.strokeRect(x + 0.5, y - 0.5, Math.max(1, w - 2) + 1, h + 1);

    // --- HC-RD-02: DIRECTIONAL TIP for fast bullets ---
    if (_typeLang2.fastDirectionalTip && (b.vy || 0) > 0) {
      var _tipX = x + 1 + Math.max(1, w - 2) / 2;
      var _tipY = y + h;
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = '#fff';
      ctx.fillRect(_tipX - 1, _tipY - 1, 2, 3);
    }

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- SPEED LINES ---
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h + 1, w, 2);

  } else if (style === 'splitter') {
    var _outlineCfg8 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1 };
    var _typeLang3 = (_clarity3 && _clarity3.typeLanguage) || { splitterPulseEnable: true };

    var _pa = 0.5 + 0.5 * Math.sin(globalTime * 0.016 + b.x * 0.1);

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.10 + _pa * 0.06);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.18 + _pa * 0.08;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    // --- BODY ---
    ctx.globalAlpha = 0.85 + _pa * 0.15;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: PULSING CONTRAST OUTLINE for splitter ---
    var _splOutlineAlpha = _typeLang3.splitterPulseEnable
      ? (_outlineCfg8.alpha || 0.42) * (0.75 + 0.25 * _pa)
      : (_outlineCfg8.alpha || 0.42);
    ctx.globalAlpha = _splOutlineAlpha;
    ctx.strokeStyle = _outlineCfg8.color || '#050308';
    ctx.lineWidth = _outlineCfg8.lineWidth || 1;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.4 + _pa * 0.15;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

  } else {
    // DEFAULT / basic bullets
    var _outlineCfg9 = (_clarity3 && _clarity3.outline) || { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1 };

    // --- OUTER HALO ---
    ctx.globalAlpha = Math.min(_densityCfg3.outerHaloCap, 0.10);
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- HC-RD-02: CONTRAST OUTLINE ---
    ctx.globalAlpha = _outlineCfg9.alpha || 0.42;
    ctx.strokeStyle = _outlineCfg9.color || '#050308';
    ctx.lineWidth = _outlineCfg9.lineWidth || 1;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));
  }

  _drawPixelThreatCore(b, color, style === 'fast' ? 'fast' : (style === 'tank' ? 'tank' : style));

  ctx.globalAlpha = 1;
  ctx.restore();
}
