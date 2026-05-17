// =====================
// GALAXY RAIDERS - entities.js
// =====================

const MAX_PARTICLES = 100;
const ENEMY_SPAWN_FLASH_DURATION = 220;

// --- STARS (HC-90 multi-layer with fallback) ---
function initStars() {
  if (typeof initHC90Stars === 'function') {
    initHC90Stars();
    return;
  }

  // Fallback: legacy starfield
  stars = [];

  function addStar(count, speed, size, color, depth) {
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: speed + (Math.random() - 0.5) * speed * 0.3,
        size: size,
        color: color,
        depth: depth,
        tw: Math.random() * 6.28,
        drift: (Math.random() - 0.5) * 0.25,
        phase: Math.random() * 1000
      });
    }
  }

  addStar(40, 0.4, 1, '#222', 0.05);
  addStar(60, 0.8, 1, '#333', 0.12);
  addStar(50, 1.2, 1, '#444', 0.20);
  addStar(40, 1.8, 1, '#555', 0.35);
  addStar(35, 2.5, 2, '#777', 0.50);
  addStar(20, 3.5, 2, '#aaa', 0.70);
  addStar(12, 4.5, 2, '#ccc', 0.85);
  addStar(6, 5.5, 3, '#fff', 1.0);
}


initStars();

function createExplosion(x, y, color, count = 15) {
  const mainCount = count;
  const sparkCount = Math.min(Math.ceil(count / 3), 8);
  const flashCount = count >= 15 ? 2 : 1;
  const ringCount = 1;
  const totalCount = mainCount + sparkCount + flashCount + ringCount;

  const overflow = (particles.length + totalCount) - MAX_PARTICLES;
  if (overflow > 0) particles.splice(0, overflow);

  for (let i = 0; i < mainCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 0.8 + Math.random() * 0.2,
      gravity: 0.25,
      color,
      size: Math.random() * 3 + 2
    });
  }

  for (let i = 0; i < sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.2 + Math.random() * 0.15,
      gravity: 0,
      color: '#fff',
      size: 1 + Math.random() * 1.5,
      isSpark: true
    });
  }

  for (let i = 0; i < flashCount; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 1,
      life: 0.18 + Math.random() * 0.1,
      gravity: 0,
      color: '#fff',
      size: 4 + Math.random() * 3
    });
  }

  particles.push({
    x, y,
    vx: 0, vy: 0,
    life: 0.45,
    gravity: 0,
    color,
    isRing: true,
    ringRadius: 4,
    ringExpand: 7
  });
}

function createBossDeathExplosion(x, y, color) {
  var totalCount = 88;
  var overflow = (particles.length + totalCount) - MAX_PARTICLES;
  if (overflow > 0) particles.splice(0, overflow);

  var i, angle, speed, sx, sy;
  var bossW = boss && boss.w ? boss.w : 90;
  var bossH = boss && boss.h ? boss.h : 50;
  var accent = '#ffea44';
  var ember = '#ff7a18';

  for (i = 0; i < 26; i++) {
    angle = Math.random() * Math.PI * 2;
    speed = 1.2 + Math.random() * 4.8;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.8,
      life: 0.75 + Math.random() * 0.45,
      gravity: 0.24,
      color: color,
      size: 3 + Math.random() * 4
    });
  }

  for (i = 0; i < 18; i++) {
    angle = Math.random() * Math.PI * 2;
    speed = 0.6 + Math.random() * 2.6;
    particles.push({
      x: x + Math.cos(angle) * bossW * (0.16 + Math.random() * 0.28),
      y: y + Math.sin(angle) * bossH * (0.14 + Math.random() * 0.32),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.9,
      life: 0.55 + Math.random() * 0.45,
      gravity: 0.18,
      color: i % 3 === 0 ? accent : ember,
      size: 2 + Math.random() * 3
    });
  }

  for (var s = 0; s < 5; s++) {
    angle = (Math.PI * 2 * s) / 5 + Math.random() * 0.35;
    sx = x + Math.cos(angle) * bossW * (0.24 + Math.random() * 0.28);
    sy = y + Math.sin(angle) * bossH * (0.20 + Math.random() * 0.24);
    for (i = 0; i < 4; i++) {
      angle = Math.random() * Math.PI * 2;
      speed = 1.1 + Math.random() * 3.2;
      particles.push({
        x: sx, y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        life: 0.34 + Math.random() * 0.36,
        gravity: 0.12,
        color: i % 2 === 0 ? '#fff' : accent,
        size: 1.5 + Math.random() * 2.5
      });
    }
  }

  for (i = 0; i < 16; i++) {
    angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.2;
    speed = 3.5 + Math.random() * 4.5;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 0.16 + Math.random() * 0.18,
      gravity: 0,
      color: '#fff',
      size: 1 + Math.random() * 1.7,
      isSpark: true
    });
  }

  for (i = 0; i < 4; i++) {
    particles.push({
      x: x, y: y,
      vx: 0, vy: 0,
      life: 0.28 + i * 0.08,
      gravity: 0,
      color: i === 0 ? '#fff' : i === 1 ? color : i === 2 ? accent : ember,
      isRing: true,
      ringRadius: 6 + i * 13,
      ringExpand: 7 + i * 2
    });
  }

  for (i = 0; i < 4; i++) {
    particles.push({
      x: x + (i - 1.5) * 3,
      y: y + (i % 2 === 0 ? -2 : 2),
      vx: (i - 1.5) * 0.15,
      vy: (i - 1.5) * 0.35,
      life: 0.10 + i * 0.04,
      gravity: 0,
      color: i === 0 ? '#fff' : i === 1 ? accent : color,
      size: 7 + i * 3
    });
  }
}

function createEnemyDeathPop(x, y, color, enemy) {
  var data = enemy ? (ENEMY_TYPES[enemy.type] || ENEMY_TYPES.alien1) : null;
  var etype = data ? enemy.type : 'default';

  var explosionCount = 18;
  var sparkBase = 2.8;
  var sparkExtra = 2.2;
  var ringLife = 0.28;
  var ringR = 3;
  var ringExpand = 5;
  var flashCount = 2;

  if (etype === 'alien_mini') {
    explosionCount = 12;
    ringLife = 0.18;
    ringR = 2;
    ringExpand = 3;
    flashCount = 1;
  } else if (data && data.hp >= 2 && data.speed < 1.0) {
    explosionCount = 22;
    sparkBase = 1.8;
    sparkExtra = 1.6;
    ringLife = 0.38;
    ringR = 5;
    ringExpand = 4;
  } else if (data && (data.speed >= 1.5 || data.kamikaze)) {
    sparkBase = 3.4;
    sparkExtra = 2.8;
  } else if (data && data.splits) {
    explosionCount = 20;
    sparkBase = 2.4;
    sparkExtra = 2.8;
  }

  createExplosion(x, y, color, explosionCount);

  var accentCount = 6;
  var totalExtra = accentCount + flashCount + 1;
  var overflow = (particles.length + totalExtra) - MAX_PARTICLES;
  if (overflow > 0) particles.splice(0, overflow);

  for (var i = 0; i < accentCount; i++) {
    var angle = (Math.PI * 2 * i) / accentCount + Math.random() * 0.35;
    var speed = sparkBase + Math.random() * sparkExtra;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.1,
      life: 0.22 + Math.random() * 0.12,
      gravity: 0.02,
      color: i % 2 === 0 ? '#fff' : '#ffea7a',
      size: 1 + Math.random() * 1.4,
      isSpark: true
    });
  }

  for (var j = 0; j < flashCount; j++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.8,
      life: 0.12 + Math.random() * 0.08,
      gravity: 0,
      color: '#fff',
      size: 3 + Math.random() * 2
    });
  }

  particles.push({
    x: x, y: y,
    vx: 0, vy: 0,
    life: ringLife,
    gravity: 0,
    color: '#fff',
    isRing: true,
    ringRadius: ringR,
    ringExpand: ringExpand
  });
}

function createImpactBurst(x, y, color, count = 5) {
  var total = count + 2;
  var overflow = (particles.length + total) - MAX_PARTICLES;
  if (overflow > 0) particles.splice(0, overflow);

  for (var i = 0; i < count; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 3 + 1.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.16 + Math.random() * 0.19,
      gravity: 0.05,
      color,
      size: 1 + Math.random() * 2,
      isSpark: true
    });
  }

  // HC-95: micro ring for impact definition
  particles.push({
    x, y,
    vx: 0, vy: 0,
    life: 0.18 + Math.random() * 0.08,
    gravity: 0,
    color: color,
    size: 2,
    isRing: true,
    ringRadius: 2 + Math.random() * 2,
    ringExpand: 4 + Math.random() * 3
  });

  // HC-95: bright core flash
  particles.push({
    x, y,
    vx: 0, vy: 0,
    life: 0.10 + Math.random() * 0.06,
    gravity: 0,
    color: '#ffffff',
    size: 3 + Math.random() * 2
  });
}

function createEnemyMuzzleFlash(x, y, sourceType) {
  var count = 3;
  var life = 0.12;
  var col = '#fff';
  var size = 2;

  if (sourceType === 'alien3') {
    count = 4;
    life = 0.16;
    col = '#ffcc88';
    size = 3;
  } else if (sourceType === 'alien4' || sourceType === 'alien5' || sourceType === 'alien_mini') {
    count = 2;
    life = 0.08;
    col = '#ff8899';
    size = 1.5;
  } else if (sourceType === 'alien6') {
    count = 3;
    life = 0.14;
    col = '#ff88cc';
    size = 3;
  }

  var overflow = (particles.length + count) - MAX_PARTICLES;
  if (overflow > 0) particles.splice(0, overflow);

  for (var i = 0; i < count; i++) {
    var angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.8;
    var speed = 0.5 + Math.random() * 1.5;
    particles.push({
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: life + Math.random() * 0.06,
      gravity: 0.08,
      color: i === 0 ? '#fff' : col,
      size: size + Math.random() * 2,
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

function startLevel() {
  recordRunLevel(level);
  if (typeof window.resetEncounterDirectorForLevel === 'function') {
    window.resetEncounterDirectorForLevel(level);
  }
  hitstopTimer = 0;
  clearScreenShakeLayers();
  currentSetPiece = null;
  setPieceBannerText = '';
  setPieceBannerTimer = 0;
  setPieceIntroTimer = 0;
  setPieceIntroResolved = true;
  setPiecePatternTimer = 0;
  setPieceFireTimer = 0;
  setPieceLaneIndex = 0;
  setPieceTelegraphTimer = 0;
  setPieceTelegraphSide = 0;
  setPieceBurstShotsRemaining = 0;
  setPieceBurstDelayTimer = 0;
  setPieceBurstVariant = 0;
  waveAnnounceText = '';
  waveAnnounceTimer = 0;
  waveAnnounceSubText = '';
  waveAnnounceSubTimer = 0;
  waveRewardText = '';
  waveRewardTimer = 0;
  resetWavePerfectTracking();
  initStars();
  powerUpsSpawnedThisLevel = 0;
  satellites = []; // âœ… Agregar
  mines = [];      // âœ… Agregar
  ufoRewards = [];
  
  // âœ… Verificar si este nivel tiene boss
  if (BOSS_LEVELS.includes(level)) {
    initBoss();
    startMusic(getMusicThemeForLevel(level, true));
  } else {
    initEnemies();
    startMusic(getMusicThemeForLevel(level, false));
  }
  
  currentPalette = PALETTES[(level - 1) % PALETTES.length];
  container.style.boxShadow = `0 0 60px ${currentPalette[0]}40`;
  ufo.active = false;
  bullets = [];
  enemyBullets = [];

  // âœ… PARALLAX: referencia inicial para evitar â€œtirÃ³nâ€ al arrancar el nivel
  prevPlayerX = player.x;
  prevPlayerY = player.y;
}


// --- FORMACIONES DE ENEMIGOS ---
function getFormation(levelNum) {
  const formations = ['classic', 'vshape', 'diamond', 'zigzag'];

  // cuÃ¡ntos bosses ya pasaron antes de este nivel
  const bossesBefore = BOSS_LEVELS.filter(b => b < levelNum).length;

  // Ã­ndice real solo contando niveles normales
  const nonBossIndex = (levelNum - bossesBefore) - 1; // 0-based

  return formations[nonBossIndex % formations.length];
}

// Determinar tipo de oleada segÃºn nivel
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

const SET_PIECE_BY_LEVEL = {
  3:  { key: 'pincer',         name: 'PINCER ASSAULT' },
  7:  { key: 'fortress',       name: 'FORTRESS LINE' },
  12: { key: 'kamikaze_rush',  name: 'KAMIKAZE RUSH' },
  16: { key: 'split_storm',    name: 'SPLITTER STORM' },
  18: { key: 'imperial_guard', name: 'IMPERIAL GUARD' }
};

function getSetPieceForLevel(levelNum) {
  if (BOSS_LEVELS.includes(levelNum)) return null;
  return SET_PIECE_BY_LEVEL[levelNum] || null;
}

function createSetPieceFormation(setPieceKey) {
  const newEnemies = [];

  if (setPieceKey === 'pincer') {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        newEnemies.push(createEnemy(18 + c * 38 + r * 4, 64 + r * 30, r, 'alien4'));
        newEnemies.push(createEnemy(W - 18 - (c + 1) * 38 - r * 4, 64 + r * 30, r, 'alien4'));
      }
    }
    for (let c = 0; c < 4; c++) {
      newEnemies.push(createEnemy(W / 2 - 70 + c * 40, 126, 4, 'alien2'));
    }
    newEnemies.push(createEnemy(W / 2 - 15, 56, 0, 'alien3'));
    return newEnemies;
  }

  if (setPieceKey === 'fortress') {
    for (let c = 0; c < 5; c++) newEnemies.push(createEnemy(40 + c * 62, 66, 0, 'alien3'));
    for (let c = 0; c < 7; c++) newEnemies.push(createEnemy(32 + c * 42, 110, 1, 'alien2'));
    for (let c = 0; c < 7; c++) newEnemies.push(createEnemy(32 + c * 42, 146, 2, 'alien1'));
    for (let c = 0; c < 5; c++) newEnemies.push(createEnemy(40 + c * 56, 184, 3, 'alien2'));
    return newEnemies;
  }

  if (setPieceKey === 'kamikaze_rush') {
    for (let c = 0; c < 8; c++) newEnemies.push(createEnemy(24 + c * 39, 62, 0, 'alien5'));
    for (let c = 0; c < 6; c++) newEnemies.push(createEnemy(35 + c * 47, 102, 1, 'alien4'));
    for (let c = 0; c < 5; c++) newEnemies.push(createEnemy(40 + c * 56, 142, 2, 'alien5'));
    for (let c = 0; c < 6; c++) newEnemies.push(createEnemy(30 + c * 48, 182, 3, 'alien2'));
    return newEnemies;
  }

  if (setPieceKey === 'split_storm') {
    for (let c = 0; c < 6; c++) newEnemies.push(createEnemy(30 + c * 50, 68, 0, 'alien6'));
    for (let c = 0; c < 7; c++) newEnemies.push(createEnemy(24 + c * 44, 106, 1, 'alien2'));
    for (let c = 0; c < 6; c++) newEnemies.push(createEnemy(30 + c * 50, 144, 2, 'alien6'));
    for (let c = 0; c < 7; c++) {
      const type = (c % 2 === 0) ? 'alien1' : 'alien4';
      newEnemies.push(createEnemy(24 + c * 44, 182, 3, type));
    }
    return newEnemies;
  }

  if (setPieceKey === 'imperial_guard') {
    for (let c = 0; c < 4; c++) newEnemies.push(createEnemy(52 + c * 68, 64, 0, 'alien3'));
    for (let c = 0; c < 6; c++) newEnemies.push(createEnemy(30 + c * 50, 106, 1, 'alien6'));
    for (let c = 0; c < 7; c++) newEnemies.push(createEnemy(24 + c * 44, 148, 2, 'alien2'));
    for (let c = 0; c < 8; c++) {
      const flank = (c === 0 || c === 7);
      newEnemies.push(createEnemy(18 + c * 41, 190, 3, flank ? 'alien5' : 'alien1'));
    }
    return newEnemies;
  }

  return newEnemies;
}

// Determinar tipo de enemigo segÃºn fila y nivel
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
  const scaledHp = getEnemyHpForLevel(type, data.hp, level);
  
  const w = sprite ? sprite[0].length * 3 : 24;
  const h = sprite ? sprite.length * 3 : 24;
  
  const enemy = {
    x, y, w, h, row, type,
    hp: scaledHp,
    maxHp: scaledHp,
    speedMult: data.speed,
    points: data.points,
    alive: true,
    diving: false,
    vx: 0, vy: 0,
    movePattern: ENEMY_MOVE_PATTERNS.STRAIGHT_DOWN,
    spawnFlashTimer: ENEMY_SPAWN_FLASH_DURATION,
    flashTimer: 0  // Para feedback visual de daño
  };

  if (typeof markEnemyPatternReady === 'function') markEnemyPatternReady(enemy);
  return enemy;
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

// HC-132: apply formation geometry bias based on wave personality
function applyFormationGeometry(enemies, personality) {
  if (!Array.isArray(enemies) || enemies.length === 0) return;
  if (!personality || personality === 'balanced') return;

  var cfg = {
    swarm:    { hMult: 0.82, vMult: 0.88, hCenter: 0,  vCenter: 0,   diagonal: 0, laneGap: 1, laneWiden: 4,  laneCount: 0 },
    sniper:   { hMult: 1.14, vMult: 1.00, hCenter: 0,  vCenter: 0,   diagonal: 0, laneGap: 2, laneWiden: 6,  laneCount: 1 },
    cleanup:  { hMult: 1.10, vMult: 1.08, hCenter: 0,  vCenter: 0,   diagonal: 0, laneGap: 2, laneWiden: 8,  laneCount: 1 },
    pressure: { hMult: 0.92, vMult: 0.94, hCenter: 0,  vCenter: 0,   diagonal: 0.08, laneGap: 0, laneWiden: 3, laneCount: 0 },
    flanker:  { hMult: 1.00, vMult: 1.00, hCenter: 0.08, vCenter: 0, diagonal: 0, laneGap: 1, laneWiden: 5,  laneCount: 1 }
  };
  var c = cfg[personality];
  if (!c) return;

  // compute center of mass
  var cx = 0, cy = 0, count = 0;
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    if (!e || !e.alive) continue;
    cx += e.x + e.w / 2;
    cy += e.y + e.h / 2;
    count++;
  }
  if (count === 0) return;
  cx /= count;
  cy /= count;

  for (var j = 0; j < enemies.length; j++) {
    var en = enemies[j];
    if (!en || !en.alive) continue;
    // HC-132C: external shmups/routed enemies keep authored route positions
    if (en.isExternalShmup || en._shmupRoute) continue;

    var dx = (en.x + en.w / 2) - cx;
    var dy = (en.y + en.h / 2) - cy;
    en.x = Math.round(clamp(cx + dx * c.hMult + dy * c.diagonal, 10, W - 10 - en.w));
    en.y = Math.round(clamp(cy + dy * c.vMult + dx * c.diagonal, 50, H - 80));

    if (c.hCenter !== 0) {
      var dist = Math.abs(dx) / (W / 2);
      en.x += Math.round(dx * c.hCenter * (1 - dist * 0.5));
      en.x = clamp(en.x, 10, W - 10 - en.w);
    }

    // HC-133: lane readability — breathing gaps at column boundaries
    if (c.laneCount > 0 && c.laneWiden > 0) {
      var colIdx = Math.round((en.x + en.w / 2 - 10) / 38); // approximate column from classic spacing
      var laneGapCol = (c.laneGap * 3 + (level || 1) * 7) % 10; // deterministic gap column (0-9)
      for (var l = 0; l < c.laneCount; l++) {
        var gapCol = (laneGapCol + l * 3) % 10;
        var colDist = colIdx - gapCol;
        if (Math.abs(colDist) <= 1) {
          if (colDist === 0) {
            // gap center column: no push
          } else {
            en.x += Math.round((colDist > 0 ? 1 : -1) * c.laneWiden * 0.5);
            en.x = clamp(en.x, 10, W - 10 - en.w);
          }
        }
      }
    }
  }
}

function trimFormationForExternalShmupWave(enemies, level) {
  if (!Array.isArray(enemies) || enemies.length === 0) return;

  const count = level <= 1 ? 2 : 3;

  const candidates = enemies.filter(e =>
    e.alive &&
    !e.diving &&
    !e.shmupRoute &&
    e.row !== undefined &&
    e.row >= 0 &&
    e.entryTargetX === undefined &&
    e.entryTargetY === undefined
  );

  if (candidates.length < count) return;

  // Prefer top rows and edge columns (least visible removal)
  const maxRow = Math.max(...candidates.map(e => e.row));
  candidates.forEach(e => {
    const rowNorm = maxRow > 0 ? e.row / maxRow : 0;
    const colCenter = (e.x + e.w / 2) / W;
    const edgeDist = Math.abs(colCenter - 0.5);
    e._trimScore = (1 - rowNorm) * 0.6 + edgeDist * 0.4 + Math.random() * 0.1;
  });

  candidates.sort((a, b) => b._trimScore - a._trimScore);

  for (let i = 0; i < Math.min(count, candidates.length); i++) {
    candidates[i].alive = false;
  }

  candidates.forEach(e => { delete e._trimScore; });
}

function addInitialExternalShmupWave(enemies, level) {
  if (!Array.isArray(enemies)) return;

  if (level <= 1) {
    const e1 = createEnemy(40 + Math.random() * (W - 80), -(40 + Math.random() * 50), -1, 'alien1');
    e1.y = e1.y - e1.h;
    e1.shmupRoute = SHMUP_ROUTES.STRAIGHT_DOWN;
    e1.routeSpeed = 1.1;
    e1.baseX = e1.x;
    e1.routePhase = Math.random() * Math.PI * 2;
    e1.isExternalShmup = true;
    e1.shmupShootCooldown = 3000;
    e1.shmupShootTimer = 1200;
    e1.shmupShotsRemaining = 1;
    e1.shmupShotPattern = 'basic';
    enemies.push(e1);

    const e2 = createEnemy(50 + Math.random() * (W - 100), -(90 + Math.random() * 60), -1, 'alien2');
    e2.y = e2.y - e2.h;
    e2.shmupRoute = SHMUP_ROUTES.SINE_DOWN;
    e2.routeSpeed = 0.95;
    e2.routeAmp = 28;
    e2.baseX = e2.x;
    e2.routePhase = Math.random() * Math.PI * 2;
    e2.isExternalShmup = true;
    e2.shmupShootCooldown = 3500;
    e2.shmupShootTimer = 1500;
    e2.shmupShotsRemaining = 1;
    e2.shmupShotPattern = 'aimed';
    enemies.push(e2);

  } else {
    const e1 = createEnemy(40 + Math.random() * (W - 80), -(40 + Math.random() * 50), -1, 'alien1');
    e1.y = e1.y - e1.h;
    e1.shmupRoute = SHMUP_ROUTES.STRAIGHT_DOWN;
    e1.routeSpeed = 1.0 + Math.random() * 0.4;
    e1.baseX = e1.x;
    e1.routePhase = Math.random() * Math.PI * 2;
    e1.isExternalShmup = true;
    e1.shmupShootCooldown = 2500;
    e1.shmupShootTimer = 1000;
    e1.shmupShotsRemaining = 2;
    e1.shmupShotPattern = 'basic';
    enemies.push(e1);

    const e2 = createEnemy(50 + Math.random() * (W - 100), -(90 + Math.random() * 60), -1, 'alien2');
    e2.y = e2.y - e2.h;
    e2.shmupRoute = SHMUP_ROUTES.SINE_DOWN;
    e2.routeSpeed = 0.9 + Math.random() * 0.3;
    e2.routeAmp = 24 + Math.random() * 16;
    e2.baseX = e2.x;
    e2.routePhase = Math.random() * Math.PI * 2;
    e2.isExternalShmup = true;
    e2.shmupShootCooldown = 2800;
    e2.shmupShootTimer = 1300;
    e2.shmupShotsRemaining = 2;
    e2.shmupShotPattern = 'aimed';
    enemies.push(e2);

    const fromRight = Math.random() < 0.5;
    const e3 = createEnemy(0, 60 + Math.random() * 100, -1, 'alien4');
    e3.x = fromRight ? W + 20 : -(e3.w + 20);
    e3.shmupRoute = fromRight ? SHMUP_ROUTES.SWEEP_LEFT : SHMUP_ROUTES.SWEEP_RIGHT;
    e3.routeSpeed = 0.7;
    e3.routeSideSpeed = 1.2 + Math.random() * 0.6;
    e3.baseX = e3.x;
    e3.routePhase = Math.random() * Math.PI * 2;
    e3.isExternalShmup = true;
    e3.shmupShootCooldown = 1800;
    e3.shmupShootTimer = 1000;
    e3.shmupShotsRemaining = 1;
    e3.shmupShotPattern = 'sweep';
    enemies.push(e3);
  }
}

function assignInitialShmupRoutes(enemies, level) {
  if (!Array.isArray(enemies) || enemies.length === 0) return;

  const maxRoutes = level <= 1 ? 3 : Math.min(5, Math.floor(enemies.length * 0.12));

  const candidates = enemies.filter(e =>
    e.alive && !e.diving && !e.shmupRoute && e.row !== undefined
  );

  if (candidates.length === 0) return;

  const maxRow = Math.max(...candidates.map(e => e.row));
  candidates.forEach(e => {
    const rowNorm = maxRow > 0 ? e.row / maxRow : 0;
    const distFromMiddle = Math.abs(rowNorm - 0.5);
    e._shmupScore = 1 - distFromMiddle * 1.5 + (Math.random() * 0.1 - 0.05);
  });

  candidates.sort((a, b) => b._shmupScore - a._shmupScore);

  const picked = candidates.slice(0, maxRoutes);
  picked.forEach(e => { delete e._shmupScore; });

  picked.forEach((e, i) => {
    e.baseX = e.x;
    e.routePhase = i * 1.7 + Math.random() * 0.5;

    if (level <= 1) {
      if (i === 0) {
        e.shmupRoute = SHMUP_ROUTES.STRAIGHT_DOWN;
        e.routeSpeed = 1.1;
      } else if (i === 1) {
        e.shmupRoute = SHMUP_ROUTES.SINE_DOWN;
        e.routeSpeed = 0.95;
        e.routeAmp = 28;
      } else if (i === 2) {
        e.shmupRoute = SHMUP_ROUTES.STRAIGHT_DOWN;
        e.routeSpeed = 1.2;
      }
    } else {
      const pool = i % 3;
      if (pool === 0) {
        e.shmupRoute = SHMUP_ROUTES.STRAIGHT_DOWN;
        e.routeSpeed = 1.0 + Math.random() * 0.4;
      } else if (pool === 1) {
        e.shmupRoute = SHMUP_ROUTES.SINE_DOWN;
        e.routeSpeed = 0.9 + Math.random() * 0.3;
        e.routeAmp = 24 + Math.random() * 16;
      } else {
        const centerX = W / 2;
        e.shmupRoute = (e.x + e.w / 2) < centerX ? SHMUP_ROUTES.SWEEP_RIGHT : SHMUP_ROUTES.SWEEP_LEFT;
        e.routeSpeed = 0.7;
        e.routeSideSpeed = 1.2 + Math.random() * 0.6;
      }
    }
  });
}

function getEncounterFormationRole(enemy) {
  if (!enemy) return 'standard';
  if (enemy.type === 'alien2') return 'sniper';
  if (enemy.type === 'alien3') return 'tank';
  if (enemy.type === 'alien4') return 'flanker';
  if (enemy.type === 'alien5') return 'kamikaze';
  if (enemy.type === 'alien6') return 'splitter';
  return 'standard';
}

function getFormationPacingDelay(baseDelay, directorState) {
  if (!baseDelay || baseDelay <= 0) return 0;

  const st = directorState || {};
  const pressure = Math.max(0, Math.min(1, Number(st.pressure) || 0));
  const silenceTimer = Math.max(0, Number(st.silenceTimer) || 0);
  let delay = baseDelay;

  if (pressure >= 0.70) delay *= 1.18;
  else if (pressure >= 0.45) delay *= 1.08;

  if (silenceTimer > 0) delay += Math.min(80, silenceTimer * 0.08);
  if (st.reliefActive) delay *= 0.82;
  if (level <= 5) delay *= 0.90;

  return Math.max(0, Math.min(850, Math.round(delay)));
}

function applyEncounterFormationPacing(normalEnemies, formation, waveType) {
  if (waveType !== 'normal') return;
  if (!Array.isArray(normalEnemies) || normalEnemies.length === 0) return;
  if (typeof window.getEncounterStaggerDelay !== 'function') return;

  // HC-127: select wave personality each normal wave
  if (typeof window.selectNextWavePersonality === 'function') {
    window.selectNextWavePersonality();
  }

  const directorState = (typeof window.getEncounterDirectorState === 'function')
    ? window.getEncounterDirectorState()
    : null;
  const candidates = normalEnemies.filter(e =>
    e &&
    e.alive &&
    !e.isExternalShmup &&
    !e.shmupRoute &&
    e.entryTargetX === undefined &&
    e.entryTargetY === undefined &&
    e.row >= 0
  );
  const groupSize = candidates.length;
  if (groupSize <= 1) return;

  for (let i = 0; i < groupSize; i++) {
    const enemy = candidates[i];
    if (enemy._encounterDelayTimer > 0) continue;

    const role = getEncounterFormationRole(enemy);
    const baseDelay = window.getEncounterStaggerDelay(role, i, groupSize, {
      isBoss: false,
      isSetPiece: false,
      isScripted: false,
      allowStagger: true,
      formation: formation,
      waveType: waveType
    });
    const delay = getFormationPacingDelay(baseDelay, directorState);
    if (delay > 0) {
      enemy._encounterDelayTimer = delay;
      enemy._encounterDelayInitial = delay;
      enemy._encounterPacingRole = role;
      enemy._encounterPacingFormation = formation;
    }
  }
}

function initEnemies() {
  boss.active = false;

  const setPiece = getSetPieceForLevel(level);
  currentSetPiece = setPiece ? setPiece.key : null;

  if (setPiece) {
    enemies = createSetPieceFormation(setPiece.key);
    setPieceBannerText = setPiece.name;
    setPieceBannerTimer = 3200;
    setPieceIntroTimer = (typeof window.getHardcoreRhythmIntro === 'function') ? window.getHardcoreRhythmIntro(2200) : 2200;
    setPieceIntroResolved = false;
    setPiecePatternTimer = 0;
    setPieceFireTimer = 0;
    setPieceLaneIndex = 0;
    setPieceTelegraphTimer = 0;
    setPieceTelegraphSide = 0;
    setPieceBurstShotsRemaining = 0;
    setPieceBurstDelayTimer = 0;
    setPieceBurstVariant = 0;

    enemies.forEach((e, idx) => {
      const targetX = e.x;
      const targetY = e.y;
      const side = targetX + e.w / 2 < W / 2 ? -1 : 1;

      e.entryTargetX = targetX;
      e.entryTargetY = targetY;
      e.entryDelay = (typeof window.getHardcoreRhythmEntryDelay === 'function') ? window.getHardcoreRhythmEntryDelay(e.row * 120 + (idx % 5) * 45) : (e.row * 120 + (idx % 5) * 45);
      e.entryDone = false;

      e.x = side < 0 ? -e.w - 80 - e.row * 12 : W + 80 + e.row * 12;
      e.y = targetY - 70 + (idx % 3) * 14;
    });

    pushScreenShake('light', 3);
    sfxBossWarning();
  } else {
    const formation = getFormation(level);
    const waveType = getWaveType(level);
    enemies = createFormation(formation);
    assignInitialShmupRoutes(enemies, level);
    trimFormationForExternalShmupWave(enemies, level);
    addInitialExternalShmupWave(enemies, level);
    if (waveType === 'normal') {
      applyEncounterFormationPacing(enemies, formation, waveType);
      var _geomPersonality = (typeof window.getCurrentWavePersonality === 'function')
        ? window.getCurrentWavePersonality()
        : 'balanced';
      applyFormationGeometry(enemies, _geomPersonality);
    } else if (typeof window.resetWavePersonality === 'function') {
      window.resetWavePersonality();
    }
    setPieceBannerText = '';
    setPieceBannerTimer = 0;
    setPieceIntroTimer = 0;
    setPieceIntroResolved = true;
    setPiecePatternTimer = 0;
    setPieceFireTimer = 0;
    setPieceLaneIndex = 0;
    setPieceTelegraphTimer = 0;
    setPieceTelegraphSide = 0;
    setPieceBurstShotsRemaining = 0;
    setPieceBurstDelayTimer = 0;
    setPieceBurstVariant = 0;
  }

  const stage = Math.floor((level - 1) / 5);
  enemySpeedX = 0.65 + stage * 0.4;
  enemyDir = 1;
}

function initBoss() {
  enemies = [];
  
  // âœ… Resetear flags de patrones anteriores
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
  
  // âœ… Cargar datos especÃ­ficos del boss segÃºn el nivel
  const bossData = BOSS_DATA[level];
  
  boss.active = true;
  boss.name = bossData.name;
  boss.pattern = bossData.pattern;
  
 // âœ… Ajustar tamaÃ±o segÃºn el boss
  if (boss.pattern === 'zigzag') {
    boss.w = 100;  // 20 columnas Ã— 5
    boss.h = 55;   // âœ… MÃ¡s alto para mejor proporciÃ³n (antes 45)
  } else if (boss.pattern === 'rotate') {
    boss.w = 90;   // Orbital mantiene tamaÃ±o
    boss.h = 50;   // Pero es mÃ¡s alto (10 filas)
  } else if (boss.pattern === 'supreme') {
    boss.w = 90;   // Emperador
    boss.h = 60;   // âœ… MÃ¡s alto (12 filas ahora)
  } else {
    boss.w = 90;   // Resto mantiene tamaÃ±o normal
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
  
  // Limpiar satÃ©lites anteriores
  satellites = [];
  
  // Crear satÃ©lites para ORBITAL
  if (boss.pattern === 'rotate') {
    const satCount = 2; // 2 satÃ©lites iniciales
    for (let i = 0; i < satCount; i++) {
      satellites.push({
        angle: (Math.PI * 2 * i) / satCount, // Distribuidos uniformemente
        distance: 60,
        radius: 8,
        shootTimer: Math.random() * 1000 // Desfasados para no disparar todos juntos
      });
    }
  }
  
  sfxBossWarning();
}

function getBossPhase() {
  if (!boss.active || boss.maxHp <= 0) return 1;

  const hpPct = boss.hp / boss.maxHp;

  if (hpPct > 0.66) return 1;
  if (hpPct > 0.33) return 2;
  return 3;
}

function updateBossPhase() {
  if (!boss.active || boss.maxHp <= 0) return;

  const newPhase = getBossPhase();
  boss.lastPhase = boss.phase;
  boss.phase = newPhase;
  boss.phaseChanged = (boss.lastPhase !== boss.phase);
}


function spawnRandomPowerUp(x, y) {
  const r = Math.random();
  let type;

  // âœ… Comunes -> Raros (suma 1.0)
  if (r < 0.45) type = 'double';        // 45% (mÃ¡s comÃºn)
  else if (r < 0.75) type = 'spread';   // 30% (comÃºn)
  else if (r < 0.92) type = 'machine';  // 17% (raro)
  else type = 'laser';                  // 8%  (muy raro)

  powerUps.push({ x, y, w: 12, h: 12, vy: 2, type });
}

function spawnUfoRewardDrop(x, y) {
  const r = Math.random();
  let reward = null;
  const endgame = level >= 18;
  const finalStage = level >= 20;
  const profile = (typeof getBalanceProfileConfig === 'function') ? getBalanceProfileConfig() : null;
  const aidMult = profile ? profile.ufoAidMult : 1.0;
  const scoreMult = profile ? profile.ufoScoreMult : 1.0;

  if (!endgame) {
    if (r < 0.35) reward = { kind: 'weapon', type: 'laser', duration: 12000 };
    else if (r < 0.55) reward = { kind: 'weapon', type: 'machine', duration: 10000 };
    else if (r < 0.75) {
      // 20% del total - mix de vida, score, shield
      const roll = Math.random();
      if (roll < 0.5) reward = { kind: 'life' };
      else if (roll < 0.8) reward = { kind: 'score', amount: 3000 };
      else reward = { kind: 'shield', duration: 2000 };
    } else {
      reward = { kind: 'score', amount: 5000, rare: true };
    }
  } else {
    // Endgame: priorizar supervivencia sin regalar la partida
    if (r < 0.30) reward = { kind: 'weapon', type: 'laser', duration: finalStage ? 14000 : 13000 };
    else if (r < 0.50) reward = { kind: 'weapon', type: 'machine', duration: finalStage ? 12000 : 11000 };
    else if (r < 0.84) {
      const roll = Math.random();
      if (roll < 0.42) reward = { kind: 'life' };
      else if (roll < 0.75) reward = { kind: 'shield', duration: finalStage ? 3200 : 2600 };
      else reward = { kind: 'score', amount: finalStage ? 4500 : 3800 };
    } else {
      reward = { kind: 'score', amount: finalStage ? 7000 : 6000, rare: true };
    }
  }

  if (reward) {
    if (reward.kind === 'weapon') {
      reward.duration = Math.max(7000, Math.round(reward.duration * (0.88 + aidMult * 0.12)));
    }
    if (reward.kind === 'shield') {
      reward.duration = Math.max(1200, Math.round(reward.duration * aidMult));
    }
    if (reward.kind === 'life' && Math.random() > aidMult) {
      reward = { kind: 'score', amount: endgame ? 4200 : 2800 };
    }
    if (reward.kind === 'score') {
      reward.amount = Math.max(500, Math.round(reward.amount * scoreMult));
    }
  }

  ufoRewards.push({
    x, y,
    w: 16, h: 16,
    vy: 2.2,
    reward,
    t: 0
  });

  sfxPowerUp();
}




function trySpawnPowerUp(x, y, chance) {
  const balance = getPowerUpBalance(level, lives);
  const cooldownMs = POWERUP_COOLDOWN * balance.cooldownMult;
  const effectiveChance = Math.min(0.24, chance * balance.chanceMult);

  if (
    player.weaponType !== 'normal' ||
    globalTime < nextPowerUpTime ||
    powerUps.length >= MAX_ACTIVE_POWERUPS ||
    powerUpsSpawnedThisLevel >= balance.maxPerLevel ||
    Math.random() >= effectiveChance
  ) return false;

  spawnRandomPowerUp(x, y);
  powerUpsSpawnedThisLevel++;
  nextPowerUpTime = globalTime + cooldownMs;
  return true;
}


function activateWeapon(type) {
  // DuraciÃ³n segÃºn rareza
  const durations = {
    double: 4000,    // 4s - comÃºn
    spread: 4000,    // 4s - comÃºn
    machine: 4000,   // 4s - raro
    laser: 4000      // 4s - muy raro
  };
  
  const duration = durations[type] || 10000;
  
  // Acumulable si es el mismo tipo
  if (player.weaponType === type) {
    player.weaponTimer += 5000;  // +5 segundos
    spawnPopup(player.x + player.w / 2, player.y - 8, '+' + type.toUpperCase(), getWeaponColor(type));
    sfxPowerUp();  // Sonido de bonus
  } else {
    player.weaponType = type;
    player.weaponTimer = duration;
    spawnPopup(player.x + player.w / 2, player.y - 8, type.toUpperCase(), getWeaponColor(type));
    sfxPowerUp();
  }
  
  vibrate('hit');
}

function getWeaponColor(type) {
  if (type === 'double') return '#ff0';
  if (type === 'spread') return '#0f0';
  if (type === 'machine') return '#f0f';
  if (type === 'laser') return '#0ff';
  return '#fff';
}




