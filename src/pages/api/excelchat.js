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
      content: `Eres un generador de SQL. A partir de una pregunta en lenguaje natural, responde solo con una consulta SQL que se pueda ejecutar sobre una tabla llamada "data". No expliques nada. Solo da la consulta.`,
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
      temperature: 0.3,
      max_tokens: 100, // aún más control de longitud
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contactar con OpenAI.' });
  }
}
