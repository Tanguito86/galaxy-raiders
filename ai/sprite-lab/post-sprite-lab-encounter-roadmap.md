# POST-SPRITE-LAB — ENCOUNTER VISUAL INTEGRATION ROADMAP

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Roadmap — No Code Changes

---

## Overview

This roadmap bridges completed Sprite Lab runtime visual assets (Phases A-E) into future encounter design. It defines safe phases for wiring registered-but-unused assets, creating new gameplay archetypes, and introducing mini-boss/fortress encounters — all without disturbing the current stable encounter flow.

### Current Integration State

```
PHASE A ✓  S04 Wedge player ship → active
PHASE B ✓  Scout/Suppressor/Splitter factions → active
PHASE C ✓  Mini-boss hierarchy → registered, NOT wired
PHASE D ✓  Imperial Flagship → registered, NOT wired
PHASE E ✓  Orbital Siege Colossus → registered, NOT wired
```

**7/7 enemy types** have active faction sprites.
**5/5 bosses** use single-frame sprites (no phase changes visually).
**0/4 mini-bosses** have spawn types.
**0/1 flagship** is wired to any boss.
**0/1 fortress** has a boss slot.

---

## PHASE A: CURRENT ENEMY VISUAL POLISH (Safe — No New Types)

### Goal
Wire existing registered assets into their matching draw paths with zero gameplay changes.

### Tasks

#### A1. Wire CRABTRON Hero Layered Sprite
- **Asset:** `boss_crabtron_hero` (40-frame layered, 192x192)
- **Target:** Level 5 CRABTRON boss
- **Change:** Call `drawCrabtronHeroLayers()` from CRABTRON draw path in `draw.js`
- **Fallback:** If hero sprite not ready, fall back to existing `boss_crabtron` single-frame + geometric details
- **Files:** `www/draw.js`
- **Risk:** None — `_crabtronHeroReady` check already exists in draw.js

#### A2. Wire Imperial Flagship to EMPERADOR
- **Asset:** `boss_imperial_flagship` (3-phase, 256x256)
- **Target:** Level 20 EMPERADOR boss
- **Change:** Replace legacy EMPERADOR sprite with `drawImperialFlagshipVisual()` in EMPERADOR draw path
- **Phases:** master (HP>66%), damaged (HP>33%), core_exposed (HP≤33%)
- **Fallback:** If flagship not ready, fall back to `boss_emperador` single-frame + geometric details
- **Files:** `www/draw.js`
- **Risk:** Minimal — pure visual swap on existing boss

#### A3. Add Faction Color Tinting to Boss Sprites
- **Change:** Apply faction-based tint colors to existing boss sprites during draw
- **Files:** `www/draw.js`
- **Risk:** None — visual-only

### Validation per Task
- `npm run validate`
- Visual inspection: CRABTRON at level 5, EMPERADOR at level 20
- Check fallback by setting `spriteLab.imperialFlagship: false`

---

## PHASE B: IMPERIAL GAMEPLAY ARCHETYPE (Requires New Enemy Type)

### Goal
Create the first Imperial enemy spawn type so the `faction_imperial` sprite sheet becomes active in encounters.

### Prerequisites
- `faction_imperial` sprite sheet registered in `sprite-system.js` (DONE)
- Imperial faction defined in `enemy-factions.js` (DONE)
- `_SPRITE_LAB_IMPERIAL_MAP` prepared in `draw.js` (DONE)
- Kill switch `spriteLab.factionImperial` exists (DONE)

### Tasks

#### B1. Define Imperial Enemy Type
- **New type:** `alien7` or `alien_imperial`
- **Role:** authority / zone_control / suppression_anchor
- **Faction:** `imperial`
- **Bullet style:** boss-tier accuracy, disciplined patterns
- **Files:** `www/enemy-identity.js`, `www/config.js`

#### B2. Create Imperial AI Behavior
- **Pattern hints:** formation_discipline, area_lockdown
- **Movement:** slow, deliberate, formation-holding
- **Attacks:** aimed bursts, lateral denial lanes
- **Files:** `www/enemy-tactical-ai.js`, `www/enemy-attacks.js`, `www/enemy-movement.js`

#### B3. Wire Imperial Sprite Rendering
- **Map:** `alien7` → `faction_imperial` frame 0 (mk1_master)
- **Update:** `_SPRITE_LAB_IMPERIAL_MAP` in `draw.js`
- **Files:** `www/draw.js`

#### B4. Introduce Imperial into Stage Plans
- **Safe insertion levels:** 16-18 (Imperial-themed stages)
- **Spawn rate:** 1-2 per wave, low density
- **Files:** `www/stage-plans.js`, `www/hc-wave-composer.js`

#### B5. Add Imperial Variants
- **Frame 1:** `imperial_elite` — faster, more aggressive
- **Frame 2:** `imperial_lancer` — charge attack
- **Frame 3:** `imperial_guardian` — heavy, area denial
- **Approach:** Roll out one variant per iteration; validate before adding next

### Validation
- Imperial enemies appear in levels 16-18
- Faction silhouette/marker renders correctly
- Fallback to fleet sprites works when kill switch is off
- `npm run validate`

---

## PHASE C: MINI-BOSS ENCOUNTER PLANNING (New Entity Types Required)

### Goal
Create spawnable mini-boss entity types that use the 4-unit mini-boss hierarchy sprite sheet.

### Prerequisites
- `boss_miniboss_hierarchy` sprite registered (DONE)
- `drawMiniBossVisual()` defined (DONE)
- Kill switches per mini-boss exist (DONE)

### Mini-Boss Profiles

| Unit ID | Faction | Frame | Suggested Boss Level | Suggested Encounter |
|---|---|---|---|---|
| `scout_hive_leader` | scout_alien | 0 | Level 4-5 (pre-CRABTRON) | Hive swarm + leader boss |
| `suppressor_siege_core` | suppressor_alien | 1 | Level 8-9 (mid-game) | Siege anchor + artillery waves |
| `splitter_aberrant_node` | splitter_alien | 2 | Level 13-14 (pre-ORBITAL) | Chaos node + fragment spawns |
| `imperial_command_lancer` | imperial_alien | 3 | Level 16-18 (pre-EMPERADOR) | Command strike + formation waves |

### Tasks

#### C1. Define Mini-Boss Entity Types
- **New types:** `miniboss_scout`, `miniboss_suppressor`, `miniboss_splitter`, `miniboss_imperial`
- **Properties:** Large HP pool, slow movement, distinct attack patterns
- **Files:** `www/config.js`, `www/enemy-identity.js`

#### C2. Wire Mini-Boss Visual Rendering
- **Call:** `drawMiniBossVisual(ctx, unitId, ...)` during mini-boss entity draw
- **Conditions:** Check `isMiniBossVisualEnabled(unitId)` + `isMiniBossSpriteReady()`
- **Fallback:** `drawMiniBossFallback()` renders faction-colored placeholder
- **Files:** `www/draw.js`

#### C3. Create Mini-Boss Attack Patterns
- **Scout Hive Leader:** Swarm pressure, cyan energy bursts
- **Suppressor Siege Core:** Area denial, red-orange siege fire
- **Splitter Aberrant Node:** Fragment spawns, erratic magenta attacks
- **Imperial Command Lancer:** Formation attacks, gold discipline patterns
- **Files:** New `miniboss-patterns.js` or extend `boss-patterns.js`

#### C4. Insert Mini-Bosses into Stage Plans
- **Placement:** 1 mini-boss per faction arc (levels 4-5, 8-10, 13-15, 17-19)
- **Integration:** Mini-boss waves between normal waves and main boss
- **Files:** `www/stage-plans.js`, `www/hc-wave-composer.js`

### Validation
- Each mini-boss renders with correct faction frame
- Kill switches disable individual mini-bosses
- Fallback works when sprite not loaded
- `npm run validate`

---

## PHASE D: FLAGSHIP ENCOUNTER PLANNING (EMPERADOR Enhancement)

### Goal
Fully integrate Imperial Flagship visuals into the EMPERADOR boss fight with phase transitions.

### Prerequisites
- `boss_imperial_flagship` sprite registered (DONE)
- `drawImperialFlagshipVisual()` defined (DONE)
- Phase resolution based on HP (DONE)
- Phase A2 basic wiring (planned above)

### Tasks

#### D1. Wire Phase Transitions to Visual Changes
- **Phase 1 (HP > 66%):** Flagship `master` frame — full armor
- **Phase 2 (HP 33%-66%):** Flagship `damaged` frame — broken panels
- **Phase 3 (HP < 33%):** Flagship `core_exposed` frame — shattered, volatile core
- **Files:** `www/draw.js`

#### D2. Add Phase Transition FX
- Expanding ring flash when crossing phase thresholds
- Phase label text: "FLAGSHIP COMPROMISED" / "CORE BREACH"
- Boss aura color shifts: gold → amber → red-orange
- **Files:** `www/draw.js`

#### D3. Preserve Legacy EMPERADOR Attacks
- All 9 attack patterns (3 per phase) remain unchanged
- Imperial aura, energy mantle, crown halo, emperor core renderers preserved as fallback
- **Files:** no gameplay files touched

### Validation
- Flagship phases change at correct HP thresholds
- Legacy EMPERADOR rendering works when `imperialFlagship: false`
- Phase transition FX don't obscure gameplay
- `npm run validate`

---

## PHASE E: FORTRESS ENCOUNTER PLANNING (New Boss Slot Required)

### Goal
Create a new fortress-tier boss slot for Orbital Siege Colossus, distinct from existing bosses.

### Prerequisites
- `boss_orbital_siege_colossus` sprite registered (DONE)
- `drawOrbitalSiegeColossusVisual()` defined (DONE)
- 4 states: master, damaged, core_exposed, weapon_open (DONE)

### Tasks

#### E1. Define Fortress Boss Pattern
- **New pattern:** `fortress`
- **Archetype:** SIEGE (from boss-director.js taxonomy)
- **Distinct from ORBITAL (rotate):** Fortress is static/immobile, larger HP pool, catastrophic attacks
- **Files:** `www/boss-patterns.js`, `www/boss-director.js`

#### E2. Design Fortress Attack Phases
- **Phase 1 (master):** Ring artillery, concentric bullet waves
- **Phase 2 (damaged):** Fractured ring attacks, wider spreads
- **Phase 3 (core_exposed):** Desperation mode, dense center attacks
- **Special state (weapon_open):** Superweapon activation — screen-filling attack patterns
- **Files:** `www/boss-patterns.js`

#### E3. Wire Fortress Visual Rendering
- **Call:** `drawOrbitalSiegeColossusVisual(ctx, boss, ...)` from fortress boss draw path
- **States:** auto-resolve by HP + manual `weapon_open` trigger during superweapon attacks
- **Files:** `www/draw.js`

#### E4. Insert Fortress into Stage Plan
- **Suggested level:** 25+ (post-game or secret boss)
- **Alternative:** Replace level 15 ORBITAL with Fortress (REJECTED — ORBITAL is canonically level 15)
- **Files:** `www/stage-plans.js`

#### E5. Create Fortress Encounter
- **Encounter design:** Multi-phase siege, arena control, catastrophic superweapon
- **Visual language:** Ring-based donut silhouette, concentric attack patterns
- **Files:** New `fortress-encounter.js` or extend `boss-patterns.js`

### Validation
- Fortress renders with correct state frames
- `weapon_open` triggers during superweapon state
- Ring donut silhouette readable under heavy bullet density
- `npm run validate`

---

## RECOMMENDED EXECUTION ORDER

```
NOW (low-risk, no new types):
  ├── Phase A1: Wire CRABTRON hero sprite     ← ~10 lines in draw.js
  └── Phase A2: Wire Flagship to EMPERADOR     ← ~15 lines in draw.js

NEXT (requires new types):
  ├── Phase B: Imperial enemy archetype         ← new entity + AI + spawn
  └── Phase C: Mini-boss encounters             ← 4 new entity types

LATER (requires new boss slots):
  ├── Phase D: Flagship full integration        ← extends Phase A2
  └── Phase E: Fortress boss slot               ← new boss pattern + encounter
```

---

## FORBIDDEN OPERATIONS (All Phases)

- [x] No premature spawn changes — add types, don't alter existing spawn rates
- [x] No boss replacement until fully validated
- [x] No HP/attack/balance changes without separate design pass
- [x] No rank changes
- [x] No collision changes
- [x] No AI changes to existing enemies
- [x] All new visual paths must have kill switches
- [x] All new visual paths must have safe fallbacks
- [x] `npm run validate` must pass at every step
