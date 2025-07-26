const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registro.controller');

router.post('/propriedades', registroController.cadastrarPropriedade);
router.post('/parametros', registroController.cadastrarParametros);

// Rota GET para consultar propriedades
router.get('/propriedades', (req, res) => {
  res.json(registroController.propriedades);
});

// Rota GET para consultar parametros
router.get('/parametros', (req, res) => {
  res.json(registroController.parametros);
});

module.exports = router;