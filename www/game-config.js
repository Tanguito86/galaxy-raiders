// ==============================
// GALAXY RAIDERS - game-config.js
// Configuracion base para modo hardcore y sistemas relacionados
// ==============================

window.GALAXY_CONFIG = {

  // ============ HARDCORE MASTER SWITCH ============
  hardcore: {
    enabled: false
  },

  // ============ PLAYER (hitbox reducida en hardcore) ============
  player: {
    hardcoreHitRadius: 3,
    showHitbox: false
  },

  // ============ GRAZE (roce de balas) ============
  graze: {
    enabled: false,
    radius: 24,
    score: 100
  },

  // ============ RANK (dificultad dinamica) ============
  rank: {
    enabled: false,
    baseLevel: 0
  },

  // ============ BULLETS (efectos visuales) ============
  bullets: {
    enemyGlow: false,
    bossGlow: false
  },

  // ============ SCORE (combo y multiplicadores) ============
  score: {
    comboEnabled: false
  },

  // ============ DEBUG ============
  debug: {
    showHardcoreInfo: false
  }

};
