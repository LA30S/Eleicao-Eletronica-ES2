const Voto = require('../models/Voto');

//implementação dummy de adicionar voto
exports.adicionarVoto = async (req, res) => {
  try {
    const novoVoto = new Voto(req.body);
    await novoVoto.save();
    res.status(201).json(novoVoto);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

//implementação dummy de contar votos
exports.contarVotos = async (req, res) => {
  try {
    const resultado = await Voto.aggregate([
      {
        $group: {
          candidato: "$numCandidato",         
          quantidade: { $sum: 1 }     
        }
      },
      {
        $sort: { 
          quantidade: -1             
        }
      }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar contagem de votos', detalhe: error.message });
  }
};

exports.contagemCargo = async (req, res) => {
  try {
    const { buscaCargo } = req.params; 

    const resultado = await Voto.aggregate([
  {
        $match: { cargo: buscaCargo}
      },
      {
        $group: {
          candidato: "$numCandidato",              
          quantidade: { $sum: 1 }     
        }
      },
      {
        $sort: { quantidade: -1 }
      }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao contar votos', detalhe: error.message });
  }
};

exports.maisVotado = async (req, res) => {
  try {
    const { buscaCargo } = req.params; 

    const resultado = await Voto.aggregate([
  {
        $match: { cargo: buscaCargo}
      },
      {
        $group: {
          candidato: "$numCandidato",              
          quantidade: { $sum: 1 }     
        }
      },
      {
        $sort: { quantidade: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (resultado.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum voto registrado." });
    }

    res.json(resultado[0]);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};