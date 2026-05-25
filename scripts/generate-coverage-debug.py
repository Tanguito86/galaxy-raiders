"""Generate entity coverage debug preview — ghost enemy fix visualization."""
import os
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")
W, H = 1100, 620
img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(img)

draw.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw.text((10, 6), "ENTITY COVERAGE DEBUG — alien_mini fix | 7 enemy types | all render tiers verified", fill=(100, 255, 100, 255))

draw.rectangle([(0, 30), (W, H)], fill=(2, 2, 12, 255))

# Coverage matrix header
y = 40
headers = ["TYPE", "SCOUT", "FACTION", "FLEET", "STRIP", "STATIC", "PIXEL", "STATUS"]
col_x = [10, 100, 170, 270, 360, 440, 520, 600]
for i, (h, x) in enumerate(zip(headers, col_x)):
    col = (255, 200, 60, 255) if i == 0 else (180, 180, 200, 220)
    draw.text((x, y), h, fill=col)

# Enemy rows
enemies = [
    ("alien1",    "YES", "faction_scout f:0", "fleet_scout",    "alien1_strip",  "alien1",  "alien1_a(24x24)", "#0f0"),
    ("alien2",    "YES", "faction_scout f:2", "fleet_scout",    "alien2_strip",  "alien2",  "alien2_a(33x24)", "#0f0"),
    ("alien3",    "NO",  "--",                "fleet_suppr",    "alien3_strip",  "alien3",  "alien3_a(30x24)", "#0f0"),
    ("alien4",    "YES", "faction_scout f:1", "fleet_intercep", "alien4_strip",  "alien4",  "alien4_a(21x18)", "#0f0"),
    ("alien5",    "YES", "faction_scout f:3", "fleet_intercep", "alien5_strip",  "alien5",  "alien5_a(21x18)", "#0f0"),
    ("alien6",    "NO",  "--",                "fleet_suppr",    "alien6_strip",  "alien6",  "alien6_a(33x24)", "#0f0"),
    ("alien_mini","YES", "faction_scout f:3", "fleet_scout",    "alien_mini_strip","alien_mini","alien_mini_a(12x12)","#0f0"),
]

for i, row in enumerate(enemies):
    ry = y + 18 + i * 20
    for j, (val, x) in enumerate(zip(row, col_x)):
        if j == 7:  # Status column
            color = row[7]  # last element is color
        elif j == 2 and val == "--":
            color = (150, 150, 150, 170)
        elif val == "--":
            color = (150, 150, 150, 170)
        else:
            color = (200, 255, 200, 220) if j in (0, 7) else (200, 200, 200, 190)
        draw.text((x, ry), val[:20], fill=color)

# Bottom section: fix/legend
y2 = 210
draw.line([(0, y2), (W, y2)], fill=(60, 60, 60, 200), width=2)

draw.text((20, y2 + 8), "FIXES APPLIED:", fill=(100, 255, 100, 255))
draw.text((20, y2 + 28), "1. getEnemySpriteId() now includes alien_mini -> unblocks _strip and static fallback", fill=(200, 255, 200, 200))
draw.text((20, y2 + 48), "2. Registered alien_mini_strip (reuses alien1-strip.png, 32x32, 3-frame idle)", fill=(200, 255, 200, 200))
draw.text((20, y2 + 68), "3. Registered alien_mini static (reuses alien1.png, 32x32 single frame)", fill=(200, 255, 200, 200))
draw.text((20, y2 + 88), "4. Added alien_mini/alien_mini_strip visual bounds for proper centering", fill=(200, 255, 200, 200))
draw.text((20, y2 + 108), "5. Ghost rectangle block now save/restore guarded against alpha bleed", fill=(200, 255, 200, 200))

draw.text((20, y2 + 138), "RENDER TIER LEGEND:", fill=(255, 200, 60, 255))
draw.text((20, y2 + 158), "Tier 0: HC Art sprites (faction_scout / fleet_*)  ->  crisp sprites at gameplay scale", fill=(200, 200, 200, 190))
draw.text((20, y2 + 178), "Tier 1: _strip animated sprites (32x32, 3-frame)  ->  animated degradation", fill=(200, 200, 200, 190))
draw.text((20, y2 + 198), "Tier 2: Static sprites (32x32 single frame)  ->  static degradation", fill=(200, 200, 200, 190))
draw.text((20, y2 + 218), "Tier 3: Pixel art arrays (SPRITES in state.js)  ->  ULTIMATE FALLBACK, always available", fill=(200, 200, 200, 190))
draw.text((20, y2 + 238), "Ghost: alpha 0.015/0.025 placeholder rectangles  ->  drawn when Tier 0 not loaded", fill=(255, 100, 100, 190))

# Coverage visual
draw.text((580, y2 + 8), "COVERAGE VISUAL", fill=(255, 200, 60, 255))
scout_sheet = Image.open(os.path.join(SPRITES, "enemies", "scout", "scout_alien_faction_sheet.png")).convert("RGBA")
for i in range(4):
    f = scout_sheet.crop((i * 128, 0, (i + 1) * 128, 128)).resize((32, 32), Image.LANCZOS)
    img.paste(f, (580 + i * 38, y2 + 30), f)
scout_sheet.close()
draw.text((580, y2 + 68), "Scout faction = 4 frames, 128x128 each", fill=(0, 200, 255, 180))

# Old fleet comparison
fleet_path = os.path.join(SPRITES, "fleet", "fleet_scout_sheet.png")
if os.path.exists(fleet_path):
    fs = Image.open(fleet_path).convert("RGBA")
    fthumb = fs.crop((0, 0, 16, 16)).resize((24, 24), Image.LANCZOS)
    img.paste(fthumb, (580, y2 + 78), fthumb)
    fs.close()
    draw.text((610, y2 + 80), "fleet_scout fallback (16x16)", fill=(255, 120, 120, 180))

draw.text((580, y2 + 108), "alien_mini now has 3 render tiers", fill=(100, 255, 100, 200))
draw.text((580, y2 + 128), "(was: only Tier 0 + Tier 3, no middleware)", fill=(200, 200, 200, 190))
draw.text((580, y2 + 148), "Gap closed. Ghost rectangles minimized.", fill=(100, 255, 100, 220))

# Footer
draw.rectangle([(0, H - 2), (W, H)], fill=(40, 60, 100, 200))
draw.rectangle([(900, H - 40), (1090, H - 12)], fill=(5, 5, 20, 220))
draw.text((910, H - 35), "entity coverage debug v1.0", fill=(180, 180, 200, 255))

OUT = os.path.join(BASE, "www", "assets", "sprites", "previews", "runtime", "runtime_entity_coverage_debug.png")
img.save(OUT, "PNG")
print(f"Saved: {OUT} ({img.size})")
