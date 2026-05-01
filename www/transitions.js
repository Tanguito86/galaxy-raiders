// =====================
// GALAXY RAIDERS - transitions.js
// =====================

function handleContinueConfirmInput() {
  if (state !== 'continue') return false;
  useContinue();
  return true;
}

function handleContinueDeclineInput(cfg = {}) {
  if (state !== 'continue') return false;

  const { playClick = false, vibrateTap = false } = cfg;
  declineContinue();

  if (playClick) sfxUIClick();
  if (vibrateTap) vibrate('tap');
  return true;
}

function handleVictoryConfirmInput() {
  if (state !== 'victory') return false;
  if (victoryPhase < 3) return true;

  resetVictoryToMenu();
  return true;
}
