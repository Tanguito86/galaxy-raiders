// =====================
// GALAXY RAIDERS - input-manager.js (FASE 3)
// Fachada de input: convive con el sistema actual
// =====================

window.InputManager = (function() {
  var _moveX = 0;
  var _moveY = 0;
  var _firing = false;

  function setMove(x, y) {
    _moveX = x;
    _moveY = y;
    player.movingLeft  = x < 0;
    player.movingRight = x > 0;
    player.movingUp    = y < 0;
    player.movingDown  = y > 0;
  }

  function setFiring(value) {
    _firing = value;
    isFiring = value;
  }

  function reset() {
    _moveX = 0;
    _moveY = 0;
    _firing = false;
    player.movingLeft  = false;
    player.movingRight = false;
    player.movingUp    = false;
    player.movingDown  = false;
    isFiring = false;
  }

  function getState() {
    return {
      moveX: _moveX,
      moveY: _moveY,
      firing: _firing
    };
  }

  return {
    setMove: setMove,
    setFiring: setFiring,
    reset: reset,
    getState: getState
  };
})();
