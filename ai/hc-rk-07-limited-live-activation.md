# HC-RK-07 — Limited Live Activation

**Block:** HC-RK  
**Status:** LIVE (gameplay effects enabled, safety-governed, conservative tuning)  
**Date:** 2026-05-22  
**Dependency:** HC-RK-06 (calibration), HC-RK-04 (wiring)

---

## Overview

Rank gameplay effects are now **LIVE**. Three parameters are active: bullet speed, enemy cooldown, and wave pause timing. All pass through the safety governor. Conservative tuning from HC-RK-06 applied. Five new runtime safeguards added.

---

## What Changed

### Files Modified (4)

| File | Change |
|------|--------|
| `www/game-config.js` | 5 values changed: `gameplayEffectsEnabled: true`, decay 0.15→0.20, survival 0.4→0.5, accuracy threshold 65→70, recovery 5s→4s |
| `www/hardcore-config.js` | Defaults synced to match |
| `www/hardcore-rank.js` | +148 lines: anti-oscillation smoothing, peak tracking, live status helper |
| `www/update.js` | +1 line: `updateHardcoreRankPeakTracking()` each frame |

---

## Activated Parameters

| Parameter | Range | Governor Cap | What changes |
|-----------|-------|-------------|--------------|
| Bullet speed | +0% → +8% | ≤1.08 (rank) + ≤5.20 (combined) | Enemy bullets slightly faster at high rank |
| Enemy cooldown | −0% → −10% | ≥450ms floor | Enemies fire slightly more often |
| Wave pause | −0% → −12% | ≥600ms floor | Shorter pauses between waves |

**All three are safety-governed**: governor blocks all effects during RECOVERING, boss ceilings, or pressure overflow.

---

## Calibration Adjustments (from HC-RK-06)

| Parameter | Before | After | Reason |
|-----------|--------|-------|--------|
| `survivalRankAmount` | 0.40 | 0.50 | Slightly more reward for hitless play |
| `accuracyBonusThreshold` | 65% | 70% | Rewards genuinely good aim |
| `recoveringMs` | 5000 | 4000 | 4s recovery feels snappier |
| `decayAmount` | 0.15 | 0.20 | Slightly faster decay prevents idle camping |
| `gameplayEffectsEnabled` | `false` | `true` | Rank is now LIVE |

---

## New Runtime Safeguards (4)

### 1. Anti-Oscillation Smoothing
```
_hardcoreRankSmooth: { displayValue, smoothFactor: 0.12 }
getHardcoreRankDisplayValue() → lerped rank value
getHardcoreRankDisplayLevel() → lerped rank level
```
Prevents rank display from jumping abruptly. Value lerps toward target at 12% per frame. Gameplay still uses raw value — display only.

### 2. Peak Value Tracking
```
updateHardcoreRankPeakTracking() → called each frame
getHardcoreRankPeakTelemetry() → { highestValue, highestLevel, highestCombinedPressure, totalCaps, totalBlocks }
```
Records the highest rank value, level, and combined pressure reached during the entire run. Reset on new game.

### 3. Live Status Snapshot
```
getHardcoreRankLiveStatus() → {
  gameplayEffectsEnabled, governorApproved, governorReason,
  rankLevel, rankValue, displayValue,
  performanceState, peakValue, peakLevel, peakCombinedPressure
}
```
One-call snapshot of the entire rank system state. Useful for debugging and telemetry.

### 4. Governor + Telemetry Integration
All existing telemetry (HC-RK-03 blocks, HC-RK-04 caps/applications) now aggregated in peak tracking:
- `totalApplications`: sum of bullet speed, cooldown, wave pause applications
- `totalCaps`: sum of all parameter caps across all 3 systems
- `totalBlocks`: sum of all governor blocks

---

## Config Gate Matrix (updated)

```
gameplayEffectsEnabled = false → zero gameplay impact (identical to vanilla)
gameplayEffectsEnabled = true  → rank affects 3 parameters through safety governor:
                                  bullet speed: 1.00 → 1.08 (capped)
                                  cooldown: 1.00 → 0.90 (floored 450ms)
                                  wave pause: 900 → 540 (floored 600ms)
```

---

## Expected Gameplay Impact

### Rank 1 (start of game)
- No effect. All multipliers = 1.00. Identical to vanilla.

### Rank 2 (2-5 min, casual play)
- Bullets ~2.5% faster (1.03)
- Cooldown ~2.5% shorter (0.975)
- Barely perceptible. Warms up the game slightly.

### Rank 3 (5-10 min, average play)
- Bullets ~6% faster (1.06)
- Cooldown ~6% shorter (0.94)
- Wave pauses ~6% shorter (~846ms)
- Noticeable but fair. Game feels more active.

### Rank 4 (10-15 min, good play)
- Bullets ~8% faster (1.08 — at cap)
- Cooldown ~8% shorter (0.92)
- Wave pauses ~8% shorter (~828ms)
- Genuinely harder. Rewards consistent skill.

### Rank 5 (15+ min, elite play)
- Bullets at full cap (1.08)
- Cooldown at 0.90
- Wave pauses at ~810ms
- Governor becomes active: EMPERADOR blocks at rank 5, pressure ceiling may trigger
- Maximum intensity the system allows

---

## What is NOT Activated

| System | Status | Reason |
|--------|--------|--------|
| Spawn multipliers | OFF | Wave composer manages spawns |
| Enemy HP scaling | OFF | Would make enemies spongy, not harder |
| Boss aggression extra | OFF | HC-BD frozen, boss patterns fixed |
| Adaptive choreography | OFF | No signature chains yet |
| Rank-based formations | OFF | Wave profiles are static per level |
| Extra divers/patterns | OFF | Density managed by wave composer |
| Player parameter changes | OFF | Sacred — hitbox, speed, fire rate fixed forever |

---

## Rollback Path

To disable all rank gameplay effects:
```js
// game-config.js rank section:
gameplayEffectsEnabled: false
```

Single-line rollback. All other systems remain intact.

---

## Validation

```
node --check www/hardcore-rank.js   → OK (1524 lines)
node --check www/game-config.js     → OK
node --check www/hardcore-config.js → OK
node --check www/update.js          → OK
```

## HC-RK Status

| Block | Status | Key output |
|-------|--------|------------|
| HC-RK-01 | ✅ Complete | Full audit |
| HC-RK-02 | ✅ Complete | Performance tracking |
| HC-RK-03 | ✅ Complete | Safety governor |
| HC-RK-04 | ✅ Complete | Gameplay wiring |
| HC-RK-05 | ✅ Complete | Debug overlay |
| HC-RK-06 | ✅ Complete | Calibration audit |
| HC-RK-07 | ✅ LIVE | Limited activation |
