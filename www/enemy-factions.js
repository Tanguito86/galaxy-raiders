// =====================
// GALAXY RAIDERS - enemy-factions.js
// HC-VS-05: Enemy faction visual identity system
// Load AFTER enemy-identity.js, BEFORE render-entities.js
// =====================

// =====================
// FACTION DEFINITIONS
// =====================

var ENEMY_FACTIONS = {
  // SCOUT INTERCEPTOR — fast, agile, harassment
  scout: {
    name: 'Scout Interceptor',
    role: 'harassment',
    // Cool blue/cyan family — reads as "fast and precise"
    primaryColor: '#4488cc',
    secondaryColor: '#66aaee',
    accentColor: '#aaddff',
    outlineColor: '#1a3355',
    // Motion: bouncy, erratic, high idle amplitude
    idleAmpX: 1.8,
    idleAmpY: 2.2,
    idleFreq: 3.2,
    // Silhouette: small diamond/arrow — reads as "agile"
    silhouette: 'diamond',
    scaleBoost: 1.15,
    // FX: quick flashes, cyan sparks
    hitFlashColor: '#aaddff',
    deathSparkColor: '#88ccff',
    // Telegraph: thin cyan line
    telegraphColor: '#66bbee',
    // Bullet style
    bulletStyle: 'fast'
  },

  // SUPPRESSOR — tanky, heavy, area denial
  suppressor: {
    name: 'Suppressor',
    role: 'area_denial',
    // Red/orange family — reads as "dangerous and durable"
    primaryColor: '#dd4422',
    secondaryColor: '#ee6644',
    accentColor: '#ffaa66',
    outlineColor: '#552211',
    // Motion: slow, heavy wobble
    idleAmpX: 0.8,
    idleAmpY: 0.9,
    idleFreq: 1.6,
    // Silhouette: wide rectangle — reads as "heavy"
    silhouette: 'rectangle',
    scaleBoost: 1.0,
    // FX: heavy flashes, orange sparks
    hitFlashColor: '#ffaa66',
    deathSparkColor: '#ff8844',
    // Telegraph: thick orange line
    telegraphColor: '#ee6633',
    // Bullet style
    bulletStyle: 'tank'
  },

  // SPLITTER — tricky, multiplying, lateral
  splitter: {
    name: 'Splitter Flanker',
    role: 'flanking',
    // Magenta/purple family — reads as "dangerous and unpredictable"
    primaryColor: '#cc44aa',
    secondaryColor: '#dd66cc',
    accentColor: '#ee88ee',
    outlineColor: '#441133',
    // Motion: pulsing, lateral
    idleAmpX: 1.5,
    idleAmpY: 1.3,
    idleFreq: 2.8,
    // Silhouette: wide with gaps — reads as "fragmenting"
    silhouette: 'wide_gap',
    scaleBoost: 1.1,
    // FX: pulsing flashes, magenta sparks
    hitFlashColor: '#ee88ee',
    deathSparkColor: '#cc66aa',
    // Telegraph: magenta pulse line
    telegraphColor: '#cc55bb',
    // Bullet style
    bulletStyle: 'splitter'
  },

  // IMPERIAL ELITE — boss-tier, commanding, late-game
  imperial: {
    name: 'Imperial Elite',
    role: 'authority',
    // White/gold family — reads as "commanding and dangerous"
    primaryColor: '#ffdd88',
    secondaryColor: '#ffcc44',
    accentColor: '#ffeecc',
    outlineColor: '#443311',
    // Motion: slow, deliberate, minimal idle
    idleAmpX: 0.3,
    idleAmpY: 0.4,
    idleFreq: 1.2,
    // Silhouette: large, complex — reads as "important"
    silhouette: 'complex',
    scaleBoost: 1.0,
    // FX: golden flashes, white sparks
    hitFlashColor: '#ffeecc',
    deathSparkColor: '#ffdd44',
    // Telegraph: golden pulse
    telegraphColor: '#ffcc33',
    // Bullet style
    bulletStyle: 'boss'
  }
};

// =====================
// ENEMY TYPE → FACTION MAPPING
// =====================

var ENEMY_FACTION_MAP = {
  alien1: 'scout',
  alien2: 'scout',
  alien4: 'scout',
  alien5: 'scout',
  alien_mini: 'scout',
  alien3: 'suppressor',
  alien6: 'splitter'
};

// Bosses are imperial
function getBossFaction() { return 'imperial'; }

function getEnemyFaction(type) {
  if (!type) return null;
  return ENEMY_FACTION_MAP[type] || null;
}

function getEnemyFactionData(type) {
  var key = getEnemyFaction(type);
  if (!key) return null;
  return ENEMY_FACTIONS[key];
}

function getFactionColor(type, which) {
  var fd = getEnemyFactionData(type);
  if (!fd) return null;
  if (which === 'primary') return fd.primaryColor;
  if (which === 'secondary') return fd.secondaryColor;
  if (which === 'accent') return fd.accentColor;
  if (which === 'outline') return fd.outlineColor;
  if (which === 'hit') return fd.hitFlashColor;
  if (which === 'death') return fd.deathSparkColor;
  if (which === 'telegraph') return fd.telegraphColor;
  return fd.primaryColor;
}

function getFactionIdleParams(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return { ampX: 1.0, ampY: 1.0, freq: 2.5 };
  return { ampX: fd.idleAmpX, ampY: fd.idleAmpY, freq: fd.idleFreq };
}

function getFactionScale(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return 1.0;
  return fd.scaleBoost;
}

function getFactionBulletStyle(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return 'basic';
  return fd.bulletStyle;
}

function getFactionName(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return 'Unknown';
  return fd.name;
}

function getFactionSilhouette(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return 'unknown';
  return fd.silhouette;
}

// =====================
// FACTION VISUAL RENDERING HELPERS
// =====================

// Draw a faction-colored outline/silhouette behind the enemy
// Called during enemy draw to reinforce faction identity
function drawFactionSilhouette(ctx, enemy, alpha) {
  if (!ctx || !enemy) return;
  var type = enemy.type;
  if (!type) return;
  var fd = getEnemyFactionData(type);
  if (!fd) return;

  var cx = enemy.x + (enemy.w || 24) / 2;
  var cy = enemy.y + (enemy.h || 24) / 2;
  var a = alpha || 0.15;

  ctx.save();
  ctx.globalAlpha = a;

  switch (fd.silhouette) {
    case 'diamond':
      // Scout: sharp diamond shape
      var r = (enemy.w || 24) * 0.6;
      ctx.fillStyle = fd.primaryColor;
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.7, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.7, cy);
      ctx.closePath();
      ctx.fill();
      break;

    case 'rectangle':
      // Suppressor: wide rectangle
      var rw = (enemy.w || 30) * 0.55;
      var rh = (enemy.h || 24) * 0.55;
      ctx.fillStyle = fd.primaryColor;
      ctx.fillRect(cx - rw, cy - rh, rw * 2, rh * 2);
      break;

    case 'wide_gap':
      // Splitter: two blocks with gap
      var bw = (enemy.w || 33) * 0.22;
      var bh = (enemy.h || 24) * 0.55;
      ctx.fillStyle = fd.primaryColor;
      ctx.fillRect(cx - bw * 2.5, cy - bh, bw, bh * 2);
      ctx.fillRect(cx + bw * 1.5, cy - bh, bw, bh * 2);
      break;

    case 'complex':
      // Imperial: hexagon
      var ir = (enemy.w || 24) * 0.55;
      ctx.fillStyle = fd.primaryColor;
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var angle = Math.PI / 3 * i - Math.PI / 6;
        var px = cx + Math.cos(angle) * ir;
        var py = cy + Math.sin(angle) * ir;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.restore();
}

// Draw faction identity marker (small icon above enemy)
function drawFactionMarker(ctx, enemy) {
  if (!ctx || !enemy || !enemy.alive) return;
  var type = enemy.type;
  if (!type) return;
  var fd = getEnemyFactionData(type);
  if (!fd) return;

  var cx = enemy.x + (enemy.w || 24) / 2;
  var cy = enemy.y - 6;
  var pulse = 1 + Math.sin((typeof globalTime !== 'undefined' ? globalTime : Date.now()) * 0.004) * 0.3;

  ctx.save();
  ctx.globalAlpha = 0.35 * pulse;

  // Small faction dot
  ctx.fillStyle = fd.accentColor;
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Faction color ring
  ctx.strokeStyle = fd.primaryColor;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// =====================
// FACTION-BASED DEATH FX
// =====================

function getFactionDeathParticleCount(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return 18;
  switch (fd.silhouette) {
    case 'diamond': return 14;
    case 'rectangle': return 22;
    case 'wide_gap': return 20;
    case 'complex': return 28;
    default: return 18;
  }
}

function getFactionDeathRingRadius(type) {
  var fd = getEnemyFactionData(type);
  if (!fd) return 3;
  switch (fd.silhouette) {
    case 'diamond': return 2;
    case 'rectangle': return 5;
    case 'wide_gap': return 4;
    case 'complex': return 6;
    default: return 3;
  }
}
