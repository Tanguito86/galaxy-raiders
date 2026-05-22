# HC-BD-08 — CRABTRON Signature Hook Trial

**Block**: HC-BD  
**Status**: Trial complete (CRABTRON only, flag-gated)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-07 (signature intents)

---

## Overview

First production integration of the Boss Director intent system with a real boss. Only CRABTRON is affected. The hook is fully flag-gated — zero impact when disabled.

---

## What Changed

### CRABTRON Signature Plan Updated
- `signaturePlan.intro` changed from `aimedBurst` → `pincerFire`
- All three slots (intro/main/rage) now use `pincerFire`
- This means every phase gets the pincer fire signature

### New Config Flag
`enableCrabtronSignatureHook: false` — added to:
- `www/game-config.js` (`GALAXY_CONFIG.bossDirector`)
- `www/hardcore-config.js` (defaults + getter)
- `www/boss-director.js` (IIFE defaults + `getBossDirectorConfig()`)

### New Function: `shouldApplyBossSignatureIntent()`
In `boss-director.js`. Validates:
1. `enableBossDirector === true`
2. `enableBossSignatureIntents === true`
3. Boss director is active
4. Intent is active and not consumed
5. Boss key matches expected (e.g., "crossfire")
6. Candidate matches expected (e.g., "pincerFire")
7. Boss-specific hook is enabled (e.g., `enableCrabtronSignatureHook`)
8. Not in transition
9. Not in recovery
10. Fairness rhythm score >= 0.35

Returns `{ apply, reason, intent }`.

### New Function: `tryCrabtronSignatureHook()`
In `www/update-boss.js`. Called at the top of the shooting logic (before the `switch(boss.pattern)` block), only when `boss.pattern === 'crossfire'`.

Fires the **CRABTRON Pincer Fire v0** pattern when intent is valid.

### Pincer Fire v0 Pattern
- **4 bullets total** (2 per claw)
- Left claw: 2 bullets at ~110° (down-right)
- Right claw: 2 bullets at ~70° (down-left)
- Speed: 3.0 (moderate, matchable by player)
- Size: 6×10 px (standard boss bullet)
- No homing, no tracking, no RNG
- Consumes intent with `consumeBossSignatureIntent('applied')`
- Applies cooldown: 2500ms (intro slot)
- Plays `sfxEnemyHit` + brief music duck

### Hook Wire Point
In `update-boss.js`, in the `boss.shootTimer > shootRate` block:
```js
if (boss.pattern === 'crossfire' && typeof tryCrabtronSignatureHook === 'function') {
  if (tryCrabtronSignatureHook(boss)) {
    return; // signature consumed this fire cycle
  }
}
```

When the hook fires, the rest of the fire cycle is skipped for that tick. The hook's cooldown (via consumed intent) prevents it from dominating the boss's attack pattern.

---

## Safety Guards

| Guard | Where | Effect |
|-------|-------|--------|
| Dash gate | `tryCrabtronSignatureHook` | No signature during dash |
| Bullet array check | `tryCrabtronSignatureHook` | No crash if `enemyBullets` missing |
| Pattern check | Wire point | Only fires for `crossfire` pattern |
| Intent must be active | `shouldApplyBossSignatureIntent` | No signature without director authorization |
| Boss-specific flag | `shouldApplyBossSignatureIntent` | `enableCrabtronSignatureHook` must be true |
| Fairness rhythm | `shouldApplyBossSignatureIntent` | Blocked if rhythm score < 0.35 |
| Transition/recovery | `shouldApplyBossSignatureIntent` | Blocked during safety windows |
| Cooldown | Intent system | 2500ms min between signatures |

---

## Flags Required

All of these must be `true` for CRABTRON signature to fire:

| Flag | Purpose |
|------|---------|
| `enableBossDirector` | Master switch |
| `enableBossSignatureIntents` | Allow intent creation |
| `enableCrabtronSignatureHook` | Allow CRABTRON hook |

If any flag is false, zero impact on gameplay.

---

## Bullet Safety Audit

| Metric | Value | Limit |
|--------|-------|-------|
| Bullets per signature | 4 | ≤ 6 |
| Speed | 3.0 | Moderate |
| Size | 6×10 | Standard |
| Damage type | Normal enemy bullet | Same as existing |
| Overlap with existing patterns | Possible but cooldown-gapped | Intent cooldown prevents same-frame |
| Readability | Open angles (~70°/110°), no convergence | Gaps visible |
| Unfairness risk | Very low — fixed angles, moderate speed | Dodgeable at any position |

---

## Known Limitations

1. **No dedicated telegraph** — signature fires immediately when intent is consumed. The 900ms intent lifetime + existing boss warning FX provide implicit telegraph.
2. **No phase differentiation** — same pincer fire in all 3 phases. Future HC-BD versions can add phase-specific variants.
3. **Hook consumes entire fire cycle** — when signature fires, CRABTRON doesn't fire its normal pattern that tick. This is intentional (prevents overlap) but means the boss fires slightly less frequently when signature is active.
4. **Static angles** — the 70°/110° angles are fixed. Not aimed at player. This makes it more readable but less threatening. Can be enhanced in later iterations.

---

## Rollback Steps

To disable the CRABTRON signature hook:
1. Set `enableCrabtronSignatureHook: false` in game-config.js
2. Or set `enableBossSignatureIntents: false`
3. Or set `enableBossDirector: false`
4. Gameplay returns to identical pre-HC-BD-08 state

---

## Freeze Criteria

System is freeze-ready when:
1. Hook fires only under correct flags ✓
2. Bullet count ≤ 6 ✓
3. No crash if helpers missing ✓
4. Dash blocks signature ✓
5. Cooldown prevents spam ✓
6. Other bosses unaffected ✓
7. Intent consumed correctly ✓

---

## Integration Status

- [x] Config flag (`enableCrabtronSignatureHook`)
- [x] `shouldApplyBossSignatureIntent` validator
- [x] `tryCrabtronSignatureHook` function
- [x] Pincer fire v0 pattern (4 bullets, moderate speed, fixed angles)
- [x] Wire point in update-boss.js fire cycle
- [x] Intent consumption + cooldown
- [x] Safety guards (dash, bullet array, pattern, flags)
- [x] Telemetry events (via intent consumption)
- [ ] Per-phase signature variants
- [ ] Dedicated pincer fire telegraph
- [ ] Extend pattern to other bosses
