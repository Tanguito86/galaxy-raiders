# HC-CLEANUP-02 — Strict Mode Readiness Audit

**Date:** 2026-05-25
**Status:** Audit-only — no code changes

---

## 1. Current State

- **Total JS files loaded:** 76 (via `<script>` tags in `index.html`)
- **Files with `'use strict'`:** 2 (`encounter-director.js`, `encounter-director-debug.js`)
- **Files in sloppy mode:** 74
- **`game.js` position in load order:** #65 of 76
- **Canonical declarations in `game.js`:** 56 `let`/`const` variables (gameplay state: bullets, enemies, particles, boss, timers, etc.)
- **Canonical declarations in `state.js`:** 48 `let`/`const` variables (canvas, palettes, sprites, entity types)

---

## 2. Architecture Constraint

**`game.js` is loaded at position 65 — very late.** It declares all gameplay state as `let`/`const`. However, **14 files loaded BEFORE game.js** assign to these variables:

```
enemy-pattern-hooks.js → bulletSpeed
state.js              → activeControlDeckSkin
reset.js              → bullets, continueCount, currentLetterIndex, debugLevelJumpText,
                        debugLevelJumpTimer, enemies, enemyBullets, extraLivesEarned
name-entry.js         → currentLetterIndex, enteringName, playerName
ui.js                 → debugLevelJumpText, debugLevelJumpTimer
draw.js               → alpha, nameCursorBlink
update-prelude.js     → hitstopTimer, invincibleTimer, isInvincible, setPieceIntroResolved
boss-patterns.js      → progress
enemy-attacks.js      → enemyLastShot, setPieceBurstDelayTimer, setPieceBurstShotsRemaining,
                        setPieceBurstVariant, setPieceFireTimer, setPieceLaneIndex,
                        setPieceTelegraphSide, setPieceTelegraphTimer
enemy-movement.js     → setPiecePatternTimer
stage-director.js     → setPieceBannerText, setPieceBannerTimer
update-enemies.js     → bossDefeated, enemyLastShot, enemySpeedX, invincibleTimer,
                        isInvincible, setPieceIntroTimer
update.js             → animationFrame, levelClearTimer, pendingNextLevel, prevPlayerX,
                        prevPlayerY, waveAnnounceSubText, waveAnnounceSubTimer, waveAnnounceText
combat.js             → lastShotTime
```

In sloppy mode, the first assignment implicitly creates `window.<var>`. When `game.js` later runs `let bullets = []`, the `let` creates a **new lexical binding** in script scope. Post-game.js code resolves to the `let` binding; pre-game.js assignments resolve to the original `window` property.

In **strict mode**, bare assignment to an undeclared variable throws `ReferenceError`. All 14 files above would break if `'use strict'` is added.

---

## 3. Risk Scan Results

| Pattern | Matches | Verdict |
|---------|---------|---------|
| `eval()` usage | 0 | ✅ |
| `with` statements | 0 | ✅ |
| `arguments.callee` / `.caller` | 0 | ✅ |
| Octal literals (`0123`) | 0 (all false positives from comments) | ✅ |
| Duplicate parameter names | 0 | ✅ |
| `this` in global function context | 0 (all methods use `window.xxx` or are inside objects) | ✅ |
| `delete` on variable names | 0 (all are `delete obj.prop`) | ✅ |
| Explicit `window.xxx` assignments | ~15 occurrences (safe pattern) | ✅ |

**The only risk is undeclared variable assignment** — and it's pervasive due to the architecture.

---

## 4. File Classification

### SAFE (can add `'use strict'` with zero or minimal risk)

Files that either are self-contained or only assign to variables declared in files loaded before them:

| File | Lines | Reason |
|------|-------|--------|
| `audio.js` | 430 | Self-contained IIFE + function declarations |
| `audio-bus.js` | 348 | Self-contained |
| `music.js` | 492 | Self-contained (declares `isMuted`, `menuMusicStarted`) |
| `audio-music-gen.js` | 1018 | Self-contained |
| `audio-ambience.js` | 206 | Self-contained |
| `audio-engine.js` | 197 | Self-contained facade |
| `utils.js` | 14 | Self-contained utility |
| `collisions.js` | 24 | Self-contained |
| `config.js` | 131 | Self-contained config objects |
| `game-config.js` | 817 | Self-contained config |
| `sprite-system.js` | 689 | IIFE, self-contained registry |
| `hardcore-config.js` | 776 | Self-contained (duplicates game-config.js though) |
| `hardcore-rank.js` | 1523 | Self-contained |
| `hardcore-combo.js` | 434 | Self-contained |
| `hardcore-pressure.js` | 121 | Self-contained |
| `hardcore-rhythm.js` | 88 | Self-contained |
| `enemy-identity.js` | 93 | Self-contained |
| `enemy-factions.js` | 313 | Self-contained |
| `enemy-tactical-ai.js` | 227 | Self-contained |
| `scores.js` | 1213 | Self-contained (declares `flashScreen`, `lives`, `nextPowerUpTime`, etc.) |
| `balance.js` | 171 | Self-contained |
| `options.js` | 97 | Self-contained |
| `menus.js` | 64 | Self-contained |
| `navigation.js` | 39 | Self-contained (declares `state`) |
| `transitions.js` | 28 | Self-contained |
| `renderer.js` | 12 | Self-contained |
| `render-hud.js` | 73 | Self-contained |
| `update-player.js` | 30 | Self-contained |
| `factories.js` | 57 | Self-contained |
| `entity-manager.js` | 43 | Self-contained |
| `input-manager.js` | 50 | Self-contained |
| `game-loop.js` | 38 | Self-contained |
| `runtime.js` | 7 | Self-contained bootstrap |
| `hc-90-background.js` | 240 | Self-contained (loaded after game.js) |
| `hc-97-atmosphere.js` | 212 | Self-contained (loaded after game.js) |
| `hc-hitbox-config.js` | 427 | Self-contained |
| `hc-hitbox-debug.js` | 450 | Self-contained |
| `hc-hitbox-fairness.js` | 340 | Self-contained |
| `hc-wc-profiles.js` | 1195 | Self-contained |
| `hc-wc-choreography.js` | 713 | Self-contained |
| `hc-wc-enforcement.js` | 618 | Self-contained |
| `hc-wc-setpieces.js` | 532 | Self-contained |
| `hc-wave-composer.js` | 885 | Self-contained |
| `hc-pattern-debug.js` | 613 | Self-contained |
| `stage-plans.js` | 315 | Self-contained |
| `boss-ai-movement.js` | 153 | Self-contained |
| `medals.js` | 426 | Only assigns to `feverActive`, `feverUntil`, etc. (own scope) |
| `debug-balance.js` | 299 | Self-contained debug vars |

**Total SAFE:** 48 files (~61,000 lines including draw.js)

### RISKY (can add `'use strict'` but needs verification)

Files after game.js that assign to variables declared in earlier files (safe because declarations exist), or files with very minor fixable issues:

| File | Lines | Issue |
|------|-------|-------|
| `progression.js` | 383 | Assigns to `flashScreen`, `gameStats`, `lastMilestoneRewardLevel`, `lastRunTelemetry` — all declared in `scores.js`/`game.js` loaded before. SAFE for strict. |
| `entities.js` | 1357 | Assigns to `stars`, `nextPowerUpTime`, `powerUpsSpawnedThisLevel` — declared in `scores.js`. SAFE for strict. |
| `flow.js` | 104 | Assigns to `flashScreen`, `lives`, `state` — declared in `scores.js` / `navigation.js`. SAFE for strict. |
| `input-keyboard.js` | 230 | Assigns to `isMuted`, `menuMusicStarted` — declared in `music.js`. SAFE for strict. |
| `input-touch.js` | 240 | Assigns to `menuMusicStarted` — declared in `music.js`. SAFE for strict. |
| `render-entities.js` | 532 | Assigns to locals `style`, `color` inside functions. SAFE. |
| `game.js` | 198 | Already uses `let`/`const` exclusively. Adding `'use strict'` is **zero-risk**. |
| `session.js` | 41 | Assigns to `state`, `pauseSelection`, `previousState` — declared in `navigation.js`/`menus.js`. SAFE for strict. |

**Total RISKY (but actually SAFE on verification):** 8 files

### DO NOT TOUCH (would break in strict mode — needs architectural refactor first)

Files loaded BEFORE `game.js` that assign to `game.js`-declared variables:

| File | Lines | game.js vars assigned | Fix strategy |
|------|-------|----------------------|--------------|
| `enemy-pattern-hooks.js` | 633 | `bulletSpeed` | Move declaration to pre-game.js or use `window.bulletSpeed` |
| `state.js` | 414 | `activeControlDeckSkin` | Already self-declares this, no issue |
| `reset.js` | 94 | 8 vars | Convert to `window.bullets = []` etc. |
| `name-entry.js` | 87 | 3 vars | Convert to `window.xxx` |
| `ui.js` | 330 | 2 vars | Convert to `window.xxx` |
| `draw.js` | 7194 | 1 var (`nameCursorBlink`) | Convert to `window.nameCursorBlink` |
| `update-prelude.js` | 172 | 4 vars | Convert to `window.xxx` |
| `boss-patterns.js` | 1172 | 1 var | Convert to `window.progress` |
| `enemy-attacks.js` | 325 | 8 vars | Convert to `window.xxx` |
| `enemy-movement.js` | 349 | 1 var | Convert to `window.xxx` |
| `stage-director.js` | 870 | 2 vars | Convert to `window.xxx` |
| `update-enemies.js` | 1247 | 6 vars | Convert to `window.xxx` |
| `update.js` | 174 | 8 vars | Convert to `window.xxx` |
| `combat.js` | 92 | 1 var | Convert to `window.lastShotTime` |

**Total DO NOT TOUCH:** 14 files (~13,500 lines)

---

## 5. Recommended Application Order

### Phase 1 — Zero Risk (load order position > game.js, or fully self-contained)
Apply `'use strict'` to these files in any order:

1. `runtime.js` — 7 lines, bootstrap
2. `game-loop.js` — 38 lines, single loop
3. `renderer.js` — 12 lines, thin wrapper
4. `utils.js` — 14 lines, utility
5. `collisions.js` — 24 lines
6. `transitions.js` — 28 lines
7. `update-player.js` — 30 lines
8. `navigation.js` — 39 lines
9. `session.js` — 41 lines
10. `entity-manager.js` — 43 lines
11. `input-manager.js` — 50 lines
12. `factories.js` — 57 lines
13. `menus.js` — 64 lines
14. `render-hud.js` — 73 lines
15. `options.js` — 97 lines
16. `hardcore-rhythm.js` — 88 lines
17. `hardcore-pressure.js` — 121 lines
18. `balance.js` — 171 lines
19. `boss-ai-movement.js` — 153 lines
20. `config.js` — 131 lines
21. `game.js` — 198 lines (already uses let/const, zero risk)
22. `flow.js` — 104 lines
23. `progression.js` — 383 lines
24. `input-keyboard.js` — 230 lines
25. `input-touch.js` — 240 lines
26. `audio-engine.js` — 197 lines
27. `audio-ambience.js` — 206 lines
28. `audio-bus.js` — 348 lines
29. `audio.js` — 430 lines
30. `music.js` — 492 lines
31. `enemy-identity.js` — 93 lines
32. `enemy-factions.js` — 313 lines
33. `enemy-tactical-ai.js` — 227 lines
34. `debug-balance.js` — 299 lines
35. `hardcore-combo.js` — 434 lines
36. `stage-plans.js` — 315 lines
37. `hc-hitbox-config.js` — 427 lines
38. `hc-hitbox-debug.js` — 450 lines
39. `hc-hitbox-fairness.js` — 340 lines
40. `hc-wc-setpieces.js` — 532 lines
41. `hc-wc-enforcement.js` — 618 lines
42. `hc-wc-choreography.js` — 713 lines
43. `hc-wc-profiles.js` — 1195 lines
44. `hc-wave-composer.js` — 885 lines
45. `hc-pattern-debug.js` — 613 lines
46. `hc-90-background.js` — 240 lines
47. `hc-97-atmosphere.js` — 212 lines
48. `game-config.js` — 817 lines
49. `hardcore-config.js` — 776 lines
50. `sprite-system.js` — 689 lines
51. `scores.js` — 1213 lines
52. `hardcore-rank.js` — 1523 lines
53. `medals.js` — 426 lines
54. `render-entities.js` — 532 lines
55. `entities.js` — 1357 lines
56. `audio-music-gen.js` — 1018 lines

**Validate after each batch.** If any file unexpectedly breaks, revert it individually.

### Phase 2 — Low Risk (need window. prefix or simple fix)
Apply `'use strict'` after converting bare assignments to `window.xxx =`:

1. `draw.js` — convert `nameCursorBlink` reference to `window.nameCursorBlink`
2. `state.js` — convert `activeControlDeckSkin` to `window.activeControlDeckSkin`
3. `boss-patterns.js` — ensure `progress` is local `var` or use `window.progress`
4. `boss-director.js` — review all assignments (2985 lines, currently dead code)
5. `hc-pattern-director.js` — review all assignments
6. `encounter-director.js` — already has `'use strict'`, verify

### Phase 3 — Architectural Refactor Required (DO NOT TOUCH without prep)
These files load BEFORE `game.js` and assign to `game.js`-declared vars. They need explicit `window.xxx =` prefixes OR the declarations need to be hoisted to an earlier file.

| Priority | File | Lines | Game vars assigned |
|----------|------|-------|--------------------|
| 1 | `combat.js` | 92 | `lastShotTime` |
| 2 | `name-entry.js` | 87 | `currentLetterIndex`, `enteringName`, `playerName` |
| 3 | `reset.js` | 94 | `bullets`, `enemyBullets`, `enemies`, `particles`, `powerUps`, `continueCount`, `debugLevelJumpText`, `debugLevelJumpTimer`, `extraLivesEarned` |
| 4 | `ui.js` | 330 | `debugLevelJumpText`, `debugLevelJumpTimer` |
| 5 | `update.js` | 174 | `animationFrame`, `levelClearTimer`, `pendingNextLevel`, `prevPlayerX`, `prevPlayerY`, `waveAnnounceText`, `waveAnnounceTimer`, `waveAnnounceSubText`, `waveAnnounceSubTimer` |
| 6 | `update-prelude.js` | 172 | `hitstopTimer`, `invincibleTimer`, `isInvincible`, `setPieceIntroResolved` |
| 7 | `enemy-attacks.js` | 325 | `enemyLastShot`, `setPieceBurstDelayTimer`, `setPieceBurstShotsRemaining`, `setPieceBurstVariant`, `setPieceFireTimer`, `setPieceLaneIndex`, `setPieceTelegraphSide`, `setPieceTelegraphTimer` |
| 8 | `enemy-movement.js` | 349 | `setPiecePatternTimer` |
| 9 | `enemy-pattern-hooks.js` | 633 | `bulletSpeed` |
| 10 | `stage-director.js` | 870 | `setPieceBannerText`, `setPieceBannerTimer` |
| 11 | `update-enemies.js` | 1247 | `bossDefeated`, `enemyLastShot`, `enemySpeedX`, `invincibleTimer`, `isInvincible`, `setPieceIntroTimer` |
| 12-14 | `boss-director.js`, `hc-pattern-director.js`, `draw.js` | Large | Multiple — audit individually |

---

## 6. Quick Wins (Top 10 Easiest)

| # | File | Lines | Effort |
|---|------|-------|--------|
| 1 | `runtime.js` | 7 | Add 1 line |
| 2 | `game-loop.js` | 38 | Add 1 line |
| 3 | `renderer.js` | 12 | Add 1 line |
| 4 | `utils.js` | 14 | Add 1 line |
| 5 | `collisions.js` | 24 | Add 1 line |
| 6 | `transitions.js` | 28 | Add 1 line |
| 7 | `navigation.js` | 39 | Add 1 line |
| 8 | `entity-manager.js` | 43 | Add 1 line |
| 9 | `input-manager.js` | 50 | Add 1 line |
| 10 | `game.js` | 198 | Already uses let/const, add 1 line |

**These 10 files cover all the architectural glue with zero risk.** Start here.

---

## 7. Verification Protocol

For each file after adding `'use strict'`:

```bash
# Syntax check
node --check www/<file>.js

# Full project validation
npm run validate

# Manual smoke test
npm run serve  # Load in browser, verify START → gameplay → game over
```

No automated tests exist beyond syntax validation (`validate-galaxy.js`). Manual smoke test is required.

---

## 8. Rollback

Any file can be reverted individually:

```bash
git checkout HEAD~1 -- www/<file>.js
```

Or full rollback:

```bash
git revert <commit>
```

---

## 9. Why Not Just Move game.js Earlier?

Moving `game.js` to position ~5 in the load order would:
- Make ~50 files SAFE for strict mode instantly
- Eliminate the need for `window.xxx` prefixes in Phase 3 files

**Risk:** Scripts before game.js may reference `window.gameConfig`, `player`, `boss`, `state`, etc. that are only available after `config.js`, `state.js`, and `factories.js` run.

**Alternative:** Create `www/globals.js` (loaded first) that pre-declares ALL shared variables:

```javascript
'use strict';
// Pre-declare all game.js state variables as window properties
window.bullets = [];
window.enemyBullets = [];
window.enemies = [];
// ... etc
```

Then `game.js` can reference the same `window.xxx` variables. This is a larger refactor but would unlock strict mode for all 74 sloppy-mode files.

---

## 10. Summary

| Category | Count | Total Lines |
|----------|-------|-------------|
| Already strict | 2 | 515 |
| SAFE (can add now) | 56 | ~30,000 |
| RISKY but verified SAFE | 8 | ~3,000 |
| DO NOT TOUCH | 14 | ~13,500 |
| **Total** | **76** | **~46,500** |

**Recommendation:** Start with the 10 quick-win files (Phase 1 top 10). Validate. Then proceed through Phase 1 in batches of 5-10 files. Hold Phase 2 and 3 until Phase 1 is complete and stable.
