const mongoose = require('mongoose');

const EleicaoSchema = new mongoose.Schema({
    data: {
        type: Date,
        required: [true, "Defina a data da eleição"],
        trim: true
    },
    turno:{
        type: Number,
        required: [true, "Defina o turno da eleição"],
        unique:  true,
        trim:true
    },
    abertura:{
        type: String,
        required: [true, "Defina o horário para início da votação"],
        trim:true,
    },
        encerramento:{
        type: String,
        required: [true, "Defina o horário para encerramento da votação"],
        trim:true,
    },
    situacao:{
    type: String,
    required: [true, "Defina a situação da votação"],
    enum: {
      values: ['AGENDADA', 'ABERTA', 'ENCERRADA'],
      message: '{VALUE} não é uma situalção válida',
       default: 'AGENDADA'
    }
    }
});
module.exports = mongoose.model('Eleicao', EleicaoSchema);