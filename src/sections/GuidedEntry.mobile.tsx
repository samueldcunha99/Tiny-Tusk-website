import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { colourVar } from '@/components/BrandArtView'
import { gsap, EASE, STAGGER, primeDraw, usePrefersReducedMotion } from '@/lib/motion'
import { GUIDED_ANSWERS, GUIDED_QUESTION } from '@/content/guidedEntry'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * The mobile home's front door: one question, four answers in a parent's own
 * words, each routing to the part of the site that answers it.
 *
 * Deliberately typographic rather than tiled. The rows are separated by drawn
 * strokes, not borders, so the section reads as one continuous line running
 * down the page -- the same logic as the logo, at page scale (§4).
 *
 * Two systems only: the rules draw, the text clip-reveals. The doodles rest
 * complete and are never animated here, which is what keeps it calm.
 */
export function GuidedEntryMobile() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('paths')

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const rules = Array.from(root.querySelectorAll<SVGPathElement>('[data-rule]'))

    if (reduced) {
      rules.forEach((rule) => primeDraw(rule, true))
      return
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-guided-line]', {
        yPercent: 110,
        duration: 0.9,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: root, start: 'top 80%' },
      })

      rules.forEach((rule) => {
        const length = primeDraw(rule, false)
        gsap.fromTo(
          rule,
          { strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: EASE.entrance,
            scrollTrigger: { trigger: rule.closest('[data-answer]'), start: 'top 88%' },
          },
        )
      })

      gsap.from('[data-answer-inner]', {
        yPercent: 60,
        opacity: 0,
        duration: 0.7,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: '[data-answer-list]', start: 'top 82%' },
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="start-here"
      ref={ref}
      data-surface="paper"
      className="tt-section relative bg-paper px-6 pb-4 pt-20"
      aria-labelledby="start-here-heading"
    >
      <div className="overflow-hidden">
        <div data-guided-line>
          <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        </div>
      </div>

      {/* The question carries the section. It is set larger than the shared
          display step, which tops out at 13vw and reads timid on a phone. */}
      <h2
        id="start-here-heading"
        className="mt-4 font-display text-[clamp(2.75rem,12.5vw,4rem)] leading-[1.02] tracking-[-0.025em] text-cobalt"
        data-animate
      >
        <span className="block overflow-hidden">
          <span className="block" data-guided-line>
            What brings you
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="block" data-guided-line>
            here today?
          </span>
        </span>
        <span className="sr-only">{GUIDED_QUESTION}</span>
      </h2>

      <ul className="mt-10" data-answer-list>
        {GUIDED_ANSWERS.map((item) => (
          <li key={item.id} data-answer className="relative">
            {/* A drawn rule, not a border: it has the wobble of the brand's
                own line and it draws rather than simply appearing. */}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 400 6"
              preserveAspectRatio="none"
              className="block h-[3px] w-full"
            >
              <path
                data-rule
                data-draw
                d="M 0 3 C 90 1, 150 5, 230 3 S 330 1, 400 3"
                fill="none"
                stroke={colourVar('powder')}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </svg>

            <a
              href={item.href}
              className="group flex min-h-[7.25rem] items-center gap-5 py-6 active:opacity-70"
            >
              <span data-answer-inner className="flex w-full items-center gap-5">
                <span className="w-14 shrink-0">
                  <Doodle name={item.glyph} tone="cobalt" />
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className="block font-display text-[clamp(1.5rem,6.5vw,2rem)] leading-[1.1] text-cobalt"
                    data-animate
                  >
                    {item.answer}
                  </span>
                  <span className="mt-2 block font-sans text-[0.9rem] leading-snug text-cobalt/70">
                    {item.hint}
                  </span>
                </span>

                {/* The arrow is brand artwork, resting complete. */}
                <span className="w-7 shrink-0" aria-hidden="true">
                  <Doodle name="markArrow" tone="coral" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
