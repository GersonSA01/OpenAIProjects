const OpenAI = require('openai');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido');
  }

  const { apiKey, messages } = req.body;
  if (!apiKey || !messages) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al contactar con OpenAI.' });
  }
};
