# interfaz-usuario Specification

## Purpose
Definir la retroalimentación visual mínima que el sistema debe mostrar al
usuario, manteniendo la interfaz simple y sin librerías adicionales.

## Requirements
### Requirement: Retroalimentación visual mínima
El sistema MUST mostrar un estado de carga mientras obtiene datos del
servidor y MUST mostrar un mensaje claro cuando una lista no tiene
resultados, sin requerir ninguna librería de interfaz adicional.

#### Scenario: Lista de proveedores vacía
- **WHEN** un usuario abre la pantalla de proveedores y no hay proveedores
  registrados
- **THEN** el sistema muestra un mensaje indicando que no hay proveedores
  registrados, en vez de una tabla vacía sin explicación

#### Scenario: Carga de datos en curso
- **WHEN** el sistema está obteniendo la lista de proveedores desde el
  servidor
- **THEN** se muestra un indicador de "Cargando..." hasta que la
  respuesta llega

