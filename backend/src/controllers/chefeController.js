const bcrypt = require('bcryptjs');
const Chefe = require('../models/Chefe');
const Usuario = require('../models/Usuario');
const Candidato = require('../models/Candidato');

exports.cadastrarChefe = async (req, res) => {
  try {
    const { nome, login, senha } = req.body;

    if (!senha || typeof senha !== 'string' || senha.trim() === '') {
      return res.status(400).json({ erro: 'Senha é um campo obrigatório.' });
    }

    if (login) {
      const loginEmUso =
        (await Chefe.exists({ login: login.trim() })) ||
        (await Usuario.exists({ login: login.trim() })) ||
        (await Candidato.exists({ login: login.trim() }));

      if (loginEmUso) {
        return res.status(400).json({ erro: 'Este login já está em uso no sistema.' });
      }
    }

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