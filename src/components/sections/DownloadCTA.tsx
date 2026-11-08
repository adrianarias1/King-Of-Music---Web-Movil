import { Clock, Download } from 'lucide-react'
import { resolvedDownload, siteConfig } from '../../config'
import { Reveal } from '../ui/Reveal'
import { useI18n } from '../../i18n'
import './DownloadCTA.css'

/**
 * Cierre de la pagina.
 *
 * El CTA lee la configuracion de src/config.ts:
 *  - download.available === false -> boton deshabilitado + aviso "Proximamente"
 *  - download.available === true  -> enlace real al archivo
 *
 * Nunca apunta a un archivo inexistente.
 */
export function DownloadCTA() {
  const { available, url, platformLabel, sizeLabel, comingSoonLabel } = resolvedDownload
  const { t, l } = useI18n()

  return (
    <section id="descargar" className="section theme-dark download" aria-label={t.header.download}>
      <div className="download__bg" aria-hidden="true">
        <span className="download__glow" />
      </div>

      <Reveal className="download__inner container" distance={24}>
        <p className="download__kicker label">{siteConfig.name}</p>
        <h2 className="download__title display">{siteConfig.name}</h2>
        <p className="download__lead lead">{l(siteConfig.tagline)}</p>

        {available ? (
          <a
            className="btn btn--primary btn--lg download__btn"
            href={url}
            download
          >
            <span className="btn__label">
              <Download size={20} strokeWidth={1.5} aria-hidden="true" />
              {t.header.download}
            </span>
          </a>
        ) : (
          <>
            <button type="button" className="btn btn--primary btn--lg" disabled aria-disabled="true">
              <span className="btn__label">{t.header.download}</span>
            </button>
            <p className="download__soon notice">
              <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
              <span>
                {t.download.soon(l(comingSoonLabel), platformLabel)}
                {sizeLabel ? ` · ${sizeLabel}` : ''}
              </span>
            </p>
          </>
        )}
      </Reveal>
    </section>
  )
}