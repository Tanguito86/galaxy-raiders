# HC-RK-03 — Fairness Caps & Safety Governor

**Block:** HC-RK  
**Status:** Implemented (safety-only, zero difficulty application)  
**Date:** 2026-05-22  
**Dependency:** HC-RK-02 (sources), HC-RK-01 (audit)

---

## Overview

Safety governor layer. Prevents rank from producing unfair, unreadable, or impossible difficulty. All checks are config-driven. No difficulty is applied — only validation, capping, and blocking.

---

## Architecture

```
Rank Engine (HC-RK-02)
  │
  ├─ getHardcoreRankBulletSpeedMultiplier()
  ├─ getHardcoreRankCooldownMultiplier()
  └─ getHardcoreRankMultiplier()
       │
       │ ┌─ bullet speed → getHardcoreRankSafeBulletSpeed(base)
       │ │                  └─ cap: 1.08 × base ≤ 5.20
       ├─┤
       │ │─ cooldown → getHardcoreRankSafeCooldown(base)
       │ │            └─ floor: 450ms
       ├─┤
       │ │─ wave pause → getHardcoreRankSafeWavePause(base)
       │ │              └─ floor: 600ms
       ├─┤
       │ │─ combined → getHardcoreRankCombinedPressure()
       │ │            └─ ceiling: 5.20
       └─┤
         └─ governor → getHardcoreRankSafetyGovernor()
                       ├─ player_recovering? → BLOCK
                       ├─ pressure_ceiling_exceeded? → BLOCK
                       └─ boss_ceiling_exceeded? → BLOCK
```

---

## Config Parameters

`game-config.js → rank:`

| Key | Default | Purpose |
|-----|---------|---------|
| `safetyBulletSpeedMax` | 1.08 | Max rank multiplier on bullet speed |
| `safetyCooldownFloorMs` | 450 | Absolute min enemy cooldown (ms) |
| `safetyWavePauseFloorMs` | 600 | Absolute min wave RELIEF pause (ms) |
| `safetyCombinedCeiling` | 5.20 | Max (base × rank × pressure) bullet speed |
| `safetyRecoveryLimit` | 2 | Max rank level during RECOVERING state |
| `safetyBossRankCeilings` | `{ crab:5, serp:5, orb:5, ten:5, emp:4 }` | Per-boss max rank level |
| `safetyWaveIntensityCeiling` | 0.85 | Max (wave_intensity × rank_multiplier) |
| `safetyAntiSpikeMaxStep` | 8 | Max rank value change per step |
| `safetySpikeCooldownMs` | 2000 | Cooldown between allowed spikes |

---

## Functions

### Parameter Caps

| Function | Input | Output | Cap |
|----------|-------|--------|-----|
| `getHardcoreRankSafeBulletSpeed(baseSpeed)` | Base speed from difficulty table | Capped speed | ≤ 1.08 × base AND ≤ 5.20 |
| `getHardcoreRankSafeCooldown(baseCooldown)` | Base cooldown in ms | Floored cooldown | ≥ 450ms |
| `getHardcoreRankSafeWavePause(baseMs)` | Base pause in ms | Floored pause | ≥ 600ms |
| `getHardcoreRankCombinedPressure()` | (none, reads live state) | `{safe, multiplier, rankOnly, pressureOnly, combined_raw, ceiling, reason}` | combined ≤ 5.20 |

### Boss Safety

| Function | What |
|----------|------|
| `getHardcoreRankSafeBossCeiling(pattern)` | Returns max rank level for boss type |
| `isHardcoreRankSafeForBoss(bossRef)` | `{safe, currentLevel, maxLevel, reason}` |

**Per-boss ceilings:**
| Boss | Pattern | Max Rank |
|------|---------|----------|
| CRABTRON | crossfire | 5 |
| SERPENTRIX | zigzag | 5 |
| ORBITAL | rotate | 5 |
| TENIENTE | divebomb | 5 |
| EMPERADOR | supreme | **4** (restricted) |

### Wave Safety

| Function | What |
|----------|------|
| `isHardcoreRankSafeForWave(intensity)` | Returns true if rank×intensity ≤ 0.85 |

### Recovery Protection

| Function | What |
|----------|------|
| `shouldBlockRankForRecovery()` | True when player is RECOVERING |
| `getEffectiveRankMultiplier()` | Returns capped multiplier during RECOVERING (max 1.25 / rank level 2) |

### Anti-Spike

| Function | What |
|----------|------|
| `validateHardcoreRankSpike(current, target)` | `{allowed, adjusted, reason}` — limits step size to 8, enforces 2s cooldown |

### Central Governor

| Function | What |
|----------|------|
| `getHardcoreRankSafetyGovernor()` | Master check: `{apply, reason, details}` |

**Check order:**
1. Rank disabled? → BLOCK
2. Not playing? → BLOCK
3. Player dead? → BLOCK
4. RECOVERING? → BLOCK (cap to recovery limit)
5. Combined pressure > ceiling? → BLOCK
6. Boss rank > boss ceiling? → BLOCK
7. All clear → APPROVED

### Telemetry

| Function | What |
|----------|------|
| `logHardcoreRankSafetyBlock(reason)` | Records what blocked rank and when |
| `logHardcoreRankSafetyCap(parameter, requested, capped)` | Records what was capped and by how much |
| `getHardcoreRankSafetyLog()` | Returns full block/cap history (last 20/30) |
| `resetHardcoreRankSafetyLog()` | Clears log on new run |
| `resetHardcoreRankSpikeTracking()` | Clears spike tracking |

---

## Multiplicative Explosion Prevention

The danger: rank × pressure × rhythm × level creates compound multipliers.

```
Example at rank 5 + level 20:
  Base speed:      4.84
  × rank (1.12):   5.42   ← exceeds 5.20 ceiling → capped
  × pressure (1.18): 6.39 ← would be completely unreadable

With governor:
  Safe bullet speed: min(4.84 × min(1.12, 1.08), 5.20) = min(5.23, 5.20) = 5.20
  Combined pressure check: 1.12 × 1.18 = 1.32 → exceeds 5.20? Actually checks rank×pressure ≤ config ceiling
```

**The cap is applied at the parameter level, not the multiplier level.** Each individual output (bullet speed, cooldown, wave pause) is independently capped before it reaches the game.

---

## Frozen System Compatibility

| System | Governor effect |
|--------|----------------|
| HC-RD | Bullet speed caps preserve readability (alpha floors untouched) |
| HC-HB | Player hitbox never scaled |
| HC-PD | Pattern director not rank-aware — no interference |
| HC-WC | Wave pause floors preserve RELIEF phase timing |
| HC-BD | Boss ceilings prevent unfair signature combinations |

---

## Example: EMPERADOR at Rank 4

```
Rank level: 4 (ceiling for supreme = 4)
  → isHardcoreRankSafeForBoss(emperor) = { safe: true, maxLevel: 4, reason: 'within_limit' }

Rank level: 5 (exceeds ceiling)
  → isHardcoreRankSafeForBoss(emperor) = { safe: false, maxLevel: 4, reason: 'boss_ceiling_exceeded' }
  → Governor: { apply: false, reason: 'boss_ceiling_exceeded' }
  → Rank effects NOT applied to EMPERADOR fight
```

## Example: Player Just Hit (RECOVERING)

```
PerformanceState: RECOVERING
  → shouldBlockRankForRecovery() = true
  → getEffectiveRankMultiplier() = 1.12 (recoveryLimit = 2 → rank level 2 multiplier)
  → Governor: { apply: false, reason: 'player_recovering' }
  → Rank difficulty effects paused for 5 seconds after hit
```

---

## Validation

```
node --check www/hardcore-rank.js    → OK
node --check www/game-config.js      → OK
node --check www/hardcore-config.js  → OK
```

## No Difficulty Applied

This layer produces **zero gameplay changes.** It only:

1. Returns capped values when asked
2. Returns boolean safety verdicts when checked
3. Records block/cap events in telemetry

No system currently calls these functions to apply difficulty. They are ready for HC-RK-04 (Effect Harden & Apply) to wire into the game.

---

## What HC-RK-04 Will Do

- Wire `getHardcoreRankSafeBulletSpeed()` into `pushEnemyBullet()` in enemy-attacks.js
- Wire `getHardcoreRankSafeCooldown()` into enemy cooldown calculation
- Wire `getHardcoreRankSafeWavePause()` into wave composer timing
- Wire `getEffectiveRankMultiplier()` into the pressure/rhythm systems
- Call `getHardcoreRankSafetyGovernor()` before applying any rank effect
- Log all blocks and caps for debugging
