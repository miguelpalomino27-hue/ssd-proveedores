-- ============================================================
-- Datos semilla (seed) para entorno de pruebas / demostracion
-- ============================================================
USE railway;

-- Usuario administrador de demo (password: Admin123* -> se genera con bcrypt desde la app,
-- este INSERT es solo referencial; usar POST /api/auth/registro para generar el hash real)

INSERT INTO criterios (nombre, descripcion, tipo) VALUES
  ('Precio unitario', 'Precio promedio por unidad de material (S/.)', 'costo'),
  ('Calidad certificada', 'Nivel de calidad segun normas tecnicas peruanas (NTP), escala 1-10', 'beneficio'),
  ('Plazo de entrega', 'Dias habiles promedio de entrega', 'costo'),
  ('Garantia', 'Meses de garantia ofrecidos', 'beneficio'),
  ('Reputacion / historial', 'Puntaje de confiabilidad segun historial de compras previas, escala 1-10', 'beneficio');

INSERT INTO proveedores (razon_social, ruc, rubro, telefono, direccion) VALUES
  ('Ferreteria San Cristobal E.I.R.L.', '20601234561', 'Materiales de construccion', '066512345', 'Jr. Lima 245, Huamanga'),
  ('Corporacion Constructora Wari S.A.C.', '20601234562', 'Materiales de construccion', '066523456', 'Av. Independencia 780, Huamanga'),
  ('Distribuidora Huamanga Cementos S.R.L.', '20601234563', 'Cemento y agregados', '066534567', 'Jr. Cuzco 112, Huamanga'),
  ('Aceros y Fierros del Sur E.I.R.L.', '20601234564', 'Acero de construccion', '066545678', 'Prol. Cusco 560, Huamanga');
