const mongoose = require('mongoose');


const VotoSchema = new mongoose.Schema({
    numCandidato: {
        type: Number
        
    },
    cargo: {
        type: String
    }
});
module.exports = mongoose.model('Voto', VotoSchema);