// =====================
// GALAXY RAIDERS - runtime.js
// =====================

// --- LOOP ---
let lastTime = 0;
const loop = (t) => {
  if (!lastTime) lastTime = t;
  const dtRaw = t - lastTime;
  // Clamp para evitar saltos gigantes al volver de background.
  const dt = Math.min(50, Math.max(0, dtRaw));
  lastTime = t;
  update(dt);
  draw();
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);
