# HC-BD-13 — Freeze Audit: HC-BD Signature Hook Layer

**Block:** HC-BD  
**Status:** Freeze Candidate  
**Date:** 2026-05-22  
**Dependency:** HC-BD-12 (EMPERADOR hook complete)

---

## Overview

Complete audit of all 5 signature hooks in the HC-BD layer. Verifies runtime safety, bullet pressure, readability, fairness, determinism, and freeze readiness.

---

## Per-Boss Hook Audit

### 1. CRABTRON — `pincerFire`

| Property | Value |
|----------|-------|
| Bullet count | 4 (2 left claw + 2 right claw) |
| Delay | 0ms (instant fire) |
| Speed | 3.0 |
| Firing point | 2 origins — left claw + right claw |
| Angles | ~110° left, ~70° right, ±0.12 rad spread |
| Hook trigger | `tryCrabtronSignatureHook(bossRef)` in fire section |
| Intent validation | `shouldApplyBossSignatureIntent(boss, 'crossfire', 'pincerFire')` |
| Dash safety | Blocks during `bossRef.dashMode` |
| Telegraph | No telegraph (instant fire) — relies on dash warning |
| Cleanup | Immediate — no deferred state |
| **Fairness** | ✅ Intent gate + dash block + fairness ≥ 0.35 |
| **Readability** | ✅ 2 distinct bullet sources, wide spread, no overlap |
| **Determinism** | ✅ No random — fixed angles, fixed speed |
| **Verdict** | ✅ FREEZE CANDIDATE |

### 2. SERPENTRIX — `delayedTrap`

| Property | Value |
|----------|-------|
| Bullet count | 2 (1 left + 1 right) |
| Delay | 380ms |
| Speed | 2.6 |
| Firing point | 2 static ground markers below boss |
| Angles | ~106° left, ~74° right |
| Deferred state | `serpentrixSignatureTrap` — timer, points array |
| Hook trigger | `trySerpentrixSignatureHook(bossRef)` |
| Update | `updateSerpentrixSignatureTrap(dt)` in `updateBossStep` |
| Telegraph | Green pulse rings (#44dd44) + direction arrows, alpha 0.18→0.50 |
| Cleanup | Nulled after fire + HC-BD-13 boss match guard |
| **Fairness** | ✅ Only 2 bullets, generous delay, intent gate, fairness ≥ 0.35 |
| **Readability** | ✅ Green color distinct, 2 isolated points, direction indicators |
| **Determinism** | ✅ Fixed positions, fixed angles, fixed delay |
| **Verdict** | ✅ FREEZE CANDIDATE |

### 3. ORBITAL — `orbitalPressure`

| Property | Value |
|----------|-------|
| Bullet count | 4 (equally spaced on ring) |
| Delay | 420ms |
| Speed | 2.6 |
| Firing point | Rotating ring (radius 34) around boss center |
| Angles | Equally spaced + continuous rotation during delay |
| Deferred state | `orbitalSignatureRing` — timer, rotation, bulletCount |
| Hook trigger | `tryOrbitalSignatureHook(bossRef)` |
| Update | `updateOrbitalSignatureRing(dt)` in `updateBossStep` |
| Telegraph | Blue ring (#4488ff) + 4 point dots + direction lines, alpha 0.15→0.45 |
| Cleanup | Nulled after fire + HC-BD-13 boss match guard |
| **Fairness** | ✅ 4 bullets on ring, visible rotation, intent gate, fairness ≥ 0.35 |
| **Readability** | ✅ Blue color distinct, rotating ring shows threat spread direction |
| **Determinism** | ✅ Bullet angles depend on accumulated rotation — variable but safe |
| **Verdict** | ✅ FREEZE CANDIDATE — rotation introduces slight nondeterminism but within safe threshold |

### 4. TENIENTE — `laserSweep`

| Property | Value |
|----------|-------|
| Bullet count | 3 (along diagonal sweep line) |
| Delay | 480ms |
| Speed | 2.9 (±0.2 random spread) |
| Firing point | Boss center + staggered positions along sweep line |
| Angle | ~70° diagonal down-right |
| Deferred state | `tenienteSignatureSweep` — timer, origin, angle, bulletSpacing |
| Hook trigger | `tryTenienteSignatureHook(bossRef)` |
| Update | `updateTenienteSignatureSweep(dt)` in `updateBossStep` |
| Telegraph | Dashed orange line (#ff6633) + 3 pulsing dots, alpha 0.14→0.42 |
| Cleanup | Nulled after fire + HC-BD-13 boss match guard |
| **Fairness** | ✅ 3 bullets, generous delay, intent gate, fairness ≥ 0.35 |
| **Readability** | ✅ Orange distinct, dashed line shows direction, dots show position |
| **Determinism** | ⚠️ Minor random on bullet speed (±0.2) — improves readability, safe |
| **Verdict** | ✅ FREEZE CANDIDATE |

### 5. EMPERADOR — `phaseBurst`

| Property | Value |
|----------|-------|
| Bullet count | 5 (radial fan) |
| Delay | 500ms |
| Speed | 2.6 (edges) → 3.1 (center) gradient |
| Firing point | Boss center |
| Angles | 60°, 80°, 90°, 100°, 120° |
| Deferred state | `emperadorSignatureBurst` — timer, origin, angles array |
| Hook trigger | `tryEmperadorSignatureHook(bossRef)` |
| Update | `updateEmperadorSignatureBurst(dt)` in `updateBossStep` |
| Telegraph | Red ring (#ff3333) + gold ring (#ffaa00) + 5 direction markers, alpha 0.15→0.45 |
| Cleanup | Nulled after fire + HC-BD-13 boss match guard |
| **Fairness** | ✅ 5 bullets, widest delay (500ms), intent gate, fairness ≥ 0.35 |
| **Readability** | ✅ Red/gold imperial colors, 5 clear direction arrows, pulsing dots |
| **Determinism** | ✅ Fixed angles, speed gradient is deterministic, no random |
| **Verdict** | ✅ FREEZE CANDIDATE |

---

## Config Gate Matrix

```
enableBossDirector=false              → no HC-BD runtime impact ✅
enableBossSignatureIntents=false      → no signature activation ✅
enableCrabtronSignatureHook=false     → CRABTRON never fires hook ✅
enableSerpentrixSignatureHook=false   → SERPENTRIX never fires hook ✅
enableOrbitalSignatureHook=false      → ORBITAL never fires hook ✅
enableTenienteSignatureHook=false     → TENIENTE never fires hook ✅
enableEmperadorSignatureHook=false    → EMPERADOR never fires hook ✅
```

All 6 individual flags default to `false`. All gates independently verified.

---

## Bullet Pressure Summary

| Boss | Max bullets | Type | Overlap risk | Curtain risk |
|------|------------|------|-------------|-------------|
| CRABTRON | 4 | Instant pincer | ❌ None | ❌ None |
| SERPENTRIX | 2 | Delayed trap | ❌ None | ❌ None |
| ORBITAL | 4 | Rotating ring | ❌ Very low | ❌ None |
| TENIENTE | 3 | Laser sweep | ❌ Low | ❌ None |
| EMPERADOR | 5 | Radial fan | ❌ Low (only at origin) | ❌ None |

**Total combined maximum** (if all fired simultaneously, which cooldowns prevent): 18 bullets. Safe.

---

## Runtime Safety Audit

### HC-BD-13 Hardening Fix Applied

**Issue:** Orphan deferred states after boss death. If a boss died with an active delayed signature state (serpentrix, orbital, teniente, emperador) and a new boss of a different type spawned, the lingering state would fire bullets at the old origin position.

**Fix:** Added `boss.pattern === state.bossKey` check to all 4 `update*()` functions. State is nulled and returns early if the current boss doesn't match.

### Safety Checklist

| Check | Status |
|-------|--------|
| No orphan states after boss death | ✅ HC-BD-13 fix |
| No stuck telegraphs after boss death | ✅ Scene clears on death |
| No lingering delayed traps across levels | ✅ HC-BD-13 fix |
| No infinite active rings/bursts | ✅ Timer + null on fire |
| No repeated intent consumption | ✅ `consumeBossSignatureIntent` sets consumed flag |
| No crash on boss death | ✅ All hooks check `bossRef.active` |
| No crash on level transition | ✅ `updateBossStep` returns early if `!boss.active` |
| No crash if bullets array missing | ✅ All hooks check array before push |
| No crash if player null | ✅ Hooks don't reference player |

---

## Fairness Rhythm Integration

| Guard | CRABTRON | SERPENTRIX | ORBITAL | TENIENTE | EMPERADOR |
|-------|----------|------------|---------|----------|-----------|
| Transition block | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recovery block | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fairness ≥ 0.35 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Director enabled | ✅ | ✅ | ✅ | ✅ | ✅ |
| Intents enabled | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pacing respects attack rate | ✅ | ✅ | ✅ | ✅ | ✅ |

All gates in `shouldApplyBossSignatureIntent()` in `www/boss-director.js`, lines 2333-2402.

---

## Architecture Stability

### Hook Layer Structure (proven pattern)

```
Config flags → Director intents → shouldApplyBossSignatureIntent → try*Hook → fire/state
                                                                              ↓
                                                                    update* → bullets + cleanup
                                                                              ↓
                                                                    draw*Telegraph → visual
```

All 5 hooks follow identical architecture:
1. **try*()** — validate + create state + consume intent
2. **update*()** — timer advance + fire bullets + cleanup
3. **draw*()** — telegraph rendering

### Systems Preserved

- HC-RD readability (no alpha violations)
- HC-HB hitbox system (no changes)
- HC-PD pattern debug (no changes)
- HC-WC wave composer (no impact)
- Encounter Director (hooks fire during boss phases, not waves)

---

## Remaining Weaknesses

| Weakness | Severity | Mitigation |
|----------|----------|------------|
| ORBITAL bullet angles depend on rotation accumulated during delay — non-replayable if frame timing varies | Low | Rotation is continuous and small per frame; end result is deterministically the same for same frame count |
| TENIENTE bullet speed has ±0.2 random jitter | Low | Improves readability, doesn't affect dodgeability |
| EMPERADOR fan origin overlap at close range | Low | Boss arena positioning puts Emperor high on screen; bullets fan out before reaching player |
| No explicit signature intent expiry telemetry | Low | Intents time out naturally; no crash, just unused |
| `try*Hooks` check `typeof enemyBullets` which depends on load order | Low | Bullet array guaranteed by game loop JS includes |

---

## Systems Intentionally Deferred

| System | Reason |
|--------|--------|
| HC-BD boss choreography (multi-signature chains) | Not needed; single-signature per boss sufficient for v0 |
| HC-BD encounter-level signature orchestration | Requires encounter director integration — future sprint |
| Signature cooldown per-boss tuning | Cooldowns inherited from intent expiry — adequate for v0 |
| Hitbox debugging overlays for signatures | Separate HC-HB system — non-breaking to add later |
| Wave composer—boss director coordination | Separated by design; no coupling needed yet |
| Signature randomness (speed jitter, pattern variants) | Only TENIENTE uses minor jitter — safe, readability-positive |

---

## Freeze Readiness Verdict

### ✅ ALL 5 HOOKS ARE FREEZE CANDIDATES

**Criteria met:**
- No orphan states (HC-BD-13 fix)
- No gameplay regressions
- No bullet curtains
- No fairness violations
- All config gates verified
- All safety guards present
- Clean runtime lifecycle
- Zero impact when all flags disabled
- Deterministic or determinism-safe
- Readability standards met (distinct colors, clear telegraphs, moderate alpha)

### Freeze Boundary

The following files constitute the HC-BD freeze perimeter:

```
www/boss-director.js       — profiles, intents, validation
www/update-boss.js         — hook implementations, timers, bullets
www/draw.js                — telegraph rendering
www/game-config.js         — flag declarations
www/hardcore-config.js     — flag getters
ai/hc-bd-freeze-audit.md   — this document
```

**Do not modify these files** in future sprints without:
1. Checking this freeze audit
2. Running the full test matrix
3. Updating this document

---

## Future Roadmap (post-freeze)

1. **HC-BD-14+**: Boss choreography layer — chain multiple signatures within a single boss fight
2. **HC-BD-20+**: Encounter director → boss director integration — wave-aware signature triggers
3. **HC-BD-25+**: Hardcore mode that enables all hooks by default with per-boss tuning
4. **HC-HB**: Hitbox debug overlays for signature attacks
5. **HC-RD**: Telegraph refinement pass (alpha tuning, color grading per background theme)
