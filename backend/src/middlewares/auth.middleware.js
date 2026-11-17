const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_eleicao_es2_2026';

exports.autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};

exports.apenasChefe = (req, res, next) => {
  if (!req.usuario || req.usuario.perfil !== 'CHEFE') {
    return res.status(403).json({ erro: 'Acesso restrito ao Chefe da Seção.' });
  }
  return next();
};

exports.JWT_SECRET = JWT_SECRET;