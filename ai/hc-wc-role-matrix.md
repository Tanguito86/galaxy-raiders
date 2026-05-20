# HC-WC-02B — Role Matrix & Compatibility

> **Sprint**: HC-WC-02
> **Document**: B — Role Formalization & Compatibility Matrix
> **Date**: 2026-05-19
> **Status**: Draft
> **Depends on**: HC-WC-01, HC-WC-02A

---

## 1. ROLE MAPPING — Current Types to HC-WC Roles

### 1.1 Core Mapping

| Current Type | Current Role | HC-WC Role | HC-WC Label | File |
|-------------|-------------|------------|-------------|------|
| alien1 | sweeper | **sweeper** | Wide Sweeper | `enemy-identity.js:7` |
| alien2 | sniper | **sniper** | Precision Sniper | `enemy-identity.js:12` |
| alien3 | diver | **diver** | Aggressive Diver | `enemy-identity.js:17` |
| alien4 | suppressor | **suppressor** | Lateral Suppressor | `enemy-identity.js:22` |
| alien5 | chaser | **chaser** | Hunter Chaser | `enemy-identity.js:27` |
| alien6 | flanker | **flanker** | Flank Crossfire | `enemy-identity.js:32` |
| alien_mini | baiter | **baiter** | Erratic Baiter | `enemy-identity.js:37` |
| ufo | bonus | **support** | UFO Support | `enemy-identity.js:42` |

### 1.2 New HC-WC Synthetic Roles

These roles are not new enemies — they are **behavioral overlays** applied to existing types:

| HC-WC Role | Tactical Meaning | Applied To |
|------------|-----------------|------------|
| **anchor** | Heavy, slow, controls center. High HP, deliberate volleys. | alien3 (tank mode), alien4 (fortress) |
| **swarm** | Light, fast, numerous. Low individual threat. | alien1 (light), alien_mini (swarm mode) |
| **blocker** | Stationary or slow, blocks lane physically. | alien3 (immobile), alien4 (wall) |
| **support** | Non-combat, drops rewards, aids or distracts. | ufo, alien_mini (decoy mode) |

**Note**: Anchor/blocker/swarm/support are NOT new enemy types. They are the same sprites with modified behavior (speed, HP, fire pattern, AI profile). This preserves all existing rendering, collision, and entity management.

---

## 2. ROLE DEFINITIONS — 10 Official Roles

For each role: tactical function, pressure generated, mobility, readability impact, synergies, threat cost, ideal usage, forbidden pairings.

---

### 2.1 SWEEPER

| Field | Value |
|-------|-------|
| **Tactical Function** | Covers wide horizontal area with fan fire. Creates background pressure. Teaches lateral dodging. |
| **Pressure Generated** | 0.25-0.40 |
| **Mobility Required** | Low — slow lateral oscillation from tactical AI |
| **Readability Impact** | LOW — fan bullets are wide and slow. 5-bullet spread easy to read. |
| **Synergy Positive** | sniper (sweeper covers, sniper aims), suppressor (sweeper fills denied lane), swarm (both are volume) |
| **Synergy Dangerous** | diver (diver needs clear vertical; sweeper fans fill horizontal), chaser (both are aggressive but sweeper is fixed, chaser is mobile — timing mismatch) |
| **Threat Cost** | 1 (lowest) |
| **Ideal Usage** | Present in 80% of waves. Default background pressure. First archetype player learns. |
| **Forbidden Pairings** | sweeper + chaser at high density (>12 enemies) |
| **HC-PD Classification** | SUPPORT |
| **Enemy Type Binding** | alien1 |
| **Attack Pattern** | `fireHardcoreSweeperFan()` — 5-bullet fan, 0.70 rad spread |
| **Telegraph** | None (background pressure, no telegraph needed) |
| **Tactical AI Profile** | Wide lateral sweep coverage (`enemy-tactical-ai.js:8`) |

---

### 2.2 SNIPER

| Field | Value |
|-------|-------|
| **Tactical Function** | Precision aimed shots at player. Punishes standing still. Teaches micro-tap dodging. |
| **Pressure Generated** | 0.35-0.55 |
| **Mobility Required** | Low — holds distance, maintains firing line |
| **Readability Impact** | MEDIUM — single bullet, fast, aimed. MUST telegraph. |
| **Synergy Positive** | sweeper (background fill), flanker (cross-angle threat), blocker (sniper protected behind blocker) |
| **Synergy Dangerous** | diver + sniper (opposite movement demands: vertical vs horizontal), chaser + sniper (both aim at player — overwhelming) |
| **Threat Cost** | 3 |
| **Ideal Usage** | 30-50% of waves. 1-4 snipers per wave. Never the only archetype. |
| **Forbidden Pairings** | sniper + sniper >3 active (precision overload). sniper + chaser at pressure >0.55. |
| **HC-PD Classification** | PRECISION — PRIMARY when >2 active |
| **Enemy Type Binding** | alien2 |
| **Attack Pattern** | `fireHardcoreSniperShot()` — 1 aimed bullet, speed 3.2 |
| **Telegraph** | 280ms sniper line + flash (HC-46) |
| **Tactical AI Profile** | Maintain useful horizontal distance + firing line (`enemy-tactical-ai.js:16`) |

---

### 2.3 DIVER

| Field | Value |
|-------|-------|
| **Tactical Function** | Vertical aggression. Launch toward player from formation. Returns to position. Teaches vertical dodging. |
| **Pressure Generated** | 0.40-0.65 (spike during dive) |
| **Mobility Required** | HIGH — dive → off-screen → recover → return |
| **Readability Impact** | HIGH — Must telegraph before diving. Fast movement. |
| **Synergy Positive** | sweeper (background during recovery), baiter (baiter distracts, diver strikes) |
| **Synergy Dangerous** | chaser + diver (both pursue player — lethal), suppressor + diver (suppressor blocks escape from dive), sniper + diver (sniper aims while player dodges dive — frame trap) |
| **Threat Cost** | 4 |
| **Ideal Usage** | 20-30% of waves. 1-3 divers max. Must be staggered — never all at once. |
| **Forbidden Pairings** | diver + chaser at pressure >0.40. diver + suppressor if suppressor cone blocks escape. diver + sniper during dive window. |
| **HC-PD Classification** | AGGRESSIVE — PRIMARY when diving |
| **Enemy Type Binding** | alien3 |
| **Attack Pattern** | Dive state machine (no bullet attack during dive — threat is collision) |
| **Telegraph** | 380ms flash + SFX before dive launch (HC-49) |
| **Tactical AI Profile** | Choose better dive window (`enemy-tactical-ai.js:25`) |

---

### 2.4 SUPPRESSOR

| Field | Value |
|-------|-------|
| **Tactical Function** | Controls a lane with lateral fan fire. Denies horizontal movement. Creates "walls" of bullets. |
| **Pressure Generated** | 0.35-0.50 |
| **Mobility Required** | Low — occupies control lane, drifts slowly |
| **Readability Impact** | MEDIUM — 3-bullet lateral fan. Side bullets have slight stagger. |
| **Synergy Positive** | sweeper (both horizontal), anchor (suppressor protects anchor), blocker (suppressor fills gaps) |
| **Synergy Dangerous** | sniper + suppressor (crossfire + wall = sealed escape), diver + suppressor (wall blocks dive recovery lane), chaser + suppressor (pursuit into wall) |
| **Threat Cost** | 2 |
| **Ideal Usage** | 25-40% of waves. 1-3 suppressors. Best on one screen half. |
| **Forbidden Pairings** | suppressor + chaser at pressure >0.50. 3+ suppressors active (wall becomes opaque). |
| **HC-PD Classification** | SPACE CONTROL |
| **Enemy Type Binding** | alien4 |
| **Attack Pattern** | `fireHardcoreSuppressorBurst()` — 3-bullet lateral fan (center + left + right), micro-staggered |
| **Telegraph** | 180ms pre-burst flash (HC-48) |
| **Tactical AI Profile** | Occupy control lane (`enemy-tactical-ai.js:33`) |

---

### 2.5 CHASER

| Field | Value |
|-------|-------|
| **Tactical Function** | Hunts the player aggressively. Aimed burst + side shots. Highest individual threat. |
| **Pressure Generated** | 0.45-0.65 |
| **Mobility Required** | HIGH — pursues player laterally |
| **Readability Impact** | HIGH — aimed burst + delayed side shots. MUST telegraph. |
| **Synergy Positive** | baiter (bait draws player, chaser strikes), sweeper (background fill) |
| **Synergy Dangerous** | diver + chaser (CRITICAL — both pursue = unavoidable), sniper + chaser (dual aimed threats), suppressor + chaser (chaser pursues into suppressor wall) |
| **Threat Cost** | 4 |
| **Ideal Usage** | 10-20% of waves. 1-2 chasers max. Always paired with baiters for tactical rhythm. |
| **Forbidden Pairings** | chaser + diver (TOXIC — HC-WC-01 P-OV-02). chaser + sniper >1 active. chaser + chaser >2 active. |
| **HC-PD Classification** | AGGRESSIVE — PRIMARY |
| **Enemy Type Binding** | alien5 |
| **Attack Pattern** | `fireHardcoreChaserBurst()` — 1 aimed burst + 2 side shots after 180ms telegraph |
| **Telegraph** | 180ms flash + side-shot delay (HC-47) |
| **Tactical AI Profile** | Aggressive player pursuit (`enemy-tactical-ai.js:41`) |

---

### 2.6 FLANKER

| Field | Value |
|-------|-------|
| **Tactical Function** | Attacks from screen edges with oblique crossfire. Creates diagonal threat. |
| **Pressure Generated** | 0.30-0.45 |
| **Mobility Required** | Low-Medium — stays on assigned flank, drifts |
| **Readability Impact** | MEDIUM — 2-bullet oblique spread. Direction depends on screen half. |
| **Synergy Positive** | sniper (crossfire + precision = layered), sweeper (fill), suppressor (both control space) |
| **Synergy Dangerous** | flanker + flanker on same side (redundant), flanker + chaser (chaser disrupts flank positioning) |
| **Threat Cost** | 2 |
| **Ideal Usage** | 20-30% of waves. 2-4 flankers, split across both sides. |
| **Forbidden Pairings** | flanker + diver near edge (diver crosses flanker fire). 4+ flankers active (crossfire saturation). |
| **HC-PD Classification** | SPACE CONTROL |
| **Enemy Type Binding** | alien6 |
| **Attack Pattern** | `fireHardcoreFlankerCrossfire()` — 2-bullet oblique spread, angled based on screen half |
| **Telegraph** | None (low individual threat, threat is collective) |
| **Tactical AI Profile** | Attack from screen edges (`enemy-tactical-ai.js:49`) |

---

### 2.7 BAITER

| Field | Value |
|-------|-------|
| **Tactical Function** | Erratic movement, draws player attention/fire. Sets up chaser/diver strikes. |
| **Pressure Generated** | 0.15-0.25 |
| **Mobility Required** | HIGH — erratic, fast, unpredictable |
| **Readability Impact** | LOW — 3-bullet erratic spread, slow bullets |
| **Synergy Positive** | chaser (bait + punish), diver (distract + dive), sweeper (fill) |
| **Synergy Dangerous** | sniper + baiter (baiter draws attention from sniper aim line) |
| **Threat Cost** | 1 |
| **Ideal Usage** | 15-25% of waves. 2-5 baiters. Always paired with a striker (chaser/diver). |
| **Forbidden Pairings** | baiter + suppressor (baiter movement crosses suppressor wall). baiter >6 active (visual noise). |
| **HC-PD Classification** | SUPPORT |
| **Enemy Type Binding** | alien_mini |
| **Attack Pattern** | `fireHardcoreBaiterBurst()` — 3-bullet erratic spread, slow (speed 2.1) |
| **Telegraph** | None (background noise) |
| **Tactical AI Profile** | Bait & dart (`enemy-tactical-ai.js:57`) |

---

### 2.8 ANCHOR (Synthetic)

| Field | Value |
|-------|-------|
| **Tactical Function** | Heavy center presence. High HP, deliberate volleys. Controls the arena center. |
| **Pressure Generated** | 0.40-0.55 |
| **Mobility Required** | Low — slow drift, stays central |
| **Readability Impact** | HIGH — Large volley patterns. MUST telegraph. |
| **Synergy Positive** | sweeper (fill around anchor), swarm (screen around anchor), blocker (anchor + blocker = fortress) |
| **Synergy Dangerous** | sniper + anchor (too much center pressure), diver + anchor (diver collision risk near anchor) |
| **Threat Cost** | 4 |
| **Ideal Usage** | 10-15% of waves. 1-2 anchors max. Setpiece and boss-adjacent waves. |
| **Forbidden Pairings** | anchor + anchor >2. anchor + sniper at pressure >0.55. |
| **HC-PD Classification** | SPACE CONTROL — PRIMARY |
| **Enemy Type Binding** | alien3 (anchor mode: no diving, higher HP, slower, wider volley) |
| **Attack Pattern** | Modified `fireHardcoreSweeperFan()` — wider, slower, 7-bullet radial |
| **Telegraph** | 400ms expanding ring before volley |
| **Tactical AI Profile** | Hold center, slow sinusoidal drift |

---

### 2.9 SWARM (Synthetic)

| Field | Value |
|-------|-------|
| **Tactical Function** | High count, low individual threat. Creates visual density without real danger. Rewards AoE weapons. |
| **Pressure Generated** | 0.20-0.35 |
| **Mobility Required** | Variable — fast movement, chaotic trajectories |
| **Readability Impact** | LOW — bullets are small, slow, sparse. Threat is numbers, not precision. |
| **Synergy Positive** | anchor (swarm screens anchor), sweeper (both volume), support (UFO behind swarm) |
| **Synergy Dangerous** | sniper + swarm (sniper hidden in swarm), suppressor + swarm (too much visual noise) |
| **Threat Cost** | 1 per 3 enemies |
| **Ideal Usage** | 15-20% of waves. 6-12 swarm enemies. Always with 1+ anchor or heavy. |
| **Forbidden Pairings** | swarm + sniper (hidden threat). swarm >15 (performance + readability). |
| **HC-PD Classification** | SUPPORT |
| **Enemy Type Binding** | alien1 (light mode: lower HP, faster, minimal attacks), alien_mini (swarm mode) |
| **Attack Pattern** | None or single slow bullet |
| **Telegraph** | None |
| **Tactical AI Profile** | Erratic swarm movement, stay near anchor |

---

### 2.10 BLOCKER (Synthetic)

| Field | Value |
|-------|-------|
| **Tactical Function** | Stationary or slow-moving, blocks a lane physically. Cannot be passed through. Creates positional puzzle. |
| **Pressure Generated** | 0.15-0.25 |
| **Mobility Required** | VERY LOW — stationary or slow drift |
| **Readability Impact** | HIGH — Large body. Must be visually distinct. |
| **Synergy Positive** | sniper (blocker protects sniper), suppressor (blocker fills wall gap), anchor (fortress) |
| **Synergy Dangerous** | diver + blocker (blocker blocks dive recovery), chaser + blocker (chaser pushes player into blocker) |
| **Threat Cost** | 2 |
| **Ideal Usage** | 5-10% of waves. 1-3 blockers. Setpiece and puzzle waves. |
| **Forbidden Pairings** | blocker + diver (blocks escape). blocker >4 (arena too constrained). |
| **HC-PD Classification** | SPACE CONTROL |
| **Enemy Type Binding** | alien3 (blocker mode: no diving, very slow, high HP, no attacks or very rare) |
| **Attack Pattern** | None or rare single slow bullet |
| **Telegraph** | Permanent visual outline (distinct from normal enemies) |
| **Tactical AI Profile** | Hold position, slow drift within lane |

---

## 3. ROLE COMPATIBILITY MATRIX

### 3.1 Pairwise Compatibility

|  | SWP | SNP | DIV | SUP | CHS | FLK | BAI | ANC | SWM | BLK |
|--|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **SWP** (sweeper) | — | ✅ | ⚠️ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SNP** (sniper) | ✅ | — | 🔴 | ✅ | 🔴 | ✅ | ⚠️ | ⚠️ | ❌ | ✅ |
| **DIV** (diver) | ⚠️ | 🔴 | — | 🔴 | 💀 | ⚠️ | ✅ | 🔴 | — | 🔴 |
| **SUP** (suppressor) | ✅ | ✅ | 🔴 | — | 🔴 | ✅ | ❌ | ⚠️ | ⚠️ | ✅ |
| **CHS** (chaser) | ❌ | 🔴 | 💀 | 🔴 | — | ⚠️ | ✅ | — | — | 🔴 |
| **FLK** (flanker) | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | — | ⚠️ | ⚠️ | — | ⚠️ |
| **BAI** (baiter) | ✅ | ⚠️ | ✅ | ❌ | ✅ | ⚠️ | — | — | ⚠️ | ⚠️ |
| **ANC** (anchor) | ✅ | ⚠️ | 🔴 | ⚠️ | — | ⚠️ | — | — | ✅ | ✅ |
| **SWM** (swarm) | ✅ | ❌ | — | ⚠️ | — | — | ⚠️ | ✅ | — | — |
| **BLK** (blocker) | ✅ | ✅ | 🔴 | ✅ | 🔴 | ⚠️ | ⚠️ | ✅ | — | — |

**Legend**:
- ✅ = **SAFE** — Core compatible, no restrictions
- ⚠️ = **RISKY** — Can work with caps and gates
- 🔴 = **DANGEROUS** — Requires strict coordination, narrow conditions
- 💀 = **FORBIDDEN** — Never allowed in same wave
- — = No relevant interaction (not applicable or neutral)

### 3.2 Dangerous Pair Details

| Pair | Risk | Mitigation if Ever Used |
|------|------|------------------------|
| SNP + DIV | Sniper aims while player dodges dive = frame trap | Must fire in strictly alternating windows. 800ms spacing. |
| SUP + DIV | Suppressor wall blocks dive recovery lane | Suppressor must be on opposite screen half from dive direction. |
| SNP + CHS | Dual aimed threats from different angles | Sequential only. Max 1 of each active. 1000ms spacing. |
| SUP + CHS | Chaser pursuits into suppressor wall | Suppressor must deactivate during chase windows. |
| DIV + BLK | Blocker seals dive escape route | Blocker must not be between diver origin and screen edge. |
| ANC + SNP | Too much center precision | Anchor and sniper must target different screen zones. |

### 3.3 Forbidden Pair Details

| Pair | Reason | Consequence if Violated |
|------|--------|------------------------|
| **DIV + CHS** | Both pursue player. Combined = no escape. HC-WC-01 P-OV-02. | Player death unavoidable at high pressure. |
| **SNP + SWM** | Sniper hidden in swarm = invisible threat. | Unfair death (can't see what killed you). |
| **SUP + BAI** | Baiter erratic movement crosses suppressor wall unpredictably. | Bullet spawning inside player space. |
| **SWP + CHS** | Sweeper fans fill horizontal while chaser hunts vertical. >12 enemies this is opaque. | Unreadable bullet density. |

---

## 4. MAXIMUM ACTIVE COUNTS PER ROLE

These caps are for HC-WC runtime enforcement:

| Role | Max Active (Normal) | Max Active (Setpiece) | Notes |
|------|--------------------|-----------------------|-------|
| sweeper | 6 | 8 | Many sweepers = visual noise, not danger |
| sniper | 3 | 4 | More than 3 = precision overload |
| diver | 2 | 3 | More than 2 diving simultaneously = unfair |
| suppressor | 3 | 4 | More than 3 = lane completely sealed |
| chaser | 1 | 2 | 1 default. 2 in setpiece only, sequential. |
| flanker | 4 | 6 | Split across both sides |
| baiter | 5 | 8 | Visual noise risk above 5 |
| anchor | 1 | 2 | Setpiece only for 2 |
| swarm | 10 | 15 | Performance + readability cap |
| blocker | 2 | 4 | Setpiece or puzzle waves |

---

## 5. THREAT BUDGET COST TABLE

For HC-PD integration. Total budget per wave: 10.

| Role | Base Cost | Notes |
|------|-----------|-------|
| sweeper | 1 | Cheap — fill role |
| sniper | 3 | Precision — each sniper costs |
| diver | 4 | High — high mobility + collision threat |
| suppressor | 2 | Moderate — lane control |
| chaser | 4 | High — pursuit threat |
| flanker | 2 | Moderate — diagonal pressure |
| baiter | 1 | Cheap — distraction role |
| anchor | 4 | Heavy — center controller |
| swarm | 1 per 3 | Cheap in bulk |
| blocker | 2 | Moderate — positional puzzle |

**Budget formula**: `sum(role_count × role_cost)` ≤ 10 for normal waves, ≤ 14 for setpieces.

---

## 6. PRESSURE CONTRIBUTION PER ROLE

How much each role contributes to encounter director pressure:

| Role | Pressure Contribution | Mechanism |
|------|----------------------|-----------|
| sweeper | +0.02 per active | Background — low |
| sniper | +0.05 per active | Precision threat |
| diver | +0.08 while diving, +0.02 idle | Spike on dive |
| suppressor | +0.04 per active | Lane control |
| chaser | +0.07 per active | Pursuit threat |
| flanker | +0.03 per active | Diagonal pressure |
| baiter | +0.01 per active | Negligible |
| anchor | +0.06 per active | Center control |
| swarm | +0.01 per 3 active | Negligible individually |
| blocker | +0.02 per active | Static threat |

---

*End of HC-WC-02B — Role Matrix & Compatibility*
