// ============================================================
// GALAXY RAIDERS — hc-wave-composer.js
// HC-WC-03: Wave Micro-Structure Runtime
// ============================================================
// STATUS: RUNTIME — phase orchestration, pacing, relief insertion.
// Integrates with: Encounter Director, HC-PD, enemy patterns.
// Does NOT break: spawn engine, boss fights, set pieces, AI.
// ============================================================

(function(global) {
  'use strict';

  // ============================================================
  // CONFIG — read from GALAXY_CONFIG.HC_WAVE_COMPOSER
  // ============================================================

  var DEFAULT_PHASE_DURATIONS = {
    INTRO:   { normal: 1200, setpiece: 2000 },
    BUILD:   { normal: 4000, setpiece: 5000 },
    PEAK:    { threshold: 0.40, minDuration: 3000 },
    RESOLVE: { threshold: 0.40, maxDuration: 8000 },
    RELIEF:  { afterClear: 900, maxContinuous: 3000 }
  };

  var DEFAULT_SPAWN_SPACING = {
    entryBaseMs: 180,
    entryMaxMs: 600,
    groupGapMs: 800,
    roleActivationOffset: 1200
  };

  var DEFAULT_BUILD_TIMING = {
    sweeperDelay:   0,
    baiterDelay:    200,
    suppressorDelay: 1500,
    flankerDelay:   1800,
    sniperDelay:    2800,
    diverDelay:     4000,
    chaserDelay:    4200,
    anchorDelay:    3500
  };

  var DEFAULT_PEAK_LIMITS = {
    maxSimultaneousPatterns: 3,
    maxBullets: 30,
    interPatternGapMs: 200,
    diveWaveGapMs: 2500
  };

  var DEFAULT_RESOLVE_TIMING = {
    decayDelayMs: 500,
    diverSuspend: true,
    sniperSuspend: true,
    suppressorSuspend: true,
    chaserSuspend: true
  };

  var DEFAULT_RELIEF_TIMING = {
    bulletMax: 6,
    silenceAfterClear: 900,
    powerupEligible: true
  };

  var DEFAULT_THREAT_CAPS = {
    totalActiveRoles: 5,
    simultaneousDivers: 2,
    simultaneousSnipers: 3,
    simultaneousChasers: 1
  };

  var DEFAULT_TELEGRAPH_LEADIN = {
    introVisualMs: 600,
    phaseTransitionFlash: 200,
    ambushWarningMs: 400
  };

  var DEFAULT_CONFIG = {
    enabled: true,
    phaseDurations: DEFAULT_PHASE_DURATIONS,
    spawnSpacing: DEFAULT_SPAWN_SPACING,
    buildTiming: DEFAULT_BUILD_TIMING,
    peakLimits: DEFAULT_PEAK_LIMITS,
    resolveTiming: DEFAULT_RESOLVE_TIMING,
    reliefTiming: DEFAULT_RELIEF_TIMING,
    threatCaps: DEFAULT_THREAT_CAPS,
    telegraphLeadIn: DEFAULT_TELEGRAPH_LEADIN
  };

  function _cfg() {
    if (global.GALAXY_CONFIG && global.GALAXY_CONFIG.HC_WAVE_COMPOSER) {
      return global.GALAXY_CONFIG.HC_WAVE_COMPOSER;
    }
    return DEFAULT_CONFIG;
  }

  function _get(obj, path, def) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return def;
      cur = cur[parts[i]];
    }
    return (cur !== undefined) ? cur : def;
  }

  function _cfgVal(path, def) {
    return _get(_cfg(), path, def);
  }

  // ============================================================
  // PHASE STATE
  // ============================================================

  var PHASES = {
    IDLE:    'idle',
    INTRO:   'intro',
    BUILD:   'build',
    PEAK:    'peak',
    RESOLVE: 'resolve',
    RELIEF:  'relief'
  };

  var _composer = {
    enabled: true,
    phase: PHASES.IDLE,
    phaseTimer: 0,
    phaseTransitionCount: 0,
    intensity: 0,
    dominantRole: null,
    secondaryRole: null,
    reliefPending: false,
    _wasBoss: false,
    _phaseJustChanged: false,
    _activePatternsThisFrame: 0,
    _lastPatternFrame: 0,
    _patternsBlockedThisFrame: 0,
    _densitySpikeFrames: 0,
    _reliefEnterCount: 0,
    _buildActivationQueue: [],
    _buildActivationTimer: 0,
    _peakKillThreshold: 0,
    _resolveKillThreshold: 0,
    _enemyCountAtPeakStart: 0,
    _lastReliefCheck: 0,
    _introEnemiesGated: false,
    _telegraphFired: {},
    _roleActivationFired: {}
  };

  // ============================================================
  // HELPERS
  // ============================================================

  function _isBossActive() {
    return !!(global.boss && global.boss.active);
  }

  function _isSetPieceActive() {
    return !!(global.currentSetPiece);
  }

  function _aliveCount() {
    if (!Array.isArray(global.enemies)) return 0;
    var c = 0;
    for (var i = 0; i < global.enemies.length; i++) {
      if (global.enemies[i] && global.enemies[i].alive) c++;
    }
    return c;
  }

  function _isHardcoreEnabled() {
    if (typeof global.isHardcoreEnabled === 'function') return global.isHardcoreEnabled();
    return true;
  }

  function _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function _getDirectorState() {
    if (typeof global.getEncounterDirectorState === 'function') {
      return global.getEncounterDirectorState();
    }
    return null;
  }

  function _aliveEnemiesByRole(role) {
    if (!Array.isArray(global.enemies)) return 0;
    var c = 0;
    for (var i = 0; i < global.enemies.length; i++) {
      var e = global.enemies[i];
      if (!e || !e.alive) continue;
      var r = _getEnemyRole(e);
      if (r === role) c++;
    }
    return c;
  }

  function _getEnemyRole(enemy) {
    if (typeof global.getEnemyRole === 'function') return global.getEnemyRole(enemy);
    if (enemy.type === 'alien1') return 'sweeper';
    if (enemy.type === 'alien2') return 'sniper';
    if (enemy.type === 'alien3') return 'diver';
    if (enemy.type === 'alien4') return 'suppressor';
    if (enemy.type === 'alien5') return 'chaser';
    if (enemy.type === 'alien6') return 'flanker';
    if (enemy.type === 'alien_mini') return 'baiter';
    return 'basic';
  }

  function _inferDominantRole() {
    var roles = {};
    var all = Array.isArray(global.enemies) ? global.enemies : [];
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (!e || !e.alive) continue;
      var r = _getEnemyRole(e);
      roles[r] = (roles[r] || 0) + 1;
    }
    var dom = null, domC = 0;
    var keys = Object.keys(roles);
    for (var k = 0; k < keys.length; k++) {
      if (roles[keys[k]] > domC) {
        domC = roles[keys[k]];
        dom = keys[k];
      }
    }
    return dom;
  }

  function _computeIntensity() {
    var ds = _getDirectorState();
    var pressure = ds ? (ds.pressure || 0) : 0;
    var alive = _aliveCount();
    var bullets = Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0;

    var aliveNorm = _clamp(alive / 18, 0, 1);
    var bulletNorm = _clamp(bullets / 30, 0, 1);
    var pressureNorm = pressure;

    return _clamp(aliveNorm * 0.3 + bulletNorm * 0.35 + pressureNorm * 0.35, 0, 1);
  }

  function _getResolveThreshold() {
    return _clamp(_cfgVal('phaseDurations.RESOLVE.threshold', 0.40), 0.15, 0.60);
  }

  function _getPeakThreshold() {
    return _clamp(_cfgVal('phaseDurations.PEAK.threshold', 0.40), 0.20, 0.55);
  }

  // ============================================================
  // PHASE TRANSITION
  // ============================================================

  function _transitionTo(newPhase, reason) {
    if (_composer.phase === newPhase) return false;

    var old = _composer.phase;
    _composer.phase = newPhase;
    _composer.phaseTimer = 0;
    _composer.phaseTransitionCount++;
    _composer._phaseJustChanged = true;
    _composer._activePatternsThisFrame = 0;
    _composer._roleActivationFired = {};

    if (typeof global.logWavePhaseTransition === 'function') {
      global.logWavePhaseTransition(old, newPhase, reason);
    }

    return true;
  }

  function _shouldEnterPeak() {
    var alive = _aliveCount();
    if (alive === 0) return false;

    var threshold = _getPeakThreshold();
    // PEAK enters when BUILD timer expires AND enough enemies remain
    var minDuration = _cfgVal('phaseDurations.PEAK.minDuration', 3000);
    var buildDuration = _cfgVal('phaseDurations.BUILD.normal', 4000);

    if (_composer.phaseTimer < buildDuration) return false;
    _composer._enemyCountAtPeakStart = alive;
    return true;
  }

  function _shouldEnterResolve() {
    var alive = _aliveCount();
    if (alive === 0) return false;

    var threshold = _getResolveThreshold();
    if (_composer._enemyCountAtPeakStart <= 0) return false;

    var remaining = alive / _composer._enemyCountAtPeakStart;
    if (remaining <= threshold) return true;

    // Also enter resolve if peak has lasted too long
    var maxPeak = _cfgVal('phaseDurations.RESOLVE.maxDuration', 8000);
    if (_composer.phaseTimer > maxPeak) return true;

    return false;
  }

  function _shouldEnterRelief() {
    if (_aliveCount() > 0) return false;

    // Don't double-enter relief
    if (_composer.phase === PHASES.RELIEF) return false;

    return true;
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function _initComposerState() {
    _composer.phase = PHASES.IDLE;
    _composer.phaseTimer = 0;
    _composer.phaseTransitionCount = 0;
    _composer.intensity = 0;
    _composer.dominantRole = null;
    _composer.secondaryRole = null;
    _composer.reliefPending = false;
    _composer._phaseJustChanged = false;
    _composer._activePatternsThisFrame = 0;
    _composer._lastPatternFrame = 0;
    _composer._patternsBlockedThisFrame = 0;
    _composer._densitySpikeFrames = 0;
    _composer._buildActivationQueue = [];
    _composer._buildActivationTimer = 0;
    _composer._peakKillThreshold = 0;
    _composer._resolveKillThreshold = 0;
    _composer._enemyCountAtPeakStart = 0;
    _composer._lastReliefCheck = 0;
    _composer._introEnemiesGated = false;
    _composer._telegraphFired = {};
    _composer._roleActivationFired = {};
  }

  function _gateEnemiesDuringIntro() {
    if (!Array.isArray(global.enemies)) return;

    // During INTRO: no enemy attacks. Enemies are visible but silent.
    // Gate is set on all living enemies when intro starts.
    if (_composer.phase === PHASES.INTRO) {
      for (var i = 0; i < global.enemies.length; i++) {
        var e = global.enemies[i];
        if (!e || !e.alive) continue;
        e._wcIntroGated = true;
      }
      _composer._introEnemiesGated = true;
    }
  }

  function _ungateEnemiesForBuild() {
    if (!Array.isArray(global.enemies)) return;

    // Clear intro gate from all enemies
    // Build phase activates specific roles progressively
    for (var i = 0; i < global.enemies.length; i++) {
      var e = global.enemies[i];
      if (!e || !e.alive) continue;
      e._wcIntroGated = false;
    }
    _composer._introEnemiesGated = false;
  }

  function _setupBuildActivationQueue() {
    _composer._buildActivationQueue = [];
    _composer._buildActivationTimer = 0;
    _composer._roleActivationFired = {};

    // Determine which roles are present
    var roles = {};
    for (var i = 0; i < global.enemies.length; i++) {
      var e = global.enemies[i];
      if (!e || !e.alive) continue;
      var r = _getEnemyRole(e);
      roles[r] = true;
    }

    // Build activation sequence based on config timings
    var sequence = [];
    var timings = [
      { role: 'sweeper',   delay: _cfgVal('buildTiming.sweeperDelay', 0) },
      { role: 'baiter',    delay: _cfgVal('buildTiming.baiterDelay', 200) },
      { role: 'suppressor', delay: _cfgVal('buildTiming.suppressorDelay', 1500) },
      { role: 'flanker',   delay: _cfgVal('buildTiming.flankerDelay', 1800) },
      { role: 'sniper',    delay: _cfgVal('buildTiming.sniperDelay', 2800) },
      { role: 'anchor',    delay: _cfgVal('buildTiming.anchorDelay', 3500) },
      { role: 'diver',     delay: _cfgVal('buildTiming.diverDelay', 4000) },
      { role: 'chaser',    delay: _cfgVal('buildTiming.chaserDelay', 4200) }
    ];

    for (var t = 0; t < timings.length; t++) {
      if (roles[timings[t].role]) {
        sequence.push({ role: timings[t].role, delay: timings[t].delay, active: false });
      }
    }

    // Sort by delay
    sequence.sort(function(a, b) { return a.delay - b.delay; });
    _composer._buildActivationQueue = sequence;
  }

  function _activateBuildRole(role) {
    if (_composer._roleActivationFired[role]) return;

    // Mark this role's enemies as active for firing
    for (var i = 0; i < global.enemies.length; i++) {
      var e = global.enemies[i];
      if (!e || !e.alive) continue;
      if (_getEnemyRole(e) === role) {
        e._wcBuildActive = true;
      }
    }

    _composer._roleActivationFired[role] = true;

    // Telegraph: phase activation flash for first 3 roles
    if (Object.keys(_composer._roleActivationFired).length <= 3) {
      if (typeof global.pushScreenShake === 'function') {
        global.pushScreenShake('light', 1);
      }
    }
  }

  function _processBuildActivation(dt) {
    if (_composer._buildActivationQueue.length === 0) return;
    _composer._buildActivationTimer += dt;

    for (var i = 0; i < _composer._buildActivationQueue.length; i++) {
      var item = _composer._buildActivationQueue[i];
      if (!item.active && _composer._buildActivationTimer >= item.delay) {
        item.active = true;
        _activateBuildRole(item.role);
      }
    }
  }

  // ============================================================
  // PATTERN GATING
  // ============================================================

  function _shouldGatePattern(enemy) {
    if (!enemy || !enemy.alive) return true;

    // INTRO: gate everything
    if (_composer.phase === PHASES.INTRO && enemy._wcIntroGated) {
      return true;
    }

    // BUILD: only allow roles that have been activated
    if (_composer.phase === PHASES.BUILD) {
      var role = _getEnemyRole(enemy);
      if (!_composer._roleActivationFired[role]) {
        return true;
      }
    }

    // RESOLVE: suspend aggressive roles
    if (_composer.phase === PHASES.RESOLVE) {
      var r = _getEnemyRole(enemy);
      if (r === 'diver' && _cfgVal('resolveTiming.diverSuspend', true)) return true;
      if (r === 'sniper' && _cfgVal('resolveTiming.sniperSuspend', true)) return true;
      if (r === 'suppressor' && _cfgVal('resolveTiming.suppressorSuspend', true)) return true;
      if (r === 'chaser' && _cfgVal('resolveTiming.chaserSuspend', true)) return true;
    }

    // RELIEF: gate everything
    if (_composer.phase === PHASES.RELIEF) return true;

    // PEAK: max simultaneous pattern cap
    if (_composer.phase === PHASES.PEAK) {
      var maxPatterns = _cfgVal('peakLimits.maxSimultaneousPatterns', 3);
      if (_composer._activePatternsThisFrame >= maxPatterns) {
        _composer._patternsBlockedThisFrame++;
        return true;
      }
    }

    // Inter-pattern gap enforcement (PEAK only)
    if (_composer.phase === PHASES.PEAK) {
      var gapMs = _cfgVal('peakLimits.interPatternGapMs', 200);
      if (global.globalTime && _composer._lastPatternFrame > 0) {
        var elapsed = (global.globalTime || 0) - _composer._lastPatternFrame;
        if (elapsed < gapMs) {
          return true;
        }
      }
    }

    return false;
  }

  // ============================================================
  // RELIEF LOGIC
  // ============================================================

  function _processRelief() {
    if (!_shouldEnterRelief()) return;

    _composer.reliefPending = false;
    _transitionTo(PHASES.RELIEF, 'wave_clear');
    _composer._reliefEnterCount++;

    // Relief is brief — the encounter director handles full silence after wave clear
    // We just tag it and track
  }

  // ============================================================
  // BOSS / SETPIECE DETECTION
  // ============================================================

  function _shouldSkipComposer() {
    // Skip for boss fights
    if (_isBossActive()) return true;

    // Skip for set pieces during intro (they have their own phase system)
    if (_isSetPieceActive()) {
      var introTimer = global.setPieceIntroTimer;
      if (typeof introTimer === 'number' && introTimer > 0) {
        return true;
      }
    }

    return false;
  }

  // ============================================================
  // MAIN UPDATE LOOP
  // ============================================================

  function updateWaveComposer(dt) {
    if (!_composer.enabled) return;
    if (!_isHardcoreEnabled()) return;
    if (_shouldSkipComposer()) return;

    dt = Math.max(0, dt || 0);

    // Reset frame counters
    _composer._activePatternsThisFrame = 0;
    _composer._patternsBlockedThisFrame = 0;
    _composer._phaseJustChanged = false;

    // Detect boss entry
    var bossNow = _isBossActive();
    if (bossNow && !_composer._wasBoss) {
      _initComposerState();
    }
    _composer._wasBoss = bossNow;
    if (bossNow) return;

    _composer.phaseTimer += dt;
    _composer.intensity = _computeIntensity();

    // Detect density spikes
    var bulletCount = Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0;
    var maxBullets = _cfgVal('peakLimits.maxBullets', 30);
    if (bulletCount > maxBullets) {
      _composer._densitySpikeFrames++;
    }

    // ---- IDLE -> INTRO ----
    if (_composer.phase === PHASES.IDLE) {
      _transitionTo(PHASES.INTRO, 'wave_start');
      _gateEnemiesDuringIntro();
      _composer.dominantRole = _inferDominantRole();
      return;
    }

    // ---- INTRO -> BUILD ----
    if (_composer.phase === PHASES.INTRO) {
      var introDuration = _cfgVal('phaseDurations.INTRO.normal', 1200);
      if (_composer.phaseTimer >= introDuration) {
        _transitionTo(PHASES.BUILD, 'intro_complete');
        _ungateEnemiesForBuild();
        _setupBuildActivationQueue();
      }
      return;
    }

    // ---- BUILD -> PEAK ----
    if (_composer.phase === PHASES.BUILD) {
      _processBuildActivation(dt);
      if (_shouldEnterPeak()) {
        _transitionTo(PHASES.PEAK, 'build_complete');
      }
      return;
    }

    // ---- PEAK -> RESOLVE ----
    if (_composer.phase === PHASES.PEAK) {
      if (_shouldEnterResolve()) {
        _transitionTo(PHASES.RESOLVE, 'peak_resolved');
      }
      return;
    }

    // ---- RESOLVE -> RELIEF ----
    if (_composer.phase === PHASES.RESOLVE) {
      _processRelief();
      return;
    }

    // ---- RELIEF -> IDLE ----
    if (_composer.phase === PHASES.RELIEF) {
      // Relief ends when next wave starts (handled by re-init)
      // or when the silence window from encounter director expires
      var ds = _getDirectorState();
      if (ds && ds.silenceTimer <= 0 && ds.spawnCooldown <= 0) {
        // Director says it's time — but we stay in relief until wave clear
        // The transition to IDLE happens at INIT of next wave
      }
      return;
    }
  }

  // ============================================================
  // WAVE INIT
  // ============================================================

  function initWaveComposer() {
    if (!_composer.enabled) return;
    if (!_isHardcoreEnabled()) return;
    if (_isBossActive()) return;

    _initComposerState();
    _composer.phase = PHASES.IDLE;
    _composer.phaseTimer = 0;

    // Intro telegraph: brief visual announcement
    if (!_isSetPieceActive()) {
      var leadIn = _cfgVal('telegraphLeadIn.introVisualMs', 600);
      setTimeout(function() {
        if (_composer.phase === PHASES.IDLE) {
          // Auto-transition to INTRO after lead-in
          // This is handled by updateWaveComposer on first call
        }
      }, leadIn);
    }
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  // Pattern gating — called before enemy fires
  global.shouldGateWaveComposerPattern = function(enemy) {
    if (!_composer.enabled) return false;
    if (!_isHardcoreEnabled()) return false;
    if (_shouldSkipComposer()) return false;
    return _shouldGatePattern(enemy);
  };

  // Register pattern fire for peak limit tracking
  global.registerWaveComposerPatternFire = function() {
    if (_composer.phase === PHASES.PEAK) {
      _composer._activePatternsThisFrame++;
      if (global.globalTime) {
        _composer._lastPatternFrame = global.globalTime;
      }
    }
  };

  // Check if a specific role should be active in BUILD phase
  global.isWaveComposerRoleActive = function(role) {
    if (!_composer.enabled) return true;
    if (_composer.phase === PHASES.PEAK || _composer.phase === PHASES.IDLE) return true;
    if (_composer.phase === PHASES.INTRO || _composer.phase === PHASES.RELIEF) return false;
    if (_composer.phase === PHASES.BUILD) {
      return !!_composer._roleActivationFired[role];
    }
    if (_composer.phase === PHASES.RESOLVE) {
      // In RESOLVE, gate divers/snipers/suppressors/chasers
      var r = role;
      if (r === 'diver' && _cfgVal('resolveTiming.diverSuspend', true)) return false;
      if (r === 'sniper' && _cfgVal('resolveTiming.sniperSuspend', true)) return false;
      if (r === 'suppressor' && _cfgVal('resolveTiming.suppressorSuspend', true)) return false;
      if (r === 'chaser' && _cfgVal('resolveTiming.chaserSuspend', true)) return false;
      return true;
    }
    return true;
  };

  // Force relief (emergency)
  global.forceWaveComposerRelief = function() {
    _transitionTo(PHASES.RESOLVE, 'force_relief');
    _composer.reliefPending = true;
  };

  // Force phase transition (debug)
  global.forceWaveComposerPhase = function(phase) {
    if (PHASES[phase.toUpperCase()]) {
      _transitionTo(PHASES[phase.toUpperCase()], 'force');
    }
  };

  // State accessors
  global.getWaveComposerState = function() {
    return {
      enabled: _composer.enabled,
      phase: _composer.phase,
      phaseTimer: _composer.phaseTimer,
      phaseTransitionCount: _composer.phaseTransitionCount,
      intensity: parseFloat(_composer.intensity.toFixed(3)),
      dominantRole: _composer.dominantRole,
      secondaryRole: _composer.secondaryRole,
      reliefPending: _composer.reliefPending,
      activePatternsThisFrame: _composer._activePatternsThisFrame,
      patternsBlockedThisFrame: _composer._patternsBlockedThisFrame,
      densitySpikeFrames: _composer._densitySpikeFrames,
      reliefEnterCount: _composer._reliefEnterCount,
      buildActivationQueue: _composer._buildActivationQueue.map(function(item) {
        return { role: item.role, delay: item.delay, active: item.active };
      }),
      bulletCount: Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0,
      aliveCount: _aliveCount()
    };
  };

  global.getWaveComposerPhase = function() {
    return _composer.phase;
  };

  global.getWaveComposerIntensity = function() {
    return _composer.intensity;
  };

  global.isWaveComposerReliefActive = function() {
    return _composer.phase === PHASES.RELIEF;
  };

  global.getWaveComposerSnapshot = function() {
    var st = global.getWaveComposerState();
    var ds = _getDirectorState();
    return {
      level: global.level || 0,
      phase: st.phase,
      phaseTimer: st.phaseTimer,
      intensity: st.intensity,
      dominantRole: st.dominantRole,
      aliveCount: st.aliveCount,
      bulletCount: st.bulletCount,
      activePatterns: st.activePatternsThisFrame,
      patternsBlocked: st.patternsBlockedThisFrame,
      densitySpikeFrames: st.densitySpikeFrames,
      reliefEnterCount: st.reliefEnterCount,
      phaseTransitionCount: st.phaseTransitionCount,
      directorPressure: ds ? parseFloat((ds.pressure || 0).toFixed(4)) : 0,
      directorSilence: ds ? (ds.silenceTimer || 0) : 0,
      isBoss: _isBossActive(),
      isSetPiece: _isSetPieceActive()
    };
  };

  // ============================================================
  // EXPORT INIT + UPDATE as global functions
  // ============================================================

  global.initWaveComposer = initWaveComposer;
  global.updateWaveComposer = updateWaveComposer;

  // Debug: console dump
  global.printWaveComposerState = function() {
    if (typeof console === 'undefined') return;
    var st = global.getWaveComposerState();
    console.log('=== WAVE COMPOSER ===');
    console.log('  phase:       ' + st.phase + ' (' + Math.round(st.phaseTimer) + 'ms)');
    console.log('  intensity:   ' + st.intensity);
    console.log('  dominant:    ' + (st.dominantRole || 'none'));
    console.log('  alive:       ' + st.aliveCount);
    console.log('  bullets:     ' + st.bulletCount);
    console.log('  patterns:    ' + st.activePatternsThisFrame + ' (blocked: ' + st.patternsBlockedThisFrame + ')');
    console.log('  transitions: ' + st.phaseTransitionCount);
    console.log('  relief:      ' + st.reliefEnterCount);
    console.log('  densitySpikes: ' + st.densitySpikeFrames);
    console.log('  buildQueue:  ' + JSON.stringify(st.buildActivationQueue));
    console.log('=======================');
  };

})(window);
