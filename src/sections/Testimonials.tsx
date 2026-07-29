import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { AWAITING_REAL_TESTIMONIALS, TESTIMONIALS } from '@/content/testimonials'
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
      className="tt-section overflow-hidden bg-cobalt py-24 md:py-32"
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

      <div className="tt-marquee-track mt-12 flex w-max gap-5 px-6 md:px-10" aria-hidden={AWAITING_REAL_TESTIMONIALS}>
        {cards.map((item, index) => (
          <figure
            key={index}
            className="flex w-[min(82vw,430px)] shrink-0 flex-col justify-between rounded-[2rem] bg-white p-7 text-cobalt md:p-9"
          >
            <blockquote className="font-display text-[clamp(1.6rem,2.5vw,2.4rem)] leading-tight">
              {AWAITING_REAL_TESTIMONIALS ? (
                <span className="text-cobalt-60">Awaiting a parent&rsquo;s words</span>
              ) : (
                <>&ldquo;{item.quote}&rdquo;</>
              )}
            </blockquote>
            <figcaption className="mt-8 border-t border-powder pt-4 font-sans text-sm">
              <span className="block font-semibold">{item.parent}</span>
              <span>{item.child}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
