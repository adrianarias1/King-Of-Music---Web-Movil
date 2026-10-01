import type { ReactNode } from 'react'
import './SectionHeading.css'

interface Props {
  /** Numero de seccion, p. ej. "03". Opcional. */
  index?: string
  /** Etiqueta corta sobre el titulo, p. ej. "Roster". */
  eyebrow?: string
  title: string
  lead?: string
  children?: ReactNode
  split?: boolean
}

export function SectionHeading({ index, eyebrow, title, lead, children, split }: Props) {
  return (
    <header className={`section-head${split ? ' section-head--split' : ''}`}>
      <div className="section-head__text">
        {(index || eyebrow) && (
          <p className="section-head__index label">
            {index ? <span>{index}</span> : null}
            {index && eyebrow ? <span aria-hidden="true">/</span> : null}
            {eyebrow ? <span>{eyebrow}</span> : null}
          </p>
        )}
        <h2 className="title">{title}</h2>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
      {children ? <div className="section-head__aside">{children}</div> : null}
    </header>
  )
}