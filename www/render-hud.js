// =====================
// GALAXY RAIDERS - render-hud.js
// =====================

// --- DIBUJAR HIGH SCORES EN EL MENÚ ---
function drawHighScoresInMenu() {
  // Asegurar 10 slots
  while (highScores.length < 10) highScores.push(0);
  while (highNames.length < 10) highNames.push('---');
  while (highContinues.length < 10) highContinues.push(0);

  // Encabezado del ranking
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '14px "Press Start 2P"';
  ctx.fillText('HIGH SCORES', W / 2, 118);

  // Columnas (sin recuadros, solo alineación pro)
  const leftX  = Math.floor(W * 0.20);   // Rank
  const nameX  = Math.floor(W * 0.28);   // Name
  const scoreX = Math.floor(W * 0.82);   // Score
  const baseY  = 160;
  const stepY  = 30;

  // Tabla (bien grande)
  ctx.font = '12px "Press Start 2P"';

  for (let i = 0; i < 10; i++) {
    const y = baseY + i * stepY;
    const rank = (i + 1).toString().padStart(2, '0');
    const name = (highNames[i] || '---').toString().slice(0, 8);
    const score = (highScores[i] || 0);
    const cont = (highContinues[i] || 0);

    // Colores por posición (clásico: oro/plata/bronce, el resto limpio)
    let color = '#9aa';
    if (i === 0) color = '#ff0';
    else if (i === 1) color = '#ddd';
    else if (i === 2) color = '#c84';

    // RANK
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(rank + '.', leftX, y);

    // NAME
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(name, nameX, y);

    // SCORE (derecha, grandote)
    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.fillText(String(score).padStart(7, ' '), scoreX, y);

    // Continues: visible pero "con clase"
    // Si usó continues, le ponemos un pequeño marcador al lado del score:
    // ejemplo: "  0123456  x2"
    if (cont > 0) {
      ctx.fillStyle = '#f55';
      ctx.textAlign = 'left';
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText('x' + cont, scoreX + 14, y);
      ctx.font = '12px "Press Start 2P"';
    }
  }

  // Nota sutil (abajo)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#666';
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('xN = CONTINUES USED', W / 2, H - 92);
}
