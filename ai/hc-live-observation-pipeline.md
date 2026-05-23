# HC-LIVE-02A — External Observation Pipeline Foundation

**Phase:** HC-LIVE  
**Status:** Active (pipeline established)  
**Date:** 2026-05-23  
**Dependency:** HC-LIVE-01A (framework), HC-CAL-FREEZE (production-stable lock)

---

## 1. External Observation Pipeline

### Official HC-LIVE Pipeline

```
┌─────────────────┐
│  PLAYER SESSION  │  Player plays naturally. No instructions beyond "survive" or "score."
└────────┬────────┘
         │
┌────────▼────────┐
│   OBSERVATION   │  Observer records: deaths, reactions, behaviors. No interpretation yet.
└────────┬────────┘
         │
┌────────▼────────┐
│ EVIDENCE CAPTURE │  Convert observations to structured evidence per Section 6.
└────────┬────────┘
         │
┌────────▼────────┐
│ CLASSIFICATION   │  Classify with HC-PT-03 friction taxonomy.
└────────┬────────┘
         │
┌────────▼────────┐
│   VALIDATION     │  Cross-reference: same tester multiple sessions? Other testers? Persists?
└────────┬────────┘
         │
┌────────▼────────┐
│   ESCALATION     │  Decision: ignore, monitor, watchlist, investigate, or reopen HC-CAL.
└────────┬────────┘
         │
┌────────▼────────┐
│ DECISION CANDIDATE│ Document with justification. If reopen: specific parameter, specific fix.
└─────────────────┘
```

### What NOT to Observe

| Don't observe | Why |
|--------------|-----|
| Player's opinion of "fun" | Subjective. Observe behavior, not satisfaction rating. |
| Player's difficulty rating (1-10) | Meaningless without context. "8/10 hard" = what specific friction? |
| Player's feature requests | HC-LIVE validates existing game, doesn't design new features. |
| Player's comparison to other games | Different games, different designs. |

---

## 2. Observation Source Hierarchy

### HIGH VALUE Sources

| Source | Why valuable | What it reveals |
|--------|-------------|-----------------|
| Gameplay footage (full session) | Unfiltered truth. Every death, every route, every reaction. | All friction types. Real behavior. |
| Retry behavior (time after death) | Direct measure of motivation. Instant = FAIR. Long pause/don't retry = problem. | Fairness, recovery, frustration. |
| Quit moments (when session ends) | Where does the player lose motivation? | DRAINING, FATIGUE, RECOVERY-BAD. |
| Route adaptation (change in play style) | Player learning. New routes = depth. Same routes always = ROUTE-LOCK. | Score depth, greed tension. |
| Greed behavior (medal chases, grazes) | Do scoring systems actually tempt the player? | SCORE-DEAD vs GREED-TENSION. |
| Score interaction (HUD glances) | Is score engagement real? | Score engagement, mastery motivation. |

### MEDIUM VALUE Sources

| Source | Value | Limitation |
|--------|-------|-----------|
| Live observation (body language, expressions) | Real-time emotional data | Hard to quantify. Needs multiple observers. |
| Emotional reactions (verbal, sound) | "Yes!" vs "What?!" are gold | Subjective interpretation risk. |
| Post-run interviews | Player's own words, unfiltered | Memory distorts. May not recall correctly. |
| Replay review (observer watching recording) | Frame-by-frame analysis | Time-consuming. Best for specific friction points. |

### LOW VALUE Sources

| Source | Why low value |
|--------|--------------|
| Raw complaints ("too hard") | Without classification, useless. WHY too hard? CHEAP? NOISY? OVERLOAD? |
| Instant reactions (first death) | Learning curve expected. Single data point. |
| "Too easy" | May be skilled player, not design flaw. Check with casual testers. |
| Frustration without evidence | Player angry ≠ game broken. Classify the DEATH, not the emotion. |

---

## 3. Behavioral Observation Rules

### Retry Observation

| Behavior | Classification | Action |
|----------|---------------|--------|
| Retry < 3s after death | FAIR death. Strong motivation. | None. Game is working. |
| Retry 3-10s | Death registered. Processing. | None. Normal. |
| Retry 10-30s | Significant setback. Player hesitating. | Note section. Monitor across sessions. |
| Retry > 30s | Near-abandonment. | Note section + friction type. Flag for watchlist. |
| No retry (quit session) | RECOVERY-BAD or DRAINING. | Classify death cause. Flag for investigation. |

### Rage Quit vs Strategic Quit

| Behavior | Rage quit (bad) | Strategic quit (OK) |
|----------|----------------|-------------------|
| Timing | Immediately after death, game closed | After death, pause, "I'll come back tomorrow" |
| Emotion | Anger, vocal frustration at game | Calm, satisfied, "good session" |
| Return? | May never return | Returns within 24h |
| Cause | CHEAP death, unfair feeling | Fatigue, time constraint, satisfaction |

### Adaptation Observation

| Behavior | Indicates |
|----------|-----------|
| Player changes route after death | Learning. Depth exists. |
| Player tries different strategy on same boss | Mastery motivation. |
| Player never changes strategy | ROUTE-LOCK or game lacks depth. |
| Player improves death count across runs | FAIR difficulty. Learning possible. |
| Player same death count across 3+ runs | CHEAP or SPIKE-BAD. Cannot learn. |

### Panic Observation

| Behavior | Classification |
|----------|---------------|
| Random movement, stops shooting | PANIC-NO-READ. Density exceeded parsing limit. |
| Fast but aimed movement, continues shooting | Good panic. Healthy pressure. |
| Freezes completely, dies | Cognitive shutdown. OVERLOAD. |

---

## 4. Bias Prevention System

### Bias Types and Protection

| Bias | Symptom | Protection |
|------|---------|-----------|
| **Loud minority** | 1 vocal tester drives all tuning decisions | Minimum 3 testers before action. Cross-reference profiles. |
| **Streamer bias** | Entertainer plays for audience, not survival | Distinguish performance play from genuine play. If streamer dies dramatically, classify the death, not the reaction. |
| **First-impression distortion** | First death sets emotional tone for whole session | Discard first 5 minutes of first session. Player is learning controls, not playing. |
| **Dev attachment bias** | Designer can't see flaws in own work | External observation only. Designer does not observe their own play. |
| **Tester ego bias** | "I'm good at games, so this must be unfair" | Cross-reference with other testers. If only skilled players complain, it's ego, not design. |
| **Survival-only bias** | Tester ignores scoring, says game lacks depth | Assign Score Play test type to verify. Survival tester's "no depth" is not evidence. |
| **Score-player bias** | Optimizer demands perfect balance | Score play is intentionally risky. Death during greed is expected. |
| **Casualization pressure** | "Make it easier" from casual testers | Hardcore identity is non-negotiable. Casual difficulty expectation ≠ design flaw. |

---

## 5. Observation Integrity Rules

### When a Session Is Invalid

| Condition | Reason |
|-----------|--------|
| Player was distracted (phone, TV, conversation) | Behavior not representative. |
| Player was intoxicated or impaired | Not valid gameplay. |
| Player received hints/coaching during session | Contaminated learning. |
| Technical issues (lag, crash, freeze) | Not gameplay observation. |
| Player had pre-existing strong opinion about game | Bias contamination. |

### When the Player Is Still Learning

| Signal | Action |
|--------|--------|
| First 5 minutes of first session | Discard. Learning controls. |
| First 3 deaths | Expected. No classification needed unless CHEAP. |
| First encounter with each boss | Expected learning deaths. Watch adaptation across attempts. |
| First encounter with set piece | Expected. Watch learning curve. |

### When Evidence Is Sufficient

| Condition | Confidence Level |
|-----------|-----------------|
| Same behavior in 3+ sessions by same tester | MEDIUM |
| Same behavior in 3+ testers, single session each | MEDIUM |
| Same behavior in 3+ testers, 2+ sessions each | HIGH |
| Same behavior in 5+ testers, all profiles, persists after learning | CRITICAL |

---

## 6. Evidence Confidence Levels

### LOW Confidence

| Criteria | Action |
|----------|--------|
| Single tester, single session, single observation | Document. Do nothing. |
| "I feel like…" with no behavioral evidence | Ignore. |
| First 5 minutes of first session | Discard. |

### MEDIUM Confidence

| Criteria | Action |
|----------|--------|
| Same tester, 3+ sessions, same observation | Watchlist. Monitor for another session. |
| 3+ testers, single session each, same observation | Watchlist. Schedule follow-up sessions. |
| HC-PT-03 classification with playback evidence | Document. No tuning. |

### HIGH Confidence

| Criteria | Action |
|----------|--------|
| 3+ testers, 2+ sessions each, same observation, persists after learning | Investigation warranted. Prepare tuning candidate. |
| Telemetry-supported: quantitative data + emotional classification agree | Investigation warranted. |
| HC-PT-03 HIGH severity + HIGH confidence evidence | Reopen HC-CAL for that specific parameter. |

### CRITICAL Evidence

| Criteria | Action |
|----------|--------|
| 5+ testers, all profiles, persists across sessions | Must fix. Reopen HC-CAL. |
| 10+ testers, CRITICAL severity (crash, softlock) | Fix immediately. No process needed. |
| HC-PT-03 CRITICAL severity + HIGH confidence | Emergency fix. Re-audit after. |

---

## 7. Escalation Trigger Rules

### Decision Ladder

```
Observation arrives
  │
  ├─ Severity OBSERVATION → DOCUMENT. No action.
  │
  ├─ Severity LOW + LOW confidence → DOCUMENT. No action.
  │
  ├─ Severity LOW + MEDIUM confidence → MONITOR. Schedule follow-up.
  │
  ├─ Severity MEDIUM + MEDIUM confidence → WATCHLIST. 2 more sessions minimum.
  │
  ├─ Severity MEDIUM + HIGH confidence → INVESTIGATE. Prepare tuning candidate.
  │
  ├─ Severity HIGH + HIGH confidence → REOPEN HC-CAL. Specific parameter.
  │
  └─ Severity CRITICAL + any confidence → FIX immediately. No process.
```

### When to IGNORE

| Feedback type | Reason |
|--------------|--------|
| "Too hard" (no friction classification) | Not evidence. |
| "Make it easier" (casualization request) | Hardcore identity non-negotiable. |
| "I don't like [mechanic]" (preference) | Not a design flaw. |
| Single tester, single session, LOW severity | No pattern. |
| First-session learning deaths | Expected. |

---

## 8. Observation Session Standards

### Minimum Valid Session

| Aspect | Minimum |
|--------|---------|
| Runs | 2 complete or partial runs |
| Duration | 15 minutes |
| Tester state | Not distracted, not intoxicated, no coaching |
| Recording | Gameplay footage (or live observation with notes) |

### When Adaptation Appears

| Signal | Timing |
|--------|--------|
| First adaptation | Usually after 2-3 deaths in same section |
| Consistent adaptation | After 5+ encounters with same boss/pattern |
| No adaptation after 5+ attempts | Learning impossible → CHEAP or SPIKE-BAD |

### When Fatigue Appears

| Signal | Timing (typical) |
|--------|-----------------|
| First fatigue signals | 20-30 minutes |
| Noticeable fatigue | 35-45 minutes |
| Session-ending fatigue | 45-60 minutes |
| Burnout (won't return) | Varies. Watch for emotional disengagement. |

---

## 9. HC-LIVE Observation Philosophy

### Core Principles

| # | Principle |
|---|-----------|
| 1 | **Observe before acting.** No tuning without observation. No observation without evidence. |
| 2 | **Evidence before tuning.** HC-PT-06 Level 3 minimum for any parameter change. |
| 3 | **Repetition before conclusions.** One session is a story. Three sessions is a pattern. Five testers is truth. |
| 4 | **Preserve hardcore identity.** Evidence may reveal problems. Solutions must not soften the game. |
| 5 | **Freezes remain active.** All NEVER-TOUCH parameters are sacred. All 8 blocks are locked. |
| 6 | **No design-by-complaint.** Players complain. That's not evidence. Behavior is evidence. |
| 7 | **Behavior over opinion.** Watch what players DO. Ignore what they SAY unless it classifies behavior. |
| 8 | **External data > internal feel.** The designer is the worst playtester. External data is truth. |

### The Observer's Oath

> "I will observe without intervening. I will record without interpreting. I will classify without tuning. I will let the evidence speak before I act. I will protect the game's identity against my own biases, the testers' preferences, and the pressure to casualize. I am a scientist of hardcore feel."

---

## 10. Deliverable

**HC-LIVE-02A: External Observation Pipeline Foundation** is hereby established.

### The Pipeline Is Active

```
Player plays → Observer watches → Evidence captured → Classification → Validation → Escalation → Decision
```

No tuning without evidence. No evidence without observation. No observation without pipeline.

### HC-LIVE Status

| Sprint | Status |
|--------|--------|
| HC-LIVE-01A (Framework) | ✅ COMPLETE |
| HC-LIVE-02A (Observation Pipeline) | ✅ ACTIVE |
| HC-LIVE-03A (First external data collection) | Next |
