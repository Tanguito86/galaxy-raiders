# HC-LIVE-SPRITE-01 — LIVE VALIDATION OF SPRITE LAB ENCOUNTER VISUALS

**Phase:** HC-LIVE (post Sprite Lab freeze)
**Status:** Validation Framework — No Code Changes
**Date:** 2026-05-25
**Dependencies:** HCV-FREEZE-01 (encounter visual freeze), HC-WIRE-03 (boss visual freeze), HC-CAL-FREEZE (calibration lock)

---

## 1. VALIDATION SCOPE

### Visual Systems Under Test

| System | Level Appears | What to Validate |
|---|---|---|
| CRABTRON hero layered sprite | 5 | 7-layer z-order clarity, state transitions, claw motion readability |
| Imperial Flagship / EMPERADOR | 20 | 3-phase visual escalation, HP-gate phase switching, bullet visibility behind flagship |
| Mini-boss prelude silhouettes | 5, 10, 15, 19, 20 | Are they mistaken for entities? Do they distract from WARNING text? |
| Faction Scout sprites | 1-20 | 128x128 scaled to 64px — readable under bullet density? |
| Faction Suppressor sprites | 1-20 | Red-orange vs bullet red — color conflict? |
| Faction Splitter sprites | 1-20 | Magenta — visible on dark backgrounds? |
| Boss telegraphs (all 5) | 5, 10, 15, 19, 20 | Do new sprites obscure telegraph rings/lines? |
| Legacy fallback rendering | All (kill switch off) | Identical to pre-sprite-lab? |

### NOT Under Test (Frozen — No Changes)

- Hitboxes / collision detection
- Boss HP / damage values
- Attack patterns / bullet counts
- AI movement
- Rank scaling
- Spawn logic
- Score / medal systems

---

## 2. PLAYER PROFILES

### Profile A: Survival Player
**Description:** Plays to survive. Does not engage with score systems. Avoids risk. Dies to bosses, not waves.
**Key observation:** Does CRABTRON hero look "scarier" and cause earlier deaths? Does Flagship phase change communicate "danger escalation"?

### Profile B: Score Player
**Description:** Maximizes score. Reads all HUD elements. Engages with greed systems. Knows what medals are.
**Key observation:** Do prelude silhouettes distract during greedy medal collection? Does Flagship core_exposed phase communicate "damage window"?

### Profile C: Mid-Skill Casual Player
**Description:** Reaches level 8-12. Dies to mid-game pressure. Does not reach final bosses.
**Key observation:** Do faction sprites improve enemy recognition? Is readability better or worse than legacy pixel art?

### Profile D: Hardcore / Veteran Player
**Description:** Reaches level 15+. Knows boss patterns. Speedruns or score-runs.
**Key observation:** Does Flagship phase transition feel natural? Does CRABTRON hero layered animation add or subtract from pattern readability?

---

## 3. SESSION PROTOCOL

### Pre-Session

| Step | Action |
|---|---|
| 1 | Verify build: `npm run validate` passes |
| 2 | Verify all 34 sprites load (Chrome MCP quick check) |
| 3 | Record kill switch state: all default `true` |
| 4 | Start screen capture + audio |
| 5 | Briefing: standard HC-LIVE-03A protocol — no coaching, no priming |

### During Session — Visual-Specific Observations

| ✅ Observe | What to Note |
|---|---|
| **CRABTRON hero visibility** | Can player see the boss clearly behind hero layers? |
| **Flagship phase recognition** | Does player react to phase change? Or is it invisible? |
| **Silhouette confusion** | Does player fire at / dodge the prelude silhouette? |
| **Faction readability** | Can player distinguish Scout vs Suppressor vs Splitter at a glance? |
| **Bullet/boss overlap** | Do player bullets disappear behind boss sprite? Do enemy bullets vanish? |
| **Telegraph clarity** | Are boss telegraph rings visible behind Flagship/hero sprites? |
| **Visual fatigue** | After 10+ minutes, does player squint? Lean back? Lose track of bullets? |
| **Death cause clarity** | When player dies, can they identify what killed them? Or was it "invisible"? |
| **Peripheral vision** | During heavy bullet patterns, is boss position still readable from peripheral? |

### Post-Session — Visual-Specific Questions

| Question | Purpose |
|---|---|
| "Did you notice the boss changing appearance?" | Phase recognition — Flagship/CRABTRON |
| "Did you see the shadow creature before the boss warning?" | Silhouette recognition |
| "Could you tell which enemies were dangerous from their appearance?" | Faction readability |
| "Did any visual effect make it hard to see bullets?" | Visual overload detection |
| "Did the giant boss at the end feel different from the earlier ones?" | Flagship tier differentiation |
| "Was there anything on screen that looked like a threat but wasn't?" | False telegraph / silhouette confusion |

---

## 4. FINDINGS CLASSIFICATION

### CRITICAL — Fix Immediately (Blocking)
- Sprites cause game crash or freeze
- Sprite loading failure breaks boss rendering (no fallback)
- Flagship/hero sprite completely obscures player bullets
- Prelude silhouette is shootable / collides with player
- Console errors spamming during boss encounters

### HIGH — Fix Before Next Release
- Bullet visibility significantly reduced behind sprites (>40% occlusion)
- Phase transition invisible to players (0/4 testers noticed)
- Silhouette mistaken for enemy by >1 tester
- Faction color conflicts with bullet color (red Suppressor vs red enemy bullets)
- Significant FPS drop during boss sprite draw (>5ms frame time increase)

### MEDIUM — Schedule for Polish Pass
- Silhouette alpha too high/low (either distracting or invisible)
- Flagship phase transition too subtle (50% testers noticed)
- Faction sprite scaling inconsistent across enemy types
- Fallback rendering noticeably worse than legacy in side-by-side

### POLISH — Low Priority
- Sprite pixel alignment at non-integer scales
- Minor alpha banding on tinted overlays
- Silhouette position slightly off-center
- Animation frame transitions not perfectly smooth

---

## 5. SPECIFIC TEST SCENARIOS

### Scenario 1: CRABTRON Hero Level 5 — First Boss Experience

| Step | Action | Observe |
|---|---|---|
| 1 | Start level 5 | Enemy clear → prelude starts |
| 2 | Prelude active | Silhouette visible? Distracting? |
| 3 | Boss spawns | Hero layers render instead of legacy body |
| 4 | Phase 1 attacks | Can see boss behind hero layers? |
| 5 | Boss takes damage | `mid_damage` state activates — visible flicker? |
| 6 | Phase 3 (rage) | Claw motion — distracting or immersive? |
| 7 | Boss death | `death_exposed_core` — readable collapse? |
| 8 | Kill switch off: `GALAXY_CONFIG.sprites.enabled = false` | Legacy CRABTRON renders normally? |

**Pass criteria:**
- Phase states visually distinguishable
- Bullet clarity maintained behind hero layers
- No console errors
- Kill switch restores legacy rendering

### Scenario 2: Imperial Flagship Level 20 — Endgame Boss

| Step | Action | Observe |
|---|---|---|
| 1 | Reach level 20 | Prelude silhouette: `imperial_command_lancer` |
| 2 | Boss spawns | Flagship `master` frame (full armor) |
| 3 | HP drops below 66% | `damaged` frame — visible armor break? |
| 4 | HP drops below 33% | `core_exposed` frame — visible core? |
| 5 | Dense bullet patterns | Can see bullets behind 256x256 sprite? |
| 6 | Kill switch: `spriteLab.imperialFlagship = false` | Legacy EMPERADOR renders normally? |
| 7 | Kill switch: `spriteLab.imperialFlagship = true` | Flagship restores? |

**Pass criteria:**
- All 3 phases visually distinct
- Phase transitions visible during combat
- Bullets legible behind Flagship
- Kill switch fully restores legacy EMPERADOR

### Scenario 3: Mini-Boss Prelude Silhouettes — All Boss Levels

| Step | Action | Observe |
|---|---|---|
| 1 | Reach level 5 prelude | `scout_hive_leader` silhouette visible? |
| 2 | Reach level 10 prelude | `suppressor_siege_core` silhouette visible? |
| 3 | Reach level 15 prelude | `splitter_aberrant_node` silhouette visible? |
| 4 | Reach level 19 prelude | `splitter_aberrant_node` silhouette visible? |
| 5 | Reach level 20 prelude | `imperial_command_lancer` silhouette visible? |
| 6 | Kill switch: `spriteLab.minibossPreludePreview = false` | All silhouettes disappear? |
| 7 | Kill switch: `spriteLab.minibossPreludePreview = true` | Silhouettes restore? |

**Pass criteria:**
- Silhouettes visible but not dominant (alpha 0.06-0.10)
- No player confuses silhouette for gameplay entity
- Silhouettes tinted to boss color (visual cohesion)
- Kill switch removes/re-adds instantly

### Scenario 4: Faction Readability Under Pressure

| Step | Action | Observe |
|---|---|---|
| 1 | Levels 1-4 (Scout density) | Scout sprites readable at 64px scale? |
| 2 | Levels 6-9 (Suppressor intro) | Suppressor sprites distinct from Scout? |
| 3 | Levels 11-14 (Splitter density) | Splitter magenta visible on dark background? |
| 4 | Heavy bullet patterns (>20 bullets) | Enemy sprites remain readable? |
| 5 | Kill switch: `spriteLab.factionScout = false` | Reverts to fleet_scout sprites? |

**Pass criteria:**
- Faction identity readable at gameplay distance
- Color differentiation works (blue = Scout, red = Suppressor, magenta = Splitter)
- Kill switch per faction restores legacy

---

## 6. TELEMETRY CAPTURE

### Per-Session Data

| Metric | Source | Purpose |
|---|---|---|
| Session duration | Timer | Baseline engagement |
| Levels reached | Screen observation | Skill bracket |
| Deaths per level | Screen observation | Difficulty curve |
| Boss deaths | Screen observation | Boss readability proxy |
| Visual confusion events | Observer notes | Count of "what killed me?" moments |
| Silhouette misidentification | Post-session question | 0 expected |
| Phase recognition rate | Post-session question | Target: 75%+ for Flagship phases |

### Aggregated Across Sessions

| Metric | Target |
|---|---|
| Silhouette confusion rate | 0% |
| Flagship phase recognition | >75% of testers notice at least 2 phases |
| CRABTRON state recognition | >50% notice visual changes |
| Bullet visibility complaint rate | <10% of deaths attributed to visual obstruction |
| Kill switch verification | 100% functional (all 15 switches) |
| Fallback rendering parity | 100% (legacy look identical with switches off) |

---

## 7. EXPECTED FINDINGS (Hypotheses)

| Hypothesis | Expected Result |
|---|---|
| H1: Prelude silhouettes will NOT be mistaken for entities | Confirmed if 0 confusion events |
| H2: Flagship phase transitions will be noticed by most players | Confirmed if >75% mention visual change |
| H3: CRABTRON hero layers will not reduce bullet clarity | Confirmed if <10% death attribution |
| H4: Faction sprites improve enemy recognition over legacy | Confirmed if testers express preference |
| H5: Flagship core_exposed phase signals "final damage window" | Confirmed if players go aggressive in phase 3 |
| H6: All 15 kill switches fully restore legacy rendering | Expected 100% — but verify |

---

## 8. ROLLBACK PLAN

If critical visual issues are found during live testing:

| Issue | Immediate Fix | Permanent Fix |
|---|---|---|
| CRABTRON hero obscures bullets | Set `_crabtronHeroReady = false` (temporary patch in console) | Reduce overlay alpha or add bullet priority layer |
| Flagship blocks bullets | `spriteLab.imperialFlagship = false` (kill switch) | Adjust sprite alpha or scale |
| Silhouettes distract | `spriteLab.minibossPreludePreview = false` (kill switch) | Reduce alpha or reposition |
| Any other visual bug | Corresponding kill switch → `false` | Fix in next HC-POLISH sprint |

**All rollbacks are reversible via kill switches. Zero gameplay changes required for rollback.**

---

## 9. SIGN-OFF CRITERIA

The Sprite Lab visual integrations pass live validation when:

- [ ] 4 sessions completed across 3+ player profiles
- [ ] 0 CRITICAL findings
- [ ] 0 HIGH findings related to bullet visibility
- [ ] Phase recognition >50% for Flagship
- [ ] Silhouette confusion rate = 0%
- [ ] All 15 kill switches verified functional
- [ ] `npm run validate` passes
- [ ] 0 runtime errors in console during sessions

**Once signed off:** Visual systems graduate from "FROZEN — awaiting validation" to "PRODUCTION — validated stable."

---

## 10. GIT REFERENCE

**Current frozen build:** `129cedd hc-roadmap-resume-01`
**Validation framework doc:** This file
**No code changes — observation protocol only.**
