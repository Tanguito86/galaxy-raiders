// ==============================
// GALAXY RAIDERS - sprite-system.js
// Base segura para migracion gradual de render geometrico a sprites.
// ==============================

(function () {
  var global = window;
  var config = global.GALAXY_CONFIG || {};
  var spriteConfig = config.sprites || {};
  var registry = {};

  function isEnabled() {
    return spriteConfig.enabled !== false;
  }

  function shouldFallbackToLegacy() {
    return spriteConfig.fallbackToLegacy !== false;
  }

  function shouldDebugMissingSprites() {
    return spriteConfig.debugMissingSprites === true && global.console && console.warn;
  }

  function normalizeSprite(id, config) {
    var frameWidth = Number(config && config.frameWidth) || 32;
    var frameHeight = Number(config && config.frameHeight) || 32;

    return {
      id: id,
      src: (config && config.src) || ("assets/sprites/" + id + ".png"),
      frameWidth: frameWidth,
      frameHeight: frameHeight,
      animations: (config && config.animations) || {
        idle: { frames: [0], fps: 1, loop: true }
      },
      fallbackColor: (config && config.fallbackColor) || "#ffffff",
      loaded: false,
      image: null,
      missing: false,
      error: null
    };
  }

  function startLoad(sprite) {
    if (!isEnabled() || !sprite || !sprite.src || sprite.image) return;

    var image = new Image();
    sprite.image = image;

    image.onload = function () {
      sprite.loaded = true;
      sprite.missing = false;
      sprite.error = null;
    };

    image.onerror = function () {
      sprite.loaded = false;
      sprite.missing = true;
      sprite.error = "load_error";

      if (shouldDebugMissingSprites()) {
        console.warn("[SpriteSystem] Missing sprite:", sprite.id, sprite.src);
      }
    };

    image.src = sprite.src;
  }

  function registerSprite(id, config) {
    if (!id) return null;

    var sprite = normalizeSprite(id, config || {});
    registry[id] = sprite;
    startLoad(sprite);
    return sprite;
  }

  function getSprite(id) {
    return registry[id] || null;
  }

  function isSpriteReady(id) {
    var sprite = getSprite(id);
    return !!(isEnabled() && sprite && sprite.loaded && sprite.image);
  }

  function drawTint(ctx, sprite, sx, sy, sw, sh, dw, dh, tint) {
    var canvas = document.createElement("canvas");
    var tintCtx = canvas.getContext("2d");

    canvas.width = sw;
    canvas.height = sh;
    tintCtx.drawImage(sprite.image, sx, sy, sw, sh, 0, 0, sw, sh);
    tintCtx.globalCompositeOperation = "source-atop";
    tintCtx.fillStyle = tint;
    tintCtx.fillRect(0, 0, sw, sh);

    ctx.drawImage(canvas, -dw / 2, -dh / 2, dw, dh);
  }

  function runFallback(ctx, sprite, x, y, options) {
    if (!options || typeof options.fallback !== "function" || !shouldFallbackToLegacy()) return false;
    options.fallback(ctx, sprite, x, y, options);
    return true;
  }

  function drawSpriteFrame(ctx, id, x, y, options) {
    options = options || {};

    var sprite = getSprite(id);
    if (!ctx || !isSpriteReady(id)) {
      return runFallback(ctx, sprite, x, y, options);
    }

    var frame = Math.max(0, Math.floor(Number(options.frame) || Number(options.frameIndex) || 0));
    var scale = Number(options.scale);
    var alpha = Number(options.alpha);
    var rotation = Number(options.rotation);
    var flipX = options.flipX === true;
    var sw = sprite.frameWidth;
    var sh = sprite.frameHeight;
    var columns = Math.max(1, Math.floor(sprite.image.width / sw));
    var sx = (frame % columns) * sw;
    var sy = Math.floor(frame / columns) * sh;

    if (sx + sw > sprite.image.width || sy + sh > sprite.image.height) {
      return runFallback(ctx, sprite, x, y, options);
    }

    if (!isFinite(scale) || scale <= 0) scale = 1;
    if (!isFinite(alpha)) alpha = 1;
    if (!isFinite(rotation)) rotation = 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(flipX ? -1 : 1, 1);
    ctx.globalAlpha *= Math.max(0, Math.min(1, alpha));
    ctx.imageSmoothingEnabled = options.imageSmoothingEnabled === true;

    var dw = sw * scale;
    var dh = sh * scale;

    if (options.tint) {
      drawTint(ctx, sprite, sx, sy, sw, sh, dw, dh, options.tint);
    } else {
      ctx.drawImage(sprite.image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
    }

    ctx.restore();
    return true;
  }

  global.SpriteSystem = {
    registry: registry,
    registerSprite: registerSprite,
    getSprite: getSprite,
    isSpriteReady: isSpriteReady,
    drawSpriteFrame: drawSpriteFrame
  };

  global.registerSprite = registerSprite;
  global.getSprite = getSprite;
  global.isSpriteReady = isSpriteReady;
  global.drawSpriteFrame = drawSpriteFrame;

  registerSprite("player", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#6ee7ff"
  });

  registerSprite("alien1", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#7cff6b"
  });

  registerSprite("alien2", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ffdd66"
  });

  registerSprite("alien3", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ff6bd6"
  });

  registerSprite("alien4", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ff8a3d"
  });

  registerSprite("alien5", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#9d7cff"
  });

  registerSprite("alien6", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ff4d5e"
  });

  registerSprite("boss_crabtron", {
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#ff375f"
  });

  registerSprite("boss_serpentrix", {
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#35ff9a"
  });

  registerSprite("boss_orbital", {
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#46d9ff"
  });

  registerSprite("boss_teniente", {
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#ffc857"
  });

  registerSprite("boss_emperador", {
    frameWidth: 128,
    frameHeight: 128,
    fallbackColor: "#ffffff"
  });
})();
