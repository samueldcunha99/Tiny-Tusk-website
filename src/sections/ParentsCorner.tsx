import { ArticleImage } from '@/components/ArticleImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { colourVar } from '@/components/BrandArtView'
import { PARENT_ARTICLES } from '@/content/parents'
import { useSectionMeta } from '@/content/sectionOrder'
import { carriesText } from '@/design/pairings'
import { TextPanel } from '@/components/TextPanel'

/**
 * 08 Parents' Corner -- paper.
 *
 * This IS the blog. Seven posts on the same six-column editorial grid the
 * services use, so the two card sections rhyme: 3+3, then 2+2+2, then 3+3.
 *
 * A card is the client's photograph, then her question under it, then the
 * summary -- her own running order. The `<BrandImage>` head that used to sit
 * up there (logo watermark, title ellipse, doodle overlays) is still gone at
 * her request: this is a plain photograph on a plain tinted box, the `fill`
 * from `content/parents.ts`. The coral card keeps its field and floats its
 * copy on cobalt via `TextPanel`, because coral cannot carry text.
 *
 * A post with no photograph yet gets the placeholder tile, not a missing head,
 * so the row of cards stays one shape (see `ArticleImage`).
 *
 * Every card is a link to `/parents-corner/<id>` (`ParentsArticle.tsx`).
 */
const SPANS = [
  'md:col-span-3',
  'md:col-span-3',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-3',
  'md:col-span-3',
]

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
                <a
                  href={`/parents-corner/${article.id}`}
                  className="block transition-transform duration-500 ease-entrance active:-translate-y-0.5"
                >
                  {/* Photograph first, question under it -- the client's own
                      running order. The tile is flush to the card's top edge,
                      so the tinted fill reads as the card's lower half rather
                      than a border around a picture. */}
                  <ArticleImage image={article.image} className="aspect-[16/10]" />

                  <div className="p-7">
                    <TextPanel surface={article.fill}>
                      <p
                        className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: colourVar(onPanel ? 'canary' : 'cobalt-60') }}
                      >
                        {article.category}
                      </p>
                      {/* The client's question verbatim, not a rewritten label:
                          it is what she asked for under each photograph, and it
                          is the same string the article page carries as its h1. */}
                      <ItemHeading
                        className="mt-3 font-display text-[clamp(1.2rem,1.8vw,1.55rem)] font-semibold leading-snug"
                        style={{ color: colourVar(onPanel ? 'canary' : 'cobalt') }}
                      >
                        {article.question}
                      </ItemHeading>
                      <p
                        className="mt-3 max-w-measure font-sans text-[0.95rem] leading-relaxed"
                        style={{ color: colourVar(onPanel ? 'white' : 'cobalt') }}
                      >
                        {article.summary}
                      </p>
                      <p
                        className="mt-4 font-sans text-[0.85rem] font-semibold underline underline-offset-[3px]"
                        style={{ color: colourVar(onPanel ? 'canary' : 'cobalt') }}
                      >
                        Read this
                      </p>
                    </TextPanel>
                  </div>
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
