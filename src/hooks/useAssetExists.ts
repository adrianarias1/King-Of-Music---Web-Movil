import { useEffect, useState } from 'react'
import { useInView } from './useInView'
import { assetExists } from '../utils/assets'

interface Options {
  /** No se comprueba nada mientras el elemento este fuera de la zona indicada. */
  rootMargin?: string
  /**
   * Comprueba de inmediato, sin esperar al viewport.
   * Usar solo en elementos Above-the-fold (Hero), donde el contenedor
   * principal ya sirve de zona de observacion.
   */
  immediate?: boolean
}

type Checked = { path: string | undefined; exists: boolean | null }

/**
 * Comprueba si un asset existe antes de renderizarlo.
 * Evita imagenes rotas y peticiones fallidas cuando el archivo aun no esta.
 *
 * El resultado se deriva durante el render (no se guarda un estado
 * independiente), por lo que cambiar de `path` invalida el resultado
 * anterior sin necesidad de un efecto adicional.
 *
 * @returns estado de la comprobacion y ref para limitar el trabajo al viewport.
 */
export function useAssetExists(
  path: string | undefined,
  { rootMargin = '400px', immediate = false }: Options = {},
) {
  const [checked, setChecked] = useState<Checked>({ path: undefined, exists: null })
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin })
  const ready = immediate || inView

  useEffect(() => {
    if (!path || !ready) return undefined
    if (checked.path === path && checked.exists !== null) return undefined

    let alive = true

    assetExists(path).then((exists) => {
      if (alive) setChecked({ path, exists })
    })

    return () => {
      alive = false
    }
  }, [path, ready, checked])

  const exists = path ? (checked.path === path ? checked.exists === true : false) : false

  return { ref, status: exists ? ('ready' as const) : ('missing' as const), exists }
}