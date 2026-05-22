# HC-RK-01 — Full Difficulty & Rank Audit

**Block:** HC-RK  
**Status:** Audit (read-only)  
**Date:** 2026-05-22  
**Dependency:** HC-BD (frozen), HC-RD, HC-HB, HC-PD, HC-WC

---

## 1. Where Difficulty Lives Today

### 1.1 Static Level-Based Tables

**`www/balance.js` — `DIFFICULTY_TABLE`**  
6 arrays × 20 levels (level 1→20):

| Array | Level 1 | Level 10 | Level 20 | Effect |
|-------|---------|----------|----------|--------|
| `enemySpeed` | 0.92 | 1.27 | 1.96 | Enemy movement speed multiplier |
| `bulletSpeed` | 2.70 | 3.62 | 4.84 | Base bullet velocity |
| `shootCooldown` | 1020 | 833 | 552 | Enemy shoot interval (ms) |
| `diveChance` | 0.0010 | 0.00284 | 0.00545 | Dive attack probability per frame |
| `maxDivers` | 1 | 2 | 3 | Max simultaneous diving enemies |
| `diveSpeed` | 2.15 | 2.97 | 4.05 | Dive velocity |

Applied via `getDifficultySettings(levelNum)` in `state.js:287-338`.

### 1.2 Balance Profiles

**`www/balance.js` — `BALANCE_PROFILES`**

| Profile | enemySpeed | bulletSpeed | cooldown | diveChance | maxDivers | powerup | score |
|---------|------------|-------------|----------|------------|-----------|---------|-------|
| **arcade** | 1.00× | 1.00× | 1.00× | 1.00× | +0 | 1.00× | 1.00× |
| **tournament** | 1.06× | 1.08× | 0.90× | 1.22× | +1 | 0.80× | 1.18× |

Multipliers applied on top of `DIFFICULTY_TABLE` values.

### 1.3 Enemy Base Stats

**`www/state.js` — `ENEMY_TYPES`**

| Type | HP | Speed | Points | Traits |
|------|-----|-------|--------|--------|
| alien1 | 1 | 1.0 | 30 | Shoots, dives |
| alien2 | 1 | 1.0 | 20 | Shoots, dives |
| alien3 (tank) | 2 | 0.6 | 50 | Big shot, no dive |
| alien4 | 1 | 2.0 | 40 | Fast, no shoot |
| alien5 | 1 | 1.5 | 60 | Kamikaze |
| alien6 (splitter) | 1 | 0.8 | 80 | Splits on death, shoots |
| alien_mini | 1 | 1.8 | 15 | Fast, no shoot |

### 1.4 Enemy HP Scaling

**`www/balance.js` — `getEnemyHpForLevel()`**
- Tank (alien3): +1 HP at level ≥7, +1 at level ≥14 (max 3)
- Splitter (alien6): +1 HP at level ≥16

All others: base 1 HP, no scaling.

### 1.5 Boss Base Stats

**`www/progression.js` — `BOSS_DATA`**

| Boss | Level | Base HP | Pattern |
|------|-------|---------|---------|
| CRABTRON | 5 | 95 | crossfire |
| SERPENTRIX | 10 | 145 | zigzag |
| ORBITAL | 15 | 210 | rotate |
| TENIENTE | 19 | 285 | divebomb |
| EMPERADOR | 20 | 450 | supreme |

---

## 2. Dynamic Difficulty Systems

### 2.1 Hardcore Rank (`www/hardcore-rank.js`)

**State:** `{ value: 0→100, level: 1→5, multiplier: 1.00→1.50 }`

**Rank level thresholds:**
| Value | Level | Multiplier |
|-------|-------|------------|
| 0–19 | 1 | 1.00 |
| 20–39 | 2 | 1.12 |
| 40–59 | 3 | 1.25 |
| 60–79 | 4 | 1.37 |
| 80–100 | 5 | 1.50 |

**Rank modifiers applied to gameplay:**

| Modifier | Formula | Range |
|----------|---------|-------|
| Bullet speed | `1.00 + (mult - 1.00) × 0.24` | 1.00–1.12 |
| Cooldown | `1.00 - (mult - 1.00) × 0.24` | 1.00–0.88 |
| Pattern intensity | `round(1 + (mult - 1.00) × 2.0)` | 1–2 |
| Score | `{1.00, 1.10, 1.20, 1.35, 1.50}` by level | 1.00–1.50 |

**Rank gains per event (→ `addHardcoreRank()`):**

| Event | Amount | Reason |
|-------|--------|--------|
| Enemy kill | +0.75 | `enemy_kill` |
| Boss phase transition | +2.5 | `boss_phase` |
| Boss clear | +4.0 | `boss_clear` |
| Graze | +0.35 | `graze` |

**Rank reductions per event (→ `reduceHardcoreRank()`):**

| Event | Amount | Reason |
|-------|--------|--------|
| Player hit/death | −8.0 | `player_hit` |

**Rank decay:**
- Starts after 6000ms inactivity (no gain)
- Decays 0.15 per 1000ms
- Stops at 0

**Events that do NOT affect rank:**
- Player shot fired ✅ (not tracked)
- Missed shots ✅ (no penalty)
- Bomb usage ✅ (not implemented)
- Level completion ✅ (not tracked)
- Time survived ✅ (only via kills implicitly)

### 2.2 Pressure System (`www/hardcore-pressure.js`)

**Maps rank level → pressure multiplier:**

| Rank Level | Pressure | Bullet Speed Multiplier | Cooldown Scale |
|------------|----------|------------------------|----------------|
| 1 | LOW | 1.00 | 1.00 |
| 2–3 | NORMAL | 1.06 | 0.94 |
| 4 | HIGH | 1.12 | 0.89 |
| 5 | MAX | 1.18 | 0.84 |

**Used in:**
- `update-enemies.js`: dive cooldowns
- `enemy-pattern-hooks.js`: diver/fan/chaser timing offsets
- `hardcore-rhythm.js`: wave pause/intro/entry timing

### 2.3 Rhythm System (`www/hardcore-rhythm.js`)

Scales wave timing inversely to pressure:
- `wavePauseMinScale`: 0.75 (tighter pauses at high rank)
- `introMinScale`: 0.72 (faster intros)
- `entryDelayMinScale`: 0.70 (faster enemy entry)

Applied via `getHardcoreRhythmWavePause()`, `getHardcoreRhythmIntro()`, `getHardcoreRhythmEntryDelay()`.

### 2.4 Combo System (`www/hardcore-combo.js`)

**Affects score only**, not gameplay difficulty.

| Combo Count | Multiplier |
|-------------|------------|
| 0–4 | 1.00 |
| 5–9 | 1.10 |
| 10–19 | 1.25 |
| 20–39 | 1.50 |
| 40+ | 2.00 |

Features: 2500ms timeout, 350ms grace window for recovery, visual HUD with timer bar.

---

## 3. Enemy Spawn & Pattern Difficulty

### 3.1 Enemy Pattern Director (`www/enemy-pattern-hooks.js`)

**Role-based enemy attack roles (HC-PD):**
- Diver, Sniper, Suppressor, Chaser, Flanker, etc.
- Each role has independent cooldown and bullet patterns
- Cooldowns scaled by `getHardcoreRankCooldownMultiplier()` × `getHardcorePressureCooldownScale()`

### 3.2 Wave Composer (`www/hc-wc-*.js`)

**Phase-based wave structure:**
- INTRO → BUILD → PEAK → RESOLVE → RELIEF
- Wave profiles curated per level (HC-WC-04)
- Spawn spacing, role activation timing, threat caps

### 3.3 Encounter Director (`www/encounter-director.js`)

**Pacing control:**
- Silence after enemy death (300–400ms)
- Pressure smoothing (0.045 fall speed)
- Relief threshold (0.62)
- Max bullet gates
- Spawn stagger delays

### 3.4 Boss Patterns (`www/boss-patterns.js`)

**Per-boss attack patterns:** fixed by boss identity + phase. Not rank-scaled (except HC-BD signature hooks which are fairness-gated, not rank-scaled).

### 3.5 Boss Signature Hooks (`www/update-boss.js`, HC-BD frozen)

**Flag-gated, intent-driven.** Not rank-scaled. Blocked by fairness < 0.35. Independent of dynamic difficulty.

---

## 4. Skill-Reflective Variables (Metrics Candidates)

### Already tracked:
| Metric | Where | Rank effect |
|--------|-------|-------------|
| Enemy kills | `recordEnemyKilled()` | +0.75 rank |
| Boss phase | `update-boss.js` | +2.5 rank |
| Boss clear | `update-enemies.js` | +4.0 rank |
| Graze | `hardcore-config.js` | +0.35 rank, +combo |
| Player death | `recordPlayerDeath()` | −8.0 rank, combo break |
| Shots fired | `recordShotsFired()` | Not for rank |
| Shots hit | `recordShotHit()` | Not for rank |
| Accuracy | `finalizeRunStats()` | Not for rank |
| Powerups collected | `recordPowerupCollected()` | Not for rank |
| Continues used | `finalizeRunStats()` | Not for rank |
| Time survived | `gameStats.totalTime` | Not for rank |
| Medals | `medals.js` | Only milestone rewards |
| Combo count | `hardcore-combo.js` | Score only |

### Not tracked (potential candidates):
| Metric | Feasibility | Risk |
|--------|-------------|------|
| No-hit streak | Needs timer since last damage | Exploitable if paused |
| DPS consistency | Needs boss damage tracking | Complex |
| Recovery after damage | Needs time-to-rekill measurement | Ambiguous |
| Bomb usage | No bomb system in game currently | N/A |
| Medal chain | Already tracked per-wave | Safe |
| Boss survival time | Time from boss spawn to death | Farmable |
| Pressure sustain | Time above rank threshold | Requires continuous tracking |
| Wave clear speed | Time per wave completion | Farmable on easy waves |
| Dive dodge count | Successful dives without hit | Requires dive-tracking system |

---

## 5. Exploitable Metrics

| Metric | Exploit | Severity |
|--------|---------|----------|
| Enemy kills | Kill-farming on spawners/infinite waves | Medium — wave compositions are finite |
| Graze | Orbiting a bullet stream for infinite graze | Low — graze is 0.35, slow to accumulate |
| Boss phase | Triggering multiple phases rapidly | Low — boss HP gates phase count |
| Boss survival time | Delaying boss kill to farm combo/rank | Medium — no time-based rank, only kills |
| Dive farming | Letting divers spawn repeatedly | Low — max divers capped per level |
| Combo stall | Grazing to refresh combo without killing | Low — combo doesn't affect difficulty |
| Death exploit | Dying to reset rank (rank drops 8) | Low — death has score/combo/continue cost |
| Level restart | Restarting easy levels | Low — restart resets everything |

**Verdict:** Current metrics are hard to exploit for difficulty manipulation. The system is conservative — rank rises slowly (0.75 per kill), drops hard on death (−8.0), and decays passively.

---

## 6. Parameters That Should Never Scale

| Parameter | Reason |
|-----------|--------|
| **Player hitbox** (HC-HB) | Core fairness — fixed at 3px radius |
| **Player speed** | Movement must be predictable |
| **Player fire rate** | Weapon feel — sacred |
| **Screen dimensions** | Fixed arena — geometry constant |
| **Boss HP** | Determines phase pacing |
| **Graze radius** | Readability — must be consistent |
| **Invincibility frames** | Death recovery fairness |
| **Bullet visibility (HC-RD alpha floors)** | Readability — non-negotiable |
| **Telegraph timing** | Must be learnable |
| **Signature hook bullet counts** | HC-BD freeze — locked at 2–5 |

---

## 7. Systems That Tolerate Dynamic Rank

### ✅ Safe to scale with rank:

| System | Parameter | Range | Risk |
|--------|-----------|-------|------|
| Enemy bullet speed | Already scaled | 1.00–1.12 | Low |
| Enemy cooldown | Already scaled | 0.88–1.00 | Low |
| Wave timing | Already scaled via Rhythm | 0.70–1.00 | Low |
| Dive frequency | Static (level-based) | — | Low (can be rank-scaled) |
| Enemy speed | Static (level-based) | — | Medium (affects formations) |
| Simultaneous divers | Static (level-based) | — | Medium |
| Wave enemy count | Static (level-based) | — | Medium (affects bullet density) |
| Powerup frequency | Emergency-scaled only | — | Low (already adaptive) |

### ⚠️ Needs capping:

| System | Concern | Cap needed |
|--------|---------|------------|
| Rank 5 bullet speed (1.12×) on top of level 20 (4.84) = 5.42 | Very fast — unreadable? | Cap at 5.20 |
| Rank 5 cooldown (0.88×) on top of level 20 (552ms) = 486ms | Fast but not instant | 400ms floor |
| Diver count at rank 5 + level 20 | Already 3 max | 3 absolute cap |
| Rhythm wave pause at rank 5 (0.84×) | Very tight pauses | 500ms minimum pause |
| Combined speed + cooldown + timing | Stacking multipliers | Audit for multiplicative explosion |

---

## 8. Boss/Wave Breakage Risk at High Rank

| Boss/Wave | Risk | Mechanism |
|-----------|------|-----------|
| **EMPERADOR (level 20)** | HIGH | Teleport + minion spam + bullet speed at 5.42 may be undodgeable |
| **TENIENTE (level 19)** | MEDIUM | Charge pattern + laser sweep with fast bullets |
| **CRABTRON (level 5)** | LOW | Fixed dash patterns, low rank at level 5 |
| **Wave Resolve phase** | MEDIUM | Too-fast wave timing may skip RELIEF entirely |
| **PEAK phase with rank 5** | HIGH | Bullet count × speed × frequency may exceed readability cap |
| **Multi-diver waves (level 17+)** | HIGH | 3 divers × fast speed × fast fire = curtain risk |
| **Splitter waves (level 16+)** | MEDIUM | Extra splitter HP + fast bullets = prolonged density |

**Mitigation:** All signature hooks already gated by fairness < 0.35. Need similar cap for non-signature patterns.

---

## 9. Caps Needed

| Parameter | Current max | Suggested cap | Reason |
|-----------|-------------|---------------|--------|
| Bullet speed multiplier | 1.12 (rank) + level scaling | 1.08 from rank | Readability ceiling |
| Cooldown floor | 0.88 (rank) × 552ms (level 20) = 486ms | 450ms absolute floor | Prevent instant fire |
| Diver count | 3 (level 17+) | 3 absolute | Already at cap |
| Wave pause minimum | 0.70 × base | 600ms absolute minimum | RELIEF must exist |
| Combined speed cap | 5.42 (level 20 + rank 5) | 5.20 | Visual tracking limit |
| Rank decay floor | 0 | 0 | Keep decay to zero possible |
| Fairness threshold | 0.35 | 0.30 | Slightly relax for rank scaling |

---

## 10. Parameters That Must Remain Fixed

| Parameter | Current value | Reason for fixity |
|-----------|--------------|-------------------|
| Player hitbox radius | 3 | HC-HB freeze |
| Player speed | ~4 px/frame | Movement sacred |
| Player fire rate | ~180ms | Weapon identity |
| Graze radius | 24 | Readability |
| Boss HP | 95→450 | Phase gate integrity |
| Max combo multiplier | 2.00 | Score balance |
| Combo timeout | 2500ms | Learnable rhythm |
| Boss signature bullet counts | 2→5 | HC-BD freeze |
| Screen dimensions (W, H) | 480×850 | Geometry sacred |

---

## 11. Architecture Map: HC-RK Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    CONFIG LAYER                              │
│  game-config.js → hardcore-config.js                        │
│  rank.enabled, rank.baseLevel, rank.maxLevel,               │
│  rank.bulletSpeedMax, rank.cooldownMin,                     │
│  rank.decayDelayMs, rank.decayAmount, rank.decayIntervalMs  │
└──────────────┬──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│                 RANK ENGINE (hardcore-rank.js)               │
│  addHardcoreRank() ← kills, boss phases, boss clear, graze  │
│  reduceHardcoreRank() ← player deaths                       │
│  updateHardcoreRankDecay() ← passive decay                  │
│  getHardcoreRankBulletSpeedMultiplier() → 1.00–1.12         │
│  getHardcoreRankCooldownMultiplier() → 0.88–1.00            │
│  getHardcoreRankPatternIntensity() → 1–2                    │
│  getHardcoreRankScoreMultiplier() → 1.00–1.50               │
└──────────────┬──────────────────────────────────────────────┘
               │
     ┌─────────┼─────────────────────────┐
     ▼         ▼                         ▼
┌─────────┐ ┌──────────┐ ┌──────────────────────────┐
│ PRESSURE│ │ RHYTHM   │ │ ENEMY / BOSS SYSTEMS     │
│ (HC-43) │ │ (HC-78)  │ │                          │
│         │ │          │ │ enemy-attacks.js         │
│ maps    │ │ scales   │ │   bullet speed × rank    │
│ rank→   │ │ wave     │ │ enemy-pattern-hooks.js   │
│ pressure│ │ timing   │ │   cooldown × rank        │
│ multiplier│ │ inversely│ │   dive timing × pressure │
│ 1.00→  │ │ to       │ │ boss-patterns.js         │
│ 1.18    │ │ pressure │ │   not rank-scaled        │
└─────────┘ └──────────┘ │ update-enemies.js        │
                         │   spawn rate (static)    │
                         └──────────────────────────┘
```

**Current rank flow:**
```
Player action → addHardcoreRank(amount, reason)
  → _hardcoreRank.value += amount
  → _hardcoreRankRecalc() recalculates level + multiplier
  → Pressure/Rhythm systems react to new rank level
  → Bullet speed, cooldown, timing all shift in real-time
  → Decay after 6s inactivity
```

---

## 12. Recommended Metrics (for HC-RK expansion)

### High Priority (implement first):
| Metric | Weight | Rationale |
|--------|--------|-----------|
| **Survival time since last hit** | 0.15–0.25/s | Direct skill indicator — harder to die = better |
| **Accuracy (shots hit / shots fired)** | Bonus modifier | Already tracked, zero implementation cost |
| **Combo sustain** (max combo in current wave) | Bonus at wave clear | Rewards consistent killing |
| **Graze chain** (consecutive grazes without break) | Small bonus per chain | Rewards risk-taking near bullets |

### Medium Priority:
| Metric | Weight | Rationale |
|--------|--------|-----------|
| **Wave clear speed** (time per wave) | Bonus at wave clear | Rewards efficiency |
| **No-continue streak** | Milestone bonus | Rewards ironman play |
| **Medal chain** (consecutive medal-worthy kills) | Per-medal bonus | Already tracked |

### Low Priority (defer):
| Metric | Weight | Rationale |
|--------|--------|-----------|
| DPS consistency | Complex | Needs boss damage tracking per-second |
| Boss survival time | Farmable | Can stall boss for time |
| Powerup efficiency | Subjective | "Good" powerup usage hard to define |

### Discarded Metrics:
| Metric | Reason |
|--------|--------|
| No-hit streak timer | Exploitable via pause/menu |
| Bomb usage | No bomb system exists |
| Dive dodge count | Requires new dive-detection logic |
| Death count | Already penalized (−8.0 per death), don't double-punish |
| Lives remaining | Already affects powerup emergency scaling |
| Score | Already has its own combo system |

---

## 13. Initial HC-RK Architecture Proposal

### Core Principle
"Jugar mejor sube el rank. Jugar peor baja el rank. El rank sube la intensidad sin romper fairness."

### Architecture Layers

```
Layer 0: RANK ENGINE (hardcore-rank.js) — already exists ✅
  - Rank value (0→100), level (1→5), multiplier (1.00→1.50)
  - Gain/loss/decay functions
  - Bullet speed, cooldown, intensity, score modifiers

Layer 1: RANK SOURCES (to audit/expand)
  - Current: kills, boss phase, boss clear, graze, death
  - Add: no-hit survival time, accuracy bonus, wave speed bonus
  - Cap: max gain per wave (prevent farming)

Layer 2: RANK EFFECTS (to harden)
  - Current: bullet speed ×1.12, cooldown ×0.88, pattern intensity +1
  - Add: wave pacing (via Rhythm), dive frequency, enemy count
  - Cap: prevent multiplicative explosion, enforce per-param ceilings

Layer 3: RANK SAFETY (new)
  - Fairness governor: block rank effects if bullet count > threshold
  - Readability governor: block speed increase if alpha visibility suffers
  - Per-boss caps: boss-specific maximum rank level
  - Per-wave caps: wave type-specific intensity ceiling

Layer 4: RANK FEEDBACK (to improve)
  - Current: HUD debug panel, rank up/down text
  - Add: intensity indicator (color shift on HUD), pre-wave rank display
  - Visual: rank affects background color grading (subtle)
```

### Key Design Decisions

**D1: Rank is monotonic but damped**
- Rank rises through skill, falls through death
- Decay prevents indefinite rise from easy kills
- No "rank spikes" — smooth transitions between levels

**D2: Rank affects speed and pacing, not HP or bullet count**
- Fast bullets + short cooldowns = intensity
- More HP = tedium (avoid)
- More bullets = bullet curtain (avoid — HC-RD violation)

**D3: Every rank effect has a cap**
- Bullet speed max: 1.08 (not 1.12) from rank
- Cooldown min: 0.90 (not 0.88) from rank
- Wave pause absolute min: 600ms
- Combined scaling ceiling per parameter

**D4: Rank is per-run, not persistent**
- Resets on game over / continue
- No meta-progression rank
- Arcade purity

---

## 14. Proposed Sprint Plan

### HC-RK-01 (this sprint) — DONE ✅
Full audit: where difficulty lives, what's missing, what's exploitable, recommended metrics, architecture proposal.

### HC-RK-02 — Rank Source Audit & Expansion
- Audit every `addHardcoreRank()` call site
- Add no-hit survival time tracking
- Add accuracy-based rank modifier
- Add wave-clear speed bonus
- Cap rank gain per wave (anti-farming)
- Document all rank sources in unified table

### HC-RK-03 — Rank Effect Harden & Capping
- Audit multiplicative scaling risks
- Add per-parameter absolute caps (bullet speed, cooldown, divers)
- Add combined-scaling ceiling
- Add rank effect smoothing (no sudden jumps)
- Test rank 5 + level 20 scenarios

### HC-RK-04 — Rank Safety Governor
- Add fairness-based rank effect blocking (bullet count gate)
- Add readability-based speed blocking
- Add per-boss maximum rank level
- Add per-wave-type intensity ceiling
- Emergency rank freeze on player near-death

### HC-RK-05 — Rank Feedback & Visual Polish
- Rank intensity HUD indicator
- Background color grading at high rank
- Pre-wave rank level display
- Rank milestone celebration (rank 5 MAX)

### HC-RK-06 — Integration & Freeze Preparation
- Integration test with all frozen systems (HC-RD, HC-HB, HC-PD, HC-WC, HC-BD)
- Full config gate matrix test
- Boss run at every rank level
- Wave density test at rank 5
- Freeze audit document

### HC-RK-07 — Final Freeze
- Consolidate into `ai/hc-rk-final-freeze.md`
- Freeze perimeter definition
- Risk table
- Deferred systems
- Future roadmap

---

## 15. Frozen Systems That HC-RK Must Preserve

| System | Freeze Status | HC-RK Constraint |
|--------|--------------|------------------|
| HC-RD readability | Frozen | Must not reduce alpha below floors |
| HC-HB hitbox | Frozen | Must not shrink player hitbox further |
| HC-PD pattern director | In-progress | Must not override pattern choices |
| HC-WC wave composer | In-progress | Must respect wave phase durations |
| HC-BD boss director | Frozen (HC-BD-14) | Must not override signature hooks |

---

## Risk Classification

### SAFE (no concern)
| System | Reason |
|--------|--------|
| Rank gain from kills | Already conservative (0.75/kill) |
| Rank decay | Slow and fair (0.15/s after 6s) |
| Score multiplier | Doesn't affect gameplay |
| Combo system | Score-only |
| Pressure multiplier capped at 1.18 | Well within safe range |

### MONITOR (watch for issues)
| System | Concern | Mitigation |
|--------|---------|------------|
| Bullet speed at rank 5 | 1.12× combined with level 20 = 5.42 | Cap at 5.20 |
| Cooldown at rank 5 | 0.88× combined = 486ms at level 20 | Floor at 450ms |
| Rhythm timing at rank 5 | Wave pauses as low as 0.70× | 600ms absolute floor |
| Boss phases at rank 5 | EMPERADOR might be unfair | Boss-specific caps needed |

### HIGH RISK (needs cap before release)
| System | Concern | Action |
|--------|---------|--------|
| Combined multiplicative scaling | Level × Balance × Rank × Pressure → speeds beyond readable | Implement HC-RK-03 capping |
| Diver count + speed + cooldown at rank 5 level 20 | Full-screen threat density | Absolute caps per wave type |
| No rank safety governor | Rank 5 can fire with 30+ bullets on screen | Implement HC-RK-04 governor |
