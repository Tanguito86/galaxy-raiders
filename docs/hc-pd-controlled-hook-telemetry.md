# HC-PD-07 — Controlled Hook Telemetry & Tuning Audit

> **Sprint**: HC-PD-07
> **Date**: 2026-05-19
> **Status**: Complete
> **Depends on**: HC-PD-06 (controlled delay hook trial)
> **Mode**: OBSERVATION — measures delay effectiveness. No new hooks. No gameplay change by default.

---

## 1. OVERVIEW

HC-PD-07 expands the hook tracking from HC-PD-06 into a full telemetry system. It records detailed per-hook statistics, budget snapshots, and health assessments — all without adding new hooks or changing gameplay.

---

## 2. TELEMETRY PER HOOK

Each hook tracks:

| Metric | Description |
|--------|-------------|
| `suggested` | Total times delay was suggested |
| `applied` | Total times delay was actually applied |
| `blockedByApplyFalse` | Times delay was blocked because `applyDelay: false` |
| `fallbackAllow` | Times delay was blocked by fallback timer |
| `totalDelayFrames` | Sum of all applied delay frames |
| `avgDelayFrames` | Average delay per applied event |
| `maxDelayFrames` | Config cap (30) |
| `lastReason` | Reason for last suggestion |
| `lastSeverity` | Severity of last suggestion |
| `ratioApplied` | applied / suggested as percentage |
| `health` | idle / healthy / tense / risky |

---

## 3. HOOK HEALTH RULES

| Health | Condition | Meaning |
|--------|-----------|---------|
| `idle` | 0 suggestions | Hook never triggered — clean |
| `healthy` | <80% applied, <30% fallback, low avg delay | Working well |
| `tense` | >80% applied OR avg delay > 25f | Gating aggressively — check pacing |
| `risky` | >30% fallback rate | Softlock protection firing often — check config |

---

## 4. BUDGET SNAPSHOTS

Every `tryApplyPatternDelay()` call records:

```javascript
{
  f: frame,
  hk: hookName,
  id: patternId,
  bb: budgetBefore,
  pb: predictedBudget,
  rb: readabilityBefore,
  pr: predictedReadability,
  r: reason,
  sev: severity,
  app: applied  // true if delay was actually applied
}
```

Last 30 snapshots stored. Access via `getControlledHookTelemetry().lastBudgetSnapshots`.

---

## 5. GLOBAL SUMMARY

`getControlledHookTelemetry()` returns:

```javascript
{
  hooks: { sweeper: {...}, baiter: {...} },
  totals: { suggested, applied, blockedByApplyFalse, fallbackAllow, avgDelayFrames },
  lastBudgetSnapshots: [...],
  activeHooks: 'enemySupportFire externalPressure',
  summary: { overallHealth: 'healthy' | 'idle' | 'risky' }
}
```

---

## 6. TUNING NOTES

### How to test `applyDelay: false` (current default)
- Play normally
- Watch debug overlay → `HK` section
- All delays show as `suggested` but 0 `applied`
- `blk` (blocked) counter increases

### How to test `applyDelay: true`
```javascript
// In browser console:
window.HC_PATTERN_DIRECTOR.safeDelayGate.applyDelay = true;
```
- Sweeper and baiter will receive up to 30 frames (~500ms) extra cooldown
- Watch debug: `applied` counter should grow when budget is critical
- Verify enemies still fire (delay only affects NEXT cooldown)

### What to observe
- `avgDelayFrames` — should stay low (<15)
- `ratioApplied` — should not exceed 80%
- `fallbackAllow` — should be 0 or very low
- Budget after delay should be lower
- Readability after delay should improve

### When a hook is healthy
- applied/suggested ratio ~30-70%
- no fallback events
- avg delay < 20 frames
- enemy identity maintained
- no pacing disruption visible

### When to revert a hook
- applied/suggested > 80% → gating too much
- fallback events frequent → softlock protecting
- avg delay > 25 frames → pacing disrupted
- enemy becomes invisible → identity lost
- set `controlledHooks.enemySupportFire = false`

---

## 7. DEBUG OVERLAY

HK section now shows:
- `SW` and `BT` — applied/suggested (color: green=applied, yellow=suggested-only)
- `avg` row — average delay frames per hook
- `blk` row — blocked-by-applyDelay-false count
- `last` row — hook name + frames ago + severity
- `fb` row — fallback allow count (yellow, only if >0)

---

## 8. FREEZE CRITERIA

- [x] Per-hook telemetry captures all 12 metrics
- [x] `getControlledHookTelemetry()` returns global summary
- [x] Budget snapshots recorded (30 max)
- [x] Hook health rules implemented (idle/healthy/tense/risky)
- [x] Debug overlay expanded with avg, blk, severity
- [x] No new hooks added
- [x] `applyDelay: false` by default
- [x] `node --check` passes
- [x] `npm run validate` passes
- [x] No gameplay change

---

*End of HC-PD-07 documentation.*
