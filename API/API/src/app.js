import http from 'http';
import { env, mongo, port, ip, apiRoot } from './config';
import mongoose from './services/mongoose';
import express from './services/express';
import api from './api';

const app = express(apiRoot, api);
const server = http.createServer(app);

// Configura o Promise do Mongoose
mongoose.Promise = global.Promise;

// Conectar ao MongoDB e só então iniciar o servidor
if (mongo.uri) {
  mongoose.connect(mongo.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;

  db.on('connected', () => {
    console.log('✅ MongoDB conectado em', mongo.uri);

    // Só iniciar o servidor após conexão
    server.listen(port, ip, () => {
      console.log('🚀 Express server listening on http://%s:%d, in %s mode', ip, port, env);
    });
  });

  db.on('error', err => {
    console.error('❌ Erro na conexão com MongoDB:', err);
  });

  db.on('disconnected', () => {
    console.warn('⚠️ MongoDB desconectado');
  });
} else {
  console.error('❌ URI do MongoDB não configurada em ./config');
}
