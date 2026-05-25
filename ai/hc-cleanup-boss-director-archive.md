# HC-CLEANUP-06 — Boss Director Archive

**Date:** 2026-05-25  
**Commit:** _(to be filled)_  
**Audit reference:** `ai/hc-cleanup-boss-director-dead-code-audit.md`

---

## What was done

1. **Moved** `www/boss-director.js` → `ai/reference/boss-director.js`
2. **Removed** `<script src="boss-director.js"></script>` from `www/index.html` (was line 150)
3. **No other files modified** — all 11 call sites already used `typeof === 'function'` guards

---

## Why it was safe

| Verification | Result |
|---|---|
| Functions exported by boss-director.js | 91 |
| Functions with runtime callers | 3 (`shouldApplyBossSignatureIntent`, `consumeBossSignatureIntent`, `updateBossDirectorState`) |
| Callers using `typeof` guard | ✅ All 11 call sites |
| Functions shadowed by local redefinitions | 4 (`GALAXY_CONFIG`, `getBossDirectorConfig`, `isBossDirectorEnabled`, `getHardcoreBossId`) |
| Functions with ZERO callers | 88 |
| Config default `enableBossDirector` | `false` (master kill switch) |
| `npm run validate` after archive | ✅ Validación JS OK |
| Gameplay changes | **Zero** — boss behavior is hardcoded in `update-boss.js` |

**All callers are protected by `typeof === 'function'` guards.** When `boss-director.js` is not loaded, the guards return early and the classic boss patterns in `update-boss.js` execute normally. The game behaves identically.

---

## Config flags that kept it inert

```javascript
bossDirector: {
  enableBossDirector:             false,  // Master switch — all functions check this first
  enableBossSignatureIntents:     false,
  enableCrabtronSignatureHook:    false,
  enableSerpentrixSignatureHook:  false,
  enableOrbitalSignatureHook:     false,
  enableTenienteSignatureHook:    false,
  enableEmperadorSignatureHook:   false,
  // ... 6 more, all false
}
```

---

## How to restore

```bash
# Option A: Revert the commit
git revert <commit-hash>

# Option B: Manual restore
mv ai/reference/boss-director.js www/boss-director.js
# Then add back to index.html (was line 150, before boss-patterns.js):
# <script src="boss-director.js"></script>
```

---

## How to reactivate (future)

1. Move file back to `www/boss-director.js` and restore the `<script>` tag
2. Set config flags in `game-config.js`:
   - `bossDirector.enableBossDirector: true`
   - `bossDirector.enableBossSignatureIntents: true`
3. The 3 DORMANT functions will activate:
   - `shouldApplyBossSignatureIntent` → enables boss signature attacks
   - `consumeBossSignatureIntent` → tracks intent consumption
   - `updateBossDirectorState` → orchestrates phase transitions
4. **Warning:** this adds gameplay mechanics — playtest required

---

## What remains in runtime

The boss system is fully driven by:
- `www/update-boss.js` (1,799 lines) — hardcoded state machine
- `www/boss-patterns.js` (1,172 lines) — pattern definitions
- `www/hc-pattern-director.js` (2,395 lines) — hardcore pattern orchestration
- `www/boss-ai-movement.js` (153 lines) — AI movement

These are all LIVE and unaffected by this archive.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Someone calls a removed function without guard | ✅ All 11 call sites verified with `typeof` guards |
| `GALAXY_CONFIG` reference broken | ✅ Declared in `game-config.js`, not boss-director.js |
| `getBossDirectorConfig` / `isBossDirectorEnabled` broken | ✅ Defined locally in `hardcore-config.js` |
| `getHardcoreBossId` broken | ✅ Defined locally in `boss-patterns.js` |

**Risk level: ZERO** — the file was completely inert.
