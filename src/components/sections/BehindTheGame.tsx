import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { devShots, processSteps, tools } from '../../data/tools'
import { milestones, repositories, testCases, testingSummary, testStats } from '../../data/gameSpecs'
import { GitHubMark } from '../ui/GitHubMark'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { ToolCard } from '../ui/ToolCard'
import { useI18n } from '../../i18n'
import './BehindTheGame.css'

// =========================================================
// KING OF MUSIC — CÓMO SE CONSTRUYE
//
//   01 Herramientas   02 Proceso   03 Hitos y pruebas
//   04 Repositorios   05 Galería de desarrollo
//
// La ficha técnica y los requisitos están en GameSpecs
// (sección anterior, "Requerimientos y especificaciones").
// =========================================================

export function BehindTheGame() {
  const { t, l } = useI18n()
  const copy = t.behind

  return (
    <section id="construccion" className="section theme-light behind" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="07" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        {/* 01. Herramientas */}
        <div className="behind__block">
          <BlockTitle number="01" title={copy.tools} />
          <ul className="behind__tools">
            {tools.map((tool, index) => (
              <Reveal as="li" key={tool.id} delay={0.03 * index} distance={16}>
                <ToolCard tool={tool} />
              </Reveal>
            ))}
          </ul>
        </div>

        {/* 02. Proceso */}
        <div className="behind__block">
          <BlockTitle number="02" title={copy.process} />
          <ol className="behind__steps">
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.id} className="behind__step" delay={0.05 * index} distance={18}>
                <span className="behind__step-num">{String(index + 1).padStart(2, '0')}</span>
                <h4 className="behind__step-title">{l(step.title)}</h4>
                <p className="behind__step-desc">{l(step.description)}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* 03. Hitos + pruebas */}
        <div className="behind__block behind__grid">
          <div>
            <BlockTitle number="03" title={copy.milestones} />
            <ol className="behind__timeline">
              {milestones.map((item, index) => (
                <Reveal as="li" key={item.id} className="behind__milestone" delay={0.04 * index} distance={14}>
                  <span className="behind__milestone-date">{l(item.date)}</span>
                  <h4 className="behind__milestone-title">{l(item.title)}</h4>
                  <p className="behind__milestone-desc">{l(item.description)}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          <div>
            <BlockTitle number="04" title={copy.testing} />
            <p className="behind__testing-lead">{l(testingSummary)}</p>
            <ul className="behind__stats">
              {testStats.map((stat) => (
                <li key={stat.id}>
                  <strong>{stat.value}</strong>
                  <span>{l(stat.label)}</span>
                </li>
              ))}
            </ul>
            <details className="behind__cases">
              <summary>{copy.testCases(testCases.length)}</summary>
              <ol>
                {testCases.map((test) => (
                  <li key={test.id}>
                    <span className="behind__case-id">{test.id}</span>
                    <div>
                      <strong>{l(test.title)}</strong>
                      <p>{l(test.criterion)}</p>
                    </div>
                    <span className="behind__case-result">
                      <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
                      {copy.passed}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
          </div>
        </div>

        {/* 05. Repositorios */}
        <div className="behind__block">
          <BlockTitle number="05" title={copy.repositories} />
          <ul className="behind__repos">
            {repositories.map((repo, index) => (
              <Reveal as="li" key={repo.id} delay={0.06 * index} distance={16}>
                <a className="behind__repo" href={repo.url} target="_blank" rel="noreferrer noopener">
                  <span className="behind__repo-logo">
                    <GitHubMark size={26} />
                  </span>
                  <span className="behind__repo-body">
                    <span className="behind__repo-kicker">GitHub</span>
                    <span className="behind__repo-name">{l(repo.name)}</span>
                    <span className="behind__repo-desc">{l(repo.description)}</span>
                    <span className="behind__repo-meta">
                      <span className="behind__repo-stack">{repo.stack}</span>
                      <span className="behind__repo-url">{repo.url.replace('https://', '')}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="behind__repo-arrow" size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span className="visually-hidden"> {t.common.newTab}</span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* 06. Galería de desarrollo (capturas en public/images/dev/) */}
        <div className="behind__block behind__block--last">
          <BlockTitle number="06" title={copy.gallery} />
          <ul className="behind__shots">
            {devShots.map((shot, index) => (
              <Reveal as="li" key={shot.id} delay={0.05 * index} distance={18}>
                <figure className="behind__shot">
                  <SmartImage
                    src={shot.image}
                    alt={l(shot.caption)}
                    placeholderLabel={copy.pendingShot}
                    ratio="16 / 10"
                  />
                  <figcaption className="behind__shot-cap">
                    <span className="label">{String(index + 1).padStart(2, '0')}</span>
                    <span>{l(shot.caption)}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function BlockTitle({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="behind__block-title">
      <span className="behind__block-num" aria-hidden="true">{number}</span>
      <span>{title}</span>
    </h3>
  )
}
