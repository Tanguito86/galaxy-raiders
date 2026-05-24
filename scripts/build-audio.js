// =====================
// GALAXY RAIDERS - scripts/build-audio.js
// HC-AUD-04: Real WAV/OGG soundtrack asset generator
// Usage: node scripts/build-audio.js
// =====================

var fs = require('fs');
var path = require('path');

// =====================
// NOTE FREQUENCIES
// =====================
var NOTES = {
  C1:32.70, Db1:34.65, D1:36.71, Eb1:38.89, E1:41.20, F1:43.65, Gb1:46.25, G1:49.00, Ab1:51.91, A1:55.00, Bb1:58.27, B1:61.74,
  C2:65.41, Db2:69.30, D2:73.42, Eb2:77.78, E2:82.41, F2:87.31, Gb2:92.50, G2:98.00, Ab2:103.83, A2:110.00, Bb2:116.54, B2:123.47,
  C3:130.81,Db3:138.59, D3:146.83, Eb3:155.56, E3:164.81, F3:174.61, Gb3:185.00, G3:196.00, Ab3:207.65, A3:220.00, Bb3:233.08, B3:246.94,
  C4:261.63,Db4:277.18, D4:293.66, Eb4:311.13, E4:329.63, F4:349.23, Gb4:369.99, G4:392.00, Ab4:415.30, A4:440.00, Bb4:466.16,
  C5:523.25,Db5:554.37, D5:587.33, Eb5:622.25, E5:659.25, F5:698.46, G5:783.99, Ab5:830.61, A5:880.00, Bb5:932.33
};

function noteFreq(n) {
  if (typeof n === 'number') return n;
  return NOTES[n] || 0;
}

// =====================
// WAV UTILITIES
// =====================

function createWavHeader(dataLen, sampleRate, numChannels, bitsPerSample) {
  var byteRate = sampleRate * numChannels * bitsPerSample / 8;
  var blockAlign = numChannels * bitsPerSample / 8;
  var buf = Buffer.alloc(44);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataLen, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(numChannels, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(byteRate, 28);
  buf.writeUInt16LE(blockAlign, 32);
  buf.writeUInt16LE(bitsPerSample, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataLen, 40);
  return buf;
}

function floatTo16Bit(floatVal) {
  var clamped = Math.max(-1, Math.min(1, floatVal));
  return clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
}

// =====================
// SYNTH ENGINE
// =====================

var TWO_PI = 2 * Math.PI;

function oscSample(type, phase) {
  switch (type) {
    case 'sine': return Math.sin(phase);
    case 'square': return Math.sin(phase) >= 0 ? 1 : -1;
    case 'sawtooth': return 2 * ((phase / TWO_PI) % 1) - 1;
    case 'triangle': return 2 * Math.abs(2 * ((phase / TWO_PI) % 1) - 1) - 1;
    default: return Math.sin(phase);
  }
}

// One-pole lowpass filter
function createLPF(cutoffHz, sampleRate) {
  var alpha = 1 / (1 + sampleRate / (TWO_PI * cutoffHz));
  return { alpha: alpha, y: 0 };
}

function processLPF(lpf, sample) {
  lpf.y = lpf.y + lpf.alpha * (sample - lpf.y);
  return lpf.y;
}

// =====================
// RENDER ENGINE
// =====================

function renderTrackToWav(trackData, filename) {
  var sampleRate = 44100;
  var numChannels = 2;
  var bitsPerSample = 16;
  var duration = trackData.duration || 35;
  var totalSamples = Math.ceil(sampleRate * (duration + 0.5)) * numChannels;
  var buffer = new Float32Array(totalSamples);
  var masterMax = 0;

  function writeSample(ch, sampleIndex, value) {
    if (sampleIndex < 0 || sampleIndex >= totalSamples / numChannels) return;
    buffer[sampleIndex * numChannels + ch] += value;
  }

  // Render sections (lead)
  if (trackData.sections) {
    var t = 0;
    for (var si = 0; si < trackData.sections.length; si++) {
      var sec = trackData.sections[si];
      for (var ni = 0; ni < sec.notes.length; ni++) {
        var nd = sec.notes[ni];
        var freq = noteFreq(nd.n);
        var durSec = nd.l / 1000;
        if (freq > 0 && nd.n !== 0) {
          renderNote(buffer, sampleRate, numChannels, t, durSec, freq,
                    sec.type || 'triangle', sec.vol || 0.06, (si % 2) * 0.3 - 0.15);
        }
        t += durSec;
      }
    }
  }

  // Render bass
  if (trackData.bass) {
    var bt = 0;
    for (var bi = 0; bi < trackData.bass.notes.length; bi++) {
      var bnd = trackData.bass.notes[bi];
      var bfreq = noteFreq(bnd.n);
      var bdur = bnd.l / 1000;
      if (bfreq > 0 && bnd.n !== 0) {
        renderNote(buffer, sampleRate, numChannels, bt, bdur, bfreq,
                  trackData.bass.type || 'triangle', trackData.bass.vol || 0.09, 0);
      }
      bt += bdur;
    }
  }

  // Render percussion
  if (trackData.percussion) {
    for (var pi = 0; pi < trackData.percussion.length; pi++) {
      var perc = trackData.percussion[pi];
      var percVol = perc.t === 'kick' ? 0.10 : perc.t === 'snare' ? 0.07 : 0.03;
      renderPercussion(buffer, sampleRate, numChannels, perc.at, perc.t, percVol);
    }
  }

  // Apply lowpass filter if specified
  if (trackData.filter && trackData.filter.length) {
    var filterPoints = trackData.filter.slice().sort(function(a,b){return a.t - b.t;});
    // Apply per-sample LPF with interpolated cutoff
    var lpfL = createLPF(filterPoints[0].f, sampleRate);
    var lpfR = createLPF(filterPoints[0].f, sampleRate);
    var fpIdx = 0;
    for (var i = 0; i < totalSamples / numChannels; i++) {
      var timeSec = i / sampleRate;
      // Advance to next filter point
      while (fpIdx + 1 < filterPoints.length && timeSec >= filterPoints[fpIdx + 1].t) {
        fpIdx++;
      }
      // Interpolate cutoff
      var cutoff;
      if (fpIdx + 1 < filterPoints.length) {
        var frac = (timeSec - filterPoints[fpIdx].t) / (filterPoints[fpIdx + 1].t - filterPoints[fpIdx].t);
        cutoff = filterPoints[fpIdx].f + (filterPoints[fpIdx + 1].f - filterPoints[fpIdx].f) * Math.max(0, Math.min(1, frac));
      } else {
        cutoff = filterPoints[fpIdx].f;
      }
      lpfL.alpha = 1 / (1 + sampleRate / (TWO_PI * Math.max(20, cutoff)));
      lpfR.alpha = lpfL.alpha;
      var idx = i * numChannels;
      buffer[idx] = processLPF(lpfL, buffer[idx]);
      buffer[idx + 1] = processLPF(lpfR, buffer[idx + 1]);
    }
  }

  // Normalize
  for (var j = 0; j < totalSamples; j++) {
    var abs = Math.abs(buffer[j]);
    if (abs > masterMax) masterMax = abs;
  }
  if (masterMax > 0.95) {
    var gain = 0.90 / masterMax;
    for (var k = 0; k < totalSamples; k++) buffer[k] *= gain;
  }

  // Convert to 16-bit PCM
  var dataLen = totalSamples * 2;
  var header = createWavHeader(dataLen, sampleRate, numChannels, bitsPerSample);
  var pcmBuf = Buffer.alloc(dataLen);
  for (var m = 0; m < totalSamples; m++) {
    pcmBuf.writeInt16LE(floatTo16Bit(buffer[m]), m * 2);
  }

  var outPath = path.join(__dirname, '..', 'www', 'assets', 'audio', filename);
  var combined = Buffer.concat([header, pcmBuf]);
  fs.writeFileSync(outPath, combined);
  console.log('  Wrote: ' + outPath + ' (' + (combined.length / 1024).toFixed(0) + ' KB)');
}

function renderNote(buffer, sr, ch, startSec, durSec, freq, type, vol, pan) {
  var startSample = Math.floor(startSec * sr);
  var endSample = Math.floor((startSec + durSec) * sr);
  var attackSamples = Math.floor(0.008 * sr);
  var releaseStart = Math.floor(endSample - 0.03 * sr);
  var phase = 0;
  var phaseInc = TWO_PI * freq / sr;

  for (var i = startSample; i < endSample && i < buffer.length / ch; i++) {
    var env = 1;
    var relPos = i - startSample;
    if (relPos < attackSamples) {
      env = relPos / attackSamples;
    } else if (i > releaseStart) {
      env = Math.max(0, (endSample - i) / (endSample - releaseStart));
    }

    var s = oscSample(type, phase) * vol * env;
    // Stereo panning
    var leftGain = Math.cos((pan + 1) * Math.PI / 4);
    var rightGain = Math.sin((pan + 1) * Math.PI / 4);
    buffer[i * ch] += s * leftGain;
    buffer[i * ch + 1] += s * rightGain;
    phase += phaseInc;
    if (phase > TWO_PI * 1000) phase -= TWO_PI * 1000;
  }
}

function renderPercussion(buffer, sr, ch, timeSec, type, vol) {
  var freq, durSec, oscType, hpCut, lpCut;
  switch (type) {
    case 'kick': freq = 55; durSec = 0.18; oscType = 'sine'; hpCut = 30; lpCut = 300; break;
    case 'snare': freq = 200; durSec = 0.10; oscType = 'triangle'; hpCut = 400; lpCut = 4000; break;
    case 'hat': freq = 8000; durSec = 0.04; oscType = 'square'; hpCut = 5000; lpCut = 12000; break;
    default: return;
  }

  var startSample = Math.floor(timeSec * sr);
  var endSample = Math.floor((timeSec + durSec) * sr);
  var phase = 0;
  var phaseInc = TWO_PI * freq / sr;

  // One-pole HP and LP for each channel
  var hpl = { alpha: 1 / (1 + sr / (TWO_PI * hpCut)), y: 0 };
  var hpr = { alpha: hpl.alpha, y: 0 };
  var lpl = { alpha: 1 / (1 + sr / (TWO_PI * lpCut)), y: 0 };
  var lpr = { alpha: lpl.alpha, y: 0 };

  for (var i = startSample; i < endSample && i < buffer.length / ch; i++) {
    var env = Math.max(0, 1 - (i - startSample) / (endSample - startSample));
    var tone = oscSample(oscType, phase) * vol * 0.4 * env;
    var noise = (Math.random() * 2 - 1) * vol * 0.6 * env;
    if (type === 'kick') phaseInc = TWO_PI * (freq - 30 * (i - startSample) / (endSample - startSample)) / sr;

    // Filter
    var hL = tone + noise;
    hpl.y = hpl.y + hpl.alpha * (hL - hpl.y);
    lpl.y = lpl.y + lpl.alpha * (hpl.y - lpl.y);

    hpr.y = hpr.y + hpr.alpha * (hL - hpr.y);
    lpr.y = lpr.y + lpr.alpha * (hpr.y - lpr.y);

    buffer[i * ch] += lpl.y;
    buffer[i * ch + 1] += lpr.y;
    phase += phaseInc;
  }
}

// =====================
// TRACK DATA (same structure as audio-music-gen.js)
// =====================

// Quick inline helpers for brevity
function N(name, len) { return {n:name, l:len}; }
function R(len) { return {n:0, l:len}; }
function K(at) { return {t:'kick', at:at}; }
function S(at) { return {t:'snare', at:at}; }
function H(at) { return {t:'hat', at:at}; }

var TRACKS = {};

// MENU
TRACKS.menu = { duration:40, loop:true,
  sections:[
    {type:'sine',vol:0.06,notes:[N('C3',1200),R(200),N('G3',1200),R(200),N('C4',800),R(600),N('G3',600),N('C4',600),N('E4',1000),R(1000)]},
    {type:'square',vol:0.05,notes:[N('E3',300),N('G3',300),N('C4',300),N('E4',500),R(200),N('D4',300),N('B3',300),N('G3',300),N('E3',500),R(200),N('F3',300),N('A3',300),N('C4',300),N('F4',500),R(200),N('E4',300),N('C4',300),N('G3',300),N('C4',600),R(300),N('G3',250),N('A3',250),N('B3',250),N('C4',350),N('E4',350),N('C4',700),R(350)]},
    {type:'triangle',vol:0.045,notes:[N('A3',350),N('C4',350),N('E4',350),N('A4',500),R(250),N('G4',350),N('E4',350),N('C4',350),N('A3',500),R(250),N('F3',300),N('A3',300),N('C4',300),N('F4',400),N('E4',300),N('C4',300),N('A3',300),N('G3',600),R(400)]},
    {type:'sine',vol:0.055,notes:[N('C4',600),N('E4',500),N('G4',500),N('C5',800),R(600),N('G4',400),N('A4',400),N('B4',400),N('C5',600),N('E5',500),N('C5',900),R(700),N('F4',400),N('A4',400),N('C5',400),N('F5',800),R(1000)]}
  ],
  bass:{type:'triangle',vol:0.09,notes:[N('C2',1200),R(200),N('G2',1200),R(200),N('C3',800),R(600),N('G2',1000),R(1000),N('C2',700),N('G2',700),N('C3',700),N('E3',700),N('F2',700),N('C3',700),N('G2',700),N('C3',1400),R(400),N('A2',700),N('E3',700),N('A2',700),N('C3',700),N('F2',600),N('A2',600),N('C3',600),N('G2',600),R(400),N('C2',800),N('G2',800),N('C3',800),N('G2',800),R(800)]},
  percussion:[K(0),K(3.2),K(6.4),K(8.0),K(11.2),K(14.4),H(16.0),H(17.6),K(19.2),K(22.4),S(25.6),K(28.8),K(30.0),H(32.0),H(33.6),S(35.2),K(36.8),K(38.4)],
  filter:[{t:0,f:300},{t:4,f:800},{t:8,f:1200},{t:16,f:600},{t:22,f:1000},{t:28,f:500},{t:32,f:1200},{t:38,f:400}]
};

// CHAPTER 1
TRACKS.chapter1 = { duration:36, loop:true,
  sections:[
    {type:'square',vol:0.055,notes:[N('C3',190),N('Eb3',190),N('G3',190),N('C4',190),N('Eb4',190),N('G4',190),N('Eb4',190),N('C4',190),N('G3',190),N('Eb3',190),N('C3',190),N('Eb3',190),N('F3',190),N('Ab3',190),N('C4',190),N('F4',190),N('Eb4',190),N('C4',190),N('Ab3',190),N('F3',190),N('C3',190),N('Eb3',190),N('G3',190),N('C4',380),R(190)]},
    {type:'triangle',vol:0.045,notes:[N('G3',200),N('Ab3',200),N('G3',200),N('F3',200),N('Eb3',200),N('F3',200),N('G3',200),N('C4',300),R(100),N('Bb3',200),N('C4',200),N('Bb3',200),N('Ab3',200),N('G3',200),N('Ab3',200),N('Bb3',200),N('Eb4',300),R(100),N('C4',190),N('D4',190),N('Eb4',190),N('C4',190),N('G3',190),N('Eb3',190),N('C3',190),N('Eb3',380),R(190)]}
  ],
  bass:{type:'triangle',vol:0.09,notes:[N('C2',760),N('Eb2',760),N('G2',760),N('C3',760),N('F2',760),N('Ab2',760),N('C3',760),N('F3',760),N('C2',760),N('Eb2',760),N('G2',760),N('C3',760),N('Bb1',570),N('Bb2',570),N('Ab2',570),N('G2',570),R(190),N('C2',760),N('G2',760),N('C3',760),N('Eb3',760),R(380)]},
  percussion:[K(0),H(0.96),S(1.92),H(2.88),K(3.84),H(4.80),K(5.76),H(6.72),K(7.68),H(8.64),S(9.60),H(10.56),K(11.52),H(12.48),K(13.44),S(14.40),K(15.36),H(16.32),S(17.28),H(18.24),K(19.20),H(20.16),K(21.12),S(22.08),K(23.04),H(24.0),S(24.96),H(25.92),K(26.88),H(27.84),K(28.80),S(29.76),K(30.72),H(31.68),S(32.64),H(33.6),K(34.56)],
  filter:[{t:0,f:350},{t:6,f:900},{t:12,f:600},{t:18,f:1100},{t:24,f:500},{t:30,f:800},{t:35,f:400}]
};

// CHAPTER 2
TRACKS.chapter2 = { duration:34, loop:true,
  sections:[
    {type:'sawtooth',vol:0.04,notes:[N('F3',170),N('Ab3',170),N('C4',170),N('F4',170),N('Eb4',170),N('C4',170),N('Ab3',170),N('F3',170),N('G3',170),N('Bb3',170),N('Db4',170),N('G4',170),N('F4',170),N('Db4',170),N('Bb3',170),N('G3',170),N('Ab3',170),N('C4',170),N('Eb4',170),N('Ab4',170),N('G4',170),N('Eb4',170),N('C4',170),N('Ab3',340),R(170)]},
    {type:'square',vol:0.06,notes:[N('F4',160),N('Eb4',160),N('C4',160),N('Ab3',160),N('G3',160),N('Bb3',160),N('Db4',160),N('F4',240),R(80),N('Eb4',160),N('F4',160),N('G4',160),N('Ab4',160),N('Bb4',160),N('C5',160),N('Ab4',160),N('F4',240),R(80),N('C4',160),N('Db4',160),N('Eb4',160),N('F4',160),N('G4',160),N('Ab4',160),N('G4',160),N('F4',320),R(160)]}
  ],
  bass:{type:'triangle',vol:0.10,notes:[N('F1',680),N('F2',680),N('Ab2',680),N('C3',680),N('G1',680),N('G2',680),N('Bb2',680),N('Db3',680),N('Ab1',680),N('Ab2',680),N('C3',680),N('Eb3',680),N('Bb1',510),N('Bb2',510),N('Db3',510),N('F3',510),R(170),N('F2',640),N('C3',640),N('F3',640),N('Ab3',640),R(320)]},
  percussion:[K(0),K(0.92),H(1.84),S(2.76),K(3.68),H(4.6),K(5.52),S(6.44),K(7.36),K(8.28),H(9.2),S(10.12),K(11.04),H(11.96),K(12.88),S(13.8),K(14.72),K(15.64),H(16.56),S(17.48),K(18.4),H(19.32),K(20.24),S(21.16),K(22.08),H(23.0),K(23.92),S(24.84),K(25.76),K(26.68),H(27.6),S(28.52),K(29.44),H(30.36),K(31.28),S(32.2)],
  filter:[{t:0,f:400},{t:8,f:1000},{t:16,f:550},{t:24,f:1200},{t:30,f:450},{t:33,f:700}]
};

// CHAPTER 3
TRACKS.chapter3 = { duration:32, loop:true,
  sections:[
    {type:'sawtooth',vol:0.04,notes:[N('C3',160),N('Db3',160),N('Eb3',160),N('F3',160),N('Gb3',160),N('Ab3',160),N('Bb3',160),N('C4',160),N('Db4',160),N('Eb4',160),N('F4',160),N('Gb4',160),N('Ab4',160),N('Bb4',160),N('C5',160),N('Db5',320),R(320)]},
    {type:'square',vol:0.06,notes:[N('G3',150),N('Ab3',150),N('Bb3',150),N('C4',150),N('Db4',150),N('Eb4',150),N('F4',150),N('G4',300),R(150),N('F4',150),N('Eb4',150),N('Db4',150),N('C4',150),N('Bb3',150),N('Ab3',150),N('G3',150),N('F3',300),R(150),N('Eb3',150),N('F3',150),N('G3',150),N('Ab3',150),N('Bb3',150),N('C4',150),N('Db4',150),N('Eb4',300),R(150)]}
  ],
  bass:{type:'triangle',vol:0.10,notes:[N('C2',640),R(160),N('Db2',640),R(160),N('Eb2',640),R(160),N('F2',640),R(160),N('Gb2',640),R(160),N('Ab2',640),R(160),N('Bb2',640),R(160),N('C3',1280),R(640),N('G2',600),N('Ab2',600),N('Bb2',600),N('C3',600),N('Db3',600),N('Eb3',600),N('F3',600),N('G3',600),R(300)]},
  percussion:[K(0),H(0.85),K(1.71),S(2.57),H(3.42),K(4.28),H(5.14),S(6.0),K(6.85),H(7.71),K(8.57),S(9.42),H(10.28),K(11.14),H(12.0),S(12.85),K(13.71),H(14.57),K(15.42),S(16.28),H(17.14),K(18.0),H(18.85),S(19.71),K(20.57),H(21.42),K(22.28),S(23.14),H(24.0),K(24.85),H(25.71),S(26.57),K(27.42),H(28.28),K(29.14),S(30.0)],
  filter:[{t:0,f:300},{t:6,f:1100},{t:12,f:450},{t:18,f:1300},{t:24,f:400},{t:30,f:900}]
};

// CHAPTER 4
TRACKS.chapter4 = { duration:30, loop:true,
  sections:[
    {type:'sawtooth',vol:0.045,notes:[N('C3',150),N('F3',150),N('G3',150),N('Ab3',150),N('Bb3',150),N('C4',150),N('Bb3',150),N('Ab3',150),N('G3',150),N('F3',150),N('Eb3',150),N('C3',150),N('F3',150),N('Ab3',150),N('C4',150),N('Eb4',300),R(150)]},
    {type:'square',vol:0.065,notes:[N('F4',140),N('G4',140),N('Ab4',140),N('Bb4',140),N('C5',140),N('Bb4',140),N('Ab4',140),N('G4',140),N('F4',140),N('Eb4',140),N('C4',140),N('Ab3',140),N('G3',140),N('Ab3',140),N('Bb3',140),N('C4',280),R(140),N('C4',140),N('Db4',140),N('Eb4',140),N('F4',140),N('G4',140),N('Ab4',140),N('G4',140),N('F4',280),R(140)]}
  ],
  bass:{type:'triangle',vol:0.11,notes:[N('C2',600),N('F2',600),N('G2',600),N('Ab2',600),N('Bb2',600),N('C3',600),N('Bb2',600),N('Ab2',600),N('F2',560),N('C3',560),N('F3',560),N('Ab3',560),N('G2',560),N('Bb2',560),N('Db3',560),N('G3',560),N('C2',600),N('F2',600),N('C3',600),N('F3',600),R(300)]},
  percussion:[K(0),K(0.81),H(1.62),S(2.43),K(3.24),H(4.05),K(4.86),S(5.67),K(6.48),K(7.29),H(8.10),S(8.91),K(9.72),H(10.53),K(11.34),S(12.15),K(12.96),K(13.77),H(14.58),S(15.39),K(16.20),H(17.01),K(17.82),S(18.63),K(19.44),K(20.25),H(21.06),S(21.87),K(22.68),H(23.49),K(24.30),S(25.11),K(25.92),H(26.73),K(27.54),S(28.35)],
  filter:[{t:0,f:350},{t:6,f:1100},{t:12,f:500},{t:18,f:1300},{t:24,f:450},{t:28,f:800}]
};

// BOSS 1 - CRABTRON
TRACKS.boss_crabtron = { duration:38, loop:true,
  sections:[
    {type:'sawtooth',vol:0.05,notes:[N('C2',200),N('C2',200),N('C2',200),R(100),N('Eb2',200),N('Eb2',200),N('Eb2',200),R(100),N('F2',200),N('F2',200),N('F2',200),R(100),N('G2',200),N('G2',200),N('G2',200),R(100),N('C3',200),N('C3',200),N('Eb3',200),R(100),N('F3',200),N('F3',200),N('G3',200),R(100),N('C3',300),N('Eb3',300),N('G3',300),N('C4',400),R(200)]},
    {type:'square',vol:0.065,notes:[N('Eb3',180),N('G3',180),N('C4',180),N('Eb4',180),N('D4',180),N('C4',180),N('Bb3',180),N('G3',180),N('F3',180),N('Ab3',180),N('C4',180),N('F4',180),N('Eb4',180),N('C4',180),N('Ab3',180),N('F3',180),N('C3',200),N('Eb3',200),N('G3',200),N('C4',300),N('Eb4',200),N('D4',200),N('C4',300),R(120)]}
  ],
  bass:{type:'triangle',vol:0.12,notes:[N('C1',600),N('C1',600),N('Eb1',600),N('Eb1',600),N('F1',600),N('F1',600),N('G1',600),N('G1',600),N('C1',400),R(200),N('Eb1',400),R(200),N('F1',400),R(200),N('G1',400),R(200),N('C1',600),N('C1',600),N('G1',600),N('C1',1200),R(600)]},
  percussion:[K(0),K(0.84),K(1.68),S(2.52),K(3.36),K(4.20),K(5.04),S(5.88),K(6.72),K(7.56),K(8.40),S(9.24),K(10.08),K(10.92),K(11.76),S(12.60),K(13.44),H(14.28),K(15.12),S(15.96),K(16.80),H(17.64),K(18.48),S(19.32),K(20.16),K(21.0),H(21.84),S(22.68),K(23.52),H(24.36),K(25.20),S(26.04),K(26.88),H(27.72),K(28.56),S(29.40),K(30.24),K(31.08),H(31.92),S(32.76),K(33.60),H(34.44),K(35.28),S(36.12)],
  filter:[{t:0,f:250},{t:6,f:600},{t:12,f:350},{t:18,f:800},{t:24,f:300},{t:30,f:700},{t:36,f:400}]
};

// BOSS 2 - SERPENTRIX
TRACKS.boss_serpentrix = { duration:35, loop:true,
  sections:[
    {type:'sine',vol:0.06,notes:[N('F3',160),N('Gb3',160),N('G3',160),N('Ab3',160),N('G3',160),N('Gb3',160),N('F3',160),N('Eb3',160),N('Db3',160),N('Eb3',160),N('F3',160),N('G3',160),N('Ab3',160),N('G3',160),N('F3',160),N('Eb3',320),R(160)]},
    {type:'sawtooth',vol:0.04,notes:[N('C4',120),N('Db4',120),N('C4',120),N('Bb3',120),N('Ab3',120),N('G3',120),N('Ab3',120),N('Bb3',120),N('C4',120),N('Db4',120),N('Eb4',120),N('Db4',120),N('C4',120),N('Bb3',120),N('Ab3',120),N('G3',120),N('F3',120),N('G3',120),N('Ab3',120),N('Bb3',120),N('C4',120),N('Bb3',120),N('Ab3',120),N('G3',120),N('F3',120),N('Eb3',120),N('F3',120),N('G3',240),R(120)]}
  ],
  bass:{type:'triangle',vol:0.10,notes:[N('F2',480),R(80),N('G2',480),R(80),N('Ab2',480),R(80),N('Bb2',480),R(80),N('C3',480),R(80),N('Bb2',480),R(80),N('Ab2',600),N('G2',600),N('F2',600),N('C3',600),R(300),N('Db3',480),N('C3',480),N('Bb2',480),N('Ab2',480),N('G2',480),N('F2',480),N('Eb2',480),N('F2',480),R(240)]},
  percussion:[K(0),H(0.86),S(1.73),H(2.60),K(3.47),H(4.34),S(5.21),H(6.08),K(6.95),H(7.82),S(8.69),H(9.56),K(10.43),H(11.30),S(12.17),H(13.04),K(13.91),H(14.78),S(15.65),H(16.52),K(17.39),H(18.26),S(19.13),H(20.0),K(20.86),H(21.73),S(22.60),H(23.47),K(24.34),H(25.21),S(26.08),H(26.95),K(27.82),H(28.69),S(29.56),H(30.43),K(31.30),H(32.17),S(33.04)],
  filter:[{t:0,f:400},{t:5,f:1000},{t:10,f:350},{t:15,f:900},{t:20,f:300},{t:25,f:1100},{t:30,f:500},{t:34,f:800}]
};

// BOSS 3 - ORBITAL
TRACKS.boss_orbital = { duration:36, loop:true,
  sections:[
    {type:'sine',vol:0.07,notes:[N('C3',220),N('Eb3',220),N('G3',220),N('C4',220),N('Eb4',220),N('C4',220),N('G3',220),N('Eb3',220),N('C3',220),N('Eb3',220),N('G3',220),N('C4',220),N('Eb4',220),N('C4',220),N('G3',220),N('Eb3',220)]},
    {type:'triangle',vol:0.05,notes:[N('G3',200),N('B3',200),N('D4',200),N('G4',200),N('D4',200),N('B3',200),N('G3',200),N('D3',200),N('Ab3',200),N('C4',200),N('Eb4',200),N('Ab4',200),N('Eb4',200),N('C4',200),N('Ab3',200),N('Eb3',200),N('F3',220),N('Ab3',220),N('C4',220),N('F4',220),N('Ab4',220),N('F4',220),N('C4',220),N('Ab3',220),N('G3',300),N('C4',300),N('Eb4',300),N('G4',400),R(200)]}
  ],
  bass:{type:'sine',vol:0.10,notes:[N('C2',880),R(110),N('Eb2',880),R(110),N('G2',880),R(110),N('C3',880),R(110),N('G2',800),N('D3',800),N('G3',800),N('D3',800),N('Ab2',800),N('Eb3',800),N('Ab3',800),N('Eb3',800),N('F2',880),N('C3',880),N('F3',880),N('C3',880),N('C2',900),N('G2',900),N('C3',900),N('G2',900),R(400)]},
  percussion:[K(0),H(0.88),H(1.76),S(2.64),K(3.52),H(4.40),H(5.28),S(6.16),K(7.04),H(7.92),H(8.80),S(9.68),K(10.56),H(11.44),H(12.32),S(13.20),K(14.08),H(14.96),H(15.84),S(16.72),K(17.60),H(18.48),H(19.36),S(20.24),K(21.12),H(22.0),H(22.88),S(23.76),K(24.64),H(25.52),H(26.40),S(27.28),K(28.16),H(29.04),H(29.92),S(30.80),K(31.68),H(32.56),S(33.44),H(34.32)],
  filter:[{t:0,f:500},{t:4,f:600},{t:8,f:500},{t:12,f:700},{t:16,f:450},{t:20,f:800},{t:24,f:400},{t:28,f:750},{t:32,f:500},{t:35,f:650}]
};

// BOSS 4 - EMPERADOR
TRACKS.boss_emperador = { duration:40, loop:true,
  sections:[
    {type:'sawtooth',vol:0.04,notes:[N('C2',800),N('Eb2',800),N('G2',800),N('C3',800),R(400),N('C2',600),N('Eb2',600),N('F2',600),N('G2',600),R(400)]},
    {type:'square',vol:0.06,notes:[N('C3',150),N('Eb3',150),N('G3',150),N('C4',150),N('Eb4',150),N('D4',150),N('C4',150),N('Bb3',150),N('G3',150),N('Ab3',150),N('G3',150),N('F3',150),N('Eb3',150),N('C3',150),N('Eb3',150),N('G3',300),R(150),N('Ab3',150),N('C4',150),N('Eb4',150),N('Ab4',150),N('G4',150),N('F4',150),N('Eb4',150),N('C4',150),N('Bb3',150),N('C4',150),N('Bb3',150),N('Ab3',150),N('G3',150),N('F3',150),N('Eb3',150),N('C3',300),R(150)]},
    {type:'sawtooth',vol:0.05,notes:[N('G3',130),N('Ab3',130),N('Bb3',130),N('C4',130),N('Db4',130),N('Eb4',130),N('F4',130),N('G4',130),N('Ab4',130),N('G4',130),N('F4',130),N('Eb4',130),N('Db4',130),N('C4',130),N('Bb3',130),N('C4',260),R(130),N('C3',140),N('D3',140),N('Eb3',140),N('F3',140),N('G3',140),N('Ab3',140),N('Bb3',140),N('C4',140),N('D4',140),N('Eb4',140),N('F4',140),N('G4',280),R(140)]}
  ],
  bass:{type:'triangle',vol:0.13,notes:[N('C1',800),R(200),N('Eb1',800),R(200),N('F1',600),R(200),N('G1',600),R(200),N('C1',600),N('Eb1',600),N('G1',600),N('C2',600),N('F1',600),N('Ab1',600),N('C2',600),N('Eb2',600),N('Ab1',520),N('C2',520),N('Eb2',520),N('Ab2',520),N('G1',520),N('Bb1',520),N('D2',520),N('G2',520),N('C1',600),N('C2',600),N('G1',600),N('C2',1200),R(600)]},
  percussion:[K(0),K(0.77),H(1.54),S(2.31),K(3.08),H(3.85),K(4.62),S(5.39),K(6.16),K(6.93),H(7.70),S(8.47),K(9.24),H(10.01),K(10.78),S(11.55),K(12.32),K(13.09),H(13.86),S(14.63),K(15.40),H(16.17),K(16.94),S(17.71),K(18.48),K(19.25),H(20.02),S(20.79),K(21.56),H(22.33),K(23.10),S(23.87),K(24.64),H(25.41),K(26.18),S(26.95),K(27.72),H(28.49),K(29.26),S(30.03),K(30.80),K(31.57),H(32.34),S(33.11),K(33.88),H(34.65),K(35.42),S(36.19),K(36.96),H(37.73),S(38.5)],
  filter:[{t:0,f:200},{t:5,f:400},{t:10,f:700},{t:15,f:500},{t:20,f:900},{t:25,f:400},{t:30,f:1000},{t:35,f:500},{t:38,f:300}]
};

// VICTORY
TRACKS.victory = { duration:22, loop:false,
  sections:[
    {type:'square',vol:0.07,notes:[N('C4',300),N('C4',300),N('C4',300),N('C4',500),N('G3',400),N('A3',400),N('C4',600),R(300),N('C4',250),N('D4',250),N('E4',250),N('F4',300),N('G4',500),N('E4',300),N('G4',800),R(400),N('A4',250),N('G4',250),N('F4',250),N('E4',250),N('D4',250),N('E4',250),N('C4',800),R(500),N('G4',350),N('G4',350),N('A4',600),N('G4',350),N('F4',350),N('E4',600),N('C4',400),N('E4',400),N('G4',400),N('C4',1200),R(1000)]}
  ],
  bass:{type:'triangle',vol:0.10,notes:[N('C3',600),N('G2',600),N('C3',600),N('G3',600),R(500),N('C3',500),N('G2',500),N('E3',500),N('G3',1000),R(500),N('F3',500),N('C3',500),N('F3',500),N('A3',600),N('G3',600),N('E3',600),N('C3',600),N('G3',1200),R(1000),N('C3',800),N('G2',800),N('E3',800),N('C4',2000),R(800)]},
  percussion:[K(0),S(1.3),K(2.6),S(3.9),K(5.2),S(6.5),K(7.8),S(9.1),K(10.4),S(11.7),K(13.0),S(14.3),K(15.6),S(16.9),K(18.2),S(19.5),K(20.2),S(21.0)],
  filter:[{t:0,f:500},{t:5,f:1200},{t:10,f:800},{t:15,f:2000},{t:20,f:600}]
};

// GAMEOVER
TRACKS.gameover = { duration:18, loop:false,
  sections:[
    {type:'triangle',vol:0.07,notes:[N('C4',500),N('B3',450),N('A3',450),N('G3',450),N('F3',450),N('E3',450),N('D3',450),N('C3',900),R(600),N('E3',500),N('D3',450),N('C3',450),N('B2',450),N('A2',500),N('G2',500),N('F2',500),N('C2',1200),R(800),N('C2',600),N('G2',600),N('C3',600),N('G2',600),N('Eb3',800),N('D3',800),N('C3',2000),R(1500)]}
  ],
  bass:{type:'sine',vol:0.08,notes:[N('C2',1000),N('G2',1000),N('F2',1000),N('C2',1000),R(800),N('A1',900),N('E2',900),N('A1',900),N('G1',900),R(800),N('C1',1200),N('G1',1200),N('C1',2400),R(2000)]},
  percussion:[K(0),S(2.0),K(4.0),S(6.0),K(8.0),S(10.0),K(12.0),S(14.0)],
  filter:[{t:0,f:800},{t:4,f:600},{t:8,f:400},{t:12,f:250},{t:16,f:150}]
};

// =====================
// BUILD ALL
// =====================

var trackNames = ['menu','chapter1','chapter2','chapter3','chapter4',
                  'boss_crabtron','boss_serpentrix','boss_orbital','boss_emperador',
                  'victory','gameover'];

console.log('HC-AUD-04: Building soundtrack WAV assets...\n');

for (var i = 0; i < trackNames.length; i++) {
  var name = trackNames[i];
  var data = TRACKS[name];
  if (data) {
    renderTrackToWav(data, 'music_' + name + '.wav');
  }
}

console.log('\nDone. ' + trackNames.length + ' tracks generated.');
console.log('Output: www/assets/audio/');
