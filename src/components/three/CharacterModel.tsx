import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Box3, Vector3, type Group as ThreeGroup } from 'three'
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
  const model = useMemo(() => scene.clone(true), [scene])
  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(model)
    return {
      center: box.getCenter(new Vector3()),
      height: Math.max(box.getSize(new Vector3()).y, 0.001),
    }
  }, [model])
  const fittedScale = (2.25 / bounds.height) * scale

  useEffect(() => {
    if (!scene) return
    const root = model as ThreeGroup
    root.traverse((child) => {
      const mesh = child as unknown as { castShadow?: boolean; receiveShadow?: boolean }
      if (typeof mesh.castShadow === 'boolean') mesh.castShadow = true
      if (typeof mesh.receiveShadow === 'boolean') mesh.receiveShadow = true
    })
    onLoaded?.()
  }, [model, onLoaded])

  return (
    <group
      position={[
        -bounds.center.x * fittedScale,
        -bounds.center.y * fittedScale,
        -bounds.center.z * fittedScale,
      ]}
    >
      <primitive object={model} scale={fittedScale} />
    </group>
  )
}
