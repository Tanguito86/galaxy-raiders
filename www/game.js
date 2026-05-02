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
    const cx = m.x + m.w * 0.5;
    const cy = m.y + m.h * 0.5;
    const pulse = 0.65 + 0.35 * Math.sin(globalTime * 0.025 + i * 0.9);
    const glow = 0.25 + pulse * 0.35;

    drawCtx.save();
    drawCtx.translate(cx, cy);

    drawCtx.globalAlpha = glow;
    drawCtx.fillStyle = '#ffe680';
    drawCtx.fillRect(-m.w * 0.5 - 3, -m.h * 0.5 - 3, m.w + 6, m.h + 6);

    drawCtx.globalAlpha = 1;
    drawCtx.fillStyle = '#2b1600';
    drawCtx.fillRect(-m.w * 0.5 - 1, -m.h * 0.5 - 1, m.w + 2, m.h + 2);

    drawCtx.fillStyle = '#ffb000';
    drawCtx.fillRect(-m.w * 0.5, -m.h * 0.5, m.w, m.h);

    drawCtx.fillStyle = '#fff06a';
    drawCtx.fillRect(-m.w * 0.5 + 2, -m.h * 0.5 + 2, m.w - 4, m.h - 4);

    drawCtx.fillStyle = '#9b5f00';
    drawCtx.fillRect(-m.w * 0.5 + 4, -m.h * 0.5 + 4, m.w - 8, m.h - 8);

    drawCtx.fillStyle = '#ffd966';
    drawCtx.fillRect(-2, -4, 4, 8);
    drawCtx.fillRect(-4, -2, 8, 4);

    drawCtx.globalAlpha = 0.35 + pulse * 0.45;
    drawCtx.fillStyle = '#fff8c6';
    drawCtx.fillRect(-m.w * 0.5 + 3, -m.h * 0.5 + 2, 5, 2);
    drawCtx.fillRect(m.w * 0.5 - 4, m.h * 0.5 - 5, 2, 2);

    drawCtx.restore();
  }
}

function drawPopups(ctxRef) {
  const drawCtx = ctxRef || ctx;
  drawCtx.save();
  drawCtx.font = '9px "Press Start 2P"';
  drawCtx.textAlign = 'center';

  for (let i = 0; i < popups.length; i++) {
    const p = popups[i];
    const alpha = Math.max(0, Math.min(1, p.alpha));
    const liftPulse = 0.8 + 0.2 * Math.sin(globalTime * 0.08 + i);
    drawCtx.globalAlpha = alpha * 0.45;
    drawCtx.fillStyle = p.color || '#fff';
    drawCtx.fillText(p.text, p.x, p.y - 1);
    drawCtx.globalAlpha = alpha;
    drawCtx.fillStyle = 'rgba(0,0,0,0.65)';
    drawCtx.fillText(p.text, p.x + 1, p.y + 1);
    drawCtx.fillStyle = 'rgba(0,0,0,0.85)';
    drawCtx.fillText(p.text, p.x - 1, p.y + 1);
    drawCtx.fillStyle = p.color || '#fff';
    drawCtx.globalAlpha = alpha * liftPulse;
    drawCtx.fillText(p.text, p.x, p.y);
  }

  drawCtx.restore();
}

function drawMedalHUD(ctxRef) {
  const drawCtx = ctxRef || ctx;
  drawCtx.save();
  drawCtx.textAlign = 'right';
  drawCtx.font = '8px "Press Start 2P"';
  drawCtx.fillStyle = '#9ee7ff';
  drawCtx.fillText('CHAIN: ' + medalChain, W - 10, 52);
  drawCtx.fillStyle = '#ffd966';
  drawCtx.fillText('NEXT: ' + medalValue, W - 10, 67);
  drawCtx.restore();
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




