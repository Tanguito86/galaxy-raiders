# HC-PD-04 — Soft Gating & Composition Advice

> **Sprint**: HC-PD-04
> **Date**: 2026-05-19
> **Status**: Complete
> **Depends on**: HC-PD-03 (budget audit)
> **Mode**: ADVISORY — evaluates, recommends. Does NOT block.

---

## 1. PHILOSOPHY

HC-PD-04 is the "king's advisor" layer. It evaluates every pattern activation and returns what the director WOULD recommend, but never forces that recommendation.

`advisoryOnly: true` means `allowed` is always `true`. The recommendation is purely informational — for telemetry, debug, and later use in HC-PD-05.

---

## 2. EVALUATE PATTERN REQUEST

```javascript
evaluatePatternRequest(patternId, source, meta)
```

Returns:

```javascript
{
  patternId: 'radialRing',
  allowed: true,           // always true in advisory mode
  recommendation: 'delay', // allow | delay | soften | isolate | telegraph | avoid
  reasons: ['predicted budget 12 >= hard limit 10'],
  severity: 'critical',    // ok | tense | risky | critical
  budgetBefore: 8,
  predictedBudget: 12,
  predictedReadability: 6,
  cooldownState: { ... },
  dangerousComboRisk: false,
  laneRisk: 'high',
  telegraphRequired: true
}
```

---

## 3. RECOMMENDATION MEANING

| Recommendation | Meaning | When |
|---------------|---------|------|
| `allow` | Safe to fire immediately | Budget ok, no conflicts, no cooldown |
| `delay` | Should wait a few frames | Hard budget, hard readability, cooldown active |
| `soften` | Should reduce intensity | Readability soft limit, support overload |
| `isolate` | Should be the only primary | Primary conflict with another active primary |
| `telegraph` | Needs visual warning | telegraphRequired but none detected |
| `avoid` | Should not fire | Dangerous combo detected |

---

## 4. SEVERITY LEVELS

| Severity | Meaning | Color in debug |
|----------|---------|----------------|
| `ok` | Everything fine | Green |
| `tense` | Approaching limits | Yellow |
| `risky` | Conflict or near-cap | Orange |
| `critical` | Hard limit or dangerous combo | Red |

---

## 5. HOW BUDGET/READABILITY IS PREDICTED

```
predictedBudget = currentBudget + patternWeight
predictedReadability = currentReadability + readabilityCost
```

Compared against:
- `maxThreatBudget` (10) → hard limit
- `softWarningBudget` (8) → soft limit
- `maxReadabilityLoad` (8) → hard limit
- `softReadabilityWarning` (6) → soft limit

---

## 6. COOLDOWN ADVICE

Tracks frames since last activation per category:

| Category | Min frames | Warning |
|----------|-----------|---------|
| Primary threat | 45 | Recommend delay |
| Sniper | 50 | Recommend delay |
| Wall/lane closure | 70 | Recommend delay |
| High lane risk | 60 | Recommend delay |

Cooldown state is updated passively on every `evaluatePatternRequest()` call.

---

## 7. DECISION TELEMETRY

Last 20 evaluations stored:
```javascript
{ f: frame, id: patternId, src: source, rec: recommendation, sev: severity, r: reasonCount, pb: predictedBudget, pr: predictedReadability }
```

Accessible via `getSoftGatingAdvice().telemetry`.

---

## 8. INTEGRATION

`evaluatePatternRequest()` is called from `registerPatternUsage()` — every time a pattern is registered, the director evaluates what it would recommend.

No gameplay impact. All patterns still fire.

---

## 9. PENDING FOR HC-PD-05

When `advisoryOnly` becomes `false`:
- `recommendation: 'avoid'` → pattern is cancelled
- `recommendation: 'delay'` → pattern is queued for later
- `recommendation: 'isolate'` → other primaries are softened
- `recommendation: 'telegraph'` → telegraph is forced before firing
- Cooldown enforcement becomes mandatory
- Budget hard cap becomes enforced

---

*End of HC-PD-04 documentation.*
