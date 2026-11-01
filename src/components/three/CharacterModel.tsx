import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Box3, Vector3, type Group as ThreeGroup, type Mesh } from 'three'
import { assetUrl } from '../../utils/assets'
import { retainModel } from './gltfModelCache'

interface Props {
  /** Ruta del .glb / .gltf. */
  url: string
  scale?: number
  onLoaded?: () => void
}

/**
 * Carga un modelo GLB/GLTF.
 *
 * La escena GLTF queda en caché después del desmontaje y solo se libera cuando
 * el LRU la expulsa por límite de memoria.
 */
export function CharacterModel({ url, scale = 1, onLoaded }: Props) {
  const { scene } = useGLTF(assetUrl(url))
  // El callback puede cambiar durante un render del padre. Mantenerlo en un
  // ref evita que una actualización de UI ejecute el cleanup del modelo.
  const onLoadedRef = useRef(onLoaded)
  useEffect(() => {
    onLoadedRef.current = onLoaded
  }, [onLoaded])
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
    const root = model as ThreeGroup

    root.traverse((child) => {
      const mesh = child as Mesh
      if (!mesh.isMesh) return

      mesh.castShadow = true
      mesh.receiveShadow = true
    })

    const releaseModel = retainModel(url, scene)
    onLoadedRef.current?.()

    return releaseModel
  }, [model, scene, url])

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
