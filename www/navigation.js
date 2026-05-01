// =====================
// GALAXY RAIDERS - navigation.js
// =====================

function goToMenuScreen(playSfx = true) {
  state = 'menu';
  if (playSfx) sfxUIClick();
}

function goToScoresScreen() {
  state = 'scores';
  sfxUIClick();
}

function goToCreditsScreen() {
  state = 'credits';
  sfxUIClick();
}

function closeOptionsToPrevious() {
  state = previousState;
  sfxUIClick();
}

function resetHighScoresTable() {
  highScores = [];
  highNames = [];
  highContinues = [];

  for (let i = 0; i < 10; i++) {
    highScores.push(0);
    highNames.push('---');
    highContinues.push(0);
  }

  bestScore = 0;
  saveHighScores();
  sfxConfirm();
}
