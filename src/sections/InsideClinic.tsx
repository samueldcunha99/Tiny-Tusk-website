import { BrandImage } from '@/components/BrandImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { Circled } from '@/components/Circled'
import { SectionNumber } from '@/components/SectionNumber'
import { CLINIC_CONCEPTS } from '@/content/clinic'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * 04 Inside the Clinic -- paper.
 *
 * Was a one-at-a-time picker: three buttons above a single tile, so seeing all
 * three concepts took two clicks and the `className` grid weights already in
 * `content/clinic.ts` (7 / 5 / 12) went unused. All three now render at those
 * weights, each with the guide's full p32 tile treatment from `BrandImage`.
 *
 * The surface also moves powder -> paper: this section sits between two paper
 * sections in the running order, and three powder-backed tiles on powder left
 * the images with no edge of their own.
 */
export function InsideClinic({ asPage = false }: { asPage?: boolean | undefined }) {
  const meta = useSectionMeta('clinic')
  const Heading = asPage ? 'h1' : 'h2'

  return (
    <section
      id="inside-clinic"
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      aria-labelledby="inside-clinic-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <Heading
            id="inside-clinic-heading"
            className="max-w-[22ch] font-display text-h1 text-cobalt"
          >
            A room that explains itself <Circled tone="cobalt">before</Circled> we do
          </Heading>

          <p className="max-w-[38ch] rounded-[1.25rem] bg-cobalt-20 px-5 py-3.5 font-sans text-sm leading-relaxed text-cobalt">
            These are concept visuals of the space being built, not photographs of the finished
            clinic.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          {CLINIC_CONCEPTS.map((concept, index) => (
            <BrandImage
              key={concept.id}
              webp={`/images/${concept.image.stem}.webp`}
              png={`/images/${concept.image.stem}.png`}
              alt={concept.image.alt}
              width={concept.image.width}
              height={concept.image.height}
              title={{ ...concept.title, href: '/book' }}
              logoTone={concept.image.logoTone}
              doodle={concept.image.doodle}
              doodleTone={concept.image.doodleTone}
              eager={index === 0}
              className={concept.className}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
