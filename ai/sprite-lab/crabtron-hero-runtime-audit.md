# Crabtron Hero Runtime Integration Audit

**Date:** 2026-05-24
**Phase:** HC-VS-03B — CRABTRON Hero Runtime Integration
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. EXECUTIVE SUMMARY

The Crabtron Hero Kit is **already partially integrated** at runtime. `draw.js` contains a hybrid rendering path that detects hero sprite availability and conditionally replaces legacy armor/body rendering with hero layers. However, the integration is incomplete — legacy fallback code remains active, scale is hardcoded separately from the sprite-system metadata, and the hero render reuse the boss's gameplay hitbox dimensions (w:90, h:45) as its rendering center, which doesn't match the hero's 192x192 frame structure.

**Overall status:** Partially integrated. Functional but not production-optimized.

---

## 2. ACTIVE RUNTIME RENDER PATH

### 2.1 Detection Logic (draw.js:4162)

```js
var _crabtronHeroReady = (
  boss.pattern === 'crossfire' &&
  window.SpriteSystem &&
  window.SpriteSystem.isSpriteReady('boss_crabtron_hero')
);
```

When the hero sprite sheet (`ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png`) is loaded into the SpriteSystem registry, `_crabtronHeroReady` flips to `true` and the legacy rendering is suppressed.

### 2.2 Conditional Rendering (draw.js:4162-4357)

| Element | Hero Ready | Legacy Fallback | Notes |
|---------|------------|-----------------|-------|
| Legacy glow/aura | ❌ Suppressed | ✅ Drawn | `ctx.globalAlpha = 0` when hero ready |
| Legacy dark aura | ❌ Suppressed | ✅ Drawn | `ctx.globalAlpha = 0` when hero ready |
| Articulated arms | ❌ Suppressed | ✅ Drawn | Only when `!_crabtronHeroReady` |
| Armor plates | ❌ Suppressed | ✅ Drawn | Only when `!_crabtronHeroReady` |
| Shoot telegraph | ✅ Always | ✅ Always | Independent of hero status |
| Muzzle flash | ✅ Always | ✅ Always | Independent of hero status |
| Dash telegraph | ✅ Always | ✅ Always | Independent of hero status |
| **Hero layers** | ✅ Drawn | ❌ Not drawn | `drawCrabtronHeroLayers()` at line 4290 |
| Legacy body sprite | ❌ Suppressed | ✅ Drawn | `drawBossSpriteOrLegacy()` gated |
| **Crabtron core** | ✅ Always drawn | ✅ Always drawn | Draws on top of hero layers |
| Flash hit effect | ❌ Suppressed | ✅ Drawn | Legacy sprite flash, useless with hero |
| White crosshair | ✅ Always | ✅ Always | Center crosshair at boss center |

### 2.3 Hero State Resolution (draw.js:1353)

```js
function resolveCrabtronHeroState(boss) {
  if (!boss.active) return (dying) ? 'death_exposed_core' : 'idle';
  if (boss.phase === 3) return 'rage_phase';
  if (boss.flashTimer > 0) return 'mid_damage';
  if (boss.dashMode === 'telegraph' || boss.dashMode === true) return 'attack_windup';
  if (boss.shootTimer > shootRate * 0.7) return 'attack_windup';
  if (boss._hcTelegraphType && boss._hcTelegraphTimer > 0) return 'attack_windup';
  return 'idle';
}
```

**5 states mapped to gameplay conditions:**
- `idle` — default, no special activity
- `attack_windup` — dashing or about to shoot
- `mid_damage` — flash timer active (damaged recently)
- `rage_phase` — phase 3 (below 33% HP)
- `death_exposed_core` — boss inactive/dead

---

## 3. HERO ASSET PATHS

### 3.1 Source Assets

| Asset | Path | Size |
|-------|------|------|
| Master sheet | `www/ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png` | 449 KB |
| Metadata JSON | `www/ai-generated/crabtron-hero-20260523/crabtron_hero_metadata.json` | 17 KB |
| Seed (192px) | `www/ai-generated/crabtron-hero-20260523/crabtron_hero_seed_192.png` | 43 KB |
| Readability preview | `www/ai-generated/crabtron-hero-20260523/crabtron_hero_readability_preview.png` | 406 KB |
| Labeled preview | `www/ai-generated/crabtron-hero-20260523/crabtron_hero_preview_labeled.png` | 400 KB |
| Prompt reference | `www/ai-generated/crabtron-hero-20260523/prompt-used.txt` | 611 B |

### 3.2 Layer Files (5 states × 8 layers = 40 PNGs, ~540 KB total)

| State | Composite Size | Layer Files |
|-------|---------------|-------------|
| `idle/` | 43.8 KB | body, cannons_vents, composite, left_claw, overlay_glow_damage, right_claw, shadow, weakpoint_core |
| `attack_windup/` | 45.5 KB | (same 8 layers) |
| `mid_damage/` | 42.8 KB | (same 8 layers) |
| `rage_phase/` | 44.6 KB | (same 8 layers) |
| `death_exposed_core/` | 43.4 KB | (same 8 layers) |

### 3.3 Legacy Assets

| Asset | Path | Size |
|-------|------|------|
| Legacy boss sprite | `www/assets/sprites/boss_crabtron.png` | 12.9 KB |
| Pixel data matrix | `state.js:215-226` | 9×18 grid |
| AI raw source | `www/ai-generated/boss-sprites-20260516/boss_crabtron/raw.png` | 1.83 MB |
| AI clean output | `www/ai-generated/boss-sprites-20260516/boss_crabtron/clean.png` | 12.9 KB |

### 3.4 Sprite Registration (sprite-system.js)

**Hero (line 402):**
```js
registerSprite("boss_crabtron_hero", {
  src: "ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png",
  frameWidth: 192,
  frameHeight: 192,
  fallbackColor: "#ff375f"
});
```

**Legacy (line 410):**
```js
registerSprite("boss_crabtron", {
  src: "assets/sprites/boss_crabtron.png",
  frameWidth: 96,
  frameHeight: 96,
  fallbackColor: "#ff375f"
});
```

### 3.5 Hero Kit Metadata (sprite-system.js:374-388)

```js
var _CRABTRON_HERO_META = {
  cols: 8, rows: 5,
  frameW: 192, frameH: 192,
  layers: ['composite','shadow','body','left_claw','right_claw',
           'weakpoint_core','cannons_vents','overlay_glow_damage'],
  states: ['idle','attack_windup','mid_damage','rage_phase','death_exposed_core'],
  pivot: [96, 96],
  scaleHint: 0.55,
  weakpointPivot: [96, 108],
  weakpointRadius: 15
};
```

---

## 4. COMPATIBILITY FINDINGS

### 4.1 Dimension Chain

| Property | Legacy (96x96) | Hero (192x192) | Impact |
|----------|---------------|-----------------|--------|
| Source frame | 96×96 | 192×192 | Hero has 4x the pixel area |
| Gameplay hitbox | w:90, h:45 | w:90, h:45 | **Unchanged** — no gameplay impact |
| Render scale | ~0.72 (auto-calc) | 0.45 (hardcoded) | See 4.2 below |
| Visual width | ~69 px | ~86 px | Hero is 25% wider visually |
| Visual height | ~69 px | ~86 px | Hero is 91% taller than hitbox h:45 |
| Pivot | Variable (center of boss rect) | [96, 96] (meta) | Hero uses boss center (cx, cy) |

### 4.2 Scaling Conflicts

**Legacy scale calculation (draw.js:4091-4093):**
```
scale = min(boss.w / 96, boss.h / 96) × readabilityMult
      = min(90/96, 45/96) × 1.53
      = 0.46875 × 1.53
      = 0.717
```
Plus optional `_smallScreenBoost` (×1.12) when screen height < 500px → max ~0.80.

**Hero scale (draw.js:4287-4289):**
```
_heroScale = 0.45 (hardcoded)
Clamped: [0.38, 0.55]
```
Plus optional `_smallScreenBoost` when applicable.

**Visual size comparison:**
| Scenario | Legacy Visual Size | Hero Visual Size | Hero/Legacy Ratio |
|----------|-------------------|------------------|--------------------|
| Normal (scale×192/96) | 69×69 px | 86×86 px | 1.25× |
| Small screen (+12%) | 77×77 px | 97×97 px | 1.26× |

The hero renders **~25% larger** than the legacy sprite. This is intentional — it provides better detail visibility and matches the 192px master resolution. The scaleHint in metadata suggests 0.55 as the ideal, but runtime uses 0.45 for safety.

**Risk:** The hardcoded 0.45 scale doesn't reference `_CRABTRON_HERO_META.scaleHint` (0.55). If the metadata changes, the hardcoded scale becomes stale.

### 4.3 Pivot Conflicts

- **Legacy:** Pivot is implicit — center of `(boss.x + boss.w/2, boss.y + boss.h/2)`. The legacy draw functions use boss.w/h to calculate centers within the sprite.
- **Hero:** Pivot is explicit — uses metadata `[96, 96]` rendered at `(cx, cy)` where `cx = boss.x + boss.w/2, cy = boss.y + boss.h/2`.
- **Result:** Both center on the same point. **No pivot conflict.**
- **Weakpoint pivot:** Hero metadata specifies `[96, 108]` — offset 12px below center. Not currently used in draw.js core rendering but available.
- **Weakpoint radius:** 15px (in 192px space, ~6.75px at scale 0.45).

### 4.4 Animation State Conflicts

| Concern | Status | Detail |
|---------|--------|--------|
| State mapping coverage | ✅ Complete | All 5 hero states mapped to gameplay conditions |
| State transitions | ✅ Smooth | Phase changes, damage flash, dash state all trigger correct states |
| Missing states | None | All gameplay conditions covered |
| State priority | ✅ Correct | Phase 3 (rage) > flash (mid_damage) > dash/shoot (attack_windup) > idle |
| Death state timing | ✅ Correct | Hero switches to `death_exposed_core` when `!boss.active` |

### 4.5 Layering Conflicts

**Current hero draw order (draw.js:1382-1507):**
1. shadow → opacity 0.26-0.40 (state-dependent)
2. body
3. left_claw
4. right_claw
5. cannons_vents
6. weakpoint_core → core pulse animation
7. overlay_glow_damage → opacity 0.05-0.58 (state-dependent)

**Legacy elements drawn ON TOP of hero:**
1. Crabtron core (`drawCrabtronCore`) — draws after hero, adds core rings/pulse on top
2. Muzzle flash (`drawCrabtronMuzzleFlash`) — draws after hero
3. Shoot telegraph (`drawCrabtronShootTelegraph`) — draws after hero
4. Dash telegraph (`drawCrabtronDashTelegraph`) — draws after hero
5. White crosshair — draws after hero

**Conflict:** The legacy `drawCrabtronCore` draws additional core rings, a center point, and slot lines on top of the hero's `weakpoint_core` layer. This may double-render the core area with inconsistent visual style (pixel-art legacy core vs. retro-HD hero core). The hero's weakpoint_core layer already contains core rendering — the legacy core overlay is likely redundant and visually jarring.

**Recommendation:** Gate `drawCrabtronCore` behind `!_crabtronHeroReady` like armor plates and arms are.

### 4.6 Emission/Glow Layer Safety

The hero's `overlay_glow_damage` layer uses per-state alpha blending:
- `idle`: 0.05-0.09 (subtle breath)
- `attack_windup`: 0.18-0.28 (visible glow)
- `mid_damage`: 0.28-0.50 (strong damage glow)
- `rage_phase`: 0.32-0.56 (intense rage glow)
- `death_exposed_core`: 0.58-0.80 (bright death glow)

These are **cosmetic alpha overlays only** — they do not affect hitboxes, collision, damage calculation, or AI behavior. **Safe to use.**

---

## 5. READABILITY ANALYSIS

### 5.1 Readability Risks

| Risk | Severity | Detail |
|------|----------|--------|
| Hero larger than hitbox | Low | Boss hitboxes are intentionally compact; players shoot at the visual, not the hitbox. Bosses are large targets. |
| Core overlay redundancy | Medium | Legacy core drawn on top of hero core creates visual noise at the most important recognition point |
| Glow layer at max alpha (0.80) | Low | Death state only — clarity not critical during death animation |
| Small screen scaling | Low | Hero scale (0.45) + boost (1.12) = 0.50, clamped safely at 0.55 max |
| Bullet clutter over hero | Low | Crabtron boss fights are at level 5 (early game), bullet density is moderate |
| Legacy-style core on hero | Medium | The legacy `drawCrabtronCore` draws pixel-art rings on top of the hero's HD core — mismatched art styles |

### 5.2 Android Readability

| Factor | Assessment |
|--------|------------|
| Hero scale at mobile (0.50) | 96 visible pixels — adequate for boss recognition |
| Core contrast | Hero's `weakpoint_core` layer provides strong central recognition |
| Silhouette | 5 distinct claw/body states maintain silhouette even at small scale |
| Peripheral readability | Hero's distinct asymmetric claw layout aids peripheral recognition |
| Small screen height (<500px) | Scale boost keeps hero visible, but less vertical space for boss arena |

---

## 6. RECOMMENDED MIGRATION STRATEGY

### 6.1 Priority Changes

| Priority | Change | Rationale |
|----------|--------|-----------|
| **P1** | Gate `drawCrabtronCore` behind `!_crabtronHeroReady` | Eliminates legacy core overlay on hero, fixes visual inconsistency |
| **P2** | Gate hit flash effect behind `!_crabtronHeroReady` | Legacy flash sprite has no effect on hero rendering |
| **P3** | Use `scaleHint` from metadata instead of hardcoded 0.45 | Keeps runtime in sync with asset metadata |
| **P4** | Remove legacy armor/arms/body sprite code | No longer needed when hero is always available (but keep as dead-code fallback) |
| **P5** | Add hero-scale readability multiplier | Currently hero uses hardcoded 0.45; legacy uses 1.53 readability mult. Hero should have its own readability tuning. |

### 6.2 No-Change Zones

| Zone | Reason |
|------|--------|
| `boss.w = 90, boss.h = 45` | Hitbox dimensions — gameplay critical, must not change |
| `BOSS_LEVELS`, `BOSS_DATA` | Level progression and HP — must not change |
| `boss.pattern = 'crossfire'` | Identity key used everywhere — must not change |
| `boss.x, boss.y` positioning | Entity placement — must not change |
| `initBoss()` entrance animation | Boss intro sequence — must not change |
| All boss pattern functions | Bullet patterns — must not change |
| Signature hooks | Pincer fire behavior — must not change |
| `boss-director.js` profile | Director logic — must not change |
| `boss-ai-movement.js` profile | AI movement — must not change |
| `getBossPhase()` / `updateBossPhase()` | Phase logic — must not change |

---

## 7. ASSET STATUS SUMMARY

| Asset | Status | Ready for Runtime | Notes |
|-------|--------|-------------------|-------|
| Master sheet (449 KB) | ✅ Present | ✅ Yes | Registered at sprite-system.js:402 |
| Metadata JSON (17 KB) | ✅ Present | ✅ Yes | Embedded in sprite-system.js:374-388 |
| Idle layers | ✅ Present | ✅ Yes | 8 layer PNGs |
| Attack windup layers | ✅ Present | ✅ Yes | 8 layer PNGs |
| Mid damage layers | ✅ Present | ✅ Yes | 8 layer PNGs |
| Rage phase layers | ✅ Present | ✅ Yes | 8 layer PNGs |
| Death layers | ✅ Present | ✅ Yes | 8 layer PNGs |
| Legacy sprite (96x96) | ✅ Present | ✅ Yes (fallback) | Keep for rollback |
| `bosses/crabtron/` folder | 🟡 Empty (.gitkeep) | ❌ Not populated | Reserved for organized hero assets |

---

## 8. MIGRATION BLOCKERS

| Blocker | Severity | Detail |
|---------|----------|--------|
| Legacy core overlay on hero | Medium | `drawCrabtronCore` draws pixel-art on top of hero layers — visual inconsistency at the boss's most important recognition point |
| Hardcoded hero scale (0.45) | Low | Drifts from metadata `scaleHint` (0.55) over time |
| Legacy flash effect | Low | Useless with hero rendering; harmless noise |
| No migration blockers found that prevent safe deployment | — | Current hybrid rendering is functional and reversible |

**No blocking issues prevent production deployment of the hero render. The current hybrid path works correctly.** The recommended changes are cleanup and optimization, not critical fixes.

---

*Generated by Crabtron hero runtime audit — no gameplay, hitboxes, AI, or balance modifications performed.*
