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
