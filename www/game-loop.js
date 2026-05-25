// =====================
// GALAXY RAIDERS - game-loop.js
// =====================

'use strict';

window.GameLoop = (function() {
  let lastTime = 0;
  let rafId = null;

  function loop(t) {
    if (!lastTime) lastTime = t;
    const dtRaw = t - lastTime;
    // Clamp para evitar saltos gigantes al volver de background.
    const dt = Math.min(50, Math.max(0, dtRaw));
    lastTime = t;
    update(dt);
    Renderer.draw();
    if (window.GameLoop.isRunning) {
      rafId = requestAnimationFrame(loop);
    }
  }

  return {
    isRunning: false,
    start: function() {
      if (this.isRunning) return;
      this.isRunning = true;
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    },
    stop: function() {
      this.isRunning = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
})();
