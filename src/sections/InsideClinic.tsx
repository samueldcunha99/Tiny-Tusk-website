import { useRef } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { CLINIC_AMENITIES, CLINIC_CONCEPTS, CLINIC_VISION } from '@/content/clinic'
import { useSectionMeta } from '@/content/sectionOrder'
import { useReveal } from '@/lib/motion'

/**
 * Inside the clinic -- back on the powder ground after the cobalt journey.
 *
 * The three concept visuals in the guide's image-tile treatment (p34: a
 * photograph with its title set in an ellipse), as a row you swipe on a phone
 * and a staggered trio on desktop. Then the clinic's own words and the six
 * things it says are in the space.
 *
 * THE DISCLOSURE STAYS VISIBLE (CLAUDE.md hard rule 8): these are generated
 * concepts, not photographs of the finished clinic, and it says so right under
 * the heading, before the pictures.
 *
 * The clinic's vision is client-supplied and must render complete and verbatim
 * on `/inside-clinic`; the home page carries its opening paragraph and links
 * through to the rest.
 */
export function InsideClinic({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('clinic')
  const Heading = asPage ? 'h1' : 'h2'
  const Sub = asPage ? 'h2' : 'h3'
  useReveal(ref)

  return (
    <section
      id="inside-clinic"
      ref={ref}
      data-surface="powder"
      aria-labelledby="inside-clinic-heading"
      className={[
        'tt-section relative overflow-hidden bg-powder text-cobalt',
        asPage ? 'pb-24 pt-24 md:pb-32 md:pt-36' : 'pb-20 pt-20 md:pb-24 md:pt-28',
      ].join(' ')}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionMarker label={meta.label} />
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <Heading
            id="inside-clinic-heading"
            data-reveal
            className="max-w-[15ch] font-display text-[clamp(2.4rem,10vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          >
            A room that explains itself <Circled tone="cobalt">before</Circled> we do
          </Heading>
          <p className="flex max-w-[36ch] items-start gap-3 font-sans text-[0.92rem] leading-[1.55]">
            <span className="mt-0.5 block w-5 shrink-0" aria-hidden="true">
              <Doodle name="markDashes" tone="coral" />
            </span>
            These are concept visuals of the space being built, not photographs of the finished clinic.
          </p>
        </div>
      </div>

      {/* Swipe row on a phone and tablet: each tile is most of the screen, so
          the next one shows at the edge and says "there is more". Three across
          from `lg`, where a tile is wide enough for its ellipse title; the
          middle tile drops half a step for the staggered rhythm. */}
      <ul
        aria-label="Concept visuals of the clinic"
        className="tt-swipe mt-10 list-none gap-4 px-6 [scroll-padding-inline:1.5rem] md:gap-6 md:px-10 lg:mx-auto lg:grid lg:max-w-[1400px] lg:grid-cols-3 lg:overflow-visible"
      >
        {CLINIC_CONCEPTS.map((concept, index) => (
          <li key={concept.id} className={['w-[80%] md:w-[46%] lg:w-auto', index === 1 ? 'lg:mt-16' : ''].join(' ')}>
            <BrandImage
              webp={`/images/${concept.image.stem}.webp`}
              png={`/images/${concept.image.stem}.png`}
              alt={concept.image.alt}
              width={concept.image.width}
              height={concept.image.height}
              title={{ ...concept.title, href: asPage ? '/book' : '/inside-clinic' }}
              eager={asPage && index === 0}
              className="aspect-square w-full lg:aspect-[4/5]"
            />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-14 grid max-w-[1400px] gap-10 px-6 md:mt-20 md:px-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <Sub className="max-w-[18ch] font-display text-[clamp(1.75rem,6.5vw,2.5rem)] leading-[1.08]">
            <MixedWeightLabel display lead={CLINIC_VISION.heading.lead} rest={CLINIC_VISION.heading.rest} />
          </Sub>
          <div className="mt-5 flex flex-col gap-5">
            {(asPage ? CLINIC_VISION.paragraphs : CLINIC_VISION.paragraphs.slice(0, 1)).map((para) => (
              <p key={para.slice(0, 24)} data-reveal="fast" className="max-w-[54ch] font-sans text-[1.05rem] leading-[1.65] md:text-[1.15rem]">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div>
          {/* The index of what the clinic says is in the room. Labels only --
              the clinic's words, no descriptions of ours (content/clinic.ts). */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-7">
            {CLINIC_AMENITIES.map((amenity) => (
              <li key={amenity.label} className="flex flex-col gap-2.5">
                <Doodle name={amenity.glyph} tone="cobalt" drawOnScroll tap className="h-9 w-9" />
                <span className="font-display text-[1.15rem] leading-snug">{amenity.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            {asPage ? (
              <div className="-m-4 p-4">
                <StylisedCTA lead="Book" rest="a visit" href="/book" fill="canary" />
              </div>
            ) : (
              <a href="/inside-clinic" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
                <span className="underline decoration-2 underline-offset-[6px]">Step inside the clinic</span>
                <span className="block w-5" aria-hidden="true">
                  <Doodle name="markArrow" tone="cobalt" />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
