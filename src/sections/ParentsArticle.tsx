import { ArticleImage } from '@/components/ArticleImage'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { PARENT_ARTICLES, type ParentArticle } from '@/content/parents'

/**
 * One Parents' Corner post -- `/parents-corner/<id>`.
 *
 * Built for the phone and left at one column everywhere: a post is a measure of
 * text, and a measure of text does not get better with a second column. The
 * `max-w-measure` cap is what keeps it readable when it does land on a desktop.
 *
 * No timeline in here. An article is read top to bottom, so there is nothing
 * for a reveal to reveal; skipping motion also means there is no reduced-motion
 * branch to keep in step.
 */

export function ParentsArticle({ article }: { article: ParentArticle }) {
  const others = PARENT_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <article
      id="parents-article"
      data-surface="paper"
      className="tt-section relative bg-paper px-6 pb-16 pt-[6.5rem] md:px-10"
      aria-labelledby="parents-article-heading"
    >
      <div className="mx-auto max-w-[42rem]">
        <SectionMarker label={article.category} />

        <h1
          id="parents-article-heading"
          className="mt-4 font-display text-[clamp(1.9rem,7.6vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-cobalt"
        >
          {article.question}
        </h1>

        <div className="mt-6 overflow-hidden rounded-[1.5rem]">
          <ArticleImage image={article.image} eager />
        </div>

        {/* The intro is set a step up from the body so the post has an opening
            rather than starting mid-paragraph. */}
        <p className="mt-7 font-sans text-[1.05rem] leading-[1.6] text-cobalt">{article.intro}</p>

        {article.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="font-display text-[1.3rem] font-semibold leading-[1.2] text-cobalt">
              {section.heading}
            </h2>

            {section.paragraphs.map((para) => (
              <p
                key={para.slice(0, 32)}
                className="mt-3 font-sans text-[0.97rem] leading-[1.65] text-cobalt"
              >
                {para}
              </p>
            ))}

            {section.points ? (
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.points.map((point) => (
                  <li
                    key={point.slice(0, 32)}
                    className="flex gap-3 font-sans text-[0.97rem] leading-[1.6] text-cobalt"
                  >
                    {/* Coral as a graphic mark, never carrying the text itself. */}
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <p className="mt-10 font-display text-[clamp(1.4rem,6vw,1.75rem)] font-semibold leading-[1.12] text-cobalt">
          {article.closing}
        </p>
        <StylisedCTA
          lead="Book"
          rest="a visit"
          href="/book"
          fill="canary"
          className="mt-6 min-h-[3.625rem] w-full max-w-[17.5rem]"
        />

        <nav aria-label="More from Parents' Corner" className="mt-12 border-t border-cobalt-20 pt-6">
          <h2 className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-cobalt">
            Read next
          </h2>
          <ul className="mt-3">
            {others.map((other) => (
              <li key={other.id} className="border-b border-cobalt-20 last:border-b-0">
                <a
                  href={`/parents-corner/${other.id}`}
                  className="flex min-h-14 items-center justify-between gap-4 py-3 font-sans text-[0.95rem] leading-snug text-cobalt"
                >
                  <span className="underline underline-offset-[3px]">{other.question}</span>
                  <span className="w-3.5 shrink-0" aria-hidden="true">
                    <Doodle name="markArrow" tone="coral" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/parents-corner"
            className="mt-5 inline-block font-sans text-[0.9rem] text-cobalt underline underline-offset-[3px]"
          >
            All of Parents&rsquo; Corner
          </a>
        </nav>
      </div>
    </article>
  )
}
