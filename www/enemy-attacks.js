// =====================
// GALAXY RAIDERS - enemy-attacks.js
// Funciones de disparo enemigo, cooldowns, patrones de ataque
// =====================

function pushEnemyBullet(x, y, vx, vy, w = 4, h = 10, meta = {}) {
  // HC-RK-04: apply rank bullet speed through safety governor
  var baseSpeed = Math.sqrt(vx * vx + vy * vy);
  var rankSpeedResult = (typeof window.getHardcoreRankGameplayBulletSpeed === 'function')
    ? window.getHardcoreRankGameplayBulletSpeed(baseSpeed)
    : { multiplier: 1.00, capped: false, governorApproved: false };
  var speedMult = rankSpeedResult.multiplier;

  // Log application
  if (typeof window.recordHardcoreRankGameplayApply === 'function' && rankSpeedResult.governorApproved) {
    window.recordHardcoreRankGameplayApply('bulletSpeed', rankSpeedResult.capped);
  }

  var bullet = { x, y, w, h, vx: vx * speedMult, vy: vy * speedMult, ...meta };
  // HC-HB-04: validate bullet fairness (skip if spawned inside player hurtbox)
  if (typeof validateBulletFairness === 'function' && !validateBulletFairness(bullet)) {
    return;
  }
  enemyBullets.push(bullet);
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

  // HC-VS-04C: read active setpiece beat effect for gameplay wiring
  var beatEffect = (typeof window.getActiveSetpieceBeatEffect === 'function')
    ? window.getActiveSetpieceBeatEffect() : null;

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
    // HC-VS-04C: all_rows_active — fire all rows simultaneously, no cycling
    if (beatEffect === 'all_rows_active') {
      if (setPieceTelegraphTimer > 0) {
        setPieceTelegraphTimer -= dt;
        if (setPieceTelegraphTimer <= 0) {
          setPieceTelegraphTimer = 0;
          var allRows = [...new Set(shooters.map(function(e) { return e.row; }))].sort(function(a, b) { return a - b; });
          for (var ri = 0; ri < allRows.length; ri++) {
            var rShooters = shooters.filter(function(e) { return e.row === allRows[ri]; }).sort(function(a, b) { return a.x - b.x; });
            if (rShooters.length === 0) continue;
            var volley = pickVolleyShooters(rShooters, Math.min(3, rShooters.length));
            var bulletSpeed = getDifficultySettings(level).bulletSpeed;
            for (var vi = 0; vi < volley.length; vi++) {
              var e = volley[vi];
              var sx = e.x + e.w / 2;
              var sy = e.y + e.h;
              pushEnemyBullet(sx, sy, (vi - 1) * 0.8, bulletSpeed * 0.9, 3, 12, { kind: 'fortress', color: '#ffc66f' });
            }
          }
          enemyLastShot = globalTime;
          sfxEnemyHit();
        }
        return true;
      }
    }
    // HC-VS-04C: row_by_row_clear — stop fire
    if (beatEffect === 'row_by_row_clear') return true;

    var cooldown = Math.max(340, baseCooldown * 0.82);
    // HC-VS-04C: rows_descend — slower fire during descent
    if (beatEffect === 'rows_descend') cooldown = Math.round(cooldown * 1.5);
    var telegraphDuration = 220;

    if (setPieceTelegraphTimer > 0) {
      setPieceTelegraphTimer -= dt;
      if (setPieceTelegraphTimer <= 0) {
        setPieceTelegraphTimer = 0;

        var rows = [...new Set(shooters.map(function(e) { return e.row; }))].sort(function(a, b) { return a - b; });
        if (rows.length === 0) return true;

        var requestedLane = Math.max(0, Math.floor(setPieceTelegraphSide || 0));
        var lane = rows.includes(requestedLane) ? requestedLane : rows[0];
        var rowShooters = shooters
          .filter(function(e) { return e.row === lane; })
          .sort(function(a, b) { return a.x - b.x; });
        if (rowShooters.length === 0) return true;

        var volleyCount = Math.min(4, Math.max(2, Math.floor(2 + level / 8)));
        var volley = pickVolleyShooters(rowShooters, volleyCount);
        var bulletSpeed = getDifficultySettings(level).bulletSpeed;
        var center = (volley.length - 1) / 2;

        volley.forEach(function(e, i) {
          var sx = e.x + e.w / 2;
          var sy = e.y + e.h;
          var aimX = player.x + player.width / 2 + (i - center) * 14;
          var aimY = player.y + player.height * 0.45;
          var dx = aimX - sx;
          var dy = aimY - sy;
          var dist = Math.max(1, Math.hypot(dx, dy));

          var vx = clamp((dx / dist) * bulletSpeed * 0.72, -2.2, 2.2);
          var vy = Math.max(2.2, bulletSpeed * 0.92);
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
      var rowKeys = [...new Set(shooters.map(function(e) { return e.row; }))].sort(function(a, b) { return a - b; });
      if (rowKeys.length === 0) return true;

      var targetLane = rowKeys[setPieceLaneIndex % rowKeys.length];
      setPieceLaneIndex = (setPieceLaneIndex + 1) % rowKeys.length;
      setPieceTelegraphSide = targetLane;
      setPieceTelegraphTimer = telegraphDuration;
      sfxUIClick();
      vibrate('tap');
      return true;
    }

    return true;
  }

  if (currentSetPiece === 'imperial_guard') {
    // HC-VS-04C: guard_broken — stop fire
    if (beatEffect === 'guard_broken') return true;

    var diffMode = difficulties[difficultyIndex] || difficulties[0];
    var advancedBurst = level >= 19 || (diffMode && diffMode.key === 'hardcore');
    var igCooldown = Math.max(advancedBurst ? 310 : 360, baseCooldown * (advancedBurst ? 0.68 : 0.72));
    // HC-VS-04C: formation_march — slow deliberate fire
    if (beatEffect === 'formation_march') igCooldown = Math.round(igCooldown * 1.5);
    // HC-VS-04C: crossfire_burst_2_chained — faster chained attacks
    if (beatEffect === 'crossfire_burst_2_chained') { igCooldown = Math.round(igCooldown * 0.7); advancedBurst = true; }
    var igTelegraphDuration = advancedBurst ? 250 : 360;
    var chainedTelegraphDuration = advancedBurst ? 175 : igTelegraphDuration;
    var chainedDelay = advancedBurst ? 115 : 0;

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

    if (setPieceFireTimer >= igCooldown) {
      setPieceFireTimer = 0;
      setPieceLaneIndex = (setPieceLaneIndex + 1) % 2;
      setPieceTelegraphSide = (setPieceLaneIndex === 0) ? -1 : 1;
      setPieceTelegraphTimer = igTelegraphDuration;
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
    // HC-VS-04C: cleanup_minis — stop fire
    if (beatEffect === 'cleanup_minis') return true;

    var sCooldown = Math.max(300, baseCooldown * 0.74);
    // HC-VS-04C: split_cascade — faster fire during climax
    if (beatEffect === 'split_cascade') sCooldown = Math.round(sCooldown * 0.6);
    var sTelegraphDuration = 190;
    // HC-VS-04C: formation_settle — slower, more telegraph
    if (beatEffect === 'formation_settle') { sCooldown = Math.round(sCooldown * 1.6); sTelegraphDuration = 280; }

    if (setPieceTelegraphTimer > 0) {
      setPieceTelegraphTimer -= dt;
      if (setPieceTelegraphTimer <= 0) {
        setPieceTelegraphTimer = 0;

        var splitters = shooters.filter(function(e) { return e.type === 'alien6'; }).sort(function(a, b) { return a.x - b.x; });
        var pool = splitters.length > 0 ? splitters : shooters.slice().sort(function(a, b) { return a.x - b.x; });
        if (pool.length === 0) return true;

        var side = setPieceTelegraphSide === -1 ? -1 : 1;
        var sidePool = pool.filter(function(e) { return side < 0 ? (e.x + e.w / 2) < W * 0.5 : (e.x + e.w / 2) >= W * 0.5; });
        var lanePool = sidePool.length > 0 ? sidePool : pool;
        var shooter = lanePool[Math.floor(Math.random() * lanePool.length)];
        if (!shooter) return true;

        var sx = shooter.x + shooter.w / 2;
        var sy = shooter.y + shooter.h;
        var vy = getDifficultySettings(level).bulletSpeed * 0.9;
        // HC-VS-04C: split_cascade — wider fan during climax
        var fanSpread = beatEffect === 'split_cascade' ? 1.8 : 1.25;
        pushEnemyBullet(sx, sy, -fanSpread, vy, 4, 9, { kind: 'split_fan', color: '#7effd8' });
        pushEnemyBullet(sx, sy, 0, vy, 4, 9, { kind: 'split_fan', color: '#7effd8' });
        pushEnemyBullet(sx, sy, fanSpread, vy, 4, 9, { kind: 'split_fan', color: '#7effd8' });

        enemyLastShot = globalTime;
        sfxEnemyHit();
      }
      return true;
    }

    if (setPieceFireTimer >= sCooldown) {
      setPieceFireTimer = 0;
      setPieceLaneIndex = (setPieceLaneIndex + 1) % 2;
      setPieceTelegraphSide = setPieceLaneIndex === 0 ? -1 : 1;
      setPieceTelegraphTimer = sTelegraphDuration;
      sfxUIClick();
      vibrate('tap');
      return true;
    }

    return true;
  }

  return false;
}
