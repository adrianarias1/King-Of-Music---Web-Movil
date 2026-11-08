import { ArrowUpRight, CodeXml } from 'lucide-react'
import { devShots, processSteps, tools } from '../../data/tools'
import {
  milestones,
  repositories,
  requirements,
  specSheet,
  technicalSpecs,
  testCases,
  testingSummary,
  testStats,
} from '../../data/gameSpecs'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { ToolCard } from '../ui/ToolCard'
import { useI18n } from '../../i18n'
import './BehindTheGame.css'

export function BehindTheGame() {
  const { t, l } = useI18n()
  const copy = t.behind
  return (
    <section id="desarrollo" className="section theme-light behind" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="06" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        <div className="behind__grid">
          {/* Herramientas */}
          <Reveal className="behind__tools" distance={24}>
            <h3 className="label behind__subtitle">{copy.tools}</h3>
            <ul>
              {tools.map((tool) => (
                <li key={tool.id}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Proceso */}
          <Reveal className="behind__process" distance={24} delay={0.08}>
            <h3 className="label behind__subtitle">{copy.process}</h3>
            <ol className="behind__steps">
              {processSteps.map((step, index) => (
                <li key={step.id} className="behind__step">
                  <span className="behind__step-num">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className="behind__step-title">{l(step.title)}</h4>
                    <p className="behind__step-desc">{l(step.description)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* Ficha técnica */}
        <Reveal className="behind__block" distance={24}>
          <h3 className="label behind__subtitle">{copy.specSheet}</h3>
          <dl className="behind__specs">
            {specSheet.map((row) => (
              <div key={row.id} className="behind__spec">
                <dt>{l(row.label)}</dt>
                <dd>{l(row.value)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Requisitos del sistema */}
        <Reveal className="behind__block" distance={24}>
          <h3 className="label behind__subtitle">{copy.requirements}</h3>
          <table className="behind__reqs">
            <caption className="visually-hidden">{copy.requirementsCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{copy.component}</th>
                <th scope="col">{copy.minimum}</th>
                <th scope="col">{copy.recommended}</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{l(row.component)}</th>
                  <td data-label={copy.minimum}>{l(row.minimum)}</td>
                  <td data-label={copy.recommended}>{l(row.recommended)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Especificaciones técnicas */}
        <Reveal className="behind__block" distance={24}>
          <h3 className="label behind__subtitle">{copy.technical}</h3>
          <dl className="behind__specs behind__specs--compact">
            {technicalSpecs.map((row) => (
              <div key={row.id} className="behind__spec">
                <dt>{l(row.label)}</dt>
                <dd>{l(row.value)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Hitos + pruebas */}
        <div className="behind__grid">
          <Reveal className="behind__block behind__block--flush" distance={24}>
            <h3 className="label behind__subtitle">{copy.milestones}</h3>
            <ol className="behind__timeline">
              {milestones.map((item) => (
                <li key={item.id} className="behind__milestone">
                  <span className="behind__milestone-date">{l(item.date)}</span>
                  <div>
                    <h4 className="behind__step-title">{l(item.title)}</h4>
                    <p className="behind__step-desc">{l(item.description)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="behind__block behind__block--flush" distance={24} delay={0.08}>
            <h3 className="label behind__subtitle">{copy.testing}</h3>
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
                    <span className="behind__case-result">{copy.passed}</span>
                  </li>
                ))}
              </ol>
            </details>
          </Reveal>
        </div>

        {/* Repositorios */}
        <Reveal className="behind__block" distance={24}>
          <h3 className="label behind__subtitle">{copy.repositories}</h3>
          <ul className="behind__repos">
            {repositories.map((repo) => (
              <li key={repo.id}>
                <a
                  className="behind__repo"
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <CodeXml className="behind__repo-icon" size={22} strokeWidth={1.5} aria-hidden="true" />
                  <span className="behind__repo-body">
                    <span className="behind__repo-name">{l(repo.name)}</span>
                    <span className="behind__repo-desc">{l(repo.description)}</span>
                    <span className="behind__repo-meta">
                      {repo.stack} · {repo.url.replace('https://', '')}
                    </span>
                  </span>
                  <ArrowUpRight className="behind__repo-arrow" size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span className="visually-hidden"> {t.common.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/*
          ASSETS PENDIENTES: public/images/dev/<id>.jpg
          Galeria de material de proceso: renders, capturas y documentacion visual.
        */}
        <div className="behind__gallery">
          <h3 className="label behind__subtitle">{copy.gallery}</h3>
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