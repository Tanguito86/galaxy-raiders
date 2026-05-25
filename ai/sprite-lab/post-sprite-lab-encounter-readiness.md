# POST-SPRITE-LAB — ENCOUNTER READINESS MATRIX

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Audit Complete — No Code Changes

---

## 1. CURRENT ENEMY TYPE USAGE

### Enemy → Faction → Sprite Lab Mapping

| Enemy Type | Role | Faction | Sprite Sheet | Visual Active | Notes |
|---|---|---|---|---|---|
| `alien1` | sweeper | scout | `faction_scout` (frame 0: mk1_master) | YES | Phase A faction override |
| `alien2` | sniper | scout | `faction_scout` (frame 2: sniper) | YES | Phase A faction override |
| `alien3` | diver | suppressor | `faction_suppressor` (frame 0: mk1_master) | YES | Phase B faction override |
| `alien4` | suppressor | scout | `faction_scout` (frame 1: elite) | YES | Phase A faction override |
| `alien5` | chaser | scout | `faction_scout` (frame 3: swarm) | YES | Phase A faction override |
| `alien6` | flanker | splitter | `faction_splitter` (frame 0: mk1_master) | YES | Phase B fix (was suppressor) |
| `alien_mini` | baiter | scout | `faction_scout` (frame 3: swarm) | YES | Phase A override |

**Coverage:** 7/7 enemy types have faction sprite assignments active.
**Fallback:** All 7 fall back to `fleet_*` sprites if faction sprites fail or kill switches are off.

### Missing: Imperial Enemy Types

| Gap | Current State | Blocker |
|---|---|---|
| No `alien_imperial` type exists | `faction_imperial` sheet registered (4 frames), `imperial` faction defined | No enemy spawn type assigned |
| `_SPRITE_LAB_IMPERIAL_MAP` is `{}` | Imperial kill switch exists but no mapping | Awaiting gameplay archetype design |

---

## 2. BOSS APPEARANCES — STAGE FLOW

| Level | Boss Pattern | Boss Name | HP Gate | Current Sprite | Sprite Lab Asset Available |
|---|---|---|---|---|---|
| 5 | `crossfire` | CRABTRON (MOTHERSHIP) | 100% | `boss_crabtron` (96x96) | `boss_crabtron_hero` (40-frame layered, 192x192) |
| 10 | `zigzag` | SERPENTRIX | 100% | `boss_serpentrix` (96x96) | None (single-frame only) |
| 15 | `rotate` | ORBITAL | 100% | `boss_orbital` (96x96) | None (single-frame only) |
| 19 | `divebomb` | TENIENTE | 100% | `boss_teniente` (96x96) | None (single-frame only) |
| 20 | `supreme` | EMPERADOR | 100% | `boss_emperador` (128x128) | `boss_imperial_flagship` (256x256, 3 phases) |

### Key Observations

- **CRABTRON hero sprite exists but is NOT wired.** The `_crabtronHeroReady` flag in draw.js gates CRABTRON's hero layered draw but no function calls it.
- **EMPERADOR is the natural target for `drawImperialFlagshipVisual()`.** Both share the Imperial faction and flagship-tier identity.
- **ORBITAL is the closest match for `drawOrbitalSiegeColossusVisual()`** — but the fortress is a separate, larger asset designed for a different boss slot.

---

## 3. VISUAL HIERARCHY — WHAT'S WIRED vs. WHAT'S NOT

### Wired and Active

| System | Files | Status |
|---|---|---|
| Player S04 Wedge with tiered fallback | `draw.js`, `sprite-system.js` | Active since Phase A |
| Faction silhouettes (`drawFactionSilhouette`) | `enemy-factions.js`, `draw.js` | Active |
| Faction markers (`drawFactionMarker`) | `enemy-factions.js`, `draw.js` | Active |
| Faction death particles/rings | `enemy-factions.js` | Active |
| Boss telegraphs + phase transition FX | `boss-patterns.js`, `draw.js` | Active |
| Boss single-frame sprites (5 bosses) | `sprite-system.js`, `draw.js` | Active |
| Legacy boss geometric rendering | `draw.js` | Active (fallback) |

### Registered but NOT Wired

| Asset | Registration | Draw Function | Call Sites | Cost to Wire |
|---|---|---|---|---|
| CRABTRON hero layered (40 frames) | `boss_crabtron_hero` | None | 0 | Low — call `drawCrabtronHeroLayers()` from CRABTRON draw path |
| Mini-boss hierarchy (4 units) | `boss_miniboss_hierarchy` | `drawMiniBossVisual()` | 0 | High — requires new entity types |
| Imperial Flagship (3 phases) | `boss_imperial_flagship` | `drawImperialFlagshipVisual()` | 0 | **Low — wire into EMPERADOR draw path** |
| Orbital Siege Colossus (4 states) | `boss_orbital_siege_colossus` | `drawOrbitalSiegeColossusVisual()` | 0 | High — requires new boss slot |
| Imperial faction enemies (4 frames) | `faction_imperial` | None | 0 | High — requires new enemy types + spawn code |

---

## 4. SAFE VISUAL-ONLY WIRING OPPORTUNITIES

### Tier 1: Safe — No Gameplay Changes Required

| Opportunity | What Changes | Risk |
|---|---|---|
| **Wire CRABTRON hero sprite** | Call `drawCrabtronHeroLayers()` from CRABTRON boss draw in `draw.js` | Minimal — sprite already loaded, just needs wiring |
| **Wire Imperial Flagship to EMPERADOR** | Replace legacy EMPERADOR sprite with `drawImperialFlagshipVisual()` at level 20 | Minimal — same boss slot, visual-only swap |
| **Show flagship HP-based phases** | `resolveFlagshipVisualPhase()` already reads boss HP; damage visual changes automatically | Minimal — pure visual, no gameplay |

### Tier 2: Moderate — Requires Visual-Only Preview Hooks

| Opportunity | What Changes | Risk |
|---|---|---|
| **Preview mini-boss visuals in boss prelude cutscenes** | Call `drawMiniBossVisual()` during prelude moments at levels leading to boss stages | Low — no gameplay state change |
| **Show Colossus silhouette in orbital-themed levels (7, 13, 14)** | Call `drawOrbitalSiegeColossusVisual()` as background decoration during `orbital_siege` set pieces | Low — ambient only |

### Tier 3: Requires New Gameplay Archetypes (Beyond Scope)

| Opportunity | What Needs to Be Created | Blockers |
|---|---|---|
| Imperial enemy type | New `alien7`/`alien_imperial` type, AI profile, spawn rules, faction mapping | Needs gameplay design pass |
| Mini-boss encounters | New entity type per mini-boss, spawn triggers, HP pool, pattern hooks | Needs encounter design pass |
| Fortress boss slot | New boss pattern type, phase plan, attack patterns, HP curve | Full gameplay design required |

---

## 5. STAGE-LEVEL INSERTION POINTS (Safe / Speculative)

| Level | Theme | Safe Visual Additions | Speculative (Future) |
|---|---|---|---|
| 1-4 | Scout intro | None — visuals already complete | Imperial preview set pieces |
| 5 | CRABTRON boss | **Wire hero layered sprite** | Mini-boss prelude in waves 3-4 |
| 6-9 | Scout/Suppressor escalation | None — visuals already complete | Suppressor mini-boss preview |
| 10 | SERPENTRIX boss | None — single-frame only | Splitter mini-boss preview |
| 11-14 | Splitter density | None — visuals already complete | Flagship silhouette background |
| 15 | ORBITAL boss | None — single-frame only | Colossus fortress preview |
| 16-18 | Splitter/Imperial theme (named only) | Imperial faction silhouette in set pieces | Imperial enemy spawns |
| 19 | TENIENTE boss | None — single-frame only | Flagship preview before EMPERADOR |
| 20 | EMPERADOR boss | **Wire Imperial Flagship sprite** | Full fortress integration |

---

## 6. RISK ASSESSMENT

| Risk | Level | Mitigation |
|---|---|---|
| Breaking legacy fallback chain | Low | All draw functions have `drawSpriteFrame` fallback + geometric fallback |
| HP-based phase flickering near thresholds | Low | `resolveFlagshipVisualPhase` uses simple thirds; 1-frame hysteresis possible |
| Sprite sheet not loading (404) | Low | All sheets validated present; fallback colors defined |
| Performance (320x320 fortress sprites) | Low | Only drawn when boss active; sprite system canvas rendering is efficient |
| Accidental gameplay coupling | None | All Phase C/D/E draw functions are pure visual; no gameplay state mutated |

---

## 7. INTEGRATION GAP SUMMARY

```
SPRITE LAB ASSETS         REGISTERED   DRAWN   WIRED
────────────────────────────────────────────────────
faction_scout              ✓           ✓       ✓
faction_suppressor         ✓           ✓       ✓
faction_splitter           ✓           ✓       ✓
faction_imperial           ✓           ✗       ✗  ← No enemy type
boss_crabtron_hero         ✓           ✗       ✗  ← Not wired to draw
boss_miniboss_hierarchy    ✓           ✓       ✗  ← No mini-boss entities
boss_imperial_flagship     ✓           ✓       ✗  ← Not wired to EMPERADOR
boss_orbital_siege_colossus ✓          ✓       ✗  ← No fortress boss slot
```

**Immediate low-risk wins:** Wire CRABTRON hero + Wire Flagship to EMPERADOR.
**Medium-term:** Imperial enemy type + Mini-boss encounters.
**Long-term:** Orbital Siege Colossus fortress boss slot.

---

## 8. FORBIDDEN CHANGES CONFIRMED

- [x] No new spawns introduced
- [x] No boss replacements made
- [x] No HP/attack changes
- [x] No rank changes
- [x] No collision changes
- [x] No AI changes
- [x] No balance changes
- [x] No encounter flow changes
- [x] `npm run validate` passes clean
