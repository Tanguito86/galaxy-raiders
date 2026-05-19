// ============================================================
// HC-HB-02 — Collision Debug Overlay
// ============================================================
// Visual audit tools for hitbox & collision fairness.
// Render-only. Does NOT change gameplay, damage, or balance.
// ============================================================

var _hcHitboxDebugMode = 0;
var _hcHitboxDebugGrazeOn = false;
var _hcHitboxDebugSpawnOn = false;

// Mode enum (0-based index)
var HC_HITBOX_DEBUG_MODES = [
  'none',
  'player',
  'enemy',
  'bullets',
  'pickups',
  'lasers',
  'graze',
  'spawn',
  'all'
];

function getHCHitboxDebugMode() {
  return HC_HITBOX_DEBUG_MODES[_hcHitboxDebugMode] || 'none';
}

function setHCHitboxDebugMode(mode) {
  var idx = HC_HITBOX_DEBUG_MODES.indexOf(mode);
  if (idx >= 0) _hcHitboxDebugMode = idx;
}

function _hcHitboxDebugCycle() {
  _hcHitboxDebugMode = (_hcHitboxDebugMode + 1) % HC_HITBOX_DEBUG_MODES.length;
}

function _hcHitboxDebugToggleGraze() {
  _hcHitboxDebugGrazeOn = !_hcHitboxDebugGrazeOn;
}

function _hcHitboxDebugToggleSpawn() {
  _hcHitboxDebugSpawnOn = !_hcHitboxDebugSpawnOn;
}

// Whether a given mode should render
function _hcHitboxDebugShouldDraw(modeName) {
  if (_hcHitboxDebugMode === 0) return false; // none
  if (_hcHitboxDebugMode === HC_HITBOX_DEBUG_MODES.length - 1) return true; // all
  var current = HC_HITBOX_DEBUG_MODES[_hcHitboxDebugMode];
  if (current === 'bullets') return modeName === 'enemy' || modeName === 'bullets';
  if (current === 'lasers') return modeName === 'lasers' || modeName === 'player';
  if (current === modeName) return true;
  // graze and spawn are toggles, not mode-cycled
  if (modeName === 'graze' && _hcHitboxDebugGrazeOn) return true;
  if (modeName === 'spawn' && _hcHitboxDebugSpawnOn) return true;
  return false;
}

// ---- reusable temp objects to avoid per-frame allocations ----
var __hbTmpRect = { x: 0, y: 0, w: 0, h: 0 };

function __hbSafePlayerCenter() {
  if (typeof player === 'undefined' || !player) return null;
  return {
    x: player.x + (player.width || player.w || 33) / 2,
    y: player.y + (player.height || player.h || 24) / 2
  };
}

// ============================================================
// MAIN DISPATCHER — called from draw.js
// ============================================================
function drawHCHitboxDebug(ctx) {
  if (!ctx) return;
  if (!isHCHitboxDebugEnabled()) return;

  ctx.save();
  drawHCHitboxPlayer(ctx);
  drawHCHitboxEnemies(ctx);
  drawHCHitboxMines(ctx);
  drawHCHitboxSatellites(ctx);
  drawHCHitboxBullets(ctx);
  drawHCHitboxPickups(ctx);
  drawHCHitboxLasers(ctx);
  drawHCHitboxGraze(ctx);
  drawHCHitboxSpawn(ctx);
  drawHCHitboxModeLabel(ctx);
  ctx.restore();
}

// ============================================================
// PLAYER — hurtbox + sprite bounds
// ============================================================
function drawHCHitboxPlayer(ctx) {
  if (!_hcHitboxDebugShouldDraw('player')) return;

  var center = __hbSafePlayerCenter();
  if (!center) return;
  var p = getHCHitboxPlayerConfig();
  var dbg = p.debugColor || '#ff4444';
  var dbgSprite = (getHCHitboxDebugConfig().colors || {}).playerSprite || '#ff6666';
  var spr = p.sprite || { w: 33, h: 24 };
  var hb = p.hurtbox || {};
  var hc = hb.hardcore || { radius: 3 };

  // sprite bounds (semi-transparent rect)
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = dbgSprite;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 2]);
  ctx.strokeRect(player.x, player.y, spr.w, spr.h);
  ctx.setLineDash([]);

  // hurtbox (circle in hardcore, or AABB dotted)
  if (typeof isHardcoreHitboxActive === 'function' && isHardcoreHitboxActive()) {
    ctx.globalAlpha = 0.60;
    ctx.strokeStyle = dbg;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center.x, center.y, hc.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = dbg;
    ctx.fill();

    // center dot
    ctx.globalAlpha = 0.80;
    ctx.fillStyle = dbg;
    ctx.fillRect(center.x - 0.5, center.y - 0.5, 1, 1);
  } else {
    ctx.globalAlpha = 0.50;
    ctx.strokeStyle = dbg;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.strokeRect(player.x + 1, player.y + 1, spr.w - 2, spr.h - 2);
    ctx.setLineDash([]);
  }
  ctx.restore();
}

// ============================================================
// ENEMIES — body hitboxes
// ============================================================
function drawHCHitboxEnemies(ctx) {
  if (!_hcHitboxDebugShouldDraw('enemy')) return;
  if (typeof enemies === 'undefined' || !enemies) return;

  var dbg = (getHCHitboxDebugConfig().colors || {}).enemyBody || '#44ff44';

  ctx.save();
  ctx.globalAlpha = 0.30;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 0.5;

  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    if (!e || !e.alive) continue;
    var w = e.w || 24;
    var h = e.h || 24;
    ctx.strokeRect(e.x, e.y, w, h);
  }
  ctx.restore();

  // Boss body
  if (typeof boss !== 'undefined' && boss && boss.active) {
    drawHCHitboxBoss(ctx);
  }

  // Boss minions (already covered by enemies loop above since they're in enemies[])
}

function drawHCHitboxBoss(ctx) {
  if (!boss || !boss.active) return;
  var dbg = (getHCHitboxDebugConfig().colors || {}).bossBody || '#ffdd44';

  ctx.save();
  ctx.globalAlpha = 0.38;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boss.x, boss.y, boss.w || 90, boss.h || 45);

  // center cross
  var bx = boss.x + (boss.w || 90) / 2;
  var by = boss.y + (boss.h || 45) / 2;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(bx - 6, by);
  ctx.lineTo(bx + 6, by);
  ctx.moveTo(bx, by - 6);
  ctx.lineTo(bx, by + 6);
  ctx.stroke();
  ctx.restore();
}

// ============================================================
// BULLETS — enemy + boss bullet hitboxes
// ============================================================
function drawHCHitboxBullets(ctx) {
  if (!_hcHitboxDebugShouldDraw('bullets')) return;
  if (typeof enemyBullets === 'undefined' || !enemyBullets) return;

  var dbgEnemy = (getHCHitboxDebugConfig().colors || {}).enemyBullet || '#ff8844';
  var dbgBoss = (getHCHitboxDebugConfig().colors || {}).bossBullet || '#cc2222';

  ctx.save();
  ctx.globalAlpha = 0.32;

  for (var i = 0; i < enemyBullets.length; i++) {
    var b = enemyBullets[i];
    if (!b) continue;
    var w = b.w || 4;
    var h = b.h || 10;
    var isBoss = !!(b.kind && (
      b.kind.indexOf('boss_') === 0 ||
      (typeof boss !== 'undefined' && boss && boss.active)
    ));

    ctx.strokeStyle = isBoss ? dbgBoss : dbgEnemy;
    ctx.lineWidth = isBoss ? 1.2 : 0.6;
    ctx.strokeRect(b.x, b.y, w, h);
  }
  ctx.restore();
}

// ============================================================
// PICKUPS — powerups + ufo rewards
// ============================================================
function drawHCHitboxPickups(ctx) {
  if (!_hcHitboxDebugShouldDraw('pickups')) return;
  var dbg = (getHCHitboxDebugConfig().colors || {}).pickup || '#44ffff';

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 0.6;

  if (typeof powerUps !== 'undefined' && powerUps) {
    for (var i = 0; i < powerUps.length; i++) {
      var p = powerUps[i];
      if (!p) continue;
      var pw = p.w || 12;
      var ph = p.h || 12;
      ctx.strokeRect(p.x, p.y, pw, ph);
    }
  }

  if (typeof ufoRewards !== 'undefined' && ufoRewards) {
    ctx.strokeStyle = dbg;
    ctx.setLineDash([2, 2]);
    for (var j = 0; j < ufoRewards.length; j++) {
      var d = ufoRewards[j];
      if (!d) continue;
      ctx.strokeRect(d.x, d.y, d.w || 16, d.h || 16);
    }
    ctx.setLineDash([]);
  }
  ctx.restore();
}

// ============================================================
// LASERS — player laser collision zone + piercing trail
// ============================================================
function drawHCHitboxLasers(ctx) {
  if (!_hcHitboxDebugShouldDraw('lasers')) return;
  if (typeof bullets === 'undefined' || !bullets) return;

  var dbg = (getHCHitboxDebugConfig().colors || {}).laser || '#ff44ff';

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 3]);

  for (var i = 0; i < bullets.length; i++) {
    var b = bullets[i];
    if (!b || b.type !== 'laser') continue;
    var bw = b.w || 6;
    var bh = b.h || 24;
    ctx.strokeRect(b.x, b.y, bw, bh);

    // direction pointer
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.20;
    ctx.beginPath();
    ctx.moveTo(b.x + bw / 2, b.y);
    ctx.lineTo(b.x + bw / 2, b.y - 10);
    ctx.stroke();
    ctx.setLineDash([4, 3]);
    ctx.globalAlpha = 0.35;
  }
  ctx.setLineDash([]);
  ctx.restore();
}

// ============================================================
// GRAZE — circle around player
// ============================================================
function drawHCHitboxGraze(ctx) {
  if (!_hcHitboxDebugShouldDraw('graze')) return;

  var center = __hbSafePlayerCenter();
  if (!center) return;
  var gc = getHCHitboxGrazeConfig();
  var dbg = gc.debugColor || '#4488ff';

  ctx.save();
  ctx.globalAlpha = gc.debugFillAlpha || 0.06;
  ctx.fillStyle = dbg;
  ctx.beginPath();
  ctx.arc(center.x, center.y, gc.radius || 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.30;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// ============================================================
// SPAWN — safety radius around player
// ============================================================
function drawHCHitboxSpawn(ctx) {
  if (!_hcHitboxDebugShouldDraw('spawn')) return;

  var center = __hbSafePlayerCenter();
  if (!center) return;
  var sc = getHCHitboxSpawnSafetyConfig();
  var dbg = sc.debugColor || '#ffffff';
  var radius = sc.safetyRadius || 80;

  ctx.save();
  ctx.globalAlpha = sc.debugFillAlpha || 0.08;
  ctx.fillStyle = dbg;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.20;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 0.5;
  ctx.setLineDash([3, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// ============================================================
// MODE LABEL — top-left HUD indicator
// ============================================================
function drawHCHitboxModeLabel(ctx) {
  if (_hcHitboxDebugMode === 0) return;

  var mode = HC_HITBOX_DEBUG_MODES[_hcHitboxDebugMode];
  var label = 'HB: ' + mode.toUpperCase();
  if (_hcHitboxDebugGrazeOn && mode !== 'graze') label += ' +G';
  if (_hcHitboxDebugSpawnOn && mode !== 'spawn') label += ' +S';

  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.font = '5px "Press Start 2P"';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = (getHCHitboxDebugConfig().colors || {}).playerHurtbox || '#ff4444';
  ctx.fillText(label, 4, 4);
  ctx.restore();
}

// ============================================================
// MINES & SATELLITES — called from enemy pass
// ============================================================
function drawHCHitboxMines(ctx) {
  if (!_hcHitboxDebugShouldDraw('enemy') && !_hcHitboxDebugShouldDraw('bullets')) return;
  if (typeof mines === 'undefined' || !mines) return;

  var mc = getHCHitboxMineConfig();
  var dbg = mc.debugColor || '#88ff44';

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 0.6;

  for (var i = 0; i < mines.length; i++) {
    var m = mines[i];
    if (!m) continue;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.radius || mc.radius || 12, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHCHitboxSatellites(ctx) {
  if (!_hcHitboxDebugShouldDraw('enemy')) return;
  if (typeof satellites === 'undefined' || !satellites) return;
  if (typeof boss === 'undefined' || !boss || !boss.active) return;

  var sc = getHCHitboxSatelliteConfig();
  var dbg = sc.debugColor || '#44ffff';

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = dbg;
  ctx.lineWidth = 0.6;

  for (var i = 0; i < satellites.length; i++) {
    var sat = satellites[i];
    if (!sat) continue;
    ctx.beginPath();
    ctx.arc(sat.x, sat.y, sat.radius || sc.radius || 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================
// KEYBOARD HANDLER — bound in input-keyboard.js
// ============================================================
function handleHCHitboxDebugKeydown(e) {
  if (!e) return false;

  // F5: cycle debug mode
  if (e.code === 'F5') {
    if (e.shiftKey) {
      _hcHitboxDebugToggleGraze();
    } else if (e.ctrlKey) {
      _hcHitboxDebugToggleSpawn();
    } else {
      _hcHitboxDebugCycle();
    }
    e.preventDefault();
    if (typeof sfxUIClick === 'function' && typeof isMuted !== 'undefined' && !isMuted) {
      sfxUIClick();
    }
    if (typeof setBalanceDebugNotice === 'function') {
      var label = getHCHitboxDebugMode();
      if (_hcHitboxDebugGrazeOn && label !== 'graze') label += ' +G';
      if (_hcHitboxDebugSpawnOn && label !== 'spawn') label += ' +S';
      setBalanceDebugNotice('HB MODE: ' + label.toUpperCase(), 1400);
    }
    return true;
  }
  return false;
}
