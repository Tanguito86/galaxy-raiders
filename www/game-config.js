// ==============================
// GALAXY RAIDERS - game-config.js
// Configuracion base para modo hardcore y sistemas relacionados
// ==============================

window.GALAXY_CONFIG = {

  // ============ HARDCORE MASTER SWITCH ============
  hardcore: {
    enabled: true   // HC-12: hardcore only
  },

  // ============ PLAYER (hitbox reducida en hardcore) ============
  player: {
    hardcoreHitRadius: 3,
    showHitbox: false
  },

  // ============ GRAZE (roce de balas) ============
  graze: {
    enabled: true,   // HC-12: active by default
    radius: 24,
    score: 5
  },

  // ============ RANK (dificultad dinamica) ============
  rank: {
    enabled: true,
    baseLevel: 0,
    min: 0,
    max: 100,
    maxLevel: 5,
    bulletSpeedMax: 1.12,
    cooldownMin: 0.88,
    multiplierMax: 1.5,
    decayDelayMs: 6000,
    decayAmount: 0.15,
    decayIntervalMs: 1000
  },

  // ============ BULLETS (efectos visuales) ============
  bullets: {
    enemyGlow: false,
    bossGlow: false
  },

  // ============ SCORE (combo y multiplicadores) ============
  score: {
    comboEnabled: true   // HC-12: active by default
  },

  // ============ COMBO (sistema de combo hardcore) ============
  combo: {
    enabled: true,
    timeoutMs: 2500,
    maxMultiplier: 2.0,
    graceMs: 350,
    warningMs: 700
  },

  // ============ PRESSURE (HC-43/44: wave pressure director) ============
  pressure: {
    enabled: true,
    minMultiplier: 1.00,
    maxMultiplier: 1.18,
    levels: {
      LOW: 1.00,
      NORMAL: 1.06,
      HIGH: 1.12,
      MAX: 1.18
    }
  },

  // ============ RHYTHM (HC-78/79: stage wave rhythm) ============
  rhythm: {
    enabled: true,
    wavePauseMinScale: 0.75,
    introMinScale: 0.72,
    entryDelayMinScale: 0.70
  },

  // ============ BACKGROUND ============
  background: {
    hc90Enabled: true,
    nebulaEnabled: true,
    colorGradingEnabled: true,
    maxStars: 180
  },

  // ============ ATMOSPHERE ============
  atmosphere: {
    enabled: true,
    dustEnabled: true,
    speedLinesEnabled: true,
    ambientFlashEnabled: true
  },

  // ============ SPRITES ============
  sprites: {
    enabled: true,
    fallbackToLegacy: true,
    debugMissingSprites: false
  },

  // ============ BOSS AI MOVEMENT ============
  bossAI: {
    enabled: true,
    maxOffsetX: 70,
    maxOffsetY: 35
  },

  // ============ DEBUG ============
  debug: {
    showHardcoreInfo: false,
    showRank: false,
    showHardcoreSystems: false,
    showEnemyRoles: false,
    showBossPattern: false,
    showBossDispatch: false,
    showBackgroundStats: false,
    showAtmosphereStats: false,
    showLevelSkipButton: false
  }

};
