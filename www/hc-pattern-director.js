// ============================================================
// GALAXY RAIDERS — hc-pattern-director.js
// HC-PD-01: Hardcore Pattern Director — safe initial structure
// ============================================================
// FREEZE CANDIDATE: Structure only. Full logic deferred.
// Integrates with: HC-ED (encounter director), HC-RD (readability),
// HC-HB (hitbox fairness). Does NOT break any existing system.
// ============================================================

(function (global) {
  'use strict';

  // ============================================================
  // HC-PD CONFIG — read from centralized hardcore-config
  // ============================================================

  function _pdConfig() {
    if (typeof global.HC_PATTERN_DIRECTOR === 'object' && global.HC_PATTERN_DIRECTOR) {
      return global.HC_PATTERN_DIRECTOR;
    }
    // Safe default if config not yet loaded
    return {
      enabled: false,
      maxThreatBudget: 10,
      maxSimultaneousDominantPatterns: 1,
      allowDoublePrecisionThreats: false,
      preserveEscapeLanes: true,
      telegraphSpacingFrames: 20,
      densityCaps: { bullets: 40, occupancy: 0.55, convergence: 0.35 },
      debug: { enabled: false }
    };
  }

  function _pdEnabled() {
    return _pdConfig().enabled === true;
  }

  // ============================================================
  // PATTERN CLASSIFICATION — taxonomy constants
  // ============================================================

  var PATTERN_CLASS = {
    PRECISION:    'precision',
    SPACE_CONTROL:'space_control',
    PRESSURE:     'pressure',
    RHYTHM:       'rhythm',
    ESCALATION:   'escalation'
  };

  // Threat budget cost per pattern class
  var PATTERN_COST = {
    precision:     3,
    space_control: 4,
    pressure:      2,
    rhythm:        2,
    escalation:    4
  };

  // Which classes are "dominant" (should be capped)
  var DOMINANT_CLASSES = [
    PATTERN_CLASS.PRECISION,
    PATTERN_CLASS.SPACE_CONTROL,
    PATTERN_CLASS.ESCALATION
  ];

  // ============================================================
  // PATTERN REGISTRY — known patterns with classification metadata
  // ============================================================

  // BOSS PATTERN MAP
  var BOSS_PATTERN_META = {
    // CrabTron
    'crossfire': {
      phases: {
        1: { class: PATTERN_CLASS.PRECISION,    cost: 2, dominant: false, density: 3 },
        2: { class: PATTERN_CLASS.PRECISION,    cost: 3, dominant: true,  density: 3 },
        3: { class: PATTERN_CLASS.SPACE_CONTROL, cost: 4, dominant: true,  density: 8 }
      }
    },
    // Serpentrix
    'zigzag': {
      phases: {
        1: { class: PATTERN_CLASS.PRESSURE,     cost: 2, dominant: false, density: 5 },
        2: { class: PATTERN_CLASS.PRECISION,    cost: 3, dominant: true,  density: 4 },
        3: { class: PATTERN_CLASS.ESCALATION,   cost: 4, dominant: true,  density: 10 }
      }
    },
    // Orbital
    'rotate': {
      phases: {
        1: { class: PATTERN_CLASS.PRECISION,    cost: 2, dominant: false, density: 6 },
        2: { class: PATTERN_CLASS.RHYTHM,       cost: 3, dominant: true,  density: 4 },
        3: { class: PATTERN_CLASS.ESCALATION,   cost: 4, dominant: true,  density: 8 }
      }
    },
    // Teniente
    'divebomb': {
      phases: {
        1: { class: PATTERN_CLASS.PRECISION,     cost: 2, dominant: false, density: 3 },
        2: { class: PATTERN_CLASS.SPACE_CONTROL, cost: 4, dominant: true,  density: 6 },
        3: { class: PATTERN_CLASS.SPACE_CONTROL, cost: 5, dominant: true,  density: 7 }
      }
    },
    // Emperador
    'supreme': {
      phases: {
        1: { class: PATTERN_CLASS.PRESSURE,     cost: 2, dominant: false, density: 7 },
        2: { class: PATTERN_CLASS.PRECISION,    cost: 4, dominant: true,  density: 7 },
        3: { class: PATTERN_CLASS.PRECISION,    cost: 5, dominant: true,  density: 9 }
      }
    }
  };

  // ENEMY PATTERN MAP
  var ENEMY_PATTERN_META = {
    sweeper:    { class: PATTERN_CLASS.PRESSURE,  cost: 2, dominant: false, density: 5 },
    sniper:     { class: PATTERN_CLASS.PRECISION, cost: 3, dominant: true,  density: 1 },
    suppressor: { class: PATTERN_CLASS.PRESSURE,  cost: 2, dominant: false, density: 3 },
    chaser:     { class: PATTERN_CLASS.PRECISION, cost: 3, dominant: true,  density: 3 },
    flanker:    { class: PATTERN_CLASS.PRESSURE,  cost: 2, dominant: false, density: 2 },
    baiter:     { class: PATTERN_CLASS.PRESSURE,  cost: 1, dominant: false, density: 3 }
  };

  // SET PIECE PATTERN MAP
  var SETPIECE_PATTERN_META = {
    'imperial_guard': { class: PATTERN_CLASS.PRECISION, cost: 5, dominant: true,  density: 6 },
    'fortress':       { class: PATTERN_CLASS.PRESSURE,  cost: 3, dominant: false, density: 3 },
    'split_storm':    { class: PATTERN_CLASS.PRESSURE,  cost: 1, dominant: false, density: 3 }
  };

  // ============================================================
  // STATE TRACKING
  // ============================================================

  var _pdState = {
    activeBudget: 0,
    activeDominantCount: 0,
    activePatterns: [],
    lastTelegraphFrame: 0,
    escapeLanesReserved: [],
    fairnessWarnings: []
  };

  var FRAME_COUNTER = 0;
  if (typeof global.globalTime === 'number') {
    FRAME_COUNTER = Math.floor(global.globalTime / 16.667);
  }

  function _currentFrame() {
    if (typeof global.globalTime === 'number') {
      return Math.floor(global.globalTime / 16.667);
    }
    return FRAME_COUNTER++;
  }

  function _resetFrameState() {
    _pdState.activeBudget = 0;
    _pdState.activeDominantCount = 0;
    _pdState.activePatterns = [];
    _pdState.escapeLanesReserved = [];
    _pdState.fairnessWarnings = [];
    _pdState.lastTelegraphFrame = 0;
  }

  // ============================================================
  // SAFE HOOKS — structural stubs. Do NOT implement full logic yet.
  // ============================================================

  /**
   * requestPattern(origin, type, role, phase)
   * Check if a pattern can be activated without exceeding budget/dominance.
   * Returns { allowed: boolean, reason: string, cost: number }
   */
  function requestPattern(origin, type, role, phase) {
    if (!_pdEnabled()) return { allowed: true, reason: 'hc-pd disabled', cost: 0 };

    var cfg = _pdConfig();
    var meta = null;

    // Resolve pattern metadata
    if (origin === 'boss' && typeof type === 'string') {
      var bossMeta = BOSS_PATTERN_META[type];
      if (bossMeta && bossMeta.phases && bossMeta.phases[phase || 1]) {
        meta = bossMeta.phases[phase || 1];
      }
    } else if (origin === 'enemy' && typeof role === 'string') {
      meta = ENEMY_PATTERN_META[role] || null;
    } else if (origin === 'setpiece' && typeof type === 'string') {
      meta = SETPIECE_PATTERN_META[type] || null;
    }

    if (!meta) {
      // Unknown pattern — allow by default (safe)
      return { allowed: true, reason: 'unknown pattern, default allow', cost: 0 };
    }

    // Budget check
    var newBudget = _pdState.activeBudget + meta.cost;
    if (newBudget > cfg.maxThreatBudget) {
      return { allowed: false, reason: 'budget exceeded (' + newBudget + '/' + cfg.maxThreatBudget + ')', cost: meta.cost };
    }

    // Dominance check
    if (meta.dominant) {
      if (_pdState.activeDominantCount >= cfg.maxSimultaneousDominantPatterns) {
        return { allowed: false, reason: 'dominant pattern cap reached (' + _pdState.activeDominantCount + '/' + cfg.maxSimultaneousDominantPatterns + ')', cost: meta.cost };
      }

      // Double precision check
      if (!cfg.allowDoublePrecisionThreats && meta.class === PATTERN_CLASS.PRECISION) {
        var precisionActive = _pdState.activePatterns.some(function (p) {
          return p.class === PATTERN_CLASS.PRECISION && p.dominant;
        });
        if (precisionActive) {
          return { allowed: false, reason: 'double precision threats not allowed', cost: meta.cost };
        }
      }
    }

    // Telegraph spacing check
    if (cfg.telegraphSpacingFrames > 0) {
      var cf = _currentFrame();
      if (cf - _pdState.lastTelegraphFrame < cfg.telegraphSpacingFrames) {
        // Allow but warn — this is a soft constraint for now
        _pdState.fairnessWarnings.push('telegraph spacing < ' + cfg.telegraphSpacingFrames + ' frames');
      }
    }

    // Commit budget
    _pdState.activeBudget = newBudget;
    if (meta.dominant) _pdState.activeDominantCount++;
    _pdState.activePatterns.push({
      origin: origin,
      type: type,
      role: role,
      class: meta.class,
      cost: meta.cost,
      dominant: meta.dominant
    });
    _pdState.lastTelegraphFrame = _currentFrame();

    return { allowed: true, reason: 'ok', cost: meta.cost };
  }

  /**
   * canLayerPatterns(existing, incoming)
   * Check if two patterns can safely overlap.
   * Returns { allowed: boolean, reason: string, risk: string }
   */
  function canLayerPatterns(existingClass, incomingClass) {
    if (!_pdEnabled()) return { allowed: true, reason: 'hc-pd disabled', risk: 'none' };

    // Known dangerous combinations
    var DANGEROUS_PAIRS = [
      [PATTERN_CLASS.SPACE_CONTROL, PATTERN_CLASS.SPACE_CONTROL],
      [PATTERN_CLASS.PRECISION, PATTERN_CLASS.PRECISION],
      [PATTERN_CLASS.SPACE_CONTROL, PATTERN_CLASS.PRECISION]
    ];

    for (var i = 0; i < DANGEROUS_PAIRS.length; i++) {
      var pair = DANGEROUS_PAIRS[i];
      if ((existingClass === pair[0] && incomingClass === pair[1]) ||
          (existingClass === pair[1] && incomingClass === pair[0])) {
        return { allowed: false, reason: 'dangerous layer: ' + existingClass + ' + ' + incomingClass, risk: 'high' };
      }
    }

    return { allowed: true, reason: 'safe layer', risk: 'low' };
  }

  /**
   * reserveEscapeLane()
   * Reserve a screen lane for player escape.
   * Returns { lane: 'left'|'center'|'right', reserved: boolean }
   */
  function reserveEscapeLane() {
    if (!_pdEnabled() || !_pdConfig().preserveEscapeLanes) {
      return { lane: null, reserved: false };
    }

    var W = typeof global.W === 'number' ? global.W : 360;
    var lanes = ['left', 'right'];

    // Try to reserve least-used lane
    var leftCount = _pdState.escapeLanesReserved.filter(function (l) { return l === 'left'; }).length;
    var rightCount = _pdState.escapeLanesReserved.filter(function (l) { return l === 'right'; }).length;

    var lane = leftCount <= rightCount ? 'left' : 'right';
    _pdState.escapeLanesReserved.push(lane);

    return { lane: lane, reserved: true };
  }

  /**
   * getThreatBudget()
   * Returns current budget status.
   */
  function getThreatBudget() {
    var cfg = _pdConfig();
    return {
      used: _pdState.activeBudget,
      max: cfg.maxThreatBudget,
      dominantCount: _pdState.activeDominantCount,
      dominantMax: cfg.maxSimultaneousDominantPatterns,
      activePatterns: _pdState.activePatterns.slice(),
      warnings: _pdState.fairnessWarnings.slice()
    };
  }

  /**
   * registerTelegraph(frame)
   * Register a telegraph event for spacing enforcement.
   */
  function registerTelegraph(frame) {
    var f = typeof frame === 'number' ? frame : _currentFrame();
    _pdState.lastTelegraphFrame = Math.max(_pdState.lastTelegraphFrame, f);
  }

  /**
   * getPatternClassification(type, phase, role)
   * Get classification metadata for a pattern.
   */
  function getPatternClassification(type, phase, role) {
    if (typeof type === 'string' && BOSS_PATTERN_META[type]) {
      var bm = BOSS_PATTERN_META[type];
      var p = Math.max(1, Math.min(3, phase || 1));
      return bm.phases[p] || null;
    }
    if (typeof role === 'string') {
      return ENEMY_PATTERN_META[role] || null;
    }
    if (typeof type === 'string' && SETPIECE_PATTERN_META[type]) {
      return SETPIECE_PATTERN_META[type];
    }
    return null;
  }

  /**
   * getDensityCap(key)
   * Get the density cap for a given metric.
   */
  function getDensityCap(key) {
    var cfg = _pdConfig();
    var caps = cfg.densityCaps || {};
    return caps[key] !== undefined ? caps[key] : null;
  }

  /**
   * checkDensityCeiling(bulletCount, occupancyPct, convergencePct)
   * Returns ceiling check result.
   */
  function checkDensityCeiling(bulletCount, occupancyPct, convergencePct) {
    if (!_pdEnabled()) return { exceeded: false, reason: 'disabled' };

    var cfg = _pdConfig();
    var caps = cfg.densityCaps || {};

    if (typeof caps.bullets === 'number' && bulletCount > caps.bullets) {
      return { exceeded: true, reason: 'bullet density cap: ' + bulletCount + ' > ' + caps.bullets, metric: 'bullets', value: bulletCount, cap: caps.bullets };
    }
    if (typeof caps.occupancy === 'number' && occupancyPct > caps.occupancy) {
      return { exceeded: true, reason: 'screen occupancy cap: ' + occupancyPct + ' > ' + caps.occupancy, metric: 'occupancy', value: occupancyPct, cap: caps.occupancy };
    }
    if (typeof caps.convergence === 'number' && convergencePct > caps.convergence) {
      return { exceeded: true, reason: 'convergence cap: ' + convergencePct + ' > ' + caps.convergence, metric: 'convergence', value: convergencePct, cap: caps.convergence };
    }

    return { exceeded: false, reason: 'ok' };
  }

  // ============================================================
  // PER-FRAME UPDATE — called from update-enemies or main loop
  // ============================================================

  function updatePatternDirector() {
    if (!_pdEnabled()) return;

    // Reset per-frame tracking
    _resetFrameState();

    // Collect active bullet stats
    var enemyBullets = Array.isArray(global.enemyBullets) ? global.enemyBullets : [];
    var bulletCount = enemyBullets.length;

    // Approximate screen occupancy (crude: bullets / max)
    var occupancyPct = bulletCount / Math.max(1, _pdConfig().densityCaps.bullets || 40);

    // Approximate convergence (percentage of bullets near player)
    var convergenceCount = 0;
    if (typeof global.player !== 'undefined' && global.player) {
      var px = global.player.x + (global.player.width || 24) / 2;
      var py = global.player.y + (global.player.height || 24) / 2;
      var convergenceRadius = 80;
      for (var i = 0; i < enemyBullets.length; i++) {
        var b = enemyBullets[i];
        if (!b) continue;
        var dx = (b.x + (b.w || 4) / 2) - px;
        var dy = (b.y + (b.h || 10) / 2) - py;
        if (Math.sqrt(dx * dx + dy * dy) < convergenceRadius) {
          convergenceCount++;
        }
      }
    }
    var convergencePct = convergenceCount / Math.max(1, bulletCount);

    // Store for debug use
    _pdState._lastDensityCheck = checkDensityCeiling(bulletCount, occupancyPct, convergencePct);
    _pdState._lastBulletCount = bulletCount;
    _pdState._lastConvergencePct = convergencePct;
  }

  // ============================================================
  // EXPORT — safe global namespace
  // ============================================================

  global.HC_PATTERN_DIRECTOR_INSTANCE = {
    requestPattern: requestPattern,
    canLayerPatterns: canLayerPatterns,
    reserveEscapeLane: reserveEscapeLane,
    getThreatBudget: getThreatBudget,
    registerTelegraph: registerTelegraph,
    getPatternClassification: getPatternClassification,
    getDensityCap: getDensityCap,
    checkDensityCeiling: checkDensityCeiling,
    updatePatternDirector: updatePatternDirector,
    getState: function () {
      return {
        budget: _pdState.activeBudget,
        maxBudget: _pdConfig().maxThreatBudget,
        dominantCount: _pdState.activeDominantCount,
        dominantMax: _pdConfig().maxSimultaneousDominantPatterns,
        activePatterns: _pdState.activePatterns.slice(),
        densityCheck: _pdState._lastDensityCheck || null,
        bulletCount: _pdState._lastBulletCount || 0,
        convergencePct: _pdState._lastConvergencePct || 0,
        warnings: _pdState.fairnessWarnings.slice(),
        enabled: _pdEnabled()
      };
    },
    CLASS: PATTERN_CLASS,
    CLASS_COST: PATTERN_COST
  };

  // Aliases for shorter access
  global.requestPattern = requestPattern;
  global.canLayerPatterns = canLayerPatterns;
  global.reserveEscapeLane = reserveEscapeLane;
  global.getThreatBudget = getThreatBudget;
  global.registerTelegraph = registerTelegraph;
  global.updatePatternDirector = updatePatternDirector;
  global.checkDensityCeiling_ = checkDensityCeiling;

})(window);
