# SPRITE LAB KILL SWITCH QUICK REFERENCE

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Reference — Documentation Only

---

## Overview

15 kill switches control all Sprite Lab visual integrations. All default to `true` (active).
Setting a switch to `false` restores the previous rendering tier with full fallback safety.

**Location:** `www/game-config.js` → `GALAXY_CONFIG.spriteLab`

---

## MASTER SWITCHES — Top Level

### `sprites.enabled` (not in spriteLab — global)
```
GALAXY_CONFIG.sprites.enabled = true
```
**Controls:** Entire SpriteSystem. `false` disables ALL sprite loading and drawing.
**Fallback:** Legacy pixel-art matrix rendering for everything.
**Use when:** Total sprite system failure. Nuclear option.
**Risk:** Reverts ALL visuals to legacy. Use only for debugging.

---

## PHASE A/B — PLAYER + FACTION ENEMIES

### 1. `playerS04Wedge` — Player Ship
```
Default:  true
Controls: S04 Wedge (128x128) player ship at all levels
Fallback: player_wedge (128x128 aliased to S04 sheet) → player_ship_3x3 (32x32 strip) → static player → legacy pixel art
When off: Player appears as simpler ship form, less visual detail
Risk:     Low — multi-tier fallback chain, player always visible
```
**Test:** Change at any time. Player ship changes immediately.

### 2. `factionScout` — Scout Enemies
```
Default:  true
Controls: Faction Scout sprite (128x128 sheet, 4 frames) for alien1/alien2/alien4/alien5/alien_mini
Fallback: fleet_scout (16x16) / fleet_interceptor (24x24) sprites
When off: Scout enemies render with simpler fleet sprites
Risk:     Low — 5 enemy types affected, always have fallback
```
**Test:** Levels 1-4 (Scout-dominant). Enemies switch from HC Art to fleet sprites.

### 3. `factionSuppressor` — Suppressor Enemies
```
Default:  true
Controls: Faction Suppressor sprite (128x128 sheet, 4 frames) for alien3
Fallback: fleet_suppressor (28x32) sprite
When off: alien3 renders with smaller fleet sprite
Risk:     Low — 1 enemy type affected
```
**Test:** Levels 6-9 (Suppressor introduction). alien3 changes visually.

### 4. `factionSplitter` — Splitter Enemies
```
Default:  true
Controls: Faction Splitter sprite (128x128 sheet, 4 frames) for alien6
Fallback: fleet_suppressor (28x32) sprite
When off: alien6 renders with fleet_suppressor (wrong faction color, but functional)
Risk:     Low — 1 enemy type affected
```
**Test:** Levels 11-14 (Splitter density). alien6 changes from magenta Splitter to red-orange fleet.

### 5. `factionImperial` — Imperial Enemies
```
Default:  true
Controls: Faction Imperial sprite (128x128 sheet, 4 frames) — NOT WIRED
Fallback: N/A (no imperial enemies exist)
When off: No effect (no imperial enemies in spawn pool)
Risk:     None — switch exists for future use, currently inert
```

---

## PHASE C — MINI-BOSS HIERARCHY

### 6. `miniBossHierarchy` — Master Mini-Boss Switch
```
Default:  true
Controls: All 4 mini-boss sprite rendering
Fallback: Geometric fallback (colored circle + rectangle per faction)
When off: All mini-bosses render as simple colored shapes
Risk:     Low — mini-bosses not yet spawned as entities, only prelude silhouettes affected
```
**Test:** Set `false`, check boss prelude at any boss level — silhouettes disappear.

### 7. `miniBossScout` — Scout Hive Leader
```
Default:  true
Controls: scout_hive_leader (frame 0, cyan, faction scout)
Fallback: Colored circle (cyan #5ef7ff)
When off: Scout mini-boss renders as placeholder shape
Risk:     Low
```

### 8. `miniBossSuppressor` — Suppressor Siege Core
```
Default:  true
Controls: suppressor_siege_core (frame 1, red-orange, faction suppressor)
Fallback: Colored circle (red-orange #ff5533)
When off: Suppressor mini-boss renders as placeholder shape
Risk:     Low
```

### 9. `miniBossSplitter` — Splitter Aberrant Node
```
Default:  true
Controls: splitter_aberrant_node (frame 2, magenta, faction splitter)
Fallback: Colored circle (magenta #dd66cc)
When off: Splitter mini-boss renders as placeholder shape
Risk:     Low
```

### 10. `miniBossImperial` — Imperial Command Lancer
```
Default:  true
Controls: imperial_command_lancer (frame 3, gold, faction imperial)
Fallback: Colored circle (gold #ffd866)
When off: Imperial mini-boss renders as placeholder shape
Risk:     Low
```

### 11. `minibossPreludePreview` — Boss Prelude Silhouettes
```
Default:  true
Controls: Faint mini-boss silhouettes during boss WARNING overlay (levels 5/10/15/19/20)
Fallback: No silhouette rendered (WARNING text only)
When off: Boss preludes show only text, no foreshadowing visual
Risk:     Zero — pure ambient decoration, no gameplay function
```
**Test:** Go to any boss level. With switch ON: see faint silhouette below WARNING text. With switch OFF: silhouette disappears.

---

## PHASE D — IMPERIAL FLAGSHIP

### 12. `imperialFlagship` — Imperial Flagship / EMPERADOR
```
Default:  true
Controls: Imperial Flagship 3-phase sprite (256x256) on EMPERADOR boss (level 20)
Fallback: Full legacy EMPERADOR rendering (EnergyMantle, CrownHalo, EmperorCore, PhaseOverload, geometric details)
When off: EMPERADOR renders in classic geometric style, identical to pre-sprite-lab
Risk:     Low — complete legacy fallback preserved
```
**Test:** Reach level 20 or use debug skip. With switch ON: Flagship phases change at HP thresholds. With switch OFF: classic EMPERADOR.

### 13. `imperialFlagshipPhaseDebug` — Flagship Phase Override
```
Default:  false
Controls: Manual phase override for Imperial Flagship (debug only)
Requires: Set window._flagshipPhaseDebugOverride = 'master'|'damaged'|'core_exposed'
Fallback: Auto-resolve from boss HP when debug disabled
When off: Phase auto-resolves from boss HP percentage
Risk:     None — debug only, disabled by default
```
**Test:** Set `true`, then `window._flagshipPhaseDebugOverride = 'core_exposed'`. Flagship shows exposed core regardless of HP. Set to `null` to restore auto.

---

## PHASE E — ORBITAL SIEGE COLOSSUS

### 14. `orbitalSiegeColossus` — Fortress Colossus
```
Default:  true
Controls: Orbital Siege Colossus sprite (320x320, 4 states) — NOT WIRED
Fallback: Ring donut + colored state markers
When off: No fortress rendering (not wired to any boss yet)
Risk:     None — switch exists for future use, currently inert
```

### 15. `orbitalSiegeStateDebug` — Fortress State Override
```
Default:  false
Controls: Manual state override for Colossus (debug only)
Requires: Set window._orbitalSiegeStateDebugOverride = 'master'|'damaged'|'core_exposed'|'weapon_open'
Fallback: Auto-resolve from boss HP when debug disabled
When off: State auto-resolves from boss HP percentage
Risk:     None — debug only, disabled by default
```

---

## QUICK ROLLBACK — RESTORE ALL LEGACY VISUALS

To revert ALL Sprite Lab visuals at once:

```js
// In browser console during gameplay:
GALAXY_CONFIG.spriteLab.playerS04Wedge       = false;
GALAXY_CONFIG.spriteLab.factionScout         = false;
GALAXY_CONFIG.spriteLab.factionSuppressor    = false;
GALAXY_CONFIG.spriteLab.factionSplitter      = false;
GALAXY_CONFIG.spriteLab.miniBossHierarchy    = false;
GALAXY_CONFIG.spriteLab.minibossPreludePreview = false;
GALAXY_CONFIG.spriteLab.imperialFlagship     = false;
```

Or the nuclear option:
```js
GALAXY_CONFIG.sprites.enabled = false;  // Disables entire SpriteSystem
```

---

## CHECKLIST — BEFORE CHANGING A FLAG

```
[ ] Understand which visual system is affected
[ ] Know the fallback behavior when disabled
[ ] Test on appropriate level (e.g., level 5 for CRABTRON, level 20 for EMPERADOR)
[ ] Confirm no console errors after change
[ ] Confirm bullets/bosses remain readable
[ ] If fixing a bug: document in ai/sprite-lab/
[ ] If disabling permanently: note in kill switch comment in game-config.js
```

## CHECKLIST — AFTER CHANGING A FLAG

```
[ ] Visual change is immediately visible
[ ] Fallback works correctly (no broken rendering)
[ ] No gameplay behavior changed (HP, attacks, movement, collisions)
[ ] npm run validate passes
[ ] Boss telegraphs still visible
[ ] Enemy readability maintained
[ ] No new console errors
```

---

## FACTION ↔ ENEMY TYPE MAPPING

| Faction | Enemy Types | Mini-Boss | Flagship/Fortress |
|---|---|---|---|
| Scout | alien1, alien2, alien4, alien5, alien_mini | scout_hive_leader | — |
| Suppressor | alien3 | suppressor_siege_core | — |
| Splitter | alien6 | splitter_aberrant_node | — |
| Imperial | — (no enemies yet) | imperial_command_lancer | `boss_imperial_flagship` (EMPERADOR) |
| Orbital Siege | — (no enemies yet) | — | `boss_orbital_siege_colossus` (future) |

---

## VISUAL INTEGRATION STATUS

```
LIVE (in encounters now):
  1-4    Faction sprites (Scout, Suppressor, Splitter)
  5      CRABTRON hero (level 5)
  11     Mini-boss prelude silhouettes (levels 5,10,15,19,20)
  12     Imperial Flagship / EMPERADOR (level 20)

FROZEN (registered, not wired):
  6-10   Mini-boss hierarchy (awaiting entity types)
  13     Flagship phase debug (disabled by default)
  14     Orbital Siege Colossus (awaiting boss slot)
  15     Colossus state debug (disabled by default)

INERT (no effect):
  5      factionImperial (no imperial enemy types exist)
```
