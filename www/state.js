// =====================
// GALAXY RAIDERS - state.js
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
  
  // Alien tipo 3: "Tanque" - mÃ¡s grande, aguanta 2 hits
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
  
  // Alien tipo 4: "Veloz" - pequeÃ±o, se mueve rÃ¡pido
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

  

  // Player ship (2 frames) - mÃ¡s estÃ©tica, 11x8
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
  
  // === BOSSES ÃšNICOS ===
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
  const safeLevel = Math.max(1, Math.min(20, levelNum));
  const idx = safeLevel - 1;
  const progress = idx / 19; // 0.0 a 1.0
  const tension = Math.pow(progress, 1.2);
  const profile = (typeof getBalanceProfileConfig === 'function')
    ? getBalanceProfileConfig()
    : null;

  let enemySpeed = DIFFICULTY_TABLE.enemySpeed[idx];
  let bulletSpeed = DIFFICULTY_TABLE.bulletSpeed[idx];
  let shootCooldown = DIFFICULTY_TABLE.shootCooldown[idx];
  let diveChance = DIFFICULTY_TABLE.diveChance[idx];
  let maxDivers = DIFFICULTY_TABLE.maxDivers[idx];
  let diveSpeed = DIFFICULTY_TABLE.diveSpeed[idx];

  if (profile) {
    enemySpeed *= profile.enemySpeedMult;
    bulletSpeed *= profile.bulletSpeedMult;
    shootCooldown *= profile.shootCooldownMult;
    diveChance *= profile.diveChanceMult;
    maxDivers += profile.maxDiversOffset;
    diveSpeed *= profile.diveSpeedMult;
  }

  return {
    enemySpeed: enemySpeed,
    bulletSpeed: bulletSpeed,
    shootCooldown: Math.max(220, Math.round(shootCooldown)),
    diveChance: Math.max(0, Math.min(0.03, diveChance)),
    maxDivers: Math.max(0, Math.min(6, Math.round(maxDivers))),
    diveSpeed: diveSpeed,
    tankHpBonus: Math.floor((safeLevel + 1) / 9),
    specialChance: Math.min(0.45, 0.04 + tension * 0.46),
    enemyCountMult: 1.0 + tension * 0.32,
    scoreMult: 1.0 + tension * 0.55
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

// =====================
// CONTROL DECK SKINS
// =====================

const CONTROL_DECK_SKINS = {
  classic: {
    id: 'classic',
    label: 'Classic',
    themeClass: 'deck-skin-classic',
    unlocked: true
  },
  earth: {
    id: 'earth',
    label: 'Earth Defense',
    themeClass: 'deck-skin-earth',
    unlocked: true
  },
  imperial: {
    id: 'imperial',
    label: 'Imperial',
    themeClass: 'deck-skin-imperial',
    unlocked: false
  }
};

const CONTROL_DECK_SKIN_KEY = 'gr_controlDeckSkin';
let activeControlDeckSkin = 'classic';

function loadControlDeckSkin() {
  try {
    const saved = localStorage.getItem(CONTROL_DECK_SKIN_KEY);
    if (saved && CONTROL_DECK_SKINS[saved]) {
      activeControlDeckSkin = saved;
    }
  } catch (e) {}
}

function saveControlDeckSkin(skinId) {
  try {
    localStorage.setItem(CONTROL_DECK_SKIN_KEY, skinId);
  } catch (e) {}
}

function applyControlDeckSkin(skinId) {
  if (!CONTROL_DECK_SKINS[skinId]) return;

  const body = document.body;
  const deck = document.getElementById('mobile-controls');
  if (!deck) return;

  // Remove previous skin classes
  Object.values(CONTROL_DECK_SKINS).forEach(function(s) {
    body.classList.remove(s.themeClass);
    deck.classList.remove(s.themeClass);
  });

  // Apply new skin class
  activeControlDeckSkin = skinId;
  const skin = CONTROL_DECK_SKINS[skinId];
  body.classList.add(skin.themeClass);
  deck.classList.add(skin.themeClass);

  saveControlDeckSkin(skinId);
}

function initControlDeckSkin() {
  loadControlDeckSkin();
  applyControlDeckSkin(activeControlDeckSkin);
}

initControlDeckSkin();


