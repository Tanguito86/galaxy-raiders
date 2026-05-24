// =====================
// GALAXY RAIDERS - update-victory.js
// =====================

function updateVictoryAndParticles(step, dt) {
  // ✅ Particles MOVIDAS ACÁ (fuera del if de enemigos)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.vy += p.gravity * step;
    p.life -= 0.02 * step;

  if (p.y > H) { p.y = H; p.vy *= -0.6; }
    if (p.life <= 0) particles.splice(i, 1);
  }

  // ✅ FASES DE VICTORIA ÉPICA
  if (state === 'victory') {
    victoryPhaseTimer += dt;
    
    // Fase 1: Explosiones en cadena del boss (0-2 segundos)
    if (victoryPhase === 1) {
      if (victoryPhaseTimer > 400 && bossExplosionCount < 6) {
        // Explosión aleatoria en área del boss
        const expX = W/2 - 60 + Math.random() * 120;
        const expY = 80 + Math.random() * 80;
        createExplosion(expX, expY, ['#f00', '#ff0', '#f80', '#fff'][Math.floor(Math.random() * 4)], 25);
        sfxBigExplosion();
        pushScreenShake('heavy', 15 + bossExplosionCount * 3);
        bossExplosionCount++;
        victoryPhaseTimer = 0;
      }
      
      if (bossExplosionCount >= 6) {
        // BOOM final gigante
        createExplosion(W/2, 120, '#fff', 60);
        sfxBigExplosion();
        pushScreenShake('heavy', 50);
        flashScreen = 30;
        victoryPhase = 2;
        victoryPhaseTimer = 0;
        startMusic('victory');
        if (typeof startAmbience === 'function') startAmbience('victory');
        if (typeof applyVictoryMix === 'function') applyVictoryMix(600);
      }
    }
    
    // Fase 2: Nave sube (2-5 segundos)
    if (victoryPhase === 2) {
      playerVictoryY -= 2;
      
      // Fuegos artificiales aleatorios
      if (Math.random() < 0.1) {
        const fwX = 50 + Math.random() * (W - 100);
        const fwY = 100 + Math.random() * (H - 300);
        createExplosion(fwX, fwY, currentPalette[Math.floor(Math.random() * 4)], 20);
        if (Math.random() < 0.3) sfxEnemyKill();
      }
      
      if (victoryPhaseTimer > 3000) {
        victoryPhase = 3;
        victoryPhaseTimer = 0;
        spawnVictoryParticles();
      }
    }
    
    // Fase 3: Mostrar grado y stats (5+ segundos)
    if (victoryPhase === 3) {
      // Confetti continuo
      if (Math.random() < 0.15) {
        spawnVictoryParticles();
      }
    }
  }

 // ✅ Victory particles
  for (let i = victoryParticles.length - 1; i >= 0; i--) {
    const p = victoryParticles[i];
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.vy += 0.15 * step;
    p.life -= 0.008 * step;
    if (p.life <= 0 || p.y > H) victoryParticles.splice(i, 1);
  }

}
