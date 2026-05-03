const fs = require("fs");

const task = fs.readFileSync("ai/TASK.md", "utf-8");

console.log("===== TASK =====");
console.log(task);

// Ejemplo real: modificar archivo de juego
const filePath = "www/index.html";

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, "utf-8");

  // cambio simple y seguro (no rompe nada)
  if (!content.includes("AI_PATCH")) {
    content += "\n<!-- AI_PATCH: modificación automática -->\n";
    fs.writeFileSync(filePath, content);
    console.log("index.html modificado");
  } else {
    console.log("Ya estaba modificado");
  }
}

// resultado
fs.writeFileSync("ai/RESULT.md", "IA ejecutó cambio real en código");

console.log("Proceso terminado");
