const express = require('express');
const router = express.Router();
const eleicaoController = require('../controllers/eleicaoController');
const { autenticar, apenasChefe } = require('../middlewares/auth.middleware');

router.get('/', autenticar, eleicaoController.listarEleicoes);
router.get('/:id', autenticar, eleicaoController.consultarSituacao);
router.post('/', autenticar, apenasChefe, eleicaoController.cadastrarEleicao);
router.patch('/:id/abrir', autenticar, apenasChefe, eleicaoController.abrirEleicao);
router.patch('/:id/encerrar', autenticar, apenasChefe, eleicaoController.encerrarEleicao);

module.exports = router;