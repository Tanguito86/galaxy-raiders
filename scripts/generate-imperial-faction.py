"""Generate Imperial Alien faction assets — sheet, previews, metadata."""
import json, os, random
from datetime import date
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")
IMPERIAL_DIR = os.path.join(SPRITES, "enemies", "imperial")

UNIT_IDS = [
    "imperial_alien_mk1_master",
    "imperial_alien_elite",
    "imperial_alien_lancer",
    "imperial_alien_guardian",
]
UNIT_FILES = {u: os.path.join(IMPERIAL_DIR, f"{u}.png") for u in UNIT_IDS}
UNIT_ROLES = {
    "imperial_alien_mk1_master": "standard_imperial_line_infantry",
    "imperial_alien_elite":      "elite_imperial_commander",
    "imperial_alien_lancer":     "precision_strike_lancer",
    "imperial_alien_guardian":   "heavy_defensive_guardian",
}
UNIT_NOTES = {
    "imperial_alien_mk1_master": "Standard Imperial line unit with symmetric geometric armor, glowing crest, and disciplined posture.",
    "imperial_alien_elite":      "Elite-tier Imperial with reinforced armor plating, enhanced crest glow, and commanding vertical presence.",
    "imperial_alien_lancer":     "Narrow, angular strike unit with forward-projecting lance geometry and streamlined aggressive profile.",
    "imperial_alien_guardian":   "Wide, heavy defense unit with broad shield-like frontal plates and imposing armored bulk.",
}

# --- 1. FACTION SPRITE SHEET ---
print("Creating faction sprite sheet...")
images = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}
sheet = Image.new("RGBA", (128 * 4, 128))
for idx, uid in enumerate(UNIT_IDS):
    sheet.paste(images[uid], (idx * 128, 0))
SHEET_PATH = os.path.join(IMPERIAL_DIR, "imperial_alien_faction_sheet.png")
sheet.save(SHEET_PATH, "PNG")
for img in images.values():
    img.close()
print(f"  -> {SHEET_PATH} ({sheet.size})")

# --- 2. METADATA JSON ---
print("Creating metadata JSON...")
metadata = {
    "factionId": "imperial_alien",
    "project": "Galaxy Raiders",
    "type": "enemy_faction",
    "version": "1.0",
    "date": str(date.today()),
    "sheet": {
        "path": "www/assets/sprites/enemies/imperial/imperial_alien_faction_sheet.png",
        "layout": "horizontal",
        "frameWidth": 128,
        "frameHeight": 128,
        "frames": 4,
    },
    "recommendedGameplaySize": {"width": 64, "height": 64},
    "pivot": {"x": 64, "y": 64, "anchor": "center"},
    "units": {},
    "frameMapping": [],
    "readabilityNotes": [],
    "androidReadabilityNotes": [],
    "silhouetteNotes": [],
    "imperialDisciplineNotes": [],
    "integrationNotes": [],
}

for idx, uid in enumerate(UNIT_IDS):
    metadata["units"][uid] = {
        "roleClassification": UNIT_ROLES[uid],
        "frame": idx,
        "file": f"www/assets/sprites/enemies/imperial/{uid}.png",
        "notes": UNIT_NOTES[uid],
    }
    metadata["frameMapping"].append({"frame": idx, "unitId": uid})

metadata["readabilityNotes"] = [
    "Imperial units use symmetrical, geometric armor shells, glowing vertical energy crests, and disciplined militaristic silhouettes.",
    "The faction contrasts with Scout (organic insectoid), Suppressor (heavy siege), and Splitter (chaotic fractured): Imperials are rigid, orderly, and imposing.",
    "Straight armor lines and bright vertical crests provide clear recognition through dense bullet clutter.",
    "Variant silhouettes remain distinct at 64x64: mk1 is baseline symmetrical, elite is taller and denser, lancer is narrow with forward-pointing geometry, guardian is wide and shield-like.",
]
metadata["androidReadabilityNotes"] = [
    "Recommended display size is 64x64 or larger due to the fine geometry within armor panels.",
    "Bright vertical crests and strong geometric outlines remain visible on small mobile displays.",
    "Lancer's narrow profile benefits from contrast emphasis when used as a priority threat on mobile.",
    "Guardian's wide shield form is the most readable variant at any scale.",
]
metadata["silhouetteNotes"] = [
    "Faction identity comes from rigid symmetry, geometric armor plating, glowing vertical energy crests, and disciplined military posture.",
    "Mk1 reads as a standard line unit with balanced symmetric geometry.",
    "Elite reads as a command-tier variant through increased armor density and taller crest.",
    "Lancer reads as a precision strike threat through its narrow forward-projecting lance form.",
    "Guardian reads as a heavy defensive anchor through its wide shield-like frontal mass.",
]
metadata["imperialDisciplineNotes"] = [
    "The Imperial faction is designed to read as a disciplined, hierarchical alien military force.",
    "Symmetrical geometry and rigid armor lines convey order, rank, and predictability in silhouette.",
    "Formation coherence is supported by shared vertical axis alignment and consistent crest language.",
    "The faction's visual identity intentionally contrasts with the organic chaos of non-Imperial alien types.",
]
metadata["integrationNotes"] = [
    "Asset preparation only; no gameplay, draw.js, runtime logic, collisions, hitboxes, AI, rank, or balance changes were made.",
    "Sheet frame order is mk1_master, elite, lancer, guardian.",
]

META_PATH = os.path.join(SPRITES, "metadata", "imperial_alien_faction.json")
with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2)
print(f"  -> {META_PATH}")

# --- 3. READABILITY PREVIEW (1100x620) ---
print("Creating readability preview...")
W, H = 1100, 620
rv = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(rv)

imgs = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}

# Zone A: Black background
draw.rectangle([(0, 0), (550, 310)], fill=(0, 0, 0, 255))
draw.rectangle([(0, 0), (550, 30)], fill=(20, 20, 30, 255))
draw.text((10, 6), "READABILITY — imperial_alien (black bg)", fill=(200, 200, 200, 255))

rv.paste(imgs[UNIT_IDS[0]], (40, 60), imgs[UNIT_IDS[0]])
draw.text((40, 200), "mk1_master", fill=(180, 180, 180, 255))
rv.paste(imgs[UNIT_IDS[1]], (170, 60), imgs[UNIT_IDS[1]])
draw.text((170, 200), "elite", fill=(180, 180, 180, 255))
rv.paste(imgs[UNIT_IDS[2]], (300, 60), imgs[UNIT_IDS[2]])
draw.text((300, 200), "lancer", fill=(180, 180, 180, 255))
rv.paste(imgs[UNIT_IDS[3]], (430, 60), imgs[UNIT_IDS[3]])
draw.text((430, 200), "guardian", fill=(180, 180, 180, 255))

# Zone B: Dark blue background
draw.rectangle([(550, 0), (1100, 310)], fill=(10, 15, 40, 255))
draw.rectangle([(550, 0), (1100, 30)], fill=(15, 20, 50, 255))
draw.text((560, 6), "READABILITY — dark blue bg", fill=(180, 180, 200, 255))

rv.paste(imgs[UNIT_IDS[0]], (570, 60), imgs[UNIT_IDS[0]])
draw.text((570, 200), "mk1_master", fill=(160, 160, 180, 255))
rv.paste(imgs[UNIT_IDS[1]], (700, 60), imgs[UNIT_IDS[1]])
draw.text((700, 200), "elite", fill=(160, 160, 180, 255))
rv.paste(imgs[UNIT_IDS[2]], (830, 60), imgs[UNIT_IDS[2]])
draw.text((830, 200), "lancer", fill=(160, 160, 180, 255))
rv.paste(imgs[UNIT_IDS[3]], (960, 60), imgs[UNIT_IDS[3]])
draw.text((960, 200), "guardian", fill=(160, 160, 180, 255))

draw.line([(0, 310), (W, 310)], fill=(60, 60, 60, 200), width=2)

# Zone C: Bullet clutter + overlap (bottom)
draw.rectangle([(0, 312), (W, 620)], fill=(15, 18, 30, 255))
draw.rectangle([(0, 312), (W, 340)], fill=(20, 25, 40, 255))
draw.text((10, 318), "CLUTTER SIMULATION — dense bullets + overlap", fill=(200, 200, 200, 255))

random.seed(42)
bullet_colors = [
    (255, 80, 80, 200), (255, 160, 40, 200), (255, 220, 60, 200),
    (255, 100, 100, 180), (255, 255, 255, 160), (0, 200, 255, 180),
    (200, 0, 255, 160), (255, 60, 60, 140),
]
for _ in range(900):
    bx = random.randint(5, W - 10)
    by = random.randint(350, 610)
    br = random.randint(1, 4)
    bc = random.choice(bullet_colors)
    draw.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=bc)

# Overlap clusters
rv.paste(imgs[UNIT_IDS[0]], (80, 400), imgs[UNIT_IDS[0]])
rv.paste(imgs[UNIT_IDS[1]], (130, 420), imgs[UNIT_IDS[1]])
draw.text((80, 540), "mk1+elite overlap", fill=(220, 220, 220, 255))

rv.paste(imgs[UNIT_IDS[2]], (350, 400), imgs[UNIT_IDS[2]])
rv.paste(imgs[UNIT_IDS[3]], (390, 410), imgs[UNIT_IDS[3]])
draw.text((340, 540), "lancer+guard overlap", fill=(220, 220, 220, 255))

rv.paste(imgs[UNIT_IDS[0]], (600, 400), imgs[UNIT_IDS[0]])
rv.paste(imgs[UNIT_IDS[1]], (650, 420), imgs[UNIT_IDS[1]])
rv.paste(imgs[UNIT_IDS[2]], (700, 400), imgs[UNIT_IDS[2]])
rv.paste(imgs[UNIT_IDS[3]], (750, 420), imgs[UNIT_IDS[3]])
draw.text((600, 540), "all 4 mixed overlap", fill=(220, 220, 220, 255))

draw.ellipse([(900, 370), (960, 430)], outline=(100, 255, 100, 180), width=2)
draw.text((910, 440), "peripheral", fill=(120, 255, 120, 200))

READ_PATH = os.path.join(SPRITES, "previews", "readability", "imperial_alien_readability_preview.png")
rv.save(READ_PATH, "PNG")
print(f"  -> {READ_PATH} ({rv.size})")

# --- 4. RUNTIME PREVIEW (1100x620) ---
print("Creating runtime preview...")
rt = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw_rt = ImageDraw.Draw(rt)

draw_rt.rectangle([(0, 0), (W, H)], fill=(2, 2, 12, 255))
for _ in range(300):
    sx = random.randint(0, W)
    sy = random.randint(0, H)
    sr = random.randint(0, 1)
    sb = random.randint(80, 200)
    draw_rt.ellipse([(sx - sr, sy - sr), (sx + sr, sy + sr)], fill=(sb, sb, sb, 200))

draw_rt.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw_rt.text((10, 6), "RUNTIME PREVIEW — imperial_alien faction | disciplined formations | combat readability", fill=(200, 200, 200, 255))

# Player ship
draw_rt.polygon([(530, 540), (550, 570), (570, 540)], fill=(0, 200, 255, 200))
draw_rt.polygon([(530, 540), (540, 520), (550, 540)], fill=(0, 150, 220, 180))
draw_rt.text((535, 575), "PLAYER", fill=(0, 200, 255, 200))

# Disciplined formations
# Line formation (top)
rt.paste(imgs[UNIT_IDS[0]], (80, 60), imgs[UNIT_IDS[0]])
rt.paste(imgs[UNIT_IDS[0]], (180, 60), imgs[UNIT_IDS[0]])
rt.paste(imgs[UNIT_IDS[0]], (280, 60), imgs[UNIT_IDS[0]])
draw_rt.text((80, 200), "line_formation (mk1)", fill=(200, 200, 200, 200))

# V formation (center-right)
rt.paste(imgs[UNIT_IDS[1]], (580, 60), imgs[UNIT_IDS[1]])
rt.paste(imgs[UNIT_IDS[2]], (680, 100), imgs[UNIT_IDS[2]])
rt.paste(imgs[UNIT_IDS[2]], (680, 20), imgs[UNIT_IDS[2]])
draw_rt.text((580, 170), "v_formation (elite+lancers)", fill=(200, 200, 200, 200))

# Guardian wall (mid-left)
rt.paste(imgs[UNIT_IDS[3]], (80, 300), imgs[UNIT_IDS[3]])
rt.paste(imgs[UNIT_IDS[3]], (210, 300), imgs[UNIT_IDS[3]])
rt.paste(imgs[UNIT_IDS[0]], (340, 300), imgs[UNIT_IDS[0]])
draw_rt.text((80, 440), "guardian_wall", fill=(200, 200, 200, 200))

# Mixed command squad (lower-right)
rt.paste(imgs[UNIT_IDS[1]], (700, 280), imgs[UNIT_IDS[1]])
rt.paste(imgs[UNIT_IDS[0]], (830, 300), imgs[UNIT_IDS[0]])
rt.paste(imgs[UNIT_IDS[3]], (930, 280), imgs[UNIT_IDS[3]])
rt.paste(imgs[UNIT_IDS[2]], (820, 350), imgs[UNIT_IDS[2]])
draw_rt.text((700, 430), "command_squad (all)", fill=(200, 200, 200, 200))

# Enemy bullets — disciplined spreads
for _ in range(200):
    bx = random.randint(20, W - 20)
    by = random.randint(140, 560)
    br = random.randint(1, 3)
    bc = random.choice([(255, 60, 40, 200), (255, 140, 30, 200), (255, 200, 50, 180), (255, 60, 60, 160)])
    draw_rt.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=bc)

# Player bullets — cyan
for _ in range(60):
    bx = random.randint(450, 650)
    by = random.randint(300, 520)
    draw_rt.ellipse([(bx - 1, by - 1), (bx + 1, by + 1)], fill=(0, 220, 255, 220))

draw_rt.rectangle([(900, 570), (1090, 600)], fill=(5, 5, 20, 220))
draw_rt.text((910, 576), "imperial_alien  v1.0", fill=(180, 180, 200, 255))

RT_PATH = os.path.join(SPRITES, "previews", "runtime", "imperial_alien_runtime_preview.png")
rt.save(RT_PATH, "PNG")
print(f"  -> {RT_PATH} ({rt.size})")

for img in imgs.values():
    img.close()

print("\nAll assets generated successfully.")
