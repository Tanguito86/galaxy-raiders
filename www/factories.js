// =====================
// GALAXY RAIDERS - factories.js
// =====================

function createPlayer() {
  return {
    width: 33,
    height: 24,
    x: W / 2 - 16,
    y: H - 40,
    speed: 5,
    speedY: 4,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
    weaponType: 'normal',
    weaponTimer: 0,
    shootCooldown: 300
  };
}

function createUfo() {
  return {
    x: -100,
    y: 40,
    w: 42,
    h: 21,
    active: false,
    timer: 0,
    dir: 1
  };
}

function createBoss() {
  return {
    active: false,
    x: 0,
    y: -200,
    w: 90,
    h: 45,
    hp: 100,
    maxHp: 100,
    dir: 1,
    shootTimer: 0,

    // IA base
    state: 'aggressive',
    decisionT: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    counterFlag: false,
    rotationAngle: 0
  };
}
