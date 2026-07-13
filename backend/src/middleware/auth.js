const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const encabezado = req.headers['authorization'];
  const token = encabezado && encabezado.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token de acceso no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'clave_de_desarrollo', (err, payload) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token invalido o expirado' });
    }
    req.usuario = payload;
    next();
  });
}

module.exports = { verificarToken };
