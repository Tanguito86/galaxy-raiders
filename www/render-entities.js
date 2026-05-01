// =====================
// GALAXY RAIDERS - render-entities.js
// =====================

function getEnemyBulletRenderStyle(b) {
  const kind = b.kind || 'basic';

  if (kind === 'fortress') return { kind, color: b.color || '#ffc66f' };
  if (kind === 'split_fan') return { kind, color: b.color || '#7effd8' };
  if (kind === 'crossfire_a') return { kind, color: b.color || '#ffb15a' };
  if (kind === 'crossfire_b') return { kind, color: b.color || '#ff6a6a' };
  if (kind === 'orb') return { kind, color: b.color || '#72f6ff' };
  if (kind === 'basic') return { kind, color: b.color || '#ff5050' };

  if (b.color) return { kind: 'basic', color: b.color };
  if (Math.abs(b.vx || 0) > 0.7) return { kind: 'crossfire_a', color: '#ff9a6a' };
  if ((b.w || 0) <= 6 && (b.h || 0) <= 6) return { kind: 'orb', color: '#ff8c8c' };
  return { kind: 'basic', color: '#ff5050' };
}

function drawEnemyBullet(b) {
  const { kind, color } = getEnemyBulletRenderStyle(b);
  const x = b.x;
  const y = b.y;
  const w = b.w || 4;
  const h = b.h || 10;

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
    return;
  }

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = color;
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);

  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);

  ctx.globalAlpha = 0.42;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 1, y + h * 0.5 - 0.5, Math.max(1, w - 2), 1);
  ctx.globalAlpha = 1;
}
