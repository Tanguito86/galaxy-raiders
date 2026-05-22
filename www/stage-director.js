// ====================================
// GALAXY RAIDERS - stage-director.js
// HC-ST-03: Stage Director Runtime Foundation
// Organiza, coordina y monitorea el flow macro.
// NO controla gameplay. Solo observa + orquesta.
// ====================================

// ============================================================
// STAGE STATE MODEL
// ============================================================

var _stageDirector = {
  active: false,
  currentSection: 'inactive',
  previousSection: '',
  sectionStartedAt: 0,
  sectionDurationMs: 0,
  sectionsCompleted: 0,
  currentLevel: 0,

  // Tension tracking
  tension: 0,
  peakTension: 0,
  tensionRolling: [],

  // Recovery tracking
  consecutivePressure: 0,
  lastRecoveryAt: 0,
  recoveryAvailable: true,

  // Boss tracking
  bossActive: false,
  climaxActive: false,
  preludeActive: false,

  // Metadata for current section
  sectionMeta: null
};

// ============================================================
// CONFIG READER
// ============================================================

function _stageDirectorReadConfig() {
  var cfg = getGalaxyConfig ? getGalaxyConfig() : {};
  var sd = (cfg.stageDirector && typeof cfg.stageDirector === 'object') ? cfg.stageDirector : {};
  return {
    enabled: sd.enabled !== false,
    maxConsecutivePressure: sd.maxConsecutivePressure || 3,
    recoveryMinMs: sd.recoveryMinMs || 10000,
    recoveryMaxIntensity: sd.recoveryMaxIntensity || 0.30,
    bossPreludeMinMs: sd.bossPreludeMinMs || 8000,
    ambushMinSectionGap: sd.ambushMinSectionGap || 2,
    setpieceMinLevelGap: sd.setpieceMinLevelGap || 3,
    survivalMinLevel: sd.survivalCorridorMinLevel || 14,
    miniSetpieceCooldown: sd.miniSetpieceCooldownSections || 3,
    climaxIntensityMult: sd.climaxIntensityMultiplier || 1.15,
    telemetry: sd.telemetry || false
  };
}

// ============================================================
// SECTION LIFECYCLE
// ============================================================

// Called when starting a new stage section
window.startStageSection = function(sectionType, meta) {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return;

  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  _stageDirector.previousSection = _stageDirector.currentSection;
  _stageDirector.currentSection = sectionType;
  _stageDirector.sectionStartedAt = now;
  _stageDirector.sectionDurationMs = 0;
  _stageDirector.sectionsCompleted++;
  _stageDirector.sectionMeta = meta || null;

  // Detect section types
  var isHighIntensity = sectionType === 'crossfire' || sectionType === 'ambush' ||
    sectionType === 'survival_corridor' || sectionType === 'climax';
  var isRecovery = sectionType === 'relief' || sectionType === 'warmup';

  if (isHighIntensity) {
    _stageDirector.consecutivePressure++;
  } else if (isRecovery) {
    _stageDirector.consecutivePressure = 0;
    _stageDirector.lastRecoveryAt = now;
    _stageDirector.recoveryAvailable = true;
  } else if (sectionType === 'boss_prelude') {
    _stageDirector.preludeActive = true;
  }

  if (sectionType === 'climax') {
    _stageDirector.climaxActive = true;
    _stageDirector.tension = Math.min(1.0, _stageDirector.tension * cfg.climaxIntensityMult);
  }

  // Orchestration hook — notify other systems
  if (typeof window.notifyStageSectionStart === 'function') {
    window.notifyStageSectionStart(sectionType);
  }
};

// Called each frame to update section state
window.updateStageSection = function(dt) {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return;
  if (!_stageDirector.active) return;

  _stageDirector.sectionDurationMs += (dt || 16.667);

  // Tension rolling average (last 10 tension values)
  _stageDirector.tensionRolling.push(_stageDirector.tension);
  if (_stageDirector.tensionRolling.length > 10) _stageDirector.tensionRolling.shift();

  // Track peak
  if (_stageDirector.tension > _stageDirector.peakTension) {
    _stageDirector.peakTension = _stageDirector.tension;
  }

  // Recovery availability check
  if (_stageDirector.consecutivePressure >= cfg.maxConsecutivePressure) {
    _stageDirector.recoveryAvailable = false;
  }
};

// Called when ending current section
window.endStageSection = function() {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return;

  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  _stageDirector.sectionDurationMs = now - _stageDirector.sectionStartedAt;

  if (_stageDirector.currentSection === 'climax') {
    _stageDirector.climaxActive = false;
    _stageDirector.bossActive = false;
  }
  if (_stageDirector.currentSection === 'boss_prelude') {
    _stageDirector.preludeActive = false;
  }

  if (typeof window.notifyStageSectionEnd === 'function') {
    window.notifyStageSectionEnd(_stageDirector.currentSection);
  }
};

// Transition between sections
window.transitionStageSection = function(newType, meta) {
  window.endStageSection();
  window.startStageSection(newType, meta);
};

// ============================================================
// TENSION TRACKING
// ============================================================

window.setStageDirectorTension = function(value) {
  var clamped = (typeof value === 'number') ? Math.max(0, Math.min(1.0, value)) : 0;
  _stageDirector.tension = clamped;
};

window.getStageDirectorTension = function() {
  return _stageDirector.tension;
};

window.getStageDirectorPeakTension = function() {
  return _stageDirector.peakTension;
};

// Estimate tension from current game state (enemy density, bullet count, rank)
window.estimateStageTension = function() {
  var density = 0;
  if (typeof enemies !== 'undefined' && Array.isArray(enemies)) {
    var aliveCount = 0;
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i] && enemies[i].alive) aliveCount++;
    }
    density = Math.min(1.0, aliveCount / 20);
  }
  var bulletDensity = 0;
  if (typeof enemyBullets !== 'undefined' && Array.isArray(enemyBullets)) {
    bulletDensity = Math.min(1.0, enemyBullets.length / 30);
  }
  var rankMult = 0;
  if (typeof window.getHardcoreRankLevel === 'function') {
    rankMult = (window.getHardcoreRankLevel() - 1) / 4;
  }
  return Math.min(1.0, density * 0.4 + bulletDensity * 0.4 + rankMult * 0.2);
};

// ============================================================
// RECOVERY TRACKING
// ============================================================

window.isStageRecoveryAvailable = function() {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return true;
  return _stageDirector.consecutivePressure < cfg.maxConsecutivePressure;
};

window.getStageConsecutivePressure = function() {
  return _stageDirector.consecutivePressure;
};

window.requestStageRecovery = function() {
  if (window.isStageRecoveryAvailable()) {
    window.transitionStageSection('relief');
    return true;
  }
  return false;
};

// ============================================================
// BOSS PRELUDE / CLIMAX HOOKS
// ============================================================

window.notifyBossPreludeStart = function() {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return;
  window.transitionStageSection('boss_prelude');
  _stageDirector.preludeActive = true;
};

window.notifyClimaxStart = function(bossPattern) {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return;
  window.endStageSection();
  window.startStageSection('climax', { bossPattern: bossPattern });
  _stageDirector.climaxActive = true;
  _stageDirector.bossActive = true;
};

window.notifyBossDefeat = function() {
  _stageDirector.climaxActive = false;
  _stageDirector.bossActive = false;
  _stageDirector.tension *= 0.3; // tension drops sharply after boss
};

// ============================================================
// LIFECYCLE — called from game loop
// ============================================================

window.updateStageDirector = function(dt) {
  var cfg = _stageDirectorReadConfig();
  if (!cfg.enabled) return;
  if (typeof state === 'undefined' || state !== 'playing') return;

  // Auto-detect section from game state
  if (!_stageDirector.active) {
    _stageDirector.active = true;
    _stageDirector.sectionStartedAt = typeof globalTime === 'number' ? globalTime : Date.now();
  }

  // Update tension from live state
  window.setStageDirectorTension(window.estimateStageTension());
  window.updateStageSection(dt);
};

// Called when level changes
window.onStageDirectorLevelChange = function(newLevel) {
  _stageDirector.currentLevel = newLevel;
  _stageDirector.peakTension = 0;
  _stageDirector.consecutivePressure = 0;
  _stageDirector.bossActive = false;
  _stageDirector.climaxActive = false;
  _stageDirector.preludeActive = false;
};

// ============================================================
// TELEMETRY SNAPSHOT
// ============================================================

window.getStageDirectorTelemetry = function() {
  return {
    active: _stageDirector.active,
    currentSection: _stageDirector.currentSection,
    previousSection: _stageDirector.previousSection,
    sectionDurationMs: _stageDirector.sectionDurationMs,
    sectionsCompleted: _stageDirector.sectionsCompleted,
    tension: Number(_stageDirector.tension.toFixed(3)),
    peakTension: Number(_stageDirector.peakTension.toFixed(3)),
    consecutivePressure: _stageDirector.consecutivePressure,
    recoveryAvailable: _stageDirector.recoveryAvailable,
    bossActive: _stageDirector.bossActive,
    climaxActive: _stageDirector.climaxActive,
    preludeActive: _stageDirector.preludeActive,
    currentLevel: _stageDirector.currentLevel
  };
};

window.resetStageDirector = function() {
  _stageDirector.active = false;
  _stageDirector.currentSection = 'inactive';
  _stageDirector.previousSection = '';
  _stageDirector.sectionStartedAt = 0;
  _stageDirector.sectionDurationMs = 0;
  _stageDirector.sectionsCompleted = 0;
  _stageDirector.tension = 0;
  _stageDirector.peakTension = 0;
  _stageDirector.tensionRolling = [];
  _stageDirector.consecutivePressure = 0;
  _stageDirector.lastRecoveryAt = 0;
  _stageDirector.recoveryAvailable = true;
  _stageDirector.bossActive = false;
  _stageDirector.climaxActive = false;
  _stageDirector.preludeActive = false;
  _stageDirector.sectionMeta = null;
};

// ============================================================
// DEBUG OVERLAY
// ============================================================

window.drawStageDirectorDebugOverlay = function(ctx) {
  if (!ctx) return;
  if (typeof H === 'undefined' || typeof W === 'undefined') return;
  var cfg = _stageDirectorReadConfig();
  if (!cfg.telemetry) return;

  var sd = _stageDirector;
  var panelX = W - 188;
  var panelY = 44;
  var panelW = 182;
  var lineH = 9;
  var y = panelY + 8;

  ctx.save();
  ctx.globalAlpha = 0.60;
  ctx.fillStyle = '#080818';
  ctx.fillRect(panelX, panelY, panelW, lineH * 10 + 12);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = '#bb88ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(panelX, panelY, panelW, lineH * 10 + 12);
  ctx.globalAlpha = 1;
  ctx.font = '5px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#bb88ff';
  ctx.fillText('HC-ST', panelX + 6, y); y += lineH + 2;
  ctx.fillStyle = '#ccc';
  ctx.fillText('SECTION: ' + sd.currentSection, panelX + 6, y); y += lineH;
  ctx.fillText('TENSION: ' + sd.tension.toFixed(2) + '  PEAK:' + sd.peakTension.toFixed(2), panelX + 6, y); y += lineH;
  ctx.fillText('PRESS_CHAIN: ' + sd.consecutivePressure + '/' + cfg.maxConsecutivePressure, panelX + 6, y); y += lineH;
  ctx.fillStyle = sd.recoveryAvailable ? '#5f5' : '#f55';
  ctx.fillText('RECOVERY: ' + (sd.recoveryAvailable ? 'READY' : 'BLOCKED'), panelX + 6, y); y += lineH;
  ctx.fillStyle = '#ccc';
  ctx.fillText('CLIMAX: ' + (sd.climaxActive ? 'YES' : 'no'), panelX + 6, y);
  ctx.fillStyle = sd.preludeActive ? '#fa0' : '#ccc';
  ctx.fillText(' PRELUDE:' + (sd.preludeActive ? 'active' : ''), panelX + 68, y); y += lineH;
  ctx.fillText('LEVEL: ' + sd.currentLevel + '  SECTIONS:' + sd.sectionsCompleted, panelX + 6, y); y += lineH;
  ctx.fillText('DURATION: ' + (sd.sectionDurationMs / 1000).toFixed(1) + 's', panelX + 6, y);
  y += lineH;
  // HC-ST-04: plan metadata
  if (_stageDirectorPlan.currentPlan) {
    ctx.fillStyle = '#bb88ff';
    ctx.fillText('PLAN: ' + (_stageDirectorPlan.currentPlan.identity || '?') + ' (' + (_stageDirectorPlan.sectionIndex + 1) + '/' + _stageDirectorPlan.sectionsInPlan + ')', panelX + 6, y); y += lineH;
    ctx.fillStyle = '#aad';
    ctx.fillText('CURVE: ' + (_stageDirectorPlan.currentPlan.tensionCurve || '?'), panelX + 6, y); y += lineH;
    var nextSection = getStagePlanCurrentSection(_stageDirectorPlan.currentPlan, _stageDirectorPlan.sectionIndex + 1);
    if (nextSection) {
      ctx.fillStyle = '#ccc';
      ctx.fillText('NEXT: ' + nextSection.type + ' (' + (nextSection.durationMs / 1000).toFixed(0) + 's)', panelX + 6, y);
    }
  }

  // HC-ST-05: influence + calibration
  y += 6;
  var inf = window.getStageInfluenceState();
  var cal = window.getStageCalibrationTelemetry();
  if (inf) {
    ctx.fillStyle = '#99f';
    ctx.fillText('INFLUENCE', panelX + 6, y); y += lineH;
    ctx.fillStyle = '#aac';
    ctx.fillText('I:' + inf.intensity + ' A:' + inf.aggression + ' D:' + inf.density, panelX + 6, y); y += lineH;
    ctx.fillText('S:' + inf.spacing + ' R:' + inf.recovery + ' SP:' + inf.setpiece, panelX + 6, y); y += lineH;
    ctx.fillText('READ:' + inf.readabilityPressure + ' MODE:' + inf.pacingMode, panelX + 6, y); y += lineH;
    ctx.fillStyle = cal.desyncWarnings > 0 ? '#f66' : '#6f6';
    ctx.fillText('MISMATCH:' + (cal.avgMismatch || 0).toFixed(2) + ' DESYNC:' + cal.desyncWarnings, panelX + 6, y); y += lineH;
    var integrity = (typeof window.validateStageRecoveryIntegrity === 'function') ? window.validateStageRecoveryIntegrity() : { valid: true };
    ctx.fillStyle = integrity.valid ? '#6f6' : '#f66';
    ctx.fillText('INTEGRITY:' + (integrity.valid ? 'OK' : integrity.issues.join(',')), panelX + 6, y);
  }

  ctx.restore();
};

// ============================================================
// HC-ST-04: SECTION FRAMEWORK & STAGE PLAN INTEGRATION
// ============================================================

var _stageDirectorPlan = {
  currentPlan: null,
  sectionIndex: 0,
  sectionsInPlan: 0,
  planCompleted: false,
  sectionCounters: {}
};

// Load stage plan for current level
window.loadStagePlan = function(levelNum) {
  if (typeof getStagePlan !== 'function') return;
  var plan = getStagePlan(levelNum);
  if (!plan) return;

  _stageDirectorPlan.currentPlan = plan;
  _stageDirectorPlan.sectionIndex = 0;
  _stageDirectorPlan.sectionsInPlan = getStagePlanSectionCount(plan);
  _stageDirectorPlan.planCompleted = false;
  window.onStageDirectorLevelChange(levelNum);

  // Start first section
  var firstSection = getStagePlanCurrentSection(plan, 0);
  if (firstSection) {
    window.startStageSection(firstSection.type, {
      plan: plan,
      intensity: firstSection.intensity,
      durationMs: firstSection.durationMs
    });
  }
};

// Advance to next section in plan
window.advanceStageSection = function() {
  var plan = _stageDirectorPlan.currentPlan;
  if (!plan) return;

  var nextIdx = _stageDirectorPlan.sectionIndex + 1;
  var nextSection = getStagePlanCurrentSection(plan, nextIdx);
  if (!nextSection) {
    _stageDirectorPlan.planCompleted = true;
    window.endStageSection();
    return;
  }

  _stageDirectorPlan.sectionIndex = nextIdx;
  // Track section type counter
  var st = nextSection.type;
  _stageDirectorPlan.sectionCounters[st] = (_stageDirectorPlan.sectionCounters[st] || 0) + 1;

  window.transitionStageSection(st, {
    plan: plan,
    intensity: nextSection.intensity,
    durationMs: nextSection.durationMs,
    sectionIndex: nextIdx
  });
};

// Check if current section should end based on plan duration
window.checkStageSectionTimer = function() {
  var plan = _stageDirectorPlan.currentPlan;
  if (!plan) return;
  var currentSection = getStagePlanCurrentSection(plan, _stageDirectorPlan.sectionIndex);
  if (!currentSection) return;

  // Climax sections don't auto-advance (boss HP controls that)
  if (currentSection.type === 'climax') return;

  if (_stageDirector.sectionDurationMs >= currentSection.durationMs) {
    window.advanceStageSection();
  }
};

// Get current section metadata
window.getCurrentStageSection = function() {
  var plan = _stageDirectorPlan.currentPlan;
  if (!plan) return null;
  return getStagePlanCurrentSection(plan, _stageDirectorPlan.sectionIndex);
};

// Get plan metadata
window.getStagePlanMetadata = function() {
  var plan = _stageDirectorPlan.currentPlan;
  if (!plan) return null;
  return {
    identity: plan.identity || 'unknown',
    tensionCurve: plan.tensionCurve || 'sawtooth',
    isBoss: plan.isBoss || false,
    bossPattern: plan.bossPattern || '',
    sectionIndex: _stageDirectorPlan.sectionIndex,
    sectionsInPlan: _stageDirectorPlan.sectionsInPlan,
    planCompleted: _stageDirectorPlan.planCompleted,
    sectionCounters: _stageDirectorPlan.sectionCounters
  };
};

// Called each frame from updateStageDirector
var _stageDirUpdateOrig = window.updateStageDirector;
window.updateStageDirector = function(dt) {
  if (_stageDirUpdateOrig) _stageDirUpdateOrig(dt);
  window.checkStageSectionTimer();
};

// Override onStageDirectorLevelChange to load plan
var _stageDirLvlChangeOrig = window.onStageDirectorLevelChange;
window.onStageDirectorLevelChange = function(newLevel) {
  if (_stageDirLvlChangeOrig) _stageDirLvlChangeOrig(newLevel);
  window.loadStagePlan(newLevel);
};

// ============================================================
// HC-ST-05: WAVE COMPOSER INTEGRATION & INFLUENCE LAYER
// Stage Director expone influence state para HC-WC.
// NO spawnea enemigos. NO controla patterns.
// Solo produce metadata que WC puede leer opcionalmente.
// ============================================================

// ============================================================
// TIME AUTHORITY — single source of truth
// ============================================================
// Timer authority chain for stage pacing:
//   1. globalTime (scores.js) — absolute frame clock, runs always
//   2. _stageDirector.sectionStartedAt — derived from globalTime
//   3. _stageDirector.sectionDurationMs — computed diff, read-only
//   4. Stage plan section.durationMs — authored target, NOT authoritative
//   5. WC wave phase timers — independent, owned by HC-WC
//   6. Boss director phaseTimer — independent, owned by HC-BD
//
// No parallel timers. All derived from globalTime.
// Desync prevention: check section timer vs wc phase timer for drift.

var _stageDirectorCalibration = {
  actualVsTargetTension: [],
  recoveryAboveThreshold: 0,
  overloadFrames: 0,
  desyncWarnings: 0,
  lastCalibrationCheck: 0
};

// ============================================================
// INFLUENCE STATE — metadata for Wave Composer
// ============================================================

window.getStageInfluenceState = function() {
  var plan = _stageDirectorPlan.currentPlan;
  var currentSection = window.getCurrentStageSection();
  var identity = plan ? null : null; // resolved below
  
  if (plan) {
    identity = (typeof getStageIdentity === 'function') 
      ? getStageIdentity(_stageDirector.currentLevel) 
      : { aggression: 0.5, spacing: 'medium', recovery: 'normal' };
  }

  var sectionType = _stageDirector.currentSection;
  var cfg = _stageDirectorReadConfig();

  // Derive influence biases from current section type
  var intensityBias = 0;
  var aggressionBias = 0;
  var densityBias = 0;
  var spacingBias = 0;
  var recoveryBias = 0;
  var setpieceBias = 0;
  var readabilityPressure = 0;

  switch (sectionType) {
    case 'warmup':
      intensityBias = 0.2; aggressionBias = 0.1; densityBias = 0.15;
      spacingBias = 0.8; recoveryBias = 0.9; setpieceBias = 0;
      readabilityPressure = 0.1;
      break;
    case 'formation_showcase':
      intensityBias = 0.35; aggressionBias = 0.25; densityBias = 0.35;
      spacingBias = 0.6; recoveryBias = 0.7; setpieceBias = 0.1;
      readabilityPressure = 0.2;
      break;
    case 'pressure_ramp':
      intensityBias = 0.6; aggressionBias = 0.55; densityBias = 0.6;
      spacingBias = 0.4; recoveryBias = 0.3; setpieceBias = 0.2;
      readabilityPressure = 0.5;
      break;
    case 'crossfire':
      intensityBias = 0.75; aggressionBias = 0.7; densityBias = 0.7;
      spacingBias = 0.3; recoveryBias = 0.2; setpieceBias = 0.3;
      readabilityPressure = 0.65;
      break;
    case 'ambush':
      intensityBias = 0.8; aggressionBias = 0.85; densityBias = 0.75;
      spacingBias = 0.2; recoveryBias = 0.1; setpieceBias = 0.4;
      readabilityPressure = 0.7;
      break;
    case 'relief':
      intensityBias = 0.15; aggressionBias = 0.05; densityBias = 0.1;
      spacingBias = 0.9; recoveryBias = 1.0; setpieceBias = 0;
      readabilityPressure = 0.05;
      break;
    case 'survival_corridor':
      intensityBias = 0.9; aggressionBias = 0.85; densityBias = 0.9;
      spacingBias = 0.15; recoveryBias = 0.05; setpieceBias = 0.5;
      readabilityPressure = 0.85;
      break;
    case 'mini_setpiece':
      intensityBias = 0.75; aggressionBias = 0.6; densityBias = 0.8;
      spacingBias = 0.25; recoveryBias = 0.15; setpieceBias = 1.0;
      readabilityPressure = 0.6;
      break;
    case 'boss_prelude':
      intensityBias = 0.15; aggressionBias = 0.05; densityBias = 0.08;
      spacingBias = 0.95; recoveryBias = 0.95; setpieceBias = 0;
      readabilityPressure = 0.02;
      break;
    case 'climax':
      intensityBias = 1.0; aggressionBias = 1.0; densityBias = 1.0;
      spacingBias = 0.1; recoveryBias = 0; setpieceBias = 0.8;
      readabilityPressure = 1.0;
      break;
    default:
      intensityBias = 0.5;
      break;
  }

  // Apply stage identity modifiers if available
  if (identity && typeof identity.aggression === 'number') {
    aggressionBias = Math.min(1.0, aggressionBias * (0.7 + identity.aggression * 0.3));
  }

  // Apply tension curve modifier
  if (plan && plan.tensionCurve === 'overload') {
    intensityBias = Math.min(1.0, intensityBias * 1.15);
    recoveryBias *= 0.5;
  } else if (plan && plan.tensionCurve === 'collapse') {
    intensityBias *= 0.8;
    recoveryBias = Math.min(1.0, recoveryBias * 1.3);
  }

  return {
    // Core influence values (0.0-1.0)
    intensity: Number(intensityBias.toFixed(3)),
    aggression: Number(aggressionBias.toFixed(3)),
    density: Number(densityBias.toFixed(3)),
    spacing: Number(spacingBias.toFixed(3)),
    recovery: Number(recoveryBias.toFixed(3)),
    setpiece: Number(setpieceBias.toFixed(3)),
    readabilityPressure: Number(readabilityPressure.toFixed(3)),

    // Metadata
    sectionType: sectionType,
    tensionCurve: plan ? plan.tensionCurve : 'unknown',
    isBossSection: sectionType === 'climax' || sectionType === 'boss_prelude',
    isHighPressure: sectionType === 'survival_corridor' || sectionType === 'ambush' || sectionType === 'crossfire',
    isRecovery: sectionType === 'relief' || sectionType === 'warmup',

    // Pacing mode derived from curve
    pacingMode: plan ? plan.tensionCurve : 'sawtooth',

    // WC integration flags — what WC is allowed to do
    wcFlags: {
      allowCrossfire: sectionType !== 'boss_prelude' && sectionType !== 'relief' && sectionType !== 'warmup',
      allowDivers: sectionType !== 'relief' && sectionType !== 'warmup' && sectionType !== 'boss_prelude',
      allowSuppressors: sectionType !== 'relief',
      allowSurvivalDensity: sectionType === 'survival_corridor',
      forceRelief: sectionType === 'relief',
      preludeCleanup: sectionType === 'boss_prelude'
    },

    // Safety
    _source: 'stage-director',
    _timestamp: typeof globalTime === 'number' ? globalTime : Date.now()
  };
};

// ============================================================
// TENSION CALIBRATION — planned vs actual
// ============================================================

window.calibrateStageTension = function() {
  // Planned tension from current section
  var currentSection = window.getCurrentStageSection();
  var plannedTension = currentSection ? (currentSection.intensity || 0.5) : 0.5;

  // Actual tension from live game state
  var actualTension = window.getStageDirectorTension();

  var mismatch = Math.abs(plannedTension - actualTension);
  _stageDirectorCalibration.actualVsTargetTension.push({
    planned: plannedTension,
    actual: actualTension,
    mismatch: mismatch,
    at: typeof globalTime === 'number' ? globalTime : Date.now()
  });
  if (_stageDirectorCalibration.actualVsTargetTension.length > 20) {
    _stageDirectorCalibration.actualVsTargetTension.shift();
  }

  // Track calibration anomalies
  if (mismatch > 0.4) {
    _stageDirectorCalibration.desyncWarnings++;
  }
  if (_stageDirector.currentSection !== 'relief' && _stageDirector.tension < 0.15) {
    _stageDirectorCalibration.recoveryAboveThreshold++;
  }
  if (_stageDirector.tension > 0.85) {
    _stageDirectorCalibration.overloadFrames++;
  }

  return {
    planned: plannedTension,
    actual: actualTension,
    mismatch: Number(mismatch.toFixed(3)),
    desyncWarnings: _stageDirectorCalibration.desyncWarnings,
    overloadFrames: _stageDirectorCalibration.overloadFrames
  };
};

// Get calibration telemetry
window.getStageCalibrationTelemetry = function() {
  var recent = _stageDirectorCalibration.actualVsTargetTension;
  var avgMismatch = 0;
  if (recent.length > 0) {
    for (var i = 0; i < recent.length; i++) avgMismatch += recent[i].mismatch;
    avgMismatch /= recent.length;
  }

  return {
    avgMismatch: Number(avgMismatch.toFixed(3)),
    desyncWarnings: _stageDirectorCalibration.desyncWarnings,
    recoveryAboveThreshold: _stageDirectorCalibration.recoveryAboveThreshold,
    overloadFrames: _stageDirectorCalibration.overloadFrames,
    recentMismatches: recent.slice(-5)
  };
};

// ============================================================
// RECOVERY INTEGRITY CHECK
// ============================================================

window.validateStageRecoveryIntegrity = function() {
  var influence = window.getStageInfluenceState();
  var issues = [];

  // Relief must not be intense
  if (influence.sectionType === 'relief' && _stageDirector.tension > 0.40) {
    issues.push('relief_tension_high');
  }

  // Prelude must be clean
  if (influence.sectionType === 'boss_prelude' && _stageDirector.tension > 0.35) {
    issues.push('prelude_too_intense');
  }

  // Overload must have escape path
  if (influence.tensionCurve === 'overload' && influence.sectionType !== 'relief' && influence.sectionType !== 'boss_prelude') {
    if (_stageDirectorCalibration.overloadFrames > 1800) { // 30s
      issues.push('overload_too_long');
    }
  }

  // Recovery must exist periodically
  if (_stageDirector.consecutivePressure >= 5) {
    issues.push('pressure_chain_too_long');
  }

  return {
    valid: issues.length === 0,
    issues: issues,
    sectionType: influence.sectionType,
    tension: _stageDirector.tension,
    consecutivePressure: _stageDirector.consecutivePressure
  };
};

// ============================================================
// SAFETY FALLBACKS
// ============================================================

window.getStageDirectorSafeDefaults = function() {
  // Returns safe influence state when ST/WC desync is detected
  return {
    intensity: 0.5,
    aggression: 0.5,
    density: 0.5,
    spacing: 0.5,
    recovery: 0.5,
    setpiece: 0.2,
    readabilityPressure: 0.4,
    sectionType: 'fallback',
    tensionCurve: 'sawtooth',
    isBossSection: false,
    isHighPressure: false,
    isRecovery: false,
    pacingMode: 'sawtooth',
    wcFlags: {
      allowCrossfire: true,
      allowDivers: true,
      allowSuppressors: true,
      allowSurvivalDensity: false,
      forceRelief: false,
      preludeCleanup: false
    },
    _source: 'stage-director-fallback',
    _timestamp: typeof globalTime === 'number' ? globalTime : Date.now()
  };
};

// Override updateStageDirector to include calibration
var _stageDirOrigUpdate2 = window.updateStageDirector;
window.updateStageDirector = function(dt) {
  if (_stageDirOrigUpdate2) _stageDirOrigUpdate2(dt);
  // Run calibration every 500ms
  var now = typeof globalTime === 'number' ? globalTime : Date.now();
  if (now - _stageDirectorCalibration.lastCalibrationCheck > 500) {
    _stageDirectorCalibration.lastCalibrationCheck = now;
    window.calibrateStageTension();
  }
};
