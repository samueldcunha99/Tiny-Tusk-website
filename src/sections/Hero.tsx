import { useRef } from 'react'
import { ART } from '@/assets/brand/paths'
import { colourVar } from '@/components/BrandArtView'
import { Doodle } from '@/components/Doodle'
import { Wordmark } from '@/components/Logo'
import { Roundel } from '@/components/Roundel'
import { StylisedCTA } from '@/components/StylisedCTA'
import { CLINIC, HERO } from '@/content/site'
import {
  gsap,
  EASE,
  STAGGER,
  introPending,
  onIntroDone,
  primeDraw,
  useIsoLayoutEffect,
  usePrefersReducedMotion,
} from '@/lib/motion'

/**
 * 00 Welcome -- coral, one screen.
 *
 * The guide's p16 chapter page (one giant canary loop) carrying its p34
 * welcome copy: "Welcome to" over the name, the full paragraph, and the canary
 * Schedule Appointment ellipse. The loop draws itself on arrival -- the single
 * stroke the mark is made of, at the scale of the page.
 *
 * CORAL WITH WHITE WORDS IS THE USER'S DECISION (2026-09-25), taken knowing
 * the cost: the powder field read as washed out, and they chose white type on
 * coral over a panel, although it measures 2.99:1 -- under the 4.5:1 body
 * text needs, so PageSpeed flags it. It is the one exception to "coral carries
 * no text" (CLAUDE.md §6.1); do not copy it elsewhere, and do not "fix" it back
 * without asking. The field is the p24 high-contrast pairing: canary on coral.
 *
 * NO ROUNDEL ON THE PHONE: the client asked for it to come out of the mobile
 * hero. It stays on desktop, where the right half of the spread is otherwise
 * empty, and it closes every page in the footer.
 *
 * The entrance is built paused and played by `onIntroDone`, so on a first
 * visit it waits for the preloader instead of performing behind it. It plays
 * only then: on any later page of the session the hero is prerendered HTML
 * already on screen, and taking it away to bring it back would only blink.
 */
/** The page-sized canary loop. The hero places it twice -- a phone's band and
 *  the tablet/desktop spread -- and CSS shows one. */
function HeroLoop({
  className,
  preserveAspectRatio,
}: {
  className: string
  preserveAspectRatio?: string | undefined
}) {
  const loop = ART.loopStroke.parts[0]
  if (!loop || loop.kind !== 'stroke') return null
  return (
    <svg
      viewBox={ART.loopStroke.viewBox}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none overflow-visible ${className}`}
    >
      <path
        data-hero-loop
        data-draw
        d={loop.d}
        fill="none"
        stroke={colourVar('canary')}
        strokeWidth={loop.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useIsoLayoutEffect(() => {
    const root = ref.current
    if (!root || reduced || !introPending()) return
    let cancel = () => {}
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      // Only the placement this width shows; the other is display: none.
      root.querySelectorAll<SVGPathElement>('[data-hero-loop]').forEach((path) => {
        if (!path.getClientRects().length) return
        primeDraw(path, false)
        tl.to(path, { strokeDashoffset: 0, duration: 2.2, ease: EASE.entrance }, 0)
      })
      tl.from('[data-hero-text]', { yPercent: 115, duration: 1.1, ease: EASE.entrance, stagger: STAGGER }, 0.1)
        .from('[data-hero-dashes]', { scale: 0, duration: 0.6, ease: EASE.entrance }, 0.7)
        .from('[data-hero-rise] > *', { yPercent: 110, duration: 0.9, ease: EASE.entrance, stagger: STAGGER }, 0.45)
      cancel = onIntroDone(() => tl.play())
    }, root)
    return () => {
      cancel()
      ctx.revert()
    }
  }, [reduced])

  return (
    <section
      id="hero"
      ref={ref}
      data-surface="coral"
      aria-labelledby="hero-heading"
      className="tt-section relative isolate flex min-h-svh flex-col overflow-hidden bg-coral"
    >
      {/* High-contrast register, p24: canary on coral. Desktop: one loop
          across the spread, never behind the white heading or paragraph
          (white on canary is about 1.3:1), and ending inside the section,
          where a clipped stroke would read as a straight cut. Narrower
          screens give it a band of its own instead (below). */}
      {/* Narrow desktops sit it further right: at 1024 its tail ran into the
          name's dashes and ended 13px from the paragraph. */}
      <HeroLoop className="absolute -right-[26%] top-[8%] hidden w-[52%] max-w-none lg:block xl:-right-[18%]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-8 pt-[5.25rem] md:px-10 md:pt-32 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:pb-16">
        {/* Below desktop: a third of the spare height above the words, as
            `my-auto` gave; the other two thirds go to the loop's band. */}
        <div aria-hidden="true" className="flex-1 lg:hidden" />
        <div className="my-auto max-w-[44rem]">
          {/* One heading, three lines. The spaces between the spans are real
              text, so the accessible name reads as a sentence rather than
              "Welcome toTiny TuskPediatric Dental Clinic". */}
          <h1 id="hero-heading" className="font-display text-white">
            <span className="tt-mask block">
              <span data-hero-text className="block text-[clamp(1.75rem,7.5vw,3rem)] leading-[1.05] tracking-[-0.02em]">
                {HERO.headline[0]}
              </span>
            </span>{' '}
            {/* Inline-block so the mask is as wide as the name plus room for
                the p34 dashes at its shoulder -- a full-width mask would clip
                them against the column edge on a 360px phone. */}
            <span className="tt-mask relative -mt-[0.2em] inline-block whitespace-nowrap pr-[0.5em] pt-[0.2em] align-top text-[clamp(4rem,21vw,10.5rem)] font-semibold leading-[0.92] tracking-[-0.035em]">
              <span data-hero-text className="block">
                {HERO.headline[1]}
              </span>
              <span
                data-hero-dashes
                aria-hidden="true"
                className="absolute right-0 top-[0.12em] block w-[0.34em] origin-bottom-left"
              >
                <Doodle name="markDashes" tone="canary" />
              </span>
            </span>{' '}
            {/* `mt-2` clears the descender of the "y" in Tiny. */}
            <span className="tt-mask mt-2 block">
              <span data-hero-text className="block text-[clamp(1.75rem,7.5vw,3rem)] leading-[1.1] tracking-[-0.02em]">
                {HERO.headlineTail}
              </span>
            </span>
          </h1>

          <div data-hero-rise className="tt-mask mt-5 md:mt-8">
            {/* The guide's p34 paragraph, verbatim. A short phone (an SE is
                667px tall) keeps the opening sentence -- `bodyLede` is that
                sentence exactly, so this is a slice of one string. */}
            <p className="max-w-[36ch] font-sans text-[clamp(1rem,4.3vw,1.25rem)] leading-[1.55] text-white md:max-w-[52ch]">
              {HERO.bodyLede}
              <span className="[@media(max-height:700px)]:hidden">
                {HERO.body.slice(HERO.bodyLede.length)}
              </span>
            </p>
          </div>

          {/* The mask needs room for the ellipse's offset outline and its
              magnetic drift, so it pads out and pulls the padding back. */}
          <div data-hero-rise className="tt-mask -m-4 mt-3 p-4 md:mt-6">
            <StylisedCTA
              lead={HERO.cta.lead}
              rest={HERO.cta.rest}
              href="/book/"
              fill="canary"
              size="lg"
              className="w-full max-w-[21rem]"
            />
          </div>
        </div>

        {/* The guide's cover lockup (p1) -- roundel, wordmark and tag, in the
            cover's proportions -- in cobalt, at the user's request: white
            vanished where the canary loop runs behind it, and cobalt reads
            on both the loop and the coral.
            Desktop only: the client asked for no roundel in the phone hero.
            Top-aligned with the headline rather than centred on the whole
            column, which left it hanging low beside the button. */}
        <div className="hidden flex-col items-center lg:flex lg:self-start" aria-hidden="true">
          <Roundel tone="cobalt" className="block h-auto w-[clamp(13rem,18vw,17rem)]" />
          <Wordmark tone="cobalt" className="mt-1 h-auto w-[clamp(9.5rem,13.1vw,12.4rem)]" />
          <p className="mt-2 font-sans text-[clamp(0.8rem,0.95vw,0.9rem)] font-medium text-cobalt">{CLINIC.tag}</p>
        </div>

        {/* Below desktop: the loop's band, from the button down to the foot of
            the screen, beside the scroll link. The band takes the spare
            height, so the loop scales to whatever room a phone or tablet
            leaves -- a landscape phone included -- and never reaches the
            words, the button or the link (user: "ribbon position is not good"
            -- it ran behind the button and the link). On desktop the band
            dissolves (`contents`) and the link is a grid item again. */}
        <div className="relative flex flex-[2_1_auto] flex-col justify-end lg:contents">
          {/* From `md` the button no longer spans the screen, so the band
              reaches up beside it (the 21rem button ends well short of 26rem),
              stopping short of the paragraph above it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[40%] bottom-0 left-[10.5rem] top-3 md:-top-[5.5rem] md:left-[26rem] lg:hidden"
          >
            <HeroLoop className="block h-full w-full" preserveAspectRatio="xMinYMax meet" />
          </div>

          {/* A full-height hero needs to say there is more below; this link
              is that, and it names what comes next. Cobalt, like the lockup
              and the button's label. */}
          <div data-hero-rise className="tt-mask mt-auto pt-8 lg:col-span-2 lg:pt-0">
            <a
              href="#team"
              className="flex min-h-11 w-fit items-center gap-3 font-sans text-[0.95rem] font-semibold text-cobalt"
            >
              <span className="underline decoration-2 underline-offset-[6px]">Meet Dr. Nupur</span>
              <span className="block w-5 rotate-90" aria-hidden="true">
                <Doodle name="markArrow" tone="cobalt" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
