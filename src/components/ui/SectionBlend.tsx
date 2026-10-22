import type { CSSProperties } from 'react'
import './SectionBlend.css'

/** Decorative blend between adjacent section backgrounds; never covers content. */
export function SectionBlend({ from, to }: { from: string; to: string }) {
  return <div className="section-blend" aria-hidden="true" style={{ '--blend-from': from, '--blend-to': to } as CSSProperties} />
}
