// ==========================================
// GALAXY RAIDERS - enemy-identity.js
// Sistema de identidad/roles para enemigos
// ==========================================

var _ENEMY_IDENTITY_MAP = {
  alien1: {
    role: 'swarm',
    patternHint: 'basic_pressure',
    label: 'Drone'
  },
  alien2: {
    role: 'sniper',
    patternHint: 'aimed_shots',
    label: 'Marksman'
  },
  alien3: {
    role: 'diver',
    patternHint: 'aggressive_dive',
    label: 'Breacher'
  },
  alien4: {
    role: 'suppressor',
    patternHint: 'lateral_sweep',
    label: 'Flanker'
  },
  alien5: {
    role: 'elite',
    patternHint: 'mixed_pressure',
    label: 'Elite'
  },
  alien6: {
    role: 'splitter',
    patternHint: 'frag_swarm',
    label: 'Splitter'
  },
  alien_mini: {
    role: 'fragment',
    patternHint: 'rush',
    label: 'Fragment'
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
