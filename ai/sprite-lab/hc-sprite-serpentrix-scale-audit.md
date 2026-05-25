# HC-SPRITE-SERPENTRIX-SCALE-AUDIT-01

## Context

Serpentrix Hero uses the exact same pipeline as Crabtron Hero (HC-VS-03D3, production-validated):
- Sheet: 192x192 frames
- scaleHint: 0.55
- Clamp range: [0.38, 0.65]
- Boss hitbox: 90w x 45h
- Canvas: 360w x 640h

Crabtron Hero configuration is identical — same frame size, same scale, same hitbox dimensions, same clamp range. This is the validated baseline.

---

## 1. Current Scale

| Parameter | Value |
|-----------|-------|
| Frame size | 192x192 |
| scaleHint | 0.55 |
| Rendered size | **105.6 x 105.6 px** |
| Boss hitbox | 90 x 45 px |
| Width ratio (sprite/hitbox) | 1.17x |
| Height ratio (sprite/hitbox) | 2.35x |
| Canvas width coverage | 29.3% |

The sprite at 0.55x is already **17% wider** and **135% taller** than the boss hitbox. It is visually dominant without overflowing.

---

## 2. Scale Variant Analysis

### Canvas Coverage (width)

| Scale | Rendered px | % of 360px canvas | vs current |
|-------|-------------|-------------------|------------|
| 0.55 (current) | 105.6 | 29.3% | baseline |
| 1.00 | 192.0 | 53.3% | +82% |
| 1.15 | 220.8 | 61.3% | +109% |
| 1.25 | 240.0 | 66.7% | +127% |
| 1.35 | 259.2 | 72.0% | +145% |

### Edge Clipping (boss at min X = 10)

| Scale | Sprite left edge | Off-screen px |
|-------|-----------------|---------------|
| 0.55 | 10 + 45 - 52.8 = **+2.2** | 0 (safe) |
| 1.00 | 10 + 45 - 96.0 = **-41.0** | 41px clipped |
| 1.15 | 10 + 45 - 110.4 = **-55.4** | 55px clipped |
| 1.25 | 10 + 45 - 120.0 = **-65.0** | 65px clipped |
| 1.35 | 10 + 45 - 129.6 = **-74.6** | 75px clipped |

Boss can reach x = 10 (left arena boundary). At scale >= 0.64, the sprite begins clipping off-screen. At scale >= 1.0, **more than a third of the sprite is invisible**.

### Height Overflow (boss hitbox = 45px, sprite center = boss.y + 22.5)

| Scale | Sprite height | Vertical overflow | Zone affected |
|-------|--------------|-------------------|---------------|
| 0.55 | 105.6 | ±30.3px above/below hitbox | Safe |
| 1.00 | 192.0 | ±73.5px above/below hitbox | Reaches HUD + player zone |
| 1.15 | 220.8 | ±87.9px above/below hitbox | HUD severely overlapped |
| 1.35 | 259.2 | ±107.1px above/below hitbox | HUD + player zone eaten |

At boss.y = 40 (top arena boundary), scale 0.55 gives sprite top at 40 + 22.5 - 52.8 = 9.7px → barely on screen. Scale 1.0 would be at 40 + 22.5 - 96 = **-33.5px** → completely off-screen top.

---

## 3. Risk Assessment

### Bullet Readability

Serpentrix fires from boss body. The current 105.6px sprite already covers the 90px hitbox. At > 1.0 scale (192px+), the sprite would cover **213% of the hitbox width**, making bullets that spawn from the boss center invisible until they clear the sprite boundary. This is a critical gameplay hazard — players need to see bullets at the moment they fire.

### Telegraph Overlap

`drawSerpentrixSignatureTrapTelegraph` draws danger indicators around the boss body. A sprite > 1.0 scale would obscure these telegraphs. Since telegraphs are intentionally **not gated** (always visible regardless of hero readiness), they must remain readable. Scale must not compromise this.

### Readability Loss

At 0.55x, the boss occupies ~29% of the canvas width — balanced and readable. At 1.0x (53%), the boss fills more than half the screen width, making the game feel claustrophobic. At 1.35x (72%), the boss dominates the entire upper 2/3 of the screen. No commercial shmup uses boss sprites this large relative to canvas.

### Crabtron Parity

Crabtron Hero at 0.55x has been validated in production with zero complaints about size. The configuration is identical. Deviating from this baseline would create a visual imbalance between bosses (Serpentrix appearing 2-3x larger than Crabtron for no reason).

---

## 4. Recommendation

### Scale: 0.55 (current) — NO CHANGE

- Matches Crabtron Hero baseline point-for-point
- Already 17% wider and 135% taller than hitbox
- Rendered 105.6px is visually prominent
- No clipping at arena boundaries
- Bullets remain visible at spawn point
- Telegraphs remain readable

### Sheet: 192x192 (current) — NO CHANGE

- 192x192 at 0.55x gives 105.6px rendered — optimal
- A 256x256 sheet at 0.55x would render at 140.8px — already exceeding the safe max and clipping begins
- A 256x256 sheet would require scale ~0.41 to match current visual size, losing pixel density advantage
- 256x256 would be 78% more pixels per frame (40 frames), increasing sprite sheet size from 1536x960 to 2048x1280 — 78% larger file with no visual benefit at equivalent rendered size

### Summary

| Decision | Value | Rationale |
|----------|-------|-----------|
| Scale | 0.55 | Validated Crabtron baseline, no clipping, bullets readable |
| Scale change | None | All variants > 0.65 cause clipping or readability loss |
| Sheet change | None | 192x192 sufficient; 256x256 adds no visual benefit |
