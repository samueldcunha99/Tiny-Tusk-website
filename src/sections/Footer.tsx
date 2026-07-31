import { Logo } from '@/components/Logo'
import { TextOnPath } from '@/components/TextOnPath'
import { CLINIC, MOCK_CONTACT } from '@/content/site'

export function Footer() {
  const showDevelopmentMock = import.meta.env.DEV
  const quickLinks = [
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

      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative mb-5 flex h-36 w-36 items-center justify-center">
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
            <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-white/80">
              Kind, gentle, and patient pediatric dental care designed to make
              every visit comfortable for growing smiles.
            </p>
          </div>

          {/* Contact facts remain absent until the clinic verifies them. */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xl font-semibold text-canary">
              Plan a visit
            </h3>
            {showDevelopmentMock ? (
              <div className="font-sans text-sm leading-relaxed text-white/90">
                <p className="mb-3 w-fit rounded-full border border-canary px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-canary">
                  Development sample — not clinic information
                </p>
                <p>{MOCK_CONTACT.address.street}</p>
                <p>
                  {MOCK_CONTACT.address.city}, {MOCK_CONTACT.address.postcode}
                </p>
                <p className="mt-2">{MOCK_CONTACT.phone}</p>
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
                Official contact details and opening hours will appear here
                once they have been confirmed by the clinic.
              </p>
            )}
            <a
              href="/book"
              className="mt-3 inline-flex min-h-11 w-fit items-center rounded-full bg-canary px-5 font-sans font-semibold text-cobalt"
            >
              Start an appointment request
            </a>
          </div>

          {/* Decorative placeholder retained without implying a real address. */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xl font-semibold text-canary">
              Finding Tiny Tusk
            </h3>
            <div className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border-2 border-powder/30 bg-powder/10 p-4">
              <svg
                viewBox="0 0 300 200"
                className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                aria-hidden="true"
              >
                <path
                  d="M 0 40 L 300 160 M 80 0 L 220 200 M 0 140 Q 150 100 300 150"
                  fill="none"
                  stroke="var(--tt-powder)"
                  strokeWidth="6"
                />
                <path
                  d="M 120 40 Q 180 120 240 180"
                  fill="none"
                  stroke="var(--tt-canary)"
                  strokeWidth="4"
                />
                <circle cx="160" cy="110" r="14" fill="var(--tt-coral)" />
                <circle cx="160" cy="110" r="6" fill="var(--tt-canary)" />
              </svg>

              <div className="relative z-10 self-end rounded-lg border border-canary/30 bg-cobalt/80 px-3 py-1.5 font-sans text-xs font-semibold text-canary backdrop-blur-sm">
                {showDevelopmentMock
                  ? 'Development map sample'
                  : 'Location pending confirmation'}
              </div>

              <div className="relative z-10 self-start rounded-xl bg-white p-3 text-cobalt shadow-lg">
                <p className="font-display text-sm font-bold">{CLINIC.name}</p>
                <p className="font-sans text-[11px] text-cobalt/80">
                  Pediatric Dental Clinic
                </p>
              </div>
            </div>
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
