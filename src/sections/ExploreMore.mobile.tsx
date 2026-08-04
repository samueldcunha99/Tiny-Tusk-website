import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { StylisedCTA } from '@/components/StylisedCTA'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { EXPLORE_HEADING, EXPLORE_LINKS } from '@/content/exploreMore'
import { CLINIC } from '@/content/site'

/**
 * The mobile home's tail: an index of every page the home does not inline,
 * then the one action worth ending on.
 *
 * DELIBERATELY TILED, not typographic. `GuidedEntryMobile` sits directly above
 * and is already a stack of full-width rules and rows; a second list in the
 * same idiom read as one long undifferentiated column. A 2-up grid of small
 * cards breaks the rhythm and costs about half the height.
 *
 * Carries no `SectionNumber`. The numbered arc on this page is 00 Welcome and
 * 01 Start Here -- the content sections. This is wayfinding and a call to
 * action, so numbering it would push the count past what the visitor can
 * actually read here (see CLAUDE.md §4 on continuous numbering).
 *
 * One animation system: the cards clip-reveal on entry. The doodles rest
 * complete, as they do everywhere else.
 */
export function ExploreMoreMobile() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-explore-card]', {
        y: 28,
        opacity: 0,
        duration: 0.6,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: '[data-explore-grid]', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="explore"
      ref={ref}
      data-surface="powder"
      className="tt-section relative bg-powder px-6 pb-16 pt-14"
      aria-labelledby="explore-heading"
    >
      <h2
        id="explore-heading"
        className="font-display text-[clamp(1.75rem,8vw,2.25rem)] leading-[1.05] tracking-[-0.02em] text-cobalt"
        data-animate
      >
        {EXPLORE_HEADING}
      </h2>

      <ul className="mt-6 grid grid-cols-2 gap-3" data-explore-grid>
        {EXPLORE_LINKS.map((link) => (
          <li key={link.id} data-explore-card>
            <a
              href={link.href}
              className={[
                'flex h-full min-h-[9.5rem] flex-col justify-between rounded-2xl p-4',
                'active:opacity-70',
                // Both fills are legal surfaces in their own right and both
                // carry cobalt: canary + cobalt is p24, paper + cobalt is p26.
                link.feature ? 'bg-canary' : 'bg-paper',
              ].join(' ')}
            >
              <span className="w-11" aria-hidden="true">
                <Doodle name={link.glyph} tone="cobalt" />
              </span>
              <span>
                <span className="block font-display text-[1.35rem] leading-[1.1] text-cobalt">
                  {link.label}
                </span>
                <span className="mt-1.5 block font-sans text-[0.8rem] leading-snug text-cobalt/70">
                  {link.hint}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* The page ends on the one thing a parent came to do. A band rather
          than the full booking form: the form is 880px of the old page and it
          already has its own route, reached from here and from the nav. */}
      <div className="mt-10 rounded-[1.75rem] bg-cobalt p-6 text-center" data-surface="cobalt">
        <p className="font-display text-[clamp(1.5rem,7vw,2rem)] leading-[1.1] text-canary">
          Ready when you are
        </p>
        <p className="mx-auto mt-3 max-w-[30ch] font-sans text-[0.95rem] leading-relaxed text-white/90">
          Tell us a little about your child and we will take it from there.
        </p>
        <StylisedCTA
          lead="Book"
          rest="a visit"
          href="/book"
          fill="canary"
          className="mt-6 w-full max-w-[19rem]"
        />
        <p className="mt-4 font-sans text-[0.8rem] text-white/70">
          {CLINIC.tagline}
        </p>
      </div>
    </section>
  )
}
