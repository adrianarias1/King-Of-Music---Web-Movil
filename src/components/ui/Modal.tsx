import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { useDialog } from '../../hooks/useDialog'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import './Modal.css'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  labelId?: string
}

/**
 * Dialogo modal accesible:
 * - role="dialog" + aria-modal
 * - Escape cierra, clic en overlay cierra
 * - foco atrapado y restaurado
 * - scroll del body bloqueado
 */
export function Modal({ open, onClose, title, description, children, labelId }: Props) {
  const reduced = useReducedMotion()
  const { panelRef, handleOverlayClick } = useDialog(open, onClose)
  const close = useCallback(() => onClose(), [onClose])

  useBodyScrollLock(open)

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
        >
          <motion.div
            ref={panelRef}
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId ?? 'modal-title'}
            aria-describedby={description ? (labelId ? `${labelId}-desc` : 'modal-desc') : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : 0.99 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="modal__head">
              <div>
                <h3 className="subtitle" id={labelId ?? 'modal-title'}>
                  {title}
                </h3>
                {description ? (
                  <p className="modal__desc" id={labelId ? `${labelId}-desc` : 'modal-desc'}>
                    {description}
                  </p>
                ) : null}
              </div>
              <button type="button" className="modal__close" onClick={close} aria-label="Cerrar">
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <div className="modal__body">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}