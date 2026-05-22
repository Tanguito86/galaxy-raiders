# HC-PT — Hardcore Feel Framework

**Phase:** HC-PT (Playtesting & Emotional Calibration)  
**Status:** ACTIVE — Framework established  
**Date:** 2026-05-22  
**Foundation:** 8 frozen blocks + HC-INT integration verified  

---

## 1. HC-PT Philosophy

### Purpose of This Phase

The Hardcore Foundation (HC-RD through HC-ST + HC-INT) is complete and frozen. All systems are built, integrated, and verified. Now the question shifts from **"does it work?"** to **"how does it feel?"**

HC-PT exists to answer:
- Does Galaxy Raiders feel like a hardcore shmup?
- Does difficulty generate emotion, not frustration?
- Does the score economy tempt the player into risk?
- Does the pacing breathe naturally?
- Does recovery feel earned?
- Does the player want "one more run"?

### Definition of "Hardcore Feel"

Hardcore feel is **not** about maximum difficulty. It is about:

| Element | Definition |
|---------|-----------|
| **Tension that breathes** | Pressure rises and falls. The player never feels trapped in constant stress. |
| **Fairness that is visible** | Every death must feel like the player's fault. Threats must be readable before they kill. |
| **Risk that is tempting** | Aggressive play, medal routing, and grazing must feel worth the danger. |
| **Recovery that is possible** | After a hit, the player must feel hope — not despair. Comeback must be mechanically viable. |
| **Mastery that scales** | The game gets harder as the player gets better. Elite play feels intense; casual play feels fair. |

### Difficulty vs Emotional Pressure

| Difficulty | Emotional Pressure |
|-----------|-------------------|
| More HP, more bullets, faster speeds | Tension curves, pacing, contrast |
| "Harder" | "More intense" |
| Mechanical | Emotional |
| Measures enemy stats | Measures player experience |
| Solved with numbers | Solved with flow design |

**HC-PT focuses on emotional pressure. Difficulty is already calibrated.**

---

## 2. Core Principles

### 2.1 Hard But Fair

> "Every death must teach. No death must feel random."

- Threats must be **telegraphed** (HC-RD compliance)
- Hitboxes must be **precise** (HC-HB compliance)
- Damage must be **survivable** (recovery systems exist)
- Bullets must be **visible** against background (HC-RD alpha floors)

### 2.2 Readable Pressure

> "The player must know they are in danger before they die."

- Telegraphs before attacks (HC-RD telegraph consistency)
- Color language for threat types (HC-RD color taxonomy)
- Bullet outlines for background separation (HC-RD bullet clarity)
- No full-screen curtains without warning

### 2.3 Emotional Pacing

> "The game must breathe. Tension rises and falls like a story."

- 5 tension curve patterns (HC-ST pacing doctrine)
- Sawtooth: peaks rise, valleys rise
- Pulse: spikes with flat valleys
- Collapse: start high, release slowly
- Slow burn: continuous ramp
- Overload: maximum sustained (used sparingly)

### 2.4 Recovery Satisfaction

> "After a hit, the player must feel hope."

- RECOVERING state: 4s after hit, governor blocks difficulty increases
- Multiplier penalty: −30%, not full reset
- Recovery bonus: +1500 score + multiplier restoration on comeback
- Survival chains: 30/60/120s milestones reward consistency

### 2.5 Score Temptation

> "The score system must make the player want to take risks."

- Medal chains tempt routing
- Graze tempts proximity
- Aggression bonuses tempt close-range kills
- Multiplier decay tempts sustained aggression
- Boss efficiency tempts fast phase clears

### 2.6 "One More Run" Psychology

> "The game must end with the player wanting to start again."

- Grade system (S/A/B/C) creates clear skill ceiling
- High score table (local + Firebase global) creates competition
- Medal chain recovery grace (90 frames) creates "almost had it" moments
- Rank system rewards improvement across runs
- Multiplier reward structure makes every run feel different

---

## 3. Framework Scope

### What HC-PT Covers

| Domain | Questions HC-PT asks |
|--------|---------------------|
| **Feel** | Does the game feel intense? Does it feel fair? Does it feel arcade? |
| **Fairness** | Are deaths telegraphed? Are hitboxes respected? Is recovery possible? |
| **Readability** | Are bullets visible? Are telegraphs clear? Is HUD readable? |
| **Fatigue** | Does the game exhaust the player? Do long sessions feel sustainable? |
| **Pacing** | Do tension curves work? Is relief genuine? Are preludes effective? |
| **Score engagement** | Does scoring incentivize mastery? Are exploits blocked? Is routing rewarded? |
| **Emotional states** | Does the player feel tension, relief, triumph, determination? |
| **Memorability** | Which moments stick? Which levels are unforgettable? Which are interchangeable? |

### What HC-PT Does NOT Cover

| Domain | Handled by |
|--------|-----------|
| Engine architecture | Frozen — HC foundation complete |
| Feature implementation | Frozen — no new systems in HC-PT |
| Balance tuning (numbers) | SAFE-TUNING params per each frozen block |
| Content creation (new levels/bosses) | Future HC-CONTENT phase (post-PT) |
| Mobile platform testing | Separate platform QA |
| Performance optimization | Pre-existing, monitored but not PT scope |

---

## 4. Non-Goals (explicit)

| Non-Goal | Reason |
|----------|--------|
| **Engine rewrites** | Foundation is frozen. No refactors. |
| **Architecture refactors** | HC-INT verified coexistence. |
| **Freeze breaks** | NEVER-TOUCH parameters are sacred. |
| **Random balancing** | SAFE-TUNING params only. Justification required. |
| **Content creep** | No new enemies, bosses, waves, spells, weapons. |
| **Android-specific** | Platform support is separate. |
| **ES modules / frameworks** | Vanilla JS only. |
| **Cinematic additions** | No cutscenes, no scripted sequences. Gameplay-driven. |
| **"Modern" UX rewrites** | Arcade purity is the aesthetic. |

---

## 5. Governance Rules

### 5.1 How to Evaluate Future Changes

Every proposed change during HC-PT must answer:

1. **Which frozen block does this affect?**
2. **Is the parameter SAFE-TUNING or NEVER-TOUCH?**
3. **What is the emotional goal?** (not just "harder" or "easier")
4. **What evidence supports this change?** (playtest data, not intuition)
5. **What is the rollback plan?**

### 5.2 How to Justify Tuning

| If the problem is... | Then tune... | From block |
|---------------------|-------------|-----------|
| Wave feels too long | `section.durationMs` | HC-ST stage plans |
| Bullets feel too fast at rank 5 | `safetyBulletSpeedMax` (NEVER-TOUCH — requires re-audit) | HC-RK |
| Multiplier decays too fast | `decay.ratePerFrame` (SAFE-TUNING) | HC-SC |
| Relief feels too empty | `recoveryMaxIntensity` (SAFE-TUNING) | HC-ST |
| Graze score too low | `graze.scoreBase` (SAFE-TUNING) | HC-SC |
| Boss prelude too short | `bossPreludeMinMs` (SAFE-TUNING) | HC-ST |

### 5.3 How to Classify Problems

| Severity | Definition | Action |
|----------|-----------|--------|
| **CRITICAL** | Game crashes, softlocks, or becomes unplayable | Reopen freeze, fix immediately |
| **HIGH** | System produces unfair/unreadable gameplay | Reopen freeze, apply minimal fix |
| **MEDIUM** | Emotional pacing broken (relief doesn't feel like relief, overload is constant) | Tune SAFE params |
| **LOW** | Cosmetic issue, display clarity, popup density | Tune SAFE params or defer |
| **OBSERVATION** | Noted for future, no action needed | Document and continue |

### 5.4 How to Preserve Hardcore Identity

- **Never sacrifice readability for spectacle.**
- **Never increase difficulty without increasing opportunity.**
- **Never remove recovery windows.**
- **Never make death feel like game-over.**
- **Never let safe play dominate score.**
- **Always keep "one more run" alive.**

---

## 6. Future HC-PT Blocks

| Block | Name | Purpose |
|-------|------|---------|
| **HC-PT-02** | Feel Taxonomy | Define emotional states precisely (tension, relief, flow, frustration, triumph, determination, fatigue, boredom) |
| **HC-PT-03** | Friction Classification | Classify sources of negative player experience (unreadable deaths, unfair spawns, recovery gaps, pacing flatness) |
| **HC-PT-04** | Emotional Pacing Audit | Per-level emotional curve validation. Does level 6 feel like a collapse? Does level 17 feel like a storm? |
| **HC-PT-05** | Playtest Methodology | Standardized playtest protocol: test scenarios, player profiles, data collection, evaluation rubric |
| **HC-PT-06** | Telemetry Planning | What to measure during playtests (score curves, death locations, rank progression, multiplier uptime) |
| **HC-PT-07** | Production Standards | Final quality bar for release: readability, fairness, pacing, engagement minimums |

---

## 7. Documentation Standards

### 7.1 Terminology Consistency

| Term | Definition | Used in |
|------|-----------|---------|
| **Tension** | Current intensity level (0.0-1.0) estimated from enemies, bullets, rank | HC-ST |
| **Pressure** | Sustained high-tension state | HC-RK, HC-WC |
| **Relief** | Deliberate low-intensity section for mental recovery | HC-ST |
| **Fairness** | Threats are telegraphed, hitboxes are precise, deaths are player's fault | HC-HB, HC-RD |
| **Readability** | Bullets, telegraphs, and threats are visually clear | HC-RD |
| **Pacing** | Macro-level flow of tension across a level or run | HC-ST |
| **Recovery** | Multi-system cooldown after player takes damage | HC-RK, HC-SC |
| **Mastery** | Player skill expression through routing, aggression, scoring | HC-SC |
| **Emotional pressure** | How the game FEELS (not how hard it is) | HC-PT |

### 7.2 Severity Labels

```
CRITICAL  — Game-breaking. Blocks release.
HIGH      — Unfair or unreadable gameplay. Must fix before release.
MEDIUM    — Emotional pacing issue. Should fix.
LOW       — Cosmetic or minor. Nice to fix.
OBSERVATION — Noted. No action needed.
```

### 7.3 Emotional Labels

```
TENSION     — Player feels pressure, engaged, alert
RELIEF      — Player feels safe, can breathe, can plan
FLOW        — Player is fully immersed, time disappears
FRUSTRATION — Player feels cheated, deaths feel random
TRIUMPH     — Player overcomes challenge, feels powerful
DETERMINATION — Player wants to try again after failure
FATIGUE     — Player feels exhausted, wants break
BOREDOM     — Player disengaged, sections feel empty or repetitive
```

### 7.4 Fairness Labels

```
FAIR        — Death was the player's fault. Threat was telegraphed.
UNFAIR      — Death felt random. Threat had no warning.
AMBIGUOUS   — Unclear if death was fair. Needs investigation.
UNREADABLE  — Threat existed but was not visually clear.
INEVITABLE  — Player could not have dodged. Pattern requires repositioning.
```

### 7.5 Evaluation Template

```markdown
## Playtest Session #[N]
**Date:** YYYY-MM-DD
**Player profile:** [casual / intermediate / advanced / elite]
**Level range:** [Lv N → Lv M]
**Duration:** [X minutes]

### Emotional Curve
[Describe tension arc: where did it rise, where did it breathe, where did it feel flat]

### Deaths
| # | Level | Cause | Fairness | Notes |
|---|-------|-------|----------|-------|
| 1 | 7 | Diver ambush | FAIR | Telegraph was visible, player misread |
| 2 | 15 | ORBITAL ring | UNREADABLE | Ring blended with background |

### Score Engagement
- [Did scoring feel motivating? Was multiplier satisfying?]

### Memorability
- [Which moments stood out?]

### Issues Found
- [Severity] [Description]

### Verdict
- [EMOTIONAL STATE at end: TRIUMPH / DETERMINATION / FATIGUE / FRUSTRATION]
```

---

## 8. Foundation Reference

All HC-PT work references the frozen foundation:

| Block | Freeze Commit | Doc Reference |
|-------|-------------|---------------|
| HC-RD | (pre-HC-PT) | ai/hc-rd-freeze-candidate.md |
| HC-HB | (pre-HC-PT) | ai/hc-hb-freeze-candidate.md |
| HC-PD | (pre-HC-PT) | — |
| HC-WC | (pre-HC-PT) | ai/hc-wc-freeze-audit.md |
| HC-BD | bc87e9d | ai/hc-bd-final-freeze.md |
| HC-RK | eb9688f | ai/hc-rk-08-live-audit-freeze.md |
| HC-SC | bc7bd52 | ai/hc-sc-final-freeze.md |
| HC-ST | 54cd5f9 | ai/hc-st-freeze-candidate.md |
| HC-INT | 1563466 | ai/hc-int-integration-audit.md |
