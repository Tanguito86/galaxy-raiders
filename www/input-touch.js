// =====================
// GALAXY RAIDERS - input-touch.js
// =====================

// Input helpers
function bindHold(el, onDown, onUp) {
  if (!el) return;

  const opts = { passive: false };

  const down = (ev) => {
    ev.preventDefault();
    if (el.setPointerCapture) el.setPointerCapture(ev.pointerId);
    vibrate('tap');
    onDown();
  };

  const up = (ev) => {
    ev.preventDefault();
    onUp();
  };

  el.addEventListener('pointerdown', down, opts);
  el.addEventListener('pointerup', up, opts);
  el.addEventListener('pointercancel', up, opts);
  el.addEventListener('pointerleave', up, opts);
  el.addEventListener('contextmenu', ev => ev.preventDefault());

  el.style.touchAction = 'none';
}

// Mobile controls: joystick virtual
const joystickContainer = document.getElementById('joystick-container');
const joystickStick = document.getElementById('joystick-stick');
const btnFire = document.getElementById('btn-fire');

let joystickActive = false;
const joystickMaxDistance = 40;

if (joystickContainer && joystickStick) {
  joystickContainer.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    joystickActive = true;
    joystickContainer.setPointerCapture(e.pointerId);
    updateJoystick(e);
  });

  joystickContainer.addEventListener('pointermove', (e) => {
    if (joystickActive) {
      e.preventDefault();
      updateJoystick(e);
    }
  });

  joystickContainer.addEventListener('pointerup', () => {
    resetJoystick();
  });
  
  joystickContainer.addEventListener('pointercancel', () => {
    resetJoystick();
  });

  joystickContainer.addEventListener('lostpointercapture', () => {
    resetJoystick();
  });

  function updateJoystick(e) {
    if (state === 'menu' && !menuMusicStarted && !isMuted) {
      initAudio();
      startMusic('menu');
      if (typeof startAmbience === 'function') startAmbience('menu');
      menuMusicStarted = true;
    }

    const rect = joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const clampedDistance = Math.min(distance, joystickMaxDistance);
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    joystickStick.style.transform = `translate(${x}px, ${y}px)`;

    const threshold = 0.4;

    if (state === 'entering_name') {
      if (joystickInputCooldown <= 0) {
        if (y < -threshold * joystickMaxDistance) {
          moveNameLetterSelection(-1, true);
          joystickInputCooldown = 200;
        } else if (y > threshold * joystickMaxDistance) {
          moveNameLetterSelection(1, true);
          joystickInputCooldown = 200;
        }
      }
    }
    else if (state === 'menu') {
      if (joystickInputCooldown <= 0) {
        if (y < -threshold * joystickMaxDistance) {
          moveMenuSelection(-1, true);
          joystickInputCooldown = 250;
        } else if (y > threshold * joystickMaxDistance) {
          moveMenuSelection(1, true);
          joystickInputCooldown = 250;
        }
        
        // HC-12: difficulty cycling disabled (hardcore only)
        // if ((x < -threshold * joystickMaxDistance || x > threshold * joystickMaxDistance) && hardcoreUnlocked) {
        //   if (cycleMenuDifficulty(true)) joystickInputCooldown = 300;
        // }
      }
    }
    else if (state === 'options') {
      if (joystickInputCooldown <= 0) {
        if (y < -threshold * joystickMaxDistance) {
          moveOptionSelection(-1, true);
          joystickInputCooldown = 250;
        } else if (y > threshold * joystickMaxDistance) {
          moveOptionSelection(1, true);
          joystickInputCooldown = 250;
        }
        
        if (x < -threshold * joystickMaxDistance || x > threshold * joystickMaxDistance) {
          if (applyOptionHorizontalInput(true)) {
            joystickInputCooldown = 300;
          }
        }
      }
    }
    else if (state === 'paused') {
      if (joystickInputCooldown <= 0) {
        if (y < -threshold * joystickMaxDistance) {
          movePauseSelection(-1, true);
          joystickInputCooldown = 250;
        } else if (y > threshold * joystickMaxDistance) {
          movePauseSelection(1, true);
          joystickInputCooldown = 250;
        }
      }
    }
    else if (state === 'scores') {
      if (joystickInputCooldown <= 0) {
        if (x < -threshold * joystickMaxDistance) {
          setScoresTab(0, true, true);
          joystickInputCooldown = 300;
        } else if (x > threshold * joystickMaxDistance) {
          setScoresTab(1, true, true);
          joystickInputCooldown = 300;
        }
      }
    }
    else {
      InputManager.setMove(
        x < -threshold * joystickMaxDistance ? -1 : (x > threshold * joystickMaxDistance ? 1 : 0),
        y < -threshold * joystickMaxDistance ? -1 : (y > threshold * joystickMaxDistance ? 1 : 0)
      );
    }
  }

  function resetJoystick() {
    joystickActive = false;
    joystickStick.style.transform = 'translate(0px, 0px)';
    InputManager.setMove(0, 0);
  }
}

// Disparo + start desde menu
bindHold(
  btnFire,
  () => {
    initAudio();

    // Continue
    if (state === 'continue') {
      handleContinueConfirmInput();
      return;
    }

    // Salir de victory
    if (state === 'victory') {
      handleVictoryConfirmInput();
      return;
    }

    // Ingresando nombre: agregar letra
    if (state === 'entering_name') {
      appendSelectedNameChar(true);
      return;
    }

    // Volver de scores
    if (state === 'scores') {
      closeScoresScreen();
      return;
    }
    
    // Volver de credits
    if (state === 'credits') {
      goToMenuScreen();
      return;
    }
    
    // Options: aplicar/volver
    if (state === 'options') {
      confirmOptionsToPrevious();
      return;
    }

    // Paused: confirmar opcion
    if (state === 'paused') {
      confirmPauseSelection();
      return;
    }

    // Menu: confirmar opcion
    if (state === 'menu') {
      confirmMenuSelection();
      return;
    }

    if (state === 'playing' && !pendingNextLevel) InputManager.setFiring(true);
  },
  () => { InputManager.setFiring(false); }
);

// Deteccion de movil
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  const controls = document.getElementById('mobile-controls');
  if (controls) {
    controls.style.display = 'flex';
  }
}
