# HC-PD-03 — Passive Threat Budget Audit

> **Sprint**: HC-PD-03
> **Date**: 2026-05-19
> **Status**: Complete
> **Depends on**: HC-PD-02 (runtime classification + registry)
> **Mode**: PASSIVE — audits only. No combat control.

---

## 1. OVERVIEW

HC-PD-03 adds a per-frame threat budget audit to the HC-PD system. Using the metadata from HC-PD-02's registry, the audit computes:

- Total threat weight per frame
- Readability load per frame
- Simultaneous primary/support/utility threat counts
- Lane risk score and space control stacking
- Telegraph overlap and missing telegraph detection
- Dangerous pattern combination detection
- Compact history for trend analysis

All warnings are debug-only. No pattern is ever blocked.

---

## 2. HOW THREAT BUDGET IS CALCULATED

### Per-pattern contribution
Each registered pattern adds its `weight` (from `HC_PATTERN_REGISTRY`) to the frame budget:

| Dominance | Typical weight | Examples |
|-----------|---------------|----------|
| primary | 3-6 | aimedSpread(5), radialRing(6), imperialCrossfire(5) |
| support | 2-3 | wideFan(2), diverPursuit(3), tractorBeam(4) |
| utility | 1-2 | baiterSpread(1), counterShot(2), defaultEnemyShot(1) |

### Budget thresholds
| Threshold | Value | Warning |
|-----------|-------|---------|
| Soft warning | 8 | `BUDGET_SOFT` — approaching limit |
| Hard limit | 10 | `BUDGET_HARD` — at ceiling |

A well-composed frame typically sits at 5-7. Budget 8+ means "tense but fair". Budget 10+ means the system would start gating if enabled.

---

## 3. HOW READABILITY LOAD IS CALCULATED

Each pattern's `readabilityCost` (0-4) sums per frame:

| Cost | Meaning | Examples |
|------|---------|----------|
| 0 | Invisible | defaultEnemyShot, shmupExternal |
| 1 | Minimal | aimedShot, wideFan, baiterSpread |
| 2 | Noticeable | aimedBurst, chaserBurst, tractorBeam |
| 3 | Demanding | radialRing, arcWave, chargeImpact |
| 4 | Heavy | rotatingArcs, imperialCrossfire |

### Readability thresholds
| Threshold | Value | Warning |
|-----------|-------|---------|
| Soft warning | 6 | `READ_SOFT` — visual complexity rising |
| Hard limit | 8 | `READ_HARD` — at readability ceiling |

---

## 4. WARNING TYPES (10 total)

| Warning | Prefix | Trigger |
|---------|--------|---------|
| Budget soft | `BUDGET_SOFT` | weight >= softWarningBudget (8) |
| Budget hard | `BUDGET_HARD` | weight >= maxThreatBudget (10) |
| Readability soft | `READ_SOFT` | readability >= softReadabilityWarning (6) |
| Readability hard | `READ_HARD` | readability >= maxReadabilityLoad (8) |
| Multi primary | `MULTI_PRIMARY` | primaryCount > maxPrimaryThreats (1) |
| Support overload | `SUPPORT_OVER` | supportCount > maxSupportThreats (2) |
| High lane count | `LANE_HIGH` | highLaneRiskCount > maxHighRiskPatterns (1) |
| Lane overlap | `LANE_OVERLAP` | 2+ high-risk patterns simultaneously |
| Space control stack | `SPACE_STACK` | 2+ space-control patterns simultaneously |
| Telegraph overlap | `TG_OVERLAP` | 2+ telegraphs active in same window |
| Telegraph missing | `TG_MISSING` | telegraphRequired pattern has none |
| Density risk | `DENSITY_RISK` | 30+ bullets AND 4+ patterns |
| Dangerous combo | `COMBO` | Known dangerous pattern combination |

---

## 5. DANGEROUS COMBINATIONS DETECTED

| Combo | Classes | Tags |
|-------|---------|------|
| wall + sweep | spaceControl + pressure | [wall, lane_closure] + [fan, sweep] |
| sniper + suppression | precision + pressure | [sniper] + [suppressor] |
| spiral + dense spread | escalation + pressure | [wave, spiral] + [spread] |
| double aimed sync | precision + precision | any + any |
| area denial + chase | spaceControl + pressure | [area_denial] + [pursuit, chaser] |
| rotating + tractor | escalation + spaceControl | [rotating] + [beam] |
| crossfire + sniper | precision + precision | [crossfire] + [sniper] |
| wall + high lane risk | spaceControl + any | [wall, lane_closure] + any |

Detection uses category + tag matching on active patterns. When a combo is found, a `COMBO` warning is emitted.

---

## 6. LANE RISK AUDIT

Per-frame lane risk score sums individual pattern lane risks:
- safe = 0, low = 1, medium = 2, high = 3

### Warnings
- `LANE_HIGH`: more high-risk patterns than configured max (default 1)
- `LANE_OVERLAP`: 2+ high-risk patterns active simultaneously
- `SPACE_STACK`: 2+ space-control patterns active simultaneously

---

## 7. TELEGRAPH AUDIT

Per frame:
- Counts patterns with `telegraphRequired: true`
- Counts patterns where telegraph is required but not registered (`_hasTelegraph` missing)
- Detects overlap when 2+ telegraph-required patterns are active

### Warnings
- `TG_OVERLAP`: telegraph overlap detected
- `TG_MISSING`: patterns needing telegraph have none registered

---

## 8. COMPACT HISTORY

Every `sampleEveryFrames` (default 10), a history entry is recorded:

```
{ f: frame, w: weight, r: readability, p: primaryCount, s: supportCount, l: laneScore, n: warningCount, d: hasDangerousCombo }
```

Maximum stored: `maxFrames` (default 300). Used for trend visualization in debug overlay.

---

## 9. METRICS FOR HC-PD-04

The audit provides the data needed for active pattern direction:

| Metric | Use in HC-PD-04 |
|--------|-----------------|
| `threatWeight` | Will gate pattern activation when `requestPattern()` denies |
| `readabilityLoad` | Will add delay between patterns when near ceiling |
| `primaryThreatCount` | Will deny additional primaries when at max |
| `laneRiskScore` | Will trigger escape lane reservation |
| `dangerousCombo` | Will force pattern alternatives |
| `telegraphOverlap` | Will stagger telegraphs |
| `spaceControlCount` | Will prevent screen entrapment |

---

## 10. CONFIG

```javascript
budgetAudit: {
  enabled: true,
  maxThreatBudget: 10,
  softWarningBudget: 8,
  maxReadabilityLoad: 8,
  softReadabilityWarning: 6,
  maxPrimaryThreats: 1,
  maxSupportThreats: 2,
  laneRisk: {
    maxHighRiskPatterns: 1,
    warnOnHighHighOverlap: true,
    warnOnSpaceControlStack: true
  },
  telegraph: {
    minSpacingFrames: 20,
    warnOnOverlap: true
  },
  history: {
    maxFrames: 300,
    sampleEveryFrames: 10
  }
}
```

---

## 11. FREEZE CRITERIA

- [x] Budget audit computes per-frame
- [x] 10 warning types emit correctly
- [x] Dangerous combos detected (8 patterns)
- [x] Lane risk audit works
- [x] Telegraph audit works
- [x] Compact history recorded
- [x] Debug overlay shows all metrics
- [x] `node --check` passes
- [x] No gameplay change
- [x] No pattern blocking

---

*End of HC-PD-03 audit documentation.*
