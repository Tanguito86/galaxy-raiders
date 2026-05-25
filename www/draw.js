// =====================
// GALAXY RAIDERS - draw.js
// =====================

// --- BACKGROUND THEME ENGINE ---
function getBackgroundThemeForLevel(levelNum) {
  if (levelNum >= 20) return 'imperial';
  if (levelNum >= 16) return 'deepSpace';
  if (levelNum >= 11) return 'orbit';
  if (levelNum >= 6)  return 'atmosphere';
  return 'earth';
}

function drawEarthBackground(ctx, time) {
  // SKY: dark blue-violet gradient
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#020510');
  grad.addColorStop(0.25, '#030a18');
  grad.addColorStop(0.50, '#060f20');
  grad.addColorStop(0.70, '#081428');
  grad.addColorStop(0.86, '#0b182c');
  grad.addColorStop(1, '#0c1420');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Faint invasion glow near horizon
  var glowGrad = ctx.createLinearGradient(0, H * 0.76, 0, H * 0.96);
  glowGrad.addColorStop(0, 'transparent');
  glowGrad.addColorStop(0.30, 'rgba(180, 45, 10, 0.03)');
  glowGrad.addColorStop(0.60, 'rgba(140, 35, 8, 0.04)');
  glowGrad.addColorStop(1, 'rgba(100, 25, 5, 0.02)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, H * 0.76, W, H * 0.20);

  // Distant mountains: cold dark silhouettes with subtle parallax
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#060e1c';
  ctx.beginPath();
  ctx.moveTo(0, H);
  var distantDrift = Math.sin(time * 0.00003) * 3;
  for (var x = 0; x <= W; x += 6) {
    ctx.lineTo(x, H - 88 - Math.sin((x + distantDrift) * 0.012 + 0.6) * 34 - Math.sin(x * 0.025 + 1.3) * 18);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#99aacc';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (var x = 0; x <= W; x += 6) {
    var peakY = H - 88 - Math.sin((x + distantDrift) * 0.012 + 0.6) * 34 - Math.sin(x * 0.025 + 1.3) * 18;
    ctx.lineTo(x, peakY + 16);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Midground mountains with subtle drift
  var pTime = time * 0.00006;
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#081020';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (var x = 0; x <= W; x += 5) {
    ctx.lineTo(x, H - 66 - Math.sin(x * 0.016 + 2.3 + pTime) * 26 - Math.sin(x * 0.028 + 0.9) * 14);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#aabbcc';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (var x = 0; x <= W; x += 5) {
    var mpeakY = H - 66 - Math.sin(x * 0.016 + 2.3 + pTime) * 26 - Math.sin(x * 0.028 + 0.9) * 14;
    ctx.lineTo(x, mpeakY + 12);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // HC-RD-04: Ground base — capped foreground alpha
  ctx.fillStyle = '#060e1a';
  ctx.globalAlpha = 0.30;  // was 0.92
  ctx.fillRect(0, H - 50, W, 50);
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#8899bb';
  ctx.beginPath();
  ctx.moveTo(0, H - 50);
  var snowSeed = Math.floor(time * 0.002) % 100;
  for (var gx = 0; gx <= W; gx += 4) {
    var sy = H - 50 - 2 - Math.abs(Math.sin(gx * 0.04 + snowSeed)) * 4
              - Math.abs(Math.sin(gx * 0.11 + snowSeed * 1.7)) * 2;
    ctx.lineTo(gx, sy);
  }
  ctx.lineTo(W, H - 46);
  ctx.lineTo(0, H - 46);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // --- CITY PARALLAX LAYER: subtle horizontal micro-drift ---
  var cityDrift = Math.sin(time * 0.00005) * 1;
  ctx.save();
  ctx.translate(cityDrift, 0);

  // City buildings: clean pixel-art skyline with 4 building types
  var buildings = [
    { x: 4,  w: 16, h: 30, t: 0 },
    { x: 22, w: 12, h: 44, t: 3 },
    { x: 38, w: 18, h: 36, t: 1 },
    { x: 60, w: 14, h: 24, t: 0 },
    { x: 78, w: 20, h: 52, t: 2 },
    { x: 102, w: 16, h: 34, t: 0 },
    { x: 122, w: 14, h: 26, t: 0 },
    { x: 140, w: 22, h: 44, t: 1 },
    { x: 166, w: 12, h: 20, t: 0 },
    { x: 182, w: 18, h: 38, t: 0 },
    { x: 204, w: 16, h: 50, t: 2 },
    { x: 224, w: 14, h: 28, t: 0 },
    { x: 242, w: 20, h: 34, t: 1 },
    { x: 266, w: 12, h: 46, t: 3 },
    { x: 282, w: 18, h: 32, t: 0 },
    { x: 304, w: 16, h: 42, t: 2 },
    { x: 324, w: 14, h: 36, t: 0 },
    { x: 342, w: 16, h: 28, t: 0 }
  ];

  ctx.fillStyle = '#060e1c';
  ctx.globalAlpha = 0.30;  // HC-RD-04: was 0.92
  for (var i = 0; i < buildings.length; i++) {
    var b = buildings[i];
    var bx = b.x, bw = b.w, bh = b.h;
    var baseY = H - 50;
    var topY = baseY - bh;

    if (b.t === 0) {
      ctx.fillRect(bx, topY, bw, bh);
    } else if (b.t === 1) {
      var stepH = Math.floor(bh * 0.45);
      ctx.fillRect(bx, topY + stepH, bw, bh - stepH);
      ctx.fillRect(bx + 3, topY, bw - 6, stepH + 4);
    } else if (b.t === 2) {
      ctx.fillRect(bx, topY, bw, bh);
      var spireW = 3;
      var spireH = 14 + (bh > 46 ? 6 : 0);
      ctx.fillRect(bx + bw / 2 - 1, topY - spireH, spireW, spireH);
      ctx.fillRect(bx + bw / 2 - 3, topY - spireH + 4, 7, 2);
    } else if (b.t === 3) {
      ctx.fillRect(bx + 2, topY, bw - 4, bh);
      ctx.fillRect(bx, topY + bh - 6, bw, 6);
    }
  }

  // Snow caps on building roofs
  ctx.globalAlpha = 0.26;
  ctx.fillStyle = '#bbccee';
  for (var i = 0; i < buildings.length; i++) {
    var b = buildings[i];
    var roofY = H - 50 - b.h;
    var capH = 2 + (i % 3);
    if (b.t === 1) {
      var stepH = Math.floor(b.h * 0.45);
      ctx.fillRect(b.x + 3, roofY + stepH - 2, b.w - 6, capH);
    }
    ctx.fillRect(b.x - 1, roofY - 1, b.w + 2, capH);
  }
  ctx.globalAlpha = 1;

  // Minimal attack damage: just a few subtle broken edges
  ctx.globalAlpha = 0.30;  // HC-RD-04: was 0.96
  ctx.fillStyle = '#02050b';
  ctx.fillRect(78 + 5, H - 50 - 52, 6, 8);
  ctx.fillRect(204 + 7, H - 50 - 34, 5, 14);
  ctx.fillRect(266 + 4, H - 50 - 28, 3, 10);
  ctx.globalAlpha = 1;

  // Distant radial fires: very subtle warm glows
  var firePulse = 0.40 + Math.sin(time * 0.005) * 0.12;
  ctx.globalAlpha = 0.07 + firePulse * 0.05;
  var fireGrad = ctx.createRadialGradient(46, H - 58, 0, 46, H - 58, 30);
  fireGrad.addColorStop(0, '#ffaa44');
  fireGrad.addColorStop(0.35, 'rgba(255, 60, 15, 0.40)');
  fireGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = fireGrad;
  ctx.fillRect(16, H - 88, 60, 46);

  ctx.globalAlpha = 0.05 + firePulse * 0.04;
  var fireGrad2 = ctx.createRadialGradient(298, H - 60, 0, 298, H - 60, 26);
  fireGrad2.addColorStop(0, '#ffbb55');
  fireGrad2.addColorStop(0.34, 'rgba(255, 60, 18, 0.35)');
  fireGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = fireGrad2;
  ctx.fillRect(272, H - 86, 52, 44);
  ctx.globalAlpha = 1;

  // Subtle ember particles replacing the old triangular flames
  var emberCount = 10;
  for (var ei = 0; ei < emberCount; ei++) {
    var seed = ei * 137.508 + 42.7;
    var site = ei < 5 ? 0 : 1;
    var baseX = site === 0 ? 48 : 302;
    var baseY = H - 50;
    var riseSpeed = 0.25 + (ei % 4) * 0.12;
    var life = ((time * 0.0006 * riseSpeed) + seed * 0.013) % 1.0;
    var drift = Math.sin(time * 0.0012 + seed * 0.09) * (3 + (ei % 3) * 2);
    var ex = baseX + drift;
    var ey = baseY - life * 32 - 4;
    var alpha = (1 - life) * 0.09 * (life < 0.15 ? life / 0.15 : 1);
    if (alpha > 0.005) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = life < 0.35 ? '#ffcc66' : '#ff6618';
      var es = life < 0.25 ? 2 : 1;
      ctx.fillRect(ex, ey, es, es);
    }
  }
  ctx.globalAlpha = 1;

  // Simplified destroyed foreground silhouettes
  ctx.globalAlpha = 0.30;  // HC-RD-04: was 0.94
  ctx.fillStyle = '#020308';
  ctx.beginPath();
  ctx.moveTo(14, H - 50);
  ctx.lineTo(14, H - 88);
  ctx.lineTo(24, H - 98);
  ctx.lineTo(34, H - 88);
  ctx.lineTo(34, H - 50);
  ctx.closePath();
  ctx.fill();

  ctx.fillRect(270, H - 50 - 52, 7, 52);
  ctx.fillRect(278, H - 50 - 36, 8, 36);

  ctx.globalAlpha = 0.34;
  ctx.fillStyle = '#c8d8ee';
  ctx.fillRect(14, H - 90, 20, 2);
  ctx.fillRect(270, H - 50 - 54, 7, 2);
  ctx.globalAlpha = 1;

  // Military dome/bunker
  ctx.globalAlpha = 0.30;  // HC-RD-04: was 0.90
  ctx.fillStyle = '#060e1c';
  ctx.beginPath();
  ctx.arc(148, H - 50, 20, Math.PI, 0);
  ctx.fillRect(148 - 20, H - 52, 40, 4);
  ctx.fill();
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = '#ccddef';
  ctx.beginPath();
  ctx.arc(148, H - 50, 21, Math.PI + 0.40, Math.PI * 2 - 0.40);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Windows: mostly static, ~30% subtle flicker
  for (var i = 0; i < buildings.length; i++) {
    var b = buildings[i];
    if (b.w < 12 || b.t === 3) continue;
    var rows = Math.floor(b.h / 10);
    for (var r = 0; r < rows; r++) {
      var wy = H - 50 - b.h + 5 + r * 10;
      var isFlickerWindow = ((i * 7 + r * 13) % 10) < 3;
      var flicker = Math.sin(time * 0.0035 + i * 1.7 + r * 0.9);
      var lit;
      if (isFlickerWindow) {
        lit = flicker > -0.25;
      } else {
        lit = ((i + r) % 3 !== 0);
      }
      var alpha = lit ? (isFlickerWindow ? 0.18 + (flicker > 0.3 ? 0.08 : 0) : 0.15) : 0.04;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = lit ? '#ffb840' : '#1a0800';
      if (b.t === 1 && r < Math.floor(b.h * 0.45) / 10) {
        ctx.fillRect(b.x + 5, wy, 2, 2);
      } else {
        ctx.fillRect(b.x + 3, wy, 3, 2);
      }
      ctx.fillRect(b.x + b.w - 6, wy, 3, 2);
      if (b.w >= 18) {
        var cw = lit && flicker > 0.1 ? 3 : 2;
        ctx.fillRect(b.x + b.w / 2 - 1, wy, cw, 2);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Broken glass glints
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#cfefff';
  ctx.fillRect(82, H - 50 - 36, 2, 1);
  ctx.fillRect(208, H - 50 - 24, 2, 1);
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#000000';
  ctx.fillRect(94, H - 50 - 14, 5, 2);
  ctx.fillRect(216, H - 50 - 8, 6, 2);
  ctx.globalAlpha = 1;

  ctx.restore();
  // --- END CITY PARALLAX ---

  // Upper haze: cold blue tint to soften stars
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#020818';
  ctx.fillRect(0, 0, W, H * 0.60);
  ctx.globalAlpha = 1;

  // Winter mist/fog: soft slow drift, two layers
  ctx.globalAlpha = 0.030;
  ctx.fillStyle = '#556677';
  var mistSpeed = time * 0.00008;
  for (var s = 0; s < 7; s++) {
    var sx = ((s * 58 + 10 + mistSpeed * (17 + s * 6)) % (W + 80)) - 40;
    var sy = H - 100 - s * 9;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 22 + s * 4, 10 + s * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.022;
  ctx.fillStyle = '#7788aa';
  var mistSpeed2 = time * 0.00011;
  for (var s = 0; s < 5; s++) {
    var sx2 = ((s * 82 + 50 + mistSpeed2 * (22 - s * 4)) % (W + 90)) - 45;
    var sy2 = H - 82 - s * 7;
    ctx.beginPath();
    ctx.ellipse(sx2, sy2, 28 + s * 3, 13 + s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Smoke: soft, transparent, well-distributed elliptical puffs
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = '#6b7280';
  for (var sm = 0; sm < 8; sm++) {
    var smokeX = sm < 4 ? 40 + sm * 14 : 286 + (sm - 4) * 13;
    var smokeY = H - 88 - sm * 9;
    ctx.beginPath();
    ctx.ellipse(
      smokeX + Math.sin(time * 0.00055 + sm) * 6,
      smokeY - Math.sin(time * 0.0004 + sm) * 8,
      14 + (sm % 3) * 4,
      18 + (sm % 4) * 5,
      -0.2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#353b45';
  ctx.beginPath();
  ctx.ellipse(50 + Math.sin(time * 0.00035) * 4, H - 130, 22, 44, -0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(300 + Math.sin(time * 0.0004) * 3, H - 124, 20, 40, 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Falling snow: subtle, upper half only
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = '#ffffff';
  var snowBase = time * 0.016;
  for (var si = 0; si < 18; si++) {
    var sseed = si * 127.3 + 31.7;
    var sx = ((Math.sin(snowBase * 0.7 + sseed * 0.13) * 0.5 + 0.5) * W + sseed * 7.1) % W;
    var sY = ((snowBase * (1.3 + (si % 5) * 0.2) + sseed * 0.09) * 55) % (H + 40) - 20;
    var sSize = (si % 4 === 0) ? 2 : 1;
    if (sY < H * 0.52) {
      ctx.fillRect(sx, sY, sSize, sSize);
    }
  }
  ctx.globalAlpha = 1;
}

function drawAtmosphereBackground(ctx, time) {
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#020816');
  grad.addColorStop(0.24, '#062248');
  grad.addColorStop(0.52, '#0a5b8e');
  grad.addColorStop(0.76, '#24a0c8');
  grad.addColorStop(1, '#d8853a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Curved Earth haze at the bottom: the player is leaving the planet.
  var horizon = ctx.createLinearGradient(0, H * 0.64, 0, H);
  horizon.addColorStop(0, 'transparent');
  horizon.addColorStop(0.34, 'rgba(120, 220, 255, 0.08)');
  horizon.addColorStop(0.62, 'rgba(255, 185, 95, 0.12)');
  horizon.addColorStop(1, 'rgba(20, 70, 110, 0.28)');
  ctx.fillStyle = horizon;
  ctx.fillRect(0, H * 0.58, W, H * 0.42);

  ctx.globalAlpha = 0.12;  // HC-RD-04: was 0.22 — planet glow subdued
  ctx.fillStyle = '#d8f8ff';
  ctx.beginPath();
  ctx.ellipse(W / 2, H + 118, W * 0.78, 158, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.09;
  ctx.fillStyle = '#ffffff';
  for (var c = 0; c < 8; c++) {
    var cx = ((c * 67 + time * 0.012) % (W + 100)) - 50;
    var cy = H * 0.62 + (c % 4) * 34 + Math.sin(time * 0.0007 + c) * 5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 52 + (c % 3) * 18, 7 + (c % 2) * 3, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // Thin ascent streaks sell speed without adding gameplay clutter.
  ctx.globalAlpha = 0.11;
  ctx.strokeStyle = '#bff6ff';
  ctx.lineWidth = 1;
  for (var s = 0; s < 7; s++) {
    var sx = (s * 53 + time * 0.035) % (W + 60) - 30;
    var sy = (s * 91 + time * 0.06) % (H + 120) - 60;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx - 10, sy + 36);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawOrbitBackground(ctx, time) {
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#010412');
  grad.addColorStop(0.5, '#020c1c');
  grad.addColorStop(0.8, '#031830');
  grad.addColorStop(1, '#0a2848');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  var rimGrad = ctx.createLinearGradient(0, H * 0.52, 0, H);
  rimGrad.addColorStop(0, 'transparent');
  rimGrad.addColorStop(0.42, 'rgba(68, 180, 255, 0.10)');
  rimGrad.addColorStop(0.74, 'rgba(30, 98, 170, 0.20)');
  rimGrad.addColorStop(1, 'rgba(8, 40, 86, 0.34)');
  ctx.globalAlpha = 1;
  ctx.fillStyle = rimGrad;
  ctx.fillRect(0, H * 0.52, W, H * 0.48);

  // Planet limb, larger and lower than gameplay space.
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#8fe8ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(W / 2, H + 165, 335, Math.PI + 0.10, Math.PI * 2 - 0.10);
  ctx.stroke();

  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#42ffbd';
  ctx.lineWidth = 2;
  for (var a = 0; a < 3; a++) {
    ctx.beginPath();
    ctx.arc(W / 2, H + 158 + a * 12, 308 + a * 9, Math.PI + 0.22, Math.PI * 2 - 0.28);
    ctx.stroke();
  }

  // Small orbital debris/satellites high in the safe background area.
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#b8d8ff';
  for (var d = 0; d < 5; d++) {
    var dx = (d * 83 + time * 0.018) % (W + 80) - 40;
    var dy = 58 + (d % 3) * 54;
    ctx.fillRect(dx, dy, 12, 2);
    ctx.fillRect(dx + 5, dy - 4, 2, 10);
  }
  ctx.globalAlpha = 1;
}

function drawDeepSpaceBackground(ctx, time) {
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#030210');
  grad.addColorStop(0.3, '#060318');
  grad.addColorStop(0.6, '#0a0418');
  grad.addColorStop(1, '#100818');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.globalAlpha = 0.055;
  ctx.fillStyle = '#6a2450';
  ctx.beginPath();
  ctx.ellipse(W * 0.25, H * 0.32, 98 + Math.sin(time * 0.0003) * 10, 46, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.045;
  ctx.fillStyle = '#243a78';
  ctx.beginPath();
  ctx.ellipse(W * 0.72, H * 0.55, 88 + Math.sin(time * 0.0004) * 12, 38, 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#103040';
  ctx.beginPath();
  ctx.ellipse(W * 0.52, H * 0.22, 118, 34, 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#6c335c';
  ctx.lineWidth = 2;
  for (var r = 0; r < 4; r++) {
    var rx = W * 0.5 + Math.sin(time * 0.00018 + r) * 14;
    var ry = H * (0.18 + r * 0.16);
    ctx.beginPath();
    ctx.moveTo(rx - 90, ry);
    ctx.bezierCurveTo(rx - 34, ry - 20, rx + 34, ry + 22, rx + 100, ry - 4);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

function drawImperialBackground(ctx, time) {
  var grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#040208');
  grad.addColorStop(0.5, '#060410');
  grad.addColorStop(1, '#0a0410');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  var glowGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
  glowGrad.addColorStop(0, 'transparent');
  glowGrad.addColorStop(1, 'rgba(80, 10, 10, 0.12)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, H * 0.5, W, H * 0.5);

  var pillarPulse = 0.5 + Math.sin(time * 0.0015) * 0.5;
  ctx.globalAlpha = Math.min(0.04, 0.05 + pillarPulse * 0.04);  // HC-RD-04: capped at 0.04
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(8, 0, 3, H);
  ctx.fillRect(W - 11, 0, 3, H);

  ctx.globalAlpha = 0.03 + pillarPulse * 0.025;
  ctx.fillStyle = '#8a2020';
  ctx.fillRect(14, 0, 2, H);
  ctx.fillRect(W - 16, 0, 2, H);

  // Enemy megastructure silhouettes: final stage feels occupied and hostile.
  ctx.globalAlpha = 0.34;
  ctx.fillStyle = '#09060c';
  for (var p = 0; p < 7; p++) {
    var pw = 22 + (p % 3) * 9;
    var ph = 70 + (p % 4) * 28;
    var px = p * 58 - 18;
    ctx.fillRect(px, H - ph, pw, ph);
    ctx.fillRect(px + pw * 0.35, H - ph - 18, pw * 0.30, 18);
  }

  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = '#ff4030';
  ctx.lineWidth = 1;
  for (var g = 0; g < 6; g++) {
    var gy = H - 120 - g * 46 + Math.sin(time * 0.0008 + g) * 4;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy + Math.sin(g) * 10);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.04 + pillarPulse * 0.03;
  var topGlow = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, 160);
  topGlow.addColorStop(0, '#ffd700');
  topGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, W, H * 0.6);

  ctx.globalAlpha = 1;
}

function drawThemedBackground(ctx, levelNum, time) {
  var isWarpMood = pendingNextLevel || warpSpeed > 1.5;
  var isBossMood = boss && boss.active;
  var theme = getBackgroundThemeForLevel(levelNum);

  switch (theme) {
    case 'earth':      drawEarthBackground(ctx, time);      break;
    case 'atmosphere': drawAtmosphereBackground(ctx, time); break;
    case 'orbit':      drawOrbitBackground(ctx, time);      break;
    case 'deepSpace':  drawDeepSpaceBackground(ctx, time);  break;
    case 'imperial':   drawImperialBackground(ctx, time);   break;
    default:           drawEarthBackground(ctx, time);      break;
  }

  if (isWarpMood) {
    var intensity = Math.min(1, (warpSpeed - 1.5) / 4);
    ctx.globalAlpha = 0.08 + intensity * 0.12;
    ctx.fillStyle = '#09f';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  } else if (isBossMood) {
    var hpRatio = boss.hp / boss.maxHp;
    ctx.globalAlpha = 0.10 + (1 - hpRatio) * 0.05;
    ctx.fillStyle = '#02030a';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.025 + (1 - hpRatio) * 0.035;
    ctx.fillStyle = boss.color || '#600';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

// --- HUD HELPERS ---
function drawArcadePanel(x, y, w, h, accentColor) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y + h, w, 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, w, 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.restore();
}

function drawGameplayHudPanel(x, y, w, h, accentColor) {
  ctx.save();
  ctx.globalAlpha = 0.44;
  ctx.fillStyle = '#020611';
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.globalAlpha = 0.10;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.20)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = accentColor;
  ctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  ctx.restore();
}

function drawOverlayPanel(x, y, w, h, accentColor) {
  ctx.save();
  // HC-RD-06: config-driven overlay panel alpha
  var _ovCfg = (typeof getHUDReadabilityConfig === 'function') ? (getHUDReadabilityConfig().overlays || {}) : {};
  var _ovAlpha = (typeof _ovCfg.overlayPanelAlpha === 'number') ? _ovCfg.overlayPanelAlpha : 0.90;
  ctx.fillStyle = 'rgba(2,6,16,' + Math.min(0.82, _ovAlpha) + ')';
  ctx.fillRect(x, y, w, h);

  // Accent glow bars (top / bottom)
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x + 8, y + 5, w - 16, 1);
  ctx.fillRect(x + 8, y + h - 6, w - 16, 1);

  // Outer border
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  // Inner border
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 8.5, y + 8.5, w - 17, h - 17);

  // Corner brackets
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.26;
  ctx.fillRect(x, y + 8, 2, 10);
  ctx.fillRect(x + w - 2, y + 8, 2, 10);
  ctx.fillRect(x, y + h - 18, 2, 10);
  ctx.fillRect(x + w - 2, y + h - 18, 2, 10);

  ctx.restore();
}

function drawGlowText(text, x, y, font, fillColor, glowColor) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  // HC-RD-06: configurable shadow blur
  var _tgCfg = (typeof getHUDReadabilityConfig === 'function') ? (getHUDReadabilityConfig().textGlow || {}) : {};
  var _tgBlur = (typeof _tgCfg.shadowBlurMax === 'number') ? _tgCfg.shadowBlurMax : 5;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = _tgBlur;
  ctx.fillStyle = glowColor;
  ctx.fillText(text, x + 2, y + 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#000';
  ctx.fillText(text, x + 2, y + 3);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

var FLASH_BY_WEAPON = {
  normal: ['#fff', '#ff0'],
  double: ['#ff0', '#ff8'],
  spread: ['#0f0', '#afa'],
  machine: ['#f0f', '#faf'],
  laser: ['#0ff', '#aff']
};

// ================================================================
// HC-RD-03: TELEGRAPH OUTLINE HELPER
// Provides a dark contrast outline for any telegraph stroke,
// ensuring visibility against bright backgrounds.
// ================================================================
function _getTelegraphOutlineStyle() {
  var tc = (typeof getTelegraphConsistencyConfig === 'function')
    ? getTelegraphConsistencyConfig() : null;
  return (tc && tc.outline) || { enabled: true, color: '#050308', alpha: 0.40, lineWidth: 1, bossLineWidth: 1.5 };
}

// ================================================================
// HC-RD-08: SMALL-SCREEN READABILITY BOOST
// On phones/small viewports, increase sprite readability so threats
// remain identifiable despite CSS-scaling compression.
// ================================================================
var _smallScreenBoost = 1.0;
function _updateScreenBoost() {
  _smallScreenBoost = 1.0;
  try {
    var canvas = document.getElementById('game');
    if (!canvas) return;
    var ch = canvas.clientHeight || canvas.getBoundingClientRect().height;
    if (!ch || ch <= 0) return;
    var cfg = (typeof getMobileReadabilityConfig === 'function') ? getMobileReadabilityConfig() : null;
    var ssCfg = (cfg && cfg.smallScreen) || {};
    var threshold = (typeof ssCfg.thresholdHeight === 'number') ? ssCfg.thresholdHeight : 500;
    if (ch < threshold) {
      var bossBoost = (typeof ssCfg.bossScaleBoost === 'number') ? ssCfg.bossScaleBoost : 1.12;
      var enemyBoost = (typeof ssCfg.enemyScaleBoost === 'number') ? ssCfg.enemyScaleBoost : 1.10;
      _smallScreenBoost = Math.max(bossBoost, enemyBoost);
    }
  } catch (e) { /* silent */ }
}

// --- BOSS ARM RENDER HELPERS ---
function drawBossArmSegment(ctx, x1, y1, x2, y2, thickness, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x2, y2, thickness * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBossClaw(ctx, x, y, angle, color, time) {
  var clawLen = 9;
  var clawSpread = 0.28 + Math.sin(time * 0.018 + angle) * 0.12;
  ctx.save();

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle - clawSpread) * clawLen, y + Math.sin(angle - clawSpread) * clawLen);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle + clawSpread) * clawLen, y + Math.sin(angle + clawSpread) * clawLen);
  ctx.stroke();

  ctx.globalAlpha = 0.88;
  ctx.strokeStyle = '#ffe8e0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle - clawSpread) * clawLen * 0.88, y + Math.sin(angle - clawSpread) * clawLen * 0.88);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle + clawSpread) * clawLen * 0.88, y + Math.sin(angle + clawSpread) * clawLen * 0.88);
  ctx.stroke();

  ctx.globalAlpha = 0.45 + Math.sin(time * 0.025) * 0.12;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawArticulatedBossArms(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;

  var flashTimer = boss.flashTimer || 0;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  var lShX = bx + 7;
  var lShY = by + bh * 0.40;
  var rShX = bx + bw - 7;
  var rShY = by + bh * 0.40;

  var spreadMul = phase === 1 ? 1 : phase === 2 ? 1.25 : 1.55;
  var swayMul   = phase === 1 ? 1 : phase === 2 ? 1.4  : 2.0;
  var thickMul  = phase === 1 ? 1 : phase === 2 ? 1.1  : 1.25;
  var glowBoost = phase === 1 ? 0 : phase === 2 ? 0.10 : 0.24;
  var clawAggro = phase === 1 ? 0 : phase === 2 ? 0.10 : 0.22;

  var hitShake = 0;
  var hitSnap = 0;
  var hitBright = 0;
  if (flashTimer > 0) {
    var hitT = Math.min(1, flashTimer / 200);
    hitShake  = Math.sin(time * 0.25 + 0.3) * hitT * 3.5;
    hitSnap   = Math.abs(Math.sin(time * 0.3)) * hitT * 0.38;
    hitBright = hitT * 0.35;
  }

  var swayA = Math.sin(time * 0.011 + 0.6) * 0.20 * swayMul;
  var swayB = Math.sin(time * 0.014 + 1.8) * 0.28 * swayMul;
  var swayC = Math.sin(time * 0.009) * 0.12 * swayMul;

  var upperLen = 26 * spreadMul;
  var foreLen  = 22 * spreadMul;
  var thick    = 5 * thickMul;

  var darkColor = '#2a0000';
  var segAlpha  = 0.82 + glowBoost * 0.4 + hitBright;
  var foreAlpha = 0.78 + glowBoost * 0.4 + hitBright;

  var baseLX  = 21 * spreadMul;
  var baseFWX = 15 * spreadMul;

  // LEFT ARM
  var lElbowX = lShX - baseLX + swayA * 7 + hitShake;
  var lElbowY = lShY - 5 + swayB * 8 + hitShake * 0.5;
  var lWristX = lElbowX - baseFWX + swayB * 5 + hitShake * 1.2;
  var lWristY = lElbowY + 11 + swayC * 7 + hitShake * 0.8;

  drawBossArmSegment(ctx, lShX + 1, lShY + 1, lElbowX + 1, lElbowY + 1, thick, darkColor, 0.55);
  drawBossArmSegment(ctx, lElbowX + 1, lElbowY + 1, lWristX + 1, lWristY + 1, Math.round(thick * 0.8), darkColor, 0.55);
  drawBossArmSegment(ctx, lShX, lShY, lElbowX, lElbowY, thick, color, segAlpha);
  drawBossArmSegment(ctx, lElbowX, lElbowY, lWristX, lWristY, Math.round(thick * 0.78), color, foreAlpha);

  var lClawBase = Math.PI + swayC * 0.5;
  lClawBase += clawAggro * Math.sin(time * 0.04);
  if (hitSnap > 0.08) lClawBase += hitSnap * 0.6;
  drawBossClaw(ctx, lWristX, lWristY, lClawBase, color, time);

  // RIGHT ARM
  var rElbowX = rShX + baseLX - swayA * 7 - hitShake;
  var rElbowY = rShY - 5 + swayB * 8 + hitShake * 0.5;
  var rWristX = rElbowX + baseFWX - swayB * 5 - hitShake * 1.2;
  var rWristY = rElbowY + 11 + swayC * 7 + hitShake * 0.8;

  drawBossArmSegment(ctx, rShX + 1, rShY + 1, rElbowX + 1, rElbowY + 1, thick, darkColor, 0.55);
  drawBossArmSegment(ctx, rElbowX + 1, rElbowY + 1, rWristX + 1, rWristY + 1, Math.round(thick * 0.8), darkColor, 0.55);
  drawBossArmSegment(ctx, rShX, rShY, rElbowX, rElbowY, thick, color, segAlpha);
  drawBossArmSegment(ctx, rElbowX, rElbowY, rWristX, rWristY, Math.round(thick * 0.78), color, foreAlpha);

  var rClawBase = 0 + swayC * 0.5;
  rClawBase += clawAggro * Math.sin(time * 0.04 + 1);
  if (hitSnap > 0.08) rClawBase -= hitSnap * 0.6;
  drawBossClaw(ctx, rWristX, rWristY, rClawBase, color, time);

  // Phase 2+ : joint glow
  if (phase >= 2) {
    var jointAlpha = 0.10 + Math.sin(time * 0.035) * 0.06;
    ctx.save();
    ctx.globalAlpha = jointAlpha;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(lElbowX, lElbowY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rElbowX, rElbowY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Phase 3 : claw tip energy burst
  if (phase >= 3) {
    var tipPulse = 0.28 + Math.sin(time * 0.055) * 0.18;
    ctx.save();
    ctx.globalAlpha = tipPulse;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(lWristX, lWristY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rWristX, rWristY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawCrabtronArmorPlates(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var sway = Math.sin(time * 0.013 + 0.8) * 0.16;
  var pulse = 0.7 + Math.sin(time * 0.02) * 0.3;
  var hornSway = Math.sin(time * 0.016 + 0.3) * 0.18;

  var hitShake = 0;
  if (flashTimer > 0) {
    var hitT = Math.min(1, flashTimer / 200);
    hitShake = Math.sin(time * 0.25) * hitT * 2.2;
  }

  var plateBase = '#2a0000';
  var plateEdge = color;

  // Phase intensity
  var plateAlpha = phase === 1 ? 0.58 : phase === 2 ? 0.66 : 0.76;
  var edgeAlpha  = phase === 1 ? 0.72 : phase === 2 ? 0.80 : 0.90;

  ctx.save();

  // EXTRA OUTER SHADOW GLOW
  ctx.globalAlpha = 0.14 + Math.sin(time * 0.018) * 0.04;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(bx - 12, by - 10, bw + 24, bh + 20);
  ctx.fill();

  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.rect(bx - 8, by - 6, bw + 16, bh + 14);
  ctx.fill();

  // LEFT SHOULDER PLATE
  ctx.globalAlpha = plateAlpha + sway * 0.10;
  ctx.fillStyle = plateBase;
  ctx.strokeStyle = plateEdge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx + 4 + hitShake, by + 5);
  ctx.lineTo(bx - 12 + sway * 5 + hitShake, by - 3 + sway * 3);
  ctx.lineTo(bx - 7 + sway * 3 + hitShake, by + 17 + sway * 1.5);
  ctx.lineTo(bx + 15 + hitShake, by + 13);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = edgeAlpha + sway * 0.08;
  ctx.stroke();

  // Left plate inner highlight
  ctx.globalAlpha = 0.14 + pulse * 0.08;
  ctx.fillStyle = plateEdge;
  ctx.beginPath();
  ctx.moveTo(bx + 7 + hitShake, by + 7);
  ctx.lineTo(bx - 7 + sway * 5 + hitShake, by + 0 + sway * 3);
  ctx.lineTo(bx - 4 + sway * 3 + hitShake, by + 14 + sway * 1.5);
  ctx.lineTo(bx + 13 + hitShake, by + 11);
  ctx.closePath();
  ctx.fill();

  // RIGHT SHOULDER PLATE
  ctx.globalAlpha = plateAlpha + sway * 0.10;
  ctx.fillStyle = plateBase;
  ctx.strokeStyle = plateEdge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bx + bw - 4 - hitShake, by + 5);
  ctx.lineTo(bx + bw + 12 - sway * 5 - hitShake, by - 3 + sway * 3);
  ctx.lineTo(bx + bw + 7 - sway * 3 - hitShake, by + 17 + sway * 1.5);
  ctx.lineTo(bx + bw - 15 - hitShake, by + 13);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = edgeAlpha + sway * 0.08;
  ctx.stroke();

  // Right plate inner highlight
  ctx.globalAlpha = 0.14 + pulse * 0.08;
  ctx.fillStyle = plateEdge;
  ctx.beginPath();
  ctx.moveTo(bx + bw - 7 - hitShake, by + 7);
  ctx.lineTo(bx + bw + 7 - sway * 5 - hitShake, by + 0 + sway * 3);
  ctx.lineTo(bx + bw + 4 - sway * 3 - hitShake, by + 14 + sway * 1.5);
  ctx.lineTo(bx + bw - 13 - hitShake, by + 11);
  ctx.closePath();
  ctx.fill();

  // LEFT HORN
  ctx.globalAlpha = 0.70 + sway * 0.12;
  ctx.fillStyle = plateBase;
  ctx.strokeStyle = plateEdge;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx + 26 + hitShake * 0.6, by + 7);
  ctx.quadraticCurveTo(bx + 20 + sway * 5 + hitShake * 0.6, by - 2, bx + 12 + sway * 7 + hornSway * 4 + hitShake * 0.6, by - 16 + hornSway * 3);
  ctx.lineTo(bx + 32 + hitShake * 0.6, by + 3);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = edgeAlpha;
  ctx.stroke();

  // Left horn tip glow
  ctx.globalAlpha = 0.30 + pulse * 0.15;
  ctx.fillStyle = plateEdge;
  ctx.beginPath();
  ctx.arc(bx + 12 + sway * 7 + hornSway * 4 + hitShake * 0.6, by - 16 + hornSway * 3, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // RIGHT HORN
  ctx.globalAlpha = 0.70 + sway * 0.12;
  ctx.fillStyle = plateBase;
  ctx.strokeStyle = plateEdge;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx + bw - 26 - hitShake * 0.6, by + 7);
  ctx.quadraticCurveTo(bx + bw - 20 - sway * 5 - hitShake * 0.6, by - 2, bx + bw - 12 - sway * 7 - hornSway * 4 - hitShake * 0.6, by - 16 + hornSway * 3);
  ctx.lineTo(bx + bw - 32 - hitShake * 0.6, by + 3);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = edgeAlpha;
  ctx.stroke();

  // Right horn tip glow
  ctx.globalAlpha = 0.30 + pulse * 0.15;
  ctx.fillStyle = plateEdge;
  ctx.beginPath();
  ctx.arc(bx + bw - 12 - sway * 7 - hornSway * 4 - hitShake * 0.6, by - 16 + hornSway * 3, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // BOTTOM SKIRTS
  ctx.globalAlpha = plateAlpha - 0.08;
  ctx.fillStyle = plateBase;
  ctx.strokeStyle = plateEdge;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(bx + 1 + hitShake * 0.4, by + bh - 1);
  ctx.lineTo(bx - 4 + hitShake * 0.4, by + bh + 7 + sway * 2);
  ctx.lineTo(bx + 8 + hitShake * 0.4, by + bh + 5 + sway * 2);
  ctx.lineTo(bx + 15 + hitShake * 0.4, by + bh - 3);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = edgeAlpha - 0.08;
  ctx.stroke();

  ctx.globalAlpha = plateAlpha - 0.08;
  ctx.fillStyle = plateBase;
  ctx.beginPath();
  ctx.moveTo(bx + bw - 1 - hitShake * 0.4, by + bh - 1);
  ctx.lineTo(bx + bw + 4 - hitShake * 0.4, by + bh + 7 + sway * 2);
  ctx.lineTo(bx + bw - 8 - hitShake * 0.4, by + bh + 5 + sway * 2);
  ctx.lineTo(bx + bw - 15 - hitShake * 0.4, by + bh - 3);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = edgeAlpha - 0.08;
  ctx.stroke();

  ctx.restore();
}

function drawCrabtronCore(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  var coreCX = bx + bw * 0.5;
  var coreCY = by + bh * 0.47;
  var pulse = 0.65 + Math.sin(time * 0.025) * 0.35;
  var pulseFast = 0.55 + Math.sin(time * 0.052 + 1.3) * 0.45;

  var sizeMul = phase === 1 ? 1 : phase === 2 ? 1.15 : 1.35;
  var alphaMul = phase === 1 ? 1 : phase === 2 ? 1.3 : 1.7;

  ctx.save();

  // Outer aura
  var auraR = 14 * sizeMul + Math.sin(time * 0.018) * 2;
  ctx.globalAlpha = 0.08 * pulse * alphaMul;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(coreCX, coreCY, auraR + 5, 0, Math.PI * 2);
  ctx.fill();

  // Mid glow ring
  ctx.globalAlpha = 0.16 * pulse * alphaMul;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(coreCX, coreCY, auraR + 1, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.globalAlpha = 0.52 * pulseFast;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(coreCX, coreCY, auraR, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.globalAlpha = 0.68 * pulseFast;
  ctx.strokeStyle = '#ffe8d0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(coreCX, coreCY, auraR - 3.5, 0, Math.PI * 2);
  ctx.stroke();

  // Core fill
  var fillR = 5 * sizeMul;
  ctx.globalAlpha = 0.80 * pulseFast * alphaMul;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(coreCX, coreCY, fillR, 0, Math.PI * 2);
  ctx.fill();

  // Core center point
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(coreCX, coreCY, fillR * 0.50, 0, Math.PI * 2);
  ctx.fill();

  // Mechanical slots
  ctx.globalAlpha = 0.32 * pulse;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (var i = 0; i < 6; i++) {
    var a = (Math.PI * 2 * i) / 6 + time * 0.002;
    var sl = 5 * sizeMul;
    var sd = auraR + 7;
    var sx = coreCX + Math.cos(a) * sd;
    var sy = coreCY + Math.sin(a) * sd;
    ctx.beginPath();
    ctx.moveTo(sx - Math.cos(a + Math.PI * 0.5) * sl * 0.5, sy - Math.sin(a + Math.PI * 0.5) * sl * 0.5);
    ctx.lineTo(sx + Math.cos(a + Math.PI * 0.5) * sl * 0.5, sy + Math.sin(a + Math.PI * 0.5) * sl * 0.5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCrabtronMuzzleFlash(ctx, boss, color, time) {
  var bx = boss.x, by = boss.y, bw = boss.w, bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  var spreadMul = phase === 1 ? 1 : phase === 2 ? 1.25 : 1.55;
  var swayMul = phase === 1 ? 1 : phase === 2 ? 1.4 : 2.0;
  var swayA = Math.sin(time * 0.011 + 0.6) * 0.20 * swayMul;
  var swayB = Math.sin(time * 0.014 + 1.8) * 0.28 * swayMul;
  var swayC = Math.sin(time * 0.009) * 0.12 * swayMul;
  var baseLX = 21 * spreadMul;
  var baseFWX = 15 * spreadMul;

  var lShX = bx + 7, lShY = by + bh * 0.40;
  var lElbowX = lShX - baseLX + swayA * 7;
  var lElbowY = lShY - 5 + swayB * 8;
  var lwX = lElbowX - baseFWX + swayB * 5;
  var lwY = lElbowY + 11 + swayC * 7;

  var rShX = bx + bw - 7, rShY = by + bh * 0.40;
  var rElbowX = rShX + baseLX - swayA * 7;
  var rElbowY = rShY - 5 + swayB * 8;
  var rwX = rElbowX + baseFWX - swayB * 5;
  var rwY = rElbowY + 11 + swayC * 7;

  var shotAge = boss.shootTimer || 9999;
  var isRecentShot = shotAge < 220;
  var flashIntensity = isRecentShot ? 1 - shotAge / 220 : 0;

  ctx.save();

  var portAlpha = 0.05 + Math.sin(time * 0.022) * 0.03 + phase * 0.025;
  ctx.globalAlpha = portAlpha;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(lwX, lwY, 9, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(rwX, rwY, 9, 0, Math.PI * 2); ctx.fill();

  ctx.globalAlpha = portAlpha * 0.8;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(lwX, lwY, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(rwX, rwY, 3.5, 0, Math.PI * 2); ctx.fill();

  if (isRecentShot) {
    var flashR = 4 + flashIntensity * 15;

    ctx.globalAlpha = flashIntensity * 0.32;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(lwX, lwY, flashR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rwX, rwY, flashR, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = flashIntensity * 0.55;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(lwX, lwY, flashR * 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rwX, rwY, flashR * 0.6, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = flashIntensity * 0.88;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(lwX, lwY, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rwX, rwY, 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = flashIntensity * 0.35;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lwX, lwY);
    ctx.lineTo(lwX - flashR * 1.2, lwY + flashR * 0.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rwX, rwY);
    ctx.lineTo(rwX + flashR * 1.2, rwY + flashR * 0.6);
    ctx.stroke();
  }

  ctx.restore();
}

function drawCrabtronShootTelegraph(ctx, boss, color, time) {
  var phase = boss.phase || 1;
  var shootRate = Math.max(600, 1800 - level * 40);
  if (phase >= 3) shootRate *= 0.6;

  var chargePct = (boss.shootTimer || 0) / shootRate;
  var active = chargePct > 0.7 && !boss.dashMode;
  if (!active) return;

  var t = Math.min(1, Math.max(0, (chargePct - 0.7) / 0.3));

  var bx = boss.x, by = boss.y, bw = boss.w, bh = boss.h;
  var spreadMul = phase === 1 ? 1 : phase === 2 ? 1.25 : 1.55;
  var swayMul = phase === 1 ? 1 : phase === 2 ? 1.4 : 2.0;
  var swayA = Math.sin(time * 0.011 + 0.6) * 0.20 * swayMul;
  var swayB = Math.sin(time * 0.014 + 1.8) * 0.28 * swayMul;
  var swayC = Math.sin(time * 0.009) * 0.12 * swayMul;
  var baseLX = 21 * spreadMul;
  var baseFWX = 15 * spreadMul;

  var lShX = bx + 7, lShY = by + bh * 0.40;
  var lElbowX = lShX - baseLX + swayA * 7;
  var lElbowY = lShY - 5 + swayB * 8;
  var lwX = lElbowX - baseFWX + swayB * 5;
  var lwY = lElbowY + 11 + swayC * 7;

  var rShX = bx + bw - 7, rShY = by + bh * 0.40;
  var rElbowX = rShX + baseLX - swayA * 7;
  var rElbowY = rShY - 5 + swayB * 8;
  var rwX = rElbowX + baseFWX - swayB * 5;
  var rwY = rElbowY + 11 + swayC * 7;

  var ringPulse = Math.sin(time * 0.03 + t * 6) * 0.15 + 0.85;

  ctx.save();

  var auraR = 5 + t * 16;
  ctx.globalAlpha = t * 0.09 * ringPulse;
  ctx.fillStyle = color;
  ctx.fillRect(lwX - auraR * 0.55, lwY - 2, auraR * 1.1, 4);
  ctx.fillRect(rwX - auraR * 0.55, rwY - 2, auraR * 1.1, 4);

  ctx.globalAlpha = t * 0.24 * ringPulse;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(lwX - auraR * 0.42, lwY - auraR * 0.25, auraR * 0.84, auraR * 0.50);
  ctx.strokeRect(rwX - auraR * 0.42, rwY - auraR * 0.25, auraR * 0.84, auraR * 0.50);

  ctx.globalAlpha = t * 0.36 * ringPulse;
  ctx.strokeStyle = '#ffe8d0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lwX - auraR * 0.35, lwY);
  ctx.lineTo(lwX + auraR * 0.35, lwY);
  ctx.moveTo(rwX - auraR * 0.35, rwY);
  ctx.lineTo(rwX + auraR * 0.35, rwY);
  ctx.stroke();

  if (t > 0.5) {
    var coreT = (t - 0.5) / 0.5;
    ctx.globalAlpha = coreT * 0.75 * ringPulse;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(lwX, lwY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(rwX, rwY, 3, 0, Math.PI * 2); ctx.fill();
  }

  if (t > 0.6) {
    var lineT = (t - 0.6) / 0.4;
    ctx.globalAlpha = lineT * 0.14;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lwX - auraR * 0.7, lwY - auraR * 0.3);
    ctx.lineTo(lwX - auraR * 1.1, lwY + auraR * 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rwX + auraR * 0.7, rwY - auraR * 0.3);
    ctx.lineTo(rwX + auraR * 1.1, rwY + auraR * 0.4);
    ctx.stroke();
  }

  ctx.restore();
}

// HC-165: dash direction arrow visible during dashMode === 'telegraph'
function drawCrabtronDashTelegraph(ctx, boss, color, time) {
  if (!boss || boss.dashMode !== 'telegraph') return;
  var _tcs8 = _getTelegraphOutlineStyle();
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var tx = boss.dashTargetX || cx;
  var dir = tx > cx ? 1 : -1;
  var progress = 1 - Math.min(1, (boss._dashTelegraphTimer || 0) / 200);
  var alpha = 0.18 + Math.sin(progress * Math.PI) * 0.22;

  ctx.save();
  // HC-RD-03: dark outline behind dash arrow
  ctx.globalAlpha = _tcs8.alpha;
  ctx.strokeStyle = _tcs8.color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cx + dir * 10, cy);
  ctx.lineTo(cx + dir * 34, cy - 10);
  ctx.moveTo(cx + dir * 10, cy);
  ctx.lineTo(cx + dir * 34, cy + 10);
  ctx.stroke();

  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff6633';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + dir * 10, cy);
  ctx.lineTo(cx + dir * 34, cy - 10);
  ctx.moveTo(cx + dir * 10, cy);
  ctx.lineTo(cx + dir * 34, cy + 10);
  ctx.stroke();

  ctx.strokeStyle = '#ffaa66';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + dir * 12, cy);
  ctx.lineTo(cx + dir * 28, cy);
  ctx.stroke();
  ctx.restore();
}

// --- HC-VS-03D3: CRABTRON HERO STATE RESOLVER (presentation-enhanced) ---
function resolveCrabtronHeroState(boss) {
  if (!boss || !boss.active) {
    if (boss && typeof boss._deathUntil === 'number' && (typeof globalTime === 'number' ? globalTime : 0) < boss._deathUntil) return 'death_exposed_core';
    return 'idle';
  }

  // Priority: death > rage_phase > mid_damage > attack_windup > idle

  if (boss.phase === 3) return 'rage_phase';

  if (boss.flashTimer > 0) return 'mid_damage';

  if (boss.dashMode === 'telegraph' || boss.dashMode === true) return 'attack_windup';

  var shootRate = 600;
  if (boss.maxHp > 0) {
    var hpPct = boss.hp / boss.maxHp;
    var phase = hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3;
    shootRate = Math.max(600, 1800 - (typeof level === 'number' ? level : 5) * 40);
    if (phase >= 3) shootRate *= 0.6;
  }
  if (boss.shootTimer > shootRate * 0.7) return 'attack_windup';

  if (boss._hcTelegraphType && boss._hcTelegraphTimer > 0) return 'attack_windup';

  return 'idle';
}

// --- HC-SPRITE-SERPENTRIX-03: SERPENTRIX HERO STATE RESOLVER (presentation-enhanced) ---
function resolveSerpentrixHeroState(boss) {
  if (!boss || !boss.active) {
    if (boss && typeof boss._deathUntil === 'number' && (typeof globalTime === 'number' ? globalTime : 0) < boss._deathUntil) return 'death_collapse';
    return 'idle_coil';
  }

  // Priority: death_collapse > rage_phase > attack_windup > venom_charge > idle_coil

  if (boss.phase === 3) return 'rage_phase';

  if (boss.flashTimer > 0) return 'attack_windup';

  var shootRate = 600;
  if (boss.maxHp > 0) {
    var hpPct = boss.hp / boss.maxHp;
    var phase = hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3;
    shootRate = Math.max(600, 1800 - (typeof level === 'number' ? level : 5) * 40);
    if (phase >= 3) shootRate *= 0.6;
  }
  if (boss.shootTimer > shootRate * 0.7) return 'venom_charge';

  if (boss._hcTelegraphType && boss._hcTelegraphTimer > 0) return 'attack_windup';

  return 'idle_coil';
}

// --- HC-VS-03D3: CRABTRON HERO LAYERED DRAW (presentation pass) ---
function drawCrabtronHeroLayers(ctx, boss, state, scale) {
  if (!ctx || !boss) return;
  if (typeof getCrabtronHeroFrame !== 'function') return;

  var spriteId = 'boss_crabtron_hero';
  if (!window.SpriteSystem || !window.SpriteSystem.isSpriteReady(spriteId)) return;

  var safeState = state || 'idle';
  var safeScale = (typeof scale === 'number' && isFinite(scale) && scale > 0) ? scale : 0.55;

  var meta = (typeof getCrabtronHeroMeta === 'function') ? getCrabtronHeroMeta() : null;
  if (!meta) return;

  var pivot = meta.pivot || [96, 96];
  var anchorX = pivot[0] / meta.frameW;
  var anchorY = pivot[1] / meta.frameH;

  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var t = (typeof globalTime === 'number' ? globalTime : 0);

  // === State-driven overlay alpha ===
  var ovAlpha;
  switch (safeState) {
    case 'attack_windup':
      ovAlpha = 0.18 + Math.sin(t * 0.042 + 0.6) * 0.10; // building tension
      break;
    case 'mid_damage':
      ovAlpha = 0.28 + Math.abs(Math.sin(t * 0.058)) * 0.22; // damage flicker
      break;
    case 'rage_phase':
      ovAlpha = 0.44 + Math.sin(t * 0.048) * 0.12; // aggressive throb
      break;
    case 'death_exposed_core':
      ovAlpha = 0.58 + Math.abs(Math.sin(t * 0.075 + 1.3)) * 0.22; // collapse flicker
      break;
    default: // idle
      ovAlpha = 0.05 + Math.sin(t * 0.013) * 0.04; // subtle breathing
      break;
  }
  if (boss.flashTimer > 0) ovAlpha += 0.10;
  ovAlpha = Math.min(0.80, ovAlpha);
  if (_smallScreenBoost > 1.0) ovAlpha *= 0.78;

  // === State-driven core pulse ===
  var coreFreq, coreBase, coreAmp;
  switch (safeState) {
    case 'attack_windup':
      coreFreq = 0.038; coreBase = 0.55; coreAmp = 0.38;
      break;
    case 'mid_damage':
      coreFreq = 0.052; coreBase = 0.48; coreAmp = 0.42;
      break;
    case 'rage_phase':
      coreFreq = 0.050; coreBase = 0.68; coreAmp = 0.28;
      break;
    case 'death_exposed_core':
      coreFreq = 0.068; coreBase = 0.65; coreAmp = 0.33;
      break;
    default: // idle
      coreFreq = 0.024; coreBase = 0.45; coreAmp = 0.32;
      break;
  }
  var corePulse = 0.5 + 0.5 * Math.sin(t * coreFreq + (safeState === 'mid_damage' ? t * 0.01 : 0));
  var coreAlpha = coreBase + corePulse * coreAmp;

  // === State-driven shadow alpha ===
  var shadowAlpha = 0.26;
  if (safeState === 'attack_windup') shadowAlpha = 0.32;
  if (safeState === 'rage_phase') shadowAlpha = 0.36;
  if (safeState === 'death_exposed_core') shadowAlpha = 0.40;

  // === Claw micro-motion offsets (presentation-only, no gameplay effect) ===
  var lClawOX = 0, lClawOY = 0;
  var rClawOX = 0, rClawOY = 0;
  if (safeState === 'attack_windup') {
    lClawOX = Math.sin(t * 0.045) * 1.4;
    lClawOY = Math.cos(t * 0.045) * 0.7;
    rClawOX = Math.sin(t * 0.045 + 0.6) * 1.4;
    rClawOY = Math.cos(t * 0.045 + 0.6) * 0.7;
  } else if (safeState === 'rage_phase') {
    lClawOX = Math.sin(t * 0.065 + 0.3) * 1.8;
    rClawOX = Math.sin(t * 0.065 + 1.5) * 1.8;
  }

  var ventOY = (safeState === 'attack_windup') ? Math.sin(t * 0.055) * 1.0 : 0;
  var overlayOY = (safeState === 'rage_phase') ? Math.sin(t * 0.032) * 1.2 : 0;

  // === Z-ordered layer draw ===
  var drawOrder = ['shadow', 'body', 'left_claw', 'right_claw', 'cannons_vents', 'weakpoint_core', 'overlay_glow_damage'];

  for (var i = 0; i < drawOrder.length; i++) {
    var layer = drawOrder[i];
    var frame = getCrabtronHeroFrame(safeState, layer);
    if (frame < 0) continue;

    var alpha = 1;
    var ox = 0, oy = 0;

    if (layer === 'shadow') {
      alpha = shadowAlpha;
      oy = 2;
    } else if (layer === 'left_claw') {
      ox = lClawOX; oy = lClawOY;
    } else if (layer === 'right_claw') {
      ox = rClawOX; oy = rClawOY;
    } else if (layer === 'cannons_vents') {
      oy = ventOY;
    } else if (layer === 'weakpoint_core') {
      alpha = coreAlpha;
    } else if (layer === 'overlay_glow_damage') {
      alpha = ovAlpha;
      oy = overlayOY;
    }

    if (alpha <= 0.005) continue;

    window.drawSpriteFrame(ctx, spriteId, cx + ox, cy + oy, {
      frame: frame,
      scale: safeScale,
      anchorX: anchorX,
      anchorY: anchorY,
      alpha: alpha
    });
  }
}

// --- HC-SPRITE-SERPENTRIX-03: SERPENTRIX HERO LAYERED DRAW (presentation pass) ---
function drawSerpentrixHeroLayers(ctx, boss, state, scale) {
  if (!ctx || !boss) return;
  if (typeof getSerpentrixHeroFrame !== 'function') return;

  var spriteId = 'boss_serpentrix_hero';
  if (!window.SpriteSystem || !window.SpriteSystem.isSpriteReady(spriteId)) return;

  var safeState = state || 'idle_coil';
  var safeScale = (typeof scale === 'number' && isFinite(scale) && scale > 0) ? scale : 0.55;

  var meta = (typeof getSerpentrixHeroMeta === 'function') ? getSerpentrixHeroMeta() : null;
  if (!meta) return;

  var pivot = meta.pivot || [96, 96];
  var anchorX = pivot[0] / meta.frameW;
  var anchorY = pivot[1] / meta.frameH;

  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var t = (typeof globalTime === 'number' ? globalTime : 0);

  // === State-driven overlay alpha ===
  var ovAlpha;
  switch (safeState) {
    case 'attack_windup':
      ovAlpha = 0.18 + Math.sin(t * 0.042 + 0.6) * 0.10;
      break;
    case 'venom_charge':
      ovAlpha = 0.32 + Math.abs(Math.sin(t * 0.055)) * 0.18;
      break;
    case 'rage_phase':
      ovAlpha = 0.44 + Math.sin(t * 0.048) * 0.12;
      break;
    case 'death_collapse':
      ovAlpha = 0.58 + Math.abs(Math.sin(t * 0.075 + 1.3)) * 0.22;
      break;
    default:
      ovAlpha = 0.05 + Math.sin(t * 0.013) * 0.04;
      break;
  }
  if (boss.flashTimer > 0) ovAlpha += 0.10;
  ovAlpha = Math.min(0.80, ovAlpha);
  if (_smallScreenBoost > 1.0) ovAlpha *= 0.78;

  // === State-driven eye glow ===
  var eyeFreq, eyeBase, eyeAmp;
  switch (safeState) {
    case 'attack_windup':
      eyeFreq = 0.042; eyeBase = 0.58; eyeAmp = 0.30;
      break;
    case 'venom_charge':
      eyeFreq = 0.055; eyeBase = 0.65; eyeAmp = 0.30;
      break;
    case 'rage_phase':
      eyeFreq = 0.050; eyeBase = 0.72; eyeAmp = 0.24;
      break;
    case 'death_collapse':
      eyeFreq = 0.068; eyeBase = 0.55; eyeAmp = 0.40;
      break;
    default:
      eyeFreq = 0.024; eyeBase = 0.48; eyeAmp = 0.28;
      break;
  }
  var eyePulse = 0.5 + 0.5 * Math.sin(t * eyeFreq + (safeState === 'venom_charge' ? t * 0.01 : 0));
  var eyeAlpha = eyeBase + eyePulse * eyeAmp;

  // === State-driven fangs/venom alpha ===
  var fangsAlpha;
  switch (safeState) {
    case 'venom_charge':
      fangsAlpha = 0.82 + Math.abs(Math.sin(t * 0.058)) * 0.16;
      break;
    case 'rage_phase':
      fangsAlpha = 0.88 + Math.sin(t * 0.045) * 0.10;
      break;
    case 'death_collapse':
      fangsAlpha = 0.38 + Math.abs(Math.sin(t * 0.062)) * 0.28;
      break;
    default:
      fangsAlpha = 0.65 + Math.sin(t * 0.022) * 0.12;
      break;
  }

  // === State-driven shadow alpha ===
  var shadowAlpha = 0.26;
  if (safeState === 'attack_windup') shadowAlpha = 0.32;
  if (safeState === 'rage_phase') shadowAlpha = 0.36;
  if (safeState === 'death_collapse') shadowAlpha = 0.40;

  // === Tail coil micro-motion ===
  var tailOX = 0, tailOY = 0;
  if (safeState === 'idle_coil') {
    tailOX = Math.sin(t * 0.018) * 1.2;
    tailOY = Math.cos(t * 0.018) * 0.8;
  } else if (safeState === 'attack_windup') {
    tailOX = Math.sin(t * 0.042) * 2.0;
    tailOY = Math.cos(t * 0.042) * 1.2;
  } else if (safeState === 'rage_phase') {
    tailOX = Math.sin(t * 0.060 + 0.4) * 2.5;
    tailOY = Math.cos(t * 0.060 + 0.4) * 1.4;
  }

  // === Head micro-motion ===
  var headOX = 0, headOY = 0;
  if (safeState === 'attack_windup') {
    headOX = Math.sin(t * 0.048 + 0.8) * 1.3;
    headOY = Math.cos(t * 0.048 + 0.8) * 0.7;
  } else if (safeState === 'venom_charge') {
    headOY = Math.sin(t * 0.052) * 0.6;
  } else if (safeState === 'rage_phase') {
    headOX = Math.sin(t * 0.065 + 0.3) * 1.6;
  }

  var overlayOY = (safeState === 'rage_phase') ? Math.sin(t * 0.032) * 1.2 : 0;

  // === Z-ordered layer draw ===
  var drawOrder = ['shadow', 'tail_coils', 'body', 'scales_armor', 'head', 'fangs_venom', 'eyes_glow', 'overlay_damage'];

  for (var i = 0; i < drawOrder.length; i++) {
    var layer = drawOrder[i];
    var frame = getSerpentrixHeroFrame(safeState, layer);
    if (frame < 0) continue;

    var alpha = 1;
    var ox = 0, oy = 0;

    if (layer === 'shadow') {
      alpha = shadowAlpha;
      oy = 2;
    } else if (layer === 'tail_coils') {
      ox = tailOX; oy = tailOY;
    } else if (layer === 'head') {
      ox = headOX; oy = headOY;
    } else if (layer === 'fangs_venom') {
      alpha = fangsAlpha;
    } else if (layer === 'eyes_glow') {
      alpha = eyeAlpha;
    } else if (layer === 'overlay_damage') {
      alpha = ovAlpha;
      oy = overlayOY;
    }

    if (alpha <= 0.005) continue;

    window.drawSpriteFrame(ctx, spriteId, cx + ox, cy + oy, {
      frame: frame,
      scale: safeScale,
      anchorX: anchorX,
      anchorY: anchorY,
      alpha: alpha
    });
  }
}

// --- SERPENTRIX VISUALS ---
function drawSerpentrixAura(ctx, boss, color, time) {
  var _auraMax = (typeof getFreezeAuditConfig === 'function') ? (getFreezeAuditConfig().bossAuraCap || 0.30) : 0.30;
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var pulse = 0.55 + Math.sin(time * 0.02) * 0.45;
  var pFast = 0.5 + Math.sin(time * 0.045) * 0.5;
  var pm = phase === 1 ? 1 : phase === 2 ? 1.35 : 1.8;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitAlpha = hitT * 0.18;
  var hitShake = Math.sin(time * 0.3) * hitT * 2.5;

  ctx.save();

  ctx.globalAlpha = Math.min(_auraMax, (0.05 + hitAlpha) * pulse * pm); // HC-RD-07: aura cap
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake, cy, boss.w * 0.55, boss.h * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.10 + hitAlpha * 1.3) * pFast * pm;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.7, cy, boss.w * 0.38, boss.h * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.18 + hitAlpha * 1.5) * pFast;
  ctx.strokeStyle = '#bbffbb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.5, cy, boss.w * 0.35, boss.h * 0.52, 0, 0, Math.PI * 2);
  ctx.stroke();

  for (var i = 0; i < 5; i++) {
    var a = (Math.PI * 2 * i / 5) + time * 0.0025;
    var r = boss.w * 0.42 + Math.sin(time * 0.028 + i) * 6;
    var ox = cx + Math.cos(a) * r;
    var oy = cy + Math.sin(a) * r * 0.6;
    ctx.globalAlpha = (0.22 + Math.sin(time * 0.04 + i) * 0.14) * pFast * pm;
    ctx.fillStyle = '#ccff88';
    ctx.beginPath();
    ctx.arc(ox, oy, 2.5 + Math.sin(time * 0.035 + i) * 1, 0, Math.PI * 2);
    ctx.fill();
  }

  if (phase >= 3) {
    ctx.globalAlpha = 0.07 * pFast;
    ctx.fillStyle = '#44ff44';
    for (var s = 0; s < 12; s++) {
      var sa = (Math.PI * 2 * s / 12) + time * 0.001;
      var sr = boss.w * 0.35 + Math.sin(time * 0.02 + s) * 15;
      var sx = cx + Math.cos(sa) * sr;
      var sy = cy + Math.sin(sa) * sr * 0.55;
      ctx.fillRect(sx, sy, 2, 2);
    }
  }

  ctx.restore();
}

function drawSerpentrixEyes(ctx, boss, color, time) {
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitBlink = flashTimer > 0 && Math.floor(time / 80) % 2 === 0;

  var leftEyeCX = boss.x + 25;
  var rightEyeCX = boss.x + boss.w - 25;
  var eyeCY = boss.y + 7.5;
  var eyeR = 4;

  var pulse = 0.6 + Math.sin(time * 0.03) * 0.4;
  var aggro = phase === 1 ? 1 : phase === 2 ? 1.2 : 1.5;

  ctx.save();

  [leftEyeCX, rightEyeCX].forEach(function(ecx) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#0a1a00';
    ctx.beginPath();
    ctx.arc(ecx, eyeCY, eyeR + 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = hitBlink ? 0.9 : (0.35 + pulse * 0.3) * aggro;
    ctx.fillStyle = '#ffff44';
    ctx.beginPath();
    ctx.arc(ecx, eyeCY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = hitBlink ? 0 : 0.88;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(ecx, eyeCY, 1.2, eyeR * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.45 * pulse * aggro;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ecx, eyeCY, eyeR * 0.3, 0, Math.PI * 2);
    ctx.fill();

    if (phase >= 3) {
      ctx.globalAlpha = 0.3 + Math.sin(time * 0.06) * 0.2;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 1;
      for (var v = 0; v < 3; v++) {
        var va = (Math.PI * 2 * v / 3) + Math.sin(time * 0.02) * 0.3;
        ctx.beginPath();
        ctx.moveTo(ecx - 0.5, eyeCY);
        ctx.lineTo(ecx + Math.cos(va) * (eyeR + 3), eyeCY + Math.sin(va) * (eyeR + 3));
        ctx.stroke();
      }
    }
  });

  ctx.restore();
}

function drawSerpentrixFangs(ctx, boss, color, time) {
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  var mouthY = boss.y + 15;
  var leftFangX = boss.x + 28;
  var rightFangX = boss.x + boss.w - 28;

  var fangLen = 6 + phase * 2;
  var openPct = 0.5 + Math.sin(time * 0.025) * 0.5;
  var aggro = phase === 1 ? 0.7 : phase === 2 ? 0.85 : 1.0;

  ctx.save();

  ctx.globalAlpha = 0.82 * aggro;
  ctx.fillStyle = '#eeffdd';
  ctx.strokeStyle = '#aadd88';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftFangX - 1.5, mouthY);
  ctx.lineTo(leftFangX - 2.5, mouthY + fangLen * openPct);
  ctx.lineTo(leftFangX + 1, mouthY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightFangX + 1.5, mouthY);
  ctx.lineTo(rightFangX + 2.5, mouthY + fangLen * openPct);
  ctx.lineTo(rightFangX - 1, mouthY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 0.9 * aggro;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(leftFangX - 2.5, mouthY + fangLen * openPct, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rightFangX + 2.5, mouthY + fangLen * openPct, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSerpentrixVenomDrops(ctx, boss, color, time) {
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;

  var mouthY = boss.y + 15;
  var leftFangX = boss.x + 25;
  var rightFangX = boss.x + boss.w - 25;
  var fangLen = 6 + phase * 2;
  var openPct = 0.5 + Math.sin(time * 0.025) * 0.5;
  var fangTipY = mouthY + fangLen * openPct;

  ctx.save();

  var dripLen = 3 + Math.sin(time * 0.05) * 2 + hitT * 4;
  ctx.globalAlpha = 0.55 + Math.sin(time * 0.04) * 0.2;
  ctx.fillStyle = '#88ff44';
  ctx.beginPath();
  ctx.ellipse(leftFangX - 2.5, fangTipY + dripLen, 2, dripLen * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.55 + Math.sin(time * 0.05 + 1) * 0.2;
  ctx.beginPath();
  ctx.ellipse(rightFangX + 2.5, fangTipY + dripLen * 0.8, 2, dripLen * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  for (var i = 0; i < 3; i++) {
    var dropX = boss.x + boss.w * (0.2 + i * 0.3);
    var dropLife = (time * 0.02 + i * 2.0) % (Math.PI * 2);
    var dropY = boss.y + boss.h * 0.9 + Math.sin(dropLife) * 10 + i * 4;
    ctx.globalAlpha = 0.25 + Math.abs(Math.sin(dropLife)) * 0.3;
    ctx.fillStyle = i === 1 ? '#aaff66' : '#66cc44';
    ctx.beginPath();
    ctx.arc(dropX, dropY, 2 + Math.abs(Math.sin(dropLife)) * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (phase >= 3) {
    for (var v = 0; v < 4; v++) {
      var vx = boss.x + boss.w * (0.15 + v * 0.23);
      var vy = boss.y + boss.h * 0.8 + Math.sin(time * 0.04 + v * 1.3) * 6 + v * 3;
      ctx.globalAlpha = 0.3 + Math.sin(time * 0.06 + v) * 0.2;
      ctx.fillStyle = '#55cc33';
      ctx.beginPath();
      ctx.arc(vx, vy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawSerpentrixWave(ctx, boss, color, time) {
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  var startX = boss.x + boss.w / 2;
  var startY = boss.y + 5;
  var endY = boss.y + boss.h * 0.85;
  var segments = 8;
  var waveAmp = 1.5 + phase * 0.8;
  var waveFreq = 0.02 * (1 + phase * 0.15);

  ctx.save();
  ctx.globalAlpha = 0.12 + Math.sin(time * 0.018) * 0.05;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(startX + Math.sin(time * waveFreq + startY * 0.02) * waveAmp, startY);

  for (var i = 1; i <= segments; i++) {
    var t = i / segments;
    var py = startY + (endY - startY) * t;
    var px = startX + Math.sin(time * waveFreq + py * 0.02) * waveAmp * (1 - t * 0.3);
    ctx.lineTo(px, py);
  }

  ctx.stroke();

  ctx.globalAlpha = 0.06 + Math.sin(time * 0.022) * 0.04;
  ctx.strokeStyle = '#aaffaa';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// --- ORBITAL VISUALS ---
function drawOrbitalEnergyField(ctx, boss, color, time) {
  var _auraMax = (typeof getFreezeAuditConfig === 'function') ? (getFreezeAuditConfig().bossAuraCap || 0.30) : 0.30;
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isPulseMode = boss.pulseMode || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitShake = Math.sin(time * 0.3) * hitT * 2;

  var pulse = 0.55 + Math.sin(time * 0.022) * 0.45;
  var pFast = 0.5 + Math.sin(time * 0.05) * 0.5;
  var phaseMul = phase === 1 ? 1 : phase === 2 ? 1.4 : 2.0;

  ctx.save();

  ctx.globalAlpha = Math.min(0.30, (0.04 + hitT * 0.1) * pulse * phaseMul); // HC-RD-07: Orbital aura cap
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx + hitShake, cy, boss.w * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.08 + hitT * 0.15) * pFast * phaseMul;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx + hitShake * 0.7, cy, boss.w * 0.45, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.16 + hitT * 0.22) * pFast;
  ctx.strokeStyle = '#a0f0ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx + hitShake * 0.5, cy, boss.w * 0.38, 0, Math.PI * 2);
  ctx.stroke();

  if (isPulseMode) {
    var pulseBuild = 0.4 + Math.sin(time * 0.06) * 0.35;
    ctx.globalAlpha = pulseBuild * phaseMul;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, boss.w * 0.42 + Math.sin(time * 0.04) * 6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = pulseBuild * 0.6;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, boss.w * 0.15, 0, Math.PI * 2);
    ctx.fill();
  }

  for (var i = 0; i < 8; i++) {
    var sa = time * 0.006 + (Math.PI * 2 * i / 8);
    var sr = boss.w * (0.3 + Math.sin(time * 0.025 + i) * 0.15);
    var sx = cx + Math.cos(sa) * sr;
    var sy = cy + Math.sin(sa) * sr;
    ctx.globalAlpha = (0.2 + Math.sin(time * 0.04 + i) * 0.15) * pFast * phaseMul;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sx, sy, 2, 2);
  }

  if (phase >= 3) {
    for (var e = 0; e < 6; e++) {
      var ea = time * 0.008 + (Math.PI * 2 * e / 6);
      var er1 = boss.w * 0.25;
      var er2 = boss.w * 0.5;
      var ex1 = cx + Math.cos(ea) * er1;
      var ey1 = cy + Math.sin(ea) * er1;
      var ex2 = cx + Math.cos(ea + 0.2) * er2;
      var ey2 = cy + Math.sin(ea + 0.2) * er2;

      ctx.globalAlpha = 0.25 + Math.sin(time * 0.06 + e) * 0.15;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ex1, ey1);
      ctx.lineTo(ex2, ey2);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawOrbitalRingArcs(ctx, boss, color, time) {
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitShake = Math.sin(time * 0.35) * hitT * 2;

  var arcCount = phase === 1 ? 2 : phase === 2 ? 3 : 4;
  var speed = 0.012 + phase * 0.003;
  var pulse = 0.6 + Math.sin(time * 0.03) * 0.4;

  ctx.save();

  for (var a = 0; a < arcCount; a++) {
    var baseAngle = time * speed + (Math.PI * 2 * a / arcCount);
    var radius = boss.w * 0.48 + Math.sin(time * 0.018 + a) * 4;

    for (var seg = 0; seg < 3; seg++) {
      var arcStart = baseAngle + seg * (Math.PI * 2 / 3 / 3);
      var arcLen = Math.PI * 0.45;

      ctx.globalAlpha = (0.12 + hitT * 0.15) * pulse * (1 + phase * 0.15);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 + a * 0.5;
      ctx.beginPath();
      ctx.arc(cx + hitShake * (a % 2 === 0 ? 1 : -1), cy, radius, arcStart, arcStart + arcLen);
      ctx.stroke();
    }

    ctx.globalAlpha = (0.25 + hitT * 0.2) * pulse;
    ctx.strokeStyle = '#e0ffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.72, baseAngle + 0.3, baseAngle + 0.3 + Math.PI * 0.6);
    ctx.stroke();
  }

  if (phase >= 3) {
    ctx.globalAlpha = 0.2 * pulse;
    ctx.strokeStyle = '#88ffff';
    ctx.lineWidth = 2;
    for (var cc = 0; cc < 2; cc++) {
      var ca = -time * speed * 0.7 + cc * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, boss.w * 0.55, ca, ca + Math.PI * 0.55);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawOrbitalCore(ctx, boss, color, time) {
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isPulseMode = boss.pulseMode || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitBright = hitT * 0.4;

  var pulse = 0.6 + Math.sin(time * 0.028) * 0.4;
  var pFast = 0.5 + Math.sin(time * 0.055) * 0.5;
  var phaseMul = phase === 1 ? 1 : phase === 2 ? 1.25 : 1.6;

  ctx.save();

  var coreR = 7 * phaseMul + hitBright * 3;
  ctx.globalAlpha = (0.15 + hitBright) * pFast * phaseMul;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR + 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.35 + hitBright) * pulse * phaseMul;
  ctx.strokeStyle = '#e0ffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR + 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = (0.65 + hitBright) * pFast * phaseMul;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.2 + hitBright) * pulse;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  var crossLen = coreR + 8;
  ctx.beginPath();
  ctx.moveTo(cx - crossLen, cy);
  ctx.lineTo(cx + crossLen, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - crossLen);
  ctx.lineTo(cx, cy + crossLen);
  ctx.stroke();

  if (phase >= 3 || isPulseMode) {
    var surgeR = coreR * 1.8 + Math.sin(time * 0.07) * 5;
    ctx.globalAlpha = 0.18 + Math.sin(time * 0.05) * 0.1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, surgeR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// HC-167: draw expanding warning ring during orbital pulse mode
function drawOrbitalPulseWarning(ctx, boss, color, time) {
  if (!boss || !boss.pulseMode) return;
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var timer = boss.pulseTimer || 0;
  var progress = 1 - Math.min(1, timer / 1500);
  var alpha = 0.08 + Math.sin(progress * Math.PI) * 0.14;
  var r = 20 + progress * 55;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#5588ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = alpha * 0.5;
  ctx.strokeStyle = '#aaccff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// HC-170: draw vertical column indicator for tractor beam ground telegraph
function drawOrbitalTractorBeamIndicator(ctx, boss, color, time) {
  if (!boss || typeof boss._tractorBeamTimer !== 'number' || boss._tractorBeamTimer <= 0) return;
  var bx = boss._tractorBeamX;
  if (typeof bx !== 'number') return;
  var progress = 1 - Math.min(1, boss._tractorBeamTimer / 300);
  var alpha = 0.08 + Math.sin(progress * Math.PI) * 0.12;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#6699ff';
  ctx.lineWidth = 2;
  // vertical column: dotted line from top of beam to mid-screen
  var topY = 40;
  var botY = 200;
  ctx.beginPath();
  for (var ty = topY; ty < botY; ty += 12) {
    ctx.rect(bx - 3, ty, 6, 6);
  }
  ctx.fillStyle = '#6699ff';
  ctx.fill();

  ctx.globalAlpha = alpha * 0.5;
  ctx.strokeStyle = '#aaccff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bx, topY);
  ctx.lineTo(bx, botY);
  ctx.stroke();
  ctx.restore();
}

// --- TENIENTE VISUALS ---
function drawTenienteAura(ctx, boss, color, time) {
  var _auraMax = (typeof getFreezeAuditConfig === 'function') ? (getFreezeAuditConfig().bossAuraCap || 0.30) : 0.30;
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isCharging = boss.chargeMode || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitShake = Math.sin(time * 0.3) * hitT * 2.2;
  var chargeBoost = isCharging ? 0.32 : 0;

  var pulse = 0.55 + Math.sin(time * 0.022) * 0.45;
  var pFast = 0.5 + Math.sin(time * 0.05) * 0.5;
  var phaseMul = phase === 1 ? 1 : phase === 2 ? 1.3 : 1.7;

  ctx.save();

  ctx.globalAlpha = Math.min(0.30, (0.06 + hitT * 0.12 + chargeBoost * 0.14) * pulse * phaseMul); // HC-RD-07: Teniente aura cap
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake, cy, boss.w * 0.58, boss.h * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.10 + hitT * 0.15 + chargeBoost * 0.16) * pFast * phaseMul;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.7, cy, boss.w * 0.38, boss.h * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.14 + hitT * 0.2) * pFast;
  ctx.strokeStyle = '#ffe088';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.5, cy, boss.w * 0.33, boss.h * 0.58, 0, 0, Math.PI * 2);
  ctx.stroke();

  for (var i = 0; i < 6; i++) {
    var sa = time * 0.005 + (Math.PI * 2 * i / 6);
    var sr = boss.w * 0.30 + Math.sin(time * 0.025 + i) * 8;
    var sx = cx + Math.cos(sa) * sr;
    var sy = cy + Math.sin(sa) * sr * 0.7;
    ctx.globalAlpha = (0.16 + Math.sin(time * 0.04 + i) * 0.12) * pFast * phaseMul;
    ctx.fillStyle = '#ffee88';
    ctx.fillRect(sx - 1, sy - 1, 2, 2);
  }

  if (isCharging && boss.telegraphTimer > 0) {
    var telegraphPct = 1 - boss.telegraphTimer / 650;
    ctx.globalAlpha = 0.16 + telegraphPct * 0.28;
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.ellipse(cx, cy, boss.w * 0.42 + telegraphPct * 16, boss.h * 0.75 + telegraphPct * 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawTenienteWings(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var hitShake = 0;
  if (flashTimer > 0) {
    var hitT = Math.min(1, flashTimer / 200);
    hitShake = Math.sin(time * 0.25) * hitT * 2.8;
  }

  var wingOpen = phase === 1 ? 0.6 : phase === 2 ? 0.9 : 1.3;
  var bob = Math.sin(time * 0.014 + 0.8) * 2.5 * wingOpen;
  var outerLen = 18 * wingOpen;
  var baseYOffset = bh * 0.36;

  ctx.save();

  // LEFT WING
  var lx = bx + 6 + hitShake;
  var ly = by + baseYOffset;
  var lOuterX = lx - outerLen;
  var lOuterY = ly - 6 + bob;
  var lBotX = lx - 6;
  var lBotY = ly + bh * 0.18 + bob * 0.5;

  ctx.globalAlpha = 0.55 + phase * 0.06;
  ctx.fillStyle = '#1a1000';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lx, ly - 3);
  ctx.lineTo(lOuterX, lOuterY);
  ctx.lineTo(lBotX, lBotY);
  ctx.lineTo(lx, ly + 6);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.72 + phase * 0.08;
  ctx.stroke();

  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#886600';
  ctx.beginPath();
  ctx.moveTo(lx + 1, ly);
  ctx.lineTo(lOuterX + 6, lOuterY + 2);
  ctx.lineTo(lBotX + 2, lBotY - 2);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.25 + Math.sin(time * 0.035) * 0.18;
  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.arc(lOuterX, lOuterY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // RIGHT WING
  var rx = bx + bw - 6 - hitShake;
  var ry = by + baseYOffset;
  var rOuterX = rx + outerLen;
  var rOuterY = ry - 6 + bob;
  var rBotX = rx + 6;
  var rBotY = ry + bh * 0.18 + bob * 0.5;

  ctx.globalAlpha = 0.55 + phase * 0.06;
  ctx.fillStyle = '#1a1000';
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(rx, ry - 3);
  ctx.lineTo(rOuterX, rOuterY);
  ctx.lineTo(rBotX, rBotY);
  ctx.lineTo(rx, ry + 6);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 0.72 + phase * 0.08;
  ctx.stroke();

  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#886600';
  ctx.beginPath();
  ctx.moveTo(rx - 1, ry);
  ctx.lineTo(rOuterX - 6, rOuterY + 2);
  ctx.lineTo(rBotX - 2, rBotY - 2);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.25 + Math.sin(time * 0.035 + 1) * 0.18;
  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.arc(rOuterX, rOuterY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  if (phase >= 3) {
    var scorchFlicker = 0.08 + Math.sin(time * 0.055) * 0.06;
    ctx.globalAlpha = scorchFlicker;
    ctx.strokeStyle = '#ff4400';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx - 2, ly - 2);
    ctx.lineTo(lOuterX - 3, lOuterY - 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(rx + 2, ry - 2);
    ctx.lineTo(rOuterX + 3, rOuterY - 1);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTenienteCannons(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  var recoil = Math.sin(time * 0.02) * 1.2 * phase;
  var cannonLen = 9 + phase * 2;
  var cannonW = 5;

  ctx.save();

  // LEFT CANNON
  var lcx = bx + 14;
  var lcy = by + bh - 2;
  var lmY = lcy + cannonLen + recoil;

  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#1a0a00';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.fillRect(lcx - cannonW / 2, lcy, cannonW, cannonLen + recoil);
  ctx.strokeRect(lcx - cannonW / 2 + 0.5, lcy + 0.5, cannonW - 1, cannonLen + recoil - 1);

  ctx.globalAlpha = 0.12 + Math.sin(time * 0.03) * 0.08 + phase * 0.04;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(lcx, lmY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.28 + Math.sin(time * 0.04) * 0.18;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(lcx, lmY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // RIGHT CANNON
  var rcx = bx + bw - 14;
  var rcy = by + bh - 2;
  var rmY = rcy + cannonLen + recoil;

  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#1a0a00';
  ctx.strokeStyle = color;
  ctx.fillRect(rcx - cannonW / 2, rcy, cannonW, cannonLen + recoil);
  ctx.strokeRect(rcx - cannonW / 2 + 0.5, rcy + 0.5, cannonW - 1, cannonLen + recoil - 1);

  ctx.globalAlpha = 0.12 + Math.sin(time * 0.03 + 1) * 0.08 + phase * 0.04;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(rcx, rmY, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.28 + Math.sin(time * 0.04 + 1) * 0.18;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(rcx, rmY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawTenienteCockpit(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var visorPulse = 0.5 + Math.sin(time * 0.028) * 0.5;
  var anger = phase === 1 ? 0.55 : phase === 2 ? 0.78 : 1.0;

  var cx = bx + bw / 2;
  var cy = by + bh * 0.26;

  ctx.save();

  var visorW = 22 * anger;
  var visorH = 4.5;

  ctx.globalAlpha = (0.08 + hitT * 0.2) * visorPulse * anger;
  ctx.fillStyle = '#ff3300';
  ctx.beginPath();
  ctx.ellipse(cx, cy, visorW * 0.52, visorH + 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.48 + hitT * 0.2;
  ctx.fillStyle = '#0a0000';
  ctx.strokeStyle = '#cc4400';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, visorW * 0.46, visorH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = (0.42 + hitT * 0.35) * visorPulse * anger;
  ctx.fillStyle = '#ff4400';
  ctx.beginPath();
  ctx.ellipse(cx, cy, visorW * 0.18, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.7 + hitT * 0.2) * visorPulse;
  ctx.fillStyle = '#fff';
  ctx.fillRect(cx - 1, cy - 0.5, 2, 1);

  if (phase >= 3) {
    ctx.globalAlpha = 0.12 + Math.sin(time * 0.06) * 0.1;
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.ellipse(cx, cy, visorW * 0.42, visorH + 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawTenienteLights(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);

  ctx.save();

  var lights = [
    { x: bx + 5, y: by + 4, color: '#ff4400', blink: 0 },
    { x: bx + bw - 5, y: by + 4, color: '#ff4400', blink: 0.5 },
    { x: bx + 3, y: by + bh * 0.52, color: '#ff8800', blink: 1.2 },
    { x: bx + bw - 3, y: by + bh * 0.52, color: '#ff8800', blink: 1.7 },
    { x: bx + bw * 0.5 - 7, y: by + bh - 2, color: '#ff4400', blink: 2.4 },
    { x: bx + bw * 0.5 + 7, y: by + bh - 2, color: '#ff4400', blink: 2.9 }
  ];

  for (var i = 0; i < lights.length; i++) {
    var l = lights[i];
    var blinkVal = Math.sin(time * 0.035 + l.blink) * 0.5 + 0.5;
    var alpha = (0.35 + blinkVal * 0.5) * (0.6 + phase * 0.15);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = l.color;
    ctx.fillRect(l.x, l.y, 2, 2);

    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = '#fff';
    ctx.fillRect(l.x, l.y, 1, 1);
  }

  ctx.restore();
}

function drawTenienteEngineTrails(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var isCharging = boss.chargeMode || false;

  var thrustIntensity = isCharging ? 1.5 : 0.65 + phase * 0.15;
  var pulse = 0.6 + Math.sin(time * 0.04) * 0.4;

  ctx.save();

  // Left engine
  var lex = bx + bw * 0.25;
  var ley = by + bh;
  var leLen = (7 + phase * 3) * thrustIntensity * pulse;

  ctx.globalAlpha = 0.07 * thrustIntensity;
  ctx.fillStyle = '#ff6600';
  ctx.fillRect(lex - 4, ley, 8, leLen + 8);

  ctx.globalAlpha = 0.20 * thrustIntensity * pulse;
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(lex - 2, ley, 4, leLen + 4);

  ctx.globalAlpha = 0.42 * thrustIntensity * pulse;
  ctx.fillStyle = '#ffff44';
  ctx.fillRect(lex - 1, ley, 2, leLen);

  // Right engine
  var rex = bx + bw * 0.75;
  var rey = by + bh;
  var reLen = (7 + phase * 3) * thrustIntensity * pulse;

  ctx.globalAlpha = 0.07 * thrustIntensity;
  ctx.fillStyle = '#ff6600';
  ctx.fillRect(rex - 4, rey, 8, reLen + 8);

  ctx.globalAlpha = 0.20 * thrustIntensity * pulse;
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(rex - 2, rey, 4, reLen + 4);

  ctx.globalAlpha = 0.42 * thrustIntensity * pulse;
  ctx.fillStyle = '#ffff44';
  ctx.fillRect(rex - 1, rey, 2, reLen);

  if (isCharging && boss.telegraphTimer > 0) {
    var telegraphPct = 1 - boss.telegraphTimer / 650;
    var bigFlame = 10 * telegraphPct * pulse;

    ctx.globalAlpha = 0.1 * telegraphPct;
    ctx.fillStyle = '#ff2200';
    ctx.fillRect(lex - 6, ley, 12, bigFlame + 6);
    ctx.fillRect(rex - 6, ley, 12, bigFlame + 6);

    ctx.globalAlpha = 0.28 * telegraphPct;
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(lex - 3, ley, 6, bigFlame);
    ctx.fillRect(rex - 3, ley, 6, bigFlame);

    ctx.globalAlpha = 0.5 * telegraphPct;
    ctx.fillStyle = '#ffff66';
    ctx.fillRect(lex - 1.5, ley, 3, bigFlame * 0.6);
    ctx.fillRect(rex - 1.5, ley, 3, bigFlame * 0.6);
  }

  ctx.restore();
}

function drawTenienteCore(ctx, boss, color, time) {
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h * 0.54;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isCharging = boss.chargeMode || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitBright = hitT * 0.4;
  var chargeBoost = isCharging ? 0.32 : 0;

  var pulse = 0.55 + Math.sin(time * 0.028) * 0.45;
  var pFast = 0.5 + Math.sin(time * 0.05) * 0.5;
  var phaseMul = phase === 1 ? 1 : phase === 2 ? 1.2 : 1.55;

  ctx.save();

  var coreR = 5.5 * phaseMul + hitBright * 2;

  ctx.globalAlpha = (0.11 + hitBright + chargeBoost * 0.18) * pulse * phaseMul;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR + 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.26 + hitBright + chargeBoost * 0.14) * pFast * phaseMul;
  ctx.strokeStyle = '#ffaa00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR + 1.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = (0.32 + hitBright) * pFast;
  ctx.strokeStyle = '#ffe088';
  ctx.lineWidth = 1.5;
  for (var a = 0; a < 4; a++) {
    var startA = time * 0.004 + a * Math.PI * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 1.1, startA, startA + Math.PI * 0.35);
    ctx.stroke();
  }

  ctx.globalAlpha = (0.58 + hitBright + chargeBoost * 0.2) * pFast * phaseMul;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 0.35, 0, Math.PI * 2);
  ctx.fill();

  if (phase >= 3 || isCharging) {
    var spikeCount = 6;
    ctx.globalAlpha = 0.14 + Math.sin(time * 0.06) * 0.08 + chargeBoost * 0.18;
    ctx.strokeStyle = '#ffffaa';
    ctx.lineWidth = 1;
    for (var s = 0; s < spikeCount; s++) {
      var sa = time * 0.003 + s * Math.PI * 2 / spikeCount;
      var innerR = coreR * 0.6;
      var outerR = coreR * 2.2 + Math.sin(time * 0.04 + s) * 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(sa) * innerR, cy + Math.sin(sa) * innerR);
      ctx.lineTo(cx + Math.cos(sa) * outerR, cy + Math.sin(sa) * outerR);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// HC-165: impact ring visible during chargeMode === 'impact'
function drawTenienteImpactWarning(ctx, boss, color, time) {
  if (!boss || boss.chargeMode !== 'impact') return;
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var timer = boss._chargeImpactTimer || 0;
  var progress = 1 - Math.min(1, timer / 250);
  var alpha = 0.12 + Math.sin(progress * Math.PI) * 0.18;
  var ringR = 20 + (1 - progress) * 40;
  var innerR = 14 + (1 - progress) * 24;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff5533';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.7;
  ctx.strokeStyle = '#ffaa44';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = '#ff4422';
  ctx.beginPath();
  ctx.arc(cx, cy, 8 + Math.sin(time * 0.04) * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// HC-167: draw glow at teleport destination during flash
function drawEmperorTeleportIndicator(ctx, boss, color, time) {
  if (!boss || !boss.isTeleporting) return;
  var dx = boss._teleportDestX;
  var dy = boss._teleportDestY;
  if (typeof dx !== 'number' || typeof dy !== 'number') return;
  var progress = 1 - Math.min(1, (boss.teleportFlash || 0) / (boss.teleportFlash > 400 ? 500 : 400));
  var alpha = 0.10 + Math.sin(progress * Math.PI) * 0.16;
  var r = 16 + progress * 24;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#bb88ff';
  ctx.beginPath();
  ctx.arc(dx + boss.w / 2, dy + boss.h / 2, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alpha * 0.6;
  ctx.strokeStyle = '#ddbbff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(dx + boss.w / 2, dy + boss.h / 2, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// --- EMPERADOR VISUALS ---
function drawEmperorImperialAura(ctx, boss, color, time) {
  var _auraMax = (typeof getFreezeAuditConfig === 'function') ? (getFreezeAuditConfig().bossAuraCap || 0.30) : 0.30;
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h / 2;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isTeleporting = boss.isTeleporting || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitShake = Math.sin(time * 0.3) * hitT * 2.5;
  var teleFade = isTeleporting ? Math.max(0.15, boss.teleportFlash / 500) : 1;

  var pulse = 0.6 + Math.sin(time * 0.018) * 0.4;
  var pFast = 0.5 + Math.sin(time * 0.045) * 0.5;
  var phaseMul = phase === 1 ? 1 : phase === 2 ? 1.4 : 2.1;

  ctx.save();

  ctx.globalAlpha = Math.min(0.30, (0.04 + hitT * 0.1) * pulse * phaseMul * teleFade); // HC-RD-07: Emperor aura cap
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx + hitShake, cy, boss.w * 0.68, boss.h * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.07 + hitT * 0.15) * pFast * phaseMul * teleFade;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.7, cy, boss.w * 0.5, boss.h * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.11 + hitT * 0.22) * pulse * teleFade;
  ctx.strokeStyle = '#ffe8a0';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.5, cy, boss.w * 0.4, boss.h * 0.66, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = (0.16 + hitT * 0.25) * pFast * teleFade;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx + hitShake * 0.4, cy, boss.w * 0.32, boss.h * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  for (var i = 0; i < 10; i++) {
    var sa = time * 0.003 + (Math.PI * 2 * i / 10);
    var sr = boss.w * 0.34 + Math.sin(time * 0.02 + i) * 14;
    var sx = cx + Math.cos(sa) * sr;
    var sy = cy + Math.sin(sa) * sr * 0.62;
    ctx.globalAlpha = (0.14 + Math.sin(time * 0.035 + i) * 0.12) * pFast * phaseMul * teleFade;
    ctx.fillStyle = i % 3 === 0 ? '#ffffff' : '#ffd700';
    ctx.fillRect(sx - 1, sy - 1, 2, 2);
  }

  if (phase >= 2) {
    for (var j = 0; j < 6; j++) {
      var ja = -time * 0.005 + (Math.PI * 2 * j / 6);
      var jr = boss.w * 0.22 + Math.sin(time * 0.03 + j) * 6;
      var jx = cx + Math.cos(ja) * jr;
      var jy = cy + Math.sin(ja) * jr * 0.5;
      ctx.globalAlpha = (0.22 + Math.sin(time * 0.05 + j) * 0.15) * pFast * teleFade;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(jx - 0.5, jy - 0.5, 1, 1);
    }
  }

  if (isTeleporting && boss.teleportFlash < 220) {
    var dispersePct = 1 - boss.teleportFlash / 220;
    ctx.globalAlpha = 0.14 + dispersePct * 0.25;
    for (var d = 0; d < 8; d++) {
      var da = (Math.PI * 2 * d / 8);
      var dx = cx + Math.cos(da) * dispersePct * boss.w * 0.55;
      var dy = cy + Math.sin(da) * dispersePct * boss.h * 0.45;
      ctx.fillStyle = d % 2 === 0 ? '#ffffff' : '#ffd700';
      ctx.fillRect(dx - 3, dy - 3, 6, 6);
    }
  }

  ctx.restore();
}

function drawEmperorEnergyMantle(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isTeleporting = boss.isTeleporting || false;

  var hitShake = 0;
  if (flashTimer > 0) {
    var hitT = Math.min(1, flashTimer / 200);
    hitShake = Math.sin(time * 0.28) * hitT * 3;
  }
  var teleFade = isTeleporting ? Math.max(0.15, boss.teleportFlash / 500) : 1;

  var flow = Math.sin(time * 0.012) * 3;
  var mantleOpen = phase === 1 ? 0.55 : phase === 2 ? 0.85 : 1.2;
  var mantleLen = 28 * mantleOpen;

  ctx.save();

  // LEFT MANTLE WING
  var lBaseX = bx + 8 + hitShake;
  var lBaseY = by + bh * 0.3;
  var lMidX = lBaseX - 18 * mantleOpen;
  var lMidY = lBaseY + flow;
  var lTipX = lBaseX - mantleLen;
  var lTipY = lBaseY + 16 + flow * 1.5;
  var lBotX = lBaseX - 6;
  var lBotY = lBaseY + bh * 0.4 + flow;

  ctx.globalAlpha = 0.06 * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(lBaseX, lBaseY - 4);
  ctx.quadraticCurveTo(lMidX, lMidY - 10, lTipX, lTipY - 4);
  ctx.lineTo(lTipX + 4, lTipY + 2);
  ctx.quadraticCurveTo(lMidX + 2, lMidY + 12, lBotX, lBotY);
  ctx.lineTo(lBaseX, lBaseY + 8);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.1 * teleFade;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.globalAlpha = 0.04 * teleFade;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1;
  for (var s = 0; s < 3; s++) {
    ctx.beginPath();
    var st = (s + 1) / 4;
    ctx.moveTo(lBaseX + s * 2, lBaseY + s * 2);
    ctx.quadraticCurveTo(lMidX, lMidY + flow * (s * 0.3), lTipX + s * 3, lTipY + s * 2);
    ctx.stroke();
  }

  // RIGHT MANTLE WING
  var rBaseX = bx + bw - 8 - hitShake;
  var rBaseY = by + bh * 0.3;
  var rMidX = rBaseX + 18 * mantleOpen;
  var rMidY = rBaseY + flow;
  var rTipX = rBaseX + mantleLen;
  var rTipY = rBaseY + 16 + flow * 1.5;
  var rBotX = rBaseX + 6;
  var rBotY = rBaseY + bh * 0.4 + flow;

  ctx.globalAlpha = 0.06 * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(rBaseX, rBaseY - 4);
  ctx.quadraticCurveTo(rMidX, rMidY - 10, rTipX, rTipY - 4);
  ctx.lineTo(rTipX - 4, rTipY + 2);
  ctx.quadraticCurveTo(rMidX - 2, rMidY + 12, rBotX, rBotY);
  ctx.lineTo(rBaseX, rBaseY + 8);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.1 * teleFade;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.globalAlpha = 0.04 * teleFade;
  for (var s2 = 0; s2 < 3; s2++) {
    ctx.beginPath();
    var st2 = (s2 + 1) / 4;
    ctx.moveTo(rBaseX - s2 * 2, rBaseY + s2 * 2);
    ctx.quadraticCurveTo(rMidX, rMidY + flow * (s2 * 0.3), rTipX - s2 * 3, rTipY + s2 * 2);
    ctx.stroke();
  }

  ctx.globalAlpha = (0.18 + Math.sin(time * 0.04) * 0.12) * mantleOpen * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(lTipX, lTipY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rTipX, rTipY, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.3 * teleFade;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(lTipX, lTipY, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rTipX, rTipY, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEmperorCrownHalo(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isTeleporting = boss.isTeleporting || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var teleFade = isTeleporting ? Math.max(0.15, boss.teleportFlash / 500) : 1;
  var pulse = 0.55 + Math.sin(time * 0.022) * 0.45;
  var bob = Math.sin(time * 0.015) * 1.5;

  var cx = bx + bw / 2;
  var haloY = by - 6 + bob;
  var haloR = bw * 0.32;

  ctx.save();

  ctx.globalAlpha = (0.14 + hitT * 0.2 + phase * 0.04) * pulse * teleFade;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, haloY, haloR, Math.PI, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = (0.22 + hitT * 0.25 + phase * 0.05) * pulse * teleFade;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, haloY, haloR - 3, Math.PI, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = (0.18 + hitT * 0.3) * pulse * teleFade;
  ctx.strokeStyle = '#ffe8a0';
  ctx.lineWidth = 1;
  for (var a = 0; a < 3; a++) {
    var startA = Math.PI + a * Math.PI * 0.22;
    ctx.beginPath();
    ctx.arc(cx, haloY, haloR - 5, startA, startA + Math.PI * 0.16);
    ctx.stroke();
  }

  var spireCount = phase === 1 ? 3 : phase === 2 ? 5 : 7;
  for (var s = 0; s < spireCount; s++) {
    var sa = Math.PI + (Math.PI * s / (spireCount - 1));
    var spireH = 6 + phase * 3 + Math.sin(time * 0.025 + s) * 2;
    var baseX = cx + Math.cos(sa) * (haloR - 1);
    var baseY = haloY + Math.sin(sa) * (haloR - 1);
    var tipX = cx + Math.cos(sa) * (haloR + spireH);
    var tipY = haloY + Math.sin(sa) * (haloR + spireH);

    ctx.globalAlpha = (0.28 + hitT * 0.3 + phase * 0.08) * pulse * teleFade;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.globalAlpha = (0.35 + Math.sin(time * 0.04 + s) * 0.2 + phase * 0.1) * teleFade;
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.45 * teleFade;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(tipX, tipY, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawEmperorCore(ctx, boss, color, time) {
  var cx = boss.x + boss.w / 2;
  var cy = boss.y + boss.h * 0.5;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var flashTimer = boss.flashTimer || 0;
  var isTeleporting = boss.isTeleporting || false;

  var hitT = flashTimer > 0 ? Math.min(1, flashTimer / 200) : 0;
  var hitBright = hitT * 0.45;
  var teleFade = isTeleporting ? Math.max(0.1, boss.teleportFlash / 500) : 1;

  var pulse = 0.55 + Math.sin(time * 0.025) * 0.45;
  var pFast = 0.5 + Math.sin(time * 0.05) * 0.5;
  var phaseMul = phase === 1 ? 1 : phase === 2 ? 1.25 : 1.65;

  ctx.save();

  var coreR = 7 * phaseMul + hitBright * 3;

  ctx.globalAlpha = (0.1 + hitBright) * pulse * phaseMul * teleFade;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR + 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = (0.2 + hitBright) * pFast * phaseMul * teleFade;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR + 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = (0.28 + hitBright) * pFast * teleFade;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.5;
  for (var a = 0; a < 5; a++) {
    var startA = time * 0.005 + a * Math.PI * 0.4;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR + 1, startA, startA + Math.PI * 0.3);
    ctx.stroke();
  }

  ctx.globalAlpha = (0.6 + hitBright) * pFast * phaseMul * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.95 * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR * 0.35, 0, Math.PI * 2);
  ctx.fill();

  if (phase >= 3) {
    var crossLen = coreR + 10;
    ctx.globalAlpha = 0.1 + Math.sin(time * 0.05) * 0.06;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - crossLen, cy);
    ctx.lineTo(cx + crossLen, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - crossLen);
    ctx.lineTo(cx, cy + crossLen);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEmperorPhaseOverload(ctx, boss, color, time) {
  var bx = boss.x;
  var by = boss.y;
  var bw = boss.w;
  var bh = boss.h;
  var hpPct = boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
  var phase = boss.phase || (hpPct > 0.66 ? 1 : hpPct > 0.33 ? 2 : 3);
  var isTeleporting = boss.isTeleporting || false;

  if (phase < 3) return;

  var teleFade = isTeleporting ? Math.max(0.1, boss.teleportFlash / 500) : 1;
  var cx = bx + bw / 2;
  var pulse = 0.5 + Math.sin(time * 0.035) * 0.5;

  ctx.save();

  for (var i = 0; i < 12; i++) {
    var px = bx + 5 + (bw - 10) * ((i + 0.5) / 12);
    var riseLife = ((time * 0.015 + i * 0.3) % 20);
    var py = by + bh - 2 + Math.sin(time * 0.02 + i * 0.8) * 8 - riseLife;
    ctx.globalAlpha = (0.12 + Math.sin(time * 0.04 + i) * 0.08) * teleFade;
    ctx.fillStyle = i % 3 === 0 ? '#ffffff' : '#ffd700';
    ctx.fillRect(px, Math.max(by - 8, py), 1, 2);
  }

  var pillarAlpha = 0.04 + pulse * 0.04;
  ctx.globalAlpha = pillarAlpha * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx - 6, by + bh * 0.2, 3, bh * 0.7);

  ctx.globalAlpha = pillarAlpha * 0.6 * teleFade;
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(bx - 4, by + bh * 0.25, 1, bh * 0.6);

  ctx.globalAlpha = pillarAlpha * teleFade;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx + bw + 3, by + bh * 0.2, 3, bh * 0.7);

  ctx.globalAlpha = pillarAlpha * 0.6 * teleFade;
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(bx + bw + 4, by + bh * 0.25, 1, bh * 0.6);

  var rayCount = 8;
  ctx.globalAlpha = (0.06 + pulse * 0.06) * teleFade;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (var r = 0; r < rayCount; r++) {
    var ra = time * 0.002 + r * Math.PI * 2 / rayCount;
    var innerR = bw * 0.15;
    var outerR = bw * 0.55 + Math.sin(time * 0.03 + r) * 8;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ra) * innerR, by + bh * 0.5 + Math.sin(ra) * innerR);
    ctx.lineTo(cx + Math.cos(ra) * outerR, by + bh * 0.5 + Math.sin(ra) * outerR);
    ctx.stroke();
  }

  ctx.globalAlpha = (0.08 + pulse * 0.06) * teleFade;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.5;
  var arcY = by - 14 + Math.sin(time * 0.018) * 3;
  ctx.beginPath();
  ctx.arc(cx, arcY, bw * 0.35, Math.PI + 0.3, Math.PI * 2 - 0.3);
  ctx.stroke();

  ctx.globalAlpha = (0.14 + pulse * 0.08) * teleFade;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, arcY - 2, bw * 0.35, Math.PI + 0.3, Math.PI * 2 - 0.3);
  ctx.stroke();

  ctx.restore();
}

// --- DRAW ---
var _lastControlDeckTheme = '';
var _combatDimFactor = 0;  // HC-RD-04: dynamic background dimming (0=full ambient, 1=fully dimmed)
function draw() {
  // HC-RD-08: small-screen readability boost
  _updateScreenBoost();
  // ================================================================
  // HC-RD-01: PRIORITY_AMBIENT — background, nebula, atmosphere
  // ================================================================
  // 1) Limpiar y pintar fondo SIN translate (así el fondo no recibe shake global)
  ctx.clearRect(0, 0, W, H);
  drawThemedBackground(ctx, level, globalTime);

  const mobileControls = document.getElementById('mobile-controls');
  if (mobileControls) {
    const menuControlStates = ['menu', 'options', 'scores', 'credits'];
    const overlayControlStates = ['paused', 'gameover'];
    const controlsDimmed = menuControlStates.includes(state);
    const controlsSoftened = overlayControlStates.includes(state);
    // HC-RD-08: semi-transparent controls during gameplay so threats are visible
    var _mobCfg = (typeof getMobileReadabilityConfig === 'function') ? (getMobileReadabilityConfig().controlDeck || {}) : {};
    var _mobGameOpacity = (typeof _mobCfg.gameplayOpacity === 'number') ? _mobCfg.gameplayOpacity : 0.64;
    const targetOpacity = controlsDimmed ? '0.22'
      : (controlsSoftened ? '0.34'
      : String(_mobGameOpacity));
    const targetFilter = controlsDimmed
      ? 'saturate(0.55) brightness(0.72)'
      : (controlsSoftened ? 'saturate(0.7) brightness(0.82)' : '');
    const targetTransition = (controlsDimmed || controlsSoftened) ? 'opacity 140ms ease, filter 140ms ease' : '';

    if (mobileControls.style.opacity !== targetOpacity) {
      mobileControls.style.opacity = targetOpacity;
    }
    if (mobileControls.style.filter !== targetFilter) {
      mobileControls.style.filter = targetFilter;
    }
    if (mobileControls.style.transition !== targetTransition) {
      mobileControls.style.transition = targetTransition;
    }
  }

  const deckTheme = getBackgroundThemeForLevel(level);
  if (_lastControlDeckTheme !== deckTheme) {
    _lastControlDeckTheme = deckTheme;
    document.body.dataset.theme = deckTheme;
  }

  // HC-RD-04: dynamic combat dimming — reduce ambient when bullets are dense
  if (state === 'playing' || state === 'paused') {
    var _ddCfg = (typeof getBackgroundReadabilityConfig === 'function')
      ? (getBackgroundReadabilityConfig().dynamicDimming || {}) : {};
    var _ddEnabled = _ddCfg.enabled !== false;
    if (_ddEnabled) {
      var _ddThreshold = _ddCfg.densityThreshold || 18;
      var _ddMax = _ddCfg.maxDimFactor || 0.50;
      var _ddSpeed = _ddCfg.dimSpeed || 0.015;
      var _ddRecover = _ddCfg.recoverSpeed || 0.008;
      var _bulletCount = (typeof enemyBullets !== 'undefined' && enemyBullets) ? enemyBullets.length : 0;
      var _targetDim = (_bulletCount >= _ddThreshold) ? _ddMax : 0;
      if (_combatDimFactor < _targetDim) {
        _combatDimFactor = Math.min(_targetDim, _combatDimFactor + _ddSpeed);
      } else if (_combatDimFactor > _targetDim) {
        _combatDimFactor = Math.max(_targetDim, _combatDimFactor - _ddRecover);
      }
    }
  } else {
    _combatDimFactor = 0;
  }

  // 2) HC-90: nebula overlay + color grading (behind stars, after theme BG)
  drawHC90Nebula(ctx, level, globalTime);
  applyHC90ColorGrading(ctx, level);

  // 2.5) HC-97: atmospheric effects (dust, speed lines, ambient flash)
  if (typeof drawHC97Atmosphere === 'function') drawHC97Atmosphere(ctx, level, globalTime);

  // 3) STAR SHAKE (solo fondo, más fuerte en boss)
  const bgShakeMult = boss.active ? SHAKE_CONFIG.bgBossMultiplier : SHAKE_CONFIG.bgNormalMultiplier;
  const shakeAmt = Math.max(0, screenShakeBg) * SHAKE_CONFIG.bgStrength * bgShakeMult;

  // suavizado para que no “tiemble feo”
  starShakeX = starShakeX * SHAKE_CONFIG.starSmoothingKeep + ((Math.random() - 0.5) * shakeAmt) * SHAKE_CONFIG.starSmoothingNoise;
  starShakeY = starShakeY * SHAKE_CONFIG.starSmoothingKeep + ((Math.random() - 0.5) * shakeAmt) * SHAKE_CONFIG.starSmoothingNoise;

  // ================================================================
  // HC-RD-01: PRIORITY_AMBIENT — stars (decorative, keep readable but subdued)
  // ================================================================
  stars.forEach(s => {
    const height = (warpSpeed > 2) ? s.size * (warpSpeed * 1.5) : s.size;
    const depth = (s.depth ?? 0.5);
    const mult  = 0.15 + depth * 0.95;

    const twinkle = Math.sin(globalTime * 0.003 + s.tw + s.phase * 0.001);
    const tw = 0.65 + 0.35 * twinkle;
    const depthAlpha = 0.45 + depth * 0.55;

    // HC-RD-04: star alpha cap from backgroundReadability config, fallback 0.42
    var _brCfg = (typeof getBackgroundReadabilityConfig === 'function') ? getBackgroundReadabilityConfig() : null;
    var _starAlphaMax = (_brCfg && _brCfg.stars && typeof _brCfg.stars.alphaCap === 'number')
      ? _brCfg.stars.alphaCap
      : 0.42;
    ctx.globalAlpha = Math.min(_starAlphaMax, depthAlpha * tw);
    ctx.fillStyle = s.color;

    ctx.fillRect(
      s.x + starShakeX * mult,
      s.y + starShakeY * mult,
      s.size,
      height
    );

    if (depth > 0.7 && warpSpeed <= 2) {
      var _starCoreCap = (_brCfg && _brCfg.stars && typeof _brCfg.stars.coreAlphaCap === 'number')
        ? _brCfg.stars.coreAlphaCap
        : 0.28;
      ctx.globalAlpha = Math.min(_starCoreCap, (depth - 0.7) * 2.0 * tw);
      ctx.fillStyle = '#fff';
      ctx.fillRect(
        s.x + starShakeX * mult,
        s.y + starShakeY * mult,
        Math.max(1, s.size - 1),
        Math.max(1, Math.floor(height * 0.4))
      );
    }
  });

  // HC-RD-04: subtle combat dimming overlay (darkens background when bullet density is high)
  if (_combatDimFactor > 0.02) {
    ctx.globalAlpha = _combatDimFactor * 0.18;
    ctx.fillStyle = '#000002';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.globalAlpha = 1;

  // 4) A PARTIR DE ACÁ: shake global SOLO para gameplay (player/enemies/etc.)
  ctx.save();
  if (screenShakeGameplay > 0) {
    ctx.translate(gameplayShakeX, gameplayShakeY);
  }



  // HC-WC-07: setpiece tension overlay (pulses, screen flash, transition)
  if (typeof window.drawSetpieceOverlay === 'function') {
    window.drawSetpieceOverlay(ctx);
  }

  if (state === 'menu') {
    const menuPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
    const panelAccent = 'rgba(100,245,255,0.68)';
    const panelW = Math.min(W - 58, 294);
    const panelH = 224;
    const panelX = (W - panelW) / 2;
    const panelY = 272;

    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.045 + menuPulse * 0.035;
    ctx.fillStyle = panelAccent;
    ctx.fillRect(0, 78, W, 2);
    ctx.fillRect(0, H - 86, W, 2);
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';
    
    // Aliens decorativos animados
    menuAliens.forEach((alien, i) => {
  const menuAnim = Math.floor(globalTime / 500) % 2;
const spriteKey = alien.type + (menuAnim === 0 ? '_a' : '_b');
  const color = alien.type === 'alien1' ? currentPalette[2] : currentPalette[1];
  
  // Calcular posición centrada
  const cols = alien.row === 0 ? 5 : 4;
  const spacing = 42;
  const totalWidth = (cols - 1) * spacing;
  const startX = (W - totalWidth) / 2;
  const baseX = startX + alien.col * spacing;
  
  // Movimiento ondulante
  const wave = Math.sin(globalTime * 0.003 + alien.col * 0.5) * 8;
  
  ctx.globalAlpha = 0.62 + menuPulse * 0.16;
  drawSprite(ctx, SPRITES[spriteKey], baseX + wave - 10, alien.y + 4, color, 2.5);
  ctx.globalAlpha = 1;
});
    
    // Título
    drawGlowText(
      'GALAXY',
      W / 2,
      184,
      '34px "Press Start 2P"',
      menuPulse > 0.35 ? '#fff36a' : '#fff',
      'rgba(255,235,90,0.72)'
    );

    drawGlowText(
      'RAIDERS',
      W / 2,
      226,
      '29px "Press Start 2P"',
      '#ffffff',
      'rgba(0,245,255,0.68)'
    );

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(100,245,255,0.72)';
    ctx.fillText('INSERT COIN // READY', W / 2, 250);

    drawOverlayPanel(panelX, panelY, panelW, panelH, panelAccent);
    
    // High Score
    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#64f5ff';
    ctx.fillText('TOP PILOT', W / 2, panelY + 28);
    ctx.fillStyle = '#fff36a';
    ctx.fillText(globalTopName + '  ' + globalTopScore, W / 2, panelY + 48);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 28, panelY + 64);
    ctx.lineTo(panelX + panelW - 28, panelY + 64);
    ctx.stroke();

    // Opciones del menú
    const menuStartY = panelY + 94;
    const menuSpacing = 31;
    
    MENU_OPTIONS.forEach((option, i) => {
      const y = menuStartY + i * menuSpacing;
      const isSelected = (menuSelection === i);
      
      if (isSelected) {
        // Fondo seleccionado
        ctx.fillStyle = 'rgba(255,245,120,0.14)';
        ctx.fillRect(panelX + 28, y - 19, panelW - 56, 27);
        ctx.strokeStyle = 'rgba(255,245,120,0.52)';
        ctx.strokeRect(panelX + 28.5, y - 19.5, panelW - 57, 26);
        
        // Flechas
        ctx.fillStyle = '#ff0';
        ctx.font = '12px "Press Start 2P"';
        const pulse = Math.sin(globalTime * 0.008) * 3;
        ctx.textAlign = 'left';
        ctx.fillText('>', panelX + 42 - pulse, y);
        ctx.textAlign = 'right';
        ctx.fillText('<', panelX + panelW - 42 + pulse, y);
      }

      ctx.font = isSelected ? '17px "Press Start 2P"' : '14px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillStyle = isSelected ? '#fff36a' : 'rgba(166,176,198,0.72)';
      ctx.fillText(option, W / 2, y);
    });
    
    // Dificultad (HC-12: siempre hardcore)
    let infoY = panelY + panelH - 28;
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.40)';
    ctx.fillText('MODE: ' + difficulties[difficultyIndex].name, W / 2, infoY);
    infoY += 18;

    if (typeof getBalanceProfileLabel === 'function') {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      ctx.fillText('BALANCE: ' + getBalanceProfileLabel(), W / 2, infoY);
    }
    
    // Créditos/Fichas
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#64f5ff';
    ctx.fillText(playerCredits + ' CREDITS', W / 2, H - 74);
    
    // Instrucciones
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.44)';
    ctx.fillText('UP/DOWN SELECT   FIRE=OK', W / 2, H - 48);
    
    // Botones inferiores
    ctx.font = '16px "Press Start 2P"';
    const btnY = H - 40;
    
       
    // Fullscreen
    ctx.fillStyle = '#666';
    ctx.fillText('⛶', W / 2 + 60, btnY);
    
    if (pauseBtn) pauseBtn.textContent = '▶';
  }

  // PANTALLA DE SCORES
  if (state === 'scores') {
    {
    const panelW = Math.min(W - 34, 326);
    const panelH = Math.min(H - 82, 492);
    const panelX = (W - panelW) / 2;
    const panelY = 34;
    const accent = '#64f5ff';
    const scoresPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);

    ctx.fillStyle = 'rgba(0,0,0,0.36)';
    ctx.fillRect(0, 0, W, H);
    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

    ctx.textAlign = 'center';
    drawGlowText(
      'HALL OF FAME',
      W / 2,
      panelY + 38,
      '16px "Press Start 2P"',
      scoresPulse > 0.45 ? '#fff36a' : '#fff',
      'rgba(255,235,90,0.65)'
    );

    ctx.font = '10px "Press Start 2P"';
    const tabY = panelY + 74;
    const tabW = 108;
    const tabH = 26;

    if (scoresTab === 0) {
      ctx.fillStyle = 'rgba(100,245,255,0.14)';
      ctx.fillRect(W / 2 - tabW - 7, tabY - 17, tabW, tabH);
      ctx.strokeStyle = 'rgba(100,245,255,0.55)';
      ctx.strokeRect(W / 2 - tabW - 6.5, tabY - 17.5, tabW - 1, tabH);
    }
    ctx.fillStyle = scoresTab === 0 ? '#64f5ff' : '#586073';
    ctx.fillText('LOCAL', W / 2 - 60, tabY);

    if (scoresTab === 1) {
      ctx.fillStyle = 'rgba(100,245,255,0.14)';
      ctx.fillRect(W / 2 + 7, tabY - 17, tabW, tabH);
      ctx.strokeStyle = 'rgba(100,245,255,0.55)';
      ctx.strokeRect(W / 2 + 7.5, tabY - 17.5, tabW - 1, tabH);
    }
    ctx.fillStyle = scoresTab === 1 ? '#64f5ff' : '#586073';
    ctx.fillText('GLOBAL', W / 2 + 60, tabY);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 96);
    ctx.lineTo(panelX + panelW - 24, panelY + 96);
    ctx.stroke();

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#8a94a8';
    ctx.textAlign = 'left';
    ctx.fillText('#', panelX + 24, panelY + 122);
    ctx.fillText('NAME', panelX + 54, panelY + 122);
    ctx.textAlign = 'right';
    ctx.fillText('SCORE', panelX + panelW - 64, panelY + 122);
    if (scoresTab === 0) ctx.fillText(String.fromCharCode(169), panelX + panelW - 24, panelY + 122);

    ctx.font = '12px "Press Start 2P"';
    for (let i = 0; i < 10; i++) {
      const y = panelY + 148 + i * 27;
      let name, scoreVal, cont;

      if (scoresTab === 0) {
        name = (highNames[i] || '---').toString().slice(0, 8);
        scoreVal = highScores[i] || 0;
        cont = highContinues[i] || 0;
      } else {
        const entry = globalScores[i];
        name = entry ? entry.name.slice(0, 8) : '---';
        scoreVal = entry ? entry.score : 0;
        cont = 0;
      }

      let color = '#555';
      if (i === 0) color = '#ff0';
      else if (i === 1) color = '#ccc';
      else if (i === 2) color = '#c84';
      else if (i < 5) color = '#777';

      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.035)';
        ctx.fillRect(panelX + 18, y - 18, panelW - 36, 22);
      }

      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.fillText((i + 1) + '.', panelX + 24, y);
      ctx.fillText(name, panelX + 54, y);
      ctx.textAlign = 'right';
      ctx.fillText(scoreVal.toString(), panelX + panelW - 64, y);

      if (scoresTab === 0 && cont > 0) {
        ctx.fillStyle = '#f44';
        ctx.fillText(cont.toString(), panelX + panelW - 24, y);
      }
    }

    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    ctx.textAlign = 'center';
    const yourRank = highScores.indexOf(bestScore) + 1;
    ctx.fillText('YOUR BEST: ' + bestScore + (yourRank > 0 ? ' (#' + yourRank + ')' : ''), W / 2, panelY + panelH - 52);

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(String.fromCharCode(8592) + String.fromCharCode(8594) + ' TAB   FIRE=BACK', W / 2, panelY + panelH - 24);

    if (scoresTab === 1 && globalScores.length === 0) {
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#586073';
      ctx.fillText('LOADING...', W / 2, panelY + 250);
    }

    ctx.restore();
    return;
    }
  }

  // PANTALLA DE CREDITS
  if (state === 'credits') {
    {
    const panelW = Math.min(W - 42, 312);
    const panelH = Math.min(H - 96, 430);
    const panelX = (W - panelW) / 2;
    const panelY = 52;
    const accent = '#ff4dcb';
    const creditsPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);

    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.fillRect(0, 0, W, H);
    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

    ctx.textAlign = 'center';
    drawGlowText(
      'CREDITS',
      W / 2,
      panelY + 42,
      '16px "Press Start 2P"',
      creditsPulse > 0.45 ? '#fff36a' : '#fff',
      'rgba(255,77,203,0.68)'
    );

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 66);
    ctx.lineTo(panelX + panelW - 24, panelY + 66);
    ctx.stroke();

    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#64f5ff';
    ctx.fillText('A TRIBUTE TO THE', W / 2, panelY + 104);
    ctx.fillText('ARCADE GAMES OF THE', W / 2, panelY + 129);
    ctx.fillText('80s THAT MARKED', W / 2, panelY + 154);
    ctx.fillText('OUR CHILDHOOD', W / 2, panelY + 179);

    ctx.fillStyle = '#ff4dcb';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('SPACE INVADERS', W / 2, panelY + 224);
    ctx.fillText('GALAGA - GALAXIAN', W / 2, panelY + 244);
    ctx.fillText('AND ALL THE CLASSICS', W / 2, panelY + 264);

    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath();
    ctx.moveTo(panelX + 34, panelY + 288);
    ctx.lineTo(panelX + panelW - 34, panelY + 288);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('MADE WITH ' + String.fromCharCode(9829), W / 2, panelY + 322);
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('BY TANGUITO STUDIO', W / 2, panelY + 347);
    ctx.fillText('& FLIA', W / 2, panelY + 367);

    ctx.fillStyle = '#0f0';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText('LIKE IT? BUY A TOKEN', W / 2, panelY + 402);
    ctx.fillText('TO SUPPORT THE DEV!', W / 2, panelY + 420);

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#586073';
    ctx.fillText(String.fromCharCode(169) + ' 2025', W / 2, Math.min(H - 112, panelY + panelH + 28));

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('FIRE = BACK', W / 2, H - 80);

    ctx.restore();
    return;
    }
  }

  // PANTALLA DE OPTIONS
  if (state === 'options') {
    {
    const panelW = Math.min(W - 34, 326);
    const panelH = Math.min(H - 84, 492);
    const panelX = (W - panelW) / 2;
    const panelY = 42;
    const accent = '#64f5ff';
    const optionsPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
    const rowX = panelX + 20;
    const rowW = panelW - 40;
    const labelX = panelX + 34;
    const valueX = panelX + panelW - 42;
    const optStartY = panelY + 108;
    const optSpacing = 48;

    function drawOptionRow(index, label, value, valueColor, y, danger) {
      const isSelected = optionSelection === index;

      if (isSelected) {
        ctx.fillStyle = danger ? 'rgba(255,54,95,0.16)' : 'rgba(255,245,120,0.12)';
        ctx.fillRect(rowX, y - 20, rowW, danger ? 38 : 32);
        ctx.strokeStyle = danger ? 'rgba(255,54,95,0.5)' : 'rgba(255,245,120,0.45)';
        ctx.strokeRect(rowX + 0.5, y - 20.5, rowW - 1, danger ? 37 : 31);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.035)';
        ctx.fillRect(rowX, y - 20, rowW, 32);
      }

      ctx.font = danger ? '11px "Press Start 2P"' : '12px "Press Start 2P"';
      ctx.textAlign = danger ? 'center' : 'left';
      ctx.fillStyle = isSelected ? (danger ? '#ff365f' : '#fff36a') : (danger ? '#944' : '#dce6ff');
      ctx.fillText(label, danger ? W / 2 : labelX, y);

      if (!danger) {
        ctx.textAlign = 'right';
        ctx.fillStyle = valueColor;
        ctx.fillText(value, valueX, y);
      }

      if (isSelected) {
        const cursorPulse = Math.sin(globalTime * 0.008) * 3;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = danger ? '#ff365f' : '#ff0';
        ctx.textAlign = 'left';
        ctx.fillText('>', rowX + 4 - cursorPulse, y);
        ctx.textAlign = 'right';
        ctx.fillText('<', rowX + rowW - 4 + cursorPulse, y);
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.36)';
    ctx.fillRect(0, 0, W, H);
    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

    ctx.textAlign = 'center';
    drawGlowText(
      'OPTIONS',
      W / 2,
      panelY + 42,
      '18px "Press Start 2P"',
      optionsPulse > 0.45 ? '#fff36a' : '#fff',
      'rgba(100,245,255,0.68)'
    );

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 68);
    ctx.lineTo(panelX + panelW - 24, panelY + 68);
    ctx.stroke();

    let y = optStartY;
    drawOptionRow(0, 'SOUND', isMuted ? 'OFF' : 'ON', isMuted ? '#ff365f' : '#0f0', y, false);

    y = optStartY + optSpacing;
    drawOptionRow(1, 'VIBRATION', vibrationEnabled ? 'ON' : 'OFF', vibrationEnabled ? '#0f0' : '#ff365f', y, false);

    y = optStartY + optSpacing * 2;
    drawOptionRow(2, 'CONTROLS', JOYSTICK_SIZES[joystickSize], joystickSize === 1 ? '#64f5ff' : '#0f0', y, false);

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.moveTo(panelX + 28, optStartY + optSpacing * 2.47);
    ctx.lineTo(panelX + panelW - 28, optStartY + optSpacing * 2.47);
    ctx.stroke();

    y = optStartY + optSpacing * 3;
    // HC-12: always hardcore, no unlock needed
    drawOptionRow(
      3,
      'DIFFICULTY',
      difficulties[difficultyIndex].name,
      difficultyIndex === 0 ? '#0f0' : '#ff365f',
      y,
      false
    );

    y = optStartY + optSpacing * 4;
    const balanceLabel = (typeof getBalanceProfileLabel === 'function') ? getBalanceProfileLabel() : 'ARCADE';
    const isTournament = (typeof getBalanceProfile === 'function') && getBalanceProfile() === 'tournament';
    drawOptionRow(4, 'BALANCE', balanceLabel, isTournament ? '#ff9d2e' : '#0f0', y, false);

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.moveTo(panelX + 28, optStartY + optSpacing * 4.47);
    ctx.lineTo(panelX + panelW - 28, optStartY + optSpacing * 4.47);
    ctx.stroke();

    y = optStartY + optSpacing * 5;
    drawOptionRow(5, 'RESET ALL SCORES', '', '#ff365f', y, true);
    if (optionSelection === 5) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#ff6b82';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS FIRE TO RESET', W / 2, y + 20);
    }

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#586073';
    ctx.textAlign = 'center';
    ctx.fillText('VERSION 1.2', W / 2, panelY + panelH - 52);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(
      String.fromCharCode(8593) + String.fromCharCode(8595) + ' SELECT  ' +
      String.fromCharCode(8592) + String.fromCharCode(8594) + ' CHANGE  FIRE=BACK',
      W / 2,
      panelY + panelH - 24
    );

    ctx.restore();
    return;
    }
  }

  // ✅ PANTALLA DE INGRESO DE NOMBRE
  if (state === 'entering_name') {
    // Resetear cualquier transformación
    ctx.restore();
    ctx.save();
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Título
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('HIGH SCORE!', W / 2, 140);

    // Score logrado
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(`SCORE: ${score}`, W / 2, 180);

    // Instrucciones
    ctx.fillStyle = '#0ff';
    ctx.font = '9px "Press Start 2P"';
    ctx.fillText('USE JOYSTICK UP/DOWN', W / 2, 230);

    // Flecha arriba
    ctx.fillStyle = '#0f0';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('▲', W / 2, 268);

    // ✅ LETRA ACTUAL (grande, centrada)
    ctx.fillStyle = '#0f0';
    ctx.font = '32px "Press Start 2P"';
    ctx.fillText(ALPHABET[currentLetterIndex], W / 2, 308);

    // Flecha abajo
    ctx.fillStyle = '#0f0';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('▼', W / 2, 338);

    // Nombre actual + cursor parpadeante
    nameCursorBlink = (nameCursorBlink + 1) % 60;
    const cursor = nameCursorBlink < 30 ? '_' : ' ';
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText(playerName + cursor, W / 2, 360);

    // Hints móvil
    ctx.fillStyle = '#888';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('FIRE: ADD LETTER', W / 2, 400);
    ctx.fillText('MUTE: DELETE', W / 2, 420);
    ctx.fillText('PAUSE: CONFIRM', W / 2, 440);
    
    ctx.restore();
    return; // ✅ SALIR - no dibujar nada más
  }
  /// ✅ PANTALLA DE CONTINUE
  if (state === 'continue') {
    // Resetear transformaciones
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Fondo negro sólido
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    
    // Título
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.font = '24px "Press Start 2P"';
    ctx.fillText('CONTINUE?', W / 2, 120);
    
    // Countdown
    const seconds = Math.ceil(continueTimer / 1000);
    const pulse = Math.sin(globalTime * 0.01) * 0.3 + 0.7;
    
    ctx.font = '48px "Press Start 2P"';
    ctx.fillStyle = seconds <= 2 ? `rgba(255, 0, 0, ${pulse})` : '#fff';
    ctx.fillText(seconds.toString(), W / 2, 200);
    
    // Score actual
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`SCORE: ${score}`, W / 2, 260);
    ctx.fillText(`LEVEL: ${level}`, W / 2, 285);
    
    // Instrucciones
    ctx.font = '14px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    if (globalTime % 1000 < 500) {
      ctx.fillText('FIRE TO CONTINUE', W / 2, 350);
    }
    
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText('3 LIVES - 1 CREDIT', W / 2, 390);
    
    // Continúas usados
    if (continueCount > 0) {
      ctx.fillStyle = '#666';
      ctx.fillText(`CONTINUES USED: ${continueCount}`, W / 2, 420);
    }
    
    // ✅ Instrucción para salir
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#f44';
    ctx.fillText('🔊 = EXIT TO MENU', W / 2, 480);
    
    return; // No dibujar nada más
  }
  if (state === 'playing' || state === 'paused') {
    // ================================================================
    // HC-RD-01: PRIORITY_FEEDBACK — player ship
    // ================================================================
    // Player
    const pColor = '#fff';
const shipKey = (animationFrame === 0) ? 'player_a' : 'player_b';
const tilt = (player.movingLeft ? -0.08 : player.movingRight ? 0.08 : 0);

// ✅ Parpadeo si es invencible
const shouldShow = !isInvincible || Math.floor(globalTime / 100) % 2 === 0;

if (shouldShow) {
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-cx, -cy);

  // --- HC-92: CORE GLOW ---
  const corePulse = 0.5 + 0.5 * Math.sin(globalTime * 0.025);
  ctx.globalAlpha = 0.08 + corePulse * 0.05;
  var coreGrad = ctx.createRadialGradient(cx, cy - 2, 2, cx, cy - 2, 16);
  coreGrad.addColorStop(0, '#fff');
  coreGrad.addColorStop(0.4, '#6df');
  coreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(cx - 18, cy - 20, 36, 36);

  // --- HC-92: SIDE MARKER LIGHTS ---
  ctx.globalAlpha = 0.5 + 0.3 * Math.sin(globalTime * 0.04);
  ctx.fillStyle = '#0ff';
  ctx.fillRect(player.x + 3, player.y + 12, 3, 3);
  ctx.fillStyle = '#0ff';
  ctx.fillRect(player.x + player.width - 6, player.y + 12, 3, 3);
  ctx.globalAlpha = 0.3 + 0.2 * Math.sin(globalTime * 0.04 + 1.5);
  ctx.fillStyle = '#6ff';
  ctx.fillRect(player.x + 4, player.y + 13, 1, 1);
  ctx.fillRect(player.x + player.width - 5, player.y + 13, 1, 1);

  // --- HC-92: THRUSTER (banking-aware + enhanced, HC-RD-05: subdued)
  var _pfbThr = (typeof getPlayerFeedbackConfig === 'function') ? (getPlayerFeedbackConfig().thruster || {}) : {};
  var _thrMax = (typeof _pfbThr.maxAlpha === 'number') ? _pfbThr.maxAlpha : 0.45;
  var _thrMid = (typeof _pfbThr.midAlpha === 'number') ? _pfbThr.midAlpha : 0.35;
  var _thrGlow = (typeof _pfbThr.glowAlpha === 'number') ? _pfbThr.glowAlpha : 0.04;
  const pulse = 0.65 + 0.35 * Math.sin(globalTime * 0.035);
  const thrust = player.movingUp ? 1.4 : player.movingDown ? 0.6 : 1.0;
  const flameH = Math.max(4, (10 + 6 * pulse) * thrust);
  const fx = cx;
  const fy = player.y + player.height;
  const tiltLean = tilt * 9;

  // --- HC-92: ENGINE BAY GLOW ---
  ctx.globalAlpha = 0.10 + corePulse * 0.06;
  var bayGrad = ctx.createRadialGradient(cx, fy + 2, 1, cx, fy + 2, 10);
  bayGrad.addColorStop(0, '#f80');
  bayGrad.addColorStop(0.5, '#f40');
  bayGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = bayGrad;
  ctx.fillRect(cx - 8, fy - 4, 16, 16);

  ctx.globalAlpha = Math.min(_thrGlow, (0.06 + 0.06 * pulse) * thrust);
  ctx.fillStyle = '#0ff';
  ctx.fillRect(fx - 7 + tiltLean * 0.6, fy - 2, 14, flameH + 6);

  ctx.globalAlpha = Math.min(_thrMax, 0.5 + 0.35 * pulse);
  ctx.fillStyle = '#f80';
  ctx.fillRect(fx - 3 + tiltLean * 0.3, fy, 6, flameH);

  ctx.globalAlpha = Math.min(_thrMax, 0.7);
  ctx.fillStyle = '#ff0';
  ctx.fillRect(fx - 2 + tiltLean * 0.15, fy + 2, 4, Math.max(2, flameH - 3));

  ctx.globalAlpha = Math.min(_thrMid, 0.6);
  ctx.fillStyle = '#fff';
  ctx.fillRect(fx - 1, fy + 3, 2, Math.max(1, flameH - 5));

  // --- HC-92: THRUSTER SPARKS ---
  ctx.globalAlpha = (0.15 + 0.12 * pulse) * thrust;
  ctx.fillStyle = '#ff6';
  ctx.fillRect(fx - 5 + tiltLean * 0.5, fy + flameH * 0.7, 2, 3);
  ctx.fillRect(fx + 3 + tiltLean * 0.5, fy + flameH * 0.7, 2, 3);
  ctx.fillStyle = '#fa0';
  ctx.fillRect(fx - 6 + tiltLean * 0.6, fy + flameH * 0.4, 2, 2);
  ctx.fillRect(fx + 4 + tiltLean * 0.6, fy + flameH * 0.4, 2, 2);

  ctx.globalAlpha = 1;

  const playerFiring = typeof isFiring !== 'undefined' && isFiring;
  if (playerFiring && state === 'playing' && !pendingNextLevel) {
    // HC-RD-07: muzzle flash alpha capped (config-driven)
    var _fzCfg = (typeof getFreezeAuditConfig === 'function') ? getFreezeAuditConfig() : {};
    var _mzMax = (typeof _fzCfg.muzzleFlashCoreMax === 'number') ? _fzCfg.muzzleFlashCoreMax : 0.55;
    const colors = FLASH_BY_WEAPON[player.weaponType] || FLASH_BY_WEAPON.normal;
    const pulse = 0.45 + 0.55 * Math.sin(globalTime * 0.07 + player.x * 0.01);

    if (player.weaponType === 'double') {
      ctx.globalAlpha = 0.10 + 0.12 * pulse;
      ctx.fillStyle = colors[1];
      ctx.fillRect(player.x - 2, player.y - 7, 6, 10);
      ctx.globalAlpha = Math.min(_mzMax, 0.28 + 0.22 * pulse);
      ctx.fillStyle = colors[0];
      ctx.fillRect(player.x - 1, player.y - 5, 4, 7);
      ctx.globalAlpha = Math.min(_mzMax, 0.50 + 0.28 * pulse);
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x, player.y - 3, 2, 4);

      const rx = player.x + player.width - 4;
      ctx.globalAlpha = 0.10 + 0.12 * pulse;
      ctx.fillStyle = colors[1];
      ctx.fillRect(rx - 2, player.y - 7, 6, 10);
      ctx.globalAlpha = Math.min(_mzMax, 0.28 + 0.22 * pulse);
      ctx.fillStyle = colors[0];
      ctx.fillRect(rx - 1, player.y - 5, 4, 7);
      ctx.globalAlpha = Math.min(_mzMax, 0.50 + 0.28 * pulse);
      ctx.fillStyle = '#fff';
      ctx.fillRect(rx, player.y - 3, 2, 4);
    } else {
      ctx.globalAlpha = 0.12 + 0.14 * pulse;
      ctx.fillStyle = colors[1];
      ctx.fillRect(cx - 5, player.y - 9, 10, 14);
      ctx.globalAlpha = Math.min(_mzMax, 0.32 + 0.24 * pulse);
      ctx.fillStyle = colors[0];
      ctx.fillRect(cx - 3, player.y - 7, 6, 11);
      ctx.globalAlpha = Math.min(_mzMax, 0.55 + 0.28 * pulse);
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx - 1.5, player.y - 5, 3, 7);
    }

    ctx.globalAlpha = 1;
  }

  if (isInvincible) {
    var _pfbInv = (typeof getPlayerFeedbackConfig === 'function') ? (getPlayerFeedbackConfig().invincibility || {}) : {};
    var _invFill = (typeof _pfbInv.fillAlpha === 'number') ? _pfbInv.fillAlpha : 0.08;
    var _invStroke = (typeof _pfbInv.strokeAlpha === 'number') ? _pfbInv.strokeAlpha : 0.28;
    var _invInner = (typeof _pfbInv.innerStrokeAlpha === 'number') ? _pfbInv.innerStrokeAlpha : 0.12;
    var _invConst = (typeof _pfbInv.constantOutlineAlpha === 'number') ? _pfbInv.constantOutlineAlpha : 0.15;
    const shieldPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.045);
    const shieldBlink = 0.5 + 0.5 * Math.sin(globalTime * 0.09);
    const shieldW = player.width + 18 + shieldPulse * 5;
    const shieldH = player.height + 16 + shieldPulse * 4;

    // HC-RD-05: subtle constant outline always visible as base
    ctx.globalAlpha = _invConst;
    ctx.strokeStyle = '#64f5ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.5, shieldH * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = _invFill + shieldPulse * 0.05;
    ctx.fillStyle = '#64f5ff';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.5, shieldH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = _invStroke + shieldBlink * 0.12;
    ctx.strokeStyle = '#64f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.5, shieldH * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = _invInner + shieldPulse * 0.06;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.36, shieldH * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawLegacyPlayerShip() {
    // --- HC-92: SILHOUETTE GLOW ---
    ctx.globalAlpha = 0.18 + corePulse * 0.06;
    drawSprite(ctx, SPRITES[shipKey], player.x - 1, player.y, '#48f', 3);
    ctx.globalAlpha = 0.10 + corePulse * 0.04;
    drawSprite(ctx, SPRITES[shipKey], player.x + 1, player.y, '#6cf', 3);
    ctx.globalAlpha = 0.06 + corePulse * 0.03;
    drawSprite(ctx, SPRITES[shipKey], player.x, player.y - 1, '#8df', 3);

    // HC-RD-05: dark silhouette outline for background separation
    var _pfbSil = (typeof getPlayerFeedbackConfig === 'function') ? (getPlayerFeedbackConfig().silhouette || {}) : {};
    var _silColor = _pfbSil.outlineColor || '#040815';
    var _silAlpha = (typeof _pfbSil.outlineAlpha === 'number') ? _pfbSil.outlineAlpha : 0.25;
    ctx.globalAlpha = _silAlpha;
    drawSprite(ctx, SPRITES[shipKey], player.x - 1, player.y - 1, _silColor, 3);
    drawSprite(ctx, SPRITES[shipKey], player.x + 1, player.y - 1, _silColor, 3);
    drawSprite(ctx, SPRITES[shipKey], player.x - 1, player.y + 1, _silColor, 3);
    drawSprite(ctx, SPRITES[shipKey], player.x + 1, player.y + 1, _silColor, 3);

    ctx.globalAlpha = 1;
    drawSprite(ctx, SPRITES[shipKey], player.x, player.y, pColor, 3);
  }

  function getAnimatedPlayerFrame() {
    const bankFrame = Math.floor(globalTime / 100) % 3;
    const idleFrame = Math.floor(globalTime / 140) % 3;

    if (player.movingLeft || tilt < 0) return 3 + bankFrame;
    if (player.movingRight || tilt > 0) return 6 + bankFrame;
    return idleFrame;
  }

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE A: S04 WEDGE animation frame mapping
  // 128x128 frames, 4x2 grid. Simplified state map vs 32-frame strip.
  // ═══════════════════════════════════════════════════════
  function getS04WedgeAnimationFrame() {
    var t = globalTime || Date.now();
    if (isInvincible) {
      return Math.floor(t / 100) % 2 === 0 ? 'damage' : 'idle';
    }
    if (player.movingLeft) return 'bank_left';
    if (player.movingRight) return 'bank_right';
    if (player.movingUp || player.movingDown) return 'thrust'; // thrust animation for vertical
    return 'idle';
  }

  function drawS04WedgePlayer() {
    var frameState = getS04WedgeAnimationFrame();
    var meta = typeof getS04WedgeMeta === 'function' ? getS04WedgeMeta() : null;
    var frame = meta ? meta.frameMap[frameState] : 0;
    var frameW = meta && meta.frameW ? meta.frameW : 128;
    var frameH = meta && meta.frameH ? meta.frameH : 128;
    var pivot = meta && meta.pivot ? meta.pivot : null;
    var pivotX = pivot ? (Array.isArray(pivot) ? pivot[0] : pivot.x) : frameW / 2;
    var pivotY = pivot ? (Array.isArray(pivot) ? pivot[1] : pivot.y) : frameH / 2;
    if (typeof pivotX !== 'number' || !isFinite(pivotX)) pivotX = frameW / 2;
    if (typeof pivotY !== 'number' || !isFinite(pivotY)) pivotY = frameH / 2;
    var playerCenterX = player.x + player.width / 2;
    var playerCenterY = player.y + player.height / 2;

    window.drawSpriteFrame(ctx, 'player_s04_wedge', playerCenterX, playerCenterY, {
      frame: frame,
      rotation: 0,
      scale: 0.45, // 128x128 at 0.45 = ~58px visual — fits gameplay hitbox
      anchorX: pivotX / frameW,
      anchorY: pivotY / frameH
    });
  }

  // ═══════════════════════════════════════════════════════
  // HC-ART-02: S04 WEDGE animation frame mapping (36x44 strip)
  // ═══════════════════════════════════════════════════════
  function getWedgeAnimationFrame() {
    var t = globalTime || Date.now();
    // Hit: use invincibility flash state
    if (isInvincible) {
      if (Math.floor(t / 100) % 2 === 0) return 30; // white flash
      return 0; // normal (alternating with white creates flash effect)
    }
    // Banking directions (8-dir)
    if (player.movingLeft && player.movingUp) return 15 + Math.floor(t / 120) % 3;
    if (player.movingRight && player.movingUp) return 18 + Math.floor(t / 120) % 3;
    if (player.movingLeft && player.movingDown) return 21 + Math.floor(t / 120) % 3;
    if (player.movingRight && player.movingDown) return 24 + Math.floor(t / 120) % 3;
    if (player.movingLeft) return 3 + Math.floor(t / 120) % 3;
    if (player.movingRight) return 6 + Math.floor(t / 120) % 3;
    if (player.movingUp) return 9 + Math.floor(t / 120) % 3;
    if (player.movingDown) return 12 + Math.floor(t / 120) % 3;
    // Idle: engine flicker
    return Math.floor(t / 180) % 3;
  }

  function drawWedgePlayer() {
    var frame = getWedgeAnimationFrame();
    // Draw centered: 36×44 sprite over 33×24 hitbox
    var dx = player.x - 1.5;  // center 36px over 33px
    var dy = player.y - 10;    // center 44px over 24px
    window.drawSpriteFrame(ctx, 'player_wedge', dx, dy, {
      frame: frame,
      rotation: 0,
      scale: 1,
      anchorX: 0,
      anchorY: 0
    });
  }

  function drawPlayerSprite(spriteId, frameIndex) {
    ctx.globalAlpha = 0.18 + corePulse * 0.06;
    window.drawSpriteFrame(ctx, spriteId, player.x - 1, player.y, {
      frame: frameIndex,
      rotation: 0,
      scale: 1,
      anchorX: 0,
      anchorY: 0,
      tint: '#48f'
    });
    ctx.globalAlpha = 0.10 + corePulse * 0.04;
    window.drawSpriteFrame(ctx, spriteId, player.x + 1, player.y, {
      frame: frameIndex,
      rotation: 0,
      scale: 1,
      anchorX: 0,
      anchorY: 0,
      tint: '#6cf'
    });
    ctx.globalAlpha = 0.06 + corePulse * 0.03;
    window.drawSpriteFrame(ctx, spriteId, player.x, player.y - 1, {
      frame: frameIndex,
      rotation: 0,
      scale: 1,
      anchorX: 0,
      anchorY: 0,
      tint: '#8df'
    });

    // HC-RD-05: dark silhouette outline for background separation
    var _pfbSil2 = (typeof getPlayerFeedbackConfig === 'function') ? (getPlayerFeedbackConfig().silhouette || {}) : {};
    var _silColor2 = _pfbSil2.outlineColor || '#040815';
    var _silAlpha2 = (typeof _pfbSil2.outlineAlpha === 'number') ? _pfbSil2.outlineAlpha : 0.25;
    ctx.globalAlpha = _silAlpha2;
    window.drawSpriteFrame(ctx, spriteId, player.x - 1, player.y - 1, { frame: frameIndex, tint: _silColor2 });
    window.drawSpriteFrame(ctx, spriteId, player.x + 1, player.y - 1, { frame: frameIndex, tint: _silColor2 });
    window.drawSpriteFrame(ctx, spriteId, player.x - 1, player.y + 1, { frame: frameIndex, tint: _silColor2 });
    window.drawSpriteFrame(ctx, spriteId, player.x + 1, player.y + 1, { frame: frameIndex, tint: _silColor2 });

    ctx.globalAlpha = 1;
    window.drawSpriteFrame(ctx, spriteId, player.x, player.y, {
      frame: frameIndex,
      rotation: 0,
      scale: 1,
      anchorX: 0,
      anchorY: 0,
      fallback: drawLegacyPlayerShip
    });
  }

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE A: S04 WEDGE priority (HIGHEST)
  // Kill switch: GALAXY_CONFIG.spriteLab.playerS04Wedge === false reverts to player_wedge
  // ═══════════════════════════════════════════════════════
  var _s04WedgeEnabled = !(typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.spriteLab && GALAXY_CONFIG.spriteLab.playerS04Wedge === false);
  if (_s04WedgeEnabled && window.SpriteSystem && window.SpriteSystem.isSpriteReady('player_s04_wedge')) {
    drawS04WedgePlayer();
  } else if (window.SpriteSystem && window.SpriteSystem.isSpriteReady('player_wedge')) {
    drawWedgePlayer();
  } else if (window.SpriteSystem && window.SpriteSystem.isSpriteReady('player_ship_3x3')) {
    drawPlayerSprite('player_ship_3x3', getAnimatedPlayerFrame());
  } else if (window.SpriteSystem && window.SpriteSystem.isSpriteReady('player')) {
    drawPlayerSprite('player', 0);
  } else {
    drawLegacyPlayerShip();
  }
  ctx.restore();
  drawHardcorePlayerHitbox(ctx);
}


    // UFO
    if (ufo.active) drawSprite(ctx, SPRITES.ufo, ufo.x, ufo.y, currentPalette[3], 3);

    // HC-117: boss sprite hook foundation
    var _BOSS_SPRITE_ID_MAP = {
      crossfire: 'boss_crabtron',
      zigzag: 'boss_serpentrix',
      rotate: 'boss_orbital',
      divebomb: 'boss_teniente',
      supreme: 'boss_emperador'
    };

    var _BOSS_READABILITY_MULT = {
      crossfire: 1.53,
      zigzag: 1.42,
      rotate: 1.53,
      divebomb: 1.56,
      supreme: 1.45
    };
    // HC-RD-08: small-screen readability boost
    if (_smallScreenBoost > 1.0) {
      for (var _bk in _BOSS_READABILITY_MULT) {
        if (_BOSS_READABILITY_MULT.hasOwnProperty(_bk)) _BOSS_READABILITY_MULT[_bk] *= _smallScreenBoost;
      }
    }

    function getBossSpriteId(boss) {
      return _BOSS_SPRITE_ID_MAP[boss.pattern] || 'boss_crabtron';
    }

    function getBossLegacySprite(boss) {
      switch (boss.pattern) {
        case 'crossfire': return SPRITES.boss_crabtron;
        case 'zigzag':    return SPRITES.boss_serpentrix;
        case 'rotate':    return SPRITES.boss_orbital;
        case 'divebomb':  return SPRITES.boss_teniente;
        case 'supreme':   return SPRITES.boss_emperador;
        default:          return SPRITES.boss_crabtron;
      }
    }

    function drawBossSpriteOrLegacy(ctx, boss, bossColor, size, opts) {
      var spriteId = getBossSpriteId(boss);
      var sx = size || 5;
      opts = opts || {};
      if (window.SpriteSystem && window.SpriteSystem.isSpriteReady(spriteId)) {
        var sprite = window.SpriteSystem.getSprite(spriteId);
        var scale = Math.min(boss.w / sprite.frameWidth, boss.h / sprite.frameHeight);
        if (!isFinite(scale) || scale <= 0) scale = 1;
        scale *= _BOSS_READABILITY_MULT[boss.pattern] || 1;
        window.drawSpriteFrame(ctx, spriteId, boss.x + boss.w / 2, boss.y + boss.h / 2, {
          frame: 0,
          scale: scale,
          anchorX: 0.5,
          anchorY: 0.5,
          tint: opts.tint || undefined,
          alpha: opts.alpha || undefined
        });
        return true;
      }
      var bossSprite = getBossLegacySprite(boss);
      drawSprite(ctx, bossSprite, boss.x, boss.y, bossColor, sx);
      return false;
    }

    // ================================================================
    // HC-RD-01: PRIORITY_ENEMY — boss
    // ================================================================
    if (boss.active) {
      const bossSprite = getBossLegacySprite(boss);
      
      const bossColor = boss.color || '#f00';
      var _bossAmbientMax = (typeof getGlowPolicyConfig === 'function')
        ? getGlowPolicyConfig().bossAmbientGlowMax || 0.06
        : 0.06;
      var _rawBossGlow = 0.08 + 0.03 * Math.sin(globalTime * 0.018);
      const bossGlow = Math.min(_bossAmbientMax, _rawBossGlow);

      // HC-VS-02D: staged boss backdrop, kept behind gameplay threats.
      ctx.save();
      ctx.globalAlpha = 0.11;
      ctx.fillStyle = '#02030a';
      ctx.fillRect(-10, -10, W + 20, H + 20);
      ctx.globalAlpha = 0.035 + 0.01 * Math.sin(globalTime * 0.009 + 1.2);
      ctx.fillStyle = bossColor;
      ctx.fillRect(-10, -10, W + 20, H + 20);
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = bossColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(14.5, 54.5, W - 29, H - 112);
      ctx.restore();

      // HC-121: idle menace motion per boss
      var _menaceOX = 0;
      var _menaceOY = 0;
      switch (boss.pattern) {
        case 'crossfire':
          _menaceOX = Math.sin(globalTime * 0.025 + 1) * 1.5;
          _menaceOY = Math.cos(globalTime * 0.025 + 2) * 0.8;
          break;
        case 'zigzag':
          _menaceOY = Math.sin(globalTime * 0.012) * 2.5;
          break;
        case 'rotate':
          _menaceOY = Math.sin(globalTime * 0.015) * 2.0;
          break;
        case 'divebomb':
          _menaceOX = Math.sin(globalTime * 0.020 + 3) * 2.0;
          _menaceOY = Math.cos(globalTime * 0.018 + 1) * 1.2;
          break;
        case 'supreme':
          _menaceOY = Math.sin(globalTime * 0.008) * 1.2;
          break;
      }
      ctx.save();
      ctx.translate(_menaceOX, _menaceOY);

      // HC-VS-03D2: check hero readiness once per frame
      var _crabtronHeroReady = (boss.pattern === 'crossfire' && window.SpriteSystem && window.SpriteSystem.isSpriteReady('boss_crabtron_hero'));
      // SPRITE LAB PHASE D: check Imperial Flagship readiness once per frame
      var _imperialFlagshipReady = (boss.pattern === 'supreme' && window.SpriteSystem && window.SpriteSystem.isSpriteReady('boss_imperial_flagship') && isFlagshipVisualEnabled());
      // HC-SPRITE-SERPENTRIX-03: check Serpentrix Hero readiness once per frame
      var _serpentrixHeroReady = (boss.pattern === 'zigzag' && window.SpriteSystem && window.SpriteSystem.isSpriteReady('boss_serpentrix_hero') && isSerpentrixHeroEnabled());

      ctx.save();
      ctx.globalAlpha = _crabtronHeroReady ? 0 : bossGlow * 0.55;
      drawSprite(ctx, bossSprite, boss.x - 4, boss.y, bossColor, 5);
      drawSprite(ctx, bossSprite, boss.x + 4, boss.y, bossColor, 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y - 4, bossColor, 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y + 4, bossColor, 5);
      ctx.globalAlpha = _crabtronHeroReady ? 0 : 0.24;
      drawSprite(ctx, bossSprite, boss.x - 2, boss.y, '#120008', 5);
      drawSprite(ctx, bossSprite, boss.x + 2, boss.y, '#120008', 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y - 2, '#120008', 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y + 2, '#120008', 5);
      ctx.restore();

      if (boss.pattern === 'crossfire') {
        if (!_crabtronHeroReady) drawArticulatedBossArms(ctx, boss, bossColor, globalTime);
        drawCrabtronShootTelegraph(ctx, boss, bossColor, globalTime);
        drawBossHardcoreTelegraph(ctx, boss);
        if (!_crabtronHeroReady) drawCrabtronArmorPlates(ctx, boss, bossColor, globalTime);
        drawCrabtronMuzzleFlash(ctx, boss, bossColor, globalTime);
        drawCrabtronDashTelegraph(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'zigzag') {
        if (!_serpentrixHeroReady) drawSerpentrixAura(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'rotate') {
        drawOrbitalEnergyField(ctx, boss, bossColor, globalTime);
        drawOrbitalRingArcs(ctx, boss, bossColor, globalTime);
        drawOrbitalPulseWarning(ctx, boss, bossColor, globalTime);
        drawOrbitalTractorBeamIndicator(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'divebomb') {
        drawTenienteAura(ctx, boss, bossColor, globalTime);
        drawTenienteEngineTrails(ctx, boss, bossColor, globalTime);
        drawTenienteImpactWarning(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'supreme') {
        drawEmperorImperialAura(ctx, boss, bossColor, globalTime);
        // HC-SPRITE-WIRE-02: EnergyMantle replaced by flagship sprite body when ready
        if (!_imperialFlagshipReady) drawEmperorEnergyMantle(ctx, boss, bossColor, globalTime);
        drawEmperorTeleportIndicator(ctx, boss, bossColor, globalTime);
      }

      // HC-19: hardcore boss telegraph (all patterns)
      if (typeof drawBossHardcoreTelegraph === 'function') drawBossHardcoreTelegraph(ctx, boss);

      // HC-BD-09: SERPENTRIX delayed trap telegraph
      if (typeof drawSerpentrixSignatureTrapTelegraph === 'function') drawSerpentrixSignatureTrapTelegraph(ctx);

      // HC-BD-10: ORBITAL pressure ring telegraph
      if (typeof drawOrbitalSignatureRingTelegraph === 'function') drawOrbitalSignatureRingTelegraph(ctx);

      // HC-BD-11: TENIENTE laser sweep telegraph
      if (typeof drawTenienteSignatureSweepTelegraph === 'function') drawTenienteSignatureSweepTelegraph(ctx);

      // HC-BD-12: EMPERADOR phase burst telegraph
      if (typeof drawEmperadorSignatureBurstTelegraph === 'function') drawEmperadorSignatureBurstTelegraph(ctx);

      // HC-20: phase transition FX (all patterns)
      if (typeof drawBossPhaseTransitionFX === 'function') drawBossPhaseTransitionFX(ctx, boss);

      // HC-58: BOSS IDENTITY DEBUG OVERLAY
      if (typeof getHardcoreDebugConfig === 'function' && getHardcoreDebugConfig().showBossPattern) {
        ctx.save();
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.font = '5px "Press Start 2P"';
        var bx = boss.x + (boss.w || 90) / 2;
        var by = boss.y - 18;
        var bName = boss.name || '-';
        var bPhase = (typeof getBossPhaseSafe === 'function') ? getBossPhaseSafe(boss) : getBossPhase ? getBossPhase() : 1;
        var bReady = (boss.patternReady) ? 'RDY' : '---';
        var bPattern = boss.pattern || '-';
        var bTelegraph = (boss._hcTelegraphType && boss._hcTelegraphTimer > 0) ? 'TG:' + boss._hcTelegraphType : '';
        var bId = (typeof window.getHardcoreBossId === 'function') ? window.getHardcoreBossId(boss) : -1;
        var bRegEntry = null;
        if (bId > 0 && typeof window.getHardcoreBossRegistry === 'function') {
          var reg = window.getHardcoreBossRegistry();
          bRegEntry = reg[bId - 1] || null;
        }
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#ff0';
        ctx.fillText(bName + ' P' + bPhase + ' ' + bReady, bx, by);
        ctx.globalAlpha = 0.72;
        ctx.fillStyle = '#ff8';
        ctx.fillText(bPattern, bx, by + 8);
        if (bRegEntry) {
          ctx.globalAlpha = 0.60;
          ctx.fillStyle = '#8cf';
          ctx.fillText('#' + bRegEntry.id + ' phases:' + bRegEntry.phaseCount, bx, by + 16);
          ctx.fillText(bRegEntry.updateFnName, bx, by + 24);
        }
        if (bTelegraph) {
          ctx.globalAlpha = 0.65;
          ctx.fillStyle = '#f88';
          ctx.fillText(bTelegraph, bx, by + 32);
        }

        // HC-76: BOSS DISPATCH DEBUG
        if (typeof getHardcoreDebugConfig === 'function' && getHardcoreDebugConfig().showBossDispatch) {
          var dOn = (bId > 0 && typeof isHardcoreEnabled === 'function' && isHardcoreEnabled()) ? 'ON' : 'OFF';
          var dConsumed = boss._hcDispatchConsumed ? 'true' : 'false';
          ctx.globalAlpha = 0.65;
          ctx.fillStyle = '#8f8';
          ctx.fillText('DISPATCH: ' + dOn, bx, by + 40);
          ctx.fillStyle = boss._hcDispatchConsumed ? '#0f0' : '#f44';
          ctx.fillText('CONSUMED: ' + dConsumed, bx, by + 48);
          ctx.fillStyle = '#8cf';
          ctx.fillText('BOSS ID: ' + bId, bx, by + 56);
        }
        ctx.restore();
      }

      // HC-121: radial boss aura (soft concentric glow behind sprite, only for bosses without own aura)
      if (boss.pattern === 'crossfire') {
        ctx.save();
        for (var _ai = 4; _ai >= 0; _ai--) {
          var _aa = 0.010 * (5 - _ai);
          var _as = (_ai + 1) * 8;
          ctx.globalAlpha = _aa;
          ctx.fillStyle = bossColor;
          ctx.fillRect(boss.x - _as, boss.y - _as, boss.w + _as * 2, boss.h + _as * 2);
        }
        ctx.restore();
      }

      // HC-VS-03D3: CRABTRON hero layered body — presentation-driven phase states
      // Hero render scale is metadata-driven (scaleHint from _CRABTRON_HERO_META).
      // Falls back to 0.45 if metadata is unavailable.
      if (boss.pattern === 'crossfire') {
        var _heroState = resolveCrabtronHeroState(boss);
        var _heroMetaScale = (typeof getCrabtronHeroMeta === 'function' && getCrabtronHeroMeta().scaleHint) ? getCrabtronHeroMeta().scaleHint : 0.45;
        var _heroScale = _heroMetaScale;
        if (_smallScreenBoost > 1.0) _heroScale *= _smallScreenBoost;
        _heroScale = Math.max(0.38, Math.min(0.55, _heroScale));
        drawCrabtronHeroLayers(ctx, boss, _heroState, _heroScale);
      }

      // HC-SPRITE-SERPENTRIX-03: SERPENTRIX hero layered body
      if (boss.pattern === 'zigzag') {
        var _serpState = resolveSerpentrixHeroState(boss);
        var _serpMetaScale = (typeof getSerpentrixHeroMeta === 'function' && getSerpentrixHeroMeta().scaleHint) ? getSerpentrixHeroMeta().scaleHint : 0.45;
        var _serpScale = _serpMetaScale;
        if (_smallScreenBoost > 1.0) _serpScale *= _smallScreenBoost;
        _serpScale = Math.max(0.38, Math.min(0.65, _serpScale));
        drawSerpentrixHeroLayers(ctx, boss, _serpState, _serpScale);
      }

      // HC-SPRITE-WIRE-02: Imperial Flagship visual for EMPERADOR (level 20)
      // Visual-only swap — no gameplay, hitbox, collision, or AI changes.
      // Falls back to legacy EMPERADOR geometric rendering when sprite unavailable.
      if (boss.pattern === 'supreme' && _imperialFlagshipReady) {
        drawImperialFlagshipVisual(ctx, boss);
      }

      // HC-VS-03D2: legacy body replaced by hero layers when ready
      // HC-SPRITE-WIRE-02: also replaced by flagship visual when ready
      // HC-SPRITE-SERPENTRIX-03: also replaced by serpentrix hero when ready
      if (!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady) drawBossSpriteOrLegacy(ctx, boss, bossColor, 5);

      // HC-121: core pulse brightness
      if (!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady) {
        var _corePulse = 0.5 + 0.5 * Math.sin(globalTime * 0.003);
        ctx.save();
        ctx.globalAlpha = 0.020 + _corePulse * 0.026;
        drawBossSpriteOrLegacy(ctx, boss, '#ffffff', 5, { tint: '#ffffff' });
        ctx.restore();
      }

      if (boss.pattern === 'zigzag') {
        if (!_serpentrixHeroReady) {
          drawSerpentrixWave(ctx, boss, bossColor, globalTime);
          drawSerpentrixEyes(ctx, boss, bossColor, globalTime);
          drawSerpentrixFangs(ctx, boss, bossColor, globalTime);
          drawSerpentrixVenomDrops(ctx, boss, bossColor, globalTime);
        }
      } else if (boss.pattern === 'rotate') {
        drawOrbitalCore(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'divebomb') {
        drawTenienteWings(ctx, boss, bossColor, globalTime);
        drawTenienteCannons(ctx, boss, bossColor, globalTime);
        drawTenienteCockpit(ctx, boss, bossColor, globalTime);
        drawTenienteLights(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'supreme') {
        // HC-SPRITE-WIRE-02: CrownHalo replaced by flagship sprite when ready
        if (!_imperialFlagshipReady) drawEmperorCrownHalo(ctx, boss, bossColor, globalTime);
      }

      // HC-VS-03D2: ambient glow replaced by hero overlay_glow_damage layer
      // HC-SPRITE-WIRE-02: also gated when flagship sprite is active
      // HC-SPRITE-SERPENTRIX-03: also gated when serpentrix hero is active
      if (!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady) {
        ctx.save();
        ctx.globalAlpha = 0.055;
        drawSprite(ctx, bossSprite, boss.x, boss.y - 1, '#ffd0c0', 5);
        ctx.restore();
      }

      if (boss.pattern === 'crossfire') {
        // HC-VS-03D2: legacy core gated — hero weakpoint_core layer provides its own animated pulse.
        // Legacy pixel-art core rings are only drawn as a fallback when hero sprite is unavailable.
        if (!_crabtronHeroReady) drawCrabtronCore(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'divebomb') {
        drawTenienteCore(ctx, boss, bossColor, globalTime);
      } else if (boss.pattern === 'supreme') {
        // HC-SPRITE-WIRE-02: EmperorCore + PhaseOverload replaced by flagship sprite when ready
        if (!_imperialFlagshipReady) {
          drawEmperorCore(ctx, boss, bossColor, globalTime);
          drawEmperorPhaseOverload(ctx, boss, bossColor, globalTime);
        }
      }

      ctx.restore();

      if (boss.flashTimer > 0) {
        const flicker = 0.18 + 0.14 * Math.sin(globalTime * 0.04 + boss.flashTimer * 0.01);
        ctx.save();
        // HC-VS-03D4: legacy sprite flash gated behind hero; white crosshair always visible
        // HC-SPRITE-WIRE-02: also gated behind flagship
        // HC-SPRITE-SERPENTRIX-03: also gated behind serpentrix hero
        if (!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady) {
          ctx.globalAlpha = flicker;
          drawBossSpriteOrLegacy(ctx, boss, bossColor, 5);
          ctx.globalAlpha = flicker * 0.24;
          drawBossSpriteOrLegacy(ctx, boss, '#ffffff', 5, { tint: '#ffffff' });
        }
        ctx.globalAlpha = Math.min(0.44, flicker * 1.6);
        ctx.fillStyle = '#fff';
        var _bfx = Math.round(boss.x + boss.w / 2);
        var _bfy = Math.round(boss.y + boss.h / 2);
        ctx.fillRect(_bfx - 12, _bfy - 1, 24, 2);
        ctx.fillRect(_bfx - 1, _bfy - 12, 2, 24);
        ctx.restore();
      }
           
      const hpPct = Math.max(0, Math.min(1, boss.hp / boss.maxHp));

      const _barW = 200;
      const _barH = 8;
      const _barX = W / 2 - _barW / 2;
      const _barY = 92;
      const _pad = 4;

      ctx.save();

      // HC-RD-06: boss HP bar readability — config-driven alphas
      var _hudCfg = (typeof getHUDReadabilityConfig === 'function') ? getHUDReadabilityConfig() : null;
      var _hpCfg = (_hudCfg && _hudCfg.bossHP) || {};
      var _hpFill = (typeof _hpCfg.fillAlpha === 'number') ? _hpCfg.fillAlpha : 0.65;
      var _hpAccent = (typeof _hpCfg.accentAlpha === 'number') ? _hpCfg.accentAlpha : 0.35;
      var _hpBg = (typeof _hpCfg.bgAlpha === 'number') ? _hpCfg.bgAlpha : 0.18;
      var _hpBorder = (typeof _hpCfg.borderAlpha === 'number') ? _hpCfg.borderAlpha : 0.20;
      var _hpLowPulseMax = (typeof _hpCfg.lowHPPulseMax === 'number') ? _hpCfg.lowHPPulseMax : 0.18;

      // Outer panel bg
      ctx.globalAlpha = _hpBg + 0.10;
      ctx.fillStyle = '#000';
      ctx.fillRect(_barX - _pad, _barY - _pad, _barW + _pad * 2, _barH + _pad * 2);

      // Outer border
      ctx.globalAlpha = _hpBorder;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(_barX - _pad + 0.5, _barY - _pad + 0.5, _barW + _pad * 2 - 1, _barH + _pad * 2 - 1);

      // Accent top line
      ctx.globalAlpha = _hpAccent;
      ctx.strokeStyle = boss.color || '#f44';
      ctx.beginPath();
      ctx.moveTo(_barX - _pad, _barY - _pad + 0.5);
      ctx.lineTo(_barX + _barW + _pad, _barY - _pad + 0.5);
      ctx.stroke();

      // Bar background
      ctx.globalAlpha = _hpBg;
      ctx.fillStyle = '#200';
      ctx.fillRect(_barX, _barY, _barW, _barH);

      // Bar fill color
      var _barColor;
      if (hpPct > 0.66) {
        _barColor = boss.color || '#f00';
      } else if (hpPct > 0.33) {
        _barColor = '#f80';
      } else {
        _barColor = '#f33';
      }

      var _fillW = _barW * hpPct;

      // Gradient fill for bar (top half bright, bottom solid)
      ctx.globalAlpha = _hpFill;
      ctx.fillStyle = _barColor;
      ctx.fillRect(_barX, _barY, _fillW, _barH);

      // Top shine gradient
      var shineGrad = ctx.createLinearGradient(0, _barY, 0, _barY + _barH * 0.5);
      shineGrad.addColorStop(0, 'rgba(255,255,255,0.28)');
      shineGrad.addColorStop(1, 'rgba(255,255,255,0.04)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = shineGrad;
      ctx.fillRect(_barX, _barY, _fillW, Math.floor(_barH * 0.5));

      // Segment lines (subtler)
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      for (var _sx = _barX + 14; _sx < _barX + _barW; _sx += 22) {
        if (_sx > _barX + _fillW) break;
        ctx.beginPath();
        ctx.moveTo(_sx + 0.5, _barY + 1);
        ctx.lineTo(_sx + 0.5, _barY + _barH - 1);
        ctx.stroke();
      }

      // Low HP pulse
      if (hpPct <= 0.33) {
        var _pulse = 0.08 + _hpLowPulseMax * Math.sin(globalTime * 0.012);
        ctx.globalAlpha = _pulse;
        ctx.fillStyle = '#f00';
        ctx.fillRect(_barX, _barY, _fillW, _barH);
      }

      // HC-RD-06: dark outline around bar for readability
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = '#050510';
      ctx.lineWidth = 1;
      ctx.strokeRect(_barX - 0.5, _barY - 0.5, _barW + 1, _barH + 1);

      // Boss name
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1;
      ctx.font = '8px "Press Start 2P"';
      var _txtColor = boss.color || '#fff';
      if (_txtColor === '#f00' || _txtColor === '#ff0000') _txtColor = '#ffd6d6';
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2 + 1, _barY - 9);
      ctx.fillStyle = _txtColor;
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2, _barY - 11);

      ctx.restore();
    }

    // ═══════════════════════════════════════════════════════
    // SPRITE LAB PHASE C: Mini-boss hierarchy visual system
    // Visual-only rendering — no gameplay, no hitbox, no AI changes.
    // Registered for future mini-boss encounter integration.
    // ═══════════════════════════════════════════════════════

    var _MINIBOSS_SPRITE_ID = 'boss_miniboss_hierarchy';

    var _MINIBOSS_VISUAL_MAP = {
      scout_hive_leader:       { frame: 0, faction: 'scout_alien',      color: '#5ef7ff', fallbackKey: 'boss_crabtron' },
      suppressor_siege_core:   { frame: 1, faction: 'suppressor_alien', color: '#ff5533', fallbackKey: 'boss_serpentrix' },
      splitter_aberrant_node:  { frame: 2, faction: 'splitter_alien',   color: '#dd66cc', fallbackKey: 'boss_orbital' },
      imperial_command_lancer: { frame: 3, faction: 'imperial_alien',   color: '#ffd866', fallbackKey: 'boss_emperador' }
    };

    function getMiniBossVisualConfig(unitId) {
      return _MINIBOSS_VISUAL_MAP[unitId] || null;
    }

    function isMiniBossVisualEnabled(unitId) {
      if (typeof GALAXY_CONFIG === 'undefined') return false;
      var sl = GALAXY_CONFIG.spriteLab;
      if (!sl || sl.miniBossHierarchy === false) return false;
      switch (unitId) {
        case 'scout_hive_leader':        return sl.miniBossScout !== false;
        case 'suppressor_siege_core':    return sl.miniBossSuppressor !== false;
        case 'splitter_aberrant_node':   return sl.miniBossSplitter !== false;
        case 'imperial_command_lancer':  return sl.miniBossImperial !== false;
        default: return sl.miniBossHierarchy !== false;
      }
    }

    function isMiniBossSpriteReady() {
      return !!(window.SpriteSystem && window.SpriteSystem.isSpriteReady(_MINIBOSS_SPRITE_ID));
    }

    function drawMiniBossVisual(ctx, unitId, x, y, w, h, opts) {
      if (!ctx) return false;
      if (!isMiniBossVisualEnabled(unitId)) return false;

      var visual = getMiniBossVisualConfig(unitId);
      if (!visual) return false;

      opts = opts || {};
      var alpha = (typeof opts.alpha === 'number') ? opts.alpha : 1;
      var tint = opts.tint || undefined;
      var rotation = (typeof opts.rotation === 'number') ? opts.rotation : 0;
      var scale = (typeof opts.scale === 'number') ? opts.scale : 1;
      var flipX = opts.flipX === true;
      var drawX = (typeof opts.x === 'number') ? opts.x : x;
      var drawY = (typeof opts.y === 'number') ? opts.y : y;
      var dw = (typeof w === 'number') ? w : 128;
      var dh = (typeof h === 'number') ? h : 128;

      if (isMiniBossSpriteReady()) {
        var computedScale = scale;
        if (!opts.scale) {
          var sprite = window.SpriteSystem.getSprite(_MINIBOSS_SPRITE_ID);
          if (sprite) {
            computedScale = Math.min(dw / sprite.frameWidth, dh / sprite.frameHeight);
          }
          if (!isFinite(computedScale) || computedScale <= 0) computedScale = 1;
        }
        window.drawSpriteFrame(ctx, _MINIBOSS_SPRITE_ID, drawX + dw / 2, drawY + dh / 2, {
          frame: visual.frame,
          scale: computedScale,
          anchorX: 0.5,
          anchorY: 0.5,
          alpha: alpha,
          tint: tint,
          rotation: rotation,
          flipX: flipX,
          fallback: function () {
            drawMiniBossFallback(ctx, unitId, drawX, drawY, dw, dh, visual);
          }
        });
        return true;
      }

      drawMiniBossFallback(ctx, unitId, drawX, drawY, dw, dh, visual);
      return false;
    }

    function drawMiniBossFallback(ctx, unitId, x, y, w, h, visual) {
      if (!ctx) return;
      var v = visual || getMiniBossVisualConfig(unitId);
      var col = v ? v.color : '#887766';
      var cx = x + w / 2;
      var cy = y + h / 2;
      var radius = Math.min(w, h) * 0.4;

      ctx.save();
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.50;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = col;
      ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
      ctx.restore();
    }

    // SPRITE LAB PHASE C: debug overlay — show mini-boss visual ID when debug mode is active
    function drawMiniBossDebugOverlay(ctx, unitId, x, y, w, h) {
      if (!ctx || !unitId) return;
      var debugCfg = (typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.debug) ? GALAXY_CONFIG.debug : null;
      if (!debugCfg || !(debugCfg.showBossPattern || debugCfg.showHardcoreInfo || debugCfg.showEnemyRoles)) return;

      ctx.save();
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.font = '4px "Press Start 2P"';
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = '#ff0';
      ctx.fillText('MB:' + unitId, x + w / 2, y - 8);
      var visual = getMiniBossVisualConfig(unitId);
      if (visual) {
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = visual.color;
        ctx.fillText(visual.faction + ' f:' + visual.frame, x + w / 2, y - 4);
      }
      ctx.restore();
    }

    // ═══════════════════════════════════════════════════════
    // SPRITE LAB PHASE D: Imperial Flagship Command visual system
    // Visual-only rendering — no gameplay, no hitbox, no AI changes.
    // Phase support: master, damaged, core_exposed
    // ═══════════════════════════════════════════════════════

    var _FLAGSHIP_SPRITE_ID = 'boss_imperial_flagship';
    var _FLAGSHIP_PHASE_LABELS = ['master', 'damaged', 'core_exposed'];

    function getFlagshipPhaseFrame(phase) {
      if (typeof window.getImperialFlagshipPhaseFrame === 'function') {
        var f = window.getImperialFlagshipPhaseFrame(phase);
        if (f >= 0) return f;
      }
      var idx = _FLAGSHIP_PHASE_LABELS.indexOf(phase);
      return idx >= 0 ? idx : 0;
    }

    function isFlagshipVisualEnabled() {
      if (typeof GALAXY_CONFIG === 'undefined') return false;
      var sl = GALAXY_CONFIG.spriteLab;
      return !!(sl && sl.imperialFlagship !== false);
    }

    // HC-SPRITE-SERPENTRIX-03: Serpentrix Hero kill switch helper
    function isSerpentrixHeroEnabled() {
      if (typeof GALAXY_CONFIG === 'undefined') return false;
      var sl = GALAXY_CONFIG.spriteLab;
      return !!(sl && sl.serpentrixHero !== false);
    }

    function isFlagshipSpriteReady() {
      return !!(window.SpriteSystem && window.SpriteSystem.isSpriteReady(_FLAGSHIP_SPRITE_ID));
    }

    function getFlagshipPhaseDebugOverride() {
      if (typeof GALAXY_CONFIG === 'undefined') return null;
      var sl = GALAXY_CONFIG.spriteLab;
      if (!sl || !sl.imperialFlagshipPhaseDebug) return null;
      if (typeof GALAXY_CONFIG.debug === 'undefined') return null;
      if (typeof window._flagshipPhaseDebugOverride === 'string') return window._flagshipPhaseDebugOverride;
      return null;
    }

    function resolveFlagshipVisualPhase(boss) {
      var debugOverride = getFlagshipPhaseDebugOverride();
      if (debugOverride) return debugOverride;

      if (!boss) return 'master';
      var hpPct = boss.hp > 0 && boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
      if (hpPct > 0.66) return 'master';
      if (hpPct > 0.33) return 'damaged';
      return 'core_exposed';
    }

    function drawImperialFlagshipVisual(ctx, boss, x, y, w, h, opts) {
      if (!ctx) return false;
      if (!isFlagshipVisualEnabled()) return false;

      opts = opts || {};
      var phase = opts.phase || resolveFlagshipVisualPhase(boss);
      var frame = getFlagshipPhaseFrame(phase);
      var drawX = (typeof opts.x === 'number') ? opts.x : (x || (boss ? boss.x : 0));
      var drawY = (typeof opts.y === 'number') ? opts.y : (y || (boss ? boss.y : 0));
      var drawW = (typeof opts.w === 'number') ? opts.w : (w || (boss ? boss.w : 192));
      var drawH = (typeof opts.h === 'number') ? opts.h : (h || (boss ? boss.h : 192));
      var alpha = (typeof opts.alpha === 'number') ? opts.alpha : 1;
      var tint = opts.tint || undefined;
      var rotation = (typeof opts.rotation === 'number') ? opts.rotation : 0;
      var flipX = opts.flipX === true;
      var scale = (typeof opts.scale === 'number') ? opts.scale : 1;

      if (isFlagshipSpriteReady()) {
        var computedScale = scale;
        if (!opts.scale) {
          var sprite = window.SpriteSystem.getSprite(_FLAGSHIP_SPRITE_ID);
          if (sprite) {
            var metaScale = (typeof getImperialFlagshipMeta === 'function' && getImperialFlagshipMeta().scaleHint) ? getImperialFlagshipMeta().scaleHint : 0.75;
            computedScale = Math.min(drawW / sprite.frameWidth, drawH / sprite.frameHeight) * metaScale;
          }
          if (!isFinite(computedScale) || computedScale <= 0) computedScale = 1;
        }
        window.drawSpriteFrame(ctx, _FLAGSHIP_SPRITE_ID, drawX + drawW / 2, drawY + drawH / 2, {
          frame: frame,
          scale: computedScale,
          anchorX: 0.5,
          anchorY: 0.5,
          alpha: alpha,
          tint: tint,
          rotation: rotation,
          flipX: flipX,
          fallback: function () {
            drawFlagshipFallback(ctx, drawX, drawY, drawW, drawH, phase);
          }
        });
        return true;
      }

      drawFlagshipFallback(ctx, drawX, drawY, drawW, drawH, phase);
      return false;
    }

    function drawFlagshipFallback(ctx, x, y, w, h, phase) {
      if (!ctx) return;
      var phaseColors = { master: '#ffe066', damaged: '#e6a817', core_exposed: '#ff5533' };
      var col = phaseColors[phase] || '#d6b85a';
      var cx = x + w / 2;
      var cy = y + h / 2;
      var radius = Math.min(w, h) * 0.45;

      ctx.save();
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = col;
      ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = col;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      if (phase === 'core_exposed') {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#ff4422';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawFlagshipDebugOverlay(ctx, boss, phase, x, y, w, h) {
      if (!ctx) return;
      var debugCfg = (typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.debug) ? GALAXY_CONFIG.debug : null;
      if (!debugCfg || !(debugCfg.showBossPattern || debugCfg.showHardcoreInfo)) return;

      var drawX = (typeof x === 'number') ? x : (boss ? boss.x : 0);
      var drawY = (typeof y === 'number') ? y : (boss ? boss.y : 0);
      var drawW = (typeof w === 'number') ? w : (boss ? boss.w : 192);
      var ph = phase || resolveFlagshipVisualPhase(boss);
      var frame = getFlagshipPhaseFrame(ph);

      ctx.save();
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.font = '4px "Press Start 2P"';
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = '#ff0';
      ctx.fillText('FLAGSHIP ' + ph, drawX + drawW / 2, drawY - 14);
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#d6b85a';
      ctx.fillText('f:' + frame + ' imperial_alien', drawX + drawW / 2, drawY - 8);
      var enabled = isFlagshipVisualEnabled();
      var ready = isFlagshipSpriteReady();
      ctx.fillStyle = enabled ? (ready ? '#0f0' : '#f80') : '#f00';
      ctx.fillText(enabled ? (ready ? 'RDY' : 'LOADING') : 'OFF', drawX + drawW / 2, drawY - 4);
      ctx.restore();
    }

    // ═══════════════════════════════════════════════════════
    // SPRITE LAB PHASE E: Orbital Siege Colossus (Fortress) visual system
    // Visual-only rendering — no gameplay, no hitbox, no AI changes.
    // States: master, damaged, core_exposed, weapon_open
    // ═══════════════════════════════════════════════════════

    var _COLOSSUS_SPRITE_ID = 'boss_orbital_siege_colossus';
    var _COLOSSUS_STATE_LABELS = ['master', 'damaged', 'core_exposed', 'weapon_open'];

    function getColossusStateFrame(state) {
      if (typeof window.getOrbitalSiegeColossusPhaseFrame === 'function') {
        var f = window.getOrbitalSiegeColossusPhaseFrame(state);
        if (f >= 0) return f;
      }
      var idx = _COLOSSUS_STATE_LABELS.indexOf(state);
      return idx >= 0 ? idx : 0;
    }

    function isColossusVisualEnabled() {
      if (typeof GALAXY_CONFIG === 'undefined') return false;
      var sl = GALAXY_CONFIG.spriteLab;
      return !!(sl && sl.orbitalSiegeColossus !== false);
    }

    function isColossusSpriteReady() {
      return !!(window.SpriteSystem && window.SpriteSystem.isSpriteReady(_COLOSSUS_SPRITE_ID));
    }

    function getColossusStateDebugOverride() {
      if (typeof GALAXY_CONFIG === 'undefined') return null;
      var sl = GALAXY_CONFIG.spriteLab;
      if (!sl || !sl.orbitalSiegeStateDebug) return null;
      if (typeof window._orbitalSiegeStateDebugOverride === 'string') return window._orbitalSiegeStateDebugOverride;
      return null;
    }

    function resolveColossusVisualState(boss) {
      var debugOverride = getColossusStateDebugOverride();
      if (debugOverride) return debugOverride;

      if (!boss) return 'master';
      var hpPct = boss.hp > 0 && boss.maxHp > 0 ? boss.hp / boss.maxHp : 1;
      if (hpPct > 0.66) return 'master';
      if (hpPct > 0.33) return 'damaged';
      return 'core_exposed';
    }

    function drawOrbitalSiegeColossusVisual(ctx, boss, x, y, w, h, opts) {
      if (!ctx) return false;
      if (!isColossusVisualEnabled()) return false;

      opts = opts || {};
      var state = opts.state || resolveColossusVisualState(boss);
      var frame = getColossusStateFrame(state);
      var drawX = (typeof opts.x === 'number') ? opts.x : (x || (boss ? boss.x : 0));
      var drawY = (typeof opts.y === 'number') ? opts.y : (y || (boss ? boss.y : 0));
      var drawW = (typeof opts.w === 'number') ? opts.w : (w || (boss ? boss.w : 240));
      var drawH = (typeof opts.h === 'number') ? opts.h : (h || (boss ? boss.h : 240));
      var alpha = (typeof opts.alpha === 'number') ? opts.alpha : 1;
      var tint = opts.tint || undefined;
      var rotation = (typeof opts.rotation === 'number') ? opts.rotation : 0;
      var flipX = opts.flipX === true;
      var scale = (typeof opts.scale === 'number') ? opts.scale : 1;

      if (isColossusSpriteReady()) {
        var computedScale = scale;
        if (!opts.scale) {
          var sprite = window.SpriteSystem.getSprite(_COLOSSUS_SPRITE_ID);
          if (sprite) {
            var metaScale = (typeof getOrbitalSiegeColossusMeta === 'function' && getOrbitalSiegeColossusMeta().scaleHint) ? getOrbitalSiegeColossusMeta().scaleHint : 0.75;
            computedScale = Math.min(drawW / sprite.frameWidth, drawH / sprite.frameHeight) * metaScale;
          }
          if (!isFinite(computedScale) || computedScale <= 0) computedScale = 1;
        }
        window.drawSpriteFrame(ctx, _COLOSSUS_SPRITE_ID, drawX + drawW / 2, drawY + drawH / 2, {
          frame: frame,
          scale: computedScale,
          anchorX: 0.5,
          anchorY: 0.5,
          alpha: alpha,
          tint: tint,
          rotation: rotation,
          flipX: flipX,
          fallback: function () {
            drawColossusFallback(ctx, drawX, drawY, drawW, drawH, state);
          }
        });
        return true;
      }

      drawColossusFallback(ctx, drawX, drawY, drawW, drawH, state);
      return false;
    }

    function drawColossusFallback(ctx, x, y, w, h, state) {
      if (!ctx) return;
      var stateColors = { master: '#44ccff', damaged: '#3399dd', core_exposed: '#ff6622', weapon_open: '#ffcc00' };
      var col = stateColors[state] || '#44ccff';
      var cx = x + w / 2;
      var cy = y + h / 2;
      var outerR = Math.min(w, h) * 0.48;
      var innerR = outerR * 0.55;

      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = col;
      ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
      ctx.globalAlpha = 0.40;
      ctx.strokeStyle = col;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
      ctx.fill();
      if (state === 'core_exposed') {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#ff4422';
        ctx.beginPath();
        ctx.arc(cx, cy, innerR * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (state === 'weapon_open') {
        ctx.globalAlpha = 0.30;
        ctx.fillStyle = '#ffcc00';
        for (var wi = 0; wi < 4; wi++) {
          var wAngle = (wi / 4) * Math.PI * 2;
          var wx = cx + Math.cos(wAngle) * outerR * 0.85;
          var wy = cy + Math.sin(wAngle) * outerR * 0.85;
          ctx.fillRect(wx - 4, wy - 4, 8, 8);
        }
      }
      ctx.restore();
    }

    function drawColossusDebugOverlay(ctx, boss, state, x, y, w, h) {
      if (!ctx) return;
      var debugCfg = (typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.debug) ? GALAXY_CONFIG.debug : null;
      if (!debugCfg || !(debugCfg.showBossPattern || debugCfg.showHardcoreInfo)) return;

      var drawX = (typeof x === 'number') ? x : (boss ? boss.x : 0);
      var drawY = (typeof y === 'number') ? y : (boss ? boss.y : 0);
      var drawW = (typeof w === 'number') ? w : (boss ? boss.w : 240);
      var st = state || resolveColossusVisualState(boss);
      var frame = getColossusStateFrame(st);

      ctx.save();
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.font = '4px "Press Start 2P"';
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = '#ff0';
      ctx.fillText('COLOSSUS ' + st, drawX + drawW / 2, drawY - 14);
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = '#44ccff';
      ctx.fillText('f:' + frame + ' orbital_siege', drawX + drawW / 2, drawY - 8);
      var enabled = isColossusVisualEnabled();
      var ready = isColossusSpriteReady();
      ctx.fillStyle = enabled ? (ready ? '#0f0' : '#f80') : '#f00';
      ctx.fillText(enabled ? (ready ? 'RDY' : 'LOADING') : 'OFF', drawX + drawW / 2, drawY - 4);
      ctx.restore();
    }

    function getEnemyFormationPulse(e, time) {
      var row = e.row || 0;
      var wave = Math.sin(time * 0.0018 + row * 0.45);
      return {
        scale: 1 + wave * 0.015,
        y: wave * 1.2
      };
    }

    function getEnemyHitVisual(e, time) {
      if (e.flashTimer <= 0) return { scale: 1, shakeX: 0, shakeY: 0, glow: 0 };
      var t = e.flashTimer / 150;
      var hit = t * t * t;
      return {
        scale: 1 + hit * 0.07,
        shakeX: Math.sin(time * 0.09 + e.x * 0.1) * hit * 2.2,
        shakeY: Math.cos(time * 0.12 + e.y * 0.1) * hit * 0.8,
        glow: hit * 0.38
      };
    }

    function getEnemyEntranceVisual(e, spawnT) {
      if (spawnT <= 0) return { scale: 1, entryY: 0 };
      var progress = 1 - spawnT;
      var ease = 1 - (1 - progress) * (1 - progress);
      return {
        scale: 0.82 + 0.18 * ease,
        entryY: -7 * (1 - ease)
      };
    }

    function getEnemyVisualOffset(e, time) {
      const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
      const row = e.row || 0;
      const phase = e.x * 0.13 + e.y * 0.07 + row * 2.1;
      var ampX = 1.8;
      var ampY = 2.4;
      var speedX = 0.0026;
      var speedY = 0.003;
      var tensionX = 0;
      var tensionY = 0;

      if (e.type === 'alien2') {
        ampX = 0.45;
        ampY = 0.65;
        speedX = 0.0012;
        speedY = 0.0014;
      } else if (e.type === 'alien3' || data.kamikaze) {
        ampX = 1.35;
        ampY = 1.15;
        speedX = 0.0038;
        speedY = 0.003;
        if (e._hcDiverTargetX || e._hcDiverTargetY) {
          tensionX = ((e._hcDiverTargetX || e.x) - (e.x + (e.w || 24) / 2)) * 0.015;
          tensionY = ((e._hcDiverTargetY || e.y) - (e.y + (e.h || 24) / 2)) * 0.015;
        } else if (e.diving) {
          tensionY = 1.1;
        }
      } else if (e.type === 'alien4' || (data.hp >= 2 && data.speed < 1.0)) {
        ampX = 0.55;
        ampY = 0.9;
        speedX = 0.0014;
        speedY = 0.0017;
      } else if (e.type === 'alien5') {
        ampX = 1;
        ampY = 1.8;
        speedX = 0.0019;
        speedY = 0.0023;
      } else if (e.type === 'alien6' || data.splits) {
        ampX = 1.9;
        ampY = 1.35;
        speedX = 0.0034;
        speedY = 0.0022;
      } else if (data.speed >= 1.5) {
        ampX = 2.2;
        ampY = 1.8;
        speedX = 0.0035;
        speedY = 0.0028;
      }

      ampY += row * 0.15;
      var tacticalX = (typeof e._tacticalVisualOffsetX === 'number') ? e._tacticalVisualOffsetX : 0;
      var tacticalY = (typeof e._tacticalVisualOffsetY === 'number') ? e._tacticalVisualOffsetY : 0;
      return {
        ox: Math.sin(time * speedX + phase) * ampX + tensionX + tacticalX,
        oy: Math.cos(time * speedY + phase) * ampY + tensionY + tacticalY
      };
    }

    var HCART_ENEMY_VISUALS = {
      alien1: { sprite: 'fleet_scout', scale: 1.36, y: 0, animation: 'idle' },
      alien2: { sprite: 'fleet_scout', scale: 1.42, y: 0, animation: 'idle' },
      alien3: { sprite: 'fleet_suppressor', scale: 0.96, y: -1, animation: 'idle' },
      alien4: { sprite: 'fleet_interceptor', scale: 1.04, y: 0, animation: 'idle' },
      alien5: { sprite: 'fleet_interceptor', scale: 1.08, y: 0, animation: 'idle' },
      alien6: { sprite: 'fleet_suppressor', scale: 0.92, y: -1, animation: 'idle' },
      alien_mini: { sprite: 'fleet_scout', scale: 0.92, y: 0, animation: 'idle' }
    };

    // SPRITE LAB PHASE A: Scout Alien faction override mapping
    // Kill switch: GALAXY_CONFIG.spriteLab.factionScout === false disables faction override
    var _spriteLabScoutEnabled = !(typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.spriteLab && GALAXY_CONFIG.spriteLab.factionScout === false);
    var _SPRITE_LAB_SCOUT_MAP = {
      alien1: { sprite: 'faction_scout', scale: 0.50, y: 0, animation: 'idle', frame: 0 },
      alien2: { sprite: 'faction_scout', scale: 0.50, y: 0, animation: 'idle', frame: 2 },
      alien4: { sprite: 'faction_scout', scale: 0.48, y: 0, animation: 'idle', frame: 1 },
      alien5: { sprite: 'faction_scout', scale: 0.46, y: 0, animation: 'idle', frame: 3 },
      alien_mini: { sprite: 'faction_scout', scale: 0.42, y: 0, animation: 'idle', frame: 3 }
    };

    // SPRITE LAB PHASE B: Suppressor faction override
    // Kill switch: GALAXY_CONFIG.spriteLab.factionSuppressor === false
    // alien3 is the only suppressor-type enemy; maps to mk1_master (frame 0)
    var _spriteLabSuppressorEnabled = !(typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.spriteLab && GALAXY_CONFIG.spriteLab.factionSuppressor === false);
    var _SPRITE_LAB_SUPPRESSOR_MAP = {
      alien3: { sprite: 'faction_suppressor', scale: 0.50, y: 0, animation: 'idle', frame: 0 }
    };

    // SPRITE LAB PHASE B: Splitter faction override
    // Kill switch: GALAXY_CONFIG.spriteLab.factionSplitter === false
    // alien6 was previously rendered as fleet_suppressor (red/orange) — now correctly Splitter (magenta)
    var _spriteLabSplitterEnabled = !(typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.spriteLab && GALAXY_CONFIG.spriteLab.factionSplitter === false);
    var _SPRITE_LAB_SPLITTER_MAP = {
      alien6: { sprite: 'faction_splitter', scale: 0.50, y: 0, animation: 'idle', frame: 0 }
    };

    // SPRITE LAB PHASE B: Imperial faction override (reserved — no enemy types yet)
    // Kill switch: GALAXY_CONFIG.spriteLab.factionImperial === false
    // Imperial faction sprites are registered and ready. They will activate once
    // Imperial enemy spawn types are introduced in a future gameplay pass.
    // Currently: no mapping — Imperial enemies do not exist in the spawn pool.
    var _spriteLabImperialEnabled = !(typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.spriteLab && GALAXY_CONFIG.spriteLab.factionImperial === false);
    var _SPRITE_LAB_IMPERIAL_MAP = {};

    function getHCArtEnemyVisual(e) {
      if (!e) return null;
      // SPRITE LAB PHASE A+B: Faction override checks (priority: Scout → Suppressor → Splitter → Imperial)
      // Each faction override checks its kill switch AND sprite readiness before returning.
      var factionChecks = [
        { enabled: _spriteLabScoutEnabled,      map: _SPRITE_LAB_SCOUT_MAP },
        { enabled: _spriteLabSuppressorEnabled,  map: _SPRITE_LAB_SUPPRESSOR_MAP },
        { enabled: _spriteLabSplitterEnabled,    map: _SPRITE_LAB_SPLITTER_MAP },
        { enabled: _spriteLabImperialEnabled,    map: _SPRITE_LAB_IMPERIAL_MAP }
      ];
      for (var fi = 0; fi < factionChecks.length; fi++) {
        var fc = factionChecks[fi];
        if (fc.enabled && fc.map[e.type]) {
          var spOverride = fc.map[e.type];
          if (window.SpriteSystem && window.SpriteSystem.isSpriteReady(spOverride.sprite)) {
            return spOverride;
          }
        }
      }
      // Fall through to existing HC Art visuals (fleet_* sprites)
      if (!HCART_ENEMY_VISUALS[e.type]) return null;
      var profile = HCART_ENEMY_VISUALS[e.type];
      if (!window.SpriteSystem || !window.SpriteSystem.isSpriteReady(profile.sprite)) return null;
      return profile;
    }

    function getEnemySpriteId(e) {
      if (!e) return null;
      if (e.type === 'alien1' || e.type === 'alien2' || e.type === 'alien3' ||
          e.type === 'alien4' || e.type === 'alien5' || e.type === 'alien6' ||
          e.type === 'alien_mini') {
        return e.type;
      }
      return null;
    }

    function getEnemyAnimatedSpriteId(e) {
      var hcArtVisual = getHCArtEnemyVisual(e);
      if (hcArtVisual) return hcArtVisual.sprite;
      var spriteId = getEnemySpriteId(e);
      return spriteId ? (spriteId + '_strip') : null;
    }

    function getEnemySpriteAnimationName(e, spriteId) {
      var hcArtVisual = getHCArtEnemyVisual(e);
      if (!hcArtVisual || hcArtVisual.sprite !== spriteId) return 'idle';
      if (spriteId === 'fleet_interceptor') {
        if (e && (e._chaserTelegraphActive || e.shmupShotsRemaining > 0)) return 'attack';
        if (e && (e.vx || 0) < -0.2) return 'moveLeft';
        if (e && (e.vx || 0) > 0.2) return 'moveRight';
      }
      if (spriteId === 'fleet_suppressor' && e && (e._suppressorTelegraphActive || e.shmupShotsRemaining > 0)) {
        return 'attack';
      }
      return hcArtVisual.animation || 'idle';
    }

    function getEnemyAnimationTimeOffset(e) {
      if (!e) return 0;
      var row = e.row || 0;
      var px = Math.round(Number(e.x) || 0);
      var py = Math.round(Number(e.y) || 0);
      return (px * 37 + py * 23 + row * 131) % 700;
    }

    function getEnemySpriteFrame(spriteId, fallbackFrame) {
      if (!window.SpriteSystem || !spriteId) return fallbackFrame;

      var sprite = window.SpriteSystem.getSprite(spriteId);
      if (!sprite || !sprite.image) return fallbackFrame;

      var columns = Math.max(1, Math.floor(sprite.image.width / sprite.frameWidth));
      var rows = Math.max(1, Math.floor(sprite.image.height / sprite.frameHeight));
      var frameCount = Math.max(1, columns * rows);
      return frameCount > 1 ? fallbackFrame % frameCount : 0;
    }

    function getEnemyAnimatedSpriteFrame(e, spriteId, fallbackFrame) {
      if (!window.SpriteSystem || !spriteId) return fallbackFrame;
      if (typeof window.SpriteSystem.getAnimationFrame === 'function') {
        return window.SpriteSystem.getAnimationFrame(spriteId, getEnemySpriteAnimationName(e, spriteId), globalTime, {
          timeOffset: getEnemyAnimationTimeOffset(e)
        });
      }
      return getEnemySpriteFrame(spriteId, fallbackFrame);
    }

    function isEnemyAnimatedSpriteReady(e) {
      var animatedSpriteId = getEnemyAnimatedSpriteId(e);
      return !!(window.SpriteSystem && animatedSpriteId && window.SpriteSystem.isSpriteReady(animatedSpriteId));
    }

    var _ENEMY_READABILITY_MULT = {
      alien1: 1.30,
      alien2: 1.45,
      alien3: 1.45,
      alien4: 1.55,
      alien5: 1.55,
      alien6: 1.45
    };
    // HC-RD-08: small-screen readability boost
    if (_smallScreenBoost > 1.0) {
      for (var _ek in _ENEMY_READABILITY_MULT) {
        if (_ENEMY_READABILITY_MULT.hasOwnProperty(_ek)) _ENEMY_READABILITY_MULT[_ek] *= _smallScreenBoost;
      }
    }

    function getEnemySpriteReadabilityScale(e, spriteId) {
      var hcArtVisual = getHCArtEnemyVisual(e);
      if (hcArtVisual && hcArtVisual.sprite === spriteId) {
        return hcArtVisual.scale * (_smallScreenBoost > 1.0 ? 1.05 : 1);
      }
      if (!spriteId || spriteId.indexOf('_strip') === -1) return 1;
      if (_ENEMY_READABILITY_MULT.hasOwnProperty(e.type)) return _ENEMY_READABILITY_MULT[e.type];
      return 1.18;
    }

    function getEnemySpriteVisualBounds(spriteId) {
      var bounds = {
        alien1: { x: 8,  y: 6, width: 17, height: 18 },
        alien2: { x: 12, y: 1, width: 8,  height: 26 },
        alien3: { x: 6,  y: 4, width: 21, height: 25 },
        alien4: { x: 6,  y: 7, width: 20, height: 17 },
        alien5: { x: 10, y: 0, width: 12, height: 27 },
        alien6: { x: 8,  y: 4, width: 17, height: 24 },
        fleet_scout: { x: 2, y: 2, width: 12, height: 12 },
        fleet_interceptor: { x: 3, y: 3, width: 18, height: 17 },
        fleet_suppressor: { x: 4, y: 3, width: 20, height: 24 },
        alien_mini: { x: 2, y: 2, width: 10, height: 10 },
        alien_mini_strip: { x: 2, y: 2, width: 10, height: 10 },
        faction_scout: { x: 16, y: 16, width: 96, height: 96 },
        faction_suppressor: { x: 16, y: 16, width: 96, height: 96 },
        faction_splitter: { x: 16, y: 16, width: 96, height: 96 },
        faction_imperial: { x: 16, y: 16, width: 96, height: 96 }
      };
      return bounds[spriteId] || null;
    }

    function drawEnemySpriteOrLegacy(ctx, e, spriteKey, color, size, options) {
      options = options || {};

      var staticSpriteId = getEnemySpriteId(e);
      var animatedSpriteId = getEnemyAnimatedSpriteId(e);
      var spriteId = null;
      if (window.SpriteSystem && animatedSpriteId && window.SpriteSystem.isSpriteReady(animatedSpriteId)) {
        spriteId = animatedSpriteId;
      } else if (window.SpriteSystem && staticSpriteId && window.SpriteSystem.isSpriteReady(staticSpriteId)) {
        spriteId = staticSpriteId;
      }

      if (!spriteId || !window.SpriteSystem) {
        var legacyX = (typeof options.x === 'number') ? options.x : e.x;
        var legacyY = (typeof options.y === 'number') ? options.y : e.y;
        drawSprite(ctx, SPRITES[spriteKey], legacyX, legacyY, color, size);
        return;
      }

      var sprite = window.SpriteSystem.getSprite(spriteId);
      var hcArtVisual = getHCArtEnemyVisual(e);
      var targetW = hcArtVisual ? sprite.frameWidth : (e.w || (sprite.frameWidth * size));
      var targetH = hcArtVisual ? sprite.frameHeight : (e.h || (sprite.frameHeight * size));
      var visualBounds = getEnemySpriteVisualBounds(spriteId);
      var visualW = visualBounds ? visualBounds.width : sprite.frameWidth;
      var visualH = visualBounds ? visualBounds.height : sprite.frameHeight;
      var scale = Math.min(targetW / visualW, targetH / visualH);
      if (!isFinite(scale) || scale <= 0) scale = 1;
      scale *= getEnemySpriteReadabilityScale(e, spriteId);

      var drawX = (typeof options.x === 'number') ? options.x : e.x;
      var drawY = (typeof options.y === 'number') ? options.y : e.y;
      var cx = drawX + (e.w || targetW) / 2;
      var cy = drawY + (e.h || targetH) / 2 + (hcArtVisual ? (hcArtVisual.y || 0) : 0);
      if (visualBounds) {
        cx -= (visualBounds.x + visualBounds.width / 2 - sprite.frameWidth / 2) * scale;
        cy -= (visualBounds.y + visualBounds.height / 2 - sprite.frameHeight / 2) * scale;
      }
      var frame = (spriteId === animatedSpriteId)
        ? getEnemyAnimatedSpriteFrame(e, spriteId, animationFrame)
        : getEnemySpriteFrame(spriteId, 0);

      window.drawSpriteFrame(ctx, spriteId, cx, cy, {
        frame: frame,
        scale: scale,
        rotation: options.rotation || 0,
        alpha: options.alpha,
        tint: options.tint,
        fallback: function () {
          drawSprite(ctx, SPRITES[spriteKey], drawX, drawY, color, size);
        }
      });
    }

    // ================================================================
    // HC-RD-01: PRIORITY_ENEMY — enemies (sprites, telegraphs, hit flashes)
    // ================================================================
    // HC-WC-05: draw formation silhouette lines during INTRO
    if (typeof window.drawFormationSilhouette === 'function') {
      window.drawFormationSilhouette(ctx);
    }
    enemies.forEach(e => {
      if (e.alive) {
        var spawnT = 0;
        if (e.spawnFlashTimer > 0) {
          spawnT = Math.max(0, Math.min(1, e.spawnFlashTimer / ENEMY_SPAWN_FLASH_DURATION));
        }
        var _voff = getEnemyVisualOffset(e, globalTime);
        var _ent = spawnT > 0 ? getEnemyEntranceVisual(e, spawnT) : null;
        ctx.save();
        ctx.translate(_voff.ox, _voff.oy);
        if (_ent) {
          var _ecx = e.x + e.w / 2;
          var _ecy = e.y + e.h / 2;
          ctx.translate(_ecx, _ecy);
          ctx.scale(_ent.scale, _ent.scale);
          ctx.translate(-_ecx, -_ecy);
          ctx.translate(0, _ent.entryY);
        }
        var _pulse = getEnemyFormationPulse(e, globalTime);
        var _pcx = e.x + e.w / 2;
        var _pcy = e.y + e.h / 2;
        ctx.translate(_pcx, _pcy);
        ctx.scale(_pulse.scale, _pulse.scale);
        ctx.translate(-_pcx, -_pcy);
        ctx.translate(0, _pulse.y);
        var _hit = getEnemyHitVisual(e, globalTime);
        if (_hit.scale !== 1 || _hit.shakeX !== 0) {
          var _hcx = e.x + e.w / 2;
          var _hcy = e.y + e.h / 2;
          ctx.translate(_hcx + _hit.shakeX, _hcy + _hit.shakeY);
          ctx.scale(_hit.scale, _hit.scale);
          ctx.translate(-_hcx, -_hcy);
        }
        const spriteKey = e.type + (animationFrame === 0 ? '_a' : '_b');
        const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
        
        let color = currentPalette[data.color] || currentPalette[1];
        
        if (e.diving) color = '#f00';

        // HC-VS-05: Faction color override for visual cohesion
        var factionColor = typeof getFactionColor === 'function' ? getFactionColor(e.type, 'primary') : null;
        if (factionColor && !e.diving) color = factionColor;
        
    const baseSize = (e.type === 'alien_mini') ? 2 : 3;
    const readabilityScale = _ENEMY_READABILITY_MULT[e.type] || 1;
    const size = baseSize * readabilityScale;

    ctx.save();
    // SPRITE LAB: ghost placeholder — save/restore to prevent alpha bleed
    ctx.save();
    if (!isEnemyAnimatedSpriteReady(e)) {
      ctx.globalAlpha = 0.015;
      ctx.fillStyle = color;
      ctx.fillRect(e.x - 2, e.y - 2, e.w + 4, e.h + 4);
      ctx.globalAlpha = 0.025;
      ctx.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2);
    }
    ctx.restore();

    // HC-VS-05: Faction silhouette for visual identity
    if (typeof drawFactionSilhouette === 'function') {
      drawFactionSilhouette(ctx, e, 0.14);
    }

    if (e.spawnFlashTimer > 0) {
      ctx.globalAlpha = 1 - spawnT * 0.42;
    } else {
      ctx.globalAlpha = 1;
    }

    // HC-125H: encounter stagger visual (render-only, no gameplay effect)
    if (e._encounterDelayTimer > 0) {
      var _stgInitial = Math.max(220, e._encounterDelayInitial || e._encounterDelayTimer || 220);
      var _stgPending = Math.max(0, Math.min(1, e._encounterDelayTimer / _stgInitial));
      var _stgScale = 0.90 + (1 - _stgPending) * 0.10;
      var _stgCx = e.x + e.w / 2;
      var _stgCy = e.y + e.h / 2;
      ctx.globalAlpha *= 0.50 + (1 - _stgPending) * 0.50;
      ctx.translate(_stgCx, _stgCy - _stgPending * 8);
      ctx.scale(_stgScale, _stgScale);
      ctx.translate(-_stgCx, -_stgCy);
    }

    drawEnemySpriteOrLegacy(ctx, e, spriteKey, color, size);
    ctx.restore();

    if (e.spawnFlashTimer > 0) {
      const pulse = 0.5 + 0.5 * Math.sin((1 - spawnT) * Math.PI * 4);
      ctx.save();
      ctx.globalAlpha = 0.10 * spawnT + 0.08 * pulse * spawnT;
      ctx.fillStyle = color;
      ctx.fillRect(e.x - 6, e.y - 6, e.w + 12, e.h + 12);
      ctx.globalAlpha = 0.20 * spawnT;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(e.x - 3), Math.round(e.y - 3), e.w + 6, e.h + 6);
      ctx.restore();
    }

    // HC-129: threat telegraph — subtle role indicator (render-only)
    // HC-VS-05: uses faction colors for visual cohesion
    if (window.ENCOUNTER_THREAT_TELEGRAPH === true && e.alive) {
      var _threatColor = null;
      // Faction-based color (preferred) or legacy per-type fallback
      if (typeof getFactionColor === 'function') {
        _threatColor = getFactionColor(e.type, 'telegraph');
      }
      if (!_threatColor) {
        if (e.type === 'alien1')        { _threatColor = '#8df'; }
        else if (e.type === 'alien2')   { _threatColor = '#4ff'; }
        else if (e.type === 'alien3')   { _threatColor = '#f55'; }
        else if (e.type === 'alien4')   { _threatColor = '#bf4'; }
        else if (e.type === 'alien5')   { _threatColor = '#f62'; }
        else if (e.type === 'alien6')   { _threatColor = '#c8f'; }
        else if (e.type === 'alien_mini') { _threatColor = '#f96'; }
      }
      if (_threatColor) {
        var _tcs0 = _getTelegraphOutlineStyle();
        var _tcx = e.x + e.w / 2;
        var _tcy = e.y + e.h / 2;
        var _tpulse = 0.5 + 0.5 * Math.sin(globalTime * 0.012 + e.x * 0.05);
        var _tdR = 3.5;
        ctx.save();
        ctx.globalAlpha = _tcs0.alpha;
        ctx.strokeStyle = _tcs0.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(_tcx, _tcy - e.h * 0.5 - 4, _tdR + 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.12 + _tpulse * 0.06;
        ctx.fillStyle = _threatColor;
        ctx.beginPath();
        ctx.arc(_tcx, _tcy - e.h * 0.5 - 4, _tdR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // HC-VS-05: Faction identity marker — subtle dot + ring above enemy
    if (typeof drawFactionMarker === 'function') {
      drawFactionMarker(ctx, e);
    }

        // HC-RD-01: hit flash alpha reduced so flashes don't mask bullets
        if (e.flashTimer > 0) {
          var _ft = e.flashTimer / 150;
          var _hi = _ft * _ft * _ft;
          var flicker = 0.38 + 0.22 * Math.sin(globalTime * 0.06 + e.x * 0.01 + e.flashTimer * 0.005);
          var hitColor = currentPalette[e.color] || currentPalette[1] || '#ff5050';
          var _hitWhiteAlpha = (typeof getFXSuppressionConfig === 'function')
            ? getFXSuppressionConfig().hitFlashWhiteAlpha || 0.30
            : 0.30;
          var _hitBodyAlpha = (typeof getFXSuppressionConfig === 'function')
            ? getFXSuppressionConfig().hitFlashBodyAlpha || 0.42
            : 0.42;
          ctx.save();
          if (_hi > 0.25) {
            ctx.globalAlpha = Math.min(_hitWhiteAlpha * 0.82, _hi * 0.48);
            drawEnemySpriteOrLegacy(ctx, e, spriteKey, '#ffffff', size, { tint: '#ffffff' });
          }
          ctx.globalAlpha = Math.min(_hitBodyAlpha * 0.82, flicker * (0.28 + 0.35 * _hi));
          drawEnemySpriteOrLegacy(ctx, e, spriteKey, hitColor, size, { tint: hitColor });
          ctx.globalAlpha = Math.min(0.55, _hi + 0.15);
          ctx.fillStyle = '#fff';
          var _ifx = Math.round(e.x + e.w / 2);
          var _ify = Math.round(e.y + e.h / 2);
          ctx.fillRect(_ifx - 5, _ify - 1, 10, 2);
          ctx.fillRect(_ifx - 1, _ify - 5, 2, 10);
  ctx.restore();
}

        // SHMUP TELEGRAPH: carga visual antes de disparo externo
        if (e.isExternalShmup && e.shmupShotsRemaining > 0) {
          const telegraphWindow = Math.min(400, (e.shmupShootCooldown || 3000) * 0.35);
          if (e.shmupShootTimer > 0 && e.shmupShootTimer < telegraphWindow) {
            const intens = 1 - (e.shmupShootTimer / telegraphWindow);
            const pattern = e.shmupShotPattern || 'basic';
            const chargeMap = {
              basic:  '#f90',
              aimed:  '#f80',
              sweep:  '#f90',
              heavy:  '#f53',
              spread: '#fd8'
            };
            const chargeColor = chargeMap[pattern] || '#f90';
            const isHeavy = (pattern === 'heavy');
            const pulse = Math.sin(globalTime * 0.025 + e.x * 0.01) * 0.35 * intens;
            const cx = e.x + e.w / 2;
            const baseY = e.y + e.h;

            ctx.save();

            ctx.globalAlpha = 0.02 + intens * 0.06 + pulse * 0.02;
            ctx.fillStyle = chargeColor;
            ctx.fillRect(e.x - 3 - intens, e.y - 3 - intens,
                         e.w + 6 + intens * 2, e.h + 6 + intens * 2);

            ctx.globalAlpha = 0.05 + intens * 0.16 + pulse * 0.04;
            ctx.fillStyle = chargeColor;
            ctx.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2);

            ctx.globalAlpha = 0.08 + intens * 0.28;
            ctx.fillStyle = '#fff';
            const lineW = isHeavy ? 3 : 2;
            const lineH = 2 + intens * 4;
            ctx.fillRect(cx - lineW / 2, baseY - 3 - intens * 2, lineW, lineH);

            ctx.restore();
          }
        }

        // Barra de HP para tanques (hp > 1)
        if (e.maxHp > 1 && e.hp < e.maxHp) {
          const barW = e.w * 0.8;
          const barH = 3;
          const barX = e.x + (e.w - barW) / 2;
          const barY = e.y - 6;
          
          ctx.fillStyle = '#500';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = '#f00';
          ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
        }

        // HC-46: SNIPER TELEGRAPH — thin cyan line toward player
        if (e._sniperTelegraphActive && typeof player !== 'undefined' && player) {
          var _tcs = _getTelegraphOutlineStyle();
          var telElapsed = globalTime - (e._sniperTelegraphFiredAt || globalTime);
          var telProgress = Math.min(1, telElapsed / 280);
          var telAlpha = Math.max(0.12, 0.10 + 0.12 * Math.sin(telProgress * Math.PI) * (1 - telProgress));
          var ex = e.x + (e.w || 24) / 2;
          var ey = e.y + (e.h || 24);
          var px = player.x + player.width / 2;
          var py = player.y + player.height / 2;
          var angle = Math.atan2(py - ey, px - ex);
          var lineLen = 42 + telProgress * 28;
          var endX = ex + Math.cos(angle) * lineLen;
          var endY = ey + Math.sin(angle) * lineLen;

          ctx.save();

          // HC-RD-03: dark outline behind sniper line for contrast
          ctx.globalAlpha = _tcs.alpha;
          ctx.strokeStyle = _tcs.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ctx.globalAlpha = telAlpha;
          ctx.strokeStyle = '#4ff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          ctx.globalAlpha = telAlpha * 0.6;
          ctx.strokeStyle = '#aff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(ex + 1, ey);
          ctx.lineTo(endX + 1, endY);
          ctx.stroke();
          ctx.restore();
        }

        // HC-47: CHASER TELEGRAPH — orange side glow/flare before side shots
        if (e._chaserTelegraphActive) {
          var _tcs2 = _getTelegraphOutlineStyle();
          var chTelElapsed = globalTime - (e._chaserTelegraphFiredAt || globalTime);
          var chTelProgress = Math.min(1, chTelElapsed / 180);
          var chTelAlpha = Math.max(0.12, 0.12 + 0.14 * Math.sin(chTelProgress * Math.PI) * (1 - chTelProgress));
          var ccx = e.x + (e.w || 24) / 2;
          var ccy = e.y + (e.h || 24);

          ctx.save();
          // HC-RD-03: outline first
          ctx.globalAlpha = _tcs2.alpha;
          ctx.strokeStyle = _tcs2.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(ccx - 14, ccy, 5 + chTelProgress * 4, 3, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(ccx + 14, ccy, 5 + chTelProgress * 4, 3, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.globalAlpha = chTelAlpha;
          ctx.fillStyle = '#f62';
          ctx.beginPath();
          ctx.ellipse(ccx - 14, ccy, 5 + chTelProgress * 4, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(ccx + 14, ccy, 5 + chTelProgress * 4, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f84';
          ctx.lineWidth = 1;
          var diagLen = 6 + chTelProgress * 8;
          ctx.beginPath();
          ctx.moveTo(ccx - 8, ccy - 2);
          ctx.lineTo(ccx - 8 - diagLen, ccy - 2 - diagLen * 0.7);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(ccx + 8, ccy - 2);
          ctx.lineTo(ccx + 8 + diagLen, ccy - 2 - diagLen * 0.7);
          ctx.stroke();
          ctx.restore();
        }

        // HC-48: SUPPRESSOR TELEGRAPH — translucent lime cone/fan
        if (e._suppressorTelegraphActive) {
          var _tcs3 = _getTelegraphOutlineStyle();
          var supTelElapsed = globalTime - (e._suppressorTelegraphFiredAt || globalTime);
          var supTelProgress = Math.min(1, supTelElapsed / 180);
          var supTelAlpha = Math.max(0.12, 0.08 + 0.10 * Math.sin(supTelProgress * Math.PI) * (1 - supTelProgress));
          var scx = e.x + (e.w || 24) / 2;
          var scy = e.y + (e.h || 24);
          var fanAngle = 0.25; // slightly wider than bullet spread (0.22)
          var fanLen = 28 + supTelProgress * 22;
          var fanTop = -4; // start slightly above muzzle

          ctx.save();
          // HC-RD-03: dark outline first
          ctx.globalAlpha = _tcs3.alpha;
          ctx.strokeStyle = _tcs3.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(scx, scy + fanTop);
          ctx.lineTo(scx - Math.sin(fanAngle) * fanLen, scy + fanTop + Math.cos(fanAngle) * fanLen);
          ctx.lineTo(scx + Math.sin(fanAngle) * fanLen, scy + fanTop + Math.cos(fanAngle) * fanLen);
          ctx.closePath();
          ctx.stroke();

          ctx.globalAlpha = supTelAlpha;
          ctx.fillStyle = '#bf4';
          ctx.beginPath();
          ctx.moveTo(scx, scy + fanTop);
          ctx.lineTo(scx - Math.sin(fanAngle) * fanLen, scy + fanTop + Math.cos(fanAngle) * fanLen);
          ctx.lineTo(scx + Math.sin(fanAngle) * fanLen, scy + fanTop + Math.cos(fanAngle) * fanLen);
          ctx.closePath();
          ctx.fill();
          // thin outline
          ctx.globalAlpha = supTelAlpha * 1.3;
          ctx.strokeStyle = '#cf5';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        }

        // HC-49: DIVER TELEGRAPH — afterimage, red/orange glow, direction to target
        if (e._hcDiverState === 'telegraph') {
          var _tcs4 = _getTelegraphOutlineStyle();
          var dTelProgress = Math.min(1, e._hcDiverTimer / 380);
          var dTelAlpha = Math.max(0.12, 0.10 + 0.12 * Math.sin(dTelProgress * Math.PI) * (1 - dTelProgress));
          var dcx = e.x + (e.w || 24) / 2;
          var dcy = e.y + (e.h || 24) / 2;

          ctx.save();
          // afterimage (ghost copy offset slightly back)
          ctx.globalAlpha = dTelAlpha * 0.40;
          var aiOffX = (dcx - (e._hcDiverTargetX || dcx)) * 0.08;
          var aiOffY = (dcy - (e._hcDiverTargetY || dcy)) * 0.08;
          drawEnemySpriteOrLegacy(ctx, e, spriteKey, '#f52', size, {
            x: e.x - aiOffX,
            y: e.y - aiOffY,
            tint: '#f52'
          });

          // pulsating red/orange glow — HC-RD-03: outline first
          ctx.globalAlpha = _tcs4.alpha;
          ctx.strokeStyle = _tcs4.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(dcx, dcy, 12 + dTelProgress * 8 + 1, 0, Math.PI * 2);
          ctx.stroke();

          ctx.globalAlpha = dTelAlpha;
          ctx.fillStyle = '#f42';
          ctx.beginPath();
          ctx.arc(dcx, dcy, 12 + dTelProgress * 8, 0, Math.PI * 2);
          ctx.fill();

          // direction line toward target — HC-RD-03: outline first
          if (typeof e._hcDiverTargetX === 'number' && typeof e._hcDiverTargetY === 'number') {
            var dLineLen = 16 + dTelProgress * 20;
            var dAngle = Math.atan2(e._hcDiverTargetY - dcy, e._hcDiverTargetX - dcx);
            var dEndX = dcx + Math.cos(dAngle) * dLineLen;
            var dEndY = dcy + Math.sin(dAngle) * dLineLen;
            ctx.globalAlpha = _tcs4.alpha;
            ctx.strokeStyle = _tcs4.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(dcx, dcy);
            ctx.lineTo(dEndX, dEndY);
            ctx.stroke();

            ctx.globalAlpha = dTelAlpha * 0.8;
            ctx.strokeStyle = '#f52';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(dcx, dcy);
            ctx.lineTo(dEndX, dEndY);
            ctx.stroke();
          }
          ctx.restore();
        }

        // HC-49: DIVER DIVE TRAIL — fading position trail during dive
        if (e.diving && Array.isArray(e._hcDiverTrail) && e._hcDiverTrail.length > 0) {
          ctx.save();
          for (var ti = 0; ti < e._hcDiverTrail.length; ti++) {
            var tp = e._hcDiverTrail[ti];
            var tAlpha = (ti + 1) / e._hcDiverTrail.length * 0.14;
            ctx.globalAlpha = tAlpha;
            ctx.fillStyle = '#f64';
            ctx.fillRect(tp.x - 6, tp.y - 6, 12, 12);
          }
          ctx.restore();
        }

        // HC-49: DIVER RECOVERY FEEDBACK — brief fade/flash on recovery entry
        if (e._hcDiverState === 'recovering' && typeof e._hcDiverRecoveryFlash === 'number' && e._hcDiverRecoveryFlash > 0) {
          e._hcDiverRecoveryFlash = Math.max(0, e._hcDiverRecoveryFlash - 16.667);
          var recProgress = Math.min(1, e._hcDiverTimer / 200);
          var recAlpha = 0.18 * (1 - recProgress);
          var dcx2 = e.x + (e.w || 24) / 2;
          var dcy2 = e.y + (e.h || 24) / 2;

          ctx.save();
          ctx.globalAlpha = recAlpha;
          ctx.fillStyle = '#82f';
          ctx.beginPath();
          ctx.arc(dcx2, dcy2, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // HC-50: ENEMY ROLE DEBUG OVERLAY
        if (typeof getHardcoreDebugConfig === 'function' && getHardcoreDebugConfig().showEnemyRoles) {
          ctx.save();
          ctx.textBaseline = 'top';
          ctx.textAlign = 'left';
          ctx.font = '4px "Press Start 2P"';
          var rY = e.y - 14;
          var role = (typeof getEnemyPatternRole === 'function') ? getEnemyPatternRole(e) : e.patternRole || '-';
          var ready = e.patternReady ? 'RDY' : '---';
          ctx.globalAlpha = 0.82;
          ctx.fillStyle = '#0ff';
          ctx.fillText(role + ' ' + ready, e.x - 4, rY);
          var cdStr = '';
          if (typeof e._hcSniperCooldown === 'number' && e._hcSniperCooldown > 0 && e._hcSniperCooldown < 900000) {
            cdStr = 'SNP ' + (e._hcSniperCooldown / 1000).toFixed(1) + 's';
          } else if (typeof e._hcSuppressorCooldown === 'number' && e._hcSuppressorCooldown > 0 && e._hcSuppressorCooldown < 900000) {
            cdStr = 'SUP ' + (e._hcSuppressorCooldown / 1000).toFixed(1) + 's';
          } else if (typeof e._hcChaserCooldown === 'number' && e._hcChaserCooldown > 0 && e._hcChaserCooldown < 900000) {
            cdStr = 'CHS ' + (e._hcChaserCooldown / 1000).toFixed(1) + 's';
          } else if (typeof e._hcDiverCooldown === 'number' && e._hcDiverCooldown > 0 && e._hcDiverCooldown < 900000) {
            cdStr = 'DVR ' + (e._hcDiverCooldown / 1000).toFixed(1) + 's';
          } else if (typeof e._hcSweeperCooldown === 'number' && e._hcSweeperCooldown > 0 && e._hcSweeperCooldown < 900000) {
            cdStr = 'SWP ' + (e._hcSweeperCooldown / 1000).toFixed(1) + 's';
          } else if (typeof e._hcFlankerCooldown === 'number' && e._hcFlankerCooldown > 0 && e._hcFlankerCooldown < 900000) {
            cdStr = 'FLK ' + (e._hcFlankerCooldown / 1000).toFixed(1) + 's';
          }
          if (e._hcDiverState && e._hcDiverState !== 'idle') cdStr = 'DIV:' + e._hcDiverState;
          if (e._sniperTelegraphActive) cdStr = 'SNP:TG';
          if (e._chaserTelegraphActive) cdStr = 'CHS:TG';
          if (e._suppressorTelegraphActive) cdStr = 'SUP:TG';
          if (cdStr) {
            ctx.globalAlpha = 0.72;
            ctx.fillStyle = '#ff8';
            ctx.fillText(cdStr, e.x - 4, rY + 8);
          }
          ctx.restore();
        }

        ctx.restore();
      }
    });

    // ================================================================
    // HC-RD-01: PRIORITY_ENEMY — mines, satellites
    // ================================================================

    // Minas flotantes (Serpentrix) — HC-94 visual upgrade
    mines.forEach(m => {
      const pulse = Math.sin(m.pulseTime * 0.01) * 0.3 + 0.7;
      const warning = m.life < 2000 ? Math.sin(m.pulseTime * 0.03) > 0 : true;
      
      if (warning) {
        var mx = m.x;
        var my = m.y;
        var mr = m.radius;

        // Outer danger halo (larger, low alpha)
        ctx.beginPath();
        ctx.arc(mx, my, mr + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,0,' + (0.08 * pulse) + ')';
        ctx.fill();

        // Mid glow ring
        ctx.beginPath();
        ctx.arc(mx, my, mr + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,0,' + (0.18 * pulse) + ')';
        ctx.fill();

        // Main body
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,0,' + (0.55 * pulse) + ')';
        ctx.fill();

        // Bright border ring
        ctx.globalAlpha = 0.35 * pulse;
        ctx.strokeStyle = '#8f8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mx, my, mr - 1, 0, Math.PI * 2);
        ctx.stroke();

        // Bright core
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Danger flash overlay when low life
        if (m.life < 1200) {
          var dangerPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.08);
          ctx.globalAlpha = dangerPulse * 0.15;
          ctx.fillStyle = '#f00';
          ctx.beginPath();
          ctx.arc(mx, my, mr + 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    ctx.globalAlpha = 1;

    // Satélites orbitantes (Orbital)
    if (boss.active && boss.pattern === 'rotate') {
      satellites.forEach(sat => {
        const pulse = Math.sin(globalTime * 0.008) * 0.2 + 0.8;
        
        // Línea de conexión al boss
        ctx.beginPath();
        ctx.moveTo(boss.x + boss.w / 2, boss.y + boss.h / 2);
        ctx.lineTo(sat.x, sat.y);
        ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Glow exterior
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`;
        ctx.fill();
        
        // Satélite principal
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * pulse})`;
        ctx.fill();
        
        // Centro brillante
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
    }

    // ================================================================
    // HC-RD-01: PRIORITY_FEEDBACK — powerups, rewards, medals, explosions, popups
    // ================================================================

    function drawPixelPickupCore(ctx, x, y, w, h, color, accent, type) {
      var cx = Math.floor(x + w / 2);
      var cy = Math.floor(y + h / 2);
      var left = Math.floor(cx - 6);
      var top = Math.floor(cy - 6);

      ctx.fillStyle = '#03070d';
      ctx.fillRect(left + 2, top, 8, 12);
      ctx.fillRect(left, top + 2, 12, 8);

      ctx.fillStyle = color;
      ctx.fillRect(left + 3, top + 1, 6, 10);
      ctx.fillRect(left + 1, top + 3, 10, 6);

      ctx.fillStyle = accent;
      ctx.fillRect(left + 4, top + 2, 4, 2);
      ctx.fillRect(left + 2, top + 4, 2, 4);

      ctx.fillStyle = '#ffffff';
      if (type === 'double') {
        ctx.fillRect(cx - 3, cy - 4, 2, 8);
        ctx.fillRect(cx + 1, cy - 4, 2, 8);
      } else if (type === 'spread') {
        ctx.fillRect(cx - 1, cy - 4, 2, 8);
        ctx.fillRect(cx - 5, cy + 1, 3, 2);
        ctx.fillRect(cx + 2, cy + 1, 3, 2);
      } else if (type === 'machine') {
        ctx.fillRect(cx - 4, cy - 3, 8, 2);
        ctx.fillRect(cx - 4, cy + 1, 8, 2);
      } else if (type === 'laser') {
        ctx.fillRect(cx - 1, cy - 5, 2, 10);
        ctx.fillRect(cx - 3, cy - 1, 6, 2);
      } else {
        ctx.fillRect(cx - 1, cy - 1, 2, 2);
      }
    }

    // Powerups
    powerUps.forEach(p => {
      const color = getWeaponColor(p.type);
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h / 2;
      const pulse = 0.65 + 0.35 * Math.sin(globalTime * 0.012 + cx * 0.1);
      const accent = p.type === 'laser' ? '#c8ffff' : (p.type === 'machine' ? '#ffd0ff' : '#fff6a8');

      ctx.save();

      // Aura exterior pulsing
      ctx.globalAlpha = 0.04 + 0.06 * pulse;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 4, p.y - 4, p.w + 8, p.h + 8);
      ctx.globalAlpha = 0.08 + 0.10 * pulse;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 2, p.y - 2, p.w + 4, p.h + 4);

      // Núcleo con borde oscuro para contraste
      ctx.globalAlpha = 0.60;
      ctx.fillStyle = '#111';
      ctx.fillRect(p.x - 1, p.y - 1, p.w + 2, p.h + 2);

      ctx.globalAlpha = 0.16 + 0.10 * pulse;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 1, p.y - 1, p.w + 2, 1);
      ctx.fillRect(p.x - 1, p.y + p.h, p.w + 2, 1);
      ctx.fillRect(p.x - 1, p.y, 1, p.h);
      ctx.fillRect(p.x + p.w, p.y, 1, p.h);

      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Brillo interno
      ctx.globalAlpha = 0.16 * pulse;
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);

      // Letra con glow sutil y sombra
      ctx.globalAlpha = 0.30 * pulse;
      ctx.globalAlpha = 1;
      drawPixelPickupCore(ctx, p.x, p.y, p.w, p.h, color, accent, p.type);

      ctx.restore();
    });

    // UFO reward drops
ufoRewards.forEach(d => {
  const cx = d.x + d.w * 0.5;
  const cy = d.y + d.h * 0.5;
  const pulse = Math.sin(globalTime * 0.018) * 0.3 + 0.7;
  const color = d.reward?.rare ? '#ffea00' : '#23f6ff';
  const accent = d.reward?.rare ? '#fff6a8' : '#c8ffff';

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.08 + pulse * 0.16;
  ctx.fillStyle = color;
  ctx.fillRect(-d.w * 0.5 - 3, -d.h * 0.5 - 3, d.w + 6, d.h + 6);

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#071014';
  ctx.fillRect(-8, -6, 16, 12);
  ctx.fillRect(-6, -8, 12, 16);

  ctx.fillStyle = color;
  ctx.fillRect(-7, -5, 14, 10);
  ctx.fillRect(-5, -7, 10, 14);

  ctx.globalAlpha = 0.35 + pulse * 0.35;
  ctx.fillStyle = accent;
  ctx.fillRect(-4, -4, 8, 2);
  ctx.fillRect(-4, 2, 8, 2);
  ctx.fillRect(-5, -1, 2, 4);
  ctx.fillRect(3, -1, 2, 4);

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  if (d.reward && d.reward.kind === 'life') {
    ctx.fillRect(-1, -4, 2, 8);
    ctx.fillRect(-4, -1, 8, 2);
  } else if (d.reward && d.reward.kind === 'shield') {
    ctx.fillRect(-3, -4, 6, 2);
    ctx.fillRect(-4, -2, 2, 4);
    ctx.fillRect(2, -2, 2, 4);
    ctx.fillRect(-2, 2, 4, 2);
  } else {
    ctx.fillRect(-1, -4, 2, 8);
    ctx.fillRect(-3, -2, 6, 2);
  }

  ctx.restore();
});

    drawMedals(ctx);

    // HC-RD-01: Particles (explosions) render BEFORE bullets so they never cover lethal threats.
    // Particles (HC-95: core glow + ring depth)
    particles.forEach(p => {
      var _maxParticleAlpha = (typeof getFXSuppressionConfig === 'function')
        ? getFXSuppressionConfig().explosionAlphaMax || 0.55
        : 0.55;
      ctx.globalAlpha = Math.min(_maxParticleAlpha, Math.max(0, p.life));

      if (p.isRing) {
        var ringAlpha = Math.max(0, p.life);
        var rr = Math.max(3, Math.round(p.ringRadius));
        var rx = Math.round(p.x - rr);
        var ry = Math.round(p.y - rr);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = Math.min(_maxParticleAlpha, ringAlpha * 0.55);
        ctx.strokeRect(rx - 1.5, ry - 1.5, rr * 2 + 3, rr * 2 + 3);
        ctx.globalAlpha = Math.min(_maxParticleAlpha, ringAlpha);
        ctx.strokeRect(rx + 0.5, ry + 0.5, rr * 2, rr * 2);
        p.ringRadius += p.ringExpand * 0.1;
      } else if (p.isSpark) {
        var sx = Math.round(p.x);
        var sy = Math.round(p.y);
        var ss = Math.max(1, Math.round(p.size));
        ctx.fillStyle = '#050308';
        ctx.fillRect(sx - 1, sy - 1, ss + 2, ss + 2);
        ctx.fillStyle = p.color;
        ctx.fillRect(sx, sy, ss, ss);
        ctx.globalAlpha = Math.min(_maxParticleAlpha * 0.45, p.life * 0.45);
        ctx.fillRect(Math.round(p.x - p.vx * 0.3), Math.round(p.y - p.vy * 0.3), ss, ss);
        ctx.globalAlpha = Math.min(_maxParticleAlpha * 0.35, p.life * 0.35);
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx + 1, sy + 1, Math.max(1, ss - 2), Math.max(1, ss - 2));
      } else {
        var size = Math.max(1, Math.round(p.size || 3));
        var px = Math.round(p.x);
        var py = Math.round(p.y);
        ctx.globalAlpha = Math.min(_maxParticleAlpha * 0.55, Math.max(0, p.life) * 0.55);
        ctx.fillStyle = '#050308';
        ctx.fillRect(px - 1, py - 1, size + 2, size + 2);
        ctx.globalAlpha = Math.min(_maxParticleAlpha, Math.max(0, p.life));
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, size, size);
        if (p.life > 0.25) {
          ctx.globalAlpha = Math.min(_maxParticleAlpha * 0.4, p.life * 0.4);
          ctx.fillStyle = '#fff';
          ctx.fillRect(px + 1, py + 1, Math.max(1, size - 2), Math.max(1, size - 2));
        }
      }
    });
    ctx.globalAlpha = 1;
    drawPopups(ctx);

    // ================================================================
    // HC-RD-01: PRIORITY_FEEDBACK — player bullets
    // ================================================================

    // Player bullets (HC-93 visual polish / HC-RD-05: subdued glow)
    var _pfb = (typeof getPlayerFeedbackConfig === 'function') ? getPlayerFeedbackConfig() : null;
    var _pfbBullets = (_pfb && _pfb.playerBullets) || {};
    var _pbGlowMul = (typeof _pfbBullets.glowMul === 'number') ? _pfbBullets.glowMul : 0.65;
    var _pbBodyMax = (typeof _pfbBullets.bodyAlphaMax === 'number') ? _pfbBullets.bodyAlphaMax : 0.90;
    var _pbTrailCap = (typeof _pfbBullets.trailAlphaCap === 'number') ? _pfbBullets.trailAlphaCap : 0.22;

    bullets.forEach(b => {
      var bt = b.type || 'normal';
      var bc = b.color || '#fff';

      // --- HC-93: per-weapon glow profile ---
      var glowColor, glowOuter, glowInner;
      switch (bt) {
        case 'laser':   glowColor = '#0ff'; glowOuter = 0.16; glowInner = 0.10; break;
        case 'machine': glowColor = '#f5f'; glowOuter = 0.12; glowInner = 0.07; break;
        case 'spread':  glowColor = '#5f5'; glowOuter = 0.14; glowInner = 0.08; break;
        case 'double':  glowColor = '#ff8'; glowOuter = 0.13; glowInner = 0.07; break;
        default:        glowColor = '#fff'; glowOuter = 0.10; glowInner = 0.06; break;
      }
      glowOuter *= _pbGlowMul * 0.78;
      glowInner *= _pbGlowMul * 0.82;

      // --- HC-93: trail with enhanced fade ---
      if (Array.isArray(b.trail) && b.trail.length > 0) {
        var trailLen = b.trail.length;
        for (var ti = 0; ti < trailLen; ti++) {
          var tf = (ti + 1) / trailLen;
          var tp = b.trail[ti];
          var ttw = Math.max(1, b.w * (0.35 + tf * 0.40));
          var tth = Math.max(1, b.h * (0.20 + tf * 0.35));

          ctx.globalAlpha = Math.min(_pbTrailCap * 0.72, 0.02 + tf * 0.18);
          ctx.fillStyle = glowColor;
          ctx.fillRect(Math.round(tp.x - ttw / 2 - 1), Math.round(tp.y - tth / 2 - 1), Math.ceil(ttw + 2), Math.ceil(tth + 2));

          ctx.globalAlpha = Math.min(_pbTrailCap * 0.62, 0.04 + tf * 0.16);
          ctx.fillStyle = bc;
          ctx.fillRect(Math.round(tp.x - ttw / 2), Math.round(tp.y - tth / 2), Math.ceil(ttw), Math.ceil(tth));
        }
      }

      // --- HC-93: outer glow halo ---
      var ow = bt === 'laser' ? 5 : 3;
      var oh = bt === 'laser' ? 7 : 3;
      ctx.globalAlpha = glowOuter;
      ctx.fillStyle = glowColor;
      ctx.fillRect(b.x - ow, b.y - oh, b.w + ow * 2, b.h + oh * 2);

      // --- HC-93: inner glow ring ---
      ctx.globalAlpha = glowInner;
      ctx.fillStyle = glowColor;
      ctx.fillRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);

      // --- HC-VS-02C: pixel silhouette wrapper ---
      var bx = Math.round(b.x);
      var by = Math.round(b.y);
      var bw = Math.max(2, Math.round(b.w));
      var bh = Math.max(4, Math.round(b.h));
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = '#03070d';
      ctx.fillRect(bx - 1, by, bw + 2, bh);
      ctx.fillRect(bx, by - 1, bw, bh + 2);

      // --- HC-93: main body ---
      ctx.globalAlpha = _pbBodyMax;
      ctx.fillStyle = bc;
      ctx.fillRect(bx, by, bw, bh);

      // --- HC-93: bright core with pulse ---
      var corePulse = 0.5 + 0.5 * Math.sin(globalTime * 0.06 + b.x * 0.03);
      var cw = bt === 'laser' ? 2 : 1;
      var ch = bt === 'laser' ? 3 : 1;
      var coreAlpha = bt === 'laser' ? 0.55 + corePulse * 0.15 : 0.45 + corePulse * 0.15;
      ctx.globalAlpha = coreAlpha;
      ctx.fillStyle = '#fff';
      ctx.fillRect(bx + cw, by + ch, Math.max(1, bw - cw * 2), Math.max(1, bh - ch * 2));

      // --- HC-93: per-type extras ---
      if (bt === 'laser') {
        ctx.globalAlpha = 0.20 + corePulse * 0.10;
        ctx.fillStyle = '#fff';
        ctx.fillRect(b.x + 1, b.y + b.h * 0.25, 1, b.h * 0.20);
        ctx.fillRect(b.x + b.w - 2, b.y + b.h * 0.25, 1, b.h * 0.20);
        ctx.fillRect(b.x + 1, b.y + b.h * 0.60, 1, b.h * 0.20);
        ctx.fillRect(b.x + b.w - 2, b.y + b.h * 0.60, 1, b.h * 0.20);
      } else if (bt === 'machine') {
        ctx.globalAlpha = 0.08 + corePulse * 0.05;
        ctx.fillStyle = '#fff';
        ctx.fillRect(b.x - 2, b.y + b.h * 0.3, 1, 2);
        ctx.fillRect(b.x + b.w + 1, b.y + b.h * 0.5, 1, 2);
      } else if (bt === 'spread') {
        ctx.globalAlpha = 0.10;
        ctx.fillStyle = '#8f8';
        ctx.fillRect(b.x - 3, b.y + 1, 2, b.h - 2);
        ctx.fillRect(b.x + b.w + 1, b.y + 1, 2, b.h - 2);
      } else if (bt === 'double') {
        ctx.globalAlpha = 0.12 + corePulse * 0.06;
        ctx.fillStyle = '#ff8';
        ctx.fillRect(b.x + b.w * 0.5 - 1, b.y - 2, 2, 2);
        ctx.fillRect(b.x + b.w * 0.5 - 1, b.y + b.h, 2, 2);
      }
    });
    ctx.globalAlpha = 1;

    // ================================================================
    // HC-RD-01: PRIORITY_FATAL — enemy bullets (LAST gameplay layer, nothing covers them)
    // ================================================================

    // Enemy bullets
    enemyBullets.forEach(drawEnemyBullet);


    // ================================================================
    // HC-RD-01: PRIORITY_FEEDBACK — HUD overlays
    // ================================================================
    // HUD (HC-96: improved contrast + value glow)
    ctx.save();
    const hudTop = 8;
    const hudLeftX = 6;
    const hudLeftW = 132;
    const hudRightW = 126;
    const hudRightX = W - hudRightW - 6;

    drawGameplayHudPanel(hudLeftX, hudTop, hudLeftW, 46, '#0ff');
    drawGameplayHudPanel(hudRightX, hudTop, hudRightW, 46, '#ffd966');

    ctx.textBaseline = 'alphabetic';

    // LEFT panel — SCORE / LEVEL
    ctx.textAlign = 'left';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = 'rgba(120,255,255,0.85)';
    ctx.fillText('SCORE', hudLeftX + 7, hudTop + 15);
    ctx.fillStyle = 'rgba(120,255,255,0.78)';
    ctx.fillText('LEVEL', hudLeftX + 7, hudTop + 36);

    ctx.textAlign = 'right';
    ctx.font = '10px "Press Start 2P"';
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#0ff';
    ctx.fillText(score, hudLeftX + hudLeftW - 6, hudTop + 17);
    ctx.fillText(level, hudLeftX + hudLeftW - 6, hudTop + 38);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.fillText(score, hudLeftX + hudLeftW - 8, hudTop + 15);
    ctx.fillText(level, hudLeftX + hudLeftW - 8, hudTop + 36);

    // RIGHT panel — HI / CHAIN / MEDAL
    ctx.textAlign = 'left';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,220,120,0.88)';
    ctx.fillText('HI', hudRightX + 7, hudTop + 12);
    ctx.fillStyle = 'rgba(160,235,255,0.85)';
    ctx.fillText('CHAIN', hudRightX + 7, hudTop + 27);
    ctx.fillStyle = 'rgba(255,220,120,0.82)';
    ctx.fillText('MEDAL', hudRightX + 7, hudTop + 42);

    ctx.textAlign = 'right';
    ctx.font = '8px "Press Start 2P"';
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffd966';
    ctx.fillText(bestScore, hudRightX + hudRightW - 5, hudTop + 13);
    ctx.fillStyle = '#9ee7ff';
    ctx.fillText(medalChain, hudRightX + hudRightW - 5, hudTop + 28);
    ctx.fillStyle = '#ffd966';
    ctx.fillText(medalValue, hudRightX + hudRightW - 5, hudTop + 43);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.fillText(bestScore, hudRightX + hudRightW - 7, hudTop + 12);
    ctx.fillStyle = '#9ee7ff';
    ctx.fillText(medalChain, hudRightX + hudRightW - 7, hudTop + 27);
    ctx.fillStyle = '#ffd966';
    ctx.fillText(medalValue, hudRightX + hudRightW - 7, hudTop + 42);
    ctx.restore();
    drawHardcoreGrazeHUD(ctx);
    if (typeof drawHardcoreRankDebug === 'function') drawHardcoreRankDebug(ctx);
    if (typeof window.drawHardcoreRankFullDebug === 'function') window.drawHardcoreRankFullDebug(ctx);
    if (typeof window.drawHCScoreDebugOverlay === 'function') window.drawHCScoreDebugOverlay(ctx);
    if (typeof window.drawHCScoreCalibrationOverlay === 'function') window.drawHCScoreCalibrationOverlay(ctx);
    if (typeof window.drawStageDirectorDebugOverlay === 'function') window.drawStageDirectorDebugOverlay(ctx);
    if (typeof window.drawScoreMultiplierHUD === 'function') window.drawScoreMultiplierHUD(ctx);
  if (typeof window.drawRecoveryIndicator === 'function') window.drawRecoveryIndicator(ctx);
  if (typeof window.drawDangerWindowIndicator === 'function') window.drawDangerWindowIndicator(ctx);
    if (typeof window.drawHardcoreComboHUD === 'function') window.drawHardcoreComboHUD(ctx);
    if (typeof window.drawHardcoreSystemsDebug === 'function') window.drawHardcoreSystemsDebug(ctx);
    if (typeof drawHC90BackgroundStats === 'function') drawHC90BackgroundStats(ctx, level);
    if (typeof drawHC97AtmosphereStats === 'function') drawHC97AtmosphereStats(ctx, level);
    if (typeof drawHardcoreRankLevelFeedback === 'function') drawHardcoreRankLevelFeedback(ctx);

      if (typeof getBalanceProfile === 'function' && getBalanceProfile() === 'tournament') {
        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = '#ffb36b';
        ctx.fillText('TOUR', W / 2, 36);
      }

      if (typeof _fzCfg === 'undefined') _fzCfg = (typeof getFreezeAuditConfig === 'function') ? getFreezeAuditConfig() : {}; // HC-RD-07: safe fallback

      if (typeof isMedalFeverActive === 'function' && isMedalFeverActive()) {
        var feverLeft = typeof getMedalFeverTimeLeft === 'function' ? getMedalFeverTimeLeft() : 0;
        var feverPulse = 0.65 + 0.35 * Math.sin(globalTime * 0.012);
        var feverAlpha = Math.min((typeof _fzCfg.medalFeverAlphaCap === 'number') ? _fzCfg.medalFeverAlphaCap : 0.70, feverPulse); // HC-RD-07: capped

        ctx.save();
        ctx.textAlign = 'center';
        ctx.globalAlpha = feverAlpha * 0.2;
        ctx.fillStyle = '#ff1166';
        ctx.font = '16px "Press Start 2P"';
        ctx.fillText('FEVER', W / 2 + 1, 56);
        ctx.globalAlpha = feverAlpha;
        ctx.fillStyle = '#ff4488';
        ctx.fillText('FEVER', W / 2, 55);

        ctx.globalAlpha = 0.9;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = '#fff';
        ctx.fillText(('0' + feverLeft).slice(-2), W / 2, 70);
        ctx.restore();
      }

      // Wave number announcement — HC-RD-07: alpha capped
      if (waveAnnounceTimer > 0) {
        var waPulse = 0.55 + 0.45 * Math.sin(globalTime * 0.025);
        var waAlpha = Math.min(1, waveAnnounceTimer / 400);
        var waMaxAlpha = (typeof _fzCfg.waveAnnounceAlphaCap === 'number') ? _fzCfg.waveAnnounceAlphaCap : 0.65; // HC-RD-07: cap
        var waY = H / 2 - 60;
        var waColor = pendingNextLevel ? '#64f5ff' : '#fff36a';

        ctx.save();
        ctx.textAlign = 'center';

        ctx.globalAlpha = waAlpha * 0.15;
        ctx.fillStyle = waColor;
        ctx.font = '28px "Press Start 2P"';
        ctx.fillText(waveAnnounceText, W / 2 + 2, waY + 2);

        ctx.globalAlpha = Math.min(waMaxAlpha, waAlpha * waPulse);
        ctx.fillStyle = '#000';
        ctx.font = '28px "Press Start 2P"';
        ctx.fillText(waveAnnounceText, W / 2 + 2, waY + 3);
        ctx.fillStyle = waColor;
        ctx.fillText(waveAnnounceText, W / 2, waY);

        // Milestone sub-announcement
        if (waveAnnounceSubTimer > 0 && waveAnnounceSubText) {
          var subPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.035);
          var subAlpha = Math.min(1, waveAnnounceSubTimer / 500);

          ctx.globalAlpha = subAlpha * 0.12;
          ctx.fillStyle = '#ff4444';
          ctx.font = '14px "Press Start 2P"';
          ctx.fillText(waveAnnounceSubText, W / 2 + 1, waY + 36);

          ctx.globalAlpha = subAlpha * subPulse;
          ctx.fillStyle = '#000';
          ctx.fillText(waveAnnounceSubText, W / 2 + 1, waY + 37);
          ctx.fillStyle = '#ff6644';
          ctx.fillText(waveAnnounceSubText, W / 2, waY + 36);
        }

        ctx.restore();
      }

      if (debugLevelJumpTimer > 0 && debugLevelJumpText) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.min(1, debugLevelJumpTimer / 300);
        ctx.fillStyle = '#000';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText(debugLevelJumpText, W / 2 + 1, 106);
        ctx.fillStyle = '#7cff6b';
        ctx.fillText(debugLevelJumpText, W / 2, 104);
        ctx.restore();
      }

      if (setPieceIntroTimer > 0 && currentSetPiece) {
        const pulse = 0.45 + 0.55 * Math.sin(globalTime * 0.03);
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.42 + pulse * 0.20;
        ctx.fillStyle = '#050308';
        ctx.fillRect(W / 2 - 78, 102, 156, 26);
        ctx.globalAlpha = 0.46 + pulse * 0.24;
        ctx.strokeStyle = '#ff6048';
        ctx.lineWidth = 1;
        ctx.strokeRect(W / 2 - 76.5, 103.5, 153, 23);
        ctx.font = '14px "Press Start 2P"';
        ctx.fillStyle = `rgba(255,86,72,${0.72 + pulse * 0.18})`;
        ctx.fillText('WARNING', W / 2, 116);

        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = `rgba(255,220,140,${0.54 + pulse * 0.18})`;
        ctx.fillText(setPieceBannerText || 'HOSTILE FORMATION', W / 2, 137);
        ctx.globalAlpha = 1;
      }

      if (setPieceTelegraphTimer > 0 && currentSetPiece === 'imperial_guard') {
        var _tcs5 = _getTelegraphOutlineStyle();
        const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.05);
        const side = setPieceTelegraphSide === -1 ? -1 : 1;
        const x = side < 0 ? 24 : W - 24;
        const diffMode = difficulties[difficultyIndex] || difficulties[0];
        const isAdvanced = level >= 19 || diffMode.key === 'hardcore';
        const isDoubleCrossfire = setPieceBurstShotsRemaining > 0 || isAdvanced;
        const isSecondTelegraph = isAdvanced && setPieceBurstShotsRemaining === 1;
        const lineColor = isSecondTelegraph
          ? `rgba(255,70,70,${0.34 + 0.36 * pulse})`
          : `rgba(255,190,85,${0.30 + 0.32 * pulse})`;
        const flashColor = isSecondTelegraph
          ? `rgba(255,60,60,${0.12 + 0.20 * pulse})`
          : `rgba(255,190,70,${0.10 + 0.18 * pulse})`;
        var _spX = side < 0 ? 4 : W - 14;

        // HC-RD-03: dark outline behind vertical stripe
        ctx.globalAlpha = _tcs5.alpha;
        ctx.strokeStyle = _tcs5.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(_spX - 1, 90 - 1, 8, H - 210 + 2);

        ctx.fillStyle = flashColor;
        ctx.fillRect(_spX, 90, 6, H - 210);

        // HC-RD-03: dark outline behind vertical line
        ctx.globalAlpha = _tcs5.alpha;
        ctx.strokeStyle = _tcs5.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, 94);
        ctx.lineTo(x, H - 120);
        ctx.stroke();

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 94);
        ctx.lineTo(x, H - 120);
        ctx.stroke();

        ctx.fillStyle = lineColor;
        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        const label = isDoubleCrossfire
          ? (isSecondTelegraph ? 'CROSSFIRE B' : 'CROSSFIRE A')
          : 'CROSSFIRE';
        ctx.fillText(label, W / 2, 104);
      }

      if (setPieceTelegraphTimer > 0 && currentSetPiece === 'fortress') {
        var _tcs6 = _getTelegraphOutlineStyle();
        const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.05);
        const lane = Math.max(0, Math.floor(setPieceTelegraphSide || 0));
        const rowEnemies = enemies.filter(e => e.alive && !e.diving && e.row === lane);
        const y = rowEnemies.length > 0
          ? rowEnemies.reduce((acc, e) => acc + (e.y + e.h * 0.55), 0) / rowEnemies.length
          : (118 + lane * 34);

        // HC-RD-03: dark outline behind horizontal bar
        ctx.globalAlpha = _tcs6.alpha;
        ctx.strokeStyle = _tcs6.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(7, y - 13, W - 14, 26);

        ctx.fillStyle = `rgba(255,170,70,${0.08 + 0.14 * pulse})`;
        ctx.fillRect(8, y - 12, W - 16, 24);

        // HC-RD-03: dark outline behind horizontal line
        ctx.globalAlpha = _tcs6.alpha;
        ctx.strokeStyle = _tcs6.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(W - 8, y);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255,205,95,${0.30 + 0.32 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(W - 8, y);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = `rgba(255,220,120,${0.44 + 0.30 * pulse})`;
        ctx.fillText(`ROW ${lane + 1} BARRAGE`, W / 2, 104);
      }

      if (setPieceTelegraphTimer > 0 && currentSetPiece === 'split_storm') {
        var _tcs7 = _getTelegraphOutlineStyle();
        const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.055);
        const side = setPieceTelegraphSide === -1 ? -1 : 1;
        const x = side < 0 ? 18 : W - 18;
        var _spX2 = side < 0 ? 4 : W - 14;

        // HC-RD-03: dark outline behind vertical stripe
        ctx.globalAlpha = _tcs7.alpha;
        ctx.strokeStyle = _tcs7.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(_spX2 - 1, 100 - 1, 8, H - 220 + 2);

        ctx.fillStyle = `rgba(120,255,200,${0.09 + 0.16 * pulse})`;
        ctx.fillRect(_spX2, 100, 6, H - 220);

        // HC-RD-03: dark outline behind vertical line
        ctx.globalAlpha = _tcs7.alpha;
        ctx.strokeStyle = _tcs7.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, 104);
        ctx.lineTo(x, H - 120);
        ctx.stroke();

        ctx.strokeStyle = `rgba(150,255,210,${0.34 + 0.34 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 104);
        ctx.lineTo(x, H - 120);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = `rgba(170,255,220,${0.46 + 0.28 * pulse})`;
        ctx.fillText('FAN BURST', W / 2, 104);
      }

	    if (setPieceBannerTimer > 0 && setPieceBannerText && setPieceIntroTimer <= 0) {
	      const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.02);
	      ctx.textAlign = 'center';
	      ctx.font = '9px "Press Start 2P"';
	      ctx.fillStyle = `rgba(255,220,80,${0.58 + pulse * 0.24})`;
	      ctx.fillText(setPieceBannerText, W / 2, 78);
	    }

	   // Power timer (HC-96: cleaner arcade bar)
if (player.weaponType !== 'normal') {
  const maxDurations = { double: 4000, spread: 4000, machine: 4000, laser: 4000 };
  const maxTime = maxDurations[player.weaponType] || 5000;
  const trackW = 76;
  const barW = Math.min(trackW, (player.weaponTimer / maxTime) * trackW);

  const barX = W - 90;
  const barY = H - 17;
  const wColor = getWeaponColor(player.weaponType);

  ctx.save();

  // Dark background
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.fillRect(barX - 2, barY - 2, trackW + 4, 9);

  // Empty track
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = wColor;
  ctx.fillRect(barX, barY, trackW, 5);

  // Filled bar
  ctx.globalAlpha = 0.80;
  ctx.fillStyle = wColor;
  ctx.fillRect(barX, barY, barW, 5);

  // Top shine
  ctx.globalAlpha = 0.30;
  ctx.fillStyle = '#fff';
  ctx.fillRect(barX, barY, barW, 2);

  // Border
  ctx.globalAlpha = 0.32;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX + 0.5, barY + 0.5, trackW - 1, 4);

  // Low-time warning
  if (player.weaponTimer < 1200) {
    var warnPulse = 0.25 + 0.25 * Math.sin(globalTime * 0.06);
    ctx.globalAlpha = warnPulse;
    ctx.fillStyle = '#f44';
    ctx.fillRect(barX, barY, barW, 5);
  }

  // Label
  ctx.globalAlpha = 0.50;
  ctx.fillStyle = '#000';
  ctx.font = '6px "Press Start 2P"';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(player.weaponType.toUpperCase(), W - 8, barY - 2);
  ctx.fillText(player.weaponType.toUpperCase(), W - 8, barY);
  ctx.globalAlpha = 0.88;
  ctx.fillStyle = wColor;
  ctx.fillText(player.weaponType.toUpperCase(), W - 9, barY - 1);

  ctx.restore();
}



    // Lives (HC-96: ship-shaped icons)
    var livesW = 8 + lives * 18;
    drawGameplayHudPanel(4, H - 26, livesW, 17, currentPalette[0]);
    for (var li = 0; li < lives; li++) {
      var lx = 10 + li * 18;
      var ly = H - 23;
      ctx.fillStyle = currentPalette[0];
      // Mini ship icon
      ctx.fillRect(lx + 4, ly, 3, 1);
      ctx.fillRect(lx + 3, ly + 1, 5, 1);
      ctx.fillRect(lx + 2, ly + 2, 7, 1);
      ctx.fillRect(lx + 1, ly + 3, 9, 1);
      ctx.fillRect(lx, ly + 4, 11, 1);
      ctx.fillRect(lx + 4, ly + 5, 3, 1);
      ctx.fillRect(lx + 3, ly + 6, 5, 1);
      // Thruster dot
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#fff';
      ctx.fillRect(lx + 5, ly + 7, 1, 1);
      ctx.globalAlpha = 1;
    }

    // LEVEL CLEAR overlay — HC-RD-06: subdued readability
    if (pendingNextLevel) {
      ctx.save();

      var _lcCfg = (_hudCfg && _hudCfg.levelClear) || {};
      var _lcDark = (typeof _lcCfg.darkBandAlpha === 'number') ? _lcCfg.darkBandAlpha : 0.22;
      var _lcBracket = (typeof _lcCfg.bracketAlpha === 'number') ? _lcCfg.bracketAlpha : 0.45;
      var _lcBorder = (typeof _lcCfg.borderAlpha === 'number') ? _lcCfg.borderAlpha : 0.30;
      var _lcGlowBlur = (typeof _lcCfg.glowShadowBlur === 'number') ? _lcCfg.glowShadowBlur : 12;

      var lcPulse = 0.6 + 0.4 * Math.sin(globalTime * 0.003);
      var lcAlpha = Math.min(1, levelClearTimer / 300);
      var _ly = H / 2 - 55;
      var _lh = 110;
      var _lm = 20;

      // Dark band
      ctx.globalAlpha = _lcDark * lcAlpha;
      ctx.fillStyle = '#010a14';
      ctx.fillRect(0, _ly, W, _lh);

      // Inner cyan wash (horizontal glow strip)
      ctx.globalAlpha = 0.06 * lcAlpha * lcPulse;
      ctx.fillStyle = '#0af';
      ctx.fillRect(0, _ly + _lh / 2 - 10, W, 20);

      // Scanlines scrolling up (warp feel)
      ctx.globalAlpha = 0.10 * lcAlpha;
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 1;
      var _scanY = (globalTime * 0.06) % 6;
      for (var _s = _ly + _scanY; _s < _ly + _lh; _s += 6) {
        ctx.globalAlpha = 0.07 * lcAlpha * (1 - Math.abs(_s - _ly - _lh / 2) / (_lh / 2));
        ctx.beginPath();
        ctx.moveTo(0, _s);
        ctx.lineTo(W, _s);
        ctx.stroke();
      }

      // Arcade corner brackets
      ctx.globalAlpha = _lcBracket * lcAlpha * lcPulse;
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      var _bl = 16;
      ctx.beginPath();
      ctx.moveTo(_lm, _ly + 10); ctx.lineTo(_lm, _ly + 10 + _bl);
      ctx.moveTo(_lm, _ly + 10); ctx.lineTo(_lm + _bl, _ly + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W - _lm, _ly + 10); ctx.lineTo(W - _lm, _ly + 10 + _bl);
      ctx.moveTo(W - _lm, _ly + 10); ctx.lineTo(W - _lm - _bl, _ly + 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(_lm, _ly + _lh - 10); ctx.lineTo(_lm, _ly + _lh - 10 - _bl);
      ctx.moveTo(_lm, _ly + _lh - 10); ctx.lineTo(_lm + _bl, _ly + _lh - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W - _lm, _ly + _lh - 10); ctx.lineTo(W - _lm, _ly + _lh - 10 - _bl);
      ctx.moveTo(W - _lm, _ly + _lh - 10); ctx.lineTo(W - _lm - _bl, _ly + _lh - 10);
      ctx.stroke();

      // Main border lines (between corner brackets)
      ctx.globalAlpha = _lcBorder * lcAlpha * lcPulse;
      ctx.strokeStyle = '#0cf';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(_lm + _bl + 4, _ly + 4);
      ctx.lineTo(W - _lm - _bl - 4, _ly + 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(_lm + _bl + 4, _ly + _lh - 4);
      ctx.lineTo(W - _lm - _bl - 4, _ly + _lh - 4);
      ctx.stroke();

      // "LEVEL CLEAR" text
      ctx.textAlign = 'center';
      ctx.font = '28px "Press Start 2P"';

      // Drop shadow
      ctx.globalAlpha = 0.65 * lcAlpha;
      ctx.fillStyle = '#000';
      ctx.fillText('LEVEL CLEAR', W / 2 + 3, H / 2 - 3);

      // Cyan glow
      ctx.globalAlpha = 0.35 * lcAlpha * lcPulse;
      ctx.shadowColor = '#0ff';
      ctx.shadowBlur = _lcGlowBlur;
      ctx.fillStyle = '#0ff';
      ctx.fillText('LEVEL CLEAR', W / 2, H / 2 - 7);
      ctx.shadowBlur = 0;

      // Main text (white)
      ctx.globalAlpha = lcAlpha * lcPulse;
      ctx.fillStyle = '#fff';
      ctx.fillText('LEVEL CLEAR', W / 2, H / 2 - 6);

      // "WARPING" with animated trailing dots
      ctx.font = '12px "Press Start 2P"';
      var _dp = Math.floor(globalTime / 300) % 4;
      var _dots = '';
      for (var _d = 0; _d < _dp; _d++) { _dots += '.'; }

      ctx.globalAlpha = 0.25 * lcAlpha;
      ctx.shadowColor = '#0af';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#0af';
      ctx.fillText('WARPING' + _dots, W / 2, H / 2 + 31);
      ctx.shadowBlur = 0;

      ctx.globalAlpha = 0.85 * lcAlpha * (0.6 + 0.4 * Math.sin(globalTime * 0.005));
      ctx.fillStyle = '#f0f8ff';
      ctx.fillText('WARPING' + _dots, W / 2, H / 2 + 30);

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Reward text must render above the LEVEL CLEAR banner.
    if (waveRewardTimer > 0 && waveRewardText) {
      ctx.save();
      var rwAlpha = Math.min(1, waveRewardTimer / 500);
      var rwY = H / 2 + 70;
      var rwPulse = 0.62 + 0.38 * Math.sin(globalTime * 0.03);
      var rwBoxW = Math.min(W - 34, 248);
      var rwBoxH = 22;

      ctx.textAlign = 'center';
      ctx.font = '10px "Press Start 2P"';

      ctx.globalAlpha = rwAlpha * 0.56;
      ctx.fillStyle = '#020812';
      ctx.fillRect(W / 2 - rwBoxW / 2, rwY - 15, rwBoxW, rwBoxH);

      ctx.globalAlpha = rwAlpha * 0.70;
      ctx.strokeStyle = '#ffea00';
      ctx.lineWidth = 1;
      ctx.strokeRect(W / 2 - rwBoxW / 2 + 0.5, rwY - 15.5, rwBoxW - 1, rwBoxH);

      ctx.globalAlpha = rwAlpha * 0.30;
      ctx.shadowColor = '#ffea00';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffea00';
      ctx.fillText(waveRewardText, W / 2, rwY);

      ctx.globalAlpha = rwAlpha * rwPulse;
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#000';
      ctx.fillText(waveRewardText, W / 2 + 1, rwY + 2);
      ctx.fillStyle = '#ffea00';
      ctx.fillText(waveRewardText, W / 2, rwY);
      ctx.restore();
    }

    // BOSS WARNING overlay (HC-96/HC-RD-06: subdued readability)
    if (boss && boss.active && boss.hp >= boss.maxHp && (!enemyBullets || enemyBullets.length === 0)) {
      ctx.save();

      var _hwCfg = (_hudCfg && _hudCfg.bossWarning) || {};
      var _hwDarkBand = (typeof _hwCfg.darkBandAlpha === 'number') ? _hwCfg.darkBandAlpha : 0.18;
      var _hwAccent = (typeof _hwCfg.accentAlpha === 'number') ? _hwCfg.accentAlpha : 0.40;
      var _hwText = (typeof _hwCfg.textAlpha === 'number') ? _hwCfg.textAlpha : 0.60;
      var _hwPillarMax = (typeof _hwCfg.sidePillarMax === 'number') ? _hwCfg.sidePillarMax : 0.25;
      var _hwStripe = (typeof _hwCfg.stripeAlpha === 'number') ? _hwCfg.stripeAlpha : 0.05;

      var bwPulse = 0.7 + 0.3 * Math.sin(globalTime * 0.004);
      var bwPulseF = 0.55 + 0.45 * Math.sin(globalTime * 0.006 + 1.5);
      var _bwY = 54;
      var _bwH = 16;
      var _bwW = Math.min(W - 44, 174);
      var _bwX = W / 2 - _bwW / 2;
      var _bwColor = boss.color || '#f44';

      // HC-121: intro pressure — full-screen subtle dark flash
      ctx.globalAlpha = 0.018 + 0.014 * bwPulseF;
      ctx.fillStyle = '#000';
      ctx.fillRect(-10, -10, W + 20, H + 20);
      ctx.globalAlpha = 0.008 * bwPulse;
      ctx.fillStyle = _bwColor;
      ctx.fillRect(-10, -10, W + 20, H + 20);

      // Compact warning chip, kept below HUD and away from the boss silhouette.
      ctx.globalAlpha = _hwDarkBand * 0.82;
      ctx.fillStyle = '#000';
      ctx.fillRect(_bwX, _bwY, _bwW, _bwH);

      // Subtle warning stripes
      ctx.globalAlpha = (_hwStripe + _hwStripe * bwPulseF) * 0.65;
      ctx.fillStyle = _bwColor;
      for (var sd = _bwX; sd < _bwX + _bwW; sd += 16) {
        ctx.fillRect(sd, _bwY, 8, _bwH);
      }

      // Top/bottom accent lines
      ctx.globalAlpha = _hwAccent * bwPulse * 0.70;
      ctx.fillStyle = _bwColor;
      ctx.fillRect(_bwX, _bwY, _bwW, 1);
      ctx.fillRect(_bwX, _bwY + _bwH - 1, _bwW, 1);

      // Side pillars
      ctx.globalAlpha = Math.min(_hwPillarMax * 0.6, 0.12 + 0.10 * bwPulseF);
      ctx.fillRect(_bwX, _bwY + 2, 2, _bwH - 4);
      ctx.fillRect(_bwX + _bwW - 2, _bwY + 2, 2, _bwH - 4);

      // WARNING text
      ctx.textAlign = 'center';
      ctx.font = '7px "Press Start 2P"';
      ctx.globalAlpha = (_hwText - 0.16) * bwPulse;
      ctx.fillStyle = '#000';
      ctx.fillText('WARNING', W / 2 + 1, _bwY + 7);
      ctx.globalAlpha = _hwText * bwPulse * 0.84;
      ctx.fillStyle = '#fff';
      ctx.fillText('WARNING', W / 2, _bwY + 6);

      // Boss name
      if (boss.name) {
        ctx.font = '5px "Press Start 2P"';
        ctx.globalAlpha = 0.28 * bwPulse;
        ctx.fillStyle = _bwColor;
        ctx.fillText(boss.name.toUpperCase(), W / 2 + 1, _bwY + 14);
        ctx.globalAlpha = _hwText * bwPulseF * 0.76;
        ctx.fillText(boss.name.toUpperCase(), W / 2, _bwY + 13);
      }

      // HC-SPRITE-MINIBOSS-02: mini-boss prelude silhouette preview
      // Foreshadows upcoming faction mini-boss during boss warning intro.
      // Visual-only tease — no gameplay, no entity, no HP, no collision.
      if (typeof drawMiniBossVisual === 'function') {
        var _mbPreludeEnabled = (typeof GALAXY_CONFIG !== 'undefined' && GALAXY_CONFIG.spriteLab && GALAXY_CONFIG.spriteLab.minibossPreludePreview !== false);
        if (_mbPreludeEnabled) {
          var _mbPreludeMap = { crossfire: 'scout_hive_leader', zigzag: 'suppressor_siege_core', rotate: 'splitter_aberrant_node', divebomb: 'splitter_aberrant_node', supreme: 'imperial_command_lancer' };
          var _mbUnitId = _mbPreludeMap[boss.pattern];
          if (_mbUnitId) {
            var _mbSize = Math.min(W * 0.42, 160);
            var _mbX = W / 2 - _mbSize / 2;
            var _mbY = H * 0.38 - _mbSize / 2;
            var _mbAlpha = 0.06 + 0.04 * bwPulseF;
            ctx.save();
            ctx.globalAlpha = _mbAlpha;
            drawMiniBossVisual(ctx, _mbUnitId, _mbX, _mbY, _mbSize, _mbSize, { alpha: 1, tint: _bwColor });
            ctx.restore();
          }
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Pause overlay - ESTILO ARCADE
    if (state === 'paused') {
      var _ovCfg2 = (typeof getHUDReadabilityConfig === 'function') ? (getHUDReadabilityConfig().overlays || {}) : {};
      const pausePulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
      const panelW = Math.min(W - 40, 300);
      const panelH = 330;
      const panelX = (W - panelW) / 2;
      const panelY = Math.max(52, (H - panelH) / 2);
      const accent = currentPalette[0] || '#0ff';

      var _pauseBg = (_ovCfg2 && typeof _ovCfg2.pauseBgAlpha === 'number') ? _ovCfg2.pauseBgAlpha : 0.65;
      ctx.fillStyle = 'rgba(0,0,0,' + _pauseBg + ')';
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.18 + pausePulse * 0.08;
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, W, 2);
      ctx.fillRect(0, H - 2, W, 2);
      ctx.globalAlpha = 1;

      drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

      ctx.textAlign = 'center';
      drawGlowText(
        'PAUSED',
        W / 2,
        panelY + 46,
        '24px "Press Start 2P"',
        pausePulse > 0.45 ? '#fff36a' : '#fff',
        'rgba(255,235,90,0.65)'
      );

      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(panelX + 24, panelY + 68);
      ctx.lineTo(panelX + panelW - 24, panelY + 68);
      ctx.stroke();

      ctx.font = '10px "Press Start 2P"';
      const statsX = panelX + 34;
      const statsValueX = panelX + panelW - 34;
      let y = panelY + 98;
      const lh = 24;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('SCORE:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(score.toString(), statsValueX, y);

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('HI-SCORE:', statsX, y);
      ctx.fillStyle = score > bestScore ? '#0f0' : '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(Math.max(score, bestScore).toString(), statsValueX, y);

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('LEVEL:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(level + ' / 20', statsValueX, y);

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('LIVES:', statsX, y);
      for (let i = 0; i < lives; i++) {
        ctx.fillStyle = accent;
        ctx.fillRect(statsValueX - 12 - (lives - 1 - i) * 18, y - 10, 12, 8);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(statsValueX - 12 - (lives - 1 - i) * 18, y - 10, 12, 1);
      }

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('WEAPON:', statsX, y);
      ctx.fillStyle = player.weaponType !== 'normal' ? getWeaponColor(player.weaponType) : '#666';
      ctx.textAlign = 'right';
      ctx.fillText(player.weaponType.toUpperCase(), statsValueX, y);

      y += 24;
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.moveTo(panelX + 24, y);
      ctx.lineTo(panelX + panelW - 24, y);
      ctx.stroke();

      y += 22;
      const pauseOptions = ['RESUME', 'OPTIONS', 'QUIT'];

      for (let i = 0; i < pauseOptions.length; i++) {
        const optY = y + i * 32;
        const isSelected = (pauseSelection === i);

        if (isSelected) {
          ctx.fillStyle = 'rgba(255,245,120,0.12)';
          ctx.fillRect(panelX + 28, optY - 18, panelW - 56, 28);
          ctx.strokeStyle = 'rgba(255,245,120,0.45)';
          ctx.strokeRect(panelX + 28.5, optY - 18.5, panelW - 57, 27);

          ctx.font = '12px "Press Start 2P"';
          ctx.fillStyle = '#ff0';
          const cursorPulse = Math.sin(globalTime * 0.008) * 3;
          ctx.textAlign = 'left';
          ctx.fillText('>', panelX + 42 - cursorPulse, optY);
          ctx.textAlign = 'right';
          ctx.fillText('<', panelX + panelW - 42 + cursorPulse, optY);
        }

        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? '#fff36a' : '#8a94a8';
        ctx.fillText(pauseOptions[i], W / 2, optY);
      }

      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.fillText('UP/DOWN SELECT   FIRE=OK', W / 2, panelY + panelH + 28);
    }
  }

  // TRY AGAIN overlay (gameover transient)
  if (state === 'gameover' && showTryAgain) {
    var _ovCfg3 = (typeof getHUDReadabilityConfig === 'function') ? (getHUDReadabilityConfig().overlays || {}) : {};
    var _govAlpha = (typeof _ovCfg3.gameoverBgAlpha === 'number') ? _ovCfg3.gameoverBgAlpha : 0.72;
    const overPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
    const panelW = Math.min(W - 56, 300);
    const panelH = 138;
    ctx.fillStyle = 'rgba(0,0,0,' + _govAlpha + ')';
    ctx.fillRect(-10, -10, W + 20, H + 20);
    const panelX = (W - panelW) / 2;
    const panelY = (H - panelH) / 2 - 8;
    const accent = '#ff365f';

    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(-10, -10, W + 20, H + 20);

    ctx.globalAlpha = 0.16 + overPulse * 0.08;
    ctx.fillStyle = accent;
    ctx.fillRect(0, Math.floor(H / 2) - 2, W, 4);
    ctx.globalAlpha = 1;

    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);
    drawGlowText(
      'TRY AGAIN',
      W / 2,
      panelY + 62,
      '24px "Press Start 2P"',
      overPulse > 0.35 ? '#fff' : '#ffd7df',
      'rgba(255,54,95,0.75)'
    );

    ctx.textAlign = 'center';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.fillText('PRESS FIRE', W / 2, panelY + 98);
  }

  // Victory screen ÉPICO
  if (state === 'victory') {
    // Fondo gradual
    ctx.fillStyle = 'rgba(0,0,10,0.9)';
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    
    // Fase 1: Explosiones (solo mostrar boss explotando)
    if (victoryPhase === 1) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = '#f00';
      if (globalTime % 200 < 100) {
        ctx.fillText('EMPEROR DESTROYED', W / 2, H / 2);
      }
    }
    
    // Fase 2: Nave subiendo
    if (victoryPhase === 2) {
      // Dibujar nave subiendo
      const shipColor = currentPalette[0];
      const shipKey = (animationFrame === 0) ? 'player_a' : 'player_b';
      drawSprite(ctx, SPRITES[shipKey], player.x, playerVictoryY, shipColor, 3);
      
      // Estela de la nave
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.3 - i * 0.1;
        ctx.fillStyle = shipColor;
        ctx.fillRect(player.x + 14, playerVictoryY + 25 + i * 15, 5, 10);
      }
      ctx.globalAlpha = 1;
      
      ctx.font = '28px "Press Start 2P"';
      ctx.fillStyle = '#ff0';
      ctx.fillText('VICTORY!', W / 2, 80);
    }
    
    // Fase 3: Stats y grado
    if (victoryPhase === 3) {
      // Título
      ctx.font = '32px "Press Start 2P"';
      ctx.fillStyle = '#ff0';
      ctx.fillText('VICTORY!', W / 2, 60);
      
      // Grado gigante
      const gradePulse = Math.sin(globalTime * 0.005) * 0.2 + 0.8;
      ctx.font = '64px "Press Start 2P"';
      ctx.fillStyle = getGradeColor(finalGrade);
      ctx.globalAlpha = gradePulse;
      ctx.fillText(finalGrade, W / 2, 140);
      ctx.globalAlpha = 1;
      
      // Descripción del grado
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#888';
      const gradeDesc = {
        'S': 'PERFECT! LEGENDARY PILOT!',
        'A': 'EXCELLENT! TRUE HERO!',
        'B': 'GREAT JOB! WELL DONE!',
        'C': 'MISSION COMPLETE!'
      };
      ctx.fillText(gradeDesc[finalGrade], W / 2, 165);
      
      // Stats
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'left';
      const statsX = W / 2 - 100;
      let statsY = 200;
      const lineH = 24;
      
      ctx.fillStyle = '#0ff';
      ctx.fillText('FINAL SCORE:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(score.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('TIME:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(formatTime(gameStats.totalTime), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('ENEMIES:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(gameStats.enemiesKilled.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('ACCURACY:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      const accuracy = gameStats.shotsFired > 0 ? Math.floor((gameStats.shotsHit / gameStats.shotsFired) * 100) : 0;
      ctx.fillText(accuracy + '%', statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('POWERUPS:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(gameStats.powerupsCollected.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('CONTINUES:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = continueCount === 0 ? '#0f0' : '#f80';
      ctx.fillText(continueCount.toString(), statsX + 200, statsY);
      
      // Hardcore mode (HC-12: always active)
      ctx.textAlign = 'center';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillStyle = '#f0f';
      if (globalTime % 1000 < 500) {
        ctx.fillText('★ HARDCORE MODE ★', W / 2, statsY + 50);
      }
      
      // Press fire
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#aaa';
      if (globalTime % 800 < 400) {
        ctx.fillText('PRESS FIRE', W / 2, H - 70);
      }
      
      // Trofeo pequeño
      const trophyBob = Math.sin(globalTime * 0.004) * 5;
      drawSprite(ctx, SPRITES.victory_trophy, W - 60, 40 + trophyBob, '#ff0', 3);
    }

    // Confetti en todas las fases (excepto 1)
    if (victoryPhase > 1) {
      victoryParticles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.globalAlpha = 1;
    }
  }

  if (isBalanceDebugEnabled()) {
    drawBalanceDebugOverlay(ctx);
  }

  // Flash overlay (HC-95: soft alpha + vignette for heavy hits)
  if (flashScreen > 0) {
    // HC-RD-07: flash alpha cap from playerFeedback.damage config
    var _pfbFlash = (typeof getPlayerFeedbackConfig === 'function') ? (getPlayerFeedbackConfig().damage || {}) : {};
    var _flCap = (typeof _pfbFlash.screenFlashAlphaCap === 'number') ? _pfbFlash.screenFlashAlphaCap : 0.06;
    var fsAlpha = Math.min(_flCap * 0.82, flashScreen * 0.045);
    if (flashScreen > 20) {
      var fsGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.25, W / 2, H / 2, W * 0.8);
      fsGrad.addColorStop(0, 'rgba(255,255,255,' + (fsAlpha * 0.36) + ')');
      fsGrad.addColorStop(1, 'rgba(255,120,100,' + (fsAlpha * 0.22) + ')');
      ctx.fillStyle = fsGrad;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,' + fsAlpha + ')';
    }
    ctx.fillRect(-10, -10, W + 20, H + 20);
  }

  ctx.restore();

  if (typeof window.drawEncounterDirectorDebug === 'function') {
    window.drawEncounterDirectorDebug(ctx);
  }

  // HC-HB-02: collision debug overlay (render-only, no gameplay changes)
  if (typeof window.drawHCHitboxDebug === 'function') {
    window.drawHCHitboxDebug(ctx);
  }
}
