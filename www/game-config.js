// ==============================
// GALAXY RAIDERS - game-config.js
// Configuracion base para modo hardcore y sistemas relacionados
// ==============================

window.GALAXY_CONFIG = {

  // ============ HARDCORE MASTER SWITCH ============
  hardcore: {
    enabled: true   // HC-12: hardcore only
  },

  // ============ PLAYER (hitbox reducida en hardcore) ============
  player: {
    hardcoreHitRadius: 3,
    showHitbox: false
  },

  // ============ GRAZE (roce de balas) ============
  graze: {
    enabled: true,   // HC-12: active by default
    radius: 24,
    score: 5
  },

  // ============ RANK (dificultad dinamica) ============
  rank: {
    enabled: true,
    baseLevel: 0,
    min: 0,
    max: 100,
    maxLevel: 5,
    bulletSpeedMax: 1.12,
    cooldownMin: 0.88,
    multiplierMax: 1.5,
    decayDelayMs: 6000,
    decayAmount: 0.15,
    decayIntervalMs: 1000
  },

  // ============ BULLETS (efectos visuales) ============
  bullets: {
    enemyGlow: false,
    bossGlow: false
  },

  // ============ SCORE (combo y multiplicadores) ============
  score: {
    comboEnabled: true   // HC-12: active by default
  },

  // ============ COMBO (sistema de combo hardcore) ============
  combo: {
    enabled: true,
    timeoutMs: 2500,
    maxMultiplier: 2.0,
    graceMs: 350,
    warningMs: 700
  },

  // ============ PRESSURE (HC-43/44: wave pressure director) ============
  pressure: {
    enabled: true,
    minMultiplier: 1.00,
    maxMultiplier: 1.18,
    levels: {
      LOW: 1.00,
      NORMAL: 1.06,
      HIGH: 1.12,
      MAX: 1.18
    }
  },

  // ============ RHYTHM (HC-78/79: stage wave rhythm) ============
  rhythm: {
    enabled: true,
    wavePauseMinScale: 0.75,
    introMinScale: 0.72,
    entryDelayMinScale: 0.70
  },

  // ============ BACKGROUND ============
  background: {
    hc90Enabled: true,
    nebulaEnabled: true,
    colorGradingEnabled: true,
    maxStars: 180
  },

  // ============ ATMOSPHERE ============
  atmosphere: {
    enabled: true,
    dustEnabled: true,
    speedLinesEnabled: true,
    ambientFlashEnabled: true
  },

  // ============ SPRITES ============
  sprites: {
    enabled: true,
    fallbackToLegacy: true,
    debugMissingSprites: false
  },

  // ============ BOSS AI MOVEMENT ============
  bossAI: {
    enabled: true,
    maxOffsetX: 70,
    maxOffsetY: 35
  },

  // ============ ENEMY TACTICAL AI ============
  enemyAI: {
    enabled: true,
    maxOffsetX: 18,
    maxOffsetY: 10,
    decisionIntervalMs: 500
  },

  // ============ ENCOUNTER DIRECTOR (HC-125→129) ============
  encounterDirector: {
    // enabled: true,                    // master kill switch (default: true)
    silenceOnDeathMs: 400,               // silence after enemy death (was 420)
    earlySilenceOnDeathMs: 300,          // shorter silence for levels ≤5 (was 320)
    // earlySilenceMaxLevel: 5,         // max level for early silence (default: 5)
    // silenceOnWaveClearMs: 900,       // silence after wave clear (default: 900)
    // silenceMaxMs: 2000,              // absolute silence cap (default: 2000)
    // spawnStaggerMs: 220,             // min cooldown between spawns (default: 220)
    // pressureSmoothingIn: 0.08,       // pressure rise speed (default: 0.08)
    pressureSmoothingOut: 0.045,         // pressure fall speed (was 0.040, 0.035)
    reliefThreshold: 0.62,               // lower relief activation threshold (was hardcoded 0.70)
    reliefDecayMult: 2.5,               // stronger relief decay (was hardcoded 2.2)
    reliefMaxBullets: 24,               // bullet gate for relief (was hardcoded 6)
    // levelResetPressureCarryMax: 0.45, // max pressure carried to next level (default: 0.45)
    // maxStaggerDelayMs: 850,          // max stagger delay per enemy (default: 850)
    // recentMemory: 12,                // cap for recent arrays (default: 12)
  },

  // ================================================================
  // HC-RD-01: VISUAL PRIORITY SYSTEM — readability config
  // ================================================================
  // Layers enforce draw order separation so lethal threats dominate:
  //   PRIORITY_FATAL     — enemy bullets, boss lethal patterns
  //   PRIORITY_TELEGRAPH — attack warnings, sniper lines, diver signals
  //   PRIORITY_ENEMY     — enemy sprites, boss visuals
  //   PRIORITY_FEEDBACK  — player, powerups, explosions, popups, HUD
  //   PRIORITY_AMBIENT   — background, stars, atmospheric FX
  // ================================================================
  readability: {
    enabled: true,                       // master kill switch (render-only)

    // --- VISUAL PRIORITY LAYERS ---
    visualPriority: {
      enabled: true,
      // draw-order grouping enforced via comment markers in draw.js
      fatalAlphaFloor:     0.85,        // PRIORITY_FATAL minimum body alpha
      telegraphAlphaFloor: 0.60,        // PRIORITY_TELEGRAPH minimum alpha
      enemyAlphaFloor:     0.70,        // PRIORITY_ENEMY minimum body alpha
      feedbackAlphaMax:    0.70,        // PRIORITY_FEEDBACK alpha ceiling
      ambientAlphaMax:     0.55         // PRIORITY_AMBIENT alpha ceiling
    },

    // --- GLOW POLICY ---
    // Reduce decorative glow; keep bullets/telegraphs legible.
    glowPolicy: {
      enabled: true,
      // ambient / decorative glow caps
      starAlphaMax:         0.70,        // was effectively 1.0 (computed)
      backgroundAmbientMax: 0.10,        // was up to 0.18
      bossAmbientGlowMax:   0.06,        // was up to 0.11+0.03*sin
      // bullet / telegraph glow floor
      enemyBulletHaloMin:   0.10,        // outer halo min alpha
      telegraphGlowMin:     0.08,        // telegraph visibility floor
      // explosion policy
      explosionAlphaMax:    0.55         // prevent explosions from dominating
    },

    // --- ALPHA POLICY ---
    // Fatal threats ALTA, feedback MEDIA, ambient BAJA.
    alphaPolicy: {
      enabled: true,
      fatal: {
        enemyBulletBody:    0.95,        // was 1.0  (slight reduction avoids burn-in)
        enemyBulletCore:    0.55,        // was 0.48-0.65
        enemyBulletOuterHalo: 0.12,      // was 0.10-0.12
        enemyBulletInnerGlow: 0.22       // was 0.18-0.22
      },
      feedback: {
        playerGlow:         0.14,        // was 0.18 (core glow)
        explosionParticle:  0.65,        // was up to 1.0 (particle life)
        hitFlashMax:        0.45,        // was up to 0.62 (hit flash body)
        popupAlpha:         0.85,        // was 1.0
        powerupGlow:        0.20         // was up to 0.28
      },
      ambient: {
        starDepthAlphaMax:  0.70,        // was up to 1.0 computed
        backgroundLayer:    0.08,        // was up to 0.12-0.18
        nebulaAlpha:        0.04,        // was up to 1.0 (HC-90)
        dustAlpha:          0.18         // was up to 0.25 (HC-97)
      }
    },

    // --- FX SUPPRESSION ---
    // Explosions no tapan bullets. Hit flashes no ocultan disparos.
    // Overlays no compiten con telegraphs.
    fxSuppression: {
      enabled: true,
      // particles (explosions) render BEFORE enemy bullets
      particlesBeforeBullets: true,
      // hit flash alpha reduction
      hitFlashBodyAlpha:     0.42,       // was up to 0.62
      hitFlashWhiteAlpha:    0.30,       // was up to ~0.36
      // overlay suppression during telegraphs
      suppressOverlaysDuringTelegraph: true,
      // death explosion particle cap
      maxExplosionParticles: 60          // was 100 default
    }
  },

  // ============ DEBUG ============
  debug: {
    showHardcoreInfo: false,
    showRank: false,
    showHardcoreSystems: false,
    showEnemyRoles: false,
    showBossPattern: false,
    showBossDispatch: false,
    showBackgroundStats: false,
    showAtmosphereStats: false,
    showLevelSkipButton: false
  }

};

// HC-130: wire Encounter Director config from GALAXY_CONFIG.encounterDirector
if (window.GALAXY_CONFIG && window.GALAXY_CONFIG.encounterDirector) {
  window.ENCOUNTER_DIRECTOR_CONFIG = window.GALAXY_CONFIG.encounterDirector;
}
