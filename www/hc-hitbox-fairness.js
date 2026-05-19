// ============================================================
// HC-HB-03 — Fairness Rules & Spawn Safety
// ============================================================
// Hardcore collision fairness layer.
// Does NOT increase difficulty. Does NOT add damage.
// Only removes unfair collisions and inevitable deaths.
// ============================================================

var _hcFairnessEnabled = true;
var _hcSpawnSafetyEnabled = true;
var _hcFairnessDebugLog = false;

// ============================================================
// FAIRNESS RULE DEFINITIONS
// ============================================================
window.HC_FAIRNESS_RULES = {
  SPAWN_CLEARANCE:    'enemy_spawn_clearance',    // enemies must not spawn on player
  BULLET_CLEARANCE:   'bullet_spawn_clearance',   // bullets must not spawn inside hurtbox
  LASER_TELEGRAPH:    'laser_telegraph',          // lasers need visual warning
  PICKUP_FAIRNESS:    'pickup_fairness',          // pickups use same hurtbox as damage
  OVERLAP_CAP:        'overlap_cap',              // prevent stack-unfair multi-hits
  VISUAL_MATCH:       'visual_match',             // hitbox <= visual representation
  DETERMINISTIC:      'deterministic_fire',       // no setTimeout-based fire patterns
  DEATH_CLARITY:      'death_clarity'             // player must see what killed them
};

// ============================================================
// GLOBAL HELPERS
// ============================================================
function getHCFairnessRules() {
  return window.HC_FAIRNESS_RULES;
}

function isHCFairnessEnabled() {
  return _hcFairnessEnabled;
}

function isHCSpawnSafetyEnabled() {
  return _hcSpawnSafetyEnabled && _hcFairnessEnabled;
}

function isHCFairnessDebugLogEnabled() {
  return _hcFairnessDebugLog;
}

function setHCFairnessDebugLog(enabled) {
  _hcFairnessDebugLog = !!enabled;
}

// ============================================================
// PLAYER CENTER HELPER
// ============================================================
function _hcFairnessPlayerCenter() {
  if (typeof player === 'undefined' || !player) return null;
  return {
    x: player.x + (player.width || player.w || 33) / 2,
    y: player.y + (player.height || player.h || 24) / 2
  };
}

function _hcFairnessPlayerRect() {
  if (typeof player === 'undefined' || !player) return null;
  return {
    x: player.x,
    y: player.y,
    w: player.width || player.w || 33,
    h: player.height || player.h || 24
  };
}

// ============================================================
// SPAWN SAFETY
// ============================================================

// Check if a point is safe to spawn at (relative to player)
// Returns { safe: bool, reason: string, adjustedX: number, adjustedY: number }
function checkSpawnSafety(x, y, w, h, options) {
  if (!isHCSpawnSafetyEnabled()) return { safe: true, reason: 'disabled', adjustedX: x, adjustedY: y };

  var opts = options || {};
  var center = _hcFairnessPlayerCenter();
  if (!center) return { safe: true, reason: 'no_player', adjustedX: x, adjustedY: y };

  var sc = getHCHitboxSpawnSafetyConfig();
  var minDist = opts.minDistance || sc.safetyRadius || 80;

  var ex = x + (w || 0) / 2;
  var ey = y + (h || 0) / 2;
  var dx = ex - center.x;
  var dy = ey - center.y;
  var dist = Math.sqrt(dx * dx + dy * dy);

  if (dist >= minDist) {
    return { safe: true, reason: 'clear', adjustedX: x, adjustedY: y, distance: dist };
  }

  // Not safe — attempt adjust
  var adjustedX = x;
  var adjustedY = y;
  var retreats = opts.maxRetries || 3;

  for (var i = 0; i < retreats; i++) {
    var angle = Math.random() * Math.PI * 2;
    var push = minDist - dist + 10 + Math.random() * 20;
    adjustedX = x + Math.cos(angle) * push;
    adjustedY = y + Math.sin(angle) * push;

    // Clamp to screen
    var W_ref = (typeof W === 'number') ? W : 360;
    var H_ref = (typeof H === 'number') ? H : 640;
    adjustedX = clamp(adjustedX, 5, W_ref - (w || 24) - 5);
    adjustedY = clamp(adjustedY, 5, H_ref - 100);

    var nex = adjustedX + (w || 0) / 2;
    var ney = adjustedY + (h || 0) / 2;
    var ndx = nex - center.x;
    var ndy = ney - center.y;
    var ndist = Math.sqrt(ndx * ndx + ndy * ndy);

    if (ndist >= minDist) {
      if (_hcFairnessDebugLog) {
        console.log('[HC-HB] SPAWN adjusted: (' + x + ',' + y + ') → (' + adjustedX + ',' + adjustedY + ') dist=' + Math.round(ndist));
      }
      return { safe: true, reason: 'adjusted', adjustedX: adjustedX, adjustedY: adjustedY, distance: ndist };
    }
  }

  // Last resort fallback: push far
  var fallbackX = center.x + minDist + 30;
  if (fallbackX + (w || 24) > ((typeof W === 'number') ? W : 360)) {
    fallbackX = center.x - minDist - 30 - (w || 24);
  }
  var fallbackY = clamp(y - 80, 5, H_ref - 100);

  if (_hcFairnessDebugLog) {
    console.warn('[HC-HB] SPAWN fallback: (' + x + ',' + y + ') → (' + fallbackX + ',' + fallbackY + ')');
  }
  return { safe: true, reason: 'fallback', adjustedX: Math.max(5, fallbackX), adjustedY: fallbackY, distance: minDist };
}

// Simpler boolean check — just tells if a point is too close
function isSafeSpawnPosition(x, y) {
  if (!isHCSpawnSafetyEnabled()) return true;
  var center = _hcFairnessPlayerCenter();
  if (!center) return true;
  var sc = getHCHitboxSpawnSafetyConfig();
  var minDist = sc.safetyRadius || 80;
  var dx = x - center.x;
  var dy = y - center.y;
  return (dx * dx + dy * dy) >= (minDist * minDist);
}

// ============================================================
// BULLET FAIRNESS VALIDATION
// ============================================================
function validateBulletFairness(bullet) {
  if (!_hcFairnessEnabled) return true;
  if (!bullet) return false;

  // Rule: bullet must not spawn inside player hurtbox
  var pr = _hcFairnessPlayerRect();
  if (!pr) return true;

  var bx = bullet.x || 0;
  var by = bullet.y || 0;
  var bw = bullet.w || 4;
  var bh = bullet.h || 10;

  // AABB overlap check with player
  var overlap = (
    bx < pr.x + pr.w &&
    bx + bw > pr.x &&
    by < pr.y + pr.h &&
    by + bh > pr.y
  );

  if (overlap) {
    if (_hcFairnessDebugLog) {
      console.warn('[HC-HB] BULLET spawned inside player hurtbox at (' + bx + ',' + by + ')');
    }
    return false;
  }

  // Rule: bullet must not spawn outside screen (wasted allocation)
  var screenW = (typeof W === 'number') ? W : 360;
  var screenH = (typeof H === 'number') ? H : 640;
  if (bx + bw < -20 || bx > screenW + 20 || by + bh < -20 || by > screenH + 20) {
    // Let it pass — off-screen bullets are harmless
    return true;
  }

  return true;
}

// ============================================================
// ENEMY OVERLAP FAIRNESS
// ============================================================
function validateEnemyOverlapFairness(enemy) {
  if (!_hcFairnessEnabled) return true;
  if (!enemy || !enemy.alive) return true;

  var pr = _hcFairnessPlayerRect();
  if (!pr) return true;

  var overlap = (
    enemy.x < pr.x + pr.w &&
    enemy.x + enemy.w > pr.x &&
    enemy.y < pr.y + pr.h &&
    enemy.y + enemy.h > pr.y
  );

  if (overlap && _hcFairnessDebugLog) {
    console.warn('[HC-HB] ENEMY overlapped player at (' + enemy.x + ',' + enemy.y + ') type=' + (enemy.type || '?'));
  }

  // Don't prevent — just report. The invincibility system handles this.
  return true;
}

// ============================================================
// PICKUP FAIRNESS
// ============================================================

// Returns true if the pickup is within the player's hurtbox (fair collection)
function checkPickupCollectionFairness(pickupX, pickupY, pickupW, pickupH) {
  var cfg = getHCHitboxFairnessConfig();
  if (!cfg || !cfg.pickupUseHurtbox) {
    // Fallback: full AABB (original behaviour)
    var pr = _hcFairnessPlayerRect();
    if (!pr) return false;
    return (
      pickupX < pr.x + pr.w &&
      pickupX + pickupW > pr.x &&
      pickupY < pr.y + pr.h &&
      pickupY + pickupH > pr.y
    );
  }

  // Use the same hurtbox as lethal collisions
  if (typeof isHardcoreHitboxActive === 'function' && isHardcoreHitboxActive()) {
    var hp = getHCHitboxPlayerConfig();
    var hc = hp.hurtbox ? (hp.hurtbox.hardcore || { radius: 3 }) : { radius: 3 };
    var center = _hcFairnessPlayerCenter();
    if (!center) return false;

    // Circle vs AABB (same logic as checkPlayerCollisionAABB)
    var r = hc.radius;
    var closestX = pickupX < center.x ? (pickupX + pickupW < center.x ? pickupX + pickupW : center.x) : (pickupX > center.x ? pickupX : center.x);
    var closestY = pickupY < center.y ? (pickupY + pickupH < center.y ? pickupY + pickupH : center.y) : (pickupY > center.y ? pickupY : center.y);
    var dx = center.x - closestX;
    var dy = center.y - closestY;
    return (dx * dx + dy * dy) < (r * r);
  }

  // Normal mode: full AABB
  var pr = _hcFairnessPlayerRect();
  if (!pr) return false;
  return (
    pickupX < pr.x + pr.w &&
    pickupX + pickupW > pr.x &&
    pickupY < pr.y + pr.h &&
    pickupY + pickupH > pr.y
  );
}

// ============================================================
// BOSS ATTACK FAIRNESS GATES
// ============================================================

// Validates that a boss attack pattern respects fairness rules
function validateBossAttackFairness(bossRef, attackName) {
  if (!_hcFairnessEnabled) return { valid: true };

  var result = { valid: true, warnings: [] };

  // Check boss object integrity
  if (!bossRef || !bossRef.active) {
    result.valid = false;
    result.warnings.push('boss inactive or missing');
    return result;
  }

  // Check if boss is in a safe state to fire
  if (bossRef.isTeleporting) {
    result.warnings.push('boss is teleporting');
  }
  if (bossRef.retreating) {
    result.warnings.push('boss is retreating');
  }

  if (_hcFairnessDebugLog && result.warnings.length > 0) {
    console.warn('[HC-HB] Boss attack "' + attackName + '" fairness warnings:', result.warnings);
  }

  return result;
}

// ============================================================
// DETERMINISTIC FIRE HELPER (replaces setTimeout patterns)
// ============================================================

// Process a queued burst fire timer on a boss object
// Called every frame from updateBossStep.
// Returns true if a bullet was fired this frame.
function processBossQueuedBurst(bossRef, dt) {
  if (!bossRef || !bossRef._queuedBurst) return false;

  var qb = bossRef._queuedBurst;
  qb.timer -= (dt || 16.667);

  if (qb.timer <= 0) {
    // Fire one bullet from the queue
    if (typeof qb.fireFn === 'function') {
      qb.fireFn(bossRef);
    }
    qb.shotsFired++;

    if (qb.shotsFired >= qb.totalShots) {
      // Done
      bossRef._queuedBurst = null;
    } else {
      // Schedule next
      qb.timer += qb.interval;
    }
    return true;
  }
  return false;
}

// Schedule a deterministic burst on a boss object
function scheduleBossQueuedBurst(bossRef, totalShots, intervalMs, fireFn) {
  if (!bossRef) return;
  bossRef._queuedBurst = {
    timer: 0,
    totalShots: totalShots || 1,
    shotsFired: 0,
    interval: Math.max(30, intervalMs || 100),
    fireFn: fireFn
  };
}
