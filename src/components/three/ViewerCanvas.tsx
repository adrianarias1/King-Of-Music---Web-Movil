import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Group as ThreeGroup } from 'three'
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

const CAMERA_POSITION: [number, number, number] = [0, 0, 3.3]

/**
 * Lienzo 3D del personaje.
 *
 * - Iluminacion propia (sin HDR externo: cero peticiones de red)
 * - Modelos centrados y ajustados automaticamente al escenario
 * - Cámara y escenario fijos; el arrastre gira solo el modelo sobre su eje Y
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
  const [dragging, setDragging] = useState(false)
  const modelRef = useRef<ThreeGroup>(null)
  const dragRef = useRef<{ pointerId: number; lastX: number } | null>(null)

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

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, lastX: event.clientX }
    setDragging(true)
  }, [])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId || !modelRef.current) return
    const deltaX = event.clientX - drag.lastX
    modelRef.current.rotation.y += deltaX * 0.01
    drag.lastX = event.clientX
  }, [])

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  useEffect(() => {
    if (modelRef.current) modelRef.current.rotation.y = 0
    dragRef.current = null
    setDragging(false)
  }, [character.model])

  return (
    <div
      className={`viewer-canvas${dragging ? ' is-dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        // Pausa total cuando la seccion no esta en pantalla.
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: CAMERA_POSITION, fov: 40, near: 0.1, far: 60 }}
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
            <group ref={modelRef}>
              <CharacterModel
                url={character.model}
                scale={character.scale}
                onLoaded={() => setModelState('loaded')}
              />
            </group>
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
          position={[0, -1.1, 0]}
          opacity={0.55}
          scale={6}
          blur={2.6}
          far={2.2}
          resolution={512}
          frames={active ? undefined : 1}
        />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.14, 0]} receiveShadow>
          <planeGeometry args={[24, 24]} />
          <shadowMaterial transparent opacity={0.4} />
        </mesh>

      </Canvas>
    </div>
  )
}
