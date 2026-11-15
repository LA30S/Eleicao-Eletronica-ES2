const Eleicao = require('../models/Eleicao');

//implementação dummy de cadastrar uma eleição
exports.cadastrarEleicao = async (req, res) => {
  try {
    const novaEleicao = new Eleicao(req.body);
    await novaEleicao.save();
    res.status(201).json(novaEleicao);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

