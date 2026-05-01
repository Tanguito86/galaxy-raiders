// =====================
// GALAXY RAIDERS - enemy-attacks.js
// Funciones de disparo enemigo, cooldowns, patrones de ataque
// =====================

function pushEnemyBullet(x, y, vx, vy, w = 4, h = 10, meta = {}) {
  enemyBullets.push({ x, y, w, h, vx, vy, ...meta });
}

function pickVolleyShooters(shooters, maxCount) {
  if (shooters.length <= maxCount) return shooters;
  const picked = [];
  const used = {};
  const denom = Math.max(1, maxCount - 1);
  for (let i = 0; i < maxCount; i++) {
    const idx = Math.round((i * (shooters.length - 1)) / denom);
    if (used[idx]) continue;
    used[idx] = true;
    picked.push(shooters[idx]);
  }
  return picked;
}

function fireImperialGuardCrossfire(shooters, side, variant = 0, burstPhase = 0) {
  const flank = shooters
    .filter(e => side < 0 ? (e.x + e.w / 2) < W * 0.5 : (e.x + e.w / 2) >= W * 0.5)
    .sort((a, b) => side < 0 ? a.x - b.x : b.x - a.x);

  const basePool = flank.length > 0 ? flank : shooters.slice().sort((a, b) => a.x - b.x);
  const volley = pickVolleyShooters(basePool, Math.min(4, Math.max(2, Math.floor(2 + level / 7))));
  if (volley.length === 0) return false;

  const bulletSpeed = getDifficultySettings(level).bulletSpeed;
  const centerX = player.x + player.width / 2;
  const aimY = player.y + player.height * 0.5;
  const center = (volley.length - 1) / 2;
  const variantIdx = Math.abs(variant) % 3;
  const leadByVariant = [24, 32, 20];
  const spacingByVariant = [16, 22, 14];
  const lead = leadByVariant[variantIdx] + (burstPhase === 1 ? 10 : 0);
  const spacing = spacingByVariant[variantIdx] + (burstPhase === 1 ? 4 : 0);
  const speedMul = burstPhase === 1 ? 1.06 : 0.98;

  volley.forEach((e, i) => {
    const sx = e.x + e.w / 2;
    const sy = e.y + e.h;
    const laneOffset = (i - center) * spacing;
    const aimX = centerX + (side < 0 ? lead : -lead) - laneOffset * side;
    const dx = aimX - sx;
    const dy = aimY - sy;
    const dist = Math.max(1, Math.hypot(dx, dy));

    const vx = clamp((dx / dist) * bulletSpeed * 0.82 * speedMul, -3.1, 3.1);
    const vy = Math.max(2.3, bulletSpeed * speedMul);
    pushEnemyBullet(sx, sy, vx, vy, 4, 10, {
      kind: burstPhase === 1 ? 'crossfire_b' : 'crossfire_a',
      color: burstPhase === 1 ? '#ff6a6a' : '#ffb15a'
    });
  });

  enemyLastShot = globalTime;
  sfxEnemyHit();
  pushScreenShake('light', 2);
  return true;
}

function runSetPieceFirePattern(activeEnemies, dt, baseCooldown) {
  if (!currentSetPiece || setPieceIntroTimer > 0) return false;

  const shooters = activeEnemies.filter(e => !e.diving && ENEMY_TYPES[e.type]?.shoots);
  if (shooters.length === 0) {
    if (currentSetPiece === 'imperial_guard') {
      setPieceTelegraphTimer = 0;
      setPieceTelegraphSide = 0;
      setPieceBurstShotsRemaining = 0;
      setPieceBurstDelayTimer = 0;
    }
    if (currentSetPiece === 'fortress' || currentSetPiece === 'split_storm') {
      setPieceTelegraphTimer = 0;
      setPieceTelegraphSide = 0;
    }
    return false;
  }

  if (currentSetPiece === 'fortress') {
    setPieceFireTimer += dt;
    const cooldown = Math.max(340, baseCooldown * 0.82);
    const telegraphDuration = 220;

    if (setPieceTelegraphTimer > 0) {
      setPieceTelegraphTimer -= dt;
      if (setPieceTelegraphTimer <= 0) {
        setPieceTelegraphTimer = 0;

        const rows = [...new Set(shooters.map(e => e.row))].sort((a, b) => a - b);
        if (rows.length === 0) return true;

        const requestedLane = Math.max(0, Math.floor(setPieceTelegraphSide || 0));
        const lane = rows.includes(requestedLane) ? requestedLane : rows[0];
        const rowShooters = shooters
          .filter(e => e.row === lane)
          .sort((a, b) => a.x - b.x);
        if (rowShooters.length === 0) return true;

        const volleyCount = Math.min(4, Math.max(2, Math.floor(2 + level / 8)));
        const volley = pickVolleyShooters(rowShooters, volleyCount);
        const bulletSpeed = getDifficultySettings(level).bulletSpeed;
        const center = (volley.length - 1) / 2;

        volley.forEach((e, i) => {
          const sx = e.x + e.w / 2;
          const sy = e.y + e.h;
          const aimX = player.x + player.width / 2 + (i - center) * 14;
          const aimY = player.y + player.height * 0.45;
          const dx = aimX - sx;
          const dy = aimY - sy;
          const dist = Math.max(1, Math.hypot(dx, dy));

          const vx = clamp((dx / dist) * bulletSpeed * 0.72, -2.2, 2.2);
          const vy = Math.max(2.2, bulletSpeed * 0.92);
          pushEnemyBullet(sx, sy, vx, vy, 3, 12, {
            kind: 'fortress',
            color: '#ffc66f'
          });
        });

        enemyLastShot = globalTime;
        sfxEnemyHit();
      }
      return true;
    }

    if (setPieceFireTimer >= cooldown) {
      setPieceFireTimer = 0;
      const rows = [...new Set(shooters.map(e => e.row))].sort((a, b) => a - b);
      if (rows.length === 0) return true;

      const lane = rows[setPieceLaneIndex % rows.length];
      setPieceLaneIndex = (setPieceLaneIndex + 1) % rows.length;
      setPieceTelegraphSide = lane;
      setPieceTelegraphTimer = telegraphDuration;
      sfxUIClick();
      vibrate('tap');
      return true;
    }

    return true;
  }

  if (currentSetPiece === 'imperial_guard') {
    const diffMode = difficulties[difficultyIndex] || difficulties[0];
    const advancedBurst = level >= 19 || diffMode.key === 'hardcore';
    const cooldown = Math.max(advancedBurst ? 310 : 360, baseCooldown * (advancedBurst ? 0.68 : 0.72));
    const telegraphDuration = advancedBurst ? 250 : 360;
    const chainedTelegraphDuration = advancedBurst ? 175 : telegraphDuration;
    const chainedDelay = advancedBurst ? 115 : 0;

    setPieceFireTimer += dt;
    if (setPieceBurstDelayTimer > 0) {
      setPieceBurstDelayTimer -= dt;
      if (setPieceBurstDelayTimer < 0) setPieceBurstDelayTimer = 0;
    }

    if (setPieceTelegraphTimer > 0) {
      setPieceTelegraphTimer -= dt;
      if (setPieceTelegraphTimer <= 0) {
        setPieceTelegraphTimer = 0;
        const side = (setPieceTelegraphSide === -1 || setPieceTelegraphSide === 1)
          ? setPieceTelegraphSide
          : ((setPieceLaneIndex % 2 === 0) ? -1 : 1);
        const totalBurstShots = advancedBurst ? 2 : 1;
        const burstPhase = Math.max(0, totalBurstShots - setPieceBurstShotsRemaining);
        const didFire = fireImperialGuardCrossfire(shooters, side, setPieceBurstVariant, burstPhase);

        if (didFire) {
          if (setPieceBurstShotsRemaining > 0) setPieceBurstShotsRemaining--;
          if (setPieceBurstShotsRemaining > 0) {
            setPieceTelegraphSide = (side === -1) ? 1 : -1;
            setPieceBurstDelayTimer = chainedDelay;
          } else {
            setPieceBurstDelayTimer = 0;
          }
        }
      }
      return true;
    }

    if (setPieceBurstShotsRemaining > 0 && setPieceBurstDelayTimer <= 0) {
      setPieceTelegraphTimer = chainedTelegraphDuration;
      sfxImperialTelegraph();
      vibrate('hit');
      return true;
    }

    if (setPieceFireTimer >= cooldown) {
      setPieceFireTimer = 0;
      setPieceLaneIndex = (setPieceLaneIndex + 1) % 2;
      setPieceTelegraphSide = (setPieceLaneIndex === 0) ? -1 : 1;
      setPieceTelegraphTimer = telegraphDuration;
      setPieceBurstShotsRemaining = advancedBurst ? 2 : 1;
      setPieceBurstDelayTimer = 0;
      setPieceBurstVariant = (setPieceBurstVariant + 1) % 3;
      sfxUIClick();
      vibrate('tap');
      return true;
    }

    return true;
  }

  if (currentSetPiece === 'split_storm') {
    setPieceFireTimer += dt;
    const cooldown = Math.max(300, baseCooldown * 0.74);
    const telegraphDuration = 190;

    if (setPieceTelegraphTimer > 0) {
      setPieceTelegraphTimer -= dt;
      if (setPieceTelegraphTimer <= 0) {
        setPieceTelegraphTimer = 0;

        const splitters = shooters.filter(e => e.type === 'alien6').sort((a, b) => a.x - b.x);
        const pool = splitters.length > 0 ? splitters : shooters.slice().sort((a, b) => a.x - b.x);
        if (pool.length === 0) return true;

        const side = setPieceTelegraphSide === -1 ? -1 : 1;
        const sidePool = pool.filter(e => side < 0 ? (e.x + e.w / 2) < W * 0.5 : (e.x + e.w / 2) >= W * 0.5);
        const lanePool = sidePool.length > 0 ? sidePool : pool;
        const shooter = lanePool[Math.floor(Math.random() * lanePool.length)];
        if (!shooter) return true;

        const sx = shooter.x + shooter.w / 2;
        const sy = shooter.y + shooter.h;
        const vy = getDifficultySettings(level).bulletSpeed * 0.9;
        pushEnemyBullet(sx, sy, -1.25, vy, 4, 9, { kind: 'split_fan', color: '#7effd8' });
        pushEnemyBullet(sx, sy, 0, vy, 4, 9, { kind: 'split_fan', color: '#7effd8' });
        pushEnemyBullet(sx, sy, 1.25, vy, 4, 9, { kind: 'split_fan', color: '#7effd8' });

        enemyLastShot = globalTime;
        sfxEnemyHit();
      }
      return true;
    }

    if (setPieceFireTimer >= cooldown) {
      setPieceFireTimer = 0;
      setPieceLaneIndex = (setPieceLaneIndex + 1) % 2;
      setPieceTelegraphSide = setPieceLaneIndex === 0 ? -1 : 1;
      setPieceTelegraphTimer = telegraphDuration;
      sfxUIClick();
      vibrate('tap');
      return true;
    }

    return true;
  }

  return false;
}
