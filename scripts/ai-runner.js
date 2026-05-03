const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

const task = fs.readFileSync("ai/TASK.md", "utf-8");
const rules = fs.existsSync("ai/AI_RULES.md")
  ? fs.readFileSync("ai/AI_RULES.md", "utf-8")
  : "";

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No se encontro JSON en la respuesta de DeepSeek");
  }
  return JSON.parse(match[0]);
}

function isAllowedPath(filePath) {
  return (
    filePath.startsWith("www/") ||
    filePath === "ai/RESULT.md"
  );
}

async function run() {
  try {
    console.log("===== TASK =====");
    console.log(task);

    const response = await client.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        {
          role: "system",
          content:
            "Sos un desarrollador experto en juegos HTML Canvas. Debes respetar estrictamente las reglas del proyecto."
        },
        {
          role: "user",
          content: `
REGLAS:
${rules}

TAREA:
${task}

Devolve SOLO JSON valido, sin markdown, sin explicaciones.

Formato obligatorio:
{
  "summary": "resumen breve",
  "files": [
    {
      "path": "www/archivo.ext",
      "content": "contenido completo del archivo"
    }
  ]
}

Condiciones:
- Solo podes modificar archivos dentro de www/ o ai/RESULT.md.
- No cambies gameplay salvo que TASK.md lo pida explicitamente.
- Si no estas seguro, no modifiques www/ y escribi solo ai/RESULT.md.
`
        }
      ],
      stream: false
    });

    const raw = response.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("DeepSeek no devolvio contenido");
    }

    console.log("===== RAW RESPONSE =====");
    console.log(raw);

    const parsed = extractJson(raw);

    if (!Array.isArray(parsed.files)) {
      throw new Error("JSON invalido: falta files[]");
    }

    const changedFiles = [];

    for (const file of parsed.files) {
      if (!file.path || typeof file.content !== "string") {
        throw new Error("JSON invalido: cada file requiere path y content");
      }

      if (!isAllowedPath(file.path)) {
        throw new Error(`Ruta no permitida: ${file.path}`);
      }

      fs.writeFileSync(file.path, file.content);
      changedFiles.push(file.path);
      console.log(`Archivo escrito: ${file.path}`);
    }

    const result = `# Resultado IA

Resumen:
${parsed.summary || "Sin resumen"}

Archivos modificados:
${changedFiles.map((file) => `- ${file}`).join("\n")}
`;

    fs.writeFileSync("ai/RESULT.md", result);

    console.log("Proceso terminado");
  } catch (err) {
    console.error("Error DeepSeek:", err.message);
    process.exit(1);
  }
}

run();