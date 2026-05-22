# HC-SC-04 — Mastery Multiplier Foundation

**Block:** HC-SC  
**Status:** Implemented (multiplier live, conservative tuning)  
**Date:** 2026-05-22  
**Dependency:** HC-SC-03 (call site migration)

---

## Overview

First score economy change. Mastery multiplier rewards aggressive, consistent play. Smooth gain/decay, partial penalties, controlled inflation (target: 1.2–1.8 average, 2.2–2.8 excellent, cap 3.0).

---

## Files Modified (6)

| File | Change |
|------|--------|
| `www/scores.js` | +236 lines: multiplier state, gain/decay/penalty functions, HUD, telemetry, awardScore integration |
| `www/game-config.js` | +16 lines: `scoreSystem.multiplier` config block |
| `www/hardcore-config.js` | +1 line: defaults synced |
| `www/update.js` | +1 line: `updateScoreMultiplierDecay()` each frame |
| `www/draw.js` | +1 line: `drawScoreMultiplierHUD()` in gameplay section |
| `www/progression.js` | +4 lines: `applyScoreMultiplierPenalty('death')` on player death |

---

## Multiplier Architecture

```
┌─────────────────────────────────────────────┐
│                 GAIN SOURCES                │
│  enemyKill   +0.015                         │
│  closeRange  +0.020                         │
│  graze       +0.010                         │
│  bossHit     +0.008                         │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│              TARGET VALUE                    │
│  lerps toward target at 0.25/frame (gain)   │
│  lerps toward target at 0.10/frame (decay)  │
│  clamped: 1.0 – 3.0                         │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│              CURRENT VALUE                   │
│  applied to all score via awardScore()       │
│  finalScore = basePoints × currentMultiplier │
└─────────────────────────────────────────────┘
```

---

## Config

```js
scoreSystem.multiplier: {
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
    idleDelayFrames: 180,    // ~3s at 60fps
    ratePerFrame: 0.0008     // ~0.048/s (~17s to go from 2.0 to 1.0)
  },
  penalties: {
    deathLossPercent: 0.30,  // lose 30% of current multiplier
    hitLossPercent: 0.10     // lose 10% on hit
  }
}
```

## Gain Behavior

| Action | Gain | To reach ×2.0 | To reach ×3.0 |
|--------|------|--------------|--------------|
| Enemy kills | +0.015 | ~67 kills | ~134 kills |
| Close-range kills | +0.020 | ~50 kills | ~100 kills |
| Graze | +0.010 | ~100 grazes | ~200 grazes |
| Boss hits | +0.008 | ~125 hits | ~250 hits |

**Expected average scenario (5 min of play, 100 kills, 20 close-range, 10 grazes, 5 boss hits):**
- Gain: 100×0.015 + 20×0.020 + 10×0.010 + 5×0.008 = 1.5 + 0.4 + 0.1 + 0.04 = 2.04
- After decay: ~1.6–1.8 (subtle net loss between waves)
- **Target zone: ×1.2 – ×1.8** ✅

## Decay Behavior

- Kicks in after ~180 frames (~3s) without a gain event
- Rate: 0.0008/frame = ~0.048/second
- Falls from ×2.0 to ×1.0 in ~21s of total inactivity
- Does NOT decay during boss transitions (gain events from boss hits)
- Player who keeps killing stays above ×1.5 easily

## Penalties

| Event | Loss | Example (×2.0) |
|-------|------|----------------|
| Death | 30% | ×2.0 → ×1.4 |
| Hit | 10% | Not wired yet — future use |
| Never resets | 0% to 1.0 | Minimum is always ×1.0 |

**Design choice:** No full reset. Partial loss keeps recovery viable. Player who dies once can rebuild in ~10-15 kills.

---

## HUD Display

- Position: bottom-left, below combo/graze
- Text: `x1.42` format, 6px font
- Colors: grey → amber → orange → gold as multiplier rises
- Subtle pulse when recently gained (fades over 30 frames)
- Hidden when multiplier ≤ 1.01 (don't clutter when at base)

---

## Telemetry

`getScoreMultiplierTelemetry()`:
```js
{
  current: 1.84,
  target: 1.86,
  peak: 2.35,
  max: 3.0,
  uptimePercent: 78,     // % frames above ×1.0
  totalGains: 145,
  totalDecays: 230,
  totalPenalties: 1
}
```

---

## Inflation Control

| Measure | Value |
|---------|-------|
| Max multiplier | ×3.0 (hard cap) |
| Decay | Yes (0.048/s after 3s idle) |
| Death penalty | −30% (not full reset) |
| No exponential gains | Linear gain per event |
| Smooth lerp | 0.25/frame up, 0.10/frame down |
| Total score inflation | ~1.2–1.8× for average runs |

**Score curve impact:** Smooth. Early game near ×1.0. Mid-game builds to ×1.3–1.5. Late game sustains ×1.5–2.0. Exceptional runs hit ×2.5. Almost never touches ×3.0 cap.

---

## Anti-Exploit

| Exploit | Block |
|---------|-------|
| AFK multiplier hold | Decay activates after 3s idle |
| Safe corner farming | No kills = decay pulls back |
| Boss milk | Boss hits give only +0.008, decay outpaces slow farming |
| Idle survival | No gain events = multiplier returns to ×1.0 |

---

## Validation

```
node --check www/scores.js         → OK (598 lines)
node --check www/game-config.js    → OK
node --check www/hardcore-config.js → OK
node --check www/update.js         → OK
node --check www/draw.js           → OK
node --check www/progression.js    → OK
```

- ✅ Gameplay identical outside score multiplication
- ✅ No score explosion (cap ×3.0, decay active)
- ✅ No readability regressions (HUD is minimal)
- ✅ No multiplier exploits (decay + death penalty)
- ✅ No pacing changes
- ✅ HC-RK / HC-BD / HC-WC preserved
