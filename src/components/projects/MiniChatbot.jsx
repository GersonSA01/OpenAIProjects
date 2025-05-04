import { useState } from 'react';
import axios from 'axios';

export default function MiniChatbot({ apiKey }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const res = await axios.post('/api/minichat', {
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
  <div className="h-48 overflow-y-auto border border-gray-200 p-2 mb-2 bg-gray-50">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <span
          className={`px-4 py-2 rounded-lg text-sm text-cyan-900 max-w-[50%] break-words ${
            msg.role === 'user'
              ? 'bg-cyan-100'
              : 'bg-cyan-200'
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
</div>

  );
}
