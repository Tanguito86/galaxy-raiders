// =====================
// GALAXY RAIDERS - session.js
// =====================

function stopMusicPlayback() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

function updatePauseButtonForState(nextState = state) {
  const btn = document.getElementById('btn-pause');
  if (!btn) return;
  btn.textContent = nextState === 'paused' ? '▶' : '❚❚';
}

function pauseGameplay() {
  if (state !== 'playing') return;
  state = 'paused';
  pauseSelection = 0;
  stopMusicPlayback();
  updatePauseButtonForState('paused');
}

function resumeGameplay() {
  if (state !== 'paused') return;
  state = 'playing';
  startMusic(boss.active ? 'boss' : 'normal');
  updatePauseButtonForState('playing');
}

function togglePauseGameplay() {
  if (state === 'playing') pauseGameplay();
  else if (state === 'paused') resumeGameplay();
}

function openOptionsFrom(sourceState) {
  previousState = sourceState;
  state = 'options';
  sfxUIClick();
}
