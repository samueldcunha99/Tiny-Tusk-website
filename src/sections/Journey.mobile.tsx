import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { LoopField } from '@/components/LoopField'
import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionMarker } from '@/components/SectionMarker'
import { TextPanel } from '@/components/TextPanel'
import { colourVar } from '@/components/BrandArtView'
import { carriesText } from '@/design/pairings'
import { gsap, EASE, primeDraw, usePrefersReducedMotion } from '@/lib/motion'
import { JOURNEY } from '@/content/journey'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * The journey, turned upright -- `/journey` on a phone.
 *
 * The desktop version pins the viewport and scrubs the four beats sideways.
 * That is the wrong instrument here: it fights the thumb, it measures against
 * `window.innerWidth`, and a pinned section on a small screen hides how much
 * is left. So the idea survives -- one continuous canary stroke threading every
 * beat -- and runs down the page instead of across it. Nothing is pinned; the
 * stroke scrubs against ordinary page scroll and the panels rise as they
 * arrive. Two systems, as always.
 *
 * WHAT THE REDESIGN CHANGES. The section takes cobalt as its own surface rather
 * than sitting on paper, so the canary spine has something to be canary
 * against; the wayfinding is `<SectionMarker>` with coral numerals inside each
 * panel; the panels take the site's 32px radius; and the logo hinge is an
 * outlined cobalt panel rather than a filled one, because on a dark ground a
 * filled panel read as a fifth step.
 *
 * The spine is scoped to the panel stack, not the section: spanning the whole
 * section, a 64-unit stroke stretched to full width ran a canary band straight
 * through the heading. Both children are positioned, so the panels paint over
 * the stroke on source order alone -- no z-index needed.
 */
export function JourneyMobile({ asPage = false }: { asPage?: boolean | undefined }) {
  const rootRef = useRef<HTMLElement>(null)
  const spineRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('journey')
  const Heading = asPage ? 'h1' : 'h2'

  useEffect(() => {
    const root = rootRef.current
    const spine = spineRef.current
    if (!root) return

    if (reduced) {
      if (spine) primeDraw(spine, true)
      return
    }

    const ctx = gsap.context(() => {
      if (spine) {
        const length = primeDraw(spine, false)
        gsap.fromTo(
          spine,
          { strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom bottom', scrub: 0.6 },
          },
        )
      }

      gsap.utils.toArray<HTMLElement>('[data-beat]').forEach((beat) => {
        gsap.from(beat, {
          y: 44,
          opacity: 0,
          duration: 0.75,
          ease: EASE.entrance,
          scrollTrigger: { trigger: beat, start: 'top 85%' },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="journey"
      ref={rootRef}
      data-surface="cobalt"
      aria-labelledby="journey-heading"
      className={[
        'tt-section relative overflow-hidden bg-cobalt px-6 pb-16',
        asPage ? 'pt-[6.5rem]' : 'pt-14',
      ].join(' ')}
    >
      <LoopField surface="cobalt" contrast="low" depth={0.26} count={2} />

      <div className="relative z-10">
        <SectionMarker number={meta.number} label={meta.label} on="dark" />
        <Heading
          id="journey-heading"
          className="mt-4 font-display text-[clamp(2.5rem,11vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-canary"
          data-animate
        >
          How a visit actually goes
        </Heading>
        <p className="mt-3.5 max-w-[32ch] font-sans text-[0.97rem] leading-[1.55] text-white/90" data-animate>
          Four beats, and the mark they draw between them.
        </p>

        <div className="relative mt-9">
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 320 2400"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path
              ref={spineRef}
              d="M 160 0 C 40 300, 280 520, 160 820 S 40 1180, 160 1480 S 280 1840, 160 2140 S 90 2320, 160 2400"
              fill="none"
              stroke={colourVar('canary')}
              strokeWidth={64}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-draw
            />
          </svg>

          <div className="relative flex flex-col gap-[1.125rem]">
            {JOURNEY.map((panel) => {
              if (panel.kind === 'hinge') {
                return (
                  <article
                    key={panel.id}
                    data-beat
                    data-animate
                    data-surface="cobalt"
                    // Opaque cobalt, not transparent: the spine runs behind
                    // this panel, and through an unfilled one it crossed the
                    // caption.
                    className="flex flex-col items-center gap-[1.125rem] rounded-[2rem] border-2 border-canary/45 bg-cobalt px-[1.375rem] py-7 text-center"
                  >
                    <Logo size={130} tone={panel.element} drawable title="The Tiny Tusk mark" />
                    <p className="font-display text-[1.1875rem] leading-[1.3] text-canary">
                      {panel.caption}
                    </p>
                  </article>
                )
              }

              const light = carriesText(panel.surface)
              return (
                <article
                  key={panel.id}
                  data-beat
                  data-animate
                  data-surface={panel.surface}
                  className={[
                    'relative flex flex-col items-center overflow-hidden text-center shadow-[0_18px_50px_rgba(0,0,0,0.16)]',
                    // Coral holds the field but cannot hold the words, so that
                    // panel is a frame around a cobalt one and takes tighter
                    // padding to compensate (CLAUDE.md 6.1).
                    light ? 'rounded-[2rem] px-[1.375rem] py-6' : 'rounded-[2rem] p-5',
                  ].join(' ')}
                  style={{ background: colourVar(panel.surface) }}
                >
                  <div className="w-[4.75rem]">
                    <Doodle name={panel.glyph} tone={panel.element} />
                  </div>

                  <TextPanel
                    surface={panel.surface}
                    className="mt-4 flex flex-col items-center gap-3.5 text-center"
                  >
                    <p className="flex items-center justify-center gap-3" aria-hidden="true">
                      <span
                        className="font-display text-[1.25rem] font-semibold leading-none"
                        style={{ color: colourVar(light ? 'coral' : 'canary') }}
                      >
                        {panel.number}
                      </span>
                      <span
                        className="h-0.5 w-[1.875rem]"
                        style={{ background: colourVar(light ? 'coral' : 'canary') }}
                      />
                      <span
                        className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: colourVar(light ? panel.element : 'white'), opacity: 0.75 }}
                      >
                        Step
                      </span>
                    </p>
                    <h3
                      className="font-display text-[clamp(2.25rem,10vw,2.5rem)] font-semibold leading-none"
                      style={{ color: colourVar(light ? panel.element : 'canary') }}
                    >
                      {panel.title}
                    </h3>
                    <p
                      className="font-sans text-[0.95rem] leading-[1.55]"
                      style={{ color: colourVar(light ? panel.element : 'white') }}
                    >
                      {panel.body}
                    </p>
                  </TextPanel>
                </article>
              )
            })}
          </div>

          <div className="relative mt-[1.625rem] flex justify-center">
            <StylisedCTA
              lead="Book"
              rest="the first visit"
              href="/book"
              fill="canary"
              className="min-h-[3.625rem] w-full max-w-[18.75rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
