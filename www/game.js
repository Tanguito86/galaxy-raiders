// =====================
// GALAXY RAIDERS - game.js (CORREGIDO - WARP FIN DE NIVEL + VERTICAL OK)
// =====================

let showTryAgain = false;

let lastShotTime = 0;
let isFiring = false;

// Sistema de invencibilidad
let isInvincible = false;
let invincibleTimer = 0;

const player = createPlayer();

let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let powerUps = [];
let stars = [];
let mines = []; // Minas flotantes de Serpentrix
let satellites = []; // Satélites orbitantes de Orbital
let ufoRewards = [];

// === MEDALS / CHAIN SYSTEM ===
const MEDAL_BASE = 100;
const MEDAL_STEP = 50;
const MEDAL_MAX = 2000;
const MEDAL_DROP_CHANCE = 0.35;
const MEDAL_SIZE = 14;
const MEDAL_VY = 1.6;
const MEDAL_DENSITY_MULT = 0.25; // 1/4 de densidad de drops
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

function getRect(obj) {
  if (!obj) return { x: 0, y: 0, w: 0, h: 0 };
  return {
    x: obj.x || 0,
    y: obj.y || 0,
    w: (obj.w !== undefined) ? obj.w : (obj.width || 0),
    h: (obj.h !== undefined) ? obj.h : (obj.height || 0)
  };
}

function rectOverlap(a, b) {
  const ra = getRect(a);
  const rb = getRect(b);
  return (
    ra.x < rb.x + rb.w &&
    ra.x + ra.w > rb.x &&
    ra.y < rb.y + rb.h &&
    ra.y + ra.h > rb.y
  );
}

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

function updatePopups(step = 1) {
  for (let i = popups.length - 1; i >= 0; i--) {
    const p = popups[i];
    p.y -= p.vy * step;
    p.alpha -= 0.02 * step;
    p.ttl -= step;

    if (p.ttl <= 0 || p.alpha <= 0) {
      popups.splice(i, 1);
    }
  }
}

function drawMedals(ctxRef) {
  const drawCtx = ctxRef || ctx;

  for (let i = 0; i < medals.length; i++) {
    const m = medals[i];
    const pulse = 0.65 + 0.35 * Math.sin(globalTime * 0.02 + i * 0.9);

    drawCtx.fillStyle = '#6a4200';
    drawCtx.fillRect(m.x, m.y, m.w, m.h);

    drawCtx.fillStyle = '#ffd34d';
    drawCtx.fillRect(m.x + 1, m.y + 1, m.w - 2, m.h - 2);

    drawCtx.fillStyle = '#b87900';
    drawCtx.fillRect(m.x + 4, m.y + 4, m.w - 8, m.h - 8);

    drawCtx.globalAlpha = 0.35 + pulse * 0.55;
    drawCtx.fillStyle = '#fff8c6';
    drawCtx.fillRect(m.x + 3, m.y + 2, 4, 3);
    drawCtx.globalAlpha = 1;
  }
}

function drawPopups(ctxRef) {
  const drawCtx = ctxRef || ctx;
  drawCtx.save();
  drawCtx.font = '9px "Press Start 2P"';
  drawCtx.textAlign = 'center';

  for (let i = 0; i < popups.length; i++) {
    const p = popups[i];
    drawCtx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
    drawCtx.fillStyle = 'rgba(0,0,0,0.65)';
    drawCtx.fillText(p.text, p.x + 1, p.y + 1);
    drawCtx.fillStyle = p.color || '#fff';
    drawCtx.fillText(p.text, p.x, p.y);
  }

  drawCtx.restore();
  drawCtx.globalAlpha = 1;
}

function drawMedalHUD(ctxRef) {
  const drawCtx = ctxRef || ctx;
  drawCtx.textAlign = 'right';
  drawCtx.font = '8px "Press Start 2P"';
  drawCtx.fillStyle = '#9ee7ff';
  drawCtx.fillText('CHAIN: ' + medalChain, W - 10, 52);
  drawCtx.fillStyle = '#ffd966';
  drawCtx.fillText('NEXT: ' + medalValue, W - 10, 67);
}

// --- PARALLAX ---
let prevPlayerX = 0;
let prevPlayerY = 0;


let ufo = createUfo();
let boss = createBoss();

let bossDefeated = false;
let enemyDir = 1;
let enemySpeedX = 1;
let enemyLastShot = 0;
let animationFrame = 0;
let warpSpeed = 1;
let hitstopTimer = 0;
let currentSetPiece = null;
let setPieceBannerText = '';
let setPieceBannerTimer = 0;
let setPieceIntroTimer = 0;
let setPieceIntroResolved = true;
let setPiecePatternTimer = 0;
let setPieceFireTimer = 0;
let setPieceLaneIndex = 0;
let setPieceTelegraphTimer = 0;
let setPieceTelegraphSide = 0;
let setPieceBurstShotsRemaining = 0;
let setPieceBurstDelayTimer = 0;
let setPieceBurstVariant = 0;

// ✅ NUEVO: transición de fin de nivel (warp real)
let levelClearTimer = 0;
let pendingNextLevel = false;

// Cargar high scores al inicio
loadHighScores();

// Sistema de input de nombre
let enteringName = false;
let playerName = '';
let nameCursorBlink = 0;

// Alfabeto para navegación con joystick
let currentLetterIndex = 0;
let joystickInputCooldown = 0;

// === SISTEMA DE VIDAS EXTRA ===
let extraLivesEarned = 0;

// === SISTEMA DE CONTINUE ===
let continueTimer = 0;
let continueCount = 0;  // Cuántas veces usó continue




