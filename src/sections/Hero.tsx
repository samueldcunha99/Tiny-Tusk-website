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
  ScrollTrigger,
  EASE,
  STAGGER,
  onIntroDone,
  primeDraw,
  useIsoLayoutEffect,
  usePrefersReducedMotion,
} from '@/lib/motion'

/**
 * 00 Welcome -- powder, one screen.
 *
 * The guide's p16 chapter page (powder field, one giant canary loop) carrying
 * its p34 welcome copy: "Welcome to" over the name, the full paragraph, and the
 * canary Schedule Appointment ellipse. The loop draws itself on arrival -- the
 * single stroke the mark is made of, at the scale of the page.
 *
 * NO ROUNDEL ON THE PHONE: the client asked for it to come out of the mobile
 * hero. It stays on desktop, where the right half of the spread is otherwise
 * empty, and it closes every page in the footer.
 *
 * The entrance is built paused and played by `onIntroDone`, so on a first
 * visit it waits for the preloader instead of performing behind it.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const loop = ART.loopStroke.parts[0]

  useIsoLayoutEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    let cancel = () => {}
    const ctx = gsap.context(() => {
      // Scroll triggers inside the hero (the CTA's outline draw) were measured
      // while the entrance held everything 110% down its masks; re-measure once
      // it has landed, or the CTA waits for a scroll to draw its outline.
      const tl = gsap.timeline({ paused: true, onComplete: () => ScrollTrigger.refresh() })
      const path = root.querySelector<SVGPathElement>('[data-hero-loop]')
      if (path) {
        primeDraw(path, false)
        tl.to(path, { strokeDashoffset: 0, duration: 2.2, ease: EASE.entrance }, 0)
      }
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
      data-surface="powder"
      aria-labelledby="hero-heading"
      className="tt-section relative isolate flex min-h-svh flex-col overflow-hidden bg-powder"
    >
      {/* High-contrast register, p28: canary on powder. It sweeps through the
          lower half on a phone, where it passes behind the CTA and the scroll
          link but never behind a line of body copy -- and it ends inside the
          section: the next section is powder too, so a loop clipped by this
          edge would show as a straight cut. */}
      {loop && loop.kind === 'stroke' ? (
        <svg
          viewBox={ART.loopStroke.viewBox}
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute bottom-[1.5%] -left-[4%] w-[116%] max-w-none [@media(max-width:767px)_and_(max-height:780px)]:w-[100%] overflow-visible md:bottom-[2%] md:left-[40%] md:w-[64%] lg:-right-[18%] lg:bottom-auto lg:left-auto lg:top-[8%] lg:w-[52%]"
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
      ) : null}

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-8 pt-[5.25rem] md:px-10 md:pt-32 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:pb-16">
        <div className="my-auto max-w-[44rem]">
          {/* One heading, three lines. The spaces between the spans are real
              text, so the accessible name reads as a sentence rather than
              "Welcome toTiny TuskPediatric Dental Clinic". */}
          <h1 id="hero-heading" className="font-display text-cobalt">
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
                <Doodle name="markDashes" tone="coral" />
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
            <p className="max-w-[36ch] font-sans text-[clamp(1rem,4.3vw,1.25rem)] leading-[1.55] text-cobalt md:max-w-[52ch]">
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
              href="/book"
              fill="canary"
              size="lg"
              className="w-full max-w-[21rem]"
            />
          </div>
        </div>

        {/* The guide's cover lockup (p1) -- roundel, wordmark and tag, in the
            cover's proportions -- in cobalt, the element colour for powder.
            Desktop only: the client asked for no roundel in the phone hero.
            Top-aligned with the headline rather than centred on the whole
            column, which left it hanging low beside the button. */}
        <div className="hidden flex-col items-center lg:flex lg:self-start" aria-hidden="true">
          <Roundel tone="cobalt" className="block h-auto w-[clamp(13rem,18vw,17rem)]" />
          <Wordmark tone="cobalt" className="mt-1 h-auto w-[clamp(9.5rem,13.1vw,12.4rem)]" />
          <p className="mt-2 font-sans text-[clamp(0.8rem,0.95vw,0.9rem)] font-medium text-cobalt">{CLINIC.tag}</p>
        </div>

        {/* A full-height hero needs to say there is more below; this link is
            that, and it names what comes next. */}
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
    </section>
  )
}
