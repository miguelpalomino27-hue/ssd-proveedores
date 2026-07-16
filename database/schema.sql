-- ============================================================
-- Sistema de Soporte de Decisiones (SSD) - Seleccion de proveedores
-- Metodo: AHP (ponderacion de criterios) + TOPSIS (ranking)
-- Motor: MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS ssd_proveedores
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE railway;

-- ------------------------------------------------------------
-- Tabla: usuarios (analistas que usan el SSD)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  correo        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('administrador', 'analista') NOT NULL DEFAULT 'analista',
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: proveedores (alternativas a evaluar)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proveedores (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  razon_social  VARCHAR(150) NOT NULL,
  ruc           CHAR(11) NOT NULL UNIQUE,
  rubro         VARCHAR(100),
  telefono      VARCHAR(20),
  direccion     VARCHAR(200),
  activo        TINYINT(1) NOT NULL DEFAULT 1,  -- borrado logico
  creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: criterios (catalogo reutilizable de criterios de decision)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS criterios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  tipo        ENUM('beneficio', 'costo') NOT NULL,
  creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabla: evaluaciones (cada corrida del SSD: AHP + TOPSIS)
-- Se guarda la matriz de entrada y el resultado como JSON para
-- trazabilidad y auditoria de las decisiones tomadas.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS evaluaciones (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id            INT NULL,
  titulo                VARCHAR(150) NOT NULL,
  criterios_json        JSON NOT NULL,
  matriz_ahp_json       JSON NOT NULL,
  matriz_decision_json  JSON NOT NULL,
  pesos_json            JSON NOT NULL,
  consistencia_json     JSON NOT NULL,
  resultado_json        JSON NOT NULL,
  creado_en             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_evaluacion_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Indices de apoyo a busquedas frecuentes
CREATE INDEX idx_proveedores_activo ON proveedores(activo);
CREATE INDEX idx_evaluaciones_usuario ON evaluaciones(usuario_id);
