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
import { useIsMobile } from '@/lib/viewport'
import { TeamMobile } from './Team.mobile'

/**
 * 06 Dr. Nupur -- paper.
 *
 * The philosophy quote becomes the section heading with the p32 lasso around
 * the single word "understood" (never the whole line -- see `Circled`), and the
 * credentials move into an official-register cobalt panel under the portrait so
 * they read as verified fact rather than card copy.
 *
 * The cobalt panel under the portrait carries Dr. Nupur's own bio, first
 * person and verbatim from the client, and the white card opposite carries the
 * five client-stated key specialities. Both are official-register surfaces
 * because both are verified fact rather than marketing copy. That card was
 * powder until the section ground became powder itself.
 *
 * The portrait is still `BrandImage placeholder`: nothing here fakes a
 * photograph, and `portrait.productionNote` stays out of the UI. It is
 * deliberately not portrait-shaped while it is empty -- see the note on the
 * height clamp below.
 *
 * The phone renders `Team.mobile.tsx` instead; this composition never mounts
 * under `md`.
 */
export function Team({ asPage = false }: { asPage?: boolean | undefined }) {
  if (useIsMobile()) return <TeamMobile asPage={asPage} />
  return <TeamDesktop asPage={asPage} />
}

function TeamDesktop({ asPage }: { asPage: boolean }) {
  const meta = useSectionMeta('team')
  const Heading = asPage ? 'h1' : 'h2'
  const [quoteHead, quoteTail] = DR_NUPUR.philosophy.quote.split('understood')

  return (
    <section
      id="team"
      data-surface="powder"
      className={[
        // Powder, not paper. Four paper sections ran back to back down the
        // desktop scroll (journey, team, services, clinic) and the page read
        // as white. Powder carries the same cobalt copy at 4.92:1, so nothing
        // inside had to be recoloured -- only the two powder cards below,
        // which would have disappeared into their own ground.
        'tt-section relative bg-powder px-6 md:px-10',
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
              showCTA={false}
              logoTone="cobalt"
              doodle="doodleHeart"
              doodleTone="coral"
              // Height-clamped, not `aspect-[4/5]`. At 4:5 in a half of a
              // 1400px grid this placeholder was ~840px tall -- most of a
              // screen of empty powder standing in for a photograph that does
              // not exist yet. Same clamp the Laughing Gas placeholder uses.
              // Restore the 4:5 ratio when a real portrait is supplied.
              // The ring is needed now the section ground is powder too:
              // without it the tile has no edge and reads as a hole.
              className="h-[clamp(20rem,38vh,28rem)] ring-2 ring-cobalt/15"
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
              {DR_NUPUR.bio.map((para) => (
                <p
                  key={para.slice(0, 24)}
                  className="mt-4 max-w-measure font-sans text-base leading-relaxed text-white"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Specialities sit under the credentials, not opposite them. Both
                are client-verified clinical fact in the official register, so
                they belong together -- and the expectations column opposite ran
                ~270px taller, which left this one ending in a slab of bare
                powder before the section did. */}
            <div className="mt-5 rounded-[2rem] bg-white p-7" data-surface="white">
              <h3 className="font-display text-xl text-cobalt">Key specialities</h3>
              <ul className="mt-4 flex list-none flex-col gap-3">
                {DR_NUPUR.specialities.map((speciality) => (
                  <li key={speciality} className="flex items-start gap-3">
                    <Doodle
                      name="markArrow"
                      tone="cobalt"
                      drawOnScroll
                      className="mt-1 w-5 shrink-0"
                    />
                    <span className="font-sans text-base leading-relaxed text-cobalt">
                      {speciality}
                    </span>
                  </li>
                ))}
              </ul>
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
              <blockquote className="mt-8 rounded-[2rem] bg-white p-7 font-display text-h2 text-cobalt">
                {DR_NUPUR.favouritePart}
              </blockquote>
            ) : null}

            {/* Closes the column, so it takes the column's width rather than
                sitting in it as a chip. */}
            <div className="mt-9">
              <StylisedCTA
                lead="Book"
                rest="with Dr. Nupur"
                href="/book"
                fill="canary"
                size="lg"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
