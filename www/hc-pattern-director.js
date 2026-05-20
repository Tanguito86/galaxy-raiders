// ============================================================
// GALAXY RAIDERS — hc-pattern-director.js
// HC-PD-01: Safe initial structure
// HC-PD-02: Runtime threat classification + passive tracking
// HC-PD-03: Passive threat budget audit
// ============================================================
// STATUS: PASSIVE — observes, classifies, measures, audits. No combat control.
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
    return {
      enabled: false,
      runtimeClassification: true,
      maxThreatBudget: 10,
      maxSimultaneousDominantPatterns: 1,
      allowDoublePrecisionThreats: false,
      preserveEscapeLanes: true,
      telegraphSpacingFrames: 20,
      densityCaps: { bullets: 40, occupancy: 0.55, convergence: 0.35 },
      readability: { maxLoad: 8 },
      warnings: { multiplePrimaryThreats: true, laneClosureRisk: true, telegraphMissing: true },
      budgetAudit: {
        enabled: true,
        maxThreatBudget: 10,
        softWarningBudget: 8,
        maxReadabilityLoad: 8,
        softReadabilityWarning: 6,
        maxPrimaryThreats: 1,
        maxSupportThreats: 2,
        laneRisk: { maxHighRiskPatterns: 1, warnOnHighHighOverlap: true, warnOnSpaceControlStack: true },
        telegraph: { minSpacingFrames: 20, warnOnOverlap: true },
        history: { maxFrames: 300, sampleEveryFrames: 10 }
      },
      debug: { enabled: false }
    };
  }

  function _pdEnabled() {
    return _pdConfig().enabled === true;
  }

  function _pdClassificationEnabled() {
    if (_pdEnabled()) return true;
    return _pdConfig().runtimeClassification === true;
  }

  function _auditConfig() {
    var cfg = _pdConfig();
    return (cfg.budgetAudit && typeof cfg.budgetAudit === 'object')
      ? cfg.budgetAudit
      : {
          enabled: true,
          maxThreatBudget: 10, softWarningBudget: 8,
          maxReadabilityLoad: 8, softReadabilityWarning: 6,
          maxPrimaryThreats: 1, maxSupportThreats: 2,
          laneRisk: { maxHighRiskPatterns: 1, warnOnHighHighOverlap: true, warnOnSpaceControlStack: true },
          telegraph: { minSpacingFrames: 20, warnOnOverlap: true },
          history: { maxFrames: 300, sampleEveryFrames: 10 }
        };
  }

  function _auditEnabled() {
    if (!_pdClassificationEnabled()) return false;
    return _auditConfig().enabled !== false;
  }

  // ============================================================
  // PATTERN TAXONOMY CONSTANTS
  // ============================================================

  var CATEGORY = {
    PRECISION:     'precision',
    SPACE_CONTROL: 'spaceControl',
    PRESSURE:      'pressure',
    RHYTHM:        'rhythm',
    ESCALATION:    'escalation'
  };

  var DOMINANCE = {
    PRIMARY: 'primary',
    SUPPORT: 'support',
    UTILITY: 'utility'
  };

  var DENSITY_CLASS = {
    LOW:    'low',
    MEDIUM: 'medium',
    HIGH:   'high'
  };

  var LANE_RISK = {
    SAFE:   'safe',
    LOW:    'low',
    MEDIUM: 'medium',
    HIGH:   'high'
  };

  var OVERLAP_RISK = {
    NONE:  'none',
    LOW:   'low',
    MEDIUM: 'medium',
    HIGH:  'high'
  };

  var COOLDOWN_CLASS = {
    SHORT:  'short',
    MEDIUM: 'medium',
    LONG:   'long'
  };

  // ============================================================
  // HC_PATTERN_REGISTRY — runtime pattern definitions
  // ============================================================
  // Each entry maps a pattern ID to its hardcore metadata.
  // This is the SINGLE SOURCE OF TRUTH for pattern classification.
  // ============================================================

  var HC_PATTERN_REGISTRY = {

    // ---- PRECISION ----
    aimedShot: {
      id: 'aimedShot',
      category: CATEGORY.PRECISION,
      type: 'aimed',
      weight: 2,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['sniper', 'single_bullet', 'precision']
    },

    aimedBurst: {
      id: 'aimedBurst',
      category: CATEGORY.PRECISION,
      type: 'burst',
      weight: 4,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.MEDIUM,
      tags: ['boss', 'delayed', 'precision', 'rhythm']
    },

    aimedColumn: {
      id: 'aimedColumn',
      category: CATEGORY.PRECISION,
      type: 'column',
      weight: 3,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'vertical', 'aimed', 'column']
    },

    aimedArc: {
      id: 'aimedArc',
      category: CATEGORY.PRECISION,
      type: 'arc',
      weight: 3,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'arc', 'aimed', 'orbital']
    },

    aimedSpread: {
      id: 'aimedSpread',
      category: CATEGORY.PRECISION,
      type: 'spread',
      weight: 5,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 3,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['boss', 'spread', 'aimed', 'imperial']
    },

    // ---- SPACE CONTROL ----

    radialRing: {
      id: 'radialRing',
      category: CATEGORY.SPACE_CONTROL,
      type: 'ring',
      weight: 6,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.HIGH,
      laneRisk: LANE_RISK.HIGH,
      readabilityCost: 3,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['boss', 'ring', 'radial', 'area_denial']
    },

    laneColumn: {
      id: 'laneColumn',
      category: CATEGORY.SPACE_CONTROL,
      type: 'column',
      weight: 5,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.HIGH,
      readabilityCost: 3,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['boss', 'column', 'lane_closure', 'teniente']
    },

    rotatingArcs: {
      id: 'rotatingArcs',
      category: CATEGORY.SPACE_CONTROL,
      type: 'rotating',
      weight: 6,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.HIGH,
      readabilityCost: 4,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['boss', 'rotating', 'wall', 'orbital']
    },

    mineField: {
      id: 'mineField',
      category: CATEGORY.SPACE_CONTROL,
      type: 'mine',
      weight: 3,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 2,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.MEDIUM,
      tags: ['boss', 'persistent', 'area_denial', 'serpentrix']
    },

    tractorBeam: {
      id: 'tractorBeam',
      category: CATEGORY.SPACE_CONTROL,
      type: 'beam',
      weight: 4,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.HIGH,
      readabilityCost: 3,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['boss', 'vertical', 'beam', 'orbital']
    },

    satelliteOrbit: {
      id: 'satelliteOrbit',
      category: CATEGORY.SPACE_CONTROL,
      type: 'orbit',
      weight: 2,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 2,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.SHORT,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'orbital', 'satellite', 'passive']
    },

    // ---- PRESSURE ----

    wideFan: {
      id: 'wideFan',
      category: CATEGORY.PRESSURE,
      type: 'fan',
      weight: 2,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'enemy', 'fan', 'sweeper']
    },

    downwardSpread: {
      id: 'downwardSpread',
      category: CATEGORY.PRESSURE,
      type: 'spread',
      weight: 3,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 2,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'spread', 'imperial']
    },

    suppressorFan: {
      id: 'suppressorFan',
      category: CATEGORY.PRESSURE,
      type: 'fan_lateral',
      weight: 2,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['enemy', 'lateral', 'suppressor', 'alien4']
    },

    flankerCross: {
      id: 'flankerCross',
      category: CATEGORY.PRESSURE,
      type: 'cross',
      weight: 2,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['enemy', 'edge', 'crossfire', 'alien6']
    },

    baiterSpread: {
      id: 'baiterSpread',
      category: CATEGORY.PRESSURE,
      type: 'spread_erratic',
      weight: 1,
      dominance: DOMINANCE.UTILITY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.SAFE,
      readabilityCost: 1,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.SHORT,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['enemy', 'erratic', 'bait', 'alien_mini']
    },

    diverPursuit: {
      id: 'diverPursuit',
      category: CATEGORY.PRESSURE,
      type: 'pursuit',
      weight: 3,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.MEDIUM,
      tags: ['enemy', 'movement', 'diver', 'pursuit', 'alien3']
    },

    // ---- RHYTHM ----

    chaserBurst: {
      id: 'chaserBurst',
      category: CATEGORY.RHYTHM,
      type: 'burst_delayed',
      weight: 3,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.MEDIUM,
      tags: ['enemy', 'delayed', 'aimed', 'chaser', 'alien5']
    },

    delayedBurst: {
      id: 'delayedBurst',
      category: CATEGORY.RHYTHM,
      type: 'staggered',
      weight: 3,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'delayed', 'staggered', 'cranckton']
    },

    // ---- ESCALATION ----

    arcWave: {
      id: 'arcWave',
      category: CATEGORY.ESCALATION,
      type: 'wave',
      weight: 5,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.HIGH,
      laneRisk: LANE_RISK.MEDIUM,
      readabilityCost: 3,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.MEDIUM,
      tags: ['boss', 'wave', 'modulation', 'serpentrix']
    },

    chargeImpact: {
      id: 'chargeImpact',
      category: CATEGORY.ESCALATION,
      type: 'impact',
      weight: 4,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.HIGH,
      laneRisk: LANE_RISK.HIGH,
      readabilityCost: 3,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['boss', 'radial', 'impact', 'teniente']
    },

    teleportWave: {
      id: 'teleportWave',
      category: CATEGORY.ESCALATION,
      type: 'wave',
      weight: 3,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.MEDIUM,
      tags: ['boss', 'teleport', 'radial', 'emperador']
    },

    // ---- SET PIECE / SCRIPTED ----

    imperialCrossfire: {
      id: 'imperialCrossfire',
      category: CATEGORY.PRECISION,
      type: 'crossfire',
      weight: 5,
      dominance: DOMINANCE.PRIMARY,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.HIGH,
      readabilityCost: 4,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.HIGH,
      tags: ['setpiece', 'crossfire', 'imperial_guard', 'coordinated']
    },

    fortressVolley: {
      id: 'fortressVolley',
      category: CATEGORY.PRESSURE,
      type: 'volley',
      weight: 3,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 2,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['setpiece', 'row', 'volley', 'fortress']
    },

    splitFan: {
      id: 'splitFan',
      category: CATEGORY.PRESSURE,
      type: 'fan',
      weight: 1,
      dominance: DOMINANCE.UTILITY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: true,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['setpiece', 'fan', 'split_storm', 'alien6']
    },

    // ---- UTILITY / OTHER ----

    counterShot: {
      id: 'counterShot',
      category: CATEGORY.PRECISION,
      type: 'homing',
      weight: 2,
      dominance: DOMINANCE.UTILITY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.LONG,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'counter', 'reactive']
    },

    defaultEnemyShot: {
      id: 'defaultEnemyShot',
      category: CATEGORY.PRESSURE,
      type: 'basic',
      weight: 1,
      dominance: DOMINANCE.UTILITY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.SAFE,
      readabilityCost: 0,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.SHORT,
      overlapRisk: OVERLAP_RISK.NONE,
      tags: ['enemy', 'basic', 'default']
    },

    shmupExternal: {
      id: 'shmupExternal',
      category: CATEGORY.PRESSURE,
      type: 'external',
      weight: 1,
      dominance: DOMINANCE.UTILITY,
      densityClass: DENSITY_CLASS.LOW,
      laneRisk: LANE_RISK.SAFE,
      readabilityCost: 0,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.SHORT,
      overlapRisk: OVERLAP_RISK.NONE,
      tags: ['enemy', 'external', 'shmup', 'routed']
    },

    bossDefaultPattern: {
      id: 'bossDefaultPattern',
      category: CATEGORY.PRESSURE,
      type: 'default',
      weight: 2,
      dominance: DOMINANCE.SUPPORT,
      densityClass: DENSITY_CLASS.MEDIUM,
      laneRisk: LANE_RISK.LOW,
      readabilityCost: 1,
      telegraphRequired: false,
      cooldownClass: COOLDOWN_CLASS.MEDIUM,
      overlapRisk: OVERLAP_RISK.LOW,
      tags: ['boss', 'default', 'fallback']
    }
  };

  // ============================================================
  // CALLER-TO-REGISTRY MAPPING
  // Maps existing game pattern names/roles/contexts to registry IDs
  // ============================================================

  var CALLER_MAP = {
    // Boss HC patterns by boss.pattern + phase
    boss: {
      crossfire: { 1: 'aimedColumn', 2: 'delayedBurst', 3: 'radialRing' },
      zigzag:     { 1: 'wideFan',      2: 'aimedBurst',  3: 'arcWave' },
      rotate:     { 1: 'aimedArc',     2: 'aimedArc',    3: 'rotatingArcs' },
      divebomb:   { 1: 'aimedColumn',  2: 'laneColumn',  3: 'laneColumn' },
      supreme:    { 1: 'downwardSpread', 2: 'aimedSpread', 3: 'aimedSpread' }
    },

    // Enemy HC patterns by role
    enemy: {
      sweeper:    'wideFan',
      sniper:     'aimedShot',
      suppressor: 'suppressorFan',
      chaser:     'chaserBurst',
      flanker:    'flankerCross',
      baiter:     'baiterSpread',
      diver:      'diverPursuit'
    },

    // Set piece patterns by name
    setpiece: {
      imperial_guard: 'imperialCrossfire',
      fortress:       'fortressVolley',
      split_storm:    'splitFan'
    },

    // Other boss attacks
    boss_other: {
      counter:  'counterShot',
      tractor:  'tractorBeam',
      mine:     'mineField',
      satellite:'satelliteOrbit',
      impact:   'chargeImpact',
      teleport: 'teleportWave',
      default:  'bossDefaultPattern'
    }
  };

  /**
   * _resolvePatternId(origin, type, role, phase, subType)
   * Resolves a caller context to a registry pattern ID.
   * Returns null for unknown patterns (safe default).
   */
  function _resolvePatternId(origin, type, role, phase, subType) {
    if (origin === 'boss' && typeof subType === 'string') {
      var other = CALLER_MAP.boss_other[subType];
      if (other) return other;
    }
    if (origin === 'boss' && typeof type === 'string') {
      var bossMap = CALLER_MAP.boss[type];
      if (bossMap) {
        var p = Math.max(1, Math.min(3, phase || 1));
        var id = bossMap[p];
        if (typeof id === 'string') return id;
      }
    }
    if (origin === 'enemy' && typeof role === 'string') {
      var enemyId = CALLER_MAP.enemy[role];
      if (enemyId) return enemyId;
    }
    if (origin === 'setpiece' && typeof type === 'string') {
      var spId = CALLER_MAP.setpiece[type];
      if (spId) return spId;
    }
    return null;
  }

  // ============================================================
  // PATTERN DEFINITION HELPERS — safe lookup, never breaks
  // ============================================================

  var _emptyDef = {
    id: '_unknown',
    category: CATEGORY.PRESSURE,
    type: 'unknown',
    weight: 0,
    dominance: DOMINANCE.UTILITY,
    densityClass: DENSITY_CLASS.LOW,
    laneRisk: LANE_RISK.SAFE,
    readabilityCost: 0,
    telegraphRequired: false,
    cooldownClass: COOLDOWN_CLASS.SHORT,
    overlapRisk: OVERLAP_RISK.NONE,
    tags: ['unknown']
  };

  function getPatternDefinition(id) {
    if (typeof id !== 'string') return _emptyDef;
    var def = HC_PATTERN_REGISTRY[id];
    return def || _emptyDef;
  }

  function getPatternWeight(id) {
    var def = getPatternDefinition(id);
    return def.weight;
  }

  function getPatternCategory(id) {
    var def = getPatternDefinition(id);
    return def.category;
  }

  function isPrimaryThreat(id) {
    var def = getPatternDefinition(id);
    return def.dominance === DOMINANCE.PRIMARY;
  }

  function requiresTelegraph(id) {
    var def = getPatternDefinition(id);
    return def.telegraphRequired === true;
  }

  function getLaneRisk(id) {
    var def = getPatternDefinition(id);
    return def.laneRisk;
  }

  function getReadabilityCost(id) {
    var def = getPatternDefinition(id);
    return def.readabilityCost;
  }

  function getDensityClass(id) {
    var def = getPatternDefinition(id);
    return def.densityClass;
  }

  function getOverlapRisk(id) {
    var def = getPatternDefinition(id);
    return def.overlapRisk;
  }

  function getCooldownClass(id) {
    var def = getPatternDefinition(id);
    return def.cooldownClass;
  }

  function getPatternTags(id) {
    var def = getPatternDefinition(id);
    return (def.tags || []).slice();
  }

  // ============================================================
  // STATE TRACKING — passive observation
  // ============================================================

  var _pdState = {
    // Per-frame counters (reset each frame)
    activeBudget: 0,
    activeDominantCount: 0,
    activePatterns: [],
    lastTelegraphFrame: 0,
    escapeLanesReserved: [],

    // Cross-frame accumulators
    totalPatternActivations: 0,
    patternFrequency: {},
    dominantPatternHistory: [],
    supportPatternHistory: [],
    simultaneousPrimaryCount: 0,
    activeDensityClass: DENSITY_CLASS.LOW,
    readabilityLoad: 0,
    warnings: [],

    // HC-PD-03: Budget audit fields
    categoryCounts: {},
    highestLaneRisk: LANE_RISK.SAFE,
    laneRiskScore: 0,
    spaceControlCount: 0,
    highLaneRiskCount: 0,
    activeTelegraphCount: 0,
    telegraphOverlapDetected: false,
    missingTelegraphCount: 0,
    dangerousCombo: null,
    auditHistory: [],
    auditHistorySampleCounter: 0,

    // Density snapshot (per-frame)
    _lastDensityCheck: null,
    _lastBulletCount: 0,
    _lastConvergencePct: 0
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

  function _currentTime() {
    return typeof global.globalTime === 'number' ? global.globalTime : FRAME_COUNTER * 16.667;
  }

  function _resetFrameState() {
    _pdState.activeBudget = 0;
    _pdState.activeDominantCount = 0;
    _pdState.activePatterns = [];
    _pdState.escapeLanesReserved = [];
    _pdState.warnings = [];
    _pdState.lastTelegraphFrame = 0;
    _pdState.readabilityLoad = 0;
    _pdState.simultaneousPrimaryCount = 0;
    _pdState.categoryCounts = {};
    _pdState.highestLaneRisk = LANE_RISK.SAFE;
    _pdState.laneRiskScore = 0;
    _pdState.spaceControlCount = 0;
    _pdState.highLaneRiskCount = 0;
    _pdState.activeTelegraphCount = 0;
    _pdState.telegraphOverlapDetected = false;
    _pdState.missingTelegraphCount = 0;
    _pdState.dangerousCombo = null;
  }

  // ============================================================
  // PER-FRAME UPDATE — main entry point called from game loop
  // ============================================================

  function updatePatternDirector() {
    if (!_pdClassificationEnabled()) return;

    // Reset per-frame tracking
    _resetFrameState();

    // Collect active bullet stats
    var enemyBullets = Array.isArray(global.enemyBullets) ? global.enemyBullets : [];
    var bulletCount = enemyBullets.length;
    var cfg = _pdConfig();

    // Approximate screen occupancy
    var densityCaps = cfg.densityCaps || {};
    var maxBullets = densityCaps.bullets || 40;
    var occupancyPct = bulletCount / Math.max(1, maxBullets);

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

    // Determine active density class
    if (bulletCount > maxBullets * 0.66) {
      _pdState.activeDensityClass = DENSITY_CLASS.HIGH;
    } else if (bulletCount > maxBullets * 0.33) {
      _pdState.activeDensityClass = DENSITY_CLASS.MEDIUM;
    } else {
      _pdState.activeDensityClass = DENSITY_CLASS.LOW;
    }

    // Store for debug use
    _pdState._lastDensityCheck = _checkDensityCeilingInternal(bulletCount, occupancyPct, convergencePct);
    _pdState._lastBulletCount = bulletCount;
    _pdState._lastConvergencePct = convergencePct;

    // Run validation warnings
    _runValidationWarnings();
  }

  function _checkDensityCeilingInternal(bulletCount, occupancyPct, convergencePct) {
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
  // PASSIVE PATTERN REGISTRATION — called at pattern fire time
  // ============================================================

  /**
   * registerPatternUsage(patternId, source, meta)
   * PASSIVE: Records that a pattern was activated. NO combat control.
   * source: 'enemy' | 'boss' | 'encounter' | 'external' | 'scripted'
   * meta: optional { phase, originType, enemyType, ... }
   */
  function registerPatternUsage(patternId, source, meta) {
    if (!_pdClassificationEnabled()) return;

    var id = typeof patternId === 'string' ? patternId : null;
    if (!id) {
      // Try to resolve from meta
      if (meta) {
        var origin = source === 'boss' ? 'boss' : 'enemy';
        var type = meta.originType || meta.bossPattern || null;
        var role = meta.enemyRole || meta.role || null;
        var phase = meta.phase || 1;
        var subType = meta.subType || null;
        id = _resolvePatternId(origin, type, role, phase, subType);
      }
    }

    var def = getPatternDefinition(id);
    if (!def || def.id === '_unknown') return;

    // Track activation
    _pdState.totalPatternActivations++;
    if (!_pdState.patternFrequency[id]) _pdState.patternFrequency[id] = 0;
    _pdState.patternFrequency[id]++;

    // Track active patterns for this frame
    _pdState.activePatterns.push({
      id: id,
      source: source || 'unknown',
      category: def.category,
      dominance: def.dominance,
      weight: def.weight,
      densityClass: def.densityClass,
      laneRisk: def.laneRisk,
      readabilityCost: def.readabilityCost,
      timestamp: _currentTime(),
      meta: meta || {}
    });

    // Update budget
    _pdState.activeBudget += def.weight;

    // Update dominance tracking
    if (def.dominance === DOMINANCE.PRIMARY) {
      _pdState.activeDominantCount++;
      _pdState.dominantPatternHistory.push({ id: id, time: _currentTime(), source: source });
      if (_pdState.dominantPatternHistory.length > 40) _pdState.dominantPatternHistory.shift();
    }
    if (def.dominance === DOMINANCE.SUPPORT) {
      _pdState.supportPatternHistory.push({ id: id, time: _currentTime(), source: source });
      if (_pdState.supportPatternHistory.length > 40) _pdState.supportPatternHistory.shift();
    }

    // Update readability load
    var readCfg = (_pdConfig().readability || {});
    var maxLoad = readCfg.maxLoad || 8;
    _pdState.readabilityLoad = Math.min(maxLoad, _pdState.readabilityLoad + def.readabilityCost);

    // Count simultaneous primary threats
    _pdState.simultaneousPrimaryCount = _pdState.activePatterns.filter(function (p) {
      return p.dominance === DOMINANCE.PRIMARY;
    }).length;
  }

  /**
   * registerPatternUsageResolved(origin, type, role, phase, subType, source)
   * Convenience: takes raw caller context and resolves to pattern ID.
   */
  function registerPatternUsageResolved(origin, type, role, phase, subType, source) {
    var id = _resolvePatternId(origin, type, role, phase, subType);
    if (!id) return;
    registerPatternUsage(id, source || origin, {
      originType: type,
      enemyRole: role,
      phase: phase,
      subType: subType
    });
  }

  // ============================================================
  // HC-PD-03: DANGEROUS COMBO DETECTION
  // ============================================================
  // Known dangerous pattern combinations.
  // Detection only — never blocks gameplay.
  // ============================================================

  var DANGEROUS_COMBOS = [
    { combo: 'wall+sweep',         classes: [CATEGORY.SPACE_CONTROL, CATEGORY.PRESSURE],  tags: [['wall', 'lane_closure'], ['fan', 'sweep']] },
    { combo: 'sniper+suppression', classes: [CATEGORY.PRECISION, CATEGORY.PRESSURE],     tags: [['sniper'], ['suppressor', 'suppression']] },
    { combo: 'spiral+denseSpread', classes: [CATEGORY.ESCALATION, CATEGORY.PRESSURE],    tags: [['wave', 'spiral'], ['spread']] },
    { combo: 'doubleAimedSync',    classes: [CATEGORY.PRECISION, CATEGORY.PRECISION],    tags: [[], []] },
    { combo: 'areaDenial+chase',   classes: [CATEGORY.SPACE_CONTROL, CATEGORY.PRESSURE], tags: [['area_denial'], ['pursuit', 'chaser']] },
    { combo: 'rotating+tractor',   classes: [CATEGORY.ESCALATION, CATEGORY.SPACE_CONTROL], tags: [['rotating'], ['beam']] },
    { combo: 'crossfire+sniper',   classes: [CATEGORY.PRECISION, CATEGORY.PRECISION],    tags: [['crossfire'], ['sniper']] },
    { combo: 'wall+highLaneRisk',  classes: [CATEGORY.SPACE_CONTROL, null],              tags: [['wall', 'lane_closure'], []] }
  ];

  function _matchesTags(patternTags, requiredTags) {
    if (!requiredTags || requiredTags.length === 0) return true;
    for (var i = 0; i < requiredTags.length; i++) {
      if (patternTags.indexOf(requiredTags[i]) !== -1) return true;
    }
    return false;
  }

  function _detectDangerousCombos() {
    if (!_auditEnabled()) return;
    var patterns = _pdState.activePatterns;
    if (patterns.length < 2) return;

    for (var c = 0; c < DANGEROUS_COMBOS.length; c++) {
      var dc = DANGEROUS_COMBOS[c];
      var foundA = false, foundB = false;
      var idA = null, idB = null;

      for (var i = 0; i < patterns.length; i++) {
        var p = patterns[i];
        var def = getPatternDefinition(p.id);
        var tags = def.tags || [];

        if (!foundA) {
          if (p.category === dc.classes[0] && _matchesTags(tags, dc.tags[0])) {
            foundA = true; idA = p.id;
          }
        } else if (!foundB) {
          if ((dc.classes[1] === null || p.category === dc.classes[1]) && _matchesTags(tags, dc.tags[1])) {
            foundB = true; idB = p.id;
          }
        }
      }

      if (foundA && foundB) {
        _pdState.dangerousCombo = dc.combo + ':' + (idA || '?') + '+' + (idB || '?');
        _pdState.warnings.push('COMBO:' + dc.combo + ' (' + (idA || '?') + '+' + (idB || '?') + ')');
        return;
      }
    }
  }

  // ============================================================
  // HC-PD-03: LANE RISK AUDIT
  // ============================================================

  var LANE_RISK_SCORE = { safe: 0, low: 1, medium: 2, high: 3 };

  function _auditLaneRisk() {
    if (!_auditEnabled()) return;
    var auditCfg = _auditConfig();
    var laneCfg = auditCfg.laneRisk || {};
    var patterns = _pdState.activePatterns;
    var score = 0;
    var spaceControlCount = 0;
    var highCount = 0;
    var highest = LANE_RISK.SAFE;

    for (var i = 0; i < patterns.length; i++) {
      var risk = patterns[i].laneRisk;
      score += LANE_RISK_SCORE[risk] || 0;
      if (risk === LANE_RISK.HIGH) highCount++;
      if (risk === LANE_RISK.MEDIUM || risk === LANE_RISK.HIGH) {
        if (LANE_RISK_SCORE[risk] > (LANE_RISK_SCORE[highest] || 0)) highest = risk;
      }
      if (patterns[i].category === CATEGORY.SPACE_CONTROL) spaceControlCount++;
    }

    _pdState.laneRiskScore = score;
    _pdState.spaceControlCount = spaceControlCount;
    _pdState.highLaneRiskCount = highCount;
    _pdState.highestLaneRisk = highest;

    // Warnings
    var maxHigh = laneCfg.maxHighRiskPatterns || 1;
    if (highCount > maxHigh) {
      _pdState.warnings.push('LANE_HIGH:' + highCount + ' high lane-risk patterns (max ' + maxHigh + ')');
    }
    if (laneCfg.warnOnHighHighOverlap && highCount >= 2) {
      _pdState.warnings.push('LANE_OVERLAP:' + highCount + ' high-risk patterns overlapping');
    }
    if (laneCfg.warnOnSpaceControlStack && spaceControlCount >= 2) {
      _pdState.warnings.push('SPACE_STACK:' + spaceControlCount + ' space-control patterns active');
    }
  }

  // ============================================================
  // HC-PD-03: TELEGRAPH AUDIT
  // ============================================================

  function _auditTelegraph() {
    if (!_auditEnabled()) return;
    var auditCfg = _auditConfig();
    var tgCfg = auditCfg.telegraph || {};
    var patterns = _pdState.activePatterns;
    var activeCount = 0;
    var missingCount = 0;
    var minSpacing = tgCfg.minSpacingFrames || 20;
    var cf = _currentFrame();

    for (var i = 0; i < patterns.length; i++) {
      var def = getPatternDefinition(patterns[i].id);
      if (def.telegraphRequired) {
        activeCount++;
        if (!patterns[i].meta._hasTelegraph) {
          missingCount++;
        }
      }
    }

    _pdState.activeTelegraphCount = activeCount;
    _pdState.missingTelegraphCount = missingCount;

    // Overlap detection
    if (activeCount >= 2 && tgCfg.warnOnOverlap) {
      _pdState.telegraphOverlapDetected = true;
      _pdState.warnings.push('TG_OVERLAP:' + activeCount + ' telegraphs overlapping, spacing<' + minSpacing);
    } else if (activeCount >= 2) {
      _pdState.telegraphOverlapDetected = true;
    }

    if (missingCount > 0) {
      _pdState.warnings.push('TG_MISSING:' + missingCount + ' patterns need telegraph, none registered');
    }
  }

  // ============================================================
  // HC-PD-03: COMPACT HISTORY
  // ============================================================

  function _recordAuditHistory() {
    if (!_auditEnabled()) return;
    var auditCfg = _auditConfig();
    var histCfg = auditCfg.history || {};
    var sampleEvery = histCfg.sampleEveryFrames || 10;
    var maxFrames = histCfg.maxFrames || 300;

    _pdState.auditHistorySampleCounter++;
    if (_pdState.auditHistorySampleCounter < sampleEvery) return;
    _pdState.auditHistorySampleCounter = 0;

    var entry = {
      f: _currentFrame(),
      w: _pdState.activeBudget,
      r: _pdState.readabilityLoad,
      p: _pdState.simultaneousPrimaryCount,
      s: (_pdState.activePatterns.filter(function (p) { return p.dominance === DOMINANCE.SUPPORT; })).length,
      l: _pdState.laneRiskScore,
      n: _pdState.warnings.length,
      d: _pdState.dangerousCombo ? 1 : 0
    };

    _pdState.auditHistory.push(entry);
    if (_pdState.auditHistory.length > maxFrames) {
      _pdState.auditHistory.splice(0, _pdState.auditHistory.length - maxFrames);
    }
  }

  // ============================================================
  // HC-PD-03: BUDGET AUDIT COMPUTATION
  // ============================================================

  function _computeBudgetAudit() {
    if (!_auditEnabled()) return;

    var patterns = _pdState.activePatterns;
    var auditCfg = _auditConfig();

    // Category counts
    var counts = {};
    for (var i = 0; i < patterns.length; i++) {
      var cat = patterns[i].category;
      counts[cat] = (counts[cat] || 0) + 1;
    }
    _pdState.categoryCounts = counts;

    // Threat weight total (already tracked via activeBudget)

    // Budget warnings
    if (_pdState.activeBudget >= auditCfg.maxThreatBudget) {
      _pdState.warnings.push('BUDGET_HARD:threat budget ' + _pdState.activeBudget + '/' + auditCfg.maxThreatBudget);
    } else if (_pdState.activeBudget >= (auditCfg.softWarningBudget || 8)) {
      _pdState.warnings.push('BUDGET_SOFT:threat budget ' + _pdState.activeBudget + '/' + auditCfg.softWarningBudget);
    }

    // Readability warnings
    var maxRead = auditCfg.maxReadabilityLoad || 8;
    if (_pdState.readabilityLoad >= maxRead) {
      _pdState.warnings.push('READ_HARD:readability ' + _pdState.readabilityLoad + '/' + maxRead);
    } else if (_pdState.readabilityLoad >= (auditCfg.softReadabilityWarning || 6)) {
      _pdState.warnings.push('READ_SOFT:readability ' + _pdState.readabilityLoad + '/' + auditCfg.softReadabilityWarning);
    }

    // Primary threat cap
    var maxPrimary = auditCfg.maxPrimaryThreats || 1;
    if (_pdState.simultaneousPrimaryCount > maxPrimary) {
      _pdState.warnings.push('MULTI_PRIMARY:' + _pdState.simultaneousPrimaryCount + ' primary threats (max ' + maxPrimary + ')');
    }

    // Support threat cap
    var maxSupport = auditCfg.maxSupportThreats || 2;
    var supportCount = (counts[DOMINANCE.SUPPORT] || 0);
    if (supportCount > maxSupport) {
      _pdState.warnings.push('SUPPORT_OVER:' + supportCount + ' support threats (max ' + maxSupport + ')');
    }

    // Density risk (based on bullet count vs pattern count)
    if (_pdState._lastBulletCount > 30 && _pdState.activePatterns.length > 4) {
      _pdState.warnings.push('DENSITY_RISK:' + _pdState._lastBulletCount + ' bullets x ' + _pdState.activePatterns.length + ' patterns');
    }

    // Run sub-audits
    _detectDangerousCombos();
    _auditLaneRisk();
    _auditTelegraph();
    _recordAuditHistory();
  }

  // ============================================================
  // VALIDATION WARNINGS — debug only, never blocks
  // ============================================================

  function _runValidationWarnings() {
    // HC-PD-03: Run the full budget audit
    if (_auditEnabled()) {
      _computeBudgetAudit();
    }
  }

  // ============================================================
  // LEGACY HC-PD-01 HOOKS — preserved and extended
  // ============================================================

  function requestPattern(origin, type, role, phase) {
    if (!_pdEnabled()) return { allowed: true, reason: 'hc-pd disabled', cost: 0 };

    var cfg = _pdConfig();
    var meta = null;

    if (origin === 'boss' && typeof type === 'string') {
      var bossMeta = (typeof BOSS_PATTERN_META !== 'undefined') ? BOSS_PATTERN_META[type] : null;
      // Fallback: use registry
      if (!bossMeta) {
        var regId = _resolvePatternId('boss', type, null, phase, null);
        if (regId) {
          var regDef = getPatternDefinition(regId);
          meta = { class: regDef.category, cost: regDef.weight, dominant: regDef.dominance === DOMINANCE.PRIMARY, density: 0 };
        }
      } else if (bossMeta.phases && bossMeta.phases[phase || 1]) {
        meta = bossMeta.phases[phase || 1];
      }
    } else if (origin === 'enemy' && typeof role === 'string') {
      var regId2 = _resolvePatternId('enemy', null, role, null, null);
      if (regId2) {
        var regDef2 = getPatternDefinition(regId2);
        meta = { class: regDef2.category, cost: regDef2.weight, dominant: regDef2.dominance === DOMINANCE.PRIMARY, density: 0 };
      }
    } else if (origin === 'setpiece' && typeof type === 'string') {
      var regId3 = _resolvePatternId('setpiece', type, null, null, null);
      if (regId3) {
        var regDef3 = getPatternDefinition(regId3);
        meta = { class: regDef3.category, cost: regDef3.weight, dominant: regDef3.dominance === DOMINANCE.PRIMARY, density: 0 };
      }
    }

    if (!meta) {
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
        return { allowed: false, reason: 'dominant pattern cap reached', cost: meta.cost };
      }
      if (!cfg.allowDoublePrecisionThreats && meta.class === CATEGORY.PRECISION) {
        var precisionActive = _pdState.activePatterns.some(function (p) {
          return p.class === CATEGORY.PRECISION && p.dominant;
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
        _pdState.warnings.push('telegraph spacing < ' + cfg.telegraphSpacingFrames + ' frames');
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

  function canLayerPatterns(existingClass, incomingClass) {
    if (!_pdEnabled()) return { allowed: true, reason: 'hc-pd disabled', risk: 'none' };

    var DANGEROUS_PAIRS = [
      [CATEGORY.SPACE_CONTROL, CATEGORY.SPACE_CONTROL],
      [CATEGORY.PRECISION, CATEGORY.PRECISION],
      [CATEGORY.SPACE_CONTROL, CATEGORY.PRECISION]
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

  function reserveEscapeLane() {
    if (!_pdEnabled() || !_pdConfig().preserveEscapeLanes) {
      return { lane: null, reserved: false };
    }
    var leftCount = _pdState.escapeLanesReserved.filter(function (l) { return l === 'left'; }).length;
    var rightCount = _pdState.escapeLanesReserved.filter(function (l) { return l === 'right'; }).length;
    var lane = leftCount <= rightCount ? 'left' : 'right';
    _pdState.escapeLanesReserved.push(lane);
    return { lane: lane, reserved: true };
  }

  function getThreatBudget() {
    var cfg = _pdConfig();
    return {
      used: _pdState.activeBudget,
      max: cfg.maxThreatBudget,
      dominantCount: _pdState.activeDominantCount,
      dominantMax: cfg.maxSimultaneousDominantPatterns,
      activePatterns: _pdState.activePatterns.slice(),
      warnings: _pdState.warnings.slice()
    };
  }

  function registerTelegraph(frame) {
    var f = typeof frame === 'number' ? frame : _currentFrame();
    _pdState.lastTelegraphFrame = Math.max(_pdState.lastTelegraphFrame, f);
  }

  function getPatternClassification(type, phase, role) {
    // Legacy: map to registry
    var id = _resolvePatternId('boss', type, null, phase, null);
    if (!id && role) id = _resolvePatternId('enemy', null, role, null, null);
    if (!id && type) id = _resolvePatternId('setpiece', type, null, null, null);
    if (id) {
      var def = getPatternDefinition(id);
      return def.id !== '_unknown' ? def : null;
    }
    return null;
  }

  function getDensityCap(key) {
    var cfg = _pdConfig();
    var caps = cfg.densityCaps || {};
    return caps[key] !== undefined ? caps[key] : null;
  }

  function checkDensityCeiling(bulletCount, occupancyPct, convergencePct) {
    if (!_pdEnabled()) return { exceeded: false, reason: 'disabled' };
    return _checkDensityCeilingInternal(bulletCount, occupancyPct, convergencePct);
  }

  // ============================================================
  // EXTENDED STATE GETTER — for debug overlay
  // ============================================================

  function getFullState() {
    var cfg = _pdConfig();
    var primaryPatterns = _pdState.activePatterns.filter(function (p) {
      return p.dominance === DOMINANCE.PRIMARY;
    });
    var supportPatterns = _pdState.activePatterns.filter(function (p) {
      return p.dominance === DOMINANCE.SUPPORT;
    });
    var utilityPatterns = _pdState.activePatterns.filter(function (p) {
      return p.dominance === DOMINANCE.UTILITY;
    });

    return {
      enabled: _pdEnabled(),
      classification: _pdClassificationEnabled(),
      auditing: _auditEnabled(),
      // Budget
      budget: _pdState.activeBudget,
      maxBudget: (cfg.budgetAudit || {}).maxThreatBudget || cfg.maxThreatBudget,
      softBudget: (cfg.budgetAudit || {}).softWarningBudget || 8,
      // Dominance
      dominantCount: _pdState.activeDominantCount,
      dominantMax: cfg.maxSimultaneousDominantPatterns,
      simultaneousPrimaryCount: _pdState.simultaneousPrimaryCount,
      // Patterns
      activePatterns: _pdState.activePatterns.slice(),
      primaryPatterns: primaryPatterns,
      supportPatterns: supportPatterns,
      utilityPatterns: utilityPatterns,
      dominantPattern: primaryPatterns.length > 0 ? primaryPatterns[0] : null,
      categoryCounts: Object.assign({}, _pdState.categoryCounts),
      // Density
      densityCheck: _pdState._lastDensityCheck || null,
      bulletCount: _pdState._lastBulletCount || 0,
      convergencePct: _pdState._lastConvergencePct || 0,
      activeDensityClass: _pdState.activeDensityClass,
      // Readability
      readabilityLoad: _pdState.readabilityLoad,
      readabilityMax: ((cfg.budgetAudit || {}).maxReadabilityLoad) || (cfg.readability || {}).maxLoad || 8,
      readabilitySoft: (cfg.budgetAudit || {}).softReadabilityWarning || 6,
      // Lane risk audit
      laneRiskScore: _pdState.laneRiskScore,
      highestLaneRisk: _pdState.highestLaneRisk,
      spaceControlCount: _pdState.spaceControlCount,
      highLaneRiskCount: _pdState.highLaneRiskCount,
      // Telegraph audit
      activeTelegraphCount: _pdState.activeTelegraphCount,
      telegraphOverlap: _pdState.telegraphOverlapDetected,
      missingTelegraphCount: _pdState.missingTelegraphCount,
      // Dangerous combo
      dangerousCombo: _pdState.dangerousCombo,
      // Accumulated
      totalActivations: _pdState.totalPatternActivations,
      patternFrequency: Object.assign({}, _pdState.patternFrequency),
      dominantHistory: _pdState.dominantPatternHistory.slice(-20),
      // History
      auditHistory: _pdState.auditHistory.slice(-60),
      // Warnings
      warnings: _pdState.warnings.slice(),
      // Config snapshot
      cfg: {
        preserveEscapeLanes: cfg.preserveEscapeLanes,
        allowDoublePrecision: cfg.allowDoublePrecisionThreats,
        telegraphSpacing: cfg.telegraphSpacingFrames,
        densityCaps: cfg.densityCaps
      }
    };
  }

  // ============================================================
  // TELEMETRY SNAPSHOT — for capture/debugging
  // ============================================================

  function getTelemetrySnapshot() {
    var st = getFullState();
    return {
      frame: _currentFrame(),
      budgetPct: st.maxBudget > 0 ? st.budget / st.maxBudget : 0,
      dominantPct: st.dominantMax > 0 ? st.dominantCount / st.dominantMax : 0,
      primaryCount: st.simultaneousPrimaryCount,
      bulletCount: st.bulletCount,
      densityClass: st.activeDensityClass,
      readabilityPct: st.readabilityMax > 0 ? st.readabilityLoad / st.readabilityMax : 0,
      warningCount: st.warnings.length,
      patternCount: st.activePatterns.length,
      dominantPatternId: st.dominantPattern ? st.dominantPattern.id : null,
      laneRiskMax: st.activePatterns.reduce(function (max, p) {
        var risks = { safe: 0, low: 1, medium: 2, high: 3 };
        return Math.max(max, risks[p.laneRisk] || 0);
      }, 0)
    };
  }

  // ============================================================
  // HC-PD-03: BUDGET AUDIT REPORT — structured audit output
  // ============================================================

  function getBudgetAudit() {
    var st = getFullState();
    return {
      frame: _currentFrame(),
      // Threat budget
      threatWeight: st.budget,
      threatWeightMax: st.maxBudget,
      threatWeightSoft: st.softBudget,
      budgetExceeded: st.budget >= st.maxBudget,
      budgetNearLimit: st.budget >= st.softBudget,
      // Readability
      readabilityLoad: st.readabilityLoad,
      readabilityMax: st.readabilityMax,
      readabilitySoft: st.readabilitySoft,
      readabilityOverloaded: st.readabilityLoad >= st.readabilityMax,
      readabilityNearLimit: st.readabilityLoad >= st.readabilitySoft,
      // Dominance
      primaryThreatCount: st.simultaneousPrimaryCount,
      supportThreatCount: st.supportPatterns ? st.supportPatterns.length : 0,
      utilityThreatCount: st.utilityPatterns ? st.utilityPatterns.length : 0,
      // Categories
      categoryCounts: st.categoryCounts,
      // Lane risk
      laneRiskScore: st.laneRiskScore,
      highestLaneRisk: st.highestLaneRisk,
      highLaneRiskCount: st.highLaneRiskCount,
      spaceControlCount: st.spaceControlCount,
      // Telegraph
      activeTelegraphs: st.activeTelegraphCount,
      telegraphOverlap: st.telegraphOverlap,
      missingTelegraphs: st.missingTelegraphCount,
      // Dangers
      dangerousCombo: st.dangerousCombo,
      // Warnings
      warnings: st.warnings,
      warningCount: st.warnings.length,
      // Cost per category
      precisionCost: (st.categoryCounts[CATEGORY.PRECISION] || 0),
      spaceControlCost: (st.categoryCounts[CATEGORY.SPACE_CONTROL] || 0),
      pressureCost: (st.categoryCounts[CATEGORY.PRESSURE] || 0),
      rhythmCost: (st.categoryCounts[CATEGORY.RHYTHM] || 0),
      escalationCost: (st.categoryCounts[CATEGORY.ESCALATION] || 0),
      // Quick summary
      summary: {
        ok: st.warnings.length === 0 && !st.budgetExceeded,
        critical: st.budget >= st.maxBudget || st.dangerousCombo !== null,
        tense: st.warnings.length > 0 && !st.dangerousCombo
      }
    };
  }

  // ================================================================
  // EXPORT — safe global namespace
  // ================================================================

  global.HC_PATTERN_REGISTRY = HC_PATTERN_REGISTRY;

  global.HC_PATTERN_DIRECTOR_INSTANCE = {
    // HC-PD-02: Core runtime classification
    getPatternDefinition: getPatternDefinition,
    getPatternWeight: getPatternWeight,
    getPatternCategory: getPatternCategory,
    isPrimaryThreat: isPrimaryThreat,
    requiresTelegraph: requiresTelegraph,
    getLaneRisk: getLaneRisk,
    getReadabilityCost: getReadabilityCost,
    getDensityClass: getDensityClass,
    getOverlapRisk: getOverlapRisk,
    getCooldownClass: getCooldownClass,
    getPatternTags: getPatternTags,
    registerPatternUsage: registerPatternUsage,
    registerPatternUsageResolved: registerPatternUsageResolved,
    resolvePatternId: _resolvePatternId,

    // HC-PD-01: Legacy hooks (preserved)
    requestPattern: requestPattern,
    canLayerPatterns: canLayerPatterns,
    reserveEscapeLane: reserveEscapeLane,
    getThreatBudget: getThreatBudget,
    registerTelegraph: registerTelegraph,
    getPatternClassification: getPatternClassification,
    getDensityCap: getDensityCap,
    checkDensityCeiling: checkDensityCeiling,
    updatePatternDirector: updatePatternDirector,

    // State & telemetry
    getState: getFullState,
    getTelemetrySnapshot: getTelemetrySnapshot,
    getBudgetAudit: getBudgetAudit,

    // Constants
    CLASS: CATEGORY,
    DOMINANCE: DOMINANCE,
    DENSITY_CLASS: DENSITY_CLASS,
    LANE_RISK: LANE_RISK,
    OVERLAP_RISK: OVERLAP_RISK
  };

  // Global aliases
  global.registerPatternUsage = registerPatternUsage;
  global.registerPatternUsageResolved = registerPatternUsageResolved;
  global.getPatternDefinition = getPatternDefinition;
  global.getPatternWeight = getPatternWeight;
  global.getPatternCategory = getPatternCategory;
  global.isPrimaryThreat = isPrimaryThreat;
  global.requiresTelegraph = requiresTelegraph;
  global.getLaneRisk = getLaneRisk;
  global.getReadabilityCost = getReadabilityCost;
  global.updatePatternDirector = updatePatternDirector;
  global.getPatternDirectorState = getFullState;

})(window);
