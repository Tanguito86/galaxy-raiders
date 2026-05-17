(function(global) {
  'use strict';

  var DEFAULT_CONFIG = {
    enabled: true,
    pressureSmoothingIn: 0.08,
    pressureSmoothingOut: 0.035,
    silenceOnDeathMs: 420,
    earlySilenceOnDeathMs: 320,
    earlySilenceMaxLevel: 5,
    silenceOnWaveClearMs: 900,
    spawnStaggerMs: 220,
    recentMemory: 12,
    levelResetPressureCarryMax: 0.45,
    maxStaggerDelayMs: 850,
    silenceMaxMs: 2000
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
    lastLevel: Math.max(1, global.level || 1),
    enabled: config.enabled !== false && global.ENCOUNTER_DIRECTOR_ENABLED !== false,
    recentRoles: [],
    lastRole: null,
    repeatedRoleCount: 0,
    roleRepeatCap: 3,
    lastStaggerDelay: 0,
    lastStaggerRole: null,
    lastStaggerGroupSize: 0,
    reliefActive: false,
    currentWavePersonality: 'balanced',
    recentPersonalities: [],
    lastPersonality: null,
    lastEliteDecision: { role: null, allowed: true, reason: '' },
    spawnPacingBias: 1,
    _wasBossActive: false,
    _wasReliefActive: false,
    reliefEnterCount: 0,
    silenceTriggerCount: 0,
    eliteDenyCount: 0,
    _waveClearSilenceCounted: false,
    lastTransition: ''
  };

  function getCfg(key) {
    if (config[key] !== undefined) return config[key];
    return DEFAULT_CONFIG[key];
  }

  // HC-141: safe config getters with validation
  function getNumCfg(key, min, max) {
    var def = DEFAULT_CONFIG[key];
    var raw = config[key];
    if (raw === undefined || raw === null) return def;
    var v = Number(raw);
    if (!isFinite(v) || isNaN(v)) return def;
    return clamp(v, min !== undefined ? min : -Infinity, max !== undefined ? max : Infinity);
  }

  function getIntCfg(key, min, max) {
    var def = DEFAULT_CONFIG[key];
    var raw = config[key];
    if (raw === undefined || raw === null) return def;
    var v = parseInt(raw, 10);
    if (!isFinite(v) || isNaN(v)) return def;
    return clamp(v, min !== undefined ? min : -Infinity, max !== undefined ? max : Infinity);
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
    if (enemy.type === 'alien2') return 'sniper';
    if (enemy.type === 'alien5') return 'kamikaze';
    if (enemy.type === 'alien3') return 'tank';
    if (enemy.type === 'alien6') return 'splitter';
    if (global.ENEMY_TYPES && global.ENEMY_TYPES[enemy.type] && global.ENEMY_TYPES[enemy.type].shoots) return 'shooter';
    return 'formation';
  }

  function pushRecent(list, payload) {
    list.push(payload);
    while (list.length > getIntCfg('recentMemory', 4, 60)) list.shift();
  }

  function getCurrentLevel() {
    return Math.max(1, global.level || 1);
  }

  function getSilenceOnDeathMs() {
    return getCurrentLevel() <= getIntCfg('earlySilenceMaxLevel', 1, 20)
      ? getNumCfg('earlySilenceOnDeathMs', 0, 2000)
      : getNumCfg('silenceOnDeathMs', 0, 3000);
  }

  function isFiniteNumber(value) {
    return typeof value === 'number' && isFinite(value);
  }

  function recountActiveRoles() {
    var counts = {
      dive: 0,
      external: 0,
      kamikaze: 0,
      sniper: 0,
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
    var level = getCurrentLevel();
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
    director.spawnCooldown = Math.max(director.spawnCooldown, getNumCfg('spawnStaggerMs', 0, 2000));

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

    director.silenceTimer = Math.min(getNumCfg('silenceMaxMs', 100, 5000), Math.max(director.silenceTimer, getSilenceOnDeathMs()));
    director.silenceTriggerCount++;
    recountActiveRoles();
    return true;
  }

  var ROTATION_MAP = {
    dive:     { alt: ['flanker', 'standard'], aggressive: true },
    sniper:   { alt: ['standard', 'flanker'], aggressive: true },
    kamikaze: { alt: ['standard'],              aggressive: true },
    flanker:  { alt: ['dive', 'standard'],      aggressive: false },
    external: { alt: ['standard'],              aggressive: true },
    standard: { alt: ['flanker', 'dive'],       aggressive: false }
  };

  function suggestEncounterRole(preferredRole, context) {
    if (!director.enabled) return preferredRole;

    context = context || {};
    if (context.isBoss || context.isSetPiece || context.isScripted) {
      return preferredRole;
    }

    var role = preferredRole || 'standard';
    var map = ROTATION_MAP[role] || { alt: ['standard'], aggressive: false };

    if (director.silenceTimer > 0 && map.aggressive) {
      return null;
    }

    if (director.pressure >= 0.82 && (role === 'sniper' || role === 'kamikaze')) {
      return 'standard';
    }

    // HC-127: personality rotation aggression bias
    var _aggressionCap = Math.round(director.roleRepeatCap * getPersonalityBias('rotationAggression'));
    var _effectiveCap = clamp(_aggressionCap, 2, 5);

    if (role === director.lastRole) {
      director.repeatedRoleCount++;
      pushRecent(director.recentRoles, { role: role, t: global.globalTime || 0 });
      if (director.repeatedRoleCount >= _effectiveCap) {
        var alt = map.alt[director.repeatedRoleCount % map.alt.length];
        director.lastRole = alt;
        director.repeatedRoleCount = 0;
        pushRecent(director.recentRoles, { role: alt, t: global.globalTime || 0, rotated: true });
        return alt;
      }
      return role;
    }

    director.lastRole = role;
    director.repeatedRoleCount = 1;
    pushRecent(director.recentRoles, { role: role, t: global.globalTime || 0 });
    return role;
  }

  var WAVE_PERSONALITIES = {
    balanced: { label: 'BALANCED', staggerMult: 1.00, diveBias: 0, silenceMult: 1.00, reliefMult: 1.00, rotationAggression: 1.00 },
    swarm:    { label: 'SWARM',    staggerMult: 0.78, diveBias: 0, silenceMult: 0.80, reliefMult: 1.10, rotationAggression: 1.15 },
    sniper:   { label: 'SNIPER',   staggerMult: 1.12, diveBias: -1, silenceMult: 1.15, reliefMult: 1.00, rotationAggression: 0.70 },
    pressure: { label: 'PRESSURE', staggerMult: 0.85, diveBias: 1,  silenceMult: 0.85, reliefMult: 0.80, rotationAggression: 1.40 },
    cleanup:  { label: 'CLEANUP',  staggerMult: 1.10, diveBias: 0, silenceMult: 0.75, reliefMult: 1.40, rotationAggression: 0.60 },
    flanker:  { label: 'FLANKER',  staggerMult: 0.90, diveBias: 0, silenceMult: 1.00, reliefMult: 1.05, rotationAggression: 1.10 }
  };

  function selectNextWavePersonality() {
    if (!director.enabled || isBossWindowActive()) {
      director.currentWavePersonality = 'balanced';
      return 'balanced';
    }

    var level = getCurrentLevel();
    var pool = ['swarm', 'sniper', 'pressure', 'cleanup', 'flanker', 'balanced'];

    // avoid last personality
    var last2 = director.recentPersonalities.slice(-2);
    var candidates = pool.filter(function(p) {
      return last2[last2.length - 1] !== p || director.recentPersonalities.length < 2;
    });
    if (candidates.length === 0) candidates = pool.slice();

    // deterministic-ish lean: level influences which personality is more likely
    var lean = pool[level % pool.length];
    var leanIdx = candidates.indexOf(lean);
    if (leanIdx >= 0 && Math.random() < 0.55) {
      director.currentWavePersonality = candidates[leanIdx];
    } else {
      director.currentWavePersonality = candidates[Math.floor(Math.random() * candidates.length)];
    }

    pushRecent(director.recentPersonalities, director.currentWavePersonality);
    director.lastPersonality = director.currentWavePersonality;
    return director.currentWavePersonality;
  }

  function getPersonalityBias(key) {
    var p = WAVE_PERSONALITIES[director.currentWavePersonality] || WAVE_PERSONALITIES.balanced;
    return p[key] !== undefined ? p[key] : 1;
  }

  function resetWavePersonality() {
    director.currentWavePersonality = 'balanced';
  }

  function shouldBypassStagger(context) {
    context = context || {};
    if (context.allowStagger === true || context.stagger === true) return false;
    if (context.isBoss || context.isSetPiece || context.isScripted) return true;
    return isBossWindowActive();
  }

  function getRoleStaggerBias(role) {
    if (role === 'dive' || role === 'kamikaze' || role === 'external' || role === 'sniper') return 34;
    if (role === 'tank' || role === 'splitter') return 20;
    if (role === 'formation' || role === 'standard' || role === 'flanker' || role === 'shooter') return 0;
    return 0;
  }

  function isKnownStaggerRole(role) {
    return role === 'dive' ||
      role === 'kamikaze' ||
      role === 'external' ||
      role === 'sniper' ||
      role === 'tank' ||
      role === 'splitter' ||
      role === 'formation' ||
      role === 'standard' ||
      role === 'flanker' ||
      role === 'shooter' ||
      role === 'default';
  }

  function getEncounterStaggerDelay(role, index, groupSize, context) {
    if (!director.enabled) return 0;
    if (typeof role !== 'string' || !role) return 0;
    if (!isKnownStaggerRole(role)) return 0;
    if (!isFiniteNumber(index) || !isFiniteNumber(groupSize)) return 0;

    index = Math.floor(index);
    groupSize = Math.floor(groupSize);
    if (index < 0 || groupSize < 1 || index >= groupSize) return 0;
    if (index === 0 || groupSize === 1) return 0;
    if (shouldBypassStagger(context)) return 0;

    var level = getCurrentLevel();
    var earlyScale = level <= getIntCfg('earlySilenceMaxLevel', 1, 20) ? 0.86 : 1;
    var pressureBias = clamp(director.pressure, 0, 1);
    var groupBias = clamp((groupSize - 2) / 4, 0, 1);
    var silenceBias = director.silenceTimer > 0 ? clamp(director.silenceTimer / 900, 0, 1) : 0;
    var roleBias = getRoleStaggerBias(role);

    var delay;
    if (index === 1) {
      delay = 180 + pressureBias * 48 + groupBias * 18 + silenceBias * 14 + roleBias * 0.25;
      delay = clamp(delay * earlyScale, 180, 260);
    } else if (index === 2) {
      delay = 320 + pressureBias * 118 + groupBias * 42 + silenceBias * 34 + roleBias * 0.7;
      delay = clamp(delay * earlyScale, 320, 520);
    } else {
      delay = 480 + (index - 3) * 110 + pressureBias * 170 + groupBias * 80 + silenceBias * 70 + roleBias;
      delay = clamp(delay * earlyScale, 0, getNumCfg('maxStaggerDelayMs', 100, 3000));
    }

    delay = Math.round(clamp(delay, 0, getNumCfg('maxStaggerDelayMs', 100, 3000)));
    delay = Math.round(clamp(delay * getPersonalityBias('staggerMult'), 0, getNumCfg('maxStaggerDelayMs', 100, 3000)));
    director.lastStaggerDelay = delay;
    director.lastStaggerRole = role;
    director.lastStaggerGroupSize = groupSize;
    return delay;
  }

  function canSpawnRoleInternal(role, consumeCooldown) {
    if (!director.enabled) return true;
    if (isBossWindowActive()) return true;
    if (!role) return true;
    if (director.silenceTimer > 0) return false;
    if (director.spawnCooldown > 0) return false;

    var counts = director.activeRoles || {};
    var activeCount = counts[role] || 0;
    if (activeCount >= getRoleCap(role)) return false;

    if (role === 'dive' && director.pressure >= clamp(0.82 - getPersonalityBias('diveBias') * 0.06, 0.70, 0.90)) return false;
    if (role === 'external' && director.pressure >= 0.75) return false;
    if (role === 'kamikaze' && director.pressure >= 0.7) return false;

    if (consumeCooldown) {
      director.spawnCooldown = Math.max(director.spawnCooldown, getNumCfg('spawnStaggerMs', 0, 2000));
    }
    return true;
  }

  function canSpawnRole(role) {
    return canSpawnRoleInternal(role, true);
  }

  function peekCanSpawnRole(role) {
    return canSpawnRoleInternal(role, false);
  }

  function resetEncounterDirectorForLevel(nextLevel) {
    var level = Math.max(1, nextLevel || global.level || 1);
    director.lastLevel = level;
    director.trackedAliveIds = {};
    director.recentSpawns = [];
    director.recentDeaths = [];
    director.recentRoles = [];
    director.lastRole = null;
    director.repeatedRoleCount = 0;
    director.lastStaggerDelay = 0;
    director.lastStaggerRole = null;
    director.lastStaggerGroupSize = 0;
    director.reliefActive = false;
    director.spawnPacingBias = 1;
    director._wasBossActive = false;
    director._wasReliefActive = false;
    director.reliefEnterCount = 0;
    director.silenceTriggerCount = 0;
    director.eliteDenyCount = 0;
    director._waveClearSilenceCounted = false;
    director.lastTransition = '';
    director.currentWavePersonality = 'balanced';
    director.recentPersonalities = [];
    director.lastPersonality = null;
    director.spawnCooldown = 0;
    director.silenceTimer = 0;
    director.pressure = Math.min(director.pressure, getNumCfg('levelResetPressureCarryMax', 0, 1));
    director.targetPressure = Math.min(director.targetPressure, director.pressure);
    recountActiveRoles();
  }

  function detectLevelChange() {
    var level = getCurrentLevel();
    if (level === director.lastLevel) return;
    resetEncounterDirectorForLevel(level);
  }

  function updateEncounterDirector(dt) {
    if (!director.enabled) return director.pressure;

    dt = Math.max(0, dt || 0);
    detectLevelChange();

    // HC-140: boss transition — soft-reset pressure and clear cooldowns
    var _bossNow = isBossWindowActive();
    if (_bossNow && !director._wasBossActive) {
      director.lastTransition = 'boss-enter';
      director.currentWavePersonality = 'balanced';
      director.spawnCooldown = 0;
      director.silenceTimer = 0;
      director.pressure = Math.min(director.pressure, 0.35);
      director.spawnPacingBias = 1;
    } else if (!_bossNow && director._wasBossActive) {
      director.lastTransition = 'boss-exit';
    }
    director._wasBossActive = _bossNow;

    syncTrackedEnemies();
    recountActiveRoles();

    // HC-127: personality-biased silence decay (faster for swarm/cleanup, slower for sniper)
    if (director.silenceTimer > 0) {
      var _silenceDecay = dt * (1 / getPersonalityBias('silenceMult'));
      director.silenceTimer = Math.max(0, director.silenceTimer - _silenceDecay);
    }
    if (director.spawnCooldown > 0) director.spawnCooldown = Math.max(0, director.spawnCooldown - dt);

    var aliveCount = 0;
    if (Array.isArray(global.enemies)) {
      for (var i = 0; i < global.enemies.length; i++) {
        if (global.enemies[i] && global.enemies[i].alive) aliveCount++;
      }
    }
    if (!isBossWindowActive() && aliveCount === 0) {
      director.silenceTimer = Math.min(getNumCfg('silenceMaxMs', 100, 5000), Math.max(director.silenceTimer, getNumCfg('silenceOnWaveClearMs', 0, 5000)));
      if (!director._waveClearSilenceCounted) {
        director.silenceTriggerCount++;
        director._waveClearSilenceCounted = true;
      }
    } else if (aliveCount > 0) {
      director._waveClearSilenceCounted = false;
    }

    director.targetPressure = computeTargetPressure();

    var smoothing = director.targetPressure >= director.pressure
      ? getNumCfg('pressureSmoothingIn', 0.001, 1)
      : getNumCfg('pressureSmoothingOut', 0.001, 1);

    // HC-125K: pressure relief — accelerate decay when calm
    director.reliefActive = false;
    if (director.pressure >= 0.70 && director.targetPressure < director.pressure) {
      var dives = director.activeRoles.dive || 0;
      var bullets = Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0;
      if (dives === 0 && bullets <= 6) {
        smoothing = Math.min(getNumCfg('pressureSmoothingIn', 0.001, 1), smoothing * 2.2 * getPersonalityBias('reliefMult'));
        director.reliefActive = true;
      }
    }

    var normalizedDt = clamp(dt / 16.6667, 0, 3);
    director.pressure += (director.targetPressure - director.pressure) * smoothing * normalizedDt;
    director.pressure = clamp(director.pressure, 0, 1);

    // HC-139: spawn pacing bias — modulates stagger timing (pressure only; personality/relief already in chain)
    director.spawnPacingBias = 1;
    if (director.pressure >= 0.70) director.spawnPacingBias *= 1.14;
    if (director.reliefActive && !director._wasReliefActive) {
      director.reliefEnterCount++;
    }
    director._wasReliefActive = director.reliefActive;

    director.spawnPacingBias = clamp(director.spawnPacingBias, 0.85, 1.30);

    return director.pressure;
  }

  function canCoordinateEliteAction(role, enemy, context) {
    var _default = { role: role, allowed: true, reason: '' };
    if (!director.enabled) return true;

    context = context || {};
    if (context.isBoss || context.isSetPiece || context.isScripted) return true;

    role = role || '';
    var personality = director.currentWavePersonality || 'balanced';

    // silence blocks all aggressive actions
    if (director.silenceTimer > 0) {
      var _aggressive = role === 'sniper' || role === 'kamikaze' || role === 'diver';
      if (_aggressive) {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'silence' };
        director.eliteDenyCount++;
        return false;
      }
    }

    // high pressure: prevent toxic overlaps
    if (director.pressure >= 0.82) {
      var roles = director.activeRoles || {};
      if (role === 'sniper' && (roles.sniper || 0) > 0) {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'sniper overlap' };
        director.eliteDenyCount++;
        return false;
      }
      if (role === 'kamikaze' && ((roles.dive || 0) > 0 || (roles.kamikaze || 0) > 0)) {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'kamikaze+dive overlap' };
        director.eliteDenyCount++;
        return false;
      }
      if (role === 'diver' && ((roles.kamikaze || 0) > 0 || (roles.dive || 0) >= 2)) {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'diver+kamikaze overlap' };
        director.eliteDenyCount++;
        return false;
      }
    }

    // cleanup personality: extra conservative
    if (personality === 'cleanup') {
      if (role === 'kamikaze' || role === 'sniper') {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'cleanup conservative' };
        director.eliteDenyCount++;
        return false;
      }
      if (role === 'diver' && director.pressure >= 0.55) {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'cleanup dive cap' };
        director.eliteDenyCount++;
        return false;
      }
    }

    // pressure personality: allow more but cap overlaps
    if (personality === 'pressure') {
      var _roles = director.activeRoles || {};
      if (role === 'diver' && (_roles.dive || 0) >= 3) {
        director.lastEliteDecision = { role: role, allowed: false, reason: 'pressure dive cap' };
        director.eliteDenyCount++;
        return false;
      }
    }

    director.lastEliteDecision = { role: role, allowed: true, reason: '' };
    return true;
  }

  global.updateEncounterDirector = updateEncounterDirector;
  global.registerEnemySpawn = registerEnemySpawn;
  global.registerEnemyDeath = registerEnemyDeath;
  global.canSpawnRole = canSpawnRole;
  global.peekCanSpawnRole = peekCanSpawnRole;
  global.suggestEncounterRole = suggestEncounterRole;
  global.getEncounterStaggerDelay = getEncounterStaggerDelay;
  global.selectNextWavePersonality = selectNextWavePersonality;
  global.getCurrentWavePersonality = function() { return director.currentWavePersonality; };
  global.resetWavePersonality = resetWavePersonality;
  global.canCoordinateEliteAction = canCoordinateEliteAction;
  global.resetEncounterDirectorForLevel = resetEncounterDirectorForLevel;
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
      recentDeathCount: director.recentDeaths.length,
      silenceOnDeathMs: getSilenceOnDeathMs(),
      lastRole: director.lastRole,
      repeatedRoleCount: director.repeatedRoleCount,
      lastStaggerDelay: director.lastStaggerDelay,
      lastStaggerRole: director.lastStaggerRole,
      lastStaggerGroupSize: director.lastStaggerGroupSize,
      reliefActive: director.reliefActive,
      currentWavePersonality: director.currentWavePersonality,
      lastEliteDecision: director.lastEliteDecision,
      spawnPacingBias: parseFloat(director.spawnPacingBias.toFixed(3)),
      lastTransition: director.lastTransition,
      reliefEnterCount: director.reliefEnterCount,
      silenceTriggerCount: director.silenceTriggerCount,
      eliteDenyCount: director.eliteDenyCount
    };
  };

  // HC-134: safe telemetry snapshot for playtests/debug
  global.getEncounterDirectorSnapshot = function() {
    var enemies = Array.isArray(global.enemies) ? global.enemies : [];
    var bullets = Array.isArray(global.enemyBullets) ? global.enemyBullets : [];
    var aliveCount = 0;
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i] && enemies[i].alive) aliveCount++;
    }

    return {
      level: global.level || 0,
      waveType: (typeof global.getWaveType === 'function') ? global.getWaveType(global.level || 1) : '?',
      currentWavePersonality: director.currentWavePersonality,
      pressure: parseFloat(director.pressure.toFixed(4)),
      targetPressure: parseFloat(director.targetPressure.toFixed(4)),
      silenceTimer: director.silenceTimer,
      spawnCooldown: director.spawnCooldown,
      reliefActive: director.reliefActive,
      activeRoles: Object.assign({}, director.activeRoles),
      recentSpawns: director.recentSpawns.length,
      recentDeaths: director.recentDeaths.length,
      recentRoles: director.recentRoles.slice(-6),
      lastEliteDecision: Object.assign({}, director.lastEliteDecision),
      lastStaggerDelay: director.lastStaggerDelay,
      lastStaggerRole: director.lastStaggerRole,
      enemyCount: aliveCount,
      bulletCount: bullets.length,
      enabled: director.enabled,
      silenceOnDeathMs: getSilenceOnDeathMs(),
      repeatedRoleCount: director.repeatedRoleCount,
      spawnPacingBias: parseFloat(director.spawnPacingBias.toFixed(3)),
      lastTransition: director.lastTransition,
      reliefEnterCount: director.reliefEnterCount,
      silenceTriggerCount: director.silenceTriggerCount,
      eliteDenyCount: director.eliteDenyCount
    };
  };

  global.printEncounterDirectorSnapshot = function() {
    if (typeof console !== 'undefined' && console.table) {
      console.table([global.getEncounterDirectorSnapshot()]);
    }
  };

  // HC-135: dev-only session capture
  var _captureInterval = null;
  var _captureData = [];
  var _captureMax = 1800;

  global.startEncounterDirectorCapture = function(intervalMs, maxSnapshots) {
    if (_captureInterval) return;
    var ms = (typeof intervalMs === 'number' && intervalMs > 0) ? intervalMs : 1000;
    _captureMax = (typeof maxSnapshots === 'number' && maxSnapshots > 0) ? maxSnapshots : 1800;
    _captureData = [];
    _captureInterval = setInterval(function() {
      if (typeof global.getEncounterDirectorSnapshot === 'function') {
        _captureData.push(global.getEncounterDirectorSnapshot());
        while (_captureData.length > _captureMax) _captureData.shift();
      }
    }, ms);
  };

  global.stopEncounterDirectorCapture = function() {
    if (_captureInterval) {
      clearInterval(_captureInterval);
      _captureInterval = null;
    }
  };

  global.isEncounterDirectorCapturing = function() {
    return !!_captureInterval;
  };

  global.getEncounterDirectorCaptureReport = function() {
    var data = _captureData;
    if (!data.length) return { snapshots: 0, message: 'no data captured' };

    var pressures = [], silences = [], enemies = [], bullets = [], densities = [];
    var personalities = {};
    var sniperSnapshots = 0;
    var cleanupSnapshots = 0;
    for (var i = 0; i < data.length; i++) {
      var s = data[i];
      pressures.push(s.pressure || 0);
      silences.push(s.silenceTimer || 0);
      enemies.push(s.enemyCount || 0);
      bullets.push(s.bulletCount || 0);
      densities.push((s.enemyCount || 0) + (s.bulletCount || 0));
      var p = s.currentWavePersonality || '?';
      personalities[p] = (personalities[p] || 0) + 1;
      if (s.activeRoles && (s.activeRoles.sniper || 0) > 0) sniperSnapshots++;
      if (s.currentWavePersonality === 'cleanup') cleanupSnapshots++;
    }

    var last = data[data.length - 1] || {};

    var last5 = data.slice(-5).map(function(s) {
      return { pressure: s.pressure, personality: s.currentWavePersonality, enemies: s.enemyCount, bullets: s.bulletCount };
    });

    return {
      duration: data.length + ' snapshots',
      snapshots: data.length,
      avgPressure: parseFloat((pressures.reduce(function(a,b){return a+b;},0) / pressures.length).toFixed(4)),
      peakPressure: parseFloat(Math.max.apply(null, pressures).toFixed(4)),
      pressure: {
        min: parseFloat(Math.min.apply(null, pressures).toFixed(4)),
        max: parseFloat(Math.max.apply(null, pressures).toFixed(4)),
        avg: parseFloat((pressures.reduce(function(a,b){return a+b;},0) / pressures.length).toFixed(4))
      },
      reliefCount: last.reliefEnterCount || 0,
      silenceCount: last.silenceTriggerCount || 0,
      avgDensity: parseFloat((densities.reduce(function(a,b){return a+b;},0) / densities.length).toFixed(2)),
      eliteOverlapWindows: last.eliteDenyCount || 0,
      sniperUptime: data.length ? parseFloat((sniperSnapshots / data.length * 100).toFixed(1)) : 0,
      cleanupDuration: cleanupSnapshots,
      silenceMax: Math.max.apply(null, silences),
      enemyMax: Math.max.apply(null, enemies),
      bulletMax: Math.max.apply(null, bullets),
      personalities: personalities,
      lastSnapshots: last5
    };
  };
})(window);
