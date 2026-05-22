# HC-PT-07 — Production Feel Standards

**Phase:** HC-PT  
**Status:** Active (standards established — FINAL HC-PT document)  
**Date:** 2026-05-22  
**Dependency:** HC-PT-06 (telemetry), HC-PT-05 (methodology), HC-PT-04 (pacing), HC-PT-03 (friction), HC-PT-02 (taxonomy), HC-PT-01A (framework)

---

## 1. Production Feel Philosophy

### What Is "Production-Grade Hardcore Feel"?

A game is **playable** when it doesn't crash.  
A game is **difficult** when it kills the player.  
A game is **hardcore** when difficulty generates emotion.  
A game is **arcade-quality** when emotion generates obsession.  
A game is **production-ready** when obsession is sustainable, fair, and calibrated.

Galaxy Raiders must reach: **arcade-quality with production-ready feel.**

### The Hardcore Quality Ladder

| Level | Definition | What it takes |
|-------|-----------|--------------|
| **Playable** | No crashes, no softlocks | Basic engineering |
| **Difficult** | Player dies frequently | Bullet patterns, enemy stats |
| **Hardcore** | Deaths feel earned, retry happens, emotion exists | Fairness + readability + pacing |
| **Arcade-quality** | "One more run" is the default response | All HC-PT standards met |
| **Production-ready** | Quality is consistent across all levels, all profiles | Standards verified by playtest evidence |

### Why Intensity Alone Is Not Enough

A game can be intensely difficult and feel **terrible**. Intensity without:
- **Readability** → PANIC-NO-READ → frustration
- **Fairness** → CHEAP deaths → quit
- **Pacing** → OVERLOAD → exhaustion
- **Recovery** → RECOVERY-BAD → run abandonment
- **Score temptation** → SCORE-DEAD → indifference

**Production feel = intensity × fairness × readability × pacing × recovery × greed.**

---

## 2. Official Hardcore Standards

### 2.1 Fairness Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Death attribution | Player can identify cause of death in 80%+ of deaths | Player can identify cause in 95%+ | Player blames game ("cheap") in > 30% of deaths | "Where did that come from?", "That was random" |
| Telegraph visibility | All lethal attacks have ≥ 300ms visible warning | All attacks have ≥ 400ms | Any attack with 0-frame telegraph | Deaths within 2s of encounter start |
| Hitbox accuracy | Hitbox ≤ visual sprite size | Hitbox < visual sprite (3px radius in HC-HB) | Hitbox > visual sprite | Player dies when visually clear of bullet |
| Spawn fairness | Enemies never spawn within 40px of player | No spawns within 60px | Spawn inside player hitbox | Death at start of wave/section |
| Escape routes | At least 1 dodgeable gap in every pattern | Multiple viable gaps | Pixel-perfect-only gaps | Pattern overlap creating solid walls |

### 2.2 Readability Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Bullet visibility | All bullets distinguishable from background | Dark outlines on all bullets (HC-RD) | Bullets share color with active background | "I can't see", squinting, leaning |
| Threat hierarchy | Dangerous elements visually dominant | PRIORITY layers: fatal → telegraph → enemy → feedback → ambient | Decorative elements masquerade as threats | Player dodges non-threats |
| Density readability | Player tracks individual bullets at max density | Player tracks + identifies bullet types at max density | Player sees "wall of color" not individual bullets | Movement becomes random, shooting stops |
| Popup management | Popups don't mask threats | Popups in PRIORITY_FEEDBACK only, alpha-capped | Popup flood during dense patterns | Death during popup burst |

### 2.3 Pressure & Pacing Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Pressure cadence | Alternation every 30-60s | Sawtooth: peaks rise, valleys breathe | Constant pressure > 90s | Player verbalizes exhaustion |
| Relief existence | ≥ 1 relief section per 2 pressure sections | 1:1 alternation in non-climax stages | No relief sections for > 3 pressure sections | Emotional flatline |
| Climax spacing | Boss/set piece preceded by prelude | Prelude 8-15s, field clear, music shift | Boss spawns without warning | Death in first boss attack |
| Tension escalation | Each peak ≥ previous peak in same level | Gradual rise, clear highest point | Same intensity throughout | "Every level feels the same" |
| Panic tolerance | Panic ≤ 15s, followed by relief or triumph | Panic 8-12s, clutch survival possible | Panic > 20s or PANIC→PANIC chain | Cognitive shutdown, random death |

### 2.4 Recovery Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Viability | Player can recover and continue after 1 death | Comeback feels possible and motivating | Player abandons run after 1st death > 50% of time | Run abandonment rate |
| Multiplier penalty | ≤ 40% loss, rebuildable in < 20 kills | 30% loss, rebuild in 10-15 kills | Full reset to ×1.0 | "Run's dead" mentality |
| Rank penalty | Loss proportional to gain rate | −8.0 per death, rebuildable | Rank reset to 0 | Rank never recovers |
| Recovery time | Player returns to pre-death performance in < 90s | < 60s | Player performance permanently degraded | Post-death performance worse indefinitely |
| Emotional quality | Player feels hope after death | Player feels determination | Player feels despair | Long retry pauses, "no point" verbalizations |

### 2.5 Score Engagement Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Multiplier engagement | Average > ×1.2 across session | Average > ×1.5 across session | ×1.0 entire session for Score Play testers | Player never checks multiplier HUD |
| Greed participation | ≥ 1 greed attempt per 5 minutes | ≥ 3 greed attempts per 5 minutes | 0 greed attempts across session | Player never grazes, never dives |
| Score composition | ≥ 2 sources > 5% of total | ≥ 4 sources > 5% | 1 source > 80% | Kills = 95% of score |
| Score HUD visibility | Player can state current multiplier | Player actively monitors multiplier | Player doesn't know multiplier exists | "There's a multiplier?" |

### 2.6 Memorability Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Level recall | Player names ≥ 8/20 levels | Player names ≥ 14/20 levels | Player names ≤ 3/20 levels | "They all feel the same" |
| Boss recall | Player describes all 5 bosses by mechanic | Player describes all 5 by name + mechanic | Player describes bosses by color only | "The red one, the blue one..." |
| Set piece recall | Player recalls ≥ 3/5 set pieces | Player recalls all 5 | Player recalls ≤ 1 set piece | "Were there set pieces?" |

### 2.7 Retry Motivation Standard

| Aspect | Minimum acceptable | Ideal target | Unacceptable | Warning signs |
|--------|-------------------|-------------|-------------|---------------|
| Retry rate | ≥ 60% of deaths followed by retry within 30s | ≥ 80% within 10s | < 40% retry within 30s | Long pauses, quit-after-death |
| Session retention | ≥ 3 sessions per tester | ≥ 5 sessions per tester | 1 session only | "I'll play later" → never |
| Post-session intent | "I'll play again" in ≥ 60% of testers | ≥ 80% | "I'm done" in ≥ 50% | No expressed desire to replay |

---

## 3. Production Failure Thresholds

An issue **blocks hardcore release** if:

| Condition | Why it blocks |
|-----------|--------------|
| **CRITICAL CHEAP** detected in any level | 1 unfair death destroys trust in the whole game |
| **Repeated PANIC-NO-READ** in 3+ levels | Players cannot engage with core gameplay |
| **Systemic SCORE-DEAD** across Score Play testers | Scoring system is the engine of replayability |
| **Chronic DRAINING** in Long-Session tests | Game cannot sustain arcade-length sessions |
| **Endless panic loops** (no relief possible) | Player has no escape, no learning, just suffering |
| **Fake climax saturation** (bosses don't feel like bosses) | Core emotional payoff of shmups broken |
| **RECOVERY-BAD** systemic (abandonment rate > 50%) | "One more run" engine destroyed |
| **CLARITY collapse** at rank 5 on any level | Max difficulty must remain readable |

---

## 4. Validation Readiness Rules

### HC-PT Stable

| Condition | Evidence required |
|-----------|------------------|
| All 12 test types executed at least once | Session logs per HC-PT-05 |
| At least 4 tester profiles represented | Tester classification per HC-PT-05 |
| All HIGH+ friction items resolved or mitigated | HC-PT-03 classified audit report |
| No CRITICAL issues open | Bug tracker |

### HC-PT Validated

| Condition | Evidence required |
|-----------|------------------|
| All MEDIUM+ items have telemetry-supported evidence | HC-PT-06 evidence system |
| At least 1 full 20-level run observed per tester profile | Session logs |
| Score Play testers achieve ≥ ×1.5 multiplier average | Score telemetry |
| Survival testers complete levels 1-10 in ≤ 2 sessions | Progression data |

### Hardcore Release-Ready

| Condition | Evidence required |
|-----------|------------------|
| All standards in Section 2 met at "minimum acceptable" level | Audit report |
| 5+ standards at "ideal target" level | Audit report |
| Zero BLOCKING ISSUES (Section 3) open | Bug tracker |
| 3+ testers report "one more run" mentality | Post-session interviews |

---

## 5. Calibration Protection Rules

### Anti-Over-Tuning

- **Never tune more than 1 parameter per playtest cycle.**
- **Never tune after 1 session.**
- **Never tune based on 1 tester's opinion.**
- **If unsure, wait for another session. Evidence accumulates.**

### Anti-Casualization

- **Fix READABILITY before reducing DENSITY.**
- **Fix RECOVERY before reducing PUNISHMENT.**
- **Fix FAIRNESS before reducing SPEED.**
- **Add greed incentives before reducing difficulty.**

### Preserving Greed Tension

- **If greed is never chosen: increase reward, not safety.**
- **If greed always chosen: increase risk slightly, not reward.**
- **Route-lock detected: balance alternative sources, don't nerf dominant one.**

### Preserving Pressure Integrity

- **Pressure must feel earned.**
- **Relief must feel deserved.**
- **Never add pressure without adding escape routes.**
- **Never remove relief without adding a new one elsewhere.**

---

## 6. Hardcore Benchmark Notes

### Cave Readability Standards
- Bullets must be visible against every background in the game.
- Dark outlines on ALL bullets. Zero exceptions.
- Priority layers: fatal threats ALWAYS on top.
- **Galaxy Raiders:** HC-RD compliance = Cave-level readability.

### DOJ Panic Cadence
- DOJ's hyper system rewards playing at the edge of panic.
- Panic is productive when it leads to risk-taking, not shutdown.
- **Galaxy Raiders:** HC-SC aggression bonuses + danger window = DOJ-level panic reward.

### Ketsui Pressure/Reward Structure
- Close-range lock-shot creates constant greed tension.
- Player is ALWAYS deciding: safe or greedy?
- **Galaxy Raiders:** HC-SC aggression tiers + medal chains = Ketsui-level tension.

### Garegga Greed Psychology
- Rank creates organic difficulty escalation based on player skill.
- Player must manage greed to control difficulty.
- **Galaxy Raiders:** HC-RK dynamic rank + HC-SC multiplier = Garegga-level depth.

---

## 7. Evaluation Examples

### GOOD — Meets Standards

| Example | Standards met |
|---------|--------------|
| "Brutal pero legible" — Level 17 survival corridor, HC-RD clarity, player dies but knows why | Fairness ✅ Readability ✅ |
| "Greed muy atractivo pero opcional" — Medal ×1.75 near-kill bonus tempts but doesn't force | Score Engagement ✅ Greed Tension ✅ |
| "Relief corto pero suficiente" — 10s relief with 2-3 enemies, player breathes, re-engages | Pacing ✅ Recovery ✅ |
| "Panic intenso pero claro" — Ambush section, heart rate up, parsing holds, clutch survival | Pressure ✅ Readability ✅ |
| "Comeback motivador" — Hit during boss, multiplier −30% not full reset, comeback bonus triggers | Recovery ✅ Score Engagement ✅ |
| "Retries inmediatas" — Death → instant restart, player knows what to do differently | Retry Motivation ✅ Fairness ✅ |

### BAD — Fails Standards

| Example | Standards failed |
|---------|-----------------|
| "Readability collapse" — Bullet curtain at rank 5, no outlines, player sees wall of color | Readability ❌ Pressure ❌ |
| "Safe-but-empty gameplay" — Player never risks, never grazes, never dives. Multiplier ×1.0. | Score Engagement ❌ Greed Tension ❌ Memorability ❌ |
| "Score ignorado" — 0/5 Score Play testers check multiplier. No one knows what FEVER is. | Score Engagement ❌ |
| "Boss agotador" — Boss death: player exhales "finally", no celebration, no retry desire | Climax ❌ Retry Motivation ❌ |
| "Climax sin payoff" — Boss death indistinguishable from regular enemy kill. No emotional release. | Memorability ❌ Pacing ❌ |
| "Endless panic" — 30s sustained PANIC, no relief, player cognitive shutdown, random death | Pressure ❌ Pacing ❌ Recovery ❌ |
| "Fatiga silenciosa" — Player stops launching game. No complaints. Just indifference. | Retry Motivation ❌ Fatigue ❌ |
| "Abandono emocional" — After 2 deaths, player quits run. After 3 sessions, player quits game. | Recovery ❌ Retry Motivation ❌ |

---

## 8. Final Verdict Framework

### To declare Galaxy Raiders HARCORE-LEGITIMATE:

```
✅ All FAIRNESS standards at minimum acceptable or higher
✅ All READABILITY standards at minimum acceptable or higher
✅ Zero BLOCKING ISSUES (Section 3)
✅ ≥ 3 testers report "one more run" mentality
✅ Score Play testers engage with ≥ 2 scoring dimensions
✅ All 5 bosses pass memorability standard (described by mechanic)
✅ ≥ 8/20 levels pass identity standard (named by tester)
```

### To declare Galaxy Raiders ARCADE-QUALITY:

```
All of the above, PLUS:
✅ ≥ 5 standards at ideal target level
✅ Score Play average multiplier > ×1.5
✅ 80%+ retry rate within 10s of death
✅ ≥ 5 sessions per tester on average
✅ All 5 set pieces recalled by testers
```

### To declare Galaxy Raiders PRODUCTION-READY:

```
All of the above, PLUS:
✅ All standards verified by telemetry-supported evidence (HC-PT-06)
✅ Zero MEDIUM+ issues open
✅ Full playtest report per HC-PT-05 Section 6 for each test type
✅ Final calibration pass complete
✅ Freeze integrity verified (HC-INT re-audit clean)
```
