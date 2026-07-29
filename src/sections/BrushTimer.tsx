import { useEffect, useRef, useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { LoopField } from '@/components/LoopField'
import { TextPanel } from '@/components/TextPanel'
import { BRUSH_ROUNDS } from '@/content/games'
import { sectionMeta } from '@/content/site'
import { gsap, EASE, usePrefersReducedMotion } from '@/lib/motion'

const TOTAL_SECONDS = 120

export function BrushTimer({
  asPage = false,
  surface = 'canary',
}: {
  asPage?: boolean | undefined
  surface?: 'canary' | 'coral' | undefined
}) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const circleRef = useRef<SVGCircleElement>(null)
  const confettiRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = sectionMeta('brush-timer')
  const Heading = asPage ? 'h1' : 'h2'
  const elapsedSeconds = TOTAL_SECONDS - secondsLeft
  const activeRound = Math.min(
    BRUSH_ROUNDS.length - 1,
    Math.floor(elapsedSeconds / (TOTAL_SECONDS / BRUSH_ROUNDS.length)),
  )

  // Timer countdown interval
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

  // Animate progress circle stroke
  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return
    const length = circle.getTotalLength()
    if (reduced) {
      circle.style.strokeDasharray = `${length}`
      circle.style.strokeDashoffset = `${length * (1 - (TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS)}`
      return
    }
    const offset = length * (1 - (TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS)
    gsap.to(circle, {
      strokeDashoffset: offset,
      duration: 0.5,
      ease: EASE.entrance,
    })
  }, [secondsLeft, reduced])

  // Completion celebration animation using elastic ease reserved for completion
  useEffect(() => {
    if (!isCompleted || !confettiRef.current || reduced) return
    const elements = confettiRef.current.querySelectorAll('[data-confetti]')
    gsap.fromTo(
      elements,
      { scale: 0, opacity: 0, y: 20 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: EASE.celebrate,
        stagger: 0.08,
      }
    )
  }, [isCompleted, reduced])

  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer()
      return
    }
    setIsActive((prev) => !prev)
  }

  const resetTimer = () => {
    setIsActive(false)
    setIsCompleted(false)
    setSecondsLeft(TOTAL_SECONDS)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <section
      id="brush-timer"
      className={[
        'tt-section relative overflow-hidden px-6 md:px-10',
        asPage
          ? 'py-24 md:py-32'
          : surface === 'coral'
            ? 'pb-20 pt-6 md:pb-24 md:pt-8'
            : 'py-20 md:py-24',
        surface === 'coral' ? 'bg-coral' : 'bg-canary',
      ].join(' ')}
      data-surface={surface}
      aria-labelledby="brush-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      {surface === 'coral' ? (
        <LoopField
          surface="coral"
          contrast="low"
          depth={0.16}
          count={1}
          className="opacity-[0.22]"
        />
      ) : null}
      <div className="relative z-10 mx-auto max-w-[1200px]">
        {surface === 'canary' ? (
          <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        ) : null}

        <div className="mt-4 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <TextPanel
            surface={surface}
            className={
              surface === 'coral'
                ? 'shadow-[0_16px_45px_rgba(24,82,142,0.18)]'
                : ''
            }
          >
            {surface === 'coral' ? (
              <SectionNumber
                number={meta.number}
                label={meta.label}
                tone="canary"
                className="mb-4"
              />
            ) : null}
            <Heading
              id="brush-heading"
              className={[
                'font-display text-h1',
                surface === 'coral' ? 'text-canary' : 'text-cobalt',
              ].join(' ')}
            >
              The 2-Minute Brushing Game
            </Heading>
            <p
              className={[
                'mt-5 max-w-measure font-sans text-body',
                surface === 'coral' ? 'text-white' : 'text-cobalt',
              ].join(' ')}
            >
              Two full minutes can feel like a long time for little ones. Start
              the timer, follow the tooth stroke, and celebrate when the
              squiggles fly!
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={toggleTimer}
                aria-label={isActive ? 'Pause timer' : isCompleted ? 'Restart timer' : 'Start 2-minute timer'}
                className={[
                  'min-h-14 rounded-full px-8 font-sans font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95',
                  surface === 'coral'
                    ? 'bg-canary text-cobalt'
                    : 'bg-cobalt text-white',
                ].join(' ')}
              >
                {isCompleted ? 'Brush Again!' : isActive ? 'Pause' : 'Start Brushing'}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className={[
                  'min-h-14 rounded-full border-2 px-6 font-sans font-semibold transition-colors',
                  surface === 'coral'
                    ? 'border-white/40 text-white hover:bg-white/10'
                    : 'border-cobalt/30 text-cobalt hover:bg-cobalt/10',
                ].join(' ')}
              >
                Reset
              </button>
            </div>

            <div aria-live="polite" className="sr-only">
              {isCompleted
                ? 'Brushing finished! Great job!'
                : isActive
                ? `${secondsLeft} seconds remaining`
                : 'Timer paused'}
            </div>
          </TextPanel>

          <div
            className="relative flex flex-col items-center justify-center rounded-[2.5rem] bg-paper p-8 shadow-[0_12px_40px_rgba(24,82,142,0.08)] sm:p-12"
            data-surface="paper"
          >
            {/* Celebration Confetti Layer */}
            <div
              ref={confettiRef}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
              aria-hidden="true"
            >
              {isCompleted && (
                <>
                  <div data-confetti className="absolute top-6 left-10 w-16">
                    <Doodle name="markZigzag" tone="coral" />
                  </div>
                  <div data-confetti className="absolute bottom-8 right-10 w-16">
                    <Doodle name="markDashes" tone="cobalt" />
                  </div>
                  <div data-confetti className="absolute top-8 right-12 w-14">
                    <Doodle name="doodleHeart" tone="coral" />
                  </div>
                </>
              )}
            </div>

            {/* Timer Circular Ring */}
            <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 220 220" aria-hidden="true">
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  className="stroke-powder"
                  strokeWidth="14"
                  fill="none"
                />
                <circle
                  ref={circleRef}
                  cx="110"
                  cy="110"
                  r="96"
                  className="stroke-cobalt transition-all duration-300 ease-out"
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 2 * Math.PI * 96,
                    strokeDashoffset: 0,
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <Doodle
                  name={isCompleted ? 'doodleFace' : isActive ? 'doodleToothbrush' : 'doodleToothpaste'}
                  tone="cobalt"
                  className="w-16 transition-transform duration-500"
                />
                <span className="mt-2 font-display text-[3.2rem] font-bold leading-none text-cobalt">
                  {formatTime(secondsLeft)}
                </span>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-cobalt/70">
                  {isCompleted ? 'All Clean!' : isActive ? 'Brushing...' : 'Ready'}
                </span>
              </div>
            </div>

            <div className="mt-8 grid w-full grid-cols-4 gap-2">
              {BRUSH_ROUNDS.map((round, index) => {
                const reached = isCompleted || index <= activeRound
                return (
                  <div key={round} className="text-center">
                    <span
                      className={[
                        'block h-2 rounded-full',
                        reached ? 'bg-cobalt' : 'bg-powder',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                    <span className="mt-2 block font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-cobalt">
                      {round}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
