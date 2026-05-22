# HC-BD-12 — EMPERADOR Phase Burst Signature Hook

**Block**: HC-BD  
**Status**: Trial complete (EMPERADOR only, flag-gated)  
**Date**: 2026-05-22  
**Dependency**: HC-BD-11 (5 bosses with generic hook map)

---

## Overview

Fifth and final signature integration. Adds `phaseBurst` to EMPERADOR — a radial telegraph with 5 directional markers and a wide slow fan of 5 bullets after a 500ms delay.

---

## What Changed

### EMPERADOR Profile Updated
- `primarySignature`: `arenaSplit` → `phaseBurst`
- `signaturePlan`:
  - `intro`: `orbitalPressure` → `aimedBurst`
  - `main`: `arenaSplit` → `phaseBurst`
  - `rage`: `phaseBurst` (unchanged)
  - `finale`: (new) `phaseBurst`

### New Config Flag
`enableEmperadorSignatureHook: false`

### Hook Flag Map Extended
`supreme: cfg.enableEmperadorSignatureHook` added.

### New Functions (in `www/update-boss.js`)
- `emperadorSignatureBurst` — state (active, timer, delayMs 500, originX/Y, angles [60°, 80°, 90°, 100°, 120°], bulletCount 5)
- `tryEmperadorSignatureHook(bossRef)` — creates burst from intent
- `updateEmperadorSignatureBurst(dt)` — timer advance, fires 5 bullets along radial fan, clears state
- `drawEmperadorSignatureBurstTelegraph(ctx)` — thin red/gold ring + 5 directional markers

### Telegraph Call Added (in `www/draw.js`)
- `drawEmperadorSignatureBurstTelegraph(ctx)` called alongside other signature telegraphs

---

## Phase Burst v0 Pattern

| Property | Value |
|----------|-------|
| Bullet count | 5 |
| Delay | 500ms |
| Angles | 60°, 80°, 90°, 100°, 120° (wide readable fan) |
| Speed | 2.6 (outermost) to 3.1 (innermost) — slower at edges |
| Bullet size | 6×10 px |
| Visual | Red ring (#ff3333) + gold outer ring (#ffaa00), 5 orange direction lines (#ff4444) with pulsing dots (#ff8844), alpha 0.15→0.45 |
| Cooldown | Managed by signature intent system |

---

## Safety Guards

| Guard | Where | Effect |
|-------|-------|--------|
| Boss active | Hook | No burst if boss dead |
| Pattern supreme | Hook | EMPERADOR only |
| Bullet array | Hook + update | No crash |
| One burst at a time | Hook | No overlapping bursts |
| Intent valid | `shouldApplyBossSignatureIntent` | Director authorization |
| Boss flag | hookFlagsByBoss | `enableEmperadorSignatureHook` |
| Transition/recovery | `shouldApplyBossSignatureIntent` | Blocked |
| Fairness | `shouldApplyBossSignatureIntent` | ≥ 0.35 |
| Max 5 bullets | Hook + update | Enforced by array length |

---

## Flags Required

`enableBossDirector` + `enableBossSignatureIntents` + `enableEmperadorSignatureHook`

---

## Previous Hooks

CRABTRON / SERPENTRIX / ORBITAL / TENIENTE unchanged. All 5 hooks coexist.

---

## Rollback Steps

1. Set `enableEmperadorSignatureHook: false` in both config files
2. Revert boss-director.js EMPERADOR profile to original primarySignature/signaturePlan
3. Remove `supreme: cfg.enableEmperadorSignatureHook` from hookFlagsByBoss
4. Remove `tryEmperadorSignatureHook`, `updateEmperadorSignatureBurst`, `drawEmperadorSignatureBurstTelegraph` from update-boss.js
5. Remove telegraph call from draw.js
6. Delete this file

---

## Known Risks

- **Partial freeze criteria**: If `enableBossDirector=true` + `enableBossSignatureIntents=true` but `enableEmperadorSignatureHook=false`, EMPERADOR will generate signature intents without a hook handler. The intent will time out naturally (expiry policy). This is safe — no crash, just unused intents.
- **Fan overlap at center**: All 5 bullets originate from the same point. At very close range the fan may not have spread enough to be readable. Acceptable for v0 given EMPERADOR's arena positioning.
- **Bullet speed gradient slow → fast**: Outermost bullets at 60°/120° travel slower (2.6) than innermost at 90° (3.1). This creates a natural spread that widens over distance.
