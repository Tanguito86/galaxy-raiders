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
