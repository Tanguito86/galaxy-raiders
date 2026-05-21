# HC-BD-04 — Boss Transition Choreography

**Block**: HC-BD  
**Status**: Foundation complete (no gameplay changes)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-03 (state machine)

---

## Transition Taxonomy

Six transition types define how a boss moves between phases. Each type has a recommended duration, visual intent, audio intent, gameplay intent, and readability goal.

### phase_shift
- **Duration**: 400ms
- **When**: Standard phase progression (pressure→crossfire, introduction→pressure)
- **Visual**: Transition ring flash + phase text + brief screen shake
- **Audio**: Boss warning SFX + music duck
- **Gameplay**: Boss pauses briefly. Existing bullets resolve naturally. No new threats.
- **Readability**: Player must see and feel the phase change clearly.

### armor_break
- **Duration**: 700ms
- **When**: Boss armor/shell breaks, revealing a more dangerous form
- **Visual**: Shatter particles + expanding ring + color shift
- **Audio**: Heavy impact SFX + deeper music duck
- **Gameplay**: Signal increased threat. Boss may change movement or gain new attacks.
- **Readability**: Player must understand the boss just got more dangerous.

### rage_wake
- **Duration**: 900ms
- **When**: Boss enters rage/desperation mode
- **Visual**: Red/purple aura + screen border flash + boss glow intensification
- **Audio**: Rage SFX + music intensifies + low-pass filter
- **Gameplay**: Signal maximum threat. All patterns accelerate. New signature attack available.
- **Readability**: Player must feel the stakes just escalated to maximum.

### arena_refocus
- **Duration**: 500ms
- **When**: Boss changes arena layout or threat zones (reposition, new zones)
- **Visual**: Zone indicators pulse + boss smoothly drifts to new position
- **Audio**: Low hum + brief silence
- **Gameplay**: Signal arena reconfiguration. Existing hazards may shift or expire.
- **Readability**: Player must see the new safe/danger zones clearly.

### signature_prep
- **Duration**: 600ms
- **When**: Boss telegraphs a signature attack before executing it
- **Visual**: Signature-specific telegraph + charging effect + directional indicators
- **Audio**: Charge SFX + tension build
- **Gameplay**: Warn player of incoming signature attack. Reward anticipation with dodge window.
- **Readability**: Player must identify the signature attack before it fires.

### finale_lock
- **Duration**: 1200ms
- **When**: Boss death sequence begins
- **Visual**: Full-screen ring expansion + white flash + boss disintegration FX
- **Audio**: Victory fanfare + music resolve + explosion SFX
- **Gameplay**: Signal boss death. No new threats. Reward delivery begins.
- **Readability**: Player must feel triumphant. No gameplay confusion during finale.

---

## Per-Boss Transition Assignments

| Boss | Default | Rage | Finale | Duration | Reasoning |
|------|---------|------|--------|----------|-----------|
| CRABTRON | phase_shift | rage_wake | finale_lock | 400ms | Simple duelist — standard transitions sufficient |
| SERPENTRIX | phase_shift | rage_wake | finale_lock | 500ms | Sweeper — slightly longer for wave crescendo |
| ORBITAL | arena_refocus | rage_wake | finale_lock | 550ms | Orbital reposition is natural transition language |
| TENIENTE | signature_prep | rage_wake | finale_lock | 650ms | Charge-based — transitions double as signature prep |
| EMPERADOR | arena_refocus | rage_wake | finale_lock | 800ms | Teleport-based arena refocus is core identity |

---

## Transition Type Resolution Rules

```
toPhase === 'rage'      → profile.rageType      (default: rage_wake)
toPhase === 'finale'    → profile.finaleType     (default: finale_lock)
fromPhase === 'recovery' → signature_prep
toPhase === 'transition'
   or 'recovery'         → arena_refocus
fallback                 → profile.defaultType   (default: phase_shift)
```

---

## What a Transition MUST NOT Do

1. **NO** clearing existing bullets — they should resolve naturally
2. **NO** pausing the game loop — time continues
3. **NO** blocking player input — player can still move/shoot
4. **NO** spawning new threats — transition is a brief safety window
5. **NO** instant unfair damage — transition is a spectacle, not a trap
6. **NO** skipping telegraphs — transition IS the telegraph for what comes next
7. **NO** RNG-based transition type — always deterministic based on phase context
8. **NO** visual FX that obscure bullets — readability preserved during transition

---

## Recommended Duration Ranges

| Transition Type | Min | Recommended | Max |
|----------------|-----|-------------|-----|
| phase_shift | 300ms | 400ms | 600ms |
| armor_break | 500ms | 700ms | 1000ms |
| rage_wake | 600ms | 900ms | 1500ms |
| arena_refocus | 350ms | 500ms | 700ms |
| signature_prep | 400ms | 600ms | 800ms |
| finale_lock | 800ms | 1200ms | 2000ms |

---

## Readability Rules During Transition

1. **Phase text must be readable**: Dark background band behind text, contrasting color
2. **Transition ring must not cover bullets**: Ring expands outward, transparent center
3. **Boss must remain visible**: Glow/aura acceptable, silhouette blur is NOT
4. **Escape routes must remain visible**: No arena-wide FX that obscures safe zones
5. **Transition duration must respect telegraph minimums**: If next phase has a signature, transition + telegraph must not overlap confusingly

---

## Future Visual Integration Notes

When visual FX are implemented for transitions:

- **phase_shift**: Ring flash (existing) + phase text (existing) — already partially implemented
- **rage_wake**: Screen border flash (new) + boss red aura (new) + music duck (existing)
- **arena_refocus**: Hazard zone indicators (new) + boss drift path (new)
- **signature_prep**: Signature-specific telegraph (new) + charging particles (new)
- **finale_lock**: Full ring expansion (existing phase FX) + white flash (new) + medal rain (existing)
- **armor_break**: Shatter particles (new) + color shift (new) — not yet assigned to any boss

---

## Runtime State Fields

During a transition, `bossDirectorState` contains:

| Field | Type | Description |
|-------|------|-------------|
| `transitionType` | string | Key from BOSS_TRANSITION_TYPES |
| `transitionDurationMs` | number | Total duration in ms |
| `transitionProgress` | number | Raw timer value |
| `transitionProgress01` | number | 0→1 normalized progress |
| `transitionReason` | string | "hp_threshold" (future: "scripted", "damage_spike") |
| `transitionFrom` | string | Previous phase type |
| `transitionTo` | string | Next phase type |

---

## Integration Status

- [x] Transition taxonomy (6 types)
- [x] Per-boss transition profiles
- [x] Runtime state fields
- [x] Transition type resolution
- [x] Progress tracking (0→1)
- [x] Safe helpers (`getBossTransitionInfo`, `isBossTransitionType`, `getBossTransitionProgress01`)
- [x] Telemetry integration (type, duration, progress in events)
- [ ] Visual FX execution (uses existing phase transition FX temporarily)
- [ ] Audio duck per transition type
- [ ] Movement freeze/pause during transition
- [ ] Armor break assignment (no boss currently uses it)

---

**Foundation complete. Ready for visual FX integration when HC-BD activates orchestration runtime.**
