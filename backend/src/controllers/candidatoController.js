const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Candidato = require('../models/Candidato');
const { CARGOS_VALIDOS } = require('../models/Candidato');
const Eleicao = require('../models/Eleicao');
const Chefe = require('../models/Chefe');
const Usuario = require('../models/Usuario');
const Voto = require('../models/Voto');

async function loginJaExiste(login, ignorarCandidatoId = null) {
  const loginTrim = login.trim();
  const [emChefe, emUsuario, emCandidato] = await Promise.all([
    Chefe.exists({ login: loginTrim }),
    Usuario.exists({ login: loginTrim }),
    Candidato.exists({
      login: loginTrim,
      ...(ignorarCandidatoId ? { _id: { $ne: ignorarCandidatoId } } : {})
    })
  ]);
  return Boolean(emChefe || emUsuario || emCandidato);
}

// REQUISITO 4: Cadastro de candidato (Chefe da Seção)
exports.cadastrarCandidato = async (req, res) => {
  try {
    const { nome, numero, login, senha, cargo, partido, eleicao } = req.body;

    if (!senha || typeof senha !== 'string' || senha.trim() === '') {
      return res.status(400).json({ erro: 'Senha é um campo obrigatório.' });
    }

    if (!eleicao || !mongoose.Types.ObjectId.isValid(eleicao)) {
      return res.status(400).json({ erro: 'ID de eleição válido é obrigatório.' });
    }

    const eleicaoExiste = await Eleicao.findById(eleicao);
    if (!eleicaoExiste) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }

    if (eleicaoExiste.situacao === 'ENCERRADA') {
      return res.status(400).json({ erro: 'Não é possível cadastrar candidato em uma eleição encerrada.' });
    }

    if (login && (await loginJaExiste(login))) {
      return res.status(400).json({ erro: 'Este login já está em uso no sistema.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoCandidato = new Candidato({
      nome,
      numero,
      login,
      senha: senhaHash,
      cargo,
      partido,
      eleicao
    });
    await novoCandidato.save();

    const resposta = novoCandidato.toObject();
    delete resposta.senha;
    delete resposta.qtdVotos;
    return res.status(201).json(resposta);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Já existe um candidato com este número para este cargo nesta eleição (ou login duplicado).' });
    }
    return res.status(400).json({ erro: error.message });
  }
};

// REQUISITO 4: Consultar Candidatos (Chefe da Seção)
exports.listarCandidatos = async (req, res) => {
  try {
    const candidatos = await Candidato.find().populate('eleicao', 'data turno situacao');
    return res.status(200).json(candidatos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar candidatos.' });
  }
};

// REQUISITO 4: Alterar dados de um Candidato (Chefe da Seção)
exports.atualizarCandidato = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de candidato inválido.' });
    }

    const candidatoAtual = await Candidato.findById(req.params.id).select('+qtdVotos');
    if (!candidatoAtual) {
      return res.status(404).json({ erro: 'Candidato não encontrado.' });
    }

    const dados = { ...req.body };
    delete dados.qtdVotos;

    const eleicaoAtual = await Eleicao.findById(candidatoAtual.eleicao);
    if (eleicaoAtual?.situacao === 'ENCERRADA') {
      return res.status(400).json({ erro: 'Não é possível alterar candidato de uma eleição encerrada.' });
    }

    const possuiVotos = await Voto.exists({ candidato: candidatoAtual._id });
    if (possuiVotos && Object.keys(dados).length > 0) {
      return res.status(400).json({ erro: 'Não é possível alterar candidato que já possui votos registrados.' });
    }

    if (dados.eleicao !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(dados.eleicao)) {
        return res.status(400).json({ erro: 'ID de eleição inválido.' });
      }
      const eleicaoExiste = await Eleicao.findById(dados.eleicao);
      if (!eleicaoExiste) {
        return res.status(404).json({ erro: 'Eleição não encontrada.' });
      }
      if (eleicaoExiste.situacao === 'ENCERRADA') {
        return res.status(400).json({ erro: 'Não é possível associar candidato a uma eleição encerrada.' });
      }
    }

    if (dados.login && (await loginJaExiste(dados.login, req.params.id))) {
      return res.status(400).json({ erro: 'Este login já está em uso no sistema.' });
    }

    if (dados.senha !== undefined) {
      if (typeof dados.senha !== 'string' || dados.senha.trim() === '') {
        return res.status(400).json({ erro: 'A senha não pode ser vazia.' });
      }
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    const atualizado = await Candidato.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true
    });

    if (!atualizado) {
      return res.status(404).json({ erro: 'Candidato não encontrado.' });
    }
    return res.status(200).json(atualizado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ erro: 'Número de candidato já utilizado neste cargo e eleição (ou login duplicado).' });
    }
    return res.status(400).json({ erro: error.message });
  }
};

// REQUISITO 4: Excluir Candidato (Chefe da Seção)
exports.excluirCandidato = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de candidato inválido.' });
    }

    const possuiVotos = await Voto.exists({ candidato: req.params.id });
    if (possuiVotos) {
      return res.status(400).json({ erro: 'Não é possível excluir um candidato que já possui votos registrados.' });
    }

    const removido = await Candidato.findByIdAndDelete(req.params.id);
    if (!removido) {
      return res.status(404).json({ erro: 'Candidato não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Candidato excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Exibir candidatos por cargo (Candidato só vê o próprio cargo e a própria eleição)
exports.listarCandidatosCargo = async (req, res) => {
  try {
    const filtro = {};

    if (req.usuario.perfil === 'CANDIDATO') {
      filtro.cargo = req.usuario.cargo;
      filtro.eleicao = req.usuario.eleicaoId;
    } else {
      if (req.query.cargo) filtro.cargo = req.query.cargo;
      if (req.query.eleicao) {
        if (!mongoose.Types.ObjectId.isValid(req.query.eleicao)) {
          return res.status(400).json({ erro: 'ID de eleição inválido.' });
        }
        filtro.eleicao = req.query.eleicao;
      }
    }

    const candidatosCargo = await Candidato.find(filtro)
      .select('+qtdVotos')
      .sort({ qtdVotos: -1 });

    return res.status(200).json(candidatosCargo);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar candidatos deste cargo.' });
  }
};

// Exibir candidato mais votado por cargo (somente após encerramento da eleição)
exports.listarMaisCargo = async (req, res) => {
  try {
    const { cargo, eleicao } = req.query;

    if (!cargo || !eleicao) {
      return res.status(400).json({ erro: 'Informe cargo e eleição na query string.' });
    }

    if (!CARGOS_VALIDOS.includes(cargo)) {
      return res.status(400).json({ erro: `${cargo} não é um cargo válido.` });
    }

    if (!mongoose.Types.ObjectId.isValid(eleicao)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

    if (req.usuario.perfil === 'CANDIDATO') {
      if (req.usuario.cargo !== cargo || !req.usuario.eleicaoId || req.usuario.eleicaoId.toString() !== eleicao) {
        return res.status(403).json({ erro: 'Candidato só pode consultar o resultado do próprio cargo e eleição.' });
      }
    }

    const eleicaoDoc = await Eleicao.findById(eleicao);
    if (!eleicaoDoc) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }
    if (eleicaoDoc.situacao !== 'ENCERRADA') {
      return res.status(400).json({ erro: 'O mais votado só pode ser consultado após o encerramento da eleição.' });
    }

    const filtro = { eleicao: eleicaoDoc._id, cargo };
    const contagem = await Voto.aggregate([
      { $match: { eleicao: eleicaoDoc._id, cargo } },
      { $group: { _id: '$candidato', totalVotos: { $sum: 1 } } }
    ]);

    const mapaVotos = new Map(contagem.map((item) => [item._id.toString(), item.totalVotos]));
    const candidatos = await Candidato.find(filtro).lean();
    const candidatosComVotos = candidatos.map((candidato) => ({
      _id: candidato._id,
      nome: candidato.nome,
      numero: candidato.numero,
      partido: candidato.partido,
      cargo: candidato.cargo,
      votos: mapaVotos.get(candidato._id.toString()) || 0
    })).sort((a, b) => b.votos - a.votos);

    if (candidatosComVotos.length === 0 || candidatosComVotos[0].votos === 0) {
      return res.status(200).json([]);
    }

    const maiorVotacao = candidatosComVotos[0].votos;
    const maisVotados = candidatosComVotos.filter((c) => c.votos === maiorVotacao);

    return res.status(200).json(maisVotados);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar candidato mais votado deste cargo.' });
  }
};
