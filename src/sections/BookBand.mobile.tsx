import { Logo } from '@/components/Logo'
import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionMarker } from '@/components/SectionMarker'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { CLINIC, CLINIC_ADDRESS, CLINIC_PHONE, MAP_DIRECTIONS_HREF } from '@/content/site'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Book a visit, and where to find us -- paper surface.
 *
 * Sits naturally between Parent Voices (powder) and Footer (cobalt)
 * without an awkward full-bleed orange-on-blue box collision.
 */
export function BookBandMobile() {
  const meta = useSectionMeta('book')

  return (
    <section
      id="book"
      data-surface="paper"
      className="tt-section relative overflow-hidden bg-paper px-6 py-12"
      aria-labelledby="book-band-heading"
    >
      <SectionMarker label={meta.label} />

      <h2
        id="book-band-heading"
        className="mt-4 font-display text-[clamp(2.25rem,10vw,2.75rem)] font-semibold leading-none tracking-[-0.025em] text-cobalt"
        data-animate
      >
        Ready when you are
      </h2>
      <p className="mt-3.5 max-w-[34ch] font-sans text-[0.97rem] leading-[1.55] text-cobalt/80" data-animate>
        Four small questions, then a kind person calls you back.
      </p>

      {/* Clean White Card for Clinic Address & Contact Details */}
      <div className="mt-6 rounded-[1.5rem] bg-white p-6 shadow-sm ring-1 ring-black/[0.04]">
        {/* The real mark, not a doodle: this card is the clinic's address, so
            it carries the identity rather than a drawing that resembles it.
            64px is p7's minimum digital size and the guard's floor. */}
        <Logo size={64} tone="cobalt" title={`${CLINIC.name} logo`} className="mb-3" />

        <address className="font-sans text-[0.92rem] not-italic leading-[1.6] text-cobalt">
          <span className="block font-semibold text-cobalt">{CLINIC_ADDRESS.society}</span>
          <span className="block">{CLINIC_ADDRESS.unit}</span>
          <span className="block">
            {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
          </span>
          <span className="block">
            {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
          </span>
        </address>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
          <a
            href={CLINIC_PHONE.href}
            className="inline-flex min-h-11 items-center font-sans text-[0.95rem] font-semibold text-cobalt underline underline-offset-4"
          >
            {CLINIC_PHONE.display}
          </a>
          <a
            href={MAP_DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-sans text-[0.95rem] font-semibold text-cobalt underline underline-offset-4"
          >
            Get directions
          </a>
        </div>

        <p className="mt-3 font-sans text-[0.8rem] leading-[1.55] text-cobalt/60">
          Email and opening hours will appear here once they have been confirmed by the clinic.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-6 flex flex-wrap items-stretch gap-3">
        <StylisedCTA
          lead="Book"
          rest="a visit"
          href="/book"
          fill="canary"
          className="min-h-[3.5rem] min-w-[10.25rem] shrink grow basis-0"
        />
        <WhatsAppButton
          variant="row"
          label="WhatsApp"
          className="min-h-[3.5rem] min-w-[10.25rem] shrink grow basis-0 justify-center"
        />
      </div>
    </section>
  )
}
