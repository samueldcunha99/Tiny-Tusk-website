import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { LogoStory } from '@/components/LogoStory'
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
 * ON THE HOME PAGE: ten of the sixteen `TREATMENTS` as square tiles, set the
 * way `Services.tsx` sets them on desktop -- the client asked for the desktop
 * treatment here after seeing six category rows, then for ten of them.
 * ON `/services`: the six `TREATMENT_CATEGORIES`, each followed by its own
 * treatments as indented rows, so the grouping is available without being a
 * gate you click through, and so the six the home page leaves out are never
 * more than one tap away.
 *
 * ONE TILE, NOT THREE. The pre-restraint version alternated powder / white /
 * canary fills so no two neighbours matched, which is what made the grid read
 * as noise. These are all the same tile on the same paper: a 2px powder ring
 * and nothing else, so the drawings carry the grid and the colour run in
 * `Home.mobile.tsx` still steps once per section rather than once per card.
 * The rows survive on `/services`, where the nesting needs them.
 *
 * There is deliberately no description copy in either register: writing a
 * paragraph per category would mean inventing clinical detail (CLAUDE.md 1),
 * and `treatments.ts` says so too. The clinic's own drawings carry the rows.
 */
const LABEL_OF = new Map(TREATMENTS.map((t) => [t.slug, t.label]))

/**
 * The ten the home page shows, in clinic order.
 *
 * Nine are simply the first nine of `TREATMENTS`. The tenth is Laughing Gas,
 * lifted out of clinic order because it is the only treatment with a page of
 * its own -- cutting the list at ten flat would have dropped the one tile that
 * leads somewhere new. The six left out are all on `/services`, linked under
 * the strip, and nothing here is hidden from the site.
 *
 * This is a display cut, not a content edit: `treatments.ts` stays the full
 * clinical list and stays the clinic's own wording.
 */
const HOME_SLUGS: readonly string[] = [
  'infant-oral-care',
  'cleaning',
  'fluoride-sealants',
  'fillings',
  'root-canal',
  'crowns',
  'extraction-space-maintainer',
  'emergency-trauma',
  'braces',
  'laughing-gas',
]

const HOME_TREATMENTS = HOME_SLUGS.flatMap((slug) => TREATMENTS.filter((t) => t.slug === slug))

/**
 * Dev guard, as `treatmentCategories.ts` does it: a slug renamed in
 * `treatments.ts` would otherwise drop a tile off the home page in silence.
 * If this fires, fix `HOME_SLUGS`; never silence it.
 */
if (import.meta.env.DEV && HOME_TREATMENTS.length !== HOME_SLUGS.length) {
  const known = new Set(TREATMENTS.map((t) => t.slug))
  console.error(
    '[services] home tile slug not in treatments.ts:',
    HOME_SLUGS.filter((s) => !known.has(s)),
  )
}

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
                        <a
                          href={href}
                          className="flex min-h-12 flex-1 items-center justify-between gap-3"
                        >
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
      // Paper is the neutral middle of the page's one colour run (see
      // `Home.mobile.tsx`): powder, paper, canary, coral, cobalt. The ground
      // change is the separator, so this section carries no hairline of its own.
      className="tt-section relative bg-paper px-6 pb-14 pt-12"
      aria-labelledby="services-mobile-heading"
    >
      {/* The logo story opens this section rather than closing the hero: the
          guide prints that row on white and the hero is powder, where coral
          line art falls to 1.84:1 against its ground. Paper keeps it legible
          and keeps it on the same page, which is what the client asked for. */}
      <LogoStory className="pb-10" />

      <div className="mb-10 border-t border-[rgba(24,82,142,0.12)]" />

      <SectionMarker label={meta.label} />

      <Heading
        id="services-mobile-heading"
        className="mt-4 font-display text-[clamp(2rem,8.7vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-cobalt"
        data-animate
      >
        What we look after
      </Heading>

      {/* SQUARE TILES, AS DESKTOP SETS THEM -- same ring, radius, paper fill
          and icon-above-label stack as `Services.tsx`. Only the geometry is
          tuned for the phone.

          TEN, NOT SIXTEEN AND NOT SIX -- see `HOME_SLUGS`. Named treatments
          rather than category words, because a parent looking for "root canal"
          should not have to work out which of six words hides it.

          TWO ROWS THAT SWIPE, NOT FOUR THAT SCROLL. Ten tiles stacked three
          across runs four rows, and sixteen ran six and ~700px, which is the
          section eating the page again. The client asked for them inside two
          rows of height, and the only way to have both at a legible tile size
          is sideways: `grid-flow-col` with `grid-rows-2` fills column by
          column, so ten become five swipeable columns. Snap points land a
          column at a time and the half-visible tile at the right edge is the
          affordance -- no dots, no arrows, no copy telling you to swipe.

          `minmax(8rem, 1fr)`, NOT A FIXED WIDTH. A fixed column left a band of
          empty paper on the right of a wide phone, because five 8rem columns
          are 680px and this component serves up to 767px. The `1fr` lets the
          five share whatever width there is when they all fit, so the tiles
          grow into the gap instead of leaving it; the 8rem floor stops them
          collapsing on a narrow phone, where the strip overflows and swipes
          instead. Same rule, two behaviours, no breakpoint.

          This is NOT the auto-scrolling loop the client rejected earlier. It
          moves only when a finger moves it, it has a start and an end, and
          `overflow-x` is on this element alone so the page itself still
          measures `scrollWidth === innerWidth`.

          `-mx-6 px-6` lets the strip bleed to both screen edges while its first
          tile stays on the section's left margin.

          `active:` rather than `hover:`: a tapped link keeps :hover on touch,
          so the desktop hover state would stick to the last tile touched. */}
      <ul
        className="-mx-6 mt-6 grid snap-x snap-mandatory auto-cols-[minmax(8rem,1fr)] grid-flow-col grid-rows-2 list-none gap-3 overflow-x-auto px-6 pb-3"
        data-service-grid
      >
        {HOME_TREATMENTS.map((treatment) => {
          // A treatment with a page of its own goes there; the rest go to the
          // grouped list. Every tile is a link, unlike desktop, where the ones
          // without a page are inert -- a grid of mostly dead tiles is worse on
          // a phone than one that always leads somewhere.
          const href = TREATMENT_HREF[treatment.slug] ?? '/services'
          // Desktop's threshold, same reason: "Stainless Steel &
          // Tooth-Coloured Crowns" is 39 characters against "Cleaning" at
          // eight, and one step down past 26 stops the long ones overflowing.
          const long = treatment.label.length > 26
          return (
            <li key={treatment.slug} data-service-cell data-animate className="min-w-0 snap-start">
              <a
                href={href}
                className={[
                  'tt-treatment-tile flex aspect-square min-w-0 flex-col items-center justify-center gap-2 rounded-[1rem] bg-paper p-2.5 text-center text-cobalt',
                  'transition-[transform,background-color] duration-500 ease-entrance active:-translate-y-0.5 active:bg-canary',
                  // Coral ring marks the ones with a page behind them, as desktop does.
                  TREATMENT_HREF[treatment.slug]
                    ? 'shadow-[inset_0_0_0_2px_var(--tt-coral)]'
                    : 'shadow-[inset_0_0_0_2px_var(--tt-powder)]',
                ].join(' ')}
              >
                <ServiceIcon
                  slug={treatment.slug}
                  className={['shrink-0', long ? 'h-8 w-9' : 'h-10 w-11'].join(' ')}
                />
                <span
                  className={[
                    'min-w-0 font-sans leading-tight [text-wrap:balance]',
                    long ? 'text-[0.6875rem]' : 'text-[0.75rem]',
                  ].join(' ')}
                >
                  {treatment.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      <a
        href="/services"
        className="mt-6 inline-flex min-h-11 items-center font-sans text-[0.9rem] font-semibold text-cobalt underline underline-offset-4"
      >
        {/* Back to "every" now that the strip is a cut of the list rather than
            all of it. No count in the label -- the client asked us not to
            quote one. */}
        See every treatment
      </a>
    </section>
  )
}
