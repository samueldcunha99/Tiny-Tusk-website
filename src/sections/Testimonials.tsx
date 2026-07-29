import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import {
  AWAITING_REAL_TESTIMONIALS,
  TESTIMONIAL_PROMPTS,
  TESTIMONIALS,
} from '@/content/testimonials'
import { sectionMeta } from '@/content/site'

/**
 * Parent voices — a slow marquee of quote cards on cobalt, with white-at-33%
 * doodles drifting behind (guide p27).
 *
 * While `AWAITING_REAL_TESTIMONIALS` is true the section keeps its layout but
 * states plainly that quotes are pending, rather than displaying placeholder
 * text that a visitor could read as a real review. See content/testimonials.ts.
 */
export function Testimonials() {
  const meta = sectionMeta('voices')
  // Duplicated so the marquee loop is seamless.
  const cards = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section
      id="voices"
      className="tt-section overflow-hidden bg-cobalt py-20 md:py-24"
      data-surface="cobalt"
      aria-labelledby="voices-heading"
    >
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        {/* Decorative marks sit behind the heading, never across it. */}
        <Doodle
          name="markLasso"
          tone="white"
          className="pointer-events-none absolute -right-8 -top-6 w-56 opacity-[0.33]"
        />
        <Doodle
          name="markZigzag"
          tone="white"
          className="pointer-events-none absolute -bottom-10 right-24 w-36 opacity-[0.33]"
        />

        <div className="relative z-10">
          <SectionNumber number={meta.number} label={meta.label} tone="canary" />
          <h2 id="voices-heading" className="mt-4 max-w-3xl font-display text-h1 text-canary">
            The words we keep hearing
          </h2>
          {AWAITING_REAL_TESTIMONIALS ? (
            <p className="mt-5 max-w-measure font-sans text-body text-white">
              We are collecting these properly — with the permission of the families who said
              them. Real quotes will appear here once consent is in hand.
            </p>
          ) : null}
        </div>
      </div>

      {AWAITING_REAL_TESTIMONIALS ? (
        <div className="relative z-10 mx-auto mt-10 grid max-w-[1400px] gap-5 px-6 md:grid-cols-3 md:px-10">
          {TESTIMONIAL_PROMPTS.map((prompt, index) => (
            <article
              key={prompt.title}
              className={[
                'rounded-[2rem] p-7 text-cobalt md:p-9',
                index === 1 ? 'bg-canary' : index === 2 ? 'bg-powder' : 'bg-white',
              ].join(' ')}
            >
              <Doodle name={prompt.glyph} tone="cobalt" className="w-16" />
              <p className="mt-6 font-display text-h2">{prompt.title}</p>
              <p className="mt-3 font-sans text-base leading-relaxed">{prompt.body}</p>
            </article>
          ))}
          <div className="rounded-[2rem] border-2 border-white/30 p-7 text-white md:col-span-3 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div>
              <p className="font-display text-h2 text-canary">Consent comes first</p>
              <p className="mt-2 max-w-2xl font-sans text-base leading-relaxed">
                A family chooses what is shared and how they are attributed. No quote appears here before that is agreed.
              </p>
            </div>
            <a
              href="/book"
              className="mt-6 inline-flex min-h-12 shrink-0 items-center rounded-full bg-canary px-6 font-sans font-semibold text-cobalt md:mt-0"
            >
              Plan a visit
            </a>
          </div>
        </div>
      ) : (
        <div className="tt-marquee-track mt-12 flex w-max gap-5 px-6 md:px-10">
          {cards.map((item, index) => (
            <figure
              key={index}
              className="flex w-[min(82vw,430px)] shrink-0 flex-col justify-between rounded-[2rem] bg-white p-7 text-cobalt md:p-9"
            >
              <blockquote className="font-display text-[clamp(1.6rem,2.5vw,2.4rem)] leading-tight">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-powder pt-4 font-sans text-sm">
                <span className="block font-semibold">{item.parent}</span>
                <span>{item.child}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}
