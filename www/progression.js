// =====================
// GALAXY RAIDERS - progression.js
// =====================

function awardExtraLife() {
  if (lives < MAX_LIVES) {
    lives++;
    sfxPowerUp();
    pushScreenShake('medium', 10);
    flashScreen = 15;
    vibrate('hit');
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


// âœ… ProgresiÃ³n del juego
let gameCompleted = false;
let victoryTimer = 0;
let victoryParticles = [];

// === SISTEMA DE FINAL Ã‰PICO ===
let victoryPhase = 0;
let victoryPhaseTimer = 0;
let bossExplosionCount = 0;
let playerVictoryY = 0;
let finalGrade = 'C';
let lastRunTelemetry = null;
const RUN_QA_HISTORY_KEY = 'gr_run_qa_history_v1';

function getCurrentDifficultyKey() {
  // HC-12: hardcore-only mode — always return 'hardcore'
  return 'hardcore';
}

function getCurrentBalanceProfileKey() {
  if (typeof getBalanceProfile === 'function') return getBalanceProfile();
  return 'arcade';
}

function createEmptyRunStats() {
  return {
    enemiesKilled: 0,
    shotsFired: 0,
    shotsHit: 0,
    powerupsCollected: 0,
    levelReached: 1,
    deaths: 0,
    deathByCause: {
      bullet: 0,
      diving: 0,
      boss: 0,
      invasion: 0,
      unknown: 0
    },
    runEndedBy: '',
    timeStarted: globalTime,
    totalTime: 0,
    continuesUsed: 0,
    accuracy: 0,
    balanceProfile: getCurrentBalanceProfileKey(),
    difficultyMode: getCurrentDifficultyKey(),
    currentLevel: null,
    currentLevelStartedAt: globalTime,
    levelTimesMs: {}
  };
}

let gameStats = createEmptyRunStats();

function ensureRunStatsShape() {
  if (!gameStats || typeof gameStats !== 'object') {
    gameStats = createEmptyRunStats();
    return;
  }
  if (!gameStats.deathByCause || typeof gameStats.deathByCause !== 'object') {
    gameStats.deathByCause = { bullet: 0, diving: 0, boss: 0, invasion: 0, unknown: 0 };
  }
  if (!gameStats.levelTimesMs || typeof gameStats.levelTimesMs !== 'object') {
    gameStats.levelTimesMs = {};
  }
  if (!gameStats.balanceProfile) gameStats.balanceProfile = getCurrentBalanceProfileKey();
  if (!gameStats.difficultyMode) gameStats.difficultyMode = getCurrentDifficultyKey();
  if (!Number.isFinite(gameStats.currentLevelStartedAt)) gameStats.currentLevelStartedAt = gameStats.timeStarted || globalTime;
}

function closeActiveLevelSlice(now = globalTime) {
  ensureRunStatsShape();
  if (!Number.isFinite(gameStats.currentLevel) || gameStats.currentLevel <= 0) return;

  const start = Number.isFinite(gameStats.currentLevelStartedAt)
    ? gameStats.currentLevelStartedAt
    : (gameStats.timeStarted || now);
  const elapsed = Math.max(0, now - start);
  const key = String(gameStats.currentLevel);
  gameStats.levelTimesMs[key] = (gameStats.levelTimesMs[key] || 0) + elapsed;
  gameStats.currentLevelStartedAt = now;
}

function buildRunQaSnapshot(stats) {
  const levelTimesSec = {};
  const src = (stats && stats.levelTimesMs) || {};
  Object.keys(src).forEach(levelKey => {
    levelTimesSec[levelKey] = Number((src[levelKey] / 1000).toFixed(2));
  });

  return {
    date: new Date().toISOString(),
    profile: stats.balanceProfile || 'arcade',
    difficulty: stats.difficultyMode || 'normal',
    endedBy: stats.runEndedBy || 'unknown',
    levelReached: stats.levelReached || 1,
    score: score,
    continues: stats.continuesUsed || 0,
    deaths: stats.deaths || 0,
    accuracy: stats.accuracy || 0,
    totalTimeSec: Number(((stats.totalTime || 0) / 1000).toFixed(2)),
    deathByCause: Object.assign({}, stats.deathByCause || {}),
    levelTimesSec
  };
}

function saveRunQaSnapshot(stats) {
  try {
    const raw = localStorage.getItem(RUN_QA_HISTORY_KEY);
    const history = raw ? JSON.parse(raw) : [];
    const safeHistory = Array.isArray(history) ? history : [];
    safeHistory.push(buildRunQaSnapshot(stats));
    const trimmed = safeHistory.slice(-24);
    localStorage.setItem(RUN_QA_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (e) {}
}

function getRecentRunQaSnapshots(limit = 6) {
  try {
    const raw = localStorage.getItem(RUN_QA_HISTORY_KEY);
    if (!raw) return [];
    const history = JSON.parse(raw);
    if (!Array.isArray(history)) return [];
    const safeLimit = Math.max(1, Math.min(24, Math.floor(limit || 6)));
    return history.slice(-safeLimit);
  } catch (e) {
    return [];
  }
}

function calculateEnemyKillScore(enemy, enemyData, bulletType = 'normal') {
  const basePoints = (enemyData && enemyData.points) || (20 + (4 - (enemy?.row || 0)) * 10);
  let mult = 1.0;

  // Riesgo por enemigo agresivo
  if (enemy && enemy.diving) mult += 0.38;

  // Set-pieces valen un poco mas por complejidad tactica
  if (currentSetPiece) mult += 0.14;

  // Bonus por cercania al player (juego agresivo)
  if (enemy && player) {
    const ex = enemy.x + (enemy.w || 0) * 0.5;
    const ey = enemy.y + (enemy.h || 0) * 0.5;
    const px = player.x + player.width * 0.5;
    const py = player.y + player.height * 0.5;
    const dist = Math.hypot(px - ex, py - ey);
    if (dist < 150) mult += 0.16;
    if (dist < 95) mult += 0.12;
  }

  // Lategame mantiene la economia de score interesante
  if (level >= 14) mult += 0.08;
  if (level >= 18) mult += 0.11;
  if (level >= 20) mult += 0.05;

  // Mini aliens no deben inflar score demasiado
  if (enemy && enemy.type === 'alien_mini') mult *= 0.7;

  const profile = (typeof getBalanceProfileConfig === 'function')
    ? getBalanceProfileConfig()
    : null;
  if (profile) mult *= profile.scoreRiskMult;

  let total = Math.round(basePoints * mult);
  if (bulletType === 'normal') total += 10;

  return Math.max(5, total);
}

function recordRunLevel(levelNum) {
  ensureRunStatsShape();
  const safeLevel = Math.max(1, Math.floor(levelNum || 1));

  if (!Number.isFinite(gameStats.currentLevel) || gameStats.currentLevel <= 0) {
    gameStats.currentLevel = safeLevel;
    gameStats.currentLevelStartedAt = globalTime;
  } else if (gameStats.currentLevel !== safeLevel) {
    closeActiveLevelSlice(globalTime);
    gameStats.currentLevel = safeLevel;
    gameStats.currentLevelStartedAt = globalTime;
  }

  gameStats.levelReached = Math.max(gameStats.levelReached || 1, safeLevel);
  gameStats.balanceProfile = getCurrentBalanceProfileKey();
  gameStats.difficultyMode = getCurrentDifficultyKey();
}

function recordPlayerDeath(cause = 'unknown', lostLives = 1) {
  // HC-RK-02: record hit for performance tracking
  if (typeof window.recordHardcoreRankHit === 'function') {
    window.recordHardcoreRankHit(typeof globalTime === 'number' ? globalTime : 0);
  }
  // HC-SC-04: apply multiplier penalty on death
  if (typeof window.applyScoreMultiplierPenalty === 'function') {
    window.applyScoreMultiplierPenalty('death');
  }
  if (typeof window.reduceHardcoreRank === 'function') {
    window.reduceHardcoreRank(8, 'player_hit');
  }
  if (typeof window.breakHardcoreCombo === 'function') {
    window.breakHardcoreCombo('player_hit');
  }
  ensureRunStatsShape();
  const key = Object.prototype.hasOwnProperty.call(gameStats.deathByCause, cause) ? cause : 'unknown';
  const amount = Math.max(1, Math.floor(lostLives || 1));
  gameStats.deaths += amount;
  gameStats.deathByCause[key] += amount;
  markWaveDamageTaken();
}

function recordShotsFired(amount = 1) {
  ensureRunStatsShape();
  gameStats.shotsFired += Math.max(0, Math.floor(amount));
  // HC-RK-02: track accuracy for rank
  if (typeof window.recordHardcoreRankShotFired === 'function') {
    window.recordHardcoreRankShotFired(Math.max(0, Math.floor(amount)));
  }
}

function recordShotHit(amount = 1) {
  ensureRunStatsShape();
  gameStats.shotsHit += Math.max(0, Math.floor(amount));
  // HC-RK-02: track accuracy for rank
  if (typeof window.recordHardcoreRankShotHit === 'function') {
    window.recordHardcoreRankShotHit(Math.max(0, Math.floor(amount)));
  }
}

function recordEnemyKilled(amount = 1) {
  ensureRunStatsShape();
  gameStats.enemiesKilled += Math.max(0, Math.floor(amount));
  markWaveEnemyKilled();
}

function recordPowerupCollected(amount = 1) {
  ensureRunStatsShape();
  gameStats.powerupsCollected += Math.max(0, Math.floor(amount));
}

function finalizeRunStats(endReason = 'unknown') {
  ensureRunStatsShape();
  closeActiveLevelSlice(globalTime);
  gameStats.totalTime = Math.max(0, globalTime - (gameStats.timeStarted || 0));
  gameStats.continuesUsed = continueCount;
  gameStats.accuracy = gameStats.shotsFired > 0
    ? Math.floor((gameStats.shotsHit / gameStats.shotsFired) * 100)
    : 0;
  gameStats.balanceProfile = getCurrentBalanceProfileKey();
  gameStats.difficultyMode = getCurrentDifficultyKey();
  if (!gameStats.runEndedBy) gameStats.runEndedBy = endReason;
  gameStats.currentLevel = null;
  gameStats.currentLevelStartedAt = null;
  lastRunTelemetry = JSON.parse(JSON.stringify(gameStats));
  saveRunQaSnapshot(lastRunTelemetry);
}

// Wave recovery rewards
function grantWaveCompletionBonus(completedLevel) {
  if (completedLevel <= 0) return null;

  const bonusScore = 500 + completedLevel * 200;
  awardScore({ points: bonusScore, source: 'waveBonus' });

  var rewardText = '+' + bonusScore + ' WAVE BONUS';

  if (completedLevel % 5 === 0 && completedLevel > lastMilestoneRewardLevel) {
    if (lives < MAX_LIVES) {
      awardExtraLife();
      lastMilestoneRewardLevel = completedLevel;
      rewardText += '  +1 LIFE';
    } else {
      var extraScore = completedLevel * 500;
      awardScore({ points: extraScore, source: 'stageMilestone' });
      rewardText += '  +' + extraScore;
    }
    lastMilestoneRewardLevel = completedLevel;
  }

  return { text: rewardText };
}

function resetWaveRewardTracking() {
  waveAnnounceText = '';
  waveAnnounceTimer = 0;
  waveAnnounceSubText = '';
  waveAnnounceSubTimer = 0;
  waveRewardText = '';
  waveRewardTimer = 0;
  lastMilestoneRewardLevel = 0;
}

// âœ… Sistema de bosses - 5 bosses Ãºnicos en 20 niveles
const BOSS_LEVELS = [5, 10, 15, 19, 20];

const BOSS_DATA = {
  5:  { name: 'CRABTRON',   baseHp: 95, pattern: 'crossfire', color: '#f00' },
  10: { name: 'SERPENTRIX', baseHp: 145, pattern: 'zigzag',    color: '#0f0' },
  15: { name: 'ORBITAL',    baseHp: 210, pattern: 'rotate',    color: '#0ff' },
  19: { name: 'TENIENTE',   baseHp: 285, pattern: 'divebomb',  color: '#ff0' },
  20: { name: 'EMPERADOR',  baseHp: 450, pattern: 'supreme',   color: '#fff' }
};



