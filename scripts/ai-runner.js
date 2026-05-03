const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

const task = fs.readFileSync("ai/TASK.md", "utf-8");

function safeAppend(filePath, marker, text) {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf-8");

  if (content.includes(marker)) return false;

  fs.writeFileSync(filePath, content + "\n" + text + "\n");
  return true;
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
            "Sos un desarrollador de juegos HTML Canvas. Responde en JSON."
        },
        {
          role: "user",
          content: `
TAREA:
${task}

Devuelve JSON:

{
  "actions": [
    {
      "type": "append_html",
      "marker": "AI_PATCH_HTML"
    },
    {
      "type": "append_css",
      "marker": "AI_PATCH_CSS"
    }
  ]
}

Tipos permitidos:
- append_html
- append_css
- none

Si no estás seguro:
{
  "actions": [{"type": "none"}]
}
`
        }
      ]
    });

    const raw = response.choices?.[0]?.message?.content;

    console.log("===== IA RESPONSE =====");
    console.log(raw);

    const json = raw.match(/\{[\s\S]*\}/);
    if (!json) throw new Error("No JSON");

    const parsed = JSON.parse(json[0]);

    let changes = [];

    for (const action of parsed.actions || []) {
      if (action.type === "append_html") {
        const ok = safeAppend(
          "www/index.html",
          action.marker || "AI_PATCH_HTML",
          "<!-- AI_PATCH_HTML: agregado automatico -->"
        );
        if (ok) changes.push("www/index.html");
      }

      if (action.type === "append_css") {
        const ok = safeAppend(
          "www/style.css",
          action.marker || "AI_PATCH_CSS",
          "/* AI_PATCH_CSS: agregado automatico */"
        );
        if (ok) changes.push("www/style.css");
      }
    }

    const result = `# Resultado IA

Cambios:
${changes.length ? changes.join("\n") : "ninguno"}
`;

    fs.writeFileSync("ai/RESULT.md", result);

    console.log("Cambios aplicados:", changes);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

run();