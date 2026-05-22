// =====================
// GALAXY RAIDERS - update.js
// =====================

var waveTransitionActive = false;

function beginWaveTransition(completedLevel, nextLevel) {
  if (waveTransitionActive) return;
  waveTransitionActive = true;
  pendingNextLevel = true;
  // HC-RK-04: apply rank wave pause through safety governor
  var rankPauseResult = (typeof window.getHardcoreRankGameplayWavePause === 'function')
    ? window.getHardcoreRankGameplayWavePause(900)
    : { pauseMs: 900, capped: false, governorApproved: false };
  if (typeof window.recordHardcoreRankGameplayApply === 'function' && rankPauseResult.governorApproved) {
    window.recordHardcoreRankGameplayApply('wavePause', rankPauseResult.capped);
  }
  levelClearTimer = rankPauseResult.pauseMs;
  pushScreenShake('medium', 10);
  sfxConfirm();

  waveAnnounceText = 'WAVE ' + nextLevel;
  waveAnnounceTimer = 1500;
  waveAnnounceSubText = '';
  waveAnnounceSubTimer = 0;

  if (BOSS_LEVELS.indexOf(nextLevel) !== -1) {
    var bossData = BOSS_DATA[nextLevel];
    waveAnnounceSubText = bossData ? bossData.name + ' INCOMING' : 'BOSS INCOMING';
    waveAnnounceSubTimer = 1900;
  } else if (SET_PIECE_BY_LEVEL[nextLevel]) {
    waveAnnounceSubText = SET_PIECE_BY_LEVEL[nextLevel].name;
    waveAnnounceSubTimer = 1900;
  }

  var reward = grantWaveCompletionBonus(completedLevel);
  if (reward) {
    waveRewardText = reward.text;
    waveRewardTimer = 2000;
  } else {
    waveRewardText = '';
    waveRewardTimer = 0;
  }

  tryAwardPerfectWaveBonus();
  resetWavePerfectTracking();

  // HC-RK-02: track wave clear for rank
  if (typeof window.recordHardcoreRankWaveClear === 'function') {
    window.recordHardcoreRankWaveClear(typeof globalTime === 'number' ? globalTime : 0);
  }
  // HC-SC-07: reset medal wave tracking
  if (typeof window.resetMedalWaveTracking === 'function') window.resetMedalWaveTracking();
}

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
    beginWaveTransition(level, level + 1);
  }

  const isWarping = (state === 'playing' && pendingNextLevel);
  const targetWarp = isWarping ? 20 : 1;
  warpSpeed += (targetWarp - warpSpeed) * 0.08;

  // Parallax por movimiento del player
  const dx = player.x - prevPlayerX;
  const dy = player.y - prevPlayerY;
  prevPlayerX = player.x;
  prevPlayerY = player.y;

  // HC-90: stage intensity scales star speed (deeper levels = faster backdrop)
  var hc90Intensity = getHC90Intensity(level);
  var hc90SpeedMul = 0.7 + hc90Intensity * 0.6;

  stars.forEach(s => {
    // Scroll principal (warp) — HC-90 intensity multiplier
    s.y += s.speed * warpSpeed * step * hc90SpeedMul;

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

  if (pendingNextLevel) {
    levelClearTimer -= dt;
    if (waveAnnounceTimer > 0) waveAnnounceTimer -= dt;
    if (waveAnnounceSubTimer > 0) waveAnnounceSubTimer -= dt;
    if (waveRewardTimer > 0) waveRewardTimer -= dt;
    if (debugLevelJumpTimer > 0) debugLevelJumpTimer -= dt;

    // Vibracion de turbulencia durante warp
    if (warpSpeed > 3 && Math.random() < 0.3) {
      vibrate('tap');
    }

    if (levelClearTimer <= 0) {
      pendingNextLevel = false;
      level++;
      awardScore({ points: 1000, source: 'levelClear' });
      startLevel();
      waveTransitionActive = false;

      // HC-RK-02: track wave start for rank
      if (typeof window.recordHardcoreRankWaveStart === 'function') {
        window.recordHardcoreRankWaveStart(typeof globalTime === 'number' ? globalTime : 0);
      }
    }
  }

  if (state === 'playing') {
    if (debugLevelJumpTimer > 0) debugLevelJumpTimer -= dt;
    updatePlayerFrame(step, dt);
    updateBossStep(step, dt);
    updateEnemiesAndProjectiles(step, dt);
    updateMedals(player, step);
    updatePopups(step);
    updateVictoryAndParticles(step, dt);
  }

  if (typeof window.updateHardcoreRankDecay === 'function') window.updateHardcoreRankDecay();
  if (typeof window.updateHardcoreRankPerformance === 'function') window.updateHardcoreRankPerformance(dt);
  if (typeof window.updateHardcoreRankPeakTracking === 'function') window.updateHardcoreRankPeakTracking();
  if (typeof window.updateScoreMultiplierDecay === 'function') window.updateScoreMultiplierDecay();
  if (typeof window.updateScoreDangerWindow === 'function') window.updateScoreDangerWindow();
  if (typeof window.updateMedalFrameCounter === 'function') window.updateMedalFrameCounter();
}
