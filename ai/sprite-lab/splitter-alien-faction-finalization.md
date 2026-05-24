# Splitter Alien Faction Finalization

## Generated Files

- `www/assets/sprites/enemies/splitter/splitter_alien_faction_sheet.png`
- `www/assets/sprites/metadata/splitter_alien_faction.json`
- `www/assets/sprites/previews/readability/splitter_alien_readability_preview.png`
- `www/assets/sprites/previews/runtime/splitter_alien_runtime_preview.png`
- `ai/sprite-lab/splitter-alien-faction-finalization.md`

## Input Files

- `www/assets/sprites/enemies/splitter/splitter_alien_mk1_master.png`
- `www/assets/sprites/enemies/splitter/splitter_alien_elite.png`
- `www/assets/sprites/enemies/splitter/splitter_alien_shard.png`
- `www/assets/sprites/enemies/splitter/splitter_alien_aberration.png`

## Faction Visual Language

Splitter Alien units use angular, fractured silhouettes with erratic limb layouts, cracked alien energy cores, and asymmetrical body geometry. They are intentionally chaotic, sharp, and unpredictable compared to the more structured Scout (organic insectoid) and Suppressor (heavy siege) factions. The faction reads as a volatile, shattering alien threat rather than an organized military force.

## Silhouette Validation

The faction maintains visual cohesion through shared angular language, cracked cores, and irregular appendage layouts while clearly separating roles. Mk1 is the baseline shattered form, elite is heavier with denser plates and stronger glow, shard is small and spike-like for swarm deployment, and aberration is the most distorted with extreme asymmetry. All variants preserve the same fractured energy identity while offering distinct gameplay-readable footprints.

## Readability Findings

The faction remains readable on black and dark blue backgrounds, within dense bullet clutter, and in mixed overlap simulations. Bright cracked energy cores and sharp angular limb silhouettes provide high-contrast recognition hooks. Variants are differentiated enough at 64x64 to support mixed chaotic formations without losing individual identity. Peripheral recognition is supported by the distinctive irregular outlines and core brightness.

## Android Readability Findings

The recommended gameplay size is 64x64 or larger. Cracked energy cores and sharp limb extensions remain visible on mobile-scale displays. Shard units are already compact and should not be further reduced in size. Aberration's irregular outline may cause minor peripheral confusion at very small scales; spacing in chaotic formations helps mitigate this. High-contrast backgrounds or bullet-light scenarios are recommended when using aberration-heavy compositions.

## Remaining Weaknesses

The faction's intentionally chaotic silhouette language sacrifices some formation readability at extreme ranges compared to the more orderly Scout or Suppressor factions. Aberration is the most visually complex unit and benefits from being used as a highlighted threat rather than in dense swarms. Shard reads best with enough spacing to show its spiky profile, since its small frame can blend if packed too tightly.

## Recommended Gameplay Usage

Use mk1 as the standard frontline splitter, elite as a heavier durable threat, shard as a fast fragmentation swarm unit, and aberration as an unstable boss/mini-boss tier enemy. Runtime hitboxes, AI behavior, balance, and rank should remain independent from these visual assets.
