import { useMemo, useState } from 'react'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { ServiceIcon } from '@/components/ServiceIcon'
import { TextPanel } from '@/components/TextPanel'
import { TREATMENTS } from '@/content/treatments'

/**
 * 03 Services -- "Everything we treat", redesigned.
 *
 * The old band was a 4x4 wall of identical tiles under a full-width heading:
 * sixteen equal-weight squares, no way in, and the icons carried the whole
 * read. This version turns it into an index.
 *
 *  - The heading, intro and a live count move into a sticky left rail, so the
 *    section keeps a fixed anchor while the list scrolls past it.
 *  - Category chips filter in place. Nothing is removed from the DOM -- the
 *    non-matching tiles fade back, so the size of the list stays honest and
 *    the grid never reflows under the pointer.
 *  - Tiles are icon-left / label-right with a category tag, which lets three
 *    columns hold the same sixteen items at roughly half the height and stops
 *    the long labels ("Stainless Steel & Tooth-Coloured Crowns") wrapping to
 *    four lines.
 *  - A coral prompt closes the band; the old one just stopped. The prompt's
 *    copy sits on a `<TextPanel>` cobalt bed -- coral cannot carry text at any
 *    size or colour (CLAUDE.md §6.1), so the closing line uses the same
 *    coral-field / cobalt-copy pattern as the tall service card above it.
 *
 * Palette, type and hover behaviour are unchanged: paper tiles on the cobalt
 * band, canary on hover (p24), mixed-weight labels, monochrome collage at 33%
 * white (p27).
 */

/**
 * Grouping only -- the labels in `content/treatments.ts` are still the
 * clinic's own words and are not edited here. If the clinic would rather
 * group these differently, this map is the only thing to change.
 */
const CATEGORY_OF: Record<string, CategoryKey> = {
  'infant-oral-care': 'everyday',
  cleaning: 'everyday',
  'fluoride-sealants': 'everyday',
  'sports-dentistry': 'everyday',
  fillings: 'repair',
  'root-canal': 'repair',
  crowns: 'repair',
  'extraction-space-maintainer': 'repair',
  'emergency-trauma': 'repair',
  braces: 'align',
  invisalign: 'align',
  'smile-makeovers': 'align',
  'myofunctional-therapy': 'align',
  'special-needs': 'comfort',
  'laughing-gas': 'comfort',
  'general-anaesthesia': 'comfort',
}

type CategoryKey = 'everyday' | 'repair' | 'align' | 'comfort'

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  everyday: 'Everyday care',
  repair: 'Repair & restore',
  align: 'Straighten',
  comfort: 'Comfort & calm',
}

const FILTERS = ['all', 'everyday', 'repair', 'align', 'comfort'] as const
type FilterKey = (typeof FILTERS)[number]

/** Same three drawings as the tiles, oversized behind the heading (p27). */
const COLLAGE = [
  { slug: 'smile-makeovers', className: 'left-0 top-14 h-24 w-32 -rotate-6' },
  { slug: 'braces', className: 'left-[7rem] top-0 h-28 w-44 rotate-[7deg]' },
  { slug: 'invisalign', className: 'right-0 top-24 h-24 w-40 -rotate-12' },
] as const

export function TreatmentGrid({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' | undefined }) {
  const GridHeading = headingLevel
  const [filter, setFilter] = useState<FilterKey>('all')

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: TREATMENTS.length }
    for (const t of TREATMENTS) {
      const key = CATEGORY_OF[t.slug]
      if (key) out[key] = (out[key] ?? 0) + 1
    }
    return out
  }, [])

  return (
    <div
      data-surface="cobalt"
      className="relative mt-16 overflow-hidden rounded-[2rem] bg-cobalt px-6 py-10 md:mt-20 md:px-12 md:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-8 hidden h-72 w-[32rem] lg:block"
      >
        {COLLAGE.map((art) => (
          <ServiceIcon key={art.slug} slug={art.slug} mono className={`absolute ${art.className}`} />
        ))}
      </div>

      <div className="relative z-10 grid items-start gap-10 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] lg:gap-14">
        {/* Left rail: the section's fixed anchor while the list scrolls. */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-8">
          <div className="flex items-center gap-2.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-coral" />
            <span className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-powder">
              The full list
            </span>
          </div>

          <GridHeading className="font-display text-h2 text-canary">
            <MixedWeightLabel lead="Everything" rest="we treat" display />
          </GridHeading>

          <p className="max-w-[34ch] font-sans text-[clamp(0.95rem,1.1vw,1.0625rem)] leading-relaxed text-white/85">
            In the clinic&apos;s own words. Ask us about any of them — we would rather explain it
            twice than have you guess.
          </p>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((key) => {
              const active = key === filter
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(key)}
                  className={[
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2',
                    'font-sans text-[0.78rem] font-semibold',
                    'transition-colors duration-300 ease-entrance',
                    active
                      ? 'border-canary bg-canary text-cobalt'
                      : 'border-white/30 bg-transparent text-white/85 hover:border-white/60',
                  ].join(' ')}
                >
                  <span>{key === 'all' ? 'All' : CATEGORY_LABEL[key]}</span>
                  <span className="text-[0.66rem] opacity-60">{counts[key] ?? 0}</span>
                </button>
              )
            })}
          </div>

          <div className="h-px bg-white/20" />

          <p className="font-sans text-[0.8rem] leading-relaxed text-white/60">
            Showing{' '}
            <span className="font-semibold text-canary">{counts[filter] ?? TREATMENTS.length}</span>{' '}
            of {TREATMENTS.length} treatments.
          </p>
        </div>

        {/* The list. min-w-0 on the column and the tiles: without it the long
            labels set a min-content floor and the grid overflows the band. */}
        <div className="min-w-0">
          <ul
            data-tile-grid
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            {TREATMENTS.map((treatment) => {
              const category = CATEGORY_OF[treatment.slug]
              const shown = filter === 'all' || category === filter
              const space = treatment.label.indexOf(' ')
              const lead = space === -1 ? treatment.label : treatment.label.slice(0, space)
              const rest = space === -1 ? '' : treatment.label.slice(space + 1)

              return (
                <li
                  key={treatment.slug}
                  data-tile
                  style={{ opacity: shown ? 1 : 0.25 }}
                  className={[
                    'tt-treatment-tile min-w-0 rounded-[1.25rem] bg-paper',
                    'flex items-center gap-4 p-4 text-cobalt',
                    'transition-[transform,background-color,opacity,filter] duration-500 ease-entrance',
                    shown ? 'hover:-translate-y-1 hover:bg-canary' : 'saturate-[0.2]',
                  ].join(' ')}
                >
                  <ServiceIcon slug={treatment.slug} className="h-11 w-13 shrink-0" />
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="font-sans text-[0.85rem] leading-snug">
                      {rest ? (
                        <MixedWeightLabel lead={lead} rest={rest} />
                      ) : (
                        <span style={{ fontWeight: 600 }}>{lead}</span>
                      )}
                    </span>
                    {category ? (
                      <span className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-cobalt/50">
                        {CATEGORY_LABEL[category]}
                      </span>
                    ) : null}
                  </span>
                </li>
              )
            })}

            <li className="col-span-full min-w-0">
              <div
                data-surface="coral"
                className="mt-1 flex flex-wrap items-center justify-between gap-5 rounded-[1.25rem] bg-coral px-6 py-5"
              >
                <TextPanel surface="coral" className="min-w-0 flex-1 basis-80">
                  <p className="max-w-measure font-sans text-[0.95rem] leading-relaxed text-white">
                    <span className="font-semibold">Not sure which one you need?</span> Tell us what
                    you have noticed and we will point you to the right one — no appointment needed
                    to ask.
                  </p>
                </TextPanel>
                <a
                  href="#book"
                  className="shrink-0 rounded-full bg-cobalt px-6 py-3 font-sans text-[0.85rem] font-semibold text-canary transition-transform duration-500 ease-entrance hover:-translate-y-0.5"
                >
                  Ask the clinic
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
