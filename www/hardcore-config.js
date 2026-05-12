// ====================================
// GALAXY RAIDERS - hardcore-config.js
// Helpers seguros para leer GALAXY_CONFIG
// ====================================

var _GALAXY_CONFIG_DEFAULTS = {
  hardcore:  { enabled: false },
  player:    { hardcoreHitRadius: 3, showHitbox: false },
  graze:     { enabled: false, radius: 24, score: 100 },
  rank:      { enabled: false, baseLevel: 0 },
  bullets:   { enemyGlow: false, bossGlow: false },
  score:     { comboEnabled: false },
  debug:     { showHardcoreInfo: false }
};

function getGalaxyConfig() {
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return _GALAXY_CONFIG_DEFAULTS;
  return cfg;
}

function isHardcoreEnabled() {
  var cfg = getGalaxyConfig();
  return !!(cfg.hardcore && cfg.hardcore.enabled);
}

function getHardcorePlayerConfig() {
  var cfg = getGalaxyConfig();
  var p = (cfg.player && typeof cfg.player === 'object') ? cfg.player : _GALAXY_CONFIG_DEFAULTS.player;
  var hr = (typeof p.hardcoreHitRadius === 'number') ? p.hardcoreHitRadius : _GALAXY_CONFIG_DEFAULTS.player.hardcoreHitRadius;
  var sh = (typeof p.showHitbox === 'boolean') ? p.showHitbox : _GALAXY_CONFIG_DEFAULTS.player.showHitbox;
  return { hardcoreHitRadius: hr, showHitbox: sh };
}

function getGrazeConfig() {
  var cfg = getGalaxyConfig();
  var g = (cfg.graze && typeof cfg.graze === 'object') ? cfg.graze : _GALAXY_CONFIG_DEFAULTS.graze;
  var en = (typeof g.enabled === 'boolean') ? g.enabled : _GALAXY_CONFIG_DEFAULTS.graze.enabled;
  var ra = (typeof g.radius === 'number') ? g.radius : _GALAXY_CONFIG_DEFAULTS.graze.radius;
  var sc = (typeof g.score === 'number') ? g.score : _GALAXY_CONFIG_DEFAULTS.graze.score;
  return { enabled: en, radius: ra, score: sc };
}

function getRankConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : _GALAXY_CONFIG_DEFAULTS.rank;
  var en = (typeof r.enabled === 'boolean') ? r.enabled : _GALAXY_CONFIG_DEFAULTS.rank.enabled;
  var bl = (typeof r.baseLevel === 'number') ? r.baseLevel : _GALAXY_CONFIG_DEFAULTS.rank.baseLevel;
  return { enabled: en, baseLevel: bl };
}

function getHardcoreBulletConfig() {
  var cfg = getGalaxyConfig();
  var b = (cfg.bullets && typeof cfg.bullets === 'object') ? cfg.bullets : _GALAXY_CONFIG_DEFAULTS.bullets;
  var eg = (typeof b.enemyGlow === 'boolean') ? b.enemyGlow : _GALAXY_CONFIG_DEFAULTS.bullets.enemyGlow;
  var bg = (typeof b.bossGlow === 'boolean') ? b.bossGlow : _GALAXY_CONFIG_DEFAULTS.bullets.bossGlow;
  return { enemyGlow: eg, bossGlow: bg };
}

function getHardcoreScoreConfig() {
  var cfg = getGalaxyConfig();
  var sc = (cfg.score && typeof cfg.score === 'object') ? cfg.score : _GALAXY_CONFIG_DEFAULTS.score;
  var ce = (typeof sc.comboEnabled === 'boolean') ? sc.comboEnabled : _GALAXY_CONFIG_DEFAULTS.score.comboEnabled;
  return { comboEnabled: ce };
}

function getHardcoreDebugConfig() {
  var cfg = getGalaxyConfig();
  var d = (cfg.debug && typeof cfg.debug === 'object') ? cfg.debug : _GALAXY_CONFIG_DEFAULTS.debug;
  var si = (typeof d.showHardcoreInfo === 'boolean') ? d.showHardcoreInfo : _GALAXY_CONFIG_DEFAULTS.debug.showHardcoreInfo;
  return { showHardcoreInfo: si };
}

// ============================================================
// HARDCORE HITBOX — helpers de colision y render
// ============================================================

function __hardcoreSafePlayer() {
  return (typeof player !== 'undefined' && player && typeof player.x === 'number');
}

function isHardcoreHitboxActive() {
  if (!isHardcoreEnabled()) return false;
  if (!__hardcoreSafePlayer()) return false;
  return true;
}

function getPlayerHitCenter() {
  if (!__hardcoreSafePlayer()) return { x: 0, y: 0 };
  return {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2
  };
}

function checkPlayerCollisionAABB(ox, oy, ow, oh) {
  if (!__hardcoreSafePlayer()) return false;

  if (!isHardcoreHitboxActive()) {
    return ox < player.x + player.width &&
           ox + ow > player.x &&
           oy < player.y + player.height &&
           oy + oh > player.y;
  }

  var cfg = getHardcorePlayerConfig();
  var r = cfg.hardcoreHitRadius;
  var cx = player.x + player.width / 2;
  var cy = player.y + player.height / 2;
  var closestX = ox < cx ? (ox + ow < cx ? ox + ow : cx) : (ox > cx ? ox : cx);
  var closestY = oy < cy ? (oy + oh < cy ? oy + oh : cy) : (oy > cy ? oy : cy);
  var dx = cx - closestX;
  var dy = cy - closestY;
  return (dx * dx + dy * dy) < (r * r);
}

function checkPlayerCollisionCircle(ox, oy, oRadius, normalPlayerRadius) {
  if (!__hardcoreSafePlayer()) return false;

  var playerR;
  if (isHardcoreHitboxActive()) {
    playerR = getHardcorePlayerConfig().hardcoreHitRadius;
  } else {
    playerR = (typeof normalPlayerRadius === 'number') ? normalPlayerRadius : 12;
  }

  var cx = player.x + player.width / 2;
  var cy = player.y + player.height / 2;
  var dx = cx - ox;
  var dy = cy - oy;
  var combined = playerR + oRadius;
  return (dx * dx + dy * dy) < (combined * combined);
}

function drawHardcorePlayerHitbox(ctx) {
  if (!ctx) return;
  var cfg = getHardcorePlayerConfig();
  if (!cfg.showHitbox) return;
  if (!isHardcoreHitboxActive()) return;

  var center = getPlayerHitCenter();
  var r = cfg.hardcoreHitRadius;

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  ctx.restore();
}

// ============================================================
// HARDCORE GRAZE — sistema de roce de balas
// ============================================================

var _hardcoreGrazeCount = 0;

function isGrazeActive() {
  if (!isHardcoreEnabled()) return false;
  var g = getGrazeConfig();
  return !!g.enabled;
}

function getGrazeCount() {
  return _hardcoreGrazeCount;
}

function resetGrazeCount() {
  _hardcoreGrazeCount = 0;
}

function checkBulletGraze(b) {
  if (!b) return false;
  if (b.grazed) return false;
  if (!isGrazeActive()) return false;
  if (!__hardcoreSafePlayer()) return false;

  var g = getGrazeConfig();
  var center = getPlayerHitCenter();

  // Distancia minima entre rectangulo de bala y centro del jugador
  var closestX = b.x < center.x ? (b.x + b.w < center.x ? b.x + b.w : center.x) : (b.x > center.x ? b.x : center.x);
  var closestY = b.y < center.y ? (b.y + b.h < center.y ? b.y + b.h : center.y) : (b.y > center.y ? b.y : center.y);
  var dx = center.x - closestX;
  var dy = center.y - closestY;

  if ((dx * dx + dy * dy) < (g.radius * g.radius)) {
    b.grazed = true;
    return true;
  }
  return false;
}

function registerGraze(bulletRef) {
  _hardcoreGrazeCount++;
  var g = getGrazeConfig();

  if (typeof addScore === 'function') {
    addScore(g.score);
  }

  if (typeof spawnPopup === 'function') {
    var gx = bulletRef ? bulletRef.x + (bulletRef.w || 0) / 2 : player.x + player.width / 2;
    var gy = bulletRef ? bulletRef.y : player.y;
    spawnPopup(gx, gy, 'GRAZE', '#ffd966');
  }
}

function drawHardcoreGrazeHUD(ctx) {
  if (!ctx) return;
  if (!isGrazeActive()) return;

  var cfg = getGrazeConfig();
  var x = 128;
  var y = 56;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'right';
  ctx.font = '6px "Press Start 2P"';
  ctx.fillStyle = 'rgba(255,217,102,0.78)';
  ctx.fillText('GRAZE', x + 44, y);
  ctx.textAlign = 'right';
  ctx.font = '7px "Press Start 2P"';
  ctx.fillStyle = '#fff';
  ctx.fillText(_hardcoreGrazeCount, x + 44, y + 12);
  ctx.restore();
}
