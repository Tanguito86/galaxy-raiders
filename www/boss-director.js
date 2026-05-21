// ==============================================
// GALAXY RAIDERS - boss-director.js
// HC-BD-01: Boss Director System Foundation
// TAXONOMY + CONSTANTS + HELPERS + VALIDATION
// NO runtime complejo. NO rompe nada existente.
// ==============================================

(function () {
  "use strict";

  // ============================================================
  // SECTION 1: BOSS ARCHETYPE TAXONOMY
  // ============================================================
  // Cada archetype define presion, movilidad, pacing,
  // fairness bias, recovery bias, estilo de telegraph y rage.
  // ============================================================

  var BOSS_ARCHETYPES = {
    DUELIST: {
      key: "duelist",
      label: "Duelist",
      description: "Direct combat. Predictable patterns with sharp punctuations. Fairness-first.",
      pressureStyle: "burst",
      mobilityStyle: "lateral_strafe",
      pacingStyle: "punctuated",
      fairnessBias: "high",
      recoveryBias: "long_after_burst",
      telegraphStyle: "directional_arrow",
      rageStyle: "faster_bursts"
    },
    SIEGE: {
      key: "siege",
      label: "Siege",
      description: "Static or slow-moving. Overwhelms with layered attacks. Arena control.",
      pressureStyle: "sustained_layered",
      mobilityStyle: "slow_drift",
      pacingStyle: "relentless_build",
      fairnessBias: "medium",
      recoveryBias: "rare_brief_pauses",
      telegraphStyle: "zone_warning",
      rageStyle: "denser_layers"
    },
    SWEEPER: {
      key: "sweeper",
      label: "Sweeper",
      description: "Wide lateral movement. Covers arena with horizontal denial. Rhythmic.",
      pressureStyle: "wave_sweep",
      mobilityStyle: "sinusoidal_patrol",
      pacingStyle: "rhythmic",
      fairnessBias: "medium",
      recoveryBias: "wave_trough",
      telegraphStyle: "lane_indicator",
      rageStyle: "faster_sweep_amplitude"
    },
    TRAPPER: {
      key: "trapper",
      label: "Trapper",
      description: "Deploys hazards. Controls space through denial. Punishes positioning.",
      pressureStyle: "area_denial",
      mobilityStyle: "evasive_reposition",
      pacingStyle: "trap_harvest",
      fairnessBias: "high",
      recoveryBias: "post_deploy_silence",
      telegraphStyle: "hazard_marker",
      rageStyle: "more_traps_faster_deploy"
    },
    ORBITAL: {
      key: "orbital",
      label: "Orbital",
      description: "Circular/elliptical movement. Attacks from all angles. Surround pressure.",
      pressureStyle: "surround_constrict",
      mobilityStyle: "elliptical_orbit",
      pacingStyle: "cyclic",
      fairnessBias: "medium",
      recoveryBias: "orbit_apex",
      telegraphStyle: "radial_ring",
      rageStyle: "tighter_orbit_faster_pulse"
    },
    HUNTER: {
      key: "hunter",
      label: "Hunter",
      description: "Aggressively tracks player. Charges, retreats, re-engages. Chase fantasy.",
      pressureStyle: "chase_burst",
      mobilityStyle: "charge_retreat_cycle",
      pacingStyle: "dramatic_loop",
      fairnessBias: "medium",
      recoveryBias: "post_charge_retreat",
      telegraphStyle: "charge_indicator",
      rageStyle: "multi_charge_chains"
    },
    BULWARK: {
      key: "bulwark",
      label: "Bulwark",
      description: "Heavy, slow, durable. Absorbs damage. Punishes greed with counter-fire.",
      pressureStyle: "counter_threat",
      mobilityStyle: "slow_push",
      pacingStyle: "grind",
      fairnessBias: "low",
      recoveryBias: "stagger_on_hit",
      telegraphStyle: "threat_glow",
      rageStyle: "faster_counter_response"
    },
    REACTOR: {
      key: "reactor",
      label: "Reactor",
      description: "Changes behavior based on player actions. Adaptive. Unpredictable pacing.",
      pressureStyle: "adaptive_reactive",
      mobilityStyle: "contextual",
      pacingStyle: "player_driven",
      fairnessBias: "medium",
      recoveryBias: "adaptive_breathing",
      telegraphStyle: "context_telegraph",
      rageStyle: "faster_reactions_more_states"
    },
    SPLITTER: {
      key: "splitter",
      label: "Splitter",
      description: "Splits into sub-entities. Multiple threat sources. Fragmentation pressure.",
      pressureStyle: "fragmentation",
      mobilityStyle: "multi_entity",
      pacingStyle: "swarm_cycle",
      fairnessBias: "low",
      recoveryBias: "merge_phase",
      telegraphStyle: "split_warning",
      rageStyle: "more_fragments_faster_cycle"
    },
    EXECUTIONER: {
      key: "executioner",
      label: "Executioner",
      description: "Final boss archetype. Varied attack suite. Dramatic escalation. Rage finale.",
      pressureStyle: "multidirectional_dominant",
      mobilityStyle: "phased_evolution",
      pacingStyle: "dramatic_arc",
      fairnessBias: "low",
      recoveryBias: "phase_transition_only",
      telegraphStyle: "imperial_glow",
      rageStyle: "ultimate_desperation_mode"
    }
  };

  // Index de archetypes por key para lookup rapido
  var BOSS_ARCHETYPE_KEYS = {};
  (function () {
    var keys = Object.keys(BOSS_ARCHETYPES);
    for (var i = 0; i < keys.length; i++) {
      var a = BOSS_ARCHETYPES[keys[i]];
      if (a && a.key) {
        BOSS_ARCHETYPE_KEYS[a.key] = a;
      }
    }
  })();

  // ============================================================
  // SECTION 2: PHASE TAXONOMY
  // ============================================================
  // Tipos de fase que un boss puede transitar.
  // No todas requieren implementacion inmediata.
  // ============================================================

  var BOSS_PHASE_TYPES = {
    introduction: {
      key: "introduction",
      label: "Introduction",
      description: "Boss entrance. Establishes identity. Low threat. Player learns the boss.",
      threatLevel: "low",
      durationHint: "short",
      purpose: "establish_identity",
      requiresRecovery: false
    },
    pressure: {
      key: "pressure",
      label: "Pressure",
      description: "Sustained threat. Main combat loop. Player must engage actively.",
      threatLevel: "medium",
      durationHint: "variable",
      purpose: "sustain_combat",
      requiresRecovery: false
    },
    crossfire: {
      key: "crossfire",
      label: "Crossfire",
      description: "Multiple angles of attack. Forces positional awareness. Lane pressure.",
      threatLevel: "high",
      durationHint: "medium",
      purpose: "test_positioning",
      requiresRecovery: true
    },
    area_denial: {
      key: "area_denial",
      label: "Area Denial",
      description: "Boss restricts safe zones. Player must navigate hazards. Spatial puzzle.",
      threatLevel: "high",
      durationHint: "medium",
      purpose: "deny_space",
      requiresRecovery: true
    },
    chase: {
      key: "chase",
      label: "Chase",
      description: "Boss actively pursues player. High intensity. Reflex test.",
      threatLevel: "high",
      durationHint: "short",
      purpose: "test_reflexes",
      requiresRecovery: true
    },
    recovery: {
      key: "recovery",
      label: "Recovery",
      description: "Intentional breathing room. Player can reposition and reset. No attacks.",
      threatLevel: "none",
      durationHint: "short",
      purpose: "provide_breathing_room",
      requiresRecovery: false
    },
    transition: {
      key: "transition",
      label: "Transition",
      description: "Phase change sequence. Visual + audio spectacle. Brief invulnerability.",
      threatLevel: "none",
      durationHint: "short",
      purpose: "signal_phase_change",
      requiresRecovery: false
    },
    desperation: {
      key: "desperation",
      label: "Desperation",
      description: "Boss at low HP. Patterns become erratic. Higher risk, higher tension.",
      threatLevel: "very_high",
      durationHint: "until_death",
      purpose: "increase_tension",
      requiresRecovery: false
    },
    rage: {
      key: "rage",
      label: "Rage",
      description: "Ultimate form. New attacks. Faster pacing. Signature finale sequence.",
      threatLevel: "maximum",
      durationHint: "variable",
      purpose: "dramatic_climax",
      requiresRecovery: false
    },
    finale: {
      key: "finale",
      label: "Finale",
      description: "Death sequence. Boss destruction spectacle. Reward delivery.",
      threatLevel: "none",
      durationHint: "short",
      purpose: "reward_delivery",
      requiresRecovery: false
    }
  };

  // ============================================================
  // SECTION 2B: PHASE HELPERS
  // ============================================================

  function isRecoveryPhase(phaseType) {
    if (!phaseType) return false;
    var pt = (typeof phaseType === "string") ? phaseType : (phaseType.key || "");
    return pt === "recovery" || pt === "transition";
  }

  function isPressurePhase(phaseType) {
    if (!phaseType) return false;
    var pt = (typeof phaseType === "string") ? phaseType : (phaseType.key || "");
    return pt === "pressure" || pt === "crossfire" || pt === "area_denial" || pt === "chase";
  }

  function isRagePhase(phaseType) {
    if (!phaseType) return false;
    var pt = (typeof phaseType === "string") ? phaseType : (phaseType.key || "");
    return pt === "rage" || pt === "desperation";
  }

  function isThreatPhase(phaseType) {
    if (!phaseType) return false;
    return isPressurePhase(phaseType) || isRagePhase(phaseType);
  }

  function isSafePhase(phaseType) {
    if (!phaseType) return false;
    return isRecoveryPhase(phaseType);
  }

  // ============================================================
  // SECTION 3: SIGNATURE ATTACK TAXONOMY
  // ============================================================
  // Categorias de ataques memorables. Solo definicion y helpers.
  // NO implementacion de ataques todavia.
  // ============================================================

  var BOSS_SIGNATURE_TYPES = {
    aimedBurst: {
      key: "aimedBurst",
      label: "Aimed Burst",
      description: "Delayed aimed burst toward player. Telegraph + player tracking.",
      category: "precision",
      requiresTelegraph: true,
      minTelegraphMs: 350,
      recoveryAfter: true,
      archetypeFit: ["duelist", "hunter"]
    },
    rotatingFan: {
      key: "rotatingFan",
      label: "Rotating Fan",
      description: "Rotating spread fan. Creates spiral or oscillating bullet walls.",
      category: "space_control",
      requiresTelegraph: true,
      minTelegraphMs: 400,
      recoveryAfter: true,
      archetypeFit: ["sweeper", "orbital"]
    },
    suppressionWall: {
      key: "suppressionWall",
      label: "Suppression Wall",
      description: "Dense bullet wall from one direction. Forces reposition. Zone denial.",
      category: "space_control",
      requiresTelegraph: true,
      minTelegraphMs: 500,
      recoveryAfter: true,
      archetypeFit: ["siege", "bulwark"]
    },
    orbitalPressure: {
      key: "orbitalPressure",
      label: "Orbital Pressure",
      description: "Bullets from multiple angles simultaneously. Surround threat.",
      category: "pressure",
      requiresTelegraph: true,
      minTelegraphMs: 450,
      recoveryAfter: true,
      archetypeFit: ["orbital", "executioner"]
    },
    laserSweep: {
      key: "laserSweep",
      label: "Laser Sweep",
      description: "Continuous beam or fast column that sweeps across arena.",
      category: "precision",
      requiresTelegraph: true,
      minTelegraphMs: 400,
      recoveryAfter: true,
      archetypeFit: ["orbital", "executioner"]
    },
    pincerFire: {
      key: "pincerFire",
      label: "Pincer Fire",
      description: "Simultaneous attacks from both sides. Lateral closure on player.",
      category: "space_control",
      requiresTelegraph: true,
      minTelegraphMs: 350,
      recoveryAfter: true,
      archetypeFit: ["duelist", "hunter"]
    },
    delayedTrap: {
      key: "delayedTrap",
      label: "Delayed Trap",
      description: "Deploys hazards that activate after delay. Area denial with warning.",
      category: "space_control",
      requiresTelegraph: true,
      minTelegraphMs: 500,
      recoveryAfter: false,
      archetypeFit: ["trapper", "siege"]
    },
    phaseBurst: {
      key: "phaseBurst",
      label: "Phase Burst",
      description: "Radial burst at phase transition. Spectacle. High telegraph.",
      category: "escalation",
      requiresTelegraph: true,
      minTelegraphMs: 800,
      recoveryAfter: false,
      archetypeFit: ["all"]
    },
    arenaSplit: {
      key: "arenaSplit",
      label: "Arena Split",
      description: "Divides arena into safe/danger zones. Player must choose position.",
      category: "space_control",
      requiresTelegraph: true,
      minTelegraphMs: 600,
      recoveryAfter: true,
      archetypeFit: ["executioner", "siege"]
    },
    escapeBait: {
      key: "escapeBait",
      label: "Escape Bait",
      description: "Creates apparent escape route that closes. Mind-game attack.",
      category: "pressure",
      requiresTelegraph: true,
      minTelegraphMs: 300,
      recoveryAfter: true,
      archetypeFit: ["hunter", "executioner", "trapper"]
    }
  };

  // ============================================================
  // SECTION 4: BOSS ORCHESTRATION RULES (documentadas)
  // ============================================================
  // Reglas hardcore que TODO boss debe seguir.
  // No son runtime enforcement todavia. Son contrato de diseno.
  // ============================================================

  var BOSS_ORCHESTRATION_RULES = {
    // HC-BD-R01: No unreadable overlap
    noUnreadableOverlap: {
      rule: "Nunca ejecutar dos ataques de alta densidad simultaneamente sin telegraph separado.",
      rationale: "El jugador debe poder leer cada amenaza individualmente.",
      enforcement: "design_time",
      severity: "hard"
    },

    // HC-BD-R02: Mandatory escape routes
    mandatoryEscapeRoutes: {
      rule: "Todo ataque de area-denial debe dejar al menos una ruta de escape visible.",
      rationale: "Sin salida = muerte injusta. La ruta puede ser estrecha pero debe existir.",
      enforcement: "design_time",
      severity: "hard"
    },

    // HC-BD-R03: Recovery windows required
    recoveryWindowsRequired: {
      rule: "Despues de cada ataque de alta amenaza (crossfire, chase, area_denial), el boss debe ofrecer una ventana de recuperacion minima de 800ms.",
      rationale: "El jugador necesita respirar. Sin recuperacion = fatiga injusta.",
      enforcement: "design_time",
      severity: "hard",
      minRecoveryMs: 800
    },

    // HC-BD-R04: Rage readability preserved
    rageReadabilityPreserved: {
      rule: "Durante rage/desperation, los telegraphs deben ser igual o mas visibles que en fases normales. NO oscurecer telegraphs con FX de rage.",
      rationale: "En el momento de maxima tension, la claridad es mas importante que nunca.",
      enforcement: "design_time",
      severity: "hard"
    },

    // HC-BD-R05: No instant unfair transitions
    noInstantUnfairTransitions: {
      rule: "Un boss no puede transicionar de un ataque de alta amenaza a otro sin ventana de recuperacion. Transiciones deben ser anunciadas.",
      rationale: "El cambio de fase no debe ser una trampa. El jugador debe verlo venir.",
      enforcement: "design_time",
      severity: "hard"
    },

    // HC-BD-R06: No fake difficulty
    noFakeDifficulty: {
      rule: "Nunca usar RNG puro para decidir si un ataque es esquiviable. Toda situacion debe tener solucion posicional o temporal.",
      rationale: "La dificultad debe venir del diseno, no del azar. Muerte por RNG = fake difficulty.",
      enforcement: "design_time",
      severity: "hard"
    },

    // HC-BD-R07: No permanent arena denial
    noPermanentArenaDenial: {
      rule: "Ningun hazard debe ocupar mas del 60% del arena por mas de 3 segundos. Las zonas denegadas deben rotar o desaparecer.",
      rationale: "Arena denial permanente obliga al jugador a una unica posicion fija = aburrido.",
      enforcement: "design_time",
      severity: "medium",
      maxArenaCoverage: 0.60,
      maxDenialDurationMs: 3000
    },

    // HC-BD-R08: Telegraph must precede threat
    telegraphPrecedesThreat: {
      rule: "Todo ataque boss con densidad > 4 balas debe tener telegraph que preceda la amenaza por al menos 200ms.",
      rationale: "El telegraph es el contrato de justicia. Sin el, el jugador no puede anticipar.",
      enforcement: "design_time",
      severity: "hard",
      minTelegraphLeadMs: 200
    },

    // HC-BD-R09: Phase transition safety
    phaseTransitionSafety: {
      rule: "Durante una transicion de fase, el boss no debe generar nuevas amenazas. Las amenazas existentes deben resolverse naturalmente.",
      rationale: "La transicion es un momento de respiro y espectaculo. No debe castigar al jugador.",
      enforcement: "design_time",
      severity: "hard"
    },

    // HC-BD-R10: Archetype consistency
    archetypeConsistency: {
      rule: "Un boss debe mantener consistencia con su archetype asignado. No mezclar comportamientos de archetypes opuestos sin justificacion de fase.",
      rationale: "La identidad del boss viene del archetype. Romperla confunde al jugador.",
      enforcement: "design_time",
      severity: "medium"
    }
  };

  // ============================================================
  // SECTION 5: CONFIG DEFAULTS (bossDirector section)
  // ============================================================

  var BOSS_DIRECTOR_CONFIG_DEFAULTS = {
    enableBossDirector: false,
    enableBossTelemetry: false,
    enableBossRecoveryRules: false,
    enableBossFairnessValidation: false,
    enableBossTransitions: false,
    enableBossRageRules: false
  };

  // ============================================================
  // SECTION 6: VALIDATORS
  // ============================================================

  function validateBossArchetype(archetypeKey) {
    if (!archetypeKey || typeof archetypeKey !== "string") return null;
    var upperKey = archetypeKey.toUpperCase();
    if (BOSS_ARCHETYPES.hasOwnProperty(upperKey)) return BOSS_ARCHETYPES[upperKey];

    // Try key match
    if (BOSS_ARCHETYPE_KEYS.hasOwnProperty(archetypeKey)) return BOSS_ARCHETYPE_KEYS[archetypeKey];
    if (BOSS_ARCHETYPE_KEYS.hasOwnProperty(archetypeKey.toLowerCase())) return BOSS_ARCHETYPE_KEYS[archetypeKey.toLowerCase()];

    return null; // invalid — caller must fallback
  }

  function validateBossPhaseType(phaseKey) {
    if (!phaseKey || typeof phaseKey !== "string") return null;
    if (BOSS_PHASE_TYPES.hasOwnProperty(phaseKey)) return BOSS_PHASE_TYPES[phaseKey];

    // Try key match inside phase objects
    var keys = Object.keys(BOSS_PHASE_TYPES);
    for (var i = 0; i < keys.length; i++) {
      var pt = BOSS_PHASE_TYPES[keys[i]];
      if (pt && pt.key === phaseKey) return pt;
    }

    return null; // invalid — caller must fallback
  }

  function validateBossSignatureType(signatureKey) {
    if (!signatureKey || typeof signatureKey !== "string") return null;
    if (BOSS_SIGNATURE_TYPES.hasOwnProperty(signatureKey)) return BOSS_SIGNATURE_TYPES[signatureKey];

    // Try key match inside signature objects
    var keys = Object.keys(BOSS_SIGNATURE_TYPES);
    for (var i = 0; i < keys.length; i++) {
      var st = BOSS_SIGNATURE_TYPES[keys[i]];
      if (st && st.key === signatureKey) return st;
    }

    return null; // invalid — caller must fallback
  }

  // ============================================================
  // SECTION 7: SAFE GETTERS / ACCESSORS
  // ============================================================

  function getBossDirectorConfig() {
    var cfg = window.GALAXY_CONFIG;
    if (!cfg || !cfg.bossDirector || typeof cfg.bossDirector !== "object") {
      return BOSS_DIRECTOR_CONFIG_DEFAULTS;
    }
    var bd = cfg.bossDirector;
    return {
      enableBossDirector: !!(typeof bd.enableBossDirector === "boolean" ? bd.enableBossDirector : BOSS_DIRECTOR_CONFIG_DEFAULTS.enableBossDirector),
      enableBossTelemetry: !!(typeof bd.enableBossTelemetry === "boolean" ? bd.enableBossTelemetry : BOSS_DIRECTOR_CONFIG_DEFAULTS.enableBossTelemetry),
      enableBossRecoveryRules: !!(typeof bd.enableBossRecoveryRules === "boolean" ? bd.enableBossRecoveryRules : BOSS_DIRECTOR_CONFIG_DEFAULTS.enableBossRecoveryRules),
      enableBossFairnessValidation: !!(typeof bd.enableBossFairnessValidation === "boolean" ? bd.enableBossFairnessValidation : BOSS_DIRECTOR_CONFIG_DEFAULTS.enableBossFairnessValidation),
      enableBossTransitions: !!(typeof bd.enableBossTransitions === "boolean" ? bd.enableBossTransitions : BOSS_DIRECTOR_CONFIG_DEFAULTS.enableBossTransitions),
      enableBossRageRules: !!(typeof bd.enableBossRageRules === "boolean" ? bd.enableBossRageRules : BOSS_DIRECTOR_CONFIG_DEFAULTS.enableBossRageRules)
    };
  }

  function isBossDirectorEnabled() {
    var cfg = getBossDirectorConfig();
    return cfg.enableBossDirector === true;
  }

  function isBossTelemetryEnabled() {
    var cfg = getBossDirectorConfig();
    return cfg.enableBossDirector === true && cfg.enableBossTelemetry === true;
  }

  function getBossArchetypeByKey(key) {
    return validateBossArchetype(key);
  }

  function getBossPhaseTypeByKey(key) {
    return validateBossPhaseType(key);
  }

  function getBossSignatureTypeByKey(key) {
    return validateBossSignatureType(key);
  }

  function getAllBossArchetypes() {
    var arr = [];
    var keys = Object.keys(BOSS_ARCHETYPES);
    for (var i = 0; i < keys.length; i++) {
      arr.push(BOSS_ARCHETYPES[keys[i]]);
    }
    return arr;
  }

  function getAllBossPhaseTypes() {
    var arr = [];
    var keys = Object.keys(BOSS_PHASE_TYPES);
    for (var i = 0; i < keys.length; i++) {
      arr.push(BOSS_PHASE_TYPES[keys[i]]);
    }
    return arr;
  }

  function getAllBossSignatureTypes() {
    var arr = [];
    var keys = Object.keys(BOSS_SIGNATURE_TYPES);
    for (var i = 0; i < keys.length; i++) {
      arr.push(BOSS_SIGNATURE_TYPES[keys[i]]);
    }
    return arr;
  }

  function getBossOrchestrationRules() {
    return BOSS_ORCHESTRATION_RULES;
  }

  function getOrchestrationRule(ruleKey) {
    if (!ruleKey) return null;
    return BOSS_ORCHESTRATION_RULES[ruleKey] || null;
  }

  // ============================================================
  // SECTION 8: HELPER — current boss archetype resolver
  // ============================================================

  function resolveCurrentBossArchetype(targetBoss) {
    var b = targetBoss || (typeof boss !== "undefined" ? boss : null);
    if (!b || !b.pattern) return null;

    var mapping = {
      crossfire: "DUELIST",
      zigzag: "SWEEPER",
      rotate: "ORBITAL",
      divebomb: "HUNTER",
      supreme: "EXECUTIONER"
    };

    var archKey = mapping[b.pattern];
    if (!archKey) return null;
    return BOSS_ARCHETYPES[archKey] || null;
  }

  function getDefaultPhaseTypeForCurrentPhase(targetBoss) {
    var b = targetBoss || (typeof boss !== "undefined" ? boss : null);
    if (!b || typeof b.phase !== "number") return "pressure";

    // Phase-based mapping for current boss implementation
    if (b.phase === 1) return "pressure";
    if (b.phase === 2) return "crossfire";
    if (b.phase === 3) return "desperation";
    return "pressure";
  }

  // ============================================================
  // SECTION 9: COMPATIBILITY — never break existing bosses
  // ============================================================

  function getCompatibleBossArchetype(targetBoss, requestedArchetype) {
    // Always returns a valid archetype.
    // If requested is valid, use it.
    // If not, resolve from current boss.
    // If that fails, fallback to DUELIST (safest).
    var validated = validateBossArchetype(requestedArchetype);
    if (validated) return validated;

    var resolved = resolveCurrentBossArchetype(targetBoss);
    if (resolved) return resolved;

    return BOSS_ARCHETYPES.DUELIST; // ultimate fallback
  }

  function getCompatiblePhaseType(targetBoss, requestedPhaseType) {
    var validated = validateBossPhaseType(requestedPhaseType);
    if (validated) return validated;

    var defaultType = getDefaultPhaseTypeForCurrentPhase(targetBoss);
    return BOSS_PHASE_TYPES[defaultType] || BOSS_PHASE_TYPES.pressure;
  }

  function getCompatibleSignatureType(requestedSignatureType) {
    var validated = validateBossSignatureType(requestedSignatureType);
    if (validated) return validated;

    return BOSS_SIGNATURE_TYPES.aimedBurst; // ultimate fallback
  }

  // ============================================================
  // SECTION 10: TELEMETRY STUB (no runtime yet)
  // ============================================================

  var _bossTelemetryBuffer = [];
  var _bossTelemetryMaxSize = 120;

  function recordBossDirectorEvent(eventType, data) {
    if (!isBossTelemetryEnabled()) return false;
    _bossTelemetryBuffer.push({
      type: eventType,
      data: data || {},
      time: typeof globalTime === "number" ? globalTime : 0,
      frame: typeof frameCount === "number" ? frameCount : 0
    });
    if (_bossTelemetryBuffer.length > _bossTelemetryMaxSize) {
      _bossTelemetryBuffer.shift();
    }
    return true;
  }

  function getBossTelemetrySnapshot() {
    return {
      events: _bossTelemetryBuffer.slice(),
      count: _bossTelemetryBuffer.length,
      directorEnabled: isBossDirectorEnabled()
    };
  }

  function clearBossTelemetry() {
    _bossTelemetryBuffer = [];
  }

  // ============================================================
  // SECTION 11: EXPORT TO WINDOW
  // ============================================================

  // Taxonomy exports
  window.BOSS_ARCHETYPES = BOSS_ARCHETYPES;
  window.BOSS_PHASE_TYPES = BOSS_PHASE_TYPES;
  window.BOSS_SIGNATURE_TYPES = BOSS_SIGNATURE_TYPES;
  window.BOSS_ORCHESTRATION_RULES = BOSS_ORCHESTRATION_RULES;

  // Validator exports
  window.validateBossArchetype = validateBossArchetype;
  window.validateBossPhaseType = validateBossPhaseType;
  window.validateBossSignatureType = validateBossSignatureType;

  // Phase helper exports
  window.isRecoveryPhase = isRecoveryPhase;
  window.isPressurePhase = isPressurePhase;
  window.isRagePhase = isRagePhase;
  window.isThreatPhase = isThreatPhase;
  window.isSafePhase = isSafePhase;

  // Config exports
  window.BOSS_DIRECTOR_CONFIG_DEFAULTS = BOSS_DIRECTOR_CONFIG_DEFAULTS;
  window.getBossDirectorConfig = getBossDirectorConfig;
  window.isBossDirectorEnabled = isBossDirectorEnabled;
  window.isBossTelemetryEnabled = isBossTelemetryEnabled;

  // Getter exports
  window.getBossArchetypeByKey = getBossArchetypeByKey;
  window.getBossPhaseTypeByKey = getBossPhaseTypeByKey;
  window.getBossSignatureTypeByKey = getBossSignatureTypeByKey;
  window.getAllBossArchetypes = getAllBossArchetypes;
  window.getAllBossPhaseTypes = getAllBossPhaseTypes;
  window.getAllBossSignatureTypes = getAllBossSignatureTypes;
  window.getBossOrchestrationRules = getBossOrchestrationRules;
  window.getOrchestrationRule = getOrchestrationRule;

  // Resolver exports
  window.resolveCurrentBossArchetype = resolveCurrentBossArchetype;
  window.getDefaultPhaseTypeForCurrentPhase = getDefaultPhaseTypeForCurrentPhase;

  // Compatibility exports
  window.getCompatibleBossArchetype = getCompatibleBossArchetype;
  window.getCompatiblePhaseType = getCompatiblePhaseType;
  window.getCompatibleSignatureType = getCompatibleSignatureType;

  // Telemetry exports
  window.recordBossDirectorEvent = recordBossDirectorEvent;
  window.getBossTelemetrySnapshot = getBossTelemetrySnapshot;
  window.clearBossTelemetry = clearBossTelemetry;

})();
