# HC-PD-08 — Controlled Hooks Freeze Candidate

> **Sprint**: HC-PD-08
> **Date**: 2026-05-19
> **Status**: FREEZE CANDIDATE
> **Freezes**: Sweeper fan + Baiter burst controlled delay hooks
> **Depends on**: HC-PD-01 through HC-PD-07

---

## 1. WHAT IS FROZEN

### Hook 1: Sweeper Fan
| Field | Value |
|-------|-------|
| **File** | `update-enemies.js:1057-1078` |
| **Pattern** | `wideFan` |
| **Enemy** | alien1 (sweeper role) |
| **Dominance** | support |
| **Weight** | 2 |
| **Integration** | Independent cooldown post-fire: `nextCooldown + delayMs` |
| **Delay when** | Hard budget / hard readability / dangerous combo / multi-primary / lane overlap |
| **Config gate** | `controlledHooks.enemySupportFire: true` |

### Hook 2: Baiter Burst
| Field | Value |
|-------|-------|
| **File** | `update-enemies.js:1094-1114` |
| **Pattern** | `baiterSpread` |
| **Enemy** | alien_mini (baiter role) |
| **Dominance** | utility |
| **Weight** | 1 |
| **Integration** | Independent cooldown post-fire: `nextCooldown + delayMs` |
| **Delay when** | Same conditions as sweeper |
| **Config gate** | `controlledHooks.enemySupportFire: true` |

---

## 2. FROZEN CONFIG

```javascript
safeDelayGate: {
  enabled: true,
  applyDelay: false,           // OFF by default — no gameplay change

  maxDelayFrames: 30,          // ~500ms max extra cooldown
  maxConsecutiveDelays: 2,     // anti-softlock cap

  delayOnlyOn: {
    hardBudget: true,          // budget >= 10
    hardReadability: true,     // readability >= 8
    dangerousCombo: true,      // known dangerous pair
    multiPrimary: true,        // 2+ primaries active
    laneHighOverlap: true      // 2+ high lane-risk patterns
  },

  neverDelay: {
    bossPhaseTransition: true, // never gate phase changes
    deathSequence: true,       // never gate deaths
    scriptedSetPiece: true     // never gate set pieces
  },

  fallbackAllowAfterFrames: 90 // ~1.5s — auto-reset
},

controlledHooks: {
  enemySupportFire: true,      // sweeper + baiter enabled
  externalPressure: true,      // reserved for future
  bossPatterns: false          // bosses excluded
}
```

---

## 3. WHY THESE HOOKS ARE SAFE

### Sweeper (wideFan)
- **Support** dominance — never blocks primary threats
- **5-bullet fan** — low density, wide gaps
- **3200-5500ms cooldown** — already slow; +500ms is imperceptible
- **No aimed component** — never traps player
- **Lane risk: low** — never blocks escape routes
- **Identity preserved** — sweeper still sweeps, just slightly less often under pressure

### Baiter (baiterSpread)
- **Utility** dominance — lowest threat tier
- **3-bullet spread** — lowest density of all patterns
- **1800-3200ms cooldown** — already fast; delay barely noticeable  
- **Lane risk: safe** — never restricts movement
- **Identity preserved** — baiter still baits; jitter mechanic untouched

---

## 4. ANTI-SOFTLOCK PROTECTIONS (verified)

| Protection | Mechanism | Status |
|-----------|-----------|--------|
| Consecutive cap | Max 2 delays in a row → force allow | Active |
| Fallback timer | 90 frames (~1.5s) resets all counters | Active |
| Utility exemption | Utility patterns never gated | Active |
| Never-delay list | Boss transitions, death, set pieces excluded | Active |
| applyDelay default | `false` — zero gameplay impact by default | Active |
| Hook gate | `controlledHooks` per-pattern toggles | Active |
| Budget snapshot | Rolling 30-entry log for analysis | Active |

---

## 5. OBSERVED METRICS (design projection)

| Metric | Sweeper expected | Baiter expected | Health |
|--------|-----------------|-----------------|--------|
| suggested | ~10-20 per level | ~20-30 per level | healthy |
| applied (when enabled) | ~3-8 per level | ~5-12 per level | healthy |
| blockedByApplyFalse | = suggested (default) | = suggested (default) | expected |
| fallbackAllow | 0 | 0 | clean |
| avgDelayFrames | ~20-25 | ~20-25 | moderate |
| ratioApplied | ~30-50% | ~25-40% | healthy |
| health | healthy | healthy | green |

---

## 6. ACCEPTED RISKS

| Risk | Mitigation | Acceptable? |
|------|-----------|-------------|
| Sweeper feels slightly slower | Only under budget pressure; 500ms on 3s+ cooldown | Yes |
| Baiter fires less often | Baiter is utility; reduced presence is fine | Yes |
| Players notice delay | Only in hardcore mode with `applyDelay: true` | Yes |
| Debug overlay grows | Overlay is debug-only; not shipped to players | Yes |

---

## 7. TUNING RULES FOR FUTURE

### What CAN be adjusted
- `maxDelayFrames` (currently 30) — range 15-45
- `maxConsecutiveDelays` (currently 2) — range 1-3
- `fallbackAllowAfterFrames` (currently 90) — range 60-180
- `controlledHooks.enemySupportFire` — on/off toggle
- `softWarningBudget` / `softReadabilityWarning` — threshold tuning
- Per-hook health thresholds in `_hookHealth()`

### What MUST NOT be changed
- `applyDelay` default must stay `false` without explicit playtest decision
- `neverDelay` entries must stay protected
- Pattern weights in `HC_PATTERN_REGISTRY` (affects all HC-PD systems)
- `_hookHealth()` threshold logic without re-audit

---

## 8. NEXT STEPS RECOMMENDED

1. **Playtest with `applyDelay: false`** (current default) — confirm zero impact
2. **Playtest with `applyDelay: true`** — observe sweeper/baiter pacing
3. **If sweeper feels good**: Activate `externalPressure` hook (shmup externals)
4. **If baiter feels good**: Consider activating flanker/suppressor hooks with individual toggles
5. **After 3-4 enemy hooks stable**: Begin boss pattern evaluation (HC-PD-09+)
6. **Never**: Activate `applyDelay: true` by default without playtest confirmation

---

## 9. HOW TO ACTIVATE (manual only)

```javascript
// In browser console during gameplay:
window.HC_PATTERN_DIRECTOR.safeDelayGate.applyDelay = true;

// Watch debug overlay:
// HK section shows SW applied/suggested growing
// GATE section shows applied delay count

// To disable:
window.HC_PATTERN_DIRECTOR.safeDelayGate.applyDelay = false;

// To disable individual hooks:
window.HC_PATTERN_DIRECTOR.controlledHooks.enemySupportFire = false;
```

---

## 10. FILE CHECKLIST

| File | Status | Notes |
|------|--------|-------|
| `www/hc-pattern-director.js` | Clean | All systems in one file, passive by default |
| `www/hc-pattern-debug.js` | Clean | Overlay shows full telemetry |
| `www/hardcore-config.js` | Clean | Config centralized, all defaults safe |
| `www/update-enemies.js` | Clean | 2 integrations, both with safe fallbacks |
| `docs/hc-pd-pattern-audit.md` | HC-PD-01 | Complete |
| `docs/hc-pd-runtime-classification.md` | HC-PD-02 | Complete |
| `docs/hc-pd-threat-budget-audit.md` | HC-PD-03 | Complete |
| `docs/hc-pd-soft-gating.md` | HC-PD-04 | Complete |
| `docs/hc-pd-safe-delay-gate.md` | HC-PD-05 | Complete |
| `docs/hc-pd-controlled-delay-hook-trial.md` | HC-PD-06 | Complete |
| `docs/hc-pd-controlled-hook-telemetry.md` | HC-PD-07 | Complete |
| `docs/hc-pd-controlled-hooks-freeze.md` | HC-PD-08 | This document |

---

## 11. FREEZE CRITERIA

- [x] Sweeper hook audited — safe, support-pattern, config-gated
- [x] Baiter hook audited — safe, utility-pattern, config-gated
- [x] No over-delay — max 30 frames, consecutive cap at 2
- [x] No softlock — fallback timer + never-delay list + utility exemption
- [x] Enemy identity preserved — sweeper fans, baiter jitters
- [x] Config final documented — all values explicit
- [x] `applyDelay: false` by default — justified (needs playtest first)
- [x] `node --check` passes
- [x] `npm run validate` passes
- [x] No gameplay change in default configuration

**HC-PD Controlled Hooks → FREEZE CANDIDATE**

---

*End of HC-PD-08 freeze candidate.*
