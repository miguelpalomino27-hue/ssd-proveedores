require('dotenv').config();
const app = require('./app');
const { verificarConexion } = require('./config/db');

const PORT = process.env.PORT || 4000;

async function iniciar() {
  await verificarConexion();
  app.listen(PORT, () => {
    console.log(`[Servidor] API del SSD de proveedores escuchando en el puerto ${PORT}`);
  });
}

iniciar();
