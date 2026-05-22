# HC-RK-05 — Rank Feedback & Debug Readability

**Block:** HC-RK  
**Status:** Implemented (debug overlay, flag-gated)  
**Date:** 2026-05-22  
**Dependency:** HC-RK-04 (wiring), HC-RK-03 (caps), HC-RK-02 (sources)

---

## Overview

Debug overlay for the complete Rank system. Shows rank state, performance, sources, governor status, gameplay effects status, telemetry, recent blocks, and recent caps — all in one panel. Flag-gated behind `debug.showRankDebug`.

---

## What Changed

### Files Modified (4)

| File | Change |
|------|--------|
| `www/hardcore-rank.js` | +160 lines: `drawHardcoreRankFullDebug(ctx)` |
| `www/draw.js` | +1 line: wire `drawHardcoreRankFullDebug` into HUD section |
| `www/game-config.js` | +1 line: `showRankDebug: false` in debug section |
| `www/hardcore-config.js` | +3 lines: default + getter |

---

## Debug Overlay Layout

```
┌────────────────────────────────────────┐
│ RANK  L3  VAL 52.3  x1.25              │  ← Rank level, value, multiplier
│                                        │
│ SURVIVING                              │  ← Performance state (color-coded)
│ HITLESS 8.2s  MAX 22.4s               │  ← Hitless duration + best streak
│                                        │
│ ACC 72.5%                              │  ← Accuracy % (green if ≥65%)
│                                        │
│ SOURCES                                │
│ KILLS 18.8   SURV 2.4                  │  ← Rank from kills + survival
│ ACC   1.2    BOSS 13.0                 │  ← Rank from accuracy + boss
│ GRAZE 1.1    WAVESPD 2.5              │  ← Rank from graze + wave speed
│                                        │
│ LOSS: DEATH 8.0  DECAY 1.4            │  ← Rank lost from deaths + decay
│                                        │
│ GAMEPLAY OFF                           │  ← Effects enabled/disabled
│                                        │
│ TELEMETRY                              │
│ BULLET 142 app  3 cap                  │  ← Bullet speed applications/caps
│ CD     18 app   0 cap                  │  ← Cooldown applications/caps
│ PAUSE  7 app    1 cap                  │  ← Wave pause applications/caps
│ BLOCKS 2                               │  ← Governor blocks (red if >0)
│                                        │
│ RECENT BLOCKS                          │
│ player_recovering 3s ago               │  ← Last 5 blocks with timestamps
│ boss_ceiling_exceeded 12s ago          │
│                                        │
│ RECENT CAPS                            │
│ bulletSpeed 5.42→5.20                  │  ← Last 5 caps with values
│ wavePause 540→600                      │
└────────────────────────────────────────┘
```

## Color Coding

| Element | Color | Meaning |
|---------|-------|---------|
| DOMINATING | 🟢 Green | Player is crushing |
| SURVIVING | 🟡 Yellow | Normal play |
| RECOVERING | 🔴 Red | Just got hit |
| GAMEPLAY ON | 🟢 Green | Effects active |
| GAMEPLAY OFF | ⬜ Gray | Effects disabled |
| GOVERNOR APPROVED | 🟢 Green | Safe to apply |
| GOVERNOR BLOCKED | 🔴 Red | Blocked, shows reason |
| BLOCKS > 0 | 🔴 Red | Governor is blocking |
| ACC ≥ 65% | 🟢 Green | Accuracy bonus active |
| ACC < 65% | 🟡 Amber | Below bonus threshold |

## Activating

```js
// In game-config.js:
debug: {
  showRankDebug: true  // default: false
}
```

When `showRankDebug: false` (default): zero performance impact, nothing drawn.

## Safety

- All values read from live state — no computation cost
- Font: 5px "Press Start 2P" — minimal render cost
- Panel: 222×292px, right side, below combo/graze HUD
- All field access is typeof-guarded (handles partial load order)
- Background with alpha 0.65 for readability without blocking game view
- Rendered AFTER all other HUD elements (last in draw order)

## What You Can See

| Question | Answered by |
|----------|-------------|
| "¿Por qué sube el rank?" | SOURCES breakdown |
| "¿Qué quiso aplicar el rank?" | GAMEPLAY ON/OFF + GOVERNOR status |
| "¿Qué se capó?" | RECENT CAPS list |
| "¿Qué bloqueó el governor?" | RECENT BLOCKS list |
| "¿Está protegido el jugador?" | RECOVERING indicator + time left |
| "¿Cuántas veces se aplicaron los efectos?" | TELEMETRY counters |
| "¿Está dominando o sufriendo?" | Performance state + hitless time |
| "¿Su accuracy vale bonus?" | ACC % (color-coded) |

## Validation

```
node --check www/hardcore-rank.js   → OK (1376 lines)
node --check www/draw.js            → OK
node --check www/game-config.js     → OK
node --check www/hardcore-config.js → OK
```

## Existing Overlays (unchanged)

- `drawHardcoreRankDebug` — simple rank display (6 lines, always available with `showRank`)
- `drawHardcoreSystemsDebug` — full systems panel (all HC systems)
- `drawHardcoreRankLevelFeedback` — rank up/down flash text

The new `drawHardcoreRankFullDebug` is the comprehensive Rank-specific debug overlay.
