const express = require('express');
const router = express.Router();
const chefeController = require('../controllers/chefeController');

/**
 * @swagger
 * tags:
 *   name: Chefes
 *   description: Operações de cadastro de chefes de seção
 */

/**
 * @swagger
 * /api/chefe:
 *   post:
 *     summary: Cadastra um novo chefe de seção
 *     description: Cria uma conta de chefe de seção utilizando nome, login e senha. A senha é armazenada no banco de dados utilizando hash e não é retornada na resposta.
 *     tags: [Chefes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoChefe'
 *     responses:
 *       201:
 *         description: Chefe de seção cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chefe'
 *       400:
 *         description: Erro ao cadastrar chefe, incluindo problemas de validação ou login duplicado.
 */
router.post('/', chefeController.cadastrarChefe);

module.exports = router;