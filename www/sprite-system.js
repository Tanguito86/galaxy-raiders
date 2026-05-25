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
    frameWidth: 32, frameHeight: 32,
    animations: {
      idle: { frames: [0,1,2], fps: 6, loop: true }
    },
    fallbackColor: "#ff4d5e"
  });

  // SPRITE LAB: alien_mini middleware fallback — reuses alien1 strip at smaller scale
  // Prevents ghost-rectangle-only visible gap when HC art sprites are loading
  registerSprite("alien_mini_strip", {
    src: "assets/sprites/alien1-strip.png",
    frameWidth: 32, frameHeight: 32,
    animations: {
      idle: { frames: [0,1,2], fps: 6, loop: true }
    },
    fallbackColor: "#7cff6b"
  });
  registerSprite("alien_mini", {
    src: "assets/sprites/alien1.png",
    frameWidth: 32, frameHeight: 32,
    fallbackColor: "#7cff6b"
  });

  // ═══════════════════════════════════════════════════════
  // HC-ART-02: S04 AGGRESSIVE WEDGE — Official Player Ship
  // Sheet: 1152×44, 32 frames, 36×44 per frame
  // Palette: HC-PLAYER-WEDGE-CRIMSON (9 colors)
  // ═══════════════════════════════════════════════════════
  // player_wedge_anim_sheet.png does not exist — alias to S04 sheet to prevent 404.
  // S04 Wedge takes priority in the draw chain; this tier is only reached if S04 fails.
  registerSprite("player_wedge", {
    src: "assets/sprites/player/player_s04_wedge_sheet_2x4.png",
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      idle:      { frames: [0,1], fps: 5.5, loop: true },
      bankLeft:  { frames: [2], fps: 0, loop: false },
      bankRight: { frames: [3], fps: 0, loop: false },
      boost:     { frames: [4], fps: 0, loop: false },
      hit:       { frames: [5], fps: 0, loop: false }
    },
    fallbackColor: "#dd3333"
  });

  // ═══════════════════════════════════════════════════════
  // HC-ART-04: FLEET FIRST WAVE — Enemy sprites
  // ═══════════════════════════════════════════════════════
  registerSprite("fleet_scout", {
    src: "assets/sprites/fleet/fleet_scout_sheet.png",
    frameWidth: 16, frameHeight: 16,
    animations: {
      idle: { frames: [0,1,2,0,1,2], fps: 6, loop: true },
      death: { frames: [4,5,6,7], fps: 8, loop: false }
    },
    fallbackColor: "#334466"
  });
  registerSprite("fleet_interceptor", {
    src: "assets/sprites/fleet/fleet_interceptor_sheet.png",
    frameWidth: 24, frameHeight: 24,
    animations: {
      idle: { frames: [0,1], fps: 8, loop: true },
      moveLeft: { frames: [1,2], fps: 10, loop: true },
      moveRight: { frames: [3,4], fps: 10, loop: true },
      attack: { frames: [1,4], fps: 12, loop: false },
      death: { frames: [6,7,8,9], fps: 8, loop: false }
    },
    fallbackColor: "#4488CC"
  });
  registerSprite("fleet_suppressor", {
    src: "assets/sprites/fleet/fleet_suppressor_sheet.png",
    frameWidth: 28, frameHeight: 32,
    animations: {
      idle: { frames: [0,1,0,2], fps: 6, loop: true },
      attack: { frames: [3,4], fps: 10, loop: false },
      death: { frames: [6,7,8,9,10], fps: 8, loop: false }
    },
    fallbackColor: "#556677"
  });

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE A: S04 Wedge upgraded player ship
  // Sheet: 512x256, 2 cols x 4 rows, 128x128 cells
  // Frame map (row-major idle=0, thrust=1, bankL=2, bankR=3, boost=4, damage=5, respawn=6, thrust2=7)
  // ═══════════════════════════════════════════════════════
  var _S04_WEDGE_META = {
    sheetCols: 2,
    sheetRows: 4,
    frameW: 128,
    frameH: 128,
    // 2x4 grid: row 0 = idle(0), thrust_01(1); row 1 = bank_left(2), bank_right(3);
    //           row 2 = boost(4), damage(5); row 3 = respawn(6), thrust_02(7)
    frameMap: {
      idle:      0,
      thrust_01: 1,
      bank_left: 2,
      bank_right:3,
      boost:     4,
      damage:    5,
      respawn:   6,
      thrust_02: 7
    }
  };

  global.getS04WedgeMeta = function () { return _S04_WEDGE_META; };
  global.getS04WedgeFrame = function (state) { return _S04_WEDGE_META.frameMap[state] || 0; };

  registerSprite("player_s04_wedge", {
    src: "assets/sprites/player/player_s04_wedge_sheet_2x4.png",
    frameWidth: _S04_WEDGE_META.frameW,
    frameHeight: _S04_WEDGE_META.frameH,
    animations: {
      idle:      { frames: [0,1], fps: 5.5, loop: true },
      thrust:    { frames: [0,1,7], fps: 8, loop: true },
      bankLeft:  { frames: [2], fps: 0, loop: false },
      bankRight: { frames: [3], fps: 0, loop: false },
      boost:     { frames: [4], fps: 0, loop: false },
      damage:    { frames: [5], fps: 0, loop: false },
      respawn:   { frames: [6], fps: 0, loop: false }
    },
    fallbackColor: "#dd3333"
  });

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE A: Scout Alien faction
  // Sheet: 512x128, 4 frames horizontal, 128x128 each
  // Frame order: 0=mk1_master, 1=elite, 2=sniper, 3=swarm
  // ═══════════════════════════════════════════════════════
  registerSprite("faction_scout", {
    src: "assets/sprites/enemies/scout/scout_alien_faction_sheet.png",
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      idle: { frames: [0,1,2,3], fps: 6, loop: true }
    },
    fallbackColor: "#7cff6b"
  });

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE B: Suppressor faction
  // Sheet: 512x128, 4 frames horizontal, 128x128 each
  // Frame order: 0=mk1_master, 1=elite, 2=artillery, 3=brute
  // ═══════════════════════════════════════════════════════
  registerSprite("faction_suppressor", {
    src: "assets/sprites/enemies/suppressor/suppressor_alien_faction_sheet.png",
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      idle: { frames: [0,1,2,3], fps: 6, loop: true }
    },
    fallbackColor: "#cc4422"
  });

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE B: Splitter faction
  // Sheet: 512x128, 4 frames horizontal, 128x128 each
  // Frame order: 0=mk1_master, 1=elite, 2=shard, 3=aberration
  // ═══════════════════════════════════════════════════════
  registerSprite("faction_splitter", {
    src: "assets/sprites/enemies/splitter/splitter_alien_faction_sheet.png",
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      idle: { frames: [0,1,2,3], fps: 6, loop: true }
    },
    fallbackColor: "#cc44aa"
  });

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE B: Imperial faction
  // Sheet: 512x128, 4 frames horizontal, 128x128 each
  // Frame order: 0=mk1_master, 1=elite, 2=lancer, 3=guardian
  // NOTE: Imperial has no dedicated enemy spawn type yet —
  // sprite is registered for future integration when Imperial enemies are created.
  // ═══════════════════════════════════════════════════════
  registerSprite("faction_imperial", {
    src: "assets/sprites/enemies/imperial/imperial_alien_faction_sheet.png",
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      idle: { frames: [0,1,2,3], fps: 6, loop: true }
    },
    fallbackColor: "#d6b85a"
  });

  // HC-VS-03D1: CRABTRON hero layered sprite system
  // Master sheet: 1536x960, 8 cols x 5 rows, 192x192 cells
  // Columns: composite, shadow, body, left_claw, right_claw, weakpoint_core, cannons_vents, overlay_glow_damage
  // Rows: idle, attack_windup, mid_damage, rage_phase, death_exposed_core
  var _CRABTRON_HERO_META = {
    cols: 8,
    rows: 5,
    frameW: 192,
    frameH: 192,
    layers: ['composite', 'shadow', 'body', 'left_claw', 'right_claw', 'weakpoint_core', 'cannons_vents', 'overlay_glow_damage'],
    states: ['idle', 'attack_windup', 'mid_damage', 'rage_phase', 'death_exposed_core'],
    pivot: [96, 96],
    scaleHint: 0.55,
    weakpointPivot: [96, 108],
    weakpointRadius: 15
  };

  global.getCrabtronHeroMeta = function () {
    return _CRABTRON_HERO_META;
  };

  global.getCrabtronHeroFrame = function (state, layer) {
    var meta = _CRABTRON_HERO_META;
    var si = meta.states.indexOf(state);
    var li = meta.layers.indexOf(layer);
    if (si < 0 || li < 0) return -1;
    return si * meta.cols + li;
  };

  registerSprite("boss_crabtron_hero", {
    src: "ai-generated/crabtron-hero-20260523/crabtron_hero_master_sheet.png",
    frameWidth: _CRABTRON_HERO_META.frameW,
    frameHeight: _CRABTRON_HERO_META.frameH,
    fallbackColor: "#ff375f"
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

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE C: Mini-boss hierarchy
  // Sheet: 768x192, 4 frames horizontal, 192x192 each
  // Frame order: 0=scout_hive_leader, 1=suppressor_siege_core,
  //              2=splitter_aberrant_node, 3=imperial_command_lancer
  // ═══════════════════════════════════════════════════════
  var _MINIBOSS_HIERARCHY_META = {
    sheetCols: 4,
    sheetRows: 1,
    frameW: 192,
    frameH: 192,
    unitMap: {
      scout_hive_leader: 0,
      suppressor_siege_core: 1,
      splitter_aberrant_node: 2,
      imperial_command_lancer: 3
    },
    factionMap: {
      scout_hive_leader: 'scout_alien',
      suppressor_siege_core: 'suppressor_alien',
      splitter_aberrant_node: 'splitter_alien',
      imperial_command_lancer: 'imperial_alien'
    },
    recommendedGameplaySize: { width: 128, height: 128 },
    pivot: { x: 96, y: 96, anchor: 'center' },
    scaleHint: 1.0
  };

  global.getMiniBossHierarchyMeta = function () { return _MINIBOSS_HIERARCHY_META; };
  global.getMiniBossFrame = function (unitId) { return _MINIBOSS_HIERARCHY_META.unitMap[unitId] != null ? _MINIBOSS_HIERARCHY_META.unitMap[unitId] : -1; };

  registerSprite("boss_miniboss_hierarchy", {
    src: "assets/sprites/bosses/miniboss_hierarchy_sheet.png",
    frameWidth: _MINIBOSS_HIERARCHY_META.frameW,
    frameHeight: _MINIBOSS_HIERARCHY_META.frameH,
    animations: {
      idle: { frames: [0,1,2,3], fps: 4, loop: true }
    },
    fallbackColor: "#887766"
  });

  // ═══════════════════════════════════════════════════════
  // SPRITE LAB PHASE D: Imperial Flagship Command
  // Sheet: 768x256, 3 frames horizontal, 256x256 each
  // Phase order: 0=phase_1_full_armor (master),
  //              1=phase_2_damaged, 2=phase_3_core_exposed
  // ═══════════════════════════════════════════════════════
  var _IMPERIAL_FLAGSHIP_META = {
    sheetCols: 3,
    sheetRows: 1,
    frameW: 256,
    frameH: 256,
    bossId: 'imperial_flagship_command',
    faction: 'imperial_alien',
    tier: 'flagship',
    phases: {
      master: 0,
      phase_1_full_armor: 0,
      damaged: 1,
      phase_2_damaged: 1,
      core_exposed: 2,
      phase_3_core_exposed: 2
    },
    phaseLabels: ['master', 'damaged', 'core_exposed'],
    recommendedGameplaySize: { width: 192, height: 192 },
    pivot: { x: 128, y: 128, anchor: 'center' },
    scaleHint: 0.75
  };

  global.getImperialFlagshipMeta = function () { return _IMPERIAL_FLAGSHIP_META; };
  global.getImperialFlagshipPhaseFrame = function (phase) { return _IMPERIAL_FLAGSHIP_META.phases[phase] != null ? _IMPERIAL_FLAGSHIP_META.phases[phase] : -1; };

  registerSprite("boss_imperial_flagship", {
    src: "assets/sprites/bosses/imperial_flagship/imperial_flagship_command_sheet.png",
    frameWidth: _IMPERIAL_FLAGSHIP_META.frameW,
    frameHeight: _IMPERIAL_FLAGSHIP_META.frameH,
    animations: {
      idle: { frames: [0,1,2], fps: 1.5, loop: true }
    },
    fallbackColor: "#d6b85a"
  });
})();
