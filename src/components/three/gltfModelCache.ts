import { useGLTF } from '@react-three/drei'
import { peek } from 'suspend-react'
import { type BufferGeometry, type Material, type Mesh, type Object3D, type Texture } from 'three'
import { GLTFLoader } from 'three-stdlib'
import { assetUrl } from '../../utils/assets'

interface CachedGLTF {
  scene: Object3D
}

interface Entry {
  scene?: Object3D
  activeUsers: number
  lastUsed: number
}

// La caché de useGLTF es global. Este LRU coordina su invalidación y nunca
// libera recursos mientras un personaje siga montado en el visor.
const entries = new Map<string, Entry>()
let accessClock = 0

function cacheLimit(): number {
  if (typeof navigator === 'undefined') return 2

  const device = navigator as Navigator & { deviceMemory?: number }
  const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
  if (mobile) return device.deviceMemory && device.deviceMemory <= 2 ? 1 : 2
  return device.deviceMemory && device.deviceMemory >= 8 ? 3 : 2
}

function cacheKey(path: string): string {
  return assetUrl(path)
}

function peekGLTF(url: string): CachedGLTF | undefined {
  return peek([GLTFLoader, url]) as CachedGLTF | undefined
}

function touch(url: string, entry: Entry): void {
  entry.lastUsed = ++accessClock
  entries.delete(url)
  entries.set(url, entry)
}

function disposeScene(scene: Object3D): void {
  const geometries = new Set<BufferGeometry>()
  const materials = new Set<Material>()
  const textures = new Set<Texture>()

  scene.traverse((child) => {
    const mesh = child as Mesh
    if (!mesh.isMesh) return
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

  textures.forEach((texture) => texture.dispose())
  materials.forEach((material) => material.dispose())
  geometries.forEach((geometry) => geometry.dispose())
}

function evict(url: string, entry: Entry): void {
  if (entry.activeUsers > 0) return
  const scene = entry.scene ?? peekGLTF(url)?.scene
  useGLTF.clear(url)
  if (scene) disposeScene(scene)
  entries.delete(url)
}

function trimCache(protectedUrl?: string): void {
  while (entries.size > cacheLimit()) {
    const oldest = [...entries.entries()].find(
      ([url, entry]) => url !== protectedUrl && entry.activeUsers === 0,
    )
    if (!oldest) return
    evict(oldest[0], oldest[1])
  }
}

/** Returns true only when a parsed GLTF is ready for immediate reuse. */
export function isModelPrepared(path: string): boolean {
  const url = cacheKey(path)
  const entry = entries.get(url)
  const gltf = peekGLTF(url)
  return Boolean(gltf?.scene || entry?.scene)
}

/** Keep parsed resources while mounted, then retain them in the bounded LRU. */
export function retainModel(path: string, scene: Object3D): () => void {
  const url = cacheKey(path)
  const entry = entries.get(url) ?? { activeUsers: 0, lastUsed: 0 }
  entry.scene = scene
  entry.activeUsers += 1
  touch(url, entry)
  trimCache(url)

  let released = false
  return () => {
    if (released) return
    released = true
    entry.activeUsers = Math.max(0, entry.activeUsers - 1)
    touch(url, entry)
    trimCache()
  }
}

/** Preloads only caller-selected URLs; GLB requests remain outside Workbox. */
export function preloadModel(path: string): void {
  const url = cacheKey(path)
  if (isModelPrepared(path)) return
  if (!entries.has(url)) {
    const entry: Entry = { activeUsers: 0, lastUsed: ++accessClock }
    entries.set(url, entry)
    trimCache(url)
  }
  useGLTF.preload(url)
}

/** Explicit retry path only; ordinary unmounts never clear or dispose models. */
export function clearModel(path: string): void {
  const url = cacheKey(path)
  const entry = entries.get(url)
  if (entry?.activeUsers) return
  if (entry) evict(url, entry)
  else {
    const scene = peekGLTF(url)?.scene
    useGLTF.clear(url)
    if (scene) disposeScene(scene)
  }
}
