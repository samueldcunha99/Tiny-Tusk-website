import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionMarker } from '@/components/SectionMarker'
import { TextPanel } from '@/components/TextPanel'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { CLINIC_ADDRESS, CLINIC_PHONE, MAP_DIRECTIONS_HREF } from '@/content/site'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Book a visit, and where to find us -- coral.
 *
 * A band, not the form. `Booking.tsx` is ~880px of fields on a phone and it
 * already owns `/book`, reached from here, from the hero, from the nav pill
 * and from the footer. Inlining it meant almost nobody reached the bottom.
 *
 * IT ABSORBED "FIND US". They were two sections asking for the same screen: a
 * parent standing outside looking for the door and a parent deciding to book
 * want the same three facts -- where, what number, and how do I start. The
 * separate Find Us section, its concept photograph and its white address card
 * are gone; the address is now plain text under the action it belongs to.
 *
 * WHAT ELSE WENT. The four `BOOKING_STEPS` pills. They were four more boxes
 * saying what the sentence above them already says, and the form itself shows
 * its own four-step rail the moment you arrive.
 *
 * WHY CORAL, AND HOW IT IS LEGAL. Coral is a full-strength field colour and it
 * cannot carry text at any size in any brand colour (CLAUDE.md 6.1; best
 * available is white at 2.99:1). So the copy is not on the coral -- it is on a
 * cobalt panel floating in it, via `<TextPanel>`, exactly as the Journey's
 * "Care" beat and the Laughing Gas CTA do. Inside that panel every pairing is
 * the usual one: canary heading 6.37:1, white body 7.97:1.
 *
 * The two buttons sit on the coral itself rather than inside the panel, and
 * that is not an exception: the CTA's label is on its own canary ellipse
 * (6.37:1) and WhatsApp's is on its green pill. Neither is text on coral. It
 * also stops the panel swallowing the whole section, so the coral actually
 * reads as the section's colour instead of a border.
 *
 * NO MAP EMBED. `MapEmbed` stays in the footer: a third-party iframe is the
 * most expensive thing on the page. "Get directions" hands the same query to
 * the visitor's own Maps app, which is what a phone user wanted anyway.
 *
 * Contact shows only what the client has verified -- the address and the phone
 * number. `MOCK_CONTACT` is deliberately not imported here.
 */
export function BookBandMobile() {
  const meta = useSectionMeta('book')

  return (
    <section
      id="book"
      data-surface="coral"
      className="tt-section relative overflow-hidden bg-coral px-5 pb-12 pt-[3.25rem]"
      aria-labelledby="book-band-heading"
    >
      {/* No LoopField here. The page allows itself two artwork fields (the
          hero and Dr. Nupur) and this section is already carrying the one
          full-strength colour on the page -- flat coral IS the moment. */}
      <TextPanel surface="coral" className="relative z-10">
        <SectionMarker label={meta.label} on="dark" />

        <h2
          id="book-band-heading"
          className="mt-4 font-display text-[clamp(2.25rem,10vw,2.75rem)] font-semibold leading-none tracking-[-0.025em] text-canary"
          data-animate
        >
          Ready when you are
        </h2>
        <p className="mt-3.5 max-w-[32ch] font-sans text-[0.97rem] leading-[1.55] text-white/90" data-animate>
          Four small questions, then a kind person calls you back.
        </p>

        {/* CLIENT-VERIFIED address -- do not strip in a sweep for unverified
            facts, and do not add a lat/lng the client did not supply. */}
        <address className="mt-6 font-sans text-[0.92rem] not-italic leading-[1.6] text-white/90">
          <span className="block font-semibold text-white">{CLINIC_ADDRESS.society}</span>
          <span className="block">{CLINIC_ADDRESS.unit}</span>
          <span className="block">
            {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
          </span>
          <span className="block">
            {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
          </span>
        </address>

        <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-1">
          <a
            href={CLINIC_PHONE.href}
            className="inline-flex min-h-11 items-center font-sans text-[0.95rem] font-semibold text-canary underline underline-offset-4"
          >
            {CLINIC_PHONE.display}
          </a>
          <a
            href={MAP_DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-sans text-[0.95rem] font-semibold text-canary underline underline-offset-4"
          >
            Get directions
          </a>
        </div>

        <p className="mt-2 font-sans text-[0.8rem] leading-[1.55] text-white/80">
          Email and opening hours will appear here once they have been confirmed by the clinic.
        </p>
      </TextPanel>

      {/* One row, equal halves, equal height. `basis-0 grow` rather than
          `w-1/2` so the two are the same width whatever their labels measure,
          and `items-stretch` matches their heights without pinning a number
          to either shape.
          `flex-wrap` with a 10.25rem floor is the escape hatch: below about
          375px the pair cannot fit without overflowing the page, and there
          they stack instead. WhatsApp is shortened to fit -- "Chat on
          WhatsApp" is ~194px of nowrap label, wider on its own than half this
          row. */}
      <div className="relative z-10 mt-5 flex flex-wrap items-stretch gap-3">
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
