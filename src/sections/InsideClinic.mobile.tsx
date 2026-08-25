import { BrandImage } from '@/components/BrandImage'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionMarker } from '@/components/SectionMarker'
import { CLINIC_AMENITIES, CLINIC_CONCEPTS, CLINIC_VISION } from '@/content/clinic'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Creative Mobile Inside the Clinic -- paper ground.
 *
 * Designed for mobile:
 * 1. All three concept visuals stacked, with brand doodle overlays.
 * 2. Vision statement and 6 scannable amenity chips with animated doodles.
 *
 * The three room tabs are gone at the client's request. Each tile already
 * carries its own title ellipse ("A warm welcome", "Calm care spaces",
 * "Learn together"), so the pills were repeating the picture underneath --
 * and stacking them means no room is behind a tap.
 */
export function InsideClinicMobile({ asPage = false }: { asPage?: boolean | undefined }) {
  const meta = useSectionMeta('clinic')
  const Heading = asPage ? 'h1' : 'h2'

  return (
    <section
      id="inside-clinic"
      className="tt-section relative bg-paper px-6 py-12"
      aria-labelledby="clinic-mobile-heading"
    >
      <SectionMarker label={meta.label} />

      <Heading
        id="clinic-mobile-heading"
        className="mt-4 font-display text-[clamp(2rem,8.7vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-cobalt"
        data-animate
      >
        A room that explains itself <Circled>before</Circled> we do
      </Heading>

      <p className="mt-3 rounded-[1rem] bg-cobalt-20/80 px-4 py-2.5 font-sans text-xs leading-relaxed text-cobalt">
        Concept visuals of the space being built, not photographs of the finished clinic.
      </p>

      {/* Concept visuals, all three, in order. */}
      <div className="mt-7 flex flex-col gap-4">
        {CLINIC_CONCEPTS.map((concept, index) => (
          <div key={concept.id} className="relative overflow-hidden rounded-[1.5rem] shadow-sm">
            <BrandImage
              webp={`/images/${concept.image.stem}.webp`}
              png={`/images/${concept.image.stem}.png`}
              alt={concept.image.alt}
              width={concept.image.width}
              height={concept.image.height}
              title={{ ...concept.title, href: '/book' }}
              logoTone={concept.image.logoTone}
              doodle={concept.image.doodle}
              doodleTone={concept.image.doodleTone}
              className="aspect-[4/3] w-full"
              {...(index === 0 ? { eager: true } : {})}
            />
          </div>
        ))}
      </div>

      {/* Vision & Amenities */}
      <div className="mt-9">
        <h3 className="font-display text-xl font-semibold leading-snug text-cobalt">
          <MixedWeightLabel
            display
            lead={CLINIC_VISION.heading.lead}
            rest={CLINIC_VISION.heading.rest}
          />
        </h3>

        <div className="mt-3 flex flex-col gap-3">
          {CLINIC_VISION.paragraphs.slice(0, 2).map((para) => (
            <p key={para.slice(0, 24)} className="font-sans text-[0.92rem] leading-relaxed text-cobalt">
              {para}
            </p>
          ))}
        </div>

        {/* 6 Amenities as scannable cards */}
        <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {CLINIC_AMENITIES.map((amenity) => (
            <li
              key={amenity.label}
              className="flex items-center gap-3 rounded-[1rem] bg-white p-3.5 shadow-sm ring-1 ring-black/[0.04]"
            >
              <Doodle
                name={amenity.glyph}
                tone="cobalt"
                drawOnScroll
                className="w-7 shrink-0"
              />
              <span className="font-display text-sm font-medium leading-snug text-cobalt">
                {amenity.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
