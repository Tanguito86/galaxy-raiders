# HC-WC-02D — Wave Classification: All 20 Levels

> **Sprint**: HC-WC-02
> **Document**: D — Level-by-Level Reclassification
> **Date**: 2026-05-19
> **Status**: Draft
> **Depends on**: HC-WC-01, HC-WC-02A, HC-WC-02B, HC-WC-02C

---

## 1. CLASSIFICATION METHOD

Each level is classified by:
1. **Tactical Category** — From HC-WC-02A taxonomy
2. **Composition** — Exact role counts (replacing `getEnemyTypeForRow()` + `Math.random()`)
3. **Formation** — Silhouette with tactical meaning
4. **Phase Plan** — INTRO/BUILD/PEAK/RESOLVE timing
5. **Identity** — Recognizable label the player can learn

Levels marked **BOSS** (5,10,15,19,20) are outside HC-WC scope for this sprint but listed for context.

---

## 2. COMPLETE LEVEL MAP

### STAGE 1 — "First Contact" (Levels 1-5)

---

### Level 1 — FIRST CONTACT

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `FND_tutorial` — Tutorial Pressure |
| **Tactical Label** | — | "FIRST CONTACT" |
| **Composition** | 40x random (getEnemyTypeForRow) | 8x sweeper (alien1) + 2x baiter (alien_mini) |
| **Formation** | classic 5×8 grid | Classic Grid (compressed to 2 rows, wide spacing) |
| **INTRO** | None | 1500ms — enemies slide in, no fire |
| **BUILD** | None | 3000ms — sweepers activate, baiters visible but dormant |
| **PEAK** | Instant | 2500ms — sweepers fire fan, baiters join |
| **RESOLVE** | None | Last 3 enemies: only sweepers |
| **Identity** | Forgettable grid | Clear tutorial — low threat, teaches basic reading |
| **Skill Taught** | Nothing specific | Horizontal dodging, formation reading |
| **Enemy Count** | 40 | 10 |
| **Notes** | Massive overcount (40 enemies at level 1). Current is harder than level 2. | Much lighter. This is a tutorial, not a challenge. |

---

### Level 2 — VANGUARD LINE

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `FND_formation_reading` — Formation Reading |
| **Tactical Label** | — | "VANGUARD LINE" |
| **Composition** | 30x mixed | 6x sweeper + 4x sniper + 2x baiter |
| **Formation** | V-shape (5x6 staggered) | V-Shape (arrow pointing down — intended message: "pressure from above") |
| **INTRO** | None | 1200ms — V-shape visible, no fire |
| **BUILD** | None | 3500ms — sweepers → snipers (staggered 1500ms apart) |
| **PEAK** | Instant | Until 40% remain — snipers + sweepers both active |
| **RESOLVE** | None | Last 5 enemies: sweepers only |
| **Identity** | Forgettable grid | Distinctive V silhoueta, first dual-role exposure |
| **Skill Taught** | None | Reading formation shape, dual threat types |
| **Enemy Count** | 30 | 12 |
| **Notes** | V-shape invisible under lateral drift. | V-shape must hold position longer. Reduced lateral drift speed for formation-reading waves. |

---

### Level 3 — PINCER ASSAULT

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | SETPIECE (existing) | `TAC_pincer` — Pincer Assault (setpiece) |
| **Tactical Label** | "PINCER ASSAULT" | "PINCER ASSAULT" (kept) |
| **Composition** | 24x alien4 + 4x alien2 + 1x alien3 | 8x flanker (alien6) + 4x sniper (alien2) + 2x diver (alien3) + 4x sweeper (alien1) |
| **Formation** | Hand-authored pincer | Pincer (enhanced: clear center corridor) |
| **INTRO** | 2200ms (existing) | 2000ms — wings slide in from edges |
| **BUILD** | Staggered entry | 4000ms — sweepers → flankers → snipers |
| **PEAK** | Until clear | Until 30% — snipers + flankers + divers coordinated |
| **RESOLVE** | None | Last 5 enemies: sweepers only, dives stop |
| **Identity** | Strong setpiece | Enhanced with micro-phases, clearer center lane |
| **Existing Issues** | Alien4 (suppressor) + alien2 (sniper) in pincer = crossfire trap, not pincer feel | Flankers create true pincer feel from edges. Divers add vertical threat. |
| **Changes** | — | Replace alien4→alien6 (flanker). Add phases. |

---

### Level 4 — IRON APPROACH (Prelude to CrabTron)

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `MONOCULTURE` / special 'tanks' | `SET_boss_prelude` — Boss Prelude |
| **Tactical Label** | — | "IRON APPROACH" |
| **Composition** | 15x alien3 (all tanks) | 6x sweeper + 3x baiter + 1x anchor (alien3, anchor mode) |
| **Formation** | 3×5 grid | Loose arc — "something big is coming" |
| **INTRO** | None | 1200ms — enemies descend slowly, anchor visible first |
| **BUILD** | None | 3000ms — sweepers + baiters activate, anchor dormant (menacing) |
| **PEAK** | Instant | 2000ms — anchor pulses (no fire), creates tension |
| **RESOLVE** | None | Last 3 enemies: sweepers only |
| **Relief** | Standard 900ms → boss | 600ms silence → "CRABTRON INCOMING" → boss entry |
| **Identity** | Monoculture tank grid | Tension builder. Anchor telegraphs boss aesthetic. |
| **Skill Taught** | None (monotonous) | Reading prelude tension, anchor visual language |
| **Enemy Count** | 15 | 10 |
| **Notes** | All alien3 = boring after 5s. | Prelude is low-threat, high-atmosphere. |

---

### Level 5 — CRABTRON

| Field | Value |
|-------|-------|
| **Category** | BOSS |
| **Boss** | CRABTRON — Pattern: crossfire |
| **HC-WC Scope** | Out of scope. Boss system unchanged. |

---

### STAGE 2 — "Rising Pressure" (Levels 6-10)

---

### Level 6 — REGROUP

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `FND_recovery_breather` — Recovery Breather |
| **Tactical Label** | — | "REGROUP" |
| **Composition** | 18x mixed (diamond formation) | 5x sweeper + 1x baiter + UFO |
| **Formation** | Diamond (2-4-6-4-2) | Sparse Line (1 row, wide gaps). Diamond too dense for relief. |
| **INTRO** | None | 1000ms — slow fade in |
| **BUILD** | None | 2000ms — sweepers activate, very slow fire |
| **PEAK** | Instant | None — this IS the breather (no peak) |
| **RESOLVE** | None | All enemies at low HP, easy to clear |
| **Identity** | Forgettable post-boss | Clear recovery window. Guaranteed power-up. |
| **Relief** | This IS relief | 1500ms silence after clear (extra rest) |
| **Enemy Count** | 18 | 6 |
| **Notes** | Post-boss needs to be calming, not another fight. | Intentional low pressure. Player earned this. |

---

### Level 7 — FORTRESS LINE

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | SETPIECE (existing) | `SET_fortress_breach` — Fortress Breach |
| **Tactical Label** | "FORTRESS LINE" | "FORTRESS LINE" (kept) |
| **Composition** | 5x alien3 + 7x alien2 + 7x alien1 + 5x alien2 | 3x blocker (alien3, blocker mode) + 4x sniper + 6x sweeper + 2x suppressor |
| **Formation** | 4 horizontal rows | Wall (stacked rows with gaps between columns) |
| **INTRO** | 2200ms (existing) | 2000ms — rows appear one by one from top |
| **BUILD** | Staggered | 5000ms — row 1 activates → row 2 enters → row 1 suppresses → etc. |
| **PEAK** | Until clear | Until 30% — all rows at full fire, row volleys alternating |
| **RESOLVE** | None | Last row: sweepers only |
| **Identity** | Strong structure | Enhanced: blockers give "wall" feel. Rows have distinct roles. |
| **Existing Issues** | Row fire all uses `pickVolleyShooters()` | Add per-row role identity. Top row = blocker wall. Row 2 = snipers. Row 3 = sweepers. Row 4 = suppressors. |
| **Changes** | — | Replace alien3→blocker mode (no diving). Add per-row identity. |

---

### Level 8 — HUNTING PACK

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `MONOCULTURE` / special 'kamikazes' | `TAC_bait_punish` — Bait & Punish |
| **Tactical Label** | — | "HUNTING PACK" |
| **Composition** | 28x alien5 (all chasers) | 5x baiter (alien_mini) + 3x chaser (alien5) + 4x sweeper |
| **Formation** | 4×7 grid | Scatter — baiters scattered, chasers on flanks |
| **INTRO** | None | 1200ms — baiters appear, erratic movement |
| **BUILD** | None | 3000ms — baiters fire → chasers enter from edges (BURST_IN) |
| **PEAK** | Instant | Until 40% — baiters distract, chasers strike |
| **RESOLVE** | None | Chasers eliminated first. Baiters remain (easy clear). |
| **Identity** | Monoculture chaser grid | Predator-prey dynamic. Baiters telegraph chaser strikes. |
| **Skill Taught** | None | Target prioritization (chasers > baiters) |
| **Enemy Count** | 28 | 12 |
| **Notes** | 28 identical enemies = boring. | Curated mix with tactical rhythm. Chaser count reduced (max 2 active per HC-WC rules). |

---

### Level 9 — DIVISION BREACH

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `TAC_lane_denial` — Lane Denial |
| **Tactical Label** | — | "DIVISION BREACH" |
| **Composition** | 35x random (zigzag) | 3x suppressor (alien4, right side) + 5x sweeper + 3x sniper + 2x baiter |
| **Formation** | Zigzag (5x7 offset) | Column — right column suppressors, left/center open |
| **INTRO** | None | 1200ms — suppressors visible first on right |
| **BUILD** | None | 3500ms — sweepers → suppressors telegraph → sniper enter from left |
| **PEAK** | Instant | Until 40% — right lane denied, left lane open |
| **RESOLVE** | None | Suppressors eliminated. Remaining enemies in open lanes. |
| **Identity** | Forgettable zigzag | Clear lane-denial puzzle. First suppressor introduction. |
| **Skill Taught** | None | Lane reading, identifying denied zone |
| **Enemy Count** | 35 | 13 |
| **Notes** | 35 enemies with Math.random() = composition lottery. | Curated. Right side dangerous, left side safe. Teaches lane awareness for stage 3. |

---

### Level 10 — SERPENTRIX

| Field | Value |
|-------|-------|
| **Category** | BOSS |
| **Boss** | SERPENTRIX — Pattern: zigzag |
| **HC-WC Scope** | Out of scope. Boss system unchanged. |

---

### STAGE 3 — "Tactical Pressure" (Levels 11-15)

---

### Level 11 — RECONSTRUCTION

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `FND_recovery_breather` — Recovery Breather |
| **Tactical Label** | — | "RECONSTRUCTION" |
| **Composition** | ~40x mixed (classic) | 6x sweeper + 2x baiter + UFO + guaranteed power-up |
| **Formation** | Classic 5×8 grid | Sparse Line (1 row, 8 wide) |
| **Identity** | Forgettable post-boss grid | Recovery. Player rests after Serpentrix. |
| **Enemy Count** | ~40 | 8 |
| **Notes** | 40 enemies right after boss = exhausting. | Very light. Reward-rich. Builds goodwill for stage 3. |

---

### Level 12 — KAMIKAZE RUSH

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | SETPIECE (existing) | `SET_kamikaze_rush` — Kamikaze Rush (setpiece) |
| **Tactical Label** | "KAMIKAZE RUSH" | "KAMIKAZE RUSH" (kept) |
| **Composition** | 8x alien5 + 6x alien4 + 5x alien5 + 6x alien2 | 4x chaser (alien5) + 4x baiter (alien_mini) + 3x sweeper + 2x sniper |
| **Formation** | Hand-authored 4-row | Scatter → pincer hybrid |
| **INTRO** | 2200ms (existing) | 1800ms — baiters + sweepers visible |
| **BUILD** | Staggered entry | 4000ms — baiters/sweepers → snipers → chasers burst from edges |
| **PEAK** | Until clear | 3 dive waves of chasers (2 per wave), 2500ms gap |
| **RESOLVE** | None | Chaser waves exhausted. Baiters remain. |
| **Identity** | Strong setpiece | Enhanced: chaser waves staggered, baiters telegraph each wave |
| **Changes** | — | Add wave structure to flat setpiece. Reduce sniper count. |

---

### Level 13 — RESPITE

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `FND_recovery_breather` — Recovery Breather |
| **Tactical Label** | — | "RESPITE" |
| **Composition** | ~18x mixed (diamond) | 5x sweeper + 2x baiter + UFO |
| **Formation** | Diamond | Diamond (actual diamond — use the visual here, it's the prettiest formation for relief) |
| **Identity** | Forgettable | Post-setpiece relief. Diamond as visual treat. |
| **Enemy Count** | ~18 | 7 |

---

### Level 14 — OMINOUS CALM (Prelude to Orbital)

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `SET_boss_prelude` — Boss Prelude |
| **Tactical Label** | — | "OMINOUS CALM" |
| **Composition** | ~35x mixed (zigzag) | 5x sweeper + 3x baiter + 2x swarm (alien1, light mode) |
| **Formation** | Zigzag | Loose arc with central gap — "Orbital is watching" |
| **INTRO** | None | 1500ms — enemies drift in slowly, cyan palette tint |
| **BUILD** | None | 2500ms — minimal fire, atmospheric |
| **PEAK** | None | 1500ms — brief activation spike |
| **RESOLVE** | None | Quick clear |
| **Identity** | Forgettable | Orbital prelude. Satellite-like formation. Cyan color theme. |
| **Enemy Count** | ~35 | 10 |
| **Notes** | Pre-boss wave should build anticipation, not exhaust. | Atmospheric. "APPROACHING: ORBITAL" banner 3000ms before end. |

---

### Level 15 — ORBITAL

| Field | Value |
|-------|-------|
| **Category** | BOSS |
| **Boss** | ORBITAL — Pattern: rotate |
| **HC-WC Scope** | Out of scope. Boss system unchanged. |

---

### STAGE 4 — "Endgame" (Levels 16-20)

---

### Level 16 — SPLITTER STORM

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | SETPIECE (existing) | `SET_splitter_storm` — Splitter Storm (setpiece) |
| **Tactical Label** | "SPLITTER STORM" | "SPLITTER STORM" (kept) |
| **Composition** | 6x alien6 + 7x alien2 + 6x alien6 + 7x mixed | 6x flanker (alien6) + 3x sweeper + 3x baiter + 2x sniper |
| **Formation** | Hand-authored 4-row | Column (3 columns, flankers in outer, snipers center) |
| **INTRO** | 2200ms (existing) | 1800ms — formation settles |
| **BUILD** | Staggered | 4000ms — sweepers → flankers → snipers |
| **PEAK** | Until clear | Until 30% — flanker kills → split → mini aliens (escalation) |
| **RESOLVE** | None | Split mini-aliens cleared |
| **Identity** | Strong concept, underused split mechanic | Enhanced: splits are the star. Mini-aliens create density spike that then resolves. |
| **Changes** | — | Add split escalation clarity. Mini-aliens distinct color. |
| **Fairness Note** | Splits mid-wave without warning | Add pre-split flash on flankers at 25% HP. |

---

### Level 17 — LAST LINE

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | `UNDEFINED` / normal | `ADV_collapsing_lane` — Collapsing Lane |
| **Tactical Label** | — | "LAST LINE" |
| **Composition** | ~30x mixed (vshape) | 4x suppressor + 6x sweeper + 2x flanker |
| **Formation** | V-shape | Gate — two walls closing inward |
| **INTRO** | None | 1200ms — walls visible at edges, wide center |
| **BUILD** | None | 4000ms — walls active, center lane starts wide → narrows |
| **PEAK** | Instant | Until 40% — lane at minimum (64px). Intense pressure both sides. |
| **RESOLVE** | None | Lane reopens to full width. Remaining enemies easy pickings. |
| **Identity** | Forgettable vshape | Penultimate non-boss wave. Dramatic arena constriction. |
| **Skill Taught** | None | Precision movement in narrowing corridor |
| **Enemy Count** | ~30 | 12 |
| **Notes** | V-shape is anticlimactic for level 17. | Collapsing lane is climactic. Feels like a setpiece without being one. |

---

### Level 18 — IMPERIAL GUARD

| Field | Old Value | New HC-WC Value |
|-------|-----------|-----------------|
| **Category** | SETPIECE (existing) | `SET_imperial_guard` — Imperial Guard (setpiece) |
| **Tactical Label** | "IMPERIAL GUARD" | "IMPERIAL GUARD" (kept) |
| **Composition** | 4x alien3 + 6x alien6 + 7x alien2 + 8x mixed | 2x anchor (alien3, anchor mode) + 5x sniper + 4x flanker + 3x sweeper |
| **Formation** | Hand-authored 4-row | Wall (fortress-like, elite composition) |
| **INTRO** | 2200ms (existing) | 2200ms — rows descend in formation (kept) |
| **BUILD** | Staggered entry | 5000ms — full crossfire volley sequence |
| **PEAK** | Until clear | Until 25% — dual-burst crossfire, anchors in center |
| **RESOLVE** | None | Last row: sweepers only |
| **Identity** | Strongest setpiece | Enhanced with anchors for center gravity. Crossfire from edges. Burst phases preserved. |
| **Changes** | Minor | Replace alien3 divers → anchors. This is a fortress, not a dive wave. |
| **Notes** | Already the best-designed setpiece. | Preserve what works. Enhance with anchor identity and phase structure. |

---

### Level 19 — TENIENTE

| Field | Value |
|-------|-------|
| **Category** | BOSS |
| **Boss** | TENIENTE — Pattern: divebomb |
| **HC-WC Scope** | Out of scope. Boss system unchanged. |
| **Note** | Level 18 Imperial Guard already serves as prelude. Perfect. |

---

### Level 20 — EMPERADOR

| Field | Value |
|-------|-------|
| **Category** | BOSS (Final) |
| **Boss** | EMPERADOR — Pattern: supreme |
| **HC-WC Scope** | Out of scope. Boss system unchanged. |
| **Note** | Level 19 Teniente serves as prelude. "THE THRONE AWAITS" flavor at end of Teniente fight. |

---

## 3. CLASSIFICATION SUMMARY

### 3.1 Category Distribution

| Category | Levels | Count |
|----------|--------|-------|
| `FND_tutorial` | 1 | 1 |
| `FND_formation_reading` | 2 | 1 |
| `FND_recovery_breather` | 6, 11, 13 | 3 |
| `TAC_pincer` | 3 | 1 |
| `TAC_bait_punish` | 8 | 1 |
| `TAC_lane_denial` | 9 | 1 |
| `ADV_collapsing_lane` | 17 | 1 |
| `SET_boss_prelude` | 4, 14 | 2 |
| `SET_fortress_breach` | 7 | 1 |
| `SET_kamikaze_rush` | 12 | 1 |
| `SET_splitter_storm` | 16 | 1 |
| `SET_imperial_guard` | 18 | 1 |
| `BOSS` | 5, 10, 15, 19, 20 | 5 |

### 3.2 Old → New Mapping

| Old Category | Levels Affected | New Category |
|-------------|----------------|--------------|
| `UNDEFINED` / normal | 1 | `FND_tutorial` |
| `UNDEFINED` / normal | 2 | `FND_formation_reading` |
| SETPIECE | 3 | `TAC_pincer` (enhanced) |
| `MONOCULTURE` / tanks | 4 | `SET_boss_prelude` |
| `UNDEFINED` / normal | 6 | `FND_recovery_breather` |
| SETPIECE | 7 | `SET_fortress_breach` (enhanced) |
| `MONOCULTURE` / kamikazes | 8 | `TAC_bait_punish` |
| `UNDEFINED` / normal | 9 | `TAC_lane_denial` |
| `UNDEFINED` / normal | 11 | `FND_recovery_breather` |
| SETPIECE | 12 | `SET_kamikaze_rush` (enhanced) |
| `UNDEFINED` / normal | 13 | `FND_recovery_breather` |
| `UNDEFINED` / normal | 14 | `SET_boss_prelude` |
| SETPIECE | 16 | `SET_splitter_storm` (enhanced) |
| `UNDEFINED` / normal | 17 | `ADV_collapsing_lane` |
| SETPIECE | 18 | `SET_imperial_guard` (enhanced) |

### 3.3 Resolution

| Metric | Before HC-WC | After HC-WC |
|--------|-------------|-------------|
| Waves with UNDEFINED category | 8 (53%) | 0 (0%) |
| Waves with RANDOM composition | 5 | 0 |
| Waves with clear tactical identity | 7 (47%) | 15 (100%) |
| Waves with micro-structure | 5 (setpieces only) | 15 (all non-boss) |
| Waves with designed relief | 0 | 6 (breathers + preludes) |
| Waves with boss prelude | 0 | 2 (levels 4, 14) |
| Monoculture waves | 2 | 0 |
| Average enemies per non-boss wave | 27 | 11 |
| Total enemies per run (non-boss) | 346 | 137 |
| Forgotten wave count | 8 | 0 |

### 3.4 Intentional Reduction

Enemy count drops from ~346 to ~137 across non-boss levels. This is by design:

- **Less is more**. 40 enemies doing the same thing is noise. 10 enemies with distinct roles is an encounter.
- **Fewer enemies = clearer roles**. Each enemy matters. Player reads composition.
- **Reduced density = improved readability**. HC-RD benefits directly.
- **Performance win**. Fewer entities, fewer collision checks, smoother framerate.
- **Difficulty is in composition, not count**. Coordinated 3-archetype wave at level 9 is harder than 35 random enemies at level 9.

---

## 4. COMPATIBILITY VERIFICATION

### 4.1 Encounter Director Compatibility

| Concern | Status |
|---------|--------|
| Role caps still enforced? | YES — HC-WC caps are stricter than director caps. Director still gates. |
| Silence windows preserved? | YES — HC-WC adds phase relief, never removes silence. |
| Pressure computation unchanged? | YES — `computeTargetPressure()` reads alive enemies. Composition changes affect input but not algorithm. |
| Personality system conflict? | NONE — HC-WC replaces personality with wave type. Can feed wave type INTO personality for bias compatibility. |

### 4.2 Pattern Director Compatibility

| Concern | Status |
|---------|--------|
| Threat budget still audited? | YES — HC-WC compositions stay within budget. HC-PD validates. |
| Pattern overlap still gated? | YES — HC-WC adds inter-archetype gaps. HC-PD can still recommend delays. |
| Density caps respected? | YES — HC-WC density caps (30 peak) align with HC-PD (40). |

### 4.3 Hitbox Fairness Compatibility

| Concern | Status |
|---------|--------|
| Spawn positions safe? | YES — All enemies spawn top zone (50-180px). Player at bottom. |
| Escape lane always exists? | YES — Every wave type defines lane rules. Minimum 64px. |
| Bullet fairness validated? | YES — `validateBulletFairness()` still runs per bullet. |

### 4.4 Engine Compatibility

| Concern | Status |
|---------|--------|
| New entities needed? | NO — All roles use existing sprites (alien1-6, mini). |
| New rendering needed? | NO — Spawn flash, telegraphs, bullets unchanged. |
| New collision needed? | NO — Same AABB/circle collision. |
| New AI needed? | MINIMAL — Anchor/blocker/swarm are behavior overlays, not new AI. |
| File load order change? | NO — New `hc-wc-wave-identity.js` loads after `enemy-identity.js`, before `update-enemies.js`. |

---

*End of HC-WC-02D — Wave Classification*
