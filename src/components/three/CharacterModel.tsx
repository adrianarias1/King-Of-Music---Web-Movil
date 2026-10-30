import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import {
  Box3,
  Vector3,
  type BufferGeometry,
  type Group as ThreeGroup,
  type Material,
  type Mesh,
  type Texture,
} from 'three'
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
    const geometries = new Set<BufferGeometry>()
    const materials = new Set<Material>()
    const textures = new Set<Texture>()

    root.traverse((child) => {
      const mesh = child as Mesh
      if (!mesh.isMesh) return

      mesh.castShadow = true
      mesh.receiveShadow = true
      geometries.add(mesh.geometry)

      const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      meshMaterials.forEach((material) => {
        materials.add(material)
        Object.values(material).forEach((value) => {
          if (value && typeof value === 'object' && 'isTexture' in value && value.isTexture) {
            textures.add(value as Texture)
          }
        })
      })
    })

    onLoadedRef.current?.()

    return () => {
      textures.forEach((texture) => texture.dispose())
      materials.forEach((material) => material.dispose())
      geometries.forEach((geometry) => geometry.dispose())
      useGLTF.clear(assetUrl(url))
    }
  }, [model, url])

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
