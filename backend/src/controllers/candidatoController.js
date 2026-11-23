const bcrypt = require('bcryptjs');
const Candidato = require('../models/Candidato');

//Cadastro de candidato
exports.cadastrarCandidato = async (req, res) => {
  try {
    const { nome, numero, login, senha, cargo, partido } = req.body;

    // Verifica se a senha é uma string vazia
    if(senha == "")
      return res.status(400).json({ erro: "Senha é um campo obrigatório" });
    const senhaHash = await bcrypt.hash(senha, 10);

    const novoCandidato = new Candidato({ nome, numero, login, senha: senhaHash, cargo, partido });
    await novoCandidato.save();

    const resposta = novoCandidato.toObject();
    delete resposta.senha;
    return res.status(201).json(resposta);
  } catch (error) {
    return res.status(400).json({ erro: error.message });
  }
};

// Consultar Candidatos
exports.listarCandidatos = async (req, res) => {
  try {
    const candidatos = await Candidato.find();
    return res.status(200).json(candidatos);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar candidatos' });
  }
};

//Alterar dados de um Candidato
exports.atualizarCandidato = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (dados.senha) {
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
    return res.status(400).json({ erro: error.message });
  }
};

//Excluir Candidato
exports.excluirCandidato = async (req, res) => {
  try {
    const removido = await Candidato.findByIdAndDelete(req.params.id);
    if (!removido) {
      return res.status(404).json({ erro: 'Candidato não encontrado.' });
    }
    return res.status(200).json({ mensagem: 'Candidato excluído com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

//Exibir candidatos por cargo
exports.listarCandidatosCargo = async(req, res) =>{
try {
  const { cargo } = req.query;
    const candidatosCargo = await Candidato.find({ cargo }).sort({ qtdVotos: -1 });
    return res.status(200).json(candidatosCargo);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar candidatos deste cargo' });
  }
};

//Exibir cadidato mais votado por cargo
exports.listarMaisCargo = async(req, res) =>{
try {
  const { cargo } = req.query;
    const candidatoMaisCargo = await Candidato.find({ cargo }).sort({ qtdVoto: -1 }).limit(1);
    
    return res.status(200).json(candidatoMaisCargo);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar candidatos deste cargo' });
  }
};

//adicionar voto
exports.addVoto = async(req, res) =>{
     try {
      const{ id } = req.params;
      const novoVoto = await Candidato.findByIdAndUpdate(
      id,
      { $inc: { qtdVotos: 1 } },
      { new: true }
    );

    if(!novoVoto) {
      return res.status(404).json({
        erro: 'Candidato não encontrado'
      });
    }

    return res.status(200).json({
      mensagem: 'Voto contabilizado com sucesso',
      candidato: novoVoto
    });

  }catch(error){
      return res.status(500).json({ erro: 'Erro ao contabilizar voto' });
  }
};
