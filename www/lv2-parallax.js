// ==============================
// GALAXY RAIDERS - LV2 Parallax Stack
// Render-only cinematic background layers for Asteroid Drift.
// Reuses LV1 architecture pattern: vertical tile, density fade, level gate.
// ==============================

var LV2_PARALLAX = {
  level: 2,
  farBgScroll: 0.18,
  midLayerScroll: 0.40,
  fxLayerScroll: 0.72,
  farAlpha: 0.82,
  midAlpha: 0.38,
  fxAlpha: 0.20,
  assets: {
    far: 'assets/backgrounds/lv2/asteroid_drift_far.png?v=lv2-asteroid-drift-palette-20260525',
    mid: 'assets/backgrounds/lv2/asteroid_drift_mid.png?v=lv2-asteroid-drift-palette-20260525',
    fx: 'assets/backgrounds/lv2/asteroid_drift_fx.png?v=lv2-asteroid-drift-palette-20260525'
  }
};

function createLv2ParallaxImage(src) {
  var img = new Image();
  img.src = src;
  img.loaded = false;
  img.onload = function () { img.loaded = true; };
  img.onerror = function () { img.loadError = true; };
  return img;
}

var lv2ParallaxImages = {
  far: createLv2ParallaxImage(LV2_PARALLAX.assets.far),
  mid: createLv2ParallaxImage(LV2_PARALLAX.assets.mid),
  fx: createLv2ParallaxImage(LV2_PARALLAX.assets.fx)
};

function isLv2ParallaxActive(levelNum) {
  return levelNum === LV2_PARALLAX.level;
}

function getLv2ParallaxDensityFade() {
  var count = (typeof enemyBullets !== 'undefined' && enemyBullets) ? enemyBullets.length : 0;
  if (count <= 18) return 1;
  if (count >= 42) return 0.42;
  return 1 - ((count - 18) / 24) * 0.58;
}

function drawLv2VerticalTile(ctxRef, img, speed, alpha, time, cancelGameplayShake) {
  if (!img || !img.loaded) return false;

  var tileH = H;
  var tileW = H;
  var x = (W - tileW) * 0.5;
  var t = (time || 0) / 16.6667;
  var offsetY = (t * speed) % tileH;
  if (offsetY < 0) offsetY += tileH;

  ctxRef.save();
  if (cancelGameplayShake && typeof screenShakeGameplay !== 'undefined' && screenShakeGameplay > 0) {
    ctxRef.translate(-gameplayShakeX, -gameplayShakeY);
  }
  ctxRef.globalAlpha = alpha;
  ctxRef.imageSmoothingEnabled = true;

  for (var y = offsetY - tileH; y < H; y += tileH) {
    ctxRef.drawImage(img, x, y, tileW, tileH);
  }

  ctxRef.restore();
  return true;
}

function drawLv2FarParallax(ctxRef, levelNum, time) {
  if (!isLv2ParallaxActive(levelNum)) return false;
  return drawLv2VerticalTile(
    ctxRef,
    lv2ParallaxImages.far,
    LV2_PARALLAX.farBgScroll,
    LV2_PARALLAX.farAlpha,
    time
  );
}

function drawLv2MidParallax(ctxRef, levelNum, time) {
  if (!isLv2ParallaxActive(levelNum)) return false;
  var fade = getLv2ParallaxDensityFade();
  return drawLv2VerticalTile(
    ctxRef,
    lv2ParallaxImages.mid,
    LV2_PARALLAX.midLayerScroll,
    LV2_PARALLAX.midAlpha * fade,
    time
  );
}

function drawLv2ForegroundFxParallax(ctxRef, levelNum, time) {
  if (!isLv2ParallaxActive(levelNum)) return false;
  var fade = getLv2ParallaxDensityFade();
  return drawLv2VerticalTile(
    ctxRef,
    lv2ParallaxImages.fx,
    LV2_PARALLAX.fxLayerScroll,
    LV2_PARALLAX.fxAlpha * fade,
    time,
    true
  );
}

window.__GR_LV2_PARALLAX = {
  images: lv2ParallaxImages,
  drawFar: drawLv2FarParallax,
  drawMid: drawLv2MidParallax,
  drawFx: drawLv2ForegroundFxParallax
};
