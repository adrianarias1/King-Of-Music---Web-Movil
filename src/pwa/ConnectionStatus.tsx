import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Wifi, WifiOff, X } from 'lucide-react'
import { useI18n } from '../i18n'
import { useOnline } from './install'
import './ConnectionStatus.css'

/**
 * Aviso de conexión (PWA, lista de cotejo 3.9):
 *  - Sin internet: aviso fijo "Sin conexión" que explica qué sigue
 *    disponible (la versión guardada) y qué necesita red.
 *  - Al volver: "Conexión restablecida" durante unos segundos.
 */
export function ConnectionStatus() {
  const online = useOnline()
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const [dismissed, setDismissed] = useState(false)
  const [backOnline, setBackOnline] = useState(false)

  useEffect(() => {
    let timer = 0
    const handleOffline = () => {
      window.clearTimeout(timer)
      setDismissed(false)
      setBackOnline(false)
    }
    const handleOnline = () => {
      setBackOnline(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setBackOnline(false), 3500)
    }
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const show = (!online && !dismissed) || backOnline
  const offline = !online

  return (
    <div className="connection" aria-live="polite">
      <AnimatePresence>
        {show ? (
          <motion.div
            key={offline ? 'offline' : 'online'}
            className={`connection__toast${offline ? ' is-offline' : ' is-online'}`}
            role="status"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          >
            {offline ? (
              <WifiOff className="connection__icon" size={20} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Wifi className="connection__icon" size={20} strokeWidth={1.8} aria-hidden="true" />
            )}
            <div className="connection__text">
              <strong>{offline ? t.pwa.offlineTitle : t.pwa.onlineTitle}</strong>
              {offline ? <span>{t.pwa.offlineText}</span> : null}
            </div>
            {offline ? (
              <button type="button" className="connection__close" onClick={() => setDismissed(true)} aria-label={t.common.close}>
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
