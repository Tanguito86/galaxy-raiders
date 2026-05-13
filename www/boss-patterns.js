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
