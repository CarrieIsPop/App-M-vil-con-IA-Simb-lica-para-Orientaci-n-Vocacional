import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.log("⚠️ ATENCIÓN: GEMINI_API_KEY no suministrada. El Consejero Vocacional de IA correrá en modo demostrativo/simulado.");
}

// 🩺 Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: apiKey ? "real-gemini" : "demo" });
});

// 🧠 Dedicated AI Career Counselor conversational proxy endpoint
app.post("/api/advisor", async (req, res) => {
  const { careerName, studentAnswers, chatHistory } = req.body;

  if (!careerName) {
    return res.status(400).json({ error: "careerName es requerido para el asesor de orientación." });
  }

  const promptContext = `
Eres la IA Consejera de Vocatio, una psicóloga y orientadora profesional entusiasta, amigable, súper empática y experta en orientar a jóvenes. El estudiante completó un árbol de decisiones simbólico y obtuvo la sugerencia de carrera: **${careerName}**.

Historial de respuestas del test vocacional del estudiante:
${studentAnswers ? JSON.stringify(studentAnswers, null, 2) : "No disponibles"}

INSTRUCCIONES CLAVE DE RESPUESTA:
- Responde siempre en idioma Español.
- Felicítalo con entusiasmo juvenil y explícale con pasión de qué trata la carrera de ${careerName}.
- Describe el mercado real laboral de manera optimista pero objetiva.
- Comparte 3 consejos prácticos, realistas y motivadores para su primer año de estudio universitario.
- No uses tecnicismos psicológicos secos. Sé un mentor inspirador y accesible.
- Usa formato Markdown legible con negritas, viñetas y emojis moderados para estructurar tu conversación.
- Termina con una breve pregunta interactiva para animar al estudiante a chatear contigo. (Por ejemplo, "¿Te emociona esta carrera o tienes dudas sobre los salarios o materias?").
`;

  if (!aiClient) {
    // Elegant fallback simulation response if API key is missing
    const simulatedResponse = `
### 🎓 ¡Felicidades! Tu perfil encaja perfectamente en: **${careerName}**

¡Hola! Soy tu **Asesor Vocacional Virtual de Vocatio**. He analizado el camino de decisiones que tomaste en nuestro sistema experto, y déjame decirte que tienes un perfil fantástico y muy demandado en la actualidad.

#### 🌍 ¿Por qué es una elección brillante?
La carrera de **${careerName}** te permitirá explotar justamente esas habilidades que marcaste en el test: tomar decisiones rápidas, amar la creatividad combinada y resolver problemas bajo presión intelectual. En la economía digital actual, los profesionales de este sector son sumamente cotizados y participan en proyectos transfronterizos con salarios iniciales muy atractivos.

#### 💡 Mis 3 consejos de oro para tu etapa universitaria:
1. **Adelántate al aula**: No te quedes solo con lo que explica el catedrático. Investiga blogs especializados, cursos interactivos en línea y podcasts de tendencias.
2. **Construye proyectos reales**: Empieza un portafolio digital desde el semestre uno. Las empresas hoy valoran un proyecto terminado y publicado más que una excelente boleta de calificaciones.
3. **Desarrolla habilidades blandas (Soft Skills)**: Practica hablar en público, gestiona tu tiempo y aprende a negociar o trabajar en células colaborativas interfuncionales.

*(Nota: Este es un mensaje simulado por Vocatio porque no hay una API de Gemini activa en este servidor de pruebas, ¡pero puedes ver lo increíble que se adapta a tu perfil!)*

**¿Qué es lo que más te llama la atención de esta carrera, las oportunidades de trabajo o lo que vas a aprender?**
`;
    return res.json({ text: simulatedResponse });
  }

  try {
    // Map the incoming chat conversation turns to the Gemini contents API format
    let contents = [];

    if (!chatHistory || chatHistory.length === 0) {
      // First model response start with the system instruction context
      contents.push({
        role: "user",
        parts: [{ text: `Hola, soy un estudiante con perfil para ${careerName}. Háblame de la carrera.` }]
      });
    } else {
      // Append past turns
      contents = chatHistory.map((item: any) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.text }]
      }));
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: promptContext,
        temperature: 0.8
      }
    });

    const aiText = response.text || "Disculpa, no pude procesar la guía vocacional en este momento. Intenta de nuevo.";
    res.json({ text: aiText });

  } catch (error: any) {
    console.error("Error calling Gemini API on Server:", error);
    res.status(500).json({
      error: "Error interno del servidor al consultar a Gemini",
      details: error.message
    });
  }
});

// Configure Vite middleware for dev or static server for production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🚀 Vite middleware montado para el modo de desarrollo.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 Servidor estático de producción montado apuntando a /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Vocatio Backend servidor corriendo en puerto:${PORT}`);
  });
}

setupViteOrStatic();
