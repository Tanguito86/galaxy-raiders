# Boss Readability & Mobility — Freeze Doc

**Block**: HC-160 → HC-170
**Status**: Cerrado
**Date**: 2026-05-18

---

## Commits

```
7717e7b HC-170: add 300ms ground telegraph for Orbital tractor beam
a60e80a HC-167: add Emperor teleport destination glow and Orbital pulse warning ring
5dc29ca HC-165: add dash direction arrow (CRABTRON) and impact warning ring (TENIENTE) visual telegraph polishes
42ebfe4 HC-164: add P0 telegraph fixes — Crabtron dash 200ms pre-launch, Teniente charge impact 250ms pre-burst
98a5967 HC-162C: fix reposition Y target snap — reduce from 55% to 30% of arena
94c932f HC-162B: add arena reposition behavior for 4 bosses — periodic smooth drift to lateral/mid targets
af9eb16 HC-162A: add boss arena mobility helpers (getBossArenaBounds, clampBossToArena, moveBossTowardPoint); unify 8 clamp points
2ff1064 HC-161: fix baiter pattern never firing (diving gate); exclude sweeper/flanker from default shooter pool
cafe496 HC-160: assign distinct enemy archetype identities (sweeper/chaser/flanker/baiter) with per-role attack patterns, tactical AI, and visual telegraph
```

---

## Systems Added

### Enemy Archetypes (HC-160/161)
| Role | Enemy Type | Attack | Tactical AI | Telegraph Color |
|------|-----------|--------|-------------|-----------------|
| sweeper | alien1 | 5-bullet wide fan (0.70 rad) | sinusoidal sweep lane | #8df |
| sniper | alien2 | aimed shot at player | hold distance | #4ff |
| diver | alien3 | dive state machine | seek dive window | #f55 |
| suppressor | alien4 | 3-bullet lateral fan | control lane | #bf4 |
| chaser | alien5 | aimed burst + side shots | aggressive pursuit | #f62 |
| flanker | alien6 | 2-bullet crossfire from edges | flank edges | #c8f |
| baiter | alien_mini | 3-bullet erratic spread | bait & dart | #f96 |

### Boss Arena Mobility (HC-162A/B/C)
- `getBossArenaBounds(boss)` — returns `{minX:10, maxX:W-bw-10, minY:40, maxY:H-bh-80}`
- `clampBossToArena(boss)` — safety clamp using arena bounds
- `moveBossTowardPoint(boss, tx, ty, speed, step)` — smooth linear move toward target
- `updateBossArenaReposition(boss, dt, step)` — periodic reposition for 4 bosses (not Supreme)
  - 6-13s idle, then 1.8-3s drift to new position
  - 55% lateral targets, 45% mid zone, Y limited to upper 30% of arena
  - Pauses during dash/charge/retreat/teleport/pulse/counter states

### Boss Telegraphs (HC-164/165/167/170)

| Boss | Telegraph | Trigger | Duration | Visual |
|------|-----------|---------|----------|--------|
| CRABTRON | dash warning | before dash launch | 200ms | orange chevron arrow + flash |
| CRABTRON | dash direction | during dash telegraph | 200ms | arrow pointing toward target |
| TENIENTE | impact warning | on charge arrival | 250ms | dual shrinking rings at impact point |
| ORBITAL | pulse warning | during pulse mode | 1500ms | expanding blue ring |
| ORBITAL | tractor beam | before beam activation | 300ms | vertical dotted column + warning SFX |
| EMPERADOR | teleport dest | during teleport flash | 400-500ms | purple glow at destination |

---

## Files Modified

| File | Systems |
|------|---------|
| `www/update-boss.js` | Arena bounds, reposition, dash telegraph, impact telegraph, beam telegraph, teleport dest |
| `www/draw.js` | Dash arrow, impact ring, pulse ring, teleport glow, beam column, threat colors, debug |
| `www/enemy-identity.js` | 7 role/label mappings |
| `www/enemy-pattern-hooks.js` | Sweeper/chaser/flanker/baiter attack patterns |
| `www/enemy-tactical-ai.js` | 7 tactical AI profiles |
| `www/update-enemies.js` | Fire passes + shooter exclusion |

---

## Hard Constraints Preserved

- `encounter-director.js` — **never touched**
- Boss/enemy HP, damage, hitboxes — **never changed**
- Global config — **never changed**
- Spawn rates, pacing, pressure, relief, silence — **never touched**
- Normal enemy behavior outside hardcore — **unchanged**
- Supreme boss — excluded from arena reposition (teleport-based movement)

---

## Known Limitations (non-critical)

1. Zigzag/Rotate direct-set patterns cause ~10-40px snap when reposition ends. Snap acts as readable "pattern resumed" telegraph.
2. Crossfire dashCooldown frozen during reposition (~20% dash frequency reduction). Reposition replaces the dash opportunity.
3. Baiter tactical AI doesn't run during dives (alien_mini always diving). Baiter identity is carried by zigzag movement + erratic burst.

---

## Remaining P2/P3 Items (unscheduled)

| Priority | Area |
|----------|------|
| P2 | Boss phase 1 pattern differentiation (all 5 bosses use similar aimed spreads) |
| P3 | Serpentrix body segment visuals |
| P3 | Teniente non-hardcore pattern density (too sparse for level 19) |
