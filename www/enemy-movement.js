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

function runSetPieceDivePattern(activeEnemies, dt, diveSlotsLeft) {
  if (diveSlotsLeft <= 0 || setPieceIntroTimer > 0) return 0;
  if (currentSetPiece !== 'pincer') return 0;

  setPiecePatternTimer += dt;
  const waveCooldown = Math.max(700, 1550 - level * 22);
  if (setPiecePatternTimer < waveCooldown) return 0;
  setPiecePatternTimer = 0;

  const canDive = e => !e.diving && ENEMY_TYPES[e.type]?.canDive !== false;
  const leftCandidates = activeEnemies.filter(e => canDive(e) && (e.x + e.w / 2) < W * 0.5);
  const rightCandidates = activeEnemies.filter(e => canDive(e) && (e.x + e.w / 2) >= W * 0.5);

  const pickFlank = (arr, side) => {
    if (arr.length === 0) return null;
    arr.sort((a, b) => side < 0 ? a.x - b.x : b.x - a.x);
    return arr[0];
  };

  const left = pickFlank(leftCandidates, -1);
  const right = pickFlank(rightCandidates, 1);

  const playerCenterX = player.x + player.width / 2;
  const playerAimY = player.y + 20;
  let launched = 0;

  if (left && launched < diveSlotsLeft) {
    launchSetPieceDiver(left, playerCenterX - 26, playerAimY, 1.12);
    launched++;
  }
  if (right && launched < diveSlotsLeft) {
    launchSetPieceDiver(right, playerCenterX + 26, playerAimY, 1.12);
    launched++;
  }

  if (launched > 0) {
    sfxEnemyHit();
    pushScreenShake('light', 2);
  }

  return launched;
}
