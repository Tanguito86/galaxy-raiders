// =====================
// GALAXY RAIDERS - config.js
// =====================

// Sistema de invencibilidad
const INVINCIBLE_DURATION = 2000; // 2 segundos

// Alfabeto para navegacion con joystick
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 !@#$%&*()-_=+[]{}:;.,?';

// === SISTEMA DE VIDAS EXTRA ===
const EXTRA_LIFE_SCORES = [10000, 30000, 60000, 100000];
const MAX_LIVES = 5;

// === SISTEMA DE CONTINUE ===
const CONTINUE_TIME = 5000; // 5 segundos para decidir
const CONTINUE_COST = 1; // 1 credito/ficha (para futuro IAP)

// Screen shake tuning (game feel)
const SHAKE_CONFIG = {
  maxInput: 72,
  decayPerMs: {
    light: 0.70,
    medium: 0.50,
    heavy: 0.34
  },
  bgMix: {
    light: 0.50,
    medium: 0.30,
    heavy: 0.16
  },
  gameplayMix: {
    light: 0.40,
    medium: 0.95,
    heavy: 1.22
  },
  bgStrength: 0.30,
  bgBossMultiplier: 1.00,
  bgNormalMultiplier: 0.22,
  starSmoothingKeep: 0.72,
  starSmoothingNoise: 0.28,
  gameplayTranslate: 0.13
};

// Bullet VFX tuning
const BULLET_FX = {
  trailLength: {
    normal: 4,
    double: 4,
    spread: 4,
    machine: 3,
    laser: 7
  },
  muzzleParticles: {
    normal: 4,
    double: 4,
    spread: 5,
    machine: 3,
    laser: 7
  }
};

// Music ducking / mixing presets (A/B)
const MUSIC_DUCKING_PRESETS = {
  cinematic: {
    baseGain: 1.0,
    minLevel: 0.20,
    defaultLevel: 0.60,
    defaultMs: 140,
    attackMs: 14,
    releaseMs: 120,
    bigExplosion: { level: 0.42, ms: 230 },
    bossWarning: { level: 0.68, ms: 120 },
    playerHit: { level: 0.56, ms: 150 }
  },
  arcade: {
    baseGain: 1.0,
    minLevel: 0.20,
    defaultLevel: 0.54,
    defaultMs: 160,
    attackMs: 10,
    releaseMs: 150,
    bigExplosion: { level: 0.34, ms: 280 },
    bossWarning: { level: 0.60, ms: 170 },
    playerHit: { level: 0.48, ms: 190 }
  }
};

let musicDuckingPresetKey = 'cinematic';
let MUSIC_DUCKING = JSON.parse(JSON.stringify(MUSIC_DUCKING_PRESETS[musicDuckingPresetKey]));

function setMusicDuckingPreset(name) {
  if (!MUSIC_DUCKING_PRESETS[name]) return false;
  musicDuckingPresetKey = name;
  MUSIC_DUCKING = JSON.parse(JSON.stringify(MUSIC_DUCKING_PRESETS[name]));
  return true;
}

function cycleMusicDuckingPreset() {
  const keys = Object.keys(MUSIC_DUCKING_PRESETS);
  const idx = keys.indexOf(musicDuckingPresetKey);
  const next = keys[(idx + 1 + keys.length) % keys.length];
  setMusicDuckingPreset(next);
  return musicDuckingPresetKey;
}

function getMusicDuckingPreset() {
  return musicDuckingPresetKey;
}
