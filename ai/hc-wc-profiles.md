# HC-WC-04 — Composition Profiles & Curated Wave Runtime

> **Sprint**: HC-WC-04  
> **Date**: 2026-05-19  
> **Status**: Implemented  
> **Depends on**: HC-WC-01 (audit), HC-WC-02 (taxonomy), HC-WC-03 (runtime)

---

## 1. ARCHITECTURE

| File | Role |
|------|------|
| `www/hc-wc-profiles.js` | 24 wave profiles, composition builder, level→profile mapping |
| `www/hc-wave-composer.js` | Extended with profile override setters + resolver |
| `www/entities.js` | `initEnemies()` uses `initEnemiesFromProfile()` first |
| `www/game-config.js` | `useProfiles: true` toggle |
| `www/index.html` | Script tag after `hc-wave-composer.js` |

### 1.1 Flow

```
startLevel() → initEnemies()
  ├── setPiece? → existing setpiece logic
  └── else → initEnemiesFromProfile()
        ├── getWaveProfileForLevel(level) → PROFILE
        ├── buildProfileComposition(level) → enemy[]
        ├── applyWaveProfileToComposer(level) → overrides
        └── sets global.enemies + banner
```

---

## 2. PROFILE CATALOG — 24 Profiles

### 2.1 Foundation Tier (5 profiles)

| Profile Key | Label | Level | Comp | Budget |
|------------|-------|-------|------|--------|
| `FND_tutorial` | FIRST CONTACT | 1 | 8 sweeper + 2 baiter | 3 |
| `FND_formation_reading` | VANGUARD LINE | 2 | 6 sweeper + 2 sniper + 2 baiter | 4 |
| `FND_recovery_breather` | REGROUP | 6,11,13 | 5 sweeper + 2 baiter | 2 |
| `FND_staggered_entry` | STAGGERED ENTRY | (unused) | 6 sweeper + 2 sniper + 1 baiter | 4 |
| `FND_dual_role` | DUAL THREAT | (unused) | 7 sweeper + 3 sniper | 5 |

### 2.2 Tactical Tier (8 profiles)

| Profile Key | Label | Level | Comp | Budget |
|------------|-------|-------|------|--------|
| `TAC_lane_denial` | DIVISION BREACH | 9 | 3 supp + 5 sweep + 2 snip + 2 bait | 5 |
| `TAC_rotating_pressure` | ROTATING PRESSURE | (unused) | 5 sweep + 3 snip + 2 flank | 5 |
| `TAC_pincer` | PINCER ASSAULT | 3 | 6 flank + 2 diver + 4 sweep + 2 snip | 7 |
| `TAC_crossfire_trap` | CROSSFIRE TRAP | (unused) | 4 snip + 3 flank + 4 sweep | 6 |
| `TAC_hunter_dive` | HUNTER DIVE | (unused) | 3 diver + 6 sweep + 2 bait | 6 |
| `TAC_bait_punish` | HUNTING PACK | 8 | 5 bait + 2 chase + 4 sweep | 6 |
| `TAC_sniper_denial` | SNIPER LINE | (unused) | 4 snip + 2 blocker | 5 |
| `TAC_swarm_anchor` | SWARM FORMATION | (unused) | 8 swarm + 2 anchor + 3 sweep | 6 |
| `TAC_flanking_pursuit` | FLANKING PURSUIT | (unused) | 2 chase + 4 bait + 3 sweep + 2 flank | 6 |

### 2.3 Advanced Tier (8 profiles)

| Profile Key | Label | Comp | Budget |
|------------|-------|------|--------|
| `ADV_false_recovery` | FALSE RECOVERY | 3 bait + 2 diver + 1 chase + 3 sweep | 7 |
| `ADV_layered_pressure` | LAYERED PRESSURE | 3 supp + 3 snip + 4 sweep + 2 diver | 8 |
| `ADV_collapsing_lane` | LAST LINE | 4 supp + 5 sweep + 2 flank | 7 |
| `ADV_rotating_crossfire` | ROTATING CROSSFIRE | 4 flank + 2 snip + 3 sweep | 7 |
| `ADV_survival_corridor` | SURVIVAL CORRIDOR | 4 supp + 4 sweep + 2 snip | 8 |
| `ADV_counter_pressure` | ESCALATION | 5 sweep + 2 chase + 3 bait + 2 snip | 7 |
| `ADV_role_reversal` | ROLE REVERSAL | 2 supp + 2 snip + 4 sweep + 2 diver | 7 |
| `ADV_gauntlet` | GAUNTLET | 4 sweep + 3 supp + 2 snip + 2 diver + 2 flank + 2 bait | 9 |

### 2.4 Setpiece Tier (5 profiles)

| Profile Key | Label | Level | Comp | Budget |
|------------|-------|-------|------|--------|
| `SET_boss_prelude` | APPROACHING | 4,14 | 6 sweep + 3 bait + 1 anchor | 3 |
| `SET_fortress_breach` | FORTRESS LINE | 7 | 3 block + 4 snip + 4 sweep + 2 supp | 7 |
| `SET_kamikaze_rush` | KAMIKAZE RUSH | 12 | 4 chase + 4 bait + 3 sweep + 2 snip | 8 |
| `SET_splitter_storm` | SPLITTER STORM | 16 | 6 flank + 3 sweep + 3 bait + 2 snip | 7 |
| `SET_imperial_guard` | IMPERIAL GUARD | 18 | 5 snip + 2 anchor + 3 sweep + 3 flank | 9 |

---

## 3. PROFILE FIELDS

Each profile defines:

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Display name (banner text) |
| `tier` | string | foundation/tactical/advanced/setpiece |
| `tacticalPurpose` | string | What skill this wave tests |
| `dominantRole` | string | Primary archetype |
| `secondaryRole` | string | Supporting archetype |
| `forbiddenRoles` | string[] | Archetypes that MUST NOT appear |
| `allowedSupport` | string[] | Archetypes allowed in small numbers |
| `composition` | object | `{ role: count }` — exact enemy counts |
| `phaseDurations` | object | `{ INTRO, BUILD }` in ms |
| `buildTiming` | object | `{ sweeperDelay, baiterDelay, ... }` in ms |
| `peakLimits` | object | `{ maxSimultaneousPatterns, maxBullets, interPatternGapMs }` |
| `resolveTiming` | object | `{ diverSuspend, sniperSuspend, ... }` |
| `reliefPolicy` | string | When relief triggers |
| `entryStyle` | string | slide_in / fade_in / burst_in |
| `formationKey` | string | Layout template |
| `escapeLanes` | number | Minimum open lanes |
| `threatBudget` | number | HC-PD budget (1-10) |

---

## 4. LEVEL → PROFILE MAPPING

| Level | Profile | Type |
|-------|---------|------|
| 1 | `FND_tutorial` | Foundation |
| 2 | `FND_formation_reading` | Foundation |
| 3 | `TAC_pincer` | Tactical (setpiece) |
| 4 | `SET_boss_prelude` | Setpiece (prelude) |
| 5 | — | BOSS (CrabTron) |
| 6 | `FND_recovery_breather` | Foundation (relief) |
| 7 | `SET_fortress_breach` | Setpiece |
| 8 | `TAC_bait_punish` | Tactical |
| 9 | `TAC_lane_denial` | Tactical |
| 10 | — | BOSS (Serpentrix) |
| 11 | `FND_recovery_breather` | Foundation (relief) |
| 12 | `SET_kamikaze_rush` | Setpiece |
| 13 | `FND_recovery_breather` | Foundation (relief) |
| 14 | `SET_boss_prelude` | Setpiece (prelude) |
| 15 | — | BOSS (Orbital) |
| 16 | `SET_splitter_storm` | Setpiece |
| 17 | `ADV_collapsing_lane` | Advanced |
| 18 | `SET_imperial_guard` | Setpiece |
| 19 | — | BOSS (Teniente) |
| 20 | — | BOSS (Emperador) |

---

## 5. ROLE → ENEMY TYPE MAP

| HC-WC Role | Enemy Type | Notes |
|-----------|-----------|-------|
| `sweeper` | alien1 | Standard |
| `sniper` | alien2 | Standard |
| `diver` | alien3 | Standard |
| `suppressor` | alien4 | Standard |
| `chaser` | alien5 | Standard |
| `flanker` | alien6 | Standard |
| `baiter` | alien_mini | Standard |
| `anchor` | alien3 | **Synthetic** — anchor mode (no diving, slow, high HP) |
| `blocker` | alien3 | **Synthetic** — blocker mode (stationary, 1.5x HP) |
| `swarm` | alien1 | **Synthetic** — swarm mode (low HP, fast, minimal attacks) |

---

## 6. COMPATIBILITY

| System | Status |
|--------|--------|
| Wave Composer (HC-WC-03) | Profile overrides feed via `setWaveComposerBuildTiming` etc. |
| Encounter Director | Profiles use `registerEnemySpawn` for each enemy. Director tracks normally. |
| HC-PD | Threat budgets defined per profile. Compositions stay within budget. |
| HC-HB | Bullet validation unchanged. |
| Set pieces | Profiles for levels 3,7,12,16,18 use existing setpiece system, override composition. |
| Boss levels | Skipped. `initEnemiesFromProfile()` only runs for non-boss levels. |

---

*End of HC-WC-04 Documentation*
