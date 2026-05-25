# HC-CLEANUP-05 — Boss Director Dead Code Audit

**Date:** 2026-05-25
**Status:** Audit-only — no code changes

---

## 1. File Overview

| Attribute | Value |
|-----------|-------|
| File | `www/boss-director.js` |
| Size | 2,985 lines |
| Load position | #44 of 76 (`index.html` line 150) |
| Pattern | IIFE, exports 91 functions to `window.*` |
| Declared features | HC-BD-01 through HC-BD-07 |
| Default state | **ALL 12 features disabled** |

---

## 2. Config Flags (from `hardcore-config.js`)

```javascript
bossDirector: {
  enableBossDirector:             false,  // ← Master kill switch
  enableBossTelemetry:            false,
  enableBossRecoveryRules:        false,
  enableBossFairnessValidation:   false,
  enableBossTransitions:          false,
  enableBossRageRules:            false,
  enableBossSignatureIntents:     false,
  enableCrabtronSignatureHook:    false,
  enableSerpentrixSignatureHook:  false,
  enableOrbitalSignatureHook:     false,
  enableTenienteSignatureHook:    false,
  enableEmperadorSignatureHook:   false
}
```

**`enableBossDirector: false`** is the master gate. Every boss-director function checks this first and returns a no-op result if disabled.

---

## 3. Features Inventory (12 features)

| # | Feature | HC Tag | Function Count | Description |
|---|---------|--------|---------------|-------------|
| 1 | Boss Director Foundation | HC-BD-01 | ~20 | `startBossDirectorForBoss`, `endBossDirector`, `updateBossDirectorState`, state management, main lifecycle |
| 2 | Boss Profile Mapping | HC-BD-02 | ~15 | `BOSS_ARCHETYPES`, `BOSS_DIRECTOR_PROFILES`, `resolveCurrentBossArchetype`, profile lookup |
| 3 | Phase Orchestration | HC-BD-03 | ~10 | `BOSS_PHASE_TYPES`, `resolveBossPhaseFromHP`, `isRagePhase`, `isRecoveryPhase`, phase machine |
| 4 | Transition Choreography | HC-BD-04 | ~8 | `BOSS_TRANSITION_TYPES`, `detectBossPhaseTransition`, `isBossTransitionActive`, animation hooks |
| 5 | Recovery Window | HC-BD-05 | ~8 | `BOSS_RECOVERY_TYPES`, `startBossRecoveryWindow`, `getBossRecoveryProgress01`, fairness rhythm |
| 6 | Signature Readiness | HC-BD-06 | ~10 | `evaluateBossSignatureReadiness`, `isBossSignatureReady`, `getBossSignatureBlockReason` |
| 7 | Signature Intent Hooks | HC-BD-07 | ~10 | `createBossSignatureIntent`, `consumeBossSignatureIntent`, `shouldApplyBossSignatureIntent` |
| 8 | Fairness Validation | — | ~5 | `getBossFairnessRhythmScore`, `getBossFairnessBias`, fairness guards |
| 9 | Rage Rules | — | ~5 | `isBossRageActive`, `isBossFinaleActive`, rage state hooks |
| 10 | Telemetry | — | ~5 | `recordBossDirectorEvent`, `getBossTelemetrySnapshot`, `clearBossTelemetry` |
| 11 | Orchestration Rules | — | ~5 | `BOSS_ORCHESTRATION_RULES`, `getOrchestrationRule`, pacing orchestration |
| 12 | Signature Slots | — | ~5 | `BOSS_SIGNATURE_SLOTS`, `resolveBossSignatureSlot`, slot allocation |

**Total exports:** 91 functions + 11 constants

---

## 4. Runtime Reference Analysis

### 4.1 Functions with actual callers (only 3 of 91)

| Function | Call Sites | Caller File | Guard |
|----------|-----------|-------------|-------|
| `shouldApplyBossSignatureIntent` | 5 | `update-boss.js` | `typeof !== 'function'` → return false |
| `consumeBossSignatureIntent` | 5 | `update-boss.js` | `typeof === 'function'` → call |
| `updateBossDirectorState` | 1 | `update-boss.js` | `typeof === 'function'` → call |

**All 3 always return early because `enableBossDirector: false`:**

```
shouldApplyBossSignatureIntent():
  → getBossDirectorConfig().enableBossDirector → false
  → returns {apply: false, reason: "director_disabled"}

consumeBossSignatureIntent():
  → isBossDirectorEnabled() → false
  → returns false immediately

updateBossDirectorState():
  → isBossDirectorEnabled() → false
  → returns immediately
```

### 4.2 Functions shadowed by local redefinitions

| boss-director.js export | Actually used version | Defined in |
|-------------------------|----------------------|------------|
| `window.isBossDirectorEnabled` | Local function (line 184) | `hardcore-config.js` |
| `window.getBossDirectorConfig` | Local function (line 166) | `hardcore-config.js` |
| `window.getHardcoreBossId` | Local function (line 1099) | `boss-patterns.js` |
| `window.GALAXY_CONFIG` | Local object (line 6) | `game-config.js` |

### 4.3 Functions with ZERO callers (88 of 91)

All other 88 exported functions have **zero references** from any other file:

- `startBossDirectorForBoss` — never called
- `endBossDirector` — never called
- `isBossRecoveryWindowActive` — never called
- `detectBossPhaseTransition` — never called
- `evaluateBossSignatureReadiness` — never called
- `getBossSignatureIntent` — never called
- `resolveBossPhaseFromHP` — never called
- ...and 81 more

---

## 5. Classification

| Category | Count | Functions |
|----------|-------|-----------|
| **DEAD** | 88 | All director lifecycle, profiles, phases, transitions, recovery, telemetry, orchestration, signature slots — zero callers |
| **DORMANT** | 3 | `shouldApplyBossSignatureIntent`, `consumeBossSignatureIntent`, `updateBossDirectorState` — have callers but always return early because master switch is `false` |
| **SHADOWED** | 4 | `isBossDirectorEnabled`, `getBossDirectorConfig`, `getHardcoreBossId`, `GALAXY_CONFIG` — locally redefined in other files |
| **LIVE** | 0 | Nothing in boss-director.js produces any runtime effect |

---

## 6. How the Game Actually Works (Without Boss Director)

Boss behavior is entirely handled by:
- **`update-boss.js`** (1,799 lines) — hardcoded state machine:
  - `bossState`: `'idle' → 'intro' → 'movement' → 'fire' → 'cooldown' → ...`
  - Pattern-specific movement: `updateBossZigzagMovement`, `updateBossRotateMovement`
  - Pattern-specific attacks: `fireBossOrbitalPattern`, `fireBossDivebombPattern`
  - Signature hooks: `tryCrabtronSignatureHook()` etc. (defined locally, not from boss-director)
- **`boss-patterns.js`** (1,172 lines) — individual boss pattern definitions
- **`hc-pattern-director.js`** (2,395 lines) — hardcore pattern orchestration (active, separate system)

The boss-director.js was designed to be an **abstraction layer above** these files — providing profiles, phases, transitions, and orchestration rules. But it was never wired into the runtime. The hardcoded state machine in `update-boss.js` runs the show.

---

## 7. The Signature Intent Chain (Why DORMANT, not LIVE)

The complete call chain when boss is fighting:

```
update-boss.js::updateBossStep()                    ← game loop
  ├── hardcoded movement/fire logic                 ← ALWAYS runs
  ├── updateBossDirectorState(boss)                 ← typeof guard → no-op (director disabled)
  └── tryCrabtronSignatureHook(boss)                ← typeof guard → runs locally
        ├── boss.pattern === 'crossfire'             ← CHECK
        └── window.shouldApplyBossSignatureIntent()  ← typeof guard → returns {apply:false}
              └── getBossDirectorConfig().enableBossDirector === false
                  └── returns {apply: false, reason: "director_disabled"}
                      └── tryCrabtronSignatureHook → returns false
                          └── BOSS FIGHTS WITH CLASSIC PATTERN (hardcoded)
```

**Result:** The boss ALWAYS fights with the classic pattern. The signature intent check is a no-op. The game behaves identically whether boss-director.js exists or not.

---

## 8. Impact Analysis

### If we delete boss-director.js today:

| Area | Impact |
|------|--------|
| Gameplay | **Zero** — classic boss patterns are hardcoded in update-boss.js |
| Bosses | **Zero** — all 5 bosses work via their hardcoded state machines |
| Performance | **Positive** — 2,985 fewer lines to parse, 91 fewer window properties |
| `typeof` guards | **Safe** — all 11 callers use `typeof === 'function'` guards |
| `npm run validate` | Would still pass |
| Runtime errors | **None** — all references are guarded |

### What we lose:

| Asset | Value |
|-------|-------|
| Boss archetype taxonomy (5 profiles with matrices) | Design reference |
| Phase orchestration state machine | Unused but well-structured |
| Transition choreography logic | Half-built |
| Signature intent system (7 intents) | Partially wired (3/7 have callers, all disabled) |
| Telemetry framework | Unused |
| Recovery/fairness rules | Conceptual only |

---

## 9. Recommendation: CONSERVE AS DOCUMENTATION + EXTRACT SIGNATURE INTENTS

### Option A — Keep as-is (recommended for now)
- The file is loaded but harmless (all features disabled, typeof guards)
- The taxonomy/profiles have permanent documentary value
- No urgency to delete

### Option B — Extract to `ai/` reference doc + delete from runtime
- Move `boss-director.js` to `ai/reference/boss-director-taxonomy.js` (documentation)
- Remove `<script src="boss-director.js">` from `index.html`
- All callers use `typeof` guards → no code changes needed
- Save ~6KB of parse time per page load
- **Risk: zero** — no runtime dependencies

### Option C — Reactivate by phases (future)
- HC-BD-07 (signature intents): wire `enableBossSignatureIntents: true`
- HC-BD-03 (phase orchestration): wire `enableBossDirector: true`
- This unlocks the 3 DORMANT functions and adds boss signature attacks
- **Risk: gameplay changes** — would need playtesting

---

## 10. Quick Wins (if pursuing Option B)

1. Move `www/boss-director.js` → `ai/reference/boss-director-taxonomy.js`
2. Remove `<script src="boss-director.js"></script>` from `index.html` (line 150)
3. Run `npm run validate`
4. No other changes needed — all callers use `typeof === 'function'` guards

**Rollback:**
```bash
git revert <commit>
```

---

## 11. Summary

| Metric | Value |
|--------|-------|
| Total lines | 2,985 |
| Exported functions | 91 |
| Functions with callers | 3 (all disabled via config) |
| Functions with ZERO callers | 88 |
| Shadowed by local redefinitions | 4 |
| LIVE features | **0** |
| Runtime effect | **Zero — complete no-op** |
| Parse cost | ~6KB per page load |
| Deletion risk | **Zero** (typeof guards on all callers) |

**Verdict:** Boss Director is a fully disabled, zero-effect, 2,985-line dead code block. It has documentary value (taxonomy, profiles) but no runtime function. Safe to delete or archive.
