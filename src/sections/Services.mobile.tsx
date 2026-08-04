import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { SERVICES } from '@/content/services'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Mobile services.
 *
 * NOT the desktop section at a narrower width. `Services.tsx` is a six-card
 * editorial grid where each card is `min-h-[300px]` on its own surface; stacked
 * on a phone that is ~2.5 viewports of scrolling before the page's own tail.
 * That length is why `Home.mobile.tsx` dropped the section in the first place.
 *
 * A row list carries the same six bodies -- the actual information a parent
 * came for -- in about one viewport. The per-service `surface`/`element` colours
 * belong to the cards; here every row sits on the section's paper, so the
 * copy is cobalt throughout and no row can land text on coral.
 *
 * The full-page treatment still exists at `/services`, and the explore tiles
 * below still point at it.
 */
export function ServicesMobile() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('services')

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-service-row]', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: '[data-service-list]', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="services"
      ref={ref}
      data-surface="paper"
      className="tt-section relative bg-paper px-6 pb-16 pt-14"
      aria-labelledby="services-mobile-heading"
    >
      <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />

      <h2
        id="services-mobile-heading"
        className="mt-4 font-display text-[clamp(1.75rem,8vw,2.25rem)] leading-[1.05] tracking-[-0.02em] text-cobalt"
        data-animate
      >
        What we look after
      </h2>
      <p className="mt-3 max-w-[36ch] font-sans text-[0.95rem] leading-[1.5] text-cobalt/80" data-animate>
        Six things, explained the way we would explain them to you in the room.
      </p>

      {/* Rules rather than cards: six bordered boxes on a phone read as six
          separate pages of content, and cost the height that made this section
          too long to carry here at all. */}
      <ul className="mt-8 flex flex-col" data-service-list>
        {SERVICES.map((service) => (
          <li
            key={service.id}
            data-service-row
            data-animate
            className="flex gap-4 border-t-2 border-powder py-5 first:border-t-0 first:pt-0"
          >
            {/* Rests complete, as doodles do everywhere -- the row reveal is
                the section's one animation system. */}
            <span className="w-11 shrink-0 pt-1" aria-hidden="true">
              <Doodle name={service.glyph} tone="cobalt" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[1.35rem] leading-[1.15] text-cobalt">
                <MixedWeightLabel lead={service.title.lead} rest={service.title.rest} display />
              </h3>
              <p className="mt-1.5 font-sans text-[0.9rem] leading-[1.5] text-cobalt/75">
                {service.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
