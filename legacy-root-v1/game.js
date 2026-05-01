// =====================
// GALAXY RAIDERS - game.js (CORREGIDO - WARP FIN DE NIVEL + VERTICAL OK)
// =====================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');
const W = 360;
const H = 640;

function setupHiDPI() {
  const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}
setupHiDPI();
window.addEventListener('resize', setupHiDPI);


// --- CONFIG & ASSETS ---
const PALETTES = [
  ['#0f0', '#0ff', '#f0f', '#f00'],
  ['#ff0', '#f44', '#f80', '#0ff'],
  ['#0ff', '#f0f', '#0f0', '#ff0'],
  ['#fff', '#88f', '#f88', '#8f8'],
  ['#f0f', '#ff0', '#0ff', '#f00']
];
let currentPalette = PALETTES[0];

// Sprites
const SPRITES = {
  alien1_a: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,0,1,1,0,1,0],
    [1,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,1,0]
  ],
  alien1_b: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1],
    [0,0,1,0,0,1,0,0],
    [0,1,0,1,1,0,1,0],
    [1,0,1,0,0,1,0,1]
  ],
  alien2_a: [
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,0,0,1,0,0,0,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,1],
    [0,0,0,1,1,0,1,1,0,0,0]
  ],
  alien2_b: [
    [0,0,1,0,0,0,0,0,1,0,0],
    [1,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1],
    [1,1,1,0,1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,0,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,0,1,0]
  ],

  // === NUEVOS TIPOS DE ALIENS ===
  
  // Alien tipo 3: "Tanque" - más grande, aguanta 2 hits
  alien3_a: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,0,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,1,0]
  ],
  alien3_b: [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,1,1,0,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,0,0,1]
  ],
  
  // Alien tipo 4: "Veloz" - pequeño, se mueve rápido
  alien4_a: [
    [0,1,0,0,0,1,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,0,1,1,1,0,1],
    [0,0,1,0,1,0,0],
    [0,1,0,0,0,1,0]
  ],
  alien4_b: [
    [0,1,0,0,0,1,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,0,1,1,1,0,1],
    [0,1,0,0,0,1,0],
    [1,0,0,0,0,0,1]
  ],
  
  // Alien tipo 5: "Kamikaze" - va directo al jugador
  alien5_a: [
    [0,0,1,1,1,0,0],
    [0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1],
    [1,0,1,1,1,0,1],
    [0,1,1,1,1,1,0],
    [0,0,1,0,1,0,0]
  ],
  alien5_b: [
    [0,0,1,1,1,0,0],
    [0,1,0,1,0,1,0],
    [1,1,1,1,1,1,1],
    [1,0,1,1,1,0,1],
    [0,1,1,1,1,1,0],
    [0,1,0,0,0,1,0]
  ],
  
  // Alien tipo 6: "Splitter" - se divide en 2 al morir
  alien6_a: [
    [0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,1,0,1,1,0],
    [0,0,1,1,0,0,0,1,1,0,0],
    [0,0,0,1,0,0,0,1,0,0,0]
  ],
  alien6_b: [
    [0,1,0,0,0,1,0,0,0,1,0],
    [0,0,1,0,1,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,1,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,1,0,1,1,0],
    [0,1,0,1,0,0,0,1,0,1,0],
    [1,0,0,0,0,0,0,0,0,0,1]
  ],
  
  // Mini alien (spawn del Splitter)
  alien_mini_a: [
    [0,1,1,0],
    [1,1,1,1],
    [1,0,0,1],
    [0,1,1,0]
  ],
  alien_mini_b: [
    [0,1,1,0],
    [1,1,1,1],
    [0,1,1,0],
    [1,0,0,1]
  ],

  

  // Player ship (2 frames) - más estética, 11x8
player_a: [
  [0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,1,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0]
],

player_b: [
  [0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0]
],

  ufo: [
    [0,0,0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,1,0,0,1,0,0,1,0,0]
  ],
  victory_trophy: [
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,0],
    [0,1,0,1,1,0,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,0]
  ],
  
  // === BOSSES ÚNICOS ===
  boss_crabtron: [
    [0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0],
    [0,1,1,0,1,1,0,1,0,0,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1],
    [0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0],
    [0,0,1,1,1,0,0,1,1,1,1,0,1,1,0,0,0,0],
    [1,0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0,1],
    [0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0]
  ],
  
  boss_serpentrix: [
    [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,1,1,1,1,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,0,0],
    [0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,1,0,0,1,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,0,0],
    [0,0,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,0]
  ],
  
  boss_orbital: [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,0,1,1,1,1,0,1,1,0,0,0,0,0],
    [0,0,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,0],
    [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,0,0],
    [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,0,0],
    [0,0,1,1,0,1,1,0,0,1,1,0,1,1,0,0,0,0],
    [0,0,0,1,1,0,1,1,1,1,0,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0]
  ],
  
  boss_teniente: [
    [0,0,1,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0],
    [0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,0],
    [1,1,0,1,1,1,0,0,1,1,0,0,1,1,1,0,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
    [0,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0],
    [0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,0],
    [0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0]
  ],
  
  boss_emperador: [
  [0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,1,1,0,1,1,0,0,0,0,1,1,0,1,1,0,0],
  [0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,0],
  [1,1,0,1,1,0,0,1,1,1,1,0,0,1,1,0,1,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,1,1,0,1,1,0,1,0,0,1,0,1,1,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0],
  [0,0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0,0],
  [0,0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0,0],
  [0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0]
],
};

// === DATOS DE TIPOS DE ENEMIGOS ===
const ENEMY_TYPES = {
  alien1: { hp: 1, speed: 1.0, points: 30, color: 2, canDive: true, shoots: true },
  alien2: { hp: 1, speed: 1.0, points: 20, color: 1, canDive: true, shoots: true },
  alien3: { hp: 2, speed: 0.6, points: 50, color: 3, canDive: false, shoots: true, bigShot: true },
  alien4: { hp: 1, speed: 2.0, points: 40, color: 0, canDive: true, shoots: false },
  alien5: { hp: 1, speed: 1.5, points: 60, color: 3, canDive: true, shoots: false, kamikaze: true },
  alien6: { hp: 1, speed: 0.8, points: 80, color: 2, canDive: false, shoots: true, splits: true },
  alien_mini: { hp: 1, speed: 1.8, points: 15, color: 2, canDive: true, shoots: false }
};

// === SISTEMA DE DIFICULTAD PROGRESIVA ===
function getDifficultySettings(levelNum) {
  // Progresión suave de 1 a 20
  const progress = (levelNum - 1) / 19; // 0.0 a 1.0
  
  return {
    // Velocidad de enemigos (1.0 a 2.0)
    enemySpeed: 1.0 + progress * 1.0,
    
    // Velocidad de balas enemigas (3 a 5)
    bulletSpeed: 3 + progress * 2,
    
    // Cooldown de disparo enemigo (900ms a 400ms)
    shootCooldown: Math.max(400, 900 - levelNum * 25),
    
    // Probabilidad de diving (0.2% a 0.6%)
    diveChance: 0.002 + progress * 0.004,
    
    // Máximo de divers simultáneos (1 a 3)
    maxDivers: Math.min(3, 1 + Math.floor(levelNum / 7)),
    
    // Velocidad de diving (2.5 a 4.0)
    diveSpeed: 2.5 + progress * 1.5,
    
    // HP extra para tanques en niveles altos
    tankHpBonus: Math.floor(levelNum / 10),
    
    // Probabilidad de enemigos especiales
    specialChance: Math.min(0.4, progress * 0.5),
    
    // Cantidad de enemigos (factor 1.0 a 1.3)
    enemyCountMult: 1.0 + progress * 0.3,
    
    // Puntos multiplicador
    scoreMult: 1.0 + progress * 0.5
  };
}


function drawSprite(ctx, spriteMap, x, y, color, size = 3) {
  ctx.fillStyle = color;
  for (let r = 0; r < spriteMap.length; r++) {
    for (let c = 0; c < spriteMap[r].length; c++) {
      if (spriteMap[r][c] === 1) ctx.fillRect(x + c * size, y + r * size, size, size);
    }
  }
}

// === FIREBASE GLOBAL SCORES ===
let globalScores = [];
let globalTopScore = 0;
let globalTopName = '---';

// Cargar top score global
async function loadGlobalScores() {
  try {
    const snapshot = await db.collection('scores')
      .orderBy('score', 'desc')
      .limit(10)
      .get();
    
    globalScores = [];
    snapshot.forEach(doc => {
      globalScores.push(doc.data());
    });
    
    if (globalScores.length > 0) {
      globalTopScore = globalScores[0].score;
      globalTopName = globalScores[0].name;
    }
    
    console.log('Global scores loaded:', globalScores);
  } catch (error) {
    console.error('Error loading global scores:', error);
  }
}

// Subir score al ranking global
async function submitGlobalScore(name, score) {
  try {
    await db.collection('scores').add({
      name: name.toUpperCase(),
      score: score,
      date: new Date().toISOString()
    });
    console.log('Score submitted:', name, score);
    loadGlobalScores(); // Recargar ranking
  } catch (error) {
    console.error('Error submitting score:', error);
  }
}

// Cargar scores al iniciar
loadGlobalScores();

// --- GAME STATE ---
let screenShake = 0;
let flashScreen = 0;
let state = 'menu';
let globalTime = 0;
let score = 0;
let lives = 3;
let level = 1;
let nextPowerUpTime = 0;
let powerUpsSpawnedThisLevel = 0;
let starShakeX = 0;
let starShakeY = 0;


const POWERUP_COOLDOWN = 3000;       // 3s mínimo entre drops
const MAX_ACTIVE_POWERUPS = 1;       // máximo en pantalla a la vez
const MAX_POWERUPS_PER_LEVEL = 4;    // máximo por nivel

let bestScore = 0;
let highScores = [];
let highNames = [];
let highContinues = []; // Cuántos continues usó cada uno

// --- HIGH SCORES: localStorage ---
function loadHighScores() {
  try {
    const saved = localStorage.getItem('galaxyRaidersScores');
    if (saved) {
      const data = JSON.parse(saved);
      highScores = data.scores || [];
      highNames = data.names || [];
      highContinues = data.continues || [];
    }
  } catch (e) {
    console.log('Error loading scores:', e);
    highScores = [];
    highNames = [];
    highContinues = [];
  }

  // Asegurar 10 slots
  while (highScores.length < 10) {
    highScores.push(0);
    highNames.push('---');
    highContinues.push(0);
  }

  bestScore = highScores[0] || 0;
  console.log('High scores loaded:', highScores, highNames, 'bestScore:', bestScore);
}

function saveHighScores() {
  try {
    localStorage.setItem('galaxyRaidersScores', JSON.stringify({
      scores: highScores,
      names: highNames,
      continues: highContinues
    }));
  } catch (e) {
    console.log('No se pudo guardar');
  }
}

function isHighScore(score) {
  if (score === 0) return false;
  
  // Si hay algún slot vacío
  for (let i = 0; i < 10; i++) {
    if (highScores[i] === 0 || highNames[i] === '---') {
      return true;
    }
  }
  
  // Si supera el 10mo lugar
  return score > highScores[9];
}

function addHighScore(score, name) {
  highScores.push(score);
  highNames.push(name);
  highContinues.push(continueCount);

  // Combinar y ordenar
  const combined = highScores.map((s, i) => ({ 
    score: s, 
    name: highNames[i],
    continues: highContinues[i] || 0
  }));
  combined.sort((a, b) => b.score - a.score);

  // Tomar top 10
  highScores = combined.slice(0, 10).map(x => x.score);
  highNames = combined.slice(0, 10).map(x => x.name);
  highContinues = combined.slice(0, 10).map(x => x.continues);

  saveHighScores();
  bestScore = highScores[0] || 0;
  
  // ✅ Subir al ranking global
  submitGlobalScore(name, score);
}

let showTryAgain = false;

let lastShotTime = 0;
let isFiring = false;

// Sistema de invencibilidad
let isInvincible = false;
let invincibleTimer = 0;
const INVINCIBLE_DURATION = 2000; // 2 segundos

const player = {
  width: 33, height: 24,
  x: W / 2 - 16,
  y: H - 40,
  speed: 5,
  speedY: 4,
  movingLeft: false,
  movingRight: false,
  movingUp: false,
  movingDown: false,
  weaponType: 'normal',
  weaponTimer: 0,
  shootCooldown: 300
};

let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let powerUps = [];
let stars = [];
let mines = []; // Minas flotantes de Serpentrix
let satellites = []; // Satélites orbitantes de Orbital
let ufoRewards = [];

// --- PARALLAX ---
let prevPlayerX = 0;
let prevPlayerY = 0;


let ufo = { x: -100, y: 40, w: 42, h: 21, active: false, timer: 0, dir: 1 };
let boss = {
  active: false,
  x: 0, y: -200, w: 90, h: 45,
  hp: 100, maxHp: 100,
  dir: 1,
  shootTimer: 0,

  // --- IA ---
  state: 'aggressive',      // aggressive | evade | counter
  decisionT: 0,             // timer para decidir
  vx: 0, vy: 0,             // velocidad actual
  targetX: 0, targetY: 0,   // objetivo (se mueve hacia acá)
  counterFlag: false,
  rotationAngle: 0
};

let bossDefeated = false;
let enemyDir = 1;
let enemySpeedX = 1;
let enemyLastShot = 0;
let animationFrame = 0;
let warpSpeed = 1;

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
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 !@#$%&*()-_=+[]{}:;.,?';
let currentLetterIndex = 0;
let joystickInputCooldown = 0;

// === SISTEMA DE MENÚ ===
let menuSelection = 0;  // 0=PLAY, 1=SCORES, 2=OPTIONS
const MENU_OPTIONS = ['PLAY', 'SCORES', 'OPTIONS'];
let pauseSelection = 0;  // 0=RESUME, 1=OPTIONS, 2=QUIT
let scoresTab = 1;  // ✅ GLOBAL por defecto

let optionSelection = 0;  // 0=SOUND, 1=VIBRATION, 2=DIFFICULTY, 3=RESET
const OPTIONS_COUNT = 4;
let vibrationEnabled = true;


let globalNames = [];
let globalContinues = [];
let playerCredits = 1;  // Fichas del jugador

// Cargar fichas de localStorage
try {
  const savedCredits = localStorage.getItem('gr_credits');
  if (savedCredits) playerCredits = parseInt(savedCredits) || 4;
} catch (e) {}

function saveCredits() {
  try {
    localStorage.setItem('gr_credits', playerCredits.toString());
  } catch (e) {}
}

// Aliens decorativos animados
console.log('globalTime:', globalTime, 'menuAnim:', Math.floor(globalTime / 500) % 2);
const alienWave = Math.sin(globalTime * 0.003) * 15;
let menuAliens = [];

function initMenuAliens() {
  menuAliens = [];
  const types = ['alien1', 'alien2', 'alien1', 'alien2', 'alien1'];
  
  // Fila 1 - centrada
  for (let i = 0; i < 5; i++) {
    menuAliens.push({
      x: 0,
      y: 100,
      type: types[i],
      col: i,
      row: 0
    });
  }
  
  // Fila 2 - centrada
  for (let i = 0; i < 4; i++) {
    menuAliens.push({
      x: 0,
      y: 135,
      type: 'alien2',
      col: i,
      row: 1
    });
  }
}

initMenuAliens();

const difficulties = [
  { key: 'normal',   name: 'NORMAL',   lives: 3, fireMult: 1.0 },
  { key: 'hardcore', name: 'HARDCORE', lives: 1, fireMult: 0.6 }
];

let difficultyIndex = 0;

let hardcoreUnlocked = false;

// Cargar desbloqueo de localStorage
try {
  hardcoreUnlocked = localStorage.getItem('gr_hardcoreUnlocked') === 'true';
} catch (e) {}

// === SISTEMA DE VIDAS EXTRA ===
const EXTRA_LIFE_SCORES = [10000, 30000, 60000, 100000];
let extraLivesEarned = 0;
const MAX_LIVES = 5;

// === SISTEMA DE CONTINUE ===
let continueTimer = 0;
let continueCount = 0;  // Cuántas veces usó continue
const CONTINUE_TIME = 10000;  // 10 segundos para decidir
const CONTINUE_COST = 1;  // 1 crédito/ficha (para futuro IAP)

function awardExtraLife() {
  if (lives < MAX_LIVES) {
    lives++;
    playTone(1000, 'sine', 0.3);
    setTimeout(() => playTone(1200, 'sine', 0.3), 100);
    setTimeout(() => playTone(1500, 'sine', 0.4), 200);
    screenShake = 10;
    flashScreen = 15;
    vibrate(100);
  }
}

function addScore(points) {
  const oldScore = score;
  score += points;
  
  // Verificar si cruzamos un umbral de vida extra
  for (let i = extraLivesEarned; i < EXTRA_LIFE_SCORES.length; i++) {
    if (oldScore < EXTRA_LIFE_SCORES[i] && score >= EXTRA_LIFE_SCORES[i]) {
      awardExtraLife();
      extraLivesEarned++;
    }
  }
}

function calculateGrade() {
  // S = Sin continues, >80k puntos
  // A = Sin continues
  // B = 1-2 continues  
  // C = 3+ continues
  
  if (continueCount === 0 && score >= 80000) return 'S';
  if (continueCount === 0) return 'A';
  if (continueCount <= 2) return 'B';
  return 'C';
}

function getGradeColor(grade) {
  switch(grade) {
    case 'S': return '#ff0'; // Oro brillante
    case 'A': return '#0f0'; // Verde
    case 'B': return '#0ff'; // Cyan
    case 'C': return '#f80'; // Naranja
    default: return '#fff';
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + seconds.toString().padStart(2, '0');
}

// ✅ Progresión del juego
let gameCompleted = false;
let victoryTimer = 0;
let victoryParticles = [];

// === SISTEMA DE FINAL ÉPICO ===
let victoryPhase = 0;
let victoryPhaseTimer = 0;
let bossExplosionCount = 0;
let playerVictoryY = 0;
let finalGrade = 'C';
let gameStats = {
  enemiesKilled: 0,
  shotsFired: 0,
  shotsHit: 0,
  powerupsCollected: 0,
  timeStarted: 0,
  totalTime: 0
};

// ✅ Sistema de bosses - 5 bosses únicos en 20 niveles
const BOSS_LEVELS = [5, 10, 15, 19, 20];

const BOSS_DATA = {
  5:  { name: 'CRABTRON',   baseHp: 100, pattern: 'crossfire', color: '#f00' },
  10: { name: 'SERPENTRIX', baseHp: 150, pattern: 'zigzag',    color: '#0f0' },
  15: { name: 'ORBITAL',    baseHp: 200, pattern: 'rotate',    color: '#0ff' },
  19: { name: 'TENIENTE',   baseHp: 300, pattern: 'divebomb',  color: '#ff0' },
  20: { name: 'EMPERADOR',  baseHp: 500, pattern: 'supreme',   color: '#fff' }
};

// --- ANDROID LAYER (HAPTICS + FULLSCREEN) ---

// ✅ Vibración háptica con cooldown
let lastVibe = 0;
function vibrate(duration = 50) {
  if (!vibrationEnabled) return;
  const now = performance.now();
  if (now - lastVibe < 80) return;
  lastVibe = now;
  if (navigator.vibrate) navigator.vibrate(duration);
}

// --- FULLSCREEN ---
const fullscreenBtn = document.getElementById('btn-fullscreen');

function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
  }
}

function updateFullscreenButton() {
  if (!fullscreenBtn) return;
  fullscreenBtn.textContent = document.fullscreenElement ? '⤢' : '⛶';
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  updateFullscreenButton();
}

document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('msfullscreenchange', updateFullscreenButton);

// --- PAUSE BUTTON (MOBILE) ---
const pauseBtn = document.getElementById('btn-pause');

function togglePause() {
  if (state === 'playing') {
    state = 'paused';
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    if (pauseBtn) pauseBtn.textContent = '▶';
  } else if (state === 'paused') {
    state = 'playing';
    startMusic(boss.active ? 'boss' : 'normal');
    if (pauseBtn) pauseBtn.textContent = '❚❚';
  }
}

if (pauseBtn) {
  pauseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // ✅ Si estamos en el menú, INICIAR juego
    if (state === 'menu') {
      if (menuSelection === 0) {
        // PLAY
        requestFull();
        state = 'playing';
        menuMusicStarted = false;
        level = 1;
        score = 0;
        lives = difficulties[difficultyIndex].lives;
        console.log('Game started with lives:', lives);
        extraLivesEarned = 0;
        continueCount = 0;
        gameStats = { enemiesKilled: 0, shotsFired: 0, shotsHit: 0, powerupsCollected: 0, timeStarted: globalTime, totalTime: 0 };
        player.x = W / 2 - 16;
        player.y = H - 40;
        pendingNextLevel = false;
        levelClearTimer = 0;
        warpSpeed = 1;
        startLevel();
      } else if (menuSelection === 1) {
        // SCORES
        state = 'scores';
        playTone(800, 'sine', 0.1);
      } else if (menuSelection === 2) {
        // OPTIONS
        state = 'options';
        playTone(800, 'sine', 0.1);
      }
      return;
    }
    
    // Volver de SCORES
    if (state === 'scores') {
      state = 'menu';
      playTone(400, 'sine', 0.1);
      return;
    }
    
    // OPTIONS - FIRE hace cosas diferentes según selección
    if (state === 'options') {
      if (optionSelection === 3) {
        // RESET SCORES
        highScores = [];
        highNames = [];
        highContinues = [];
        for (let i = 0; i < 10; i++) {
          highScores.push(0);
          highNames.push('---');
          highContinues.push(0);
        }
        bestScore = 0;
        saveHighScores();
        playTone(200, 'square', 0.3);
      }
      state = 'menu';
      playTone(400, 'sine', 0.1);
      return;
    }
    
    // ✅ Si estamos ingresando nombre, CONFIRMAR
    if (state === 'entering_name' && playerName.length > 0) {
      addHighScore(score, playerName.toUpperCase());
      enteringName = false;
      state = 'menu';
      
      // ✅ RESETEAR SHAKE
      screenShake = 0;
      flashScreen = 0;
      
      // Reset del juego
      bullets = [];
      enemyBullets = [];
      enemies = [];
      powerUps = [];
      particles = [];
      boss.active = false;
      player.weaponType = 'normal';
      player.weaponTimer = 0;
      currentLetterIndex = 0;
      
      if (pauseBtn) pauseBtn.textContent = '▶';
      
      playTone(1200, 'square', 0.2);
      vibrate(100);
      return;
    }
    // Funcionalidad normal de pausa
    if (state === 'playing' || state === 'paused') {
      togglePause();
      vibrate(30);
    }
  });
}

// --- MUTE BUTTON (MOBILE) ---
const muteBtn = document.getElementById('btn-mute');

if (muteBtn) {
  muteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // ✅ Si estamos ingresando nombre, BORRAR última letra
    if (state === 'entering_name') {
      playerName = playerName.slice(0, -1);
      playTone(400, 'square', 0.05);
      vibrate(30);
      return;
    }
    
    // Funcionalidad normal de mute
    isMuted = !isMuted;
    
    if (isMuted) {
      muteBtn.textContent = '🔇';
      muteBtn.classList.add('muted');
      if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    } else {
      muteBtn.textContent = '🔊';
      muteBtn.classList.remove('muted');
      if (state === 'playing') {
        startMusic(boss.active ? 'boss' : 'normal');
      }
    }
  });
}

// --- INPUT HELPERS ---
function bindHold(el, onDown, onUp) {
  if (!el) return;

  const opts = { passive: false };

  const down = (ev) => {
    ev.preventDefault();
    if (el.setPointerCapture) el.setPointerCapture(ev.pointerId);
    vibrate(30);          // feedback táctil
    onDown();
  };

  const up = (ev) => {
    ev.preventDefault();
    onUp();
  };

  el.addEventListener('pointerdown', down, opts);
  el.addEventListener('pointerup', up, opts);
  el.addEventListener('pointercancel', up, opts);
  el.addEventListener('pointerleave', up, opts);
  el.addEventListener('contextmenu', ev => ev.preventDefault());

  el.style.touchAction = 'none';
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}


// --- GAME EVENTS ---
function playExplosion() {
  vibrate?.(100);

  if (!audioCtx || isMuted) return;

  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  noise.buffer = buffer;

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  noise.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

// Sonido de daño a tanque (no muere)
function playTankHitSound() {
  if (!audioCtx || isMuted) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playPlayerHitSound() {
  if (!audioCtx || isMuted) return;
  
  // Capa 1: Impacto grave
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.4);
  gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start();
  osc1.stop(audioCtx.currentTime + 0.4);
  
  // Capa 2: Crunch agudo
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.2);
  gain2.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start();
  osc2.stop(audioCtx.currentTime + 0.2);
  
  // Capa 3: Ruido de explosión
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < buffer.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length);
  }
  const noise = audioCtx.createBufferSource();
  const noiseGain = audioCtx.createGain();
  noise.buffer = buffer;
  noiseGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  noise.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start();
}


function endGame() {
  console.log('endGame called, setting state to continue');
  
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }

  // Feedback inmediato
  screenShake = 40;
  flashScreen = 25;
  vibrate?.(200);

  // Mostrar pantalla de continue
  state = 'continue';
  continueTimer = CONTINUE_TIME;
  
  playTone(200, 'sawtooth', 0.5);
}

function useContinue() {
  // Acá iría la lógica de pago (IAP)
  // Por ahora es gratis para testing
  
  continueCount++;
  lives = 3;
  isInvincible = true;
  invincibleTimer = INVINCIBLE_DURATION * 2;  // Más tiempo de gracia
  
  // Limpiar balas enemigas (piedad)
  enemyBullets = [];
  mines = [];
  
  // Resetear posición de aliens (si no es boss)
  if (!boss.active) {
    // Subir todos los aliens vivos a su posición inicial
    enemies.forEach((e, index) => {
      if (e.alive) {
        e.y = 70 + e.row * 35;  // Posición Y inicial según fila
        e.diving = false;       // Cancelar diving
        e.vx = 0;
        e.vy = 0;
      }
    });
    enemyDir = 1;  // Resetear dirección
  }
  
  // Resetear posición del jugador
  player.x = W / 2 - player.width / 2;
  player.y = H - 40;
  
  state = 'playing';
  startMusic(boss.active ? 'boss' : 'normal');
  
  playTone(800, 'sine', 0.2);
  setTimeout(() => playTone(1000, 'sine', 0.2), 100);
  setTimeout(() => playTone(1200, 'sine', 0.3), 200);
  
  vibrate(100);
}

function declineContinue() {
  // ✅ RESETEAR SHAKE
  screenShake = 0;
  flashScreen = 0;
  
  // Verificar high score
  if (isHighScore(score)) {
    enteringName = true;
    playerName = '';
    state = 'entering_name';
  } else {
    state = 'menu';
    
    // Reset básico
    bullets = [];
    enemyBullets = [];
    enemies = [];
    powerUps = [];
    particles = [];
    mines = [];
    satellites = [];
    boss.active = false;
    player.weaponType = 'normal';
    player.weaponTimer = 0;
  }
  
  startMusic('menu');
}


// --- MUSIC SYSTEM (8-BIT TRACKER) ---
const NOTES = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00
};

const MUSIC_DATA = {
  normal: [
    // Melodía estilo Space Invaders mejorada
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'C2', l: 150 }, { n: 0, l: 50 },
    
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'G2', l: 150 }, { n: 0, l: 50 },
    { n: 'G2', l: 300 }, { n: 0, l: 100 },
    
    { n: 'C2', l: 150 }, { n: 0, l: 50 },
    { n: 'C2', l: 150 }, { n: 0, l: 50 },
    { n: 'G2', l: 150 }, { n: 0, l: 50 },
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    
    { n: 'D2', l: 150 }, { n: 0, l: 50 },
    { n: 'D2', l: 150 }, { n: 0, l: 50 },
    { n: 'B2', l: 300 }, { n: 0, l: 100 }
  ],
  
  boss: [
    // Tema boss más agresivo y rápido
    { n: 'C3', l: 80 }, { n: 'C3', l: 80 }, { n: 'C3', l: 80 }, { n: 0, l: 80 },
    { n: 'E3', l: 80 }, { n: 'E3', l: 80 }, { n: 'E3', l: 80 }, { n: 0, l: 80 },
    
    { n: 'F3', l: 80 }, { n: 'F3', l: 80 }, { n: 'F3', l: 80 }, { n: 0, l: 80 },
    { n: 'A3', l: 80 }, { n: 'A3', l: 80 }, { n: 'G3', l: 160 }, { n: 0, l: 80 },
    
    { n: 'C4', l: 80 }, { n: 0, l: 40 }, { n: 'B3', l: 80 }, { n: 0, l: 40 },
    { n: 'A3', l: 80 }, { n: 0, l: 40 }, { n: 'G3', l: 80 }, { n: 0, l: 40 },
    
    { n: 'F3', l: 160 }, { n: 0, l: 80 }, { n: 'E3', l: 160 }, { n: 0, l: 80 }
  ], 
  
  menu: [
    // Intro épica espacial
    { n: 'C3', l: 400 }, { n: 0, l: 100 },
    { n: 'G3', l: 400 }, { n: 0, l: 100 },
    { n: 'C4', l: 600 }, { n: 0, l: 200 },
    
    // Secuencia ascendente
    { n: 'E3', l: 300 }, { n: 'G3', l: 300 }, { n: 'C4', l: 300 }, { n: 'E4', l: 600 },
    { n: 0, l: 200 },
    
    // Caída dramática
    { n: 'D4', l: 400 }, { n: 'B3', l: 400 }, { n: 'G3', l: 400 }, { n: 'E3', l: 600 },
    { n: 0, l: 200 },
    
    // Resolución espacial
    { n: 'F3', l: 300 }, { n: 'A3', l: 300 }, { n: 'C4', l: 300 }, { n: 'F4', l: 800 },
    { n: 0, l: 400 },
    
    // Final épico
    { n: 'G3', l: 200 }, { n: 'A3', l: 200 }, { n: 'B3', l: 200 }, { n: 'C4', l: 400 },
    { n: 'E4', l: 400 }, { n: 'C4', l: 800 },
    { n: 0, l: 600 }
  ],
  
  gameover: [
    // Melodía dramática de game over (corta)
    { n: 'C4', l: 400 }, { n: 'B3', l: 400 }, { n: 'A3', l: 400 }, { n: 'G3', l: 400 },
    { n: 'F3', l: 400 }, { n: 'E3', l: 400 }, { n: 'D3', l: 400 }, { n: 'C3', l: 800 },
    { n: 0, l: 400 }
  ],
  victory: [
    // Fanfarria triunfal épica
    { n: 'C4', l: 200 }, { n: 'C4', l: 200 }, { n: 'C4', l: 200 }, { n: 'C4', l: 400 },
    { n: 'G3', l: 400 }, { n: 'A3', l: 400 }, { n: 'C4', l: 600 },
    { n: 0, l: 200 },
    { n: 'C4', l: 200 }, { n: 'D4', l: 200 }, { n: 'E4', l: 200 }, { n: 'F4', l: 200 },
    { n: 'G4', l: 600 }, { n: 'E4', l: 300 }, { n: 'G4', l: 800 },
    { n: 0, l: 300 },
    { n: 'A4', l: 200 }, { n: 'G4', l: 200 }, { n: 'F4', l: 200 }, { n: 'E4', l: 200 },
    { n: 'D4', l: 200 }, { n: 'E4', l: 200 }, { n: 'C4', l: 800 },
    { n: 0, l: 400 },
    { n: 'G4', l: 300 }, { n: 'G4', l: 300 }, { n: 'A4', l: 600 },
    { n: 'G4', l: 300 }, { n: 'F4', l: 300 }, { n: 'E4', l: 600 },
    { n: 'C4', l: 400 }, { n: 'E4', l: 400 }, { n: 'G4', l: 400 }, { n: 'C4', l: 1000 },
    { n: 0, l: 500 }
  ]

};
let audioCtx = null;
let musicInterval = null;
let musicIndex = 0;
let currentTrack = 'normal';
let isMuted = false;
let menuMusicStarted = false; // ✅ Nueva variable

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playMusicNote(freq, length) {
  if (isMuted || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + length / 1000);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + length / 1000);
}

function startMusic(trackName) {
  if (isMuted) return;
  initAudio();
  
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  
  currentTrack = trackName;
  musicIndex = 0;
  
  // ✅ Velocidad según el track
  const speed = trackName === 'boss' ? 100 : trackName === 'menu' ? 200 : 200;

  musicInterval = setInterval(() => {
    // ✅ Condición para cada tipo de música
    if (trackName === 'menu' && state !== 'menu') {
      clearInterval(musicInterval);
      musicInterval = null;
      return;
    }
    
    if (trackName === 'gameover' && state !== 'gameover') {
      clearInterval(musicInterval);
      musicInterval = null;
      return;
    }
    
    if (trackName !== 'menu' && trackName !== 'gameover' && state !== 'playing') {
      clearInterval(musicInterval);
      musicInterval = null;
      return;
    }
    
    const noteData = MUSIC_DATA[currentTrack][musicIndex];
    if (noteData.n !== 0) playMusicNote(NOTES[noteData.n], noteData.l);
    musicIndex = (musicIndex + 1) % MUSIC_DATA[currentTrack].length;
  }, speed);
}

// --- SFX ---
function playTone(freq, type, duration, vol = 0.1) {
  if (!audioCtx || isMuted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}


function playUfoSound() {
  if (!audioCtx || isMuted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

// ✅ NUEVO: Sonido de powerup
function playPowerupSound() {
  if (!audioCtx || isMuted) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

const MAX_PARTICLES = 100;

// --- STARS ---
function initStars() {
  stars = [];

  function addStar(count, speed, size, color, depth) {
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: speed + (Math.random() - 0.5) * speed * 0.3,  // ±15% variación
        size,
        color,
        depth,
        tw: Math.random() * 6.28,
        drift: (Math.random() - 0.5) * 0.25,  // más drift
        phase: Math.random() * 1000  // desfase para movimiento
      });
    }
  }

  // === 7 CAPAS DE PROFUNDIDAD ===
  
  // Capa 1: Muy muy lejos (casi estáticas, nebulosa)
  addStar(40, 0.4, 1, '#222', 0.05);
  
  // Capa 2: Muy lejos
  addStar(60, 0.8, 1, '#333', 0.12);
  
  // Capa 3: Lejos
  addStar(50, 1.2, 1, '#444', 0.20);
  
  // Capa 4: Medio-lejos
  addStar(40, 1.8, 1, '#555', 0.35);
  
  // Capa 5: Medio
  addStar(35, 2.5, 2, '#777', 0.50);
  
  // Capa 6: Cerca
  addStar(20, 3.5, 2, '#aaa', 0.70);
  
  // Capa 7: Muy cerca
  addStar(12, 4.5, 2, '#ccc', 0.85);
  
  // Capa 8: Destellos brillantes (primer plano)
  addStar(6, 5.5, 3, '#fff', 1.0);
}


initStars();

function createExplosion(x, y, color, count = 15) {
  const overflow = (particles.length + count + 8) - MAX_PARTICLES;
  if (overflow > 0) particles.splice(0, overflow);

  // Partículas principales
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1.0,
      gravity: 0.25,
      color,
      size: Math.random() * 3 + 2
    });
  }
  
  // Anillo expansivo
  particles.push({
    x, y,
    vx: 0, vy: 0,
    life: 0.6,
    gravity: 0,
    color,
    isRing: true,
    ringRadius: 5,
    ringExpand: 8
  });
  
  // Chispas rápidas
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 4;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.4,
      gravity: 0,
      color: '#fff',
      size: 1,
      isSpark: true
    });
  }
}

function spawnVictoryParticles() {
  for (let i = 0; i < 100; i++) {
    victoryParticles.push({
      x: Math.random() * W,
      y: -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -5 - 2,
      life: 1.0,
      color: currentPalette[Math.floor(Math.random() * 4)]
    });
  }
}

// --- GAME LOGIC ---
let isEnding = false;

function safeEndGame() {
  console.log('safeEndGame called, lives:', lives, 'isEnding:', isEnding);
  if (isEnding || state === 'continue') return;
  isEnding = true;
  endGame();
  setTimeout(() => { isEnding = false; }, 2000);
}

function startLevel() {
  initStars();
  powerUpsSpawnedThisLevel = 0;
  satellites = []; // ✅ Agregar
  mines = [];      // ✅ Agregar
  ufoRewards = [];
  
  // ✅ Verificar si este nivel tiene boss
  if (BOSS_LEVELS.includes(level)) {
    initBoss();
    startMusic('boss');
  } else {
    initEnemies();
    startMusic('normal');
  }
  
  currentPalette = PALETTES[(level - 1) % PALETTES.length];
  container.style.boxShadow = `0 0 60px ${currentPalette[0]}40`;
  ufo.active = false;
  bullets = [];
  enemyBullets = [];

  // ✅ PARALLAX: referencia inicial para evitar “tirón” al arrancar el nivel
  prevPlayerX = player.x;
  prevPlayerY = player.y;
}


// --- FORMACIONES DE ENEMIGOS ---
function getFormation(levelNum) {
  const formations = ['classic', 'vshape', 'diamond', 'zigzag'];

  // cuántos bosses ya pasaron antes de este nivel
  const bossesBefore = BOSS_LEVELS.filter(b => b < levelNum).length;

  // índice real solo contando niveles normales
  const nonBossIndex = (levelNum - bossesBefore) - 1; // 0-based

  return formations[nonBossIndex % formations.length];
}

// Determinar tipo de oleada según nivel
function getWaveType(levelNum) {
  if (BOSS_LEVELS.includes(levelNum)) return 'boss';
  
  // Oleada especial cada 4 niveles
  if (levelNum % 4 === 0) {
    const waveIndex = Math.floor(levelNum / 4) % 5;
    const specialWaves = ['swarm', 'tanks', 'kamikazes', 'splitters', 'mixed'];
    return specialWaves[waveIndex];
  }
  
  return 'normal';
}

// Determinar tipo de enemigo según fila y nivel
function getEnemyTypeForRow(row, levelNum) {
  // Niveles bajos: solo alien1 y alien2
  if (levelNum <= 3) {
    return row < 2 ? 'alien1' : 'alien2';
  }
  
  // Niveles medios: introducir alien3 y alien4
  if (levelNum <= 8) {
    if (row === 0) return 'alien3';  // Tanque arriba
    if (row < 2) return 'alien1';
    if (row === 4 && Math.random() < 0.3) return 'alien4';  // Veloz abajo
    return 'alien2';
  }
  
  // Niveles altos: mezcla con todos
  if (row === 0 && Math.random() < 0.5) return 'alien3';
  if (row === 1 && Math.random() < 0.3) return 'alien6';  // Splitter
  if (row < 3) return 'alien1';
  if (row === 4 && Math.random() < 0.4) return 'alien5';  // Kamikaze
  if (Math.random() < 0.3) return 'alien4';
  return 'alien2';
}

// Helper para crear enemigo con stats
function createEnemy(x, y, row, type) {
  const data = ENEMY_TYPES[type] || ENEMY_TYPES.alien1;
  const spriteKey = type + '_a';
  const sprite = SPRITES[spriteKey];
  
  const w = sprite ? sprite[0].length * 3 : 24;
  const h = sprite ? sprite.length * 3 : 24;
  
  return {
    x, y, w, h, row, type,
    hp: data.hp,
    maxHp: data.hp,
    speedMult: data.speed,
    points: data.points,
    alive: true,
    diving: false,
    vx: 0, vy: 0,
    flashTimer: 0  // Para feedback visual de daño
  };
}



function createFormation(formation) {
  const newEnemies = [];
  const waveType = getWaveType(level);
  
  // OLEADAS ESPECIALES
  if (waveType === 'swarm') {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 10; c++) {
        newEnemies.push(createEnemy(20 + c * 32, 60 + r * 28, r, 'alien4'));
      }
    }
    return newEnemies;
  }
  
  if (waveType === 'tanks') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        newEnemies.push(createEnemy(40 + c * 60, 70 + r * 45, r, 'alien3'));
      }
    }
    return newEnemies;
  }
  
  if (waveType === 'kamikazes') {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 7; c++) {
        newEnemies.push(createEnemy(35 + c * 42, 60 + r * 35, r, 'alien5'));
      }
    }
    return newEnemies;
  }
  
  if (waveType === 'splitters') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        newEnemies.push(createEnemy(45 + c * 55, 70 + r * 45, r, 'alien6'));
      }
    }
    return newEnemies;
  }
  
  if (waveType === 'mixed') {
    const types = ['alien1', 'alien2', 'alien3', 'alien4', 'alien5', 'alien6'];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        const type = types[Math.floor(Math.random() * types.length)];
        newEnemies.push(createEnemy(35 + c * 42, 65 + r * 35, r, type));
      }
    }
    return newEnemies;
  }
  
  // FORMACIONES NORMALES
  if (formation === 'classic') {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        const type = getEnemyTypeForRow(r, level);
        newEnemies.push(createEnemy(30 + c * 38, 70 + r * 35, r, type));
      }
    }
  }
  
  else if (formation === 'vshape') {
    for (let r = 0; r < 5; r++) {
      const cols = 6;
      const offsetX = r * 30;
      for (let c = 0; c < cols; c++) {
        const type = getEnemyTypeForRow(r, level);
        newEnemies.push(createEnemy(20 + offsetX + c * 38, 70 + r * 35, r, type));
      }
    }
  }
  
  else if (formation === 'diamond') {
    const rows = [2, 4, 6, 4, 2];
    for (let r = 0; r < 5; r++) {
      const cols = rows[r];
      const startX = W / 2 - (cols * 38) / 2;
      for (let c = 0; c < cols; c++) {
        const type = getEnemyTypeForRow(r, level);
        newEnemies.push(createEnemy(startX + c * 38, 70 + r * 35, r, type));
      }
    }
  }
  
  else if (formation === 'zigzag') {
    for (let r = 0; r < 5; r++) {
      const zigOffset = (r % 2) * 25;
      const startX = 35;
      for (let c = 0; c < 7; c++) {
        const type = getEnemyTypeForRow(r, level);
        newEnemies.push(createEnemy(startX + zigOffset + c * 42, 70 + r * 35, r, type));
      }
    }
  }
  
  return newEnemies;
}

function initEnemies() {
  boss.active = false;
  
  // ✅ Obtener formación según el nivel
  const formation = getFormation(level);
  enemies = createFormation(formation);

  const stage = Math.floor((level - 1) / 5);
  enemySpeedX = 0.65 + stage * 0.4;
  enemyDir = 1;
}

function initBoss() {
  enemies = [];
  
  // ✅ Resetear flags de patrones anteriores
    delete boss.crabInit;
  delete boss.divebombInit;
  delete boss.supremeInit;
  delete boss.orbitDir;
  delete boss.orbitChangeTimer;
  delete boss.pulseMode;
  delete boss.pulseTimer;
  delete boss.chargeMode;
  delete boss.retreating;
  delete boss.isTeleporting
  
  // ✅ Cargar datos específicos del boss según el nivel
  const bossData = BOSS_DATA[level];
  
  boss.active = true;
  boss.name = bossData.name;
  boss.pattern = bossData.pattern;
  
 // ✅ Ajustar tamaño según el boss
  if (boss.pattern === 'zigzag') {
    boss.w = 100;  // 20 columnas × 5
    boss.h = 55;   // ✅ Más alto para mejor proporción (antes 45)
  } else if (boss.pattern === 'rotate') {
    boss.w = 90;   // Orbital mantiene tamaño
    boss.h = 50;   // Pero es más alto (10 filas)
  } else if (boss.pattern === 'supreme') {
    boss.w = 90;   // Emperador
    boss.h = 60;   // ✅ Más alto (12 filas ahora)
  } else {
    boss.w = 90;   // Resto mantiene tamaño normal
    boss.h = 45;
  }
   
  boss.color = bossData.color;
  boss.x = W / 2 - boss.w / 2;
  boss.y = 100;
  boss.maxHp = bossData.baseHp;
  boss.hp = boss.maxHp;
  boss.dir = 1;
  boss.shootTimer = 0;
  boss.phase = 1;
  
  // Limpiar satélites anteriores
  satellites = [];
  
  // Crear satélites para ORBITAL
  if (boss.pattern === 'rotate') {
    const satCount = 2; // 2 satélites iniciales
    for (let i = 0; i < satCount; i++) {
      satellites.push({
        angle: (Math.PI * 2 * i) / satCount, // Distribuidos uniformemente
        distance: 60,
        radius: 8,
        shootTimer: Math.random() * 1000 // Desfasados para no disparar todos juntos
      });
    }
  }
  
  playTone(100, 'sawtooth', 1.5, 0.5);
}

function getBossPhase() {
  if (!boss.active || boss.maxHp <= 0) return 1;

  const hpPct = boss.hp / boss.maxHp;

  if (hpPct > 0.66) return 1;
  if (hpPct > 0.33) return 2;
  return 3;
}


function spawnRandomPowerUp(x, y) {
  const r = Math.random();
  let type;

  // ✅ Comunes -> Raros (suma 1.0)
  if (r < 0.45) type = 'double';        // 45% (más común)
  else if (r < 0.75) type = 'spread';   // 30% (común)
  else if (r < 0.92) type = 'machine';  // 17% (raro)
  else type = 'laser';                  // 8%  (muy raro)

  powerUps.push({ x, y, w: 12, h: 12, vy: 2, type });
}

function spawnUfoRewardDrop(x, y) {
  const r = Math.random();
  let reward = null;

  if (r < 0.35) reward = { kind: 'weapon', type: 'laser', duration: 12000 };
  else if (r < 0.55) reward = { kind: 'weapon', type: 'machine', duration: 10000 };
  else if (r < 0.75) {
    // 20% del total - mix de vida, score, shield
    const roll = Math.random();
    if (roll < 0.5) reward = { kind: 'life' };  // 10% vida
    else if (roll < 0.8) reward = { kind: 'score', amount: 3000 };
    else reward = { kind: 'shield', duration: 2000 };
  } else {
    reward = { kind: 'score', amount: 5000, rare: true };
  }

  ufoRewards.push({
    x, y,
    w: 16, h: 16,
    vy: 2.2,
    reward,
    t: 0
  });

  playPowerupSound();
}




function trySpawnPowerUp(x, y, chance) {
  if (
    player.weaponType !== 'normal' ||
    globalTime < nextPowerUpTime ||
    powerUps.length >= MAX_ACTIVE_POWERUPS ||
    powerUpsSpawnedThisLevel >= MAX_POWERUPS_PER_LEVEL ||
    Math.random() >= chance
  ) return false;

  spawnRandomPowerUp(x, y);
  powerUpsSpawnedThisLevel++;
  nextPowerUpTime = globalTime + POWERUP_COOLDOWN;
  return true;
}


function activateWeapon(type) {
  // Duración según rareza
  const durations = {
    double: 10000,   // 8s - común
    spread: 10000,   // 7s - común
    machine: 8000,   // 7s  - raro
    laser: 6000      // 6s  - muy raro
  };
  
  const duration = durations[type] || 10000;
  
  // Acumulable si es el mismo tipo
  if (player.weaponType === type) {
    player.weaponTimer += 5000;  // +5 segundos
    playTone(1200, 'sine', 0.15);  // Sonido de bonus
  } else {
    player.weaponType = type;
    player.weaponTimer = duration;
    playPowerupSound();
  }
  
  vibrate(50);
}

function getWeaponColor(type) {
  if (type === 'double') return '#ff0';
  if (type === 'spread') return '#0f0';
  if (type === 'machine') return '#f0f';
  if (type === 'laser') return '#0ff';
  return '#fff';
}


// --- UPDATE ---
function update(dt) {
  // ✅ NAVEGACIÓN CON JOYSTICK (cooldown universal) - PRIMERO
  if ((state === 'entering_name' || state === 'menu' || state === 'scores' || state === 'options' || state === 'paused') && joystickInputCooldown > 0) {
    joystickInputCooldown -= dt;
  }

  // ✅ Tiempo global (SIEMPRE se actualiza para animaciones)
  globalTime += dt;

  // ✅ Estrellas siempre se mueven (efecto visual en pausa/options)
  stars.forEach(s => {
    s.y += s.speed * 0.5;
    if (s.y > H + 10) {
      s.y = -10;
      s.x = Math.random() * W;
    }
  });

  // ⏸️ Pausa real: nada más avanza
  if (state === 'paused' || state === 'options' || state === 'entering_name' || state === 'menu') return;

  // Continue countdown
  if (state === 'continue') {
    const prevSeconds = Math.ceil(continueTimer / 1000);
    continueTimer -= dt;
    const newSeconds = Math.ceil(continueTimer / 1000);
    
    // Sonido cada segundo
    if (newSeconds !== prevSeconds && newSeconds > 0) {
      if (newSeconds <= 3) {
        // Últimos 3 segundos - más urgente
        playTone(800, 'square', 0.15);
      } else {
        // Segundos normales
        playTone(500, 'sine', 0.1);
      }
    }
    
    if (continueTimer <= 0) {
      declineContinue();
    }
    // Actualizar estrellas para que el fondo se vea vivo
    stars.forEach(s => {
      s.y += s.speed * 0.5;
      if (s.y > H + 10) {
        s.y = -10;
        s.x = Math.random() * W;
      }
    });
    return;
  }

 
  // Normaliza a "frames de 60fps"
  const step = dt / 16.6667;

  // Animación global (parpadeos, UFO, etc.)
  animationFrame = Math.floor(globalTime / 500) % 2;

  // Actualizar invencibilidad
if (isInvincible) {
  invincibleTimer -= dt;
  if (invincibleTimer <= 0) {
    isInvincible = false;
    invincibleTimer = 0;
  }
}


  if (screenShake > 0) { screenShake -= dt * 0.8; if (screenShake < 0) screenShake = 0; }
  if (flashScreen > 0) { flashScreen -= dt * 0.1; if (flashScreen < 0) flashScreen = 0; }

  // ✅ No dispares durante el warp de fin de nivel
  if (state === 'playing' && !pendingNextLevel && isFiring) fire();

  // ✅ WARP FIN DE NIVEL (real, con timer)
  const aliveCount = enemies.filter(e => e.alive).length;

  // ✅ CORREGIDO: No activar warp si hay boss activo
  if (state === 'playing' && !boss.active && aliveCount === 0 && !pendingNextLevel) {
    pendingNextLevel = true;
    levelClearTimer = 900;
    screenShake = Math.max(screenShake, 10);
    playTone(1200, 'sine', 0.08);
  }

  const isWarping = (state === 'playing' && pendingNextLevel);
  const targetWarp = isWarping ? 20 : 1;
  warpSpeed += (targetWarp - warpSpeed) * 0.08;

  // ✅ Parallax por movimiento del player (se siente 3D)
const dx = player.x - prevPlayerX;
const dy = player.y - prevPlayerY;
prevPlayerX = player.x;
prevPlayerY = player.y;

stars.forEach(s => {
  // scroll principal (warp)
  s.y += s.speed * warpSpeed * step;

  // parallax: estrellas cercanas se mueven más con tu movimiento
  // (lejos = casi no se mueven)
  const px = dx * (0.25 + s.depth * 0.85);
  const py = dy * (0.10 + s.depth * 0.35);

  s.x -= px;
  s.y -= py;

  // drift sutil (vida)
  s.x += s.drift * step;

  // wrap horizontal
  if (s.x < -10) s.x = W + 10;
  if (s.x > W + 10) s.x = -10;

  // wrap vertical
  // wrap vertical con redistribución
  if (s.y > H + 10) { 
    s.y = -10 - Math.random() * 20;  // aparece en altura aleatoria arriba
    s.x = Math.random() * W; 
    s.drift = (Math.random() - 0.5) * 0.25;  // nuevo drift
  }
  if (s.y < -20) { 
    s.y = H + 10 + Math.random() * 20; 
    s.x = Math.random() * W; 
    s.drift = (Math.random() - 0.5) * 0.25;
  }
});

  
  

  if (pendingNextLevel) {
    levelClearTimer -= dt;
    if (levelClearTimer <= 0) {
      pendingNextLevel = false;
      level++;
      addScore(1000);
      startLevel();
    }
  }

  if (state === 'playing') {
  // --- Movimiento con step ---
  if (player.movingLeft)  player.x -= player.speed * step;
  if (player.movingRight) player.x += player.speed * step;
  if (player.movingUp)    player.y -= player.speedY * step;
  if (player.movingDown)  player.y += player.speedY * step;

  // --- Límites ---
  const minY = H * 0.45;
  const maxY = H - 60;

  player.x = Math.max(0, Math.min(W - player.width, player.x));
  player.y = Math.max(minY, Math.min(maxY, player.y));

  // --- Weapon timer ---
  if (player.weaponType !== 'normal') {
    player.weaponTimer -= dt;
    if (player.weaponTimer <= 0) {
      player.weaponType = 'normal';
      playTone(400, 'triangle', 0.2);
    }
  }


    // Boss movement + shooting
if (boss.active) {

  // Actualizar flash del boss
  if (boss.flashTimer > 0) boss.flashTimer -= dt;

  const phase = getBossPhase();

  // 🔥 MEJORA 4: modo desesperación (fase 3)

// Velocidad según fase (continua)
const patternOverridesMove =
  (boss.pattern === 'zigzag' ||
   boss.pattern === 'rotate' ||
   boss.pattern === 'supreme' ||
   boss.pattern === 'divebomb');

if (!patternOverridesMove) {
  boss.speed = (phase === 3) ? 3.5 : 2;

  // Movimiento horizontal
  boss.x += boss.speed * boss.dir;
  if (boss.x < 10 || boss.x + boss.w > W - 10) {
    boss.dir *= -1;
  }

  // Movimiento vertical suave (fase 2+)
  if (phase >= 2) {
    boss.y = Math.max(
      80,
      Math.min(H - boss.h - 50, 120 + Math.sin(globalTime * 0.002) * 30 * (phase / 3))
    );
  } else {
    boss.y = Math.max(80, Math.min(H - boss.h - 50, 100));
  }
}

// ✅ IA BASE: Evalúa comportamiento del jugador
const playerDist = Math.hypot(player.x - boss.x, player.y - boss.y);
const playerFiring = isFiring || bullets.length > 5;
boss.aiTimer = (boss.aiTimer || 0) + dt;

// ✅ IA solo para bosses específicos (NO zigzag, rotate, supreme)
const useAI = (boss.pattern === 'crossfire' || boss.pattern === 'divebomb');

if (useAI && playerDist < 150 && boss.pattern !== 'divebomb') {
  // Player cerca → esquivar (excepto divebomb que QUIERE estar cerca)
  boss.state = 'evade';
} else if (useAI && playerFiring && boss.aiTimer > 300) {
  // Player dispara mucho → contraataque
  boss.state = 'counter';
  boss.aiTimer = 0;
} else {
  boss.state = 'aggressive';
}

// ✅ Aplicar IA al movimiento (solo si useAI es true)
if (useAI) {
  switch (boss.state) {
    case 'evade':
      // Esquiva perpendicular al jugador
      const evadeAngle = Math.atan2(player.y - boss.y, player.x - boss.x) + Math.PI / 2;
      boss.x += Math.cos(evadeAngle) * 2 * step;
      boss.y += Math.sin(evadeAngle) * 1.5 * step;

      boss.x = Math.max(30, Math.min(W - boss.w - 30, boss.x));
      boss.y = Math.max(80, Math.min(H - boss.h - 80, boss.y));
      break;
      
    case 'counter':
      // Acelera + marca flag para disparo extra
      boss.speed = Math.min((boss.speed || 2) * 1.05, 5);
      boss.counterFlag = true;
      break;
      
    case 'aggressive':
      // Velocidad normal según fase
      boss.speed = (phase === 3) ? 3.5 : 2;
      boss.counterFlag = false;
      break;
  }
} // ✅ CERRAR el if (useAI)



// ✅ Patrones ÚNICOS (sobrescriben x/y si aplica)
switch (boss.pattern) {

  case 'crossfire': {
    // CRABTRON: Movimiento de cangrejo + dash lateral
    if (boss.crabInit === undefined) {
      boss.crabInit = true;
      boss.dashMode = false;
      boss.dashTimer = 0;
      boss.dashTargetX = 0;
      boss.dashCooldown = 3000;
      boss.advanceTimer = 0;
      boss.crabVx = 0;
      boss.crabVy = 0;
    }
    
    boss.dashCooldown -= dt;
    boss.advanceTimer += dt;
    
    if (boss.dashMode) {
      // DASH en progreso
      const dx = boss.dashTargetX - boss.x;
      const speed = 12;
      
      boss.crabVx = boss.crabVx * 0.8 + (dx > 0 ? speed : -speed) * 0.2;
      boss.x += boss.crabVx * step;
      
      boss.dashTimer -= dt;
      
      if (boss.dashTimer <= 0 || Math.abs(dx) < 20) {
        boss.dashMode = false;
        boss.dashCooldown = 2500 + Math.random() * 1500;
        boss.crabVx = 0;
        
        // Disparo de pinzas al terminar dash
        enemyBullets.push(
          { x: boss.x + 10, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -3, vy: 3 },
          { x: boss.x + boss.w - 10, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 3, vy: 3 }
        );
        playTone(200, 'square', 0.15);
      }
    } else {
      // Movimiento normal de cangrejo
      const patrolSpeed = 1.8 + phase * 0.5;
      const targetVx = patrolSpeed * boss.dir;
      boss.crabVx = boss.crabVx * 0.9 + targetVx * 0.1;
      boss.x += boss.crabVx * step;
      
      // Rebote en bordes
      if (boss.x < 20 || boss.x + boss.w > W - 20) {
        boss.dir *= -1;
        boss.x = clamp(boss.x, 20, W - boss.w - 20);
      }
      
      // Avance/retroceso ocasional (movimiento de cangrejo)
      if (boss.advanceTimer > 2000) {
        boss.advanceTimer = 0;
        const advanceDir = (boss.y < 130) ? 1 : (Math.random() < 0.6 ? 1 : -1);
        boss.crabVy = advanceDir * 2;
      }
      
      boss.crabVy *= 0.95;
      boss.y += boss.crabVy * step;
      boss.y = clamp(boss.y, 80, 160);
      
      // Iniciar DASH (fase 2+ o random)
      if (boss.dashCooldown <= 0 && (phase >= 2 || Math.random() < 0.3)) {
        boss.dashMode = true;
        boss.dashTimer = 600;
        // Dash hacia el jugador o lado opuesto
        if (Math.random() < 0.7) {
          boss.dashTargetX = player.x - boss.w / 2;
        } else {
          boss.dashTargetX = boss.x > W / 2 ? 30 : W - boss.w - 30;
        }
        boss.dashTargetX = clamp(boss.dashTargetX, 30, W - boss.w - 30);
        
        screenShake = 5;
        playTone(400, 'sawtooth', 0.2);
      }
    }
    
    // Clamp final
    boss.x = clamp(boss.x, 10, W - boss.w - 10);
    boss.y = clamp(boss.y, 60, H - boss.h - 60);
    break;
  }

  case 'zigzag':
    // SERPENTRIX: Movimiento de serpiente (doble onda)
    const zigFreq = 0.004 * (1 + phase * 0.3);
    const zigAmp = 140 - (phase * 15);
    
    boss.x = Math.max(20, Math.min(W - boss.w - 20, W / 2 + Math.sin(globalTime * zigFreq) * zigAmp));
    
    const vertFreq = 0.006 * (1 + phase * 0.2);
    const vertAmp = 40 + (phase * 15);
    const baseY = 120;
    
    if (playerFiring && phase >= 2) {
      boss.y += 0.2 * step;
      boss.y = Math.min(boss.y, H / 2 - 20);
    } else {
      boss.y = baseY + Math.cos(globalTime * vertFreq) * vertAmp;
    }
    break;

  case 'rotate':
    // ORBITAL: Órbita elíptica variable + cambio de dirección
    if (!boss.orbitDir) boss.orbitDir = 1;
    if (!boss.orbitChangeTimer) boss.orbitChangeTimer = 0;
    if (!boss.pulseMode) boss.pulseMode = false;
    if (!boss.pulseTimer) boss.pulseTimer = 0;
    
    boss.orbitChangeTimer += dt;
    
    if (boss.orbitChangeTimer > 4000 + Math.random() * 2000) {
      boss.orbitDir *= -1;
      boss.orbitChangeTimer = 0;
      playTone(400, 'sine', 0.1);
    }
    
    if (phase >= 2 && !boss.pulseMode && Math.random() < 0.002) {
      boss.pulseMode = true;
      boss.pulseTimer = 1500;
    }
    
    if (boss.pulseMode) {
      const targetX = W / 2 - boss.w / 2;
      const targetY = 130;
      boss.x += (targetX - boss.x) * 0.05;
      boss.y += (targetY - boss.y) * 0.05;
      boss.pulseTimer -= dt;
      
      if (boss.pulseTimer <= 0) {
        boss.pulseMode = false;
      }
    } else {
      const rotSpeed = 0.002 * phase * boss.orbitDir;
      const radiusX = 100 + Math.sin(globalTime * 0.0005) * 30;
      const radiusY = 40 + phase * 10;
      
      boss.x = Math.max(30, Math.min(W - boss.w - 30, W / 2 + Math.cos(globalTime * rotSpeed) * radiusX));
      boss.y = Math.max(80, Math.min(H - boss.h - 80, 140 + Math.sin(globalTime * rotSpeed) * radiusY));
    }
    break;

  case 'divebomb': {
    // TENIENTE: Embestida diagonal + patrullaje agresivo (SUAVE)

    // init una sola vez por boss
    if (boss.divebombInit === undefined) {
      boss.divebombInit = true;
      boss.chargeMode = false;
      boss.retreating = false;
      boss.telegraphTimer = 0;
      boss.chargeTimer = 0;
      boss.chargeTargetX = W / 2;
      boss.chargeTargetY = 140;

      boss.vx = 0;
      boss.vy = 0;
    }

    const clampTargetX = (tx) => clamp(tx, 20 + boss.w / 2, W - 20 - boss.w / 2);
    const clampTargetY = (ty) => clamp(ty, 80, H / 2 + 60);

    if (boss.chargeMode) {

      // TELEGRAPH
      if (boss.telegraphTimer > 0) {
        boss.telegraphTimer -= dt;

        boss.x += (Math.random() - 0.5) * 2.0 * step;
        boss.y += (Math.random() - 0.5) * 0.8 * step;
        screenShake = Math.max(screenShake, 2);

        boss.vx *= 0.85;
        boss.vy *= 0.85;

      } else {
        // CARGA
        const tx = boss.chargeTargetX;
        const ty = boss.chargeTargetY;

        const dx = tx - (boss.x + boss.w / 2);
        const dy = ty - (boss.y + boss.h / 2);
        const dist = Math.max(1, Math.hypot(dx, dy));

        const speed = 9.0;
        const dvx = (dx / dist) * speed;
        const dvy = (dy / dist) * speed;

        boss.vx = boss.vx * 0.82 + dvx * 0.18;
        boss.vy = boss.vy * 0.82 + dvy * 0.18;

        boss.x += boss.vx * step;
        boss.y += boss.vy * step;

        // LLEGÓ
        if (dist < 22) {
          boss.x = tx - boss.w / 2;
          boss.y = ty - boss.h / 2;

          boss.chargeMode = false;
          boss.retreating = true;
          boss.chargeTimer = 950;

          // 💣 descarga radial al impactar
          const bombCount = 8 + phase * 2;
          for (let i = 0; i < bombCount; i++) {
            const ang = (Math.PI * 2 * i / bombCount);
            enemyBullets.push({
              x: boss.x + boss.w / 2,
              y: boss.y + boss.h,
              w: 8, h: 8,
              vx: Math.cos(ang) * 4,
              vy: Math.sin(ang) * 4
            });
          }

          screenShake = Math.max(screenShake, 12);
          playTone(120, 'sawtooth', 0.35);
          createExplosion(boss.x + boss.w / 2, boss.y + boss.h, '#ff0', 25);

          boss.vx = 0;
          boss.vy = 0;
        }
      }

    } else if (boss.retreating) {
      // RETIRADA
      boss.chargeTimer -= dt;

      boss.vy = boss.vy * 0.8 + (-3.0) * 0.2;
      boss.y += boss.vy * step;

      if (boss.y < 80) boss.y = 80;

      if (boss.chargeTimer <= 0) {
        boss.retreating = false;
        boss.vx = 0;
        boss.vy = 0;
      }

    } else {
      // PATRULLA
      const patrolSpeed = 2.2 + phase * 0.6;

      const targetVx = patrolSpeed * boss.dir;
      boss.vx = boss.vx * 0.85 + targetVx * 0.15;

      const desiredY = 105 + Math.sin(globalTime * 0.003) * 28;
      const ddy = desiredY - boss.y;
      boss.vy = boss.vy * 0.85 + (ddy * 0.06) * 0.15;

      boss.x += boss.vx * step;
      boss.y += boss.vy * step;

      if (boss.x < 20 || boss.x + boss.w > W - 20) {
        boss.dir *= -1;
        boss.x = clamp(boss.x, 20, W - boss.w - 20);
        boss.vx = 0;
      }

      // Chance de embestida
      if (Math.random() < 0.004) {
        boss.chargeMode = true;
        boss.telegraphTimer = 650;

        boss.chargeTargetX = clampTargetX(player.x + player.width / 2);
        boss.chargeTargetY = clampTargetY(Math.min(player.y - 55, H / 2 + 60));

        playTone(600, 'square', 0.18);
      }
    }

    // clamp final
    boss.x = clamp(boss.x, 10, W - boss.w - 10);
    boss.y = clamp(boss.y, 60, H - boss.h - 60);
    break;
  }

  case 'supreme': {
    // EMPERADOR: Teletransporte + Furia + Invocación
    if (boss.supremeInit === undefined) {
      boss.supremeInit = true;
      boss.teleportTimer = 0;
      boss.teleportCooldown = 5000;
      boss.isTeleporting = false;
      boss.teleportFlash = 0;
      boss.minionTimer = 0;
      boss.supremeVx = 0;
      boss.supremeVy = 0;
    }
    
    boss.teleportTimer += dt;
    boss.minionTimer += dt;
    
    // TELETRANSPORTE (fase 2+)
    if (boss.isTeleporting) {
      boss.teleportFlash -= dt;
      if (boss.teleportFlash <= 0) {
        // Reaparecer en nueva posición
        boss.x = 30 + Math.random() * (W - boss.w - 60);
        boss.y = 80 + Math.random() * 60;
        boss.isTeleporting = false;
        boss.teleportCooldown = 4000 + Math.random() * 2000;
        
        // Onda de choque al reaparecer (reducida)
        const waveCount = 4 + phase;
        for (let i = 0; i < waveCount; i++) {
          const ang = (Math.PI * 2 * i / waveCount);
          enemyBullets.push({
            x: boss.x + boss.w / 2,
            y: boss.y + boss.h / 2,
            w: 8, h: 8,
            vx: Math.cos(ang) * 3,
            vy: Math.sin(ang) * 3
          });
        }
        
        screenShake = 15;
        playTone(200, 'sawtooth', 0.3);
        createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#fff', 20);
      }
    } else {
      // Movimiento normal por fase
      if (phase === 1) {
        // Fase 1: Oscilación majestuosa centrada
        boss.x = W / 2 - boss.w / 2 + Math.sin(globalTime * 0.002) * 80;
        boss.y = 100 + Math.sin(globalTime * 0.003) * 15;
        
      } else if (phase === 2) {
        // Fase 2: Más agresivo + teletransporte
        const targetX = W / 2 + Math.sin(globalTime * 0.004) * 100;
        boss.supremeVx = boss.supremeVx * 0.85 + (targetX - boss.x) * 0.03;
        boss.x += boss.supremeVx * step;
        boss.y = 100 + Math.sin(globalTime * 0.005) * 25;
        
        // Activar teletransporte
        if (boss.teleportTimer > boss.teleportCooldown) {
          boss.teleportTimer = 0;
          boss.isTeleporting = true;
          boss.teleportFlash = 500;
          screenShake = 8;
          playTone(800, 'sine', 0.2);
          createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#ff0', 15);
        }
        
      } else {
        // Fase 3: MODO FURIA - persigue + teletransporte frecuente
        const dx = player.x - boss.x;
        const dy = player.y - boss.y - 100;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        
        boss.supremeVx = boss.supremeVx * 0.8 + (dx / dist) * 3 * 0.2;
        boss.supremeVy = boss.supremeVy * 0.8 + (dy / dist) * 2 * 0.2;
        
        boss.x += boss.supremeVx * step + Math.sin(globalTime * 0.008) * 3 * step;
        boss.y += boss.supremeVy * step;
        
        // Teletransporte en fase 3 (menos frecuente)
        if (boss.teleportTimer > boss.teleportCooldown * 0.8) {
          boss.teleportTimer = 0;
          boss.isTeleporting = true;
          boss.teleportFlash = 400;
          screenShake = 10;
          playTone(900, 'sine', 0.2);
          createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f00', 20);
        }
      }
      
      // INVOCAR MINIONS (fase 2+, cada 10 segundos)
      if (phase >= 2 && boss.minionTimer > 10000 && enemies.filter(e => e.alive).length < 2) {
        boss.minionTimer = 0;
        
        // Spawnear 1-2 minions
        const minionCount = phase === 3 ? 2 : 1;
        for (let i = 0; i < minionCount; i++) {
          const spawnX = boss.x + boss.w / 2 + (i - Math.floor(minionCount / 2)) * 50;
          const angle = Math.atan2(player.y - (boss.y + boss.h), player.x - spawnX);
          const speed = 3 + Math.random() * 2;
          
          enemies.push({
            x: clamp(spawnX, 30, W - 54),
            y: boss.y + boss.h + 10,
            w: 24, h: 24,
            row: 0,
            type: 'alien1',
            alive: true,
            diving: true,
            vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
            vy: Math.sin(angle) * speed + 1
          });
        }
        
        playTone(300, 'square', 0.2);
        screenShake = 5;
        createExplosion(boss.x + boss.w / 2, boss.y + boss.h, '#f0f', 10);
      }
    }
    
    // Clamp final - no baja tanto
    boss.x = clamp(boss.x, 10, W - boss.w - 10);
    boss.y = clamp(boss.y, 70, 180);
    break;
  }
}

boss.shootTimer += dt;

// ✅ CONTRAATAQUE INMEDIATO (fuera del timer normal)
if (boss.counterFlag) {
  const dx = player.x + player.width / 2 - boss.x;
  const dy = player.y - boss.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // 2 balas homing rápidas (rojas para que se vean)
  enemyBullets.push(
    {
      x: boss.x + boss.w / 2 - 10,
      y: boss.y + boss.h,
      w: 10,  // ✅ Más grandes para que se vean
      h: 20,
      vx: (dx / dist) * 7,
      vy: (dy / dist) * 7
    },
    {
      x: boss.x + boss.w / 2 + 10,
      y: boss.y + boss.h,
      w: 10,
      h: 20,
      vx: (dx / dist) * 7,
      vy: (dy / dist) * 7
    }
  );
  
  playTone(300, 'square', 0.15); // Sonido grave de contraataque
  screenShake = Math.max(screenShake, 5);
  boss.counterFlag = false; // Reset
}

// Cadencia según fase (más agresiva)
let shootRate = Math.max(600, 1800 - level * 40);
if (phase === 3) shootRate *= 0.6;

if (boss.shootTimer > shootRate) {
  boss.shootTimer = 0;

  // ✅ Chance de soltar powerup
  if (Math.random() < 0.08) {
    spawnRandomPowerUp(boss.x + boss.w / 2 - 6, boss.y + boss.h);
    playPowerupSound();
  }

  // ✅ PATRONES DE DISPARO ÚNICOS (con variación)
  switch(boss.pattern) {
    case 'crossfire':
      // CRABTRON: No disparar durante dash
      if (boss.dashMode) break;
      
      const crabCenter = { x: boss.x + boss.w / 2, y: boss.y + boss.h };
      const attackType = Math.random();
      
      if (attackType < 0.4) {
        // Cruz + diagonal alterna (original)
        const useDiagonal = Math.random() < 0.5;
        if (useDiagonal) {
          enemyBullets.push(
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 3, vy: 3 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: -3, vy: 3 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 3, vy: -2 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: -3, vy: -2 }
          );
        } else {
          enemyBullets.push(
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 0, vy: 4 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: 4, vy: 0 },
            { x: crabCenter.x, y: boss.y + boss.h / 2, w: 6, h: 6, vx: -4, vy: 0 }
          );
        }
      } else if (attackType < 0.7) {
        // PINZAS: Disparo desde los costados
        enemyBullets.push(
          { x: boss.x + 5, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -2, vy: 4 },
          { x: boss.x + boss.w - 5, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 2, vy: 4 }
        );
        
        // En fase 2+, las pinzas también disparan hacia el jugador
        if (phase >= 2) {
          const dx = player.x + player.width / 2 - crabCenter.x;
          const dy = player.y - boss.y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          
          enemyBullets.push(
            { x: boss.x + 10, y: boss.y + boss.h, w: 6, h: 10, vx: (dx / dist) * 3 - 1, vy: (dy / dist) * 3 },
            { x: boss.x + boss.w - 10, y: boss.y + boss.h, w: 6, h: 10, vx: (dx / dist) * 3 + 1, vy: (dy / dist) * 3 }
          );
        }
      } else if (phase >= 2) {
        // LÁSER VERTICAL: Columna de balas que sale del cangrejo hacia abajo
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            if (boss.active) {
              enemyBullets.push({
                x: boss.x + boss.w / 2 + (Math.random() - 0.5) * 20,
                y: boss.y + boss.h,
                w: 5,
                h: 15,
                vx: 0,
                vy: 6
              });
              playTone(350, 'square', 0.05);
            }
          }, i * 100);
        }
        
        screenShake = 4;
        playTone(250, 'sawtooth', 0.2);
      } else {
        // Fase 1: Solo disparo simple hacia abajo
        enemyBullets.push({
          x: crabCenter.x,
          y: crabCenter.y,
          w: 6,
          h: 10,
          vx: 0,
          vy: 4
        });
      
      }
      break;
      
    case 'zigzag':
  
  // SERPENTRIX: Abanico hacia abajo + rotación sutil
  const fanCount = 5 + phase; // 6, 7, 8 balas
  const fanRotation = Math.sin(globalTime * 0.001) * 0.4; // Oscila más
  
  for (let i = 0; i < fanCount; i++) {
    const spread = -1.0 + (2.0 * i / (fanCount - 1)); // -1.0 a +1.0 radianes (más disperso)
    const angle = spread + fanRotation;
    enemyBullets.push({
      x: boss.x + boss.w / 2,
      y: boss.y + boss.h,
      w: 6,
      h: 15,
      vx: Math.sin(angle) * 5,
      vy: 4
    });
  }
  
  // VENENO: Balas lentas y grandes (fase 2+)
  if (phase >= 2 && Math.random() < 0.4) {
    const dx = player.x - boss.x;
    const dist = Math.max(1, Math.abs(dx));
    enemyBullets.push({
      x: boss.x + boss.w / 2,
      y: boss.y + boss.h,
      w: 10,
      h: 10,
      vx: (dx / dist) * 2,
      vy: 3
    });
  }
  
  // MINAS FLOTANTES: 50% chance de soltar mina
if (Math.random() < 0.5 && mines.length < 8) {
  mines.push({
    x: boss.x + boss.w / 2,
    y: boss.y + boss.h,
    radius: 12,
    vy: 0.5,           // ✅ Más lento
    life: 14000,       // ✅ 14 segundos de vida
    pulseTime: 0       // Para animación
  });
    playTone(200, 'sine', 0.15); // Sonido de soltar mina
  }
  break;
      
    case 'rotate':
      // ORBITAL: Diferentes ataques según modo
      const bossCenter = { x: boss.x + boss.w / 2, y: boss.y + boss.h / 2 };
      
      if (boss.pulseMode) {
        // PULSO EXPANSIVO: Anillo de balas desde el centro
        const pulseCount = 12 + (phase * 4); // 16, 20, 24 balas
        for (let i = 0; i < pulseCount; i++) {
          const angle = (Math.PI * 2 * i / pulseCount);
          enemyBullets.push({
            x: bossCenter.x,
            y: bossCenter.y,
            w: 8,
            h: 8,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3
          });
        }
        screenShake = 10;
        playTone(150, 'sawtooth', 0.3);
      } else {
        // Espiral rotativa normal
        const angleOffset = globalTime * 0.002;
        const spiralCount = 4 + (phase * 2);
        for (let i = 0; i < spiralCount; i++) {
          const angle = (Math.PI * 2 * i / spiralCount) + angleOffset;
          enemyBullets.push({
            x: bossCenter.x,
            y: bossCenter.y,
            w: 6,
            h: 6,
            vx: Math.cos(angle) * 4,
            vy: Math.sin(angle) * 4
          });
        }
        
        // Rayo tractor (fase 2+): línea vertical que sigue al jugador
        if (phase >= 2 && Math.random() < 0.3) {
          for (let i = 0; i < 5; i++) {
            enemyBullets.push({
              x: player.x + player.width / 2 + (Math.random() - 0.5) * 30,
              y: 50 + i * 25,
              w: 4,
              h: 12,
              vx: 0,
              vy: 5
            });
          }
          playTone(300, 'sine', 0.1);
        }
      }
      break;
      
    case 'divebomb':
      // TENIENTE: No disparar durante embestida o retroceso
      if (boss.chargeMode || boss.retreating) break;
      
      // Misil hacia el jugador
      const diveDx = player.x + player.width / 2 - (boss.x + boss.w / 2);
      const diveDy = player.y - boss.y;
      const diveDist = Math.sqrt(diveDx * diveDx + diveDy * diveDy);
      
      enemyBullets.push({
        x: boss.x + boss.w / 2,
        y: boss.y + boss.h,
        w: 8,
        h: 14,
        vx: (diveDx / diveDist) * 3,
        vy: (diveDy / diveDist) * 3
      });
      
      // Spread lateral en fase 2+
      if (phase >= 2 && Math.random() < 0.4) {
        enemyBullets.push(
          { x: boss.x + boss.w / 2 - 15, y: boss.y + boss.h, w: 5, h: 10, vx: -2, vy: 3 },
          { x: boss.x + boss.w / 2 + 15, y: boss.y + boss.h, w: 5, h: 10, vx: 2, vy: 3 }
        );
      }
      break;
      
    case 'supreme':
      // EMPERADOR: No disparar durante teletransporte
      if (boss.isTeleporting) break;
      
      const empCenter = { x: boss.x + boss.w / 2, y: boss.y + boss.h };
      const attackRoll = Math.random();
      
      if (phase === 1) {
        // Fase 1: Triple imperial + spread ocasional
        enemyBullets.push(
          { x: boss.x + 15, y: empCenter.y, w: 6, h: 12, vx: -1, vy: 4 },
          { x: empCenter.x, y: empCenter.y, w: 8, h: 14, vx: 0, vy: 5 },
          { x: boss.x + boss.w - 15, y: empCenter.y, w: 6, h: 12, vx: 1, vy: 4 }
        );
        
        if (Math.random() < 0.3) {
          // Abanico adicional
          for (let i = 0; i < 3; i++) {
            const ang = -0.4 + (0.4 * i);
            enemyBullets.push({
              x: empCenter.x,
              y: empCenter.y,
              w: 5, h: 10,
              vx: Math.sin(ang) * 3,
              vy: 4
            });
          }
        }
        
      } else if (phase === 2) {
        // Fase 2: Ataques variados
        if (attackRoll < 0.4) {
          // Spread amplio rotativo
          const spreadCount = 7;
          const rotation = Math.sin(globalTime * 0.002) * 0.3;
          for (let i = 0; i < spreadCount; i++) {
            const angle = -1.0 + (2.0 * i / (spreadCount - 1)) + rotation;
            enemyBullets.push({
              x: empCenter.x,
              y: empCenter.y,
              w: 6, h: 12,
              vx: Math.sin(angle) * 4,
              vy: 4
            });
          }
        } else if (attackRoll < 0.7) {
          // Rayo imperial: línea de balas hacia el jugador
          const dx = player.x + player.width / 2 - empCenter.x;
          const dy = player.y - empCenter.y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              if (boss.active && !boss.isTeleporting) {
                enemyBullets.push({
                  x: empCenter.x,
                  y: empCenter.y,
                  w: 10, h: 10,
                  vx: (dx / dist) * 6,
                  vy: (dy / dist) * 6
                });
                playTone(400, 'square', 0.05);
              }
            }, i * 80);
          }
          playTone(300, 'sawtooth', 0.2);
        } else {
          // Cruz imperial
          enemyBullets.push(
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 0, vy: 5 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 4, vy: 2 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -4, vy: 2 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: 3, vy: -1 },
            { x: empCenter.x, y: boss.y + boss.h / 2, w: 8, h: 8, vx: -3, vy: -1 }
          );
        }
        
      } else {
        // Fase 3: INTENSO PERO JUSTO
        if (attackRoll < 0.4) {
          // Espiral simple (no doble)
          const spiralOffset = globalTime * 0.003;
          for (let i = 0; i < 6; i++) {
            const ang = (Math.PI * 2 * i / 6) + spiralOffset;
            enemyBullets.push({
              x: empCenter.x, 
              y: boss.y + boss.h / 2, 
              w: 6, h: 6, 
              vx: Math.cos(ang) * 3, 
              vy: Math.sin(ang) * 3
            });
          }
        } else if (attackRoll < 0.7) {
          // Onda expansiva (sin homing)
          const waveCount = 10;
          for (let i = 0; i < waveCount; i++) {
            const ang = (Math.PI * 2 * i / waveCount);
            enemyBullets.push({
              x: empCenter.x,
              y: boss.y + boss.h / 2,
              w: 6, h: 6,
              vx: Math.cos(ang) * 3.5,
              vy: Math.sin(ang) * 3.5
            });
          }
        } else {
          // Triple imperial reforzado (sin lluvia fantasma)
          enemyBullets.push(
            { x: boss.x + 15, y: empCenter.y, w: 8, h: 14, vx: -2, vy: 4 },
            { x: empCenter.x, y: empCenter.y, w: 10, h: 16, vx: 0, vy: 5 },
            { x: boss.x + boss.w - 15, y: empCenter.y, w: 8, h: 14, vx: 2, vy: 4 }
          );
          
          // Abanico adicional
          for (let i = 0; i < 5; i++) {
            const ang = -0.6 + (0.3 * i);
            enemyBullets.push({
              x: empCenter.x,
              y: empCenter.y,
              w: 5, h: 10,
              vx: Math.sin(ang) * 3,
              vy: 4
            });
          }
        }
        
        screenShake = Math.max(screenShake, 3);
      }
      break;
  }


  // Feedback sonoro
  playTone(phase === 3 ? 180 : 150, 'square', 0.2);

  // Feedback visual SOLO al disparar (fase final)
  if (phase === 3) {
    screenShake = Math.max(screenShake, 4);
  }
}

}
}

    // UFO spawn/move
    if (!ufo.active && globalTime > ufo.timer && enemies.filter(e => e.alive).length > 0 && !boss.active) {
      ufo.active = true;
      ufo.dir = Math.random() < 0.5 ? 1 : -1;
      ufo.x = ufo.dir === 1 ? -50 : W + 50;
    }
    if (ufo.active) {
      ufo.x += 2 * ufo.dir;
      if (globalTime % 200 < 16) playUfoSound();
      if ((ufo.dir === 1 && ufo.x > W) || (ufo.dir === -1 && ufo.x < -50)) {
        ufo.active = false;
        ufo.timer = globalTime + 10000 + Math.random() * 10000;
      }
    }

    // Player bullets
for (let i = bullets.length - 1; i >= 0; i--) {
  const b = bullets[i];
  b.y += b.vy * step;
  b.x += b.vx * step;


  let hit = false;
  const piercing = (b.type === 'laser');

  // UFO hit
  if (
    ufo.active &&
    b.x < ufo.x + ufo.w && b.x + b.w > ufo.x &&
    b.y < ufo.y + ufo.h && b.y + b.h > ufo.y
  ) {
    ufo.active = false;
    ufo.timer = globalTime + 15000;
    hit = true;
    addScore(200);
    createExplosion(ufo.x + ufo.w / 2, ufo.y + ufo.h / 2, currentPalette[3], 30);
playExplosion();
spawnUfoRewardDrop(ufo.x + ufo.w / 2 - 8, ufo.y + ufo.h);

if (!piercing) bullets.splice(i, 1);
continue;


  }

  // HIT AL BOSS
if (
  boss.active &&
  b.x < boss.x + boss.w &&
  b.x + b.w > boss.x &&
  b.y < boss.y + boss.h &&
  b.y + b.h > boss.y
) {
  const dmg = (b.type === 'laser' ? 3 : 1);
  boss.hp -= dmg;

  addScore((b.type === 'laser') ? 2 : 5);

  hit = true;
  
  // ✅ VERIFICAR MUERTE DEL BOSS
  if (boss.hp <= 0 && !bossDefeated) {
    bossDefeated = true;
    addScore(800);
  }
  
  // ✅ EFECTO DE GOLPE AL BOSS
  boss.flashTimer = 80;
  screenShake = Math.max(screenShake, 3);
  
  // Chispas en punto de impacto
  for (let j = 0; j < 8; j++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 4;
    particles.push({
      x: b.x + b.w / 2, 
      y: b.y + b.h / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.7,
      gravity: 0,
      color: '#fff',
      size: 4,
      isSpark: true
    });
  }
  
  // Destello grande en punto de impacto
  particles.push({
    x: b.x + b.w / 2,
    y: b.y + b.h / 2,
    vx: 0, vy: 0,
    life: 0.3,
    gravity: 0,
    color: '#ff0',
    size: 12
  });
  
  // Anillo de impacto
  particles.push({
    x: b.x + b.w / 2,
    y: b.y + b.h / 2,
    vx: 0, vy: 0,
    life: 0.4,
    gravity: 0,
    color: boss.color || '#f00',
    isRing: true,
    ringRadius: 5,
    ringExpand: 12
  });

  if (!piercing) bullets.splice(i, 1);
  continue;
}

  // ✅ HIT A MINAS
  if (!hit) {
    for (let m = mines.length - 1; m >= 0; m--) {
      const mine = mines[m];
      const dist = Math.hypot((b.x + b.w/2) - mine.x, (b.y + b.h/2) - mine.y);
      
      if (dist < mine.radius + 5) {
        createExplosion(mine.x, mine.y, '#0f0', 15);
        playExplosion();
        mines.splice(m, 1);
        addScore(25);
        hit = true;
        break;
      }
    }
  }

  // Normal enemies hit (incluye minions del Emperador)
  const canHitEnemies = !boss.active || (boss.active && boss.pattern === 'supreme');
  if ((!hit || piercing) && canHitEnemies) {
    for (const e of enemies) {
      if (
        e.alive &&
        b.x < e.x + e.w && b.x + b.w > e.x &&
        b.y < e.y + e.h && b.y + b.h > e.y
      ) {
        const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
        const dmg = (b.type === 'laser') ? 2 : 1;
        
        e.hp -= dmg;
        hit = true;
        
        if (e.hp <= 0) {
          // MUERTE
          e.alive = false;
          
          addScore(data.points || (20 + (4 - e.row) * 10));
          if (b.type === 'normal') addScore(10);
          
          const color = currentPalette[data.color] || currentPalette[1];
          createExplosion(e.x + e.w / 2, e.y + e.h / 2, color);
          playExplosion();
          screenShake = 4;
          
          // SPLITTER: dividirse en 2 mini aliens
          if (data.splits) {
            for (let i = 0; i < 2; i++) {
              const offsetX = (i === 0) ? -15 : 15;
              const mini = createEnemy(e.x + offsetX, e.y, e.row, 'alien_mini');
              mini.diving = true;
              mini.vx = (i === 0) ? -2 : 2;
              mini.vy = 2;
              enemies.push(mini);
            }
            playTone(600, 'square', 0.1);
          }
          
          // DROP DE POWERUP
          const chance = e.diving ? 0.07 : e.row === 0 ? 0.06 : e.row === 1 ? 0.05 : 0.04;
          trySpawnPowerUp(e.x, e.y, chance);
          
        } else {
          // DAÑO (no muere) - feedback visual
          e.flashTimer = 150;
          playTankHitSound();
          screenShake = 2;
        }
        
        if (!piercing) break;
      }
    }
  }
  

  if ((hit && !piercing) || b.y < -50 || b.x < -50 || b.x > W + 50) bullets.splice(i, 1);

    }

    // --- RESOLVER MUERTE DEL BOSS (UNA SOLA VEZ) ---
if (bossDefeated) {
  bossDefeated = false;
  boss.active = false;

  createExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2, '#f00', 80);
  playExplosion();
  screenShake = 50;
  flashScreen = 30;
  addScore(5000);

  // ✅ VICTORIA ÉPICA si completaste nivel 20
  if (level === 20) {
    state = 'victory';
    victoryPhase = 1;  // Fase 1: Explosiones en cadena
    victoryPhaseTimer = 0;
    bossExplosionCount = 0;
    playerVictoryY = player.y;
    
    gameStats.totalTime = globalTime - gameStats.timeStarted;
    finalGrade = calculateGrade();
    
    gameCompleted = true;
    localStorage.setItem('gr_completed', 'true');

    hardcoreUnlocked = true;
    try {
      localStorage.setItem('gr_hardcoreUnlocked', 'true');
    } catch (e) {}

    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  
  } else {
    level++;
    startLevel();
  }
}


    // Enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];

      // Movimiento (recto o en abanico)
      b.x += (b.vx || 0) * step;
      b.y += (b.vy || 4) * step;


      // Colisión con el jugador
      if (
        !isInvincible &&
        b.x < player.x + player.width &&
        b.x + b.w > player.x &&
        b.y < player.y + player.height &&
        b.y + b.h > player.y
      ) {
        lives--;
        enemyBullets.splice(i, 1);
        createExplosion(player.x + 16, player.y + 12, '#f00', 30);
        playPlayerHitSound(); // ✅ Cambiado
        screenShake = 20;
        flashScreen = 10;
        player.weaponType = 'normal';
        
        isInvincible = true;
        invincibleTimer = INVINCIBLE_DURATION;
        
        if (lives <= 0) safeEndGame();
        continue;
      }

      // Fuera de pantalla
      if (b.y > H || b.x < -20 || b.x > W + 20) {
        enemyBullets.splice(i, 1);
      }
    }

    
    // Powerups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const p = powerUps[i];
      p.y += p.vy;
      if (p.x < player.x + player.width && p.x + p.w > player.x &&
          p.y < player.y + player.height && p.y + p.h > player.y) {
        activateWeapon(p.type);
        powerUps.splice(i, 1);
        addScore(10);
      } else if (p.y > H) {
        powerUps.splice(i, 1);
      }
    }

    // UFO reward drops
for (let i = ufoRewards.length - 1; i >= 0; i--) {
  const d = ufoRewards[i];

  d.y += d.vy;

  // colisión con el jugador
  if (
    d.x < player.x + player.width &&
    d.x + d.w > player.x &&
    d.y < player.y + player.height &&
    d.y + d.h > player.y
  ) {
    const rw = d.reward;

    if (rw.kind === 'weapon') {
      activateWeapon(rw.type);
      player.weaponTimer = rw.duration;
    }
    if (rw.kind === 'life') {
      awardExtraLife();
    }
    else if (rw.kind === 'score') {
      addScore(rw.amount);
      if (rw.rare) {
        flashScreen = 20;
        screenShake = 20;
      }
    }
    else if (rw.kind === 'shield') {
      isInvincible = true;
      invincibleTimer = rw.duration;
    }

    playPowerupSound();
    ufoRewards.splice(i, 1);
    continue;
  }

  // fuera de pantalla
  if (d.y > H) {
    ufoRewards.splice(i, 1);
  }
}


    // Minas flotantes (Serpentrix)
for (let i = mines.length - 1; i >= 0; i--) {
  const m = mines[i];
  m.y += m.vy * step;
  m.life -= dt;
  m.pulseTime += dt;
  
  // ✅ Explotar cuando se acaba el tiempo
  if (m.life <= 0) {
    createExplosion(m.x, m.y, '#0f0', 15);
    playExplosion();
    mines.splice(i, 1);
    continue;
  }
  
  // Fuera de pantalla
  if (m.y > H + 20) {
    mines.splice(i, 1);
    continue;
  }
      
      // Colisión con jugador (si no es invencible)
      if (!isInvincible) {
        const dx = (player.x + player.width / 2) - m.x;
        const dy = (player.y + player.height / 2) - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < m.radius + 15) {
          // ¡BOOM! Mina explota
          createExplosion(m.x, m.y, '#0f0', 20);
          playExplosion();
          screenShake = 15;
          mines.splice(i, 1);
          
          lives--;
          isInvincible = true;
          invincibleTimer = INVINCIBLE_DURATION;
          playPlayerHitSound();
          
          if (lives <= 0) {
            safeEndGame();
          }
        }
      }
    }

    // Satélites orbitantes (Orbital)
    if (boss.active && boss.pattern === 'rotate') {
      const phase = getBossPhase();
      
      // Agregar satélite extra en fase 2 y 3
      if (phase >= 2 && satellites.length < 3) {
        satellites.push({
          angle: Math.random() * Math.PI * 2,
          distance: 70,
          radius: 8,
          shootTimer: 0
        });
      }
      if (phase >= 3 && satellites.length < 4) {
        satellites.push({
          angle: Math.random() * Math.PI * 2,
          distance: 80,
          radius: 8,
          shootTimer: 0
        });
      }
      
      satellites.forEach(sat => {
        // Rotar alrededor del boss
        sat.angle += 0.03 * step * (boss.orbitDir || 1);
        
        // Posición del satélite
        const satX = boss.x + boss.w / 2 + Math.cos(sat.angle) * sat.distance;
        const satY = boss.y + boss.h / 2 + Math.sin(sat.angle) * sat.distance;
        sat.x = satX;
        sat.y = satY;
        
        // Disparo del satélite
        sat.shootTimer += dt;
        if (sat.shootTimer > 2000) {
          sat.shootTimer = 0;
          
          // Disparo hacia el jugador
          const dx = player.x + player.width / 2 - satX;
          const dy = player.y + player.height / 2 - satY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          enemyBullets.push({
            x: satX,
            y: satY,
            w: 6,
            h: 6,
            vx: (dx / dist) * 4,
            vy: (dy / dist) * 4
          });
          playTone(500, 'square', 0.08);
        }
        
        // Colisión satélite con jugador
        if (!isInvincible) {
          const dx = (player.x + player.width / 2) - satX;
          const dy = (player.y + player.height / 2) - satY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < sat.radius + 12) {
            createExplosion(satX, satY, '#0ff', 15);
            playExplosion();
            screenShake = 12;
            
            lives--;
            isInvincible = true;
            invincibleTimer = INVINCIBLE_DURATION;
            playPlayerHitSound();
            
            if (lives <= 0) {
              safeEndGame();
            }
          }
        }
      });
    }

    // Enemies movement & diving & shooting
const activeEnemies = enemies.filter(e => e.alive);
// Actualizar flash timer de enemigos
  activeEnemies.forEach(e => {
    if (e.flashTimer > 0) e.flashTimer -= dt;
  });

// ✅ IMPORTANTÍSIMO: startLevel NO va acá (lo maneja el warp)
if (!boss.active && activeEnemies.length > 0) {

  // --- speed scaling (por stage + por limpieza) ---
  const totalEnemies = Math.max(1, enemies.length);
  const alive = activeEnemies.length;

  const t = clamp(1 - (alive / totalEnemies), 0, 1); // 0..1
  const stage = Math.floor((level - 1) / 5);         // 0:1-5, 1:6-10, 2:11-15...

  const diffSpeed = getDifficultySettings(level).enemySpeed;
  const baseSpeed = 0.5 * diffSpeed;
  const speed = baseSpeed + t * 1.8;
  enemySpeedX = Math.min(3.5, speed);

  let moveDown = false;

  // --- AI (lvl 10+) - offsets suaves, no rompe formación ---
  if (level >= 10) {
    const maxOffsetX = 18;
    const maxOffsetY = 10;

    const steer = 0.06 * step;
    const relax = 0.04 * step;
    const decisionEveryMs = 650;

    activeEnemies.forEach(e => {
      if (e.diving) return;

      // init per-enemy AI vars
      if (e.aiOffX === undefined) e.aiOffX = 0;
      if (e.aiOffY === undefined) e.aiOffY = 0;
      if (!e.aiState) e.aiState = 'wave';
      if (e.aiTimer === undefined) e.aiTimer = 0;
      if (e.aiDir === undefined) e.aiDir = (Math.random() < 0.5 ? -1 : 1);

      e.aiTimer += dt;

      // --- decision ---
      if (e.aiTimer >= decisionEveryMs) {
        e.aiTimer = 0;

        const danger = bullets.some(b =>
          Math.abs((b.x + b.w / 2) - (e.x + e.w / 2)) < 22 &&
          b.y < e.y + 10 &&
          b.y > e.y - 70
        );

        const distToPlayer = Math.hypot(
          (player.x + player.width / 2) - (e.x + e.w / 2),
          player.y - (e.y + e.h / 2)
        );

        if (danger && Math.random() < 0.85) {
          e.aiState = 'evade';
          e.aiDir = Math.random() < 0.5 ? -1 : 1;
        } else if (distToPlayer < 160 && Math.random() < 0.45) {
          e.aiState = 'hunt';
        } else {
          e.aiState = 'wave';
        }
      }

      // --- apply (offsets only) ---
      if (e.aiState === 'evade') {
        e.aiOffX += e.aiDir * 1.8 * steer;
        e.aiOffY += -0.4 * steer;
      } else if (e.aiState === 'hunt') {
        const tx = (player.x + player.width / 2) - (e.x + e.w / 2);
        const ty = (player.y) - (e.y + e.h / 2);
        const mag = Math.max(1, Math.hypot(tx, ty));

        e.aiOffX += (tx / mag) * 2.2 * steer;
        e.aiOffY += (ty / mag) * 0.6 * steer;
      }

      // dynamic X clamp (según espacio real)
      const leftRoom = (e.x - 10);
      const rightRoom = (W - 10 - e.w) - e.x;
      const dynMaxX = Math.max(0, Math.min(maxOffsetX, leftRoom, rightRoom));

      e.aiOffX = clamp(e.aiOffX, -dynMaxX, dynMaxX);
      e.aiOffY = clamp(e.aiOffY, -maxOffsetY, maxOffsetY);

      // relax back to formation
      e.aiOffX += (0 - e.aiOffX) * relax;
      e.aiOffY += (0 - e.aiOffY) * relax;

      // apply offsets
      e.x += e.aiOffX;
      e.y += e.aiOffY;

      e.x = clamp(e.x, 10, W - 10 - e.w);
      e.y = clamp(e.y, 20, H - 120);
    });
  }

  // --- formation movement (global) ---
  let invasionComplete = false;
  activeEnemies.forEach(e => {
    if (e.diving || invasionComplete) return;

    e.x += enemySpeedX * enemyDir * step;

    if (e.x <= 10 || e.x + e.w >= W - 10) moveDown = true;
    
    // Si los aliens llegan a la altura del jugador = INVASION COMPLETA = Game Over
    if (e.y + e.h > player.y) {
      lives = 0;
      invasionComplete = true;
      safeEndGame();
    }
  });

  if (moveDown) {
    enemyDir *= -1;
    const drop = 12;

    activeEnemies.forEach(e => {
      if (e.diving) return;
      e.y += drop;
      e.x = clamp(e.x, 10, W - 10 - e.w);
    });
  }

    // --- diving selection (dificultad progresiva) ---
  const diffSettings = getDifficultySettings(level);
  const currentDivers = activeEnemies.filter(e => e.diving).length;
  
  // KAMIKAZE: siempre en diving
  activeEnemies.forEach(e => {
    if (!e.diving) {
      const data = ENEMY_TYPES[e.type];
      if (data && data.kamikaze) {
        e.diving = true;
        const angle = Math.atan2(
          player.y - e.y,
          (player.x + player.width / 2) - e.x
        );
        e.vx = Math.cos(angle) * diffSettings.diveSpeed * (data.speed || 1);
        e.vy = Math.sin(angle) * diffSettings.diveSpeed * (data.speed || 1);
      }
    }
  });

  if (currentDivers < diffSettings.maxDivers && Math.random() < diffSettings.diveChance) {
    const candidates = activeEnemies.filter(e => !e.diving && ENEMY_TYPES[e.type]?.canDive !== false);
    if (candidates.length > 0) {
      const diver = candidates[Math.floor(Math.random() * candidates.length)];
      diver.diving = true;

      const angle = Math.atan2(
        player.y - diver.y,
        (player.x + player.width / 2) - diver.x
      );

      const data = ENEMY_TYPES[diver.type] || ENEMY_TYPES.alien1;
      const speed = diffSettings.diveSpeed * (data.speed || 1);
      diver.vx = Math.cos(angle) * speed;
      diver.vy = Math.sin(angle) * speed;
    }
  }



  // --- update diving enemies ---
  activeEnemies.forEach(e => {
    if (!e.diving) return;

    e.x += e.vx;
    e.y += e.vy;

    if (e.y > H) {
      e.y = -30;
      e.x = Math.random() * (W - 30);
      e.diving = false;
    }

    if (
      !isInvincible &&
      e.x < player.x + player.width &&
      e.x + e.w > player.x &&
      e.y < player.y + player.height &&
      e.y + e.h > player.y
    ) {
      console.log('DIVING ALIEN HIT! Lives before:', lives);
      lives--;
      console.log('Lives after:', lives);
      e.alive = false;

      createExplosion(player.x, player.y, '#f00', 40);
      playPlayerHitSound();
      screenShake = 30;
      flashScreen = 15;
      player.weaponType = 'normal';

      isInvincible = true;
      invincibleTimer = INVINCIBLE_DURATION;

      if (lives <= 0) safeEndGame();
    }
  });
  // --- enemy shooting ---
  let baseCooldown = getDifficultySettings(level).shootCooldown;

  // multiplicador por dificultad (normal/hardcore)
  const diffMode = difficulties[difficultyIndex];
  if (diffMode && diffMode.fireMult) baseCooldown *= diffMode.fireMult;

  if (globalTime - enemyLastShot > baseCooldown) {
    const shooters = activeEnemies.filter(e => !e.diving);

    if (shooters.length > 0) {
      const shooter = shooters[Math.floor(Math.random() * shooters.length)];
      enemyBullets.push({
        x: shooter.x + shooter.w / 2,
        y: shooter.y + shooter.h,
        w: 4,
        h: 10
      });
      enemyLastShot = globalTime;
    }
  }



} // <-- CIERRA: if (!boss.active && activeEnemies.length > 0)

  // ✅ MINIONS DEL EMPERADOR (se mueven aunque el boss esté activo)
  if (boss.active && boss.pattern === 'supreme') {
    const minions = enemies.filter(e => e.alive && e.diving);
    
    minions.forEach(e => {
      e.x += e.vx * step;
      e.y += e.vy * step;
      
      // Si sale de pantalla, eliminar
      if (e.y > H + 30 || e.x < -30 || e.x > W + 30) {
        e.alive = false;
      }
      
      // Colisión con jugador
      if (
        !isInvincible &&
        e.x < player.x + player.width &&
        e.x + e.w > player.x &&
        e.y < player.y + player.height &&
        e.y + e.h > player.y
      ) {
        lives--;
        e.alive = false;
        
        createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#f00', 30);
        playPlayerHitSound();
        screenShake = 20;
        flashScreen = 10;
        player.weaponType = 'normal';
        
        isInvincible = true;
        invincibleTimer = INVINCIBLE_DURATION;
        
        if (lives <= 0) safeEndGame();
      }
    });
  }

  // ✅ Particles MOVIDAS ACÁ (fuera del if de enemigos)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.vy += p.gravity * step;
    p.life -= 0.02 * step;

  if (p.y > H) { p.y = H; p.vy *= -0.6; }
    if (p.life <= 0) particles.splice(i, 1);
  }

  // ✅ FASES DE VICTORIA ÉPICA
  if (state === 'victory') {
    victoryPhaseTimer += dt;
    
    // Fase 1: Explosiones en cadena del boss (0-2 segundos)
    if (victoryPhase === 1) {
      if (victoryPhaseTimer > 400 && bossExplosionCount < 6) {
        // Explosión aleatoria en área del boss
        const expX = W/2 - 60 + Math.random() * 120;
        const expY = 80 + Math.random() * 80;
        createExplosion(expX, expY, ['#f00', '#ff0', '#f80', '#fff'][Math.floor(Math.random() * 4)], 25);
        playExplosion();
        screenShake = 15 + bossExplosionCount * 3;
        bossExplosionCount++;
        victoryPhaseTimer = 0;
      }
      
      if (bossExplosionCount >= 6) {
        // BOOM final gigante
        createExplosion(W/2, 120, '#fff', 60);
        playTone(100, 'sawtooth', 0.8);
        screenShake = 50;
        flashScreen = 30;
        victoryPhase = 2;
        victoryPhaseTimer = 0;
        startMusic('victory');
      }
    }
    
    // Fase 2: Nave sube (2-5 segundos)
    if (victoryPhase === 2) {
      playerVictoryY -= 2;
      
      // Fuegos artificiales aleatorios
      if (Math.random() < 0.1) {
        const fwX = 50 + Math.random() * (W - 100);
        const fwY = 100 + Math.random() * (H - 300);
        createExplosion(fwX, fwY, currentPalette[Math.floor(Math.random() * 4)], 20);
        if (Math.random() < 0.3) playTone(800 + Math.random() * 400, 'sine', 0.1);
      }
      
      if (victoryPhaseTimer > 3000) {
        victoryPhase = 3;
        victoryPhaseTimer = 0;
        spawnVictoryParticles();
      }
    }
    
    // Fase 3: Mostrar grado y stats (5+ segundos)
    if (victoryPhase === 3) {
      // Confetti continuo
      if (Math.random() < 0.15) {
        spawnVictoryParticles();
      }
    }
  }

 // ✅ Victory particles
  for (let i = victoryParticles.length - 1; i >= 0; i--) {
    const p = victoryParticles[i];
    p.x += p.vx * step;
    p.y += p.vy * step;
    p.vy += 0.15 * step;
    p.life -= 0.008 * step;
    if (p.life <= 0 || p.y > H) victoryParticles.splice(i, 1);
  }

} // <-- CIERRA: if (state === 'playing')




// --- DIBUJAR HIGH SCORES EN EL MENÚ ---
function drawHighScoresInMenu() {
  // Asegurar 10 slots
  while (highScores.length < 10) highScores.push(0);
  while (highNames.length < 10) highNames.push('---');
  while (highContinues.length < 10) highContinues.push(0);

  // Encabezado del ranking
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '14px "Press Start 2P"';
  ctx.fillText('HIGH SCORES', W / 2, 118);

  // Columnas (sin recuadros, solo alineación pro)
  const leftX  = Math.floor(W * 0.20);   // Rank
  const nameX  = Math.floor(W * 0.28);   // Name
  const scoreX = Math.floor(W * 0.82);   // Score
  const baseY  = 160;
  const stepY  = 30;

  // Tabla (bien grande)
  ctx.font = '12px "Press Start 2P"';

  for (let i = 0; i < 10; i++) {
    const y = baseY + i * stepY;
    const rank = (i + 1).toString().padStart(2, '0');
    const name = (highNames[i] || '---').toString().slice(0, 8);
    const score = (highScores[i] || 0);
    const cont = (highContinues[i] || 0);

    // Colores por posición (clásico: oro/plata/bronce, el resto limpio)
    let color = '#9aa';
    if (i === 0) color = '#ff0';
    else if (i === 1) color = '#ddd';
    else if (i === 2) color = '#c84';

    // RANK
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(rank + '.', leftX, y);

    // NAME
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(name, nameX, y);

    // SCORE (derecha, grandote)
    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.fillText(String(score).padStart(7, ' '), scoreX, y);

    // Continues: visible pero “con clase”
    // Si usó continues, le ponemos un pequeño marcador al lado del score:
    // ejemplo: "  0123456  x2"
    if (cont > 0) {
      ctx.fillStyle = '#f55';
      ctx.textAlign = 'left';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText('x' + cont, scoreX + 14, y);
      ctx.font = '12px "Press Start 2P"';
    }
  }

  // Nota sutil (abajo)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#666';
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('xN = CONTINUES USED', W / 2, H - 92);
}




// --- DRAW ---
function draw() {
  // 1) Limpiar y pintar fondo SIN translate (así el fondo no recibe shake global)
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);

  // 2) STAR SHAKE (solo fondo, más fuerte en boss)
  const bossShakeMult = boss.active ? 1.0 : 0.25; // fuera de boss casi nada
  const shakeAmt = Math.max(0, screenShake) * 0.35 * bossShakeMult;

  // suavizado para que no “tiemble feo”
  starShakeX = starShakeX * 0.75 + ((Math.random() - 0.5) * shakeAmt) * 0.25;
  starShakeY = starShakeY * 0.75 + ((Math.random() - 0.5) * shakeAmt) * 0.25;

  stars.forEach(s => {
    ctx.fillStyle = s.color;

    const height = (warpSpeed > 2) ? s.size * (warpSpeed * 1.5) : s.size;
    const depth = (s.depth ?? 0.5);        // 0.1 lejos, 1.0 cerca
    const mult  = 0.15 + depth * 0.95;     // cuánto le pega el shake según profundidad

    ctx.fillRect(
      s.x + starShakeX * mult,
      s.y + starShakeY * mult,
      s.size,
      height
    );
  });

  // 3) A PARTIR DE ACÁ: shake global SOLO para gameplay (player/enemies/etc.)
  ctx.save();
  if (screenShake > 0) {
    const dx = (Math.random() - 0.5) * screenShake * 0.15;
    const dy = (Math.random() - 0.5) * screenShake * 0.15;
    ctx.translate(dx, dy);
  }



  if (state === 'menu') {
    ctx.textAlign = 'center';
    
    // Aliens decorativos animados
    const alienWave = Math.sin(globalTime * 0.003) * 15;
    menuAliens.forEach((alien, i) => {
  const menuAnim = Math.floor(globalTime / 500) % 2;
const spriteKey = alien.type + (menuAnim === 0 ? '_a' : '_b');
  const color = alien.type === 'alien1' ? currentPalette[2] : currentPalette[1];
  
  // Calcular posición centrada
  const cols = alien.row === 0 ? 5 : 4;
  const spacing = 45;
  const totalWidth = (cols - 1) * spacing;
  const startX = (W - totalWidth) / 2;
  const baseX = startX + alien.col * spacing;
  
  // Movimiento ondulante
  const wave = Math.sin(globalTime * 0.003 + alien.col * 0.5) * 8;
  
  drawSprite(ctx, SPRITES[spriteKey], baseX + wave - 12, alien.y, color, 3);
});
    
    // Título
    ctx.font = '36px "Press Start 2P"';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText('GALAXY', W / 2 + 3, 203);
    ctx.fillStyle = currentPalette[0];
    ctx.fillText('GALAXY', W / 2, 200);
    
    ctx.font = '30px "Press Start 2P"';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText('RAIDERS', W / 2 + 3, 243);
    ctx.fillStyle = '#fff';
    ctx.fillText('RAIDERS', W / 2, 240);
    
    // High Score
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('🌍 ' + globalTopName + ' ' + globalTopScore, W / 2, 280);
    
    // Opciones del menú
    const menuStartY = 340;
    const menuSpacing = 40;
    
    MENU_OPTIONS.forEach((option, i) => {
      const y = menuStartY + i * menuSpacing;
      const isSelected = (menuSelection === i);
      
      if (isSelected) {
        // Fondo seleccionado
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(W / 2 - 100, y - 23, 200, 30);
        
        // Flechas
        ctx.fillStyle = '#ff0';
        ctx.font = '14px "Press Start 2P"';
        const pulse = Math.sin(globalTime * 0.008) * 3;
        ctx.fillText('►', W / 2 - 80 - pulse, y);
        ctx.fillText('◄', W / 2 + 80 + pulse, y);
      }
      
      ctx.font = '16px "Press Start 2P"';
      ctx.fillStyle = isSelected ? '#ff0' : '#666';
      ctx.fillText(option, W / 2, y);
    });
    
    // Dificultad (si está desbloqueado)
    if (hardcoreUnlocked) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('MODE: ' + difficulties[difficultyIndex].name, W / 2, 470);
    }
    
    // Créditos/Fichas
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#0ff';
    ctx.fillText('🪙 ' + playerCredits + ' CREDITS', W / 2, H - 100);
    
    // Instrucciones
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#555';
    ctx.fillText('↑↓ SELECT   FIRE=OK', W / 2, H - 70);
    
    // Botones inferiores
    ctx.font = '16px "Press Start 2P"';
    const btnY = H - 40;
    
       
    // Fullscreen
    ctx.fillStyle = '#666';
    ctx.fillText('⛶', W / 2 + 60, btnY);
    
    if (pauseBtn) pauseBtn.textContent = '▶';
  }

  // PANTALLA DE SCORES
  if (state === 'scores') {
    ctx.textAlign = 'center';
    
    // Título
    ctx.font = '18px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('★ HALL OF FAME ★', W / 2, 50);
    
    // Tabs
    ctx.font = '12px "Press Start 2P"';
    
    // Tab LOCAL
    ctx.fillStyle = scoresTab === 0 ? '#0ff' : '#444';
    ctx.fillText('LOCAL', W / 2 - 60, 85);
    if (scoresTab === 0) {
      ctx.fillRect(W / 2 - 95, 90, 70, 3);
    }
    
    // Tab GLOBAL
    ctx.fillStyle = scoresTab === 1 ? '#0ff' : '#444';
    ctx.fillText('GLOBAL', W / 2 + 60, 85);
    if (scoresTab === 1) {
      ctx.fillRect(W / 2 + 25, 90, 75, 3);
    }
    
    // Línea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(30, 100);
    ctx.lineTo(W - 30, 100);
    ctx.stroke();
    
    // Header
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'left';
    ctx.fillText('#', 40, 120);
    ctx.fillText('NAME', 70, 120);
    ctx.textAlign = 'right';
    ctx.fillText('SCORE', W - 80, 120);
    if (scoresTab === 0) ctx.fillText('©', W - 40, 120);
    
    ctx.font = '12px "Press Start 2P"';
    
    for (let i = 0; i < 10; i++) {
      const y = 145 + i * 28;
      
      let name, scoreVal, cont;
      
      if (scoresTab === 0) {
        // LOCAL
        name = (highNames[i] || '---').toString().slice(0, 8);
        scoreVal = highScores[i] || 0;
        cont = highContinues[i] || 0;
      } else {
        // GLOBAL
        const entry = globalScores[i];
        name = entry ? entry.name.slice(0, 8) : '---';
        scoreVal = entry ? entry.score : 0;
        cont = 0; // Global no tiene continues
      }
      
      // Color según posición
      let color = '#555';
      if (i === 0) color = '#ff0';      // Oro
      else if (i === 1) color = '#ccc'; // Plata
      else if (i === 2) color = '#c84'; // Bronce
      else if (i < 5) color = '#777';
      
      ctx.fillStyle = color;
      
      // Rank
      ctx.textAlign = 'left';
      ctx.fillText((i + 1) + '.', 40, y);
      
      // Nombre
      ctx.fillText(name, 70, y);
      
      // Score
      ctx.textAlign = 'right';
      ctx.fillText(scoreVal.toString(), W - 80, y);
      
      // Continues (solo local)
      if (scoresTab === 0 && cont > 0) {
        ctx.fillStyle = '#f44';
        ctx.fillText(cont.toString(), W - 40, y);
      }
    }
    
    // Tu mejor score
    ctx.font = '9px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    ctx.textAlign = 'center';
    const yourRank = highScores.indexOf(bestScore) + 1;
    ctx.fillText('YOUR BEST: ' + bestScore + (yourRank > 0 ? ' (#' + yourRank + ')' : ''), W / 2, H - 110);
    
    // Instrucciones
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#555';
    ctx.fillText('←→ TAB   FIRE=BACK', W / 2, H - 80);
    
    // Global placeholder
    if (scoresTab === 1 && globalScores.length === 0) {
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('LOADING...', W / 2, 250);
    }
  }

  // PANTALLA DE OPTIONS
  if (state === 'options') {
    ctx.textAlign = 'center';
    
    // Título
    ctx.font = '18px "Press Start 2P"';
    ctx.fillStyle = '#ff0';
    ctx.fillText('⚙ OPTIONS', W / 2, 60);
    
    const optStartY = 140;
    const optSpacing = 55;
    
    // SOUND
    let y = optStartY;
    let isSelected = (optionSelection === 0);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('SOUND', 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = isMuted ? '#f44' : '#0f0';
    ctx.fillText(isMuted ? 'OFF' : 'ON', W - 60, y);
    
    if (isSelected) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('◄', W - 100, y);
      ctx.textAlign = 'left';
      ctx.fillText('►', W - 50, y);
    }
    
    // VIBRATION
    y = optStartY + optSpacing;
    isSelected = (optionSelection === 1);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('VIBRATION', 60, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = vibrationEnabled ? '#0f0' : '#f44';
    ctx.fillText(vibrationEnabled ? 'ON' : 'OFF', W - 60, y);
    
    if (isSelected) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('◄', W - 100, y);
      ctx.textAlign = 'left';
      ctx.fillText('►', W - 50, y);
    }
    
    // Línea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(50, optStartY + optSpacing * 1.6);
    ctx.lineTo(W - 50, optStartY + optSpacing * 1.6);
    ctx.stroke();
    
    // DIFFICULTY
    y = optStartY + optSpacing * 2;
    isSelected = (optionSelection === 2);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(40, y - 18, W - 80, 35);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#ff0' : '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('DIFFICULTY', 60, y);
    ctx.textAlign = 'right';
    
    if (hardcoreUnlocked) {
      ctx.fillStyle = difficultyIndex === 0 ? '#0f0' : '#f00';
      ctx.fillText(difficulties[difficultyIndex].name, W - 60, y);
      
      if (isSelected) {
        ctx.fillStyle = '#ff0';
        ctx.fillText('◄', W - 160, y);
        ctx.textAlign = 'left';
        ctx.fillText('►', W - 40, y);
      }
    
    } else {
      ctx.fillStyle = '#666';
      ctx.fillText('NORMAL', W - 60, y);
      ctx.font = '7px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 BEAT GAME TO UNLOCK', W / 2, y + 20);
    }
    
    // Línea separadora
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(50, optStartY + optSpacing * 2.7);
    ctx.lineTo(W - 50, optStartY + optSpacing * 2.7);
    ctx.stroke();
    
    // RESET SCORES
    y = optStartY + optSpacing * 3.2;
    isSelected = (optionSelection === 3);
    
    if (isSelected) {
      ctx.fillStyle = 'rgba(255,0,0,0.2)';
      ctx.fillRect(40, y - 18, W - 80, 55);
    }
    
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = isSelected ? '#f00' : '#944';
    ctx.textAlign = 'center';
    ctx.fillText('RESET ALL SCORES', W / 2, y);
    
    if (isSelected) {
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#f44';
      ctx.fillText('PRESS FIRE TO RESET', W / 2, y + 22);
    }
    
    // Version
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('VERSION 1.0', W / 2, H - 120);
    
    // Instrucciones
    ctx.fillStyle = '#555';
    ctx.fillText('↑↓ SELECT  ←→ CHANGE  FIRE=BACK', W / 2, H - 80);
  }

  // ✅ PANTALLA DE INGRESO DE NOMBRE
  if (state === 'entering_name') {
    // Resetear cualquier transformación
    ctx.restore();
    ctx.save();
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Título
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('HIGH SCORE!', W / 2, 140);

    // Score logrado
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P"';
    ctx.fillText(`SCORE: ${score}`, W / 2, 180);

    // Instrucciones
    ctx.fillStyle = '#0ff';
    ctx.font = '9px "Press Start 2P"';
    ctx.fillText('USE JOYSTICK UP/DOWN', W / 2, 230);

    // Flecha arriba
    ctx.fillStyle = '#0f0';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('▲', W / 2, 268);

    // ✅ LETRA ACTUAL (grande, centrada)
    ctx.fillStyle = '#0f0';
    ctx.font = '32px "Press Start 2P"';
    ctx.fillText(ALPHABET[currentLetterIndex], W / 2, 308);

    // Flecha abajo
    ctx.fillStyle = '#0f0';
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('▼', W / 2, 338);

    // Nombre actual + cursor parpadeante
    nameCursorBlink = (nameCursorBlink + 1) % 60;
    const cursor = nameCursorBlink < 30 ? '_' : ' ';
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText(playerName + cursor, W / 2, 360);

    // Hints móvil
    ctx.fillStyle = '#888';
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('FIRE: ADD LETTER', W / 2, 400);
    ctx.fillText('MUTE: DELETE', W / 2, 420);
    ctx.fillText('PAUSE: CONFIRM', W / 2, 440);
    
    ctx.restore();
    return; // ✅ SALIR - no dibujar nada más
  }
  /// ✅ PANTALLA DE CONTINUE
  if (state === 'continue') {
    // Resetear transformaciones
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Fondo negro sólido
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    
    // Título
    ctx.fillStyle = '#ff0';
    ctx.textAlign = 'center';
    ctx.font = '24px "Press Start 2P"';
    ctx.fillText('CONTINUE?', W / 2, 120);
    
    // Countdown
    const seconds = Math.ceil(continueTimer / 1000);
    const pulse = Math.sin(globalTime * 0.01) * 0.3 + 0.7;
    
    ctx.font = '48px "Press Start 2P"';
    ctx.fillStyle = seconds <= 3 ? `rgba(255, 0, 0, ${pulse})` : '#fff';
    ctx.fillText(seconds.toString(), W / 2, 200);
    
    // Score actual
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = '#aaa';
    ctx.fillText(`SCORE: ${score}`, W / 2, 260);
    ctx.fillText(`LEVEL: ${level}`, W / 2, 285);
    
    // Instrucciones
    ctx.font = '14px "Press Start 2P"';
    ctx.fillStyle = '#0f0';
    if (globalTime % 1000 < 500) {
      ctx.fillText('FIRE TO CONTINUE', W / 2, 350);
    }
    
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#888';
    ctx.fillText('3 LIVES - 1 CREDIT', W / 2, 390);
    
    // Continúas usados
    if (continueCount > 0) {
      ctx.fillStyle = '#666';
      ctx.fillText(`CONTINUES USED: ${continueCount}`, W / 2, 420);
    }
    
    return; // No dibujar nada más
  }

  if (state === 'playing' || state === 'paused') {
    // Player
    const pColor = '#fff';
const shipKey = (animationFrame === 0) ? 'player_a' : 'player_b';
const tilt = (player.movingLeft ? -0.08 : player.movingRight ? 0.08 : 0);

// ✅ Parpadeo si es invencible
const shouldShow = !isInvincible || Math.floor(globalTime / 100) % 2 === 0;

if (shouldShow) {
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height / 2;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-cx, -cy);
  drawSprite(ctx, SPRITES[shipKey], player.x, player.y, pColor, 3);
  ctx.restore();
}


    // UFO
    if (ufo.active) drawSprite(ctx, SPRITES.ufo, ufo.x, ufo.y, currentPalette[3], 3);

      // Boss
    if (boss.active) {
      const bossSprite = (() => {
        switch(boss.pattern) {
          case 'crossfire': return SPRITES.boss_crabtron;
          case 'zigzag':    return SPRITES.boss_serpentrix;
          case 'rotate':    return SPRITES.boss_orbital;
          case 'divebomb':  return SPRITES.boss_teniente;
          case 'supreme':   return SPRITES.boss_emperador;
          default:          return SPRITES.boss_crabtron;
        }
      })();
      
      // Flash blanco al recibir daño
      const bossColor = (boss.flashTimer > 0) ? '#fff' : (boss.color || '#f00');
      drawSprite(ctx, bossSprite, boss.x, boss.y, bossColor, 5);
          
      const hpPct = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
      
      // Barra de HP con color del boss
      ctx.fillStyle = '#500';
      ctx.fillRect(W / 2 - 100, 60, 200, 10);
      ctx.fillStyle = boss.color || '#f00';
      ctx.fillRect(W / 2 - 100, 60, 200 * hpPct, 10);
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(W / 2 - 100, 60, 200, 10);
      
      // ✅ Mostrar nombre del boss (arriba de la barra de HP)
      ctx.font = '12px "Press Start 2P"';
      ctx.textAlign = 'center';
      
      // Sombra del texto
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2 + 2, 52);
      
      // Texto principal con color del boss
      ctx.fillStyle = boss.color || '#fff';
      ctx.fillText(boss.name || 'MOTHERSHIP', W / 2, 50);
    }

    // Enemies
    enemies.forEach(e => {
      if (e.alive) {
        const spriteKey = e.type + (animationFrame === 0 ? '_a' : '_b');
        const data = ENEMY_TYPES[e.type] || ENEMY_TYPES.alien1;
        
        // Color base según tipo
        let color = currentPalette[data.color] || currentPalette[1];
        
        // Diving = rojo
        if (e.diving) color = '#f00';
        
        // Flash blanco al recibir daño
        if (e.flashTimer > 0) color = '#fff';
        
        // Tamaño del sprite (mini aliens más chicos)
        const size = (e.type === 'alien_mini') ? 2 : 3;
        
        drawSprite(ctx, SPRITES[spriteKey], e.x, e.y, color, size);
        
        // Barra de HP para tanques (hp > 1)
        if (e.maxHp > 1 && e.hp < e.maxHp) {
          const barW = e.w * 0.8;
          const barH = 3;
          const barX = e.x + (e.w - barW) / 2;
          const barY = e.y - 6;
          
          ctx.fillStyle = '#500';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = '#f00';
          ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
        }
      }
    });

    // Player bullets
    bullets.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Enemy bullets
    ctx.fillStyle = '#f44';
    enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    // Minas flotantes (Serpentrix)
    mines.forEach(m => {
      const pulse = Math.sin(m.pulseTime * 0.01) * 0.3 + 0.7; // Pulsa entre 0.4 y 1.0
      const warningPulse = m.life < 2000 ? Math.sin(m.pulseTime * 0.03) > 0 : true; // Parpadea si le queda poca vida
      
      if (warningPulse) {
        // Círculo exterior (glow)
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${0.2 * pulse})`;
        ctx.fill();
        
        // Círculo principal
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${0.6 * pulse})`;
        ctx.fill();
        
        /// Centro brillante
        ctx.beginPath();
        ctx.arc(m.x, m.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0';
        ctx.fill();
      }
    });

    // Satélites orbitantes (Orbital)
    if (boss.active && boss.pattern === 'rotate') {
      satellites.forEach(sat => {
        const pulse = Math.sin(globalTime * 0.008) * 0.2 + 0.8;
        
        // Línea de conexión al boss
        ctx.beginPath();
        ctx.moveTo(boss.x + boss.w / 2, boss.y + boss.h / 2);
        ctx.lineTo(sat.x, sat.y);
        ctx.strokeStyle = `rgba(0, 255, 255, 0.3)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Glow exterior
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`;
        ctx.fill();
        
        // Satélite principal
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, sat.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * pulse})`;
        ctx.fill();
        
        // Centro brillante
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
    }

    // Powerups
    powerUps.forEach(p => {
      const char = p.type.charAt(0).toUpperCase();
      const color = getWeaponColor(p.type);
      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#000';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText(char, p.x + 2, p.y + 10);
    });

    // UFO reward drops
ufoRewards.forEach(d => {
  const pulse = Math.sin(globalTime * 0.01) * 0.3 + 0.7;

  ctx.fillStyle = d.reward?.rare ? '#ff0' : '#0ff';
  ctx.globalAlpha = pulse;
  ctx.fillRect(d.x, d.y, d.w, d.h);
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#000';
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.fillText('?', d.x + 3, d.y + 12);
});


    // Particles
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      
      if (p.isRing) {
        // Anillo expansivo
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        p.ringRadius += p.ringExpand * 0.1;
      } else if (p.isSpark) {
        // Chispa con trail
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = p.life * 0.5;
        ctx.fillRect(p.x - p.vx * 0.3, p.y - p.vy * 0.3, p.size, p.size);
      } else {
        // Partícula normal
        const size = p.size || 3;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, size, size);
      }
    });
    ctx.globalAlpha = 1;


    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.fillText(`SC:${score}`, 10, 25);
    ctx.fillText(`LV:${level}`, 10, 45);
    ctx.textAlign = 'right';
    ctx.fillText(`HI:${bestScore}`, W - 10, 25);

    // Power timer (abajo a la derecha)
if (player.weaponType !== 'normal') {
  const maxDurations = { double: 15000, spread: 12000, machine: 10000, laser: 8000 };
  const maxTime = maxDurations[player.weaponType] || 10000;
  const barW = Math.min(100, (player.weaponTimer / maxTime) * 100);

  const barX = W - 120;   // derecha
  const barY = H - 18;    // alineado con vidas (un pelín arriba)

  ctx.fillStyle = getWeaponColor(player.weaponType);
  ctx.fillRect(barX, barY, barW, 6);

  ctx.strokeStyle = '#fff';
  ctx.strokeRect(barX, barY, 100, 6);

  // etiqueta chica arriba de la barra (para que no pelee con las vidas)
  ctx.fillStyle = '#fff';
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'right';
  ctx.fillText(player.weaponType.toUpperCase(), W - 10, barY - 4);
}


    // Lives
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = currentPalette[0];
      ctx.fillRect(10 + i * 20, H - 20, 10, 8);
    }

    // Pause overlay - ESTILO ARCADE
    if (state === 'paused') {
      // Fondo oscuro
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, W, H);
      
      // Borde decorativo
      ctx.strokeStyle = currentPalette[0];
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 80, W - 60, H - 200);
      
      // Título PAUSED parpadeante
      ctx.textAlign = 'center';
      ctx.font = '28px "Press Start 2P"';
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText('PAUSED', W / 2 + 3, 123);
      ctx.fillStyle = Math.sin(globalTime * 0.005) > 0 ? '#ff0' : '#fff';
      ctx.fillText('PAUSED', W / 2, 120);
      
      // Línea separadora
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 145);
      ctx.lineTo(W - 50, 145);
      ctx.stroke();
      
      // Stats
      ctx.font = '10px "Press Start 2P"';
      const statsX = 60;
      let y = 175;
      const lh = 26;
      
      // SCORE
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('SCORE:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(score.toString(), W - 60, y);
      
      // HI-SCORE
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('HI-SCORE:', statsX, y);
      ctx.fillStyle = score > bestScore ? '#0f0' : '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(Math.max(score, bestScore).toString(), W - 60, y);
      
      // LEVEL
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('LEVEL:', statsX, y);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'right';
      ctx.fillText(level + ' / 20', W - 60, y);
      
      // LIVES
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('LIVES:', statsX, y);
      for (let i = 0; i < lives; i++) {
        ctx.fillStyle = currentPalette[0];
        ctx.fillRect(W - 60 - (lives - 1 - i) * 18, y - 10, 12, 8);
      }
      
      // WEAPON
      y += lh;
      ctx.fillStyle = '#0ff';
      ctx.textAlign = 'left';
      ctx.fillText('WEAPON:', statsX, y);
      ctx.fillStyle = player.weaponType !== 'normal' ? getWeaponColor(player.weaponType) : '#666';
      ctx.textAlign = 'right';
      ctx.fillText(player.weaponType.toUpperCase(), W - 60, y);
      
      // Línea separadora
      y += 25;
      ctx.strokeStyle = '#444';
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(W - 50, y);
      ctx.stroke();
      
      // Menú de pausa
      y += 30;
      const pauseOptions = ['RESUME', 'OPTIONS', 'QUIT'];
      
      for (let i = 0; i < pauseOptions.length; i++) {
        const optY = y + i * 35;
        const isSelected = (pauseSelection === i);
        
        if (isSelected) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(50, optY - 18, W - 100, 30);
          
          ctx.fillStyle = '#ff0';
          ctx.font = '12px "Press Start 2P"';
          const pulse = Math.sin(globalTime * 0.008) * 3;
          ctx.textAlign = 'left';
          ctx.fillText('►', 60 - pulse, optY);
          ctx.textAlign = 'right';
          ctx.fillText('◄', W - 60 + pulse, optY);
        }
        
        ctx.font = '14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillStyle = isSelected ? '#ff0' : '#666';
        ctx.fillText(pauseOptions[i], W / 2, optY);
      }
      
      // Instrucciones
      ctx.font = '8px "Press Start 2P"';
      ctx.fillStyle = '#444';
      ctx.fillText('↑↓ SELECT   FIRE=OK', W / 2, H - 100);
    }
  }

  // TRY AGAIN overlay (gameover transient)
  if (state === 'gameover' && showTryAgain) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(-10, -10, W + 20, H + 20);

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '28px "Press Start 2P"';
    ctx.fillText('TRY AGAIN', W / 2, H / 2);
  }

  // Victory screen ÉPICO
  if (state === 'victory') {
    // Fondo gradual
    ctx.fillStyle = 'rgba(0,0,10,0.9)';
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    
    // Fase 1: Explosiones (solo mostrar boss explotando)
    if (victoryPhase === 1) {
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = '#f00';
      if (globalTime % 200 < 100) {
        ctx.fillText('EMPEROR DESTROYED', W / 2, H / 2);
      }
    }
    
    // Fase 2: Nave subiendo
    if (victoryPhase === 2) {
      // Dibujar nave subiendo
      const shipColor = currentPalette[0];
      const shipKey = (animationFrame === 0) ? 'player_a' : 'player_b';
      drawSprite(ctx, SPRITES[shipKey], player.x, playerVictoryY, shipColor, 3);
      
      // Estela de la nave
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.3 - i * 0.1;
        ctx.fillStyle = shipColor;
        ctx.fillRect(player.x + 14, playerVictoryY + 25 + i * 15, 5, 10);
      }
      ctx.globalAlpha = 1;
      
      ctx.font = '28px "Press Start 2P"';
      ctx.fillStyle = '#ff0';
      ctx.fillText('VICTORY!', W / 2, 80);
    }
    
    // Fase 3: Stats y grado
    if (victoryPhase === 3) {
      // Título
      ctx.font = '32px "Press Start 2P"';
      ctx.fillStyle = '#ff0';
      ctx.fillText('VICTORY!', W / 2, 60);
      
      // Grado gigante
      const gradePulse = Math.sin(globalTime * 0.005) * 0.2 + 0.8;
      ctx.font = '64px "Press Start 2P"';
      ctx.fillStyle = getGradeColor(finalGrade);
      ctx.globalAlpha = gradePulse;
      ctx.fillText(finalGrade, W / 2, 140);
      ctx.globalAlpha = 1;
      
      // Descripción del grado
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#888';
      const gradeDesc = {
        'S': 'PERFECT! LEGENDARY PILOT!',
        'A': 'EXCELLENT! TRUE HERO!',
        'B': 'GREAT JOB! WELL DONE!',
        'C': 'MISSION COMPLETE!'
      };
      ctx.fillText(gradeDesc[finalGrade], W / 2, 165);
      
      // Stats
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = 'left';
      const statsX = W / 2 - 100;
      let statsY = 200;
      const lineH = 24;
      
      ctx.fillStyle = '#0ff';
      ctx.fillText('FINAL SCORE:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(score.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('TIME:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(formatTime(gameStats.totalTime), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('ENEMIES:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(gameStats.enemiesKilled.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('ACCURACY:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      const accuracy = gameStats.shotsFired > 0 ? Math.floor((gameStats.shotsHit / gameStats.shotsFired) * 100) : 0;
      ctx.fillText(accuracy + '%', statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('POWERUPS:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.fillText(gameStats.powerupsCollected.toString(), statsX + 200, statsY);
      
      statsY += lineH;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0ff';
      ctx.fillText('CONTINUES:', statsX, statsY);
      ctx.textAlign = 'right';
      ctx.fillStyle = continueCount === 0 ? '#0f0' : '#f80';
      ctx.fillText(continueCount.toString(), statsX + 200, statsY);
      
      // Hardcore unlocked
      ctx.textAlign = 'center';
      ctx.font = '11px "Press Start 2P"';
      ctx.fillStyle = '#f0f';
      if (globalTime % 1000 < 500) {
        ctx.fillText('★ HARDCORE UNLOCKED ★', W / 2, statsY + 50);
      }
      
      // Press fire
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#aaa';
      if (globalTime % 800 < 400) {
        ctx.fillText('PRESS FIRE', W / 2, H - 70);
      }
      
      // Trofeo pequeño
      const trophyBob = Math.sin(globalTime * 0.004) * 5;
      drawSprite(ctx, SPRITES.victory_trophy, W - 60, 40 + trophyBob, '#ff0', 3);
    }

    // Confetti en todas las fases (excepto 1)
    if (victoryPhase > 1) {
      victoryParticles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.globalAlpha = 1;
    }
  }

  // Flash overlay
  if (flashScreen > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flashScreen * 0.1})`;
    ctx.fillRect(-10, -10, W + 20, H + 20);
  }

  ctx.restore();
}

function fire() {
  initAudio();
  const now = performance.now();

  let baseCooldown = player.shootCooldown;
  if (player.weaponType === 'machine') baseCooldown = 100;
  if (player.weaponType === 'laser') baseCooldown = 250;

  if (now - lastShotTime > baseCooldown) {
    if (player.weaponType === 'normal') {
      bullets.push({ x: player.x + 14, y: player.y, w: 4, h: 10, vx: 0, vy: -8, color: '#fff', type: 'normal' });
      playTone(600, 'sine', 0.08, 0.05);
    } else if (player.weaponType === 'double') {
      bullets.push({ x: player.x, y: player.y, w: 3, h: 8, vx: 0, vy: -8, color: '#ff0', type: 'double' });
      bullets.push({ x: player.x + player.width - 3, y: player.y, w: 3, h: 8, vx: 0, vy: -8, color: '#ff0', type: 'double' });
      playTone(700, 'sine', 0.08, 0.05);
    } else if (player.weaponType === 'spread') {
      bullets.push({ x: player.x + 14, y: player.y, w: 4, h: 8, vx: 0,  vy: -8, color: '#0f0', type: 'spread' });
      bullets.push({ x: player.x + 14, y: player.y, w: 4, h: 8, vx: -2, vy: -7, color: '#0f0', type: 'spread' });
      bullets.push({ x: player.x + 14, y: player.y, w: 4, h: 8, vx:  2, vy: -7, color: '#0f0', type: 'spread' });
      playTone(500, 'sine', 0.08, 0.05);
    } else if (player.weaponType === 'machine') {
      const off = (Math.random() * 6) - 3;
      bullets.push({ x: player.x + 14 + off, y: player.y, w: 3, h: 6, vx: 0, vy: -12, color: '#f0f', type: 'machine' });
      playTone(900, 'sine', 0.03, 0.03);
    } else if (player.weaponType === 'laser') {
      bullets.push({ x: player.x + 12, y: player.y, w: 6, h: 24, vx: 0, vy: -15, color: '#0ff', type: 'laser' });
      playTone(300, 'sine', 0.06, 0.05);
    }

    screenShake = 2;
    lastShotTime = now;
  }
}


function requestFull() {
  // Fullscreen es opcional: si el navegador lo permite, mejor inmersión en Android
  const el = document.documentElement;
  const fs = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fs && !document.fullscreenElement) {
    try { fs.call(el); } catch (e) {}
  }
}

// --- INPUT ---

document.addEventListener('keydown', e => {
  // ✅ Iniciar música del menú con cualquier tecla
  if (state === 'menu' && !menuMusicStarted && !isMuted) {
    initAudio();
    startMusic('menu');
    menuMusicStarted = true;
  }

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();

  // Mute music
  if (e.code === 'KeyM') {
    isMuted = !isMuted;
    if (isMuted) {
      if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
    } else if (!isMuted && state === 'playing') {
      startMusic(boss.active ? 'boss' : 'normal');
    }
    return;
  }

  // ✅ INPUT DE NOMBRE (high score)
  if (state === 'entering_name') {
    if (e.code === 'Enter' && playerName.length > 0) {
      addHighScore(score, playerName.toUpperCase());
      enteringName = false;
      state = 'menu';
      
      // Reset del juego
      bullets = [];
      enemyBullets = [];
      enemies = [];
      powerUps = [];
      particles = [];
      boss.active = false;
      player.weaponType = 'normal';
      player.weaponTimer = 0;
      return;
    }
    
    if (e.code === 'Backspace') {
      playerName = playerName.slice(0, -1);
      return;
    }
    
    // Aceptar letras y espacios (máximo 12 caracteres)
    if (playerName.length < 8) {
      if (e.key.length === 1 && /^[a-zA-Z0-9 ]$/.test(e.key)) {
        playerName += e.key;
      }
    }
    return;
  }

  // Continue
  if (state === 'continue' && (e.code === 'Space' || e.code === 'Enter')) {
    useContinue();
    return;
  }
  
  if (state === 'continue' && e.code === 'Escape') {
    declineContinue();
    return;
  }

  if (state === 'victory' && (e.code === 'Space' || e.code === 'Enter')) {
    // ✅ Solo permitir salir después de ver los stats (fase 3)
    if (victoryPhase < 3) return;
    
    state = 'menu';
    level = 1;
    score = 0;
    bullets = [];
    enemyBullets = [];
    victoryParticles = [];
    return;
  }

  if (state === 'menu') {
    // Navegación vertical
    if (e.code === 'ArrowUp') {
      menuSelection = (menuSelection - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
      playTone(600, 'sine', 0.05);
    }
    if (e.code === 'ArrowDown') {
      menuSelection = (menuSelection + 1) % MENU_OPTIONS.length;
      playTone(600, 'sine', 0.05);
    }
    
    // Cambiar dificultad con izq/der
    if ((e.code === 'ArrowRight' || e.code === 'ArrowLeft') && hardcoreUnlocked) {
      difficultyIndex = (difficultyIndex + 1) % 2;
      playTone(600, 'sine', 0.05);
    }

    if (e.code === 'Space' || e.code === 'Enter') {
      if (menuSelection === 0) {
        // PLAY
        requestFull();
        state = 'playing';
        menuMusicStarted = false;
        level = 1;
        score = 0;
        lives = difficulties[difficultyIndex].lives;
        extraLivesEarned = 0;
        continueCount = 0;
        gameStats = { enemiesKilled: 0, shotsFired: 0, shotsHit: 0, powerupsCollected: 0, timeStarted: globalTime, totalTime: 0 };
        player.x = W / 2 - 16;
        player.y = H - 40;
        pendingNextLevel = false;
        levelClearTimer = 0;
        warpSpeed = 1;
        startLevel();
      } else if (menuSelection === 1) {
        // SCORES
        state = 'scores';
        playTone(800, 'sine', 0.1);
      } else if (menuSelection === 2) {
        // OPTIONS
        state = 'options';
        playTone(800, 'sine', 0.1);
      }
    }
  }
  
  // Input para SCORES
  if (state === 'scores') {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      scoresTab = (scoresTab + 1) % 2;
      playTone(600, 'sine', 0.05);
    }
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
      state = 'menu';
      playTone(400, 'sine', 0.1);
    }
  }
  
  // Input para OPTIONS
  if (state === 'options') {
    // Navegación vertical
    if (e.code === 'ArrowUp') {
      optionSelection = (optionSelection - 1 + OPTIONS_COUNT) % OPTIONS_COUNT;
      playTone(600, 'sine', 0.05);
    }
    if (e.code === 'ArrowDown') {
      optionSelection = (optionSelection + 1) % OPTIONS_COUNT;
      playTone(600, 'sine', 0.05);
    }
    
    // Cambiar valores con izq/der
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      if (optionSelection === 0) {
        // SOUND
        isMuted = !isMuted;
        
        // ✅ Sincronizar botón de mute
        if (muteBtn) {
          muteBtn.textContent = isMuted ? '🔇' : '🔊';
          if (isMuted) {
            muteBtn.classList.add('muted');
          } else {
            muteBtn.classList.remove('muted');
          }
        }
        
        if (!isMuted) playTone(600, 'sine', 0.1);
      } else if (optionSelection === 1) {
        // VIBRATION
        vibrationEnabled = !vibrationEnabled;
        playTone(600, 'sine', 0.05);
      } else if (optionSelection === 2 && hardcoreUnlocked) {
        // DIFFICULTY
        difficultyIndex = (difficultyIndex + 1) % 2;
        playTone(600, 'sine', 0.05);
      }
    }
    
    // FIRE
    if (e.code === 'Space' || e.code === 'Enter') {
      if (optionSelection === 3) {
        // RESET SCORES
        highScores = [];
        highNames = [];
        highContinues = [];
        for (let i = 0; i < 10; i++) {
          highScores.push(0);
          highNames.push('---');
          highContinues.push(0);
        }
        bestScore = 0;
        saveHighScores();
        playTone(200, 'square', 0.3);
        state = 'menu';
      } else {
        // Volver al menú
        state = 'menu';
        playTone(400, 'sine', 0.1);
      }
    }
    
    if (e.code === 'Escape') {
      state = 'menu';
      playTone(400, 'sine', 0.1);
    }
  }
  
  if (state === 'playing') {
    if (e.code === 'ArrowLeft') player.movingLeft = true;
    if (e.code === 'ArrowRight') player.movingRight = true;
    if (e.code === 'ArrowUp') player.movingUp = true;
    if (e.code === 'ArrowDown') player.movingDown = true;
    if (e.code === 'Space' || e.code === 'Enter') isFiring = true;
  }

  // Pause toggle (only when actually paused/playing)
  // Input para PAUSED
  if (state === 'paused') {
    if (e.code === 'ArrowUp') {
      pauseSelection = (pauseSelection - 1 + 3) % 3;
      playTone(600, 'sine', 0.05);
    }
    if (e.code === 'ArrowDown') {
      pauseSelection = (pauseSelection + 1) % 3;
      playTone(600, 'sine', 0.05);
    }
    if (e.code === 'Space' || e.code === 'Enter') {
      if (pauseSelection === 0) {
        // RESUME
        state = 'playing';
        startMusic(boss.active ? 'boss' : 'normal');
        playTone(800, 'sine', 0.1);
      } else if (pauseSelection === 1) {
        // OPTIONS
        state = 'options';
        playTone(800, 'sine', 0.1);
      } else if (pauseSelection === 2) {
        // QUIT
        state = 'menu';
        bullets = [];
        enemyBullets = [];
        enemies = [];
        powerUps = [];
        particles = [];
        boss.active = false;
        player.weaponType = 'normal';
        playTone(400, 'sine', 0.1);
      }
      pauseSelection = 0;
    }
    if (e.code === 'Escape') {
      // ESC = Resume rápido
      state = 'playing';
      startMusic(boss.active ? 'boss' : 'normal');
    }
    return;
  }

  // Pause toggle (desde playing)
  if ((e.code === 'KeyP' || e.code === 'Escape') && state === 'playing') {
    state = 'paused';
    pauseSelection = 0;
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  }
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') player.movingLeft = false;
  if (e.code === 'ArrowRight') player.movingRight = false;
  if (e.code === 'ArrowUp') player.movingUp = false;
  if (e.code === 'ArrowDown') player.movingDown = false;
  if (e.code === 'Space' || e.code === 'Enter') isFiring = false;
});


// --- ANDROID/CHROME: auto-pause cuando la app va a background ---
let wasPlayingBeforeHide = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (state === 'playing') { wasPlayingBeforeHide = true; state = 'paused'; }
    if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  } else {
    if (state === 'paused' && wasPlayingBeforeHide) {
      requestFull();
      state = 'playing';
      startMusic(boss.active ? 'boss' : 'normal');
      wasPlayingBeforeHide = false;
    }
  }
});

// --- LOOP ---
let lastTime = 0;
const loop = (t) => {
  if (!lastTime) lastTime = t;
  const dtRaw = t - lastTime;
  // ✅ clamp para evitar saltos gigantes al volver de background (Android/Chrome)
  const dt = Math.min(50, Math.max(0, dtRaw));
  lastTime = t;
  update(dt);
  draw();
  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

// --- MOBILE CONTROLS: JOYSTICK VIRTUAL ---
const joystickContainer = document.getElementById('joystick-container');
const joystickStick = document.getElementById('joystick-stick');
const btnFire = document.getElementById('btn-fire');

let joystickActive = false;
const joystickMaxDistance = 40;

if (joystickContainer && joystickStick) {
  joystickContainer.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    joystickActive = true;
    updateJoystick(e);
  });

  joystickContainer.addEventListener('pointermove', (e) => {
    if (joystickActive) {
      e.preventDefault();
      updateJoystick(e);
    }
  });

  joystickContainer.addEventListener('pointerup', resetJoystick);
  joystickContainer.addEventListener('pointercancel', resetJoystick);
  joystickContainer.addEventListener('pointerleave', resetJoystick);


 function updateJoystick(e) {
    // ✅ Iniciar música del menú con toque
    if (state === 'menu' && !menuMusicStarted && !isMuted) {
      initAudio();
      startMusic('menu');
      menuMusicStarted = true;
    }

    const rect = joystickContainer.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let dx = e.clientX - rect.left - centerX;
    let dy = e.clientY - rect.top - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDistance = Math.min(distance, joystickMaxDistance);
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    joystickStick.style.transform = `translate(${x}px, ${y}px)`;

    const threshold = 0.4;

    // ✅ Si estamos ingresando nombre, cambiar letras
    if (state === 'entering_name') {
      if (joystickInputCooldown <= 0) {
        if (y < -threshold * joystickMaxDistance) {
          currentLetterIndex = (currentLetterIndex - 1 + ALPHABET.length) % ALPHABET.length;
          joystickInputCooldown = 200;
          playTone(600, 'sine', 0.05);
        } else if (y > threshold * joystickMaxDistance) {
          currentLetterIndex = (currentLetterIndex + 1) % ALPHABET.length;
          joystickInputCooldown = 200;
          playTone(600, 'sine', 0.05);
        }
      }
    }
    // ✅ Si estamos en el menú, navegar opciones
    else if (state === 'menu') {
      if (joystickInputCooldown <= 0) {
        // Arriba/Abajo para navegar
        if (y < -threshold * joystickMaxDistance) {
          menuSelection = (menuSelection - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
          joystickInputCooldown = 250;
          playTone(600, 'sine', 0.05);
        } else if (y > threshold * joystickMaxDistance) {
          menuSelection = (menuSelection + 1) % MENU_OPTIONS.length;
          joystickInputCooldown = 250;
          playTone(600, 'sine', 0.05);
        }
        
        // Izq/Der para dificultad
        if ((x < -threshold * joystickMaxDistance || x > threshold * joystickMaxDistance) && hardcoreUnlocked) {
          difficultyIndex = (difficultyIndex + 1) % 2;
          joystickInputCooldown = 300;
          playTone(600, 'sine', 0.05);
        }
      }
    }
    // ✅ Si estamos en options, navegar y cambiar valores
    else if (state === 'options') {
      if (joystickInputCooldown <= 0) {
        // Arriba/Abajo para navegar
        if (y < -threshold * joystickMaxDistance) {
          optionSelection = (optionSelection - 1 + OPTIONS_COUNT) % OPTIONS_COUNT;
          joystickInputCooldown = 250;
          playTone(600, 'sine', 0.05);
        } else if (y > threshold * joystickMaxDistance) {
          optionSelection = (optionSelection + 1) % OPTIONS_COUNT;
          joystickInputCooldown = 250;
          playTone(600, 'sine', 0.05);
        }
        
        // Izq/Der para cambiar valores
        if (x < -threshold * joystickMaxDistance || x > threshold * joystickMaxDistance) {
          if (optionSelection === 0) {
            isMuted = !isMuted;
            joystickInputCooldown = 300;
            
            // ✅ Sincronizar botón de mute
            if (muteBtn) {
              muteBtn.textContent = isMuted ? '🔇' : '🔊';
              if (isMuted) {
                muteBtn.classList.add('muted');
              } else {
                muteBtn.classList.remove('muted');
              }
            }
            
            if (!isMuted) playTone(600, 'sine', 0.1);
          } else if (optionSelection === 1) {
            vibrationEnabled = !vibrationEnabled;
            joystickInputCooldown = 300;
            playTone(600, 'sine', 0.05);
          } else if (optionSelection === 2 && hardcoreUnlocked) {
            difficultyIndex = (difficultyIndex + 1) % 2;
            joystickInputCooldown = 300;
            playTone(600, 'sine', 0.05);
          }
        }
      }
    }
    // ✅ Si estamos en pausa, navegar menú
    else if (state === 'paused') {
      if (joystickInputCooldown <= 0) {
        if (y < -threshold * joystickMaxDistance) {
          pauseSelection = (pauseSelection - 1 + 3) % 3;
          joystickInputCooldown = 250;
          playTone(600, 'sine', 0.05);
        } else if (y > threshold * joystickMaxDistance) {
          pauseSelection = (pauseSelection + 1) % 3;
          joystickInputCooldown = 250;
          playTone(600, 'sine', 0.05);
        }
      }
    }

    // ✅ Si estamos en scores, cambiar tab con joystick
    else if (state === 'scores') {
      if (joystickInputCooldown <= 0) {
        // Izquierda/Derecha para cambiar tab
        if (x < -threshold * joystickMaxDistance) {
          scoresTab = 0;  // LOCAL
          joystickInputCooldown = 300;
          playTone(600, 'sine', 0.05);
        } else if (x > threshold * joystickMaxDistance) {
          scoresTab = 1;  // GLOBAL
          joystickInputCooldown = 300;
          playTone(600, 'sine', 0.05);
        }
      }
    }
    else {
      // Modo normal: movimiento del jugador
      player.movingLeft = x < -threshold * joystickMaxDistance;
      player.movingRight = x > threshold * joystickMaxDistance;
      player.movingUp = y < -threshold * joystickMaxDistance;
      player.movingDown = y > threshold * joystickMaxDistance;
    }
  }

  function resetJoystick() {
    joystickActive = false;
    joystickStick.style.transform = 'translate(0px, 0px)';
    player.movingLeft = false;
    player.movingRight = false;
    player.movingUp = false;
    player.movingDown = false;
  }
}

// Evita scroll/zoom accidental en móviles mientras jugás
container.addEventListener(
  'touchmove',
  e => e.preventDefault(),
  { passive: false }
);

// disparo + start desde menú
bindHold(
  btnFire,
  () => {
    initAudio();

    // ✅ Continue
    if (state === 'continue') {
      useContinue();
      return;
    }

    // ✅ Salir de victoria
    if (state === 'victory') {
      // ✅ Solo permitir salir después de ver los stats (fase 3)
      if (victoryPhase < 3) return;
      
      state = 'menu';
      level = 1;
      score = 0;
      bullets = [];
      enemyBullets = [];
      enemies = [];
      powerUps = [];
      particles = [];
      victoryParticles = [];
      boss.active = false;
      player.weaponType = 'normal';
      return;
    }

    // ✅ Si estamos ingresando nombre, agregar letra
    if (state === 'entering_name') {
      if (playerName.length < 8) {
        playerName += ALPHABET[currentLetterIndex];
        playTone(880, 'square', 0.1, 0.1);
        vibrate(30);
      }
      return;
    }

    // ✅ Volver de SCORES
    if (state === 'scores') {
      state = 'menu';
      playTone(400, 'sine', 0.1);
      return;
    }
    
    // ✅ OPTIONS - FIRE hace cosas diferentes según selección
    if (state === 'options') {
      if (optionSelection === 3) {
        // RESET SCORES
        highScores = [];
        highNames = [];
        highContinues = [];
        for (let i = 0; i < 10; i++) {
          highScores.push(0);
          highNames.push('---');
          highContinues.push(0);
        }
        bestScore = 0;
        saveHighScores();
        playTone(200, 'square', 0.3);
      }
      state = 'menu';
      playTone(400, 'sine', 0.1);
      return;
    }

    // ✅ PAUSED - seleccionar opción
    if (state === 'paused') {
      if (pauseSelection === 0) {
        // RESUME
        state = 'playing';
        startMusic(boss.active ? 'boss' : 'normal');
        playTone(800, 'sine', 0.1);
      } else if (pauseSelection === 1) {
        // OPTIONS
        state = 'options';
        playTone(800, 'sine', 0.1);
      } else if (pauseSelection === 2) {
        // QUIT
        state = 'menu';
        bullets = [];
        enemyBullets = [];
        enemies = [];
        powerUps = [];
        particles = [];
        boss.active = false;
        player.weaponType = 'normal';
        playTone(400, 'sine', 0.1);
      }
      pauseSelection = 0;
      return;
    }

    // ✅ MENÚ - seleccionar opción
    if (state === 'menu') {
      if (menuSelection === 0) {
        // PLAY
        requestFull();
        state = 'playing';
        menuMusicStarted = false;
        level = 1;
        score = 0;
        lives = difficulties[difficultyIndex].lives;
        extraLivesEarned = 0;
        continueCount = 0;
        gameStats = { enemiesKilled: 0, shotsFired: 0, shotsHit: 0, powerupsCollected: 0, timeStarted: globalTime, totalTime: 0 };
        player.x = W / 2 - 16;
        player.y = H - 40;
        pendingNextLevel = false;
        levelClearTimer = 0;
        warpSpeed = 1;
        startLevel();
      } else if (menuSelection === 1) {
        // SCORES
        state = 'scores';
        playTone(800, 'sine', 0.1);
      } else if (menuSelection === 2) {
        // OPTIONS
        state = 'options';
        playTone(800, 'sine', 0.1);
      }
      return;
    }

    if (state === 'playing' && !pendingNextLevel) isFiring = true;
  },
  () => { isFiring = false; }
);
// --- DETECCIÓN DE MÓVIL ---
// Si detecta pantalla táctil, muestra los controles
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  const controls = document.getElementById('mobile-controls');
  if (controls) {
    controls.style.display = 'flex'; // Aquí anulamos el display: none del CSS
  }
}


// DEV CHEAT – BORRAR ANTES DE RELEASE ///////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('keydown', e => {
  if (e.code === 'KeyB') { // B de Boss
    state = 'playing';
    level = 20;            // nivel del boss
    enemies = [];
    pendingNextLevel = false;
    boss.active = false;
    startLevel();
  }
  
  // ✅ NUEVO: H de High Score
  if (e.code === 'KeyH') {
    score = 10000;
    state = 'entering_name';
    enteringName = true;
    playerName = '';
    currentLetterIndex = 0;
  }
  
  // ✅ NUEVO: L para subir nivel (testing IA)
  if (e.code === 'KeyL') {
    if (state === 'playing') {
      level++;
      console.log('Level:', level);
      pendingNextLevel = false;
      startLevel();
    }
  }
});

