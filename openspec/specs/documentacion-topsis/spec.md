# documentacion-topsis Specification

## Purpose
Asegurar que el algoritmo TOPSIS del backend cuente con documentación técnica
accesible para el equipo: su formulación, entradas/salidas, reglas de
validación y su integración con el flujo de evaluación AHP + TOPSIS.

## Requirements
### Requirement: Documentación técnica del módulo TOPSIS
El sistema DEBE (MUST) contar con documentación técnica que explique el algoritmo
TOPSIS implementado en el backend: su propósito, las entradas y salidas del
servicio, las reglas de validación aplicadas y su integración con el
controlador de evaluaciones (AHP + TOPSIS).

#### Scenario: Consulta de la documentación del módulo TOPSIS
- **WHEN** un integrante del equipo abre `docs/modulo-topsis.md`
- **THEN** encuentra la formulación del algoritmo, el formato de
  entrada/salida, las reglas de validación y la relación con
  `backend/src/controllers/evaluacionController.js`

#### Scenario: Acceso a la documentación desde el README
- **WHEN** un integrante del equipo revisa el README del proyecto
- **THEN** encuentra un enlace directo a `docs/modulo-topsis.md`

#### Scenario: Coherencia con las pruebas unitarias
- **WHEN** un integrante del equipo compara la documentación con
  `backend/tests/unit/topsis.test.js`
- **THEN** los casos descritos en la documentación (validación de pesos,
  validación de alternativas, criterios de costo, rango del coeficiente de
  cercanía, ranking único) coinciden con lo que las pruebas verifican

