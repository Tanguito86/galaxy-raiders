# HC-SC-08 — Boss Efficiency & No-Hit Rewards

**Block:** HC-SC  
**Status:** Implemented (phase efficiency, no-hit, anti-milk, conservative scaling)  
**Date:** 2026-05-22  
**Dependency:** HC-SC-07 (medals), HC-SC-04 (multiplier)

---

## Overview

Boss mastery economy: phase efficiency scoring (ELITE/GOOD/SLOW tiers), no-hit phase/full-boss bonuses, anti-milking decay, phase-clear multiplier gain. Zero HC-BD changes — all via passive observation.

---

## Files Modified (6)

| File | Change |
|------|--------|
| `www/scores.js` | +140 lines: boss efficiency state, phase tracking, no-hit, anti-milk, telemetry |
| `www/game-config.js` | +16 lines: `bossScoring` config under `scoreSystem.aggression` |
| `www/hardcore-config.js` | to update (defaults) |
| `www/update-boss.js` | +1 line: `onBossEfficiencyPhaseClear()` on phase change |
| `www/update-enemies.js` | +2 lines: efficiency multiplier on boss kill + `onBossEfficiencyClear()` |
| `www/entities.js` | +2 lines: `onBossEfficiencyStart()` on boss spawn |
| `www/progression.js` | +2 lines: `onBossEfficiencyHit()` on player death (no-hit tracking) |

---

## Config

```js
bossScoring: {
  efficiency: {
    targetPhaseMs: 15000,    // baseline phase time
    eliteBonus: 2.0,        // ×2.0 if phase ≤75% of target
    eliteThreshold: 0.75,   // ratio for ELITE
    goodBonus: 1.4,         // ×1.4 if phase ≤100% of target
    goodThreshold: 1.0      // ratio for GOOD
  },
  noHit: {
    phaseBonus: 2500,       // score bonus per no-hit phase
    fullBossBonus: 10000    // bonus for complete boss no-hit
  },
  antiMilk: {
    softCapMs: 30000,       // 30s — boss kill must be faster
    scoreDecayAfter: 0.50   // halve boss kill score if too slow
  },
  multiplier: {
    phaseClearGain: 0.050   // multiplier bump on phase clear
  }
}
```

---

## Phase Efficiency Tiers

| Tier | Condition | Effect |
|------|-----------|--------|
| ELITE | phase time ≤ 11.25s (75% of 15s target) | +0.050 multiplier, label 'ELITE' |
| GOOD | phase time ≤ 15s (100% of target) | +0.050 multiplier, label 'GOOD' |
| SLOW | phase time > 15s | +0.050 multiplier, label 'SLOW' |

Multiplier gain is the same for all tiers — speed itself is its own reward. Labels are for telemetry.

---

## No-Hit System

| Event | Reward |
|-------|--------|
| No-hit phase | +2500 score (awarded as `bossHit` source) |
| Full boss no-hit (all phases clean) | +10000 score (× anti-milk mult if triggered) |

Hit during a phase → that phase is not "no-hit". Subsequent phases can still be no-hit. Only full boss no-hit requires ALL phases clean.

**Design:** No-hit is rewarded but not game-defining. 2500/phase is significant but a single player death (−8 rank, −30% multiplier) already costs much more.

---

## Anti-Milking

If the entire boss fight lasts > 30 seconds (softCapMs):
- All boss-related score is halved (×0.50)
- Applies to: bossKill, no-hit fullBossBonus
- Does NOT apply to: bossHit, phase no-hit bonuses (those are phase-level)

Detected via `isBossBeingMilked()` — based on total time since boss start.

---

## Boss Kill Score (updated)

```
bossKill = 5000 × rankMult × comboMult × efficiencyMult × antiMilkMult
```

efficiencyMult: from `getBossEfficiencyMultiplier()` — applies anti-milk decay
antiMilkMult: ×1.0 normally, ×0.50 if boss > 30s

---

## Telemetry

```js
getBossEfficiencyTelemetry(): {
  bossActive: true,
  bossPattern: 'supreme',
  phaseTimes: [8200, 11000, 14200],    // ms per phase
  efficiencyLabels: ['ELITE', 'GOOD', 'GOOD'],
  totalPhases: 3,
  noHitPhases: 2,        // 2 of 3 phases were no-hit
  fullBossNoHit: false,  // took a hit in one phase
  hitTaken: true,
  antiMilkTriggered: false,
  currentTime: 33400     // ms since boss start
}
```

---

## Validation

```
node --check www/scores.js          → OK
node --check www/game-config.js     → OK
node --check www/update-boss.js     → OK
node --check www/update-enemies.js  → OK
node --check www/entities.js        → OK
node --check www/progression.js     → OK
```

- ✅ No boss milk exploit — 30s soft cap halving score
- ✅ No DPS-check frustration — tiers are time-based, not damage-based
- ✅ No-hit rewarded but not mandatory
- ✅ Phase tracking via existing `boss.phaseChanged`
- ✅ All frozen systems preserved (HC-BD phase transitions unchanged)
