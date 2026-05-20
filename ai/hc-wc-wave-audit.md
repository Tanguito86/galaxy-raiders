# HC-WC-01 — Hardcore Wave Audit

> **Sprint**: HC-WC-01
> **Date**: 2026-05-19
> **Status**: Audit Complete
> **Objective**: Full audit of current wave architecture before HC-WC implementation.
> **Rule**: NO implementation. Analysis only.

---

## 1. WAVE ARCHITECTURE — CURRENT STATE

### 1.1 Wave Lifecycle

| Phase | Trigger | File | Line |
|-------|---------|------|------|
| Wave start | `startLevel()` called from update loop | `entities.js` | 390 |
| Wave spawn | `initEnemies()` or `initBoss()` | `entities.js` | 1022 / 1094 |
| Active combat | `updateEnemiesAndProjectiles()` | `update-enemies.js` | 53 |
| Wave clear | `aliveCount === 0` detected | `update.js` | 61 |
| Transition | `beginWaveTransition()` + `levelClearTimer` | `update.js` | 5 |
| Next wave | `level++` then `startLevel()` | `update.js` | 124 |

### 1.2 Level Progression Table

| Level | Type | Formation / Set Piece | Enemy Count | Boss |
|-------|------|----------------------|-------------|------|
| 1 | normal | classic (5x8 grid) | 40 | — |
| 2 | normal | vshape (5x6 staggered) | 30 | — |
| 3 | set piece | PINCER ASSAULT | 29 | — |
| 4 | special | tanks (3x5 alien3) | 15 | — |
| 5 | boss | — | — | CRABTRON |
| 6 | normal | diamond (2-4-6-4-2) | 18 | — |
| 7 | set piece | FORTRESS LINE | 24 | — |
| 8 | special | kamikazes (4x7 alien5) | 28 | — |
| 9 | normal | zigzag (5x7 offset) | 35 | — |
| 10 | boss | — | — | SERPENTRIX |
| 11 | normal | classic | ~40 | — |
| 12 | set piece | KAMIKAZE RUSH | 25 | — |
| 13 | normal | diamond | ~18 | — |
| 14 | normal | zigzag | ~35 | — |
| 15 | boss | — | — | ORBITAL |
| 16 | set piece | SPLITTER STORM | 26 | — |
| 17 | normal | vshape | ~30 | — |
| 18 | set piece | IMPERIAL GUARD | 25 | — |
| 19 | boss | — | — | TENIENTE |
| 20 | boss | — | — | EMPERADOR |

### 1.3 Formation Catalog

| Formation | Shape | Distinctiveness | Visual Silueta |
|-----------|-------|-----------------|----------------|
| classic | 5 rows × 8 cols, uniform grid | LOW | Rectangle — forgettable |
| vshape | 5 rows, narrowing inward | LOW-MED | Subtle V — barely noticeable |
| diamond | 2-4-6-4-2 pyramid | MED | Recognizable at a glance |
| zigzag | 5 rows, alternating offset | LOW-MED | Nearly identical to classic row |
| set pieces | Hand-authored formations | HIGH | Strong intent, distinct layouts |

### 1.4 Wave Type Classification (Current)

| `getWaveType()` Return | Level(s) | Composition | Tactical Identity |
|------------------------|----------|-------------|-------------------|
| `'boss'` | 5,10,15,19,20 | Boss encounter | Clear — boss fight |
| `'tanks'` | 4 | 15x alien3 only | Weak — "lots of tanks" |
| `'kamikazes'` | 8 | 28x alien5 only | Weak — "lots of kamikazes" |
| `'normal'` | 1,2,6,9,11,13,14,17 | Mixed by `getEnemyTypeForRow()` | NONE — generic grid |

Note: Levels 3,7,12,16,18 are set pieces (checked before `getWaveType`).

---

## 2. SPAWN FLOW ARCHITECTURE

### 2.1 Spawn Decision Tree

```
startLevel()
├── BOSS_LEVELS.includes(level) ?
│   ├── YES → initBoss()
│   │   └── Creates boss entity, sets pattern, satellites
│   └── NO → initEnemies()
│       ├── getSetPieceForLevel(level) ?
│       │   ├── YES → createSetPieceFormation(key)
│       │   │   ├── Hand-authored positions
│       │   │   ├── Entry delays per enemy (staggered)
│       │   │   └── intro timer + banner
│       │   └── NO → createFormation(formation)
│       │       ├── Special wave? → full-grid single-type
│       │       └── Normal wave → getEnemyTypeForRow(row, level)
│       │           ├── assignInitialShmupRoutes() (up to 12%)
│       │           ├── trimFormationForExternalShmupWave()
│       │           ├── addInitialExternalShmupWave() (2-3 enemies)
│       │           ├── applyEncounterFormationPacing() (stagger)
│       │           └── applyFormationGeometry() (personality)
```

### 2.2 Enemy Type Per Row (Normal Waves)

`getEnemyTypeForRow(row, levelNum)` at `entities.js:543`:

| Level Range | Row 0 | Row 1 | Row 2-3 | Row 4 |
|-------------|-------|-------|---------|-------|
| 1-3 | alien1 | alien1 | alien1 | alien2 |
| 4-8 | alien3 | alien1 | alien1 | alien2 (30% alien4) |
| 9+ | 50% alien3 | 30% alien6 | alien1 | 40% alien5, 30% alien4 else alien2 |

### 2.3 Timing Systems

| System | File | Mechanism | Effect |
|--------|------|-----------|--------|
| Silence on death | `encounter-director.js:250` | 320-420ms cooldown after enemy death | Prevents immediate respawn |
| Silence on wave clear | `encounter-director.js:529` | 900ms silence when all enemies dead | Breathing room |
| Spawn stagger | `encounter-director.js:362-420` | Per-enemy delay based on role/index | Soft entry staggering |
| Formation pacing | `entities.js:974-1020` | Per-enemy delay via encounter director | Staggered grid fill |
| Set piece intro | `entities.js:1032` | 2200ms intro timer + per-row entry | Dramatic entrance |
| Wave transition | `update.js:5-36` | 900ms pause + announcement text | Level demarcation |
| Relief system | `encounter-director.js:546-568` | Accelerated pressure decay when calm | Passive recovery |

---

## 3. PROBLEMS DETECTED

### 3.1 IDENTITY PROBLEMS (SEVERE)

#### P-ID-01 — Waves Lack Tactical Identity
- **Severity**: HIGH
- **Impact**: Gameplay feels like "spawn groups" not "combat encounters"
- **Evidence**: Levels 1,2,6,9,11,13,14,17 are indistinguishable. Same `getEnemyTypeForRow()` logic, minor formation shift.
- **Files**: `entities.js:543-564`, `entities.js:596-693`
- **Player experience**: "Another wave. Kill enemies. Next."

#### P-ID-02 — Formations Are Generic
- **Severity**: HIGH
- **Impact**: No visual memory, no positional strategy
- **Evidence**: 4 formations rotate mechanically. `classic` = rectangle, `vshape` = slightly narrow top visible only if you stop to look, `diamond` = barely different from classic, `zigzag` = offset rows (25px — invisible).
- **Files**: `entities.js:445-455`, `entities.js:649-692`
- **Note**: `applyFormationGeometry()` at `entities.js:696-774` does apply personality-driven transforms (compression, lane gaps), but these are subtle and overridden by formation movement.

#### P-ID-03 — Special Waves Are Monoculture
- **Severity**: MEDIUM
- **Impact**: "Tank wave" (level 4) = 15x alien3 in a rectangle. "Kamikaze wave" (level 8) = 28x alien5 in a rectangle. No composition, no counterpoint.
- **Files**: `entities.js:601-645`
- **These are singular waves (1/20 levels each). High waste potential.**

#### P-ID-04 — Wave Type Is Undefined for Most Levels
- **Severity**: MEDIUM
- **Impact**: `getWaveType()` returns `'normal'` for 8/15 non-boss levels. No tactical label.
- **Files**: `entities.js:458-469`

### 3.2 PACING PROBLEMS (SEVERE)

#### P-PC-01 — No Micro-Structure Within Waves
- **Severity**: CRITICAL
- **Impact**: No build-up → peak → relief arc. All enemies spawn, all fire independently, wave ends.
- **Evidence**: `createFormation()` creates all enemies at once. Stagger via `applyEncounterFormationPacing()` only delays individual enemies by 180-850ms. There is no phase system.
- **Files**: `entities.js:596-693`, `entities.js:974-1020`
- **What's missing**: Introductory phase (light enemies, teach the formation), escalation phase (divers activate, special attacks begin), climax phase (coordinated volleys), cleanup phase (stragglers, relief window).

#### P-PC-02 — Wave Personality Rotation Is Random
- **Severity**: MEDIUM
- **Impact**: Personality (balanced/swarm/sniper/pressure/cleanup/flanker) chosen per-wave via `selectNextWavePersonality()` with a slight level-based lean. No arc across a full stage. Two consecutive waves can have clashing personalities.
- **Files**: `encounter-director.js:316-344`
- **Personality only affects**: stagger multiplier, dive bias, silence multiplier, relief multiplier, rotation aggression. It does NOT affect enemy composition, attack patterns, or formation layout (except via `applyFormationGeometry`).

#### P-PC-03 — Boss Prelude Is Absent
- **Severity**: HIGH
- **Impact**: Boss levels (5,10,15,19,20) have no preceding "prelude" wave that builds tension. Player clears a normal wave, announcement says "BOSS INCOMING", boss appears. No escalation.
- **Files**: `update.js:16-23`, `entities.js:390-441`
- **Opportunity**: Level 4 (pre-CrabTron), level 9 (pre-Serpentrix), level 14 (pre-Orbital), level 18 (pre-Teniente) already have non-boss waves. These could be tagged as prelude waves.

#### P-PC-04 — Wave Transition Is Binary
- **Severity**: MEDIUM
- **Impact**: Wave clear → 900ms silence → instant full spawn. No "wave incoming" visual beyond text banner. No arrival animation for formations.
- **Files**: `update.js:5-36`
- **Set pieces** have an intro timer (2200ms) and enemy entry animation. Normal waves do not.

#### P-PC-05 — Relief Is Reactive, Not Deliberate
- **Severity**: MEDIUM
- **Impact**: Relief activates when pressure drops AND no divers active AND bullets below threshold. It accelerates pressure decay. But there's no designed "relief moment" — it just happens when the math allows it.
- **Files**: `encounter-director.js:546-568`
- **What's missing**: Intentional quiet windows between wave phases. Post-wave-clear silence is the only guaranteed relief.

### 3.3 OVERLAP & UNFAIRNESS PROBLEMS

#### P-OV-01 — Simultaneous Archetype Firing
- **Severity**: HIGH
- **Impact**: All 6 archetypes have independent cooldowns (1800-5500ms range). When cooldowns accidentally align (especially after wave-clear silence where all timers reset), multiple patterns fire in the same frame. No inter-pattern gate exists.
- **Evidence**: 
  - Sniper: 2000-3500ms (`enemy-pattern-hooks.js:95-96`)
  - Suppressor: 2000-3500ms (`enemy-pattern-hooks.js:278-279`)
  - Chaser: 2000-3600ms (`enemy-pattern-hooks.js:474-475`)
  - Sweeper: 3200-5500ms (`enemy-pattern-hooks.js:426-427`)
  - Flanker: 2800-4600ms (`enemy-pattern-hooks.js:529-530`)
  - Baiter: 1800-3200ms (`enemy-pattern-hooks.js:590-591`)
- **Files**: `enemy-pattern-hooks.js` (all 6 patterns), triggered from `update-enemies.js:1020-1114`

#### P-OV-02 — Diver + Kamikaze Toxic Pair
- **Severity**: CRITICAL
- **Impact**: High-pressure window with simultaneous divers + kamikazes creates unavoidable crossfire. `canCoordinateEliteAction()` at `encounter-director.js:588-654` does block some cases, but the gate is pressure-based (0.82 threshold) and only checks if roles *already* active. It doesn't prevent both being selected in the same frame.
- **Files**: `encounter-director.js:609-626`, `update-enemies.js:800-869`

#### P-OV-03 — External Shmup + Formation Overlap
- **Severity**: MEDIUM
- **Impact**: 2-3 external shmup enemies enter from top/sides concurrently with the main formation. No coordination between their arrival timing and formation activity. External enemies can fire aimed shots while player is dodging formation bullets.
- **Files**: `entities.js:811-885`

#### P-OV-04 — Set Piece Fire + Diver Activation Same Frame
- **Severity**: MEDIUM
- **Impact**: Set piece fire patterns (fortress volleys, imperial guard crossfire) run on independent timers. Diver selection also runs per-frame. Both can activate simultaneously, creating spike.
- **Files**: `enemy-attacks.js:75-266`, `update-enemies.js:800-869`

#### P-OV-05 — Crossfire During Cleanup Personality
- **Severity**: LOW
- **Impact**: Cleanup personality blocks kamikaze + sniper but doesn't explicitly gate flanker crossfire or sweeper fans. Flankers (alien6) generate oblique crossfire that restricts lateral movement.
- **Files**: `encounter-director.js:629-639`

### 3.4 READABILITY PROBLEMS

#### P-RD-01 — Instant Spawn, No Warning
- **Severity**: HIGH
- **Impact**: After wave transition, 20-40 enemies appear instantly. No visual lead-in. Player needs ~200ms to parse the new layout while already under fire.
- **Files**: `entities.js:1022-1092`
- **Set pieces** have 2200ms intro with staggered entries. Normal waves have none.

#### P-RD-02 — Type Language Invisible at Spawn
- **Severity**: MEDIUM
- **Impact**: All enemy types spawn with the same spawn flash. Player cannot distinguish sniper vs sweeper vs flanker until they fire. The spawn flash only communicates "enemy exists" not "enemy role".
- **Files**: `entities.js:567-592` (spawnFlashTimer applies to all equally)

#### P-RD-03 — Formation Movement Obscures Layout
- **Severity**: MEDIUM
- **Impact**: Enemy formation moves left-right as a block (`enemySpeedX * enemyDir`). This constant lateral drift makes the initial formation shape dissolve within seconds. The zigzag offset becomes invisible after one direction change.
- **Files**: `update-enemies.js:772-798`

#### P-RD-04 — Diver Telegraphs Are Solo, Not Squad
- **Severity**: LOW
- **Impact**: Each diver (alien3) has its own telegraph (380ms flash). When 2-3 divers telegraph simultaneously, they blink independently without a unified warning. Player sees scattered flashes, not "divers incoming."
- **Files**: `enemy-pattern-hooks.js:187-210`

#### P-RD-05 — External Enemy Entries Have No Visual Herald
- **Severity**: MEDIUM
- **Impact**: External shmup enemies enter from top/sides of screen with no direction indicator, no off-screen warning arrow, no entry sound.
- **Files**: `entities.js:811-885`

### 3.5 FORGETTABLE WAVES

The following waves have minimal identity and blend into generic gameplay:

| Level | Type | Why Forgettable |
|-------|------|----------------|
| 1 | normal/classic | Tutorial wave with no tutorial intent. Just enemies. |
| 2 | normal/vshape | V-shape invisible under lateral movement. |
| 6 | normal/diamond | Post-boss recovery with no fanfare. Diamond barely visible. |
| 9 | normal/zigzag | Mid-game plateau. First appearance of alien6 but player won't notice. |
| 11 | normal/classic | Post-boss lull. Same as level 1 but harder. |
| 13 | normal/diamond | Post-set-piece. Diamond formation again. |
| 14 | normal/zigzag | Pre-boss with no prelude tension. |
| 17 | normal/vshape | Post-set-piece. Penultimate non-boss level feels like filler. |

**8 of 15 non-boss levels are forgettable. That's 53%.**

### 3.6 STAGE PROGRESSION PROBLEMS

#### P-SP-01 — No Stage-Level Arc
- **Severity**: CRITICAL
- **Impact**: Each stage (group of 5 levels culminating in a boss) has no internal narrative. Level 1-2 feel the same as 11-12 in structure. Only difficulty numbers change.
- **Evidence**: The only structural variation across stages is enemy speed (0.92→1.96), bullet speed (2.70→4.84), shoot cooldown (1020→552ms). Composition changes are threshold-based (level 4, 9, 12) not stage-based.
- **Files**: `balance.js:7-43`

#### P-SP-02 — Stage Theme Is Unused
- **Severity**: LOW
- **Impact**: `const stage = Math.floor((level - 1) / 5)` exists (at `entities.js:1089`) but is only used for `enemySpeedX`. Stages have music themes, palettes, and backgrounds, but no enemy composition influence.
- **Files**: `entities.js:1089-1091`

### 3.7 PATTERN SIMULTANEITY & SATURATION

#### P-SM-01 — No Inter-Pattern Gate
- **Severity**: HIGH
- **Impact**: HC-PD exists and can recommend delays, but `applyDelay` defaults to false. The pattern director evaluates threat budgets but doesn't actively gate enemy patterns. Sweeper fan + suppressor burst + sniper shot + diver telegraph can all happen within the same 200ms window.
- **Files**: `hc-pattern-director.js` (advisory only, line ~50-55), `enemy-pattern-hooks.js` (all patterns fire independently)

#### P-SM-02 — Bullet Density Spikes
- **Severity**: MEDIUM
- **Impact**: When 3+ archetypes fire in the same frame window, bullet density can spike from ~10 to ~40+. No density capping at runtime. The density caps exist in HC-PD config (`max 40 bullets`) but are advisory.
- **Files**: `hc-pattern-director.js:36-37` (config only), no enforcement in update loop

#### P-SM-03 — Sweeper Fan + Crossfire Visual Overload
- **Severity**: MEDIUM
- **Impact**: Sweeper color `#88ddff` (cyan-blue) vs flanker color `#cc88ff` (purple) vs suppressor color `#ff6688` (pink-red) — when all 3 patterns fire simultaneously, 10-12 bullets with similar outlines but different meanings saturate the screen.
- **Files**: `enemy-pattern-hooks.js`, color definitions

### 3.8 ESCAPE LANE PROBLEMS

#### P-EL-01 — No Lane Preservation Logic
- **Severity**: HIGH
- **Impact**: Formation spawning places enemies on a grid with no guaranteed vertical corridors. The zigzag and vshape formations naturally create some gaps, but nothing is explicitly designed.
- **Files**: `entities.js:649-692`

#### P-EL-02 — Set Pieces Can Seal Both Flanks
- **Severity**: MEDIUM
- **Impact**: PINCER ASSAULT (level 3) has enemies on both left and right edges with snipers in center. Fortress line spans nearly the full screen width. When combined with crossfire firing, lateral escape can be sealed.
- **Files**: `entities.js:487-539`

#### P-EL-03 — External Shmup + Edge Pressure
- **Severity**: MEDIUM
- **Impact**: External shmup enemies sweep from left/right while formation fills the center. Combined with crossfire (aimed diagonally), all lanes can compress.

### 3.9 ARCHETYPE DOMINANCE

#### P-AD-01 — Sweeper (alien1) Over-Represented
- **Severity**: LOW
- **Impact**: In levels 1-3, alien1 is 75% of composition. In levels 4-8, alien1 is ~66% (row 1-3). Sweeper fan fire is frequent and creates background noise that desensitizes the player.
- **Files**: `entities.js:543-564`

#### P-AD-02 — Single-Type Waves Have No Counter-Rhythm
- **Severity**: MEDIUM
- **Impact**: Level 4 (15 tanks) — all alien3, all divers, all telegraph → dive → recover. Level 8 (28 kamikazes) — all alien5, all chasers. No variety. Player adapts in 5 seconds and then it's repetition.
- **Files**: `entities.js:610-645`

---

## 4. OPPORTUNITIES FOR SETPIECES

### 4.1 Mini Setpieces

Levels that could become mini-setpieces with minimal changes:

| Level | Current | Opportunity | Difficulty |
|-------|---------|-------------|------------|
| 2 | normal/vshape | Teach formation reading — "VANGUARD LINE" | Low — add banner, tweak entry |
| 4 | special/tanks | Tank phalanx with staggered dives — "IRON RAIN" | Low — already special |
| 6 | normal/diamond | Post-boss recovery wave — "REGROUP" | Low — reduce density, add relief |
| 8 | special/kamikazes | Pursuit squad — "WOLF PACK" | Low — already special |
| 9 | normal/zigzag | Mid-game escalation — "DIVISION BREACH" | Medium — introduce new comp |
| 13 | normal/diamond | Post-set-piece breather — "RESPITE" | Low — intentional low-pressure |
| 17 | normal/vshape | Penultimate stand — "LAST LINE" | High — should feel climactic |

### 4.2 Boss Preludes

| Boss | Prelude Level | Current State | Opportunity |
|------|---------------|---------------|-------------|
| CRABTRON (5) | 4 | Tanks wave | Tag as prelude, add "APPROACHING: CRABTRON" subtext, reduce silence so boss enters faster |
| SERPENTRIX (10) | 9 | Normal/zigzag | Tag as prelude, add mine-tease enemies, green palette shift |
| ORBITAL (15) | 14 | Normal/zigzag | Tag as prelude, add satellite-drones, cyan palette shift |
| TENIENTE (19) | 18 | Imperial Guard set piece | Already solid, could add "FINAL APPROACH" flavor |
| EMPERADOR (20) | 19 | Teniente boss | Add "THE THRONE AWAITS" flavor, victory pre-echo |

### 4.3 Setpiece Potential

| Level | Current | Setpiece Potential | Why |
|-------|---------|-------------------|-----|
| 1 | normal | Tutorial setpiece — "FIRST CONTACT" | Teach basic mechanics with curated enemy placement |
| 4 | tanks | "IRON PHALANX" | Staggered dive waves, shield-wall aesthetic |
| 8 | kamikazes | "HUNTING PACK" | Flanking pursuit patterns, predator-prey dynamic |
| 11 | normal | "RECONSTRUCTION" | Post-boss, reduced enemies, reward-rich breather |
| 14 | normal | "OMINOUS CALM" | Pre-Orbital, minimal enemies, tension-building silence |

---

## 5. HOOKS REUSABLE FOR HC-WC

### 5.1 Existing Safe Hooks

| Hook | File | Line | HC-WC Use |
|------|------|------|-----------|
| `getWaveType(level)` | `entities.js` | 458 | Read current wave tactical label |
| `getCurrentWavePersonality()` | `encounter-director.js` | 664 | Read personality for composition decisions |
| `selectNextWavePersonality()` | `encounter-director.js` | 316 | Hook into personality selection for HC-WC override |
| `getEncounterDirectorState()` | `encounter-director.js` | 670 | Full director telemetry (pressure, relief, silence, roles) |
| `canSpawnRole(role)` | `encounter-director.js` | 443 | Gate per-role spawning decisions |
| `suggestEncounterRole(role, context)` | `encounter-director.js` | 265 | Rotation system — HC-WC can extend |
| `getEncounterStaggerDelay()` | `encounter-director.js` | 383 | Per-enemy delay timing |
| `canCoordinateEliteAction()` | `encounter-director.js` | 588 | Elite overlap prevention |
| `resetEncounterDirectorForLevel()` | `encounter-director.js` | 451 | Clean state for new wave |
| `getFormation(levelNum)` | `entities.js` | 445 | Formation selection hook |
| `getEnemyTypeForRow(row, levelNum)` | `entities.js` | 543 | Per-row type assignment |
| `createFormation(formation)` | `entities.js` | 596 | Formation factory |
| `applyFormationGeometry(enemies, personality)` | `entities.js` | 696 | Post-creation transformation |
| `applyEncounterFormationPacing()` | `entities.js` | 974 | Pacing/stagger application |
| `getSetPieceForLevel()` | `entities.js` | 479 | Set piece detection |
| `getEnemyIdentity(enemy)` | `enemy-identity.js` | 63 | Archetype role lookup |
| `getEnemyRole(enemy)` | `enemy-identity.js` | 69 | Rapid role check |
| `getEncounterDirectorSnapshot()` | `encounter-director.js` | 702 | Telemetry for debugging |
| `tryApplyPatternDelay()` | `hc-pattern-director.js` | — | Pattern gating (currently advisory) |
| `getHardcorePressureState()` | `hardcore-pressure.js` | 78 | Pressure multiplier for scaling |
| `getHardcoreRhythmWavePause()` | `hardcore-rhythm.js` | 56 | Wave transition timing |
| `getHardcoreRankLevel()` | `hardcore-rank.js` | — | Player skill level for adaptive composition |

### 5.2 Config Slots Ready

| Config Path | Purpose |
|-------------|---------|
| `GALAXY_CONFIG.encounterDirector.*` | All director parameters (silence, stagger, relief, thresholds) |
| `GALAXY_CONFIG.pressure.*` | Pressure multiplier levels |
| `GALAXY_CONFIG.rhythm.*` | Wave pause/intro/entry delay scaling |
| `GALAXY_CONFIG.readability.*` | All visual layer configurations |
| `GALAXY_CONFIG.enemyAI.*` | Tactical AI parameters |
| `DIFFICULTY_TABLE.*` | Per-level balance numbers |
| `SET_PIECE_BY_LEVEL.*` | Set piece key/name per level |
| `BOSS_LEVELS` | Boss milestone array |
| `BOSS_DATA.*` | Boss parameters per level |
| `ENEMY_TYPES.*` | Enemy type definitions |

---

## 6. TECHNICAL RISKS

### 6.1 Encounter Director Compatibility

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| HC-WC overrides personality selection breaking relief | LOW | HIGH | Use `selectNextWavePersonality` as hook point, preserve fallback |
| Wave composition changes break role caps | LOW | HIGH | `canSpawnRole()` is per-role gating; composition changes must respect caps |
| New wave phases break silence timer | MEDIUM | MEDIUM | Silence is timer-based; adding phases means fewer silence windows — fine |
| HC-WC micro-phases desync pattern cooldowns | MEDIUM | LOW | Cooldowns are independent per-enemy; desync is expected and acceptable |

### 6.2 Pattern Director Compatibility

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| HC-WC composition changes increase threat budget | MEDIUM | MEDIUM | HC-PD is advisory only; no automatic blocking |
| Coordinated volleys from HC-WC may exceed density caps | LOW | MEDIUM | Density caps are config values; can be raised for intentional setpiece moments |
| New archetype combinations trigger unknown HC-PD warnings | LOW | LOW | Warnings are non-blocking |

### 6.3 Hitbox Fairness (HC-HB) Compatibility

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| New formation layouts create unfair bullet spawns | LOW | HIGH | `validateBulletFairness()` checks every bullet; composition changes don't affect hitbox |
| Density spikes from coordinated fire may create unavoidable patterns | MEDIUM | HIGH | Must test each new composition; escape lane preservation is critical |

### 6.4 Performance Risk

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| HC-WC wave composition logic runs every frame | LOW | LOW | Composition decisions happen once per wave (at `initEnemies()`). No per-frame cost. |
| New wave phase state machine adds per-frame overhead | LOW | LOW | Trivial: a few integer comparisons per frame |

---

## 7. WAVE CLASSIFICATION — EXTENDED TAXONOMY

### 7.1 Proposed HC-WC Wave Taxonomy

| Category | Description | Current Example | HC-WC Example |
|----------|-------------|-----------------|---------------|
| **PRESSURE** | Sustained threat, gradual escalation, forces movement | None explicitly | Sweepers + suppressors in wide fan, rotating fire lanes |
| **SWARM** | High count, low individual threat, rewards AoE | Level 4 tanks (monoculture) | Mixed light enemies with 1-2 anchors |
| **SNIPER** | Precision threats, rewards micro-dodging | None explicitly | 3-4 snipers with synchronized volleys, wide safe lanes between |
| **DIVER** | Vertical aggression, forces upward movement | None explicitly | Staggered dive waves (2-3 divers per wave, 3 waves) |
| **MIXED** | Balanced composition, teaches multi-threat reading | Levels 9+ (random) | Curated mix: 1 anchor + 2 snipers + 3 sweepers + 1 chaser |
| **RELIEF** | Intentional low-pressure breather, reward-rich | Wave-clear silence only | Curated 5-8 easy enemies, guaranteed power-up, quiet backdrop |
| **PRELUDE** | Tension builder before boss | None | Minimal enemies, atmospheric effects, "incoming" telegraphs |
| **SETPIECE** | Hand-authored tactical encounter | Levels 3,7,12,16,18 | Enhanced with micro-phases, positional puzzles |
| **STALKER** | Hunt/pursuit dynamic | None | 2-4 chasers + baiters, player-directed aggression |
| **FORTIFICATION** | Static defense-breaking puzzle | Level 7 fortress | Enhanced: shield enemies, breakable formations |
| **AMBUSH** | Surprise entry, quick spike, fast resolution | None | External shmup wave from multiple directions with warning |

### 7.2 Current Wave Classification

Applying the taxonomy above to current waves:

| Level | Current Label | Actual Category | Mismatch |
|-------|---------------|-----------------|----------|
| 1 | normal | UNDEFINED | No tactical identity |
| 2 | normal | UNDEFINED | No tactical identity |
| 3 | PINCER ASSAULT | SETPIECE (weak) | Decent layout, no micro-phases |
| 4 | tanks | MONOCULTURE | All alien3, no variety |
| 6 | normal | UNDEFINED | No tactical identity |
| 7 | FORTRESS LINE | SETPIECE (medium) | Good structure, fixed rows |
| 8 | kamikazes | MONOCULTURE | All alien5, no variety |
| 9 | normal | RANDOM | getEnemyTypeForRow uses Math.random |
| 11 | normal | RANDOM | Same random mix |
| 12 | KAMIKAZE RUSH | SETPIECE (weak) | Named but structurally similar to fortress |
| 13 | normal | RANDOM | Same random mix |
| 14 | normal | RANDOM | Same random mix |
| 16 | SPLITTER STORM | SETPIECE (medium) | Good concept, split mechanic underused |
| 17 | normal | RANDOM | Same random mix |
| 18 | IMPERIAL GUARD | SETPIECE (strong) | Best set piece — crossfire, telegraphs, burst phases |

**Result**: 8/15 non-boss waves are UNDEFINED or RANDOM. Only set pieces have tactical labels, and even those are inconsistently developed.

---

## 8. MICRO-STRUCTURE GAP ANALYSIS

### 8.1 What Constitutes a "Good" Wave

A hardcore shmup wave should have:

| Element | Current State | Gap |
|---------|---------------|-----|
| **Intro phase** — introduces threat, lets player read layout | Present in set pieces (2200ms). Absent in normal waves. | CRITICAL |
| **Build-up** — gradual activation of enemy types | Not present. All enemies active immediately. | CRITICAL |
| **Peak** — maximum tension moment, most patterns active | Happens organically when cooldowns align. Not designed. | HIGH |
| **Resolution** — easing off, last enemies, breathing room | Happens when enemies die naturally. Not designed. | HIGH |
| **Visual identity** — recognizable silueta, color scheme, motion | Set pieces have this. Normal waves do not. | HIGH |
| **Tactical teaching** — teaches a skill the player needs later | Not present. | MEDIUM |
| **Reward timing** — power-up or score opportunity at safe moment | Random drops only. UFO is random timer. | MEDIUM |

### 8.2 Phase Timing Models (Reference)

For HC-WC, each wave could follow a rhythm:

```
[INTRO: 1500ms] → [BUILD: 3000-5000ms] → [PEAK: 2000-3000ms] → [RESOLVE: 2000ms]
```

Currently:
```
[INSTANT SPAWN] → [INDEFINITE COMBAT until all dead] → [SILENCE 900ms]
```

---

## 9. RECOMMENDATIONS FOR HC-WC

### 9.1 Phase 1 — Classification (No Gameplay Change)

1. **Tag every wave with HC-WC taxonomy label** — Add `waveTacticalLabel` to wave config. Classify existing levels: 1=RELIEF, 2=SWARM, 3=SETPIECE_PINCER, 4=PRELUDE_CRABTRON, etc.

2. **Create wave identity map** — File `www/hc-wc-wave-identity.js` mapping level → { label, category, phases, compositionHint, visualTheme }.

3. **Add telemetry fields** — Extend `getEncounterDirectorSnapshot()` with: `waveTacticalLabel`, `phaseActive`, `phaseTimer`, `patternsFiredThisPhase`.

### 9.2 Phase 2 — Micro-Structure (Minimal Gameplay Change)

4. **Implement wave phases for normal waves** — Add `wavePhase` state machine (intro/build/peak/resolve). During intro phase, enemies are present but don't fire. Build phase: sweepers + basic shooters activate. Peak phase: all archetypes active. Resolve phase: no new dives, suppressors stop.

5. **Staggered archetype activation** — Instead of all enemies firing from frame 1, activate archetypes progressively:
   - Intro (1200ms): visual only, position settling
   - Build (3000ms): sweepers + basic shooters
   - Peak (until 40% enemies remain): all archetypes
   - Resolve (last 40%): snipers + divers deactivated

6. **Pattern gate between archetypes** — Add minimum spacing (200ms) between different archetype patterns. If suppressor fires at t=0, next non-suppressor pattern can fire at t=200 minimum.

### 9.3 Phase 3 — Identity & Composition

7. **Replace `getEnemyTypeForRow` with curated compositions** — Each level gets a hand-authored `WAVE_COMPOSITION[level]` defining exact counts per archetype, not random `Math.random()` assignments.

8. **Add prelude waves** — Tag levels 4, 9, 14, 18 as preludes with:
   - Reduced enemy count (8-12)
   - Thematic enemies (matching upcoming boss)
   - "APPROACHING" banner 3000ms before wave clear
   - Extended silence before boss (reduced, not 900ms — boss should enter faster after prelude)

9. **Add relief waves** — Tag levels 6, 13 as intentional relief:
   - 5-8 light enemies
   - Guaranteed power-up spawn at wave start
   - Reduced pattern frequency
   - Atmospheric quiet (music ducking, background dim)

10. **Rework special waves** — Level 4 (tanks): stagger dives into 3 waves. Level 8 (kamikazes): add baiters as counter-rhythm.

### 9.4 Phase 4 — Visual & Readability

11. **Wave arrival animation** — Formation slides in from top or fades in over 800ms instead of instant appearance.

12. **Role-colored spawn flash** — Each archetype gets distinct spawn flash color: sweeper=cyan, sniper=red, diver=orange, suppressor=lime, chaser=magenta, flanker=purple, baiter=yellow.

13. **Off-screen threat indicators** — Arrow markers at screen edges for external shmup enemies, with color matching their archetype.

14. **Lane preservation visualization** — Explicit vertical corridors kept clear during formation layout. Gap columns highlighted briefly at wave start.

### 9.5 Priorities

| Priority | Recommendation | Effort | Impact |
|----------|---------------|--------|--------|
| P0 | Wave phase state machine (#4) | Medium | HIGH — Structural change, affects every wave |
| P0 | Tag all waves with taxonomy (#1) | Low | HIGH — Foundation for all other work |
| P1 | Curated compositions (#7) | Medium | HIGH — Replaces random with intentional |
| P1 | Staggered archetype activation (#5) | Low | HIGH — Instant improvement to pacing |
| P1 | Wave arrival animation (#11) | Low | MEDIUM — Immediate visual upgrade |
| P2 | Prelude waves (#8) | Medium | MEDIUM — Narrative structure |
| P2 | Relief waves (#9) | Low | MEDIUM — Fairness improvement |
| P2 | Pattern inter-archetype gate (#6) | Low | MEDIUM — Prevents density spikes |
| P2 | Role-colored spawn flash (#12) | Low | LOW — Readability polish |
| P3 | Rework special waves (#10) | Medium | LOW — Only affects 2 levels |
| P3 | Off-screen indicators (#13) | Low | LOW — Edge case improvement |
| P3 | Lane preservation visualization (#14) | Medium | LOW — Visual polish |

---

## 10. TELEMETRY CANDIDATES

Fields to add to `getEncounterDirectorSnapshot()` for HC-WC validation:

| Field | Type | Purpose |
|-------|------|---------|
| `waveTacticalLabel` | string | Which HC-WC category this wave belongs to |
| `phaseActive` | string | Current phase (intro/build/peak/resolve) |
| `phaseTimer` | number | Milliseconds in current phase |
| `phaseTransitionCount` | number | How many phase transitions occurred |
| `patternsFiredThisFrame` | number | Count of distinct patterns that fired this frame |
| `patternsBlockedByGate` | number | Count of patterns blocked by inter-archetype gate |
| `densitySpikeFrames` | number | Frames where bullet count > threshold |
| `escapeLaneCount` | number | Current number of open vertical lanes |
| `archetypesActive` | object | Per-archetype active count |
| `preludeActive` | boolean | Is this a prelude wave |
| `reliefDesigned` | boolean | Is this a designed relief wave (vs reactive) |

---

## 11. LOAD ORDER & COMPATIBILITY VERIFICATION

### 11.1 File Load Order (www/index.html)

Files relevant to HC-WC, in load order:

| # | File | HC-WC Dependency |
|---|------|-----------------|
| 1 | `config.js` | None |
| 2 | `state.js` | None |
| 3 | `game-config.js` | Config slots for HC-WC |
| 4 | `hardcore-config.js` | Config readers |
| 5 | `hc-hitbox-config.js` | None |
| 6 | `balance.js` | Per-level tables |
| 7 | `debug-balance.js` | None |
| 8 | `entities.js` | **`startLevel()`, `initEnemies()`, `getFormation()`, `getWaveType()`, `getEnemyTypeForRow()`, `createFormation()`, `applyFormationGeometry()`, `applyEncounterFormationPacing()`** |
| 9 | `entity-manager.js` | None |
| 10 | `factories.js` | None |
| 11 | `enemy-identity.js` | **`getEnemyIdentity()`, `getEnemyRole()`** |
| 12 | `enemy-movement.js` | Dive patterns, shmup routes |
| 13 | `enemy-attacks.js` | Set piece fire patterns |
| 14 | `enemy-tactical-ai.js` | Per-role AI profiles |
| 15 | `enemy-pattern-hooks.js` | **All 6 archetype pattern functions** |
| 16 | `update-enemies.js` | **Main enemy update, pattern dispatching** |
| 17 | `encounter-director.js` | **Pressure, relief, silence, personality, role caps** |
| 18 | `encounter-director-debug.js` | Debug overlay |
| 19 | `boss-patterns.js` | Boss patterns |
| 20 | `boss-ai-movement.js` | Boss movement |
| 21 | `update-boss.js` | Boss update |
| 22 | `update-victory.js` | Victory sequence |
| 23 | `hc-pattern-director.js` | Pattern classification + advisory gating |
| 24 | `hc-pattern-debug.js` | Pattern debug |
| 25 | `hardcore-rank.js` | Dynamic rank |
| 26 | `hardcore-pressure.js` | Pressure director |
| 27 | `hardcore-rhythm.js` | Rhythm pacing |
| 28 | `hardcore-combo.js` | Combo scoring |

### 11.2 Recommended Insertion Point

New file `hc-wc-wave-identity.js` should load **after** `enemy-identity.js` (#11) and **before** `update-enemies.js` (#16).

It would:
1. Define `WAVE_COMPOSITION` table (curated per-level compositions)
2. Define `WAVE_TACTICAL_LABEL` table
3. Expose `getWaveComposition(level)`, `getWaveTacticalLabel(level)`
4. Hook into `initEnemies()` via existing extension points

### 11.3 Compatibility Confirmation

| System | Compatible? | Notes |
|--------|-------------|-------|
| Encounter Director | YES | HC-WC reads state, doesn't modify internals |
| Pattern Director (HC-PD) | YES | HC-PD is advisory; HC-WC composition doesn't conflict |
| Hitbox Fairness (HC-HB) | YES | Composition changes don't affect hitboxes |
| Threat Readability (HC-RD) | YES | New compositions use same rendering pipeline |
| Boss System | YES | Boss levels unchanged in Phase 1-2 |
| Hardcore Rank | YES | Rank still affects cooldowns/speed; HC-WC is orthogonal |
| Hardcore Pressure | YES | Pressure still computed from alive enemies; HC-WC composition is input |
| Hardcore Rhythm | YES | Rhythm affects timing; HC-WC can use rhythm hooks |

---

## 12. SUMMARY

### 12.1 Severity Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Identity | — | 3 | 2 | — |
| Pacing | 1 | 1 | 3 | — |
| Overlap/Unfairness | 1 | 2 | 3 | 1 |
| Readability | — | 2 | 4 | 1 |
| Progression | 1 | — | — | 1 |
| Pattern Saturation | — | 1 | 2 | — |
| Escape Lanes | — | 1 | 2 | — |
| Archetype Dominance | — | — | 1 | 1 |
| **TOTAL** | **3** | **12** | **17** | **4** |

### 12.2 Root Causes

1. **No wave design layer exists**. Waves are generated procedurally from a few formulas (`getEnemyTypeForRow`, `getFormation`). There's no design document, no composition table, no identity map.

2. **All enemies are active immediately**. The concept of "phases" exists only for set pieces (intro timer). Normal waves have flat structure.

3. **Personality system is isolated**. Wave personalities affect timing multipliers but not composition, visual layout, or tactical intent.

4. **No deliberate relief exists**. Relief happens when the math allows it. There's no designed quiet moment between wave phases.

### 12.3 Path to HC-WC

```
AUDIT (DONE) → CLASSIFY → MICRO-STRUCTURE → COMPOSITION → VISUAL
    ✅             1           2                 3             4
```

**Next sprint**: HC-WC-02 — Wave classification + identity map. Tag all 20 levels, create `WAVE_COMPOSITION` table, hook into `initEnemies()`.

---

*End of HC-WC-01 Wave Audit*
