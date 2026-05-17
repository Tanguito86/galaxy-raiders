# Encounter Director — Telemetry Run Log

Template for recording Encounter Director telemetry across real playtests.
Press **U** to start capture, **I** to export the JSON baseline to console.

---

## Run Entry

Copy this block per run:

```
## Run N

- **Build/commit:** `<git rev-parse --short HEAD>`
- **Level:** `<level reached>`
- **Duration:** `<mm:ss or snapshot count>`
- **Player result:** `<cleared / died / game over>`
- **Perceived feel:** `<1-line subjective: e.g. "fair but intense", "too empty", "relentless">`

### JSON Report
` ` `json
<paste F5 JSON here>
` ` `

### Tuning Notes
- `<observation or proposed change>`
```

---

## Target Interpretation Guide

| Metric | Too Low | Too High | Healthy Range |
|---|---|---|---|
| **avgPressure** | < 0.20 — game feels empty, enemies die too fast | > 0.70 — relentless, no breathing room | 0.25–0.55 |
| **peakPressure** | < 0.40 — no danger spikes | > 0.95 — near-constant ceiling, likely chaotic | 0.70–0.90 |
| **reliefCount** | 0–1 — pressure never recovers; dives or bullets never clear | > snapshot/3 — relief spamming, pressure too volatile | 2–6 per minute of capture |
| **silenceCount** | 0–2 per level — no gating; enemies chain-spawn on top of each other | > deaths × 2 — silence overcounts; game feels frozen after kills | roughly equal to deaths + 1 per wave clear |
| **avgDensity** | < 3 — screen too sparse | > 18 — bullet hell without structure | 5–14 |
| **eliteOverlapWindows** | — | > 20% of snapshots — elite actions constantly blocked; tuning too restrictive | < 10% of snapshots |
| **sniperUptime** | < 2% — snipers barely appear; personality never picks sniper | > 40% — oppressive; sniper personality or dive gating too weak | 5–20% |
| **cleanupDuration** | < 5% — cleanup personality never selected or too brief | > 40% — cleanup dominates; other personalities suppressed | 10–30% of snapshots |

### Quick Checks

- **avgPressure too low?** → check `pressureSmoothingIn` (raise) or `silenceOnDeathMs` (lower)
- **peakPressure spike?** → check `eliteOverlapWindows` — if low, overlap gating is failing; if high, gating works but pressure ceiling is too low
- **relief too frequent?** → check `pressureSmoothingOut` (lower) or `silenceOnDeathMs` (raise); relief needs time to matter
- **relief too rare?** → check that dives are clearing and bullets are ≤6 when pressure ≥ 0.70
- **silence too long?** → lower `silenceOnDeathMs` / `silenceOnWaveClearMs`
- **silence too short?** → raise `silenceOnDeathMs` / `silenceMaxMs`; enemies may be chain-spawning
- **elite overlap unfair?** → raise `eliteOverlapWindows` threshold by tightening personality caps or overlap pressure gate (0.82)
- **sniper uptime oppressive?** → raise sniper role cap, lower sniper personality weight, or tighten dive gating at high pressure
- **cleanup too slow/fast?** → adjust `reliefMult` in cleanup personality or change personality selection weights

---

## Example Run

```
## Run 1

- **Build/commit:** ed4a9a5
- **Level:** 3
- **Duration:** 45 snapshots (~45s)
- **Player result:** cleared
- **Perceived feel:** good pacing, slight empty gap after wave 2

### JSON Report
{"level":3,"timestamp":"2026-05-17T12:00:00.000Z","snapshots":45,"avgPressure":0.3124,"peakPressure":0.7821,"reliefCount":3,"silenceCount":8,"avgDensity":6.12,"eliteOverlapWindows":1,"sniperUptime":8.9,"cleanupDuration":5}

### Tuning Notes
- avgPressure (0.31) in healthy range for LV3
- peakPressure (0.78) fine — no ceiling spikes
- reliefCount (3 over 45s) healthy
- silenceCount (8) reasonable for 45s run with ~6-7 deaths + 1 wave clear
- sniperUptime (8.9%) noticeable but not oppressive
- cleanupDuration (5/45 = 11%) on low side — personality spread looks balanced
- No changes needed
```

---

## Manual Feel Audit

Play LV1 / LV2 / LV3 manually without capture. Record qualitative notes only. Use this as a cross-check against telemetry when hotkeys are unreliable.

### LV1 — Playtest

| Aspect | Note |
|---|---|
| **Empty moments** | `<none / rare / frequent — describe when>` |
| **Pressure spikes** | `<none / rare / frequent — describe when>` |
| **Sniper readability** | `<never saw / visible / oppressive>` |
| **Elite overlap** | `<never saw / fair / unfair — describe>` |
| **Cleanup breathing** | `<never felt / noticeable / too slow>` |
| **Lane usefulness** | `<ignored / used / essential>` |
| **Stagger visibility** | `<invisible / noticeable / jarring>` |
| **Overall feel** | `<1-line summary>` |

### LV2 — Playtest

| Aspect | Note |
|---|---|
| **Empty moments** | `<none / rare / frequent — describe when>` |
| **Pressure spikes** | `<none / rare / frequent — describe when>` |
| **Sniper readability** | `<never saw / visible / oppressive>` |
| **Elite overlap** | `<never saw / fair / unfair — describe>` |
| **Cleanup breathing** | `<never felt / noticeable / too slow>` |
| **Lane usefulness** | `<ignored / used / essential>` |
| **Stagger visibility** | `<invisible / noticeable / jarring>` |
| **Overall feel** | `<1-line summary>` |

### LV3 — Playtest

| Aspect | Note |
|---|---|
| **Empty moments** | `<none / rare / frequent — describe when>` |
| **Pressure spikes** | `<none / rare / frequent — describe when>` |
| **Sniper readability** | `<never saw / visible / oppressive>` |
| **Elite overlap** | `<never saw / fair / unfair — describe>` |
| **Cleanup breathing** | `<never felt / noticeable / too slow>` |
| **Lane usefulness** | `<ignored / used / essential>` |
| **Stagger visibility** | `<invisible / noticeable / jarring>` |
| **Overall feel** | `<1-line summary>` |

### Cross-Level Patterns

```
<Any recurring issues across levels: e.g. "silence too long at all levels", "snipers never appear", etc.>
```
