# HC-SC-01 — Full Score Economy Audit

**Block:** HC-SC  
**Status:** Audit (read-only, no code changes)  
**Date:** 2026-05-22  
**Protected Systems:** HC-RD, HC-HB, HC-PD, HC-WC, HC-BD, HC-RK (all frozen)

---

## 1. Score Architecture Map

### Global State
```
scores.js:60  → let score = 0       (live score)
scores.js:66  → let bestScore = 0   (session best)
scores.js:67  → highScores[10]      (localStorage, descending)
scores.js:68  → highNames[10]       (rider for highScores)
scores.js:69  → highContinues[10]   (continues per high score)
scores.js:112 → isHighScore(score)  → boolean (top 10 or slot empty)
scores.js:121 → addHighScore(score, name) → localStorage + global submit
```

### Persistence
```
localStorage key: 'galaxyRaidersScores'
  → { scores: [], names: [], continues: [] }
Firebase: db.collection('scores').add({ name, score, date })
  → loadGlobalScores() → globalScores[], globalTopScore, globalTopName
```

### Score Mutators (all `addScore(points)` calls)

| # | Location | Points | Event | Notes |
|---|----------|--------|-------|-------|
| 1 | `update-enemies.js:109` | 200 | UFO killed | One-time bonus |
| 2 | `update-enemies.js:131` | 2 / 5 | Player bullet hit | 5 normal, 2 laser |
| 3 | `update-enemies.js:144` | 800 × rank × combo | Boss hit (HP to ≤0) | Rank+combo multiplied |
| 4 | `update-enemies.js:170` | 25 | Mine destroyed | Fixed |
| 5 | `update-enemies.js:218` | `calculateEnemyKillScore()` × rank × combo | Enemy killed | Variable, see below |
| 6 | `update-enemies.js:290` | 5000 × rank × combo | Boss death | Rank+combo multiplied |
| 7 | `update-enemies.js:375` | 10 | Enemy bullet canceled by laser | Piercing shot bonus |
| 8 | `update-enemies.js:399` | `rw.amount` (≥500) | UFO reward drop | Scaled by ufoScoreMult |
| 9 | `update.js:141` | 1000 | Level transition | Fixed per level |
| 10 | `progression.js:309` | 500 + level×200 | Wave completion bonus | Scaled by wave number |
| 11 | `progression.js:320` | level×500 | Milestone (every 5 waves) | Bonus when already max lives |
| 12 | `medals.js:93` | `getCurrentMedalValue()` (100-5000) | Perfect wave bonus | medalChain × value |
| 13 | `medals.js:233` | `getCurrentMedalValue()` (×2 in FEVER) | Medal pickup | Chain multiplier system |
| 14 | `hardcore-config.js:637` | 5 × rank × combo | Graze | Small, multiplied |

### Score Multipliers

| Multiplier | Source | Range | Applied to |
|-----------|--------|-------|-----------|
| Rank score | `hardcore-rank.js:491` | 1.00–1.50 | Boss clear, enemy kills |
| Combo (HC) | `hardcore-combo.js:111` | 1.00–2.00 | Enemy kills, boss, graze |
| Balance profile | `balance.js` scoreRiskMult | 1.00–1.18 | Enemy kill base score |
| Medal chain | `medals.js:88` | 100→5000 | Medal pickup value |
| Medal fever | `medals.js:232` | ×2 | Medal pickup during fever |
| Dive bonus | `progression.js:187` | +38% | Diving enemy kills |
| Set piece bonus | `progression.js:190` | +14% | Set piece enemy kills |
| Close-range bonus | `progression.js:196-199` | +16%/+12% | <150px / <95px |
| Lategame bonus | `progression.js:202-204` | +8%/+11%/+5% | Level ≥14/≥18/20 |
| Laser bullet penalty | `update-enemies.js:131` | 2 vs 5 | Score per laser hit |

### Score Base Values (enemy types)

| Enemy | Base points |
|-------|------------|
| alien1 | 30 |
| alien2 | 20 |
| alien3 | 50 |
| alien4 | 40 |
| alien5 | 60 |
| alien6 | 80 |
| alien_mini | 15 |

### Enemy Kill Score Formula

```
killScore = round(
  basePoints × (1.0
    + diveBonus(0.38)
    + setPieceBonus(0.14)
    + closeBonus150(0.16)
    + closeBonus95(0.12)
    + lateBonus14(0.08)
    + lateBonus18(0.11)
    + lateBonus20(0.05)
  ) × balanceProfile × rankMultiplier × comboMultiplier
)
```

Maximum theoretical multiplier on kill score:
```
1.0 + 0.38 + 0.14 + 0.16 + 0.12 + 0.08 + 0.11 + 0.05 = 2.04
× balanceTournament(1.18) × rank(1.50) × combo(2.00) = 7.22×
```
But this requires: diving enemy, in set piece, at close range, level 20+, tournament profile, rank 5, 40+ combo. Extremely rare.

---

## 2. Extra Life System

### Thresholds
```
config.js:12 → EXTRA_LIFE_SCORES = [10000, 30000, 60000, 100000]
```

### Trigger
```
progression.js:15-23 → addScore() checks score crossing thresholds
                     → awardExtraLife() → lives++ (max MAX_LIVES=5)
```

### Extra Life Sources
| Source | Location |
|--------|----------|
| Score thresholds | `addScore()` — automatic |
| Wave milestone (every 5) | `progression.js:314-318` — if lives < MAX_LIVES |
| Continue | `flow.js:27-30` — continue gives lives reset |

### Grade System
```
S: 0 continues + score ≥ 80000
A: 0 continues
B: 1-2 continues
C: 3+ continues
```

---

## 3. Score Readability (Feedback)

### Visual Feedback

| Element | Present | Quality |
|---------|---------|---------|
| HUD score display | ✅ Top-left | Clear, cyan |
| Score popup on enemy kill | ✅ `spawnPopup()` with +value | Color-coded by chain tier |
| Combo chain counter | ✅ HUD left side | Bars + pulse animation |
| Perfect wave popup | ✅ Center screen, gold | Dramatic, clear |
| Medal fever popup | ✅ Center screen, pink | Very clear |
| Graze popup | ✅ Near player, cyan | Small but visible |
| Boss clear score | ❌ No specific popup | Only death explosion |
| Wave bonus score | ❌ No per-wave popup | Only transition screen |
| Rank-based score boost | ❌ Invisible to player | Only in debug overlay |
| Close-range kill bonus | ❌ Invisible | No feedback at all |
| Dive kill bonus | ❌ Invisible | No feedback at all |
| Combo multiplier | ✅ HUD bar | Shows multiplier value |
| FEVER visual | ✅ Screen pulse | Chapter-colored glow |

### Score Clutter Assessment

| Issue | Severity |
|-------|----------|
| Multiple popups can stack at enemy death position | Low |
| Medal collection popups during dense waves | Low — chain number is clear |
| Popup text size is 5-7px (small) | Intentional — HC-RD keeps it subtle |
| No numeric popup for graze score | Minor — graze score is small (5 × multipliers) |
| Boss kill score not shown before transition | Minor — player sees total at game over |

---

## 4. Exploits / Vulnerabilities

### Confirmed Exploits

| # | Exploit | Method | Severity | Mitigation |
|---|---------|--------|----------|------------|
| 1 | Medal chain farming | Letting medals drop offscreen resets chain partially (−5) — deliberately harmful exploit? | **NONE** — chain loss is a penalty, not an exploit path |
| 2 | UFO kill farming | UFOs spawn periodically and are worth 200 | Low | UFO spawn rate is low, not farmable |
| 3 | Set piece enemy farming | Set pieces have finite enemies per wave | None | Set pieces end |
| 4 | Boss milk (EMPERADOR minions) | Minions give kills + medals + score | **Medium** | Minion spawn cooldown limits rate |
| 5 | Graze score farming | 5 × rank × combo per graze. At rank 5 + 40 combo: 5×1.5×2.0 = 15 per graze | Low | Must be near bullets, death risk |
| 6 | Piercing shot chain | Laser bullets cancel enemy shots (+10 each) | Low | Requires laser + enemy shooter |
| 7 | Medal pickup during FEVER | 5000×2 = 10000 per medal at max chain | Medium | Requires chain to stay at max without dropping |

### Potential (not present)

| Exploit | Status |
|---------|--------|
| Infinite spawn | ❌ Not possible — wave composer limits enemies |
| AFK scoring | ❌ Not possible — decay + no idle sources |
| Boss infinite loop | ❌ HP-gated phases |
| Wave loop | ❌ Level progression is linear |
| Safe graze zones | ⚠️ Some boss patterns have safe spots — graze score is trivial |

---

## 5. What Is NOT Rewarded

### Missing Score Sources

| Action | Currently rewarded? | Value if added |
|--------|-------------------|----------------|
| Hitless wave clear | ❌ | Perfect wave bonus exists but only if medals collected |
| Boss kill speed | ❌ | Could reward fast kills |
| No-hit boss phase | ❌ | Clean phase reward |
| Surviving long time | ❌ | Rank already rewards this |
| Aggressive play (close range sustained) | ⚠️ Partially | Close-range bonus caps at +28% for <95px |
| Killing without taking damage | ❌ | Only medals require no-damage |
| Combo sustain >50 | ❌ | Combo caps at 40 for multiplier |
| Boss efficiency (few shots to kill) | ❌ | No shots-fired penalty/reward |
| Recovery bonus (rebuilding after hit) | ❌ | Only rank recovery exists |
| Danger play (staying near bullets) | ⚠️ Partially | Graze rewards proximity |

---

## 6. Existing Hardcore Hooks

### Usable for HC-SC

| Hook | System | Data available |
|------|--------|---------------|
| `calculateEnemyKillScore()` | Scoring | Base points, multipliers, proximity, dive state |
| `addHardcoreRank(amount, reason)` | HC-RK | All rank events with reason tag |
| `addHardcoreCombo(reason)` | HC-RK | All combo events |
| `recordHardcoreRankShotFired(count)` | HC-RK | Accuracy tracking |
| `recordHardcoreRankShotHit(count)` | HC-RK | Accuracy tracking |
| `recordHardcoreRankHit(now)` | HC-RK | Hit events |
| `recordHardcoreRankWaveStart/Clear()` | HC-RK | Wave timing |
| `getHardcoreRankPerformanceState()` | HC-RK | DOMINATING/SURVIVING/RECOVERING |
| `getHardcorePressureState()` | HC-RK | Wave pressure level |
| `getBossDirectorState()` | HC-BD | Boss phase, transition, recovery |
| Boss director profiles | HC-BD | Boss archetype, phase plan, signature |
| Wave composer state | HC-WC | Wave phase (INTRO/BUILD/PEAK etc.) |
| Encounter director pressure | HC-WC | Bullet density, pressure smoothing |
| HC-PD enemy roles | HC-PD | Diver, sniper, suppressor, chaser |
| `getHardcoreRankTelemetrySnapshot()` | HC-RK | Full state dump |

### Reusable Metrics

| Metric | Source | HC-SC use |
|--------|--------|-----------|
| Rank level (1-5) | HC-RK | Score multiplier (already used) |
| Performance state | HC-RK | DOMINATING bonus, RECOVERING penalty |
| Accuracy % | HC-RK | Accuracy bonus (ready, not used) |
| Hitless duration | HC-RK | No-hit streak reward |
| Wave clear speed | HC-RK | Fast clear bonus (ready, not used) |
| Combo count/multiplier | HC-RK | Already used for score |
| Boss phase count | HC-BD | Efficiency scoring potential |
| Medal chain | Medals | Already used |

---

## 7. Score Economy Assessment

### Does Score Reward Mastery?

| Mastery aspect | Scored? | How well |
|----------------|---------|----------|
| Kill consistency | ✅ | Per-kill score with multipliers |
| Not dying | ✅ | Score thresholds → extra lives, grade |
| Playing aggressively | ⚠️ | Close-range bonus +28% — minimal |
| Accuracy | ❌ | Not scored |
| Boss mastery | ⚠️ | Only kill score (5000), no phase/speed bonus |
| Wave mastery | ⚠️ | Perfect wave bonus via medals only |
| Risk management | ❌ | No danger bonus / proximity scoring |
| Combo mastery | ✅ | Chain system with FEVER — well done |
| Graze mastery | ⚠️ | Tiny score (5 base), mostly cosmetic |
| Speed | ❌ | No time bonus |
| Efficiency (fewer shots) | ❌ | No accuracy or ammo bonus |

### Risk/Reward Analysis

```
HIGH RISK actions:
  - Playing close to enemies:   +28% score  →  Worth it? Barely
  - Grazing bullets:            +15 score   →  Worth it? No
  - Diving enemies:             +38% score  →  Auto if diving enemy exists
  - No-hit boss phase:          +0 score    →  Not rewarded at all

LOW RISK actions:
  - Safe-distance killing:      100% score  →  Free, no penalty
  - Waiting out boss patterns:  100% score  →  No time pressure
  - Medal collection at distance: 100% score →  Magnet range is generous (60px)
```

**Finding:** The score economy favors SAFE play. The highest-scoring strategy is: kill from distance, collect all medals, don't die, maintain combo. Aggressive play is minimally rewarded.

---

## 8. Score Depth Analysis

| Depth factor | Current state | Grade |
|-------------|--------------|-------|
| Routing (which enemies to kill first) | Enemy formations are fixed | C |
| Optimization (max score per wave) | Medal chain + close-range stacking | B |
| Risk/reward decisions | Low — safe play dominates | D |
| Skill ceiling | Medal chain sustain + combo management | B |
| Variety (different genres of scoring) | Kill + medal + combo — 3 dimensions | B |
| Learnability | Intuitive — kill = points, medals = points | A |
| Mastery depth | Requires combo sustain + medal chain + rank management | B+ |

---

## 9. Protected Systems (must preserve)

| System | HC-SC Constraint |
|--------|-----------------|
| HC-RD readability | Score popups must not clutter bullet visibility |
| HC-HB hitbox | No score-based hitbox changes |
| HC-PD patterns | No score-based pattern selection |
| HC-WC waves | No score-based wave composition |
| HC-BD bosses | No score-based boss behavior |
| HC-RK rank | Rank → score is one-way (already exists), score → rank must NOT exist (would create feedback loop) |

---

## 10. Critical Integration Rules

### DO NOT
- ❌ Make score affect rank (circular dependency → runaway positive feedback)
- ❌ Make score affect difficulty (reward inflation loop)
- ❌ Add score popups that overlap bullet layer (HC-RD violation)
- ❌ Add score multipliers that stack multiplicatively with rank + combo (inflation)

### DO
- ✅ Add new score sources for unrewarded mastery
- ✅ Enhance existing feedback (popups for dive kill, close-range kill)
- ✅ Add boss efficiency scoring (fast kill, low damage taken)
- ✅ Add risk/reward scoring (danger proximity, graze chain)
- ✅ Keep all new score sources flag-gated

---

## 11. Recommended HC-SC Sprint Plan

### HC-SC-02: Score Feedback Enhancement
- Add popups for dive kills, close-range kills
- Add boss-related score popups (phase clear, fast kill)
- Enhance medal chain visibility

### HC-SC-03: Mastery Scoring
- No-hit wave bonus (independent of medals)
- Boss efficiency score (time to kill, damage taken)
- Accuracy score bonus
- Danger proximity score multiplier

### HC-SC-04: Risk/Reward Balance
- Increase close-range multiplier (28% → 50-75%)
- Add sustained-danger bonus (time spent near bullets)
- Add graze chain scoring system
- Add aggression meter that multiplies kill score

### HC-SC-05: Integration & Tuning
- Wire new scores into HUD and feedback
- Tune all multipliers against inflation check
- Ensure score curve stays satisfying across all 20 levels

### HC-SC-06: Calibration Audit
- Real gameplay score curve analysis
- Inflation check across all systems
- Per-wave expected score ranges

### HC-SC-07: Freeze
- Final documentation, freeze perimeter, risk table

---

## 12. Summary

| Area | Finding |
|------|---------|
| **Architecture** | Clean. `addScore()` is the single mutator. `score` is a flat global. Persistence via localStorage + Firebase. |
| **Sources** | 14 identified. Kill score dominates (60-70%). Boss, medals, graze are secondary. |
| **Multipliers** | 10 distinct multipliers. 7 in kill formula, 3 external (rank, combo, balance). |
| **Readability** | HUD is clear. Popups exist but some rewards are invisible (close-range, dive, boss efficiency). |
| **Exploits** | 2 medium (boss milk, FEVER medal chain). 4 low/no severity. No game-breaking exploits. |
| **Missing rewards** | 8 actions unrewarded. Aggression, accuracy, boss mastery, speed, efficiency all un-scored. |
| **Risk/reward** | Weak. Safe play dominates. Aggressive play < 30% bonus. Graze is cosmetic. |
| **Depth** | B-grade. Combo + medal chain = 2 good systems. Missing risk layers. |
| **Integration** | 16 reusable hooks from HC-RK, HC-BD, HC-WC, HC-PD. Telemetry-ready. |
