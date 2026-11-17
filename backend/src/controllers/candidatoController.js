const Candidato = require('../models/Candidato');

//implementação dummy de cadastrar candidatos
exports.cadastrarCandidato = async (req, res) => {
  try {
    const novoCandidato = new Candidato(req.body);
    await novoCandidato.save();
    res.status(201).json(novoCandidato);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

//implementação dummy de listar candidatos
exports.listarCandidatos = async (req, res) => {
  try {
    const candidatos = await Candidato.find();
    res.json(candidatos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar candidatos' });
  }
};