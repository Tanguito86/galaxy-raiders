// =====================
// GALAXY RAIDERS - draw.js
// =====================

function drawBackgroundMood() {
  const isWarpMood = pendingNextLevel || warpSpeed > 1.5;
  const isBossMood = boss && boss.active;

  if (isWarpMood) {
    const intensity = Math.min(1, (warpSpeed - 1.5) / 4);
    ctx.fillStyle = '#050812';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.08 + intensity * 0.12;
    ctx.fillStyle = '#09f';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  } else if (isBossMood) {
    const hpRatio = boss.hp / boss.maxHp;
    ctx.fillStyle = '#080404';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.04 + (1 - hpRatio) * 0.08;
    ctx.fillStyle = '#400';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = '#05050a';
    ctx.fillRect(0, 0, W, H);
  }
}

// --- HUD HELPERS ---
function drawArcadePanel(x, y, w, h, accentColor) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y + h, w, 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, w, 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.restore();
}

function drawGameplayHudPanel(x, y, w, h, accentColor) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#000';
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x, y, w, 1);
  ctx.fillRect(x, y + h - 1, w, 1);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.restore();
}

function drawOverlayPanel(x, y, w, h, accentColor) {
  ctx.save();
  ctx.fillStyle = 'rgba(2,4,12,0.92)';
  ctx.fillRect(x, y, w, h);

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = accentColor;
  ctx.fillRect(x + 4, y + 4, w - 8, 2);
  ctx.fillRect(x + 4, y + h - 6, w - 8, 2);

  ctx.globalAlpha = 1;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 6.5, y + 6.5, w - 13, h - 13);

  ctx.fillStyle = accentColor;
  ctx.fillRect(x - 2, y + 12, 4, 18);
  ctx.fillRect(x + w - 2, y + 12, 4, 18);
  ctx.fillRect(x - 2, y + h - 30, 4, 18);
  ctx.fillRect(x + w - 2, y + h - 30, 4, 18);
  ctx.restore();
}

function drawGlowText(text, x, y, font, fillColor, glowColor) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;
  ctx.fillStyle = glowColor;
  ctx.fillText(text, x + 2, y + 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#000';
  ctx.fillText(text, x + 2, y + 3);
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// --- DRAW ---
function draw() {
  // 1) Limpiar y pintar fondo SIN translate (así el fondo no recibe shake global)
  ctx.clearRect(0, 0, W, H);
  drawBackgroundMood();

  const mobileControls = document.getElementById('mobile-controls');
  if (mobileControls) {
    const menuControlStates = ['menu', 'options', 'scores', 'credits'];
    const overlayControlStates = ['paused', 'gameover'];
    const controlsDimmed = menuControlStates.includes(state);
    const controlsSoftened = overlayControlStates.includes(state);
    const targetOpacity = controlsDimmed ? '0.22' : (controlsSoftened ? '0.34' : '');
    const targetFilter = controlsDimmed
      ? 'saturate(0.55) brightness(0.72)'
      : (controlsSoftened ? 'saturate(0.7) brightness(0.82)' : '');
    const targetTransition = (controlsDimmed || controlsSoftened) ? 'opacity 140ms ease, filter 140ms ease' : '';

    if (mobileControls.style.opacity !== targetOpacity) {
      mobileControls.style.opacity = targetOpacity;
    }
    if (mobileControls.style.filter !== targetFilter) {
      mobileControls.style.filter = targetFilter;
    }
    if (mobileControls.style.transition !== targetTransition) {
      mobileControls.style.transition = targetTransition;
    }
  }

  // 2) STAR SHAKE (solo fondo, más fuerte en boss)
  const bgShakeMult = boss.active ? SHAKE_CONFIG.bgBossMultiplier : SHAKE_CONFIG.bgNormalMultiplier;
  const shakeAmt = Math.max(0, screenShakeBg) * SHAKE_CONFIG.bgStrength * bgShakeMult;

  // suavizado para que no “tiemble feo”
  starShakeX = starShakeX * SHAKE_CONFIG.starSmoothingKeep + ((Math.random() - 0.5) * shakeAmt) * SHAKE_CONFIG.starSmoothingNoise;
  starShakeY = starShakeY * SHAKE_CONFIG.starSmoothingKeep + ((Math.random() - 0.5) * shakeAmt) * SHAKE_CONFIG.starSmoothingNoise;

  stars.forEach(s => {
    const height = (warpSpeed > 2) ? s.size * (warpSpeed * 1.5) : s.size;
    const depth = (s.depth ?? 0.5);
    const mult  = 0.15 + depth * 0.95;

    const twinkle = Math.sin(globalTime * 0.003 + s.tw + s.phase * 0.001);
    const tw = 0.65 + 0.35 * twinkle;
    const depthAlpha = 0.45 + depth * 0.55;

    ctx.globalAlpha = depthAlpha * tw;
    ctx.fillStyle = s.color;

    ctx.fillRect(
      s.x + starShakeX * mult,
      s.y + starShakeY * mult,
      s.size,
      height
    );

    if (depth > 0.7 && warpSpeed <= 2) {
      ctx.globalAlpha = (depth - 0.7) * 2.0 * tw;
      ctx.fillStyle = '#fff';
      ctx.fillRect(
        s.x + starShakeX * mult,
        s.y + starShakeY * mult,
        Math.max(1, s.size - 1),
        Math.max(1, Math.floor(height * 0.4))
      );
    }
  });

  ctx.globalAlpha = 1;

  // 3) A PARTIR DE ACÁ: shake global SOLO para gameplay (player/enemies/etc.)
  ctx.save();
  if (screenShakeGameplay > 0) {
    ctx.translate(gameplayShakeX, gameplayShakeY);
  }



  if (state === 'menu') {
    const menuPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
    const panelAccent = 'rgba(100,245,255,0.58)';
    const panelW = Math.min(W - 46, 318);
    const panelH = 248;
    const panelX = (W - panelW) / 2;
    const panelY = 258;

    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.07 + menuPulse * 0.05;
    ctx.fillStyle = panelAccent;
    ctx.fillRect(0, 78, W, 2);
    ctx.fillRect(0, H - 86, W, 2);
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';
    
    // Aliens decorativos animados
    menuAliens.forEach((alien, i) => {
  const menuAnim = Math.floor(globalTime / 500) % 2;
const spriteKey = alien.type + (menuAnim === 0 ? '_a' : '_b');
  const color = alien.type === 'alien1' ? currentPalette[2] : currentPalette[1];
  
  // Calcular posición centrada
  const cols = alien.row === 0 ? 5 : 4;
  const spacing = 45;
  const totalWidth = (cols - 1) * spacing;
  const startX = (W - totalWidth) / 2;
  const baseX = startX + alien.col * spacing;
  
  // Movimiento ondulante
  const wave = Math.sin(globalTime * 0.003 + alien.col * 0.5) * 8;
  
  ctx.globalAlpha = 0.78 + menuPulse * 0.18;
  drawSprite(ctx, SPRITES[spriteKey], baseX + wave - 12, alien.y, color, 3);
  ctx.globalAlpha = 1;
});
    
    // Título
    drawGlowText(
      'GALAXY',
      W / 2,
      190,
      '36px "Press Start 2P"',
      menuPulse > 0.35 ? '#fff36a' : '#fff',
      'rgba(255,235,90,0.72)'
    );

    drawGlowText(
      'RAIDERS',
      W / 2,
      232,
      '30px "Press Start 2P"',
      '#ffffff',
      'rgba(0,245,255,0.68)'
    );

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(100,245,255,0.72)';
    ctx.fillText('INSERT COIN // READY', W / 2, 254);

    drawOverlayPanel(panelX, panelY, panelW, panelH, panelAccent);
    
    // High Score
    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#64f5ff';
    ctx.fillText('TOP PILOT', W / 2, panelY + 30);
    ctx.fillStyle = '#fff36a';
    ctx.fillText(globalTopName + '  ' + globalTopScore, W / 2, panelY + 50);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 28, panelY + 68);
    ctx.lineTo(panelX + panelW - 28, panelY + 68);
    ctx.stroke();

    // Opciones del menú
    const menuStartY = panelY + 100;
    const menuSpacing = 34;
    
    MENU_OPTIONS.forEach((option, i) => {
      const y = menuStartY + i * menuSpacing;
      const isSelected = (menuSelection === i);
      
      if (isSelected) {
        // Fondo seleccionado
        ctx.fillStyle = 'rgba(255,245,120,0.12)';
        ctx.fillRect(panelX + 34, y - 20, panelW - 68, 28);
        ctx.strokeStyle = 'rgba(255,245,120,0.45)';
        ctx.strokeRect(panelX + 34.5, y - 20.5, panelW - 69, 27);
        
        // Flechas
        ctx.fillStyle = '#ff0';
        ctx.font = '12px "Press Start 2P"';
        const pulse = Math.sin(globalTime * 0.008) * 3;
        ctx.textAlign = 'left';
        ctx.fillText('>', panelX + 48 - pulse, y);
        ctx.textAlign = 'right';
        ctx.fillText('<', panelX + panelW - 48 + pulse, y);
      }

      ctx.font = '16px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillStyle = isSelected ? '#fff36a' : '#8a94a8';
      ctx.fillText(option, W / 2, y);
    });
    
    // Dificultad (si está desbloqueado)
    let infoY = panelY + panelH - 28;
    if (hardcoreUnlocked) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = 'rgba(255,255,255,0.42)';
      ctx.fillText('MODE: ' + difficulties[difficultyIndex].name, W / 2, infoY);
      infoY += 18;
    }

    if (typeof getBalanceProfileLabel === 'function') {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = 'rgba(255,255,255,0.34)';
      ctx.fillText('BALANCE: ' + getBalanceProfileLabel(), W / 2, infoY);
    }
    
    // Créditos/Fichas
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#64f5ff';
    ctx.fillText(playerCredits + ' CREDITS', W / 2, H - 88);
    
    // Instrucciones
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.52)';
    ctx.fillText('UP/DOWN SELECT   FIRE=OK', W / 2, H - 60);
    
    // Botones inferiores
    ctx.font = '16px "Press Start 2P"';
    const btnY = H - 40;
    
       
    // Fullscreen
    ctx.fillStyle = '#666';
    ctx.fillText('⛶', W / 2 + 60, btnY);
    
    if (pauseBtn) pauseBtn.textContent = '▶';
  }

  // PANTALLA DE SCORES
  if (state === 'scores') {
    {
    const panelW = Math.min(W - 34, 326);
    const panelH = Math.min(H - 82, 492);
    const panelX = (W - panelW) / 2;
    const panelY = 34;
    const accent = '#64f5ff';
    const scoresPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);

    ctx.fillStyle = 'rgba(0,0,0,0.36)';
    ctx.fillRect(0, 0, W, H);
    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

    ctx.textAlign = 'center';
    drawGlowText(
      'HALL OF FAME',
      W / 2,
      panelY + 38,
      '16px "Press Start 2P"',
      scoresPulse > 0.45 ? '#fff36a' : '#fff',
      'rgba(255,235,90,0.65)'
    );

    ctx.font = '10px "Press Start 2P"';
    const tabY = panelY + 74;
    const tabW = 108;
    const tabH = 26;

    if (scoresTab === 0) {
      ctx.fillStyle = 'rgba(100,245,255,0.14)';
      ctx.fillRect(W / 2 - tabW - 7, tabY - 17, tabW, tabH);
      ctx.strokeStyle = 'rgba(100,245,255,0.55)';
      ctx.strokeRect(W / 2 - tabW - 6.5, tabY - 17.5, tabW - 1, tabH);
    }
    ctx.fillStyle = scoresTab === 0 ? '#64f5ff' : '#586073';
    ctx.fillText('LOCAL', W / 2 - 60, tabY);

    if (scoresTab === 1) {
      ctx.fillStyle = 'rgba(100,245,255,0.14)';
      ctx.fillRect(W / 2 + 7, tabY - 17, tabW, tabH);
      ctx.strokeStyle = 'rgba(100,245,255,0.55)';
      ctx.strokeRect(W / 2 + 7.5, tabY - 17.5, tabW - 1, tabH);
    }
    ctx.fillStyle = scoresTab === 1 ? '#64f5ff' : '#586073';
    ctx.fillText('GLOBAL', W / 2 + 60, tabY);

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 96);
    ctx.lineTo(panelX + panelW - 24, panelY + 96);
    ctx.stroke();

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#8a94a8';
    ctx.textAlign = 'left';
    ctx.fillText('#', panelX + 24, panelY + 122);
    ctx.fillText('NAME', panelX + 54, panelY + 122);
    ctx.textAlign = 'right';
    ctx.fillText('SCORE', panelX + panelW - 64, panelY + 122);
    if (scoresTab === 0) ctx.fillText(String.fromCharCode(169), panelX + panelW - 24, panelY + 122);

    ctx.font = '12px "Press Start 2P"';
    for (let i = 0; i < 10; i++) {
      const y = panelY + 148 + i * 27;
      let name, scoreVal, cont;

      if (scoresTab === 0) {
        name = (highNames[i] || '---').toString().slice(0, 8);
        scoreVal = highScores[i] || 0;
        cont = highContinues[i] || 0;
      } else {
        const entry = globalScores[i];
        name = entry ? entry.name.slice(0, 8) : '---';
        scoreVal = entry ? entry.score : 0;
        cont = 0;
      }

      let color = '#555';
      if (i === 0) color = '#ff0';
      else if (i === 1) color = '#ccc';
      else if (i === 2) color = '#c84';
      else if (i < 5) color = '#777';

      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.035)';
        ctx.fillRect(panelX + 18, y - 18, panelW - 36, 22);
      }

      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.fillText((i + 1) + '.', panelX + 24, y);
      ctx.fillText(name, panelX + 54, y);
      ctx.textAlign = 'right';
      ctx.fillText(scoreVal.toString(), panelX + panelW - 64, y);

      if (scoresTab === 0 && cont > 0) {
        ctx.fillStyle = '#f44';
        ctx.fillText(cont.toString(), panelX + panelW - 24, y);
      }
    }

    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    ctx.textAlign = 'center';
    const yourRank = highScores.indexOf(bestScore) + 1;
    ctx.fillText('YOUR BEST: ' + bestScore + (yourRank > 0 ? ' (#' + yourRank + ')' : ''), W / 2, panelY + panelH - 52);

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(String.fromCharCode(8592) + String.fromCharCode(8594) + ' TAB   FIRE=BACK', W / 2, panelY + panelH - 24);

    if (scoresTab === 1 && globalScores.length === 0) {
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#586073';
      ctx.fillText('LOADING...', W / 2, panelY + 250);
    }

    ctx.restore();
    return;
    }
    ctx.textAlign = 'center';
    
    // Título
    ctx.font = '18px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('★ HALL OF FAME ★', W / 2, 50);
    
    // Tabs
    ctx.font = '12px "Press Start 2P"';
    
    // Tab LOCAL
    ctx.fillStyle = scoresTab === 0 ? '#0ff' : '#444';
    ctx.fillText('LOCAL', W / 2 - 60, 85);
    if (scoresTab === 0) {
      ctx.fillRect(W / 2 - 95, 90, 70, 3);
    }
    
    // Tab GLOBAL
    ctx.fillStyle = scoresTab === 1 ? '#0ff' : '#444';
    ctx.fillText('GLOBAL', W / 2 + 60, 85);
    if (scoresTab === 1) {
      ctx.fillRect(W / 2 + 25, 90, 75, 3);
    }
    
    // Línea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(30, 100);
    ctx.lineTo(W - 30, 100);
    ctx.stroke();
    
    // Header
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'left';
    ctx.fillText('#', 40, 120);
    ctx.fillText('NAME', 70, 120);
    ctx.textAlign = 'right';
    ctx.fillText('SCORE', W - 80, 120);
    if (scoresTab === 0) ctx.fillText('©', W - 40, 120);
    
    ctx.font = '12px "Press Start 2P"';
    
    for (let i = 0; i < 10; i++) {
      const y = 145 + i * 28;
      
      let name, scoreVal, cont;
      
      if (scoresTab === 0) {
        // LOCAL
        name = (highNames[i] || '---').toString().slice(0, 8);
        scoreVal = highScores[i] || 0;
        cont = highContinues[i] || 0;
      } else {
        // GLOBAL
        const entry = globalScores[i];
        name = entry ? entry.name.slice(0, 8) : '---';
        scoreVal = entry ? entry.score : 0;
        cont = 0; // Global no tiene continues
      }
      
      // Color según posición
      let color = '#555';
      if (i === 0) color = '#ff0';      // Oro
      else if (i === 1) color = '#ccc'; // Plata
      else if (i === 2) color = '#c84'; // Bronce
      else if (i < 5) color = '#777';
      
      ctx.fillStyle = color;
      
      // Rank
      ctx.textAlign = 'left';
      ctx.fillText((i + 1) + '.', 40, y);
      
      // Nombre
      ctx.fillText(name, 70, y);
      
      // Score
      ctx.textAlign = 'right';
      ctx.fillText(scoreVal.toString(), W - 80, y);
      
      // Continues (solo local)
      if (scoresTab === 0 && cont > 0) {
        ctx.fillStyle = '#f44';
        ctx.fillText(cont.toString(), W - 40, y);
      }
    }
    
    // Tu mejor score
    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    ctx.textAlign = 'center';
    const yourRank = highScores.indexOf(bestScore) + 1;
    ctx.fillText('YOUR BEST: ' + bestScore + (yourRank > 0 ? ' (#' + yourRank + ')' : ''), W / 2, H - 110);
    
    // Instrucciones
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#555';
    ctx.fillText('←→ TAB   FIRE=BACK', W / 2, H - 80);
    
    // Global placeholder
    if (scoresTab === 1 && globalScores.length === 0) {
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('LOADING...', W / 2, 250);
    }
  }

  // PANTALLA DE CREDITS
  if (state === 'credits') {
    {
    const panelW = Math.min(W - 42, 312);
    const panelH = Math.min(H - 96, 430);
    const panelX = (W - panelW) / 2;
    const panelY = 52;
    const accent = '#ff4dcb';
    const creditsPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);

    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.fillRect(0, 0, W, H);
    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

    ctx.textAlign = 'center';
    drawGlowText(
      'CREDITS',
      W / 2,
      panelY + 42,
      '16px "Press Start 2P"',
      creditsPulse > 0.45 ? '#fff36a' : '#fff',
      'rgba(255,77,203,0.68)'
    );

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 66);
    ctx.lineTo(panelX + panelW - 24, panelY + 66);
    ctx.stroke();

    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#64f5ff';
    ctx.fillText('A TRIBUTE TO THE', W / 2, panelY + 104);
    ctx.fillText('ARCADE GAMES OF THE', W / 2, panelY + 129);
    ctx.fillText('80s THAT MARKED', W / 2, panelY + 154);
    ctx.fillText('OUR CHILDHOOD', W / 2, panelY + 179);

    ctx.fillStyle = '#ff4dcb';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('SPACE INVADERS', W / 2, panelY + 224);
    ctx.fillText('GALAGA - GALAXIAN', W / 2, panelY + 244);
    ctx.fillText('AND ALL THE CLASSICS', W / 2, panelY + 264);

    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath();
    ctx.moveTo(panelX + 34, panelY + 288);
    ctx.lineTo(panelX + panelW - 34, panelY + 288);
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('MADE WITH ' + String.fromCharCode(9829), W / 2, panelY + 322);
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('BY TANGUITO STUDIO', W / 2, panelY + 347);
    ctx.fillText('& FLIA', W / 2, panelY + 367);

    ctx.fillStyle = '#0f0';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText('LIKE IT? BUY A TOKEN', W / 2, panelY + 402);
    ctx.fillText('TO SUPPORT THE DEV!', W / 2, panelY + 420);

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#586073';
    ctx.fillText(String.fromCharCode(169) + ' 2025', W / 2, Math.min(H - 112, panelY + panelH + 28));

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('FIRE = BACK', W / 2, H - 80);

    ctx.restore();
    return;
    }
    ctx.textAlign = 'center';
    
    // Título
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('★ CREDITS ★', W / 2, 60);
    
    // Mensaje principal
    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('A TRIBUTE TO THE', W / 2, 110);
    ctx.fillText('ARCADE GAMES OF THE', W / 2, 135);
    ctx.fillText('80s THAT MARKED', W / 2, 160);
    ctx.fillText('OUR CHILDHOOD', W / 2, 185);
    
    // Juegos clásicos
    ctx.fillStyle = '#f0f';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('SPACE INVADERS', W / 2, 230);
    ctx.fillText('GALAGA - GALAXIAN', W / 2, 250);
    ctx.fillText('AND ALL THE CLASSICS', W / 2, 270);
    
    // Crédito
    ctx.fillStyle = '#fff';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('MADE WITH ♥', W / 2, 320);
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('BY TANGUITO STUDIO', W / 2, 345);
    ctx.fillText('& FLIA', W / 2, 365);
    
    // Apoyo
    ctx.fillStyle = '#0f0';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText('LIKE IT? BUY A TOKEN', W / 2, 420);
    ctx.fillText('TO SUPPORT THE DEV!', W / 2, 438);
    
    // Año
    ctx.fillStyle = '#666';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('© 2025', W / 2, 480);
    
    // Instrucciones
    ctx.fillStyle = '#555';
    ctx.fillText('FIRE = BACK', W / 2, H - 80);
  }

  // PANTALLA DE OPTIONS
  if (state === 'options') {
    {
    const panelW = Math.min(W - 34, 326);
    const panelH = Math.min(H - 84, 492);
    const panelX = (W - panelW) / 2;
    const panelY = 42;
    const accent = '#64f5ff';
    const optionsPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
    const rowX = panelX + 20;
    const rowW = panelW - 40;
    const labelX = panelX + 34;
    const valueX = panelX + panelW - 42;
    const optStartY = panelY + 108;
    const optSpacing = 48;

    function drawOptionRow(index, label, value, valueColor, y, danger) {
      const isSelected = optionSelection === index;

      if (isSelected) {
        ctx.fillStyle = danger ? 'rgba(255,54,95,0.16)' : 'rgba(255,245,120,0.12)';
        ctx.fillRect(rowX, y - 20, rowW, danger ? 38 : 32);
        ctx.strokeStyle = danger ? 'rgba(255,54,95,0.5)' : 'rgba(255,245,120,0.45)';
        ctx.strokeRect(rowX + 0.5, y - 20.5, rowW - 1, danger ? 37 : 31);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.035)';
        ctx.fillRect(rowX, y - 20, rowW, 32);
      }

      ctx.font = danger ? '11px "Press Start 2P"' : '12px "Press Start 2P"';
      ctx.textAlign = danger ? 'center' : 'left';
      ctx.fillStyle = isSelected ? (danger ? '#ff365f' : '#fff36a') : (danger ? '#944' : '#dce6ff');
      ctx.fillText(label, danger ? W / 2 : labelX, y);

      if (!danger) {
        ctx.textAlign = 'right';
        ctx.fillStyle = valueColor;
        ctx.fillText(value, valueX, y);
      }

      if (isSelected) {
        const cursorPulse = Math.sin(globalTime * 0.008) * 3;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillStyle = danger ? '#ff365f' : '#ff0';
        ctx.textAlign = 'left';
        ctx.fillText('>', rowX + 4 - cursorPulse, y);
        ctx.textAlign = 'right';
        ctx.fillText('<', rowX + rowW - 4 + cursorPulse, y);
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.36)';
    ctx.fillRect(0, 0, W, H);
    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

    ctx.textAlign = 'center';
    drawGlowText(
      'OPTIONS',
      W / 2,
      panelY + 42,
      '18px "Press Start 2P"',
      optionsPulse > 0.45 ? '#fff36a' : '#fff',
      'rgba(100,245,255,0.68)'
    );

    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(panelX + 24, panelY + 68);
    ctx.lineTo(panelX + panelW - 24, panelY + 68);
    ctx.stroke();

    let y = optStartY;
    drawOptionRow(0, 'SOUND', isMuted ? 'OFF' : 'ON', isMuted ? '#ff365f' : '#0f0', y, false);

    y = optStartY + optSpacing;
    drawOptionRow(1, 'VIBRATION', vibrationEnabled ? 'ON' : 'OFF', vibrationEnabled ? '#0f0' : '#ff365f', y, false);

    y = optStartY + optSpacing * 2;
    drawOptionRow(2, 'CONTROLS', JOYSTICK_SIZES[joystickSize], joystickSize === 1 ? '#64f5ff' : '#0f0', y, false);

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.moveTo(panelX + 28, optStartY + optSpacing * 2.47);
    ctx.lineTo(panelX + panelW - 28, optStartY + optSpacing * 2.47);
    ctx.stroke();

    y = optStartY + optSpacing * 3;
    if (hardcoreUnlocked) {
      drawOptionRow(
        3,
        'DIFFICULTY',
        difficulties[difficultyIndex].name,
        difficultyIndex === 0 ? '#0f0' : '#ff365f',
        y,
        false
      );
    } else {
      drawOptionRow(3, 'DIFFICULTY', 'NORMAL', '#586073', y, false);
      ctx.font = '7px "Press Start 2P"';
      ctx.fillStyle = '#586073';
      ctx.textAlign = 'center';
      ctx.fillText(String.fromCharCode(128274) + ' BEAT GAME TO UNLOCK', W / 2, y + 18);
    }

    y = optStartY + optSpacing * 4;
    const balanceLabel = (typeof getBalanceProfileLabel === 'function') ? getBalanceProfileLabel() : 'ARCADE';
    const isTournament = (typeof getBalanceProfile === 'function') && getBalanceProfile() === 'tournament';
    drawOptionRow(4, 'BALANCE', balanceLabel, isTournament ? '#ff9d2e' : '#0f0', y, false);

    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.moveTo(panelX + 28, optStartY + optSpacing * 4.47);
    ctx.lineTo(panelX + panelW - 28, optStartY + optSpacing * 4.47);
    ctx.stroke();

    y = optStartY + optSpacing * 5;
    drawOptionRow(5, 'RESET ALL SCORES', '', '#ff365f', y, true);
    if (optionSelection === 5) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#ff6b82';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS FIRE TO RESET', W / 2, y + 20);
    }

    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#586073';
    ctx.textAlign = 'center';
    ctx.fillText('VERSION 1.2', W / 2, panelY + panelH - 52);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(
      String.fromCharCode(8593) + String.fromCharCode(8595) + ' SELECT  ' +
      String.fromCharCode(8592) + String.fromCharCode(8594) + ' CHANGE  FIRE=BACK',
      W / 2,
      panelY + panelH - 24
    );

    ctx.restore();
    return;
    }
    ctx.textAlign = 'center';
    
    // Título
    ctx.font = '18px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('⚙ OPTIONS', W / 2, 60);
    
    const optStartY = 120;
    const optSpacing = 48;
    
    // SOUND
    let y = optStartY;
    let isSelected = (optionSelection === 0);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('SOUND', 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = isMuted ? '#f44' : '#0f0';
    ctx.fillText(isMuted ? 'OFF' : 'ON', W - 60, y);
    
    if (isSelected) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('◄', W - 100, y);
      ctx.textAlign = 'left';
      ctx.fillText('►', W - 50, y);
    }
    
    // VIBRATION
    y = optStartY + optSpacing;
    isSelected = (optionSelection === 1);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('VIBRATION', 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = vibrationEnabled ? '#0f0' : '#f44';
    ctx.fillText(vibrationEnabled ? 'ON' : 'OFF', W - 60, y);
    
    if (isSelected) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('◄', W - 100, y);
      ctx.textAlign = 'left';
      ctx.fillText('►', W - 50, y);
    }
    
    // CONTROLS SIZE
    y = optStartY + optSpacing * 2;
    isSelected = (optionSelection === 2);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('CONTROLS', 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = joystickSize === 1 ? '#0ff' : '#0f0';
    ctx.fillText(JOYSTICK_SIZES[joystickSize], W - 60, y);
    
    if (isSelected) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('◄', W - 130, y);
      ctx.textAlign = 'left';
      ctx.fillText('►', W - 40, y);
    }
    
    // Línea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(50, optStartY + optSpacing * 2.6);
    ctx.lineTo(W - 50, optStartY + optSpacing * 2.6);
    ctx.stroke();
    
    // DIFFICULTY
    y = optStartY + optSpacing * 3;
    isSelected = (optionSelection === 3);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('DIFFICULTY', 60, y);
    ctx.textAlign = 'right';
    
    if (hardcoreUnlocked) {
      ctx.fillStyle = difficultyIndex === 0 ? '#0f0' : '#f00';
      ctx.fillText(difficulties[difficultyIndex].name, W - 60, y);
      
      if (isSelected) {
        ctx.fillStyle = '#ff0';
        ctx.fillText('◄', W - 160, y);
        ctx.textAlign = 'left';
        ctx.fillText('►', W - 40, y);
      }
    
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('NORMAL', W - 60, y);
      ctx.font = '7px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 BEAT GAME TO UNLOCK', W / 2, y + 18);
    }
    
    // Línea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(50, optStartY + optSpacing * 3.6);
    ctx.lineTo(W - 50, optStartY + optSpacing * 3.6);
    ctx.stroke();
    
    // BALANCE PROFILE
    y = optStartY + optSpacing * 4;
    isSelected = (optionSelection === 4);
    const balanceLabel = (typeof getBalanceProfileLabel === 'function') ? getBalanceProfileLabel() : 'ARCADE';
    const isTournament = (typeof getBalanceProfile === 'function') && getBalanceProfile() === 'tournament';

    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }

    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('BALANCE', 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = isTournament ? '#f80' : '#0f0';
    ctx.fillText(balanceLabel, W - 60, y);

    if (isSelected) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('<', W - 170, y);
      ctx.textAlign = 'left';
      ctx.fillText('>', W - 40, y);
    }

    // Linea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(50, optStartY + optSpacing * 4.6);
    ctx.lineTo(W - 50, optStartY + optSpacing * 4.6);
    ctx.stroke();

    // RESET SCORES
    y = optStartY + optSpacing * 5;
    isSelected = (optionSelection === 5);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,0,0,0.2)';
      ctx.fillRect(40, y - 18, W - 80, 50);
    }
    
    ctx.font = '11px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#f00' : '#944';
    ctx.textAlign = 'center';
    ctx.fillText('RESET ALL SCORES', W / 2, y);
    
    if (isSelected) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#f44';
      ctx.fillText('PRESS FIRE TO RESET', W / 2, y + 20);
    }
    
    // Version
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('VERSION 1.2', W / 2, H - 120);
    
    // Instrucciones
    ctx.fillStyle = '#555';
    ctx.fillText('↑↓ SELECT  ←→ CHANGE  FIRE=BACK', W / 2, H - 80);
  }

  // ✅ PANTALLA DE INGRESO DE NOMBRE
  if (state === 'entering_name') {
    // Resetear cualquier transformación
    ctx.restore();
    ctx.save();
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Título
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('HIGH SCORE!', W / 2, 140);

    // Score logrado
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(`SCORE: ${score}`, W / 2, 180);

    // Instrucciones
    ctx.fillStyle = '#0ff';
    ctx.font = '9px "Press Start 2P"';
    ctx.fillText('USE JOYSTICK UP/DOWN', W / 2, 230);

    // Flecha arriba
    ctx.fillStyle = '#0f0';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('▲', W / 2, 268);

    // ✅ LETRA ACTUAL (grande, centrada)
    ctx.fillStyle = '#0f0';
    ctx.font = '32px "Press Start 2P"';
    ctx.fillText(ALPHABET[currentLetterIndex], W / 2, 308);

    // Flecha abajo
    ctx.fillStyle = '#0f0';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('▼', W / 2, 338);

    // Nombre actual + cursor parpadeante
    nameCursorBlink = (nameCursorBlink + 1) % 60;
    const cursor = nameCursorBlink < 30 ? '_' : ' ';
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText(playerName + cursor, W / 2, 360);

    // Hints móvil
    ctx.fillStyle = '#888';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('FIRE: ADD LETTER', W / 2, 400);
    ctx.fillText('MUTE: DELETE', W / 2, 420);
    ctx.fillText('PAUSE: CONFIRM', W / 2, 440);
    
    ctx.restore();
    return; // ✅ SALIR - no dibujar nada más
  }
  /// ✅ PANTALLA DE CONTINUE
  if (state === 'continue') {
    // Resetear transformaciones
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Fondo negro sólido
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    
    // Título
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.font = '24px "Press Start 2P"';
    ctx.fillText('CONTINUE?', W / 2, 120);
    
    // Countdown
    const seconds = Math.ceil(continueTimer / 1000);
    const pulse = Math.sin(globalTime * 0.01) * 0.3 + 0.7;
    
    ctx.font = '48px "Press Start 2P"';
    ctx.fillStyle = seconds <= 2 ? `rgba(255, 0, 0, ${pulse})` : '#fff';
    ctx.fillText(seconds.toString(), W / 2, 200);
    
    // Score actual
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`SCORE: ${score}`, W / 2, 260);
    ctx.fillText(`LEVEL: ${level}`, W / 2, 285);
    
    // Instrucciones
    ctx.font = '14px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    if (globalTime % 1000 < 500) {
      ctx.fillText('FIRE TO CONTINUE', W / 2, 350);
    }
    
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText('3 LIVES - 1 CREDIT', W / 2, 390);
    
    // Continúas usados
    if (continueCount > 0) {
      ctx.fillStyle = '#666';
      ctx.fillText(`CONTINUES USED: ${continueCount}`, W / 2, 420);
    }
    
    // ✅ Instrucción para salir
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#f44';
    ctx.fillText('🔊 = EXIT TO MENU', W / 2, 480);
    
    return; // No dibujar nada más
  }
  if (state === 'playing' || state === 'paused') {
    // Player
    const pColor = '#fff';
const shipKey = (animationFrame === 0) ? 'player_a' : 'player_b';
const tilt = (player.movingLeft ? -0.08 : player.movingRight ? 0.08 : 0);

// ✅ Parpadeo si es invencible
const shouldShow = !isInvincible || Math.floor(globalTime / 100) % 2 === 0;

if (shouldShow) {
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-cx, -cy);

  const pulse = 0.65 + 0.35 * Math.sin(globalTime * 0.035);
  const thrust = player.movingUp ? 1.4 : player.movingDown ? 0.6 : 1.0;
  const flameH = Math.max(4, (10 + 6 * pulse) * thrust);
  const fx = cx;
  const fy = player.y + player.height;

  ctx.globalAlpha = (0.06 + 0.06 * pulse) * thrust;
  ctx.fillStyle = '#0ff';
  ctx.fillRect(fx - 7, fy - 2, 14, flameH + 6);

  ctx.globalAlpha = 0.5 + 0.35 * pulse;
  ctx.fillStyle = '#f80';
  ctx.fillRect(fx - 3, fy, 6, flameH);

  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#ff0';
  ctx.fillRect(fx - 2, fy + 2, 4, Math.max(2, flameH - 3));

  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#fff';
  ctx.fillRect(fx - 1, fy + 3, 2, Math.max(1, flameH - 5));

  ctx.globalAlpha = 1;

  const playerFiring = typeof isFiring !== 'undefined' && isFiring;
  if (playerFiring && state === 'playing' && !pendingNextLevel) {
    const flashByWeapon = {
      normal: ['#fff', '#ff0'],
      double: ['#ff0', '#ff8'],
      spread: ['#0f0', '#afa'],
      machine: ['#f0f', '#faf'],
      laser: ['#0ff', '#aff']
    };
    const colors = flashByWeapon[player.weaponType] || flashByWeapon.normal;
    const pulse = 0.45 + 0.55 * Math.sin(globalTime * 0.07 + player.x * 0.01);

    if (player.weaponType === 'double') {
      ctx.globalAlpha = 0.10 + 0.12 * pulse;
      ctx.fillStyle = colors[1];
      ctx.fillRect(player.x - 2, player.y - 7, 6, 10);
      ctx.globalAlpha = 0.28 + 0.22 * pulse;
      ctx.fillStyle = colors[0];
      ctx.fillRect(player.x - 1, player.y - 5, 4, 7);
      ctx.globalAlpha = 0.50 + 0.28 * pulse;
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x, player.y - 3, 2, 4);

      const rx = player.x + player.width - 4;
      ctx.globalAlpha = 0.10 + 0.12 * pulse;
      ctx.fillStyle = colors[1];
      ctx.fillRect(rx - 2, player.y - 7, 6, 10);
      ctx.globalAlpha = 0.28 + 0.22 * pulse;
      ctx.fillStyle = colors[0];
      ctx.fillRect(rx - 1, player.y - 5, 4, 7);
      ctx.globalAlpha = 0.50 + 0.28 * pulse;
      ctx.fillStyle = '#fff';
      ctx.fillRect(rx, player.y - 3, 2, 4);
    } else {
      ctx.globalAlpha = 0.12 + 0.14 * pulse;
      ctx.fillStyle = colors[1];
      ctx.fillRect(cx - 5, player.y - 9, 10, 14);
      ctx.globalAlpha = 0.32 + 0.24 * pulse;
      ctx.fillStyle = colors[0];
      ctx.fillRect(cx - 3, player.y - 7, 6, 11);
      ctx.globalAlpha = 0.55 + 0.28 * pulse;
      ctx.fillStyle = '#fff';
      ctx.fillRect(cx - 1.5, player.y - 5, 3, 7);
    }

    ctx.globalAlpha = 1;
  }

  if (isInvincible) {
    const shieldPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.045);
    const shieldBlink = 0.5 + 0.5 * Math.sin(globalTime * 0.09);
    const shieldW = player.width + 18 + shieldPulse * 5;
    const shieldH = player.height + 16 + shieldPulse * 4;

    ctx.globalAlpha = 0.12 + shieldPulse * 0.08;
    ctx.fillStyle = '#64f5ff';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.5, shieldH * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.35 + shieldBlink * 0.20;
    ctx.strokeStyle = '#64f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.5, shieldH * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.18 + shieldPulse * 0.12;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1, shieldW * 0.36, shieldH * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  drawSprite(ctx, SPRITES[shipKey], player.x, player.y, pColor, 3);
  ctx.restore();
}


    // UFO
    if (ufo.active) drawSprite(ctx, SPRITES.ufo, ufo.x, ufo.y, currentPalette[3], 3);

      // Boss
    if (boss.active) {
      const bossSprite = (() => {
        switch(boss.pattern) {
          case 'crossfire': return SPRITES.boss_crabtron;
          case 'zigzag':    return SPRITES.boss_serpentrix;
          case 'rotate':    return SPRITES.boss_orbital;
          case 'divebomb':  return SPRITES.boss_teniente;
          case 'supreme':   return SPRITES.boss_emperador;
          default:          return SPRITES.boss_crabtron;
        }
      })();
      
      const bossColor = boss.color || '#f00';
      const bossGlow = 0.08 + 0.03 * Math.sin(globalTime * 0.018);
      ctx.save();
      ctx.globalAlpha = bossGlow;
      drawSprite(ctx, bossSprite, boss.x - 4, boss.y, bossColor, 5);
      drawSprite(ctx, bossSprite, boss.x + 4, boss.y, bossColor, 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y - 4, bossColor, 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y + 4, bossColor, 5);
      ctx.globalAlpha = 0.38;
      drawSprite(ctx, bossSprite, boss.x - 2, boss.y, '#120008', 5);
      drawSprite(ctx, bossSprite, boss.x + 2, boss.y, '#120008', 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y - 2, '#120008', 5);
      drawSprite(ctx, bossSprite, boss.x, boss.y + 2, '#120008', 5);
      ctx.restore();

      drawSprite(ctx, bossSprite, boss.x, boss.y, bossColor, 5);

      ctx.save();
      ctx.globalAlpha = 0.10;
      drawSprite(ctx, bossSprite, boss.x, boss.y - 1, '#ffd0c0', 5);
      ctx.restore();

      if (boss.flashTimer > 0) {
        const flicker = 0.25 + 0.20 * Math.sin(globalTime * 0.04 + boss.flashTimer * 0.01);
        ctx.save();
        ctx.globalAlpha = flicker;
        drawSprite(ctx, bossSprite, boss.x, boss.y, '#ffaaaa', 5);
        ctx.restore();
      }
          
      const hpPct = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
      
      const _barW = 200;
      const _barH = 8;
      const _barX = W / 2 - _barW / 2;
      const _barY = 86;
      const _pad = 4;
      
      ctx.save();
      
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = '#000';
      ctx.fillRect(_barX - _pad, _barY - _pad, _barW + _pad * 2, _barH + _pad * 2);
      
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(_barX - _pad + 0.5, _barY - _pad + 0.5, _barW + _pad * 2 - 1, _barH + _pad * 2 - 1);
      
      ctx.globalAlpha = 0.50;
      ctx.strokeStyle = boss.color || '#f44';
      ctx.beginPath();
      ctx.moveTo(_barX - _pad, _barY - _pad + 0.5);
      ctx.lineTo(_barX + _barW + _pad, _barY - _pad + 0.5);
      ctx.stroke();
      
      ctx.globalAlpha = 0.30;
      ctx.fillStyle = '#300';
      ctx.fillRect(_barX, _barY, _barW, _barH);
      
      var _barColor;
      if (hpPct > 0.66) {
        _barColor = boss.color || '#f00';
      } else if (hpPct > 0.33) {
        _barColor = '#f80';
      } else {
        _barColor = '#f33';
      }
      
      var _fillW = _barW * hpPct;
      
      ctx.globalAlpha = 0.88;
      ctx.fillStyle = _barColor;
      ctx.fillRect(_barX, _barY, _fillW, _barH);
      
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = '#fff';
      ctx.fillRect(_barX, _barY + 1, _fillW, Math.floor(_barH * 0.45));
      
      ctx.globalAlpha = 0.10;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      for (var _sx = _barX + 10; _sx < _barX + _fillW; _sx += 11) {
        ctx.beginPath();
        ctx.moveTo(_sx + 0.5, _barY + 1);
        ctx.lineTo(_sx + 0.5, _barY + _barH - 1);
        ctx.stroke();
      }
      
      if (hpPct <= 0.33) {
        var _pulse = 0.18 + 0.22 * Math.sin(globalTime * 0.012);
        ctx.globalAlpha = _pulse;
        ctx.fillStyle = '#f00';
        ctx.fillRect(_barX, _barY, _fillW, _barH);
      }
      
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.88)';
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2 + 2, _barY - 8);
      var _txtColor = boss.color || '#fff';
      if (_txtColor === '#f00' || _txtColor === '#ff0000') _txtColor = '#ffd6d6';
      ctx.fillStyle = _txtColor;
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2, _barY - 10);
      
      ctx.restore();
    }

    // Enemies
    enemies.forEach(e => {
      if (e.alive) {
        const spriteKey = e.type + (animationFrame === 0 ? '_a' : '_b');
        const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
        
        let color = currentPalette[data.color] || currentPalette[1];
        
        if (e.diving) color = '#f00';
        
    const size = (e.type === 'alien_mini') ? 2 : 3;
    
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = color;
    ctx.fillRect(e.x - 2, e.y - 2, e.w + 4, e.h + 4);
    ctx.globalAlpha = 0.07;
    ctx.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2);
    ctx.restore();
    
    if (e.spawnFlashTimer > 0) {
      const spawnT = Math.max(0, Math.min(1, e.spawnFlashTimer / ENEMY_SPAWN_FLASH_DURATION));
      const pulse = 0.5 + 0.5 * Math.sin((1 - spawnT) * Math.PI * 4);
      ctx.save();
      ctx.globalAlpha = 0.10 * spawnT + 0.08 * pulse * spawnT;
      ctx.fillStyle = color;
      ctx.fillRect(e.x - 6, e.y - 6, e.w + 12, e.h + 12);
      ctx.globalAlpha = 0.20 * spawnT;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(Math.round(e.x - 3), Math.round(e.y - 3), e.w + 6, e.h + 6);
      ctx.restore();
    }
    
    ctx.save();
    if (e.spawnFlashTimer > 0) {
      const spawnT = Math.max(0, Math.min(1, e.spawnFlashTimer / ENEMY_SPAWN_FLASH_DURATION));
      ctx.globalAlpha = 1 - spawnT * 0.42;
    }
    drawSprite(ctx, SPRITES[spriteKey], e.x, e.y, color, size);
    ctx.restore();

        if (e.flashTimer > 0) {
          const flicker = 0.45 + 0.30 * Math.sin(globalTime * 0.06 + e.x * 0.01 + e.flashTimer * 0.005);
          ctx.save();
          ctx.globalAlpha = flicker;
          drawSprite(ctx, SPRITES[spriteKey], e.x, e.y, '#ffe0e0', size);
          ctx.restore();
        }
        
        // Barra de HP para tanques (hp > 1)
        if (e.maxHp > 1 && e.hp < e.maxHp) {
          const barW = e.w * 0.8;
          const barH = 3;
          const barX = e.x + (e.w - barW) / 2;
          const barY = e.y - 6;
          
          ctx.fillStyle = '#500';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = '#f00';
          ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
        }
      }
    });

	    // Player bullets
	    bullets.forEach(b => {
	      if (Array.isArray(b.trail) && b.trail.length > 0) {
	        const trailColor = b.trailColor || b.color || '#fff';
	        const len = b.trail.length;

	        for (let i = 0; i < len; i++) {
	          const t = (i + 1) / len;
	          const p = b.trail[i];
	          const tw = Math.max(1, b.w * (0.40 + t * 0.45));
	          const th = Math.max(1, b.h * (0.25 + t * 0.40));

	          ctx.globalAlpha = 0.03 + t * 0.30;
	          ctx.fillStyle = trailColor;
	          ctx.fillRect(p.x - tw / 2, p.y - th / 2, tw, th);
	        }
	        ctx.globalAlpha = 1;
	      }

	      const glowW = b.type === 'laser' ? 4 : 2;
	      const glowH = b.type === 'laser' ? 6 : 2;
	      ctx.globalAlpha = b.type === 'laser' ? 0.12 : 0.08;
	      ctx.fillStyle = b.color;
	      ctx.fillRect(b.x - glowW, b.y - glowH, b.w + glowW * 2, b.h + glowH * 2);

	      ctx.globalAlpha = 1;
	      ctx.fillStyle = b.color;
	      ctx.fillRect(b.x, b.y, b.w, b.h);

	      const coreW = b.type === 'laser' ? 2 : 1;
	      const coreH = b.type === 'laser' ? 4 : 1;
	      ctx.globalAlpha = b.type === 'laser' ? 0.55 : 0.50;
	      ctx.fillStyle = '#fff';
	      ctx.fillRect(b.x + coreW, b.y + coreH, Math.max(1, b.w - coreW * 2), Math.max(1, b.h - coreH * 2));
	    });
	    ctx.globalAlpha = 1;

    // Enemy bullets
    enemyBullets.forEach(drawEnemyBullet);

    // Minas flotantes (Serpentrix)
    mines.forEach(m => {
      const pulse = Math.sin(m.pulseTime * 0.01) * 0.3 + 0.7; // Pulsa entre 0.4 y 1.0
      const warningPulse = m.life < 2000 ? Math.sin(m.pulseTime * 0.03) > 0 : true; // Parpadea si le queda poca vida
      
      if (warningPulse) {
        // Círculo exterior (glow)
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${0.2 * pulse})`;
        ctx.fill();
        
        // Círculo principal
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${0.6 * pulse})`;
        ctx.fill();
        
        /// Centro brillante
        ctx.beginPath();
        ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0';
        ctx.fill();
      }
    });

    // Satélites orbitantes (Orbital)
    if (boss.active && boss.pattern === 'rotate') {
      satellites.forEach(sat => {
        const pulse = Math.sin(globalTime * 0.008) * 0.2 + 0.8;
        
        // Línea de conexión al boss
        ctx.beginPath();
        ctx.moveTo(boss.x + boss.w / 2, boss.y + boss.h / 2);
        ctx.lineTo(sat.x, sat.y);
        ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Glow exterior
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`;
        ctx.fill();
        
        // Satélite principal
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * pulse})`;
        ctx.fill();
        
        // Centro brillante
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
    }

    // Powerups
    powerUps.forEach(p => {
      const color = getWeaponColor(p.type);
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h / 2;
      const pulse = 0.65 + 0.35 * Math.sin(globalTime * 0.012 + cx * 0.1);
      const char = p.type.charAt(0).toUpperCase();

      ctx.save();

      // Aura exterior pulsing
      ctx.globalAlpha = 0.06 + 0.14 * pulse;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 4, p.y - 4, p.w + 8, p.h + 8);
      ctx.globalAlpha = 0.10 + 0.18 * pulse;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 2, p.y - 2, p.w + 4, p.h + 4);

      // Núcleo con borde oscuro para contraste
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#111';
      ctx.fillRect(p.x - 1, p.y - 1, p.w + 2, p.h + 2);

      ctx.globalAlpha = 0.22 + 0.14 * pulse;
      ctx.fillStyle = color;
      ctx.fillRect(p.x - 1, p.y - 1, p.w + 2, 1);
      ctx.fillRect(p.x - 1, p.y + p.h, p.w + 2, 1);
      ctx.fillRect(p.x - 1, p.y, 1, p.h);
      ctx.fillRect(p.x + p.w, p.y, 1, p.h);

      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, p.w, p.h);

      // Brillo interno
      ctx.globalAlpha = 0.35 * pulse;
      ctx.fillStyle = '#fff';
      ctx.fillRect(p.x + 2, p.y + 2, p.w - 4, p.h - 4);

      // Letra con glow sutil y sombra
      ctx.globalAlpha = 0.30 * pulse;
      ctx.font = '9px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.fillText(char, cx, cy);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.fillText(char, cx + 1, cy + 1);
      ctx.fillStyle = '#fff';
      ctx.fillText(char, cx, cy);

      ctx.restore();
    });

    // UFO reward drops
ufoRewards.forEach(d => {
  const cx = d.x + d.w * 0.5;
  const cy = d.y + d.h * 0.5;
  const pulse = Math.sin(globalTime * 0.018) * 0.3 + 0.7;
  const color = d.reward?.rare ? '#ffea00' : '#23f6ff';
  const accent = d.reward?.rare ? '#fff6a8' : '#c8ffff';

  ctx.save();
  ctx.translate(cx, cy);

  ctx.globalAlpha = 0.18 + pulse * 0.28;
  ctx.fillStyle = color;
  ctx.fillRect(-d.w * 0.5 - 4, -d.h * 0.5 - 4, d.w + 8, d.h + 8);

  ctx.globalAlpha = 1;
  ctx.fillStyle = '#071014';
  ctx.fillRect(-d.w * 0.5 - 1, -d.h * 0.5 - 1, d.w + 2, d.h + 2);

  ctx.fillStyle = color;
  ctx.fillRect(-d.w * 0.5, -d.h * 0.5, d.w, d.h);

  ctx.globalAlpha = 0.35 + pulse * 0.35;
  ctx.fillStyle = accent;
  ctx.fillRect(-d.w * 0.5 + 2, -d.h * 0.5 + 2, d.w - 4, 3);
  ctx.fillRect(-d.w * 0.5 + 3, -d.h * 0.5 + 6, 2, d.h - 9);

  ctx.globalAlpha = 1;
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText('?', 1, 2);
  ctx.fillStyle = '#fff';
  ctx.fillText('?', 0, 1);

  ctx.restore();
});

    drawMedals(ctx);

    // Particles
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      
      if (p.isRing) {
        // Anillo expansivo
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        p.ringRadius += p.ringExpand * 0.1;
      } else if (p.isSpark) {
        // Chispa con trail
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = p.life * 0.5;
        ctx.fillRect(p.x - p.vx * 0.3, p.y - p.vy * 0.3, p.size, p.size);
      } else {
        // Partícula normal
        const size = p.size || 3;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, size, size);
      }
    });
    ctx.globalAlpha = 1;
    drawPopups(ctx);


    // HUD
    ctx.save();
    const hudTop = 7;
    const hudLeftX = 6;
    const hudLeftW = 112;
    const hudRightW = 108;
    const hudRightX = W - hudRightW - 6;

    drawGameplayHudPanel(hudLeftX, hudTop, hudLeftW, 38, '#0ff');
    drawGameplayHudPanel(hudRightX, hudTop, hudRightW, 38, '#ffd966');

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = 'rgba(100,245,255,0.82)';
    ctx.fillText('SCORE', hudLeftX + 6, hudTop + 13);
    ctx.fillText('LEVEL', hudLeftX + 6, hudTop + 31);

    ctx.textAlign = 'right';
    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.fillText(score, hudLeftX + hudLeftW - 7, hudTop + 14);
    ctx.fillText(level, hudLeftX + hudLeftW - 7, hudTop + 32);

    ctx.textAlign = 'left';
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,217,102,0.86)';
    ctx.fillText('HI', hudRightX + 6, hudTop + 10);
    ctx.fillStyle = 'rgba(158,231,255,0.82)';
    ctx.fillText('CHAIN', hudRightX + 6, hudTop + 23);
    ctx.fillStyle = 'rgba(255,217,102,0.78)';
    ctx.fillText('NEXT', hudRightX + 6, hudTop + 35);

    ctx.textAlign = 'right';
    ctx.font = '7px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.fillText(bestScore, hudRightX + hudRightW - 6, hudTop + 10);
    ctx.fillStyle = '#9ee7ff';
    ctx.fillText(medalChain, hudRightX + hudRightW - 6, hudTop + 23);
    ctx.fillStyle = '#ffd966';
    ctx.fillText(medalValue, hudRightX + hudRightW - 6, hudTop + 35);
    ctx.restore();

      if (typeof getBalanceProfile === 'function' && getBalanceProfile() === 'tournament') {
        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = '#ffb36b';
        ctx.fillText('TOUR', W / 2, 36);
      }

      if (setPieceIntroTimer > 0 && currentSetPiece) {
        const pulse = 0.45 + 0.55 * Math.sin(globalTime * 0.03);
        ctx.textAlign = 'center';
        ctx.font = '18px "Press Start 2P"';
        ctx.fillStyle = `rgba(255,70,70,${pulse})`;
        ctx.fillText('WARNING', W / 2, 114);

        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = `rgba(255,230,140,${0.55 + 0.45 * Math.sin(globalTime * 0.026)})`;
        ctx.fillText(setPieceBannerText || 'HOSTILE FORMATION', W / 2, 136);
      }

      if (setPieceTelegraphTimer > 0 && currentSetPiece === 'imperial_guard') {
        const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.05);
        const side = setPieceTelegraphSide === -1 ? -1 : 1;
        const x = side < 0 ? 24 : W - 24;
        const diffMode = difficulties[difficultyIndex] || difficulties[0];
        const isAdvanced = level >= 19 || diffMode.key === 'hardcore';
        const isDoubleCrossfire = setPieceBurstShotsRemaining > 0 || isAdvanced;
        const isSecondTelegraph = isAdvanced && setPieceBurstShotsRemaining === 1;
        const lineColor = isSecondTelegraph
          ? `rgba(255,70,70,${0.42 + 0.46 * pulse})`
          : `rgba(255,190,85,${0.35 + 0.45 * pulse})`;
        const flashColor = isSecondTelegraph
          ? `rgba(255,60,60,${0.28 + 0.40 * pulse})`
          : `rgba(255,190,70,${0.24 + 0.36 * pulse})`;

        ctx.fillStyle = flashColor;
        ctx.fillRect(side < 0 ? 4 : W - 14, 90, 10, H - 210);

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, 94);
        ctx.lineTo(x, H - 120);
        ctx.stroke();

        ctx.fillStyle = lineColor;
        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        const label = isDoubleCrossfire
          ? (isSecondTelegraph ? 'CROSSFIRE B' : 'CROSSFIRE A')
          : 'CROSSFIRE';
        ctx.fillText(label, W / 2, 96);
      }

      if (setPieceTelegraphTimer > 0 && currentSetPiece === 'fortress') {
        const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.05);
        const lane = Math.max(0, Math.floor(setPieceTelegraphSide || 0));
        const rowEnemies = enemies.filter(e => e.alive && !e.diving && e.row === lane);
        const y = rowEnemies.length > 0
          ? rowEnemies.reduce((acc, e) => acc + (e.y + e.h * 0.55), 0) / rowEnemies.length
          : (118 + lane * 34);

        ctx.fillStyle = `rgba(255,170,70,${0.14 + 0.22 * pulse})`;
        ctx.fillRect(8, y - 12, W - 16, 24);

        ctx.strokeStyle = `rgba(255,205,95,${0.35 + 0.45 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(8, y);
        ctx.lineTo(W - 8, y);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = `rgba(255,220,120,${0.45 + 0.45 * pulse})`;
        ctx.fillText(`ROW ${lane + 1} BARRAGE`, W / 2, 96);
      }

      if (setPieceTelegraphTimer > 0 && currentSetPiece === 'split_storm') {
        const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.055);
        const side = setPieceTelegraphSide === -1 ? -1 : 1;
        const x = side < 0 ? 18 : W - 18;

        ctx.fillStyle = `rgba(120,255,200,${0.16 + 0.25 * pulse})`;
        ctx.fillRect(side < 0 ? 4 : W - 14, 100, 10, H - 220);

        ctx.strokeStyle = `rgba(150,255,210,${0.40 + 0.44 * pulse})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, 104);
        ctx.lineTo(x, H - 120);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = `rgba(170,255,220,${0.50 + 0.40 * pulse})`;
        ctx.fillText('FAN BURST', W / 2, 96);
      }

	    if (setPieceBannerTimer > 0 && setPieceBannerText && setPieceIntroTimer <= 0) {
	      const pulse = 0.55 + 0.45 * Math.sin(globalTime * 0.02);
	      ctx.textAlign = 'center';
	      ctx.font = '9px "Press Start 2P"';
	      ctx.fillStyle = `rgba(255,220,80,${pulse})`;
	      ctx.fillText(setPieceBannerText, W / 2, 78);
	    }

	   // Power timer (abajo a la derecha)
if (player.weaponType !== 'normal') {
  const maxDurations = { double: 4000, spread: 4000, machine: 4000, laser: 4000 };
  const maxTime = maxDurations[player.weaponType] || 5000;
  const trackW = 76;
  const barW = Math.min(trackW, (player.weaponTimer / maxTime) * trackW);

  const barX = W - 90;    // derecha
  const barY = H - 17;    // alineado con vidas
  const wColor = getWeaponColor(player.weaponType);

  ctx.save();

  // Fondo oscuro del track
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#000';
  ctx.fillRect(barX - 1, barY - 1, trackW + 2, 7);

  // Track vacio (tenue)
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = wColor;
  ctx.fillRect(barX, barY, trackW, 5);

  // Barra llena
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = wColor;
  ctx.fillRect(barX, barY, barW, 5);

  // Brillo interno
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#fff';
  ctx.fillRect(barX, barY + 1, barW, 2);

  // Borde fino
  ctx.globalAlpha = 0.38;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX + 0.5, barY + 0.5, trackW - 1, 4);

  // Low-time pulse
      if (player.weaponTimer < 1200) {
        const warnPulse = 0.30 + 0.30 * Math.sin(globalTime * 0.06);
        ctx.globalAlpha = warnPulse;
        ctx.fillStyle = '#f44';
        ctx.fillRect(barX, barY, barW, 5);
      }

      // Etiqueta con sombra para legibilidad
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = '#000';
      ctx.font = '6px "Press Start 2P"';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(player.weaponType.toUpperCase(), W - 10, barY - 3);
      ctx.fillText(player.weaponType.toUpperCase(), W - 10, barY - 1);

      ctx.globalAlpha = 1;
      ctx.fillStyle = wColor;
      ctx.fillText(player.weaponType.toUpperCase(), W - 9, barY - 2);

  ctx.restore();
}



    // Lives
    const livesW = 12 + lives * 15;
    drawGameplayHudPanel(4, H - 26, livesW, 17, currentPalette[0]);
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = currentPalette[0];
      ctx.fillRect(11 + i * 15, H - 21, 9, 6);
    }

    // LEVEL CLEAR overlay
    if (pendingNextLevel) {
      ctx.save();

      var lcPulse = 0.6 + 0.4 * Math.sin(globalTime * 0.003);
      var lcAlpha = Math.min(1, levelClearTimer / 300);

      ctx.globalAlpha = 0.3 * lcAlpha;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, H / 2 - 55, W, 110);

      ctx.globalAlpha = 0.7 * lcAlpha * lcPulse;
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H / 2 - 55);
      ctx.lineTo(W, H / 2 - 55);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, H / 2 + 55);
      ctx.lineTo(W, H / 2 + 55);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = '28px "Press Start 2P"';

      ctx.globalAlpha = 0.7 * lcAlpha;
      ctx.fillStyle = '#000';
      ctx.fillText('LEVEL CLEAR', W / 2 + 3, H / 2 - 3);

      ctx.globalAlpha = lcAlpha * lcPulse;
      ctx.fillStyle = '#0ff';
      ctx.fillText('LEVEL CLEAR', W / 2, H / 2 - 6);

      ctx.font = '12px "Press Start 2P"';
      ctx.globalAlpha = 0.8 * lcAlpha * (0.5 + 0.5 * Math.sin(globalTime * 0.005));
      ctx.fillStyle = '#fff';
      ctx.fillText('WARPING', W / 2, H / 2 + 30);

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // BOSS WARNING overlay
    if (boss && boss.active) {
      ctx.save();

      var bwPulse = 0.7 + 0.3 * Math.sin(globalTime * 0.004);
      var bwPulseF = 0.55 + 0.45 * Math.sin(globalTime * 0.006 + 1.5);
      var _bwY = 52;
      var _bwH = 24;
      var _bwColor = boss.color || '#f44';
      var _stripeStep = 20;

      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, _bwY, W, _bwH);

      ctx.globalAlpha = 0.12 + 0.04 * bwPulseF;
      ctx.fillStyle = '#400';
      for (var sx = -_stripeStep; sx < W + _stripeStep; sx += _stripeStep) {
        ctx.beginPath();
        ctx.moveTo(sx, _bwY + _bwH);
        ctx.lineTo(sx + _stripeStep * 0.5, _bwY);
        ctx.lineTo(sx + _stripeStep, _bwY);
        ctx.lineTo(sx + _stripeStep * 0.5, _bwY + _bwH);
        ctx.closePath();
        ctx.fill();
      }

      ctx.globalAlpha = 0.72 * bwPulse;
      ctx.fillStyle = _bwColor;
      ctx.fillRect(0, _bwY, W, 1);
      ctx.fillRect(0, _bwY + _bwH - 1, W, 1);

      ctx.globalAlpha = 0.30 + 0.22 * bwPulseF;
      ctx.fillStyle = _bwColor;
      ctx.fillRect(0, _bwY + 1, 2, _bwH - 2);
      ctx.fillRect(W - 2, _bwY + 1, 2, _bwH - 2);

      ctx.textAlign = 'center';
      ctx.font = '9px "Press Start 2P"';

      ctx.globalAlpha = 0.22 * bwPulseF;
      ctx.fillStyle = _bwColor;
      ctx.fillText('WARNING', W / 2, _bwY + 9);
      ctx.fillText('WARNING', W / 2, _bwY + 11);

      ctx.globalAlpha = 0.60 * bwPulse;
      ctx.fillStyle = '#000';
      ctx.fillText('WARNING', W / 2 + 1, _bwY + 11);

      ctx.globalAlpha = 0.82 * bwPulse;
      ctx.fillStyle = _bwColor;
      ctx.fillText('WARNING', W / 2, _bwY + 10);

      if (boss.name) {
        ctx.font = '7px "Press Start 2P"';
        ctx.globalAlpha = 0.50 * bwPulse;
        ctx.fillStyle = '#000';
        ctx.fillText(boss.name.toUpperCase(), W / 2 + 1, _bwY + 21);

        ctx.globalAlpha = 0.60 * bwPulseF;
        ctx.fillStyle = '#fbb';
        ctx.fillText(boss.name.toUpperCase(), W / 2, _bwY + 20);
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Pause overlay - ESTILO ARCADE
    if (state === 'paused') {
      const pausePulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
      const panelW = Math.min(W - 40, 300);
      const panelH = 330;
      const panelX = (W - panelW) / 2;
      const panelY = Math.max(52, (H - panelH) / 2);
      const accent = currentPalette[0] || '#0ff';

      ctx.fillStyle = 'rgba(0,0,0,0.72)';
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.18 + pausePulse * 0.08;
      ctx.fillStyle = accent;
      ctx.fillRect(0, 0, W, 2);
      ctx.fillRect(0, H - 2, W, 2);
      ctx.globalAlpha = 1;

      drawOverlayPanel(panelX, panelY, panelW, panelH, accent);

      ctx.textAlign = 'center';
      drawGlowText(
        'PAUSED',
        W / 2,
        panelY + 46,
        '24px "Press Start 2P"',
        pausePulse > 0.45 ? '#fff36a' : '#fff',
        'rgba(255,235,90,0.65)'
      );

      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(panelX + 24, panelY + 68);
      ctx.lineTo(panelX + panelW - 24, panelY + 68);
      ctx.stroke();

      ctx.font = '10px "Press Start 2P"';
      const statsX = panelX + 34;
      const statsValueX = panelX + panelW - 34;
      let y = panelY + 98;
      const lh = 24;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('SCORE:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(score.toString(), statsValueX, y);

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('HI-SCORE:', statsX, y);
      ctx.fillStyle = score > bestScore ? '#0f0' : '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(Math.max(score, bestScore).toString(), statsValueX, y);

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('LEVEL:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(level + ' / 20', statsValueX, y);

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('LIVES:', statsX, y);
      for (let i = 0; i < lives; i++) {
        ctx.fillStyle = accent;
        ctx.fillRect(statsValueX - 12 - (lives - 1 - i) * 18, y - 10, 12, 8);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillRect(statsValueX - 12 - (lives - 1 - i) * 18, y - 10, 12, 1);
      }

      y += lh;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64f5ff';
      ctx.fillText('WEAPON:', statsX, y);
      ctx.fillStyle = player.weaponType !== 'normal' ? getWeaponColor(player.weaponType) : '#666';
      ctx.textAlign = 'right';
      ctx.fillText(player.weaponType.toUpperCase(), statsValueX, y);

      y += 24;
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.moveTo(panelX + 24, y);
      ctx.lineTo(panelX + panelW - 24, y);
      ctx.stroke();

      y += 22;
      const pauseOptions = ['RESUME', 'OPTIONS', 'QUIT'];

      for (let i = 0; i < pauseOptions.length; i++) {
        const optY = y + i * 32;
        const isSelected = (pauseSelection === i);

        if (isSelected) {
          ctx.fillStyle = 'rgba(255,245,120,0.12)';
          ctx.fillRect(panelX + 28, optY - 18, panelW - 56, 28);
          ctx.strokeStyle = 'rgba(255,245,120,0.45)';
          ctx.strokeRect(panelX + 28.5, optY - 18.5, panelW - 57, 27);

          ctx.font = '12px "Press Start 2P"';
          ctx.fillStyle = '#ff0';
          const cursorPulse = Math.sin(globalTime * 0.008) * 3;
          ctx.textAlign = 'left';
          ctx.fillText('>', panelX + 42 - cursorPulse, optY);
          ctx.textAlign = 'right';
          ctx.fillText('<', panelX + panelW - 42 + cursorPulse, optY);
        }

        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? '#fff36a' : '#8a94a8';
        ctx.fillText(pauseOptions[i], W / 2, optY);
      }

      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = 'rgba(255,255,255,0.38)';
      ctx.fillText('UP/DOWN SELECT   FIRE=OK', W / 2, panelY + panelH + 28);
    }
  }

  // TRY AGAIN overlay (gameover transient)
  if (state === 'gameover' && showTryAgain) {
    const overPulse = 0.5 + 0.5 * Math.sin(globalTime * 0.006);
    const panelW = Math.min(W - 56, 300);
    const panelH = 138;
    const panelX = (W - panelW) / 2;
    const panelY = (H - panelH) / 2 - 8;
    const accent = '#ff365f';

    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(-10, -10, W + 20, H + 20);

    ctx.globalAlpha = 0.16 + overPulse * 0.08;
    ctx.fillStyle = accent;
    ctx.fillRect(0, Math.floor(H / 2) - 2, W, 4);
    ctx.globalAlpha = 1;

    drawOverlayPanel(panelX, panelY, panelW, panelH, accent);
    drawGlowText(
      'TRY AGAIN',
      W / 2,
      panelY + 62,
      '24px "Press Start 2P"',
      overPulse > 0.35 ? '#fff' : '#ffd7df',
      'rgba(255,54,95,0.75)'
    );

    ctx.textAlign = 'center';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.fillText('PRESS FIRE', W / 2, panelY + 98);
  }

  // Victory screen ÉPICO
  if (state === 'victory') {
    // Fondo gradual
    ctx.fillStyle = 'rgba(0,0,10,0.9)';
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    
    // Fase 1: Explosiones (solo mostrar boss explotando)
    if (victoryPhase === 1) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = '#f00';
      if (globalTime % 200 < 100) {
        ctx.fillText('EMPEROR DESTROYED', W / 2, H / 2);
      }
    }
    
    // Fase 2: Nave subiendo
    if (victoryPhase === 2) {
      // Dibujar nave subiendo
      const shipColor = currentPalette[0];
      const shipKey = (animationFrame === 0) ? 'player_a' : 'player_b';
      drawSprite(ctx, SPRITES[shipKey], player.x, playerVictoryY, shipColor, 3);
      
      // Estela de la nave
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.3 - i * 0.1;
        ctx.fillStyle = shipColor;
        ctx.fillRect(player.x + 14, playerVictoryY + 25 + i * 15, 5, 10);
      }
      ctx.globalAlpha = 1;
      
      ctx.font = '28px "Press Start 2P"';
      ctx.fillStyle = '#ff0';
      ctx.fillText('VICTORY!', W / 2, 80);
    }
    
    // Fase 3: Stats y grado
    if (victoryPhase === 3) {
      // Título
      ctx.font = '32px "Press Start 2P"';
      ctx.fillStyle = '#ff0';
      ctx.fillText('VICTORY!', W / 2, 60);
      
      // Grado gigante
      const gradePulse = Math.sin(globalTime * 0.005) * 0.2 + 0.8;
      ctx.font = '64px "Press Start 2P"';
      ctx.fillStyle = getGradeColor(finalGrade);
      ctx.globalAlpha = gradePulse;
      ctx.fillText(finalGrade, W / 2, 140);
      ctx.globalAlpha = 1;
      
      // Descripción del grado
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#888';
      const gradeDesc = {
        'S': 'PERFECT! LEGENDARY PILOT!',
        'A': 'EXCELLENT! TRUE HERO!',
        'B': 'GREAT JOB! WELL DONE!',
        'C': 'MISSION COMPLETE!'
      };
      ctx.fillText(gradeDesc[finalGrade], W / 2, 165);
      
      // Stats
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'left';
      const statsX = W / 2 - 100;
      let statsY = 200;
      const lineH = 24;
      
      ctx.fillStyle = '#0ff';
      ctx.fillText('FINAL SCORE:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(score.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('TIME:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(formatTime(gameStats.totalTime), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('ENEMIES:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(gameStats.enemiesKilled.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('ACCURACY:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      const accuracy = gameStats.shotsFired > 0 ? Math.floor((gameStats.shotsHit / gameStats.shotsFired) * 100) : 0;
      ctx.fillText(accuracy + '%', statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('POWERUPS:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(gameStats.powerupsCollected.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('CONTINUES:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = continueCount === 0 ? '#0f0' : '#f80';
      ctx.fillText(continueCount.toString(), statsX + 200, statsY);
      
      // Hardcore unlocked
      ctx.textAlign = 'center';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillStyle = '#f0f';
      if (globalTime % 1000 < 500) {
        ctx.fillText('★ HARDCORE UNLOCKED ★', W / 2, statsY + 50);
      }
      
      // Press fire
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#aaa';
      if (globalTime % 800 < 400) {
        ctx.fillText('PRESS FIRE', W / 2, H - 70);
      }
      
      // Trofeo pequeño
      const trophyBob = Math.sin(globalTime * 0.004) * 5;
      drawSprite(ctx, SPRITES.victory_trophy, W - 60, 40 + trophyBob, '#ff0', 3);
    }

    // Confetti en todas las fases (excepto 1)
    if (victoryPhase > 1) {
      victoryParticles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.globalAlpha = 1;
    }
  }

  if (isBalanceDebugEnabled()) {
    drawBalanceDebugOverlay(ctx);
  }

  // Flash overlay
  if (flashScreen > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flashScreen * 0.1})`;
    ctx.fillRect(-10, -10, W + 20, H + 20);
  }

  ctx.restore();
}

