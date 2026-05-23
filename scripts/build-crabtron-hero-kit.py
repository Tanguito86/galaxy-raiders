from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SRC_RAW = ROOT / "www" / "ai-generated" / "boss-sprites-20260516" / "boss_crabtron" / "raw.png"
OUT_DIR = ROOT / "www" / "ai-generated" / "crabtron-hero-20260523"

CELL = 192
COLS = [
    "composite",
    "shadow",
    "body",
    "left_claw",
    "right_claw",
    "weakpoint_core",
    "cannons_vents",
    "overlay_glow_damage",
]
ROWS = [
    "idle",
    "attack_windup",
    "mid_damage",
    "rage_phase",
    "death_exposed_core",
]


def remove_magenta(raw: Image.Image) -> Image.Image:
    src = raw.convert("RGBA")
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    pix_in = src.load()
    pix_out = out.load()
    w, h = src.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix_in[x, y]
            is_key = r > 210 and g < 80 and b > 210
            if not is_key:
                pix_out[x, y] = (r, g, b, a)
    return out


def fit_to_cell(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    subject = img.crop(bbox)
    scale = min(168 / subject.width, 128 / subject.height)
    size = (max(1, round(subject.width * scale)), max(1, round(subject.height * scale)))
    subject = subject.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    canvas.alpha_composite(subject, ((CELL - size[0]) // 2, 30 + (128 - size[1]) // 2))
    return canvas


def alpha_mask(img: Image.Image) -> Image.Image:
    return img.getchannel("A")


def region_mask(img: Image.Image, predicate) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    src = alpha_mask(img)
    pix_src = src.load()
    pix = mask.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            if pix_src[x, y] > 0 and predicate(x, y):
                pix[x, y] = pix_src[x, y]
    return mask


def color_mask(img: Image.Image, predicate) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    pix_img = img.load()
    pix = mask.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix_img[x, y]
            if a > 0 and predicate(r, g, b, x, y):
                pix[x, y] = a
    return mask


def layer_from_mask(img: Image.Image, mask: Image.Image) -> Image.Image:
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def multiply_tint(img: Image.Image, tint: tuple[int, int, int], strength: float) -> Image.Image:
    base = img.convert("RGBA")
    tint_layer = Image.new("RGBA", base.size, (*tint, 0))
    tint_layer.putalpha(alpha_mask(base).point(lambda a: int(a * strength)))
    return Image.alpha_composite(base, tint_layer)


def add_cracks(draw: ImageDraw.ImageDraw, alpha: float, offset: int = 0) -> None:
    color = (12, 4, 3, int(210 * alpha))
    hot = (255, 94, 32, int(110 * alpha))
    cracks = [
        [(78, 82), (70, 90), (72, 101), (62, 112)],
        [(113, 78), (121, 90), (118, 104), (130, 113)],
        [(92, 70), (88, 86), (96, 98)],
        [(74, 130), (84, 121), (93, 130)],
        [(121, 128), (111, 119), (101, 130)],
    ]
    for pts in cracks:
        shifted = [(x + offset, y) for x, y in pts]
        draw.line(shifted, fill=color, width=2)
        draw.line(shifted[:2], fill=hot, width=1)


def make_overlay(base: Image.Image, state: str) -> Image.Image:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    if state == "attack_windup":
        draw.rectangle((48, 100, 144, 110), fill=(255, 54, 22, 45))
        draw.ellipse((70, 76, 122, 128), outline=(255, 205, 140, 120), width=2)
    elif state == "mid_damage":
        add_cracks(draw, 0.85)
        draw.rectangle((57, 91, 78, 105), fill=(20, 5, 3, 84))
        draw.rectangle((118, 91, 138, 108), fill=(20, 5, 3, 76))
    elif state == "rage_phase":
        draw.rectangle((38, 76, 154, 140), fill=(255, 42, 18, 44))
        draw.ellipse((72, 76, 120, 126), outline=(255, 225, 160, 160), width=3)
        for x in [58, 70, 122, 134]:
            draw.line((x, 74, x + 8, 51), fill=(255, 70, 24, 132), width=2)
    elif state == "death_exposed_core":
        add_cracks(draw, 1.0, 1)
        draw.rectangle((70, 82, 122, 134), fill=(13, 4, 4, 118))
        draw.ellipse((75, 88, 117, 130), fill=(255, 76, 20, 150), outline=(255, 225, 150, 190), width=2)
        draw.line((84, 96, 108, 122), fill=(255, 230, 170, 180), width=2)
        draw.line((109, 96, 84, 122), fill=(255, 230, 170, 140), width=1)
    return overlay


def make_shadow(base: Image.Image) -> Image.Image:
    mask = alpha_mask(base).filter(ImageFilter.GaussianBlur(3))
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    shadow.putalpha(mask.point(lambda a: int(a * 0.45)))
    shadow = ImageChops.offset(shadow, 0, 7)
    return shadow


def make_glow(base: Image.Image, state: str, core_mask: Image.Image) -> Image.Image:
    strength = {
        "idle": 0.38,
        "attack_windup": 0.58,
        "mid_damage": 0.48,
        "rage_phase": 0.82,
        "death_exposed_core": 0.92,
    }[state]
    glow_mask = core_mask.filter(ImageFilter.GaussianBlur(6))
    glow = Image.new("RGBA", base.size, (255, 56, 18, 0))
    glow.putalpha(glow_mask.point(lambda a: int(min(190, a * strength))))
    return glow


def shift_layer(img: Image.Image, dx: int, dy: int) -> Image.Image:
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.alpha_composite(img, (dx, dy))
    return out


def compose_state(parts: dict[str, Image.Image], state: str) -> dict[str, Image.Image]:
    body = parts["body"].copy()
    left = parts["left_claw"].copy()
    right = parts["right_claw"].copy()
    cannons = parts["cannons_vents"].copy()
    core = parts["weakpoint_core"].copy()

    if state == "attack_windup":
        left = shift_layer(left, -4, 2)
        right = shift_layer(right, 4, 2)
        core = multiply_tint(core, (255, 70, 24), 0.34)
    elif state == "mid_damage":
        body = multiply_tint(body, (55, 28, 20), 0.22)
        left = multiply_tint(left, (55, 28, 20), 0.18)
        right = multiply_tint(right, (55, 28, 20), 0.18)
    elif state == "rage_phase":
        body = multiply_tint(body, (140, 20, 12), 0.20)
        left = shift_layer(multiply_tint(left, (180, 28, 16), 0.16), -3, -2)
        right = shift_layer(multiply_tint(right, (180, 28, 16), 0.16), 3, -2)
        core = multiply_tint(core, (255, 120, 30), 0.52)
    elif state == "death_exposed_core":
        body = multiply_tint(body, (30, 20, 18), 0.36)
        left = shift_layer(multiply_tint(left, (40, 28, 24), 0.30), -4, 7)
        right = shift_layer(multiply_tint(right, (40, 28, 24), 0.30), 4, 7)
        cannons = multiply_tint(cannons, (20, 12, 10), 0.45)

    overlay = make_overlay(parts["source"], state)
    glow = make_glow(parts["source"], state, parts["core_mask"])
    shadow = make_shadow(Image.alpha_composite(Image.alpha_composite(body, left), right))

    composite = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    for layer in [shadow, glow, body, left, right, cannons, core, overlay]:
        composite.alpha_composite(layer)

    return {
        "composite": composite,
        "shadow": shadow,
        "body": body,
        "left_claw": left,
        "right_claw": right,
        "weakpoint_core": core,
        "cannons_vents": cannons,
        "overlay_glow_damage": Image.alpha_composite(glow, overlay),
    }


def save_preview(sheet: Image.Image, path: Path) -> None:
    label_h = 24
    preview = Image.new("RGBA", (sheet.width, sheet.height + label_h * (len(ROWS) + 1)), (6, 8, 14, 255))
    draw = ImageDraw.Draw(preview)
    try:
        font = ImageFont.truetype("arial.ttf", 13)
    except OSError:
        font = ImageFont.load_default()

    for c, name in enumerate(COLS):
        draw.text((c * CELL + 6, 5), name, fill=(180, 230, 255, 255), font=font)

    yoff = label_h
    for r, row in enumerate(ROWS):
        draw.text((6, yoff + r * (CELL + label_h) + 5), row, fill=(255, 220, 160, 255), font=font)
        row_img = sheet.crop((0, r * CELL, sheet.width, (r + 1) * CELL))
        preview.alpha_composite(row_img, (0, yoff + r * (CELL + label_h) + label_h))

    preview.save(path)


def save_readability_preview(state_layers: dict[str, dict[str, Image.Image]], path: Path) -> None:
    bg = Image.new("RGBA", (980, 1080), (4, 8, 18, 255))
    draw = ImageDraw.Draw(bg)
    try:
        font = ImageFont.truetype("arial.ttf", 13)
    except OSError:
        font = ImageFont.load_default()

    scales = [1.0, 0.75, 0.50]
    labels = ["192", "144", "96 runtime-ish"]
    for i, state in enumerate(ROWS):
        y = 42 + i * 198
        draw.text((12, y + 84), state, fill=(255, 220, 160, 255), font=font)
        for j, scale in enumerate(scales):
            img = state_layers[state]["composite"]
            sz = (round(CELL * scale), round(CELL * scale))
            small = img.resize(sz, Image.Resampling.LANCZOS)
            x = 180 + j * 210
            bg.alpha_composite(small, (x, y))
            if i == 0:
                draw.text((x + 38, 8), labels[j], fill=(180, 230, 255, 255), font=font)

    # Threat/readability sample: restrained bullets over the 96px rage sprite.
    sample = state_layers["rage_phase"]["composite"].resize((96, 96), Image.Resampling.LANCZOS)
    bg.alpha_composite(sample, (812, 436))
    for n in range(20):
        x = 790 + (n % 5) * 28
        y = 394 + (n // 5) * 34
        draw.rectangle((x - 1, y - 1, x + 5, y + 12), fill=(5, 3, 8, 255))
        draw.rectangle((x, y, x + 4, y + 11), fill=(255, 112, 52, 255))
        draw.rectangle((x + 1, y + 2, x + 3, y + 9), fill=(255, 245, 210, 230))
    draw.text((782, 544), "96px + bullets", fill=(180, 230, 255, 255), font=font)
    bg.save(path)


def qc_for_image(img: Image.Image) -> dict[str, object]:
    alpha = alpha_mask(img)
    bbox = alpha.getbbox()
    edge = 0
    pix = alpha.load()
    w, h = alpha.size
    for x in range(w):
        if pix[x, 0] > 0:
            edge += 1
        if pix[x, h - 1] > 0:
            edge += 1
    for y in range(h):
        if pix[0, y] > 0:
            edge += 1
        if pix[w - 1, y] > 0:
            edge += 1
    hist = alpha.histogram()
    coverage = (sum(hist) - hist[0]) / float(w * h)
    return {"bbox": list(bbox) if bbox else None, "edgeAlphaPixels": edge, "coverage": round(coverage, 4)}


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    layers_dir = OUT_DIR / "layers"
    layers_dir.mkdir(parents=True, exist_ok=True)

    source = fit_to_cell(remove_magenta(Image.open(SRC_RAW)))
    source.save(OUT_DIR / "crabtron_hero_seed_192.png")

    left_mask = region_mask(source, lambda x, y: x < 76 and y > 42)
    right_mask = region_mask(source, lambda x, y: x > 116 and y > 42)
    claw_union = ImageChops.lighter(left_mask, right_mask)
    core_mask = color_mask(
        source,
        lambda r, g, b, x, y: (r > 155 and 34 < g < 165 and b < 85 and 62 < x < 132 and 66 < y < 142),
    )
    vent_mask = color_mask(
        source,
        lambda r, g, b, x, y: (r > 145 and 26 < g < 150 and b < 90 and not (72 < x < 122 and 78 < y < 132)),
    )
    body_mask = ImageChops.subtract(alpha_mask(source), claw_union)
    body_mask = ImageChops.subtract(body_mask, core_mask)
    body_mask = body_mask.filter(ImageFilter.MaxFilter(3))

    parts = {
        "source": source,
        "body": layer_from_mask(source, body_mask),
        "left_claw": layer_from_mask(source, left_mask),
        "right_claw": layer_from_mask(source, right_mask),
        "weakpoint_core": layer_from_mask(source, core_mask.filter(ImageFilter.MaxFilter(5))),
        "cannons_vents": layer_from_mask(source, vent_mask.filter(ImageFilter.MaxFilter(3))),
        "core_mask": core_mask.filter(ImageFilter.MaxFilter(5)),
    }

    sheet = Image.new("RGBA", (CELL * len(COLS), CELL * len(ROWS)), (0, 0, 0, 0))
    state_layers_by_row = {}
    metadata = {
        "id": "crabtron_hero",
        "phase": "HC-VS-03B",
        "source": str(SRC_RAW.relative_to(ROOT)).replace("\\", "/"),
        "cell": {"width": CELL, "height": CELL},
        "sheet": "crabtron_hero_master_sheet.png",
        "columns": COLS,
        "rows": ROWS,
        "pivot": [96, 96],
        "runtimeScaleHint": 0.55,
        "silhouetteSafeArea": [8, 20, 184, 168],
        "weakpoint": {"pivot": [96, 108], "radius": 15, "layer": "weakpoint_core"},
        "slots": {},
        "layers": {},
        "qc": {},
        "notes": [
            "Generated as a modular hero kit. Not wired into runtime in HC-VS-03B.",
            "Composite frames are preview-ready; separated layers support cheap runtime animation.",
            "No gameplay, hitbox, boss behavior, timing, rank, score, or wave data is encoded here.",
        ],
    }

    for r, state in enumerate(ROWS):
        state_layers = compose_state(parts, state)
        state_layers_by_row[state] = state_layers
        state_dir = layers_dir / state
        state_dir.mkdir(parents=True, exist_ok=True)
        metadata["layers"][state] = {}
        metadata["qc"][state] = {}
        for c, col in enumerate(COLS):
            img = state_layers[col]
            sheet.alpha_composite(img, (c * CELL, r * CELL))
            layer_path = state_dir / f"{col}.png"
            img.save(layer_path)
            metadata["slots"][f"{state}.{col}"] = {"x": c * CELL, "y": r * CELL, "w": CELL, "h": CELL}
            metadata["layers"][state][col] = str(layer_path.relative_to(ROOT)).replace("\\", "/")
            metadata["qc"][state][col] = qc_for_image(img)

    sheet.save(OUT_DIR / "crabtron_hero_master_sheet.png")
    save_preview(sheet, OUT_DIR / "crabtron_hero_preview_labeled.png")
    save_readability_preview(state_layers_by_row, OUT_DIR / "crabtron_hero_readability_preview.png")

    prompt = """HC-VS-03B CRABTRON HERO SPRITE PASS
Source identity: existing generated CRABTRON boss seed from HC-ART.
Target: modular retro-HD arcade shmup boss kit, not a flat replacement image.
Priorities: silhouette clarity, weakpoint readability, Android vertical readability, restrained glow, military-industrial sci-fi palette.
States: idle, attack windup, mid damage, rage phase, death/exposed core.
Layers: composite, shadow, body, left claw, right claw, weakpoint core, cannons/vents, glow/damage overlay.
Avoid: neon rainbow, painterly realism, excessive bloom, tiny noisy detail, gameplay-affecting metadata."""
    (OUT_DIR / "prompt-used.txt").write_text(prompt, encoding="utf-8")
    (OUT_DIR / "crabtron_hero_metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
