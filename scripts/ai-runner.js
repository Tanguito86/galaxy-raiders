const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

const task = fs.readFileSync("ai/TASK.md", "utf-8");

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
            "Sos un desarrollador que modifica archivos de un juego HTML canvas sin romper gameplay."
        },
        {
          role: "user",
          content:
            `Tarea:\n${task}\n\n` +
            "Devolve una respuesta breve con: archivo recomendado, resumen del cambio y riesgos. No modifiques archivos todavia."
        }
      ],
      stream: false
    });

    const output = response.choices?.[0]?.message?.content;

    if (!output) {
      throw new Error("DeepSeek no devolvio contenido");
    }

    fs.writeFileSync("ai/RESULT.md", output);
    console.log("Resultado IA generado con DeepSeek");
  } catch (err) {
    console.error("Error DeepSeek:", err.message);
    process.exit(1);
  }
}

run();