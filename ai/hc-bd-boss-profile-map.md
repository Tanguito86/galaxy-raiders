# HC-BD-02 — Boss Profile Mapping & Identity Matrix

**Block**: HC-BD  
**Status**: Identity mapping complete (no gameplay changes)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-01 (audit + taxonomy foundation)

---

## Overview

This document maps every Galaxy Raiders boss to its official HC-BD hardcore identity. Each boss receives an archetype, pressure/mobility/pacing/rage/telegraph profiles, signature attack candidates, phase plan, recovery philosophy, and fairness priorities.

All profiles are based on the HC-BD-01 audit and the boss-director.js taxonomy. No gameplay changes — identity assignment only.

---

## BOSS 1 — CRABTRON

### Identity Card

| Field | Value |
|-------|-------|
| **Display Name** | CRABTRON |
| **Boss ID** | 1 |
| **Pattern ID** | crossfire |
| **Level** | 5 |
| **HP** | 95 |
| **Archetype** | DUELIST |
| **Role Hardcore** | Mechanical crab duelist — lateral dasher, pincer attacker |

### Pressure Profile

| Field | Value |
|-------|-------|
| **Primary Pressure** | Burst (dash → pincer combo) |
| **Secondary Pressure** | Lateral aimed burst |
| **Pressure Style** | burst |
| **Pressure Intensity** | Low-Medium (tutorial boss) |

### Mobility & Pacing

| Field | Value |
|-------|-------|
| **Mobility Style** | lateral_strafe (crab patrol + dash) |
| **Pacing Style** | punctuated (long cooldowns, sharp bursts) |
| **Recovery Bias** | long_after_burst (2500-4000ms post-dash) |
| **Telegraph Style** | directional_arrow (dash arrow + impact rings) |

### Signature Identity

| Field | Value |
|-------|-------|
| **Primary Signature** | pincerFire — simultaneous lateral burst from both pincers |
| **Secondary Signature** | aimedBurst — phase 2 aimed delayed burst |
| **Rage Identity** | faster_bursts (tighter dash cooldown, faster pincer) |
| **Signature Candidate** | "Crab Clamp" — dash to flank + pincer burst + downward aimed spread |

### Phase Plan

```
introduction → pressure → recovery → crossfire → transition → desperation → finale
```

| Phase | HC-BD Type | Threat | Purpose |
|-------|-----------|--------|---------|
| Phase 1 (100%-66%) | introduction → pressure | Low | Teach dash + pincer identity |
| Phase 2 (66%-33%) | crossfire | Medium | Delayed burst + aimed spread |
| Phase 3 (33%-0%) | desperation | High | Radial ring + faster dash cooldown |

### Readability & Fairness

| Field | Value |
|-------|-------|
| **Fairness Bias** | high (most generous boss) |
| **Weakpoint Readability** | Phase 1 is generic (same aimed-spread as all bosses) |
| **Readability Score** | 8/10 |
| **Fairness Score** | 8/10 |
| **Overlap Risk** | Low (dashMode gates shooting) |
| **Spam Risk** | Very Low (dash cooldown + shoot timer) |

### Current Problems

| Severity | Problem |
|----------|---------|
| Medium | Phase 1 has no distinct identity — uses generic aimed-spread |
| Low | Dash → pincer is strong but feels like "the only thing" |
| Low | No recovery phase — just passive cooldown |

### Emotional Arc

| Attribute | Rating |
|-----------|--------|
| Introduction drama | Weak (no entrance performance) |
| Mid-fight tension | Medium (dash creates threat spikes) |
| Phase 3 escalation | Low-Medium (radial ring adds variety) |
| Death satisfaction | Medium (explosion + medal rain) |
| **Emotional Potential** | **6/10** — dash is memorable. Needs intro + recovery phases. |

---

## BOSS 2 — SERPENTRIX

### Identity Card

| Field | Value |
|-------|-------|
| **Display Name** | SERPENTRIX |
| **Boss ID** | 2 |
| **Pattern ID** | zigzag |
| **Level** | 10 |
| **HP** | 145 |
| **Archetype** | SWEEPER |
| **Role Hardcore** | Serpentine sweeper — wave denial + mine deployment |

### Pressure Profile

| Field | Value |
|-------|-------|
| **Primary Pressure** | Sweep (sinusoidal fan across arena) |
| **Secondary Pressure** | Area denial (mines) |
| **Pressure Style** | wave_sweep |
| **Pressure Intensity** | Medium (sustained, not bursty) |

### Mobility & Pacing

| Field | Value |
|-------|-------|
| **Mobility Style** | sinusoidal_patrol (double-wave serpentine) |
| **Pacing Style** | rhythmic (wave peaks and troughs) |
| **Recovery Bias** | wave_trough (natural gaps in oscillation) |
| **Telegraph Style** | lane_indicator (green burst + mine markers) |

### Signature Identity

| Field | Value |
|-------|-------|
| **Primary Signature** | rotatingFan — oscillating sweep fan across arena |
| **Secondary Signature** | delayedTrap — mine deployment with delayed activation |
| **Rage Identity** | faster_sweep_amplitude (wider, faster wave) |
| **Signature Candidate** | "Constrictor Coil" — sweep closes escape routes while mines activate in sequence |

### Phase Plan

```
introduction → pressure → recovery → area_denial → transition → desperation → finale
```

| Phase | HC-BD Type | Threat | Purpose |
|-------|-----------|--------|---------|
| Phase 1 (100%-66%) | introduction → pressure | Low | Sweep rhythm + downward fan |
| Phase 2 (66%-33%) | area_denial | Medium | Mine deployment + aimed burst alternation |
| Phase 3 (33%-0%) | desperation | High | Sine-wave arc + mine accumulation |

### Readability & Fairness

| Field | Value |
|-------|-------|
| **Fairness Bias** | medium (mines are subtle, wave is predictable) |
| **Weakpoint Readability** | Mines lack pre-landing telegraph — player must track drift |
| **Readability Score** | 7/10 |
| **Fairness Score** | 7/10 |
| **Overlap Risk** | Medium (mine accumulation + sweep fan) |
| **Spam Risk** | Very Low (phase 2 cycle gating, mine cap 6-8) |

### Current Problems

| Severity | Problem |
|----------|---------|
| Medium | Mines are passive — deployed and forgotten. No activation drama. |
| Medium | Phase 1 fan is undirected (no player tracking) → feels random |
| Low | Serpentine movement could be much more expressive with body segments |

### Emotional Arc

| Attribute | Rating |
|-----------|--------|
| Introduction drama | Weak (no entrance performance) |
| Mid-fight tension | Low-Medium (rhythmic sweep is relaxing) |
| Phase 3 escalation | Low (more bullets, same pattern shape) |
| Death satisfaction | Medium |
| **Emotional Potential** | **5/10** — rhythm is interesting but lacks tension peaks |

---

## BOSS 3 — ORBITAL

### Identity Card

| Field | Value |
|-------|-------|
| **Display Name** | ORBITAL |
| **Boss ID** | 3 |
| **Pattern ID** | rotate |
| **Level** | 15 |
| **HP** | 210 |
| **Archetype** | ORBITAL |
| **Role Hardcore** | Orbital satellite — elliptical movement + pulse expansion + tractor beam |

### Pressure Profile

| Field | Value |
|-------|-------|
| **Primary Pressure** | Surround/constrict (arcs from orbit) |
| **Secondary Pressure** | Pulse (radial burst ring) |
| **Pressure Style** | surround_constrict |
| **Pressure Intensity** | Medium-High (pulse mode spikes) |

### Mobility & Pacing

| Field | Value |
|-------|-------|
| **Mobility Style** | elliptical_orbit (variable radius orbit + direction reversal) |
| **Pacing Style** | cyclic (orbit → pulse → return → orbit) |
| **Recovery Bias** | orbit_apex (during normal elliptical orbit) |
| **Telegraph Style** | radial_ring (pulse warning ring + tractor beam column) |

### Signature Identity

| Field | Value |
|-------|-------|
| **Primary Signature** | orbitalPressure — arcs from orbiting position at player |
| **Secondary Signature** | laserSweep — tractor beam vertical sweep |
| **Rage Identity** | tighter_orbit_faster_pulse (faster orbit, more frequent pulses) |
| **Signature Candidate** | "Gravity Well" — tractor beam pulls attention + expanding pulse forces dodge |

### Phase Plan

```
introduction → pressure → recovery → crossfire → transition → rage → finale
```

| Phase | HC-BD Type | Threat | Purpose |
|-------|-----------|--------|---------|
| Phase 1 (100%-66%) | introduction → pressure | Low-Medium | Elliptical orbit + aimed arc |
| Phase 2 (66%-33%) | crossfire | Medium-High | Alternating side arcs + tractor beam |
| Phase 3 (33%-0%) | rage | Very High | Double rotating arcs + pulse + tractor synchronization |

### Readability & Fairness

| Field | Value |
|-------|-------|
| **Fairness Bias** | medium |
| **Weakpoint Readability** | Tractor beam vertical column is narrow — relies on ground telegraph |
| **Readability Score** | 8/10 |
| **Fairness Score** | 7/10 |
| **Overlap Risk** | Medium (tractor + pulse + arcs in phase 3) |
| **Spam Risk** | Low-Medium (pulse burst is dense but telegraphed 1500ms) |

### Current Problems

| Severity | Problem |
|----------|---------|
| Medium | Pulse mode feels random (probability 0.2%), not scripted |
| Low | Tractor + pulse are never synchronized — missed dramatic opportunity |
| Low | Phase 3 double arcs are symmetrical → lack variation |

### Emotional Arc

| Attribute | Rating |
|-----------|--------|
| Introduction drama | Medium (elliptical orbit is visually distinct) |
| Mid-fight tension | Medium (pulse mode creates spikes) |
| Phase 3 escalation | Medium-High (double arcs + pulse + tractor) |
| Death satisfaction | Medium-High (pulse death would be spectacular) |
| **Emotional Potential** | **7/10** — orbit + pulse is a strong core. Needs synchronization. |

---

## BOSS 4 — TENIENTE

### Identity Card

| Field | Value |
|-------|-------|
| **Display Name** | TENIENTE |
| **Boss ID** | 4 |
| **Pattern ID** | divebomb |
| **Level** | 19 |
| **HP** | 285 |
| **Archetype** | HUNTER |
| **Role Hardcore** | Aggressive commander — charge/impact/retreat cycle |

### Pressure Profile

| Field | Value |
|-------|-------|
| **Primary Pressure** | Chase burst (charge → impact → retreat loop) |
| **Secondary Pressure** | Downward aimed columns |
| **Pressure Style** | chase_burst |
| **Pressure Intensity** | High (charge is dramatic, impact burst is dense) |

### Mobility & Pacing

| Field | Value |
|-------|-------|
| **Mobility Style** | charge_retreat_cycle (patrol → telegraph → charge → impact → retreat) |
| **Pacing Style** | dramatic_loop (structured 5-state cycle) |
| **Recovery Bias** | post_charge_retreat (950ms enforced retreat) |
| **Telegraph Style** | charge_indicator (jitter + shake + 650ms telegraph + impact rings) |

### Signature Identity

| Field | Value |
|-------|-------|
| **Primary Signature** | pincerFire — dual-column aimed closure from lateral positions |
| **Secondary Signature** | escapeBait — apparent safe zone that closes during charge |
| **Rage Identity** | multi_charge_chains (faster, multi-directional charges) |
| **Signature Candidate** | "Commander's Wrath" — triple-charge chain with escalating impact radius |

### Phase Plan

```
introduction → pressure → chase → recovery → crossfire → transition → rage → finale
```

| Phase | HC-BD Type | Threat | Purpose |
|-------|-----------|--------|---------|
| Phase 1 (100%-66%) | introduction → pressure | Medium | Single column + first charge reveals |
| Phase 2 (66%-33%) | chase → crossfire | High | Dual column + more frequent charges |
| Phase 3 (33%-0%) | rage | Maximum | Triple column + rage charge chains |

### Readability & Fairness

| Field | Value |
|-------|-------|
| **Fairness Bias** | medium (charge has long telegraph, impact is warned) |
| **Weakpoint Readability** | All three phases use the same downward-spread shape (just different counts) |
| **Readability Score** | 8/10 |
| **Fairness Score** | 7/10 |
| **Overlap Risk** | Medium (charge + impact burst + columns) |
| **Spam Risk** | Low-Medium (charge is RNG-gated, retreat cooldown) |

### Current Problems

| Severity | Problem |
|----------|---------|
| Medium | Phase 1/2/3 hardcore patterns all use identical aimed-spread shape |
| Low | Charge trigger is pure RNG (0.4%/frame) — no intentional rhythm |
| Low | Retreat is passive — could be an opportunity for dramatic framing |

### Emotional Arc

| Attribute | Rating |
|-----------|--------|
| Introduction drama | Medium-High (first charge telegraph creates tension) |
| Mid-fight tension | High (charge is genuinely threatening) |
| Phase 3 escalation | Medium (triple column vs dual — minor change) |
| Death satisfaction | High (commander's defeat should feel earned) |
| **Emotional Potential** | **8/10** — charge/retreat loop is the most dramatic in the game |

---

## BOSS 5 — EMPERADOR

### Identity Card

| Field | Value |
|-------|-------|
| **Display Name** | EMPERADOR |
| **Boss ID** | 5 |
| **Pattern ID** | supreme |
| **Level** | 20 |
| **HP** | 450 |
| **Archetype** | EXECUTIONER |
| **Role Hardcore** | Imperial overlord — teleportation + minion summon + varied attack suite |

### Pressure Profile

| Field | Value |
|-------|-------|
| **Primary Pressure** | Multidirectional (teleport displacement + spread fan) |
| **Secondary Pressure** | Minion swarm (alien1 spawn every 10s) |
| **Pressure Style** | multidirectional_dominant |
| **Pressure Intensity** | Maximum (multi-axis threat at all times) |

### Mobility & Pacing

| Field | Value |
|-------|-------|
| **Mobility Style** | phased_evolution (majestic → aggressive → rage) |
| **Pacing Style** | dramatic_arc (slow build to explosive finale) |
| **Recovery Bias** | phase_transition_only (no mid-phase recovery) |
| **Telegraph Style** | imperial_glow (purple spread ring + teleport destination glow) |

### Signature Identity

| Field | Value |
|-------|-------|
| **Primary Signature** | arenaSplit — teleportation divides arena into threat zones |
| **Secondary Signature** | orbitalPressure — imperial spread fan from multiple angles |
| **Rage Identity** | ultimate_desperation_mode (pursuit + frequent teleport + minion spam) |
| **Signature Candidate** | "Imperial Judgment" — teleport above player → delayed column barrage |

### Phase Plan

```
introduction → pressure → crossfire → transition → area_denial → transition → rage → finale
```

| Phase | HC-BD Type | Threat | Purpose |
|-------|-----------|--------|---------|
| Phase 1 (100%-66%) | introduction → pressure | Medium | Majestic presence + imperial spread |
| Phase 2 (66%-33%) | crossfire → area_denial | High | Teleportation + aimed spread + minion summon |
| Phase 3 (33%-0%) | rage | Maximum | Pursuit + frequent teleport + all attacks amplified |

### Readability & Fairness

| Field | Value |
|-------|-------|
| **Fairness Bias** | low (final boss privilege — harder is acceptable) |
| **Weakpoint Readability** | Teleport shockwave on reappearance has no separate warning |
| **Readability Score** | 7/10 |
| **Fairness Score** | 6/10 |
| **Overlap Risk** | Medium-High (teleport + shooting + minions converge in phase 3) |
| **Spam Risk** | Medium (phase 3 spiral + wave + teleport + minion can stack) |

### Current Problems

| Severity | Problem |
|----------|---------|
| High | Teleport shockwave un-telegraphed — player must react in 0 frames |
| Medium | Minion summon has no pre-warning — instant new threat axis |
| Medium | Phase 1 is too mild for a final boss — needs imperial entrance |
| Medium | Phase 3 rage mode is good but could go harder (more dramatic framing) |

### Emotional Arc

| Attribute | Rating |
|-----------|--------|
| Introduction drama | Medium (teleport entrance could be spectacular) |
| Mid-fight tension | High (teleport creates genuine disorientation) |
| Phase 3 escalation | High (rage pursuit + frequent teleports) |
| Death satisfaction | Very High (final boss defeat should be climactic) |
| **Emotional Potential** | **9/10** — best dramatic arc in the game. Teleport is inherently theatrical. |

---

## Cross-Boss Identity Matrix

### Archetype Map

| Boss | Archetype | Reason |
|------|-----------|--------|
| CRABTRON | DUELIST | Lateral dash + pincer — direct, burst-based combat |
| SERPENTRIX | SWEEPER | Sinusoidal patrol + wave denial — wide arena coverage |
| ORBITAL | ORBITAL | Elliptical movement + surround pressure — natural fit |
| TENIENTE | HUNTER | Chase/charge/retreat cycle — most dramatic loop |
| EMPERADOR | EXECUTIONER | Varied suite + phase evolution + rage finale |

### Pressure Map

| Boss | Primary | Secondary | Intensity |
|------|---------|-----------|------------|
| CRABTRON | Burst (dash+pincer) | Lateral aimed burst | Low-Medium |
| SERPENTRIX | Sweep (wave fan) | Area denial (mines) | Medium |
| ORBITAL | Surround (orbit arcs) | Pulse (radial burst) | Medium-High |
| TENIENTE | Chase (charge loop) | Columns (aimed spread) | High |
| EMPERADOR | Multidirectional (teleport+spread) | Minion swarm | Maximum |

### Phase Plan Map (ideal future state)

| Boss | Intro | Main | Mid | Climax | Finale |
|------|-------|------|-----|--------|--------|
| CRABTRON | introduction | pressure+recovery | crossfire | desperation | finale |
| SERPENTRIX | introduction | pressure+recovery | area_denial | desperation | finale |
| ORBITAL | introduction | pressure+recovery | crossfire | rage | finale |
| TENIENTE | introduction | pressure+recovery+chase | crossfire | rage | finale |
| EMPERADOR | introduction | pressure+crossfire | area_denial | rage | finale |

### Signature Identity Map

| Boss | Primary | Secondary | Rage | Signature Candidate |
|------|---------|-----------|------|---------------------|
| CRABTRON | pincerFire | aimedBurst | faster_bursts | Crab Clamp |
| SERPENTRIX | rotatingFan | delayedTrap | faster_sweep_amplitude | Constrictor Coil |
| ORBITAL | orbitalPressure | laserSweep | tighter_orbit_faster_pulse | Gravity Well |
| TENIENTE | pincerFire | escapeBait | multi_charge_chains | Commander's Wrath |
| EMPERADOR | arenaSplit | orbitalPressure | ultimate_desperation_mode | Imperial Judgment |

### Fairness Map

| Boss | Fairness Bias | Fairness Score | Largest Unfair Risk |
|------|--------------|----------------|---------------------|
| CRABTRON | high | 8/10 | None significant |
| SERPENTRIX | medium | 7/10 | Mine accumulation (capped) |
| ORBITAL | medium | 7/10 | Tractor + pulse overlap |
| TENIENTE | medium | 7/10 | Charge RNG frequency |
| EMPERADOR | low | 6/10 | Teleport shockwave untelegraphed |

### Emotional Potential Map

| Boss | Intro | Mid | Escalation | Death | Overall |
|------|-------|-----|------------|-------|---------|
| CRABTRON | 4 | 5 | 4 | 5 | 5/10 |
| SERPENTRIX | 3 | 4 | 4 | 5 | 5/10 |
| ORBITAL | 5 | 5 | 6 | 6 | 7/10 |
| TENIENTE | 6 | 7 | 7 | 7 | 8/10 |
| EMPERADOR | 6 | 7 | 8 | 9 | 9/10 |

---

## Archetype Assignment Rationale

### Why CRABTRON = DUELIST (not Sweeper)
CRABTRON doesn't sweep the arena. It patrols laterally and punctuates with a single dash. The dash → pincer combo is a duelist pattern: close, strike, retreat. Sweeper would imply continuous coverage, which CRABTRON doesn't do.

### Why SERPENTRIX = SWEEPER (not Duelist)
SERPENTRIX doesn't have burst punctuation. It constantly oscillates, covering the arena with wave patterns. The mine deployment is area denial, not direct combat. Sweeper fits the sustained, rhythmic nature.

### Why ORBITAL = ORBITAL (direct match)
The archetype and the boss share the same name for a reason. Elliptical movement, surround pressure, pulse expansion, circular attacks — this is the archetype definition.

### Why TENIENTE = HUNTER (not Duelist)
TENIENTE's charge/impact/retreat loop is a hunting pattern. It tracks, charges, strikes, retreats. Duelist would imply more static engagement. Hunter captures the chase dynamic.

### Why EMPERADOR = EXECUTIONER (not Siege or Orbital)
EMPERADOR has the most varied attack suite, phase evolution, and dramatic arc. Executioner is the final-boss archetype with multidirectional pressure and rage finale. Siege would imply static behavior — EMPERADOR evolves.

---

## Profile Mapping Complete

All 5 bosses now have:
- Official HC-BD archetype
- Pressure/mobility/pacing/rage/telegraph profile
- Signature attack candidates (primary + secondary)
- Phase plan (ideal future state)
- Recovery philosophy
- Fairness priority
- Weakpoint identification
- Emotional potential assessment

**Ready for HC-BD runtime profile integration (boss-director.js expansion).**
