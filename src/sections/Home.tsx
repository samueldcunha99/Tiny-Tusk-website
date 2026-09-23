import { useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { SmileEdge } from '@/components/SmileEdge'
import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionOrder, useSectionMeta } from '@/content/sectionOrder'
import { CLINIC_PHONE, type SectionId } from '@/content/site'
import { useReveal } from '@/lib/motion'
import { Hero } from './Hero'
import { Team } from './Team'
import { Journey } from './Journey'
import { InsideClinic } from './InsideClinic'
import { Services } from './Services'
import { Testimonials } from './Testimonials'
import { ParentsCorner } from './ParentsCorner'
import { Faq } from './Faq'
import { BrushTimer } from './BrushTimer'

const HOME_ORDER: readonly SectionId[] = [
  'hero',
  'team',
  'journey',
  'clinic',
  'services',
  'voices',
  'parents',
  'faq',
  'brush-timer',
  'book',
]

/**
 * Book a visit -- cobalt, flowing straight into the cobalt footer, so its
 * bottom padding is small: the two are one surface, and a full section gap
 * between them read as an empty band.
 *
 * The guide's p4 chapter page: cobalt and one giant loop -- canary here, the
 * p24 pairing, so the close carries colour rather than only blue and white. It
 * sits wholly inside the section, clear of the copy: a loop clipped by the
 * section edge reads as a cut against the cobalt footer below.
 *
 * The line under the heading is the booking page's own ("a kind person will
 * call") -- nothing here promises a process the clinic has not described.
 */
function HomeBooking() {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('book')
  useReveal(ref)

  return (
    <section
      id="book"
      ref={ref}
      data-surface="cobalt"
      aria-labelledby="home-book-heading"
      className="tt-section relative overflow-hidden bg-cobalt px-6 pb-6 pt-20 text-white md:px-10 md:pb-10 md:pt-28"
    >
      {/* Desktop only: on a phone the copy spans the width, and a loop behind
          it would cross the words. */}
      <Doodle
        name="loopStroke"
        tone="canary"
        drawOnScroll
        duration={2}
        className="pointer-events-none absolute -right-[8%] top-[14%] hidden w-[38%] max-w-none md:block lg:w-[42%]"
      />

      <div className="relative mx-auto max-w-[1320px]">
        <SectionMarker label={meta.label} on="dark" />
        <div className="relative mt-5 w-fit pr-12">
          <h2
            id="home-book-heading"
            data-reveal
            className="max-w-[11ch] font-display text-[clamp(2.9rem,12.5vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
          >
            Ready for their <span className="text-canary">first visit?</span>
          </h2>
          <span className="absolute right-0 top-0 block w-10 md:w-14" aria-hidden="true">
            <Doodle name="markDashes" tone="canary" drawOnScroll />
          </span>
        </div>
        <p data-reveal="fast" className="mt-5 max-w-[34ch] font-sans text-[1.1rem] leading-[1.6] md:text-[1.25rem]">
          A few details now; a kind person will call to make the rest simple.
        </p>
        <div className="-m-4 mt-5 flex flex-col items-start gap-2 p-4 md:flex-row md:items-center md:gap-10">
          <StylisedCTA lead="Request" rest="an appointment" href="/book" fill="canary" size="lg" />
          <a
            href={CLINIC_PHONE.href}
            className="inline-flex min-h-11 items-center font-sans text-[1rem] font-semibold text-canary underline decoration-2 underline-offset-[6px]"
          >
            Or call {CLINIC_PHONE.display}
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * The home page: powder is the ground, and the other three colours are chapter
 * plates set into it -- the way the guide slots its full-colour chapter pages
 * (cobalt "The Logo", canary "More Assets", coral "Colours") between its
 * reading pages.
 *
 *   powder  -- welcome
 *   canary  -- Dr. Nupur (her portrait badge)
 *   cobalt  -- how a visit goes (the logo's own story)
 *   powder  -- inside the clinic
 *   canary  -- what we look after (the drawings on colour discs)
 *   cobalt  -- parent voices
 *   powder  -- Parents' Corner (speech bubbles), questions
 *   coral   -- the brushing game
 *   cobalt  -- book a visit, then the footer
 *
 * No paper: the user asked for more colour. No two chapters of one colour
 * touch -- welcome and Dr. Nupur on one powder field read as "one long page
 * box", and three canary chapters in a row read as "too much yellow" -- so the
 * two canary plates have two chapters between them. Each change of colour is the
 * tagline unit's smile rather than a hard edge, and no artwork crosses a
 * section's top or bottom edge -- a loop cut by a straight line is a glitch.
 */
export function Home() {
  return (
    <SectionOrder ids={HOME_ORDER}>
      <Hero />
      <SmileEdge from="powder" />
      <Team />
      <SmileEdge from="canary" />
      <Journey />
      <SmileEdge from="cobalt" />
      <InsideClinic />
      <SmileEdge from="powder" />
      <Services />
      <SmileEdge from="canary" />
      <Testimonials />
      <SmileEdge from="cobalt" />
      <ParentsCorner />
      <Faq />
      <SmileEdge from="powder" />
      <BrushTimer />
      <SmileEdge from="coral" />
      <HomeBooking />
    </SectionOrder>
  )
}
