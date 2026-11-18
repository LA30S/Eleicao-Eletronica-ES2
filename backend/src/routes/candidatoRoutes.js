const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidatoController');
const { autenticar, apenasEleitor , apenasChefe} = require('../middlewares/auth.middleware');


router.post('/', autenticar, apenasChefe, candidatoController.cadastrarCandidato);
router.get('/', autenticar, apenasChefe, candidatoController.listarCandidatos);
router.put('/:id', autenticar, apenasChefe, candidatoController.atualizarCandidato);
router.delete('/:id', autenticar, apenasChefe, candidatoController.excluirCandidato);
router.get('/', autenticar, candidatoController.listarCandidatosCargo);
router.get('/', autenticar, candidatoController.listarMaisCargo); 
router.put('/:id', autenticar, apenasEleitor, candidatoController.addVoto);

module.exports = router;