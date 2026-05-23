# HC-LIVE-03A — First External Observation Sessions

**Phase:** HC-LIVE  
**Status:** Active (protocol established)  
**Date:** 2026-05-23  
**Dependency:** HC-LIVE-02A (pipeline), HC-LIVE-01A (framework), HC-CAL-FREEZE (locked)

---

## 1. First External Session Protocol

### Pre-Session

| Step | Action | Duration |
|------|--------|----------|
| 1 | Verify game is running, no crashes, no setup issues | 2 min |
| 2 | **Briefing:** "This is a space shooter. Survive as long as you can. Your ship auto-fires. Move to dodge. Tap screen / press keys to fire special weapons." | 30s |
| 3 | Explicitly do NOT explain: scoring, rank, multiplier, medals, graze, FEVER, boss mechanics | N/A |
| 4 | Start recording (screen capture + audio) | — |

### During Session — The Observer Must NOT

| ❌ Never | Why |
|---------|-----|
| "You should try collecting those medals" | Coaching. Contaminates routing behavior. |
| "That boss is really hard" | Priming. Creates expectation of difficulty. |
| "Don't worry, that death was fair" | Defending the game. Let player's own perception form. |
| "What do you think so far?" (mid-session) | Interrupts flow. Breaks immersion. |
| "The real depth is in the scoring" | Hints at systems player hasn't discovered. |
| "You almost had it!" | Emotional steering. Observer is neutral. |
| "This part is supposed to be intense" | Explaining design. Let intensity speak. |
| Any sound, sigh, reaction | Observer is invisible. Zero presence. |

### During Session — The Observer MUST

| ✅ Always | Why |
|----------|-----|
| Record session start time | Baseline for timing metrics |
| Note every death: time, level, cause (visible) | Raw data |
| Note every quit: time, level, apparent reason | Quit analysis |
| Note visible emotional reactions: smile, laugh, exhale, lean, squint | Emotional data |
| Time between death and retry (<1s, 1-5s, 5-15s, >15s, no retry) | Retry motivation |
| Note if player checks score HUD | Score engagement |
| Note if player collects medals intentionally | Greed engagement |
| Note if player grazes intentionally | Risk behavior |
| Note body language shifts (lean in = intensity, lean back = disengagement) | Emotional data |

### Post-Session (Immediate)

| Step | Question | Purpose |
|------|----------|---------|
| 1 | "How did that feel?" (open) | Let player choose vocabulary |
| 2 | "What was the hardest part?" | Fairness/friction detection |
| 3 | "Do you want to play again?" | Retry motivation — THE most important question |
| 4 | "What was your favorite moment?" | Memorability |
| 5 | "Did anything feel unfair?" | Fairness perception |
| 6 | "Did you notice the scoring system?" | Score engagement |
| 7 | "What would you tell a friend about this game?" | Word-of-mouth potential |

---

## 2. Tester Selection Strategy

### Priority Profiles for First Sessions

| # | Profile | Why first | Target count | Key observation |
|---|---------|-----------|-------------|-----------------|
| 1 | **First-contact** (never played shmup) | Tests onboarding, early fairness, CALM quality | 1-2 | Do they survive level 1? Do they understand dodging? |
| 2 | **Casual gamer** (plays games, not shmups) | Tests accessibility, early difficulty perception | 1-2 | Do they reach level 3? Do they retry? |
| 3 | **Shmup-experienced** (plays shmups occasionally) | Core target audience. Tests mid-game pacing. | 2-3 | Do they reach level 10? Do they engage with scoring? |
| 4 | **Hardcore veteran** (dedicated shmup player) | Tests late-game, rank, boss fairness | 1-2 | Do they reach EMPERADOR? Do they identify CHEAP deaths? |
| 5 | **Mobile player** (phone/tablet) | Tests small-screen readability | 1-2 | Can they parse threats? Do they squint? |

### What NOT to Overinterpret Per Profile

| Profile | Don't overinterpret |
|---------|-------------------|
| First-contact | "This is too hard" — expected. Learning curve is real. |
| Casual gamer | Score ignorance — they're surviving, not scoring. |
| Shmup-experienced | Boss complaints — they have genre expectations. Classify, don't dismiss. |
| Hardcore veteran | "Too easy early game" — early game is for casuals. Late game is for them. |
| Mobile player | "I can't see" — platform limitation. HC-RD mobile boosts already applied. |

---

## 3. First Session Observation Checklist

```
☐ Death times recorded (level + section + cause)
☐ Retry times recorded (<1s / 1-5s / 5-15s / >15s / no retry)
☐ Quit point recorded (level + reason)
☐ Emotional reactions noted (smile, frustration, surprise, celebration)
☐ Score HUD glances counted
☐ Intentional medal collection observed (yes/no/partially)
☐ Graze behavior observed (never/accidental/intentional)
☐ Boss reactions noted per boss
☐ Panic movement detected (yes/no, which level)
☐ Adaptation observed between runs (yes/no, which section)
☐ Route changes observed (yes/no, player experimented?)
☐ "One more run?" answer recorded (yes/hesitation/no)
☐ Favorite moment recorded
☐ Perceived unfairness recorded (which level/section)
☐ Score awareness recorded (player mentions score?)
```

---

## 4. Replay Motivation Tracking

### Indicators

| Category | Signal | Meaning |
|----------|--------|---------|
| ✅ **POSITIVE** | Instant retry (<3s) | FAIR death. Strong motivation. |
| ✅ **POSITIVE** | "One more run" after session | Healthy engagement. |
| ✅ **POSITIVE** | Player asks "what was my score?" | Score engagement beginning. |
| ✅ **POSITIVE** | Player describes specific section positively | Memorability. |
| ⬜ **NEUTRAL** | Retry after pause (3-10s) | Processing. Normal. |
| ⬜ **NEUTRAL** | "Maybe later" to replay | Fatigue or time constraint. Not necessarily negative. |
| ⬜ **NEUTRAL** | Player doesn't notice scoring | Expected for survival-focused testers. |
| ❌ **NEGATIVE** | Retry delay > 15s | Significant setback. Monitor. |
| ❌ **NEGATIVE** | No retry after death (quit session) | RECOVERY-BAD potential. Classify death cause. |
| ❌ **NEGATIVE** | "This game is unfair" | CHEAP perception. Classify the deaths. |
| ❌ **NEGATIVE** | Player stops reacting emotionally | FATIGUE or EMOTIONAL-FLATLINE. |
| ❌ **NEGATIVE** | "I don't want to play again" | CRITICAL if across multiple testers. |

---

## 5. Session Classification System

| Classification | Signs | Action |
|---------------|-------|--------|
| **Healthy engagement** | Retries < 5s, emotional reactions, "one more run" | ✅ None. Game working. |
| **Productive struggle** | Deaths but retries, adaptation visible, frustration at self | ✅ None. Learning curve healthy. |
| **Adaptation phase** | Decreasing death count per run, route changes | ✅ None. Player improving. |
| **Readability stress** | "I can't see", squinting, panic movement | ⚠️ Note level + density. Monitor. |
| **Fatigue accumulation** | Error rate rises over session, engagement drops | ⚠️ Note timing. Compare across sessions. |
| **Score disengagement** | Never checks score, ignores medals, "score doesn't matter" | ⚠️ Expected for survival testers. Only flag if Score Play tester. |
| **Replay collapse** | No retry after death, "I'm done", session < 10 min | ❌ Classify death cause. Flag for watchlist. |
| **Frustration toxicity** | Blames game, "unfair", "impossible", rage quit | ❌ Classify deaths as FAIR/CHEAP. If CHEAP confirmed, escalate. |

---

## 6. Observation Logging Format

```markdown
## HC-LIVE Session #[N]
**Date:** YYYY-MM-DD
**Player profile:** [profile]
**Shmup experience:** [none / casual / intermediate / veteran]
**Session duration:** [X min]
**Runs:** [N complete / partial]
**Highest level reached:** [Lv N]

### Death Log
| # | Level | Section | Cause | Retry time | Classification |
|---|-------|---------|-------|-----------|---------------|
| 1 | 3 | PINCER | Diver | 2s | FAIR |
| 2 | 7 | FORTRESS | Density | 8s | NOISY? |
| 3 | 10 | SERPENTRIX | Sweep pattern | 15s | FAIR (learning) |

### Quit Point
**Level:** [N] **Reason:** [death / boss kill / fatigue / time]

### Emotional Markers
- Level 3 PINCER: "Wow, that's a lot of enemies!" (positive)
- Level 10 SERPENTRIX death: "That pattern is tricky" (productive frustration)
- Post-session: "I want to try again" (positive)

### Score Interaction
- HUD glances: ~1-2 per run
- Medal collection: partially (collected few, ignored most)
- Graze: none
- Multiplier awareness: "There's a multiplier?"

### Greed Behavior
- Intentional medal chases: 0
- Accidental close-range kills: 2
- Risk avoidance: high (stayed at screen bottom)

### Replay Urge
- "Do you want to play again?" → "Yes, let me try that boss again"
- ⏱️ Retry motivation: HIGH

### Friction Points
| # | Type | Location | Severity | Confidence |
|---|------|----------|----------|-----------|
| 1 | NOISY | Level 7 FORTRESS density | MEDIUM | LOW (single session) |

### Observer Notes
[Free-form observations]
```

---

## 7. First Real Risk Detection

### Signals That Would Be Concerning (even in few sessions)

| Signal | If observed | Action |
|--------|-----------|--------|
| **Instant replay collapse** | 3/5 testers quit after 1 death, don't want to retry | Classify deaths. If CHEAP → escalate. If FAIR → investigate recovery. |
| **Universal score ignore** | 0/5 testers notice scoring exists | Score feedback invisible. Consider HC-CAL-02 follow-up. |
| **Repeated CHEAP perception** | 3/5 testers say "unfair" about same section | Escalate. Classify with HC-PT-03. |
| **Recovery impossibility** | 4/5 testers abandon run after first death | RECOVERY-BAD systemic. Escalate. |
| **Readability failure** | 3/5 testers squint, complain about visibility | HC-RD audit. Check specific level + background. |
| **Complete greed rejection** | 0/5 testers ever chase a medal, ever graze | GREEDLESS systemic. Score economy not tempting. |
| **Boss frustration spikes** | 3/5 testers express frustration at same boss | Classify boss patterns. Check FAIR vs CHEAP. |
| **Severe fatigue** | 3/5 testers quit before level 15 citing exhaustion | DRAINING systemic. Late-game pacing failure. |

**DO NOT ACT YET.** These are detection thresholds, not action triggers. Collect 5+ sessions before any classification.

---

## 8. HC-LIVE Observer Rules

### The Observer's Code

| Rule | Meaning |
|------|---------|
| **No backseating** | Don't tell the player what to do. Ever. |
| **No explaining systems** | If player doesn't discover scoring, that's data. |
| **No difficulty apologies** | Don't say "this part is hard." Let them experience it. |
| **No emotional steering** | Don't celebrate their kills. Don't console their deaths. Neutral. |
| **No selective observation** | Record everything. Don't only note the dramatic moments. |
| **No defending the game** | If player says "that was unfair," write it down. Don't argue. |
| **No fishing for compliments** | Don't ask "wasn't that cool?" Let them volunteer praise. |
| **Record, don't interpret** | "Player died at level 7" is observation. "Player died because the game is too hard" is interpretation. Only the first is valid. |

---

## 9. Pipeline Validation

### After First 5 Sessions, Evaluate

| Question | How to evaluate |
|----------|----------------|
| Does the pipeline work? | Were all checklist items captured? |
| Are categories sufficient? | Did any observation not fit HC-PT-03 taxonomy? |
| Is evidence classifiable? | Could deaths be classified as FAIR/CHEAP/NOISY? |
| Are thresholds useful? | Did any observation trigger a false alert? |
| Is there excessive noise? | Were > 50% of observations UNCLASSIFIABLE? |

### Pipeline Calibration

If pipeline issues found:
- Missing categories → extend HC-PT-03 taxonomy (not gameplay)
- Unclear classification → refine observation questions
- Noisy data → add specificity to checklist
- Thresholds too sensitive → adjust confidence levels

Never: modify gameplay to make pipeline work better.

---

## 10. Deliverable

**HC-LIVE-03A: First External Observation Sessions** — Protocol established.

### Ready for First Session

| Element | Status |
|---------|--------|
| Session protocol (pre/during/post) | ✅ Defined |
| Tester selection strategy | ✅ 5 profiles, 7-11 testers target |
| Observation checklist | ✅ 15 items |
| Replay motivation tracking | ✅ 13 indicators (positive/neutral/negative) |
| Session classification | ✅ 8 types with signs + actions |
| Logging format | ✅ Standard template |
| Risk detection thresholds | ✅ 8 signals with actions |
| Observer rules | ✅ 8-rule code |
| Pipeline validation criteria | ✅ 5 evaluation questions |

### HC-LIVE Status

| Sprint | Status |
|--------|--------|
| HC-LIVE-01A (Framework) | ✅ COMPLETE |
| HC-LIVE-02A (Pipeline) | ✅ COMPLETE |
| HC-LIVE-03A (First Sessions Protocol) | ✅ ACTIVE |
| HC-LIVE-04A (Analysis) | Next |
