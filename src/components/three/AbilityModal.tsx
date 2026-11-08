import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Clapperboard, Keyboard } from 'lucide-react'
import type { AbilityMedia, L } from '../../types'
import { useI18n } from '../../i18n'
import { Modal } from '../ui/Modal'
import { SmartImage } from '../ui/SmartImage'
import './AbilityModal.css'

/** Habilidad especial o combo que se muestra en el modal. */
export interface MoveDetail {
  kind: 'ability' | 'combo'
  id: string
  name: L
  /** Sin descripción en un combo: se usa t.viewer.comboDescription. */
  description?: L
  /** Teclas, p. ej. "U" o "G + G + J + H". */
  keys?: string
  media?: AbilityMedia
  preview?: string
}

interface Props {
  move: MoveDetail | null
  characterName: string
  onClose: () => void
}

/**
 * Detalle de una habilidad o un combo, con su video en bucle.
 * El video se descarga solo al abrir el modal.
 */
export function AbilityModal({ move, characterName, onClose }: Props) {
  const { t, l } = useI18n()
  const copy = t.viewer
  const name = move ? l(move.name) : ''
  const description = move?.description
    ? l(move.description)
    : move?.kind === 'combo'
      ? copy.comboDescription(characterName)
      : undefined
  return (
    <Modal
      open={move !== null}
      onClose={onClose}
      title={name}
      description={move ? `${characterName} — ${move.kind === 'ability' ? copy.ability : copy.combo}` : undefined}
      labelId="ability-modal-title"
      className="modal--ability"
    >
      {move ? (
        <div className="ability-modal">
          {move.media?.type === 'video' ? (
            <MoveVideo key={move.media.src} src={move.media.src} poster={move.media.poster} label={name} />
          ) : (
            <SmartImage
              src={move.preview}
              alt={copy.previewOf(name)}
              placeholderLabel={copy.preview}
              ratio="16 / 9"
            />
          )}

          <div className="ability-modal__info">
            {description ? <p className="ability-modal__desc">{description}</p> : null}

            {move.keys ? (
              <p className="ability-modal__combo">
                <span className="label">{move.kind === 'ability' ? copy.activation : copy.keys}</span>
                <span className="ability-modal__keys">
                  {move.keys.split('+').map((key) => key.trim()).map((key, index) => (
                    <kbd key={`${key}-${index}`}>{key}</kbd>
                  ))}
                  {move.kind === 'ability' && move.keys.trim() === 'U' ? (
                    <span className="ability-modal__hint">{copy.pressKey('U')}</span>
                  ) : null}
                </span>
              </p>
            ) : (
              <p className="notice ability-modal__nocombo">
                <Keyboard size={14} strokeWidth={1.5} aria-hidden="true" />
                {copy.keysPending}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

/**
 * Video en bucle, sin sonido, como un GIF de alta calidad.
 * Con "reducir movimiento" no se reproduce solo: se muestran los controles.
 */
function MoveVideo({ src, poster, label }: { src: string; poster?: string | undefined; label: string }) {
  const reduced = useReducedMotion()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const { t } = useI18n()

  return (
    <div className={`ability-modal__video is-${status}`}>
      {status !== 'error' ? (
        <video
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay={!reduced}
          controls={Boolean(reduced)}
          preload="auto"
          disablePictureInPicture
          aria-label={t.viewer.videoOf(label)}
          onLoadedData={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      ) : null}

      {status === 'loading' ? (
        <span className="ability-modal__video-state" role="status">
          <span className="spinner" aria-hidden="true" />
          {t.viewer.videoLoading}
        </span>
      ) : null}

      {status === 'error' ? (
        <span className="ability-modal__video-state" role="status">
          <Clapperboard size={22} strokeWidth={1.5} aria-hidden="true" />
          {t.viewer.videoUnavailable}
        </span>
      ) : null}
    </div>
  )
}
