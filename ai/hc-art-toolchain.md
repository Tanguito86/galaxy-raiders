# HC-ART-TOOLCHAIN — Visual Toolchain Expansion

**Phase:** HC-ART  
**Status:** Active (toolchain defined)  
**Date:** 2026-05-23  
**Dependency:** HC-RD (frozen), HC Foundation (complete)

---

## 1. Toolchain Overview

### Available Tools

| Tool | Purpose | Status |
|------|---------|--------|
| **Pixelorama** | Pixel art editor, sprite creation, animation frames | ✅ Installed |
| **SpriteFactory** | Batch sprite generation from sprite sheets | ✅ Installed |
| **sprite-sheet-generator** | Sprite sheet packing and atlas creation | ✅ Installed |
| **sprite-sheet-creator** | Alternative sheet creation workflow | ✅ Installed |
| **falseprite** | Sprite manipulation and conversion tool | ✅ Installed |

### New Workflows to Add

| Workflow | Purpose | Priority |
|----------|---------|----------|
| **AI Concept Lab** | Enemy/boss ideation, silhouette exploration | P1 |
| **Palette Pipeline** | Color discipline, faction palettes, contrast validation | P0 |
| **FX Sandbox** | Explosions, flashes, beams — readability-first | P1 |
| **HUD Mockup Pipeline** | Layout iteration, score readability | P2 |
| **Silhouette Lab** | Shape recognition, threat communication | P1 |
| **Animation Reference** | Timing previews, motion readability | P2 |
| **Art Validation Rules** | Bullet clarity, no-RGB-chaos, no visual overload | P0 |

---

## 2. AI / Concept Tools

### Purpose
Generate enemy concepts, boss ideation, silhouette exploration, faction identity, and stage atmosphere. **Concepting only. No gameplay generation.**

### Recommended Tools

| Tool | Strengths | Art style compatibility |
|------|-----------|----------------------|
| **Midjourney** | Strong concept art, atmosphere, faction themes | Prompt for "pixel art sprite sheet, flat colors, dark outlines" |
| **DALL-E** | Controllable, safe for game assets | "16-bit era shmup enemy sprite, side view, black background" |
| **Stable Diffusion** | Local, free, batch-capable | LoRA fine-tuning on existing Galaxy Raiders sprites |
| **Pixel-art specific LoRAs** | Trained on pixel art datasets | Direct pixel-art output with consistent style |

### Workflow

```
1. Prompt iteration → Generate 10-20 concept thumbnails
2. Select top 3-5 silhouettes → Refine prompts
3. Import best concept → Pixelorama for pixel-level cleanup
4. Validate against HC-RD readability (silhouette, contrast)
5. Final sprite → SpriteFactory for sheet generation
```

### Constraints

- **Never** generate gameplay code, patterns, or mechanics.
- **Never** replace artist direction — AI is a concept accelerator.
- **Always** validate output against HC-RD readability rules.
- Concept images stay in `ai-generated/` — never go directly to `www/assets/`.

---

## 3. Palette Pipeline

### Purpose
Enforce color discipline across all visual assets. Every color choice must support readability and gameplay clarity.

### Core Principles

| Principle | Rule |
|-----------|------|
| **Saturation limits** | Background elements ≤ 40% saturation. Gameplay elements ≥ 60% saturation. |
| **Brightness discipline** | Bullets must be brighter than any background element. |
| **Contrast hierarchy** | Threats > Enemies > Player > Feedback > Background |
| **Faction identity** | Each enemy faction gets a distinct hue range. No overlap. |

### Faction Palette Reference

| Faction | Primary hue | Accent | Readability note |
|---------|-----------|--------|-----------------|
| **Player** | #00ccff (cyan) | #ffffff (white core) | Must contrast against all backgrounds |
| **Alien1 (scout)** | #ff5050 (red) | #ff8888 | Warm, aggressive. Avoid blue backgrounds. |
| **Alien2 (soldier)** | #ff8833 (orange) | #ffaa55 | Distinct from alien1 red. |
| **Alien3 (tank)** | #8844ff (purple) | #aa66ff | Heavy. Dark outline essential. |
| **Alien4 (speed)** | #44ff44 (green) | #88ff88 | Fast. May blend with some backgrounds. |
| **Alien5 (kamikaze)** | #ff4422 (deep red) | #ff6644 | Danger color. Maximum contrast. |
| **Alien6 (splitter)** | #44ddff (teal) | #88eeff | Distinct from player cyan. |
| **CRABTRON** | #ff3333 (boss red) | #ffa500 (orange accents) | Boss. Large. Must not blend. |
| **SERPENTRIX** | #33ff33 (boss green) | #88ff88 | Sweeping. Green must contrast dark backgrounds. |
| **ORBITAL** | #3388ff (boss blue) | #66bbff | Ring patterns. Blue on dark is readable. |
| **TENIENTE** | #ffaa00 (boss gold) | #ffcc44 | Hunter. Gold must not blend with bullets. |
| **EMPERADOR** | #ff44ff (boss magenta) | #ff88ff (white core) | Final boss. Maximum presence. |
| **Player bullets** | #00ffff (cyan) | #ffffff | Always distinguishable from enemy bullets |
| **Enemy bullets** | #ff3333 (generic) | HC-RD color taxonomy per type | Dark outline mandatory |

### Validation Test Sheet

Every new asset must pass:
1. **Silhouette test** — recognizable as pure black shape
2. **Background contrast test** — visible against all 4 theme backgrounds
3. **Bullet proximity test** — distinguishable from bullets within 50px
4. **Density test** — 3 copies overlapping still individually readable

---

## 4. FX Sandbox

### Purpose
Prototype visual effects in isolation before integrating into gameplay. Validate readability, measure clutter, control opacity.

### FX Types to Prototype

| FX | Priority | Constraints |
|----|----------|------------|
| **Explosion (small)** | P0 | ≤ 5 particles, ≤ 60% alpha, ≤ 30px radius |
| **Explosion (boss death)** | P0 | ≤ 15 particles, ≤ 80% alpha, medal rain counts separately |
| **Hit flash** | P0 | ≤ 45% alpha, ≤ 60ms duration, white core only |
| **Graze spark** | P1 | ≤ 5 particles, cyan, ≤ 40% alpha |
| **Beam telegraph** | P1 | Directional line, ≤ 55% alpha, dark outline |
| **Engine glow** | P2 | Subtle, behind ship, ≤ 30% alpha |
| **Warning overlay** | P2 | Border pulse, ≤ 25% alpha, never covers center |
| **FEVER overlay** | P2 | Subtle screen-edge pulse, pink, ≤ 15% alpha |

### Sandbox Rules

| Rule | Why |
|------|-----|
| **Never exceed HC-RD alpha ceilings** | Readability is sacred. |
| **FX must render in PRIORITY_FEEDBACK layer** | Never above bullets/telegraphs. |
| **Maximum 2 simultaneous FX types** | Prevents visual chaos during intense moments. |
| **No full-screen flashes** | Disorients player. Edge effects only. |
| **No additive blending on gameplay-critical layers** | Can wash out bullet outlines. |
| **Measure screen coverage** | FX must never obscure > 15% of gameplay area. |

---

## 5. HUD Mockup Pipeline

### Purpose
Iterate HUD layouts rapidly using paintovers and overlays. Validate score readability, multiplier visibility, and warning hierarchy.

### HUD Elements

| Element | Position | Priority | Font | Color |
|---------|----------|----------|------|-------|
| **Score** | Top-left | HIGH | 6px "Press Start 2P" | #5ff (cyan) |
| **Level** | Top-left, below score | MEDIUM | 6px | #5ff |
| **Multiplier** | Bottom-left | HIGH | 6px | Gold (#ffdd44) at ×2.5+ |
| **Chain** | Top-right | MEDIUM-HIGH | 6px | #9ee7ff (blue) |
| **Graze count** | Top-right | LOW | 6px | #5ff |
| **Boss HP bar** | Top-center | HIGH | Bar | Red fill, dark bg |
| **Warning banner** | Top-center, below HP | HIGH | 10px | #ff3333 (red) |
| **FEVER indicator** | Center-edge | LOW | Edge pulse | #ff3388 (pink) |
| **RECOVERING** | Bottom-center | HIGH | 6px | #ff6644 |
| **DANGER** | Top-right | MEDIUM | 5px | #ff8844 |

### Mockup Workflow

```
1. Screenshot dense gameplay moment
2. Open in Pixelorama / image editor
3. Paint over HUD elements at correct positions
4. Test hierarchy: can player find score/multiplier in 1 second?
5. Test contrast: is HUD readable against all backgrounds?
6. Test density: does HUD overlap threat areas?
7. Validate against HC-RD alpha rules
```

---

## 6. Silhouette Lab

### Purpose
Ensure every game entity is instantly recognizable by shape alone. Silhouette is the first thing the player's peripheral vision processes.

### Silhouette Design Principles

| Principle | Rule |
|-----------|------|
| **Instant recognition** | Must be identifiable as enemy/player/boss in < 200ms |
| **Peripheral readability** | Shape must be clear at screen edge, not just center |
| **Threat communication** | Larger silhouette = more dangerous. Sharp angles = aggressive. |
| **Faction consistency** | All aliens share family silhouette traits |
| **Boss uniqueness** | Each boss silhouette must be distinct from all others and from enemies |

### Validation Test

For every new sprite:
1. **Fill completely black (silhouette only)**
2. **Place on gameplay screenshot at natural position**
3. **Ask: "What is this?"** — must be answered correctly in < 1 second
4. **Test at 50% scale** — still recognizable?
5. **Test adjacent to 2 other silhouettes** — still distinct?

### Faction Silhouette Families

| Faction | Silhouette trait | Examples |
|---------|-----------------|----------|
| **Scouts (alien1/2)** | Small, rounded, symmetrical | Classic alien shape |
| **Tanks (alien3)** | Wide, heavy, rectangular | Slow-moving fortress |
| **Speed (alien4)** | Streamlined, teardrop, elongated | Fast-moving threat |
| **Kamikaze (alien5)** | Spiky, aggressive angles | Suicide attacker |
| **Splitter (alien6)** | Segmented, divided appearance | Breaks apart on death |
| **Bosses** | Massive, complex, multi-part | Centerpiece of level |

---

## 7. Animation Reference Pipeline

### Purpose
Preview sprite animations for timing, motion readability, and attack anticipation without modifying gameplay runtime.

### Workflow

```
1. Create sprite sheet with animation frames in Pixelorama
2. Export as sprite sheet PNG
3. Use sprite-sheet-generator to pack into game-ready format
4. Preview animation loop timing in Pixelorama timeline
5. Mock up in-game motion by overlaying frames on gameplay screenshot
```

### Animation Principles

| Principle | Rule |
|-----------|------|
| **Attack anticipation** | Enemy must telegraph 200-400ms before attack. Animation must support this. |
| **Motion readability** | Movement must be smooth enough to track, distinct enough to identify. |
| **Boss movement** | Boss animation frames must communicate phase transitions. |
| **Death animation** | Quick (≤ 500ms), satisfying, doesn't mask incoming threats. |
| **Spawn flash** | 200ms bright flash, then normal. Communicates "new enemy." |

---

## 8. Art Validation Rules

### Pre-Integration Checklist

Every new visual asset must pass ALL checks before entering `www/assets/`:

```
☐ Silhouette test (recognizable as black shape)
☐ Background contrast (visible against all 4 themes)
☐ Bullet contrast (distinguishable from bullets within 50px)
☐ Density test (3 overlapping still individually readable)
☐ Alpha discipline (no element exceeds HC-RD alpha ceilings)
☐ Priority layer compliance (renders in correct PRIORITY layer)
☐ FX clutter check (doesn't exceed 15% screen coverage)
☐ No RGB chaos (palette is disciplined, faction-assigned)
☐ No excessive bloom (no additive blending on threats)
☐ No background competition (decorative ≠ dangerous)
☐ Silhouette uniqueness (distinguishable from all existing entities)
☐ Size-appropriate (respects sprite grid: 3px cells)
```

### HC-RD Compliance

All art must respect:

| Rule | Source |
|------|--------|
| **Bullet outlines** | HC-RD bulletClarity.outline.enabled |
| **Alpha floors** | HC-RD visualPriority.alphaFloors |
| **Decorative suppression** | HC-RD fxSuppression, ambientFX |
| **Priority layers** | FATAL > TELEGRAPH > ENEMY > FEEDBACK > AMBIENT |
| **Glow caps** | HC-RD glowPolicy |
| **Color language** | HC-RD telegraphConsistency.colors |

---

## Implementation Priority

| Priority | Workflow | Reason |
|----------|----------|--------|
| **P0** | Art Validation Rules | Blocks all asset integration |
| **P0** | Palette Pipeline | Foundation for all color decisions |
| **P1** | AI Concept Lab | Accelerates enemy/boss iteration |
| **P1** | Silhouette Lab | Ensures readability of all new entities |
| **P1** | FX Sandbox | Validates effects before gameplay integration |
| **P2** | HUD Mockup Pipeline | Iterates HUD without touching code |
| **P2** | Animation Reference | Previews motion before implementation |
