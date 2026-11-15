const Chefe = require('../models/Chefe');

//implementação dummy de cadastrar um chefe de seção
exports.cadastrarChefe = async (req, res) => {
  try {
    const novoChefe = new Chefe(req.body);
    await novoChefe.save();
    res.status(201).json(novoChefe);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

