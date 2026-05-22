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

  // Apply mastery multiplier
  var multipliedPoints = _hcScoreApplyMultiplier(source, points);
  // Award score via existing addScore
  if (typeof addScore === 'function') addScore(multipliedPoints);

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

// ============================================================
// HC-SC-04: MASTERY MULTIPLIER
// Multiplier que recompensa agresion, consistencia y riesgo.
// Decay suave, penalties parciales, cap controlado.
// ============================================================

var _hcScoreMultiplier = {
  current: 1.0,
  target: 1.0,
  max: 3.0,
  lastGainFrame: 0,
  totalGains: 0,
  totalDecays: 0,
  totalPenalties: 0,
  uptimeFrames: 0,
  totalFrames: 0,
  peakReached: 1.0
};

function _hcScoreMultReadConfig() {
  var cfg = getGalaxyConfig ? getGalaxyConfig() : {};
  var sc = (cfg.scoreSystem && typeof cfg.scoreSystem === 'object') ? cfg.scoreSystem : {};
  var m = (sc.multiplier && typeof sc.multiplier === 'object') ? sc.multiplier : {};
  return {
    enabled: m.enabled !== false,
    base: (typeof m.base === 'number' && m.base >= 1.0) ? m.base : 1.0,
    max: (typeof m.max === 'number' && m.max >= 1.5) ? m.max : 3.0,
    gain: {
      enemyKill: (m.gain && typeof m.gain.enemyKill === 'number') ? m.gain.enemyKill : 0.015,
      closeRange: (m.gain && typeof m.gain.closeRange === 'number') ? m.gain.closeRange : 0.020,
      graze: (m.gain && typeof m.gain.graze === 'number') ? m.gain.graze : 0.010,
      bossHit: (m.gain && typeof m.gain.bossHit === 'number') ? m.gain.bossHit : 0.008
    },
    decay: {
      idleDelayFrames: (m.decay && typeof m.decay.idleDelayFrames === 'number') ? m.decay.idleDelayFrames : 180,
      ratePerFrame: (m.decay && typeof m.decay.ratePerFrame === 'number') ? m.decay.ratePerFrame : 0.0008
    },
    penalties: {
      deathLossPercent: (m.penalties && typeof m.penalties.deathLossPercent === 'number') ? m.penalties.deathLossPercent : 0.30,
      hitLossPercent: (m.penalties && typeof m.penalties.hitLossPercent === 'number') ? m.penalties.hitLossPercent : 0.10
    }
  };
}

// ============================================================
// MULTIPLIER GAIN — called when player earns multiplier events
// ============================================================

window.addScoreMultiplierGain = function(source) {
  var cfg = _hcScoreMultReadConfig();
  if (!cfg.enabled) return;

  var gain = 0;
  switch (source) {
    case 'enemyKill':  gain = cfg.gain.enemyKill; break;
    case 'closeRange': gain = cfg.gain.closeRange; break;
    case 'graze':      gain = cfg.gain.graze; break;
    case 'bossHit':    gain = cfg.gain.bossHit; break;
    default: return;
  }

  if (gain <= 0) return;

  _hcScoreMultiplier.target = Math.min(cfg.max, _hcScoreMultiplier.target + gain);
  _hcScoreMultiplier.lastGainFrame = _hcScoreMultiplier.totalFrames;
  _hcScoreMultiplier.totalGains++;

  // Lerp toward target (smooth rise)
  _hcScoreMultiplier.current += (_hcScoreMultiplier.target - _hcScoreMultiplier.current) * 0.25;
};

// ============================================================
// MULTIPLIER DECAY — called each frame
// ============================================================

window.updateScoreMultiplierDecay = function() {
  var cfg = _hcScoreMultReadConfig();
  if (!cfg.enabled) return;

  _hcScoreMultiplier.totalFrames++;

  var framesSinceGain = _hcScoreMultiplier.totalFrames - _hcScoreMultiplier.lastGainFrame;
  if (framesSinceGain <= 0) framesSinceGain = 0;

  // Track uptime (multiplier above base)
  if (_hcScoreMultiplier.current > cfg.base) {
    _hcScoreMultiplier.uptimeFrames++;
  }

  // Decay after idle delay
  if (framesSinceGain > cfg.decay.idleDelayFrames) {
    _hcScoreMultiplier.target = Math.max(cfg.base, _hcScoreMultiplier.target - cfg.decay.ratePerFrame);
    _hcScoreMultiplier.totalDecays++;
  }

  // Lerp toward target
  _hcScoreMultiplier.current += (_hcScoreMultiplier.target - _hcScoreMultiplier.current) * 0.10;

  // Clamp and track peak
  _hcScoreMultiplier.current = Math.max(cfg.base, Math.min(cfg.max, _hcScoreMultiplier.current));
  _hcScoreMultiplier.target = Math.max(cfg.base, Math.min(cfg.max, _hcScoreMultiplier.target));

  if (_hcScoreMultiplier.current > _hcScoreMultiplier.peakReached) {
    _hcScoreMultiplier.peakReached = _hcScoreMultiplier.current;
  }
};

// ============================================================
// MULTIPLIER PENALTIES — called on player hit/death
// ============================================================

window.applyScoreMultiplierPenalty = function(type) {
  var cfg = _hcScoreMultReadConfig();
  if (!cfg.enabled) return;
  if (_hcScoreMultiplier.current <= cfg.base) return;

  var lossPercent = 0;
  if (type === 'death') lossPercent = cfg.penalties.deathLossPercent;
  else if (type === 'hit') lossPercent = cfg.penalties.hitLossPercent;
  else return;

  var loss = _hcScoreMultiplier.current * lossPercent;
  _hcScoreMultiplier.target = Math.max(cfg.base, _hcScoreMultiplier.target - loss);
  _hcScoreMultiplier.totalPenalties++;

  // Instant drop on penalty (no lerp — penalties are felt)
  _hcScoreMultiplier.current = Math.max(cfg.base, _hcScoreMultiplier.current - loss);
};

// ============================================================
// MULTIPLIER GETTER
// ============================================================

window.getCurrentScoreMultiplier = function() {
  var cfg = _hcScoreMultReadConfig();
  if (!cfg.enabled) return 1.0;
  return _hcScoreMultiplier.current;
};

// ============================================================
// MULTIPLIER TELEMETRY
// ============================================================

window.getScoreMultiplierTelemetry = function() {
  var m = _hcScoreMultiplier;
  var cfg = _hcScoreMultReadConfig();
  return {
    current: m.current,
    target: m.target,
    peak: m.peakReached,
    max: cfg.max,
    uptimePercent: m.totalFrames > 0 ? Math.round((m.uptimeFrames / m.totalFrames) * 100) : 0,
    totalGains: m.totalGains,
    totalDecays: m.totalDecays,
    totalPenalties: m.totalPenalties
  };
};

window.resetScoreMultiplier = function() {
  _hcScoreMultiplier.current = 1.0;
  _hcScoreMultiplier.target = 1.0;
  _hcScoreMultiplier.lastGainFrame = 0;
  _hcScoreMultiplier.totalGains = 0;
  _hcScoreMultiplier.totalDecays = 0;
  _hcScoreMultiplier.totalPenalties = 0;
  _hcScoreMultiplier.uptimeFrames = 0;
  _hcScoreMultiplier.totalFrames = 0;
  _hcScoreMultiplier.peakReached = 1.0;
};

// ============================================================
// MULTIPLIER HUD
// ============================================================

window.drawScoreMultiplierHUD = function(ctx) {
  if (!ctx) return;
  var cfg = _hcScoreMultReadConfig();
  if (!cfg.enabled) return;
  if (typeof H === 'undefined') return;
  if (typeof state === 'undefined' || state !== 'playing') return;

  var mult = _hcScoreMultiplier.current;
  if (mult <= 1.01) return; // Don't show if basically 1.0

  var displayText = 'x' + mult.toFixed(2);
  var x = 6;
  var y = H - 14;

  // Subtle pulse when recently gained
  var framesSinceGain = _hcScoreMultiplier.totalFrames - _hcScoreMultiplier.lastGainFrame;
  var pulse = framesSinceGain < 30 ? (1.0 + 0.15 * (1.0 - framesSinceGain / 30)) : 1.0;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '6px "Press Start 2P"';

  // Color shifts with multiplier level
  var alpha = 0.55 + mult * 0.15;
  var color;
  if (mult >= 2.5) color = '#ffdd44';       // Gold at peak
  else if (mult >= 2.0) color = '#ff8833';  // Orange at high
  else if (mult >= 1.5) color = '#ffcc66';  // Amber at mid
  else color = '#cccccc';                    // Grey at low

  ctx.globalAlpha = alpha * pulse;
  ctx.fillStyle = color;
  ctx.fillText(displayText, x, y);
  ctx.globalAlpha = 1;

  ctx.restore();
};

// ============================================================
// INTEGRATE MULTIPLIER INTO awardScore
// (Modifies the awardScore function to apply multiplier)
// ============================================================

// Hook multiplier gain into awardScore calls by source
// Called internally by awardScore after telemetry
function _hcScoreApplyMultiplier(source, points) {
  var cfg = _hcScoreMultReadConfig();
  if (!cfg.enabled) return points;

  // Gain multiplier from qualifying sources
  if (source === 'enemyKill' || source === 'closeRange' ||
      source === 'graze' || source === 'bossHit') {
    window.addScoreMultiplierGain(source);
  }

  // Apply multiplier to score value
  return Math.round(points * _hcScoreMultiplier.current);
}

// ============================================================
// HC-SC-06: DANGER WINDOW TRACKING
// Rewards kills after being near danger (bullets/enemies).
// ============================================================

var _hcScoreDangerWindow = {
  lastNearBulletFrame: -999,    // last frame player was near a bullet
  lastNearEnemyFrame: -999,     // last frame player was near an enemy
  dangerKills: 0,
  totalFrames: 0
};

// Called from enemy bullet loop — player was near a bullet
window.recordScoreDangerFrame = function() {
  _hcScoreDangerWindow.lastNearBulletFrame = _hcScoreDangerWindow.totalFrames;
};

// Called from enemy kill scoring — check if danger window active
window.isScoreDangerWindowActive = function() {
  if (_hcScoreDangerWindow.totalFrames <= 0) return false;

  var cfg = (function() {
    var c = getGalaxyConfig ? getGalaxyConfig() : {};
    var sc = c.scoreSystem || {};
    var ag = sc.aggression || {};
    var dw = ag.dangerWindow || {};
    return {
      enabled: dw.enabled !== false,
      frames: dw.frames || 90
    };
  })();

  if (!cfg.enabled) return false;

  var framesSinceBullet = _hcScoreDangerWindow.totalFrames - _hcScoreDangerWindow.lastNearBulletFrame;
  return framesSinceBullet >= 0 && framesSinceBullet <= cfg.frames;
};

// Called on aggressive kill during danger window
window.recordScoreDangerKill = function() {
  _hcScoreDangerWindow.dangerKills++;
};

// Called each frame to advance frame counter
window.updateScoreDangerWindow = function() {
  _hcScoreDangerWindow.totalFrames++;
};

window.getScoreDangerWindowTelemetry = function() {
  return {
    dangerKills: _hcScoreDangerWindow.dangerKills,
    windowActive: window.isScoreDangerWindowActive()
  };
};

window.resetScoreDangerWindow = function() {
  _hcScoreDangerWindow.lastNearBulletFrame = -999;
  _hcScoreDangerWindow.lastNearEnemyFrame = -999;
  _hcScoreDangerWindow.dangerKills = 0;
  _hcScoreDangerWindow.totalFrames = 0;
};

// ============================================================
// HC-SC-08: BOSS EFFICIENCY & NO-HIT REWARDS
// Recompensa phase pressure, clean execution y anti-milking.
// ============================================================

var _hcBossEfficiency = {
  bossActive: false,
  bossPattern: '',
  phaseStartedAt: 0,
  phaseTimes: [],
  bossStartedAt: 0,
  noHitPhases: 0,
  hitTakenThisBoss: false,
  efficiencyLabels: [],
  totalPhases: 0,
  phasesNoHit: 0,
  fullBossNoHit: false,
  antiMilkTriggered: false
};

function _hcBossEffReadConfig() {
  var cfg = getGalaxyConfig ? getGalaxyConfig() : {};
  var sc = cfg.scoreSystem || {};
  var ag = sc.aggression || {};
  var bs = ag.bossScoring || {};
  var ef = bs.efficiency || {};
  var nh = bs.noHit || {};
  var am = bs.antiMilk || {};
  var mp = bs.multiplier || {};
  return {
    targetPhaseMs: ef.targetPhaseMs || 15000,
    eliteBonus: ef.eliteBonus || 2.0,
    eliteThreshold: ef.eliteThreshold || 0.75,
    goodBonus: ef.goodBonus || 1.4,
    goodThreshold: ef.goodThreshold || 1.0,
    phaseBonus: nh.phaseBonus || 2500,
    fullBossBonus: nh.fullBossBonus || 10000,
    softCapMs: am.softCapMs || 30000,
    scoreDecayAfter: am.scoreDecayAfter || 0.50,
    phaseClearGain: mp.phaseClearGain || 0.050
  };
}

// Called when boss spawns / level starts with boss
window.onBossEfficiencyStart = function(pattern) {
  _hcBossEfficiency.bossActive = true;
  _hcBossEfficiency.bossPattern = pattern || '';
  _hcBossEfficiency.bossStartedAt = typeof globalTime === 'number' ? globalTime : Date.now();
  _hcBossEfficiency.phaseStartedAt = _hcBossEfficiency.bossStartedAt;
  _hcBossEfficiency.phaseTimes = [];
  _hcBossEfficiency.hitTakenThisBoss = false;
  _hcBossEfficiency.noHitPhases = 0;
  _hcBossEfficiency.totalPhases = 0;
  _hcBossEfficiency.fullBossNoHit = false;
  _hcBossEfficiency.antiMilkTriggered = false;
};

// Called when player takes damage during boss fight
window.onBossEfficiencyHit = function() {
  if (!_hcBossEfficiency.bossActive) return;
  _hcBossEfficiency.hitTakenThisBoss = true;
};

// Called on boss phase change
window.onBossEfficiencyPhaseClear = function() {
  if (!_hcBossEfficiency.bossActive) return;
  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  var phaseMs = now - _hcBossEfficiency.phaseStartedAt;
  _hcBossEfficiency.phaseTimes.push(phaseMs);
  _hcBossEfficiency.totalPhases++;

  var cfg = _hcBossEffReadConfig();

  // No-hit check for this phase
  if (!_hcBossEfficiency.hitTakenThisBoss) {
    _hcBossEfficiency.noHitPhases++;
    // Award no-hit phase bonus
    if (typeof awardScore === 'function') {
      awardScore({ points: cfg.phaseBonus, source: 'bossHit' });
    }
    // Multiplier gain for clean phase
    if (typeof window.addScoreMultiplierGain === 'function') {
      window.addScoreMultiplierGain('bossHit');
    }
  }

  // Efficiency label
  var ratio = phaseMs / cfg.targetPhaseMs;
  var label;
  if (ratio <= cfg.eliteThreshold) label = 'ELITE';
  else if (ratio <= cfg.goodThreshold) label = 'GOOD';
  else label = 'SLOW';
  _hcBossEfficiency.efficiencyLabels.push(label);

  // Multiplier gain for phase clear
  if (typeof window.addScoreMultiplierGain === 'function') {
    // Append larger gain via direct multiplier bump
    _hcScoreMultiplier.target = Math.min(_hcScoreMultiplier.max || 3.0,
      _hcScoreMultiplier.target + cfg.phaseClearGain);
  }

  // Reset phase timer and hit flag for next phase
  _hcBossEfficiency.phaseStartedAt = now;
};

// Called when boss dies — calculate final efficiency bonus
window.onBossEfficiencyClear = function() {
  if (!_hcBossEfficiency.bossActive) return;
  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  var cfg = _hcBossEffReadConfig();

  // Record final phase
  var lastPhaseMs = now - _hcBossEfficiency.phaseStartedAt;
  _hcBossEfficiency.phaseTimes.push(lastPhaseMs);
  _hcBossEfficiency.totalPhases++;
  if (!_hcBossEfficiency.hitTakenThisBoss) _hcBossEfficiency.noHitPhases++;

  // Full boss time
  var totalBossMs = now - _hcBossEfficiency.bossStartedAt;

  // Anti-milk: if boss took too long, halve score
  var bossScoreMult = 1.0;
  if (totalBossMs > cfg.softCapMs) {
    bossScoreMult = cfg.scoreDecayAfter;
    _hcBossEfficiency.antiMilkTriggered = true;
  }

  // Full boss no-hit
  var noHitBoss = _hcBossEfficiency.noHitPhases >= _hcBossEfficiency.totalPhases &&
                   _hcBossEfficiency.totalPhases > 0;
  _hcBossEfficiency.fullBossNoHit = noHitBoss;
  if (noHitBoss) {
    if (typeof awardScore === 'function') {
      awardScore({ points: Math.round(cfg.fullBossBonus * bossScoreMult), source: 'bossKill' });
    }
  }

  // Efficiency bonus applied to boss kill score
  _hcBossEfficiency.bossMul = bossScoreMult;
  _hcBossEfficiency.bossActive = false;
};

// Get efficiency multiplier for boss kill score
window.getBossEfficiencyMultiplier = function() {
  return _hcBossEfficiency.bossMul || 1.0;
};

// Anti-milk check — blocks score accumulation if boss is being stalled
window.isBossBeingMilked = function() {
  if (!_hcBossEfficiency.bossActive) return false;
  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  var totalMs = now - _hcBossEfficiency.bossStartedAt;
  var cfg = _hcBossEffReadConfig();
  return totalMs > cfg.softCapMs;
};

// Telemetry
window.getBossEfficiencyTelemetry = function() {
  var cfg = _hcBossEffReadConfig();
  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  return {
    bossActive: _hcBossEfficiency.bossActive,
    bossPattern: _hcBossEfficiency.bossPattern,
    phaseTimes: _hcBossEfficiency.phaseTimes.slice(),
    efficiencyLabels: _hcBossEfficiency.efficiencyLabels.slice(),
    totalPhases: _hcBossEfficiency.totalPhases,
    noHitPhases: _hcBossEfficiency.noHitPhases,
    fullBossNoHit: _hcBossEfficiency.fullBossNoHit,
    hitTaken: _hcBossEfficiency.hitTakenThisBoss,
    antiMilkTriggered: _hcBossEfficiency.antiMilkTriggered,
    currentTime: now - _hcBossEfficiency.bossStartedAt
  };
};

window.resetBossEfficiencyTelemetry = function() {
  _hcBossEfficiency.bossActive = false;
  _hcBossEfficiency.bossPattern = '';
  _hcBossEfficiency.phaseStartedAt = 0;
  _hcBossEfficiency.phaseTimes = [];
  _hcBossEfficiency.bossStartedAt = 0;
  _hcBossEfficiency.noHitPhases = 0;
  _hcBossEfficiency.hitTakenThisBoss = false;
  _hcBossEfficiency.efficiencyLabels = [];
  _hcBossEfficiency.totalPhases = 0;
  _hcBossEfficiency.fullBossNoHit = false;
  _hcBossEfficiency.antiMilkTriggered = false;
  _hcBossEfficiency.bossMul = 1.0;
};

// ============================================================
// HC-SC-09: RECOVERY & SURVIVAL MASTERY
// Recompensa consistency, recovery, no-hit waves.
// Anti-camping previene survival farming.
// ============================================================

var _hcSurvivalState = {
  lastHitFrame: 0,
  currentHitlessSeconds: 0,
  recoveryActive: false,
  recoveryStartedAt: 0,
  recoveryCompleted: false,
  waveNoHit: true,
  stageNoHit: true,
  survivalChainLevel: 0,
  survivalChainAwarded: [false, false, false],
  idleFrames: 0,
  campingSuppressed: false,
  totalFrames: 0,
  noHitWaves: 0,
  noHitStages: 0,
  recoverySuccesses: 0,
  survivalChainTriggers: 0
};

function _hcSurvReadConfig() {
  var cfg = getGalaxyConfig ? getGalaxyConfig() : {};
  var sc = cfg.scoreSystem || {};
  var ag = sc.aggression || {};
  var ss = ag.survivalScoring || {};
  var rec = ss.recovery || {};
  var nh = ss.noHit || {};
  var sch = ss.survivalChain || {};
  var ac = ss.antiCamping || {};
  return {
    recoveryWindow: rec.windowFrames || 900,
    recoveryMultRestore: rec.multiplierRestore || 0.10,
    recoveryScore: rec.scoreBonus || 1500,
    noHitWave: nh.waveBonus || 750,
    noHitStage: nh.stageBonus || 5000,
    chainLevels: sch.levels || [30, 60, 120],
    chainGains: sch.multiplierGain || [0.03, 0.06, 0.10],
    idleFrames: ac.idleFrames || 600,
    disableWhileIdle: ac.disableWhileIdle !== false
  };
}

// Called each frame
window.updateSurvivalScoring = function() {
  _hcSurvivalState.totalFrames++;

  // Get hitless time from HC-RK performance system if available
  var hitlessMs = (typeof window.getHardcoreRankPerformanceState === 'function')
    ? window.getHardcoreRankPerformanceState().hitlessDurationMs || 0
    : 0;
  _hcSurvivalState.currentHitlessSeconds = Math.floor(hitlessMs / 1000);

  var cfg = _hcSurvReadConfig();
  var perfLabel = (typeof window.getHardcoreRankPerformanceLabel === 'function')
    ? window.getHardcoreRankPerformanceLabel()
    : 'SURVIVING';

  // Recovery detection: transition from RECOVERING to SURVIVING/DOMINATING
  if (_hcSurvivalState.recoveryActive && perfLabel !== 'RECOVERING') {
    // Recovery complete! Award bonus
    _hcSurvivalState.recoveryActive = false;
    _hcSurvivalState.recoveryCompleted = true;
    _hcSurvivalState.recoverySuccesses++;

    if (typeof awardScore === 'function') {
      awardScore({ points: cfg.recoveryScore, source: 'misc' });
    }
    // Restore some multiplier as recovery reward
    if (_hcScoreMultiplier) {
      _hcScoreMultiplier.target = Math.min(_hcScoreMultiplier.max || 3.0,
        _hcScoreMultiplier.target + cfg.recoveryMultRestore);
    }
  }

  // Anti-camping: track idle frames
  var gainFrames = 0;
  if (_hcScoreMultiplier) {
    gainFrames = _hcScoreMultiplier.totalFrames - _hcScoreMultiplier.lastGainFrame;
  }
  _hcSurvivalState.idleFrames = Math.max(0, gainFrames);
  _hcSurvivalState.campingSuppressed = cfg.disableWhileIdle && gainFrames > cfg.idleFrames;

  // Survival chain bonus
  if (!_hcSurvivalState.campingSuppressed) {
    var chainLevels = cfg.chainLevels;
    var chainGains = cfg.chainGains;
    for (var i = 0; i < chainLevels.length; i++) {
      if (!_hcSurvivalState.survivalChainAwarded[i] &&
          _hcSurvivalState.currentHitlessSeconds >= chainLevels[i]) {
        _hcSurvivalState.survivalChainAwarded[i] = true;
        _hcSurvivalState.survivalChainLevel = i + 1;
        _hcSurvivalState.survivalChainTriggers++;
        // Small multiplier gain for survival milestone
        if (_hcScoreMultiplier && chainGains[i]) {
          _hcScoreMultiplier.target = Math.min(_hcScoreMultiplier.max || 3.0,
            _hcScoreMultiplier.target + chainGains[i]);
        }
      }
    }
  }
};

// Called on player hit — mark recovery start
window.onSurvivalHit = function() {
  _hcSurvivalState.recoveryActive = true;
  _hcSurvivalState.recoveryStartedAt = _hcSurvivalState.totalFrames;
  _hcSurvivalState.recoveryCompleted = false;
  _hcSurvivalState.waveNoHit = false;
  _hcSurvivalState.stageNoHit = false;
};

// Called on wave clear — check no-hit wave
window.onSurvivalWaveClear = function() {
  if (_hcSurvivalState.waveNoHit) {
    _hcSurvivalState.noHitWaves++;
    var cfg = _hcSurvReadConfig();
    if (typeof awardScore === 'function') {
      awardScore({ points: cfg.noHitWave, source: 'perfectWave' });
    }
  }
  _hcSurvivalState.waveNoHit = true; // reset for next wave
};

// Called on stage/level milestone
window.onSurvivalStageClear = function() {
  if (_hcSurvivalState.stageNoHit) {
    _hcSurvivalState.noHitStages++;
    var cfg = _hcSurvReadConfig();
    if (typeof awardScore === 'function') {
      awardScore({ points: cfg.noHitStage, source: 'stageMilestone' });
    }
  }
  _hcSurvivalState.stageNoHit = true;
};

// Telemetry
window.getSurvivalScoringTelemetry = function() {
  return {
    currentHitlessSeconds: _hcSurvivalState.currentHitlessSeconds,
    recoveryActive: _hcSurvivalState.recoveryActive,
    recoverySuccesses: _hcSurvivalState.recoverySuccesses,
    noHitWaves: _hcSurvivalState.noHitWaves,
    noHitStages: _hcSurvivalState.noHitStages,
    survivalChainLevel: _hcSurvivalState.survivalChainLevel,
    survivalChainTriggers: _hcSurvivalState.survivalChainTriggers,
    campingSuppressed: _hcSurvivalState.campingSuppressed,
    waveNoHit: _hcSurvivalState.waveNoHit
  };
};

window.resetSurvivalScoring = function() {
  _hcSurvivalState.lastHitFrame = 0;
  _hcSurvivalState.currentHitlessSeconds = 0;
  _hcSurvivalState.recoveryActive = false;
  _hcSurvivalState.recoveryStartedAt = 0;
  _hcSurvivalState.recoveryCompleted = false;
  _hcSurvivalState.waveNoHit = true;
  _hcSurvivalState.stageNoHit = true;
  _hcSurvivalState.survivalChainLevel = 0;
  _hcSurvivalState.survivalChainAwarded = [false, false, false];
  _hcSurvivalState.idleFrames = 0;
  _hcSurvivalState.campingSuppressed = false;
  _hcSurvivalState.totalFrames = 0;
  _hcSurvivalState.noHitWaves = 0;
  _hcSurvivalState.noHitStages = 0;
  _hcSurvivalState.recoverySuccesses = 0;
  _hcSurvivalState.survivalChainTriggers = 0;
};
