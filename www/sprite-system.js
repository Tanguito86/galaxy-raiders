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

  function getAnimationFrame(id, animationName, timeMs, options) {
    var sprite = getSprite(id);
    if (!sprite) return 0;

    var animations = sprite.animations || {};
    var animation = animations[animationName] || animations.idle || { frames: [0], fps: 1, loop: true };
    var frames = Array.isArray(animation.frames) && animation.frames.length ? animation.frames : [0];
    var fps = Number(animation.fps);
    var loop = animation.loop !== false;
    var offsetMs = Number(options && options.timeOffset) || 0;
    var frameOffset = Math.max(0, Math.floor(Number(options && options.frameOffset) || 0));
    var safeTimeMs = Number(timeMs);
    var elapsed;
    var rawIndex;

    if (!isFinite(fps) || fps <= 0) fps = 1;
    if (!isFinite(safeTimeMs)) safeTimeMs = 0;

    elapsed = Math.max(0, safeTimeMs + offsetMs) / 1000;
    rawIndex = Math.floor(elapsed * fps) + frameOffset;

    if (loop) {
      return frames[((rawIndex % frames.length) + frames.length) % frames.length];
    }

    return frames[Math.min(frames.length - 1, Math.max(0, rawIndex))];
  }

  function drawTint(ctx, sprite, sx, sy, sw, sh, dx, dy, dw, dh, tint) {
    var canvas = document.createElement("canvas");
    var tintCtx = canvas.getContext("2d");

    canvas.width = sw;
    canvas.height = sh;
    tintCtx.drawImage(sprite.image, sx, sy, sw, sh, 0, 0, sw, sh);
    tintCtx.globalCompositeOperation = "source-atop";
    tintCtx.fillStyle = tint;
    tintCtx.fillRect(0, 0, sw, sh);

    ctx.drawImage(canvas, dx, dy, dw, dh);
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
    var anchorX = Number(options.anchorX);
    var anchorY = Number(options.anchorY);
    if (!isFinite(anchorX)) anchorX = 0.5;
    if (!isFinite(anchorY)) anchorY = 0.5;
    var dx = -dw * anchorX;
    var dy = -dh * anchorY;

    if (options.tint) {
      drawTint(ctx, sprite, sx, sy, sw, sh, dx, dy, dw, dh, options.tint);
    } else {
      ctx.drawImage(sprite.image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    ctx.restore();
    return true;
  }

  global.SpriteSystem = {
    registry: registry,
    registerSprite: registerSprite,
    getSprite: getSprite,
    isSpriteReady: isSpriteReady,
    getAnimationFrame: getAnimationFrame,
    drawSpriteFrame: drawSpriteFrame
  };

  global.registerSprite = registerSprite;
  global.getSprite = getSprite;
  global.isSpriteReady = isSpriteReady;
  global.getAnimationFrame = getAnimationFrame;
  global.drawSpriteFrame = drawSpriteFrame;

  registerSprite("player", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#6ee7ff"
  });

  registerSprite("player_ship_3x3", {
    src: "assets/sprites/player-ship-3x3.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 8, loop: true },
      bankLeft: { frames: [3, 4, 5], fps: 10, loop: true },
      bankRight: { frames: [6, 7, 8], fps: 10, loop: true }
    },
    fallbackColor: "#6ee7ff"
  });

  registerSprite("alien1", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#7cff6b"
  });

  registerSprite("alien1_strip", {
    src: "assets/sprites/alien1-strip.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#7cff6b"
  });

  registerSprite("alien2", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ffdd66"
  });

  registerSprite("alien2_strip", {
    src: "assets/sprites/alien2-strip.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#ffdd66"
  });

  registerSprite("alien3", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ff6bd6"
  });

  registerSprite("alien3_strip", {
    src: "assets/sprites/alien3-strip.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#ff6bd6"
  });

  registerSprite("alien4", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ff8a3d"
  });

  registerSprite("alien4_strip", {
    src: "assets/sprites/alien4-strip.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#ff8a3d"
  });

  registerSprite("alien5", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#9d7cff"
  });

  registerSprite("alien5_strip", {
    src: "assets/sprites/alien5-strip.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#9d7cff"
  });

  registerSprite("alien6", {
    frameWidth: 32,
    frameHeight: 32,
    fallbackColor: "#ff4d5e"
  });

  registerSprite("alien6_strip", {
    src: "assets/sprites/alien6-strip.png",
    frameWidth: 32,
    frameHeight: 32,
    animations: {
      idle: { frames: [0, 1, 2], fps: 6, loop: true }
    },
    fallbackColor: "#ff4d5e"
  });

  // HC-117 boss sprite hook: single-frame registrations (assets TBD)
  registerSprite("boss_crabtron", {
    src: "assets/sprites/boss_crabtron.png",
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#ff375f"
  });

  registerSprite("boss_serpentrix", {
    src: "assets/sprites/boss_serpentrix.png",
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#35ff9a"
  });

  registerSprite("boss_orbital", {
    src: "assets/sprites/boss_orbital.png",
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#46d9ff"
  });

  registerSprite("boss_teniente", {
    src: "assets/sprites/boss_teniente.png",
    frameWidth: 96,
    frameHeight: 96,
    fallbackColor: "#ffc857"
  });

  registerSprite("boss_emperador", {
    src: "assets/sprites/boss_emperador.png",
    frameWidth: 128,
    frameHeight: 128,
    fallbackColor: "#ffffff"
  });
})();
