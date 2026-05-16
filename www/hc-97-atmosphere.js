// =====================
// HC-97 STAGE ATMOSPHERE PASS
// space dust · speed lines · ambient flashes · per chapter variation
// =====================

// --- ATMOSPHERIC COLOR PALETTES PER CHAPTER ---
var HC97_ATMOSPHERE = {
  earth:      { dust: ['#8899cc','#aabbee','#7788bb','#99aadd'], flash: '#4477cc', flashA: 0.015, line: '#aaccff', lineA: 0.04 },
  atmosphere: { dust: ['#8877bb','#9999cc','#7766aa','#aaaadd'], flash: '#6644aa', flashA: 0.018, line: '#bbaadd', lineA: 0.05 },
  orbit:      { dust: ['#996688','#aa7799','#885577','#bb88aa'], flash: '#773388', flashA: 0.020, line: '#cc88bb', lineA: 0.06 },
  deepSpace:  { dust: ['#772233','#883344','#661122','#994455'], flash: '#551122', flashA: 0.022, line: '#bb4455', lineA: 0.07 },
  imperial:   { dust: ['#882211','#993322','#771100','#aa3322'], flash: '#661008', flashA: 0.025, line: '#cc4422', lineA: 0.08 }
};

// --- SPACE DUST PARTICLES (static pool, animated purely by time) ---
var HC97_DUST = [];
(function _initHC97Dust() {
  for (var d = 0; d < 20; d++) {
    HC97_DUST.push({
      x: Math.random() * 360,
      y: Math.random() * 640,
      speed: 0.08 + Math.random() * 0.25,
      size: 0.5 + Math.random() * 1.2,
      phase: Math.random() * 1000,
      tw: Math.random() * 6.28,
      drift: (Math.random() - 0.5) * 0.35,
      layer: Math.floor(Math.random() * 3)
    });
  }
})();

// --- SPEED LINE SLOTS (pre-allocated for zero alloc) ---
var HC97_SPEED_LINES = [];
(function _initHC97SpeedLines() {
  for (var l = 0; l < 8; l++) {
    HC97_SPEED_LINES.push({
      x: Math.random() * 360,
      y: -20 - Math.random() * 300,
      len: 20 + Math.random() * 50,
      speed: 1.5 + Math.random() * 3.5,
      width: 0.5 + Math.random() * 1.0,
      phase: Math.random() * 1000,
      angle: (Math.random() - 0.5) * 0.3
    });
  }
})();

// --- DRAW HC-97 ATMOSPHERIC EFFECTS ---
function drawHC97Atmosphere(ctx, level, time) {
  if (state !== 'playing' && state !== 'paused') return;
  if (!ctx) return;

  var theme = 'earth';
  try {
    if (typeof getBackgroundThemeForLevel === 'function') theme = getBackgroundThemeForLevel(level);
  } catch (e) { /* earth */ }
  var atm = HC97_ATMOSPHERE[theme] || HC97_ATMOSPHERE.earth;
  var intensity = (typeof getHC90Intensity === 'function') ? getHC90Intensity(level) : Math.min(1, level / 20);

  ctx.save();

  // --- 1. AMBIENT FLASH (very subtle, periodic) ---
  var flashCycle = Math.sin(time * 0.0004) * 0.5 + 0.5;
  var flashAlpha = atm.flashA * flashCycle * (0.3 + intensity * 0.7);
  if (flashAlpha > 0.005) {
    ctx.globalAlpha = flashAlpha;
    ctx.fillStyle = atm.flash;
    ctx.fillRect(0, 0, 360, 640);
  }

  // --- 2. SPACE DUST ---
  var dustLen = HC97_DUST.length;
  for (var di = 0; di < dustLen; di++) {
    var d = HC97_DUST[di];
    var dy = (d.y + time * 0.01 * d.speed * (0.6 + intensity * 0.4)) % 700 - 30;
    var dx = d.x + Math.sin(time * 0.0008 + d.phase) * d.drift * 12;
    if (dx < -5) dx += 370;
    if (dx > 365) dx -= 370;

    var dustAlpha = d.layer === 0 ? 0.06 : d.layer === 1 ? 0.10 : 0.15;
    dustAlpha *= 0.5 + 0.5 * Math.sin(time * 0.002 + d.tw);

    if (dustAlpha > 0.02) {
      ctx.globalAlpha = dustAlpha;
      ctx.fillStyle = atm.dust[d.layer % atm.dust.length];
      ctx.fillRect(Math.floor(dx), Math.floor(dy), Math.ceil(d.size), Math.ceil(d.size));
    }
  }

  // --- 3. SPEED LINES ---
  var linesLen = HC97_SPEED_LINES.length;
  var warpFactor = (typeof warpSpeed !== 'undefined') ? Math.min(4, Math.max(1, warpSpeed)) : 1;
  for (var li = 0; li < linesLen; li++) {
    var l = HC97_SPEED_LINES[li];
    var ly = (l.y + time * 0.06 * l.speed * warpFactor * (0.5 + intensity * 0.5)) % 740 - 40;
    if (ly < -30 || ly > 670) continue;

    var lx = l.x + Math.sin(time * 0.001 + l.phase) * 15;
    var angle = l.angle;
    var cosA = Math.cos(angle);
    var sinA = Math.sin(angle);
    var halfLen = l.len * 0.5 * (0.6 + intensity * 0.4);

    var lineAlpha = atm.lineA * (0.5 + warpFactor * 0.15) * (0.5 + intensity * 0.5);
    if (lineAlpha > 0.005) {
      ctx.globalAlpha = lineAlpha;
      ctx.strokeStyle = atm.line;
      ctx.lineWidth = l.width;
      ctx.beginPath();
      ctx.moveTo(lx - cosA * halfLen, ly - sinA * halfLen);
      ctx.lineTo(lx + cosA * halfLen, ly + sinA * halfLen);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
