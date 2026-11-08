import { Clock, Download, Monitor, Smartphone } from 'lucide-react'
import { comingSoonLabel, downloads, siteConfig } from '../../config'
import type { DownloadTarget } from '../../config'
import { isNativeApp } from '../../lib/native'
import { Reveal } from '../ui/Reveal'
import { useI18n } from '../../i18n'
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

        <ul className={`download__cards${targets.length === 1 ? ' is-single' : ''}`}>
          {targets.map((target) => (
            <li key={target.id}>
              <DownloadCard target={target} />
            </li>
          ))}
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
          download={external ? undefined : ''}
          target={external ? '_blank' : undefined}
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
