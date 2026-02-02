const express = require('express');
const app = express();
const path = require('path');
const contextchat = require('./api/contextchat');
const voicechat = require('./api/voicechat');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contextchat', contextchat);
app.post('/api/voicechat', upload.single('audio'), voicechat);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});