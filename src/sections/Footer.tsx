import { MapEmbed } from '@/components/MapEmbed'
import { Roundel } from '@/components/Roundel'
import { StylisedCTA } from '@/components/StylisedCTA'
import { Wordmark } from '@/components/Logo'
import { CLINIC, CLINIC_ADDRESS, CLINIC_PHONE, MAP_DIRECTIONS_HREF, SECTIONS } from '@/content/site'

const SECTION_ROUTES: Record<string, string> = {
  journey: '/journey', team: '/dr-nupur', services: '/services', clinic: '/inside-clinic',
  'brush-timer': '/games', parents: '/parents-corner', voices: '/#voices', faq: '/faq', book: '/book',
}

/**
 * Footer -- cobalt. It opens with the tagline running as a slow ribbon, the
 * guide's repeated lockup (p15), on a `cobalt-80` band (restored on request
 * after the 2026-09-23 redesign dropped it), and ends where the guide ends
 * (p36): on the tagline roundel.
 *
 * Contact shows only what the client has verified -- the address and the phone
 * -- and says plainly that email and hours are to follow. `MOCK_CONTACT` is
 * deliberately not imported here.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-cobalt text-white" data-surface="cobalt">
      {/* Two identical halves: the track slides by exactly one half, so the
          loop never jumps. 90s keeps it to an unhurried ~25px a second.
          Decorative -- the roundel carries the tagline for assistive tech --
          and it stands still under reduced motion. */}
      <div aria-hidden="true" className="overflow-hidden border-b border-white/15 bg-cobalt-80 py-3.5">
        <div className="tt-marquee-track flex w-max [animation-duration:90s]">
          {[0, 1].map((half) => (
            <div
              key={half}
              className="flex flex-none gap-9 pr-9 font-display text-[1.05rem] uppercase tracking-[0.14em] text-canary [white-space:nowrap]"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="flex gap-9">
                  <span>{CLINIC.tagline} •</span>
                  <span>{CLINIC.fullName} •</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-6 pb-10 pt-8 md:grid-cols-2 md:gap-12 md:px-10 md:pt-14 lg:grid-cols-3">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Roundel
            tone="canary"
            title={`${CLINIC.fullName}: ${CLINIC.tagline}`}
            className="aspect-square w-40 md:w-44"
          />
          <Wordmark tone="canary" width={180} className="mt-7" />
          <p className="mt-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-white">
            {CLINIC.tag}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <h2 className="font-display text-[1.6rem] text-canary">Come say hi!</h2>
          <address className="max-w-[34ch] font-sans text-[0.95rem] not-italic leading-[1.65] text-white/90">
            <span className="block font-semibold text-white">{CLINIC_ADDRESS.society}</span>
            <span className="block">{CLINIC_ADDRESS.unit}</span>
            <span className="block">
              {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
            </span>
            <span className="block">
              {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
            </span>
            <span className="mt-2.5 block text-white/75">{CLINIC_ADDRESS.landmark}</span>
          </address>
          <a
            href={CLINIC_PHONE.href}
            className="inline-flex min-h-11 items-center font-sans text-[1.05rem] font-semibold text-canary underline decoration-2 underline-offset-[6px]"
          >
            {CLINIC_PHONE.display}
          </a>
          <p className="max-w-[34ch] font-sans text-[0.9rem] leading-relaxed text-white/80">
            Email and opening hours will appear here once they have been confirmed by the clinic.
          </p>
          <div className="-m-4 p-4">
            <StylisedCTA lead="Book" rest="a visit" href="/book" fill="canary" />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 text-center md:col-span-2 md:items-start md:text-left lg:col-span-1">
          <h2 className="font-display text-[1.6rem] text-canary">Finding Tiny Tusk</h2>
          {/* `w-full` is load-bearing: the iframe inside is absolutely
              positioned, so an auto-width wrapper would collapse. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
            <MapEmbed className="absolute inset-0 h-full w-full border-0" />
          </div>
          <a
            href={MAP_DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-sans text-[1rem] font-semibold text-canary underline decoration-2 underline-offset-[6px]"
          >
            Get directions
          </a>
        </div>
      </div>

      {/* `pb-28` on a phone keeps the last line clear of the WhatsApp disc. */}
      <div className="mx-auto max-w-[1440px] px-6 pb-28 md:px-10 md:pb-8">
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-6 border-t border-white/20 pt-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-8"
        >
          {SECTIONS.filter((s) => s.id !== 'hero').map((section) => (
            <a
              key={section.id}
              href={SECTION_ROUTES[section.id] ?? '/'}
              className="inline-flex min-h-11 items-center font-sans text-[0.92rem] font-semibold text-white"
            >
              {section.label}
            </a>
          ))}
          <a href="/laughing-gas" className="inline-flex min-h-11 items-center font-sans text-[0.92rem] font-semibold text-white">
            Laughing Gas
          </a>
        </nav>
        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/20 pt-5 text-center font-sans text-[0.8rem] text-white/70">
          <p>
            © {year} {CLINIC.fullName}. All rights reserved.
          </p>
          <p>Concept visuals and photography pending client clearance.</p>
        </div>
      </div>
    </footer>
  )
}
