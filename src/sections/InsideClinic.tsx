import { useRef } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionMarker } from '@/components/SectionMarker'
import { SmileEdge } from '@/components/SmileEdge'
import { colourVar } from '@/components/BrandArtView'
import { CLINIC_AMENITIES, CLINIC_CONCEPTS, CLINIC_VISION } from '@/content/clinic'
import { useSectionMeta } from '@/content/sectionOrder'
import { useReveal } from '@/lib/motion'
import { BookingClose } from './BookingClose'

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
  if (asPage) return <InsideClinicPage />
  return <InsideClinicSection />
}

/**
 * Each concept at 640, 1024 and its full 1536px (tools/responsive-images.py).
 * The photographs are 3:2 and cropped to fill their tile, so a square or 4:5
 * tile needs an image about 1.5 times as wide as the tile is tall -- the
 * `sizes` below are those widths, measured from the layouts they serve.
 */
const conceptSrcSet = (stem: string) =>
  `/images/${stem}-640.webp 640w, /images/${stem}-1024.webp 1024w, /images/${stem}.webp 1536w`
const STRIP_SIZES = '(min-width: 1024px) 800px, (min-width: 768px) 62vw, 105vw'
const GALLERY_SIZES = '(min-width: 1024px) 860px, (min-width: 768px) 49vw, 100vw'
const GALLERY_WIDE_SIZES = '(min-width: 1024px) 1320px, (min-width: 768px) 90vw, 100vw'

function InsideClinicSection() {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('clinic')
  useReveal(ref)

  return (
    <section
      id="inside-clinic"
      ref={ref}
      data-surface="powder"
      aria-labelledby="inside-clinic-heading"
      className="tt-section relative overflow-hidden bg-powder pb-20 pt-20 text-cobalt md:pb-24 md:pt-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionMarker label={meta.label} />
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <h2
            id="inside-clinic-heading"
            data-reveal
            className="max-w-[15ch] font-display text-[clamp(2.4rem,10vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          >
            A room that explains itself <Circled tone="cobalt">before</Circled> we do
          </h2>
          <Disclosure />
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
              webpSrcSet={conceptSrcSet(concept.image.stem)}
              sizes={STRIP_SIZES}
              png={`/images/${concept.image.stem}.png`}
              alt={concept.image.alt}
              width={concept.image.width}
              height={concept.image.height}
              title={{ ...concept.title, href: '/inside-clinic/' }}
              className="aspect-square w-full lg:aspect-[4/5]"
            />
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-14 grid max-w-[1400px] gap-10 px-6 md:mt-20 md:px-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <h3 className="max-w-[18ch] font-display text-[clamp(1.75rem,6.5vw,2.5rem)] leading-[1.08]">
            <MixedWeightLabel display lead={CLINIC_VISION.heading.lead} rest={CLINIC_VISION.heading.rest} />
          </h3>
          <div className="mt-5 flex flex-col gap-5">
            {CLINIC_VISION.paragraphs.slice(0, 1).map((para) => (
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
            <a href="/inside-clinic/" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
              <span className="underline decoration-2 underline-offset-[6px]">Step inside the clinic</span>
              <span className="block w-5" aria-hidden="true">
                <Doodle name="markArrow" tone="cobalt" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Disclosure() {
  return (
    <p className="flex max-w-[36ch] items-start gap-3 font-sans text-[0.92rem] leading-[1.55]">
      <span className="mt-0.5 block w-5 shrink-0" aria-hidden="true">
        <Doodle name="markDashes" tone="coral" />
      </span>
      These are concept visuals of the space being built, not photographs of the finished clinic.
    </p>
  )
}

/**
 * Three disc colours in turn, so no two equal discs touch in the two-column
 * grid, across or down -- the treatment discs' cycle (Services.tsx). Each
 * drawing takes its disc's p24 partner: canary on cobalt and coral, cobalt on
 * powder.
 */
const DISCS = ['cobalt', 'powder', 'coral'] as const

/**
 * `/inside-clinic` -- composed like the home page, in three chapters joined by
 * the tagline's smile, powder to canary to cobalt.
 *
 *   powder -- the heading, the disclosure, and the three concept visuals as a
 *             gallery: stacked on a phone, a 7 + 5 over 12 spread on desktop
 *   canary -- the clinic's vision, complete and verbatim, beside the six
 *             things it names in the space, each drawing on a colour disc
 *   cobalt -- the close, running on into the footer
 *
 * The canary chapter carries no loop: the vision and the discs fill it edge to
 * edge on desktop, and any loop there crossed the amenity labels.
 */
function InsideClinicPage() {
  const openRef = useRef<HTMLElement>(null)
  const visionRef = useRef<HTMLElement>(null)
  const meta = useSectionMeta('clinic')
  useReveal(openRef)
  useReveal(visionRef)

  return (
    <>
      <section
        id="inside-clinic"
        ref={openRef}
        data-surface="powder"
        aria-labelledby="inside-clinic-heading"
        className="tt-section relative overflow-hidden bg-powder px-6 pb-20 pt-24 text-cobalt md:px-10 md:pb-28 md:pt-36"
      >
        <div className="mx-auto max-w-[1320px]">
          <SectionMarker label={meta.label} />
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <h1
              id="inside-clinic-heading"
              data-reveal
              className="max-w-[15ch] font-display text-[clamp(2.4rem,10vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
            >
              A room that explains itself <Circled tone="cobalt">before</Circled> we do
            </h1>
            <Disclosure />
          </div>

          {/* Each concept's `className` in content/clinic.ts carries its place
              in the spread: two over one on a tablet, 7 + 5 over 12 on desktop. */}
          <ul aria-label="Concept visuals of the clinic" className="mt-10 grid list-none gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            {CLINIC_CONCEPTS.map((concept, index) => (
              <li key={concept.id} className={concept.className}>
                <BrandImage
                  webp={`/images/${concept.image.stem}.webp`}
                  webpSrcSet={conceptSrcSet(concept.image.stem)}
                  sizes={index === 2 ? GALLERY_WIDE_SIZES : GALLERY_SIZES}
                  png={`/images/${concept.image.stem}.png`}
                  alt={concept.image.alt}
                  width={concept.image.width}
                  height={concept.image.height}
                  title={{ ...concept.title, href: '/book/' }}
                  eager={index === 0}
                  className="h-full w-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SmileEdge from="powder" />

      <section
        ref={visionRef}
        data-surface="canary"
        aria-labelledby="clinic-vision-heading"
        className="tt-section relative overflow-hidden bg-canary px-6 pb-20 pt-20 text-cobalt md:px-10 md:pb-28 md:pt-28"
      >
        {/* The heading runs the full width on desktop: the mixed-weight label
            keeps "around comfort" together, so in a half column it stranded
            "Built" on a line of its own. */}
        <div className="relative mx-auto max-w-[1320px]">
          <h2
            id="clinic-vision-heading"
            data-reveal
            className="max-w-[16ch] text-balance font-display text-[clamp(2.4rem,10vw,4.5rem)] leading-[1.02] tracking-[-0.025em] lg:max-w-none"
          >
            <MixedWeightLabel display lead={CLINIC_VISION.heading.lead} rest={CLINIC_VISION.heading.rest} />
          </h2>
        </div>

        <div className="relative mx-auto mt-6 grid max-w-[1320px] gap-12 lg:mt-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            {/* Client-supplied, complete and verbatim (content/clinic.ts). */}
            <div className="flex flex-col gap-5">
              {CLINIC_VISION.paragraphs.map((para) => (
                <p key={para.slice(0, 24)} data-reveal="fast" className="max-w-[54ch] font-sans text-[1.05rem] leading-[1.65] md:text-[1.15rem]">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div>
            <ul aria-label="In the clinic" className="grid max-w-[36rem] list-none grid-cols-2 gap-x-4 gap-y-9">
              {CLINIC_AMENITIES.map((amenity, index) => {
                const disc = DISCS[index % DISCS.length] ?? 'cobalt'
                return (
                  <li key={amenity.label} className="flex flex-col items-center gap-3 text-center">
                    <span
                      className="grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full md:h-28 md:w-28"
                      style={{ background: colourVar(disc) }}
                    >
                      <Doodle
                        name={amenity.glyph}
                        tone={disc === 'powder' ? 'cobalt' : 'canary'}
                        drawOnScroll
                        tap
                        className="w-[52%]"
                      />
                    </span>
                    <span className="max-w-[14ch] font-display text-[1.15rem] leading-snug">{amenity.label}</span>
                  </li>
                )
              })}
            </ul>
            <a href="/laughing-gas/" className="mt-10 inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
              <span className="underline decoration-2 underline-offset-[6px]">Laughing gas, explained</span>
              <span className="block w-5" aria-hidden="true">
                <Doodle name="markArrow" tone="cobalt" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <SmileEdge from="canary" />
      <BookingClose />
    </>
  )
}
