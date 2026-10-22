# Reseñas

La interfaz se monta después del visor de Personajes y del Mapa. Mapa y escenarios
comparten un solo formulario con la opción «Mapa general» y las ubicaciones
existentes. Personajes permite elegir un personaje. Cada destino tiene sus propias
reseñas. No hay sección de reseñas de Nosotros.

«Mapa general» conserva el destino `mapa/general`, por lo que las reseñas locales
anteriores del mapa siguen disponibles. Las reseñas antiguas de Nosotros no se
muestran; no se borran los datos almacenados.

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
