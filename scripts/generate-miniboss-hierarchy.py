"""Generate Mini-Boss Hierarchy assets — sheet, previews, metadata."""
import json, os, random
from datetime import date
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")
BOSS_DIR = os.path.join(SPRITES, "bosses")

UNIT_IDS = [
    "scout_hive_leader",
    "suppressor_siege_core",
    "splitter_aberrant_node",
    "imperial_command_lancer",
]
UNIT_FILES = {u: os.path.join(BOSS_DIR, f"{u}.png") for u in UNIT_IDS}
UNIT_FACTIONS = {
    "scout_hive_leader":        "scout_alien",
    "suppressor_siege_core":    "suppressor_alien",
    "splitter_aberrant_node":   "splitter_alien",
    "imperial_command_lancer":  "imperial_alien",
}
UNIT_ROLES = {
    "scout_hive_leader":        "hive_swarm_commander",
    "suppressor_siege_core":    "siege_anchor_boss",
    "splitter_aberrant_node":   "chaos_node_boss",
    "imperial_command_lancer":  "command_strike_boss",
}
UNIT_NOTES = {
    "scout_hive_leader":        "Large Scout Hive Leader with expanded insectoid claw span, reinforced chitin armor, and dominant cyan core presence.",
    "suppressor_siege_core":    "Massive Suppressor Siege Core with oversized armored shell, intense red-orange energy hub, and crushing frontal geometry.",
    "splitter_aberrant_node":   "Unstable Splitter Aberrant Node with extreme fractal asymmetry, multiple fractured limbs, and volatile energy fractures.",
    "imperial_command_lancer":  "Towering Imperial Command Lancer with elongated strike geometry, reinforced command crest, and rigid disciplined posture.",
}

FRAME = 192

# --- 1. HIERARCHY SPRITE SHEET ---
print("Creating hierarchy sprite sheet...")
images = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}
sheet = Image.new("RGBA", (FRAME * 4, FRAME))
for idx, uid in enumerate(UNIT_IDS):
    sheet.paste(images[uid], (idx * FRAME, 0))
SHEET_PATH = os.path.join(BOSS_DIR, "miniboss_hierarchy_sheet.png")
sheet.save(SHEET_PATH, "PNG")
for img in images.values():
    img.close()
print(f"  -> {SHEET_PATH} ({sheet.size})")

# --- 2. METADATA JSON ---
print("Creating metadata JSON...")
metadata = {
    "hierarchyId": "miniboss_hierarchy_01",
    "project": "Galaxy Raiders",
    "type": "miniboss_hierarchy",
    "version": "1.0",
    "date": str(date.today()),
    "phase": "01",
    "sheet": {
        "path": "www/assets/sprites/bosses/miniboss_hierarchy_sheet.png",
        "layout": "horizontal",
        "frameWidth": 192,
        "frameHeight": 192,
        "frames": 4,
    },
    "recommendedGameplaySize": {"width": 128, "height": 128},
    "pivot": {"x": 96, "y": 96, "anchor": "center"},
    "units": {},
    "frameMapping": [],
    "readabilityNotes": [],
    "androidReadabilityNotes": [],
    "silhouetteNotes": [],
    "combatReadabilityNotes": [],
    "hierarchyRoleNotes": [],
    "factionEscalationNotes": [],
    "integrationNotes": [],
}

for idx, uid in enumerate(UNIT_IDS):
    metadata["units"][uid] = {
        "faction": UNIT_FACTIONS[uid],
        "roleClassification": UNIT_ROLES[uid],
        "frame": idx,
        "file": f"www/assets/sprites/bosses/{uid}.png",
        "notes": UNIT_NOTES[uid],
    }
    metadata["frameMapping"].append({
        "frame": idx,
        "unitId": uid,
        "faction": UNIT_FACTIONS[uid],
    })

metadata["readabilityNotes"] = [
    "Mini-bosses are scaled to 192x192 master resolution and designed for high-visibility combat at the recommended 128x128 gameplay size.",
    "Each boss preserves its parent faction silhouette identity while scaling up detail density for larger on-screen presence.",
    "High-contrast energy markers (cyan core, red-orange hub, fractured white energy, vertical command crest) provide instant faction recognition.",
    "Large boss hitboxes benefit from the expanded sprite area: peripheral readability remains strong even with dense bullet clutter.",
]
metadata["androidReadabilityNotes"] = [
    "Recommended gameplay size is 128x128, larger than standard enemies to maintain boss readability on mobile.",
    "Energy cores and crests provide strong contrast markers that remain visible on small displays.",
    "Bosses should generally occupy a larger share of the screen in mobile layouts, so the 192x192 master resolution provides headroom.",
    "Splitter Aberrant Node's fractal complexity may reduce peripheral readability on mobile; centering it in the playfield is recommended.",
]
metadata["silhouetteNotes"] = [
    "Scout Hive Leader reads as an ascended insectoid commander through enhanced claw span and thicker chitin plates.",
    "Suppressor Siege Core reads as a siege anchor through massive armored bulk and a dominant central energy hub.",
    "Splitter Aberrant Node reads as a chaos node through extreme asymmetry, cracked limbs, and volatile energy fractures.",
    "Imperial Command Lancer reads as a command strike threat through towering vertical geometry and a reinforced crest.",
    "All four mini-bosses maintain faction silhouette identity while scaling up for boss-level readability.",
]
metadata["combatReadabilityNotes"] = [
    "The four mini-bosses are designed for intense shmup combat scenarios where they dominate the field visually.",
    "High-contrast energy markers ensure boss silhouette remains readable behind player and enemy bullet patterns.",
    "Faction color differentiation (cyan, red-orange, fractured white, rigid gold-white) supports rapid threat identification.",
    "At gameplay resolution, all four bosses are instantly distinguishable by silhouette, energy color, and geometry language.",
]
metadata["hierarchyRoleNotes"] = [
    "Scout Hive Leader: swarm commander that brings Scout-themed formations and pressure patterns.",
    "Suppressor Siege Core: siege anchor designed for sustained pressure encounters with heavy firepower.",
    "Splitter Aberrant Node: chaos node for unpredictable, high-intensity fragmentation combat.",
    "Imperial Command Lancer: command strike leader for disciplined, formation-based boss encounters.",
    "This Phase 01 hierarchy establishes one mini-boss per enemy faction for balanced roster coverage.",
]
metadata["factionEscalationNotes"] = [
    "Each mini-boss escalates its parent faction's visual language to boss scale while preserving identity.",
    "Scout: claw span expands, chitin becomes heavier, core grows more dominant.",
    "Suppressor: shell becomes massive, siege-structure red-orange core dominates center mass.",
    "Splitter: asymmetry amplifies, limbs become more erratic, energy fractures multiply.",
    "Imperial: verticality extends, crest reinforcement increases, disciplined geometry becomes more imposing.",
]
metadata["integrationNotes"] = [
    "Asset preparation only; no gameplay, draw.js, runtime logic, collisions, hitboxes, boss AI, rank, or balance changes were made.",
    "Sheet frame order is scout_hive_leader, suppressor_siege_core, splitter_aberrant_node, imperial_command_lancer.",
]

META_PATH = os.path.join(SPRITES, "metadata", "miniboss_hierarchy.json")
with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2)
print(f"  -> {META_PATH}")

# --- 3. READABILITY PREVIEW (1100x620) ---
print("Creating readability preview...")
W, H = 1100, 620
rv = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(rv)

imgs = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}

# Zone A: Black background — boss showcase
draw.rectangle([(0, 0), (550, 360)], fill=(0, 0, 0, 255))
draw.rectangle([(0, 0), (550, 30)], fill=(20, 20, 30, 255))
draw.text((10, 6), "READABILITY — miniboss hierarchy (black bg)", fill=(200, 200, 200, 255))

# Row 1: scout + suppressor
rv.paste(imgs[UNIT_IDS[0]], (40, 50), imgs[UNIT_IDS[0]])
draw.text((20, 260), "scout_hive_leader", fill=(0, 200, 255, 200))
rv.paste(imgs[UNIT_IDS[1]], (260, 50), imgs[UNIT_IDS[1]])
draw.text((240, 260), "suppressor_siege_core", fill=(255, 120, 40, 200))

# Row 2: splitter + imperial
rv.paste(imgs[UNIT_IDS[2]], (40, 170), imgs[UNIT_IDS[2]])
draw.text((10, 375), "splitter_aberrant_node", fill=(255, 220, 180, 200))
rv.paste(imgs[UNIT_IDS[3]], (260, 170), imgs[UNIT_IDS[3]])
draw.text((230, 375), "imperial_command_lancer", fill=(220, 200, 100, 200))

# Zone B: Dark blue background
draw.rectangle([(550, 0), (1100, 360)], fill=(10, 15, 40, 255))
draw.rectangle([(550, 0), (1100, 30)], fill=(15, 20, 50, 255))
draw.text((560, 6), "READABILITY — dark blue bg", fill=(180, 180, 200, 255))

rv.paste(imgs[UNIT_IDS[0]], (570, 50), imgs[UNIT_IDS[0]])
draw.text((550, 260), "scout_hive_leader", fill=(0, 200, 255, 200))
rv.paste(imgs[UNIT_IDS[1]], (790, 50), imgs[UNIT_IDS[1]])
draw.text((770, 260), "suppressor_siege_core", fill=(255, 120, 40, 200))
rv.paste(imgs[UNIT_IDS[2]], (570, 170), imgs[UNIT_IDS[2]])
draw.text((550, 375), "splitter_aberrant_node", fill=(255, 220, 180, 200))
rv.paste(imgs[UNIT_IDS[3]], (790, 170), imgs[UNIT_IDS[3]])
draw.text((770, 375), "imperial_command_lancer", fill=(220, 200, 100, 200))

draw.line([(0, 360), (W, 360)], fill=(60, 60, 60, 200), width=2)

# Zone C: Bullet clutter + boss overlap (bottom 360-620)
draw.rectangle([(0, 361), (W, 620)], fill=(15, 18, 30, 255))
draw.rectangle([(0, 361), (W, 388)], fill=(20, 25, 40, 255))
draw.text((10, 367), "CLUTTER + OVERLAP SIMULATION — bosses behind bullet hell", fill=(200, 200, 200, 255))

random.seed(42)
bullet_colors = [
    (255, 80, 80, 200), (255, 160, 40, 200), (255, 220, 60, 200),
    (255, 100, 100, 180), (255, 255, 255, 160), (0, 200, 255, 180),
    (200, 0, 255, 160), (255, 60, 60, 140),
]
for _ in range(500):
    bx = random.randint(5, W - 10)
    by = random.randint(392, 618)
    br = random.randint(1, 4)
    bc = random.choice(bullet_colors)
    draw.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=bc)

# Boss overlaps in clutter
rv.paste(imgs[UNIT_IDS[0]], (30, 420), imgs[UNIT_IDS[0]])
rv.paste(imgs[UNIT_IDS[1]], (150, 430), imgs[UNIT_IDS[1]])
draw.text((50, 625), "scout+suppressor overlap", fill=(220, 220, 220, 200))

rv.paste(imgs[UNIT_IDS[2]], (380, 420), imgs[UNIT_IDS[2]])
rv.paste(imgs[UNIT_IDS[3]], (500, 430), imgs[UNIT_IDS[3]])
draw.text((400, 625), "splitter+imperial overlap", fill=(220, 220, 220, 200))

rv.paste(imgs[UNIT_IDS[0]], (730, 420), imgs[UNIT_IDS[0]])
rv.paste(imgs[UNIT_IDS[2]], (850, 430), imgs[UNIT_IDS[2]])
draw.text((750, 625), "scout+splitter overlap", fill=(220, 220, 220, 200))

draw.ellipse([(980, 450), (1050, 520)], outline=(100, 255, 100, 180), width=2)
draw.text((990, 530), "peripheral", fill=(120, 255, 120, 200))

READ_PATH = os.path.join(SPRITES, "previews", "readability", "miniboss_hierarchy_readability_preview.png")
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
draw_rt.text((10, 6), "RUNTIME PREVIEW — miniboss hierarchy | dramatic combat | faction comparison", fill=(200, 200, 200, 255))

# Player ship (bottom center)
draw_rt.polygon([(530, 540), (550, 570), (570, 540)], fill=(0, 200, 255, 200))
draw_rt.polygon([(530, 540), (540, 520), (550, 540)], fill=(0, 150, 220, 180))
draw_rt.text((535, 575), "PLAYER", fill=(0, 200, 255, 200))

# Boss placements — dramatic spread
# Scout Hive Leader (upper-left) with swarm feel
rt.paste(imgs[UNIT_IDS[0]], (30, 50), imgs[UNIT_IDS[0]])
draw_rt.text((20, 250), "SCOUT HIVE", fill=(0, 200, 255, 200))

# Suppressor Siege Core (upper-right) dominant
rt.paste(imgs[UNIT_IDS[1]], (750, 70), imgs[UNIT_IDS[1]])
draw_rt.text((720, 275), "SUPPRESSOR SIEGE", fill=(255, 120, 40, 200))

# Splitter Aberrant Node (mid-left) chaos
rt.paste(imgs[UNIT_IDS[2]], (200, 260), imgs[UNIT_IDS[2]])
draw_rt.text((160, 460), "SPLITTER NODE", fill=(255, 200, 140, 200))

# Imperial Command Lancer (mid-right) towering
rt.paste(imgs[UNIT_IDS[3]], (450, 260), imgs[UNIT_IDS[3]])
draw_rt.text((420, 460), "IMPERIAL COMMAND", fill=(220, 200, 100, 200))

# Dramatic bullet patterns — dense boss area
for _ in range(300):
    bx = random.randint(20, W - 20)
    by = random.randint(50, 560)
    br = random.randint(1, 4)
    bc = random.choice([(255, 60, 40, 200), (255, 140, 30, 200), (255, 200, 50, 180),
                        (255, 60, 60, 160), (255, 255, 80, 180)])
    draw_rt.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=bc)

# Player bullets — cyan streams upward
for _ in range(80):
    bx = random.randint(500, 600)
    by = random.randint(200, 520)
    draw_rt.ellipse([(bx - 1, by - 1), (bx + 1, by + 1)], fill=(0, 220, 255, 220))

# Frame — dramatic encounter border
draw_rt.rectangle([(0, 0), (W, 5)], fill=(40, 40, 80, 200))
draw_rt.rectangle([(0, H - 5), (W, H)], fill=(40, 40, 80, 200))
draw_rt.rectangle([(900, 570), (1090, 600)], fill=(5, 5, 20, 220))
draw_rt.text((910, 576), "miniboss_hierarchy  v1.0", fill=(180, 180, 200, 255))

RT_PATH = os.path.join(SPRITES, "previews", "runtime", "miniboss_hierarchy_runtime_preview.png")
rt.save(RT_PATH, "PNG")
print(f"  -> {RT_PATH} ({rt.size})")

for img in imgs.values():
    img.close()

print("\nAll assets generated successfully.")
