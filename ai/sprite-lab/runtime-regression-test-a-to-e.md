# Sprite Lab — Runtime Visual Regression Test A–E
**Date:** 2026-05-25  
**Method:** Chrome MCP + JavaScript runtime inspection  
**Server:** http://localhost:8731/www/index.html  
**Canvas:** 360×640 (correct internal resolution)  
**Total sprites in registry:** 34  

---

## EXECUTIVE SUMMARY

**RESULT: PASS WITH ONE SAFE FIX APPLIED**

- 34/34 sprites loaded — zero 404s, zero missing, zero runtime errors
- All Phase A–E sprite sheets match dimension spec
- All frame lookups return correct values; bad-state lookups return `-1` (null-safe)
- All kill switches enabled; fallback chains intact
- alien6 → Splitter magenta mapping confirmed (Phase B fix verified)
- Crabtron hero scale 0.55 confirmed via scaleHint
- One metadata documentation bug found and fixed (S04 Wedge `sheetCols`/`sheetRows`)

---

## PHASE 1 — SERVER + CHROME MCP

| Check | Result |
|---|---|
| Server running on port 8731 | ✓ PASS |
| Game loads at /www/index.html | ✓ PASS |
| Canvas element present (`#game`) | ✓ PASS (360×640) |
| `window.SpriteSystem` registered | ✓ PASS |
| `window.GALAXY_CONFIG` available | ✓ PASS |
| `sprites.enabled` | ✓ true |
| `sprites.fallbackToLegacy` | ✓ true |
| `sprites.debugMissingSprites` | ✓ true |
| Zero 404s on sprite assets | ✓ PASS |
| Zero JS runtime exceptions | ✓ PASS |
| Zero console errors at load | ✓ PASS |

---

## PHASE 2 — PLAYER (S04 WEDGE) VALIDATION

### Sprite Registration

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `player_s04_wedge` | `player_s04_wedge` | ✓ |
| Source | `player/player_s04_wedge_sheet_2x4.png` | same | ✓ |
| Loaded | true | true | ✓ |
| Image size | 512×256 | 512×256 | ✓ |
| Frame W/H | 128×128 | 128×128 | ✓ |
| Computed columns | 4 | 4 | ✓ |
| Computed rows | 2 | 2 | ✓ |
| Total frames | 8 | 8 | ✓ |

### Frame Map (verified via `getS04WedgeFrame`)

| State | Expected Frame | Actual | Status |
|---|---|---|---|
| `idle` | 0 | 0 | ✓ |
| `bank_left` | 2 | 2 | ✓ |
| `bank_right` | 3 | 3 | ✓ |
| `boost` | 4 | 4 | ✓ |
| `damage` | 5 | 5 | ✓ |
| `nonexistent` | 0 (fallback) | 0 | ✓ |

### Anchor / Centering

- Pivot: no explicit `pivot` field in `_S04_WEDGE_META` → defaults to `frameW/2, frameH/2 = 64, 64`
- `anchorX = 64/128 = 0.5`, `anchorY = 64/128 = 0.5` → **center anchor — no drift** ✓
- Render scale: `0.45` (128×128 × 0.45 = ~58px visual, fits gameplay hitbox) ✓

### Kill Switch / Fallback Chain

- `spriteLab.playerS04Wedge = true` ✓
- Draw chain: **S04 Wedge** → `player_wedge` → `player_ship_3x3` → `player` (all 4 fallbacks intact) ✓

### Safe Fix Applied

**FIX-01 — S04 Wedge metadata `sheetCols`/`sheetRows` correction (documentation only)**

| | Before | After |
|---|---|---|
| `_S04_WEDGE_META.sheetCols` | `2` | `4` |
| `_S04_WEDGE_META.sheetRows` | `4` | `2` |
| Comment in sprite-system.js | "2 cols x 4 rows" | "4 cols x 2 rows" |
| Comment in sprite-system.js (inline) | "2x4 grid" | "4x2 grid" |
| Comment in draw.js:3942 | "2x4 grid" | "4x2 grid" |

**Rendering unaffected.** `drawSpriteFrame` calculates columns dynamically from `image.width / frameWidth` (512/128 = 4), ignoring `sheetCols`. Frame assignments in `frameMap` (0–7) are correct for the actual 4-col layout.

---

## PHASE 3 — FACTION VALIDATION

### Scout Faction (Phase A)

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `faction_scout` | `faction_scout` | ✓ |
| Image size | 512×128 | 512×128 | ✓ |
| Frame W/H | 128×128 | 128×128 | ✓ |
| Frames | 4 | 4 | ✓ |
| Kill switch | true | true | ✓ |

**Enemy mappings:** alien1→frame 0 (mk1_master), alien2→frame 2 (sniper), alien4→frame 1 (elite), alien5→frame 3 (swarm), alien_mini→frame 2 ✓  
**Hitbox bounds:** `{x:16, y:16, width:96, height:96}` registered for faction_scout ✓

### Suppressor Faction (Phase B)

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `faction_suppressor` | `faction_suppressor` | ✓ |
| Image size | 512×128 | 512×128 | ✓ |
| Frames | 4 | 4 | ✓ |
| Kill switch | true | true | ✓ |

**Enemy mappings:** alien3→frame 0 (mk1_master) ✓  
**Fallback color:** `#cc4422` (orange-red) ✓

### Splitter Faction (Phase B — alien6 Fix Verified)

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `faction_splitter` | `faction_splitter` | ✓ |
| Image size | 512×128 | 512×128 | ✓ |
| Frames | 4 | 4 | ✓ |
| Kill switch | true | true | ✓ |

**alien6 → Splitter fix CONFIRMED:**
- `_SPRITE_LAB_SPLITTER_MAP`: `alien6 → { sprite: 'faction_splitter', frame: 0 }` ✓
- Legacy `HCART_ENEMY_VISUALS.alien6` still maps to `fleet_suppressor` as lower-priority fallback — correct, faction override takes priority ✓
- alien6 threat color: `'#c8f'` (magenta/purple) — consistent with Splitter palette ✓
- Priority chain: Scout → Suppressor → **Splitter** → Imperial → HCART legacy ✓

### Imperial Faction (Phase B — registered, no spawn types yet)

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `faction_imperial` | `faction_imperial` | ✓ |
| Image size | 512×128 | 512×128 | ✓ |
| Frames | 4 | 4 | ✓ |
| Kill switch | true | true | ✓ |
| `_SPRITE_LAB_IMPERIAL_MAP` | `{}` (empty, no spawns yet) | `{}` | ✓ (expected) |

**No active enemy rendering path** — sprite registered, kill switch enabled, map intentionally empty pending future Imperial spawn pass. Documented behavior, not a bug.

---

## PHASE 4 — MINI-BOSS HIERARCHY VALIDATION

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `boss_miniboss_hierarchy` | `boss_miniboss_hierarchy` | ✓ |
| Image size | 768×192 | 768×192 | ✓ |
| Frame W/H | 192×192 | 192×192 | ✓ |
| Columns / Rows | 4 / 1 | 4 / 1 | ✓ |
| Total frames | 4 | 4 | ✓ |

### Frame Lookups (`getMiniBossFrame`)

| Unit | Expected | Actual | Status |
|---|---|---|---|
| `scout_hive_leader` | 0 | 0 | ✓ |
| `suppressor_siege_core` | 1 | 1 | ✓ |
| `splitter_aberrant_node` | 2 | 2 | ✓ |
| `imperial_command_lancer` | 3 | 3 | ✓ |
| `nonexistent` | -1 | -1 | ✓ null-safe |

### Kill Switches

| Switch | Value |
|---|---|
| `spriteLab.miniBossHierarchy` | true ✓ |
| `spriteLab.miniBossScout` | true ✓ |
| `spriteLab.miniBossSuppressor` | true ✓ |
| `spriteLab.miniBossSplitter` | true ✓ |
| `spriteLab.miniBossImperial` | true ✓ |

### Fallback Map

| Unit | Fallback Key |
|---|---|
| `scout_hive_leader` | `boss_crabtron` |
| `suppressor_siege_core` | `boss_serpentrix` |
| `splitter_aberrant_node` | `boss_orbital` |
| `imperial_command_lancer` | `boss_emperador` |

All fallback sprites registered and loaded ✓  
`getMiniBossHierarchyMeta()` function available globally ✓  
`getMiniBossFrame()` function available globally ✓

---

## PHASE 5 — IMPERIAL FLAGSHIP VALIDATION

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `boss_imperial_flagship` | `boss_imperial_flagship` | ✓ |
| Image size | 768×256 | 768×256 | ✓ |
| Frame W/H | 256×256 | 256×256 | ✓ |
| Columns / Rows | 3 / 1 | 3 / 1 | ✓ |
| Total frames | 3 | 3 | ✓ |
| Kill switch | true | true | ✓ |

### Phase Frame Lookups (`getImperialFlagshipPhaseFrame`)

| Phase | Expected | Actual | Status |
|---|---|---|---|
| `master` | 0 | 0 | ✓ |
| `phase_1_full_armor` | 0 | 0 | ✓ (alias) |
| `damaged` | 1 | 1 | ✓ |
| `phase_2_damaged` | 1 | 1 | ✓ (alias) |
| `core_exposed` | 2 | 2 | ✓ |
| `phase_3_core_exposed` | 2 | 2 | ✓ (alias) |
| `bad_phase` | -1 | -1 | ✓ null-safe |

**Debug override:** `_flagshipPhaseDebugOverride = undefined` — inactive (correct idle state, available via console) ✓  
**Phase switching:** All 3 phases + all alias keys resolve correctly ✓  
**`getImperialFlagshipMeta()`** available globally ✓  
**`getImperialFlagshipPhaseFrame()`** available globally ✓  

Individual phase assets also exist on disk:
- `imperial_flagship_command_master.png` ✓
- `imperial_flagship_command_damaged.png` ✓
- `imperial_flagship_command_core_exposed.png` ✓
- `imperial_flagship_command_sheet.png` ✓ (768×256, loaded)

---

## PHASE 6 — ORBITAL SIEGE COLOSSUS VALIDATION

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `boss_orbital_siege_colossus` | `boss_orbital_siege_colossus` | ✓ |
| Image size | 1280×320 | 1280×320 | ✓ |
| Frame W/H | 320×320 | 320×320 | ✓ |
| Columns / Rows | 4 / 1 | 4 / 1 | ✓ |
| Total frames | 4 | 4 | ✓ |
| Kill switch | true | true | ✓ |

### Phase Frame Lookups (`getOrbitalSiegeColossusPhaseFrame`)

| Phase | Expected | Actual | Status |
|---|---|---|---|
| `master` | 0 | 0 | ✓ |
| `phase_1_full_armor` | 0 | 0 | ✓ (alias) |
| `damaged` | 1 | 1 | ✓ |
| `phase_2_damaged` | 1 | 1 | ✓ (alias) |
| `core_exposed` | 2 | 2 | ✓ |
| `phase_3_core_exposed` | 2 | 2 | ✓ (alias) |
| `weapon_open` | 3 | 3 | ✓ |
| `phase_special_weapon_deployed` | 3 | 3 | ✓ (alias) |
| `bad_phase` | -1 | -1 | ✓ null-safe |

**Debug override:** `_orbitalSiegeStateDebugOverride = undefined` — inactive (correct idle state) ✓  
**`getOrbitalSiegeColossusMeta()`** available globally ✓  
**`getOrbitalSiegeColossusPhaseFrame()`** available globally ✓  

Individual state assets also exist on disk:
- `orbital_siege_colossus_master.png` ✓
- `orbital_siege_colossus_damaged.png` ✓
- `orbital_siege_colossus_core_exposed.png` ✓
- `orbital_siege_colossus_weapon_open.png` ✓
- `orbital_siege_colossus_sheet.png` ✓ (1280×320, loaded)

---

## PHASE 7 — CRABTRON HERO BENCHMARK VALIDATION

| Property | Expected | Actual | Status |
|---|---|---|---|
| Sprite ID | `boss_crabtron_hero` | `boss_crabtron_hero` | ✓ |
| Image size | 1536×960 | 1536×960 | ✓ |
| Frame W/H | 192×192 | 192×192 | ✓ |
| Columns / Rows | 8 / 5 | 8 / 5 | ✓ |
| Total frames | 40 | 40 | ✓ |

### Frame Lookups (`getCrabtronHeroFrame(state, layer)`)

| Call | Expected | Actual | Status |
|---|---|---|---|
| `idle`, `composite` | 0 | 0 | ✓ |
| `mid_damage`, `body` | 18 | 18 | ✓ |
| `rage_phase`, `weakpoint_core` | 29 | 29 | ✓ |
| `death_exposed_core`, `overlay_glow_damage` | 39 | 39 | ✓ |
| `bad`, `bad` | -1 | -1 | ✓ null-safe |

### Scale Validation

- `getCrabtronHeroMeta().scaleHint` = `0.55` ✓
- draw.js uses `_heroMetaScale = getCrabtronHeroMeta().scaleHint` = `0.55`
- Clamp: `Math.max(0.38, Math.min(0.55, 0.55))` = **0.55** ✓ (Fix 4 from prior audit confirmed active)
- `drawCrabtronHeroLayers` default `safeScale` = `0.55` ✓

### Hero Draw Path

- Condition: `boss.pattern === 'crossfire'` — hero layers only render for Crabtron boss
- `drawCrabtronHeroLayers` function globally registered: ✓
- `getCrabtronHeroMeta()` globally available: ✓
- `getCrabtronHeroFrame()` globally available: ✓
- No legacy contamination — hero path fires before legacy `drawBossSpriteOrLegacy` fallback ✓
- Weakpoint: `weakpointPivot: [96, 108]`, `weakpointRadius: 15` — metadata intact ✓

---

## PHASE 8 — PERFORMANCE + STABILITY AUDIT

### Registry Health

| Metric | Value |
|---|---|
| Total registered sprites | 34 |
| Loaded | 34 (100%) |
| Missing (404) | 0 |
| Load errors | 0 |
| Still loading at audit time | 0 |

### Console / Network

| Check | Result |
|---|---|
| JS runtime exceptions | None ✓ |
| Console errors at load | None ✓ |
| Console warnings (SpriteSystem missing) | None ✓ |
| 404 network requests | None ✓ |
| CORS violations | None ✓ |

### System Health

| Check | Result |
|---|---|
| `sprites.enabled` | true ✓ |
| `sprites.fallbackToLegacy` | true ✓ |
| `sprites.debugMissingSprites` | true ✓ |
| All spriteLab kill switches | all true ✓ |
| Fallback chains intact | ✓ all paths verified |
| Null-safe bad-state lookups | ✓ all return -1 |

### Draw System

| Function | Scope | Status |
|---|---|---|
| `drawCrabtronHeroLayers` | global | ✓ registered |
| `drawS04WedgePlayer` | draw.js local | ✓ correct encapsulation |
| `drawFactionSprite` / `getHCArtEnemyVisual` | draw.js local | ✓ correct encapsulation |
| `drawSpriteFrame` | global (SpriteSystem) | ✓ |
| `isSpriteReady` | global (SpriteSystem) | ✓ |

---

## SAFE FIX APPLIED

### FIX-01 — S04 Wedge metadata `sheetCols`/`sheetRows` documentation correction

**Severity:** LOW (documentation only — rendering unaffected)  
**Files changed:** `www/sprite-system.js`, `www/draw.js`

**Root cause:** The `_S04_WEDGE_META` object documented `sheetCols: 2, sheetRows: 4` (portrait 2×4 layout) when the actual image `player_s04_wedge_sheet_2x4.png` is landscape 512×256 (4 cols × 2 rows). The render system calculates columns dynamically from `image.width / frameWidth`, so rendering was always correct. Only the static metadata documentation was wrong.

**Changes:**
- `sprite-system.js`: `sheetCols: 2 → 4`, `sheetRows: 4 → 2`, comment "2 cols x 4 rows" → "4 cols x 2 rows", inline comment "2x4 grid" → "4x2 grid"
- `draw.js:3942`: comment "2x4 grid" → "4x2 grid"

**Gameplay impact:** Zero.

---

## FINDINGS MATRIX

| Phase | System | Status | Notes |
|---|---|---|---|
| A | S04 Wedge player ship | ✓ PASS | Doc fix applied (sheetCols/Rows) |
| A | Scout faction | ✓ PASS | 5 enemy types mapped correctly |
| B | Suppressor faction | ✓ PASS | alien3 → mk1_master |
| B | Splitter faction / alien6 fix | ✓ PASS | alien6 now magenta, confirmed |
| B | Imperial faction | ✓ PASS | Registered; map empty pending spawn pass |
| C | Mini-boss hierarchy | ✓ PASS | 4 units, all frames correct |
| D | Imperial Flagship | ✓ PASS | 3 phases, all aliases verified |
| E | Orbital Siege Colossus | ✓ PASS | 4 states, all aliases verified |
| — | Crabtron hero (benchmark) | ✓ PASS | 40 frames, scale 0.55, no regression |

---

## REMAINING BLOCKERS

**None.** All Sprite Lab phases A–E are production-ready.

---

## OPEN INFORMATIONAL ITEMS (non-blocking)

| ID | Item | Severity | Action |
|---|---|---|---|
| INFO-01 | Imperial faction map empty (`_SPRITE_LAB_IMPERIAL_MAP = {}`) | INFO | Expected — no Imperial spawn types yet. Activate when Imperial enemy pass is implemented. |
| INFO-02 | `_flagshipPhaseDebugOverride` inactive | INFO | Set via console when needed for debugging Phase D. |
| INFO-03 | `_orbitalSiegeStateDebugOverride` inactive | INFO | Set via console when needed for debugging Phase E. |
| INFO-04 | Canvas `toDataURL` blocked in Chrome MCP context | INFO | Tooling limitation only — not a game bug. |

---

## VALIDATION CONCLUSION

**All 8 validation phases complete. Zero blocking issues. One safe documentation fix applied.**

The Sprite Lab runtime architecture is stable across all phases A–E with correct sprite loading, dimension compliance, frame mapping, kill switch coverage, fallback chain integrity, and null-safe lookup behavior. The Crabtron hero benchmark path remains uncontaminated and operating at the correct 0.55 scale.

**The Galaxy Raiders Sprite Lab runtime hierarchy is production-ready.**
