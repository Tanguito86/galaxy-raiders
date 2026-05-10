// =====================
// GALAXY RAIDERS - ui.js
// =====================

// === SISTEMA DE MENÃš ===
let menuSelection = 0;  // 0=PLAY, 1=SCORES, 2=OPTIONS
const MENU_OPTIONS = ['PLAY', 'SCORES', 'OPTIONS', 'CREDITS'];
let pauseSelection = 0;  // 0=RESUME, 1=OPTIONS, 2=QUIT
let scoresTab = 1;  // âœ… GLOBAL por defecto

let optionSelection = 0;  // 0=SOUND, 1=VIBRATION, 2=CONTROLS, 3=DIFFICULTY, 4=BALANCE, 5=RESET
const OPTIONS_COUNT = 6;
let vibrationEnabled = true;
let joystickSize = 0;  // 0=NORMAL, 1=LARGE
const JOYSTICK_SIZES = ['NORMAL', 'LARGE'];

// Cargar preferencia de tamaÃ±o de controles
try {
  const savedJoySize = localStorage.getItem('gr_joystickSize');
  if (savedJoySize !== null) joystickSize = parseInt(savedJoySize) || 0;
} catch (e) {}

function saveJoystickSize() {
  try {
    localStorage.setItem('gr_joystickSize', joystickSize.toString());
  } catch (e) {}
}

function applyJoystickSize() {
  const joystickContainer = document.getElementById('joystick-container');
  const joystickBase = document.getElementById('joystick-base');
  const joystickStick = document.getElementById('joystick-stick');
  const btnFire = document.getElementById('btn-fire');
  
  if (!joystickContainer || !joystickBase || !joystickStick || !btnFire) return;
  
  if (joystickSize === 1) {
    // LARGE
    joystickContainer.style.width = '140px';
    joystickContainer.style.height = '140px';
    joystickBase.style.width = '140px';
    joystickBase.style.height = '140px';
    joystickStick.style.width = '65px';
    joystickStick.style.height = '65px';
    joystickStick.style.left = '37.5px';
    joystickStick.style.top = '37.5px';
    btnFire.style.width = '140px';
    btnFire.style.height = '140px';
    btnFire.style.fontSize = '20px';
  } else {
    // NORMAL
    joystickContainer.style.width = '110px';
    joystickContainer.style.height = '110px';
    joystickBase.style.width = '110px';
    joystickBase.style.height = '110px';
    joystickStick.style.width = '50px';
    joystickStick.style.height = '50px';
    joystickStick.style.left = '30px';
    joystickStick.style.top = '30px';
    btnFire.style.width = '110px';
    btnFire.style.height = '110px';
    btnFire.style.fontSize = '18px';
  }
}

// Aplicar tamaÃ±o al cargar
setTimeout(applyJoystickSize, 100);


let globalNames = [];
let globalContinues = [];
let playerCredits = 1;  // Fichas del jugador

// Cargar fichas de localStorage
try {
  const savedCredits = localStorage.getItem('gr_credits');
  if (savedCredits) playerCredits = parseInt(savedCredits) || 4;
} catch (e) {}

function saveCredits() {
  try {
    localStorage.setItem('gr_credits', playerCredits.toString());
  } catch (e) {}
}

// Aliens decorativos animados
let menuAliens = [];

function initMenuAliens() {
  menuAliens = [];
  const types = ['alien1', 'alien2', 'alien1', 'alien2', 'alien1'];
  
  // Fila 1 - centrada
  for (let i = 0; i < 5; i++) {
    menuAliens.push({
      x: 0,
      y: 100,
      type: types[i],
      col: i,
      row: 0
    });
  }
  
  // Fila 2 - centrada
  for (let i = 0; i < 4; i++) {
    menuAliens.push({
      x: 0,
      y: 135,
      type: 'alien2',
      col: i,
      row: 1
    });
  }
}

initMenuAliens();

const difficulties = [
  { key: 'normal',   name: 'NORMAL',   lives: 3, continueLives: 3, fireMult: 1.0 },
  { key: 'hardcore', name: 'HARDCORE', lives: 1, continueLives: 2, fireMult: 0.72 }
];

let difficultyIndex = 0;

let hardcoreUnlocked = false;

// Cargar desbloqueo de localStorage
try {
  hardcoreUnlocked = localStorage.getItem('gr_hardcoreUnlocked') === 'true';
} catch (e) {}


// âœ… VibraciÃ³n compatible real (web + hÃ­brido)
let lastVibe = 0;

function vibrate(type = 'tap') {
  if (!vibrationEnabled) return;

  const now = performance.now();
  if (now - lastVibe < 50) return;
  lastVibe = now;

  try {
    // Capacitor Haptics
    if (window.Capacitor?.Plugins?.Haptics) {
      const Haptics = window.Capacitor.Plugins.Haptics;
      switch (type) {
        case 'tap':
          Haptics.impact({ style: 'light' });
          break;
        case 'hit':
          Haptics.impact({ style: 'medium' });
          break;
        case 'damage':
        case 'explosion':
          Haptics.impact({ style: 'heavy' });
          break;
        default:
          Haptics.impact({ style: 'light' });
      }
    } else if (
      navigator.vibrate &&
      (!navigator.userActivation || navigator.userActivation.hasBeenActive)
    ) {
      // Fallback web
      let ms;
      switch (type) {
        case 'tap':        ms = 12; break;
        case 'hit':        ms = 40; break;
        case 'damage':     ms = 70; break;
        case 'explosion':  ms = 120; break;
        default:           ms = 20;
      }
      navigator.vibrate(ms);
    }
  } catch (e) {
    console.error('Vibration error:', e);
  }
}




// --- FULLSCREEN ---
const fullscreenBtn = document.getElementById('btn-fullscreen');

function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    const request = (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
    if (request && typeof request.catch === 'function') request.catch(() => {});
  } else {
    const exit = (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
    if (exit && typeof exit.catch === 'function') exit.catch(() => {});
  }
}

function updateFullscreenButton() {
  if (!fullscreenBtn) return;
  fullscreenBtn.textContent = document.fullscreenElement ? 'â¤¢' : 'â›¶';
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  updateFullscreenButton();
}

document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('msfullscreenchange', updateFullscreenButton);

// --- PAUSE BUTTON (MOBILE) ---
const pauseBtn = document.getElementById('btn-pause');

function togglePause() {
  togglePauseGameplay();
}

if (pauseBtn) {
  pauseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // âœ… Si estamos en el menÃº, INICIAR juego
    if (state === 'menu') {
      confirmMenuSelection();

      return;
    }
    
    // Volver de SCORES
    if (state === 'scores') {
      closeScoresScreen();
      return;
    }
    
    // OPTIONS - FIRE hace cosas diferentes segÃºn selecciÃ³n
    if (state === 'options') {
      confirmOptionsToPrevious();
      return;
    }
    
    // âœ… Si estamos ingresando nombre, CONFIRMAR
    if (state === 'entering_name') {
      submitEnteredName({
        resetScreenEffects: true,
        setPauseButtonPlayIcon: true,
        playConfirmSfx: true,
        vibrateConfirm: true
      });
      return;
    }
    // Funcionalidad normal de pausa
    if (state === 'playing' || state === 'paused') {
      togglePause();
      vibrate('tap');
    }
  });
}

// --- MUTE BUTTON (MOBILE) ---
const muteBtn = document.getElementById('btn-mute');

if (muteBtn) {
  muteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // âœ… Si estamos ingresando nombre, BORRAR Ãºltima letra
    if (state === 'entering_name') {
      removeLastNameChar(true);
      return;
    }
    
    // âœ… Si estamos en CONTINUE, salir al menÃº
    if (state === 'continue') {
      handleContinueDeclineInput({
        playClick: true,
        vibrateTap: true
      });
      return;
    }
    
    // Funcionalidad normal de mute
    toggleMuteSetting({
      stopMusicOnMute: true,
      resumeMusicOnUnmute: true
    });
  });
}

// TEMP DEBUG: quick level advance for background/story validation.
// Remove before release.
const debugNextLevelBtn = document.getElementById('btn-debug-next-level');

function debugJumpToNextLevel() {
  if (state !== 'playing' && state !== 'paused') return;
  if (level >= 20) return;

  state = 'playing';
  pendingNextLevel = false;
  levelClearTimer = 0;
  boss.active = false;
  enemies = [];
  bullets = [];
  enemyBullets = [];
  powerUps = [];
  mines = [];
  satellites = [];
  ufoRewards = [];

  level++;
  debugLevelJumpText = 'DEBUG LEVEL ' + level;
  debugLevelJumpTimer = 1200;
  startLevel();
}

if (debugNextLevelBtn) {
  debugNextLevelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    debugJumpToNextLevel();
  });
}



