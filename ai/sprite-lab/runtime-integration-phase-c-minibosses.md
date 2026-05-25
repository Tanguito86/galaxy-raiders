# SPRITE LAB — RUNTIME VISUAL INTEGRATION PHASE C

## Mini-Boss Hierarchy Runtime Registration

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Phase:** C — Mini-Boss Hierarchy Runtime Registration
**Status:** Complete

---

## Overview

Phase C integrates the mini-boss hierarchy asset package into the runtime sprite system with visual-only rendering support. No gameplay, hitbox, collision, AI, rank, balance, or spawn system changes were made.

### Asset Package

- **Sheet:** `www/assets/sprites/bosses/miniboss_hierarchy_sheet.png` (768x192, 4x 192x192 frames)
- **Metadata:** `www/assets/sprites/metadata/miniboss_hierarchy.json`

### Mini-Bosses Registered

| Unit ID | Frame | Faction | Color | Fallback Sprite |
|---|---|---|---|---|
| `scout_hive_leader` | 0 | scout_alien | #5ef7ff | boss_crabtron |
| `suppressor_siege_core` | 1 | suppressor_alien | #ff5533 | boss_serpentrix |
| `splitter_aberrant_node` | 2 | splitter_alien | #dd66cc | boss_orbital |
| `imperial_command_lancer` | 3 | imperial_alien | #ffd866 | boss_emperador |

---

## Files Modified

### 1. `www/sprite-system.js` (lines 564-608)

- Registered `boss_miniboss_hierarchy` sprite:
  - 192x192 frame dimensions
  - 4-frame horizontal sheet
  - Source: `assets/sprites/bosses/miniboss_hierarchy_sheet.png`
  - Fallback color: `#887766`
  - Default idle animation cycling all 4 frames at 4fps
- Added `_MINIBOSS_HIERARCHY_META` metadata object with:
  - Unit-to-frame mapping (`unitMap`)
  - Faction assignment map (`factionMap`)
  - Recommended gameplay dimensions
  - Pivot configuration
- Exposed globals:
  - `window.getMiniBossHierarchyMeta()` — returns full metadata
  - `window.getMiniBossFrame(unitId)` — returns frame index or -1

### 2. `www/game-config.js` (lines 137-155)

- Extended `spriteLab` config section with Phase C kill switches:
  - `miniBossHierarchy: true` — master kill switch for all mini-boss rendering
  - `miniBossScout: true` — per-boss toggle for scout_hive_leader
  - `miniBossSuppressor: true` — per-boss toggle for suppressor_siege_core
  - `miniBossSplitter: true` — per-boss toggle for splitter_aberrant_node
  - `miniBossImperial: true` — per-boss toggle for imperial_command_lancer

### 3. `www/draw.js` (lines 4514-4617)

- Added `_MINIBOSS_SPRITE_ID` constant
- Added `_MINIBOSS_VISUAL_MAP` — unit ID to frame/color/faction/fallback mapping
- Added `getMiniBossVisualConfig(unitId)` — lookup helper
- Added `isMiniBossVisualEnabled(unitId)` — checks spriteLab kill switches
- Added `isMiniBossSpriteReady()` — sprite readiness check
- Added `drawMiniBossVisual(ctx, unitId, x, y, w, h, opts)` — main draw function
  - Accepts optional: alpha, tint, rotation, scale, flipX, x, y overrides
  - Falls back to `drawMiniBossFallback()` if sprite not loaded
  - Returns `true` on sprite success, `false` on fallback
- Added `drawMiniBossFallback(ctx, unitId, x, y, w, h, visual)` — fallback renderer
  - Draws faction-colored circle + rectangle placeholder
- Added `drawMiniBossDebugOverlay(ctx, unitId, x, y, w, h)` — debug overlay
  - Shows unit ID and faction info when debug flags are active

---

## Runtime Ownership

| Component | Owner | Notes |
|---|---|---|
| Sprite registration | `sprite-system.js` | IIFE, loads on page init |
| Metadata lookup | `sprite-system.js` | Hardcoded JS object (JSON exists for docs) |
| Kill switches | `game-config.js` | Under `GALAXY_CONFIG.spriteLab` |
| Visual draw path | `draw.js` | Inside main `draw()` function scope |
| Fallback rendering | `draw.js` | `drawMiniBossFallback()` within draw scope |
| Debug overlay | `draw.js` | `drawMiniBossDebugOverlay()` within draw scope |

---

## Visual Mapping

```
scout_hive_leader        → frame 0 → faction_scout visual style (cyan)
suppressor_siege_core    → frame 1 → faction_suppressor visual style (red-orange)
splitter_aberrant_node   → frame 2 → faction_splitter visual style (magenta)
imperial_command_lancer  → frame 3 → faction_imperial visual style (gold)
```

Each mini-boss preserves its parent faction's visual identity at boss scale (192x192 master, 128x128 recommended gameplay).

---

## Kill Switches

All under `GALAXY_CONFIG.spriteLab`:

```
miniBossHierarchy: true    // Master — false disables ALL mini-boss sprite rendering
miniBossScout: true        // Per-unit
miniBossSuppressor: true
miniBossSplitter: true
miniBossImperial: true
```

### Fallback Chain

1. Check `miniBossHierarchy` master switch
2. Check per-boss unit switch
3. Check `SpriteSystem.isSpriteReady('boss_miniboss_hierarchy')`
4. If any check fails: call `drawMiniBossFallback()` (faction-colored geometric placeholder)
5. If boss sprite is loaded: draw the appropriate frame via `drawSpriteFrame()`

---

## Fallback Chains

```
isMiniBossVisualEnabled(unitId)?
  ├── false → return (no render, no error)
  └── true → isMiniBossSpriteReady()?
               ├── true → drawSpriteFrame(frame=visual.frame, fallback=drawMiniBossFallback)
               └── false → drawMiniBossFallback (colored circle + rectangle)
```

Fallback colors per unit:
- scout_hive_leader: `#5ef7ff` (cyan)
- suppressor_siege_core: `#ff5533` (red-orange)
- splitter_aberrant_node: `#dd66cc` (magenta)
- imperial_command_lancer: `#ffd866` (gold)

---

## Preserved Systems (No Changes)

- Legacy boss rendering (crossfire/zigzag/rotate/divebomb/supreme)
- Crabtron hero layered render path (`drawCrabtronHeroLayers`)
- Boss hitboxes
- Boss timing and phase transitions
- Boss attack patterns
- Boss AI and movement
- Boss HP bar and HUD
- Existing encounter flow
- Enemy rendering and faction systems
- Player rendering
- All gameplay, collision, spawn, rank, and balance systems

---

## Validation Results

- `node --check www/sprite-system.js` — PASS
- `node --check www/game-config.js` — PASS
- `node --check www/draw.js` — PASS
- `npm run validate` — pending (full workspace check)

---

## Future Integration Notes

- `drawMiniBossVisual()` is ready to be called when mini-boss entities are spawned (future phase)
- No mini-boss game objects exist yet — the draw function is standalone and safe to call
- Mini-boss entities should be created in a separate gameplay phase (not Phase C)
- Flagship and Fortress integration is reserved for future phases

---

## Explicit Confirmations

- [x] No new gameplay encounters created
- [x] No boss phase changes
- [x] No boss attack changes
- [x] No HP changes
- [x] No collision changes
- [x] No movement changes
- [x] No rank changes
- [x] No balance changes
- [x] No flagship/fortress integration
- [x] No new spawn systems
- [x] Legacy boss rendering preserved
- [x] Crabtron render path preserved
- [x] Boss hitboxes preserved
- [x] Boss timing preserved
- [x] Existing encounter flow preserved
