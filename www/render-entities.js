// =====================
// GALAXY RAIDERS - render-entities.js (HC-94 pass / HC-RD-01 readability)
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

// --- HC-94: directional trail helper ---
function _drawEnemyTrail(b, color, steps, maxAlpha, lenMul) {
  var vx = b.vx || 0;
  var vy = b.vy || 0;
  if (vx === 0 && vy === 0) return;
  var w = b.w || 4;
  var h = b.h || 10;
  var mul = lenMul || 1.5;
  for (var s = 0; s < steps; s++) {
    var t = (s + 1) / steps;
    var ox = -vx * mul * t;
    var oy = -vy * mul * t;
    ctx.globalAlpha = maxAlpha * (1 - t) * 0.6;
    ctx.fillStyle = color;
    ctx.fillRect(b.x + ox, b.y + oy, w, h);
  }
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
    // --- OUTER HALO ---
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 5, w + 10, h + 10);

    // --- INNER GLOW ---
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    // --- DIRECTIONAL TRAIL ---
    _drawEnemyTrail(b, color, 3, 0.10, 2.0);

    // --- BODY ---
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(2, h - 2));

    // --- CORE PULSE ---
    var bp = 0.5 + 0.5 * Math.sin(globalTime * 0.05 + x * 0.01);
    ctx.globalAlpha = 0.30 + bp * 0.15;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + Math.floor(w * 0.25), y + Math.floor(h * 0.25), Math.max(2, Math.floor(w * 0.5)), Math.max(2, Math.floor(h * 0.5)));

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'orb') {
    const r = Math.max(2, Math.max(w, h) * 0.5);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;

    // --- OUTER HALO ---
    ctx.globalAlpha = 0.10;
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

    // --- TRAIL ---
    _drawEnemyTrail(b, color, 2, 0.12, 2.5);

    // --- BODY ---
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, r * 0.45), 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  // --- SHARED TRAIL for rect-based bullets ---
  _drawEnemyTrail(b, color, 2, 0.08, 2.0);

  if (kind === 'fortress') {
    // --- OUTER HALO ---
    ctx.globalAlpha = 0.12;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- SCORCH MARK ---
    ctx.globalAlpha = 0.40;
    ctx.fillStyle = '#ffe4b0';
    ctx.fillRect(x + Math.max(1, Math.floor(w * 0.5)), y, 1, h);

    ctx.restore();
    return;
  }

  if (kind === 'split_fan') {
    // --- OUTER HALO ---
    ctx.globalAlpha = 0.12;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- VELOCITY SMEAR ---
    ctx.globalAlpha = 0.30;
    ctx.fillRect(x - (b.vx || 0) * 0.6, y - 3, w, 3);

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'crossfire_a' || kind === 'crossfire_b') {
    // --- OUTER HALO ---
    ctx.globalAlpha = 0.12;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- TIP HIGHLIGHT ---
    ctx.globalAlpha = 0.40;
    ctx.fillRect(x, y - 2, w, 3);

    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (style === 'tank') {
    // --- OUTER HALO ---
    ctx.globalAlpha = 0.12;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(2, h - 2));

    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + Math.floor(h * 0.5) - 1, Math.max(1, w - 2), 2);

  } else if (style === 'fast') {
    // --- OUTER HALO ---
    ctx.globalAlpha = 0.10;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    // --- SPEED LINES ---
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h + 1, w, 2);

  } else if (style === 'splitter') {
    var _pa = 0.5 + 0.5 * Math.sin(globalTime * 0.016 + b.x * 0.1);

    // --- OUTER HALO ---
    ctx.globalAlpha = 0.10 + _pa * 0.06;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.4 + _pa * 0.15;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

  } else {
    // DEFAULT / basic bullets

    // --- OUTER HALO ---
    ctx.globalAlpha = 0.10;
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

    // --- BRIGHT CORE ---
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
