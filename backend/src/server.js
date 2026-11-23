const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

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

app.use('/api/candidatos', candidatoRoutes);
app.use('/api/chefe', chefeRoutes);
app.use('/api/eleicao', eleicaoRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/voto', votoRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
if (require.main === module) {
  app.listen(3000, () => console.log('Backend rodando na porta 3000'));
}

module.exports = app;
