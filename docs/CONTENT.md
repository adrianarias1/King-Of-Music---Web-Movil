# CONTENT.md — Guia de assets

El repositorio parte sin assets definitivos. **No se descarga nada de internet.** Todos los placeholders estan generados con CSS, SVG o geometria Three.js, y cada punto de reemplazo esta marcado en el codigo con un comentario `ASSETS PENDIENTES`.

Las carpetas vienen creadas con `.gitkeep` para que sobrevivan a Git:

```text
public/images/{characters,locations,storyboard,dev,tools,team,abilities}
public/videos/  public/models/  public/fonts/  public/downloads/
```

## Resumen de rutas

| Asset | Ruta | Estado | Donde se usa |
|---|---|---|---|
| Favicon | `public/icons/favicon.svg` | Incluido | `index.html` |
| Fuente de marca | `public/fonts/Kings.woff2` | **Pendiente** | `src/fonts.css` |
| Fondo del Hero | `public/images/hero.jpg` | **Pendiente** | `src/config.ts` (`heroAsset`) |
| Video del Hero | `public/videos/hero.mp4` | **Pendiente** | `src/config.ts` (`heroVideoAsset`) |
| Trailer | `public/videos/trailer.mp4` | **Pendiente** | `src/config.ts` (`trailerAsset`) |
| Poster del trailer | `public/images/trailer-poster.jpg` | **Pendiente** | `src/config.ts` (`trailerPosterAsset`) |
| Storyboard | `public/images/storyboard/page-01..06.jpg` | **Pendiente** | `src/data/storyboard.ts` |
| Mapa | `public/images/map.png` | **Pendiente** | `src/config.ts` (`mapAsset`) |
| Modelos 3D | `public/models/<id>.glb` | **Pendiente** | `src/data/characters.ts` |
| Ilustraciones | `public/images/characters/<id>.jpg` | **Pendiente** | `src/data/characters.ts` |
| Preview habilidad | `public/images/abilities/<personaje>/<habilidad>.jpg` | **Pendiente** | `src/data/characters.ts` |
| Fotos de lugares | `public/images/locations/<id>.png` | **Pendiente** | `src/data/locations.ts` |
| Fotos del equipo | `public/images/team/<id>.jpg` | **Pendiente** | `src/data/team.ts` |
| Logos de herramientas | `public/images/tools/*.png` | **Pendiente** | `src/data/tools.ts` |
| Capturas de proceso | `public/images/dev/shot-01..04.jpg` | **Pendiente** | `src/data/tools.ts` |
| APK | `public/downloads/king-of-music.apk` | **Pendiente** | `src/config.ts` (`download`) |

## Hero
1. Colocar `public/images/hero.jpg` (recomendado 1920x1080 o mayor, JPG optimizado).
2. En `src/config.ts` cambiar `heroAsset` a `'/images/hero.jpg'`.
3. El componente detecta el asset y lo usa. Si no existe, permanece el gradiente CSS.

## Modelos 3D
1. Colocar el archivo en `public/models/<id>.glb`.
2. En `src/data/characters.ts`, asegurar que `model: '/models/<id>.glb'`.
3. El visor comprueba el archivo (HEAD) antes de cargarlo. Si existe, lo carga con `useGLTF`; si no, muestra `PlaceholderFigure`.
4. Ajustar `scale` y `cameraPosition` para encuadrar el modelo.

**Recomendaciones para el .glb:** menos de 20 MB, texturas comprimidas (KTX2 o JPEG), malla unificada cuando sea posible, origen en el centro del piso para no pelearse con el suelo.

## Trailer
1. Colocar `public/videos/trailer.mp4` (H.264 + AAC, 1080p).
2. Colocar el poster en `public/images/trailer-poster.jpg`.
3. Actualizar `trailerAsset` y `trailerPosterAsset` en `src/config.ts`.
4. El `<video>` no se monta hasta que el usuario pulsa Reproducir: no hay autoplay ni descarga al inicio.

## Storyboard
1. Colocar cada pagina en `public/images/storyboard/<id>.jpg` (recomendado 3:4 o 4:3 segun diseno).
2. Ajustar la lista `storyboardPages` en `src/data/storyboard.ts` (agregar, quitar o reordenar paginas).
3. Sin imagen, se dibuja un placeholder con el mismo pie de pagina.

## Mapa
1. Colocar la imagen del mapa en `public/images/map.png` (recomendado 4:3).
2. Actualizar `mapAsset` en `src/config.ts`.
3. En `src/data/locations.ts`, ajustar `x` y `y` (porcentajes 0-100) de cada `Location` hasta que el punto caiga sobre el lugar correcto.
4. Nota: Palacio de Bellas Artes, Palacio Nacional, Forostage Arena y Estacion del Norte son placeholders de prueba; renombrar cuando se definan los escenarios reales.

## Personajes
1. Editar `src/data/characters.ts` para anadir o ajustar personajes.
2. Colocar ilustraciones en `public/images/characters/<id>.jpg`.
3. Las habilidades viven en el mismo archivo, con `preview` opcional para imagenes.

## Equipo
1. Editar `src/data/team.ts` con nombre y rol reales.
2. Colocar fotos en `public/images/team/<id>.jpg`.
3. Los enlaces son opcionales; dejar `href` vacio desactiva el enlace de forma accesible.

## Fuente Kings
1. Colocar `Kings.woff2` en `public/fonts/`.
2. Descomentar el bloque `@font-face` en `src/fonts.css`.
3. El fallback (`Georgia, serif`) ya esta configurado, por lo que el diseño no se rompe si falta.

## Descarga / APK
1. Compilar y copiar el APK a `public/downloads/king-of-music.apk`.
2. En `src/config.ts`, poner `download.available = true` y ajustar `download.url`.
3. Para builds nativos, `window.KING_OF_MUSIC.downloadUrl` sobreescribe la ruta sin recompilar.

## Checklist antes de publicar
- [ ] Sin rutas hacia archivos inexistentes.
- [ ] Sin errores 404 en consola.
- [ ] Imagenes optimizadas y con `alt` descriptivo.
- [ ] `download.available` coherente con la existencia real del APK.
- [ ] Storyboard, mapa y personajes con assets definitivos.
- [ ] Consola limpia de warnings.