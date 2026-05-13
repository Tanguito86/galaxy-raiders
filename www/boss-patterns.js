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
    // HC-21: Phase 1 — 3-bullet aimed spread (tighter, gaps readable)
    var angle = getAngleFromBossToPlayer(target);
    var spread = 0.18; // ~10.3° — clean gaps at level 5 distance

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
    // HC-21: telegraph before aimed burst (420ms for player reaction)
    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'phase2_burst', 420);

    // HC-21: Phase 2 — aimed burst (3 bullets, same speed as phase 1)
    var angle2 = getAngleFromBossToPlayer(target);
    var burstSpeed = speed; // no multiplier — readable at level 5
    var delays = [0, 100, 200]; // wider stagger for clearer dodge windows

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
    // HC-21: telegraph before radial (500ms — wide enough to react)
    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'phase3_radial', 500);

    // HC-21: Phase 3 — radial ring (8 bullets, alternating pure vs aimed every 3rd volley)
    target._hcCrancktonVolleyCount = (target._hcCrancktonVolleyCount || 0) + 1;
    var count = 8; // down from 12 — wider gaps at level 5
    var ringSpeed = speed * 0.78; // slow enough to dodge

    for (var k = 0; k < count; k++) {
      var aRing = (Math.PI * 2 * k) / count;
      if (target._hcCrancktonVolleyCount % 3 === 0) {
        // Aimed radial (every 3rd volley): rotate ring toward player
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

// ============================================================
// HARDCORE BOSS TELEGRAPH LAYER (HC-19)
// Visual-only warning before strong attacks
// ============================================================

var HC_TELEGRAPH_COLORS = {
  phase2_burst: '#ff6655',
  phase3_radial: '#ff9944',
  generic_warning: '#ffdd44'
};

function triggerBossTelegraph(b, type, duration) {
  var target = b || boss;
  if (!target || !target.active) return false;

  target._hcTelegraphType = type;
  target._hcTelegraphTimer = duration || 380;
  target._hcTelegraphDuration = target._hcTelegraphTimer;

  return true;
}

function updateBossTelegraph(b, dt) {
  var target = b || boss;
  if (!target || !target.active) return;
  if (!target._hcTelegraphTimer || target._hcTelegraphTimer <= 0) {
    target._hcTelegraphType = null;
    target._hcTelegraphTimer = 0;
    return;
  }
  target._hcTelegraphTimer -= dt;
  if (target._hcTelegraphTimer <= 0) {
    target._hcTelegraphType = null;
    target._hcTelegraphTimer = 0;
  }
}

function drawBossHardcoreTelegraph(ctx, b) {
  if (!ctx) return;
  var target = b || boss;
  if (!target || !target.active) return;
  if (!target._hcTelegraphType || !target._hcTelegraphTimer || target._hcTelegraphTimer <= 0) return;

  var type = target._hcTelegraphType;
  var progress = 1 - (target._hcTelegraphTimer / (target._hcTelegraphDuration || 380));
  progress = Math.max(0, Math.min(1, progress));
  var color = HC_TELEGRAPH_COLORS[type] || HC_TELEGRAPH_COLORS.generic_warning;

  var cx = target.x + (target.w || 90) / 2;
  var cy = target.y + (target.h || 45) / 2;
  var maxR = Math.max(target.w, target.h) * 1.4;

  ctx.save();

  // HC-21: Expanding ring (higher alpha for clear readability)
  var ringR = 20 + progress * maxR;
  var ringAlpha = (1 - progress) * 0.65;
  ctx.globalAlpha = ringAlpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Inner core glow
  var coreAlpha = (1 - progress) * 0.32 + 0.08;
  ctx.globalAlpha = coreAlpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, 14 + Math.sin(progress * Math.PI) * 8, 0, Math.PI * 2);
  ctx.fill();

  // HC-21: Pulsing secondary ring for phase 3 (replaces rotating lines)
  if (type === 'phase3_radial') {
    var pulseR = 18 + Math.sin(progress * Math.PI * 3) * 6;
    ctx.globalAlpha = (1 - progress) * 0.28;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================
// HARDCORE BOSS PHASE TRANSITION FX (HC-20)
// Visual celebration when boss changes phase
// ============================================================

function triggerBossPhaseTransitionFX(b, newPhase) {
  var target = b || boss;
  if (!target || !target.active) return false;

  target._hcPhaseFXActive = true;
  target._hcPhaseFXNewPhase = newPhase;
  target._hcPhaseFXTimer = (newPhase === 3) ? 900 : 700;
  target._hcPhaseFXDuration = target._hcPhaseFXTimer;

  if (typeof pushScreenShake === 'function') {
    pushScreenShake(newPhase === 3 ? 'heavy' : 'medium', newPhase === 3 ? 18 : 12);
  }
  if (typeof sfxBossWarning === 'function') sfxBossWarning();
  if (typeof requestBossMinorDuck === 'function') requestBossMinorDuck(200, 0.60);

  return true;
}

function updateBossPhaseTransitionFX(b, dt) {
  var target = b || boss;
  if (!target || !target.active) return;
  if (!target._hcPhaseFXActive) return;

  target._hcPhaseFXTimer -= dt;
  if (target._hcPhaseFXTimer <= 0) {
    target._hcPhaseFXActive = false;
    target._hcPhaseFXTimer = 0;
  }
}

function drawBossPhaseTransitionFX(ctx, b) {
  if (!ctx) return;
  var target = b || boss;
  if (!target || !target.active) return;
  if (!target._hcPhaseFXActive) return;

  var timer = target._hcPhaseFXTimer;
  var duration = target._hcPhaseFXDuration || 700;
  var progress = 1 - (timer / duration);
  progress = Math.max(0, Math.min(1, progress));
  var newPhase = target._hcPhaseFXNewPhase || 2;
  var color = newPhase === 3 ? '#ff5533' : '#ffaa22';

  var cx = target.x + (target.w || 90) / 2;
  var cy = target.y + (target.h || 45) / 2;
  var W = typeof window !== 'undefined' && window.W ? window.W : 480;
  var H = typeof window !== 'undefined' && window.H ? window.H : 720;

  ctx.save();

  // Phase text
  if (progress < 0.6) {
    var textAlpha = (1 - progress / 0.6) * 1.0;
    var textY = cy - 60 - progress * 40;
    ctx.globalAlpha = Math.min(1, textAlpha);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = color;
    ctx.fillText(newPhase === 3 ? 'FINAL PHASE' : 'PHASE ' + newPhase, cx, textY);

    // Subtle shadow
    ctx.globalAlpha = textAlpha * 0.35;
    ctx.fillStyle = '#000';
    ctx.fillText(newPhase === 3 ? 'FINAL PHASE' : 'PHASE ' + newPhase, cx + 1, textY + 1);
  }

  // Expanding ring flash
  var ringProgress = Math.min(1, progress * 1.4);
  var ringAlpha = (1 - ringProgress) * 0.65;
  var maxRing = Math.max(W, H) * 0.7;
  var ringR = 30 + ringProgress * maxRing;
  ctx.globalAlpha = ringAlpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Second ring (delayed)
  var ring2Progress = Math.max(0, Math.min(1, (progress - 0.15) * 1.4));
  if (ring2Progress > 0) {
    var ring2Alpha = (1 - ring2Progress) * 0.40;
    var ring2R = 25 + ring2Progress * maxRing * 0.75;
    ctx.globalAlpha = ring2Alpha;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ring2R, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Boss glow intensification
  var glowAlpha = 0.12;
  if (progress < 0.3) {
    glowAlpha = 0.12 + (1 - progress / 0.3) * 0.20;
  }
  ctx.globalAlpha = glowAlpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(target.w, target.h) * 0.9, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ============================================================
// HARDCORE SERPENTRIX PATTERN (second boss, zigzag, level 10)
// HC-22: foundation — stub only, attacks unchanged
// ============================================================

function isSecondHardcoreBoss(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (target.name === 'SERPENTRIX') return true;
  if (target.pattern === 'zigzag') return true;
  return false;
}

function shouldUseSerpentrixHardcorePattern(b) {
  if (!shouldUseHardcoreBossPatterns()) return false;
  if (!isSecondHardcoreBoss(b)) return false;
  return true;
}

function _markSerpentrixPatternMeta(b) {
  var target = b || boss;
  if (!target || !target.active) return;
  if (target._serpentrixPatternReady) return;

  target._serpentrixPatternReady = true;
  target._serpentrixPatternPhase = getBossPhaseSafe(target);
  if (target._serpentrixPatternTimer === undefined) target._serpentrixPatternTimer = 0;
}

function updateSerpentrixHardcorePattern(b, dt) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  // HC-22: initialize metadata (idempotent)
  _markSerpentrixPatternMeta(target);

  var phase = getBossPhaseSafe(target);
  var center = getBossCenter(target);
  var speed = 2.8;
  if (typeof getDifficultySettings === 'function') {
    var s = getDifficultySettings(typeof level === 'number' ? level : 10);
    if (s && typeof s.bulletSpeed === 'number') speed = s.bulletSpeed * 0.82;
  }

  // HC-23: per-cycle alternating state for phase 2
  if (target._serpentrixCycle === undefined) target._serpentrixCycle = 0;
  target._serpentrixCycle++;

  if (phase === 1) {
    // HC-23: Phase 1 — wide poison fan (5 bullets, clear gaps)
    var fanCount = 5;
    for (var i = 0; i < fanCount; i++) {
      var spread = -0.75 + (1.5 * i / (fanCount - 1)); // ±43° spread
      pushEnemyBullet(center.x - 2, target.y + target.h, Math.sin(spread) * speed, Math.cos(spread) * speed, 5, 12, {
        kind: 'basic',
        color: '#44dd44',
        sourceType: 'boss_serpentrix'
      });
    }
    if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    return true;
  }

  if (phase === 2) {
    // HC-23: Phase 2 — alternating: aimed burst vs mines
    if (target._serpentrixCycle % 2 === 0) {
      // Aimed burst (2 bullets toward player with stagger)
      if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'phase2_burst', 320);
      var angle = getAngleFromBossToPlayer(target);
      var burstSpeed = speed * 1.05;
      var delays = [0, 110];

      for (var j = 0; j < delays.length; j++) {
        (function(delay, a, spd) {
          var sx = center.x;
          var sy = target.y + target.h;
          setTimeout(function() {
            if (!target.active) return;
            pushEnemyBullet(sx - 3, sy, Math.cos(a) * spd, Math.sin(a) * spd, 6, 10, {
              kind: 'crossfire_a',
              color: '#44ee44',
              sourceType: 'boss_serpentrix'
            });
            if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
          }, delay);
        })(delays[j], angle, burstSpeed);
      }
      if (typeof sfxBossWarning === 'function') sfxBossWarning();
    } else {
      // Deploy 2 mines (slow, forces repositioning)
      if (typeof mines !== 'undefined') {
        var maxMines = typeof minesMax !== 'undefined' ? minesMax : 8;
        if (mines.length < maxMines) {
          mines.push({
            x: center.x - 20,
            y: target.y + target.h,
            radius: 13,
            vy: 0.45,
            life: 16000,
            pulseTime: 0
          });
        }
        if (mines.length < maxMines) {
          mines.push({
            x: center.x + 20,
            y: target.y + target.h,
            radius: 13,
            vy: 0.45,
            life: 16000,
            pulseTime: 0
          });
        }
        if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
      }
    }
    return true;
  }

  if (phase === 3) {
    // HC-23: Phase 3 — serpent double-fan (8 bullets, sinusoidal spread)
    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'phase3_radial', 420);

    var arcCount = 8;
    var time = typeof globalTime === 'number' ? globalTime : 0;
    var serpentWave = Math.sin(time * 0.003) * 0.25;

    for (var k = 0; k < arcCount; k++) {
      var baseSpread = -0.9 + (1.8 * k / (arcCount - 1)); // ±52° spread
      var waveSpread = baseSpread + serpentWave;
      pushEnemyBullet(center.x - 2, target.y + target.h, Math.sin(waveSpread) * speed, Math.cos(waveSpread) * speed, 5, 10, {
        kind: 'basic',
        color: '#22cc22',
        sourceType: 'boss_serpentrix'
      });
    }

    if (typeof pushScreenShake === 'function') pushScreenShake('light', 3);
    if (typeof sfxBigExplosion === 'function') sfxBigExplosion();
    if (typeof requestBossMinorDuck === 'function') requestBossMinorDuck(140, 0.58);
    return true;
  }

  return false;
}
