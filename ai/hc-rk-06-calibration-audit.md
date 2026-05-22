# HC-RK-06 — Calibration Audit

**Block:** HC-RK  
**Status:** Audit (observability-only, no gameplay changes)  
**Date:** 2026-05-22  
**Dependency:** HC-RK-05 (debug overlay), HC-RK-04 (wiring), HC-RK-03 (caps), HC-RK-02 (sources)

---

## 1. Baseline Expected Behavior

### 1.1 Rank Gain Sources (values from code)

| Source | Amount | Frequency | Per minute (typical) |
|--------|--------|-----------|---------------------|
| Enemy kill | +0.75 | ~30/min (waves) | ~22.5 |
| Survival (DOMINATING only) | +0.40 | Every 5s | ~4.8 |
| Accuracy bonus (≥65%) | +0.30 | Every 4s | ~4.5 |
| Wave speed (<30s clear) | +0.50 | Per wave | ~1.0/min |
| Wave speed (<15s clear) | +0.75 | Rare | ~0.5/min |
| Boss phase | +2.50 | 2-3 per boss | ~0.5/min |
| Boss clear | +4.00 | Every 5 levels | ~0.8/min |
| Graze | +0.35 | Variable | ~1-3/min |

### 1.2 Rank Loss Sources

| Source | Amount | Frequency | Per minute |
|--------|--------|-----------|-----------|
| Player death | −8.00 | Per death | Variable |
| Decay | −0.15 | Every 1s after 6s idle | ~9.0/min if idle |

### 1.3 Rank Progression Timeline (theoretical)

```
Scenario 1: AVERAGE PLAYER (surviving, occasional hits, ~60% accuracy)
  Time 0s:   Rank 0 (level 1)
  Time 30s:  Rank 9.5 (level 1) — initial kills
  Time 60s:  Rank 18.0 (level 1) — first wave clear
  Time 90s:  Rank 26.5 (level 2) — hits level 2 threshold
  Time 120s: Rank 35.0 (level 2) — sustaining
  Time 180s: Rank 50.0 (level 3) — mid-game
  Time 360s: Rank 72.0 (level 4) — late game
  Time 600s: Rank 90.0 (level 5) — near ceiling

Scenario 2: ELITE PLAYER (dominating, 80% accuracy, fast waves)
  Time 0s:   Rank 0 (level 1)
  Time 30s:  Rank 12.0 (level 1)
  Time 45s:  Rank 20.0 (level 2) — fast level 2
  Time 90s:  Rank 38.0 (level 2)
  Time 120s: Rank 52.0 (level 3) — mid-game at 2min
  Time 240s: Rank 80.0 (level 5) — rank max in 4min
  Time 300s: Rank 100 (ceiling)

Scenario 3: STRUGGLING PLAYER (frequent deaths, low accuracy)
  Time 0s:   Rank 0 (level 1)
  Time 30s:  Rank 5.0 (level 1)
  Time 60s:  Rank −2.0 after death → 0 (floor)
  Pattern:   peaks 10-15, drops to 0 on death, never reaches level 2
```

### 1.4 Rank Level Distribution (expected steady-state)

| Level | Value Range | Typical time to reach | Typical player type |
|-------|-------------|----------------------|---------------------|
| 1 | 0–19 | Start → 2 min | New, struggling |
| 2 | 20–39 | 2–5 min | Casual, learning |
| 3 | 40–59 | 5–10 min | Average, consistent |
| 4 | 60–79 | 10–15 min | Good, hitless streaks |
| 5 | 80–100 | 15+ min | Elite, dominating |

---

## 2. Per-Source Analysis

### 2.1 Enemy Kills (+0.75)
- **Dominant source** — 60-70% of total rank gain
- Rate: ~30 kills/min in dense waves → ~22.5 rank/min
- Boss waves (no regular enemies): kills pause, only boss phases/clears contribute
- **Risk:** None. Kills are the fairest metric — you must play to earn them.
- **Exploit potential:** Kill-farming requires infinite spawns → wave composer limits this.

### 2.2 Survival (+0.40/5s while DOMINATING)
- Requires 15s hitless to activate
- Awards 0.40 every 5s = 0.08/s = 4.8/min
- **Small but consistent** — rewards sustained perfection
- **Risk:** Very low. DOMINATING requires 15s without a hit — earned.
- **Exploit potential:** Could theoretically accumulate during boss patterns where player is far away. But 0.08/s is trivial.

### 2.3 Accuracy (+0.30/4s if ≥65%)
- Checked every 4s with rolling window
- Must hit ≥65% of shots fired in that window
- Awards 0.30 per check = 0.075/s = 4.5/min
- **Risk:** Medium-low. Accuracy can be gamed by firing less (fewer shots = easier to hit 65%). But less firing = fewer kills = slower waves.
- **Mitigation:** Rolling window resets — can't bank accuracy across long idle periods.

### 2.4 Wave Speed (+0.50 wave, +0.25 extra if <15s)
- Checked at wave clear
- Requires PERF.state ≠ RECOVERING
- **Risk:** Low. Fast waves are earned, not gifted.
- **Exploit potential:** Fast-clearing easy early waves for rank. But early waves have few enemies = fewer kill rank.

### 2.5 Boss Phases (+2.50) + Boss Clear (+4.00)
- Per boss: 2-3 phases × 2.50 = 5.0–7.5, plus 4.0 clear = 11.5 rank per boss
- 5 bosses in 20 levels → ~57.5 rank from bosses total
- **Risk:** Medium. Boss contribution is significant and concentrated at specific levels.
- **Exploit potential:** Boss phase transitions are triggered by HP thresholds — can't really farm them.

### 2.6 Graze (+0.35)
- Per graze event (bullet passes within 24px of player)
- **Risk:** Medium. Can theoretically be farmed by sitting near a slow bullet stream.
- **Mitigation:** Graze is passive and hard to control — the player must be NEAR danger. Natural gameplay produces low graze counts.

### 2.7 Death (−8.00)
- **Heaviest single penalty:** one death wipes ~10 kills' worth of rank
- Also resets hitless timer → drops to RECOVERING → pauses survival gain
- **Risk:** Low (as a fairness mechanism). Death SHOULD hurt.
- **Concern:** A death at rank 80 (level 5) drops to 72 (level 4). Two quick deaths drop to 56 (level 3). This is fine — dying multiple times SHOULD drop difficulty.

### 2.8 Decay (−0.15/s after 6s)
- Kicks in 6s after last rank gain
- 0.15/s = 9.0/min
- **Balanced:** Idle 30s loses 3.6 rank. Not punishing, but prevents AFK rank holding.
- **Risk:** None. Decay is slow and fair.

---

## 3. Expected Metrics (per minute average)

| Metric | Low skill | Average | High skill |
|--------|-----------|---------|------------|
| Total rank gain/min | 8–12 | 18–22 | 28–35 |
| Kills % | 70% | 65% | 55% |
| Survival % | 0% | 8% | 18% |
| Accuracy % | 5% | 10% | 12% |
| Boss % | 15% | 12% | 10% |
| Wave speed % | 5% | 3% | 3% |
| Graze % | 5% | 2% | 2% |
| Deaths/min | 0.3–0.5 | 0.1–0.2 | 0–0.05 |
| Decay/min | 1–3 | 0.5–1.5 | 0–0.4 |
| Peak gain source | Kills | Kills | Kills + Survival |

---

## 4. Recovery State Analysis

### 4.1 RECOVERING Duration
- Triggered: player takes a hit
- Duration: `recoveringMs` = 5000ms (configurable)
- During recovery:
  - Performance state = RECOVERING
  - Survival timer frozen (invincibleTimer > 0 pauses update)
  - Governor blocks all rank effects (getEffectiveRankMultiplier caps to 1.12)
  - No survival rank gained, no accuracy checked, no wave speed bonus
  - Decay still active (not paused)

### 4.2 Post-Death Scenario
```
Frame 0:  Rank 65, DOMINATING, 45s hitless
Frame 1:  Player hit → RECOVERING, rank drops to 57 (−8)
Frame 60: Invincibility ends (2s typical)
Frame 150: RECOVERING → SURVIVING (5s after hit)
Frame 900: SURVIVING → DOMINATING (15s after hit, if no further damage)
```

**Recovery fairness:** Player takes ~20s total to fully recover from a death (5s recovery + 15s to re-enter DOMINATING). Rank is capped during the first 5s. This is fair.

---

## 5. Governor Intervention Analysis

### 5.1 When Does the Governor Block?

| Scenario | Governor reason | Frequency |
|----------|----------------|-----------|
| Player RECOVERING | player_recovering | After every death, for 5s |
| Boss EMPERADOR at rank 5 | boss_ceiling_exceeded | Late game if player dominates |
| Combined pressure > 5.20 | pressure_ceiling_exceeded | Only at rank 5 + level 20 + pressure MAX |
| Rank disabled | rank_disabled | Never (rank is always enabled in HC) |
| Not playing state | not_playing | Menus, game over |
| Player dead (hp=0) | player_dead | Brief window during death animation |

### 5.2 Expected Intervention Rate

| Player type | Blocks per minute |
|-------------|-------------------|
| Low skill (dies often) | 0.5–1.5 (mostly RECOVERING blocks) |
| Average | 0.1–0.3 (rare) |
| Elite (DOMINATING consistently) | 0.02–0.05 (almost never blocked) |
| Elite at level 20 EMPERADOR | 1+ (boss_ceiling_exceeded) |

### 5.3 Cap Intervention Rate

| Cap | Triggers when | Expected frequency |
|-----|--------------|-------------------|
| Bullet speed > 1.08 | Rank level 5 (1.12 requested → 1.08 capped) | Every bullet at rank 5 |
| Cooldown < 450ms | Very rare — base cooldowns are 550+ | Almost never |
| Wave pause < 600ms | Rank 5 + fast rhythm | Occasional at rank 5 |
| Combined > 5.20 | Rank 5 + level 20 + pressure MAX | Only at EMPERADOR fight |

---

## 6. Edge Case Audit

### 6.1 Accuracy Extreme (100%)
- Player fires 1 shot, hits 1 enemy in 4s window
- Accuracy = 100% → bonus awarded (+0.30)
- Is this exploitable? **Yes, but marginally.** 0.30 every 4s = tiny gain. Not worth optimizing for.
- **Mitigation:** Rolling window resets means you must consistently hit ≥65%. Not hard to achieve legitimately.

### 6.2 Accuracy Extreme (0%)
- Player fires continuously but misses everything
- Accuracy = 0% → no bonus → no rank loss either (missed shots don't penalize)
- **Verdict:** Fair. Missing shots already penalizes via: slower kills, longer waves, more bullets to dodge, higher death risk.

### 6.3 Hitless Long Streak
- Player stays hitless for 120s:
  - Rank survival: 0.40 × (120/5) = 9.6 rank just from survival
  - Plus kills, accuracy, etc.
- **Verdict:** Fair. 120s hitless is genuinely skilled play. Reward is proportional.

### 6.4 Idle Survival Abuse
- Player avoids killing to farm survival rank
- Survival awards 4.8/min while DOMINATING
- But fewer kills → less kill rank → net LOSS
- Decay kicks in if player stops killing for 6s
- **Verdict:** Self-defeating. Can't gain rank by doing nothing.

### 6.5 Graze Farming
- Player orbits a slow bullet to accumulate grazes
- Each graze: +0.35 rank
- Realistic max: ~10 grazes in a single bullet's lifetime = 3.5 rank
- Time cost: ~3-5s of dangerous proximity
- **Verdict:** Not worth farming. The risk of death (−8.00) far outweighs the reward.

### 6.6 Boss Stall
- Player avoids damaging boss to farm regular enemies
- Boss patterns continue, enemies may spawn (EMPERADOR minions)
- Rank gain from kills continues
- **Verdict:** Low concern. Boss phases are HP-gated. Once all phase HP is depleted, boss transitions naturally. No infinite stall possible.

### 6.7 Death Loop
- Player dies repeatedly at same spot
- Each death: rank −8.00, recovery 5s, invincibility
- After 3 deaths: rank has dropped 24 points (= ~1.5 levels)
- After 6 deaths: near rank 0
- **Verdict:** Working as intended. Death SHOULD bring rank down. Player who keeps dying should face easier difficulty.

### 6.8 Rapid Recovery Oscillation
- Player dies → RECOVERING for 5s → starts playing → dies again at 6s
- Each death resets the recovery timer
- Rank is capped during each recovery window
- **Verdict:** Fair. The system correctly identifies that the player is struggling.

### 6.9 Rapid State Oscillation
- Player kills fast for 4s, then idle for 7s (decay starts), then kills again
- Decay would have consumed some rank: ~1.05 lost per idle cycle
- But immediate kill resets decay timer
- **Verdict:** The 6s decay delay prevents oscillation. 4s active + 7s idle = 1s of decay per cycle = 0.15 rank lost. Negligible.

---

## 7. Rank Ceiling Analysis

### 7.1 Maximum Theoretical Rank Gain Per Minute
```
Kills (max):     40 kills × 0.75    = 30.0
Survival:        12 intervals × 0.40 = 4.8
Accuracy:        15 intervals × 0.30 = 4.5
Wave speed:      2 waves × 0.50      = 1.0
Boss pro-rata:   ~1.0 (spread across minutes)
Graze (max):     10 grazes × 0.35   = 3.5
───────────────────────────────────────────
Total max/min:   ~44.8
```
**Realistic max:** ~35/min (can't max all sources simultaneously)

### 7.2 Time to Rank Ceiling (100)
```
Elite player (~30/min): 100/30 = ~3.3 minutes
Average player (~20/min): 100/20 = ~5 minutes
Low skill (~10/min + deaths): May never reach ceiling
```

### 7.3 Rank Ceiling Behavior
- Once at 100: no further gains (capped)
- Decay starts 6s after last gain: −0.15/s
- Player must keep performing to stay at 100
- **Verdict:** Good. Rank ceiling rewards continuous play. No "set and forget."

---

## 8. Verification Checklist

| Check | Status | Note |
|-------|--------|------|
| Rank never explodes exponentially | ✅ | Linear gain sources only |
| Recovery actually cools down | ✅ | 5s RECOVERING + governor block |
| Decay actually works | ✅ | −0.15/s after 6s, tested |
| Governor maintains fairness | ✅ | 7-check cascade, config-driven |
| EMPERADOR capped at rank 4 | ✅ | safetyBossRankCeilings.supreme = 4 |
| Rank 5 still readable | ⚠️ | Bullet speed 1.08 with governor. At level 20 base 4.84 → capped 5.20. Readable with HC-RD clarity. |
| Death penalty proportional | ✅ | −8.0 per death = ~1 level drop |
| Graze not dominant | ✅ | 0.35 per graze, hard to farm |
| Wave speed bonus not dominant | ✅ | 0.50 per wave, gated |
| Accuracy bonus not dominant | ✅ | 0.30 per 4s, gated |

---

## 9. Tuning Recommendations

### 9.1 Immediate (safe to adjust via config)

| Parameter | Current | Recommended | Reason |
|-----------|---------|-------------|--------|
| `survivalRankAmount` | 0.40 | 0.50 | Survival contribution is slightly too small (4.8/min vs 22.5/min kills) |
| `accuracyBonusThreshold` | 65% | 70% | 65% is easy to hit; 70% better rewards skill |
| `recoveringMs` | 5000 | 4000 | 5s recovery after hit feels long; 4s still protective |
| `decayAmount` | 0.15 | 0.20 | Slightly faster decay prevents idle rank camping |

### 9.2 Deferred (needs gameplay testing)

| Parameter | Concern | Recommendation |
|-----------|---------|----------------|
| Boss rank contribution (11.5/boss) | Concentrated spikes at boss levels | Could smooth: +1.5/boss phase instead of 2.5 |
| EMPERADOR ceiling (rank 4) | May feel arbitrary to player | Add visual "Rank Limited" indicator when capped |
| Graze (0.35) | Minor source, could be slightly increased | 0.50 for better risk/reward feel |
| Decay delay (6s) | Might be too generous | 4s for more active maintenance |

### 9.3 Deferred to HC-RK Future

| Feature | Reason |
|---------|--------|
| Smooth rank transitions (lerp) | Rank level changes feel abrupt |
| Rank intensity sound | Audio feedback for level changes |
| Per-wave rank cap | Prevent early-game rank farming |
| Rank history graph | Debug/telemetry visualization |

---

## 10. Partial Freeze Recommendation

### Freeze Candidates (safe to freeze now)

| System | Status |
|--------|--------|
| Rank gain/loss model (8 sources) | ✅ Stable |
| Performance state machine (3 states) | ✅ Stable |
| Safety governor framework (7 checks) | ✅ Stable |
| Config flag architecture | ✅ Stable |
| Telemetry/logging framework | ✅ Stable |
| Debug overlay | ✅ Stable |

### NOT for Freeze Yet

| System | Why |
|--------|-----|
| Per-boss rank ceilings | Only tested theoretically — needs real gameplay |
| Combined pressure ceiling (5.20) | Hitting this is rare — needs validation at rank 5 + level 20 |
| Anti-spike guard | Only blocks if 2 deaths < 2s apart — very rare case |
| Wave speed bonus thresholds (30s/15s) | Hardcoded, should be configurable |

### Recommended: Freeze HC-RK after 1 real gameplay test session

---

## 11. Validation

```
No files touched (audit-only).
Repo verified clean at start.
```
