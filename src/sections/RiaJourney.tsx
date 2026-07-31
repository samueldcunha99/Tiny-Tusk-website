import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { useState } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { LoopField } from '@/components/LoopField'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextPanel } from '@/components/TextPanel'
import { RIA_JOURNEY } from '@/content/ria'
import { useSectionMeta } from '@/content/sectionOrder'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'

export function RiaJourney() {
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('ria')
  const activeMoment = RIA_JOURNEY[activeIndex] ?? RIA_JOURNEY[0]!

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-ria-moment]', { y: 34, opacity: 0, duration: 0.72, ease: EASE.entrance, stagger: STAGGER, scrollTrigger: { trigger: root, start: 'top 70%', once: true } })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="ria"
      ref={rootRef}
      className="tt-section relative min-h-screen overflow-hidden bg-coral px-6 py-20 md:px-10 md:py-24"
      data-surface="coral"
      aria-labelledby="ria-heading"
    >
      <LoopField
        surface="coral"
        contrast="low"
        depth={0.2}
        count={1}
        className="opacity-[0.33]"
      />
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <TextPanel
            surface="coral"
            className="shadow-[0_16px_45px_rgba(24,82,142,0.18)]"
          >
            <SectionNumber number={meta.number} label={meta.label} tone="canary" />
            <h2 id="ria-heading" className="mt-4 font-display text-h1 text-canary">
              <MixedWeightLabel lead="Ria's" rest="Journey" display />
            </h2>
            <p className="mt-5 max-w-measure font-sans text-body text-white">
              For a child who feels unsure, the first visit can be about getting
              comfortable — and nothing more.
            </p>
          </TextPanel>
          <BrandImage
            webp="/images/rias-journey-hero.webp"
            png="/images/rias-journey-hero.png"
            alt="Ria laughing in the dental chair with the team nearby."
            width={1600}
            height={1050}
            title={{ lead: "Ria's", rest: 'first visit', fill: 'coral', href: '/book' }}
            logoTone="cobalt"
            doodle="doodleFace"
            doodleTone="canary"
            eager
            className="mt-8 aspect-[16/10]"
          />
          <div className="mt-8">
            <StylisedCTA
              lead="Book"
              rest="a gentle first visit"
              href="/book"
              fill="canary"
            />
          </div>
          <div
            className="mt-12 hidden h-3 overflow-hidden rounded-full bg-white lg:block"
            role="progressbar"
            aria-label="Ria's visit story progress"
            aria-valuemin={1}
            aria-valuemax={RIA_JOURNEY.length}
            aria-valuenow={activeIndex + 1}
          >
            <div
              className="h-full w-full origin-left bg-canary transition-transform duration-500 ease-transform"
              style={{
                transform: `scaleX(${(activeIndex + 1) / RIA_JOURNEY.length})`,
              }}
            />
          </div>
        </div>
        <div>
          <div
            className="grid gap-3 sm:grid-cols-3"
            aria-label="Choose a moment from Ria's visit"
          >
            {RIA_JOURNEY.map((moment, index) => {
              const active = activeIndex === index
              return (
                <button
                  key={moment.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveIndex(index)}
                  data-surface={active ? 'cobalt' : 'paper'}
                  className={[
                    'min-h-20 rounded-2xl border-2 p-4 text-left',
                    active
                      ? 'border-cobalt bg-cobalt text-canary'
                      : 'border-white bg-paper text-cobalt',
                  ].join(' ')}
                >
                  <span className="block font-sans text-xs font-semibold uppercase tracking-[0.14em]">
                    0{index + 1}
                  </span>
                  <span className="mt-2 block font-display text-lg">
                    {moment.eyebrow}
                  </span>
                </button>
              )
            })}
          </div>

          <article
            key={activeMoment.id}
            data-ria-moment
            data-surface="paper"
            data-animate
            aria-live="polite"
            className="mt-4 flex min-h-[470px] flex-col justify-between rounded-[2.5rem] bg-paper p-7 shadow-[0_12px_35px_rgba(24,82,142,0.10)] md:p-10"
          >
            <div>
              <Doodle
                name={activeMoment.glyph}
                tone="cobalt"
                drawOnScroll
                className="w-24 md:w-32"
              />
              <p className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">
                0{activeIndex + 1} · {activeMoment.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-h1 text-cobalt">
                {activeMoment.title}
              </h3>
              <p className="mt-4 max-w-measure font-sans text-body text-cobalt">
                {activeMoment.body}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t-2 border-powder pt-6">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() =>
                  setActiveIndex((current) => Math.max(0, current - 1))
                }
                className="min-h-11 rounded-full px-4 font-sans font-semibold text-cobalt underline disabled:opacity-30"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={activeIndex === RIA_JOURNEY.length - 1}
                onClick={() =>
                  setActiveIndex((current) =>
                    Math.min(RIA_JOURNEY.length - 1, current + 1),
                  )
                }
                className="min-h-11 rounded-full bg-cobalt px-5 font-sans font-semibold text-white disabled:opacity-30"
              >
                Next moment
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
