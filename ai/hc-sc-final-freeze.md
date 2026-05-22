# HC-SC-11 — Final Audit & Freeze Candidate

**Block:** HC-SC (complete)  
**Status:** **FROZEN**  
**Date:** 2026-05-22  
**Freeze Commit:** pending  
**Covered Sprints:** HC-SC-01 through HC-SC-11  

---

## A. Architecture Map (Final)

```
┌─────────────────────────────────────────────────────┐
│              CONFIG LAYER                            │
│  game-config.js → hardcore-config.js (getters)      │
│  scoreSystem: { enabled, multiplier, aggression,    │
│    medals, bossScoring, survivalScoring,             │
│    rankScoreSynergy, telemetry, sourceColors, debug }│
└──────────┬──────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────┐
│            SCORE PIPELINE (scores.js)                │
│  awardScore({ points, source })                     │
│    → addScore(points)        ← legacy mutator       │
│    → HC_SCORE_SOURCES[id]    ← 16-source taxonomy   │
│    → telemetry track         ← per-source breakdown │
│    → multiplier apply        ← ×1.0-3.0 mastery     │
│    → popup display           ← source-colored       │
│  ---                                                │
│  Multiplier: gain/decay/penalties                   │
│  Graze: enhanced detection + anti-exploit           │
│  Aggression: distance tiers + danger window         │
│  Medals: partial decay + recovery grace             │
│  Boss: phase efficiency + no-hit + anti-milk        │
│  Survival: recovery + chains + anti-camping         │
│  Rank Synergy: gain boost at high rank              │
│  Telemetry: source breakdown, multiplier, peaks     │
└──────────┬──────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────┐
│          GAMEPLAY HOOKS (wired files)                │
│  update-enemies.js → kill/boss/hit scoring           │
│  update-boss.js    → phase efficiency tracking       │
│  update.js         → wave clear, decay update        │
│  progression.js    → wave bonus, hit tracking         │
│  entities.js       → boss start tracking              │
│  medals.js         → enhanced chain + anti-exploit    │
│  hardcore-config.js→ graze detection + scoring        │
│  draw.js           → HUD dispatching (debug overlays) │
└──────────────────────────────────────────────────────┘
```

---

## B. Economy Summary (Final)

### Source Contribution (calibrated targets)

| Source | Casual | Average | Good | Elite |
|--------|--------|---------|------|-------|
| enemyKill | 55-65% | 45-55% | 38-48% | 30-40% |
| bossKill | 8-12% | 12-16% | 18-25% | 25-35% |
| medals | 3-6% | 8-12% | 14-20% | 20-30% |
| graze | <2% | 3-5% | 6-10% | 10-14% |
| aggression (close-range) | 4-7% | 8-12% | 14-20% | 20-28% |
| waveBonus | 6-10% | 4-7% | 3-5% | 2-4% |
| survival/recovery | <3% | 5-8% | 8-12% | 12-18% |
| misc (bulletHit, UFO, pierce) | <2% | <2% | <2% | <2% |

### Multiplier Economy

| Player type | Avg mult | Peak mult | Uptime % |
|------------|---------|-----------|----------|
| Casual | ×1.0-1.2 | ×1.5 | 40-50% |
| Average | ×1.3-1.6 | ×2.0 | 65-75% |
| Good | ×1.6-2.0 | ×2.5 | 75-85% |
| Elite | ×2.2-2.8 | ×3.0 | 85-95% |

**Inflation:** ×1.0 (casual) to ×3.0 (elite maximum). Average run ~×1.5-1.8 of vanilla score.

---

## C. Systems Summary (11 sprints)

| Sprint | System | Key metric |
|--------|--------|-----------|
| SC-01 | Full audit | 14 sources, 10 multipliers |
| SC-02 | Pipeline + taxonomy | 16 sources, awardScore wrapper |
| SC-03 | Migration | 14/14 addScore → awardScore |
| SC-04 | Multiplier | ×1.0-3.0, decay 0.048/s, death −30% |
| SC-05 | Graze | 12 base, 4/bullet cap, cooldown 20f |
| SC-06 | Aggression | near ×1.75, mid ×1.30, danger window |
| SC-07 | Medals | partial decay, recovery grace, cap 12/wave |
| SC-08 | Boss mastery | efficiency tiers, no-hit, anti-milk 30s |
| SC-09 | Survival | recovery scoring, chains, anti-camping |
| SC-10 | Rank synergy | gain boost ×1.00-1.15, calibration overlay |
| SC-11 | Final freeze | This document |

---

## D. Anti-Exploit Audit (Final)

| # | System | Exploit | Protection | Verified |
|---|--------|---------|-----------|----------|
| 1 | Boss scoring | Milk/stall | 30s soft cap → ×0.50 score | ✅ |
| 2 | Medals | Drop farming | 12 drops/wave cap | ✅ |
| 3 | Graze | Same-bullet farm | 4/bullet, 20f cooldown, repeat penalty | ✅ |
| 4 | Multiplier | AFK hold | Decay 0.048/s after 3s idle | ✅ |
| 5 | Multiplier | Idle survival | Death penalty −30%, no gain events = decay | ✅ |
| 6 | Survival | Camping | 10s idle blocks chain bonuses | ✅ |
| 7 | Close-range | Enemy hugging | Tight threshold 60px, danger from bullets only | ✅ |
| 8 | Rank | Death loop | −8/death, recovery block, decay | ✅ |
| 9 | Danger window | Stationary abuse | Bullet proximity only (not enemy proximity) | ✅ |
| 10 | FEVER | Medal value abuse | ×2 value but drop rate capped | ✅ |

**10 anti-exploit systems. All verified. No game-breaking exploits detected.**

---

## E. Readability Audit (Final)

| Element | Placement | Alpha | HC-RD safe |
|---------|-----------|-------|-----------|
| Score HUD | Top-left, cyan | 0.78 | ✅ PRIORITY_FEEDBACK |
| Multiplier HUD | Bottom-left, gold | 0.55-0.70 | ✅ No bullet overlap |
| Medal popups | Kill position, gold | 0.7-0.9 | ✅ Small font, short TTL |
| Graze popups | Bullet position, cyan | 0.6-0.8 | ✅ Subtle spark |
| Boss popups | Boss position | 0.7 | ✅ No phase interruption |
| Debug overlays | Right side panels | 0.65 bg | ✅ Flag-gated |
| Calibration overlay | Right side | 0.65 bg | ✅ Flag-gated |

**HC-RD compliance:** All score elements render in PRIORITY_FEEDBACK layer or lower. No bullet masking. No telegraph obstruction. All overlays flag-gated.

---

## F. Freeze Perimeter

### FILES INSIDE FREEZE

| File | Lines | Role | Stability |
|------|-------|------|-----------|
| `www/scores.js` | ~1000+ | Pipeline, multiplier, boss, survival, telemetry | ⚡ DO NOT TOUCH |
| `www/medals.js` | 419 | Chain system, anti-exploit, FEVER | ⚡ DO NOT TOUCH |
| `www/progression.js` | ~370 | addScore, kill calc, wave bonus, hooks | 🔒 Freeze |
| `www/hardcore-config.js` | ~790 | Graze detection, config defaults | 🔒 Freeze |
| `www/game-config.js` | ~700 | scoreSystem config | 🔒 Add flags only |
| `www/update.js` | ~170 | Frame hooks, wave transitions | 🔒 Freeze |
| `www/update-enemies.js` | ~1250 | Kill/boss/hit scoring hooks | 🔒 Freeze |
| `www/update-boss.js` | ~1700 | Phase efficiency hook | 🔒 Freeze |
| `www/entities.js` | ~1300 | Boss start hook | 🔒 Freeze |
| `www/draw.js` | ~6250 | Debug overlay dispatch | 🔒 Add dispatches only |
| `ai/hc-sc-*.md` | — | 11 documentation files | 📄 Reference only |

### Parameters NEVER-TOUCH

| Parameter | Value | Why |
|-----------|-------|-----|
| `scoreSystem.multiplier.max` | 3.0 | Cap at ×3.0 prevents inflation |
| `scoreSystem.multiplier.decay.ratePerFrame` | 0.0008 | Decay rate — changing breaks idle protection |
| `scoreSystem.aggression.graze.maxPerBullet` | 4 | Per-bullet graze limit — changing enables farming |
| `scoreSystem.aggression.bossScoring.antiMilk.softCapMs` | 30000 | Anti-milk — changing enables stall |
| `scoreSystem.aggression.medals.antiExploit.maxDropsPerWave` | 12 | Drop cap — changing enables farming |
| `scoreSystem.aggression.survivalScoring.antiCamping.idleFrames` | 600 | Anti-camping — changing enables AFK |
| `scoreSystem.aggression.rankScoreSynergy.multiplierGainBoost.rank5` | 1.15 | Max synergy — raising creates runaway |

### Parameters SAFE-TUNING

| Parameter | Range | Effect |
|-----------|-------|--------|
| `multiplier.gain.enemyKill` | 0.010-0.030 | Kill contribution rate |
| `multiplier.gain.closeRange` | 0.010-0.040 | Aggression contribution rate |
| `multiplier.gain.graze` | 0.005-0.020 | Graze contribution rate |
| `aggression.closeRange.bonus.near` | 1.50-2.50 | Aggression multiplier |
| `aggression.closeRange.near` | 40-80 | Near distance threshold (px) |
| `bossScoring.noHit.phaseBonus` | 1000-5000 | No-hit phase reward |
| `bossScoring.noHit.fullBossBonus` | 5000-20000 | Full boss no-hit reward |
| `survivalScoring.noHit.waveBonus` | 500-2000 | No-hit wave reward |
| `survivalScoring.recovery.scoreBonus` | 500-3000 | Recovery reward |
| `survivalScoring.survivalChain.levels` | [20-40, 40-80, 80-160] | Chain milestones (seconds) |
| `rankScoreSynergy.multiplierGainBoost.rank3` | 1.04-1.12 | Mid-rank boost |

---

## G. Remaining Known Issues

| Issue | Severity | Mitigation |
|-------|----------|------------|
| Multiplier HUD shows below ×1.01 (hidden below that) | NONE | Design choice — clean HUD |
| FEVER medal rain on boss death counts toward wave cap | LOW | Caps prevents excess; boss is end of wave anyway |
| Survival chain resets on hit (intentional) | NONE | Design choice |
| No per-source popup for boss efficiency bonuses | MINOR | Score is tracked correctly; popup would be nice-to-have |

**Zero critical issues. Zero medium issues. 4 minor/none issues.**

---

## H. Deferred Systems (future)

| System | Sprint | Reason deferred |
|--------|--------|----------------|
| Danger economy (sustained bullet proximity bonus) | HC-SC-20+ | Adds complexity, current danger window is sufficient |
| No-hit run scoring (full-game) | HC-SC-25+ | Requires run-level tracking, not per-wave |
| Boss chaining bonuses (multi-boss sequence) | HC-SC-30+ | Single boss per level currently |
| Medals → rank feedback loop | HC-SC-35+ | Complex circular dependency, needs careful design |
| Score → difficulty (reverse rank) | N/A | Explicitly NOT desired — score inflation loop |
| Global leaderboard season stats | N/A | Firebase exists, UI not needed |

---

## I. Integration Status

| System | Status | HC-SC Interaction |
|--------|--------|------------------|
| HC-RK | ✅ FROZEN | Rank synergy boost (×1.15 at rank 5), multiplier gain from rank events |
| HC-BD | ✅ FROZEN | Boss efficiency (passive observation), no-hit phase tracking |
| HC-WC | ✅ Compatible | Wave clear bonuses, no-hit wave detection |
| HC-PD | ✅ Compatible | Kill scoring for patterned enemies |
| HC-RD | ✅ Compatible | All popups in PRIORITY_FEEDBACK, alpha-capped |
| HC-HB | ✅ Compatible | No hitbox interaction |

---

## J. Rollback

Single-line rollback disables all HC-SC gameplay effects:
```js
// game-config.js:
scoreSystem: { enabled: false }
```

Score still accumulates via addScore(). No pipeline, no multiplier, no telemetry. Identical to vanilla score system.

---

## K. Final Verdict

### ✅ HC-SC — FROZEN

**The Hardcore Score Economy is complete, calibrated, and frozen.**

**Criteria met:**

| Criterion | Evidence |
|-----------|----------|
| Pipeline universal | 16-source taxonomy, 14 call sites migrated |
| Multiplier stable | ×1.0-3.0, decay, penalties, verified no runaway |
| Graze economy | 12 base, 4/bullet cap, cooldown, repeat penalty |
| Aggression economy | 2 tiers (near×1.75, mid×1.30), danger window |
| Medal routing | Partial decay, recovery grace, 12/wave cap |
| Boss mastery | Phase efficiency, no-hit bonuses, anti-milk |
| Survival mastery | Recovery scoring, chains, no-hit waves |
| Rank synergy | Gain boost ×1.15 at rank 5, conservative |
| Anti-exploit | 10 systems, all verified |
| Telemetry | 5 independent telemetry layers |
| Readability | HC-RD compliant, all overlays flag-gated |
| Rollback | Single flag (`scoreSystem.enabled: false`) |
| Frozen systems preserved | HC-RK, HC-BD, HC-WC, HC-PD, HC-RD, HC-HB all intact |

**This block joins HC-BD and HC-RK in the frozen subsystem library of Galaxy Raiders.**
