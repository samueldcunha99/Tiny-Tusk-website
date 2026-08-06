import { Logo } from '@/components/Logo'
import { MapEmbed } from '@/components/MapEmbed'
import { TextOnPath } from '@/components/TextOnPath'
import { CLINIC, CLINIC_ADDRESS, MAP_DIRECTIONS_HREF, SECTIONS } from '@/content/site'

/**
 * Footer -- cobalt.
 *
 * The tagline roundel with the mark inside it becomes the footer's centrepiece,
 * and the tagline marquee runs on a `cobalt-80` band above it so the two ways
 * the guide sets the tagline (roundel, p14; repeated lockup, p15) both appear.
 *
 * Contact still shows only what the client has verified: the address, and a
 * plain line saying phone, email and hours are to follow. `MOCK_CONTACT` is
 * deliberately not imported here.
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

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pb-8 pt-12 md:grid-cols-3 md:px-10 md:pt-20">
        <div>
          <div className="relative grid w-[clamp(8.75rem,14vw,11.25rem)] place-items-center">
            <TextOnPath
              text={CLINIC.tagline}
              mode="roundel"
              tone="canary"
              className="absolute inset-0 h-full w-full"
            />
            <Logo variant="mark" tone="canary" size={72} />
          </div>
          <h2 className="mt-6 font-display text-h2 text-canary">{CLINIC.fullName}</h2>
          <p className="mt-3.5 max-w-[34ch] font-sans text-[0.92rem] leading-relaxed text-white/80">
            Kind, gentle, and patient pediatric dental care designed to make every visit comfortable
            for growing smiles.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl text-canary">Plan a visit</h3>
          <address className="max-w-[34ch] font-sans text-[0.92rem] not-italic leading-[1.7] text-white/90">
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
          <p className="max-w-[34ch] font-sans text-[0.9rem] leading-relaxed text-white/90">
            Phone, email and opening hours will appear here once they have been confirmed by the
            clinic.
          </p>
          <a
            href="/book"
            className="inline-flex min-h-12 w-fit items-center rounded-full bg-canary px-6 font-sans font-semibold text-cobalt"
          >
            Start an appointment request
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl text-canary">Finding Tiny Tusk</h3>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.625rem] border-2 border-powder/30">
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

      <div className="mx-auto max-w-[1440px] px-6 pb-8 md:px-10">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 border-t border-white/15 pt-2.5">
          {SECTIONS.filter((s) => s.id !== 'hero' && s.id !== 'paths').map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="inline-flex min-h-11 items-center font-sans text-[0.9rem] font-semibold text-canary"
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap justify-between gap-4 border-t border-white/15 pt-5 font-sans text-[0.78rem] text-white/60">
          <p>© {year} {CLINIC.fullName}. All rights reserved.</p>
          <p>Concept visuals and photography pending client clearance.</p>
        </div>
      </div>
    </footer>
  )
}
