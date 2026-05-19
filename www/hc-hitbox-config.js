// ============================================================
// HC-HB-01 — Centralized Hitbox & Collision Config
// ============================================================
// Read-only dimension registry for all collision entities.
// Does NOT change gameplay. Does NOT replace collision checks.
// ============================================================

window.HC_HITBOX = {

  // --- VERSION & FREEZE ---
  _version: 1,
  _freeze: false,

  // ============================================================
  // PLAYER
  // ============================================================
  player: {

    // Visual sprite bounds (factories.js:createPlayer)
    sprite: {
      w: 33,
      h: 24
    },

    // Hurtbox (what kills the player)
    hurtbox: {
      // normal mode: full AABB equals sprite
      normal: {
        w: 33,
        h: 24
      },
      // hardcore mode: circle at sprite center (game-config.js:player.hardcoreHitRadius)
      hardcore: {
        radius: 3
      }
    },

    // Speed
    speed: {
      x: 5,
      y: 4
    },

    // Starting position
    start: {
      x: null,   // computed as W/2 - 16
      y: null    // computed as H - 40
    },

    // Debug visualization
    debugColor: '#ff4444',
    debugFillAlpha: 0.25,
    debugStrokeAlpha: 0.85
  },

  // ============================================================
  // ENEMIES — body hitbox (computed from sprite × 3)
  // ============================================================
  enemies: {

    fallbackW: 24,
    fallbackH: 24,

    types: {
      alien1:      { w: 24, h: 24, spriteCols: 8,  spriteRows: 8  },
      alien2:      { w: 33, h: 24, spriteCols: 11, spriteRows: 8  },
      alien3:      { w: 30, h: 24, spriteCols: 10, spriteRows: 8  },
      alien4:      { w: 21, h: 18, spriteCols: 7,  spriteRows: 6  },
      alien5:      { w: 21, h: 18, spriteCols: 7,  spriteRows: 6  },
      alien6:      { w: 33, h: 24, spriteCols: 11, spriteRows: 8  },
      alien_mini:  { w: 12, h: 12, spriteCols: 4,  spriteRows: 4  }
    },

    debugColor: '#44ff44'
  },

  // ============================================================
  // UFO
  // ============================================================
  ufo: {
    w: 42,
    h: 21,
    speedX: 2,
    debugColor: '#ff88ff'
  },

  // ============================================================
  // BOSS — hitbox defaults (overridden per pattern in initBoss)
  // ============================================================
  boss: {

    defaultW: 90,
    defaultH: 45,

    patterns: {
      crossfire:  { w: 90, h: 45, name: 'CrabTron' },
      zigzag:     { w: 90, h: 45, name: 'Serpentrix' },
      rotate:     { w: 90, h: 45, name: 'Orbital' },
      divebomb:   { w: 90, h: 45, name: 'Teniente' },
      supreme:    { w: 90, h: 45, name: 'Emperador' }
    },

    debugColor: '#ffdd44'
  },

  // ============================================================
  // MINES (Serpentrix boss)
  // ============================================================
  mines: {
    radius: 12,
    maxAlive: 8,
    lifeMs: 14000,
    vy: 0.5,
    debugColor: '#88ff44',
    normalPlayerRadius: 15   // used in checkPlayerCollisionCircle()
  },

  // ============================================================
  // SATELLITES (Orbital boss)
  // ============================================================
  satellites: {
    radius: 8,
    distance: 70,
    distancePhase3: 80,
    speed: 0.03,
    shootCooldownMs: 2000,
    debugColor: '#44ffff',
    normalPlayerRadius: 12
  },

  // ============================================================
  // BOSS MINIONS (Emperador boss)
  // ============================================================
  bossMinions: {
    w: 24,
    h: 24,
    debugColor: '#ff8844'
  },

  // ============================================================
  // PLAYER BULLETS
  // ============================================================
  bullets: {
    player: {
      normal:  { w: 4,  h: 10, vy: -8,  vx:  0, type: 'normal',  piercing: false },
      double:  { w: 3,  h: 8,  vy: -8,  vx:  0, type: 'double',  piercing: false },
      spread:  { w: 4,  h: 8,  vy: -8,  vx:  0, type: 'spread',  piercing: false, vxSpread: [-2, 2] },
      machine: { w: 3,  h: 6,  vy: -12, vx:  0, type: 'machine', piercing: false },
      laser:   { w: 6,  h: 24, vy: -15, vx:  0, type: 'laser',   piercing: true  }
    },

    // Enemy bullets — basic default (pushEnemyBullet defaults)
    enemy: {
      fallbackW: 4,
      fallbackH: 10,

      // catalogued by kind
      kinds: {
        basic:             { w: 4,  h: 10 },
        crossfire_a:       { w: 4,  h: 10 },
        crossfire_b:       { w: 4,  h: 10 },
        fortress:          { w: 3,  h: 12 },
        split_fan:         { w: 4,  h: 9  },
        orb:               { w: 6,  h: 6  },
        shmup_basic:       { w: 4,  h: 10 },
        shmup_aimed:       { w: 4,  h: 10 },
        shmup_sweep:       { w: 4,  h: 10 },
        shmup_heavy:       { w: 6,  h: 12 },
        shmup_spread:      { w: 4,  h: 10 }
      }
    },

    // Boss bullets — catalogued by boss pattern + attack name
    boss: {
      crossfire: {
        clawClamp:      { w: 8,  h: 8  },
        diagonal:       { w: 6,  h: 6  },
        cross:          { w: 6,  h: 6  },
        pincer:         { w: 8,  h: 8  },
        pincerAimed:    { w: 6,  h: 10 },
        verticalLaser:  { w: 5,  h: 15 },
        simpleDown:     { w: 6,  h: 10 }
      },
      zigzag: {
        fan:            { w: 6,  h: 15 },
        venom:          { w: 10, h: 10 }
      },
      rotate: {
        spiral:         { w: 6,  h: 6  },
        pulse:          { w: 8,  h: 8  },
        tractorBeam:    { w: 4,  h: 12 }
      },
      divebomb: {
        aimed:          { w: 8,  h: 14 },
        sides:          { w: 5,  h: 10 },
        impactBurst:    { w: 8,  h: 8  }
      },
      supreme: {
        triple:         { w: 6,  h: 12 },
        tripleCenter:   { w: 8,  h: 14 },
        spread:         { w: 6,  h: 12 },
        imperialRay:    { w: 10, h: 10 },
        cross:          { w: 8,  h: 8  },
        spiral:         { w: 6,  h: 6  },
        wave:           { w: 6,  h: 6  },
        tripleReinforced:  { w: 8,  h: 14 },
        tripleReinforcedCenter: { w: 10, h: 16 },
        fanReinforced:  { w: 5,  h: 10 },
        teleportWave:   { w: 8,  h: 8  }
      },
      // boss immediate counter
      counter: {
        homing:         { w: 10, h: 20 }
      }
    },

    debugColor: '#ff8844',
    debugBossColor: '#cc2222'
  },

  // ============================================================
  // PICKUPS
  // ============================================================
  pickups: {
    powerUp: {
      w: 12,
      h: 12,
      vy: 2,
      debugColor: '#44ffff'
    },
    ufoReward: {
      w: 16,
      h: 16,
      vy: 2.2,
      debugColor: '#44ffff'
    }
  },

  // ============================================================
  // GRAZE
  // ============================================================
  graze: {
    radius: 24,       // distance from player center to count as graze
    score: 5,
    debugColor: '#4488ff',
    debugFillAlpha: 0.06
  },

  // ============================================================
  // SPAWN SAFETY
  // ============================================================
  spawn: {
    // minimum distance from player center for ANY hostile spawn
    safetyRadius: 80,

    // per-entity overrides
    enemyMinDistance: 80,
    bossMinDistance: 120,
    bossMinionMinDistance: 80,
    setPieceEntryMinDistance: 50,

    debugColor: '#ffffff',
    debugFillAlpha: 0.08
  },

  // ============================================================
  // FAIRNESS — tunneling prevention
  // ============================================================
  fairness: {
    // If an entity moves more than this fraction of its height per frame,
    // sweep-based collision should be considered.
    // Currently only theoretical; laser is piercing and enemy max vy ≈ 7 @ step≈1 = 7px < min entity 12px
    tunnelingThreshold: 0.95,

    // pickups use same hurtbox as lethal collisions in hardcore mode
    pickupUseHurtbox: true
  },

  // ============================================================
  // DEBUG COLORS
  // ============================================================
  debug: {
    lineWidths: {
      player: 1.5,
      enemy: 1,
      bullet: 1,
      bossBullet: 1.5,
      boss: 2,
      pickup: 1,
      graze: 0.5,
      spawn: 1
    },
    alphas: {
      stroke: 0.85,
      fill: 0.12
    },
    colors: {
      playerHurtbox:      '#ff4444',
      playerSprite:       '#ff6666',
      enemyBody:          '#44ff44',
      enemyBullet:        '#ff8844',
      bossBody:           '#ffdd44',
      bossBullet:         '#cc2222',
      pickup:             '#44ffff',
      graze:              '#4488ff',
      laser:              '#ff44ff',
      mine:               '#88ff44',
      satellite:          '#44ffff',
      spawnSafety:        '#ffffff',
      bossMinion:         '#ff8844',
      fairnessViolation:  '#ff0000'
    }
  }

};

// ============================================================
// GLOBAL HELPER FUNCTIONS (read-only, no gameplay changes)
// ============================================================

var _HC_HITBOX_DEFAULTS = window.HC_HITBOX;

function getHCHitboxConfig() {
  var cfg = window.HC_HITBOX;
  if (!cfg || typeof cfg !== 'object') return _HC_HITBOX_DEFAULTS;
  return cfg;
}

function getHCHitboxDebugConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.debug || _HC_HITBOX_DEFAULTS.debug;
}

function getHCHitboxSpawnSafetyConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.spawn || _HC_HITBOX_DEFAULTS.spawn;
}

function getHCHitboxPlayerConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.player || _HC_HITBOX_DEFAULTS.player;
}

function getHCHitboxEnemyConfig(type) {
  var cfg = getHCHitboxConfig();
  var types = cfg.enemies && cfg.enemies.types ? cfg.enemies.types : _HC_HITBOX_DEFAULTS.enemies.types;
  return (type && types[type]) ? types[type] : {
    w: cfg.enemies.fallbackW || 24,
    h: cfg.enemies.fallbackH || 24
  };
}

function getHCHitboxBossConfig(pattern) {
  var cfg = getHCHitboxConfig();
  var patterns = cfg.boss && cfg.boss.patterns ? cfg.boss.patterns : _HC_HITBOX_DEFAULTS.boss.patterns;
  if (pattern && patterns[pattern]) return patterns[pattern];
  return { w: cfg.boss.defaultW || 90, h: cfg.boss.defaultH || 45 };
}

function getHCHitboxPickupConfig(kind) {
  var cfg = getHCHitboxConfig();
  var pickups = cfg.pickups || _HC_HITBOX_DEFAULTS.pickups;
  if (kind === 'ufoReward') return pickups.ufoReward;
  return pickups.powerUp;
}

function getHCHitboxGrazeConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.graze || _HC_HITBOX_DEFAULTS.graze;
}

function getHCHitboxMineConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.mines || _HC_HITBOX_DEFAULTS.mines;
}

function getHCHitboxSatelliteConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.satellites || _HC_HITBOX_DEFAULTS.satellites;
}

function getHCHitboxBossBulletConfig(pattern, attack) {
  var cfg = getHCHitboxConfig();
  var bossBullets = (cfg.bullets && cfg.bullets.boss) ? cfg.bullets.boss : _HC_HITBOX_DEFAULTS.bullets.boss;
  if (pattern && bossBullets[pattern] && attack && bossBullets[pattern][attack]) {
    return bossBullets[pattern][attack];
  }
  return { w: 6, h: 6 };
}

function getHCHitboxPlayerBulletConfig(weaponType) {
  var cfg = getHCHitboxConfig();
  var playerBullets = (cfg.bullets && cfg.bullets.player) ? cfg.bullets.player : _HC_HITBOX_DEFAULTS.bullets.player;
  if (weaponType && playerBullets[weaponType]) return playerBullets[weaponType];
  return playerBullets.normal;
}

function getHCHitboxEnemyBulletConfig(kind) {
  var cfg = getHCHitboxConfig();
  var kinds = (cfg.bullets && cfg.bullets.enemy && cfg.bullets.enemy.kinds)
    ? cfg.bullets.enemy.kinds
    : _HC_HITBOX_DEFAULTS.bullets.enemy.kinds;
  if (kind && kinds[kind]) return kinds[kind];
  return { w: cfg.bullets.enemy.fallbackW || 4, h: cfg.bullets.enemy.fallbackH || 10 };
}

function getHCHitboxUfoConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.ufo || _HC_HITBOX_DEFAULTS.ufo;
}

function getHCHitboxBossMinionConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.bossMinions || _HC_HITBOX_DEFAULTS.bossMinions;
}

function getHCHitboxFairnessConfig() {
  var cfg = getHCHitboxConfig();
  return cfg.fairness || _HC_HITBOX_DEFAULTS.fairness;
}

// HC-HB debugging gate — respects game-config.js debug flags
function isHCHitboxDebugEnabled() {
  if (typeof window.GALAXY_CONFIG !== 'object') return false;
  if (!window.GALAXY_CONFIG.debug) return false;
  return !!window.GALAXY_CONFIG.debug.showHitboxDebug;
}
