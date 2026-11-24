const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, apenasChefe } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *  name: Usuários
 *  description: Operações de autenticação e gestão de usuários
 */

/**
 * @swagger
 * /api/usuario/login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     description: Autentica um chefe de seção, eleitor ou candidato utilizando código de acesso e senha. Retorna um token JWT e os dados da conta autenticada.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoAcesso
 *               - senha
 *             properties:
 *               codigoAcesso:
 *                 type: string
 *                 example: 123456
 *                 description: Login do chefe ou eleitor, ou número do candidato.
 *               senha:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT válido por 8 horas.
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: string
 *                     nome:
 *                       type: string
 *                       example: Marcio
 *                     perfil:
 *                       type: string
 *                       enum: [CHEFE, ELEITOR, CANDIDATO]
 *                       example: ELEITOR
 *                     votou:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Código de acesso ou senha não informados.
 *       401:
 *         description: Credenciais inválidas.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', usuarioController.login);

/**
 * @swagger
 * /api/usuario:
 *   post:
 *     summary: Cadastra um novo eleitor
 *     description: Cria uma conta de eleitor. A senha é armazenada utilizando hash e o eleitor começa com o status de votação não realizada.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoUsuario'
 *     responses:
 *       201:
 *         description: Eleitor cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro ao cadastrar eleitor, como dados inválidos ou login já existente.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 */
router.post('/', autenticar, apenasChefe, usuarioController.cadastrarUsuario);


/**
 * @swagger
 * /api/usuario:
 *   get:
 *     summary: Lista todos os eleitores
 *     description: Retorna a lista de usuários cadastrados no sistema. Disponível apenas para chefes de seção.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eleitores retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *             example:
 *               - _id: "string"
 *                 nome: "Fulano"
 *                 login: "445566"
 *                 votou: true
 *                 participacoes:
 *                   - eleicao: "string"
 *                     cargo: "Deputado Estadual"
 *                     _id: "string"
 *                   - eleicao: "string"
 *                     cargo: "Deputado Federal"
 *                     _id: "string"
 *                   - eleicao: "string"
 *                     cargo: "Senador"
 *                     _id: "string"
 *                   - eleicao: "string"
 *                     cargo: "Governador"
 *                     _id: "string"
 *                   - eleicao: "string"
 *                     cargo: "Presidente da República"
 *                     _id: "string"
 *                 createdAt: "2026-11-24T02:40:40.539Z"
 *                 updatedAt: "2026-11-24T03:46:27.245Z"
 *                 __v: 0
 *
 *               - _id: "string"
 *                 nome: "Ciclano"
 *                 login: "44566"
 *                 votou: false
 *                 participacoes: []
 *                 createdAt: "2026-11-24T02:41:09.126Z"
 *                 updatedAt: "2026-11-24T02:41:09.126Z"
 *                 __v: 0
 *
 *               - _id: "string"
 *                 nome: "Jorge"
 *                 login: "445669"
 *                 votou: false
 *                 participacoes: []
 *                 createdAt: "2026-11-24T02:41:21.647Z"
 *                 updatedAt: "2026-11-24T02:41:21.647Z"
 *                 __v: 0
 *
 *               - _id: "string"
 *                 nome: "Lucia"
 *                 login: "115669"
 *                 votou: false
 *                 participacoes: []
 *                 createdAt: "2026-11-24T02:41:33.526Z"
 *                 updatedAt: "2026-11-24T02:41:33.526Z"
 *                 __v: 0
 *
 *               - _id: "string"
 *                 nome: "Ana"
 *                 login: "115329"
 *                 votou: false
 *                 participacoes: []
 *                 createdAt: "2026-11-24T02:41:50.716Z"
 *                 updatedAt: "2026-11-24T02:41:50.716Z"
 *                 __v: 0
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       500:
 *         description: Erro ao buscar usuários.
 */

router.get('/', autenticar, apenasChefe, usuarioController.listarUsuarios);

/**
 * @swagger
 * /api/usuario/{id}:
 *   put:
 *     summary: Atualiza os dados de um eleitor
 *     description: Atualiza os dados de um eleitor identificado pelo ID. Os campos votou e participacoes não podem ser alterados por esta operação.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do eleitor no MongoDB.
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
 *                 example: Marcio
 *               login:
 *                 type: string
 *                 example: 123456
 *               senha:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Eleitor atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Erro de validação dos dados enviados.
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Eleitor não encontrado.
 */
router.put('/:id', autenticar, apenasChefe, usuarioController.atualizarUsuario);


/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Exclui um eleitor
 *     description: Remove permanentemente um eleitor identificado pelo ID.
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do eleitor no MongoDB.
 *         schema:
 *           type: string
 *           example: string
 *     responses:
 *       200:
 *         description: Eleitor excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *             example:
 *               mensagem: "Eleitor excluído com sucesso."
 *       401:
 *         description: Token de autenticação não fornecido ou inválido.
 *       403:
 *         description: Acesso restrito ao Chefe da Seção.
 *       404:
 *         description: Eleitor não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:id', autenticar, apenasChefe, usuarioController.excluirUsuario);

module.exports = router;