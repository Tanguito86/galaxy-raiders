# HC-CAL-03 — Recovery & Fatigue Calibration

**Phase:** HC-CAL  
**Status:** Active (baseline established)  
**Date:** 2026-05-22  
**Dependency:** HC-CAL-02 (score play), HC-CAL-01A (casual survival), HC-PT (complete)  

---

## A. Overall Recovery Feel

### Comeback Psychology Assessment

| Event | Immediate emotional state | After 5s | After 30s | After 60s |
|-------|--------------------------|----------|-----------|-----------|
| Single hit (rank 3, wave 8) | "Damn!" — startle | "I'm invincible, reposition" | "Back to normal" | "Forgotten" |
| Death (rank 4, boss fight) | "No!" — frustration | "Recovery mode, play safe" | "Rebuilding multiplier" | "Back in the fight" |
| Death ×2 (rank 3→1, late game) | "This is rough" | "I can still finish" | "Rank's coming back" | "Managing" |
| Chain drop (tier 4→2) | "I lost it!" | "Grace window — grab that medal!" | "Chain is rebuilding" | "Lesson learned" |
| Multiplier full decay (×2.5→×1.0, idle 30s) | Not applicable — decay is slow | N/A | "Multiplier dropping" | "Need to re-engage" |

### Recovery Quality by Game Phase

| Phase | Recovery quality | Notes |
|-------|-----------------|-------|
| Early (1-4) | ✅ Excellent | Hits are rare, rank is low, recovery is fast |
| First boss (5) | ✅ Good | Post-boss level 6 provides intentional recovery |
| Mid (6-10) | ✅ Good | Sawtooth pacing, relief sections functional |
| Late-mid (11-15) | ⚠️ Good for survival, MEDIUM for score | Score pressure adds recovery burden |
| Late (16-20) | ❌ Poor | Four consecutive high-intensity levels overwhelm recovery systems |
| Final stretch (19→20) | ❌ Critical | No recovery between final bosses |

### Recovery Verdict: 6.5/10 — Systems are well-designed. Late-game pacing undermines them.

---

## B. Fatigue Curve Analysis

### Fatigue Escalation Map (per 5-level block)

```
Level  1-5:  0.1 → 0.3  — Minimal fatigue. Learning phase.
Level  6-10: 0.3 → 0.5  — Moderate fatigue. Alternation helps.
Level 11-15: 0.5 → 0.7  — Noticeable fatigue. Relief starts feeling shorter.
Level 16-20: 0.7 → 1.0  — Critical fatigue. No alternation. Exhaustion.
```

### Pressure Duration Analysis

| Section | Continuous pressure | Relief after | Problem |
|---------|-------------------|-------------|---------|
| Regular wave | ~20-25s | 12s relief | ✅ Good |
| Crossfire | ~18-20s | 12s relief | ✅ Good |
| Set piece | ~25-35s | 12-15s relief | ✅ Good |
| Survival corridor (level 17) | ~35s | 12s relief | ⚠️ 35s continuous max — long |
| Boss fight | 60-180s | Post-boss level or game end | ⚠️ Boss fights are self-contained but mentally intense |
| Level 16-18 sequence | ~8 min | ⚠️ Only 900ms between levels | ❌ Inadequate |
| Level 19-20 sequence | ~3-5 min | 900ms between | ❌ Critical |

### Exhaustion Spikes

| Spike location | Cause | Recovery after | Severity |
|---------------|-------|---------------|----------|
| Level 17 SURVIVAL CORRIDOR | 35s max density, rank 3-4 | 12s relief at 0.25 intensity | HIGH |
| Level 19 TENIENTE | Boss fight, 285 HP, charge/retreat patterns | Level 20 boss immediately | CRITICAL |
| Level 20 EMPERADOR | Final boss, 450 HP, teleport, minions | Game ends | N/A (finale) |
| Repeated retry loop (same boss) | 3+ deaths on same boss | Between retries: level restart | HIGH for mental stamina |

### Fatigue Type Breakdown

| Type | Primary cause | Accumulation speed | Recovery speed |
|------|--------------|-------------------|---------------|
| **Visual fatigue** | Sustained bullet density, no palette change | MEDIUM (levels 14+) | FAST (relief section) |
| **Cognitive fatigue** | Complex pattern reading, multitasking | MEDIUM-FAST (levels 12+) | MEDIUM (relief section) |
| **Emotional fatigue** | Constant tension, no positive states | SLOW (levels 16+) | SLOW (needs boss kill or session end) |
| **Decision fatigue** | Greed decisions, route optimization | FAST (score play, levels 10+) | MEDIUM (relief + medal collection) |
| **Motivational fatigue** | Repeated deaths same section, no progress | VARIABLE | VERY SLOW (needs success) |

### Fatigue Verdict: 6.0/10 — Early/mid game is sustainable. Late game burns out.

---

## C. Recovery Window Audit

### Relief Section Quality

| Level | Relief section | Duration | Content | Quality |
|-------|---------------|----------|---------|---------|
| 1 | Post-warmup relief | 12s | 2-3 enemies | ✅ Good |
| 3 | Post-PINCER relief | 15s | 1-2 enemies | ✅ Good |
| 4 | Mid-stage relief | 12s | 2-3 enemies | ✅ Good |
| 7 | Post-FORTRESS relief | 15s | 2-3 enemies | ✅ Good |
| 9 | Dark Sector relief | 12s | Few enemies | ⚠️ Feels flat |
| 12 | Post-KAMIKAZE relief | 15s | 2-3 enemies | ✅ Good |
| 14 | Multiple relief sections | 10-12s each | Varies | ✅ Good |
| 17 | Post-SURVIVAL relief | 12s | 2 enemies | ⚠️ Too short after 35s survival |
| 18 | Post-IMPERIAL relief | 12s | 2 enemies | ❌ Not enough before TENIENTE |

### Fake Recovery Windows

| Location | What happens | Why it's fake |
|----------|-------------|---------------|
| Level 18→19 transition | 900ms pause, then TENIENTE boss fight | Pause too short. No mental reset. |
| Level 19→20 transition | 900ms pause, then EMPERADOR boss fight | Pause too short. Back-to-back exhaustion. |
| Dense wave → brief density drop → dense wave | Density drops 2s then resumes | Not enough time to decompress. |

### Recovery Readability

| Recovery element | Visible to player? | Clarity |
|-----------------|-------------------|---------|
| RECOVERING state after hit | ❌ No visual indicator | Invisible |
| Governor blocking rank effects during recovery | ❌ No indicator | Invisible |
| Recovery bonus (+1500 score) | ⚠️ Small popup (misc source) | Barely visible |
| Relief section start | ⚠️ Implicit (density drops) | Player feels it but doesn't see "RELIEF" |
| Post-boss celebration | ✅ Explosion + medal rain | Clear, satisfying |

**Problem:** Recovery systems work but are invisible. Player doesn't know they're being protected.

### Recovery Window Verdict: 5.5/10 — Relief sections exist but some are too short. Late-game transitions are inadequate. Recovery is invisible.

---

## D. Panic Recovery Evaluation

### Panic Onset → Recovery Timeline

```
Normal play
  │
  ├─ Threat density increases (level 14+)
  │
  ├─ Panic threshold (~20+ bullets on screen for casual)
  │    ├─ Good: player maintains parsing → CLUTCH SURVIVAL → relief → recovery
  │    └─ Bad: player stops parsing → PANIC-NO-READ → random movement → death
  │
  ├─ Death
  │    ├─ Good: "I know why I died" → retry within 5s → adaptation
  │    └─ Bad: "What happened?" → long pause → RECOVERY-BAD → quit
  │
  └─ Recovery
       ├─ Successful: 4s RECOVERING → rank/governor unblock → multiplier rebuild
       └─ Failed: another death within 20s → SPIRAL → session end
```

### Spiral Prevention (current)

| Prevention | Effectiveness |
|------------|--------------|
| RECOVERING state (4s invincibility + governor block) | ✅ Good — prevents difficulty compounding |
| Rank −8.0 per death (rank drops, difficulty drops) | ✅ Good — organic cool-down |
| Multiplier −30% (not full reset) | ✅ Good — score hope preserved |
| Level restart on continue | ⚠️ Acceptable — fresh start but loses progress |

### Panic Exit Possibility

| Panic source | Can player escape? | How |
|-------------|-------------------|-----|
| Level 17 survival density | ⚠️ Hard | No safe zones in survival corridor. Must endure or die. |
| Boss pattern overlap | ✅ Yes | Movement to safe zone, pattern memorization |
| Diver ambush | ✅ Yes | Brief (8-15s), then relief follows |
| Set piece density | ⚠️ Medium | Scripted, must survive set piece duration |
| Back-to-back bosses | ❌ No | No escape between 19 and 20 |

### Panic Recovery Verdict: 6.5/10 — Panic exit exists for most sections. Survival corridor and boss chain lack escape.

---

## E. Long Session Sustainability

### Session Endurance Model

| Session length | Casual player | Intermediate | Score-oriented | Elite |
|---------------|--------------|-------------|----------------|-------|
| 0-15 min (Lv 1-7) | ✅ Energized | ✅ Engaged | ⚠️ Slow (low score density) | ✅ Learning routes |
| 15-30 min (Lv 8-14) | ⚠️ Tiring | ✅ Managing | ✅ Engaging | ✅ Testing limits |
| 30-45 min (Lv 15-20) | ❌ Exhausted | ⚠️ Draining | ⚠️ Overwhelmed | ✅ Pushing through |
| 45+ min (multiple runs) | ❌ Quits | ❌ Fatigued | ❌ Burned out | ⚠️ Obsession or exhaustion |

### Retry Exhaustion

| Retry scenario | Exhaustion after | Why |
|---------------|-----------------|-----|
| Dying on wave 5 (early) | 5+ retries | Patterns are learnable, variety exists |
| Dying on wave 12 (mid) | 3-4 retries | KAMIKAZE RUSH is intense but brief |
| Dying on ORBITAL (boss 3) | 2-3 retries | 210 HP, ring patterns, demanding |
| Dying on TENIENTE (boss 4) | 1-2 retries | Late game, fatigue accumulated |
| Dying on EMPERADOR (final) | 1 retry | "Almost there" motivation vs exhaustion |
| Full run death at level 17+ | 1 retry | "I don't want to go through 17 again" |

### Late-Session Frustration

| Frustration source | Severity | Notes |
|-------------------|----------|-------|
| "I was so close" (boss near death) | MEDIUM | Frustrating but motivating |
| "I died the same way again" | HIGH | No learning = DRAINING |
| "This section again" (level 17) | HIGH | Repeated same density = fatigue |
| "My multiplier!" (high loss) | MEDIUM | Meaningful but rebuildable |

### Sustainability Verdict: 5.5/10 — 30 minute sweet spot for most players. Beyond that, fatigue dominates.

---

## F. Pressure Sustainability

### Stacking Systems Pressure

| Moment | Systems active | Combined cognitive load |
|--------|---------------|----------------------|
| Regular wave | Enemies + bullets | Normal |
| Wave + medal collection | Enemies + bullets + routing | Medium |
| Wave + aggression | Enemies + bullets + point-blank positioning | Medium-High |
| Boss fight | Boss patterns + phases | High |
| Boss + no-hit attempt | Boss + survival focus | High |
| Boss + scoring | Boss + efficiency + no-hit + multiplier | Very High |
| Survival corridor (Lv 17) + rank 4 | Max density + speed | Maximum |

### Pressure Monotony Detection

| Level range | Monotony risk | Why |
|------------|--------------|-----|
| 1-5 | LOW | Variety: warmup → set piece → boss |
| 6-10 | LOW | Post-boss variety: collapse → set piece → boss |
| 11-15 | LOW-MEDIUM | Alternation still works |
| 16-20 | HIGH | Same intensity, no variety in emotional arc |

**Problem:** Late game pressure doesn't escalate emotionally — it just sustains. Player stops feeling "this is more intense" and starts feeling "this is still intense, when does it end?"

### Emotional Flattening

Occurs when player stops reacting emotionally to game events. Signals:
- No reaction to FEVER activation (was exciting, now routine)
- No celebration on boss kill (was triumph, now relief)
- No frustration on death (was motivating, now indifferent)
- "Just get through this" mindset replaces "master this" mindset

**Risk zone:** Levels 16-20. Player has been playing 25+ minutes. All emotional peaks have been experienced (set pieces, 3 bosses). Remaining content feels like obligation, not opportunity.

### Pressure Sustainability Verdict: 5.0/10 — Late game emotional flattening is the biggest feel problem.

---

## G. Recovery Readability

### Visual Calm Periods

| Period | Visual density | Duration | Feels calm? |
|--------|---------------|----------|-------------|
| Level start (banner) | 0 enemies, field clear | 1.5s | ✅ Brief but effective |
| Between waves (level transition) | 0 enemies, warp effect | ~3-4s during warp | ✅ Star scroll is calming |
| Mid-level relief | 1-3 enemies, low bullets | 10-15s | ✅ Good decompression |
| Post-boss celebration | Explosion particles, medal rain | 5-8s | ✅ Triumphant, not calm |
| Post-death invincibility | Normal density continues | 2s invincibility | ⚠️ Visually still intense |

### Danger Clarity During Recovery

| Recovery period | Danger signals | Clarity |
|----------------|---------------|---------|
| RECOVERING state (4s) | Governor blocks rank effects | ❌ Invisible — player doesn't know |
| Relief section | Reduced enemies/bullets | ✅ Visible density drop |
| Post-boss level (6, 11) | Low enemy count | ✅ Visible |
| Level transition | Field clear | ✅ Very clear |

---

## H. Emotional Replay Health

### "Do I want to keep playing?"

| After | Answer | Why |
|-------|--------|-----|
| Early game death | "Yes" | Lessons learned, retry cheap |
| Mid game boss death | "Yes" | Pattern learned, close to victory |
| Late game wave death | "Maybe" | Section is draining |
| Late game boss death | "Maybe later" | Fatigue accumulated |
| Full run complete | "Yes!" (if first clear) / "Maybe" (if grinding) | Triumph or fatigue |
| 2+ full runs | "I need a break" | 45+ min of sustained intensity |

### Sections That Drain Most

| Section | Drain level | Why |
|---------|-----------|-----|
| Level 17 survival corridor | 9/10 | Sustained max density, no escape |
| Level 19 TENIENTE (after 16-18) | 8/10 | Fatigue accumulated, no breather |
| Level 20 EMPERADOR (after TENIENTE) | 8/10 | Final boss but player is tired |
| Repeated ORBITAL deaths | 7/10 | Ring patterns filter players |

### Sections That Restore Energy

| Section | Restoration | Why |
|---------|-----------|-----|
| Post-boss collapse (level 6) | 7/10 | Low intensity, intentional breather |
| Level 4→5 prelude | 6/10 | Anticipation builds excitement |
| Medal FEVER activation | 8/10 | Dopamine hit, score motivation |
| Boss kill (CRABTRON, SERPENTRIX) | 9/10 | Triumph, satisfaction, progress |

---

## I. Recovery/Fatigue Friction Taxonomy

| # | Type | Location | Severity | Frequency | Impact |
|---|------|----------|----------|-----------|--------|
| 1 | **DRAINING** | Levels 16-20 marathon | HIGH | Every late session | Player quits or needs extended break |
| 2 | **NO-RELIEF** | Level 19→20 transition | CRITICAL | Once per run | Back-to-back boss exhaustion |
| 3 | **FAKE-RECOVERY** | Level 18→19 900ms pause | HIGH | Once per run | Pause too short for mental reset |
| 4 | **PANIC-SPIRAL** | Level 17 + rank 3+ + multiple deaths | MEDIUM | Variable | Death → death → quit |
| 5 | **RECOVERY-COLLAPSE** | Elite score play late-game death | LOW | Rare | Multiplier recovery + boss pressure |
| 6 | **SESSION-BURNOUT** | 45+ minute sessions | MEDIUM | Long sessions | Fatigue accumulation → quit |
| 7 | **PRESSURE-SATURATION** | Levels 16-20 sustained intensity | HIGH | Every late session | Emotional flattening |
| 8 | **FATIGUE-SPIKE** | Level 17 survival corridor | HIGH | Every run | Sharp exhaustion, no escape |
| 9 | **EMOTIONAL-FLATLINE** | Levels 16-20 (no emotional variation) | HIGH | Every late session | Player stops reacting |
| 10 | **RETRY-EXHAUSTION** | Late-game boss death loops | MEDIUM | Variable | Player abandons session |

---

## J. Emotional Pressure Curve

```
Level  1-4:  ▂▂▃▄  BUILDUP       — Learning, curiosity, confidence
Level  5:    ████  CLIMAX         — First boss TRIUMPH
Level  6-9:  ▃▄▅▅  RECOVERY+RAMP — Post-boss breather, then build
Level 10:    ████  CLIMAX         — SERPENTRIX TRIUMPH
Level 11-14: ▃▄▅▆  RECOVERY+RAMP — Post-boss breather, then build
Level 15:    ████  CLIMAX         — ORBITAL (hardest so far)
Level 16-18: ████  SUSTAINED      — No relief, emotional flatline begins
Level 19:    ████  BOSS           — TENIENTE (player is tired)
Level 20:    ████  FINALE         — EMPERADOR (exhaustion or triumph)

PROBLEM: Levels 16-20 should be ▆▇█▇█ not ██████████.
         The curve should PEAK at 20, not PLATEAU from 16 onward.
```

---

## K. Recovery Calibration Candidates (DO NOT IMPLEMENT)

| # | Category | Candidate | Priority |
|---|----------|-----------|----------|
| 1 | Relief timing | Extend level 19→20 pause from 900ms to 3000ms | **CRITICAL** |
| 2 | Relief timing | Extend level 18→19 pause from 900ms to 2000ms | HIGH |
| 3 | Relief content | Add "RECOVERY" visual indicator during RECOVERING state | HIGH |
| 4 | Relief content | Add small enemy presence to post-boss levels (6, 11) | MEDIUM |
| 5 | Fatigue reduction | Reduce level 17 survival corridor from 35s to 25s | HIGH |
| 6 | Fatigue reduction | Insert relief section between levels 16 and 17 | MEDIUM |
| 7 | Cadence | Add micro-relief (2-3s density drops) in level 17 | MEDIUM |
| 8 | Recovery readability | Add "NO-HIT PHASE" / "ELITE" celebration popups | HIGH |
| 9 | Recovery readability | Add multiplier recovery indicator (showing rebuild progress) | LOW |
| 10 | Pressure redistribution | Reduce levels 16-18 intensity slightly, increase level 20 | LOW |
| 11 | Emotional health | Add "BREATHER" banner at relief section start | LOW |
| 12 | Panic exit | Add safe zone (2-3s) in survival corridor midpoint | MEDIUM |

---

## L. Summary

### Overall Recovery & Fatigue Score: 5.8/10

| Domain | Score |
|--------|-------|
| Overall recovery feel | 6.5 |
| Fatigue accumulation | 6.0 |
| Recovery window quality | 5.5 |
| Panic recovery | 6.5 |
| Long session sustainability | 5.5 |
| Pressure sustainability | 5.0 |
| Recovery readability | 5.0 |
| Emotional replay health | 6.0 |

### Top 3 Critical Issues

1. **Level 19→20 boss chain** — 900ms pause between final bosses. No mental reset. CRITICAL.
2. **Levels 16-20 emotional flatline** — No emotional variation. Player stops reacting. DRAINING.
3. **Level 17 survival corridor** — 35s sustained max density. No escape. FATIGUE SPIKE.

### Top 3 Calibration Candidates (Priority Order)

1. **Extend 19→20 pause** (900ms → 3000ms) — CRITICAL
2. **Reduce level 17 survival corridor** (35s → 25s) — HIGH
3. **Add RECOVERING state visual indicator** — HIGH
