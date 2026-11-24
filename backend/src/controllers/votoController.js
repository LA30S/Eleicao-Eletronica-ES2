const mongoose = require('mongoose');
const Voto = require('../models/Voto');
const Candidato = require('../models/Candidato');
const { CARGOS_VALIDOS } = require('../models/Candidato');
const Eleicao = require('../models/Eleicao');
const Usuario = require('../models/Usuario');

// REQUISITO 5: Consultar candidatos disponíveis para um cargo na eleição (apenas ELEITOR)
exports.candidatosPorCargo = async (req, res) => {
  try {
    const { eleicaoId, cargo } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eleicaoId)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

    if (!CARGOS_VALIDOS.includes(cargo)) {
      return res.status(400).json({ erro: `${cargo} não é um cargo válido.` });
    }

    const eleicao = await Eleicao.findById(eleicaoId);
    if (!eleicao) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }

    const candidatos = await Candidato.find({ eleicao: eleicaoId, cargo }).select('-qtdVotos');
    return res.status(200).json(candidatos);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 5: Registrar e confirmar voto (apenas ELEITOR, eleição ABERTA, 1x por cargo, sigiloso e atômico)
exports.registrarVoto = async (req, res) => {
  try {
    const { eleicaoId, cargo, numCandidato } = req.body;
    const eleitorId = req.usuario.id;

    if (!eleicaoId || !mongoose.Types.ObjectId.isValid(eleicaoId)) {
      return res.status(400).json({ erro: 'ID de eleição válido é obrigatório.' });
    }

    if (!cargo || !CARGOS_VALIDOS.includes(cargo)) {
      return res.status(400).json({ erro: 'Cargo inválido.' });
    }

    if (numCandidato === undefined || numCandidato === null) {
      return res.status(400).json({ erro: 'Número do candidato é obrigatório.' });
    }

    // 1. Verifica se a eleição existe e está ABERTA
    const eleicao = await Eleicao.findById(eleicaoId);
    if (!eleicao) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }
    if (eleicao.situacao !== 'ABERTA') {
      return res.status(400).json({ erro: `Votação bloqueada. Situação atual da eleição: ${eleicao.situacao}.` });
    }

    // 2. Verifica se o candidato concorre a esse cargo nessa eleição
    const candidato = await Candidato.findOne({
      eleicao: eleicaoId,
      cargo,
      numero: Number(numCandidato)
    });
    if (!candidato) {
      return res.status(404).json({ erro: 'Candidato não encontrado para este cargo e eleição.' });
    }

    // 3. Verifica se o eleitor existe
    const eleitorExiste = await Usuario.exists({ _id: eleitorId });
    if (!eleitorExiste) {
      return res.status(404).json({ erro: 'Eleitor não encontrado.' });
    }

    // 4. Registro atômico da participação (impede voto duplicado por clique duplo / concorrência)
    const eleitorAtualizado = await Usuario.findOneAndUpdate(
      {
        _id: eleitorId,
        participacoes: {
          $not: {
            $elemMatch: {
              eleicao: new mongoose.Types.ObjectId(eleicaoId),
              cargo
            }
          }
        }
      },
      {
        $set: { votou: true },
        $push: { participacoes: { eleicao: eleicaoId, cargo } }
      },
      { new: true }
    );

    if (!eleitorAtualizado) {
      return res.status(400).json({ erro: `Você já confirmou seu voto para o cargo de ${cargo}.` });
    }

    // 5. Grava o voto anônimo na urna e sincroniza contagem do candidato
    try {
      await Voto.create({
        eleicao: eleicaoId,
        candidato: candidato._id,
        numCandidato: candidato.numero,
        cargo
      });

      await Candidato.findByIdAndUpdate(candidato._id, { $inc: { qtdVotos: 1 } });
    } catch (erroUrna) {
      // Reverte a participação caso ocorra falha ao persistir na urna
      await Usuario.findByIdAndUpdate(eleitorId, {
        $pull: { participacoes: { eleicao: eleicaoId, cargo } }
      });
      throw erroUrna;
    }

    return res.status(201).json({
      mensagem: `Voto confirmado com sucesso para ${cargo}.`
    });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 6: Acompanhamento durante a votação ABERTA (Eleitor vê todos os cargos; Candidato vê só o seu na sua eleição)
exports.acompanharVotacao = async (req, res) => {
  try {
    const { eleicaoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eleicaoId)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

    const eleicao = await Eleicao.findById(eleicaoId);
    if (!eleicao) {
      return res.status(404).json({ erro: 'Eleição não encontrada.' });
    }

    if (eleicao.situacao !== 'ABERTA') {
      return res.status(400).json({ erro: 'O acompanhamento da votação só está disponível enquanto a eleição estiver ABERTA.' });
    }

    const filtro = { eleicao: new mongoose.Types.ObjectId(eleicaoId) };

    if (req.usuario.perfil === 'CANDIDATO') {
      if (!req.usuario.eleicaoId || req.usuario.eleicaoId.toString() !== eleicaoId) {
        return res.status(403).json({ erro: 'Candidato só pode acompanhar a eleição em que está inscrito.' });
      }
      filtro.cargo = req.usuario.cargo;
    }

    const contagem = await Voto.aggregate([
      { $match: filtro },
      { $group: { _id: '$candidato', totalVotos: { $sum: 1 } } }
    ]);

    const mapaVotos = new Map(contagem.map((c) => [c._id.toString(), c.totalVotos]));
    const candidatos = await Candidato.find(filtro).lean();

    const evolucao = candidatos
      .map((cand) => ({
        candidatoId: cand._id,
        nome: cand.nome,
        numero: cand.numero,
        partido: cand.partido,
        cargo: cand.cargo,
        votos: mapaVotos.get(cand._id.toString()) || 0
      }))
      .sort((a, b) => b.votos - a.votos);

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

    if (!mongoose.Types.ObjectId.isValid(eleicaoId)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

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
        porCargo[cand.cargo] = {
          candidatos: [],
          maisVotado: null,
          maisVotados: [],
          empate: false
        };
      }

      porCargo[cand.cargo].candidatos.push({
        nome: cand.nome,
        numero: cand.numero,
        partido: cand.partido,
        cargo: cand.cargo,
        votos
      });
    }

    for (const cargo of Object.keys(porCargo)) {
      porCargo[cargo].candidatos.sort((a, b) => b.votos - a.votos);
      const maiorVotacao = porCargo[cargo].candidatos[0]?.votos || 0;

      if (maiorVotacao > 0) {
        const lideres = porCargo[cargo].candidatos.filter((c) => c.votos === maiorVotacao);
        porCargo[cargo].maisVotados = lideres;
        porCargo[cargo].empate = lideres.length > 1;
        porCargo[cargo].maisVotado = lideres[0];
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