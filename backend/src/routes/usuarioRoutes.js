const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, apenasChefe } = require('../middlewares/auth.middleware');

// Tópico 1: Login público
router.post('/login', usuarioController.login);

// Tópico 3: Gerenciamento de Eleitores (apenas Chefe da Seção)
router.post('/', autenticar, apenasChefe, usuarioController.cadastrarUsuario);
router.get('/', autenticar, apenasChefe, usuarioController.listarUsuarios);
router.put('/:id', autenticar, apenasChefe, usuarioController.atualizarUsuario);
router.delete('/', autenticar, apenasChefe, usuarioController.excluirUsuario);

module.exports = router;