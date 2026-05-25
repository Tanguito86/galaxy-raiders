// ==============================
// GALAXY RAIDERS - LV1 Parallax Stack
// Render-only cinematic background layers for Deep Space Frontier.
// ==============================

var LV1_PARALLAX = {
  level: 1,
  farBgScroll: 0.15,
  midLayerScroll: 0.35,
  fxLayerScroll: 0.65,
  farAlpha: 0.82,
  midAlpha: 0.34,
  fxAlpha: 0.18,
  assets: {
    far: 'assets/backgrounds/lv1/deep_space_frontier_far.png',
    mid: 'assets/backgrounds/lv1/deep_space_frontier_mid.png',
    fx: 'assets/backgrounds/lv1/deep_space_frontier_fx.png'
  }
};

function createLv1ParallaxImage(src) {
  var img = new Image();
  img.src = src;
  img.loaded = false;
  img.onload = function () { img.loaded = true; };
  img.onerror = function () { img.loadError = true; };
  return img;
}

var lv1ParallaxImages = {
  far: createLv1ParallaxImage(LV1_PARALLAX.assets.far),
  mid: createLv1ParallaxImage(LV1_PARALLAX.assets.mid),
  fx: createLv1ParallaxImage(LV1_PARALLAX.assets.fx)
};

function isLv1ParallaxActive(levelNum) {
  return levelNum === LV1_PARALLAX.level;
}

function getLv1ParallaxDensityFade() {
  var count = (typeof enemyBullets !== 'undefined' && enemyBullets) ? enemyBullets.length : 0;
  if (count <= 18) return 1;
  if (count >= 42) return 0.42;
  return 1 - ((count - 18) / 24) * 0.58;
}

function drawLv1VerticalTile(ctxRef, img, speed, alpha, time, cancelGameplayShake) {
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

function drawLv1FarParallax(ctxRef, levelNum, time) {
  if (!isLv1ParallaxActive(levelNum)) return false;
  return drawLv1VerticalTile(
    ctxRef,
    lv1ParallaxImages.far,
    LV1_PARALLAX.farBgScroll,
    LV1_PARALLAX.farAlpha,
    time
  );
}

function drawLv1MidParallax(ctxRef, levelNum, time) {
  if (!isLv1ParallaxActive(levelNum)) return false;
  var fade = getLv1ParallaxDensityFade();
  return drawLv1VerticalTile(
    ctxRef,
    lv1ParallaxImages.mid,
    LV1_PARALLAX.midLayerScroll,
    LV1_PARALLAX.midAlpha * fade,
    time
  );
}

function drawLv1ForegroundFxParallax(ctxRef, levelNum, time) {
  if (!isLv1ParallaxActive(levelNum)) return false;
  var fade = getLv1ParallaxDensityFade();
  return drawLv1VerticalTile(
    ctxRef,
    lv1ParallaxImages.fx,
    LV1_PARALLAX.fxLayerScroll,
    LV1_PARALLAX.fxAlpha * fade,
    time,
    true
  );
}

window.__GR_LV1_PARALLAX = {
  images: lv1ParallaxImages,
  drawFar: drawLv1FarParallax,
  drawMid: drawLv1MidParallax,
  drawFx: drawLv1ForegroundFxParallax
};
