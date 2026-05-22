# HC-BD-05 — Boss Recovery Window & Fairness Rhythm

**Block**: HC-BD  
**Status**: Foundation complete (no gameplay changes)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-04 (transition choreography)

---

## What is Recovery in HC-BD

Recovery is NOT lowering difficulty. It's rhythm.

A boss without recovery has **flat pressure** — constant threat at one intensity level. This is exhausting, not hard. A boss with recovery has **pulsed pressure** — peaks of intensity followed by valleys of breathing room. The peaks feel higher because the valleys exist.

The metaphor: even a machine gun breathes — it reloads. Bosses need reload moments too.

---

## Recovery vs Difficulty

| Aspect | Flat Pressure | Pulsed Pressure (with recovery) |
|--------|--------------|--------------------------------|
| Challenge | Constant medium stress | High peaks, safe valleys |
| Fatigue | High (player burns out) | Low (player resets between peaks) |
| Memorability | Low (everything merges) | High (peaks are distinct events) |
| Fairness | Medium (no "unfair" spikes) | High (hard moments are telegraphed + recovered from) |
| Hardcore feel | Grindy | Rhythmic |

**HC-BD philosophy**: Difficulty comes from pattern design, not pressure starvation. Recovery makes difficulty readable.

---

## Recovery Taxonomy

| Type | Duration | When | Intent |
|------|----------|------|--------|
| micro_pause | 300ms | After any heavy attack | Brief reposition window |
| reposition | 600ms | During arena layout change | Safe travel window |
| weakpoint_expose | 800ms | Between phases or after rage | Damage reward window |
| pressure_drop | 500ms | After sustained intensity | Prevent player fatigue |
| signature_aftercare | 700ms | After signature attack | Reward for surviving the big move |
| transition_breath | 500ms | During/after phase transition | Spectacle safety guarantee |

---

## What Recovery MUST NOT Do

1. **NO** clearing existing bullets — they resolve naturally
2. **NO** pausing gameplay — time continues, boss just attacks less
3. **NO** making the boss look weak — recovery is brief and earned
4. **NO** overusing recovery — too much recovery = boredom
5. **NO** recovery during rage/finale — climax has no breathing room
6. **NO** recovery without telegraph — player must feel it's intentional
7. **NO** RNG-based recovery timing — deterministic based on phase/events

---

## Per-Boss Recovery Profiles

| Boss | Default Type | Duration Range | Frequency Bias | Philosophy |
|------|-------------|----------------|----------------|------------|
| CRABTRON | micro_pause | 250-500ms | 0.35 | Dash cooldown exposes pincers — brief safe window after evasion |
| SERPENTRIX | pressure_drop | 300-600ms | 0.30 | Wave troughs between sweeps create natural breathing room |
| ORBITAL | reposition | 350-700ms | 0.25 | Orbital apex is natural recovery — boss at farthest point from player |
| TENIENTE | signature_aftercare | 400-900ms | 0.35 | Post-charge retreat IS the recovery window — dramatic and earned |
| EMPERADOR | weakpoint_expose | 300-600ms | 0.15 | Phase transition is the only recovery — final boss privilege |

---

## Auto-Recovery Triggers

Recovery windows can start automatically when:

| Trigger | Recovery Type | Condition |
|---------|--------------|-----------|
| Phase type is "recovery" | transition_breath | `enableBossRecoveryRules: true` |
| Phase type is "transition" | transition_breath | `enableBossRecoveryRules: true` |
| Just exited rage/desperation | pressure_drop | `enableBossRecoveryRules: true` |
| Manual call | Any | `startBossRecoveryWindow(reason, boss)` |

---

## Fairness Rhythm Score

A 0-1 score that measures how fair the current combat rhythm is. Used for telemetry and future pacing decisions.

Factors that **increase** the score (good rhythm):
- Recent recovery window (+0.15 within 2s, +0.05 within 5s)
- Active transition (+0.10)
- Active recovery (+0.20)
- High fairness bias boss (+0.05)
- Any recovery count in first 10s

Factors that **decrease** the score (bad rhythm):
- Phase timer > 12s without recovery (-0.15)
- Phase timer > 8s without recovery (-0.08)
- Rage active (-0.20)
- No recovery in 10s+ (-0.15)
- Less than 2 recoveries in 20s+ (-0.10)
- Low fairness bias boss (-0.10)
- HP < 15% (-0.05)

---

## Recovery Preference Helper

`shouldBossDirectorPreferRecovery()` returns true when the system believes a recovery window would improve rhythm. Considers:

- Recovery bias (post_charge_retreat, wave_trough, long_after_burst trigger earlier)
- Fairness bias (high fairness bosses trigger earlier)
- Phase timer (longer without recovery = stronger preference)
- HP band (low HP increases preference)
- Active state (never during active recovery/transition/rage/finale)

This is advisory only — it does NOT automatically trigger recovery.

---

## Integration Status

- [x] Recovery taxonomy (6 types)
- [x] Per-boss recovery profiles
- [x] Runtime state fields (type, duration, progress, reason, count)
- [x] Auto-recovery from phase state (recovery/transition phases)
- [x] Manual recovery trigger (`startBossRecoveryWindow`)
- [x] Progress tracking 0→1
- [x] Recovery helpers (info, progress, type validation)
- [x] Recovery preference helper
- [x] Fairness rhythm score
- [x] Telemetry integration
- [ ] Visual FX for recovery windows
- [ ] Boss behavior modification during recovery (reduced fire rate)
- [ ] Encounter Director pressure integration

---

## Future: Signature Aftercare

When signature attacks are implemented, the flow will be:

```
pressure → signature_telegraph → signature_attack → signature_aftercare → pressure
```

The aftercare window (700ms default) is the reward for surviving the signature. It's not a free pass — it's earned.

---

## Freeze Criteria (Partial)

Recovery system is freeze-ready when:
1. All 6 types documented and assigned ✓
2. Runtime state tracks recovery progress ✓
3. Auto-recovery triggers on phase state ✓
4. Fairness rhythm score computes correctly ✓
5. Telemetry captures recovery events ✓
6. No gameplay changes at any config state ✓

**Foundation complete. Ready for pacing integration when HC-BD activates orchestration runtime.**
