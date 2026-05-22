# HC-BD-07 — Signature Intent Hook Layer

**Block**: HC-BD  
**Status**: Foundation complete (no gameplay changes)  
**Date**: 2026-05-21  
**Dependency**: HC-BD-06 (signature readiness)

---

## Readiness vs Intent

HC-BD-06 determines IF a signature CAN fire. HC-BD-07 determines WHEN to SUGGEST it.

| Layer | Question | Output |
|-------|----------|--------|
| Readiness (HC-BD-06) | Is the ring clean? | `signatureReady: true/false` |
| Intent (HC-BD-07) | Here's your permission slip | `signatureIntentActive: true` |
| Execution (future) | FIRE! | Actual bullet patterns |

The intent layer separates "you may" from "you do". This prevents the director from ever directly triggering attacks — it only recommends. Future execution hooks consume the intent.

---

## Intent Lifetime

| Constant | Value | Purpose |
|----------|-------|---------|
| `BOSS_SIGNATURE_INTENT_LIFETIME_MS` | 900ms | How long an intent is valid before auto-expiry |
| `BOSS_SIGNATURE_INTENT_MIN_REISSUE_MS` | 1200ms | Minimum time between two intents (anti-spam) |
| `BOSS_SIGNATURE_INTENT_EXPIRED_COOLDOWN_MS` | 500ms | Mini cooldown when intent expires (prevents immediate re-issue) |

---

## Intent Flow

1. Each frame, `updateBossDirectorState` evaluates readiness
2. If `signatureReady === true` AND `signatureIntentActive === false` AND config `enableBossSignatureIntents === true`: auto-create intent
3. Intent has a 900ms lifetime — after that, it auto-expires with mini cooldown
4. External hooks can `consumeBossSignatureIntent(reason)` at any time
5. After consumption (or expiry), system won't re-issue for at least 1200ms

---

## Intent State Fields

| Field | Description |
|-------|-------------|
| `signatureIntentActive` | Whether an intent is currently live |
| `signatureIntentId` | Unique ID (sig_intent_N_bossKey) |
| `signatureIntentCandidate` | Signature type key |
| `signatureIntentSlot` | Slot (intro/main/rage/finale/recovery_exit) |
| `signatureIntentBossKey` | Boss pattern key |
| `signatureIntentCreatedAt` | totalTimer when intent was created |
| `signatureIntentExpiresAt` | totalTimer when intent expires |
| `signatureIntentConsumed` | Whether intent was consumed |
| `signatureIntentConsumeReason` | How it was consumed |
| `signatureIntentLastIssueAt` | totalTimer of last issue (anti-spam) |

---

## Consumption Reasons

| Reason | Effect |
|--------|--------|
| `applied` | Full cooldown applied, `signatureCount++`, `lastSignatureAt` set |
| `expired` | Mini cooldown (500ms), `signatureCount` unchanged |
| `declined` | No cooldown, no count — intent rejected externally |
| `blocked` | No cooldown, no count — fairness/readability blocked execution |
| `manual` | No cooldown, no count — generic consume |

---

## Anti-Spam Rules

1. Only one intent active at a time (`!signatureIntentActive` gate in `createBossSignatureIntent`)
2. Minimum 1200ms between intent issues (`signatureIntentLastIssueAt` tracking)
3. Auto-expiry with 500ms mini cooldown prevents immediate re-issue
4. Readiness evaluator still gates — if fairness drops, next intent won't form
5. Config-gated: `enableBossSignatureIntents: false` disables all intent creation

---

## Config

```js
bossDirector: {
  enableBossSignatureIntents: false  // default OFF
}
```

Located in:
- `www/game-config.js` — `GALAXY_CONFIG.bossDirector.enableBossSignatureIntents`
- `www/hardcore-config.js` — defaults + `getBossDirectorConfig()` accessor
- `www/boss-director.js` — `BOSS_DIRECTOR_CONFIG_DEFAULTS` + IIFE `getBossDirectorConfig()`

---

## Helpers

| Function | Returns |
|----------|---------|
| `createBossSignatureIntent(boss)` | `true` if intent created |
| `consumeBossSignatureIntent(reason)` | `true` if consumed |
| `getBossSignatureIntent()` | Intent object or `null` |
| `hasBossSignatureIntent()` | `true`/`false` |

---

## Future Integration

When execution hooks are added (HC-BD-08+):

1. External systems poll `hasBossSignatureIntent()` each frame
2. When true, they read `getBossSignatureIntent()` for candidate/slot
3. If they decide to execute, they call `consumeBossSignatureIntent('applied')`
4. The signature attack fires (telegraph → pattern → aftercare recovery)
5. Cooldown prevents immediate re-issue
6. If they decide NOT to execute (player positioning, other patterns active), they call `consumeBossSignatureIntent('declined')`

This decouples the director's recommendation from the execution decision.

---

## Integration Status

- [x] Intent state fields (10 fields)
- [x] Intent lifetime policy (3 constants)
- [x] `createBossSignatureIntent()` with all gates
- [x] Auto-intent creation in update loop
- [x] `consumeBossSignatureIntent()` with 5 reason types
- [x] Auto-expiration with mini cooldown
- [x] Anti-spam (one intent, min reissue, expiration)
- [x] Helpers (get/has/create/consume)
- [x] Config gate (`enableBossSignatureIntents`)
- [x] Telemetry events for create/apply/expire
- [ ] External execution hooks
- [ ] Per-boss intent consumers

---

**Foundation complete. Ready for execution hooks in HC-BD-08.**
