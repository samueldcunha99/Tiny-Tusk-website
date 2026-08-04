import { Logo } from '@/components/Logo'
import { TextOnPath } from '@/components/TextOnPath'
import {
  CLINIC,
  CLINIC_ADDRESS,
  MAP_DIRECTIONS_HREF,
  MAP_EMBED_SRC,
  MOCK_CONTACT,
} from '@/content/site'

export function Footer() {
  const showDevelopmentMock = import.meta.env.DEV
  const quickLinks = [
    { label: 'How a visit goes', href: '/journey' },
    { label: 'Services', href: '/services' },
    { label: 'Inside clinic', href: '/inside-clinic' },
    { label: 'Games for Kids', href: '/games' },
    { label: "Parents' Corner", href: '/parents-corner' },
    { label: 'Questions', href: '/faq' },
    { label: 'Book a visit', href: '/book' },
  ] as const

  return (
    <footer
      className="tt-section relative overflow-hidden bg-cobalt text-white"
      data-surface="cobalt"
    >
      <div className="border-b border-white/15 bg-cobalt-80 py-4" aria-hidden="true">
        <div className="flex w-max animate-marquee gap-8 font-display text-lg tracking-wider text-canary">
          <span>{CLINIC.tagline.toUpperCase()} • </span>
          <span>{CLINIC.fullName.toUpperCase()} • </span>
          <span>{CLINIC.tagline.toUpperCase()} • </span>
          <span>{CLINIC.fullName.toUpperCase()} • </span>
          <span>{CLINIC.tagline.toUpperCase()} • </span>
          <span>{CLINIC.fullName.toUpperCase()} • </span>
        </div>
      </div>

      {/* Mobile carries a tighter version of the same footer: the phone home
          page is ~3 screens now, and an 0.85-screen footer under it undoes a
          chunk of that. Desktop values are unchanged behind `md:`. */}
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative mb-4 flex h-28 w-28 items-center justify-center md:mb-5 md:h-36 md:w-36">
              <TextOnPath
                mode="roundel"
                text={CLINIC.tagline}
                tone="canary"
                className="absolute inset-0 h-full w-full"
              />
              <Logo
                variant="mark"
                tone="canary"
                size={80}
                title={`${CLINIC.name} logo`}
              />
            </div>
            <h2 className="font-display text-h2 text-canary">{CLINIC.fullName}</h2>
            {/* Desktop only. The roundel directly above already reads "Gentle
                Care for Growing Smiles", so on a phone this paragraph is the
                same promise twice and ~90px of a footer that is the tallest
                block on the page. */}
            <p className="mt-3 hidden max-w-sm font-sans text-sm leading-relaxed text-white/80 md:block">
              Kind, gentle, and patient pediatric dental care designed to make
              every visit comfortable for growing smiles.
            </p>
          </div>

          {/* The address is client-verified and ships. Phone, email and hours
              are still unconfirmed, so they stay behind the dev flag and its
              label -- the label now covers only what is actually mock. */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xl font-semibold text-canary">
              Plan a visit
            </h3>
            <address className="max-w-sm font-sans text-sm not-italic leading-relaxed text-white/90">
              <p className="font-semibold text-white">{CLINIC_ADDRESS.society}</p>
              <p>{CLINIC_ADDRESS.unit}</p>
              <p>
                {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
              </p>
              <p>
                {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
              </p>
              <p className="mt-2 text-white/70">{CLINIC_ADDRESS.landmark}</p>
            </address>
            {showDevelopmentMock ? (
              <div className="font-sans text-sm leading-relaxed text-white/90">
                <p className="mb-3 w-fit rounded-full border border-canary px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-canary">
                  Development sample — phone, email and hours only
                </p>
                <p>{MOCK_CONTACT.phone}</p>
                <p>{MOCK_CONTACT.email}</p>
                <ul className="mt-4 space-y-1.5 border-t border-white/15 pt-4 text-xs">
                  {MOCK_CONTACT.hours.map((hours) => (
                    <li key={hours.days} className="flex justify-between gap-4">
                      <span>{hours.days}</span>
                      <span className="text-white">{hours.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="max-w-sm font-sans text-sm leading-relaxed text-white/90">
                Phone, email and opening hours will appear here once they have
                been confirmed by the clinic.
              </p>
            )}
            <a
              href="/book"
              className="mt-3 inline-flex min-h-11 w-fit items-center rounded-full bg-canary px-5 font-sans font-semibold text-cobalt"
            >
              Start an appointment request
            </a>
          </div>

          {/* Real map now that the address is confirmed. Keyless Google embed:
              no API key, no billing account, and no map dependency to carry. */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xl font-semibold text-canary">
              Finding Tiny Tusk
            </h3>
            <div className="relative h-[160px] overflow-hidden rounded-2xl border-2 border-powder/30 md:aspect-[4/3] md:h-auto">
              <iframe
                src={MAP_EMBED_SRC}
                title={`Map showing ${CLINIC.fullName} in ${CLINIC_ADDRESS.locality}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            {/* The embed is not keyboard-friendly and can be blocked by
                tracking protection, so the address is always reachable as a
                plain link too. */}
            <a
              href={MAP_DIRECTIONS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-fit items-center rounded-full border border-canary px-5 font-sans text-sm font-semibold text-canary"
            >
              Get directions
              <span className="sr-only"> to {CLINIC.fullName} (opens Google Maps in a new tab)</span>
            </a>
          </div>
        </div>

        {/* `min-h-11` on the rows, not `gap-y`: as bare inline text these were
            20px tall, which is a miss on a phone however wide the label is. The
            appointment link above already sets the same floor. */}
        <nav
          className="mt-8 flex flex-wrap justify-center gap-x-6 border-t border-white/15 pt-4 lg:justify-start"
          aria-label="Footer"
        >
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center font-sans text-sm font-semibold text-canary underline decoration-transparent underline-offset-4 transition-colors hover:decoration-canary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 text-center font-sans text-xs text-white/60 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} {CLINIC.fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
