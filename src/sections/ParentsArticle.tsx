import { ArticleImage } from '@/components/ArticleImage'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextPanel } from '@/components/TextPanel'
import { colourVar } from '@/components/BrandArtView'
import { carriesText } from '@/design/pairings'
import { PARENT_ARTICLES, type ParentArticle, type ParentSection } from '@/content/parents'

/** Heading -> anchor id, so a section can be linked to directly. */
const slugify = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * One Parents' Corner post -- `/parents-corner/<id>`.
 *
 * THE PROBLEM THIS LAYOUT SOLVES, because it was solved wrongly three times
 * first: an article is a column of text at a measure, and a desktop is three
 * measures wide. Capping the prose and centring it leaves bare paper down both
 * sides. Widening the prose fixes the paper and ruins the reading. Filling the
 * paper with a background stroke put artwork through the paragraphs. Filling it
 * with a contents list and a booking rail helped, but the page was still pale
 * type on a pale field for its whole length.
 *
 * The answer is not to fill the margin. It is to stop having one. Each section
 * is a FULL-BLEED BAND that alternates paper and powder, so colour runs edge to
 * edge and the reading column simply sits inside it. There is no empty side
 * because there is no side -- and the alternation gives a long post a rhythm,
 * which five identical stacked sections never had.
 *
 * Within a band the section number and heading take a column of their own and
 * the prose takes another, which is the guide's own contents-page device (p2)
 * doing the work an article needs anyway: telling you where you are.
 *
 * Type comes from the brand scale now (`text-h2`, `text-body`) rather than the
 * hand-picked 0.97rem values that made the page read as timid.
 *
 * The masthead above is unchanged: the post's own `fill` from
 * `content/parents.ts`, its photograph beside the heading, or the p27
 * monochrome mark for the two posts that have no photograph yet.
 *
 * Still no timeline -- an article is read top to bottom, so there is nothing
 * for a reveal to reveal, and no reduced-motion branch to keep in step.
 */
export function ParentsArticle({ article }: { article: ParentArticle }) {
  const others = PARENT_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3)
  const onPanel = !carriesText(article.fill)

  return (
    <article id="parents-article" aria-labelledby="parents-article-heading">
      <header
        data-surface={article.fill}
        className="tt-section relative overflow-hidden px-6 pb-16 pt-[6.5rem] md:px-10 md:pb-20 md:pt-32"
        style={{ background: colourVar(article.fill) }}
      >
        {/* With no photograph there is nothing to hold the other side of the
            masthead, so the p27 monochrome mark takes it: white at 33%,
            bleeding off the edge, the same treatment Parent Voices uses. */}
        {article.image ? null : (
          <div
            className="pointer-events-none absolute -right-20 top-1/2 hidden w-[26rem] -translate-y-1/2 opacity-[0.33] lg:block"
            aria-hidden="true"
          >
            <Logo variant="mark" tone="white" size={416} className="h-full w-full" />
          </div>
        )}

        {/* One container width for all seven, photograph or not, so every
            masthead starts its heading on the same line. */}
        <div
          className={[
            'relative z-10 mx-auto max-w-[76rem]',
            article.image ? 'lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14' : '',
          ].join(' ')}
        >
          <TextPanel surface={article.fill} className={article.image ? '' : 'max-w-[46rem]'}>
            <SectionMarker label={article.category} on={onPanel ? 'dark' : 'light'} />
            <h1
              id="parents-article-heading"
              className="mt-4 font-display text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.025em]"
              style={{ color: colourVar(onPanel ? 'canary' : 'cobalt') }}
            >
              {article.question}
            </h1>
            <p
              className="mt-6 max-w-measure font-sans text-[1.05rem] leading-[1.6]"
              style={{ color: colourVar(onPanel ? 'white' : 'cobalt') }}
            >
              {article.intro}
            </p>
          </TextPanel>

          {/* Only a real photograph earns this slot -- blown up beside a
              headline, the placeholder tile made "Clinic photograph on its way"
              the loudest thing on the two posts that have no picture yet. */}
          {article.image ? (
            <div className="mt-10 overflow-hidden rounded-[1.5rem] lg:mt-0">
              <ArticleImage image={article.image} className="aspect-[4/3]" eager />
            </div>
          ) : null}
        </div>
      </header>

      {article.sections.map((section, index) => (
        <Band key={section.heading} section={section} index={index} />
      ))}

      {/* The closing line is the post's last word, so it gets the full width
          and the display scale rather than a box at the end of a column. */}
      {/* No `tt-section` here either -- 512px of content behind a 720px
          reserve is 200px of scroll jump. See the note on `Band`. */}
      <section data-surface="cobalt" className="bg-cobalt px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[60rem]">
          <p className="max-w-[20ch] font-display text-h1 text-canary">{article.closing}</p>
          <StylisedCTA
            lead="Book"
            rest="a visit"
            href="/book"
            fill="canary"
            className="mt-10 min-h-[3.625rem] w-full max-w-[17.5rem]"
          />
        </div>
      </section>

      <nav
        aria-label="More from the blog"
        data-surface="paper"
        className="bg-paper px-6 py-16 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-[76rem]">
          <SectionMarker label="Read next" />
          {/* Each one wears its own fill, so the row rhymes with the index grid
              instead of being a list of underlined links. */}
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {others.map((other) => (
              <ReadNextCard key={other.id} article={other} />
            ))}
          </ul>
          <a
            href="/parents-corner"
            className="mt-8 inline-block font-sans text-body text-cobalt underline underline-offset-[3px]"
          >
            All of Parents&rsquo; Corner
          </a>
        </div>
      </nav>
    </article>
  )
}

/**
 * One section as a full-bleed band. Odd bands are powder, even are paper, which
 * is what gives a five-section post any rhythm at all. The aside list inside
 * has to flip with the band -- powder on paper, white on powder -- or it
 * disappears into the surface it is meant to stand out from.
 */
function Band({ section, index }: { section: ParentSection; index: number }) {
  const powder = index % 2 === 1
  const id = slugify(section.heading)

  return (
    <section
      data-surface={powder ? 'powder' : 'paper'}
      aria-labelledby={id}
      // Deliberately NOT `tt-section`: that class carries
      // `content-visibility: auto` with a 720px `contain-intrinsic-size`, and a
      // band is 250-500px. Every one of them would reserve 720px, paint, then
      // collapse as you scrolled past -- the scrollbar jumping the whole way
      // down. Containment is worth it for a viewport-sized section, not for a
      // paragraph and a heading.
      className={['px-6 py-14 md:px-10 md:py-20', powder ? 'bg-powder' : 'bg-paper'].join(' ')}
    >
      <div className="mx-auto grid max-w-[60rem] gap-6 md:grid-cols-[minmax(0,17rem)_minmax(0,40rem)] md:gap-12">
        <div className="md:pt-1">
          <span
            aria-hidden="true"
            className="block font-display text-[2.75rem] font-semibold leading-none text-coral"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2
            id={id}
            className="mt-3 scroll-mt-28 font-display text-h2 font-semibold text-cobalt"
          >
            {section.heading}
          </h2>
        </div>

        <div>
          {section.paragraphs.map((para) => (
            <p key={para.slice(0, 32)} className="mt-5 font-sans text-body text-cobalt first:mt-0">
              {para}
            </p>
          ))}

          {section.points ? (
            <ul
              data-surface={powder ? 'white' : 'powder'}
              className={[
                'mt-7 flex flex-col gap-3.5 rounded-[1.5rem] p-7',
                powder ? 'bg-white' : 'bg-powder',
              ].join(' ')}
            >
              {section.points.map((point) => (
                <li
                  key={point.slice(0, 32)}
                  className="flex gap-3.5 font-sans text-body text-cobalt"
                >
                  {/* Coral as a graphic mark, never carrying the text itself. */}
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-2 w-2 shrink-0 rounded-full bg-coral"
                  />
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function ReadNextCard({ article }: { article: ParentArticle }) {
  const onPanel = !carriesText(article.fill)

  return (
    <li
      data-surface={article.fill}
      className="overflow-hidden rounded-[1.5rem]"
      style={{ background: colourVar(article.fill) }}
    >
      <a
        href={`/parents-corner/${article.id}`}
        className="flex h-full min-h-14 flex-col p-6 transition-transform duration-500 ease-entrance active:-translate-y-0.5"
      >
        <TextPanel surface={article.fill} className="flex h-full flex-col">
          <p
            className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
            style={{ color: colourVar(onPanel ? 'canary' : 'cobalt') }}
          >
            {article.category}
          </p>
          <p
            className="mt-2.5 font-display text-[1.15rem] font-semibold leading-snug"
            style={{ color: colourVar(onPanel ? 'canary' : 'cobalt') }}
          >
            {article.question}
          </p>
          <span className="mt-5 block w-4" aria-hidden="true">
            <Doodle name="markArrow" tone={onPanel ? 'canary' : 'coral'} />
          </span>
        </TextPanel>
      </a>
    </li>
  )
}
