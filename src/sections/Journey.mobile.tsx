import { useState, useEffect, useCallback } from 'react'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionMarker } from '@/components/SectionMarker'
import { colourVar } from '@/components/BrandArtView'
import { usePrefersReducedMotion } from '@/lib/motion'
import { JOURNEY } from '@/content/journey'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * The Journey on mobile -- redesigned with ZERO BOXES.
 *
 * 1. An open, prominent horizontal single-stroke rail displaying the 5 stages.
 * 2. Auto-scrolls smoothly through each beat (pauses on touch/hover).
 * 3. Larger vector glyphs, typography, and comfortable reading measure.
 * 4. Zero boxes, zero card backgrounds, zero borders, zero drop shadows.
 */
export function JourneyMobile({ asPage = false }: { asPage?: boolean | undefined }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('journey')
  const Heading = asPage ? 'h1' : 'h2'

  const nextStep = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % JOURNEY.length)
  }, [])

  const prevStep = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + JOURNEY.length) % JOURNEY.length)
  }, [])

  // Faster auto-scroll through steps every 2.6s (pauses on user interaction / reduced motion)
  useEffect(() => {
    if (isPaused || reduced) return

    const timer = setInterval(() => {
      nextStep()
    }, 2600)

    return () => clearInterval(timer)
  }, [isPaused, reduced, nextStep])

  const activePanel = JOURNEY[activeIndex] ?? JOURNEY[0]!

  // Dynamic soft brand background color matching the active step
  const stepBgClass =
    activePanel.id === 'treatment'
      ? 'bg-[#FFF6DB]' // Soft Canary
      : activePanel.id === 'care'
      ? 'bg-[#FFEFEA]' // Soft Coral tint
      : 'bg-[#EBF0F9]' // Soft Powder

  return (
    <section
      id="journey"
      data-surface="powder"
      aria-labelledby="journey-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className={[
        'tt-section relative overflow-hidden px-6 pb-16 transition-colors duration-700 ease-out',
        stepBgClass,
        asPage ? 'pt-[6.5rem]' : 'pt-14',
      ].join(' ')}
    >
      <div className="relative z-10 mx-auto max-w-xl">
        {/* Section Header */}
        <SectionMarker number={meta.number} label={meta.label} />
        <Heading
          id="journey-heading"
          className="mt-3.5 font-display text-[clamp(2.4rem,9.5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-cobalt"
        >
          How a visit actually goes
        </Heading>
        <p className="mt-2.5 font-sans text-[1rem] leading-[1.55] text-cobalt/80">
          Four gentle beats, and the mark they draw between them.
        </p>

        {/* 5-Step Single-Stroke Rail (Enlarged, Zero Boxes) */}
        <div className="relative mt-10">
          {/* Continuous connector stroke */}
          <svg
            aria-hidden="true"
            focusable="false"
            className="pointer-events-none absolute left-5 right-5 top-6 z-0 h-4 w-[calc(100%-2.5rem)]"
            viewBox="0 0 400 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 10 10 Q 100 2, 200 10 T 390 10"
              fill="none"
              stroke={colourVar('canary')}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </svg>

          {/* Stepper buttons in one open row */}
          <div
            role="tablist"
            aria-label="Visit stages"
            className="relative z-10 flex items-center justify-between"
          >
            {JOURNEY.map((panel, idx) => {
              const isSelected = idx === activeIndex
              const isHinge = panel.kind === 'hinge'

              return (
                <button
                  key={panel.id}
                  type="button"
                  role="tab"
                  id={`stage-tab-${panel.id}`}
                  aria-selected={isSelected}
                  aria-controls={`stage-panel-${panel.id}`}
                  onClick={() => {
                    setActiveIndex(idx)
                    setIsPaused(true)
                  }}
                  className="group relative flex flex-col items-center gap-2 focus:outline-none"
                >
                  {/* Glyph Circle / Indicator (Enlarged) */}
                  <div
                    className={[
                      'relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300',
                      isSelected
                        ? 'scale-[1.12] bg-white ring-2 ring-cobalt ring-offset-2 shadow-sm'
                        : 'bg-white/75 opacity-75 hover:opacity-100',
                    ].join(' ')}
                  >
                    <Doodle
                      name={panel.glyph}
                      tone={isSelected ? (isHinge ? 'cobalt' : 'coral') : 'cobalt'}
                      className="h-8 w-8"
                    />
                  </div>

                  {/* Stage Label */}
                  <span
                    className={[
                      'font-sans text-[0.78rem] tracking-tight transition-colors duration-200',
                      isSelected ? 'font-semibold text-cobalt' : 'text-cobalt/60',
                    ].join(' ')}
                  >
                    {isHinge ? 'Mark' : panel.number}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Stage Open Presentation (Enlarged, Zero Boxes) */}
        <div
          id={`stage-panel-${activePanel.id}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${activePanel.id}`}
          className="mt-10 flex flex-col items-center text-center"
        >
          {/* Animated Large Vector Glyph */}
          <div className="relative mb-5 flex h-36 w-36 items-center justify-center">
            {activePanel.kind === 'hinge' ? (
              <Logo size={120} tone="cobalt" drawable title="The Tiny Tusk mark" />
            ) : (
              <Doodle
                key={activePanel.id}
                name={activePanel.glyph}
                tone="cobalt"
                drawOnScroll={false}
                className="h-32 w-32"
              />
            )}
          </div>

          {/* Step Metadata & Typography (Enlarged) */}
          <div className="flex flex-col items-center gap-2.5">
            <span className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-coral">
              {activePanel.kind === 'beat' ? `Step ${activePanel.number} of 04` : 'The Logo Story'}
            </span>

            <h3 className="font-display text-[2.25rem] font-semibold leading-tight text-cobalt">
              {activePanel.kind === 'beat' ? activePanel.title : 'One Continuous Stroke'}
            </h3>

            <p className="mt-1 max-w-[36ch] font-sans text-[1.05rem] leading-[1.65] text-cobalt/85">
              {activePanel.kind === 'beat' ? activePanel.body : activePanel.caption}
            </p>
          </div>

          {/* Subtle Navigation Controls & Timer Dots */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => {
                prevStep()
                setIsPaused(true)
              }}
              className={[
                'font-sans text-sm font-semibold text-cobalt transition-opacity',
                activeIndex === 0 ? 'pointer-events-none opacity-30' : 'opacity-75 hover:opacity-100',
              ].join(' ')}
              aria-label="Previous visit step"
            >
              ← Previous
            </button>

            {/* Stepper Progress Indicators */}
            <div className="flex items-center gap-2" aria-hidden="true">
              {JOURNEY.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveIndex(i)
                    setIsPaused(true)
                  }}
                  className={[
                    'h-2 rounded-full transition-all duration-300',
                    i === activeIndex ? 'w-6 bg-coral' : 'w-2 bg-cobalt/25 hover:bg-cobalt/40',
                  ].join(' ')}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={activeIndex === JOURNEY.length - 1}
              onClick={() => {
                nextStep()
                setIsPaused(true)
              }}
              className={[
                'font-sans text-sm font-semibold text-cobalt transition-opacity',
                activeIndex === JOURNEY.length - 1
                  ? 'pointer-events-none opacity-30'
                  : 'opacity-75 hover:opacity-100',
              ].join(' ')}
              aria-label="Next visit step"
            >
              Next →
            </button>
          </div>

          {/* Booking CTA */}
          <div className="mt-10 flex justify-center">
            <StylisedCTA
              lead="Book"
              rest="the first visit"
              href="/book"
              fill="canary"
              className="min-h-[3.5rem] w-full max-w-[18rem]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
