import { useEffect, useRef, useState } from 'react'
import { colourVar } from '@/components/BrandArtView'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionMarker } from '@/components/SectionMarker'
import { ServiceIcon } from '@/components/ServiceIcon'
import { TREATMENTS } from '@/content/treatments'
import { CATEGORY_OF, TREATMENT_CATEGORIES, TREATMENT_HREF } from '@/content/treatmentCategories'
import { useSectionMeta } from '@/content/sectionOrder'
import { EASE, STAGGER, gsap, onArrival, primeDraw, usePrefersReducedMotion, useReveal } from '@/lib/motion'

const LABEL_OF = new Map(TREATMENTS.map((t) => [t.slug, t.label]))

/** slug -> the id of its category's block on `/services`. */
const CATEGORY_ID_OF = new Map(
  TREATMENT_CATEGORIES.flatMap((c) => c.slugs.map((slug) => [slug, c.id] as const)),
)

/** slug -> its position in the `/services` reading order, for the disc cycle. */
const PAGE_ORDER_OF = new Map(TREATMENT_CATEGORIES.flatMap((c) => c.slugs).map((slug, i) => [slug, i]))

/**
 * Every drawing sits on a disc of one of the palette's other three colours, so
 * the canary chapter carries the whole palette -- round, never a box. The
 * cycle keeps neighbours apart: in the two-row strip, filled column by column,
 * no two equal discs touch side by side or one above the other. Each drawing
 * takes its disc's p24 partner: canary on cobalt and coral, cobalt on powder.
 */
const DISCS = ['cobalt', 'powder', 'coral'] as const
type Disc = (typeof DISCS)[number]

const DISC_OVERRIDE: Partial<Record<string, Disc>> = {
  braces: 'powder',
  invisalign: 'cobalt',
  'smile-makeovers': 'coral',
}

const discAt = (i: number, slug?: string): Disc => {
  if (slug && DISC_OVERRIDE[slug]) return DISC_OVERRIDE[slug]!
  return DISCS[i % DISCS.length] ?? 'cobalt'
}

function TreatmentDisc({
  slug,
  disc,
  className,
  iconClassName,
}: {
  slug: string
  disc: Disc
  className: string
  iconClassName: string
}) {
  return (
    <span className={`relative grid shrink-0 place-items-center ${className}`}>
      {/* One fat stroke rather than a fill, so the strip can draw it in. */}
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full -rotate-90">
        <circle data-disc data-draw cx="50" cy="50" r="25" fill="none" stroke={colourVar(disc)} strokeWidth="50" />
      </svg>
      {/* `tt-disc-icon` and `tt-on-*` set the line weight and keep the
          drawing's own accents visible on its disc (index.css). */}
      <ServiceIcon
        slug={slug}
        className={[
          'tt-disc-icon relative',
          iconClassName,
          disc === 'powder' ? 'text-cobalt' : 'text-canary',
          `tt-on-${disc}`,
        ].join(' ')}
      />
    </span>
  )
}

/**
 * The ten the home page shows -- the client's own cut (audit item 38): the
 * first nine in clinic order, plus Laughing Gas, lifted out of order because
 * it is the one treatment with a page of its own. The other six are one tap
 * away on `/services`. A display cut, not a content edit: `treatments.ts`
 * stays the full list in the clinic's own words.
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

// Same contract as the guard in treatmentCategories.ts: a renamed slug must
// not drop a tile off the home page in silence. Fix HOME_SLUGS; never silence.
if (import.meta.env.DEV) {
  const unknown = HOME_SLUGS.filter((slug) => !LABEL_OF.has(slug))
  if (unknown.length) console.error('[services] home slug not in treatments.ts:', unknown)
}

const hrefFor = (slug: string) => TREATMENT_HREF[slug] ?? `/services/#${CATEGORY_ID_OF.get(slug) ?? ''}`

/**
 * What we look after -- the canary plate, the one canary chapter on the home
 * page (three in a row read as "too much yellow").
 *
 * The client's sixteen treatment drawings, and nothing written around them:
 * describing each treatment would mean inventing clinical detail
 * (CLAUDE.md §1), which `treatments.ts` rules out in so many words. The
 * drawings and the clinic's own labels carry the section.
 *
 * Home: two rows that swipe sideways, moved only by a finger -- the client
 * rejected an auto-scrolling strip. `/services`: every treatment, grouped.
 */
export function Services({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('services')
  const Heading = asPage ? 'h1' : 'h2'
  useReveal(ref)

  return (
    <section
      id="services"
      ref={ref}
      data-surface="canary"
      aria-labelledby="services-heading"
      className={[
        'tt-section relative overflow-hidden bg-canary text-cobalt',
        asPage ? 'pb-20 pt-24 md:pb-28 md:pt-36' : 'pb-16 pt-20 md:pb-20 md:pt-28',
      ].join(' ')}
    >
      {/* Low-contrast register on canary, p25: a white loop. */}
      <Doodle
        name="loopStroke"
        tone="white"
        drawOnScroll
        duration={1.8}
        className="pointer-events-none absolute -left-[48%] top-[7%] w-[130%] max-w-none md:-left-[10%] md:top-[6%] md:w-[42%]"
      />

      {/* Heading and intro share a row on desktop, so the right half of the
          header is not left empty above the strip. */}
      <div className="relative mx-auto grid max-w-[1400px] gap-4 px-6 md:px-10 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <SectionMarker label={meta.label} />
          <Heading
            id="services-heading"
            data-reveal
            className="mt-5 font-display text-[clamp(2.5rem,10.5vw,4.75rem)] font-semibold leading-[1.0] tracking-[-0.025em]"
          >
            What we look after
          </Heading>
        </div>
        <p data-reveal="fast" className="max-w-[40ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.15rem] lg:pb-2">
          From a baby&rsquo;s very first tooth to growing confident smiles: sixteen treatments, each
          one explained to your child before it begins.
        </p>
      </div>

      {asPage ? <ServiceIndex /> : <ServiceStrip />}
    </section>
  )
}

/**
 * Ten treatments in two rows, filled column by column so they swipe a column
 * at a time. `minmax(8rem, 1fr)`: on a wide phone the five columns share the
 * width instead of leaving a band of empty canary; on a narrow one they
 * overflow and swipe.
 *
 * The discs wipe in clockwise, one after another, as the strip arrives -- the
 * brushing timer's ring, drawn. They rest complete, and are never primed under
 * reduced motion.
 */
function ServiceStrip() {
  const listRef = useRef<HTMLUListElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const list = listRef.current
    if (!list || reduced) return
    const discs = Array.from(list.querySelectorAll<SVGCircleElement>('[data-disc]'))
    const wipe = gsap.timeline({ paused: true })
    const stop = onArrival(
      list,
      () =>
        discs.forEach((disc, i) => {
          primeDraw(disc, false)
          wipe.to(
            disc,
            {
              strokeDashoffset: 0,
              duration: 0.7,
              ease: EASE.entrance,
              // A dashed stroke leaves a hairline where its two ends meet, so
              // a disc that has landed drops the dash and closes up.
              onComplete: () => primeDraw(disc, true),
            },
            i * STAGGER,
          )
        }),
      () => wipe.play(),
    )
    return () => {
      stop()
      wipe.kill()
      discs.forEach((disc) => primeDraw(disc, true))
    }
  }, [reduced])

  return (
    <>
      {/* `relative` so the strip paints above the section's loop artwork. */}
      <ul
        ref={listRef}
        aria-label="Treatments"
        className="tt-swipe relative mx-auto mt-10 grid max-w-[1400px] auto-cols-[minmax(8rem,1fr)] grid-flow-col grid-rows-2 list-none gap-x-2 gap-y-6 px-6 pb-2 [scroll-padding-inline:1.5rem] md:mt-14 md:px-10"
      >
        {HOME_SLUGS.map((slug, index) => (
          <li key={slug}>
            <a
              href={hrefFor(slug)}
              className="tt-treatment-tile flex h-full flex-col items-center gap-3 px-1 text-center transition-transform duration-200 active:scale-95"
            >
              <TreatmentDisc
                slug={slug}
                disc={discAt(index, slug)}
                className="h-[5.5rem] w-[5.5rem] md:h-28 md:w-28"
                iconClassName="h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]"
              />
              <span className="font-display text-[1.02rem] leading-[1.15]">{LABEL_OF.get(slug)}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="relative mx-auto mt-8 flex max-w-[1400px] flex-col items-start gap-1 px-6 md:mt-12 md:flex-row md:gap-10 md:px-10">
        <a href="/services/" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
          <span className="underline decoration-2 underline-offset-[6px]">All sixteen treatments</span>
          <span className="block w-5" aria-hidden="true">
            <Doodle name="markArrow" tone="cobalt" />
          </span>
        </a>
        <a href="/laughing-gas/" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
          <span className="underline decoration-2 underline-offset-[6px]">Laughing gas, explained</span>
          <span className="block w-5" aria-hidden="true">
            <Doodle name="markArrow" tone="cobalt" />
          </span>
        </a>
      </div>
    </>
  )
}

/**
 * Every treatment on `/services/`.
 *
 * Provides category filter tabs so parents can browse by clinical focus
 * or see all sixteen treatments in a balanced, dense, unbroken 4x4 grid.
 * Zero empty gaps, zero lopsided voids.
 */
function ServiceIndex() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && (TREATMENT_CATEGORIES.some((c) => c.id === hash) || hash === 'all')) {
        setActiveCategory(hash)
      } else if (!hash) {
        setActiveCategory('all')
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const selectCategory = (id: string) => {
    setActiveCategory(id)
    if (id === 'all') {
      history.replaceState(null, '', '/services/')
    } else {
      history.replaceState(null, '', `/services/#${id}`)
    }
  }

  const selectedCategoryObj = TREATMENT_CATEGORIES.find((c) => c.id === activeCategory)
  const displayedSlugs = selectedCategoryObj
    ? selectedCategoryObj.slugs
    : TREATMENT_CATEGORIES.flatMap((c) => c.slugs)

  return (
    <div className="relative mx-auto mt-8 max-w-[1320px] px-6 md:mt-10 md:px-10">
      {/* Anchor targets so deep links (/services/#first-visit etc) resolve smoothly */}
      {TREATMENT_CATEGORIES.map((cat) => (
        <span key={cat.id} id={cat.id} className="scroll-mt-32 sr-only" />
      ))}

      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label="Treatment categories"
        className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'all'}
          onClick={() => selectCategory('all')}
          className={[
            'inline-flex items-center rounded-full px-4 py-2 font-sans text-[0.88rem] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt',
            activeCategory === 'all'
              ? 'bg-cobalt text-canary shadow-sm'
              : 'bg-cobalt/10 text-cobalt hover:bg-cobalt/20 active:scale-95',
          ].join(' ')}
        >
          All treatments (16)
        </button>
        {TREATMENT_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => selectCategory(cat.id)}
              className={[
                'inline-flex items-center rounded-full px-3.5 py-1.5 font-sans text-[0.88rem] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt',
                isSelected
                  ? 'bg-cobalt text-canary shadow-sm'
                  : 'bg-cobalt/10 text-cobalt hover:bg-cobalt/20 active:scale-95',
              ].join(' ')}
            >
              <span>{cat.title.lead} {cat.title.rest}</span>
              <span className={['ml-1.5 text-[0.75rem]', isSelected ? 'text-canary/80' : 'text-cobalt/60'].join(' ')}>
                ({cat.slugs.length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Active category banner if filtered */}
      {selectedCategoryObj && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="font-display text-[clamp(1.75rem,5vw,2.4rem)] font-semibold leading-tight text-cobalt">
            <MixedWeightLabel display lead={selectedCategoryObj.title.lead} rest={selectedCategoryObj.title.rest} />
          </h2>
          <button
            type="button"
            onClick={() => selectCategory('all')}
            className="inline-flex items-center gap-1.5 font-sans text-[0.88rem] font-semibold text-cobalt underline decoration-2 underline-offset-4 hover:opacity-80"
          >
            <span>← View all sixteen treatments</span>
          </button>
        </div>
      )}

      {/* Balanced treatment grid */}
      <ul
        aria-label="Treatments list"
        className={[
          'list-none gap-5 md:gap-8',
          activeCategory === 'all'
            ? 'mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:mt-10'
            : 'mt-8 flex flex-wrap justify-center md:mt-10',
        ].join(' ')}
      >
        {displayedSlugs.map((slug) => {
          const href = TREATMENT_HREF[slug]
          const disc = discAt(PAGE_ORDER_OF.get(slug) ?? 0, slug)
          const label = LABEL_OF.get(slug)
          const categoryName = CATEGORY_OF[slug]

          const cardInner = (
            <>
              <div className="flex flex-col items-center gap-2.5">
                {activeCategory === 'all' && categoryName ? (
                  <span className="text-[0.68rem] font-sans font-bold uppercase tracking-wider text-cobalt/60">
                    {categoryName}
                  </span>
                ) : null}
                <TreatmentDisc
                  slug={slug}
                  disc={disc}
                  className="h-24 w-24 md:h-28 md:w-28 transition-transform duration-300 group-hover:scale-105"
                  iconClassName="h-12 w-12 md:h-14 md:w-14"
                />
                <span className="font-display text-[1.02rem] md:text-[1.12rem] font-semibold leading-[1.2] text-cobalt">
                  {label}
                </span>
              </div>
              {href ? (
                <span className="mt-2 inline-flex items-center gap-1.5 text-[0.82rem] font-sans font-semibold text-cobalt underline decoration-2 underline-offset-4 group-hover:text-cobalt">
                  <span>Details</span>
                  <span className="block w-3.5" aria-hidden="true">
                    <Doodle name="markArrow" tone="cobalt" />
                  </span>
                </span>
              ) : null}
            </>
          )

          return (
            <li
              key={slug}
              className={activeCategory === 'all' ? 'flex' : 'w-48 sm:w-56 md:w-64 flex'}
            >
              {href ? (
                <a
                  href={href}
                  className="tt-treatment-tile group flex w-full flex-col items-center justify-between gap-3 rounded-2xl p-4 text-center transition-transform duration-200 hover:-translate-y-1.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                >
                  {cardInner}
                </a>
              ) : (
                <div
                  className="tt-treatment-tile flex w-full flex-col items-center justify-between gap-3 rounded-2xl p-4 text-center transition-transform duration-200 hover:-translate-y-1.5"
                >
                  {cardInner}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* Laughing Gas Sedation feature link */}
      <div className="mt-12 flex flex-col items-center justify-center gap-3 border-t border-cobalt/15 pt-8 text-center md:mt-16">
        <a
          href="/laughing-gas/"
          className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold text-cobalt hover:opacity-90 md:text-[1.05rem]"
        >
          <span className="underline decoration-2 underline-offset-[6px]">Curious about sedation? Read: Laughing gas, explained</span>
          <span className="block w-5" aria-hidden="true">
            <Doodle name="markArrow" tone="cobalt" />
          </span>
        </a>
      </div>
    </div>
  )
}
