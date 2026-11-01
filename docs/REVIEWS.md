# Reseñas

Las reseñas no forman parte del recorrido principal de la landing. Se abren desde
un botón flotante dorado, fijo abajo a la derecha (`ReviewsDock`, montado en
`App.tsx`). El botón aparece tras un pequeño scroll y se oculta mientras hay un
menú o modal abierto (`body.is-locked`).

El panel tiene dos selectores: **Categoría** (Personajes / Mapa y escenarios) y
el elemento a evaluar. Debajo hay dos áreas: **Escribir reseña** y **Comunidad**.
En escritorio se muestran lado a lado en un panel lateral; en móvil es una hoja
inferior con pestañas y, al publicar, se cambia a la pestaña Comunidad.

Los destinos no cambiaron: personajes usan `personajes/<id>`, «Mapa general»
conserva `mapa/general` y cada ubicación usa `escenarios/<id>`, por lo que las
reseñas locales anteriores siguen disponibles. No hay sección de reseñas de Nosotros.

## Estado actual

Sin Supabase, autenticación ni solicitudes de red. `localReviewRepository`
guarda en `localStorage` bajo `king-of-music:reviews:v1`. Las reseñas sobreviven
a una recarga, pero solo existen en ese navegador / instalación de la app.
Borrar los datos del navegador o desinstalar la app puede eliminarlas.
El nombre es libre, no una identidad verificada. No se incluyen reseñas ficticias.

## Conexión futura

`ReviewRepository` define operaciones asíncronas `list(target)` y `create(input)`.
El componente `Reviews` acepta un repositorio por propiedad; sustituir el adaptador
local permite conservar los formularios y las vistas. Mantener `section` y
`subjectId` como identificadores estables del destino.

Al conectar Supabase, resolver el usuario desde una sesión real de Google;
asociar la autoría a su ID, ignorando la identidad libre del prototipo.
Implementar permisos/RLS y validación del lado del servidor antes de permitir
escrituras. Decidir entonces las políticas de moderación, duplicados y paginación.
No migrar automáticamente las reseñas locales como si fueran identidades verificadas.

## Comprobación

`npm run build`

`node --test src/features/reviews/repository.test.mjs`

Prueba manual: elegir un personaje o escenario, guardar nombre, estrellas y
comentario; recargar y comprobar persistencia; cambiar de destino y comprobar
que las reseñas se mantienen separadas. Revisar teclado, móvil y almacenamiento
bloqueado (se muestra error sin perder el texto).
