# Boss Hierarchy Recommended Roadmap — Galaxy Raiders

**Date:** 2026-05-24
**Based on:** Boss Hierarchy Audit (2026-05-24)
**Workspace:** `H:\DEV\AGENTE\GALAXY\GALAXY RAIDERS`

---

## 1. STRATEGIC OVERVIEW

The Galaxy Raiders boss roster has a solid foundation: 5 runtime-integrated bosses, a high-quality Crabtron Hero Kit as the visual benchmark, and 4 Phase 01 mini-bosses ready for integration. The roadmap focuses on elevating visual quality to a unified flagship standard while preserving all existing gameplay balance, AI, and runtime logic.

**Core principle:** Every boss should eventually meet the Crabtron Hero Kit standard — 192x192+ master resolution, layered/animated states where appropriate, full readability validation, and faction-consistent visual language.

---

## 2. PRODUCTION ORDER (Priority Ranking)

### Tier 1 — Immediate (Complete the Crabtron Pipeline)

| Priority | Boss | Action | Rationale |
|----------|------|--------|-----------|
| **P1** | Crabtron | Integrate hero kit as default runtime render | Hero kit exists, registered in sprite-system, but legacy 96x96 sprite is still the active render. Switching to hero layers unlocks the animated states (idle/attack/damage/rage/death). Zero new assets needed — just a draw.js rendering path switch. |
| **P2** | Mini-Boss Hierarchy | Wire into encounter-director as midboss entities | All 4 mini-bosses have complete asset packs (sheet, metadata, previews). They need runtime registration and encounter-director hooks. No asset work required. |

### Tier 2 — Short-Term (Hero Kit Upgrades)

| Priority | Boss | Action | Rationale |
|----------|------|--------|-----------|
| **P3** | Emperador | Create Imperial Flagship hero kit | Emperador is the final boss and the largest legacy sprite (128x128). Deserves the highest-priority hero upgrade. The empty `bosses/imperial_flagship/` folder is reserved for this. Rename/retheme as Imperial Flagship for faction consistency with the Imperial alien faction. |
| **P4** | Orbital | Create Orbital Siege hero kit | Second-largest visual presence, unique ring-based geometry. The empty `bosses/orbital_siege/` folder is reserved for this. Redesign as Orbital Siege flagship for faction consistency. |
| **P5** | Serpentrix | Create Serpentrix hero kit | Mid-game boss with distinct serpent/dragon silhouette. Upgrade to 192x192 master with layered animation states. |

### Tier 3 — Medium-Term (Cleanup and Polish)

| Priority | Boss | Action | Rationale |
|----------|------|--------|-----------|
| **P6** | Teniente | Evaluate: upgrade or replace | Smallest boss sprite (10.9 KB), no audio track, visually least distinct. Consider retiring Teniente and replacing with a new Imperial-theme boss that bridges the mini-boss Imperial Command Lancer and the Imperial Flagship final boss. If retained, needs 192x192 hero kit + audio. |
| **P7** | All bosses | Run faction-consistency pass | Ensure each boss's visual language aligns with its corresponding enemy faction (e.g., Imperial bosses use geometric/crest language, Splitter bosses use chaotic/fractured language). |

### Tier 4 — Long-Term (Expansion)

| Priority | Action | Rationale |
|----------|--------|-----------|
| **P8** | Boss layering/animation system | Build a unified layering and animation pipeline for all bosses (based on Crabtron Hero Kit patterns). Define standard states: idle, attack_windup, mid_damage, rage_phase, death. |
| **P9** | Boss-specific visual effects | Per-boss VFX: muzzle flashes, energy auras, damage overlays, telegraph effects. Some exist in draw.js but need sprite-based replacements for consistency. |
| **P10** | Audio gap fill | Teniente (or its replacement) needs a dedicated boss music track. Consider faction-theme boss music (not just per-boss) for scalability. |

---

## 3. UPGRADE RECOMMENDATIONS

| Boss | Current Status | Recommended Upgrade | Keep/Replace |
|------|---------------|---------------------|--------------|
| **Crabtron** | Legacy 96x96 + Hero Kit (192x192) | Switch runtime render to hero kit layers | **KEEP** — hero kit is excellent |
| **Serpentrix** | Legacy 96x96 | 192x192 hero kit, layered states | **UPGRADE** — distinct silhouette worth preserving |
| **Orbital** | Legacy 96x96 | 192x192 Orbital Siege hero kit, ring animation layers | **UPGRADE** — unique ring/geometry identity |
| **Teniente** | Legacy 96x96, no audio | Evaluate: **REPLACE** or upgrade to 192x192 | **REPLACE (recommended)** — weakest visual, fill gap with Imperial mid-boss |
| **Emperador** | Legacy 128x128 | 192x192 Imperial Flagship hero kit, full layer kit | **UPGRADE** — final boss deserves flagship treatment |
| **Scout Hive Leader** | 192x192 (Phase 01) | Runtime integration only | **KEEP** — production-ready |
| **Suppressor Siege Core** | 192x192 (Phase 01) | Runtime integration only | **KEEP** — production-ready |
| **Splitter Aberrant Node** | 192x192 (Phase 01) | Runtime integration only | **KEEP** — production-ready |
| **Imperial Command Lancer** | 192x192 (Phase 01) | Runtime integration only | **KEEP** — production-ready |

---

## 4. REUSE RECOMMENDATIONS

| Asset | Reuse Potential | How |
|-------|----------------|-----|
| Crabtron Hero Kit | **Full reuse** | Switch runtime render path to hero layers. All 5 states (idle, attack, damage, rage, death) are production-ready. |
| Mini-Boss Hierarchy Sheet | **Full reuse** | Register in sprite-system.js, wire into encounter-director.js as midboss encounters. Metadata JSON provides all needed config. |
| Crabtron AI (boss-director) | **Preserve** | No gameplay changes. Hero kit is purely a visual swap. |
| All 5 boss pattern functions | **Preserve** | No bullet pattern modifications. Visual upgrades are separate. |
| All 5 signature hooks | **Preserve** | Signature hook logic is runtime-only. Visual presentation can be enhanced without touching hook code. |
| Boss audio tracks | **Preserve** | All 4 existing tracks remain valid. Only add Teniente/replacement track. |
| Legacy sprites (96x96) | **Fallback** | Keep as compatibility fallback during hero kit transition period. Remove once hero kits are stable. |
| AI raw outputs (1-2 MB) | **Reference** | Keep for future regeneration needs. Not for runtime use. |

---

## 5. REPLACE RECOMMENDATIONS

| Asset | Reason | Replacement |
|-------|--------|-------------|
| **Teniente** (boss #4, level 19) | Smallest boss sprite (10.9 KB), no audio track, visually least distinct silhouette, weak faction identity | Replace with an **Imperial-themed mid-boss** that bridges the Imperial Command Lancer (mini-boss) and Imperial Flagship (final boss). Creates a clean Imperial faction boss progression: Command Lancer → Imperial Mid-Boss → Imperial Flagship. |
| Legacy 96x96 boss renders | Once hero kits are stable, the legacy 96x96 sprites become obsolete | Remove from active sprite registration, archive as legacy reference. |
| AI raw boss outputs (1-2 MB files) | Unused in runtime, duplicate of production sprites | Archive or delete after confirming no regeneration is needed. |

---

## 6. FACTION BOSS OWNERSHIP MAP

| Faction | Enemy Tier | Mini-Boss (Phase 01) | Production Boss | Flagship/End Boss |
|---------|-----------|---------------------|-----------------|-------------------|
| **Scout** | Scout Alien (4 variants) | Scout Hive Leader | Serpentrix | — |
| **Suppressor** | Suppressor Alien (4 variants) | Suppressor Siege Core | Crabtron | — |
| **Splitter** | Splitter Alien (4 variants) | Splitter Aberrant Node | — | — |
| **Imperial** | Imperial Alien (4 variants) | Imperial Command Lancer | Teniente → **Imperial Mid-Boss** (new) | Emperador → **Imperial Flagship** |
| **Orbital** | — | — | Orbital → **Orbital Siege** | — |

**Note:** Crabtron currently doesn't map cleanly to a faction. Consider assigning Crabtron to the Suppressor faction since the Suppressor Siege Core mini-boss shares heavy/siege visual language. Alternatively, Crabtron remains an independent boss archetype.

---

## 7. VISUAL CONSISTENCY EVALUATION

| Dimension | Current State | Target State |
|-----------|--------------|--------------|
| **Resolution** | Mixed: 96x96 (legacy), 128x128 (Emperador), 192x192 (hero/mini-boss) | Unified 192x192+ for all bosses |
| **Layering** | Only Crabtron has layered states | All bosses: idle, attack, damage, rage, death layered kits |
| **Faction Identity** | Weak for legacy bosses, strong for mini-bosses | Every boss maps to a faction with consistent visual language |
| **Readability** | Untested for legacy bosses, validated for mini-bosses | Full readability validation suite for all bosses |
| **Animation** | Crabtron only (5 states) | All Tier 1-2 bosses: at minimum idle + damage + death states |
| **Previews** | Only Crabtron hero + mini-boss hierarchy have previews | Every boss pack includes readability + runtime previews |
| **Audio Coverage** | 4/5 bosses have audio | 5/5 bosses (fill Teniente gap or replace) |

---

## 8. IMMEDIATE NEXT ACTIONS

1. **Integrate Crabtron Hero Kit** — Switch `draw.js` rendering from `boss_crabtron` (legacy 96x96) to `boss_crabtron_hero` (192x192 layered). The sprite is already registered at `sprite-system.js:402`.

2. **Wire Mini-Boss Hierarchy** — Register the 4 mini-boss sprites in `sprite-system.js`, add midboss entity types to `entities.js`, and create encounter hooks in `encounter-director.js`.

3. **Design Imperial Flagship Hero Kit** — Use the Emperador sprite as source material, escalate to 192x192, create layered states following the Crabtron Hero Kit pattern, populate `bosses/imperial_flagship/`.

4. **Evaluate Teniente** — Decide keep/replace before investing in hero kit work. If replacing, design the Imperial mid-boss concept in parallel with the Imperial Flagship.

---

*Generated by boss hierarchy roadmap — no gameplay, runtime, AI, or balance modifications performed. This document is purely a planning artifact.*
