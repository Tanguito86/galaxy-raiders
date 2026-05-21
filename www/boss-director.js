// ==============================================
// GALAXY RAIDERS - boss-director.js
// HC-BD-01: Boss Director System Foundation
// HC-BD-02: Boss Profile Mapping & Identity Matrix
// HC-BD-03: Boss Phase Orchestration Runtime Foundation
// TAXONOMY + PROFILES + STATE MACHINE + LIFECYCLE
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
  // SECTION 11: BOSS DIRECTOR PROFILES (HC-BD-02)
  // ============================================================
  // Perfiles runtime por boss. Conectan nombre/pattern real
  // con identidad hardcore oficial. Solo lectura.
  // ============================================================

  var BOSS_DIRECTOR_PROFILES = {
    crabtron: {
      bossId: 1,
      displayName: "CRABTRON",
      pattern: "crossfire",
      level: 5,

      archetype: "DUELIST",

      pressureStyle: "burst",
      mobilityStyle: "lateral_strafe",
      pacingStyle: "punctuated",
      rageStyle: "faster_bursts",
      telegraphStyle: "directional_arrow",

      primarySignature: "pincerFire",
      secondarySignature: "aimedBurst",

      recoveryBias: "long_after_burst",
      fairnessBias: "high",

      weaknessReadability: "Phase 1 generic aimed-spread — lacks identity",
      transitionStyle: "dash_telegraph_directional_arrow",

      phasePlan: [
        "introduction",
        "pressure",
        "recovery",
        "crossfire",
        "transition",
        "desperation",
        "finale"
      ],

      signaturePlan: {
        intro: "aimedBurst",
        main: "pincerFire",
        rage: "pincerFire"
      }
    },

    serpentrix: {
      bossId: 2,
      displayName: "SERPENTRIX",
      pattern: "zigzag",
      level: 10,

      archetype: "SWEEPER",

      pressureStyle: "wave_sweep",
      mobilityStyle: "sinusoidal_patrol",
      pacingStyle: "rhythmic",
      rageStyle: "faster_sweep_amplitude",
      telegraphStyle: "lane_indicator",

      primarySignature: "rotatingFan",
      secondarySignature: "delayedTrap",

      recoveryBias: "wave_trough",
      fairnessBias: "medium",

      weaknessReadability: "Mines lack pre-landing telegraph — player tracks drift",
      transitionStyle: "wave_crescendo_expanding_fan",

      phasePlan: [
        "introduction",
        "pressure",
        "recovery",
        "area_denial",
        "transition",
        "desperation",
        "finale"
      ],

      signaturePlan: {
        intro: "rotatingFan",
        main: "delayedTrap",
        rage: "rotatingFan"
      }
    },

    orbital: {
      bossId: 3,
      displayName: "ORBITAL",
      pattern: "rotate",
      level: 15,

      archetype: "ORBITAL",

      pressureStyle: "surround_constrict",
      mobilityStyle: "elliptical_orbit",
      pacingStyle: "cyclic",
      rageStyle: "tighter_orbit_faster_pulse",
      telegraphStyle: "radial_ring",

      primarySignature: "orbitalPressure",
      secondarySignature: "laserSweep",

      recoveryBias: "orbit_apex",
      fairnessBias: "medium",

      weaknessReadability: "Tractor beam vertical column narrow — relies on ground telegraph",
      transitionStyle: "pulse_expansion_ring_flash",

      phasePlan: [
        "introduction",
        "pressure",
        "recovery",
        "crossfire",
        "transition",
        "rage",
        "finale"
      ],

      signaturePlan: {
        intro: "orbitalPressure",
        main: "laserSweep",
        rage: "phaseBurst"
      }
    },

    teniente: {
      bossId: 4,
      displayName: "TENIENTE",
      pattern: "divebomb",
      level: 19,

      archetype: "HUNTER",

      pressureStyle: "chase_burst",
      mobilityStyle: "charge_retreat_cycle",
      pacingStyle: "dramatic_loop",
      rageStyle: "multi_charge_chains",
      telegraphStyle: "charge_indicator",

      primarySignature: "pincerFire",
      secondarySignature: "escapeBait",

      recoveryBias: "post_charge_retreat",
      fairnessBias: "medium",

      weaknessReadability: "All 3 phases use same downward-spread shape — lacks variation",
      transitionStyle: "charge_impact_warning_rings",

      phasePlan: [
        "introduction",
        "pressure",
        "chase",
        "recovery",
        "crossfire",
        "transition",
        "rage",
        "finale"
      ],

      signaturePlan: {
        intro: "aimedBurst",
        main: "pincerFire",
        rage: "escapeBait"
      }
    },

    emperador: {
      bossId: 5,
      displayName: "EMPERADOR",
      pattern: "supreme",
      level: 20,

      archetype: "EXECUTIONER",

      pressureStyle: "multidirectional_dominant",
      mobilityStyle: "phased_evolution",
      pacingStyle: "dramatic_arc",
      rageStyle: "ultimate_desperation_mode",
      telegraphStyle: "imperial_glow",

      primarySignature: "arenaSplit",
      secondarySignature: "orbitalPressure",

      recoveryBias: "phase_transition_only",
      fairnessBias: "low",

      weaknessReadability: "Teleport shockwave un-telegraphed — 0-frame reaction needed",
      transitionStyle: "teleport_destination_glow_purple",

      phasePlan: [
        "introduction",
        "pressure",
        "crossfire",
        "transition",
        "area_denial",
        "transition",
        "rage",
        "finale"
      ],

      signaturePlan: {
        intro: "orbitalPressure",
        main: "arenaSplit",
        rage: "phaseBurst"
      }
    }
  };

  // Indice de lookup rapido por pattern y por bossId
  var BOSS_PROFILE_BY_PATTERN = {};
  var BOSS_PROFILE_BY_ID = {};
  (function () {
    var keys = Object.keys(BOSS_DIRECTOR_PROFILES);
    for (var i = 0; i < keys.length; i++) {
      var p = BOSS_DIRECTOR_PROFILES[keys[i]];
      if (p && p.pattern) {
        BOSS_PROFILE_BY_PATTERN[p.pattern] = p;
      }
      if (p && typeof p.bossId === "number") {
        BOSS_PROFILE_BY_ID[p.bossId] = p;
      }
    }
  })();

  // ============================================================
  // SECTION 12: DEFAULT / FALLBACK PROFILE
  // ============================================================

  var DEFAULT_BOSS_DIRECTOR_PROFILE = {
    bossId: -1,
    displayName: "UNKNOWN BOSS",
    pattern: "unknown",
    level: 0,

    archetype: "DUELIST",

    pressureStyle: "burst",
    mobilityStyle: "lateral_strafe",
    pacingStyle: "punctuated",
    rageStyle: "faster_bursts",
    telegraphStyle: "directional_arrow",

    primarySignature: "aimedBurst",
    secondarySignature: "aimedBurst",

    recoveryBias: "long_after_burst",
    fairnessBias: "high",

    weaknessReadability: "Unknown boss — no identity data",
    transitionStyle: "default",

    phasePlan: [
      "pressure",
      "desperation",
      "finale"
    ],

    signaturePlan: {
      intro: "aimedBurst",
      main: "aimedBurst",
      rage: "aimedBurst"
    }
  };

  // ============================================================
  // SECTION 13: PROFILE HELPERS
  // ============================================================

  function getBossDirectorProfile(bossNameOrType) {
    if (!bossNameOrType) {
      return DEFAULT_BOSS_DIRECTOR_PROFILE;
    }

    var key = (typeof bossNameOrType === "string") ? bossNameOrType.toLowerCase() : "";

    // Try direct name match (e.g. "crabtron", "CRABTRON", "Crabtron")
    if (BOSS_DIRECTOR_PROFILES.hasOwnProperty(key)) {
      return BOSS_DIRECTOR_PROFILES[key];
    }

    // Try pattern match (e.g. "crossfire", "supreme")
    if (BOSS_PROFILE_BY_PATTERN.hasOwnProperty(key)) {
      return BOSS_PROFILE_BY_PATTERN[key];
    }

    // If a boss object was passed, resolve from its pattern/name
    if (typeof bossNameOrType === "object" && bossNameOrType !== null) {
      var b = bossNameOrType;

      // Try pattern first (most reliable)
      if (b.pattern && BOSS_PROFILE_BY_PATTERN.hasOwnProperty(b.pattern)) {
        return BOSS_PROFILE_BY_PATTERN[b.pattern];
      }

      // Try name
      if (b.name) {
        var nameKey = (typeof b.name === "string") ? b.name.toLowerCase() : "";
        if (BOSS_DIRECTOR_PROFILES.hasOwnProperty(nameKey)) {
          return BOSS_DIRECTOR_PROFILES[nameKey];
        }
      }

      // Try bossId from HARDCORE_BOSS_REGISTRY
      if (typeof window.getHardcoreBossId === "function") {
        var id = window.getHardcoreBossId(b);
        if (id > 0 && BOSS_PROFILE_BY_ID.hasOwnProperty(id)) {
          return BOSS_PROFILE_BY_ID[id];
        }
      }
    }

    // Try numeric bossId
    if (typeof bossNameOrType === "number") {
      if (BOSS_PROFILE_BY_ID.hasOwnProperty(bossNameOrType)) {
        return BOSS_PROFILE_BY_ID[bossNameOrType];
      }
    }

    // Ultimate fallback
    return DEFAULT_BOSS_DIRECTOR_PROFILE;
  }

  function getBossArchetype(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    var archetypeKey = (profile && profile.archetype) ? profile.archetype : "DUELIST";
    return BOSS_ARCHETYPES[archetypeKey] || BOSS_ARCHETYPES.DUELIST;
  }

  function getBossPrimarySignature(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    var sigKey = (profile && profile.primarySignature) ? profile.primarySignature : "aimedBurst";
    return BOSS_SIGNATURE_TYPES[sigKey] || BOSS_SIGNATURE_TYPES.aimedBurst;
  }

  function getBossSecondarySignature(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    var sigKey = (profile && profile.secondarySignature) ? profile.secondarySignature : "aimedBurst";
    return BOSS_SIGNATURE_TYPES[sigKey] || BOSS_SIGNATURE_TYPES.aimedBurst;
  }

  function getBossPhasePlan(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    return (profile && Array.isArray(profile.phasePlan)) ? profile.phasePlan.slice() : DEFAULT_BOSS_DIRECTOR_PROFILE.phasePlan.slice();
  }

  function getBossSignaturePlan(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    if (profile && profile.signaturePlan && typeof profile.signaturePlan === "object") {
      return {
        intro: profile.signaturePlan.intro || "aimedBurst",
        main: profile.signaturePlan.main || "aimedBurst",
        rage: profile.signaturePlan.rage || "aimedBurst"
      };
    }
    return {
      intro: DEFAULT_BOSS_DIRECTOR_PROFILE.signaturePlan.intro,
      main: DEFAULT_BOSS_DIRECTOR_PROFILE.signaturePlan.main,
      rage: DEFAULT_BOSS_DIRECTOR_PROFILE.signaturePlan.rage
    };
  }

  function getBossRageStyle(targetBoss) {
    var archetype = getBossArchetype(targetBoss);
    return (archetype && archetype.rageStyle) ? archetype.rageStyle : "faster_bursts";
  }

  function getBossPacingStyle(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    return (profile && profile.pacingStyle) ? profile.pacingStyle : "punctuated";
  }

  function getBossMobilityStyle(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    return (profile && profile.mobilityStyle) ? profile.mobilityStyle : "lateral_strafe";
  }

  function getBossRecoveryBias(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    return (profile && profile.recoveryBias) ? profile.recoveryBias : "long_after_burst";
  }

  function getBossFairnessBias(targetBoss) {
    var profile = getBossDirectorProfile(targetBoss);
    return (profile && profile.fairnessBias) ? profile.fairnessBias : "medium";
  }

  function getAllBossDirectorProfiles() {
    var arr = [];
    var keys = Object.keys(BOSS_DIRECTOR_PROFILES);
    for (var i = 0; i < keys.length; i++) {
      arr.push(BOSS_DIRECTOR_PROFILES[keys[i]]);
    }
    return arr;
  }

  // ============================================================
  // SECTION 14: PROFILE VALIDATION
  // ============================================================

  function validateBossDirectorProfile(profile) {
    var errors = [];

    if (!profile || typeof profile !== "object") {
      return { valid: false, errors: ["Profile is null or not an object"] };
    }

    // Required string fields
    var requiredStrings = [
      "displayName", "pattern", "archetype",
      "pressureStyle", "mobilityStyle", "pacingStyle", "rageStyle", "telegraphStyle",
      "primarySignature", "secondarySignature",
      "recoveryBias", "fairnessBias",
      "weaknessReadability", "transitionStyle"
    ];

    for (var i = 0; i < requiredStrings.length; i++) {
      var field = requiredStrings[i];
      if (!profile[field] || typeof profile[field] !== "string" || profile[field].trim() === "") {
        errors.push("Missing or invalid string field: " + field);
      }
    }

    // bossId must be numeric
    if (typeof profile.bossId !== "number") {
      errors.push("bossId must be a number");
    }

    // Validate archetype exists in taxonomy
    if (profile.archetype) {
      var validArchetype = validateBossArchetype(profile.archetype);
      if (!validArchetype) {
        errors.push("Unknown archetype: " + profile.archetype);
      }
    }

    // Validate phasePlan
    if (!Array.isArray(profile.phasePlan) || profile.phasePlan.length === 0) {
      errors.push("phasePlan must be a non-empty array");
    } else {
      for (var j = 0; j < profile.phasePlan.length; j++) {
        var phaseType = profile.phasePlan[j];
        var validPhase = validateBossPhaseType(phaseType);
        if (!validPhase) {
          errors.push("Unknown phase type in phasePlan: " + phaseType);
        }
      }
    }

    // Validate signaturePlan
    if (!profile.signaturePlan || typeof profile.signaturePlan !== "object") {
      errors.push("signaturePlan must be an object with intro/main/rage");
    } else {
      var sigKeys = ["intro", "main", "rage"];
      for (var k = 0; k < sigKeys.length; k++) {
        var sk = sigKeys[k];
        if (!profile.signaturePlan[sk] || typeof profile.signaturePlan[sk] !== "string") {
          errors.push("signaturePlan." + sk + " must be a non-empty string");
        } else {
          var validSig = validateBossSignatureType(profile.signaturePlan[sk]);
          if (!validSig) {
            errors.push("Unknown signature type in signaturePlan." + sk + ": " + profile.signaturePlan[sk]);
          }
        }
      }
    }

    // Validate fairness/recovery biases
    var validFairnessBiases = ["high", "medium", "low"];
    if (profile.fairnessBias && validFairnessBiases.indexOf(profile.fairnessBias) === -1) {
      errors.push("fairnessBias must be high/medium/low, got: " + profile.fairnessBias);
    }

    var validRecoveryBiases = ["long_after_burst", "wave_trough", "post_deploy_silence", "orbit_apex", "post_charge_retreat", "phase_transition_only", "rare_brief_pauses", "stagger_on_hit", "adaptive_breathing", "merge_phase"];
    if (profile.recoveryBias && validRecoveryBiases.indexOf(profile.recoveryBias) === -1) {
      errors.push("Unknown recoveryBias: " + profile.recoveryBias);
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // ============================================================
  // SECTION 15: BOSS DIRECTOR STATE MACHINE (HC-BD-03)
  // ============================================================
  // Estado runtime del Boss Director. Pasivo, solo lectura.
  // No altera gameplay. No modifica bosses.
  // ============================================================

  var bossDirectorState = {
    active: false,
    bossKey: null,
    profile: null,

    phaseIndex: 0,
    phaseType: "introduction",
    previousPhaseType: null,

    phaseTimer: 0,
    totalTimer: 0,

    transitionActive: false,
    transitionTimer: 0,

    rageActive: false,
    finaleActive: false,

    lastHPPercent: 1,
    currentHPPercent: 1,

    recoveryWindowActive: false,
    recoveryTimer: 0,

    telemetry: {}
  };

  function resetBossDirectorState() {
    bossDirectorState.active = false;
    bossDirectorState.bossKey = null;
    bossDirectorState.profile = null;
    bossDirectorState.phaseIndex = 0;
    bossDirectorState.phaseType = "introduction";
    bossDirectorState.previousPhaseType = null;
    bossDirectorState.phaseTimer = 0;
    bossDirectorState.totalTimer = 0;
    bossDirectorState.transitionActive = false;
    bossDirectorState.transitionTimer = 0;
    bossDirectorState.rageActive = false;
    bossDirectorState.finaleActive = false;
    bossDirectorState.lastHPPercent = 1;
    bossDirectorState.currentHPPercent = 1;
    bossDirectorState.recoveryWindowActive = false;
    bossDirectorState.recoveryTimer = 0;
    bossDirectorState.telemetry = {};
  }

  // ============================================================
  // SECTION 16: HP PERCENT CALCULATOR
  // ============================================================

  function getBossHPPercent(targetBoss) {
    if (!targetBoss || typeof targetBoss !== "object") return 1;

    var hp = targetBoss.hp;
    if (typeof hp !== "number") hp = targetBoss.health;
    if (typeof hp !== "number") hp = targetBoss.currentHP;
    if (typeof hp !== "number") return 1;

    var maxHp = targetBoss.maxHp;
    if (typeof maxHp !== "number") maxHp = targetBoss.maxHealth;
    if (typeof maxHp !== "number") maxHp = targetBoss.maxHP;
    if (typeof maxHp !== "number") maxHp = targetBoss.baseHp;

    // Never divide by zero
    if (typeof maxHp !== "number" || maxHp <= 0) return 1;
    if (hp <= 0) return 0;

    return Math.max(0, Math.min(1, hp / maxHp));
  }

  // ============================================================
  // SECTION 17: PHASE RESOLUTION FROM HP + PHASEPLAN
  // ============================================================

  function resolveBossPhaseFromHP(profile, hpPercent) {
    if (!profile || typeof profile !== "object") return "pressure";
    var plan = (Array.isArray(profile.phasePlan) && profile.phasePlan.length > 0)
      ? profile.phasePlan
      : DEFAULT_BOSS_DIRECTOR_PROFILE.phasePlan;
    var len = plan.length;

    // Threshold map that scales across the available phase plan length
    // More phases = finer granularity
    if (len <= 3) {
      if (hpPercent > 0.50) return plan[0];
      if (hpPercent > 0.15) return plan[Math.min(1, len - 1)];
      return plan[len - 1];
    }

    if (len <= 5) {
      if (hpPercent > 0.70) return plan[0];
      if (hpPercent > 0.45) return plan[Math.min(1, len - 1)];
      if (hpPercent > 0.22) return plan[Math.min(2, len - 1)];
      if (hpPercent > 0.05) return plan[Math.min(3, len - 1)];
      return plan[len - 1];
    }

    // Full scale (6+ phases): user-specified thresholds
    var thresholds = [
      { hp: 0.85, idx: 0 },    // introduction
      { hp: 0.65, idx: 1 },    // pressure
      { hp: 0.50, idx: 2 },    // recovery / crossfire
      { hp: 0.35, idx: 3 },    // transition / area_denial
      { hp: 0.20, idx: 4 },    // desperation
      { hp: 0.08, idx: 5 },    // rage
      { hp: 0.00, idx: 6 }     // finale (defaults to last)
    ];

    for (var i = 0; i < thresholds.length; i++) {
      if (hpPercent > thresholds[i].hp) {
        var targetIdx = Math.min(thresholds[i].idx, len - 1);
        return plan[targetIdx];
      }
    }

    return plan[len - 1];
  }

  function resolveBossPhaseIndexFromHP(profile, hpPercent) {
    if (!profile || typeof profile !== "object") return 0;
    var plan = (Array.isArray(profile.phasePlan) && profile.phasePlan.length > 0)
      ? profile.phasePlan
      : DEFAULT_BOSS_DIRECTOR_PROFILE.phasePlan;
    var len = plan.length;

    if (len <= 3) {
      if (hpPercent > 0.50) return 0;
      if (hpPercent > 0.15) return Math.min(1, len - 1);
      return len - 1;
    }

    if (len <= 5) {
      if (hpPercent > 0.70) return 0;
      if (hpPercent > 0.45) return Math.min(1, len - 1);
      if (hpPercent > 0.22) return Math.min(2, len - 1);
      if (hpPercent > 0.05) return Math.min(3, len - 1);
      return len - 1;
    }

    var thresholds = [
      { hp: 0.85, idx: 0 },
      { hp: 0.65, idx: 1 },
      { hp: 0.50, idx: 2 },
      { hp: 0.35, idx: 3 },
      { hp: 0.20, idx: 4 },
      { hp: 0.08, idx: 5 },
      { hp: 0.00, idx: 6 }
    ];

    for (var j = 0; j < thresholds.length; j++) {
      if (hpPercent > thresholds[j].hp) {
        return Math.min(thresholds[j].idx, len - 1);
      }
    }

    return len - 1;
  }

  // ============================================================
  // SECTION 18: LIFECYCLE HELPERS
  // ============================================================

  function startBossDirectorForBoss(targetBoss) {
    var cfg = getBossDirectorConfig();
    if (!cfg.enableBossDirector) {
      resetBossDirectorState();
      return false;
    }

    var profile = getBossDirectorProfile(targetBoss);
    if (!profile || profile === DEFAULT_BOSS_DIRECTOR_PROFILE) {
      // Unknown boss — still safe, use fallback with telemetry note
      if (targetBoss && targetBoss.pattern) {
        var bKey = targetBoss.pattern || "unknown";
        bossDirectorState.bossKey = bKey;
        bossDirectorState.profile = profile;
        bossDirectorState.active = cfg.enableBossDirector;
      } else {
        resetBossDirectorState();
        return false;
      }
    } else {
      bossDirectorState.bossKey = profile.pattern || profile.displayName.toLowerCase();
      bossDirectorState.profile = profile;
      bossDirectorState.active = cfg.enableBossDirector;
    }

    bossDirectorState.phaseIndex = 0;
    bossDirectorState.phaseType = "introduction";
    bossDirectorState.previousPhaseType = null;
    bossDirectorState.phaseTimer = 0;
    bossDirectorState.totalTimer = 0;
    bossDirectorState.transitionActive = false;
    bossDirectorState.transitionTimer = 0;
    bossDirectorState.rageActive = false;
    bossDirectorState.finaleActive = false;
    bossDirectorState.lastHPPercent = 1;
    bossDirectorState.currentHPPercent = 1;
    bossDirectorState.recoveryWindowActive = false;
    bossDirectorState.recoveryTimer = 0;
    bossDirectorState.telemetry = {};

    if (cfg.enableBossTelemetry) {
      recordBossDirectorEvent("director_started", {
        bossKey: bossDirectorState.bossKey,
        archetype: profile.archetype,
        phasePlan: profile.phasePlan
      });
    }

    return true;
  }

  function updateBossDirectorState(targetBoss) {
    var cfg = getBossDirectorConfig();
    if (!cfg.enableBossDirector) {
      if (bossDirectorState.active) resetBossDirectorState();
      return false;
    }

    // Validate boss existence
    if (!targetBoss || targetBoss.active !== true) {
      if (bossDirectorState.active) {
        endBossDirector();
      }
      return false;
    }

    // Lazy init if not active but boss is valid
    if (!bossDirectorState.active) {
      var started = startBossDirectorForBoss(targetBoss);
      if (!started) return false;
    }

    var dt = (typeof globalTime === "number") ? 16.667 : 16.667;
    bossDirectorState.totalTimer += dt;

    // Calculate HP percent
    var hpPct = getBossHPPercent(targetBoss);
    bossDirectorState.lastHPPercent = bossDirectorState.currentHPPercent;
    bossDirectorState.currentHPPercent = hpPct;

    // Resolve phase type from HP + phasePlan
    var profile = bossDirectorState.profile;
    var nextPhaseType = resolveBossPhaseFromHP(profile, hpPct);
    var nextPhaseIndex = resolveBossPhaseIndexFromHP(profile, hpPct);

    // Detect transition
    if (nextPhaseType !== bossDirectorState.phaseType && !bossDirectorState.transitionActive) {
      detectBossPhaseTransition(nextPhaseType);
    }

    // Update phase tracking
    if (!bossDirectorState.transitionActive) {
      bossDirectorState.phaseType = nextPhaseType;
      bossDirectorState.phaseIndex = nextPhaseIndex;
      bossDirectorState.phaseTimer += dt;
    } else {
      // During transition, advance timer and complete after threshold
      bossDirectorState.transitionTimer += dt;

      // Transition completes after MIN_TRANSITION_DURATION_MS
      var transitionCompleteAt = 400;
      if (bossDirectorState.transitionTimer >= transitionCompleteAt) {
        bossDirectorState.phaseType = nextPhaseType;
        bossDirectorState.phaseIndex = nextPhaseIndex;
        bossDirectorState.transitionActive = false;
        bossDirectorState.transitionTimer = 0;
        bossDirectorState.phaseTimer = 0;

        if (cfg.enableBossTelemetry) {
          recordBossDirectorEvent("phase_transition_completed", {
            from: bossDirectorState.previousPhaseType,
            to: bossDirectorState.phaseType,
            transitionDurationMs: Math.round(bossDirectorState.transitionTimer)
          });
        }
      }
    }

    // Recovery window detection
    bossDirectorState.recoveryWindowActive = isPhaseRecoveryEligible(bossDirectorState.phaseType, profile);
    if (bossDirectorState.recoveryWindowActive) {
      bossDirectorState.recoveryTimer += dt;
    } else {
      bossDirectorState.recoveryTimer = 0;
    }

    // Rage detection
    bossDirectorState.rageActive = isRagePhase(bossDirectorState.phaseType);

    // Finale detection
    bossDirectorState.finaleActive = (bossDirectorState.phaseType === "finale");

    // Telemetry snapshot
    if (cfg.enableBossTelemetry) {
      bossDirectorState.telemetry = {
        bossKey: bossDirectorState.bossKey,
        archetype: profile ? profile.archetype : "unknown",
        phaseType: bossDirectorState.phaseType,
        phaseIndex: bossDirectorState.phaseIndex,
        hpPercent: hpPct,
        phaseTimer: bossDirectorState.phaseTimer,
        totalTimer: bossDirectorState.totalTimer,
        transitionActive: bossDirectorState.transitionActive,
        rageActive: bossDirectorState.rageActive,
        finaleActive: bossDirectorState.finaleActive,
        recoveryWindowActive: bossDirectorState.recoveryWindowActive
      };
    }

    return true;
  }

  function endBossDirector() {
    var cfg = getBossDirectorConfig();
    if (cfg.enableBossTelemetry && bossDirectorState.active) {
      recordBossDirectorEvent("director_ended", {
        bossKey: bossDirectorState.bossKey,
        totalTimer: bossDirectorState.totalTimer,
        finalPhase: bossDirectorState.phaseType,
        archetype: bossDirectorState.profile ? bossDirectorState.profile.archetype : "unknown"
      });
    }
    resetBossDirectorState();
  }

  // ============================================================
  // SECTION 19: TRANSITION / RECOVERY / RAGE / FINALE DETECTION
  // ============================================================

  function detectBossPhaseTransition(nextPhaseType) {
    if (bossDirectorState.transitionActive) return false;
    if (!nextPhaseType || nextPhaseType === bossDirectorState.phaseType) return false;

    // Check if transitions are enabled in config
    var cfg = getBossDirectorConfig();
    if (!cfg.enableBossTransitions) return false;

    bossDirectorState.previousPhaseType = bossDirectorState.phaseType;
    bossDirectorState.transitionActive = true;
    bossDirectorState.transitionTimer = 0;

    if (cfg.enableBossTelemetry) {
      recordBossDirectorEvent("phase_transition_detected", {
        from: bossDirectorState.previousPhaseType,
        to: nextPhaseType,
        hpPercent: bossDirectorState.currentHPPercent
      });
    }

    return true;
  }

  function isPhaseRecoveryEligible(phaseType, profile) {
    // Base check: is the phase type inherently recovery/transition?
    if (isRecoveryPhase(phaseType)) return true;

    // Check recovery rules config
    var cfg = getBossDirectorConfig();
    if (!cfg.enableBossRecoveryRules) return false;

    // High recovery bias profiles get extra windows
    if (profile && profile.recoveryBias === "long_after_burst") return false; // manual windows, not automatic
    if (profile && profile.recoveryBias === "post_charge_retreat") return false; // retreat-based

    return false;
  }

  function isBossRecoveryWindowActive() {
    return bossDirectorState.active && bossDirectorState.recoveryWindowActive === true;
  }

  function isBossRageActive() {
    return bossDirectorState.active && bossDirectorState.rageActive === true;
  }

  function isBossFinaleActive() {
    return bossDirectorState.active && bossDirectorState.finaleActive === true;
  }

  function isBossTransitionActive() {
    return bossDirectorState.active && bossDirectorState.transitionActive === true;
  }

  // ============================================================
  // SECTION 20: TELEMETRY RUNTIME
  // ============================================================

  function getBossDirectorState() {
    // Return safe copy of internal state
    return {
      active: bossDirectorState.active,
      bossKey: bossDirectorState.bossKey,
      profile: bossDirectorState.profile,
      phaseIndex: bossDirectorState.phaseIndex,
      phaseType: bossDirectorState.phaseType,
      previousPhaseType: bossDirectorState.previousPhaseType,
      phaseTimer: bossDirectorState.phaseTimer,
      totalTimer: bossDirectorState.totalTimer,
      transitionActive: bossDirectorState.transitionActive,
      transitionTimer: bossDirectorState.transitionTimer,
      rageActive: bossDirectorState.rageActive,
      finaleActive: bossDirectorState.finaleActive,
      lastHPPercent: bossDirectorState.lastHPPercent,
      currentHPPercent: bossDirectorState.currentHPPercent,
      recoveryWindowActive: bossDirectorState.recoveryWindowActive,
      recoveryTimer: bossDirectorState.recoveryTimer,
      telemetry: bossDirectorState.telemetry
    };
  }

  function getBossDirectorTelemetry() {
    if (!isBossTelemetryEnabled()) return null;
    var snapshot = getBossTelemetrySnapshot();
    return {
      telemetryEvents: snapshot.events,
      telemetryCount: snapshot.count,
      state: {
        bossKey: bossDirectorState.bossKey,
        archetype: bossDirectorState.profile ? bossDirectorState.profile.archetype : "unknown",
        phaseType: bossDirectorState.phaseType,
        phaseIndex: bossDirectorState.phaseIndex,
        hpPercent: bossDirectorState.currentHPPercent,
        phaseTimer: bossDirectorState.phaseTimer,
        totalTimer: bossDirectorState.totalTimer,
        transitionActive: bossDirectorState.transitionActive,
        rageActive: bossDirectorState.rageActive,
        finaleActive: bossDirectorState.finaleActive,
        recoveryWindowActive: bossDirectorState.recoveryWindowActive
      }
    };
  }

  // ============================================================
  // SECTION 21: EXPORT TO WINDOW
  // ============================================================

  // Taxonomy exports
  window.BOSS_ARCHETYPES = BOSS_ARCHETYPES;
  window.BOSS_PHASE_TYPES = BOSS_PHASE_TYPES;
  window.BOSS_SIGNATURE_TYPES = BOSS_SIGNATURE_TYPES;
  window.BOSS_ORCHESTRATION_RULES = BOSS_ORCHESTRATION_RULES;

  // Profile exports (HC-BD-02)
  window.BOSS_DIRECTOR_PROFILES = BOSS_DIRECTOR_PROFILES;
  window.DEFAULT_BOSS_DIRECTOR_PROFILE = DEFAULT_BOSS_DIRECTOR_PROFILE;

  // Runtime state export (HC-BD-03)
  window.getBossDirectorState = getBossDirectorState;
  window.getBossDirectorTelemetry = getBossDirectorTelemetry;

  // Lifecycle exports (HC-BD-03)
  window.resetBossDirectorState = resetBossDirectorState;
  window.startBossDirectorForBoss = startBossDirectorForBoss;
  window.updateBossDirectorState = updateBossDirectorState;
  window.endBossDirector = endBossDirector;

  // HP percent export (HC-BD-03)
  window.getBossHPPercent = getBossHPPercent;

  // Phase resolution exports (HC-BD-03)
  window.resolveBossPhaseFromHP = resolveBossPhaseFromHP;
  window.resolveBossPhaseIndexFromHP = resolveBossPhaseIndexFromHP;

  // Detection exports (HC-BD-03)
  window.detectBossPhaseTransition = detectBossPhaseTransition;
  window.isBossRecoveryWindowActive = isBossRecoveryWindowActive;
  window.isBossRageActive = isBossRageActive;
  window.isBossFinaleActive = isBossFinaleActive;
  window.isBossTransitionActive = isBossTransitionActive;

  // Validator exports
  window.validateBossArchetype = validateBossArchetype;
  window.validateBossPhaseType = validateBossPhaseType;
  window.validateBossSignatureType = validateBossSignatureType;
  window.validateBossDirectorProfile = validateBossDirectorProfile;

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

  // Getter exports (taxonomy-level)
  window.getBossArchetypeByKey = getBossArchetypeByKey;
  window.getBossPhaseTypeByKey = getBossPhaseTypeByKey;
  window.getBossSignatureTypeByKey = getBossSignatureTypeByKey;
  window.getAllBossArchetypes = getAllBossArchetypes;
  window.getAllBossPhaseTypes = getAllBossPhaseTypes;
  window.getAllBossSignatureTypes = getAllBossSignatureTypes;
  window.getBossOrchestrationRules = getBossOrchestrationRules;
  window.getOrchestrationRule = getOrchestrationRule;

  // Profile-level getters (HC-BD-02)
  window.getBossDirectorProfile = getBossDirectorProfile;
  window.getBossArchetype = getBossArchetype;
  window.getBossPrimarySignature = getBossPrimarySignature;
  window.getBossSecondarySignature = getBossSecondarySignature;
  window.getBossPhasePlan = getBossPhasePlan;
  window.getBossSignaturePlan = getBossSignaturePlan;
  window.getBossRageStyle = getBossRageStyle;
  window.getBossPacingStyle = getBossPacingStyle;
  window.getBossMobilityStyle = getBossMobilityStyle;
  window.getBossRecoveryBias = getBossRecoveryBias;
  window.getBossFairnessBias = getBossFairnessBias;
  window.getAllBossDirectorProfiles = getAllBossDirectorProfiles;

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
