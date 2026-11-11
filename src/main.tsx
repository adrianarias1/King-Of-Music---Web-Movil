import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import App from './App'
import { AuthProvider } from './features/auth/AuthProvider'
import { I18nProvider } from './i18n'
import { installExternalLinkHandler } from './lib/native'
import { registerServiceWorker } from './pwa/registerServiceWorker'
import { listenForInstallPrompt } from './pwa/install'
import { prefetchCharacterModels } from './lib/modelCache'
import { characters } from './data/characters'
import './styles/index.css'

document.documentElement.classList.toggle('android-app', Capacitor.getPlatform() === 'android')

// PWA: service worker propio (src/sw.js → ./sw.js).
registerServiceWorker()
listenForInstallPrompt()

// App Android: los enlaces externos se abren en el navegador del sistema.
installExternalLinkHandler()

// PWA: guarda los modelos 3D en caché en segundo plano para que el visor
// cambie de personaje al instante y funcione sin internet.
prefetchCharacterModels(characters.flatMap((character) => (character.model ? [character.model] : [])))

const container = document.getElementById('root')

if (!container) {
  throw new Error('Element #root not found in index.html')
}

createRoot(container).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
)
