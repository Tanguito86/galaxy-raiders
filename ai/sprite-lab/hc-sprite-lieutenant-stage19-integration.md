# HC-SPRITE-LIEUTENANT-19 — TENIENTE HERO INTEGRATION

## Status: COMPLETE

Lieutenant Hero layered sprite system for Stage 19 Teniente boss, following the Crabtron/Serpentrix/Colossus validated pipeline. Visual-only — no gameplay, hitbox, collision, AI, movement, attack, balance, timing, rank, or score changes.

---

## Asset

| Property | Value |
|----------|-------|
| Sprite ID | `boss_lieutenant_hero` |
| Source | `assets/sprites/bosses/teniente/imperial_lieutenant_hero_sheet.png` |
| Sheet | 1536x768 (8 cols x 4 rows, 192x192 cells) |
| Frames | 32 |
| Fallback color | `#ffc857` |

---

## Frame / State Mapping

| Row | Frames | State | Trigger |
|-----|--------|-------|---------|
| 0 | 0–7 | `idle` | Default / passive |
| 1 | 8–15 | `damaged` | Taking damage or telegraph active |
| 2 | 16–23 | `overdrive` | Pre-shoot charge |
| 3 | 24–31 | `critical` | Phase 3 or death |

## Layers (Draw Order Back → Front)

1. `shadow`
2. `body`
3. `thrusters_engines`
4. `wings`
5. `cockpit`
6. `cannons_armaments`
7. `lights_glow`
8. `overlay_damage`

---

## State Resolver

| Priority | State | Condition |
|---|---|---|
| 1 | `critical` | `!boss.active && boss._deathUntil > globalTime` |
| 2 | `critical` | `boss.phase === 3` |
| 3 | `damaged` | `boss.flashTimer > 0` |
| 4 | `overdrive` | `boss.shootTimer > shootRate * 0.7` |
| 5 | `damaged` | `boss._hcTelegraphType && boss._hcTelegraphTimer > 0` |
| 6 | `idle` | Default |

---

## Kill Switch

| Path | Default |
|------|---------|
| `GALAXY_CONFIG.spriteLab.lieutenantHero` | `true` |

Set to `false` → full legacy geometric renderer restored.

---

## Legacy Gates

When `_lieutenantHeroReady === true`:

| Legacy Function | Gated |
|----------------|-------|
| `drawTenienteAura` | ✓ |
| `drawTenienteEngineTrails` | ✓ |
| `drawTenienteImpactWarning` | ✓ |
| `drawTenienteWings` | ✓ |
| `drawTenienteCannons` | ✓ |
| `drawTenienteCockpit` | ✓ |
| `drawTenienteLights` | ✓ |
| `drawTenienteCore` | ✓ |
| `drawBossSpriteOrLegacy` (body) | ✓ (compound) |
| Core pulse | ✓ (compound) |
| Ambient glow | ✓ (compound) |
| Flash/hit FX sprite | ✓ (compound) |

### Always Preserved

- `drawTenienteSignatureSweepTelegraph`
- `drawBossHardcoreTelegraph`
- All bullets/projectiles
- Crosshair flash overlay
- HUD

---

## Readiness Logic

```javascript
_lieutenantHeroReady = (
    boss.pattern === 'divebomb'
    && SpriteSystem.isSpriteReady('boss_lieutenant_hero')
    && isLieutenantHeroEnabled()
);
```

---

## File Changes

| File | Change |
|------|--------|
| `www/sprite-system.js:595-627` | Added `_LIEUTENANT_HERO_META`, `getLieutenantHeroMeta()`, `getLieutenantHeroFrame()`, `registerSprite("boss_lieutenant_hero", ...)` |
| `www/game-config.js:167` | Added `lieutenantHero: true` kill switch |
| `www/draw.js:1691-1719` | Added `resolveLieutenantHeroState()` |
| `www/draw.js:1721-1855` | Added `drawLieutenantHeroLayers()` |
| `www/draw.js:4570` | Added `_lieutenantHeroReady` readiness check |
| `www/draw.js:4724-4733` | Wired hero draw call for `divebomb` pattern |
| `www/draw.js:4602-4605` | Gated `drawTenienteAura` + engine trails + impact warning |
| `www/draw.js:4771-4777` | Gated `drawTenienteWings` + cannons + cockpit + lights |
| `www/draw.js:4799` | Gated `drawTenienteCore` |
| `www/draw.js:4750,4753,4787,4818` | 4 compound gates updated |
| `www/draw.js:5103-5108` | Added `isLieutenantHeroEnabled()` |
| `www/assets/sprites/bosses/teniente/imperial_lieutenant_hero_sheet.png` | Copied from repo root |

---

## Validation

| Check | Result |
|---|---|
| `npm run validate` (syntax) | PASS |
| `boss_lieutenant_hero` refs (3/3) | PASS |
| `_lieutenantHeroReady` refs (decl + 7 uses) | PASS |
| `isLieutenantHeroEnabled` refs (decl + 1 call) | PASS |
| Asset at runtime path | PASS |
| Kill switch path | PASS |
| Telegraph preservation | PASS |
| Gameplay files | Only `sprite-system.js`, `game-config.js`, `draw.js` changed |

---

## Browser Smoke Test

1. Open Galaxy Raiders in Chrome
2. Reach Stage 19 (TENIENTE, `divebomb` pattern)
3. Confirm: hero sprite visible, states cycling
4. Confirm: no clipping, no render errors
5. Confirm: bullets, sweep telegraph, HUD readable
6. Set `spriteLab.lieutenantHero = false` → legacy renderer restores
7. Check console: 0 ReferenceError, 0 TypeError
