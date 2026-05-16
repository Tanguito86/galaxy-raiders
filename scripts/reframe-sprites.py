"""HC-115: Reframe enemy sprites to max out 32x32 frame space with 22-28px visual mass."""
import os
from PIL import Image

STRIPS = {
    "alien1": "www/assets/sprites/alien1-strip.png",
    "alien2": "www/assets/sprites/alien2-strip.png",
    "alien3": "www/assets/sprites/alien3-strip.png",
    "alien4": "www/assets/sprites/alien4-strip.png",
    "alien5": "www/assets/sprites/alien5-strip.png",
    "alien6": "www/assets/sprites/alien6-strip.png",
}

FRAME_W = 32
FRAME_H = 32
TARGET_MIN = 22
TARGET_MAX = 28
PAD = 2  # min px from frame border


def frame_bbox(im):
    """Bounding box of non-transparent pixels in a 32x32 RGBA frame."""
    alpha = im.getchannel("A")
    alpha_data = list(alpha.getdata())
    w, h = im.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if alpha_data[y * w + x] > 32:
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y
    bw = max_x - min_x + 1
    bh = max_y - min_y + 1
    return min_x, min_y, bw, bh


def dilate_h(im):
    """Add 1px horizontal thickness by expanding canvas and cloning edge pixels."""
    w, h = im.size
    out = Image.new("RGBA", (w + 2, h), (0, 0, 0, 0))
    px = im.load()
    ox = out.load()
    for y in range(h):
        for x in range(w):
            a = px[x, y][3]
            ox[x + 1, y] = px[x, y]
            if a > 32:
                if x == 0 or px[x - 1, y][3] <= 32:
                    ox[x, y] = px[x, y]  # clone left edge
                if x == w - 1 or px[x + 1, y][3] <= 32:
                    ox[x + 2, y] = px[x, y]  # clone right edge
    return out


def dilate_v(im):
    """Add 1px vertical thickness by expanding canvas and cloning edge pixels."""
    w, h = im.size
    out = Image.new("RGBA", (w, h + 2), (0, 0, 0, 0))
    px = im.load()
    ox = out.load()
    for y in range(h):
        for x in range(w):
            a = px[x, y][3]
            ox[x, y + 1] = px[x, y]
            if a > 32:
                if y == 0 or px[x, y - 1][3] <= 32:
                    ox[x, y] = px[x, y]  # clone top edge
                if y == h - 1 or px[x, y + 1][3] <= 32:
                    ox[x, y + 2] = px[x, y]  # clone bottom edge
    return out


def bbox_size(im):
    """Return (width, height) of non-transparent bounding box."""
    alpha = im.getchannel("A")
    ad = list(alpha.getdata())
    w, h = im.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if ad[y * w + x] > 32:
                if x < min_x: min_x = x
                if y < min_y: min_y = y
                if x > max_x: max_x = x
                if y > max_y: max_y = y
    return max_x - min_x + 1, max_y - min_y + 1


def scale_fit(content, bw, bh):
    """
    Scale uniformly so larger dim ~25px. Dilate thin axis to reach 22-28.
    """
    larger = max(bw, bh)
    target = (TARGET_MIN + TARGET_MAX) / 2
    base_scale = target / larger
    max_frame = FRAME_W - PAD * 2

    new_w = round(bw * base_scale)
    new_h = round(bh * base_scale)
    if max(new_w, new_h) > max_frame:
        base_scale = max_frame / larger
        new_w = round(bw * base_scale)
        new_h = round(bh * base_scale)

    result = content.resize((new_w, new_h), Image.NEAREST)

    # dilate horizontally until bbox width >= TARGET_MIN
    for _ in range(8):
        bbw, _ = bbox_size(result)
        if bbw >= TARGET_MIN or result.size[0] >= max_frame:
            break
        result = dilate_h(result)

    # dilate vertically until bbox height >= TARGET_MIN
    for _ in range(8):
        _, bbh = bbox_size(result)
        if bbh >= TARGET_MIN or result.size[1] >= max_frame:
            break
        result = dilate_v(result)

    # final clamp
    if result.size[0] > max_frame:
        result = result.crop((1, 0, result.size[0] - 1, result.size[1]))
    if result.size[1] > max_frame:
        result = result.crop((0, 1, result.size[0], result.size[1] - 1))

    return result


def process_strip(label, path):
    im = Image.open(path)
    assert im.size == (96, 32), f"{label}: expected 96x32, got {im.size}"
    assert im.mode == "RGBA", f"{label}: expected RGBA, got {im.mode}"

    frames = []
    bbox_sizes = []
    for i in range(3):
        left = i * FRAME_W
        frame = im.crop((left, 0, left + FRAME_W, FRAME_H))
        ox, oy, bw, bh = frame_bbox(frame)
        if bw <= 0 or bh <= 0:
            print(f"  WARN frame {i}: empty?")
            frames.append(frame)
            continue
        bbox_sizes.append((bw, bh))
        # extract content region
        content = frame.crop((ox, oy, ox + bw, oy + bh))
        # scale
        scaled = scale_fit(content, bw, bh)
        sw, sh = scaled.size
        # paste centered into fresh 32x32
        out = Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
        px = (FRAME_W - sw) // 2
        py = (FRAME_H - sh) // 2
        out.paste(scaled, (px, py))
        frames.append(out)

    # reassemble strip
    strip = Image.new("RGBA", (96, 32), (0, 0, 0, 0))
    for i, f in enumerate(frames):
        strip.paste(f, (i * FRAME_W, 0))

    # save
    strip.save(path)

    avg_w = sum(s[0] for s in bbox_sizes) / len(bbox_sizes) if bbox_sizes else 0
    avg_h = sum(s[1] for s in bbox_sizes) / len(bbox_sizes) if bbox_sizes else 0

    # Verify output
    out_im = Image.open(path)
    assert out_im.size == (96, 32), f"OUT {label}: not 96x32"
    assert out_im.mode == "RGBA", f"OUT {label}: not RGBA"

    # Measure new bounding boxes
    new_bboxes = []
    for i in range(3):
        frame = out_im.crop((i * FRAME_W, 0, i * FRAME_W + FRAME_W, FRAME_H))
        _, _, bw, bh = frame_bbox(frame)
        new_bboxes.append((bw, bh))

    new_avg_w = sum(s[0] for s in new_bboxes) / len(new_bboxes)
    new_avg_h = sum(s[1] for s in new_bboxes) / len(new_bboxes)

    return {
        "label": label,
        "original_avg_w": round(avg_w, 1),
        "original_avg_h": round(avg_h, 1),
        "new_avg_w": round(new_avg_w, 1),
        "new_avg_h": round(new_avg_h, 1),
        "transparent": all(
            out_im.getpixel((x, y))[3] == 0
            for x, y in [(0, 0), (95, 31), (0, 31), (95, 0)]
        ),
    }


print("=== HC-115 Sprite Reframe ===")
results = []
for label, rel_path in STRIPS.items():
    print(f"\nProcessing {label}...")
    r = process_strip(label, rel_path)
    results.append(r)

print("\n=== Results ===")
print(f"{'Type':<10} {'Orig W':>7} {'Orig H':>7} {'New W':>7} {'New H':>7} {'Transparent':>11}")
for r in results:
    print(f"{r['label']:<10} {r['original_avg_w']:>7.1f} {r['original_avg_h']:>7.1f} {r['new_avg_w']:>7.1f} {r['new_avg_h']:>7.1f} {str(r['transparent']):>11}")
print("\nDone.")
