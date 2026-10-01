import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import type { Group as ThreeGroup } from 'three'
import { assetUrl } from '../../utils/assets'

interface Props {
  /** Ruta del .glb / .gltf. */
  url: string
  scale?: number
  onLoaded?: () => void
}

/**
 * Carga un modelo GLB/GLTF.
 *
 * Solo se monta cuando `assetExists()` confirma que el archivo existe,
 * por lo que nunca se generan errores 404.
 */
export function CharacterModel({ url, scale = 1, onLoaded }: Props) {
  const { scene } = useGLTF(assetUrl(url))

  useEffect(() => {
    if (!scene) return
    const root = scene as ThreeGroup
    root.traverse((child) => {
      const mesh = child as unknown as { castShadow?: boolean; receiveShadow?: boolean }
      if (typeof mesh.castShadow === 'boolean') mesh.castShadow = true
      if (typeof mesh.receiveShadow === 'boolean') mesh.receiveShadow = true
    })
    onLoaded?.()
  }, [scene, onLoaded])

  return <primitive object={scene} scale={scale} />
}