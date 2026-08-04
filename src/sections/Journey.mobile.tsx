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
 * The journey, turned upright.
 *
 * The desktop version pins the viewport and scrubs the four beats sideways.
 * That is the wrong instrument on a phone: it fights the thumb, it measures
 * against `window.innerWidth`, and a pinned section on a small screen hides
 * how much is left. So mobile keeps the idea -- one continuous canary stroke
 * threading every beat -- and runs it down the page instead of across it.
 *
 * Nothing is pinned here. The stroke scrubs against ordinary page scroll, and
 * the panels rise as they arrive. Two systems, as always.
 */
export function JourneyMobile({ asPage = false }: { asPage?: boolean | undefined }) {
  const rootRef = useRef<HTMLElement>(null)
  const spineRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('journey')

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
            scrollTrigger: {
              trigger: root,
              start: 'top 75%',
              end: 'bottom bottom',
              scrub: 0.6,
            },
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

  const Heading = asPage ? 'h1' : 'h2'

  return (
    <section
      id="journey"
      ref={rootRef}
      aria-labelledby="journey-heading"
      className="tt-section relative overflow-hidden bg-paper px-6 pb-20 pt-16"
    >
      <div className="relative z-10">
        <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        <Heading
          id="journey-heading"
          className="mt-3 font-display text-[clamp(2.25rem,10vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-cobalt"
          data-animate
        >
          How a visit actually goes
        </Heading>

        {/* The spine is scoped to the panel stack rather than to the section.
            Spanning the whole section, a 64-unit stroke stretched to the full
            width ran a canary band straight through this heading and out below
            the last panel. It threads the panels, so it starts and ends with
            them. Both children are positioned, so the panels paint over the
            stroke on source order alone -- no z-index needed. */}
        <div className="relative mt-10">
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

          <div className="relative flex flex-col gap-6">
            {JOURNEY.map((panel) => (
              <article
                key={panel.id}
                data-beat
                data-surface={panel.surface}
                data-animate
                className="relative overflow-hidden rounded-[2rem] p-6 shadow-[0_18px_40px_rgba(24,82,142,0.10)]"
                style={{ background: colourVar(panel.surface) }}
              >
                {panel.kind === 'beat' ? (
                  <>
                    <div className="w-16">
                      <Doodle name={panel.glyph} tone={panel.element} />
                    </div>
                    {/* Coral holds the field but cannot hold the words, so the
                        copy beds onto cobalt here (§6.1). */}
                    <TextPanel surface={panel.surface} className="mt-5 flex flex-col gap-4">
                      <SectionNumber
                        number={panel.number}
                        label="Step"
                        tone={carriesText(panel.surface) ? panel.element : 'canary'}
                      />
                      <h3
                        className="font-display text-[clamp(2.25rem,10vw,3rem)] leading-none"
                        style={{
                          color: colourVar(carriesText(panel.surface) ? panel.element : 'canary'),
                        }}
                      >
                        {panel.title}
                      </h3>
                      <p
                        className="font-sans text-[1.02rem] leading-[1.55]"
                        style={{
                          color: colourVar(carriesText(panel.surface) ? panel.element : 'white'),
                        }}
                      >
                        {panel.body}
                      </p>
                    </TextPanel>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-6 py-4 text-center">
                    <div className="w-36">
                      <Doodle name={panel.glyph} tone={panel.element} title="The Tiny Tusk mark" />
                    </div>
                    <p
                      className="font-display text-[1.35rem] leading-snug"
                      style={{ color: colourVar(panel.element) }}
                    >
                      {panel.caption}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
