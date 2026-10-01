import { Zap } from 'lucide-react'
import type { Ability } from '../../types'
import { Modal } from '../ui/Modal'
import { SmartImage } from '../ui/SmartImage'
import './AbilityModal.css'

interface Props {
  ability: Ability | null
  characterName: string
  onClose: () => void
}

/**
 * Detalle de una habilidad.
 *
 * Hoy muestra texto + preview placeholder. La arquitectura ya acepta
 * `ability.media` (video o modelo) para ampliar el panel sin cambiar la API.
 */
export function AbilityModal({ ability, characterName, onClose }: Props) {
  return (
    <Modal
      open={ability !== null}
      onClose={onClose}
      title={ability?.name ?? ''}
      description={ability ? `${characterName} — Habilidad` : undefined}
      labelId="ability-modal-title"
    >
      {ability ? (
        <div className="ability-modal">
          {/*
            ASSETS PENDIENTES: public/images/abilities/<character>/<ability>.jpg
            Si ability.media esta definido, sustituir el placeholder por el
            video o modelo 3D (ver src/types/index.ts).
          */}
          <SmartImage
            src={ability.preview}
            alt={`Preview de la habilidad ${ability.name}`}
            placeholderLabel="Preview"
            ratio="16 / 9"
          />

          <p className="ability-modal__desc">{ability.description}</p>

          {ability.combo ? (
            <p className="ability-modal__combo">
              <span className="label">Combo</span>
              <span className="ability-modal__keys">
                {ability.combo.split('+').map((key) => key.trim()).map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
            </p>
          ) : (
            <p className="notice ability-modal__nocombo">
              <Zap size={14} strokeWidth={1.5} aria-hidden="true" />
              Combo por definir
            </p>
          )}
        </div>
      ) : null}
    </Modal>
  )
}