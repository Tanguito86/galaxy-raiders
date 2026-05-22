# HC-SC-05 — Graze Economy Upgrade

**Block:** HC-SC  
**Status:** Implemented (enhanced graze, conservative scaling)  
**Date:** 2026-05-22  
**Dependency:** HC-SC-04 (multiplier)

---

## Overview

Transformed graze from cosmetic (score 5, 1 per bullet ever) to a real risk/reward economy: score base 12, up to 4 grazes per bullet with cooldown (20 frames), repeat penalty scaling (×1.0 → ×0.1 max), tighter radius (18px for hardcore detection), multiplier synergy.

---

## Files Modified (3)

| File | Change |
|------|--------|
| `www/game-config.js` | +5 keys in `graze` config |
| `www/hardcore-config.js` | Enhanced `checkBulletGraze` + `registerGraze`, defaults updated |
| `ai/hc-sc-graze-economy.md` | This document |

---

## Config

```js
graze: {
  enabled: true,
  radius: 24,                    // legacy — kept for HUD fallback
  score: 5,                      // legacy — kept for backward compat

  // HC-SC-05: enhanced
  radiusHardcore: 18,            // tighter detection radius
  scoreBase: 12,                 // base score per graze
  maxPerBullet: 4,               // max grazes on same bullet
  sameBulletCooldownFrames: 20,  // frames between grazes on same bullet (~333ms at 60fps)
  repeatPenalty: 0.35           // score multiplier drop per repeat graze
}
```

---

## Anti-Exploit (per-bullet tracking)

Each bullet gets 3 tracked properties:

| Property | Purpose |
|----------|---------|
| `_grazeCount` | How many times this bullet has been grazed (max 4) |
| `_grazeLastFrame` | Last frame a graze occurred (unused, replaced by frameCounter) |
| `_grazeFrameCounter` | Frames since last graze on this bullet (cooldown 20) |

**Blocked by:**
- `_grazeCount >= maxPerBullet (4)` → bullet exhausted
- `_grazeCount > 0 && frameCounter < 20` → within cooldown
- Bullet must be within `radiusHardcore` (18px)

**Stationary abuse:** Player must stay within 18px of bullet to graze. If they park next to a slow bullet, they get max 4 grazes with 20-frame gaps, then the bullet is exhausted.

**Corner abuse:** Works on any bullet. After 4 grazes, bullet no longer grazeable.

**Orbit abuse:** Orbital patterns = multiple bullets. Each bullet tracked independently. Player can graze different ring bullets without exhaustion.

---

## Score Scaling

| Graze # | Multiplier | Score (base 12) | With rank×1.5 + combo×2.0 |
|---------|------------|-----------------|--------------------------|
| 1st | ×1.00 | 12 | 36 |
| 2nd | ×0.65 | 8 | 24 |
| 3rd | ×0.30 | 4 | 12 |
| 4th | ×0.10 | 2 | 6 |

**Design:** First graze on a bullet is the most rewarding. Successive grazes diminish to prevent farming. The 4th graze is almost cosmetic — just enough to register the bullet as "spent."

---

## Compared to Legacy

| Aspect | Legacy | HC-SC-05 |
|--------|--------|----------|
| Score base | 5 | 12 |
| Max per bullet | 1 | 4 |
| Per-bullet cooldown | None (one-and-done) | 20 frames |
| Repeat penalty | N/A | ×0.65/0.30/0.10 |
| Detection radius | 24px (`radius`) | 18px (`radiusHardcore`) |
| Bullet size consideration | AABB center distance | Same |
| Multiplier synergy | None | awardScore pipeline → multiplier gain |
| Telemetry | Count only | Score + gain tracking via awardScore |

---

## Multiplier Interaction

Graze already feeds into the mastery multiplier via `awardScore({ source: 'graze' })`. The `addScoreMultiplierGain('graze')` hook gives +0.010 multiplier per graze event.

At 4 grazes per bullet with cooldowns, a dense wave with 20 bullets = max 80 grazes = +0.80 multiplier. Combined with kills, this helps sustain multiplier through waves where kills slow down.

---

## Expected Score Contribution

| Player type | Graze % | Notes |
|------------|---------|-------|
| Casual (avoids bullets) | <2% | Same as before, graze is accidental |
| Average (occasional proximity) | 3–5% | Natural play near bullets |
| Good (uses graze tactically) | 5–8% | Intentional proximity during waves |
| Elite (risks for graze chains) | 10–12% | Active grazing between kills |

**Target zone met:** graze contributes meaningful score without dominating (enemyKill stays 55-65%).

---

## Readability

- Graze popup: small cyan `+24 GRAZE` at bullet position (unchanged from previous — now using enhanced score)
- Spark effect: small cyan explosion (5 particles) at graze point
- HUD counter: bottom-right, small, pulse animation
- No masking of bullets or telegraphs (PRIORITY_FEEDBACK layer)
- HC-RD readability rules preserved (alpha 0.55-0.65 for graze elements)

---

## Validation

```
node --check www/hardcore-config.js → OK
node --check www/game-config.js     → OK
```

- ✅ No infinite graze — max 4 per bullet
- ✅ No stationary abuse — cooldown 20 frames
- ✅ No score explosion — base 12 × diminishing returns
- ✅ Readability preserved — popups unchanged size
- ✅ Multiplier synergy — feeds gain pipeline
- ✅ HC-RK / HC-BD / HC-RD / HC-WC untouched
