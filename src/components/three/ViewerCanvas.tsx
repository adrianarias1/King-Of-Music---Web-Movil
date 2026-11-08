import { Canvas, useFrame } from '@react-three/fiber'
import { RotateCcw } from 'lucide-react'
import { ContactShadows } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import type { MutableRefObject, PointerEvent as ReactPointerEvent } from 'react'
import type { Group as ThreeGroup } from 'three'
import { ACESFilmicToneMapping, Vector3 } from 'three'
import type { Character } from '../../types'
import { CharacterModel } from './CharacterModel'
import { useI18n } from '../../i18n'
import './ViewerCanvas.css'

export type ModelState = 'placeholder' | 'loading' | 'loaded'

interface Props {
  character: Character
  modelState: ModelState
  /** Permite pausar el render cuando la seccion sale del viewport. */
  active: boolean
  onModelStateChange?: (state: ModelState) => void
}

const CAMERA_POSITION: [number, number, number] = [0, 0, 3.3]

// =========================================================
// INTERACCIÓN LIBRE
//
// - Arrastre (ratón o un dedo): gira el modelo en cualquier
//   dirección. Se usa rotación sobre los ejes del mundo
//   (estilo trackball), así el giro siempre sigue al gesto
//   aunque el modelo ya esté inclinado.
// - Rueda del ratón o pellizco con dos dedos: zoom.
//   La cámara se acerca/aleja con suavizado.
// - Doble clic / doble toque o botón: restablece la vista.
//
// En la rueda, si el zoom ya está en su límite se deja pasar
// el evento para que la página siga desplazándose.
// =========================================================

const ROTATE_SPEED = 0.0085
const ZOOM_MIN = 1.6
const ZOOM_MAX = 6
const WORLD_X = new Vector3(1, 0, 0)
const WORLD_Y = new Vector3(0, 1, 0)

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))
}

/** Acerca la cámara de forma suave hacia la distancia objetivo. */
function CameraZoom({ targetRef }: { targetRef: MutableRefObject<number> }) {
  // Se usa la cámara del estado de cada frame (patrón habitual de R3F).
  useFrame(({ camera }, delta) => {
    const target = targetRef.current
    const diff = target - camera.position.z
    if (Math.abs(diff) < 0.0005) return
    camera.position.z += diff * Math.min(1, delta * 10)
  })
  return null
}

/**
 * Lienzo 3D del personaje.
 *
 * - Iluminacion propia (sin HDR externo: cero peticiones de red)
 * - Modelos centrados y ajustados automaticamente al escenario
 * - Giro libre del modelo y zoom de cámara (ver INTERACCIÓN LIBRE)
 * - frameloop="never" cuando la seccion no es visible
 * - dpr limitado para no castigar moviles
 */
export function ViewerCanvas({
  character,
  modelState,
  active,
  onModelStateChange,
}: Props) {
  const { t } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<ThreeGroup>(null)
  const zoomRef = useRef(CAMERA_POSITION[2])
  // Punteros activos: 1 = giro, 2 = pellizco.
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const pinchRef = useRef<number | null>(null)

  const handleModelLoaded = useCallback(
    () => onModelStateChange?.('loaded'),
    [onModelStateChange],
  )

  const resetView = useCallback(() => {
    modelRef.current?.quaternion.identity()
    zoomRef.current = CAMERA_POSITION[2]
  }, [])

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if ((event.target as HTMLElement).closest('button')) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    pinchRef.current = null
    // Cambiar el cursor no necesita renderizar React ni volver a reconciliar
    // el subárbol 3D mientras se mantiene el puntero presionado.
    event.currentTarget.classList.add('is-dragging')
  }, [])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const pointers = pointersRef.current
    const previous = pointers.get(event.pointerId)
    if (!previous) return
    const current = { x: event.clientX, y: event.clientY }
    pointers.set(event.pointerId, current)

    if (pointers.size >= 2) {
      // Pellizco: la variación de distancia entre dedos controla el zoom.
      const [a, b] = Array.from(pointers.values())
      if (!a || !b) return
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      if (pinchRef.current !== null && distance > 0) {
        zoomRef.current = clampZoom(zoomRef.current * (pinchRef.current / distance))
      }
      pinchRef.current = distance
      return
    }

    const model = modelRef.current
    if (!model) return
    model.rotateOnWorldAxis(WORLD_Y, (current.x - previous.x) * ROTATE_SPEED)
    model.rotateOnWorldAxis(WORLD_X, (current.y - previous.y) * ROTATE_SPEED)
  }, [])

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const pointers = pointersRef.current
    if (!pointers.has(event.pointerId)) return
    pointers.delete(event.pointerId)
    pinchRef.current = null
    if (pointers.size === 0) event.currentTarget.classList.remove('is-dragging')
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }, [])

  // Rueda: listener nativo (no pasivo) para poder evitar el scroll
  // de la página solo mientras el zoom todavía puede cambiar.
  useEffect(() => {
    const node = containerRef.current
    if (!node) return undefined
    const onWheel = (event: WheelEvent) => {
      const next = clampZoom(zoomRef.current * Math.exp(event.deltaY * 0.0015))
      if (next === zoomRef.current) return
      event.preventDefault()
      zoomRef.current = next
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    resetView()
    pointersRef.current.clear()
    pinchRef.current = null
  }, [character.model, resetView])

  return (
    <div
      ref={containerRef}
      className="viewer-canvas"
      style={{ ['--viewer-glow' as string]: character.glow ?? '#002F61' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={resetView}
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
        style={{ touchAction: 'none' }}
      >
        <CameraZoom targetRef={zoomRef} />

        <Suspense fallback={null}>
          {character.model ? (
            <group ref={modelRef}>
              <CharacterModel
                url={character.model}
                scale={character.scale}
                onLoaded={handleModelLoaded}
              />
            </group>
          ) : null}
        </Suspense>

        {/* Iluminacion de estudio: clave, relleno y contraluz */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[3.5, 6, 4]} intensity={1.5} castShadow={false} />
        <directionalLight position={[-4, 2.5, -3]} intensity={0.55} color={character.glow ?? '#002F61'} />
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
      <button
        type="button"
        className="viewer-canvas__reset"
        onClick={resetView}
        aria-label={t.viewer.resetLabel}
        title={t.viewer.reset}
      >
        <RotateCcw size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
      {modelState === 'loading' ? (
        <div className="viewer-canvas__loading label" role="status">
          {t.viewer.loadingCharacter}
        </div>
      ) : null}
    </div>
  )
}
