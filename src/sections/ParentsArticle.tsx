import { Fragment, useRef } from 'react'
import { ArticleImage } from '@/components/ArticleImage'
import { colourVar } from '@/components/BrandArtView'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { SmileEdge } from '@/components/SmileEdge'
import { PARENT_ARTICLES, POST_ART, type ParentArticle, type ParentSection } from '@/content/parents'
import { useReveal } from '@/lib/motion'
import { BookingClose } from './BookingClose'
import { AllQuestionsLink, QuestionBubbles } from './ParentsCorner'

/** Heading -> anchor id, so a section can be linked to directly. */
const slugify = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

type Ground = 'powder' | 'canary' | 'cobalt'

const GROUND_CLASS: Record<Ground, string> = {
  powder: 'bg-powder text-cobalt',
  canary: 'bg-canary text-cobalt',
  cobalt: 'bg-cobalt text-white',
}

/**
 * The masthead takes the post's own colour where that colour can carry words:
 * canary for a canary post, cobalt for a coral one (coral carries no text, hard
 * rule 1) and for a powder one, whose reading chapters below are powder too.
 */
const MASTHEAD: Record<ParentArticle['fill'], Ground> = {
  canary: 'canary',
  powder: 'cobalt',
  coral: 'cobalt',
}

interface Numbered {
  section: ParentSection
  index: number
}

/**
 * Sections run on in chapters: powder to read on, and a canary plate for any
 * section that carries a list -- the checklist a parent comes back to gets a
 * colour of its own instead of a box.
 */
function chaptersOf(sections: readonly ParentSection[]): { ground: Ground; sections: Numbered[] }[] {
  const chapters: { ground: Ground; sections: Numbered[] }[] = []
  sections.forEach((section, index) => {
    const ground: Ground = section.points ? 'canary' : 'powder'
    const last = chapters[chapters.length - 1]
    if (last && last.ground === ground) last.sections.push({ section, index })
    else chapters.push({ ground, sections: [{ section, index }] })
  })
  return chapters
}

/**
 * One Parents' Corner post -- `/parents-corner/<id>/` -- composed like the rest
 * of the site: colour chapters joined by the tagline's smile, and no boxes.
 *
 *   the post's colour -- its question, its opening words, and the client's
 *                        photograph beside them, plain (nothing is laid over
 *                        it); a post with no photograph shows its drawing on
 *                        a disc of its colour, as on the index
 *   powder / canary   -- the sections, numbered like the guide's contents
 *                        page (p2), heading beside the words on desktop;
 *                        sections with a list sit on canary
 *   powder            -- read next: three more questions, as the home page's
 *                        speech bubbles
 *   cobalt            -- the close, with the post's own last line, running on
 *                        into the footer
 *
 * Headings rise in as they arrive; the reading itself never waits on motion.
 */
export function ParentsArticle({ article }: { article: ParentArticle }) {
  const at = PARENT_ARTICLES.findIndex((a) => a.id === article.id)
  // The next three in the clinic's order, wrapping round, so every post is
  // somebody's "read next".
  const next = [1, 2, 3]
    .map((step) => PARENT_ARTICLES[(at + step) % PARENT_ARTICLES.length])
    .filter((post): post is ParentArticle => post !== undefined)
  const masthead = MASTHEAD[article.fill]
  const chapters = chaptersOf(article.sections)
  const last = chapters[chapters.length - 1]?.ground ?? masthead

  return (
    <>
      <article id="parents-article" aria-labelledby="parents-article-heading">
        <Masthead article={article} ground={masthead} />
        {chapters.map((chapter, index) => (
          <Fragment key={chapter.sections[0]?.section.heading ?? index}>
            <SmileEdge from={chapters[index - 1]?.ground ?? masthead} />
            <Chapter ground={chapter.ground} sections={chapter.sections} />
          </Fragment>
        ))}
      </article>
      {last === 'powder' ? null : <SmileEdge from={last} />}
      <ReadNext posts={next} />
      <SmileEdge from="powder" />
      <BookingClose line={article.closing} />
    </>
  )
}

function Masthead({ article, ground }: { article: ParentArticle; ground: Ground }) {
  const dark = ground === 'cobalt'

  return (
    <header
      data-surface={ground}
      className={`tt-section relative overflow-hidden px-6 pb-20 pt-24 md:px-10 md:pb-28 md:pt-36 ${GROUND_CLASS[ground]}`}
    >
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div>
          <SectionMarker label={article.category} on={dark ? 'dark' : 'light'} />
          {/* The clinic's question, verbatim. */}
          <h1
            id="parents-article-heading"
            className={[
              'mt-5 max-w-[20ch] font-display text-[clamp(2.1rem,8.2vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.025em]',
              dark ? 'text-canary' : '',
            ].join(' ')}
          >
            {article.question}
          </h1>
          <p
            className={[
              'mt-6 max-w-[46ch] font-sans text-[1.05rem] leading-[1.65] md:text-[1.15rem]',
              dark ? 'text-white/90' : '',
            ].join(' ')}
          >
            {article.intro}
          </p>
        </div>

        {article.image ? (
          // 16:10, as on the index. The photographs run from 4:3 to 16:9, and
          // two carry words and arrows near their sides that 4:3 cut off.
          <div className="overflow-hidden rounded-[1.5rem]">
            <ArticleImage image={article.image} className="aspect-[16/10]" eager />
          </div>
        ) : (
          <div className="flex justify-center lg:justify-end" aria-hidden="true">
            <span
              className="grid aspect-square w-[min(72vw,22rem)] place-items-center rounded-full"
              style={{ background: colourVar(article.fill) }}
            >
              <Doodle
                name={POST_ART[article.id] ?? 'doodleHeart'}
                tone={article.fill === 'coral' ? 'canary' : 'cobalt'}
                drawOnScroll
                tap
                duration={1.2}
                className="w-[52%]"
              />
            </span>
          </div>
        )}
      </div>
    </header>
  )
}

function Chapter({ ground, sections }: { ground: Ground; sections: Numbered[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  return (
    <div
      ref={ref}
      data-surface={ground}
      className={`tt-section relative overflow-hidden px-6 pb-20 pt-20 md:px-10 md:pb-24 md:pt-28 ${GROUND_CLASS[ground]}`}
    >
      <div className="mx-auto flex max-w-[1320px] flex-col gap-16 md:gap-20">
        {sections.map(({ section, index }) => (
          <Section key={section.heading} section={section} index={index} />
        ))}
      </div>
    </div>
  )
}

/** Number and heading beside the words on desktop, above them on a phone. */
function Section({ section, index }: Numbered) {
  const id = slugify(section.heading)

  return (
    <section aria-labelledby={id} className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
      <div>
        <span aria-hidden="true" className="block font-display text-[2.75rem] font-semibold leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2
          id={id}
          data-reveal
          className="mt-3 max-w-[18ch] scroll-mt-28 font-display text-[clamp(1.75rem,6.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.015em]"
        >
          {section.heading}
        </h2>
      </div>

      <div className="max-w-[40rem]">
        {section.paragraphs.map((para) => (
          <p key={para.slice(0, 32)} className="mt-5 font-sans text-[1.05rem] leading-[1.7] first:mt-0 md:text-[1.15rem]">
            {para}
          </p>
        ))}
        {section.points ? (
          <ul className={['flex list-none flex-col gap-4', section.paragraphs.length ? 'mt-7' : ''].join(' ')}>
            {section.points.map((point) => (
              <li
                key={point.slice(0, 32)}
                className="flex items-start gap-4 font-sans text-[1.05rem] leading-[1.65] md:text-[1.15rem]"
              >
                <span className="mt-[0.3em] block w-5 shrink-0" aria-hidden="true">
                  <Doodle name="markArrow" tone="cobalt" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

/** Three more questions, set as the home page sets them. */
function ReadNext({ posts }: { posts: ParentArticle[] }) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <nav
      ref={ref}
      data-surface="powder"
      aria-labelledby="read-next-heading"
      className="tt-section relative overflow-hidden bg-powder pb-10 pt-20 text-cobalt md:pb-16 md:pt-28"
    >
      <div className="mx-auto grid max-w-[1400px] gap-4 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <SectionMarker label="Parents' Corner" />
          <h2
            id="read-next-heading"
            data-reveal
            className="mt-5 font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          >
            Read next
          </h2>
        </div>
        <div className="hidden lg:block">
          <AllQuestionsLink />
        </div>
      </div>

      <QuestionBubbles posts={posts} label="More from Parents' Corner" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:hidden">
        <AllQuestionsLink />
      </div>
    </nav>
  )
}
