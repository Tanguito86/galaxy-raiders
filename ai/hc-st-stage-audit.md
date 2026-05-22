# HC-ST-01 — Full Stage Audit

**Block:** HC-ST  
**Status:** Audit (read-only)  
**Date:** 2026-05-22  
**Protected Systems:** HC-RD, HC-HB, HC-PD, HC-WC, HC-BD, HC-RK, HC-SC (all frozen)

---

## 1. Stage Architecture Map

### 1.1 Level Structure (20 levels)

```
Level  1-2:  Normal waves (alien1/alien2 only)
Level  3:    PINCER ASSAULT (Set Piece)
Level  4:    Special wave (swarm)
Level  5:    CRABTRON (Boss 1) — HP 95
Level  6:    Normal
Level  7:    FORTRESS LINE (Set Piece)
Level  8:    Special wave (tanks)
Level  9:    Normal
Level 10:    SERPENTRIX (Boss 2) — HP 145
Level 11:    Normal
Level 12:    KAMIKAZE RUSH (Set Piece)
Level 13:    Normal
Level 14:    Normal (late-game bonus scoring starts)
Level 15:    ORBITAL (Boss 3) — HP 210
Level 16:    SPLITTER STORM (Set Piece)
Level 17:    Normal (divers max at 3)
Level 18:    IMPERIAL GUARD (Set Piece) — last set piece before final bosses
Level 19:    TENIENTE (Boss 4) — HP 285
Level 20:    EMPERADOR (Boss 5) — HP 450
```

### 1.2 Wave Types

| Type | Frequency | Description |
|------|-----------|-------------|
| `normal` | 11 levels | Standard enemy formations |
| `swarm` | Every 4th (level 4, 8...) | High density, low HP |
| `tanks` | Every 4th + 4 | alien3-heavy formations |
| `kamikazes` | Every 4th + 8 | alien5 rush formations |
| `splitters` | Every 4th + 12 | alien6 splitter formations |
| `mixed` | Every 4th + 16 | All types |
| `boss` | Levels 5, 10, 15, 19, 20 | Boss fights |

### 1.3 Formations (non-boss levels rotate)

| Index | Formation | Description |
|-------|-----------|-------------|
| 0 | classic | Standard rows |
| 1 | vshape | V-shaped entry |
| 2 | diamond | Diamond pattern |
| 3 | zigzag | Zigzag entry |

Rotated per non-boss level. 4 unique formations before repeating.

### 1.4 Enemy Type Progression

| Level range | Types available |
|------------|----------------|
| 1-3 | alien1, alien2 |
| 4-8 | +alien3 (tank), alien4 (fast) |
| 9-13 | +alien6 (splitter), diver frequency increases |
| 14-16 | +alien5 (kamikaze) in rows 4+ |
| 17-20 | All types, 3 max divers, full density |

---

## 2. Boss Integration Analysis

### 2.1 Boss Levels

| Level | Boss | HP | Phase Plan | Identity |
|-------|------|-----|-----------|----------|
| 5 | CRABTRON | 95 | intro→pressure→recovery→crossfire→transition→desperation→finale | Duelist, pincer dash |
| 10 | SERPENTRIX | 145 | intro→pressure→recovery→area_denial→transition→desperation→finale | Sweeper, serpentine motion |
| 15 | ORBITAL | 210 | intro→pressure→recovery→crossfire→transition→rage→finale | Orbital, surround ring |
| 19 | TENIENTE | 285 | intro→pressure→chase→recovery→crossfire→transition→rage→finale | Hunter, charge/retreat |
| 20 | EMPERADOR | 450 | intro→pressure→crossfire→transition→area_denial→transition→rage→finale | Executioner, teleport+minions |

### 2.2 Boss Pacing Gaps

| Issue | Level(s) | Severity |
|-------|----------|----------|
| No boss at levels 1-4 | 1-4 | Low — intentional warmup |
| Long gap between bosses | 5→10 (5 levels) | Medium — pacing lull |
| Short gap 15→19→20 | 15-20 | Low — endgame density is good |
| CRABTRON at level 5 too early | 5 | Low — tutorial boss feel |
| EMPERADOR no pause after | 20 | N/A — game ends |

### 2.3 Boss Prelude Quality

| Boss | Prelude | Quality |
|------|---------|---------|
| CRABTRON | Wave 4 tanks → BOSS INCOMING banner | Adequate |
| SERPENTRIX | Wave 9 normal → BOSS INCOMING banner | Weak — no distinctive prelude |
| ORBITAL | Wave 14 normal → BOSS INCOMING banner | Weak |
| TENIENTE | Set Piece 18 → BOSS INCOMING banner | Good — set piece serves as prelude |
| EMPERADOR | Boss 19 → wave transition → BOSS INCOMING banner | Good — back-to-back bosses feel epic |

---

## 3. Set Piece Analysis

### 3.1 Set Piece Identity

| Level | Set Piece | Enemies | Unique mechanic |
|-------|-----------|---------|-----------------|
| 3 | PINCER ASSAULT | alien4 flanks + alien2 mid + alien3 anchor | Symmetric pincer formation |
| 7 | FORTRESS LINE | 5 alien3 front, 7+7+5 back rows | Tank wall, bullet density |
| 12 | KAMIKAZE RUSH | 8 alien5 front, 6+5+6 back | Rush-down, dive pressure |
| 16 | SPLITTER STORM | 6+6 alien6, 7+7 alien2/1+4 interleaved | Splitters create chaos |
| 18 | IMPERIAL GUARD | 4 alien3, 6 alien6, 7 alien2, 8 mixed | Elite mixed formation |

### 3.2 Set Piece Pacing

| Issue | Detail |
|-------|--------|
| Set pieces at fixed levels | No randomization — replayable but predictable |
| Pincer at level 3 | Very early — feels like a tutorial set piece |
| Gap 7→12 (5 levels) | Long stretch without a set piece |
| Set piece → boss gap | Levels 3→5 (2 levels), 7→10 (3 levels), 12→15 (3 levels), 16→19 (3 levels), 18→20 never reaches (skips straight to 19 boss) |
| Imperial Guard at 18 | Last set piece — immediately followed by back-to-back bosses |

---

## 4. Pacing Analysis (Emotional Curve)

### 4.1 Intensity Map (theoretical)

```
Level  1: ████░░░░░░  Warmup. Basic formations. alien1/alien2 only.
Level  2: ████░░░░░░  Same. Feels flat.
Level  3: ██████░░░░  PINCER ASSAULT. First set piece. Memorable.
Level  4: █████░░░░░  Swarm. Momentum sustains.
Level  5: ████████░░  CRABTRON. First boss. Peak.

Level  6: ████░░░░░░  Back to normal. Feels like a step down.
Level  7: ██████░░░░  FORTRESS LINE. Set piece. Good.
Level  8: █████░░░░░  Tanks. Sustains.
Level  9: ████░░░░░░  Normal. Energy dips.
Level 10: ████████░░  SERPENTRIX. Peak.

Level 11: ████░░░░░░  Normal. Post-boss lull.
Level 12: ███████░░░  KAMIKAZE RUSH. Set piece. High energy.
Level 13: █████░░░░░  Normal. Slight dip.
Level 14: ██████░░░░  Late-game bonus scoring starts. Momentum builds.
Level 15: █████████░  ORBITAL. Peak.

Level 16: ████████░░  SPLITTER STORM. Set piece. Very high.
Level 17: ███████░░░  Max divers. Sustained intensity.
Level 18: █████████░  IMPERIAL GUARD. Set piece. Extreme.
Level 19: ██████████  TENIENTE. Boss. Near-maximum.
Level 20: ██████████  EMPERADOR. Maximum. Climax.
```

### 4.2 Problems Detected

| Problem | Levels | Effect |
|---------|--------|--------|
| **Flat curve levels 1-2** | 1, 2 | No variety. Both levels identical in enemy types. Feels like padding. |
| **Post-boss dip too deep** | 6, 11 | After first two bosses, level drops straight to normal waves. Momentum killer. |
| **Mid-term flatness** | 8-9, 13-14 | Normal waves between set pieces and bosses feel interchangeable. |
| **No breathing room before EMPERADOR** | 19→20 | Back-to-back bosses. No recovery. Can feel exhausting. |
| **Set piece gap 7→12** | 8-11 | 5 levels without a set piece. Longest gap in the game. |
| **Formations repeat every 4** | All non-boss | Formations cycle: classic→vshape→diamond→zigzag→repeat. Predictable. |

---

## 5. Identity Analysis

### 5.1 Stage Identity (current vs potential)

| Level | Current identity | Potential identity |
|-------|-----------------|-------------------|
| 1 | "Tutorial" | First Contact — establish ship feel |
| 2 | "More tutorial" | Patrol Zone — introduce formation variety |
| 3 | PINCER ASSAULT | First Ambush — shock value |
| 4 | Swarm | Hive Break — introduce density |
| 5 | CRABTRON | Duelist Arena — one-on-one test |
| 6 | Post-boss lull | Scouting Run — breather with teasing |
| 7 | FORTRESS LINE | The Wall — endurance test |
| 8 | Tanks | Armored Column — heavy assault |
| 9 | Pre-boss normal | Dark Sector — tension buildup |
| 10 | SERPENTRIX | Serpent's Den — sweeping danger |
| 11 | Post-boss lull | Retreat Path — recovery, then pressure |
| 12 | KAMIKAZE RUSH | Desperate Charge — aggression test |
| 13 | Normal | Patrol Disrupted — ambush feel |
| 14 | Normal | War Zone — scoring ramp-up |
| 15 | ORBITAL | The Ring — surround mastery |
| 16 | SPLITTER STORM | Chaos Cascade — splitter hell |
| 17 | Max density | Bullet Storm — survival corridor |
| 18 | IMPERIAL GUARD | Elite Guard — final wall |
| 19 | TENIENTE | The Hunt — chase mastery |
| 20 | EMPERADOR | The Throne — final examination |

### 5.2 Stages with NO identity
- **Levels 2, 6, 8, 9, 11, 13, 14, 17** — all feel like "placeholder normal waves." 8 of 20 levels lack distinct identity.

---

## 6. Section Taxonomy (Classification)

| Section type | Description | Occurrence |
|-------------|-------------|------------|
| **Warmup** | Low density, tutorial feel | Levels 1-2 |
| **Set Piece** | Scripted formation with banner | Levels 3, 7, 12, 16, 18 (5) |
| **Pressure Ramp** | Normal waves with increasing density | Levels 4, 8, 9, 13, 14 (5) |
| **Boss Prelude** | Wave before boss | Levels 4, 9, 14, 17-18, 19 (5) |
| **Boss Climax** | Boss fight | Levels 5, 10, 15, 19, 20 (5) |
| **Post-Boss Lull** | Normal wave after boss | Levels 6, 11 (2) |
| **Survival Corridor** | Max density, sustained pressure | Level 17 (1) |
| **Final Gauntlet** | Back-to-back boss | Levels 19-20 (1 sequence) |
| **Relief** | Genuine breathing room | None explicitly designed |

---

## 7. Recovery Analysis

### 7.1 Where Recovery Exists

| Location | Type | Quality |
|----------|------|---------|
| Level start | Clean slate | Enemy-free transition, wave banner |
| Post-set piece → level clear | Brief pause before next level | 900ms wave clear timer |
| Boss death → transition | Celebration pause | Explosion + score popup |

### 7.2 Where Recovery is Missing

| Location | Problem |
|----------|---------|
| Mid-wave | No explicit relief phases except Wave Composer's RELIEF |
| Between bosses 19-20 | Back-to-back with no wave in between |
| After dense set pieces | Level 18 → 19 has only 900ms pause |
| After death (player respawn) | 2s invincibility only — mental reset may need more |
| Long survival stretches | Levels 16-20 have no breathing room |

---

## 8. Memorability Audit

### Highly Memorable
| Moment | Why |
|--------|-----|
| PINCER ASSAULT (level 3) | First formation change, symmetric attack, alien3 anchor |
| First boss death (level 5) | CRABTRON explosion, medal rain |
| KAMIKAZE RUSH (level 12) | Aggressive dive-heavy formation |
| IMPERIAL GUARD (level 18) | Elite mixed formation, pre-final-boss tension |
| EMPERADOR death (level 20) | Final boss, teleport mechanics, minions |

### Interchangeable / Forgettable
| Levels | Why |
|--------|-----|
| 1-2 | Same enemy types, no variety |
| 6 | Post-boss lull, no unique elements |
| 8-9 | Generic tank/normal waves, no set piece |
| 11 | Same as 6 — post-boss dip |
| 13-14 | Feels like filler before ORBITAL |

---

## 9. Quick Wins (no major changes needed)

| # | Change | Effort | Impact |
|---|--------|--------|--------|
| 1 | Add unique color palette per chapter (every 4 levels) | Low | Identity boost |
| 2 | Pre-boss wave banner: "APPROACHING BOSS" | Low | Prelude feel |
| 3 | Set piece banner: add dramatic pause (1.5s freeze) | Low | Cinematic |
| 4 | Level 6: add quick set piece or mini-wave | Medium | Kill post-boss lull |
| 5 | Level 11: add mini-ambush | Medium | Kill second post-boss lull |
| 6 | Levels 1-2: differentiate (e.g., level 1 = alien1 only, level 2 = alien2 only) | Low | Early variety |

---

## 10. Deeper Changes (HC-ST future sprints)

| Change | Sprint | Difficulty |
|--------|--------|-----------|
| Stage identity director (name generator, theme assignment) | HC-ST-02 | Medium |
| Pacing macro state machine (warmup→peak→relief) | HC-ST-03 | High |
| Boss prelude system (intro wave, telegraph, musical cue) | HC-ST-04 | Medium |
| Stage memorability scoring (variety metric) | HC-ST-05 | Low |
| Dynamic set piece insertion (surprise mid-wave) | HC-ST-06 | High |
| Recovery window director (explicit breather sections) | HC-ST-07 | Medium |
| Stage narrative system (visual theme, music theme escalation) | HC-ST-08 | High |

---

## 11. Frozen Systems Interaction

| System | HC-ST Constraint |
|--------|-----------------|
| HC-RD | Stage visuals must respect alpha floors and priority layers |
| HC-HB | No hitbox changes |
| HC-PD | Enemy patterns already frozen — HC-ST selects, doesn't modify |
| HC-WC | Wave composer manages spawn timing — HC-ST coordinates, doesn't override |
| HC-BD | Boss director manages boss flow — HC-ST builds stage around boss |
| HC-RK | Rank adjusts difficulty — HC-ST shouldn't conflict |
| HC-SC | Score economy — HC-ST shouldn't affect scoring |

---

## 12. Summary

| Area | Finding |
|------|---------|
| **Structure** | 20 levels, 5 bosses, 5 set pieces, 4 formations, 6 wave types. Functional but predictable. |
| **Identity** | 12/20 levels have some identity. 8/20 interchangeable. |
| **Pacing** | Boss peaks are strong. Post-boss dips are too deep. Mid-game lulls exist. |
| **Recovery** | No explicit relief sections. Recovery is passive (between levels). |
| **Memorability** | 5 highly memorable moments. 8-10 forgettable levels. |
| **Boss integration** | Boss placement is good. Boss preludes are weak (just a banner). |
| **Set pieces** | 5 scripted formations. Good concept, need better orchestration. |
| **Ready for HC-ST-02** | ✅ Audit complete. Identity director + pacing architecture next. |
