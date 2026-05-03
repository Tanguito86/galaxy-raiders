const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const wwwDir = path.join(process.cwd(), "www");

function getJsFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getJsFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".js")) {
      return [fullPath];
    }

    return [];
  });
}

try {
  const files = getJsFiles(wwwDir);

  if (files.length === 0) {
    console.error("No se encontraron archivos JS en www/");
    process.exit(1);
  }

  for (const file of files) {
    execSync(`node --check "${file}"`, {
      stdio: "inherit",
      shell: true
    });
  }

  console.log("Validación JS OK");
} catch (error) {
  console.error("Error de validación JS");
  process.exit(1);
}
