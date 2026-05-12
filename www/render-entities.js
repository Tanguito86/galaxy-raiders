// =====================
// GALAXY RAIDERS - render-entities.js
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
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#080000';
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.fillRect(x - 3, y - 3, w + 6, h + 6);

    ctx.globalAlpha = 0.48;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    ctx.globalAlpha = 0.60;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));

    ctx.globalAlpha = 0.34;
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'orb') {
    const r = Math.max(2, Math.max(w, h) * 0.5);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;

    ctx.globalAlpha = 0.14;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.32;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'fortress') {
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y, Math.max(1, w - 2), h);
    ctx.fillStyle = 'rgba(255,240,180,0.72)';
    ctx.fillRect(x + Math.max(1, Math.floor(w * 0.5)), y, 1, h);
    ctx.restore();
    return;
  }

  if (kind === 'split_fan') {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.42;
    ctx.fillRect(x - (b.vx || 0) * 0.6, y - 3, w, 3);
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (kind === 'crossfire_a' || kind === 'crossfire_b') {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.46;
    ctx.fillRect(x, y - 2, w, 2);
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }

  if (style === 'tank') {
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = color;
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = color;
    ctx.fillRect(x - 4, y - 3, w + 8, h + 6);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + h * 0.5 - 1, Math.max(1, w - 2), 2);
  } else if (style === 'fast') {
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.globalAlpha = 0.09;
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h, w, 4);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = color;
    ctx.fillRect(x, y + h + 4, w, 3);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y, Math.max(1, w - 2), h);
    ctx.globalAlpha = 0.40;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + h * 0.5 - 0.5, Math.max(1, w - 2), 1);
  } else if (style === 'splitter') {
    var _pa = 0.5 + 0.5 * Math.sin(globalTime * 0.016 + b.x * 0.1);
    ctx.globalAlpha = 0.14 + _pa * 0.08;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.globalAlpha = 0.8 + _pa * 0.2;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.35 + _pa * 0.2;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + h * 0.5 - 0.5, Math.max(1, w - 2), 1);
  } else {
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 1, y + h * 0.5 - 0.5, Math.max(1, w - 2), 1);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
