# HC-SPRITE-COLOSSUS-STAGE15 — ORBITAL SIEGE COLOSSUS INTEGRATION

## Status: COMPLETE

Stage 15 Orbital Colossus hero sprite integrated following the Crabtron/Serpentrix/Flagship validated pipeline. Visual-only — no gameplay, hitbox, collision, AI, movement, attack, balance, timing, rank, or score changes.

---

## Asset Specs

| Property | Old Value | New Value |
|----------|-----------|-----------|
| Sprite ID | `boss_orbital_siege_colossus` | unchanged |
| Source | `orbital_siege_colossus_sheet.png` | `orbital_colossus_hero_sheet.png` |
| Sheet | 1280x320 (4x1, 320x320) | 1536x768 (8x4, 192x192) |
| Frames | 4 | 32 |
| Frame size | 320x320 | 192x192 |

### Runtime Path

```
www/assets/sprites/bosses/orbital_siege/orbital_colossus_hero_sheet.png
```

Copied from repo root `orbital_colossus_hero_sheet.png`.

---

## Frame / State Mapping

| Row | Frames | State | HP Threshold |
|-----|--------|-------|-------------|
| 0 | 0–7 | `master` | > 66% |
| 1 | 8–15 | `damaged` | 33%–66% |
| 2 | 16–23 | `core_exposed` | < 33% |
| 3 | 24–31 | `weapon_open` | superweapon deploy |

Each row has 8 animation frames for smooth reactor pulse/glow cycles.

---

## File Changes

### `www/sprite-system.js` (lines 681-727)

- Updated `_ORBITAL_SIEGE_COLOSSUS_META`: `sheetCols: 8`, `sheetRows: 4`, `frameW: 192`, `frameH: 192`
- Updated `phases` map: `master=0, damaged=8, core_exposed=16, weapon_open=24`
- Updated `recommendedGameplaySize`: `192x192`
- Updated `pivot`: `{ x: 96, y: 96 }`
- Updated `registerSprite` src to `orbital_colossus_hero_sheet.png`
- Updated animations: 4 named anims (idle, damaged, coreExposed, weaponOpen), 8 frames each, 6fps

### `www/draw.js`

| Line | Change |
|------|--------|
| 4392 | Added `_colossusReady` readiness check |
| 4417 | Gated `drawOrbitalEnergyField`, `drawOrbitalRingArcs`, `drawOrbitalPulseWarning`, `drawOrbitalTractorBeamIndicator` |
| 4542-4544 | Wired `drawOrbitalSiegeColossusVisual(ctx, boss)` call |
| 4557 | Added `!_colossusReady` to body sprite gate |
| 4560 | Added `!_colossusReady` to core pulse gate |
| 4576 | Gated `drawOrbitalCore` |
| 4591 | Added `!_colossusReady` to ambient glow gate |
| 4621 | Added `!_colossusReady` to flash/hit FX gate |
| 5037 | Updated `getColossusStateFrame` fallback: `idx * 8` for 8-column grid |

---

## Kill Switch

| Config Path | Default | Effect when `false` |
|---|---|---|
| `GALAXY_CONFIG.spriteLab.orbitalSiegeColossus` | `true` | Full legacy geometric renderer restored |

Already existed — unchanged. Reads every frame via `isColossusVisualEnabled()`.

---

## Legacy Gates

When colossus ready (`_colossusReady === true`):

| Legacy Function | Gated |
|----------------|-------|
| `drawOrbitalEnergyField` | ✓ |
| `drawOrbitalRingArcs` | ✓ |
| `drawOrbitalPulseWarning` | ✓ |
| `drawOrbitalTractorBeamIndicator` | ✓ |
| `drawOrbitalCore` | ✓ |
| `drawBossSpriteOrLegacy` (body) | ✓ (compound) |
| Core pulse | ✓ (compound) |
| Ambient glow | ✓ (compound) |
| Flash/hit FX sprite | ✓ (compound) |

### Always Preserved

- `drawOrbitalSignatureRingTelegraph` (critical telegraph)
- `drawBossHardcoreTelegraph` (all patterns)
- All bullet/projectile rendering
- Crosshair flash overlay
- HUD elements

---

## Readiness Logic

```javascript
_colossusReady = (
    boss.pattern === 'rotate'
    && SpriteSystem.isSpriteReady('boss_orbital_siege_colossus')
    && isColossusVisualEnabled()     // reads spriteLab.orbitalSiegeColossus
);
```

All 3 conditions must be `true`. If sprite file is missing, `isSpriteReady()` returns `false` and fallback activates automatically.

---

## Render Scale

| Parameter | Value |
|---|---|
| Frame | 192x192 |
| scaleHint | 0.75 |
| Boss hitbox | 90x45 |
| Rendered size | ~67px (fills hitbox width) |
| Behavior | Extends above/below hitbox (square sprite on rectangular hitbox) |

Matches Crabtron/Serpentrix/Flagship pattern — sprite fits within hitbox width, overflows height for visual dominance.

---

## Validation

| Check | Result |
|---|---|
| `npm run validate` (syntax) | PASS |
| Cross-reference audit | PASS |
| Asset exists at runtime path | PASS |
| Kill switch path | PASS |
| Telegraph preservation | PASS |
| Gameplay files | Only `sprite-system.js` and `draw.js` changed (visual/render only) |

---

## Browser Smoke Test Steps

1. Open Galaxy Raiders in Chrome
2. Reach or spawn Stage 15 (ORBITAL, `rotate` pattern boss)
3. Confirm: colossus sprite visible, animations cycling
4. Confirm: no clipping, no render errors
5. Confirm: bullets and telegraphs visible
6. Set `spriteLab.orbitalSiegeColossus = false` → legacy renderer restores
7. Confirm: no ReferenceError or TypeError in console
