// =====================
// GALAXY RAIDERS - audio-music-gen.js
// HC-AUD-02: Buffer-based music renderer + OGG-ready player
// Load AFTER music.js, BEFORE audio-engine.js
// =====================

var _musicBuffers = {};
var _currentMusicSource = null;
var _currentMusicGain = null;
var _currentMusicKey = null;
var _musicFadeTimer = null;
var _musicLoopTimer = null;
var _musicBufferFallback = true;

// =====================
// OFFLINE RENDERER
// =====================

function _renderNoteToBuffer(ctx, freq, lengthMs, type, vol, t0) {
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = type || 'triangle';
  osc.frequency.setValueAtTime(freq, t0);
  var dur = lengthMs / 1000;
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.01);
}

function _renderSingleTrack(ctx, notes, bpm, type, vol) {
  var t = 0;
  var beatMs = 60000 / (bpm || 130);
  for (var i = 0; i < notes.length; i++) {
    var nd = notes[i];
    if (nd.n !== 0 && NOTES[nd.n]) {
      _renderNoteToBuffer(ctx, NOTES[nd.n], nd.l, type, vol, t);
    }
    t += nd.l / 1000;
  }
  return t;
}

function _renderDualTrack(ctx, trackData, bassType, leadType, bassVol, leadVol) {
  var bassT = 0;
  var leadT = 0;
  var bpm = trackData.bpm || 130;
  var bassMs = 60000 / bpm;
  var leadMs = bassMs / 2;

  for (var i = 0; i < trackData.bass.length; i++) {
    var nd = trackData.bass[i];
    if (nd.n !== 0 && NOTES[nd.n]) {
      _renderNoteToBuffer(ctx, NOTES[nd.n], nd.l, bassType, bassVol, bassT);
    }
    bassT += nd.l / 1000;
  }
  for (var j = 0; j < trackData.lead.length; j++) {
    var ld = trackData.lead[j];
    if (ld.n !== 0 && NOTES[ld.n]) {
      _renderNoteToBuffer(ctx, NOTES[ld.n], ld.l, leadType, leadVol, leadT);
    }
    leadT += ld.l / 1000;
  }
  return Math.max(bassT, leadT);
}

function renderMusicTrack(trackName) {
  if (_musicBuffers[trackName]) return _musicBuffers[trackName];

  var trackData = MUSIC_DATA[trackName];
  if (!trackData) return null;

  try {
    var sampleRate = 44100;
    if (typeof AC !== 'undefined' && AC) sampleRate = AC.sampleRate;

    var durationSec = 0;
    if (trackData.lead) {
      var totalBeats = Math.max(trackData.bass.length, trackData.lead.length);
      var bpm = trackData.bpm || 130;
      durationSec = (totalBeats * (60000 / bpm)) / 1000 + 0.1;
    } else {
      var totalMs = 0;
      for (var i = 0; i < trackData.length; i++) {
        totalMs += trackData[i].l;
      }
      durationSec = totalMs / 1000 + 0.1;
    }

    durationSec = Math.max(1, Math.min(30, Math.ceil(durationSec)));

    var ctx = new OfflineAudioContext(2, Math.ceil(sampleRate * durationSec), sampleRate);

    if (trackData.lead) {
      _renderDualTrack(ctx, trackData, 'triangle', 'square', 0.10, 0.06);
    } else {
      var bpm = trackName === 'boss' ? 130 : trackName === 'menu' ? 100 : 115;
      _renderSingleTrack(ctx, trackData, bpm, 'triangle', 0.10);
    }

    ctx.startRendering().then(function (buffer) {
      _musicBuffers[trackName] = buffer;
    }).catch(function () {
      _musicBuffers[trackName] = null;
    });

    return null; // async, will be available later
  } catch (e) {
    return null;
  }
}

// =====================
// BUFFER-BASED PLAYBACK
// =====================

function _clearCurrentMusic() {
  if (_currentMusicSource) {
    try { _currentMusicSource.stop(); } catch (e) {}
    _currentMusicSource = null;
  }
  if (_currentMusicGain) {
    try { _currentMusicGain.disconnect(); } catch (e) {}
    _currentMusicGain = null;
  }
  if (_musicLoopTimer) {
    clearTimeout(_musicLoopTimer);
    _musicLoopTimer = null;
  }
  if (_musicFadeTimer) {
    clearInterval(_musicFadeTimer);
    _musicFadeTimer = null;
  }
  _currentMusicKey = null;
}

function _playMusicBufferLoop(buffer, key) {
  if (!AC || !buffer || isMuted) return;

  _clearCurrentMusic();

  ensureMusicBus();
  var dest = musicBusGain || (audioBuses && audioBuses.music) || AC.destination;

  var src = AC.createBufferSource();
  src.buffer = buffer;
  src.loop = false;

  var gain = AC.createGain();
  gain.gain.value = 0;

  src.connect(gain);
  gain.connect(dest);
  src.start(0);

  _currentMusicSource = src;
  _currentMusicGain = gain;
  _currentMusicKey = key;

  // Schedule next loop before this one ends
  var loopMs = (buffer.duration - 0.05) * 1000;
  if (loopMs < 100) loopMs = buffer.duration * 1000;

  _musicLoopTimer = setTimeout(function () {
    if (_currentMusicKey !== key) return;
    _playMusicBufferLoop(buffer, key);
  }, loopMs);

  // Fade in
  _fadeMusicGainTo(gain, 1.0, 400);
}

function _fadeMusicGainTo(gain, target, ms) {
  if (_musicFadeTimer) clearInterval(_musicFadeTimer);
  var steps = 20;
  var stepMs = Math.max(8, ms / steps);
  var startVal = gain.gain.value;
  var delta = (target - startVal) / steps;
  var step = 0;
  _musicFadeTimer = setInterval(function () {
    step++;
    if (step >= steps || !gain) {
      if (gain) gain.gain.value = target;
      clearInterval(_musicFadeTimer);
      _musicFadeTimer = null;
    } else {
      gain.gain.value = Math.max(0, Math.min(1.0, startVal + delta * step));
    }
  }, stepMs);
}

function playMusicFromBuffer(trackName, crossfadeMs) {
  if (isMuted) return;
  initAudio();
  if (!AC) return;

  // If buffer is ready, use it
  if (_musicBuffers[trackName]) {
    // Stop old tracker intervals
    if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();

    // Crossfade: start new at 0, ramp old down
    var oldGain = _currentMusicGain;
    if (oldGain && crossfadeMs && crossfadeMs > 0) {
      _fadeMusicGainTo(oldGain, 0.0001, crossfadeMs);
      setTimeout(function () {
        _clearCurrentMusic();
        _playMusicBufferLoop(_musicBuffers[trackName], trackName);
      }, crossfadeMs * 0.5);
    } else {
      _clearCurrentMusic();
      _playMusicBufferLoop(_musicBuffers[trackName], trackName);
    }
    return true;
  }

  // Buffer not ready yet — trigger async render and fall back to tracker
  renderMusicTrack(trackName);

  // Fall back to tracker-based playback
  if (typeof startMusic === 'function') {
    startMusic(trackName);
  }
  return false;
}

function stopMusicFromBuffer(fadeOutMs) {
  if (_currentMusicGain) {
    var g = _currentMusicGain;
    if (fadeOutMs && fadeOutMs > 0) {
      _fadeMusicGainTo(g, 0.0001, fadeOutMs);
      setTimeout(function () { _clearCurrentMusic(); }, fadeOutMs + 50);
    } else {
      _clearCurrentMusic();
    }
  }
  // Also stop legacy tracker
  if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();
}

// =====================
// PRELOAD ALL TRACKS
// =====================

function preloadAllMusicTracks() {
  var names = ['menu', 'chapter1', 'chapter2', 'chapter3', 'chapter4',
               'boss1', 'boss2', 'boss3', 'finalBoss', 'victory', 'gameover'];
  for (var i = 0; i < names.length; i++) {
    if (MUSIC_DATA[names[i]]) renderMusicTrack(names[i]);
  }
}

// =====================
// CROSSFADE BETWEEN TRACKS
// =====================

function crossfadeMusicTo(trackName, crossfadeMs) {
  crossfadeMs = crossfadeMs || 600;
  if (isMuted) return;
  if (!AC) return;

  // Ensure target buffer is rendering
  if (!_musicBuffers[trackName]) renderMusicTrack(trackName);

  if (_musicBuffers[trackName]) {
    playMusicFromBuffer(trackName, crossfadeMs);
  } else {
    // Fallback: stop old tracker, start new tracker
    if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();
    if (typeof startMusic === 'function') startMusic(trackName);
  }
}

// =====================
// PRELOAD TRIGGER
// =====================

setTimeout(function () {
  if (typeof MUSIC_DATA !== 'undefined' && typeof AC !== 'undefined' && AC) {
    preloadAllMusicTracks();
  }
}, 2000);
