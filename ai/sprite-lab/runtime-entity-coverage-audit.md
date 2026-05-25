# Runtime Entity Coverage Audit — Galaxy Raiders

**Date:** 2026-05-24
**Phase:** Runtime Visual Coverage Debug
**Prior:** Commit `34c2d2c` — Phase A Integration
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. EXECUTIVE SUMMARY

**No enemy type can be truly invisible under default configuration.** All 7 runtime enemy types have a Tier 3 pixel-art fallback (`SPRITES['alienN_a']`) that guarantees rendering. The "ghost enemy" reports are most likely caused by one of three scenarios:

1. **Faint ghost rectangles** (alpha 0.015-0.025) drawn before sprites load — visible as "ghosts"
2. **Config `fallbackToLegacy: false`** disabling the innermost fallback callback in `drawSpriteFrame`
3. **Race condition during sprite loading** where an enemy spawns before its sprite image finishes loading, but after other enemies' sprites load — creating contrast between visible and "ghost" enemies

---

## 2. ENEMY TYPE INVENTORY

### 2.1 Runtime-Spawned Types (via `createEnemy()`)

| # | Type | HP | Speed | Faction | Role | Bullet Style | Spawns Via |
|---|------|----|-------|---------|------|-------------|------------|
| 1 | `alien1` | 1 | 1.0 | scout | sweeper | fast | Formations, shmup, waves |
| 2 | `alien2` | 1 | 1.0 | scout | sniper | fast | Formations, shmup, waves |
| 3 | `alien3` | 2 | 0.6 | suppressor | diver | tank | Waves, tanks special |
| 4 | `alien4` | 1 | 2.0 | scout | suppressor | fast | Swarms, shmup, formations |
| 5 | `alien5` | 1 | 1.5 | scout | chaser | fast | Kamikazes, formations |
| 6 | `alien6` | 1 | 0.8 | splitter | flanker | splitter | Splitters, formations |
| 7 | `alien_mini` | 1 | 1.8 | scout | baiter | fast | Split from alien6 |

**No other types can be spawned** — all role strings (sweeper, sniper, etc.) are metadata translated to these 7 types before `createEnemy()`.

### 2.2 Non-Combat Entities

| Entity | Type | Managed Via | Not in `enemies[]` |
|--------|------|------------|-------------------|
| `ufo` | Bonus | `ufo.active` | Yes |
| `boss` | Boss | `boss.active` | Yes |

---

## 3. RENDER COVERAGE MATRIX

### 3.1 Tier 0: HC Art Sprites (Highest Priority)

| Type | Scout Override? | Scout Sprite | Fallback Fleet Sprite | Frame Size |
|------|----------------|-------------|----------------------|------------|
| `alien1` | **Yes** | `faction_scout` f:0, s:0.50 | `fleet_scout` s:1.36 | 128x128 / 16x16 |
| `alien2` | **Yes** | `faction_scout` f:2, s:0.50 | `fleet_scout` s:1.42 | 128x128 / 16x16 |
| `alien3` | No | — | `fleet_suppressor` s:0.96 | 28x32 |
| `alien4` | **Yes** | `faction_scout` f:1, s:0.48 | `fleet_interceptor` s:1.04 | 128x128 / 24x24 |
| `alien5` | **Yes** | `faction_scout` f:3, s:0.46 | `fleet_interceptor` s:1.08 | 128x128 / 24x24 |
| `alien6` | No | — | `fleet_suppressor` s:0.92 | 28x32 |
| `alien_mini` | **Yes** | `faction_scout` f:3, s:0.42 | `fleet_scout` s:0.92 | 128x128 / 16x16 |

### 3.2 Tier 1: Animated `_strip` Sprites

| Type | Strip Sprite ID | Status |
|------|----------------|--------|
| `alien1` | `alien1_strip` | ✅ Registered |
| `alien2` | `alien2_strip` | ✅ Registered |
| `alien3` | `alien3_strip` | ✅ Registered |
| `alien4` | `alien4_strip` | ✅ Registered |
| `alien5` | `alien5_strip` | ✅ Registered |
| `alien6` | `alien6_strip` | ✅ Registered |
| `alien_mini` | **—** | ❌ **Not registered** (`getEnemySpriteId` returns null) |

### 3.3 Tier 2: Static Sprites

| Type | Static Sprite ID | Status |
|------|-----------------|--------|
| `alien1` | `alien1` | ✅ Registered |
| `alien2` | `alien2` | ✅ Registered |
| `alien3` | `alien3` | ✅ Registered |
| `alien4` | `alien4` | ✅ Registered |
| `alien5` | `alien5` | ✅ Registered |
| `alien6` | `alien6` | ✅ Registered |
| `alien_mini` | **—** | ❌ **Not registered** |

### 3.4 Tier 3: Pixel Art (Ultimate Fallback)

| Type | SPRITES Key | Rows × Cols | Render Size (size × cells) | Status |
|------|------------|-------------|---------------------------|--------|
| `alien1` | `alien1_a` / `_b` | 8×8 | 24×24 | ✅ |
| `alien2` | `alien2_a` / `_b` | 8×11 | 24×33 | ✅ |
| `alien3` | `alien3_a` / `_b` | 8×10 | 24×30 | ✅ |
| `alien4` | `alien4_a` / `_b` | 6×7 | 18×21 | ✅ |
| `alien5` | `alien5_a` / `_b` | 6×7 | 18×21 | ✅ |
| `alien6` | `alien6_a` / `_b` | 8×11 | 24×33 | ✅ |
| `alien_mini` | `alien_mini_a` / `_b` | 4×4 | 12×12 | ✅ |

---

## 4. VULNERABILITY ANALYSIS

### 4.1 HIGH: alien_mini has missing middleware render tiers

`alien_mini` has NO `_strip` animated sprite and NO static sprite. When HC art sprites (faction_scout + fleet_scout) are not loaded, it falls directly from Tier 0 to Tier 3 pixel art — skipping Tiers 1 and 2 entirely. This means `alien_mini` always draws the ghost placeholder rectangles (at alpha 0.015/0.025) whenever HC art isn't loaded, while other types smoothly degrade through `_strip` or static sprites.

**Visibility:** Ghost rectangles drawn, then pixel art renders immediately after. Pixel art is always visible. **The ghost rectangles are the "ghost" visual.**

### 4.2 MEDIUM: Config `fallbackToLegacy: false` disables inner fallback

In `sprite-system.js:16`:
```js
function shouldFallbackToLegacy() {
    return spriteConfig.fallbackToLegacy !== false;
}
```

If set to `false`, the `runFallback()` callback inside `drawSpriteFrame` returns without drawing. This means when a registered sprite fails to load (`image.onerror` → `sprite.missing = true`), `drawSpriteFrame` draws nothing and returns `false`. The enemy becomes truly invisible — only the ghost rectangles at alpha 0.025 remain visible.

**Trigger:** Any registered sprite whose image file is broken, missing, or 404s.

**Likely ghost scenario:** If `faction_scout` PNG is registered but the file path is wrong or the server returns 404, `isSpriteReady('faction_scout')` returns false, the code falls through to `fleet_scout`, fleet_scout renders, but the ghost rectangles for the "failed" faction_scout check are already drawn. If fleet_scout also fails, fallback continues but ghost rectangles are visible.

### 4.3 LOW: Ghost rectangle alpha smear

The ghost placeholder code at `draw.js` lines 4851-4857 sets `ctx.globalAlpha = 0.015` and `0.025` and draws fillRects. The next code that resets alpha is the `spawnFlashTimer` block (line 4868: `ctx.globalAlpha = Math.max(0.58, 1 - spawnT)`). If `spawnFlashTimer <= 0`, alpha resets to 1. However, if an enemy has `_entranceTimer` still active, the alpha could be further reduced by subsequent code, potentially keeping the ghost rectangles faintly visible alongside the main render.

---

## 5. GHOST ENEMY ROOT CAUSE ANALYSIS

### Most Likely Cause: alien_mini during sprite loading gap

1. `alien6` splits, spawning `alien_mini` entities
2. `faction_scout` sprite is still loading (large 512×128 PNG)
3. `getHCArtEnemyVisual(alien_mini)` → tries faction_scout → not ready → tries fleet_scout → not ready → returns null
4. `getEnemyAnimatedSpriteId(alien_mini)` → HC art is null → getEnemySpriteId returns null → returns null
5. `isEnemyAnimatedSpriteReady(alien_mini)` → false → **ghost rectangles drawn at alpha 0.015/0.025**
6. `drawEnemySpriteOrLegacy` → spriteId is null → **falls to pixel art: `SPRITES['alien_mini_a']`** → size=2 → draws 8×8px colored squares
7. **The ghost rectangles (alpha 0.015/0.025) are visible as faint "shadows" BEFORE the pixel art renders**

However, the pixel art DOES render. The "ghost" effect is the **contrast** between enemies that have loaded HC art sprites (crisp 128x128 faction graphics) and enemies that haven't (tiny 12×12 pixel squares). The pixel art is drawn correctly — it's just so small (12×12 at size=2) that it looks like a faint dot compared to a 48px faction sprite.

### Second Most Likely Cause: Broken faction_scout image path

If the faction_scout PNG URL returns 404, and `fallbackToLegacy` is false, the chain is:
1. `faction_scout` → loading fails → `sprite.missing = true`
2. `isSpriteReady` returns false
3. Falls through to fleet_scout → if ready, renders fleet_scout
4. If fleet_scout also fails/not ready → falls to `_strip` or pixel art
5. If `fallbackToLegacy` is false at the inner callback level → truly invisible

---

## 6. COVERAGE GAPS SUMMARY

| Gap | Severity | Enemy Types Affected | Symptom |
|-----|----------|---------------------|---------|
| alien_mini missing middleware sprites | MEDIUM | `alien_mini` only | Always shows ghost rectangles before pixel art |
| `fallbackToLegacy` can disable inner safety net | MEDIUM | All types, if configured | Truly invisible enemies under config change |
| Ghost rectangles at 0.025 alpha | LOW | All types during loading | Faint shadows before sprites load |
| No `_SPRITE_LAB_SCOUT_MAP` entry for alien3/alien6 | NONE | N/A | Correctly falls through to HCART_ENEMY_VISUALS |

---

## 7. VERIFIED: Phase A Scout Override Correctness

**`getHCArtEnemyVisual()` correctly handles Scout-only override:**

| Type | Steps Through | Final Sprite | Correct? |
|------|--------------|-------------|----------|
| alien1 | `_SPRITE_LAB_SCOUT_MAP` → `faction_scout` if ready, else `fleet_scout` | Scout sprite | ✅ |
| alien2 | Same as alien1 | Scout sprite | ✅ |
| alien3 | **Skips override** → `HCART_ENEMY_VISUALS` → `fleet_suppressor` | Suppressor sprite | ✅ |
| alien4 | `_SPRITE_LAB_SCOUT_MAP` → `faction_scout` if ready, else `fleet_interceptor` | Scout sprite | ✅ |
| alien5 | Same as alien4 but frame 3 | Scout sprite | ✅ |
| alien6 | **Skips override** → `HCART_ENEMY_VISUALS` → `fleet_suppressor` | Suppressor sprite | ✅ |
| alien_mini | `_SPRITE_LAB_SCOUT_MAP` → `faction_scout` if ready, else `fleet_scout` | Scout sprite | ✅ |

**The Phase A Scout override does NOT hijack non-Scout enemy types.** Suppressor (alien3) and Splitter (alien6) enemies correctly render with their own fleet sprites.

---

## 8. RUNTIME RISK ASSESSMENT

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| alien_mini appears as "ghost" during loading | Medium | Visual only, pixel art always renders | Add `alien_mini_strip` registration |
| faction_scout PNG fails to load | Low | Falls through fleet_scout → strip → pixel art | Verify file path in registration |
| `fallbackToLegacy: false` set in config | Low | Inner fallback disabled | Add runtime warning if config disables fallback |
| Ghost rectangles visible in contrast | Low | Faint 0.025 alpha shapes | No action needed — intentional loading indicator |

---

*Generated by runtime entity coverage audit — no gameplay, AI, or balance modifications performed.*
