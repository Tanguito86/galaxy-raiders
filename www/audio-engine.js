// =====================
// GALAXY RAIDERS - audio-engine.js
// HC-AUD-01: Bus-aware unified audio facade
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
    },
    graze: function() {
      if (typeof sfxGraze === 'function') sfxGraze();
    },
    comboBreak: function() {
      if (typeof sfxComboBreak === 'function') sfxComboBreak();
    },
    rankUp: function() {
      if (typeof sfxRankUp === 'function') sfxRankUp();
    },
    rankDown: function() {
      if (typeof sfxRankDown === 'function') sfxRankDown();
    },
    stageStart: function() {
      if (typeof sfxStageStart === 'function') sfxStageStart();
    },
    newThreat: function() {
      if (typeof sfxNewThreat === 'function') sfxNewThreat();
    },
    setpieceEscalate: function() {
      if (typeof sfxSetpieceEscalate === 'function') sfxSetpieceEscalate();
    },
    bossDescentStart: function() {
      if (typeof sfxBossDescentStart === 'function') sfxBossDescentStart();
    },
    bossDescentStop: function() {
      if (typeof sfxBossDescentStop === 'function') sfxBossDescentStop();
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
        if (typeof stopMusicFromBuffer === 'function') stopMusicFromBuffer(100);
        if (typeof stopAmbience === 'function') stopAmbience(200);
        if (typeof setMasterMute === 'function') setMasterMute(true);
      } else {
        if (typeof setMasterMute === 'function') setMasterMute(false);
        if (typeof refreshMusicDucking === 'function') refreshMusicDucking();
        if (typeof syncMuteButtonState === 'function') syncMuteButtonState();
      }
    },

    // HC-AUD-01: Bus volume control API
    setBusVolume: function(busName, value, rampMs) {
      if (typeof setBusVolume === 'function') setBusVolume(busName, value, rampMs);
    },

    getBusVolume: function(busName) {
      if (typeof getBusVolume === 'function') return getBusVolume(busName);
      return 1.0;
    },

    setMasterVolume: function(value, rampMs) {
      if (typeof setMasterVolume === 'function') setMasterVolume(value, rampMs);
    },

    // HC-AUD-01: OGG music controls
    oggRegister: function(key, src, loop) {
      if (typeof oggRegister === 'function') oggRegister(key, src, loop);
    },

    oggPlay: function(key, fadeInMs) {
      if (typeof oggPlay === 'function') oggPlay(key, fadeInMs);
    },

    oggStop: function(fadeOutMs) {
      if (typeof oggStop === 'function') oggStop(fadeOutMs);
    },

    // HC-AUD-01: Duck a bus
    duckBus: function(busName, ms, level) {
      if (typeof requestBusDuck === 'function') requestBusDuck(busName, ms, level);
    },

    // HC-AUD-02: Ambience control
    startAmbience: function(type) {
      if (typeof startAmbience === 'function') startAmbience(type);
    },

    stopAmbience: function(fadeOutMs) {
      if (typeof stopAmbience === 'function') stopAmbience(fadeOutMs);
    },

    setAmbienceIntensity: function(factor) {
      if (typeof setAmbienceIntensity === 'function') setAmbienceIntensity(factor);
    },

    // HC-AUD-02: Buffer-based music control
    crossfadeMusic: function(trackName, crossfadeMs) {
      if (typeof crossfadeMusicTo === 'function') crossfadeMusicTo(trackName, crossfadeMs);
    },

    preloadMusic: function() {
      if (typeof preloadAllMusicTracks === 'function') preloadAllMusicTracks();
    },

    // HC-AUD-02: Mute with ambience awareness
    setMutedFull: function(value) {
      AudioEngine.setMuted(value);
      if (value) {
        if (typeof stopAmbience === 'function') stopAmbience(200);
      } else if (state === 'menu') {
        if (typeof startAmbience === 'function') startAmbience('menu');
      }
    }
  };

})();
