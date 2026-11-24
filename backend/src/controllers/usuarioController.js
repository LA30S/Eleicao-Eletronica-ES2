const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Chefe = require('../models/Chefe');
const Candidato = require('../models/Candidato');
const { JWT_SECRET } = require('../middlewares/auth.middleware');

async function loginJaExiste(login, ignorarUsuarioId = null) {
  const loginTrim = login.trim();
  const [emChefe, emCandidato, emUsuario] = await Promise.all([
    Chefe.exists({ login: loginTrim }),
    Candidato.exists({ login: loginTrim }),
    Usuario.exists({
      login: loginTrim,
      ...(ignorarUsuarioId ? { _id: { $ne: ignorarUsuarioId } } : {})
    })
  ]);
  return Boolean(emChefe || emCandidato || emUsuario);
}

// REQUISITO 1: Login unificado (Chefe, Eleitor ou Candidato)
exports.login = async (req, res) => {
  try {
    const { codigoAcesso, senha } = req.body;

    if (!codigoAcesso || !senha) {
      return res.status(400).json({ erro: 'Código de acesso e senha são obrigatórios.' });
    }

    let conta = null;
    let perfil = null;

    conta = await Chefe.findOne({ login: codigoAcesso }).select('+senha');
    if (conta) perfil = 'CHEFE';

    if (!conta) {
      conta = await Usuario.findOne({ login: codigoAcesso }).select('+senha');
      if (conta) perfil = 'ELEITOR';
    }

    if (!conta) {
      conta = await Candidato.findOne({ login: codigoAcesso }).select('+senha');
      if (conta) perfil = 'CANDIDATO';
    }

    if (!conta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = conta.senha.startsWith('$2')
      ? await bcrypt.compare(senha, conta.senha)
      : senha === conta.senha;

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const payload = {
      id: conta._id,
      nome: conta.nome,
      perfil,
      ...(perfil === 'ELEITOR' && {
        votou: conta.votou
      }),
      ...(perfil === 'CANDIDATO' && {
        cargo: conta.cargo,
        numero: conta.numero,
        eleicaoId: conta.eleicao
      })
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    return res.status(200).json({ token, usuario: payload });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 3: Cadastrar Eleitor (Chefe da Seção)
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, login, senha } = req.body;

    if (!senha || typeof senha !== 'string' || senha.trim() === '') {
      return res.status(400).json({ erro: 'Senha é um campo obrigatório.' });
    }

    if (login && (await loginJaExiste(login))) {
      return res.status(400).json({ erro: 'Este login já está em uso no sistema.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
      nome,
      login,
      senha: senhaHash,
      votou: false,
      participacoes: []
    });

    await novoUsuario.save();
    const resposta = novoUsuario.toObject();
    delete resposta.senha;

    return res.status(201).json(resposta);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// REQUISITO 3: Consultar Eleitores
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
};

// REQUISITO 3: Alterar dados de um Eleitor
exports.atualizarUsuario = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de eleitor inválido.' });
    }

    const dados = { ...req.body };
    delete dados.participacoes;
    delete dados.votou;

    if (dados.login && (await loginJaExiste(dados.login, req.params.id))) {
      return res.status(400).json({ erro: 'Este login já está em uso no sistema.' });
    }

    if (dados.senha !== undefined) {
      if (typeof dados.senha !== 'string' || dados.senha.trim() === '') {
        return res.status(400).json({ erro: 'A senha não pode ser vazia.' });
      }
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    const atualizado = await Usuario.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true
    });

    if (!atualizado) {
      return res.status(404).json({ erro: 'Eleitor não encontrado.' });
    }
    return res.status(200).json(atualizado);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// REQUISITO 3: Excluir Eleitor
exports.excluirUsuario = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de eleitor inválido.' });
    }

    const removido = await Usuario.findByIdAndDelete(req.params.id);
    if (!removido) {
      return res.status(404).json({ erro: 'Eleitor não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Eleitor excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};