// =====================
// HC-90 BACKGROUND LAYER FOUNDATION
// multi-layer starfield · parallax · nebula · color grading
// =====================

// --- STAGE COLOR GRADES (subtle tint per stage band) ---
var HC90_COLOR_GRADE = {
  earth:      { r: 8,  g: 16, b: 40, a: 0.035 },
  atmosphere: { r: 15, g: 20, b: 50, a: 0.04  },
  orbit:      { r: 30, g: 12, b: 40, a: 0.045 },
  deepSpace:  { r: 40, g: 8,  b: 20, a: 0.05  },
  imperial:   { r: 50, g: 6,  b: 12, a: 0.055 }
};

// --- NEBULA BLOBS (radial gradients, very low alpha, pulse with time) ---
var HC90_NEBULA = {
  earth: [
    { x: 0.28, y: 0.38, rx: 65, ry: 80, c: '#081830', a: 0.025 },
    { x: 0.68, y: 0.58, rx: 80, ry: 60, c: '#0c1a30', a: 0.02  }
  ],
  atmosphere: [
    { x: 0.48, y: 0.28, rx: 90, ry: 70, c: '#101a40', a: 0.03  },
    { x: 0.22, y: 0.65, rx: 70, ry: 85, c: '#0e1835', a: 0.022 }
  ],
  orbit: [
    { x: 0.38, y: 0.48, rx: 100, ry: 85, c: '#1c0e30', a: 0.035 },
    { x: 0.62, y: 0.32, rx: 65, ry: 75, c: '#150c28', a: 0.028 },
    { x: 0.18, y: 0.72, rx: 55, ry: 45, c: '#120a30', a: 0.022 }
  ],
  deepSpace: [
    { x: 0.42, y: 0.38, rx: 110, ry: 90, c: '#200a18', a: 0.04  },
    { x: 0.68, y: 0.62, rx: 75, ry: 65, c: '#180610', a: 0.03  },
    { x: 0.22, y: 0.22, rx: 60, ry: 80, c: '#150812', a: 0.025 }
  ],
  imperial: [
    { x: 0.48, y: 0.32, rx: 120, ry: 100, c: '#2a0610', a: 0.048 },
    { x: 0.28, y: 0.58, rx: 80, ry: 70, c: '#1e040c', a: 0.035 },
    { x: 0.68, y: 0.22, rx: 65, ry: 85, c: '#220610', a: 0.03  }
  ]
};

// --- STAGE INTENSITY (0..1, clamped) ---
function getHC90Intensity(level) {
  var lv = (typeof level === 'number' && isFinite(level)) ? level : 1;
  return Math.min(1, Math.max(0, lv / 20));
}

// --- CONFIG GUARD ---
function isHC90BackgroundEnabled() {
  try {
    if (typeof getBackgroundConfig !== 'function') return true;
    var cfg = getBackgroundConfig();
    return !!(cfg && cfg.hc90Enabled);
  } catch (e) {
    return true;
  }
}

// --- APPLY COLOR GRADING (simple fillRect, mobile-safe) ---
function applyHC90ColorGrading(ctx, level) {
  try {
    if (!ctx) return;
    if (!isHC90BackgroundEnabled()) return;
    var bgCfg;
    try {
      if (typeof getBackgroundConfig === 'function') bgCfg = getBackgroundConfig();
    } catch (e) { bgCfg = null; }
    if (bgCfg && !bgCfg.colorGradingEnabled) return;

    var theme = getBackgroundThemeForLevel(level);
    var grade = HC90_COLOR_GRADE[theme] || HC90_COLOR_GRADE.earth;
    var intensity = getHC90Intensity(level);
    var a = grade.a * (0.5 + intensity * 0.5);
    if (!isFinite(a) || a <= 0) return;

    // Mobile-safe: plain fillRect at low alpha (avoids expensive globalCompositeOperation)
    ctx.globalAlpha = Math.min(0.07, a);
    ctx.fillStyle = 'rgb(' + grade.r + ',' + grade.g + ',' + grade.b + ')';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  } catch (e) {
    // Silent fail — never break render
  }
}

// --- DRAW NEBULA OVERLAY (3-5 radial gradients per stage, cheap) ---
function drawHC90Nebula(ctx, level, time) {
  try {
    if (!ctx) return;
    if (!isHC90BackgroundEnabled()) return;
    var bgCfg;
    try {
      if (typeof getBackgroundConfig === 'function') bgCfg = getBackgroundConfig();
    } catch (e) { bgCfg = null; }
    if (bgCfg && !bgCfg.nebulaEnabled) return;

    var theme = getBackgroundThemeForLevel(level);
    var blobs = HC90_NEBULA[theme] || HC90_NEBULA.earth;
    var intensity = getHC90Intensity(level);

    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];
      var pulse = 0.9 + 0.1 * Math.sin(time * 0.0005 + i * 2.5);
      var cx = b.x * W;
      var cy = b.y * H;
      var maxR = Math.max(b.rx, b.ry);

      ctx.save();
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, b.c);
      grad.addColorStop(1, 'transparent');

      ctx.globalAlpha = b.a * pulse * (0.6 + intensity * 0.4);
      ctx.fillStyle = grad;
      ctx.translate(cx, cy);
      ctx.scale(b.rx / maxR, b.ry / maxR);
      ctx.beginPath();
      ctx.rect(-maxR, -maxR, maxR * 2, maxR * 2);
      ctx.fill();
      ctx.restore();
    }
  } catch (e) {
    // Silent fail — never break render
  }
}

// --- INIT HC-90 MULTI-LAYER STARFIELD ---
function initHC90Stars() {
  stars = [];

  var maxStars = 180;
  try {
    if (typeof getBackgroundConfig === 'function') {
      var bgCfg = getBackgroundConfig();
      if (bgCfg && typeof bgCfg.maxStars === 'number' && bgCfg.maxStars > 0) {
        maxStars = Math.min(300, Math.max(10, bgCfg.maxStars));
      }
    }
  } catch (e) { /* use default */ }

  // Distribute stars across 4 layers proportionally
  var layerRatios = [0.49, 0.34, 0.13, 0.04];
  var counts = [
    Math.max(10, Math.round(maxStars * layerRatios[0])),
    Math.max(8,  Math.round(maxStars * layerRatios[1])),
    Math.max(4,  Math.round(maxStars * layerRatios[2])),
    Math.max(2,  Math.round(maxStars * layerRatios[3]))
  ];

  function addLayer(count, speed, minSize, maxSize, colors, depthMin, depthMax) {
    for (var i = 0; i < count; i++) {
      var depth = depthMin + Math.random() * (depthMax - depthMin);
      var size = minSize + Math.random() * (maxSize - minSize);
      var color = colors[Math.floor(Math.random() * colors.length)];

      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: speed + (Math.random() - 0.5) * speed * 0.3,
        size: size,
        color: color,
        depth: depth,
        tw: Math.random() * 6.28,
        drift: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * 1000
      });
    }
  }

  // Layer 1: distant stars
  addLayer(counts[0], 0.3, 0.5, 1.0, ['#112244', '#113355', '#1a2040', '#152540'], 0.0, 0.15);

  // Layer 2: medium stars
  addLayer(counts[1], 1.0, 0.8, 1.5, ['#334466', '#445577', '#3a4a60', '#4a5070'], 0.2, 0.45);

  // Layer 3: close stars
  addLayer(counts[2], 3.0, 1.2, 2.5, ['#7788aa', '#8899bb', '#99aacc', '#aabbdd'], 0.5, 0.85);

  // Layer 4: bright specks
  addLayer(counts[3], 5.5, 2.0, 3.0, ['#ffffff', '#ffeeff', '#ffffee', '#eeffff'], 0.9, 1.0);
}

// --- HC-90 DEBUG STATS ---
function drawHC90BackgroundStats(ctx, level) {
  try {
    if (!ctx) return;
    var dbgCfg = {};
    try {
      if (typeof getHardcoreDebugConfig === 'function') dbgCfg = getHardcoreDebugConfig();
    } catch (e) { /* use empty */ }
    if (!dbgCfg.showBackgroundStats) return;

    var bgCfg = { hc90Enabled: true, nebulaEnabled: true, colorGradingEnabled: true, maxStars: 180 };
    try {
      if (typeof getBackgroundConfig === 'function') bgCfg = getBackgroundConfig();
    } catch (e) { /* use defaults */ }

    var panelX = 8;
    var panelY = 4;
    var lineH = 9;
    var y = panelY + 7;

    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.globalAlpha = 0.58;
    ctx.fillStyle = '#000';
    ctx.fillRect(panelX, panelY, 112, lineH * 6 + 8);
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, 112, lineH * 6 + 8);
    ctx.globalAlpha = 1;

    ctx.font = '6px "Press Start 2P"';

    var enabled = bgCfg.hc90Enabled;
    ctx.fillStyle = enabled ? '#0f0' : '#f44';
    ctx.fillText('HC90 BG ' + (enabled ? 'ON' : 'OFF'), panelX + 5, y); y += lineH;

    var starCount = (typeof stars !== 'undefined' && Array.isArray(stars)) ? stars.length : 0;
    ctx.fillStyle = '#ffb';
    ctx.fillText('STARS ' + starCount, panelX + 5, y); y += lineH;

    var theme = 'earth';
    try {
      if (typeof getBackgroundThemeForLevel === 'function') theme = getBackgroundThemeForLevel(level);
    } catch (e) { /* earth */ }
    ctx.fillStyle = '#8cf';
    ctx.fillText('STAGE ' + theme.toUpperCase(), panelX + 5, y); y += lineH;

    var intensity = getHC90Intensity(level);
    ctx.fillStyle = '#f8f';
    ctx.fillText('INTENSITY ' + intensity.toFixed(2), panelX + 5, y);

    ctx.restore();
  } catch (e) {
    // Silent fail
  }
}
