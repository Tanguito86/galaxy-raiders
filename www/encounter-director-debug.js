(function(global) {
  'use strict';

  function isEnabled() {
    return !!(global.ENCOUNTER_DIRECTOR_DEBUG || global.DEBUG_ENCOUNTER_DIRECTOR);
  }

  function hasDirector() {
    return typeof global.getEncounterDirectorState === 'function';
  }

  function safeNum(val, dec) {
    if (typeof val !== 'number' || !isFinite(val)) return '0';
    return val.toFixed(dec || 0);
  }

  function safeBool(val) {
    return val ? 'ON' : 'OFF';
  }

  function safeStr(val, fallback) {
    return (val !== undefined && val !== null) ? String(val) : (fallback || 'n/a');
  }

  function drawEncounterDirectorDebug(ctx) {
    if (!isEnabled()) return;
    if (!hasDirector()) return;

    var _W = global.W || 360;
    var st = global.getEncounterDirectorState();

    ctx.save();

    var panelX = _W - 118;
    var panelY = 4;
    var panelW = 114;
    var lineH = 8;
    var rows = 17;
    var panelH = rows * lineH + 6;

    ctx.globalAlpha = 0.62;
    ctx.fillStyle = '#000';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    ctx.globalAlpha = 0.82;
    ctx.font = '5px "Press Start 2P"';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    var ty = panelY + 3;
    var txL = panelX + 4;
    var txR = panelX + panelW - 6;

    ctx.fillStyle = '#0ff';
    ctx.fillText('ENC DIRECTOR', txL, ty);
    ty += lineH;

    ctx.font = '4px "Press Start 2P"';
    ctx.globalAlpha = 0.75;

    function row(label, value, color) {
      ctx.fillStyle = '#999';
      ctx.textAlign = 'left';
      ctx.fillText(label, txL, ty);
      ctx.textAlign = 'right';
      ctx.fillStyle = color || '#fff';
      ctx.fillText(safeStr(value), txR, ty);
      ctx.textAlign = 'left';
      ty += lineH;
    }

    row('enabled:', safeBool(st.enabled), st.enabled ? '#0f0' : '#f44');

    var pct = safeNum(st.pressure * 100, 1);
    row('pressure:', pct + '%', st.pressure > 0.7 ? '#f80' : st.pressure > 0.4 ? '#ff0' : '#0f0');

    var tpct = safeNum(st.targetPressure * 100, 1);
    row('target:', tpct + '%', '#8cf');

    row('silence:', st.silenceTimer > 0 ? safeNum(st.silenceTimer) + 'ms' : '---', st.silenceTimer > 0 ? '#f80' : '#888');

    row('spawn cd:', st.spawnCooldown > 0 ? safeNum(st.spawnCooldown) + 'ms' : '---', st.spawnCooldown > 0 ? '#ff0' : '#888');

    var roles = st.activeRoles || {};
    var roleStr = '';
    var roleKeys = ['dive','kamikaze','tank','shooter','splitter','external','formation'];
    var roleAbbr = { dive:'DV', kamikaze:'KM', tank:'TK', shooter:'SH', splitter:'SP', external:'EX', formation:'FM' };
    for (var r = 0; r < roleKeys.length; r++) {
      var v = roles[roleKeys[r]] || 0;
      if (v > 0) roleStr += (roleStr ? ' ' : '') + roleAbbr[roleKeys[r]] + ':' + v;
    }
    row('roles:', roleStr || '(none)', roleStr ? '#ff0' : '#888');

    var canDive = typeof global.peekCanSpawnRole === 'function'
      ? global.peekCanSpawnRole('dive')
      : typeof global.canSpawnRole === 'function' ? global.canSpawnRole('dive') : 'n/a';
    row('can dive:', canDive === true ? 'YES' : canDive === false ? 'NO' : 'n/a', canDive === true ? '#0f0' : canDive === false ? '#f44' : '#888');

    row('level:', safeStr(global.level || 1), '#fff');

    var aliveCount = 0;
    if (Array.isArray(global.enemies)) {
      for (var a = 0; a < global.enemies.length; a++) {
        if (global.enemies[a] && global.enemies[a].alive) aliveCount++;
      }
    }
    row('alive:', aliveCount.toString(), aliveCount > 6 ? '#f80' : aliveCount > 0 ? '#0f0' : '#888');

    var sp = st.recentSpawnCount || 0;
    var de = st.recentDeathCount || 0;
    row('spawn/dth:', sp + '/' + de, '#fff');

    var bullets = Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0;
    row('bullets:', bullets.toString(), bullets > 20 ? '#f44' : bullets > 10 ? '#f80' : '#0f0');

    row('lastRole:', safeStr(st.lastRole, '(none)'), '#8cf');
    row('repeat:', safeStr(st.repeatedRoleCount, '0'), st.repeatedRoleCount >= 3 ? '#f44' : '#fff');

    ctx.restore();
  }

  global.drawEncounterDirectorDebug = drawEncounterDirectorDebug;
})(window);
