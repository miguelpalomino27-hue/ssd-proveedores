# gestion-proveedores Specification

## Purpose
Definir el ciclo de vida de un proveedor en el sistema: alta con datos
válidos, edición y baja (desactivación) lógica.

## Requirements
### Requirement: Alta de proveedores con RUC válido
El sistema MUST exigir razón social y RUC de 11 dígitos para registrar un
proveedor, y MUST rechazar RUC con un formato distinto.

#### Scenario: Registro de proveedor con RUC inválido
- **WHEN** se intenta registrar un proveedor con un RUC que no tiene 11
  dígitos
- **THEN** el sistema rechaza la solicitud indicando que el RUC debe tener
  11 dígitos

#### Scenario: Registro de proveedor válido
- **WHEN** se registra un proveedor con razón social y RUC de 11 dígitos
- **THEN** el proveedor queda disponible en el listado de proveedores

### Requirement: Edición y baja de proveedores
El sistema MUST permitir editar los datos de un proveedor existente y MUST
permitir desactivarlo (baja lógica), sin eliminar su historial de
evaluaciones previas.

#### Scenario: Baja de un proveedor existente
- **WHEN** un usuario autenticado solicita desactivar un proveedor
  existente
- **THEN** el proveedor deja de aparecer como activo y el sistema confirma
  la operación

#### Scenario: Baja de un proveedor inexistente
- **WHEN** se solicita desactivar un proveedor que no existe
- **THEN** el sistema responde que el proveedor no fue encontrado

