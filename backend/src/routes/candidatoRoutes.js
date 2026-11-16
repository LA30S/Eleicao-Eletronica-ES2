const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidatoController');

// Defineção dummy de rotas para funções
router.post('/', candidatoController.cadastrarCandidato);
router.get('/', candidatoController.listarCandidatos);

module.exports = router;