# Runtime Integration Phase A — Player S04 Wedge + Scout Faction

**Date:** 2026-05-24
**Phase:** A — Player S04 Wedge + Scout Alien Faction
**Prior plan:** Commit `a26f588` — Runtime Visual Integration Roadmap
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## Files Modified

| File | Changes | Risk |
|------|---------|------|
| `www/sprite-system.js` | +70 lines — 2 new registrations (player_s04_wedge, faction_scout) | SAFE |
| `www/draw.js` | +45 lines — S04 Wedge draw function, player priority chain, Scout HCART override, visual bounds | SAFE |

**No other files touched.** No gameplay, hitbox, AI, or balance files modified.

---

## Assets Registered

### 1. `player_s04_wedge` — S04 Wedge Player Ship

| Property | Value |
|----------|-------|
| Sprite ID | `player_s04_wedge` |
| Source | `assets/sprites/player/player_s04_wedge_sheet_2x4.png` |
| Frame size | 128×128 |
| Sheet layout | 2 cols × 4 rows (512×256) |
| Frames | idle(0), thrust_01(1), bank_left(2), bank_right(3), boost(4), damage(5), respawn(6), thrust_02(7) |
| Gameplay scale | 0.45 (~58px visual) |
| Fallback color | `#dd3333` |

**Animation state mapping:**
| Gameplay State | Frame | Description |
|----------------|-------|-------------|
| Idle | 0 or 1 (cycling) | Engine flicker |
| Moving left | 2 | Bank left |
| Moving right | 3 | Bank right |
| Moving up/down | 1 (thrust) | Thrust animation |
| Invincible | alternating 5/0 | Damage flash |

### 2. `faction_scout` — Scout Alien Faction Sheet

| Property | Value |
|----------|-------|
| Sprite ID | `faction_scout` |
| Source | `assets/sprites/enemies/scout/scout_alien_faction_sheet.png` |
| Frame size | 128×128 |
| Sheet layout | 4 frames horizontal (512×128) |
| Frames | 0=mk1_master, 1=elite, 2=sniper, 3=swarm |
| Gameplay target | 64×64 (scale ~0.50) |
| Fallback color | `#7cff6b` |

---

## Scale Mappings

### Player

| Visual Size | Hitbox | Notes |
|-------------|--------|-------|
| S04 Wedge: 128px source × 0.45 = **58px** | 33×24 (unchanged) | Larger visual than old wedge (36px), better detail |
| Old wedge: 36px source × 1.0 = **36px** | 33×24 (unchanged) | Falls back if S04 Wedge disabled |

### Scout Faction Enemies

| Enemy Type | Scout Frame | Scale | Visual Size | Gameplay Size Target |
|------------|-------------|-------|-------------|---------------------|
| alien1 (Sweeper) | 0 (mk1_master) | 0.50 | 64px | 64×64 |
| alien2 (Sniper) | 2 (sniper) | 0.50 | 64px | 64×64 |
| alien4 (Suppressor/Interceptor) | 1 (elite) | 0.48 | 61px | 64×64 |
| alien5 (Chaser) | 3 (swarm) | 0.46 | 59px | ~60×60 |
| alien_mini (Baiter) | 3 (swarm) | 0.42 | 54px | ~54×54 |

**Collision boxes are unchanged.** `e.w` and `e.h` remain derived from legacy pixel matrices. The visual scale is independent — the faction sprite renders at the target size regardless of the underlying collision box.

---

## Fallback Behavior

### Player Fallback Chain

```
1. player_s04_wedge (128x128, 2x4 grid)          ← NEW, kill switch: spriteLab.playerS04Wedge
2. player_wedge (36x44, 32-frame strip)            ← EXISTING
3. player_ship_3x3 (32x32, 9-frame grid)           ← EXISTING
4. player (32x32, single frame)                     ← EXISTING
5. player_a / player_b legacy pixel matrices        ← EXISTING
```

### Enemy Fallback Chain (Scout-Aligned Types)

```
1. faction_scout (128x128, 4-frame sheet)           ← NEW, kill switch: spriteLab.factionScout
2. fleet_scout (16x16, HC-ART)                      ← EXISTING
3. alien1_strip / alien2_strip (32x32, animated)    ← EXISTING
4. alien1 / alien2 (32x32, single frame)            ← EXISTING
5. alien1_a / alien2_a legacy pixel matrices        ← EXISTING
```

---

## Kill Switches

### Global

```js
// In game-config.js or hardcore-config.js:
spriteLab: {
  playerS04Wedge: true,     // false = fall back to player_wedge
  factionScout: true        // false = fall back to fleet_scout
}
```

Setting either to `false` disables the Phase A integration at runtime. The fallback chain reverts seamlessly — no assets are deleted, no gameplay is affected.

### Current Default

Both flags default to **enabled** (`true`). The integration checks `=== false` — if the config property is absent, the integration activates. This means Phase A is ON by default with no config changes needed.

---

## Validation Results

| Test | Result |
|------|--------|
| `node --check www/sprite-system.js` | PASS |
| `node --check www/draw.js` | PASS |
| `node scripts/validate-galaxy.js` | PASS (`Validacion JS OK`) |
| No enemy AI files modified | CONFIRMED |
| No enemy movement modified | CONFIRMED |
| No enemy spawn logic modified | CONFIRMED |
| No collision/hitbox files modified | CONFIRMED |
| No rank/balance files modified | CONFIRMED |
| No boss logic modified | CONFIRMED |
| Legacy fallback chain intact | CONFIRMED |

---

## What Was NOT Changed

- `entities.js` — enemy creation, dimensions, collision boxes
- `enemy-identity.js` — enemy type definitions
- `enemy-factions.js` — faction colors and silhouettes
- `enemy-movement.js` — movement patterns
- `enemy-attacks.js` — attack patterns
- `update-player.js` — player movement, hitbox
- `update.js` — game loop orchestration
- `balance.js` — rank, HP, scoring
- `game-config.js` — all gameplay config (spriteLab config can be added separately if desired)
- `hardcore-config.js` — hardcore mode config
- All boss files — unchanged

---

## Generated Previews

| File | Size | Description |
|------|------|-------------|
| `www/assets/sprites/previews/runtime/runtime_phase_a_player_scout_preview.png` | 1100×620 | Player showcase, faction frames, gameplay-scale combat, fallback comparison |

---

## Recommended Next: Phase B

Suppressor, Splitter, and Imperial faction sheet registrations follow the same pattern as the Scout integration:
1. Register 3 more faction sheets in `sprite-system.js`
2. Add `_SPRITE_LAB_SUPPRESSOR_MAP`, `_SPRITE_LAB_SPLITTER_MAP`, `_SPRITE_LAB_IMPERIAL_MAP` to `draw.js`
3. Update `getHCArtEnemyVisual` to check each faction override in priority order

All three are SAFE — same pattern, same kill-switch mechanism, same fallback preservation.

---

*Generated by Phase A runtime integration — visual-only, no gameplay modifications.*
