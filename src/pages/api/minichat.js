import OpenAI from 'openai';

export default async function handler(req, res) {
  const { apiKey, messages } = req.body;

  if (!apiKey || !messages) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const systemPrompt = {
      role: 'system',
      content: 'Responde de manera amigable y con respuestas breves.',
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contactar con OpenAI.' });
  }
}
