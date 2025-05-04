const scriptCode = `
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: 'TU_API_KEY' });

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Faltan los mensajes.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.3,
      max_tokens: 100,
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al contactar con OpenAI.' });
  }
});

module.exports = router;

`;

  const ExcelSQLChatbotPackage = {
    files: {
      "public/index.html": `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Excel Chatbot</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="container">
      <h1>Excel Chatbot</h1>
      <p id="status">Sube un archivo Excel para comenzar.</p>
      <input type="file" id="excelInput" accept=".xlsx,.xls" />
      <div id="chatContainer" style="display: none;">
        <textarea id="question" placeholder="Escribe tu pregunta..."></textarea>
        <button id="sendBtn">Enviar</button>
        <p id="sqlQuery"></p>
        <div id="resultTable"></div>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/alasql"></script>
    <script src="script.js"></script>
  </body>
  </html>`,
  
      "public/styles.css": `
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(to bottom right, #e6f0ff, #f0f4f8);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
  }
  
  .container {
    max-width: 800px;
    width: 90%;
    margin: auto;
    background: #ffffff;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 28px;
    color: #004d99;
    margin-bottom: 20px;
    text-align: center;
  }
  
  input[type="file"],
  textarea,
  button {
    display: block;
    width: 100%;
    margin-top: 20px;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  textarea {
    height: 90px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: vertical;
  }
  
  button {
    padding: 12px;
    background: #0077cc;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button:hover {
    background: #005fa3;
  }
  
  #status, #sqlQuery {
    font-size: 14px;
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #f0f8ff;
    border-left: 4px solid #0077cc;
    border-radius: 4px;
  }
  
  table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  
  th {
    background-color: #0077cc;
    color: white;
    text-transform: uppercase;
    font-size: 12px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .hidden {
    display: none;
  }
  `,
  
  "public/script.js": scriptCode, 
  
      "api/excelchat.js": `const OpenAI = require('openai');
  const router = require('express').Router();
  
  const openai = new OpenAI({ apiKey: 'sk-*************' });
  
  router.post('/', async (req, res) => {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: 'Faltan los mensajes.' });
    }
  
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.3,
        max_tokens: 100,
      });
  
      res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al contactar con OpenAI.' });
    }
  });
  
  module.exports = router;`,
  
      "server.js": `const express = require('express');
  const path = require('path');
  const app = express();
  
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/api/excelchat', require('./api/excelchat'));
  
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(\` Servidor corriendo en http://localhost:\${PORT}\`);
  });`
    },
    description: "Este proyecto es una aplicación que transforma archivos Excel en bases de datos consultables mediante lenguaje natural, generando automáticamente sentencias SQL usando inteligencia artificial.",
  
    guide: (
      <div className="bg-blue-100 border-l-4 border-blue-400 text-blue-900 p-4 rounded text-sm mt-4">
        <p className="font-semibold mb-1">📦 Cómo ejecutar tu Excel Chatbot con IA:</p>
        <ul className="list-disc ml-5">
          <li>Crea una carpeta raíz para tu proyecto.</li>
          <li>Dentro crea: <code>public/</code> (frontend) y <code>api/</code> (lógica backend).</li>
          <li>Pega <code>index.html</code>, <code>styles.css</code>, y <code>script.js</code> en <code>public/</code>.</li>
          <li>Agrega <code>excelchat.js</code> dentro de la carpeta <code>api/</code>.</li>
          <li>Coloca <code>server.js</code> en la raíz.</li>
          <li>Ejecuta <code>npm init -y</code> y luego <code>npm install express openai</code>.</li>
          <li>Reemplaza tu API key de OpenAI en el archivo <code>api/excelchat.js</code>.</li>
          <li>Inicia el servidor: <code>node server.js</code>.</li>
          <li>Abre <code>http://localhost:3002</code> y comienza a preguntar al Excel.</li>
        </ul>
        <p className="mt-2 text-xs italic text-gray-600">
          ⚠️ Nunca pongas tu API Key en el frontend. Solo backend seguro.
        </p>
      </div>
    )
  };
  
  export default ExcelSQLChatbotPackage;
  