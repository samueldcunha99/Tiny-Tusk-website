import { MapEmbed } from '@/components/MapEmbed'
import { Roundel } from '@/components/Roundel'
import { CLINIC, CLINIC_ADDRESS, CLINIC_PHONE, MAP_DIRECTIONS_HREF, SECTIONS } from '@/content/site'

/**
 * Footer -- cobalt.
 *
 * The tagline roundel with the mark inside it becomes the footer's centrepiece,
 * and the tagline marquee runs on a `cobalt-80` band above it so the two ways
 * the guide sets the tagline (roundel, p14; repeated lockup, p15) both appear.
 *
 * Contact still shows only what the client has verified: the address and the
 * phone number, and a plain line saying email and hours are to follow.
 * `MOCK_CONTACT` is deliberately not imported here.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-cobalt text-white" data-surface="cobalt">
      <div className="border-b border-white/15 bg-cobalt-80 py-3.5" aria-hidden="true">
        <div className="tt-marquee-track flex w-max gap-9 font-display text-[1.05rem] tracking-[0.14em] text-canary">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="flex gap-9">
              <span>{CLINIC.tagline.toUpperCase()} •</span>
              <span>{CLINIC.fullName.toUpperCase()} •</span>
            </span>
          ))}
        </div>
      </div>

      {/* One centred column on a phone, three left-aligned ones from `md`. The
          stacked columns were still set for a grid cell they no longer sat in:
          left-aligned against a centred lockup, and carrying the desktop gap. */}
      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 pb-8 pt-10 md:grid-cols-3 md:gap-12 md:px-10 md:pt-20">
        <div className="flex flex-col items-center text-center">
          <Roundel
            tone="canary"
            title={`${CLINIC.fullName}: ${CLINIC.tagline}`}
            className="aspect-square w-[clamp(9rem,15vw,13rem)]"
          />
          <h2 className="mt-5 font-display text-h2 text-canary md:mt-6">{CLINIC.fullName}</h2>
          <p className="mt-3 max-w-[34ch] font-sans text-[0.92rem] leading-relaxed text-white/80 md:mt-3.5">
            Kind, gentle, and patient pediatric dental care designed to make every visit comfortable
            for growing smiles.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3.5 text-center md:items-start md:gap-4 md:text-left">
          <h3 className="font-display text-xl text-canary">Plan a visit</h3>
          <address className="max-w-[34ch] font-sans text-[0.92rem] not-italic leading-[1.6] text-white/90 md:leading-[1.7]">
            <span className="block font-semibold text-white">{CLINIC_ADDRESS.society}</span>
            <span className="block">{CLINIC_ADDRESS.unit}</span>
            <span className="block">
              {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
            </span>
            <span className="block">
              {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
            </span>
            <span className="mt-2.5 block text-white/70">{CLINIC_ADDRESS.landmark}</span>
          </address>
          <a
            href={CLINIC_PHONE.href}
            className="inline-flex min-h-11 w-fit items-center font-sans text-[0.95rem] font-semibold text-canary underline underline-offset-4"
          >
            {CLINIC_PHONE.display}
          </a>
          <p className="max-w-[34ch] font-sans text-[0.9rem] leading-relaxed text-white/90">
            Email and opening hours will appear here once they have been confirmed by the clinic.
          </p>
          <a
            href="/book"
            className="inline-flex min-h-12 w-fit items-center rounded-full bg-canary px-6 font-sans font-semibold text-cobalt"
          >
            Start an appointment request
          </a>
        </div>

        <div className="flex flex-col items-center gap-3.5 text-center md:items-start md:gap-4 md:text-left">
          <h3 className="font-display text-xl text-canary">Finding Tiny Tusk</h3>
          {/* `w-full` is load-bearing now the column centres its children: the
              iframe inside is absolutely positioned, so an auto-width wrapper
              has nothing to take its width from and collapses. */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.625rem] border-2 border-powder/30">
            <MapEmbed className="absolute inset-0 h-full w-full border-0" />
          </div>
          <a
            href={MAP_DIRECTIONS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-fit items-center rounded-full border border-canary px-6 font-sans text-[0.9rem] font-semibold text-canary"
          >
            Get directions
          </a>
        </div>
      </div>

      {/* `pb-24` is clearance, not rhythm: the floating WhatsApp button is
          `fixed bottom-6` at 56px, so it comes to rest over the last 80px
          of the page. Without the padding it parks on the copyright row. */}
      <div className="mx-auto max-w-[1440px] px-6 pb-24 md:px-10">
        {/* Two 44px-row columns on a phone -- the flat wrapping row put four
            links on one line and three on the next, which read as a paragraph
            of links rather than an index. It is also what the deleted
            `ExploreMore` tiles were really doing. Unchanged from `sm` up. */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-6 border-t border-white/15 pt-2.5 sm:flex sm:flex-wrap"
        >
          {SECTIONS.filter((s) => s.id !== 'hero').map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex min-h-11 items-center font-sans text-[0.9rem] font-semibold text-canary"
            >
              {section.label}
            </a>
          ))}
          <a
            href="/laughing-gas"
            className="inline-flex min-h-11 items-center font-sans text-[0.9rem] font-semibold text-canary"
          >
            Laughing Gas
          </a>
        </nav>
        <div className="flex flex-wrap justify-center gap-4 border-t border-white/15 pt-5 text-center font-sans text-[0.78rem] text-white/60 md:justify-between md:text-left">
          <p>© {year} {CLINIC.fullName}. All rights reserved.</p>
          <p>Concept visuals and photography pending client clearance.</p>
        </div>
      </div>
    </footer>
  )
}
