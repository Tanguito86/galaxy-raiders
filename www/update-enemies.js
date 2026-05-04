// =====================
// GALAXY RAIDERS - update-enemies.js
// =====================

function appendPlayerBulletTrail(b) {
  if (!b || !Array.isArray(b.trail)) return;

  const point = {
    x: b.x + b.w / 2,
    y: b.y + b.h / 2
  };

  const last = b.trail[b.trail.length - 1];
  if (!last || Math.abs(last.x - point.x) + Math.abs(last.y - point.y) > 0.9) {
    b.trail.push(point);
  }

  const maxLen = (BULLET_FX.trailLength && BULLET_FX.trailLength[b.type]) || 4;
  while (b.trail.length > maxLen) b.trail.shift();
}

function updateEnemiesAndProjectiles(step, dt) {
    // UFO spawn/move
    if (!ufo.active && globalTime > ufo.timer && enemies.filter(e => e.alive).length > 0 && !boss.active) {
      ufo.active = true;
      ufo.dir = Math.random() < 0.5 ? 1 : -1;
      ufo.x = ufo.dir === 1 ? -50 : W + 50;
    }
    if (ufo.active) {
      ufo.x += 2 * ufo.dir * step;
      if (globalTime % 200 < 16) playUfoSound();
      if ((ufo.dir === 1 && ufo.x > W) || (ufo.dir === -1 && ufo.x < -50)) {
        ufo.active = false;
        ufo.timer = globalTime + 10000 + Math.random() * 10000;
      }
    }

    // Player bullets
for (let i = bullets.length - 1; i >= 0; i--) {
  const b = bullets[i];
  b.y += b.vy * step;
  b.x += b.vx * step;
  appendPlayerBulletTrail(b);


  let hit = false;
  const piercing = (b.type === 'laser');

  // UFO hit
  if (
    ufo.active &&
    b.x < ufo.x + ufo.w && b.x + b.w > ufo.x &&
    b.y < ufo.y + ufo.h && b.y + b.h > ufo.y
  ) {
    ufo.active = false;
    ufo.timer = globalTime + 15000;
    hit = true;
    recordShotHit();
    requestHitstop(28);
    addScore(200);
    createExplosion(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2, currentPalette[3], 30);
    sfxEnemyKill();
    spawnUfoRewardDrop(ufo.x + ufo.w / 2 - 8, ufo.y + ufo.h);

    if (!piercing) bullets.splice(i, 1);
    continue;


  }

  // HIT AL BOSS
if (
  boss.active &&
  b.x < boss.x + boss.w &&
  b.x + b.w > boss.x &&
  b.y < boss.y + boss.h &&
  b.y + b.h > boss.y
) {
  const dmg = (b.type === 'laser' ? 3 : 1);
  boss.hp -= dmg;

  addScore((b.type === 'laser') ? 2 : 5);

  hit = true;
  recordShotHit();
  requestHitstop(46);
  
  // âœ… VERIFICAR MUERTE DEL BOSS
  if (boss.hp <= 0 && !bossDefeated) {
    bossDefeated = true;
    requestHitstop(64);
    recordEnemyKilled();
    addScore(800);
  }
  
  // âœ… EFECTO DE GOLPE AL BOSS
  boss.flashTimer = 80;
  pushScreenShake('light', 3);
  vibrate('hit');
  
  createImpactBurst(b.x + b.w / 2, b.y + b.h / 2, boss.color || "#ff5050", 4);

  if (!piercing) bullets.splice(i, 1);
  continue;
}

  // âœ… HIT A MINAS
  if (!hit) {
    for (let m = mines.length - 1; m >= 0; m--) {
      const mine = mines[m];
      const dist = Math.hypot((b.x + b.w/2) - mine.x, (b.y + b.h/2) - mine.y);
      
      if (dist < mine.radius + 5) {
        createExplosion(mine.x, mine.y, '#0f0', 15);
        sfxEnemyKill();
        mines.splice(m, 1);
        recordShotHit();
        requestHitstop(30);
        addScore(25);
        hit = true;
        break;
      }
    }
  }

  // Normal enemies hit (incluye minions del Emperador)
  const canHitEnemies = !boss.active || (boss.active && boss.pattern === 'supreme');
  if ((!hit || piercing) && canHitEnemies) {
    for (const e of enemies) {
      if (
        e.alive &&
        b.x < e.x + e.w && b.x + b.w > e.x &&
        b.y < e.y + e.h && b.y + b.h > e.y
      ) {
        const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
        const dmg = (b.type === 'laser') ? 2 : 1;
        
        e.hp -= dmg;
        hit = true;
        recordShotHit();
        
        createImpactBurst(b.x + b.w / 2, b.y + b.h / 2, currentPalette[data.color] || currentPalette[1] || "#fff", 5);
        
        if (e.hp <= 0) {
          /// MUERTE
          e.alive = false;
          recordEnemyKilled();
          requestHitstop(38);

          const killScore = calculateEnemyKillScore(e, data, b.type);
          addScore(killScore);
          spawnMedal(
            e.x + e.w / 2,
            e.y + e.h / 2,
            isEliteMedalTarget(e, data)
          );
          
          const color = currentPalette[data.color] || currentPalette[1];
          createEnemyDeathPop(e.x + e.w / 2, e.y + e.h / 2, color, e);
          sfxEnemyKill();
          vibrate('hit');
          pushScreenShake('medium', 4);
          
          // SPLITTER: dividirse en 2 mini aliens
          if (data.splits) {
            for (let i = 0; i < 2; i++) {
              const offsetX = (i === 0) ? -15 : 15;
              const mini = createEnemy(e.x + offsetX, e.y, e.row, 'alien_mini');
              mini.diving = true;
              mini.vx = (i === 0) ? -2 : 2;
              mini.vy = 2;
              setEnemyMovePattern(mini, chooseEnemyDivePattern(mini));
              enemies.push(mini);
            }
            sfxEnemyHit();
          }
          
          // DROP DE POWERUP
          const chance = e.diving ? 0.07 : e.row === 0 ? 0.06 : e.row === 1 ? 0.05 : 0.04;
          trySpawnPowerUp(e.x, e.y, chance);
          
        } else {
          // DAÃ‘O (no muere) - feedback visual
          e.flashTimer = 150;
          requestHitstop(22);
          sfxEnemyHit();
          pushScreenShake('light', 2);
        }
        
        if (!piercing) break;
      }
    }
  }
  

  if ((hit && !piercing) || b.y < -50 || b.x < -50 || b.x > W + 50) bullets.splice(i, 1);

    }

    // --- RESOLVER MUERTE DEL BOSS (UNA SOLA VEZ) ---
if (bossDefeated) {
  bossDefeated = false;
  boss.active = false;
  requestHitstop(95);

  createBossDeathExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f00');
  sfxBigExplosion();
  vibrate('explosion');
  pushScreenShake('heavy', 50);
  flashScreen = 30;
  addScore(5000);
  spawnMedal(boss.x + boss.w / 2, boss.y + boss.h * 0.55, true, 4);

  // âœ… VICTORIA Ã‰PICA si completaste nivel 20
  if (level === 20) {
    state = 'victory';
    victoryPhase = 1;  // Fase 1: Explosiones en cadena
    victoryPhaseTimer = 0;
    bossExplosionCount = 0;
    playerVictoryY = player.y;
    
    finalizeRunStats('victory');
    finalGrade = calculateGrade();
    
    gameCompleted = true;
    localStorage.setItem('gr_completed', 'true');

    hardcoreUnlocked = true;
    try {
      localStorage.setItem('gr_hardcoreUnlocked', 'true');
    } catch (e) {}

    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  
  } else {
    level++;
    startLevel();
  }
}


    // Enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];

      // Movimiento (recto o en abanico)
      const enemyBulletBaseSpeed = getDifficultySettings(level).bulletSpeed;
      b.x += (b.vx ?? 0) * step;
      b.y += (b.vy ?? enemyBulletBaseSpeed) * step;


      // ColisiÃ³n con el jugador
      if (
        !isInvincible &&
        b.x < player.x + player.width &&
        b.x + b.w > player.x &&
        b.y < player.y + player.height &&
        b.y + b.h > player.y
      ) {
        const deathCause = boss.active ? 'boss' : 'bullet';
        recordPlayerDeath(deathCause);
        requestHitstop(72);
        lives--;
        enemyBullets.splice(i, 1);
        createExplosion(player.x + 16, player.y + 12, '#f00', 30);
        sfxPlayerHit();
        vibrate('damage');
        pushScreenShake('heavy', 20);
        flashScreen = 10;
        player.weaponType = 'normal';
        
        isInvincible = true;
        invincibleTimer = INVINCIBLE_DURATION;
        
        if (lives <= 0) safeEndGame();
        continue;
      }

      // Fuera de pantalla
      if (b.y > H || b.x < -20 || b.x > W + 20) {
        enemyBullets.splice(i, 1);
      }
    }

    
    // Powerups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const p = powerUps[i];
      p.y += p.vy * step;
      if (p.x < player.x + player.width && p.x + p.w > player.x &&
          p.y < player.y + player.height && p.y + p.h > player.y) {
        recordPowerupCollected();
        activateWeapon(p.type);
        powerUps.splice(i, 1);
        addScore(10);
      } else if (p.y > H) {
        powerUps.splice(i, 1);
      }
    }

    // UFO reward drops
for (let i = ufoRewards.length - 1; i >= 0; i--) {
  const d = ufoRewards[i];

  d.y += d.vy * step;

  // colisiÃ³n con el jugador
  if (
    d.x < player.x + player.width &&
    d.x + d.w > player.x &&
    d.y < player.y + player.height &&
    d.y + d.h > player.y
  ) {
    const rw = d.reward;
    recordPowerupCollected();

    if (rw.kind === 'weapon') {
      activateWeapon(rw.type);
      player.weaponTimer = rw.duration;
    }
    if (rw.kind === 'life') {
      awardExtraLife();
    }
    else if (rw.kind === 'score') {
      addScore(rw.amount);
      if (rw.rare) {
        flashScreen = 20;
        pushScreenShake('medium', 20);
      }
    }
    else if (rw.kind === 'shield') {
      isInvincible = true;
      invincibleTimer = rw.duration;
    }

    sfxPowerUp();
    ufoRewards.splice(i, 1);
    continue;
  }

  // fuera de pantalla
  if (d.y > H) {
    ufoRewards.splice(i, 1);
  }
}


    // Minas flotantes (Serpentrix)
for (let i = mines.length - 1; i >= 0; i--) {
  const m = mines[i];
  m.y += m.vy * step;
  m.life -= dt;
  m.pulseTime += dt;
  
  // âœ… Explotar cuando se acaba el tiempo
  if (m.life <= 0) {
    createExplosion(m.x, m.y, '#0f0', 15);
    sfxEnemyKill();
    mines.splice(i, 1);
    continue;
  }
  
  // Fuera de pantalla
  if (m.y > H + 20) {
    mines.splice(i, 1);
    continue;
  }
      
      // ColisiÃ³n con jugador (si no es invencible)
      if (!isInvincible) {
        const dx = (player.x + player.width / 2) - m.x;
        const dy = (player.y + player.height / 2) - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < m.radius + 15) {
          // Â¡BOOM! Mina explota
          createExplosion(m.x, m.y, '#0f0', 20);
          sfxBigExplosion();
          pushScreenShake('heavy', 15);
          mines.splice(i, 1);
          
          recordPlayerDeath('boss');
          requestHitstop(76);
          lives--;
          isInvincible = true;
          invincibleTimer = INVINCIBLE_DURATION;
          sfxPlayerHit();
          vibrate('damage');
          
          if (lives <= 0) {
            safeEndGame();
          }
        }
      }
    }

    // SatÃ©lites orbitantes (Orbital)
    if (boss.active && boss.pattern === 'rotate') {
      const phase = getBossPhase();
      
      // Agregar satÃ©lite extra en fase 2 y 3
      if (phase >= 2 && satellites.length < 3) {
        satellites.push({
          angle: Math.random() * Math.PI * 2,
          distance: 70,
          radius: 8,
          shootTimer: 0
        });
      }
      if (phase >= 3 && satellites.length < 4) {
        satellites.push({
          angle: Math.random() * Math.PI * 2,
          distance: 80,
          radius: 8,
          shootTimer: 0
        });
      }
      
      satellites.forEach(sat => {
        // Rotar alrededor del boss
        sat.angle += 0.03 * step * (boss.orbitDir || 1);
        
        // PosiciÃ³n del satÃ©lite
        const satX = boss.x + boss.w / 2 + Math.cos(sat.angle) * sat.distance;
        const satY = boss.y + boss.h / 2 + Math.sin(sat.angle) * sat.distance;
        sat.x = satX;
        sat.y = satY;
        
        // Disparo del satÃ©lite
        sat.shootTimer += dt;
        if (sat.shootTimer > 2000) {
          sat.shootTimer = 0;
          
          // Disparo hacia el jugador
          const dx = player.x + player.width / 2 - satX;
          const dy = player.y + player.height / 2 - satY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          pushEnemyBullet(
            satX,
            satY,
            (dx / dist) * 4,
            (dy / dist) * 4,
            6,
            6,
            { kind: 'orb', color: '#72f6ff' }
          );
          sfxEnemyHit();
        }
        
        // ColisiÃ³n satÃ©lite con jugador
        if (!isInvincible) {
          const dx = (player.x + player.width / 2) - satX;
          const dy = (player.y + player.height / 2) - satY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < sat.radius + 12) {
            createExplosion(satX, satY, '#0ff', 15);
            sfxBigExplosion();
            pushScreenShake('heavy', 12);
            
            recordPlayerDeath('boss');
            requestHitstop(72);
            lives--;
            isInvincible = true;
            invincibleTimer = INVINCIBLE_DURATION;
            sfxPlayerHit();
            vibrate('damage');
            
            if (lives <= 0) {
              safeEndGame();
            }
          }
        }
      });
    }

    // Enemies movement & diving & shooting
const activeEnemies = enemies.filter(e => e.alive);
// Actualizar flash timer de enemigos
  activeEnemies.forEach(e => {
    if (e.spawnFlashTimer > 0) e.spawnFlashTimer = Math.max(0, e.spawnFlashTimer - dt);
    if (e.flashTimer > 0) e.flashTimer -= dt;
  });

// âœ… IMPORTANTÃSIMO: startLevel NO va acÃ¡ (lo maneja el warp)
if (!boss.active && activeEnemies.length > 0) {
  if (setPieceIntroTimer > 0 && currentSetPiece) {
    const introFinished = updateSetPieceIntro(activeEnemies, step, dt);
    if (introFinished) {
      setPieceIntroTimer = 0;
      resolveSetPieceIntro();
    }
    return;
  }

  // --- shmup route enemies ---
  activeEnemies.forEach(e => { e._shmupHandled = false; });

  activeEnemies.forEach(e => {
    if (!e.shmupRoute || e.diving) return;
    if (e.baseX === undefined) e.baseX = e.x;
    if (e.routePhase === undefined) e.routePhase = Math.random() * Math.PI * 2;
    applyShmupEnemyRoute(e, step, globalTime, player);
    e._shmupHandled = true;

    if (e.y > H + 40 || e.x < -e.w * 2 || e.x > W + e.w * 2) {
      e.alive = false;
      return;
    }

    if (
      !isInvincible &&
      e.x < player.x + player.width &&
      e.x + e.w > player.x &&
      e.y < player.y + player.height &&
      e.y + e.h > player.y
    ) {
      recordPlayerDeath('diving');
      requestHitstop(76);
      lives--;
      e.alive = false;
      createExplosion(player.x, player.y, '#f00', 40);
      sfxPlayerHit();
      vibrate('damage');
      pushScreenShake('heavy', 30);
      flashScreen = 15;
      player.weaponType = 'normal';
      isInvincible = true;
      invincibleTimer = INVINCIBLE_DURATION;
      if (lives <= 0) safeEndGame();
    }

    // --- external shmup shooting ---
    if (e.isExternalShmup && e.shmupShotsRemaining > 0) {
      e.shmupShootTimer -= dt;
      if (e.shmupShootTimer <= 0) {
        e.shmupShootTimer = e.shmupShootCooldown;
        e.shmupShotsRemaining--;

        const sx = e.x + e.w / 2;
        const sy = e.y + e.h;
        const bulletSpeed = getDifficultySettings(level).bulletSpeed;
        const pattern = e.shmupShotPattern || 'basic';

        switch (pattern) {
          case 'basic':
            pushEnemyBullet(sx, sy, 0, bulletSpeed, 4, 10,
              { kind: 'shmup_basic', color: '#ffaa44', sourceType: e.type });
            break;

          case 'aimed':
            const adx = (player.x + player.width / 2) - sx;
            const ady = (player.y + player.height / 2) - sy;
            const aimAngle = clamp(Math.atan2(ady, adx), Math.PI * 0.35, Math.PI * 0.65);
            pushEnemyBullet(sx, sy,
              Math.cos(aimAngle) * bulletSpeed,
              Math.sin(aimAngle) * bulletSpeed,
              4, 10,
              { kind: 'shmup_aimed', color: '#ff8844', sourceType: e.type });
            break;

          case 'sweep':
            const sweepBase = Math.PI / 2;
            pushEnemyBullet(sx, sy,
              Math.cos(sweepBase - 0.55) * bulletSpeed,
              Math.sin(sweepBase - 0.55) * bulletSpeed,
              4, 10,
              { kind: 'shmup_sweep', color: '#ffaa44', sourceType: e.type });
            pushEnemyBullet(sx, sy,
              Math.cos(sweepBase + 0.55) * bulletSpeed,
              Math.sin(sweepBase + 0.55) * bulletSpeed,
              4, 10,
              { kind: 'shmup_sweep', color: '#ffaa44', sourceType: e.type });
            break;

          case 'heavy':
            pushEnemyBullet(sx, sy, 0, bulletSpeed * 0.75, 6, 12,
              { kind: 'shmup_heavy', color: '#ff6644', sourceType: e.type });
            break;

          case 'spread':
            [-0.4, 0, 0.4].forEach(function(a) {
              var rad = Math.PI / 2 + a;
              pushEnemyBullet(sx, sy,
                Math.cos(rad) * bulletSpeed,
                Math.sin(rad) * bulletSpeed,
                4, 10,
                { kind: 'shmup_spread', color: '#ffaa44', sourceType: e.type });
            });
            break;
        }

        createEnemyMuzzleFlash(sx, sy, e.type);
      }
    }
  });

  // --- speed scaling (por stage + por limpieza) ---
  const totalEnemies = Math.max(1, enemies.length);
  const alive = activeEnemies.length;

  const t = clamp(1 - (alive / totalEnemies), 0, 1); // 0..1
  const stage = Math.floor((level - 1) / 5);         // 0:1-5, 1:6-10, 2:11-15...

  const diffSpeed = getDifficultySettings(level).enemySpeed;
  const baseSpeed = 0.5 * diffSpeed;
  const speed = baseSpeed + t * 1.8;
  enemySpeedX = Math.min(3.5, speed);

  let moveDown = false;

  // --- AI (lvl 12+) - offsets suaves, no rompe formacion ---
  if (level >= 12) {
    const maxOffsetX = 18;
    const maxOffsetY = 10;

    const steer = 0.06 * step;
    const relax = 0.04 * step;
    const decisionEveryMs = 720;

    activeEnemies.forEach(e => {
      if (e.diving || e._shmupHandled) return;

      // init per-enemy AI vars
      if (e.aiOffX === undefined) e.aiOffX = 0;
      if (e.aiOffY === undefined) e.aiOffY = 0;
      if (!e.aiState) e.aiState = 'wave';
      if (e.aiTimer === undefined) e.aiTimer = 0;
      if (e.aiDir === undefined) e.aiDir = (Math.random() < 0.5 ? -1 : 1);

      e.aiTimer += dt;

      // --- decision ---
      if (e.aiTimer >= decisionEveryMs) {
        e.aiTimer = 0;

        const danger = bullets.some(b =>
          Math.abs((b.x + b.w / 2) - (e.x + e.w / 2)) < 22 &&
          b.y < e.y + 10 &&
          b.y > e.y - 70
        );

        const distToPlayer = Math.hypot(
          (player.x + player.width / 2) - (e.x + e.w / 2),
          player.y - (e.y + e.h / 2)
        );

        if (danger && Math.random() < 0.85) {
          e.aiState = 'evade';
          e.aiDir = Math.random() < 0.5 ? -1 : 1;
        } else if (distToPlayer < 160 && Math.random() < 0.45) {
          e.aiState = 'hunt';
        } else {
          e.aiState = 'wave';
        }
      }

      // --- apply (offsets only) ---
      if (e.aiState === 'evade') {
        e.aiOffX += e.aiDir * 1.8 * steer;
        e.aiOffY += -0.4 * steer;
      } else if (e.aiState === 'hunt') {
        const tx = (player.x + player.width / 2) - (e.x + e.w / 2);
        const ty = (player.y) - (e.y + e.h / 2);
        const mag = Math.max(1, Math.hypot(tx, ty));

        e.aiOffX += (tx / mag) * 2.2 * steer;
        e.aiOffY += (ty / mag) * 0.6 * steer;
      }

      // dynamic X clamp (segÃºn espacio real)
      const leftRoom = (e.x - 10);
      const rightRoom = (W - 10 - e.w) - e.x;
      const dynMaxX = Math.max(0, Math.min(maxOffsetX, leftRoom, rightRoom));

      e.aiOffX = clamp(e.aiOffX, -dynMaxX, dynMaxX);
      e.aiOffY = clamp(e.aiOffY, -maxOffsetY, maxOffsetY);

      // relax back to formation
      e.aiOffX += (0 - e.aiOffX) * relax;
      e.aiOffY += (0 - e.aiOffY) * relax;

      // apply offsets
      e.x += e.aiOffX;
      e.y += e.aiOffY;

      e.x = clamp(e.x, 10, W - 10 - e.w);
      e.y = clamp(e.y, 20, H - 120);
    });
  }

  // --- formation movement (global) ---
  let invasionComplete = false;
  activeEnemies.forEach(e => {
    if (e.diving || invasionComplete || e._shmupHandled) return;

    e.x += enemySpeedX * enemyDir * step;

    if (e.x <= 10 || e.x + e.w >= W - 10) moveDown = true;
    
    // Si los aliens llegan a la altura del jugador = INVASION COMPLETA = Game Over
    if (e.y + e.h > player.y) {
      const livesLost = Math.max(1, lives);
      recordPlayerDeath('invasion', livesLost);
      requestHitstop(100);
      lives = 0;
      invasionComplete = true;
      safeEndGame();
    }
  });

  if (moveDown) {
    enemyDir *= -1;
    const drop = 12;

    activeEnemies.forEach(e => {
      if (e.diving || e._shmupHandled) return;
      e.y += drop;
      e.x = clamp(e.x, 10, W - 10 - e.w);
    });
  }

    // --- diving selection (dificultad progresiva) ---
  const diffSettings = getDifficultySettings(level);
  const currentDivers = activeEnemies.filter(e => e.diving).length;
  let diveSlotsLeft = Math.max(0, diffSettings.maxDivers - currentDivers);

  const scriptedDivers = runSetPieceDivePattern(activeEnemies, dt, diveSlotsLeft);
  diveSlotsLeft = Math.max(0, diveSlotsLeft - scriptedDivers);

  // Kamikaze: prioriza diving, pero respeta el maxDivers del nivel.
  if (diveSlotsLeft > 0) {
    const kamikazes = activeEnemies.filter(e => !e.diving && !e._shmupHandled && ENEMY_TYPES[e.type]?.kamikaze);
    for (let i = 0; i < kamikazes.length && diveSlotsLeft > 0; i++) {
      const e = kamikazes[i];
      const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
      e.diving = true;
      const angle = Math.atan2(
        player.y - e.y,
        (player.x + player.width / 2) - e.x
      );
      e.vx = Math.cos(angle) * diffSettings.diveSpeed * (data.speed || 1);
      e.vy = Math.sin(angle) * diffSettings.diveSpeed * (data.speed || 1);
      diveSlotsLeft--;
    }
  }

  if (diveSlotsLeft > 0 && Math.random() < diffSettings.diveChance) {
    const candidates = activeEnemies.filter(e => !e.diving && !e._shmupHandled && ENEMY_TYPES[e.type]?.canDive !== false);
    if (candidates.length > 0) {
      const diver = candidates[Math.floor(Math.random() * candidates.length)];
      diver.diving = true;

      const angle = Math.atan2(
        player.y - diver.y,
        (player.x + player.width / 2) - diver.x
      );

      const data = ENEMY_TYPES[diver.type] || ENEMY_TYPES.alien1;
      const speed = diffSettings.diveSpeed * (data.speed || 1);
      diver.vx = Math.cos(angle) * speed;
      diver.vy = Math.sin(angle) * speed;
      setEnemyMovePattern(diver, chooseEnemyDivePattern(diver));
    }
  }



  // --- update diving enemies ---
  activeEnemies.forEach(e => {
    if (!e.diving) return;

    updateEnemyBehavior(e, dt, step);

    if (e.y > H || e.x < -60 || e.x > W + 60) {
      e.y = -30;
      e.x = Math.random() * (W - 30);
      e.diving = false;
      resetEnemyMovePattern(e);
    }

    if (
      !isInvincible &&
      e.x < player.x + player.width &&
      e.x + e.w > player.x &&
      e.y < player.y + player.height &&
      e.y + e.h > player.y
    ) {
      recordPlayerDeath('diving');
      requestHitstop(76);
      lives--;
      e.alive = false;

      createExplosion(player.x, player.y, '#f00', 40);
      sfxPlayerHit();
      vibrate('damage');
      pushScreenShake('heavy', 30);
      flashScreen = 15;
      player.weaponType = 'normal';

      isInvincible = true;
      invincibleTimer = INVINCIBLE_DURATION;

      if (lives <= 0) safeEndGame();
    }
  });
  // --- enemy shooting ---
  let baseCooldown = getDifficultySettings(level).shootCooldown;

  // multiplicador por dificultad (normal/hardcore)
  const diffMode = difficulties[difficultyIndex];
  if (diffMode && diffMode.fireMult) baseCooldown *= diffMode.fireMult;

  const didScriptedSetPieceShot = runSetPieceFirePattern(activeEnemies, dt, baseCooldown);

  if (!didScriptedSetPieceShot && globalTime - enemyLastShot > baseCooldown) {
    const shooters = activeEnemies.filter(e => !e.diving && !e.isExternalShmup && ENEMY_TYPES[e.type]?.shoots);

    if (shooters.length > 0) {
      const shooter = shooters[Math.floor(Math.random() * shooters.length)];
      pushEnemyBullet(
        shooter.x + shooter.w / 2,
        shooter.y + shooter.h,
        0,
        getDifficultySettings(level).bulletSpeed,
        4,
        10,
        { kind: 'basic', color: '#ff5050', sourceType: shooter.type }
      );
      enemyLastShot = globalTime;
      createEnemyMuzzleFlash(shooter.x + shooter.w / 2, shooter.y + shooter.h, shooter.type);
    }
  }



} // <-- CIERRA: if (!boss.active && activeEnemies.length > 0)

  // âœ… MINIONS DEL EMPERADOR (se mueven aunque el boss estÃ© activo)
  if (boss.active && boss.pattern === 'supreme') {
    const minions = enemies.filter(e => e.alive && e.diving);
    
    minions.forEach(e => {
      e.x += e.vx * step;
      e.y += e.vy * step;
      
      // Si sale de pantalla, eliminar
      if (e.y > H + 30 || e.x < -30 || e.x > W + 30) {
        e.alive = false;
      }
      
      // ColisiÃ³n con jugador
      if (
        !isInvincible &&
        e.x < player.x + player.width &&
        e.x + e.w > player.x &&
        e.y < player.y + player.height &&
        e.y + e.h > player.y
      ) {
        recordPlayerDeath('boss');
        requestHitstop(72);
        lives--;
        e.alive = false;
        
        createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#f00', 30);
        sfxPlayerHit();
        vibrate('damage');
        pushScreenShake('heavy', 20);
        flashScreen = 10;
        player.weaponType = 'normal';
        
        isInvincible = true;
        invincibleTimer = INVINCIBLE_DURATION;
        
        if (lives <= 0) safeEndGame();
      }
    });
  }

}
