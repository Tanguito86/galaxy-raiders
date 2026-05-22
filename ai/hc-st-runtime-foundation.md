# HC-ST-03 — Stage Director Runtime Foundation

**Block:** HC-ST  
**Status:** Implemented (runtime foundation, lightweight)  
**Date:** 2026-05-22  
**Dependency:** HC-ST-02 (taxonomy), HC-ST-01 (audit)

---

## Overview

First runtime implementation: `www/stage-director.js`. Lightweight state machine that organizes, coordinates, and monitors macro flow without controlling gameplay. Observes enemies, bullets, and rank to estimate live tension. Tracks section lifecycle, recovery, boss preludes, and climax.

---

## Files (3)

| File | Change |
|------|--------|
| `www/stage-director.js` | NEW — 295 lines, full runtime foundation |
| `www/update.js` | +1 line: `updateStageDirector(dt)` each frame |
| `www/draw.js` | +1 line: debug overlay dispatch |

---

## State Model

```
INACTIVE ──▶ WARMUP ──▶ PRESSURE ──▶ RELIEF ──▶ ... (cycles)
                                     │
                                BOSS_PRELUDE ──▶ CLIMAX ──▶ INACTIVE
```

### Internal state fields:
```
_stageDirector: {
  active, currentSection, sectionStartedAt, sectionDurationMs,
  tension, peakTension, tensionRolling,
  consecutivePressure, recoveryAvailable,
  bossActive, climaxActive, preludeActive,
  sectionMeta
}
```

---

## Section Lifecycle

| Function | Purpose |
|----------|---------|
| `startStageSection(type, meta)` | Begin new section, advance state machine |
| `updateStageSection(dt)` | Each frame: track duration, tension rolling, recovery check |
| `endStageSection()` | Close current section, notify hooks |
| `transitionStageSection(newType, meta)` | End + Start in one call |

**Auto-detection:** On first frame, director activates. Tension is estimated from live game state each frame.

---

## Tension Tracking

`setStageDirectorTension(value)` — set from outside or auto-estimated.

`estimateStageTension()` — calculates from:
- Enemy alive count (0-20 → 0.0-1.0, weight 0.4)
- Enemy bullet count (0-30 → 0.0-1.0, weight 0.4)
- Rank level (1-5 → 0.0-1.0, weight 0.2)

Combined formula: `min(1.0, density*0.4 + bulletDensity*0.4 + rankMult*0.2)`

---

## Recovery Tracking

| Function | Purpose |
|----------|---------|
| `isStageRecoveryAvailable()` | Check if relief can be requested |
| `getStageConsecutivePressure()` | How many high-intensity sections in a row |
| `requestStageRecovery()` | Force transition to relief section |

**Auto-recovery detection:** High-intensity sections (crossfire, ambush, survival, climax) increment counter. Relief/warmup sections reset it. When counter ≥ config.maxConsecutivePressure, recovery is blocked.

---

## Boss Hooks

| Function | Called when |
|----------|------------|
| `notifyBossPreludeStart()` | Boss about to spawn — transition to prelude |
| `notifyClimaxStart(bossPattern)` | Boss fight begins — transition to climax |
| `notifyBossDefeat()` | Boss dead — tension drops 70% |

---

## Orchestration Hooks

| Global hook | Purpose |
|------------|---------|
| `window.notifyStageSectionStart(type)` | External systems can listen for section changes |
| `window.notifyStageSectionEnd(type)` | External systems can react to section endings |

These are called by the director. Other systems define them if needed. No dependencies.

---

## Telemetry

```js
getStageDirectorTelemetry(): {
  currentSection: 'pressure_ramp',
  tension: 0.62,
  peakTension: 0.88,
  consecutivePressure: 2,
  recoveryAvailable: true,
  bossActive: false,
  climaxActive: false,
  preludeActive: false,
  currentLevel: 12,
  sectionsCompleted: 34
}
```

---

## Debug Overlay

Activate via `stageDirector.telemetry: true` in game-config.js.

Shows:
```
HC-ST
SECTION: pressure_ramp
TENSION: 0.62  PEAK:0.88
PRESS_CHAIN: 2/3
RECOVERY: READY
CLIMAX: no  PRELUDE:
LEVEL: 12  SECTIONS:34
DURATION: 18.4s
```

---

## Integration Points

| System | How HC-ST interacts |
|--------|-------------------|
| HC-WC | Observes wave density for tension estimation |
| HC-BD | Boss prelude/climax hooks |
| HC-RK | Rank level feeds tension estimation |
| HC-SC | No direct interaction — score preserved |
| Encounter Director | No direct interaction — independent |
| Update loop | Frame update for tension tracking |

**Design:** HC-ST is an observer + coordinator, not a controller. It doesn't modify enemies, bullets, bosses, or rank. It tracks state and calls notifier hooks.

---

## Validation

```
node --check www/stage-director.js → OK (295 lines)
node --check www/update.js         → OK
node --check www/draw.js           → OK
```

- ✅ Runtime active — frame update wired
- ✅ Section lifecycle complete (start/update/end/transition)
- ✅ Tension estimation from live game state
- ✅ Recovery tracking with pressure counter
- ✅ Boss prelude/climax/defeat hooks
- ✅ Debug overlay (flag-gated)
- ✅ All frozen systems preserved
- ✅ Zero gameplay changes
