const mongoose = require('mongoose');

const ChefeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "O nome do usuário é obrigatório"],
        trim: true
    },
    login:{
        type: String,
        required: [true, "O usuário deve ter um código de acesso"],
        unique:  true,
        trim:true
    },
    senha:{
        type: String,
        required: [true, "O usuário deve ter uma senha cadastrada"],
        select: false
    }
});
module.exports = mongoose.model('Chefe', ChefeSchema);