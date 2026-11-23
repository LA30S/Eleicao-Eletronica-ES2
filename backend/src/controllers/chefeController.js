const bcrypt = require('bcryptjs');
const Chefe = require('../models/Chefe');

exports.cadastrarChefe = async (req, res) => {
  try {
    const { nome, login, senha } = req.body;

    // Verifica se a senha é uma string vazia
    if(senha == "")
      return res.status(400).json({ erro: "Senha é um campo obrigatório" });
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoChefe = new Chefe({ nome, login, senha: senhaHash });
    await novoChefe.save();

    const resposta = novoChefe.toObject();
    delete resposta.senha;
    return res.status(201).json(resposta);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};