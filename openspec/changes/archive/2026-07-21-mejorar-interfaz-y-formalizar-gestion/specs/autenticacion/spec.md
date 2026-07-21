## ADDED Requirements

### Requirement: Inicio de sesión solo con correo y contraseña
El sistema MUST autenticar usuarios únicamente con `correo` y `password`.
No MUST solicitar ni aceptar ningún otro identificador (como nombre de
usuario) para iniciar sesión.

#### Scenario: Login con credenciales válidas
- **WHEN** un usuario registrado envía su correo y contraseña correctos
- **THEN** el sistema responde con un token de sesión y los datos básicos
  del usuario

#### Scenario: Login con contraseña incorrecta
- **WHEN** un usuario envía un correo registrado con una contraseña
  incorrecta
- **THEN** el sistema responde con un error de credenciales inválidas y no
  entrega ningún token

#### Scenario: Login sin correo o sin contraseña
- **WHEN** la solicitud de login no incluye correo o no incluye contraseña
- **THEN** el sistema rechaza la solicitud indicando que ambos campos son
  obligatorios

### Requirement: Registro de usuario con correo único
El sistema MUST exigir nombre, correo y contraseña para registrar un
usuario, y MUST rechazar el registro si el correo ya existe.

#### Scenario: Registro con correo ya existente
- **WHEN** se intenta registrar un usuario con un correo ya registrado
- **THEN** el sistema rechaza la solicitud indicando que el correo ya está
  registrado
