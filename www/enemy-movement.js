// =====================
// GALAXY RAIDERS - enemy-movement.js
// Movimiento horizontal/vertical, patrones de entrada, zigzag/dive/orbit
// =====================

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
