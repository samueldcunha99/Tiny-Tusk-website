import { BrandImage } from '@/components/BrandImage'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextPanel } from '@/components/TextPanel'
import { colourVar } from '@/components/BrandArtView'
import { carriesText } from '@/design/pairings'
import { DR_NUPUR } from '@/content/team'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * 06 Dr. Nupur -- paper.
 *
 * The philosophy quote becomes the section heading with the p32 lasso around
 * the single word "understood" (never the whole line -- see `Circled`), and the
 * credentials move into an official-register cobalt panel under the portrait so
 * they read as verified fact rather than card copy.
 *
 * The portrait is still `BrandImage placeholder`: nothing here fakes a
 * photograph, and `portrait.productionNote` stays out of the UI.
 */
export function Team({ asPage = false }: { asPage?: boolean | undefined }) {
  const meta = useSectionMeta('team')
  const Heading = asPage ? 'h1' : 'h2'
  const [quoteHead, quoteTail] = DR_NUPUR.philosophy.quote.split('understood')

  return (
    <section
      id="team"
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      aria-labelledby="team-heading"
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />

        <div className="mt-4 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="relative">
            <BrandImage
              placeholder
              alt={DR_NUPUR.portrait.alt}
              width={1000}
              height={1250}
              title={{ lead: 'Dr.', rest: 'Nupur', fill: 'canary', href: '/book' }}
              logoTone="cobalt"
              doodle="doodleHeart"
              doodleTone="coral"
              className="aspect-[4/5]"
            />
            <Doodle
              name="markDashes"
              tone="coral"
              drawOnScroll
              className="pointer-events-none absolute -top-4 right-[-0.625rem] w-16"
            />

            <div className="mt-5 rounded-[2rem] bg-cobalt p-7 md:p-8" data-surface="cobalt">
              <h3 className="font-display text-h2 text-canary">{DR_NUPUR.name}</h3>
              <p className="mt-2.5 font-sans text-base tracking-[0.02em] text-canary">
                {DR_NUPUR.credentials}
              </p>
              <p className="mt-4 max-w-measure font-sans text-base leading-relaxed text-white">
                {DR_NUPUR.philosophy.body}
              </p>
            </div>
          </div>

          <div>
            <Heading id="team-heading" className="font-display text-h1 text-cobalt">
              {quoteHead}
              <Circled tone="coral">understood</Circled>
              {quoteTail}
            </Heading>

            <ul className="mt-11 flex list-none flex-col gap-5">
              {DR_NUPUR.expectations.map((beat) => {
                const onPanel = !carriesText(beat.surface)
                return (
                  <li
                    key={beat.title}
                    data-surface={beat.surface}
                    className="flex items-start gap-5 rounded-[2rem] p-7"
                    style={{ background: colourVar(beat.surface) }}
                  >
                    <Doodle name={beat.glyph} tone={beat.element} drawOnScroll className="w-[3.25rem] shrink-0" />
                    <TextPanel surface={beat.surface}>
                      <h3
                        className="font-display text-xl leading-snug"
                        style={{ color: colourVar(onPanel ? 'canary' : beat.element) }}
                      >
                        {beat.title}
                      </h3>
                      <p
                        className="mt-2 max-w-measure font-sans text-base leading-relaxed"
                        style={{ color: colourVar(onPanel ? 'white' : beat.element) }}
                      >
                        {beat.body}
                      </p>
                    </TextPanel>
                  </li>
                )
              })}
            </ul>

            {DR_NUPUR.hasFavouritePart ? (
              <blockquote className="mt-8 rounded-[2rem] bg-powder p-7 font-display text-h2 text-cobalt">
                {DR_NUPUR.favouritePart}
              </blockquote>
            ) : null}

            <div className="mt-9">
              <StylisedCTA lead="Book" rest="with Dr. Nupur" href="/book" fill="canary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
