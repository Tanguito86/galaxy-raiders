# HC-ST-02b — Pacing Doctrine & Tension Curves

**Block:** HC-ST  
**Status:** Defined (design document, no runtime)  
**Date:** 2026-05-22  
**Dependency:** HC-ST-01 (audit), HC-ST-02a (taxonomy)

---

## 1. Pacing Rules (Global)

### 1.1 Alternation Rule
```
Every high-intensity section MUST be followed by a lower-intensity buffer.
Exception: Climax (boss fight) can end the stage — no buffer needed after.
```

### 1.2 Maximum Consecutive Pressure
```
Max 3 pressure sections (PRESSURE/CROSSFIRE/AMBUSH/SURVIVAL) without RELIEF.
After 3: RELIEF mandatory.
```

### 1.3 Relief Cannot Be Empty
```
Relief must have: at least 1 enemy on screen, movement incentive, collection opportunity.
Relief must NOT have: 0 enemies, 0 activity, dead air.
Boredom is not recovery.
```

### 1.4 Boss Prelude Cleanup
```
Visual noise must decrease during boss prelude. No bullet-heavy enemies.
Last 3s of prelude: ideally zero enemies on screen.
Boss spawn must be visible and dramatic without being cinematic.
```

### 1.5 Ambush Spacing
```
Minimum 2 sections between ambushes.
Never ambush within 1 section of a crossfire or survival corridor.
```

### 1.6 Setpiece Cool-down
```
Minimum 3 levels between mini setpieces.
Set pieces should NEVER be back-to-back.
```

### 1.7 Warmup Length
```
First stage of the game: extended warmup (20-25s).
Post-relief warmup: shortened (12-15s — player is already engaged).
```

---

## 2. Tension Curves (5 patterns)

### 2.1 SAWTOOTH ESCALATION
```
Shape:  /\/\/\  (peaks rise, valleys rise)
Use:    Main game flow. Standard stages.
Example: Warmup → Pressure → Relief → Crossfire → Relief → MiniSetpiece → Relief
Risk:   Predictable after 4-5 cycles
Mitigation: Vary section types, not just intensity
```

### 2.2 PULSE PACING
```
Shape:  ──██──██── (sudden spikes, flat valleys)
Use:    Ambush-heavy stages. Shock value stages.
Example: Warmup → Ambush → Relief → Formation → Ambush → Relief → Pressure
Risk:   Exhausting if too many pulses
Mitigation: Max 2 ambushes per stage
```

### 2.3 COLLAPSE PACING
```
Shape:  ████▄▄ (start high, slowly release)
Use:    Post-boss stages. Relief after climax.
Example: Pressure → Relief → Formation → Warmup → Stage end
Risk:   Can feel anti-climactic
Mitigation: Add mini-setpiece near end for a small second peak
```

### 2.4 SLOW BURN
```
Shape:  ▁▂▃▄▅▆▇█ (continuous ramp)
Use:    Pre-boss stages. Build toward climax.
Example: Formation → Pressure → Relief → Crossfire → MiniSetpiece → BossPrelude
Risk:   Too long without relief = exhaustion
Mitigation: Insert relief at midpoint. Max 90s between relief sections.
```

### 2.5 OVERLOAD CLIMAX
```
Shape:  ████████████ (maximum sustained)
Use:    Final boss stage. Survival corridor → Boss Prelude → EMPERADOR.
Example: Survival → Relief → BossPrelude → Climax(\mperor)
Risk:   Stage 19→20 back-to-back bosses is already overload
Mitigation: Increase relief between bosses. 19 boss death → 5s pause → prelude → 20.
```

---

## 3. Recovery Doctrine

### 3.1 What Recovery IS
- Mental breathing room for the player
- Visual field clearing (reduced bullet density)
- Opportunity for medal collection / routing decisions
- Transition marker between emotional sections

### 3.2 What Recovery is NOT
- Empty screen (boredom kills flow)
- Pause menu (breaks immersion)
- Zero threats (can't be zero enemies — engagement drops)
- Fake slowdown that immediately ramps again (betrayal)

### 3.3 Recovery Intensity Cap
```
Max intensity during relief: 0.30
Max bullets on screen: 4
Max enemies: 3 (low-threat types only)
```

### 3.4 Recovery Duration
```
Standard relief: 10-18s
Post-ambush relief: 15-22s
Post-survival-corridor relief: 20-30s
Post-boss kill: 5-8s (celebration, not relief per se)
```

---

## 4. Boss Prelude Doctrine

### 4.1 Buildup Pipeline
```
Phase 1 (10s before boss): "APPROACHING" banner. Enemies reduce to 50%.
Phase 2 (5s before boss): Field clears. Last enemies retreat or die.
Phase 3 (boss spawn): Dramatic entry. No regular enemies. Boss teleports/appears.
```

### 4.2 Visual Simplification
```
Background: Subtle dimming, focus on boss entry point
Bullets: Clean up all regular enemy bullets before boss spawn
Player: Must retain full control — no forced movement
```

### 4.3 Audio Opportunity
```
Music: Shift to boss theme during prelude (not at spawn)
Boss entry sound: Layered — warning → buildup → impact
```

### 4.4 Forbidden Boss Entries
```
❌ Boss spawns while 5+ regular enemies still alive
❌ Boss spawns during dense crossfire section
❌ Boss appears with zero warning or buildup
❌ "BOSS INCOMING" banner is the ONLY prelude element
```

---

## 5. Stage Identity Doctrine

### 5.1 What Makes a Stage Memorable

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Formation signature** | 30% | Unique enemy arrangement that defines the stage |
| **Movement profile** | 20% | How the player must move (lateral, vertical, micro-dodge) |
| **Enemy type focus** | 20% | Which enemy types dominate this stage |
| **Cadence** | 15% | Rhythm of fire patterns |
| **Climax style** | 10% | How the stage peaks (boss, set piece, survival) |
| **Audio theme** | 5% | Music identity |

### 5.2 Identity Template
```
Stage name: [UNIQUE NAME]
Signature enemy: [1-2 types]
Movement demand: [lateral / vertical / mixed]
Cadence: [slow deliberate / fast reactive / mixed]
Climax: [boss / set piece / survival]
Emotional arc: [sawtooth / pulse / slow burn]
```

### 5.3 Identity Anti-Patterns
```
❌ "normal wave with alien1 and alien2" — no identity
❌ Same formation as previous stage — repetition kills memorability
❌ No signature enemy — everything is generic
❌ Same cadence as adjacent stages — no contrast
```

---

## 6. Encounter Sequencing Rules

### 6.1 Emotional Alternation
```
Every section must differ emotionally from the previous:
- If previous was HIGH STRESS → next must be LOWER STRESS or RECOVERY
- If previous was LOW STRESS → next must build gently
- Never flatline intensity for >25s (even survival must fluctuate slightly)
```

### 6.2 Escalation within Stages
```
Early stage: 0.2 → 0.5 → 0.7 → relief → 0.4 → 0.6
Mid stage:   0.3 → 0.6 → 0.8 → relief → 0.5 → 0.7 → climax
Late stage:  0.4 → 0.7 → 0.9 → relief → 0.6 → survival → relief → climax
```

### 6.3 Climax Construction
```
Pre-climax section: Must be contrasting — either brief relief OR moderate pressure (not identical intensity)
Climax entry: BossPrelude → Boss spawn → Phase 1
Post-climax: Boss death → celebration pause → stage end
```

---

## 7. Frozen System Constraints

| System | HC-ST constraint |
|--------|-----------------|
| HC-WC | Wave composer manages individual wave spawns; HC-ST selects section types |
| HC-BD | Boss director manages boss flow; HC-ST positions boss within stage |
| HC-RK | Rank adjusts difficulty; HC-ST must not override rank caps |
| HC-SC | Scoring preserved; HC-ST sections don't affect score calculations |
| HC-RD | V1 readability rules enforced during all sections |
| HC-PD | Pattern director selects enemy patterns; HC-ST selects enemy groupings |

---

## 8. Integration with HC-ST-01 Findings

### Problems Addressed by This Doctrine

| HC-ST-01 Problem | Doctrine solution |
|-----------------|-------------------|
| 8/20 stages without identity | Stage identity template + signature enemy focus |
| Flat emotional curves | 5 tension curve patterns with alternation rules |
| No recovery | Relief section type (mandatory after high-intensity) |
| Weak boss preludes | 3-phase boss prelude pipeline |
| Post-boss lulls too deep | Collapse pacing pattern for post-boss stages |
| Interchangeable mid-game | Formation showcase + mini setpiece variety |

---

## 9. HC-ST Config

See `www/game-config.js` → `stageDirector` block for centralized configuration.

### Key Config Parameters
```
stageDirector.enabled = true                    → master switch
stageDirector.maxConsecutivePressure = 3         → sections before forced relief
stageDirector.recoveryMinMs = 10000              → minimum relief duration
stageDirector.bossPreludeMinMs = 8000            → minimum prelude duration
stageDirector.ambushMinSectionGap = 2            → sections between ambushes
stageDirector.setpieceMinLevelGap = 3            → levels between set pieces
stageDirector.survivalCorridorMinLevel = 14      → minimum level for survival
```
