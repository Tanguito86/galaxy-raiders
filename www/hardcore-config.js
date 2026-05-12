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
