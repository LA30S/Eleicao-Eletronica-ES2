const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidatoController');
const { autenticar, apenasEleitor , apenasChefe} = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Candidatos
 *   description: Operações de cadastro, consulta, atualização e votação de candidatos
 */

/**
 * @swagger
 * /api/candidatos:
 *   post:
 *     summary: Cadastra um novo candidato
 *     description: Cadastra um candidato no sistema. A senha é armazenada utilizando hash e não é incluída na resposta.
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
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Marcio
 *               numero:
 *                 type: integer
 *                 example: 50
 *               login:
 *                 type: string
 *                 example: 98765
 *               senha:
 *                 type: string
 *                 example: senha123
 *                 writeOnly: true
 *               cargo:
 *                 type: string
 *                 enum:
 *                   - A definir
 *                   - Deputado Estadual
 *                   - Deputado Federal
 *                   - Senador
 *                   - Governador
 *                   - Presidente da República
 *                 example: Senador
 *               partido:
 *                 type: string
 *                 example: Partido Exemplar
 *     responses:
 *       201:
 *         description: Candidato cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidato'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidato'
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
 *         description: ID do candidato no MongoDB.
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
 *                 example: João da Silva
 *               numero:
 *                 type: integer
 *                 example: 123
 *               login:
 *                 type: string
 *                 example: joao123
 *               senha:
 *                 type: string
 *                 example: novaSenha123
 *               cargo:
 *                 type: string
 *                 example: Governador
 *               partido:
 *                 type: string
 *                 example: Partido Exemplo
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
 *     description: Exclui um candidato identificado pelo ID.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do candidato no MongoDB.
 *         schema:
 *           type: string
 *           example: 674abc123456789
 *     responses:
 *       200:
 *         description: Candidato excluído com sucesso.
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

/**
 * @swagger
 * /api/candidatos/cargo:
 *   get:
 *     summary: Lista candidatos por cargo
 *     description: Consulta candidatos utilizando os parâmetros enviados na query string como critérios de busca.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cargo
 *         required: false
 *         description: Cargo utilizado como critério de busca.
 *         schema:
 *           type: string
 *           example: Governador
 *     responses:
 *       200:
 *         description: Candidatos encontrados para a consulta.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidato'
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
 *     description: Consulta candidatos utilizando os parâmetros enviados na query string e limita o resultado a um registro.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cargo
 *         required: false
 *         description: Cargo utilizado como critério de busca.
 *         schema:
 *           type: string
 *           example: Governador
 *     responses:
 *       200:
 *         description: Candidato encontrado para a consulta.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Candidato'
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       500:
 *         description: Erro ao buscar candidatos deste cargo.
 */
router.get('/mais-votados-cargo', autenticar, candidatoController.listarMaisCargo); 

/**
 * @swagger
 * /api/candidatos/{id}/voto:
 *   put:
 *     summary: Adiciona um voto a um candidato
 *     description: Executa uma operação de incremento na quantidade de votos do candidato.
 *     tags: [Candidatos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Parâmetro recebido pela rota.
 *         schema:
 *           type: string
 *           example: 123
 *     responses:
 *       200:
 *         description: Operação de votação realizada.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       500:
 *         description: Erro ao contabilizar voto.
 */
router.put('/:id/voto', autenticar, apenasEleitor, candidatoController.addVoto);

module.exports = router;