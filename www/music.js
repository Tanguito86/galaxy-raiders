// =====================
// GALAXY RAIDERS - music.js
// HC-AUD-01: Routed through master bus, OGG-ready
// =====================

// --- MUSIC SYSTEM (8-BIT TRACKER) ---
const NOTES = {
  C2: 65.41, Db2: 69.30, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, Gb2: 92.50, G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
  C3: 130.81, Db3: 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Gb3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Gb4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16
};

const MUSIC_DATA = {
  normal: [
    // MelodÃ­a estilo Space Invaders mejorada
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'C2', l: 150 }, { n: 0, l: 50 },
    
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    { n: 'G2', l: 150 }, { n: 0, l: 50 },
    { n: 'G2', l: 300 }, { n: 0, l: 100 },
    
    { n: 'C2', l: 150 }, { n: 0, l: 50 },
    { n: 'C2', l: 150 }, { n: 0, l: 50 },
    { n: 'G2', l: 150 }, { n: 0, l: 50 },
    { n: 'E2', l: 150 }, { n: 0, l: 50 },
    
    { n: 'D2', l: 150 }, { n: 0, l: 50 },
    { n: 'D2', l: 150 }, { n: 0, l: 50 },
    { n: 'B2', l: 300 }, { n: 0, l: 100 }
  ],
  
  boss: [
    // Tema boss mÃ¡s agresivo y rÃ¡pido
    { n: 'C3', l: 80 }, { n: 'C3', l: 80 }, { n: 'C3', l: 80 }, { n: 0, l: 80 },
    { n: 'E3', l: 80 }, { n: 'E3', l: 80 }, { n: 'E3', l: 80 }, { n: 0, l: 80 },
    
    { n: 'F3', l: 80 }, { n: 'F3', l: 80 }, { n: 'F3', l: 80 }, { n: 0, l: 80 },
    { n: 'A3', l: 80 }, { n: 'A3', l: 80 }, { n: 'G3', l: 160 }, { n: 0, l: 80 },
    
    { n: 'C4', l: 80 }, { n: 0, l: 40 }, { n: 'B3', l: 80 }, { n: 0, l: 40 },
    { n: 'A3', l: 80 }, { n: 0, l: 40 }, { n: 'G3', l: 80 }, { n: 0, l: 40 },
    
    { n: 'F3', l: 160 }, { n: 0, l: 80 }, { n: 'E3', l: 160 }, { n: 0, l: 80 }
  ], 
  
  menu: [
    // Intro Ã©pica espacial
    { n: 'C3', l: 400 }, { n: 0, l: 100 },
    { n: 'G3', l: 400 }, { n: 0, l: 100 },
    { n: 'C4', l: 600 }, { n: 0, l: 200 },
    
    // Secuencia ascendente
    { n: 'E3', l: 300 }, { n: 'G3', l: 300 }, { n: 'C4', l: 300 }, { n: 'E4', l: 600 },
    { n: 0, l: 200 },
    
    // CaÃ­da dramÃ¡tica
    { n: 'D4', l: 400 }, { n: 'B3', l: 400 }, { n: 'G3', l: 400 }, { n: 'E3', l: 600 },
    { n: 0, l: 200 },
    
    // ResoluciÃ³n espacial
    { n: 'F3', l: 300 }, { n: 'A3', l: 300 }, { n: 'C4', l: 300 }, { n: 'F4', l: 800 },
    { n: 0, l: 400 },
    
    // Final Ã©pico
    { n: 'G3', l: 200 }, { n: 'A3', l: 200 }, { n: 'B3', l: 200 }, { n: 'C4', l: 400 },
    { n: 'E4', l: 400 }, { n: 'C4', l: 800 },
    { n: 0, l: 600 }
  ],
  
  gameover: [
    // MelodÃ­a dramÃ¡tica de game over (corta)
    { n: 'C4', l: 400 }, { n: 'B3', l: 400 }, { n: 'A3', l: 400 }, { n: 'G3', l: 400 },
    { n: 'F3', l: 400 }, { n: 'E3', l: 400 }, { n: 'D3', l: 400 }, { n: 'C3', l: 800 },
    { n: 0, l: 400 }
  ],
  victory: [
    // Fanfarria triunfal Ã©pica
    { n: 'C4', l: 200 }, { n: 'C4', l: 200 }, { n: 'C4', l: 200 }, { n: 'C4', l: 400 },
    { n: 'G3', l: 400 }, { n: 'A3', l: 400 }, { n: 'C4', l: 600 },
    { n: 0, l: 200 },
    { n: 'C4', l: 200 }, { n: 'D4', l: 200 }, { n: 'E4', l: 200 }, { n: 'F4', l: 200 },
    { n: 'G4', l: 600 }, { n: 'E4', l: 300 }, { n: 'G4', l: 800 },
    { n: 0, l: 300 },
    { n: 'A4', l: 200 }, { n: 'G4', l: 200 }, { n: 'F4', l: 200 }, { n: 'E4', l: 200 },
    { n: 'D4', l: 200 }, { n: 'E4', l: 200 }, { n: 'C4', l: 800 },
    { n: 0, l: 400 },
    { n: 'G4', l: 300 }, { n: 'G4', l: 300 }, { n: 'A4', l: 600 },
    { n: 'G4', l: 300 }, { n: 'F4', l: 300 }, { n: 'E4', l: 600 },
    { n: 'C4', l: 400 }, { n: 'E4', l: 400 }, { n: 'G4', l: 400 }, { n: 'C4', l: 1000 },
    { n: 0, l: 500 }
  ],

  // --- CHAPTER & BOSS THEMES (dual-layer: bass + lead) ---
  chapter1: {
    bpm: 125,
    bass: [
      { n: 'C2', l: 500 }, { n: 0, l: 50 }, { n: 'G2', l: 500 }, { n: 'C3', l: 500 },
      { n: 'F2', l: 500 }, { n: 0, l: 50 }, { n: 'C2', l: 400 }, { n: 'G2', l: 400 }
    ],
    lead: [
      { n: 'C3', l: 180 }, { n: 'E3', l: 180 }, { n: 'G3', l: 180 }, { n: 'E3', l: 180 },
      { n: 'C3', l: 180 }, { n: 'E3', l: 180 }, { n: 'G3', l: 200 }, { n: 'C4', l: 200 },
      { n: 'C4', l: 170 }, { n: 'B3', l: 170 }, { n: 'G3', l: 170 }, { n: 'E3', l: 170 },
      { n: 'D3', l: 180 }, { n: 'E3', l: 180 }, { n: 'F3', l: 200 }, { n: 'G3', l: 200 }
    ]
  },

  boss1: {
    bpm: 140,
    bass: [
      { n: 'C2', l: 450 }, { n: 'C2', l: 450 }, { n: 'Eb2', l: 450 }, { n: 'Eb2', l: 450 },
      { n: 'F2', l: 450 }, { n: 'F2', l: 450 }, { n: 'G2', l: 400 }, { n: 'G2', l: 400 }
    ],
    lead: [
      { n: 'C3', l: 140 }, { n: 'C3', l: 140 }, { n: 'Eb3', l: 140 }, { n: 'Eb3', l: 140 },
      { n: 'G3', l: 140 }, { n: 'G3', l: 140 }, { n: 'F3', l: 140 }, { n: 'F3', l: 140 },
      { n: 'Eb3', l: 140 }, { n: 'Eb3', l: 140 }, { n: 'D3', l: 140 }, { n: 'D3', l: 140 },
      { n: 'C3', l: 160 }, { n: 'Eb3', l: 160 }, { n: 'G3', l: 160 }, { n: 'C4', l: 220 }
    ]
  },

  chapter2: {
    bpm: 130,
    bass: [
      { n: 'F2', l: 480 }, { n: 'C3', l: 480 }, { n: 0, l: 50 }, { n: 'F2', l: 480 },
      { n: 'Ab2', l: 480 }, { n: 'Eb3', l: 480 }, { n: 0, l: 50 }, { n: 'Ab2', l: 480 }
    ],
    lead: [
      { n: 'F3', l: 170 }, { n: 'A3', l: 170 }, { n: 'C4', l: 170 }, { n: 'A3', l: 170 },
      { n: 'F3', l: 170 }, { n: 'A3', l: 170 }, { n: 'C4', l: 190 }, { n: 'F4', l: 190 },
      { n: 'Eb4', l: 160 }, { n: 'C4', l: 160 }, { n: 'A3', l: 160 }, { n: 'F3', l: 160 },
      { n: 'G3', l: 170 }, { n: 'A3', l: 170 }, { n: 'C4', l: 190 }, { n: 'D4', l: 190 }
    ]
  },

  boss2: {
    bpm: 145,
    bass: [
      { n: 'F2', l: 430 }, { n: 0, l: 50 }, { n: 'G2', l: 430 }, { n: 0, l: 50 },
      { n: 'Ab2', l: 430 }, { n: 0, l: 50 }, { n: 'Bb2', l: 400 }, { n: 'C3', l: 400 }
    ],
    lead: [
      { n: 'F3', l: 130 }, { n: 'F3', l: 130 }, { n: 'Ab3', l: 130 }, { n: 'Ab3', l: 130 },
      { n: 'C4', l: 130 }, { n: 'C4', l: 130 }, { n: 'Bb3', l: 130 }, { n: 'Bb3', l: 130 },
      { n: 'Ab3', l: 130 }, { n: 'Ab3', l: 130 }, { n: 'G3', l: 130 }, { n: 'G3', l: 130 },
      { n: 'F3', l: 150 }, { n: 'G3', l: 150 }, { n: 'Ab3', l: 150 }, { n: 'C4', l: 220 }
    ]
  },

  chapter3: {
    bpm: 125,
    bass: [
      { n: 'C2', l: 500 }, { n: 0, l: 50 }, { n: 'Db2', l: 500 }, { n: 0, l: 50 },
      { n: 'Eb2', l: 500 }, { n: 0, l: 50 }, { n: 'F2', l: 400 }, { n: 'G2', l: 400 }
    ],
    lead: [
      { n: 'C3', l: 180 }, { n: 'Db3', l: 180 }, { n: 'Eb3', l: 180 }, { n: 'Db3', l: 180 },
      { n: 'C3', l: 180 }, { n: 'Db3', l: 180 }, { n: 'Eb3', l: 200 }, { n: 'F3', l: 200 },
      { n: 'Gb3', l: 170 }, { n: 'F3', l: 170 }, { n: 'Eb3', l: 170 }, { n: 'Db3', l: 170 },
      { n: 'C3', l: 180 }, { n: 'Db3', l: 180 }, { n: 'Eb3', l: 200 }, { n: 'F3', l: 200 }
    ]
  },

  boss3: {
    bpm: 145,
    bass: [
      { n: 'C2', l: 430 }, { n: 0, l: 50 }, { n: 'Eb2', l: 430 }, { n: 0, l: 50 },
      { n: 'F2', l: 430 }, { n: 0, l: 50 }, { n: 'Ab2', l: 400 }, { n: 'Bb2', l: 400 }
    ],
    lead: [
      { n: 'C3', l: 130 }, { n: 'Eb3', l: 130 }, { n: 'G3', l: 130 }, { n: 'Bb3', l: 130 },
      { n: 'C4', l: 130 }, { n: 'Bb3', l: 130 }, { n: 'G3', l: 130 }, { n: 'Eb3', l: 130 },
      { n: 'C3', l: 130 }, { n: 'Eb3', l: 130 }, { n: 'Ab3', l: 130 }, { n: 'G3', l: 130 },
      { n: 'F3', l: 150 }, { n: 'Eb3', l: 150 }, { n: 'D3', l: 150 }, { n: 'C3', l: 220 }
    ]
  },

  chapter4: {
    bpm: 140,
    bass: [
      { n: 'C2', l: 450 }, { n: 'F2', l: 450 }, { n: 'G2', l: 450 }, { n: 0, l: 50 },
      { n: 'C3', l: 450 }, { n: 'F3', l: 450 }, { n: 'Ab2', l: 400 }, { n: 'G2', l: 400 }
    ],
    lead: [
      { n: 'C3', l: 160 }, { n: 'F3', l: 160 }, { n: 'G3', l: 160 }, { n: 'F3', l: 160 },
      { n: 'C3', l: 160 }, { n: 'F3', l: 160 }, { n: 'Ab3', l: 180 }, { n: 'G3', l: 180 },
      { n: 'C4', l: 150 }, { n: 'Bb3', l: 150 }, { n: 'Ab3', l: 150 }, { n: 'G3', l: 150 },
      { n: 'F3', l: 160 }, { n: 'G3', l: 160 }, { n: 'Ab3', l: 180 }, { n: 'Bb3', l: 180 }
    ]
  },

  finalBoss: {
    bpm: 155,
    bass: [
      { n: 'C2', l: 410 }, { n: 'C2', l: 410 }, { n: 'Eb2', l: 410 }, { n: 'C2', l: 410 },
      { n: 'F2', l: 410 }, { n: 'Eb2', l: 410 }, { n: 'G2', l: 380 }, { n: 'F2', l: 380 }
    ],
    lead: [
      { n: 'C3', l: 130 }, { n: 'Eb3', l: 130 }, { n: 'G3', l: 130 }, { n: 'C4', l: 150 },
      { n: 'Eb4', l: 130 }, { n: 'D4', l: 130 }, { n: 'C4', l: 130 }, { n: 'Bb3', l: 130 },
      { n: 'G3', l: 130 }, { n: 'Ab3', l: 130 }, { n: 'G3', l: 130 }, { n: 'F3', l: 130 },
      { n: 'Eb3', l: 140 }, { n: 'C3', l: 140 }, { n: 'Eb3', l: 140 }, { n: 'G3', l: 200 }
    ]
  }

};

let musicInterval = null;
let musicBassInterval = null;
let musicIndex = 0;
let musicBassIndex = 0;
let currentTrack = 'normal';
let isMuted = false;
let menuMusicStarted = false; // âœ… Nueva variable
let musicBusGain = null;
let musicDuckUntil = 0;
let musicDuckLevel = 1.0;

function getMusicDuckingConfig() {
  if (typeof MUSIC_DUCKING !== 'undefined') return MUSIC_DUCKING;
  return {
    baseGain: 1.0,
    minLevel: 0.20,
    defaultLevel: 0.60,
    defaultMs: 140,
    attackMs: 20,
    releaseMs: 140
  };
}

function ensureMusicBus() {
  if (!AC) return false;
  if (musicBusGain) return true;

  var mix = getMusicDuckingConfig();
  musicBusGain = AC.createGain();
  musicBusGain.gain.value = mix.baseGain;

  // Route through audioBuses.master if available, else fallback to destination
  var dest = (typeof audioBuses !== 'undefined' && audioBuses && audioBuses.music) ? audioBuses.music : AC.destination;
  musicBusGain.connect(dest);
  return true;
}

function applyMusicBusGain(level, rampMs) {
  if (!AC || !musicBusGain) return;
  const mix = getMusicDuckingConfig();
  const t = AC.currentTime;
  const target = Math.max(0.0001, level * mix.baseGain);
  const rampSec = Math.max(0.002, (rampMs || 12) / 1000);

  musicBusGain.gain.cancelScheduledValues(t);
  musicBusGain.gain.setValueAtTime(Math.max(0.0001, musicBusGain.gain.value), t);
  musicBusGain.gain.exponentialRampToValueAtTime(target, t + rampSec);
}

function refreshMusicDucking() {
  if (!AC || !ensureMusicBus()) return;
  var mix = getMusicDuckingConfig();

  if (isMuted) {
    applyMusicBusGain(0.0001, mix.attackMs);
    return;
  }

  var now = AC.currentTime;
  var duckingActive = now < musicDuckUntil;
  var targetLevel = duckingActive ? musicDuckLevel : 1.0;
  if (!duckingActive) musicDuckLevel = 1.0;

  applyMusicBusGain(targetLevel, duckingActive ? mix.attackMs : mix.releaseMs);

  // Also refresh bus-level ducking from audio-bus.js
  if (typeof refreshBusDucking === 'function') refreshBusDucking();
}

function requestMusicDuck(ms, level) {
  initAudio();
  if (!AC || isMuted || !ensureMusicBus()) return;

  var mix = getMusicDuckingConfig();
  var now = AC.currentTime;
  var duckMs = Math.max(0, Number(ms ?? mix.defaultMs) || mix.defaultMs);
  var duckLevel = Math.max(mix.minLevel, Math.min(1.0, Number(level ?? mix.defaultLevel) || mix.defaultLevel));

  if (now >= musicDuckUntil) musicDuckLevel = 1.0;
  musicDuckLevel = Math.min(musicDuckLevel, duckLevel);
  musicDuckUntil = Math.max(musicDuckUntil, now + duckMs / 1000);
  refreshMusicDucking();
}


function playMusicNote(freq, length) {
  if (isMuted || !AC || !ensureMusicBus()) return;
  refreshMusicDucking();
  const osc = AC.createOscillator();
  const gain = AC.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, AC.currentTime);
  gain.gain.setValueAtTime(0.08, AC.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, AC.currentTime + length / 1000);
  osc.connect(gain);
  gain.connect(musicBusGain);
  osc.start();
  osc.stop(AC.currentTime + length / 1000);
}

function playBassNote(freq, length) {
  if (isMuted || !AC || !ensureMusicBus()) return;
  const osc = AC.createOscillator();
  const gain = AC.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, AC.currentTime);
  gain.gain.setValueAtTime(0.06, AC.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + length / 1000 + 0.01);
  osc.connect(gain);
  gain.connect(musicBusGain);
  osc.start();
  osc.stop(AC.currentTime + length / 1000 + 0.015);
}

function playLeadNote(freq, length) {
  if (isMuted || !AC || !ensureMusicBus()) return;
  const osc = AC.createOscillator();
  const gain = AC.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, AC.currentTime);
  gain.gain.setValueAtTime(0.04, AC.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + length / 1000 + 0.01);
  osc.connect(gain);
  gain.connect(musicBusGain);
  osc.start();
  osc.stop(AC.currentTime + length / 1000 + 0.015);
}

function getMusicThemeForLevel(lvl, isBoss) {
  if (isBoss) {
    // HC-AUD-03: Per-boss identity mapping
    var identityTrack = getBossIdentityTrack();
    if (identityTrack) return identityTrack;
    // Level-based fallback
    if (lvl >= 20) return 'finalBoss';
    if (lvl >= 15) return 'boss3';
    if (lvl >= 10) return 'boss2';
    return 'boss1';
  }
  if (lvl >= 16) return 'chapter4';
  if (lvl >= 11) return 'chapter3';
  if (lvl >= 6)  return 'chapter2';
  return 'chapter1';
}

// HC-AUD-03: Map boss pattern to musical identity
function getBossIdentityTrack() {
  if (typeof boss === 'undefined' || !boss || !boss.pattern) return null;
  switch (boss.pattern) {
    case 'crossfire': return 'boss1';   // CRABTRON — industrial
    case 'zigzag':    return 'boss2';   // SERPENTRIX — unstable
    case 'rotate':    return 'boss3';   // ORBITAL — cold pulse
    case 'supreme':   return 'finalBoss'; // EMPERADOR — oppressive
    case 'divebomb':  return 'boss2';   // TENIENTE — shares SERPENTRIX theme
    default: return null;
  }
}

function stopAllMusicIntervals() {
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
  if (musicBassInterval) { clearInterval(musicBassInterval); musicBassInterval = null; }
}

function startMusic(trackName) {
  if (isMuted) return;
  initAudio();
  ensureMusicBus();
  refreshMusicDucking();

  // Prefer buffer-based playback (HC-AUD-02)
  if (typeof playMusicFromBuffer === 'function') {
    var used = playMusicFromBuffer(trackName, 300);
    if (used) return;
  }

  // Fallback: legacy tracker
  stopAllMusicIntervals();

  currentTrack = trackName;
  musicIndex = 0;
  musicBassIndex = 0;

  const trackData = MUSIC_DATA[trackName];
  if (!trackData) return;

  // Nuevo formato dual-layer (bass + lead)
  if (trackData.lead) {
    const bpm = trackData.bpm || 130;
    const leadMs = Math.round(60000 / bpm / 2); // 8th note grid
    const bassMs = Math.round(60000 / bpm);      // quarter note grid

    musicInterval = setInterval(function () {
      if (state !== 'playing') {
        stopAllMusicIntervals();
        return;
      }
      refreshMusicDucking();
      const nd = trackData.lead[musicIndex];
      if (nd && nd.n !== 0) playLeadNote(NOTES[nd.n], nd.l);
      musicIndex = (musicIndex + 1) % trackData.lead.length;
    }, leadMs);

    musicBassInterval = setInterval(function () {
      if (state !== 'playing') return;
      refreshMusicDucking();
      const nd = trackData.bass[musicBassIndex];
      if (nd && nd.n !== 0) playBassNote(NOTES[nd.n], nd.l);
      musicBassIndex = (musicBassIndex + 1) % trackData.bass.length;
    }, bassMs);

    return;
  }

  // Legacy format (array)
  const speed = trackName === 'boss' ? 100 : trackName === 'menu' ? 200 : 200;

  musicInterval = setInterval(function () {
    if (trackName === 'menu' && state !== 'menu') {
      stopAllMusicIntervals();
      return;
    }

    if (trackName === 'gameover' && state !== 'gameover') {
      stopAllMusicIntervals();
      return;
    }

    if (trackName !== 'menu' && trackName !== 'gameover' && state !== 'playing') {
      stopAllMusicIntervals();
      return;
    }

    refreshMusicDucking();

    const noteData = trackData[musicIndex];
    if (noteData.n !== 0) playMusicNote(NOTES[noteData.n], noteData.l);
    musicIndex = (musicIndex + 1) % trackData.length;
  }, speed);
}

// --- SFX ---
function playTone(freq, type, duration, vol) {
  if (vol === void 0) vol = 0.1;
  if (!AC || isMuted) return;
  var osc = AC.createOscillator();
  var gain = AC.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, AC.currentTime);
  gain.gain.setValueAtTime(vol, AC.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, AC.currentTime + duration);
  osc.connect(gain);
  ensureMusicBus();
  var dest = musicBusGain || AC.destination;
  gain.connect(dest);
  osc.start();
  osc.stop(AC.currentTime + duration);
}


function playUfoSound() {
  if (!AC || isMuted) return;
  var osc = AC.createOscillator();
  var gain = AC.createGain();
  osc.frequency.setValueAtTime(300, AC.currentTime);
  osc.frequency.linearRampToValueAtTime(600, AC.currentTime + 0.2);
  gain.gain.setValueAtTime(0.05, AC.currentTime);
  gain.gain.linearRampToValueAtTime(0, AC.currentTime + 0.2);
  osc.connect(gain);
  ensureMusicBus();
  var dest = musicBusGain || AC.destination;
  gain.connect(dest);
  osc.start();
  osc.stop(AC.currentTime + 0.2);
}



