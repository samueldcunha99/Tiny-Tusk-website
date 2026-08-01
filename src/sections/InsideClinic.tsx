import { useState } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { CLINIC_CONCEPTS } from '@/content/clinic'
import { useSectionMeta } from '@/content/sectionOrder'

export function InsideClinic({ asPage = false }: { asPage?: boolean | undefined }) {
  const [selectedId, setSelectedId] =
    useState<(typeof CLINIC_CONCEPTS)[number]['id']>(
      CLINIC_CONCEPTS[0]!.id,
    )
  const meta = useSectionMeta('clinic')
  const Heading = asPage ? 'h1' : 'h2'
  const selected =
    CLINIC_CONCEPTS.find((concept) => concept.id === selectedId) ??
    CLINIC_CONCEPTS[0]!

  return (
    <section
      id="inside-clinic"
      className={[
        'tt-section relative bg-powder px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      data-surface="powder"
      aria-labelledby="inside-clinic-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
            <Heading
              id="inside-clinic-heading"
              className="mt-4 max-w-4xl font-display text-h1 text-cobalt"
            >
              A first look <Circled tone="cobalt">inside</Circled>
            </Heading>
            <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
              Calm spaces, friendly shapes, and room for families to settle in
              at their own pace.
            </p>
          </div>

          <p className="w-fit rounded-full border-2 border-cobalt px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-cobalt">
            Concept imagery
          </p>
        </div>

        <div
          className="mt-10 grid gap-3 md:grid-cols-3"
          aria-label="Choose a clinic space"
        >
          {CLINIC_CONCEPTS.map((concept) => (
            <button
              key={concept.id}
              type="button"
              aria-pressed={selected.id === concept.id}
              onClick={() => setSelectedId(concept.id)}
              className={[
                'flex min-h-20 items-center gap-4 rounded-2xl border-2 p-4 text-left transition-transform hover:-translate-y-1',
                selected.id === concept.id
                  ? 'border-cobalt bg-cobalt text-white'
                  : 'border-cobalt/15 bg-paper text-cobalt',
              ].join(' ')}
            >
              <Doodle
                name={concept.image.doodle}
                tone={selected.id === concept.id ? 'canary' : 'cobalt'}
                className="w-12 shrink-0"
              />
              <span className="font-display text-xl">
                {concept.title.lead} {concept.title.rest}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6" aria-live="polite">
          <BrandImage
            key={selected.id}
            webp={`/images/${selected.image.stem}.webp`}
            png={`/images/${selected.image.stem}.png`}
            alt={selected.image.alt}
            width={selected.image.width}
            height={selected.image.height}
            title={{ ...selected.title, href: '/book' }}
            logoTone={selected.image.logoTone}
            doodle={selected.image.doodle}
            doodleTone={selected.image.doodleTone}
            // A fixed height rather than an aspect ratio: 16/8 came out ~700px
            // tall at the 1400px cap and ate a whole desktop viewport. Note
            // `aspect-[…] max-h-[…]` does NOT work here -- with an auto width
            // the ratio re-derives the width from the clamped height, so the
            // tile shrinks sideways and leaves a gap. The image object-covers,
            // so height alone is safe to set.
            className="h-[clamp(220px,52svh,560px)] w-full"
          />
        </div>

        <p className="mt-5 max-w-measure font-sans text-sm leading-relaxed text-cobalt-80">
          These generated visuals show the intended atmosphere and brand
          direction. They are not photographs of the completed clinic.
        </p>
      </div>
    </section>
  )
}
