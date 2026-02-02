const OpenAI = require('openai');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido');
  }

  const { apiKey, contexto, mensaje } = req.body;
  if (!apiKey || !mensaje) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const mensajes = [
      { role: 'system', content: contexto || 'Responde en base al contexto proporcionado por el usuario.' },
      { role: 'user', content: mensaje }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al contactar con OpenAI.' });
  }
};