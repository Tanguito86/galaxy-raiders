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
  { glow: '#ff8888', border: '#330000', outer: '#ff2200', inner: '#ff6666', core: '#880000', cross: '#ff9999', highlight: '#ffcccc' }
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
  addScore(bonus);
  spawnPopup(W / 2, H / 2 - 30, 'PERFECT WAVE', '#ffee55');
  spawnPopup(W / 2, H / 2 - 8, '+' + bonus, '#ffee88');

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
      addScore(gained);
      medalChain += 1;
      medalValue = getCurrentMedalValue();
      maybeActivateMedalFever();

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
      const prevTier = Math.min(
        Math.floor(medalChain / 5),
        MEDAL_VALUES.length - 1
      );
      if (prevTier > 0) {
        medalChain = Math.max(0, medalChain - 5);
        medalValue = getCurrentMedalValue();
        spawnPopup(m.x, H - 16, 'MEDAL DOWN', '#ff8866');
      }
      medals.splice(i, 1);
    }
  }
}
