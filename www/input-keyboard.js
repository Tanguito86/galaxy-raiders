// =====================
// GALAXY RAIDERS - input-keyboard.js
// =====================

var _kbKeys = { left: false, right: false, up: false, down: false };

function _kbSyncMove() {
  var netX = (_kbKeys.right ? 1 : 0) - (_kbKeys.left ? 1 : 0);
  var netY = (_kbKeys.down ? 1 : 0) - (_kbKeys.up ? 1 : 0);
  InputManager.setMove(netX, netY);
}

document.addEventListener('keydown', e => {
  if (handleBalanceDebugKeydown(e)) return;

  // A/B de mezcla de musica (ducks): F3
  if (e.code === 'F3') {
    const preset = cycleMusicDuckingPreset();
    if (typeof refreshMusicDucking === 'function') refreshMusicDucking();
    if (typeof setBalanceDebugNotice === 'function') {
      setBalanceDebugNotice(`MIX PRESET: ${preset.toUpperCase()}`, 1600);
    }
    if (!isMuted) sfxUIClick();
    e.preventDefault();
    return;
  }

  // QA quick view de runs guardadas: F4
  if (e.code === 'F4') {
    const rows = (typeof getRecentRunQaSnapshots === 'function') ? getRecentRunQaSnapshots(8) : [];
    if (rows.length > 0) {
      console.table(rows.map(r => ({
        date: r.date,
        profile: r.profile,
        difficulty: r.difficulty,
        endedBy: r.endedBy,
        levelReached: r.levelReached,
        score: r.score,
        continues: r.continues,
        deaths: r.deaths,
        accuracy: r.accuracy,
        totalTimeSec: r.totalTimeSec
      })));
    }
    if (typeof setBalanceDebugNotice === 'function') {
      setBalanceDebugNotice(`RUN QA: ${rows.length} snapshots`, 1400);
    }
    e.preventDefault();
    return;
  }

  // HC-148A: export encounter director telemetry baseline: F8
  if (e.code === 'F8') {
    if (typeof printEncounterDirectorCaptureReport === 'function') {
      printEncounterDirectorCaptureReport();
    }
    if (typeof setBalanceDebugNotice === 'function') {
      setBalanceDebugNotice('ENC DIR TELEMETRY EXPORTED', 1600);
    }
    e.preventDefault();
    return;
  }

  // Iniciar musica del menu con cualquier tecla
  if (state === 'menu' && !menuMusicStarted && !isMuted) {
    initAudio();
    startMusic('menu');
    menuMusicStarted = true;
  }

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();

  // Mute music
  if (e.code === 'KeyM') {
    isMuted = !isMuted;
    if (isMuted) {
      if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
      if (musicBassInterval) { clearInterval(musicBassInterval); musicBassInterval = null; }
    } else if (!isMuted && state === 'playing') {
      startMusic(getMusicThemeForLevel(level, boss.active));
    }
    return;
  }

  // Input de nombre (high score)
  if (state === 'entering_name') {
    if (e.code === 'Enter') {
      submitEnteredName();
      return;
    }

    if (e.code === 'Backspace') {
      removeLastNameChar();
      return;
    }

    appendKeyboardNameChar(e.key);
    return;
  }

  // Continue
  if (state === 'continue' && (e.code === 'Space' || e.code === 'Enter')) {
    handleContinueConfirmInput();
    return;
  }
  
  if (state === 'continue' && e.code === 'Escape') {
    handleContinueDeclineInput();
    return;
  }

  if (state === 'victory' && (e.code === 'Space' || e.code === 'Enter')) {
    handleVictoryConfirmInput();
    return;
  }

  if (state === 'menu') {
    if (e.code === 'ArrowUp') moveMenuSelection(-1);
    if (e.code === 'ArrowDown') moveMenuSelection(1);
    
    // HC-12: difficulty cycling disabled (hardcore only)
    // if ((e.code === 'ArrowRight' || e.code === 'ArrowLeft') && hardcoreUnlocked) {
    //   cycleMenuDifficulty();
    // }

    if (e.code === 'Space' || e.code === 'Enter') {
      confirmMenuSelection();
    }
  }
  
  // Input para scores
  if (state === 'scores') {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      cycleScoresTab(true);
    }
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
      closeScoresScreen();
    }
  }
  
  // Input para options
  if (state === 'options') {
    if (e.code === 'ArrowUp') moveOptionSelection(-1);
    if (e.code === 'ArrowDown') moveOptionSelection(1);
    
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      applyOptionHorizontalInput(false);
    }
    
    if (e.code === 'Space' || e.code === 'Enter') {
      confirmOptionsFromKeyboard();
    }
    
    if (e.code === 'Escape') {
      confirmOptionsFromKeyboard();
    }
  }
  
  if (state === 'playing') {
    if (e.code === 'ArrowLeft')   { _kbKeys.left   = true; _kbSyncMove(); }
    if (e.code === 'ArrowRight')  { _kbKeys.right  = true; _kbSyncMove(); }
    if (e.code === 'ArrowUp')     { _kbKeys.up     = true; _kbSyncMove(); }
    if (e.code === 'ArrowDown')   { _kbKeys.down   = true; _kbSyncMove(); }
    if (e.code === 'Space' || e.code === 'Enter') InputManager.setFiring(true);
  }

  // Input para paused
  if (state === 'paused') {
    if (e.code === 'ArrowUp') movePauseSelection(-1);
    if (e.code === 'ArrowDown') movePauseSelection(1);
    if (e.code === 'Space' || e.code === 'Enter') {
      confirmPauseSelection();
    }
    if (e.code === 'Escape') {
      // ESC = Resume rapido
      resumeGameplay();
    }
    return;
  }

  // Pause toggle desde playing
  if ((e.code === 'KeyP' || e.code === 'Escape') && state === 'playing') {
    pauseGameplay();
  }
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft')   { _kbKeys.left   = false; _kbSyncMove(); }
  if (e.code === 'ArrowRight')  { _kbKeys.right  = false; _kbSyncMove(); }
  if (e.code === 'ArrowUp')     { _kbKeys.up     = false; _kbSyncMove(); }
  if (e.code === 'ArrowDown')   { _kbKeys.down   = false; _kbSyncMove(); }
  if (e.code === 'Space' || e.code === 'Enter') InputManager.setFiring(false);
});

// Android/Chrome: auto-pause cuando la app va a background
let wasPlayingBeforeHide = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (state === 'playing') {
      wasPlayingBeforeHide = true;
      pauseGameplay();
    } else {
      stopMusicPlayback();
    }
  } else {
    if (state === 'paused' && wasPlayingBeforeHide) {
      requestFull();
      resumeGameplay();
      wasPlayingBeforeHide = false;
    }
  }
});
