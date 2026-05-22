# HC-CAL-02 — Score Play Audit

**Phase:** HC-CAL  
**Status:** Active (baseline established)  
**Date:** 2026-05-22  
**Dependency:** HC-CAL-01A (casual survival), HC-PT (complete)  

---

## A. Overall Score Feel

### Score Engagement Assessment

| Player type | Score engagement | Score awareness | Score motivation |
|------------|-----------------|-----------------|-----------------|
| **Casual survival** | None — scores passively | Doesn't check HUD | None — plays to survive |
| **Casual-intermediate** | Low — notices popups, may check score at end | Glances at score HUD | Low — "nice score" but not driving |
| **Intermediate score-curious** | Medium — engages with medals, may try graze | Checks multiplier occasionally | Medium — wants higher score, doesn't optimize |
| **Score-oriented** | High — actively routes for medals, aggression | Monitors multiplier continuously | High — driven by score improvement |
| **Elite optimizer** | Very high — min-maxes routes, greed, aggression | All HUD elements tracked | Very high — score obsession |

### Score Diversion Assessment

How much does scoring DISTRACT from survival?

| Scoring activity | Distraction level | When |
|-----------------|------------------|------|
| Medal chasing | Medium | During dense waves, medals tempt risky routes |
| Close-range kills | High | Aggression requires point-blank positioning |
| Grazing | Medium-High | Must hover near bullets intentionally |
| Multiplier monitoring | Low | HUD glance, quick |
| Chain maintenance | Medium | Losing a medal offscreen = chain drop |
| FEVER activation | Low | Automatic at chain 20, positive feedback only |

### Score Fun Factor

| System | Fun factor | Why |
|--------|-----------|-----|
| Multiplier (×1.0→3.0) | ✅ HIGH | Visible, satisfying, golden text at ×2.5+ |
| Medal chain | ✅ HIGH | Chain number climbing, tier color changes, FEVER |
| Graze | ⚠️ LOW-MEDIUM | Base 12 score, small popup. Not exciting enough. |
| Close-range kills | ✅ MEDIUM-HIGH | ×1.75 bonus is felt, danger window adds depth |
| Boss efficiency | ⚠️ MEDIUM | Phase tiers (ELITE/GOOD/SLOW) are invisible to player |
| No-hit bonuses | ⚠️ LOW | No visual celebration for no-hit phase |
| Survival chains | ⚠️ LOW | 30/60/120s milestones are invisible |

### Score Verdict: 7.5/10 — Solid foundation, some invisible rewards.

---

## B. Risk/Reward Analysis

### Greed Temptation Strength

| Decision point | Temptation | Risk | Reward | Temptation/Risk ratio |
|---------------|-----------|------|--------|----------------------|
| Medal near bullet stream | Medium | Death (−8 rank, −30% multiplier) | +100-5000 score, +chain | Low — risk >> reward for single medal |
| Close-range kill (×1.75) | Medium | Death + bullet proximity | +75% score, +0.020 multiplier | Medium — worth it at low HP enemies |
| Graze proximity | Low | Death if graze becomes hit | +12-36 score, +0.010 multiplier | Low — score trivial vs risk |
| Medal chain sustain | High | Death if routing fails | Chain tier × multiplier | Medium-High — chain value compounds |
| Aggression during boss | High | Boss death = reset | Boss kill × efficiency | Medium — boss score is significant |
| Danger window kill (×1.10) | Low | Sustained bullet proximity | +10% score | Low — barely noticeable bonus |

### Key Problem: Graze is undertuned for score play.

Base 12 × rank × combo — maximum: 12×1.5×2.0 = 36 per graze. At rank 5 with ×3.0 multiplier: 108. Still trivial compared to kill score (base 20-80 × bonuses).

**Recommendation:** Graze needs score increase to be a meaningful greed mechanic. Current state: cosmetic for score players too.

### Punishment Severity

| Event | Score impact | Multiplier impact | Chain impact |
|-------|-------------|-------------------|-------------|
| Death | None (score preserved) | −30% | Medal chain continues |
| Multiplier decay | None | −0.048/s after 3s idle | None |
| Medal miss | None | −0.010 | −2 tiers (partial) |
| Boss milk (stall > 30s) | Boss kill ×0.50 | None | None |

**Assessment:** Punishments are well-calibrated. Death doesn't reset score. Multiplier partial loss keeps hope alive. Medal miss is survivable. No "run's dead" moment.

---

## C. Aggression & Medal Economy

### Aggression Scoring Depth

| Tier | Condition | Bonus | Feels |
|------|-----------|-------|-------|
| Near (≤60px) | Point-blank kill | ×1.75 + 0.020 multiplier | Good — noticeable score jump |
| Mid (≤120px) | Close kill | ×1.30 | Subtle — player may not notice |
| Danger window | Kill within 90f of bullet proximity | ×1.10 | Invisible — bonus is tiny |

**Problem:** Danger window is too subtle. +10% compounded with ×1.75 = ×1.925 total — good. But the danger window contribution specifically (+10%) is invisible to the player.

### Medal Satisfaction

| Chain tier | Value (FEVER ×2) | Satisfaction |
|-----------|-----------------|-------------|
| 1 (chain 5) | 250 (500) | "Okay, building" |
| 2 (chain 10) | 500 (1000) | "Getting good" |
| 3 (chain 15) | 1000 (2000) | "Nice!" |
| 4 (chain 20) | 2000 (4000) + FEVER | "YES!" — strong positive moment |
| 5 (chain 25) | 5000 (10000) | "Dominating!" |

Medal chain is the most satisfying scoring system for score players. The FEVER activation at chain 20 is a genuine dopamine hit. Visual feedback is excellent: chapter-colored medals, chain popup, multiplier glow.

### Graze Usefulness (Score Player Perspective)

| Aspect | Current state | Desired state |
|--------|-------------|---------------|
| Score per graze | 12 base → ~108 max | Should be 2-3× higher to feel meaningful |
| Multiplier contribution | +0.010 per graze | Adequate — graze sustains multiplier |
| Anti-exploit | 4/bullet, 20f cooldown | ✅ Solid |
| Visibility | Small cyan popup | ✅ Clear, but understated |

### Score Momentum

Score player should feel acceleration — score gain rate increases as they improve. Current momentum:

| Phase | Momentum feel |
|-------|--------------|
| Early game | ⚠️ Slow — rank 1, ×1.0 multiplier, basic enemies |
| Mid game | ✅ Building — rank 2-3, multiplier ×1.3-1.8, set pieces |
| Late game | ✅ Strong — rank 4-5, multiplier ×1.8-2.8, bosses, survival |
| Boss fights | ✅ Peak — efficiency bonuses, no-hit potential, ×5000 base |

**Early game acceleration:** Score acceleration starts too slow. New score players may not feel the system "working" until level 5+.

---

## D. Score Recovery Satisfaction

### After a Death

| System | Immediate state | Rebuild time | Feels |
|--------|----------------|-------------|-------|
| Score | Preserved | N/A | ✅ "At least my score is intact" |
| Multiplier | −30% (e.g. ×2.0 → ×1.4) | ~10-15 kills (~30s) | ✅ "I can rebuild this" |
| Rank | −8.0, RECOVERING 4s | ~60s to same level | ✅ "Rank will come back" |
| Medal chain | Unchanged | N/A | ✅ Chain preserved through death |

**Assessment:** Recovery is well-designed. Score player doesn't lose everything. Comeback feels possible.

### After a Chain Drop (Medal Miss)

| Effect | Severity | Rebuild |
|--------|----------|---------|
| Chain −2 tiers | Medium (e.g., tier 4 → tier 2) | ~10 medals to rebuild |
| Multiplier −0.010 | Tiny | Negligible |
| Recovery grace (90 frames) | Safety net | 1.5s to grab another medal and save chain |

**Assessment:** Chain drop stings but doesn't break. Recovery grace window is excellent design — player gets a fighting chance.

### Frustration After Drops

| Drop type | Frustration level | Why |
|-----------|-----------------|-----|
| Medal miss (offscreen) | MEDIUM | "I should have moved faster" — self-blame, fair |
| Multiplier decay (idle too long) | LOW | Slow (0.048/s), player can re-engage |
| Death during greed attempt | MEDIUM | "I got greedy, I died" — fair, self-inflicted |
| Boss milk score penalty | LOW | Rare, only if stall > 30s |

---

## E. Readability During Greed

### Visual Overload During Score Play

| Overload source | When | Severity |
|----------------|------|----------|
| Medal popups | Every medal pickup | LOW — small (5px), alpha-capped, short TTL |
| Chain popups | Chain ≥ 2 | LOW — "CHAIN x18", small, blue |
| FEVER activation | Chain ≥ 20 | LOW — brief pink flash, then stable |
| Graze spark + popup | Per graze | LOW — 5 particles, cyan, subtle |
| Multiplier popup (synergy) | Not implemented yet | N/A |
| Debug overlays | Flag-gated only | None during normal play |

**Assessment:** HC-RD keeps score popups in PRIORITY_FEEDBACK layer. No bullet masking. Good.

### Tunnel Vision Risk

| Activity | Tunnel vision risk |
|----------|-------------------|
| Chasing a distant medal | MEDIUM — eyes follow medal, not bullets |
| Monitoring chain number | LOW — HUD glance, peripheral |
| Monitoring multiplier | LOW — HUD glance, peripheral |
| FEVER excitement | LOW — brief, then normal |
| Grazing intentionally | HIGH — eyes on bullet proximity, not other threats |

**Risk:** Intentional grazing during dense waves creates tunnel vision. Player fixates on nearby bullets and misses distant threats. This is acceptable — grazing IS a risk mechanic. The danger is part of the design.

---

## F. Score Flow & Cadence

### Score-Dead Sections

| Level | Why score-dead | Duration |
|-------|---------------|----------|
| 1-2 | Few enemies, no medals, no multiplier | ~30s total |
| 6 | Post-boss collapse, fewer enemies | ~20s |
| 11 | Post-boss collapse, fewer enemies | ~20s |

**Problem:** Early game and post-boss sections feel "score-dead" — nothing to optimize, no greed tension. Score player may disengage from scoring mindset during these sections.

### Score Pacing Across Levels

| Level range | Score engagement |
|------------|-----------------|
| 1-2 | Low — no systems active |
| 3-4 | Medium — set piece enemies, medals begin |
| 5 | High — first boss, ×800 + ×5000 score |
| 6 | Low — post-boss lull |
| 7-9 | Medium — FORTRESS, tanks, Dark Sector |
| 10 | High — SERPENTRIX |
| 11 | Low — post-boss lull |
| 12 | High — KAMIKAZE RUSH, aggression opportunities |
| 13-14 | Medium-High — Patrol Disrupted, War Zone |
| 15 | High — ORBITAL |
| 16-18 | Very High — SPLITTER, SURVIVAL, IMPERIAL, density = score |
| 19-20 | Maximum — final bosses, highest HP, highest bonuses |

### Climax Reward Payoff

| Boss | Kill score (base) | Efficiency bonus | No-hit bonus | Total ceiling |
|------|-----------------|-----------------|-------------|---------------|
| CRABTRON | 5000 | N/A (too short) | +10000 | 15000 |
| SERPENTRIX | 5000 | ×1.0-2.0 | +10000 | 20000 |
| ORBITAL | 5000 | ×1.0-2.0 | +10000 | 20000 |
| TENIENTE | 5000 | ×1.0-2.0 | +10000 | 20000 |
| EMPERADOR | 5000 | ×1.0-2.0 (anti-milk may halve) | +10000 (if no-hit) | 20000 |

**Assessment:** Boss score payoff is good. The anti-milk penalty (×0.50 after 30s) prevents stall farming but should be communicated to the player.

---

## G. Score Fatigue & Burnout

### Score Player Stress

| Stress source | Severity |
|---------------|----------|
| Multiplier maintenance anxiety | LOW-MEDIUM — decay is slow (0.048/s) |
| Chain drop fear | MEDIUM — missing a medal costs tiers |
| Optimal routing pressure | MEDIUM-HIGH — elite optimizer feels pressure to route perfectly |
| Death cost (multiplier −30%) | MEDIUM — meaningful but not crushing |
| Graze uselessness frustration | LOW — graze is optional, not required for high score |

### Optimization Fatigue

| Activity | Fatigue level |
|----------|--------------|
| Medal routing optimization | MEDIUM — requires memorizing drop patterns |
| Close-range kill optimization | MEDIUM — requires aggressive positioning |
| Graze optimization | LOW — rarely worth optimizing |
| Boss efficiency optimization | HIGH — requires fast phase clears, no-hit execution |
| Combo sustain | LOW — combo is automatic with kills |

**Risk:** Boss efficiency optimization may create fatigue. Attempting ELITE tiers requires fast clears with no hits — demanding and stressful.

---

## H. Mastery Motivation

### Score Depth Perception

| Depth factor | Score player perception |
|-------------|----------------------|
| Multiplier economy | "I get it — kill fast, don't die" — clear, satisfying |
| Medal chains | "Collect medals, climb tiers, get FEVER" — clear, deep |
| Aggression tiers | "Get close for ×1.75" — clear, high-risk |
| Graze economy | "Graze for tiny bonus" — underwhelming |
| Boss efficiency | "Kill fast for ELITE tier" — invisible to player |
| No-hit bonuses | "Don't get hit during boss" — clear reward but no celebration |
| Survival chains | "Survive without hits for milestones" — invisible |
| Danger window | "Kill after bullet proximity" — invisible |

**Problem:** 3 of 8 scoring systems are invisible or under-communicated. Boss efficiency, survival chains, and danger window need visual feedback.

### Route Depth

| Route dimension | Depth |
|----------------|-------|
| Medal collection routing | HIGH — positions vary, chain incentives |
| Aggression vs safety | MEDIUM-HIGH — near kills reward but risk death |
| Graze routing | LOW — score too small to plan around |
| Boss phase optimization | MEDIUM — phase timing determines efficiency tier |
| Wave clear speed | LOW — no time bonus for fast wave clear |

### "One More Credit" Score Urge

| Trigger | Strength |
|---------|----------|
| "I was so close to FEVER" (chain 18→20) | ✅ HIGH |
| "My multiplier was ×2.4, if I didn't die..." | ✅ HIGH |
| "Next time I'll get ELITE on that boss" | ⚠️ MEDIUM (invisible) |
| "My score was 185K, I want 200K" | ✅ HIGH |
| "I missed ONE medal and lost chain" | ⚠️ MEDIUM (frustration, not motivation) |

### Mastery Verdict: 7.5/10 — Strong foundation, some invisible rewards hurt motivation.

---

## I. Score Friction Taxonomy

| # | Type | Location | Severity | Frequency | Impact |
|---|------|----------|----------|-----------|--------|
| 1 | **SCORE-DEAD** | Levels 1-2, 6, 11 | MEDIUM | Every session start + post-boss | Score player disengages from scoring mindset |
| 2 | **GREED-FRUSTRATION** | Graze score | LOW | Every session | Graze feels unrewarding for risk |
| 3 | **ROUTE-RIGIDITY** | Medal routing | LOW | Potential future issue | Currently multiple viable routes |
| 4 | **OVER-PUNISH** | None | NONE | N/A | Punishments are well-calibrated |
| 5 | **RECOVERY-COLLAPSE** | Boss death at high multiplier | LOW | Rare | Recovery exists, works |
| 6 | **SCORE-NOISE** | Multi-popup density | LOW | During FEVER + kill + graze | 3 popup types simultaneously |
| 7 | **GREED-OVERLOAD** | Aggression + medal + graze simultaneously | LOW | Elite score play | Too many systems to optimize at once |
| 8 | **MASTERY-FLAT** | Invisible rewards (efficiency, danger, survival) | MEDIUM | Every session | Player doesn't know they exist |
| 9 | **ROUTE-DRAINING** | Boss efficiency optimization | LOW | Elite score play only | Demanding phase optimization |
| 10 | **SCORE-CONFLICT** | Early game vs late game scoring | LOW | Per session | Early game feels "score-dead" |

---

## J. Tuning Candidates (DO NOT IMPLEMENT YET)

| Category | Candidate | Priority |
|----------|-----------|----------|
| **Greed** | Increase graze base score 12→25 | HIGH |
| **Greed** | Add danger window visual indicator | HIGH |
| **Readability** | Add boss efficiency tier popup | HIGH |
| **Readability** | Add survival chain milestone celebration | MEDIUM |
| **Readability** | Add no-hit phase visual celebration | MEDIUM |
| **Reward** | Add score feedback to early game (levels 1-2) | MEDIUM |
| **Pacing** | Add scoring opportunities to post-boss levels (6, 11) | MEDIUM |
| **Greed** | Slightly increase close-range bonus (×1.75 → ×2.0 at near tier) | LOW |

---

## K. Summary

### Overall Score Play Score: 7.5/10

| Domain | Score |
|--------|-------|
| Overall score feel | 7.5 |
| Risk/reward balance | 7.0 |
| Aggression & medal economy | 8.0 |
| Score recovery | 8.0 |
| Readability during greed | 8.0 |
| Score flow & cadence | 6.5 |
| Fatigue & burnout | 7.5 |
| Mastery motivation | 7.5 |

### Top 3 Issues

1. **Graze is undertuned** — Score too low to incentivize risk-taking for score players.
2. **Invisible rewards** — Boss efficiency, danger window, survival chains have no visual feedback.
3. **Score-dead sections** — Early game and post-boss levels lack scoring engagement.

### Top 3 Strengths

1. **Medal chain system** — The most satisfying scoring mechanic. FEVER is a genuine high point.
2. **Multiplier recovery** — Death penalty is meaningful but not crushing. Comeback possible.
3. **Aggression tiers** — Close-range scoring creates genuine risk/reward decisions.
