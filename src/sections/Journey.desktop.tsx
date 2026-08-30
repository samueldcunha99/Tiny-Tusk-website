import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { colourVar } from '@/components/BrandArtView'
import { TextPanel } from '@/components/TextPanel'
import { carriesText } from '@/design/pairings'
import { gsap, EASE, primeDraw, usePrefersReducedMotion } from '@/lib/motion'
import { JOURNEY } from '@/content/journey'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * The signature section: the guide's four beats as a pinned horizontal scroll.
 *
 * The connector running between panels is one continuous canary stroke that
 * draws as you scroll -- the logo's single-stroke logic scaled across a whole
 * section. Everything else here is restraint: one stroke drawing, one panel
 * moving. Never more than two systems at once.
 *
 * Under reduced motion the pin and the horizontal scrub are never created, and
 * the panels lay out as an ordinary vertical stack with the connector drawn.
 */
export function Journey({ asPage = false }: { asPage?: boolean | undefined }) {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const connectorRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('journey')

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const connector = connectorRef.current
    if (!root || !track) return

    if (reduced) {
      if (connector) primeDraw(connector, true)
      return
    }

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(track, { x: () => -distance(), ease: 'none' }, 0)

      // The connector draws in step with the horizontal travel.
      if (connector) {
        const length = primeDraw(connector, false)
        tl.fromTo(
          connector,
          { strokeDashoffset: length },
          { strokeDashoffset: 0, ease: 'none' },
          0,
        )
      }

      // Each panel lifts slightly as it reaches centre stage.
      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
        gsap.fromTo(
          panel.querySelector('[data-panel-inner]'),
          { y: 40, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            ease: EASE.entrance,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tl,
              start: 'left 80%',
              end: 'left 45%',
              scrub: true,
            },
          },
        )
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  const Heading = asPage ? 'h1' : 'h2'

  return (
    <section
      id="journey"
      ref={rootRef}
      aria-labelledby="journey-heading"
      className="tt-section relative flex h-[100svh] flex-col overflow-hidden bg-paper"
    >
      {/* The header reserves its own row rather than floating over the track,
          so a panel can never ride up over the heading. */}
      <div className="relative z-20 shrink-0 px-6 pb-2 pt-20 md:px-10 md:pt-24">
        <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        <Heading id="journey-heading" className="mt-3 max-w-measure font-display text-h1 text-cobalt">
          How a visit actually goes
        </Heading>
      </div>

      <div
        ref={trackRef}
        className="relative flex min-h-0 flex-1 items-center gap-0 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {/* One continuous canary stroke threading the whole sequence.
            Positioned against the track (not the section) so it travels with
            the panels instead of staying pinned to the viewport. */}
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[340px] w-full -translate-y-1/2"
          viewBox="0 0 5000 320"
          preserveAspectRatio="none"
        >
          <path
            ref={connectorRef}
            d="M 0 160 C 400 40, 700 280, 1050 160 S 1700 40, 2050 160 S 2700 280, 3050 160 S 3700 40, 4050 160 S 4700 280, 5000 160"
            fill="none"
            stroke={colourVar('canary')}
            strokeWidth={70}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-draw
          />
        </svg>

        {JOURNEY.map((panel) => {
          // The box is back. Because the copy now sits on the panel's own
          // surface rather than on the section's paper, the tones have to come
          // from the panel instead of being hardcoded to cobalt -- and the
          // coral panel's copy has to be bedded on cobalt, which is what
          // `TextPanel` does (hard rule 1: coral cannot carry text).
          const onSurface = carriesText(panel.surface)
          const headingTone = onSurface ? panel.element : 'canary'
          const bodyTone = onSurface ? panel.element : 'white'

          return (
            <article
              key={panel.id}
              data-panel
              data-surface={panel.surface}
              className="relative z-10 flex h-full w-[100vw] shrink-0 items-center justify-center px-6 py-4 md:w-[50vw] md:px-10"
            >
              <div
                data-panel-inner
                className="flex max-h-full w-full max-w-lg flex-col items-center gap-4 overflow-hidden rounded-[2.5rem] p-6 text-center md:p-9"
                style={{ background: colourVar(panel.surface) }}
              >
                {panel.kind === 'beat' ? (
                  <>
                    <div className="w-20 shrink-0 md:w-28">
                      <Doodle name={panel.glyph} tone={panel.element} drawOnScroll />
                    </div>
                    <TextPanel
                      surface={panel.surface}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      <SectionNumber
                        number={panel.number}
                        label="Step"
                        tone={headingTone}
                        className="justify-center"
                      />
                      <h3
                        className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-tight"
                        style={{ color: colourVar(headingTone) }}
                      >
                        {panel.title}
                      </h3>
                      <p
                        className="max-w-[38ch] font-sans text-[1.05rem] leading-[1.6]"
                        style={{ color: colourVar(bodyTone) }}
                      >
                        {panel.body}
                      </p>
                    </TextPanel>
                  </>
                ) : (
                  <div className="flex w-full flex-col items-center gap-5 py-4 text-center">
                    <div className="w-36 md:w-44">
                      <Doodle
                        name={panel.glyph}
                        tone={panel.element}
                        drawOnScroll
                        title="The Tiny Tusk mark"
                      />
                    </div>
                    {/* Was coral, which fails on the cobalt box now behind it. */}
                    <span
                      className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: colourVar(panel.element) }}
                    >
                      The Logo Story
                    </span>
                    <p
                      className="max-w-sm font-display text-[1.65rem] font-semibold leading-snug"
                      style={{ color: colourVar(panel.element) }}
                    >
                      {panel.caption}
                    </p>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
