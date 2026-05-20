# HC-PD-02 — Runtime Threat Classification System

> **Sprint**: HC-PD-02
> **Date**: 2026-05-19
> **Status**: Complete
> **Depends on**: HC-PD-01 (audit + taxonomy)
> **Mode**: PASSIVE — observes, classifies, measures. No combat control.

---

## 1. OVERVIEW

HC-PD-02 converts the pattern taxonomy from HC-PD-01 into a runtime system that the game can query at any time to understand what type of threat is currently being executed. All operations are read-only. No pattern is ever blocked, no fire rate is ever changed.

### What HC-PD-02 does:
- Maintains `HC_PATTERN_REGISTRY` — 26 pattern definitions with full metadata
- Resolves raw game calls (boss.pattern + phase, enemy role, set piece name) to registry IDs
- Tracks active patterns per frame (budget, dominance, density, readability load)
- Generates validation warnings (debug only)
- Exposes helpers for querying pattern properties
- Feeds the debug overlay

### What HC-PD-02 does NOT do:
- Block patterns
- Change fire rates
- Alter bosses
- Change density
- Modify pacing
- Break HC-ED, HC-HB, or HC-RD

---

## 2. PATTERN REGISTRY

### 2.1 Structure

Each entry in `HC_PATTERN_REGISTRY` has:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique pattern identifier |
| `category` | string | precision / spaceControl / pressure / rhythm / escalation |
| `type` | string | Sub-classification (aimed, burst, fan, ring, etc.) |
| `weight` | number | Threat budget cost (0-6) |
| `dominance` | string | primary / support / utility |
| `densityClass` | string | low / medium / high |
| `laneRisk` | string | safe / low / medium / high |
| `readabilityCost` | number | Visual/mental load on player (0-4) |
| `telegraphRequired` | boolean | Whether pattern needs telegraph for fairness |
| `cooldownClass` | string | short / medium / long |
| `overlapRisk` | string | none / low / medium / high |
| `tags` | array | Searchable labels |

### 2.2 Pattern Inventory (26 entries)

#### PRECISION (6)
| ID | Type | Weight | Dominance | LaneRisk |
|----|------|--------|-----------|----------|
| `aimedShot` | aimed | 2 | support | low |
| `aimedBurst` | burst | 4 | **primary** | medium |
| `aimedColumn` | column | 3 | **primary** | medium |
| `aimedArc` | arc | 3 | **primary** | low |
| `aimedSpread` | spread | 5 | **primary** | medium |
| `imperialCrossfire` | crossfire | 5 | **primary** | high |

#### SPACE CONTROL (6)
| ID | Type | Weight | Dominance | LaneRisk |
|----|------|--------|-----------|----------|
| `radialRing` | ring | 6 | **primary** | high |
| `laneColumn` | column | 5 | **primary** | high |
| `rotatingArcs` | rotating | 6 | **primary** | high |
| `mineField` | mine | 3 | support | medium |
| `tractorBeam` | beam | 4 | support | high |
| `satelliteOrbit` | orbit | 2 | support | low |

#### PRESSURE (6)
| ID | Type | Weight | Dominance | LaneRisk |
|----|------|--------|-----------|----------|
| `wideFan` | fan | 2 | support | low |
| `downwardSpread` | spread | 3 | support | low |
| `suppressorFan` | fan_lateral | 2 | support | low |
| `flankerCross` | cross | 2 | support | low |
| `baiterSpread` | spread_erratic | 1 | utility | safe |
| `diverPursuit` | pursuit | 3 | support | medium |

#### RHYTHM (2)
| ID | Type | Weight | Dominance | LaneRisk |
|----|------|--------|-----------|----------|
| `chaserBurst` | burst_delayed | 3 | **primary** | medium |
| `delayedBurst` | staggered | 3 | **primary** | low |

#### ESCALATION (3)
| ID | Type | Weight | Dominance | LaneRisk |
|----|------|--------|-----------|----------|
| `arcWave` | wave | 5 | **primary** | medium |
| `chargeImpact` | impact | 4 | **primary** | high |
| `teleportWave` | wave | 3 | support | low |

#### UTILITY (3)
| ID | Type | Weight | Dominance | LaneRisk |
|----|------|--------|-----------|----------|
| `counterShot` | homing | 2 | utility | low |
| `defaultEnemyShot` | basic | 1 | utility | safe |
| `bossDefaultPattern` | default | 2 | support | low |

---

## 3. CALLER-TO-REGISTRY MAPPING

The system resolves raw game calls to registry IDs via `CALLER_MAP`:

### Boss patterns (boss.pattern + phase)
```
crossfire:  P1→aimedColumn, P2→delayedBurst, P3→radialRing
zigzag:     P1→wideFan,      P2→aimedBurst,   P3→arcWave
rotate:     P1→aimedArc,     P2→aimedArc,     P3→rotatingArcs
divebomb:   P1→aimedColumn,  P2→laneColumn,   P3→laneColumn
supreme:    P1→downwardSpread, P2→aimedSpread, P3→aimedSpread
```

### Enemy roles
```
sweeper→wideFan       sniper→aimedShot      suppressor→suppressorFan
chaser→chaserBurst    flanker→flankerCross   baiter→baiterSpread
diver→diverPursuit
```

### Set pieces
```
imperial_guard→imperialCrossfire
fortress→fortressVolley
split_storm→splitFan
```

### Boss other attacks
```
counter→counterShot    tractor→tractorBeam    mine→mineField
satellite→satelliteOrbit  impact→chargeImpact  teleport→teleportWave
default→bossDefaultPattern
```

---

## 4. HELPERS

All helpers are safe — unknown IDs return a defensive `_emptyDef` object.

| Helper | Returns | Usage |
|--------|---------|-------|
| `getPatternDefinition(id)` | Full metadata object | Get all properties |
| `getPatternWeight(id)` | number | Budget calculation |
| `getPatternCategory(id)` | string | Classification |
| `isPrimaryThreat(id)` | boolean | Dominance check |
| `requiresTelegraph(id)` | boolean | Telegraph enforcement |
| `getLaneRisk(id)` | string | Escape lane safety |
| `getReadabilityCost(id)` | number | Visual load budget |
| `getDensityClass(id)` | string | Density thresholding |
| `getOverlapRisk(id)` | string | Layer safety check |
| `getCooldownClass(id)` | string | Rhythm pacing |
| `getPatternTags(id)` | string[] | Search/filter |

### Registration
| Helper | Purpose |
|--------|---------|
| `registerPatternUsage(id, source, meta)` | Record pattern activation (PASSIVE) |
| `registerPatternUsageResolved(origin, type, role, phase, subType, source)` | Resolve context to ID then register |

---

## 5. DOMINANCE PHILOSOPHY

| Level | Meaning | Example | Budget Impact |
|-------|---------|---------|---------------|
| **primary** | Demands player attention; dominates screen | aimedBurst, radialRing, imperialCrossfire | High weight (3-6) |
| **support** | Complementary threat; manageable with primary | wideFan, suppressorFan, diverPursuit | Medium weight (2-3) |
| **utility** | Background noise; almost cosmetic | baiterSpread, defaultEnemyShot, counterShot | Low weight (1-2) |

**Rule of thumb**: A well-composed moment has 1 primary + 1-2 support + any number of utility.

---

## 6. LANE RISK MEANING

| Level | Meaning | Action |
|-------|---------|--------|
| **safe** | No lane restriction at all | Free movement |
| **low** | Minor restriction, wide gaps | Normal dodge |
| **medium** | Noticeable lane pressure | Must read pattern |
| **high** | Significant lane closure | Must find gap or escape lane |

Patterns with `laneRisk: high` should never coexist without at least one reserved escape lane.

---

## 7. READABILITY PHILOSOPHY

Readability cost measures the visual/mental load a pattern imposes:

| Cost | Load | Example |
|------|------|---------|
| 0 | None | defaultEnemyShot, shmupExternal |
| 1 | Minimal | aimedShot, wideFan, baiterSpread |
| 2 | Moderate | aimedBurst, tractorBeam, chaserBurst |
| 3 | Significant | radialRing, arcWave, chargeImpact |
| 4 | Heavy | rotatingArcs, imperialCrossfire |

The `readability.maxLoad` config caps total readability per frame at 8.

---

## 8. WARNING SYSTEM (debug only)

Three warning categories controlled by config:

### `multiplePrimaryThreats`
Triggers when 2+ primary-dominance patterns are active simultaneously.
This indicates the player is being asked to handle two demanding threats at once.

### `laneClosureRisk`
Triggers when 2+ patterns with `laneRisk: medium` or `high` are active.
This indicates potential screen entrapment.

### `telegraphMissing`
Triggers when a pattern that `requiresTelegraph` is active but doesn't have one registered.
This indicates a fairness gap.

---

## 9. INTEGRATION POINTS

HC-PD-02 integrates passively at these safe points:

1. **`updatePatternDirector()`** — called from game loop → `update-enemies.js`
   - Resets per-frame state
   - Calculates bullet density/convergence
   - Runs validation warnings

2. **`registerPatternUsage()`** — called at pattern fire time
   - Boss pattern fire (boss-patterns.js, update-boss.js)
   - Enemy hardcore pattern fire (enemy-pattern-hooks.js)
   - Set piece fire (enemy-attacks.js)
   - All calls are NON-BLOCKING — pattern fires regardless

3. **`requestPattern()`** — future control hook (currently always allows)
   - When HC-PD becomes active (enabled: true), this will gate patterns
   - Currently always returns `{ allowed: true }`

---

## 10. FUTURE PATH

When HC-PD transitions from passive to active:

1. `requestPattern()` will start rejecting patterns that exceed budget
2. `reserveEscapeLane()` will actually restrict pattern placement
3. `telegraphSpacingFrames` will be enforced
4. Density caps will limit bullet spawns
5. The warning system will transition from debug-only to gameplay safety net

---

*End of HC-PD-02 classification documentation.*
