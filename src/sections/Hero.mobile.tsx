import { useEffect, useRef } from 'react'
import { LoopField } from '@/components/LoopField'
import { StylisedCTA } from '@/components/StylisedCTA'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { HERO } from '@/content/site'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Mobile hero.
 *
 * WHY THIS IS BUILT AROUND AN IMAGE
 *
 * The type alone measures ~380px on a 390px-wide phone. A viewport is 650-850.
 * So every purely typographic version of this hero had 130-400px of empty
 * powder in it, and no amount of adjusting `min-h` or `justify-*` fixed that --
 * it only moved the gap around: `justify-center` split it top and bottom,
 * `mt-auto` banked it all in the middle, and shrinking the section just made
 * the hero small.
 *
 * The fix is structural. The type block takes the height it needs, and the
 * photograph below it is `flex-1`, so it absorbs whatever is left over. On a
 * tall phone the image is tall; on a short one it falls back to its
 * `min-h` and the section grows past the viewport instead. Either way the
 * surplus lands in a picture rather than in dead space, and the hero fills the
 * screen without a hole in it.
 *
 * The display step is set locally: the shared `text-display` clamp tops out at
 * 13vw, which on a 390px screen reads smaller than the body copy's optical
 * weight deserves.
 *
 * The CTA points at `/book`, not `HERO.cta.href` -- that anchor targets the
 * Booking section, which sits far below on mobile.
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
        .to(lines, {
          yPercent: 0,
          duration: 1.15,
          ease: EASE.entrance,
          stagger: STAGGER,
        })
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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-powder"
    >
      <LoopField surface="powder" contrast="high" depth={0.28} count={1} />

      <div className="relative z-10 shrink-0 px-6 pt-24">
        <div className="flex items-start justify-between gap-4" data-hero-fade>
          <div className="min-w-0">
            <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
          </div>

          {/* Artwork on the eyebrow's line rather than in a band of its own.
              Rests complete, so it adds no third animation system.

              Sized to clear the menu button: this row runs the full content
              width, and the nav's button sits above its right end. Any wider
              and the group ran under the button and off the screen edge. */}
          <div className="-mt-1 flex shrink-0 items-start gap-1.5 pr-12" aria-hidden="true">
            <span className="w-5 pt-1">
              <Doodle name="markDashes" tone="cobalt" />
            </span>
            <span className="w-6">
              <Doodle name="doodleHeart" tone="coral" />
            </span>
            <span className="w-10">
              <Doodle name="doodleToothbrush" tone="cobalt" />
            </span>
          </div>
        </div>

        <h1
          className="mt-6 font-display text-[clamp(3.25rem,18vw,5.25rem)] leading-[0.9] tracking-[-0.035em] text-cobalt"
          data-animate
        >
          {/* `pb`/`-mb` pair: at leading 0.9 the line box is shorter than the
              glyphs, so `overflow-hidden` (which the clip reveal needs) was
              slicing the descender off the "y" in Tiny. The padding gives the
              clip box room for it; the negative margin takes the same amount
              back off the layout so the lines stay tight. */}
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

        <p
          className="mt-4 font-sans text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-cobalt/65"
          data-hero-fade
        >
          {HERO.headlineTail}
        </p>

        <p
          className="mt-4 max-w-[34ch] font-sans text-[1rem] leading-[1.45] text-cobalt"
          data-hero-fade
          data-animate
        >
          {HERO.body}
        </p>

        <div className="mt-6 flex flex-col items-start gap-3" data-hero-fade data-animate>
          {/* Capped rather than full-bleed: the CTA's ellipse is drawn artwork
              stretched with preserveAspectRatio="none", so at full phone width
              it flattens into a band and stops reading as the guide's shape. */}
          <StylisedCTA
            lead={HERO.cta.lead}
            rest={HERO.cta.rest}
            href="/book"
            fill="canary"
            className="w-full max-w-[21rem]"
          />
          <a
            href="#start-here"
            className="flex min-h-11 w-fit items-center gap-2.5 font-sans text-[0.9rem] text-cobalt/80"
          >
            <span className="underline underline-offset-4">Not sure where to start?</span>
            <span className="w-4 rotate-90" aria-hidden="true">
              <Doodle name="markArrow" tone="coral" />
            </span>
          </a>
        </div>
      </div>

      {/* The height sink. `flex-1` means this takes every pixel the type block
          did not, so the section can never end up with a gap in it. Bleeds to
          the section's bottom edge, where the paper of the next section meets
          it. Not animated: it is the LCP element and it rests complete. */}
      <div className="relative z-10 mt-8 flex min-h-[190px] flex-1 overflow-hidden rounded-t-[2.5rem]">
        {/* NOT `child-pointing-smile` despite its name -- that file is an adult
            brushing a denture model, which is the clinical register this brand
            avoids (and its alt text in `content/parents.ts` describes a photo
            it is not). This one is the child actually laughing.

            `object-[50%_38%]` keeps her face in frame: the crop height changes
            with the viewport, and centring the 16:10 original drifts down to
            her chin on a short screen. */}
        <picture>
          <source srcSet="/images/rias-journey-hero.webp" type="image/webp" />
          <img
            src="/images/rias-journey-hero.png"
            alt="A child laughing in the dental chair."
            width={1600}
            height={1050}
            // React 18 passes this through verbatim, so it must be the
            // lowercase DOM attribute or it logs a console error.
            {...{ fetchpriority: 'high' }}
            className="h-full w-full object-cover object-[50%_38%]"
          />
        </picture>

        {/* The guide's coral motion dashes over the photograph (p31). */}
        <div className="pointer-events-none absolute right-5 top-6 w-12" aria-hidden="true">
          <Doodle name="markDashes" tone="coral" />
        </div>
      </div>
    </section>
  )
}
