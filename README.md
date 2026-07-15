# SSD Proveedores — Sistema de Soporte de Decisiones para selección de proveedores

Sistema de Soporte de Decisiones (SSD) que aplica los métodos **AHP** (Analytic
Hierarchy Process, Saaty 1980) y **TOPSIS** (Hwang & Yoon, 1981) para apoyar
la selección de proveedores de materiales de construcción, desarrollado como
proyecto del curso IS-489 (Pruebas y Aseguramiento de la Calidad del
Software) — Universidad Nacional de San Cristóbal de Huamanga.

## Arquitectura

```
ssd-proveedores/
├── backend/          API REST (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── services/    ahp.js, topsis.js  → núcleo matemático del SSD
│   │   ├── models/      acceso a datos
│   │   ├── controllers/ lógica de negocio
│   │   ├── routes/      endpoints
│   │   └── middleware/  autenticación JWT
│   └── tests/
│       ├── unit/         pruebas del motor AHP/TOPSIS (Jest)
│       └── integration/  pruebas de la API contra MySQL real (Jest + Supertest)
├── frontend/          SPA (React + Vite)
├── database/          schema.sql, seed.sql
├── .github/workflows/ pipeline de integración continua (CI)
└── docker-compose.yml orquestación de los 3 servicios
```

## Stack tecnológico

| Capa       | Tecnología                              |
|------------|------------------------------------------|
| Frontend   | React 18, Vite, React Router, Recharts    |
| Backend    | Node.js 20, Express, JWT, bcrypt          |
| Base de datos | MySQL 8.0                              |
| Pruebas    | Jest (unitarias e integración), Supertest |
| Despliegue | Docker, Docker Compose, Nginx, GitHub Actions (CI) |

## Método de decisión implementado

1. **AHP**: el analista construye una matriz de comparación por pares entre
   criterios (precio, calidad, plazo de entrega, garantía, reputación). El
   sistema calcula los pesos por el método del vector propio aproximado y
   valida la **Razón de Consistencia (CR ≤ 0.10)** según Saaty.
2. **TOPSIS**: con los pesos obtenidos y la matriz de decisión (valores de
   cada proveedor por criterio), el sistema normaliza, pondera, calcula las
   distancias a las soluciones ideales positiva/negativa, y ordena a los
   proveedores por su coeficiente de cercanía relativa (CC*).
   Para una explicación detallada del algoritmo y su integración, consulte
   [docs/modulo-topsis.md](docs/modulo-topsis.md).

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- API backend: http://localhost:4000/api/health
- MySQL: localhost:3306

### Opción B: manual

```bash
# 1. Base de datos
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql

# 2. Backend
cd backend
cp .env.example .env   # editar credenciales
npm install
npm run dev             # http://localhost:4000

# 3. Frontend (otra terminal)
cd frontend
npm install
npm run dev              # http://localhost:5173
```

## Pruebas

```bash
cd backend
npm run test:unit          # 16 pruebas del motor AHP/TOPSIS
npm run test:integration   # 16 pruebas de la API contra MySQL real
npm test                   # las 32 pruebas
npm run test:coverage      # con reporte de cobertura
```

## Despliegue en producción

Ver [`docs/despliegue.md`](docs/despliegue.md) para instrucciones de
despliegue en un VPS (Docker Compose) o en servicios gestionados
(Railway/Render para backend + MySQL administrado, Vercel/Netlify para
frontend).

## Licencia y autoría

Proyecto académico — IS-489 Pruebas y Aseguramiento de la Calidad del
Software, docente Ing. Lizbeth Jaico Quispe, UNSCH, 2026.
