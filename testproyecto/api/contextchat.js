const OpenAI = require("openai");
const { Readable } = require("stream");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido, usa POST." });
  }

  const { apiKey, contexto } = req.body || {};

  if (!apiKey) {
    return res.status(400).json({ error: "Falta el parámetro apiKey." });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Falta el archivo de audio." });
  }

  try {
    const openai = new OpenAI({ apiKey: apiKey.trim() });

    // Convertir buffer en stream para Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: Readable.from(req.file.buffer),
      model: "whisper-1",
    });

    const mensajes = [
      {
        role: "system",
        content:
          contexto?.trim() ||
          "Responde en base al contexto proporcionado por el usuario.",
      },
      { role: "user", content: transcription.text },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: mensajes, // 👈 usa 'mensajes' aquí
    });

    return res.json({
      transcript: transcription.text,
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ ERROR EN voicechat.js:", err);

    if (err.code === "invalid_api_key" || err.status === 401) {
      return res
        .status(401)
        .json({ error: "API Key incorrecta o no autorizada." });
    }

    if (err.status === 429) {
      return res.status(429).json({
        error: "Demasiadas solicitudes. Espera un momento antes de reintentar.",
      });
    }

    return res
      .status(500)
      .json({ error: "Error inesperado al procesar audio.", detalle: err.message });
  }
};
