// =====================
// GALAXY RAIDERS - debug-balance.js
// =====================

const DEFAULT_DIFFICULTY_TABLE = JSON.parse(JSON.stringify(DIFFICULTY_TABLE));
const BALANCE_DEBUG_STORAGE_KEY = 'gr_balance_debug_table_v1';

const BALANCE_DEBUG_FIELDS = [
  { key: 'enemySpeed', label: 'ENEMY SPEED', step: 0.02, min: 0.5, max: 4.0, decimals: 2, integer: false },
  { key: 'bulletSpeed', label: 'BULLET SPEED', step: 0.05, min: 1.0, max: 8.0, decimals: 2, integer: false },
  { key: 'shootCooldown', label: 'SHOOT COOLDOWN', step: 10, min: 200, max: 1400, decimals: 0, integer: true },
  { key: 'diveChance', label: 'DIVE CHANCE', step: 0.0002, min: 0.0, max: 0.03, decimals: 4, integer: false },
  { key: 'maxDivers', label: 'MAX DIVERS', step: 1, min: 0, max: 6, decimals: 0, integer: true },
  { key: 'diveSpeed', label: 'DIVE SPEED', step: 0.05, min: 1.0, max: 8.0, decimals: 2, integer: false }
];

let balanceDebugEnabled = false;
let balanceDebugFieldIndex = 0;
let balanceDebugNotice = '';
let balanceDebugNoticeUntil = 0;

function setBalanceDebugNotice(message, durationMs = 1800) {
  balanceDebugNotice = message;
  balanceDebugNoticeUntil = globalTime + durationMs;
}

function normalizeBalanceFieldValue(field, rawValue, fallbackValue) {
  const numeric = Number(rawValue);
  if (!Number.isFinite(numeric)) return fallbackValue;
  const clamped = Math.max(field.min, Math.min(field.max, numeric));
  return field.integer ? Math.round(clamped) : clamped;
}

function saveBalanceDebugTable() {
  try {
    localStorage.setItem(BALANCE_DEBUG_STORAGE_KEY, JSON.stringify(DIFFICULTY_TABLE));
  } catch (e) {}
}

function clearSavedBalanceDebugTable() {
  try {
    localStorage.removeItem(BALANCE_DEBUG_STORAGE_KEY);
  } catch (e) {}
}

function loadSavedBalanceDebugTable() {
  try {
    const raw = localStorage.getItem(BALANCE_DEBUG_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    BALANCE_DEBUG_FIELDS.forEach(field => {
      const incoming = parsed[field.key];
      if (!Array.isArray(incoming)) return;

      for (let i = 0; i < 20; i++) {
        const fallbackValue = DEFAULT_DIFFICULTY_TABLE[field.key][i];
        DIFFICULTY_TABLE[field.key][i] = normalizeBalanceFieldValue(field, incoming[i], fallbackValue);
      }
    });
  } catch (e) {}
}

function getSerializableBalanceDebugTable() {
  const data = {};
  BALANCE_DEBUG_FIELDS.forEach(field => {
    data[field.key] = DIFFICULTY_TABLE[field.key].slice(0, 20);
  });
  return data;
}

function applyImportedBalanceDebugTable(parsed) {
  if (!parsed || typeof parsed !== 'object') return false;

  let changed = false;
  BALANCE_DEBUG_FIELDS.forEach(field => {
    const incoming = parsed[field.key];
    if (!Array.isArray(incoming) || incoming.length < 20) return;

    for (let i = 0; i < 20; i++) {
      DIFFICULTY_TABLE[field.key][i] = normalizeBalanceFieldValue(
        field,
        incoming[i],
        DIFFICULTY_TABLE[field.key][i]
      );
    }
    changed = true;
  });

  return changed;
}

function exportBalanceDebugJson() {
  const json = JSON.stringify(getSerializableBalanceDebugTable());

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(json)
      .then(() => setBalanceDebugNotice('BALANCE JSON COPIADO'))
      .catch(() => {
        window.prompt('Copia este JSON de balance:', json);
        setBalanceDebugNotice('BALANCE JSON LISTO');
      });
    return;
  }

  window.prompt('Copia este JSON de balance:', json);
  setBalanceDebugNotice('BALANCE JSON LISTO');
}

function importBalanceDebugJson() {
  const raw = window.prompt('Pega JSON de balance:');
  if (!raw) {
    setBalanceDebugNotice('IMPORT CANCELADO');
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!applyImportedBalanceDebugTable(parsed)) {
      setBalanceDebugNotice('JSON INVALIDO');
      return;
    }
    saveBalanceDebugTable();
    setBalanceDebugNotice('BALANCE IMPORTADO');
  } catch (e) {
    setBalanceDebugNotice('ERROR DE JSON');
  }
}

function isBalanceDebugEnabled() {
  return balanceDebugEnabled;
}

function getBalanceDebugLevel() {
  const currentLevel = Number.isFinite(level) ? level : 1;
  return Math.max(1, Math.min(20, Math.floor(currentLevel)));
}

function getBalanceFieldValue(field, levelNum) {
  const idx = levelNum - 1;
  return DIFFICULTY_TABLE[field.key][idx];
}

function setBalanceFieldValue(field, levelNum, rawValue) {
  const idx = levelNum - 1;
  DIFFICULTY_TABLE[field.key][idx] = normalizeBalanceFieldValue(field, rawValue, DIFFICULTY_TABLE[field.key][idx]);
  saveBalanceDebugTable();
}

function adjustBalanceField(delta) {
  const field = BALANCE_DEBUG_FIELDS[balanceDebugFieldIndex];
  const levelNum = getBalanceDebugLevel();
  const currentValue = getBalanceFieldValue(field, levelNum);
  setBalanceFieldValue(field, levelNum, currentValue + field.step * delta);
}

function cycleBalanceDebugField(delta) {
  const count = BALANCE_DEBUG_FIELDS.length;
  balanceDebugFieldIndex = (balanceDebugFieldIndex + delta + count) % count;
}

function resetBalanceDebugFieldAtLevel() {
  const field = BALANCE_DEBUG_FIELDS[balanceDebugFieldIndex];
  const levelNum = getBalanceDebugLevel();
  const idx = levelNum - 1;
  DIFFICULTY_TABLE[field.key][idx] = DEFAULT_DIFFICULTY_TABLE[field.key][idx];
  saveBalanceDebugTable();
}

function resetBalanceDebugLevel() {
  const levelNum = getBalanceDebugLevel();
  const idx = levelNum - 1;

  BALANCE_DEBUG_FIELDS.forEach(field => {
    DIFFICULTY_TABLE[field.key][idx] = DEFAULT_DIFFICULTY_TABLE[field.key][idx];
  });
  saveBalanceDebugTable();
}

function resetAllBalanceDebugChanges() {
  BALANCE_DEBUG_FIELDS.forEach(field => {
    for (let i = 0; i < 20; i++) {
      DIFFICULTY_TABLE[field.key][i] = DEFAULT_DIFFICULTY_TABLE[field.key][i];
    }
  });
  clearSavedBalanceDebugTable();
}

function toggleBalanceDebugPanel() {
  balanceDebugEnabled = !balanceDebugEnabled;
}

function handleBalanceDebugKeydown(e) {
  if (e.code === 'F2') {
    toggleBalanceDebugPanel();
    e.preventDefault();
    return true;
  }

  if (!balanceDebugEnabled) return false;
  if (state !== 'playing' && state !== 'paused') return false;

  if (e.code === 'KeyQ') {
    cycleBalanceDebugField(-1);
    e.preventDefault();
    return true;
  }

  if (e.code === 'KeyE') {
    cycleBalanceDebugField(1);
    e.preventDefault();
    return true;
  }

  if (e.code === 'KeyZ') {
    adjustBalanceField(-1);
    e.preventDefault();
    return true;
  }

  if (e.code === 'KeyX') {
    adjustBalanceField(1);
    e.preventDefault();
    return true;
  }

  if (e.code === 'KeyR') {
    if (e.shiftKey && e.ctrlKey) resetAllBalanceDebugChanges();
    else if (e.shiftKey) resetBalanceDebugLevel();
    else resetBalanceDebugFieldAtLevel();
    e.preventDefault();
    return true;
  }

  if (e.code === 'KeyC' && e.shiftKey && e.ctrlKey) {
    exportBalanceDebugJson();
    e.preventDefault();
    return true;
  }

  if (e.code === 'KeyV' && e.shiftKey && e.ctrlKey) {
    importBalanceDebugJson();
    e.preventDefault();
    return true;
  }

  return false;
}

function formatBalanceDebugValue(field, value) {
  if (field.integer) return String(Math.round(value));
  return Number(value).toFixed(field.decimals);
}

function drawBalanceDebugOverlay(ctx) {
  if (!balanceDebugEnabled) return;
  if (state !== 'playing' && state !== 'paused') return;

  const levelNum = getBalanceDebugLevel();
  const panelX = 10;
  const panelY = 84;
  const panelW = W - 20;
  const panelH = 174;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = '#0ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  ctx.textAlign = 'left';
  ctx.font = '8px "Press Start 2P"';
  ctx.fillStyle = '#0ff';
  ctx.fillText(`BALANCE DEBUG L${levelNum}`, panelX + 8, panelY + 14);

  let y = panelY + 30;
  BALANCE_DEBUG_FIELDS.forEach((field, index) => {
    const value = getBalanceFieldValue(field, levelNum);
    const isSelected = index === balanceDebugFieldIndex;
    const linePrefix = isSelected ? '> ' : '  ';
    ctx.fillStyle = isSelected ? '#ff0' : '#bbb';
    ctx.fillText(`${linePrefix}${field.label}: ${formatBalanceDebugValue(field, value)}`, panelX + 8, y);
    y += 16;
  });

  ctx.fillStyle = '#777';
  ctx.fillText('Q/E FIELD  Z/X +/-  R FIELD  SHIFT+R LEVEL  CTRL+SHIFT+R ALL', panelX + 8, panelY + panelH - 24);
  ctx.fillText('CTRL+SHIFT+C EXPORT  CTRL+SHIFT+V IMPORT  F2 CLOSE', panelX + 8, panelY + panelH - 10);

  if (globalTime < balanceDebugNoticeUntil) {
    ctx.fillStyle = '#0f0';
    ctx.fillText(balanceDebugNotice, panelX + 8, panelY + panelH - 38);
  }
  ctx.restore();
}

loadSavedBalanceDebugTable();
