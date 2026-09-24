import { Fragment, useRef, type ReactNode } from 'react'
import { ArticleImage } from '@/components/ArticleImage'
import { Circled } from '@/components/Circled'
import { Doodle, type DoodleName } from '@/components/Doodle'
import { EllipseTitle } from '@/components/EllipseTitle'
import { SectionMarker } from '@/components/SectionMarker'
import { SmileEdge } from '@/components/SmileEdge'
import { colourVar } from '@/components/BrandArtView'
import { PARENT_ARTICLES, type ParentArticle } from '@/content/parents'
import { useSectionMeta } from '@/content/sectionOrder'
import { useReveal } from '@/lib/motion'
import { BookingClose } from './BookingClose'

/** The home page shows the clinic's first four questions; all seven are one tap on. */
const HOME_POSTS = PARENT_ARTICLES.slice(0, 4)

/**
 * One brand illustration per post: the sticker on its home-page bubble, and
 * the cover on `/parents-corner` of a post that has no photograph yet.
 */
const POST_ART: Record<string, DoodleName> = {
  'baby-teeth-cavities': 'journeyDetection',
  'first-dental-visit': 'doodleFace',
  'thumb-sucking-and-pacifiers': 'doodleHeart',
  'early-signs-of-decay': 'doodleToothbrush',
  'inside-tiny-tusk': 'journeyLogo',
  'choosing-a-pediatric-dentist': 'journeySmile',
  'fluoride-varnish': 'doodleToothpaste',
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

export function ParentsCorner({ asPage = false }: { asPage?: boolean | undefined }) {
  if (!asPage) return <ParentsStrip />
  return <ParentsCornerPage />
}

type Ground = 'powder' | 'canary' | 'cobalt'

const GROUND_CLASS: Record<Ground, string> = {
  powder: 'bg-powder text-cobalt',
  canary: 'bg-canary text-cobalt',
  cobalt: 'bg-cobalt text-white',
}

/**
 * The seven posts in the clinic's own order, two to a chapter, on the home
 * page's grounds: powder, then a canary plate, then a cobalt one, then back to
 * powder. No two chapters of one colour touch, and the cobalt close runs on
 * into the cobalt footer. The two posts still waiting for photographs share
 * the cobalt chapter, where their colour discs stand out most.
 */
const CHAPTERS: readonly { ground: Ground; posts: readonly ParentArticle[] }[] = [
  { ground: 'powder', posts: PARENT_ARTICLES.slice(0, 2) },
  { ground: 'canary', posts: PARENT_ARTICLES.slice(2, 4) },
  { ground: 'cobalt', posts: PARENT_ARTICLES.slice(4, 6) },
  { ground: 'powder', posts: PARENT_ARTICLES.slice(6) },
]

/**
 * `/parents-corner` -- the blog, composed like the home page: colour chapters
 * joined by the tagline's smile, and no boxes. Each post sits straight on its
 * ground in the client's own running order: her photograph, then her question
 * under it, then the summary. The photographs stay plain, as she asked --
 * nothing is laid over them.
 *
 * The header is the home strip's, with the p32 move behind it: a canary
 * toothbrush scaled up into the powder field.
 */
function ParentsCornerPage() {
  const meta = useSectionMeta('parents')

  return (
    <>
      <section id="parents" aria-labelledby="parents-heading">
        {CHAPTERS.map((chapter, index) => {
          const previous = CHAPTERS[index - 1]
          return (
            <Fragment key={chapter.posts[0]?.id ?? index}>
              {previous ? <SmileEdge from={previous.ground} /> : null}
              <PostChapter ground={chapter.ground} posts={chapter.posts}>
                {index === 0 ? (
                  <>
                    <Doodle
                      name="doodleToothbrush"
                      tone="canary"
                      drawOnScroll
                      duration={1.4}
                      className="pointer-events-none absolute -right-14 top-20 w-48 rotate-[28deg] md:right-[2%] md:top-24 md:w-64 lg:right-[8%] lg:top-16 lg:w-80"
                    />
                    <div className="relative">
                      <SectionMarker label={meta.label} />
                      <h1
                        id="parents-heading"
                        data-reveal
                        className="mt-5 max-w-[14ch] font-display text-[clamp(2.4rem,10vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em] lg:max-w-none lg:text-balance"
                      >
                        The questions that come up at the <Circled tone="cobalt">sink</Circled>
                      </h1>
                      <p data-reveal="fast" className="mt-5 max-w-[36ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.15rem]">
                        Seven short reads, from first teeth and first visits to the habits in between.
                      </p>
                    </div>
                  </>
                ) : null}
              </PostChapter>
            </Fragment>
          )
        })}
      </section>
      <SmileEdge from="powder" />
      <BookingClose />
    </>
  )
}

/**
 * One colour chapter. Two posts sit side by side from `md`, the second a step
 * lower -- the home strip's wave, slowed down. A chapter holding one post sets
 * it as a spread instead, photograph and words side by side, so the row has no
 * hole in it.
 */
function PostChapter({ ground, posts, children }: { ground: Ground; posts: readonly ParentArticle[]; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
  const spread = posts.length === 1

  return (
    <div
      ref={ref}
      data-surface={ground}
      className={[
        'tt-section relative overflow-hidden px-6 pb-20 md:px-10 md:pb-28',
        children ? 'pt-24 md:pt-36' : 'pt-20 md:pt-28',
        GROUND_CLASS[ground],
      ].join(' ')}
    >
      <div className="mx-auto max-w-[1320px]">
        {children}
        <div className={['grid gap-16 md:grid-cols-2 md:gap-x-10 lg:gap-x-16', children ? 'mt-14 md:mt-20' : ''].join(' ')}>
          {posts.map((post, index) => (
            <Post key={post.id} post={post} dark={ground === 'cobalt'} spread={spread} lower={index % 2 === 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * One post, the whole of it a link. On hover or focus the cover tips a little
 * and the arrow steps forward -- transforms only.
 */
function Post({ post, dark, spread, lower }: { post: ParentArticle; dark: boolean; spread: boolean; lower: boolean }) {
  return (
    <article className={['relative', spread ? 'md:col-span-2' : '', lower ? 'md:mt-16' : ''].join(' ')}>
      <a
        href={`/parents-corner/${post.id}`}
        className={['group block', spread ? 'md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16' : ''].join(' ')}
      >
        <PostCover post={post} />
        <div className={spread ? 'mt-7 md:mt-0' : 'mt-7'}>
          <SectionMarker label={post.category} on={dark ? 'dark' : 'light'} />
          {/* The clinic's question, verbatim -- the article's own h1. */}
          <h2
            data-reveal
            className={[
              'mt-4 max-w-[22ch] font-display text-[clamp(1.65rem,6.6vw,2.35rem)] font-semibold leading-[1.08] tracking-[-0.015em]',
              dark ? 'text-canary' : '',
            ].join(' ')}
          >
            {post.question}
          </h2>
          <p
            data-reveal="fast"
            className={['mt-3 max-w-[42ch] font-sans text-[1.02rem] leading-[1.6] md:text-[1.1rem]', dark ? 'text-white/90' : ''].join(' ')}
          >
            {post.summary}
          </p>
          <span
            className={['mt-3 inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold', dark ? 'text-canary' : ''].join(' ')}
          >
            <span className="underline decoration-2 underline-offset-[6px]">Read this</span>
            <span className="block w-5 transition-transform duration-300 ease-entrance group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true">
              <Doodle name="markArrow" tone={dark ? 'canary' : 'cobalt'} />
            </span>
          </span>
        </div>
      </a>
    </article>
  )
}

/**
 * The client's photograph, plain. A post with no photograph yet (posts 5 and
 * 6) gets its own drawing on a disc of its colour instead -- the treatment
 * discs' treatment, each drawing in its disc's p24 partner -- rather than a
 * tile announcing that a photograph is missing.
 */
function PostCover({ post }: { post: ParentArticle }) {
  const tip = 'transition-transform duration-500 ease-entrance group-hover:-rotate-1 group-focus-visible:-rotate-1 group-active:scale-[0.98]'

  if (post.image) {
    return (
      <div className={`overflow-hidden rounded-[1.5rem] ${tip}`}>
        <ArticleImage image={post.image} className="aspect-[16/10]" />
      </div>
    )
  }

  // 62.5% of the width is the full height of a 16:10 frame, so the disc stands
  // exactly as tall as the photographs beside it.
  return (
    <div className="flex aspect-[16/10] items-center justify-center" aria-hidden="true">
      <span
        className={`grid aspect-square w-[62.5%] place-items-center rounded-full ${tip}`}
        style={{ background: colourVar(post.fill) }}
      >
        <Doodle
          name={POST_ART[post.id] ?? 'doodleHeart'}
          tone={post.fill === 'coral' ? 'canary' : 'cobalt'}
          drawOnScroll
          duration={1.2}
          className="w-[52%]"
        />
      </span>
    </div>
  )
}
