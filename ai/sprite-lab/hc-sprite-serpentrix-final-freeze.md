# HC-SPRITE-SERPENTRIX-04 — FINAL FREEZE

## Status: HERO PIPELINE COMPLETE

Serpentrix Hero is fully integrated following the Crabtron Hero + Imperial Flagship validated pipeline. This document freezes the integration baseline.

---

## 1. Runtime Chain

```
index.html loads game-config.js → GALAXY_CONFIG.spriteLab.serpentrixHero = true
index.html loads sprite-system.js → registerSprite("boss_serpentrix_hero", ...)
                                    → global.getSerpentrixHeroMeta()
                                    → global.getSerpentrixHeroFrame()
index.html loads draw.js → draw() executes per frame
```

### Per-frame flow (zigzag boss only):

```
_isSerpentrixHeroReady = (
    boss.pattern === 'zigzag'
    && SpriteSystem.isSpriteReady('boss_serpentrix_hero')
    && isSerpentrixHeroEnabled()       // reads GALAXY_CONFIG.spriteLab.serpentrixHero
)

if (_serpentrixHeroReady):
    ┌─ resolveSerpentrixHeroState(boss)  → 'idle_coil' | 'attack_windup' | 'venom_charge' | 'rage_phase' | 'death_collapse'
    └─ drawSerpentrixHeroLayers(ctx, boss, state, scale)
         ├─ shadow         (alpha: 0.26–0.40)
         ├─ tail_coils     (micro-motion per state)
         ├─ body           (alpha: 1.0)
         ├─ scales_armor   (alpha: 1.0)
         ├─ head           (micro-motion per state)
         ├─ fangs_venom    (alpha: 0.65–0.88)
         ├─ eyes_glow      (alpha: pulse per state)
         └─ overlay_damage (alpha: 0.05–0.58)

    GATES (suppressed when hero ready):
    ✗ drawSerpentrixAura
    ✗ drawSerpentrixWave
    ✗ drawSerpentrixEyes
    ✗ drawSerpentrixFangs
    ✗ drawSerpentrixVenomDrops
    ✗ drawBossSpriteOrLegacy (body)
    ✗ Core pulse (legacy)
    ✗ Ambient glow (legacy)
    ✗ Flash/hit FX sprite (legacy)

ALWAYS PRESERVED:
    ✓ drawSerpentrixSignatureTrapTelegraph
    ✓ drawBossHardcoreTelegraph
    ✓ All bullets / projectiles
    ✓ Crosshair flash overlay
    ✓ HUD elements
```

---

## 2. Kill Switch

| Config Path | Default | Effect when `false` |
|---|---|---|
| `GALAXY_CONFIG.spriteLab.serpentrixHero` | `true` | Full legacy geometric renderer restored |

No reload required — the flag is read every frame via `isSerpentrixHeroEnabled()`.

---

## 3. Fallback Chain

```
isSerpentrixHeroEnabled() → false
    OR
SpriteSystem.isSpriteReady('boss_serpentrix_hero') → false
    OR
boss.pattern !== 'zigzag'
    ↓
_serpentrixHeroReady → false
    ↓
All legacy gates open → full geometric rendering active
```

Even with the kill switch `true`, if the sprite file is missing/not loaded, `isSpriteReady()` returns `false` and the fallback activates automatically. No manual intervention needed.

---

## 4. Readiness Logic

| Condition | Check |
|---|---|
| Boss pattern | `boss.pattern === 'zigzag'` |
| Sprite loaded | `window.SpriteSystem.isSpriteReady('boss_serpentrix_hero')` |
| Kill switch | `isSerpentrixHeroEnabled()` → `GALAXY_CONFIG.spriteLab.serpentrixHero !== false` |

All three must be `true` for hero rendering to activate.

---

## 5. Scale Validation

| Parameter | Value |
|---|---|
| Frame size | 192x192 |
| scaleHint | 0.55 |
| Clamp range | [0.38, 0.65] |
| Rendered size | 105.6 x 105.6 px |
| Canvas | 360 x 640 |
| Canvas coverage | 29.3% width |
| Clipping at arena edge | None (2.2px margin at min X) |

Source: `ai/sprite-lab/hc-sprite-serpentrix-scale-audit.md`

---

## 6. State Resolver

| Priority | State | Trigger |
|---|---|---|
| 1 (highest) | `death_collapse` | `!boss.active && boss._deathUntil > globalTime` |
| 2 | `rage_phase` | `boss.phase === 3` |
| 3 | `attack_windup` | `boss.flashTimer > 0` |
| 4 | `venom_charge` | `boss.shootTimer > shootRate * 0.7` |
| 5 | `attack_windup` | `boss._hcTelegraphType && boss._hcTelegraphTimer > 0` |
| 6 (default) | `idle_coil` | None of the above |

---

## 7. Registry

| File | Symbol | Line | Type |
|---|---|---|---|
| `sprite-system.js` | `_SERPENTRIX_HERO_META` | 548 | Metadata object |
| `sprite-system.js` | `getSerpentrixHeroMeta` | 559 | Global getter |
| `sprite-system.js` | `getSerpentrixHeroFrame` | 563 | Frame index resolver |
| `sprite-system.js` | `registerSprite("boss_serpentrix_hero")` | 571 | Sprite registration |
| `game-config.js` | `spriteLab.serpentrixHero` | 165 | Kill switch |
| `draw.js` | `resolveSerpentrixHeroState` | 1382 | State resolver |
| `draw.js` | `drawSerpentrixHeroLayers` | 1537 | Layer draw function |
| `draw.js` | `_serpentrixHeroReady` | 4390 | Readiness check |
| `draw.js` | `isSerpentrixHeroEnabled` | 4884 | Kill switch helper |

---

## 8. Asset

```
www/assets/sprites/bosses/serpentrix/serpentrix_hero_sheet.png
```
- Format: PNG
- Sheet: 1536x960 (8 columns x 5 rows, 192x192 cells)
- 40 frames total
- Fallback color: `#35ff9a`

---

## 9. Cross-Reference Validation

| # | Symbol | Verdict |
|---|---|---|
| 1 | `boss_serpentrix_hero` (sprite ID) | PASS |
| 2 | `isSerpentrixHeroEnabled` (function) | PASS |
| 3 | `resolveSerpentrixHeroState` (function) | PASS |
| 4 | `drawSerpentrixHeroLayers` (function) | PASS |
| 5 | `getSerpentrixHeroMeta` (global) | PASS |
| 6 | `getSerpentrixHeroFrame` (global) | PASS |
| 7 | `_SERPENTRIX_HERO_META` (local) | PASS |
| 8 | `_serpentrixHeroReady` (local) | PASS |
| 9 | `_smallScreenBoost` (scope) | PASS |
| 10 | `serpentrixHero` (kill switch) | PASS |
| 11 | `serpentrix_hero_sheet.png` (asset) | PASS |

**11/11 symbols PASS — 0 ReferenceErrors, 0 TypeErrors, 0 typos, 0 undefined globals.**

---

## 10. Validation

| Check | Result |
|---|---|
| `npm run validate` (syntax) | PASS |
| Cross-reference audit (11 symbols) | PASS |
| Asset file existence | PASS |
| Kill switch path | PASS |
| Scale audit | PASS |
| Telegraph preservation | PASS |

---

## 11. Commit History

```
71aca10 hc-sprite-serpentrix-03-full-hero-pipeline
c9cf892 hc-sprite-serpentrix-scale-audit-01
```

---

## 12. Rollback

Set `GALAXY_CONFIG.spriteLab.serpentrixHero = false` → full legacy geometric renderer restored instantly. No code changes required.

---

## HERO PIPELINE COMPLETE — SERPENTRIX
