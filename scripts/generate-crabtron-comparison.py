"""Generate Crabtron legacy vs hero runtime comparison preview."""
import os, random
from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEGACY = os.path.join(BASE, "www", "assets", "sprites", "boss_crabtron.png")
HERO = os.path.join(BASE, "www", "ai-generated", "crabtron-hero-20260523", "crabtron_hero_master_sheet.png")

W, H = 1100, 620
rv = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(rv)

legacy_img = Image.open(LEGACY).convert("RGBA")
hero_sheet = Image.open(HERO).convert("RGBA")

# Extract hero idle composite (row 0, col 0 of 192x192 grid)
hero_idle = hero_sheet.crop((0, 0, 192, 192)).convert("RGBA")

# Header
draw.rectangle([(0, 0), (W, 30)], fill=(10, 12, 30, 255))
draw.text((10, 6), "CRABTRON — LEGACY vs HERO COMPARISON | 96x96 legacy  |  192x192 hero  |  gameplay scale", fill=(200, 200, 200, 255))

# --- ROW 1: Side-by-side at source resolution ---
draw.text((20, 36), "SOURCE RESOLUTION", fill=(255, 200, 60, 255))

# Legacy at 1:1 (96x96)
draw.rectangle([(50, 60), (50 + 96, 60 + 96)], fill=(5, 5, 20, 255))
rv.paste(legacy_img, (50, 60), legacy_img)
draw.text((50, 170), "Legacy 96x96", fill=(255, 100, 100, 220))
draw.text((50, 185), "12.9 KB", fill=(150, 150, 150, 200))

# Hero at 1:1 (192x192)
draw.rectangle([(250, 60), (250 + 192, 60 + 192)], fill=(5, 5, 20, 255))
rv.paste(hero_idle, (250, 60), hero_idle)
draw.text((250, 265), "Hero 192x192", fill=(100, 255, 100, 220))
draw.text((250, 280), "449 KB sheet | 5 states x 8 layers", fill=(150, 150, 150, 200))

# Separator
draw.line([(0, 310), (W, 310)], fill=(60, 60, 60, 200), width=2)

# --- ROW 2: Gameplay scale comparison ---
draw.text((20, 316), "GAMEPLAY SCALE (boss.w=90, boss.h=45)", fill=(255, 200, 60, 255))

# Legacy at gameplay scale: 0.72 × 96 = 69px
LEG_SCALE = 0.72
leg_w = int(96 * LEG_SCALE)
leg_h = int(96 * LEG_SCALE)
legacy_scaled = legacy_img.resize((leg_w, leg_h), Image.LANCZOS)

# Hero at gameplay scale: 0.45 × 192 = 86px (current) and 0.55 × 192 = 106px (recommended)
HERO_SCALE_CUR = 0.45
HERO_SCALE_REC = 0.55
hero_w_cur = int(192 * HERO_SCALE_CUR)
hero_h_cur = int(192 * HERO_SCALE_CUR)
hero_w_rec = int(192 * HERO_SCALE_REC)
hero_h_rec = int(192 * HERO_SCALE_REC)
hero_scaled_cur = hero_idle.resize((hero_w_cur, hero_h_cur), Image.LANCZOS)
hero_scaled_rec = hero_idle.resize((hero_w_rec, hero_h_rec), Image.LANCZOS)

# Legacy gameplay
draw.rectangle([(50, 340), (50 + leg_w, 340 + leg_h)], fill=(3, 3, 10, 255))
rv.paste(legacy_scaled, (50, 340), legacy_scaled)
draw.text((50, 340 + leg_h + 5), "Legacy  scale=0.72", fill=(255, 100, 100, 200))
draw.text((50, 340 + leg_h + 18), f"visual: {leg_w}x{leg_h}", fill=(150, 150, 150, 180))

# Hero current scale (0.45)
draw.rectangle([(200, 340), (200 + hero_w_cur, 340 + hero_h_cur)], fill=(3, 3, 10, 255))
rv.paste(hero_scaled_cur, (200, 340), hero_scaled_cur)
draw.text((200, 340 + hero_h_cur + 5), "Hero  scale=0.45 (current)", fill=(255, 220, 80, 200))
draw.text((200, 340 + hero_h_cur + 18), f"visual: {hero_w_cur}x{hero_h_cur}", fill=(150, 150, 150, 180))

# Hero recommended scale (0.55)
draw.rectangle([(380, 340), (380 + hero_w_rec, 340 + hero_h_rec)], fill=(3, 3, 10, 255))
rv.paste(hero_scaled_rec, (380, 340), hero_scaled_rec)
draw.text((380, 340 + hero_h_rec + 5), "Hero  scale=0.55 (recommended)", fill=(100, 255, 100, 200))
draw.text((380, 340 + hero_h_rec + 18), f"visual: {hero_w_rec}x{hero_h_rec}", fill=(150, 150, 150, 180))

# VS label
draw.text((318, 375), "VS", fill=(255, 255, 255, 255))

# --- ROW 2b: Bullet clutter comparison (right side) ---
draw.text((580, 316), "BULLET CLUTTER", fill=(255, 200, 60, 255))

random.seed(42)
bullet_colors = [
    (255, 80, 80, 200), (255, 160, 40, 200), (255, 220, 60, 200),
    (255, 100, 100, 180), (255, 255, 255, 160), (0, 200, 255, 180),
    (255, 60, 60, 140),
]

# Legacy in clutter
draw.rectangle([(580, 340), (680, 440)], fill=(5, 5, 20, 255))
for _ in range(60):
    bx = random.randint(580, 680)
    by = random.randint(340, 440)
    br = random.randint(1, 3)
    draw.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=random.choice(bullet_colors))
rv.paste(legacy_scaled, (595, 355), legacy_scaled)
draw.text((590, 445), "Legacy + clutter", fill=(255, 100, 100, 200))

# Hero in clutter
draw.rectangle([(720, 340), (820, 440)], fill=(5, 5, 20, 255))
for _ in range(60):
    bx = random.randint(720, 820)
    by = random.randint(340, 440)
    br = random.randint(1, 3)
    draw.ellipse([(bx - br, by - br), (bx + br, by + br)], fill=random.choice(bullet_colors))
rv.paste(hero_scaled_rec, (727, 350), hero_scaled_rec)
draw.text((720, 445), "Hero + clutter", fill=(100, 255, 100, 200))

# Separator for bottom
draw.line([(0, 480), (W, 480)], fill=(60, 60, 60, 200), width=2)

# --- ROW 3: Silhouette comparison ---
draw.text((20, 486), "SILHOUETTE COMPARISON (all-white fill)", fill=(255, 200, 60, 255))

# Extract silhouettes by thresholding alpha to white
def make_silhouette(img, size):
    sil = Image.new("RGBA", img.size, (0, 0, 0, 0))
    pixels = img.load()
    sil_pixels = sil.load()
    for y in range(img.height):
        for x in range(img.width):
            a = pixels[x, y][3] if len(pixels[x, y]) == 4 else 255
            if a > 80:
                sil_pixels[x, y] = (255, 255, 255, 255)
    return sil.resize(size, Image.LANCZOS)

sil_w, sil_h = 80, 80
leg_sil = make_silhouette(legacy_img, (sil_w, sil_h))
hero_sil = make_silhouette(hero_idle, (sil_w, sil_h))

draw.rectangle([(50, 510), (50 + sil_w, 510 + sil_h)], fill=(3, 3, 10, 255))
rv.paste(leg_sil, (50, 510), leg_sil)
draw.text((55, 520), "L", fill=(200, 200, 200, 180))

draw.rectangle([(180, 510), (180 + sil_w, 510 + sil_h)], fill=(3, 3, 10, 255))
rv.paste(hero_sil, (180, 510), hero_sil)
draw.text((205, 520), "H", fill=(200, 200, 200, 180))

draw.text((50, 596), "Silhouette readability: hero has clearer claw separation and core void", fill=(200, 200, 200, 180))

# Hero state labels on right
draw.text((580, 486), "HERO STATES (row 0-4 of master sheet)", fill=(255, 200, 60, 255))
state_names = ["idle", "attack_windup", "mid_damage", "rage_phase", "death"]
for i, name in enumerate(state_names):
    y = 510 + i * 22
    thumb = hero_sheet.crop((0, i * 192, 192, (i + 1) * 192)).convert("RGBA")
    thumb = thumb.resize((32, 32), Image.LANCZOS)
    rv.paste(thumb, (580, y), thumb)
    draw.text((620, y + 6), name, fill=(200, 200, 200, 220))

# Bottom bar
draw.rectangle([(900, 595), (1090, 617)], fill=(5, 5, 20, 220))
draw.text((910, 600), "crabtron legacy vs hero  v1.0", fill=(180, 180, 200, 255))

OUT = os.path.join(BASE, "www", "assets", "sprites", "previews", "runtime", "crabtron_legacy_vs_hero_preview.png")
rv.save(OUT, "PNG")

legacy_img.close()
hero_sheet.close()
print(f"Preview saved: {OUT} ({rv.size})")
