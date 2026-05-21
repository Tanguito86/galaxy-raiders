// ============================================================
// GALAXY RAIDERS — hc-wc-profiles.js
// HC-WC-04: Wave Composition Profiles & Curated Waves
// ============================================================
// STATUS: CURATED — profile-driven wave identity, composition, pacing.
// Integrates with: hc-wave-composer.js, entities.js, Encounter Director.
// Replaces: Math.random() composition, generic wave behavior.
// ============================================================

(function(global) {
  'use strict';

  // ============================================================
  // PROFILE DEFINITIONS — 24 wave profiles
  // ============================================================

  var PROFILES = {

    // ---- FOUNDATION TIER ----

    FND_tutorial: {
      label: 'FIRST CONTACT',
      tier: 'foundation',
      tacticalPurpose: 'Teach basic dodging and formation reading.',
      dominantRole: 'sweeper',
      secondaryRole: 'baiter',
      forbiddenRoles: ['diver','chaser','suppressor','sniper'],
      allowedSupport: [],
      composition: { sweeper: 8, baiter: 2 },
      phaseDurations: { INTRO: 1500, BUILD: 3000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 500 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 15, interPatternGapMs: 300 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_clear',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'sparse_line',
      formationRows: 2,
      formationCols: 5,
      formationSpacing: 64,
      bannerText: 'FIRST CONTACT',
      escapeLanes: 3,
      threatBudget: 18
    },

    FND_staggered_entry: {
      label: 'STAGGERED ENTRY',
      tier: 'foundation',
      tacticalPurpose: 'Teach reading enemy arrivals in sequence.',
      dominantRole: 'sweeper',
      secondaryRole: 'sniper',
      forbiddenRoles: ['diver','chaser','suppressor'],
      allowedSupport: ['baiter'],
      composition: { sweeper: 6, sniper: 2, baiter: 1 },
      phaseDurations: { INTRO: 1200, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 400, sniperDelay: 2000 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 18, interPatternGapMs: 250 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_clear',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 3,
      formationSpacing: 56,
      bannerText: 'STAGGERED ENTRY',
      escapeLanes: 2,
      threatBudget: 24
    },

    FND_recovery_breather: {
      label: 'REGROUP',
      tier: 'foundation',
      tacticalPurpose: 'Give player recovery time. Reward survival.',
      dominantRole: 'sweeper',
      secondaryRole: null,
      forbiddenRoles: ['diver','sniper','chaser','suppressor','flanker'],
      allowedSupport: ['baiter'],
      composition: { sweeper: 5, baiter: 2 },
      phaseDurations: { INTRO: 1000, BUILD: 2000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 600 },
      peakLimits: { maxSimultaneousPatterns: 1, maxBullets: 8, interPatternGapMs: 400 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'this_is_relief',
      entryStyle: 'fade_in',
      entrySide: 'top',
      formationKey: 'sparse_line',
      formationRows: 1,
      formationCols: 7,
      formationSpacing: 80,
      bannerText: 'REGROUP',
      escapeLanes: 5,
      threatBudget: 12,
      guaranteedPowerup: true
    },

    FND_formation_reading: {
      label: 'VANGUARD LINE',
      tier: 'foundation',
      tacticalPurpose: 'Teach formation shape recognition for movement planning.',
      dominantRole: 'sweeper',
      secondaryRole: 'baiter',
      forbiddenRoles: ['diver','chaser','suppressor'],
      allowedSupport: ['sniper'],
      composition: { sweeper: 6, sniper: 2, baiter: 2 },
      phaseDurations: { INTRO: 1500, BUILD: 3500 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 300, sniperDelay: 2200 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 18, interPatternGapMs: 250 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_clear',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'vshape',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 50,
      bannerText: 'VANGUARD LINE',
      escapeLanes: 2,
      threatBudget: 24
    },

    FND_dual_role: {
      label: 'DUAL ROLE INTRO',
      tier: 'foundation',
      tacticalPurpose: 'Introduce reading two threat types simultaneously.',
      dominantRole: 'sweeper',
      secondaryRole: 'sniper',
      forbiddenRoles: ['diver','chaser','suppressor','flanker'],
      allowedSupport: [],
      composition: { sweeper: 7, sniper: 3 },
      phaseDurations: { INTRO: 1200, BUILD: 3500 },
      buildTiming: { sweeperDelay: 0, sniperDelay: 2200 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 20, interPatternGapMs: 250 },
      resolveTiming: { diverSuspend: true, sniperSuspend: false, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_clear',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 52,
      bannerText: 'DUAL THREAT',
      escapeLanes: 2,
      threatBudget: 30
    },

    // ---- TACTICAL TIER ----

    TAC_lane_denial: {
      label: 'DIVISION BREACH',
      tier: 'tactical',
      tacticalPurpose: 'One lane is dangerous. Player must find the safe lane.',
      dominantRole: 'suppressor',
      secondaryRole: 'sweeper',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['baiter','sniper'],
      composition: { suppressor: 3, sweeper: 5, sniper: 2, baiter: 2 },
      phaseDurations: { INTRO: 1200, BUILD: 3500 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 200, suppressorDelay: 1500, sniperDelay: 2800 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 22, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_peak',
      entryStyle: 'slide_in',
      entrySide: 'right',
      formationKey: 'column_asymmetric',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 48,
      bannerText: 'DIVISION BREACH',
      escapeLanes: 2,
      threatBudget: 30
    },

    TAC_rotating_pressure: {
      label: 'ROTATING PRESSURE',
      tier: 'tactical',
      tacticalPurpose: 'Threat rotates cyclically. Player must reposition.',
      dominantRole: 'sweeper',
      secondaryRole: 'sniper',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['flanker'],
      composition: { sweeper: 5, sniper: 3, flanker: 2 },
      phaseDurations: { INTRO: 1400, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, flankerDelay: 1800, sniperDelay: 2600 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 22, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'per_column',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'three_columns',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 64,
      bannerText: 'ROTATING PRESSURE',
      escapeLanes: 2,
      threatBudget: 30
    },

    TAC_pincer: {
      label: 'PINCER ASSAULT',
      tier: 'tactical',
      tacticalPurpose: 'Enemies close from both flanks. Center is safe.',
      dominantRole: 'flanker',
      secondaryRole: 'diver',
      forbiddenRoles: ['suppressor','chaser'],
      allowedSupport: ['sweeper','sniper'],
      composition: { flanker: 6, diver: 2, sweeper: 4, sniper: 2 },
      phaseDurations: { INTRO: 2000, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, flankerDelay: 1800, sniperDelay: 2800, diverDelay: 4000 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 26, interPatternGapMs: 200, diveWaveGapMs: 2500 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'center_lane_always',
      entryStyle: 'pincer_entry',
      entrySide: 'edges',
      formationKey: 'pincer',
      formationRows: 4,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: 'PINCER ASSAULT',
      escapeLanes: 1,
      threatBudget: 42
    },

    TAC_crossfire_trap: {
      label: 'CROSSFIRE TRAP',
      tier: 'tactical',
      tacticalPurpose: 'Diagonal fire from edges. Safe zone in center.',
      dominantRole: 'sniper',
      secondaryRole: 'flanker',
      forbiddenRoles: ['diver','chaser','suppressor'],
      allowedSupport: ['sweeper'],
      composition: { sniper: 4, flanker: 3, sweeper: 4 },
      phaseDurations: { INTRO: 1400, BUILD: 3800 },
      buildTiming: { sweeperDelay: 0, flankerDelay: 1500, sniperDelay: 2600 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 24, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'center_zone',
      entryStyle: 'fade_in',
      entrySide: 'edges',
      formationKey: 'edge_columns',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 56,
      bannerText: 'CROSSFIRE TRAP',
      escapeLanes: 1,
      threatBudget: 36
    },

    TAC_hunter_dive: {
      label: 'HUNTER DIVE',
      tier: 'tactical',
      tacticalPurpose: 'Staggered dive waves. Dodge vertically in rhythm.',
      dominantRole: 'diver',
      secondaryRole: 'sweeper',
      forbiddenRoles: ['chaser','suppressor','sniper'],
      allowedSupport: ['baiter'],
      composition: { diver: 3, sweeper: 6, baiter: 2 },
      phaseDurations: { INTRO: 1400, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 200, diverDelay: 3800 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 20, interPatternGapMs: 250, diveWaveGapMs: 2200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'between_dive_waves',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 52,
      bannerText: 'HUNTER DIVE',
      escapeLanes: 2,
      threatBudget: 36
    },

    TAC_bait_punish: {
      label: 'HUNTING PACK',
      tier: 'tactical',
      tacticalPurpose: 'Baiters draw attention, chasers punish over-commitment.',
      dominantRole: 'baiter',
      secondaryRole: 'chaser',
      forbiddenRoles: ['diver','sniper','suppressor'],
      allowedSupport: ['sweeper'],
      composition: { baiter: 5, chaser: 2, sweeper: 4 },
      phaseDurations: { INTRO: 1200, BUILD: 3500 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 200, chaserDelay: 3000 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 24, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_chase_cycle',
      entryStyle: 'burst_in',
      entrySide: 'edges',
      formationKey: 'scatter',
      formationRows: 0,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: 'HUNTING PACK',
      escapeLanes: 3,
      threatBudget: 36
    },

    TAC_sniper_denial: {
      label: 'SNIPER DENIAL',
      tier: 'tactical',
      tacticalPurpose: 'Precision threats force micro-dodging. Wide gaps between.',
      dominantRole: 'sniper',
      secondaryRole: 'blocker',
      forbiddenRoles: ['diver','chaser','suppressor','sweeper'],
      allowedSupport: [],
      composition: { sniper: 4, blocker: 2 },
      phaseDurations: { INTRO: 1400, BUILD: 3500 },
      buildTiming: { sniperDelay: 2000, blockerDelay: 3000 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 16, interPatternGapMs: 300 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'between_volleys',
      entryStyle: 'fade_in',
      entrySide: 'top',
      formationKey: 'horizontal_line',
      formationRows: 1,
      formationCols: 6,
      formationSpacing: 80,
      bannerText: 'SNIPER LINE',
      escapeLanes: 3,
      threatBudget: 30
    },

    TAC_swarm_anchor: {
      label: 'SWARM + ANCHOR',
      tier: 'tactical',
      tacticalPurpose: 'Many light enemies distract while anchors control space.',
      dominantRole: 'swarm',
      secondaryRole: 'anchor',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['sweeper'],
      composition: { swarm: 8, anchor: 2, sweeper: 3 },
      phaseDurations: { INTRO: 1200, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, anchorDelay: 2000 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 24, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_anchor_volley',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'center_anchors',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 48,
      bannerText: 'SWARM FORMATION',
      escapeLanes: 2,
      threatBudget: 36
    },

    TAC_flanking_pursuit: {
      label: 'FLANKING PURSUIT',
      tier: 'tactical',
      tacticalPurpose: 'Chasers sweep from edges toward player.',
      dominantRole: 'chaser',
      secondaryRole: 'baiter',
      forbiddenRoles: ['diver','suppressor','sniper'],
      allowedSupport: ['sweeper'],
      composition: { chaser: 2, baiter: 4, sweeper: 3, flanker: 2 },
      phaseDurations: { INTRO: 1200, BUILD: 3800 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 300, flankerDelay: 1800, chaserDelay: 3500 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 24, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_chase_wave',
      entryStyle: 'burst_in',
      entrySide: 'edges',
      formationKey: 'scatter',
      formationRows: 0,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: 'FLANKING PURSUIT',
      escapeLanes: 2,
      threatBudget: 36
    },

    // ---- ADVANCED TIER ----

    ADV_false_recovery: {
      label: 'FALSE RECOVERY',
      tier: 'advanced',
      tacticalPurpose: 'Deceptive calm followed by ambush. Stay alert.',
      dominantRole: 'baiter',
      secondaryRole: 'diver',
      forbiddenRoles: ['sniper','suppressor'],
      allowedSupport: ['chaser','sweeper'],
      composition: { baiter: 3, diver: 2, chaser: 1, sweeper: 3 },
      phaseDurations: { INTRO: 1000, BUILD: 2800 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 400, diverDelay: 3500, chaserDelay: 3800 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 26, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'real_relief_3s_after_ambush',
      entryStyle: 'burst_in',
      entrySide: 'edges',
      formationKey: 'scatter',
      formationRows: 0,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: '...',
      escapeLanes: 2,
      threatBudget: 42,
      ambushTelegraph: true
    },

    ADV_layered_pressure: {
      label: 'LAYERED PRESSURE',
      tier: 'advanced',
      tacticalPurpose: 'Three threat layers. Tests multi-axis reading.',
      dominantRole: 'suppressor',
      secondaryRole: 'sniper',
      forbiddenRoles: ['chaser'],
      allowedSupport: ['diver','sweeper'],
      composition: { suppressor: 3, sniper: 3, sweeper: 4, diver: 2 },
      phaseDurations: { INTRO: 1200, BUILD: 4500 },
      buildTiming: { sweeperDelay: 0, suppressorDelay: 1600, sniperDelay: 2800, diverDelay: 4000 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 30, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'mandatory_at_30s_or_50pct',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 48,
      bannerText: 'LAYERED PRESSURE',
      escapeLanes: 1,
      threatBudget: 48
    },

    ADV_collapsing_lane: {
      label: 'LAST LINE',
      tier: 'advanced',
      tacticalPurpose: 'Lane narrows gradually. Precision movement.',
      dominantRole: 'suppressor',
      secondaryRole: 'sweeper',
      forbiddenRoles: ['diver','chaser','sniper'],
      allowedSupport: ['flanker'],
      composition: { suppressor: 4, sweeper: 5, flanker: 2 },
      phaseDurations: { INTRO: 1400, BUILD: 4500 },
      buildTiming: { sweeperDelay: 0, suppressorDelay: 1600, flankerDelay: 2200 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 28, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'lane_reopens_at_resolve',
      entryStyle: 'slide_in',
      entrySide: 'both_walls',
      formationKey: 'closing_gates',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 40,
      bannerText: 'LAST LINE',
      escapeLanes: 1,
      threatBudget: 42,
      collapsingLane: true
    },

    ADV_rotating_crossfire: {
      label: 'ROTATING CROSSFIRE',
      tier: 'advanced',
      tacticalPurpose: 'Safe direction rotates 90 cyclically.',
      dominantRole: 'flanker',
      secondaryRole: 'sniper',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['sweeper'],
      composition: { flanker: 4, sniper: 2, sweeper: 3 },
      phaseDurations: { INTRO: 1400, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, flankerDelay: 1800, sniperDelay: 2800 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 24, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'axis_transition_silence',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'cross_rotating',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 48,
      bannerText: 'ROTATING CROSSFIRE',
      escapeLanes: 1,
      threatBudget: 42,
      rotationWarning: true
    },

    ADV_survival_corridor: {
      label: 'SURVIVAL CORRIDOR',
      tier: 'advanced',
      tacticalPurpose: 'Narrow lane, heavy fire both sides. Endurance.',
      dominantRole: 'suppressor',
      secondaryRole: 'sweeper',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['sniper'],
      composition: { suppressor: 4, sweeper: 4, sniper: 2 },
      phaseDurations: { INTRO: 1200, BUILD: 3500 },
      buildTiming: { sweeperDelay: 0, suppressorDelay: 1600, sniperDelay: 2800 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 30, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'none_during_wave',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'parallel_walls',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 36,
      bannerText: 'SURVIVAL CORRIDOR',
      escapeLanes: 1,
      threatBudget: 48
    },

    ADV_counter_pressure: {
      label: 'COUNTER PRESSURE',
      tier: 'advanced',
      tacticalPurpose: 'Wave fights harder as player kills. Aggression management.',
      dominantRole: 'sweeper',
      secondaryRole: 'chaser',
      forbiddenRoles: ['diver','suppressor'],
      allowedSupport: ['baiter','sniper'],
      composition: { sweeper: 5, chaser: 2, baiter: 3, sniper: 2 },
      phaseDurations: { INTRO: 1200, BUILD: 3500 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 200, sniperDelay: 2400, chaserDelay: 3200 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 28, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'when_player_stops_killing_3s',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 48,
      bannerText: 'ESCALATION',
      escapeLanes: 2,
      threatBudget: 42,
      counterPressure: true
    },

    ADV_role_reversal: {
      label: 'ROLE REVERSAL',
      tier: 'advanced',
      tacticalPurpose: 'Enemies change behavior mid-wave.',
      dominantRole: 'suppressor',
      secondaryRole: 'sniper',
      forbiddenRoles: ['chaser'],
      allowedSupport: ['sweeper','diver'],
      composition: { suppressor: 2, sniper: 2, sweeper: 4, diver: 2 },
      phaseDurations: { INTRO: 1200, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, suppressorDelay: 1600, sniperDelay: 2600, diverDelay: 4000 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 24, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: false, chaserSuspend: true },
      reliefPolicy: 'after_shift',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 48,
      bannerText: 'ROLE REVERSAL',
      escapeLanes: 2,
      threatBudget: 42
    },

    ADV_gauntlet: {
      label: 'GAUNTLET',
      tier: 'advanced',
      tacticalPurpose: 'Continuous 40s pressure. No natural relief. Pure endurance.',
      dominantRole: 'sweeper',
      secondaryRole: 'suppressor',
      forbiddenRoles: [],
      allowedSupport: ['sniper','diver','flanker'],
      composition: { sweeper: 4, suppressor: 3, sniper: 2, diver: 2, flanker: 2, baiter: 2 },
      phaseDurations: { INTRO: 800, BUILD: 3000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 200, suppressorDelay: 1200, flankerDelay: 1800, sniperDelay: 2400, diverDelay: 3200 },
      peakLimits: { maxSimultaneousPatterns: 4, maxBullets: 35, interPatternGapMs: 150 },
      resolveTiming: { diverSuspend: false, sniperSuspend: false, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'only_after_clear',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'classic_grid',
      formationRows: 3,
      formationCols: 5,
      formationSpacing: 42,
      bannerText: 'GAUNTLET',
      escapeLanes: 1,
      threatBudget: 54
    },

    // ---- SETPIECE TIER ----

    SET_boss_prelude: {
      label: 'APPROACHING',
      tier: 'setpiece',
      tacticalPurpose: 'Build tension before boss. Thematic introduction.',
      dominantRole: 'sweeper',
      secondaryRole: 'baiter',
      forbiddenRoles: ['diver','chaser','sniper','suppressor','flanker'],
      allowedSupport: [],
      composition: { sweeper: 6, baiter: 3, anchor: 1 },
      phaseDurations: { INTRO: 1500, BUILD: 3000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 500, anchorDelay: 2000 },
      peakLimits: { maxSimultaneousPatterns: 2, maxBullets: 12, interPatternGapMs: 350 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'faster_transition',
      entryStyle: 'fade_in',
      entrySide: 'top',
      formationKey: 'loose_arc',
      formationRows: 3,
      formationCols: 4,
      formationSpacing: 56,
      bannerText: 'APPROACHING',
      escapeLanes: 3,
      threatBudget: 18,
      preludeToBoss: true
    },

    SET_fortress_breach: {
      label: 'FORTRESS LINE',
      tier: 'setpiece',
      tacticalPurpose: 'Break through layered wall. Row-by-row puzzle.',
      dominantRole: 'blocker',
      secondaryRole: 'sniper',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['sweeper','suppressor'],
      composition: { blocker: 3, sniper: 4, sweeper: 4, suppressor: 2 },
      phaseDurations: { INTRO: 2000, BUILD: 5000 },
      buildTiming: { sweeperDelay: 0, suppressorDelay: 1600, sniperDelay: 2600, anchorDelay: 3500 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 26, interPatternGapMs: 200 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'per_row_cleared',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'fortress',
      formationRows: 4,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: 'FORTRESS LINE',
      escapeLanes: 2,
      threatBudget: 42,
      setpiece: 'fortress'
    },

    SET_kamikaze_rush: {
      label: 'KAMIKAZE RUSH',
      tier: 'setpiece',
      tacticalPurpose: 'Multi-wave dive assault. Aggression test.',
      dominantRole: 'chaser',
      secondaryRole: 'baiter',
      forbiddenRoles: ['suppressor'],
      allowedSupport: ['sweeper','sniper'],
      composition: { chaser: 4, baiter: 4, sweeper: 3, sniper: 2 },
      phaseDurations: { INTRO: 1800, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 300, sniperDelay: 2400, chaserDelay: 3800 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 28, interPatternGapMs: 180, diveWaveGapMs: 2000 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'between_dive_waves',
      entryStyle: 'burst_in',
      entrySide: 'edges',
      formationKey: 'scatter',
      formationRows: 0,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: 'KAMIKAZE RUSH',
      escapeLanes: 1,
      threatBudget: 48,
      setpiece: 'kamikaze_rush'
    },

    SET_splitter_storm: {
      label: 'SPLITTER STORM',
      tier: 'setpiece',
      tacticalPurpose: 'Enemies split on death. Escalating count.',
      dominantRole: 'flanker',
      secondaryRole: 'sniper',
      forbiddenRoles: ['diver','chaser'],
      allowedSupport: ['sweeper','baiter'],
      composition: { flanker: 6, sweeper: 3, baiter: 3, sniper: 2 },
      phaseDurations: { INTRO: 1800, BUILD: 4000 },
      buildTiming: { sweeperDelay: 0, baiterDelay: 200, flankerDelay: 1800, sniperDelay: 2800 },
      peakLimits: { maxSimultaneousPatterns: 3, maxBullets: 30, interPatternGapMs: 180 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'after_split_wave',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'three_columns',
      formationRows: 4,
      formationCols: 3,
      formationSpacing: 48,
      bannerText: 'SPLITTER STORM',
      escapeLanes: 2,
      threatBudget: 42,
      setpiece: 'split_storm'
    },

    SET_imperial_guard: {
      label: 'IMPERIAL GUARD',
      tier: 'setpiece',
      tacticalPurpose: 'Elite coordinated crossfire volleys.',
      dominantRole: 'sniper',
      secondaryRole: 'anchor',
      forbiddenRoles: ['diver'],
      allowedSupport: ['sweeper','flanker'],
      composition: { sniper: 5, anchor: 2, sweeper: 3, flanker: 3 },
      phaseDurations: { INTRO: 2200, BUILD: 5000 },
      buildTiming: { sweeperDelay: 0, flankerDelay: 1600, sniperDelay: 2600, anchorDelay: 3500 },
      peakLimits: { maxSimultaneousPatterns: 4, maxBullets: 32, interPatternGapMs: 160 },
      resolveTiming: { diverSuspend: true, sniperSuspend: true, suppressorSuspend: true, chaserSuspend: true },
      reliefPolicy: 'per_burst_phase',
      entryStyle: 'slide_in',
      entrySide: 'top',
      formationKey: 'fortress',
      formationRows: 4,
      formationCols: 0,
      formationSpacing: 0,
      bannerText: 'IMPERIAL GUARD',
      escapeLanes: 1,
      threatBudget: 54,
      setpiece: 'imperial_guard'
    }
  };

  // ============================================================
  // LEVEL → PROFILE MAPPING
  // ============================================================

  var LEVEL_OVERRIDES = {};

  var LEVEL_PROFILE_MAP = {
    1: 'FND_tutorial',
    2: 'FND_formation_reading',
    3: 'TAC_pincer',
    4: 'SET_boss_prelude',
    6: 'FND_recovery_breather',
    7: 'SET_fortress_breach',
    8: 'TAC_bait_punish',
    9: 'TAC_lane_denial',
    11: 'FND_recovery_breather',
    12: 'SET_kamikaze_rush',
    13: 'FND_recovery_breather',
    14: 'SET_boss_prelude',
    16: 'SET_splitter_storm',
    17: 'ADV_collapsing_lane',
    18: 'SET_imperial_guard'
  };

  // ============================================================
  // PUBLIC API
  // ============================================================

  function _isHardcoreEnabled() {
    if (typeof global.isHardcoreEnabled === 'function') return global.isHardcoreEnabled();
    return true;
  }

  function getWaveProfileForLevel(levelNum) {
    if (LEVEL_OVERRIDES[levelNum]) return LEVEL_OVERRIDES[levelNum];
    var key = LEVEL_PROFILE_MAP[levelNum];
    if (!key) return null;
    return PROFILES[key] || null;
  }

  function getWaveProfileKeyForLevel(levelNum) {
    if (LEVEL_OVERRIDES[levelNum]) return LEVEL_OVERRIDES[levelNum]._overrideKey || 'custom';
    return LEVEL_PROFILE_MAP[levelNum] || null;
  }

  function getWaveProfileByName(name) {
    return PROFILES[name] || null;
  }

  function getWaveProfileLabel(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.label : ('LEVEL ' + levelNum);
  }

  function getWaveProfileTier(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.tier : 'unknown';
  }

  function getWaveProfileComposition(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    if (!profile || !profile.composition) return null;
    var comp = {};
    var keys = Object.keys(profile.composition);
    for (var i = 0; i < keys.length; i++) {
      comp[keys[i]] = profile.composition[keys[i]];
    }
    return comp;
  }

  function getWaveProfilePhaseDurations(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.phaseDurations : null;
  }

  function getWaveProfileBuildTiming(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.buildTiming : null;
  }

  function getWaveProfilePeakLimits(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.peakLimits : null;
  }

  function getWaveProfileResolveTiming(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.resolveTiming : null;
  }

  function getWaveProfileForbiddenRoles(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.forbiddenRoles : [];
  }

  function getWaveProfileBanner(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.bannerText : null;
  }

  function getWaveProfileEscapeLanes(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.escapeLanes : 2;
  }

  function getWaveProfileThreatBudget(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    return profile ? profile.threatBudget : 5;
  }

  function getWaveProfileFormation(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    if (!profile) return { key: 'classic_grid', rows: 4, cols: 6, spacing: 48 };
    return {
      key: profile.formationKey || 'classic_grid',
      rows: profile.formationRows || 4,
      cols: profile.formationCols || 6,
      spacing: profile.formationSpacing || 48
    };
  }

  function getWaveProfileFull(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    if (!profile) return null;
    var copy = {};
    var keys = Object.keys(profile);
    for (var i = 0; i < keys.length; i++) {
      if (typeof profile[keys[i]] === 'object' && profile[keys[i]] !== null && !Array.isArray(profile[keys[i]])) {
        copy[keys[i]] = Object.assign({}, profile[keys[i]]);
      } else if (Array.isArray(profile[keys[i]])) {
        copy[keys[i]] = profile[keys[i]].slice();
      } else {
        copy[keys[i]] = profile[keys[i]];
      }
    }
    copy._profileKey = getWaveProfileKeyForLevel(levelNum);
    return copy;
  }

  function getAllProfileKeys() {
    return Object.keys(PROFILES);
  }

  function getAllProfiles() {
    return PROFILES;
  }

  // ============================================================
  // PROFILE APPLICATION — feeds into hc-wave-composer
  // ============================================================

  function applyWaveProfileToComposer(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    if (!profile) return false;

    // Store profile reference in global for hc-wave-composer to read
    global._hcWcActiveProfile = profile;

    // Override build timing if profile has custom
    if (profile.buildTiming && typeof global.setWaveComposerBuildTiming === 'function') {
      global.setWaveComposerBuildTiming(profile.buildTiming);
    }

    // Override peak limits
    if (profile.peakLimits && typeof global.setWaveComposerPeakLimits === 'function') {
      global.setWaveComposerPeakLimits(profile.peakLimits);
    }

    // Override resolve timing
    if (profile.resolveTiming && typeof global.setWaveComposerResolveTiming === 'function') {
      global.setWaveComposerResolveTiming(profile.resolveTiming);
    }

    // Override phase durations
    if (profile.phaseDurations && typeof global.setWaveComposerPhaseDurations === 'function') {
      global.setWaveComposerPhaseDurations(profile.phaseDurations);
    }

    return true;
  }

  // ============================================================
  // ROLE → ENEMY TYPE MAPPING
  // ============================================================

  var ROLE_TO_TYPE = {
    sweeper: 'alien1',
    sniper: 'alien2',
    diver: 'alien3',
    suppressor: 'alien4',
    chaser: 'alien5',
    flanker: 'alien6',
    baiter: 'alien_mini',
    anchor: 'alien3',
    blocker: 'alien3',
    swarm: 'alien1'
  };

  function roleToType(role) {
    return ROLE_TO_TYPE[role] || 'alien1';
  }

  // ============================================================
  // COMPOSITION BUILDER — creates enemy array from profile
  // ============================================================

  function buildProfileComposition(levelNum) {
    var profile = getWaveProfileForLevel(levelNum);
    if (!profile) return null;

    var W = global.W || 360;
    var comp = profile.composition;
    var formation = getWaveProfileFormation(levelNum);
    var enemies = [];

    // Flatten composition into role → count pairs sorted by count (most first)
    var roleList = [];
    var roleKeys = Object.keys(comp);
    for (var i = 0; i < roleKeys.length; i++) {
      var r = roleKeys[i];
      var count = comp[r] || 0;
      if (count > 0) {
        roleList.push({ role: r, count: count });
      }
    }
    roleList.sort(function(a, b) { return b.count - a.count; });

    // Build formation grid
    var totalEnemies = 0;
    for (var j = 0; j < roleList.length; j++) {
      totalEnemies += roleList[j].count;
    }

    var rows = Math.min(formation.rows, Math.max(2, Math.ceil(totalEnemies / formation.cols)));
    if (formation.cols === 0) { rows = Math.ceil(Math.sqrt(totalEnemies)); }
    var cols = formation.cols || Math.ceil(totalEnemies / rows);
    var spacing = formation.spacing || 48;

    var startX = Math.max(10, (W - (cols * spacing)) / 2);
    var startY = 60;

    var enemyIndex = 0;
    var roleIdx = 0;
    var roleRemaining = roleList.length > 0 ? roleList[0].count : 0;

    for (var r = 0; r < rows && enemyIndex < totalEnemies; r++) {
      var colCount = Math.min(cols, totalEnemies - enemyIndex);
      var rowStartX = startX + (cols - colCount) * spacing / 2;

      for (var c = 0; c < colCount && enemyIndex < totalEnemies; c++) {
        while (roleRemaining <= 0 && roleIdx < roleList.length - 1) {
          roleIdx++;
          roleRemaining = roleList[roleIdx].count;
        }
        if (roleRemaining <= 0) break;

        var currentRole = roleList[roleIdx].role;
        var enemyType = roleToType(currentRole);
        var x = rowStartX + c * spacing;
        var y = startY + r * 36;

        var enemy = createEnemyForProfile(x, y, r, enemyType, currentRole);
        if (enemy) {
          enemies.push(enemy);
          enemyIndex++;
          roleRemaining--;
        }
      }
    }

    return enemies;
  }

  function createEnemyForProfile(x, y, row, enemyType, role) {
    if (typeof global.createEnemy !== 'function') return null;
    if (typeof ENEMY_TYPES === 'undefined') return null;

    var enemy = global.createEnemy(x, y, row, enemyType);
    if (!enemy) return null;

    // Tag with profile role
    enemy._wcProfileRole = role;

    // Role-specific behavior flags
    if (role === 'anchor' && enemyType === 'alien3') {
      // Anchor mode: no diving, higher HP, slower
      enemy.diving = false;
      enemy._wcAnchorMode = true;
      enemy.speedMult = (enemy.speedMult || 1) * 0.6;
    }

    if (role === 'blocker' && enemyType === 'alien3') {
      // Blocker mode: stationary, high HP, visual outline
      enemy.diving = false;
      enemy._wcBlockerMode = true;
      enemy.speedMult = (enemy.speedMult || 1) * 0.3;
      enemy.hp = Math.round((enemy.hp || 1) * 1.5);
      enemy.maxHp = enemy.hp;
    }

    if (role === 'swarm' && enemyType === 'alien1') {
      // Swarm mode: lower HP, faster, minimal attacks
      enemy._wcSwarmMode = true;
      enemy.speedMult = (enemy.speedMult || 1) * 1.5;
    }

    // Register with encounter director
    if (typeof global.registerEnemySpawn === 'function') {
      global.registerEnemySpawn(enemy);
    }

    return enemy;
  }

  // ============================================================
  // PROFILE-DRIVEN initEnemies REPLACEMENT
  // ============================================================

  function initEnemiesFromProfile() {
    var level = global.level || 1;
    var profile = getWaveProfileForLevel(level);
    if (!profile) return false;

    var enemies = buildProfileComposition(level);
    if (!enemies || enemies.length === 0) return false;

    global.enemies = enemies;

    // Apply formation geometry
    if (typeof global.applyFormationGeometry === 'function') {
      global.applyFormationGeometry(enemies, 'balanced');
    }

    // Apply profile to composer
    applyWaveProfileToComposer(level);

    // Set banner if profile has one
    if (profile.bannerText && typeof global.setPieceBannerText !== 'undefined') {
      global.setPieceBannerText = profile.bannerText;
      global.setPieceBannerTimer = 2500;
    }

    return true;
  }

  // ============================================================
  // EXPORTS
  // ============================================================

  global.HC_WAVE_PROFILES = PROFILES;
  global.HC_WC_LEVEL_PROFILE_MAP = LEVEL_PROFILE_MAP;

  global.getWaveProfileForLevel = getWaveProfileForLevel;
  global.getWaveProfileKeyForLevel = getWaveProfileKeyForLevel;
  global.getWaveProfileByName = getWaveProfileByName;
  global.getWaveProfileLabel = getWaveProfileLabel;
  global.getWaveProfileTier = getWaveProfileTier;
  global.getWaveProfileComposition = getWaveProfileComposition;
  global.getWaveProfilePhaseDurations = getWaveProfilePhaseDurations;
  global.getWaveProfileBuildTiming = getWaveProfileBuildTiming;
  global.getWaveProfilePeakLimits = getWaveProfilePeakLimits;
  global.getWaveProfileResolveTiming = getWaveProfileResolveTiming;
  global.getWaveProfileForbiddenRoles = getWaveProfileForbiddenRoles;
  global.getWaveProfileBanner = getWaveProfileBanner;
  global.getWaveProfileEscapeLanes = getWaveProfileEscapeLanes;
  global.getWaveProfileThreatBudget = getWaveProfileThreatBudget;
  global.getWaveProfileFormation = getWaveProfileFormation;
  global.getWaveProfileFull = getWaveProfileFull;
  global.getAllProfileKeys = getAllProfileKeys;
  global.getAllProfiles = getAllProfiles;

  global.applyWaveProfileToComposer = applyWaveProfileToComposer;
  global.buildProfileComposition = buildProfileComposition;
  global.initEnemiesFromProfile = initEnemiesFromProfile;
  global.roleToType = roleToType;

})(window);
