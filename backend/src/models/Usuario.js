const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  senha: { type: String, required: true, select: false },
  votou: { type: Boolean, default: false },
  participacoes: [
    {
      eleicao: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleicao', required: true },
      cargo: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);