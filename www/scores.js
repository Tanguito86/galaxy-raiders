// =====================
// GALAXY RAIDERS - scores.js
// =====================

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
    loadGlobalScores(); // Recargar ranking
  } catch (error) {
    console.error('Error submitting score:', error);
  }
}

// Cargar scores al iniciar
loadGlobalScores();

// --- GAME STATE ---
let screenShake = 0;
let screenShakeBg = 0;
let screenShakeGameplay = 0;
let screenShakeLight = 0;
let screenShakeMedium = 0;
let screenShakeHeavy = 0;
let flashScreen = 0;
let state = 'menu';
let previousState = 'menu';
let globalTime = 0;
let score = 0;
let lives = 3;
let level = 1;
let nextPowerUpTime = 0;
let powerUpsSpawnedThisLevel = 0;
let starShakeX = 0;
let starShakeY = 0;
let gameplayShakeX = 0;
let gameplayShakeY = 0;


const POWERUP_COOLDOWN = 2600;       // 2.6s minimo entre drops
const MAX_ACTIVE_POWERUPS = 1;       // maximo en pantalla a la vez
const MAX_POWERUPS_PER_LEVEL = 5;    // maximo por nivel

let bestScore = 0;
let highScores = [];
let highNames = [];
let highContinues = []; // CuÃ¡ntos continues usÃ³ cada uno

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
    console.error('Error loading scores:', e);
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
}

function saveHighScores() {
  try {
    localStorage.setItem('galaxyRaidersScores', JSON.stringify({
      scores: highScores,
      names: highNames,
      continues: highContinues
    }));
  } catch (e) {
    console.error('No se pudo guardar', e);
  }
}

function isHighScore(score) {
  if (score === 0) return false;
  
  // Si hay algÃºn slot vacÃ­o
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
  
  // âœ… Subir al ranking global
  submitGlobalScore(name, score);
}

// ====================================
// HC-SC-02: Score Pipeline & Telemetry
// ====================================

// ============================================================
// SCORE SOURCE TAXONOMY
// ============================================================

var HC_SCORE_SOURCES = {
  enemyKill:      { id: 'enemyKill',      label: 'KILL',       color: '#ff9966' },
  bossHit:        { id: 'bossHit',        label: 'BOSS HIT',   color: '#ff6699' },
  bossKill:       { id: 'bossKill',       label: 'BOSS',       color: '#ff3388' },
  medal:          { id: 'medal',          label: 'MEDAL',      color: '#ffd966' },
  graze:          { id: 'graze',          label: 'GRAZE',      color: '#5ff' },
  waveBonus:      { id: 'waveBonus',      label: 'WAVE',       color: '#4488ff' },
  levelClear:     { id: 'levelClear',     label: 'LEVEL',      color: '#66bbff' },
  combo:          { id: 'combo',          label: 'COMBO',      color: '#ffdd44' },
  closeRange:     { id: 'closeRange',     label: 'CLOSE',      color: '#ff8844' },
  perfectWave:    { id: 'perfectWave',    label: 'PERFECT',    color: '#ffee55' },
  ufoKill:        { id: 'ufoKill',        label: 'UFO',        color: '#88ff88' },
  mineDestroy:    { id: 'mineDestroy',    label: 'MINE',       color: '#44ff44' },
  pierceCancel:   { id: 'pierceCancel',   label: 'PIERCE',     color: '#44ddff' },
  bulletHit:      { id: 'bulletHit',      label: 'HIT',        color: '#ffffff' },
  stageMilestone: { id: 'stageMilestone', label: 'MILESTONE',  color: '#ffcc44' },
  misc:           { id: 'misc',           label: 'MISC',       color: '#cccccc' }
};

// ============================================================
// SCORE PIPELINE — awardScore wraps addScore with metadata
// ============================================================

var _hcScoreTelemetry = {
  totalBySource: {},
  totalScoreAwarded: 0,
  awardCount: 0,
  lastAwardAt: 0,
  lastAwardSource: '',
  recentAwards: []
};

function _hcScoreReadConfig() {
  var cfg = getGalaxyConfig ? getGalaxyConfig() : {};
  var sc = (cfg.scoreSystem && typeof cfg.scoreSystem === 'object') ? cfg.scoreSystem : {};
  return {
    enabled: sc.enabled !== false,
    telemetryEnabled: !!(sc.telemetry && sc.telemetry.enabled),
    trackSources: !!(sc.telemetry && sc.telemetry.trackSources),
    sourceColors: sc.sourceColors !== false,
    debugOverlay: !!(sc.debug && sc.debug.overlay)
  };
}

// Centralized score award — wraps addScore with source metadata
window.awardScore = function(opts) {
  if (typeof opts !== 'object' || opts === null) {
    // Fallback for bare number calls
    if (typeof opts === 'number') {
      if (typeof addScore === 'function') addScore(opts);
      return;
    }
    return;
  }

  var points = (typeof opts.points === 'number' && opts.points > 0) ? Math.round(opts.points) : 0;
  if (points <= 0) return;

  var source = (typeof opts.source === 'string') ? opts.source : 'misc';
  var cfg = _hcScoreReadConfig();

  // Award score via existing addScore
  if (typeof addScore === 'function') addScore(points);

  // Telemetry
  if (cfg.telemetryEnabled && cfg.trackSources) {
    _hcScoreTelemetry.totalBySource[source] = (_hcScoreTelemetry.totalBySource[source] || 0) + points;
    _hcScoreTelemetry.totalScoreAwarded += points;
    _hcScoreTelemetry.awardCount++;
    _hcScoreTelemetry.lastAwardAt = Date.now();
    _hcScoreTelemetry.lastAwardSource = source;

    // Recent awards (last 10)
    _hcScoreTelemetry.recentAwards.push({
      source: source,
      points: points,
      at: Date.now()
    });
    if (_hcScoreTelemetry.recentAwards.length > 10) {
      _hcScoreTelemetry.recentAwards.shift();
    }
  }

  // Source-colored popup if enabled
  if (cfg.sourceColors) {
    var sourceDef = HC_SCORE_SOURCES[source] || HC_SCORE_SOURCES.misc;
    var color = sourceDef.color;

    // Spawn popup at generic position — callers can override with spawnPopup
    if (typeof spawnPopup === 'function' && source !== 'medal') {
      // Only create popup for non-medal sources (medals have their own popup system)
      var px = (typeof player !== 'undefined' && player) ? player.x + (player.width || 0) / 2 : 200;
      var py = (typeof player !== 'undefined' && player) ? player.y + (player.height || 0) / 2 : 200;
      spawnPopup(px, py - 20, '+' + points, color);
    }
  }
};

// ============================================================
// SCORE TELEMETRY HELPERS
// ============================================================

window.getHCScoreTelemetry = function() {
  var t = _hcScoreTelemetry;
  var now = Date.now();
  var totalSec = Math.max(1, (now - (t.lastAwardAt || now)) / 1000);

  // Calculate source percentages
  var sourceBreakdown = {};
  var total = t.totalScoreAwarded || 1;
  var sourceKeys = Object.keys(t.totalBySource);
  for (var i = 0; i < sourceKeys.length; i++) {
    var sk = sourceKeys[i];
    var srcVal = t.totalBySource[sk] || 0;
    sourceBreakdown[sk] = {
      total: srcVal,
      percent: Math.round((srcVal / total) * 100)
    };
  }

  return {
    totalScoreAwarded: t.totalScoreAwarded,
    awardCount: t.awardCount,
    sourceBreakdown: sourceBreakdown,
    lastAwardSource: t.lastAwardSource,
    recentAwards: t.recentAwards.slice(-5)
  };
};

window.resetHCScoreTelemetry = function() {
  _hcScoreTelemetry.totalBySource = {};
  _hcScoreTelemetry.totalScoreAwarded = 0;
  _hcScoreTelemetry.awardCount = 0;
  _hcScoreTelemetry.lastAwardAt = 0;
  _hcScoreTelemetry.lastAwardSource = '';
  _hcScoreTelemetry.recentAwards = [];
};

// ============================================================
// SCORE DEBUG OVERLAY (HC-SC)
// ============================================================

window.drawHCScoreDebugOverlay = function(ctx) {
  if (!ctx) return;
  if (typeof H === 'undefined' || typeof W === 'undefined') return;

  var cfg = _hcScoreReadConfig();
  if (!cfg.debugOverlay) return;

  var telem = window.getHCScoreTelemetry();
  var srcKeys = Object.keys(telem.sourceBreakdown).sort(function(a, b) {
    return telem.sourceBreakdown[b].total - telem.sourceBreakdown[a].total;
  });

  var panelX = W - 178;
  var panelY = 44;
  var panelW = 172;
  var lineH = 8;
  var y = panelY + 8;

  ctx.save();
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = '#080812';
  ctx.fillRect(panelX, panelY, panelW, lineH * (srcKeys.length + 3) + 12);
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = '#ffd966';
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelW, lineH * (srcKeys.length + 3) + 12);
  ctx.globalAlpha = 1;

  ctx.font = '5px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffd966';
  ctx.fillText('SC SCORE  ' + telem.totalScoreAwarded, panelX + 6, y); y += lineH + 4;
  ctx.fillStyle = '#888';
  ctx.fillText('Awards: ' + telem.awardCount, panelX + 6, y); y += lineH + 4;

  // Source breakdown
  ctx.fillStyle = '#aaa';
  ctx.fillText('SOURCES:', panelX + 6, y); y += lineH + 2;

  for (var i = 0; i < Math.min(srcKeys.length, 12); i++) {
    var sk = srcKeys[i];
    var sd = telem.sourceBreakdown[sk];
    var sourceDef = HC_SCORE_SOURCES[sk] || HC_SCORE_SOURCES.misc;
    ctx.fillStyle = sourceDef.color;
    ctx.fillText(sourceDef.label, panelX + 6, y);
    ctx.fillStyle = '#ccc';
    ctx.fillText(sd.percent + '%  ' + sd.total, panelX + 40, y);
    y += lineH;
  }

  ctx.restore();
};
