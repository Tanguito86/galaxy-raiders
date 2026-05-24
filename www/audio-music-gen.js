// =====================
// GALAXY RAIDERS - audio-music-gen.js
// HC-AUD-03: Extended compositions, percussion, filters, boss identity
// Load AFTER music.js, BEFORE audio-engine.js
// =====================

var _musicBuffers = {};
var _currentMusicSource = null;
var _currentMusicGain = null;
var _currentMusicKey = null;
var _musicFadeTimer = null;
var _musicLoopTimer = null;
var _musicPreloadStarted = false;

// =====================
// EXTENDED NOTE REFERENCE (NOTES from music.js + extra)
// =====================
var _N = {};
if (typeof NOTES !== 'undefined') _N = NOTES;

// Helper: build note from midi number
function _mn(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

// =====================
// EXTENDED TRACK DATA — HC-AUD-03
// Each track has: bpm, sections[], percussion[], filter[]
// sections: {name, notes:[{n, l}], type, vol}  — n can be a frequency or a note name
// percussion: {type:'kick'|'snare'|'hat', timeSec}
// filter: {freq, timeSec} — LP filter cutoff automation points
// =====================

var _TRACKS = {};

// --- MENU: Atmospheric space intro + majestic loop (40s) ---
_TRACKS.menu = {
  bpm: 105,
  loop: true,
  duration: 40,
  sections: [
    // Intro — slow build (0-8s)
    { name:'intro', type:'sine', vol:0.07, notes:[
      {n:'C3',l:1200},{n:0,l:200},{n:'G3',l:1200},{n:0,l:200},
      {n:'C4',l:800},{n:0,l:600},{n:'G3',l:600},{n:'C4',l:600},
      {n:'E4',l:1000},{n:0,l:1000}
    ]},
    // A section — main theme (8-22s)
    { name:'main', type:'square', vol:0.055, notes:[
      {n:'E3',l:300},{n:'G3',l:300},{n:'C4',l:300},{n:'E4',l:500},{n:0,l:200},
      {n:'D4',l:300},{n:'B3',l:300},{n:'G3',l:300},{n:'E3',l:500},{n:0,l:200},
      {n:'F3',l:300},{n:'A3',l:300},{n:'C4',l:300},{n:'F4',l:500},{n:0,l:200},
      {n:'E4',l:300},{n:'C4',l:300},{n:'G3',l:300},{n:'C4',l:600},{n:0,l:300},
      {n:'G3',l:250},{n:'A3',l:250},{n:'B3',l:250},{n:'C4',l:350},
      {n:'E4',l:350},{n:'C4',l:700},{n:0,l:350}
    ]},
    // B section — bridge (22-30s)
    { name:'bridge', type:'triangle', vol:0.05, notes:[
      {n:'A3',l:350},{n:'C4',l:350},{n:'E4',l:350},{n:'A4',l:500},{n:0,l:250},
      {n:'G4',l:350},{n:'E4',l:350},{n:'C4',l:350},{n:'A3',l:500},{n:0,l:250},
      {n:'F3',l:300},{n:'A3',l:300},{n:'C4',l:300},{n:'F4',l:400},
      {n:'E4',l:300},{n:'C4',l:300},{n:'A3',l:300},{n:'G3',l:600},{n:0,l:400}
    ]},
    // Outro — return (30-40s)  
    { name:'outro', type:'sine', vol:0.06, notes:[
      {n:'C4',l:600},{n:'E4',l:500},{n:'G4',l:500},{n:'C5',l:800},{n:0,l:600},
      {n:'G4',l:400},{n:'A4',l:400},{n:'B4',l:400},{n:'C5',l:600},
      {n:'E5',l:500},{n:'C5',l:900},{n:0,l:700},
      {n:'F4',l:400},{n:'A4',l:400},{n:'C5',l:400},{n:'F5',l:800},{n:0,l:1000}
    ]}
  ],
  bass: { type:'triangle', vol:0.09, notes:[
    {n:'C2',l:1200},{n:0,l:200},{n:'G2',l:1200},{n:0,l:200},
    {n:'C3',l:800},{n:0,l:600},{n:'G2',l:1000},{n:0,l:1000},
    {n:'C2',l:700},{n:'G2',l:700},{n:'C3',l:700},{n:'E3',l:700},
    {n:'F2',l:700},{n:'C3',l:700},{n:'G2',l:700},{n:'C3',l:1400},{n:0,l:400},
    {n:'A2',l:700},{n:'E3',l:700},{n:'A2',l:700},{n:'C3',l:700},
    {n:'F2',l:600},{n:'A2',l:600},{n:'C3',l:600},{n:'G2',l:600},{n:0,l:400},
    {n:'C2',l:800},{n:'G2',l:800},{n:'C3',l:800},{n:'G2',l:800},{n:0,l:800}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'kick',at:3.2},{t:'kick',at:6.4},{t:'kick',at:8.0},
    {t:'kick',at:11.2},{t:'kick',at:14.4},{t:'hat',at:16.0},{t:'hat',at:17.6},
    {t:'kick',at:19.2},{t:'kick',at:22.4},{t:'snare',at:25.6},{t:'kick',at:28.8},
    {t:'kick',at:30.0},{t:'hat',at:32.0},{t:'hat',at:33.6},{t:'snare',at:35.2},
    {t:'kick',at:36.8},{t:'kick',at:38.4}
  ],
  filter: [
    {t:0,f:300},{t:4,f:800},{t:8,f:1200},{t:16,f:600},{t:22,f:1000},
    {t:28,f:500},{t:32,f:1200},{t:38,f:400}
  ]
};

// --- CHAPTER 1: C minor — mysterious onboarding tension (36s) ---
_TRACKS.chapter1 = {
  bpm: 125, loop:true, duration:36,
  sections: [
    { name:'A', type:'square', vol:0.055, notes:[
      {n:'C3',l:190},{n:'Eb3',l:190},{n:'G3',l:190},{n:'C4',l:190},
      {n:'Eb4',l:190},{n:'G4',l:190},{n:'Eb4',l:190},{n:'C4',l:190},
      {n:'G3',l:190},{n:'Eb3',l:190},{n:'C3',l:190},{n:'Eb3',l:190},
      {n:'F3',l:190},{n:'Ab3',l:190},{n:'C4',l:190},{n:'F4',l:190},
      {n:'Eb4',l:190},{n:'C4',l:190},{n:'Ab3',l:190},{n:'F3',l:190},
      {n:'C3',l:190},{n:'Eb3',l:190},{n:'G3',l:190},{n:'C4',l:380},{n:0,l:190}
    ]},
    { name:'B', type:'triangle', vol:0.045, notes:[
      {n:'G3',l:200},{n:'Ab3',l:200},{n:'G3',l:200},{n:'F3',l:200},
      {n:'Eb3',l:200},{n:'F3',l:200},{n:'G3',l:200},{n:'C4',l:300},{n:0,l:100},
      {n:'Bb3',l:200},{n:'C4',l:200},{n:'Bb3',l:200},{n:'Ab3',l:200},
      {n:'G3',l:200},{n:'Ab3',l:200},{n:'Bb3',l:200},{n:'Eb4',l:300},{n:0,l:100},
      {n:'C4',l:190},{n:'D4',l:190},{n:'Eb4',l:190},{n:'C4',l:190},
      {n:'G3',l:190},{n:'Eb3',l:190},{n:'C3',l:190},{n:'Eb3',l:380},{n:0,l:190}
    ]}
  ],
  bass: { type:'triangle', vol:0.09, notes:[
    {n:'C2',l:760},{n:'Eb2',l:760},{n:'G2',l:760},{n:'C3',l:760},
    {n:'F2',l:760},{n:'Ab2',l:760},{n:'C3',l:760},{n:'F3',l:760},
    {n:'C2',l:760},{n:'Eb2',l:760},{n:'G2',l:760},{n:'C3',l:760},
    {n:'Bb1',l:570},{n:'Bb2',l:570},{n:'Ab2',l:570},{n:'G2',l:570},{n:0,l:190},
    {n:'C2',l:760},{n:'G2',l:760},{n:'C3',l:760},{n:'Eb3',l:760},{n:0,l:380}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'hat',at:0.96},{t:'snare',at:1.92},{t:'hat',at:2.88},
    {t:'kick',at:3.84},{t:'hat',at:4.80},{t:'kick',at:5.76},{t:'hat',at:6.72},
    {t:'kick',at:7.68},{t:'hat',at:8.64},{t:'snare',at:9.60},{t:'hat',at:10.56},
    {t:'kick',at:11.52},{t:'hat',at:12.48},{t:'kick',at:13.44},{t:'snare',at:14.40},
    {t:'kick',at:15.36},{t:'hat',at:16.32},{t:'snare',at:17.28},{t:'hat',at:18.24},
    {t:'kick',at:19.20},{t:'hat',at:20.16},{t:'kick',at:21.12},{t:'snare',at:22.08},
    {t:'kick',at:23.04},{t:'hat',at:24.0},{t:'snare',at:24.96},{t:'hat',at:25.92},
    {t:'kick',at:26.88},{t:'hat',at:27.84},{t:'kick',at:28.80},{t:'snare',at:29.76},
    {t:'kick',at:30.72},{t:'hat',at:31.68},{t:'snare',at:32.64},{t:'hat',at:33.6},{t:'kick',at:34.56}
  ],
  filter: [
    {t:0,f:350},{t:6,f:900},{t:12,f:600},{t:18,f:1100},{t:24,f:500},{t:30,f:800},{t:35,f:400}
  ]
};

// --- CHAPTER 2: F minor — aggressive pressure (34s) ---
_TRACKS.chapter2 = {
  bpm: 130, loop:true, duration:34,
  sections: [
    { name:'A', type:'sawtooth', vol:0.04, notes:[
      {n:'F3',l:170},{n:'Ab3',l:170},{n:'C4',l:170},{n:'F4',l:170},
      {n:'Eb4',l:170},{n:'C4',l:170},{n:'Ab3',l:170},{n:'F3',l:170},
      {n:'G3',l:170},{n:'Bb3',l:170},{n:'Db4',l:170},{n:'G4',l:170},
      {n:'F4',l:170},{n:'Db4',l:170},{n:'Bb3',l:170},{n:'G3',l:170},
      {n:'Ab3',l:170},{n:'C4',l:170},{n:'Eb4',l:170},{n:'Ab4',l:170},
      {n:'G4',l:170},{n:'Eb4',l:170},{n:'C4',l:170},{n:'Ab3',l:340},{n:0,l:170}
    ]},
    { name:'B', type:'square', vol:0.06, notes:[
      {n:'F4',l:160},{n:'Eb4',l:160},{n:'C4',l:160},{n:'Ab3',l:160},
      {n:'G3',l:160},{n:'Bb3',l:160},{n:'Db4',l:160},{n:'F4',l:240},{n:0,l:80},
      {n:'Eb4',l:160},{n:'F4',l:160},{n:'G4',l:160},{n:'Ab4',l:160},
      {n:'Bb4',l:160},{n:'C5',l:160},{n:'Ab4',l:160},{n:'F4',l:240},{n:0,l:80},
      {n:'C4',l:160},{n:'Db4',l:160},{n:'Eb4',l:160},{n:'F4',l:160},
      {n:'G4',l:160},{n:'Ab4',l:160},{n:'G4',l:160},{n:'F4',l:320},{n:0,l:160}
    ]}
  ],
  bass: { type:'triangle', vol:0.10, notes:[
    {n:'F1',l:680},{n:'F2',l:680},{n:'Ab2',l:680},{n:'C3',l:680},
    {n:'G1',l:680},{n:'G2',l:680},{n:'Bb2',l:680},{n:'Db3',l:680},
    {n:'Ab1',l:680},{n:'Ab2',l:680},{n:'C3',l:680},{n:'Eb3',l:680},
    {n:'Bb1',l:510},{n:'Bb2',l:510},{n:'Db3',l:510},{n:'F3',l:510},{n:0,l:170},
    {n:'F2',l:640},{n:'C3',l:640},{n:'F3',l:640},{n:'Ab3',l:640},{n:0,l:320}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'kick',at:0.92},{t:'hat',at:1.84},{t:'snare',at:2.76},
    {t:'kick',at:3.68},{t:'hat',at:4.6},{t:'kick',at:5.52},{t:'snare',at:6.44},
    {t:'kick',at:7.36},{t:'kick',at:8.28},{t:'hat',at:9.2},{t:'snare',at:10.12},
    {t:'kick',at:11.04},{t:'hat',at:11.96},{t:'kick',at:12.88},{t:'snare',at:13.8},
    {t:'kick',at:14.72},{t:'kick',at:15.64},{t:'hat',at:16.56},{t:'snare',at:17.48},
    {t:'kick',at:18.4},{t:'hat',at:19.32},{t:'kick',at:20.24},{t:'snare',at:21.16},
    {t:'kick',at:22.08},{t:'hat',at:23.0},{t:'kick',at:23.92},{t:'snare',at:24.84},
    {t:'kick',at:25.76},{t:'kick',at:26.68},{t:'hat',at:27.6},{t:'snare',at:28.52},
    {t:'kick',at:29.44},{t:'hat',at:30.36},{t:'kick',at:31.28},{t:'snare',at:32.2}
  ],
  filter: [
    {t:0,f:400},{t:8,f:1000},{t:16,f:550},{t:24,f:1200},{t:30,f:450},{t:33,f:700}
  ]
};

// --- CHAPTER 3: chromatic — high-intensity combat (32s) ---
_TRACKS.chapter3 = {
  bpm: 140, loop:true, duration:32,
  sections: [
    { name:'A', type:'sawtooth', vol:0.04, notes:[
      {n:'C3',l:160},{n:'Db3',l:160},{n:'Eb3',l:160},{n:'F3',l:160},
      {n:'Gb3',l:160},{n:'Ab3',l:160},{n:'Bb3',l:160},{n:'C4',l:160},
      {n:'Db4',l:160},{n:'Eb4',l:160},{n:'F4',l:160},{n:'Gb4',l:160},
      {n:'Ab4',l:160},{n:'Bb4',l:160},{n:'C5',l:160},{n:'Db5',l:320},{n:0,l:320}
    ]},
    { name:'B', type:'square', vol:0.06, notes:[
      {n:'G3',l:150},{n:'Ab3',l:150},{n:'Bb3',l:150},{n:'C4',l:150},
      {n:'Db4',l:150},{n:'Eb4',l:150},{n:'F4',l:150},{n:'G4',l:300},{n:0,l:150},
      {n:'F4',l:150},{n:'Eb4',l:150},{n:'Db4',l:150},{n:'C4',l:150},
      {n:'Bb3',l:150},{n:'Ab3',l:150},{n:'G3',l:150},{n:'F3',l:300},{n:0,l:150},
      {n:'Eb3',l:150},{n:'F3',l:150},{n:'G3',l:150},{n:'Ab3',l:150},
      {n:'Bb3',l:150},{n:'C4',l:150},{n:'Db4',l:150},{n:'Eb4',l:300},{n:0,l:150}
    ]}
  ],
  bass: { type:'triangle', vol:0.10, notes:[
    {n:'C2',l:640},{n:0,l:160},{n:'Db2',l:640},{n:0,l:160},
    {n:'Eb2',l:640},{n:0,l:160},{n:'F2',l:640},{n:0,l:160},
    {n:'Gb2',l:640},{n:0,l:160},{n:'Ab2',l:640},{n:0,l:160},
    {n:'Bb2',l:640},{n:0,l:160},{n:'C3',l:1280},{n:0,l:640},
    {n:'G2',l:600},{n:'Ab2',l:600},{n:'Bb2',l:600},{n:'C3',l:600},
    {n:'Db3',l:600},{n:'Eb3',l:600},{n:'F3',l:600},{n:'G3',l:600},{n:0,l:300}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'hat',at:0.85},{t:'kick',at:1.71},{t:'snare',at:2.57},
    {t:'hat',at:3.42},{t:'kick',at:4.28},{t:'hat',at:5.14},{t:'snare',at:6.0},
    {t:'kick',at:6.85},{t:'hat',at:7.71},{t:'kick',at:8.57},{t:'snare',at:9.42},
    {t:'hat',at:10.28},{t:'kick',at:11.14},{t:'hat',at:12.0},{t:'snare',at:12.85},
    {t:'kick',at:13.71},{t:'hat',at:14.57},{t:'kick',at:15.42},{t:'snare',at:16.28},
    {t:'hat',at:17.14},{t:'kick',at:18.0},{t:'hat',at:18.85},{t:'snare',at:19.71},
    {t:'kick',at:20.57},{t:'hat',at:21.42},{t:'kick',at:22.28},{t:'snare',at:23.14},
    {t:'hat',at:24.0},{t:'kick',at:24.85},{t:'hat',at:25.71},{t:'snare',at:26.57},
    {t:'kick',at:27.42},{t:'hat',at:28.28},{t:'kick',at:29.14},{t:'snare',at:30.0}
  ],
  filter: [
    {t:0,f:300},{t:6,f:1100},{t:12,f:450},{t:18,f:1300},{t:24,f:400},{t:30,f:900}
  ]
};

// --- CHAPTER 4: F minor aggressive — late-game escalation (30s) ---
_TRACKS.chapter4 = {
  bpm: 148, loop:true, duration:30,
  sections: [
    { name:'A', type:'sawtooth', vol:0.045, notes:[
      {n:'C3',l:150},{n:'F3',l:150},{n:'G3',l:150},{n:'Ab3',l:150},
      {n:'Bb3',l:150},{n:'C4',l:150},{n:'Bb3',l:150},{n:'Ab3',l:150},
      {n:'G3',l:150},{n:'F3',l:150},{n:'Eb3',l:150},{n:'C3',l:150},
      {n:'F3',l:150},{n:'Ab3',l:150},{n:'C4',l:150},{n:'Eb4',l:300},{n:0,l:150}
    ]},
    { name:'B', type:'square', vol:0.065, notes:[
      {n:'F4',l:140},{n:'G4',l:140},{n:'Ab4',l:140},{n:'Bb4',l:140},
      {n:'C5',l:140},{n:'Bb4',l:140},{n:'Ab4',l:140},{n:'G4',l:140},
      {n:'F4',l:140},{n:'Eb4',l:140},{n:'C4',l:140},{n:'Ab3',l:140},
      {n:'G3',l:140},{n:'Ab3',l:140},{n:'Bb3',l:140},{n:'C4',l:280},{n:0,l:140},
      {n:'C4',l:140},{n:'Db4',l:140},{n:'Eb4',l:140},{n:'F4',l:140},
      {n:'G4',l:140},{n:'Ab4',l:140},{n:'G4',l:140},{n:'F4',l:280},{n:0,l:140}
    ]}
  ],
  bass: { type:'triangle', vol:0.11, notes:[
    {n:'C2',l:600},{n:'F2',l:600},{n:'G2',l:600},{n:'Ab2',l:600},
    {n:'Bb2',l:600},{n:'C3',l:600},{n:'Bb2',l:600},{n:'Ab2',l:600},
    {n:'F2',l:560},{n:'C3',l:560},{n:'F3',l:560},{n:'Ab3',l:560},
    {n:'G2',l:560},{n:'Bb2',l:560},{n:'Db3',l:560},{n:'G3',l:560},
    {n:'C2',l:600},{n:'F2',l:600},{n:'C3',l:600},{n:'F3',l:600},{n:0,l:300}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'kick',at:0.81},{t:'hat',at:1.62},{t:'snare',at:2.43},
    {t:'kick',at:3.24},{t:'hat',at:4.05},{t:'kick',at:4.86},{t:'snare',at:5.67},
    {t:'kick',at:6.48},{t:'kick',at:7.29},{t:'hat',at:8.10},{t:'snare',at:8.91},
    {t:'kick',at:9.72},{t:'hat',at:10.53},{t:'kick',at:11.34},{t:'snare',at:12.15},
    {t:'kick',at:12.96},{t:'kick',at:13.77},{t:'hat',at:14.58},{t:'snare',at:15.39},
    {t:'kick',at:16.20},{t:'hat',at:17.01},{t:'kick',at:17.82},{t:'snare',at:18.63},
    {t:'kick',at:19.44},{t:'kick',at:20.25},{t:'hat',at:21.06},{t:'snare',at:21.87},
    {t:'kick',at:22.68},{t:'hat',at:23.49},{t:'kick',at:24.30},{t:'snare',at:25.11},
    {t:'kick',at:25.92},{t:'hat',at:26.73},{t:'kick',at:27.54},{t:'snare',at:28.35}
  ],
  filter: [
    {t:0,f:350},{t:6,f:1100},{t:12,f:500},{t:18,f:1300},{t:24,f:450},{t:28,f:800}
  ]
};

// --- BOSS 1: CRABTRON — industrial / mechanical / heavy (38s) ---
_TRACKS.boss1 = {
  bpm: 142, loop:true, duration:38,
  identity:'CRABTRON', identityDesc:'industrial mechanical heavy pulse metallic',
  sections: [
    { name:'main', type:'sawtooth', vol:0.05, notes:[
      {n:'C2',l:200},{n:'C2',l:200},{n:'C2',l:200},{n:0,l:100},
      {n:'Eb2',l:200},{n:'Eb2',l:200},{n:'Eb2',l:200},{n:0,l:100},
      {n:'F2',l:200},{n:'F2',l:200},{n:'F2',l:200},{n:0,l:100},
      {n:'G2',l:200},{n:'G2',l:200},{n:'G2',l:200},{n:0,l:100},
      {n:'C3',l:200},{n:'C3',l:200},{n:'Eb3',l:200},{n:0,l:100},
      {n:'F3',l:200},{n:'F3',l:200},{n:'G3',l:200},{n:0,l:100},
      {n:'C3',l:300},{n:'Eb3',l:300},{n:'G3',l:300},{n:'C4',l:400},{n:0,l:200}
    ]},
    { name:'bridge', type:'square', vol:0.065, notes:[
      {n:'Eb3',l:180},{n:'G3',l:180},{n:'C4',l:180},{n:'Eb4',l:180},
      {n:'D4',l:180},{n:'C4',l:180},{n:'Bb3',l:180},{n:'G3',l:180},
      {n:'F3',l:180},{n:'Ab3',l:180},{n:'C4',l:180},{n:'F4',l:180},
      {n:'Eb4',l:180},{n:'C4',l:180},{n:'Ab3',l:180},{n:'F3',l:180},
      {n:'C3',l:200},{n:'Eb3',l:200},{n:'G3',l:200},{n:'C4',l:300},
      {n:'Eb4',l:200},{n:'D4',l:200},{n:'C4',l:300},{n:0,l:120}
    ]}
  ],
  bass: { type:'triangle', vol:0.12, notes:[
    {n:'C1',l:600},{n:'C1',l:600},{n:'Eb1',l:600},{n:'Eb1',l:600},
    {n:'F1',l:600},{n:'F1',l:600},{n:'G1',l:600},{n:'G1',l:600},
    {n:'C1',l:400},{n:0,l:200},{n:'Eb1',l:400},{n:0,l:200},
    {n:'F1',l:400},{n:0,l:200},{n:'G1',l:400},{n:0,l:200},
    {n:'C1',l:600},{n:'C1',l:600},{n:'G1',l:600},{n:'C1',l:1200},{n:0,l:600}
  ]},
  percussion: [
    // Heavy industrial kick pattern
    {t:'kick',at:0},{t:'kick',at:0.84},{t:'kick',at:1.68},{t:'snare',at:2.52},
    {t:'kick',at:3.36},{t:'kick',at:4.20},{t:'kick',at:5.04},{t:'snare',at:5.88},
    {t:'kick',at:6.72},{t:'kick',at:7.56},{t:'kick',at:8.40},{t:'snare',at:9.24},
    {t:'kick',at:10.08},{t:'kick',at:10.92},{t:'kick',at:11.76},{t:'snare',at:12.60},
    {t:'kick',at:13.44},{t:'hat',at:14.28},{t:'kick',at:15.12},{t:'snare',at:15.96},
    {t:'kick',at:16.80},{t:'hat',at:17.64},{t:'kick',at:18.48},{t:'snare',at:19.32},
    {t:'kick',at:20.16},{t:'kick',at:21.0},{t:'hat',at:21.84},{t:'snare',at:22.68},
    {t:'kick',at:23.52},{t:'hat',at:24.36},{t:'kick',at:25.20},{t:'snare',at:26.04},
    {t:'kick',at:26.88},{t:'hat',at:27.72},{t:'kick',at:28.56},{t:'snare',at:29.40},
    {t:'kick',at:30.24},{t:'kick',at:31.08},{t:'hat',at:31.92},{t:'snare',at:32.76},
    {t:'kick',at:33.60},{t:'hat',at:34.44},{t:'kick',at:35.28},{t:'snare',at:36.12}
  ],
  filter: [
    {t:0,f:250},{t:6,f:600},{t:12,f:350},{t:18,f:800},{t:24,f:300},{t:30,f:700},{t:36,f:400}
  ]
};

// --- BOSS 2: SERPENTRIX — unstable / slithering / flowing (35s) ---
_TRACKS.boss2 = {
  bpm: 138, loop:true, duration:35,
  identity:'SERPENTRIX', identityDesc:'unstable slithering flowing pitch nervous',
  sections: [
    { name:'main', type:'sine', vol:0.06, notes:[
      // Slithering pitch movement
      {n:'F3',l:160},{n:'Gb3',l:160},{n:'G3',l:160},{n:'Ab3',l:160},
      {n:'G3',l:160},{n:'Gb3',l:160},{n:'F3',l:160},{n:'Eb3',l:160},
      {n:'Db3',l:160},{n:'Eb3',l:160},{n:'F3',l:160},{n:'G3',l:160},
      {n:'Ab3',l:160},{n:'G3',l:160},{n:'F3',l:160},{n:'Eb3',l:320},{n:0,l:160}
    ]},
    { name:'unstable', type:'sawtooth', vol:0.04, notes:[
      // Nervous rapid figures
      {n:'C4',l:120},{n:'Db4',l:120},{n:'C4',l:120},{n:'Bb3',l:120},
      {n:'Ab3',l:120},{n:'G3',l:120},{n:'Ab3',l:120},{n:'Bb3',l:120},
      {n:'C4',l:120},{n:'Db4',l:120},{n:'Eb4',l:120},{n:'Db4',l:120},
      {n:'C4',l:120},{n:'Bb3',l:120},{n:'Ab3',l:120},{n:'G3',l:120},
      {n:'F3',l:120},{n:'G3',l:120},{n:'Ab3',l:120},{n:'Bb3',l:120},
      {n:'C4',l:120},{n:'Bb3',l:120},{n:'Ab3',l:120},{n:'G3',l:120},
      {n:'F3',l:120},{n:'Eb3',l:120},{n:'F3',l:120},{n:'G3',l:240},{n:0,l:120}
    ]}
  ],
  bass: { type:'triangle', vol:0.10, notes:[
    {n:'F2',l:480},{n:0,l:80},{n:'G2',l:480},{n:0,l:80},
    {n:'Ab2',l:480},{n:0,l:80},{n:'Bb2',l:480},{n:0,l:80},
    {n:'C3',l:480},{n:0,l:80},{n:'Bb2',l:480},{n:0,l:80},
    {n:'Ab2',l:600},{n:'G2',l:600},{n:'F2',l:600},{n:'C3',l:600},{n:0,l:300},
    {n:'Db3',l:480},{n:'C3',l:480},{n:'Bb2',l:480},{n:'Ab2',l:480},
    {n:'G2',l:480},{n:'F2',l:480},{n:'Eb2',l:480},{n:'F2',l:480},{n:0,l:240}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'hat',at:0.86},{t:'snare',at:1.73},{t:'hat',at:2.60},
    {t:'kick',at:3.47},{t:'hat',at:4.34},{t:'snare',at:5.21},{t:'hat',at:6.08},
    {t:'kick',at:6.95},{t:'hat',at:7.82},{t:'snare',at:8.69},{t:'hat',at:9.56},
    {t:'kick',at:10.43},{t:'hat',at:11.30},{t:'snare',at:12.17},{t:'hat',at:13.04},
    {t:'kick',at:13.91},{t:'hat',at:14.78},{t:'snare',at:15.65},{t:'hat',at:16.52},
    {t:'kick',at:17.39},{t:'hat',at:18.26},{t:'snare',at:19.13},{t:'hat',at:20.0},
    {t:'kick',at:20.86},{t:'hat',at:21.73},{t:'snare',at:22.60},{t:'hat',at:23.47},
    {t:'kick',at:24.34},{t:'hat',at:25.21},{t:'snare',at:26.08},{t:'hat',at:26.95},
    {t:'kick',at:27.82},{t:'hat',at:28.69},{t:'snare',at:29.56},{t:'hat',at:30.43},
    {t:'kick',at:31.30},{t:'hat',at:32.17},{t:'snare',at:33.04}
  ],
  filter: [
    {t:0,f:400},{t:5,f:1000},{t:10,f:350},{t:15,f:900},{t:20,f:300},{t:25,f:1100},{t:30,f:500},{t:34,f:800}
  ]
};

// --- BOSS 3: ORBITAL — cold / pulsing / circular / hypnotic (36s) ---
_TRACKS.boss3 = {
  bpm: 136, loop:true, duration:36,
  identity:'ORBITAL', identityDesc:'cold pulsing circular hypnotic repetition',
  sections: [
    { name:'pulse', type:'sine', vol:0.07, notes:[
      // Hypnotic repeating arpeggio
      {n:'C3',l:220},{n:'Eb3',l:220},{n:'G3',l:220},{n:'C4',l:220},
      {n:'Eb4',l:220},{n:'C4',l:220},{n:'G3',l:220},{n:'Eb3',l:220},
      {n:'C3',l:220},{n:'Eb3',l:220},{n:'G3',l:220},{n:'C4',l:220},
      {n:'Eb4',l:220},{n:'C4',l:220},{n:'G3',l:220},{n:'Eb3',l:220}
    ]},
    { name:'orbit', type:'triangle', vol:0.05, notes:[
      // Circular motion feel
      {n:'G3',l:200},{n:'B3',l:200},{n:'D4',l:200},{n:'G4',l:200},
      {n:'D4',l:200},{n:'B3',l:200},{n:'G3',l:200},{n:'D3',l:200},
      {n:'Ab3',l:200},{n:'C4',l:200},{n:'Eb4',l:200},{n:'Ab4',l:200},
      {n:'Eb4',l:200},{n:'C4',l:200},{n:'Ab3',l:200},{n:'Eb3',l:200},
      {n:'F3',l:220},{n:'Ab3',l:220},{n:'C4',l:220},{n:'F4',l:220},
      {n:'Ab4',l:220},{n:'F4',l:220},{n:'C4',l:220},{n:'Ab3',l:220},
      {n:'G3',l:300},{n:'C4',l:300},{n:'Eb4',l:300},{n:'G4',l:400},{n:0,l:200}
    ]}
  ],
  bass: { type:'sine', vol:0.10, notes:[
    {n:'C2',l:880},{n:0,l:110},{n:'Eb2',l:880},{n:0,l:110},
    {n:'G2',l:880},{n:0,l:110},{n:'C3',l:880},{n:0,l:110},
    {n:'G2',l:800},{n:'D3',l:800},{n:'G3',l:800},{n:'D3',l:800},
    {n:'Ab2',l:800},{n:'Eb3',l:800},{n:'Ab3',l:800},{n:'Eb3',l:800},
    {n:'F2',l:880},{n:'C3',l:880},{n:'F3',l:880},{n:'C3',l:880},
    {n:'C2',l:900},{n:'G2',l:900},{n:'C3',l:900},{n:'G2',l:900},{n:0,l:400}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'hat',at:0.88},{t:'hat',at:1.76},{t:'snare',at:2.64},
    {t:'kick',at:3.52},{t:'hat',at:4.40},{t:'hat',at:5.28},{t:'snare',at:6.16},
    {t:'kick',at:7.04},{t:'hat',at:7.92},{t:'hat',at:8.80},{t:'snare',at:9.68},
    {t:'kick',at:10.56},{t:'hat',at:11.44},{t:'hat',at:12.32},{t:'snare',at:13.20},
    {t:'kick',at:14.08},{t:'hat',at:14.96},{t:'hat',at:15.84},{t:'snare',at:16.72},
    {t:'kick',at:17.60},{t:'hat',at:18.48},{t:'hat',at:19.36},{t:'snare',at:20.24},
    {t:'kick',at:21.12},{t:'hat',at:22.0},{t:'hat',at:22.88},{t:'snare',at:23.76},
    {t:'kick',at:24.64},{t:'hat',at:25.52},{t:'hat',at:26.40},{t:'snare',at:27.28},
    {t:'kick',at:28.16},{t:'hat',at:29.04},{t:'hat',at:29.92},{t:'snare',at:30.80},
    {t:'kick',at:31.68},{t:'hat',at:32.56},{t:'snare',at:33.44},{t:'hat',at:34.32}
  ],
  filter: [
    {t:0,f:500},{t:4,f:600},{t:8,f:500},{t:12,f:700},{t:16,f:450},{t:20,f:800},
    {t:24,f:400},{t:28,f:750},{t:32,f:500},{t:35,f:650}
  ]
};

// --- FINAL BOSS: EMPERADOR — oppressive / final / escalation (40s) ---
_TRACKS.finalBoss = {
  bpm: 155, loop:true, duration:40,
  identity:'EMPERADOR', identityDesc:'oppressive escalation finality pressure layering',
  sections: [
    { name:'intro', type:'sawtooth', vol:0.04, notes:[
      // Slow oppressive build
      {n:'C2',l:800},{n:'Eb2',l:800},{n:'G2',l:800},{n:'C3',l:800},{n:0,l:400},
      {n:'C2',l:600},{n:'Eb2',l:600},{n:'F2',l:600},{n:'G2',l:600},{n:0,l:400}
    ]},
    { name:'main', type:'square', vol:0.06, notes:[
      // Layered intensity
      {n:'C3',l:150},{n:'Eb3',l:150},{n:'G3',l:150},{n:'C4',l:150},
      {n:'Eb4',l:150},{n:'D4',l:150},{n:'C4',l:150},{n:'Bb3',l:150},
      {n:'G3',l:150},{n:'Ab3',l:150},{n:'G3',l:150},{n:'F3',l:150},
      {n:'Eb3',l:150},{n:'C3',l:150},{n:'Eb3',l:150},{n:'G3',l:300},{n:0,l:150},
      {n:'Ab3',l:150},{n:'C4',l:150},{n:'Eb4',l:150},{n:'Ab4',l:150},
      {n:'G4',l:150},{n:'F4',l:150},{n:'Eb4',l:150},{n:'C4',l:150},
      {n:'Bb3',l:150},{n:'C4',l:150},{n:'Bb3',l:150},{n:'Ab3',l:150},
      {n:'G3',l:150},{n:'F3',l:150},{n:'Eb3',l:150},{n:'C3',l:300},{n:0,l:150}
    ]},
    { name:'climax', type:'sawtooth', vol:0.05, notes:[
      // Controlled chaos
      {n:'G3',l:130},{n:'Ab3',l:130},{n:'Bb3',l:130},{n:'C4',l:130},
      {n:'Db4',l:130},{n:'Eb4',l:130},{n:'F4',l:130},{n:'G4',l:130},
      {n:'Ab4',l:130},{n:'G4',l:130},{n:'F4',l:130},{n:'Eb4',l:130},
      {n:'Db4',l:130},{n:'C4',l:130},{n:'Bb3',l:130},{n:'C4',l:260},{n:0,l:130},
      {n:'C3',l:140},{n:'D3',l:140},{n:'Eb3',l:140},{n:'F3',l:140},
      {n:'G3',l:140},{n:'Ab3',l:140},{n:'Bb3',l:140},{n:'C4',l:140},
      {n:'D4',l:140},{n:'Eb4',l:140},{n:'F4',l:140},{n:'G4',l:280},{n:0,l:140}
    ]}
  ],
  bass: { type:'triangle', vol:0.13, notes:[
    {n:'C1',l:800},{n:0,l:200},{n:'Eb1',l:800},{n:0,l:200},
    {n:'F1',l:600},{n:0,l:200},{n:'G1',l:600},{n:0,l:200},
    {n:'C1',l:600},{n:'Eb1',l:600},{n:'G1',l:600},{n:'C2',l:600},
    {n:'F1',l:600},{n:'Ab1',l:600},{n:'C2',l:600},{n:'Eb2',l:600},
    {n:'Ab1',l:520},{n:'C2',l:520},{n:'Eb2',l:520},{n:'Ab2',l:520},
    {n:'G1',l:520},{n:'Bb1',l:520},{n:'D2',l:520},{n:'G2',l:520},
    {n:'C1',l:600},{n:'C2',l:600},{n:'G1',l:600},{n:'C2',l:1200},{n:0,l:600}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'kick',at:0.77},{t:'hat',at:1.54},{t:'snare',at:2.31},
    {t:'kick',at:3.08},{t:'hat',at:3.85},{t:'kick',at:4.62},{t:'snare',at:5.39},
    {t:'kick',at:6.16},{t:'kick',at:6.93},{t:'hat',at:7.70},{t:'snare',at:8.47},
    {t:'kick',at:9.24},{t:'hat',at:10.01},{t:'kick',at:10.78},{t:'snare',at:11.55},
    {t:'kick',at:12.32},{t:'kick',at:13.09},{t:'hat',at:13.86},{t:'snare',at:14.63},
    {t:'kick',at:15.40},{t:'hat',at:16.17},{t:'kick',at:16.94},{t:'snare',at:17.71},
    {t:'kick',at:18.48},{t:'kick',at:19.25},{t:'hat',at:20.02},{t:'snare',at:20.79},
    {t:'kick',at:21.56},{t:'hat',at:22.33},{t:'kick',at:23.10},{t:'snare',at:23.87},
    {t:'kick',at:24.64},{t:'hat',at:25.41},{t:'kick',at:26.18},{t:'snare',at:26.95},
    {t:'kick',at:27.72},{t:'hat',at:28.49},{t:'kick',at:29.26},{t:'snare',at:30.03},
    {t:'kick',at:30.80},{t:'kick',at:31.57},{t:'hat',at:32.34},{t:'snare',at:33.11},
    {t:'kick',at:33.88},{t:'hat',at:34.65},{t:'kick',at:35.42},{t:'snare',at:36.19},
    {t:'kick',at:36.96},{t:'hat',at:37.73},{t:'snare',at:38.5}
  ],
  filter: [
    {t:0,f:200},{t:5,f:400},{t:10,f:700},{t:15,f:500},{t:20,f:900},
    {t:25,f:400},{t:30,f:1000},{t:35,f:500},{t:38,f:300}
  ]
};

// --- VICTORY: Triumphant fanfare with payoff (22s, non-looping) ---
_TRACKS.victory = {
  bpm: 115, loop:false, duration:22,
  sections: [
    { name:'fanfare', type:'square', vol:0.07, notes:[
      {n:'C4',l:300},{n:'C4',l:300},{n:'C4',l:300},{n:'C4',l:500},
      {n:'G3',l:400},{n:'A3',l:400},{n:'C4',l:600},{n:0,l:300},
      {n:'C4',l:250},{n:'D4',l:250},{n:'E4',l:250},{n:'F4',l:300},
      {n:'G4',l:500},{n:'E4',l:300},{n:'G4',l:800},{n:0,l:400},
      {n:'A4',l:250},{n:'G4',l:250},{n:'F4',l:250},{n:'E4',l:250},
      {n:'D4',l:250},{n:'E4',l:250},{n:'C4',l:800},{n:0,l:500},
      {n:'G4',l:350},{n:'G4',l:350},{n:'A4',l:600},{n:'G4',l:350},
      {n:'F4',l:350},{n:'E4',l:600},{n:'C4',l:400},{n:'E4',l:400},
      {n:'G4',l:400},{n:'C4',l:1200},{n:0,l:1000}
    ]}
  ],
  bass: { type:'triangle', vol:0.10, notes:[
    {n:'C3',l:600},{n:'G2',l:600},{n:'C3',l:600},{n:'G3',l:600},{n:0,l:500},
    {n:'C3',l:500},{n:'G2',l:500},{n:'E3',l:500},{n:'G3',l:1000},{n:0,l:500},
    {n:'F3',l:500},{n:'C3',l:500},{n:'F3',l:500},{n:'A3',l:600},
    {n:'G3',l:600},{n:'E3',l:600},{n:'C3',l:600},{n:'G3',l:1200},{n:0,l:1000},
    {n:'C3',l:800},{n:'G2',l:800},{n:'E3',l:800},{n:'C4',l:2000},{n:0,l:800}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'snare',at:1.3},{t:'kick',at:2.6},{t:'snare',at:3.9},
    {t:'kick',at:5.2},{t:'snare',at:6.5},{t:'kick',at:7.8},{t:'snare',at:9.1},
    {t:'kick',at:10.4},{t:'snare',at:11.7},{t:'kick',at:13.0},{t:'snare',at:14.3},
    {t:'kick',at:15.6},{t:'snare',at:16.9},{t:'kick',at:18.2},{t:'snare',at:19.5},
    {t:'kick',at:20.2},{t:'snare',at:21.0}
  ],
  filter: [{t:0,f:500},{t:5,f:1200},{t:10,f:800},{t:15,f:2000},{t:20,f:600}]
};

// --- GAME OVER: Descending dramatic arc (18s, non-looping) ---
_TRACKS.gameover = {
  bpm: 90, loop:false, duration:18,
  sections: [
    { name:'descend', type:'triangle', vol:0.07, notes:[
      {n:'C4',l:500},{n:'B3',l:450},{n:'A3',l:450},{n:'G3',l:450},
      {n:'F3',l:450},{n:'E3',l:450},{n:'D3',l:450},{n:'C3',l:900},{n:0,l:600},
      {n:'E3',l:500},{n:'D3',l:450},{n:'C3',l:450},{n:'B2',l:450},
      {n:'A2',l:500},{n:'G2',l:500},{n:'F2',l:500},{n:'C2',l:1200},{n:0,l:800},
      {n:'C2',l:600},{n:'G2',l:600},{n:'C3',l:600},{n:'G2',l:600},
      {n:'Eb3',l:800},{n:'D3',l:800},{n:'C3',l:2000},{n:0,l:1500}
    ]}
  ],
  bass: { type:'sine', vol:0.08, notes:[
    {n:'C2',l:1000},{n:'G2',l:1000},{n:'F2',l:1000},{n:'C2',l:1000},{n:0,l:800},
    {n:'A1',l:900},{n:'E2',l:900},{n:'A1',l:900},{n:'G1',l:900},{n:0,l:800},
    {n:'C1',l:1200},{n:'G1',l:1200},{n:'C1',l:2400},{n:0,l:2000}
  ]},
  percussion: [
    {t:'kick',at:0},{t:'snare',at:2.0},{t:'kick',at:4.0},{t:'snare',at:6.0},
    {t:'kick',at:8.0},{t:'snare',at:10.0},{t:'kick',at:12.0},{t:'snare',at:14.0}
  ],
  filter: [{t:0,f:800},{t:4,f:600},{t:8,f:400},{t:12,f:250},{t:16,f:150}]
};

// =====================
// PERCUSSION SYNTHESIS
// =====================

function _renderPerc(ctx, type, timeSec, vol) {
  var dur, freq, oscType, hpFreq, lpFreq;
  switch (type) {
    case 'kick':
      dur = 0.18; freq = 55; oscType = 'sine'; hpFreq = 30; lpFreq = 300; break;
    case 'snare':
      dur = 0.10; freq = 200; oscType = 'triangle'; hpFreq = 400; lpFreq = 4000; break;
    case 'hat':
      dur = 0.04; freq = 8000; oscType = 'square'; hpFreq = 5000; lpFreq = 12000; break;
    default: return;
  }

  var osc = ctx.createOscillator();
  osc.type = oscType;
  osc.frequency.setValueAtTime(freq, timeSec);
  if (type === 'kick') osc.frequency.exponentialRampToValueAtTime(25, timeSec + dur);

  var noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  var nd = noiseBuffer.getChannelData(0);
  for (var i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * 0.5;

  var noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = noiseBuffer;
  var hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(hpFreq, timeSec);
  var lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(lpFreq, timeSec);

  var g = ctx.createGain();
  g.gain.setValueAtTime(vol, timeSec);
  g.gain.exponentialRampToValueAtTime(0.0001, timeSec + dur);

  osc.connect(g);
  noiseSrc.connect(hp);
  hp.connect(lp);
  lp.connect(g);
  g.connect(ctx.destination);
  osc.start(timeSec);
  osc.stop(timeSec + dur + 0.01);
  noiseSrc.start(timeSec);
  noiseSrc.stop(timeSec + dur + 0.01);
}

// =====================
// OFFLINE RENDERER — HC-AUD-03
// =====================

function _renderNoteCtx(ctx, freq, startSec, durSec, type, vol) {
  if (!freq || freq <= 0) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = type || 'triangle';
  osc.frequency.setValueAtTime(freq, startSec);
  gain.gain.setValueAtTime(0.0001, startSec);
  gain.gain.exponentialRampToValueAtTime(vol, startSec + 0.008);
  gain.gain.setValueAtTime(vol, startSec + durSec * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, startSec + durSec + 0.02);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startSec);
  osc.stop(startSec + durSec + 0.03);
}

function _renderFilterAutomation(ctx, filterPoints) {
  if (!filterPoints || !filterPoints.length) return;
  var lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 0.6;
  // Insert filter before destination
  // We connect through a master gain that goes through the filter
  var preGain = ctx.createGain();
  preGain.gain.value = 0.8;

  // Sort filter points by time
  var pts = filterPoints.slice().sort(function(a,b){return a.t - b.t;});
  for (var i = 0; i < pts.length; i++) {
    lp.frequency.setValueAtTime(pts[i].f, pts[i].t);
  }
  // Ramp between points
  for (var j = 1; j < pts.length; j++) {
    lp.frequency.linearRampToValueAtTime(pts[j].f, pts[j].t);
  }

  // Apply filter to everything by connecting through it
  // Note: this is a simplification — we apply filter to the master output
  preGain.connect(lp);
  lp.connect(ctx.destination);
  return { preGain:preGain, filter:lp };
}

function _renderExtendedTrack(trackData) {
  if (!trackData || !trackData.sections) return null;

  try {
    var sampleRate = 44100;
    if (typeof AC !== 'undefined' && AC) sampleRate = AC.sampleRate;
    var dur = trackData.duration || 35;
    var ctx = new OfflineAudioContext(2, Math.ceil(sampleRate * (dur + 1)), sampleRate);

    // Apply filter automation
    var filterChain = null;
    if (trackData.filter && trackData.filter.length) {
      filterChain = _renderFilterAutomation(ctx, trackData.filter);
    }
    var output = filterChain ? filterChain.preGain : ctx.destination;

    // Render sections
    var t = 0;
    var sections = trackData.sections;
    for (var si = 0; si < sections.length; si++) {
      var sec = sections[si];
      for (var ni = 0; ni < sec.notes.length; ni++) {
        var nd = sec.notes[ni];
        var freq = (typeof nd.n === 'number') ? nd.n : (_N[nd.n] || 0);
        if (freq > 0 && nd.n !== 0) {
          _renderNoteCtx(ctx, freq, t, nd.l / 1000, sec.type, sec.vol);
        }
        t += nd.l / 1000;
      }
    }

    // Render bass layer
    if (trackData.bass) {
      var bt = 0;
      for (var bi = 0; bi < trackData.bass.notes.length; bi++) {
        var bnd = trackData.bass.notes[bi];
        var bfreq = (typeof bnd.n === 'number') ? bnd.n : (_N[bnd.n] || 0);
        if (bfreq > 0 && bnd.n !== 0) {
          _renderNoteCtx(ctx, bfreq, bt, bnd.l / 1000, trackData.bass.type, trackData.bass.vol);
        }
        bt += bnd.l / 1000;
      }
    }

    // Render percussion
    if (trackData.percussion) {
      for (var pi = 0; pi < trackData.percussion.length; pi++) {
        var perc = trackData.percussion[pi];
        var percVol = perc.t === 'kick' ? 0.12 : perc.t === 'snare' ? 0.08 : 0.04;
        _renderPerc(ctx, perc.t, perc.at, percVol);
      }
    }

    return { ctx:ctx, dur:dur };

  } catch (e) {
    return null;
  }
}

function renderMusicTrack(trackName) {
  if (_musicBuffers[trackName]) return _musicBuffers[trackName];

  // Try extended track data first, fall back to legacy MUSIC_DATA
  var trackData = _TRACKS[trackName];
  if (trackData) {
    var result = _renderExtendedTrack(trackData);
    if (result && result.ctx) {
      result.ctx.startRendering().then(function(buffer) {
        _musicBuffers[trackName] = buffer;
      }).catch(function() {
        _musicBuffers[trackName] = null;
      });
      return null;
    }
  }

  // Fallback: render from legacy MUSIC_DATA
  if (typeof MUSIC_DATA !== 'undefined' && MUSIC_DATA[trackName]) {
    var legacyData = MUSIC_DATA[trackName];
    try {
      var sr = (typeof AC !== 'undefined' && AC) ? AC.sampleRate : 44100;
      var totalMs = 0;
      if (legacyData.lead) {
        totalMs = Math.max(legacyData.bass.length, legacyData.lead.length) * (60000 / (legacyData.bpm || 130));
      } else {
        for (var i = 0; i < legacyData.length; i++) { totalMs += legacyData[i].l; }
      }
      var dSec = Math.max(2, totalMs / 1000 + 0.5);
      var ctx2 = new OfflineAudioContext(2, Math.ceil(sr * dSec), sr);

      if (legacyData.lead) {
        var bt = 0, lt = 0;
        for (var bi = 0; bi < legacyData.bass.length; bi++) {
          var bn = legacyData.bass[bi];
          if (bn.n !== 0 && _N[bn.n]) _renderNoteCtx(ctx2, _N[bn.n], bt, bn.l / 1000, 'triangle', 0.10);
          bt += bn.l / 1000;
        }
        for (var li = 0; li < legacyData.lead.length; li++) {
          var ln = legacyData.lead[li];
          if (ln.n !== 0 && _N[ln.n]) _renderNoteCtx(ctx2, _N[ln.n], lt, ln.l / 1000, 'square', 0.06);
          lt += ln.l / 1000;
        }
      } else {
        var t = 0;
        for (var j = 0; j < legacyData.length; j++) {
          var nd = legacyData[j];
          if (nd.n !== 0 && _N[nd.n]) _renderNoteCtx(ctx2, _N[nd.n], t, nd.l / 1000, 'triangle', 0.10);
          t += nd.l / 1000;
        }
      }

      ctx2.startRendering().then(function(buffer) {
        _musicBuffers[trackName] = buffer;
      }).catch(function() {
        _musicBuffers[trackName] = null;
      });
    } catch (e) {}
  }

  return null;
}

// =====================
// BUFFER-BASED PLAYBACK (unchanged from HC-AUD-02)
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
  if (_musicLoopTimer) { clearTimeout(_musicLoopTimer); _musicLoopTimer = null; }
  if (_musicFadeTimer) { clearInterval(_musicFadeTimer); _musicFadeTimer = null; }
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
  var loopMs = (buffer.duration - 0.05) * 1000;
  if (loopMs < 200) loopMs = buffer.duration * 1000;
  _musicLoopTimer = setTimeout(function() {
    if (_currentMusicKey !== key) return;
    _playMusicBufferLoop(buffer, key);
  }, loopMs);
  _fadeMusicGainTo(gain, 1.0, 350);
}

function _fadeMusicGainTo(gain, target, ms) {
  if (_musicFadeTimer) clearInterval(_musicFadeTimer);
  var steps = 20;
  var stepMs = Math.max(8, ms / steps);
  var startVal = gain.gain.value;
  var delta = (target - startVal) / steps;
  var step = 0;
  _musicFadeTimer = setInterval(function() {
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
  if (_musicBuffers[trackName]) {
    if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();
    var oldGain = _currentMusicGain;
    if (oldGain && crossfadeMs && crossfadeMs > 0) {
      _fadeMusicGainTo(oldGain, 0.0001, crossfadeMs);
      setTimeout(function() {
        _playMusicBufferLoop(_musicBuffers[trackName], trackName);
      }, crossfadeMs * 0.6);
    } else {
      _clearCurrentMusic();
      _playMusicBufferLoop(_musicBuffers[trackName], trackName);
    }
    return true;
  }
  renderMusicTrack(trackName);
  if (typeof startMusic === 'function') startMusic(trackName);
  return false;
}

function stopMusicFromBuffer(fadeOutMs) {
  if (_currentMusicGain) {
    var g = _currentMusicGain;
    if (fadeOutMs && fadeOutMs > 0) {
      _fadeMusicGainTo(g, 0.0001, fadeOutMs);
      setTimeout(function() { _clearCurrentMusic(); }, fadeOutMs + 50);
    } else {
      _clearCurrentMusic();
    }
  }
  if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();
}

function crossfadeMusicTo(trackName, crossfadeMs) {
  crossfadeMs = crossfadeMs || 700;
  if (isMuted || !AC) return;
  if (!_musicBuffers[trackName]) renderMusicTrack(trackName);
  if (_musicBuffers[trackName]) {
    playMusicFromBuffer(trackName, crossfadeMs);
  } else {
    if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();
    if (typeof startMusic === 'function') startMusic(trackName);
  }
}

function preloadAllMusicTracks() {
  if (_musicPreloadStarted) return;
  _musicPreloadStarted = true;
  var names = ['menu','chapter1','chapter2','chapter3','chapter4',
               'boss1','boss2','boss3','finalBoss','victory','gameover'];
  for (var i = 0; i < names.length; i++) {
    renderMusicTrack(names[i]);
  }
}

// Auto-preload after AC is ready
setTimeout(function() {
  if (typeof AC !== 'undefined' && AC) preloadAllMusicTracks();
}, 2500);

// =====================
// HC-AUD-03: BOSS ENTRANCE MUSIC SWELL
// =====================

function bossEntranceMusicSwell(trackName) {
  if (isMuted || !AC) return;
  // Stop current music with short fade
  if (_currentMusicGain) {
    _fadeMusicGainTo(_currentMusicGain, 0.15, 300);
  }
  if (typeof stopAllMusicIntervals === 'function') stopAllMusicIntervals();

  // Start boss track with slow swell
  if (!_musicBuffers[trackName]) renderMusicTrack(trackName);

  // Wait 400ms then start with slow fade-in
  setTimeout(function() {
    if (_musicBuffers[trackName]) {
      _clearCurrentMusic();
      ensureMusicBus();
      var dest = musicBusGain || (audioBuses && audioBuses.music) || AC.destination;
      var src = AC.createBufferSource();
      src.buffer = _musicBuffers[trackName];
      src.loop = false;
      var gain = AC.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(dest);
      src.start(0);
      _currentMusicSource = src;
      _currentMusicGain = gain;
      _currentMusicKey = trackName;
      var loopMs = (_musicBuffers[trackName].duration - 0.05) * 1000;
      _musicLoopTimer = setTimeout(function() {
        if (_currentMusicKey !== trackName) return;
        _playMusicBufferLoop(_musicBuffers[trackName], trackName);
      }, loopMs);
      // Slow swell over 1200ms for dramatic entrance
      _fadeMusicGainTo(gain, 1.0, 1200);
    }
  }, 400);
}
