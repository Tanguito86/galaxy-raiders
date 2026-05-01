// =====================
// GALAXY RAIDERS - balance.js
// =====================

// Tabla 1-20 para tuning fino sin tocar logica de update.
const DIFFICULTY_TABLE = {
  enemySpeed: [
    0.92, 0.96, 1.00, 1.04, 1.08,
    1.12, 1.16, 1.20, 1.21, 1.27,
    1.34, 1.39, 1.46, 1.52, 1.60,
    1.68, 1.76, 1.77, 1.86, 1.96
  ],
  bulletSpeed: [
    2.70, 2.80, 2.90, 3.00, 3.10,
    3.22, 3.34, 3.46, 3.50, 3.62,
    3.74, 3.84, 3.98, 4.08, 4.20,
    4.32, 4.44, 4.46, 4.64, 4.84
  ],
  shootCooldown: [
    1020, 1000, 980, 960, 940,
    915, 890, 865, 858, 833,
    808, 790, 760, 740, 710,
    680, 650, 646, 594, 552
  ],
  diveChance: [
    0.0010, 0.0011, 0.0013, 0.0015, 0.0018,
    0.0021, 0.0024, 0.0026, 0.00262, 0.00284,
    0.00306, 0.00322, 0.00352, 0.00380, 0.00410,
    0.00440, 0.00470, 0.00472, 0.00508, 0.00545
  ],
  maxDivers: [
    1, 1, 1, 1, 1,
    1, 1, 1, 2, 2,
    2, 2, 2, 2, 2,
    2, 2, 3, 3, 3
  ],
  diveSpeed: [
    2.15, 2.25, 2.35, 2.45, 2.55,
    2.65, 2.75, 2.85, 2.87, 2.97,
    3.07, 3.17, 3.30, 3.40, 3.55,
    3.70, 3.82, 3.83, 3.94, 4.05
  ]
};

const POWERUP_BALANCE_TABLE = {
  chanceMult: [
    1.25, 1.20, 1.16, 1.12, 1.08,
    1.04, 1.00, 0.96, 0.94, 0.92,
    0.94, 0.96, 1.00, 1.04, 1.08,
    1.12, 1.16, 1.24, 1.32, 1.42
  ],
  cooldownMult: [
    0.92, 0.94, 0.96, 0.98, 1.00,
    1.00, 1.02, 1.03, 1.05, 1.06,
    1.05, 1.03, 1.00, 0.98, 0.96,
    0.94, 0.92, 0.88, 0.84, 0.80
  ],
  maxPerLevel: [
    5, 5, 5, 5, 5,
    5, 5, 5, 4, 4,
    4, 4, 4, 4, 4,
    4, 4, 5, 5, 5
  ]
};

const BALANCE_PROFILE_STORAGE_KEY = 'gr_balance_profile';
const BALANCE_PROFILES = {
  arcade: {
    key: 'arcade',
    label: 'ARCADE',
    enemySpeedMult: 1.00,
    bulletSpeedMult: 1.00,
    shootCooldownMult: 1.00,
    diveChanceMult: 1.00,
    maxDiversOffset: 0,
    diveSpeedMult: 1.00,
    powerupChanceMult: 1.00,
    powerupCooldownMult: 1.00,
    powerupMaxOffset: 0,
    scoreRiskMult: 1.00,
    ufoAidMult: 1.00,
    ufoScoreMult: 1.00
  },
  tournament: {
    key: 'tournament',
    label: 'TOURNAMENT',
    enemySpeedMult: 1.06,
    bulletSpeedMult: 1.08,
    shootCooldownMult: 0.90,
    diveChanceMult: 1.22,
    maxDiversOffset: 1,
    diveSpeedMult: 1.10,
    powerupChanceMult: 0.80,
    powerupCooldownMult: 1.22,
    powerupMaxOffset: -1,
    scoreRiskMult: 1.18,
    ufoAidMult: 0.70,
    ufoScoreMult: 1.25
  }
};

let balanceProfileKey = 'arcade';

try {
  const savedProfile = localStorage.getItem(BALANCE_PROFILE_STORAGE_KEY);
  if (savedProfile && BALANCE_PROFILES[savedProfile]) balanceProfileKey = savedProfile;
} catch (e) {}

function getBalanceProfile() {
  return balanceProfileKey;
}

function getBalanceProfileConfig() {
  return BALANCE_PROFILES[balanceProfileKey] || BALANCE_PROFILES.arcade;
}

function getBalanceProfileLabel() {
  return getBalanceProfileConfig().label || 'ARCADE';
}

function setBalanceProfile(key) {
  if (!BALANCE_PROFILES[key]) return false;
  balanceProfileKey = key;
  try {
    localStorage.setItem(BALANCE_PROFILE_STORAGE_KEY, key);
  } catch (e) {}
  return true;
}

function cycleBalanceProfile() {
  const keys = Object.keys(BALANCE_PROFILES);
  const idx = keys.indexOf(balanceProfileKey);
  const next = keys[(idx + 1 + keys.length) % keys.length];
  setBalanceProfile(next);
  return balanceProfileKey;
}

function getBalanceIndex(levelNum) {
  const safeLevel = Math.max(1, Math.min(20, Math.floor(levelNum || 1)));
  return safeLevel - 1;
}

function getPowerUpBalance(levelNum, livesLeft = 3) {
  const idx = getBalanceIndex(levelNum);
  const emergency = livesLeft <= 1 ? 1.18 : (livesLeft === 2 ? 1.08 : 1.0);
  const profile = getBalanceProfileConfig();

  const chanceMult = POWERUP_BALANCE_TABLE.chanceMult[idx] * emergency * profile.powerupChanceMult;
  const cooldownMult = POWERUP_BALANCE_TABLE.cooldownMult[idx] * (livesLeft <= 1 ? 0.9 : 1.0) * profile.powerupCooldownMult;
  const maxPerLevel = POWERUP_BALANCE_TABLE.maxPerLevel[idx] + profile.powerupMaxOffset;

  return {
    chanceMult: Math.max(0.45, Math.min(2.2, chanceMult)),
    cooldownMult: Math.max(0.65, Math.min(1.8, cooldownMult)),
    maxPerLevel: Math.max(2, Math.min(7, maxPerLevel))
  };
}

function getEnemyHpForLevel(enemyType, baseHp, levelNum) {
  const lvl = Math.max(1, Math.floor(levelNum || 1));
  let hp = Math.max(1, Math.floor(baseHp || 1));

  if (enemyType === 'alien3') {
    if (lvl >= 7) hp += 1;
    if (lvl >= 14) hp += 1;
  } else if (enemyType === 'alien6') {
    if (lvl >= 16) hp += 1;
  }

  return Math.max(1, hp);
}
