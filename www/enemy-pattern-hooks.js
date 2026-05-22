// ==============================================
// GALAXY RAIDERS - enemy-pattern-hooks.js
// Hooks seguros para patrones hardcore por enemy
// ==============================================

function __safeIsHardcoreEnabled() {
  return (typeof isHardcoreEnabled === 'function') ? isHardcoreEnabled() : false;
}

function __safeGetEnemyIdentity(enemyOrType) {
  if (typeof getEnemyIdentity === 'function') return getEnemyIdentity(enemyOrType);
  return { role: 'basic', patternHint: 'default', label: 'Unknown' };
}

function __safeGetEnemyRole(enemyOrType) {
  if (typeof getEnemyRole === 'function') return getEnemyRole(enemyOrType);
  var id = __safeGetEnemyIdentity(enemyOrType);
  return (id && id.role) ? id.role : 'basic';
}

function __safeGetEnemyPatternHint(enemyOrType) {
  if (typeof getEnemyPatternHint === 'function') return getEnemyPatternHint(enemyOrType);
  var id = __safeGetEnemyIdentity(enemyOrType);
  return (id && id.patternHint) ? id.patternHint : 'default';
}

function __isValidEnemy(enemy) {
  return !!(enemy && typeof enemy === 'object' && typeof enemy.type === 'string' && enemy.type.length > 0);
}

// --- helpers publicos ---

function getEnemyPatternProfile(enemy) {
  if (!__isValidEnemy(enemy)) {
    return { role: 'basic', patternHint: 'default', ready: false };
  }

  var identity = __safeGetEnemyIdentity(enemy);
  var hardcore = __safeIsHardcoreEnabled();

  return {
    role: identity.role || 'basic',
    patternHint: identity.patternHint || 'default',
    label: identity.label || 'Unknown',
    ready: !!(enemy.patternReady),
    hardcoreActive: hardcore
  };
}

function shouldUseHardcorePattern(enemy) {
  if (!__safeIsHardcoreEnabled()) return false;
  if (!__isValidEnemy(enemy)) return false;
  return true;
}

function getEnemyPatternRole(enemy) {
  if (!__isValidEnemy(enemy)) return 'basic';
  if (enemy.patternRole) return enemy.patternRole;
  return __safeGetEnemyRole(enemy);
}

function getEnemyPatternHintSafe(enemy) {
  if (!__isValidEnemy(enemy)) return 'default';
  if (enemy.patternHint) return enemy.patternHint;
  return __safeGetEnemyPatternHint(enemy);
}

function markEnemyPatternReady(enemy) {
  if (!__isValidEnemy(enemy)) return false;
  enemy.patternReady = true;
  enemy.patternRole = __safeGetEnemyRole(enemy);
  enemy.patternHint = __safeGetEnemyPatternHint(enemy);
  return true;
}

// ============================================================
// HARDCORE SNIPER PATTERN (alien2)
// ============================================================

function getAngleToPlayer(enemy) {
  if (!enemy || typeof player === 'undefined' || !player) return Math.PI / 2;
  var ex = enemy.x + (enemy.w || 24) / 2;
  var ey = enemy.y + (enemy.h || 24);
  var px = player.x + player.width / 2;
  var py = player.y + player.height / 2;
  return Math.atan2(py - ey, px - ex);
}

function shouldFireHardcoreSniperPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'sniper') return false;
  return true;
}

var HC_SNIPER_COOLDOWN_MIN = 2000;
var HC_SNIPER_COOLDOWN_MAX = 3500;

function fireHardcoreSniperShot(enemy) {
  if (!enemy) return false;

  var angle = getAngleToPlayer(enemy);
  var speed = 3.2;
  var vx = Math.cos(angle) * speed;
  var vy = Math.sin(angle) * speed;

  var sx = enemy.x + (enemy.w || 24) / 2 - 3;
  var sy = enemy.y + (enemy.h || 24);

  if (typeof pushEnemyBullet !== 'function') return false;

  pushEnemyBullet(sx, sy, vx, vy, 6, 10, {
    kind: 'crossfire_a',
    color: '#ff8844',
    sourceType: enemy.type || 'alien2'
  });

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien2');
  }

  return true;
}

// ============================================================
// HARDCORE DIVER PATTERN (alien3)
// ============================================================

function shouldUseHardcoreDiverPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'diver') return false;
  if (enemy.diving) return false;
  return true;
}

function _initHardcoreDiverState(enemy) {
  if (enemy._hcDiverState === undefined) {
    enemy._hcDiverState = 'idle';
    enemy._hcDiverTimer = 0;
    enemy._hcDiverCooldown = 4000 + Math.random() * 5000;
    enemy._hcDiverTargetX = 0;
    enemy._hcDiverTargetY = 0;
    enemy._hcDiverHomeX = enemy.x;
    enemy._hcDiverHomeY = enemy.y;
  }
}

var HC_DIVER_TELEGRAPH_MS = 380;
var HC_DIVER_COOLDOWN_MIN = 4000;
var HC_DIVER_COOLDOWN_MAX = 8000;

function updateHardcoreDiverPattern(enemy, dt, step) {
  _initHardcoreDiverState(enemy);

  var st = enemy._hcDiverState;
  enemy._hcDiverTimer += dt;

  // ---- idle ----
  if (st === 'idle') {
    enemy._hcDiverCooldown = Math.max(0, enemy._hcDiverCooldown - dt);

    if (enemy._hcDiverCooldown <= 0 && typeof player !== 'undefined' && player) {
      var px = player.x + player.width / 2;
      var py = player.y + player.height / 2;
      var ex = enemy.x + (enemy.w || 24) / 2;
      var ey = enemy.y + (enemy.h || 24) / 2;
      var dist = Math.hypot(px - ex, py - ey);

      var chancePerSec = 0.06 + (typeof level === 'number' ? level : 1) * 0.004;
      if (dist < 180) chancePerSec += 0.05;
      var frameChance = chancePerSec * (dt / 1000);

      if (Math.random() < frameChance) {
        enemy._hcDiverState = 'telegraph';
        enemy._hcDiverTimer = 0;
        enemy._hcDiverTargetX = px;
        enemy._hcDiverTargetY = py;
        enemy._hcDiverHomeX = enemy.x;
        enemy._hcDiverHomeY = enemy.y;
        enemy.flashTimer = HC_DIVER_TELEGRAPH_MS;
        if (typeof sfxUIClick === 'function') sfxUIClick();
      }
    }
    return;
  }

  // ---- telegraph ----
  if (st === 'telegraph') {
    enemy.flashTimer = Math.max(enemy.flashTimer, 110);

    if (enemy._hcDiverTimer >= HC_DIVER_TELEGRAPH_MS) {
      enemy._hcDiverState = 'diving';
      enemy._hcDiverTimer = 0;
      enemy.diving = true;

      var data = (typeof ENEMY_TYPES !== 'undefined' && ENEMY_TYPES[enemy.type]) ? ENEMY_TYPES[enemy.type] : { speed: 0.6 };
      var diveSettings = typeof getDifficultySettings === 'function'
        ? getDifficultySettings(typeof level === 'number' ? level : 1)
        : { diveSpeed: 2.8 };
      var baseSpeed = diveSettings.diveSpeed * (data.speed || 1) * 1.15;
      var ex2 = enemy.x + (enemy.w || 24) / 2;
      var ey2 = enemy.y + (enemy.h || 24) / 2;
      var angle = Math.atan2(enemy._hcDiverTargetY - ey2, enemy._hcDiverTargetX - ex2);

      enemy.vx = Math.cos(angle) * baseSpeed;
      enemy.vy = Math.sin(angle) * baseSpeed;
      enemy.movePattern = 'straight_down';

      if (typeof pushScreenShake === 'function') pushScreenShake('light', 2);
    }
    return;
  }

  // ---- diving (off-screen detection for recovery transition) ----
  if (st === 'diving') {
    // HC-49: dive trail tracking
    if (!enemy._hcDiverTrail) enemy._hcDiverTrail = [];
    enemy._hcDiverTrail.push({ x: enemy.x + (enemy.w || 24) / 2, y: enemy.y + (enemy.h || 24) / 2 });
    if (enemy._hcDiverTrail.length > 5) enemy._hcDiverTrail.shift();

    if (enemy.y > H + 40 || enemy.x < -80 || enemy.x > W + 80) {
      enemy._hcDiverState = 'recovering';
      enemy._hcDiverTimer = 0;
      enemy._hcDiverRecoveryFlash = 280; // ms for recovery fade visual
      enemy.diving = false;
      enemy.vx = 0;
      enemy.vy = 0;
      enemy.y = -50;
      enemy.x = typeof clamp === 'function'
        ? clamp(enemy._hcDiverHomeX, 20, W - 20 - (enemy.w || 24))
        : Math.max(20, Math.min(W - 20 - (enemy.w || 24), enemy._hcDiverHomeX));
    }
    return;
  }

  // ---- recovering ----
  if (st === 'recovering') {
    var homeX = typeof clamp === 'function'
      ? clamp(enemy._hcDiverHomeX, 20, W - 20 - (enemy.w || 24))
      : Math.max(20, Math.min(W - 20 - (enemy.w || 24), enemy._hcDiverHomeX));
    var homeY = enemy._hcDiverHomeY;
    var recoverSpeed = 3.2 * step;
    var dx = homeX - enemy.x;
    var dy = homeY - enemy.y;
    var rdist = Math.hypot(dx, dy);

    if (rdist < recoverSpeed || enemy.y >= homeY) {
      enemy.x = homeX;
      enemy.y = homeY;
      enemy.vx = 0;
      enemy.vy = 0;
      enemy._hcDiverState = 'idle';
      enemy._hcDiverTimer = 0;
      enemy._hcDiverTrail = [];
      var baseCd = HC_DIVER_COOLDOWN_MIN + Math.random() * (HC_DIVER_COOLDOWN_MAX - HC_DIVER_COOLDOWN_MIN);
      // HC-RK-04: apply rank cooldown through safety governor
      var rankCdResult = (typeof window.getHardcoreRankGameplayCooldown === 'function')
        ? window.getHardcoreRankGameplayCooldown(baseCd)
        : { multiplier: 1.00, capped: false, governorApproved: false };
      if (typeof window.recordHardcoreRankGameplayApply === 'function' && rankCdResult.governorApproved) {
        window.recordHardcoreRankGameplayApply('cooldown', rankCdResult.capped);
      }
      var pressureMult = (typeof window.getHardcorePressureCooldownScale === 'function') ? window.getHardcorePressureCooldownScale() : 1;
      enemy._hcDiverCooldown = baseCd * rankCdResult.multiplier * pressureMult;
      var diverSeed = (enemy.x * 7919 + enemy.y * 65537) | 0;
      var diverOffset = (typeof window.getHardcorePressureTimingOffset === 'function') ? window.getHardcorePressureTimingOffset(diverSeed, 50) : 0;
      enemy._hcDiverCooldown += diverOffset;
      if (enemy._hcDiverCooldown < 800) enemy._hcDiverCooldown = 800;
      if (typeof resetEnemyMovePattern === 'function') resetEnemyMovePattern(enemy);
    } else {
      enemy.x += (dx / rdist) * recoverSpeed;
      enemy.y += (dy / rdist) * recoverSpeed;
    }
  }
}

// ============================================================
// HARDCORE SUPPRESSOR PATTERN (alien4)
// ============================================================

function shouldFireHardcoreSuppressorPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'suppressor') return false;
  if (enemy.diving) return false;
  return true;
}

var HC_SUPPRESSOR_COOLDOWN_MIN = 2000;
var HC_SUPPRESSOR_COOLDOWN_MAX = 3500;

function fireHardcoreSuppressorBurst(enemy) {
  if (!enemy) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  var sx = enemy.x + (enemy.w || 24) / 2;
  var sy = enemy.y + (enemy.h || 24);
  var bulletSpeed = 2.6;

  if (typeof getDifficultySettings === 'function') {
    var settings = getDifficultySettings(typeof level === 'number' ? level : 1);
    if (settings && typeof settings.bulletSpeed === 'number') {
      bulletSpeed = settings.bulletSpeed * 0.82;
    }
  }

  // 3-bullet lateral fan: center, left sweep, right sweep
  // HC-45: apply pressure micro-stagger to fan timing
  var fanSeed = (enemy.x * 7919 + enemy.y * 65537) | 0;
  var fanOffset = (typeof window.getHardcorePressureTimingOffset === 'function') ? window.getHardcorePressureTimingOffset(fanSeed, 50) : 0;
  var fanAbs = Math.abs(fanOffset);

  var angles = [
    Math.PI / 2,               // straight down (center, fires at 0)
    Math.PI / 2 - 0.22,        // left bias (fires at +offset if positive)
    Math.PI / 2 + 0.22         // right bias
  ];

  // center bullet: fires immediately
  pushEnemyBullet(sx - 2, sy, Math.cos(angles[0]) * bulletSpeed, Math.sin(angles[0]) * bulletSpeed, 5, 9, {
    kind: 'crossfire_b',
    color: '#ff6688',
    sourceType: enemy.type || 'alien4'
  });

  // side bullets: staggered by fanAbs ms
  if (fanAbs > 0) {
    setTimeout(function() {
      pushEnemyBullet(sx - 2, sy, Math.cos(angles[1]) * bulletSpeed, Math.sin(angles[1]) * bulletSpeed, 5, 9, {
        kind: 'crossfire_b',
        color: '#ff6688',
        sourceType: enemy.type || 'alien4'
      });
    }, fanAbs);
    setTimeout(function() {
      pushEnemyBullet(sx - 2, sy, Math.cos(angles[2]) * bulletSpeed, Math.sin(angles[2]) * bulletSpeed, 5, 9, {
        kind: 'crossfire_b',
        color: '#ff6688',
        sourceType: enemy.type || 'alien4'
      });
    }, fanAbs);
  } else {
    pushEnemyBullet(sx - 2, sy, Math.cos(angles[1]) * bulletSpeed, Math.sin(angles[1]) * bulletSpeed, 5, 9, {
      kind: 'crossfire_b',
      color: '#ff6688',
      sourceType: enemy.type || 'alien4'
    });
    pushEnemyBullet(sx - 2, sy, Math.cos(angles[2]) * bulletSpeed, Math.sin(angles[2]) * bulletSpeed, 5, 9, {
      kind: 'crossfire_b',
      color: '#ff6688',
      sourceType: enemy.type || 'alien4'
    });
  }

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien5');
  }

  if (typeof sfxUIClick === 'function') sfxUIClick();

  return true;
}

// HC-47: fires chaser side shots after telegraph expires (called from update loop)
function _fireChaserTelegraphSideShots(enemy) {
  if (!enemy || typeof pushEnemyBullet !== 'function') return;

  var sx = enemy.x + (enemy.w || 24) / 2;
  var sy = enemy.y + (enemy.h || 24);
  var bulletSpeed = (typeof enemy._chaserTelegraphBulletSpeed === 'number') ? enemy._chaserTelegraphBulletSpeed : 2.8;

  var sideAngle = 0.38;
  var dAngle = Math.PI / 2;
  var sideVxLeft = Math.cos(dAngle - sideAngle) * bulletSpeed * 0.88;
  var sideVyLeft = Math.sin(dAngle - sideAngle) * bulletSpeed * 0.88;
  var sideVxRight = Math.cos(dAngle + sideAngle) * bulletSpeed * 0.88;
  var sideVyRight = Math.sin(dAngle + sideAngle) * bulletSpeed * 0.88;

  var chaserSeed = (typeof enemy._chaserTelegraphSeed === 'number') ? enemy._chaserTelegraphSeed : ((enemy.x * 7919 + enemy.y * 65537) | 0);
  var chaserOffset = (typeof window.getHardcorePressureTimingOffset === 'function') ? window.getHardcorePressureTimingOffset(chaserSeed, 50) : 0;
  var chaserAbs = Math.abs(chaserOffset);

  function _push() {
    pushEnemyBullet(sx - 2, sy, sideVxLeft, sideVyLeft, 5, 9, {
      kind: 'basic',
      color: '#ff7744',
      sourceType: enemy.type || 'alien5'
    });
    pushEnemyBullet(sx - 2, sy, sideVxRight, sideVyRight, 5, 9, {
      kind: 'basic',
      color: '#ff7744',
      sourceType: enemy.type || 'alien5'
    });
  }

  if (chaserAbs > 0) {
    setTimeout(_push, chaserAbs);
  } else {
    _push();
  }
}

// ============================================================
// HARDCORE SWEEPER PATTERN (alien1)
// ============================================================

function shouldUseHardcoreSweeperPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'sweeper') return false;
  if (enemy.diving) return false;
  return true;
}

function updateHardcoreSweeperOscillation(enemy) {
  if (enemy._hcSweeperPhase === undefined) {
    enemy._hcSweeperPhase = enemy.x * 0.14 + enemy.y * 0.11 + (enemy.row || 0) * 1.9 + Math.random() * 0.45;
    enemy._hcSweeperOscX = 0;
    enemy._hcSweeperOscY = 0;
  }

  var time = typeof globalTime === 'number' ? globalTime : 0;
  var freqX = 0.0055;
  var freqY = 0.0042;
  var ampX = 2.2;
  var ampY = 1.3;

  var newOscX = Math.sin(time * freqX + enemy._hcSweeperPhase) * ampX;
  var newOscY = Math.cos(time * freqY + enemy._hcSweeperPhase + 1.1) * ampY;

  enemy.x += newOscX - enemy._hcSweeperOscX;
  enemy.y += newOscY - enemy._hcSweeperOscY;

  enemy._hcSweeperOscX = newOscX;
  enemy._hcSweeperOscY = newOscY;
}

var HC_SWEEPER_COOLDOWN_MIN = 3200;
var HC_SWEEPER_COOLDOWN_MAX = 5500;

function fireHardcoreSweeperFan(enemy) {
  if (!enemy) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  var sx = enemy.x + (enemy.w || 24) / 2;
  var sy = enemy.y + (enemy.h || 24);
  var bulletSpeed = 2.4;

  if (typeof getDifficultySettings === 'function') {
    var settings = getDifficultySettings(typeof level === 'number' ? level : 1);
    if (settings && typeof settings.bulletSpeed === 'number') {
      bulletSpeed = settings.bulletSpeed * 0.78;
    }
  }

  var fanCount = 5;
  var spreadAngle = 0.70;
  var startAngle = Math.PI / 2 - spreadAngle / 2;

  for (var i = 0; i < fanCount; i++) {
    var angle = startAngle + (spreadAngle / (fanCount - 1)) * i;
    pushEnemyBullet(sx - 2, sy, Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed, 5, 9, {
      kind: 'basic',
      color: '#88ddff',
      sourceType: enemy.type || 'alien1'
    });
  }

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien1');
  }

  return true;
}

// ============================================================
// HARDCORE CHASER PATTERN (alien5)
// ============================================================

function shouldUseHardcoreChaserPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'chaser') return false;
  return true;
}

var HC_CHASER_COOLDOWN_MIN = 2000;
var HC_CHASER_COOLDOWN_MAX = 3600;

function fireHardcoreChaserBurst(enemy) {
  if (!enemy) return false;
  if (enemy.diving) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  var sx = enemy.x + (enemy.w || 24) / 2;
  var sy = enemy.y + (enemy.h || 24);
  var bulletSpeed = 2.9;

  if (typeof getDifficultySettings === 'function') {
    var settings = getDifficultySettings(typeof level === 'number' ? level : 1);
    if (settings && typeof settings.bulletSpeed === 'number') {
      bulletSpeed = settings.bulletSpeed * 0.82;
    }
  }

  var angleToPlayer = typeof getAngleToPlayer === 'function'
    ? getAngleToPlayer(enemy)
    : Math.PI / 2;

  pushEnemyBullet(sx - 3, sy, Math.cos(angleToPlayer) * bulletSpeed, Math.sin(angleToPlayer) * bulletSpeed, 6, 10, {
    kind: 'crossfire_a',
    color: '#ff6633',
    sourceType: enemy.type || 'alien5'
  });

  enemy._chaserTelegraphActive = true;
  enemy._chaserTelegraphTimer = 180;
  enemy._chaserTelegraphFiredAt = (typeof globalTime !== 'undefined') ? globalTime : Date.now();
  enemy._chaserTelegraphBulletSpeed = bulletSpeed;
  enemy._chaserTelegraphSeed = (enemy.x * 7919 + enemy.y * 65537) | 0;

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien5');
  }

  if (typeof sfxUIClick === 'function') sfxUIClick();

  return true;
}

// ============================================================
// HARDCORE FLANKER PATTERN (alien6)
// ============================================================

function shouldUseHardcoreFlankerPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'flanker') return false;
  if (enemy.diving) return false;
  return true;
}

var HC_FLANKER_COOLDOWN_MIN = 2800;
var HC_FLANKER_COOLDOWN_MAX = 4600;

function fireHardcoreFlankerCrossfire(enemy) {
  if (!enemy) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  var sx = enemy.x + (enemy.w || 24) / 2;
  var sy = enemy.y + (enemy.h || 24);
  var bulletSpeed = 2.5;

  if (typeof getDifficultySettings === 'function') {
    var settings = getDifficultySettings(typeof level === 'number' ? level : 1);
    if (settings && typeof settings.bulletSpeed === 'number') {
      bulletSpeed = settings.bulletSpeed * 0.80;
    }
  }

  var screenCenterX = (typeof W === 'number' ? W : 360) / 2;
  var isLeft = sx < screenCenterX;
  var aimAngle;

  if (typeof player !== 'undefined' && player) {
    var px = player.x + player.width / 2;
    var py = player.y + player.height / 2;
    aimAngle = isLeft
      ? Math.atan2(py - sy, px - sx + 40)
      : Math.atan2(py - sy, px - sx - 40);
  } else {
    aimAngle = isLeft ? Math.PI / 2 - 0.30 : Math.PI / 2 + 0.30;
  }

  pushEnemyBullet(sx - 2, sy, Math.cos(aimAngle) * bulletSpeed, Math.sin(aimAngle) * bulletSpeed, 5, 9, {
    kind: 'crossfire_b',
    color: '#cc88ff',
    sourceType: enemy.type || 'alien6'
  });

  pushEnemyBullet(sx - 2, sy, Math.cos(aimAngle + 0.18) * bulletSpeed * 0.90, Math.sin(aimAngle + 0.18) * bulletSpeed * 0.90, 5, 9, {
    kind: 'crossfire_b',
    color: '#cc88ff',
    sourceType: enemy.type || 'alien6'
  });

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien6');
  }

  return true;
}

// ============================================================
// HARDCORE BAITER PATTERN (alien_mini)
// ============================================================

function shouldUseHardcoreBaiterPattern(enemy) {
  if (!shouldUseHardcorePattern(enemy)) return false;
  if (getEnemyPatternRole(enemy) !== 'baiter') return false;
  return true;
}

var HC_BAITER_COOLDOWN_MIN = 1800;
var HC_BAITER_COOLDOWN_MAX = 3200;

function fireHardcoreBaiterBurst(enemy) {
  if (!enemy) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  var sx = enemy.x + (enemy.w || 12) / 2;
  var sy = enemy.y + (enemy.h || 12);
  var bulletSpeed = 2.1;

  if (typeof getDifficultySettings === 'function') {
    var settings = getDifficultySettings(typeof level === 'number' ? level : 1);
    if (settings && typeof settings.bulletSpeed === 'number') {
      bulletSpeed = settings.bulletSpeed * 0.65;
    }
  }

  var count = 3;
  for (var i = 0; i < count; i++) {
    var offsetAngle = (i - 1) * 0.22 + (Math.random() - 0.5) * 0.15;
    var angle = Math.PI / 2 + offsetAngle;
    pushEnemyBullet(sx - 2, sy, Math.cos(angle) * bulletSpeed, Math.sin(angle) * bulletSpeed, 4, 8, {
      kind: 'basic',
      color: '#ff9966',
      sourceType: enemy.type || 'alien_mini'
    });
  }

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien_mini');
  }

  return true;
}
