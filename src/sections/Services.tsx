import { useEffect, useRef, useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { colourVar } from '@/components/BrandArtView'
import { TextPanel } from '@/components/TextPanel'
import { carriesText, type BrandColour } from '@/design/pairings'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { SERVICES, type Service } from '@/content/services'
import { useSectionMeta } from '@/content/sectionOrder'
import { TreatmentGrid } from '@/sections/TreatmentGrid'

/**
 * 03 Services -- paper.
 *
 * Redesign notes:
 *  - The grid weights in `content/services.ts` were already editorial (4+2 /
 *    2+2(tall) / 2+4) but every card was the same 300px block, so the rhythm
 *    never showed. The hero and wide cards now get their own type scale and
 *    the tall coral card carries the `cavities-stages` image under its copy
 *    panel, which is what makes the row resolve visually as well as on paper.
 *  - Emergency care lays its doodle beside the copy rather than above it, so
 *    the wide card does not read as a stretched regular card.
 *  - Coral still keeps its field and floats copy on cobalt via `TextPanel`.
 */
const SPAN_CLASS: Record<Service['span'], string> = {
  hero: 'md:col-span-4',
  wide: 'md:col-span-4',
  tall: 'md:col-span-2 md:row-span-2',
  regular: 'md:col-span-2',
}

const TITLE_CLASS: Record<Service['span'], string> = {
  hero: 'text-[clamp(1.9rem,3.4vw,2.9rem)]',
  wide: 'text-[clamp(1.5rem,2.4vw,2.1rem)]',
  tall: 'text-[clamp(1.4rem,2.2vw,1.9rem)]',
  regular: 'text-[clamp(1.4rem,2.2vw,1.9rem)]',
}

function ServiceCard({
  service,
  headingLevel = 'h3',
}: {
  service: Service
  headingLevel?: 'h2' | 'h3' | undefined
}) {
  const [hovered, setHovered] = useState(false)
  const reduced = usePrefersReducedMotion()
  const CardHeading = headingLevel

  const onPanel = !carriesText(service.surface)
  const textTone: BrandColour = onPanel ? 'canary' : service.element
  const wide = service.span === 'wide'

  return (
    <article
      data-card
      data-surface={service.surface}
      className={[
        'group relative flex min-h-[300px] overflow-hidden rounded-[2rem] p-8',
        'transition-transform duration-500 ease-entrance hover:-translate-y-2 focus-within:-translate-y-2',
        wide ? 'flex-wrap items-center gap-8' : 'flex-col justify-between',
        SPAN_CLASS[service.span],
      ].join(' ')}
      style={{
        background: colourVar(service.surface),
        ...(service.surface === 'paper'
          ? { boxShadow: `inset 0 0 0 2px ${colourVar('powder')}` }
          : null),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
    >
      <div className={wide ? 'w-20 shrink-0' : 'mb-8 w-24'}>
        <Doodle
          name={service.glyph}
          tone={service.element}
          play={reduced ? true : hovered}
          duration={0.7}
        />
      </div>

      <TextPanel surface={service.surface} {...(wide ? { className: 'min-w-0 flex-1 basis-80' } : {})}>
        <CardHeading
          className={['font-display leading-tight', TITLE_CLASS[service.span]].join(' ')}
          style={{ color: colourVar(textTone) }}
        >
          <MixedWeightLabel lead={service.title.lead} rest={service.title.rest} display />
        </CardHeading>
        <p
          className="mt-4 max-w-measure font-sans text-[clamp(0.95rem,1.1vw,1.0625rem)] leading-relaxed"
          style={{ color: colourVar(onPanel ? 'white' : textTone) }}
        >
          {service.body}
        </p>
      </TextPanel>

      {service.span === 'tall' ? (
        <figure className="mt-6 overflow-hidden rounded-[1.375rem]">
          <picture>
            <source srcSet="/images/cavities-stages.webp" type="image/webp" />
            <img
              src="/images/cavities-stages.png"
              alt="A child in a dental chair under a blue curing light."
              width={1199}
              height={1798}
              loading="lazy"
              className="block aspect-[4/3] w-full object-cover"
            />
          </picture>
        </figure>
      ) : null}
    </article>
  )
}

export function Services({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('services')
  const Heading = asPage ? 'h1' : 'h2'

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-card]', {
        y: 44,
        opacity: 0,
        duration: 0.85,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      })

      // Sixteen tiles at the card stagger would take two seconds to land, so
      // they come in as rows off their own trigger, halved and gridded.
      const grid = root.querySelector('[data-tile-grid]')
      if (grid) {
        gsap.from('[data-tile]', {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: EASE.entrance,
          stagger: { each: STAGGER / 2, grid: 'auto', from: 'start' },
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
        })
      }
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-heading"
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto max-w-[1600px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />
        <Heading
          id="services-heading"
          className="mt-4 max-w-[26ch] font-display text-h1 text-cobalt"
          data-animate
        >
          Everything a growing mouth needs, and nothing it does not
        </Heading>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt" data-animate>
          Six of them explained the way we would explain them to you in the room, and then
          everything else we treat.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-6">
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} headingLevel={asPage ? 'h2' : 'h3'} />
          ))}
        </div>

        <TreatmentGrid headingLevel={asPage ? 'h2' : 'h3'} />
      </div>
    </section>
  )
}
