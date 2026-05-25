# SPRITE LAB — RUNTIME VISUAL INTEGRATION PHASE D

## Imperial Flagship Runtime Registration

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Phase:** D — Imperial Flagship Runtime Registration
**Status:** Complete

---

## Overview

Phase D integrates the Imperial Flagship Command asset package into the runtime sprite system with visual-only rendering and metadata-backed phase support. No gameplay, hitbox, collision, AI, rank, balance, or encounter changes were made.

### Asset Package

- **Sheet:** `www/assets/sprites/bosses/imperial_flagship/imperial_flagship_command_sheet.png` (768x256, 3x 256x256 frames)
- **Metadata:** `www/assets/sprites/metadata/imperial_flagship_command.json`

### Phases

| Phase | Frame | HP Range | Description |
|---|---|---|---|
| `master` / `phase_1_full_armor` | 0 | 100%-66% | Full Imperial armor with commanding crest authority |
| `damaged` / `phase_2_damaged` | 1 | 66%-33% | Broken panels, sparking vents, partial core exposure |
| `core_exposed` / `phase_3_core_exposed` | 2 | 33%-0% | Shattered plates, fully exposed volatile core |

### Phase Resolution

```
resolveFlagshipVisualPhase(boss):
  ├── debug override active? → use manual phase
  ├── HP% > 66% → master
  ├── HP% > 33% → damaged
  └── HP% ≤ 33% → core_exposed
```

Phase resolution is visual-only. It reads HP for display purposes but does NOT modify HP, timing, or behavior.

---

## Files Modified

### 1. `www/sprite-system.js` (lines 607-644)

- Registered `boss_imperial_flagship` sprite:
  - 256x256 frame dimensions
  - 3-frame horizontal sheet
  - Source: `assets/sprites/bosses/imperial_flagship/imperial_flagship_command_sheet.png`
  - Fallback color: `#d6b85a` (Imperial gold)
  - Idle animation cycling all 3 frames at 1.5fps
- Added `_IMPERIAL_FLAGSHIP_META` metadata object with:
  - Dual phase name lookup (`master`/`phase_1_full_armor` → 0, etc.)
  - Phase labels array
  - Recommended gameplay size (192x192)
  - Pivot configuration (128x128 center)
  - Scale hint (0.75)
- Exposed globals:
  - `window.getImperialFlagshipMeta()` — returns full metadata
  - `window.getImperialFlagshipPhaseFrame(phase)` — returns frame index or -1

### 2. `www/game-config.js` (lines 153-155)

- Extended `spriteLab` config with Phase D kill switches:
  - `imperialFlagship: true` — master kill switch
  - `imperialFlagshipPhaseDebug: false` — debug-only manual phase override

### 3. `www/draw.js` (lines 4643-4765)

Added flagship visual rendering system:
- `_FLAGSHIP_SPRITE_ID` — constant `'boss_imperial_flagship'`
- `_FLAGSHIP_PHASE_LABELS` — `['master', 'damaged', 'core_exposed']`
- `getFlagshipPhaseFrame(phase)` — resolves phase name to frame index
- `isFlagshipVisualEnabled()` — checks `GALAXY_CONFIG.spriteLab.imperialFlagship`
- `isFlagshipSpriteReady()` — checks sprite load state
- `getFlagshipPhaseDebugOverride()` — returns manual debug phase if enabled
- `resolveFlagshipVisualPhase(boss)` — HP-based phase selection with debug override
- `drawImperialFlagshipVisual(ctx, boss, x, y, w, h, opts)` — main draw function
  - Accepts optional: phase, x, y, w, h, alpha, tint, rotation, scale, flipX
  - Falls back to `drawFlagshipFallback()` if sprite not loaded
  - Returns `true` on sprite success, `false` on fallback
- `drawFlagshipFallback(ctx, x, y, w, h, phase)` — phase-colored geometric fallback
  - master: `#ffe066`, damaged: `#e6a817`, core_exposed: `#ff5533`
  - Core exposed has an additional red core circle
- `drawFlagshipDebugOverlay(ctx, boss, phase, x, y, w, h)` — debug overlay
  - Shows phase, frame index, faction, enabled/ready status
  - Activated by `debug.showBossPattern` or `debug.showHardcoreInfo`

---

## Runtime Ownership

| Component | Owner | Notes |
|---|---|---|
| Sprite registration | `sprite-system.js` | IIFE, loads on page init |
| Metadata lookup | `sprite-system.js` | Hardcoded JS object (JSON exists for docs) |
| Kill switches | `game-config.js` | Under `GALAXY_CONFIG.spriteLab` |
| Visual draw path | `draw.js` | Inside main `draw()` function scope |
| Phase resolution | `draw.js` | `resolveFlagshipVisualPhase()` within draw scope |
| Fallback rendering | `draw.js` | `drawFlagshipFallback()` within draw scope |
| Debug overlay | `draw.js` | `drawFlagshipDebugOverlay()` within draw scope |
| Debug phase override | `window._flagshipPhaseDebugOverride` | Set from console for testing |

---

## Scale Values

- Master resolution: 256x256
- Recommended gameplay size: 192x192
- `scaleHint`: 0.75 (metadata-driven auto-scaling)
- Compute: `min(drawW / 256, drawH / 256) * 0.75`

---

## Kill Switches

```
GALAXY_CONFIG.spriteLab.imperialFlagship: true          // Master — false disables ALL flagship rendering
GALAXY_CONFIG.spriteLab.imperialFlagshipPhaseDebug: false // Debug — true enables manual phase override
```

### Fallback Chain

```
isFlagshipVisualEnabled()?
  ├── false → return (no render, no error)
  └── true → resolveFlagshipVisualPhase(boss) → getFlagshipPhaseFrame(phase)
               ├── isFlagshipSpriteReady()?
               │    ├── true → drawSpriteFrame(frame, fallback: drawFlagshipFallback)
               │    └── false → drawFlagshipFallback(phase-colored rectangle + circle)
               └── Debug overlay if debug flags active
```

Fallback colors per phase:
- master: `#ffe066` (bright gold)
- damaged: `#e6a817` (dark amber)
- core_exposed: `#ff5533` (red-orange) + inner red core circle

---

## Preserved Systems (No Changes)

- Crabtron hero layered render path (`drawCrabtronHeroLayers`)
- Mini-boss hierarchy render path (`drawMiniBossVisual`)
- Legacy boss rendering (crossfire/zigzag/rotate/divebomb/supreme)
- Emperador boss rendering (NOT replaced)
- Boss hitboxes
- Boss timing and phase transitions
- Boss attack patterns (including Emperador)
- Boss AI and movement
- Boss HP bar and HUD
- Existing encounter flow
- Enemy rendering and faction systems
- Player rendering
- All gameplay, collision, spawn, rank, and balance systems

---

## Debug Usage

Temporary override for visual testing (console only):

```js
// Enable debug phase override
GALAXY_CONFIG.spriteLab.imperialFlagshipPhaseDebug = true;

// Set manual phase
window._flagshipPhaseDebugOverride = 'master';       // Full armor
window._flagshipPhaseDebugOverride = 'damaged';      // Damaged
window._flagshipPhaseDebugOverride = 'core_exposed'; // Core exposed

// Restore auto-resolution
window._flagshipPhaseDebugOverride = null;
GALAXY_CONFIG.spriteLab.imperialFlagshipPhaseDebug = false;
```

---

## Validation Results

- `node --check www/sprite-system.js` — PASS
- `node --check www/game-config.js` — PASS
- `node --check www/draw.js` — PASS
- `npm run validate` — PASS

---

## Future Integration Notes

- `drawImperialFlagshipVisual()` is ready to be called when the flagship boss entity is introduced (future gameplay phase)
- Emperador is NOT replaced — flagship is a separate boss slot
- Flagship should be integrated as its own boss pattern type (e.g., `flagship`) when gameplay integration occurs
- Orbital Siege Colossus (fortress) is reserved for future Phase E

---

## Explicit Confirmations

- [x] No new gameplay encounters created
- [x] No boss phase changes (gameplay)
- [x] No boss attack changes
- [x] No HP changes
- [x] No collision changes
- [x] No movement changes
- [x] No rank changes
- [x] No balance changes
- [x] Emperador NOT replaced
- [x] Orbital Siege NOT integrated
- [x] Crabtron render path preserved
- [x] Mini-boss render path preserved
- [x] Legacy boss rendering preserved
- [x] Boss hitboxes preserved
- [x] Boss timing preserved
- [x] Existing encounter flow preserved
