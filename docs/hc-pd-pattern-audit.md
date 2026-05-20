# HC-PD-01 — Full Pattern Audit & Taxonomy

> **Sprint**: HC-PD-01
> **Date**: 2026-05-19
> **Status**: Audit Complete — Freeze Candidate Preparation
> **Depends on**: HC-RD (readability), HC-HB (hitbox), HC-ED (encounter director)
> **Objective**: Classify all patterns, detect redundancies/overlaps, prepare HC-PD composition layer.

---

## 1. PATTERN INVENTORY

### 1.1 BOSS HARDCORE PATTERNS (boss-patterns.js)

---

#### P-BOSS-01 — CrabTron Phase 1 Aimed Burst
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:307-322` |
| **Function** | `fireCrancktonHardcorePattern` |
| **Threat type** | PRECISION — aimed |
| **Intent** | Light aimed pressure toward player, introduces crossfire spread |
| **Density** | Low (3 bullets, spread 0.18 rad) |
| **Speed** | 3.2 * 0.85 ≈ 2.72 px/frame |
| **Telegraph** | None (phase 1 is soft already) |
| **Fairness** | GOOD — narrow cone, predictable |
| **Overlap risk** | LOW |
| **Escape lane impact** | Minimal — spread is tight |
| **Readability** | GOOD (color #ff8844) |
| **Identity** | "crossfire_a" — warm orange aimed cone |
| **Redundancy** | Similar to P-ENEMY-02 (sniper) but boss-scale |
| **Observations** | Solid intro pattern. Spread could be slightly wider to distinguish from basic fire. |

---

#### P-BOSS-02 — CrabTron Phase 2 Delayed Burst
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:324-350` |
| **Function** | `fireCrancktonHardcorePattern` |
| **Threat type** | PRECISION + RHYTHM — delayed aimed |
| **Intent** | Multi-wave aimed pressure at staggered intervals |
| **Density** | Low (3 waves × 1 bullet, 100ms apart) |
| **Speed** | ≈3.2 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('phase2_burst', 420)` — expanding ring, color #ff6655 |
| **Fairness** | GOOD — delays are generous, single bullet per wave |
| **Overlap risk** | LOW |
| **Escape lane impact** | Minor — aimed at player, micro-tap dodge suffices |
| **Readability** | GOOD (telegraph ring + same origin) |
| **Identity** | "crossfire_b" — aggressive red delayed shot |
| **Redundancy** | Resembles Serpentrix P2 aimed burst. See redundancy R1. |
| **Observations** | The 420ms telegraph is long. setTimeout-based delays are fine but HC-HB-03 queues could replace them. |

---

#### P-BOSS-03 — CrabTron Phase 3 Radial Ring
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:352-376` |
| **Function** | `fireCrancktonHardcorePattern` |
| **Threat type** | SPACE CONTROL — radial ring |
| **Intent** | Area denial ring that periodically snaps toward player |
| **Density** | Medium (8-14 bullets in ring) |
| **Speed** | 3.2 * 0.78 ≈ 2.5 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('phase3_radial', 500)` + pulse secondary ring |
| **Fairness** | GOOD — ring is sparse at 8 bullets, gaps are navigable |
| **Overlap risk** | MEDIUM when combined with boss dash movement |
| **Escape lane impact** | Gap-based — player reads ring angle |
| **Readability** | GOOD (orange ring #ff9944) |
| **Identity** | Radial area denial + player snap (every 3rd volley) |
| **Redundancy** | Unique among bosses — only CrabTron uses ring-volley hybrid |
| **Observations** | Snap angle uses `toPlayer - PI/2` which can feel unpredictable. Consider adding snap-telegraph. |

---

#### P-BOSS-04 — Serpentrix Phase 1 Fan
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:428-441` |
| **Function** | `updateSerpentrixHardcorePattern` |
| **Threat type** | PRESSURE — wide fan |
| **Intent** | Wide downward fan covering lower screen |
| **Density** | Medium (5 bullets, spread 1.5 rad total) |
| **Speed** | 2.8 * 0.88 ≈ 2.46 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('serpent_burst', 220)` |
| **Fairness** | GOOD — wide but sparse, navigable |
| **Overlap risk** | LOW |
| **Escape lane impact** | Gaps between fan rays |
| **Readability** | GOOD (green #44dd44) |
| **Identity** | Serpent-themed green downward fan |
| **Redundancy** | Similar to P-ENEMY-06 (sweeper fan) but boss-scale. See redundancy R2. |
| **Observations** | Could use more identity — green fan is mechanically identical to sweeper fan scaled up. |

---

#### P-BOSS-05 — Serpentrix Phase 2 Alternating (Aimed + Mines)
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:443-494` |
| **Function** | `updateSerpentrixHardcorePattern` |
| **Threat type** | PRECISION + SPACE CONTROL — aimed burst + area denial |
| **Intent** | Alternates between aimed multi-wave burst and mine deployment |
| **Density** | Medium (2 waves aimed + up to 6 mines) |
| **Speed** | Aimed: ≈2.8, Mines: 0.42 vy |
| **Telegraph** | YES — aimed: `serpent_burst` (380ms), mines: `serpent_mine` (300ms) |
| **Fairness** | GOOD — alternating rhythm gives recovery windows |
| **Overlap risk** | MEDIUM — mines + aimed bullets can converge if timing overlaps |
| **Escape lane impact** | Mines occupy vertical corridors; aimed shots demand lateral dodge |
| **Readability** | GOOD — distinct green palette |
| **Identity** | Hybrid: precision + persistent area denial |
| **Redundancy** | Unique among bosses. Only mine-deploying boss pattern. See positive identity note. |
| **Observations** | Strong identity. Mine cap of 6 is safe. Mine life of 10s is generous but appropriate. |

---

#### P-BOSS-06 — Serpentrix Phase 3 Arc Wave
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:497-519` |
| **Function** | `updateSerpentrixHardcorePattern` |
| **Threat type** | ESCALATION + PRESSURE — sinusoidal wave fan |
| **Intent** | Time-modulated fan that shifts laterally over time |
| **Density** | Medium-High (8-12 bullets) |
| **Speed** | 2.8 * 0.84 ≈ 2.35 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('serpent_arc', 450)` |
| **Fairness** | GOOD — sinusoidal pattern is deterministic, player can read the wave |
| **Overlap risk** | MEDIUM — wave can create pinch points at screen edges |
| **Escape lane impact** | Wave shifts over 0.18 rad amplitude — gaps move predictably |
| **Readability** | GOOD (green #22cc22) |
| **Identity** | Serpent-themed sinusoidal wave — unique |
| **Redundancy** | None — only time-modulated wave among bosses |
| **Observations** | Best identity pattern for Serpentrix. Could benefit from faster wave modulation for more visible rhythm. |

---

#### P-BOSS-07 — Orbital Phase 1 Player-Aimed Arc
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:562-582` |
| **Function** | `updateThirdBossHardcorePattern` |
| **Threat type** | PRECISION — aimed arc |
| **Intent** | Wide arc centered on player direction |
| **Density** | Medium (6 bullets, span 2.4 rad) |
| **Speed** | 2.6 * 0.78 ≈ 2.03 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('orbital_arc', 340)` |
| **Fairness** | GOOD — wide arc but low bullet count |
| **Overlap risk** | LOW |
| **Escape lane impact** | Player can move perpendicular to arc direction |
| **Readability** | GOOD (blue #5588ee) |
| **Identity** | "orbital_arc" — blue aimed arc |
| **Redundancy** | Similar aimed-arc concept to CrabTron P1 but different span/color. See redundancy R3. |
| **Observations** | 2.4 rad span at 6 bullets gives ~0.48 rad gaps — generous. |

---

#### P-BOSS-08 — Orbital Phase 2 Alternating Side Arcs
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:585-613` |
| **Function** | `updateThirdBossHardcorePattern` |
| **Threat type** | PRECISION + RHYTHM — alternating side aimed |
| **Intent** | Narrow arcs that alternate left/right of player direction |
| **Density** | Low (4 bullets, span 0.52 rad) |
| **Speed** | 2.03 * 0.88 ≈ 1.79 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('orbital_arc', 380)` |
| **Fairness** | GOOD — narrow cone, direction alternates predictably |
| **Overlap risk** | LOW |
| **Escape lane impact** | Minor — tight cone is dodgeable with micro-movement |
| **Readability** | GOOD (blue #4477dd) |
| **Identity** | Alternating side-lock — unique rhythm |
| **Redundancy** | None — alternating side mechanic is distinct |
| **Observations** | Elegant pattern. The alternating `_orbitalArcSide` creates a readable rhythm. |

---

#### P-BOSS-09 — Orbital Phase 3 Dual Opposite Arcs
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:615-654` |
| **Function** | `updateThirdBossHardcorePattern` |
| **Threat type** | SPACE CONTROL + ESCALATION — rotating dual arcs |
| **Intent** | Two opposite-facing arcs that rotate continuously |
| **Density** | Medium (4+4 = 8 bullets) |
| **Speed** | ≤3.2 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('orbital_arc', 420)` |
| **Fairness** | MEDIUM — rotating arcs create moving walls; gaps change rapidly |
| **Overlap risk** | MEDIUM — opposite arcs can converge at screen edges |
| **Escape lane impact** | Two 0.48 rad gaps rotating — player must track rotation |
| **Readability** | GOOD (blue #3366ff) |
| **Identity** | Rotating dual-wall — distinct and memorable |
| **Redundancy** | Unique — no other boss uses opposite rotating arcs |
| **Observations** | Strong identity for Orbital. The 0.32 rad/frame rotation speed is well-tuned. |

---

#### P-BOSS-10 — Teniente Phase 1 Downward Column
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:707-733` |
| **Function** | `updateFourthBossHardcorePattern` |
| **Threat type** | PRECISION — aimed column |
| **Intent** | Narrow downward column biased toward player, clamped to downward cone |
| **Density** | Low (3 bullets, spread 0.32 rad) |
| **Speed** | 2.2 * 0.94 ≈ 2.07 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('teniente_dive', 380)` |
| **Fairness** | GOOD — angle is clamped to downward cone (PI/2 ± 0.55) |
| **Overlap risk** | LOW |
| **Escape lane impact** | Minor — narrow cone, side-dodge sufficient |
| **Readability** | GOOD (red #ff5533) |
| **Identity** | "teniente_dive" — red aimed column with downward bias |
| **Redundancy** | Similar to Emperador P1 spread but tighter. See redundancy R4. |
| **Observations** | Clamped angle prevents horizontal aimed spam. Good design. Speed is tuned low — good for readability. |

---

#### P-BOSS-11 — Teniente Phase 2 Dual Column (Center + Lane)
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:735-779` |
| **Function** | `updateFourthBossHardcorePattern` |
| **Threat type** | SPACE CONTROL — dual column with lateral closure |
| **Intent** | Center column at player + lateral column to restrict escape |
| **Density** | Medium (3+3 = 6 bullets) |
| **Speed** | 2.2 * 0.88 ≈ 1.94 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('teniente_dive', 420)` |
| **Fairness** | MEDIUM — lateral column can create pinch if player is centered |
| **Overlap risk** | MEDIUM — center + lane bullets can converge at player position |
| **Escape lane impact** | Lateral lane restricts side movement; player must pick gap between columns |
| **Readability** | GOOD (red/orange #ee4422) |
| **Identity** | Dual-column lane closure — distinct |
| **Redundancy** | Unique — only boss that uses lane-closure concept |
| **Observations** | Good use of `_tenienteLaneSide` alternation. Lane offset of 48px is well-spaced. |

---

#### P-BOSS-12 — Teniente Phase 3 Triple Column
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:782-833` |
| **Function** | `updateFourthBossHardcorePattern` |
| **Threat type** | SPACE CONTROL — triple column siege |
| **Intent** | Three columns: center, left, right — full lower-screen coverage |
| **Density** | Medium (3+2+2 = 7 bullets) |
| **Speed** | 2.2 * 0.85 ≈ 1.87 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('teniente_dive', 450)` |
| **Fairness** | FAIR — 7 bullets spread across 3 columns leaves navigable gaps |
| **Overlap risk** | MEDIUM — triple column can create dense region at center |
| **Escape lane impact** | Player must find gap between left-center or center-right |
| **Readability** | GOOD (red #dd3311) |
| **Identity** | Triple-column siege — unique escalation |
| **Redundancy** | None — only triple-column pattern |
| **Observations** | 38px lane offset is the same as P2's 48 conceptually. Could be tuned down slightly for readability. |

---

#### P-BOSS-13 — Emperador Phase 1 Downward Spread
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:886-906` |
| **Function** | `updateFifthBossHardcorePattern` |
| **Threat type** | PRESSURE — wide downward spread |
| **Intent** | Wide spread arc covering lower screen |
| **Density** | Medium (7 bullets, span 1.3 rad) |
| **Speed** | 2.0 * 0.92 ≈ 1.84 px/frame |
| **Telegraph** | YES — `triggerBossTelegraph('emperador_spread', 440)` |
| **Fairness** | GOOD — wide but 7 bullets in 1.3 rad = ~0.22 rad gaps |
| **Overlap risk** | LOW |
| **Escape lane impact** | Gaps between spread rays |
| **Readability** | GOOD (purple #aa77dd) |
| **Identity** | Imperial downward spread — purple-themed |
| **Redundancy** | Similar to Serpentrix fan but narrower. Distinct color. |
| **Observations** | Good intro. Purposely slow for final boss phase 1 dignity. |

---

#### P-BOSS-14 — Emperador Phase 2 Aimed Spread + Lateral Delayed
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:909-957` |
| **Function** | `updateFifthBossHardcorePattern` |
| **Threat type** | PRECISION + RHYTHM — aimed spread with delayed lateral walls |
| **Intent** | Player-aimed spread (5 bullets) + 2 delayed bullets from sides (150ms) |
| **Density** | Medium (5+2 = 7 bullets) |
| **Speed** | 2.0 * 0.86 ≈ 1.72 px/frame (aimed), 1.34 (lateral) |
| **Telegraph** | YES — `triggerBossTelegraph('emperador_spread', 480)` |
| **Fairness** | GOOD — delays create rhythm, lateral bullets are slow |
| **Overlap risk** | MEDIUM — aimed spread + lateral closure can trap player |
| **Escape lane impact** | Player must dodge aimed spread first, then lateral closure |
| **Readability** | GOOD (purple #9966dd) |
| **Identity** | Imperial aimed spread + delayed side closure |
| **Redundancy** | Similar structure to Teniente P2 (center + lateral) but with aimed spread vs column. See redundancy R5. |
| **Observations** | The 150ms delay is well-timed. Lateral offset of 60px creates meaningful restriction. |

---

#### P-BOSS-15 — Emperador Phase 3 Aimed Spread + Outer Delayed Siege
| Field | Value |
|-------|-------|
| **File** | `boss-patterns.js:960-1013` |
| **Function** | `updateFifthBossHardcorePattern` |
| **Threat type** | PRECISION + RHYTHM + SPACE CONTROL — aimed spread + double-sided delayed wall |
| **Intent** | Escalation of P2: wider aimed spread + 4 delayed bullets (2 per side, 200ms) |
| **Density** | Medium (5+4 = 9 bullets) |
| **Speed** | 1.72 (aimed), 1.24 (lateral) |
| **Telegraph** | YES — `triggerBossTelegraph('emperador_spread', 520)` |
| **Fairness** | FAIR — wider lateral offsets (54, 76) create distinct zones |
| **Overlap risk** | MEDIUM-HIGH — 9 bullets with 2-stage delay can feel cluttered |
| **Escape lane impact** | Player must navigate through staged closure — gaps between offsets |
| **Readability** | GOOD (purple #9977ee) |
| **Identity** | Final boss siege escalation — distinct |
| **Redundancy** | Natural escalation of P-BOSS-14, not redundant |
| **Observations** | Offset pairs (54, 76) are well-spaced. 200ms delay rhythm is readable. |

---

### 1.2 BOSS DEFAULT PATTERNS (update-boss.js)

---

#### P-BOSS-DEF-01 — CrabTron Cross Pattern
| Field | Value |
|-------|-------|
| **File** | `update-boss.js:839-890` |
| **Function** | `updateBossStep` (crossfire case) |
| **Threat type** | PRECISION — cross + diagonal |
| **Intent** | Classic crossfire: diagonal X + horizontal + vertical crosses |
| **Density** | Low-Medium (3-6 bullets per volley) |
| **Speed** | 3-4 px/frame |
| **Telegraph** | Partial — dash telegraphs only |
| **Fairness** | GOOD — deterministic shapes |
| **Overlap risk** | LOW |
| **Escape lane impact** | Gaps are inherent in cross geometry |
| **Readability** | FAIR — some patterns lack telegraph |
| **Identity** | CrabTron crossfire identity |
| **Redundancy** | Replaced by HC patterns when enabled. Fallback only. |
| **Observations** | Legacy fallback. OK as-is. Laser column uses `scheduleBossQueuedBurst` for HC-HB-03 compliance. |

---

#### P-BOSS-DEF-02 — Serpentrix Fan + Poison + Mines
| Field | Value |
|-------|-------|
| **File** | `update-boss.js:893-942` |
| **Function** | `updateBossStep` (zigzag case) |
| **Threat type** | PRESSURE + SPACE CONTROL |
| **Density** | Medium (6-8 bullets fan + poison + mines) |
| **Speed** | 4-5 px/frame |
| **Telegraph** | None (mines are self-telegraphing) |
| **Fairness** | FAIR — predictable fan rotation |
| **Readability** | FAIR — poison bullets are larger and slower |
| **Observations** | Fallback pattern. Replaced by HC when enabled. |

---

#### P-BOSS-DEF-03 — Orbital Pulse + Spiral + Tractor Beam
| Field | Value |
|-------|-------|
| **File** | `update-boss.js:220-263` |
| **Function** | `fireBossOrbitalPattern` |
| **Threat type** | SPACE CONTROL + ESCALATION |
| **Density** | Medium-High (12-24 pulse bullets + 4-10 spiral) |
| **Speed** | 3-4 px/frame |
| **Telegraph** | Partial — tractor beam has 300ms telegraph |
| **Fairness** | MEDIUM — pulse rings are dense but patterns are predictable |
| **Observations** | Replaced by HC when enabled. Tractor beam telegraph added in HC-170. |

---

#### P-BOSS-DEF-04 — Teniente Divebomb Shot + Spread
| Field | Value |
|-------|-------|
| **File** | `update-boss.js:266-287` |
| **Function** | `fireBossDivebombPattern` |
| **Threat type** | PRECISION — aimed + side spread |
| **Density** | Low (1-3 bullets) |
| **Speed** | 3 px/frame |
| **Telegraph** | Partial — charge telegraph exists |
| **Observations** | Fallback pattern. Replaced by HC when enabled. |

---

#### P-BOSS-DEF-05 — Emperador Imperial Patterns
| Field | Value |
|-------|-------|
| **File** | `update-boss.js:977-1108` |
| **Function** | `updateBossStep` (supreme case) |
| **Threat type** | PRESSURE + SPACE CONTROL + ESCALATION |
| **Density** | Medium (3-10 bullets depending on roll) |
| **Variants**: Triple imperial, spread, ray, cross, spiral, wave |
| **Observations** | Complex fallback. Each variant has distinct identity. Replaced by HC when enabled. |

---

### 1.3 ENEMY HARDCORE PATTERNS (enemy-pattern-hooks.js)

---

#### P-ENEMY-01 — Sweeper Fan (alien1)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:429-462` |
| **Function** | `fireHardcoreSweeperFan` |
| **Threat type** | PRESSURE — wide fan |
| **Intent** | Wide downward fan covering a zone |
| **Density** | Low-Medium (5 bullets, spread 0.70 rad) |
| **Speed** | 2.4 * 0.78 ≈ 1.87 px/frame |
| **Telegraph** | NONE — direct fire (no telegraph in HC-160) |
| **Fairness** | GOOD — sparse, predictable |
| **Overlap risk** | LOW |
| **Escape lane impact** | Gaps inherent to fan geometry |
| **Readability** | GOOD (cyan #88ddff) |
| **Identity** | Gentle blue fan + micro-oscillation movement |
| **Redundancy** | Similar to Serpentrix P1 fan but enemy-scale. Distinct color. |
| **Observations** | Could benefit from a brief telegraph (150ms). The micro-oscillation movement (P-ENEMY-MOV-01) adds character. |

---

#### P-ENEMY-02 — Sniper Shot (alien2)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:98-122` |
| **Function** | `fireHardcoreSniperShot` |
| **Threat type** | PRECISION — aimed single shot |
| **Intent** | Precise player-aimed threat from distance |
| **Density** | Very Low (1 bullet) |
| **Speed** | 3.2 px/frame |
| **Telegraph** | YES — 280ms flash before firing (HC-46) |
| **Fairness** | GOOD — single bullet, long telegraph |
| **Overlap risk** | LOW — single bullet |
| **Escape lane impact** | Minimal — one bullet, micro-tap dodge |
| **Readability** | GOOD (orange #ff8844) |
| **Identity** | "crossfire_a" — sniper precision orange |
| **Redundancy** | Similar to CrabTron P1 aimed burst but single bullet. Identity is strong. |
| **Observations** | Excellent telegraph implementation. Long cooldown (2000-3500ms) prevents spam. |

---

#### P-ENEMY-03 — Hardcore Diver (alien3)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:128-265` |
| **Function** | `updateHardcoreDiverPattern` |
| **Threat type** | PRESSURE — player-pursuit dive |
| **Intent** | Enemy dives toward player at high speed (movement threat, not bullet) |
| **Density** | N/A (movement-only pattern) |
| **Speed** | 2.8 * 1.15 ≈ 3.22 px/frame |
| **Telegraph** | YES — 380ms flash before diving, dive trail |
| **Fairness** | GOOD — long telegraph, predictable angle |
| **Overlap risk** | MEDIUM — diver can intersect bullet paths |
| **Escape lane impact** | Diver occupies one lane; player must avoid |
| **Readability** | GOOD (flash + trail) |
| **Identity** | 4-state FSM: idle → telegraph → diving → recovering — unique |
| **Redundancy** | Unique — only movement-only enemy threat |
| **Observations** | Exceptionally well-designed. The FSM with recovery phase is elegant. No bullet spawn means zero bullet clutter. |

---

#### P-ENEMY-04 — Suppressor Burst (alien4)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:281-351` |
| **Function** | `fireHardcoreSuppressorBurst` |
| **Threat type** | PRESSURE — lateral fan |
| **Intent** | 3-bullet fan: center + left + right, restricts lateral movement |
| **Density** | Low (3 bullets, spread ±0.22 rad) |
| **Speed** | 2.6 * 0.82 ≈ 2.13 px/frame |
| **Telegraph** | YES — 180ms before firing (HC-48) |
| **Fairness** | GOOD — narrow fan, micro-stagger optional |
| **Overlap risk** | LOW |
| **Escape lane impact** | Side bullets restrict lateral dodge |
| **Readability** | GOOD (pink #ff6688) |
| **Identity** | "crossfire_b" — lateral fan pink |
| **Redundancy** | Similar to Chaser side shots but without center aimed. Distinct role. |
| **Observations** | Micro-stagger via `getHardcorePressureTimingOffset` is an optional 0-50ms. Good pressure scaling. |

---

#### P-ENEMY-05 — Chaser Burst (alien5)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:477-516` |
| **Function** | `fireHardcoreChaserBurst` |
| **Threat type** | PRECISION + RHYTHM — aimed + delayed side shots |
| **Intent** | Center aimed shot + delayed (±0.38 rad) side shots after 180ms |
| **Density** | Low (1+2 = 3 bullets) |
| **Speed** | 2.9 * 0.82 ≈ 2.38 px/frame |
| **Telegraph** | YES — 180ms timer before side shots |
| **Fairness** | GOOD — center shot is warned, side shots are slow |
| **Overlap risk** | LOW |
| **Escape lane impact** | Center aimed demands dodge; side shots arrive later |
| **Readability** | GOOD (orange #ff6633 center, #ff7744 sides) |
| **Identity** | Chaser: always aims at player, rhythm is predictable |
| **Redundancy** | Center+side structure is similar to Teniente P2 but enemy-scale. Distinct character. |
| **Observations** | Side shot angle of 0.38 rad creates meaningful separation. Good design. |

---

#### P-ENEMY-06 — Flanker Crossfire (alien6)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:532-578` |
| **Function** | `fireHardcoreFlankerCrossfire` |
| **Threat type** | PRESSURE — crossfire from screen edge |
| **Intent** | Cross-shot toward player center, biased by screen position |
| **Density** | Low (2 bullets, offset by 0.18 rad) |
| **Speed** | 2.5 * 0.80 ≈ 2.0 px/frame |
| **Telegraph** | NONE (HC-160) |
| **Fairness** | GOOD — predictable angle based on screen side |
| **Overlap risk** | LOW |
| **Escape lane impact** | Crossfire from edge creates diagonal threats |
| **Readability** | GOOD (purple #cc88ff) |
| **Identity** | Flanker: screen-edge perspective crossfire |
| **Redundancy** | Unique edge-based aiming. No other pattern uses screen-position bias. |
| **Observations** | Screen-center-based side detection is clever. Could use a 150ms telegraph. |

---

#### P-ENEMY-07 — Baiter Spread (alien_mini)
| Field | Value |
|-------|-------|
| **File** | `enemy-pattern-hooks.js:593-624` |
| **Function** | `fireHardcoreBaiterBurst` |
| **Threat type** | PRESSURE — erratic spread |
| **Intent** | Unpredictable downward spread with random jitter |
| **Density** | Low (3 bullets, ±0.22 rad ± 0.15 random jitter) |
| **Speed** | 2.1 * 0.65 ≈ 1.37 px/frame — slowest pattern |
| **Telegraph** | NONE (HC-160) |
| **Fairness** | GOOD — very slow, low bullet count |
| **Overlap risk** | LOW |
| **Escape lane impact** | Minor — slow, low density |
| **Readability** | GOOD (orange #ff9966) |
| **Identity** | Erratic mini-enemy spread — baiting behavior |
| **Redundancy** | Unique — only pattern with random jitter component |
| **Observations** | Speed is deliberately slow. Could feel unfair if 2+ baiters fire simultaneously (unlikely with cooldown desync). |

---

### 1.4 ENEMY MOVEMENT PATTERNS (enemy-pattern-hooks.js + enemy-tactical-ai.js)

---

#### P-ENEMY-MOV-01 — Sweeper Micro-Oscillation (alien1)
| **File** | `enemy-pattern-hooks.js:403-424` |
| **Function** | `updateHardcoreSweeperOscillation` |
| **Type** | SPACE CONTROL — lateral oscillation |
| **Intent** | Subtle sine-wave drifting to make sweeper feel alive |
| **Amplitude** | X: ±2.2px, Y: ±1.3px |
| **Frequency** | X: 0.0055, Y: 0.0042 |
| **Fairness** | GOOD — cosmetic drift, doesn't affect gameplay |
| **Observations** | Nice flavor. Amplitude is tiny — purely aesthetic. |

---

#### P-ENEMY-MOV-02 — Tactical AI (all roles)
| **File** | `enemy-tactical-ai.js` |
| **Function** | `updateEnemyTacticalAI` |
| **Type** | PRESSURE — role-based micro-positioning |
| **Intent** | Each enemy role gets context-appropriate positional bias |
| **Roles**: Sweeper (sweep lane), Sniper (hold line), Diver (dive window), Suppressor (control lane), Chaser (pursuit), Flanker (flank edge), Baiter (bait dart) |
| **Fairness** | GOOD — offsets are capped (maxOffsetX: 18, maxOffsetY: 10) |
| **Observations** | HC-124 implementation. Excellent role differentiation. Smoothing prevents jitter. |

---

### 1.5 SET PIECE PATTERNS (enemy-attacks.js)

---

#### P-SET-01 — Imperial Guard Crossfire
| **File** | `enemy-attacks.js:32-73` + `runSetPieceFirePattern` |
| **Function** | `fireImperialGuardCrossfire` |
| **Threat type** | PRECISION — aimed crossfire from flanks |
| **Intent** | Coordinated flank-based aimed fire, can chain 2 bursts at high level |
| **Density** | Medium (2-4 shooters × 1-2 bursts) |
| **Speed** | bulletSpeed * 0.82 ≈ 2.5-3.0 px/frame |
| **Telegraph** | YES — 250-360ms set piece telegraph |
| **Fairness** | MEDIUM — multiple shooters aiming at player is demanding |
| **Overlap risk** | MEDIUM — crossfire from both flanks converges |
| **Escape lane impact** | Flank angles converge on player; dodge must be perpendicular |
| **Readability** | GOOD (orange crossfire_a: #ffb15a, crossfire_b: #ff6a6a) |
| **Identity** | Set piece — coordinated imperial guard |
| **Redundancy** | Similar to Flanker (P-ENEMY-06) but set-piece scale with telegraph |
| **Observations** | Advanced burst (level 19+) doubles fire. Could be overwhelming with enemy patterns active. |

---

#### P-SET-02 — Fortress Row Volley
| **File** | `enemy-attacks.js:93-155` |
| **Function** | `runSetPieceFirePattern` (fortress) |
| **Threat type** | PRESSURE — row-based aimed volley |
| **Intent** | Coordinated fire from a single row toward player |
| **Density** | Low-Medium (2-4 shooters) |
| **Speed** | bulletSpeed * 0.92 |
| **Telegraph** | YES — 220ms |
| **Fairness** | GOOD — single row, narrow field |
| **Optional** | Good. Row-based design creates terrain-like shooting. |
| **Observations** | Lane cycling via `setPieceLaneIndex` creates predictable rotation. |

---

#### P-SET-03 — Split Storm Fan
| **File** | `enemy-attacks.js:219-263` |
| **Function** | `runSetPieceFirePattern` (split_storm) |
| **Threat type** | PRESSURE — single-shooter fan |
| **Intent** | Wide fan from one alien6 shooter |
| **Density** | Low (3 bullets, spread -1.25, 0, +1.25 vx) |
| **Speed** | bulletSpeed * 0.9 |
| **Telegraph** | YES — 190ms |
| **Fairness** | GOOD — single shooter, wide but sparse |
| **Observations** | Simplest set piece. Good for low-pressure moments. |

---

### 1.6 SHMUP EXTERNAL PATTERNS (update-enemies.js:592-654)

---

#### P-SHMUP-01 — Basic (straight down)
| **Density** | Low (1 bullet) |
| **Speed** | bulletSpeed |
| **Color** | #ffaa44 |
| **Telegraph** | None (external enemy telegraphs separately) |

#### P-SHMUP-02 — Aimed (player-directed)
| **Density** | Low (1 bullet) |
| **Speed** | bulletSpeed |
| **Angle clamp** | [0.35π, 0.65π] |
| **Color** | #ff8844 |

#### P-SHMUP-03 — Sweep (±0.55 rad)
| **Density** | Low (2 bullets) |
| **Speed** | bulletSpeed |
| **Color** | #ffaa44 |

#### P-SHMUP-04 — Heavy (slow big bullet)
| **Density** | Low (1 bullet) |
| **Speed** | bulletSpeed * 0.75 |
| **Size** | 6×12 |
| **Color** | #ff6644 |

#### P-SHMUP-05 — Spread (triple -0.4, 0, +0.4)
| **Density** | Low (3 bullets) |
| **Speed** | bulletSpeed |
| **Color** | #ffaa44 |

**Observations**: External shmup patterns are simple single-enemy patterns. They never overlap with set pieces (excluded if `isExternalShmup`). Low threat individually but can accumulate with multiple externals.

---

### 1.7 OTHER ATTACKS (update-boss.js)

---

| ID | Pattern | Type | Density |
|----|---------|------|---------|
| P-OTHER-01 | Boss counter (2 fast homing bullets) | PRECISION | Low |
| P-OTHER-02 | CrabTron dash claw (2 bullets at dash end) | PRESSURE | Low |
| P-OTHER-03 | Orbital satellites (player-aimed orbs) | PRECISION | Low-Medium (1-4 satellites) |
| P-OTHER-04 | Orbital tractor beam (vertical column) | SPACE CONTROL | Medium (5 bullets) |
| P-OTHER-05 | Serpentrix mines (floating, slow descent) | SPACE CONTROL | Medium (up to 8 mines) |
| P-OTHER-06 | Teniente charge impact (radial burst 8-12) | SPACE CONTROL | Medium |
| P-OTHER-07 | Emperador teleport wave (radial 4-6) | SPACE CONTROL | Low |
| P-OTHER-08 | Emperador minion spawns (alien1 divers) | PRESSURE | Low (1-2 per spawn) |

---

## 2. TAXONOMY — THREAT CLASSIFICATION

### 2.1 PRECISION THREATS
*Definition: Aimed, targeted, or burst attacks requiring precise micro-dodging.*

| ID | Name | Source | Bullets | Speed |
|----|------|--------|---------|-------|
| P-BOSS-01 | CrabTron P1 aimed burst | Boss | 3 | 2.72 |
| P-BOSS-02 | CrabTron P2 delayed burst | Boss | 3×1 | 3.2 |
| P-BOSS-07 | Orbital P1 aimed arc | Boss | 6 | 2.03 |
| P-BOSS-08 | Orbital P2 side arcs | Boss | 4 | 1.79 |
| P-BOSS-10 | Teniente P1 column | Boss | 3 | 2.07 |
| P-BOSS-14 | Emperador P2 aimed spread | Boss | 5+2 | 1.72 |
| P-BOSS-15 | Emperador P3 aimed siege | Boss | 5+4 | 1.72 |
| P-ENEMY-02 | Sniper shot | Enemy | 1 | 3.2 |
| P-ENEMY-05 | Chaser burst | Enemy | 1+2 | 2.38 |
| P-SET-01 | Imperial Guard crossfire | Set Piece | 2-8 | 2.5-3.0 |
| P-SHMUP-02 | Shmup aimed | External | 1 | var |
| P-OTHER-01 | Boss counter | Boss (AI) | 2 | 7.0 |

### 2.2 SPACE CONTROL
*Definition: Patterns that deny or restrict screen area, creating walls or zones.*

| ID | Name | Source | Bullets |
|----|------|--------|---------|
| P-BOSS-03 | CrabTron P3 radial ring | Boss | 8-14 |
| P-BOSS-09 | Orbital P3 dual arcs | Boss | 8 |
| P-BOSS-11 | Teniente P2 dual column | Boss | 6 |
| P-BOSS-12 | Teniente P3 triple column | Boss | 7 |
| P-OTHER-03 | Orbital satellites | Boss | 1-4 orbs |
| P-OTHER-04 | Orbital tractor beam | Boss | 5 |
| P-OTHER-05 | Serpentrix mines | Boss | 0-8 |
| P-OTHER-06 | Teniente charge impact | Boss | 8-12 |
| P-OTHER-07 | Emperador teleport wave | Boss | 4-6 |

### 2.3 PRESSURE THREATS
*Definition: Spreads, fans, and staggered attacks that create general screen pressure.*

| ID | Name | Source | Bullets |
|----|------|--------|---------|
| P-BOSS-04 | Serpentrix P1 fan | Boss | 5 |
| P-BOSS-06 | Serpentrix P3 arc wave | Boss | 8-12 |
| P-BOSS-13 | Emperador P1 spread | Boss | 7 |
| P-ENEMY-01 | Sweeper fan | Enemy | 5 |
| P-ENEMY-03 | Hardcore diver | Enemy (movement) | 0 |
| P-ENEMY-04 | Suppressor burst | Enemy | 3 |
| P-ENEMY-06 | Flanker crossfire | Enemy | 2 |
| P-ENEMY-07 | Baiter spread | Enemy | 3 |
| P-SET-02 | Fortress row volley | Set Piece | 2-4 |
| P-SET-03 | Split storm fan | Set Piece | 3 |
| P-BOSS-DEF-01 | CrabTron cross (default) | Boss | 3-6 |
| P-BOSS-DEF-02 | Serpentrix fan (default) | Boss | 6-8 |
| P-BOSS-DEF-05 | Emperador variants (default) | Boss | 3-10 |
| P-OTHER-08 | Emperador minions | Boss | 1-2 |
| P-SHMUP-01,03,04,05 | Shmup basic/sweep/heavy/spread | External | 1-3 |

### 2.4 RHYTHM THREATS
*Definition: Patterns with staggered timing, delays, or pulse cadences that create rhythmic dodge windows.*

| ID | Name | Source | Rhythm |
|----|------|--------|--------|
| P-BOSS-02 | CrabTron P2 delayed burst | Boss | 0/100/200ms |
| P-BOSS-08 | Orbital P2 alternating sides | Boss | Alternating per cycle |
| P-BOSS-14 | Emperador P2 aimed+delayed | Boss | 150ms |
| P-BOSS-15 | Emperador P3 aimed+delayed | Boss | 200ms |
| P-ENEMY-05 | Chaser side shots | Enemy | 180ms after center |
| P-SET-01 | Imperial Guard chain burst | Set Piece | 115ms inter-burst |

### 2.5 ESCALATION THREATS
*Definition: Patterns that intensify over time or across phases, including spirals and rotating attacks.*

| ID | Name | Source | Escalation |
|----|------|--------|------------|
| P-BOSS-03 | CrabTron P3 player-snap | Boss | Every 3rd volley snaps |
| P-BOSS-06 | Serpentrix P3 wave modulation | Boss | Sinusoidal over time |
| P-BOSS-09 | Orbital P3 rotating dual arcs | Boss | 0.32 rad/frame rotation |
| P-BOSS-DEF-03 | Orbital pulse+spiral (default) | Boss | Phase-dependent density |

---

## 3. DETECTED REDUNDANCIES

### R1 — CrabTron P2 aimed burst ≈ Serpentrix P2 aimed burst
- **Similarity**: Both fire delayed aimed bullets with similar structure (setTimeout-based 0/100-120ms delays)
- **Difference**: CrabTron fires 3 waves of 1 bullet; Serpentrix fires 2 waves of 1 bullet. Colors differ.
- **Severity**: LOW — acceptable overlap given different bosses and visual identity.
- **Recommendation**: Fine as-is. Could differentiate by making CrabTron P2 a 2-bullet spread per wave and Serpentrix a single fast shot.

### R2 — Serpentrix P1 fan ≈ Sweeper fan (P-ENEMY-01)
- **Similarity**: Both are 5-bullet downward fans with similar spread ranges (Serpentrix: 1.5 rad, Sweeper: 0.70 rad)
- **Difference**: Boss fan is wider (1.5 vs 0.70 rad), green vs cyan, boss has telegraph.
- **Severity**: LOW — acceptable scale difference. Boss fan is wider and faster.
- **Recommendation**: Fine. The telegraph presence on boss distinguishes them well.

### R3 — Orbital P1 aimed arc ≈ CrabTron P1 aimed burst
- **Similarity**: Both are player-aimed cones. Orbital spans 2.4 rad with 6 bullets; CrabTron spans 0.36 with 3.
- **Difference**: Orbital arc is wider and directional; CrabTron is a tight aimed cone.
- **Severity**: LOW — different visual identity (blue vs orange), different spread mechanics.
- **Recommendation**: Fine. Arc vs cone is a meaningful distinction.

### R4 — Teniente P1 column ≈ Emperador P1 spread
- **Similarity**: Both fire downward-aimed spreads from the boss bottom.
- **Difference**: Teniente uses 3 bullets in 0.32 rad with angle clamping; Emperador uses 7 bullets in 1.3 rad.
- **Severity**: LOW — density and identity differ significantly.
- **Recommendation**: Fine.

### R5 — Emperador P2 lateral delayed ≈ Teniente P2 lane closure
- **Similarity**: Both use center+side column pattern with lateral restriction.
- **Difference**: Emperador uses aimed spread + delayed side bullets; Teniente uses simultaneous dual column.
- **Severity**: MEDIUM — the "center threat + side restriction" concept is shared.
- **Recommendation**: Acceptable but monitor. The timing difference (simultaneous vs delayed) creates different dodge rhythm. Could be future refinement point.

### R6 — Suppressor fan (P-ENEMY-04) ≈ Chaser side shots (part of P-ENEMY-05)
- **Similarity**: Both fire lateral spread at ±0.22-0.38 rad. Suppressor has 3 bullets (center + sides), Chaser has 2 side shots.
- **Difference**: Suppressor is symmetrical and simultaneous; Chaser is delayed and from center+aimed context.
- **Severity**: LOW — different timing and role context.
- **Recommendation**: Fine.

---

## 4. DETECTED OVERLAPS & DANGEROUS COMBINATIONS

### 4.1 Wall + Sweep Combinations

| Combination | Risk | Description |
|-------------|------|-------------|
| P-BOSS-09 (rotating arcs) + P-OTHER-04 (tractor beam) | **HIGH** | Rotating dual arcs restrict horizontal movement; tractor beam creates vertical wall. Player can be trapped. |
| P-BOSS-12 (triple column) + boss charge movement | **MEDIUM** | Boss moves during triple column, shifting lane gaps unpredictably. |
| P-BOSS-15 (Emperador P3 siege) + boss teleport | **MEDIUM** | Teleport can reposition the origin during delayed wave. |

### 4.2 Sniper + Suppression

| Combination | Risk | Description |
|-------------|------|-------------|
| P-ENEMY-02 (sniper) + P-ENEMY-04 (suppressor) concurrent | **MEDIUM** | Sniper demands precise dodge; suppressor fan restricts lateral escape. |
| P-ENEMY-02 (sniper) + P-SET-01 (Imperial Guard crossfire) | **HIGH** | Coordinated aimed crossfire from set piece + independent sniper creates overlapping precision threats. |
| P-SET-01 (Imperial Guard) + P-ENEMY-03 (diver) | **MEDIUM** | Diver occupies space; set piece crossfire aims at player escaping diver. |

### 4.3 Double Aimed Sync

| Combination | Risk | Description |
|-------------|------|-------------|
| P-ENEMY-05 (chaser) + P-ENEMY-02 (sniper) firing simultaneously | **MEDIUM** | Two aimed shots from different origins arriving at similar time. |
| P-BOSS-02 (CrabTron delayed) + P-OTHER-01 (boss counter) | **MEDIUM** | Delayed aimed + instant homing can create unpredictable dodge pattern. |

### 4.4 Spiral + Dense Spread

| Combination | Risk | Description |
|-------------|------|-------------|
| P-BOSS-DEF-03 (Orbital spiral) + P-BOSS-DEF-03 (Orbital pulse) | **MEDIUM** | Pulse ring (12-24 bullets) + ongoing spiral (4-10 bullets) — dense. HC patterns replace this though. |
| P-BOSS-06 (Serpentrix wave) + P-OTHER-05 (mines) | **MEDIUM** | Wave fan + persistent mines can create dense lower screen. |

### 4.5 Blocked Escape Lanes

| Scenario | Risk | Description |
|----------|------|-------------|
| Teniente P3 triple column during boss charge | **HIGH** | Triple column covers center 76px + boss charges through — no lateral escape |
| CrabTron dash toward player + P3 radial ring | **MEDIUM** | Dash closes distance while ring expands — player sandwiched |
| 3+ simultaneous enemy hardcore patterns (e.g. sweeper + suppressor + sniper) | **MEDIUM** | Encounter Director mitigates this via `canCoordinateEliteAction` and pressure caps |
| Emperador P3 siege (9 bullets staged) + boss teleport to new position | **MEDIUM** | Teleport changes bullet origin during active volley |

---

## 5. TELEGRAPH ISSUES

### 5.1 Patterns WITHOUT Telegraphs
| Pattern | ID | Recommendation |
|---------|----|----------------|
| Sweeper fan | P-ENEMY-01 | Add 150ms flash telegraph |
| Flanker crossfire | P-ENEMY-06 | Add 150ms flash telegraph |
| Baiter spread | P-ENEMY-07 | Acceptable — slow speed is self-telegraphing, but 100ms flash would help |
| Boss default patterns | P-BOSS-DEF-* | Acceptable — these are fallbacks; HC patterns replace them |

### 5.2 Telegraph Timing Adequacy
| Pattern | Telegraph (ms) | Assessment |
|---------|----------------|------------|
| CrabTron P2 burst | 420 | Generous — could be 320 |
| CrabTron P3 radial | 500 | Appropriate |
| Serpentrix P1 fan | 220 | Adequate |
| Serpentrix P3 wave | 450 | Appropriate |
| Orbital arcs | 340-420 | Good range |
| Teniente patterns | 380-450 | Appropriate |
| Emperador spreads | 440-520 | Generous — could be 380-440 |
| Sniper enemy | 280 | Excellent |
| Suppressor enemy | 180 | Adequate |
| Chaser enemy | 180 | Adequate |
| Diver enemy | 380 | Excellent |

### 5.3 Visual Priority Issues
- **Issue**: Boss telegraph rings can be obscured by enemy bullet clusters.
  - **Mitigation**: HC-RD-03 outline system already provides dark contrast outlines.
  - **Status**: Acceptable with HC-RD active.
- **Issue**: Diver telegraph (flash) can be hard to see among multiple enemies.
  - **Mitigation**: Flash timer + dive trail. Trail helps but could be more prominent.
  - **Status**: Acceptable. Could add a small arrow indicator in future.
- **Issue**: No telegraph layer separation — boss and enemy telegraphs share visual space.
  - **Mitigation**: VISUAL_PRIORITY.TELEGRAPH (90) ensures they render above enemies (75).
  - **Status**: GOOD with HC-RD active.

---

## 6. PATTERN IDENTITY ASSESSMENT

### Strong Identity (distinct, memorable, role-clear)
- P-BOSS-03 — CrabTron P3 radial ring (only ring pattern)
- P-BOSS-05 — Serpentrix P2 mines (only mine-deploying boss)
- P-BOSS-06 — Serpentrix P3 arc wave (sinusoidal modulation, unique)
- P-BOSS-09 — Orbital P3 dual rotating arcs (unique rotation mechanic)
- P-BOSS-11/12 — Teniente dual/triple column (unique lane closure)
- P-ENEMY-02 — Sniper (single precision shot, long telegraph, distinct)
- P-ENEMY-03 — Diver (movement-only threat, 4-state FSM, unique)
- P-ENEMY-06 — Flanker (edge-based aiming, unique perspective)

### Weak Identity (generic, blends with other patterns)
- P-ENEMY-01 — Sweeper fan (feels like generic downward fan, could be any enemy)
  - **Fix**: Give sweeper a wider, slower fan with wavy offset like Serpentrix P3 but mini-scale.
- P-ENEMY-07 — Baiter spread (feels like mini-suppressor with jitter)
  - **Fix**: Give baiter a unique pattern — e.g., 2 bullets that curve or accelerate.
- P-BOSS-01 — CrabTron P1 (feels like generic aimed triple)
  - **Fix**: Could add a micro-wobble to the triple spread for crab-like character.

### Chaotic Visual Risk
- P-SET-01 (Imperial Guard crossfire) with multiple enemy HC patterns active: potential visual overload.
  - **Mitigation**: Encounter Director pressure system caps elite actions at high pressure.
- P-BOSS-DEF-03 (Orbital pulse + spiral + tractor): dense but HC patterns replace this.

---

## 7. CONFIGURATION GAPS

### 7.1 Missing Safety Limits
| Gap | Current State | Recommendation |
|-----|---------------|----------------|
| No global bullet density cap | Only Encounter Director pressure system | Add `maxSimultaneousBullets` config |
| No per-type bullet cap | None | Add per-pattern budget limits |
| No escape lane reservation | Encounter Director prevents some overlaps | Add explicit `preserveEscapeLanes` logic |
| No telegraph spacing guarantee | Individual telegraphs may overlap | Add `telegraphSpacingFrames` minimum |
| No dominant pattern constraint | Multiple strong patterns can fire simultaneously | Add `maxSimultaneousDominantPatterns: 1` |

### 7.2 Redundancy Without Safeguards
- Sniper + Chaser can fire simultaneously (both are precision threats)
- Suppressor + Sweeper can overlap (both are pressure threats)
- No system prevents 2+ enemies of same role from firing in the same frame

---

## 8. SUMMARY — READINESS FOR HC-PD

### GREEN (safe, well-designed)
- All boss HC patterns (P-BOSS-01 through P-BOSS-15)
- Diver enemy (P-ENEMY-03) — exceptional design
- Sniper enemy (P-ENEMY-02) — telegraph is excellent
- Suppressor enemy (P-ENEMY-04) — narrow, well-telegraphed
- Set pieces (P-SET-01/02/03) — telegraph-based, well-spaced

### YELLOW (needs monitoring/light tuning)
- Chaser enemy (P-ENEMY-05) — side delay overlap with other patterns possible
- Flanker enemy (P-ENEMY-06) — no telegraph, could add one
- Sweeper fan (P-ENEMY-01) — weak identity
- Teniente P3 triple column + boss charge overlap (HIGH risk scenario)
- CrabTron dash + P3 ring overlap (MEDIUM risk scenario)

### RED (identified as needing HC-PD intervention)
- No global pattern budget system
- No escape lane reservation logic
- No dominant pattern constraint
- No telegraph spacing enforcement
- Baiter pattern needs stronger identity

---

## 9. HC-PD DESIGN DIRECTIVES

Based on this audit, the HC-PD should:

1. **Cap simultaneous dominant threats** at 1 (e.g., only one aimed-burst or space-control pattern active at a time)
2. **Reserve at least one escape lane** on screen during high-density moments
3. **Enforce minimum telegraph spacing** (at least 20 frames between overlapping telegraphs)
4. **Provide a threat budget** per frame — allocating "tokens" to patterns based on cost
5. **Track active pattern density** and deny spawns when ceiling is reached
6. **Integrate with Encounter Director** pressure system for context-aware pattern gating
7. **Classify patterns by dominance**: "dominant" (boss aimed/spread/ring) vs "support" (enemy fans/spreads)

---

*End of audit. HC-PD-01 — Ready for configuration.*
