import { useRef, type ReactNode } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { useSectionMeta } from '@/content/sectionOrder'
import { CLINIC_PHONE } from '@/content/site'
import { useReveal } from '@/lib/motion'

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
 * The home page ends on it, and so do the standalone pages that have no close
 * of their own, so every route runs into the footer the same way. The default
 * line is the booking page's own ("a kind person will call") -- nothing here
 * promises a process the clinic has not described. A page with its own closing
 * words passes them in.
 */
export function BookingClose({
  heading = (
    <>
      Ready for their <span className="text-canary">first visit?</span>
    </>
  ),
  line = 'A few details now; a kind person will call to make the rest simple.',
}: {
  heading?: ReactNode | undefined
  line?: string | undefined
}) {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('book')
  useReveal(ref)

  return (
    <section
      id="book"
      ref={ref}
      data-surface="cobalt"
      aria-labelledby="book-close-heading"
      className="tt-section relative overflow-hidden bg-cobalt px-6 pb-6 pt-20 text-white md:px-10 md:pb-10 md:pt-28"
    >
      {/* Desktop only: on a phone the copy spans the width, and a loop behind
          it would cross the words. On a tablet too -- at 768px the heading is
          still wide enough to run into it. */}
      <Doodle
        name="loopStroke"
        tone="canary"
        drawOnScroll
        duration={2}
        className="pointer-events-none absolute -right-[8%] top-[14%] hidden w-[42%] max-w-none lg:block"
      />

      <div className="relative mx-auto max-w-[1320px]">
        <SectionMarker label={meta.label} on="dark" />
        <div className="relative mt-5 w-fit pr-12">
          <h2
            id="book-close-heading"
            data-reveal
            className="max-w-[11ch] font-display text-[clamp(2.9rem,12.5vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
          >
            {heading}
          </h2>
          <span className="absolute right-0 top-0 block w-10 md:w-14" aria-hidden="true">
            <Doodle name="markDashes" tone="canary" drawOnScroll />
          </span>
        </div>
        <p data-reveal="fast" className="mt-5 max-w-[34ch] font-sans text-[1.1rem] leading-[1.6] md:text-[1.25rem]">
          {line}
        </p>
        <div className="-m-4 mt-5 flex flex-col items-start gap-2 p-4 md:flex-row md:items-center md:gap-10">
          <StylisedCTA lead="Request" rest="an appointment" href="/book/" fill="canary" size="lg" />
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
