import { CodeXml, Contact, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { projectMeta, team } from '../../data/team'
import type { SocialLink } from '../../types'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import './Team.css'

const copy = {
  eyebrow: 'Equipo',
  title: 'Detras del proyecto',
  lead: 'Equipo desarrollador de King of Music. Proyecto universitario.',
} as const

const ICONS: Record<string, LucideIcon> = {
  github: CodeXml,
  linkedin: Contact,
  mail: Globe,
  globe: Globe,
}

function TeamSocial({ link }: { link: SocialLink }) {
  const Icon = ICONS[link.icon ?? 'globe'] ?? Globe
  return (
    <a
      className="team__social"
      href={link.href || undefined}
      aria-label={`${link.label} — ${team.find((m) => m.links?.includes(link))?.name ?? 'integrante'}`}
      target="_blank"
      rel="noreferrer noopener"
      tabIndex={link.href ? 0 : -1}
      aria-disabled={link.href ? undefined : 'true'}
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
    </a>
  )
}

export function TeamSection() {
  return (
    <section id="equipo" className="section theme-dark team" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="07" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        <ul className="team__grid">
          {team.map((member, index) => (
            <Reveal as="li" key={member.id} delay={0.04 * index} distance={20}>
              <article className="team__card">
                <SmartImage
                  src={member.image}
                  alt={`Fotografia de ${member.name}`}
                  placeholderLabel="Integrante"
                  ratio="1 / 1"
                />
                <div className="team__info">
                  <h3 className="team__name">{member.name}</h3>
                  <p className="team__role">{member.role}</p>
                </div>
                {member.links && member.links.length > 0 ? (
                  <div className="team__links">
                    {member.links.map((link) => (
                      <TeamSocial key={link.label} link={link} />
                    ))}
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ul>

        <p className="team__meta notice">
          <span>{projectMeta.type}</span>
          <a
            className="team__repo"
            href={projectMeta.repository}
            target="_blank"
            rel="noreferrer noopener"
          >
            <CodeXml size={14} strokeWidth={1.5} aria-hidden="true" />
            GitHub
          </a>
        </p>
      </div>
    </section>
  )
}