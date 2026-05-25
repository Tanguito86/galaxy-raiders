"""Generate Orbital Siege Colossus fortress-class assets — sheet, metadata, previews."""
import json, os, random
from datetime import date
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")
SIEGE_DIR = os.path.join(SPRITES, "bosses", "orbital_siege")

FRAME = 320
UNIT_IDS = [
    "orbital_siege_colossus_master",
    "orbital_siege_colossus_damaged",
    "orbital_siege_colossus_core_exposed",
    "orbital_siege_colossus_weapon_open",
]
UNIT_FILES = {u: os.path.join(SIEGE_DIR, f"{u}.png") for u in UNIT_IDS}
UNIT_PHASES = {
    "orbital_siege_colossus_master":        "phase_1_full_armor",
    "orbital_siege_colossus_damaged":       "phase_2_damaged",
    "orbital_siege_colossus_core_exposed":  "phase_3_core_exposed",
    "orbital_siege_colossus_weapon_open":   "phase_special_weapon_deployed",
}
UNIT_NOTES = {
    "orbital_siege_colossus_master":        "Fortress-class siege Colossus in full armored state: massive ring geometry, multilayered armor plates, and dominant orbital silhouette.",
    "orbital_siege_colossus_damaged":       "Colossus with fractured ring segments, scoring damage on primary armor layers, and flickering energy across the siege structure.",
    "orbital_siege_colossus_core_exposed":  "Critically damaged Colossus with shattered ring sections, fully exposed central reactor core, and cascading structural failure.",
    "orbital_siege_colossus_weapon_open":   "Colossus with deployed superweapon arrays: artillery barrels extended, energy channels active, and catastrophic-scale attack posture.",
}

# --- 1. FORTRESS SPRITE SHEET ---
print("Creating fortress sprite sheet...")
images = {u: Image.open(UNIT_FILES[u]).convert("RGBA") for u in UNIT_IDS}
sheet = Image.new("RGBA", (FRAME * 4, FRAME))
for idx, uid in enumerate(UNIT_IDS):
    sheet.paste(images[uid], (idx * FRAME, 0))
SHEET_PATH = os.path.join(SIEGE_DIR, "orbital_siege_colossus_sheet.png")
sheet.save(SHEET_PATH, "PNG")
for img in images.values():
    img.close()
print(f"  -> {SHEET_PATH} ({sheet.size})")

# --- 2. METADATA JSON ---
print("Creating metadata JSON...")
metadata = {
    "bossId": "orbital_siege_colossus",
    "project": "Galaxy Raiders",
    "type": "fortress_class_boss",
    "faction": "orbital_siege",
    "tier": "fortress",
    "version": "1.0",
    "date": str(date.today()),
    "sheet": {
        "path": "www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_sheet.png",
        "layout": "horizontal",
        "frameWidth": 320,
        "frameHeight": 320,
        "frames": 4,
    },
    "recommendedGameplaySize": {"width": 240, "height": 240},
    "pivot": {"x": 160, "y": 160, "anchor": "center"},
    "phases": {
        "phase_1_full_armor": {
            "frame": 0,
            "hpRange": "100% - 66%",
            "file": "www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_master.png",
            "notes": "Intact orbital fortress with full ring geometry, layered armor, and commanding siege presence."
        },
        "phase_2_damaged": {
            "frame": 1,
            "hpRange": "66% - 33%",
            "file": "www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_damaged.png",
            "notes": "Fractured ring segments, damaged armor scoring, flickering siege energy. Damage escalation visible."
        },
        "phase_3_core_exposed": {
            "frame": 2,
            "hpRange": "33% - 0%",
            "file": "www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_core_exposed.png",
            "notes": "Shattered ring sections, fully exposed central reactor, cascading structural collapse. Maximum weakpoint readability."
        },
        "phase_special_weapon_deployed": {
            "frame": 3,
            "hpRange": "any (superweapon trigger)",
            "file": "www/assets/sprites/bosses/orbital_siege/orbital_siege_colossus_weapon_open.png",
            "notes": "Superweapon active state: artillery arrays deployed, energy channels charged, catastrophic attack posture."
        }
    },
    "frameMapping": [
        {"frame": 0, "phaseId": "phase_1_full_armor", "unitId": "orbital_siege_colossus_master"},
        {"frame": 1, "phaseId": "phase_2_damaged", "unitId": "orbital_siege_colossus_damaged"},
        {"frame": 2, "phaseId": "phase_3_core_exposed", "unitId": "orbital_siege_colossus_core_exposed"},
        {"frame": 3, "phaseId": "phase_special_weapon_deployed", "unitId": "orbital_siege_colossus_weapon_open"},
    ],
    "readabilityNotes": [
        "Orbital Siege Colossus uses concentric ring geometry, layered armor structures, and a central reactor core to project fortress-class catastrophic scale.",
        "At 320x320 master resolution, this is the largest boss asset in Galaxy Raiders — a true screen-dominating superweapon.",
        "The ring silhouette and central energy reactor provide strong recognition anchors even with massive bullet density.",
        "Four states cover the complete fortress combat arc: armored, damaged, critical, and superweapon-deployed.",
    ],
    "androidReadabilityNotes": [
        "Recommended gameplay size is 240x240 — the largest boss visual in the game, demanding significant screen real estate.",
        "The concentric ring silhouette and bright central core remain readable even on small displays due to extreme contrast.",
        "This is intentionally the most screen-filling boss — it should dominate mobile layouts during fortress encounters.",
        "Consider scaling down to 192x192 for very small screens (<400px landscape) while preserving ring readability.",
    ],
    "silhouetteNotes": [
        "Fortress-class silhouette is defined by concentric ring geometry, layered armor bands, and a dominant central reactor core.",
        "The ring structure creates a unique donut-like silhouette unlike any other Galaxy Raiders boss — instantly recognizable.",
        "Phase 1 reads as an intact orbital fortress through complete ring structure and uniform armor plating.",
        "Phase 2 reads as a damaged siege platform through fractured ring sections and scoring damage.",
        "Phase 3 reads as a critically exposed fortress through shattered rings and a fully visible reactor core.",
        "Phase 4 reads as a catastrophic superweapon through deployed artillery arrays and active energy channels.",
    ],
    "fortressHierarchyNotes": [
        "Orbital Siege Colossus is designed as the fortress-class catastrophic superweapon benchmark for Galaxy Raiders.",
        "At 320x320 master resolution, it exceeds even the 256x256 Imperial Flagship Command tier.",
        "The faction identity (Orbital Siege) is unique — focused on large-scale siege geometry rather than organic or militaristic language.",
        "This asset establishes the ceiling for fortress-class bosses: screen-dominating, ring-based, catastrophic scale.",
    ],
    "superweaponActivationNotes": [
        "Frame 3 (weapon_open) represents the superweapon activation state — distinct from the damage-phase states.",
        "Artillery arrays extend from the ring structure, creating a wider, more aggressive silhouette during attack sequences.",
        "Energy channels glow along the deployed weapon paths, providing strong visual telegraphing for incoming catastrophic attacks.",
        "The superweapon state can be triggered independently of HP-based phase changes for gameplay flexibility.",
    ],
    "weakpointReadabilityNotes": [
        "Phase 1: weakpoint is the central reactor ring — visible but protected by layered armor.",
        "Phase 2: weakpoint expands as armor fractures, revealing more of the reactor core through gaps.",
        "Phase 3: weakpoint is the fully exposed central reactor — maximum visibility, maximum vulnerability signal.",
        "Phase 4: weakpoint remains exposed during superweapon deployment — high-risk/high-reward targeting window.",
    ],
    "integrationNotes": [
        "Asset preparation only; no gameplay, draw.js, runtime logic, collisions, hitboxes, boss AI, rank, or balance changes were made.",
        "Sheet frame order is master (phase 1), damaged (phase 2), core_exposed (phase 3), weapon_open (special).",
        "This package is production-ready for runtime integration when the Orbital Siege fortress slot is activated.",
    ],
}

META_PATH = os.path.join(SPRITES, "metadata", "orbital_siege_colossus.json")
with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=2)
print(f"  -> {META_PATH}")

# --- PREVIEWS ---
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
        br = rng.randint(1, 4)
        draw_obj.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=rng.choice(colors))

# For readability + runtime previews, work with scaled-down renders since 320px is huge
GAMEPLAY_SCALE = 0.75  # 320 * 0.75 = 240px
gs = GAMEPLAY_SCALE
gs_size = int(FRAME * gs)

# ===== 3. READABILITY PREVIEW =====
print("Creating readability preview...")
rv = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(rv)

draw.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw.text((10, 6), "ORBITAL SIEGE COLOSSUS — READABILITY | 320x320 fortress-class | scale 0.75", fill=(100, 200, 255, 255))

# Zone A: Black bg — 4 states at gameplay scale (scaled down)
draw.rectangle([(0, 30), (W, 380)], fill=(0, 0, 0, 255))
draw.text((20, 38), "BLACK BACKGROUND — fortress states at gameplay scale (240px)", fill=(200, 200, 200, 255))

phase_labels = ["MASTER", "DAMAGED", "CORE EXPOSED", "WEAPON OPEN"]
phase_colors = [(200, 220, 255, 255), (255, 180, 80, 240), (255, 100, 60, 250), (255, 60, 200, 255)]
for i, (uid, lbl, col) in enumerate(zip(UNIT_IDS, phase_labels, phase_colors)):
    scaled = imgs[uid].resize((gs_size, gs_size), Image.LANCZOS)
    x = 20 + i * 265
    y = 60
    rv.paste(scaled, (x, y), scaled)
    draw.text((x, y + gs_size + 10), f"PHASE {i+1}: {lbl}", fill=col, )

# Separator
draw.line([(0, 380), (W, 380)], fill=(60, 60, 60, 200), width=2)

# Zone B: Bullet clutter + fortress behind chaos
draw.rectangle([(0, 382), (W, 620)], fill=(15, 18, 30, 255))
draw.rectangle([(0, 382), (W, 408)], fill=(20, 25, 40, 255))
draw.text((10, 388), "FORTRESS-SCALE CLUTTER — dense bullet patterns + colossus behind artillery chaos", fill=(200, 200, 200, 255))

draw_bullets(draw, 5, 410, W - 10, 618, 800, bullet_colors, random)

# Master + weapon overlay in clutter
master_s = imgs[UNIT_IDS[0]].resize((140, 140), Image.LANCZOS)
rv.paste(master_s, (40, 440), master_s)
draw.text((40, 588), "master behind bullets", fill=(180, 200, 230, 190))

weapon_s = imgs[UNIT_IDS[3]].resize((140, 140), Image.LANCZOS)
rv.paste(weapon_s, (250, 440), weapon_s)
draw.text((250, 588), "weapon_deployed", fill=(255, 60, 200, 190))

core_s = imgs[UNIT_IDS[2]].resize((140, 140), Image.LANCZOS)
rv.paste(core_s, (460, 440), core_s)
draw.text((460, 588), "core_exposed (max readability)", fill=(255, 100, 60, 190))

damaged_s = imgs[UNIT_IDS[1]].resize((140, 140), Image.LANCZOS)
rv.paste(damaged_s, (670, 440), damaged_s)
draw.text((670, 588), "damaged behind bullets", fill=(255, 180, 80, 190))

# Peripheral indicator
draw.ellipse([(900, 440), (980, 520)], outline=(100, 255, 100, 180), width=2)
draw.text((910, 530), "peripheral readable", fill=(120, 255, 120, 200))

READ_PATH = os.path.join(SPRITES, "previews", "readability", "orbital_siege_colossus_readability_preview.png")
rv.save(READ_PATH, "PNG")
print(f"  -> {READ_PATH} ({rv.size})")

# ===== 4. RUNTIME PREVIEW =====
print("Creating runtime preview...")
rt = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw_rt = ImageDraw.Draw(rt)

# Starfield
draw_rt.rectangle([(0, 0), (W, H)], fill=(2, 2, 14, 255))
for _ in range(400):
    sx = random.randint(0, W)
    sy = random.randint(0, H)
    sr = random.randint(0, 1)
    sb = random.randint(60, 200)
    draw_rt.ellipse([(sx - sr, sy - sr), (sx + sr, sy + sr)], fill=(sb, sb, sb, 200))

draw_rt.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw_rt.text((10, 6), "RUNTIME PREVIEW — Orbital Siege Colossus | catastrophic fortress encounter | artillery barrage", fill=(100, 200, 255, 255))

# Player ship
draw_rt.polygon([(530, 540), (550, 570), (570, 540)], fill=(0, 200, 255, 200))
draw_rt.polygon([(530, 540), (540, 520), (550, 540)], fill=(0, 150, 220, 180))
draw_rt.text((535, 575), "PLAYER", fill=(0, 200, 255, 200))

# Colossus master — dominant center (scaled for preview)
colossus_gameplay = imgs[UNIT_IDS[0]].resize((240, 240), Image.LANCZOS)
rt.paste(colossus_gameplay, (410, 40), colossus_gameplay)
draw_rt.text((380, 290), "ORBITAL SIEGE COLOSSUS", fill=(100, 200, 255, 255))

# Artillery barrage bullets — massive spread
for _ in range(350):
    bx = random.randint(50, W - 50)
    by = random.randint(50, 350)
    br = random.randint(1, 4)
    bc = random.choice([(255, 60, 40, 200), (255, 150, 30, 200), (255, 220, 60, 180), (255, 80, 80, 200), (255, 255, 150, 180)])
    draw_rt.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=bc)

# Player bullets
for _ in range(80):
    bx = random.randint(500, 600)
    by = random.randint(300, 520)
    draw_rt.ellipse([(bx - 1, by - 1), (bx + 1, by + 1)], fill=(0, 220, 255, 220))

# Weapon_deployed preview inset
weapon_thumb = imgs[UNIT_IDS[3]].resize((80, 80), Image.LANCZOS)
rt.paste(weapon_thumb, (60, 380), weapon_thumb)
draw_rt.text((50, 465), "superweapon", fill=(255, 60, 200, 180))

# Core exposed preview inset
core_thumb = imgs[UNIT_IDS[2]].resize((80, 80), Image.LANCZOS)
rt.paste(core_thumb, (170, 380), core_thumb)
draw_rt.text((160, 465), "core exposed", fill=(255, 100, 60, 180))

# Catastrophic scale callout
draw_rt.rectangle([(300, 330), (800, 460)], fill=(5, 8, 25, 200))
draw_rt.text((320, 345), "CATASTROPHIC SCALE", fill=(100, 200, 255, 255))
draw_rt.text((320, 365), "320x320 master resolution", fill=(200, 200, 200, 200))
draw_rt.text((320, 385), "Fortress-class superweapon tier", fill=(200, 200, 200, 200))
draw_rt.text((320, 405), "4-state combat arc (armor/damage/critical/weapon)", fill=(200, 200, 200, 200))
draw_rt.text((320, 425), "Largest boss asset in Galaxy Raiders", fill=(200, 200, 200, 200))
draw_rt.text((320, 445), "Screen-dominating orbital siege presence", fill=(200, 200, 200, 200))

# Bottom bar
draw_rt.rectangle([(900, 570), (1090, 600)], fill=(5, 5, 20, 220))
draw_rt.text((910, 576), "orbital_siege_colossus v1.0", fill=(180, 180, 200, 255))

# Border frame
draw_rt.rectangle([(0, 0), (W, 3)], fill=(40, 60, 100, 200))
draw_rt.rectangle([(0, H - 3), (W, H)], fill=(40, 60, 100, 200))

RT_PATH = os.path.join(SPRITES, "previews", "runtime", "orbital_siege_colossus_runtime_preview.png")
rt.save(RT_PATH, "PNG")
print(f"  -> {RT_PATH} ({rt.size})")

# ===== 5. PHASE TRANSITION PREVIEW =====
print("Creating phase transition preview...")
pp = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw_pp = ImageDraw.Draw(pp)

draw_pp.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw_pp.text((10, 6), "ORBITAL SIEGE COLOSSUS — PHASE TRANSITIONS | fortress destruction + superweapon arc", fill=(100, 200, 255, 255))

# Four columns
col_w = 260
col_h = 500
phase_info = [
    ("PHASE 1", "FULL ARMOR\n100%-66% HP", UNIT_IDS[0], (160, 200, 255, 255), "Intact ring | layered armor\nCommanding siege presence"),
    ("PHASE 2", "DAMAGED\n66%-33% HP", UNIT_IDS[1], (255, 180, 80, 255), "Fractured rings | scoring damage\nFlickering siege energy"),
    ("PHASE 3", "CORE EXPOSED\n33%-0% HP", UNIT_IDS[2], (255, 100, 60, 255), "Shattered rings | full core exposure\nMaximum weakpoint visibility"),
    ("PHASE 4", "WEAPON OPEN\nspecial trigger", UNIT_IDS[3], (255, 60, 200, 255), "Artillery deployed | channels active\nCatastrophic attack posture"),
]

for i, (title, desc, uid, col, notes) in enumerate(phase_info):
    x0 = 10 + i * (col_w + 10)
    x1 = x0 + col_w
    bg_col = [(3, 3, 15, 255), (5, 3, 12, 255), (8, 3, 10, 255), (12, 3, 18, 255)][i]
    draw_pp.rectangle([(x0, 32), (x1, 620)], fill=bg_col)

    draw_pp.text((x0 + 10, 40), title, fill=col)
    draw_pp.text((x0 + 10, 60), desc, fill=(200, 200, 200, 200))

    scaled = imgs[uid].resize((col_w - 40, col_w - 40), Image.LANCZOS)
    pp.paste(scaled, (x0 + 20, 110), scaled)

    draw_pp.text((x0 + 10, 110 + col_w - 20), notes, fill=(200, 200, 200, 190))

    # Arrow to next
    if i < 3:
        ax = x1 + 2
        ay = 110 + (col_w - 40) // 2
        arr_col = [(160, 200, 255, 255), (255, 180, 80, 255), (255, 100, 60, 255)][i]
        draw_pp.polygon([(ax, ay - 10), (ax + 12, ay), (ax, ay + 10)], fill=arr_col)

# Weakpoint indicators
for i, (x, y) in enumerate([(130, 340), (400, 340), (670, 340), (940, 340)]):
    draw_pp.ellipse([(x, y), (x + 18, y + 18)], outline=(0, 255, 255, 200 + i * 15), width=2)
    lbl = ["crest", "partial core", "full core exposed", "core + weapon array"][i]
    draw_pp.text((x + 24, y + 2), "weakpoint: " + lbl, fill=(0, 255, 255, 180 + i * 15))

# Summary
draw_pp.rectangle([(12, 430), (1088, 590)], fill=(5, 10, 5, 180))
draw_pp.text((30, 450), "FORTRESS DESTRUCTION ARC SUMMARY", fill=(100, 255, 100, 255))
draw_pp.text((30, 478), "Phase 1: Intact fortress projects maximum orbital siege authority — full ring geometry and layered armor.", fill=(200, 255, 200, 200))
draw_pp.text((30, 506), "Phase 2: Damaged rings signal progress; flickering energy and armor scoring create visual escalation tension.", fill=(255, 230, 180, 200))
draw_pp.text((30, 534), "Phase 3: Shattered rings expose the central reactor; maximum weakpoint readability for the final damage phase.", fill=(255, 180, 140, 200))
draw_pp.text((30, 562), "Phase 4: Superweapon deployment transforms silhouette; artillery arrays extend for catastrophic attack sequences.", fill=(255, 140, 220, 200))

draw_pp.rectangle([(900, 570), (1090, 600)], fill=(5, 5, 20, 220))
draw_pp.text((910, 576), "colossus phases v1.0", fill=(180, 180, 200, 255))

PHASE_PATH = os.path.join(SPRITES, "previews", "runtime", "orbital_siege_colossus_phase_preview.png")
pp.save(PHASE_PATH, "PNG")
print(f"  -> {PHASE_PATH} ({pp.size})")

for img in imgs.values():
    img.close()

print("\nAll Orbital Siege Colossus fortress-class assets generated.")
