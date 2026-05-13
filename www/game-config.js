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
    score: 100
  },

  // ============ RANK (dificultad dinamica) ============
  rank: {
    enabled: false,
    baseLevel: 0,
    min: 0,
    max: 100,
    maxLevel: 5,
    bulletSpeedMax: 1.12,
    cooldownMin: 0.88,
    multiplierMax: 1.5
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
    enabled: false,
    timeoutMs: 2500,
    maxMultiplier: 2.0
  },

  // ============ DEBUG ============
  debug: {
    showHardcoreInfo: false,
    showRank: false
  }

};
