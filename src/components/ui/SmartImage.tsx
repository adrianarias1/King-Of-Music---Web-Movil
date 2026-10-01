import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { assetExists } from '../../utils/assets'
import './SmartImage.css'

interface Props {
  /** Ruta del recurso. Si no existe, se muestra el placeholder. */
  src?: string | undefined
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  /** Proporciona el ratio y evita layout shift. */
  ratio?: string
  /** Etiqueta corta que se ve sobre el placeholder. */
  placeholderLabel?: string
  /** Numero de identificacion estetico, p. ej. "01". */
  index?: string
}

type Status = 'checking' | 'ready' | 'missing'

/**
 * Imagen con placeholder propio.
 *
 * Antes de renderizar el <img> verifica que el archivo exista, de modo que un
 * asset pendiente no genera una peticion fallida en consola. Si el archivo
 * aparece mas tarde, basta con recargar: la comprobacion se cachea por ruta.
 */
export function SmartImage(props: Props) {
  // Al cambiar de src se reinicia el estado: se remonta el bloque interno.
  return <ImageBlock key={props.src ?? 'empty'} {...props} />
}

function ImageBlock({
  src,
  alt,
  className,
  loading = 'lazy',
  ratio,
  placeholderLabel,
  index,
}: Props) {
  const [status, setStatus] = useState<Status>(src ? 'checking' : 'missing')

  // No se comprueba nada hasta que la imagen se acerca al viewport.
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '400px' })

  useEffect(() => {
    if (!src || !inView) return undefined
    let alive = true

    assetExists(src).then((exists) => {
      if (alive) setStatus(exists ? 'ready' : 'missing')
    })

    return () => {
      alive = false
    }
  }, [src, inView])

  const showPlaceholder = status !== 'ready'

  return (
    <div
      ref={ref}
      className={`smart-img${showPlaceholder ? ' is-placeholder' : ''}${className ? ` ${className}` : ''}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {src && status === 'ready' ? (
        <img
          className="smart-img__el"
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={() => setStatus('missing')}
        />
      ) : null}

      {showPlaceholder ? (
        <div className="smart-img__ph" role="img" aria-label={`${alt} — sin imagen definitiva`}>
          <span className="smart-img__grid" aria-hidden="true" />
          {index ? <span className="smart-img__index label">{index}</span> : null}
          {placeholderLabel ? (
            <span className="smart-img__label label">{placeholderLabel}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}