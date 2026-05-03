const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const task = fs.readFileSync("ai/TASK.md", "utf-8");

async function run() {
  try {
    console.log("===== TASK =====");
    console.log(task);

    const response = await client.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "system",
          content: "Sos un desarrollador que modifica archivos de un juego HTML canvas sin romper gameplay."
        },
        {
          role: "user",
          content: `Tarea:\n${task}\n\nDecime qué archivo modificar y devolveme SOLO el contenido nuevo del archivo.`
        }
      ]
    });

    const output = response.output_text;

    if (!output) {
      throw new Error("La IA no devolvio contenido");
    }

    fs.writeFileSync("ai/RESULT.md", output);

    console.log("Resultado IA generado");
  } catch (err) {
    console.error("Error IA:", err.message);
    process.exit(1);
  }
}

run();