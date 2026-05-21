// ============================================================
// GALAXY RAIDERS — hc-wc-choreography.js
// HC-WC-05: Entry Choreography & Formation Silhouette
// ============================================================
// STATUS: RUNTIME — entry staging, silhouette rendering, reveal timing.
// Integrates with: hc-wc-profiles.js, hc-wave-composer.js, draw.js.
// Does NOT add enemies. Works on visual identity and pacing.
// ============================================================

(function(global) {
  'use strict';

  // ============================================================
  // CHOREOGRAPHY STATE
  // ============================================================

  var _choreo = {
    active: false,
    entryStyle: 'slide_in',
    silhouetteKey: 'classic_grid',
    entryPhase: 'pending',
    entryTimer: 0,
    entryTotalDuration: 1200,
    revealRoles: [],
    revealedRoles: {},
    formationLines: [],
    escapeLanes: [],
    _enemiesTagged: false,
    _drawnThisFrame: false
  };

  // ============================================================
  // ENTRY STYLE DEFINITIONS
  // ============================================================

  var ENTRY_STYLES = {
    slide_in: {
      label: 'Slide In',
      duration: 1200,
      staggerPerRow: 120,
      staggerPerCol: 45,
      offScreenX: 80,
      offScreenY: 70,
      direction: 'top',
      description: 'Enemies slide in from top to formation position.'
    },
    fade_in: {
      label: 'Fade In',
      duration: 800,
      staggerPerRow: 60,
      staggerPerCol: 0,
      offScreenX: 0,
      offScreenY: 0,
      direction: 'position',
      description: 'Enemies fade into existence at their target positions.'
    },
    burst_in: {
      label: 'Burst In',
      duration: 500,
      staggerPerRow: 40,
      staggerPerCol: 20,
      offScreenX: 40,
      offScreenY: 40,
      direction: 'random_edge',
      description: 'Rapid entry from screen edges with flash effect.'
    },
    pincer_entry: {
      label: 'Pincer Entry',
      duration: 1800,
      staggerPerRow: 100,
      staggerPerCol: 30,
      offScreenX: 100,
      offScreenY: 60,
      direction: 'both_edges',
      description: 'Two wings close in from left and right sides.'
    },
    diagonal_entry: {
      label: 'Diagonal Entry',
      duration: 1500,
      staggerPerRow: 90,
      staggerPerCol: 50,
      offScreenX: 60,
      offScreenY: 80,
      direction: 'diagonal_corners',
      description: 'Enemies enter from top corners along diagonals.'
    },
    spiral_entry: {
      label: 'Spiral Entry',
      duration: 2000,
      staggerPerRow: 80,
      staggerPerCol: 35,
      offScreenX: 50,
      offScreenY: 50,
      direction: 'spiral_inward',
      description: 'Enemies spiral inward from perimeter to formation.'
    },
    delayed_reveal: {
      label: 'Delayed Reveal',
      duration: 1000,
      staggerPerRow: 200,
      staggerPerCol: 100,
      offScreenX: 0,
      offScreenY: 0,
      direction: 'position',
      description: 'Enemies at position but invisible, then appear row by row.'
    },
    ambush_entry: {
      label: 'Ambush Entry',
      duration: 400,
      staggerPerRow: 30,
      staggerPerCol: 15,
      offScreenX: 30,
      offScreenY: 30,
      direction: 'random',
      description: 'Sudden appearance from random off-screen with minimal telegraph.'
    },
    wall_drop: {
      label: 'Wall Drop',
      duration: 1600,
      staggerPerRow: 150,
      staggerPerCol: 0,
      offScreenX: 0,
      offScreenY: 120,
      direction: 'top_rows_first',
      description: 'Rows drop from above sequentially like a closing wall.'
    },
    split_reveal: {
      label: 'Split Reveal',
      duration: 1400,
      staggerPerRow: 100,
      staggerPerCol: 60,
      offScreenX: 40,
      offScreenY: 60,
      direction: 'split_from_center',
      description: 'Enemies split from center outward to both sides.'
    }
  };

  // ============================================================
  // FORMATION SILHOUETTE DEFINITIONS
  // ============================================================

  var SILHOUETTES = {
    classic_grid: {
      label: 'Classic Grid',
      identity: 'standard_engagement',
      lineStyle: 'grid',
      lineColor: '#334466',
      lineAlpha: 0.15,
      description: 'Standard rectangular grid. Default entry formation.'
    },
    sparse_line: {
      label: 'Sparse Line',
      identity: 'recovery_breather',
      lineStyle: 'horizontal_lines',
      lineColor: '#335544',
      lineAlpha: 0.12,
      description: 'Wide horizontal spacing. Signals low threat.'
    },
    vshape: {
      label: 'V Pressure',
      identity: 'pressure_from_above',
      lineStyle: 'V',
      lineColor: '#664433',
      lineAlpha: 0.20,
      description: 'Arrow pointing down. Signals converging pressure from above.'
    },
    pincer: {
      label: 'Pincer',
      identity: 'flank_threat',
      lineStyle: 'open_V',
      lineColor: '#884422',
      lineAlpha: 0.22,
      description: 'Two angled wings with center gap. Danger on edges, safe center.'
    },
    three_columns: {
      label: 'Three Columns',
      identity: 'rotating_pressure',
      lineStyle: 'vertical_columns',
      lineColor: '#446688',
      lineAlpha: 0.18,
      description: 'Three vertical columns. Threat rotates between columns.'
    },
    column_asymmetric: {
      label: 'Asymmetric Column',
      identity: 'lane_denial',
      lineStyle: 'heavy_right',
      lineColor: '#664444',
      lineAlpha: 0.20,
      description: 'One side heavier than other. Signals which lane is denied.'
    },
    fortress: {
      label: 'Fortress Wall',
      identity: 'defensive_breach',
      lineStyle: 'horizontal_stripes',
      lineColor: '#885522',
      lineAlpha: 0.22,
      description: 'Stacked horizontal rows. Each row is a defense line.'
    },
    edge_columns: {
      label: 'Edge Columns',
      identity: 'crossfire_trap',
      lineStyle: 'two_edges',
      lineColor: '#663355',
      lineAlpha: 0.18,
      description: 'Enemies on left and right edges only. Center is safe.'
    },
    scatter: {
      label: 'Scatter',
      identity: 'ambush_hunt',
      lineStyle: 'dots',
      lineColor: '#554444',
      lineAlpha: 0.12,
      description: 'No coherent shape. Enemies scattered. Unpredictable.'
    },
    horizontal_line: {
      label: 'Horizontal Line',
      identity: 'sniper_row',
      lineStyle: 'horizontal_stripe',
      lineColor: '#554455',
      lineAlpha: 0.18,
      description: 'Single horizontal row with gaps. Sniper line.'
    },
    center_anchors: {
      label: 'Center Anchors',
      identity: 'fortress_center',
      lineStyle: 'center_cross',
      lineColor: '#886644',
      lineAlpha: 0.20,
      description: 'Heavy center with light perimeter. Anchors in middle.'
    },
    closing_gates: {
      label: 'Closing Gates',
      identity: 'collapsing_lane',
      lineStyle: 'converging_walls',
      lineColor: '#884433',
      lineAlpha: 0.25,
      description: 'Two walls converging toward center. Lane narrowing.'
    },
    cross_rotating: {
      label: 'Cross Rotating',
      identity: 'rotating_crossfire',
      lineStyle: 'cross',
      lineColor: '#664488',
      lineAlpha: 0.20,
      description: 'Cross shape. Arms are fire lanes. Rotation indicated.'
    },
    parallel_walls: {
      label: 'Parallel Walls',
      identity: 'survival_corridor',
      lineStyle: 'parallel_vertical',
      lineColor: '#885544',
      lineAlpha: 0.22,
      description: 'Two parallel walls with narrow corridor between.'
    },
    loose_arc: {
      label: 'Loose Arc',
      identity: 'prelude_tension',
      lineStyle: 'arc',
      lineColor: '#444466',
      lineAlpha: 0.14,
      description: 'Wide arc. Signals something approaching. Low threat, high tension.'
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  function _getProfile() {
    return global._hcWcActiveProfile || null;
  }

  function _isHardcoreEnabled() {
    if (typeof global.isHardcoreEnabled === 'function') return global.isHardcoreEnabled();
    return true;
  }

  function _getComposerPhase() {
    if (typeof global.getWaveComposerPhase === 'function') return global.getWaveComposerPhase();
    return 'idle';
  }

  function _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // ============================================================
  // CHOREOGRAPHY INIT — called from initEnemies
  // ============================================================

  function initChoreography() {
    var profile = _getProfile();
    if (!profile) {
      _choreo.active = false;
      return;
    }

    _choreo.active = true;
    _choreo.entryStyle = profile.entryStyle || 'slide_in';
    _choreo.silhouetteKey = profile.formationKey || 'classic_grid';
    _choreo.entryPhase = 'pending';
    _choreo.entryTimer = 0;
    _choreo.revealedRoles = {};
    _choreo.formationLines = [];
    _choreo.escapeLanes = [];
    _choreo._enemiesTagged = false;
    _choreo._drawnThisFrame = false;

    // Determine total entry duration from style
    var style = ENTRY_STYLES[_choreo.entryStyle] || ENTRY_STYLES.slide_in;
    _choreo.entryTotalDuration = style.duration || 1200;

    // Determine reveal order from profile build timing
    _choreo.revealRoles = [];
    var buildTiming = profile.buildTiming || {};
    var roleOrder = ['sweeper','baiter','suppressor','flanker','sniper','anchor','diver','chaser'];
    var comp = profile.composition || {};
    for (var i = 0; i < roleOrder.length; i++) {
      if (comp[roleOrder[i]] && comp[roleOrder[i]] > 0) {
        _choreo.revealRoles.push(roleOrder[i]);
      }
    }

    // Apply entry choreography to enemies
    _applyEntryToEnemies();

    // Compute silhouette lines
    _computeSilhouetteLines();
  }

  // ============================================================
  // ENTRY APPLICATION
  // ============================================================

  function _applyEntryToEnemies() {
    if (!Array.isArray(global.enemies)) return;

    var style = ENTRY_STYLES[_choreo.entryStyle] || ENTRY_STYLES.slide_in;
    var enemies = global.enemies;
    var profile = _getProfile();

    // Sort enemies: top rows first, left to right for predictable stagger
    var sorted = [];
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i] && enemies[i].alive) sorted.push(enemies[i]);
    }
    sorted.sort(function(a, b) {
      var aRow = (a.row !== undefined ? a.row : a.y);
      var bRow = (b.row !== undefined ? b.row : b.y);
      if (aRow !== bRow) return aRow - bRow;
      return a.x - b.x;
    });

    // Compute entry target and start position for each enemy
    var W = global.W || 360;
    var dir = style.direction || 'top';

    for (var j = 0; j < sorted.length; j++) {
      var e = sorted[j];
      var row = e.row !== undefined ? e.row : Math.floor(j / 6);
      var col = j % 6;

      // Store target position
      e._choreoTargetX = e.x;
      e._choreoTargetY = e.y;

      // Compute entry delay
      var delay = row * (style.staggerPerRow || 120) + col * (style.staggerPerCol || 45);
      e._choreoEntryDelay = Math.min(delay, _choreo.entryTotalDuration - 100);
      e._choreoEntryElapsed = 0;
      e._choreoEntryDone = false;

      // Set start position based on direction
      var startX = e.x;
      var startY = e.y;

      switch (dir) {
        case 'top':
          startY = -e.h - (style.offScreenY || 70) - row * 12;
          break;
        case 'both_edges':
          var side = e._choreoTargetX + e.w / 2 < W / 2 ? -1 : 1;
          startX = side < 0 ? -e.w - (style.offScreenX || 100) - row * 10 : W + (style.offScreenX || 100) + row * 10;
          break;
        case 'diagonal_corners':
          var dSide = e._choreoTargetX + e.w / 2 < W / 2 ? -1 : 1;
          startX = dSide < 0 ? -e.w - (style.offScreenX || 60) : W + (style.offScreenX || 60);
          startY = -e.h - (style.offScreenY || 80);
          break;
        case 'random_edge':
          var rSide = Math.random() < 0.5 ? -1 : 1;
          startX = rSide < 0 ? -e.w - (style.offScreenX || 40) : W + (style.offScreenX || 40);
          startY = Math.random() * (H || 640) * 0.3 - e.h;
          break;
        case 'random':
          startX = Math.random() < 0.5 ? -e.w - 30 : W + 30;
          startY = Math.random() * 100 - e.h;
          break;
        case 'top_rows_first':
          startY = -e.h - (style.offScreenY || 120) - row * 25;
          break;
        case 'split_from_center':
          var centerX = W / 2;
          var splitDir = e._choreoTargetX < centerX ? -1 : 1;
          startX = centerX + splitDir * (Math.abs(e._choreoTargetX - centerX) + (style.offScreenX || 40));
          startY = -e.h - (style.offScreenY || 60);
          break;
        case 'position':
        default:
          // Fade in / delayed reveal: stay at position, control alpha
          startX = e._choreoTargetX;
          startY = e._choreoTargetY;
          e._choreoStartAlpha = 0;
          break;
      }

      e._choreoStartX = startX;
      e._choreoStartY = startY;

      // Move enemy to start position
      e.x = startX;
      e.y = startY;

      // For position-based entries, start invisible
      if (dir === 'position') {
        e._choreoAlpha = 0;
      } else {
        e._choreoAlpha = 1;
      }

      // Tag for composer
      e._choreoRole = e._wcProfileRole || null;
    }

    _choreo._enemiesTagged = true;
  }

  // ============================================================
  // SILHOUETTE LINE COMPUTATION
  // ============================================================

  function _computeSilhouetteLines() {
    _choreo.formationLines = [];
    if (!Array.isArray(global.enemies)) return;

    var sil = SILHOUETTES[_choreo.silhouetteKey] || SILHOUETTES.classic_grid;
    var enemies = global.enemies;
    var lineStyle = sil.lineStyle || 'grid';

    // Group enemies by row
    var rows = {};
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e || !e.alive) continue;
      var r = e.row !== undefined ? e.row : Math.floor(e.y / 36);
      if (!rows[r]) rows[r] = [];
      rows[r].push(e);
    }

    // Sort each row by X
    var rowKeys = Object.keys(rows).sort(function(a, b) { return Number(a) - Number(b); });
    var allPoints = [];

    for (var rk = 0; rk < rowKeys.length; rk++) {
      var rowEnemies = rows[rowKeys[rk]];
      rowEnemies.sort(function(a, b) { return a.x - b.x; });

      for (var re = 0; re < rowEnemies.length - 1; re++) {
        var e1 = rowEnemies[re];
        var e2 = rowEnemies[re + 1];
        allPoints.push({
          x1: e1.x + e1.w / 2, y1: e1.y + e1.h / 2,
          x2: e2.x + e2.w / 2, y2: e2.y + e2.h / 2,
          type: 'row'
        });
      }
    }

    // Column connections (for grid/column styles)
    if (lineStyle === 'grid' || lineStyle === 'vertical_columns' || lineStyle === 'parallel_vertical') {
      for (var rk2 = 0; rk2 < rowKeys.length - 1; rk2++) {
        var topRow = rows[rowKeys[rk2]];
        var botRow = rows[rowKeys[rk2 + 1]];
        for (var ci = 0; ci < Math.min(topRow.length, botRow.length); ci++) {
          allPoints.push({
            x1: topRow[ci].x + topRow[ci].w / 2, y1: topRow[ci].y + topRow[ci].h / 2,
            x2: botRow[ci].x + botRow[ci].w / 2, y2: botRow[ci].y + botRow[ci].h / 2,
            type: 'col'
          });
        }
      }
    }

    _choreo.formationLines = { lines: allPoints, silhouette: sil, lineStyle: lineStyle };
  }

  // ============================================================
  // UPDATE — called from updateEnemiesAndProjectiles or composer
  // ============================================================

  function updateChoreography(dt) {
    if (!_choreo.active) return;
    if (!Array.isArray(global.enemies)) return;

    dt = Math.max(0, dt || 0);
    _choreo.entryTimer += dt;

    var phase = _getComposerPhase();

    // During INTRO: animate enemy entries
    if (phase === 'intro' || _choreo.entryPhase === 'pending') {
      _choreo.entryPhase = 'entering';
      _animateEntries(dt);
      _computeSilhouetteLines();
    }

    // After INTRO: mark all entries complete
    if (phase !== 'intro' && _choreo.entryPhase === 'entering') {
      _finalizeEntries();
    }

    _choreo._drawnThisFrame = false;
  }

  function _animateEntries(dt) {
    var enemies = global.enemies;
    var style = ENTRY_STYLES[_choreo.entryStyle] || ENTRY_STYLES.slide_in;

    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e || !e.alive) continue;
      if (e._choreoEntryDone) continue;
      if (e._choreoEntryDelay === undefined) continue;

      e._choreoEntryElapsed += dt;

      if (e._choreoEntryElapsed < e._choreoEntryDelay) {
        // Still waiting
        continue;
      }

      // Compute progress
      var remaining = _choreo.entryTotalDuration - e._choreoEntryDelay;
      var progress = remaining > 0 ? _clamp((e._choreoEntryElapsed - e._choreoEntryDelay) / remaining, 0, 1) : 1;

      // Interpolate position
      if (e._choreoStartX !== e._choreoTargetX || e._choreoStartY !== e._choreoTargetY) {
        e.x = e._choreoStartX + (e._choreoTargetX - e._choreoStartX) * progress;
        e.y = e._choreoStartY + (e._choreoTargetY - e._choreoStartY) * progress;
      }

      // Alpha for fade-in
      if (e._choreoAlpha !== undefined && e._choreoAlpha < 1) {
        e._choreoAlpha = Math.min(1, progress * 2);
      }

      if (progress >= 1) {
        e._choreoEntryDone = true;
        e.x = e._choreoTargetX;
        e.y = e._choreoTargetY;
        e._choreoAlpha = 1;
      }
    }
  }

  function _finalizeEntries() {
    var enemies = global.enemies;
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e || !e.alive) continue;
      if (e._choreoEntryDone) continue;
      if (e._choreoTargetX !== undefined) e.x = e._choreoTargetX;
      if (e._choreoTargetY !== undefined) e.y = e._choreoTargetY;
      e._choreoEntryDone = true;
      e._choreoAlpha = 1;
    }
    _choreo.entryPhase = 'complete';
  }

  // ============================================================
  // SILHOUETTE RENDERING — called from draw.js
  // ============================================================

  function drawFormationSilhouette(ctx) {
    if (!_choreo.active) return;
    if (!_choreo.formationLines || !_choreo.formationLines.lines) return;

    var phase = _getComposerPhase();
    if (phase !== 'intro' && phase !== 'idle' && _choreo.entryPhase !== 'entering') return;

    var fl = _choreo.formationLines;
    var sil = fl.silhouette || SILHOUETTES.classic_grid;

    ctx.save();
    ctx.globalAlpha = _clamp(sil.lineAlpha || 0.15, 0.05, 0.35);
    ctx.strokeStyle = sil.lineColor || '#334466';
    ctx.lineWidth = 1;

    var lines = fl.lines;

    // Draw grid/column lines if applicable
    if (fl.lineStyle === 'grid' || fl.lineStyle === 'vertical_columns' || fl.lineStyle === 'parallel_vertical') {
      for (var i = 0; i < lines.length; i++) {
        var ln = lines[i];
        ctx.beginPath();
        ctx.moveTo(ln.x1, ln.y1);
        ctx.lineTo(ln.x2, ln.y2);
        ctx.stroke();
      }
    } else {
      // Row connections only
      for (var j = 0; j < lines.length; j++) {
        var l = lines[j];
        if (l.type === 'row') {
          ctx.beginPath();
          ctx.moveTo(l.x1, l.y1);
          ctx.lineTo(l.x2, l.y2);
          ctx.stroke();
        }
      }
    }

    // Draw escape lane indicators during INTRO
    _drawEscapeLanes(ctx);

    ctx.restore();
    _choreo._drawnThisFrame = true;
  }

  function _drawEscapeLanes(ctx) {
    var profile = _getProfile();
    var laneCount = profile ? profile.escapeLanes : 2;
    if (laneCount <= 0) return;

    var W = global.W || 360;
    var H = global.H || 640;
    var laneWidth = W / (laneCount + 1);

    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#22aa44';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);

    for (var l = 0; l < laneCount; l++) {
      var laneX = laneWidth * (l + 1);
      ctx.beginPath();
      ctx.moveTo(laneX, 50);
      ctx.lineTo(laneX, H - 80);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }

  // ============================================================
  // REVEAL MANAGEMENT
  // ============================================================

  function isRoleRevealed(role) {
    if (!_choreo.active) return true;
    if (_choreo.entryPhase === 'complete') return true;
    return !!_choreo.revealedRoles[role];
  }

  function revealRole(role) {
    _choreo.revealedRoles[role] = true;
  }

  function getRevealProgress(role) {
    if (!_choreo.active) return 1;
    if (_choreo.revealedRoles[role]) return 1;
    return 0;
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  global.initChoreography = initChoreography;
  global.updateChoreography = updateChoreography;
  global.drawFormationSilhouette = drawFormationSilhouette;

  global.getChoreographyState = function() {
    return {
      active: _choreo.active,
      entryStyle: _choreo.entryStyle,
      silhouetteKey: _choreo.silhouetteKey,
      entryPhase: _choreo.entryPhase,
      entryTimer: _choreo.entryTimer,
      entryTotalDuration: _choreo.entryTotalDuration,
      revealedRoles: Object.assign({}, _choreo.revealedRoles),
      revealRoles: _choreo.revealRoles.slice(),
      escapeLanes: (_getProfile() ? _getProfile().escapeLanes : 2)
    };
  };

  global.getChoreographySilhouette = function() {
    return _choreo.silhouetteKey;
  };

  global.getChoreographyEntryStyle = function() {
    return _choreo.entryStyle;
  };

  global.isChoreographyActive = function() {
    return _choreo.active;
  };

  global.ENTRY_STYLES = ENTRY_STYLES;
  global.SILHOUETTES = SILHOUETTES;

})(window);
