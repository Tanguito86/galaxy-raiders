// =====================
// GALAXY RAIDERS - update.js
// =====================

// --- UPDATE ---
function update(dt) {
  const gameplayFreeze = (state === 'playing' && hitstopTimer > 0);
  updateGlobalFrameState(gameplayFreeze ? 0 : dt);
  if (isGameplayPausedByUiState()) return;
  if (updateContinueTimer(dt)) return;
  if (consumeHitstop(dt)) return;

  // Normaliza a "frames de 60fps"
  const step = dt / 16.6667;

  // Animacion global (parpadeos, UFO, etc.)
  animationFrame = Math.floor(globalTime / 500) % 2;

  updateCombatEffects(dt);

  // No dispares durante el warp de fin de nivel
  if (state === 'playing' && !pendingNextLevel && isFiring) fire();

  // Warp de fin de nivel (real, con timer)
  const aliveCount = enemies.filter(e => e.alive).length;

  // No activar warp si hay boss activo
  if (state === 'playing' && !boss.active && aliveCount === 0 && !pendingNextLevel) {
    pendingNextLevel = true;
    levelClearTimer = 900;
    pushScreenShake('medium', 10);
    sfxConfirm();
  }

  const isWarping = (state === 'playing' && pendingNextLevel);
  const targetWarp = isWarping ? 20 : 1;
  warpSpeed += (targetWarp - warpSpeed) * 0.08;

  // Parallax por movimiento del player
  const dx = player.x - prevPlayerX;
  const dy = player.y - prevPlayerY;
  prevPlayerX = player.x;
  prevPlayerY = player.y;

  stars.forEach(s => {
    // Scroll principal (warp)
    s.y += s.speed * warpSpeed * step;

    // Parallax: estrellas cercanas se mueven mas con tu movimiento
    const px = dx * (0.25 + s.depth * 0.85);
    const py = dy * (0.10 + s.depth * 0.35);

    s.x -= px;
    s.y -= py;

    // Drift sutil
    s.x += s.drift * step;

    // Wrap horizontal
    if (s.x < -10) s.x = W + 10;
    if (s.x > W + 10) s.x = -10;

    // Wrap vertical con redistribucion
    if (s.y > H + 10) {
      s.y = -10 - Math.random() * 20;
      s.x = Math.random() * W;
      s.drift = (Math.random() - 0.5) * 0.25;
    }
    if (s.y < -20) {
      s.y = H + 10 + Math.random() * 20;
      s.x = Math.random() * W;
      s.drift = (Math.random() - 0.5) * 0.25;
    }
  });

  if (debugLevelJumpTimer > 0) debugLevelJumpTimer -= dt;

  if (pendingNextLevel) {
    levelClearTimer -= dt;

    // Vibracion de turbulencia durante warp
    if (warpSpeed > 3 && Math.random() < 0.3) {
      vibrate('tap');
    }

    if (levelClearTimer <= 0) {
      pendingNextLevel = false;
      level++;
      addScore(1000);
      startLevel();
    }
  }

  if (state === 'playing') {
    updatePlayerFrame(step, dt);
    updateBossStep(step, dt);
    updateEnemiesAndProjectiles(step, dt);
    updateMedals(player, step);
    updatePopups(step);
    updateVictoryAndParticles(step, dt);
  }
}
