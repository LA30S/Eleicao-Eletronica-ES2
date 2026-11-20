const mongoose = require('mongoose');

const votoSchema = new mongoose.Schema({
  eleicao: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleicao', required: true },
  candidato: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato', required: true },
  numCandidato: { type: Number, required: true },
  cargo: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Voto', votoSchema);