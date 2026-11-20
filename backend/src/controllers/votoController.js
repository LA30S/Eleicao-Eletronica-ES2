const mongoose = require('mongoose');
const Voto = require('../models/Voto');
const Candidato = require('../models/Candidato');
const Eleicao = require('../models/Eleicao');
const Usuario = require('../models/Usuario');

// REQUISITO 5: Consultar candidatos disponíveis para um cargo na eleição
exports.candidatosPorCargo = async (req, res) => {
  try {
    const { eleicaoId, cargo } = req.params;
    const candidatos = await Candidato.find({ eleicao: eleicaoId, cargo });
    return res.status(200).json(candidatos);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 5: Registrar e confirmar voto (apenas ELEITOR, eleição ABERTA, 1x por cargo, sigiloso)
exports.registrarVoto = async (req, res) => {
  try {
    const { eleicaoId, cargo, numCandidato } = req.body;
    const eleitorId = req.usuario.id;

    // 1. Verifica se a eleição existe e está ABERTA
    const eleicao = await Eleicao.findById(eleicaoId);
    if (!eleicao) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }
    if (eleicao.situacao !== 'ABERTA') {
      return res.status(400).json({ erro: `Votação bloqueada. Situação atual da eleição: ${eleicao.situacao}.` });
    }

    // 2. Verifica se o candidato concorre a esse cargo nessa eleição
    const candidato = await Candidato.findOne({ eleicao: eleicaoId, cargo, numero: numCandidato });
    if (!candidato) {
      return res.status(404).json({ erro: 'Candidato não encontrado para este cargo e eleição.' });
    }

    // 3. Verifica se o eleitor já votou neste cargo nesta eleição
    const eleitor = await Usuario.findById(eleitorId);
    if (!eleitor) {
      return res.status(404).json({ erro: 'Eleitor não encontrado.' });
    }

    const jaVotouNoCargo = eleitor.participacoes.some(
      (p) => p.eleicao.toString() === eleicaoId && p.cargo === cargo
    );
    if (jaVotouNoCargo) {
      return res.status(400).json({ erro: `Você já confirmou seu voto para o cargo de ${cargo}.` });
    }

    // 4. Registra apenas que o eleitor participou nesse cargo (sem salvar em quem votou -> sigilo)
    eleitor.participacoes.push({ eleicao: eleicaoId, cargo });
    await eleitor.save();

    // 5. Grava o voto anônimo na urna
    await Voto.create({
      eleicao: eleicaoId,
      candidato: candidato._id,
      numCandidato: candidato.numero,
      cargo
    });

    return res.status(201).json({
      mensagem: `Voto confirmado com sucesso para ${cargo}.`
    });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 6: Acompanhamento durante a votação (Eleitor vê todos os cargos; Candidato vê só o seu)
exports.acompanharVotacao = async (req, res) => {
  try {
    const { eleicaoId } = req.params;
    const eleicao = await Eleicao.findById(eleicaoId);
    if (!eleicao) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }

    const filtro = { eleicao: new mongoose.Types.ObjectId(eleicaoId) };

    // Candidato só acompanha o cargo ao qual concorre
    if (req.usuario.perfil === 'CANDIDATO') {
      filtro.cargo = req.usuario.cargo;
    }

    const contagem = await Voto.aggregate([
      { $match: filtro },
      { $group: { _id: '$candidato', totalVotos: { $sum: 1 } } }
    ]);

    const mapaVotos = new Map(contagem.map((c) => [c._id.toString(), c.totalVotos]));
    const candidatos = await Candidato.find(filtro).lean();

    const evolucao = candidatos.map((cand) => ({
      candidatoId: cand._id,
      nome: cand.nome,
      numero: cand.numero,
      partido: cand.partido,
      cargo: cand.cargo,
      votos: mapaVotos.get(cand._id.toString()) || 0
    }));

    return res.status(200).json({
      eleicaoId,
      situacao: eleicao.situacao,
      evolucao
    });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 7: Resultado final após encerramento (votos por candidato + mais votado por cargo)
exports.resultadoFinal = async (req, res) => {
  try {
    const { eleicaoId } = req.params;
    const eleicao = await Eleicao.findById(eleicaoId);
    if (!eleicao) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }

    if (eleicao.situacao !== 'ENCERRADA') {
      return res.status(400).json({ erro: 'O resultado final só pode ser consultado após o encerramento da eleição.' });
    }

    const contagem = await Voto.aggregate([
      { $match: { eleicao: new mongoose.Types.ObjectId(eleicaoId) } },
      { $group: { _id: '$candidato', totalVotos: { $sum: 1 } } }
    ]);

    const mapaVotos = new Map(contagem.map((c) => [c._id.toString(), c.totalVotos]));
    const candidatos = await Candidato.find({ eleicao: eleicaoId }).lean();

    const porCargo = {};

    for (const cand of candidatos) {
      const votos = mapaVotos.get(cand._id.toString()) || 0;
      if (!porCargo[cand.cargo]) {
        porCargo[cand.cargo] = { candidatos: [], maisVotado: null };
      }

      const item = {
        nome: cand.nome,
        numero: cand.numero,
        partido: cand.partido,
        cargo: cand.cargo,
        votos
      };

      porCargo[cand.cargo].candidatos.push(item);

      const liderAtual = porCargo[cand.cargo].maisVotado;
      if (!liderAtual || votos > liderAtual.votos) {
        porCargo[cand.cargo].maisVotado = item;
      }
    }

    return res.status(200).json({
      eleicao: { id: eleicao._id, data: eleicao.data, turno: eleicao.turno, situacao: eleicao.situacao },
      resultados: porCargo
    });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};