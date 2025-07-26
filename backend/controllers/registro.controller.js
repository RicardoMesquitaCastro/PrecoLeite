const propriedades = [];
const parametros = [];

exports.cadastrarPropriedade = (req, res) => {
  const dados = req.body;
  propriedades.push(dados);
  console.log('Nova propriedade:', dados);
  res.status(201).json({ message: 'Propriedade cadastrada com sucesso!' });
};

exports.cadastrarParametros = (req, res) => {
  const dados = req.body;
  parametros.push(dados);
  console.log('Novos parâmetros:', dados);
  res.status(201).json({ message: 'Parâmetros cadastrados com sucesso!' });
};

exports.propriedades = propriedades;
exports.parametros = parametros;

// const Propriedade = require('../models/Propriedade');

// exports.cadastrarPropriedade = async (req, res) => {
//   try {
//     const novaPropriedade = new Propriedade(req.body);
//     await novaPropriedade.save();
//     res.status(201).json({ message: 'Propriedade cadastrada com sucesso!' });
//   } catch (error) {
//     res.status(400).json({ message: 'Erro ao cadastrar propriedade', error: error.message });
//   }
// };

// exports.listarPropriedades = async (req, res) => {
//   try {
//     const propriedades = await Propriedade.find();
//     res.json(propriedades);
//   } catch (error) {
//     res.status(500).json({ message: 'Erro ao buscar propriedades', error: error.message });
//   }
// };