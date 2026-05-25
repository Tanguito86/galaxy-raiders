# Crabtron Hero Integration Roadmap

**Date:** 2026-05-24
**Based on:** Crabtron Hero Runtime Audit (2026-05-24)
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. CURRENT STATE

The Crabtron Hero Kit is **partially integrated** via a hybrid rendering path in `draw.js`. When the hero sprite sheet is loaded, legacy armor/body rendering is suppressed and hero layers are drawn instead. However, some legacy elements (core, hit flash) still draw on top of hero layers, and the hero scale is hardcoded rather than driven by metadata.

**Fallback strategy is already in place:** If the hero sprite fails to load, the system transparently falls back to legacy rendering. No rollback risks exist.

---

## 2. SAFE MIGRATION ORDER

### Phase A: Cleanup (Non-Destructive)

| Step | File | Change | Risk | Rollback |
|------|------|--------|------|----------|
| A1 | `draw.js` | Gate `drawCrabtronCore` behind `!_crabtronHeroReady` (add condition at line ~4329) | **None** — only affects visual when hero is loaded | Remove the `!_crabtronHeroReady` guard |
| A2 | `draw.js` | Gate legacy flash effect behind `!_crabtronHeroReady` (add condition at line ~4346) | **None** — flash effect is useless on hero | Remove the guard |
| A3 | `draw.js` | Document that `_crabtronHeroReady` gate block now covers: glow, dark aura, arms, armor, body sprite, core, flash — only telegraphs + muzzle flash + crosshair draw on top | **None** — documentation only | N/A |

**Freeze boundary after Phase A:** Crabtron now renders clean hero visuals with telegraphs and muzzle flash on top. Legacy rendering preserved as dead code behind `!_crabtronHeroReady` guards.

### Phase B: Scale Tuning (Conservative)

| Step | File | Change | Risk | Rollback |
|------|------|--------|------|----------|
| B1 | `sprite-system.js` | Add Crabtron-specific readability multiplier to `_CRABTRON_HERO_META` (e.g., `readabilityMult: 1.0`) | **Low** — visual only | Revert to hardcoded 0.45 |
| B2 | `draw.js` | Read `_heroScale` from metadata: `getCrabtronHeroMeta().scaleHint * (getCrabtronHeroMeta().readabilityMult || 1.0)` instead of hardcoded `0.45` | **Low** — retains same default if metadata unchanged | Revert to hardcoded literal |
| B3 | `draw.js` | Clamp hero scale to `[0.35, 0.60]` (wider range than current `[0.38, 0.55]` to accommodate metadata-driven values) | **Low** — wider clamp is more permissive | Revert clamp bounds |

**Freeze boundary after Phase B:** Hero scale is now metadata-driven. Changing `scaleHint` in `_CRABTRON_HERO_META` changes the render without touching `draw.js`.

### Phase C: Code Hygiene (Optional, Low Priority)

| Step | File | Change | Risk | Rollback |
|------|------|--------|------|----------|
| C1 | `draw.js` | Add comment block documenting the hybrid rendering architecture | **None** | N/A |
| C2 | `draw.js` | Consider extracting Crabtron-specific rendering into a separate `draw-crabtron.js` module | **Medium** — refactoring risk in a 6500-line file | Revert extraction |
| C3 | `sprite-system.js` | Populate `bosses/crabtron/` with organized hero assets | **None** — file copy only | Delete copied files |

**Freeze boundary after Phase C:** Code is documented, organized, and maintainable. Legacy dead code remains for emergency rollback.

---

## 3. ROLLBACK STRATEGY

### 3.1 Instant Rollback

The current hybrid architecture provides **automatic rollback**: if `window.SpriteSystem.isSpriteReady('boss_crabtron_hero')` returns `false`, all legacy rendering resumes instantly. No code changes needed.

### 3.2 Manual Rollback Triggers

| Trigger | Action | Effect |
|---------|--------|--------|
| Hero sheet fails to load | `_crabtronHeroReady` stays `false` | Full legacy rendering |
| Hero sheet path changes | Update `src` in registration | Re-resolves on next load |
| Hero metadata corrupted | `_CRABTRON_HERO_META` uses defaults | Hero may render with wrong dimensions |
| Legacy assets deleted | Legacy rendering gated — no effect when hero ready | Safe to delete after Phase A verified |

### 3.3 Emergency Kill Switch (Recommended)

Add a config toggle (already partially exists):

```js
// In game-config.js or hardcore-config.js:
enableCrabtronHeroRender: true  // set to false to force legacy rendering
```

Then in draw.js, change:
```js
var _crabtronHeroReady = (
  boss.pattern === 'crossfire' &&
  config.enableCrabtronHeroRender !== false &&  // new kill switch
  window.SpriteSystem &&
  window.SpriteSystem.isSpriteReady('boss_crabtron_hero')
);
```

---

## 4. INTEGRATION CHECKPOINTS

### Checkpoint 1: Asset Load Verification
- Confirm `boss_crabtron_hero` is registered in sprite-system.js
- Confirm the master sheet loads from `ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png`
- Verify `getCrabtronHeroMeta()` returns valid metadata
- Verify `getCrabtronHeroFrame(state, layer)` returns valid frame data

### Checkpoint 2: Phase A Complete
- Crabtron boss fights render hero layers without legacy core overlay
- Muzzle flash renders on top of hero layers correctly
- Shoot/dash telegraphs appear on top of hero layers correctly
- White crosshair at boss center visible
- Legacy assets still load and render if hero sheet unavailable

### Checkpoint 3: Phase B Complete
- Hero scale adjusts when `_CRABTRON_HERO_META.scaleHint` changes
- Hero scale stays within `[0.35, 0.60]` clamp
- Small screen boost applies to hero scale
- Visual comparison: hero renders at intended gameplay size

### Checkpoint 4: Production Freeze
- All 5 hero states render correctly:
  - `idle` — default boss state, subtle breath glow
  - `attack_windup` — dashing or pre-fire, visible glow increase
  - `mid_damage` — flash timer active, damage glow overlay
  - `rage_phase` — phase 3 (<33% HP), intense glow
  - `death_exposed_core` — boss dead, max glow
- State transitions are smooth (no flicker between states)
- Core pulse animation works in all states
- Shadow layer renders with correct opacity per state
- Layers composite in correct z-order

---

## 5. FREEZE BOUNDARIES

### DO NOT MODIFY (Frozen)
- `boss.w = 90, boss.h = 45` (hitbox)
- `boss.x, boss.y` (position)
- `boss.pattern = 'crossfire'` (identity)
- `initBoss()` (boss creation)
- `getBossPhase()` / `updateBossPhase()` (phase logic)
- All boss pattern functions in `boss-patterns.js`
- All signature hook functions in `update-boss.js`
- `boss-director.js` profile data
- `boss-ai-movement.js` profile data
- `stage-plans.js` stage definitions
- `entities.js` death explosion
- `game-config.js` boss scoring/ranking/HUD
- `hardcore-config.js` hardcore toggles
- Legacy sprite registration in `sprite-system.js` (keep for fallback)
- Legacy pixel data in `state.js` (keep for fallback)

### SAFE TO MODIFY (Visual Only)
- `draw.js` — hero scale, hero layer draw order, core/telegraph gating
- `sprite-system.js` — `_CRABTRON_HERO_META` values (scaleHint, readabilityMult)
- `game-config.js` — add `enableCrabtronHeroRender` kill switch (no effect on gameplay)

---

## 6. RECOMMENDED RENDER SCALE

| Context | Current | Recommended | Rationale |
|---------|---------|-------------|-----------|
| Default scale | 0.45 (hardcoded) | `scaleHint` from metadata (0.55) | Follows asset author intent |
| Readability boost | None for hero | `readabilityMult: 1.0` for hero (optional) | Parity with legacy readability mult system |
| Small screen boost | Same multiplier applied | Keep existing `_smallScreenBoost` logic | Consistent with all bosses |
| Clamp range | [0.38, 0.55] | [0.35, 0.65] | Wider range for metadata flexibility |
| Visual size at 0.55 | 106×106 px | — | At 0.55, hero is 106px vs legacy 69px — significantly more visible |

**Recommendation:** Test at `scaleHint: 0.55` (metadata default) before committing to production. The 0.45 current value may have been chosen conservatively during initial integration. ScaleHint 0.55 would make the hero 106×106 pixels — very readable but may feel large at level 5 on small screens.

---

## 7. SPRITE REPLACEMENT SEQUENCE

The hero doesn't "replace" the legacy sprite — it **coexists** with automatic fallback:

1. **Load phase:** SpriteSystem loads `boss_crabtron_hero` sheet (449 KB, 1536×960)
2. **Activation:** When sheet loads, `_crabtronHeroReady` flips to `true`
3. **Rendering:** draw.js renders hero layers, suppresses legacy armor/body
4. **Fallback:** If sheet fails/unavailable, `_crabtronHeroReady` stays `false`, legacy renders
5. **Cleanup:** After Phase A, legacy core and flash are also suppressed when hero ready
6. **Archive:** After production validation, legacy `boss_crabtron` sprite and pixel data can be archived (not deleted — keep for emergency)

---

## 8. RISK ASSESSMENT MATRIX

| Change | Impact Scope | Risk Level | Reversibility |
|--------|-------------|------------|---------------|
| Gate `drawCrabtronCore` behind hero ready | Visual only | **None** | Fully reversible |
| Gate flash effect behind hero ready | Visual only | **None** | Fully reversible |
| Metadata-driven scale | Visual only | **Low** | Revert to hardcoded |
| Widen scale clamp range | Visual only | **Low** | Revert clamp bounds |
| Add `enableCrabtronHeroRender` kill switch | Config + visual | **None** | Disable with config flag |
| Extract Crabtron rendering to module | Structural | **Medium** | Revert extraction |
| Delete legacy sprite assets | Asset deletion | **High** | Only if backup exists |

**Recommendation:** Execute Phase A immediately. Defer Phase C (code extraction) until after Phase A+B are production-validated for at least one release cycle.

---

*Generated by Crabtron hero integration roadmap — no gameplay, hitboxes, AI, or balance modifications performed.*
