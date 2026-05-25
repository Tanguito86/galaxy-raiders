# Runtime Visual Integration Map — Galaxy Raiders

**Date:** 2026-05-24
**Phase:** Runtime Visual Integration Phase 01
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. RUNTIME RENDER OWNERSHIP

### 1.1 Enemy Rendering

| Ownership | Detail |
|-----------|--------|
| **Primary renderer** | `draw.js:4683-4735` — `drawEnemySpriteOrLegacy()` |
| **Sprite mapping** | `draw.js:4561-4569` — `HCART_ENEMY_VISUALS` |
| **Sprite resolution** | `draw.js:4587-4592` — `getEnemyAnimatedSpriteId()` 3-tier priority |
| **Scale calculation** | `draw.js:4643-4666` — readability multipliers + visual bounds |
| **Legacy fallback** | `state.js:333-340` — `drawSprite()` pixel-matrix renderer |
| **Bullet rendering** | `render-entities.js` — procedural, no sprites |
| **Faction visual layer** | `enemy-factions.js:191,257` — `drawFactionSilhouette()`, `drawFactionMarker()` |

### 1.2 Boss Rendering

| Ownership | Detail |
|-----------|--------|
| **Primary renderer** | `draw.js:4085-4107` — `drawBossSpriteOrLegacy()` |
| **Sprite ID map** | `draw.js:4048-4054` — `_BOSS_SPRITE_ID_MAP` (5 entries) |
| **Scale calculation** | `draw.js:4091-4093` — min(w/frameW, h/frameH) × readabilityMult |
| **Crabtron Hero** | `draw.js:4285-4294` — hybrid layered rendering, already integrated |
| **Per-boss FX** | `draw.js:4177-4199`, `4308-4341` — 33 boss-specific draw functions |
| **Legacy fallback** | `state.js` — `SPRITES.boss_*` pixel matrices |

### 1.3 Player Rendering

| Ownership | Detail |
|-----------|--------|
| **Active sprite** | `player_wedge` — 36x44, 32-frame strip at `draw.js:3963` |
| **Fallback 1** | `player_ship_3x3` — 32x32, 9-frame at `draw.js:3982` |
| **Fallback 2** | `player` — 32x32 single frame at `draw.js:3991` |
| **Legacy fallback** | `player_a/player_b` pixel matrices at `draw.js:3908` |
| **S04 Wedge** | 128x128 assets exist on disk — **NOT registered or wired** |

---

## 2. ASSET → RUNTIME MAPPING

### 2.1 Current Active Assets (Registered + Referenced in Code)

| Category | Sprite ID | Source | Frame | Status |
|----------|-----------|--------|-------|--------|
| Player | `player_wedge` | `player/player_wedge_anim_sheet.png` | 36x44 | Active |
| Player | `player_ship_3x3` | `player-ship-3x3.png` | 32x32 | Fallback |
| Enemy HC | `fleet_scout` | `fleet/fleet_scout_sheet.png` | 16x16 | Active |
| Enemy HC | `fleet_interceptor` | `fleet/fleet_interceptor_sheet.png` | 24x24 | Active |
| Enemy HC | `fleet_suppressor` | `fleet/fleet_suppressor_sheet.png` | 28x32 | Active |
| Enemy legacy | `alien1`–`alien6` | `alien1.png`–`alien6.png` | 32x32 | Fallback |
| Enemy strip | `alien1_strip`–`alien6_strip` | `alien1-strip.png`–`alien6-strip.png` | 32x32 | Fallback |
| Boss | `boss_crabtron_hero` | `crabtron-hero-20260523/...` | 192x192 | Active (hybrid) |
| Boss | `boss_crabtron` | `boss_crabtron.png` | 96x96 | Fallback |
| Boss | `boss_serpentrix` | `boss_serpentrix.png` | 96x96 | Active |
| Boss | `boss_orbital` | `boss_orbital.png` | 96x96 | Active |
| Boss | `boss_teniente` | `boss_teniente.png` | 96x96 | Active |
| Boss | `boss_emperador` | `boss_emperador.png` | 128x128 | Active |

### 2.2 Asset Packages ON DISK — NOT Registered in SpriteSystem

| Category | Package | Source Sheet | Frame Size | Frames | Metadata |
|----------|---------|-------------|------------|--------|----------|
| Enemy Faction | Scout Alien | `enemies/scout/scout_alien_faction_sheet.png` | 128x128 | 4 | JSON exists |
| Enemy Faction | Suppressor Alien | `enemies/suppressor/suppressor_alien_faction_sheet.png` | 128x128 | 4 | JSON exists |
| Enemy Faction | Splitter Alien | `enemies/splitter/splitter_alien_faction_sheet.png` | 128x128 | 4 | JSON exists |
| Enemy Faction | Imperial Alien | `enemies/imperial/imperial_alien_faction_sheet.png` | 128x128 | 4 | JSON exists |
| Mini-Boss | Hierarchy | `bosses/miniboss_hierarchy_sheet.png` | 192x192 | 4 | JSON exists |
| Flagship | Imperial Flagship | `bosses/imperial_flagship/imperial_flagship_command_sheet.png` | 256x256 | 3 | JSON exists |
| Fortress | Orbital Siege | `bosses/orbital_siege/orbital_siege_colossus_sheet.png` | 320x320 | 4 | JSON exists |
| Player | S04 Wedge | `player/player_s04_wedge_sheet_2x4.png` | 128x128 | 8 | JSON exists |

**8 complete asset packages on disk, zero runtime references.**

---

## 3. SPRITE-SYSTEM REGISTRATION GAPS

### 3.1 Currently Registered: 24 sprites
### 3.2 Missing Registrations Needed: 8+ sprite entries

| Priority | Sprite ID | Source | Frame WxH | Frames |
|----------|-----------|--------|-----------|--------|
| P1 | `faction_scout` | `enemies/scout/scout_alien_faction_sheet.png` | 128x128 | 4 |
| P1 | `faction_suppressor` | `enemies/suppressor/suppressor_alien_faction_sheet.png` | 128x128 | 4 |
| P1 | `faction_splitter` | `enemies/splitter/splitter_alien_faction_sheet.png` | 128x128 | 4 |
| P1 | `faction_imperial` | `enemies/imperial/imperial_alien_faction_sheet.png` | 128x128 | 4 |
| P2 | `miniboss_hierarchy` | `bosses/miniboss_hierarchy_sheet.png` | 192x192 | 4 |
| P3 | `imperial_flagship_command` | `bosses/imperial_flagship/imperial_flagship_command_sheet.png` | 256x256 | 3 |
| P4 | `orbital_siege_colossus` | `bosses/orbital_siege/orbital_siege_colossus_sheet.png` | 320x320 | 4 |

---

## 4. FALLBACK PATH AUDIT

### Enemy Fallback Chain (existing — works correctly)
```
1. HC Art fleet sprite (fleet_scout/interceptor/suppressor)  ← SpriteSystem
2. Static alien sprite (alien1–alien6)                        ← SpriteSystem
3. Animated strip (alien1_strip–alien6_strip)                 ← SpriteSystem
4. Legacy pixel matrix (alien1_a–alien6_a)                    ← drawSprite()
```

### Boss Fallback Chain (existing — works correctly)
```
1. SpriteSystem boss sprite (boss_crabtron, etc.)             ← SpriteSystem
2. Legacy pixel matrix (boss_crabtron, etc.)                  ← drawSprite()
```

### New Integration Fallback Strategy
```
Faction enemies:
1. New faction sheet (faction_scout, etc.)      ← needs registration
2. Existing HC Art (fleet_scout, etc.)           ← already works
3. Existing static/strip (alien1, etc.)          ← already works
4. Legacy pixel matrix                           ← already works

Mini-bosses:
1. Hierarchy sheet (miniboss_hierarchy)          ← needs registration
2. Legacy pixel matrix                           ← none exists (new entity type)

Flagship/Fortress:
1. New flagship/fortress sheet                    ← needs registration
2. Per-boss legacy FX (draw functions)            ← may need adaptation
3. No pixel matrix fallback exist                 ← create procedural fallback
```

---

## 5. HARDCODED DIMENSION AUDIT

| Location | Value | Impact |
|----------|-------|--------|
| `entities.js:584` | Enemy w/h = legacy bitmap cols/rows × 3 | **Must change** for faction sprites (128px vs 32px legacy) |
| `draw.js:4561-4569` | HCART scale 0.92-1.42 for 16-32px sprites | **Must remap** for 128px faction sprites |
| `draw.js:4643-4650` | Readability mult 1.30-1.55 for 32px sprites | **Must adjust** for 128px sprites (lower multi needed) |
| `draw.js:4668-4681` | Visual bounds in 32px coordinate space | **Must remap** for 128px frame size |
| `entities.js:1155-1167` | Boss w/h by pattern | **Must add** for mini-boss/flagship/fortress patterns |
| `draw.js:4287` | Hero scale 0.45 | Already metadata-driven (0.55) — OK |
| `draw.js:4091-4093` | Boss scale = min(w/frameW, h/frameH) | Formula OK — will auto-scale new bosses |

---

## 6. INTEGRATION BLOCKERS

| Blocker | Severity | Detail |
|---------|----------|--------|
| **Enemy dimension derivation** | HIGH | `entities.js` derives enemy w/h from legacy pixel matrices. New faction sprites need a different dimension source. |
| **HCART scale mapping** | HIGH | `HCART_ENEMY_VISUALS` maps alien types to fleet sprite scales (0.92-1.42 for 16-32px). 128px faction sprites need remapped scales (~0.25-0.35). |
| **Visual bounds remapping** | MEDIUM | `getEnemySpriteVisualBounds` hardcodes pixel offsets for 32px frames. |
| **No mini-boss entity type** | HIGH | `entities.js` has no `createMiniboss`, no midboss spawning, no midboss patterns. |
| **No flagship/fortress boss ID** | HIGH | `BOSS_DATA` and `BOSS_LEVELS` have no entries for new bosses. |
| **Boss pattern mismatch** | MEDIUM | New bosses would need new `boss.pattern` values for the `_BOSS_SPRITE_ID_MAP`. |
| **Per-boss FX functions** | LOW | Legacy boss draw functions (Serpentrix eyes, Teniente wings, etc.) might not fit new boss assets. |
| **player_s04_wedge format mismatch** | LOW | S04 Wedge is 128x128 2x4 layout; runtime uses 36x44 1x32 strip. Frame mapping logic would need rewrite. |

---

## 7. SAFE VS RISKY VS FORBIDDEN CATEGORIES

### SAFE (Pure Visual)

| Change | Scope |
|--------|-------|
| Register new sprites in `sprite-system.js` | Sprite loading only |
| Add new entries to `HCART_ENEMY_VISUALS` | Visual mapping, no gameplay |
| Add new entries to `_BOSS_SPRITE_ID_MAP` | Visual mapping, no gameplay |
| Adjust `_ENEMY_READABILITY_MULT` | Visual scale, no gameplay |
| Add new entries to `getEnemySpriteVisualBounds` | Visual centering |
| Replace `drawBossSpriteOrLegacy` sprite ID | Visual asset swap |
| Add new boss draw section in `draw.js` | Visual rendering |

### RISKY (Gameplay-Coupled Render)

| Change | Scope | Risk |
|--------|-------|------|
| Change `entities.js` enemy dimension calculation | Affects collision box | **HIGH** — requires testing |
| Add `initBoss()` branch for new patterns | Affects boss init | **MEDIUM** — must preserve existing boss logic |
| Add new `BOSS_DATA` entries | Affects level progression | **HIGH** — rank/balance coupling |
| Add new `boss.pattern` values | Affects all pattern-based logic | **HIGH** — many switch statements |
| Replace HC Art enemy mapping wholesale | Affects all enemy visuals | **MEDIUM** — well-tested with reversion fallback |

### FORBIDDEN

| Change | Reason |
|--------|--------|
| Modify `boss.w`, `boss.h` for existing bosses | Hitbox change |
| Modify `BOSS_DATA.baseHp` | Balance change |
| Modify boss pattern functions | Attack pattern change |
| Modify `boss-ai-movement.js` | AI change |
| Modify `boss-director.js` profiles | Timing/behavior change |
| Modify `stage-plans.js` | Wave composition change |
| Modify `rank` or `balance` config | Progression change |

---

*Generated by runtime visual integration audit — no gameplay modifications performed.*
