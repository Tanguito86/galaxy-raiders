# Player S04 Wedge Asset Prep

## Source

- Visual master: `www/ai-generated/player-spaceship/raw-sheet.png`
- Runtime asset master copy: `www/assets/sprites/player/player_s04_wedge_master.png`

## Generated Outputs

- `www/assets/sprites/player/player_s04_wedge_idle.png`
- `www/assets/sprites/player/player_s04_wedge_64.png`
- `www/assets/sprites/player/player_s04_wedge_sheet.png`
- `www/assets/sprites/player/player_s04_wedge.json`

## Cleanup Notes

- Removed the magenta concept background with a soft chroma key.
- Reduced magenta edge contamination in the antialias fringe.
- Preserved top-down orientation, wedge silhouette, ivory hull, blue/cyan accents, and orange engine accent.
- Normalized the cleaned idle asset to a transparent 256x256 canvas with safe padding.
- Built the 64x64 gameplay preview from the cleaned idle asset with transparent padding preserved.
- Built the 4-frame horizontal test sheet from the 64x64 preview.

## Known Limitations

- `bankLeft`, `bankRight`, and `boost` are placeholder frames derived from the idle frame.
- No proper animation pass has been authored yet.
- The master image remains the original generated concept source and is not itself a gameplay-ready transparent frame.

## Runtime Integration Notes

- Metadata uses `frameWidth` and `frameHeight` of 64.
- Pivot is set to `{ "x": 32, "y": 42 }` for preview alignment only.
- The asset is prepared for future sprite-system registration, but is not wired into gameplay in this pass.

## Gameplay Safety

- Gameplay code was not changed for this asset prep.
- Player hitbox was not changed.
- Collision, movement, rank, balance, enemies, bosses, stages, audio, and architecture were not changed.
