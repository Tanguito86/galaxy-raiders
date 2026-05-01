// =====================
// GALAXY RAIDERS - menus.js
// =====================

function moveMenuSelection(delta, withVibration = false) {
  menuSelection = (menuSelection + delta + MENU_OPTIONS.length) % MENU_OPTIONS.length;
  sfxUIClick();
  if (withVibration) vibrate('tap');
}

function cycleMenuDifficulty(withVibration = false) {
  if (!hardcoreUnlocked) return false;
  difficultyIndex = (difficultyIndex + 1) % 2;
  sfxUIClick();
  if (withVibration) vibrate('tap');
  return true;
}

function confirmMenuSelection() {
  if (menuSelection === 0) {
    requestFull();
    menuMusicStarted = false;
    startNewGameRun(difficulties[difficultyIndex].lives);
    return;
  }

  if (menuSelection === 1) {
    goToScoresScreen();
    return;
  }

  if (menuSelection === 2) {
    openOptionsFrom('menu');
    return;
  }

  if (menuSelection === 3) {
    goToCreditsScreen();
  }
}

function movePauseSelection(delta, withVibration = false) {
  pauseSelection = (pauseSelection + delta + 3) % 3;
  sfxUIClick();
  if (withVibration) vibrate('tap');
}

function confirmPauseSelection() {
  if (pauseSelection === 0) {
    resumeGameplay();
    sfxUIClick();
    pauseSelection = 0;
    return;
  }

  if (pauseSelection === 1) {
    openOptionsFrom('paused');
    pauseSelection = 0;
    return;
  }

  if (pauseSelection === 2) {
    returnToMenuAfterRun();
    sfxUIClick();
    pauseSelection = 0;
  }
}
