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

// ============================================================
// HC-RK-04: SAFE GAMEPLAY WIRING
// Conecta rank al gameplay usando solo helpers seguros.
// Todo debe pasar por el safety governor.
// ============================================================

// ============================================================
// MASTER ENABLE
// ============================================================

// Check if rank gameplay effects are globally enabled
window.areHardcoreRankGameplayEffectsEnabled = function() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : {};
  return !!(r.gameplayEffectsEnabled);
};

// ============================================================
// GAMEPLAY-READY WRAPPERS — apply caps only when safe
// ============================================================

// Get effective bullet speed multiplier for actual use in pushEnemyBullet
// Returns { multiplier, requested, capped, reason, governorApproved }
window.getHardcoreRankGameplayBulletSpeed = function(baseSpeed) {
  var result = {
    multiplier: 1.00,
    requested: 1.00,
    capped: false,
    reason: 'disabled',
    governorApproved: false
  };

  if (!_hardcoreRankIsEnabled()) return result;
  if (!window.areHardcoreRankGameplayEffectsEnabled()) {
    result.reason = 'gameplay_effects_disabled';
    return result;
  }

  var rawMult = (typeof window.getHardcoreRankBulletSpeedMultiplier === 'function')
    ? window.getHardcoreRankBulletSpeedMultiplier()
    : 1.00;
  result.requested = rawMult;

  var governor = (typeof window.getHardcoreRankSafetyGovernor === 'function')
    ? window.getHardcoreRankSafetyGovernor()
    : { apply: false, reason: 'governor_missing' };
  result.governorApproved = governor.apply;

  if (!governor.apply) {
    result.reason = governor.reason;
    return result;
  }

  var safeSpeed = (typeof window.getHardcoreRankSafeBulletSpeed === 'function')
    ? window.getHardcoreRankSafeBulletSpeed(baseSpeed)
    : baseSpeed * rawMult;

  var base = (typeof baseSpeed === 'number' && baseSpeed > 0) ? baseSpeed : 1;
  result.multiplier = safeSpeed / base;
  result.capped = (safeSpeed < baseSpeed * rawMult);
  result.reason = result.capped ? 'capped' : 'applied';

  // Log cap if speed was reduced
  if (result.capped) {
    if (typeof window.logHardcoreRankSafetyCap === 'function') {
      window.logHardcoreRankSafetyCap('bulletSpeed', baseSpeed * rawMult, safeSpeed);
    }
  }

  return result;
};

// Get effective cooldown multiplier for actual use in enemy cooldowns
// Returns { multiplier, requested, capped, reason, governorApproved }
window.getHardcoreRankGameplayCooldown = function(baseCooldown) {
  var result = {
    multiplier: 1.00,
    requested: 1.00,
    capped: false,
    reason: 'disabled',
    governorApproved: false
  };

  if (!_hardcoreRankIsEnabled()) return result;
  if (!window.areHardcoreRankGameplayEffectsEnabled()) {
    result.reason = 'gameplay_effects_disabled';
    return result;
  }

  var rawMult = (typeof window.getHardcoreRankCooldownMultiplier === 'function')
    ? window.getHardcoreRankCooldownMultiplier()
    : 1.00;
  result.requested = rawMult;

  var governor = (typeof window.getHardcoreRankSafetyGovernor === 'function')
    ? window.getHardcoreRankSafetyGovernor()
    : { apply: false, reason: 'governor_missing' };
  result.governorApproved = governor.apply;

  if (!governor.apply) {
    result.reason = governor.reason;
    return result;
  }

  var safeCooldown = (typeof window.getHardcoreRankSafeCooldown === 'function')
    ? window.getHardcoreRankSafeCooldown(baseCooldown)
    : baseCooldown;

  var base = (typeof baseCooldown === 'number' && baseCooldown > 0) ? baseCooldown : 1000;
  result.multiplier = safeCooldown / base;
  result.capped = (safeCooldown > baseCooldown * rawMult);
  result.reason = result.capped ? 'capped' : 'applied';

  if (result.capped) {
    if (typeof window.logHardcoreRankSafetyCap === 'function') {
      window.logHardcoreRankSafetyCap('cooldown', baseCooldown * rawMult, safeCooldown);
    }
  }

  return result;
};

// Get effective wave pause for wave transitions
// Returns { pauseMs, requested, capped, reason, governorApproved }
window.getHardcoreRankGameplayWavePause = function(baseMs) {
  var result = {
    pauseMs: (typeof baseMs === 'number' && baseMs > 0) ? baseMs : 900,
    requested: (typeof baseMs === 'number' && baseMs > 0) ? baseMs : 900,
    capped: false,
    reason: 'disabled',
    governorApproved: false
  };

  if (!_hardcoreRankIsEnabled()) return result;
  if (!window.areHardcoreRankGameplayEffectsEnabled()) {
    result.reason = 'gameplay_effects_disabled';
    return result;
  }

  // Get rhythm-scaled pause
  var rhythmPause = (typeof window.getHardcoreRhythmWavePause === 'function')
    ? window.getHardcoreRhythmWavePause(baseMs)
    : baseMs;
  result.requested = rhythmPause;

  var governor = (typeof window.getHardcoreRankSafetyGovernor === 'function')
    ? window.getHardcoreRankSafetyGovernor()
    : { apply: false, reason: 'governor_missing' };
  result.governorApproved = governor.apply;

  if (!governor.apply) {
    result.pauseMs = baseMs;
    result.reason = governor.reason;
    return result;
  }

  var safePause = (typeof window.getHardcoreRankSafeWavePause === 'function')
    ? window.getHardcoreRankSafeWavePause(baseMs)
    : baseMs;
  result.pauseMs = safePause;
  result.capped = (safePause > rhythmPause);
  result.reason = result.capped ? 'capped' : 'applied';

  if (result.capped) {
    if (typeof window.logHardcoreRankSafetyCap === 'function') {
      window.logHardcoreRankSafetyCap('wavePause', rhythmPause, safePause);
    }
  }

  return result;
};

// ============================================================
// GAMEPLAY APPLICATION TELEMETRY
// ============================================================

var _hardcoreRankGameplayTelemetry = {
  bulletSpeedApplications: 0,
  bulletSpeedCaps: 0,
  cooldownApplications: 0,
  cooldownCaps: 0,
  wavePauseApplications: 0,
  wavePauseCaps: 0,
  governorBlocks: 0,
  lastAppliedAt: 0
};

window.recordHardcoreRankGameplayApply = function(type, capped) {
  var g = _hardcoreRankGameplayTelemetry;
  g.lastAppliedAt = Date.now();

  switch (type) {
    case 'bulletSpeed':
      g.bulletSpeedApplications++;
      if (capped) g.bulletSpeedCaps++;
      break;
    case 'cooldown':
      g.cooldownApplications++;
      if (capped) g.cooldownCaps++;
      break;
    case 'wavePause':
      g.wavePauseApplications++;
      if (capped) g.wavePauseCaps++;
      break;
  }
};

window.recordHardcoreRankGovernorBlock = function(reason) {
  _hardcoreRankGameplayTelemetry.governorBlocks++;
  if (typeof window.logHardcoreRankSafetyBlock === 'function') {
    window.logHardcoreRankSafetyBlock(reason);
  }
};

window.getHardcoreRankGameplayTelemetry = function() {
  return {
    bulletSpeedApplications: _hardcoreRankGameplayTelemetry.bulletSpeedApplications,
    bulletSpeedCaps: _hardcoreRankGameplayTelemetry.bulletSpeedCaps,
    cooldownApplications: _hardcoreRankGameplayTelemetry.cooldownApplications,
    cooldownCaps: _hardcoreRankGameplayTelemetry.cooldownCaps,
    wavePauseApplications: _hardcoreRankGameplayTelemetry.wavePauseApplications,
    wavePauseCaps: _hardcoreRankGameplayTelemetry.wavePauseCaps,
    governorBlocks: _hardcoreRankGameplayTelemetry.governorBlocks,
    lastAppliedAt: _hardcoreRankGameplayTelemetry.lastAppliedAt
  };
};

window.resetHardcoreRankGameplayTelemetry = function() {
  _hardcoreRankGameplayTelemetry.bulletSpeedApplications = 0;
  _hardcoreRankGameplayTelemetry.bulletSpeedCaps = 0;
  _hardcoreRankGameplayTelemetry.cooldownApplications = 0;
  _hardcoreRankGameplayTelemetry.cooldownCaps = 0;
  _hardcoreRankGameplayTelemetry.wavePauseApplications = 0;
  _hardcoreRankGameplayTelemetry.wavePauseCaps = 0;
  _hardcoreRankGameplayTelemetry.governorBlocks = 0;
  _hardcoreRankGameplayTelemetry.lastAppliedAt = 0;
};

// ============================================================
// HC-RK-05: RANK FEEDBACK & DEBUG OVERLAY
// Overlay visual para auditar el Rank sin contaminar HUD.
// Flag-gated: debug.showRankDebug
// ============================================================

window.drawHardcoreRankFullDebug = function(ctx) {
  if (!ctx) return;
  if (typeof H === 'undefined' || typeof W === 'undefined') return;

  // Check debug flag
  var dbgCfg = (typeof getHardcoreDebugConfig === 'function')
    ? getHardcoreDebugConfig()
    : { showRankDebug: false };
  if (!dbgCfg.showRankDebug) return;

  var panelX = W - 228;
  var panelY = 44;
  var panelW = 222;
  var lineH = 10;
  var y = panelY + 8;

  // Background panel
  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#080812';
  ctx.fillRect(panelX, panelY, panelW, lineH * 28 + 12);
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = '#f80';
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelW, lineH * 28 + 12);
  ctx.globalAlpha = 1;

  ctx.font = '5px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  function _fmt(v, d) {
    if (typeof v !== 'number' || !isFinite(v)) return '--';
    return v.toFixed(typeof d === 'number' ? d : 2);
  }

  function _col(state) {
    if (state === 'DOMINATING') return '#5f5';
    if (state === 'RECOVERING') return '#f55';
    return '#ff6';
  }

  // ──── SECTION: RANK STATE ────
  ctx.fillStyle = '#f80';
  ctx.fillText('RANK  L' + _hardcoreRank.level + '  VAL ' + _fmt(_hardcoreRank.value, 1) + '  x' + _fmt(_hardcoreRank.multiplier, 2), panelX + 6, y); y += lineH + 2;

  // ──── SECTION: PERFORMANCE ────
  var perLabel = _hardcoreRankPerformance.performanceState;
  var hitlessSec = (_hardcoreRankPerformance.hitlessDurationMs / 1000);
  ctx.fillStyle = _col(perLabel);
  ctx.fillText(perLabel, panelX + 6, y);
  ctx.fillStyle = '#ccc';
  ctx.fillText('HITLESS ' + _fmt(hitlessSec, 1) + 's  MAX ' + _fmt(_hardcoreRankPerformance.longestHitlessMs / 1000, 1) + 's', panelX + 6, y + lineH); y += lineH * 2 + 2;

  // ──── SECTION: ACCURACY ────
  var acc = _hardcoreRankPerformance.accuracyPercent;
  ctx.fillStyle = acc >= 65 ? '#5f5' : '#cc8';
  ctx.fillText('ACC ' + _fmt(acc, 1) + '%', panelX + 6, y); y += lineH + 2;

  // ──── SECTION: SOURCE BREAKDOWN ────
  ctx.fillStyle = '#888';
  ctx.fillText('SOURCES', panelX + 6, y); y += lineH;
  var p = _hardcoreRankPerformance;
  ctx.fillStyle = '#8b8';
  ctx.fillText('KILLS ' + _fmt(p.rankFromKills, 1), panelX + 6, y);
  ctx.fillStyle = '#bb8';
  ctx.fillText(' SURV ' + _fmt(p.rankFromSurvival, 1), panelX + 40, y); y += lineH;
  ctx.fillStyle = '#8bb';
  ctx.fillText('ACC   ' + _fmt(p.rankFromAccuracy, 1), panelX + 6, y);
  ctx.fillStyle = '#b8d';
  ctx.fillText(' BOSS ' + _fmt(p.rankFromBossPhases + p.rankFromBossClears, 1), panelX + 40, y); y += lineH;
  ctx.fillStyle = '#8db';
  ctx.fillText('GRAZE ' + _fmt(p.rankFromGraze, 1), panelX + 6, y);
  ctx.fillStyle = '#88d';
  ctx.fillText(' WAVESPD ' + _fmt(p.rankFromWaveSpeed, 1), panelX + 40, y); y += lineH + 2;

  // ──── SECTION: LOSSES ────
  ctx.fillStyle = '#f66';
  ctx.fillText('LOSS: DEATH ' + _fmt(p.rankLostFromDeaths, 1) + '  DECAY ' + _fmt(p.rankLostFromDecay, 1), panelX + 6, y); y += lineH + 2;

  // ──── SECTION: GAMEPLAY EFFECTS STATUS ────
  var effectsOn = (typeof window.areHardcoreRankGameplayEffectsEnabled === 'function')
    ? window.areHardcoreRankGameplayEffectsEnabled()
    : false;
  ctx.fillStyle = effectsOn ? '#5f5' : '#888';
  ctx.fillText('GAMEPLAY ' + (effectsOn ? 'ON' : 'OFF'), panelX + 6, y); y += lineH;

  // Governor status
  if (effectsOn) {
    var gov = (typeof window.getHardcoreRankSafetyGovernor === 'function')
      ? window.getHardcoreRankSafetyGovernor()
      : { apply: false, reason: '?' };
    ctx.fillStyle = gov.apply ? '#5f5' : '#f55';
    ctx.fillText(gov.apply ? 'GOVERNOR: APPROVED' : 'GOV: ' + gov.reason, panelX + 6, y); y += lineH;
  }

  // Recovery indicator
  if (_hardcoreRankPerformance.performanceState === 'RECOVERING') {
    ctx.fillStyle = '#f55';
    var recSince = Math.max(0, (typeof globalTime === 'number' ? globalTime : Date.now()) - _hardcoreRankPerformance.lastHitAt);
    var recLeft = Math.max(0, 5000 - recSince);
    ctx.fillText('RECOVERY ' + _fmt(recLeft / 1000, 1) + 's left', panelX + 6, y);
  }
  y += lineH + 2;

  // ──── SECTION: TELEMETRY ────
  var gtel = (typeof window.getHardcoreRankGameplayTelemetry === 'function')
    ? window.getHardcoreRankGameplayTelemetry()
    : { bulletSpeedApplications: 0, bulletSpeedCaps: 0, cooldownApplications: 0, cooldownCaps: 0, wavePauseApplications: 0, wavePauseCaps: 0, governorBlocks: 0 };
  ctx.fillStyle = '#888';
  ctx.fillText('TELEMETRY', panelX + 6, y); y += lineH;
  ctx.fillStyle = '#cc8';
  ctx.fillText('BULLET ' + gtel.bulletSpeedApplications + ' app  ' + gtel.bulletSpeedCaps + ' cap', panelX + 6, y); y += lineH;
  ctx.fillStyle = '#8cc';
  ctx.fillText('CD     ' + gtel.cooldownApplications + ' app  ' + gtel.cooldownCaps + ' cap', panelX + 6, y); y += lineH;
  ctx.fillStyle = '#c8c';
  ctx.fillText('PAUSE  ' + gtel.wavePauseApplications + ' app  ' + gtel.wavePauseCaps + ' cap', panelX + 6, y); y += lineH;
  ctx.fillStyle = gtel.governorBlocks > 0 ? '#f55' : '#888';
  ctx.fillText('BLOCKS ' + gtel.governorBlocks, panelX + 6, y); y += lineH + 2;

  // ──── SECTION: RECENT SAFETY LOG (last 5 blocks) ────
  var safetyLog = (typeof window.getHardcoreRankSafetyLog === 'function')
    ? window.getHardcoreRankSafetyLog()
    : { blocks: [], caps: [] };
  if (safetyLog.blocks && safetyLog.blocks.length > 0) {
    ctx.fillStyle = '#f55';
    ctx.fillText('RECENT BLOCKS', panelX + 6, y); y += lineH;
    var recentBlocks = safetyLog.blocks.slice(-5);
    for (var bi = 0; bi < recentBlocks.length; bi++) {
      var b = recentBlocks[bi];
      var secAgo = Math.round((Date.now() - b.at) / 1000);
      ctx.fillStyle = '#f88';
      ctx.fillText(b.reason + ' ' + secAgo + 's ago', panelX + 6, y); y += lineH;
      if (y > panelY + panelW) break;
    }
    y += 2;
  }

  // ──── SECTION: RECENT CAPS (last 5 capping events) ────
  if (safetyLog.caps && safetyLog.caps.length > 0) {
    ctx.fillStyle = '#fa0';
    ctx.fillText('RECENT CAPS', panelX + 6, y); y += lineH;
    var recentCaps = safetyLog.caps.slice(-5);
    for (var ci = 0; ci < recentCaps.length; ci++) {
      var c = recentCaps[ci];
      ctx.fillStyle = '#fb8';
      ctx.fillText(c.parameter + ' ' + _fmt(c.requested, 1) + '→' + _fmt(c.capped, 1), panelX + 6, y); y += lineH;
      if (y > panelY + panelW) break;
    }
  }

  ctx.restore();
};

// ============================================================
// HC-RK-07: LIVE ACTIVATION SAFEGUARDS
// Runtime protections for rank effects in live gameplay.
// ============================================================

// ============================================================
// ANTI-OSCILLATION SMOOTHING
// ============================================================

var _hardcoreRankSmooth = {
  displayValue: 0,       // lerped value for smooth display
  displayLevel: 1,       // lerped level
  smoothFactor: 0.12,    // lerp speed (lower = smoother)
  lastUpdateAt: 0
};

// Get smoothed display rank (for HUD/feedback, not gameplay)
window.getHardcoreRankDisplayValue = function() {
  if (!_hardcoreRankIsEnabled()) return _hardcoreRank.value;

  var now = Date.now();
  var dt = (_hardcoreRankSmooth.lastUpdateAt > 0) ? Math.min(1000, now - _hardcoreRankSmooth.lastUpdateAt) : 16;
  _hardcoreRankSmooth.lastUpdateAt = now;

  // Lerp toward actual value
  _hardcoreRankSmooth.displayValue +=
    (_hardcoreRank.value - _hardcoreRankSmooth.displayValue) * _hardcoreRankSmooth.smoothFactor * (dt / 16.667);

  // Prevent tiny drift
  if (Math.abs(_hardcoreRankSmooth.displayValue - _hardcoreRank.value) < 0.01) {
    _hardcoreRankSmooth.displayValue = _hardcoreRank.value;
  }

  return _hardcoreRankSmooth.displayValue;
};

window.getHardcoreRankDisplayLevel = function() {
  return _hardcoreRankCalcLevel(window.getHardcoreRankDisplayValue());
};

// ============================================================
// PEAK VALUE TRACKING
// ============================================================

var _hardcoreRankPeaks = {
  highestValue: 0,
  highestLevel: 1,
  highestMultiplier: 1.00,
  highestBulletSpeed: 0,
  lowestCooldown: 9999,
  lowestWavePause: 9999,
  highestCombinedPressure: 1.00,
  totalGovernorBlocks: 0,
  totalCaps: 0,
  totalApplications: 0
};

// Record peak values each frame
window.updateHardcoreRankPeakTracking = function() {
  if (!_hardcoreRankIsEnabled()) return;

  var p = _hardcoreRankPeaks;

  // Rank peaks
  if (_hardcoreRank.value > p.highestValue) p.highestValue = _hardcoreRank.value;
  if (_hardcoreRank.level > p.highestLevel) p.highestLevel = _hardcoreRank.level;
  if (_hardcoreRank.multiplier > p.highestMultiplier) p.highestMultiplier = _hardcoreRank.multiplier;

  // Effect peaks (only if gameplay effects enabled)
  if (typeof window.areHardcoreRankGameplayEffectsEnabled === 'function' &&
      window.areHardcoreRankGameplayEffectsEnabled()) {
    var combined = (typeof window.getHardcoreRankCombinedPressure === 'function')
      ? window.getHardcoreRankCombinedPressure()
      : { combined_raw: 1.00 };
    if (combined.combined_raw > p.highestCombinedPressure) {
      p.highestCombinedPressure = combined.combined_raw;
    }
  }

  // Aggregate telemetry
  var gtel = (typeof window.getHardcoreRankGameplayTelemetry === 'function')
    ? window.getHardcoreRankGameplayTelemetry()
    : {};
  p.totalGovernorBlocks = (gtel.governorBlocks || 0) +
    (gtel.bulletSpeedCaps || 0) + (gtel.cooldownCaps || 0) + (gtel.wavePauseCaps || 0);
};

window.getHardcoreRankPeakTelemetry = function() {
  var gtel = (typeof window.getHardcoreRankGameplayTelemetry === 'function')
    ? window.getHardcoreRankGameplayTelemetry()
    : {};
  return {
    highestValue: _hardcoreRankPeaks.highestValue,
    highestLevel: _hardcoreRankPeaks.highestLevel,
    highestMultiplier: _hardcoreRankPeaks.highestMultiplier,
    highestCombinedPressure: _hardcoreRankPeaks.highestCombinedPressure,
    totalApplications: (gtel.bulletSpeedApplications || 0) + (gtel.cooldownApplications || 0) + (gtel.wavePauseApplications || 0),
    totalCaps: (gtel.bulletSpeedCaps || 0) + (gtel.cooldownCaps || 0) + (gtel.wavePauseCaps || 0),
    totalBlocks: (gtel.governorBlocks || 0)
  };
};

window.resetHardcoreRankPeaks = function() {
  _hardcoreRankPeaks.highestValue = 0;
  _hardcoreRankPeaks.highestLevel = 1;
  _hardcoreRankPeaks.highestMultiplier = 1.00;
  _hardcoreRankPeaks.highestBulletSpeed = 0;
  _hardcoreRankPeaks.lowestCooldown = 9999;
  _hardcoreRankPeaks.lowestWavePause = 9999;
  _hardcoreRankPeaks.highestCombinedPressure = 1.00;
  _hardcoreRankPeaks.totalGovernorBlocks = 0;
  _hardcoreRankPeaks.totalCaps = 0;
  _hardcoreRankPeaks.totalApplications = 0;
};

// ============================================================
// LIVE ACTIVATION STATUS
// ============================================================

window.getHardcoreRankLiveStatus = function() {
  var effectsOn = (typeof window.areHardcoreRankGameplayEffectsEnabled === 'function')
    ? window.areHardcoreRankGameplayEffectsEnabled()
    : false;

  var governor = (typeof window.getHardcoreRankSafetyGovernor === 'function')
    ? window.getHardcoreRankSafetyGovernor()
    : { apply: false, reason: 'unknown' };

  var perfState = (typeof window.getHardcoreRankPerformanceState === 'function')
    ? window.getHardcoreRankPerformanceState()
    : { performanceState: 'UNKNOWN', hitlessDurationMs: 0 };

  var avgBulletSpeedMult = effectsOn ? _hardcoreRankPeaks.highestMultiplier : 1.00;

  return {
    gameplayEffectsEnabled: effectsOn,
    governorApproved: governor.apply,
    governorReason: governor.reason,
    rankLevel: _hardcoreRank.level,
    rankValue: _hardcoreRank.value,
    displayValue: window.getHardcoreRankDisplayValue(),
    performanceState: perfState.performanceState,
    peakValue: _hardcoreRankPeaks.highestValue,
    peakLevel: _hardcoreRankPeaks.highestLevel,
    peakCombinedPressure: _hardcoreRankPeaks.highestCombinedPressure
  };
};
