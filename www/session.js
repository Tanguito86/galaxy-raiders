// =====================
// GALAXY RAIDERS - session.js
// =====================

function stopMusicPlayback() {
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  if (musicBassInterval) { clearInterval(musicBassInterval); musicBassInterval = null; }
  if (typeof stopMusicFromBuffer === 'function') stopMusicFromBuffer(100);
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
  startMusic(getMusicThemeForLevel(level, boss.active));
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
