// ====================================
// GALAXY RAIDERS - hardcore-config.js
// Helpers seguros para leer GALAXY_CONFIG
// ====================================

var _GALAXY_CONFIG_DEFAULTS = {
  hardcore:  { enabled: true },   // HC-12: hardcore only
  player:    { hardcoreHitRadius: 3, showHitbox: false },
  graze:     { enabled: true, radius: 24, score: 5 },   // HC-12
  rank:      { enabled: true, baseLevel: 0, min: 0, max: 100, maxLevel: 5, bulletSpeedMax: 1.12, cooldownMin: 0.88, multiplierMax: 1.5, decayDelayMs: 6000, decayAmount: 0.2, decayIntervalMs: 1000, survivalRankIntervalMs: 5000, survivalRankAmount: 0.5, accuracyCheckIntervalMs: 4000, accuracyBonusThreshold: 70, accuracyBonusAmount: 0.3, waveSpeedBonusAmount: 0.5, dominatingHitlessMs: 15000, recoveringMs: 4000, safetyBulletSpeedMax: 1.08, safetyCooldownFloorMs: 450, safetyWavePauseFloorMs: 600, safetyCombinedCeiling: 5.20, safetyRecoveryLimit: 2, safetyBossRankCeilings: { crossfire: 5, zigzag: 5, rotate: 5, divebomb: 5, supreme: 4 }, safetyWaveIntensityCeiling: 0.85, safetyAntiSpikeMaxStep: 8, safetySpikeCooldownMs: 2000, gameplayEffectsEnabled: true },
  bullets:   { enemyGlow: false, bossGlow: false },
  score:     { comboEnabled: true },   // HC-12
  combo:     { enabled: true, timeoutMs: 2500, maxMultiplier: 2.0, graceMs: 350, warningMs: 700 },
  pressure:  { enabled: true, minMultiplier: 1.00, maxMultiplier: 1.18, levels: { LOW: 1.00, NORMAL: 1.06, HIGH: 1.12, MAX: 1.18 } },
  rhythm:    { enabled: true, wavePauseMinScale: 0.75, introMinScale: 0.72, entryDelayMinScale: 0.70 },
  background:{ hc90Enabled: true, nebulaEnabled: true, colorGradingEnabled: true, maxStars: 180 },
  atmosphere:{ enabled: true, dustEnabled: true, speedLinesEnabled: true, ambientFlashEnabled: true },
  bossAI:    { enabled: true, maxOffsetX: 70, maxOffsetY: 35 },
  enemyAI:   { enabled: true, maxOffsetX: 18, maxOffsetY: 10, decisionIntervalMs: 500 },
  bossDirector: { enableBossDirector: false, enableBossTelemetry: false, enableBossRecoveryRules: false, enableBossFairnessValidation: false, enableBossTransitions: false, enableBossRageRules: false, enableBossSignatureIntents: false, enableCrabtronSignatureHook: false, enableSerpentrixSignatureHook: false, enableOrbitalSignatureHook: false, enableTenienteSignatureHook: false, enableEmperadorSignatureHook: false },
  readability: {
    enabled: true,
    visualPriority: { enabled: true, fatalAlphaFloor: 0.85, telegraphAlphaFloor: 0.60, enemyAlphaFloor: 0.70, feedbackAlphaMax: 0.70, ambientAlphaMax: 0.55 },
    glowPolicy: { enabled: true, starAlphaMax: 0.70, backgroundAmbientMax: 0.10, bossAmbientGlowMax: 0.06, enemyBulletHaloMin: 0.10, telegraphGlowMin: 0.08, explosionAlphaMax: 0.55 },
    alphaPolicy: { enabled: true, fatal: { enemyBulletBody: 0.95, enemyBulletCore: 0.55, enemyBulletOuterHalo: 0.12, enemyBulletInnerGlow: 0.22 }, feedback: { playerGlow: 0.14, explosionParticle: 0.65, hitFlashMax: 0.45, popupAlpha: 0.85, powerupGlow: 0.20 }, ambient: { starDepthAlphaMax: 0.70, backgroundLayer: 0.08, nebulaAlpha: 0.04, dustAlpha: 0.18 } },
    fxSuppression: { enabled: true, particlesBeforeBullets: true, hitFlashBodyAlpha: 0.42, hitFlashWhiteAlpha: 0.30, suppressOverlaysDuringTelegraph: true, maxExplosionParticles: 60 },
    bulletClarity: { enabled: true, outline: { enabled: true, color: '#050308', alpha: 0.42, lineWidth: 1, bossLineWidth: 1.5, tankLineWidth: 1.5, orbConcentric: true }, motion: { enabled: true, bossTrailSteps: 4, orbTrailSteps: 3, sharedTrailSteps: 3, trailAlphaMul: 0.72 }, typeLanguage: { enabled: true, fastDirectionalTip: true, heavyInnerOutline: true, splitterPulseEnable: true }, density: { enabled: true, outerHaloCap: 0.10, innerGlowCap: 0.20, trailStepsMin: 2 } },
    telegraphConsistency: { enabled: true, outline: { enabled: true, color: '#050308', alpha: 0.40, lineWidth: 1, bossLineWidth: 1.5 }, alpha: { enabled: true, floor: 0.12, ceiling: 0.55, pulseRange: 0.35 }, colors: { fatal: '#ff3333', aggressive: '#ff6622', charge: '#ffaa00', energy: '#4488ff', clarity: '#ffffff', caution: '#ffdd44', sniper: '#44ffff', chaser: '#ff6622', suppressor: '#bbff44', diver: '#ff4422', teleport: '#bb88ff', setPiece: '#ff6633' }, shape: { ringDash: [6,4], arrowLength: 16, coneAngle: 0.28, dotRadius: 3.5 } },
    backgroundReadability: { enabled: true, themeCaps: { enabled: true, foregroundMax: 0.30, mountainMax: 0.10, snowHazeMax: 0.06, planetGlowMax: 0.12, imperialPillarMax: 0.04 }, stars: { enabled: true, alphaCap: 0.42, coreAlphaCap: 0.28, flickerReduction: 0.80 }, ambientFX: { enabled: true, nebulaAlphaMul: 0.55, atmosphereAlphaMul: 0.60, speedLineAlphaMul: 0.45 }, dynamicDimming: { enabled: true, densityThreshold: 18, maxDimFactor: 0.50, dimSpeed: 0.015, recoverSpeed: 0.008 } },
    playerFeedback: { enabled: true, playerBullets: { enabled: true, glowMul: 0.65, bodyAlphaMax: 0.90, trailAlphaCap: 0.22 }, thruster: { enabled: true, maxAlpha: 0.45, midAlpha: 0.35, glowAlpha: 0.04 }, invincibility: { enabled: true, constantOutlineAlpha: 0.15, fillAlpha: 0.08, strokeAlpha: 0.28, innerStrokeAlpha: 0.12 }, silhouette: { enabled: true, outlineColor: '#040815', outlineAlpha: 0.25, outlineWidth: 1 }, damage: { enabled: true, screenFlashAlphaCap: 0.06 } },
    hudReadability: { enabled: true, bossHP: { enabled: true, fillAlpha: 0.65, accentAlpha: 0.35, bgAlpha: 0.18, borderAlpha: 0.20, lowHPPulseMax: 0.18 }, bossWarning: { enabled: true, darkBandAlpha: 0.18, accentAlpha: 0.40, textAlpha: 0.60, sidePillarMax: 0.25, stripeAlpha: 0.05 }, levelClear: { enabled: true, darkBandAlpha: 0.22, bracketAlpha: 0.45, borderAlpha: 0.30, glowShadowBlur: 12 }, textGlow: { enabled: true, shadowBlurMax: 5, shadowAlphaMul: 0.60 }, overlays: { enabled: true, pauseBgAlpha: 0.65, gameoverBgAlpha: 0.72, overlayPanelAlpha: 0.90 } },
    mobileReadability: { enabled: true, controlDeck: { enabled: true, gameplayOpacity: 0.64 }, smallScreen: { enabled: true, thresholdHeight: 500, bossScaleBoost: 1.12, enemyScaleBoost: 1.10, hudFontBoost: 1 } },
    freezeAudit: { enabled: true, bossAuraCap: 0.30, muzzleFlashCoreMax: 0.55, waveAnnounceAlphaCap: 0.65, medalFeverAlphaCap: 0.70, flashOverlayMult: 0.06 }
  },
  debug:     { showHardcoreInfo: false, showRank: false, showRankDebug: false, showHardcoreSystems: false, showEnemyRoles: false, showBossPattern: false, showBossDispatch: false, showBackgroundStats: false, showAtmosphereStats: false, showLevelSkipButton: false }
};

function getGalaxyConfig() {
  var cfg = window.GALAXY_CONFIG;
  if (!cfg || typeof cfg !== 'object') return _GALAXY_CONFIG_DEFAULTS;
  return cfg;
}

function isHardcoreEnabled() {
  var cfg = getGalaxyConfig();
  return !!(cfg.hardcore && cfg.hardcore.enabled);
}

function getHardcorePlayerConfig() {
  var cfg = getGalaxyConfig();
  var p = (cfg.player && typeof cfg.player === 'object') ? cfg.player : _GALAXY_CONFIG_DEFAULTS.player;
  var hr = (typeof p.hardcoreHitRadius === 'number') ? p.hardcoreHitRadius : _GALAXY_CONFIG_DEFAULTS.player.hardcoreHitRadius;
  var sh = (typeof p.showHitbox === 'boolean') ? p.showHitbox : _GALAXY_CONFIG_DEFAULTS.player.showHitbox;
  return { hardcoreHitRadius: hr, showHitbox: sh };
}

function getGrazeConfig() {
  var cfg = getGalaxyConfig();
  var g = (cfg.graze && typeof cfg.graze === 'object') ? cfg.graze : _GALAXY_CONFIG_DEFAULTS.graze;
  var en = (typeof g.enabled === 'boolean') ? g.enabled : _GALAXY_CONFIG_DEFAULTS.graze.enabled;
  var ra = (typeof g.radius === 'number') ? g.radius : _GALAXY_CONFIG_DEFAULTS.graze.radius;
  var sc = (typeof g.score === 'number') ? g.score : _GALAXY_CONFIG_DEFAULTS.graze.score;
  return { enabled: en, radius: ra, score: sc };
}

function getRankConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rank && typeof cfg.rank === 'object') ? cfg.rank : _GALAXY_CONFIG_DEFAULTS.rank;
  var en = (typeof r.enabled === 'boolean') ? r.enabled : _GALAXY_CONFIG_DEFAULTS.rank.enabled;
  var bl = (typeof r.baseLevel === 'number') ? r.baseLevel : _GALAXY_CONFIG_DEFAULTS.rank.baseLevel;
  return { enabled: en, baseLevel: bl };
}

function getHardcoreBulletConfig() {
  var cfg = getGalaxyConfig();
  var b = (cfg.bullets && typeof cfg.bullets === 'object') ? cfg.bullets : _GALAXY_CONFIG_DEFAULTS.bullets;
  var eg = (typeof b.enemyGlow === 'boolean') ? b.enemyGlow : _GALAXY_CONFIG_DEFAULTS.bullets.enemyGlow;
  var bg = (typeof b.bossGlow === 'boolean') ? b.bossGlow : _GALAXY_CONFIG_DEFAULTS.bullets.bossGlow;
  return { enemyGlow: eg, bossGlow: bg };
}

function getHardcoreScoreConfig() {
  var cfg = getGalaxyConfig();
  var sc = (cfg.score && typeof cfg.score === 'object') ? cfg.score : _GALAXY_CONFIG_DEFAULTS.score;
  var ce = (typeof sc.comboEnabled === 'boolean') ? sc.comboEnabled : _GALAXY_CONFIG_DEFAULTS.score.comboEnabled;
  return { comboEnabled: ce };
}

function getHardcoreDebugConfig() {
  var cfg = getGalaxyConfig();
  var d = (cfg.debug && typeof cfg.debug === 'object') ? cfg.debug : _GALAXY_CONFIG_DEFAULTS.debug;
  var si = (typeof d.showHardcoreInfo === 'boolean') ? d.showHardcoreInfo : _GALAXY_CONFIG_DEFAULTS.debug.showHardcoreInfo;
  var ser = (typeof d.showEnemyRoles === 'boolean') ? d.showEnemyRoles : false;
  var sbp = (typeof d.showBossPattern === 'boolean') ? d.showBossPattern : false;
  var sbd = (typeof d.showBossDispatch === 'boolean') ? d.showBossDispatch : false;
  var sbs = (typeof d.showBackgroundStats === 'boolean') ? d.showBackgroundStats : false;
  var sas = (typeof d.showAtmosphereStats === 'boolean') ? d.showAtmosphereStats : false;
  var sls = (typeof d.showLevelSkipButton === 'boolean') ? d.showLevelSkipButton : false;
  var srd = (typeof d.showRankDebug === 'boolean') ? d.showRankDebug : false;
  return { showHardcoreInfo: si, showEnemyRoles: ser, showBossPattern: sbp, showBossDispatch: sbd, showBackgroundStats: sbs, showAtmosphereStats: sas, showLevelSkipButton: sls, showRankDebug: srd };
}

function getPressureConfig() {
  var cfg = getGalaxyConfig();
  var p = (cfg.pressure && typeof cfg.pressure === 'object') ? cfg.pressure : _GALAXY_CONFIG_DEFAULTS.pressure;
  var en = (typeof p.enabled === 'boolean') ? p.enabled : true;
  var minM = (typeof p.minMultiplier === 'number' && p.minMultiplier >= 1.00) ? p.minMultiplier : 1.00;
  var maxM = (typeof p.maxMultiplier === 'number' && p.maxMultiplier <= 1.18) ? p.maxMultiplier : 1.18;
  var lvls = (p.levels && typeof p.levels === 'object') ? p.levels : _GALAXY_CONFIG_DEFAULTS.pressure.levels;
  return { enabled: en, minMultiplier: minM, maxMultiplier: maxM, levels: lvls };
}

function getRhythmConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.rhythm && typeof cfg.rhythm === 'object') ? cfg.rhythm : _GALAXY_CONFIG_DEFAULTS.rhythm;
  var en = (typeof r.enabled === 'boolean') ? r.enabled : true;
  var wps = (typeof r.wavePauseMinScale === 'number' && r.wavePauseMinScale > 0 && r.wavePauseMinScale <= 1) ? r.wavePauseMinScale : 0.75;
  var ims = (typeof r.introMinScale === 'number' && r.introMinScale > 0 && r.introMinScale <= 1) ? r.introMinScale : 0.72;
  var eds = (typeof r.entryDelayMinScale === 'number' && r.entryDelayMinScale > 0 && r.entryDelayMinScale <= 1) ? r.entryDelayMinScale : 0.70;
  return { enabled: en, wavePauseMinScale: wps, introMinScale: ims, entryDelayMinScale: eds };
}

function getBackgroundConfig() {
  var cfg = getGalaxyConfig();
  var b = (cfg.background && typeof cfg.background === 'object') ? cfg.background : _GALAXY_CONFIG_DEFAULTS.background;
  var en = (typeof b.hc90Enabled === 'boolean') ? b.hc90Enabled : true;
  var ne = (typeof b.nebulaEnabled === 'boolean') ? b.nebulaEnabled : true;
  var cg = (typeof b.colorGradingEnabled === 'boolean') ? b.colorGradingEnabled : true;
  var ms = (typeof b.maxStars === 'number' && b.maxStars > 0) ? Math.min(300, Math.max(10, b.maxStars)) : 180;
  return { hc90Enabled: en, nebulaEnabled: ne, colorGradingEnabled: cg, maxStars: ms };
}

function getAtmosphereConfig() {
  var cfg = getGalaxyConfig();
  var a = (cfg.atmosphere && typeof cfg.atmosphere === 'object') ? cfg.atmosphere : _GALAXY_CONFIG_DEFAULTS.atmosphere;
  var en = (typeof a.enabled === 'boolean') ? a.enabled : true;
  var de = (typeof a.dustEnabled === 'boolean') ? a.dustEnabled : true;
  var sl = (typeof a.speedLinesEnabled === 'boolean') ? a.speedLinesEnabled : true;
  var af = (typeof a.ambientFlashEnabled === 'boolean') ? a.ambientFlashEnabled : true;
  return { enabled: en, dustEnabled: de, speedLinesEnabled: sl, ambientFlashEnabled: af };
}

function getBossAIConfig() {
  var cfg = getGalaxyConfig();
  var ai = (cfg.bossAI && typeof cfg.bossAI === 'object') ? cfg.bossAI : _GALAXY_CONFIG_DEFAULTS.bossAI;
  var en = (typeof ai.enabled === 'boolean') ? ai.enabled : true;
  var maxX = (typeof ai.maxOffsetX === 'number' && ai.maxOffsetX >= 0) ? Math.min(120, ai.maxOffsetX) : 70;
  var maxY = (typeof ai.maxOffsetY === 'number' && ai.maxOffsetY >= 0) ? Math.min(80, ai.maxOffsetY) : 35;
  return { enabled: en, maxOffsetX: maxX, maxOffsetY: maxY };
}

function getEnemyAIConfig() {
  var cfg = getGalaxyConfig();
  var ai = (cfg.enemyAI && typeof cfg.enemyAI === 'object') ? cfg.enemyAI : _GALAXY_CONFIG_DEFAULTS.enemyAI;
  var en = (typeof ai.enabled === 'boolean') ? ai.enabled : true;
  var maxX = (typeof ai.maxOffsetX === 'number' && ai.maxOffsetX >= 0) ? Math.min(32, ai.maxOffsetX) : 18;
  var maxY = (typeof ai.maxOffsetY === 'number' && ai.maxOffsetY >= 0) ? Math.min(20, ai.maxOffsetY) : 10;
  var interval = (typeof ai.decisionIntervalMs === 'number' && ai.decisionIntervalMs >= 120)
    ? Math.min(2000, ai.decisionIntervalMs)
    : 500;
  return { enabled: en, maxOffsetX: maxX, maxOffsetY: maxY, decisionIntervalMs: interval };
}

function getBossDirectorConfig() {
  var cfg = getGalaxyConfig();
  var d = (cfg.bossDirector && typeof cfg.bossDirector === 'object') ? cfg.bossDirector : _GALAXY_CONFIG_DEFAULTS.bossDirector;
  var en   = (typeof d.enableBossDirector === 'boolean') ? d.enableBossDirector : false;
  var et   = (typeof d.enableBossTelemetry === 'boolean') ? d.enableBossTelemetry : false;
  var er   = (typeof d.enableBossRecoveryRules === 'boolean') ? d.enableBossRecoveryRules : false;
  var ef   = (typeof d.enableBossFairnessValidation === 'boolean') ? d.enableBossFairnessValidation : false;
  var ebt  = (typeof d.enableBossTransitions === 'boolean') ? d.enableBossTransitions : false;
  var ebr  = (typeof d.enableBossRageRules === 'boolean') ? d.enableBossRageRules : false;
  var esi  = (typeof d.enableBossSignatureIntents === 'boolean') ? d.enableBossSignatureIntents : false;
  var ecsh = (typeof d.enableCrabtronSignatureHook === 'boolean') ? d.enableCrabtronSignatureHook : false;
  var essh = (typeof d.enableSerpentrixSignatureHook === 'boolean') ? d.enableSerpentrixSignatureHook : false;
  var eosh = (typeof d.enableOrbitalSignatureHook === 'boolean') ? d.enableOrbitalSignatureHook : false;
  var etsh = (typeof d.enableTenienteSignatureHook === 'boolean') ? d.enableTenienteSignatureHook : false;
  var eesh = (typeof d.enableEmperadorSignatureHook === 'boolean') ? d.enableEmperadorSignatureHook : false;
  return { enableBossDirector: en, enableBossTelemetry: et, enableBossRecoveryRules: er, enableBossFairnessValidation: ef, enableBossTransitions: ebt, enableBossRageRules: ebr, enableBossSignatureIntents: esi, enableCrabtronSignatureHook: ecsh, enableSerpentrixSignatureHook: essh, enableOrbitalSignatureHook: eosh, enableTenienteSignatureHook: etsh, enableEmperadorSignatureHook: eesh };
}

function isBossDirectorEnabled() {
  return !!(getBossDirectorConfig().enableBossDirector);
}

// ============================================================
// HC-PD-01: PATTERN DIRECTOR — composicion hardcore de patrones
// ============================================================
// Estos limites controlan la convivencia segura entre patrones
// simultaneos. NO aumentan dificultad: evitan combos injustos.

window.HC_PATTERN_DIRECTOR = {
  enabled: false,  // OFF por defecto — se activa cuando HC-PD este listo

  // HC-PD-02: Runtime classification (passive — no combat control)
  runtimeClassification: true,

  maxThreatBudget: 10,
  maxSimultaneousDominantPatterns: 1,

  allowDoublePrecisionThreats: false,
  preserveEscapeLanes: true,

  telegraphSpacingFrames: 20,

  densityCaps: {
    bullets: 40,
    occupancy: 0.55,
    convergence: 0.35
  },

  readability: {
    maxLoad: 8
  },

  warnings: {
    multiplePrimaryThreats: true,
    laneClosureRisk: true,
    telegraphMissing: true
  },

  // HC-PD-03: Budget Audit — passive threat budget checking
  budgetAudit: {
    enabled: true,

    maxThreatBudget: 10,
    softWarningBudget: 8,

    maxReadabilityLoad: 8,
    softReadabilityWarning: 6,

    maxPrimaryThreats: 1,
    maxSupportThreats: 2,

    laneRisk: {
      maxHighRiskPatterns: 1,
      warnOnHighHighOverlap: true,
      warnOnSpaceControlStack: true
    },

    telegraph: {
      minSpacingFrames: 20,
      warnOnOverlap: true
    },

    history: {
      maxFrames: 300,
      sampleEveryFrames: 10
    }
  },

  // HC-PD-04: Soft Gating — composition advice (advisory only)
  softGating: {
    enabled: true,
    advisoryOnly: true,

    allowWhenBudgetOk: true,

    delayOnHardBudget: true,
    delayOnReadabilityHard: true,
    delayOnMultiPrimary: true,
    delayOnDangerousCombo: true,

    isolatePrimaryThreats: true,
    requireTelegraphForPrimary: true,

    cooldownAdvice: {
      enabled: true,
      minFramesBetweenPrimary: 45,
      minFramesBetweenHighLaneRisk: 60,
      minFramesBetweenSniper: 50,
      minFramesBetweenWall: 70
    }
  },

  // HC-PD-05: Safe Delay Gate — delay risky patterns (applyDelay: false)
  safeDelayGate: {
    enabled: true,
    applyDelay: false,

    maxDelayFrames: 30,
    maxConsecutiveDelays: 2,

    delayOnlyOn: {
      hardBudget: true,
      hardReadability: true,
      dangerousCombo: true,
      multiPrimary: true,
      laneHighOverlap: true
    },

    neverDelay: {
      bossPhaseTransition: true,
      deathSequence: true,
      scriptedSetPiece: true
    },

    fallbackAllowAfterFrames: 90
  },

  // HC-PD-06: Controlled Hooks — which patterns can receive real delay
  controlledHooks: {
    enemySupportFire: true,
    externalPressure: true,
    bossPatterns: false
  },

  debug: {
    enabled: false
  }
};

function getPatternDirectorConfig() {
  var pd = window.HC_PATTERN_DIRECTOR;
  if (!pd || typeof pd !== 'object') {
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
        maxThreatBudget: 10, softWarningBudget: 8,
        maxReadabilityLoad: 8, softReadabilityWarning: 6,
        maxPrimaryThreats: 1, maxSupportThreats: 2,
        laneRisk: { maxHighRiskPatterns: 1, warnOnHighHighOverlap: true, warnOnSpaceControlStack: true },
        telegraph: { minSpacingFrames: 20, warnOnOverlap: true },
        history: { maxFrames: 300, sampleEveryFrames: 10 }
      },
      softGating: {
        enabled: true, advisoryOnly: true,
        allowWhenBudgetOk: true,
        delayOnHardBudget: true, delayOnReadabilityHard: true,
        delayOnMultiPrimary: true, delayOnDangerousCombo: true,
        isolatePrimaryThreats: true, requireTelegraphForPrimary: true,
        cooldownAdvice: {
          enabled: true,
          minFramesBetweenPrimary: 45, minFramesBetweenHighLaneRisk: 60,
          minFramesBetweenSniper: 50, minFramesBetweenWall: 70
        }
      },
      safeDelayGate: {
        enabled: true, applyDelay: false,
        maxDelayFrames: 30, maxConsecutiveDelays: 2,
        delayOnlyOn: {
          hardBudget: true, hardReadability: true, dangerousCombo: true,
          multiPrimary: true, laneHighOverlap: true
        },
        neverDelay: {
          bossPhaseTransition: true, deathSequence: true, scriptedSetPiece: true
        },
        fallbackAllowAfterFrames: 90
      },
      controlledHooks: {
        enemySupportFire: true, externalPressure: true, bossPatterns: false
      },
      debug: { enabled: false }
    };
  }
  return pd;
}

function isPatternDirectorEnabled() {
  return !!(window.HC_PATTERN_DIRECTOR && window.HC_PATTERN_DIRECTOR.enabled);
}

// ============================================================
// HC-RD-01: VISUAL PRIORITY LAYERS — render-only readability
// ============================================================
// These constants define the draw-order separation so that lethal
// threats dominate visually. They are used as comment markers in
// draw.js and as reference values for alpha/glow policies.
window.VISUAL_PRIORITY = {
  FATAL:     100,  // enemy bullets, boss lethal attacks
  TELEGRAPH: 90,   // attack warnings, sniper lines, diver signals
  ENEMY:     75,   // enemy sprites, boss visuals
  FEEDBACK:  50,   // player, powerups, explosions, popups
  AMBIENT:   10    // background, stars, atmospheric FX
};

function getReadabilityConfig() {
  var cfg = getGalaxyConfig();
  var r = (cfg.readability && typeof cfg.readability === 'object') ? cfg.readability : null;
  if (!r) return {
    enabled: false,
    visualPriority: { enabled: false },
    glowPolicy: { enabled: false },
    alphaPolicy: { enabled: false },
    fxSuppression: { enabled: false }
  };
  return r;
}

function isReadabilityEnabled() {
  if (!isHardcoreEnabled()) return false;
  var r = getReadabilityConfig();
  return !!(r && r.enabled);
}

function getVisualPriorityConfig() {
  var r = getReadabilityConfig();
  return (r && r.visualPriority && typeof r.visualPriority === 'object')
    ? r.visualPriority
    : { enabled: false, fatalAlphaFloor: 0.85, telegraphAlphaFloor: 0.60, enemyAlphaFloor: 0.70, feedbackAlphaMax: 0.70, ambientAlphaMax: 0.55 };
}

function getGlowPolicyConfig() {
  var r = getReadabilityConfig();
  return (r && r.glowPolicy && typeof r.glowPolicy === 'object')
    ? r.glowPolicy
    : { enabled: false, starAlphaMax: 0.70, backgroundAmbientMax: 0.10, bossAmbientGlowMax: 0.06, enemyBulletHaloMin: 0.10, telegraphGlowMin: 0.08, explosionAlphaMax: 0.55 };
}

function getAlphaPolicyConfig() {
  var r = getReadabilityConfig();
  return (r && r.alphaPolicy && typeof r.alphaPolicy === 'object')
    ? r.alphaPolicy
    : { enabled: true, fatal: { enemyBulletBody: 0.95, enemyBulletCore: 0.55 }, feedback: { playerGlow: 0.14 }, ambient: { starDepthAlphaMax: 0.70 } };
}

function getFXSuppressionConfig() {
  var r = getReadabilityConfig();
  return (r && r.fxSuppression && typeof r.fxSuppression === 'object')
    ? r.fxSuppression
    : { enabled: false, particlesBeforeBullets: true, hitFlashBodyAlpha: 0.42, hitFlashWhiteAlpha: 0.30, suppressOverlaysDuringTelegraph: true, maxExplosionParticles: 60 };
}

// HC-RD-02: bullet clarity accessor
function getBulletClarityConfig() {
  var r = getReadabilityConfig();
  return (r && r.bulletClarity && typeof r.bulletClarity === 'object')
    ? r.bulletClarity
    : { enabled: false, outline: { enabled: false }, motion: { enabled: false }, typeLanguage: { enabled: false }, density: { enabled: false } };
}

// HC-RD-03: telegraph consistency accessor
function getTelegraphConsistencyConfig() {
  var r = getReadabilityConfig();
  return (r && r.telegraphConsistency && typeof r.telegraphConsistency === 'object')
    ? r.telegraphConsistency
    : { enabled: false, outline: { enabled: false }, alpha: { enabled: false }, colors: {}, shape: {} };
}

// HC-RD-04: background readability accessor
function getBackgroundReadabilityConfig() {
  var r = getReadabilityConfig();
  return (r && r.backgroundReadability && typeof r.backgroundReadability === 'object')
    ? r.backgroundReadability
    : { enabled: false, themeCaps: { enabled: false }, stars: { enabled: false }, ambientFX: { enabled: false }, dynamicDimming: { enabled: false } };
}

// HC-RD-05: player feedback readability accessor
function getPlayerFeedbackConfig() {
  var r = getReadabilityConfig();
  return (r && r.playerFeedback && typeof r.playerFeedback === 'object')
    ? r.playerFeedback
    : { enabled: false, playerBullets: { enabled: false }, thruster: { enabled: false }, invincibility: { enabled: false }, silhouette: { enabled: false }, damage: { enabled: false } };
}

// HC-RD-06: HUD readability accessor
function getHUDReadabilityConfig() {
  var r = getReadabilityConfig();
  return (r && r.hudReadability && typeof r.hudReadability === 'object')
    ? r.hudReadability
    : { enabled: false, bossHP: { enabled: false }, bossWarning: { enabled: false }, levelClear: { enabled: false }, textGlow: { enabled: false }, overlays: { enabled: false } };
}

// HC-RD-08: mobile readability accessor
function getMobileReadabilityConfig() {
  var r = getReadabilityConfig();
  return (r && r.mobileReadability && typeof r.mobileReadability === 'object')
    ? r.mobileReadability
    : { enabled: false, controlDeck: { enabled: false }, smallScreen: { enabled: false } };
}

// HC-RD-09: freeze audit accessor
function getFreezeAuditConfig() {
  var r = getReadabilityConfig();
  return (r && r.freezeAudit && typeof r.freezeAudit === 'object')
    ? r.freezeAudit
    : { enabled: true, bossAuraCap: 0.30, muzzleFlashCoreMax: 0.55, waveAnnounceAlphaCap: 0.65, medalFeverAlphaCap: 0.70, flashOverlayMult: 0.06 };
}

// ============================================================
// HARDCORE HITBOX — helpers de colision y render
// ============================================================

function __hardcoreSafePlayer() {
  return (typeof player !== 'undefined' && player && typeof player.x === 'number');
}

function isHardcoreHitboxActive() {
  if (!isHardcoreEnabled()) return false;
  if (!__hardcoreSafePlayer()) return false;
  return true;
}

function getPlayerHitCenter() {
  if (!__hardcoreSafePlayer()) return { x: 0, y: 0 };
  return {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2
  };
}

function checkPlayerCollisionAABB(ox, oy, ow, oh) {
  if (!__hardcoreSafePlayer()) return false;

  if (!isHardcoreHitboxActive()) {
    return ox < player.x + player.width &&
           ox + ow > player.x &&
           oy < player.y + player.height &&
           oy + oh > player.y;
  }

  var cfg = getHardcorePlayerConfig();
  var r = cfg.hardcoreHitRadius;
  var cx = player.x + player.width / 2;
  var cy = player.y + player.height / 2;
  var closestX = ox < cx ? (ox + ow < cx ? ox + ow : cx) : (ox > cx ? ox : cx);
  var closestY = oy < cy ? (oy + oh < cy ? oy + oh : cy) : (oy > cy ? oy : cy);
  var dx = cx - closestX;
  var dy = cy - closestY;
  return (dx * dx + dy * dy) < (r * r);
}

function checkPlayerCollisionCircle(ox, oy, oRadius, normalPlayerRadius) {
  if (!__hardcoreSafePlayer()) return false;

  var playerR;
  if (isHardcoreHitboxActive()) {
    playerR = getHardcorePlayerConfig().hardcoreHitRadius;
  } else {
    playerR = (typeof normalPlayerRadius === 'number') ? normalPlayerRadius : 12;
  }

  var cx = player.x + player.width / 2;
  var cy = player.y + player.height / 2;
  var dx = cx - ox;
  var dy = cy - oy;
  var combined = playerR + oRadius;
  return (dx * dx + dy * dy) < (combined * combined);
}

function drawHardcorePlayerHitbox(ctx) {
  if (!ctx) return;
  var cfg = getHardcorePlayerConfig();
  if (!cfg.showHitbox) return;
  if (!isHardcoreHitboxActive()) return;

  var center = getPlayerHitCenter();
  var r = cfg.hardcoreHitRadius;

  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.strokeStyle = '#ff4444';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  ctx.restore();
}

// ============================================================
// HARDCORE GRAZE — sistema de roce de balas
// ============================================================

var _hardcoreGrazeCount = 0;
var _hardcoreGrazePulseTimer = 0;

function isGrazeActive() {
  if (!isHardcoreEnabled()) return false;
  var g = getGrazeConfig();
  return !!g.enabled;
}

function getGrazeCount() {
  return _hardcoreGrazeCount;
}

function resetGrazeCount() {
  _hardcoreGrazeCount = 0;
  _hardcoreGrazePulseTimer = 0;
}

function checkBulletGraze(b) {
  if (!b) return false;
  if (b.grazed) return false;
  if (!isGrazeActive()) return false;
  if (!__hardcoreSafePlayer()) return false;

  var g = getGrazeConfig();
  var center = getPlayerHitCenter();

  // Distancia minima entre rectangulo de bala y centro del jugador
  var closestX = b.x < center.x ? (b.x + b.w < center.x ? b.x + b.w : center.x) : (b.x > center.x ? b.x : center.x);
  var closestY = b.y < center.y ? (b.y + b.h < center.y ? b.y + b.h : center.y) : (b.y > center.y ? b.y : center.y);
  var dx = center.x - closestX;
  var dy = center.y - closestY;

  if ((dx * dx + dy * dy) < (g.radius * g.radius)) {
    b.grazed = true;
    return true;
  }
  return false;
}

function registerGraze(bulletRef) {
  _hardcoreGrazeCount++;
  var g = getGrazeConfig();

  if (typeof window.addHardcoreRank === 'function') {
    window.addHardcoreRank(0.35, 'graze');
  }

  if (typeof window.refreshHardcoreComboWindow === 'function') {
    window.refreshHardcoreComboWindow();
  }

  var finalScore = g.score;
  if (typeof addScore === 'function') {
    var grRankMult = (typeof window.getHardcoreRankScoreMultiplier === 'function')
      ? window.getHardcoreRankScoreMultiplier() : 1.00;
    var grComboMult = (typeof window.getHardcoreComboMultiplier === 'function')
      ? window.getHardcoreComboMultiplier() : 1.00;
    finalScore = Math.round(g.score * grRankMult * grComboMult);
    addScore(finalScore);
  }

  var gx = bulletRef ? bulletRef.x + (bulletRef.w || 0) / 2 : player.x + player.width / 2;
  var gy = bulletRef ? bulletRef.y : player.y;

  // Spark visual
  if (typeof createExplosion === 'function') {
    createExplosion(gx, gy, '#5ff', 5);
  }

  // Popup con score
  if (typeof spawnPopup === 'function') {
    spawnPopup(gx, gy, '+' + finalScore + ' GRAZE', '#5ff');
  }

  // HUD pulse
  _hardcoreGrazePulseTimer = 220;

  if (typeof AudioEngine !== 'undefined' && AudioEngine && typeof AudioEngine.playSfx === 'function') {
    AudioEngine.playSfx('graze');
  }
}

function drawHardcoreGrazeHUD(ctx) {
  if (!ctx) return;
  if (!isGrazeActive()) return;

  if (_hardcoreGrazePulseTimer > 0) {
    _hardcoreGrazePulseTimer = Math.max(0, _hardcoreGrazePulseTimer - 16.667);
  }

  var cfg = getGrazeConfig();
  var x = 128;
  var y = 56;
  var pulse = (_hardcoreGrazePulseTimer > 0)
    ? (0.6 + 0.4 * Math.sin(_hardcoreGrazePulseTimer * 0.06))
    : 1.0;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'right';
  ctx.font = '6px "Press Start 2P"';
  ctx.globalAlpha = 0.78 * pulse;
  ctx.fillStyle = 'rgba(100,255,200,0.78)';
  ctx.fillText('GRAZE', x + 44, y);
  ctx.textAlign = 'right';
  ctx.font = '7px "Press Start 2P"';
  ctx.fillStyle = _hardcoreGrazePulseTimer > 0 ? '#5ff' : '#fff';
  ctx.fillText(_hardcoreGrazeCount, x + 44, y + 12);
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ============================================================
// HARDCORE BULLET READABILITY — glow y trail visual
// ============================================================

function drawHardcoreBulletEnhancement(ctx, b, isBoss) {
  if (!ctx || !b) return;
  if (!isHardcoreEnabled()) return;

  var bc = getHardcoreBulletConfig();
  if (isBoss && !bc.bossGlow) return;
  if (!isBoss && !bc.enemyGlow) return;

  var x = b.x;
  var y = b.y;
  var w = b.w || 4;
  var h = b.h || 10;

  var styleInfo = typeof getEnemyBulletRenderStyle === 'function'
    ? getEnemyBulletRenderStyle(b)
    : { color: '#ff5050' };
  var color = styleInfo.color || '#ff5050';

  var savedAlpha = ctx.globalAlpha;

  if (isBoss) {
    // Boss: glow expansivo mas grande
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = color;
    ctx.fillRect(x - 6, y - 5, w + 12, h + 10);

    ctx.globalAlpha = 0.12;
    ctx.fillStyle = color;
    ctx.fillRect(x - 4, y - 3, w + 8, h + 6);

    // Trail direccional
    if (b.vy || b.vx) {
      var tx = (b.vx || 0) * 1.2;
      var ty = (b.vy || 0) * 1.2;
      ctx.globalAlpha = 0.07;
      ctx.fillRect(x - tx * 1.5, y - ty * 1.5, w, h);
      ctx.globalAlpha = 0.05;
      ctx.fillRect(x - tx * 3, y - ty * 3, w, h);
    }
  } else {
    // Enemy: glow externo sutil
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = color;
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);

    ctx.globalAlpha = 0.10;
    ctx.fillStyle = color;
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

    // Trail direccional ligero
    if (b.vy || b.vx) {
      var tx2 = (b.vx || 0) * 1.0;
      var ty2 = (b.vy || 0) * 1.0;
      ctx.globalAlpha = 0.05;
      ctx.fillRect(x - tx2 * 2, y - ty2 * 2, w, h);
    }
  }

  ctx.globalAlpha = savedAlpha;
}
