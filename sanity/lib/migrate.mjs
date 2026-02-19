import { createClient } from "next-sanity";
import * as path from "path";
import fs from "fs";

// Cargar variables de entorno manualmente de .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    // Eliminar comentarios y espacios
    const cleanLine = line.split("#")[0].trim();
    if (!cleanLine) return;
    
    const [key, ...valueParts] = cleanLine.split("=");
    if (key && valueParts.length > 0) {
      // Eliminar posibles comillas del valor
      let value = valueParts.join("=").trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key.trim()] = value;
    }
  });
}

// Importar datos dinámicamente para evitar problemas de exportación estática con tsx/esm
// Si no funciona, intenta cargar como JS
let defaultLandingPageData;
try {
  const defaults = await import("./defaults.ts");
  defaultLandingPageData = defaults.defaultLandingPageData;
} catch (e) {
  console.error("❌ Error al cargar defaults.ts:", e.message);
  process.exit(1);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-02-18";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("❌ Faltan variables de entorno: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET o SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false, // Desactivar CDN para que los cambios sean inmediatos
});

async function migrate() {
  console.log("🚀 Iniciando migración de textos a Sanity...");

  try {
    const doc = {
      _type: "landingPage",
      _id: "landingPage",
      ...defaultLandingPageData,
    };

    console.log(`📝 Creando o actualizando el documento 'landingPage' en el dataset '${dataset}'...`);
    
    const result = await client.createOrReplace(doc);
    
    console.log("✅ Migración completada con éxito!");
    console.log("ID del documento:", result._id);
    console.log("Puedes ver tus cambios en el Sanity Studio.");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    process.exit(1);
  }
}

migrate();
