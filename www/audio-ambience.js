// =====================
// GALAXY RAIDERS - audio-ambience.js
// HC-AUD-02: Subtle ambience drone layer
// Load AFTER audio-bus.js, BEFORE audio-engine.js
// =====================

var _ambienceNodes = null;
var _ambienceType = null;
var _ambienceGain = null;
var _ambienceTargetGain = 0;

function _createAmbienceNodes() {
  if (!AC) return null;
  if (_ambienceNodes) return _ambienceNodes;

  var out = ambienceBusNode();
  if (!out || out === AC.destination) {
    // Ensure audio buses exist
    if (typeof ensureAudioBuses === 'function') ensureAudioBuses();
    out = ambienceBusNode();
  }

  var masterGain = AC.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(out);

  // Space drone: filtered noise + low sine
  var noiseBuffer = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate);
  var noiseData = noiseBuffer.getChannelData(0);
  for (var i = 0; i < noiseData.length; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.3;

  var noiseSrc = AC.createBufferSource();
  noiseSrc.buffer = noiseBuffer;
  noiseSrc.loop = true;

  var noiseFilter = AC.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 280;
  noiseFilter.Q.value = 0.5;

  var noiseGain = AC.createGain();
  noiseGain.gain.value = 0;

  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSrc.start(0);

  // Low drone: two detuned sines
  var droneOsc1 = AC.createOscillator();
  droneOsc1.type = 'sine';
  droneOsc1.frequency.value = 55;

  var droneOsc2 = AC.createOscillator();
  droneOsc2.type = 'sine';
  droneOsc2.frequency.value = 55.7;

  var droneGain = AC.createGain();
  droneGain.gain.value = 0;

  droneOsc1.connect(droneGain);
  droneOsc2.connect(droneGain);
  droneGain.connect(masterGain);
  droneOsc1.start(0);
  droneOsc2.start(0);

  // Boss pulse: sub-bass rhythmic throb
  var pulseOsc = AC.createOscillator();
  pulseOsc.type = 'sine';
  pulseOsc.frequency.value = 38;

  var pulseGain = AC.createGain();
  pulseGain.gain.value = 0;

  // LFO on pulse gain
  var lfoGain = AC.createGain();
  lfoGain.gain.value = 0;

  var lfo = AC.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 1.6; // ~96 BPM pulse
  lfo.connect(lfoGain);

  pulseOsc.connect(pulseGain);
  lfoGain.connect(pulseGain.gain);
  pulseGain.connect(masterGain);
  pulseOsc.start(0);
  lfo.start(0);

  _ambienceNodes = {
    masterGain: masterGain,
    noiseSrc: noiseSrc,
    noiseFilter: noiseFilter,
    noiseGain: noiseGain,
    droneOsc1: droneOsc1,
    droneOsc2: droneOsc2,
    droneGain: droneGain,
    pulseOsc: pulseOsc,
    pulseGain: pulseGain,
    lfo: lfo,
    lfoGain: lfoGain
  };

  _ambienceGain = masterGain;
  return _ambienceNodes;
}

function _rampAmbienceParam(param, target, rampSec) {
  if (!AC || !param) return;
  var t = AC.currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(target, t + (rampSec || 0.8));
}

function startAmbience(type) {
  if (isMuted || !sfxEnabled) return;
  if (!AC) { initAudio(); if (!AC) return; }
  _ambienceType = type;

  var nodes = _createAmbienceNodes();
  if (!nodes) return;

  // Ramp master ambience gain up
  _rampAmbienceParam(nodes.masterGain.gain, 1.0, 0.8);

  switch (type) {
    case 'menu':
      // Warm subtle hum
      _rampAmbienceParam(nodes.noiseFilter.frequency, 340, 0.5);
      _rampAmbienceParam(nodes.noiseGain.gain, 0.06, 1.0);
      _rampAmbienceParam(nodes.droneGain.gain, 0.07, 1.0);
      _rampAmbienceParam(nodes.droneOsc1.frequency, 65, 1.0);
      _rampAmbienceParam(nodes.droneOsc2.frequency, 65.6, 1.0);
      _rampAmbienceParam(nodes.pulseGain.gain, 0, 0.3);
      _rampAmbienceParam(nodes.lfoGain.gain, 0, 0.3);
      break;

    case 'stage':
      // Space drone — distant, cold
      _rampAmbienceParam(nodes.noiseFilter.frequency, 220, 0.8);
      _rampAmbienceParam(nodes.noiseGain.gain, 0.08, 1.5);
      _rampAmbienceParam(nodes.droneGain.gain, 0.06, 1.5);
      _rampAmbienceParam(nodes.droneOsc1.frequency, 49, 1.5);
      _rampAmbienceParam(nodes.droneOsc2.frequency, 49.8, 1.5);
      _rampAmbienceParam(nodes.pulseGain.gain, 0, 0.3);
      _rampAmbienceParam(nodes.lfoGain.gain, 0, 0.3);
      break;

    case 'boss':
      // Arena pulse — low pressure throb
      _rampAmbienceParam(nodes.noiseFilter.frequency, 180, 0.5);
      _rampAmbienceParam(nodes.noiseGain.gain, 0.08, 0.8);
      _rampAmbienceParam(nodes.droneGain.gain, 0.07, 0.8);
      _rampAmbienceParam(nodes.droneOsc1.frequency, 38, 1.0);
      _rampAmbienceParam(nodes.droneOsc2.frequency, 38.6, 1.0);
      _rampAmbienceParam(nodes.pulseGain.gain, 0.10, 1.0);
      _rampAmbienceParam(nodes.lfoGain.gain, 0.06, 1.0);
      break;

    case 'victory':
      // Bright shimmer — high wash
      _rampAmbienceParam(nodes.noiseFilter.frequency, 600, 0.8);
      _rampAmbienceParam(nodes.noiseGain.gain, 0.05, 1.0);
      _rampAmbienceParam(nodes.droneGain.gain, 0.04, 1.0);
      _rampAmbienceParam(nodes.droneOsc1.frequency, 98, 1.5);
      _rampAmbienceParam(nodes.droneOsc2.frequency, 98.4, 1.5);
      _rampAmbienceParam(nodes.pulseGain.gain, 0, 0.3);
      _rampAmbienceParam(nodes.lfoGain.gain, 0, 0.3);
      break;

    case 'gameover':
      // Empty, cold
      _rampAmbienceParam(nodes.noiseFilter.frequency, 160, 1.5);
      _rampAmbienceParam(nodes.noiseGain.gain, 0.07, 2.0);
      _rampAmbienceParam(nodes.droneGain.gain, 0.05, 2.0);
      _rampAmbienceParam(nodes.droneOsc1.frequency, 33, 1.5);
      _rampAmbienceParam(nodes.droneOsc2.frequency, 33.3, 1.5);
      _rampAmbienceParam(nodes.pulseGain.gain, 0, 0.5);
      _rampAmbienceParam(nodes.lfoGain.gain, 0, 0.5);
      break;

    default:
      stopAmbience(400);
      return;
  }
}

function stopAmbience(fadeOutMs) {
  _ambienceType = null;
  if (!_ambienceNodes) return;
  var ms = fadeOutMs || 500;
  var nodes = _ambienceNodes;
  _rampAmbienceParam(nodes.masterGain.gain, 0.0001, ms / 1000);
}

function setAmbienceIntensity(factor) {
  if (!_ambienceNodes || !_ambienceType) return;
  var f = Math.max(0.3, Math.min(1.5, factor || 1.0));
  var nodes = _ambienceNodes;
  var baseNoise = 0.08;
  var baseDrone = 0.06;
  if (_ambienceType === 'boss') { baseNoise = 0.10; baseDrone = 0.08; }
  _rampAmbienceParam(nodes.noiseGain.gain, baseNoise * f, 0.3);
  _rampAmbienceParam(nodes.droneGain.gain, baseDrone * f, 0.3);
}
