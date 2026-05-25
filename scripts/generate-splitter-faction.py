"""Generate Splitter Alien faction assets — sheet, previews, metadata."""
import json, os
from datetime import date
from PIL import Image, ImageDraw, ImageFont

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")
SPLITTER_DIR = os.path.join(SPRITES, "enemies", "splitter")

UNIT_IDS = ["splitter_alien_mk1_master","splitter_alien_elite","splitter_alien_shard","splitter_alien_aberration"]
UNIT_FILES = {u: os.path.join(SPLITTER_DIR, f"{u}.png") for u in UNIT_IDS}
UNIT_ROLES = {
    "splitter_alien_mk1_master": "baseline_chaotic_split_unit",
    "splitter_alien_elite":      "elite_heavy_splitter",
    "splitter_alien_shard":      "fragmentation_swarmer",
    "splitter_alien_aberration": "unstable_aberration_splitter",
}
UNIT_NOTES = {
    "splitter_alien_mk1_master": "Baseline Splitter organism with jagged multi-limb profile and cracked energy core.",
    "splitter_alien_elite":      "Heavier elite-tier Splitter with denser armor plates and intensified core glow.",
    "splitter_alien_shard":      "Small, sharp fragmentation variant that reads as a swarm-splitter with angular projectile-like form.",
    "splitter_alien_aberration": "Unstable, asymmetric aberration with irregular broken limbs and fractured energy pattern.",
}

# --- 1. FACTION SPRITE SHEET ---
print("Creating faction sprite sheet...")
images = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}
sheet = Image.new("RGBA", (128*4, 128))
for idx, uid in enumerate(UNIT_IDS):
    sheet.paste(images[uid], (idx * 128, 0))
SHEET_PATH = os.path.join(SPLITTER_DIR, "splitter_alien_faction_sheet.png")
sheet.save(SHEET_PATH, "PNG")
for img in images.values():
    img.close()
print(f"  -> {SHEET_PATH} ({sheet.size})")

# --- 2. METADATA JSON ---
print("Creating metadata JSON...")
metadata = {
    "factionId": "splitter_alien",
    "project": "Galaxy Raiders",
    "type": "enemy_faction",
    "version": "1.0",
    "date": str(date.today()),
    "sheet": {
        "path": "www/assets/sprites/enemies/splitter/splitter_alien_faction_sheet.png",
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
    "chaosReadabilityNotes": [],
    "integrationNotes": [],
}

for idx, uid in enumerate(UNIT_IDS):
    metadata["units"][uid] = {
        "roleClassification": UNIT_ROLES[uid],
        "frame": idx,
        "file": f"www/assets/sprites/enemies/splitter/{uid}.png",
        "notes": UNIT_NOTES[uid],
    }
    metadata["frameMapping"].append({"frame": idx, "unitId": uid})

metadata["readabilityNotes"] = [
    "Splitter units use angular, fractured silhouettes with erratic limb layouts and cracked energy cores.",
    "The faction contrasts strongly with Scout (organic insectoid) and Suppressor (heavy siege): Splitters are chaotic, sharp, and asymmetric.",
    "Jagged outlines and bright cracked-core energy make units recognizable through dense bullet patterns.",
    "Variant silhouettes are distinct at 64x64: mk1 is baseline shattered, elite is heavier and more intact, shard is small and spiky, aberration is asymmetric and distorted.",
]
metadata["androidReadabilityNotes"] = [
    "Recommended display size is 64x64 or larger due to the fine angular detail.",
    "High-contrast cracked cores and sharp limb extensions remain visible on small mobile displays.",
    "Shard units should not be over-scaled down because their small size already pushes readability limits.",
    "Avoid excessive overlap for aberration formations as their irregular outlines can confuse peripheral recognition.",
]
metadata["silhouetteNotes"] = [
    "Faction identity comes from fractured, asymmetrical geometry, sharp angular extensions, cracked alien cores, and irregular limb arms.",
    "Mk1 reads as a baseline shattered organism with balanced angular spread.",
    "Elite reads as a heavier, more armored splitter through denser plate mass.",
    "Shard reads as a swift fragmentation threat through compact spiky profile.",
    "Aberration reads as a chaotic unstable threat through extreme irregularity and asymmetry.",
]
metadata["chaosReadabilityNotes"] = [
    "The Splitter faction is designed to read as intentionally chaotic while remaining gameplay-legible.",
    "Sharp angular silhouettes and bright cracked energy cores provide fast-recognition hooks despite irregular forms.",
    "Peripheral vision recognition is supported by the strong silhouette-vs-background contrast and core glow.",
    "Mixed formations benefit from the wide silhouette variety: each variant has a distinct angular footprint.",
]
metadata["integrationNotes"] = [
    "Asset preparation only; no gameplay, draw.js, runtime logic, collisions, hitboxes, AI, rank, or balance changes were made.",
    "Sheet frame order is mk1_master, elite, shard, aberration.",
]

META_PATH = os.path.join(SPRITES, "metadata", "splitter_alien_faction.json")
with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2)
print(f"  -> {META_PATH}")

# --- 3. READABILITY PREVIEW (1100x620) ---
print("Creating readability preview...")
W, H = 1100, 620
rv = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(rv)

# Re-open input images for preview composition
imgs = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}

# --- Zone A: Black background (left side) ---
# Place all 4 at different positions with labels
draw.rectangle([(0,0),(550,310)], fill=(0,0,0,255))
draw.rectangle([(0,0),(550,30)], fill=(20,20,30,255))
draw.text((10,6), "READABILITY — splitter_alien (black bg)", fill=(200,200,200,255))

# Mk1 master on black bg
rv.paste(imgs[UNIT_IDS[0]], (40, 60), imgs[UNIT_IDS[0]])
draw.text((40, 200), "mk1_master", fill=(180,180,180,255))

# Elite on black bg
rv.paste(imgs[UNIT_IDS[1]], (170, 60), imgs[UNIT_IDS[1]])
draw.text((170, 200), "elite", fill=(180,180,180,255))

# Shard on black bg
rv.paste(imgs[UNIT_IDS[2]], (300, 60), imgs[UNIT_IDS[2]])
draw.text((300, 200), "shard", fill=(180,180,180,255))

# Aberration on black bg
rv.paste(imgs[UNIT_IDS[3]], (430, 60), imgs[UNIT_IDS[3]])
draw.text((430, 200), "aberration", fill=(180,180,180,255))

# --- Zone B: Dark blue background (right side) ---
draw.rectangle([(550,0),(1100,310)], fill=(10,15,40,255))
draw.rectangle([(550,0),(1100,30)], fill=(15,20,50,255))
draw.text((560,6), "READABILITY — dark blue bg", fill=(180,180,200,255))

rv.paste(imgs[UNIT_IDS[0]], (570, 60), imgs[UNIT_IDS[0]])
draw.text((570, 200), "mk1_master", fill=(160,160,180,255))

rv.paste(imgs[UNIT_IDS[1]], (700, 60), imgs[UNIT_IDS[1]])
draw.text((700, 200), "elite", fill=(160,160,180,255))

rv.paste(imgs[UNIT_IDS[2]], (830, 60), imgs[UNIT_IDS[2]])
draw.text((830, 200), "shard", fill=(160,160,180,255))

rv.paste(imgs[UNIT_IDS[3]], (960, 60), imgs[UNIT_IDS[3]])
draw.text((960, 200), "aberration", fill=(160,160,180,255))

# Separator line
draw.line([(0,310),(W,310)], fill=(60,60,60,200), width=2)

# --- Zone C: Dense bullet clutter simulation (bottom) ---
draw.rectangle([(0,312),(W,620)], fill=(15,18,30,255))
draw.rectangle([(0,312),(W,340)], fill=(20,25,40,255))
draw.text((10,318), "CLUTTER SIMULATION — dense bullets + overlap", fill=(200,200,200,255))

import random
random.seed(42)

# Bullet dots — various sizes simulating bullet hell
bullet_colors = [
    (255,80,80,200), (255,160,40,200), (255,220,60,200),
    (255,100,100,180), (255,255,255,160), (0,200,255,180),
    (200,0,255,160), (255,60,60,140),
]
for _ in range(900):
    bx = random.randint(5, W-10)
    by = random.randint(350, 610)
    br = random.randint(1, 4)
    bc = random.choice(bullet_colors)
    draw.ellipse([(bx-br,by-br),(bx+br,by+br)], fill=bc)

# Overlapping sprites in clutter zone
# Cluster A — mk1 + elite overlap
rv.paste(imgs[UNIT_IDS[0]], (80, 400), imgs[UNIT_IDS[0]])
rv.paste(imgs[UNIT_IDS[1]], (130, 420), imgs[UNIT_IDS[1]])
draw.text((80, 540), "mk1+elite overlap", fill=(220,220,220,255))

# Cluster B — shard + aberration overlap
rv.paste(imgs[UNIT_IDS[2]], (350, 400), imgs[UNIT_IDS[2]])
rv.paste(imgs[UNIT_IDS[3]], (390, 410), imgs[UNIT_IDS[3]])
draw.text((340, 540), "shard+aberr overlap", fill=(220,220,220,255))

# Cluster C — all 4 mixed tightly
rv.paste(imgs[UNIT_IDS[0]], (600, 400), imgs[UNIT_IDS[0]])
rv.paste(imgs[UNIT_IDS[1]], (650, 420), imgs[UNIT_IDS[1]])
rv.paste(imgs[UNIT_IDS[2]], (700, 400), imgs[UNIT_IDS[2]])
rv.paste(imgs[UNIT_IDS[3]], (750, 420), imgs[UNIT_IDS[3]])
draw.text((600, 540), "all 4 mixed overlap", fill=(220,220,220,255))

# Peripheral test indicators
draw.ellipse([(900,370),(960,430)], outline=(100,255,100,180), width=2)
draw.text((910,440), "peripheral", fill=(120,255,120,200))
draw.polygon([(975,570),(995,590),(995,610),(975,610)], fill=(100,255,100,160))
draw.polygon([(80,550),(106,550),(106,570),(80,570)], fill=(100,255,100,160))

READ_PATH = os.path.join(SPRITES, "previews", "readability", "splitter_alien_readability_preview.png")
rv.save(READ_PATH, "PNG")
print(f"  -> {READ_PATH} ({rv.size})")

# --- 4. RUNTIME PREVIEW (1100x620) ---
print("Creating runtime preview...")
rt = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw_rt = ImageDraw.Draw(rt)

# Fake gameplay starfield background
draw_rt.rectangle([(0,0),(W,H)], fill=(2,2,12,255))
for _ in range(300):
    sx = random.randint(0, W)
    sy = random.randint(0, H)
    sr = random.randint(0, 1)
    sb = random.randint(80, 200)
    draw_rt.ellipse([(sx-sr,sy-sr),(sx+sr,sy+sr)], fill=(sb,sb,sb,200))

# Header
draw_rt.rectangle([(0,0),(W,30)], fill=(10,12,30,255))
draw_rt.text((10,6), "RUNTIME PREVIEW — splitter_alien faction | chaotic formation | combat readability", fill=(200,200,200,255))

# Player ship indicator (bottom center)
draw_rt.polygon([(530,540),(550,570),(570,540)], fill=(0,200,255,200))
draw_rt.polygon([(530,540),(540,520),(550,540)], fill=(0,150,220,180))
draw_rt.text((535,575), "PLAYER", fill=(0,200,255,200))

# Enemy formations — chaotic spread
# Formation 1: top-left scatter (mk1 + shard)
rt.paste(imgs[UNIT_IDS[0]], (60, 60), imgs[UNIT_IDS[0]])
rt.paste(imgs[UNIT_IDS[2]], (160, 80), imgs[UNIT_IDS[2]])
rt.paste(imgs[UNIT_IDS[2]], (110, 140), imgs[UNIT_IDS[2]])
draw_rt.text((55,260), "scatter_formation", fill=(200,200,200,200))

# Formation 2: center-right pressure (elite + mk1)
rt.paste(imgs[UNIT_IDS[1]], (600, 70), imgs[UNIT_IDS[1]])
rt.paste(imgs[UNIT_IDS[0]], (730, 90), imgs[UNIT_IDS[0]])
rt.paste(imgs[UNIT_IDS[3]], (680, 150), imgs[UNIT_IDS[3]])
draw_rt.text((650,240), "pressure_formation", fill=(200,200,200,200))

# Formation 3: lower-left chaos (all variants)
rt.paste(imgs[UNIT_IDS[0]], (100, 320), imgs[UNIT_IDS[0]])
rt.paste(imgs[UNIT_IDS[1]], (160, 350), imgs[UNIT_IDS[1]])
rt.paste(imgs[UNIT_IDS[2]], (50, 400), imgs[UNIT_IDS[2]])
rt.paste(imgs[UNIT_IDS[3]], (220, 420), imgs[UNIT_IDS[3]])
draw_rt.text((100,480), "chaos_mixed_formation", fill=(200,200,200,200))

# Formation 4: aberration solo threat (mid-right)
rt.paste(imgs[UNIT_IDS[3]], (850, 290), imgs[UNIT_IDS[3]])
draw_rt.text((840,430), "aberration_threat", fill=(200,200,200,200))

# Enemy bullets — red/orange hostile fire
for _ in range(200):
    bx = random.randint(20, W-20)
    by = random.randint(310, 560)
    br = random.randint(1, 3)
    bc = random.choice([(255,60,40,200), (255,140,30,200), (255,200,50,180), (255,60,60,160)])
    draw_rt.ellipse([(bx-br,by-br),(bx+br,by+br)], fill=bc)

# Player bullets — cyan
for _ in range(60):
    bx = random.randint(450, 650)
    by = random.randint(300, 520)
    draw_rt.ellipse([(bx-1,by-1),(bx+1,by+1)], fill=(0,220,255,220))

# Faction tag
draw_rt.rectangle([(900,570),(1090,600)], fill=(5,5,20,220))
draw_rt.text((910,576), "splitter_alien  v1.0", fill=(180,180,200,255))

RT_PATH = os.path.join(SPRITES, "previews", "runtime", "splitter_alien_runtime_preview.png")
rt.save(RT_PATH, "PNG")
print(f"  -> {RT_PATH} ({rt.size})")

for img in imgs.values():
    img.close()

print("\nAll assets generated successfully.")
