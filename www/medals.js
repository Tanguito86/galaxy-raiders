// =====================
// GALAXY RAIDERS - medals.js
// =====================

const MEDAL_BASE = 100;
const MEDAL_STEP = 50;
const MEDAL_MAX = 2000;
const MEDAL_DROP_CHANCE = 0.35;
const MEDAL_SIZE = 14;
const MEDAL_VY = 1.6;
const MEDAL_DENSITY_MULT = 0.25;
const MAGNET_RADIUS = 60;
const MAGNET_FORCE = 0.06;
const MEDAL_OFFSCREEN_MARGIN = 24;
const MEDAL_ELITE_TYPES = {
  alien3: true,
  alien5: true,
  alien6: true
};

let medals = [];
let medalChain = 0;
let medalValue = MEDAL_BASE;
let popups = [];

function resetMedalChain() {
  medalChain = 0;
  medalValue = MEDAL_BASE;
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
  const spawnChance = Math.max(0, Math.min(1, baseChance * MEDAL_DENSITY_MULT));
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
  const p = getRect(playerRef || player);
  let chainLost = false;

  for (let i = medals.length - 1; i >= 0; i--) {
    const m = medals[i];
    const mx = m.x + m.w * 0.5;
    const my = m.y + m.h * 0.5;
    const px = p.x + p.w * 0.5;
    const py = p.y + p.h * 0.5;
    const dx = px - mx;
    const dy = py - my;
    const dist = Math.hypot(dx, dy);

    if (dist <= MAGNET_RADIUS) {
      const inv = dist > 0.001 ? (1 / dist) : 0;
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
      const gained = medalValue;
      addScore(gained);
      medalChain += 1;
      medalValue = Math.min(MEDAL_MAX, medalValue + MEDAL_STEP);

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
      medals.splice(i, 1);
      chainLost = true;
    }
  }

  if (chainLost) resetMedalChain();
}
