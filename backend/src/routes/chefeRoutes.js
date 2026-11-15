const express = require('express');
const router = express.Router();
const chefeController = require('../controllers/chefeController');

// Defineção dummy de rotas para funções
router.post('/', chefeController.cadastrarChefe);

module.exports = router;