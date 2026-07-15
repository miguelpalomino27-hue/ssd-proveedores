# Propuesta: Documentar el módulo TOPSIS

## Resumen
Documentar el módulo TOPSIS del backend para que el equipo pueda comprender cómo se calcula el ranking de proveedores, qué entradas requiere, qué validaciones aplica y cómo se integra con el flujo de evaluación AHP + TOPSIS.

## Problema
El módulo TOPSIS ya está implementado en el servicio de backend, pero su lógica está descrita principalmente en comentarios inline y no existe una guía técnica accesible que explique el algoritmo, los formatos de entrada/salida, las reglas de validación y la relación con el endpoint de evaluaciones.

## Objetivo
- Documentar el algoritmo TOPSIS aplicado en este proyecto.
- Explicar la integración con el controlador de evaluaciones y las pruebas unitarias.
- Proporcionar ejemplos claros de uso y criterios para interpretar los resultados.

## No incluye
- Cambios en la lógica matemática del algoritmo.
- Cambios en la API o en el esquema de datos.
- Nuevas funcionalidades de negocio o nuevas métricas.

## Criterios de aceptación
- Existe un documento técnico en la carpeta de documentación del proyecto.
- El README enlaza la documentación del módulo TOPSIS.
- La documentación refleja el comportamiento actual del servicio y de las pruebas.
