# HC-ST-02a — Stage Section Taxonomy

**Block:** HC-ST  
**Status:** Defined (design document, no runtime)  
**Date:** 2026-05-22  
**Dependency:** HC-ST-01 (audit)

---

## Taxonomy Overview

10 defined section types. Each has: purpose, intensity, duration, readability target, cognitive load, escalation role, and integration constraints.

---

## Section Types

### 1. WARMPUP
```
Purpose:       Establish game feel, teach enemy types, build confidence
Intensity:     0.2 – 0.4
Duration:      15 – 25 seconds
Readability:   Maximum — clear spacing, large gaps between enemies
Cognitive load: Low — single enemy type, slow bullets
Escalation:    Starts flat, ends with slight tension curve
Recovery:      N/A (it IS recovery for early game)
───────────────────────────────────────────────────────────
Allowed:       1-2 enemy types, no divers, no snipers
Forbidden:     Tanks, splitters, kamikazes, bosses, set pieces
Combinations:  Always first section of a stage or post-relief
```

### 2. FORMATION SHOWCASE
```
Purpose:       Display new enemy type or formation pattern
Intensity:     0.3 – 0.5
Duration:      12 – 20 seconds
Readability:   High — formation must be clearly visible
Cognitive load: Medium-low — new pattern to learn, low bullet density
Escalation:    Slight ramp toward end
Recovery:      None needed — intensity is moderate
───────────────────────────────────────────────────────────
Allowed:       2-3 enemy types, 1 new type introduced
Forbidden:     Diver-heavy compositions, suppression fire
Combinations:  Follows warmup, precedes pressure ramp
```

### 3. PRESSURE RAMP
```
Purpose:       Escalate tension through enemy density and fire rate
Intensity:     0.4 – 0.7
Duration:      20 – 40 seconds
Readability:   Medium — bullets become denser but telegraphs present
Cognitive load: Medium-High — multitasking (dodge + shoot + position)
Escalation:    Steady upward curve, no sudden spikes
Recovery:      Must be followed by relief or at least pressure plateau
───────────────────────────────────────────────────────────
Allowed:       All enemy types, divers ≤2, moderate suppression
Forbidden:     Boss attacks, set piece density, survival corridor intensity
Combinations:  Between warmup/formation → peak sections
```

### 4. CROSSFIRE
```
Purpose:       Force spatial awareness through multi-directional threats
Intensity:     0.5 – 0.8
Duration:      15 – 25 seconds
Readability:   Medium — bullets from multiple angles, clear origin points
Cognitive load: High — tracking threats from 2+ directions
Escalation:    Plateau at intensity, no continuous ramp
Recovery:      Must be followed by relief
───────────────────────────────────────────────────────────
Allowed:       Multi-angle shooters, flanker roles, side-spawn enemies
Forbidden:     Boss attacks, teleporting enemies, curtain density
Combinations:  Single section, never chained
```

### 5. AMBUSH
```
Purpose:       Shock value — sudden threat from unexpected direction
Intensity:     0.6 – 0.9 (spike, not sustained)
Duration:      8 – 15 seconds
Readability:   Medium-High — threat must be clearly signaled within 1s of ambush
Cognitive load: Very High initially, drops as player adapts
Escalation:    Sharp spike, quick resolution
Recovery:      MUST be followed by immediate relief (mandatory)
───────────────────────────────────────────────────────────
Allowed:       Diver rush, flanker surge, teleport-in enemies
Forbidden:     Boss attacks, sustained pressure, chain ambushing
Combinations:  Never follows climax. Always single. Minimum 2-section cooldown.
```

### 6. RELIEF
```
Purpose:       Reduce cognitive load, allow mental reset, preserve flow
Intensity:     0.1 – 0.3
Duration:      10 – 20 seconds
Readability:   Very High — clear visual field, reduced bullet count
Cognitive load: Low — easy dodging, focus on collection/routing
Escalation:    None — intensity drops deliberately
Recovery:      N/A (it IS recovery)
───────────────────────────────────────────────────────────
Allowed:       Low-density enemies, powerup spawns, medal cleanup
Forbidden:     Divers, snipers, tanks, any density >4 bullets on screen
Combinations:  After ambush, crossfire, boss phase, survival corridor
```

### 7. SURVIVAL CORRIDOR
```
Purpose:       Test endurance — sustained high density, no breaks
Intensity:     0.7 – 1.0
Duration:      25 – 45 seconds
Readability:   Low-Medium — bullets dominant, readability system must handle
Cognitive load: Maximum — full multitasking at highest difficulty
Escalation:    Plateau at high intensity, micro-fluctuations
Recovery:      MUST be followed by relief (mandatory, longer than usual)
───────────────────────────────────────────────────────────
Allowed:       All enemy types at max density, 3 divers, full suppression
Forbidden:     Boss attacks (this is a wave section, not a boss fight)
Combinations:  Late-game only (level 14+). Max 1 per stage. Never adjacent.
```

### 8. MINI SETPIECE
```
Purpose:       Signature encounter — scripted, memorable, unique
Intensity:     0.6 – 0.9
Duration:      20 – 35 seconds
Readability:   High — scripted patterns allow anticipation
Cognitive load: Medium-High — pattern recognition + execution
Escalation:    Unique pattern, no generic ramp needed
Recovery:      Followed by relief
───────────────────────────────────────────────────────────
Allowed:       Scripted formation, unique enemy composition, pattern fire
Forbidden:     Generic waves, repeat of existing set piece within 5 levels
Combinations:  Rare (every 3-5 levels). Never adjacent to boss fight.
```

### 9. BOSS PRELUDE
```
Purpose:       Build anticipation, reduce visual noise, prepare for boss
Intensity:     0.2 – 0.4 (intentionally dropping)
Duration:      10 – 18 seconds
Readability:   Maximum — clear the field, telegraph the boss arrival
Cognitive load: Low — small enemies or empty field, musical shift
Escalation:    Drops toward zero before boss spawn
Recovery:      N/A (it IS recovery, giving way to climax)
───────────────────────────────────────────────────────────
Allowed:       Minimal enemies (1-2), no bullets if possible, banner text
Forbidden:     Bullet density, divers, suppression, distractions
Combinations:  Always immediately before boss fight. Mandatory.
```

### 10. CLIMAX (Boss Fight)
```
Purpose:       Peak test — mastery of all game systems under maximum pressure
Intensity:     0.8 – 1.0
Duration:      60 – 180 seconds (boss HP-dependent)
Readability:   Managed by HC-BD + HC-RD — telegraphs must be clear
Cognitive load: Maximum — pattern reading, phase adaptation, scoring optimization
Escalation:    Phase-based (boss director handles this)
Recovery:      After boss death — celebration pause, score display
───────────────────────────────────────────────────────────
Allowed:       Boss attacks, patterns, phases, minions, teleports
Forbidden:     Regular enemies (unless boss spawns them)
Combinations:  End of stage. Always. Only exception: final boss chaining.
```

---

## Section Escalation Rules

```
WARMPUP ──▶ FORMATION ──▶ PRESSURE ──┬──▶ CROSSFIRE ──▶ RELIEF
                                     │
                                     ├──▶ MINI_SETPIECE ──▶ RELIEF
                                     │
                                     ├──▶ SURVIVAL ──▶ RELIEF (longer)
                                     │
                                     └──▶ AMBUSH ──▶ RELIEF (mandatory)

BOSS_PRELUDE ──▶ CLIMAX (BOSS)

RELIEF ──▶ WARMPUP (new cycle)
       ──▶ FORMATION (skip warmup if identity established)
```

### Hard Rules
1. **Never chain**: Ambush→Ambush, Crossfire→Crossfire, Survival→Survival
2. **Always follow**: Ambush, Crossfire, Survival with Relief
3. **Maximum**: 3 consecutive pressure sections without Relief
4. **Boss Prelude**: Exactly once per boss level, immediately before boss
5. **Survival Corridor**: Max 1 per stage, level ≥14 only
6. **Mini Setpiece**: Minimum 3-section gap before next mini setpiece
7. **Climax**: Always ends the stage

---

## Forbidden Combinations

| Section A | Section B | Reason |
|-----------|-----------|--------|
| Ambush | Ambush | Cognitive overload — player can't recover |
| Climax | Ambush | No transition — exhausts player |
| Crossfire | Crossfire | Multi-direction overload compounds |
| Survival | Survival | Endurance fatigue — player quits |
| Relief | Relief | Boredom — pacing dies |
| Boss Prelude | Ambush | Prelude must give way to boss, not shock |
| Climax | Survival | Boss death → game ends, survival meaningless |

---

## Duration Reference

| Section | Min (s) | Ideal (s) | Max (s) |
|---------|---------|-----------|---------|
| WARMUP | 12 | 18 | 30 |
| FORMATION | 8 | 15 | 25 |
| PRESSURE | 15 | 25 | 45 |
| CROSSFIRE | 10 | 18 | 30 |
| AMBUSH | 5 | 10 | 18 |
| RELIEF | 8 | 14 | 25 |
| SURVIVAL | 20 | 30 | 50 |
| MINI SETPIECE | 15 | 25 | 40 |
| BOSS PRELUDE | 8 | 14 | 22 |
| CLIMAX | 60 | 90 | 200 |
