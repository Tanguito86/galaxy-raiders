# Runtime Entity Coverage Fixes — Galaxy Raiders

**Date:** 2026-05-24
**Based on:** Runtime Entity Coverage Audit (2026-05-24)
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. FIX PRIORITIES

| # | Fix | Severity | Type |
|---|-----|----------|------|
| F1 | Register `alien_mini_strip` animated sprite | MEDIUM | Missing middleware |
| F2 | Register `alien_mini` static sprite | MEDIUM | Missing middleware |
| F3 | Add `fleet_scout_16` visual bounds for alien_mini scale context | LOW | Cosmetic |
| F4 | Add runtime warning when `fallbackToLegacy: false` | LOW | Safety net |

---

## 2. FIX F1: Register alien_mini_strip

### Problem
`alien_mini` has no `_strip` animated sprite. When fleet sprites aren't loaded, it falls directly from Tier 0 to Tier 3 (pixel art), always drawing ghost rectangles. All other types (alien1-6) have `_strip` sprites that provide smooth degradation.

### Fix
Register a basic animated strip for `alien_mini` using the existing `alien_mini` pixel design as a single-frame strip, or reuse the `alien1-strip` sprite at a smaller scale.

**Option A: Create from existing assets**
```js
// sprite-system.js — add after alien6_strip registration
registerSprite("alien_mini_strip", {
    src: "assets/sprites/alien1-strip.png",  // reuse alien1 strip
    frameWidth: 32,
    frameHeight: 32,
    animations: {
        idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#7cff6b"
});
```

**Option B: Single-frame sprite (simpler)**
```js
registerSprite("alien_mini", {
    src: "assets/sprites/alien1.png",  // reuse alien1 base sprite
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#7cff6b"
});
```

### Validation
- `getEnemySpriteId()` must include `alien_mini` in its whitelist OR a separate check
- `getEnemyAnimatedSpriteId()` will find `alien_mini_strip` when HC art not ready
- `isEnemyAnimatedSpriteReady()` will return true when strip loaded → ghost skipped

### Files to Modify
- `www/sprite-system.js` — add registration
- `www/draw.js` — add `alien_mini` to `getEnemySpriteId()` whitelist (line ~4579)

### Kill Switch Compatibility
No kill switch needed — this is a middleware fallback, not a visual override. It fills the gap between HC art and pixel art.

---

## 3. FIX F2: Fix getEnemySpriteId() for alien_mini

### Problem
`getEnemySpriteId()` at draw.js line 4637-4641 only whitelists `alien1` through `alien6`. `alien_mini` returns `null`. This blocks the `_strip` animated sprite fallback and the static sprite fallback for alien_mini.

### Fix
Add `alien_mini` to the whitelist:

```js
function getEnemySpriteId(e) {
    if (!e) return null;
    if (e.type === 'alien1' || e.type === 'alien2' || e.type === 'alien3' ||
        e.type === 'alien4' || e.type === 'alien5' || e.type === 'alien6' ||
        e.type === 'alien_mini') {  // ← ADDED
        return e.type;
    }
    return null;
}
```

### Files to Modify
- `www/draw.js` — line 4637, add ` || e.type === 'alien_mini'`

---

## 4. FIX F3: Add alien_mini to visual bounds (Optional)

### Problem
`getEnemySpriteVisualBounds()` has no entry for `alien_mini` or its derived sprite IDs. When alien_mini renders via any SpriteSystem path, the visual bounds lookup returns null, defaulting to the full frame size.

### Fix
```js
function getEnemySpriteVisualBounds(spriteId) {
    var bounds = {
        // ... existing entries ...
        alien_mini: { x: 2, y: 2, width: 10, height: 10 },
        alien_mini_strip: { x: 2, y: 2, width: 10, height: 10 }
    };
    return bounds[spriteId] || null;
}
```

### Files to Modify
- `www/draw.js` — `getEnemySpriteVisualBounds()` function

---

## 5. FIX F4: Runtime Warning for fallbackToLegacy Disabled (Optional)

### Problem
If `spriteConfig.fallbackToLegacy` is set to `false`, the `drawSpriteFrame` inner fallback callback silently returns without drawing. An enemy whose registered sprite fails to load becomes truly invisible — only ghost rectangles are visible.

### Fix
Add a one-time console warning when `shouldFallbackToLegacy()` is false during an active game:

```js
// In draw.js, inside drawEnemySpriteOrLegacy:
// Track whether warning was emitted
if (!spriteId || !window.SpriteSystem) {
    // ... existing pixel art fallback ...
}

// After the SpriteSystem rendering path:
if (!window._warnedFallbackDisabled && typeof shouldFallbackToLegacy === 'function' && !shouldFallbackToLegacy()) {
    console.warn('[SPRITE LAB] Pixel-art fallback is disabled. Enemies whose sprites fail to load will be invisible.');
    window._warnedFallbackDisabled = true;
}
```

### Files to Modify
- `www/draw.js` — add warning after line ~4793 (end of drawEnemySpriteOrLegacy)

---

## 6. FIX F5: Add ghost rectangle alpha reset guard (Low priority)

### Problem
Ghost rectangles at alpha 0.015/0.025 are drawn unconditionally for enemies without HC art sprites. The alpha reset relies on later code in the render loop. If an enemy's render path is modified in the future, the ghost alpha could bleed.

### Fix
Save/restore context around ghost rectangle block:

```js
ctx.save();
if (!isEnemyAnimatedSpriteReady(e)) {
    ctx.globalAlpha = 0.015;
    ctx.fillStyle = color;
    ctx.fillRect(e.x - 2, e.y - 2, e.w + 4, e.h + 4);
    ctx.globalAlpha = 0.025;
    ctx.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2);
}
ctx.restore();
```

Note: A `ctx.save()` already exists a few lines before (line 4850). This fix just adds a restore before proceeding.

### Files to Modify
- `www/draw.js` — wrap ghost block in save/restore

---

## 7. COVERAGE COMPLETION ORDER

| Order | Fix | Impact | Files | Risk |
|-------|-----|--------|-------|------|
| **1** | F2: Add alien_mini to getEnemySpriteId() | Unblocks _strip fallback | draw.js | SAFE — 1 line change |
| **2** | F1: Register alien_mini_strip | Provides middleware fallback | sprite-system.js | SAFE — new registration |
| **3** | F1b: Register alien_mini static | Provides static fallback | sprite-system.js | SAFE — new registration |
| **4** | F5: Ghost rectangle save/restore guard | Prevents alpha bleed | draw.js | SAFE — visual cleanup |
| **5** | F4: Runtime fallback-disabled warning | Safety net awareness | draw.js | SAFE — console only |

---

## 8. FILES TO MODIFY (SAFE Changes Only)

| File | Changes | Gameplay Impact |
|------|---------|-----------------|
| `www/draw.js` | Add `alien_mini` to `getEnemySpriteId()` whitelist | None — visual only |
| `www/draw.js` | Add `alien_mini` to `getEnemySpriteVisualBounds()` | None — centering only |
| `www/draw.js` | Optional: ghost rectangle save/restore guard | None — alpha hygiene |
| `www/draw.js` | Optional: fallback-disabled warning | None — console only |
| `www/sprite-system.js` | Register `alien_mini_strip` and/or `alien_mini` static | None — new sprite |

**No gameplay, hitbox, AI, collision, rank, or balance files modified.**

---

## 9. VERIFICATION CHECKLIST

- [ ] `alien_mini` renders via `_strip` sprite when HC art not loaded (no ghost rectangles)
- [ ] `alien_mini` renders via static sprite when `_strip` not loaded
- [ ] `alien_mini` pixel art fallback still works if all sprites fail
- [ ] `faction_scout` override still applies to alien_mini when Scout override enabled
- [ ] `fleet_scout` fallback still applies to alien_mini when Scout override disabled
- [ ] alien3 and alien6 unchanged — still use fleet_suppressor
- [ ] No enemy types lost visual coverage

---

*Generated by runtime entity coverage fixes — no gameplay modifications performed.*
