# HC-CAL-FREEZE — Production Stable Lock

**Phase:** HC-CAL (CLOSED)  
**Status:** **PRODUCTION-STABLE — FROZEN**  
**Date:** 2026-05-22  
**Dependency:** HC-CAL-05 (validation), HC-CAL-04 (implementation), HC-PT (complete), HC Foundation (frozen)

---

## 1. HC-CAL Final State

### Results Achieved

| Metric | Pre-Calibration | Post-Calibration | Status |
|--------|----------------|-----------------|--------|
| Overall feel | 7.2/10 | 7.8/10 | ✅ STABLE |
| Fatigue control | 6.0 | 7.2 | ✅ STABLE |
| Recovery readability | 5.0 | 7.5 | ✅ RESOLVED |
| Pressure sustainability | 5.0 | 6.5 | ✅ IMPROVED |
| Hardcore identity | — | 8.5 | ✅ PRESERVED |
| Replay health | 6.0 | 7.2 | ✅ STABLE |

### Risks Avoided

| Risk | How avoided |
|------|------------|
| Over-tuning (death by a thousand micro-adjustments) | Calibrated 8 targets, stopped at 5 sprints |
| Casualization (making game too easy) | Only pacing/feedback changed. Difficulty params untouched. |
| Erosion of pressure identity | Survival corridor still 25s of 0.90 intensity. Bosses unchanged. |
| Score inflation | Graze 12→20 still non-dominant (4/bullet cap preserved) |
| Visual spam | Popups are 5px font, alpha-capped, short TTL, PRIORITY_FEEDBACK |

### Limits Reached

| Limit | Why |
|-------|-----|
| Late-game pressure monotony (16-20) | Requires level redesign — outside HC-CAL scope |
| Back-to-back boss exhaustion (19→20) | Improved but structural — requires level architecture change |
| Mobile readability | Platform limitation — HC-RD mobile boosts already applied |
| Score feedback depth | Pacing/celebration improved. Further changes risk HC-RD violations. |

---

## 2. Production-Stable Declaration

**Galaxy Raiders Hardcore Calibration is hereby declared PRODUCTION-STABLE.**

The game has been audited across 5 calibration sprints:
- HC-CAL-01A: Casual Survival Baseline (7.2/10)
- HC-CAL-02: Score Play Audit (7.5/10)
- HC-CAL-03: Recovery & Fatigue Calibration (5.8/10)
- HC-CAL-04: Implementation Pass (8 changes applied)
- HC-CAL-05: Post-Calibration Validation (7.8/10)

The improvements are verified. The identity is preserved. The limits of internal calibration are reached. Further tuning requires external player data.

---

## 3. Calibration Lock Boundaries

### LOCKED — No Further Tuning Without External Evidence

| Area | Why locked | What would reopen it |
|------|-----------|-------------------|
| **Rank pressure** | HC-RK frozen, governor verified | External telemetry showing systemic FAIRNESS failure at rank 5 |
| **Recovery cadence** | RECOVERING 4s, multiplier −30%, rank −8 | External data showing run abandonment > 50% after first death |
| **Pressure pacing** | Sawtooth curves, 5 tension patterns | External data showing emotional flatline in > 60% of sessions |
| **Relief spacing** | 10-18s relief sections, preludes extended | External data showing relief starvation in > 40% of sessions |
| **Boss pacing** | 5 bosses, phase plans, preludes | External data showing CLIMAX-WEAK in > 3/5 bosses |
| **Readability intensity** | HC-RD alpha floors, bullet outlines | External data showing VISUAL-CONFLICT in > 30% of testers |
| **Popup density** | 5px font, alpha-capped, PRIORITY_FEEDBACK | External data showing popup masking in > 20% of death replays |
| **Greed pressure** | ×1.75 near, ×1.30 mid, graze 20 | External data showing > 60% of score from single greed source |
| **Telegraph timing** | HC-RD telegraph consistency | External data showing CHEAP deaths in > 20% of boss deaths |
| **Stage breathing room** | Stage plans with authored section timing | External data showing DRAINING in > 50% of full-run sessions |

---

## 4. NEVER-TOUCH Rules

### Dangerous Changes — Must Not Be Made

| Change | Why dangerous |
|--------|--------------|
| **Reduce global pressure** | Kills hardcore identity. "This game is too easy" reviews. |
| **Increase global relief** | Empowers SAFE-BORING playstyle. Kills greed tension. |
| **Extend telegraphs universally** | Slows game pace. Rewards passive play. Breaks arcade cadence. |
| **Reduce aggression globally** | Weakens score economy. Pushes players to safe play. |
| **Soften rank systematically** | Kills replayability. Rank must reward and punish. |
| **Decrease bullet density** | Kills tension. Density IS the genre. Readability, not density, is the fix. |
| **Reduce greed tension** | Kills score engagement. Greed must tempt and risk. |

### Why These Rules Exist

Hardcore shmups that over-tune become soft. Soft shmups don't survive. Galaxy Raiders built its foundation on Cave/Garegga/DOJ philosophy. Softening it destroys that foundation.

**Rule of thumb:** If you're not sure, DON'T touch it. Wait for external player data.

---

## 5. Safe Tuning Zones

### Micro-Adjustments Still Allowed

| Parameter | Safe range | Impact | Block |
|-----------|-----------|--------|-------|
| Stage plan section `durationMs` | ±20% of current | Pacing feel | HC-ST STAGE PLANS |
| Graze `scoreBase` | 12-30 | Graze contribution | HC-SC GRAZE |
| Graze `maxPerBullet` | 2-6 | Anti-farming | HC-SC GRAZE |
| Multiplier `gain.*` values | ±30% of current | Score pacing | HC-SC MULTIPLIER |
| Medal `missTierLoss` | 1-3 | Chain tension | HC-SC MEDALS |
| Survival chain `levels[]` | 20/40/80 to 30/60/120 | Milestone timing | HC-SC SURVIVAL |
| Debug overlay flags | Any | Development convenience | ALL DEBUG |

### Risky Adjustments (Need External Evidence)

| Parameter | Risk | Evidence required |
|-----------|------|------------------|
| `safetyBulletSpeedMax` | HIGH — readability ceiling | Telemetry showing unreadable deaths at current cap |
| `multiplier.max` | MEDIUM — score inflation | Score distribution data showing ×3.0 too easy to reach |
| `decay.ratePerFrame` | MEDIUM — pacing disruption | Multiplier uptime data showing > 95% unsustainable |
| Stage plan tension curve type | MEDIUM — pacing identity | Emotional pacing audit showing curve mismatch |

### Prohibited Tuning

| Parameter | Why |
|-----------|-----|
| `safetyBossRankCeilings.supreme` | EMPERADOR max rank 4 — protected by HC-BD freeze |
| `antiMilk.softCapMs` | Boss anti-milk — structural protection |
| `medal.maxDropsPerWave` | Anti-farming cap — economy integrity |
| `recoveringMs` | Recovery psychology — protected by HC-RK |
| `gameplayEffectsEnabled` | Master switch — requires full re-audit |

---

## 6. Reopen Conditions

### HC-CAL Can Only Reopen If:

| Condition | Evidence type | Minimum threshold |
|-----------|--------------|------------------|
| **External retention collapse** | Real player data showing < 2 sessions per player on average | 20+ players, 1+ week |
| **Replay failure** | > 40% of sessions end before level 10 | 20+ players |
| **Fairness collapse** | > 30% of deaths classified as CHEAP by external testers | 10+ testers |
| **Clarity failure** | > 30% of deaths attributed to readability issues | 10+ testers |
| **Impossible recovery** | Run abandonment > 60% after first death | 20+ players |
| **Score degeneration** | Median multiplier < ×1.2 across score players | 10+ score players |
| **External high-rank failure** | Top 10% of players cannot reach rank 4 | 50+ players |

### HC-CAL Must NOT Reopen For:

- ❌ "I feel like it needs more tuning" (internal intuition)
- ❌ "One playtester said it's too hard" (single data point)
- ❌ "Let me just adjust this one thing" (impulse tuning)
- ❌ "Other games do it differently" (genre comparison)
- ❌ "It could be even better" (perfectionism)

---

## 7. Deferred Issues Registry

### Issues Outside HC-CAL Scope

| # | Issue | Why deferred | Required for resolution |
|---|-------|-------------|------------------------|
| 1 | Pressure monotony levels 16-20 | Requires level redesign — new content block | HC-CONTENT or level architecture sprint |
| 2 | 19→20 boss chain structural exhaustion | Requires level architecture change (insert breather between bosses) | HC-CONTENT or game structure change |
| 3 | Mobile readability | Platform limitation — hardware constraints | Platform-specific optimization sprint |
| 4 | Score feedback depth (per-source breakdown HUD) | Requires new UI elements — outside scope | HC-SC future or UX sprint |
| 5 | DANGER indicator naming ambiguity | Very minor — cosmetic fix | Can be fixed in any future sprint |
| 6 | Multiplier recovery progress bar | UI element — requires new rendering | HC-SC future or UX sprint |
| 7 | Visual palette variation per chapter | Requires asset work — content block | HC-CONTENT or visual design sprint |
| 8 | Early game score engagement (levels 1-2) | Requires content/encounter redesign | HC-CONTENT |

---

## 8. Production Readiness Summary

| Domain | Score | Verdict |
|--------|-------|---------|
| Hardcore stability | 8.5/10 | ✅ PRODUCTION-STABLE |
| Replay sustainability | 7.2/10 | ✅ STABLE |
| Fairness health | 7.5/10 | ✅ STABLE |
| Fatigue health | 7.2/10 | ✅ STABLE |
| Readability health | 7.5/10 | ✅ STABLE |
| Memorable quality | 7.5/10 | ✅ STABLE |
| Retry motivation | 7.2/10 | ✅ STABLE |
| Score engagement | 7.5/10 | ✅ STABLE |
| Recovery quality | 7.5/10 | ✅ STABLE |

### Overall: 7.6/10 — PRODUCTION-STABLE

---

## 9. Transition Recommendation

### HC-CAL → COMPLETE

The calibration phase is officially closed. The game's hardcore feel has been audited, tuned, and validated. Further internal calibration would risk over-tuning.

### Next Recommended Phases

| Phase | Purpose | Priority |
|-------|---------|----------|
| **HC-LIVE** | External player telemetry, real-world validation | HIGH |
| **HC-EXT** | Content expansion, level redesign for deferred issues | MEDIUM |
| External playtesting with real players | Validate calibration against fresh eyes | HIGH |
| Production shipping (alpha/beta) | Real-world deployment | MEDIUM |
| Score leaderboard launch | Competitive validation | LOW |

### Immediate Next Step

**Deploy to testers. Collect real data. Do not tune until data exists.**

---

## 10. Foundation Summary

```
HC Foundation (8 blocks):
  HC-RD ✅  HC-HB ✅  HC-PD ✅  HC-WC ✅
  HC-BD ✅  HC-RK ✅  HC-SC ✅  HC-ST ✅
  HC-INT ✅

HC-PT (7 docs):
  Framework, Taxonomy, Friction, Pacing,
  Methodology, Telemetry, Standards ✅

HC-CAL (6 sprints):
  Casual Survival → Score Play → Recovery/Fatigue →
  Implementation → Validation → FREEZE ✅

Total:
  9 blocks. 7 methodology docs. 6 calibration sprints.
  ~75 sprints. 41 source files. 66 docs.
  
  Galaxy Raiders Hardcore Foundation:
  BUILT. CALIBRATED. FROZEN. PRODUCTION-STABLE.
```
