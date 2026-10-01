import { characters } from '../../data/characters'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SmartImage } from '../ui/SmartImage'
import './CharacterCollage.css'

const copy = {
  eyebrow: 'Roster',
  title: 'Conoce a los artistas',
  lead: 'Cada artista pelea con un estilo propio. Estas son las posiciones reservadas para las ilustraciones finales de cada personaje.',
} as const

export function CharacterCollage() {
  return (
    <section id="personajes" className="section theme-light collage" aria-label={copy.title}>
      <div className="container">
        <SectionHeading index="01" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} split>
          <p className="collage__count">
            <span className="collage__count-num">{String(characters.length).padStart(2, '0')}</span>
            <span className="label">Artistas</span>
          </p>
        </SectionHeading>

        {/*
          ASSETS PENDIENTES: public/images/characters/<id>.jpg
          Layout editorial: cada personaje tiene una posicion distinta.
          Para cambiar una ilustracion basta con reemplazar el archivo.
        */}
        <ul className="collage__grid">
          {characters.map((character, index) => (
            <Reveal
              as="li"
              key={character.id}
              className={`collage__item collage__item--${index + 1}`}
              delay={0.05 * index}
              duration={0.4}
            >
              <figure className="collage__figure">
                <SmartImage
                  src={character.preview}
                  alt={`Ilustracion de ${character.name}`}
                  placeholderLabel={character.name}
                  index={String(index + 1).padStart(2, '0')}
                  ratio={index % 2 === 0 ? '4 / 5' : '1 / 1'}
                />
                <figcaption className="collage__caption">
                  <span className="collage__name">{character.name}</span>
                  {character.tagline ? (
                    <span className="collage__tagline">{character.tagline}</span>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}