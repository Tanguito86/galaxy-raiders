# HC-SPRITE-NEW-ASSETS-AUDIT-01 — New Sprite Visibility Audit
## Why new sprites are (or aren't) visible in Galaxy Raiders

**Date:** 2026-05-25  
**Type:** Audit-only — no code modifications  
**Scope:** All new sprites from www/assets/sprites/ and ai/generated/

---

## Executive Summary

**29 new sprite sheets/variants** were created across 4 factions, 2 mega-bosses, 1 mini-boss sheet, and 1 player ship upgrade. The pipeline is robust: all sheets are registered in `sprite-system.js`, all have kill switches in `game-config.js`, and all have draw logic in `draw.js` — **except one**: the Imperial faction sprite, which is fully registered but has `_SPRITE_LAB_IMPERIAL_MAP = {}` (no enemy types assigned). Additionally, 25 individual PNG frames exist as delivery artifacts but aren't needed at runtime (they're source frames for the sheets).

---

## Status Classification

| Status | Meaning |
|--------|---------|
| **GENERATED ONLY** | Asset exists in filesystem only — not registered, not drawn |
| **REGISTERED ONLY** | Registered in sprite-system.js but no draw function calls it |
| **REGISTERED + DRAW FUNCTION** | Has both registration and draw logic |
| **PREVIEW ONLY** | Rendered only in prelude/preview, not in main gameplay |
| **LIVE IN GAME** | Fully integrated — visible during normal gameplay |

---

## 1. Player Ship

| Sprite ID | File | Status | Visibility Condition | Kill Switch |
|-----------|------|--------|---------------------|-------------|
| `player_s04_wedge` | `player/player_s04_wedge_sheet_2x4.png` | **LIVE IN GAME** ✅ | Always (S04 wedge is default) | `spriteLab.playerS04Wedge: false` |
| `player_wedge` | `player/player_s04_wedge_sheet_2x4.png` | **LIVE IN GAME** ✅ (fallback tier) | When S04 wedge disabled or not ready | N/A (fallback) |
| `player` | `player.png` | LIVE (legacy) | Ultimate fallback | N/A |
| `player_ship_3x3` | `player-ship-3x3.png` | LIVE (legacy tier 2) | Penalty fallback | N/A |

**Draw chain:**
```
player_s04_wedge (Phase A) → player_wedge (HC-ART-02) → player_ship_3x3 → player (legacy)
```
All tiers have fallback via `drawSpriteFrame()` → `runFallback()`.

---

## 2. Enemy Factions (SPRITE LAB Phase A/B)

### 2.1 Scout Alien Faction
| Sprite ID | Sheet | Status | Enemy Types | Visibility |
|-----------|-------|--------|-------------|------------|
| `faction_scout` | `enemies/scout/scout_alien_faction_sheet.png` | **LIVE IN GAME** ✅ | alien1 (F0), alien2 (F2), alien4 (F1), alien5 (F3), alien_mini (F3) | Always visible for these 5 types |

**Kill switch:** `spriteLab.factionScout: false` → reverts to `fleet_scout/fleet_interceptor` tier

**Individual frames NOT registered** (covered by sheet):
- `scout_alien_mk1_master.png` — frame 0 on sheet
- `scout_alien_elite.png` — frame 1 on sheet
- `scout_alien_sniper.png` — frame 2 on sheet
- `scout_alien_swarm.png` — frame 3 on sheet
- `alien_scout_master.png` — duplicate (ai/generated variant)

### 2.2 Suppressor Alien Faction
| Sprite ID | Sheet | Status | Enemy Types | Visibility |
|-----------|-------|--------|-------------|------------|
| `faction_suppressor` | `enemies/suppressor/suppressor_alien_faction_sheet.png` | **LIVE IN GAME** ✅ | alien3 (F0 only) | Only visible for alien3 |

**Kill switch:** `spriteLab.factionSuppressor: false` → reverts to `fleet_suppressor`

**Individual frames NOT registered** (covered by sheet):
- `suppressor_alien_mk1_master.png` — frame 0
- `suppressor_alien_elite.png` — frame 1
- `suppressor_alien_artillery.png` — frame 2
- `suppressor_alien_brute.png` — frame 3

### 2.3 Splitter Alien Faction
| Sprite ID | Sheet | Status | Enemy Types | Visibility |
|-----------|-------|--------|-------------|------------|
| `faction_splitter` | `enemies/splitter/splitter_alien_faction_sheet.png` | **LIVE IN GAME** ✅ | alien6 (F0 only) | Only visible for alien6 |

**Kill switch:** `spriteLab.factionSplitter: false` → reverts to `fleet_suppressor` tier

**Individual frames NOT registered** (covered by sheet):
- `splitter_alien_mk1_master.png` — frame 0
- `splitter_alien_elite.png` — frame 1
- `splitter_alien_shard.png` — frame 2
- `splitter_alien_aberration.png` — frame 3

### 2.4 Imperial Alien Faction ⚠️
| Sprite ID | Sheet | Status | Enemy Types | Why Not Visible |
|-----------|-------|--------|-------------|-----------------|
| `faction_imperial` | `enemies/imperial/imperial_alien_faction_sheet.png` | **REGISTERED + DRAW FUNCTION — NOT VISIBLE** 🔴 | NONE | `_SPRITE_LAB_IMPERIAL_MAP = {}` — no alien type maps to this faction |

**Root cause:** The Imperial faction sprite is fully registered (line 483 of sprite-system.js), has a kill switch (`spriteLab.factionImperial`), has a hitbox defined (draw.js L5246), and the `getHCArtEnemyVisual()` function iterates over Imperial in the faction check chain (L5121). **BUT** `_SPRITE_LAB_IMPERIAL_MAP` is an empty object — no alien type (alien1–6, alien_mini) points to it. The code comment at L5105-5108 explicitly states: *"Imperial faction override (reserved — no enemy types yet). Imperial faction sprites are registered and ready. They will activate once Imperial enemy spawn types are introduced in a future gameplay pass."*

**What's missing to see it:**
1. One or more alien types must be reassigned to `faction_imperial` (e.g., alien1 → imperial frame 0, alien6 → imperial frame 1)
2. OR new enemy types must be created (imperial_grunt, imperial_elite, etc.) — requires gameplay code
3. The existing `_SPRITE_LAB_IMPERIAL_MAP` just needs a non-empty mapping

**Risk of integration:** LOW — visual-only change. Reassigning existing aliens to imperial frames is a 1-line edit with zero gameplay impact (only the sprite changes). However, the comment says "reserved for future Imperial enemy types" implying design intent to create new enemy behaviors, not just reassign existing ones.

**Individual frames NOT registered** (covered by sheet):
- `imperial_alien_mk1_master.png` — frame 0
- `imperial_alien_elite.png` — frame 1
- `imperial_alien_lancer.png` — frame 2
- `imperial_alien_guardian.png` — frame 3

---

## 3. Bosses

### 3.1 Crabtron Hero (Layered System)
| Sprite ID | Sheet | Status | Visibility Condition | Kill Switch |
|-----------|-------|--------|---------------------|-------------|
| `boss_crabtron_hero` | `ai-generated/crabtron-hero-20260523/...` | **LIVE IN GAME** ✅ | `boss.pattern === 'crossfire'` (Crabtron fight) | None explicit — falls back to legacy Crabtron render |

**Layered rendering:** 8 layers (composite, shadow, body, left_claw, right_claw, weakpoint_core, cannons_vents, overlay_glow_damage) × 5 states (idle, attack_windup, mid_damage, rage_phase, death_exposed_core). Full 1536×960 master sheet.

### 3.2 Legacy Boss Sprites (HC-117 hooks)
All registered and drawn via legacy `drawSprite()` — single-frame fallback renders:

| Sprite ID | File | Pattern | Status |
|-----------|------|---------|--------|
| `boss_crabtron` | `boss_crabtron.png` | crossfire | LIVE (legacy fallback) |
| `boss_serpentrix` | `boss_serpentrix.png` | zigzag | LIVE (legacy fallback) |
| `boss_orbital` | `boss_orbital.png` | rotate | LIVE (legacy fallback) |
| `boss_teniente` | `boss_teniente.png` | divebomb | LIVE (legacy fallback) |
| `boss_emperador` | `boss_emperador.png` | supreme | LIVE (legacy fallback) |

### 3.3 Mini-Boss Hierarchy (SPRITE LAB PHASE C)
| Sprite ID | Sheet | Status | Visibility |
|-----------|-------|--------|------------|
| `boss_miniboss_hierarchy` | `bosses/miniboss_hierarchy_sheet.png` | **PREVIEW + PRELUDE** 🟡 | Mini-boss silhouette during boss warning overlay |

**Kill switches:** `spriteLab.miniBossHierarchy`, individual per-unit (`miniBossScout`, `miniBossSuppressor`, `miniBossSplitter`, `miniBossImperial`)

**Frame map:** 0=scout_hive_leader, 1=suppressor_siege_core, 2=splitter_aberrant_node, 3=imperial_command_lancer

**Individual PNGs exist but NOT registered** (covered by sheet):
- `imperial_command_lancer.png`
- `scout_hive_leader.png`
- `splitter_aberrant_node.png`
- `suppressor_siege_core.png`

**Note:** These are rendered as **preview only** during boss prelude transitions (silhouette/preview rendering at draw.js L4537-4594). They are NOT drawn as standalone combat entities — the actual mini-boss combat uses the legacy geometric rendering.

### 3.4 Imperial Flagship Command (SPRITE LAB PHASE D)
| Sprite ID | Sheet | Status | Visibility Condition |
|-----------|-------|--------|---------------------|
| `boss_imperial_flagship` | `bosses/imperial_flagship/imperial_flagship_command_sheet.png` | **LIVE IN GAME** ✅ | `boss.pattern === 'supreme'` (Emperador fight) + `spriteLab.imperialFlagship === true` |

**Kill switch:** `spriteLab.imperialFlagship: false` → reverts to legacy `boss_emperador` render

**Phase frames:** master (0), damaged (1), core_exposed (2) — 256×256 each on 768×256 sheet

**Individual PNGs exist but NOT registered** (covered by sheet):
- `imperial_flagship_command_master.png`
- `imperial_flagship_command_damaged.png`
- `imperial_flagship_command_core_exposed.png`
- `imperial_flagship_command_sheet.png` (the sheet itself)

### 3.5 Orbital Siege Colossus (SPRITE LAB PHASE E)
| Sprite ID | Sheet | Status | Visibility Condition |
|-----------|-------|--------|---------------------|
| `boss_orbital_siege_colossus` | `bosses/orbital_siege/orbital_siege_colossus_sheet.png` | **LIVE IN GAME** ✅ | Boss type === fortress (Orbital Siege fight) + `spriteLab.orbitalSiegeColossus === true` |

**Kill switch:** `spriteLab.orbitalSiegeColossus: false` → reverts to legacy

**Phase frames:** master (0), damaged (1), core_exposed (2), weapon_open (3) — 320×320 each on 1280×320 sheet

**Individual PNGs exist but NOT registered** (covered by sheet):
- `orbital_siege_colossus_master.png`
- `orbital_siege_colossus_damaged.png`
- `orbital_siege_colossus_core_exposed.png`
- `orbital_siege_colossus_weapon_open.png`

---

## 4. The "Missing Sprite" Reality

### Why new sprites might SEEM invisible:

| Reason | Affected Sprites | Real? |
|--------|-----------------|-------|
| **Imperial faction has no enemy types** | `faction_imperial` | 🔴 YES — real gap |
| **Individual frames ≠ runtime sprites** | 25 individual PNGs in enemies/, bosses/ | 🟡 NO — they're source frames for the sheets |
| **Faction sheets only show 1 frame per type** | Scout: alien3 uses frame 1 (elite), alien6 uses frame 0 (mk1) | 🟡 BY DESIGN — each alien type maps to a fixed frame |
| **Mini-bosses are preview-only** | `boss_miniboss_hierarchy` and its 4 units | 🟡 BY DESIGN — combat still uses legacy geo |
| **Kill switches are all ON** | All spriteLab flags = true | 🟢 NOT a problem — all are enabled |
| **Boss hero sprites appear only in specific fights** | Crabtron hero (crossfire), Flagship (supreme), Colossus (rotate) | 🟡 BY DESIGN — need to reach those boss fights |

### The Imperial Faction: The One Real Gap

```
Pipeline status for faction_imperial:

  [✓] Asset exists (imperial_alien_faction_sheet.png — 512×128, 4 frames)
  [✓] Registered in sprite-system.js (L483: registerSprite("faction_imperial", {...}))
  [✓] Kill switch in game-config.js (spriteLab.factionImperial: true)
  [✓] Hitbox defined in draw.js (L5246)
  [✓] Checked in getHCArtEnemyVisual() chain (L5121)
  [✗] _SPRITE_LAB_IMPERIAL_MAP = {}  ← EMPTY — nothing maps to it
  
  Result: Sprite loads in memory, never reaches screen.
```

---

## 5. Recommendations

### SAFE — Visual-only (no gameplay impact)
1. **Assign Imperial faction to an alien type:** Add e.g. `alien1: { sprite: 'faction_imperial', scale: 0.50, frame: 0 }` to `_SPRITE_LAB_IMPERIAL_MAP`. Zero gameplay change, just swaps sprite. Risk: NONE.

2. **Reorder faction priority** if desired (currently Scout > Suppressor > Splitter > Imperial — all check every enemy)

### PREVIEW-ONLY — Needs design decision
3. **Expand mini-boss rendering** beyond prelude preview if design calls for it. Currently mini-bosses use legacy geometric rendering in combat.

### REQUIRES GAMEPLAY UNFREEZE
4. **Create Imperial enemy spawn types** — this is what the code comment anticipates. Would need: new enemy behaviors, spawn configurations, encounter integration. This is a gameplay design task, not a sprite visibility bug.

---

## Summary Table

| # | Sprite ID | Category | File | Status | Visible? | Gap |
|---|-----------|----------|------|--------|----------|-----|
| 1 | `player_s04_wedge` | Player | player_s04_wedge_sheet_2x4.png | LIVE | ✅ Yes | None |
| 2 | `player_wedge` | Player (fallback) | player_s04_wedge_sheet_2x4.png | LIVE | ✅ Yes | None |
| 3 | `faction_scout` | Enemy | scout_alien_faction_sheet.png | LIVE | ✅ Yes (5 types) | None |
| 4 | `faction_suppressor` | Enemy | suppressor_alien_faction_sheet.png | LIVE | ✅ Yes (1 type) | None |
| 5 | `faction_splitter` | Enemy | splitter_alien_faction_sheet.png | LIVE | ✅ Yes (1 type) | None |
| 6 | `faction_imperial` | Enemy | imperial_alien_faction_sheet.png | REGISTERED | 🔴 **NO** | **No enemy types map to it** |
| 7 | `boss_crabtron_hero` | Boss | crabtron_hero_master_sheet.png | LIVE | ✅ Yes (crossfire) | None |
| 8 | `boss_crabtron` | Boss | boss_crabtron.png | LIVE | ✅ Yes (legacy) | None |
| 9 | `boss_serpentrix` | Boss | boss_serpentrix.png | LIVE | ✅ Yes (legacy) | None |
| 10 | `boss_orbital` | Boss | boss_orbital.png | LIVE | ✅ Yes (legacy) | None |
| 11 | `boss_teniente` | Boss | boss_teniente.png | LIVE | ✅ Yes (legacy) | None |
| 12 | `boss_emperador` | Boss | boss_emperador.png | LIVE | ✅ Yes (legacy) | None |
| 13 | `boss_miniboss_hierarchy` | Mini-boss | miniboss_hierarchy_sheet.png | PREVIEW | 🟡 Prelude only | Combat uses legacy geo |
| 14 | `boss_imperial_flagship` | Boss | imperial_flagship_command_sheet.png | LIVE | ✅ Yes (supreme) | None |
| 15 | `boss_orbital_siege_colossus` | Boss | orbital_siege_colossus_sheet.png | LIVE | ✅ Yes (fortress) | None |

**25 individual frame PNGs** in enemies/ and bosses/ subdirectories are source frames — they exist in `ai/generated/` as pipeline output and in `www/assets/sprites/` as the final delivery format for the sprite sheets. They are NOT registered as standalone sprites and this is CORRECT — the game uses the composite sheets (faction sheets, boss phase sheets).

---

## Bottom Line

**1 real gap found:** `faction_imperial` has no enemy type assignment (`_SPRITE_LAB_IMPERIAL_MAP = {}`). Everything else works as designed: sprites load, kill switches work, draw chains are complete with fallbacks, and the only "invisible" assets are the Imperial faction (by design — reserved for future) and the mini-boss hierarchy (preview-only by design).
