// =====================
// GALAXY RAIDERS - flow.js
// =====================

function endGame() {
  hitstopTimer = 0;
  
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  if (musicBassInterval) { clearInterval(musicBassInterval); musicBassInterval = null; }
  if (typeof stopMusicFromBuffer === 'function') stopMusicFromBuffer(200);

  // Feedback inmediato
  pushScreenShake('heavy', 40);
  flashScreen = 25;
  vibrate('explosion');

  // Mostrar pantalla de continue
  state = 'continue';
  continueTimer = CONTINUE_TIME;
  
  sfxPlayerHit();
}

function useContinue() {
  // AcÃ¡ irÃ­a la lÃ³gica de pago (IAP)
  // Por ahora es gratis para testing
  
  continueCount++;
  hitstopTimer = 0;
  const diff = difficulties[difficultyIndex] || difficulties[0];
  lives = diff.continueLives ?? diff.lives ?? 3;
  isInvincible = true;
  invincibleTimer = INVINCIBLE_DURATION * 2;  // MÃ¡s tiempo de gracia
  
  // Limpiar balas enemigas (piedad)
  enemyBullets = [];
  mines = [];
  
  // Resetear posiciÃ³n de aliens (si no es boss)
  if (!boss.active) {
    // Subir todos los aliens vivos a su posiciÃ³n inicial
    enemies.forEach((e, index) => {
      if (e.alive) {
        e.y = 70 + e.row * 35;  // PosiciÃ³n Y inicial segÃºn fila
        e.diving = false;       // Cancelar diving
        e.vx = 0;
        e.vy = 0;
      }
    });
    enemyDir = 1;  // Resetear direcciÃ³n
  }
  
  // Resetear posiciÃ³n del jugador
  player.x = W / 2 - player.width / 2;
  player.y = H - 40;
  
  state = 'playing';
  startMusic(getMusicThemeForLevel(level, boss.active));
  if (typeof startAmbience === 'function') startAmbience(boss.active ? 'boss' : 'stage');
  if (typeof applyStageMix === 'function' && !boss.active) applyStageMix(300);
  if (typeof applyBossFightMix === 'function' && boss.active) applyBossFightMix(300);
  
  sfxPowerUp();
  
  vibrate('hit');
}

function declineContinue() {
  // âœ… RESETEAR SHAKE
  clearScreenShakeLayers();
  flashScreen = 0;
  finalizeRunStats('defeat');
  
  // Verificar high score
  if (isHighScore(score)) {
    enteringName = true;
    playerName = '';
    state = 'entering_name';
  } else {
    returnToMenuAfterRun();
  }
  
  startMusic('menu');
  if (typeof startAmbience === 'function') startAmbience('menu');
  if (typeof setBusVolume === 'function') {
    setBusVolume('music', 0.85, 500);
    setBusVolume('sfx', 0.90, 400);
    setBusVolume('ambience', 0.60, 500);
  }
}



// --- GAME LOGIC ---
let isEnding = false;

function safeEndGame() {
  if (isEnding || state === 'continue') return;
  isEnding = true;
  endGame();
  setTimeout(() => { isEnding = false; }, 2000);
}


