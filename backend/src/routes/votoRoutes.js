const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votoController');
const { autenticar, apenasEleitor } = require('../middlewares/auth.middleware');

// Requisito 5: Consultar candidatos por cargo e confirmar voto (apenas Eleitor, sem PUT/DELETE)
router.get('/candidatos/:eleicaoId/:cargo', autenticar, votoController.candidatosPorCargo);
router.post('/', autenticar, apenasEleitor, votoController.registrarVoto);

// Requisito 6: Acompanhamento durante a eleição
router.get('/acompanhamento/:eleicaoId', autenticar, votoController.acompanharVotacao);

// Requisito 7: Resultado final após encerramento
router.get('/resultado/:eleicaoId', autenticar, votoController.resultadoFinal);

module.exports = router;