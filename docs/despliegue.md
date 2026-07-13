# Guía de despliegue en producción

Este documento describe dos rutas de despliegue reales y verificables para
el sistema SSD Proveedores.

## Opción 1 — VPS propio con Docker Compose

Requisitos: un servidor Linux (Ubuntu 22.04+) con Docker y Docker Compose
instalados, y un dominio apuntando a la IP del servidor (opcional).

1. Clonar el repositorio en el servidor:
   ```bash
   git clone https://github.com/miguelpalomino27-hue/ssd-proveedores.git
   cd ssd-proveedores
   ```
2. Crear un archivo `.env` en la raíz con las variables sensibles:
   ```bash
   DB_PASSWORD=una_clave_fuerte_aqui
   MYSQL_ROOT_PASSWORD=otra_clave_fuerte
   JWT_SECRET=clave_larga_y_aleatoria_para_produccion
   ```
3. Levantar los servicios:
   ```bash
   docker compose up -d --build
   ```
4. (Opcional) Configurar un reverse proxy con HTTPS usando **Caddy** o
   **Nginx + Certbot** delante del puerto 8080 (frontend) y 4000 (API).
5. Verificar:
   ```bash
   curl http://localhost:4000/api/health
   ```

## Opción 2 — Servicios gestionados (sin administrar servidores)

- **Base de datos**: MySQL administrado en Railway, Render o PlanetScale.
  Ejecutar `database/schema.sql` y `database/seed.sql` contra la instancia
  provista.
- **Backend**: desplegar la carpeta `backend/` en Railway o Render como
  servicio Node.js. Variables de entorno: `DB_HOST`, `DB_PORT`, `DB_USER`,
  `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`.
- **Frontend**: desplegar `frontend/` en Vercel o Netlify. Configurar la
  variable de build para que las peticiones a `/api` apunten a la URL
  pública del backend (ajustar `vite.config.js` o usar una variable
  `VITE_API_URL` y actualizar `src/services/api.js` en consecuencia).

## Integración continua

El pipeline en `.github/workflows/ci.yml` ejecuta automáticamente, en cada
`push` o `pull request`:

1. Levanta una instancia efímera de MySQL 8.0 como *service container*.
2. Carga el esquema y los datos semilla.
3. Corre las 32 pruebas (16 unitarias + 16 de integración) contra esa base
   de datos real.
4. Compila el build de producción del frontend.
5. Publica el reporte de cobertura como artefacto descargable.

Un despliegue solo debe promoverse a producción si este pipeline pasa en
verde, cumpliendo con el aseguramiento de calidad exigido en el ciclo de
vida del proyecto.
