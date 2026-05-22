# HC-LIVE-01A — External Validation Framework Foundation

**Phase:** HC-LIVE (ACTIVE)  
**Status:** Framework established  
**Date:** 2026-05-22  
**Dependency:** HC-CAL-FREEZE (production-stable lock), HC-PT (complete), HC Foundation (frozen)

---

## 1. HC-LIVE Core Philosophy

### Why HC-LIVE Begins

The Hardcore Foundation is built. The playtest framework is complete. The calibration is frozen. Every system has been audited, tuned, validated, and locked.

The work that remains cannot be done internally:

| Internal work | External work |
|--------------|---------------|
| "I think this feels right" | "Real players behave this way" |
| "The math says this is fair" | "Nobody dies here unfairly" or "Everyone dies here" |
| "The scoring system is deep" | "Players discover routes independently" |
| "Recovery is possible" | "Players actually recover and continue" |
| "One more run" | "Players actually play another run" |

**HC-LIVE shifts from designer intuition to player observation.**

### What Changes from HC-CAL

| HC-CAL | HC-LIVE |
|--------|---------|
| Internal calibration | External validation |
| Designer feels the game | Players show how they play |
| Hypothetical scenarios | Real behavior data |
| "Should work" | "Does work" |
| Tuning based on analysis | Observation without tuning |
| Active system modification | Passive behavioral study |

### Observation > Intuition

The designer has played 100+ hours. The designer knows every pattern, every spawn, every safe zone. The designer is the worst possible playtester.

A fresh player's first 5 minutes contain more truth about the game than 50 hours of designer testing.

### Calibration vs Validation

| Calibration | Validation |
|------------|-----------|
| Changes the game | Observes the game |
| Adjusts parameters | Records behavior |
| Fixes problems | Identifies problems |
| Active | Passive |
| HC-CAL's job | HC-LIVE's job |

---

## 2. Validation Goals

### Official HC-LIVE Objectives

| # | Goal | Why it matters |
|---|------|---------------|
| 1 | **Replay motivation** | Does the game generate "one more run"? |
| 2 | **Fairness external** | Do external players perceive deaths as FAIR or CHEAP? |
| 3 | **Score psychology** | Does scoring tempt, reward, and create obsession? |
| 4 | **Readability across skill** | Can players of varying skill parse threats? |
| 5 | **Retention emotional** | Do players want to come back tomorrow? |
| 6 | **Greed validation** | Do players take risks for score? Do they survive them? |
| 7 | **High-rank viability** | Is rank 5 survivable for elite players? |
| 8 | **Spectator value** | Is the game exciting to watch? |
| 9 | **Long-session sustainability** | Can players play 30+ minutes without burning out? |

---

## 3. Hardcore Validation Principles

### 7 Principles

| # | Principle | Meaning |
|---|-----------|---------|
| 1 | **Evidence first** | No tuning without data. No data, no change. |
| 2 | **Behavior over opinion** | Watch what players DO, not what they SAY. "It's too hard" = player died 4 times. That's data. |
| 3 | **Repetition over anecdotes** | One player's experience is a story. Three players' same experience is a pattern. |
| 4 | **Preserve hardcore identity** | Validation finds problems. Solutions must not soften the game. |
| 5 | **No casualization** | "Too hard for casuals" is not a bug. It's the genre. |
| 6 | **No reactive tuning** | One bad session doesn't mean the game is broken. |
| 7 | **No design-by-complaint** | Players complain. That doesn't mean they're right. |

---

## 4. External Validation Boundaries

### What HC-LIVE Is NOT

| HC-LIVE is NOT | Why |
|---------------|-----|
| **A balance pass** | Calibration is frozen. No systemic retuning. |
| **An accessibility redesign** | The game is hardcore. That's the identity. |
| **Public appeasement** | We don't make the game easier because players ask. |
| **"Make it easier"** | HC-LIVE observes, doesn't soften. |
| **System rebuilding** | Foundation is frozen. No architecture changes. |

### What HC-LIVE IS

| HC-LIVE IS | Why |
|-----------|-----|
| **Behavioral observation** | Watch real players. Record what happens. |
| **Pattern detection** | Find where real players struggle, quit, thrive. |
| **Evidence collection** | Build the dataset that justifies future work. |
| **Identity protection** | Prove the game is hardcore by showing players engaging with it. |
| **Release preparation** | Validate that the game is ready for the world. |

---

## 5. Observation Priorities

### What to Observe First

| Priority | Observation | Method |
|----------|-----------|--------|
| **P0** | Retry behavior (time between death and restart) | Timer. Each death → record seconds to retry. |
| **P0** | Quit moments (when does player end session?) | Record level + section + cause at session end. |
| **P1** | Greed attempts (medal chases, grazes, close-range kills) | Count per session. Compare Score Play vs Survival testers. |
| **P1** | Score interaction (multiplier HUD glances, chain monitoring) | Tester interview + observation. |
| **P1** | Emotional reactions (verbal, body language) | HC-PT-05 observation rules. |
| **P2** | Adaptation between runs (does player improve?) | Compare run N vs run N+1 deaths in same section. |
| **P2** | Recovery attempts (does player rebuild after death?) | Post-death behavior: continue or abandon? |
| **P2** | Boss memory (can player describe boss mechanics?) | Post-session interview. |
| **P2** | Replay urge ("do you want to play again?") | Post-session question. |

---

## 6. External Risk Areas

### Areas to Monitor

| Risk | What to watch | Threshold |
|------|--------------|-----------|
| **Fairness collapse** | Deaths classified as CHEAP by external testers | > 30% of deaths = REOPEN HC-CAL |
| **Readability collapse** | "I can't see" complaints across skill levels | > 30% of testers = REOPEN HC-CAL |
| **Fatigue accumulation** | Session length decreasing across sessions | > 50% decrease = investigate |
| **Score disengagement** | Multiplier at ×1.0 across all sessions for score players | > 60% of score testers = investigate |
| **Replay collapse** | Players play 1 session and never return | > 40% one-session players = REOPEN HC-CAL |
| **High-rank saturation** | Rank 5 unreachable by top 10% of players | > 60% never reach rank 4 = investigate |
| **Impossible recovery** | Run abandonment > 50% after first death | REOPEN HC-CAL |
| **Pacing exhaustion** | Players quit mid-session with fatigue complaints | > 40% of sessions end early = investigate |

---

## 7. Validation Success Conditions

### Positive Signals (The Game Is Working)

| Signal | Evidence |
|--------|----------|
| **Voluntary replay** | Player restarts without prompting after death or session end |
| **One-more-run behavior** | "Just one more" verbalized. Session extends beyond planned time. |
| **Score chasing** | Player checks score, asks "what was my last score?", compares runs |
| **Route discovery** | Player finds medal routes, aggression patterns independently |
| **Memorable bosses** | Player describes bosses by mechanic, not color. "The one that teleports" |
| **Emotional highs** | Visible celebration on boss kill, FEVER activation, ELITE phase |
| **Clutch stories** | "I almost died but…" — player recalls specific intense moments |
| **Mastery desire** | Player asks "how do I get better at X?" or practices specific sections |

---

## 8. Reopen Conditions

### When HC-LIVE Evidence Justifies Reopening HC-CAL

| Condition | Evidence type | Minimum threshold |
|-----------|--------------|------------------|
| **Consistent cross-player evidence** | Same issue reported by 3+ independent testers | REPRODUCIBLE ISSUE (HC-PT-06 Level 3) |
| **Persistence after learning** | Issue persists across 3+ sessions for same tester | TELEMETRY-SUPPORTED (Level 4) |
| **Systemic unfairness** | CHEAP classification in > 30% of deaths, multiple testers | SYSTEMIC PATTERN (Level 5) |
| **Recovery impossibility** | Run abandonment > 50% after first death | TELEMETRY-SUPPORTED |
| **Replay destruction** | > 40% of players never return after session 1 | SYSTEMIC PATTERN |

### What Does NOT Justify Reopening

- ❌ Single tester complaint ("this boss is too hard")
- ❌ First-session struggle (learning curve is expected)
- ❌ "I don't like this mechanic" (preference, not issue)
- ❌ "Other games do it differently" (genre comparison)
- ❌ "Make it easier" (difficulty is intentional)

---

## 9. HC-LIVE Governance

### Master Rules

| Rule | Enforcement |
|------|-----------|
| **Freezes remain active** | All NEVER-TOUCH parameters are sacred. All 8 frozen blocks are locked. |
| **Tuning requires evidence** | Any parameter change requires HC-PT-06 Level 3 evidence minimum. |
| **Preserve hardcore identity** | HC-PT-07 standards are the reference. Any change must pass all 7 standards. |
| **Avoid overreaction** | One bad session ≠ systemic issue. Minimum 3 data points before action. |
| **Avoid tester bias** | Cross-reference across tester profiles (HC-PT-05 Section 3). Don't tune for optimizers only. |
| **Avoid developer bias** | The designer is the worst tester. External data > internal feel. |

### Decision Matrix

| Observation | Action |
|------------|--------|
| 1 tester, 1 session, MEDIUM issue | Document. Do nothing. |
| 3 testers, same issue, LOW severity | Document. Do nothing. |
| 3 testers, same issue, HIGH severity | Collect more data. Minimum 5 testers. |
| 5+ testers, same issue, HIGH severity, persists after learning | Reopen HC-CAL for that specific parameter. |
| 10+ testers, CRITICAL issue (crash/freeze) | Fix immediately. No process needed. |

---

## 10. Deliverable

**HC-LIVE-01A: External Validation Framework Foundation** is hereby established.

### HC-LIVE Phase Roadmap

| Sprint | Purpose | Status |
|--------|---------|--------|
| **HC-LIVE-01A** | Framework Foundation | ✅ ACTIVE |
| HC-LIVE-02 | First External Playtest Protocol | Next |
| HC-LIVE-03 | Behavioral Data Collection | After 02 |
| HC-LIVE-04 | External Audit Analysis | After 03 |
| HC-LIVE-05 | Production Validation Report | After 04 |

---

## Foundation Status

```
HC Foundation (8 blocks)  → FROZEN
HC-INT (integration)       → VERIFIED
HC-PT (7 docs)             → COMPLETE
HC-CAL (6 sprints)         → PRODUCTION-STABLE
HC-LIVE (launching)        → ACTIVE

All systems locked. External validation begins.
The era of designer intuition is over.
The era of player observation begins.
```
