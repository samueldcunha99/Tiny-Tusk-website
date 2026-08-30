import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TESTIMONIALS, TESTIMONIAL_PROMPTS, type Testimonial } from '@/content/testimonials'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * 09 Parent Voices -- powder.
 *
 * Two states, chosen by whether `TESTIMONIALS` actually holds anything. There
 * is no separate flag to keep in sync: an empty array renders the "we are
 * collecting these properly" state, a populated one renders real words.
 *
 * Reviews are small pinned notes, not a pull-quote. A single review set at
 * heading size filled a whole viewport and read as a wall of text -- it made
 * one parent's sentence look like a manifesto. At card size the same words read
 * as what they are: someone leaning over and telling you it went fine. The
 * cards alternate white and canary, sit at alternating slight angles like notes
 * on a board, and straighten under the cursor. The angle is a static transform
 * and the straightening is `motion-safe` only, so reduced motion gets tidy
 * upright cards and no movement.
 *
 * The layout is the same two-column grid as the awaiting state on purpose: the
 * left column carries the weight so one lonely card never floats in dead space.
 */
export function Testimonials() {
  const meta = useSectionMeta('voices')

  return (
    <section
      id="voices"
      className="tt-section relative overflow-hidden bg-powder px-6 py-20 md:px-10 md:py-24"
      data-surface="powder"
      aria-labelledby="voices-heading"
    >
      <div className="pointer-events-none absolute -left-10 top-10 w-[13.75rem] opacity-[0.33]" aria-hidden="true">
        <Logo variant="mark" tone="white" size={220} className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute -right-8 bottom-5 w-[10.625rem] opacity-[0.33]" aria-hidden="true">
        <Logo variant="mark" tone="white" size={170} className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />
        {TESTIMONIALS.length > 0 ? <Voices /> : <Awaiting />}
      </div>
    </section>
  )
}

function Voices() {
  return (
    <div className="mt-4 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
      <div>
        <h2 id="voices-heading" className="max-w-[16ch] font-display text-h1 text-cobalt">
          Parents tell it <Circled tone="coral">better</Circled> than we can
        </h2>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
          Every word here was written by a parent who brought their child in. We publish them as
          they were written, and we do not tidy anyone&rsquo;s grammar.
        </p>
        <div className="mt-9">
          <StylisedCTA lead="Book" rest="your child's first visit" href="/book" fill="canary" />
        </div>
      </div>

      <ul className="flex list-none flex-col gap-7">
        {TESTIMONIALS.map((testimonial, index) => (
          <Note key={testimonial.parent + testimonial.quote} testimonial={testimonial} index={index} />
        ))}
      </ul>
    </div>
  )
}

/**
 * One pinned note. `index` only picks the fill and which way it leans, so the
 * stack alternates instead of looking like a form.
 */
function Note({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const even = index % 2 === 0
  // Both fills carry text; coral is never used here (hard rule 1).
  const fill = even ? 'bg-white' : 'bg-canary'
  // Coral reads at 2.39:1 on canary. Decorative, so not a failure, but weak --
  // the heart takes cobalt on the canary card and coral on the white one.
  const heart = even ? 'coral' : 'cobalt'

  return (
    <li
      className={[
        even ? 'rotate-[-1.4deg]' : 'rotate-[1.4deg]',
        'motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:rotate-0',
      ].join(' ')}
    >
      <blockquote className={`relative max-w-[30rem] rounded-[1.75rem] p-6 md:p-7 ${fill}`}>
        <p className="font-sans text-base leading-relaxed text-cobalt">
          {`\u201c${testimonial.quote}\u201d`}
        </p>
        <footer className="mt-4 flex items-center gap-2.5">
          <Doodle name="doodleHeart" tone={heart} drawOnScroll className="w-5 shrink-0" />
          <p className="font-sans text-sm text-cobalt">
            <cite className="font-semibold not-italic">{testimonial.parent}</cite>
            {` \u00b7 ${testimonial.child}`}
          </p>
        </footer>
        {/* The bubble's tail: a corner of the card itself, so it inherits the fill. */}
        <span
          aria-hidden="true"
          className={`absolute -bottom-2 left-10 h-5 w-5 rotate-45 rounded-br-[0.35rem] ${fill}`}
        />
      </blockquote>
    </li>
  )
}

/** No reviews in hand. Says so, and says what is being collected. */
function Awaiting() {
  return (
    <div className="mt-4 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
      <div>
        <h2 id="voices-heading" className="max-w-[20ch] font-display text-h1 text-cobalt">
          We are collecting these properly
        </h2>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
          There are no reviews here yet, and we would rather show none than invent any. Once
          families have visited we will ask for their words in writing, publish only what they
          approve, and attribute them exactly as they prefer.
        </p>
        <div className="mt-9">
          <StylisedCTA lead="Be" rest="one of the first families" href="/book" fill="canary" />
        </div>
      </div>

      <ul className="flex list-none flex-col gap-4">
        {TESTIMONIAL_PROMPTS.map((prompt) => (
          <li key={prompt.title} className="flex items-start gap-[1.125rem] rounded-[2rem] bg-white p-7">
            <Doodle
              name={prompt.glyph}
              tone={prompt.glyph === 'markDashes' ? 'coral' : 'cobalt'}
              drawOnScroll
              className="w-11 shrink-0"
            />
            <div>
              <h3 className="font-display text-xl leading-snug text-cobalt">{prompt.title}</h3>
              <p className="mt-1.5 max-w-measure font-sans text-base leading-relaxed text-cobalt">
                {prompt.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
