import { useRef } from 'react'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextOnPath } from '@/components/TextOnPath'
import { TESTIMONIALS, TESTIMONIAL_PROMPTS, type Testimonial } from '@/content/testimonials'
import { useSectionMeta } from '@/content/sectionOrder'
import { useReveal } from '@/lib/motion'

/**
 * Parent voices -- a cobalt plate between the canary treatments and the
 * powder questions, so the page no longer runs three pale chapters in a row.
 * Set like the guide's p35 cobalt square: canary type on a path ringing a
 * canary face, and the parent's own words large beside it in canary display
 * type (p24).
 *
 * Real, sourced words only (content/testimonials.ts). With nothing sourced, it
 * says so and shows what is being collected instead.
 */
export function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('voices')
  useReveal(ref)

  return (
    <section
      id="voices"
      ref={ref}
      data-surface="cobalt"
      aria-labelledby="voices-heading"
      className="tt-section relative overflow-hidden bg-cobalt px-6 pb-20 pt-20 text-white md:px-10 md:pb-24 md:pt-28"
    >
      <div className="relative mx-auto max-w-[1320px]">
        <SectionMarker label={meta.label} on="dark" />
        {TESTIMONIALS.length > 0 ? <Voices /> : <Awaiting />}
      </div>
    </section>
  )
}

/**
 * Phone: the headline with the stamp beside it, the words below. Desktop: the
 * headline runs the full width on one line, then the stamp and the words sit
 * side by side, so neither column is left with a hole under it.
 */
function Voices() {
  return (
    <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 gap-y-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-x-20 lg:gap-y-14">
      <h2
        id="voices-heading"
        data-reveal
        className="max-w-[12ch] font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] lg:col-span-2 lg:max-w-none"
      >
        Parents tell it <Circled tone="canary">better</Circled> than we can
      </h2>

      <div className="relative mt-2 aspect-square w-28 md:w-40 lg:row-start-2 lg:mt-0 lg:w-80" aria-hidden="true">
        <TextOnPath text="Kindness • Patience • A whole lot of heart" mode="ring" tone="canary" className="absolute inset-0 h-full w-full" />
        <Doodle
          name="doodleFace"
          tone="canary"
          drawOnScroll
          tap
          className="absolute left-1/2 top-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <ul className="col-span-2 flex list-none flex-col gap-12 lg:col-span-1 lg:col-start-2 lg:row-start-2">
        {TESTIMONIALS.map((testimonial) => (
          <Note key={testimonial.parent + testimonial.quote} testimonial={testimonial} />
        ))}
        <li>
          <p className="max-w-[46ch] font-sans text-[0.95rem] leading-[1.6] text-white/80">
            Every word here was written by a parent who brought their child in. We publish them as
            they were written, and we do not tidy anyone&rsquo;s grammar.
          </p>
        </li>
      </ul>
    </div>
  )
}

/** An open quotation: no card, no rotation -- the words and who said them. */
function Note({ testimonial }: { testimonial: Testimonial }) {
  return (
    <li>
      <figure>
        <blockquote>
          <p
            data-reveal="fast"
            className="max-w-[30ch] font-display text-[clamp(1.6rem,6.6vw,2.75rem)] leading-[1.2] tracking-[-0.01em] text-canary"
          >
            {`“${testimonial.quote}”`}
          </p>
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 font-sans text-[1rem]">
          <Doodle name="doodleHeart" tone="canary" drawOnScroll tap className="w-7 shrink-0" />
          <span>
            <cite className="font-semibold not-italic">{testimonial.parent}</cite>
            <span className="text-white/80">{` · ${testimonial.child}`}</span>
          </span>
        </figcaption>
      </figure>
    </li>
  )
}

/** No reviews in hand. Says so, and says what is being collected. */
function Awaiting() {
  return (
    <div className="mt-5 grid gap-10 lg:grid-cols-2 lg:gap-20">
      <div>
        <h2
          id="voices-heading"
          data-reveal
          className="max-w-[16ch] font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
        >
          We are collecting these properly
        </h2>
        <p className="mt-5 max-w-[48ch] font-sans text-[1.05rem] leading-[1.6] text-white/90">
          There are no reviews here yet, and we would rather show none than invent any. Once
          families have visited we will ask for their words in writing, publish only what they
          approve, and attribute them exactly as they prefer.
        </p>
        <div className="-m-4 mt-5 p-4">
          <StylisedCTA lead="Be" rest="one of the first families" href="/book/" fill="canary" />
        </div>
      </div>
      <ul className="flex list-none flex-col gap-8">
        {TESTIMONIAL_PROMPTS.map((prompt) => (
          <li key={prompt.title} className="flex items-start gap-4">
            <Doodle name={prompt.glyph} tone="canary" drawOnScroll className="w-10 shrink-0" />
            <div>
              <h3 className="font-display text-[1.35rem] leading-snug text-canary">{prompt.title}</h3>
              <p className="mt-1 max-w-[44ch] font-sans text-[1rem] leading-relaxed text-white/90">{prompt.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
