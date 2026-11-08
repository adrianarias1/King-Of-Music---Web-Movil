import type { LucideIcon } from 'lucide-react'
import {
  Aperture,
  BadgeCheck,
  Boxes,
  Clapperboard,
  CodeXml,
  Cpu,
  Database,
  Gamepad2,
  Gauge,
  Gpu,
  HardDrive,
  Keyboard,
  Languages,
  Layers,
  MemoryStick,
  Monitor,
  Music4,
  Package,
  PackageCheck,
  PersonStanding,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Tag,
  Users,
} from 'lucide-react'
import {
  requirements,
  specHighlights,
  specSheet,
  technicalSpecs,
} from '../../data/gameSpecs'
import { useI18n } from '../../i18n'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import './GameSpecs.css'

// =========================================================
// KING OF MUSIC — REQUERIMIENTOS Y ESPECIFICACIONES
//
// Sección oscura previa a "Cómo se construye":
//   1. Cifras destacadas.
//   2. Ficha técnica (tarjetas con icono).
//   3. Requisitos del sistema: Mínimo frente a Recomendado.
//   4. Especificaciones técnicas del proyecto de Unity.
//
// Datos: src/data/gameSpecs.ts (documento del proyecto, { es, en }).
// =========================================================

/** Icono de cada fila según su id (si falta, se usa Sparkles). */
const ICONS: Record<string, LucideIcon> = {
  // Ficha técnica
  genre: Swords,
  theme: Music4,
  modes: Users,
  rating: ShieldCheck,
  content: Layers,
  version: Tag,
  engine: Boxes,
  platform: Monitor,
  distribution: PackageCheck,
  language: Languages,
  // Requisitos
  os: Monitor,
  cpu: Cpu,
  ram: MemoryStick,
  gpu: Gpu,
  storage: HardDrive,
  directx: Sparkles,
  input: Keyboard,
  // Especificaciones técnicas
  render: Aperture,
  api: Layers,
  code: CodeXml,
  architecture: Database,
  scenes: Clapperboard,
  animation: PersonStanding,
  performance: Gauge,
  build: Package,
}

const TECH_ICONS: Record<string, LucideIcon> = { input: Gamepad2 }

function iconFor(id: string, table: Record<string, LucideIcon> = {}): LucideIcon {
  return table[id] ?? ICONS[id] ?? Sparkles
}

export function GameSpecs() {
  const { t, l } = useI18n()
  const copy = t.specs

  return (
    <section id="desarrollo" className="section theme-dark specs" aria-label={copy.title}>
      <div className="specs__bg" aria-hidden="true" />

      <div className="container">
        <SectionHeading index="06" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        {/* 1. Cifras destacadas */}
        <Reveal as="ul" className="specs__highlights" distance={20}>
          {specHighlights.map((item) => (
            <li key={item.id} className="specs__highlight">
              <strong>{item.value}</strong>
              <span>{l(item.label)}</span>
            </li>
          ))}
        </Reveal>

        {/* 2. Ficha técnica */}
        <div className="specs__block">
          <BlockTitle number="01" title={copy.specSheet} />
          <ul className="specs__facts">
            {specSheet.map((row, index) => {
              const Icon = iconFor(row.id)
              return (
                <Reveal as="li" key={row.id} className="specs__fact" delay={0.03 * index} distance={16}>
                  <span className="specs__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <span className="specs__fact-label">{l(row.label)}</span>
                  <span className="specs__fact-value">{l(row.value)}</span>
                </Reveal>
              )
            })}
          </ul>
        </div>

        {/* 3. Requisitos del sistema */}
        <div className="specs__block">
          <BlockTitle number="02" title={copy.requirements} />
          <p className="specs__note">{copy.requirementsNote}</p>
          <div className="specs__reqs">
            {(['minimum', 'recommended'] as const).map((tier) => {
              const recommended = tier === 'recommended'
              return (
                <Reveal
                  key={tier}
                  className={`specs__tier${recommended ? ' specs__tier--best' : ''}`}
                  delay={recommended ? 0.08 : 0}
                  distance={20}
                >
                  <header className="specs__tier-head">
                    <span className="specs__tier-name">{recommended ? copy.recommended : copy.minimum}</span>
                    {recommended ? (
                      <span className="specs__tier-badge">
                        <Star size={12} fill="currentColor" aria-hidden="true" />
                        {copy.bestExperience}
                      </span>
                    ) : (
                      <span className="specs__tier-sub">{copy.toPlay}</span>
                    )}
                  </header>
                  <dl className="specs__tier-list">
                    {requirements.map((row) => {
                      const Icon = iconFor(row.id)
                      return (
                        <div key={row.id} className="specs__req">
                          <Icon className="specs__req-icon" size={18} strokeWidth={1.5} aria-hidden="true" />
                          <dt>{l(row.component)}</dt>
                          <dd>{l(recommended ? row.recommended : row.minimum)}</dd>
                        </div>
                      )
                    })}
                  </dl>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* 4. Especificaciones técnicas */}
        <div className="specs__block specs__block--last">
          <BlockTitle number="03" title={copy.technical} />
          <ul className="specs__tech">
            {technicalSpecs.map((row, index) => {
              const Icon = iconFor(row.id, TECH_ICONS)
              return (
                <Reveal as="li" key={row.id} className="specs__tech-item" delay={0.03 * index} distance={16}>
                  <Icon className="specs__tech-icon" size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span className="specs__tech-label">{l(row.label)}</span>
                  <span className="specs__tech-value">{l(row.value)}</span>
                </Reveal>
              )
            })}
          </ul>
          <p className="specs__verified">
            <BadgeCheck size={16} strokeWidth={1.6} aria-hidden="true" />
            {copy.verified}
          </p>
        </div>
      </div>
    </section>
  )
}

function BlockTitle({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="specs__block-title">
      <span className="specs__block-num" aria-hidden="true">{number}</span>
      <span>{title}</span>
    </h3>
  )
}
