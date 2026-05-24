# Imperial Alien Faction Finalization

## Generated Files

- `www/assets/sprites/enemies/imperial/imperial_alien_faction_sheet.png`
- `www/assets/sprites/metadata/imperial_alien_faction.json`
- `www/assets/sprites/previews/readability/imperial_alien_readability_preview.png`
- `www/assets/sprites/previews/runtime/imperial_alien_runtime_preview.png`
- `ai/sprite-lab/imperial-alien-faction-finalization.md`

## Input Files

- `www/assets/sprites/enemies/imperial/imperial_alien_mk1_master.png`
- `www/assets/sprites/enemies/imperial/imperial_alien_elite.png`
- `www/assets/sprites/enemies/imperial/imperial_alien_lancer.png`
- `www/assets/sprites/enemies/imperial/imperial_alien_guardian.png`

## Faction Visual Language

Imperial Alien units use rigidly symmetrical, geometric armor shells, glowing vertical energy crests, and disciplined militaristic silhouettes. They are intentionally orderly, imposing, and hierarchical compared to the organic chaos of Scout, the heavy siege mass of Suppressor, and the fractured volatility of Splitter. The faction reads as a commanding alien military force with clear rank and formation structure.

## Silhouette Validation

The faction maintains complete visual cohesion through shared geometric armor language, vertical crests, and rigid symmetry while clearly separating unit roles. Mk1 is the baseline symmetrical line unit, elite is taller with denser armor and a brighter command crest, lancer has a narrow forward-projecting strike geometry, and guardian is the widest with shield-like frontal armor. All variants preserve the same disciplined axis while offering distinct gameplay footprints.

## Readability Findings

The faction remains readable on black and dark blue backgrounds, in dense bullet clutter, and in mixed overlap simulations. Straight armor lines and bright vertical crests provide instant recognition hooks. Geometric symmetry supports peripheral identification because the brain rapidly anchors on the centerline crest. Variants are well-differentiated at 64x64 for mixed formation deployment.

## Android Readability Findings

The recommended gameplay size is 64x64 or larger. Vertical crests and rigid geometric outlines hold up well on mobile-scale displays. Lancer requires the most attention on mobile because its narrow forward profile has less lateral mass to anchor the read; using it with contrast emphasis or in visible lanes is recommended. Guardian's wide shield form provides the strongest readability on small screens.

## Remaining Weaknesses

The faction's rigid symmetry is a strength for clarity but reduces organic expressiveness compared to the Scout or Splitter factions. Lancer's narrow forward geometry can be harder to track laterally when scrolling at speed; it is best used as a direct-threat enemy where its facing direction communicates intent. Guardian formations should space their wide silhouettes to avoid merging into a single mass.

## Recommended Gameplay Usage

Use mk1 as the standard Imperial line infantry, elite as a commanding durable threat, lancer as a precision strike/lane denial unit, and guardian as a heavy defensive anchor or blocker. Runtime hitboxes, AI behavior, balance, and rank should remain independent from these visual assets.
