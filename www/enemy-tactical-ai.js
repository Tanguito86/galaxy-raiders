// =====================
// GALAXY RAIDERS - enemy-tactical-ai.js
// HC-124: gameplay-safe tactical bias layer for normal hardcore enemies.
// =====================

(function () {
  var PROFILE_BY_ROLE = {
    sweeper: {
      label: 'wide lateral sweep coverage',
      track: 0.003,
      xAmp: 0.58,
      yAmp: 0.12,
      smoothing: 0.038,
      intervalScale: 0.88
    },
    sniper: {
      label: 'maintain useful horizontal distance and firing line',
      track: 0.008,
      xAmp: 0.28,
      yAmp: 0.08,
      preferredDx: 42,
      smoothing: 0.035,
      intervalScale: 1.15
    },
    diver: {
      label: 'choose better dive window',
      track: 0.006,
      xAmp: 0.36,
      yAmp: 0.22,
      smoothing: 0.040,
      intervalScale: 0.85
    },
    suppressor: {
      label: 'occupy control lane',
      track: 0.005,
      xAmp: 0.22,
      yAmp: 0.14,
      smoothing: 0.030,
      intervalScale: 1.05
    },
    chaser: {
      label: 'aggressive player pursuit',
      track: 0.012,
      xAmp: 0.52,
      yAmp: 0.18,
      smoothing: 0.055,
      intervalScale: 0.78
    },
    flanker: {
      label: 'attack from screen edges',
      track: 0.004,
      xAmp: 0.48,
      yAmp: 0.10,
      smoothing: 0.032,
      intervalScale: 1.10
    },
    baiter: {
      label: 'erratic bait and dart',
      track: 0.002,
      xAmp: 0.64,
      yAmp: 0.28,
      smoothing: 0.025,
      intervalScale: 0.72
    }
  };

  function clampValue(value, min, max) {
    if (typeof clamp === 'function') return clamp(value, min, max);
    return Math.max(min, Math.min(max, value));
  }

  function getEnemyAIConfigSafe() {
    if (typeof getEnemyAIConfig === 'function') return getEnemyAIConfig();
    return { enabled: true, maxOffsetX: 18, maxOffsetY: 10, decisionIntervalMs: 500 };
  }

  function resolveEnemyRole(enemy) {
    if (typeof getEnemyRole === 'function') return getEnemyRole(enemy);
    if (!enemy || !enemy.type) return 'basic';
    if (enemy.type === 'alien1') return 'sweeper';
    if (enemy.type === 'alien2') return 'sniper';
    if (enemy.type === 'alien3') return 'diver';
    if (enemy.type === 'alien4') return 'suppressor';
    if (enemy.type === 'alien5') return 'chaser';
    if (enemy.type === 'alien6') return 'flanker';
    if (enemy.type === 'alien_mini') return 'baiter';
    return 'basic';
  }

  function getEnemyTacticalProfile(enemy) {
    return PROFILE_BY_ROLE[resolveEnemyRole(enemy)] || null;
  }

  function shouldUseEnemyTacticalAI(enemy) {
    var cfg = getEnemyAIConfigSafe();
    if (!cfg.enabled) return false;
    if (typeof isHardcoreEnabled === 'function' && !isHardcoreEnabled()) return false;
    if (!enemy || enemy.alive !== true) return false;
    if (enemy.diving || enemy._shmupHandled) return false;
    if (enemy._hcDiverState && enemy._hcDiverState !== 'idle') return false;
    return !!getEnemyTacticalProfile(enemy);
  }

  function clearTacticalVisualOffset(enemy) {
    if (!enemy) return;
    enemy._tacticalVisualOffsetX = 0;
    enemy._tacticalVisualOffsetY = 0;
    enemy._tacticalState = 'off';
  }

  function ensureTacticalState(enemy) {
    if (!enemy._tacticalAI) {
      enemy._tacticalAI = {
        timer: 0,
        seed: ((enemy.row || 0) * 101) + ((enemy.col || 0) * 37) + ((enemy.type || '').length * 17),
        targetX: 0,
        targetY: 0,
        state: 'hold'
      };
    }
    return enemy._tacticalAI;
  }

  function playerCenterX(targetPlayer) {
    return targetPlayer.x + (targetPlayer.width || 0) / 2;
  }

  function enemyCenterX(enemy) {
    return enemy.x + (enemy.w || 0) / 2;
  }

  function chooseTacticalTarget(enemy, targetPlayer, cfg, profile, state) {
    var role = resolveEnemyRole(enemy);
    var time = (typeof globalTime === 'number') ? globalTime : 0;
    var maxX = Math.max(0, cfg.maxOffsetX);
    var maxY = Math.max(0, cfg.maxOffsetY);
    var dx = playerCenterX(targetPlayer) - enemyCenterX(enemy);
    var waveX = Math.sin(time * 0.0025 + state.seed) * maxX * profile.xAmp;
    var waveY = Math.cos(time * 0.0020 + state.seed * 0.41) * maxY * profile.yAmp;
    var desiredX = waveX + clampValue(dx * profile.track, -maxX, maxX);
    var desiredY = waveY;

    if (role === 'sweeper') {
      var sweepSign = Math.sin(time * 0.0012 + state.seed * 0.37) > 0 ? 1 : -1;
      desiredX = sweepSign * maxX * 0.72;
      desiredY *= 0.22;
      state.state = 'sweep_lane';
    } else if (role === 'sniper') {
      var side = dx >= 0 ? -1 : 1;
      desiredX += side * Math.min(maxX, profile.preferredDx || 0) * 0.20;
      desiredY *= 0.35;
      state.state = Math.abs(dx) < 28 ? 'open_line' : 'hold_line';
    } else if (role === 'diver') {
      desiredX += clampValue(dx * 0.003, -maxX * 0.35, maxX * 0.35);
      desiredY += maxY * 0.10;
      state.state = Math.abs(dx) < 36 ? 'dive_window' : 'stage_window';
    } else if (role === 'suppressor') {
      desiredX += dx > 0 ? maxX * 0.18 : -maxX * 0.18;
      desiredY *= 0.45;
      state.state = 'control_lane';
    } else if (role === 'chaser') {
      desiredX += clampValue(dx * 0.006, -maxX * 0.58, maxX * 0.58);
      desiredY += Math.sin(time * 0.0013 + state.seed) * maxY * 0.16;
      state.state = 'pursue';
    } else if (role === 'flanker') {
      var edgeSide = (enemyCenterX(enemy) < (typeof W === 'number' ? W : 360) * 0.5) ? -1 : 1;
      desiredX = edgeSide * maxX * 0.55;
      desiredY *= 0.30;
      state.state = 'flank_edge';
    } else if (role === 'baiter') {
      var baitX = Math.sin(time * 0.0035 + state.seed) * maxX * 0.70;
      var baitY = Math.cos(time * 0.0028 + state.seed * 0.53) * maxY * 0.55;
      desiredX = baitX;
      desiredY = baitY;
      state.state = 'bait_dart';
    }

    state.targetX = clampValue(desiredX, -maxX, maxX);
    state.targetY = clampValue(desiredY, -maxY, maxY);
  }

  function updateEnemyTacticalAI(enemy, targetPlayer, dt) {
    try {
      var cfg = getEnemyAIConfigSafe();
      if (!cfg.enabled) {
        clearTacticalVisualOffset(enemy);
        return false;
      }
      if (!shouldUseEnemyTacticalAI(enemy)) {
        clearTacticalVisualOffset(enemy);
        return false;
      }
      if (!targetPlayer || typeof targetPlayer.x !== 'number') return false;

      var profile = getEnemyTacticalProfile(enemy);
      var state = ensureTacticalState(enemy);
      var frameScale = Math.max(0, Math.min(2.5, (Number(dt) || 0) / 16.6667));
      var interval = Math.max(120, cfg.decisionIntervalMs * (profile.intervalScale || 1));
      var steer = Math.max(0.001, profile.smoothing) * frameScale;
      var leftRoom = enemy.x - 10;
      var rightRoom = ((typeof W === 'number' ? W : 360) - 10 - (enemy.w || 0)) - enemy.x;
      var dynMaxX = Math.max(0, Math.min(cfg.maxOffsetX, leftRoom, rightRoom));

      state.timer += Number(dt) || 0;
      if (state.timer >= interval) {
        state.timer = 0;
        chooseTacticalTarget(enemy, targetPlayer, cfg, profile, state);
      }

      if (enemy._tacticalVisualOffsetX === undefined) enemy._tacticalVisualOffsetX = 0;
      if (enemy._tacticalVisualOffsetY === undefined) enemy._tacticalVisualOffsetY = 0;

      enemy._tacticalVisualOffsetX += (state.targetX - enemy._tacticalVisualOffsetX) * steer;
      enemy._tacticalVisualOffsetY += (state.targetY - enemy._tacticalVisualOffsetY) * steer;
      enemy._tacticalVisualOffsetX = clampValue(enemy._tacticalVisualOffsetX, -dynMaxX, dynMaxX);
      enemy._tacticalVisualOffsetY = clampValue(enemy._tacticalVisualOffsetY, -cfg.maxOffsetY, cfg.maxOffsetY);
      enemy._tacticalState = state.state;
      return true;
    } catch (e) {
      return false;
    }
  }

  window.getEnemyTacticalProfile = getEnemyTacticalProfile;
  window.shouldUseEnemyTacticalAI = shouldUseEnemyTacticalAI;
  window.updateEnemyTacticalAI = updateEnemyTacticalAI;
})();
