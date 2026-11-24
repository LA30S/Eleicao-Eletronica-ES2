const mongoose = require('mongoose');
const Eleicao = require('../models/Eleicao');

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

// REQUISITO 2: Cadastrar eleição (sempre inicia AGENDADA)
exports.cadastrarEleicao = async (req, res) => {
  try {
    const { data, turno, abertura, encerramento } = req.body;

    if (!data || !turno || !abertura || !encerramento) {
      return res.status(400).json({ erro: 'Data, turno, horário de abertura e horário de encerramento são obrigatórios.' });
    }

    if (!HORA_REGEX.test(abertura) || !HORA_REGEX.test(encerramento)) {
      return res.status(400).json({ erro: 'Os horários de abertura e encerramento devem estar no formato HH:MM.' });
    }

    if (encerramento <= abertura) {
      return res.status(400).json({ erro: 'O horário de encerramento deve ser posterior ao horário de abertura.' });
    }

    const novaEleicao = new Eleicao({
      data,
      turno,
      abertura,
      encerramento,
      situacao: 'AGENDADA'
    });
    await novaEleicao.save();
    return res.status(201).json(novaEleicao);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// REQUISITO 2: Consultar eleições
exports.listarEleicoes = async (req, res) => {
  try {
    const eleicoes = await Eleicao.find();
    return res.status(200).json(eleicoes);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 2: Consultar situação atual da eleição
exports.consultarSituacao = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

    const eleicao = await Eleicao.findById(req.params.id);
    if (!eleicao) return res.status(404).json({ erro: 'Eleição não encontrada.' });
    return res.status(200).json(eleicao);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 2: Abrir votação (AGENDADA -> ABERTA)
exports.abrirEleicao = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

    const eleicao = await Eleicao.findById(req.params.id);
    if (!eleicao) return res.status(404).json({ erro: 'Eleição não encontrada.' });

    if (eleicao.situacao !== 'AGENDADA') {
      return res.status(400).json({ erro: `Eleição não pode ser aberta pois está ${eleicao.situacao}.` });
    }

    eleicao.situacao = 'ABERTA';
    await eleicao.save();
    return res.status(200).json({ mensagem: 'Eleição ABERTA com sucesso.', eleicao });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// REQUISITO 2: Encerrar votação (ABERTA -> ENCERRADA)
exports.encerrarEleicao = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'ID de eleição inválido.' });
    }

    const eleicao = await Eleicao.findById(req.params.id);
    if (!eleicao) return res.status(404).json({ erro: 'Eleição não encontrada.' });

    if (eleicao.situacao !== 'ABERTA') {
      return res.status(400).json({ erro: 'Somente eleições ABERTAS podem ser encerradas.' });
    }

    eleicao.situacao = 'ENCERRADA';
    await eleicao.save();
    return res.status(200).json({ mensagem: 'Eleição ENCERRADA com sucesso.', eleicao });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};