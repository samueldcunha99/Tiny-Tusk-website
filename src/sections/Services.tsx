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
import { sectionMeta } from '@/content/site'

const SPAN_CLASS: Record<Service['span'], string> = {
  hero: 'md:col-span-4',
  wide: 'md:col-span-4',
  tall: 'md:col-span-2 md:row-span-2',
  regular: 'md:col-span-2',
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

  // Nothing in the palette is legible on coral (best is white at 2.99:1), so a
  // coral card keeps its field and floats its copy on a cobalt panel.
  const onPanel = !carriesText(service.surface)
  const textTone: BrandColour = onPanel ? 'canary' : service.element

  return (
    <article
      data-card
      data-surface={service.surface}
      className={[
        'group relative flex min-h-[300px] flex-col justify-between overflow-hidden',
        'rounded-[2rem] p-8 transition-transform duration-500 ease-entrance',
        'hover:-translate-y-2 focus-within:-translate-y-2',
        SPAN_CLASS[service.span],
      ].join(' ')}
      style={{
        background: colourVar(service.surface),
        // A paper card on a paper page has no edge of its own; the guide's
        // "white bg + powder" official pairing gives it one (p26).
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
      <div className="mb-8 w-24">
        <Doodle
          name={service.glyph}
          tone={service.element}
          // Cards draw their icon on hover/focus; under reduced motion the
          // Doodle component renders it complete and ignores `play`.
          play={reduced ? true : hovered}
          duration={0.7}
        />
      </div>

      <TextPanel surface={service.surface}>
        <CardHeading
          className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight"
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
    </article>
  )
}

export function Services({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = sectionMeta('services')
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
        <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        <Heading
          id="services-heading"
          className="mt-4 max-w-3xl font-display text-h1 text-cobalt"
          data-animate
        >
          What we look after
        </Heading>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt" data-animate>
          Six things, explained the way we would explain them to you in the room.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-6">
          {SERVICES.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              headingLevel={asPage ? 'h2' : 'h3'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
