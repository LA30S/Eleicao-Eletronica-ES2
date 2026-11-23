const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidatoController');
const { autenticar, apenasChefe } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Candidatos
 *   description: Operações de cadastro, consulta e atualização de candidatos
 */

/**
 * @swagger
 * /api/candidatos:
 *   post:
 *     summary: Cadastra um novo candidato
 *     description: Cadastra um candidato vinculado a um cargo e a uma eleição. A senha é armazenada utilizando hash e não é incluída na resposta.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - numero
 *               - login
 *               - senha
 *               - cargo
 *               - partido
 *               - eleicao
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Marcio
 *               numero:
 *                 type: integer
 *                 example: 50
 *               login:
 *                 type: string
 *                 example: cand50
 *               senha:
 *                 type: string
 *                 example: senha123
 *                 writeOnly: true
 *               cargo:
 *                 type: string
 *                 enum:
 *                   - Deputado Estadual
 *                   - Deputado Federal
 *                   - Senador
 *                   - Governador
 *                   - Presidente da República
 *                 example: Senador
 *               partido:
 *                 type: string
 *                 example: Partido Exemplar
 *               eleicao:
 *                 type: string
 *                 example: 674abc123456789
 *     responses:
 *       201:
 *         description: Candidato cadastrado com sucesso.
 *       400:
 *         description: Erro ao cadastrar candidato.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 */
router.post('/', autenticar, apenasChefe, candidatoController.cadastrarCandidato);

/**
 * @swagger
 * /api/candidatos:
 *   get:
 *     summary: Lista todos os candidatos
 *     description: Retorna todos os candidatos cadastrados no sistema.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de candidatos retornada com sucesso.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       500:
 *         description: Erro ao buscar candidatos.
 */
router.get('/', autenticar, apenasChefe, candidatoController.listarCandidatos);

/**
 * @swagger
 * /api/candidatos/cargo:
 *   get:
 *     summary: Lista candidatos por cargo
 *     description: Candidatos visualizam exclusivamente os concorrentes do próprio cargo e eleição; demais perfis podem filtrar por cargo e eleição.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cargo
 *         required: false
 *         schema:
 *           type: string
 *           example: Governador
 *       - in: query
 *         name: eleicao
 *         required: true
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Candidatos encontrados para a consulta.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       500:
 *         description: Erro ao buscar candidatos deste cargo.
 */
router.get('/cargo', autenticar, candidatoController.listarCandidatosCargo);

/**
 * @swagger
 * /api/candidatos/mais-votados-cargo:
 *   get:
 *     summary: Consulta o candidato mais votado por cargo
 *     description: Retorna o(s) candidato(s) mais votado(s) do cargo informado após o encerramento da eleição.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cargo
 *         required: true
 *         schema:
 *           type: string
 *           example: Governador
 *       - in: query
 *         name: eleicao
 *         required: false
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Candidato(s) mais votado(s) encontrado(s).
 *       400:
 *         description: Parâmetros inválidos ou eleição ainda não encerrada.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       500:
 *         description: Erro ao buscar candidatos deste cargo.
 */
router.get('/mais-votados-cargo', autenticar, candidatoController.listarMaisCargo);

/**
 * @swagger
 * /api/candidatos/{id}:
 *   put:
 *     summary: Atualiza os dados de um candidato
 *     description: Atualiza os dados de um candidato identificado pelo ID.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               numero:
 *                 type: integer
 *               login:
 *                 type: string
 *               senha:
 *                 type: string
 *               cargo:
 *                 type: string
 *               partido:
 *                 type: string
 *               eleicao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Candidato atualizado com sucesso.
 *       400:
 *         description: Erro ao atualizar candidato.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Candidato não encontrado.
 */
router.put('/:id', autenticar, apenasChefe, candidatoController.atualizarCandidato);

/**
 * @swagger
 * /api/candidatos/{id}:
 *   delete:
 *     summary: Exclui um candidato
 *     description: Exclui um candidato identificado pelo ID caso ainda não possua votos registrados.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Candidato excluído com sucesso.
 *       400:
 *         description: Candidato já possui votos ou ID inválido.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Candidato não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:id', autenticar, apenasChefe, candidatoController.excluirCandidato);

module.exports = router;
