// ==========================================
// GALAXY RAIDERS - enemy-identity.js
// Sistema de identidad/roles para enemigos
// ==========================================

var _ENEMY_IDENTITY_MAP = {
  alien1: {
    role: 'sweeper',
    patternHint: 'wide_sweep',
    label: 'Sweeper'
  },
  alien2: {
    role: 'sniper',
    patternHint: 'aimed_shots',
    label: 'Sniper'
  },
  alien3: {
    role: 'diver',
    patternHint: 'aggressive_dive',
    label: 'Diver'
  },
  alien4: {
    role: 'suppressor',
    patternHint: 'lateral_sweep',
    label: 'Suppressor'
  },
  alien5: {
    role: 'chaser',
    patternHint: 'player_pursuit',
    label: 'Chaser'
  },
  alien6: {
    role: 'flanker',
    patternHint: 'side_flank',
    label: 'Flanker'
  },
  alien_mini: {
    role: 'baiter',
    patternHint: 'erratic_bait',
    label: 'Baiter'
  },
  ufo: {
    role: 'bonus',
    patternHint: 'reward',
    label: 'UFO'
  },
  _unknown: {
    role: 'basic',
    patternHint: 'default',
    label: 'Unknown'
  }
};

// --- helpers ---

function __resolveEnemyType(enemyOrType) {
  if (!enemyOrType) return '_unknown';
  if (typeof enemyOrType === 'string') return enemyOrType;
  if (typeof enemyOrType === 'object' && enemyOrType.type) return enemyOrType.type;
  return '_unknown';
}

function getEnemyIdentity(enemyOrType) {
  var type = __resolveEnemyType(enemyOrType);
  if (_ENEMY_IDENTITY_MAP[type]) return _ENEMY_IDENTITY_MAP[type];
  return _ENEMY_IDENTITY_MAP._unknown;
}

function getEnemyRole(enemyOrType) {
  return getEnemyIdentity(enemyOrType).role;
}

function isEnemyRole(enemyOrType, role) {
  if (typeof role !== 'string') return false;
  return getEnemyRole(enemyOrType) === role;
}

function getEnemyPatternHint(enemyOrType) {
  return getEnemyIdentity(enemyOrType).patternHint;
}

function getEnemyLabel(enemyOrType) {
  return getEnemyIdentity(enemyOrType).label;
}
