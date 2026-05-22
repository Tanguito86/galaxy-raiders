# HC-BD-06 — Signature Attack Readiness Layer

**Block**: HC-BD  
**Status**: Foundation complete (no gameplay changes)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-05 (recovery windows)

---

## What is a Signature Attack in HC-BD

A signature attack is a boss's **identity-defining move** — the attack the player remembers after the fight. It's not just a pattern; it's a branded, telegraphed, rhythm-gated moment that says "this is MY boss."

Signatures are NOT:
- Spammable regular attacks
- A replacement for normal patterns
- A difficulty spike without telegraph
- An RNG-gated "sometimes it happens" event

Signatures ARE:
- Phase-contextual (intro/main/rage each have one)
- Cooldown-gated (can't spam)
- Fairness-gated (blocked when rhythm is poor)
- Readability-gated (blocked during transitions/recovery)
- Identity-defining (each boss has a unique signature candidate)

---

## Why Signatures Aren't Firing Yet

This sprint builds the **readiness layer** — the system that decides IF and WHEN a signature should be available. The actual attack implementation (bullet patterns, FX, timing) comes in future sprints.

The readiness layer is the "should we?" before the "here's how."

---

## Signature Slot Taxonomy

| Slot | Phase Context | Purpose |
|------|--------------|---------|
| intro | introduction | First impression — sets boss identity |
| main | pressure, crossfire, area_denial, chase | Core combat — the boss's workhorse signature |
| rage | rage, desperation | Climax — the ultimate form of the boss |
| finale | finale | Death sequence — no attack, just spectacle |
| recovery_exit | recovery, transition | Exiting safety — re-engage with flair |

---

## Per-Boss Signature Plan

| Boss | Intro | Main | Rage |
|------|-------|------|------|
| CRABTRON | aimedBurst | pincerFire | pincerFire |
| SERPENTRIX | rotatingFan | delayedTrap | rotatingFan |
| ORBITAL | orbitalPressure | laserSweep | phaseBurst |
| TENIENTE | aimedBurst | pincerFire | escapeBait |
| EMPERADOR | orbitalPressure | arenaSplit | phaseBurst |

---

## Readiness Conditions

A signature is **ready** when ALL of the following are true:

1. `enableBossDirector === true`
2. Boss director state is active
3. Signature candidate is valid (exists in BOSS_SIGNATURE_TYPES)
4. Not in an active transition (`transitionActive === false`)
5. Not in an active recovery window (`recoveryWindowActive === false`)
6. Cooldown has expired (`signatureCooldownRemainingMs <= 0`)
7. Fairness rhythm score >= 0.35
8. Current phase has been active >= 500ms (`phaseTimer >= 500`)

## Block Reasons

When a signature is NOT ready, the reason is one of:

| Reason | Meaning |
|--------|---------|
| `disabled` | Boss director master switch is OFF |
| `inactive` | No boss currently active in director |
| `invalid_candidate` | Resolved signature candidate doesn't exist in taxonomy |
| `transition_active` | Boss is in a transition sequence |
| `recovery_active` | Boss is in a recovery window |
| `cooldown` | Signature cooldown hasn't expired |
| `fairness_low` | Fairness rhythm score too low (< 0.35) |
| `phase_too_new` | Current phase started less than 500ms ago |
| `unknown` | Catch-all for unexpected state |

---

## Cooldown Policy

| Slot | Base Cooldown | Rationale |
|------|--------------|-----------|
| intro | 2500ms | Only used once at fight start — short cooldown irrelevant |
| main | 4500ms | Core attack — long enough to prevent spam, short enough to be felt |
| rage | 3200ms | Climax mode — faster pace, shorter cooldown |
| finale | 2200ms | Not used as attack — short for safety |
| recovery_exit | 3000ms | Re-engage signature — medium pacing |

### Pacing Style Adjustments

Cooldowns are adjusted by the boss's `pacingStyle`:

| Pacing Style | Multiplier | Effect |
|-------------|-----------|--------|
| measured, cinematic | ×1.15 | Slower, more dramatic pacing |
| aggressive, dramatic_loop | ×0.90 | Faster, more intense pacing |
| erratic, player_driven | ×0.95 | Slightly faster |
| default (punctuated, etc.) | ×1.00 | Standard |

Minimum cooldown: 1500ms (hard floor).

---

## Fairness Gates

The **fairness rhythm score** (from HC-BD-05) acts as a gate for signatures. If the boss has been applying sustained pressure without recovery windows, the score drops below 0.35 and signatures are blocked.

This ensures that the boss's most powerful identity move never happens during an unfair pressure moment.

---

## Runtime State Fields

| Field | Type | Description |
|-------|------|-------------|
| `signatureCandidate` | string | Key from BOSS_SIGNATURE_TYPES |
| `signatureSlot` | string | Key from BOSS_SIGNATURE_SLOTS |
| `signatureReady` | boolean | All conditions met |
| `signatureBlocked` | boolean | Inverse of ready |
| `signatureBlockReason` | string | Why it's blocked (or null if ready) |
| `signatureCooldownMs` | number | Total cooldown duration |
| `signatureCooldownRemainingMs` | number | Ticks down each frame |
| `lastSignatureAt` | number | totalTimer value when last signature fired |
| `signatureCount` | number | How many signatures have been used this fight |

---

## Future Integration

When signature attack implementation begins (HC-BD-07+):

1. Signature readiness is evaluated each frame
2. When `signatureReady === true`, the signature attack can be triggered
3. On trigger: set `signatureCooldownMs` / `signatureCooldownRemainingMs` from `getBossSignatureCooldownMs`
4. Set `lastSignatureAt` to current `totalTimer`
5. Increment `signatureCount`
6. The signature pattern executes (telegraph → attack → aftercare recovery)
7. Cooldown counts down each frame until next readiness

---

## Integration Status

- [x] Signature slot taxonomy (5 slots)
- [x] Per-boss signature plan (intro/main/rage)
- [x] Signature candidate resolution by phase
- [x] Readiness evaluator with 8 conditions
- [x] Block reason enum (9 reasons)
- [x] Cooldown policy with pacing adjustments
- [x] Runtime state tracking (candidate, slot, ready, blocked, reason, cooldown)
- [x] Helpers (getBossSignatureInfo, isBossSignatureReady, getBossSignatureCandidate, getBossSignatureBlockReason)
- [x] Telemetry integration
- [ ] Actual signature attack implementation (patterns, FX, timing)
- [ ] Cooldown trigger on signature fire
- [ ] Signature count tracking during fight

---

**Foundation complete. Ready for signature attack implementation in HC-BD-07.**
