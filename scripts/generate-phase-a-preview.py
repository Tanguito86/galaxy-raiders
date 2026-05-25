"""Generate Phase A runtime preview: S04 Wedge player + Scout faction in gameplay scene."""
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

# Header
draw.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw.text((10, 6), "PHASE A INTEGRATION — S04 Wedge player + Scout faction | 128x128 masters | gameplay scale", fill=(100, 255, 100, 255))

# Starfield
draw.rectangle([(0, 30), (W, H)], fill=(2, 2, 12, 255))
for _ in range(200):
    sx = random.randint(0, W)
    sy = random.randint(30, H)
    sr = random.randint(0, 1)
    sb = random.randint(60, 180)
    draw.ellipse([(sx - sr, sy - sr), (sx + sr, sy + sr)], fill=(sb, sb, sb, 180))

# --- Load sprites ---
# S04 Wedge player
player_path = os.path.join(SPRITES, "player", "player_s04_wedge_idle.png")
player_img = Image.open(player_path).convert("RGBA") if os.path.exists(player_path) else None

# Scout faction sheet
scout_sheet = Image.open(os.path.join(SPRITES, "enemies", "scout", "scout_alien_faction_sheet.png")).convert("RGBA")
scout_frames = [scout_sheet.crop((i * 128, 0, (i + 1) * 128, 128)).convert("RGBA") for i in range(4)]
scout_sheet.close()

# Legacy alien1 for comparison
legacy_alien = Image.open(os.path.join(SPRITES, "alien1.png")).convert("RGBA") if os.path.exists(os.path.join(SPRITES, "alien1.png")) else None

# ===== LEFT HALF: S04 Wedge Player Showcase =====
draw.text((20, 36), "PLAYER: S04 WEDGE", fill=(0, 200, 255, 255))

if player_img:
    # Full size (128x128)
    draw.rectangle([(30, 56), (158, 184)], fill=(3, 3, 10, 255))
    img.paste(player_img, (30, 56), player_img)
    draw.text((40, 190), "S04 Wedge 128x128 master", fill=(200, 200, 200, 190))

    # Gameplay scale 0.45 (58px)
    player_gp = player_img.resize((58, 58), Image.LANCZOS)
    draw.rectangle([(180, 70), (238, 128)], fill=(3, 10, 3, 255))
    img.paste(player_gp, (180, 70), player_gp)
    draw.text((180, 134), "gameplay 0.45 scale (58px)", fill=(100, 255, 100, 180))

    # Hitbox reference
    draw.rectangle([(178, 82), (242, 106)], outline=(255, 255, 0, 150), width=1)
    draw.text((180, 146), "33x24 hitbox unchanged", fill=(255, 255, 0, 160))

# Old wedge for comparison
old_wedge = os.path.join(SPRITES, "player", "player_wedge_anim_sheet.png")
if os.path.exists(old_wedge):
    ow = Image.open(old_wedge).convert("RGBA")
    ow_frame = ow.crop((0, 0, 36, 44)).convert("RGBA")
    ow.close()
    draw.rectangle([(270, 70), (306, 114)], fill=(3, 3, 10, 255))
    img.paste(ow_frame, (270, 70), ow_frame)
    draw.text((270, 120), "old wedge 36x44 (fallback)", fill=(255, 100, 100, 180))

# ===== RIGHT HALF: Scout Faction Showcase =====
draw.text((520, 36), "ENEMY: SCOUT FACTION", fill=(0, 200, 255, 255))

frame_names = ["mk1_master", "elite", "sniper", "swarm"]
for i, (frame, name) in enumerate(zip(scout_frames, frame_names)):
    x = 520 + i * 140
    y = 56
    thumb = frame.resize((56, 56), Image.LANCZOS)
    draw.rectangle([(x, y), (x + 56, y + 56)], fill=(3, 3, 10, 255))
    img.paste(thumb, (x, y), thumb)
    draw.text((x, y + 60), name, fill=(200, 200, 200, 180))
    draw.text((x, y + 74), "128x128", fill=(150, 150, 150, 160))

# Legacy alien1 comparison
if legacy_alien:
    la = legacy_alien.resize((32, 32), Image.LANCZOS)
    draw.rectangle([(520, 160), (552, 192)], fill=(3, 3, 10, 255))
    img.paste(la, (520, 160), la)
    draw.text((520, 196), "legacy alien1 32px (fallback)", fill=(255, 100, 100, 160))

# Scout faction at gameplay scale in clutter
draw.text((680, 160), "at gameplay scale (64x64 target)", fill=(100, 255, 100, 160))
clutter_scout = scout_frames[0].resize((48, 48), Image.LANCZOS)
img.paste(clutter_scout, (680, 178), clutter_scout)
for _ in range(15):
    bx = random.randint(680, 730)
    by = random.randint(178, 226)
    br = random.randint(1, 2)
    draw.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=random.choice(bullet_colors))
draw.text((680, 230), "scale 0.50 through bullets", fill=(180, 180, 180, 160))

# Separator
draw.line([(0, 270), (W, 270)], fill=(60, 60, 60, 200), width=2)

# ===== BOTTOM HALF: Mixed Combat Scene =====
draw.text((20, 276), "MIXED COMBAT — player vs scout enemies (gameplay scale)", fill=(255, 200, 60, 255))

# Player at bottom center
if player_img:
    p_gp = player_img.resize((58, 58), Image.LANCZOS)
    img.paste(p_gp, (530, 500), p_gp)
    draw.text((480, 562), "PLAYER (S04 Wedge, scale 0.45)", fill=(0, 200, 255, 200))

# Scout enemies scattered across upper area
for i in range(6):
    frame_idx = i % 4
    scale = [0.50, 0.48, 0.46, 0.42, 0.44, 0.50][i]
    sz = int(128 * scale)
    enemy = scout_frames[frame_idx].resize((sz, sz), Image.LANCZOS)
    x = 80 + (i * 170) + random.randint(-20, 20)
    y = 310 + random.randint(0, 60)
    img.paste(enemy, (x, y), enemy)

# Faction labels
draw.text((80, 390), "alien1 -> mk1_master", fill=(200, 200, 200, 170))
draw.text((250, 380), "alien2 -> sniper", fill=(200, 200, 200, 170))
draw.text((420, 390), "alien4 -> elite", fill=(200, 200, 200, 170))
draw.text((590, 380), "alien5 -> swarm", fill=(200, 200, 200, 170))

# Kill switch info
draw.rectangle([(10, 540), (350, 610)], fill=(3, 5, 15, 200))
draw.text((20, 548), "KILL SWITCHES:", fill=(255, 200, 60, 220))
draw.text((20, 566), "GALAXY_CONFIG.spriteLab.playerS04Wedge", fill=(200, 200, 200, 190))
draw.text((20, 582), "  = false  -> falls back to player_wedge", fill=(150, 150, 150, 180))
draw.text((20, 598), "GALAXY_CONFIG.spriteLab.factionScout", fill=(200, 200, 200, 190))
draw.text((20, 610), "  = false  -> falls back to fleet_scout", fill=(150, 150, 150, 180))

# Fallback chain
draw.rectangle([(370, 540), (1090, 610)], fill=(3, 5, 15, 200))
draw.text((380, 548), "FALLBACK CHAIN (intact):", fill=(100, 255, 100, 220))
draw.text((380, 566), "player: S04 Wedge -> player_wedge -> player_ship_3x3 -> player -> legacy pixel", fill=(200, 200, 200, 190))
draw.text((380, 582), "enemy: faction_scout -> fleet_scout -> alien1_strip -> alien1 -> legacy pixel matrix", fill=(200, 200, 200, 190))
draw.text((380, 598), "NO gameplay/hitbox/collision/AI/balance changed.", fill=(100, 255, 100, 220))

# Bottom bar
draw.rectangle([(0, H - 2), (W, H)], fill=(40, 60, 100, 200))

OUT = os.path.join(BASE, "www", "assets", "sprites", "previews", "runtime", "runtime_phase_a_player_scout_preview.png")
img.save(OUT, "PNG")

if player_img: player_img.close()
for f in scout_frames: f.close()
if legacy_alien: legacy_alien.close()

print(f"Preview saved: {OUT} ({img.size})")
