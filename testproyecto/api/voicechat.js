const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

module.exports = async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido, usa POST." });
  }

  const { apiKey, contexto } = req.body || {};
  if (!apiKey) return res.status(400).json({ error: "Falta el parámetro apiKey." });
  if (!req.file) return res.status(400).json({ error: "Falta el archivo de audio." });

  try {
    const openai = new OpenAI({ apiKey: apiKey.trim() });

    // Guardar temporal
    const tempPath = path.join(__dirname, "temp_audio.webm");
    fs.writeFileSync(tempPath, req.file.buffer);

    // Transcribir
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
    });
    fs.unlinkSync(tempPath);

    // Conversación con respuesta breve
    const mensajes = [
      {
        role: "system",
        content:
          (contexto?.trim() || "Responde en base al contexto proporcionado.") +
          " Sé breve, responde en máximo 2 frases.",
      },
      { role: "user", content: transcription.text },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: mensajes,
    });

    const reply = completion.choices[0].message.content.trim();

    // Generar voz
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: reply,
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());

    return res.json({
      transcript: transcription.text,
      reply,
      audio: audioBuffer.toString("base64"), // 👈 frontend lo reproduce
    });
  } catch (err) {
    console.error("❌ ERROR EN voicechat.js:", err);
    return res.status(500).json({
      error: "Error inesperado al procesar audio.",
      detalle: err.message,
    });
  }
};
