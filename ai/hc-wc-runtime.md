# HC-WC-03 — Micro-Structure Runtime Documentation

> **Sprint**: HC-WC-03  
> **Date**: 2026-05-19  
> **Status**: Implemented  
> **Depends on**: HC-WC-01 (audit), HC-WC-02 (taxonomy)

---

## 1. ARCHITECTURE

### 1.1 Components

| File | Role |
|------|------|
| `www/hc-wave-composer.js` | Phase state machine, orchestration, gating, telemetry |
| `www/game-config.js` | `GALAXY_CONFIG.HC_WAVE_COMPOSER` config block |
| `www/entities.js` | Integration: `initWaveComposer()` call at end of `initEnemies()` |
| `www/update-enemies.js` | Integration: `updateWaveComposer(dt)` call + pattern gating |
| `www/index.html` | Script tag between `encounter-director-debug.js` and `hc-pattern-debug.js` |

### 1.2 Phase Flow

```
IDLE → INTRO → BUILD → PEAK → RESOLVE → RELIEF
  ↑                                              |
  └──────────────────────────────────────────────┘ (next wave)
```

### 1.3 Layer Position

```
[HUD / Player]
      ↑
[Enemy Patterns + Attacks] ← GATED by wave composer
      ↑
[HC Wave Composer] ← Phase orchestration
      ↑
[Encounter Director] ← Pressure, silence, relief (UNCHANGED)
      ↑
[HC Pattern Director] ← Threat budget audit (UNCHANGED)
      ↑
[Spawn Engine] ← Enemy creation (UNCHANGED)
```

---

## 2. PHASE DETAILS

### 2.1 INTRO Phase

| Property | Value |
|----------|-------|
| **Duration** | 1200ms (normal), 2000ms (setpiece) |
| **Enemy behavior** | Visible, NO attacks. `_wcIntroGated = true` on all enemies. |
| **Player task** | Read formation, identify lanes, plan movement. |
| **Telegraph** | Brief visual (600ms lead-in from `introVisualMs`). |
| **Transition out** | Timer expires → BUILD. |

### 2.2 BUILD Phase

| Property | Value |
|----------|-------|
| **Duration** | 4000ms (normal), 5000ms (setpiece) |
| **Enemy behavior** | Archetypes activate in staggered sequence. |
| **Activation order** | sweepers (t=0) → baiters (200ms) → suppressors (1500ms) → flankers (1800ms) → snipers (2800ms) → anchors (3500ms) → divers (4000ms) → chasers (4200ms) |
| **Player task** | Adapt as new threats activate. Learn threat layering. |
| **Transition out** | Timer expires AND >= PEAK threshold (40% enemies remain) → PEAK. |

### 2.3 PEAK Phase

| Property | Value |
|----------|-------|
| **Duration** | Until ≤40% enemies remain, max 8000ms. |
| **Enemy behavior** | All archetypes active. Full fire cadence. |
| **Caps** | Max 3 simultaneous patterns, max 30 bullets, 200ms inter-pattern gap. |
| **Player task** | Maximum tension. Multi-threat reading. |
| **Transition out** | ≤40% enemies remain OR timer >8000ms → RESOLVE. |

### 2.4 RESOLVE Phase

| Property | Value |
|----------|-------|
| **Duration** | Until all enemies dead. |
| **Enemy behavior** | Aggressive roles suspended: divers, snipers, suppressors, chasers stop. Sweepers + baiters remain. |
| **Player task** | Cleanup. Breathing room. |
| **Transition out** | All enemies dead → RELIEF. |

### 2.5 RELIEF Phase

| Property | Value |
|----------|-------|
| **Duration** | Brief (tagged). Encounter Director handles full silence. |
| **Enemy behavior** | No enemies alive. Silence window. |
| **Player task** | Rest. Power-up collection window. |
| **Transition out** | Next wave calls `initWaveComposer()` → IDLE. |

---

## 3. PATTERN GATING

### 3.1 Gate Conditions

Patterns are blocked when:
- **INTRO phase**: All enemies gated (`_wcIntroGated`).
- **BUILD phase**: Role not yet activated (`_roleActivationFired[role]` false).
- **RESOLVE phase**: Aggressive roles suspended.
- **RELIEF phase**: All enemies gated.
- **PEAK phase**: 
  - `_activePatternsThisFrame >= 3`
  - Inter-pattern gap < 200ms
  - Bullet count > 30

### 3.2 Gated Archetypes

| Archetype | Fire function gated | File | Lines modified |
|-----------|-------------------|------|---------------|
| Generic shooter | `pushEnemyBullet` in main block | `update-enemies.js` | ~938 |
| Sniper (alien2) | `fireHardcoreSniperShot` | `update-enemies.js` | ~1040 |
| Suppressor (alien4) | `fireHardcoreSuppressorBurst` | `update-enemies.js` | ~968 |
| Chaser (alien5) | `fireHardcoreChaserBurst` + `_fireChaserTelegraphSideShots` | `update-enemies.js` | ~1006, ~1027 |
| Sweeper (alien1) | `fireHardcoreSweeperFan` | `update-enemies.js` | ~1103 |
| Flanker (alien6) | `fireHardcoreFlankerCrossfire` | `update-enemies.js` | ~1117 |
| Baiter (alien_mini) | `fireHardcoreBaiterBurst` | `update-enemies.js` | ~1139 |
| External shmup | External enemy fire | `update-enemies.js` | ~597 |

---

## 4. PUBLIC API

### 4.1 Core Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `initWaveComposer()` | `() → void` | Initialize wave phase state. Called from `initEnemies()`. |
| `updateWaveComposer(dt)` | `(number) → void` | Drive phase state machine. Called from `updateEnemiesAndProjectiles()`. |
| `shouldGateWaveComposerPattern(enemy)` | `(object) → boolean` | Gate enemy pattern fire based on current phase. |
| `registerWaveComposerPatternFire()` | `() → void` | Track pattern fire for peak phase limits. |

### 4.2 State Accessors

| Function | Returns | Description |
|----------|---------|-------------|
| `getWaveComposerState()` | `object` | Full composer state (phase, timer, intensity, etc.) |
| `getWaveComposerPhase()` | `string` | Current phase name. |
| `getWaveComposerIntensity()` | `number` | Current intensity (0-1). |
| `isWaveComposerReliefActive()` | `boolean` | Relief phase active? |
| `getWaveComposerSnapshot()` | `object` | Combined composer + director snapshot. |

### 4.3 Debug / Emergency

| Function | Description |
|----------|-------------|
| `printWaveComposerState()` | Console dump of full state. |
| `forceWaveComposerPhase(phase)` | Force transition to any phase (debug). |
| `forceWaveComposerRelief()` | Force entry into relief. |

---

## 5. CONFIG REFERENCE

```js
GALAXY_CONFIG.HC_WAVE_COMPOSER = {
  enabled: true,
  phaseDurations: {
    INTRO:   { normal: 1200, setpiece: 2000 },  // ms
    BUILD:   { normal: 4000, setpiece: 5000 },  // ms
    PEAK:    { threshold: 0.40, minDuration: 3000 },  // 40% alive, min 3s
    RESOLVE: { threshold: 0.40, maxDuration: 8000 },
    RELIEF:  { afterClear: 900, maxContinuous: 3000 }
  },
  buildTiming: {
    sweeperDelay: 0, baiterDelay: 200,
    suppressorDelay: 1500, flankerDelay: 1800,
    sniperDelay: 2800, anchorDelay: 3500,
    diverDelay: 4000, chaserDelay: 4200
  },
  peakLimits: {
    maxSimultaneousPatterns: 3,
    maxBullets: 30,
    interPatternGapMs: 200,
    diveWaveGapMs: 2500
  },
  resolveTiming: {
    diverSuspend: true, sniperSuspend: true,
    suppressorSuspend: true, chaserSuspend: true
  },
  telegraphLeadIn: {
    introVisualMs: 600,
    phaseTransitionFlash: 200,
    ambushWarningMs: 400
  }
};
```

---

## 6. COMPATIBILITY

### 6.1 Systems Preserved

| System | Status | Notes |
|--------|--------|-------|
| Encounter Director | UNCHANGED | Pressure, silence, relief all computed independently. |
| HC Pattern Director | UNCHANGED | Advisory gating still runs. Wave composer is additional layer. |
| HC Hitbox Fairness | UNCHANGED | Bullet validation runs per bullet. |
| Boss fights | BYPASSED | `_shouldSkipComposer()` returns true during boss. |
| Set pieces | PARTIALLY BYPASSED | Skipped during intro timer. After intro, composer manages phases. |
| UFO system | UNCHANGED | UFO spawning independent of composer. |
| Power-up system | UNCHANGED | Spawn/collection unchanged. |
| Progression system | UNCHANGED | Level start, wave transition, rewards unchanged. |

### 6.2 Softlock Prevention

| Risk | Prevention |
|------|------------|
| Phase never transitions | IDLE → INTRO guaranteed on first `updateWaveComposer` call. INTRO → BUILD on timer. BUILD → PEAK on timer + threshold. PEAK → RESOLVE when enemies die. RESOLVE when enemies dead. |
| RELIEF stuck forever | Relief ends when next wave calls `initWaveComposer()`. Transitions reset to IDLE. |
| Pattern gate prevents all fire | In PEAK phase, if `_activePatternsThisFrame >= 3`, next frame it resets to 0. Each frame is a new chance. |
| Build activation queue stuck | Queue is processed every frame. Each role activates once. Roles without enemies are skipped. |

### 6.3 Escape Lanes

Escape lanes are preserved because the composer gates attacks, not spawns. Formation layout is unchanged. The INTRO phase gives the player time to identify lanes before any fire begins.

---

## 7. TELEMETRY

### 7.1 Snapshot Fields

Added via `getWaveComposerSnapshot()`:

| Field | Type | Description |
|-------|------|-------------|
| `phase` | string | Current wave phase |
| `phaseTimer` | number | Milliseconds in current phase |
| `intensity` | number | Computed intensity (0-1) |
| `dominantRole` | string | Most numerous active role |
| `activePatterns` | number | Patterns fired this frame |
| `patternsBlocked` | number | Patterns gated this frame |
| `densitySpikeFrames` | number | Total frames with >30 bullets |
| `reliefEnterCount` | number | Total relief entries this run |
| `phaseTransitionCount` | number | Total phase transitions |
| `directorPressure` | number | Encounter Director pressure |
| `directorSilence` | number | Silence timer (ms) |

### 7.2 Debug Overlay

Config key: `GALAXY_CONFIG.debug.showWaveComposer: true`

Enable to show wave composer state in-game (requires render hook in `draw.js` — not yet implemented, placeholder).

---

## 8. VERIFICATION CHECKLIST

- [x] Load order: `hc-wave-composer.js` after `encounter-director-debug.js`, before `hc-pattern-debug.js`
- [x] `initWaveComposer()` called from `initEnemies()` (non-boss only)
- [x] `updateWaveComposer(dt)` called from `updateEnemiesAndProjectiles()` (after director update)
- [x] All 8 enemy pattern fire points gated with `shouldGateWaveComposerPattern()`
- [x] Boss fights skipped (`_shouldSkipComposer()` returns true)
- [x] Set piece intros preserved (skipped during intro timer)
- [x] No hard references to non-existent functions (all use `typeof ... === 'function'` guards)
- [x] Config block added to `GALAXY_CONFIG.HC_WAVE_COMPOSER`
- [x] No ES modules, no frameworks, no engine changes
- [x] Encounter Director not modified
- [x] HC-PD not modified
- [x] HC-HB not modified

---

*End of HC-WC-03 Runtime Documentation*
