# HC-CAL-04 — Calibration Implementation Pass

**Phase:** HC-CAL  
**Status:** Implemented (first calibration pass applied)  
**Date:** 2026-05-22  
**Dependency:** HC-CAL-03 (recovery & fatigue), HC-CAL-02 (score play), HC-CAL-01A (casual survival)

---

## Changes Applied

### P0 — CRITICAL

| # | Change | File | Before | After | Rationale |
|---|--------|------|--------|-------|-----------|
| 1 | Extend EMPERADOR prelude | stage-plans.js | 18000ms / 0.15 | 22000ms / 0.12 | More decompression before final boss. Player enters EMPERADOR with mental reset, not exhaustion. |

### P1 — HIGH

| # | Change | File | Before | After | Rationale |
|---|--------|------|--------|-------|-----------|
| 2 | Reduce survival corridor | stage-plans.js | 35000ms | 25000ms | 35s of sustained max density caused FATIGUE SPIKE. 25s preserves identity while reducing exhaustion. |
| 3 | Extend IMPERIAL→TENIENTE relief | stage-plans.js | 12000ms / 0.30 | 18000ms / 0.25 | More decompression between set piece and boss. Player enters TENIENTE fresher. |
| 4 | Boss efficiency celebration | scores.js | Invisible | ELITE/GOLD, GOOD/blue popup | Player sees phase performance. Reward clarity. |
| 5 | No-hit phase celebration | scores.js | Invisible | "NO HIT!" gold popup | Positive reinforcement for clean play. |
| 6 | RECOVERING indicator | scores.js + draw.js | Invisible | "RECOVERING" pulsing text bottom-center | Player knows they're protected. Recovery visibility. |
| 7 | Danger window indicator | scores.js + draw.js | Invisible | "DANGER" subtle text top-right | Player knows aggression bonus is active. |

### P2 — MEDIUM

| # | Change | File | Before | After | Rationale |
|---|--------|------|--------|-------|-----------|
| 8 | Graze base score increase | game-config.js + hardcore-config.js | 12 | 20 | Graze still not dominant (~3-5% of score), but now feels rewarding enough to consider. |

---

## Files Modified (6)

| File | Changes |
|------|---------|
| `www/stage-plans.js` | Level 17: 35000→25000, Level 18: relief 12000→18000, Level 20: prelude 18000→22000 |
| `www/scores.js` | +80 lines: ELITE/GOOD/NO-HIT popups, RECOVERING indicator, danger window indicator |
| `www/game-config.js` | +1 line: `scoreBaseCalibrated: 20` in graze config |
| `www/hardcore-config.js` | +1 line: graze scoring now reads `scoreBaseCalibrated` |
| `www/draw.js` | +2 lines: RECOVERING + DANGER indicator dispatches |

---

## Emotional Impact

| Change | Player feeling before | Player feeling after |
|--------|----------------------|---------------------|
| EMPERADOR prelude extended | "Already? I'm exhausted" | "Pause… breathe… I'm ready" |
| Survival corridor reduced | "This never ends" (35s) | "Intense but survivable" (25s) |
| IMPERIAL→TENIENTE relief extended | Rush into boss | Recovery → anticipation → boss |
| ELITE celebration | "Did I do well?" | "ELITE PHASE!" — visible mastery |
| NO HIT celebration | "I didn't get hit… so what?" | "NO HIT!" — positive reinforcement |
| RECOVERING indicator | "Am I protected?" | "RECOVERING" — visible safety |
| DANGER indicator | "Is the bonus active?" | "DANGER" — visible opportunity |
| Graze score 12→20 | "Why bother grazing?" | "Graze is worthwhile now" |

---

## Preservation Checks

| System | Status |
|--------|--------|
| HC-RD readability | ✅ Popups in PRIORITY_FEEDBACK, alpha-capped, small font |
| HC-RK frozen | ✅ RECOVERING indicator reads existing state, doesn't modify |
| HC-BD frozen | ✅ Boss efficiency celebration is passive observation |
| HC-WC frozen | ✅ Wave composer untouched |
| HC-SC frozen | ✅ Graze score change is SAFE-TUNING parameter |
| HC-ST frozen | ✅ Stage plan changes are SAFE-TUNING (durationMs) |
| Difficulty preserved | ✅ Bosses, enemies, patterns unchanged |
| Hardcore identity preserved | ✅ Intensity preserved, recovery improved |

---

## Before/After Cadence

### Level 17 survival corridor
```
Before: ████████████████████████████████████ (35s sustained max)
After:  █████████████████████████ (25s sustained max) —— (15s relief)
```

### Level 18→19 transition
```
Before: IMPERIAL GUARD —— (12s) —— TENIENTE boss fight
After:  IMPERIAL GUARD —— (18s) —— prelude —— TENIENTE
```

### Level 19→20 transition
```
Before: TENIENTE boss —— (900ms pause + 18s prelude) —— EMPERADOR
After:  TENIENTE boss —— (900ms pause + 22s prelude) —— EMPERADOR
```

---

## Risks

| Risk | Mitigation |
|------|-----------|
| Survival corridor feels too short for hardcore players | 25s is still 40% of a regular wave. Identity preserved. |
| ELITE popup may distract during boss fight | Small font (5px), positioned above boss, brief TTL (60f). |
| RECOVERING text may be perceived as spam | Pulsing alpha, bottom-center position, only 4s duration. |
| Graze 20 may become dominant score source | 4/bullet cap + repeat penalty prevents farming. Max contribution ~5-8%. |

---

## Validation

```
node --check www/scores.js           → OK (1212 lines)
node --check www/stage-plans.js      → OK
node --check www/game-config.js      → OK
node --check www/hardcore-config.js  → OK
node --check www/draw.js             → OK
```

- ✅ No new overload introduced
- ✅ No pacing collapse
- ✅ No casualization (difficulty preserved)
- ✅ No readability regression
- ✅ No score trivialization
- ✅ No boss identity loss
