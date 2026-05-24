# Scout Alien Faction Finalization

## Generated Files

- `www/assets/sprites/enemies/scout/scout_alien_faction_sheet.png`
- `www/assets/sprites/metadata/scout_alien_faction.json`
- `www/assets/sprites/previews/readability/scout_alien_readability_preview.png`
- `www/assets/sprites/previews/runtime/scout_alien_runtime_preview.png`
- `ai/sprite-lab/scout-alien-faction-finalization.md`

## Input Files

- `www/assets/sprites/enemies/scout/scout_alien_mk1_master.png`
- `www/assets/sprites/enemies/scout/scout_alien_elite.png`
- `www/assets/sprites/enemies/scout/scout_alien_sniper.png`
- `www/assets/sprites/enemies/scout/scout_alien_swarm.png`

## Faction Visual Language

Alien Scout units share a hostile biomechanical language: bone-green organic shell plates, dark purple chitin, cyan alien cores, thin cyan energy veins, and claw-like side appendages. The faction reads as a living-machine insectoid enemy group rather than a human military craft set.

## Silhouette Validation

The variants remain visually cohesive while separating their roles. Mk1 is the baseline interceptor, elite is wider and heavier, sniper is thinner and elongated, and swarm is smaller with simplified structure. Each keeps the same descending central body axis and hooked side-claw silhouette.

## Readability Findings

The faction remains readable on black and dark blue backgrounds, in dense bullet clutter, and in mixed overlap simulations. Cyan cores help identify the units quickly, while the larger shell shapes carry the main read. The variants are differentiated enough to support mixed formations without losing faction unity.

## Android Readability Findings

The recommended gameplay size is 64x64. At that scale, the shell outline, claw arcs, and cyan core remain legible in peripheral vision. Swarm units can be displayed slightly smaller in groups, but should not be reduced too far because their simplified details depend on the core and outline contrast.

## Remaining Weaknesses

Elite has the widest claw span, so crowded formations should leave enough lateral spacing to avoid merging silhouettes. Sniper is the narrowest unit, so it benefits from high contrast backgrounds or bullet spacing when used as a priority threat.

## Recommended Gameplay Usage

Use mk1 as the standard Alien Scout interceptor, elite as a higher-threat durable variant, sniper as a precise lane or aimed-shot threat, and swarm as a fast low-health group unit. Runtime hitboxes and balance should remain independent from these visual assets.
