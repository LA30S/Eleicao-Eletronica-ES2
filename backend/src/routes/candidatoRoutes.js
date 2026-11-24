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
 *                 example: Marco
 *               numero:
 *                 type: integer
 *                 example: 15148
 *               login:
 *                 type: string
 *                 example: "1104417"
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
 *               eleicao:
 *                 type: string
 *                 example: "string"
 *           example:
 *             nome: Marco
 *             numero: 15148
 *             login: "1104417"
 *             senha: senha123
 *             cargo: Senador
 *             partido: Partido Exemplar
 *             eleicao: "string"
 *     responses:
 *       201:
 *         description: Candidato cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                 numero:
 *                   type: integer
 *                 login:
 *                   type: string
 *                 cargo:
 *                   type: string
 *                 partido:
 *                   type: string
 *                 eleicao:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 __v:
 *                   type: integer
 *             example:
 *               nome: Marco
 *               numero: 15148
 *               login: "1104417"
 *               cargo: Senador
 *               partido: Partido Exemplar
 *               eleicao: "string"
 *               _id: "string"
 *               __v: 0
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
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   numero:
 *                     type: integer
 *                   login:
 *                     type: string
 *                   cargo:
 *                     type: string
 *                   partido:
 *                     type: string
 *                   eleicao:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       data:
 *                         type: string
 *                         format: date-time
 *                       turno:
 *                         type: integer
 *                       situacao:
 *                         type: string
 *                   __v:
 *                     type: integer
 *             example:
 *               - _id: "string"
 *                 nome: "Fábio"
 *                 numero: 15
 *                 login: "1109"
 *                 cargo: "Deputado Estadual"
 *                 partido: "Partido Exemplar"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Bernardo"
 *                 numero: 18
 *                 login: "11009"
 *                 cargo: "Deputado Estadual"
 *                 partido: "Partido Ambíguo"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Cleber"
 *                 numero: 152
 *                 login: "110119"
 *                 cargo: "Deputado Federal"
 *                 partido: "Partido Exemplar"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Rogéria"
 *                 numero: 158
 *                 login: "1101129"
 *                 cargo: "Deputado Federal"
 *                 partido: "Partido Ambíguo"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Luisa"
 *                 numero: 1518
 *                 login: "11017"
 *                 cargo: "Governador"
 *                 partido: "Partido Ambíguo"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Reginaldo"
 *                 numero: 1548
 *                 login: "110417"
 *                 cargo: "Governador"
 *                 partido: "Partido Exemplar"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Marco"
 *                 numero: 15148
 *                 login: "1104417"
 *                 cargo: "Senador"
 *                 partido: "Partido Exemplar"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Cláudia"
 *                 numero: 15198
 *                 login: "04417"
 *                 cargo: "Senador"
 *                 partido: "Partido Ambíguo"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Fabricio"
 *                 numero: 151980
 *                 login: "0417"
 *                 cargo: "Presidente da República"
 *                 partido: "Partido Exemplar"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Clotilde"
 *                 numero: 151280
 *                 login: "04137"
 *                 cargo: "Presidente da República"
 *                 partido: "Partido Ambíguo"
 *                 eleicao:
 *                   _id: "string"
 *                   data: "2026-11-23T00:00:00.000Z"
 *                   turno: 1
 *                   situacao: "AGENDADA"
 *                 __v: 0
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
 *           example: string
 *     responses:
 *       200:
 *         description: Candidatos encontrados para a consulta.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   numero:
 *                     type: integer
 *                   login:
 *                     type: string
 *                   cargo:
 *                     type: string
 *                   partido:
 *                     type: string
 *                   eleicao:
 *                     type: string
 *                   qtdVotos:
 *                     type: integer
 *                   __v:
 *                     type: integer
 *             example:
 *               - _id: "string"
 *                 nome: "Luisa"
 *                 numero: 1518
 *                 login: "11017"
 *                 cargo: "Governador"
 *                 partido: "Partido Ambíguo"
 *                 eleicao: "string"
 *                 qtdVotos: 0
 *                 __v: 0
 *               - _id: "string"
 *                 nome: "Reginaldo"
 *                 numero: 1548
 *                 login: "110417"
 *                 cargo: "Governador"
 *                 partido: "Partido Exemplar"
 *                 eleicao: "string"
 *                 qtdVotos: 0
 *                 __v: 0
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
 *           example: string
 *     responses:
 *       200:
 *         description: Candidato(s) mais votado(s) encontrado(s).
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   numero:
 *                     type: integer
 *                   partido:
 *                     type: string
 *                   cargo:
 *                     type: string
 *                   votos:
 *                     type: integer
 *             example:
 *               - _id: "6b04fc24ef08a6a5a2f249ff"
 *                 nome: "Luisa"
 *                 numero: 1518
 *                 partido: "Partido Ambíguo"
 *                 cargo: "Governador"
 *                 votos: 1
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
 *         description: ID do candidato no MongoDB.
 *         schema:
 *           type: string
 *           example: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Clotilde
 *               numero:
 *                 type: integer
 *                 example: 151280
 *               login:
 *                 type: string
 *                 example: "04137"
 *               senha:
 *                 type: string
 *                 example: novaSenha123
 *                 writeOnly: true
 *               cargo:
 *                 type: string
 *                 example: Presidente da República
 *               partido:
 *                 type: string
 *                 example: Partido Exemplar
 *               eleicao:
 *                 type: string
 *                 example: "string"
 *           example:
 *             nome: Clotilde
 *             numero: 151280
 *             login: "04137"
 *             senha: novaSenha123
 *             cargo: Presidente da República
 *             partido: Partido Exemplar
 *             eleicao: "string"
 *     responses:
 *       200:
 *         description: Candidato atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 numero:
 *                   type: integer
 *                 login:
 *                   type: string
 *                 cargo:
 *                   type: string
 *                 partido:
 *                   type: string
 *                 eleicao:
 *                   type: string
 *                 __v:
 *                   type: integer
 *             example:
 *               _id: "string"
 *               nome: Clotilde
 *               numero: 151280
 *               login: "04137"
 *               cargo: Presidente da República
 *               partido: Partido Exemplar
 *               eleicao: "string"
 *               __v: 0
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
 *           example: string
 *     responses:
 *       200:
 *         description: Candidato excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *             example:
 *               mensagem: "Candidato excluído com sucesso."
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