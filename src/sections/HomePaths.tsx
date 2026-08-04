import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { colourVar } from '@/components/BrandArtView'
import { HOME_PATHS } from '@/content/homePaths'
import { useSectionMeta } from '@/content/sectionOrder'
import type { BrandColour } from '@/design/pairings'

/**
 * 01 Start Here -- paper.
 *
 * Was a tab strip: two of the three routes were hidden behind a click, so a
 * parent who did not notice the tabs never learned the brushing game or the
 * clinic tour existed. Now all three are permanent cards on the guide's
 * official surfaces, each with its own stylised CTA pinned to the card foot.
 */
const SURFACES: readonly { surface: BrandColour; fill: 'canary' | 'powder' }[] = [
  { surface: 'powder', fill: 'canary' },
  { surface: 'canary', fill: 'powder' },
  { surface: 'paper', fill: 'canary' },
]

export function HomePaths() {
  const meta = useSectionMeta('paths')

  return (
    <section
      id="paths"
      className="tt-section relative bg-paper px-6 py-20 md:px-10 md:py-24"
      aria-labelledby="paths-heading"
    >
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />
        <h2 id="paths-heading" className="mt-4 max-w-[24ch] font-display text-h1 text-cobalt">
          Three ways in, whichever you need first
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {HOME_PATHS.map((path, index) => {
            const tone = SURFACES[index] ?? SURFACES[0]!
            return (
              <article
                key={path.id}
                data-surface={tone.surface}
                className="flex flex-col gap-5 rounded-[2rem] p-8 transition-transform duration-500 ease-entrance hover:-translate-y-2 focus-within:-translate-y-2"
                style={{
                  background: colourVar(tone.surface),
                  ...(tone.surface === 'paper'
                    ? { boxShadow: '0 18px 50px rgba(24,82,142,0.08)' }
                    : null),
                }}
              >
                <Doodle name={path.glyph} tone="cobalt" drawOnScroll className="w-[4.5rem]" />
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-cobalt">
                  {path.title}
                </h3>
                <p className="max-w-measure font-sans text-base leading-relaxed text-cobalt">
                  {path.body}
                </p>
                <div className="mt-auto pt-2">
                  <StylisedCTA lead={path.cta.lead} rest={path.cta.rest} href={path.href} fill={tone.fill} />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
