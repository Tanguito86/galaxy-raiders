# SPRITE LAB — RUNTIME VISUAL INTEGRATION PHASE E

## Orbital Siege Colossus (Fortress) Runtime Registration

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Phase:** E — Orbital Siege Fortress Runtime Registration
**Status:** Complete

---

## Overview

Phase E integrates the Orbital Siege Colossus fortress-class asset package into the runtime sprite system with visual-only rendering and metadata-backed state support. No gameplay, hitbox, collision, AI, rank, balance, or encounter changes were made.

### Asset Package

- **Sheet:** `www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_sheet.png` (1280x320, 4x 320x320 frames)
- **Metadata:** `www/assets/sprites/metadata/orbital_siege_colossus.json`
- **Resolution:** 320x320 master — largest boss asset in Galaxy Raiders

### States

| State | Frame | HP Range | Description |
|---|---|---|---|
| `master` / `phase_1_full_armor` | 0 | 100%-66% | Intact orbital fortress, full ring geometry |
| `damaged` / `phase_2_damaged` | 1 | 66%-33% | Fractured ring segments, damaged armor |
| `core_exposed` / `phase_3_core_exposed` | 2 | 33%-0% | Shattered rings, fully exposed reactor |
| `weapon_open` / `phase_special_weapon_deployed` | 3 | any | Superweapon arrays deployed, energy channels active |

---

## Files Modified

### 1. `www/sprite-system.js` (lines 647-688)

- Registered `boss_orbital_siege_colossus` sprite:
  - 320x320 frame dimensions
  - 4-frame horizontal sheet
  - Source: `assets/sprites/bosses/orbital_siege/orbital_siege_colossus_sheet.png`
  - Fallback color: `#44ccff` (orbital blue)
  - Idle animation cycling frames 0-2 at 1.2fps
  - `weaponOpen` animation: static frame 3
- Added `_ORBITAL_SIEGE_COLOSSUS_META` with:
  - Dual state name lookup (short + full forms)
  - Phase labels array
  - Recommended gameplay size (240x240)
  - Pivot (160x160 center)
  - Scale hint (0.75)
- Exposed globals:
  - `window.getOrbitalSiegeColossusMeta()`
  - `window.getOrbitalSiegeColossusPhaseFrame(state)`

### 2. `www/game-config.js` (lines 156-158)

- Extended `spriteLab` with Phase E kill switches:
  - `orbitalSiegeColossus: true` — master kill switch
  - `orbitalSiegeStateDebug: false` — debug manual state override

### 3. `www/draw.js` (lines 4796-5001)

Added fortress visual rendering system:
- `_COLOSSUS_SPRITE_ID` — constant
- `_COLOSSUS_STATE_LABELS` — `['master', 'damaged', 'core_exposed', 'weapon_open']`
- `getColossusStateFrame(state)` — resolves state name to frame index
- `isColossusVisualEnabled()` — checks kill switch
- `isColossusSpriteReady()` — checks sprite load state
- `getColossusStateDebugOverride()` — returns debug override if enabled
- `resolveColossusVisualState(boss)` — HP-based state selection + debug override
- `drawOrbitalSiegeColossusVisual(ctx, boss, x, y, w, h, opts)` — main draw function
  - Accepts: state, x, y, w, h, alpha, tint, rotation, scale, flipX
  - Falls back to `drawColossusFallback()` if sprite not loaded
- `drawColossusFallback(ctx, x, y, w, h, state)` — state-colored geometric fallback
  - master: `#44ccff`, damaged: `#3399dd`, core_exposed: `#ff6622`, weapon_open: `#ffcc00`
  - Ring donut silhouette + state-specific overlays
  - weapon_open has 4 cardinal artillery markers
- `drawColossusDebugOverlay(ctx, boss, state, x, y, w, h)` — debug overlay
  - Shows state, frame index, faction, enabled/ready status

---

## Runtime Ownership

| Component | Owner | Notes |
|---|---|---|
| Sprite registration | `sprite-system.js` | IIFE, loads on page init |
| Metadata lookup | `sprite-system.js` | Hardcoded JS object |
| Kill switches | `game-config.js` | Under `GALAXY_CONFIG.spriteLab` |
| Visual draw path | `draw.js` | Inside main `draw()` function scope |
| State resolution | `draw.js` | `resolveColossusVisualState()` |
| Fallback rendering | `draw.js` | `drawColossusFallback()` |
| Debug overlay | `draw.js` | `drawColossusDebugOverlay()` |

---

## Scale Values

- Master resolution: 320x320
- Recommended gameplay size: 240x240
- `scaleHint`: 0.75
- Compute: `min(drawW / 320, drawH / 320) * 0.75`

---

## Kill Switches

```
GALAXY_CONFIG.spriteLab.orbitalSiegeColossus: true   // Master — false disables ALL fortress rendering
GALAXY_CONFIG.spriteLab.orbitalSiegeStateDebug: false // Debug — true enables manual state override
```

### Fallback Chain

```
isColossusVisualEnabled()?
  ├── false → return (no render)
  └── true → resolveColossusVisualState(boss) → getColossusStateFrame(state)
               ├── isColossusSpriteReady()?
               │    ├── true → drawSpriteFrame(frame, fallback: drawColossusFallback)
               │    └── false → drawColossusFallback (ring donut + state overlays)
               └── Debug overlay if debug flags active
```

---

## Preserved Systems (No Changes)

- Crabtron hero layered render path
- Imperial Flagship render path
- Mini-boss hierarchy render path
- Legacy boss rendering (crossfire/zigzag/rotate/divebomb/supreme)
- Boss hitboxes, timing, phases, attacks, AI, movement
- Boss HP bar and HUD
- Existing encounter flow
- Enemy rendering and faction systems
- Player rendering
- All gameplay, collision, spawn, rank, and balance systems

---

## Debug Usage

```js
// Enable debug state override
GALAXY_CONFIG.spriteLab.orbitalSiegeStateDebug = true;

// Set manual state
window._orbitalSiegeStateDebugOverride = 'master';       // Full armor
window._orbitalSiegeStateDebugOverride = 'damaged';      // Damaged
window._orbitalSiegeStateDebugOverride = 'core_exposed'; // Core exposed
window._orbitalSiegeStateDebugOverride = 'weapon_open';  // Superweapon deployed

// Restore auto-resolution
window._orbitalSiegeStateDebugOverride = null;
GALAXY_CONFIG.spriteLab.orbitalSiegeStateDebug = false;
```

---

## Validation Results

- `node --check www/sprite-system.js` — PASS
- `node --check www/game-config.js` — PASS
- `node --check www/draw.js` — PASS
- `npm run validate` — PASS

---

## Boss Hierarchy (Phase A-E)

| Tier | Asset | Resolution | Phase |
|---|---|---|---|
| Player | S04 Wedge | 128x128 | A |
| Faction enemies | Scout / Suppressor / Splitter / Imperial | 128x128 | A/B |
| Mini-boss | Mini-Boss Hierarchy (4 units) | 192x192 | C |
| Flagship | Imperial Flagship Command (3 phases) | 256x256 | D |
| Fortress | Orbital Siege Colossus (4 states) | 320x320 | E |

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
- [x] No active bosses replaced
- [x] Crabtron render path preserved
- [x] Flagship render path preserved
- [x] Mini-boss render path preserved
- [x] Legacy boss rendering preserved
- [x] weapon_open NOT tied to gameplay logic
