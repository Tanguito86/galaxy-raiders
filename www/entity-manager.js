// =====================
// GALAXY RAIDERS - entity-manager.js
// Fachada de solo lectura para acceso centralizado a entidades
// =====================

window.EntityManager = {
  getPlayer() {
    return player;
  },
  getBullets() {
    return bullets;
  },
  getEnemyBullets() {
    return enemyBullets;
  },
  getEnemies() {
    return enemies;
  },
  getParticles() {
    return particles;
  },
  getPowerUps() {
    return powerUps;
  },
  getStars() {
    return stars;
  },
  getMines() {
    return mines;
  },
  getSatellites() {
    return satellites;
  },
  getUfoRewards() {
    return ufoRewards;
  },
  getMedals() {
    return medals;
  },
  getPopups() {
    return popups;
  }
};
