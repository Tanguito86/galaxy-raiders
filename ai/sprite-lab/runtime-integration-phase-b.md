# Runtime Integration Phase B — Suppressor + Splitter + Imperial

**Date:** 2026-05-24
**Phase:** B — Faction Visual Registration
**Prior:** Phase A (`34c2d2c`) — Scout + Player
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## Files Modified

| File | Changes | Risk |
|------|---------|------|
| `www/sprite-system.js` | +44 lines — 3 faction registrations | SAFE |
| `www/game-config.js` | +3 lines — 3 kill switches | SAFE |
| `www/draw.js` | +30 lines — 3 faction maps, extended override function, visual bounds | SAFE |

**No other files touched.** No gameplay, hitbox, AI, balance, or boss files modified.

---

## Factions Registered

### faction_suppressor

| Property | Value |
|----------|-------|
| Sprite ID | `faction_suppressor` |
| Source | `enemies/suppressor/suppressor_alien_faction_sheet.png` |
| Frame size | 128×128, 4 frames horizontal |
| Frames | 0=mk1_master, 1=elite, 2=artillery, 3=brute |
| Animation | 4-frame idle, 6 fps |
| Fallback color | `#cc4422` (red-orange) |
| Kill switch | `spriteLab.factionSuppressor` |

**Enemy mapping:**
| Enemy | Frame | Scale | Description |
|-------|-------|-------|-------------|
| `alien3` | 0 (mk1_master) | 0.50 | Diver/Tank — heavily armored suppressor unit |

### faction_splitter

| Property | Value |
|----------|-------|
| Sprite ID | `faction_splitter` |
| Source | `enemies/splitter/splitter_alien_faction_sheet.png` |
| Frame size | 128×128, 4 frames horizontal |
| Frames | 0=mk1_master, 1=elite, 2=shard, 3=aberration |
| Animation | 4-frame idle, 6 fps |
| Fallback color | `#cc44aa` (magenta) |
| Kill switch | `spriteLab.factionSplitter` |

**Enemy mapping:**
| Enemy | Frame | Scale | Description |
|-------|-------|-------|-------------|
| `alien6` | 0 (mk1_master) | 0.50 | Flanker/Splitter — chaotic, angular |

**This is the alien6 fix.** Previously, alien6 rendered as `fleet_suppressor` (red-orange, Suppressor faction). Now it renders as `faction_splitter` (magenta, Splitter faction) — matching its faction identity in `enemy-factions.js`.

### faction_imperial

| Property | Value |
|----------|-------|
| Sprite ID | `faction_imperial` |
| Source | `enemies/imperial/imperial_alien_faction_sheet.png` |
| Frame size | 128×128, 4 frames horizontal |
| Frames | 0=mk1_master, 1=elite, 2=lancer, 3=guardian |
| Animation | 4-frame idle, 6 fps |
| Fallback color | `#d6b85a` (gold-white) |
| Kill switch | `spriteLab.factionImperial` |

**No enemy type mapped.** Imperial has no dedicated enemy spawn type in the current runtime. The sprite is registered and ready for future integration. The override map (`_SPRITE_LAB_IMPERIAL_MAP`) is empty — a future gameplay pass can add Imperial enemy types and map them here without touching sprite registration.

---

## Faction Override Priority

The `getHCArtEnemyVisual()` function now checks factions in this order:

```
1. Scout      (_SPRITE_LAB_SCOUT_MAP)       → alien1, alien2, alien4, alien5, alien_mini
2. Suppressor (_SPRITE_LAB_SUPPRESSOR_MAP)  → alien3
3. Splitter   (_SPRITE_LAB_SPLITTER_MAP)    → alien6
4. Imperial   (_SPRITE_LAB_IMPERIAL_MAP)    → (empty — reserved)
5. HCART      (HCART_ENEMY_VISUALS)         → fleet_scout / fleet_interceptor / fleet_suppressor
```

Priority is strict — an enemy type only matches one faction. No overlap between maps.

---

## Kill Switches

```js
GALAXY_CONFIG.spriteLab = {
    playerS04Wedge: true,    // (Phase A)
    factionScout: true,      // (Phase A)
    factionSuppressor: true, // (Phase B) false → alien3 reverts to fleet_suppressor
    factionSplitter: true,   // (Phase B) false → alien6 reverts to fleet_suppressor (old behavior)
    factionImperial: true    // (Phase B) false → no effect (no enemies mapped yet)
};
```

Each kill switch disables its faction override and the enemy type falls through to the next priority (HCART fleet sprite). Fallback chain from there (strip → static → pixel art) is unchanged.

---

## Visual Bounds

All 4 faction sprites share the same 128×128 frame. Visual bounds for centering:

| Sprite ID | Visual Bounds |
|-----------|---------------|
| `faction_scout` | `{x:16, y:16, w:96, h:96}` |
| `faction_suppressor` | `{x:16, y:16, w:96, h:96}` |
| `faction_splitter` | `{x:16, y:16, w:96, h:96}` |
| `faction_imperial` | `{x:16, y:16, w:96, h:96}` |

16px padding accounts for transparent border in faction sprites. The 96×96 visual core is centered in the 128×128 frame.

---

## Scale Values

| Faction | Scale | Source (128px) | Visual Size |
|---------|-------|----------------|-------------|
| Scout mk1 | 0.50 | × 128 | 64px |
| Scout elite | 0.48 | × 128 | 61px |
| Scout sniper | 0.50 | × 128 | 64px |
| Scout swarm | 0.46 / 0.42 | × 128 | 59px / 54px |
| Suppressor mk1 | 0.50 | × 128 | 64px |
| Splitter mk1 | 0.50 | × 128 | 64px |

All gameplay target sizes are ~60-64px. Collision boxes (e.w/e.h) are unchanged.

---

## Fallback Behavior

For alien3 (suppressor) with kill switch disabled:
```
1. faction_suppressor → kill switch false → SKIP
2. HCART_ENEMY_VISUALS → fleet_suppressor → if ready → renders
3. alien3_strip → if ready → renders
4. alien3 static → if ready → renders
5. alien3_a pixel art → always available → renders
```

For alien6 (splitter) with kill switch disabled:
```
1. faction_splitter → kill switch false → SKIP
2. HCART_ENEMY_VISUALS → fleet_suppressor → renders (old behavior restored)
3. alien6_strip → alien6 → alien6_a → fallback chain
```

---

## Validation Results

| Test | Result |
|------|--------|
| `node --check www/sprite-system.js` | PASS |
| `node --check www/draw.js` | PASS |
| `node --check www/game-config.js` | PASS |
| `node scripts/validate-galaxy.js` | PASS |
| No enemy AI modified | CONFIRMED |
| No enemy movement modified | CONFIRMED |
| No spawn rates modified | CONFIRMED |
| No collision/hitbox modified | CONFIRMED |
| No rank/balance modified | CONFIRMED |
| No boss logic modified | CONFIRMED |
| alien6 now maps to Splitter (magenta) | CONFIRMED |
| alien3 maps to Suppressor (red-orange) | CONFIRMED |
| Imperial registered, no enemy mapped | CONFIRMED |

---

## Imperial Gap Notice

The Imperial faction sprite (`faction_imperial`) is registered and ready — but no enemy types are mapped to it. The current enemy spawn pool has 7 types: alien1-6 (Scout/Suppressor/Splitter) and alien_mini (Scout). Imperial enemies need a dedicated spawn type (e.g., `imperial1`) introduced in a separate gameplay design pass. The `_SPRITE_LAB_IMPERIAL_MAP` is an empty object, ready for future population.

When Imperial enemy types are created, integration requires only:
1. Add entries to `_SPRITE_LAB_IMPERIAL_MAP`
2. Add Imperial type(s) to `ENEMY_TYPES` in state.js
3. Add spawn logic in entities.js or encounter-director.js

No sprite registration changes needed — `faction_imperial` is already loaded.

---

*Generated by Phase B runtime integration — visual-only, no gameplay modifications.*
