# HC-SC-09 — Recovery & Survival Mastery Scoring

**Block:** HC-SC  
**Status:** Implemented (recovery, survival chains, no-hit waves, anti-camping)  
**Date:** 2026-05-22  
**Dependency:** HC-SC-08 (boss), HC-SC-04 (multiplier), HC-RK (performance state)

---

## Overview

Recovery and survival mastery: recovery scoring (+1500 + multiplier restore on comeback), no-hit wave/stage bonuses (750/5000), survival chain milestones (30/60/120s hitless → multiplier gains), anti-camping suppression.

---

## Files Modified (5)

| File | Change |
|------|--------|
| `www/scores.js` | +155 lines: survival state, recovery, chains, anti-camping, telemetry |
| `www/game-config.js` | +18 lines: `survivalScoring` config |
| `www/hardcore-config.js` | +1 line: defaults |
| `www/update.js` | +2 lines: `updateSurvivalScoring()` + `onSurvivalWaveClear()` |
| `www/progression.js` | +3 lines: hit hook + no-hit stage check |

---

## Config

```js
survivalScoring: {
  recovery: {
    windowFrames: 900,         // 15s of survival to register recovery
    multiplierRestore: 0.10,   // small multiplier boost on recovery
    scoreBonus: 1500           // score reward for recovery
  },
  noHit: {
    waveBonus: 750,            // no-hit wave bonus
    stageBonus: 5000           // no-hit stage (5 waves) bonus
  },
  survivalChain: {
    levels: [30, 60, 120],     // seconds hitless
    multiplierGain: [0.03, 0.06, 0.10]  // multiplier gain at each milestone
  },
  antiCamping: {
    idleFrames: 600,           // 10s of no gains = suppressed
    disableWhileIdle: true     // block bonuses while camping
  }
}
```

---

## Recovery System

**Definition:** Player transitions from RECOVERING → SURVIVING/DOMINATING after a hit.

**Detection:** Uses HC-RK performance state. `onSurvivalHit()` called on player death. `updateSurvivalScoring()` detects when state changes from RECOVERING to non-RECOVERING.

**Reward:** +1500 score (misc source) + 0.10 multiplier restore. Only once per recovery event.

**Design:** Recovery is acknowledged. Player gets a small bonus for pulling through. Score is modest (1500 is about 1 wave bonus). Multiplier restore helps rebuild momentum.

---

## No-Hit Waves

**Detection:** `onSurvivalHit()` sets `waveNoHit = false`. `onSurvivalWaveClear()` checks flag before reset.

**Reward:** +750 score per no-hit wave (perfectWave source, stacks with existing perfect wave medal bonus).

**No-hit stage:** Every 5 waves, if no hits were taken across those waves, +5000 bonus (stageMilestone source).

---

## Survival Chains

**Milestones:** 30s, 60s, 120s hitless.

| Milestone | Multiplier gain | 
|-----------|----------------|
| 30s | +0.03 |
| 60s | +0.06 |
| 120s | +0.10 |

Each milestone awarded once per life. Resets after a hit (chain flags cleared). Multiplier gain is small — survival is about maintenance, not inflation.

**Anti-camping:** No survival chain awards if player has been idle (no multiplier gain events) for 10s (600 frames). Prevents camping in safe zones for free bonuses.

---

## Anti-Camping

| Condition | Effect |
|-----------|--------|
| 10s idle (no kills, no graze, no medal pickup) | Survival chain bonuses suppressed |
| Still suppresses | Recovery bonus still works (earned by surviving after hit) |

Does NOT: reduce score elsewhere, penalize movement, affect enemies/bosses.

---

## Telemetry

```js
getSurvivalScoringTelemetry(): {
  currentHitlessSeconds: 48,
  recoveryActive: false,
  recoverySuccesses: 2,
  noHitWaves: 5,
  noHitStages: 1,
  survivalChainLevel: 1,        // 1 = 30s milestone reached
  survivalChainTriggers: 1,
  campingSuppressed: false,
  waveNoHit: true
}
```

---

## Expected Contribution

| Player type | Survival % | Notes |
|------------|-----------|-------|
| Casual (frequent hits) | <5% | Recovery bonus occasionally, no chains |
| Average (occasional hits) | 5–10% | Some no-hit waves, recovery bonus |
| Good (rare hits) | 10–15% | Chain milestones, many no-hit waves |
| Elite (long hitless runs) | 15–22% | All milestones, no-hit stages, consistent recovery |

---

## Validation

```
node --check www/scores.js          → OK
node --check www/game-config.js     → OK
node --check www/hardcore-config.js → OK
node --check www/update.js          → OK
node --check www/progression.js     → OK
```

- ✅ No passive farming — anti-camping blocks idle bonuses
- ✅ Recovery rewarded but not dominant (1500 score + 0.10 mult)
- ✅ No-hit bonuses moderate (750 wave, 5000 stage)
- ✅ Survival chains small (0.03-0.10 multiplier gains)
- ✅ All frozen systems preserved
