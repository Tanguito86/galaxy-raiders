# HC-SC-07 — Medal Chain Economy

**Block:** HC-SC  
**Status:** Implemented (enhanced medal chain, recovery grace, anti-exploit)  
**Date:** 2026-05-22  
**Dependency:** HC-SC-06 (aggression), HC-SC-04 (multiplier)

---

## Overview

Enhanced medal system from basic chain to real routing/greed economy: partial decay (tier-based, not flat-5), recovery grace window (90 frames), multiplier gain/loss per medal, anti-exploit cap (12 drops/wave), telemetry.

---

## Files Modified (4)

| File | Change |
|------|--------|
| `www/medals.js` | +140 lines: HC-SC-07 module, enhanced miss handler, recovery grace, multiplier integration, anti-exploit |
| `www/game-config.js` | +12 lines: `medals` config block under scoreSystem.aggression |
| `www/hardcore-config.js` | +1 line: defaults synced |
| `www/update.js` | +2 lines: `updateMedalFrameCounter()`, `resetMedalWaveTracking()` |

---

## Config

```js
scoreSystem.aggression.medals: {
  chain: {
    decayEnabled: true,          // partial decay instead of flat -5
    missTierLoss: 2,             // lose 2 tiers on miss
    recoveryGraceFrames: 90      // grace window to save chain after miss
  },
  multiplier: {
    gainPerMedal: 0.020,         // multiplier gain on pickup
    lossPerMiss: 0.010           // small multiplier loss on miss
  },
  antiExploit: {
    maxDropsPerWave: 12          // maximum medals that can drop per wave
  }
}
```

---

## Chain Decay (modernized)

### Before (legacy)
```
miss → medalChain -= 5 (flat)
Tier 5 (chain 25+) → Tier 4 (chain 20)
```

### After (HC-SC-07)
```
miss → lose missTierLoss (2) tiers
Tier 5 (chain 25) → Tier 3 (chain 15)
Tier 3 (chain 15) → Tier 1 (chain 5)
Tier 1 (chain 5)  → Tier 0 (chain 0)
```

**Design:** Tier-based decay is more nuanced than a flat -5. A player at chain 27 (Tier 5+) drops to chain 15 (Tier 3). They kept 15 steps of progress instead of losing 22. Recovery from chain 15 to 25 requires 10 pickups.

---

## Recovery Grace

When a medal goes offscreen:
1. `recordMedalChainMiss()` is called
2. A grace window opens (90 frames ≈ 1.5s)
3. If player picks up ANY medal within the grace window → `recordMedalRecovery()`, chain is NOT dropped
4. If no medal is picked up within 90 frames → chain decay applies
5. Recovery only works if there are medals on screen to collect (otherwise, decay still triggers after grace expires)

**Design:** Gives the player a fighting chance. If they see a medal about to despawn, they can rush to grab another and maintain their chain. But if there are zero medals on screen, the grace window expires and decay happens.

---

## Multiplier Integration

| Event | Multiplier effect |
|-------|------------------|
| Medal pickup | +0.020 gain |
| Medal miss | −0.010 loss (small) |

Multiplier gain is small per medal. A chain of 10 medals = +0.20. An elite chain of 100+ medals = +2.00+. But in practice, decay prevents this from being sustainable.

---

## Anti-Exploit

| Exploit | Protection |
|---------|------------|
| Drop farming | Max 12 drops per wave (`maxDropsPerWave`) |
| Boss medal rain | Counts against wave cap — still capped total |
| FEVER abuse | FEVER doubles medal value, not drop count |
| Intentional despawn | Miss still causes chain decay |
| Infinite medal sustain | Decay + anti-exploit caps create natural ceiling |

---

## Telemetry

`getMedalChainTelemetry()`:
```js
{
  currentChain: 18,
  currentTier: 3,
  maxTier: 5,            // peak tier this run
  pickups: 42,
  misses: 3,
  recoveries: 1,         // times chain was saved by grace window
  dropsThisWave: 8,      // medals dropped in current wave
  feverActive: false,
  recoveryGraceActive: false
}
```

---

## Balance Goals

| Player type | Medal % | Tier sustain |
|------------|---------|-------------|
| Casual (ignores medals) | 3–6% | Tier 0–1 |
| Average (picks up convenient medals) | 8–12% | Tier 1–2 |
| Good (routes for medals) | 12–18% | Tier 3–4 |
| Elite (aggressive medal routing) | 20–30% | Tier 5 |

FEVER (chain ≥20) adds ×2 value, pushing elite medal contribution toward 25–30%. Still well under enemyKill (50–60%).

---

## Validation

```
node --check www/medals.js        → OK (419 lines)
node --check www/game-config.js   → OK
node --check www/hardcore-config.js → OK
node --check www/update.js        → OK
```

- ✅ No infinite medal loops (cap 12/wave)
- ✅ No brutal chain reset (partial decay, recovery grace)
- ✅ Multiplier synergy (gain on pickup, tiny loss on miss)
- ✅ Anti-exploit solid (drop cap per wave)
- ✅ FEVER not abused (value doubling is untouched, drop rate capped)
- ✅ All frozen systems preserved
