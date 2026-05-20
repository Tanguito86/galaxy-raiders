# HC-WC-02C — Hardcore Composition Rules

> **Sprint**: HC-WC-02
> **Document**: C — Composition Rules & Micro-Structure
> **Date**: 2026-05-19
> **Status**: Draft
> **Depends on**: HC-WC-01, HC-WC-02A, HC-WC-02B

---

## 1. MICRO-STRUCTURE STANDARD

### 1.1 Universal Wave Phases

Every HC-WC wave (except bosses) follows this structure:

```
[INTRO] → [BUILD] → [PEAK] → [RESOLVE] → [RELIEF]
```

| Phase | Duration (Normal) | Duration (Setpiece) | What Happens |
|-------|-------------------|---------------------|--------------|
| **INTRO** | 800-1500ms | 1500-2200ms | Enemies visible. NO attacks. Formation settles. Player reads layout. |
| **BUILD** | 3000-6000ms | 4000-7000ms | Sweepers + basic shooters activate. Support archetypes enter. Pressure ramps. |
| **PEAK** | until 40% enemies remain | until 30% remain | All archetypes active. Maximum patterns. Coordinated volleys. |
| **RESOLVE** | last 40% enemies | last 30% enemies | Dives stop. Snipers deactivate. Only sweepers + basic remain. |
| **RELIEF** | 900-2000ms silence after clear | 600-1200ms silence | Guaranteed quiet window. Power-up opportunity. |

### 1.2 Phase Transition Rules

1. **INTRO → BUILD**: All enemies must be at target positions. No enemy still in entry animation.
2. **BUILD → PEAK**: At least 60% of enemies active. Archetype activation order complete.
3. **PEAK → RESOLVE**: Triggered by enemy count threshold, NOT timer. Prevents infinite peak.
4. **RESOLVE → RELIEF**: All enemies dead. Silence timer starts.

### 1.3 Archetype Activation Order (BUILD phase)

Archetypes activate in this sequence during BUILD:

```
t=0:       sweeper, baiter (background pressure)
t=1500ms:  suppressor, flanker (lane control)
t=3000ms:  sniper (precision layer)
t=4500ms:  diver, chaser (aggression layer) — IF present in composition
t=6000ms:  PEAK begins — all active archetypes fire at full cadence
```

**Rule**: Each activation step must complete before next begins. If an archetype isn't in the composition, skip that step (timing remains the same — gaps create natural breathing room).

### 1.4 Phase Duration Scaling by Difficulty

| Rank Level | INTRO Scale | BUILD Scale | PEAK Kill % | RESOLVE Kill % |
|------------|-------------|-------------|-------------|----------------|
| 1 (LOW) | 1.25x | 1.20x | 40% | 30% |
| 2-3 (NORMAL) | 1.00x | 1.00x | 40% | 40% |
| 4 (HIGH) | 0.85x | 0.90x | 35% | 45% |
| 5 (MAX) | 0.75x | 0.80x | 30% | 50% |

---

## 2. ESCAPE LANE RULES

### 2.1 Minimum Lane Requirements

At ALL times during active combat:

| Rule | Requirement | Verification |
|------|-------------|-------------|
| **EL-01** | At least 1 open vertical corridor ≥ 64px wide | Check formation layout before spawn |
| **EL-02** | Corridor must span from player Y to top of screen | No enemy bodies or bullets in corridor |
| **EL-03** | During diver dives, corridor must be ≥ 96px wide | Dive angle leaves horizontal gap |
| **EL-04** | During crossfire, corridor must be center-screen | Crossfire from edges, center open |
| **EL-05** | Corridor narrows during constriction waves (minimum 64px) | Collapsing lane type only |
| **EL-06** | No more than 3s with corridor < 96px | Constriction is brief, not sustained |

### 2.2 Lane Preservation by Formation

| Formation Shape | Default Safe Lanes | Construction Rule |
|----------------|-------------------|-------------------|
| Classic Grid | Lanes between columns 3-4 and 5-6 | Gap columns every 3rd column |
| V-Shape | Wide bottom center lane | Edges converge, center opens |
| Diamond | Corner lanes (top-left, bottom-right) | Pyramid creates diagonal gaps |
| Zigzag | Alternating lanes between offset rows | Offset creates natural corridors |
| Pincer | Center vertical corridor | Wings on edges, center clear |
| Wall (Fortress) | Gaps between columns | Intentional column spacing ≥ 80px |
| Spiral | Rotating safe corridor | Single lane that rotates with formation |

---

## 3. PATTERN OVERLAP RESTRICTIONS

### 3.1 Inter-Archetype Minimum Spacing

When multiple archetypes fire, these minimum gaps apply between different archetype patterns:

| Pattern A | Pattern B | Minimum Gap | Reason |
|-----------|-----------|-------------|--------|
| sniper shot | any other | 400ms | Precision needs isolation |
| diver launch | any other | 500ms | Dive is high-attention event |
| chaser burst | any other | 400ms | Pursuit needs isolated window |
| suppressor burst | suppressor burst | 300ms | Same archetype can overlap |
| sweeper fan | sweeper fan | 100ms | Low threat, can overlap |
| sweeper fan | sniper shot | 300ms | Sniper must not be lost in fan |
| flanker crossfire | sniper shot | 300ms | Multi-angle precision needs gap |
| baiter spread | any other | 150ms | Low threat, minimal restriction |
| anchor volley | any other | 500ms | Anchor volley is a major event |

### 3.2 Same-Frame Fire Cap

| Condition | Max Patterns This Frame |
|-----------|------------------------|
| Normal wave (any phase) | 3 |
| Setpiece PEAK phase | 4 |
| RELIEF/INTRO | 1 |
| Boss fight (normal enemies present) | 2 |

### 3.3 Bullet Density Caps

| Phase | Max Bullets On Screen | Enforcement |
|-------|----------------------|-------------|
| INTRO | 0 | No attacks |
| BUILD | 15 | Soft cap via HC-PD audit |
| PEAK | 30 | Hard cap — delay patterns if exceeded |
| RESOLVE | 12 | Soft cap |
| RELIEF | 0 | No enemies |

---

## 4. SPAWN CHOREOGRAPHY RULES

### 4.1 Entry Types

| Entry Type | Visual | Duration | Used For |
|-----------|--------|----------|----------|
| **INSTANT** | No animation. Spawn + flash. | 0ms | Swarm, emergency spawns |
| **SLIDE_IN** | Slide from off-screen to target position. | 800-1200ms | Formation entry, setpieces |
| **FADE_IN** | Fade alpha 0→1 at target position. | 600-1000ms | Stealth archetypes, ambushes |
| **DROP_IN** | Fall from above screen to position. | 1000-1500ms | External shmup enemies |
| **BURST_IN** | Rapid entry with flash + SFX. | 300-500ms | Ambush triggers, reinforcements |

### 4.2 Spawn Spacing Minimums

| Rule | Value | Applies To |
|------|-------|------------|
| Time between enemy spawns (same wave) | 180ms minimum | Formation enemies |
| Time between wave groups (staggered entry) | 800ms minimum | Multi-group waves |
| Distance between spawn positions | 64px minimum | Prevents stacking |
| Spawn Y coordinate range | 50-180px from top | Keeps enemies in visible zone |
| Spawn X coordinate range | 10px to W-10px-edges | Never off-screen horizontally at spawn |

### 4.3 Entry Timing by Archetype

| Archetype | Preferred Entry | Entry Side | Special |
|-----------|----------------|------------|---------|
| sweeper | SLIDE_IN | Top, full width | First to enter |
| sniper | FADE_IN | Top, edges | Enters after sweepers |
| diver | SLIDE_IN | Top, center | Returns to formation after dive |
| suppressor | SLIDE_IN | Top, one side | Enters on denied-lane side |
| chaser | BURST_IN | Edges (left/right) | Dramatic entry |
| flanker | SLIDE_IN | Edges (left/right) | Enters on assigned flank |
| baiter | DROP_IN | Top, random X | Erratic entry matches role |
| anchor | SLIDE_IN | Top, center | Slow, deliberate entry |
| swarm | INSTANT | Top, full width | Rapid fill |
| blocker | FADE_IN | Top, strategic positions | Appears as obstacle |

---

## 5. RELIEF POLICIES

### 5.1 Types of Relief

| Relief Type | Trigger | Duration | Characteristics |
|------------|---------|----------|----------------|
| **Phase Relief** | PEAK → RESOLVE transition | 1500-2500ms | Reduced fire, no dives/snipes |
| **Wave Clear Relief** | All enemies dead | 900-2000ms silence | Guaranteed quiet, power-up chance |
| **Recovery Wave** | Designed breather level | Full wave (10-15s) | Low threat, reward-rich |
| **Emergency Relief** | Player hits 1 life | 3000ms reduced pressure | Survival aid |
| **Skill Relief** | Player stops killing for 3s (counter-pressure) | 2000ms | Rewards tactical pausing |

### 5.2 Relief Guarantees

| Guarantee | Condition |
|-----------|-----------|
| No wave exceeds 45s without relief | Timer starts at PEAK entry |
| At least 1 relief window per wave | Phase relief or wave clear |
| Relief must have < 6 bullets on screen | Density cap during relief |
| No dives during relief | Divers grounded or recovering |
| No sniper fire during relief | Snipers on cooldown |
| Power-up spawn eligible during relief | If power-up budget allows |

### 5.3 Relief Blocking Conditions (from Encounter Director)

Relief is blocked if:
1. `dives > 0` — any diver active
2. `bullets > reliefMaxBullets` — too many bullets on screen
3. `targetPressure >= pressure` — pressure still rising

HC-WC must ensure these conditions are met during designed relief windows by:
- Forcing divers into recovery before relief triggers
- Gating fire patterns near relief windows
- Triggering relief when pressure is falling

---

## 6. DIFFICULTY SCALING RULES

### 6.1 What Scales

| Parameter | Scaling Method | Range (L1→L20) |
|-----------|---------------|-----------------|
| Enemy count | +1-2 per stage | 8 → 25 (normal waves) |
| Bullet speed | DIFFICULTY_TABLE | 2.70 → 4.84 |
| Shoot cooldown | DIFFICULTY_TABLE | 1020ms → 552ms |
| Dive chance | DIFFICULTY_TABLE | 0.10% → 0.55% |
| Max divers | DIFFICULTY_TABLE | 1 → 3 |
| Archetype variety | New roles introduced | 2 roles → 6 roles |
| Phase durations | Hardcore rank scaling | Longer → Shorter |
| Pattern complexity | Simple → Coordinated | Single → Multi-wave |

### 6.2 What Must NOT Scale

| Parameter | Why |
|-----------|-----|
| Bullet count per volley | Density kills readability |
| Simultaneous archetypes | Overlap kills fairness |
| Enemy HP (except where designed) | HP bloat = grind |
| Pattern speed beyond balance table | Unreactable |
| Minimum lane width | Must never drop below 64px |

### 6.3 Rank Integration

HC-WC scaling respects hardcore rank (HC-25):

| Rank Level | Effect on HC-WC |
|------------|----------------|
| 1 (LOW) | Longer INTRO/BUILD. Lower max active roles. Wider lane minimum. |
| 2-3 (NORMAL) | Standard scaling per level. |
| 4 (HIGH) | Shorter phases. Faster activation. Narrower lane minimum (80px). |
| 5 (MAX) | Minimum phases. Max active roles + 1. Coordinated volleys enabled. |

---

## 7. CROSSFIRE RESTRICTIONS

### 7.1 Angle Limits

| Crossfire Type | Max Angle from Vertical | Safe Zone |
|---------------|------------------------|-----------|
| Flanker edge crossfire | 30° | Center 30% screen width |
| Sniper diagonal | 25° | Opposite edge |
| Imperial Guard setpiece | 35° | Center 25% |
| Rotating crossfire | 45° (briefly) | Axis-dependent |

### 7.2 Crossfire Safety Rules

1. **CF-01**: Crossfire from opposite edges must not intersect at player height range (Y: H*0.5 to H*0.85).
2. **CF-02**: Crossfire volley timing must alternate left/right. Never simultaneous from both edges.
3. **CF-03**: Crossfire + suppressor wall is FORBIDDEN (seals all horizontal escape).
4. **CF-04**: Crossfire angle increases by max 5° per stage above stage 2.
5. **CF-05**: During crossfire peak, at least one vertical lane (center) must have zero crossfire bullets.

---

## 8. DIVER FAIRNESS RULES

### 8.1 Dive Safety Protocol

1. **DV-01**: All divers in a wave must telegraph simultaneously (squad flash). No individual telegraphs.
2. **DV-02**: Dive targets must be spread across 80px horizontal window around player. No stacking.
3. **DV-03**: Max 2 divers diving simultaneously (3 in setpiece).
4. **DV-04**: Dive wave gap minimum: 2500ms between dive groups.
5. **DV-05**: No crossfire or sniper fire during active dive window (diver on screen).
6. **DV-06**: Dive recovery path must be clear of suppressor walls.
7. **DV-07**: Diver must not target player Y above screen center (prevents off-screen dive death).
8. **DV-08**: Dive speed scales with level via DIFFICULTY_TABLE — never exceeds 4.05.

---

## 9. TELEGRAPH TIMING RULES

### 9.1 Minimum Telegraph Durations

| Threat | Telegraph Type | Min Duration | Max Duration |
|--------|---------------|-------------|-------------|
| Sniper shot | Aim line + flash | 280ms | 400ms |
| Diver launch | Squad flash + SFX | 380ms | 500ms |
| Suppressor burst | Pre-burst flash | 180ms | 250ms |
| Chaser burst + sides | Flash + delayed sides | 180ms | 280ms |
| Anchor volley | Expanding ring | 400ms | 600ms |
| Ambush trigger | Screen edge flash + SFX | 400ms | 600ms |
| Boss prelude | "APPROACHING" banner | 3000ms | 4000ms |
| Phase transition | Background pulse | 200ms | 300ms |
| Lane collapse warning | Column pulse | 500ms | 800ms |
| Rotation direction change | Arrow indicator | 500ms | 700ms |

### 9.2 Telegraph Stacking Rule

- Max 2 telegraphs visible simultaneously.
- If a 3rd telegraph would appear, delay it until one expires.
- Exception: Squad diver telegraph (1 visual for all divers) counts as 1.

---

## 10. SETPIECE COOLDOWN RULES

### 10.1 Setpiece-Specific

| Setpiece | Volley Cooldown | Telegraph | Burst Phases |
|----------|----------------|-----------|--------------|
| Pincer Assault | 1500ms | 250ms flash | 1 |
| Fortress Breach | 2000ms | 220ms line flash | 1 |
| Kamikaze Rush | — | 380ms squad flash (dive) | 3 dive waves |
| Splitter Storm | 1600ms | 190ms flash | 1 (split escalates) |
| Imperial Guard | 2200ms | 250-360ms flash | 2 (burst chains) |

### 10.2 Inter-Setpiece Cooldowns

- No two setpieces within 3 levels (currently respected: 3,7,12,16,18).
- Setpiece must not immediately follow boss (levels 6,11,16 — level 16 violates this: boss at 15, setpiece at 16).
  - **Fix for HC-WC**: Level 16 should be recovery breather. Setpiece at 17 instead.

---

## 11. FORMATION IDENTITY RULES

### 11.1 Formation → Tactical Meaning

| Formation Silhouette | Tactical Message | Visual Cue |
|---------------------|-----------------|------------|
| Classic Grid (5x8) | "Standard engagement" | Rectangle — default |
| V-Shape (narrowing) | "Pressure from above, escape below" | Arrow pointing down |
| Diamond (pyramid) | "Center is guarded, edges are weak" | Diamond — center-heavy |
| Pincer (two wings) | "Danger on edges, center is safe" | Two angled columns |
| Wall (horizontal lines) | "Break through or be crushed" | Stacked rows |
| Spiral (rotating) | "Keep moving or be surrounded" | Rotating arc |
| Column (vertical strips) | "Choose your lane" | 3 vertical columns |
| Gate (closing walls) | "Escape before it closes" | Two converging walls |
| Scatter (random positions) | "No safe pattern — stay alert" | Erratic positions |

### 11.2 Formation Selection Logic

```
if (waveCategory === FOUNDATION) → Classic Grid or V-Shape
if (waveCategory === TACTICAL && type === lane_denial) → Column (asymmetric)
if (waveCategory === TACTICAL && type === pincer) → Pincer
if (waveCategory === TACTICAL && type === crossfire) → Column (edges only)
if (waveCategory === ADVANCED && type === collapsing) → Gate
if (waveCategory === ADVANCED && type === rotating) → Spiral
if (waveCategory === SETPIECE) → Hand-authored formation
if (waveCategory === PRELUDE) → Loose Arc
if (waveCategory === RELIEF) → Sparse Line (1 row)
```

---

## 12. COMPATIBILITY WITH EXISTING SYSTEMS

### 12.1 Encounter Director Integration

HC-WC composition rules are **input** to Encounter Director, not override:

| Director System | HC-WC Interaction |
|----------------|-------------------|
| `pressure` | HC-WC composition determines target pressure via role mix. Director still computes it. |
| `silenceTimer` | HC-WC respects silence windows. No spawning during silence. |
| `spawnCooldown` | HC-WC stagger rules work WITH director cooldown. HC-WC minimums are additional constraints. |
| `activeRoles` | HC-WC role caps match director role caps. HC-WC is stricter for some roles (diver: 2 vs 3). |
| `canSpawnRole()` | HC-WC uses this gate. Does not bypass. |
| `canCoordinateEliteAction()` | HC-WC respects elite action gating. |
| `reliefActive` | HC-WC designed relief windows align with director relief computation. |
| `wavePersonality` | HC-WC replaces personality selection. Wave type IS the personality now. |

### 12.2 Pattern Director (HC-PD) Integration

| HC-PD System | HC-WC Interaction |
|-------------|-------------------|
| Threat budget audit | HC-WC compositions are designed to stay within budget. HC-PD audit validates. |
| Soft gating | HC-WC respects HC-PD advisory delays. Can increase delay recommendations. |
| Density caps | HC-WC micro-structure caps (30 peak, 15 build) align with HC-PD caps. |
| Readability load | HC-WC role mix limits designed to keep readability load ≤ 6. |

### 12.3 Hitbox Fairness (HC-HB) Integration

| HC-HB Concern | HC-WC Safeguard |
|---------------|-----------------|
| Bullet spawn inside player | HC-WC spawn positions are top-only, 50-180px from top. Player is at bottom. No intersection possible. |
| Density-based fairness | HC-WC caps ensure maximum fairness by limiting simultaneous patterns. |
| Escape lane integrity | HC-WC lane rules guarantee at least one escape corridor. HC-HB validates. |

---

## 13. RULE VIOLATIONS — DETECTION & RESPONSE

### 13.1 Runtime Violation Checks

| Check | When | Action if Violated |
|-------|------|-------------------|
| Role cap exceeded | Before spawn | Skip spawn, log warning |
| Forbidden pair active | Before pattern fire | Block pattern, log `eliteDenyCount` |
| Density cap exceeded | Each frame | Delay next pattern by 200ms |
| Lane < 64px | After formation layout | Widen formation, log |
| Phase duration < minimum | Phase transition | Extend phase to minimum |
| Telegraph missing | Before attack | Add telegraph, log warning |
| Relief missing > 45s | Timer check | Force emergency relief |

### 13.2 Telemetry for Violations

Extend `getEncounterDirectorSnapshot()` with:

```
compositionRuleViolations: { roleCap, forbiddenPair, densityCap, laneWidth, phaseDuration, telegraphMissing, reliefMissing }
```

---

*End of HC-WC-02C — Hardcore Composition Rules*
