import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { AWAITING_REAL_TESTIMONIALS, TESTIMONIAL_PROMPTS } from '@/content/testimonials'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * 09 Parent Voices -- powder.
 *
 * `AWAITING_REAL_TESTIMONIALS` is still the gate and the placeholder
 * `TESTIMONIALS` array is still never rendered. What changes is that the
 * awaiting state now looks intentional rather than broken: the p27 monochrome
 * mark at 33% white bleeds off both edges as the section's own artwork, the
 * left column says plainly what is being collected and how, and the three
 * prompts sit beside it as white cards.
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

        <div className="mt-4 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <h2 id="voices-heading" className="max-w-[20ch] font-display text-h1 text-cobalt">
              We are collecting these properly
            </h2>
            <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
              {AWAITING_REAL_TESTIMONIALS
                ? 'There are no reviews here yet, and we would rather show none than invent any. Once families have visited we will ask for their words in writing, publish only what they approve, and attribute them exactly as they prefer.'
                : 'Words from the families who have visited us.'}
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
      </div>
    </section>
  )
}
