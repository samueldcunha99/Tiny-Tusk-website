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
 * FULL-HEIGHT, WITH THE SPACE SPENT RATHER THAN LEFT
 *
 * History: this was built around a photograph, because the type alone measures
 * ~380px on a 390px phone against a 650-850px viewport. When the client pulled
 * the photograph the section was cut back to the height its type needed, on the
 * grounds that `min-h`/`justify-*` only moved the leftover gap around.
 *
 * That let the Journey section sit half in frame on first paint, so the phone
 * opened on two competing headlines and neither owned the screen. The section
 * claims the viewport again -- but the standing warning attached to that
 * decision holds, so the space is spent, not left:
 *
 *   - the column is a flex column, so the leftover height lands in one place
 *     instead of being shared out as slack between every element;
 *   - `mt-auto` drops the journey link onto the bottom edge, where it doubles
 *     as the scroll affordance the full-height section now needs;
 *   - the gap therefore opens between the CTA and that link -- the one seam in
 *     the stack that reads as breathing room rather than as a hole.
 *
 * `min-h-svh`, not `h-svh` and not `vh`: `min-h` lets a small phone (an SE at
 * ~553 visible px, against ~615px of content) grow the section instead of
 * clipping the CTA, and `svh` measures the viewport with the browser chrome
 * shown, which is the state the page is actually painted in.
 *
 * WHAT THE REDESIGN ADDS
 *
 * The tagline roundel, set beside the headline. It is the guide's own p14 unit
 * and the phone site previously used it once, 900px down in the footer. At
 * 6.5rem it reads as a stamp against the display face without competing with
 * it, and it fills the ragged right of a two-line flush-left headline.
 *
 * Body copy is `HERO.body` -- the guide's p34 welcome in full, verbatim, never
 * a reworded summary. It used to be the one-sentence `bodyLede`, because at the
 * old auto-height the full four sentences pushed the CTA below the fold. A
 * full-height section inverts that: the paragraph is the copy that fills the
 * space, and `content/site.ts` already records carrying it here as the intent.
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
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-powder"
    >
      {/* One of the page's two artwork fields; the other is on Dr. Nupur. */}
      <LoopField surface="powder" contrast="high" depth={0.28} count={2} />

      {/* The short-viewport bottom padding is what lands a 667px phone inside
          the screen rather than one pixel past it. */}
      <div className="relative z-10 flex flex-1 flex-col px-6 pb-14 pt-[6.25rem] [@media(max-height:700px)]:pb-10">
        {/* `my-auto` splits the leftover height above and below this block
            instead of letting it all pool in the one seam above the journey
            link, which on a 844px phone was a ~250px hole. The type block
            centres in the free space; the link stays on the bottom edge. */}
        <div className="my-auto">
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
          // `34ch`, not the old `30ch`: the measure has to carry four
          // sentences now, and the wider line is what keeps the paragraph from
          // growing the section past the viewport it is meant to fit inside.
          className="mt-3.5 max-w-[34ch] font-sans text-[clamp(0.95rem,4.2vw,1.0625rem)] leading-[1.5] text-cobalt"
          data-hero-fade
          data-animate
        >
          {/* A short viewport keeps the opening sentence only. An SE is 667px
              tall and cannot carry four sentences under a three-line display
              headline without growing the section past the screen -- which is
              the one thing this section exists to avoid. `bodyLede` is
              documented in `content/site.ts` as the verbatim first sentence of
              `body`, so this is a slice of one string, not a second copy of the
              copy to keep in step. */}
          {HERO.bodyLede}
          <span className="[@media(max-height:700px)]:hidden">
            {HERO.body.slice(HERO.bodyLede.length)}
          </span>
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
        </div>
        </div>

        {/* The whole journey lives on its own route now that the home strip is
            cut, so this is the only way to it from the top of the page. It sits
            on the bottom edge rather than under the CTA: the arrow already
            points down, so at the foot of a full-height section it reads as
            "there is more below" as well as naming where the link goes.
            `pt-10` is the floor on that gap for the short phones where
            `mt-auto` has no slack to give it. */}
        <a
          href="/journey"
          className="mt-auto flex min-h-11 w-fit items-center gap-2.5 pt-10 font-sans text-[0.9rem] text-cobalt"
          data-hero-fade
          data-animate
        >
          <span className="whitespace-nowrap underline underline-offset-4">
            See how a visit goes
          </span>
          <span className="w-4 rotate-90" aria-hidden="true">
            <Doodle name="markArrow" tone="coral" />
          </span>
        </a>
      </div>

    </section>
  )
}
