# Crabtron Hero Runtime Validation

**Date:** 2026-05-24
**Phase:** HC-VS-03D — Runtime Validation
**Prior cleanup:** Commit `7d1c433` — Hybrid Cleanup Pass

---

## Generated Previews

| File | Size | Description |
|------|------|-------------|
| `www/assets/sprites/previews/runtime/crabtron_hero_runtime_validation.png` | 1100x620 | Full runtime validation — scale comparison, gameplay scenes, weakpoint, states |
| `www/assets/sprites/previews/readability/crabtron_hero_android_readability.png` | 1100x620 | Android/mobile readability — small screen sim, silhouette at distance, heavy effects |

---

## Scale Validation

| Property | Old (0.45) | New (0.55) | Legacy (0.72) | Notes |
|----------|------------|------------|---------------|-------|
| Visual size | 86x86 px | 106x106 px | 69x69 px | Hero at new scale is 1.54x legacy visual size |
| Source frame | 192x192 | 192x192 | 96x96 | Hero has 4x the pixel area of legacy |
| Small screen | 97x97 px | 106x106 px (capped) | 77x77 px | Clamp [0.38, 0.55] controls max |
| Mobile (70% sim) | 60x60 px | 74x74 px | — | Above 64px minimum recommendation |

### Scale Verdict

**Scale 0.55 is APPROVED.** The new scale provides:
- 54% larger visual presence than legacy at gameplay resolution
- Strong boss dominance without feeling oversized
- Within the existing clamp range [0.38, 0.55]
- Well above the 64px minimum readability target on mobile sim
- Metadata-driven — can be adjusted in `_CRABTRON_HERO_META.scaleHint` without touching draw.js

---

## Readability Findings

### 1. No Legacy Core Contamination

**Result:** PASS. The `drawCrabtronCore` gate at `!_crabtronHeroReady` successfully prevents legacy pixel-art core rings from rendering on top of the hero's `weakpoint_core` layer. The hero's own animated core pulse provides the visual center point. No double-rendering, no art style clash at the most important recognition point.

### 2. Weakpoint Readability

**Result:** PASS. The `weakpoint_core` layer remains clearly visible:
- At gameplay scale (106px): bright pulsing core is the most prominent feature
- Through bullet clutter: the central glow color (#ff375f region) contrasts well against common bullet colors (red/orange/cyan)
- At mobile scale (74px): still visible as a distinct glowing center
- Per-state visibility: pulse amplitude increases with threat level (idle: 0.45-0.77, rage: 0.68-0.96)

### 3. Silhouette Dominance

**Result:** PASS. The hero's asymmetrical claw layout and broad body create a distinct silhouette that:
- Differs from all enemy faction silhouettes (Scout, Suppressor, Splitter, Imperial)
- Remains recognizable down to ~38px visual size
- Maintains 5 distinct state silhouettes (idle arms relaxed, attack claws forward, rage brighter/wider, death core exposed)
- Stronger than legacy 96x96 sprite which lacks the claw definition at gameplay scale

### 4. State Transitions

**Result:** PASS. All 5 states render distinctly:
- `idle` — default, subtle 0.05-0.09 breath glow
- `attack_windup` — dashing/charging, 0.18-0.28 attack glow
- `mid_damage` — flash timer active, 0.28-0.50 damage pulse
- `rage_phase` — phase 3 (<33% HP), 0.44-0.56 intense glow
- `death_exposed_core` — boss dead, 0.58-0.80 max glow

State transitions are driven by gameplay conditions (`boss.phase`, `boss.flashTimer`, `boss.dashMode`) and are instantaneous — no interpolation or lerping between states. This is correct for a shmup boss where state changes represent discrete gameplay events.

### 5. Glow/Emissive Safety

**Result:** SAFE. All glow alphas are well within bounds:
- Maximum glow is 0.80 (death state only) — not blinding
- Rage phase max is 0.56 — intense but readable
- Idle breath range 0.05-0.09 — subtle and non-distracting
- Core pulse alpha 0.45-0.96 — bright but not overflowing the sprite edges
- The `overlay_glow_damage` layer is an additive overlay — it enhances, doesn't obscure

---

## Android Readability Validation

| Test | Scale | Result | Notes |
|------|-------|--------|-------|
| Desktop gameplay | 106px (0.55) | PASS | Strong presence, dominant silhouette |
| Small screen boost | 106px (capped) | PASS | +1.12 screen boost applies but clamp holds at 0.55 |
| Mobile sim (70%) | 74px | PASS | Above 64px minimum target |
| Mobile sim (55%) | 58px | PASS | Slightly below 64px target but silhouette still readable |
| Silhouette at 48px | 48px | PASS | Claw arms distinguishable from body |
| Silhouette at 38px | 38px | PASS | Bare minimum — core glow still visible |
| Silhouette at 32px | 32px | MARGINAL | Claw arms may blur into body mass |
| Bullet clutter at mobile | 74px | PASS | Core glow cuts through standard bullet patterns |
| Heavy effects | 74px | PASS | Bold silhouette survives behind explosion/effect overlays |

### Android Verdict

**PASS** with note: recommended minimum gameplay size on mobile is 64px. The Crabtron Hero at 0.55 scale renders at 74px in mobile sim, comfortably above the minimum. For very small screens (<400px landscape width), the `_smallScreenBoost` multiplier keeps the hero readable. The weakpoint core's contrast (bright glow on dark body) is the key mobile readability asset.

---

## Remaining Visual Inconsistencies

| Issue | Severity | Detail |
|-------|----------|--------|
| Legacy pixel data still registered | None | `state.js` boss_crabtron pixel matrix still exists but unused when hero ready |
| Legacy sprite still registered | None | `sprite-system.js` boss_crabtron (96x96) still registered for fallback |
| `drawBossSpriteOrLegacy` still references boss_crabtron | None | Gated behind `!_crabtronHeroReady` — correct behavior |
| White crosshair always draws | None | Minimal 24x2 + 2x24 crosshair at boss center — not a contamination issue |
| No hero-specific readability multiplier | Low | Hero scale uses `scaleHint` only; legacy has a 1.53x readability mult. Hero already renders larger, so this is cosmetic parity. |

---

## Validation Checklist

| Check | Status |
|-------|--------|
| No legacy core visible in hero-ready mode | PASS |
| Weakpoint readability preserved | PASS |
| Silhouette readability preserved | PASS |
| No excessive visual noise | PASS |
| Fallback path intact | PASS |
| Scale metadata-driven | PASS |
| Scale 0.55 approved | PASS |
| Emissive/glow levels safe | PASS |
| Android readability meets minimum | PASS |
| No gameplay files modified | PASS |
| No hitbox changes | PASS |
| No AI/balance changes | PASS |

---

## Recommendation

**The Crabtron Hero at scale 0.55 is approved as the official Galaxy Raiders boss visual benchmark.** All future boss hero kits should target equivalent quality: 192x192+ master resolution, layered state rendering, metadata-driven scale, readability validation suite, and clean integration that preserves legacy fallback.

---

*Generated by Crabtron hero runtime validation pass — visual-only, no gameplay modifications.*
