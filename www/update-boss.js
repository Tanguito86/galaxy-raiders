// =====================
// GALAXY RAIDERS - update-boss.js
// =====================

let bossMinorDuckTime = -99999;

function requestBossMinorDuck(ms = 120, level = 0.66) {
  if (typeof requestMusicDuck !== 'function') return;
  if (globalTime - bossMinorDuckTime < 120) return;
  bossMinorDuckTime = globalTime;
  requestMusicDuck(ms, level);
}

// HC-162A: boss arena mobility helpers
function getBossArenaBounds(boss) {
  var bw = boss.w || 90;
  var bh = boss.h || 45;
  var sw = (typeof W === 'number' ? W : 360);
  var sh = (typeof H === 'number' ? H : 640);
  // player safe zone: bottom 80px
  return {
    minX: 10,
    maxX: sw - bw - 10,
    minY: 40,
    maxY: sh - bh - 80
  };
}

function clampBossToArena(boss) {
  var bounds = getBossArenaBounds(boss);
  boss.x = clamp(boss.x, bounds.minX, bounds.maxX);
  boss.y = clamp(boss.y, bounds.minY, bounds.maxY);
}

function moveBossTowardPoint(boss, targetX, targetY, speed, step) {
  var dx = targetX - boss.x;
  var dy = targetY - boss.y;
  var dist = Math.hypot(dx, dy);
  var moveAmount = speed * step;
  if (dist < 0.001 || dist <= moveAmount) {
    boss.x = targetX;
    boss.y = targetY;
    clampBossToArena(boss);
    return true;
  }
  boss.x += (dx / dist) * moveAmount;
  boss.y += (dy / dist) * moveAmount;
  clampBossToArena(boss);
  return false;
}

// HC-162B: arena reposition — periodic smooth drift to explore arena
function updateBossArenaReposition(boss, dt, step) {
  if (!boss._arenaReposition) {
    boss._arenaReposition = {
      targetX: boss.x,
      targetY: boss.y,
      timer: 0,
      active: false,
      duration: 0,
      nextInterval: 7000 + Math.random() * 5000
    };
  }
  var ar = boss._arenaReposition;

  // Pause during special movement states
  if (boss.dashMode || boss.chargeMode || boss.retreating ||
      boss.isTeleporting || boss.pulseMode || boss.counterFlag) {
    if (ar.active) { ar.active = false; ar.timer = 0; }
    return false;
  }

  var bounds = getBossArenaBounds(boss);

  if (!ar.active) {
    ar.timer += dt;
    if (ar.timer >= ar.nextInterval) {
      ar.timer = 0;
      ar.nextInterval = 6000 + Math.random() * 7000;

      // Target: prefer laterals (55%) or mid zone (45%)
      if (Math.random() < 0.55) {
        var sideFrac = Math.random() < 0.5 ? 0.12 : 0.88;
        ar.targetX = bounds.minX + (bounds.maxX - bounds.minX) * (sideFrac + (Math.random() - 0.5) * 0.20);
      } else {
        ar.targetX = bounds.minX + (bounds.maxX - bounds.minX) * (0.30 + Math.random() * 0.40);
      }

      // Y: upper 30% of arena, avoid player zone
      var yMid = bounds.minY + (bounds.maxY - bounds.minY) * 0.30;
      ar.targetY = bounds.minY + Math.random() * (yMid - bounds.minY);

      ar.active = true;
      ar.duration = 0;
      ar.maxDuration = 1800 + Math.random() * 1200;
    }
    return false;
  }

  // Active: smooth drift toward target
  ar.duration += dt;
  if (ar.duration >= ar.maxDuration) {
    ar.active = false;
    ar.timer = 0;
    return false;
  }

  moveBossTowardPoint(boss, ar.targetX, ar.targetY, 1.4, step);
  return true;
}

function applyBossDefaultMovement(phase) {
  // Velocidad según fase (continua)
  const patternOverridesMove =
    (boss.pattern === 'zigzag' ||
     boss.pattern === 'rotate' ||
     boss.pattern === 'supreme' ||
     boss.pattern === 'divebomb');

  if (!patternOverridesMove) {
    boss.speed = (phase === 3) ? 3.5 : 2;

    // Movimiento horizontal
    boss.x += boss.speed * boss.dir;
    if (boss.x < 10 || boss.x + boss.w > W - 10) {
      boss.dir *= -1;
    }

    // Movimiento vertical suave (fase 2+)
    if (phase >= 2) {
      boss.y = Math.max(
        80,
        Math.min(H - boss.h - 50, 120 + Math.sin(globalTime * 0.002) * 30 * (phase / 3))
      );
    } else {
      boss.y = Math.max(80, Math.min(H - boss.h - 50, 100));
    }
  }
}

function handleBossImmediateCounter(step) {
  if (boss.counterFlag) {
    const dx = player.x + player.width / 2 - boss.x;
    const dy = player.y - boss.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 2 balas homing rápidas (rojas para que se vean)
    enemyBullets.push(
      {
        x: boss.x + boss.w / 2 - 10,
        y: boss.y + boss.h,
        w: 10,  // ✅ Más grandes para que se vean
        h: 20,
        vx: (dx / dist) * 7,
        vy: (dy / dist) * 7
      },
      {
        x: boss.x + boss.w / 2 + 10,
        y: boss.y + boss.h,
        w: 10,
        h: 20,
        vx: (dx / dist) * 7,
        vy: (dy / dist) * 7
      }
    );

    sfxEnemyHit(); // Sonido grave de contraataque
    pushScreenShake('medium', 5);
    boss.counterFlag = false; // Reset
  }
}

function getBossShootRate(phase) {
  let shootRate = Math.max(600, 1800 - level * 40);
  if (phase === 3) shootRate *= 0.6;
  return shootRate;
}

function updateBossZigzagMovement(step) {
  const phase = getBossPhase();
  const playerFiring = isFiring || bullets.length > 5;

  // SERPENTRIX: Movimiento de serpiente (doble onda)
  const zigFreq = 0.004 * (1 + phase * 0.3);
  const zigAmp = 140 - (phase * 15);
  
  boss.x = Math.max(20, Math.min(W - boss.w - 20, W / 2 + Math.sin(globalTime * zigFreq) * zigAmp));
  
  const vertFreq = 0.006 * (1 + phase * 0.2);
  const vertAmp = 40 + (phase * 15);
  const baseY = 120;
  
  if (playerFiring && phase >= 2) {
    boss.y += 0.2 * step;
    boss.y = Math.min(boss.y, H / 2 - 20);
  } else {
    boss.y = baseY + Math.cos(globalTime * vertFreq) * vertAmp;
  }
  clampBossToArena(boss);
}

function updateBossRotateMovement(step) {
  const phase = getBossPhase();
  if (boss.pulseMode) {
    const targetX = W / 2 - boss.w / 2;
    const targetY = 130;
    boss.x += (targetX - boss.x) * 0.05;
    boss.y += (targetY - boss.y) * 0.05;
  } else {
    const rotSpeed = 0.002 * phase * boss.orbitDir;
    const radiusX = 100 + Math.sin(globalTime * 0.0005) * 30;
    const radiusY = 40 + phase * 10;

    boss.x = Math.max(30, Math.min(W - boss.w - 30, W / 2 + Math.cos(globalTime * rotSpeed) * radiusX));
    boss.y = Math.max(80, Math.min(H - boss.h - 80, 140 + Math.sin(globalTime * rotSpeed) * radiusY));
  }
  clampBossToArena(boss);
}

function fireBossOrbitalPattern(step) {
  const phase = getBossPhase();
  const bossCenter = { x: boss.x + boss.w / 2, y: boss.y + boss.h / 2 };

  if (boss.pulseMode) {
    // PULSO EXPANSIVO: Anillo de balas desde el centro
    const pulseCount = 12 + (phase * 4); // 16, 20, 24 balas
    for (let i = 0; i < pulseCount; i++) {
      const angle = (Math.PI * 2 * i / pulseCount);
      enemyBullets.push({
        x: bossCenter.x,
        y: bossCenter.y,
        w: 8,
        h: 8,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3
      });
    }
    pushScreenShake('heavy', 10);
    sfxBigExplosion();
  } else {
    // Espiral rotativa normal
    const angleOffset = globalTime * 0.002;
    const spiralCount = 4 + (phase * 2);
    for (let i = 0; i < spiralCount; i++) {
      const angle = (Math.PI * 2 * i / spiralCount) + angleOffset;
      enemyBullets.push({
        x: bossCenter.x,
        y: bossCenter.y,
        w: 6,
        h: 6,
        vx: Math.cos(angle) * 4,
        vy: Math.sin(angle) * 4
      });
    }

    // Rayo tractor (fase 2+): línea vertical que sigue al jugador
    // HC-170: 300ms ground telegraph before beam activation
    if (phase >= 2 && Math.random() < 0.3) {
      boss._tractorBeamTimer = 300;
      boss._tractorBeamX = player.x + player.width / 2;
      if (typeof sfxBossWarning === 'function') sfxBossWarning();
    }
  }
}

function fireBossDivebombPattern(step, phase) {
  if (boss.chargeMode || boss.retreating) return;
  const diveDx = player.x + player.width / 2 - (boss.x + boss.w / 2);
  const diveDy = player.y - boss.y;
  const diveDist = Math.sqrt(diveDx * diveDx + diveDy * diveDy);

  enemyBullets.push({
    x: boss.x + boss.w / 2,
    y: boss.y + boss.h,
    w: 8,
    h: 14,
    vx: (diveDx / diveDist) * 3,
    vy: (diveDy / diveDist) * 3
  });

  if (phase >= 2 && Math.random() < 0.4) {
    enemyBullets.push(
      { x: boss.x + boss.w / 2 - 15, y: boss.y + boss.h, w: 5, h: 10, vx: -2, vy: 3 },
      { x: boss.x + boss.w / 2 + 15, y: boss.y + boss.h, w: 5, h: 10, vx: 2, vy: 3 }
    );
  }
}

// HC-BD-08: CRABTRON Signature Hook Trial
// Minimal pincer fire — 2 bullets from each claw, moderate speed, no hard aim
function tryCrabtronSignatureHook(bossRef) {
  if (!bossRef || !bossRef.active) return false;
  if (bossRef.pattern !== 'crossfire') return false;
  if (bossRef.dashMode) return false;

  // Check intent
  if (typeof window.shouldApplyBossSignatureIntent !== 'function') return false;
  var check = window.shouldApplyBossSignatureIntent(bossRef, 'crossfire', 'pincerFire');
  if (!check.apply) return false;

  // Safety: verify bullet array exists
  if (typeof enemyBullets === 'undefined' || !Array.isArray(enemyBullets)) return false;

  var cx = bossRef.x + (bossRef.w || 90) / 2;
  var cy = bossRef.y + (bossRef.h || 45);
  var leftX = bossRef.x + 6;
  var rightX = bossRef.x + (bossRef.w || 90) - 6;

  // Pincer fire: left claw fires down-right, right claw fires down-left
  var speed = 3.0;
  var leftAngle = Math.PI / 2 + 0.35;   // ~110° — down-right from left claw
  var rightAngle = Math.PI / 2 - 0.35;  // ~70°  — down-left from right claw

  enemyBullets.push(
    { x: leftX,  y: cy, w: 6, h: 10, vx: Math.cos(leftAngle)  * speed, vy: Math.sin(leftAngle)  * speed },
    { x: leftX,  y: cy, w: 6, h: 10, vx: Math.cos(leftAngle - 0.12) * speed, vy: Math.sin(leftAngle - 0.12) * speed },
    { x: rightX, y: cy, w: 6, h: 10, vx: Math.cos(rightAngle) * speed, vy: Math.sin(rightAngle) * speed },
    { x: rightX, y: cy, w: 6, h: 10, vx: Math.cos(rightAngle + 0.12) * speed, vy: Math.sin(rightAngle + 0.12) * speed }
  );

  // Consume intent
  if (typeof window.consumeBossSignatureIntent === 'function') {
    window.consumeBossSignatureIntent('applied');
  }

  // Audio: use existing boss fire SFX
  if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
  if (typeof requestBossMinorDuck === 'function') requestBossMinorDuck(100, 0.55);

  return true;
}

function updateBossStep(step, dt) {
  if (!boss.active) return;

  // HC-BD-03: Boss Director phase orchestration hook (passive, read-only)
  if (typeof window.updateBossDirectorState === 'function') {
    window.updateBossDirectorState(boss);
  }

  updateBossPhase();

  // HC-17: mark boss pattern metadata ready
  if (typeof markBossPatternReady === 'function') markBossPatternReady(boss);

  // HC-19: update boss telegraph timers
  if (typeof updateBossTelegraph === 'function') updateBossTelegraph(boss, dt);

  // HC-20: phase transition FX trigger + update
  if (boss.phaseChanged && (boss.phase === 2 || boss.phase === 3)) {
    if (typeof triggerBossPhaseTransitionFX === 'function') triggerBossPhaseTransitionFX(boss, boss.phase);
    if (typeof window.addHardcoreRank === 'function') window.addHardcoreRank(2.5, 'boss_phase');
  }
  if (typeof updateBossPhaseTransitionFX === 'function') updateBossPhaseTransitionFX(boss, dt);

  if (boss.flashTimer > 0) boss.flashTimer -= dt;

  // HC-HB-03: process deterministic queued burst (replaces setTimeout)
  if (typeof processBossQueuedBurst === 'function') {
    processBossQueuedBurst(boss, dt);
  }

  const phase = boss.phase;

  // 🔥 MEJORA 4: modo desesperación (fase 3)

  applyBossDefaultMovement(phase);

// ✅ IA BASE: Evalúa comportamiento del jugador
const playerDist = Math.hypot(player.x - boss.x, player.y - boss.y);
const playerFiring = isFiring || bullets.length > 5;
boss.aiTimer = (boss.aiTimer || 0) + dt;

// ✅ IA solo para bosses específicos (NO zigzag, rotate, supreme)
const useAI = (boss.pattern === 'crossfire' || boss.pattern === 'divebomb');

if (useAI && playerDist < 150 && boss.pattern !== 'divebomb') {
  // Player cerca → esquivar (excepto divebomb que QUIERE estar cerca)
  boss.state = 'evade';
} else if (useAI && playerFiring && boss.aiTimer > 300) {
  // Player dispara mucho → contraataque
  boss.state = 'counter';
  boss.aiTimer = 0;
} else {
  boss.state = 'aggressive';
}

// ✅ Aplicar IA al movimiento (solo si useAI es true)
if (useAI) {
  switch (boss.state) {
    case 'evade':
      // Esquiva perpendicular al jugador
      const evadeAngle = Math.atan2(player.y - boss.y, player.x - boss.x) + Math.PI / 2;
      boss.x += Math.cos(evadeAngle) * 2 * step;
      boss.y += Math.sin(evadeAngle) * 1.5 * step;
      clampBossToArena(boss);
      break;
      
    case 'counter':
      // Acelera + marca flag para disparo extra
      boss.speed = Math.min((boss.speed || 2) * 1.05, 5);
      boss.counterFlag = true;
      break;
      
    case 'aggressive':
      // Velocidad normal según fase
      boss.speed = (phase === 3) ? 3.5 : 2;
      boss.counterFlag = false;
      break;
  }
} // ✅ CERRAR el if (useAI)



// ✅ Patrones ÚNICOS (sobrescriben x/y si aplica)
switch (boss.pattern) {

  case 'crossfire': {
    // CRABTRON: Movimiento de cangrejo + dash lateral
    if (boss.crabInit === undefined) {
      boss.crabInit = true;
      boss.dashMode = false;
      boss.dashTimer = 0;
      boss.dashTargetX = 0;
      boss.dashCooldown = 3000;
      boss.advanceTimer = 0;
      boss.crabVx = 0;
      boss.crabVy = 0;
    }

    if (updateBossArenaReposition(boss, dt, step)) { clampBossToArena(boss); break; }
    
    boss.dashCooldown -= dt;
    boss.advanceTimer += dt;
    
    if (boss.dashMode) {
      if (boss.dashMode === 'telegraph') {
        boss._dashTelegraphTimer -= dt;
        if (boss._dashTelegraphTimer <= 0) {
          boss.dashMode = true;
          boss.dashTimer = 600;
        }
      } else {
        // DASH en progreso
        const dx = boss.dashTargetX - boss.x;
        const speed = 12;
        
        boss.crabVx = boss.crabVx * 0.8 + (dx > 0 ? speed : -speed) * 0.2;
        boss.x += boss.crabVx * step;
        
        boss.dashTimer -= dt;
        
        if (boss.dashTimer <= 0 || Math.abs(dx) < 20) {
          boss.dashMode = false;
          boss.dashCooldown = 2500 + Math.random() * 1500;
          boss.crabVx = 0;
          
          // Disparo de pinzas al terminar dash
          enemyBullets.push(
            { x: boss.x + 10, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -3, vy: 3 },
            { x: boss.x + boss.w - 10, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 3, vy: 3 }
          );
          sfxEnemyHit();
        }
      }
    } else {
      // Movimiento normal de cangrejo
      const patrolSpeed = 1.8 + phase * 0.5;
      const targetVx = patrolSpeed * boss.dir;
      boss.crabVx = boss.crabVx * 0.9 + targetVx * 0.1;
      boss.x += boss.crabVx * step;
      
      // Rebote en bordes
      if (boss.x < 20 || boss.x + boss.w > W - 20) {
        boss.dir *= -1;
        boss.x = clamp(boss.x, 20, W - boss.w - 20);
      }
      
      // Avance/retroceso ocasional (movimiento de cangrejo)
      if (boss.advanceTimer > 2000) {
        boss.advanceTimer = 0;
        const advanceDir = (boss.y < 130) ? 1 : (Math.random() < 0.6 ? 1 : -1);
        boss.crabVy = advanceDir * 2;
      }
      
      boss.crabVy *= 0.95;
      boss.y += boss.crabVy * step;
      boss.y = clamp(boss.y, 80, 160);
      
      // Iniciar DASH (fase 2+ o random) — HC-164: 200ms telegraph first
      if (boss.dashCooldown <= 0 && (phase >= 2 || Math.random() < 0.3)) {
        boss.dashMode = 'telegraph';
        boss._dashTelegraphTimer = 200;
        boss.flashTimer = 200;
        // Dash hacia el jugador o lado opuesto
        if (Math.random() < 0.7) {
          boss.dashTargetX = player.x - boss.w / 2;
        } else {
          boss.dashTargetX = boss.x > W / 2 ? 30 : W - boss.w - 30;
        }
        boss.dashTargetX = clamp(boss.dashTargetX, 30, W - boss.w - 30);
        
        pushScreenShake('medium', 5);
        requestBossMinorDuck(140, 0.62);
        sfxBossWarning();
      }
    }
    
    // Clamp final
    clampBossToArena(boss);
    break;
  }

  case 'zigzag':
    if (!updateBossArenaReposition(boss, dt, step)) {
      updateBossZigzagMovement(step);
    }
    break;

  case 'rotate':
    // ORBITAL: Órbita elíptica variable + cambio de dirección
    if (!boss.orbitDir) boss.orbitDir = 1;
    if (!boss.orbitChangeTimer) boss.orbitChangeTimer = 0;
    if (!boss.pulseMode) boss.pulseMode = false;
    if (!boss.pulseTimer) boss.pulseTimer = 0;
    
    boss.orbitChangeTimer += dt;
    
    if (boss.orbitChangeTimer > 4000 + Math.random() * 2000) {
      boss.orbitDir *= -1;
      boss.orbitChangeTimer = 0;
      sfxUIClick();
    }
    
    if (phase >= 2 && !boss.pulseMode && Math.random() < 0.002) {
      boss.pulseMode = true;
      boss.pulseTimer = 1500;
    }
    
    if (!updateBossArenaReposition(boss, dt, step)) {
      updateBossRotateMovement(step);
    }
    
    if (boss.pulseMode) {
      boss.pulseTimer -= dt;
      if (boss.pulseTimer <= 0) {
        boss.pulseMode = false;
      }
    }
    break;

  case 'divebomb': {
    // TENIENTE: Embestida diagonal + patrullaje agresivo (SUAVE)

    // init una sola vez por boss
    if (boss.divebombInit === undefined) {
      boss.divebombInit = true;
      boss.chargeMode = false;
      boss.retreating = false;
      boss.telegraphTimer = 0;
      boss.chargeTimer = 0;
      boss.chargeTargetX = W / 2;
      boss.chargeTargetY = 140;

      boss.vx = 0;
      boss.vy = 0;
    }

    const clampTargetX = (tx) => clamp(tx, 20 + boss.w / 2, W - 20 - boss.w / 2);
    const clampTargetY = (ty) => clamp(ty, 80, H / 2 + 60);

    if (updateBossArenaReposition(boss, dt, step)) { clampBossToArena(boss); break; }

    if (boss.chargeMode) {

      // HC-164: impact telegraph — warn before radial burst
      if (boss.chargeMode === 'impact') {
        boss._chargeImpactTimer -= dt;
        if (boss._chargeImpactTimer <= 0) {
          const bombCount = 8 + phase * 2;
          for (let i = 0; i < bombCount; i++) {
            const ang = (Math.PI * 2 * i / bombCount);
            enemyBullets.push({
              x: boss.x + boss.w / 2,
              y: boss.y + boss.h,
              w: 8, h: 8,
              vx: Math.cos(ang) * 4,
              vy: Math.sin(ang) * 4
            });
          }
          pushScreenShake('heavy', 12);
          sfxBigExplosion();
          createExplosion(boss.x + boss.w / 2, boss.y + boss.h, '#ff0', 25);
          boss.chargeMode = false;
          boss.retreating = true;
          boss.chargeTimer = 950;
        }
      } else if (boss.telegraphTimer > 0) {
        // TELEGRAPH
        boss.telegraphTimer -= dt;

        boss.x += (Math.random() - 0.5) * 2.0 * step;
        boss.y += (Math.random() - 0.5) * 0.8 * step;
        pushScreenShake('light', 2);

        boss.vx *= 0.85;
        boss.vy *= 0.85;

      } else {
        // CARGA
        const tx = boss.chargeTargetX;
        const ty = boss.chargeTargetY;

        const dx = tx - (boss.x + boss.w / 2);
        const dy = ty - (boss.y + boss.h / 2);
        const dist = Math.max(1, Math.hypot(dx, dy));

        const speed = 9.0;
        const dvx = (dx / dist) * speed;
        const dvy = (dy / dist) * speed;

        boss.vx = boss.vx * 0.82 + dvx * 0.18;
        boss.vy = boss.vy * 0.82 + dvy * 0.18;

        boss.x += boss.vx * step;
        boss.y += boss.vy * step;

        // LLEGÓ — HC-164: 250ms impact telegraph before radial burst
        if (dist < 22) {
          boss.x = tx - boss.w / 2;
          boss.y = ty - boss.h / 2;

          boss.chargeMode = 'impact';
          boss._chargeImpactTimer = 250;
          boss.flashTimer = 250;
          boss.vx = 0;
          boss.vy = 0;
          pushScreenShake('medium', 6);
          sfxBossWarning();
        }
      }

    } else if (boss.retreating) {
      // RETIRADA
      boss.chargeTimer -= dt;

      boss.vy = boss.vy * 0.8 + (-3.0) * 0.2;
      boss.y += boss.vy * step;

      if (boss.y < 80) boss.y = 80;

      if (boss.chargeTimer <= 0) {
        boss.retreating = false;
        boss.vx = 0;
        boss.vy = 0;
      }

    } else {
      // PATRULLA
      const patrolSpeed = 2.2 + phase * 0.6;

      const targetVx = patrolSpeed * boss.dir;
      boss.vx = boss.vx * 0.85 + targetVx * 0.15;

      const desiredY = 105 + Math.sin(globalTime * 0.003) * 28;
      const ddy = desiredY - boss.y;
      boss.vy = boss.vy * 0.85 + (ddy * 0.06) * 0.15;

      boss.x += boss.vx * step;
      boss.y += boss.vy * step;

      if (boss.x < 20 || boss.x + boss.w > W - 20) {
        boss.dir *= -1;
        boss.x = clamp(boss.x, 20, W - boss.w - 20);
        boss.vx = 0;
      }

        // Chance de embestida
        if (Math.random() < 0.004) {
        boss.chargeMode = true;
        boss.telegraphTimer = 650;

        boss.chargeTargetX = clampTargetX(player.x + player.width / 2);
          boss.chargeTargetY = clampTargetY(Math.min(player.y - 55, H / 2 + 60));

          requestBossMinorDuck(140, 0.62);
          sfxBossWarning();
        }
    }

    // clamp final
    clampBossToArena(boss);
    break;
  }

  case 'supreme': {
    // EMPERADOR: Teletransporte + Furia + Invocación
    if (boss.supremeInit === undefined) {
      boss.supremeInit = true;
      boss.teleportTimer = 0;
      boss.teleportCooldown = 5000;
      boss.isTeleporting = false;
      boss.teleportFlash = 0;
      boss.minionTimer = 0;
      boss.supremeVx = 0;
      boss.supremeVy = 0;
    }
    
    boss.teleportTimer += dt;
    boss.minionTimer += dt;
    
    // TELETRANSPORTE (fase 2+)
    if (boss.isTeleporting) {
      boss.teleportFlash -= dt;
      if (boss.teleportFlash <= 0) {
        // Reaparecer en posición precalculada
        boss.x = boss._teleportDestX || (30 + Math.random() * (W - boss.w - 60));
        boss.y = boss._teleportDestY || (80 + Math.random() * 60);
        boss._teleportDestX = undefined;
        boss._teleportDestY = undefined;
        boss.isTeleporting = false;
        boss.teleportCooldown = 4000 + Math.random() * 2000;
        
        // Onda de choque al reaparecer (reducida)
        const waveCount = 4 + phase;
        for (let i = 0; i < waveCount; i++) {
          const ang = (Math.PI * 2 * i / waveCount);
          enemyBullets.push({
            x: boss.x + boss.w / 2,
            y: boss.y + boss.h / 2,
            w: 8, h: 8,
            vx: Math.cos(ang) * 3,
            vy: Math.sin(ang) * 3
          });
        }
        
        pushScreenShake('heavy', 15);
        sfxBigExplosion();
        createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fff', 20);
      }
    } else {
      // Movimiento normal por fase
      if (phase === 1) {
        // Fase 1: Oscilación majestuosa centrada
        boss.x = W / 2 - boss.w / 2 + Math.sin(globalTime * 0.002) * 80;
        boss.y = 100 + Math.sin(globalTime * 0.003) * 15;
        
      } else if (phase === 2) {
        // Fase 2: Más agresivo + teletransporte
        const targetX = W / 2 + Math.sin(globalTime * 0.004) * 100;
        boss.supremeVx = boss.supremeVx * 0.85 + (targetX - boss.x) * 0.03;
        boss.x += boss.supremeVx * step;
        boss.y = 100 + Math.sin(globalTime * 0.005) * 25;
        
        // Activar teletransporte — HC-167: store destination for visual indicator
        if (boss.teleportTimer > boss.teleportCooldown) {
          boss.teleportTimer = 0;
          boss.isTeleporting = true;
          boss.teleportFlash = 500;
          boss._teleportDestX = 30 + Math.random() * (W - boss.w - 60);
          boss._teleportDestY = 80 + Math.random() * 60;
          pushScreenShake('medium', 8);
          requestBossMinorDuck(150, 0.60);
          sfxBossWarning();
          createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ff0', 15);
        }
        
      } else {
        // Fase 3: MODO FURIA - persigue + teletransporte frecuente
        const dx = player.x - boss.x;
        const dy = player.y - boss.y - 100;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        
        boss.supremeVx = boss.supremeVx * 0.8 + (dx / dist) * 3 * 0.2;
        boss.supremeVy = boss.supremeVy * 0.8 + (dy / dist) * 2 * 0.2;
        
        boss.x += boss.supremeVx * step + Math.sin(globalTime * 0.008) * 3 * step;
        boss.y += boss.supremeVy * step;
        
        // Teletransporte en fase 3 (menos frecuente) — HC-167: store destination
        if (boss.teleportTimer > boss.teleportCooldown * 0.8) {
          boss.teleportTimer = 0;
          boss.isTeleporting = true;
          boss.teleportFlash = 400;
          boss._teleportDestX = 30 + Math.random() * (W - boss.w - 60);
          boss._teleportDestY = 80 + Math.random() * 60;
          pushScreenShake('heavy', 10);
          requestBossMinorDuck(150, 0.58);
          sfxBossWarning();
          createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f00', 20);
        }
      }
      
      // INVOCAR MINIONS (fase 2+, cada 10 segundos) — HC-HB-03: spawn safety
      if (phase >= 2 && boss.minionTimer > 10000 && enemies.filter(e => e.alive).length < 2) {
        boss.minionTimer = 0;

        const minionCount = phase === 3 ? 2 : 1;
        for (let i = 0; i < minionCount; i++) {
          const spawnX = boss.x + boss.w / 2 + (i - Math.floor(minionCount / 2)) * 50;
          const spawnY = boss.y + boss.h + 10;
          const angle = Math.atan2(player.y - (boss.y + boss.h), player.x - spawnX);
          const speed = 3 + Math.random() * 2;

          var safe = checkSpawnSafety(spawnX, spawnY, 24, 24);
          var fx = safe.adjustedX;
          var fy = safe.adjustedY;

          enemies.push({
            x: clamp(fx, 30, W - 54),
            y: clamp(fy, 70, H - 120),
            w: 24, h: 24,
            row: 0,
            type: 'alien1',
            alive: true,
            diving: true,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
            vy: Math.sin(angle) * speed + 1
          });
        }
        
        sfxEnemyHit();
        pushScreenShake('medium', 5);
        requestBossMinorDuck(130, 0.64);
        createExplosion(boss.x + boss.w / 2, boss.y + boss.h, '#f0f', 10);
      }
    }
    
    // Clamp final - no baja tanto, arena safety net
    boss.x = clamp(boss.x, 10, W - boss.w - 10);
    boss.y = clamp(boss.y, 70, 180);
    clampBossToArena(boss);
    break;
  }
}

if (typeof window.updateBossAIMovement === 'function') {
  window.updateBossAIMovement(boss, player, dt);
}
clampBossToArena(boss);

boss.shootTimer += dt;

handleBossImmediateCounter(step);

  const shootRate = getBossShootRate(phase);

if (boss.shootTimer > shootRate) {
  boss.shootTimer = 0;

  /// ✅ Chance de soltar powerup
  if (Math.random() < 0.08) {
    spawnRandomPowerUp(boss.x + boss.w / 2 - 6, boss.y + boss.h);
    sfxPowerUp();
  }

  // HC-BD-08: CRABTRON signature hook trial (before switch)
  if (boss.pattern === 'crossfire' && typeof tryCrabtronSignatureHook === 'function') {
    if (tryCrabtronSignatureHook(boss)) {
      return; // signature consumed this fire cycle
    }
  }

  // ✅ PATRONES DE DISPARO ÚNICOS (con variación)
  switch(boss.pattern) {
    case 'crossfire':
      // CRABTRON: No disparar durante dash
      if (boss.dashMode) break;

      // HC-75: central hardcore boss dispatch
      if (typeof updateHardcoreBossPatternFromRegistry === 'function' && updateHardcoreBossPatternFromRegistry(boss, dt)) {
        break;
      }
      
      const crabCenter = { x: boss.x + boss.w / 2, y: boss.y + boss.h };
      const attackType = Math.random();
      
      if (attackType < 0.4) {
        // Cruz + diagonal alterna (original)
        const useDiagonal = Math.random() < 0.5;
        if (useDiagonal) {
          enemyBullets.push(
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 3, vy: 3 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: -3, vy: 3 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 3, vy: -2 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: -3, vy: -2 }
          );
        } else {
          enemyBullets.push(
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 0, vy: 4 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 4, vy: 0 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: -4, vy: 0 }
          );
        }
      } else if (attackType < 0.7) {
        // PINZAS: Disparo desde los costados
        enemyBullets.push(
          { x: boss.x + 5, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -2, vy: 4 },
          { x: boss.x + boss.w - 5, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 2, vy: 4 }
        );
        
        // En fase 2+, las pinzas también disparan hacia el jugador
        if (phase >= 2) {
          const dx = player.x + player.width / 2 - crabCenter.x;
          const dy = player.y - boss.y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          
          enemyBullets.push(
            { x: boss.x + 10, y: boss.y + boss.h, w: 6, h: 10, vx: (dx / dist) * 3 - 1, vy: (dy / dist) * 3 },
            { x: boss.x + boss.w - 10, y: boss.y + boss.h, w: 6, h: 10, vx: (dx / dist) * 3 + 1, vy: (dy / dist) * 3 }
          );
        }
      } else if (phase >= 2) {
        // LASER VERTICAL: Columna de balas determinista (HC-HB-03: replaced setTimeout)
        var _clx = boss.x + boss.w / 2;
        var _cly = boss.y + boss.h;
        scheduleBossQueuedBurst(boss, 4, 100, (function(originX, originY) {
          return function(bossRef) {
            if (!bossRef.active) return;
            enemyBullets.push({
              x: originX + (Math.random() - 0.5) * 20,
              y: originY,
              w: 5,
              h: 15,
              vx: 0,
              vy: 6
            });
            sfxEnemyHit();
          };
        })(_clx, _cly));
        
        pushScreenShake('medium', 4);
        requestBossMinorDuck(130, 0.64);
        sfxBossWarning();
      } else {
        // Fase 1: Solo disparo simple hacia abajo
        enemyBullets.push({
          x: crabCenter.x,
          y: crabCenter.y,
          w: 6,
          h: 10,
          vx: 0,
          vy: 4
        });
      
      }
      break;
      
    case 'zigzag':
      // HC-75: central hardcore boss dispatch
      if (typeof updateHardcoreBossPatternFromRegistry === 'function' && updateHardcoreBossPatternFromRegistry(boss, dt)) {
        break;
      }
   
  // SERPENTRIX: Abanico hacia abajo + rotación sutil
  const fanCount = 5 + phase; // 6, 7, 8 balas
  const fanRotation = Math.sin(globalTime * 0.001) * 0.4; // Oscila más
  
  for (let i = 0; i < fanCount; i++) {
    const spread = -1.0 + (2.0 * i / (fanCount - 1)); // -1.0 a +1.0 radianes (más disperso)
    const angle = spread + fanRotation;
    enemyBullets.push({
      x: boss.x + boss.w / 2,
      y: boss.y + boss.h,
      w: 6,
      h: 15,
      vx: Math.sin(angle) * 5,
      vy: 4
    });
  }
  
  // VENENO: Balas lentas y grandes (fase 2+)
  if (phase >= 2 && Math.random() < 0.4) {
    const dx = player.x - boss.x;
    const dist = Math.max(1, Math.abs(dx));
    enemyBullets.push({
      x: boss.x + boss.w / 2,
      y: boss.y + boss.h,
      w: 10,
      h: 10,
      vx: (dx / dist) * 2,
      vy: 3
    });
  }
  
  // MINAS FLOTANTES: 50% chance de soltar mina
if (Math.random() < 0.5 && mines.length < 8) {
  mines.push({
    x: boss.x + boss.w / 2,
    y: boss.y + boss.h,
    radius: 12,
    vy: 0.5,           // ✅ Más lento
    life: 14000,       // ✅ 14 segundos de vida
    pulseTime: 0       // Para animación
  });
    sfxEnemyHit(); // Sonido de soltar mina
  }
  break;
      
      case 'rotate':
        // HC-75: central hardcore boss dispatch
        if (typeof updateHardcoreBossPatternFromRegistry === 'function' && updateHardcoreBossPatternFromRegistry(boss, dt)) {
          break;
        }
        fireBossOrbitalPattern(step);

        // HC-170: tractor beam telegraph countdown + fire
        if (typeof boss._tractorBeamTimer === 'number' && boss._tractorBeamTimer > 0) {
          boss._tractorBeamTimer -= dt;
          if (boss._tractorBeamTimer <= 0) {
            var _bx = boss._tractorBeamX || (player.x + player.width / 2);
            for (var _bi = 0; _bi < 5; _bi++) {
              enemyBullets.push({
                x: _bx + (Math.random() - 0.5) * 30,
                y: 50 + _bi * 25,
                w: 4, h: 12,
                vx: 0, vy: 5
              });
            }
            sfxEnemyHit();
          }
        }
        break;
       
      case 'divebomb':
       // HC-75: central hardcore boss dispatch
       if (typeof updateHardcoreBossPatternFromRegistry === 'function' && updateHardcoreBossPatternFromRegistry(boss, dt)) {
         break;
       }
       fireBossDivebombPattern(step, phase);
       break;
      
    case 'supreme':
      // HC-75: central hardcore boss dispatch
      if (typeof updateHardcoreBossPatternFromRegistry === 'function' && updateHardcoreBossPatternFromRegistry(boss, dt)) {
        break;
      }
      // EMPERADOR: No disparar durante teletransporte
      if (boss.isTeleporting) break;
      
      const empCenter = { x: boss.x + boss.w / 2, y: boss.y + boss.h };
      const attackRoll = Math.random();
      
      if (phase === 1) {
        // Fase 1: Triple imperial + spread ocasional
        enemyBullets.push(
          { x: boss.x + 15, y: empCenter.y, w: 6, h: 12, vx: -1, vy: 4 },
          { x: empCenter.x, y: empCenter.y, w: 8, h: 14, vx: 0, vy: 5 },
          { x: boss.x + boss.w - 15, y: empCenter.y, w: 6, h: 12, vx: 1, vy: 4 }
        );
        
        if (Math.random() < 0.3) {
          // Abanico adicional
          for (let i = 0; i < 3; i++) {
            const ang = -0.4 + (0.4 * i);
            enemyBullets.push({
              x: empCenter.x,
              y: empCenter.y,
              w: 5, h: 10,
              vx: Math.sin(ang) * 3,
              vy: 4
            });
          }
        }
        
      } else if (phase === 2) {
        // Fase 2: Ataques variados
        if (attackRoll < 0.4) {
          // Spread amplio rotativo
          const spreadCount = 7;
          const rotation = Math.sin(globalTime * 0.002) * 0.3;
          for (let i = 0; i < spreadCount; i++) {
            const angle = -1.0 + (2.0 * i / (spreadCount - 1)) + rotation;
            enemyBullets.push({
              x: empCenter.x,
              y: empCenter.y,
              w: 6, h: 12,
              vx: Math.sin(angle) * 4,
              vy: 4
            });
          }
        } else if (attackRoll < 0.7) {
          // Rayo imperial: linea de balas determinista (HC-HB-03: replaced setTimeout)
          var _irDx = player.x + player.width / 2 - empCenter.x;
          var _irDy = player.y - empCenter.y;
          var _irDist = Math.max(1, Math.sqrt(_irDx * _irDx + _irDy * _irDy));
          var _irOx = empCenter.x;
          var _irOy = empCenter.y;
          scheduleBossQueuedBurst(boss, 5, 80, (function(ox, oy, rdx, rdy, rdist) {
            return function(bossRef) {
              if (!bossRef.active || bossRef.isTeleporting) return;
              enemyBullets.push({
                x: ox,
                y: oy,
                w: 10, h: 10,
                vx: (rdx / rdist) * 6,
                vy: (rdy / rdist) * 6
              });
              sfxEnemyHit();
            };
          })(_irOx, _irOy, _irDx, _irDy, _irDist));
          sfxBossWarning();
        } else {
          // Cruz imperial
          enemyBullets.push(
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 0, vy: 5 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 4, vy: 2 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -4, vy: 2 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 3, vy: -1 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -3, vy: -1 }
          );
        }
      } else {
        // Fase 3: INTENSO PERO JUSTO
        if (attackRoll < 0.4) {
          // Espiral simple (no doble)
          const spiralOffset = globalTime * 0.003;
          for (let i = 0; i < 6; i++) {
            const ang = (Math.PI * 2 * i / 6) + spiralOffset;
            enemyBullets.push({
              x: empCenter.x, 
              y: boss.y + boss.h / 2, 
              w: 6, h: 6, 
              vx: Math.cos(ang) * 3, 
              vy: Math.sin(ang) * 3
            });
          }
        } else if (attackRoll < 0.7) {
          // Onda expansiva (sin homing)
          const waveCount = 10;
          for (let i = 0; i < waveCount; i++) {
            const ang = (Math.PI * 2 * i / waveCount);
            enemyBullets.push({
              x: empCenter.x,
              y: boss.y + boss.h / 2,
              w: 6, h: 6,
              vx: Math.cos(ang) * 3.5,
              vy: Math.sin(ang) * 3.5
            });
          }
        } else {
          // Triple imperial reforzado (sin lluvia fantasma)
          enemyBullets.push(
            { x: boss.x + 15, y: empCenter.y, w: 8, h: 14, vx: -2, vy: 4 },
            { x: empCenter.x, y: empCenter.y, w: 10, h: 16, vx: 0, vy: 5 },
            { x: boss.x + boss.w - 15, y: empCenter.y, w: 8, h: 14, vx: 2, vy: 4 }
          );
          
          // Abanico adicional
          for (let i = 0; i < 5; i++) {
            const ang = -0.6 + (0.3 * i);
            enemyBullets.push({
              x: empCenter.x,
              y: empCenter.y,
              w: 5, h: 10,
              vx: Math.sin(ang) * 3,
              vy: 4
            });
          }
        }
        
        pushScreenShake('light', 3);
      }
      break;
  }


  // Feedback sonoro
  sfxEnemyHit();

  // Feedback visual SOLO al disparar (fase final)
  if (phase === 3) {
    pushScreenShake('medium', 4);
  }
}
}

