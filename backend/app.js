const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registroRoutes = require('./routes/registro.routes');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Prefixo /api
app.use('/api', registroRoutes);

const SECRET_KEY = 'secreto123';

app.post('/auth/register', (req, res) => {
  const { nome, email, senha } = req.body;
  // salvar no banco...
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  // validar no banco...
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Endpoint direto para registros (mock)
const registros = [];

app.get('/registros', (req, res) => {
  res.json(registros);
});

app.get('/', (req, res) => {
  res.send('API está rodando! 🐄');
});

module.exports = app;

//MONGO DB

// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose'); // <-- Importa mongoose
// const registroRoutes = require('./routes/registro.routes');

// const app = express();

// // Conectar ao MongoDB
// const mongoURI = 'mongodb://localhost:27017/seuBanco'; // Coloque sua URI aqui

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB conectado!'))
// .catch((err) => console.error('Erro ao conectar no MongoDB:', err));

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// // Rotas prefixadas
// app.use('/api', registroRoutes);

// // Rotas adicionais
// const registros = [];
// app.get('/registros', (req, res) => {
//   res.json(registros);
// });

// app.get('/', (req, res) => {
//   res.send('API está rodando! 🐄');
// });

// module.exports = app;