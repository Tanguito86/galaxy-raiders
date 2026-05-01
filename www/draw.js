// =====================
// GALAXY RAIDERS - draw.js
// =====================

// --- DRAW ---
function draw() {
  // 1) Limpiar y pintar fondo SIN translate (así el fondo no recibe shake global)
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);

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
    const dx = (Math.random() - 0.5) * screenShakeGameplay * SHAKE_CONFIG.gameplayTranslate;
    const dy = (Math.random() - 0.5) * screenShakeGameplay * SHAKE_CONFIG.gameplayTranslate;
    ctx.translate(dx, dy);
  }



  if (state === 'menu') {
    ctx.textAlign = 'center';
    
    // Aliens decorativos animados
    const alienWave = Math.sin(globalTime * 0.003) * 15;
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
  
  drawSprite(ctx, SPRITES[spriteKey], baseX + wave - 12, alien.y, color, 3);
});
    
    // Título
    ctx.font = '36px "Press Start 2P"';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText('GALAXY', W / 2 + 3, 203);
    ctx.fillStyle = currentPalette[0];
    ctx.fillText('GALAXY', W / 2, 200);
    
    ctx.font = '30px "Press Start 2P"';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText('RAIDERS', W / 2 + 3, 243);
    ctx.fillStyle = '#fff';
    ctx.fillText('RAIDERS', W / 2, 240);
    
    // High Score
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('🌍 ' + globalTopName + ' ' + globalTopScore, W / 2, 280);
    
    // Opciones del menú
    const menuStartY = 340;
    const menuSpacing = 40;
    
    MENU_OPTIONS.forEach((option, i) => {
      const y = menuStartY + i * menuSpacing;
      const isSelected = (menuSelection === i);
      
      if (isSelected) {
        // Fondo seleccionado
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(W / 2 - 100, y - 23, 200, 30);
        
        // Flechas
        ctx.fillStyle = '#ff0';
        ctx.font = '14px "Press Start 2P"';
        const pulse = Math.sin(globalTime * 0.008) * 3;
        ctx.fillText('►', W / 2 - 80 - pulse, y);
        ctx.fillText('◄', W / 2 + 80 + pulse, y);
      }
      
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = isSelected ? '#ff0' : '#666';
      ctx.fillText(option, W / 2, y);
    });
    
    // Dificultad (si está desbloqueado)
    if (hardcoreUnlocked) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('MODE: ' + difficulties[difficultyIndex].name, W / 2, 470);
    }

    if (typeof getBalanceProfileLabel === 'function') {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('BALANCE: ' + getBalanceProfileLabel(), W / 2, 490);
    }
    
    // Créditos/Fichas
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('🪙 ' + playerCredits + ' CREDITS', W / 2, H - 100);
    
    // Instrucciones
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#555';
    ctx.fillText('↑↓ SELECT   FIRE=OK', W / 2, H - 70);
    
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
      
      // Flash blanco al recibir daño
      const bossColor = (boss.flashTimer > 0) ? '#fff' : (boss.color || '#f00');
      drawSprite(ctx, bossSprite, boss.x, boss.y, bossColor, 5);
          
      const hpPct = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
      
      // Barra de HP con color del boss
      ctx.fillStyle = '#500';
      ctx.fillRect(W / 2 - 100, 60, 200, 10);
      ctx.fillStyle = boss.color || '#f00';
      ctx.fillRect(W / 2 - 100, 60, 200 * hpPct, 10);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(W / 2 - 100, 60, 200, 10);
      
      // ✅ Mostrar nombre del boss (arriba de la barra de HP)
      ctx.font = '12px "Press Start 2P"';
      ctx.textAlign = 'center';
      
      // Sombra del texto
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2 + 2, 52);
      
      // Texto principal con color del boss
      ctx.fillStyle = boss.color || '#fff';
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2, 50);
    }

    // Enemies
    enemies.forEach(e => {
      if (e.alive) {
        const spriteKey = e.type + (animationFrame === 0 ? '_a' : '_b');
        const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
        
        // Color base según tipo
        let color = currentPalette[data.color] || currentPalette[1];
        
        // Diving = rojo
        if (e.diving) color = '#f00';
        
        // Flash blanco al recibir daño
        if (e.flashTimer > 0) color = '#fff';
        
        // Tamaño del sprite (mini aliens más chicos)
        const size = (e.type === 'alien_mini') ? 2 : 3;
        
        drawSprite(ctx, SPRITES[spriteKey], e.x, e.y, color, size);
        
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
      const char = p.type.charAt(0).toUpperCase();
      const color = getWeaponColor(p.type);
      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#000';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(char, p.x + 2, p.y + 10);
    });

    // UFO reward drops
ufoRewards.forEach(d => {
  const pulse = Math.sin(globalTime * 0.01) * 0.3 + 0.7;

  ctx.fillStyle = d.reward?.rare ? '#ff0' : '#0ff';
  ctx.globalAlpha = pulse;
  ctx.fillRect(d.x, d.y, d.w, d.h);
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#000';
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.fillText('?', d.x + 3, d.y + 12);
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
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'left';
	    ctx.fillText(`SC:${score}`, 10, 35);
	    ctx.fillText(`LV:${level}`, 10, 55);
	    ctx.textAlign = 'right';
	    ctx.fillText(`HI:${bestScore}`, W - 10, 35);
      drawMedalHUD(ctx);

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
  const barW = Math.min(100, (player.weaponTimer / maxTime) * 100);

  const barX = W - 120;   // derecha
  const barY = H - 18;    // alineado con vidas (un pelín arriba)

  ctx.fillStyle = getWeaponColor(player.weaponType);
  ctx.fillRect(barX, barY, barW, 6);

  ctx.strokeStyle = '#fff';
  ctx.strokeRect(barX, barY, 100, 6);

  // etiqueta chica arriba de la barra (para que no pelee con las vidas)
  ctx.fillStyle = '#fff';
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'right';
  ctx.fillText(player.weaponType.toUpperCase(), W - 10, barY - 4);
}



    // Lives
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = currentPalette[0];
      ctx.fillRect(10 + i * 20, H - 20, 10, 8);
    }

    // Pause overlay - ESTILO ARCADE
    if (state === 'paused') {
      // Fondo oscuro
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, W, H);
      
      // Borde decorativo
      ctx.strokeStyle = currentPalette[0];
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 80, W - 60, H - 200);
      
      // Título PAUSED parpadeante
      ctx.textAlign = 'center';
      ctx.font = '28px "Press Start 2P"';
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText('PAUSED', W / 2 + 3, 123);
      ctx.fillStyle = Math.sin(globalTime * 0.005) > 0 ? '#ff0' : '#fff';
      ctx.fillText('PAUSED', W / 2, 120);
      
      // Línea separadora
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 145);
      ctx.lineTo(W - 50, 145);
      ctx.stroke();
      
      // Stats
      ctx.font = '10px "Press Start 2P"';
      const statsX = 60;
      let y = 175;
      const lh = 26;
      
      // SCORE
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(score.toString(), W - 60, y);
      
      // HI-SCORE
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('HI-SCORE:', statsX, y);
      ctx.fillStyle = score > bestScore ? '#0f0' : '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(Math.max(score, bestScore).toString(), W - 60, y);
      
      // LEVEL
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('LEVEL:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(level + ' / 20', W - 60, y);
      
      // LIVES
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('LIVES:', statsX, y);
      for (let i = 0; i < lives; i++) {
        ctx.fillStyle = currentPalette[0];
        ctx.fillRect(W - 60 - (lives - 1 - i) * 18, y - 10, 12, 8);
      }
      
      // WEAPON
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('WEAPON:', statsX, y);
      ctx.fillStyle = player.weaponType !== 'normal' ? getWeaponColor(player.weaponType) : '#666';
      ctx.textAlign = 'right';
      ctx.fillText(player.weaponType.toUpperCase(), W - 60, y);
      
      // Línea separadora
      y += 25;
      ctx.strokeStyle = '#444';
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(W - 50, y);
      ctx.stroke();
      
      // Menú de pausa
      y += 30;
      const pauseOptions = ['RESUME', 'OPTIONS', 'QUIT'];
      
      for (let i = 0; i < pauseOptions.length; i++) {
        const optY = y + i * 35;
        const isSelected = (pauseSelection === i);
        
        if (isSelected) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(50, optY - 18, W - 100, 30);
          
          ctx.fillStyle = '#ff0';
          ctx.font = '12px "Press Start 2P"';
          const pulse = Math.sin(globalTime * 0.008) * 3;
          ctx.textAlign = 'left';
          ctx.fillText('►', 60 - pulse, optY);
          ctx.textAlign = 'right';
          ctx.fillText('◄', W - 60 + pulse, optY);
        }
        
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? '#ff0' : '#666';
        ctx.fillText(pauseOptions[i], W / 2, optY);
      }
      
      // Instrucciones
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('↑↓ SELECT   FIRE=OK', W / 2, H - 100);
    }
  }

  // TRY AGAIN overlay (gameover transient)
  if (state === 'gameover' && showTryAgain) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(-10, -10, W + 20, H + 20);

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '28px "Press Start 2P"';
    ctx.fillText('TRY AGAIN', W / 2, H / 2);
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

