# HC-PD-05 — Safe Delay Gate

> **Sprint**: HC-PD-05
> **Date**: 2026-05-19
> **Status**: Complete
> **Depends on**: HC-PD-04 (soft gating + advice)
> **Mode**: GATE-READY — delay gate structured but `applyDelay: false`

---

## 1. PHILOSOPHY

HC-PD-05 adds the first real intervention capability: a safe delay gate that can recommend (and eventually apply) short delays to risky patterns. This is the "yellow traffic light" — it warns, measures, and leaves the barrier ready, but doesn't automatically stop traffic yet.

`applyDelay: false` means delay is only suggested via telemetry. When set to `true`, the gate will return `delay: true` for patterns that exceed safety thresholds.

---

## 2. SHOULD DELAY PATTERN

```javascript
shouldDelayPattern(patternId, source, meta)
```

Returns:
```javascript
{
  delay: boolean,       // true only when applyDelay:true AND conditions met
  delayFrames: number,  // actual delay frames (0 when not applying)
  reason: string,       // explanation
  severity: string,     // ok | tense | risky | critical
  fallbackAllow: boolean // true when delay is NOT suggested
}
```

---

## 3. DELAY RULES

### When delay is suggested
| Condition | Config gate | Description |
|-----------|-------------|-------------|
| Hard budget exceeded | `delayOnlyOn.hardBudget` | predictedBudget >= maxThreatBudget |
| Hard readability exceeded | `delayOnlyOn.hardReadability` | predictedReadability >= maxReadabilityLoad |
| Dangerous combo detected | `delayOnlyOn.dangerousCombo` | pattern creates known dangerous pair |
| Multi-primary conflict | `delayOnlyOn.multiPrimary` | 2+ primary threats active |
| Lane high overlap | `delayOnlyOn.laneHighOverlap` | 2+ high lane-risk patterns |

### Never delayed
| Condition | Config gate |
|-----------|-------------|
| Boss phase transition | `neverDelay.bossPhaseTransition` |
| Death sequence | `neverDelay.deathSequence` |
| Scripted set piece | `neverDelay.scriptedSetPiece` |
| Force allow override | `meta.forceAllow === true` |
| Utility patterns | Always allowed (dominance === 'utility') |

---

## 4. DELAY LIMITS (anti-softlock)

| Limit | Default | Behavior |
|-------|---------|----------|
| Max delay frames | 30 | Short delay only — never freeze |
| Max consecutive delays | 2 | After 2 delays, force allow |
| Fallback allow | 90 frames | If 90+ frames since last delay, reset counters |
| Utility patterns | Always allowed | Never gated |

---

## 5. WHY applyDelay STARTS FALSE

- HC-PD-05 is a capability delivery, not a gameplay change
- First verify the delay logic works correctly via telemetry
- Then manually enable `applyDelay: true` when ready (HC-PD-06 or playtest decision)
- Prevents unintended gameplay impact during development

---

## 6. INTEGRATION

`shouldDelayPattern()` is called from `registerPatternUsage()` — after `evaluatePatternRequest()`. Both run every time a pattern is activated.

When `applyDelay: false`:
- All patterns fire normally
- Delay telemetry records suggestions
- Debug overlay shows GATE OFF

When `applyDelay: true` (future):
- Risky patterns return `delay: true, delayFrames: N`
- Caller can optionally queue the pattern for later
- Consecutive delay cap prevents starvation

---

## 7. TELEMETRY

Last 20 delay events stored:
```javascript
{ f: frame, id: patternId, src: source, df: delayFrames, r: reason, sev: severity, app: applied, fb: fallbackAllow }
```

State accessible via `getDelayGateState()`:
```javascript
{
  enabled, applyDelay, consecutiveDelays,
  lastDelayedPattern, lastDelayReason, framesSinceLastDelay,
  totalSuggestedDelays, totalAppliedDelays,
  config, telemetry
}
```

---

## 8. FREEZE CRITERIA

- [x] `shouldDelayPattern` exists and works
- [x] Delay telemetry records correctly
- [x] `applyDelay: false` has no gameplay impact
- [x] Anti-softlock protections exist (consecutive cap, fallback timer, never-delay list)
- [x] Debug overlay shows GATE state
- [x] `node --check` passes
- [x] No regressions

---

*End of HC-PD-05 documentation.*
