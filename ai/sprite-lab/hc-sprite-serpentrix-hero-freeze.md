# HC-SPRITE-SERPENTRIX-03 — HERO FREEZE DOCUMENT

## Integration Summary

Serpentrix Hero layered sprite system integrated following the Crabtron Hero (HC-VS-03D3) + Imperial Flagship (HC-SPRITE-WIRE-02) validated pipeline. Visual-only change — no gameplay, hitbox, collision, AI, movement, attack, balance, or timing modifications.

## Asset

| Property | Value |
|----------|-------|
| Sprite ID | `boss_serpentrix_hero` |
| Source | `www/assets/sprites/bosses/serpentrix/serpentrix_hero_sheet.png` |
| Sheet dimensions | 8 cols x 5 rows |
| Frame size | 192x192 |
| Total frames | 40 |
| Fallback color | `#35ff9a` |

## States (Rows)

| Row | State | Trigger |
|-----|-------|---------|
| 0 | `idle_coil` | Default / passive |
| 1 | `attack_windup` | Taking damage (`boss.flashTimer > 0`) or telegraph active |
| 2 | `venom_charge` | Pre-shoot charge (`boss.shootTimer > shootRate * 0.7`) |
| 3 | `rage_phase` | Phase 3 (`boss.phase === 3`) |
| 4 | `death_collapse` | Boss dead (`!boss.active` + death timer active) |

## Layers (Cols, Draw Order Back-to-Front)

1. `shadow`
2. `tail_coils`
3. `body`
4. `scales_armor`
5. `head`
6. `fangs_venom`
7. `eyes_glow`
8. `overlay_damage`

## Kill Switch

- Config path: `GALAXY_CONFIG.spriteLab.serpentrixHero`
- Default: `true`
- `false` → full legacy geometric renderer fallback

## Legacy Gates

When hero is ready (`_serpentrixHeroReady === true`), the following legacy functions are suppressed:

| Legacy Function | Gate Condition |
|----------------|----------------|
| `drawSerpentrixAura` | `!_serpentrixHeroReady` |
| `drawSerpentrixWave` | `!_serpentrixHeroReady` |
| `drawSerpentrixEyes` | `!_serpentrixHeroReady` |
| `drawSerpentrixFangs` | `!_serpentrixHeroReady` |
| `drawSerpentrixVenomDrops` | `!_serpentrixHeroReady` |
| `drawBossSpriteOrLegacy` (body) | `!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady` |
| Core pulse | `!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady` |
| Ambient glow | `!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady` |
| Flash/hit FX sprite | `!_crabtronHeroReady && !_imperialFlagshipReady && !_serpentrixHeroReady` |

## Always Preserved (Never Gated)

- `drawSerpentrixSignatureTrapTelegraph` (critical telegraph)
- `drawBossHardcoreTelegraph` (all patterns)
- All bullet/projectile rendering (unaffected)
- Crosshair flash overlay (always visible)

## File Changes

| File | Changes |
|------|---------|
| `www/sprite-system.js` | Added `_SERPENTRIX_HERO_META`, `getSerpentrixHeroMeta()`, `getSerpentrixHeroFrame()`, `registerSprite("boss_serpentrix_hero", ...)` |
| `www/game-config.js` | Added `spriteLab.serpentrixHero: true` kill switch |
| `www/draw.js` | Added `resolveSerpentrixHeroState()`, `drawSerpentrixHeroLayers()`, `_serpentrixHeroReady`, `isSerpentrixHeroEnabled()`, gated 5 legacy Serpentrix functions, added compound gate conditions |

## Validation

- `npm run validate` — PASS (May 25 2026)
- Syntax check: all JS files pass `node --check`
- No missing globals, no undefined references

## Rollback

Set `GALAXY_CONFIG.spriteLab.serpentrixHero = false` to disable all hero sprite rendering and revert to 100% legacy geometric renderer.
