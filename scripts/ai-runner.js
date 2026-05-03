const fs = require("fs");
const path = require("path");

const taskPath = "ai/TASK.md";
const resultPath = "ai/RESULT.md";

const task = fs.readFileSync(taskPath, "utf-8");

console.log("===== TASK =====");
console.log(task);

function appendOnce(filePath, marker, text) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`No existe el archivo: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");

  if (content.includes(marker)) {
    console.log(`Ya aplicado: ${marker}`);
    return false;
  }

  fs.writeFileSync(filePath, content + "\n" + text + "\n");
  console.log(`Modificado: ${filePath}`);
  return true;
}

const lowerTask = task.toLowerCase();

let changes = [];

if (lowerTask.includes("index") || lowerTask.includes("html")) {
  const changed = appendOnce(
    "www/index.html",
    "AI_PATCH_HTML",
    "<!-- AI_PATCH_HTML: cambio automático desde TASK.md -->"
  );

  if (changed) changes.push("www/index.html");
}

if (lowerTask.includes("css") || lowerTask.includes("estilo") || lowerTask.includes("visual")) {
  const changed = appendOnce(
    "www/style.css",
    "AI_PATCH_CSS",
    "/* AI_PATCH_CSS: cambio automático desde TASK.md */"
  );

  if (changed) changes.push("www/style.css");
}

if (lowerTask.includes("javascript") || lowerTask.includes("js") || lowerTask.includes("codigo")) {
  const candidateFiles = [
    "www/game.js",
    "www/draw.js",
    "www/entities.js",
    "www/update-boss.js"
  ];

  const target = candidateFiles.find((file) => fs.existsSync(file));

  if (target) {
    const changed = appendOnce(
      target,
      "AI_PATCH_JS",
      "// AI_PATCH_JS: cambio automático desde TASK.md"
    );

    if (changed) changes.push(target);
  } else {
    console.log("No se encontró archivo JS candidato.");
  }
}

if (changes.length === 0) {
  fs.writeFileSync(
    resultPath,
    `# Resultado IA

No se aplicaron cambios.

Motivo:
TASK.md no contiene una instrucción reconocida.

Palabras reconocidas:
- html / index
- css / estilo / visual
- javascript / js / codigo
`
  );

  console.log("No hubo cambios.");
} else {
  fs.writeFileSync(
    resultPath,
    `# Resultado IA

Cambios aplicados automáticamente.

Archivos modificados:
${changes.map((file) => `- ${file}`).join("\n")}
`
  );

  console.log("Cambios aplicados:", changes.join(", "));
}
