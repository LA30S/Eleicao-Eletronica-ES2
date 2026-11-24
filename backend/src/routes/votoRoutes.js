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
 *           example: string
 *       - in: path
 *         name: cargo
 *         required: true
 *         description: Cargo para o qual os candidatos serão consultados.
 *         schema:
 *           type: string
 *           example: Deputado Estadual
 *     responses:
 *       200:
 *         description: Lista de candidatos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *             example:
 *               - _id: "string"
 *                 nome: Fábio
 *                 numero: 15
 *                 login: "1109"
 *                 cargo: Deputado Estadual
 *                 partido: Partido Exemplar
 *                 eleicao: "string"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: Bernardo
 *                 numero: 18
 *                 login: "11009"
 *                 cargo: Deputado Estadual
 *                 partido: Partido Ambíguo
 *                 eleicao: "string"
 *                 __v: 0
 *       400:
 *         description: Eleição ou cargo inválido.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       500:
 *         description: Erro interno ao consultar candidatos.
 */

router.get('/candidatos/:eleicaoId/:cargo', autenticar, apenasEleitor, votoController.candidatosPorCargo);


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
 *                 example: string
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
 *             example:
 *               mensagem: "Voto confirmado com sucesso para Presidente da República."
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
 *           example: string
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
 *                 situacao:
 *                   type: string
 *                   example: ABERTA
 *                 evolucao:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       candidatoId:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       numero:
 *                         type: integer
 *                       partido:
 *                         type: string
 *                       cargo:
 *                         type: string
 *                       votos:
 *                         type: integer
 *             example:
 *               eleicaoId: "string"
 *               situacao: ABERTA
 *               evolucao:
 *                 - candidatoId: "string"
 *                   nome: Fábio
 *                   numero: 15
 *                   partido: Partido Exemplar
 *                   cargo: Deputado Estadual
 *                   votos: 1
 *                 - candidatoId: "string"
 *                   nome: Rogéria
 *                   numero: 158
 *                   partido: Partido Ambíguo
 *                   cargo: Deputado Federal
 *                   votos: 1
 *                 - candidatoId: "string"
 *                   nome: Luisa
 *                   numero: 1518
 *                   partido: Partido Ambíguo
 *                   cargo: Governador
 *                   votos: 1
 *                 - candidatoId: "string"
 *                   nome: Fabricio
 *                   numero: 151980
 *                   partido: Partido Exemplar
 *                   cargo: Presidente da República
 *                   votos: 1
 *                 - candidatoId: "string"
 *                   nome: Marco
 *                   numero: 15148
 *                   partido: Partido Exemplar
 *                   cargo: Senador
 *                   votos: 1
 *                 - candidatoId: "string"
 *                   nome: Bernardo
 *                   numero: 18
 *                   partido: Partido Ambíguo
 *                   cargo: Deputado Estadual
 *                   votos: 0
 *                 - candidatoId: "string"
 *                   nome: Cleber
 *                   numero: 152
 *                   partido: Partido Exemplar
 *                   cargo: Deputado Federal
 *                   votos: 0
 *                 - candidatoId: "string"
 *                   nome: Reginaldo
 *                   numero: 1548
 *                   partido: Partido Exemplar
 *                   cargo: Governador
 *                   votos: 0
 *                 - candidatoId: "string"
 *                   nome: Clotilde
 *                   numero: 151280
 *                   partido: Partido Ambíguo
 *                   cargo: Presidente da República
 *                   votos: 0
 *                 - candidatoId: "string"
 *                   nome: Cláudia
 *                   numero: 15198
 *                   partido: Partido Ambíguo
 *                   cargo: Senador
 *                   votos: 0
 *       400:
 *         description: Acompanhamento disponível apenas com a eleição ABERTA.
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
 *           example: string
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
 *                       example: ENCERRADA
 *                 resultados:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       candidatos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             nome:
 *                               type: string
 *                             numero:
 *                               type: integer
 *                             partido:
 *                               type: string
 *                             cargo:
 *                               type: string
 *                             votos:
 *                               type: integer
 *                       maisVotado:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                           numero:
 *                             type: integer
 *                           partido:
 *                             type: string
 *                           cargo:
 *                             type: string
 *                           votos:
 *                             type: integer
 *                       maisVotados:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             nome:
 *                               type: string
 *                             numero:
 *                               type: integer
 *                             partido:
 *                               type: string
 *                             cargo:
 *                               type: string
 *                             votos:
 *                               type: integer
 *                       empate:
 *                         type: boolean
 *             example:
 *               eleicao:
 *                 id: "string"
 *                 data: "2026-11-23T00:00:00.000Z"
 *                 turno: 1
 *                 situacao: ENCERRADA
 *               resultados:
 *                 Deputado Estadual:
 *                   candidatos:
 *                     - nome: Fábio
 *                       numero: 15
 *                       partido: Partido Exemplar
 *                       cargo: Deputado Estadual
 *                       votos: 1
 *                     - nome: Bernardo
 *                       numero: 18
 *                       partido: Partido Ambíguo
 *                       cargo: Deputado Estadual
 *                       votos: 0
 *                   maisVotado:
 *                     nome: Fábio
 *                     numero: 15
 *                     partido: Partido Exemplar
 *                     cargo: Deputado Estadual
 *                     votos: 1
 *                   maisVotados:
 *                     - nome: Fábio
 *                       numero: 15
 *                       partido: Partido Exemplar
 *                       cargo: Deputado Estadual
 *                       votos: 1
 *                   empate: false
 *                 Deputado Federal:
 *                   candidatos:
 *                     - nome: Rogéria
 *                       numero: 158
 *                       partido: Partido Ambíguo
 *                       cargo: Deputado Federal
 *                       votos: 1
 *                     - nome: Cleber
 *                       numero: 152
 *                       partido: Partido Exemplar
 *                       cargo: Deputado Federal
 *                       votos: 0
 *                   maisVotado:
 *                     nome: Rogéria
 *                     numero: 158
 *                     partido: Partido Ambíguo
 *                     cargo: Deputado Federal
 *                     votos: 1
 *                   maisVotados:
 *                     - nome: Rogéria
 *                       numero: 158
 *                       partido: Partido Ambíguo
 *                       cargo: Deputado Federal
 *                       votos: 1
 *                   empate: false
 *                 Governador:
 *                   candidatos:
 *                     - nome: Luisa
 *                       numero: 1518
 *                       partido: Partido Ambíguo
 *                       cargo: Governador
 *                       votos: 1
 *                     - nome: Reginaldo
 *                       numero: 1548
 *                       partido: Partido Exemplar
 *                       cargo: Governador
 *                       votos: 0
 *                   maisVotado:
 *                     nome: Luisa
 *                     numero: 1518
 *                     partido: Partido Ambíguo
 *                     cargo: Governador
 *                     votos: 1
 *                   maisVotados:
 *                     - nome: Luisa
 *                       numero: 1518
 *                       partido: Partido Ambíguo
 *                       cargo: Governador
 *                       votos: 1
 *                   empate: false
 *                 Presidente da República:
 *                   candidatos:
 *                     - nome: Fabricio
 *                       numero: 151980
 *                       partido: Partido Exemplar
 *                       cargo: Presidente da República
 *                       votos: 1
 *                     - nome: Clotilde
 *                       numero: 151280
 *                       partido: Partido Ambíguo
 *                       cargo: Presidente da República
 *                       votos: 0
 *                   maisVotado:
 *                     nome: Fabricio
 *                     numero: 151980
 *                     partido: Partido Exemplar
 *                     cargo: Presidente da República
 *                     votos: 1
 *                   maisVotados:
 *                     - nome: Fabricio
 *                       numero: 151980
 *                       partido: Partido Exemplar
 *                       cargo: Presidente da República
 *                       votos: 1
 *                   empate: false
 *                 Senador:
 *                   candidatos:
 *                     - nome: Marco
 *                       numero: 15148
 *                       partido: Partido Exemplar
 *                       cargo: Senador
 *                       votos: 1
 *                     - nome: Cláudia
 *                       numero: 15198
 *                       partido: Partido Ambíguo
 *                       cargo: Senador
 *                       votos: 0
 *                   maisVotado:
 *                     nome: Marco
 *                     numero: 15148
 *                     partido: Partido Exemplar
 *                     cargo: Senador
 *                     votos: 1
 *                   maisVotados:
 *                     - nome: Marco
 *                       numero: 15148
 *                       partido: Partido Exemplar
 *                       cargo: Senador
 *                       votos: 1
 *                   empate: false
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