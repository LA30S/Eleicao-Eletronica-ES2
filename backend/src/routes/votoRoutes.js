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
 *     description: Retorna os candidatos cadastrados para um dado cargo em uma eleição específica.
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eleicaoId
 *         required: true
 *         description: ID da eleição no MongoDB.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *       - in: path
 *         name: cargo
 *         required: true
 *         description: Cargo para o qual os candidatos serão consultados.
 *         schema:
 *           type: string
 *           example: Governador
 *     responses:
 *       200:
 *         description: Lista de candidatos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidato'
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       500:
 *         description: Erro interno ao consultar candidatos.
 */
router.get('/candidatos/:eleicaoId/:cargo', autenticar, votoController.candidatosPorCargo);

/**
 * @swagger
 * /api/voto:
 *   post:
 *     summary: Registra e confirma um voto
 *     description: Registra o voto de um eleitor para determinado cargo em uma eleição. O sistema verifica se a eleição está aberta, se o candidato pertence ao cargo e à eleição informados e se o eleitor ainda não votou naquele cargo.
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
 *                 description: ID da eleição em que o voto será registrado.
 *               cargo:
 *                 type: string
 *                 example: Presidente da República
 *               numCandidato:
 *                 type: integer
 *                 example: 50
 *                 description: Número do candidato escolhido.
 *     responses:
 *       201:
 *         description: Voto confirmado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Voto confirmado com sucesso para Presidente da República.
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
 *     summary: Acompanha a votação
 *     description: Retorna a quantidade de votos de cada candidato durante uma eleição. Eleitores podem acompanhar todos os cargos, enquanto candidatos visualizam somente o cargo ao qual concorrem.
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eleicaoId
 *         required: true
 *         description: ID da eleição que será acompanhada.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Dados de acompanhamento retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eleicaoId:
 *                   type: string
 *                   example: 674abc123456789
 *                 situacao:
 *                   type: string
 *                   enum: [AGENDADA, ABERTA, ENCERRADA]
 *                   example: ABERTA
 *                 evolucao:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidatoId:
 *                         type: string
 *                         example: 674abc987654321
 *                       nome:
 *                         type: string
 *                         example: Fabricio
 *                       numero:
 *                         type: integer
 *                         example: 50
 *                       partido:
 *                         type: string
 *                         example: Partido Exemplar
 *                       cargo:
 *                         type: string
 *                         example: Presidente da República
 *                       votos:
 *                         type: integer
 *                         example: 150
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
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
 *     description: Retorna a quantidade de votos de cada candidato e identifica o mais votado por cargo. O resultado somente pode ser consultado depois que a eleição estiver encerrada.
 *     tags: [Votos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eleicaoId
 *         required: true
 *         description: ID da eleição cujo resultado será consultado.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Resultado final da eleição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eleicao:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     data:
 *                       type: string
 *                       format: date-time
 *                     turno:
 *                       type: integer
 *                     situacao:
 *                       type: string
 *                 resultados:
 *                   type: object
 *             example:
 *               eleicao:
 *                 id: "674abc123456789"
 *                 data: "2026-11-20T00:00:00.000Z"
 *                 turno: 1
 *                 situacao: "ENCERRADA"
 *               resultados:
 *                 "Presidente da República":
 *                   candidatos:
 *                     - nome: "Fabricio"
 *                       numero: 50
 *                       partido: "Partido Exemplar"
 *                       cargo: "Presidente da República"
 *                       votos: 150
 *                   maisVotado:
 *                     nome: "Fabricio"
 *                     numero: 50
 *                     partido: "Partido Exemplar"
 *                     cargo: "Presidente da República"
 *                     votos: 150
 *                 "Governador":
 *                   candidatos:
 *                     - nome: "Luisa"
 *                       numero: 120
 *                       partido: "Partido Ambíguo"
 *                       cargo: "Governador"
 *                       votos: 100
 *                   maisVotado:
 *                     nome: "Luisa"
 *                     numero: 120
 *                     partido: "Partido Ambíguo"
 *                     cargo: "Governador"
 *                     votos: 100
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