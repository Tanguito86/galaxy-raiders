// =====================
// GALAXY RAIDERS - medals.js (Medal Chain System v2)
// =====================

const MEDAL_VALUE_BASE = 100;
const MEDAL_VALUES = [100, 250, 500, 1000, 2000, 5000];
const MEDAL_BASE = 100;
const MEDAL_STEP = 50;
const MEDAL_MAX = 2000;
const MEDAL_DROP_CHANCE = 0.25;
const MEDAL_SIZE = 14;
const MEDAL_VY = 1.2;
const MAGNET_RADIUS = 60;
const MAGNET_FORCE = 0.06;
const MEDAL_OFFSCREEN_MARGIN = 24;
const MEDAL_ELITE_TYPES = {
  alien3: true,
  alien5: true,
  alien6: true
};

const MEDAL_CHAPTER_COLORS = [
  { glow: '#ffe680', border: '#2b1600', outer: '#ffb000', inner: '#fff06a', core: '#9b5f00', cross: '#ffd966', highlight: '#fff8c6' },
  { glow: '#88ff88', border: '#003300', outer: '#00cc00', inner: '#66ff66', core: '#005500', cross: '#99ff99', highlight: '#ccffcc' },
  { glow: '#66bbff', border: '#001166', outer: '#0088ff', inner: '#66ccff', core: '#003388', cross: '#99ddff', highlight: '#cceeff' },
  { glow: '#bb88ff', border: '#110044', outer: '#7700ff', inner: '#aa66ff', core: '#440088', cross: '#cc99ff', highlight: '#eeccff' },
  { glow: '#ff7777', border: '#330000', outer: '#dd1100', inner: '#ff5555', core: '#880000', cross: '#ff8888', highlight: '#ffcccc' }
];

function getMedalChapterColors() {
  const chapter = Math.min(Math.ceil((level || 1) / 4), MEDAL_CHAPTER_COLORS.length) - 1;
  return MEDAL_CHAPTER_COLORS[Math.max(0, chapter)];
}

let medals = [];
let medalChain = 0;
let medalValue = MEDAL_VALUE_BASE;
let popups = [];

let waveDamageTaken = false;
let waveKills = 0;

let feverActive = false;
let feverUntil = 0;
let feverTriggeredForThisChain = false;

function isMedalFeverActive() {
  return feverActive;
}

function getMedalFeverTimeLeft() {
  if (!feverActive) return 0;
  return Math.max(0, Math.ceil((feverUntil - globalTime) / 1000));
}

function updateMedalFever() {
  if (!feverActive) return;
  if (globalTime >= feverUntil) {
    feverActive = false;
  }
}

function maybeActivateMedalFever() {
  if (feverActive) return;
  if (medalChain < 20) return;
  if (feverTriggeredForThisChain) return;

  feverActive = true;
  feverUntil = globalTime + 6000;
  feverTriggeredForThisChain = true;

  spawnPopup(W / 2, H / 2 - 50, 'FEVER!', '#ff3388');
  AudioEngine.playSfx('feverActivated');
}

function markWaveDamageTaken() {
  waveDamageTaken = true;
}

function markWaveEnemyKilled() {
  waveKills++;
}

function resetWavePerfectTracking() {
  waveDamageTaken = false;
  waveKills = 0;
}

function tryAwardPerfectWaveBonus() {
  if (waveDamageTaken || waveKills <= 0 || medalChain <= 0) return false;

  const bonus = medalChain * getCurrentMedalValue();
  awardScore({ points: bonus, source: 'perfectWave' });
  spawnPopup(W / 2, H / 2 - 30, 'PERFECT WAVE', '#ffee55');
  spawnPopup(W / 2, H / 2 - 8, '+' + bonus, '#ffee88');

  AudioEngine.playSfx('perfectWave');

  return true;
}

function getMedalChain() {
  return medalChain;
}

function getCurrentMedalValue() {
  const tier = Math.min(
    Math.floor(medalChain / 5),
    MEDAL_VALUES.length - 1
  );
  return MEDAL_VALUES[tier];
}

function resetMedalChain() {
  medalChain = 0;
  medalValue = MEDAL_VALUE_BASE;
  feverActive = false;
  feverTriggeredForThisChain = false;
}

function clearMedalDrops() {
  medals = [];
  popups = [];
}

function resetMedalSystemState() {
  clearMedalDrops();
  resetMedalChain();
}

function isEliteMedalTarget(enemy, enemyData) {
  if (!enemy) return false;
  if (enemy.isElite === true) return true;
  if (enemy.maxHp > 1) return true;
  if (MEDAL_ELITE_TYPES[enemy.type]) return true;
  if (enemyData && enemyData.points >= 70) return true;
  return false;
}

function spawnMedal(x, y, guaranteed = false, count = 1) {
  // HC-SC-07: anti-exploit cap
  if (typeof window.canDropMedal === 'function' && !window.canDropMedal()) return false;

  const safeCount = Math.max(1, Math.min(6, Math.floor(count || 1)));
  const baseChance = guaranteed ? 1 : MEDAL_DROP_CHANCE;
  const spawnChance = baseChance;
  let spawned = false;

  for (let i = 0; i < safeCount; i++) {
    if (Math.random() >= spawnChance) continue;

    const spread = (i - (safeCount - 1) * 0.5) * 4;
    medals.push({
      x: x - MEDAL_SIZE * 0.5 + spread,
      y: y - MEDAL_SIZE * 0.5,
      w: MEDAL_SIZE,
      h: MEDAL_SIZE,
      vx: (Math.random() - 0.5) * 0.7,
      vy: MEDAL_VY + Math.random() * 0.3
    });
    spawned = true;
  }

  return spawned;
}

function spawnBossMedalRain(boss, count = 8) {
  const cx = boss.x + boss.w * 0.5;
  const cy = boss.y + boss.h * 0.5;
  const ringCount = Math.min(count, 12);

  for (let i = 0; i < ringCount; i++) {
    const angle = (Math.PI * 2 * i) / ringCount + (Math.random() - 0.5) * 0.5;
    const radius = 18 + Math.random() * (Math.max(boss.w, boss.h) * 0.35);
    const mx = cx + Math.cos(angle) * radius;
    const my = cy + Math.sin(angle) * radius * 0.6;

    medals.push({
      x: mx - MEDAL_SIZE * 0.5,
      y: my - MEDAL_SIZE * 0.5,
      w: MEDAL_SIZE,
      h: MEDAL_SIZE,
      vx: (Math.random() - 0.5) * 1.2,
      vy: MEDAL_VY * 0.2 + Math.random() * 1.4
    });
  }

  AudioEngine.playSfx('bossMedalRain');
}

function spawnPopup(x, y, text, color = '#fff') {
  popups.push({
    x,
    y,
    text,
    color,
    alpha: 1,
    vy: 0.5,
    ttl: 60
  });
}

function updateMedals(playerRef, step = 1) {
  updateMedalFever();

  const p = getRect(playerRef || player);
  const playerMidX = p.x + p.w * 0.5;
  const playerMidY = p.y + p.h * 0.5;

  for (let i = medals.length - 1; i >= 0; i--) {
    const m = medals[i];
    const mx = m.x + m.w * 0.5;
    const my = m.y + m.h * 0.5;
    const dx = playerMidX - mx;
    const dy = playerMidY - my;
    const dist = Math.hypot(dx, dy);

    if (dist <= MAGNET_RADIUS && dist > 0.001) {
      const inv = 1 / dist;
      const targetVx = dx * inv * 4.2;
      const targetVy = dy * inv * 4.2;
      const pull = Math.min(1, MAGNET_FORCE * step);
      m.vx += (targetVx - m.vx) * pull;
      m.vy += (targetVy - m.vy) * pull;
    } else {
      m.vx += (0 - m.vx) * Math.min(1, 0.08 * step);
      m.vy += (MEDAL_VY - m.vy) * Math.min(1, 0.12 * step);
    }

    m.x += m.vx * step;
    m.y += m.vy * step;

    if (rectOverlap(m, p)) {
      const base = getCurrentMedalValue();
      const gained = feverActive ? base * 2 : base;
      awardScore({ points: gained, source: 'medal' });
      // HC-SC-07: multiplier gain + telemetry on pickup
      if (typeof window.applyMedalPickupBonus === 'function') window.applyMedalPickupBonus();
      medalChain += 1;

      const prevTier = Math.min(Math.floor((medalChain - 1) / 5), MEDAL_VALUES.length - 1);
      const newTier = Math.min(Math.floor(medalChain / 5), MEDAL_VALUES.length - 1);
      if (newTier > prevTier) {
        AudioEngine.playSfx('medalTierUp');
      }

      medalValue = getCurrentMedalValue();
      maybeActivateMedalFever();

      AudioEngine.playSfx('medalPickup', { chain: medalChain });

      const tx = m.x + m.w * 0.5;
      const ty = m.y + m.h * 0.5;
      spawnPopup(tx, ty, '+' + gained, '#ffd966');
      if (medalChain >= 2) {
        spawnPopup(tx, ty - 12, 'CHAIN x' + medalChain, '#9ee7ff');
      }

      medals.splice(i, 1);
      continue;
    }

    if (m.y > H + MEDAL_OFFSCREEN_MARGIN) {
      var prevTier = Math.min(Math.floor(medalChain / 5), MEDAL_VALUES.length - 1);
      if (prevTier > 0) {
        // HC-SC-07: recovery grace check before chain decay
        if (typeof window.isMedalRecoveryGraceActive === 'function' && window.isMedalRecoveryGraceActive()) {
          if (typeof window.recordMedalRecovery === 'function') window.recordMedalRecovery();
        } else {
          if (typeof window.applyMedalChainDecay === 'function') window.applyMedalChainDecay();
          else medalChain = Math.max(0, medalChain - 5);
          spawnPopup(m.x, H - 16, 'MEDAL DOWN', '#ff8866');
          AudioEngine.playSfx('medalDown');
        }
        if (typeof window.recordMedalChainMiss === 'function') window.recordMedalChainMiss();
      }
      medals.splice(i, 1);
    }
  }
}

// ============================================================
// HC-SC-07: ENHANCED MEDAL CHAIN
// ============================================================

var _hcMedalTelemetry = {
  pickups: 0,
  misses: 0,
  recoveries: 0,
  maxTier: 0,
  dropsThisWave: 0
};

var _hcMedalRecovery = {
  lastMissFrame: -999,
  totalFrames: 0
};

function _hcMedalReadConfig() {
  var cfg = getGalaxyConfig ? getGalaxyConfig() : {};
  var sc = cfg.scoreSystem || {};
  var ag = sc.aggression || {};
  var md = ag.medals || {};
  var ch = md.chain || {};
  var mp = md.multiplier || {};
  var ae = md.antiExploit || {};
  return {
    decayEnabled: ch.decayEnabled !== false,
    missTierLoss: ch.missTierLoss || 2,
    recoveryGraceFrames: ch.recoveryGraceFrames || 90,
    gainPerMedal: mp.gainPerMedal || 0.020,
    lossPerMiss: mp.lossPerMiss || 0.010,
    maxDropsPerWave: ae.maxDropsPerWave || 12
  };
}

// ============================================================
// ENHANCED CHAIN DROP — partial decay, not full reset
// ============================================================

window.applyMedalChainDecay = function() {
  var cfg = _hcMedalReadConfig();
  if (!cfg.decayEnabled) {
    medalChain = Math.max(0, medalChain - 5);
    medalValue = getCurrentMedalValue();
    return;
  }

  // HC-SC-07: partial decay — lose tier levels, not arbitrary steps
  var currentTier = Math.min(Math.floor(medalChain / 5), MEDAL_VALUES.length - 1);
  if (currentTier <= 0) return;

  var tiersToLose = Math.min(cfg.missTierLoss, currentTier);
  var newTier = Math.max(0, currentTier - tiersToLose);

  // Convert tier back to minimum chain count for that tier
  medalChain = newTier * 5;
  medalValue = getCurrentMedalValue();
  _hcMedalTelemetry.misses++;
};

// ============================================================
// RECOVERY GRACE — brief window to save chain after miss
// ============================================================

window.recordMedalChainMiss = function() {
  _hcMedalRecovery.lastMissFrame = _hcMedalRecovery.totalFrames;
};

window.isMedalRecoveryGraceActive = function() {
  var cfg = _hcMedalReadConfig();
  var framesSinceMiss = _hcMedalRecovery.totalFrames - _hcMedalRecovery.lastMissFrame;
  return framesSinceMiss >= 0 && framesSinceMiss <= cfg.recoveryGraceFrames;
};

window.recordMedalRecovery = function() {
  _hcMedalTelemetry.recoveries++;
  _hcMedalRecovery.lastMissFrame = -999;
};

// Called each frame in update loop
window.updateMedalFrameCounter = function() {
  _hcMedalRecovery.totalFrames++;
};

// ============================================================
// ENHANCED PICKUP — multiplier gain, telemetry
// ============================================================

window.applyMedalPickupBonus = function() {
  var cfg = _hcMedalReadConfig();

  // Multiplier gain
  if (typeof window.addScoreMultiplierGain === 'function') {
    window.addScoreMultiplierGain('graze'); // reuse graze gain (medals are bonus, not kills)
  }

  _hcMedalTelemetry.pickups++;
  var currentTier = Math.min(Math.floor(medalChain / 5), MEDAL_VALUES.length - 1);
  if (currentTier > _hcMedalTelemetry.maxTier) {
    _hcMedalTelemetry.maxTier = currentTier;
  }
  _hcMedalTelemetry.dropsThisWave++;
};

// ============================================================
// ANTI-EXPLOIT
// ============================================================

window.canDropMedal = function() {
  var cfg = _hcMedalReadConfig();
  return _hcMedalTelemetry.dropsThisWave < cfg.maxDropsPerWave;
};

window.resetMedalWaveTracking = function() {
  _hcMedalTelemetry.dropsThisWave = 0;
};

// ============================================================
// TELEMETRY
// ============================================================

window.getMedalChainTelemetry = function() {
  return {
    currentChain: medalChain,
    currentTier: Math.min(Math.floor(medalChain / 5), MEDAL_VALUES.length - 1),
    maxTier: _hcMedalTelemetry.maxTier,
    pickups: _hcMedalTelemetry.pickups,
    misses: _hcMedalTelemetry.misses,
    recoveries: _hcMedalTelemetry.recoveries,
    dropsThisWave: _hcMedalTelemetry.dropsThisWave,
    feverActive: feverActive,
    recoveryGraceActive: window.isMedalRecoveryGraceActive()
  };
};

window.resetMedalTelemetry = function() {
  _hcMedalTelemetry.pickups = 0;
  _hcMedalTelemetry.misses = 0;
  _hcMedalTelemetry.recoveries = 0;
  _hcMedalTelemetry.maxTier = 0;
  _hcMedalTelemetry.dropsThisWave = 0;
  _hcMedalRecovery.lastMissFrame = -999;
  _hcMedalRecovery.totalFrames = 0;
};

