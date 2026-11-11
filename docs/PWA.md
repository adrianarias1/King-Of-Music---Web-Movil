# King of Music como aplicación web progresiva (PWA)

Guía para revisar y demostrar la **sección 3, "Implementación de la PWA"**, de la lista de cotejo.

> **Importante:** el service worker solo se registra en la versión compilada.
> Para la demostración usa el sitio publicado
> (https://king-of-music.tic-310123.workers.dev) o compila y sírvelo en local:
>
> ```bash
> npm run build
> npm run preview
> ```
>
> Después abre http://localhost:4173. En `npm run dev` no hay service worker,
> a propósito: así no se guarda en caché código de desarrollo.

## Archivos de la PWA

| Archivo | Para qué sirve |
|---|---|
| `public/manifest.webmanifest` | Manifiesto: nombre, nombre corto, `start_url`, `display`, colores, orientación, íconos, capturas y accesos directos |
| `index.html` | Enlaza el manifiesto (`<link rel="manifest">`) y el ícono de iPhone |
| `public/icons/` | Íconos PNG 192×192 y 512×512 (normales y *maskable*) y `apple-touch-icon.png` |
| `src/sw.js` | Service worker propio y comentado. Al compilar se convierte en `dist/sw.js` |
| `src/pwa/registerServiceWorker.ts` | Registra `./sw.js` |
| `public/offline.html` | Página que se muestra si no hay conexión y la app aún no está guardada |
| `src/pwa/ConnectionStatus.tsx` | Aviso "Sin conexión" / "Conexión restablecida" dentro de la app |
| `src/pwa/install.ts` y la tarjeta "App web" en `#descargar` | Botón **Instalar app** |
| `public/screenshots/` | Capturas que muestra el diálogo de instalación de Chrome |

## Lista de cotejo, punto por punto

| # | Indicador | Dónde está | Cómo se comprueba |
|---|---|---|---|
| 3.1 | `manifest.webmanifest` enlazado | `index.html`: `<link rel="manifest" href="./manifest.webmanifest">` | DevTools → **Application → Manifest** muestra los datos sin errores |
| 3.2 | Nombre y nombre corto | `"name": "King of Music"`, `"short_name": "KOM"` | Application → Manifest → *Name* / *Short name* |
| 3.3 | `start_url`, `display`, colores y orientación | `"start_url": "./?source=pwa"`, `"display": "standalone"`, `"theme_color"` y `"background_color": "#000000"`, `"orientation": "any"` (vertical y horizontal) | Application → Manifest |
| 3.4 | Íconos PNG 192 y 512 | `icons/king-of-music-192.png`, `icons/king-of-music-512.png` (más sus versiones *maskable*) | Application → Manifest → *Icons* |
| 3.5 | `sw.js` registrado | `src/pwa/registerServiceWorker.ts` → `navigator.serviceWorker.register('./sw.js')` | Consola: `[KOM] Service worker registrado` |
| 3.6 | Service worker activo | — | Application → **Service workers**: `sw.js` · *activated and is running* |
| 3.7 | Caché de la página principal y recursos | `src/sw.js`, evento **install**: precarga `index.html`, JS, CSS, íconos, manifiesto, `offline.html` e imágenes | Application → **Cache storage** → `kom-shell-…` (unos 69 archivos) |
| 3.8 | Elimina versiones anteriores | `src/sw.js`, evento **activate**: borra cachés `kom-shell-…`, `kom-models-…` y `workbox-precache…` que no sean las actuales | Al publicar una versión nueva, en Cache storage solo queda la caché nueva (la consola del service worker muestra `Borrando caché anterior`) |
| 3.9 | Página o mensaje sin conexión | Aviso "Sin conexión" (`ConnectionStatus`) y `offline.html` | DevTools → Network → **Offline**: aparece el aviso |
| 3.10 | Información consultable sin conexión | Todo el texto viene en el JS precargado; también se precargan la historia (15 páginas), los personajes, el mapa y los escenarios; los modelos 3D se guardan en `kom-models-…` | En modo **Offline**, recarga y recorre toda la página |
| 3.11 | El navegador permite instalar | Manifiesto + service worker + íconos; tarjeta **App web → Instalar app** | Ícono de instalar en la barra de direcciones de Chrome/Edge, o el botón **Instalar app** |
| 3.12 | Abre con nombre e ícono propios | `name`, `short_name`, íconos y `display: standalone` | Ya instalada, se abre en su propia ventana con el logo y el nombre King of Music |

## Demostración sugerida (5 minutos)

1. Abre el sitio en **Chrome** → `F12` → pestaña **Application**.
2. **Manifest:** muestra el nombre, el nombre corto, `start_url`, `display`, colores, orientación e íconos (3.1–3.4).
3. **Service workers:** `sw.js` aparece *activated and is running* (3.5, 3.6).
4. **Cache storage:** abre `kom-shell-…` y muestra `index.html`, JS, CSS e imágenes (3.7).
5. **Network → Offline** y recarga: el sitio carga, aparece el aviso **Sin conexión** y se puede recorrer la historia, los personajes, el mapa y el desarrollo (3.9, 3.10).
6. Vuelve a **Online**: aparece "Conexión restablecida".
7. Pulsa el ícono **Instalar** de la barra de direcciones, o **Descargar → App web → Instalar app**. La app abre en su propia ventana con su nombre e ícono (3.11, 3.12).
8. Para 3.8, abre `src/sw.js` y explica el evento `activate`: cada versión nueva borra las cachés anteriores.

## Qué necesita internet

Las **reseñas**, el **inicio de sesión con Google**, el **tráiler** y los **videos de habilidades y combos** (están en Cloudflare R2) necesitan conexión. Sin ella, el aviso lo explica y la app sigue funcionando.
