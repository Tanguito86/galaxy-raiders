// =====================
// GALAXY RAIDERS - audio-engine.js
// Fase 5: Fachada de audio unificada
// =====================

(function() {
  'use strict';

  var SFX_MAP = {
    shoot: function(data) {
      if (data && data.weaponType && typeof sfxShootByWeapon === 'function') {
        sfxShootByWeapon(data.weaponType);
      } else if (typeof sfxShoot === 'function') {
        sfxShoot();
      }
    },
    explosion: function() {
      if (typeof sfxBigExplosion === 'function') sfxBigExplosion();
    },
    impact: function() {
      if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    },
    powerup: function() {
      if (typeof sfxPowerUp === 'function') sfxPowerUp();
    },
    menu: function() {
      if (typeof sfxUIClick === 'function') sfxUIClick();
    },
    bossHit: function() {
      if (typeof sfxEnemyHit === 'function') sfxEnemyHit();
    },
    enemyKill: function() {
      if (typeof sfxEnemyKill === 'function') sfxEnemyKill();
    },
    playerHit: function() {
      if (typeof sfxPlayerHit === 'function') sfxPlayerHit();
    },
    bossWarning: function() {
      if (typeof sfxBossWarning === 'function') sfxBossWarning();
    },
    confirm: function() {
      if (typeof sfxConfirm === 'function') sfxConfirm();
    },
    imperialTelegraph: function() {
      if (typeof sfxImperialTelegraph === 'function') sfxImperialTelegraph();
    },
    medalPickup: function(data) {
      if (typeof sfxMedalPickup === 'function') sfxMedalPickup(data && data.chain);
    },
    medalTierUp: function() {
      if (typeof sfxMedalTierUp === 'function') sfxMedalTierUp();
    },
    medalDown: function() {
      if (typeof sfxMedalDown === 'function') sfxMedalDown();
    },
    perfectWave: function() {
      if (typeof sfxPerfectWave === 'function') sfxPerfectWave();
    },
    bossMedalRain: function() {
      if (typeof sfxBossMedalRain === 'function') sfxBossMedalRain();
    },
    feverActivated: function() {
      if (typeof sfxFeverActivated === 'function') sfxFeverActivated();
    }
  };

  window.AudioEngine = {
    unlock: function() {
      if (typeof initAudio === 'function') initAudio();
      if (typeof ensureAudioUnlocked === 'function') ensureAudioUnlocked();
    },

    playSfx: function(name, data) {
      if (typeof sfxEnabled !== 'undefined' && !sfxEnabled) return;
      if (typeof isMuted !== 'undefined' && isMuted) return;
      var fn = SFX_MAP[name];
      if (fn) {
        fn(data);
      }
    },

    startMusic: function(trackName) {
      if (typeof startMusic === 'function') startMusic(trackName);
    },

    stopMusic: function() {
      if (typeof stopMusicPlayback === 'function') stopMusicPlayback();
    },

    setMuted: function(value) {
      if (typeof isMuted === 'undefined') return;
      isMuted = !!value;
      if (isMuted) {
        if (typeof stopMusicPlayback === 'function') stopMusicPlayback();
      } else {
        if (typeof refreshMusicDucking === 'function') refreshMusicDucking();
        if (typeof syncMuteButtonState === 'function') syncMuteButtonState();
      }
    }
  };

})();
