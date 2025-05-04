const MiniChatbotPackage = {
  files: {
    "public/index.html": `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Mini Chatbot</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="chat-container">
    <h2 class="titulo-chat">Mini Chatbot con OpenAI</h2>
    <div id="messages"></div>
    <div class="input-area">
      <input id="input" placeholder="Escribe tu mensaje..." />
      <button onclick="enviarMensaje()">Enviar</button>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,

    "public/styles.css": `body {
  background-color: #0f172a;
  margin: 0;
  padding: 2rem;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  color: white;
}
#chat-container {
  background: #1e1e1e;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  height: 450px;
}
.titulo-chat {
  margin-top: 0;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
  color: #67e8f9;
}
#messages {
  flex-grow: 1;
  max-height: 100%;
  overflow-y: auto;
  margin-bottom: 1rem;
  background: #e0f2fe;
  padding: 0.5rem;
  border-radius: 0.25rem;
}
.message {
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  max-width: 50%;
  word-wrap: break-word;
}
.user {
  background-color: #bae6fd;
  color: #0369a1;
  align-self: flex-end;
  text-align: right;
  margin-left: auto;
}
.bot {
  background-color: #67e8f9;
  color: #083344;
  align-self: flex-start;
  text-align: left;
}
.input-area {
  display: flex;
  gap: 0.5rem;
}
.input-area input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
}
.input-area button {
  background-color: #0ea5e9;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}`,

    "public/script.js": `async function enviarMensaje() {
  const input = document.getElementById('input');
  const mensaje = input.value;
  if (!mensaje.trim()) {
    alert("⚠️ El mensaje no puede estar vacío.");
    return;
  }

  const mensajes = document.getElementById('messages');
  const msgUsuario = document.createElement('div');
  msgUsuario.className = 'message user';
  msgUsuario.textContent = mensaje;
  mensajes.appendChild(msgUsuario);

  input.value = '';

  const res = await fetch('/api/minichat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: 'sk-*************',
      messages: [{ role: 'user', content: mensaje }]
    })
  });

  const data = await res.json();
  const respuesta = document.createElement('div');
  respuesta.className = 'message bot';
  respuesta.textContent = data.reply;
  mensajes.appendChild(respuesta);
}`,

    "api/minichat.js": `const OpenAI = require('openai');

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

    const systemPrompt = {
      role: 'system',
      content: 'Responde de manera amigable y con respuestas breves.',
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemPrompt, ...messages],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al contactar con OpenAI.' });
  }
};`,

    "server.js": `const express = require('express');
const app = express();
const path = require('path');
const minichat = require('./api/minichat');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/minichat', minichat);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(\`🚀 Servidor corriendo en http://localhost:\${PORT}\`);
});`
  },
  description: "Este proyecto es un chatbot minimalista basado en OpenAI que permite conversar en tiempo real desde una interfaz web. Utiliza Node.js para gestionar las peticiones y mantener segura la clave API del usuario.",


  guide: (
    <div className="bg-blue-100 border-l-4 border-blue-400 text-blue-900 p-4 rounded text-sm mt-4">
      <p className="font-semibold mb-1">📦 Cómo crear e integrar este chatbot con Node.js:</p>
      <ul className="list-disc ml-5">
        <li>Crea una carpeta del proyecto.</li>
        <li>Dentro crea dos carpetas: <code>public/</code> (para el frontend) y <code>api/</code> (para la lógica del backend).</li>
        <li>Agrega el archivo <code>server.js</code> en la raíz del proyecto.</li>
        <li>Ubica <code>index.html</code>, <code>styles.css</code> y <code>script.js</code> en la carpeta <code>public/</code>.</li>
        <li>Agrega <code>minichat.js</code> en la carpeta <code>api/</code>.</li>
        <li>Ejecuta <code>npm install openai express</code> para instalar las dependencias.</li>
        <li>Inicia el servidor con <code>node server.js</code>.</li>
        <li>Abre <code>http://localhost:3001</code> en tu navegador para usar el chatbot.</li>
        <li>🔐 Reemplaza <code>&lt;TU_API_KEY&gt;</code> con una clave válida desde <code>platform.openai.com</code>.</li>
      </ul>
      <p className="mt-2 text-xs italic text-gray-600">
        ⚠️ No compartas tu API Key públicamente ni la incluyas en el frontend en producción.
      </p>
    </div>
  )
};  

export default MiniChatbotPackage;
