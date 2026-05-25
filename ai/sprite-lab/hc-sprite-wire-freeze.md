# HC-SPRITE-WIRE — RUNTIME VISUAL REGRESSION FREEZE

**Date:** 2026-05-25
**Project:** Galaxy Raiders
**Freeze Version:** HC-SPRITE-WIRE v1.0
**Status:** FROZEN — No further visual swap changes without approval

---

## 1. FROZEN VISUAL SWAPS

| Wire ID | Boss | Level | Asset | Pattern | Frame Resolution | Phases |
|---|---|---|---|---|---|---|
| HC-01 | CRABTRON (MOTHERSHIP) | 5 | `boss_crabtron_hero` | `crossfire` | 192x192 (8x5 grid = 40 frames) | 5-layer z-ordered |
| HC-02 | EMPERADOR | 20 | `boss_imperial_flagship` | `supreme` | 256x256 (3 frames) | master / damaged / core_exposed |

---

## 2. ASSET INVENTORY — ALL VERIFIED PRESENT

```
✅ www/ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png
✅ www/assets/sprites/bosses/imperial_flagship/imperial_flagship_command_sheet.png
✅ www/assets/sprites/boss_crabtron.png
✅ www/assets/sprites/boss_serpentrix.png
✅ www/assets/sprites/boss_orbital.png
✅ www/assets/sprites/boss_teniente.png
✅ www/assets/sprites/boss_emperador.png
✅ www/assets/sprites/bosses/miniboss_hierarchy_sheet.png
✅ www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_sheet.png
```

**9/9 boss sprites present — 0 missing.**

---

## 3. KILL SWITCH MATRIX

### HC-01: CRABTRON Hero (Level 5)

| Kill Switch | Location | Default | Effect |
|---|---|---|---|
| (none — implicit) | draw.js:4204 | Always on if sprite loaded | Hero draws when `boss_crabtron_hero` sprite loads |

**Fallback flow:**
```
crabtron_hero sprite loaded?
  ├── YES → _crabtronHeroReady = true
  │         → drawCrabtronHeroLayers() fires (has internal isSpriteReady guard)
  │         → Legacy body + arms/armor/core + glow + flash sprites GATED (alpha=0 or skipped)
  │         → Telegraphs (shoot/dash/muzzle) ALWAYS DRAW
  └── NO  → _crabtronHeroReady = false
            → All legacy geometric rendering fires normally
            → Boss appears identical to pre-sprite-lab visual
```

### HC-02: Imperial Flagship / EMPERADOR (Level 20)

| Kill Switch | Location | Default | Effect |
|---|---|---|---|
| `spriteLab.imperialFlagship` | game-config.js:156 | `true` | Master — false restores full legacy EMPERADOR |
| `spriteLab.imperialFlagshipPhaseDebug` | game-config.js:157 | `false` | Debug — true enables `window._flagshipPhaseDebugOverride` |

**Fallback flow:**
```
GALAXY_CONFIG.spriteLab.imperialFlagship !== false?
  ├── NO  → isFlagshipVisualEnabled() = false
  │         → _imperialFlagshipReady = false
  │         → All legacy EMPERADOR geometric rendering fires normally
  │
  └── YES → imperial_flagship sprite loaded?
              ├── YES → _imperialFlagshipReady = true
              │         → drawImperialFlagshipVisual() fires
              │         → Legacy body + EnergyMantle + CrownHalo + EmperorCore + PhaseOverload
              │           + glow + flash sprites GATED
              │         → Telegraphs (ImperialAura, TeleportIndicator) ALWAYS DRAW
              │
              └── NO  → _imperialFlagshipReady = false
                        → All legacy EMPERADOR geometric rendering fires normally
```

---

## 4. CROSS-BOSS CONTAMINATION CHECK

| Boss Level | Pattern | _crabtronHeroReady | _imperialFlagshipReady | Result |
|---|---|---|---|---|
| 5 | crossfire | true (if sprite loaded) | false (pattern != supreme) | CRABTRON hero draws, legacy gated |
| 10 | zigzag | false (pattern != crossfire) | false (pattern != supreme) | Legacy SERPENTRIX renders normally |
| 15 | rotate | false | false | Legacy ORBITAL renders normally |
| 19 | divebomb | false | false | Legacy TENIENTE renders normally |
| 20 | supreme | false (pattern != crossfire) | true (if sprite loaded + kill switch on) | Flagship draws, legacy gated |

**No cross-contamination.** Each flag is pattern-specific and mutually exclusive.

---

## 5. VALIDATION RESULTS

| Check | Result |
|---|---|
| `npm run validate` | PASS — 0 errors |
| `node --check draw.js` | PASS |
| `node --check sprite-system.js` | PASS |
| `node --check game-config.js` | PASS |
| Asset audit (9 boss sprites) | 9/9 present, 0 missing |
| Kill switch trace (enabled path) | Flagship draws, legacy gated — VERIFIED |
| Kill switch trace (disabled path) | Legacy renders fully — VERIFIED |
| Cross-boss contamination | None — VERIFIED |
| Telegraph preservation | All telegraphs draw regardless of visual swap — VERIFIED |

---

## 6. PRESERVED SYSTEMS (No Changes)

| System | CRABTRON Level 5 | EMPERADOR Level 20 |
|---|---|---|
| Hitboxes | Unchanged | Unchanged |
| Collisions | Unchanged | Unchanged |
| AI / Movement | Unchanged | Unchanged |
| Attack patterns | Unchanged | Unchanged |
| Phase transitions | Unchanged | Unchanged |
| HP / Damage | Unchanged | Unchanged |
| Rank / Balance | Unchanged | Unchanged |
| Spawn logic | Unchanged | Unchanged |
| Encounter flow | Unchanged | Unchanged |
| Boss HP bar / HUD | Unchanged | Unchanged |
| Telegraphs | Preserved (shoot/dash/muzzle) | Preserved (ImperialAura/TeleportIndicator) |

---

## 7. KNOWN STATE

### Sprite Lab Integration Status

```
PHASE A ✓  S04 Wedge player ship             — ACTIVE
PHASE B ✓  Faction sprites (Scout/Supp/Split) — ACTIVE
PHASE C ✓  Mini-boss hierarchy registration   — FROZEN (awaiting entity types)
PHASE D ✓  Imperial Flagship registration     — ACTIVE (wired to EMPERADOR)
PHASE E ✓  Orbital Siege Colossus registration — FROZEN (awaiting boss slot)

HC-WIRE-01 ✓  CRABTRON hero visual swap      — ACTIVE (level 5)
HC-WIRE-02 ✓  Flagship/EMPERADOR visual swap — ACTIVE (level 20)
HC-WIRE-03 ✓  Regression freeze              — CURRENT
```

### Unwired Assets (Frozen — Do Not Wire Without Approval)

| Asset | Reason Frozen |
|---|---|
| Mini-boss hierarchy (4 units) | No mini-boss entity types exist |
| Orbital Siege Colossus | No fortress boss slot exists |
| Imperial faction enemies | No imperial enemy spawn type exists |

---

## 8. FREEZE RULES

1. **No new boss visual swaps** without a new HC-SPRITE-WIRE ticket.
2. **No changes to existing HC-01/HC-02 wiring** without explicit approval.
3. **Kill switches must remain intact** — `spriteLab.imperialFlagship` must always fall back.
4. **Any change to draw.js boss section** requires re-running this freeze validation.
5. **New Sprite Lab wire tickets** are permitted for unwired assets (mini-bosses, fortress, imperial enemies) but must follow the same pattern: visual-only, kill switch, fallback, no gameplay.

---

## 9. GIT REFERENCE

```bash
069f656  hc-sprite-wire-02: wire Imperial Flagship visual into EMPERADOR level 20 boss
```

Previous visual-integration commits:
```bash
6b8aeba  feat(sprite-lab): register Orbital Siege runtime visuals
78abc2a  feat(sprite-lab): Phase D — register Imperial Flagship with visual phase support
71df99e  feat(sprite-lab): Phase C — register mini-boss hierarchy with visual-only rendering
```

---

## 10. SIGN-OFF

- [x] All JS validation passes
- [x] All 9 boss sprite assets present
- [x] Kill switches verified (on + off paths)
- [x] Fallback chain verified
- [x] Telegraphs preserved
- [x] Cross-boss contamination excluded
- [x] Gameplay/hitbox/collision/AI/balance preserved
- [x] Documentation created
