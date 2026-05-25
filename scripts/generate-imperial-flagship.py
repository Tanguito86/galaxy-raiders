"""Generate Imperial Flagship Command assets — sheet, metadata, previews."""
import json, os, random
from datetime import date
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")
FLAGSHIP_DIR = os.path.join(SPRITES, "bosses", "imperial_flagship")

FRAME = 256
UNIT_IDS = [
    "imperial_flagship_command_master",
    "imperial_flagship_command_damaged",
    "imperial_flagship_command_core_exposed",
]
UNIT_FILES = {u: os.path.join(FLAGSHIP_DIR, f"{u}.png") for u in UNIT_IDS}
UNIT_PHASES = {
    "imperial_flagship_command_master":        "phase_1_full_armor",
    "imperial_flagship_command_damaged":       "phase_2_damaged",
    "imperial_flagship_command_core_exposed":  "phase_3_core_exposed",
}
UNIT_NOTES = {
    "imperial_flagship_command_master":        "Flagship Command in full armored glory: rigid symmetry, towering crest, geometric shield plates, and a dominant vertical presence.",
    "imperial_flagship_command_damaged":       "Flagship Command with broken armor panels, sparking energy vents, exposed structural framework, and a weakening crest glow.",
    "imperial_flagship_command_core_exposed":  "Flagship Command critically compromised: shattered armor, fully exposed volatile core, fractured crest, and imminent destruction.",
}

# --- 1. FLAGSHIP SPRITE SHEET ---
print("Creating flagship sprite sheet...")
images = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}
sheet = Image.new("RGBA", (FRAME * 3, FRAME))
for idx, uid in enumerate(UNIT_IDS):
    sheet.paste(images[uid], (idx * FRAME, 0))
SHEET_PATH = os.path.join(FLAGSHIP_DIR, "imperial_flagship_command_sheet.png")
sheet.save(SHEET_PATH, "PNG")
for img in images.values():
    img.close()
print(f"  -> {SHEET_PATH} ({sheet.size})")

# --- 2. METADATA JSON ---
print("Creating metadata JSON...")
metadata = {
    "bossId": "imperial_flagship_command",
    "project": "Galaxy Raiders",
    "type": "flagship_boss",
    "faction": "imperial_alien",
    "tier": "flagship",
    "version": "1.0",
    "date": str(date.today()),
    "sheet": {
        "path": "www/assets/sprites/bosses/imperial_flagship/imperial_flagship_command_sheet.png",
        "layout": "horizontal",
        "frameWidth": 256,
        "frameHeight": 256,
        "frames": 3,
    },
    "recommendedGameplaySize": {"width": 192, "height": 192},
    "pivot": {"x": 128, "y": 128, "anchor": "center"},
    "phases": {
        "phase_1_full_armor": {
            "frame": 0,
            "hpRange": "100% - 66%",
            "file": "www/assets/sprites/bosses/imperial_flagship/imperial_flagship_command_master.png",
            "notes": "Full Imperial armor with commanding crest authority and symmetric shield geometry."
        },
        "phase_2_damaged": {
            "frame": 1,
            "hpRange": "66% - 33%",
            "file": "www/assets/sprites/bosses/imperial_flagship/imperial_flagship_command_damaged.png",
            "notes": "Broken armor panels, sparking vents, partial core exposure. Intensity escalation."
        },
        "phase_3_core_exposed": {
            "frame": 2,
            "hpRange": "33% - 0%",
            "file": "www/assets/sprites/bosses/imperial_flagship/imperial_flagship_command_core_exposed.png",
            "notes": "Critical state: shattered plates, fully exposed volatile core, imminent destruction."
        }
    },
    "frameMapping": [
        {"frame": 0, "phaseId": "phase_1_full_armor", "unitId": "imperial_flagship_command_master"},
        {"frame": 1, "phaseId": "phase_2_damaged", "unitId": "imperial_flagship_command_damaged"},
        {"frame": 2, "phaseId": "phase_3_core_exposed", "unitId": "imperial_flagship_command_core_exposed"},
    ],
    "readabilityNotes": [
        "Imperial Flagship Command uses towering vertical geometry, rigid symmetry, geometric shield plates, and a dominant energy crest to project flagship authority.",
        "The three-phase escalation (armored -> damaged -> core exposed) communicates boss HP loss visually without requiring HUD inspection.",
        "At 256x256 master resolution, the recommended gameplay size of 192x192 provides exceptional detail and readability.",
        "The bright vertical crest and geometric armor panels remain readable behind dense endgame bullet patterns.",
        "Flagship silhouette is the largest and most authoritative in the Galaxy Raiders boss roster.",
    ],
    "androidReadabilityNotes": [
        "Recommended gameplay size is 192x192 — the largest boss visual in the game, ensuring mobile readability even on small displays.",
        "The vertical crest and rigid symmetry provide strong recognition hooks at any scale.",
        "Phase 3 (core exposed) has the highest contrast readability due to the bright exposed core against the fractured armor.",
        "For very small screens (<400px landscape), consider scaling the flagship slightly larger rather than smaller — it's meant to dominate.",
    ],
    "silhouetteNotes": [
        "Flagship silhouette is defined by towering verticality, a reinforced command crest, broad geometric shield panels, and rigid bilateral symmetry.",
        "The silhouette intentionally contrasts with Crabtron's asymmetrical claw layout: Flagship is orderly, imposing, and hierarchical.",
        "Phase 1 reads as an intact imperial war machine through full armor coverage.",
        "Phase 2 reads as a damaged but dangerous vessel through broken panels and sparking energy.",
        "Phase 3 reads as a desperate final stand through shattered armor and a fully exposed volatile core.",
    ],
    "flagshipAuthorityNotes": [
        "Imperial Flagship Command is designed as the premium flagship-tier boss benchmark alongside Crabtron.",
        "At 256x256 master resolution, it exceeds the 192x192 mini-boss tier and establishes a new visual quality ceiling.",
        "The faction identity (Imperial) creates a clear visual escalation chain: Imperial Command Lancer (mini-boss) -> Imperial Flagship Command.",
        "Flagship authority is projected through maximum sprite resolution, towering vertical geometry, and phase-based destruction narrative.",
    ],
    "weakpointReadabilityNotes": [
        "Phase 1: weakpoint is the central energy crest — bright, vertical, symmetrically centered.",
        "Phase 2: weakpoint expands as armor panels break, revealing partial core exposure behind the crest.",
        "Phase 3: weakpoint is the fully exposed volatile core — the most readable and highest-priority target state.",
        "The weakpoint escalation follows a clear visual trajectory: crest -> partial core -> full core exposure.",
    ],
    "integrationNotes": [
        "Asset preparation only; no gameplay, draw.js, runtime logic, collisions, hitboxes, boss AI, rank, or balance changes were made.",
        "Sheet frame order is master (phase 1), damaged (phase 2), core_exposed (phase 3).",
        "This package is production-ready for runtime integration when the Imperial faction flagship slot is activated.",
    ],
}

META_PATH = os.path.join(SPRITES, "metadata", "imperial_flagship_command.json")
with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2)
print(f"  -> {META_PATH}")

# --- 3-5. PREVIEWS ---
W, H = 1100, 620
random.seed(42)
bullet_colors = [
    (255, 80, 80, 200), (255, 160, 40, 200), (255, 220, 60, 200),
    (255, 100, 100, 180), (255, 255, 255, 160), (0, 200, 255, 180),
    (255, 60, 60, 140), (255, 200, 50, 180),
]

imgs = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}

def draw_bullets(draw_obj, x0, y0, x1, y1, count, colors, rng):
    for _ in range(count):
        bx = rng.randint(x0, x1)
        by = rng.randint(y0, y1)
        br = rng.randint(1, 3)
        draw_obj.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=rng.choice(colors))

# =========================================
# 3. READABILITY PREVIEW
# =========================================
print("Creating readability preview...")
rv = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(rv)

# Header
draw.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw.text((10, 6), "IMPERIAL FLAGSHIP COMMAND — READABILITY | 256x256 master | flagship tier", fill=(220, 200, 100, 255))

# Zone A: Black bg — 3 phases
draw.rectangle([(0, 30), (W//2, 330)], fill=(0, 0, 0, 255))
draw.text((20, 40), "BLACK BACKGROUND — phase readability", fill=(200, 200, 200, 255))

phase_labels = ["PHASE 1: master", "PHASE 2: damaged", "PHASE 3: core_exposed"]
for i, (uid, lbl) in enumerate(zip(UNIT_IDS, phase_labels)):
    x = 20 + i * 170
    y = 65
    rv.paste(imgs[uid], (x, y), imgs[uid])
    col = [(220, 220, 200, 255), (255, 180, 80, 240), (255, 100, 60, 250)][i]
    draw.text((x, y + 265), lbl, fill=col)

# Zone B: Dark blue bg — 3 phases
draw.rectangle([(W//2, 30), (W, 330)], fill=(10, 15, 40, 255))
draw.text((560, 40), "DARK BLUE BACKGROUND — phase readability", fill=(180, 180, 200, 255))
for i, uid in enumerate(UNIT_IDS):
    x = 570 + i * 170
    y = 65
    rv.paste(imgs[uid], (x, y), imgs[uid])
    col = [(200, 200, 180, 255), (255, 160, 70, 240), (255, 90, 50, 250)][i]
    draw.text((x, y + 265), phase_labels[i], fill=col)

draw.line([(0, 330), (W, 330)], fill=(60, 60, 60, 200), width=2)

# Zone C: Bullet clutter + flagship overlap
draw.rectangle([(0, 332), (W, 620)], fill=(15, 18, 30, 255))
draw.rectangle([(0, 332), (W, 358)], fill=(20, 25, 40, 255))
draw.text((10, 338), "CLUTTER SIMULATION — dense bullets + flagship phases behind chaos", fill=(200, 200, 200, 255))

draw_bullets(draw, 5, 360, W - 10, 618, 700, bullet_colors, random)

# Master in clutter
rv.paste(imgs[UNIT_IDS[0]], (30, 400), imgs[UNIT_IDS[0]])
draw.text((30, 660), "phase 1 behind bullets", fill=(200, 200, 200, 200))

# Damaged in clutter
rv.paste(imgs[UNIT_IDS[1]], (320, 400), imgs[UNIT_IDS[1]])
draw.text((320, 660), "phase 2 behind bullets", fill=(255, 180, 80, 200))

# Core exposed in clutter (most readable)
rv.paste(imgs[UNIT_IDS[2]], (610, 400), imgs[UNIT_IDS[2]])
draw.text((610, 660), "phase 3 behind bullets", fill=(255, 100, 60, 200))

# Peripheral indicators
draw.ellipse([(900, 420), (960, 480)], outline=(100, 255, 100, 180), width=2)
draw.text((910, 490), "peripheral", fill=(120, 255, 120, 200))

READ_PATH = os.path.join(SPRITES, "previews", "readability", "imperial_flagship_command_readability_preview.png")
rv.save(READ_PATH, "PNG")
print(f"  -> {READ_PATH} ({rv.size})")

# =========================================
# 4. RUNTIME PREVIEW
# =========================================
print("Creating runtime preview...")
rt = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw_rt = ImageDraw.Draw(rt)

# Starfield
draw_rt.rectangle([(0, 0), (W, H)], fill=(2, 2, 12, 255))
for _ in range(300):
    sx = random.randint(0, W)
    sy = random.randint(0, H)
    sr = random.randint(0, 1)
    sb = random.randint(80, 200)
    draw_rt.ellipse([(sx - sr, sy - sr), (sx + sr, sy + sr)], fill=(sb, sb, sb, 200))

draw_rt.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw_rt.text((10, 6), "RUNTIME PREVIEW — Imperial Flagship Command | stage climax | flagship authority", fill=(220, 200, 100, 255))

# Player ship
draw_rt.polygon([(530, 540), (550, 570), (570, 540)], fill=(0, 200, 255, 200))
draw_rt.polygon([(530, 540), (540, 520), (550, 540)], fill=(0, 150, 220, 180))
draw_rt.text((535, 575), "PLAYER", fill=(0, 200, 255, 200))

# Flagship Phase 1 — dominant center presence
rt.paste(imgs[UNIT_IDS[0]], (400, 40), imgs[UNIT_IDS[0]])
draw_rt.text((380, 310), "PHASE 1: FLAGSHIP COMMAND", fill=(220, 200, 100, 255))

# Enemy bullet patterns around flagship
draw_bullets(draw_rt, 200, 50, 900, 340, 200, bullet_colors, random)
# Player bullets
for _ in range(80):
    bx = random.randint(500, 600)
    by = random.randint(300, 520)
    draw_rt.ellipse([(bx - 1, by - 1), (bx + 1, by + 1)], fill=(0, 220, 255, 220))

# Small damaged preview inset (lower left hint)
damaged_thumb = imgs[UNIT_IDS[1]].resize((96, 96), Image.LANCZOS)
rt.paste(damaged_thumb, (60, 380), damaged_thumb)
draw_rt.text((55, 480), "phase 2 destination", fill=(255, 180, 80, 180))

# Core exposed preview inset (lower left)
core_thumb = imgs[UNIT_IDS[2]].resize((96, 96), Image.LANCZOS)
rt.paste(core_thumb, (180, 380), core_thumb)
draw_rt.text((175, 480), "phase 3 destination", fill=(255, 100, 60, 180))

# Flagship authority callout
draw_rt.rectangle([(700, 380), (1080, 480)], fill=(5, 8, 25, 200))
draw_rt.text((720, 395), "FLAGSHIP AUTHORITY", fill=(255, 200, 80, 255))
draw_rt.text((720, 415), "256x256 master resolution", fill=(200, 200, 200, 200))
draw_rt.text((720, 435), "3-phase destruction arc", fill=(200, 200, 200, 200))
draw_rt.text((720, 455), "Imperial faction flagship tier", fill=(200, 200, 200, 200))
draw_rt.text((720, 475), "Premium arcade boss benchmark", fill=(200, 200, 200, 200))

# Bottom bar
draw_rt.rectangle([(900, 570), (1090, 600)], fill=(5, 5, 20, 220))
draw_rt.text((910, 576), "imperial_flagship v1.0", fill=(180, 180, 200, 255))

# Frame
draw_rt.rectangle([(0, 0), (W, 4)], fill=(60, 50, 20, 200))
draw_rt.rectangle([(0, H - 4), (W, H)], fill=(60, 50, 20, 200))

RT_PATH = os.path.join(SPRITES, "previews", "runtime", "imperial_flagship_command_runtime_preview.png")
rt.save(RT_PATH, "PNG")
print(f"  -> {RT_PATH} ({rt.size})")

# =========================================
# 5. PHASE TRANSITION PREVIEW
# =========================================
print("Creating phase transition preview...")
pp = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw_pp = ImageDraw.Draw(pp)

draw_pp.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw_pp.text((10, 6), "IMPERIAL FLAGSHIP COMMAND — PHASE TRANSITIONS | master -> damaged -> core_exposed", fill=(220, 200, 100, 255))

# Phase 1 -> 2 area
draw_pp.rectangle([(0, 30), (370, 620)], fill=(3, 3, 12, 255))
draw_pp.text((30, 40), "PHASE 1: full armor (100%-66% HP)", fill=(220, 220, 200, 255))
pp.paste(imgs[UNIT_IDS[0]], (55, 70), imgs[UNIT_IDS[0]])
draw_pp.text((55, 340), "Rigid symmetry | intact crest | geometric plates", fill=(200, 200, 200, 190))
draw_pp.text((55, 360), "Full flagship authority projection", fill=(200, 200, 200, 190))

# Big arrow 1
draw_pp.polygon([(370, 190), (390, 180), (390, 170), (410, 200), (390, 230), (390, 220), (370, 210)], fill=(255, 200, 80, 255))
draw_pp.text((375, 235), "HP < 66%", fill=(255, 200, 80, 230))

# Phase 2 area
draw_pp.rectangle([(410, 30), (780, 620)], fill=(5, 3, 12, 255))
draw_pp.text((440, 40), "PHASE 2: damaged (66%-33% HP)", fill=(255, 180, 80, 255))
pp.paste(imgs[UNIT_IDS[1]], (465, 70), imgs[UNIT_IDS[1]])
draw_pp.text((465, 340), "Broken plates | sparking vents | partial core", fill=(255, 180, 80, 190))
draw_pp.text((465, 360), "Weakening crest glow | intensity escalation", fill=(255, 180, 80, 190))

# Big arrow 2
draw_pp.polygon([(780, 190), (800, 180), (800, 170), (820, 200), (800, 230), (800, 220), (780, 210)], fill=(255, 100, 60, 255))
draw_pp.text((785, 235), "HP < 33%", fill=(255, 100, 60, 230))

# Phase 3 area
draw_pp.rectangle([(820, 30), (W, 620)], fill=(8, 3, 10, 255))
draw_pp.text((850, 40), "PHASE 3: core exposed (33%-0% HP)", fill=(255, 100, 60, 255))
pp.paste(imgs[UNIT_IDS[2]], (875, 70), imgs[UNIT_IDS[2]])
draw_pp.text((875, 340), "Shattered armor | fully exposed core | imminent destruction", fill=(255, 100, 60, 190))
draw_pp.text((875, 360), "Maximum weakpoint readability | final stand", fill=(255, 100, 60, 190))

# Weakpoint indicators
for i, (x, y) in enumerate([(180, 380), (590, 380), (1000, 380)]):
    draw_pp.ellipse([(x, y), (x + 24, y + 24)], outline=(0, 255, 255, 220 + i * 20), width=2)
    lbl = ["crest", "partial core", "full core exposed"][i]
    draw_pp.text((x + 30, y + 3), "weakpoint: " + lbl, fill=(0, 255, 255, 200 + i * 20))

# Escalation summary
draw_pp.rectangle([(30, 420), (1070, 580)], fill=(5, 10, 5, 180))
draw_pp.text((50, 440), "PHASE ESCALATION SUMMARY", fill=(100, 255, 100, 255))
draw_pp.text((50, 468), "Phase 1: Full authority — flagship projects maximum Imperial discipline and intimidation.", fill=(200, 255, 200, 200))
draw_pp.text((50, 496), "Phase 2: Damage escalation — broken armor communicates progress; partial core creates new weakpoint tension.", fill=(255, 230, 180, 200))
draw_pp.text((50, 524), "Phase 3: Final stand — fully exposed core signals imminent victory; maximum readability for the killing phase.", fill=(255, 180, 140, 200))
draw_pp.text((50, 552), "Each transition provides a clear visual HP checkpoint without requiring HUD inspection.", fill=(200, 255, 200, 200))

draw_pp.rectangle([(900, 570), (1090, 600)], fill=(5, 5, 20, 220))
draw_pp.text((910, 576), "flagship phases v1.0", fill=(180, 180, 200, 255))

PHASE_PATH = os.path.join(SPRITES, "previews", "runtime", "imperial_flagship_command_phase_preview.png")
pp.save(PHASE_PATH, "PNG")
print(f"  -> {PHASE_PATH} ({pp.size})")

for img in imgs.values():
    img.close()

print("\nAll Imperial Flagship Command assets generated.")
