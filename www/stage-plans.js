// ====================================
// GALAXY RAIDERS - stage-plans.js
// HC-ST-04: Stage Plans & Section Profiles
// Hand-authored plans for all 20 levels.
// Declarative, deterministic, editable.
// ====================================

// ============================================================
// STAGE IDENTITY PROFILES
// ============================================================

var STAGE_IDENTITIES = {
  // Chapters 1-4: Early Game
  1:  { name: 'First Contact',        aggression: 0.2, spacing: 'open',   bulletStyle: 'direct',   pacing: 'slow_burn',  recovery: 'long',    climax: 'none' },
  2:  { name: 'Patrol Zone',           aggression: 0.25,spacing: 'open',   bulletStyle: 'direct',   pacing: 'slow_burn',  recovery: 'long',    climax: 'none' },
  3:  { name: 'Pincer Assault',        aggression: 0.4, spacing: 'medium', bulletStyle: 'crossfire',pacing: 'pulse',      recovery: 'medium',  climax: 'setpiece' },
  4:  { name: 'Swarm Breach',          aggression: 0.35,spacing: 'dense',  bulletStyle: 'multi',    pacing: 'sawtooth',   recovery: 'normal',  climax: 'none' },
  5:  { name: 'Duelist Arena',         aggression: 0.5, spacing: 'medium', bulletStyle: 'boss',     pacing: 'collision',  recovery: 'long',    climax: 'boss' },

  // Chapters 5-8: Mid Game
  6:  { name: 'Scouting Run',          aggression: 0.3, spacing: 'open',   bulletStyle: 'direct',   pacing: 'collapse',   recovery: 'long',    climax: 'none' },
  7:  { name: 'Fortress Line',         aggression: 0.5, spacing: 'dense',  bulletStyle: 'suppress', pacing: 'sawtooth',   recovery: 'short',   climax: 'setpiece' },
  8:  { name: 'Armored Column',        aggression: 0.45,spacing: 'dense',  bulletStyle: 'tank',     pacing: 'pulse',      recovery: 'normal',  climax: 'none' },
  9:  { name: 'Dark Sector',           aggression: 0.5, spacing: 'medium', bulletStyle: 'multi',    pacing: 'slow_burn',  recovery: 'normal',  climax: 'none' },
  10: { name: 'Serpent Den',           aggression: 0.55,spacing: 'medium', bulletStyle: 'boss',     pacing: 'collision',  recovery: 'medium',  climax: 'boss' },

  // Chapters 9-12: Late Mid Game
  11: { name: 'Retreat Path',          aggression: 0.35,spacing: 'medium', bulletStyle: 'direct',   pacing: 'collapse',   recovery: 'long',    climax: 'none' },
  12: { name: 'Desperate Charge',      aggression: 0.65,spacing: 'dense',  bulletStyle: 'kamikaze', pacing: 'pulse',      recovery: 'short',   climax: 'setpiece' },
  13: { name: 'Patrol Disrupted',      aggression: 0.5, spacing: 'medium', bulletStyle: 'ambush',   pacing: 'pulse',      recovery: 'normal',  climax: 'none' },
  14: { name: 'War Zone',              aggression: 0.6, spacing: 'dense',  bulletStyle: 'crossfire',pacing: 'sawtooth',   recovery: 'short',   climax: 'none' },
  15: { name: 'The Ring',              aggression: 0.6, spacing: 'medium', bulletStyle: 'boss',     pacing: 'collision',  recovery: 'medium',  climax: 'boss' },

  // Chapters 13-16: Late Game
  16: { name: 'Chaos Cascade',         aggression: 0.75,spacing: 'dense',  bulletStyle: 'splitter', pacing: 'sawtooth',   recovery: 'short',   climax: 'setpiece' },
  17: { name: 'Bullet Storm',          aggression: 0.8, spacing: 'dense',  bulletStyle: 'survival', pacing: 'overload',   recovery: 'minimal', climax: 'none' },
  18: { name: 'Elite Guard',           aggression: 0.85,spacing: 'dense',  bulletStyle: 'mixed',    pacing: 'sawtooth',   recovery: 'short',   climax: 'setpiece' },
  19: { name: 'The Hunt',              aggression: 0.85,spacing: 'medium', bulletStyle: 'boss',     pacing: 'collision',  recovery: 'medium',  climax: 'boss' },
  20: { name: 'The Throne',            aggression: 1.0, spacing: 'dense',  bulletStyle: 'boss',     pacing: 'overload',   recovery: 'none',    climax: 'boss' }
};

// ============================================================
// STAGE PLANS — authored section sequences per level
// ============================================================

var STAGE_PLANS = {};

// ═══════════ Chapter 1: Early Game ═══════════

STAGE_PLANS[1] = {
  identity: 'first_contact',
  tensionCurve: 'slow_burn',
  sections: [
    { type: 'warmup', durationMs: 20000, intensity: 0.20 },
    { type: 'relief', durationMs: 10000, intensity: 0.10 },
    { type: 'formation_showcase', durationMs: 15000, intensity: 0.35 },
    { type: 'relief', durationMs: 12000, intensity: 0.15 }
  ]
};

STAGE_PLANS[2] = {
  identity: 'patrol_duty',
  tensionCurve: 'slow_burn',
  sections: [
    { type: 'warmup', durationMs: 15000, intensity: 0.22 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.40 },
    { type: 'relief', durationMs: 12000, intensity: 0.15 },
    { type: 'formation_showcase', durationMs: 15000, intensity: 0.35 },
    { type: 'relief', durationMs: 12000, intensity: 0.15 }
  ]
};

STAGE_PLANS[3] = {
  identity: 'pincer_assault',
  tensionCurve: 'pulse',
  sections: [
    { type: 'warmup', durationMs: 12000, intensity: 0.25 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.45 },
    { type: 'mini_setpiece', durationMs: 25000, intensity: 0.70 },  // PINCER ASSAULT
    { type: 'relief', durationMs: 15000, intensity: 0.20 }
  ]
};

STAGE_PLANS[4] = {
  identity: 'swarm_breach',
  tensionCurve: 'sawtooth',
  sections: [
    { type: 'warmup', durationMs: 10000, intensity: 0.30 },
    { type: 'pressure_ramp', durationMs: 25000, intensity: 0.55 },
    { type: 'relief', durationMs: 12000, intensity: 0.20 },
    { type: 'crossfire', durationMs: 20000, intensity: 0.65 },
    { type: 'boss_prelude', durationMs: 12000, intensity: 0.25 }  // → CRABTRON next
  ]
};

// ═══════════ Chapter 2: First Boss ═══════════
STAGE_PLANS[5] = {
  identity: 'duelist_arena',
  tensionCurve: 'climax',
  isBoss: true,
  bossPattern: 'crossfire',
  sections: [
    { type: 'boss_prelude', durationMs: 10000, intensity: 0.20 },
    { type: 'climax', durationMs: 999999, intensity: 1.0 }
  ]
};

// ═══════════ Chapter 3: Mid Game ═══════════
STAGE_PLANS[6] = {
  identity: 'scouting_run',
  tensionCurve: 'collapse',
  sections: [
    { type: 'warmup', durationMs: 10000, intensity: 0.20 },
    { type: 'formation_showcase', durationMs: 15000, intensity: 0.35 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.50 },
    { type: 'relief', durationMs: 15000, intensity: 0.20 }
  ]
};

STAGE_PLANS[7] = {
  identity: 'fortress_line',
  tensionCurve: 'sawtooth',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.30 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.55 },
    { type: 'mini_setpiece', durationMs: 28000, intensity: 0.75 },  // FORTRESS LINE
    { type: 'relief', durationMs: 15000, intensity: 0.25 }
  ]
};

STAGE_PLANS[8] = {
  identity: 'armored_column',
  tensionCurve: 'pulse',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.30 },
    { type: 'formation_showcase', durationMs: 15000, intensity: 0.45 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.55 },
    { type: 'relief', durationMs: 12000, intensity: 0.20 },
    { type: 'crossfire', durationMs: 18000, intensity: 0.60 }
  ]
};

STAGE_PLANS[9] = {
  identity: 'dark_sector',
  tensionCurve: 'slow_burn',
  sections: [
    { type: 'warmup', durationMs: 10000, intensity: 0.30 },
    { type: 'pressure_ramp', durationMs: 25000, intensity: 0.55 },
    { type: 'relief', durationMs: 12000, intensity: 0.25 },
    { type: 'pressure_ramp', durationMs: 25000, intensity: 0.60 },
    { type: 'boss_prelude', durationMs: 12000, intensity: 0.25 }  // → SERPENTRIX
  ]
};

// ═══════════ Chapter 4: Second Boss ═══════════
STAGE_PLANS[10] = {
  identity: 'serpent_den',
  tensionCurve: 'climax',
  isBoss: true,
  bossPattern: 'zigzag',
  sections: [
    { type: 'boss_prelude', durationMs: 12000, intensity: 0.20 },
    { type: 'climax', durationMs: 999999, intensity: 1.0 }
  ]
};

// ═══════════ Chapter 5: Late Mid Game ═══════════
STAGE_PLANS[11] = {
  identity: 'retreat_path',
  tensionCurve: 'collapse',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.25 },
    { type: 'formation_showcase', durationMs: 18000, intensity: 0.45 },
    { type: 'pressure_ramp', durationMs: 22000, intensity: 0.55 },
    { type: 'relief', durationMs: 15000, intensity: 0.25 }
  ]
};

STAGE_PLANS[12] = {
  identity: 'desperate_charge',
  tensionCurve: 'pulse',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.35 },
    { type: 'pressure_ramp', durationMs: 18000, intensity: 0.60 },
    { type: 'mini_setpiece', durationMs: 30000, intensity: 0.80 },  // KAMIKAZE RUSH
    { type: 'relief', durationMs: 15000, intensity: 0.25 }
  ]
};

STAGE_PLANS[13] = {
  identity: 'patrol_disrupted',
  tensionCurve: 'pulse',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.35 },
    { type: 'ambush', durationMs: 12000, intensity: 0.70 },
    { type: 'relief', durationMs: 12000, intensity: 0.20 },
    { type: 'pressure_ramp', durationMs: 22000, intensity: 0.60 },
    { type: 'crossfire', durationMs: 20000, intensity: 0.70 }
  ]
};

STAGE_PLANS[14] = {
  identity: 'war_zone',
  tensionCurve: 'sawtooth',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.40 },
    { type: 'pressure_ramp', durationMs: 25000, intensity: 0.65 },
    { type: 'relief', durationMs: 12000, intensity: 0.25 },
    { type: 'crossfire', durationMs: 20000, intensity: 0.75 },
    { type: 'relief', durationMs: 10000, intensity: 0.25 },
    { type: 'boss_prelude', durationMs: 12000, intensity: 0.25 }  // → ORBITAL
  ]
};

// ═══════════ Chapter 6: Third Boss ═══════════
STAGE_PLANS[15] = {
  identity: 'the_ring',
  tensionCurve: 'climax',
  isBoss: true,
  bossPattern: 'rotate',
  sections: [
    { type: 'boss_prelude', durationMs: 14000, intensity: 0.20 },
    { type: 'climax', durationMs: 999999, intensity: 1.0 }
  ]
};

// ═══════════ Chapter 7: Late Game ═══════════
STAGE_PLANS[16] = {
  identity: 'chaos_cascade',
  tensionCurve: 'sawtooth',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.45 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.70 },
    { type: 'mini_setpiece', durationMs: 32000, intensity: 0.85 },  // SPLITTER STORM
    { type: 'relief', durationMs: 15000, intensity: 0.30 }
  ]
};

STAGE_PLANS[17] = {
  identity: 'bullet_storm',
  tensionCurve: 'overload',
  sections: [
    { type: 'warmup', durationMs: 6000, intensity: 0.50 },
    { type: 'survival_corridor', durationMs: 35000, intensity: 0.90 },
    { type: 'relief', durationMs: 12000, intensity: 0.25 },
    { type: 'crossfire', durationMs: 22000, intensity: 0.80 },
    { type: 'relief', durationMs: 12000, intensity: 0.25 }
  ]
};

STAGE_PLANS[18] = {
  identity: 'elite_guard',
  tensionCurve: 'sawtooth',
  sections: [
    { type: 'warmup', durationMs: 8000, intensity: 0.50 },
    { type: 'pressure_ramp', durationMs: 20000, intensity: 0.75 },
    { type: 'mini_setpiece', durationMs: 35000, intensity: 0.90 },  // IMPERIAL GUARD
    { type: 'relief', durationMs: 12000, intensity: 0.30 },
    { type: 'boss_prelude', durationMs: 15000, intensity: 0.20 }  // → TENIENTE
  ]
};

// ═══════════ Chapter 8: Final Bosses ═══════════
STAGE_PLANS[19] = {
  identity: 'the_hunt',
  tensionCurve: 'climax',
  isBoss: true,
  bossPattern: 'divebomb',
  sections: [
    { type: 'boss_prelude', durationMs: 15000, intensity: 0.20 },
    { type: 'climax', durationMs: 999999, intensity: 1.0 }
  ]
};

STAGE_PLANS[20] = {
  identity: 'the_throne',
  tensionCurve: 'overload',
  isBoss: true,
  bossPattern: 'supreme',
  sections: [
    { type: 'boss_prelude', durationMs: 18000, intensity: 0.15 },
    { type: 'climax', durationMs: 999999, intensity: 1.0 }
  ]
};

// ============================================================
// STAGE PLAN HELPERS
// ============================================================

function getStagePlan(levelNum) {
  return STAGE_PLANS[levelNum] || null;
}

function getStageIdentity(levelNum) {
  return STAGE_IDENTITIES[levelNum] || { name: 'Unknown', aggression: 0.5, spacing: 'medium', bulletStyle: 'direct', pacing: 'sawtooth', recovery: 'normal', climax: 'none' };
}

function getStagePlanCurrentSection(plan, sectionIndex) {
  if (!plan || !plan.sections) return null;
  var idx = (typeof sectionIndex === 'number' && sectionIndex >= 0) ? sectionIndex : 0;
  if (idx >= plan.sections.length) return null;
  return plan.sections[idx];
}

function getStagePlanNextSection(plan, sectionIndex) {
  if (!plan || !plan.sections) return null;
  var nextIdx = (typeof sectionIndex === 'number' && sectionIndex >= 0) ? sectionIndex + 1 : 1;
  if (nextIdx >= plan.sections.length) return null;
  return plan.sections[nextIdx];
}

function getStagePlanSectionCount(plan) {
  if (!plan || !plan.sections) return 0;
  return plan.sections.length;
}
