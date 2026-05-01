// =====================
// GALAXY RAIDERS - name-entry.js
// =====================

const MAX_PLAYER_NAME_LENGTH = 8;

function submitEnteredName(cfg = {}) {
  const {
    resetScreenEffects = false,
    setPauseButtonPlayIcon = false,
    playConfirmSfx = false,
    vibrateConfirm = false
  } = cfg;

  if (playerName.length === 0) return false;

  addHighScore(score, playerName.toUpperCase());
  enteringName = false;
  resetAfterNameEntry();

  if (resetScreenEffects) {
    clearScreenShakeLayers();
    flashScreen = 0;
  }

  if (setPauseButtonPlayIcon) {
    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) pauseBtn.textContent = '▶';
  }

  if (playConfirmSfx) sfxConfirm();
  if (vibrateConfirm) vibrate('hit');

  return true;
}

function removeLastNameChar(withFeedback = false) {
  if (playerName.length === 0) return false;
  playerName = playerName.slice(0, -1);
  if (withFeedback) {
    sfxUIClick();
    vibrate('tap');
  }
  return true;
}

function appendNameChar(char, withFeedback = false) {
  if (!char || playerName.length >= MAX_PLAYER_NAME_LENGTH) return false;
  playerName += char;
  if (withFeedback) {
    sfxUIClick();
    vibrate('tap');
  }
  return true;
}

function appendKeyboardNameChar(key) {
  if (key.length !== 1 || !/^[a-zA-Z0-9 ]$/.test(key)) return false;
  return appendNameChar(key, false);
}

function appendSelectedNameChar(withFeedback = false) {
  return appendNameChar(ALPHABET[currentLetterIndex], withFeedback);
}

function moveNameLetterSelection(delta, withFeedback = false) {
  currentLetterIndex = (currentLetterIndex + delta + ALPHABET.length) % ALPHABET.length;
  if (withFeedback) sfxUIClick();
  return currentLetterIndex;
}

function cycleScoresTab(withFeedback = false) {
  scoresTab = (scoresTab + 1) % 2;
  if (withFeedback) sfxUIClick();
  return scoresTab;
}

function setScoresTab(tab, withFeedback = false, withVibration = false) {
  scoresTab = tab === 0 ? 0 : 1;
  if (withFeedback) sfxUIClick();
  if (withVibration) vibrate('tap');
  return scoresTab;
}

function closeScoresScreen() {
  goToMenuScreen();
}
