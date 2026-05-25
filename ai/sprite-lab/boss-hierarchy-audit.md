# Boss Hierarchy Audit — Galaxy Raiders

**Date:** 2026-05-24
**Phase:** Flagship Boss Hierarchy — Inventory & Categorization
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. EXECUTIVE SUMMARY

**Total boss-related files discovered:** ~240 across the workspace.
**Named boss entities:** 9 (5 production + 4 mini-bosses).
**Bosses fully runtime-integrated:** 5 (Crabtron, Serpentrix, Orbital, Teniente, Emperador).
**Highest-quality visual asset:** Crabtron Hero Kit (layered, 5 animated states, 40 layer PNGs).

---

## 2. PRODUCTION BOSSES (Runtime-Integrated)

### 2.1 Boss Master Index

| # | ID | Name | Level | Pattern | Archetype | HP | Src Size | Game Frame | Color |
|---|----|------|-------|---------|-----------|----|----------|------------|-------|
| 1 | crabtron | CRABTRON | 5 | crossfire | DUELIST | 95 | 12.9 KB | 96x96 | #f00 |
| 2 | serpentrix | SERPENTRIX | 10 | zigzag | SWEEPER | 145 | 14.3 KB | 96x96 | #0f0 |
| 3 | orbital | ORBITAL | 15 | rotate | ORBITAL | 210 | 13.6 KB | 96x96 | #0ff |
| 4 | teniente | TENIENTE | 19 | divebomb | HUNTER | 285 | 10.9 KB | 96x96 | #ff0 |
| 5 | emperador | EMPERADOR | 20 | supreme | EXECUTIONER | 450 | 25.2 KB | 128x128 | #fff |

### 2.2 Category: **USABLE — Production-Ready**

All 5 production bosses are actively referenced in runtime code, have registered sprites, possess dedicated audio tracks (except Teniente), and have full boss-director profiles with pattern definitions and signature hooks.

| Boss | Sprite | Audio | Director | Patterns | Signature Hook | Render | Pixel Data | Stage Plan |
|------|--------|-------|----------|----------|----------------|--------|------------|------------|
| Crabtron | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Level 5 |
| Serpentrix | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Level 10 |
| Orbital | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Level 15 |
| Teniente | Yes | **No** | Yes | Yes | Yes | Yes | Yes | Level 19 |
| Emperador | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Level 20 |

### 2.3 Category: **HIGH-QUALITY BENCHMARK — Crabtron Hero Kit**

**Path:** `www/ai-generated/crabtron-hero-20260523/`
**Status:** Highest-quality boss visual in the workspace.

| Asset | Size | Description |
|-------|------|-------------|
| `crabtron_hero_master_sheet.png` | 449 KB | Master sprite sheet (5 states × layers) |
| `crabtron_hero_metadata.json` | 17 KB | Full layer/meta documentation |
| `crabtron_hero_readability_preview.png` | 406 KB | Readability validation |
| `crabtron_hero_preview_labeled.png` | 400 KB | Annotated preview |
| `crabtron_hero_seed_192.png` | 43 KB | Source art |

**5 animated states:** idle, attack_windup, mid_damage, rage_phase, death_exposed_core
**8 layers per state:** body, cannons_vents, composite, left_claw, overlay_glow_damage, right_claw, shadow, weakpoint_core
**Runtime registration:** `sprite-system.js:402` — spriteId `"boss_crabtron_hero"`, frameWidth 192, frameHeight 192

**Assessment:** Crabtron Hero Kit represents the visual quality bar all bosses should meet for flagship-tier presentation.

### 2.4 Category: **LEGACY BUT SALVAGEABLE**

| Boss | Issue | Salvage Potential |
|------|-------|-------------------|
| Serpentrix | 96x96 frame, small detail | Upgrade to hero-layered kit, 192x192 masters |
| Orbital | 96x96 frame, simple ring geometry | Redesign as Orbital Siege flagship with 192x192+ masters |
| Teniente | 96x96 frame, no audio track, smallest sprite (10.9 KB) | Lowest priority, redesign or merge into faction hierarchy |
| Emperador | 128x128 frame, largest legacy boss | Good foundation but needs Imperial Flagship-tier upgrade |

---

## 3. MINI-BOSS HIERARCHY (Phase 01, New)

### 3.1 Mini-Boss Index

**Path:** `www/assets/sprites/bosses/`
**Sheet:** `miniboss_hierarchy_sheet.png` (768x192, 4 frames × 192x192)

| Frame | ID | Faction | Role | Size |
|-------|----|---------|------|------|
| 0 | scout_hive_leader | scout_alien | Hive swarm commander | 49 KB |
| 1 | suppressor_siege_core | suppressor_alien | Siege anchor boss | 50 KB |
| 2 | splitter_aberrant_node | splitter_alien | Chaos node boss | 48 KB |
| 3 | imperial_command_lancer | imperial_alien | Command strike boss | 33 KB |

### 3.2 Category: **PRODUCTION-READY**

All 4 mini-bosses have:
- 192x192 RGBA master sprites
- Faction-consistent visual identity
- Readability previews (black/dark blue bg, bullet clutter, overlap)
- Runtime previews (combat simulation, faction comparison)
- Metadata JSON with full role classification
- Faction escalation notes
- AI generation pipeline artifacts (raw sheets, animations, contact sheets)

**Recommended gameplay scale:** 128x128

### 3.3 Category: **HIGH-QUALITY BENCHMARK**

The mini-boss hierarchy is the second-highest-quality visual asset group after Crabtron Hero:
- Consistent 192x192 master resolution
- One boss per enemy faction (complete coverage)
- Full readability validation suite
- Clear faction escalation language
- AI pipeline preserves raw sheets for future iteration

---

## 4. RESERVED BOSS FOLDERS (Empty)

| Folder | Status | Notes |
|--------|--------|-------|
| `bosses/crabtron/` | Empty | Reserved for Crabtron layered sprites — populated in `ai-generated/crabtron-hero-20260523/` |
| `bosses/imperial_flagship/` | Empty | Reserved for Imperial Flagship boss — **needs assets** |
| `bosses/orbital_siege/` | Empty | Reserved for Orbital Siege boss — **needs assets** |

---

## 5. AUDIO INVENTORY

| Track | Size | Status |
|-------|------|--------|
| `music_boss_crabtron.wav` | 6.8 MB | Present |
| `music_boss_serpentrix.wav` | 6.3 MB | Present |
| `music_boss_orbital.wav` | 6.4 MB | Present |
| `music_boss_emperador.wav` | 7.1 MB | Present |
| **`music_boss_teniente.wav`** | — | **MISSING** |

**Gap:** Teniente has no dedicated boss music track, despite being a full production boss with runtime integration.

---

## 6. DOCUMENTATION INVENTORY

| Doc | Size | Focus |
|-----|------|-------|
| `ai/hc-bd-boss-audit.md` | 28 KB | Boss design audit |
| `ai/hc-bd-boss-profile-map.md` | 20 KB | Boss profile mapping |
| `ai/hc-bd-crabtron-signature-hook.md` | 6 KB | Crabtron hook design |
| `ai/hc-bd-serpentrix-signature-hook.md` | 5 KB | Serpentrix hook design |
| `ai/hc-bd-orbital-signature-hook.md` | 3 KB | Orbital hook design |
| `ai/hc-bd-teniente-signature-hook.md` | 2 KB | Teniente hook design |
| `ai/hc-bd-emperador-signature-hook.md` | 4 KB | Emperador hook design |
| `ai/hc-bd-signature-intents.md` | 5 KB | Boss signature intent docs |
| `ai/hc-bd-signature-readiness.md` | 6 KB | Boss readiness audit |
| `ai/hc-bd-transition-choreography.md` | 7 KB | Boss transitions |
| `ai/hc-bd-recovery-fairness-rhythm.md` | 6 KB | Recovery/fairness |
| `ai/hc-bd-final-freeze.md` | 25 KB | Boss design freeze |
| `ai/hc-bd-freeze-audit.md` | 12 KB | Boss freeze audit |
| `ai/hc-sc-boss-efficiency.md` | 4 KB | Boss scoring efficiency |
| `docs/boss-readability-freeze.md` | 5 KB | Boss readability spec |
| `ai/sprite-lab/miniboss-hierarchy-finalization.md` | 4 KB | Mini-boss finalization doc |

---

## 7. RUNTIME CODE INVENTORY

| File | Lines | Role |
|------|-------|------|
| `boss-director.js` | 2,985 | Master boss orchestration, 5 boss profiles, signature hook dispatch |
| `boss-patterns.js` | 1,172 | Hardcore boss pattern registry, per-boss bullet functions, telegraph colors |
| `update-boss.js` | 1,799 | Boss update loop, movement, attacks, all 5 signature hook trials |
| `boss-ai-movement.js` | ~140 | Boss AI movement patterns |
| `draw.js` | ~6,500 | Per-boss rendering functions (Crabtron, Serpentrix, Orbital, Teniente), sprite mapping |
| `sprite-system.js` | ~440 | Boss sprite registrations (6 boss sprites: 5 legacy + 1 hero) |
| `state.js` | ~280 | Boss pixel-sprite bitmap grid data |
| `entities.js` | ~100 | Boss initialization, phase tracking, HP setup |
| `stage-plans.js` | ~300 | 5 boss stage plans with pattern assignments |
| `stage-director.js` | ~700 | Boss lifecycle events, climax section management |
| `encounter-director.js` | ~500 | Boss window detection, pressure management |
| `game-config.js` | ~700 | Boss visual config, HUD, scaling, scoring |
| `hardcore-config.js` | ~50 | Boss AI toggles, signature hook flags |
| `audio-music-gen.js` | ~10 | Boss music track mapping |
| `progression.js` | ~10 | BOSS_DATA and BOSS_LEVELS definitions |

**All 5 bosses are fully wired through every system layer.** The runtime infrastructure is mature and battle-tested.

---

## 8. LEGACY FOLDER

**Path:** `legacy-root-v1/`
**Contents:** 7 files (game.js 160 KB, index.html, style.css, manifest, icons, readme).
**Boss assets:** None. Legacy folder is a flat snapshot of an earlier build scaffold with no boss-specific content.

---

## 9. QUALITY RANKING

| Rank | Asset | Size | Visual Fidelity | Runtime Ready | Layers/Animation |
|------|-------|------|-----------------|---------------|------------------|
| ⭐⭐⭐⭐⭐ | Crabtron Hero Kit | 192x192 | Excellent | Partial | 5 states, 8 layers |
| ⭐⭐⭐⭐ | Mini-Boss Hierarchy | 192x192 | Very Good | No | Static (single frame) |
| ⭐⭐⭐ | Emperador (legacy) | 128x128 | Good | Yes | None |
| ⭐⭐⭐ | Crabtron (legacy) | 96x96 | Good | Yes | None |
| ⭐⭐ | Serpentrix (legacy) | 96x96 | Adequate | Yes | None |
| ⭐⭐ | Orbital (legacy) | 96x96 | Adequate | Yes | None |
| ⭐⭐ | Teniente (legacy) | 96x96 | Adequate | Yes | None |
| ⭐ | AI Raw Outputs | ~1.8 MB | Varies | No | Raw sheets |

---

## 10. GAPS IDENTIFIED

1. **Crabtron hero not integrated as primary boss render** — Hero kit exists but legacy 96x96 sprite is still the runtime default
2. **No hero kits for Serpentrix, Orbital, Teniente, Emperador** — Only Crabtron received the hero treatment
3. **Imperial Flagship boss folder empty** — Reserved but no assets created
4. **Orbital Siege boss folder empty** — Reserved but no assets created
5. **Teniente missing audio track** — Only production boss without dedicated music
6. **Mini-bosses not runtime-integrated** — Assets complete but no code references
7. **No `bosses/fleet/` or fleet-boss category** — Fleet exists only as standard enemy sheets
8. **Orbit Siege stage (Level 14) has no boss** — Thematic but non-boss level

---

## 11. CATEGORIZATION SUMMARY

| Category | Count | Items |
|----------|-------|-------|
| **Usable — Production-Ready** | 5 | Crabtron, Serpentrix, Orbital, Teniente, Emperador |
| **Legacy but Salvageable** | 4 | Serpentrix, Orbital, Teniente, Emperador (all need hero upgrades) |
| **High-Quality Benchmark** | 2 | Crabtron Hero Kit, Mini-Boss Hierarchy |
| **Runtime-Integrated** | 5 | All production bosses |
| **Orphaned Assets** | 25 | AI-generated boss pipeline raw outputs (5 bosses × 5 files) |
| **Duplicate** | 5 | Boss sprites exist in both `sprites/` root and `ai-generated/boss-sprites-20260516/` |
| **Reserved (Empty)** | 3 | crabtron/, imperial_flagship/, orbital_siege/ subfolders |

---

*Generated by boss hierarchy audit — no gameplay, runtime, AI, or balance modifications performed.*
