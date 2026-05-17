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

---

## HC-153 — Post-Tuning Telemetry (after HC-152)

**Build:** f915231 (HC-152: relief threshold 0.70→0.62, reliefDecayMult 2.2→2.5, pressureSmoothingOut 0.040→0.045, sniper silenceMult 1.15→1.20, sniper staggerMult 1.12→1.08)

**Conditions:** HARDCORE / TOURNAMENT, Level 1, bot-driven (auto-fire + aim-assist). Lives at 99 to prevent CONTINUE interruptions. Press **U** to start, play until meaningful kills accumulate, press **I** to export, press **U** to stop.

**HC-151 baseline for comparison:**
| Run | avgPressure | peakPressure | reliefCount | silenceCount | avgDensity | sniperUptime |
|---|---|---|---|---|---|---|
| 3 (no kills) | 0.5131 | 0.5879 | 0 | 0 | 64 | 100% |
| 4 (kills) | 0.5587 | 0.66 | 0 | 31 | 64 | 100% |
| 5 (static) | 0.5359 | 0.5454 | 0 | 0 | 64 | 100% |

**Expected HC-153 shifts:**
- `reliefCount` should now be >0 when pressure crosses 0.62 with dives=0 and bullets≤6
- `avgPressure` should remain 0.45–0.60 (relief now pulls it down from peaks)
- `peakPressure` should stay below 0.75 (relief kicks in before ceiling)
- `silenceCount` should not spike drastically (silenceOnDeathMs unchanged)
- `sniperUptime` likely still ~100% (static formation snipers unaffected by wave personality tuning)
- `avgDensity` ~64 (unchanged spawn rates)

### Expected healthy ranges for HC-153:
| Metric | Expected Range | Concern if |
|---|---|---|
| avgPressure | 0.40–0.58 | < 0.35 (overcorrected) or > 0.62 (relief still not triggering) |
| peakPressure | 0.58–0.72 | > 0.78 (relief lagging) |
| reliefCount | > 0 in runs with kills | 0 in all runs (threshold still too high) |
| silenceCount | similar to HC-151 per kill count | doubling vs HC-151 (unexpected side effect) |
| avgDensity | ~64 | significant deviation (side effect) |

---

### Run 6

- **Build/commit:** `f915231`
- **Level:** `<level>`
- **Duration:** `<snapshot count>`
- **Player result:** `<cleared / died / game over>`
- **Perceived feel:** `<subjective>`

#### JSON Report
```json
<replace with console output>
```

#### Tuning Notes
- `<observations>`

---

### Run 7

- **Build/commit:** `f915231`
- **Level:** `<level>`
- **Duration:** `<snapshot count>`
- **Player result:** `<cleared / died / game over>`
- **Perceived feel:** `<subjective>`

#### JSON Report
```json
<replace with console output>
```

#### Tuning Notes
- `<observations>`

---

### Run 8

- **Build/commit:** `f915231`
- **Level:** `<level>`
- **Duration:** `<snapshot count>`
- **Player result:** `<cleared / died / game over>`
- **Perceived feel:** `<subjective>`

#### JSON Report
```json
<replace with console output>
```

#### Tuning Notes
- `<observations>`

---

### HC-153 Cross-Run Summary

| Run | snapshots | avgPressure | peakPressure | silenceCount | reliefCount | avgDensity | sniperUptime |
|---|---|---|---|---|---|---|---|
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |

### Key Findings
1. `<relief activation check>`
2. `<pressure range vs target>`
3. `<sniper feel check>`
4. `<density check>`

---

## HC-156 — Relief Gate Verification (after HC-155)

**Build:** ae28a6e (HC-155: reliefMaxBullets default 6 → config override 24)

**Conditions:** HARDCORE / TOURNAMENT, Level 1. Press **U** to capture, **I** to export.

**HC-155 change:** Bullet gate raised from 6 to 24. LV1 normal formation has ~25 bullets; kills should dip below 24 periodically, allowing relief to activate.

**Expected:**
- `reliefCount` should now be >0 in runs with kills
- `reliefBlockedReasons.bullets` should appear less frequently than in HC-154 audit
- `avgPressure` should remain 0.40–0.58 (relief pulls it down from peaks)
- `peakPressure` should stay < 0.75
- `silenceCount` unchanged (gate is per-frame, silence is kill-driven)

### Run 9

- **Build/commit:** `ae28a6e`
- **Level:** `<level>`
- **Duration:** `<snapshot count>`
- **Player result:** `<cleared / died / game over>`
- **Perceived feel:** `<subjective>`

#### JSON Report
```json
<replace>
```

#### Tuning Notes
- `<observations>`

---

### Run 10

- **Build/commit:** `ae28a6e`
- **Level:** `<level>`
- **Duration:** `<snapshot count>`
- **Player result:** `<cleared / died / game over>`
- **Perceived feel:** `<subjective>`

#### JSON Report
```json
<replace>
```

#### Tuning Notes
- `<observations>`

---

### HC-156 Cross-Run Summary

| Run | snapshots | avgPressure | peakPressure | silenceCount | reliefCount | avgDensity | reliefBlockedReasons |
|---|---|---|---|---|---|---|---|
| 9 | | | | | | | |
| 10 | | | | | | | |

### Findings
1. `reliefCount > 0?` `<yes / no>`
2. `reliefBlockedReasons shift?` `<bullets decreased? new blocker emerged?>`
3. `pressure stable?` `<avgPressure range>`
4. `peak safe?` `<peakPressure value>`
