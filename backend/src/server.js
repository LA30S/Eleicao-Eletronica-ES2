const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const candidatoRoutes = require('./routes/candidatoRoutes');
const chefeRoutes = require('./routes/chefeRoutes');
const eleicaoRoutes = require('./routes/eleicaoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const votoRoutes = require('./routes/votoRoutes');

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

app.use('/auth', usuarioRoutes);            // Atende http://localhost:3000/auth/login (Frontend)
app.use('/api/candidatos', candidatoRoutes); // Removidos os espaços extras
app.use('/api/chefe', chefeRoutes);
app.use('/api/eleicao', eleicaoRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/voto', votoRoutes);

app.listen(3000, () => console.log('Backend rodando na porta 3000'));