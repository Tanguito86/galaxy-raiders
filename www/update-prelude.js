// =====================
// GALAXY RAIDERS - update-prelude.js
// =====================

function updateAmbientStars(mult = 1) {
  if (mult <= 0) return;
  stars.forEach(s => {
    s.y += s.speed * 0.5 * mult;
    if (s.y > H + 10) {
      s.y = -10;
      s.x = Math.random() * W;
    }
  });
}

function updateGlobalFrameState(dt) {
  if (
    (state === 'entering_name' || state === 'menu' || state === 'scores' || state === 'options' || state === 'paused') &&
    joystickInputCooldown > 0
  ) {
    joystickInputCooldown -= dt;
  }

  globalTime += dt;
  updateAmbientStars(dt > 0 ? 1 : 0);

  if (state === 'playing' && setPieceBannerTimer > 0) {
    setPieceBannerTimer -= dt;
    if (setPieceBannerTimer < 0) setPieceBannerTimer = 0;
  }

  if (state === 'playing' && setPieceIntroTimer > 0) {
    const prev = setPieceIntroTimer;
    setPieceIntroTimer -= dt;
    if (setPieceIntroTimer < 0) setPieceIntroTimer = 0;
    if (prev > 0 && setPieceIntroTimer <= 0) resolveSetPieceIntro();
  }
}

function resolveSetPieceIntro() {
  if (setPieceIntroResolved || !currentSetPiece) return;
  setPieceIntroResolved = true;
  pushScreenShake('medium', 7);
  sfxConfirm();
  vibrate('tap');
}

function isGameplayPausedByUiState() {
  return state === 'paused' || state === 'options' || state === 'entering_name' || state === 'menu';
}

function pushScreenShake(layer = 'medium', amount = 6) {
  const a = Math.max(0, Math.min(SHAKE_CONFIG.maxInput, Number(amount) || 0));
  if (a <= 0) return;

  if (layer === 'light' || layer === 'low') {
    screenShakeLight = Math.max(screenShakeLight, a);
    return;
  }
  if (layer === 'heavy' || layer === 'high') {
    screenShakeHeavy = Math.max(screenShakeHeavy, a);
    return;
  }
  screenShakeMedium = Math.max(screenShakeMedium, a);
}

function clearScreenShakeLayers() {
  screenShakeLight = 0;
  screenShakeMedium = 0;
  screenShakeHeavy = 0;
  screenShakeBg = 0;
  screenShakeGameplay = 0;
  screenShake = 0;
}

function requestHitstop(ms = 30) {
  if (state !== 'playing') return;
  const amount = Math.max(0, Math.min(120, Math.floor(ms)));
  hitstopTimer = Math.max(hitstopTimer, amount);
}

function consumeHitstop(dt) {
  if (state !== 'playing') {
    hitstopTimer = 0;
    return false;
  }
  if (hitstopTimer <= 0) return false;

  hitstopTimer -= dt;
  if (hitstopTimer < 0) hitstopTimer = 0;
  return true;
}

function updateContinueTimer(dt) {
  if (state !== 'continue') return false;

  const prevSeconds = Math.ceil(continueTimer / 1000);
  continueTimer -= dt;
  const newSeconds = Math.ceil(continueTimer / 1000);

  if (newSeconds !== prevSeconds && newSeconds > 0) {
    if (newSeconds <= 2) {
      sfxBossWarning();
      vibrate('hit');
    } else {
      sfxUIClick();
      vibrate('tap');
    }
  }

  if (continueTimer <= 0) {
    declineContinue();
  }

  updateAmbientStars();
  return true;
}

function updateCombatEffects(dt) {
  if (isInvincible) {
    invincibleTimer -= dt;
    if (invincibleTimer <= 0) {
      isInvincible = false;
      invincibleTimer = 0;
    }
  }

  // Compatibilidad: código legado puede seguir escribiendo screenShake directo.
  if (screenShake > 0) {
    pushScreenShake('medium', screenShake);
    screenShake = 0;
  }

  if (screenShakeLight > 0) {
    screenShakeLight -= dt * SHAKE_CONFIG.decayPerMs.light;
    if (screenShakeLight < 0) screenShakeLight = 0;
  }
  if (screenShakeMedium > 0) {
    screenShakeMedium -= dt * SHAKE_CONFIG.decayPerMs.medium;
    if (screenShakeMedium < 0) screenShakeMedium = 0;
  }
  if (screenShakeHeavy > 0) {
    screenShakeHeavy -= dt * SHAKE_CONFIG.decayPerMs.heavy;
    if (screenShakeHeavy < 0) screenShakeHeavy = 0;
  }

  screenShakeBg = (
    screenShakeLight * SHAKE_CONFIG.bgMix.light +
    screenShakeMedium * SHAKE_CONFIG.bgMix.medium +
    screenShakeHeavy * SHAKE_CONFIG.bgMix.heavy
  );
  screenShakeGameplay = (
    screenShakeLight * SHAKE_CONFIG.gameplayMix.light +
    screenShakeMedium * SHAKE_CONFIG.gameplayMix.medium +
    screenShakeHeavy * SHAKE_CONFIG.gameplayMix.heavy
  );

  // Mantener variable vieja para render/compatibilidad.
  screenShake = screenShakeGameplay;

  if (flashScreen > 0) {
    flashScreen -= dt * 0.1;
    if (flashScreen < 0) flashScreen = 0;
  }
}
