// =====================
// GALAXY RAIDERS - boss-ai-movement.js
// HC-124: gameplay-safe boss position pressure layer.
// =====================

(function () {
  var PROFILE_BY_PATTERN = {
    crossfire: {
      key: 'crabtron',
      label: 'heavy lateral pressure',
      xRate: 0.0020,
      yRate: 0.0014,
      xAmp: 0.42,
      yAmp: 0.22,
      track: 0.010,
      smoothing: 0.020
    },
    zigzag: {
      key: 'serpentrix',
      label: 'serpentine drift',
      xRate: 0.0030,
      yRate: 0.0042,
      xAmp: 0.34,
      yAmp: 0.40,
      track: 0.006,
      smoothing: 0.026
    },
    rotate: {
      key: 'orbital',
      label: 'smooth circular hover',
      xRate: 0.0019,
      yRate: 0.0019,
      xAmp: 0.36,
      yAmp: 0.28,
      track: 0.004,
      smoothing: 0.020
    },
    divebomb: {
      key: 'teniente',
      label: 'aggressive reposition',
      xRate: 0.0040,
      yRate: 0.0030,
      xAmp: 0.30,
      yAmp: 0.18,
      track: 0.018,
      smoothing: 0.040
    },
    supreme: {
      key: 'emperador',
      label: 'oppressive slow tracking',
      xRate: 0.0014,
      yRate: 0.0010,
      xAmp: 0.22,
      yAmp: 0.12,
      track: 0.012,
      smoothing: 0.015
    }
  };

  function clampValue(value, min, max) {
    if (typeof clamp === 'function') return clamp(value, min, max);
    return Math.max(min, Math.min(max, value));
  }

  function getBossAIMovementConfig() {
    if (typeof getBossAIConfig === 'function') return getBossAIConfig();
    return { enabled: true, maxOffsetX: 70, maxOffsetY: 35 };
  }

  function getBossAIMovementProfile(targetBoss) {
    if (!targetBoss || !targetBoss.pattern) return null;
    return PROFILE_BY_PATTERN[targetBoss.pattern] || null;
  }

  function isBossInUnsafeMovementState(targetBoss) {
    return !!(
      targetBoss.dashMode ||
      targetBoss.chargeMode ||
      targetBoss.retreating ||
      targetBoss.isTeleporting ||
      targetBoss.pulseMode
    );
  }

  function shouldUseBossAIMovement(targetBoss) {
    var cfg = getBossAIMovementConfig();
    if (!cfg.enabled) return false;
    if (typeof isHardcoreEnabled === 'function' && !isHardcoreEnabled()) return false;
    if (!targetBoss || targetBoss.active !== true) return false;
    if (!getBossAIMovementProfile(targetBoss)) return false;
    if (isBossInUnsafeMovementState(targetBoss)) return false;
    return true;
  }

  function ensureBossAIState(targetBoss) {
    if (!targetBoss._aiMove) {
      targetBoss._aiMove = {
        anchorX: targetBoss.x,
        anchorY: targetBoss.y,
        offsetX: 0,
        offsetY: 0,
        seed: ((targetBoss.pattern || '').length * 97) + Math.floor((targetBoss.w || 0) * 3)
      };
    }
    targetBoss._aiMove.anchorX = targetBoss.x - targetBoss._aiMove.offsetX;
    targetBoss._aiMove.anchorY = targetBoss.y - targetBoss._aiMove.offsetY;
    return targetBoss._aiMove;
  }

  function updateBossAIMovement(targetBoss, targetPlayer, dt) {
    try {
      if (!shouldUseBossAIMovement(targetBoss)) return false;
      if (!targetPlayer || typeof targetPlayer.x !== 'number') return false;

      var cfg = getBossAIMovementConfig();
      var profile = getBossAIMovementProfile(targetBoss);
      var state = ensureBossAIState(targetBoss);
      var safeMaxX = Math.max(0, cfg.maxOffsetX);
      var safeMaxY = Math.max(0, cfg.maxOffsetY);
      var time = (typeof globalTime === 'number') ? globalTime : 0;
      var step = Math.max(0, Math.min(2.5, (Number(dt) || 0) / 16.6667));
      var bossCenterX = targetBoss.x + (targetBoss.w || 0) / 2;
      var playerCenterX = targetPlayer.x + (targetPlayer.width || 0) / 2;
      var trackX = clampValue((playerCenterX - bossCenterX) * profile.track, -safeMaxX, safeMaxX);
      var waveX = Math.sin(time * profile.xRate + state.seed) * safeMaxX * profile.xAmp;
      var waveY = Math.cos(time * profile.yRate + state.seed * 0.37) * safeMaxY * profile.yAmp;
      var desiredX = clampValue(trackX + waveX, -safeMaxX, safeMaxX);
      var desiredY = clampValue(waveY, -safeMaxY, safeMaxY);
      var smoothing = Math.max(0.001, profile.smoothing) * step;
      var baseX;
      var baseY;
      var minX = 10;
      var maxX = (typeof W === 'number' ? W : 360) - (targetBoss.w || 0) - 10;
      var minY = 60;
      var maxY = (typeof H === 'number' ? H : 640) - (targetBoss.h || 0) - 60;

      state.offsetX += (desiredX - state.offsetX) * smoothing;
      state.offsetY += (desiredY - state.offsetY) * smoothing;

      baseX = targetBoss.x - state.offsetX;
      baseY = targetBoss.y - state.offsetY;
      targetBoss.x = clampValue(baseX + state.offsetX, minX, maxX);
      targetBoss.y = clampValue(baseY + state.offsetY, minY, maxY);
      return true;
    } catch (e) {
      return false;
    }
  }

  window.getBossAIMovementProfile = getBossAIMovementProfile;
  window.updateBossAIMovement = updateBossAIMovement;
  window.shouldUseBossAIMovement = shouldUseBossAIMovement;
})();
