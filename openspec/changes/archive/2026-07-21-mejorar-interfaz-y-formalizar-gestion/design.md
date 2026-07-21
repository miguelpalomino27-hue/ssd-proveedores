# Diseño: Formalización de auth/proveedores y mejora simple de interfaz

## Alcance
- No se cambia la lógica de negocio del backend: el comportamiento actual
  de `authController.js` y `proveedorController.js` ya cumple los
  requisitos que se están documentando.
- La mejora de interfaz se limita a CSS puro y ajustes menores de JSX; no
  se introduce ninguna librería de componentes ni framework de estilos.

## Decisiones de diseño
- Paleta de colores mediante variables CSS (`:root`) para mantener
  consistencia sin agregar un sistema de diseño complejo.
- Los estados de carga y vacío se resuelven con condicionales simples en
  React (`useState`), igual al patrón que ya usa el proyecto.
- Breakpoint único (pantallas angostas) para que el formulario de
  proveedores no se rompa en móvil, sin rediseñar el layout completo.

## Archivos involucrados
- [frontend/src/styles.css](../../../frontend/src/styles.css)
- [frontend/src/pages/Proveedores.jsx](../../../frontend/src/pages/Proveedores.jsx)
- [backend/src/controllers/authController.js](../../../backend/src/controllers/authController.js) (solo referencia, sin cambios)
- [backend/src/controllers/proveedorController.js](../../../backend/src/controllers/proveedorController.js) (solo referencia, sin cambios)
