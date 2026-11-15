const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Defineção dummy de rotas para funções
router.post('/', usuarioController.cadastrarUsuario);
router.get('/', usuarioController.listarUsuarios);

module.exports = router;