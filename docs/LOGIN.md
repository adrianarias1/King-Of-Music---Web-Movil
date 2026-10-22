# Interfaz de acceso

`Login` es una interfaz de acceso mediante Google, sin backend ni sesión simulada.
Escritorio (desde 1024 px): botón en el header. Móvil/tablet: opción «Iniciar
sesión» dentro del menú de navegación. El menú termina de cerrarse antes de abrir
el login, para no superponer diálogos ni sus bloqueos de scroll y foco.

El diálogo nativo `showModal()` coloca el panel en la capa superior e impide
interactuar con el resto del documento, incluso el header y otros overlays.
Se bloquea el scroll y se mantiene el foco entre los controles del diálogo.
Admite cierre con X, Escape y clic fuera. Al cerrar vuelve el foco al disparador.

La acción «Continuar con Google» muestra por ahora un aviso local. No solicita
contraseñas, no envía datos, no almacena tokens ni modifica las reseñas locales.

Para conectar Supabase posteriormente, sustituir la acción de envío del formulario
por una llamada a un servicio de autenticación Google. Añadir estados de espera y
error y resolver la sesión desde el proveedor real. La configuración de OAuth,
las redirecciones web/Android, los tokens y los permisos quedan fuera de este
cascarón. No debe interpretarse el aviso del prototipo como un inicio de sesión.
