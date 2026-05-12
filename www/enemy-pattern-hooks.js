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
