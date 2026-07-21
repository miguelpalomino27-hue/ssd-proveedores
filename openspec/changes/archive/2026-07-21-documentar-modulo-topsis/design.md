# Diseño: Documentación del módulo TOPSIS

## Alcance
La documentación cubrirá:
- el propósito del módulo TOPSIS dentro del sistema SSD;
- la formulación matemática aplicada por el servicio actual;
- las entradas esperadas: matriz de decisión, pesos, tipos de criterio y nombres de alternativas;
- las salidas generadas: distancias, coeficiente de cercanía y ranking;
- las reglas de validación actuales del servicio;
- la integración con el endpoint de evaluación y con las pruebas unitarias.

## Estructura propuesta del documento
1. Introducción al método TOPSIS.
2. Contexto del proyecto y rol dentro del flujo AHP + TOPSIS.
3. Descripción de la implementación actual en backend.
4. Formato de entrada y salida.
5. Explicación paso a paso del algoritmo.
6. Reglas y errores esperados.
7. Ejemplo de ejecución con datos simples.
8. Referencias a pruebas y archivos clave.

## Archivos y componentes involucrados
- Backend service: [backend/src/services/topsis.js](backend/src/services/topsis.js)
- Backend controller: [backend/src/controllers/evaluacionController.js](backend/src/controllers/evaluacionController.js)
- Pruebas unitarias: [backend/tests/unit/topsis.test.js](backend/tests/unit/topsis.test.js)
- Documentación general: [README.md](README.md)

## Decisiones de diseño
- La documentación se escribirá en español para mantener coherencia con el proyecto actual.
- Se priorizará la explicación del comportamiento real del código en vez de una descripción teórica abstracta.
- El documento se ubicará en la carpeta de docs del proyecto, con un enlace desde el README.
- No se modificarán los algoritmos ni la firma de funciones; la documentación solo describe el estado actual.
