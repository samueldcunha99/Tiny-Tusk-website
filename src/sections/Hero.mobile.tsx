import { useEffect, useRef } from 'react'
import { LoopField } from '@/components/LoopField'
import { StylisedCTA } from '@/components/StylisedCTA'
import { Doodle } from '@/components/Doodle'
import { Roundel } from '@/components/Roundel'
import { SectionMarker } from '@/components/SectionMarker'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { CLINIC, HERO } from '@/content/site'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Mobile hero.
 *
 * NO PHOTOGRAPH, AND THEREFORE NO FULL-HEIGHT SECTION
 *
 * This was built around an image because the type alone measures ~380px on a
 * 390px phone against a 650-850px viewport: every purely typographic version
 * left 130-400px of empty powder, and `min-h`/`justify-*` only moved the gap
 * around. The photograph was the height sink that absorbed it.
 *
 * The client removed the photograph, so the sink is gone -- and with it the
 * reason to claim the whole viewport. The section now takes the height its
 * type needs and the next one starts right under it. Do NOT put `min-h-[100svh]`
 * back without putting something in the space it creates.
 *
 * WHAT THE REDESIGN ADDS
 *
 * The tagline roundel, set beside the headline. It is the guide's own p14 unit
 * and the phone site previously used it once, 900px down in the footer. At
 * 6.5rem it reads as a stamp against the display face without competing with
 * it, and it fills the ragged right of a two-line flush-left headline.
 *
 * Body copy is `HERO.bodyLede` -- the verbatim opening sentence of the guide's
 * p34 welcome, never a reworded summary. The full paragraph is four sentences
 * and pushed the CTA below the fold.
 *
 * The CTA points at `/book`, not `HERO.cta.href` -- that anchor targets the
 * Booking section, which is not on this page.
 *
 * PAPER, NOT POWDER, AND NO NUMERAL. Paper is the page's one ground now (see
 * `Home.mobile.tsx`); powder here made the hero the first of five ground
 * changes in five screens. The wayfinding row keeps its label and loses the
 * "00" for the same reason a book does not number its cover.
 */
export function HeroMobile() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('hero')

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line] > span')
      gsap.set(lines, { yPercent: 112 })
      gsap
        .timeline({ delay: 0.2 })
        .to(lines, { yPercent: 0, duration: 1.15, ease: EASE.entrance, stagger: STAGGER })
        .from(
          '[data-hero-fade]',
          { y: 16, opacity: 0, duration: 0.8, ease: EASE.entrance, stagger: STAGGER },
          '-=0.6',
        )
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="hero"
      ref={ref}
      data-surface="powder"
      className="relative isolate overflow-hidden bg-powder"
    >
      {/* One of the page's two artwork fields; the other is on Dr. Nupur. */}
      <LoopField surface="powder" contrast="high" depth={0.28} count={2} />

      <div className="relative z-10 px-6 pb-14 pt-[6.25rem]">
        <div data-hero-fade>
          <SectionMarker label={meta.label} />
        </div>

        {/* Headline and roundel share a row: the headline is flush left and
            ragged right, and the roundel occupies the rag instead of leaving
            it as a hole. `items-start` so the roundel hangs off the cap line
            of the first word rather than centring against three lines. */}
        <div className="mt-5 flex items-start justify-between gap-3">
          <h1
            className="font-display text-[clamp(3rem,16vw,4.5rem)] font-semibold leading-[0.88] tracking-[-0.035em] text-cobalt"
            data-animate
          >
            {/* `pb`/`-mb` pair: at leading 0.88 the line box is shorter than
                the glyphs, so `overflow-hidden` (which the clip reveal needs)
                sliced the descender off the "y" in Tiny. The padding gives the
                clip box room; the negative margin takes it back off layout. */}
            {HERO.headline.map((line) => (
              <span
                key={line}
                data-hero-line
                className="-mb-[0.16em] block overflow-hidden pb-[0.16em]"
              >
                <span className="block">{line}</span>
              </span>
            ))}
          </h1>

          <div className="mt-1.5 w-[6.5rem] shrink-0" data-hero-fade>
            <Roundel
              tone="cobalt"
              title={CLINIC.name + ': ' + CLINIC.tagline}
              className="aspect-square w-full"
            />
          </div>
        </div>

        <p
          // Full-strength: cobalt on powder is 4.92:1, so every tint of it
          // falls under AA at this size (docs/contrast-audit.md).
          className="mt-4 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-cobalt"
          data-hero-fade
        >
          {HERO.headlineTail}
        </p>

        <p
          className="mt-3.5 max-w-[30ch] font-sans text-[1.0625rem] leading-[1.5] text-cobalt"
          data-hero-fade
          data-animate
        >
          {HERO.bodyLede}
        </p>

        <div className="mt-6 flex flex-col items-start gap-3.5" data-hero-fade data-animate>
          {/* Capped rather than full-bleed: the ellipse is drawn artwork
              stretched with preserveAspectRatio="none", so at full phone width
              it flattens into a band and stops reading as the guide's shape. */}
          <StylisedCTA
            lead={HERO.cta.lead}
            rest={HERO.cta.rest}
            href="/book"
            fill="canary"
            className="min-h-[3.75rem] w-full max-w-[20rem]"
          />
          {/* The whole journey lives on its own route now that the home strip
              is cut, so this is the only way to it from the top of the page. */}
          <a
            href="/journey"
            className="flex min-h-11 w-fit items-center gap-2.5 font-sans text-[0.9rem] text-cobalt"
          >
            <span className="whitespace-nowrap underline underline-offset-4">
              See how a visit goes
            </span>
            <span className="w-4 rotate-90" aria-hidden="true">
              <Doodle name="markArrow" tone="coral" />
            </span>
          </a>
        </div>

      </div>

    </section>
  )
}
