var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var apiKey = process.env.GEMINI_API_KEY;
var aiClient = null;
if (apiKey) {
  aiClient = new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
} else {
  console.log("\u26A0\uFE0F ATENCI\xD3N: GEMINI_API_KEY no suministrada. El Consejero Vocacional de IA correr\xE1 en modo demostrativo/simulado.");
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: apiKey ? "real-gemini" : "demo" });
});
app.post("/api/advisor", async (req, res) => {
  const { careerName, studentAnswers, chatHistory } = req.body;
  if (!careerName) {
    return res.status(400).json({ error: "careerName es requerido para el asesor de orientaci\xF3n." });
  }
  const promptContext = `
Eres la IA Consejera de Vocatio, una psic\xF3loga y orientadora profesional entusiasta, amigable, s\xFAper emp\xE1tica y experta en orientar a j\xF3venes. El estudiante complet\xF3 un \xE1rbol de decisiones simb\xF3lico y obtuvo la sugerencia de carrera: **${careerName}**.

Historial de respuestas del test vocacional del estudiante:
${studentAnswers ? JSON.stringify(studentAnswers, null, 2) : "No disponibles"}

INSTRUCCIONES CLAVE DE RESPUESTA:
- Responde siempre en idioma Espa\xF1ol.
- Felic\xEDtalo con entusiasmo juvenil y expl\xEDcale con pasi\xF3n de qu\xE9 trata la carrera de ${careerName}.
- Describe el mercado real laboral de manera optimista pero objetiva.
- Comparte 3 consejos pr\xE1cticos, realistas y motivadores para su primer a\xF1o de estudio universitario.
- No uses tecnicismos psicol\xF3gicos secos. S\xE9 un mentor inspirador y accesible.
- Usa formato Markdown legible con negritas, vi\xF1etas y emojis moderados para estructurar tu conversaci\xF3n.
- Termina con una breve pregunta interactiva para animar al estudiante a chatear contigo. (Por ejemplo, "\xBFTe emociona esta carrera o tienes dudas sobre los salarios o materias?").
`;
  if (!aiClient) {
    const simulatedResponse = `
### \u{1F393} \xA1Felicidades! Tu perfil encaja perfectamente en: **${careerName}**

\xA1Hola! Soy tu **Asesor Vocacional Virtual de Vocatio**. He analizado el camino de decisiones que tomaste en nuestro sistema experto, y d\xE9jame decirte que tienes un perfil fant\xE1stico y muy demandado en la actualidad.

#### \u{1F30D} \xBFPor qu\xE9 es una elecci\xF3n brillante?
La carrera de **${careerName}** te permitir\xE1 explotar justamente esas habilidades que marcaste en el test: tomar decisiones r\xE1pidas, amar la creatividad combinada y resolver problemas bajo presi\xF3n intelectual. En la econom\xEDa digital actual, los profesionales de este sector son sumamente cotizados y participan en proyectos transfronterizos con salarios iniciales muy atractivos.

#### \u{1F4A1} Mis 3 consejos de oro para tu etapa universitaria:
1. **Adel\xE1ntate al aula**: No te quedes solo con lo que explica el catedr\xE1tico. Investiga blogs especializados, cursos interactivos en l\xEDnea y podcasts de tendencias.
2. **Construye proyectos reales**: Empieza un portafolio digital desde el semestre uno. Las empresas hoy valoran un proyecto terminado y publicado m\xE1s que una excelente boleta de calificaciones.
3. **Desarrolla habilidades blandas (Soft Skills)**: Practica hablar en p\xFAblico, gestiona tu tiempo y aprende a negociar o trabajar en c\xE9lulas colaborativas interfuncionales.

*(Nota: Este es un mensaje simulado por Vocatio porque no hay una API de Gemini activa en este servidor de pruebas, \xA1pero puedes ver lo incre\xEDble que se adapta a tu perfil!)*

**\xBFQu\xE9 es lo que m\xE1s te llama la atenci\xF3n de esta carrera, las oportunidades de trabajo o lo que vas a aprender?**
`;
    return res.json({ text: simulatedResponse });
  }
  try {
    let contents = [];
    if (!chatHistory || chatHistory.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: `Hola, soy un estudiante con perfil para ${careerName}. H\xE1blame de la carrera.` }]
      });
    } else {
      contents = chatHistory.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }]
      }));
    }
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: promptContext,
        temperature: 0.8
      }
    });
    const aiText = response.text || "Disculpa, no pude procesar la gu\xEDa vocacional en este momento. Intenta de nuevo.";
    res.json({ text: aiText });
  } catch (error) {
    console.error("Error calling Gemini API on Server:", error);
    res.status(500).json({
      error: "Error interno del servidor al consultar a Gemini",
      details: error.message
    });
  }
});
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("\u{1F680} Vite middleware montado para el modo de desarrollo.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("\u{1F4E6} Servidor est\xE1tico de producci\xF3n montado apuntando a /dist.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u2728 Vocatio Backend servidor corriendo en puerto:${PORT}`);
  });
}
setupViteOrStatic();
//# sourceMappingURL=server.cjs.map
