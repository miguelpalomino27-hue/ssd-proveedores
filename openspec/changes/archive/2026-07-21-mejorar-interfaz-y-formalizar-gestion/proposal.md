## Why
El backend y el frontend ya implementan el inicio de sesión (solo con correo
y contraseña) y la gestión completa de proveedores (crear, listar, editar,
eliminar/desactivar), pero ninguna de las dos capacidades tiene una spec
formal en OpenSpec — no hay una fuente de verdad documentada. Además, la
interfaz visual tiene clases usadas en el código (`navbar`, `auth-container`,
`auth-card`) que nunca se definieron en `styles.css`, por lo que se ve sin
estilo.

## What Changes
- Formalizar la capacidad de autenticación: login exclusivamente con correo
  y contraseña (sin usuario/username), registro con nombre+correo+password.
- Formalizar la capacidad de gestión de proveedores: alta, edición y baja
  (desactivación) de proveedores con validación de RUC.
- Mejorar la interfaz de forma simple: definir los estilos faltantes
  (navbar, tarjeta de login), estados de carga/vacío visibles, sin agregar
  ninguna librería de UI nueva.

## Capabilities

### New Capabilities
- `autenticacion`: registro e inicio de sesión de usuarios con correo y
  contraseña.
- `gestion-proveedores`: alta, edición y baja de proveedores.
- `interfaz-usuario`: retroalimentación visual mínima (carga, vacío, estilo
  consistente) en las pantallas de autenticación y proveedores.

### Modified Capabilities
(ninguna — es la primera vez que estas capacidades se documentan)

## Impact
- Código afectado: `frontend/src/styles.css`, `frontend/src/pages/Proveedores.jsx`
  (estado vacío).
- No se modifica la lógica de negocio del backend (auth y proveedores ya
  cumplen el comportamiento descrito).
- No se agregan dependencias nuevas.
