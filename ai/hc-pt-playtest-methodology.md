# HC-PT-05 — Hardcore Playtest Methodology

**Phase:** HC-PT  
**Status:** Active (methodology established)  
**Date:** 2026-05-22  
**Dependency:** HC-PT-04 (emotional pacing), HC-PT-03 (friction), HC-PT-02 (taxonomy), HC-PT-01A (framework)

---

## 1. Playtest Philosophy

### Real Objective of Hardcore Playtesting

The goal is **not** to ask players what they like. The goal is to **observe what the game does to them**.

| Casual feedback | Hardcore audit |
|----------------|---------------|
| "This is too hard" | Player error rate spikes at level 7, section 3. Every tester. |
| "I don't like this boss" | Boss death = 0 retries across 4 testers. Recovery failure. |
| "More powerups please" | Score engagement: multiplier at ×1.0 for full session. SCORE-DEAD. |
| "Make it easier" | READABILITY issue: bullets blend with background at density >25. |

### Why Emotional Data Matters

Numbers tell you WHAT happened. Emotions tell you WHY the player reacted that way.

| Metric | Emotion behind it |
|--------|------------------|
| Death count: 3 in level 7 | "I couldn't see the bullets" vs "I know what I did wrong" |
| Sessions played: 1 | "This game is unfair" vs "I'm satisfied, I'll play more tomorrow" |
| Multiplier: never above ×1.2 | "I don't understand scoring" vs "Too risky to engage" |
| Retry time: 30 seconds | Player was analyzing death vs player was on phone |

### How to Avoid Impulsive Tuning

**Rule:** Never tune after one playtest session. Never tune after one tester's feedback.

**Minimum evidence bar:**
- 3+ testers report the same friction category
- OR the same tester reports it across 3+ sessions
- OR the designer observes it directly and can classify it with HC-PT-03 taxonomy

---

## 2. Official Playtest Types

### 2.1 Casual Survival Test

| Aspect | Value |
|--------|-------|
| Objective | Verify basic playability. Does a casual player survive to level 5 without quitting? |
| What it evaluates | EMPTY, OVERLOAD, CHEAP, early-game readability |
| What it does NOT evaluate | Score depth, greed tension, elite balance |
| Ideal duration | 20-30 minutes (levels 1-10) |
| Ideal tester | First-contact player or casual arcade player |
| Observable metrics | Death locations, quit timing, verbal reactions, posture changes |
| Interpretation risks | Casual player may complain about difficulty that is intentional |

### 2.2 Intermediate Survival Test

| Aspect | Value |
|--------|-------|
| Objective | Verify mid-game pacing. Does an intermediate player feel progression? |
| What it evaluates | Emotional pacing, fatigue accumulation, boss fairness |
| What it does NOT evaluate | Elite scoring balance, no-hit viability |
| Ideal duration | 30-45 minutes (levels 1-15) |
| Ideal tester | Survival-focused player or average shmup player |
| Observable metrics | Error rate trend, recovery behavior, section identity recall |
| Interpretation risks | Intermediate player may not engage with optional scoring systems |

### 2.3 Advanced Survival Test

| Aspect | Value |
|--------|-------|
| Objective | Verify late-game integrity. Can an advanced player clear the game? |
| What it evaluates | OVERLOAD, RECOVERY-BAD, CLIMAX-WEAK, late-game readability |
| What it does NOT evaluate | Beginner accessibility |
| Ideal duration | 40-60 minutes (levels 1-20) |
| Ideal tester | Hardcore veteran or experienced shmup player |
| Observable metrics | Boss death count, death spiral detection, exhaustion signals |
| Interpretation risks | Veteran may tolerate unfairness that casual player can't |

### 2.4 Score Play Test

| Aspect | Value |
|--------|-------|
| Objective | Verify score economy engagement. Does scoring drive player decisions? |
| What it evaluates | SCORE-DEAD, GREEDLESS, ROUTE-LOCK, SCORE-OPPRESSIVE, medal engagement |
| What it does NOT evaluate | Survival difficulty |
| Ideal duration | 30-45 minutes |
| Ideal tester | Score player or optimizer |
| Observable metrics | Multiplier uptime %, medal chain peak, aggression %, graze count, score composition |
| Interpretation risks | Score player may optimize in ways casual players never will |

### 2.5 Greed Play Test

| Aspect | Value |
|--------|-------|
| Objective | Verify risk/reward balance. Does greed feel tempting but dangerous? |
| What it evaluates | GREED-TENSION (healthy vs toxic), medal chain death correlation, graze death rate |
| What it does NOT evaluate | Safe-play viability |
| Ideal duration | 20-30 minutes |
| Ideal tester | Score player told to "maximize score at all costs" |
| Observable metrics | Deaths during medal collection, graze→death timing, greed decision frequency |
| Interpretation risks | "Max greed" playstyle is intentionally risky — deaths expected |

### 2.6 No-Hit Test

| Aspect | Value |
|--------|-------|
| Objective | Verify fairness. Is a deathless run theoretically possible? |
| What it evaluates | CHEAP deaths, un-telegraphed attacks, hitbox fairness |
| What it does NOT evaluate | Scoring, pacing, emotional arc |
| Ideal duration | 40-60 minutes (attempt no-hit run) |
| Ideal tester | No-hit player or elite veteran |
| Observable metrics | Every death location and cause classified with HC-PT-03 |
| Interpretation risks | No-hit testing is aspirational — difficulty that prevents no-hit may be intentional |

### 2.7 High-Rank Test

| Aspect | Value |
|--------|-------|
| Objective | Verify rank ceiling behavior. Does rank 5 remain readable and fair? |
| What it evaluates | OVERLOAD at rank 5, readability under max speed, boss ceiling enforcement |
| What it does NOT evaluate | Low-rank accessibility |
| Ideal duration | 20-30 minutes (reach rank 5, sustain for 10+ minutes) |
| Ideal tester | Elite player or optimizer |
| Observable metrics | Readability complaints at rank 5, governor blocks, cap triggers |
| Interpretation risks | Rank 5 is intentionally hard — player skill must match |

### 2.8 Long-Session Test

| Aspect | Value |
|--------|-------|
| Objective | Verify fatigue accumulation. Does the game exhaust the player? |
| What it evaluates | FATIGUE, DRAINING, STATIC, NON-MEMORABLE |
| What it does NOT evaluate | Moment-to-moment fairness |
| Ideal duration | 60-90 minutes (2-3 full runs or continuous play) |
| Ideal tester | Any profile, observed for fatigue signals |
| Observable metrics | Session duration trend, error rate over time, engagement decline, verbal exhaustion |
| Interpretation risks | All games cause fatigue eventually — threshold matters |

### 2.9 Mobile Test

| Aspect | Value |
|--------|-------|
| Objective | Verify small-screen readability. Are threats visible on mobile? |
| What it evaluates | VISUAL-CONFLICT, readability, bullet size perception |
| What it does NOT evaluate | Full balance |
| Ideal duration | 15-20 minutes |
| Ideal tester | Any profile on mobile device |
| Observable metrics | Squinting, missed threats, "I can't see" complaints |
| Interpretation risks | Mobile is inherently compromised — minimum bar, not parity |

### 2.10 Boss Marathon Test

| Aspect | Value |
|--------|-------|
| Objective | Verify boss quality in isolation. Are all 5 bosses distinct and satisfying? |
| What it evaluates | CLIMAX-WEAK, memorability, boss identity, phase readability |
| What it does NOT evaluate | Wave pacing between bosses |
| Ideal duration | 15-25 minutes (fight each boss individually) |
| Ideal tester | Any profile, focus on boss experience |
| Observable metrics | Death count per boss, retry motivation per boss, emotional reaction on kill |
| Interpretation risks | Bosses in isolation feel different than in full run context |

### 2.11 Recovery-After-Death Test

| Aspect | Value |
|--------|-------|
| Objective | Verify recovery satisfaction. Does comeback feel possible and motivating? |
| What it evaluates | RECOVERY-BAD, SCORE-OPPRESSIVE, multiplier penalty fairness |
| What it does NOT evaluate | No-hit viability |
| Ideal duration | 15-20 minutes (deliberately die, then recover) |
| Ideal tester | Intermediate player instructed to "come back after dying" |
| Observable metrics | Abandonment rate, recovery time, multiplier rebuild speed, emotional response |
| Interpretation risks | Deliberate death may feel unnatural to player |

### 2.12 First-Contact Blind Test

| Aspect | Value |
|--------|-------|
| Objective | Verify new-player experience. Can someone who's never played understand the game? |
| What it evaluates | CALM adequacy, tutorial feel, first-death fairness, immediate readability |
| What it does NOT evaluate | Depth, scoring, elite balance |
| Ideal duration | 10-15 minutes (first 3 levels) |
| Ideal tester | First-contact player — never seen Galaxy Raiders |
| Observable metrics | Confusion signals, "what do I do?" questions, first death reaction |
| Interpretation risks | First-contact players will die to things veterans find trivial |

---

## 3. Tester Classification System

| Profile | Strengths | Blind spots | Value to HC-PT |
|---------|-----------|------------|----------------|
| **First-contact** | Fresh eyes, no bias, reveals onboarding issues | Doesn't understand genre conventions, may be overwhelmed | Detects CALM/readability/EMPTY issues |
| **Casual arcade** | Understands genre, doesn't play obsessively | May not engage with depth systems (scoring, routing) | Detects basic fairness, early pacing |
| **Survival-focused** | Plays to survive, tests endurance | Ignores scoring systems entirely | Detects OVERLOAD, FATIGUE, RECOVERY |
| **Score player** | Optimizes for points, tests greed economy | May tolerate unfairness if scoring is good | Detects SCORE-DEAD, GREEDLESS, ROUTE-LOCK |
| **Hardcore veteran** | Deep genre knowledge, high skill ceiling | May be too tolerant of difficulty | Detects elite balance issues, rank ceiling |
| **Optimizer** | Finds optimal routes, min-maxes systems | May optimize fun out of the game | Detects ROUTE-LOCK, STATIC, exploitation |
| **No-hit player** | Pursues perfection, tests fairness exhaustively | May demand unreasonable fairness | Detects CHEAP deaths, hitbox issues |
| **Fatigue-sensitive** | Quickly exhausted by intense games | May over-report fatigue | Detects DRAINING early |

---

## 4. Playtest Session Structure

### Official Session Format

```
Phase 1: WARMUP (5 min)
  - Tester familiarizes with controls
  - No data collected
  - Purpose: reduce first-run anxiety

Phase 2: BASELINE RUNS (2 runs, 10-15 min each)
  - Tester plays naturally, no instructions
  - Observer records: deaths, reactions, emotional states
  - Purpose: establish natural behavior

Phase 3: FOCUSED OBJECTIVE RUNS (1-2 runs, 15-20 min each)
  - Tester given specific objective (scoring, no-hit, greed)
  - Observer records: strategy changes, friction encountered
  - Purpose: test specific systems

Phase 4: FATIGUE OBSERVATION (1 run, 15-20 min)
  - Tester plays after 45+ min of gameplay
  - Observer records: error rate trend, engagement decline
  - Purpose: detect fatigue accumulation

Phase 5: COOLDOWN REVIEW (10 min)
  - Tester gives unstructured feedback
  - Observer does NOT ask leading questions
  - Purpose: capture tester's own vocabulary

Phase 6: REPLAY ANALYSIS (by observer, without tester)
  - Review key moments from recorded observations
  - Classify each friction point with HC-PT-03 taxonomy
  - Purpose: structured analysis

Phase 7: REPORT EXTRACTION (by observer)
  - Complete audit report per HC-PT-05 Section 6 format
  - Purpose: actionable output
```

### Session Duration Limits

| Tester profile | Max useful runs | Total session max | Breaks required |
|----------------|----------------|-------------------|-----------------|
| First-contact | 3 | 30 min | Every 10 min |
| Casual / Intermediate | 5 | 60 min | Every 20 min |
| Hardcore / Elite | 8 | 90 min | Every 30 min |

### When to Stop a Session

- Tester verbalizes exhaustion ("I need a break" / "too much")
- Error rate > 2× baseline for 2 consecutive runs
- Tester stops engaging with scoring systems
- Tester checks phone/clock between runs
- 3 consecutive deaths in same section without adaptation

---

## 5. Observation Rules

### What to Observe

| Signal | Category | Record as |
|--------|----------|-----------|
| Posture changes (lean in / lean back) | PRESSURE / EMPTY | Time + section |
| Verbal reactions ("what?!" / "nice!" / "damn") | CHEAP / FAIR-HARD | Exact quote + context |
| Breathing pattern changes | PANIC / RELIEF | Time + section |
| Death → retry time (instant / pause / quit) | RECOVERY satisfaction | Seconds between death and restart |
| Score HUD glances | SCORE engagement | Count per minute |
| Strategy changes (diving vs staying safe) | GREED tension | Section + context |
| Phone/clock checking | FATIGUE / EMPTY | Time |
| Smile/laugh after intense section | CLUTCH SURVIVAL / TRIUMPH | Time + section |

### What to NOT Assume

| Don't assume | Instead |
|-------------|---------|
| "Player died because it's too hard" | Classify: CHEAP? SPIKE-BAD? FAIR-HARD? OVERLOAD? |
| "Player quit because they didn't like it" | Check: RECOVERY-BAD? DRAINING? SCORE-OPPRESSIVE? |
| "Player is bad at this section" | Check: readability issue? Fairness issue? Learning curve? |
| "One player's opinion = truth" | Verify across 3+ testers or 3+ sessions |

### Distinguishing Skill Issue vs Real Issue

| Skill issue (player problem) | Real issue (game problem) |
|------------------------------|--------------------------|
| Player dies once, adapts, improves next run | Player dies same way 3+ times, no adaptation |
| Player says "I messed up" | Player says "that was cheap" |
| Death teaches a lesson | Death teaches nothing |
| Other testers pass the section | All testers fail the section |

### Detecting Silent Frustration

Silent frustration is the most dangerous — the player doesn't complain, they just quit.

**Signals:**
- Decreasing session length across playtests
- Increasing time between retries
- Player stops talking (was vocal, becomes silent)
- Player stops engaging with optional systems
- "I'll play more later" → never returns

### Detecting Retry Motivation

| Signal | Indicates |
|--------|-----------|
| Instant restart after death (< 3s) | Strong motivation — death was fair |
| Pause 3-10s, then restart | Death registered, player processed, still motivated |
| Pause 10-30s, then restart | Significant setback — may need recovery improvement |
| Pause > 30s, then restart | Near-abandonment — close to RECOVERY-BAD |
| Does not restart | RECOVERY-BAD or DRAINING |

---

## 6. Audit Reporting Standard

### Official Report Format

```markdown
## Playtest Report #[N]
**Date:** YYYY-MM-DD
**Tester profile:** [profile from Section 3]
**Test type:** [type from Section 2]
**Session duration:** [X minutes]
**Levels played:** [Lv N → Lv M]

### Findings

| # | Area | Severity | Friction Type | Emotional State | Evidence | Trigger | Suspected Cause | Reproducibility | Suggested Direction | Confidence |
|---|------|----------|---------------|-----------------|----------|---------|-----------------|-----------------|---------------------|------------|
| 1 | Fairness | HIGH | SPIKE-BAD | FRUSTRATION | Player died within 2s of section start, verbalized "what?!", 0 retries | Ambush section with no telegraph | No warning before ambush enemy spawn | 3/3 testers same section | Add 1s banner before ambush | HIGH |
| 2 | Readability | MEDIUM | NOISY | CONFUSION | Player squinted, stopped shooting during density peak | Level 17 survival corridor at rank 5 | Bullet density + speed exceeds readability | 2/3 testers | Consider rank cap for survival sections | MEDIUM |
| 3 | Score | MEDIUM | GREEDLESS | INDIFFERENCE | Multiplier at ×1.0 entire session, 0 graze count | Test type: Score Play | Graze score too low to incentivize risk | 4/4 testers | Increase graze base score by 2-3 | HIGH |

### Emotional Arc Summary
[Describe tension curve across the session — where did it breathe, where did it flatline]

### Death Analysis
| # | Level | Cause | Fairness | Recovery behavior |
|---|-------|-------|----------|-------------------|
| 1 | 7 | Diver ambush | FAIR (telegraph visible) | Instant restart |
| 2 | 12 | KAMIKAZE density | NOISY (couldn't parse) | 15s pause, then restart |

### Pacing Evaluation
[HC-PT-04 states observed. Any pacing failure modes?]

### Score Engagement
[Multiplier uptime, medal chain, aggression %, graze count]

### Verdict
[Overall emotional outcome. Retry motivation assessment. Priority issues list.]
```

---

## 7. Replay Analysis Methodology

### How to Review Runs

1. **Watch the full replay once without pausing** — feel the emotional arc.
2. **Re-watch pausing at every death** — classify each with HC-PT-03.
3. **Re-watch focused on score behavior** — when does player engage/disengage with scoring?
4. **Re-watch focused on movement** — does movement quality degrade over time?

### Detecting Breakdowns

| Breakdown type | Detection |
|---------------|-----------|
| **Skill breakdown** | Deaths cluster, player loses composure, movement becomes erratic |
| **Pacing breakdown** | Player's emotional state flatlines (indifference), stops reacting to excitement |
| **Visual breakdown** | Player stops tracking individual threats, gaze fixates on ship |
| **Score breakdown** | Player stops collecting medals, stops checking multiplier, score curve flattens |
| **Recovery breakdown** | After death, player plays worse than before (trauma, not learning) |

### Identifying Fairness Issues

A death is UNFAIR if:
- The threat was not telegraphed
- The threat was visible but the hitbox was ambiguous
- The player had no possible escape route
- The death occurred within 2s of a new encounter

### Detecting Pacing Collapse

Pacing has collapsed when:
- Emotional states stop alternating (flatline for >60s)
- Player cannot identify "the hard part" of a level
- Relief sections don't produce visible relaxation
- Climax sections don't produce visible excitement

---

## 8. Severity Escalation Rules

| Severity | Criteria | Action | Freeze impact |
|----------|----------|--------|--------------|
| **CRITICAL** | Game crashes, softlocks, or becomes unplayable | Reopen freeze, fix immediately, re-audit | May modify NEVER-TOUCH params |
| **HIGH** | 4+ testers report same FAIRNESS or READABILITY issue; deaths classified as CHEAP | Reopen freeze, apply minimal fix, re-audit | SAFE-TUNING only |
| **MEDIUM** | 3+ testers report PACING, SCORE, or MEMORABILITY issue; friction classified as OVERLOAD, RECOVERY-BAD, SCORE-OPPRESSIVE | Tune SAFE params with justification document | No freeze impact |
| **LOW** | Cosmetic, display clarity, popup density | Tune or defer | No freeze impact |
| **OBSERVATION** | Noted by 1-2 testers, not reproducible | Document, no action | No freeze impact |

---

## 9. Emotional Evidence System

### Valid Evidence Types

| Evidence | What it proves | Confidence |
|----------|---------------|-----------|
| **Retry frequency** (>5 retries in same section) | Death was FAIR (player wants to overcome), or player is stuck | HIGH if combined with verbal evidence |
| **Quit timing** (immediately after death) | RECOVERY-BAD, CHEAP, or DRAINING | MEDIUM — needs verbal confirmation |
| **Panic behavior** (random movement, stops shooting) | PANIC-NO-READ, OVERLOAD | HIGH — observable and reproducible |
| **Greed attempts** (count per minute) | GREED-TENSION health | HIGH — directly measurable |
| **Recovery hesitation** (long pause before retry) | RECOVERY-BAD | MEDIUM |
| **Body language** (posture, breathing, expressions) | PRESSURE, RELIEF, FATIGUE | LOW alone, HIGH combined with other evidence |
| **Pacing degradation** (error rate trend) | FATIGUE accumulation | HIGH — quantitative |
| **Frustration accumulation** (increasing verbal complaints) | FRUSTRATION escalation | HIGH — qualitative + quantitative |

---

## 10. False Positive Protection

### How to Avoid Overcorrection

| Anti-pattern | Correction |
|-------------|-----------|
| "One tester said it's too hard, so I'll nerf it" | Minimum 3 testers or 3 sessions with same classification |
| "First-contact player can't survive level 5" | CRABTRON is intentionally hard. Check: FAIR or CHEAP? |
| "Score player says graze is worthless" | Score player is an optimizer — compare with intermediate player data |
| "This section feels boring" | Check: is it EMPTY or is the tester just not in flow? |

### How to Avoid Casualization

| Risk | Protection |
|------|-----------|
| Making relief sections longer → EMPTY | Relief must have enemies + scoring opportunities |
| Reducing max density → game loses identity | Density issues are READABILITY issues, not "too many bullets" |
| Slowing rank gain → game loses intensity | Rank issues are FAIRNESS issues, not "rank is too aggressive" |

### How to Protect Hardcore Identity

- **Never** reduce difficulty because casual players find it hard.
- Fix READABILITY before reducing DENSITY.
- Fix RECOVERY before reducing PUNISHMENT.
- Fix FAIRNESS before reducing SPEED.

---

## 11. Hardcore Calibration Workflow

```
┌────────────┐
│  PLAYTEST  │  Run session per Section 4 format.
└─────┬──────┘
      │
┌─────▼──────┐
│   AUDIT    │  Classify observations with HC-PT-02 and HC-PT-03.
└─────┬──────┘
      │
┌─────▼──────────┐
│ CLASSIFICATION  │  Assign severity per Section 8.
└─────┬──────────┘
      │
┌─────▼──────┐
│  EVIDENCE  │  Compile emotional evidence per Section 9.
└─────┬──────┘
      │
┌─────▼────────────┐
│ TUNING CANDIDATE  │  Propose specific SAFE-TUNING change.
└─────┬────────────┘      Justify with evidence. Per Section 6 format.
      │                   Reference frozen block + parameter.
      │
┌─────▼──────┐
│ VALIDATION │  Test the change. Same test type, same tester profile.
└─────┬──────┘
      │
┌─────▼──────┐
│  RE-AUDIT  │  Verify the friction category resolved or improved.
└────────────┘      If not → iterate. If yes → document.
```

**One round-trip per issue. One issue per tuning change.** Never batch tune.

---

## 12. Arcade Calibration Notes

### Arcade Location Testing (arcade culture)
- Real shmups were tested in arcades with strangers.
- Observers watched players, didn't ask them.
- **Lesson:** Observe more than you ask.

### Cave Balancing Iteration
- Cave tuned Dodonpachi over hundreds of location tests.
- Small changes, observed impact, iterated.
- **Lesson:** Tune one parameter at a time.

### DOJ Mastery Retention
- DOJ players returned for months to improve scores.
- The scoring system created long-term motivation.
- **Lesson:** Score depth = retention. HC-SC must pass the Score Play test.

### Ketsui Pressure Retention
- Ketsui's lock-shot system created proximity tension.
- Players kept coming back to master the risk/reward.
- **Lesson:** Greed must feel accessible but mastery must be deep.

---

## 13. Evaluation Examples

### GOOD Playtest Indicators

| Observation | What it means |
|------------|---------------|
| "Jugador muere pero reinicia instantáneamente" | Death was FAIR. Recovery motivation intact. |
| "Panic intenso pero entendible" | PRESSURE healthy, PANIC legible, CLUTCH SURVIVAL possible. |
| "Greed opcional muy atractivo" | GREED-TENSION healthy. Player hesitates, decides, survives. |
| "Fatiga controlada" | After 45 min: "I'm tired but satisfied. I'll play tomorrow." |

### BAD Playtest Indicators

| Observation | What it means |
|------------|---------------|
| "Abandono silencioso" | Player stops launching game. No complaint — just indifference. DRAINING or STATIC. |
| "Recovery emocional rota" | After 1 hit, player abandons run. "No point continuing." RECOVERY-BAD. |
| "Overload acumulativo" | Error rate climbs from level 14 onward. No relief sections in late game. |
| "Score ignorado" | Multiplier stays at ×1.0. Medals ignored. Score never checked. SCORE-DEAD. |
| "Boss agotador" | Boss death: player exhales relief, not triumph. "Finally it's over." CLIMAX-WEAK. |
| "Frustration sin aprendizaje" | Player dies 3 times same spot. No adaptation. "This is impossible." CHEAP or SPIKE-BAD. |
