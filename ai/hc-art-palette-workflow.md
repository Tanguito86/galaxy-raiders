# HC-ART — Palette Workflow

**Phase:** HC-ART  
**Status:** Active (workflow defined)  
**Date:** 2026-05-23  
**Dependency:** HC-ART-TOOLCHAIN, HC-RD (frozen)

---

## Palette Discipline Rules

### Global Constraints

| Rule | Value | Reason |
|------|-------|--------|
| **Max palette per asset** | 8 colors | Enforces pixel-art discipline. Prevents gradient abuse. |
| **Saturation ceiling (bg)** | 40% | Backgrounds are atmosphere, not threats. |
| **Saturation floor (threats)** | 60% | Enemies and bullets must pop. |
| **Brightness hierarchy** | Bullets > Enemies > Player FX > Background | Lighter = more dangerous. |
| **No pure RGB** | #ff0000, #00ff00, #0000ff banned | Visually painful. Arcade aesthetic demands nuance. |

---

## Faction Palettes

### Player
```
Base:     #0066aa (deep blue)
Mid:      #0088cc
Highlight: #00aaff
Core:     #00ccff (engine glow)
Thruster: #ff6600 (orange exhaust)
Outline:  #001133 (dark)
```
*Always cyan-adjacent. Must contrast warm enemy tones.*

### Alien1 — Scout
```
Body:     #cc2222 (warm red)
Mid:      #ee4444
Highlight: #ff6666
Eye:      #ffffff (white dot)
Outline:  #220000 (dark red-black)
```
*Warm, aggressive. Standard enemy.*

### Alien2 — Soldier
```
Body:     #dd6622 (orange-brown)
Mid:      #ee8844
Highlight: #ffaa66
Eye:      #ffff88 (yellow dot)
Outline:  #221100 (dark orange-black)
```
*Distinct from alien1 red. Earthy tones.*

### Alien3 — Tank
```
Body:     #6633aa (deep purple)
Mid:      #8844cc
Highlight: #aa66ee
Cannon:   #ff4444 (red muzzle)
Outline:  #110022 (dark purple-black)
```
*Heavy. Purple communicates "durable."*

### Alien4 — Speed
```
Body:     #228833 (forest green)
Mid:      #44aa55
Highlight: #66cc77
Trail:    #88ff99 (speed lines)
Outline:  #001100 (dark green-black)
```
*Fast. Green. Streamlined.*

### Alien5 — Kamikaze
```
Body:     #cc2211 (deep danger red)
Mid:      #ee3322
Highlight: #ff5544
Eye:      #ffaa00 (burning orange)
Outline:  #220000
```
*Maximum aggression. Danger colors.*

### Alien6 — Splitter
```
Body:     #2288aa (teal)
Mid:      #44aacc
Highlight: #66ccff
Crack:    #ffffff (split line)
Outline:  #001122 (dark teal-black)
```
*Teal. Distinct from player cyan. Split line visible.*

### Bosses (see HC-ART-TOOLCHAIN Section 3)

---

## Background Palettes (4 Themes)

### Theme 1 — Deep Space (Levels 1-5)
```
Stars:    #ffffff (white, alpha varied)
Nebula:   #112244 (deep blue, 4% alpha)
Dust:     #223355 (blue-grey, 10% alpha)
Speed:    #334466 (lines, 8% alpha)
```
*Calm. Deep. Good contrast for warm enemy tones.*

### Theme 2 — Nebula Field (Levels 6-10)
```
Stars:    #ffeedd (warm white)
Nebula:   #331122 (deep purple-red, 4% alpha)
Dust:     #442233 (warm grey, 10% alpha)
Speed:    #553344 (lines, 8% alpha)
```
*Slightly warmer. Avoid blending with red bullets (HC-RD outlines mandatory).*

### Theme 3 — War Zone (Levels 11-15)
```
Stars:    #ccddff (cool white)
Nebula:   #112233 (dark navy, 3% alpha)
Dust:     #223344 (grey, 12% alpha)
Speed:    #445566 (lines, 10% alpha)
```
*Grittier. Higher dust = more atmosphere. Watch bullet contrast.*

### Theme 4 — Imperial Core (Levels 16-20)
```
Stars:    #ffccdd (rose white)
Nebula:   #220022 (deep magenta, 4% alpha)
Dust:     #331133 (purple-dark, 8% alpha)
Speed:    #442244 (lines, 6% alpha)
```
*Final chapters. Imperial aesthetic. Magenta must not compete with EMPERADOR.*

---

## Contrast Validation Grid

For every new asset, test against all 4 themes:

```
                    Deep Space  Nebula  War Zone  Imperial
Alien1 (red)        ✅          ✅       ✅        ✅
Alien2 (orange)     ✅          ✅       ✅        ✅
Alien3 (purple)     ✅          ⚠️       ✅        ⚠️ (close to Imperial bg)
Alien4 (green)      ✅          ✅       ✅        ✅
Alien5 (deep red)   ✅          ⚠️       ✅        ✅
Alien6 (teal)       ✅          ✅       ✅        ✅
Enemy bullets       ✅          ⚠️       ✅        ✅
Player bullets      ✅          ✅       ✅        ✅
Boss red            ✅          ✅       ✅        ✅
Boss green          ✅          ✅       ✅        ✅
Boss blue           ✅          ✅       ✅        ✅
Boss gold           ✅          ✅       ✅        ✅
Boss magenta        ✅          ✅       ✅        ⚠️ (close to Imperial bg)
```

⚠️ = requires HC-RD dark outline to resolve. All cases covered by existing HC-RD bulletClarity.

---

## Bullet Contrast Rules

| Bullet type | Default color | Must contrast with |
|------------|--------------|-------------------|
| Regular enemy | #ff3333 (red) | All 4 themes, all enemy sprites |
| Boss bullet | #ff5050 (bright red) | Boss sprite color, all themes |
| Tank bullet | #ff6622 (orange-red) | Alien3 purple body |
| Orb bullet | #4488ff (blue) | All themes, ORBITAL boss |
| Splitter bullet | #44ddff (teal) | Alien6 teal body |
| Player bullet | #00ffff (cyan) | All themes, all enemies |
| Player laser | #ffffff (white) + cyan core | All themes, all enemies |

**All bullets must have dark outline (#050308, alpha 0.42, lineWidth 1.0-1.5).**

---

## Working with Pixelorama

### Setup
1. Create new project: 3px grid, indexed palette mode
2. Load faction palette as custom palette
3. Set background to transparent
4. Enable grid overlay (3px)

### Export
1. Export as PNG, no compression
2. Verify colors match palette (no unintended dithering)
3. Run through SpriteFactory for game-ready format
4. Place in `www/assets/` or `www/ai-generated/` as appropriate
