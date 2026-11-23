const express = require('express');
const router = express.Router();
const eleicaoController = require('../controllers/eleicaoController');
const { autenticar, apenasChefe } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Eleições
 *   description: Operações de gerenciamento e consulta de eleições
 */

/**
 * @swagger
 * /api/eleicao:
 *   get:
 *     summary: Lista todas as eleições
 *     description: Retorna todas as eleições cadastradas no sistema. Acesso restrito ao Chefe da Seção.
 *     tags: [Eleições]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eleições retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Eleicao'
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       500:
 *         description: Erro interno ao buscar as eleições.
 */
router.get('/', autenticar, apenasChefe, eleicaoController.listarEleicoes);

/**
 * @swagger
 * /api/eleicao/{id}:
 *   get:
 *     summary: Consulta uma eleição específica
 *     description: Busca uma eleição pelo seu ID e retorna seus dados, incluindo a situação atual. Acesso restrito ao Chefe da Seção.
 *     tags: [Eleições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da eleição no MongoDB.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Eleição encontrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Eleicao'
 *       400:
 *         description: ID de eleição inválido.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Eleição não encontrada.
 *       500:
 *         description: Erro interno ao consultar a eleição.
 */
router.get('/:id', autenticar, apenasChefe, eleicaoController.consultarSituacao);

/**
 * @swagger
 * /api/eleicao:
 *   post:
 *     summary: Cadastra uma nova eleição
 *     description: Cria uma eleição com os dados informados. A situação inicial é definida automaticamente como AGENDADA.
 *     tags: [Eleições]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaEleicao'
 *     responses:
 *       201:
 *         description: Eleição cadastrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Eleicao'
 *       400:
 *         description: Erro ao cadastrar eleição, incluindo problemas de validação.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 */
router.post('/', autenticar, apenasChefe, eleicaoController.cadastrarEleicao);

/**
 * @swagger
 * /api/eleicao/{id}/abrir:
 *   patch:
 *     summary: Abre uma eleição
 *     description: Altera a situação de uma eleição de AGENDADA para ABERTA. Somente eleições agendadas podem ser abertas.
 *     tags: [Eleições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da eleição no MongoDB.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Eleição aberta com sucesso.
 *       400:
 *         description: A eleição não pode ser aberta porque não está AGENDADA.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Eleição não encontrada.
 *       500:
 *         description: Erro interno ao abrir a eleição.
 */
router.patch('/:id/abrir', autenticar, apenasChefe, eleicaoController.abrirEleicao);

/**
 * @swagger
 * /api/eleicao/{id}/encerrar:
 *   patch:
 *     summary: Encerra uma eleição
 *     description: Altera a situação de uma eleição de ABERTA para ENCERRADA. Somente eleições abertas podem ser encerradas.
 *     tags: [Eleições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da eleição no MongoDB.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Eleição encerrada com sucesso.
 *       400:
 *         description: Somente eleições ABERTAS podem ser encerradas.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Eleição não encontrada.
 *       500:
 *         description: Erro interno ao encerrar a eleição.
 */
router.patch('/:id/encerrar', autenticar, apenasChefe, eleicaoController.encerrarEleicao);

module.exports = router;