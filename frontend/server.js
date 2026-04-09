const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'www')));

// Redireciona todas as rotas para o index.html (necessário para o Angular Router)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
