# HC-SPRITE-MINIBOSS-02 — PRELUDE SILHOUETTE PREVIEW

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Implemented — Visual-Only Teaser

---

## Overview

Mini-boss sprites are now shown as faint silhouettes during the boss WARNING prelude overlay at the start of each boss level. This is a visual-only teaser — no entity, no HP, no collision, no gameplay.

### Trigger

The preview renders when:
- Boss is active (`boss.active === true`)
- Boss at full HP (`boss.hp >= boss.maxHp`)
- No enemy bullets on screen (`enemyBullets.length === 0`)
- Kill switch enabled (`spriteLab.minibossPreludePreview !== false`)
- Corresponding mini-boss sprite loaded or fallback ready

### Visibility

- Alpha: 0.06–0.10 (very faint, pulsing)
- Tinted to boss color for visual cohesion
- Centered at mid-screen (38% vertical)
- Size: 42% of screen width, capped at 160px
- Behind WARNING text and boss name

---

## Mapping

| Boss Level | Boss Pattern | Boss Name | Mini-Boss Preview |
|---|---|---|---|
| 5 | `crossfire` | CRABTRON | `scout_hive_leader` |
| 10 | `zigzag` | SERPENTRIX | `suppressor_siege_core` |
| 15 | `rotate` | ORBITAL | `splitter_aberrant_node` |
| 19 | `divebomb` | TENIENTE | `splitter_aberrant_node` |
| 20 | `supreme` | EMPERADOR | `imperial_command_lancer` |

---

## Files Modified

### `www/draw.js` (+21 lines at line 6824)

Added `HC-SPRITE-MINIBOSS-02` block inside the boss WARNING overlay rendering:

```js
var _mbPreludeMap = {
    crossfire: 'scout_hive_leader',
    zigzag: 'suppressor_siege_core',
    rotate: 'splitter_aberrant_node',
    divebomb: 'splitter_aberrant_node',
    supreme: 'imperial_command_lancer'
};
var _mbUnitId = _mbPreludeMap[boss.pattern];
drawMiniBossVisual(ctx, _mbUnitId, _mbX, _mbY, _mbSize, _mbSize, {
    alpha: 1, tint: bossColor
});
```

### `www/game-config.js` (+3 lines at line 153)

Added kill switch:

```js
minibossPreludePreview: true  // false → disables mini-boss silhouette during boss warning overlay
```

---

## Kill Switch

```
GALAXY_CONFIG.spriteLab.minibossPreludePreview: true   // Master toggle
```

**Fallback:** When `false`, no silhouette renders. No other behavior changes.

**Guard chain:**
```
spriteLab.minibossPreludePreview === false? → skip
typeof drawMiniBossVisual !== 'function'?   → skip
_mbUnitId undefined (unknown pattern)?       → skip
drawMiniBossVisual internal guards: kill switch off? sprite not loaded? → skip or fallback
```

---

## Validation

- `node --check draw.js` — PASS
- `node --check game-config.js` — PASS
- `npm run validate` — PASS
- 0 missing assets
- 0 render errors (all draw paths guarded)

---

## Preserved Systems

- No entity creation
- No spawn logic changes
- No HP/score/balance changes
- No collision detection
- No attack patterns
- No movement/AI
- No encounter timing
- Boss WARNING overlay unchanged
- All boss rendering paths preserved
- All kill switches intact

---

## Explicit Confirmations

- [x] Preview-only — no new enemy types
- [x] No spawn logic changes
- [x] No HP/score/balance changes
- [x] No collisions
- [x] No attacks
- [x] No movement gameplay
- [x] No encounter timing changes
- [x] Kill switch with safe fallback
- [x] `npm run validate` passes
- [x] 0 missing assets confirmed
