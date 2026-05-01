// =====================
// GALAXY RAIDERS - update-player.js
// =====================

function updatePlayerMovement(step) {
  if (player.movingLeft) player.x -= player.speed * step;
  if (player.movingRight) player.x += player.speed * step;
  if (player.movingUp) player.y -= player.speedY * step;
  if (player.movingDown) player.y += player.speedY * step;

  const minY = H * 0.45;
  const maxY = H - 60;
  player.x = Math.max(0, Math.min(W - player.width, player.x));
  player.y = Math.max(minY, Math.min(maxY, player.y));
}

function updatePlayerWeaponTimer(dt) {
  if (player.weaponType !== 'normal') {
    player.weaponTimer -= dt;
    if (player.weaponTimer <= 0) {
      player.weaponType = 'normal';
      sfxUIClick();
    }
  }
}

function updatePlayerFrame(step, dt) {
  updatePlayerMovement(step);
  updatePlayerWeaponTimer(dt);
}
