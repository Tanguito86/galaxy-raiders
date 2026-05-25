# Runtime Visual Integration Roadmap — Galaxy Raiders

**Date:** 2026-05-24
**Phase:** Production Roadmap for Sprite Lab Hierarchy Integration
**Based on:** Runtime Visual Integration Map (2026-05-24)

---

## EXECUTIVE SUMMARY

**8 complete asset packages** exist on disk with full metadata and previews. **Zero** are registered in the runtime sprite system. The integration roadmap proceeds in 5 phases, each building on the previous, with visual-only changes prioritized over gameplay-adjacent changes. Every phase includes a kill-switch strategy and preserves the existing fallback chain intact.

**Total new sprites to register:** 7 sheet entries covering 26 frames across enemy factions, mini-bosses, flagship, and fortress tiers.

---

## PHASE A: Player Integration + Scout Faction

### Goal: Modernize player rendering and establish the Scout faction enemy sheet as the first faction integration proof-of-concept.

### A1 — Player S04 Wedge (Optional)

| Step | File | Action | Risk |
|------|------|--------|------|
| A1a | `sprite-system.js` | Update `player_wedge` registration to use `player_s04_wedge_sheet_2x4.png` (128x128 frames, 2x4 layout) OR register as new ID `player_s04_wedge` | LOW — pure visual |
| A1b | `draw.js` | Create `getS04WedgeFrame()` mapping 8 directional frames from 2x4 grid instead of current 32-frame strip | LOW — visual only |
| A1c | `draw.js` | Switch priority: check `player_s04_wedge` before `player_wedge` in render chain | LOW — fallback preserved |

**Kill switch:** Config flag `useS04WedgeRender: false` → falls back to existing `player_wedge`.

**Note:** This step is OPTIONAL. The existing `player_wedge` (36x44) already works. S04 Wedge integration is a visual upgrade, not a critical fix.

### A2 — Scout Faction Enemy Sheet Registration

| Step | File | Action | Risk |
|------|------|--------|------|
| A2a | `sprite-system.js` | Register `faction_scout` sprite: `src: "assets/sprites/enemies/scout/scout_alien_faction_sheet.png"`, `frameWidth: 128`, `frameHeight: 128`, animations: `idle [0,1,2,3]` | LOW |
| A2b | `draw.js` | Add `HCART_ENEMY_VISUALS` entries for scout faction mapping — assign existing alien types to faction frames | LOW — mapping only |
| A2c | `draw.js` | Add Scout faction visual bounds `{x:?, y:?, width:?, height:?}` for 128x128 frames | LOW |
| A2d | `draw.js` | Add Scout faction readability multiplier (~0.45 for 128px sprites at 64px gameplay target) | LOW |

**Enemy → Faction Frame mapping:**
```
alien1 → faction_scout frame 0 (mk1_master)
alien2 → faction_scout frame 0 (mk1_master)
alien4 → faction_scout frame 1 (elite)
alien5 → faction_scout frame 3 (swarm)
alien_mini → faction_scout frame 3 (swarm)
```

**Kill switch:** Don't add to `HCART_ENEMY_VISUALS` — test with a config flag `useFactionScout: true` that overrides the fleet_scout sprite in `getEnemyAnimatedSpriteId()`.

### A3 — Enemy Dimension Safe Adaptation

| Step | File | Action | Risk |
|------|------|--------|------|
| A3a | `draw.js` | In `drawEnemySpriteOrLegacy`, when faction sprite is used, derive visual dimensions from the sprite frame size scaled by readability mult — don't change `e.w`/`e.h` (those remain collision boxes) | SAFE — no collision change |

**Critical rule:** NEVER change `e.w` or `e.h` in `entities.js`. Those are collision boxes. Visual scale is independent.

### Phase A Validation
- [ ] Scout faction enemies render at 64px gameplay scale
- [ ] Existing fleet_scout fallback still works when flag off
- [ ] Legacy pixel matrix fallback intact
- [ ] Enemy hitboxes unchanged
- [ ] No balance/HP/pattern changes

---

## PHASE B: Suppressor, Splitter, Imperial Factions

### Goal: Complete the 4-faction enemy sheet integration.

### B1 — Register Remaining 3 Faction Sheets

| Sprite ID | Source | Frames | Animations |
|-----------|--------|--------|------------|
| `faction_suppressor` | `enemies/suppressor/suppressor_alien_faction_sheet.png` | 4×128x128 | idle [0,1,2,3] |
| `faction_splitter` | `enemies/splitter/splitter_alien_faction_sheet.png` | 4×128x128 | idle [0,1,2,3] |
| `faction_imperial` | `enemies/imperial/imperial_alien_faction_sheet.png` | 4×128x128 | idle [0,1,2,3] |

### B2 — Map Enemy Types to Faction Frames

**Suppressor faction:**
```
alien3 → faction_suppressor frame 0 (mk1_master)
alien3 (heavy) → faction_suppressor frame 1 (elite)
alien3 (bigShot) → faction_suppressor frame 3 (artillery)
```

**Splitter faction:**
```
alien6 → faction_splitter frame 0 (mk1_master)
alien6 (splits) → faction_splitter frame 2 (shard)
alien6 (heavy) → faction_splitter frame 3 (aberration)
```

**Imperial faction (new enemy type needed or remap existing):**
```
alien4 → faction_imperial frame 0 (mk1_master)  [temporary]
alien5 → faction_imperial frame 2 (lancer)       [temporary]
```

### B3 — Per-Faction Visual Config

| Faction | Gameplay Target Size | Recommended Scale Mult | Notes |
|---------|---------------------|----------------------|-------|
| Scout | 64x64 | 0.50 | Lightweight, agile |
| Suppressor | 64x64 | 0.50 | Heavy, wide |
| Splitter | 64x64 | 0.50 | Chaotic, angular |
| Imperial | 64x64 | 0.50 | Disciplined, geometric |

All 128x128 frames downscaled to 64px gameplay. Scale = `64 / 128 = 0.50` → apply readability mult as needed.

### Phase B Validation
- [ ] All 4 factions render with distinct silhouettes
- [ ] Faction color mapping preserved (scout=cyan, suppressor=red-orange, splitter=white/pink, imperial=gold-white)
- [ ] Fleet sprites remain available as fallback
- [ ] No gameplay changes

---

## PHASE C: Mini-Boss Hierarchy

### Goal: Register the 4 mini-bosses and wire them for encounter-director spawning.

### C1 — Register Mini-Boss Sprite

| Step | File | Action |
|------|------|--------|
| C1a | `sprite-system.js` | Register `miniboss_hierarchy`: `src: "assets/sprites/bosses/miniboss_hierarchy_sheet.png"`, `frameWidth: 192`, `frameHeight: 192`, 4 frames |
| C1b | `draw.js` | Add `_BOSS_SPRITE_ID_MAP` entries or new mini-boss render section |

### C2 — Mini-Boss Frame Mapping

| Frame | Boss ID | Faction |
|-------|---------|---------|
| 0 | `scout_hive_leader` | Scout |
| 1 | `suppressor_siege_core` | Suppressor |
| 2 | `splitter_aberrant_node` | Splitter |
| 3 | `imperial_command_lancer` | Imperial |

### C3 — Mini-Boss Philosophy

Mini-bosses are **standalone encounters** deployed by the encounter director. They are NOT boss-bosses (level 5/10/15/19/20) — they are mid-level threats that appear between standard waves. This means:

- **Do NOT add to `BOSS_DATA`** — that's for level-based bosses.
- **Do NOT add to `BOSS_LEVELS`** — mini-bosses don't have dedicated levels.
- **Do NOT modify `initBoss()`** — mini-bosses use a separate spawn path.
- **Render path:** Create a `drawMinibossSpriteOrLegacy()` function in draw.js that follows the same pattern as `drawBossSpriteOrLegacy()` but with mini-boss-specific sprite resolution and scale.

### C4 — Recommended Boss Dimensions

| Boss | Recommended `boss.w` × `boss.h` | Scale (192px → gameplay) |
|------|-------------------------------|--------------------------|
| Scout Hive Leader | 128 × 128 | ~0.67 |
| Suppressor Siege Core | 128 × 128 | ~0.67 |
| Splitter Aberrant Node | 128 × 128 | ~0.67 |
| Imperial Command Lancer | 128 × 128 | ~0.67 |

### Phase C Validation
- [ ] Mini-boss sprites render at 128px gameplay scale
- [ ] No changes to existing boss init/HP/patterns
- [ ] No changes to `BOSS_DATA` or `BOSS_LEVELS`
- [ ] Fallback to procedural rendering if sprite unavailable

---

## PHASE D: Imperial Flagship Command

### Goal: Register the 256x256 Imperial Flagship as a boss-tier asset.

### D1 — Register Flagship Sprite

| Step | File | Action |
|------|------|--------|
| D1a | `sprite-system.js` | Register `imperial_flagship_command`: `src: "assets/sprites/bosses/imperial_flagship/imperial_flagship_command_sheet.png"`, `frameWidth: 256`, `frameHeight: 256`, 3 frames |
| D1b | `draw.js` | Add `_BOSS_SPRITE_ID_MAP` entry for Imperial Flagship pattern (when assigned) |
| D1c | `metadata/imperial_flagship_command.json` | Read phase mapping at runtime for frame selection based on boss HP |

### D2 — Phase Frame Selection

| HP Range | Frame | State |
|----------|-------|-------|
| 100%-66% | 0 | master (full armor) |
| 66%-33% | 1 | damaged |
| 33%-0% | 2 | core_exposed |

### D3 — Integration Strategy

The Imperial Flagship Command can serve as either:
- A direct **visual replacement for Emperador** (same boss slot, new visuals)
- A **new boss entry** in `BOSS_DATA` (requires gameplay design)

**Recommended:** First integrate as a visual-only replacement for Emperador at level 20. The Emperador gameplay (supreme pattern, 450 HP, phase logic, signature hooks) remains unchanged — only the visual sprite swaps. This is the lowest-risk integration path.

**Scale:** 256px master → `boss.w = 160, boss.h = 160` gameplay → scale = `min(160/256, 160/256) = 0.625`. With readability mult 1.45 → `0.625 × 1.45 = 0.906` — large and authoritative.

### Phase D Validation
- [ ] Flagship renders with correct phase frame based on HP
- [ ] Emperador gameplay unchanged (if replacing)
- [ ] Phase transitions are smooth
- [ ] Fallback to legacy `boss_emperador` if flagship sprite unavailable

---

## PHASE E: Orbital Siege Fortress

### Goal: Register the 320x320 Orbital Siege Colossus as the ultimate fortress-tier boss asset.

### E1 — Register Fortress Sprite

| Step | File | Action |
|------|------|--------|
| E1a | `sprite-system.js` | Register `orbital_siege_colossus`: `src: "assets/sprites/bosses/orbital_siege/orbital_siege_colossus_sheet.png"`, `frameWidth: 320`, `frameHeight: 320`, 4 frames |
| E1b | `draw.js` | Create dedicated fortress render section for the ring-geometry Colossus |

### E2 — Phase + Superweapon Frame Selection

| Condition | Frame | State |
|-----------|-------|-------|
| 100%-66% HP, weapon inactive | 0 | master |
| 66%-33% HP, weapon inactive | 1 | damaged |
| 33%-0% HP, weapon inactive | 2 | core_exposed |
| Any HP, superweapon active | 3 | weapon_open |

Frame 3 (weapon_open) is triggered independently of HP — it's a special combat state.

### E3 — Integration Strategy

The Orbital Siege Colossus can serve as:
- A **visual replacement for the existing Orbital boss** at level 15 (rotate pattern)
- A **new fortress-tier encounter** requiring dedicated level design

**Recommended:** First as visual replacement for Orbital boss at level 15. The Orbital gameplay (rotate pattern, 210 HP, satellite mechanics) remains unchanged — only the visual sprite. The ring geometry of the Colossus naturally complements the orbital/rotate pattern.

**Scale:** 320px master → `boss.w = 200, boss.h = 200` gameplay → scale = `200/320 = 0.625`. Catastrophic screen presence.

### Phase E Validation
- [ ] Fortress renders with 4-state phase system
- [ ] Weapon_open state toggles independently of HP phase
- [ ] Ring geometry readable at gameplay scale
- [ ] Orbital gameplay unchanged (if replacing)

---

## KILL-SWITCH STRATEGY

### Global Kill Switch

```js
// In game-config.js or hardcore-config.js:
spriteLab: {
  enabled: true,                    // master kill switch
  factions: {
    scout: true,
    suppressor: true,
    splitter: true,
    imperial: true
  },
  miniBosses: true,
  flagship: true,
  fortress: true
}
```

### Per-Phase Kill Switches

| Phase | Kill Flag | Fallback Behavior |
|-------|-----------|-------------------|
| A | `spriteLab.factions.scout === false` | Uses fleet_scout/fleet_interceptor/fleet_suppressor |
| B | `spriteLab.factions.{name} === false` | Per-faction reversion to fleet sprites |
| C | `spriteLab.miniBosses === false` | Mini-bosses not spawned (or use procedural fallback) |
| D | `spriteLab.flagship === false` | Uses legacy boss_emperador sprite |
| E | `spriteLab.fortress === false` | Uses legacy boss_orbital sprite |

### Emergency Kill Switch

```js
spriteLab.enabled === false  // Reverts ALL sprite lab assets, full legacy rendering
```

---

## SPRITE-SYSTEM IMPROVEMENTS

### Recommended additions to `sprite-system.js`:

1. **Metadata loading hook:** Allow sprites to reference their metadata JSON for auto-configuration of frameWidth, frameHeight, animations, and scaleHint.
```js
registerSprite("faction_scout", {
  src: "assets/sprites/enemies/scout/scout_alien_faction_sheet.png",
  meta: "assets/sprites/metadata/scout_alien_faction.json"  // auto-read
});
```

2. **Readability scale from metadata:** Expose `recommendedGameplaySize` from metadata for automatic scale calculation.

3. **Phase frame resolver:** Generic function `getBossPhaseFrame(spriteId, hpPct)` that reads phase metadata and returns the correct frame.

4. **Faction visual config registry:** Centralized faction visual configuration (colors, silhouette shapes, scale parameters) read from faction metadata JSON files.

---

## INTEGRATION ORDER (Safe → Risky)

| Order | Phase | Category | Risk Level |
|-------|-------|----------|------------|
| 1 | A2 | Register Scout faction sheet | SAFE — pure visual swap |
| 2 | B | Register Suppressor, Splitter, Imperial sheets | SAFE — pure visual swap |
| 3 | A3 | Adapt enemy scale for 128px frames | SAFE — visual-scale only |
| 4 | C | Register mini-boss hierarchy | SAFE — new sprite, no existing behavior change |
| 5 | D | Register Imperial Flagship (visual replacement) | MEDIUM — replaces existing boss visual, preserves gameplay |
| 6 | E | Register Orbital Siege (visual replacement) | MEDIUM — replaces existing boss visual, preserves gameplay |
| 7 | C2 | Wire mini-bosses to encounter director | RISKY — new entity types, requires spawn/despawn logic |
| 8 | D2 | New flagship boss entry in BOSS_DATA | RISKY — level progression change |
| 9 | A1 | S04 Wedge player upgrade | LOW — optional visual upgrade, no gameplay |

---

## VALIDATION CHECKLIST

- [ ] All 8 asset packages registered in `sprite-system.js`
- [ ] All 4 factions render as enemies at ~64px gameplay scale
- [ ] All 4 mini-bosses render at ~128px gameplay scale
- [ ] Imperial Flagship renders at ~160px with 3-phase HP tracking
- [ ] Orbital Siege Colossus renders at ~200px with 4-state system
- [ ] Global kill switch reverts to legacy rendering
- [ ] Per-phase kill switches work independently
- [ ] No legacy enemy sprites deleted
- [ ] No legacy boss sprites deleted
- [ ] No gameplay, hitbox, AI, or balance files modified
- [ ] Fallback chains intact for all asset tiers

---

*Generated by runtime visual integration roadmap — no gameplay modifications performed.*
