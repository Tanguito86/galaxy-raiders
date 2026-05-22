# HC-BD-10 — ORBITAL Pressure Ring Signature Hook

**Block**: HC-BD  
**Status**: Trial complete (ORBITAL only, flag-gated)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-09 (generic hook map, 2 bosses live)

---

## Overview

Third production integration. Adds an `orbitalPressure` signature to ORBITAL — a rotating ring of 4 bullets that appears around the boss, rotates during a 420ms delay, then fires outward.

---

## What Changed

### ORBITAL Profile Updated
- `signaturePlan.main`: `laserSweep` → `orbitalPressure`
- `signaturePlan.rage`: `phaseBurst` → `orbitalPressure`

### New Config Flag
`enableOrbitalSignatureHook: false` — added to all 3 config locations.

### Hook Flag Map Extended
`rotate: cfg.enableOrbitalSignatureHook` added.

### New Functions (in `www/update-boss.js`)
- `orbitalSignatureRing` — state object (active, timer, delayMs 420, cx, cy, radius 34, rotation, bulletCount 4)
- `tryOrbitalSignatureHook(bossRef)` — creates ring from intent
- `updateOrbitalSignatureRing(dt)` — advances timer, rotates ring, fires 4 bullets at delay end, clears state
- `drawOrbitalSignatureRingTelegraph(ctx)` — blue ring outline + 4 rotating dots + direction lines

### Wire Points
- **Update**: `updateOrbitalSignatureRing(dt)` in `updateBossStep`
- **Fire**: Hook before `switch(boss.pattern)` in fire cycle
- **Draw**: `drawOrbitalSignatureRingTelegraph(ctx)` after boss telegraphs

---

## Pressure Ring v0 Pattern

| Property | Value |
|----------|-------|
| Bullet count | 4 |
| Ring radius | 34px |
| Delay | 420ms |
| Rotation | ~1.6°/frame (visible rotation during delay) |
| Speed | 2.6 |
| Angles | 4 evenly spaced (90° apart), rotated by delay timer |
| Color | #4488ff / #6699ff / #3366cc (blue) |
| Visual | Ring outline + 4 pulsing dots + direction lines, alpha 0.15→0.45 |
| Cooldown | 4500ms (main slot, cyclic pacing) |

---

## Safety Guards

| Guard | Where | Effect |
|-------|-------|--------|
| Boss active | `tryOrbitalSignatureHook` | No ring if boss dead |
| Pattern rotate | `tryOrbitalSignatureHook` | ORBITAL only |
| Bullet array exists | `tryOrbitalSignatureHook` | No crash |
| One ring at a time | `tryOrbitalSignatureHook` | No overlapping rings |
| Intent valid | `shouldApplyBossSignatureIntent` | Director authorization |
| Boss flag | `shouldApplyBossSignatureIntent` | `enableOrbitalSignatureHook` |
| Transition/recovery | `shouldApplyBossSignatureIntent` | Blocked |
| Fairness | `shouldApplyBossSignatureIntent` | ≥ 0.35 |
| Cooldown | Intent system | ~4500ms |

---

## CRABTRON + SERPENTRIX Compatibility

Both previous hooks unchanged. All three bosses coexist via `hookFlagsByBoss` map. Fire cycle wire points are sequential.

---

## Known Limitations

1. **Fixed ring radius** — 34px. Doesn't scale with phase.
2. **No player tracking** — ring position is boss-centered only.
3. **No phase differentiation** — same ring in all phases.

---

## Flags Required

`enableBossDirector` + `enableBossSignatureIntents` + `enableOrbitalSignatureHook`

---

## Freeze Criteria

- [x] 4 bullets, evenly spaced
- [x] 420ms rotating delay
- [x] Blue ring telegraph
- [x] One ring at a time
- [x] Cooldown prevents spam
- [x] CRABTRON + SERPENTRIX unaffected
- [x] No crash if bullet array missing
