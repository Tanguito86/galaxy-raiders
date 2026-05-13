// =====================
// GALAXY RAIDERS - options.js
// =====================

function syncMuteButtonState() {
  const btn = document.getElementById('btn-mute');
  if (!btn) return;

  btn.textContent = isMuted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
  if (isMuted) btn.classList.add('muted');
  else btn.classList.remove('muted');
}

function toggleMuteSetting(cfg = {}) {
  const {
    playClickOnUnmute = false,
    vibrateOnToggle = false,
    stopMusicOnMute = false,
    resumeMusicOnUnmute = false
  } = cfg;

  isMuted = !isMuted;
  syncMuteButtonState();

  if (isMuted && stopMusicOnMute) {
    stopMusicPlayback();
  } else if (!isMuted && resumeMusicOnUnmute && state === 'playing') {
    startMusic(getMusicThemeForLevel(level, boss.active));
  }

  if (!isMuted && playClickOnUnmute) sfxUIClick();
  if (vibrateOnToggle) vibrate('tap');
}

function moveOptionSelection(delta, withVibration = false) {
  optionSelection = (optionSelection + delta + OPTIONS_COUNT) % OPTIONS_COUNT;
  sfxUIClick();
  if (withVibration) vibrate('tap');
}

function applyOptionHorizontalInput(withVibration = false) {
  if (optionSelection === 0) {
    toggleMuteSetting({
      playClickOnUnmute: true,
      vibrateOnToggle: withVibration
    });
    return true;
  }

  if (optionSelection === 1) {
    vibrationEnabled = !vibrationEnabled;
    sfxUIClick();
    if (vibrationEnabled) vibrate('tap');
    return true;
  }

  if (optionSelection === 2) {
    joystickSize = (joystickSize + 1) % 2;
    saveJoystickSize();
    applyJoystickSize();
    sfxUIClick();
    if (withVibration) vibrate('tap');
    return true;
  }

  if (optionSelection === 3) {
    // HC-12: difficulty locked to hardcore
    return false;
  }

  if (optionSelection === 4) {
    cycleBalanceProfile();
    sfxUIClick();
    if (withVibration) vibrate('tap');
    return true;
  }

  return false;
}

function confirmOptionsFromKeyboard() {
  if (optionSelection === 5) {
    resetHighScoresTable();
    goToMenuScreen(false);
  } else {
    goToMenuScreen();
  }
}

function confirmOptionsToPrevious() {
  if (optionSelection === 5) {
    resetHighScoresTable();
  }
  closeOptionsToPrevious();
}
