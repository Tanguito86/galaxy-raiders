// ============================================================
// GALAXY RAIDERS — hc-wc-enforcement.js
// HC-WC-06: Threat Budget Enforcement & Fairness Telemetry
// ============================================================
// STATUS: ENFORCEMENT — real-time threat accounting, budget caps,
// overlap detection, lane validation, fairness diagnostics.
// Integrates with: hc-wave-composer.js, hc-wc-profiles.js, HC-PD.
// Does NOT break existing systems. Enforces, measures, protects.
// ============================================================

(function(global) {
  'use strict';

  // ============================================================
  // DEFAULT CONFIG
  // ============================================================

  var DEFAULT_ENFORCEMENT = {
    enabled: true,
    budgetEnforcement: true,
    overlapDetection: true,
    laneValidation: true,
    densitySpikeLog: true,
    telemetryEnabled: true,
    maxWarningsPerWave: 20,
    escapeLaneMinWidth: 64,
    bulletDensityHardCap: 40,
    simultaneousDiverHardCap: 3,
    simultaneousChaserHardCap: 2,
    simultaneousSniperHardCap: 4,
    crossfireAngleCap: 45,
    forbiddenPairCheckIntervalMs: 500,
    telemetryHistorySize: 60
  };

  // ============================================================
  // STATE
  // ============================================================

  var _enf = {
    enabled: true,
    _warningsThisWave: 0,
    _patternsBlocked: 0,
    _overlapsDetected: 0,
    _laneViolations: 0,
    _densitySpikes: 0,
    _budgetExceeded: 0,
    _crossfireViolations: 0,
    _lastTelemetry: null,
    _telemetryHistory: [],
    _lastForbiddenCheck: 0,
    _activeThreatsCache: null,
    _frameCount: 0
  };

  // ============================================================
  // CONFIG RESOLVER
  // ============================================================

  function _cfg() {
    if (global.GALAXY_CONFIG && global.GALAXY_CONFIG.HC_WC_ENFORCEMENT) {
      return global.GALAXY_CONFIG.HC_WC_ENFORCEMENT;
    }
    return DEFAULT_ENFORCEMENT;
  }

  function _cfgVal(key, def) {
    var c = _cfg();
    return (c[key] !== undefined) ? c[key] : def;
  }

  function _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // ============================================================
  // PROFILE HELPERS
  // ============================================================

  function _getActiveProfile() {
    return global._hcWcActiveProfile || null;
  }

  function _getProfileBudget() {
    var p = _getActiveProfile();
    if (p && typeof p.threatBudget === 'number') return p.threatBudget;
    return _cfgVal('defaultThreatBudget', 10);
  }

  function _getProfileForbiddenRoles() {
    var p = _getActiveProfile();
    if (p && p.forbiddenRoles) return p.forbiddenRoles;
    return [];
  }

  function _getProfileEscapeLanes() {
    var p = _getActiveProfile();
    if (p && typeof p.escapeLanes === 'number') return p.escapeLanes;
    return _cfgVal('defaultEscapeLanes', 2);
  }

  function _getProfilePeakLimits() {
    var p = _getActiveProfile();
    if (p && p.peakLimits) return p.peakLimits;
    return { maxSimultaneousPatterns: 3, maxBullets: 30, interPatternGapMs: 200 };
  }

  // ============================================================
  // THREAT COST BY ROLE (from HC-WC-02B)
  // ============================================================

  var ROLE_THREAT_COST = {
    sweeper: 1,
    sniper: 3,
    diver: 4,
    suppressor: 2,
    chaser: 4,
    flanker: 2,
    baiter: 1,
    anchor: 4,
    blocker: 2,
    swarm: 0.5,
    basic: 1
  };

  function _getEnemyRole(enemy) {
    if (!enemy || !enemy.alive) return null;
    if (enemy._wcProfileRole) return enemy._wcProfileRole;
    if (typeof global.getEnemyRole === 'function') return global.getEnemyRole(enemy);
    var t = enemy.type || '';
    if (t === 'alien1') return 'sweeper';
    if (t === 'alien2') return 'sniper';
    if (t === 'alien3') return enemy._wcAnchorMode ? 'anchor' : (enemy._wcBlockerMode ? 'blocker' : 'diver');
    if (t === 'alien4') return 'suppressor';
    if (t === 'alien5') return 'chaser';
    if (t === 'alien6') return 'flanker';
    if (t === 'alien_mini') return 'baiter';
    return 'basic';
  }

  // ============================================================
  // REAL-TIME THREAT ACCOUNTING
  // ============================================================

  function _countActiveThreats() {
    var enemies = Array.isArray(global.enemies) ? global.enemies : [];
    var counts = {};
    var totalBudget = 0;

    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e || !e.alive) continue;
      var role = _getEnemyRole(e);
      if (!role) continue;
      counts[role] = (counts[role] || 0) + 1;
      totalBudget += (ROLE_THREAT_COST[role] || 1);
    }

    _enf._activeThreatsCache = {
      counts: counts,
      totalBudget: totalBudget,
      aliveCount: enemies.filter(function(e) { return e && e.alive; }).length,
      bullets: Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0,
      timestamp: global.globalTime || 0
    };

    return _enf._activeThreatsCache;
  }

  function getActiveThreats() {
    if (!_enf._activeThreatsCache) return _countActiveThreats();
    return _enf._activeThreatsCache;
  }

  function getCurrentThreatBudget() {
    var t = getActiveThreats();
    return t ? t.totalBudget : 0;
  }

  // ============================================================
  // BUDGET ENFORCEMENT
  // ============================================================

  function checkBudgetBeforePattern(enemy) {
    if (!_cfgVal('budgetEnforcement', true)) return true; // allowed if enforcement off

    var budget = getCurrentThreatBudget();
    var maxBudget = _getProfileBudget();

    if (budget > maxBudget + 2) {
      _enf._budgetExceeded++;
      _enf._patternsBlocked++;
      _logWarning('budget_exceeded', {
        currentBudget: budget,
        maxBudget: maxBudget,
        enemyRole: _getEnemyRole(enemy)
      });
      return false;
    }

    return true;
  }

  // ============================================================
  // OVERLAP DETECTION
  // ============================================================

  var FORBIDDEN_PAIRS = [
    ['diver', 'chaser'],
    ['sniper', 'swarm'],
    ['suppressor', 'baiter'],
    ['sweeper', 'chaser']
  ];

  var DANGEROUS_PAIRS = [
    ['sniper', 'diver'],
    ['suppressor', 'diver'],
    ['sniper', 'chaser'],
    ['suppressor', 'chaser'],
    ['diver', 'blocker'],
    ['anchor', 'sniper']
  ];

  function _detectForbiddenOverlaps() {
    if (!_cfgVal('overlapDetection', true)) return { forbidden: [], dangerous: [] };

    var t = getActiveThreats();
    if (!t || !t.counts) return { forbidden: [], dangerous: [] };

    var result = { forbidden: [], dangerous: [] };
    var counts = t.counts;

    // Check profile forbidden roles
    var profileForbidden = _getProfileForbiddenRoles();
    for (var pf = 0; pf < profileForbidden.length; pf++) {
      var r = profileForbidden[pf];
      if ((counts[r] || 0) > 0) {
        result.forbidden.push({ role: r, count: counts[r] || 0, source: 'profile' });
      }
    }

    // Check hardcoded forbidden pairs
    for (var fp = 0; fp < FORBIDDEN_PAIRS.length; fp++) {
      var a = FORBIDDEN_PAIRS[fp][0];
      var b = FORBIDDEN_PAIRS[fp][1];
      var ac = counts[a] || 0;
      var bc = counts[b] || 0;
      if (ac > 0 && bc > 0) {
        result.forbidden.push({ pair: a + '+' + b, countA: ac, countB: bc, source: 'hardcoded' });
      }
    }

    // Check dangerous pairs
    for (var dp = 0; dp < DANGEROUS_PAIRS.length; dp++) {
      var da = DANGEROUS_PAIRS[dp][0];
      var db = DANGEROUS_PAIRS[dp][1];
      var dac = counts[da] || 0;
      var dbc = counts[db] || 0;
      if (dac > 0 && dbc > 0) {
        result.dangerous.push({ pair: da + '+' + db, countA: dac, countB: dbc });
      }
    }

    if (result.forbidden.length > 0) {
      _enf._overlapsDetected++;
      _logWarning('forbidden_overlap', result.forbidden);
    }

    return result;
  }

  // ============================================================
  // ESCAPE LANE VALIDATION
  // ============================================================

  function _validateEscapeLanes() {
    if (!_cfgVal('laneValidation', true)) return { open: true, laneCount: 2, violations: [] };

    var W = global.W || 360;
    var enemies = Array.isArray(global.enemies) ? global.enemies : [];
    var minLanes = _getProfileEscapeLanes();
    var minWidth = _cfgVal('escapeLaneMinWidth', 64);

    // Sample lane occupancy at player height zone (Y: 200-500)
    var laneZones = [];
    var zoneCount = 8;
    var zoneWidth = W / zoneCount;

    for (var z = 0; z < zoneCount; z++) {
      var occupied = false;
      var zoneX = z * zoneWidth;
      for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        if (!e || !e.alive) continue;
        if (e.y < 200 || e.y > 500) continue;
        if (e.x + e.w > zoneX && e.x < zoneX + zoneWidth) {
          occupied = true;
          break;
        }
      }
      laneZones.push({ x: zoneX, width: zoneWidth, occupied: occupied });
    }

    // Count open lanes (contiguous open zones)
    var openLanes = 0;
    var inLane = false;
    var laneWidth = 0;
    for (var lz = 0; lz < laneZones.length; lz++) {
      if (!laneZones[lz].occupied) {
        laneWidth += zoneWidth;
        if (!inLane) { inLane = true; openLanes++; }
      } else {
        inLane = false;
        laneWidth = 0;
      }
    }

    var violations = [];
    if (openLanes < minLanes) {
      violations.push({ type: 'too_few_lanes', current: openLanes, required: minLanes });
      _enf._laneViolations++;
      _logWarning('lane_violation', { openLanes: openLanes, required: minLanes });
    }

    return { open: openLanes >= minLanes, laneCount: openLanes, violations: violations };
  }

  // ============================================================
  // DENSITY SPIKE DETECTION
  // ============================================================

  function _detectDensitySpike() {
    if (!_cfgVal('densitySpikeLog', true)) return false;

    var bullets = Array.isArray(global.enemyBullets) ? global.enemyBullets.length : 0;
    var hardCap = _cfgVal('bulletDensityHardCap', 40);
    var peakLimits = _getProfilePeakLimits();
    var profileCap = peakLimits.maxBullets || 30;
    var cap = Math.min(hardCap, profileCap);

    if (bullets > cap) {
      _enf._densitySpikes++;
      return true;
    }
    return false;
  }

  // ============================================================
  // CROSSFIRE FAIRNESS CHECK
  // ============================================================

  function _checkCrossfireFairness() {
    var enemies = Array.isArray(global.enemies) ? global.enemies : [];
    var flankers = [];
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e || !e.alive) continue;
      if (_getEnemyRole(e) === 'flanker' || e.type === 'alien6') {
        flankers.push(e);
      }
    }

    if (flankers.length < 2) return true;

    var W = global.W || 360;
    var leftFlankers = flankers.filter(function(f) { return f.x + f.w / 2 < W / 2; });
    var rightFlankers = flankers.filter(function(f) { return f.x + f.w / 2 >= W / 2; });

    // Crossfire is unfair if both edges have flankers at similar Y height
    // AND they could fire simultaneously creating an X pattern
    if (leftFlankers.length > 0 && rightFlankers.length > 0) {
      for (var l = 0; l < leftFlankers.length; l++) {
        for (var r = 0; r < rightFlankers.length; r++) {
          var yDiff = Math.abs(leftFlankers[l].y - rightFlankers[r].y);
          if (yDiff < 60) {
            _enf._crossfireViolations++;
            _logWarning('crossfire_risk', {
              leftY: Math.round(leftFlankers[l].y),
              rightY: Math.round(rightFlankers[r].y),
              yDiff: Math.round(yDiff)
            });
            return false;
          }
        }
      }
    }

    return true;
  }

  // ============================================================
  // SIMULTANEOUS ROLE CAPS
  // ============================================================

  function _checkSimultaneousCaps() {
    var t = getActiveThreats();
    if (!t || !t.counts) return [];

    var caps = {
      diver: _cfgVal('simultaneousDiverHardCap', 3),
      chaser: _cfgVal('simultaneousChaserHardCap', 2),
      sniper: _cfgVal('simultaneousSniperHardCap', 4)
    };

    var violations = [];
    var capKeys = Object.keys(caps);
    for (var c = 0; c < capKeys.length; c++) {
      var role = capKeys[c];
      var count = t.counts[role] || 0;
      var cap = caps[role];
      if (count > cap) {
        violations.push({ role: role, count: count, cap: cap });
      }
    }

    return violations;
  }

  // ============================================================
  // WARNING LOGGER
  // ============================================================

  function _logWarning(type, data) {
    if (_enf._warningsThisWave >= _cfgVal('maxWarningsPerWave', 20)) return;
    _enf._warningsThisWave++;
    _enf._lastWarning = { type: type, data: data, time: global.globalTime || 0 };
  }

  // ============================================================
  // UNIFIED ENFORCEMENT CHECK — called every frame
  // ============================================================

  function updateEnforcement() {
    if (!_enf.enabled) return;
    if (!_cfgVal('enabled', true)) return;

    _enf._frameCount++;

    // Refresh threat accounting
    _countActiveThreats();

    // Periodic checks (not every frame — performance)
    var now = global.globalTime || 0;
    if (now - _enf._lastForbiddenCheck > _cfgVal('forbiddenPairCheckIntervalMs', 500)) {
      _enf._lastForbiddenCheck = now;
      _detectForbiddenOverlaps();
      _validateEscapeLanes();
      _checkCrossfireFairness();
    }

    // Every-frame checks
    _detectDensitySpike();

    // Store telemetry snapshot periodically
    if (_cfgVal('telemetryEnabled', true) && _enf._frameCount % 10 === 0) {
      _storeTelemetry();
    }
  }

  // ============================================================
  // PATTERN-LEVEL ENFORCEMENT — called before any enemy fires
  // ============================================================

  function checkEnforcementBeforePattern(enemy) {
    if (!_enf.enabled) return true;
    if (!_cfgVal('enabled', true)) return true;
    if (!_cfgVal('budgetEnforcement', true)) return true;

    // 1. Budget check
    if (!checkBudgetBeforePattern(enemy)) return false;

    // 2. Simultaneous role cap check
    var role = _getEnemyRole(enemy);
    var caps = _checkSimultaneousCaps();
    for (var i = 0; i < caps.length; i++) {
      if (caps[i].role === role && caps[i].count > caps[i].cap) {
        _enf._patternsBlocked++;
        return false;
      }
    }

    return true;
  }

  // ============================================================
  // TELEMETRY
  // ============================================================

  function _storeTelemetry() {
    var t = getActiveThreats();
    var overlaps = _detectForbiddenOverlaps();
    var lanes = _validateEscapeLanes();

    var snap = {
      frame: _enf._frameCount,
      time: global.globalTime || 0,
      level: global.level || 0,
      aliveCount: t ? t.aliveCount : 0,
      bulletCount: t ? t.bullets : 0,
      threatBudget: t ? t.totalBudget : 0,
      budgetLimit: _getProfileBudget(),
      budgetExceeded: _enf._budgetExceeded,
      roleCounts: t ? Object.assign({}, t.counts) : {},
      forbiddenOverlaps: overlaps.forbidden.length,
      dangerousPairs: overlaps.dangerous.length,
      escapeLanesOpen: lanes.laneCount,
      escapeLanesRequired: _getProfileEscapeLanes(),
      patternsBlocked: _enf._patternsBlocked,
      densitySpikes: _enf._densitySpikes,
      crossfireViolations: _enf._crossfireViolations,
      warnings: _enf._warningsThisWave,
      phase: typeof global.getWaveComposerPhase === 'function' ? global.getWaveComposerPhase() : 'unknown',
      profile: _getActiveProfile() ? (_getActiveProfile().label || 'unknown') : 'none'
    };

    _enf._lastTelemetry = snap;

    if (_cfgVal('telemetryEnabled', true)) {
      _enf._telemetryHistory.push(snap);
      var max = _cfgVal('telemetryHistorySize', 60);
      while (_enf._telemetryHistory.length > max) _enf._telemetryHistory.shift();
    }
  }

  function getEnforcementTelemetry() {
    if (!_enf._lastTelemetry) { _storeTelemetry(); }
    return _enf._lastTelemetry;
  }

  function getEnforcementTelemetryHistory() {
    return _enf._telemetryHistory.slice();
  }

  // ============================================================
  // WAVE RESET
  // ============================================================

  function resetEnforcement() {
    _enf._warningsThisWave = 0;
    _enf._patternsBlocked = 0;
    _enf._overlapsDetected = 0;
    _enf._laneViolations = 0;
    _enf._densitySpikes = 0;
    _enf._budgetExceeded = 0;
    _enf._crossfireViolations = 0;
    _enf._lastForbiddenCheck = 0;
    _enf._activeThreatsCache = null;
    _enf._lastWarning = null;
  }

  // ============================================================
  // DIAGNOSTICS
  // ============================================================

  function getEnforcementReport() {
    var t = getActiveThreats();
    var overlaps = _detectForbiddenOverlaps();
    var lanes = _validateEscapeLanes();

    return {
      enabled: _enf.enabled,
      frame: _enf._frameCount,
      currentBudget: t ? t.totalBudget : 0,
      budgetLimit: _getProfileBudget(),
      budgetExceededTotal: _enf._budgetExceeded,
      patternsBlockedTotal: _enf._patternsBlocked,
      overlapsDetected: _enf._overlapsDetected,
      dangerousPairs: overlaps.dangerous,
      forbiddenPairs: overlaps.forbidden,
      laneViolations: _enf._laneViolations,
      escapeLanesOpen: lanes.laneCount,
      escapeLanesRequired: _getProfileEscapeLanes(),
      densitySpikes: _enf._densitySpikes,
      crossfireViolations: _enf._crossfireViolations,
      warningsThisWave: _enf._warningsThisWave,
      lastWarning: _enf._lastWarning,
      roleCounts: t ? Object.assign({}, t.counts) : {},
      bulletCount: t ? t.bullets : 0,
      profile: _getActiveProfile() ? _getActiveProfile().label : 'none'
    };
  }

  // ============================================================
  // GLOBAL EXPORTS
  // ============================================================

  global.updateEnforcement = updateEnforcement;
  global.checkEnforcementBeforePattern = checkEnforcementBeforePattern;
  global.resetEnforcement = resetEnforcement;
  global.getActiveThreats = getActiveThreats;
  global.getCurrentThreatBudget = getCurrentThreatBudget;
  global.getEnforcementTelemetry = getEnforcementTelemetry;
  global.getEnforcementTelemetryHistory = getEnforcementTelemetryHistory;
  global.getEnforcementReport = getEnforcementReport;

  global.printEnforcementReport = function() {
    if (typeof console === 'undefined') return;
    var r = global.getEnforcementReport();
    console.log('=== ENFORCEMENT REPORT ===');
    console.log('  budget:      ' + r.currentBudget + '/' + r.budgetLimit + ' (exceeded: ' + r.budgetExceededTotal + ')');
    console.log('  blocked:     ' + r.patternsBlockedTotal);
    console.log('  overlaps:    ' + r.overlapsDetected);
    console.log('  lanes:       ' + r.escapeLanesOpen + '/' + r.escapeLanesRequired + ' (violations: ' + r.laneViolations + ')');
    console.log('  density:     ' + r.densitySpikes + ' spikes (' + r.bulletCount + ' bullets)');
    console.log('  crossfire:   ' + r.crossfireViolations + ' violations');
    console.log('  warnings:    ' + r.warningsThisWave);
    console.log('  roles:       ' + JSON.stringify(r.roleCounts));
    console.log('  profile:     ' + r.profile);
    if (r.forbiddenPairs.length > 0) {
      console.log('  ! FORBIDDEN: ' + JSON.stringify(r.forbiddenPairs));
    }
    if (r.dangerousPairs.length > 0) {
      console.log('  ! DANGEROUS: ' + JSON.stringify(r.dangerousPairs));
    }
    console.log('==========================');
  };

})(window);
