# HC-CAL-01A — Casual Survival Audit Baseline

**Phase:** HC-CAL (Calibration)  
**Status:** Active (baseline established)  
**Date:** 2026-05-22  
**Dependency:** HC-PT (complete), HC-INT (complete), all frozen foundation  

---

## A. Overall Survival Feel

### Intensity Assessment

| Stage range | Intensity | Sustainability | Notes |
|------------|-----------|---------------|-------|
| Levels 1-4 (early) | 0.2-0.4 | ✅ Very sustainable | Warmup feels like warmup. Good. |
| Levels 5 (CRABTRON) | 0.6-0.8 | ✅ Manageable for first boss | Tutorial boss — dies quickly (95 HP) |
| Levels 6-9 (mid) | 0.3-0.6 | ✅ Good alternation | Post-boss dip (level 6) helps recovery |
| Levels 10 (SERPENTRIX) | 0.7-0.85 | ⚠️ Noticeable step up | 145 HP, sweeping patterns. Casual may die here. |
| Levels 11-14 (late-mid) | 0.4-0.7 | ✅ Good sawtooth | KAMIKAZE RUSH at 12 is intense but brief |
| Levels 15 (ORBITAL) | 0.75-0.9 | ⚠️ Hard | Ring patterns + 210 HP. Tight dodging required. |
| Levels 16-18 (late) | 0.7-0.9 | ⚠️ Sustained high | SPLITTER STORM → BULLET STORM → IMPERIAL GUARD. Dense. |
| Levels 19-20 (final) | 0.85-1.0 | ❌ Exhausting | TENIENTE → EMPERADOR back-to-back. No breather. |

### Overall Verdict

**Early game (1-5):** ✅ Well-paced. Casual player feels competent.  
**Mid game (6-10):** ✅ Good alternation. Bosses are challenging but fair.  
**Late-mid (11-15):** ⚠️ Intensity ramp accelerates. ORBITAL is a filter.  
**Late game (16-20):** ❌ Exhausting. Four consecutive high-intensity levels with inadequate recovery.

### Score: 7.5/10 for casual survival feel.

---

## B. Fairness Perception

### Death Attribution Analysis (theoretical — based on system audit)

| Death cause | Fairness | Frequency (casual) | Notes |
|------------|----------|-------------------|-------|
| Regular enemy bullet | FAIR | High | HC-RD readability makes bullets visible |
| Diver ambush | FAIR | Medium | Divers have visual tells and movement patterns |
| Boss pattern (CRABTRON) | FAIR | Medium | Dash + pincer fire telegraphed |
| Boss pattern (SERPENTRIX) | FAIR | Medium-High | Sweeping patterns are readable |
| Boss pattern (ORBITAL) | ⚠️ AMBIGUOUS | High | Ring patterns can feel like "wall" to casuals |
| EMPERADOR teleport | ⚠️ AMBIGUOUS | Medium | Teleport + 0-frame shockwave. HC-BD mitigated but still fast. |
| EMPERADOR minion spawn | FAIR | Medium | Minions have spawn flash timer |
| Level 17 density | ⚠️ AMBIGUOUS | High | Survival corridor — bullets can feel like "curtain" |
| Set piece formation | FAIR | Low | Formations are scripted and predictable |

### Perceived Rank Spikes

Casual player may not understand why bullets get faster. HC-RK rank increases silently. The only visible indicator is the subtle HUD text and multiplier display.

**Risk:** Player at rank 3-4 may perceive the same pattern as "suddenly harder" without understanding rank is dynamic. Not unfair — but not communicated well.

### Perceived Cheap Deaths

| Scenario | Actual fairness | Perception risk |
|----------|----------------|-----------------|
| Diver from behind (no telegraph) | Possibly FAIR (diver has visual approach) | Player may feel "blind-sided" |
| Boss bullet at rank 5 speed | FAIR (within caps) | Player may feel "unreadable" |
| Teleport + instant attack | ⚠️ | Player may feel "impossible" |
| Bullet density at level 17 | FAIR (HC-RD preserved) | Player may panic → PANIC-NO-READ |

### Fairness Verdict

| Aspect | Score |
|--------|-------|
| Bullet readability at casual rank | ✅ 8/10 |
| Telegraph consistency | ✅ 8/10 |
| Spawn fairness | ✅ 9/10 |
| Boss attack fairness | ⚠️ 7/10 (EMPERADOR teleport) |
| Rank communication | ⚠️ 6/10 (invisible to casual player) |

---

## C. Pressure Sustainability

### Accumulative Pressure Map

```
Level  1: ██░░░░░░░░  0.2  — calm
Level  2: ███░░░░░░░  0.3  — slight rise
Level  3: █████░░░░░  0.5  — PINCER ASSAULT, spike but short
Level  4: ████░░░░░░  0.4  — swarm, sustains
Level  5: ████████░░  0.7  — CRABTRON, peak
Level  6: ███░░░░░░░  0.3  — post-boss lull. Good recovery.
Level  7: ██████░░░░  0.6  — FORTRESS LINE
Level  8: █████░░░░░  0.5  — tank column
Level  9: █████░░░░░  0.5  — dark sector, flat
Level 10: ████████░░  0.8  — SERPENTRIX, peak
Level 11: ███░░░░░░░  0.3  — post-boss lull. Good recovery.
Level 12: ███████░░░  0.7  — KAMIKAZE RUSH
Level 13: █████░░░░░  0.5  — patrol disrupted
Level 14: ██████░░░░  0.6  — war zone
Level 15: █████████░  0.85 — ORBITAL, peak
Level 16: ████████░░  0.8  — SPLITTER STORM
Level 17: █████████░  0.9  — BULLET STORM, sustained max
Level 18: ████████░░  0.85 — IMPERIAL GUARD
Level 19: █████████░  0.9  — TENIENTE, no breather
Level 20: ██████████  1.0  — EMPERADOR, climax
```

### Exhausting Sections

| Section | Why exhausting | Duration | Recovery after |
|---------|---------------|----------|----------------|
| Level 17 survival corridor | Max density, no relief for 35s | 35s | 12s relief at 0.25 intensity |
| Level 19→20 boss chain | Back-to-back bosses, 900ms pause between | 2-4 min total | Game ends |
| Level 16→17→18 sequence | 3 consecutive high-intensity levels | 8-12 min | Level 19 boss |

### Breathing Room

| Section | Quality | Notes |
|---------|---------|-------|
| Level 4→5 transition (pre-CRABTRON) | ✅ Good | Prelude section in stage plan |
| Level 6 post-boss | ✅ Good | Collapse curve, intentionally lower |
| Level 9→10 transition (pre-SERPENTRIX) | ✅ Good | War zone prelude |
| Level 14→15 transition (pre-ORBITAL) | ✅ Good | Multiple relief sections in war zone |
| Level 18→19 transition | ❌ None | IMPERIAL GUARD ends → immediate TENIENTE |
| Level 19→20 transition | ❌ None | Boss chain, no relief between |

### Pressure Verdict

| Aspect | Score |
|--------|-------|
| Early game pressure | ✅ 9/10 |
| Mid game sawtooth | ✅ 8/10 |
| Post-boss relief | ✅ 8/10 |
| Late game marathon | ❌ 4/10 (levels 16-20) |
| Boss chain fatigue | ❌ 3/10 (19→20) |

---

## D. Recovery Satisfaction

### Comeback Viability

| Scenario | Recoverable? | Time to recover |
|----------|-------------|-----------------|
| Hit during regular wave (rank 2-3) | ✅ Yes | ~20s (4s RECOVERING + 15s to rebuild) |
| Hit during boss (rank 3-4) | ✅ Yes | ~30s (recovery + boss pattern reading) |
| Hit during level 17 survival | ⚠️ Hard | Section is dense, recovery window is tight |
| Death ×2 during same level | ⚠️ Harder | Rank drops −16, multiplier compound loss |
| Death at EMPERADOR | ⚠️ Hard | Final boss, pressure sustained |

### Multiplier Recovery

Casual player won't notice multiplier recovery. Multiplier is a scoring concept. For survival-focused players, the meaningful recovery metrics are:
- Rank cooldown (4s RECOVERING)
- Invincibility frames (2s)
- Bullet speed reduction (governor blocks rank effects during RECOVERING)

### Emotional Recovery

| After | Typical emotional state | Notes |
|-------|----------------------|-------|
| First death in early game | "Okay, that's fine" | Rank 1→0 recovery, barely noticeable |
| Death at CRABTRON | "I'll get him next time" | Tutorial boss, retry motivation strong |
| Death at SERPENTRIX | "That pattern is tricky" | Sweep attacks require learning |
| Death chain at ORBITAL | "This boss is hard" | Ring patterns filter casual players |
| Death at level 17 survival | "I can't handle this density" | May feel overwhelmed |
| Death at EMPERADOR | "Almost had it!" or "Finally it's over" | Depends on closeness to victory |

### Recovery Verdict

| Aspect | Score |
|--------|-------|
| Rank recovery | ✅ 8/10 |
| Multiplier recovery (for score players) | ✅ 7/10 |
| Emotional recovery (casual) | ✅ 7/10 |
| Late-game recovery | ⚠️ 5/10 (too little breathing room) |
| Boss chain recovery | ❌ 3/10 (19→20 no breather) |

---

## E. Readability Under Stress

### Casual Bullet Parsing

| Density | Casual parsing | Risk |
|---------|---------------|------|
| < 10 bullets | ✅ Easy | No risk |
| 10-20 bullets | ✅ Manageable | Low risk |
| 20-30 bullets | ⚠️ Challenging | PANIC-NO-READ risk for casuals |
| > 30 bullets | ❌ Overwhelming | Casual player stops tracking, PANIC |

### Visual Competition

| Element | Competes with | Severity for casual |
|---------|--------------|-------------------|
| Medal popups | Enemy bullets | LOW — small font, alpha-capped |
| Graze spark | Bullets | LOW — few particles |
| Explosion particles | Bullets | LOW-MEDIUM during boss death |
| Score HUD | Nothing (peripheral) | None — positioned safely |
| Debug overlays | Gameplay center | None — flag-gated, right side |
| Nebula background | White/light bullets | LOW — HC-RD alpha caps + outlines |
| Speed lines | Bullet trajectories | LOW — HC-RD alpha suppression |

### Mobile Readability (casual on phone)

| Element | Desktop | Mobile | Gap |
|---------|---------|--------|-----|
| Bullet size | Readable | ⚠️ Small | HC-RD mobile scale boost helps |
| Boss sprites | Full detail | ⚠️ Detail loss | BOSS_READABILITY_MULT × 1.12 |
| Popup text | 5-7px | ⚠️ Very small | May be unreadable |
| HUD text | 6-9px | ⚠️ Small | HC-RD hudFontBoost = 1 |

### Readability Verdict

| Aspect | Score |
|--------|-------|
| Desktop readability | ✅ 8/10 |
| Density readability (casual) | ⚠️ 6/10 (struggles at >20 bullets) |
| Popup interference | ✅ 9/10 |
| Mobile readability | ⚠️ 5/10 (small screen inherent limitation) |

---

## F. Flow & Cadence

### Overall Rhythm

```
Sections per level (average): 3-5
Boss levels (5, 10, 15, 19, 20): 2 sections (prelude + climax)
Set piece levels (3, 7, 12, 16, 18): 3-4 sections

Good cadence levels: 1, 3, 5, 7, 10, 12, 14, 15
Flat cadence levels: 2, 6, 8, 9, 11, 13
Exhausting cadence: 16, 17, 18, 19, 20
```

### Pacing Emotional Assessment

| Level | Emotional label | Why |
|-------|----------------|-----|
| 1 | CALM → CURIOUS | First enemies, learning |
| 3 | ALERT → EXCITED | First set piece, memorable |
| 5 | INTENSE → TRIUMPHANT | First boss, celebration |
| 6 | RELIEVED | Post-boss breather |
| 10 | DETERMINED | SERPENTRIX tests pattern reading |
| 12 | ENERGIZED | KAMIKAZE RUSH, fast and fun |
| 15 | STRESSED → RELIEVED | ORBITAL hard, satisfaction on kill |
| 17 | OVERWHELMED | BULLET STORM, density max |
| 19 | EXHAUSTED | TENIENTE, boss fight fatigue |
| 20 | CLIMAX | EMPERADOR, final test |

### Flat Sections

| Level | Type | Why flat | Quick fix potential |
|-------|------|----------|-------------------|
| 2 | Normal | Same enemies as level 1, no new identity | Differentiate enemy types |
| 6 | Post-boss | Intentional collapse — but feels empty | Add mini-objective |
| 8-9 | Normal | Between set pieces, no distinction | Give Dark Sector identity |
| 11 | Post-boss | Same as level 6 pattern | Add mini-ambush |
| 13 | Normal | Patrol Disrupted has potential — ambush needs payoff | Stronger ambush |

### Flow Verdict

| Aspect | Score |
|--------|-------|
| Early game flow | ✅ 8/10 |
| Mid game flow | ✅ 7/10 |
| Late game flow | ⚠️ 5/10 (sustained high, no relief) |
| Boss flow | ✅ 8/10 |
| Set piece flow | ✅ 8/10 |

---

## G. Fatigue Analysis

### Fatigue Accumulation per Session

| Session length | Casual player state | Accumulation |
|---------------|-------------------|--------------|
| 0-10 min (levels 1-5) | Fresh, engaged | None |
| 10-20 min (levels 6-10) | Slight fatigue, still engaged | Low |
| 20-35 min (levels 11-15) | Noticeable fatigue | Medium |
| 35-50 min (levels 16-20) | Significant fatigue | High |
| 50+ min (multiple runs) | May quit session | Critical |

### Sensory Exhaustion Sources

| Source | Contribution to fatigue |
|--------|----------------------|
| Constant visual density (level 16+) | HIGH |
| Repetitive wave patterns (formations rotate every 4) | MEDIUM |
| No visual palette change between some levels | MEDIUM |
| Boss repeated deaths → frustration | MEDIUM-HIGH |
| Rank 5 + level 20 density | HIGH |
| Long session without break (> 40 min) | HIGH |

### Fatigue Prevention (current)

| Protection | Effectiveness |
|-----------|--------------|
| Level transitions (900ms pause) | ✅ Adequate for early/mid game |
| Post-boss collapse levels (6, 11) | ✅ Good idea, need content in them |
| Relief sections in stage plans | ✅ Good design, need enforcement in gameplay |
| Anti-camping suppression | ✅ Works for scoring, irrelevant for survival |
| Rank decay (prevents rank 5 indefinitely) | ✅ Works passively |

### Fatigue Verdict

| Aspect | Score |
|--------|-------|
| Early game fatigue | ✅ 9/10 |
| Mid game fatigue | ✅ 7/10 |
| Late game fatigue | ❌ 4/10 (levels 16-20) |
| Session sustainability | ⚠️ 5/10 (recommend 30 min max for casual) |

---

## H. Retry Motivation

### What Generates Replay Urge

| Trigger | Effectiveness for casual |
|---------|------------------------|
| "I almost beat that boss" | ✅ Very strong |
| "I want to see the next level" | ✅ Strong |
| "My score was higher last time" | ⚠️ Weak (casuals don't track score) |
| Rank level-up (visual flash) | ⚠️ Weak (may not notice) |
| Medal FEVER | ⚠️ Weak (casuals don't chase medals) |
| Boss variety (5 unique bosses) | ✅ Strong |
| Set piece identity (names + formations) | ✅ Strong |

### What Destroys Retry Desire

| Trigger | Impact on casual |
|---------|-----------------|
| Death that feels CHEAP | ❌ High — trust broken |
| Boss that feels impossible (no learning) | ❌ High — frustration |
| Long empty recovery sections (boredom) | ⚠️ Medium — disengagement |
| Sustained high density with no hope | ❌ High — DRAINING |
| Repeated death same spot without learning | ❌ High — learned helplessness |

### Retry Verdict

| Aspect | Score |
|--------|-------|
| Boss retry motivation | ✅ 8/10 |
| Wave retry motivation | ✅ 7/10 |
| Score retry motivation (casual) | ⚠️ 4/10 (casuals score-blind) |
| Long-session retry | ⚠️ 5/10 (fatigue wins) |

---

## I. Friction Point Classification

### Initial Friction Map

| # | Type | Location | Severity | Frequency | Emotional impact |
|---|------|----------|----------|-----------|-----------------|
| 1 | **CHEAP** | EMPERADOR teleport shockwave | MEDIUM | Every EMPERADOR fight | "That was too fast" |
| 2 | **OVERLOAD** | Level 17 survival corridor | HIGH | Once per run | Exhaustion, panic |
| 3 | **DRAINING** | Levels 16→17→18→19→20 sequence | HIGH | Every late game session | "I need a break" → session end |
| 4 | **FLOW-BREAK** | Level 19→20 boss chain (900ms pause) | MEDIUM | Once per run | "Already?" — no mental reset |
| 5 | **RECOVERY-BAD** | Multiplier reset on late-game death | LOW | Varies | Irrelevant for casual survival |
| 6 | **NOISY** | Level 17 at rank 4-5 | MEDIUM | Variable | "I can't see" (casual parse limit) |
| 7 | **EMPTY** | Level 6 post-boss relief | LOW | Every run | "Why is nothing happening?" |
| 8 | **EMPTY** | Level 11 post-boss relief | LOW | Every run | Same as level 6 |
| 9 | **PANIC-LOOP** | Level 17 + rank 3+ | MEDIUM | High-skill casual runs | Overwhelm spiral |
| 10 | **CLARITY-LOSS** | Level 20 EMPERADOR at rank 4-5 | LOW | Rare (governor blocks at rank 5) | "Too much" |

---

## J. Initial Calibration Candidates (DO NOT IMPLEMENT YET)

### Timing Candidates

| Candidate | Why | Source |
|-----------|-----|--------|
| Extend Level 19→20 transition pause | Boss chain needs breather | OVERLOAD #3, #4 |
| Slightly extend relief sections in late game | Fatigue accumulation #3 | Stage plan durationMs |
| Add relief between IMPERIAL GUARD and TENIENTE | No breather before level 19 boss | ST stage plan level 18 |

### Density Candidates

| Candidate | Why | Source |
|-----------|-----|--------|
| Level 17 survival corridor: consider micro-relief | Casual parsing limit exceeded #6, #9 | HC-WC enforcement |
| Level 16 splitter storm: slight density reduction | Late-game marathon start #3 | Stage plan |

### Recovery Candidates

| Candidate | Why | Source |
|-----------|-----|--------|
| Add content to post-boss levels (6, 11) | Empty sections #7, #8 | Stage plan section types |
| Consider mini setpiece in post-boss levels | Flow feels flat | ST taxonomy |

### Readability Candidates

| Candidate | Why | Source |
|-----------|-----|--------|
| EMPERADOR teleport: add 200ms pre-teleport flash | CHEAP perception #1 | HC-BD signature |
| Level 20 density: verify HC-RD compliance at rank 4 | Clarity at endgame | HC-RD audit |

### Cadence Candidates

| Candidate | Why | Source |
|-----------|-----|--------|
| Differentiate levels 1 and 2 | Both feel identical | ST identity |
| Give Dark Sector (level 9) stronger identity | Flat section between set pieces | ST identity |
| Give level 13 ambush stronger payoff | Patrol Disrupted has potential | ST stage plan |

---

## K. Summary

### Overall Casual Survival Score: 7.2/10

| Domain | Score |
|--------|-------|
| Overall feel | 7.5 |
| Fairness | 7.5 |
| Pressure sustainability | 6.5 |
| Recovery satisfaction | 6.5 |
| Readability under stress | 7.0 |
| Flow & cadence | 7.0 |
| Fatigue control | 6.0 |
| Retry motivation | 7.0 |

### Top 3 Issues

1. **Levels 16-20 marathon** — Late game lacks recovery. Four consecutive high-intensity sections drain casual players.
2. **Level 19→20 boss chain** — Back-to-back bosses with 900ms pause. No mental reset. Exhaustion.
3. **Level 17 survival corridor** — Casual parsing limit exceeded at >20 bullets. PANIC-NO-READ risk.

### Top 3 Strengths

1. **Boss variety and identity** — 5 unique bosses with distinct mechanics. Strong emotional peaks.
2. **Early-mid game pacing** — Sawtooth works. Alternation works. Relief exists.
3. **HC-RD readability** — Bullet outlines, alpha floors, priority layers. Foundation is solid.

### Next Steps
- HC-CAL-02: Score Play Audit  
- HC-CAL-03: Elite/Hardcore Audit  
- HC-CAL-04: Calibration Tuning Pass
