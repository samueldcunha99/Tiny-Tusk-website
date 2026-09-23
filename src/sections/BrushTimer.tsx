import { useEffect, useRef, useState } from 'react'
import { colourVar } from '@/components/BrandArtView'
import { Doodle } from '@/components/Doodle'
import { EllipseTitle } from '@/components/EllipseTitle'
import { StylisedCTA } from '@/components/StylisedCTA'
import { BRUSH_ROUNDS } from '@/content/games'
import { gsap, EASE, usePrefersReducedMotion } from '@/lib/motion'

const TOTAL_SECONDS = 120
const RING = 2 * Math.PI * 96

/**
 * The 2-Minute Brushing Game -- coral, the palette's fourth step.
 *
 * Nothing readable touches the coral. The title sits on the canary ellipse and
 * the clock inside a cobalt disc -- the disc the tagline roundel is printed on
 * -- so the section has no panels at all. The toothbrush behind is the guide's
 * p32 move: an illustration scaled up into a field, white at 33% (p27).
 *
 * `EASE.celebrate` belongs to exactly one moment on the site, the finish.
 */
export function BrushTimer() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const circleRef = useRef<SVGCircleElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const elapsedSeconds = TOTAL_SECONDS - secondsLeft
  const activeRound = Math.min(
    BRUSH_ROUNDS.length - 1,
    Math.floor(elapsedSeconds / (TOTAL_SECONDS / BRUSH_ROUNDS.length)),
  )

  useEffect(() => {
    let interval: number | undefined
    if (isActive && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft((prev) => prev - 1)
      }, 1000)
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false)
      setIsCompleted(true)
    }
    return () => clearInterval(interval)
  }, [isActive, secondsLeft])

  // The canary ring fills as the two minutes run.
  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
    const offset = RING * (1 - elapsedSeconds / TOTAL_SECONDS)
    if (reduced) {
      circle.style.strokeDashoffset = `${offset}`
      return
    }
    gsap.to(circle, { strokeDashoffset: offset, duration: 0.5, ease: EASE.entrance })
  }, [elapsedSeconds, reduced])

  useEffect(() => {
    if (!isCompleted || !confettiRef.current || reduced) return
    const pieces = confettiRef.current.querySelectorAll('[data-confetti]')
    gsap.fromTo(
      pieces,
      { scale: 0, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: EASE.celebrate, stagger: 0.08 },
    )
  }, [isCompleted, reduced])

  const resetTimer = () => {
    setIsActive(false)
    setIsCompleted(false)
    setSecondsLeft(TOTAL_SECONDS)
  }

  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer()
      return
    }
    setIsActive((prev) => !prev)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const clock = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  const status = isCompleted ? 'All clean!' : isActive || elapsedSeconds > 0 ? BRUSH_ROUNDS[activeRound] : 'Ready'
  const toggle = isCompleted
    ? { lead: 'Brush', rest: 'again' }
    : isActive
      ? { lead: 'Pause', rest: 'for now' }
      : elapsedSeconds > 0
        ? { lead: 'Keep', rest: 'brushing' }
        : { lead: 'Start', rest: 'brushing' }

  // Announce the changes that matter -- a new round, a pause, the finish --
  // rather than every second, which is noise to a screen reader.
  const announcement = isCompleted
    ? 'Brushing finished. Great job!'
    : isActive
      ? `${BRUSH_ROUNDS[activeRound]}. Keep brushing.`
      : elapsedSeconds > 0
        ? 'Timer paused.'
        : ''

  return (
    <section
      id="brush-timer"
      data-surface="coral"
      aria-labelledby="brush-heading"
      className="tt-section relative overflow-hidden bg-coral px-6 pb-20 pt-20 md:px-10 md:pb-24 md:pt-28"
    >
      <Doodle
        name="doodleToothbrush"
        tone="white"
        drawOnScroll
        duration={1.4}
        className="pointer-events-none absolute -left-20 top-6 w-[24rem] opacity-[0.33] md:left-[4%] md:w-[34rem]"
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center justify-items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <EllipseTitle>
          <h2 id="brush-heading" className="text-center font-display text-[clamp(2.1rem,9vw,3.5rem)] leading-[0.98] text-cobalt">
            <span className="block font-semibold">The 2-Minute</span> Brushing Game
          </h2>
        </EllipseTitle>

        <div className="flex flex-col items-center gap-8">
          <div className="relative aspect-square w-[min(80vw,22rem)] rounded-full bg-cobalt text-white" data-surface="cobalt">
            {/* Official register on the disc, p26: a cobalt-60 track. */}
            <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true" focusable="false">
              <circle cx="110" cy="110" r="96" fill="none" stroke={colourVar('cobalt-60')} strokeWidth="9" />
              <circle
                ref={circleRef}
                cx="110"
                cy="110"
                r="96"
                fill="none"
                stroke={colourVar('canary')}
                strokeWidth="9"
                strokeLinecap="round"
                style={{ strokeDasharray: RING, strokeDashoffset: RING }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Doodle
                name={isCompleted ? 'doodleFace' : isActive ? 'doodleToothbrush' : 'doodleToothpaste'}
                tone="canary"
                tap
                className="w-12 md:w-14"
              />
              <span role="timer" className="mt-2 font-display text-[clamp(3.25rem,15vw,4.5rem)] font-semibold leading-none tabular-nums">
                {clock}
              </span>
              <span className="mt-2 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-canary">
                {status}
              </span>
              <span className="mt-3 flex gap-2" aria-hidden="true">
                {BRUSH_ROUNDS.map((round, index) => (
                  <span
                    key={round}
                    className="block h-2 w-2 rounded-full"
                    style={{
                      background: colourVar(isCompleted || (elapsedSeconds > 0 && index <= activeRound) ? 'canary' : 'cobalt-60'),
                    }}
                  />
                ))}
              </span>
            </div>

            <div ref={confettiRef} className="pointer-events-none absolute -inset-10" aria-hidden="true">
              {isCompleted ? (
                <>
                  <div data-confetti className="absolute left-0 top-4 w-16">
                    <Doodle name="markZigzag" tone="canary" />
                  </div>
                  <div data-confetti className="absolute right-0 top-0 w-12">
                    <Doodle name="markDashes" tone="canary" />
                  </div>
                  <div data-confetti className="absolute bottom-2 right-2 w-14">
                    <Doodle name="doodleHeart" tone="canary" />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <StylisedCTA lead={toggle.lead} rest={toggle.rest} onClick={toggleTimer} fill="canary" />
            {elapsedSeconds > 0 ? (
              <StylisedCTA lead="Start" rest="over" onClick={resetTimer} fill="powder" />
            ) : null}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  )
}
