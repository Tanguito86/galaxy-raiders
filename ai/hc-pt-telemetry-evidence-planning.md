# HC-PT-06 — Telemetry & Evidence Planning

**Phase:** HC-PT  
**Status:** Active (planning established)  
**Date:** 2026-05-22  
**Dependency:** HC-PT-05 (methodology), HC-PT-04 (pacing), HC-PT-03 (friction), HC-PT-02 (taxonomy), HC-PT-01A (framework)

---

## 1. Telemetry Philosophy

### Why Hardcore Telemetry Matters

Hardcore shmups live and die by **feel**. But "feel" alone is not actionable for tuning. Telemetry bridges the gap between subjective experience and objective calibration.

| Without telemetry | With telemetry |
|-------------------|---------------|
| "This section feels unfair" | "3/5 testers died within 2s of section start, 0 retries, classified CHEAP" |
| "Rank 5 is too hard" | "Governor blocks at rank 5: 12 blocks in 5 min session. 8 were boss_ceiling_exceeded." |
| "Score doesn't matter" | "Multiplier uptime 0% across 3 Score Play testers. Median chain: 2." |

### Casual Metrics vs Arcade Metrics

| Casual metric | Arcade metric |
|--------------|---------------|
| Retention (days played) | Retry frequency (seconds between death and restart) |
| Session length | Death → quit timing |
| Difficulty rating (1-10) | Death location clustering + fairness classification |
| "Was it fun?" (NPS) | Greed participation rate, multiplier uptime %, score route adoption |

### Why Retention Alone Doesn't Work

Retention tells you **that** someone played. It doesn't tell you **why** they stopped.

- Player played 10 sessions: could be obsession, could be frustration-fueled trying.
- Player stopped after 2 sessions: could be satisfaction, could be silent abandonment.
- Without emotional telemetry, retention is a number without meaning.

### Combining Quantitative + Emotional Evidence

| Quantitative | Emotional | Combined value |
|-------------|-----------|----------------|
| Death count: 4 in level 7 | Player verbalized "I can't see anything" | HIGH NOISY + READABILITY issue |
| Retry time: 2s after death | Player said "almost had it" | FAIR death, strong motivation |
| Multiplier: ×1.0 entire session | Player never looked at score HUD | SCORE-DEAD confirmed |
| Quit after boss: 3/5 testers | Player exhaled, said "finally" | CLIMAX-WEAK or DRAINING |

---

## 2. Evidence Hierarchy

| Level | Definition | Confidence | When to act |
|-------|-----------|-----------|-------------|
| **ANECDOTAL** | Single tester, single session. One observation. | LOW | Never. Collect more data. |
| **REPEATED OBSERVATION** | Same tester, multiple sessions. OR multiple testers, single observation. | LOW-MEDIUM | If severity HIGH, investigate. If MEDIUM, wait. |
| **REPRODUCIBLE ISSUE** | 3+ testers same classification. OR 3+ sessions same tester. | MEDIUM | Action justified for MEDIUM+ severity. |
| **TELEMETRY-SUPPORTED** | Quantitative data + emotional classification agree. | HIGH | Action strongly justified. |
| **SYSTEMIC PATTERN** | Issue persists across all tester profiles and test types. | HIGH | Must fix. Blocking for release if severity HIGH+. |
| **BLOCKING ISSUE** | CRITICAL or HIGH severity with systemic evidence. | VERY HIGH | Reopen freeze, fix, re-audit. |

### Confidence Thresholds for Action

| Severity | Minimum evidence level needed |
|----------|------------------------------|
| CRITICAL | ANECDOTAL (act immediately for crashes/softlocks) |
| HIGH | REPRODUCIBLE ISSUE (3+ testers) |
| MEDIUM | TELEMETRY-SUPPORTED |
| LOW | SYSTEMIC PATTERN (defer otherwise) |
| OBSERVATION | No action. Document. |

---

## 3. Official Telemetry Domains

### 3.1 Survival Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| Death locations (level + section) | Fairness hotspots, CHEAP clustering | Death may be skill issue, not game issue |
| Death timing (time into section) | SPIKE-BAD detection (death < 2s) | Ambush sections intentionally spike |
| Repeated death zones (>3 deaths same spot) | Learning failure — FAIR or READABILITY? | Some players don't adapt quickly |
| Death count trend (per run) | Fatigue accumulation detection | Count increases naturally with difficulty |

### 3.2 Panic Behavior Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| Movement quality drop (erratic, random) | PANIC-NO-READ onset | Panic is sometimes intentional (climax) |
| Shooting stops during density | Cognitive overload | Player may be repositioning |
| Gaze fixation on ship (stops scanning) | Visual overload | Momentary fixation is normal |
| Death within 1s of panic onset | Unreadable chaos | Correlation ≠ causation |

### 3.3 Readability Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| "I can't see" verbalizations | VISUAL-CONFLICT or NOISY | Player may have poor vision |
| Reaction to non-threats (dodging stars) | VISUAL-CONFLICT | Visual learning curve for new players |
| Threat missed on screen (player didn't react) | NOISY or bullet camouflage | Attention lapse, not visual issue |
| Squinting / leaning forward | READABILITY strain | Player may lean naturally during intensity |

### 3.4 Recovery Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| Retry time > 30s after death | RECOVERY-BAD potential | Player may be analyzing, not despairing |
| Run abandonment after 1st death | RECOVERY-BAD confirmed | Some testers naturally restart to optimize |
| Multiplier rebuild time > 60s | Penalty too harsh | Elite players rebuild faster |
| Player plays passively after death | RECOVERY-BAD (traumatized) | Player may be conserving resources |

### 3.5 Score Behavior Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| Multiplier at ×1.0 entire session | SCORE-DEAD | Tester may be survival-focused |
| Medal chain never exceeds 3 | GREEDLESS | Tester may not understand medals |
| Aggression % < 5% | SAFE-BORING | Player may prefer safe playstyle |
| Graze count = 0 per session | GREEDLESS | Player may not know graze exists |

### 3.6 Greed Behavior Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| Greed attempts per minute | GREED-TENSION health | Test type may skew (greed test vs survival test) |
| Death during greed attempt | Greed punishment severity | Greed is intentionally risky |
| Greed avoidance after 1 death | RECOVERY-BAD spillover | Natural caution after death |
| Greed celebration (verbal) | Score temptation working | N/A — this is positive |

### 3.7 Fatigue Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| Error rate trend upward over session | FATIGUE accumulation | Later levels are harder naturally |
| Decreasing session length over time | DRAINING | Player may have real-life time constraints |
| Score engagement drops (late session) | SCORE fatigue | Normal at session end |
| Player checks distractions (phone, clock) | FATIGUE / EMPTY | Player habits vary |

### 3.8 Pacing Domain

| Event | What it reveals | False positive risk |
|-------|----------------|-------------------|
| No relief sections detected in >90s | RELIEF starvation | Overload curve stages are intentionally long |
| Emotional flatline (player stops reacting) | STATIC or NON-MEMORABLE | Some players are stoic |
| Post-climax "that's it?" reaction | CLIMAX-WEAK | Boss may have been easy for skilled player |
| Player doesn't notice boss death | CLIMAX-WEAK confirmed | Distraction, not game issue |

---

## 4. Recommended Observable Events

| # | Event | Reveals | Interpretation | Friction link |
|---|-------|---------|---------------|---------------|
| 1 | Death within 2s of section start | SPIKE-BAD | Threat had no buildup | SPIKE-BAD, CHEAP |
| 2 | Death repeated 3+ times same spot | Learning failure | FAIRNESS or READABILITY issue | CHEAP or NOISY |
| 3 | Panic movement (random, erratic) | PANIC-NO-READ | Density exceeds parsing capacity | NOISY, OVERLOAD |
| 4 | Diving for medal → death | Greed calibration | Greed too punishing or risk was worth it | GREED-TENSION |
| 5 | Medal offscreen miss → chain drop | Chain anxiety | Decay too harsh or player routing failed | SCORE-OPPRESSIVE |
| 6 | Recovery hesitation (>30s before retry) | RECOVERY-BAD | Death too demoralizing | RECOVERY-BAD |
| 7 | Quit after death (immediate) | RECOVERY-BAD or CHEAP | Death felt unfair or unrecoverable | CHEAP, RECOVERY-BAD |
| 8 | Quit after boss (within 30s of kill) | CLIMAX-WEAK or DRAINING | Boss didn't deliver | CLIMAX-WEAK |
| 9 | Score HUD glances decrease over session | SCORE fatigue | Scoring engagement drops with fatigue | SCORE-DEAD |
| 10 | "I can't see" verbalizations | VISUAL-CONFLICT / NOISY | Bullets blend with background | NOISY, VISUAL-CONFLICT |

---

## 5. Hardcore Metrics Planning

### Retry Frequency

| Value | Interpretation |
|-------|---------------|
| < 3s (instant) | Death was FAIR. Strong motivation. |
| 3-10s | Death registered. Still motivated. |
| 10-30s | Significant setback. Monitor. |
| > 30s | RECOVERY-BAD risk. Player may abandon. |
| No retry (quit) | RECOVERY-BAD or CHEAP confirmed. |

### Quit Timing

| Timing | Interpretation |
|--------|---------------|
| After death, immediate | RECOVERY-BAD or CHEAP |
| After boss kill | CLIMAX-WEAK (no payoff) or DRAINING |
| Mid-session, no death | FATIGUE, EMPTY, or STATIC |
| After long session | Normal. Satisfied exhaustion. |

### Greed Participation

| Metric | Healthy | Suspicious | Critical |
|--------|---------|-----------|----------|
| Greed attempts/min | 3+ | 1-2 | 0 |
| Deaths during greed (%) | < 20% | 20-40% | > 40% |
| Greed celebration (verbal) | Frequent | Rare | Never |

### Score Route Adoption

| Metric | Healthy | Suspicious | Critical |
|--------|---------|-----------|----------|
| Multiplier avg | > ×1.3 | ×1.1-1.3 | ×1.0 |
| Medal chain peak | > 10 | 5-10 | < 5 |
| Aggression % | > 10% | 5-10% | < 5% |
| Graze per session | > 5 | 1-5 | 0 |

### Fatigue Accumulation

| Metric | Healthy | Suspicious | Critical |
|--------|---------|-----------|----------|
| Error rate trend | Flat or decreasing | Slight increase | Sharp increase |
| Session length trend | Stable or increasing | Slight decrease | Sharp decrease |
| Score engagement trend | Stable | Decreasing late session | Never engaged |

---

## 6. Emotional Evidence System

| Evidence type | How to detect | How to validate | Misinterpretation risk |
|--------------|---------------|-----------------|----------------------|
| **Hesitation** | Player pauses before action (medal, movement) | Multiple instances in same context | Player may be planning, not hesitating |
| **Greed avoidance** | Player bypasses reachable medals, never grazes | Cross-reference with Score Play test | Player may prioritize survival |
| **Recovery paralysis** | After death, player plays worse, not better | Compare pre-death vs post-death performance | Some sections are naturally harder |
| **Route collapse** | Player abandons established route after setback | Multiple instances, same pattern | Route change may be adaptation |
| **Panic freezing** | Player stops moving, gets hit | Death within 500ms of stop | Brief pause is normal positioning |
| **Emotional disengagement** | Player stops reacting to game events (score, FEVER, boss) | Cross-reference with session timing | Player may be focused, not disengaged |
| **Obsession loops** | Player retries same section 10+ times | Extended session, specific section focus | Positive — indicates fair, engaging challenge |
| **Frustration escalation** | Verbal complaints increase in frequency and intensity | Multiple sessions, same section | Frustration may be at self, not game |

---

## 7. Pacing Telemetry Planning

### Detecting Pacing Collapse

| Indicator | Threshold | Action |
|-----------|-----------|--------|
| 3+ consecutive PRESSURE sections without RELIEF | 1 occurrence | MEDIUM — check stage plan |
| Emotional flatline > 60s (no state change observed) | 1 occurrence | LOW — observe, may be normal |
| Player cannot identify "hardest part" of level | 2+ testers | MEDIUM — climax not distinct |
| No visible relaxation during labeled relief | 2+ sessions | HIGH — relief is fake |

### Detecting Relief Starvation

| Indicator | Threshold |
|-----------|-----------|
| Time since last RELIEF section > 90s | 1 occurrence = MEDIUM |
| Player verbalizes "I need a break" during wave | 1 occurrence = HIGH |
| Error rate spike in section following long pressure | 1 occurrence = MEDIUM |

---

## 8. Replay Evidence Methodology

### Valid Evidence in Replay

| Evidence | Extraction method | Confidence |
|----------|------------------|-----------|
| **Death location heatmap** | Aggregate death coordinates across sessions | HIGH — quantitative |
| **Frame-window analysis** (death event ± 30 frames) | What was on screen when player died | HIGH — reveals CHEAP/FAIR distinction |
| **Movement hesitation** (velocity drops, changes direction erratically) | Frame-by-frame movement analysis | MEDIUM — can be skill, not game |
| **Route instability** (player changes medal route mid-level) | Compare routes across runs | MEDIUM — adaptation or confusion? |
| **Target priority breakdown** (which enemy player shoots first) | Track kill order | LOW — complex, player preference |

---

## 9. Telemetry Failure Modes

| Failure mode | Symptom | Prevention |
|-------------|---------|-----------|
| **Metric obsession** | Tuning decisions driven by numbers, not feel | Always pair quantitative data with emotional classification |
| **Casualization by data** | Nerfing difficulty because metrics show "high death rate" | Death rate is expected in hardcore. Classify WHY players die. |
| **Score-player bias** | Tuning for optimizers, ignoring survival players | Cross-reference Score Play tests with Survival tests |
| **Overreacting to noise** | Tuning after 1 tester reports an issue | Minimum REPRODUCIBLE ISSUE level for action |
| **False fairness conclusions** | Assuming all concentrated deaths are CHEAP | Verify: was threat telegraphed? Was there an escape route? |
| **Overfitting telemetry** | Adding too many metrics, analysis paralysis | Focus on top 10 events (Section 4). Defer rest. |

---

## 10. Tuning Validation Planning

```
BASELINE (current state, with evidence)
    │
PLAYTEST (change applied, same test type, same tester profile)
    │
EVIDENCE (classify with HC-PT-03, measure with HC-PT-05 metrics)
    │
TUNING CANDIDATE (document change with justification)
    │
REPLAY ANALYSIS (compare before/after death locations, retry frequency)
    │
RE-TEST (different tester profile to verify no regression)
    │
COMPARISON (baseline vs tuned: did friction category improve? did new friction appear?)
    │
    ├─ Improved + no regression → ACCEPT
    └─ No change or new issue → REVERT + re-audit
```

---

## 11. Evidence Confidence System

| Level | Definition | Requires | Action allowed |
|-------|-----------|----------|---------------|
| **LOW** | Single observation, single tester | 1 data point | None. Collect more. |
| **MEDIUM** | Multiple observations, consistent classification | 2+ testers OR 2+ sessions | Investigate. No tuning yet. |
| **HIGH** | Quantitative + emotional evidence aligned | Telemetry + emotional classification agree | Tune SAFE params. Document. |
| **VERIFIED PATTERN** | Systemic across all tester profiles and test types | 4+ testers, multiple profiles, consistent | Must fix. If HIGH+ severity, reopen freeze. |

---

## 12. Arcade Calibration Notes

### Cave Balancing Telemetry Mentality
- Cave didn't have player analytics. They had arcade operators.
- Operators observed: coin drop patterns, play duration, restart behavior.
- **Lesson:** The most important metric is "does the player put in another credit?"

### Arcade Operator Observation
- Operators watched players' **hands and faces**, not screens.
- Trembling hands = intensity. Still hands = boredom or mastery.
- **Lesson:** Body language is the oldest and most reliable telemetry.

### DOJ Retry Psychology
- DOJ players would retry bosses 50+ times in training mode.
- The scoring system made every retry feel worthwhile.
- **Lesson:** Retry frequency measures engagement depth, not difficulty.

---

## 13. Evaluation Examples

### GOOD Evidence Patterns

| Pattern | Meaning |
|---------|---------|
| "Deaths concentradas pero retries inmediatas" | Deaths are FAIR. Player is learning. Healthy. |
| "Greed alto sin abandono" | GREED-TENSION healthy. Risk feels worth it. |
| "Panic corto pero legible" | PRESSURE healthy. CLUTCH SURVIVAL possible. |
| "Fatiga gradual controlada" | After 45 min, player is tired but satisfied. Will play tomorrow. |

### BAD Evidence Patterns

| Pattern | Meaning |
|---------|---------|
| "Quit-after-boss spikes" | 3/5 testers quit within 30s of boss kill. CLIMAX-WEAK or DRAINING. |
| "Score ignorado masivamente" | 0/5 testers check score HUD. Multiplier ×1.0 all sessions. SCORE-DEAD confirmed. |
| "Hesitation constante" | Player pauses before 80%+ of medal pickups. GREEDLESS or SCORE-OPPRESSIVE. |
| "Recovery paralysis" | Post-death performance worse than pre-death in 4/5 testers. RECOVERY-BAD. |
| "Panic loops acumulativos" | Player enters PANIC, dies, re-enters same section, PANIC again. No adaptation. NOISY/OVERLOAD. |
| "Emotional disengagement silencioso" | Player was vocal early session, becomes silent mid-session, stops reacting. FATIGUE or DRAINING. |
