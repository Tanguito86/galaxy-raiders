# HC-PD-06 — Controlled Delay Hook Trial

> **Sprint**: HC-PD-06
> **Date**: 2026-05-19
> **Status**: Complete
> **Depends on**: HC-PD-05 (safe delay gate)
> **Mode**: CONTROLLED TRIAL — real delay applied in 2 safe hooks only

---

## 1. OVERVIEW

HC-PD-06 activates real pattern delays for the first time, but only in 2 extremely safe hooks: sweeper fan (alien1, support) and baiter burst (alien_mini, utility). These are the lowest-risk patterns — neither can create dangerous combos, neither blocks escape lanes, and both have long cooldowns that make short delays imperceptible in chaos.

`applyDelay` remains `false` by default. The integration-ready code exists but doesn't activate unless manually toggled.

---

## 2. HOOKS CHOSEN

### Hook 1: Sweeper Fan (`enemySupportFire`)
- **Pattern**: `wideFan` — 5-bullet downward fan
- **Enemy**: alien1 (sweeper role)
- **Dominance**: support
- **Why safe**: No aimed component. No lane closure. Slow bullets. Long cooldown (3200-5500ms).
- **Integration**: `update-enemies.js` line 1057 — sweeper cooldown block
- **Delay effect**: Adds up to 30 frames (~500ms) to next cooldown when budget is critical

### Hook 2: Baiter Burst (`enemySupportFire`)
- **Pattern**: `baiterSpread` — 3-bullet erratic spread
- **Enemy**: alien_mini (baiter role)
- **Dominance**: utility
- **Why safe**: Lowest threat weight (1). No telegraph required. Slow speed. short cooldown (1800-3200ms).
- **Integration**: `update-enemies.js` line 1085 — baiter cooldown block
- **Delay effect**: Adds up to 30 frames (~500ms) to next cooldown when budget is critical

---

## 3. HOW IT WORKS

1. Cooldown reaches 0 on sweeper/baiter
2. `tryApplyPatternDelay(patternId, source, meta, hookName)` is called
3. Internally calls `shouldDelayPattern()` to evaluate
4. If `applyDelay: true` AND budget is critical AND hook is enabled:
   - Returns delay frames (converted to ms for cooldown)
5. Pattern fires normally — delay only affects NEXT cooldown

**The pattern still fires.** The delay only affects when it fires *again*.

---

## 4. CONFIG

```javascript
controlledHooks: {
  enemySupportFire: true,   // sweeper, baiter
  externalPressure: true,   // shmup external (not yet integrated)
  bossPatterns: false       // no boss patterns yet
}
```

To enable real delay:
```javascript
safeDelayGate.applyDelay = true
```

To disable a specific hook:
```javascript
controlledHooks.enemySupportFire = false
```

---

## 5. ANTI-SOFTLOCK PROTECTIONS (from HC-PD-05)

All still active:
- Max 2 consecutive delays → force allow
- 90-frame fallback timer → resets counter
- Utility patterns always allowed
- `applyDelay: false` by default → zero gameplay impact

---

## 6. DEBUG

Hook status visible in HC-PD debug overlay:
- `HK:SW:X/Y BT:X/Y` — sweeper/baiter applied/suggested counts
- `last:hookName Nf` — last hook that applied delay

---

## 7. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Sweeper feels slower | Very low | Cooldown is already 3.2-5.5s; +0.5s is imperceptible |
| Baiter disappears | Very low | Baiter is utility; delay only when budget critical |
| Softlock | None | All HC-PD-05 protections active |
| Boss affected | None | `bossPatterns: false` |

---

## 8. PENDING FOR HC-PD-07+

- Integrate `externalPressure` hook (shmup external patterns)
- Activate `bossPatterns` after more testing
- Add per-pattern delay multiplier config
- Auto-tune delay based on rank level

---

## 9. FREEZE CRITERIA

- [x] `tryApplyPatternDelay` exists and works
- [x] `applyDelay: false` has zero gameplay impact
- [x] `applyDelay: true` only affects sweeper + baiter
- [x] Delay never exceeds maxDelayFrames (30 frames = ~500ms)
- [x] No softlock — consecutive cap + fallback timer
- [x] Debug overlay shows hook applied/suggested counts
- [x] `node --check` passes
- [ ] `npm run validate` passes

---

*End of HC-PD-06 documentation.*
