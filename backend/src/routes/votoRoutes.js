const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votoController');

// Defineção dummy de rotas para funções
router.post('/', votoController.adicionarVoto);
router.get('/', votoController.contarVotos);
router.get('/', votoController.contagemCargo);
router.get('/', votoController.maisVotado);

module.exports = router;