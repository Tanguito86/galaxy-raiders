// =====================
// GALAXY RAIDERS - reset.js
// =====================

function clearCombatState() {
  bullets = [];
  enemyBullets = [];
  enemies = [];
  powerUps = [];
  particles = [];
  mines = [];
  satellites = [];
  ufoRewards = [];
  victoryParticles = [];
  resetMedalSystemState();
  resetWavePerfectTracking();
  boss.active = false;
}

function resetPlayerLoadout() {
  player.weaponType = 'normal';
  player.weaponTimer = 0;
}

function resetPlayerPosition() {
  player.x = W / 2 - 16;
  player.y = H - 40;
}

function resetRunStats() {
  extraLivesEarned = 0;
  continueCount = 0;
  gameStats = createEmptyRunStats();
}

function resetProgressionState() {
  pendingNextLevel = false;
  levelClearTimer = 0;
  warpSpeed = 1;
  resetWaveRewardTracking();
  debugLevelJumpText = '';
  debugLevelJumpTimer = 0;
}

function startNewGameRun(initialLives) {
  state = 'playing';
  level = 1;
  score = 0;
  lives = initialLives;
  clearScreenShakeLayers();
  flashScreen = 0;

  clearCombatState();
  resetPlayerLoadout();
  resetPlayerPosition();
  resetRunStats();
  resetProgressionState();

  startLevel();
}

function returnToMenuAfterRun() {
  const leavingRunState = (state === 'playing' || state === 'paused' || state === 'continue');
  if (leavingRunState) {
    const reason = state === 'continue' ? 'defeat' : 'quit';
    if (!gameStats || !gameStats.runEndedBy) finalizeRunStats(reason);
  }
  clearScreenShakeLayers();
  flashScreen = 0;
  state = 'menu';
  clearCombatState();
  resetPlayerLoadout();
  resetWaveRewardTracking();
}

function resetAfterNameEntry() {
  returnToMenuAfterRun();
  currentLetterIndex = 0;
}

function resetVictoryToMenu() {
  clearScreenShakeLayers();
  flashScreen = 0;
  state = 'menu';
  level = 1;
  score = 0;
  clearCombatState();
  resetPlayerLoadout();
}
