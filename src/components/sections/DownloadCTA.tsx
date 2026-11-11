import { CheckCircle2, Clock, Download, MonitorSmartphone, Monitor, Smartphone } from 'lucide-react'
import { comingSoonLabel, downloads, siteConfig } from '../../config'
import type { DownloadTarget } from '../../config'
import { isNativeApp } from '../../lib/native'
import { Reveal } from '../ui/Reveal'
import { useI18n } from '../../i18n'
import { usePwaInstall } from '../../pwa/install'
import '../ui/Button.css'
import './DownloadCTA.css'

/**
 * Cierre de la página: descarga del juego (Windows) y de la app (Android).
 *
 * Los enlaces se configuran en `downloads` (src/config.ts):
 *  - url vacío  -> botón desactivado + aviso "Próximamente"
 *  - url válido -> enlace real de descarga
 *
 * Nunca apunta a un archivo inexistente. Dentro de la app Android no se
 * ofrece descargar la propia app.
 */
export function DownloadCTA() {
  const { t, l } = useI18n()
  const targets = downloads.filter((target) => !(isNativeApp && target.id === 'app'))

  return (
    <section id="descargar" className="section theme-dark download" aria-label={t.header.download}>
      <div className="download__bg" aria-hidden="true">
        <span className="download__glow" />
      </div>

      <Reveal className="download__inner container" distance={24}>
        <p className="download__kicker label">{siteConfig.name}</p>
        <h2 className="download__title display">{siteConfig.name}</h2>
        <p className="download__lead lead">{l(siteConfig.tagline)}</p>

        <ul className={`download__cards is-${targets.length + (isNativeApp ? 0 : 1)}`}>
          {targets.map((target) => (
            <li key={target.id}>
              <DownloadCard target={target} />
            </li>
          ))}
          {/* App web (PWA): se instala desde el navegador */}
          {isNativeApp ? null : (
            <li>
              <InstallCard />
            </li>
          )}
        </ul>
      </Reveal>
    </section>
  )
}

function DownloadCard({ target }: { target: DownloadTarget }) {
  const { t, l } = useI18n()
  const Icon = target.id === 'game' ? Monitor : Smartphone
  const available = target.url.trim() !== ''
  const external = /^https?:\/\//i.test(target.url)
  const title = l(target.title)

  return (
    <article className={`download__card${available ? '' : ' is-soon'}`}>
      <Icon className="download__card-icon" size={28} strokeWidth={1.4} aria-hidden="true" />
      <h3 className="download__card-title">{title}</h3>
      <p className="download__card-desc">{l(target.description)}</p>
      <p className="download__card-details label">{l(target.details)}</p>

      {available ? (
        <a
          className="btn btn--primary btn--lg download__btn"
          href={target.url}
          // Archivo (.exe / .apk): se descarga sin salir de la página ni abrir
          // una pestaña vacía. En la app Android, native.ts lo abre en el
          // navegador del sistema.
          download=""
          rel={external ? 'noreferrer noopener' : undefined}
          aria-label={t.download.downloadOf(title)}
        >
          <span className="btn__label">
            <Download size={20} strokeWidth={1.5} aria-hidden="true" />
            {t.header.download}
          </span>
        </a>
      ) : (
        <>
          <button
            type="button"
            className="btn btn--primary btn--lg download__btn"
            disabled
            aria-disabled="true"
            aria-describedby={`download-soon-${target.id}`}
          >
            <span className="btn__label">{t.header.download}</span>
          </button>
          <p id={`download-soon-${target.id}`} className="download__soon notice">
            <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
            <span>{l(comingSoonLabel)}</span>
          </p>
        </>
      )}
    </article>
  )
}

/** Instalar la app web (PWA) en este dispositivo desde el navegador. */
function InstallCard() {
  const { t } = useI18n()
  const copy = t.pwa
  const { state, install } = usePwaInstall()

  return (
    <article className="download__card download__card--pwa">
      <MonitorSmartphone className="download__card-icon" size={28} strokeWidth={1.4} aria-hidden="true" />
      <h3 className="download__card-title">{copy.installTitle}</h3>
      <p className="download__card-desc">{copy.installDesc}</p>
      <p className="download__card-details label">{copy.installDetails}</p>

      {state === 'available' ? (
        <button type="button" className="btn btn--primary btn--lg download__btn" onClick={() => void install()}>
          <span className="btn__label">
            <Download size={20} strokeWidth={1.5} aria-hidden="true" />
            {copy.installButton}
          </span>
        </button>
      ) : state === 'installed' ? (
        <p className="download__soon notice download__installed">
          <CheckCircle2 size={16} strokeWidth={1.6} aria-hidden="true" />
          <span>{copy.installed}</span>
        </p>
      ) : (
        <p className="download__hint">{state === 'ios' ? copy.iosHint : copy.browserHint}</p>
      )}
    </article>
  )
}
