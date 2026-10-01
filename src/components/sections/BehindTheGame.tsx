import { devShots, processSteps, tools } from '../../data/tools'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import { ToolCard } from '../ui/ToolCard'
import './BehindTheGame.css'

const copy = {
  eyebrow: 'Detras del juego',
  title: 'Como se construye',
  lead: 'Herramientas, proceso y material de trabajo del equipo. Esta seccion documenta el desarrollo de King of Music.',
} as const

export function BehindTheGame() {
  return (
    <section id="desarrollo" className="section theme-light behind" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="06" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

        <div className="behind__grid">
          {/* Herramientas */}
          <Reveal className="behind__tools" distance={24}>
            <h3 className="label behind__subtitle">Herramientas</h3>
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
            <h3 className="label behind__subtitle">Proceso</h3>
            <ol className="behind__steps">
              {processSteps.map((step, index) => (
                <li key={step.id} className="behind__step">
                  <span className="behind__step-num">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className="behind__step-title">{step.title}</h4>
                    <p className="behind__step-desc">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/*
          ASSETS PENDIENTES: public/images/dev/<id>.jpg
          Galeria de material de proceso: renders, capturas y documentacion visual.
        */}
        <div className="behind__gallery">
          <h3 className="label behind__subtitle">Galeria de desarrollo</h3>
          <ul className="behind__shots">
            {devShots.map((shot, index) => (
              <Reveal as="li" key={shot.id} delay={0.05 * index} distance={18}>
                <figure className="behind__shot">
                  <SmartImage
                    src={shot.image}
                    alt={shot.caption}
                    placeholderLabel="Screenshot"
                    ratio="16 / 10"
                  />
                  <figcaption className="behind__shot-cap">
                    <span className="label">{String(index + 1).padStart(2, '0')}</span>
                    <span>{shot.caption}</span>
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