const mongoose = require('mongoose');

const CandidatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "O nome do candidato é obrigatório"],
        trim: true
    },
    numero:{
        type: Number,
        required: [true, "O candidato deve ter um número identificador"],
        unique:  true,
        trim:true
    },
    login:{
             type: String,
        required: [true, "O candidato deve ter um código de acesso"],
        unique:  true,
        trim:true
    },
    senha:{
        type: String,
        required: [true, "O candidato deve ter uma senha cadastrada"],
        select: false
    },
    cargo:{
        type: String,
        required: [true, "O candidato deve ter um cargo"],
        enum: {
            values: ['A definir', 'Deputado Estadual', 'Deputado Federal', 'Senador', 'Governador', 'Presidente da República'],
            message: '{VALUE} não é um cargo válido',
        },
        default: 'A definir'
    },
    partido:{
        type: String,
        required: [true, "O candidato deve estar afiliado a um partido"],
        trim: true
    },
    qtdVotos:{
        type: Number,
        required:[false],
        default:0
    }
});
module.exports = mongoose.model('Candidato', CandidatoSchema);