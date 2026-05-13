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
    if (enemy.y > H + 40 || enemy.x < -80 || enemy.x > W + 80) {
      enemy._hcDiverState = 'recovering';
      enemy._hcDiverTimer = 0;
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
      enemy._hcDiverCooldown = HC_DIVER_COOLDOWN_MIN + Math.random() * (HC_DIVER_COOLDOWN_MAX - HC_DIVER_COOLDOWN_MIN);
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
  var angles = [
    Math.PI / 2,               // straight down
    Math.PI / 2 - 0.22,        // left bias
    Math.PI / 2 + 0.22         // right bias
  ];

  for (var i = 0; i < angles.length; i++) {
    var vx = Math.cos(angles[i]) * bulletSpeed;
    var vy = Math.sin(angles[i]) * bulletSpeed;

    pushEnemyBullet(sx - 2, sy, vx, vy, 5, 9, {
      kind: 'crossfire_b',
      color: '#ff6688',
      sourceType: enemy.type || 'alien4'
    });
  }

  if (typeof createEnemyMuzzleFlash === 'function') {
    createEnemyMuzzleFlash(sx, sy, enemy.type || 'alien4');
  }

  if (typeof sfxUIClick === 'function') sfxUIClick();

  return true;
}
