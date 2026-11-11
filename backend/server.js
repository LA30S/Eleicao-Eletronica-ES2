const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meubanco';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.get('/api', (req, res) => {
  res.json({ message: 'API funcionando!' });
});
//eu peguei essa config genérica, podemos mudar depois as portas e o link se necessário
app.listen(3000, () => console.log('Backend rodando na porta 3000'));