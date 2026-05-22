# HC-BD-09 — SERPENTRIX Delayed Trap Signature Hook

**Block**: HC-BD  
**Status**: Trial complete (SERPENTRIX only, flag-gated)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-08 (CRABTRON hook, generic intent system)

---

## Overview

Second production integration of the Boss Director intent system. Adds a `delayedTrap` signature to SERPENTRIX. The trap is marked with green circles, delays 380ms, then fires 2 bullets from lateral positions.

---

## What Changed

### SERPENTRIX Profile Updated
- `primarySignature`: `rotatingFan` → `delayedTrap`
- `signaturePlan.rage`: `rotatingFan` → `delayedTrap`
- `signaturePlan.main` already was `delayedTrap`

### New Config Flag
`enableSerpentrixSignatureHook: false` — added to all 3 config locations.

### Generic Hook Flag Map (HC-BD-09 enhancement)
`shouldApplyBossSignatureIntent` now uses a generic `hookFlagsByBoss` map:
```js
{
  crossfire: cfg.enableCrabtronSignatureHook,
  zigzag: cfg.enableSerpentrixSignatureHook
}
```
Future bosses just add entries to this map.

### New Function: `trySerpentrixSignatureHook()`
In `www/update-boss.js`. Creates a `serpentrixSignatureTrap` state object.

### New State: `serpentrixSignatureTrap`
```js
{
  active: true,
  timer: 0,
  delayMs: 380,
  bossKey: 'zigzag',
  points: [
    { x, y, angle: PI/2 + 0.28 },  // left → down-right
    { x, y, angle: PI/2 - 0.28 }   // right → down-left
  ]
}
```

### New Function: `updateSerpentrixSignatureTrap(dt)`
Called each frame from `updateBossStep`. Advances timer, fires bullets when delay expires, clears state.

### New Function: `drawSerpentrixSignatureTrapTelegraph(ctx)`
Called from `draw.js` after boss telegraphs. Draws green pulsing circles at trap points that brighten as delay expires. Includes direction indicators (small lines pointing bullet direction).

### Wire Points
- **Update**: `updateSerpentrixSignatureTrap(dt)` called in `updateBossStep` after boss director hook
- **Fire**: Hook called before `switch(boss.pattern)` in fire cycle, parallel to CRABTRON hook

---

## Delayed Trap v0 Pattern

| Property | Value |
|----------|-------|
| Trap points | 2 (left + right of boss, 38px offset) |
| Bullets per trap | 1 per point = 2 total |
| Delay | 380ms |
| Angles | ~70° and ~110° (moderate outward) |
| Speed | 2.6 |
| Color | #44dd44 / #33cc33 / #22aa22 (green) |
| Visual telegraph | Pulsing circles + direction lines, alpha 0.18→0.50 |
| Cooldown | 4500ms (main slot, rhythmic pacing → ×0.90 = 4050ms) |
| One active trap | Blocks re-creation while active |

---

## Safety Guards

| Guard | Where | Effect |
|-------|-------|--------|
| Boss active | `trySerpentrixSignatureHook` | No trap if boss dead |
| Pattern zigzag | `trySerpentrixSignatureHook` | SERPENTRIX only |
| Bullet array exists | `trySerpentrixSignatureHook` | No crash |
| One trap at a time | `trySerpentrixSignatureHook` | No overlapping traps |
| Intent valid | `shouldApplyBossSignatureIntent` | Director authorization |
| Boss-specific flag | `shouldApplyBossSignatureIntent` | `enableSerpentrixSignatureHook` |
| Transition/recovery | `shouldApplyBossSignatureIntent` | Blocked during safety windows |
| Fairness | `shouldApplyBossSignatureIntent` | Rhythm score ≥ 0.35 |
| Cooldown | Intent system | ~4050ms between signatures |

---

## Flags Required

| Flag | Purpose |
|------|---------|
| `enableBossDirector` | Master switch |
| `enableBossSignatureIntents` | Allow intent creation |
| `enableSerpentrixSignatureHook` | Allow SERPENTRIX hook |

---

## CRABTRON Compatibility

CRABTRON hook unchanged. Both hooks coexist via the generic `hookFlagsByBoss` map in `shouldApplyBossSignatureIntent`. Each boss has its own flag gate. Fire cycle wire points are sequential (CRABTRON first, then SERPENTRIX).

---

## Known Limitations

1. **No phase differentiation** — same trap in all phases that use `delayedTrap` candidate
2. **Fixed spawn positions** — always 38px from boss center. Doesn't track player.
3. **No trap persistence** — trap fires once and clears. Future: traps could persist as mines.
4. **Draw hook dependency** — if `draw.js` doesn't call the telegraph function, trap is invisible (but still fires). The trap still has a 380ms delay which provides implicit timing telegraph.

---

## Rollback Steps

1. Set `enableSerpentrixSignatureHook: false`
2. Or set `enableBossSignatureIntents: false`
3. Or set `enableBossDirector: false`

---

## Freeze Criteria

- [x] Hook fires only under correct flags
- [x] Max 2 bullets per trap
- [x] 380ms delay before bullets
- [x] Visual telegraph (green pulsing circles)
- [x] One trap at a time
- [x] Cooldown prevents spam
- [x] CRABTRON unaffected
- [x] Other bosses unaffected
- [x] No crash if bullet array missing
