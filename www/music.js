// =====================
// GALAXY RAIDERS - music.js
// =====================

// --- MUSIC SYSTEM (8-BIT TRACKER) ---
const NOTES = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00
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
  ]

};

let musicInterval = null;
let musicIndex = 0;
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
    attackMs: 14,
    releaseMs: 120
  };
}

function ensureMusicBus() {
  if (!AC) return false;
  if (musicBusGain) return true;

  const mix = getMusicDuckingConfig();
  musicBusGain = AC.createGain();
  musicBusGain.gain.value = mix.baseGain;
  musicBusGain.connect(AC.destination);
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
  const mix = getMusicDuckingConfig();

  if (isMuted) {
    applyMusicBusGain(0.0001, mix.attackMs);
    return;
  }

  const now = AC.currentTime;
  const duckingActive = now < musicDuckUntil;
  const targetLevel = duckingActive ? musicDuckLevel : 1.0;
  if (!duckingActive) musicDuckLevel = 1.0;

  applyMusicBusGain(targetLevel, duckingActive ? mix.attackMs : mix.releaseMs);
}

function requestMusicDuck(ms, level) {
  initAudio();
  if (!AC || isMuted || !ensureMusicBus()) return;

  const mix = getMusicDuckingConfig();
  const now = AC.currentTime;
  const duckMs = Math.max(0, Number(ms ?? mix.defaultMs) || mix.defaultMs);
  const duckLevel = Math.max(mix.minLevel, Math.min(1.0, Number(level ?? mix.defaultLevel) || mix.defaultLevel));

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

function startMusic(trackName) {
  if (isMuted) return;
  initAudio();
  ensureMusicBus();
  refreshMusicDucking();
  
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  
  currentTrack = trackName;
  musicIndex = 0;
  
  // âœ… Velocidad segÃºn el track
  const speed = trackName === 'boss' ? 100 : trackName === 'menu' ? 200 : 200;

  musicInterval = setInterval(() => {
    // âœ… CondiciÃ³n para cada tipo de mÃºsica
    if (trackName === 'menu' && state !== 'menu') {
      clearInterval(musicInterval);
      musicInterval = null;
      return;
    }
    
    if (trackName === 'gameover' && state !== 'gameover') {
      clearInterval(musicInterval);
      musicInterval = null;
      return;
    }
    
    if (trackName !== 'menu' && trackName !== 'gameover' && state !== 'playing') {
      clearInterval(musicInterval);
      musicInterval = null;
      return;
    }
    
    refreshMusicDucking();

    const noteData = MUSIC_DATA[currentTrack][musicIndex];
    if (noteData.n !== 0) playMusicNote(NOTES[noteData.n], noteData.l);
    musicIndex = (musicIndex + 1) % MUSIC_DATA[currentTrack].length;
  }, speed);
}

// --- SFX ---
function playTone(freq, type, duration, vol = 0.1) {
  if (!AC || isMuted) return;
  const osc = AC.createOscillator();
  const gain = AC.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, AC.currentTime);
  gain.gain.setValueAtTime(vol, AC.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, AC.currentTime + duration);
  osc.connect(gain);
  gain.connect(AC.destination);
  osc.start();
  osc.stop(AC.currentTime + duration);
}


function playUfoSound() {
  if (!AC || isMuted) return;
  const osc = AC.createOscillator();
  const gain = AC.createGain();
  osc.frequency.setValueAtTime(300, AC.currentTime);
  osc.frequency.linearRampToValueAtTime(600, AC.currentTime + 0.2);
  gain.gain.setValueAtTime(0.05, AC.currentTime);
  gain.gain.linearRampToValueAtTime(0, AC.currentTime + 0.2);
  osc.connect(gain);
  gain.connect(AC.destination);
  osc.start();
  osc.stop(AC.currentTime + 0.2);
}



