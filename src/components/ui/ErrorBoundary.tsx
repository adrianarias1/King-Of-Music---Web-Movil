import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Mensaje discreto de reemplazo. */
  label?: string
  /** Render alternativo cuando algo falla. */
  fallback?: ReactNode
}

interface State {
  failed: boolean
}

/**
 * Evita la pantalla blanca si un subarbol falla.
 * Ideal para el visor 3D (WebGL no disponible, contexto perdido, etc.).
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[KingOfMusic] Componente reemplazado por fallback:', error.message, info.componentStack)
  }

  override render() {
    if (!this.state.failed) return this.props.children
    if (this.props.fallback) return this.props.fallback
    return (
      <div className="boundary-fallback" role="status">
        <span className="label">{this.props.label ?? 'Contenido no disponible'}</span>
      </div>
    )
  }
}