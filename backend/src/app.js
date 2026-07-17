const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const evaluacionRoutes = require('./routes/evaluacionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ RUTA RAÍZ (SOLUCIONA TU PROBLEMA EN "/")
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de proveedores funcionando 🚀',
    endpoints: {
      health: '/api/health',
      proveedores: '/api/proveedores',
      auth: '/api/auth',
      evaluaciones: '/api/evaluaciones'
    }
  });
});

// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    estado: 'ok',
    servicio: 'SSD Proveedores API',
    version: '1.0.0'
  });
});

// ✅ RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);

// ❌ NO TOCAR (ESTÁ BIEN)
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Recurso no encontrado' });
});

// ❌ NO TOCAR (ESTÁ BIEN)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;