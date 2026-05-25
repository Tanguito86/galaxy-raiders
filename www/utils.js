// =====================
// GALAXY RAIDERS - utils.js
// =====================

'use strict';

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + seconds.toString().padStart(2, '0');
}
