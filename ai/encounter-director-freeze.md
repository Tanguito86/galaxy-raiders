# Encounter Director v1 — Freeze Document

**Status:** FROZEN (telemetry-validated)  
**Commit:** `69661d8` (HC-156 verify)  
**Branch:** master  
**Date:** 2026-05-17

---

## Scope

The Encounter Director controls:
- Pressure tracking (0–1 scale, smoothed per-frame)
- Silence windows (death-triggered, wave-clear, personality-biased decay)
- Spawn staggering (role-aware delays, configurable min/max)
- Role rotation (dive, sniper, kamikaze, tank, etc. with repetition caps)
- Wave personalities (balanced, swarm, sniper, pressure, cleanup, flanker)
- Pressure relief (accelerated decay when calm conditions met)
- Elite overlap gating (prevents sniper + kamikaze + diver stacking)
- Telemetry capture (U/I hotkeys, snapshot every 1s, full report)

---

## Validated Config (`www/game-config.js` EncounterDirector block)

| Key | Final Value | Default | Notes |
|---|---|---|---|
| `silenceOnDeathMs` | 400 | 420 | Slightly shorter, feel-driven |
| `earlySilenceOnDeathMs` | 300 | 320 | Levels ≤5 get shorter silences |
| `pressureSmoothingOut` | 0.045 | 0.035 | Faster pressure fall |
| `reliefThreshold` | 0.62 | 0.70 | Lower threshold, makes relief reachable |
| `reliefDecayMult` | 2.5 | 2.2 | Stronger pressure decay during relief |
| `reliefMaxBullets` | 24 | 6 | Raised from legacy 6 to match LV1 bullet counts |

All other keys use defaults (commented in config).

---

## Known Issues (Documented, Not Fixing Now)

### 1. Runtime Bridge (HC-150, RESOLVED)
`window.enemies`, `window.enemyBullets`, `window.level`, `window.globalTime` were undefined before HC-150 because `update-enemies.js` uses `let` scoping. Fixed via `syncEncounterDirectorGlobals()` called every frame.

### 2. Relief Bullet Gate (HC-154 → HC-155, RESOLVED)
Relief never activated because `bullets <= 6` gate was too strict for LV1 where formation maintains ~25 bullets. Made configurable as `reliefMaxBullets`, set to 24. HC-155 fix pending verification in HC-156 playtests.

### 3. Sniper Uptime 100% (OBSERVED, ACCEPTED)
Static formation `alien2` snipers in LV1 create permanent sniper presence. Wave personality tuning (HC-152) mitigates via longer silences during sniper waves, but static snipers are a level design concern, not director.

### 4. targetPressure Decay Behavior (OBSERVED, UNDERSTOOD)
`computeTargetPressure()` drives convergence toward a weighted average of alive enemies + bullets + dives + externals. In LV1, target sits around 0.56 (40 enemies + 25 bullets), creating a slow pressure ceiling. Relief now lowers this ceiling when activated.

---

## Telemetry Baseline (HC-151, pre-tuning)

| Run | avgPressure | peakPressure | reliefCount | avgDensity | sniperUptime |
|---|---|---|---|---|---|
| 3 (no kills) | 0.5131 | 0.5879 | 0 | 64 | 100% |
| 4 (kills) | 0.5587 | 0.66 | 0 | 64 | 100% |
| 5 (static) | 0.5359 | 0.5454 | 0 | 64 | 100% |

---

## Tuning Rules (Active)

- No new director systems
- No pacing rewrites
- No relief rewrites
- No HP/damage/fire rate/score/drop changes
- No boss/player movement changes
- No spawn rate changes
- Config tuning only via existing `getNumCfg`/`getIntCfg` keys

---

## What v1 Does NOT Cover (Out of Scope)

- Level-specific difficulty curves
- Boss encounter pacing
- Score system integration
- Visual/audio feedback for pressure/silence/relief states
- Wave personality weighting per level
- Dynamic spawn rate based on player performance
- Adaptive difficulty (rubber-banding)

---

## Next Focus Areas

1. Enemy archetype feel (alien2 sniper readability, alien5 kamikaze telegraphing)
2. Boss patterns and dispatch quality
3. Readability (bullet clarity, threat indicators, screen flow)
4. Pattern quality (formation spacing, lane design)
5. Score systems (chaining, multipliers, risk/reward integration)

---

## Files in Scope (Do Not Refactor These)

| File | Role |
|---|---|
| `www/encounter-director.js` | Core engine (DEFAULT_CONFIG, update, stagger, relief, telemetry) |
| `www/encounter-director-debug.js` | Debug overlay |
| `www/game-config.js` | User-facing config overrides |
| `www/update-enemies.js` | HC-150 runtime bridge |
| `www/entities.js` | Density multiplier, wave personality, level reset |
| `www/input-keyboard.js` | U/I telemetry hotkeys |
| `ai/telemetry-run-log.md` | Capture template and run history |
| `scripts/validate-galaxy.js` | Syntax validation |
