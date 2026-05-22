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

  ctx.restore();
};
