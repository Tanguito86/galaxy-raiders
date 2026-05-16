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
  return Math.min(4.5, speed);
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
    var count = Math.min(14, 8); // down from 12 — wider gaps at level 5
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
  generic_warning: '#ffdd44',
  // HC-24: Serpentrix green-themed telegraphs
  serpent_burst: '#44ee44',
  serpent_mine:  '#33cc33',
  serpent_arc:   '#22aa22',
  // HC-54: Orbital blue/violet telegraphs
  orbital_arc:   '#4488ff',
  // HC-61: Teniente red/orange telegraphs
  teniente_dive: '#ff5533',
  // HC-67: Emperador purple/gold telegraphs
  emperador_spread: '#bb88ff'
};

function triggerBossTelegraph(b, type, duration) {
  var target = b || boss;
  if (!target || !target.active) return false;

  var dur = Math.max(220, (typeof duration === 'number') ? duration : 380);
  target._hcTelegraphType = type;
  target._hcTelegraphTimer = dur;
  target._hcTelegraphDuration = dur;

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
  speed = Math.min(4.2, speed);

  // HC-23: per-cycle alternating state for phase 2
  if (target._serpentrixCycle === undefined) target._serpentrixCycle = 0;
  target._serpentrixCycle++;

  if (phase === 1) {
    // HC-24: Phase 1 — wide poison fan (5 bullets, clear gaps)
    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'serpent_burst', 220);
    var fanCount = 5;
    var fanSpeed = speed * 0.88; // slightly slower for readability
    for (var i = 0; i < fanCount; i++) {
      var spread = -0.75 + (1.5 * i / (fanCount - 1)); // ±43° spread
      pushEnemyBullet(center.x - 2, target.y + target.h, Math.sin(spread) * fanSpeed, Math.cos(spread) * fanSpeed, 5, 12, {
        kind: 'basic',
        color: '#44dd44',
        sourceType: 'boss_serpentrix'
      });
    }
    if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    return true;
  }

  if (phase === 2) {
    // HC-24: Phase 2 — alternating: aimed burst vs mine pressure
    if (target._serpentrixCycle % 2 === 0) {
      // Aimed burst (2 bullets toward player, telegraph first)
      if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'serpent_burst', 380);
      var angle = getAngleFromBossToPlayer(target);
      var burstSpeed = speed; // no multiplier — consistent speed
      var delays = [0, 120]; // wider stagger than phase 1 Cranckton

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
      // HC-24: Deploy 1 mine (control pressure, not screen fill)
      if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'serpent_mine', 300);
      if (typeof mines !== 'undefined') {
        var maxMines = Math.min(6, (typeof mines !== 'undefined' && Array.isArray(mines)) ? 6 : 6); // hard cap at 6
        if (mines.length < maxMines) {
          mines.push({
            x: center.x - 14,
            y: target.y + target.h,
            radius: 12,
            vy: 0.42,
            life: Math.min(10000, 10000), // capped at 10s
            pulseTime: 0
          });
        }
        if (mines.length < maxMines) {
          mines.push({
            x: center.x + 14,
            y: target.y + target.h,
            radius: 12,
            vy: 0.42,
            life: Math.min(10000, 10000),
            pulseTime: 0
          });
        }
        if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
      }
    }
    return true;
  }

  if (phase === 3) {
    // HC-24: Phase 3 — serpent double-fan (8 bullets, readable wave)
    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'serpent_arc', 450);

    var arcCount = Math.min(12, 8);
    var time = typeof globalTime === 'number' ? globalTime : 0;
    var serpentWave = Math.sin(time * 0.0025) * 0.18; // subtler wave, clearer gaps
    var arcSpeed = speed * 0.84; // slightly slower for dodge windows

    for (var k = 0; k < arcCount; k++) {
      var baseSpread = -0.78 + (1.56 * k / (arcCount - 1)); // ±45° — wider gaps
      var waveSpread = baseSpread + serpentWave;
      pushEnemyBullet(center.x - 2, target.y + target.h, Math.sin(waveSpread) * arcSpeed, Math.cos(waveSpread) * arcSpeed, 5, 10, {
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

// ============================================================
// HARDCORE ORBITAL PATTERN (third boss, rotate, level 15)
// HC-53: foundation only — metadata + guard, no pattern override yet
// ============================================================

function isThirdHardcoreBoss(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (target.name === 'ORBITAL') return true;
  if (target.pattern === 'rotate') return true;
  return false;
}

function shouldUseThirdBossHardcorePattern(b) {
  if (!shouldUseHardcoreBossPatterns()) return false;
  if (!isThirdHardcoreBoss(b)) return false;
  return true;
}

function _markOrbitalPatternMeta(b) {
  var target = b || boss;
  if (!target || !target.active) return;
  if (target._orbitalPatternReady) return;

  target._orbitalPatternReady = true;
  target._orbitalPatternPhase = getBossPhaseSafe(target);
  if (target._orbitalPatternTimer === undefined) target._orbitalPatternTimer = 0;
  if (target._orbitalPatternSeed === undefined) target._orbitalPatternSeed = Math.random() * 1000;
}

function updateThirdBossHardcorePattern(b, dt) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  _markOrbitalPatternMeta(target);

  var phase = getBossPhaseSafe(target);

  // HC-54: Phase 1 — orbital aimed partial ring (6 bullets, 180° arc toward player)
  if (phase === 1) {
    var center = getBossCenter(target);
    var speed = _orbitalBulletSpeed();
    var arcCount = 6;
    var arcSpan = 2.4; // ~137° — slightly narrower for cleaner gaps
    var angleToPlayer = getAngleFromBossToPlayer(target);

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'orbital_arc', 340);

    for (var i = 0; i < arcCount; i++) {
      var t = arcCount > 1 ? i / (arcCount - 1) : 0.5;
      var a = angleToPlayer - arcSpan / 2 + t * arcSpan;
      pushEnemyBullet(center.x - 2, center.y, Math.cos(a) * speed, Math.sin(a) * speed, 5, 9, {
        kind: 'basic',
        color: '#5588ee',
        sourceType: 'boss_orbital'
      });
    }

    if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    return true;
  }

  // HC-55: Phase 2 — alternating left/right mini-arcs (4 bullets each, clear central gap)
  if (phase === 2) {
    var center2 = getBossCenter(target);
    var speed2 = _orbitalBulletSpeed() * 0.88;
    var angleToPlayer2 = getAngleFromBossToPlayer(target);

    if (target._orbitalArcSide === undefined) target._orbitalArcSide = 0;
    target._orbitalArcSide = 1 - target._orbitalArcSide; // toggle 0↔1

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'orbital_arc', 380);

    var arcCount = 4;
    var arcSpan = 0.52; // ~30° mini-arc
    var sideOffset = 0.48; // ~27.5° from center — clear middle gap
    var baseAngle = angleToPlayer2 + (target._orbitalArcSide === 0 ? -sideOffset : sideOffset);
    var color = '#4477dd'; // deeper blue for phase 2

    for (var j = 0; j < arcCount; j++) {
      var tj = arcCount > 1 ? j / (arcCount - 1) : 0.5;
      var aj = baseAngle - arcSpan / 2 + tj * arcSpan;
      pushEnemyBullet(center2.x - 2, center2.y, Math.cos(aj) * speed2, Math.sin(aj) * speed2, 5, 9, {
        kind: 'basic',
        color: color,
        sourceType: 'boss_orbital'
      });
    }

    if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    return true;
  }

  // HC-56: Phase 3 — rotating double arc (2 opposite arcs, 4 bullets each, slow rotation)
  if (phase === 3) {
    var center3 = getBossCenter(target);
    var speed3 = Math.min(3.2, _orbitalBulletSpeed());
    if (target._orbitalPhase3Angle === undefined) target._orbitalPhase3Angle = 0;
    target._orbitalPhase3Angle += 0.32; // slow rotation per volley (~18°)

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'orbital_arc', 420);

    var arcCount3 = Math.min(4, 4); // 4 bullets per arc (clamped)
    var arcSpan3 = 0.48; // ~27.5° per mini-arc
    var baseAngle3 = target._orbitalPhase3Angle;
    var color3 = '#3366ff'; // bright blue for phase 3

    // Arc 1: at baseAngle
    for (var k = 0; k < arcCount3; k++) {
      var tk = arcCount3 > 1 ? k / (arcCount3 - 1) : 0.5;
      var ak = baseAngle3 - arcSpan3 / 2 + tk * arcSpan3;
      pushEnemyBullet(center3.x - 2, center3.y, Math.cos(ak) * speed3, Math.sin(ak) * speed3, 5, 9, {
        kind: 'basic',
        color: color3,
        sourceType: 'boss_orbital'
      });
    }

    // Arc 2: opposite — at baseAngle + π
    var oppositeAngle3 = baseAngle3 + Math.PI;
    for (var m = 0; m < arcCount3; m++) {
      var tm = arcCount3 > 1 ? m / (arcCount3 - 1) : 0.5;
      var am = oppositeAngle3 - arcSpan3 / 2 + tm * arcSpan3;
      pushEnemyBullet(center3.x - 2, center3.y, Math.cos(am) * speed3, Math.sin(am) * speed3, 5, 9, {
        kind: 'basic',
        color: color3,
        sourceType: 'boss_orbital'
      });
    }

    if (typeof sfxBossWarning === 'function') sfxBossWarning();
    if (typeof pushScreenShake === 'function') pushScreenShake('light', 2);
    return true;
  }

  // Fallback: should not reach here
  return false;
}

function _orbitalBulletSpeed() {
  var speed = 2.6;
  if (typeof getDifficultySettings === 'function') {
    var s = getDifficultySettings(typeof level === 'number' ? level : 15);
    if (s && typeof s.bulletSpeed === 'number') speed = s.bulletSpeed * 0.78;
  }
  speed = Math.min(4.0, speed);
  return speed;
}

// ============================================================
// HARDCORE TENIENTE PATTERN (fourth boss, divebomb, level 19)
// HC-60: foundation only — metadata + guard, no pattern override yet
// ============================================================

function isFourthHardcoreBoss(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (target.name === 'TENIENTE') return true;
  if (target.pattern === 'divebomb') return true;
  return false;
}

function shouldUseFourthBossHardcorePattern(b) {
  if (!shouldUseHardcoreBossPatterns()) return false;
  if (!isFourthHardcoreBoss(b)) return false;
  return true;
}

function _markTenientePatternMeta(b) {
  var target = b || boss;
  if (!target || !target.active) return;
  if (target._tenientePatternReady) return;

  target._tenientePatternReady = true;
  target._tenientePatternPhase = getBossPhaseSafe(target);
  if (target._tenientePatternTimer === undefined) target._tenientePatternTimer = 0;
  if (target._tenientePatternSeed === undefined) target._tenientePatternSeed = Math.random() * 1000;
}

function updateFourthBossHardcorePattern(b, dt) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (typeof pushEnemyBullet !== 'function') return false;

  _markTenientePatternMeta(target);

  var phase = getBossPhaseSafe(target);

  // HC-61: Phase 1 — aimed slow vertical burst (3 bullets, wide vertical bias, clear gaps)
  if (phase === 1) {
    var center = getBossCenter(target);
    var speed = Math.min(3.5, _tenienteBulletSpeed() * 0.94);
    var angleToPlayer = getAngleFromBossToPlayer(target);
    var downBias = Math.PI / 2;
    var maxDeviation = 0.55;
    var clampedAngle = angleToPlayer;
    if (clampedAngle < downBias - maxDeviation) clampedAngle = downBias - maxDeviation;
    if (clampedAngle > downBias + maxDeviation) clampedAngle = downBias + maxDeviation;

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'teniente_dive', 380);

    var bulletCount = 3;
    var spread = 0.32;
    for (var i = 0; i < bulletCount; i++) {
      var t = bulletCount > 1 ? i / (bulletCount - 1) : 0.5;
      var a = clampedAngle - spread / 2 + t * spread;
      pushEnemyBullet(center.x - 2, target.y + target.h, Math.cos(a) * speed, Math.sin(a) * speed, 5, 10, {
        kind: 'basic',
        color: '#ff5533',
        sourceType: 'boss_teniente'
      });
    }

    if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    return true;
  }

  // HC-62: Phase 2 — double dive lane: 2 columns, one aimed near player, one lateral closure
  if (phase === 2) {
    var center2 = getBossCenter(target);
    var speed2 = Math.min(3.5, _tenienteBulletSpeed() * 0.88);
    var angleToPlayer2 = getAngleFromBossToPlayer(target);
    var downBias2 = Math.PI / 2;
    var maxDeviation2 = 0.55;
    var clampedAngle2 = angleToPlayer2;
    if (clampedAngle2 < downBias2 - maxDeviation2) clampedAngle2 = downBias2 - maxDeviation2;
    if (clampedAngle2 > downBias2 + maxDeviation2) clampedAngle2 = downBias2 + maxDeviation2;

    // Toggle lateral side per volley
    if (target._tenienteLaneSide === undefined) target._tenienteLaneSide = 0;
    target._tenienteLaneSide = 1 - target._tenienteLaneSide;
    var laneOffset = 48; // lateral offset — wider for clearer gaps
    var laneX = (target._tenienteLaneSide === 0) ? center2.x - laneOffset : center2.x + laneOffset;

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'teniente_dive', 420);

    var colCount = 3;
    var spread2 = 0.34;
    var color2 = '#ee4422'; // deeper red for phase 2

    // Column 1: aimed near player (center)
    for (var j = 0; j < colCount; j++) {
      var tj = colCount > 1 ? j / (colCount - 1) : 0.5;
      var aj = clampedAngle2 - spread2 / 2 + tj * spread2;
      pushEnemyBullet(center2.x - 2, target.y + target.h, Math.cos(aj) * speed2, Math.sin(aj) * speed2, 5, 10, {
        kind: 'basic',
        color: color2,
        sourceType: 'boss_teniente'
      });
    }

    // Column 2: lateral closure (same angle, offset horizontally)
    for (var k = 0; k < colCount; k++) {
      var tk = colCount > 1 ? k / (colCount - 1) : 0.5;
      var ak2 = clampedAngle2 - spread2 / 2 + tk * spread2;
      pushEnemyBullet(laneX - 2, target.y + target.h, Math.cos(ak2) * speed2, Math.sin(ak2) * speed2, 5, 10, {
        kind: 'basic',
        color: color2,
        sourceType: 'boss_teniente'
      });
    }

    if (typeof sfxBossWarning === 'function') sfxBossWarning();
    return true;
  }

  // HC-63: Phase 3 — aggressive dive crossfire: 2 lateral columns + 1 aimed center burst (max 7 bullets)
  if (phase === 3) {
    var center3 = getBossCenter(target);
    var speed3 = Math.min(3.5, _tenienteBulletSpeed() * 0.85);
    var angleToPlayer3 = getAngleFromBossToPlayer(target);
    var downBias3 = Math.PI / 2;
    var maxDeviation3 = 0.55;
    var clampedAngle3 = angleToPlayer3;
    if (clampedAngle3 < downBias3 - maxDeviation3) clampedAngle3 = downBias3 - maxDeviation3;
    if (clampedAngle3 > downBias3 + maxDeviation3) clampedAngle3 = downBias3 + maxDeviation3;

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'teniente_dive', 450);

    var color3 = '#dd3311'; // bright red for phase 3
    var laneOff3 = 38; // lateral column offset

    // Center burst: 3 bullets aimed at player
    for (var i = 0; i < 3; i++) {
      var ti = 2 > 0 ? i / 2 : 0.5;
      var ai = clampedAngle3 - 0.28 / 2 + ti * 0.28;
      pushEnemyBullet(center3.x - 2, target.y + target.h, Math.cos(ai) * speed3, Math.sin(ai) * speed3, 5, 10, {
        kind: 'basic',
        color: color3,
        sourceType: 'boss_teniente'
      });
    }

    // Left column: 2 bullets
    for (var j = 0; j < 2; j++) {
      var tj = 1 > 0 ? j / 1 : 0.5;
      var aj = clampedAngle3 - 0.24 / 2 + tj * 0.24;
      pushEnemyBullet(center3.x - laneOff3 - 2, target.y + target.h, Math.cos(aj) * speed3, Math.sin(aj) * speed3, 5, 10, {
        kind: 'basic',
        color: color3,
        sourceType: 'boss_teniente'
      });
    }

    // Right column: 2 bullets
    for (var k = 0; k < 2; k++) {
      var tk = 1 > 0 ? k / 1 : 0.5;
      var ak = clampedAngle3 - 0.24 / 2 + tk * 0.24;
      pushEnemyBullet(center3.x + laneOff3 - 2, target.y + target.h, Math.cos(ak) * speed3, Math.sin(ak) * speed3, 5, 10, {
        kind: 'basic',
        color: color3,
        sourceType: 'boss_teniente'
      });
    }

    if (typeof sfxBossWarning === 'function') sfxBossWarning();
    if (typeof pushScreenShake === 'function') pushScreenShake('light', 3);
    return true;
  }

  return false;
}

function _tenienteBulletSpeed() {
  var speed = 2.2;
  if (typeof getDifficultySettings === 'function') {
    var s = getDifficultySettings(typeof level === 'number' ? level : 19);
    if (s && typeof s.bulletSpeed === 'number') speed = s.bulletSpeed * 0.72;
  }
  return Math.min(3.5, speed);
}

// ============================================================
// HARDCORE EMPERADOR PATTERN (fifth boss, supreme, level 20)
// HC-66: foundation only — metadata + guard, no pattern override yet
// ============================================================

function isFifthHardcoreBoss(b) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (target.name === 'EMPERADOR') return true;
  if (target.pattern === 'supreme') return true;
  return false;
}

function shouldUseFifthBossHardcorePattern(b) {
  if (!shouldUseHardcoreBossPatterns()) return false;
  if (!isFifthHardcoreBoss(b)) return false;
  return true;
}

function _markEmperadorPatternMeta(b) {
  var target = b || boss;
  if (!target || !target.active) return;
  if (target._emperadorPatternReady) return;

  target._emperadorPatternReady = true;
  target._emperadorPatternPhase = getBossPhaseSafe(target);
  if (target._emperadorPatternTimer === undefined) target._emperadorPatternTimer = 0;
  if (target._emperadorPatternSeed === undefined) target._emperadorPatternSeed = Math.random() * 1000;
}

function updateFifthBossHardcorePattern(b, dt) {
  var target = b || boss;
  if (!target || !target.active) return false;
  if (typeof pushEnemyBullet !== 'function') return false;
  if (target.isTeleporting) return false; // no shoot during teleport

  _markEmperadorPatternMeta(target);

  var phase = getBossPhaseSafe(target);

  // HC-67: Phase 1 — wide imperial spread (7 bullets, wide fan, slow speed, clear gaps)
  if (phase === 1) {
    var center = getBossCenter(target);
    var speed = Math.min(3.6, _emperadorBulletSpeed() * 0.92);
    var downBias = Math.PI / 2;
    var arcCount = 7;
    var arcSpan = 1.3; // ~74° — tighter imperial fan, cleaner gaps

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'emperador_spread', 440);

    for (var i = 0; i < arcCount; i++) {
      var t = arcCount > 1 ? i / (arcCount - 1) : 0.5;
      var a = downBias - arcSpan / 2 + t * arcSpan;
      pushEnemyBullet(center.x - 2, target.y + target.h, Math.cos(a) * speed, Math.sin(a) * speed, 5, 12, {
        kind: 'basic',
        color: '#aa77dd',
        sourceType: 'boss_emperador'
      });
    }

    if (typeof sfxImperialTelegraph === 'function') sfxImperialTelegraph();
    return true;
  }

  // HC-68: Phase 2 — imperial cross pressure (5 aimed spread + 2 delayed lateral, max 7)
  if (phase === 2) {
    var center2 = getBossCenter(target);
    var speed2 = Math.min(3.6, _emperadorBulletSpeed() * 0.86);
    var angleToPlayer2 = getAngleFromBossToPlayer(target);
    var downBias2 = Math.PI / 2;
    var clampedAngle2 = angleToPlayer2;
    if (clampedAngle2 < downBias2 - 0.5) clampedAngle2 = downBias2 - 0.5;
    if (clampedAngle2 > downBias2 + 0.5) clampedAngle2 = downBias2 + 0.5;

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'emperador_spread', 480);

    var color2 = '#9966dd'; // deeper purple for phase 2

    // Aimed spread: 5 bullets
    var aimCount = 5;
    var aimSpan = 0.8; // ~46° aimed fan
    for (var i = 0; i < aimCount; i++) {
      var ti = aimCount > 1 ? i / (aimCount - 1) : 0.5;
      var ai = clampedAngle2 - aimSpan / 2 + ti * aimSpan;
      pushEnemyBullet(center2.x - 2, target.y + target.h, Math.cos(ai) * speed2, Math.sin(ai) * speed2, 5, 10, {
        kind: 'crossfire_a',
        color: color2,
        sourceType: 'boss_emperador'
      });
    }

    // Lateral delayed: 2 bullets, one left one right, delayed 150ms
    var latAngle = downBias2;
    var latOffset = 60;
    var latDelay = 150;
    var sx = center2.x;
    var sy = target.y + target.h;
    (function(cx, cy, spd, col) {
      setTimeout(function() {
        if (!target.active || target.isTeleporting) return;
        pushEnemyBullet(cx - latOffset - 2, cy, Math.cos(latAngle) * spd, Math.sin(latAngle) * spd, 5, 10, {
          kind: 'crossfire_b',
          color: col,
          sourceType: 'boss_emperador'
        });
        pushEnemyBullet(cx + latOffset - 2, cy, Math.cos(latAngle) * spd, Math.sin(latAngle) * spd, 5, 10, {
          kind: 'crossfire_b',
          color: col,
          sourceType: 'boss_emperador'
        });
      }, latDelay);
    })(sx, sy, speed2 * 0.78, color2);

    if (typeof sfxBossWarning === 'function') sfxBossWarning();
    return true;
  }

  // HC-69: Phase 3 — imperial final decree (5 aimed + 4 outer delayed, max 9 bullets)
  if (phase === 3) {
    var center3 = getBossCenter(target);
    var speed3 = Math.min(3.6, _emperadorBulletSpeed() * 0.86);
    var angleToPlayer3 = getAngleFromBossToPlayer(target);
    var downBias3 = Math.PI / 2;
    var clampedAngle3 = angleToPlayer3;
    if (clampedAngle3 < downBias3 - 0.5) clampedAngle3 = downBias3 - 0.5;
    if (clampedAngle3 > downBias3 + 0.5) clampedAngle3 = downBias3 + 0.5;

    if (typeof triggerBossTelegraph === 'function') triggerBossTelegraph(target, 'emperador_spread', 520);

    var color3 = '#9977ee'; // imperial gold-purple for final phase

    // Aimed spread: 5 bullets
    var aimCount3 = 5;
    var aimSpan3 = 0.85;
    for (var i = 0; i < aimCount3; i++) {
      var ti = aimCount3 > 1 ? i / (aimCount3 - 1) : 0.5;
      var ai = clampedAngle3 - aimSpan3 / 2 + ti * aimSpan3;
      pushEnemyBullet(center3.x - 2, target.y + target.h, Math.cos(ai) * speed3, Math.sin(ai) * speed3, 5, 10, {
        kind: 'crossfire_a',
        color: color3,
        sourceType: 'boss_emperador'
      });
    }

    // Outer delayed: 4 bullets (2 left, 2 right) at 200ms delay
    var latAngle3 = downBias3;
    var latOffsets3 = [54, 76]; // two distances per side
    var latDelay3 = 200;
    var sx3 = center3.x;
    var sy3 = target.y + target.h;
    (function(cx, cy, spd, col, offsets) {
      setTimeout(function() {
        if (!target.active || target.isTeleporting) return;
        for (var oi = 0; oi < offsets.length; oi++) {
          var off = offsets[oi];
          pushEnemyBullet(cx - off - 2, cy, Math.cos(latAngle3) * spd, Math.sin(latAngle3) * spd, 5, 10, {
            kind: 'crossfire_b',
            color: col,
            sourceType: 'boss_emperador'
          });
          pushEnemyBullet(cx + off - 2, cy, Math.cos(latAngle3) * spd, Math.sin(latAngle3) * spd, 5, 10, {
            kind: 'crossfire_b',
            color: col,
            sourceType: 'boss_emperador'
          });
        }
      }, latDelay3);
    })(sx3, sy3, speed3 * 0.72, color3, latOffsets3);

    if (typeof sfxBossWarning === 'function') sfxBossWarning();
    if (typeof pushScreenShake === 'function') pushScreenShake('medium', 5);
    return true;
  }

  return false;
}

function _emperadorBulletSpeed() {
  var speed = 2.0;
  if (typeof getDifficultySettings === 'function') {
    var s = getDifficultySettings(typeof level === 'number' ? level : 20);
    if (s && typeof s.bulletSpeed === 'number') speed = s.bulletSpeed * 0.65;
  }
  return Math.min(3.6, speed);
}

// ============================================================
// HC-72: FULL BOSS HARDCORE REGISTRY
// Central lookup for all hardcore-converted bosses
// ============================================================

window.HARDCORE_BOSS_REGISTRY = [
  {
    id: 1,
    name: 'CRABTRON',
    pattern: 'crossfire',
    level: 5,
    isEnabled: function() {
      return typeof shouldUseCrancktonHardcorePattern === 'function' && shouldUseCrancktonHardcorePattern(boss);
    },
    updateFnName: 'fireCrancktonHardcorePattern',
    phaseCount: 3
  },
  {
    id: 2,
    name: 'SERPENTRIX',
    pattern: 'zigzag',
    level: 10,
    isEnabled: function() {
      return typeof shouldUseSerpentrixHardcorePattern === 'function' && shouldUseSerpentrixHardcorePattern(boss);
    },
    updateFnName: 'updateSerpentrixHardcorePattern',
    phaseCount: 3
  },
  {
    id: 3,
    name: 'ORBITAL',
    pattern: 'rotate',
    level: 15,
    isEnabled: function() {
      return typeof shouldUseThirdBossHardcorePattern === 'function' && shouldUseThirdBossHardcorePattern(boss);
    },
    updateFnName: 'updateThirdBossHardcorePattern',
    phaseCount: 3
  },
  {
    id: 4,
    name: 'TENIENTE',
    pattern: 'divebomb',
    level: 19,
    isEnabled: function() {
      return typeof shouldUseFourthBossHardcorePattern === 'function' && shouldUseFourthBossHardcorePattern(boss);
    },
    updateFnName: 'updateFourthBossHardcorePattern',
    phaseCount: 3
  },
  {
    id: 5,
    name: 'EMPERADOR',
    pattern: 'supreme',
    level: 20,
    isEnabled: function() {
      return typeof shouldUseFifthBossHardcorePattern === 'function' && shouldUseFifthBossHardcorePattern(boss);
    },
    updateFnName: 'updateFifthBossHardcorePattern',
    phaseCount: 3
  }
];

window.getHardcoreBossRegistry = function() {
  return window.HARDCORE_BOSS_REGISTRY;
};

window.getHardcoreBossId = function(b) {
  var target = b || boss;
  if (!target) return -1;
  var reg = window.HARDCORE_BOSS_REGISTRY;
  for (var i = 0; i < reg.length; i++) {
    if (target.pattern === reg[i].pattern) return reg[i].id;
    if (target.name === reg[i].name) return reg[i].id;
  }
  return -1;
};

// ============================================================
// HC-74: BOSS REGISTRY DISPATCH
// Central dispatcher — routes to correct hardcore update per boss
// ============================================================

window.updateHardcoreBossPatternFromRegistry = function(b, dt) {
  var target = b || boss;
  if (!target) return false;

  var bossId = window.getHardcoreBossId(target);
  if (bossId <= 0) {
    if (target) target._hcDispatchConsumed = false;
    return false;
  }

  var result = false;

  switch (bossId) {
    case 1: // CRABTRON / crossfire
      if (typeof shouldUseCrancktonHardcorePattern === 'function' && shouldUseCrancktonHardcorePattern(target)) {
        if (typeof fireCrancktonHardcorePattern === 'function') {
          result = fireCrancktonHardcorePattern(target);
        }
      }
      break;

    case 2: // SERPENTRIX / zigzag
      if (typeof shouldUseSerpentrixHardcorePattern === 'function' && shouldUseSerpentrixHardcorePattern(target)) {
        if (typeof updateSerpentrixHardcorePattern === 'function') {
          result = updateSerpentrixHardcorePattern(target, dt);
        }
      }
      break;

    case 3: // ORBITAL / rotate
      if (typeof shouldUseThirdBossHardcorePattern === 'function' && shouldUseThirdBossHardcorePattern(target)) {
        if (typeof updateThirdBossHardcorePattern === 'function') {
          result = updateThirdBossHardcorePattern(target, dt);
        }
      }
      break;

    case 4: // TENIENTE / divebomb
      if (typeof shouldUseFourthBossHardcorePattern === 'function' && shouldUseFourthBossHardcorePattern(target)) {
        if (typeof updateFourthBossHardcorePattern === 'function') {
          result = updateFourthBossHardcorePattern(target, dt);
        }
      }
      break;

    case 5: // EMPERADOR / supreme
      if (typeof shouldUseFifthBossHardcorePattern === 'function' && shouldUseFifthBossHardcorePattern(target)) {
        if (typeof updateFifthBossHardcorePattern === 'function') {
          result = updateFifthBossHardcorePattern(target, dt);
        }
      }
      break;

    default:
      break;
  }

  target._hcDispatchConsumed = result;
  return result;
};
