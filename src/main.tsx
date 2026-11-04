/// <reference types="vite-plugin-pwa/client" />

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { AuthProvider } from './features/auth/AuthProvider'
import { installExternalLinkHandler } from './lib/native'
import { prefetchCharacterModels } from './lib/modelCache'
import { characters } from './data/characters'
import './styles/index.css'

document.documentElement.classList.toggle('android-app', Capacitor.getPlatform() === 'android')

if (import.meta.env.PROD && !Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  registerSW({ immediate: true })
}

// App Android: los enlaces externos se abren en el navegador del sistema.
installExternalLinkHandler()

// PWA: guarda los modelos 3D en caché en segundo plano para que el visor
// cambie de personaje al instante y funcione sin internet.
prefetchCharacterModels(characters.flatMap((character) => (character.model ? [character.model] : [])))

const container = document.getElementById('root')

if (!container) {
  throw new Error('No se encontro el elemento #root en index.html')
}

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
