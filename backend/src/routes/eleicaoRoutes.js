const express = require('express');
const router = express.Router();
const eleicaoController = require('../controllers/eleicaoController');

// Defineção dummy de rotas para funções
router.post('/', eleicaoController.cadastrarEleicao);

module.exports = router;