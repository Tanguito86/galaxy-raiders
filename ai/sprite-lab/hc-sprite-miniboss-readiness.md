# HC-SPRITE-MINIBOSS-01 — MINI-BOSS HIERARCHY READINESS AUDIT

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Status:** Audit Complete — Zero Code Changes

---

## 1. MINI-BOSS SPRITE REGISTRATION STATUS

### Registered Assets

| Unit ID | Frame | Faction | Color | Sheet Frame | Asset |
|---|---|---|---|---|---|
| `scout_hive_leader` | 0 | scout_alien | #5ef7ff | 192x192 | `miniboss_hierarchy_sheet.png` |
| `suppressor_siege_core` | 1 | suppressor_alien | #ff5533 | 192x192 | `miniboss_hierarchy_sheet.png` |
| `splitter_aberrant_node` | 2 | splitter_alien | #dd66cc | 192x192 | `miniboss_hierarchy_sheet.png` |
| `imperial_command_lancer` | 3 | imperial_alien | #ffd866 | 192x192 | `miniboss_hierarchy_sheet.png` |

### Sprite System Registration (`sprite-system.js`)

```js
registerSprite("boss_miniboss_hierarchy", {
    src: "assets/sprites/bosses/miniboss_hierarchy_sheet.png",
    frameWidth: 192, frameHeight: 192,
    fallbackColor: "#887766"
});
```

### Global Helpers (Available)

```js
window.getMiniBossHierarchyMeta()     // Returns full metadata object
window.getMiniBossFrame(unitId)       // Returns 0-3 or -1
```

### Kill Switches (Available)

```js
GALAXY_CONFIG.spriteLab.miniBossHierarchy   // Master: true
GALAXY_CONFIG.spriteLab.miniBossScout       // true
GALAXY_CONFIG.spriteLab.miniBossSuppressor  // true
GALAXY_CONFIG.spriteLab.miniBossSplitter    // true
GALAXY_CONFIG.spriteLab.miniBossImperial    // true
```

### Draw Function (Available)

```js
drawMiniBossVisual(ctx, unitId, x, y, w, h, opts)
// Defined in draw.js — checks kill switches, sprite readiness, has fallback
// ZERO call sites — never invoked in gameplay
```

**Sprite registration:** COMPLETE
**Draw function:** COMPLETE (but not wired)
**Kill switches:** COMPLETE

---

## 2. EXISTING ENEMY TYPE COMPATIBILITY ASSESSMENT

### Current Enemy Types (`state.js:282-290`)

| Type | HP | Speed | Role | Faction | Can Become Mini-Boss? |
|---|---|---|---|---|---|
| `alien1` | 1 | 1.0 | sweeper | scout | No — too small, wrong role |
| `alien2` | 1 | 1.0 | sniper | scout | No — too small, wrong role |
| `alien3` | 2 | 0.6 | diver/tank | suppressor | No — tank but still standard enemy |
| `alien4` | 1 | 2.0 | suppressor | scout | No — too fast, fragile |
| `alien5` | 1 | 1.5 | chaser/kamikaze | scout | No — kamikaze, wrong role |
| `alien6` | 1 | 0.8 | flanker | splitter | No — fragile, wrong role |
| `alien_mini` | 1 | 1.8 | baiter | scout | No — too small |

**Finding: No existing enemy type can be visually swapped to a mini-boss.**

Reasons:
1. **Scale mismatch:** Enemies are 24-32px gameplay units; mini-bosses are 192x192 sprites designed for 128x128 gameplay size.
2. **HP mismatch:** Enemies have 1-2 HP; mini-bosses need 10+ HP to justify their visual presence.
3. **Role mismatch:** Mini-bosses are commanders/anchors; enemies are grunts/specialists.
4. **Behavior mismatch:** Mini-bosses need distinct attack patterns; enemies follow standard role AI.

**Visual-only overlay on existing enemies is NOT safe** — would look absurd (giant sprite on 1-HP enemy) and confuse readability.

---

## 3. CAN MINI-BOSSES MAP TO EXISTING BOSSES?

| Mini-Boss | Existing Boss Pattern | Compatible? | Reason |
|---|---|---|---|
| `scout_hive_leader` | `crossfire` (CRABTRON) | **No** | CRABTRON already has hero sprite; different faction |
| `suppressor_siege_core` | `zigzag` (SERPENTRIX) | **No** | Different faction, different visual language |
| `splitter_aberrant_node` | `rotate` (ORBITAL) | **No** | Different faction, different geometric motif |
| `imperial_command_lancer` | `supreme` (EMPERADOR) | **No** | EMPERADOR already has Flagship sprite wired |

**Finding: Mini-bosses can NOT replace existing bosses.** Each boss slot (5 levels) is already occupied with a distinct boss identity. Mini-bosses are designed as mid-tier encounters BETWEEN standard waves and main bosses — a gameplay role that does not yet exist.

---

## 4. WHAT WOULD BE REQUIRED PER MINI-BOSS

### New Entity Type Definition

Each mini-boss would need a new entry in `ENEMY_TYPES` (`state.js`):

```js
miniboss_scout:      { hp: 15, speed: 0.3, points: 500,  color: 2, canDive: false, shoots: true,  bigShot: true },
miniboss_suppressor: { hp: 18, speed: 0.2, points: 600,  color: 3, canDive: false, shoots: true,  bigShot: true },
miniboss_splitter:   { hp: 12, speed: 0.4, points: 700,  color: 2, canDive: false, shoots: true,  splits: true },
miniboss_imperial:   { hp: 20, speed: 0.25, points: 1000, color: 3, canDive: false, shoots: true, bigShot: true }
```

### New Enemy Identity Entry

Each mini-boss needs entry in `enemy-identity.js`:

```js
miniboss_scout:      { role: 'mini_boss', faction: 'scout',      patternHint: 'hive_swarm',        label: 'Hive Leader' },
miniboss_suppressor: { role: 'mini_boss', faction: 'suppressor',  patternHint: 'siege_anchor',      label: 'Siege Core' },
miniboss_splitter:   { role: 'mini_boss', faction: 'splitter',    patternHint: 'chaos_node',        label: 'Aberrant Node' },
miniboss_imperial:   { role: 'mini_boss', faction: 'imperial',    patternHint: 'command_strike',    label: 'Command Lancer' }
```

### New Sprite Defs

Each mini-boss needs a `SPRITES` entry (or `SpriteSystem` registration, which already wraps this).

### Visual Wiring

Call `drawMiniBossVisual(ctx, unitId, ...)` from the enemy draw loop when entity type matches.

### Attack Patterns

Each mini-boss needs distinct attack patterns (separate from boss patterns).

### Spawn Integration

Mini-bosses need spawn triggers in stage plans, wave composer, and encounter director.

---

## 5. PHASED INTEGRATION PLAN

### PHASE 1: Visual-Only Safe (Minimal Changes)

**Goal:** Preview mini-boss visuals in controlled situations without creating gameplay entities.

| Step | Description | Files | Risk |
|---|---|---|---|
| 1.1 | Add mini-boss visual preview to boss prelude cutscenes (level transitions) | `draw.js` | Minimal |
| 1.2 | Show mini-boss silhouette as background decoration at appropriate levels | `draw.js` | Minimal |
| 1.3 | Allow manual test rendering via `window._drawMiniBossTest(id)` | `draw.js` | None |

**Benefit:** Artists and designers can see mini-boss visuals in context. Zero gameplay impact.

### PHASE 2: Single Mini-Boss Entity Type (Controlled)

**Goal:** Create ONE mini-boss entity type and test in isolation.

| Step | Description | Files | Risk |
|---|---|---|---|
| 2.1 | Add `miniboss_scout` to ENEMY_TYPES | `state.js` | Low — new type, no spawn yet |
| 2.2 | Add identity entry | `enemy-identity.js` | Low |
| 2.3 | Wire `drawMiniBossVisual` to entity draw | `draw.js` | Low — visual only |
| 2.4 | Create basic attack pattern | New or extend `enemy-attacks.js` | Medium |
| 2.5 | Add spawn trigger at level 4 (pre-CRABTRON) | `stage-plans.js` | Medium — new encounter flow |
| 2.6 | Test with kill switch on/off | All | Low |
| 2.7 | Validate no breakage to existing waves | All | Medium |

**Deliverable:** One functional mini-boss encounter at level 4.

### PHASE 3: Full Mini-Boss Roster (Controlled)

**Goal:** Add remaining 3 mini-bosses at appropriate level positions.

| Mini-Boss | Target Level | Rationale |
|---|---|---|
| `scout_hive_leader` | 4 | Pre-CRABTRON (level 5), scout faction arc |
| `suppressor_siege_core` | 8-9 | Mid-game, pre-SERPENTRIX (level 10), suppressor density |
| `splitter_aberrant_node` | 13-14 | Pre-ORBITAL (level 15), splitter/fragment escalation |
| `imperial_command_lancer` | 17-18 | Pre-EMPERADOR (level 20), imperial theme stages |

### PHASE 4: Encounter Wiring Future

**Goal:** Full integration — mini-boss encounters as regular game content.

Requires:
- Encounter director support for mini-boss wave types
- Wave composer mini-boss phase type
- Score/medal integration
- HP balancing pass
- Rank scaling for mini-boss difficulty

---

## 6. RISK/BENEFIT MATRIX

| Integration Level | Benefit | Risk | Files Touched | Recommended |
|---|---|---|---|---|
| **Preview only (Phase 1)** | Visual validation, zero gameplay risk | None | 1 (draw.js) | **YES — Safe** |
| **Single mini-boss (Phase 2)** | One new encounter, controlled test | Low-Medium | 4-5 | **YES — After Phase 1** |
| **Full roster (Phase 3)** | 4 new encounters, faction arcs complete | Medium | 6-8 | **YES — After Phase 2** |
| **Visual overlay on existing enemies** | None (looks absurd) | High (readability damage) | 2-3 | **NO — Rejected** |
| **Replace existing boss** | None (boss identity loss) | High (encounter breakage) | 3-5 | **NO — Rejected** |

---

## 7. CURRENT BLOCKERS

| Blocker | Severity | Resolution Path |
|---|---|---|
| No enemy type exists for mini-bosses | Critical | Create new types (Phase 2) |
| No spawn triggers in stage plans | Critical | Add mini-boss wave sections (Phase 2) |
| No attack pattern hook | High | Create mini-boss attack patterns (Phase 2) |
| `drawMiniBossVisual` never called | High | Wire to entity draw (Phase 2) |
| No HP scaling for mini-boss tier | Medium | Add HP curve (Phase 2) |

---

## 8. SAFE IMMEDIATE ACTIONS (Phase 1 — No New Types)

### 8.1 Boss Prelude Cutscene Preview

At the start of each boss level (5, 10, 15, 19, 20), during the boss prelude animation, show the corresponding mini-boss silhouette faintly in the background as a "foreshadowing" visual:

```js
// During boss prelude at level 5:
drawMiniBossVisual(ctx, 'scout_hive_leader', x, y, 128, 128, { alpha: 0.15 });

// During boss prelude at level 10:
drawMiniBossVisual(ctx, 'suppressor_siege_core', x, y, 128, 128, { alpha: 0.15 });

// During boss prelude at level 15:
drawMiniBossVisual(ctx, 'splitter_aberrant_node', x, y, 128, 128, { alpha: 0.15 });

// During boss prelude at level 20:
drawMiniBossVisual(ctx, 'imperial_command_lancer', x, y, 128, 128, { alpha: 0.15 });
```

**Risk:** None — purely ambient decoration during prelude transitions.

### 8.2 Manual Test Render Helper

```js
window._drawMiniBossTest = function(unitId) {
    // Direct invocation for visual testing in console
    // drawMiniBossVisual already has internal guards
};
```

**Risk:** None — console-only, never auto-invoked.

---

## 9. GIT REFERENCE

Current mini-boss registration commit:
```bash
71df99e  feat(sprite-lab): Phase C — register mini-boss hierarchy with visual-only rendering
```

Files with mini-boss code:
- `www/sprite-system.js:565-604` — registration + metadata
- `www/draw.js:4514-4641` — draw function + fallback + debug overlay
- `www/game-config.js:147-151` — kill switches

---

## 10. SIGN-OFF

- [x] All 4 mini-boss sprites registered and verified present
- [x] `drawMiniBossVisual()` function complete with guards and fallback
- [x] Kill switches exist per mini-boss
- [x] No existing enemy/boss compatible for visual-only mapping
- [x] New entity types required for gameplay integration
- [x] Phase 1 (preview only) recommended as safe next step
- [x] Phase 2 (single entity) recommended after Phase 1
- [x] Visual overlay on existing enemies REJECTED
- [x] Boss replacement REJECTED
- [x] Zero code changes in this audit
