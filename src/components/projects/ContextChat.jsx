import { useState } from 'react';
import axios from 'axios';

export default function ContextChat({ apiKey }) {
  const [contexto, setContexto] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [iniciado, setIniciado] = useState(false);

  const iniciarChat = () => {
    if (!contexto.trim()) {
      setError('⚠️ Debes definir un contexto antes de iniciar la conversación.');
      return;
    }
    setMessages([{ role: 'system', content: contexto }]);
    setIniciado(true);
    setError('');
  };

  const enviarMensaje = async () => {
    setError('');

    if (!input.trim()) {
      setError('⚠️ El mensaje no puede estar vacío.');
      return;
    }

    if (!apiKey || apiKey.trim() === '') {
      setError('⚠️ Proporciona una API Key válida.');
      return;
    }

    const nuevoMensaje = { role: 'user', content: input };
    const nuevaConversacion = [...messages, nuevoMensaje];

    setMessages(nuevaConversacion);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/contextchat', {
        apiKey,
        messages: nuevaConversacion,
      });

      const respuesta = res.data.reply;
      setMessages([...nuevaConversacion, { role: 'assistant', content: respuesta }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...nuevaConversacion,
        {
          role: 'assistant',
          content: '❌ Error al contactar con OpenAI. Verifica tu clave o intenta más tarde.',
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border border-gray-300 rounded bg-white">
      {!iniciado ? (
        <>
          <textarea
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Ejemplo: Eres un experto en recetas y darás respuestas cortas con tono amigable."
          />
          {error && (
            <div className="text-red-600 text-sm mb-2 bg-red-100 p-2 rounded border border-red-300">
              {error}
            </div>
          )}
          <button
            onClick={iniciarChat}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Iniciar Chat
          </button>
        </>
      ) : (
        <>
          <div className="h-48 overflow-y-auto border border-gray-200 p-2 mb-2 bg-gray-50">
            {messages
              .filter((msg) => msg.role !== 'system')
              .map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span
                    className={`px-4 py-2 rounded-lg text-sm text-cyan-900 max-w-[50%] break-words ${
                      msg.role === 'user' ? 'bg-cyan-100' : 'bg-cyan-200'
                    }`}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-2 bg-red-100 p-2 rounded border border-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
              className="flex-1 border p-2 rounded text-gray-700"
              placeholder="Escribe tu mensaje..."
            />
            <button
              onClick={enviarMensaje}
              className="bg-cyan-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Enviar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
