const express = require('express');
const app = express();
const path = require('path');
const contextchat = require('./api/contextchat');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contextchat', contextchat);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});