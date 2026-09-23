import { useRef } from 'react'
import { ArticleImage } from '@/components/ArticleImage'
import { Circled } from '@/components/Circled'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { Doodle, type DoodleName } from '@/components/Doodle'
import { EllipseTitle } from '@/components/EllipseTitle'
import { SectionMarker } from '@/components/SectionMarker'
import { SectionNumber } from '@/components/SectionNumber'
import { colourVar } from '@/components/BrandArtView'
import { PARENT_ARTICLES } from '@/content/parents'
import { useSectionMeta } from '@/content/sectionOrder'
import { carriesText } from '@/design/pairings'
import { TextPanel } from '@/components/TextPanel'
import { useReveal } from '@/lib/motion'

/** The home page shows the clinic's first four questions; all seven are one tap on. */
const HOME_POSTS = PARENT_ARTICLES.slice(0, 4)

/** One brand illustration per post, drawn above its question. */
const POST_ART: Record<string, DoodleName> = {
  'baby-teeth-cavities': 'journeyDetection',
  'first-dental-visit': 'doodleFace',
  'thumb-sucking-and-pacifiers': 'doodleHeart',
  'early-signs-of-decay': 'doodleToothbrush',
}

/**
 * Parents' Corner on the home page: the clinic's questions as speech bubbles --
 * the guide's stylised title (p33-34) stretched round a question a parent
 * might ask at the sink. Canary and cobalt in turn on the powder ground,
 * riding a gentle wave, each with one hand-drawn coral illustration stuck on
 * its shoulder. A row that swipes on a phone, four across on desktop. No
 * boxes: the user turned down the tiles ("dont like these boxes"), then the
 * bare list that replaced them.
 *
 * Illustrations rather than photographs on purpose. Two of the client's article
 * photographs are clinical close-ups of decay and one has stock captions baked
 * in -- right inside an article, wrong as a first impression. The photographs
 * stay plain on the Parents' Corner cards and the articles, as the client
 * asked, and nothing is laid over them.
 */
function ParentsStrip() {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('parents')
  useReveal(ref)

  const allLink = (
    <a href="/parents-corner" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
      <span className="underline decoration-2 underline-offset-[6px]">All seven questions</span>
      <span className="block w-5" aria-hidden="true">
        <Doodle name="markArrow" tone="cobalt" />
      </span>
    </a>
  )

  return (
    <section
      id="parents"
      ref={ref}
      data-surface="powder"
      aria-labelledby="parents-heading"
      className="tt-section relative overflow-hidden bg-powder pb-10 pt-20 text-cobalt md:pb-16 md:pt-28"
    >
      <div className="mx-auto grid max-w-[1400px] gap-4 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <SectionMarker label={meta.label} />
          <h2
            id="parents-heading"
            data-reveal
            className="mt-5 max-w-[14ch] font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] lg:max-w-none lg:text-balance"
          >
            The questions that come up at the <Circled tone="cobalt">sink</Circled>
          </h2>
        </div>
        <div className="hidden lg:block">{allLink}</div>
      </div>

      {/* The swipe row clips at its padding edge, so `pt-6` and `pb-10` hold
          the stickers above and the wave below inside it. */}
      <ul
        aria-label="Parents' Corner posts"
        className="tt-swipe relative mt-4 list-none gap-5 px-6 pb-8 pt-6 [scroll-padding-inline:1.5rem] md:mt-6 md:px-10 lg:mx-auto lg:grid lg:max-w-[1400px] lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-10"
      >
        {HOME_POSTS.map((post, index) => (
          <li
            key={post.id}
            className={['w-[82%] md:w-[46%] lg:w-auto', index % 2 === 1 ? 'translate-y-6 lg:translate-y-10' : ''].join(' ')}
          >
            <QuestionBubble post={post} fill={index % 2 === 0 ? 'canary' : 'cobalt'} />
          </li>
        ))}
      </ul>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:hidden">{allLink}</div>
    </section>
  )
}

/**
 * One question in its bubble. The sticker draws itself in as the row arrives;
 * on hover or focus the bubble tips a little, a transform only.
 */
function QuestionBubble({ post, fill }: { post: (typeof HOME_POSTS)[number]; fill: 'canary' | 'cobalt' }) {
  const ink = fill === 'canary' ? 'text-cobalt' : 'text-canary'
  return (
    <a
      href={`/parents-corner/${post.id}`}
      className="relative block transition-transform duration-300 ease-entrance hover:-rotate-2 focus-visible:-rotate-2 active:scale-[0.97]"
    >
      <EllipseTitle fill={fill} className="grid min-h-[14.5rem] place-items-center px-11 py-10 text-center">
        <span className={`block font-sans text-[0.68rem] font-semibold uppercase tracking-[0.2em] ${ink}`}>
          {post.category}
        </span>
        {/* The clinic's question, verbatim -- the article's own h1. */}
        <h3 className={`mt-2 font-display text-[1.28rem] font-semibold leading-[1.12] ${ink}`}>{post.question}</h3>
        <span className="mx-auto mt-3 block w-6" aria-hidden="true">
          <Doodle name="markArrow" tone={fill === 'canary' ? 'cobalt' : 'canary'} />
        </span>
      </EllipseTitle>
      <Doodle
        name={POST_ART[post.id] ?? 'doodleHeart'}
        tone="coral"
        drawOnScroll
        duration={1.2}
        className="pointer-events-none absolute -top-5 left-1 w-14 -rotate-12 md:w-16"
      />
    </a>
  )
}

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
  if (!asPage) return <ParentsStrip />
  return <ParentsCornerPage />
}

/** The `/parents-corner` page: every post as the client's photograph card. */
function ParentsCornerPage() {
  const asPage = true
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
