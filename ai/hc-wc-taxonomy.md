# HC-WC-02A — Wave Taxonomy & Tactical Language

> **Sprint**: HC-WC-02
> **Document**: A — Official Wave Taxonomy
> **Date**: 2026-05-19
> **Status**: Draft
> **Depends on**: HC-WC-01 (audit)

---

## 1. DESIGN PHILOSOPHY

Every wave in Galaxy Raiders must be describable as a **tactical sentence**:

```
"staggered sniper denial from the left flank"
"rotating sweeper pressure with center relief"
"false recovery into hunter dive ambush"
```

NOT:

```
"random enemies shooting"
```

### 1.1 Hardcore Wave Principles

1. **Readable intent** — Player identifies the tactical shape within 2 seconds.
2. **Teachable pattern** — Wave teaches a skill used later in the run.
3. **Escapable always** — At least one open lane at all times (except brief setpiece locks).
4. **Relief guaranteed** — No wave lasts >45s without a relief window.
5. **Identity first** — Visual silueta before combat activation.
6. **Composition over count** — Curated mix beats random density.
7. **Arc required** — Every wave has intro → build → peak → resolve.

---

## 2. WAVE CATEGORIES — 4 TIERS

### 2.1 FOUNDATION (Tier 1 — Levels 1-6)

Waves that establish core skills. Must be readable, forgiving, educational.

| ID | Label | Tactical Purpose | Skill Taught |
|----|-------|-----------------|--------------|
| `FND_tutorial` | Tutorial Pressure | Introduce formation reading + basic dodging | Horizontal movement, bullet reading |
| `FND_staggered_entry` | Staggered Entry | Enemies arrive in waves, not all at once | Reading staggered threats |
| `FND_recovery_breather` | Recovery Breather | Post-boss relief, reward-rich, low threat | Recovering composure |
| `FND_formation_reading` | Formation Reading | Distinct formation silueta, learn to read shape | Spatial awareness |
| `FND_dual_role` | Dual Role Intro | Two archetypes together for the first time | Multi-threat reading |
| `FND_escort` | Escort Light | Enemies screen a high-value target (UFO) | Target prioritization |

### 2.2 TACTICAL (Tier 2 — Levels 6-12)

Waves with distinct tactical puzzles. Each has a dominant archetype + counter-rhythm.

| ID | Label | Tactical Purpose | Dominant Role | Secondary |
|----|-------|-----------------|---------------|-----------|
| `TAC_lane_denial` | Lane Denial | Suppressor controls one lane, player must use other | suppressor | sweeper |
| `TAC_rotating_pressure` | Rotating Pressure | Threat shifts left→center→right cyclically | sweeper | sniper |
| `TAC_pincer` | Pincer Assault | Enemies close from both flanks, center is safe | flanker | diver |
| `TAC_crossfire_trap` | Crossfire Trap | Diagonal fire from edges creates safe zone in center | sniper | flanker |
| `TAC_suppression_wall` | Suppression Wall | Wall of lateral fire, micro-gaps to slip through | suppressor | anchor |
| `TAC_bait_punish` | Bait & Punish | Baiters draw fire, chasers punish over-commitment | baiter | chaser |
| `TAC_hunter_dive` | Hunter Dive | Staggered dive waves, safe windows between | diver | sweeper |
| `TAC_sniper_denial` | Sniper Denial | Precision threats force precise lateral taps | sniper | blocker |
| `TAC_swarm_anchor` | Swarm + Anchor | Many light enemies + 1-2 heavy anchors | swarm | anchor |
| `TAC_flanking_pursuit` | Flanking Pursuit | Chasers sweep from edges toward player | chaser | baiter |

### 2.3 ADVANCED (Tier 3 — Levels 12-18)

Waves that test multiple skills simultaneously. Introduce deception and compounding pressure.

| ID | Label | Tactical Purpose | Deception Element |
|----|-------|-----------------|-------------------|
| `ADV_false_recovery` | False Recovery | Looks like relief, then ambush triggers | Silence → sudden activation |
| `ADV_delayed_ambush` | Delayed Ambush | Quiet entry, all archetypes activate after delay | Hidden threat buildup |
| `ADV_layered_pressure` | Layered Pressure | Suppressor wall + sniper aimed + diver dives | Three simultaneous layers |
| `ADV_collapsing_lane` | Collapsing Lane | Safe zone gradually shrinks via crossfire | Escaping narrowing corridor |
| `ADV_rotating_crossfire` | Rotating Crossfire | Crossfire origin rotates 90° every cycle | Changing safe direction |
| `ADV_spiral_collapse` | Spiral Collapse | Enemies spiral inward, reducing safe area | Constricting arena |
| `ADV_survival_corridor` | Survival Corridor | Single narrow lane, heavy fire both sides | Precision movement endurance |
| `ADV_counter_pressure` | Counter Pressure | Wave fights back harder as player kills more | Escalation trap |
| `ADV_role_reversal` | Role Reversal | Suppressors become snipers, baiters become divers mid-wave | Identity confusion |
| `ADV_gauntlet` | Gauntlet | Continuous 40s pressure with no natural relief | Endurance test |

### 2.4 SETPIECE (Tier 4 — Boss-adjacent + milestones)

Hand-authored encounters with narrative weight, unique mechanics, and visual drama.

| ID | Label | Tactical Purpose | Narrative Role |
|----|-------|-----------------|----------------|
| `SET_boss_prelude` | Boss Prelude | Builds tension before boss, introduces boss theme | Tension arc |
| `SET_hunter_dive_setpiece` | Hunter Dive Setpiece | Multi-wave coordinated dives with telegraphs | Climax |
| `SET_closing_gates` | Closing Gates | Safe zone closes from edges, forces center fight | Arena control |
| `SET_spiral_collapse_setpiece` | Spiral Collapse | Enemies spiral, player must spiral-counter | Visual spectacle |
| `SET_survival_corridor_setpiece` | Survival Corridor | Long narrow gauntlet, pure endurance | Trial by fire |
| `SET_fortress_breach` | Fortress Breach | Break through layered enemy wall | Tactical puzzle |
| `SET_imperial_guard` | Imperial Guard | Coordinated crossfire volleys with telegraphs | Elite encounter |
| `SET_splitter_storm` | Splitter Storm | Enemies split on death, escalating count | Escalation mechanic |
| `SET_kamikaze_rush` | Kamikaze Rush | Pursuit wave, player-directed aggression | Aggression test |
| `SET_final_stand` | Final Stand | Last wave before final boss, maximum spectacle | Narrative peak |

---

## 3. WAVE TYPE DEFINITION TEMPLATE

Each wave type must define these 16 fields:

```
1. Tactical Purpose     — What skill does this wave test/teach?
2. Dominant Role         — Primary archetype (>40% of enemies)
3. Secondary Role        — Supporting archetype (20-35%)
4. Allowed Support       — Roles that can appear in small numbers
5. Forbidden Overlaps    — Role pairs that MUST NOT coexist
6. Threat Budget Range   — HC-PD threat budget (1-10 scale)
7. Pressure Curve        — Expected pressure shape (ramp, spike, wave, flat)
8. Relief Requirement    — When must relief appear (after X seconds, after Y kills)
9. Escape Lane Rules     — How many lanes, where, when
10. Spawn Choreography   — How enemies enter (instant, staggered, phased, from edges)
11. Formation Silhouette — Recognizable shape (V, pincer, wall, spiral, diamond)
12. Telegraph Requirement — What must be telegraphed (dives, volleys, ambushes)
13. Typical Duration      — Expected combat time (seconds)
14. Difficulty Scaling    — How this wave type changes from level 1→20
15. Fairness Risks        — What can go wrong and how to prevent
16. Recommended Stages    — Which stage group this fits best
```

---

## 4. FULL WAVE TYPE DEFINITIONS

### 4.1 FOUNDATION WAVES

---

#### FND_staggered_entry — Staggered Entry

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Teach the player to read enemy arrivals in sequence, not all at once. |
| **Dominant Role** | sweeper (60%) |
| **Secondary Role** | sniper (25%) |
| **Allowed Support** | baiter |
| **Forbidden Overlaps** | diver, chaser, suppressor |
| **Threat Budget** | 2-4 |
| **Pressure Curve** | Gradual ramp: 0.2 → 0.3 → 0.4 → 0.25 (resolve) |
| **Relief Requirement** | After wave clear: 1200ms silence minimum |
| **Escape Lane Rules** | Center lane open always. At least 40% screen width free. |
| **Spawn Choreography** | 3 waves of 6-8 enemies, 800ms gap between waves. Entry from top, slide to position. |
| **Formation Silhouette** | Classic grid (5x6), compressed to center 60% |
| **Telegraph Requirement** | Spawn flash only. No attack telegraphs at this tier. |
| **Typical Duration** | 18-25s |
| **Difficulty Scaling** | Level 1: 2 waves. Level 3: 3 waves. Level 5+: adds baiter support. |
| **Fairness Risks** | Low. Keep wave gaps wide enough that player never faces >8 enemies active. |
| **Recommended Stages** | Stage 1 (levels 1-2). Tutorial replacement. |

---

#### FND_recovery_breather — Recovery Breather

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Give player recovery time after intense encounter. Restore composure. Reward survival. |
| **Dominant Role** | sweeper (light, 50%) |
| **Secondary Role** | None (rest are non-combat) |
| **Allowed Support** | UFO only |
| **Forbidden Overlaps** | diver, sniper, chaser, suppressor, blocker |
| **Threat Budget** | 1-2 |
| **Pressure Curve** | Flat low: 0.10 → 0.15 → 0.10 |
| **Relief Requirement** | This IS a relief wave. Must have guaranteed power-up spawn. |
| **Escape Lane Rules** | Entire arena is safe lane. Enemies occupy top 25% only. |
| **Spawn Choreography** | 5-8 enemies total, all spawn at top, slow descent. No dives. |
| **Formation Silhouette** | Sparse line (1 row, 5-8 cols), wide spacing |
| **Telegraph Requirement** | None. Intentional calm. |
| **Typical Duration** | 10-15s |
| **Difficulty Scaling** | Count stays 5-8 across all levels. Speed increases slightly. |
| **Fairness Risks** | Very low. Must ensure power-up doesn't spawn behind enemies. |
| **Recommended Stages** | After bosses (levels 6, 11). After hard setpieces (level 13). |

---

#### FND_dual_role — Dual Role Intro

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Introduce reading two threat types simultaneously for the first time. |
| **Dominant Role** | sweeper (50%) |
| **Secondary Role** | sniper (35%) |
| **Allowed Support** | None on first occurrence |
| **Forbidden Overlaps** | diver, chaser, suppressor |
| **Threat Budget** | 3-5 |
| **Pressure Curve** | Two-step ramp: sweepers active → snipers activate after 3s |
| **Relief Requirement** | After wave clear: standard silence |
| **Escape Lane Rules** | Center lane open. Lateral gaps between snipers. |
| **Spawn Choreography** | Sweepers enter first (top-center), snipers enter from sides after 3s delay. |
| **Formation Silhouette** | Sweepers in center block, snipers on wings |
| **Telegraph Requirement** | Sniper entry flash distinct from sweeper. |
| **Typical Duration** | 20-30s |
| **Difficulty Scaling** | At higher levels (reprise wave), adds baiter support. |
| **Fairness Risks** | Snipers must not fire aimed shots during sweeper fan overlap. Minimum 400ms spacing. |
| **Recommended Stages** | Stage 1 (level 2 or 3). Reprised in Stage 3 as harder variant. |

---

#### FND_formation_reading — Formation Reading

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Teach player to identify formation shape and use it to plan movement. |
| **Dominant Role** | sweeper (55%) |
| **Secondary Role** | None |
| **Allowed Support** | baiter |
| **Forbidden Overlaps** | sniper, diver, chaser |
| **Threat Budget** | 2-4 |
| **Pressure Curve** | Flat: 0.20 → 0.25 → 0.20 |
| **Relief Requirement** | After wave clear |
| **Escape Lane Rules** | Formation shape determines lanes. V-shape = wide bottom gap. Diamond = corner lanes. |
| **Spawn Choreography** | Formation enters as a single group. 800ms visual-only intro before first shot. |
| **Formation Silhouette** | V-shape or diamond. Must be visually distinct. |
| **Telegraph Requirement** | None. Formation IS the visual communication. |
| **Typical Duration** | 20-28s |
| **Difficulty Scaling** | At higher levels, formation shifts shape mid-wave (surprise). |
| **Fairness Risks** | Formation movement (left-right drift) must not obscure the shape. Slow drift only. |
| **Recommended Stages** | Stage 1-2 (levels 1-6). Use distinct formation per occurrence. |

---

### 4.2 TACTICAL WAVES

---

#### TAC_lane_denial — Lane Denial

| Field | Value |
|-------|-------|
| **Tactical Purpose** | One lane is dangerous. Player must identify and use the safe lane. |
| **Dominant Role** | suppressor (40%) |
| **Secondary Role** | sweeper (35%) |
| **Allowed Support** | baiter |
| **Forbidden Overlaps** | diver, chaser, sniper |
| **Threat Budget** | 4-6 |
| **Pressure Curve** | Asymmetric: denied lane = 0.6, safe lane = 0.2 |
| **Relief Requirement** | Safe lane must remain open entire wave. No lateral drift into safe lane. |
| **Escape Lane Rules** | Exactly 1 lane is denied (suppressors occupy it). 2+ lanes remain open. |
| **Spawn Choreography** | Suppressors enter from denied side. Sweepers fill center. Intro: suppressors visible first. |
| **Formation Silhouette** | Left-heavy or right-heavy block, leaving opposite side open |
| **Telegraph Requirement** | Suppressor cone telegraph visible before first burst (180ms). |
| **Typical Duration** | 22-30s |
| **Difficulty Scaling** | Higher levels: denied lane switches sides mid-wave. |
| **Fairness Risks** | Suppressor fire must not extend into safe lane. Cone angle limited to 0.28 rad. |
| **Recommended Stages** | Stage 2 (levels 7-9). |

---

#### TAC_rotating_pressure — Rotating Pressure

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Threat moves cyclically. Player must rotate position to stay in safe zone. |
| **Dominant Role** | sweeper (45%) |
| **Secondary Role** | sniper (30%) |
| **Allowed Support** | flanker |
| **Forbidden Overlaps** | diver, chaser |
| **Threat Budget** | 5-7 |
| **Pressure Curve** | Sine wave: peaks at 0.55 every 8s, valleys at 0.25 |
| **Relief Requirement** | Relief window at pressure valleys (4s duration minimum). |
| **Escape Lane Rules** | Safe zone rotates: left → center → right → center → left, cyclically. |
| **Spawn Choreography** | Enemies arranged in 3 columns. Column activity rotates: col 1 fires → col 2 fires → col 3 fires. |
| **Formation Silhouette** | Three vertical columns, equal spacing |
| **Telegraph Requirement** | Next active column flashes 400ms before activation. |
| **Typical Duration** | 25-35s |
| **Difficulty Scaling** | Higher levels: rotation speed increases, columns overlap briefly. |
| **Fairness Risks** | Rotation must never leave all 3 columns firing simultaneously. 2 max. |
| **Recommended Stages** | Stage 2-3 (levels 8-14). |

---

#### TAC_pincer — Pincer Assault

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Enemies close from both flanks. Center is safe. Teaches lateral awareness. |
| **Dominant Role** | flanker (40%) |
| **Secondary Role** | diver (25%) |
| **Allowed Support** | sniper, sweeper |
| **Forbidden Overlaps** | suppressor + diver (seals escape) |
| **Threat Budget** | 5-8 |
| **Pressure Curve** | Bell curve: 0.2 → 0.5 → 0.6 → 0.3 |
| **Relief Requirement** | Center lane must remain open throughout. After peak: 3s reduced fire. |
| **Escape Lane Rules** | Center vertical lane (30% screen width) is always clear. Edges are dangerous. |
| **Spawn Choreography** | Left group enters from left. Right group enters from right. 1200ms entry animation. |
| **Formation Silhouette** | Two angled wings meeting at bottom-center. V-pointing-down. |
| **Telegraph Requirement** | Diver telegraph (380ms). Flanker crossfire has 200ms pre-flash. |
| **Typical Duration** | 28-38s |
| **Difficulty Scaling** | Higher levels: wings compress inward slowly, narrowing safe center. |
| **Fairness Risks** | Flanker crossfire from both sides must not create unavoidable X pattern. Crossfire angles limited to 30° from vertical. |
| **Recommended Stages** | Stage 2-3 (levels 7-15). Existing level 3 pincer can be this. |

---

#### TAC_crossfire_trap — Crossfire Trap

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Diagonal fire from edges. Safe zone is center. Teaches reading angled threats. |
| **Dominant Role** | sniper (45%) |
| **Secondary Role** | flanker (30%) |
| **Allowed Support** | sweeper |
| **Forbidden Overlaps** | diver, suppressor, chaser |
| **Threat Budget** | 5-7 |
| **Pressure Curve** | Flat elevated: 0.45 → 0.50 → 0.45 |
| **Relief Requirement** | Central safe zone (25% screen width) must stay bullet-free. |
| **Escape Lane Rules** | Center column is safe. Edges are crossfire zones. |
| **Spawn Choreography** | Snipers on edges. Flankers at mid-height. Sweepers fill center, don't fire crossfire. |
| **Formation Silhouette** | Two vertical columns at screen edges, empty center |
| **Telegraph Requirement** | Crossfire origin flashes before volley (200ms). |
| **Typical Duration** | 22-32s |
| **Difficulty Scaling** | Higher levels: crossfire angle widens from 30° to 45°. |
| **Fairness Risks** | Crossfire from both edges must not intersect at player height. Fire timing must alternate left/right. |
| **Recommended Stages** | Stage 3 (levels 12-15). |

---

#### TAC_hunter_dive — Hunter Dive

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Staggered dive waves. Player must dodge vertically in rhythm. |
| **Dominant Role** | diver (50%) |
| **Secondary Role** | sweeper (30%) |
| **Allowed Support** | baiter |
| **Forbidden Overlaps** | chaser, sniper, suppressor |
| **Threat Budget** | 5-7 |
| **Pressure Curve** | Spiky: peaks at 0.65 during dive waves, valleys at 0.20 between |
| **Relief Requirement** | 2.5s gap between dive waves. No crossfire during dive waves. |
| **Escape Lane Rules** | Horizontal movement lane open at all times. Dive angles leave horizontal gaps. |
| **Spawn Choreography** | 3 dive waves of 2-3 divers each. 2500ms gap. Sweepers provide background pressure. |
| **Formation Silhouette** | Sweepers in top formation. Divers launch from formation toward player. |
| **Telegraph Requirement** | ALL divers in a wave telegraph simultaneously (380ms). Coordinated flash = squad warning. |
| **Typical Duration** | 25-35s |
| **Difficulty Scaling** | Higher levels: 4 waves, faster dives, narrower gaps. |
| **Fairness Risks** | Multiple divers must not target same X coordinate. Spread targets across player width ±40px. |
| **Recommended Stages** | Stage 2-3 (levels 7-16). |

---

#### TAC_bait_punish — Bait & Punish

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Baiters draw attention/aggression. Chasers punish over-commitment. |
| **Dominant Role** | baiter (40%) |
| **Secondary Role** | chaser (35%) |
| **Allowed Support** | sweeper |
| **Forbidden Overlaps** | diver, sniper, suppressor |
| **Threat Budget** | 4-6 |
| **Pressure Curve** | Deceptive: appears low (0.25) → spikes to 0.55 on chase |
| **Relief Requirement** | After chase spike: 2s reduced activity. |
| **Escape Lane Rules** | Escape direction must be opposite to chaser origin. |
| **Spawn Choreography** | Baiters enter first, erratic movement. Chasers enter from edges after 2s delay. |
| **Formation Silhouette** | Baiters scattered. Chasers on flanks. |
| **Telegraph Requirement** | Chaser entry from edge must have direction arrow. |
| **Typical Duration** | 18-28s |
| **Difficulty Scaling** | Higher levels: baiters fire more aggressively, chasers faster. |
| **Fairness Risks** | Chaser + baiter fire must not overlap. Minimum 500ms gap between bait burst and chase volley. |
| **Recommended Stages** | Stage 2 (levels 8-11). |

---

#### TAC_sniper_denial — Sniper Denial

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Precision threats force precise micro-dodging. Wide safe lanes between snipers. |
| **Dominant Role** | sniper (60%) |
| **Secondary Role** | blocker (25%) |
| **Allowed Support** | None |
| **Forbidden Overlaps** | diver, chaser, suppressor, sweeper |
| **Threat Budget** | 4-6 |
| **Pressure Curve** | Flat moderate: 0.40 → 0.45 → 0.40 |
| **Relief Requirement** | Sniper volleys spaced 1800ms minimum. Wide gaps between volleys. |
| **Escape Lane Rules** | Lanes between snipers at least 80px wide. 3+ lanes across screen. |
| **Spawn Choreography** | 3-4 snipers in a row with wide spacing. Blockers protect snipers (don't attack heavily). |
| **Formation Silhouette** | Horizontal line with gaps — dotted line across screen |
| **Telegraph Requirement** | Sniper aim line visible 280ms before shot. Only one sniper fires at a time. |
| **Typical Duration** | 22-30s |
| **Difficulty Scaling** | Higher levels: 2 snipers fire in volley. Gaps narrower. |
| **Fairness Risks** | Sniper shots must never be aimed at player's exact position during other threats. Sequential only. |
| **Recommended Stages** | Stage 2-3 (levels 9-17). |

---

#### TAC_swarm_anchor — Swarm + Anchor

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Many light enemies distract while 1-2 heavy anchors control space. |
| **Dominant Role** | swarm (55%) |
| **Secondary Role** | anchor (20%) |
| **Allowed Support** | sweeper |
| **Forbidden Overlaps** | sniper + anchor, diver + anchor |
| **Threat Budget** | 5-7 |
| **Pressure Curve** | Elevated flat: 0.40 → 0.48 → 0.40 |
| **Relief Requirement** | Anchors must pause fire for 1500ms after each burst. |
| **Escape Lane Rules** | Anchor fire lanes are fixed. Swarm bullets fill remaining space. Always 1+ gap through swarm. |
| **Spawn Choreography** | Swarm enters first (8-12 light enemies). Anchors enter from top-center after 2s. |
| **Formation Silhouette** | Anchors central. Swarm forms ring/shield around anchors. |
| **Telegraph Requirement** | Anchor volley telegraph (ring pulse, 300ms). |
| **Typical Duration** | 25-35s |
| **Difficulty Scaling** | Higher levels: 2 anchors, wider volley patterns. |
| **Fairness Risks** | Anchor volley must never saturate entire screen. Gaps in pattern intentional. |
| **Recommended Stages** | Stage 2-4 (levels 8-18). |

---

### 4.3 ADVANCED WAVES

---

#### ADV_false_recovery — False Recovery

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Deceptive calm followed by ambush. Tests player's ability to stay alert. |
| **Dominant Role** | baiter (30%) |
| **Secondary Role** | diver (30%) |
| **Allowed Support** | chaser, sweeper |
| **Forbidden Overlaps** | sniper, suppressor |
| **Threat Budget** | 6-8 |
| **Pressure Curve** | Drop to 0.10 (fake relief) → spike to 0.65 (ambush) → settle 0.35 |
| **Relief Requirement** | REAL relief 3s after ambush spike ends. |
| **Escape Lane Rules** | During fake relief: all lanes open. During ambush: center lane closes, edges open. |
| **Spawn Choreography** | Phase 1 (3s): 2-3 baiters, minimal fire — looks like recovery. Phase 2: 2 divers + 2 chasers burst from edges. |
| **Formation Silhouette** | Phase 1: sparse, calm. Phase 2: sudden pincer. |
| **Telegraph Requirement** | Ambush MUST have 400ms warning (screen edge flash + SFX). |
| **Typical Duration** | 20-30s |
| **Difficulty Scaling** | Higher levels: shorter fake relief (2s), harder ambush. |
| **Fairness Risks** | Ambush telegraph is MANDATORY. Without it, this is unfair. Never skip telegraph. |
| **Recommended Stages** | Stage 3-4 (levels 13-18). |

---

#### ADV_layered_pressure — Layered Pressure

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Three threat layers simultaneously. Tests multi-axis reading. |
| **Dominant Role** | suppressor (35%) |
| **Secondary Role** | sniper (35%) |
| **Allowed Support** | diver, sweeper |
| **Forbidden Overlaps** | chaser + any (too many pursuit threats) |
| **Threat Budget** | 7-9 |
| **Pressure Curve** | Sustained high: 0.55 → 0.65 → 0.70 → relief at 0.35 |
| **Relief Requirement** | MANDATORY relief after 30s or when 50% enemies killed. |
| **Escape Lane Rules** | At least 1 clear lane at all times. Lane may shift as layers activate/deactivate. |
| **Spawn Choreography** | Layers activate sequentially: suppressor wall → sniper aimed → diver dives. 1500ms between layers. |
| **Formation Silhouette** | Suppressors low-center. Snipers high-edges. Divers in formation, launching. |
| **Telegraph Requirement** | Each layer activation announced 300ms before. Layer activation order must be consistent. |
| **Typical Duration** | 30-45s |
| **Difficulty Scaling** | Higher levels: layers overlap more (2 active simultaneously instead of sequential). |
| **Fairness Risks** | When all 3 layers active simultaneously, bullet count MUST NOT exceed 30. Gate via HC-PD. |
| **Recommended Stages** | Stage 4 (levels 16-18). |

---

#### ADV_collapsing_lane — Collapsing Lane

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Safe zone gradually shrinks. Player must adapt position or be crushed. |
| **Dominant Role** | suppressor (45%) |
| **Secondary Role** | sweeper (35%) |
| **Allowed Support** | flanker |
| **Forbidden Overlaps** | diver, sniper, chaser |
| **Threat Budget** | 6-8 |
| **Pressure Curve** | Ramp: 0.25 → 0.40 → 0.55 → 0.65 (constriction) |
| **Relief Requirement** | Lane reopens to full width 2s after constriction peak. |
| **Escape Lane Rules** | Lane starts at 60% screen width → shrinks to 20% → opens back to 60%. |
| **Spawn Choreography** | Suppressors on both sides slowly drift inward. Sweepers fill center. |
| **Formation Silhouette** | Two walls closing like gates. Empty corridor between them. |
| **Telegraph Requirement** | Lane edges marked by visual columns. Columns pulse as they close. |
| **Typical Duration** | 28-38s |
| **Difficulty Scaling** | Higher levels: faster closure, narrower minimum lane. |
| **Fairness Risks** | Minimum lane must be at least 64px wide (2x player width). Closure speed must be dodgeable. |
| **Recommended Stages** | Stage 3-4 (levels 14-18). |

---

#### ADV_rotating_crossfire — Rotating Crossfire

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Safe direction rotates 90° cyclically. Player must reorient. |
| **Dominant Role** | flanker (50%) |
| **Secondary Role** | sniper (30%) |
| **Allowed Support** | sweeper |
| **Forbidden Overlaps** | diver, chaser |
| **Threat Budget** | 6-8 |
| **Pressure Curve** | Square wave: peaks at 0.60 on active axis, 0.20 on safe axis |
| **Relief Requirement** | Safe axis must have zero crossfire for entire active period. |
| **Escape Lane Rules** | Safe direction rotates: horizontal safe → vertical safe → horizontal safe. |
| **Spawn Choreography** | Flankers at N/S edges, then E/W edges. Rotation announced by formation shift. |
| **Formation Silhouette** | Cross shape that rotates. Arms of cross are fire lanes. Center is intersection (dangerous). |
| **Telegraph Requirement** | Rotation warning 500ms before axis change. Direction indicator arrows. |
| **Typical Duration** | 30-40s |
| **Difficulty Scaling** | Higher levels: rotation speed increases, brief overlap between axes. |
| **Fairness Risks** | During axis transition, both axes must not fire. 600ms silence during rotation. |
| **Recommended Stages** | Stage 4 (levels 17-18). |

---

#### ADV_survival_corridor — Survival Corridor

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Long narrow safe lane. Heavy fire on both sides. Endurance + precision. |
| **Dominant Role** | suppressor (40%) |
| **Secondary Role** | sweeper (40%) |
| **Allowed Support** | sniper (on edges only) |
| **Forbidden Overlaps** | diver, chaser |
| **Threat Budget** | 7-9 |
| **Pressure Curve** | Sustained high: 0.55 → 0.65 → 0.60 → 0.65 |
| **Relief Requirement** | No relief during corridor. This is an endurance test. Relief ONLY after wave clear. |
| **Escape Lane Rules** | Single vertical corridor, 96-128px wide, center screen. Heavy fire on both edges. |
| **Spawn Choreography** | Suppressors + sweepers form two walls. Snipers at top of walls aim into corridor (angled, not straight). |
| **Formation Silhouette** | Two parallel vertical columns with gap between. |
| **Telegraph Requirement** | Corridor edges marked with visual columns/lines. |
| **Typical Duration** | 20-30s (intentionally shorter — endurance is intense) |
| **Difficulty Scaling** | Higher levels: narrower corridor, snipers fire into corridor. |
| **Fairness Risks** | Corridor must never narrow below 96px. Snipers must angle fire, not shoot straight down corridor. |
| **Recommended Stages** | Stage 4 (levels 17-18). |

---

#### ADV_counter_pressure — Counter Pressure

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Wave fights back harder as player kills more. Tests aggression management. |
| **Dominant Role** | sweeper (40%) |
| **Secondary Role** | chaser (30%) |
| **Allowed Support** | baiter, sniper |
| **Forbidden Overlaps** | diver, suppressor |
| **Threat Budget** | 5-9 (escalating) |
| **Pressure Curve** | Escalating with kills: starts 0.30 → +0.05 per 20% enemies killed → max 0.70 |
| **Relief Requirement** | Relief triggers when player stops killing for 3s. Encourages tactical pauses. |
| **Escape Lane Rules** | Lanes narrow as pressure rises. Start: 3 lanes. End: 1 lane. |
| **Spawn Choreography** | All enemies present from start. Behavior escalates, not count. |
| **Formation Silhouette** | Dense center block that compresses as pressure rises. |
| **Telegraph Requirement** | Pressure level indicated by background intensity. |
| **Typical Duration** | 25-40s (depends on player kill speed). |
| **Difficulty Scaling** | Higher levels: faster escalation per kill, higher max pressure. |
| **Fairness Risks** | Player must be able to pause aggression to get relief. Relief trigger must be reliable. |
| **Recommended Stages** | Stage 3-4 (levels 14-17). |

---

### 4.4 SETPIECE WAVES

---

#### SET_boss_prelude — Boss Prelude

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Build tension before boss. Introduce boss thematic elements. Low threat, high atmosphere. |
| **Dominant Role** | sweeper (light, 40%) |
| **Secondary Role** | baiter (30%) |
| **Allowed Support** | Anchor (thematic mini-boss, 1 only) |
| **Forbidden Overlaps** | diver, chaser, sniper, suppressor |
| **Threat Budget** | 2-3 |
| **Pressure Curve** | Rising tension: 0.10 → 0.15 → 0.20 → 0.25 |
| **Relief Requirement** | Silence between prelude clear and boss entry: 600ms (faster than normal transition). |
| **Escape Lane Rules** | Entire arena open. Low density. |
| **Spawn Choreography** | 6-10 enemies total. Thematic enemies matching upcoming boss. Slow, deliberate entry. |
| **Formation Silhouette** | Loose arc or V pointing toward where boss will appear. |
| **Telegraph Requirement** | Boss approach warning 3000ms before level end. "APPROACHING: [BOSS]" banner. |
| **Typical Duration** | 12-18s |
| **Difficulty Scaling** | Higher bosses: prelude adds 1 thematic enemy (mine for Serpentrix, satellite for Orbital). |
| **Fairness Risks** | Very low. Prelude must never kill the player — it's tension, not threat. |
| **Recommended Stages** | Levels 4, 9, 14, 18 (pre-boss levels). |

---

#### SET_fortress_breach — Fortress Breach

| Field | Value |
|-------|-------|
| **Tactical Purpose** | Break through layered wall. Each row is a defense line with distinct behavior. |
| **Dominant Role** | anchor (top row) |
| **Secondary Role** | sniper, sweeper, suppressor (by row) |
| **Allowed Support** | None |
| **Forbidden Overlaps** | diver, chaser (breach is horizontal, not vertical) |
| **Threat Budget** | 6-8 |
| **Pressure Curve** | Row-by-row: each row cleared drops pressure 0.15 |
| **Relief Requirement** | 500ms silence after each row cleared. |
| **Escape Lane Rules** | Gaps between columns in each row. |
| **Spawn Choreography** | 4-5 rows, each row staggered entry. Row 1 active → row 2 enters after 4s → etc. |
| **Formation Silhouette** | Horizontal stacked lines (wall), clearly separated rows |
| **Telegraph Requirement** | Volley from each row telegraphed (line flash, 220ms). |
| **Typical Duration** | 35-50s |
| **Difficulty Scaling** | Higher levels: more columns per row, faster volley cadence. |
| **Fairness Risks** | Row volleys must alternate. Never 2 rows firing simultaneously. |
| **Recommended Stages** | Level 7 (existing Fortress). Could recur at level 14. |

---

## 5. WAVE TYPE COMPATIBILITY MAP

Which wave types can appear adjacent to each other (consecutive levels):

| From \ To | staggered | breather | dual | formation | lane_denial | rotating | pincer | crossfire | hunter | bait | sniper_denial | swarm | false_rec | layered | collapsing | rot_cross | corridor | counter | prelude | fortress |
|-----------|-----------|----------|------|-----------|-------------|----------|--------|-----------|--------|------|---------------|-------|-----------|---------|------------|-----------|----------|---------|---------|----------|
| staggered | — | GOOD | GOOD | GOOD | SAFE | SAFE | — | — | — | — | — | SAFE | — | — | — | — | — | — | — | — |
| breather | GOOD | — | GOOD | SAFE | — | — | — | — | — | — | — | — | — | — | — | — | — | — | SAFE | — |
| dual | GOOD | GOOD | — | GOOD | SAFE | SAFE | — | — | — | — | — | SAFE | — | — | — | — | — | — | — | — |
| formation | GOOD | SAFE | GOOD | — | SAFE | SAFE | — | — | — | — | — | SAFE | — | — | — | — | — | — | — | — |
| lane_denial | SAFE | — | SAFE | SAFE | — | GOOD | SAFE | SAFE | — | — | — | SAFE | — | — | — | — | — | — | — | — |
| rotating | SAFE | — | SAFE | SAFE | GOOD | — | SAFE | GOOD | SAFE | — | — | SAFE | — | SAFE | — | — | — | — | — | — |
| pincer | — | — | — | — | SAFE | SAFE | — | — | SAFE | — | — | — | SAFE | SAFE | — | — | — | — | SAFE | — |
| crossfire | — | — | — | — | SAFE | GOOD | — | — | — | — | SAFE | — | — | SAFE | SAFE | SAFE | — | — | — | — |
| hunter | — | — | — | — | — | SAFE | SAFE | — | — | GOOD | — | — | SAFE | SAFE | — | — | — | — | — | — |
| bait | — | — | — | — | — | — | — | — | GOOD | — | — | — | SAFE | — | — | — | — | SAFE | — | — |
| sniper_denial | — | — | — | — | — | — | — | SAFE | — | — | — | — | — | — | — | SAFE | — | — | — | — |
| swarm | SAFE | — | SAFE | SAFE | SAFE | SAFE | — | — | — | — | — | — | — | SAFE | — | — | — | — | SAFE | — |
| false_rec | — | — | — | — | — | — | SAFE | — | SAFE | SAFE | — | — | — | — | — | — | — | — | — | — |
| layered | — | — | — | — | — | SAFE | SAFE | SAFE | SAFE | — | — | SAFE | — | — | — | — | — | — | — | — |
| collapsing | — | — | — | — | — | — | — | SAFE | — | — | — | — | — | — | — | — | — | — | — | — |
| rot_cross | — | — | — | — | — | — | — | SAFE | — | — | SAFE | — | — | — | — | — | — | — | — | — |
| corridor | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| counter | — | — | — | — | — | — | — | — | — | SAFE | — | — | — | — | — | — | — | — | — | — |
| prelude | — | SAFE | — | — | — | — | SAFE | — | — | — | — | SAFE | — | — | — | — | — | — | — | — |
| fortress | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |

**Key**: `GOOD` = strong pairing, `SAFE` = acceptable, `—` = avoid (too similar or incompatible pacing)

---

## 6. ELIMINATED CATEGORIES

These categories from audit are REMOVED:

| Old Category | Reason for Removal | Replacement |
|-------------|-------------------|-------------|
| `RANDOM` | No tactical identity. Math.random() composition. | Replaced by specific tactical type based on stage/level. |
| `MIXED` | Vague. Everything is "mixed." | Replaced by `TAC_swarm_anchor`, `TAC_dual_role`, or `ADV_layered_pressure`. |
| `UNDEFINED` | 8/15 non-boss waves had this. | Every wave now gets explicit tactical label. |
| `MONOCULTURE` (tanks, kamikazes) | Single archetype = boring after 5s. | Reworked as `TAC_hunter_dive` (tanks) and `TAC_flanking_pursuit` (kamikazes) with supporting cast. |

---

*End of HC-WC-02A — Wave Taxonomy*
