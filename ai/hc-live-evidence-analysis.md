# HC-LIVE-04A — External Evidence Analysis & Pattern Detection

**Phase:** HC-LIVE  
**Status:** Active (analysis framework established)  
**Date:** 2026-05-23  
**Dependency:** HC-LIVE-03A (first sessions), HC-LIVE-02A (pipeline), HC-LIVE-01A (framework), HC-CAL-FREEZE (locked)

---

## 1. External Evidence Analysis Framework

### What Evidence Actually Matters

| Domain | Signals that matter | Signals that are noise |
|--------|-------------------|----------------------|
| **Deaths** | Same death location across 3+ testers. Death within 2s of encounter start. | "I died" — single death, no classification. |
| **Retries** | Retry time trend (increasing across session = fatigue). No retry = RECOVERY-BAD. | Single long pause. Player may be distracted. |
| **Quits** | Quit after boss (no payoff). Quit after death cluster (DRAINING). | Quit at session time limit. Normal. |
| **Score** | 0/5 score players engage with scoring. Multiplier ×1.0 all sessions. | Survival tester ignores score. Expected. |
| **Greed** | 0 greed attempts across 3+ score testers. | Survival tester never grazes. Expected. |
| **Emotions** | Same emotional reaction at same section across testers. | Single tester's mood that day. |
| **Adaptation** | No improvement after 5+ attempts at same section. | Death in first encounter. Expected. |
| **Fatigue** | Error rate rises, engagement drops, session length decreases over time. | "I'm tired today." One session. |

### Three Questions That Determine If Evidence Is Real

1. **Does it repeat?** Same tester, same section, multiple attempts? Same across testers?
2. **Does it persist after learning?** If player adapts and improves, it was difficulty. If they never improve, it may be broken.
3. **Can it be classified?** Does it fit HC-PT-03 friction taxonomy? If not, it's not actionable evidence.

---

## 2. Pattern Detection Rules

### Pattern Levels

| Level | Definition | Threshold | Confidence |
|-------|-----------|-----------|-----------|
| **Isolated incident** | Single observation, single tester, single session | 1 data point | LOW |
| **Repeated observation** | Same tester, same section, 3+ sessions | 3+ sessions | LOW-MEDIUM |
| **Emerging pattern** | 2-3 testers, same observation, same section | 2-3 testers | MEDIUM |
| **Validated pattern** | 3+ testers, 2+ sessions, persists after learning | 3+ testers × 2+ sessions | HIGH |
| **Systemic issue** | 5+ testers, all profiles, multiple sessions, persists | 5+ testers × 3+ sessions | CRITICAL |

### Escalation Thresholds

```
Isolated incident        → DOCUMENT ONLY
Repeated observation     → WATCHLIST. Monitor 2 more sessions.
Emerging pattern         → INVESTIGATE. Gather 2 more testers.
Validated pattern        → CANDIDATE REVIEW. Prepare tuning candidate.
Systemic issue           → REOPEN HC-CAL for specific parameter.
```

---

## 3. Noise vs Signal Classification

### REAL SIGNAL (Act On This)

| Signal type | Detection | Example |
|------------|-----------|---------|
| **Repeatable patterns** | Same behavior across 3+ testers, same section | "All 4 testers died within 2s of EMPERADOR teleport" |
| **Consistent behavior** | Same tester, 3+ sessions, same outcome | "Player never improves on ORBITAL ring patterns after 5 attempts" |
| **Cross-player failure** | Different skill levels, same section, same outcome | "Casual AND veteran both quit after level 17 survival" |
| **Replay collapse repeated** | Multiple testers stop playing after specific event | "3/4 testers quit session after dying at level 17" |
| **Score disengagement repeated** | Multiple score-play testers ignore scoring | "0/4 score players engaged with multiplier" |

### NOISE (Ignore This)

| Noise type | Detection | Why it's noise |
|-----------|-----------|---------------|
| **Initial rage** | First death, strong reaction | Learning curve. Give them 3 more attempts. |
| **Isolated skill issue** | One tester can't pass a section others pass | That player's problem, not the game's. |
| **Emotional opinion** | "I don't like this boss" | Preference, not evidence. |
| **Streamer reaction** | Dramatic for audience | Performance, not genuine play. |
| **Momentary frustration** | Single death, anger, then retry and succeed | Healthy. Productive frustration. |
| **Death tilt** | Player dies 3 times same spot, gets angry, plays worse | Player psychology, not game design. |

### The Danger Zone — Ambiguous Evidence

| Ambiguous signal | How to resolve |
|-----------------|---------------|
| "This boss is too hard" from veteran, no problem for casual? | Skill-specific issue. Check classification. |
| Deaths clustered at level 7, but only on first run | Learning curve. Normal. |
| Player says "unfair" but replay shows clear telegraph | Perception issue, not design issue. Note for readability. |
| Multiplier ×1.0 for score tester, but they never looked at HUD | Score visibility issue, not scoring depth issue. |

---

## 4. Adaptation Curve Analysis

### Healthy Adaptation (The Game Is Working)

| Curve | Signs | Verdict |
|-------|-------|---------|
| **Steady improvement** | Death count decreases per run. Route stabilizes. | ✅ FAIR difficulty. Player learning. |
| **Skill plateau then breakthrough** | Stuck at same section 3 attempts, then clears it | ✅ Good difficulty curve. Satisfying breakthrough. |
| **Score experimentation** | Player tries different routes, graze, aggression | ✅ Score depth exists. Player exploring. |
| **Boss familiarity** | Deaths to boss decrease from 5→3→1→0 across runs | ✅ Boss is learnable. Patterns are readable. |

### Blocked Adaptation (Potential Problem)

| Curve | Signs | Possible cause |
|-------|-------|---------------|
| **Zero improvement** | Same death count 5+ attempts, no change in strategy | CHEAP? No learning possible? |
| **Regression after learning** | Player improves then suddenly dies more | FATIGUE or new pattern introduced |
| **Route abandonment** | Player gives up on medal routing after repeated deaths | GREED too punishing? SCORE-OPPRESSIVE? |
| **Panic persistence** | Player enters PANIC same section every run, never adapts | NOISY / OVERLOAD. Density exceeds parsing capacity. |

### Distinguishing Difficulty from Blockage

| Difficulty (healthy) | Blockage (problem) |
|---------------------|-------------------|
| Player says "I know what I did wrong" | Player says "I don't know what happened" |
| Death count decreases per attempt | Death count static or increases |
| Player tries different strategies | Player repeats same approach hopelessly |
| Frustration at self | Frustration at game |
| "One more try" | "I'm done" |

---

## 5. Replay Motivation Analysis System

### Positive Loop (The Game Is Addictive)

```
Death (FAIR) → "I know what I did wrong" → Instant retry → Adaptation → Survive longer → "One more run"
```

**Signs:**
- Retry < 5s after most deaths
- Player smiles after intense section
- Player voluntarily extends session
- "Let me try that boss again"
- Score comparison between runs

### Neutral Loop (Stable But Not Addictive)

```
Death → Pause (5-15s) → Retry → Same outcome → "Maybe later"
```

**Signs:**
- Retry after pause, not immediate
- Player finishes session at planned time
- "It was fun" but no strong emotion
- No score chasing

### Negative Loop (The Game Is Losing The Player)

```
Death (CHEAP or OVERLOAD) → Long pause → Frustration → Retry → Same death → Quit session → "I'm done"
```

**Signs:**
- Retry > 15s or no retry
- Player blames game, not self
- Session ends early
- "I don't want to play again"
- Error rate increases across session (fatigue spiral)

### Death That Destroys Motivation (Watch For)

| Death type | Why it kills motivation |
|-----------|----------------------|
| **CHEAP death** (no telegraph) | Trust broken. "The game cheated." |
| **Cluster death** (3 deaths in 30s) | Overwhelm. "I can't keep up." |
| **Chain-break death** (lost medal chain) | Greed punishment. "Not worth it." |
| **Boss death at 5% HP** | Near-miss. Can go either way — motivation or despair. |
| **Same death 3rd time** | Learned helplessness. "I'll never get this." |

---

## 6. Cross-Skill Validation Rules

### How to Validate Issues Across Profiles

| If the issue exists for… | Then it's likely… |
|--------------------------|------------------|
| **Only first-contact players** | Onboarding issue. Tutorial/messaging problem, not difficulty. |
| **Only casual players** | Early-game pacing. Check CALM→TENSION transition. |
| **Only score players** | Score economy calibration. Check greed/reward balance. |
| **Only hardcore veterans** | Elite balance. Check rank 5 behavior. May be fine. |
| **All profiles** | Systemic issue. Escalate. |

### Bias Prevention

| Bias | Symptom | Fix |
|------|---------|-----|
| **Elite player bias** | "Early game is too easy" | Early game IS for casuals. Not a bug. |
| **Casual bias** | "Everything is too hard" | The game IS hardcore. Not a bug. |
| **Survival-only bias** | "Scoring doesn't matter" | They're surviving, not scoring. Expected. |
| **Score-only bias** | "Graze is worthless unless it's 20% of score" | Optimizer demanding dominance. Not a bug. |

---

## 7. External Fairness Analysis

### What Threatens HC-CAL (Must Escalate)

| Finding | Threshold | Action |
|---------|-----------|--------|
| **Genuine CHEAP deaths** | 3+ testers, same section, classified CHEAP, persists | REOPEN HC-CAL |
| **Readability collapse** | 3+ testers cannot parse threats at same level/density | HC-RD audit + REOPEN |
| **Impossible recovery** | >50% run abandonment after first death across testers | REOPEN HC-CAL |
| **Unavoidable saturation** | Deaths where replay shows no possible escape route | REOPEN HC-CAL |

### What Does NOT Threaten HC-CAL

| Finding | Why not |
|---------|---------|
| "This boss is too hard" (single tester, single session) | Isolated. Skill issue until proven otherwise. |
| "I don't like the scoring" (survival tester) | They weren't scoring. |
| "Bullets are too fast at rank 5" (without CHEAP classification) | Rank 5 IS fast. That's the design. |
| "I died 5 times on my first run" | First run. Learning curve. |

---

## 8. Evidence Escalation Matrix

```
LOW confidence + LOW severity       → DOCUMENT. No action.
LOW confidence + HIGH severity      → WATCHLIST. 2 more sessions.
MEDIUM confidence + LOW severity    → MONITOR. No action yet.
MEDIUM confidence + MEDIUM severity → INVESTIGATE. Gather more data.
MEDIUM confidence + HIGH severity   → INVESTIGATE. Priority.
HIGH confidence + LOW severity      → MONITOR. Document tuning candidate.
HIGH confidence + MEDIUM severity   → CANDIDATE REVIEW. Prepare specific change.
HIGH confidence + HIGH severity     → REOPEN HC-CAL. Specific parameter only.
CRITICAL confidence + any severity  → EMERGENCY FIX. No process needed.
```

---

## 9. HC-LIVE Stability Protection

### Protection Mechanisms

| Threat | Protection |
|--------|-----------|
| **Overreaction** | Evidence matrix blocks action without sufficient confidence. |
| **Tester pressure** | "Make it easier" from testers is classified as LOW VALUE source (HC-LIVE-02A). |
| **Public complaints** | Complaints without behavioral evidence are NOISE. |
| **Visibility panic** | "Everyone dies at level 17!" → Classify WHY. If FAIR, it's good. If CHEAP/NOISY, investigate. |
| **Streamer influence** | Streamer reactions classified separately from genuine play. |

### The Firewall

```
External noise
      │
      ▼
┌─────────────┐
│ HC-LIVE-02A │  Observation Pipeline (records, doesn't interpret)
│ HC-LIVE-03A │  Session Protocols (standardized, unbiased)
│ HC-LIVE-04A │  Evidence Analysis (classifies, detects patterns)
└─────────────┘
      │
      ▼
   Only validated patterns reach HC-CAL
      │
      ▼
┌─────────────┐
│  HC-CAL     │  Reopened only with HIGH+ confidence, specific parameter
└─────────────┘
```

**The firewall exists to keep noise out and let signal through.**

---

## 10. Pipeline Reality Check

### After first batch of sessions, evaluate:

| Question | Healthy answer | Problem answer |
|----------|---------------|----------------|
| Does pipeline produce useful evidence? | > 60% of observations classifiable with HC-PT-03 | < 40% classifiable → taxonomy gap |
| Is there excessive noise? | < 30% of observations classified as NOISE | > 50% noise → observation technique issue |
| Do categories suffice? | All deaths classifiable as FAIR/CHEAP/NOISY/OVERLOAD | "Unknown" deaths > 20% → taxonomy gap |
| Does classification work? | 2+ observers agree on classification > 80% of time | Disagreement > 30% → classification clarity issue |
| Does system resist emotional feedback? | No tuning after single emotional session | Tuning happens after one session → firewall broken |

---

## 11. Deliverable

**HC-LIVE-04A: External Evidence Analysis & Pattern Detection** — Framework established.

### HC-LIVE Status

| Sprint | Status |
|--------|--------|
| HC-LIVE-01A (Framework) | ✅ COMPLETE |
| HC-LIVE-02A (Pipeline) | ✅ COMPLETE |
| HC-LIVE-03A (First Sessions Protocol) | ✅ COMPLETE |
| HC-LIVE-04A (Analysis & Pattern Detection) | ✅ ACTIVE |
| HC-LIVE-05A (Production Validation Report) | Next |

### The System Is Ready

```
External player plays → Observer records → Evidence captured →
Patterns detected → Noise filtered → Validated issues escalated →
HC-CAL reopened ONLY with HIGH+ confidence → Specific parameter tuned.
```

**4 HC-LIVE sprints complete. Analysis infrastructure ready for real data.**
