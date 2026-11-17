const Eleicao = require('../models/Eleicao');

// Cadastrar eleição (sempre inicia AGENDADA)
exports.cadastrarEleicao = async (req, res) => {
  try {
    const { data, turno, abertura, encerramento } = req.body;
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

// Consultar eleições / situação atual
exports.listarEleicoes = async (req, res) => {
  try {
    const eleicoes = await Eleicao.find();
    return res.status(200).json(eleicoes);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

exports.consultarSituacao = async (req, res) => {
  try {
    const eleicao = await Eleicao.findById(req.params.id);
    if (!eleicao) return res.status(404).json({ erro: 'Eleição não encontrada.' });
    return res.status(200).json(eleicao);
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Abrir votação (AGENDADA -> ABERTA)
exports.abrirEleicao = async (req, res) => {
  try {
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

// Encerrar votação (ABERTA -> ENCERRADA)
exports.encerrarEleicao = async (req, res) => {
  try {
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