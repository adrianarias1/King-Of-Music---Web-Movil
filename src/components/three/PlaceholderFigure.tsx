import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, type Mesh } from 'three'

interface Props {
  accent?: string
  /** Desactiva la rotacion automatica (prefers-reduced-motion). */
  animate?: boolean
  scale?: number
}

/**
 * Geometria abstracta usada como placeholder 3D.
 * Se renderiza con Three.js puro: no requiere ningun archivo externo,
 * por lo que la seccion funciona aunque los modelos .glb no existan.
 *
 * REEMPLAZO: cuando exista public/models/<id>.glb, el visor lo carga
 * automaticamente (ver CharacterViewer.tsx).
 */
export function PlaceholderFigure({ accent = '#002F61', animate = true, scale = 1 }: Props) {
  const group = useRef<Group | null>(null)
  const core = useRef<Mesh | null>(null)

  useFrame((state, delta) => {
    if (!animate) return
    const t = state.clock.elapsedTime

    if (group.current) {
      group.current.rotation.y += delta * 0.25
      group.current.position.y = Math.sin(t * 0.9) * 0.045
    }
    if (core.current) {
      core.current.rotation.y -= delta * 0.6
      core.current.rotation.x = Math.sin(t * 0.6) * 0.25
    }
  })

  return (
    <group ref={group} scale={scale} dispose={null}>
      {/* Silueta abstracta: base, cuerpo, hombros y nucleo energetico */}
      <mesh position={[0, 0.045, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.42, 0.52, 0.09, 48]} />
        <meshStandardMaterial color="#141414" roughness={0.85} metalness={0.15} />
      </mesh>

      <mesh position={[0, 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.26, 0.72, 8, 24]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.6} metalness={0.35} />
      </mesh>

      <mesh position={[0, 1.16, 0]} castShadow>
        <sphereGeometry args={[0.19, 32, 24]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.4} />
      </mesh>

      <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.07, 0.62, 6, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.55} metalness={0.5} />
      </mesh>

      {/* Nucleo: marca del proyecto en navy */}
      <mesh ref={core} position={[0, 0.66, 0.24]}>
        <icosahedronGeometry args={[0.11, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.6}
          roughness={0.25}
          metalness={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}