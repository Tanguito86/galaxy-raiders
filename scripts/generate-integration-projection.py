"""Generate runtime integration projection preview — mixed factions, mini-boss, flagship, fortress."""
import os, random
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES = os.path.join(BASE, "www", "assets", "sprites")

W, H = 1100, 620
img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(img)

random.seed(42)
bullet_colors = [
    (255, 80, 80, 200), (255, 160, 40, 200), (255, 220, 60, 200),
    (255, 100, 100, 180), (255, 255, 255, 160), (0, 200, 255, 180),
    (255, 60, 60, 140), (255, 200, 50, 180),
]

# Load faction sprites (frame 0 = master from each faction sheet)
faction_sheets = {
    "scout": os.path.join(SPRITES, "enemies", "scout", "scout_alien_faction_sheet.png"),
    "suppressor": os.path.join(SPRITES, "enemies", "suppressor", "suppressor_alien_faction_sheet.png"),
    "splitter": os.path.join(SPRITES, "enemies", "splitter", "splitter_alien_faction_sheet.png"),
    "imperial": os.path.join(SPRITES, "enemies", "imperial", "imperial_alien_faction_sheet.png"),
}

faction_imgs = {}
for name, path in faction_sheets.items():
    sheet = Image.open(path).convert("RGBA")
    faction_imgs[name] = sheet.crop((0, 0, 128, 128)).convert("RGBA")
    sheet.close()

# Mini-boss
miniboss_sheet = Image.open(os.path.join(SPRITES, "bosses", "miniboss_hierarchy_sheet.png")).convert("RGBA")
miniboss_frames = [miniboss_sheet.crop((i * 192, 0, (i + 1) * 192, 192)).convert("RGBA") for i in range(4)]
miniboss_sheet.close()

# Flagship
flagship_sheet = Image.open(os.path.join(SPRITES, "bosses", "imperial_flagship", "imperial_flagship_command_sheet.png")).convert("RGBA")
flagship = flagship_sheet.crop((0, 0, 256, 256)).convert("RGBA")
flagship_sheet.close()

# Fortress
fortress_sheet = Image.open(os.path.join(SPRITES, "bosses", "orbital_siege", "orbital_siege_colossus_sheet.png")).convert("RGBA")
fortress = fortress_sheet.crop((0, 0, 320, 320)).convert("RGBA")
fortress_sheet.close()

# Player wedge
player_path = os.path.join(SPRITES, "player", "player_wedge_anim_sheet.png")
if os.path.exists(player_path):
    player_sheet = Image.open(player_path).convert("RGBA")
    player_frame = player_sheet.crop((0, 0, 36, 44)).convert("RGBA")
    player_sheet.close()
else:
    player_frame = None

# Crabtron hero
hero_path = os.path.join(BASE, "www", "ai-generated", "crabtron-hero-20260523", "crabtron_hero_master_sheet.png")
if os.path.exists(hero_path):
    hero_sheet = Image.open(hero_path).convert("RGBA")
    crabtron_hero = hero_sheet.crop((0, 0, 192, 192)).convert("RGBA")
    hero_sheet.close()
else:
    crabtron_hero = None

# Header
draw.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw.text((10, 6), "GALAXY RAIDERS — RUNTIME INTEGRATION PROJECTION | full sprite lab hierarchy", fill=(100, 255, 100, 255))

# Starfield bg
draw.rectangle([(0, 30), (W, H)], fill=(2, 2, 12, 255))
for _ in range(200):
    sx = random.randint(0, W)
    sy = random.randint(30, H)
    sr = random.randint(0, 1)
    sb = random.randint(60, 180)
    draw.ellipse([(sx - sr, sy - sr), (sx + sr, sy + sr)], fill=(sb, sb, sb, 180))

# Player at bottom center
if player_frame:
    img.paste(player_frame, (535, 560), player_frame)
    draw.polygon([(545, 540), (553, 553), (560, 540)], fill=(0, 200, 255, 180))

# === ENEMY FACTION ZONES (scattered enemies across mid-screen) ===

# Scout enemies (top-left cluster)
scout_img = faction_imgs["scout"].resize((48, 48), Image.LANCZOS)
for i in range(3):
    x = 30 + i * 60
    y = 60 + i * 20
    img.paste(scout_img, (x, y), scout_img)
draw.text((30, 130), "SCOUT faction", fill=(0, 200, 255, 200))

# Suppressor enemies (top-right cluster)
supp_img = faction_imgs["suppressor"].resize((48, 48), Image.LANCZOS)
for i in range(2):
    x = 780 + i * 70
    y = 60
    img.paste(supp_img, (x, y), supp_img)
draw.text((780, 130), "SUPPRESSOR faction", fill=(255, 120, 40, 200))

# Splitter enemies (mid-left)
split_img = faction_imgs["splitter"].resize((48, 48), Image.LANCZOS)
for i in range(3):
    x = 40 + i * 55
    y = 200 + i * 15
    img.paste(split_img, (x, y), split_img)
draw.text((40, 275), "SPLITTER faction", fill=(255, 180, 120, 200))

# Imperial enemies (mid-right)
imp_img = faction_imgs["imperial"].resize((48, 48), Image.LANCZOS)
for i in range(2):
    x = 790 + i * 70
    y = 180 + i * 20
    img.paste(imp_img, (x, y), imp_img)
draw.text((790, 270), "IMPERIAL faction", fill=(220, 200, 100, 200))

# === MINI-BOSS ZONE ===
draw.text((320, 36), "MINI-BOSS HIERARCHY", fill=(255, 200, 60, 255))
mb_names = ["Scout Hive", "Suppr Siege", "Splitter Node", "Imperial Cmd"]
mb_colors = [(0, 200, 255, 200), (255, 120, 40, 200), (255, 180, 120, 200), (220, 200, 100, 200)]
for i, (mb_img, name, col) in enumerate(zip(miniboss_frames, mb_names, mb_colors)):
    thumb = mb_img.resize((64, 64), Image.LANCZOS)
    x = 320 + i * 105
    y = 56
    img.paste(thumb, (x, y), thumb)
    draw.text((x, y + 68), name, fill=col)

# === FLAGSHIP ZONE (center-left) ===
fs_thumb = flagship.resize((96, 96), Image.LANCZOS)
img.paste(fs_thumb, (250, 380), fs_thumb)
draw.text((230, 482), "IMPERIAL FLAGSHIP", fill=(220, 200, 100, 255))
draw.text((230, 498), "256x256, 3 phases", fill=(180, 180, 180, 190))

# === FORTRESS ZONE (center-right) ===
ft_thumb = fortress.resize((100, 100), Image.LANCZOS)
img.paste(ft_thumb, (660, 380), ft_thumb)
draw.text((630, 486), "ORBITAL SIEGE FORTRESS", fill=(100, 200, 255, 255))
draw.text((630, 502), "320x320, 4 phases", fill=(180, 180, 180, 190))

# === CRABTRON HERO BENCHMARK (right) ===
if crabtron_hero:
    ch_thumb = crabtron_hero.resize((80, 80), Image.LANCZOS)
    img.paste(ch_thumb, (920, 380), ch_thumb)
    draw.text((895, 466), "CRABTRON HERO", fill=(255, 60, 60, 255))
    draw.text((895, 482), "benchmark", fill=(180, 180, 180, 190))

# Bullet scatter across battlefield
for _ in range(300):
    bx = random.randint(20, W - 20)
    by = random.randint(40, 555)
    br = random.randint(1, 2)
    draw.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=random.choice(bullet_colors))

# HUD mock elements
draw.rectangle([(10, 580), (120, 610)], fill=(3, 5, 15, 200))
draw.text((20, 585), "SCORE: 42,800", fill=(200, 200, 200, 200))
draw.text((20, 598), "HI: 156,400", fill=(255, 200, 60, 180))

draw.rectangle([(980, 580), (1090, 610)], fill=(3, 5, 15, 200))
draw.text((990, 585), "v2.0 HIERARCHY", fill=(100, 255, 100, 200))
draw.text((990, 598), "INTEGRATED", fill=(100, 255, 100, 200))

# Bottom bar
draw.rectangle([(0, H - 2), (W, H)], fill=(40, 60, 100, 200))

OUT = os.path.join(BASE, "www", "assets", "sprites", "previews", "runtime", "runtime_integration_projection.png")
img.save(OUT, "PNG")

for v in faction_imgs.values():
    v.close()
for f in miniboss_frames:
    f.close()
flagship.close()
fortress.close()
if crabtron_hero:
    crabtron_hero.close()
if player_frame:
    player_frame.close()

print(f"Preview saved: {OUT} ({img.size})")
