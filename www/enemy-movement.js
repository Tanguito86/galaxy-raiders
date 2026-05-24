// =====================
// GALAXY RAIDERS - enemy-movement.js
// Movimiento horizontal/vertical, patrones de entrada, zigzag/dive/orbit
// =====================

const ENEMY_MOVE_PATTERNS = {
  STRAIGHT_DOWN: 'straight_down',
  SINE_SWEEP: 'sine_sweep',
  ZIGZAG_DIVE: 'zigzag_dive',
  ARC_PASS: 'arc_pass'
};

function setEnemyMovePattern(e, movePattern) {
  e.movePattern = movePattern || ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  e.moveAge = 0;
  e.moveStepAge = 0;
  e.moveStartX = e.x;
  e.moveStartY = e.y;
  e.moveBaseVx = e.vx || 0;
  e.moveBaseVy = e.vy || 0;
  e.moveSide = Math.random() < 0.5 ? -1 : 1;
  if (e.movePattern === ENEMY_MOVE_PATTERNS.ARC_PASS) {
    e.moveSide = e.x < W * 0.5 ? 1 : -1;
  }
  e.movePhase = e.moveSide > 0 ? 0 : Math.PI;
}

function resetEnemyMovePattern(e) {
  e.movePattern = ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  delete e.moveAge;
  delete e.moveStepAge;
  delete e.moveStartX;
  delete e.moveStartY;
  delete e.moveBaseVx;
  delete e.moveBaseVy;
  delete e.movePhase;
  delete e.moveSide;
}

function chooseEnemyDivePattern(e) {
  if (level < 4) return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;

  if (e.type === 'alien_mini') return ENEMY_MOVE_PATTERNS.ZIGZAG_DIVE;

  if (level === 4) {
    if (e.type === 'alien4') return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
    return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  }

  if (level === 5) {
    if (e.type === 'alien4') return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
    if (e.type === 'alien3' && Math.random() < 0.35) return ENEMY_MOVE_PATTERNS.ARC_PASS;
    return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  }

  if (level <= 7) {
    if (e.type === 'alien4') return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
    if (e.type === 'alien3' && Math.random() < 0.45) return ENEMY_MOVE_PATTERNS.ARC_PASS;
    if (e.type === 'alien2' && Math.random() < 0.20) return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
    return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  }

  if (e.type === 'alien4') {
    const roll = Math.random();
    if (roll < 0.70) return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
    if (roll < 0.85) return ENEMY_MOVE_PATTERNS.ZIGZAG_DIVE;
    return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  }
  if (e.type === 'alien3') {
    const roll = Math.random();
    if (roll < 0.45) return ENEMY_MOVE_PATTERNS.ARC_PASS;
    if (roll < 0.55) return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
    return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
  }
  if (e.type === 'alien2' && Math.random() < 0.25) return ENEMY_MOVE_PATTERNS.SINE_SWEEP;
  if (e.type === 'alien5' && Math.random() < 0.25) return ENEMY_MOVE_PATTERNS.SINE_SWEEP;

  return ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN;
}

function triangleWave01(t) {
  const cycle = t - Math.floor(t);
  if (cycle < 0.25) return cycle * 4;
  if (cycle < 0.75) return 2 - cycle * 4;
  return cycle * 4 - 4;
}

function moveEnemyStraightDown(e, dt, step) {
  e.x += e.vx * step;
  e.y += e.vy * step;
}

function moveEnemySineSweep(e, dt, step) {
  e.moveAge += dt;
  e.moveStepAge += step;

  const baseX = e.moveStartX + e.moveBaseVx * e.moveStepAge;
  const baseY = e.moveStartY + e.moveBaseVy * e.moveStepAge;
  const sway = Math.sin(e.moveAge * 0.008 + e.movePhase) * 14;

  e.x = baseX + sway;
  e.y = baseY;
}

function moveEnemyZigzagDive(e, dt, step) {
  e.moveAge += dt;
  e.moveStepAge += step;

  const baseX = e.moveStartX + e.moveBaseVx * e.moveStepAge;
  const baseY = e.moveStartY + e.moveBaseVy * e.moveStepAge;
  const offset = triangleWave01(e.moveAge / 720) * 18 * e.moveSide;

  e.x = baseX + offset;
  e.y = baseY;
}

function moveEnemyArcPass(e, dt, step) {
  e.moveAge += dt;
  e.moveStepAge += step;

  const baseX = e.moveStartX + e.moveBaseVx * e.moveStepAge;
  const baseY = e.moveStartY + e.moveBaseVy * e.moveStepAge;
  const arcT = clamp(e.moveAge / 1300, 0, 1);
  const arc = Math.sin(arcT * Math.PI) * 34 * e.moveSide;
  const settle = Math.sin(e.moveAge * 0.006 + e.movePhase) * 4 * (1 - arcT);

  e.x = baseX + arc + settle;
  e.y = baseY;
}

const ENEMY_MOVE_PATTERN_HANDLERS = {
  straight_down: moveEnemyStraightDown,
  sine_sweep: moveEnemySineSweep,
  zigzag_dive: moveEnemyZigzagDive,
  arc_pass: moveEnemyArcPass
};

function updateEnemyBehavior(e, dt, step) {
  const handler = ENEMY_MOVE_PATTERN_HANDLERS[e.movePattern] || moveEnemyStraightDown;
  handler(e, dt, step);
}

function updateSetPieceIntro(activeEnemies, step, dt) {
  let readyCount = 0;

  activeEnemies.forEach(e => {
    const hasEntryTarget = (e.entryTargetX !== undefined && e.entryTargetY !== undefined);
    if (!hasEntryTarget || e.entryDone) {
      readyCount++;
      return;
    }

    if (e.entryDelay > 0) {
      e.entryDelay -= dt;
      return;
    }

    const dx = e.entryTargetX - e.x;
    const dy = e.entryTargetY - e.y;
    const dist = Math.hypot(dx, dy);
    const move = Math.max(1.8, 5.2 - e.row * 0.35) * step;

    if (dist <= move) {
      e.x = e.entryTargetX;
      e.y = e.entryTargetY;
      e.entryDone = true;
      readyCount++;
      return;
    }

    const invDist = 1 / Math.max(0.001, dist);
    e.x += dx * invDist * move;
    e.y += dy * invDist * move;
  });

  return readyCount >= activeEnemies.length;
}

function launchSetPieceDiver(e, targetX, targetY, speedMult = 1) {
  const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
  const baseSpeed = getDifficultySettings(level).diveSpeed * (data.speed || 1) * speedMult;
  const angle = Math.atan2(targetY - e.y, targetX - e.x);

  e.diving = true;
  e.vx = Math.cos(angle) * baseSpeed;
  e.vy = Math.sin(angle) * baseSpeed;
}

// =====================
// SHMUP ROUTES
// Rutas de movimiento tipo shoot'em up vertical
// Solo se aplican si e.shmupRoute está definido
// =====================

const SHMUP_ROUTES = {
  STRAIGHT_DOWN: 'straightDown',
  SINE_DOWN: 'sineDown',
  DIAGONAL_LEFT: 'diagonalLeft',
  DIAGONAL_RIGHT: 'diagonalRight',
  SWEEP_LEFT: 'sweepLeft',
  SWEEP_RIGHT: 'sweepRight',
  DIVE_TO_PLAYER: 'diveToPlayer'
};

function applyShmupEnemyRoute(e, step, time, player) {
  if (!e.shmupRoute) return false;

  switch (e.shmupRoute) {
    case SHMUP_ROUTES.STRAIGHT_DOWN:
      e.y += (e.routeSpeed || 2.5) * step;
      break;

    case SHMUP_ROUTES.SINE_DOWN:
      e.y += (e.routeSpeed || 2.0) * step;
      e.x = (e.baseX != null ? e.baseX : e.x) + Math.sin(time * 0.003 + (e.routePhase || 0)) * (e.routeAmp || 32);
      break;

    case SHMUP_ROUTES.DIAGONAL_LEFT:
      e.y += (e.routeSpeed || 2.2) * step;
      e.x -= (e.routeSideSpeed || 1.0) * step;
      break;

    case SHMUP_ROUTES.DIAGONAL_RIGHT:
      e.y += (e.routeSpeed || 2.2) * step;
      e.x += (e.routeSideSpeed || 1.0) * step;
      break;

    case SHMUP_ROUTES.SWEEP_LEFT:
      e.x -= (e.routeSideSpeed || 2.5) * step;
      e.y += (e.routeSpeed || 1.0) * step;
      break;

    case SHMUP_ROUTES.SWEEP_RIGHT:
      e.x += (e.routeSideSpeed || 2.5) * step;
      e.y += (e.routeSpeed || 1.0) * step;
      break;

    case SHMUP_ROUTES.DIVE_TO_PLAYER:
      if (player) {
        const dx = (player.x + player.width / 2) - (e.x + e.w / 2);
        const dy = (player.y + player.height / 2) - (e.y + e.h / 2);
        const dist = Math.hypot(dx, dy);
        const speed = (e.routeSpeed || 2.2) * step;
        if (dist > 1) {
          e.x += (dx / dist) * speed * (e.routeHomingX != null ? e.routeHomingX : 0.7);
          e.y += (dy / dist) * speed;
        } else {
          e.y += speed;
        }
      } else {
        e.y += (e.routeSpeed || 2.2) * step;
      }
      break;
  }

  return true;
}

function runSetPieceDivePattern(activeEnemies, dt, diveSlotsLeft) {
  if (diveSlotsLeft <= 0 || setPieceIntroTimer > 0) return 0;

  // HC-VS-04C: read active setpiece beat effect for gameplay wiring
  var beatEffect = (typeof window.getActiveSetpieceBeatEffect === 'function')
    ? window.getActiveSetpieceBeatEffect() : null;

  // ---- PINCER ASSAULT (Level 3) ----
  if (currentSetPiece === 'pincer') {
    // dual_side_entry / closing_wings: both flanks dive
    if (beatEffect === 'lane_opens') return 0; // relief beat — no dives

    setPiecePatternTimer += dt;
    var waveCooldown = Math.max(700, 1550 - level * 22);
    // closing_wings: faster dive cadence, narrower aim spread
    if (beatEffect === 'closing_wings') waveCooldown = Math.round(waveCooldown * 0.75);
    if (setPiecePatternTimer < waveCooldown) return 0;
    setPiecePatternTimer = 0;

    var canDive = function(e) { return !e.diving && ENEMY_TYPES[e.type]?.canDive !== false; };
    var leftCandidates = activeEnemies.filter(function(e) { return canDive(e) && (e.x + e.w / 2) < W * 0.5; });
    var rightCandidates = activeEnemies.filter(function(e) { return canDive(e) && (e.x + e.w / 2) >= W * 0.5; });

    var pickFlank = function(arr, side) {
      if (arr.length === 0) return null;
      arr.sort(function(a, b) { return side < 0 ? a.x - b.x : b.x - a.x; });
      return arr[0];
    };

    var left = pickFlank(leftCandidates, -1);
    var right = pickFlank(rightCandidates, 1);

    var playerCenterX = player.x + player.width / 2;
    var playerAimY = player.y + 20;
    var launched = 0;

    // closing_wings: aim at center (narrower spread)
    var spreadX = beatEffect === 'closing_wings' ? 14 : 26;

    if (left && launched < diveSlotsLeft) {
      launchSetPieceDiver(left, playerCenterX - spreadX, playerAimY, 1.12);
      launched++;
    }
    if (right && launched < diveSlotsLeft) {
      launchSetPieceDiver(right, playerCenterX + spreadX, playerAimY, 1.12);
      launched++;
    }

    if (launched > 0) {
      sfxEnemyHit();
      pushScreenShake('light', 2);
    }

    return launched;
  }

  // ---- KAMIKAZE RUSH (Level 12) ----
  if (currentSetPiece === 'kamikaze_rush') {
    var kamBeat = beatEffect || '';
    if (kamBeat === 'survivors_scatter') return 0;

    setPiecePatternTimer += dt;
    var kamCooldown = 700;
    if (kamBeat === 'dive_wave_1') kamCooldown = 1800;
    if (kamBeat === 'dive_wave_2_3') kamCooldown = 900;
    if (setPiecePatternTimer < kamCooldown) return 0;
    setPiecePatternTimer = 0;

    var kamCan = function(e) { return !e.diving && ENEMY_TYPES[e.type]?.canDive !== false; };
    var kamCandidates = activeEnemies.filter(function(e) { return kamCan(e); });
    if (kamCandidates.length === 0) return 0;

    var launched = 0;
    var maxLaunch = beatEffect === 'dive_wave_2_3' ? Math.min(3, diveSlotsLeft) : 1;
    kamCandidates.sort(function() { return Math.random() - 0.5; });

    for (var k = 0; k < kamCandidates.length && launched < maxLaunch; k++) {
      var ke = kamCandidates[k];
      launchSetPieceDiver(ke, player.x + player.width / 2 + (Math.random() - 0.5) * 40, player.y + 20, 1.2);
      launched++;
    }

    if (launched > 0) {
      sfxEnemyHit();
      pushScreenShake('light', 2);
    }
    return launched;
  }

  return 0;
}
