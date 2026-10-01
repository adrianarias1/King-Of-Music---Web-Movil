import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { ACESFilmicToneMapping } from 'three'
import type { Character } from '../../types'
import { assetExists } from '../../utils/assets'
import { CharacterModel } from './CharacterModel'
import { PlaceholderFigure } from './PlaceholderFigure'
import './ViewerCanvas.css'

export type ModelState = 'placeholder' | 'loading' | 'loaded'

interface Props {
  character: Character
  /** Permite pausar el render cuando la seccion sale del viewport. */
  active: boolean
  /** Desactiva rotacion y camara automatica. */
  reduced?: boolean
  onModelStateChange?: (state: ModelState) => void
}

const DEFAULT_CAMERA: [number, number, number] = [0, 1.05, 3.2]

/**
 * Lienzo 3D del personaje.
 *
 * - Iluminacion propia (sin HDR externo: cero peticiones de red)
 * - OrbitControls con limites y zoom acotado
 * - frameloop="never" cuando la seccion no es visible
 * - dpr limitado para no castigar moviles
 */
export function ViewerCanvas({
  character,
  active,
  reduced = false,
  onModelStateChange,
}: Props) {
  const [modelAvailable, setModelAvailable] = useState<boolean | null>(null)

  const setModelState = useCallback(
    (state: ModelState) => onModelStateChange?.(state),
    [onModelStateChange],
  )

  // Comprueba el modelo antes de montarlo para no provocar 404.
  useEffect(() => {
    let alive = true
    setModelState('placeholder')

    assetExists(character.model).then((exists) => {
      if (!alive) return
      setModelAvailable(exists)
      setModelState(exists ? 'loading' : 'placeholder')
    })

    return () => {
      alive = false
    }
  }, [character.model, setModelState])

  const cameraPosition = character.cameraPosition ?? DEFAULT_CAMERA

  return (
    <div className="viewer-canvas">
      <Canvas
        // Pausa total cuando la seccion no esta en pantalla.
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: cameraPosition, fov: 38, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
        }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense
          fallback={
            <PlaceholderFigure accent={character.accent} animate={false} scale={character.scale} />
          }
        >
          {modelAvailable === true ? (
            <CharacterModel
              url={character.model}
              scale={character.scale}
              onLoaded={() => setModelState('loaded')}
            />
          ) : (
            <PlaceholderFigure
              accent={character.accent}
              animate={!reduced && active}
              scale={character.scale}
            />
          )}
        </Suspense>

        {/* Iluminacion de estudio: clave, relleno y contraluz */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[3.5, 6, 4]} intensity={1.5} castShadow={false} />
        <directionalLight position={[-4, 2.5, -3]} intensity={0.55} color="#002F61" />
        <pointLight position={[0, 1.6, 2.4]} intensity={12} distance={9} color="#ffffff" />

        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.55}
          scale={6}
          blur={2.6}
          far={2.2}
          resolution={512}
          frames={active ? undefined : 1}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[24, 24]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping={!reduced}
          dampingFactor={0.08}
          minDistance={1.6}
          maxDistance={6}
          minPolarAngle={Math.PI * 0.12}
          maxPolarAngle={Math.PI * 0.62}
          target={[0, 0.85, 0]}
          rotateSpeed={0.75}
          zoomSpeed={0.6}
        />
      </Canvas>
    </div>
  )
}