(function(global) {
  'use strict';

  var DEFAULT_CONFIG = {
    enabled: true,
    pressureSmoothingIn: 0.08,
    pressureSmoothingOut: 0.035,
    silenceOnDeathMs: 420,
    silenceOnWaveClearMs: 900,
    spawnStaggerMs: 220,
    recentMemory: 12
  };

  var config = global.ENCOUNTER_DIRECTOR_CONFIG || {};
  var director = {
    pressure: 0,
    targetPressure: 0,
    silenceTimer: 0,
    spawnCooldown: 0,
    activeRoles: {},
    recentSpawns: [],
    recentDeaths: [],
    trackedEnemies: [],
    trackedAliveIds: {},
    nextEnemyId: 1,
    enabled: config.enabled !== false && global.ENCOUNTER_DIRECTOR_ENABLED !== false
  };

  function getCfg(key) {
    if (config[key] !== undefined) return config[key];
    return DEFAULT_CONFIG[key];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isBossWindowActive() {
    return !!(global.boss && global.boss.active);
  }

  function ensureEnemyId(enemy) {
    if (!enemy || typeof enemy !== 'object') return null;
    if (!enemy._encounterDirectorId) {
      enemy._encounterDirectorId = director.nextEnemyId++;
    }
    return enemy._encounterDirectorId;
  }

  function inferRole(enemy) {
    if (!enemy) return 'default';
    if (enemy.diving) return 'dive';
    if (enemy.isExternalShmup) return 'external';
    if (enemy.type === 'alien5') return 'kamikaze';
    if (enemy.type === 'alien3') return 'tank';
    if (enemy.type === 'alien6') return 'splitter';
    if (global.ENEMY_TYPES && global.ENEMY_TYPES[enemy.type] && global.ENEMY_TYPES[enemy.type].shoots) return 'shooter';
    return 'formation';
  }

  function pushRecent(list, payload) {
    list.push(payload);
    while (list.length > getCfg('recentMemory')) list.shift();
  }

  function recountActiveRoles() {
    var counts = {
      dive: 0,
      external: 0,
      kamikaze: 0,
      tank: 0,
      shooter: 0,
      splitter: 0,
      formation: 0
    };

    var allEnemies = Array.isArray(global.enemies) ? global.enemies : [];
    for (var i = 0; i < allEnemies.length; i++) {
      var enemy = allEnemies[i];
      if (!enemy || !enemy.alive) continue;
      counts[inferRole(enemy)] = (counts[inferRole(enemy)] || 0) + 1;
    }

    director.activeRoles = counts;
  }

  function computeTargetPressure() {
    if (!director.enabled || isBossWindowActive()) return 0;

    var allEnemies = Array.isArray(global.enemies) ? global.enemies : [];
    var alive = 0;
    var diving = 0;
    var externals = 0;
    var fastThreats = 0;

    for (var i = 0; i < allEnemies.length; i++) {
      var enemy = allEnemies[i];
      if (!enemy || !enemy.alive) continue;
      alive++;
      if (enemy.diving) diving++;
      if (enemy.isExternalShmup) externals++;
      if (enemy.type === 'alien4' || enemy.type === 'alien5') fastThreats++;
    }

    var bulletCount = Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0;
    var aliveWeight = clamp(alive / 18, 0, 1);
    var diveWeight = clamp(diving / 3, 0, 1);
    var externalWeight = clamp(externals / 2, 0, 1);
    var bulletWeight = clamp(bulletCount / 14, 0, 1);
    var fastWeight = clamp(fastThreats / 6, 0, 1);

    return clamp(
      aliveWeight * 0.38 +
      diveWeight * 0.26 +
      bulletWeight * 0.18 +
      externalWeight * 0.10 +
      fastWeight * 0.08,
      0,
      1
    );
  }

  function getRoleCap(role) {
    var level = Math.max(1, global.level || 1);
    if (role === 'dive') return level >= 14 ? 3 : level >= 7 ? 2 : 1;
    if (role === 'external') return level >= 10 ? 2 : 1;
    if (role === 'kamikaze') return level >= 12 ? 2 : 1;
    if (role === 'tank') return 4;
    if (role === 'splitter') return 4;
    if (role === 'shooter') return 99;
    return 99;
  }

  function syncTrackedEnemies() {
    var allEnemies = Array.isArray(global.enemies) ? global.enemies : [];
    for (var i = 0; i < allEnemies.length; i++) {
      var enemy = allEnemies[i];
      if (!enemy || !enemy.alive) continue;
      if (enemy._encounterDirectorTracked) continue;
      global.registerEnemySpawn(enemy);
    }
  }

  function registerEnemySpawn(enemy) {
    if (!enemy || typeof enemy !== 'object') return false;

    var id = ensureEnemyId(enemy);
    if (id === null) return false;

    enemy._encounterDirectorTracked = true;
    enemy._encounterDirectorDeathRegistered = false;
    director.trackedAliveIds[id] = true;
    director.spawnCooldown = Math.max(director.spawnCooldown, getCfg('spawnStaggerMs'));

    pushRecent(director.recentSpawns, {
      id: id,
      type: enemy.type || 'unknown',
      role: inferRole(enemy),
      t: global.globalTime || 0
    });

    recountActiveRoles();
    return true;
  }

  function registerEnemyDeath(enemy) {
    if (!enemy || typeof enemy !== 'object') return false;

    var id = ensureEnemyId(enemy);
    if (id === null || enemy._encounterDirectorDeathRegistered) return false;

    enemy._encounterDirectorDeathRegistered = true;
    delete director.trackedAliveIds[id];

    pushRecent(director.recentDeaths, {
      id: id,
      type: enemy.type || 'unknown',
      role: inferRole(enemy),
      t: global.globalTime || 0
    });

    director.silenceTimer = Math.max(director.silenceTimer, getCfg('silenceOnDeathMs'));
    recountActiveRoles();
    return true;
  }

  function canSpawnRole(role) {
    if (!director.enabled) return true;
    if (isBossWindowActive()) return true;
    if (!role) return true;
    if (director.silenceTimer > 0) return false;
    if (director.spawnCooldown > 0) return false;

    var counts = director.activeRoles || {};
    var activeCount = counts[role] || 0;
    if (activeCount >= getRoleCap(role)) return false;

    if (role === 'dive' && director.pressure >= 0.82) return false;
    if (role === 'external' && director.pressure >= 0.75) return false;
    if (role === 'kamikaze' && director.pressure >= 0.7) return false;

    director.spawnCooldown = Math.max(director.spawnCooldown, getCfg('spawnStaggerMs'));
    return true;
  }

  function updateEncounterDirector(dt) {
    if (!director.enabled) return director.pressure;

    dt = Math.max(0, dt || 0);
    syncTrackedEnemies();
    recountActiveRoles();

    if (director.silenceTimer > 0) director.silenceTimer = Math.max(0, director.silenceTimer - dt);
    if (director.spawnCooldown > 0) director.spawnCooldown = Math.max(0, director.spawnCooldown - dt);

    var aliveCount = 0;
    if (Array.isArray(global.enemies)) {
      for (var i = 0; i < global.enemies.length; i++) {
        if (global.enemies[i] && global.enemies[i].alive) aliveCount++;
      }
    }
    if (!isBossWindowActive() && aliveCount === 0) {
      director.silenceTimer = Math.max(director.silenceTimer, getCfg('silenceOnWaveClearMs'));
    }

    director.targetPressure = computeTargetPressure();

    var smoothing = director.targetPressure >= director.pressure
      ? getCfg('pressureSmoothingIn')
      : getCfg('pressureSmoothingOut');
    var normalizedDt = clamp(dt / 16.6667, 0, 3);
    director.pressure += (director.targetPressure - director.pressure) * smoothing * normalizedDt;
    director.pressure = clamp(director.pressure, 0, 1);

    return director.pressure;
  }

  global.updateEncounterDirector = updateEncounterDirector;
  global.registerEnemySpawn = registerEnemySpawn;
  global.registerEnemyDeath = registerEnemyDeath;
  global.canSpawnRole = canSpawnRole;
  global.getCurrentPressure = function() { return director.pressure; };
  global.isSilenceWindowActive = function() { return director.enabled && director.silenceTimer > 0; };
  global.getEncounterDirectorState = function() {
    return {
      enabled: director.enabled,
      pressure: director.pressure,
      targetPressure: director.targetPressure,
      silenceTimer: director.silenceTimer,
      spawnCooldown: director.spawnCooldown,
      activeRoles: Object.assign({}, director.activeRoles),
      recentSpawnCount: director.recentSpawns.length,
      recentDeathCount: director.recentDeaths.length
    };
  };
})(window);
