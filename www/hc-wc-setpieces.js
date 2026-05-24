// ============================================================
// GALAXY RAIDERS — hc-wc-setpieces.js
// HC-WC-07: Setpiece Framework & Boss Prelude Pass
// ============================================================
// STATUS: FRAMEWORK — narrative beats, tension arcs, prelude staging.
// Integrates with: hc-wc-profiles.js, hc-wave-composer.js, draw.js.
// Creates memorable encounters with identity and emotional pacing.
// ============================================================

(function(global) {
  'use strict';

  // ============================================================
  // SETPIECE BEAT PHASES
  // ============================================================

  var BEAT_PHASES = {
    PENDING:    'pending',
    ANTICIPATE: 'anticipate',
    REVEAL:     'reveal',
    ESCALATE:   'escalate',
    CLIMAX:     'climax',
    RESOLVE:    'resolve',
    COMPLETE:   'complete'
  };

  // ============================================================
  // SETPIECE DEFINITIONS
  // ============================================================

  var SETPIECES = {

    // ---- BOSS PRELUDES ----

    boss_prelude_4: {
      label: 'IRON APPROACH',
      bossName: 'CRABTRON',
      bossLevel: 5,
      level: 4,
      narrativeArc: 'tension_build',
      beats: [
        { phase: 'ANTICIPATE', duration: 2500, text: 'IRON APPROACH', effect: 'banner_fade', intensity: 0.15 },
        { phase: 'ESCALATE',   duration: 3000, text: '',              effect: 'screen_pulse',  intensity: 0.25, pulseInterval: 1200 },
        { phase: 'REVEAL',     duration: 2000, text: 'CRABTRON INCOMING', effect: 'banner_flash', intensity: 0.35 },
        { phase: 'RESOLVE',    duration: 800,  text: '',              effect: 'fade_in_boss',  intensity: 0.20 }
      ],
      preludeColor: '#ff4422',
      tensionColor: '#884422',
      bossTelegraphColor: '#ff3322'
    },

    boss_prelude_14: {
      label: 'OMINOUS CALM',
      bossName: 'ORBITAL',
      bossLevel: 15,
      level: 14,
      narrativeArc: 'ominous_calm',
      beats: [
        { phase: 'ANTICIPATE', duration: 2200, text: 'OMINOUS CALM',     effect: 'banner_fade',  intensity: 0.10 },
        { phase: 'ESCALATE',   duration: 3500, text: '',                  effect: 'slow_pulse',   intensity: 0.18, pulseInterval: 2000 },
        { phase: 'REVEAL',     duration: 1800, text: 'ORBITAL INCOMING',  effect: 'banner_flash', intensity: 0.30 },
        { phase: 'RESOLVE',    duration: 600,  text: '',                  effect: 'fade_in_boss', intensity: 0.15 }
      ],
      preludeColor: '#44aaff',
      tensionColor: '#334488',
      bossTelegraphColor: '#44ccff'
    },

    boss_prelude_20: {
      label: 'THE THRONE MACHINE',
      bossName: 'EMPERADOR',
      bossLevel: 20,
      level: 20,
      narrativeArc: 'final_authority',
      beats: [
        { phase: 'ANTICIPATE', duration: 2600, text: 'THE THRONE MACHINE', effect: 'banner_fade',  intensity: 0.14 },
        { phase: 'ESCALATE',   duration: 3200, text: '',                   effect: 'slow_pulse',   intensity: 0.22, pulseInterval: 1800 },
        { phase: 'REVEAL',     duration: 2200, text: 'EMPERADOR ONLINE',   effect: 'banner_flash', intensity: 0.34 },
        { phase: 'RESOLVE',    duration: 900,  text: '',                   effect: 'fade_in_boss', intensity: 0.18 }
      ],
      preludeColor: '#ffdd88',
      tensionColor: '#554411',
      bossTelegraphColor: '#ffeecc'
    },

    // ---- TACTICAL SETPIECES ----

    setpiece_pincer_3: {
      label: 'PINCER ASSAULT',
      level: 3,
      narrativeArc: 'flanking_reveal',
      beats: [
        { phase: 'ANTICIPATE', duration: 2000, text: 'PINCER ASSAULT', effect: 'banner_fade',  intensity: 0.20 },
        { phase: 'REVEAL',     duration: 1500, text: '',                effect: 'dual_side_entry', intensity: 0.35 },
        { phase: 'CLIMAX',     duration: 3000, text: '',                effect: 'closing_wings',  intensity: 0.50 },
        { phase: 'RESOLVE',    duration: 2000, text: '',                effect: 'lane_opens',     intensity: 0.25 }
      ],
      setpieceColor: '#ff8844'
    },

    setpiece_fortress_7: {
      label: 'FORTRESS LINE',
      level: 7,
      narrativeArc: 'wall_breach',
      beats: [
        { phase: 'ANTICIPATE', duration: 2000, text: 'FORTRESS LINE', effect: 'banner_fade',      intensity: 0.22 },
        { phase: 'REVEAL',     duration: 1800, text: '',              effect: 'rows_descend',      intensity: 0.35 },
        { phase: 'ESCALATE',   duration: 2500, text: '',              effect: 'row_volley_cycle',  intensity: 0.50 },
        { phase: 'CLIMAX',     duration: 2000, text: '',              effect: 'all_rows_active',   intensity: 0.60 },
        { phase: 'RESOLVE',    duration: 1500, text: '',              effect: 'row_by_row_clear',  intensity: 0.25 }
      ],
      setpieceColor: '#ffaa44'
    },

    setpiece_kamikaze_12: {
      label: 'KAMIKAZE RUSH',
      level: 12,
      narrativeArc: 'aggression_test',
      beats: [
        { phase: 'ANTICIPATE', duration: 1800, text: 'KAMIKAZE RUSH', effect: 'banner_fade',   intensity: 0.25 },
        { phase: 'REVEAL',     duration: 1500, text: '',               effect: 'burst_entries',  intensity: 0.40 },
        { phase: 'ESCALATE',   duration: 2000, text: '',               effect: 'dive_wave_1',    intensity: 0.55 },
        { phase: 'CLIMAX',     duration: 2500, text: '',               effect: 'dive_wave_2_3',  intensity: 0.65 },
        { phase: 'RESOLVE',    duration: 1500, text: '',               effect: 'survivors_scatter', intensity: 0.30 }
      ],
      setpieceColor: '#ff6644'
    },

    setpiece_splitter_16: {
      label: 'SPLITTER STORM',
      level: 16,
      narrativeArc: 'escalation_mechanic',
      beats: [
        { phase: 'ANTICIPATE', duration: 1800, text: 'SPLITTER STORM', effect: 'banner_fade',    intensity: 0.25 },
        { phase: 'REVEAL',     duration: 2000, text: '',                effect: 'formation_settle', intensity: 0.35 },
        { phase: 'ESCALATE',   duration: 2000, text: '',                effect: 'first_splits',    intensity: 0.45 },
        { phase: 'CLIMAX',     duration: 2500, text: '',                effect: 'split_cascade',   intensity: 0.60 },
        { phase: 'RESOLVE',    duration: 2000, text: '',                effect: 'cleanup_minis',   intensity: 0.25 }
      ],
      setpieceColor: '#88ffaa'
    },

    setpiece_imperial_18: {
      label: 'IMPERIAL GUARD',
      level: 18,
      narrativeArc: 'elite_coordination',
      beats: [
        { phase: 'ANTICIPATE', duration: 2200, text: 'IMPERIAL GUARD', effect: 'banner_flash',    intensity: 0.30 },
        { phase: 'REVEAL',     duration: 2000, text: '',                effect: 'formation_march', intensity: 0.40 },
        { phase: 'ESCALATE',   duration: 2500, text: '',                effect: 'crossfire_burst_1', intensity: 0.55 },
        { phase: 'CLIMAX',     duration: 3000, text: '',                effect: 'crossfire_burst_2_chained', intensity: 0.70 },
        { phase: 'RESOLVE',    duration: 2000, text: '',                effect: 'guard_broken',     intensity: 0.30 }
      ],
      setpieceColor: '#ffcc44',
      isElite: true
    }
  };

  // ============================================================
  // SETPIECE STATE
  // ============================================================

  var _sp = {
    active: false,
    key: null,
    beatIndex: 0,
    beatTimer: 0,
    beatPhase: BEAT_PHASES.PENDING,
    totalBeats: 0,
    bannerAlpha: 0,
    pulseActive: false,
    pulseTimer: 0,
    pulseValue: 0,
    screenFlash: 0,
    transitionAlpha: 0,
    narrativeArc: null,
    _bossPreludeDone: false
  };

  // ============================================================
  // HELPERS
  // ============================================================

  function _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function _getSetpieceForLevel(levelNum) {
    var keys = Object.keys(SETPIECES);
    for (var i = 0; i < keys.length; i++) {
      if (SETPIECES[keys[i]].level === levelNum) {
        return { key: keys[i], data: SETPIECES[keys[i]] };
      }
    }
    return null;
  }

  function _isBossLevel(levelNum) {
    return [5,10,15,19,20].indexOf(levelNum) !== -1;
  }

  // ============================================================
  // INIT
  // ============================================================

  function initSetpiece() {
    var level = global.level || 1;
    var sp = _getSetpieceForLevel(level);

    if (!sp) {
      _sp.active = false;
      return false;
    }

    _sp.active = true;
    _sp.key = sp.key;
    _sp.beatIndex = 0;
    _sp.beatTimer = 0;
    _sp.beatPhase = BEAT_PHASES.PENDING;
    _sp.totalBeats = sp.data.beats ? sp.data.beats.length : 0;
    _sp.bannerAlpha = 0;
    _sp.pulseActive = false;
    _sp.pulseTimer = 0;
    _sp.pulseValue = 0;
    _sp.screenFlash = 0;
    _sp.transitionAlpha = 0;
    _sp.narrativeArc = sp.data.narrativeArc || null;
    _sp._bossPreludeDone = false;

    // Store active setpiece data globally for draw.js
    global._hcWcActiveSetpiece = sp.data;

    return true;
  }

  // ============================================================
  // UPDATE
  // ============================================================

  function updateSetpiece(dt) {
    if (!_sp.active) return;
    if (_sp.beatIndex >= _sp.totalBeats) return;

    dt = Math.max(0, dt || 0);
    _sp.beatTimer += dt;

    var spData = global._hcWcActiveSetpiece;
    if (!spData || !spData.beats) return;

    var beat = spData.beats[_sp.beatIndex];
    if (!beat) return;

    // Update beat effects
    _updateBeatEffects(dt, beat);

    // Advance to next beat
    if (_sp.beatTimer >= beat.duration) {
      _sp.beatTimer = 0;
      _sp.beatIndex++;

      if (_sp.beatIndex < _sp.totalBeats) {
        var nextBeat = spData.beats[_sp.beatIndex];
        _sp.beatPhase = nextBeat.phase || BEAT_PHASES.ESCALATE;
        // HC-VS-04D: audio sting on escalation beats
        var nextEffect = nextBeat.effect || '';
        var isEscalationBeat = nextEffect === 'all_rows_active' ||
          nextEffect === 'closing_wings' || nextEffect === 'split_cascade' ||
          nextEffect === 'crossfire_burst_2_chained' || nextEffect === 'dive_wave_2_3' ||
          nextBeat.phase === 'CLIMAX' || nextBeat.phase === 'ESCALATE';
        if (isEscalationBeat && typeof sfxSetpieceEscalate === 'function') {
          sfxSetpieceEscalate();
        }
      } else {
        _sp.beatPhase = BEAT_PHASES.COMPLETE;
        _sp.active = false;
        _sp.bannerAlpha = 0;
        _sp.screenFlash = 0;
      }
    } else {
      _sp.beatPhase = beat.phase || BEAT_PHASES.ANTICIPATE;
    }

    // Transition alpha decay
    if (_sp.transitionAlpha > 0) {
      _sp.transitionAlpha = Math.max(0, _sp.transitionAlpha - dt * 0.002);
    }

    // Screen flash decay
    if (_sp.screenFlash > 0) {
      _sp.screenFlash = Math.max(0, _sp.screenFlash - dt * 0.004);
    }
  }

  function _updateBeatEffects(dt, beat) {
    var progress = _sp.beatTimer / Math.max(1, beat.duration);

    // Banner text alpha
    if (beat.text) {
      // Fade in over first 30%, hold, fade out last 20%
      if (progress < 0.3) {
        _sp.bannerAlpha = progress / 0.3;
      } else if (progress > 0.8) {
        _sp.bannerAlpha = (1 - progress) / 0.2;
      } else {
        _sp.bannerAlpha = 1;
      }
    } else {
      _sp.bannerAlpha = Math.max(0, _sp.bannerAlpha - dt * 0.003);
    }

    // Pulse effect
    if (beat.effect === 'screen_pulse' || beat.effect === 'slow_pulse') {
      _sp.pulseActive = true;
      _sp.pulseTimer += dt;
      var interval = beat.pulseInterval || 1200;
      _sp.pulseValue = Math.max(0, Math.sin(_sp.pulseTimer * Math.PI * 2 / interval));
    } else {
      _sp.pulseActive = false;
      _sp.pulseValue = Math.max(0, _sp.pulseValue - dt * 0.003);
    }

    // Screen flash for reveals
    if (beat.effect === 'banner_flash' && progress < 0.15) {
      _sp.screenFlash = 0.3;
    }
  }

  // ============================================================
  // GETTERS
  // ============================================================

  function getSetpieceBannerText() {
    if (!_sp.active) return null;
    var spData = global._hcWcActiveSetpiece;
    if (!spData || !spData.beats || _sp.beatIndex >= _sp.totalBeats) return null;
    var beat = spData.beats[_sp.beatIndex];
    return beat.text || null;
  }

  function getSetpieceBannerAlpha() {
    return _sp.bannerAlpha;
  }

  function getSetpiecePulseValue() {
    return _sp.pulseValue;
  }

  function getSetpieceScreenFlash() {
    return _sp.screenFlash;
  }

  function getSetpiecePhase() {
    return _sp.beatPhase;
  }

  function getSetpieceNarrativeArc() {
    return _sp.narrativeArc;
  }

  function getSetpieceTransitionAlpha() {
    return _sp.transitionAlpha;
  }

  function isSetpieceBossPrelude() {
    if (!_sp.active) return false;
    return _sp.key && _sp.key.indexOf('boss_prelude') === 0;
  }

  function isSetpieceElite() {
    if (!global._hcWcActiveSetpiece) return false;
    return !!global._hcWcActiveSetpiece.isElite;
  }

  function getSetpieceColor() {
    if (!global._hcWcActiveSetpiece) return '#ffffff';
    return global._hcWcActiveSetpiece.setpieceColor ||
           global._hcWcActiveSetpiece.preludeColor ||
           '#ff8844';
  }

  function getSetpieceTensionColor() {
    if (!global._hcWcActiveSetpiece) return '#442222';
    return global._hcWcActiveSetpiece.tensionColor || '#442222';
  }

  function getSetpieceBossName() {
    if (!global._hcWcActiveSetpiece) return null;
    return global._hcWcActiveSetpiece.bossName || null;
  }

  function getSetpieceBossLevel() {
    if (!global._hcWcActiveSetpiece) return 0;
    return global._hcWcActiveSetpiece.bossLevel || 0;
  }

  // ============================================================
  // DRAW HELPERS — tension overlay rendering
  // ============================================================

  function drawSetpieceOverlay(ctx) {
    if (!_sp.active) return;
    if (_sp.beatIndex >= _sp.totalBeats && !_sp._bossPreludeDone) return;

    var W = global.W || 360;
    var H = global.H || 640;

    // Screen flash
    if (_sp.screenFlash > 0.01) {
      ctx.save();
      ctx.globalAlpha = _sp.screenFlash;
      ctx.fillStyle = getSetpieceColor();
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // Tension pulse vignette
    if (_sp.pulseValue > 0.05) {
      ctx.save();
      ctx.globalAlpha = _sp.pulseValue * 0.12;

      var tensionColor = getSetpieceTensionColor();
      var grad = ctx.createRadialGradient(W/2, H/2, W*0.3, W/2, H/2, W*0.8);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.7, tensionColor);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // Transition overlay (pre-boss fade)
    if (_sp.transitionAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = _sp.transitionAlpha;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  // ============================================================
  // COMPOSER INTEGRATION — called during wave phase transitions
  // ============================================================

  function onComposerPhaseChange(oldPhase, newPhase) {
    if (!_sp.active) return;

    // On BUILD → PEAK: trigger escalation beat if pending
    if (newPhase === 'peak' && _sp.beatPhase === BEAT_PHASES.ANTICIPATE) {
      // Advance past anticipation into reveal/escalation
      _sp.beatTimer = 999999; // force beat advance
    }

    // On RESOLVE → RELIEF: trigger completion
    if (newPhase === 'relief' || newPhase === 'resolve') {
      if (_sp.beatIndex < _sp.totalBeats - 1) {
        _sp.beatTimer = 999999; // force advance to resolve beat
      }
    }
  }

  // ============================================================
  // PRELUDE COMPLETION — triggers boss transition
  // ============================================================

  function triggerPreludeCompletion() {
    if (!isSetpieceBossPrelude()) return;
    _sp.transitionAlpha = 1;
    _sp._bossPreludeDone = true;
    _sp.screenFlash = 0.6;
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  global.SETPIECES = SETPIECES;

  global.initSetpiece = initSetpiece;
  global.updateSetpiece = updateSetpiece;
  global.drawSetpieceOverlay = drawSetpieceOverlay;
  global.onComposerPhaseChange = onComposerPhaseChange;
  global.triggerPreludeCompletion = triggerPreludeCompletion;

  global.getSetpieceBannerText = getSetpieceBannerText;
  global.getSetpieceBannerAlpha = getSetpieceBannerAlpha;
  global.getSetpiecePulseValue = getSetpiecePulseValue;
  global.getSetpieceScreenFlash = getSetpieceScreenFlash;
  global.getSetpiecePhase = getSetpiecePhase;
  global.getSetpieceNarrativeArc = getSetpieceNarrativeArc;
  global.getSetpieceTransitionAlpha = getSetpieceTransitionAlpha;
  global.isSetpieceBossPrelude = isSetpieceBossPrelude;
  global.isSetpieceElite = isSetpieceElite;
  global.getSetpieceColor = getSetpieceColor;
  global.getSetpieceBossName = getSetpieceBossName;
  global.getSetpieceBossLevel = getSetpieceBossLevel;

  // HC-VS-04C: expose active beat effect for gameplay wiring
  global.getActiveSetpieceBeatEffect = function() {
    if (!_sp.active) return null;
    var spData = global._hcWcActiveSetpiece;
    if (!spData || !spData.beats || _sp.beatIndex >= _sp.totalBeats) return null;
    var beat = spData.beats[_sp.beatIndex];
    return beat ? beat.effect : null;
  };

  global.getActiveSetpieceBeatIntensity = function() {
    if (!_sp.active) return 0;
    var spData = global._hcWcActiveSetpiece;
    if (!spData || !spData.beats || _sp.beatIndex >= _sp.totalBeats) return 0;
    var beat = spData.beats[_sp.beatIndex];
    return beat ? (beat.intensity || 0) : 0;
  };

  global.getSetpieceState = function() {
    return {
      active: _sp.active,
      key: _sp.key,
      beatIndex: _sp.beatIndex,
      totalBeats: _sp.totalBeats,
      beatPhase: _sp.beatPhase,
      beatTimer: _sp.beatTimer,
      bannerAlpha: parseFloat(_sp.bannerAlpha.toFixed(3)),
      pulseValue: parseFloat(_sp.pulseValue.toFixed(3)),
      screenFlash: parseFloat(_sp.screenFlash.toFixed(3)),
      narrativeArc: _sp.narrativeArc,
      isBossPrelude: isSetpieceBossPrelude(),
      isElite: isSetpieceElite()
    };
  };

})(window);
