const fs = require("fs");

const task = fs.readFileSync("ai/TASK.md", "utf-8");

console.log("===== TASK =====");
console.log(task);

// Simulación de IA (después se conecta a Codex)
const output = `
# Resultado IA

Tarea procesada automáticamente.

Resumen:
- Se leyó TASK.md
- Se ejecutó pipeline base
`;

// Escribir resultado
fs.writeFileSync("ai/RESULT.md", output);

console.log("Archivo RESULT.md generado");
