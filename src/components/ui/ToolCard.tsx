import { useAssetExists } from '../../hooks/useAssetExists'
import type { Tool } from '../../types'
import './ToolCard.css'

interface Props {
  tool: Tool
}

/**
 * Tarjeta de herramienta de desarrollo.
 * Muestra nombre, descripcion y version solo si se proporciona.
 * El logo solo se renderiza si el archivo existe: si no, iniciales.
 */
export function ToolCard({ tool }: Props) {
  const { ref, exists } = useAssetExists(tool.logo)

  return (
    <article className="tool-card">
      <div className="tool-card__logo" ref={ref} aria-hidden="true">
        {exists && tool.logo ? (
          <img src={tool.logo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="tool-card__logo-ph label">{tool.name.slice(0, 2)}</span>
        )}
      </div>

      <div className="tool-card__body">
        <h3 className="tool-card__name">
          {tool.name}
          {tool.version ? <span className="tool-card__version">{tool.version}</span> : null}
        </h3>
        <p className="tool-card__desc">{tool.description}</p>
      </div>
    </article>
  )
}