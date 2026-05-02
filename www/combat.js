// =====================
// GALAXY RAIDERS - combat.js
// =====================

function spawnPlayerBullet(data) {
  bullets.push({
    ...data,
    trail: [],
    trailColor: data.color
  });
}

function spawnMuzzleFlash(weaponType) {
  const flashByWeapon = {
    normal: '#fff',
    double: '#ff0',
    spread: '#0f0',
    machine: '#f0f',
    laser: '#0ff'
  };
  const color = flashByWeapon[weaponType] || '#fff';
  const count = BULLET_FX.muzzleParticles[weaponType] || 4;
  const cx = player.x + player.width / 2;
  const cy = player.y - 2;
  const spread = weaponType === 'laser' ? 8 : 6;
  const speedBoost = weaponType === 'laser' ? 1.6 : 1.0;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * spread,
      y: cy + (Math.random() - 0.5) * 3,
      vx: (Math.random() - 0.5) * (1.6 + speedBoost),
      vy: -(2.2 + Math.random() * 2.8 + speedBoost),
      life: 0.16 + Math.random() * 0.16,
      gravity: 0.03,
      color,
      size: 2 + Math.random() * 2,
      isSpark: true
    });
  }
}

function fire() {
  initAudio();
  const now = performance.now();

  let baseCooldown = player.shootCooldown;
  if (player.weaponType === 'machine') baseCooldown = 100;
  if (player.weaponType === 'laser') baseCooldown = 250;

  if (now - lastShotTime > baseCooldown) {
    const bulletsBefore = bullets.length;

    if (player.weaponType === 'normal') {
      spawnPlayerBullet({ x: player.x + 14, y: player.y, w: 4, h: 10, vx: 0, vy: -8, color: '#fff', type: 'normal' });
    } else if (player.weaponType === 'double') {
      spawnPlayerBullet({ x: player.x, y: player.y, w: 3, h: 8, vx: 0, vy: -8, color: '#ff0', type: 'double' });
      spawnPlayerBullet({ x: player.x + player.width - 3, y: player.y, w: 3, h: 8, vx: 0, vy: -8, color: '#ff0', type: 'double' });
    } else if (player.weaponType === 'spread') {
      spawnPlayerBullet({ x: player.x + 14, y: player.y, w: 4, h: 8, vx: 0,  vy: -8, color: '#0f0', type: 'spread' });
      spawnPlayerBullet({ x: player.x + 14, y: player.y, w: 4, h: 8, vx: -2, vy: -7, color: '#0f0', type: 'spread' });
      spawnPlayerBullet({ x: player.x + 14, y: player.y, w: 4, h: 8, vx:  2, vy: -7, color: '#0f0', type: 'spread' });
    } else if (player.weaponType === 'machine') {
      const off = (Math.random() * 6) - 3;
      spawnPlayerBullet({ x: player.x + 14 + off, y: player.y, w: 3, h: 6, vx: 0, vy: -12, color: '#f0f', type: 'machine' });
    } else if (player.weaponType === 'laser') {
      spawnPlayerBullet({ x: player.x + 12, y: player.y, w: 6, h: 24, vx: 0, vy: -15, color: '#0ff', type: 'laser' });
    }

    spawnMuzzleFlash(player.weaponType);
    sfxShootByWeapon(player.weaponType);
    vibrate('tap');
    pushScreenShake('light', 2);
    lastShotTime = now;

    const spawned = bullets.length - bulletsBefore;
    if (spawned > 0) recordShotsFired(spawned);
  }
}

function requestFull() {
  // Fullscreen es opcional: si el navegador lo permite, mejor inmersión en Android
  const el = document.documentElement;
  const fs = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fs && !document.fullscreenElement) {
    try {
      const request = fs.call(el);
      if (request && typeof request.catch === 'function') request.catch(() => {});
    } catch (e) {}
  }
}

