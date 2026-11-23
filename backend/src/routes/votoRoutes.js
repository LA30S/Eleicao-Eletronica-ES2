const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votoController');
const { autenticar, apenasEleitor } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Votos
 *   description: Operações de votação, acompanhamento e consulta de resultados
 */

/**
 * @swagger
 * /api/voto/candidatos/{eleicaoId}/{cargo}:
 *   get:
 *     summary: Consulta candidatos por cargo
 *     description: Retorna os candidatos cadastrados para um dado cargo em uma eleição específica. Acesso restrito ao Eleitor.
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eleicaoId
 *         required: true
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *       - in: path
 *         name: cargo
 *         required: true
 *         schema:
 *           type: string
 *           example: Governador
 *     responses:
 *       200:
 *         description: Lista de candidatos retornada com sucesso.
 *       400:
 *         description: Eleição ou cargo inválido.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito aos eleitores.
 *       404:
 *         description: Eleição não encontrada.
 *       500:
 *         description: Erro interno ao consultar candidatos.
 */
router.get('/candidatos/:eleicaoId/:cargo', autenticar, apenasEleitor, votoController.candidatosPorCargo);

/**
 * @swagger
 * /api/voto:
 *   post:
 *     summary: Registra e confirma um voto
 *     description: Registra o voto sigiloso de um eleitor para determinado cargo em uma eleição aberta (apenas 1 voto por cargo).
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eleicaoId
 *               - cargo
 *               - numCandidato
 *             properties:
 *               eleicaoId:
 *                 type: string
 *                 example: 674abc123456789
 *               cargo:
 *                 type: string
 *                 example: Presidente da República
 *               numCandidato:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Voto confirmado com sucesso.
 *       400:
 *         description: Votação bloqueada ou eleitor já votou para o cargo informado.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito a eleitores.
 *       404:
 *         description: Eleição, candidato ou eleitor não encontrado.
 *       500:
 *         description: Erro interno ao registrar o voto.
 */
router.post('/', autenticar, apenasEleitor, votoController.registrarVoto);

/**
 * @swagger
 * /api/voto/acompanhamento/{eleicaoId}:
 *   get:
 *     summary: Acompanha a votação em andamento
 *     description: Retorna a quantidade de votos de cada candidato enquanto a eleição estiver ABERTA. Eleitores acompanham todos os cargos; candidatos visualizam somente o cargo e a eleição aos quais concorrem.
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eleicaoId
 *         required: true
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Dados de acompanhamento retornados com sucesso.
 *       400:
 *         description: Acompanhamento disponível apenas com a eleição ABERTA.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Candidato tentando acompanhar outra eleição.
 *       404:
 *         description: Eleição não encontrada.
 *       500:
 *         description: Erro interno ao acompanhar a votação.
 */
router.get('/acompanhamento/:eleicaoId', autenticar, votoController.acompanharVotacao);

/**
 * @swagger
 * /api/voto/resultado/{eleicaoId}:
 *   get:
 *     summary: Consulta o resultado final da eleição
 *     description: Retorna a quantidade de votos de cada candidato e identifica o mais votado por cargo após o encerramento da eleição.
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eleicaoId
 *         required: true
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Resultado final da eleição.
 *       400:
 *         description: O resultado final só pode ser consultado após o encerramento da eleição.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       404:
 *         description: Eleição não encontrada.
 *       500:
 *         description: Erro interno ao consultar o resultado final.
 */
router.get('/resultado/:eleicaoId', autenticar, votoController.resultadoFinal);

module.exports = router;