# HC-RK-04 — Safe Gameplay Wiring

**Block:** HC-RK  
**Status:** Implemented (rank affects gameplay, safety-governed, flag-gated)  
**Date:** 2026-05-22  
**Dependency:** HC-RK-03 (caps), HC-RK-02 (sources)

---

## Overview

Rank now affects gameplay — but ONLY through safety-governed wrappers. Every effect passes through the HC-RK-03 governor before being applied. A master config flag (`rankGameplayEffectsEnabled`) keeps everything off by default.

---

## What Changed

### Files Modified (6)

| File | Change |
|------|--------|
| `www/hardcore-rank.js` | +238 lines: gameplay wiring helpers, master enable, telemetry |
| `www/enemy-attacks.js` | `pushEnemyBullet()` wired through `getHardcoreRankGameplayBulletSpeed()` |
| `www/enemy-pattern-hooks.js` | Diver cooldown wired through `getHardcoreRankGameplayCooldown()` |
| `www/update.js` | Wave pause in `beginWaveTransition()` wired through `getHardcoreRankGameplayWavePause()` |
| `www/game-config.js` | +`rankGameplayEffectsEnabled: false` |
| `www/hardcore-config.js` | Default updated |

---

## Wiring Architecture

```
RANK ENGINE
  │
  ├─ rankGameplayEffectsEnabled? ──── NO → skip all effects
  │
  ├─ governor.apply? ──────────────── NO → skip, log block
  │
  └─ getCappedValue()
       │
       ├─ pushEnemyBullet()     → safe bullet speed (≤1.08, ≤5.20)
       ├─ diver cooldown         → safe cooldown (≥450ms)
       └─ beginWaveTransition() → safe wave pause (≥600ms)
            │
            └─ telemetry: record applied/capped/blocked
```

---

## New Functions (3 wrappers)

### `getHardcoreRankGameplayBulletSpeed(baseSpeed)`
```js
// Returns { multiplier, requested, capped, reason, governorApproved }
```
- Checks `gameplayEffectsEnabled` → no? returns 1.00
- Checks governor → blocked? returns 1.00
- Calls `getHardcoreRankSafeBulletSpeed(baseSpeed)` → returns capped multiplier
- Logs cap if speed was reduced
- Used in `pushEnemyBullet()` in `enemy-attacks.js`

### `getHardcoreRankGameplayCooldown(baseCooldown)`
```js
// Returns { multiplier, requested, capped, reason, governorApproved }
```
- Checks `gameplayEffectsEnabled` → no? returns 1.00
- Checks governor → blocked? returns 1.00
- Calls `getHardcoreRankSafeCooldown(baseCooldown)` → returns floored multiplier
- Logs cap if cooldown was raised
- Used in diver cooldown calculation in `enemy-pattern-hooks.js`

### `getHardcoreRankGameplayWavePause(baseMs)`
```js
// Returns { pauseMs, requested, capped, reason, governorApproved }
```
- Checks `gameplayEffectsEnabled` → no? returns baseMs
- Gets rhythm-scaled pause via `getHardcoreRhythmWavePause()`
- Checks governor → blocked? returns baseMs
- Calls `getHardcoreRankSafeWavePause(baseMs)` → returns floored pause
- Logs cap if pause was raised
- Used in `beginWaveTransition()` in `update.js`

---

## Config Gate

```
rankGameplayEffectsEnabled = false  → zero gameplay impact (identical to vanilla)
rankGameplayEffectsEnabled = true   → rank affects bullet speed, cooldown, wave pause
                                      (only when safety governor approves)
```

**Default: `false`** — must be explicitly enabled.

---

## Governor Integration

All 3 wrappers call `getHardcoreRankSafetyGovernor()` before applying. The governor blocks effects when:
- Rank disabled
- Not playing
- Player dead
- Player RECOVERING (<5s since hit)
- Combined pressure exceeds 5.20 ceiling
- Boss rank exceeds per-boss ceiling (EMPERADOR ≥ rank 5)

When blocked, effects fall back to their neutral value (1.00 multiplier / base timing). The block is logged via `recordHardcoreRankGovernorBlock()`.

---

## Telemetry

### `getHardcoreRankGameplayTelemetry()`
```js
{
  bulletSpeedApplications: 142,    // times rank bullet speed was applied
  bulletSpeedCaps: 3,              // times bullet speed was capped
  cooldownApplications: 18,        // times rank cooldown was applied
  cooldownCaps: 0,                 // times cooldown was capped
  wavePauseApplications: 7,        // times rank wave pause was applied
  wavePauseCaps: 1,                // times wave pause was capped
  governorBlocks: 2,               // times governor blocked effects
  lastAppliedAt: 1716384000000
}
```

Resets on new run via `resetHardcoreRankGameplayTelemetry()`.

---

## Systems NOT affected (intentionally)

| System | Reason |
|--------|--------|
| Player hitbox | Sacred — HC-HB freeze |
| Player speed | Sacred — movement must be consistent |
| Player fire rate | Sacred — weapon identity |
| Boss HP | Phase gate integrity |
| Graze radius | Readability constant |
| Invincibility frames | Death recovery fairness |
| Enemy count / spawn rate | Wave composer manages this |
| Dive frequency | Static per-level, not rank-wired |
| Boss patterns | Not rank-scaled (HC-BD frozen) |
| Enemy types per level | Fixed by wave composer |

---

## Example: Rank 5 in Action (when enabled)

```
Scene: Level 15, Rank 5, player is DOMINATING
  pushEnemyBullet(speed = 3.46):
    base: 3.46
    × rank requested: 3.46 × 1.12 = 3.88
    safety cap: min(3.88, 5.20) = 3.88  (within ceiling)
    governor: APPROVED (DOMINATING, not boss, within ceiling)
    applied: 3.88 ✓
    telemetry: bulletSpeedApplications++, not capped

Scene: Level 20 EMPERADOR, Rank 5, player just got hit
  pushEnemyBullet(speed = 4.84):
    governor: BLOCKED (player_recovering)
    applied: 4.84 (base, no rank)
    telemetry: governorBlocks++

Scene: Level 20 EMPERADOR, Rank 5, player SURVIVING
  pushEnemyBullet(speed = 4.84):
    base: 4.84
    × rank requested: 4.84 × 1.12 = 5.42
    safety cap: min(5.42, 5.20) = 5.20  (HIT CEILING)
    governor: BLOCKED (boss_ceiling_exceeded — EMPERADOR max rank 4)
    applied: 4.84 (base, no rank)
    telemetry: governorBlocks++
```

---

## Validation

```
node --check www/hardcore-rank.js        → OK (1216 lines)
node --check www/enemy-attacks.js        → OK
node --check www/enemy-pattern-hooks.js  → OK
node --check www/update.js               → OK
node --check www/game-config.js          → OK
node --check www/hardcore-config.js      → OK
```

## Safety Verification

| Check | Result |
|-------|--------|
| Bullet speed never > 1.08 from rank alone | ✅ Governor caps at 1.08 |
| Combined speed never > 5.20 | ✅ `getHardcoreRankSafeBulletSpeed()` enforces ceiling |
| Cooldown never < 450ms | ✅ `getHardcoreRankSafeCooldown()` floors |
| Wave pause never < 600ms | ✅ `getHardcoreRankSafeWavePause()` floors |
| Recovery protects after hit | ✅ Governor blocks during RECOVERING |
| Boss ceiling enforced | ✅ EMPERADOR max rank 4 |
| Player sacred params untouched | ✅ Hitbox, speed, fire rate, boss HP, graze, invuln — all untouched |
| All effects flag-gated | ✅ `gameplayEffectsEnabled: false` disables everything |
| Zero gameplay change when disabled | ✅ Neutral multipliers / base timings used |

## What HC-RK-05 Will Do
- Feedback: HUD indicator for rank intensity state
- Visual polish: subtle background shift at high rank
- Rank level-up celebration FX
- Pre-wave rank display
