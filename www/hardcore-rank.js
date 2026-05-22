// ====================================
// GALAXY RAIDERS - hardcore-rank.js
// HC-25: Dynamic Rank Foundation
// Sistema de rank dinamico hardcore
// ====================================

// Estado interno del rank
var _hardcoreRank = {
  value: 0,
  level: 1,
  multiplier: 1.00,
  lastReason: '',
  lastChangeAt: 0,
  lastDecayAt: 0,
  lastLevel: 1,
  levelChangedAt: 0,
  levelChangeDirection: ''
};

// ============================================================
// HC-RK-02: PLAYER PERFORMANCE TRACKING
// Mide skill real sin aplicar dificultad.
// ============================================================

var _hardcoreRankPerformance = {
  // Survival (hitless) tracking
  lastHitAt: 0,              // globalTime of last hit/death
  hitlessDurationMs: 0,      // ms of continuous hitless play
  longestHitlessMs: 0,       // best streak this run

  // Performance state machine
  performanceState: 'RECOVERING',  // DOMINATING | SURVIVING | RECOVERING
  performanceStateEnteredAt: 0,    // globalTime when entered current state
  lastStateChangeAt: 0,

  // Accuracy tracking (rolling window)
  accuracyWindowShots: 0,
  accuracyWindowHits: 0,
  accuracyPercent: 0,
  accuracyLastCheckedAt: 0,

  // Wave clear speed
  waveStartedAt: 0,
  waveClearedCount: 0,
  fastestWaveMs: 0,
  lastWaveMs: 0,

  // Survival rank accumulation
  lastSurvivalAwardAt: 0,    // last globalTime survival rank was awarded

  // Source breakdown telemetry
  rankFromKills: 0,
  rankFromSurvival: 0,
  rankFromAccuracy: 0,
  rankFromBossPhases: 0,
  rankFromBossClears: 0,
  rankFromGraze: 0,
  rankFromWaveSpeed: 0,
  rankLostFromDeaths: 0,
  rankLostFromDecay: 0
};

// Lectura segura de la config de rank desde GALAXY_CONFIG
function _hardcoreRankReadConfig() {
  return getRankConfig();
}

function _hardcoreRankIsEnabled() {
  return _hardcoreRankReadConfig().enabled;
}

// Calcular nivel a partir del valor (0-100)
function _hardcoreRankCalcLevel(val) {
  if (typeof val !== 'number' || val <= 0) return 1;
  if (val >= 100) return 5;
  if (val < 20) return 1;
  if (val < 40) return 2;
  if (val < 60) return 3;
  if (val < 80) return 4;
  return 5;
}

// Calcular multiplicador a partir del nivel
function _hardcoreRankCalcMultiplier(lvl) {
  var map = [0, 1.00, 1.12, 1.25, 1.37, 1.50];
  var idx = Math.min(5, Math.max(1, (typeof lvl === 'number') ? lvl : 1));
  return map[idx];
}

// Recalcular nivel y multiplicador desde el valor actual
function _hardcoreRankRecalc() {
  _hardcoreRank.value = Math.max(0, Math.min(100, _hardcoreRank.value));
  var newLevel = Math.max(1, Math.min(5, _hardcoreRankCalcLevel(_hardcoreRank.value)));
  if (newLevel !== _hardcoreRank.lastLevel) {
    _hardcoreRank.levelChangeDirection = newLevel > _hardcoreRank.lastLevel ? 'up' : 'down';
    _hardcoreRank.lastLevel = newLevel;
    _hardcoreRank.levelChangedAt = Date.now();

    if (typeof AudioEngine !== 'undefined' && AudioEngine && typeof AudioEngine.playSfx === 'function') {
      AudioEngine.playSfx(_hardcoreRank.levelChangeDirection === 'up' ? 'rankUp' : 'rankDown');
    }
  }
  _hardcoreRank.level = newLevel;
  _hardcoreRank.multiplier = Math.max(1.00, Math.min(1.50, _hardcoreRankCalcMultiplier(_hardcoreRank.level)));
}

// ============================================================
// HELPERS GLOBALES SEGUROS
// ============================================================

window.getHardcoreRankState = function() {
  return {
    value: _hardcoreRank.value,
    level: _hardcoreRank.level,
    multiplier: _hardcoreRank.multiplier,
    lastReason: _hardcoreRank.lastReason,
    lastChangeAt: _hardcoreRank.lastChangeAt
  };
};

window.getHardcoreRankValue = function() {
  return _hardcoreRank.value;
};

window.getHardcoreRankLevel = function() {
  return _hardcoreRank.level;
};

window.getHardcoreRankMultiplier = function() {
  return _hardcoreRank.multiplier;
};

window.isHardcoreRankActive = function() {
  if (typeof isHardcoreEnabled !== 'function') return false;
  if (!isHardcoreEnabled()) return false;
  return _hardcoreRankIsEnabled();
};

window.addHardcoreRank = function(amount, reason) {
  if (!_hardcoreRankIsEnabled()) return;
  var amt = (typeof amount === 'number' && amount > 0) ? amount : 0;
  if (amt <= 0) return;
  _hardcoreRank.value = Math.min(100, _hardcoreRank.value + amt);
  if (reason && typeof reason === 'string') _hardcoreRank.lastReason = reason;
  _hardcoreRank.lastChangeAt = Date.now();
  _hardcoreRankRecalc();
};

window.reduceHardcoreRank = function(amount, reason) {
  if (!_hardcoreRankIsEnabled()) return;
  var amt = (typeof amount === 'number' && amount > 0) ? amount : 0;
  if (amt <= 0) return;
  _hardcoreRank.value = Math.max(0, _hardcoreRank.value - amt);
  if (reason && typeof reason === 'string') _hardcoreRank.lastReason = reason;
  _hardcoreRank.lastChangeAt = Date.now();
  _hardcoreRankRecalc();
};

window.resetHardcoreRank = function() {
  _hardcoreRank.value = 0;
  _hardcoreRank.level = 1;
  _hardcoreRank.multiplier = 1.00;
  _hardcoreRank.lastReason = '';
  _hardcoreRank.lastChangeAt = 0;
  _hardcoreRank.lastDecayAt = 0;
  _hardcoreRank.lastLevel = 1;
  _hardcoreRank.levelChangedAt = 0;
  _hardcoreRank.levelChangeDirection = '';

  // HC-RK-02: reset performance tracking
  _hardcoreRankPerformance.lastHitAt = 0;
  _hardcoreRankPerformance.hitlessDurationMs = 0;
  _hardcoreRankPerformance.longestHitlessMs = 0;
  _hardcoreRankPerformance.performanceState = 'RECOVERING';
  _hardcoreRankPerformance.performanceStateEnteredAt = 0;
  _hardcoreRankPerformance.lastStateChangeAt = 0;
  _hardcoreRankPerformance.accuracyWindowShots = 0;
  _hardcoreRankPerformance.accuracyWindowHits = 0;
  _hardcoreRankPerformance.accuracyPercent = 0;
  _hardcoreRankPerformance.accuracyLastCheckedAt = 0;
  _hardcoreRankPerformance.waveStartedAt = 0;
  _hardcoreRankPerformance.waveClearedCount = 0;
  _hardcoreRankPerformance.fastestWaveMs = 0;
  _hardcoreRankPerformance.lastWaveMs = 0;
  _hardcoreRankPerformance.lastSurvivalAwardAt = 0;
  _hardcoreRankPerformance.rankFromKills = 0;
  _hardcoreRankPerformance.rankFromSurvival = 0;
  _hardcoreRankPerformance.rankFromAccuracy = 0;
  _hardcoreRankPerformance.rankFromBossPhases = 0;
  _hardcoreRankPerformance.rankFromBossClears = 0;
  _hardcoreRankPerformance.rankFromGraze = 0;
  _hardcoreRankPerformance.rankFromWaveSpeed = 0;
  _hardcoreRankPerformance.rankLostFromDeaths = 0;
  _hardcoreRankPerformance.rankLostFromDecay = 0;
};



// ============================================================
// HC-RK-02: PERFORMANCE TRACKING — CONFIG
// ============================================================

function _hardcoreRankPerfReadConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : {};
  return {
    survivalRankIntervalMs: (typeof r.survivalRankIntervalMs === 'number') ? r.survivalRankIntervalMs : 5000,
    survivalRankAmount: (typeof r.survivalRankAmount === 'number') ? r.survivalRankAmount : 0.4,
    accuracyCheckIntervalMs: (typeof r.accuracyCheckIntervalMs === 'number') ? r.accuracyCheckIntervalMs : 4000,
    accuracyBonusThreshold: (typeof r.accuracyBonusThreshold === 'number') ? r.accuracyBonusThreshold : 65,
    accuracyBonusAmount: (typeof r.accuracyBonusAmount === 'number') ? r.accuracyBonusAmount : 0.3,
    waveSpeedBonusAmount: (typeof r.waveSpeedBonusAmount === 'number') ? r.waveSpeedBonusAmount : 0.5,
    dominatingHitlessMs: (typeof r.dominatingHitlessMs === 'number') ? r.dominatingHitlessMs : 15000,
    recoveringMs: (typeof r.recoveringMs === 'number') ? r.recoveringMs : 5000
  };
}

// ============================================================
// HC-RK-02: PERFORMANCE STATE MACHINE
// ============================================================

// DOMINATING : hitless > 15s, no recent damage
// SURVIVING  : past recovery window, taking occasional hits
// RECOVERING : just got hit (< 5s ago)

function _hardcoreRankUpdatePerformanceState(now) {
  var perf = _hardcoreRankPerformance;
  var cfg = _hardcoreRankPerfReadConfig();
  var timeSinceHit = (perf.lastHitAt > 0) ? Math.max(0, now - perf.lastHitAt) : 0;

  var newState = perf.performanceState;

  if (typeof now !== 'number' || now <= 0) {
    newState = 'RECOVERING';
  } else if (timeSinceHit < cfg.recoveringMs) {
    newState = 'RECOVERING';
  } else if (timeSinceHit >= cfg.dominatingHitlessMs) {
    newState = 'DOMINATING';
  } else {
    newState = 'SURVIVING';
  }

  if (newState !== perf.performanceState) {
    perf.performanceState = newState;
    perf.performanceStateEnteredAt = now;
    perf.lastStateChangeAt = Date.now();
  }
}

// ============================================================
// HC-RK-02: EVENT HOOKS — called from game systems
// ============================================================

// Called when player takes a hit / loses a life
window.recordHardcoreRankHit = function(now) {
  if (!_hardcoreRankIsEnabled()) return;
  var t = (typeof now === 'number' && now > 0) ? now : (typeof globalTime === 'number' ? globalTime : Date.now());
  _hardcoreRankPerformance.lastHitAt = t;
  _hardcoreRankPerformance.hitlessDurationMs = 0;
  _hardcoreRankPerformance.lastSurvivalAwardAt = 0;
  _hardcoreRankPerformance.rankLostFromDeaths += _hardcoreRankPerformance.rankLostFromDeaths ? 0 : 0;
};

// Called when player fires a shot
window.recordHardcoreRankShotFired = function(count) {
  if (!_hardcoreRankIsEnabled()) return;
  var n = (typeof count === 'number' && count > 0) ? count : 1;
  _hardcoreRankPerformance.accuracyWindowShots += n;
};

// Called when a shot hits an enemy/boss
window.recordHardcoreRankShotHit = function(count) {
  if (!_hardcoreRankIsEnabled()) return;
  var n = (typeof count === 'number' && count > 0) ? count : 1;
  _hardcoreRankPerformance.accuracyWindowHits += n;
};

// Called when a wave starts (new enemies spawning)
window.recordHardcoreRankWaveStart = function(now) {
  if (!_hardcoreRankIsEnabled()) return;
  var t = (typeof now === 'number' && now > 0) ? now : (typeof globalTime === 'number' ? globalTime : Date.now());
  _hardcoreRankPerformance.waveStartedAt = t;
};

// Called when a wave is cleared (all enemies dead)
window.recordHardcoreRankWaveClear = function(now) {
  if (!_hardcoreRankIsEnabled()) return;
  var t = (typeof now === 'number' && now > 0) ? now : (typeof globalTime === 'number' ? globalTime : Date.now());
  _hardcoreRankPerformance.waveClearedCount++;

  if (_hardcoreRankPerformance.waveStartedAt > 0 && t > _hardcoreRankPerformance.waveStartedAt) {
    var waveMs = t - _hardcoreRankPerformance.waveStartedAt;
    _hardcoreRankPerformance.lastWaveMs = waveMs;

    if (_hardcoreRankPerformance.fastestWaveMs <= 0 || waveMs < _hardcoreRankPerformance.fastestWaveMs) {
      _hardcoreRankPerformance.fastestWaveMs = waveMs;
    }

    // Wave speed bonus: award rank for clearing waves fast
    var cfg = _hardcoreRankPerfReadConfig();
    if (waveMs < 30000 && _hardcoreRankPerformance.performanceState !== 'RECOVERING') {
      var bonus = cfg.waveSpeedBonusAmount;
      if (waveMs < 15000) bonus *= 1.5;
      _hardcoreRankPerformance.rankFromWaveSpeed += bonus;
      if (typeof window.addHardcoreRank === 'function') {
        window.addHardcoreRank(bonus, 'wave_speed');
      }
    }
  }
};

// ============================================================
// HC-RK-02: PERFORMANCE UPDATE — called each frame
// ============================================================

window.updateHardcoreRankPerformance = function(dt, now) {
  if (!_hardcoreRankIsEnabled()) return;
  if (typeof state === 'undefined' || state !== 'playing') return;
  if (!player || typeof player.hp !== 'number' || player.hp <= 0) return;
  if (typeof invincibleTimer !== 'undefined' && invincibleTimer > 0) return;

  var t = (typeof now === 'number' && now > 0) ? now : (typeof globalTime === 'number' ? globalTime : Date.now());
  var cfg = _hardcoreRankPerfReadConfig();

  // Initialize if first frame
  if (_hardcoreRankPerformance.lastHitAt <= 0) {
    _hardcoreRankPerformance.lastHitAt = t;
  }

  // 1. Update hitless duration
  _hardcoreRankPerformance.hitlessDurationMs = Math.max(0, t - _hardcoreRankPerformance.lastHitAt);
  if (_hardcoreRankPerformance.hitlessDurationMs > _hardcoreRankPerformance.longestHitlessMs) {
    _hardcoreRankPerformance.longestHitlessMs = _hardcoreRankPerformance.hitlessDurationMs;
  }

  // 2. Update performance state
  _hardcoreRankUpdatePerformanceState(t);

  // 3. Survival rank bonus — periodic award while DOMINATING
  if (_hardcoreRankPerformance.performanceState === 'DOMINATING') {
    if (_hardcoreRankPerformance.lastSurvivalAwardAt <= 0 ||
        (t - _hardcoreRankPerformance.lastSurvivalAwardAt) >= cfg.survivalRankIntervalMs) {
      _hardcoreRankPerformance.lastSurvivalAwardAt = t;
      _hardcoreRankPerformance.rankFromSurvival += cfg.survivalRankAmount;
      if (typeof window.addHardcoreRank === 'function') {
        window.addHardcoreRank(cfg.survivalRankAmount, 'survival');
      }
    }
  }

  // 4. Accuracy bonus — periodic check
  if (_hardcoreRankPerformance.accuracyLastCheckedAt <= 0 ||
      (t - _hardcoreRankPerformance.accuracyLastCheckedAt) >= cfg.accuracyCheckIntervalMs) {
    _hardcoreRankPerformance.accuracyLastCheckedAt = t;

    var totalShots = _hardcoreRankPerformance.accuracyWindowShots;
    if (totalShots > 0) {
      _hardcoreRankPerformance.accuracyPercent =
        (_hardcoreRankPerformance.accuracyWindowHits / totalShots) * 100;

      if (_hardcoreRankPerformance.accuracyPercent >= cfg.accuracyBonusThreshold) {
        _hardcoreRankPerformance.rankFromAccuracy += cfg.accuracyBonusAmount;
        if (typeof window.addHardcoreRank === 'function') {
          window.addHardcoreRank(cfg.accuracyBonusAmount, 'accuracy');
        }
      }
    }

    // Reset rolling window
    _hardcoreRankPerformance.accuracyWindowShots = 0;
    _hardcoreRankPerformance.accuracyWindowHits = 0;
  }
};

// ============================================================
// HC-RK-02: PERFORMANCE STATE — exposure
// ============================================================

window.getHardcoreRankPerformanceState = function() {
  _hardcoreRankUpdatePerformanceState(
    typeof globalTime === 'number' ? globalTime : Date.now()
  );
  return {
    performanceState: _hardcoreRankPerformance.performanceState,
    hitlessDurationMs: _hardcoreRankPerformance.hitlessDurationMs,
    longestHitlessMs: _hardcoreRankPerformance.longestHitlessMs,
    accuracyPercent: _hardcoreRankPerformance.accuracyPercent,
    waveClearedCount: _hardcoreRankPerformance.waveClearedCount,
    fastestWaveMs: _hardcoreRankPerformance.fastestWaveMs,
    lastWaveMs: _hardcoreRankPerformance.lastWaveMs,
    rankFromKills: _hardcoreRankPerformance.rankFromKills,
    rankFromSurvival: _hardcoreRankPerformance.rankFromSurvival,
    rankFromAccuracy: _hardcoreRankPerformance.rankFromAccuracy,
    rankFromBossPhases: _hardcoreRankPerformance.rankFromBossPhases,
    rankFromBossClears: _hardcoreRankPerformance.rankFromBossClears,
    rankFromGraze: _hardcoreRankPerformance.rankFromGraze,
    rankFromWaveSpeed: _hardcoreRankPerformance.rankFromWaveSpeed,
    rankLostFromDeaths: _hardcoreRankPerformance.rankLostFromDeaths,
    rankLostFromDecay: _hardcoreRankPerformance.rankLostFromDecay
  };
};

window.getHardcoreRankPerformanceLabel = function() {
  return _hardcoreRankPerformance.performanceState;
};

// ============================================================
// HC-RK-02: TELEMETRY SNAPSHOT
// ============================================================

window.getHardcoreRankTelemetrySnapshot = function() {
  return {
    rank: {
      value: _hardcoreRank.value,
      level: _hardcoreRank.level,
      multiplier: _hardcoreRank.multiplier,
      lastReason: _hardcoreRank.lastReason,
      lastChangeAt: _hardcoreRank.lastChangeAt
    },
    performance: window.getHardcoreRankPerformanceState(),
    timestamp: Date.now()
  };
};

// ============================================================
// HC-37: RANK DECAY
// ============================================================

function _hardcoreRankDecayReadConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : {};
  return {
    decayDelayMs: (typeof r.decayDelayMs === 'number') ? r.decayDelayMs : 6000,
    decayAmount: (typeof r.decayAmount === 'number') ? r.decayAmount : 0.15,
    decayIntervalMs: (typeof r.decayIntervalMs === 'number') ? r.decayIntervalMs : 1000
  };
}

window.updateHardcoreRankDecay = function() {
  if (!_hardcoreRankIsEnabled()) return;
  if (_hardcoreRank.value <= 0) return;

  var now = Date.now();
  var decayCfg = _hardcoreRankDecayReadConfig();
  var minDecayAt = _hardcoreRank.lastChangeAt + decayCfg.decayDelayMs;
  if (now < minDecayAt) {
    _hardcoreRank.lastDecayAt = 0;
    return;
  }

  if (_hardcoreRank.lastDecayAt <= 0) {
    _hardcoreRank.lastDecayAt = now;
    return;
  }

  if (now - _hardcoreRank.lastDecayAt < decayCfg.decayIntervalMs) return;

  _hardcoreRank.lastDecayAt = now;
  _hardcoreRank.value = Math.max(0, _hardcoreRank.value - decayCfg.decayAmount);
  _hardcoreRank.lastReason = 'rank_decay';
  _hardcoreRank.lastChangeAt = now;
  _hardcoreRankRecalc();
};

// ============================================================
// HC-27: MODIFICADORES DE DIFICULTAD POR RANK
// ============================================================

window.getHardcoreRankBulletSpeedMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;
  var m = _hardcoreRank.multiplier;
  if (typeof m !== 'number') return 1.00;
  return 1.00 + (m - 1.00) * 0.24;
};

window.getHardcoreRankCooldownMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;
  var m = _hardcoreRank.multiplier;
  if (typeof m !== 'number') return 1.00;
  return 1.00 - (m - 1.00) * 0.24;
};

window.getHardcoreRankPatternIntensity = function() {
  if (!_hardcoreRankIsEnabled()) return 1;
  var m = _hardcoreRank.multiplier;
  if (typeof m !== 'number') return 1;
  var val = Math.round(1 + (m - 1.00) * 2.0);
  return Math.max(1, Math.min(2, val));
};

window.getHardcoreRankScoreMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;
  var lvl = _hardcoreRank.level;
  if (typeof lvl !== 'number') return 1.00;
  var map = [0, 1.00, 1.10, 1.20, 1.35, 1.50];
  var idx = Math.min(5, Math.max(1, lvl));
  return map[idx];
};

// ============================================================
// HUD DEBUG OPCIONAL
// ============================================================

function drawHardcoreRankDebug(ctx) {
  if (!ctx) return;
  var cfg = getGalaxyConfig();
  var dbg = (cfg.debug && typeof cfg.debug === 'object') ? cfg.debug : {};
  if (!dbg.showRank) return;
  if (typeof H === 'undefined') return;

  var bulletMult = (typeof window.getHardcoreRankBulletSpeedMultiplier === 'function')
    ? window.getHardcoreRankBulletSpeedMultiplier() : 1.00;
  var cdMult = (typeof window.getHardcoreRankCooldownMultiplier === 'function')
    ? window.getHardcoreRankCooldownMultiplier() : 1.00;
  var scoreMult = (typeof window.getHardcoreRankScoreMultiplier === 'function')
    ? window.getHardcoreRankScoreMultiplier() : 1.00;
  var reason = (_hardcoreRank.lastReason && typeof _hardcoreRank.lastReason === 'string' && _hardcoreRank.lastReason.length > 0)
    ? _hardcoreRank.lastReason : '-';

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '6px "Press Start 2P"';

  ctx.fillStyle = 'rgba(255,165,0,0.88)';
  ctx.fillText('RANK L' + _hardcoreRank.level, 6, H - 69);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.fillText('VALUE ' + _hardcoreRank.value.toFixed(1), 6, H - 58);

  ctx.fillStyle = 'rgba(255,200,100,0.72)';
  ctx.fillText('BULLET x' + bulletMult.toFixed(2), 6, H - 47);

  ctx.fillStyle = 'rgba(100,200,255,0.72)';
  ctx.fillText('CD x' + cdMult.toFixed(2), 6, H - 36);

  ctx.fillStyle = 'rgba(255,255,150,0.78)';
  ctx.fillText('SCORE x' + scoreMult.toFixed(2), 6, H - 25);

  ctx.fillStyle = 'rgba(200,200,200,0.55)';
  ctx.fillText('LAST ' + reason, 6, H - 14);

  ctx.restore();
}

// ============================================================
// HC-41: RANK LEVEL CHANGE FEEDBACK
// ============================================================

function drawHardcoreRankLevelFeedback(ctx) {
  if (!ctx) return;
  if (typeof H === 'undefined' || typeof W === 'undefined') return;
  if (_hardcoreRank.levelChangedAt <= 0) return;

  var now = Date.now();
  var elapsed = now - _hardcoreRank.levelChangedAt;
  if (elapsed >= 900) return;

  var fadeAlpha = 1.0 - (elapsed / 900);
  var isUp = _hardcoreRank.levelChangeDirection === 'up';
  var text = isUp ? 'RANK UP L' + _hardcoreRank.lastLevel : 'RANK DOWN L' + _hardcoreRank.lastLevel;
  var color = isUp ? '#5ff' : '#f55';

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = fadeAlpha;
  ctx.font = '10px "Press Start 2P"';
  ctx.fillStyle = color;
  ctx.fillText(text, W / 2, 90);
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ============================================================
// HC-RK-03: FAIRNESS CAPS & SAFETY GOVERNOR
// Capa de seguridad — previene escalados injustos.
// NO aplica dificultad. Solo valida y limita.
// ============================================================

// ============================================================
// CONFIG READER
// ============================================================

function _hardcoreRankSafetyReadConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : {};
  return {
    bulletSpeedMax: (typeof r.safetyBulletSpeedMax === 'number') ? r.safetyBulletSpeedMax : 1.08,
    cooldownFloorMs: (typeof r.safetyCooldownFloorMs === 'number') ? r.safetyCooldownFloorMs : 450,
    wavePauseFloorMs: (typeof r.safetyWavePauseFloorMs === 'number') ? r.safetyWavePauseFloorMs : 600,
    combinedCeiling: (typeof r.safetyCombinedCeiling === 'number') ? r.safetyCombinedCeiling : 5.20,
    recoveryLimit: (typeof r.safetyRecoveryLimit === 'number') ? r.safetyRecoveryLimit : 2,
    bossRankCeilings: (r.safetyBossRankCeilings && typeof r.safetyBossRankCeilings === 'object')
      ? r.safetyBossRankCeilings
      : { crossfire: 5, zigzag: 5, rotate: 5, divebomb: 5, supreme: 4 },
    waveIntensityCeiling: (typeof r.safetyWaveIntensityCeiling === 'number') ? r.safetyWaveIntensityCeiling : 0.85,
    antiSpikeMaxStep: (typeof r.safetyAntiSpikeMaxStep === 'number') ? r.safetyAntiSpikeMaxStep : 8,
    spikeCooldownMs: (typeof r.safetySpikeCooldownMs === 'number') ? r.safetySpikeCooldownMs : 2000
  };
}

// ============================================================
// PARAMETER CAPS — limits on individual difficulty axes
// ============================================================

// Cap bullet speed multiplier so fast bullets remain readable
// baseSpeed: pre-rank bullet speed (from difficulty table)
// Returns: safe speed value capped to config ceiling
window.getHardcoreRankSafeBulletSpeed = function(baseSpeed) {
  if (!_hardcoreRankIsEnabled()) {
    return (typeof baseSpeed === 'number' && baseSpeed > 0) ? baseSpeed : 0;
  }
  var base = (typeof baseSpeed === 'number' && baseSpeed > 0) ? baseSpeed : 2.90;
  var rankMult = (typeof window.getHardcoreRankBulletSpeedMultiplier === 'function')
    ? window.getHardcoreRankBulletSpeedMultiplier()
    : 1.00;

  var cfg = _hardcoreRankSafetyReadConfig();
  // Cap the rank multiplier itself
  var safeMult = Math.min(cfg.bulletSpeedMax, rankMult);

  // Combined ceiling for absolute speed
  var rawSpeed = base * safeMult;
  var cappedSpeed = Math.min(cfg.combinedCeiling, rawSpeed);

  return cappedSpeed;
};

// Floor enemy cooldown so fire rate never becomes instant
// baseCooldown: pre-rank cooldown in ms
// Returns: safe cooldown ms floored to config minimum
window.getHardcoreRankSafeCooldown = function(baseCooldown) {
  if (!_hardcoreRankIsEnabled()) {
    return (typeof baseCooldown === 'number' && baseCooldown > 0) ? baseCooldown : 1000;
  }
  var base = (typeof baseCooldown === 'number' && baseCooldown > 0) ? baseCooldown : 1000;
  var rankMult = (typeof window.getHardcoreRankCooldownMultiplier === 'function')
    ? window.getHardcoreRankCooldownMultiplier()
    : 1.00;

  var cfg = _hardcoreRankSafetyReadConfig();
  var rawCooldown = base * rankMult;

  // Never go below the absolute floor
  return Math.max(cfg.cooldownFloorMs, rawCooldown);
};

// Floor wave pause timing so RELIEF phase always exists
// baseMs: pre-rhythm pause duration
// Returns: safe pause ms floored to config minimum
window.getHardcoreRankSafeWavePause = function(baseMs) {
  if (!_hardcoreRankIsEnabled()) {
    return (typeof baseMs === 'number' && baseMs > 0) ? baseMs : 900;
  }
  var base = (typeof baseMs === 'number' && baseMs > 0) ? baseMs : 900;

  // Use rhythm scale if available
  if (typeof window.getHardcoreRhythmWavePause === 'function') {
    var scaled = window.getHardcoreRhythmWavePause(base);
    var cfg = _hardcoreRankSafetyReadConfig();
    return Math.max(cfg.wavePauseFloorMs, scaled);
  }

  return base;
};

// ============================================================
// COMBINED PRESSURE CEILING
// ============================================================

// Prevents multiplicative explosion when rank × pressure × rhythm stack
// Returns { safe: boolean, multiplier: number, reason: string }
window.getHardcoreRankCombinedPressure = function() {
  if (!_hardcoreRankIsEnabled()) {
    return { safe: true, multiplier: 1.00, reason: 'rank_disabled' };
  }

  var rankMult = (typeof window.getHardcoreRankBulletSpeedMultiplier === 'function')
    ? window.getHardcoreRankBulletSpeedMultiplier()
    : 1.00;
  var pressureMult = (typeof window.getHardcorePressureMultiplier === 'function')
    ? window.getHardcorePressureMultiplier()
    : 1.00;

  var combined = rankMult * pressureMult;
  var cfg = _hardcoreRankSafetyReadConfig();
  var ceiling = cfg.combinedCeiling;

  var safe = combined <= ceiling;
  var clamped = Math.min(ceiling, combined);

  return {
    safe: safe,
    multiplier: Number(clamped.toFixed(3)),
    rankOnly: Number(rankMult.toFixed(3)),
    pressureOnly: Number(pressureMult.toFixed(3)),
    combined_raw: Number(combined.toFixed(3)),
    ceiling: ceiling,
    reason: safe ? 'within_ceiling' : 'capped_by_governor'
  };
};

// ============================================================
// BOSS-SPECIFIC RANK LIMITS
// ============================================================

// Returns max safe rank level for a given boss
window.getHardcoreRankSafeBossCeiling = function(bossPattern) {
  if (!_hardcoreRankIsEnabled()) return 5;
  if (typeof bossPattern !== 'string' || bossPattern.length === 0) return 5;

  var cfg = _hardcoreRankSafetyReadConfig();
  var ceilings = cfg.bossRankCeilings;

  if (ceilings && typeof ceilings === 'object' && ceilings.hasOwnProperty(bossPattern)) {
    return Math.max(1, Math.min(5, ceilings[bossPattern]));
  }

  return 5; // default: no restriction
};

// Check if current rank is safe for the active boss
// Returns { safe: boolean, currentLevel: number, maxLevel: number, reason: string }
window.isHardcoreRankSafeForBoss = function(bossRef) {
  if (!_hardcoreRankIsEnabled()) return { safe: true, currentLevel: 1, maxLevel: 5, reason: 'rank_disabled' };

  var boss = bossRef || (typeof window.boss !== 'undefined' ? window.boss : null);
  if (!boss || !boss.active) return { safe: true, currentLevel: 1, maxLevel: 5, reason: 'no_boss' };

  var pattern = (typeof boss.pattern === 'string') ? boss.pattern : '';

  // Boss-specific ceiling
  var maxLevel = window.getHardcoreRankSafeBossCeiling(pattern);
  var currentLevel = _hardcoreRank.level;

  // Recovery check: limit rank effects during RECOVERING state
  if (_hardcoreRankPerformance.performanceState === 'RECOVERING') {
    var cfg = _hardcoreRankSafetyReadConfig();
    return {
      safe: false,
      currentLevel: currentLevel,
      maxLevel: cfg.recoveryLimit,
      reason: 'player_recovering'
    };
  }

  if (currentLevel > maxLevel) {
    return {
      safe: false,
      currentLevel: currentLevel,
      maxLevel: maxLevel,
      reason: 'boss_ceiling_exceeded'
    };
  }

  return { safe: true, currentLevel: currentLevel, maxLevel: maxLevel, reason: 'within_limit' };
};

// ============================================================
// WAVE INTENSITY SAFETY
// ============================================================

// Check if wave with current rank exceeds intensity ceiling
// intensity: 0.0–1.0 wave intensity (from wave composer)
window.isHardcoreRankSafeForWave = function(waveIntensity) {
  if (!_hardcoreRankIsEnabled()) return true;

  var cfg = _hardcoreRankSafetyReadConfig();
  var intensity = (typeof waveIntensity === 'number') ? Math.max(0, Math.min(1, waveIntensity)) : 0.5;

  // Combined threat = intensity × rank multiplier
  var rankMult = (typeof window.getHardcoreRankMultiplier === 'function')
    ? window.getHardcoreRankMultiplier()
    : 1.00;
  var combined = intensity * rankMult;

  return combined <= cfg.waveIntensityCeiling;
};

// ============================================================
// RECOVERY PROTECTION
// ============================================================

// Blocks rank from rising when player is in RECOVERING state
window.shouldBlockRankForRecovery = function() {
  if (!_hardcoreRankIsEnabled()) return false;

  // Only block gains, not decay
  return _hardcoreRankPerformance.performanceState === 'RECOVERING';
};

// Blocks rank effects from applying difficulty during recovery
// Returns effective rank multiplier considering recovery state
window.getEffectiveRankMultiplier = function() {
  if (!_hardcoreRankIsEnabled()) return 1.00;

  var cfg = _hardcoreRankSafetyReadConfig();

  if (_hardcoreRankPerformance.performanceState === 'RECOVERING') {
    // During recovery, cap rank effects to recoveryLimit
    var recLimit = cfg.recoveryLimit;
    var map = [0, 1.00, 1.12, 1.25, 1.37, 1.50];
    var idx = Math.min(5, Math.max(1, recLimit));
    return map[idx];
  }

  return _hardcoreRank.multiplier;
};

// ============================================================
// ANTI-SPIKE GUARDS
// ============================================================

var _hardcoreRankSafetySpike = {
  lastSpikeAt: 0,
  lastSpikeValue: 0
};

// Validates that a rank change isn't too abrupt
// current: current rank value
// target: proposed new rank value after change
// Returns { allowed: boolean, adjusted: number, reason: string }
window.validateHardcoreRankSpike = function(currentValue, targetValue) {
  if (!_hardcoreRankIsEnabled()) {
    return { allowed: true, adjusted: targetValue, reason: 'rank_disabled' };
  }

  var cur = (typeof currentValue === 'number') ? currentValue : _hardcoreRank.value;
  var tgt = (typeof targetValue === 'number') ? targetValue : cur;
  var cfg = _hardcoreRankSafetyReadConfig();
  var now = Date.now();

  // Positive spike (rank up): limit step size
  if (tgt > cur) {
    var step = tgt - cur;
    var maxStep = cfg.antiSpikeMaxStep;

    if (step > maxStep) {
      // Allow the spike, but only after cooldown from last spike
      if (_hardcoreRankSafetySpike.lastSpikeAt > 0 &&
          (now - _hardcoreRankSafetySpike.lastSpikeAt) < cfg.spikeCooldownMs) {
        return {
          allowed: false,
          adjusted: Math.min(cur + maxStep, tgt),
          reason: 'spike_cooldown_active'
        };
      }

      _hardcoreRankSafetySpike.lastSpikeAt = now;
      _hardcoreRankSafetySpike.lastSpikeValue = tgt;

      return {
        allowed: true,
        adjusted: tgt,
        reason: 'spike_allowed'
      };
    }
  }

  return { allowed: true, adjusted: tgt, reason: 'normal_step' };
};

// ============================================================
// SAFETY GOVERNOR CENTRAL CHECK
// ============================================================

// Master safety check — should rank effects apply right now?
// Returns { apply: boolean, reason: string, details: object }
window.getHardcoreRankSafetyGovernor = function() {
  if (!_hardcoreRankIsEnabled()) {
    return { apply: false, reason: 'rank_disabled', details: {} };
  }
  if (typeof state === 'undefined' || state !== 'playing') {
    return { apply: false, reason: 'not_playing', details: {} };
  }
  if (!player || typeof player.hp !== 'number' || player.hp <= 0) {
    return { apply: false, reason: 'player_dead', details: {} };
  }

  var details = {
    rankLevel: _hardcoreRank.level,
    rankMultiplier: _hardcoreRank.multiplier,
    performanceState: _hardcoreRankPerformance.performanceState,
    combinedPressure: (typeof window.getHardcoreRankCombinedPressure === 'function')
      ? window.getHardcoreRankCombinedPressure()
      : { safe: true, multiplier: 1.00 }
  };

  // 1. Recovery block
  if (_hardcoreRankPerformance.performanceState === 'RECOVERING') {
    return { apply: false, reason: 'player_recovering', details: details };
  }

  // 2. Combined pressure check
  if (details.combinedPressure.multiplier !== undefined &&
      !details.combinedPressure.safe) {
    return { apply: false, reason: 'pressure_ceiling_exceeded', details: details };
  }

  // 3. Boss ceiling check if boss is active
  if (typeof boss !== 'undefined' && boss && boss.active) {
    var bossCheck = (typeof window.isHardcoreRankSafeForBoss === 'function')
      ? window.isHardcoreRankSafeForBoss(boss)
      : { safe: true };
    details.bossCheck = bossCheck;
    if (!bossCheck.safe) {
      return { apply: false, reason: 'boss_ceiling_exceeded', details: details };
    }
  }

  // All checks passed
  return { apply: true, reason: 'governor_approved', details: details };
};

// ============================================================
// SAFETY TELEMETRY — block/cap events
// ============================================================

var _hardcoreRankSafetyLog = {
  blocks: [],
  caps: [],
  lastResetAt: 0
};

// Record a safety block event
window.logHardcoreRankSafetyBlock = function(reason) {
  var entry = {
    reason: (typeof reason === 'string') ? reason : 'unknown',
    at: Date.now(),
    rankValue: _hardcoreRank.value,
    rankLevel: _hardcoreRank.level,
    performanceState: _hardcoreRankPerformance.performanceState
  };
  _hardcoreRankSafetyLog.blocks.push(entry);
  // Keep only last 20
  if (_hardcoreRankSafetyLog.blocks.length > 20) {
    _hardcoreRankSafetyLog.blocks.shift();
  }
};

// Record a parameter cap event
window.logHardcoreRankSafetyCap = function(parameter, requested, capped) {
  var entry = {
    parameter: (typeof parameter === 'string') ? parameter : 'unknown',
    requested: (typeof requested === 'number') ? requested : 0,
    capped: (typeof capped === 'number') ? capped : 0,
    at: Date.now()
  };
  _hardcoreRankSafetyLog.caps.push(entry);
  if (_hardcoreRankSafetyLog.caps.length > 30) {
    _hardcoreRankSafetyLog.caps.shift();
  }
};

// Get full safety log
window.getHardcoreRankSafetyLog = function() {
  return {
    blocks: _hardcoreRankSafetyLog.blocks.slice(),
    caps: _hardcoreRankSafetyLog.caps.slice(),
    blockCount: _hardcoreRankSafetyLog.blocks.length,
    capCount: _hardcoreRankSafetyLog.caps.length
  };
};

// Reset safety log (called on new run)
window.resetHardcoreRankSafetyLog = function() {
  _hardcoreRankSafetyLog.blocks = [];
  _hardcoreRankSafetyLog.caps = [];
  _hardcoreRankSafetyLog.lastResetAt = Date.now();
};

// Reset spike tracking
window.resetHardcoreRankSpikeTracking = function() {
  _hardcoreRankSafetySpike.lastSpikeAt = 0;
  _hardcoreRankSafetySpike.lastSpikeValue = 0;
};
