# HC-WC-05 — Entry Choreography & Formation Silhouette

> **Sprint**: HC-WC-05  
> **Date**: 2026-05-20  
> **Status**: Implemented  
> **Depends on**: HC-WC-03 (runtime), HC-WC-04 (profiles)

---

## 1. ARCHITECTURE

| File | Role |
|------|------|
| `www/hc-wc-choreography.js` | Entry staging, silhouette rendering, reveal timing |
| `www/entities.js` | `initChoreography()` call at end of `initEnemies()` |
| `www/update-enemies.js` | `updateChoreography(dt)` call after composer update |
| `www/draw.js` | `drawFormationSilhouette(ctx)` call before enemy rendering |
| `www/index.html` | Script after `hc-wc-profiles.js`, before `hc-pattern-debug.js` |

### 1.1 Flow

```
initEnemies()
  ├── initEnemiesFromProfile() → creates enemies at target positions
  ├── initWaveComposer()       → phase system
  └── initChoreography()       → moves enemies to off-screen starts
       ├── _applyEntryToEnemies()    → sets _choreoStartX/Y per enemy
       ├── _computeSilhouetteLines() → pre-computes line geometry
       └── entryPhase = 'pending'

updateEnemiesAndProjectiles(dt)
  ├── updateEncounterDirector(dt)
  ├── updateWaveComposer(dt)
  └── updateChoreography(dt)
       ├── _animateEntries(dt)       → interpolate enemies to target
       ├── _computeSilhouetteLines() → refresh line positions
       └── phase check: 'intro'→entering, post-intro→complete

draw()
  └── PRIORITY_ENEMY block
       ├── drawFormationSilhouette(ctx) → grid lines + lane markers
       └── draw each enemy normally
```

---

## 2. ENTRY STYLES — 9 Types

| Style | Duration | Direction | Visual |
|-------|----------|-----------|--------|
| `slide_in` | 1200ms | top | Enemies descend from above to grid position |
| `fade_in` | 800ms | position | Enemies materialize in-place (alpha 0→1) |
| `burst_in` | 500ms | random_edge | Rapid entry from random screen edges |
| `pincer_entry` | 1800ms | both_edges | Two wings converge from left/right |
| `diagonal_entry` | 1500ms | diagonal_corners | From top corners along diagonal paths |
| `spiral_entry` | 2000ms | spiral_inward | Spiral inward from perimeter |
| `delayed_reveal` | 1000ms | position | Row-by-row reveal at position |
| `ambush_entry` | 400ms | random | Sudden appearance, minimal telegraph |
| `wall_drop` | 1600ms | top_rows_first | Rows drop sequentially |
| `split_reveal` | 1400ms | split_from_center | Split outward from screen center |

---

## 3. FORMATION SILHOUETTES — 14 Types

| Key | Identity | Line Style | Used By |
|-----|----------|-----------|---------|
| `classic_grid` | standard_engagement | grid | FND_staggered_entry, FND_dual_role |
| `sparse_line` | recovery_breather | horizontal_lines | FND_recovery_breather |
| `vshape` | pressure_from_above | V | FND_formation_reading |
| `pincer` | flank_threat | open_V | TAC_pincer |
| `three_columns` | rotating_pressure | vertical_columns | TAC_rotating_pressure, SET_splitter_storm |
| `column_asymmetric` | lane_denial | heavy_right | TAC_lane_denial |
| `fortress` | defensive_breach | horizontal_stripes | SET_fortress_breach, SET_imperial_guard |
| `edge_columns` | crossfire_trap | two_edges | TAC_crossfire_trap |
| `scatter` | ambush_hunt | dots | TAC_bait_punish, SET_kamikaze_rush |
| `horizontal_line` | sniper_row | horizontal_stripe | TAC_sniper_denial |
| `center_anchors` | fortress_center | center_cross | TAC_swarm_anchor |
| `closing_gates` | collapsing_lane | converging_walls | ADV_collapsing_lane |
| `cross_rotating` | rotating_crossfire | cross | ADV_rotating_crossfire |
| `parallel_walls` | survival_corridor | parallel_vertical | ADV_survival_corridor |
| `loose_arc` | prelude_tension | arc | SET_boss_prelude |

---

## 4. VISUAL PROPERTIES

### 4.1 Silhouette Rendering

- **When**: Only during INTRO phase (and entry animation)
- **Color**: Subtle, dark (`#334466` to `#884422` range)
- **Alpha**: 0.12–0.25 (never competes with gameplay)
- **Line**: 1px, connecting enemy centers
- **Escape lanes**: Dashed green lines (`#22aa44`, alpha 0.06), 4px dash pattern

### 4.2 Entry Animation

- Enemies start at `_choreoStartX/Y` (off-screen)
- Move to `_choreoTargetX/Y` (formation position)
- Staggered by row × `staggerPerRow` + col × `staggerPerCol`
- `fade_in`/`delayed_reveal`: enemies at position, alpha 0→1
- All entries complete within `entryTotalDuration`

### 4.3 Post-INTRO

- All enemies snapped to target position
- Silhouette lines stop rendering
- Normal combat commences

---

## 5. PUBLIC API

| Function | Description |
|----------|-------------|
| `initChoreography()` | Initialize entry animation and silhouette |
| `updateChoreography(dt)` | Drive entry animation per frame |
| `drawFormationSilhouette(ctx)` | Render formation lines + escape lanes |
| `getChoreographyState()` | Full choreography state snapshot |
| `getChoreographySilhouette()` | Current silhouette key |
| `getChoreographyEntryStyle()` | Current entry style key |
| `isChoreographyActive()` | Whether choreography is running |
| `isRoleRevealed(role)` | Whether a role has been revealed |
| `revealRole(role)` | Mark a role as revealed |
| `getRevealProgress(role)` | 0→1 progress for role reveal |

---

## 6. VISUAL PRIORITIES

1. **Readability** — Silhouette lines are subtle, never compete with bullets
2. **Silhouette** — Clear formation shape before first shot
3. **Anticipation** — Player sees what's coming, where lanes are
4. **Identity** — Each formation communicates tactical intent
5. **Clarity** — No visual clutter during INTRO

---

## 7. COMPATIBILITY

| System | Status |
|--------|--------|
| Wave Composer (HC-WC-03) | Choreography only active during INTRO. Composer gates patterns during INTRO anyway. |
| Profiles (HC-WC-04) | Reads `entryStyle`, `formationKey`, `escapeLanes` from active profile. |
| Encounter Director | Unaffected. Enemies still register spawn normally. |
| HC-PD | Silhouette rendering in PRIORITY_ENEMY layer. No new bullets/spawns. |
| HC-HB | No hitbox changes. Enemies have same collision. |
| HC-RD | Silhouette lines are at ENEMY priority, low alpha. Never obscure threats. |
| Boss fights | Skipped. `initChoreography` checks `_hcWcActiveProfile`. |
| Set pieces | Works with existing setpiece entry system. Profile-based entries replace the old `entryTargetX/Y` for normal waves. |

---

*End of HC-WC-05 Documentation*
