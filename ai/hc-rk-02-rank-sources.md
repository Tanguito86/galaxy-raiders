# HC-RK-02 — Rank Sources & Player Performance Tracking

**Block:** HC-RK  
**Status:** Implemented (measurement-only, zero difficulty impact)  
**Date:** 2026-05-22  
**Dependency:** HC-RK-01 (audit)

---

## Overview

Created the player performance measurement layer. Tracks hitless survival time, accuracy, wave clear speed, and classifies the player into one of three performance states: DOMINATING, SURVIVING, or RECOVERING.

**No difficulty is applied yet — measurement only.**

---

## What Changed

### Files Modified (5)

| File | Change |
|------|--------|
| `www/hardcore-rank.js` | Extended: `_hardcoreRankPerformance` state, performance state machine, survival timer, accuracy tracking, wave speed tracking, event hooks, telemetry snapshot. ~210 new lines. |
| `www/game-config.js` | Added 8 config keys to `rank` section |
| `www/hardcore-config.js` | Updated `rank` defaults |
| `www/update.js` | Wired `updateHardcoreRankPerformance(dt)` into game loop, wave clear/start hooks |
| `www/progression.js` | Wired `recordHardcoreRankHit`, `recordHardcoreRankShotFired`, `recordHardcoreRankShotHit` |

### No Changes To
- Enemy behavior, boss behavior, bullet speed, cooldown, HP, any gameplay parameter
- HC-RD, HC-HB, HC-PD, HC-WC, HC-BD frozen systems
- Balance profiles, difficulty tables

---

## New Config Parameters

`game-config.js → rank:`

| Key | Default | Purpose |
|-----|---------|---------|
| `survivalRankIntervalMs` | 5000 | How often to award survival rank (ms) |
| `survivalRankAmount` | 0.4 | Rank per interval while DOMINATING |
| `accuracyCheckIntervalMs` | 4000 | How often to check accuracy (ms) |
| `accuracyBonusThreshold` | 65 | Accuracy % needed for bonus |
| `accuracyBonusAmount` | 0.3 | Rank per accuracy check if ≥ threshold |
| `waveSpeedBonusAmount` | 0.5 | Rank for clearing wave < 30s |
| `dominatingHitlessMs` | 15000 | Seconds hitless to enter DOMINATING |
| `recoveringMs` | 5000 | Seconds after hit to exit RECOVERING |

---

## Performance State Machine

```
        ┌──────────────┐
        │  RECOVERING  │ ←─ entered on player hit
        │  < 5s since  │
        │   last hit   │
        └──────┬───────┘
               │ after 5s hitless
               ▼
        ┌──────────────┐
        │  SURVIVING   │ ←─ default state between recovery and domination
        │  5s–15s      │
        │   hitless    │
        └──────┬───────┘
               │ after 15s hitless
               ▼
        ┌──────────────┐
        │ DOMINATING   │ ←─ player is crushing it
        │  > 15s       │
        │   hitless    │
        └──────────────┘
               │
               │ on hit → RECOVERING
               ▼
        [back to RECOVERING]
```

**Transition rules:**
- Any hit → RECOVERING (resets hitless timer, freezing invuln frames)
- Hitless for recoveringMs (5s) → SURVIVING
- Hitless for dominatingHitlessMs (15s) → DOMINATING

**During invincibility (invincibleTimer > 0):** Performance update pauses — timer and state frozen until invuln ends.

---

## Rank Sources (new + existing)

| Source | Mechanism | Amount | Frequency |
|--------|-----------|--------|-----------|
| Enemy kills | Existing | +0.75/kill | Per kill |
| Boss phases | Existing | +2.5/phase | Per phase |
| Boss clears | Existing | +4.0/clear | Per boss |
| Graze | Existing | +0.35/graze | Per graze |
| **Survival (new)** | DOMINATING state bonus | +0.4/5s | While DOMINATING |
| **Accuracy (new)** | ≥65% hits | +0.3/4s | Periodic check |
| **Wave speed (new)** | <30s wave clear | +0.5/wave | Per wave |
| **Wave speed extra (new)** | <15s wave clear | +0.75/wave | Per fast wave |

| Sink | Mechanism | Amount | Frequency |
|------|-----------|--------|-----------|
| Player death | Existing | −8.0/hit | Per death |
| Decay | Existing | −0.15/s | After 6s inactivity |

## Source Breakdown Telemetry

`getHardcoreRankPerformanceState()` returns:

```js
{
  performanceState: 'DOMINATING' | 'SURVIVING' | 'RECOVERING',
  hitlessDurationMs: 23400,
  longestHitlessMs: 45100,
  accuracyPercent: 72.5,
  waveClearedCount: 8,
  fastestWaveMs: 12400,
  lastWaveMs: 18800,
  rankFromKills: 18.75,
  rankFromSurvival: 2.4,
  rankFromAccuracy: 1.2,
  rankFromBossPhases: 5.0,
  rankFromBossClears: 8.0,
  rankFromGraze: 1.05,
  rankFromWaveSpeed: 2.5,
  rankLostFromDeaths: 8.0,
  rankLostFromDecay: 1.35
}
```

## Event Hooks

| Hook | Called from | When |
|------|------------|------|
| `window.recordHardcoreRankHit(now)` | `progression.js recordPlayerDeath()` | Player takes damage |
| `window.recordHardcoreRankShotFired(count)` | `progression.js recordShotsFired()` | Player fires weapon |
| `window.recordHardcoreRankShotHit(count)` | `progression.js recordShotHit()` | Bullet hits enemy |
| `window.recordHardcoreRankWaveStart(now)` | `update.js` after `startLevel()` | New wave begins |
| `window.recordHardcoreRankWaveClear(now)` | `update.js beginWaveTransition()` | Current wave cleared |
| `window.updateHardcoreRankPerformance(dt, now)` | `update.js` each frame | Main performance tick |

## Telemetry Snapshot

`window.getHardcoreRankTelemetrySnapshot()` returns:

```js
{
  rank: { value, level, multiplier, lastReason, lastChangeAt },
  performance: { ... full state ... },
  timestamp: 1716384000000
}
```

## Validation

```
node --check www/hardcore-rank.js    → OK
node --check www/game-config.js      → OK
node --check www/hardcore-config.js  → OK
node --check www/update.js           → OK
node --check www/progression.js      → OK
```

## Can HC-RK Now Answer "What Is The Player Doing?"

| Question | Answer |
|----------|--------|
| "¿El jugador está dominando?" | `getHardcoreRankPerformanceLabel() === 'DOMINATING'` |
| "¿Está sobreviviendo?" | `getHardcoreRankPerformanceLabel() === 'SURVIVING'` |
| "¿Está recuperándose?" | `getHardcoreRankPerformanceLabel() === 'RECOVERING'` |
| "¿Cuánto lleva sin que le peguen?" | `hitlessDurationMs` |
| "¿Cuál es su accuracy?" | `accuracyPercent` |
| "¿Está limpiando olas rápido?" | `lastWaveMs < 30000` |
| "¿De dónde viene su rank?" | Source breakdown in performance state |

**✅ Yes. All three states are measurable in real-time with zero gameplay impact.**
