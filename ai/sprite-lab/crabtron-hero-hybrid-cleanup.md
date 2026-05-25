# Crabtron Hero Hybrid Cleanup Pass

**Date:** 2026-05-24
**Phase:** HC-VS-03D — CRABTRON Hero Visual Cleanup
**Prior audit:** Commit `9eb3fed` — Crabtron Hero Runtime Audit

---

## Files Modified

| File | Lines Changed | Changes |
|------|--------------|---------|
| `www/draw.js` | 4284-4293, 4332-4335 | 2 edit blocks, ~6 net lines |

**No other files touched.** No gameplay, hitbox, AI, rank, or balance files modified.

---

## Changes Applied

### 1. Gate `drawCrabtronCore` behind `!_crabtronHeroReady`

**Location:** `draw.js:4332-4335`
**Before:**
```js
if (boss.pattern === 'crossfire') {
    // HC-VS-03D2: legacy core replaced by hero weakpoint_core layer;
    // dynamic pulse rings preserved for gameplay readability
    drawCrabtronCore(ctx, boss, bossColor, globalTime);
}
```

**After:**
```js
if (boss.pattern === 'crossfire') {
    // HC-VS-03D2: legacy core gated — hero weakpoint_core layer provides its own animated pulse.
    // Legacy pixel-art core rings are only drawn as a fallback when hero sprite is unavailable.
    if (!_crabtronHeroReady) drawCrabtronCore(ctx, boss, bossColor, globalTime);
}
```

**Effect:** When the Crabtron Hero sprite is loaded (`_crabtronHeroReady === true`), the legacy pixel-art core rings, mechanical slot lines, and center glow point no longer draw on top of the hero's `weakpoint_core` layer. This eliminates the visual inconsistency where two different art styles (retro-HD hero core + pixel-art legacy ring system) were overlaid at the boss's most important recognition point.

**Fallback preserved:** When `_crabtronHeroReady === false` (hero sheet not loaded or failed), the legacy core rings draw normally. Full legacy rendering path intact.

### 2. Metadata-Driven Hero Scale

**Location:** `draw.js:4288-4290`
**Before:**
```js
var _heroScale = 0.45;
```

**After:**
```js
var _heroMetaScale = (typeof getCrabtronHeroMeta === 'function' && getCrabtronHeroMeta().scaleHint) ? getCrabtronHeroMeta().scaleHint : 0.45;
var _heroScale = _heroMetaScale;
```

**Effect:** The hero render scale now reads from `_CRABTRON_HERO_META.scaleHint` (currently `0.55` in `sprite-system.js:385`) instead of a hardcoded `0.45`. The scale still goes through the existing clamp `[0.38, 0.55]` after applying `_smallScreenBoost`.

**Fallback preserved:** If `getCrabtronHeroMeta` is unavailable or `scaleHint` is falsy, falls back to `0.45`. The `typeof` guard protects against crashes when sprite-system.js hasn't loaded yet.

**Scale behavior:**
- `scaleHint: 0.55` → hero renders at `192 × 0.55 = 105.6px` visual size
- Legacy comparison: `96 × 0.72 = 69.1px` visual size
- Hero is ~53% larger than legacy at gameplay scale — improved readability
- Small screen boost applies equally: `0.55 × 1.12 = 0.616` → clamped to `0.55`

### 3. Flash Effect (Already Gated — No Change Needed)

The flash effect at `draw.js:4346` was already gated behind `!_crabtronHeroReady` from a prior commit:
```js
// HC-VS-03D4: legacy sprite flash gated behind hero; white crosshair always visible
if (!_crabtronHeroReady) {
    ctx.globalAlpha = flicker;
    drawBossSpriteOrLegacy(ctx, boss, bossColor, 5);
    ctx.globalAlpha = flicker * 0.24;
    drawBossSpriteOrLegacy(ctx, boss, '#ffffff', 5, { tint: '#ffffff' });
}
```

The white crosshair (lines 4352-4357) intentionally draws regardless of hero mode — it's a minimal gameplay indicator, not a legacy sprite artifact.

---

## Complete Hero/ Legacy Gate Summary

| Rendering Element | Hero Ready | Legacy Fallback | Gate |
|-------------------|------------|-----------------|------|
| Legacy glow/aura | ❌ | ✅ | `_crabtronHeroReady ? 0 : ...` |
| Legacy dark aura | ❌ | ✅ | `_crabtronHeroReady ? 0 : 0.24` |
| Articulated arms | ❌ | ✅ | `!_crabtronHeroReady` |
| Armor plates | ❌ | ✅ | `!_crabtronHeroReady` |
| Shoot telegraph | ✅ Always | ✅ Always | None |
| Muzzle flash | ✅ Always | ✅ Always | None |
| Dash telegraph | ✅ Always | ✅ Always | None |
| **Hero layers** | ✅ | ❌ | Always drawn (5 states) |
| Legacy body sprite | ❌ | ✅ | `!_crabtronHeroReady` |
| Core pulse brightness | ❌ | ✅ | `!_crabtronHeroReady` |
| Ambient glow | ❌ | ✅ | `!_crabtronHeroReady` |
| **Legacy core rings** | ❌ **NOW** | ✅ | `!_crabtronHeroReady` — **this commit** |
| Flash hit effect | ❌ | ✅ | `!_crabtronHeroReady` (prior) |
| White crosshair | ✅ Always | ✅ Always | None |

---

## Validation Results

| Test | Result |
|------|--------|
| `node --check www/draw.js` | ✅ Pass |
| `node --check www/sprite-system.js` | ✅ Pass |
| `node scripts/validate-galaxy.js` | ✅ `Validacion JS OK` |
| No gameplay files modified | ✅ Confirmed |
| No hitbox/collision changes | ✅ Confirmed |
| No boss AI changes | ✅ Confirmed |
| No rank/balance changes | ✅ Confirmed |
| Legacy assets preserved | ✅ Confirmed |
| Fallback behavior intact | ✅ Confirmed |

---

## What Was NOT Changed

- `boss.w = 90, boss.h = 45` — hitbox dimensions
- `boss.x, boss.y` — entity positioning
- `boss.pattern = 'crossfire'` — identity key
- `initBoss()` — boss creation
- `getBossPhase()` / `updateBossPhase()` — phase logic
- All boss pattern functions in `boss-patterns.js`
- All signature hook functions in `update-boss.js`
- `boss-director.js` — director profiles
- `boss-ai-movement.js` — AI movement
- `stage-plans.js` — stage definitions
- `entities.js` — death explosion, entity management
- `game-config.js` — scoring, ranking, HUD
- `hardcore-config.js` — hardcore toggles
- Legacy sprite registration in `sprite-system.js`
- Legacy pixel data in `state.js`
- Legacy `boss_crabtron.png` asset file

---

*Generated by Crabtron hero hybrid cleanup pass — visual-only changes, no gameplay impact.*
