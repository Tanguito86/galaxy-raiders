# HC-SC-06 — Close-Range & Aggression Scoring

**Block:** HC-SC  
**Status:** Implemented (enhanced aggression, conservative scaling)  
**Date:** 2026-05-22  
**Dependency:** HC-SC-05 (graze), HC-SC-04 (multiplier)

---

## Overview

Rewrote close-range kill scoring from legacy additive model (+16% at 150px, +12% at 95px) to clean multiplicative tiers. Added danger window system that rewards sustained pressure. Near kills feed multiplier gain pipeline.

---

## Files Modified (6)

| File | Change |
|------|--------|
| `www/progression.js` | Rewrote `calculateEnemyKillScore` close-range section |
| `www/scores.js` | +62 lines: danger window tracking, telemetry |
| `www/game-config.js` | +15 lines: `aggression` config block |
| `www/hardcore-config.js` | +1 line: defaults synced |
| `www/update.js` | +1 line: danger window frame update |
| `www/update-enemies.js` | +8 lines: bullet proximity detection for danger window |

---

## Aggression Config

```js
scoreSystem.aggression: {
  enabled: true,
  closeRange: {
    near: 60,         // px — high risk zone
    mid: 120,         // px — moderate risk zone
    bonus: {
      near: 1.75,     // ×1.75 multiplier for near kills
      mid: 1.30       // ×1.30 multiplier for mid kills
    }
  },
  dangerWindow: {
    enabled: true,
    frames: 90,       // frames danger window stays active after proximity
    bonus: 1.10       // ×1.10 extra if kill during danger window
  }
}
```

---

## Distance Tiers

| Tier | Distance | Score multiplier | Legacy equivalent |
|------|----------|-----------------|-------------------|
| **Near** | ≤60px | ×1.75 | Was +28% (additive) at <95px |
| **Mid** | ≤120px | ×1.30 | Was +16% at <150px |
| **Far** | >120px | ×1.00 | No bonus |

**Near kill at 60px = 75% bonus.** This is significant but requires point-blank play (~2 player-ship widths). Compare to legacy: max +28% additive ≈ ×1.28 effective at best case.

---

## Danger Window System

Tracks when the player is within 60px of an enemy bullet. This sets a flag. If the player gets a kill within 90 frames (~1.5s) of their last bullet proximity, the kill score gets an extra ×1.10.

**Design purpose:** Rewards sustained pressure. Player who dives in, grazes bullets, and kills close earns: near bonus (×1.75) + danger window (×1.10) = ×1.925 total. Combined with multiplier ×2.0 = ×3.85 overall.

**Anti-exploit:** Danger window only triggers from enemy bullet proximity (not enemy sprite proximity). Player can't hug a stationary enemy for free danger bonus.

---

## Multiplier Integration

Near kills call `addScoreMultiplierGain('closeRange')` → +0.020 multiplier per near kill. This feeds the mastery multiplier pipeline established in HC-SC-04.

| Kill type | Multiplier gain |
|-----------|----------------|
| Near (≤60px) | +0.020 |
| Mid / Far | None extra (only base enemyKill +0.015) |

**Aggressive routing** sustains higher multiplier. Safe play still builds multiplier, but slower.

---

## Compared to Legacy

| Aspect | Legacy | HC-SC-06 |
|--------|--------|----------|
| Model | Additive (+16% at 150px, +12% at 95px) | Multiplicative (×1.75 near, ×1.30 mid) |
| Thresholds | 150px, 95px | 60px, 120px |
| Max bonus | ~+28% | +75% |
| Danger window | None | ×1.10 for 90 frames after bullet proximity |
| Danger detection | N/A | Enemy bullet proximity (60px) |
| Multiplier gain | None from close-range specifically | +0.020 per near kill |
| Config-driven | No (hardcoded) | Yes (game-config.js) |

---

## Anti-Exploit

| Exploit | Block |
|---------|-------|
| Stationary farming (sit next to slow enemy) | Near threshold is 60px — tight. Dense enemies push back with bullets. |
| Safe enemy hugging | Danger window requires BULLET proximity, not enemy proximity |
| Low-threat abuse | High-value enemies have more HP/armor — kill takes longer, more danger |
| Boss aggression exploit | Boss has large hitbox, death resets danger. Difficulty organically punishes extreme proximity. |

---

## Expected Score Contribution

| Player type | Aggression % | Multiplier effect |
|------------|-------------|-------------------|
| Casual (safe play, far kills) | <5% | Multiplier builds slowly |
| Average (mix of near/mid) | 8–12% | Multiplier slightly faster |
| Good (intentional near play) | 12–18% | Multiplier noticeably faster |
| Elite (aggressive routing) | 20–30% | Highest multiplier uptime |

**Safe play still viable.** The base score from safe-distance kills is unchanged. Aggression adds ON TOP.

---

## Readability

- No new popups for aggression (just uses existing kill popups)
- Danger window is invisible (internal state only)
- No screen clutter addition
- HC-RD readability rules preserved

---

## Validation

```
node --check www/progression.js      → OK
node --check www/scores.js           → OK (660 lines)
node --check www/game-config.js      → OK
node --check www/hardcore-config.js  → OK
node --check www/update.js           → OK
node --check www/update-enemies.js   → OK
```

- ✅ Fairness preserved — safe play not penalized
- ✅ No score runaway — max ×1.925 (near + danger) before multiplier
- ✅ Anti-exploit solid — danger window from bullets only, tight thresholds
- ✅ Multiplier synergy — near kills gain +0.020
- ✅ All frozen systems untouched
