// =====================
// GALAXY RAIDERS - scores.js
// =====================

// === FIREBASE GLOBAL SCORES ===
let globalScores = [];
let globalTopScore = 0;
let globalTopName = '---';

// Cargar top score global
async function loadGlobalScores() {
  try {
    const snapshot = await db.collection('scores')
      .orderBy('score', 'desc')
      .limit(10)
      .get();
    
    globalScores = [];
    snapshot.forEach(doc => {
      globalScores.push(doc.data());
    });
    
    if (globalScores.length > 0) {
      globalTopScore = globalScores[0].score;
      globalTopName = globalScores[0].name;
    }
  } catch (error) {
    console.error('Error loading global scores:', error);
  }
}

// Subir score al ranking global
async function submitGlobalScore(name, score) {
  try {
    await db.collection('scores').add({
      name: name.toUpperCase(),
      score: score,
      date: new Date().toISOString()
    });
    loadGlobalScores(); // Recargar ranking
  } catch (error) {
    console.error('Error submitting score:', error);
  }
}

// Cargar scores al iniciar
loadGlobalScores();

// --- GAME STATE ---
let screenShake = 0;
let screenShakeBg = 0;
let screenShakeGameplay = 0;
let screenShakeLight = 0;
let screenShakeMedium = 0;
let screenShakeHeavy = 0;
let flashScreen = 0;
let state = 'menu';
let previousState = 'menu';
let globalTime = 0;
let score = 0;
let lives = 3;
let level = 1;
let nextPowerUpTime = 0;
let powerUpsSpawnedThisLevel = 0;
let starShakeX = 0;
let starShakeY = 0;


const POWERUP_COOLDOWN = 2600;       // 2.6s minimo entre drops
const MAX_ACTIVE_POWERUPS = 1;       // maximo en pantalla a la vez
const MAX_POWERUPS_PER_LEVEL = 5;    // maximo por nivel

let bestScore = 0;
let highScores = [];
let highNames = [];
let highContinues = []; // CuÃ¡ntos continues usÃ³ cada uno

// --- HIGH SCORES: localStorage ---
function loadHighScores() {
  try {
    const saved = localStorage.getItem('galaxyRaidersScores');
    if (saved) {
      const data = JSON.parse(saved);
      highScores = data.scores || [];
      highNames = data.names || [];
      highContinues = data.continues || [];
    }
  } catch (e) {
    console.error('Error loading scores:', e);
    highScores = [];
    highNames = [];
    highContinues = [];
  }

  // Asegurar 10 slots
  while (highScores.length < 10) {
    highScores.push(0);
    highNames.push('---');
    highContinues.push(0);
  }

  bestScore = highScores[0] || 0;
}

function saveHighScores() {
  try {
    localStorage.setItem('galaxyRaidersScores', JSON.stringify({
      scores: highScores,
      names: highNames,
      continues: highContinues
    }));
  } catch (e) {
    console.error('No se pudo guardar', e);
  }
}

function isHighScore(score) {
  if (score === 0) return false;
  
  // Si hay algÃºn slot vacÃ­o
  for (let i = 0; i < 10; i++) {
    if (highScores[i] === 0 || highNames[i] === '---') {
      return true;
    }
  }
  
  // Si supera el 10mo lugar
  return score > highScores[9];
}

function addHighScore(score, name) {
  highScores.push(score);
  highNames.push(name);
  highContinues.push(continueCount);

  // Combinar y ordenar
  const combined = highScores.map((s, i) => ({ 
    score: s, 
    name: highNames[i],
    continues: highContinues[i] || 0
  }));
  combined.sort((a, b) => b.score - a.score);

  // Tomar top 10
  highScores = combined.slice(0, 10).map(x => x.score);
  highNames = combined.slice(0, 10).map(x => x.name);
  highContinues = combined.slice(0, 10).map(x => x.continues);

  saveHighScores();
  bestScore = highScores[0] || 0;
  
  // âœ… Subir al ranking global
  submitGlobalScore(name, score);
}



