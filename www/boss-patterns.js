// ==============================================
// GALAXY RAIDERS - boss-patterns.js
// Foundation for hardcore boss patterns (HC-17)
// ==============================================

// --- safe existence checks ---

function __bossExists() {
  return typeof boss !== 'undefined' && boss && boss.active === true;
}

function __playerExists() {
  return typeof player !== 'undefined' && player && typeof player.x === 'number';
}

// --- safe helpers ---

function getBossPhaseSafe(b) {
  var target = b || boss;
  if (!target || !target.active || target.maxHp <= 0) return 1;
  if (typeof getBossPhase === 'function') return getBossPhase();
  var hpPct = target.hp / target.maxHp;
  if (hpPct > 0.66) return 1;
  if (hpPct > 0.33) return 2;
  return 3;
}

function getBossCenter(b) {
  var target = b || boss;
  if (!target) return { x: 0, y: 0 };
  return {
    x: target.x + (target.w || 90) / 2,
    y: target.y + (target.h || 45) / 2
  };
}

function getAngleFromBossToPlayer(b) {
  if (!__playerExists()) return Math.PI / 2;
  var center = getBossCenter(b);
  var px = player.x + player.width / 2;
  var py = player.y + player.height / 2;
  return Math.atan2(py - center.y, px - center.x);
}

function shouldUseHardcoreBossPatterns() {
  if (typeof isHardcoreEnabled === 'function') return isHardcoreEnabled();
  if (typeof __safeIsHardcoreEnabled === 'function') return __safeIsHardcoreEnabled();
  return false;
}

function markBossPatternReady(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (target.patternReady) return true;

  target.patternReady = true;
  target.patternPhase = getBossPhaseSafe(target);
  if (target.patternTimer === undefined) target.patternTimer = 0;
  if (target.patternSeed === undefined) target.patternSeed = Math.random() * 1000;

  return true;
}

// ============================================================
// HARDCORE CRANCKTON PATTERN (first boss, crossfire)
// ============================================================

function isFirstHardcoreBoss(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (target.name === 'CRABTRON') return true;
  if (target.pattern === 'crossfire') return true;
  return false;
}

function shouldUseCrancktonHardcorePattern(b) {
  if (!shouldUseHardcoreBossPatterns()) return false;
  if (!isFirstHardcoreBoss(b)) return false;
  return true;
}

function _crancktonBulletSpeed() {
  var speed = 3.2;
  if (typeof getDifficultySettings === 'function') {
    var s = getDifficultySettings(typeof level === 'number' ? level : 5);
    if (s && typeof s.bulletSpeed === 'number') speed = s.bulletSpeed * 0.85;
  }
  return speed;
}

function fireCrancktonHardcorePattern(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (typeof pushEnemyBullet !== 'function') return false;
  if (target.dashMode) return false; // no shoot during dash

  var phase = getBossPhaseSafe(target);
  var center = getBossCenter(target);
  var speed = _crancktonBulletSpeed();

  if (phase === 1) {
    // HC-18: Phase 1 — 3-bullet aimed spread
    var angle = getAngleFromBossToPlayer(target);
    var spread = 0.22; // ~12.6°

    for (var i = -1; i <= 1; i++) {
      var a = angle + i * spread;
      pushEnemyBullet(center.x - 3, target.y + target.h, Math.cos(a) * speed, Math.sin(a) * speed, 6, 10, {
        kind: 'crossfire_a',
        color: '#ff8844',
        sourceType: 'boss_cranckton'
      });
    }

    if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    return true;
  }

  if (phase === 2) {
    // HC-18: Phase 2 — aimed burst (3 bullets with stagger)
    var angle2 = getAngleFromBossToPlayer(target);
    var burstSpeed = speed * 1.08;
    var delays = [0, 90, 180];

    for (var j = 0; j < delays.length; j++) {
      (function(delay, a, spd) {
        var sx = center.x;
        var sy = target.y + target.h;
        setTimeout(function() {
          if (!target.active) return;
          pushEnemyBullet(sx - 3, sy, Math.cos(a) * spd, Math.sin(a) * spd, 6, 10, {
            kind: 'crossfire_b',
            color: '#ff6655',
            sourceType: 'boss_cranckton'
          });
          if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
        }, delay);
      })(delays[j], angle2, burstSpeed);
    }

    if (typeof pushScreenShake === 'function') pushScreenShake('light', 2);
    if (typeof sfxBossWarning === 'function') sfxBossWarning();
    return true;
  }

  if (phase === 3) {
    // HC-18: Phase 3 — radial ring (alternating pure vs aimed)
    target._hcCrancktonRadialFlip = !target._hcCrancktonRadialFlip;
    var count = 12;
    var ringSpeed = speed * 0.78;

    for (var k = 0; k < count; k++) {
      var aRing = (Math.PI * 2 * k) / count;
      if (target._hcCrancktonRadialFlip) {
        // Aimed radial: all go toward player-relative offset
        var toPlayer = getAngleFromBossToPlayer(target);
        aRing += toPlayer - Math.PI / 2;
      }
      pushEnemyBullet(center.x - 2, center.y, Math.cos(aRing) * ringSpeed, Math.sin(aRing) * ringSpeed, 5, 8, {
        kind: 'basic',
        color: '#ff9944',
        sourceType: 'boss_cranckton'
      });
    }

    if (typeof pushScreenShake === 'function') pushScreenShake('medium', 5);
    if (typeof sfxBigExplosion === 'function') sfxBigExplosion();
    if (typeof requestBossMinorDuck === 'function') requestBossMinorDuck(160, 0.62);
    return true;
  }

  return false; // fallback to original
}
