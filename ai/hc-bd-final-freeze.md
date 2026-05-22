# HC-BD Final Freeze — Hardcore Boss Director Runtime Layer

**Block:** HC-BD (complete)  
**Status:** FROZEN  
**Date:** 2026-05-22  
**Freeze Commit:** bf280de  
**Covered Sprints:** HC-BD-01 through HC-BD-14  
**Dependencies:** HC-RD (readability), HC-HB (hitbox), HC-PD (pattern debug), HC-WC (wave composer)

---

## A. Full System Overview

### Architecture Summary

The Hardcore Boss Director (HC-BD) is a flag-gated, intent-driven runtime layer that sits on top of the existing boss system. It does NOT replace boss behavior — it adds optional signature attacks that fire alongside normal patterns when authorized by config flags, boss profiles, fairness rhythm, and phase state.

```
┌─────────────────────────────────────────────────────┐
│                    CONFIG LAYER                      │
│  game-config.js → hardcore-config.js → getters      │
│  enableBossDirector, enableBossSignatureIntents,    │
│  enable{Crabtron,Serpentrix,Orbital,Teniente,       │
│         Emperador}SignatureHook                      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                 BOSS DIRECTOR (boss-director.js)     │
│  Profiles → Phases → Transitions → Recovery         │
│  → Signature Readiness → Signature Intents          │
│  → shouldApplyBossSignatureIntent()                 │
└────────────────────┬────────────────────────────────┘
                     │ intent consumed
┌────────────────────▼────────────────────────────────┐
│                 HOOK LAYER (update-boss.js)          │
│  try{Boss}SignatureHook() → creates state           │
│  update{Boss}Signature{State}() → timer + fire      │
└────────────────────┬────────────────────────────────┘
                     │ telegraph state
┌────────────────────▼────────────────────────────────┐
│                RENDER LAYER (draw.js)                │
│  draw{Boss}Signature{State}Telegraph() → visual     │
└─────────────────────────────────────────────────────┘
```

### Runtime Flow

```
Frame tick
  │
  ├─ updateBossStep(dt)
  │    ├─ updateBossDirectorState(boss)     ← passive read
  │    ├─ update{Serpentrix,Orbital,...}()  ← deferred timers
  │    └─ updateBossPhase()                 ← phase transitions
  │
  ├─ boss fire section (when shootTimer > shootRate)
  │    ├─ tryCrabtronSignatureHook(boss)    ← instant fire
  │    ├─ trySerpentrixSignatureHook(boss)  ← creates delayed state
  │    ├─ tryOrbitalSignatureHook(boss)
  │    ├─ tryTenienteSignatureHook(boss)
  │    ├─ tryEmperadorSignatureHook(boss)
  │    └─ switch(boss.pattern) { ... }      ← normal attack patterns
  │
  └─ render
       ├─ draw{Boss}Signature{State}Telegraph(ctx)  ← PRIORITY_TELEGRAPH
       └─ ... (other rendering)
```

### State Machine Flow

```
IDLE ──[intent created + readiness ok]──▶ ACTIVE
                                              │
                                    ┌─────────▼─────────┐
                                    │ try{Boss}Hook()    │
                                    │ creates state      │
                                    │ consumes intent    │
                                    └────────┬──────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │ update{Boss}State(dt)        │
                              │ each frame: timer += dt       │
                              │ when timer >= delayMs:        │
                              │   fire bullets + null state   │
                              └──────────────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
               COMPLETED       BOSS DIED         PATTERN
              (fired+null)  (state cleared     CHANGED
                              by HC-BD-13)   (cleared by
                                              HC-BD-13)
```

### Intent Lifecycle

```
1. Boss Director evaluates readiness (phase, recovery, fairness)
2. If ready: createSignatureIntent(bossKey, candidate, phaseSlot)
3. Intent stored: { active, bossKey, candidate, createdAt, expiresAt, consumed: false }
4. Hook checks via shouldApplyBossSignatureIntent():
   a. Director enabled?
   b. Intents enabled?
   c. Director active?
   d. Intent active?
   e. Intent not consumed?
   f. Boss key matches?
   g. Candidate matches?
   h. Hook flag enabled?
   i. Not in transition?
   j. Not in recovery?
   k. Fairness >= 0.35?
5. If all pass: intent consumed with reason, hook fires
6. If any fail: intent remains active, expires naturally
7. Cleanup: consumeBossSignatureIntent('applied') marks consumed
```

### Hook Lifecycle

**Instant hooks (CRABTRON):**
```
try*() → validate → fire bullets → consume intent → return true
No deferred state. No telegraph.
```

**Delayed hooks (SERPENTRIX, ORBITAL, TENIENTE, EMPERADOR):**
```
try*() → validate → create state{active,timer,delayMs,...} → consume intent → return true
  ↓
update*() → timer += dt → if timer >= delayMs: fire bullets + null state
  ↓
draw*() → if state.active: render telegraph with increasing alpha
  ↓
Cleanup on boss death: HC-BD-13 boss pattern match guard clears state
```

---

## B. Boss-by-Boss Breakdown

### CRABTRON — Boss 1
| Field | Value |
|-------|-------|
| **Archetype** | DUELIST |
| **Pattern** | crossfire |
| **Signature** | pincerFire |
| **Hook type** | Instant fire (0ms delay) |
| **Telegraph style** | None — relies on existing dash warning |
| **Bullet count** | 4 (2 left claw + 2 right claw) |
| **Speed** | 3.0 |
| **Angles** | ~110° left, ~70° right, ±0.12 rad spread |
| **Fairness behavior** | Blocked during dashMode, transition, recovery |
| **Readability** | Two distinct origins (claws), wide angular spread |
| **Known limitations** | No dedicated telegraph |
| **Freeze verdict** | ✅ FROZEN |

### SERPENTRIX — Boss 2
| Field | Value |
|-------|-------|
| **Archetype** | SWEEPER |
| **Pattern** | zigzag |
| **Signature** | delayedTrap |
| **Hook type** | Deferred fire (380ms delay) |
| **Telegraph style** | Green pulse rings (#44dd44) + direction arrows, alpha 0.18→0.50 |
| **Bullet count** | 2 (1 left + 1 right ground marker) |
| **Speed** | 2.6 |
| **Angles** | ~106° left, ~74° right |
| **Fairness behavior** | Blocked during transition, recovery, fairness < 0.35 |
| **Readability** | Green distinct, isolated points, direction indicators |
| **Known limitations** | Only 2 bullets — fire-and-forget trap |
| **Freeze verdict** | ✅ FROZEN |

### ORBITAL — Boss 3
| Field | Value |
|-------|-------|
| **Archetype** | ORBITAL |
| **Pattern** | rotate |
| **Signature** | orbitalPressure |
| **Hook type** | Deferred fire (420ms delay) |
| **Telegraph style** | Blue ring (#4488ff) + 4 dots + direction lines, alpha 0.15→0.45 |
| **Bullet count** | 4 equally spaced on rotating ring |
| **Speed** | 2.6 |
| **Angles** | Equal spacing + continuous rotation during delay |
| **Fairness behavior** | Blocked during transition, recovery, fairness < 0.35 |
| **Readability** | Blue ring + rotating markers show threat spread direction |
| **Known limitations** | Rotation introduces slight frame-timing variance (safe) |
| **Freeze verdict** | ✅ FROZEN |

### TENIENTE — Boss 4
| Field | Value |
|-------|-------|
| **Archetype** | HUNTER |
| **Pattern** | divebomb |
| **Signature** | laserSweep |
| **Hook type** | Deferred fire (480ms delay) |
| **Telegraph style** | Dashed orange line (#ff6633) + 3 pulsing dots, alpha 0.14→0.42 |
| **Bullet count** | 3 along diagonal sweep |
| **Speed** | 2.9 (±0.2 random spread) |
| **Angle** | ~70° diagonal down-right |
| **Fairness behavior** | Blocked during transition, recovery, fairness < 0.35 |
| **Readability** | Dashed line + dots show sweep path clearly |
| **Known limitations** | ±0.2 speed jitter (readability-positive, minor nondeterminism) |
| **Freeze verdict** | ✅ FROZEN |

### EMPERADOR — Boss 5
| Field | Value |
|-------|-------|
| **Archetype** | EXECUTIONER |
| **Pattern** | supreme |
| **Signature** | phaseBurst |
| **Hook type** | Deferred fire (500ms delay) |
| **Telegraph style** | Red ring (#ff3333) + gold ring (#ffaa00) + 5 direction markers, alpha 0.15→0.45 |
| **Bullet count** | 5 radial fan |
| **Speed** | 2.6 (edges) → 3.1 (center) gradient |
| **Angles** | 60°, 80°, 90°, 100°, 120° |
| **Fairness behavior** | Blocked during transition, recovery, fairness < 0.35 |
| **Readability** | Red/gold imperial colors, 5 clear direction arrows, pulsing dots |
| **Known limitations** | Fan overlap at close range (boss positioned high, safe) |
| **Freeze verdict** | ✅ FROZEN |

---

## C. Runtime Architecture Map

### boss-director.js
**2,983 lines — IIFE scoped, window-exported functions only**

| Responsibility | Functions | Lines |
|---|---|---|
| Boss profiles (5 runtime + 1 fallback) | `BOSS_DIRECTOR_PROFILES` | 910–1260 |
| Profile helpers | `getBossDirectorProfile()`, `getBossArchetype()` | 1268–1380 |
| Phase orchestration | `updateBossDirectorState()` | 1765+ |
| Transition choreography | `startBossTransition()`, `updateBossTransition()` | 2200+ |
| Recovery windows | `startBossRecoveryWindow()`, `updateBossRecoveryWindow()` | 2600+ |
| Signature readiness | `evaluateBossSignatureReadiness()`, `createBossSignatureIntent()` | ~2000 |
| Signature intents | `getBossSignatureIntent()`, `consumeBossSignatureIntent()` | ~2280 |
| Intent validation | `shouldApplyBossSignatureIntent()` | 2333–2402 |
| Fairness rhythm | `getBossFairnessRhythmScore()` | ~2700 |
| Rage/finale detection | Phase-based HP thresholds | ~2500 |

**Exports (window):**
- `getBossDirectorProfile`, `getBossArchetype`, `getBossTransitionProfile`, `getBossRecoveryProfile`, `getBossSignaturePlan`
- `getBossDirectorState`, `hasBossSignatureIntent`, `getBossSignatureIntent`, `consumeBossSignatureIntent`, `shouldApplyBossSignatureIntent`
- `getBossTransitionState`, `getBossRecoveryState`, `getBossFairnessRhythmScore`
- `startBossDirectorForBoss`, `updateBossDirectorState`
- `startBossTransition`, `updateBossTransition`
- `startBossRecoveryWindow`, `updateBossRecoveryWindow`
- `validateBossDirectorProfile`, `validateAllBossDirectorProfiles`

### update-boss.js
**~1,660 lines — global scope, all functions accessible**

| Responsibility | Functions | Lines |
|---|---|---|
| CRABTRON hook | `tryCrabtronSignatureHook()` | 291–325 |
| SERPENTRIX hook | `trySerpentrixSignatureHook()`, `updateSerpentrixSignatureTrap()`, `drawSerpentrixSignatureTrapTelegraph()` | 333–444 |
| ORBITAL hook | `tryOrbitalSignatureHook()`, `updateOrbitalSignatureRing()`, `drawOrbitalSignatureRingTelegraph()` | 453–560 |
| TENIENTE hook | `tryTenienteSignatureHook()`, `updateTenienteSignatureSweep()`, `drawTenienteSignatureSweepTelegraph()` | 569–688 |
| EMPERADOR hook | `tryEmperadorSignatureHook()`, `updateEmperadorSignatureBurst()`, `drawEmperadorSignatureBurstTelegraph()` | 691–810 |
| Hook dispatch | In `updateBossStep()` and fire section | 840–850, 1393–1420 |

**State variables:**
- `serpentrixSignatureTrap` — `{ active, timer, delayMs, bossKey, points[] }`
- `orbitalSignatureRing` — `{ active, timer, delayMs, bossKey, cx, cy, radius, rotation, bulletCount }`
- `tenienteSignatureSweep` — `{ active, timer, delayMs, bossKey, originX, originY, angle, laneWidth, bulletCount, bulletSpacing }`
- `emperadorSignatureBurst` — `{ active, timer, delayMs, bossKey, originX, originY, angles[], bulletCount }`

### draw.js
**~6,200 lines — all draw functions**

| Responsibility | Functions |
|---|---|
| Telegraph rendering | `drawSerpentrixSignatureTrapTelegraph(ctx)` |
| | `drawOrbitalSignatureRingTelegraph(ctx)` |
| | `drawTenienteSignatureSweepTelegraph(ctx)` |
| | `drawEmperadorSignatureBurstTelegraph(ctx)` |
| Dispatch | In `PRIORITY_TELEGRAPH` section, above phase transition FX |

### Config Flow

```
GALAXY_CONFIG (game-config.js)
  └─ bossDirector: { enableBossDirector, ..., enableEmperadorSignatureHook, ... }
       │
       ├─ getBossDirectorConfig() (hardcore-config.js)
       │    └─ reads with defaults → returns flat object
       │
       └─ shouldApplyBossSignatureIntent() (boss-director.js)
            └─ reads cfg.enable{N}Hook via hookFlagsByBoss map
```

### Intent Flow

```
1. updateBossDirectorState(boss) ← called each frame from updateBossStep
2. If boss is in a signature-ready phase:
   - evaluateBossSignatureReadiness()
   - createBossSignatureIntent(bossKey, candidate, phaseSlot)
   - intent stored with expiry
3. On boss fire cycle:
   - try{Boss}SignatureHook(boss)
   - calls shouldApplyBossSignatureIntent(boss, bossKey, candidate)
   - if valid: creates hook state, consumes intent
   - else: returns false, normal pattern fires
4. Intent expires after lifetime or is consumed
```

### Cleanup Flow

```
Normal completion:
  update*() → timer >= delayMs → fire bullets → null state ✅

Boss death mid-delay:
  1. Boss HP → 0 (update-enemies.js)
  2. boss.active = false
  3. updateBossStep → if (!boss.active) return (timers frozen)
  4. Level transition / victory screen
  5. New boss spawns: boss.active = true, boss.pattern = newPattern
  6. HC-BD-13: update*() checks boss.pattern !== state.bossKey → null ✅

Bullet array missing:
  All try*() + update*() check typeof enemyBullets && Array.isArray()
  → return false / null on failure ✅

Config disabled:
  try*() checks shouldApplyBossSignatureIntent() which fails fast
  → returns false, no state created ✅
```

---

## D. Freeze Perimeter

### Files Inside Freeze

| File | Lines | Role | Stability |
|------|-------|------|-----------|
| `www/boss-director.js` | 2,983 | Profiles, intents, validation, transitions, recovery, fairness | ⚡ DO NOT TOUCH |
| `www/update-boss.js` | ~1,660 | Hook implementations, timers, bullet spawning | ⚡ DO NOT TOUCH |
| `www/draw.js` | ~6,200 | Telegraph rendering dispatch | ⚡ DO NOT TOUCH |
| `www/game-config.js` | 617 | Flag declarations | 🔒 Freeze — add flags only with care |
| `www/hardcore-config.js` | 753 | Flag getters | 🔒 Freeze — mirror game-config.js |
| `ai/hc-bd-*.md` | — | Documentation | 📄 Reference only |

### What Can Be Modified Later

| Zone | How |
|------|-----|
| `game-config.js` + `hardcore-config.js` | Add new `enable*Hook` flags for future bosses only — follow existing naming convention |
| `boss-director.js` | Add new boss profiles to `BOSS_DIRECTOR_PROFILES` — never modify existing ones |
| `boss-director.js` `hookFlagsByBoss` | Add new pattern → flag mappings only |
| `update-boss.js` | Add new `try*()`, `update*()`, `draw*()` function triplets for future bosses — follow existing patterns |
| `draw.js` | Add new telegraph dispatch lines in `PRIORITY_TELEGRAPH` section only |

### What Must Remain Stable

| Zone | Why |
|------|-----|
| `shouldApplyBossSignatureIntent()` signature | All hooks depend on it |
| `consumeBossSignatureIntent()` | Intent lifecycle integrity |
| State object shapes (`bossKey`, `active`, `timer`, `delayMs`) | All update* and draw* depend on these fields |
| `updateBossStep()` hook dispatch order | `update*()` calls must run before `updateBossPhase()` |
| Fire section hook order | `try*()` hooks must run before `switch(boss.pattern)` |
| Telegraph dispatch position | Must remain in `PRIORITY_TELEGRAPH` section |

### Dangerous Coupling Points

| Coupling | Risk |
|----------|------|
| `try*()` depends on `window.shouldApplyBossSignatureIntent` | If renamed/removed, all hooks break |
| `try*()` depends on `window.consumeBossSignatureIntent` | If renamed/removed, intents won't be consumed |
| `update*()` depends on global `boss` variable | If `boss` is restructured, pattern checks fail |
| `update*()` depends on global `enemyBullets` array | If renamed/removed, all hooks crash |
| `draw*()` called from `draw.js` dispatch block | If dispatch moved, telegraphs disappear |
| All hooks depend on config flags in `getBossDirectorConfig()` | If flags renamed/removed, hook gating breaks |

---

## E. Known Deferred Systems

The following are intentionally NOT part of HC-BD v1 (frozen):

| System | Reason | Future Block |
|--------|--------|-------------|
| Multi-signature boss choreography | Single signature per boss sufficient for v0 | HC-BD-20+ |
| Dynamic rage signature escalation | Rage handled by phase detection, not signature switching | HC-BD-30+ |
| Adaptive signatures (player skill tracking) | Requires player analytics — separate system | HC-BD-30+ |
| Boss synchronization (2+ bosses) | Game currently single-boss per level | HC-BD-40+ |
| Cinematic transition sequences | Separate from signature system — HC-RD territory | HC-BD-20 |
| Signature telemetry dashboard | Debug data exists; UI not needed yet | HC-BD-50+ |
| Replay-safe determinism audit | Rotation and jitter minor — not critical for v0 | HC-BD-50+ |
| Boss director → wave composer coordination | Deliberately decoupled; bridge later | HC-BD-60+ |
| Hardcore mode toggle (enable all hooks) | Each hook individually gated for safety | HC-BD-25+ |
| Per-boss cooldown tuning | Cooldowns inherited from intent expiry — sufficient | Post-v1 |

---

## F. Future Roadmap (DOCUMENT ONLY)

### HC-BD-20: Cinematic Transition Layer
- Upgrade phase transitions with boss-specific animations
- Integrate with HC-RD readability system
- Boss director → draw.js bridge for transition FX

### HC-BD-30: Adaptive Orchestration
- Dynamic signature selection based on player performance
- Rage escalation with multi-signature chains
- Phase-aware signature variants

### HC-BD-40: Boss Coordination
- Multi-boss encounter support
- Signature interleaving between bosses
- Shared intent pool for coordinated attacks

### HC-BD-50: Replay-Safe Determinism
- Full determinism audit of all random sources
- Frame-locked rotation accumulation (ORBITAL)
- Seed-based jitter (TENIENTE)

### HC-BD-60: Wave Composer Integration
- Boss director communicates attack windows to wave composer
- Enemy waves pause during boss signatures
- Encounter-level orchestration

---

## G. Freeze Validation Section

### All Config Matrix Checks

```
Test                            Result
──────────────────────────────────────
enableBossDirector=false          ✅ No HC-BD runtime impact
enableBossSignatureIntents=false  ✅ No signature activation
enableCrabtronSignatureHook=false ✅ CRABTRON hook never fires
enableSerpentrixSignatureHook=false ✅ SERPENTRIX hook never fires
enableOrbitalSignatureHook=false  ✅ ORBITAL hook never fires
enableTenienteSignatureHook=false ✅ TENIENTE hook never fires
enableEmperadorSignatureHook=false ✅ EMPERADOR hook never fires
All false                         ✅ Identical to vanilla gameplay
Director+Intents+1 hook=true      ✅ Only that boss affected
All 5 hooks enabled               ✅ All 5 bosses functional
Mixed flags                       ✅ Per-boss isolation maintained
```

### All Cleanup Protections

```
Guard                           Status
──────────────────────────────────────
Boss active in try*()           ✅ All 5
Bullet array check in try*()    ✅ All 5
Bullet array check in update*() ✅ All 4 deferred
1 active state at a time        ✅ All 4 deferred (active flag check)
Boss pattern match in update*() ✅ All 4 deferred (HC-BD-13)
Intent consumed once            ✅ consumeBossSignatureIntent sets flag
Transition block                ✅ shouldApplyBossSignatureIntent
Recovery block                  ✅ shouldApplyBossSignatureIntent
State nulled after fire         ✅ All 4 deferred
State nulled on boss death      ✅ All 4 deferred (HC-BD-13)
State nulled on pattern change  ✅ All 4 deferred (HC-BD-13)
State nulled on array missing   ✅ All 4 deferred
```

### All Bullet Limits

```
Boss        Max  Type         Safe?
───────────────────────────────────
CRABTRON    4    Pincer       ✅
SERPENTRIX  2    Trap         ✅
ORBITAL     4    Ring         ✅
TENIENTE     3    Sweep       ✅
EMPERADOR    5    Fan         ✅
───────────────────────────────────
Total max   18   (cooldowns prevent simultaneous)
```

### All Fairness Protections

```
Protection                Where
──────────────────────────────────────
Transition active block   shouldApplyBossSignatureIntent (L2389-2392)
Recovery active block     shouldApplyBossSignatureIntent (L2394-2397)
Fairness < 0.35 block     shouldApplyBossSignatureIntent (L2399-2402)
Director disabled block   shouldApplyBossSignatureIntent (L2342-2344)
Intents disabled block    shouldApplyBossSignatureIntent (L2346-2348)
Hook flag disabled block  shouldApplyBossSignatureIntent (L2387-2391)
Intent consumed block     shouldApplyBossSignatureIntent (L2358-2360)
```

---

## H. Risk Classification

### SAFE (no action needed)
| System | Reason |
|--------|--------|
| CRABTRON pincerFire | Instant fire — no deferred state |
| SERPENTRIX delayedTrap | 2 bullets, 380ms, robust cleanup |
| ORBITAL orbitalPressure | 4 bullets, 420ms, rotating ring, robust cleanup |
| TENIENTE laserSweep | 3 bullets, 480ms, robust cleanup |
| EMPERADOR phaseBurst | 5 bullets, 500ms, robust cleanup |
| Config gates | All verified, per-boss isolation confirmed |
| Intent system | Create → validate → consume lifecycle solid |
| Fairness rhythm | Blocks all hooks below 0.35 threshold |
| Transition/recovery | Blocks all hooks during windows |

### MONITOR (non-critical, observe over time)
| System | Concern | Mitigation |
|--------|---------|------------|
| ORBITAL rotation | Frame-timing variance may produce slightly different bullet angles on different hardware | Continuous rotation per frame — same frame count → same result |
| TENIENTE jitter | ±0.2 random speed creates non-replayable variation | Readability-positive; optional seed-based jitter in HC-BD-50 |
| Intent expiry unused | Intents may be created but not consumed if hook disabled | Non-blocking — intents time out naturally |

### HIGH RISK (none currently)
| System | Status |
|--------|--------|
| — | No high-risk items in frozen layer |

---

## I. Final Freeze Verdict

### ✅ HC-BD RUNTIME LAYER — FROZEN

**The first complete Hardcore Boss Director generation is documented, stabilized, and frozen.**

**Criteria satisfied:**
- ✅ All 5 bosses have safe, flag-gated signature hooks
- ✅ All 5 hooks follow identical architecture (try → update → draw)
- ✅ Config gates fully verified (7 flags, per-boss isolation)
- ✅ Runtime safety hardened (HC-BD-13 orphan state fix)
- ✅ Fairness rhythm integrated (transition, recovery, threshold blocks)
- ✅ Readability standards met (distinct telegraphs, controlled alpha)
- ✅ Determinism safe (minor rotation/jitter variance, no impact)
- ✅ No gameplay regressions when all flags disabled
- ✅ No bullet pressure violations (max 18 combined, 5 per boss)

**Freeze perimeter:**
- `www/boss-director.js` (2,983 lines)
- `www/update-boss.js` (~1,660 lines)
- `www/draw.js` (~6,200 lines, telegraph section only)
- `www/game-config.js` (617 lines, bossDirector block)
- `www/hardcore-config.js` (753 lines, bossDirector section)
- `ai/hc-bd-*.md` (6 documentation files)

**To extend:** Add new `try*()`, `update*()`, `draw*()` triplets for new bosses following the frozen pattern. Add new flags and profile entries. Never modify existing hook implementations.

**This layer is now a stable foundation for future Hardcore Boss Director evolution.**
