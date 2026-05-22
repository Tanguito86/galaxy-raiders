# HC-BD-11 — TENIENTE Laser Sweep Signature Hook

**Block**: HC-BD  
**Status**: Trial complete (TENIENTE only, flag-gated)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-10 (4 bosses with generic hook map)

---

## Overview

Fourth signature integration. Adds `laserSweep` to TENIENTE — a diagonal line telegraph with 3 bullets sweeping along it after a 480ms delay.

---

## What Changed

### TENIENTE Profile Updated
- `primarySignature`: `pincerFire` → `laserSweep`
- `signaturePlan.main`: `pincerFire` → `laserSweep`
- `signaturePlan.rage`: `escapeBait` → `laserSweep`

### New Config Flag
`enableTenienteSignatureHook: false`

### Hook Flag Map Extended
`divebomb: cfg.enableTenienteSignatureHook` added.

### New Functions (in `www/update-boss.js`)
- `tenienteSignatureSweep` — state (active, timer, delayMs 480, originX/Y, angle ~70°, laneWidth 16, bulletCount 3, bulletSpacing 18)
- `tryTenienteSignatureHook(bossRef)` — creates sweep from intent
- `updateTenienteSignatureSweep(dt)` — timer advance, fires 3 bullets along sweep line, clears state
- `drawTenienteSignatureSweepTelegraph(ctx)` — dashed orange line + 3 pulsing dot markers

---

## Laser Sweep v0 Pattern

| Property | Value |
|----------|-------|
| Bullet count | 3 |
| Delay | 480ms |
| Angle | ~70° (diagonal down-right from boss) |
| Speed | 2.9 (±0.2 random spread for readability) |
| Bullet size | 5×12 px |
| Visual | Dashed orange line (#ff6633) + 3 pulsing dots (#ff8844), alpha 0.14→0.42 |
| Cooldown | 4500ms (main slot, dramatic_loop pacing → ×0.90 = 4050ms) |

---

## Safety Guards

| Guard | Where | Effect |
|-------|-------|--------|
| Boss active | Hook | No sweep if boss dead |
| Pattern divebomb | Hook | TENIENTE only |
| Bullet array | Hook + update | No crash |
| One sweep at a time | Hook | No overlapping sweeps |
| Intent valid | `shouldApplyBossSignatureIntent` | Director authorization |
| Boss flag | hookFlagsByBoss | `enableTenienteSignatureHook` |
| Transition/recovery | `shouldApplyBossSignatureIntent` | Blocked |
| Fairness | `shouldApplyBossSignatureIntent` | ≥ 0.35 |

---

## Flags Required

`enableBossDirector` + `enableBossSignatureIntents` + `enableTenienteSignatureHook`

---

## Previous Hooks

CRABTRON / SERPENTRIX / ORBITAL unchanged. All 4 hooks coexist.
