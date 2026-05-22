# HC-ST-05 — Wave Composer Integration & Influence Layer

**Block:** HC-ST  
**Status:** Implemented (influence layer, calibration, safety fallbacks)  
**Date:** 2026-05-22  
**Dependency:** HC-ST-04 (stage plans)

---

## Overview

Stage Director now exposes an **influence state** that Wave Composer can read. ST never spawns enemies or controls patterns — it only produces metadata. Tension calibration compares planned vs actual. Safety fallbacks for desync.

---

## Files (1)

| File | Change |
|------|--------|
| `www/stage-director.js` | +280 lines: influence state, calibration, recovery integrity, safety fallbacks, extended debug |

---

## Time Authority Chain

```
globalTime (scores.js)           ← ABSOLUTE SOURCE OF TRUTH
  │
  ├─ _stageDirector.sectionStartedAt   ← derived from globalTime
  ├─ _stageDirector.sectionDurationMs  ← computed diff (read-only)
  ├─ Stage plan section.durationMs     ← authored target (NOT authoritative)
  ├─ HC-WC wave phase timers           ← independent, owned by WC
  └─ HC-BD bossDirector.phaseTimer     ← independent, owned by BD
```

**No parallel timers. All derived from globalTime.** Desync detected by comparing section timer vs live tension.

---

## Influence State

`getStageInfluenceState()` → metadata for Wave Composer:

```js
{
  // Core influence (0.0-1.0)
  intensity: 0.6,
  aggression: 0.55,
  density: 0.6,
  spacing: 0.4,
  recovery: 0.3,
  setpiece: 0.2,
  readabilityPressure: 0.5,

  // Metadata
  sectionType: 'pressure_ramp',
  tensionCurve: 'sawtooth',
  isBossSection: false,
  isHighPressure: false,
  isRecovery: false,
  pacingMode: 'sawtooth',

  // WC flags — what WC is allowed to do
  wcFlags: {
    allowCrossfire: true,
    allowDivers: true,
    allowSuppressors: true,
    allowSurvivalDensity: false,
    forceRelief: false,
    preludeCleanup: false
  }
}
```

### Bias values per section type:

| Section | intensity | aggression | density | spacing | recovery | readabilityPressure |
|---------|-----------|------------|---------|---------|----------|-------------------|
| warmup | 0.20 | 0.10 | 0.15 | 0.80 | 0.90 | 0.10 |
| formation | 0.35 | 0.25 | 0.35 | 0.60 | 0.70 | 0.20 |
| pressure | 0.60 | 0.55 | 0.60 | 0.40 | 0.30 | 0.50 |
| crossfire | 0.75 | 0.70 | 0.70 | 0.30 | 0.20 | 0.65 |
| ambush | 0.80 | 0.85 | 0.75 | 0.20 | 0.10 | 0.70 |
| relief | 0.15 | 0.05 | 0.10 | 0.90 | 1.00 | 0.05 |
| survival | 0.90 | 0.85 | 0.90 | 0.15 | 0.05 | 0.85 |
| mini_setpiece | 0.75 | 0.60 | 0.80 | 0.25 | 0.15 | 0.60 |
| boss_prelude | 0.15 | 0.05 | 0.08 | 0.95 | 0.95 | 0.02 |
| climax | 1.00 | 1.00 | 1.00 | 0.10 | 0.00 | 1.00 |

---

## Tension Calibration

`calibrateStageTension()` runs every 500ms. Compares planned intensity from stage plan vs actual tension from live game state (enemies + bullets + rank).

```js
{
  planned: 0.60,
  actual: 0.52,
  mismatch: 0.08,
  desyncWarnings: 0,
  overloadFrames: 0
}
```

**Desync detection:** Mismatch > 0.4 triggers warning counter. Used to detect when stage plan and reality diverge (e.g., player cleared wave faster than expected).

---

## Recovery Integrity

`validateStageRecoveryIntegrity()` checks:

| Condition | Issue |
|-----------|-------|
| Relief section with tension > 0.40 | `relief_tension_high` |
| Boss prelude with tension > 0.35 | `prelude_too_intense` |
| Overload curve > 30s without relief | `overload_too_long` |
| Consecutive pressure ≥ 5 | `pressure_chain_too_long` |

---

## Safety Fallbacks

`getStageDirectorSafeDefaults()` — returns neutral influence state when desync detected. WC can fall back to this if ST state is unavailable or invalid.

---

## Debug Overlay (extended)

```
HC-ST
SECTION: pressure_ramp
TENSION: 0.52  PEAK:0.88
PRESS_CHAIN: 2/3
RECOVERY: READY
CLIMAX: no  PRELUDE:
LEVEL: 14  SECTIONS:62
DURATION: 18.4s
PLAN: war_zone (4/6)
CURVE: sawtooth
NEXT: crossfire (20s)

INFLUENCE
I:0.6 A:0.55 D:0.6
S:0.4 R:0.3 SP:0.2
READ:0.5 MODE:sawtooth
MISMATCH:0.08 DESYNC:0
INTEGRITY:OK
```

---

## What ST Controls vs What WC Controls

| System | ST role | WC role |
|--------|---------|---------|
| Enemy spawning | ❌ Never | ✅ Absolute owner |
| Bullet patterns | ❌ Never | ✅ Via HC-PD |
| Wave phases | ❌ Never | ✅ Phase engine |
| Section identity | ✅ Defines | ⬜ Reads |
| Intensity bias | ✅ Produces | ⬜ Can read |
| Density bias | ✅ Produces | ⬜ Can read |
| Recovery windows | ✅ Tracks | ⬜ Can read |
| Spacing bias | ✅ Produces | ⬜ Can read |
| wcFlags (allow/deny) | ✅ Produces | ⬜ Can read |

---

## Validation

```
node --check www/stage-director.js → OK (792 lines)
node --check www/stage-plans.js    → OK
node --check www/update.js         → OK
node --check www/draw.js           → OK
```

- ✅ Influence state computed from stage plan + live state
- ✅ 10 section types mapped to influence biases
- ✅ Tension calibration runs every 500ms
- ✅ Recovery integrity validation functional
- ✅ Safety fallback state defined
- ✅ WC flags allow/deny based on section type
- ✅ Zero gameplay changes — ST remains influence-only
- ✅ HC-WC ownership preserved — ST never touches waves
