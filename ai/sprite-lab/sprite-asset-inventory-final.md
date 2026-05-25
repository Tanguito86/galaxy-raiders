# SPRITE LAB — FINAL ASSET INVENTORY

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Consolidated Inventory — Documentation Only

---

## SUMMARY

| Metric | Count |
|---|---|
| **Total registered sprites** | 34 |
| **Source files on disk** | 27 (some sprites share sheets) |
| **LIVE (drawn in encounters)** | 18 |
| **REGISTERED (not wired)** | 5 |
| **PREVIEW ONLY (prelude silhouettes)** | 4 |
| **INERT (no entity recipient)** | 1 |
| **FALLBACK (legacy tier)** | 6 |
| **Kill switches** | 15 |
| **Metadata JSON files** | 7 |

---

## PLAYER SHIP (4 registered, 4 LIVE)

| Sprite ID | Source | Frames | Resolution | Status | Kill Switch |
|---|---|---|---|---|---|
| `player_s04_wedge` | `player/player_s04_wedge_sheet_2x4.png` | 8 (2x4) | 128x128 | **LIVE** | `playerS04Wedge` |
| `player_wedge` | Aliased to S04 sheet | 8 (2x4) | 128x128 | **LIVE** (fallback) | N/A |
| `player_ship_3x3` | `player-ship-3x3.png` | 9 (3x3) | 32x32 | **LIVE** (fallback) | N/A |
| `player` | `player.png` | 1 | 32x32 | **LIVE** (fallback) | N/A |

**Draw chain:** S04 Wedge → player_wedge → 3x3 → static → legacy pixel art

---

## ENEMY FACTION SPRITES (5 registered, 4 LIVE, 1 INERT)

### Scout Faction

| Sprite ID | Source | Frames | Resolution | Mapped To | Status |
|---|---|---|---|---|---|
| `faction_scout` | `enemies/scout/scout_alien_faction_sheet.png` | 4 | 128x128 | alien1(f0), alien2(f2), alien4(f1), alien5(f3), alien_mini(f3) | **LIVE** |

### Suppressor Faction

| Sprite ID | Source | Frames | Resolution | Mapped To | Status |
|---|---|---|---|---|---|
| `faction_suppressor` | `enemies/suppressor/suppressor_alien_faction_sheet.png` | 4 | 128x128 | alien3(f0) | **LIVE** |

### Splitter Faction

| Sprite ID | Source | Frames | Resolution | Mapped To | Status |
|---|---|---|---|---|---|
| `faction_splitter` | `enemies/splitter/splitter_alien_faction_sheet.png` | 4 | 128x128 | alien6(f0) | **LIVE** |

### Imperial Faction

| Sprite ID | Source | Frames | Resolution | Mapped To | Status |
|---|---|---|---|---|---|
| `faction_imperial` | `enemies/imperial/imperial_alien_faction_sheet.png` | 4 | 128x128 | — | **INERT** |

**Imperial note:** Sheet is registered and loaded. No imperial enemy spawn type exists. `_SPRITE_LAB_IMPERIAL_MAP` is `{}`. Kill switch exists (`factionImperial`) but has no effect until imperial enemies are created.

---

## ENEMY LEGACY SPRITES (12 registered, 12 LIVE — fallback tier)

| Sprite ID | Source | Frames | Resolution | Status |
|---|---|---|---|---|
| `alien1` | `alien1.png` | 1 | 32x32 | FALLBACK |
| `alien1_strip` | `alien1-strip.png` | 3 | 32x32 | FALLBACK |
| `alien2` | `alien2.png` | 1 | 32x32 | FALLBACK |
| `alien2_strip` | `alien2-strip.png` | 3 | 32x32 | FALLBACK |
| `alien3` | `alien3.png` | 1 | 32x32 | FALLBACK |
| `alien3_strip` | `alien3-strip.png` | 3 | 32x32 | FALLBACK |
| `alien4` | `alien4.png` | 1 | 32x32 | FALLBACK |
| `alien4_strip` | `alien4-strip.png` | 3 | 32x32 | FALLBACK |
| `alien5` | `alien5.png` | 1 | 32x32 | FALLBACK |
| `alien5_strip` | `alien5-strip.png` | 3 | 32x32 | FALLBACK |
| `alien6` | `alien6.png` | 1 | 32x32 | FALLBACK |
| `alien6_strip` | `alien6-strip.png` | 3 | 32x32 | FALLBACK |

These are drawn when faction sprites fail to load or corresponding kill switch is off.

---

## FLEET SPRITES (3 registered, 3 LIVE — intermediate fallback)

| Sprite ID | Source | Frames | Resolution | Status |
|---|---|---|---|---|
| `fleet_scout` | `fleet/fleet_scout_sheet.png` | 8 | 16x16 | FALLBACK |
| `fleet_interceptor` | `fleet/fleet_interceptor_sheet.png` | 10 | 24x24 | FALLBACK |
| `fleet_suppressor` | `fleet/fleet_suppressor_sheet.png` | 11 | 28x32 | FALLBACK |

Drawn when faction sprites are disabled. `alien_mini` uses `fleet_scout` as its HCART tier.

---

## ALIEN MINI MIDDLEWARE (2 registered, 2 LIVE)

| Sprite ID | Source | Frames | Resolution | Status |
|---|---|---|---|---|
| `alien_mini` | `alien1.png` (reuses) | 1 | 32x32 | FALLBACK |
| `alien_mini_strip` | `alien1-strip.png` (reuses) | 3 | 32x32 | FALLBACK |

Prevents ghost rectangles. Reuses alien1 assets. Draw chain: `faction_scout` f:3 → `alien_mini_strip` → `alien_mini` → `SPRITES.alien1_a`.

---

## BOSS SPRITES — LEGACY SINGLE-FRAME (5 registered, 5 FALLBACK)

| Sprite ID | Source | Resolution | Boss | Level | Status |
|---|---|---|---|---|---|
| `boss_crabtron` | `boss_crabtron.png` | 96x96 | CRABTRON | 5 | FALLBACK |
| `boss_serpentrix` | `boss_serpentrix.png` | 96x96 | SERPENTRIX | 10 | FALLBACK |
| `boss_orbital` | `boss_orbital.png` | 96x96 | ORBITAL | 15 | FALLBACK |
| `boss_teniente` | `boss_teniente.png` | 96x96 | TENIENTE | 19 | FALLBACK |
| `boss_emperador` | `boss_emperador.png` | 128x128 | EMPERADOR | 20 | FALLBACK |

These are drawn when the upgraded boss sprite (hero/flagship) is unavailable or the kill switch is off.

---

## BOSS SPRITES — SPRITE LAB UPGRADED (3 registered, 2 LIVE, 1 REGISTERED)

### CRABTRON Hero — LIVE

| Sprite ID | Source | Layout | Frames | Resolution | Phases |
|---|---|---|---|---|---|
| `boss_crabtron_hero` | `ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png` | 8 cols x 5 rows | 40 (7 layers x 5 states) | 192x192 | idle, attack_windup, mid_damage, rage_phase, death_exposed_core |

**Status:** **LIVE** — called from `draw.js:4335` via `drawCrabtronHeroLayers()`. Layer system: shadow, body, left_claw, right_claw, cannons_vents, weakpoint_core, overlay_glow_damage.

### Imperial Flagship — LIVE

| Sprite ID | Source | Layout | Frames | Resolution | Phases |
|---|---|---|---|---|---|
| `boss_imperial_flagship` | `bosses/imperial_flagship/imperial_flagship_command_sheet.png` | 3 horiz | 3 | 256x256 | master, damaged, core_exposed |

**Status:** **LIVE** — called from `draw.js:4344` via `drawImperialFlagshipVisual()`. Wired to EMPERADOR (level 20). Phases auto-resolve from boss HP.

### Orbital Siege Colossus — REGISTERED

| Sprite ID | Source | Layout | Frames | Resolution | States |
|---|---|---|---|---|---|
| `boss_orbital_siege_colossus` | `bosses/orbital_siege/orbital_siege_colossus_sheet.png` | 4 horiz | 4 | 320x320 | master, damaged, core_exposed, weapon_open |

**Status:** **REGISTERED (not wired)** — `drawOrbitalSiegeColossusVisual()` defined but never called. Awaiting fortress boss slot. Largest boss asset in Galaxy Raiders.

---

## MINI-BOSS HIERARCHY (1 sheet, 4 units)

| Sprite ID | Source | Layout | Frames | Resolution |
|---|---|---|---|---|
| `boss_miniboss_hierarchy` | `bosses/miniboss_hierarchy_sheet.png` | 4 horiz | 4 | 192x192 |

| Unit | Frame | Faction | Color | Status |
|---|---|---|---|---|
| `scout_hive_leader` | 0 | scout_alien | #5ef7ff | **PREVIEW ONLY** (prelude silhouettes) |
| `suppressor_siege_core` | 1 | suppressor_alien | #ff5533 | **PREVIEW ONLY** |
| `splitter_aberrant_node` | 2 | splitter_alien | #dd66cc | **PREVIEW ONLY** |
| `imperial_command_lancer` | 3 | imperial_alien | #ffd866 | **PREVIEW ONLY** |

**Draw function:** `drawMiniBossVisual()` — defined in `draw.js`, called only from prelude silhouette code. Zero spawn references in gameplay.

---

## VISUAL ASSET FLOW

```
SPRITE SHEET                REGISTRATION              DRAW FUNCTION              RUNTIME STATE
───────────────────────────────────────────────────────────────────────────────────────────
player_s04_wedge_sheet_2x4  → player_s04_wedge       → drawSpriteFrame()        → LIVE (level 1-20)

scout_alien_faction_sheet   → faction_scout          → getHCArtEnemyVisual()    → LIVE (alien1/2/4/5/mini)
suppressor_alien_faction    → faction_suppressor     → getHCArtEnemyVisual()    → LIVE (alien3)
splitter_alien_faction      → faction_splitter       → getHCArtEnemyVisual()    → LIVE (alien6)
imperial_alien_faction      → faction_imperial       → —                        → INERT (no enemy type)

crabtron_hero_master_sheet  → boss_crabtron_hero     → drawCrabtronHeroLayers() → LIVE (crossfire, lv5)
imperial_flagship_command   → boss_imperial_flagship → drawImperialFlagship()  → LIVE (supreme, lv20)
orbital_siege_colossus      → boss_orbital_siege     → drawOrbitalSiege...()   → REGISTERED (no slot)

miniboss_hierarchy_sheet    → boss_miniboss_hierarchy→ drawMiniBossVisual()     → PREVIEW ONLY (silhouettes)
                            → scout_hive_leader      → prelude silhouette       → lv5 crossfire prelude
                            → suppressor_siege_core  → prelude silhouette       → lv10 zigzag prelude
                            → splitter_aberrant_node → prelude silhouette       → lv15 rotate + lv19 divebomb
                            → imperial_command_lancer→ prelude silhouette       → lv20 supreme prelude
```

---

## KILL SWITCH ↔ ASSET MATRIX

| Kill Switch | Affects | Default |
|---|---|---|
| `playerS04Wedge` | `player_s04_wedge` | `true` |
| `factionScout` | `faction_scout` (5 enemy types) | `true` |
| `factionSuppressor` | `faction_suppressor` (1 enemy type) | `true` |
| `factionSplitter` | `faction_splitter` (1 enemy type) | `true` |
| `factionImperial` | `faction_imperial` (0 enemy types) | `true` |
| `miniBossHierarchy` | All 4 mini-boss sprites | `true` |
| `miniBossScout` | `scout_hive_leader` | `true` |
| `miniBossSuppressor` | `suppressor_siege_core` | `true` |
| `miniBossSplitter` | `splitter_aberrant_node` | `true` |
| `miniBossImperial` | `imperial_command_lancer` | `true` |
| `minibossPreludePreview` | Prelude silhouettes (all 4) | `true` |
| `imperialFlagship` | `boss_imperial_flagship` / EMPERADOR | `true` |
| `imperialFlagshipPhaseDebug` | Flagship manual phase override | `false` |
| `orbitalSiegeColossus` | `boss_orbital_siege_colossus` | `true` |
| `orbitalSiegeStateDebug` | Colossus manual state override | `false` |

---

## METADATA FILES

| File | Type | Units/Phases |
|---|---|---|
| `scout_alien_faction.json` | Faction | 4 units (128x128) |
| `suppressor_alien_faction.json` | Faction | 4 units (128x128) |
| `splitter_alien_faction.json` | Faction | 4 units (128x128) |
| `imperial_alien_faction.json` | Faction | 4 units (128x128) |
| `miniboss_hierarchy.json` | Mini-Boss Hierarchy | 4 units (192x192) |
| `imperial_flagship_command.json` | Flagship Boss | 3 phases (256x256) |
| `orbital_siege_colossus.json` | Fortress Boss | 4 states (320x320) |

Metadata is NOT loaded at runtime — hardcoded JS objects in `sprite-system.js` serve as the runtime metadata source. JSON files are documentation.

---

## RESOLUTION TIER HIERARCHY

```
 32x32   Legacy enemies (alien1-6, alien_mini, player)
 96x96   Legacy boss single-frames (Crabtron, Serpentrix, Orbital, Teniente)
128x128   Player S04 Wedge, Faction enemies, Boss Emperador
192x192   Mini-boss hierarchy, Crabtron Hero
256x256   Imperial Flagship Command
320x320   Orbital Siege Colossus (largest asset in Galaxy Raiders)
```

---

## TOTAL COUNTS

| Category | Count |
|---|---|
| Registered sprites | 34 |
| Source PNG files | 27 sheets |
| Individual frame PNGs (tracked) | 8 (scout/suppressor) |
| Individual frame PNGs (ignored) | 22 |
| Preview/reference PNGs | 20 |
| Metadata JSON | 7 |
| Generation scripts | 10 |
| Sprite Lab phases (A-E) | 5 (all complete) |
| HC-SPRITE-WIRE integrations | 3 (all live) |
| HC-SPRITE-MINIBOSS tasks | 2 (1 complete, 1 live) |

---

## STATUS DISTRIBUTION

```
LIVE (drawn every frame):      ██████████████████████ 18
  Player: 4
  Faction enemies: 3 sheets → 7 enemy types
  Boss: 2 (CRABTRON hero, Flagship/Emp)
  Fleet fallback: 3
  Alien middleware: 2
  Legacy enemies: 0 (only as fallback)

PREVIEW ONLY (prelude only):   ████ 4
  Mini-bosses: 4

REGISTERED (not wired):        ██ 2
  Colossus: 1
  Imperial faction: 1 (inert)

FALLBACK TIER:                 ████████████ 12
  Legacy enemies: 12
  Legacy bosses: 5 (not counted separately — always available as fallback)
```
