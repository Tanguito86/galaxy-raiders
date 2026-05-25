# HC-ROADMAP-RESUME-01 — POST SPRITE LAB / ENCOUNTER FREEZE RE-ENTRY PLAN

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Roadmap Audit — No Code Changes

---

## 1. CURRENT STATE — WHAT IS FROZEN

### HC Foundation Systems (Frozen)

| Block | System | Status | Freeze Date | Freeze Doc |
|---|---|---|---|---|
| HC-CAL | Calibration / Pacing | **FROZEN** | 2026-05-22 | `hc-cal-production-freeze.md` |
| HC-SC | Score System | **FROZEN** | 2026-05-22 | `hc-sc-final-freeze.md` |
| HC-BD | Boss Director | **FROZEN** | 2026-05-22 | `hc-bd-final-freeze.md` |
| HC-RD | Readability | Freeze candidate | — | `hc-rd-freeze-candidate.md` |
| HC-HB | Hitbox / Collision | Freeze candidate | — | `hc-hb-freeze-candidate.md` |
| HC-WC | Wave Composer | Freeze audit | — | `hc-wc-freeze-audit.md` |
| HC-ST | Stage Director | Freeze candidate | — | `hc-st-freeze-candidate.md` |
| HC-PT | Playtest Framework | Complete | — | `hc-pt-production-feel-standards.md` |
| HC-LIVE | Production Readiness | Complete | — | `hc-live-production-readiness.md` |
| ED | Encounter Director v1 | **FROZEN** | 2026-05-17 | `encounter-director-freeze.md` |

### Sprite Lab Visual Systems (Frozen)

| Block | System | Status | Freeze Date | Freeze Doc |
|---|---|---|---|---|
| PHASE A | S04 Wedge + Scout faction | LIVE | 2026-05-25 | `runtime-integration-phase-a.md` |
| PHASE B | Supp/Splitter/Imperial factions | LIVE | 2026-05-25 | `runtime-integration-phase-b.md` |
| PHASE C | Mini-boss hierarchy registration | LIVE | 2026-05-25 | `runtime-integration-phase-c-minibosses.md` |
| PHASE D | Imperial Flagship registration | LIVE | 2026-05-25 | `runtime-integration-phase-d-flagship.md` |
| PHASE E | Orbital Siege registration | LIVE | 2026-05-25 | `runtime-integration-phase-e-orbital-siege.md` |
| HC-WIRE-01 | CRABTRON hero level 5 | LIVE | 2026-05-25 | `hc-sprite-wire-freeze.md` |
| HC-WIRE-02 | Flagship/EMPERADOR level 20 | LIVE | 2026-05-25 | `hc-sprite-wire-freeze.md` |
| HC-WIRE-03 | Boss visual regression freeze | FROZEN | 2026-05-25 | `hc-sprite-wire-freeze.md` |
| HC-MINIBOSS-01 | Mini-boss readiness audit | COMPLETE | 2026-05-25 | `hc-sprite-miniboss-readiness.md` |
| HC-MINIBOSS-02 | Mini-boss prelude preview | LIVE | 2026-05-25 | `hc-sprite-miniboss-prelude-preview.md` |
| HCV-FREEZE-01 | Encounter visual freeze | **FROZEN** | 2026-05-25 | `hc-sprite-encounter-visual-freeze.md` |

### Gameplay Files — Zero HC-SPRITE Changes

```
✅ entities.js          — 0 lines changed
✅ state.js             — 0 lines changed (ENEMY_TYPES: 7 types)
✅ enemy-identity.js    — 0 lines changed
✅ enemy-attacks.js     — 0 lines changed
✅ enemy-movement.js    — 0 lines changed
✅ update-enemies.js    — 0 lines changed
✅ update-boss.js       — 0 lines changed
✅ boss-patterns.js     — 0 lines changed
✅ boss-director.js     — 0 lines changed
✅ stage-plans.js       — 0 lines changed
✅ stage-director.js    — 0 lines changed
✅ encounter-director.js— 0 lines changed
✅ hc-wave-composer.js  — 0 lines changed
✅ collisions.js        — 0 lines changed
✅ balance.js           — 0 lines changed
✅ hardcore-rank.js     — 0 lines changed
✅ combat.js            — 0 lines changed
✅ entities.js          — 0 lines changed
```

---

## 2. COMPLETION STATUS — BY SYSTEM

```
HC Foundation:
  ├── HC-CAL (Calibration)          ████████████ FROZEN
  ├── HC-SC (Score)                 ████████████ FROZEN
  ├── HC-RK (Rank)                  ████████████ LIVE + AUDITED
  ├── HC-BD (Boss Director)         ████████████ FROZEN (flag-gated, off)
  ├── HC-RD (Readability)           ████████████ LIVE
  ├── HC-HB (Hitbox)                ████████████ LIVE
  ├── HC-WC (Wave Composer)         ████████████ LIVE
  ├── HC-ST (Stage Director)        ████████████ LIVE
  ├── HC-PT (Playtest)              ████████████ COMPLETE
  └── HC-LIVE (Production)          ████████████ COMPLETE

Encounter Systems:
  ├── Encounter Director v1         ████████████ FROZEN
  └── Stage Plans (20 levels)       ████████████ LIVE (5 bosses, 7 enemy types)

Sprite Lab:
  ├── Phase A (Player + Scout)      ████████████ LIVE
  ├── Phase B (3 factions)          ████████████ LIVE
  ├── Phase C (Mini-boss registry)  ████████████ LIVE (silhouettes)
  ├── Phase D (Flagship registry)   ████████████ LIVE (wired to EMPERADOR)
  ├── Phase E (Fortress registry)   ████████████ LIVE (not wired)
  ├── HC-WIRE-01 (CRABTRON hero)    ████████████ LIVE
  ├── HC-WIRE-02 (Flagship/Emp)     ████████████ LIVE
  ├── HC-WIRE-03 (Freeze)           ████████████ FROZEN
  ├── HC-MINIBOSS-01 (Audit)        ████████████ COMPLETE
  ├── HC-MINIBOSS-02 (Prelude prev) ████████████ LIVE
  └── HCV-FREEZE-01 (Encounter)     ████████████ FROZEN
```

---

## 3. NEXT PHASE OPTIONS

### Option A: Visual Polish (Safest — No Gameplay)

**What:** Tune existing visual integrations without touching gameplay.

| Task | Files | Risk |
|---|---|---|
| Tweak prelude silhouette alpha/position for readability | `draw.js` | Minimal |
| Add faction color feedback to mini-boss fallback rendering | `draw.js` | Minimal |
| Polish boss sprite tint blending (hero + flagship) | `draw.js` | Minimal |
| Add optional scanline/shader FX to prelude silhouettes | `draw.js` | Minimal |
| Chrome MCP visual regression pass (34 sprites) | N/A | None |

**Kill switch:** Existing `minibossPreludePreview`, `imperialFlagship` remain intact.

**Benefit:** Production-grade visual polish. Zero gameplay risk. All changes in `draw.js` only.

**Recommended:** YES — quick, safe, high visual return.

---

### Option B: Playtest / Live Validation (Moderate — No Code)

**What:** Validate current build with external testers using HC-LIVE pipeline.

| Task | Files | Risk |
|---|---|---|
| Deploy current build for live playtesting | N/A | None |
| Run 4-session protocol (HC-LIVE-03A) | N/A | None |
| Collect telemetry: boss visual swap behavior | `telemetry-run-log.md` | None |
| Observe: does flagship phase change feel natural? | N/A | None |
| Observe: are prelude silhouettes noticeable/distracting? | N/A | None |
| Observe: any rendering errors in production? | N/A | None |

**Benefit:** Real-player validation of Sprite Lab integrations. Data-driven polish decisions.

**Recommended:** YES — already production-ready per `hc-live-production-readiness.md`.

---

### Option C: Gameplay Expansion (High — Requires Unfreeze)

**What:** Create new enemy types, mini-boss encounters, or fortress boss slot.

| Task | Required Unfreeze | Risk |
|---|---|---|
| Imperial enemy type (`alien_imperial`) | HC-WC, Encounter Director | High |
| Mini-boss entity type x1 (scout) | HC-WC, Encounter Director, Stage Plans | High |
| Mini-boss entity types x4 (all) | HC-WC, Encounter Director, Stage Plans, Boss Director | Very High |
| Fortress boss slot (Orbital Siege) | Boss Director, Boss Patterns, Stage Plans | Very High |
| Imperial Flagship standalone boss | Boss Director, Boss Patterns, Stage Plans | Very High |

**Benefit:** Genuinely new content. Mini-bosses + fortress add 5+ encounter types.

**Risk:** Touches 5-8 gameplay files. Must unfreeze HC-WC + Encounter Director + Stage Plans. Requires separate design pass with kill switches and rollback plan.

**Recommended:** ONLY with explicit unfreeze approval and phased rollout (1 mini-boss → validate → 4 mini-bosses → fortress).

---

## 4. RECOMMENDED RE-ENTRY SEQUENCE

### Immediate (Now — No Unfreeze)

```
1. HC-POLISH-01: Visual polish pass (Option A)
   - Tune silhouette alpha/position
   - Add faction tint blending
   - Chrome MCP regression
   Files: draw.js only
   Risk: Zero

2. HC-LIVE-PLAYTEST-01: Production validation (Option B)
   - Deploy to external testers
   - Observe Sprite Lab integrations in real play
   - Collect telemetry on boss visual swaps
   Files: None
   Risk: Zero (no code changes)
```

### Medium-Term (After Polish + Playtest Validation)

```
3. HC-IMPERIAL-01: Single imperial enemy type (Option C — Controlled)
   - Add alien_imperial to ENEMY_TYPES
   - Wire faction_imperial sprite
   - Add to levels 16-18 only
   - Kill switch: spriteLab.factionImperial (existing)
   Files: state.js, enemy-identity.js, draw.js, stage-plans.js
   Risk: Medium (4 files, limited spawn)

4. HC-MINIBOSS-03: Single mini-boss entity (Option C — Controlled)
   - Add miniboss_scout to ENEMY_TYPES
   - Wire drawMiniBossVisual to entity draw
   - Basic attack pattern
   - Spawn at level 4 only (pre-CRABTRON)
   - Kill switch: spriteLab.miniBossScout (existing)
   Files: state.js, enemy-identity.js, draw.js, enemy-attacks.js, stage-plans.js
   Risk: Medium-High (5 files, new encounter flow)
```

### Long-Term (After Mini-Boss Validation)

```
5. HC-MINIBOSS-04: Full mini-boss roster (x4)
6. HC-FORTRESS-01: Orbital Siege Colossus boss slot
7. HC-FLAGSHIP-02: Imperial Flagship standalone encounter
```

---

## 5. UNFREEZE GATE

Any task touching gameplay files (entities.js, state.js, enemy-*.js, stage-plans.js, boss-*.js, encounter-director.js, hc-wave-composer.js) must pass:

| Gate | Requirement |
|---|---|
| G1 | Explicit unfreeze approval in ticket |
| G2 | Kill switch for every new feature |
| G3 | Fallback to current behavior when kill switch off |
| G4 | `npm run validate` passes before and after |
| G5 | Isolated to single level/section for first deployment |
| G6 | Rollback plan documented |

---

## 6. CURRENT BUILD METRICS

| Metric | Value |
|---|---|
| Levels | 20 (5 boss, 15 non-boss) |
| Enemy types | 7 (alien1-6 + alien_mini) |
| Boss patterns | 5 (crossfire/zigzag/rotate/divebomb/supreme) |
| Factions | 4 (scout/suppressor/splitter/imperial) |
| Sprites registered | 34 (validated via Chrome MCP) |
| Kill switches | 15 (all functional, all default safe) |
| Gameplay files touched (HC-SPRITE era) | 0 |
| Render files touched (HC-SPRITE era) | 3 (draw.js, game-config.js, sprite-system.js) |
| `npm run validate` | PASS |
| Live visual integrations | 3 (CRABTRON hero, Flagship/Emp, Prelude silhouettes) |
| Registered but unwired sprites | 3 (Mini-bosses x4 units, Fortress, Imperial enemies) |

---

## 7. SIGN-OFF

- [x] All HC foundation blocks identified and frozen status confirmed
- [x] All Sprite Lab phases identified and completion status confirmed
- [x] 3 re-entry options proposed with risk/benefit analysis
- [x] Recommended sequence: Option A (polish) → Option B (playtest) → Option C (controlled expansion)
- [x] Unfreeze gate defined with 6 requirements
- [x] Zero code changes in this audit
- [x] `npm run validate` confirmed passing

**RECOMMENDED NEXT:** HC-POLISH-01 (visual polish pass, draw.js only, zero risk) OR HC-LIVE-PLAYTEST-01 (deploy for live testing, zero code changes).
