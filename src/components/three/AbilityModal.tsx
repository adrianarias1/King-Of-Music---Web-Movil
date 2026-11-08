import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Clapperboard, Keyboard } from 'lucide-react'
import type { AbilityMedia } from '../../types'
import { Modal } from '../ui/Modal'
import { SmartImage } from '../ui/SmartImage'
import './AbilityModal.css'

/** Habilidad especial o combo que se muestra en el modal. */
export interface MoveDetail {
  kind: 'Habilidad' | 'Combo'
  id: string
  name: string
  description?: string
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
  return (
    <Modal
      open={move !== null}
      onClose={onClose}
      title={move?.name ?? ''}
      description={move ? `${characterName} — ${move.kind}` : undefined}
      labelId="ability-modal-title"
      className="modal--ability"
    >
      {move ? (
        <div className="ability-modal">
          {move.media?.type === 'video' ? (
            <MoveVideo key={move.media.src} src={move.media.src} poster={move.media.poster} label={move.name} />
          ) : (
            <SmartImage
              src={move.preview}
              alt={`Vista previa de ${move.name}`}
              placeholderLabel="Preview"
              ratio="16 / 9"
            />
          )}

          <div className="ability-modal__info">
            {move.description ? <p className="ability-modal__desc">{move.description}</p> : null}

            {move.keys ? (
              <p className="ability-modal__combo">
                <span className="label">{move.kind === 'Habilidad' ? 'Activación' : 'Teclas'}</span>
                <span className="ability-modal__keys">
                  {move.keys.split('+').map((key) => key.trim()).map((key, index) => (
                    <kbd key={`${key}-${index}`}>{key}</kbd>
                  ))}
                  {move.kind === 'Habilidad' && move.keys.trim() === 'U' ? (
                    <span className="ability-modal__hint">Pulsar U</span>
                  ) : null}
                </span>
              </p>
            ) : (
              <p className="notice ability-modal__nocombo">
                <Keyboard size={14} strokeWidth={1.5} aria-hidden="true" />
                Teclas por definir
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
          aria-label={`Video de ${label}`}
          onLoadedData={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
      ) : null}

      {status === 'loading' ? (
        <span className="ability-modal__video-state" role="status">
          <span className="spinner" aria-hidden="true" />
          Cargando video…
        </span>
      ) : null}

      {status === 'error' ? (
        <span className="ability-modal__video-state" role="status">
          <Clapperboard size={22} strokeWidth={1.5} aria-hidden="true" />
          Video no disponible por ahora.
        </span>
      ) : null}
    </div>
  )
}
