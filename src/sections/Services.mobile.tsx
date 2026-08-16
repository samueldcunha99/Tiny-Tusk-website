import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { ServiceIcon } from '@/components/ServiceIcon'
import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionMarker } from '@/components/SectionMarker'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { TREATMENTS } from '@/content/treatments'
import { TREATMENT_CATEGORIES, TREATMENT_HREF } from '@/content/treatmentCategories'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Mobile services, in two registers.
 *
 * ON THE HOME PAGE: the six `TREATMENT_CATEGORIES` as rows -- icon, name, and
 * a rule between them. ON `/services`: the same six, each followed by its own
 * treatments as indented rows, so everything is visible at once rather than
 * hidden behind six category gates.
 *
 * ROWS, NOT TILES. Both registers were grids of filled cards, alternating
 * powder / white / canary so no two neighbours matched. That is six boxes and
 * three more colours for what is, structurally, a list of six words. The rule
 * between rows does the same separating work with no fill, no radius and no
 * shadow -- see the box rule in `Home.mobile.tsx`.
 *
 * There is deliberately no description copy in either register: writing a
 * paragraph per category would mean inventing clinical detail (CLAUDE.md 1),
 * and `treatments.ts` says so too. The clinic's own drawings carry the rows.
 */
const LABEL_OF = new Map(TREATMENTS.map((t) => [t.slug, t.label]))

/** The hairline that separates rows. Cobalt at 15% reads on paper and white. */
const RULE = 'border-b border-[rgba(24,82,142,0.15)] last:border-b-0'

export function ServicesMobile({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('services')
  const Heading = asPage ? 'h1' : 'h2'

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-service-cell]', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: '[data-service-grid]', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  if (asPage) {
    return (
      <section
        id="services"
        ref={ref}
        data-surface="paper"
        className="tt-section relative bg-paper px-6 pb-16 pt-[6.5rem]"
        aria-labelledby="services-mobile-heading"
      >
        <SectionMarker label={meta.label} />
        <Heading
          id="services-mobile-heading"
          className="mt-4 font-display text-[clamp(2.5rem,11vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-cobalt"
          data-animate
        >
          What we look after
        </Heading>

        <div className="mt-9 flex flex-col gap-9" data-service-grid>
          {TREATMENT_CATEGORIES.map((category) => (
            <section key={category.id} data-service-cell data-animate>
              <h2 className="flex items-center gap-3.5 font-display text-[1.4375rem] leading-[1.1] text-cobalt">
                <ServiceIcon slug={category.icon} className="h-[2.5rem] w-[2.5rem] shrink-0" />
                <MixedWeightLabel lead={category.title.lead} rest={category.title.rest} display />
              </h2>

              <ul className="mt-3">
                {category.slugs.map((slug) => {
                  const label = LABEL_OF.get(slug)
                  const href = TREATMENT_HREF[slug]
                  return (
                    <li
                      key={slug}
                      className={`flex min-h-12 items-center gap-3 font-sans text-[0.95rem] text-cobalt ${RULE}`}
                    >
                      <ServiceIcon slug={slug} className="h-[1.875rem] w-[1.875rem] shrink-0" />
                      {href ? (
                        <a href={href} className="flex min-h-12 flex-1 items-center justify-between gap-3">
                          <span className="underline underline-offset-[3px]">{label}</span>
                          <span className="w-3.5 shrink-0" aria-hidden="true">
                            <Doodle name="markArrow" tone="coral" />
                          </span>
                        </a>
                      ) : (
                        label
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* The page's one filled action, and no panel around it. */}
        <p className="mt-12 max-w-[30ch] font-display text-[clamp(1.6rem,7.7vw,2rem)] font-semibold leading-[1.05] text-cobalt">
          Not sure which one you need?
        </p>
        <p className="mt-2.5 max-w-[32ch] font-sans text-[0.95rem] leading-[1.55] text-cobalt">
          Tell us what you have noticed and we will work it out together.
        </p>
        <StylisedCTA
          lead="Book"
          rest="a visit"
          href="/book"
          fill="canary"
          className="mt-6 min-h-[3.625rem] w-full max-w-[17.5rem]"
        />
      </section>
    )
  }

  return (
    <section
      id="services"
      ref={ref}
      data-surface="paper"
      className="tt-section relative border-t border-[rgba(24,82,142,0.12)] bg-paper px-6 pb-14 pt-12"
      aria-labelledby="services-mobile-heading"
    >
      <SectionMarker label={meta.label} />

      <Heading
        id="services-mobile-heading"
        className="mt-4 font-display text-[clamp(2rem,8.7vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-cobalt"
        data-animate
      >
        What we look after
      </Heading>

      <ul className="mt-6" data-service-grid>
        {TREATMENT_CATEGORIES.map((category) => (
          <li key={category.id} data-service-cell data-animate className={RULE}>
            <a
              href="/services"
              className="flex min-h-[3.75rem] items-center gap-3.5 text-cobalt active:opacity-70"
            >
              <ServiceIcon slug={category.icon} className="h-[2.375rem] w-[2.375rem] shrink-0" />
              <span className="flex-1 font-display text-[1.25rem] leading-[1.1]">
                <MixedWeightLabel lead={category.title.lead} rest={category.title.rest} display />
              </span>
              <span className="w-3.5 shrink-0" aria-hidden="true">
                <Doodle name="markArrow" tone="coral" />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/services"
        className="mt-6 inline-flex min-h-11 items-center font-sans text-[0.9rem] font-semibold text-cobalt underline underline-offset-4"
      >
        See every treatment
      </a>
    </section>
  )
}
