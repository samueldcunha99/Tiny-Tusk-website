import { BrandImage } from '@/components/BrandImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { colourVar } from '@/components/BrandArtView'
import { PARENT_ARTICLES } from '@/content/parents'
import { useSectionMeta } from '@/content/sectionOrder'
import { carriesText } from '@/design/pairings'
import { TextPanel } from '@/components/TextPanel'

/**
 * 08 Parents' Corner -- paper.
 *
 * Five articles on the same six-column editorial grid the services use, so the
 * two card sections rhyme: 3+3 on the first row, 2+2+2 on the second. Each card
 * is an image head (full p32 treatment) over a tinted body, and the `fill`
 * already in `content/parents.ts` drives the body surface -- including the
 * coral card, which keeps its field and floats its copy on cobalt.
 */
const SPANS = ['md:col-span-3', 'md:col-span-3', 'md:col-span-2', 'md:col-span-2', 'md:col-span-2']

export function ParentsCorner({ asPage = false }: { asPage?: boolean | undefined }) {
  const meta = useSectionMeta('parents')
  const Heading = asPage ? 'h1' : 'h2'
  const ItemHeading = asPage ? 'h2' : 'h3'

  return (
    <section
      id="parents"
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      aria-labelledby="parents-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />
        <Heading id="parents-heading" className="mt-4 max-w-[24ch] font-display text-h1 text-cobalt">
          The questions that come up at the sink
        </Heading>

        <div className="mt-12 grid gap-5 md:grid-cols-6">
          {PARENT_ARTICLES.map((article, index) => {
            const onPanel = !carriesText(article.fill)
            return (
              <article
                key={article.id}
                className={[
                  'flex flex-col overflow-hidden rounded-[2rem]',
                  SPANS[index] ?? 'md:col-span-2',
                ].join(' ')}
                style={{ background: colourVar(article.fill) }}
                data-surface={article.fill}
              >
                <BrandImage
                  webp={`/images/${article.image.stem}.webp`}
                  png={`/images/${article.image.stem}.png`}
                  alt={article.image.alt}
                  width={article.image.width}
                  height={article.image.height}
                  title={{ ...article.title, fill: article.fill, href: '/parents' }}
                  logoTone={article.image.logoTone}
                  doodle={article.image.doodle}
                  doodleTone={article.image.doodleTone}
                  className="aspect-[16/10] rounded-b-none"
                />
                <div className="p-7">
                  <TextPanel surface={article.fill}>
                    <p
                      className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: colourVar(onPanel ? 'canary' : 'cobalt-80') }}
                    >
                      {article.category}
                    </p>
                    <ItemHeading
                      className="mt-3 font-display text-[clamp(1.2rem,1.8vw,1.55rem)] leading-snug"
                      style={{ color: colourVar(onPanel ? 'canary' : 'cobalt') }}
                    >
                      <MixedWeightLabel lead={article.title.lead} rest={article.title.rest} display />
                    </ItemHeading>
                    <p
                      className="mt-3 max-w-measure font-sans text-[0.95rem] leading-relaxed"
                      style={{ color: colourVar(onPanel ? 'white' : 'cobalt') }}
                    >
                      {article.summary}
                    </p>
                  </TextPanel>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
