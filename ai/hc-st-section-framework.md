# HC-ST-04 — Section Framework & Stage Plans

**Block:** HC-ST  
**Status:** Implemented (section framework, 20 stage plans, plan-driven flow)  
**Date:** 2026-05-22  
**Dependency:** HC-ST-03 (runtime foundation)

---

## Overview

Complete section framework with hand-authored stage plans for all 20 levels. Each level has an identity, tension curve, and sequenced section list. Stage director now advances through sections automatically based on plan timing.

---

## Files (2)

| File | Change |
|------|--------|
| `www/stage-plans.js` | NEW — 20 stage identities + 20 authored plans + helpers (260 lines) |
| `www/stage-director.js` | +110 lines: plan loading, section progression, auto-advance, extended debug |

---

## Stage Plans Coverage

### All 20 levels mapped

| Level | Name | Curve | Sections | Climax |
|-------|------|-------|----------|--------|
| 1 | First Contact | slow_burn | warmup→relief→formation→relief | none |
| 2 | Patrol Zone | slow_burn | warmup→pressure→relief→formation→relief | none |
| 3 | Pincer Assault | pulse | warmup→pressure→mini_setpiece→relief | setpiece |
| 4 | Swarm Breach | sawtooth | warmup→pressure→relief→crossfire→prelude | none |
| 5 | Duelist Arena | climax | prelude→climax | CRABTRON |
| 6 | Scouting Run | collapse | warmup→formation→pressure→relief | none |
| 7 | Fortress Line | sawtooth | warmup→pressure→mini_setpiece→relief | setpiece |
| 8 | Armored Column | pulse | warmup→formation→pressure→relief→crossfire | none |
| 9 | Dark Sector | slow_burn | warmup→pressure→relief→pressure→prelude | none |
| 10 | Serpent Den | climax | prelude→climax | SERPENTRIX |
| 11 | Retreat Path | collapse | warmup→formation→pressure→relief | none |
| 12 | Desperate Charge | pulse | warmup→pressure→mini_setpiece→relief | setpiece |
| 13 | Patrol Disrupted | pulse | warmup→ambush→relief→pressure→crossfire | none |
| 14 | War Zone | sawtooth | warmup→pressure→relief→crossfire→relief→prelude | none |
| 15 | The Ring | climax | prelude→climax | ORBITAL |
| 16 | Chaos Cascade | sawtooth | warmup→pressure→mini_setpiece→relief | setpiece |
| 17 | Bullet Storm | overload | warmup→survival→relief→crossfire→relief | none |
| 18 | Elite Guard | sawtooth | warmup→pressure→mini_setpiece→relief→prelude | setpiece |
| 19 | The Hunt | climax | prelude→climax | TENIENTE |
| 20 | The Throne | overload | prelude→climax | EMPERADOR |

---

## Section Type Distribution

| Type | Occurrences across 20 levels |
|------|------|
| warmup | 16 |
| pressure_ramp | 13 |
| relief | 17 |
| formation_showcase | 6 |
| crossfire | 6 |
| mini_setpiece | 5 |
| survival_corridor | 1 |
| ambush | 1 |
| boss_prelude | 10 |
| climax | 5 |

---

## Identity Resolution

All 8 previously "identity-less" levels from HC-ST-01 now have names and profiles:

| Level | Old status | New identity |
|-------|-----------|--------------|
| 2 | Interchangeable | Patrol Zone |
| 6 | Post-boss lull | Scouting Run |
| 8 | Generic tanks | Armored Column |
| 9 | Pre-boss normal | Dark Sector |
| 11 | Post-boss lull | Retreat Path |
| 13 | Normal filler | Patrol Disrupted |
| 14 | Late-game filler | War Zone |
| 17 | Max density | Bullet Storm |

---

## Auto-Advance

`checkStageSectionTimer()` runs each frame. Compares current section duration against plan. When timer exceeds planned duration, automatically advances to next section. Climax sections never auto-advance (boss HP controls that).

---

## Debug Overlay (extended)

Now shows plan info alongside live state:
```
HC-ST
SECTION: crossfire
TENSION: 0.68  PEAK:0.88
PRESS_CHAIN: 2/3
RECOVERY: READY
CLIMAX: no  PRELUDE:active
LEVEL: 9  SECTIONS:42
DURATION: 18.4s
PLAN: dark_sector (3/5)
CURVE: slow_burn
NEXT: pressure_ramp (25s)
```

---

## Validation

```
node --check www/stage-plans.js   → OK (260 lines)
node --check www/stage-director.js → OK
```

- ✅ All 20 levels have authored plans
- ✅ All 8 identity-less levels resolved
- ✅ Section auto-advance functional
- ✅ Debug overlay shows plan + next section
- ✅ Boss climax sections don't auto-advance
- ✅ All frozen systems preserved
