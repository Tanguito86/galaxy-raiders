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
    score: 5,
    // HC-SC-05: enhanced graze economy
    radiusHardcore: 18,
    scoreBase: 12,
    maxPerBullet: 4,
    sameBulletCooldownFrames: 20,
    repeatPenalty: 0.35,
    // HC-CAL-04: increased graze base score
    scoreBaseCalibrated: 20
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
    decayAmount: 0.2,
    decayIntervalMs: 1000,

    // HC-RK-02: performance tracking
    survivalRankIntervalMs: 5000,
    survivalRankAmount: 0.5,
    accuracyCheckIntervalMs: 4000,
    accuracyBonusThreshold: 70,
    accuracyBonusAmount: 0.3,
    waveSpeedBonusAmount: 0.5,
    dominatingHitlessMs: 15000,
    recoveringMs: 4000,

    // HC-RK-03: fairness caps & safety governor
    safetyBulletSpeedMax: 1.08,
    safetyCooldownFloorMs: 450,
    safetyWavePauseFloorMs: 600,
    safetyCombinedCeiling: 5.20,
    safetyRecoveryLimit: 2,
    safetyBossRankCeilings: { crossfire: 5, zigzag: 5, rotate: 5, divebomb: 5, supreme: 4 },
    safetyWaveIntensityCeiling: 0.85,
    safetyAntiSpikeMaxStep: 8,
    safetySpikeCooldownMs: 2000,

    // HC-RK-04: master switch for rank effects on gameplay
    gameplayEffectsEnabled: true
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
    debugMissingSprites: true
  },

  // ============ SPRITE LAB (Phase A kill switches) ============
  // Set a key to false to disable that feature and revert to the prior tier.
  spriteLab: {
    playerS04Wedge: true,  // false → reverts to player_wedge tier
    factionScout: true     // false → reverts to fleet_scout/interceptor tier
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

  // ============ BOSS DIRECTOR (HC-BD-01) ============
  // Sistema de direccion de bosses: taxonomy, orchestration rules,
  // validation, recovery windows, rage phases, transitions.
  // OFF por defecto — se activa cuando HC-BD este listo.
  bossDirector: {
    enableBossDirector: false,
    enableBossTelemetry: false,
    enableBossRecoveryRules: false,
    enableBossFairnessValidation: false,
    enableBossTransitions: false,
    enableBossRageRules: false,
    enableBossSignatureIntents: false,
    enableCrabtronSignatureHook: false,
    enableSerpentrixSignatureHook: false,
    enableOrbitalSignatureHook: false,
    enableTenienteSignatureHook: false,
    enableEmperadorSignatureHook: false
  },

  // ============ SCORE SYSTEM (HC-SC-02) ============
  scoreSystem: {
    enabled: true,
    telemetry: { enabled: true, trackSources: true },
    sourceColors: true,
    debug: { overlay: false },

    // HC-SC-04: mastery multiplier
    multiplier: {
      enabled: true,
      base: 1.0,
      max: 3.0,
      gain: {
        enemyKill: 0.015,
        closeRange: 0.020,
        graze: 0.010,
        bossHit: 0.008
      },
      decay: {
        idleDelayFrames: 180,
        ratePerFrame: 0.0008
      },
      penalties: {
        deathLossPercent: 0.30,
        hitLossPercent: 0.10
      }
    },

    // HC-SC-06: aggression & close-range scoring
    aggression: {
      enabled: true,
      closeRange: {
        near: 60,
        mid: 120,
        bonus: {
          near: 1.75,
          mid: 1.30
        }
      },
      dangerWindow: {
        enabled: true,
        frames: 90,
        bonus: 1.10
      },

      // HC-SC-07: medal chain economy
      medals: {
        chain: {
          decayEnabled: true,
          missTierLoss: 2,
          recoveryGraceFrames: 90
        },
        multiplier: {
          gainPerMedal: 0.020,
          lossPerMiss: 0.010
        },
        antiExploit: {
          maxDropsPerWave: 12
        }
      },

      // HC-SC-08: boss efficiency & no-hit rewards
      bossScoring: {
        efficiency: {
          targetPhaseMs: 15000,
          eliteBonus: 2.0,
          eliteThreshold: 0.75,
          goodBonus: 1.4,
          goodThreshold: 1.0
        },
        noHit: {
          phaseBonus: 2500,
          fullBossBonus: 10000
        },
        antiMilk: {
          softCapMs: 30000,
          scoreDecayAfter: 0.50
        },
        multiplier: {
          phaseClearGain: 0.050
        }
      },

      // HC-SC-09: recovery & survival mastery
      survivalScoring: {
        recovery: {
          enabled: true,
          windowFrames: 900,
          multiplierRestore: 0.10,
          scoreBonus: 1500
        },
        noHit: {
          waveBonus: 750,
          stageBonus: 5000
        },
        survivalChain: {
          levels: [30, 60, 120],
          multiplierGain: [0.03, 0.06, 0.10]
        },
        antiCamping: {
          idleFrames: 600,
          disableWhileIdle: true
        }
      },

      // HC-SC-10: rank-score synergy & calibration
      rankScoreSynergy: {
        enabled: true,
        multiplierGainBoost: {
          rank1: 1.00,
          rank3: 1.08,
          rank5: 1.15
        },
        grazeOpportunityBonus: {
          rank1: 1.00,
          rank5: 1.20
        },
        calibration: {
          debugOverlay: false
        }
      }
    }
  },

  // ============ STAGE DIRECTOR (HC-ST-02) ============
  stageDirector: {
    enabled: true,
    maxConsecutivePressure: 3,
    recoveryMinMs: 10000,
    recoveryMaxIntensity: 0.30,
    bossPreludeMinMs: 8000,
    ambushMinSectionGap: 2,
    setpieceMinLevelGap: 3,
    survivalCorridorMinLevel: 14,
    miniSetpieceCooldownSections: 3,
    climaxIntensityMultiplier: 1.15,
    telemetry: false
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
    },

    // ================================================================
    // HC-RD-02: BULLET CLARITY PASS
    // ================================================================
    // Every enemy bullet gets a dark outline for instant background
    // separation. Trails are enhanced for motion tracking. Bullet types
    // are visually differentiated by outline thickness and direction
    // markers. Glow stacking is capped to prevent density blobs.
    // ================================================================
    bulletClarity: {
      enabled: true,

      // --- outline system ---
      outline: {
        enabled: true,
        color:            '#050308',     // near-black for max contrast
        alpha:             0.42,         // enough to read, not too heavy
        lineWidth:         1,            // 1px standard
        bossLineWidth:     1.5,          // thicker for boss bullets
        tankLineWidth:     1.5,          // thicker for tank (alien3)
        orbConcentric:     true          // orb gets inner + outer outline
      },

      // --- motion readability ---
      motion: {
        enabled: true,
        bossTrailSteps:    4,            // was 3
        orbTrailSteps:     3,            // was 2
        sharedTrailSteps:  3,            // was 2
        trailAlphaMul:     0.72          // was 0.6 (slightly brighter trails)
      },

      // --- bullet type language ---
      typeLanguage: {
        enabled: true,
        fastDirectionalTip: true,        // tiny bright dot at leading edge
        heavyInnerOutline:  true,        // orb double outline
        splitterPulseEnable: true        // splitter outline pulses
      },

      // --- density readability ---
      density: {
        enabled: true,
        outerHaloCap:       0.10,        // max outer halo alpha (was 0.12)
        innerGlowCap:       0.20,        // max inner glow alpha (unchanged)
        trailStepsMin:      2            // minimum trail steps for any bullet
      }
    },

    // ================================================================
    // HC-RD-03: TELEGRAPH CONSISTENCY SYSTEM
    // ================================================================
    // Unified visual language for all attack warnings: boss rings,
    // sniper lines, chaser flares, suppressor cones, diver signals,
    // set piece stripes, threat dots, phase transitions.
    // Every telegraph gets a dark outline for background separation
    // plus standardized alpha ranges and color language.
    // ================================================================
    telegraphConsistency: {
      enabled: true,

      // --- outline system (shared with HC-RD-02 bullet pattern) ---
      outline: {
        enabled: true,
        color:         '#050308',         // near-black for max contrast
        alpha:          0.40,             // subtle but readable
        lineWidth:      1,                // 1px standard
        bossLineWidth:  1.5               // thicker for boss rings
      },

      // --- alpha standardization ---
      alpha: {
        enabled: true,
        floor:          0.12,             // minimum alpha for any telegraph
        ceiling:        0.55,             // maximum alpha to avoid dominance
        pulseRange:     0.35              // max pulse amplitude
      },

      // --- color language (hardcore meaning) ---
      colors: {
        fatal:         '#ff3333',         // red — lethal immediate
        aggressive:    '#ff6622',         // orange — aggressive threat
        charge:        '#ffaa00',         // yellow — preparation/charging
        energy:        '#4488ff',         // blue — energy/non-lethal
        clarity:       '#ffffff',         // white — pure readability
        caution:       '#ffdd44',         // amber — general warning
        sniper:        '#44ffff',         // cyan — precision threat
        chaser:        '#ff6622',         // orange — flanking
        suppressor:    '#bbff44',         // lime — area denial
        diver:         '#ff4422',         // red-orange — dive
        teleport:      '#bb88ff',         // purple — displacement
        setPiece:      '#ff6633'          // red-orange for formations
      },

      // --- shape conventions ---
      shape: {
        ringDash:      [6, 4],            // dotted ring pattern
        arrowLength:    16,               // direction arrow length
        coneAngle:      0.28,             // suppressor fan angle
        dotRadius:      3.5               // threat dot size
      }
    },

    // ================================================================
    // HC-RD-04: BACKGROUND READABILITY PASS
    // ================================================================
    // Background and ambient FX must never compete with gameplay.
    // Theme foreground elements are capped. Stars are subdued.
    // Dynamic dimming reduces ambient intensity during combat.
    // ================================================================
    backgroundReadability: {
      enabled: true,

      // --- background theme element caps ---
      themeCaps: {
        enabled: true,
        foregroundMax:      0.30,          // earth buildings/ground (was 0.90-0.96)
        mountainMax:        0.10,          // mountain silhouettes (was 0.12-0.16)
        snowHazeMax:        0.06,          // snow/mist/haze layers (was 0.07-0.10)
        planetGlowMax:      0.12,          // planet curve/limb (was 0.18-0.22)
        imperialPillarMax:  0.04           // imperial pillar glow (was 0.05-0.09)
      },

      // --- starfield ---
      stars: {
        enabled: true,
        alphaCap:           0.42,          // was 0.70 (HC-RD-01), now tighter
        coreAlphaCap:       0.28,          // bright star core (was up to 0.70)
        flickerReduction:   0.80           // multiply twinkle amplitude by 0.8
      },

      // --- ambient FX multiplier (applied to HC-90/HC-97) ---
      ambientFX: {
        enabled: true,
        nebulaAlphaMul:     0.55,          // reduce nebula intensity
        atmosphereAlphaMul: 0.60,          // reduce atmosphere FX
        speedLineAlphaMul:  0.45           // reduce speed lines
      },

      // --- dynamic combat dimming ---
      dynamicDimming: {
        enabled: true,
        densityThreshold:   18,            // total enemy bullets to trigger dimming
        maxDimFactor:       0.50,          // max multiplier on ambient alpha
        dimSpeed:           0.015,         // transition speed per frame (smooth)
        recoverSpeed:       0.008          // recovery speed per frame (slower)
      }
    },

    // ================================================================
    // HC-RD-05: PLAYER FEEDBACK READABILITY
    // ================================================================
    // Player visuals must never compete with enemy threats.
    // Bullets subdued, thruster toned down, invincibility always
    // readable, silhouette preserved against backgrounds.
    // ================================================================
    playerFeedback: {
      enabled: true,

      // --- player bullet glow reduction ---
      playerBullets: {
        enabled: true,
        glowMul:            0.65,          // multiply all glow values by 0.65
        bodyAlphaMax:       0.90,          // max body alpha (was 1.0)
        trailAlphaCap:      0.22           // trail alpha cap (was 0.28)
      },

      // --- thruster reduction ---
      thruster: {
        enabled: true,
        maxAlpha:           0.45,          // was 0.70 (yellow core)
        midAlpha:           0.35,          // was 0.50 + 0.35*pulse (orange)
        glowAlpha:          0.04           // was 0.06 + 0.06*pulse (cyan engine)
      },

      // --- invincibility readability ---
      invincibility: {
        enabled: true,
        constantOutlineAlpha: 0.15,        // subtle outline always visible
        fillAlpha:            0.08,        // was 0.12 + shieldPulse * 0.08
        strokeAlpha:          0.28,        // was 0.35 + shieldBlink * 0.20
        innerStrokeAlpha:     0.12         // was 0.18 + shieldPulse * 0.12
      },

      // --- player silhouette outline ---
      silhouette: {
        enabled: true,
        outlineColor:        '#040815',    // dark outline for separation
        outlineAlpha:        0.25,         // subtle but present
        outlineWidth:        1             // 1px
      },

      // --- damage feedback ---
      damage: {
        enabled: true,
        screenFlashAlphaCap: 0.06          // was up to 0.08 (flash overlay)
      }
    },

    // ================================================================
    // HC-RD-06: HUD READABILITY PASS
    // ================================================================
    // HUD must inform without distracting from gameplay.
    // Boss HP bar subdued, warning overlays restrained,
    // text glow reduced, overlays never compete with bullets.
    // ================================================================
    hudReadability: {
      enabled: true,

      // --- boss HP bar ---
      bossHP: {
        enabled: true,
        fillAlpha:          0.65,          // was 0.85
        accentAlpha:        0.35,          // was 0.55
        bgAlpha:            0.18,          // was 0.25
        borderAlpha:        0.20,          // was 0.30
        lowHPPulseMax:      0.18           // was 0.30
      },

      // --- boss WARNING overlay ---
      bossWarning: {
        enabled: true,
        darkBandAlpha:      0.18,          // was 0.30
        accentAlpha:        0.40,          // was 0.65 * pulse
        textAlpha:          0.60,          // was 0.90 * pulse
        sidePillarMax:      0.25,          // was 0.43
        stripeAlpha:        0.05           // was 0.09
      },

      // --- level clear overlay ---
      levelClear: {
        enabled: true,
        darkBandAlpha:      0.22,          // was 0.35
        bracketAlpha:       0.45,          // was 0.75
        borderAlpha:        0.30,          // was 0.50
        glowShadowBlur:     12             // was 18
      },

      // --- text glow ---
      textGlow: {
        enabled: true,
        shadowBlurMax:      5,             // was 8 (drawGlowText default)
        shadowAlphaMul:     0.60           // multiply glow alpha
      },

      // --- overlay darkening ---
      overlays: {
        enabled: true,
        pauseBgAlpha:       0.65,          // was 0.72
        gameoverBgAlpha:    0.72,          // was 0.82
        overlayPanelAlpha:  0.90           // was 0.94 (drawOverlayPanel)
      }
    },

    // ================================================================
    // HC-RD-08: MOBILE / SMALL-SCREEN READABILITY
    // ================================================================
    // On small viewports (phones), increase readability multipliers
    // and reduce control deck opacity so threats remain visible
    // behind the touch control overlay at the bottom.
    // ================================================================
    mobileReadability: {
      enabled: true,

      // --- control deck transparency during gameplay ---
      controlDeck: {
        enabled: true,
        gameplayOpacity:    0.64           // was 1.0 (fully opaque), now semi-transparent
      },

      // --- small-screen sprite readability boost ---
      smallScreen: {
        enabled: true,
        thresholdHeight:    500,           // CSS px below which we consider "small screen"
        bossScaleBoost:     1.12,          // multiply BOSS_READABILITY_MULT by this
        enemyScaleBoost:    1.10,          // multiply ENEMY_READABILITY_MULT by this
        hudFontBoost:       1              // extra px for HUD fonts (NOT applied — HUD is fixed canvas)
      }
    },

    // ================================================================
    // HC-RD-07/09: FREEZE AUDIT — final tuning caps
    // ================================================================
    // Fine-tuning caps applied during freeze-frame audit.
    // Prevents specific elements from competing with threats.
    // ================================================================
    freezeAudit: {
      enabled: true,

      // --- boss ambient aura caps ---
      bossAuraCap:         0.30,          // max outer fill alpha for all 4 boss auras

      // --- muzzle flash ---
      muzzleFlashCoreMax:  0.55,          // player weapon muzzle flash white core cap

      // --- center-screen overlays ---
      waveAnnounceAlphaCap: 0.65,         // wave announcement text max alpha
      medalFeverAlphaCap:   0.70,         // medal FEVER text max alpha
      flashOverlayMult:     0.06          // damage flash overlay multiplier (was 0.08)
    }
  },

  // ============ HC WAVE COMPOSER (HC-WC-03) ============
  HC_WAVE_COMPOSER: {
    enabled: true,
    useProfiles: true,                    // HC-WC-04: enable curated wave profiles
    phaseDurations: {
      INTRO:   { normal: 1200, setpiece: 2000 },
      BUILD:   { normal: 4000, setpiece: 5000 },
      PEAK:    { threshold: 0.40, minDuration: 3000 },
      RESOLVE: { threshold: 0.40, maxDuration: 8000 },
      RELIEF:  { afterClear: 900, maxContinuous: 3000 }
    },
    spawnSpacing: {
      entryBaseMs: 180,
      entryMaxMs: 600,
      groupGapMs: 800,
      roleActivationOffset: 1200
    },
    buildTiming: {
      sweeperDelay:    0,
      baiterDelay:     200,
      suppressorDelay: 1500,
      flankerDelay:    1800,
      sniperDelay:     2800,
      anchorDelay:     3500,
      diverDelay:      4000,
      chaserDelay:     4200
    },
    peakLimits: {
      maxSimultaneousPatterns: 3,
      maxBullets: 30,
      interPatternGapMs: 200,
      diveWaveGapMs: 2500
    },
    resolveTiming: {
      decayDelayMs: 500,
      diverSuspend: true,
      sniperSuspend: true,
      suppressorSuspend: true,
      chaserSuspend: true
    },
    reliefTiming: {
      bulletMax: 6,
      silenceAfterClear: 900,
      powerupEligible: true
    },
    threatCaps: {
      totalActiveRoles: 5,
      simultaneousDivers: 2,
      simultaneousSnipers: 3,
      simultaneousChasers: 1
    },
    telegraphLeadIn: {
      introVisualMs: 600,
      phaseTransitionFlash: 200,
      ambushWarningMs: 400
    }
  },

  // ============ DEBUG ============
  debug: {
    showHardcoreInfo: false,
    showRank: false,
    showRankDebug: false,
    showHardcoreSystems: false,
    showEnemyRoles: false,
    showBossPattern: false,
    showBossDispatch: false,
    showBackgroundStats: false,
    showAtmosphereStats: false,
    showLevelSkipButton: false,
    showHitboxDebug: false,
    showWaveComposer: false
  }

};

// HC-130: wire Encounter Director config from GALAXY_CONFIG.encounterDirector
if (window.GALAXY_CONFIG && window.GALAXY_CONFIG.encounterDirector) {
  window.ENCOUNTER_DIRECTOR_CONFIG = window.GALAXY_CONFIG.encounterDirector;
}
