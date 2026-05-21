# HC-BD-01 — Boss System Audit

**Block**: HC-BD  
**Status**: Audit complete (no gameplay changes)  
**Date**: 2026-05-21  
**Scope**: Full 5-boss structural audit for Boss Director System foundation

---

## Overview

Galaxy Raiders has 5 bosses across 20 levels. Each has 3 HP-gated phases (66%/33% thresholds), hardcore pattern registries, telegraph layers, and arena reposition behavior. This audit analyzes structural identity, pattern design, readability, fairness, and dramatic potential — without altering gameplay.

---

## BOSS 1 — CRABTRON (Level 5, crossfire)

### Basic Data
- **Name**: CRABTRON
- **Pattern ID**: crossfire
- **Level**: 5
- **HP**: 95 (base)
- **Sprite**: boss_crabtron.png (red/mechanical crab)
- **Phases**: 3 (66%/33% HP thresholds)
- **Hardcore Registry**: HARDCORE_BOSS_REGISTRY[0] (id: 1)

### Role Hardcore Actual
- **Archetype**: Duelist
- **Identity**: Mechanical crab — lateral dasher, pinch attacker
- **Pressure style**: Burst pressure with long recovery windows
- **Mobility style**: Crab-style lateral patrol + occasional dash
- **Pacing**: Slow patrol punctuated by sharp dash bursts

### Patterns Used

**Hardcore patterns** (boss-patterns.js — fireCrancktonHardcorePattern):
| Phase | Pattern | Count | Speed | Telegraph | Color |
|-------|---------|-------|-------|-----------|-------|
| 1 | Aimed 3-spread | 3 | 3.2 (max 4.5) | implicit | #ff8844 |
| 2 | Aimed burst (delayed x3) | 3 | speed | phase2_burst 420ms | #ff6655 |
| 3 | Radial ring (8-14) | 8-14 | speed*0.78 | phase3_radial 500ms | #ff9944 |

**Fallback patterns** (update-boss.js — non-hardcore):
- Cross + diagonal (40%): 4-bullet cross pattern
- Pincer fire (30%): side shots + aimed shots in phase 2+
- Laser column (30% phase 2+): vertical column burst
- Phase 1 fallback: single downward shot

**Movement patterns** (update-boss.js):
- Crab patrol: horizontal oscillation with dVx smoothing
- Dash mechanic: telegraph (200ms) → dash to player or opposite side → pincer burst on arrival
- Arena reposition: enabled (pauses during dashMode)

### Telegraphs
- Dash warning chevron arrow (HC-164, 200ms pre-launch)
- Dash direction arrow
- Phase 2 burst ring (420ms)
- Phase 3 radial ring (500ms)
- Phase transition FX (medium/heavy screen shake)

### Recovery Windows
- Post-dash: 2500-4000ms cooldown
- Between shots: shootRate (600-1800ms base, *0.6 in phase 3)
- Arena reposition pauses during dash → extra safety
- Dash replaces reposition opportunity (20% dash frequency reduction)

### Readability Issues
| Issue | Severity | Details |
|-------|----------|---------|
| Phase 1 pattern generic | Low | Same as non-hardcore 3-spread |
| Dash + shoot overlap possible | Low | dashMode gate prevents HC dispatch |
| Pincer burst post-dash | None | Well-telegraphed, deterministic |
| Phase 3 radial ring readability | Good | Telegraph + gap preservation |
| Fallback cross pattern untelegraphed | Very Low | Low bullet count, learned pattern |

### Overlap Risks
- **Risk Level**: Low
- Dash + pincer burst at endpoint = telegraphed combo, fair
- HC dispatch gated behind dashMode check — prevents bullet storm
- Phase 3 radial ring is sparse (8-14 bullets over 360°)

### Spam Moments
- **Risk**: Very Low
- Shoot timer prevents burst fire
- Dash cooldown prevents chain-dashing
- Phase 3 radial ring is gapped with telegraph

### Identity Strength
- **Score**: 6/10
- **Memorable**: Dash mechanic with visual arrow — distinct among bosses
- **Generic**: Phase 1 is standard aimed-spread — same genre staple
- **Personality**: Crab = pincer = lateral threat. Cohesive concept.

### Fairness Analysis
- **Score**: 8/10
- Dash has 200ms telegraph → readable reaction window
- Pincer burst at dash endpoint has fixed angles → dodgeable
- Arena bounds respect player safe zone (80px bottom margin)
- Phase 3 radial ring is not dense (max 14, 8 at 0° offset)

### Escalada Emocional
- **Current**: Flat — same dash mechanic across all phases
- **Potential**: Phase 1 → Phase 2 adds delayed burst + telegraph. Phase 3 adds radial ring. Good progression but lacks identity shift.
- **Missing**: Phase 1 has no signature feel; dash feels like the whole identity.

### Signature Attack Potential
- **Current de facto signature**: Dash → pincer burst combo
- **Potential explicit signature**: "Crab Clamp" — simultaneous lateral burst from both pincers plus downward aimed spread
- **Readiness**: Good. Dash mechanic is already unique. Needs dramatic framing.

### Summary
CRABTRON is the strongest identity among early bosses. Dash + pincer = cohesive crab theme. Weakness is phase 1 genericity. Serves well as tutorial boss with one memorable mechanic.

---

## BOSS 2 — SERPENTRIX (Level 10, zigzag)

### Basic Data
- **Name**: SERPENTRIX
- **Pattern ID**: zigzag
- **Level**: 10
- **HP**: 145 (base)
- **Sprite**: boss_serpentrix.png (green/serpentine)
- **Phases**: 3 (66%/33% HP thresholds)
- **Hardcore Registry**: HARDCORE_BOSS_REGISTRY[1] (id: 2)

### Role Hardcore Actual
- **Archetype**: Sweeper
- **Identity**: Serpentine creature — oscillating wide sweeps + mine deployment
- **Pressure style**: Sustained sweeping denial with mine area control
- **Mobility style**: Double-wave serpentine oscillation
- **Pacing**: Constant lateral sweep with soft vertical drift

### Patterns Used

**Hardcore patterns** (boss-patterns.js — updateSerpentrixHardcorePattern):
| Phase | Pattern | Count | Speed | Telegraph | Color |
|-------|---------|-------|-------|-----------|-------|
| 1 | Downward fan (5) | 5 | 2.8*0.88 | serpent_burst 220ms | #44dd44 |
| 2 (even) | Aimed burst (delayed x2) | 2 | 2.8 | serpent_burst 380ms | #44ee44 |
| 2 (odd) | Mine deployment (max 6) | 2 | 0.42 vy | serpent_mine 300ms | #33cc33 |
| 3 | Sine-wave arc (8-12) | 8-12 | 2.8*0.84 | serpent_arc 450ms | #22cc22 |

**Fallback patterns** (update-boss.js — non-hardcore):
- Fan sweep: 6-8 bullets in oscillating fan
- Venom shot (phase 2+): large slow aimed bullet
- Floating mines (50% chance, max 8): passive area denial

**Movement patterns** (update-boss.js):
- Double-wave serpentine: horizontal sin + vertical cos
- Arena reposition: enabled
- Retreats upward when player fires in phase 2+

### Telegraphs
- Serpent burst (green, 220ms phase 1 / 380ms phase 2)
- Mine deployment (300ms)
- Phase 3 arc (450ms)
- HC-24 green-themed telegraph color language

### Recovery Windows
- Alternating cycle in phase 2 → burst then mines
- Between shots: shootRate timer
- Zigzag movement provides natural dodge rhythm
- Arena reposition replaces pattern tick (creates gaps)

### Readability Issues
| Issue | Severity | Details |
|-------|----------|---------|
| Phase 1 fan is undirected spread | Low | No player tracking — less threatening |
| Venom shot large and slow | None | Very readable, distinct size |
| Mines are subtle | Medium | Small radius (12), slow drift, no pre-landing telegraph |
| Phase 3 arc has random wave offset | Low | Sine wave modulation is slow enough to read |
| HC dispatch vs fallback alternation | Very Low | HC always tries first, fallback is backup |

### Overlap Risks
- **Risk Level**: Medium (mine accumulation)
- Mines accumulate over time (max 8 fallback, max 6 HC)
- Fan sweep + mine drift can create lane pressure
- Phase 2 alternation reduces simultaneous threat count

### Spam Moments
- **Risk**: Very Low
- Phase 2 cycle gating prevents burst spam
- Mine cap (6 HC, 8 fallback) prevents density overload
- Shoot rate timer + HC dispatch cooldown

### Identity Strength
- **Score**: 5/10
- **Memorable**: Serpentine movement is visually distinct
- **Generic**: Patterns are mostly downwards fans — common shmup pattern
- **Missing**: No body-segment visual; no constrict/coil mechanic

### Fairness Analysis
- **Score**: 7/10
- Wide fan has natural gaps at extremes
- Mine deployment is passive (doesn't track player)
- Phase 2 aimed burst has 380ms telegraph
- Zigzag movement is predictable but amplitude varies

### Escalada Emocional
- **Current**: Gradual — fan → burst/mines → sine arc
- **Potential**: Mine accumulation is the most interesting escalation vector
- **Missing**: Phase 3 should feel like "the serpent awakens" — not just more bullets

### Signature Attack Potential
- **Current de facto signature**: Mine field + serpentine movement
- **Potential explicit signature**: "Constrictor Coil" — mines converge toward center while serpent creates escape-route denial
- **Readiness**: Medium. Mine system exists but lacks dramatic framing.

### Summary
SERPENTRIX is the most rhythmically interesting boss due to wave movement. Identity suffers from generic downward-fan patterns. The mine system is underutilized — could define the boss.

---

## BOSS 3 — ORBITAL (Level 15, rotate)

### Basic Data
- **Name**: ORBITAL
- **Pattern ID**: rotate
- **Level**: 15
- **HP**: 210 (base)
- **Sprite**: boss_orbital.png (cyan/blue mechanical orbiter)
- **Phases**: 3 (66%/33% HP thresholds)
- **Hardcore Registry**: HARDCORE_BOSS_REGISTRY[2] (id: 3)

### Role Hardcore Actual
- **Archetype**: Orbital (duh) — circular movement + pulse + tractor
- **Identity**: Orbiting satellite/station — elliptical movement + expansion pulses
- **Pressure style**: Surround/constrict pressure with tractor beam
- **Mobility style**: Elliptical orbit with direction changes
- **Pacing**: Smooth orbit punctuated by pulse mode and tractor

### Patterns Used

**Hardcore patterns** (boss-patterns.js — updateThirdBossHardcorePattern):
| Phase | Pattern | Count | Speed | Telegraph | Color |
|-------|---------|-------|-------|-----------|-------|
| 1 | Aimed arc (6) | 6 | 2.6 | orbital_arc 340ms | #5588ee |
| 2 | Alternating side arcs (4) | 4 | 2.6*0.88 | orbital_arc 380ms | #4477dd |
| 3 | Double rotating arcs (4x2) | 8 | 2.6 | orbital_arc 420ms | #3366ff |

**Fallback patterns** (update-boss.js — non-hardcore):
- Rotating spiral (4-8 bullets in expanding spiral)
- Pulse mode: radial burst ring (12-24 bullets) with heavy screen shake
- Tractor beam (phase 2+): vertical column of bullets at player X

**Movement patterns** (update-boss.js):
- Elliptical orbit: cos on X, sin on Y with variable radiusX/radiusY
- Orbit direction reversal (every 4-6s)
- Pulse mode: drifts to center → pulses → returns
- Tractor beam: stays in elliptical motion
- Arena reposition: enabled

### Telegraphs
- Orbital arc (blue, 340-420ms)
- Pulse warning ring (HC-165, 1500ms expanding blue ring)
- Tractor beam ground telegraph (HC-170, 300ms vertical column + SFX)
- Phase transition FX

### Recovery Windows
- Pulse mode has post-pulse cooldown (enters normal orbit)
- Orbit reversal is a spacing tool, not a threat
- Between shots: shootRate timer
- Tractor beam has 300ms ground telegraph

### Readability Issues
| Issue | Severity | Details |
|-------|----------|---------|
| Tractor beam ghost | Low | Vertical column is narrow, relies on player seeing ground telegraph |
| Pulse mode telegraph long | None | 1500ms is generous |
| Phase 3 double arcs | Low | Opposite arcs produce symmetric pattern — readable rhythm |
| Orbit direction change | None | Sudden but safe (no attack during change) |
| Phase 1 arc aimed at player | Low | Standard aimed spread, no identity |

### Overlap Risks
- **Risk Level**: Medium (pulse + tractor in same phase)
- Pulse mode disables normal firing — safe
- Tractor beam fires independently of spiral pattern
- Phase 3 double arcs are symmetric — no crossover chaos

### Spam Moments
- **Risk**: Low-Medium
- Pulse burst: 16-24 bullets in phase 3 — but rings are sparse by nature
- Tractor beam + spiral can overlap momentarily
- Phase 3 double arcs: 8 total (4 per side) — manageable

### Identity Strength
- **Score**: 7/10
- **Memorable**: Elliptical orbit + pulse mode is unique among current bosses
- **Generic**: Arc patterns are standard aimed spreads in blue
- **Personality**: Orbital/stationary threat with surround pressure. Clear concept.

### Fairness Analysis
- **Score**: 7/10
- Pulse warning ring (1500ms) provides generous reaction time
- Tractor beam 300ms ground telegraph is tight but visible
- Orbit is predictable with fixed radii
- Phase 3 arcs rotate slowly (0.32 rad/frame) — readable

### Escalada Emocional
- **Current**: Moderate — arc → alternating arcs → double arcs
- **Pulse mode is the best escalation**: screen shake, expansion ring, change of pace
- **Missing**: Pulse mode feels random, not scripted. Could be a phase-gated signature.

### Signature Attack Potential
- **Current de facto signature**: Pulse expansion + tractor beam
- **Potential explicit signature**: "Gravity Well" — tractor beam pulls player + pulse ring forces dodge
- **Readiness**: Good. Tractor + pulse are already implemented. Needs synchronization.

### Summary
ORBITAL has the strongest movement identity (elliptical orbit) and the best beta signature attack (pulse). Needs more intentional phase escalation and tractor-pulse synchronization.

---

## BOSS 4 — TENIENTE (Level 19, divebomb)

### Basic Data
- **Name**: TENIENTE
- **Pattern ID**: divebomb
- **Level**: 19
- **HP**: 285 (base)
- **Sprite**: boss_teniente.png (yellow/orange aggressive commander)
- **Phases**: 3 (66%/33% HP thresholds)
- **Hardcore Registry**: HARDCORE_BOSS_REGISTRY[3] (id: 4)

### Role Hardcore Actual
- **Archetype**: Hunter
- **Identity**: Aggressive commander — divebomb charge + impact burst + retreat
- **Pressure style**: Burst chase — charge at player, burst on arrival, retreat
- **Mobility style**: Patrol + charge state machine
- **Pacing**: Telegraph → Charge → Impact → Retreat → Patrol loop

### Patterns Used

**Hardcore patterns** (boss-patterns.js — updateFourthBossHardcorePattern):
| Phase | Pattern | Count | Speed | Telegraph | Color |
|-------|---------|-------|-------|-----------|-------|
| 1 | Downward aimed 3-spread | 3 | 2.2*0.94 | teniente_dive 380ms | #ff5533 |
| 2 | Dual-column aimed (2x3) | 6 | 2.2*0.88 | teniente_dive 420ms | #ee4422 |
| 3 | Triple column (1+2+2) | 7 | 2.2*0.85 | teniente_dive 450ms | #dd3311 |

**Fallback patterns** (update-boss.js — non-hardcore):
- Single aimed shot toward player
- Side shots in phase 2+ (40% chance)

**Movement patterns** (update-boss.js — divebomb state machine):
- Patrol: horizontal oscillation with gentle vertical wave
- Telegraph (650ms): micro-jitter, light screen shake, slows down
- Charge: accelerates toward player/target position at speed 9
- Impact (250ms): stops at target, 250ms warning before radial burst (8-12 bullets)
- Retreat (950ms): pulls back upward

### Telegraphs
- Charge telegraph (650ms pre-charge): jitter + shake + SFX
- Impact warning (HC-164, 250ms pre-burst): dual shrinking rings + flash
- Teniente dive pattern telegraph (380-450ms)

### Recovery Windows
- Post-impact retreat: 950ms enforced cooldown
- Between charges: random chance (0.4% per frame) + patrol cooldown
- Between shots: shootRate timer
- Retreat prevents rapid re-engagement

### Readability Issues
| Issue | Severity | Details |
|-------|----------|---------|
| Charge direction locked at telegraph start | Low | Player can reposition during 650ms telegraph |
| Impact burst at arrival point | None | 250ms warning ring at impact site |
| Phase 3 triple column | Low | 7 bullets from 3 origins, gappable |
| Patrol is very standard | None | Gentle wave, good breathing room |
| Divebomb cycle is transparent | Good | Clear state transitions |

### Overlap Risks
- **Risk Level**: Medium (charge + shooting)
- Boss shoots aimed spreads while in patrol — safe
- Boss does NOT shoot during telegraph/charge/impact/retreat — safe
- Impact burst is radial from impact point — managed by 250ms warning
- HC dispatch runs during patrol only — no overlap with charge

### Spam Moments
- **Risk**: Low-Medium
- Charge can feel frequent if RNG triggers (0.4%/frame)
- Impact burst: 8-12 bullets in ring — but sparse and warned
- Phase 3: 7 aimed bullets + possible impact burst — but states don't overlap

### Identity Strength
- **Score**: 8/10
- **Memorable**: Charge → Impact → Retreat loop is dramatic and distinct
- **Generic**: Aimed downward spreads in all three phases share same shape
- **Personality**: Aggressive commander who gets in your face. Strong.

### Fairness Analysis
- **Score**: 7/10
- 650ms telegraph + 250ms impact warning = 900ms total reaction window
- Charge direction is readable (locked at telegraph start)
- Impact burst is radial — gaps exist between bullets
- Retreat after impact prevents insta-kill chains
- Phase 3 column density is layered but has lateral gaps

### Escalada Emocional
- **Current**: Good — phase 1 single column → phase 2 dual column → phase 3 triple column
- **The charge cycle IS the escalation**: more columns + more impact burst bullets
- **Missing**: Phase 3 should feel like a desperate commander. Could add rage behavior.

### Signature Attack Potential
- **Current de facto signature**: Divebomb → Impact Burst
- **Potential explicit signature**: "Commander's Wrath" — multi-charge chain with escalating impact radius
- **Readiness**: Very good. State machine already exists. Just needs phase-gated escalation.

### Summary
TENIENTE has the most complete dramatic loop of any current boss. Charge → Impact → Retreat is naturally theatrical. Main weakness is that all three hardcore phases use the same downward-spread shape (just different counts).

---

## BOSS 5 — EMPERADOR (Level 20, supreme)

### Basic Data
- **Name**: EMPERADOR
- **Pattern ID**: supreme
- **Level**: 20
- **HP**: 450 (base)
- **Sprite**: boss_emperador.png (white/purple emperor)
- **Phases**: 3 (66%/33% HP thresholds)
- **Hardcore Registry**: HARDCORE_BOSS_REGISTRY[4] (id: 5)

### Role Hardcore Actual
- **Archetype**: Executioner
- **Identity**: Imperial overlord — teleportation + minion summon + varied attack suite
- **Pressure style**: Multidirectional pressure via teleport displacement + minions
- **Mobility style**: Phased movement (majestic → aggressive → pursuit) + teleport
- **Pacing**: Slow and oppressive, accelerates through phases

### Patterns Used

**Hardcore patterns** (boss-patterns.js — updateFifthBossHardcorePattern):
| Phase | Pattern | Count | Speed | Telegraph | Color |
|-------|---------|-------|-------|-----------|-------|
| 1 | Imperial spread fan (7) | 7 | 2.0*0.92 | emperador_spread 440ms | #aa77dd |
| 2 | Aimed spread (5) + lateral delayed (2, 150ms) | 7 | 2.0*0.86 | emperador_spread 480ms | #9966dd |
| 3 | Aimed spread (5) + outer delayed (4, 200ms) | 9 | 2.0*0.86 | emperador_spread 520ms | #9977ee |

**Fallback patterns** (update-boss.js — non-hardcore):
- Phase 1: Triple imperial + spread (30%)
- Phase 2: Spread fan (40%) / Imperial ray burst (30%) / Imperial cross (30%)
- Phase 3: Spiral (40%) / Expansion wave (30%) / Triple reinforced + fan (30%)

**Movement patterns** (update-boss.js — supreme):
- Phase 1: Majestic centered oscillation (sin wave)
- Phase 2: More aggressive sway + teleportation
- Phase 3: RAGE MODE — tracks player + teleports frequently
- Teleport: 400-500ms flash → reappear → shockwave burst
- Minion summon: phase 2+, every 10s if enemies < 2

### Telegraphs
- Emperor spread telegraph (440-520ms purple)
- Teleport destination glow (HC-167, 400-500ms purple glow at dest)
- Teleport shockwave on reappearance (not separately telegraphed)
- Minion summon is instant with explosion FX

### Recovery Windows
- Post-teleport: 4000-6000ms cooldown
- Between shots: shootRate timer
- No shooting during teleporting state
- Phase 1 movement is very slow — constant recovery space

### Readability Issues
| Issue | Severity | Details |
|-------|----------|---------|
| Teleport shockwave untelegraphed | Medium | Reappearance has 4+phase bullet wave — no separate warning |
| Minion summon instant | Medium | Explosion FX + SFX but no pre-warning |
| Phase 3 rage mode chaotic | Medium | Player tracking + teleport + shooting can stack |
| Phase 1 majestic movement is slow | None | Very readable |
| Delayed lateral bullets | Low | 150-200ms delay is short but bullets are off-axis |

### Overlap Risks
- **Risk Level**: Medium-High (phase 3 teleport + shooting + minions)
- Teleport shockwave + fallback pattern can overlap (if timer fires during reappearance)
- Minion summon + boss shooting can create multi-axis pressure
- Phase 3 rage tracking + teleport + delayed burst can converge
- HC dispatch gates behind isTeleporting check — safe during teleport

### Spam Moments
- **Risk**: Medium
- Phase 3 spiral and expansion wave are bullet-dense (6-10 per volley)
- Fallback patterns fire independently of HC dispatch
- Teleport reappearance adds 4+phase shockwave bullets
- Minion spawn adds independent shooting actors

### Identity Strength
- **Score**: 9/10
- **Memorable**: Teleportation mechanic is uniquely dramatic
- **Memorable**: Three distinct movement phases (majestic → aggressive → rage)
- **Generic**: Spread fan patterns are standard
- **Personality**: Imperial overlord who controls space. Very strong.

### Fairness Analysis
- **Score**: 6/10
- Teleport destination has 400-500ms glow warning — tight but readable
- Phase 3 rage tracking is oppressive but predictable (smooth acceleration)
- Minion summon has no pre-warning — instant threat
- Teleport shockwave on reappearance needs 0-frame reaction
- Delayed bursts (150-200ms) add tension without unfairness

### Escalada Emocional
- **Current**: Best in game — majestic → aggressive → RAGE is a proper dramatic arc
- Phase 3 rage mode actually changes behavior (pursuit + frequent teleports)
- Minion invocation adds "army of darkness" flavor
- **Missing**: Phase 3 rage could go harder. Phase 1 is too mild for a final boss.

### Signature Attack Potential
- **Current de facto signature**: Teleport → Shockwave combo
- **Potential explicit signature**: "Imperial Judgment" — teleport above player → delayed column barrage
- **Potential explicit signature**: "Crown of Thorns" — ring of aimed bullets from center with delayed convergence
- **Readiness**: Very good. Teleport is a strong signature base. Needs more dramatic framing.

### Summary
EMPERADOR is the strongest boss in terms of dramatic identity and escalation. Teleportation creates genuine tension. Phase 3 rage mode almost qualifies as a proper rage phase. Main weakness is signature attack variety — the spread + lateral delayed pattern is repeated across all three phases with minor variation.

---

## Cross-Boss Analysis

### Identity Distribution

| Boss | Identity Score | Archetype Fit | Memorable Mechanic | Signature Potential |
|------|---------------|---------------|--------------------|--------------------|
| CRABTRON | 6/10 | Duelist | Dash | Crab Clamp |
| SERPENTRIX | 5/10 | Sweeper | Serpentine movement | Constrictor Coil |
| ORBITAL | 7/10 | Orbital | Pulse mode | Gravity Well |
| TENIENTE | 8/10 | Hunter | Charge/Impact/Retreat | Commander's Wrath |
| EMPERADOR | 9/10 | Executioner | Teleport | Imperial Judgment |

### Common Weaknesses Across All Bosses

1. **Phase 1 is always generic**: All five bosses use aimed-spread or downward-fan as their phase 1 hardcore pattern. No boss introduces itself memorably.

2. **No signature attack naming/gating**: Attacks exist but lack explicit identity branding. No "THIS IS MY SIGNATURE MOVE" moment.

3. **Phase transitions are FX-only**: Phase transition FX (screen shake, ring flash, music duck) is good but doesn't include behavioral shift. Boss enters phase 2/3 without changing movement style (except EMPERADOR).

4. **No rage phase**: EMPERADOR's phase 3 has rage-like behavior (pursuit + speed) but no other boss has proper desperation mechanics.

5. **No recovery phases**: Every boss follows shoot → cooldown → shoot. No boss has intentional "recovery window" where they signal safety.

6. **No dramatic intro**: Bosses spawn and immediately start patterns. No entrance performance.

7. **Overlap is mostly managed**: CRABTRON dashes gate shooting. TENIENTE charges gate shooting. EMPERADOR teleports gate shooting. Good — but the gating is passive (boolean checks), not directed (intentional spacing).

8. **Bullet colors improve readability**: Each boss has a distinct color palette per HC dispatch (red→green→blue→orange→purple). This is good and should be formalized as identity.

### Readability Summary

| Boss | Color Identity | Telegraph Quality | Bullet Clarity | Overall |
|------|---------------|-------------------|----------------|---------|
| CRABTRON | Red/orange | Good (dash arrow + ring) | High | 8/10 |
| SERPENTRIX | Green | Good (burst ring) | Medium (mines subtle) | 7/10 |
| ORBITAL | Blue/cyan | Excellent (pulse + tractor) | High | 8/10 |
| TENIENTE | Red-orange | Good (charge + impact) | High | 8/10 |
| EMPERADOR | Purple/white | Good (spread + teleport glow) | Medium (phase 3 chaos) | 7/10 |

### Fairness Summary

| Boss | Unfair Risk | Worst Case | Current Score |
|------|------------|------------|---------------|
| CRABTRON | Low | Dash+pincer overlap (gated) | 8/10 |
| SERPENTRIX | Low | Mine accumulation (capped) | 7/10 |
| ORBITAL | Medium | Tractor+pulse overlap | 7/10 |
| TENIENTE | Low | Charge chain (cooldown) | 7/10 |
| EMPERADOR | Medium | Phase 3 teleport+spread+minion | 6/10 |

### Escalation Quality

| Boss | Phase 1→2 | Phase 2→3 | Rage Quality | Overall |
|------|-----------|-----------|-------------|---------|
| CRABTRON | Adds delayed burst | Adds radial ring | None | 5/10 |
| SERPENTRIX | Adds mines + aimed burst | Adds sine arc | None | 6/10 |
| ORBITAL | Adds alternating arcs | Adds double arcs + pulse | Weak (more bullets) | 6/10 |
| TENIENTE | Adds dual column | Adds triple column | Weak (more columns) | 7/10 |
| EMPERADOR | Adds teleport + lateral | Adds pursuit + fast TP | Medium (rage mode) | 8/10 |

### Rhythm & Pacing Summary

| Boss | Pace Style | Breathing Room | Rhythm Quality |
|------|-----------|---------------|----------------|
| CRABTRON | Burst (dash + cooldown) | Long post-dash | 7/10 |
| SERPENTRIX | Sustained (constant sweep) | Wave rhythm | 6/10 |
| ORBITAL | Cyclic (orbit + pulse) | During orbit | 7/10 |
| TENIENTE | Dramatic loop (charge/retreat) | During patrol + retreat | 8/10 |
| EMPERADOR | Variable (slow→fast→rage) | Phase 1 only | 7/10 |

---

## Structural Gaps for Boss Director System

### What Exists (Strengths)
1. Phase-gated HP thresholds (66%/33%) — robust and tested
2. HC pattern registry with dispatch — centralized, clean
3. Telegraph layer with per-boss colors — good foundation
4. Arena reposition system — prevents static bosses
5. AI sinusoidal movement layer — adds organic feel
6. Phase transition FX — screen shake, ring flash, music duck
7. Encounter Director pressure tracking — can inform boss pacing

### What's Missing (HC-BD Scope)
1. **Boss taxonomy**: No archetype classification system
2. **Phase taxonomy**: Phase types beyond HP-gated 1/2/3
3. **Signature attack system**: No branded/categorized signature attacks
4. **Orchestration rules**: No documented fairness/pacing rules for bosses
5. **Recovery phases**: No intentional breathing-room phases
6. **Rage phases**: Only EMPERADOR has proto-rage behavior
7. **Dramatic intros**: No boss entrance performance
8. **Transition direction**: Phase changes are FX-only, no behavioral shift
9. **Boss identity config**: No centralized identity/archetype config
10. **Telemetry for bosses**: No per-boss metrics collection

---

## Audit Conclusion

The five bosses have solid gameplay foundations but lack dramatic identity. They function as "big enemies with patterns" rather than "directed encounters." The technical systems (telegraphs, phase gating, pattern registry, arena reposition) are robust. What's needed is:

1. **Taxonomy** to classify and validate boss identity
2. **Orchestration rules** to enforce fairness and pacing
3. **Signature attack framework** to brand memorable moments
4. **Phase type system** beyond HP gating
5. **Director config** to centralize boss behavior tuning

This audit confirms: the foundation is ready for HC-BD architectural work. No gameplay changes needed — just structural scaffolding for identity, pacing, and direction.

---

**Audit completed. Ready for taxonomy and director foundation.**
