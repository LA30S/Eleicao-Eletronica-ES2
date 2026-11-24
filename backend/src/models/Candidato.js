const mongoose = require('mongoose');

const CARGOS_VALIDOS = [
  'Deputado Estadual',
  'Deputado Federal',
  'Senador',
  'Governador',
  'Presidente da República'
];

const CandidatoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome do candidato é obrigatório'],
    trim: true
  },
  numero: {
    type: Number,
    required: [true, 'O candidato deve ter um número identificador']
  },
  login: {
    type: String,
    required: [true, 'O candidato deve ter um código de acesso'],
    unique: true,
    trim: true
  },
  senha: {
    type: String,
    required: [true, 'O candidato deve ter uma senha cadastrada'],
    select: false
  },
  cargo: {
    type: String,
    required: [true, 'O candidato deve ter um cargo'],
    enum: {
      values: CARGOS_VALIDOS,
      message: '{VALUE} não é um cargo válido'
    }
  },
  partido: {
    type: String,
    required: [true, 'O candidato deve estar afiliado a um partido'],
    trim: true
  },
  eleicao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleicao',
    required: [true, 'A eleição do candidato é obrigatória']
  },
  qtdVotos: {
    type: Number,
    default: 0,
    select: false
  }
});

CandidatoSchema.index({ eleicao: 1, cargo: 1, numero: 1 }, { unique: true });

module.exports = mongoose.model('Candidato', CandidatoSchema);
module.exports.CARGOS_VALIDOS = CARGOS_VALIDOS;