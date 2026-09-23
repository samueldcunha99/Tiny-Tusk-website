import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger }

/** SSR-safe layout effect (this app is client-only, but keeps React quiet). */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * The easing vocabulary, fixed by the brief. Entrances use power3.out,
 * transforms power2.inOut, and elastic is reserved for exactly one moment:
 * the two-minute brush timer completing.
 */
export const EASE = {
  entrance: 'power3.out',
  transform: 'power2.inOut',
  celebrate: 'elastic.out(1, 0.6)',
} as const

export const STAGGER = 0.08

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * Prime an SVG path for a stroke-draw. Returns the length so callers can
 * animate dashoffset from `length` to 0.
 *
 * Under reduced motion we never touch the dash properties at all, so the
 * artwork renders complete -- the CSS in index.css enforces the same thing.
 */
export function primeDraw(path: SVGGeometryElement, reduced: boolean): number {
  const length = path.getTotalLength()
  if (reduced) {
    path.style.strokeDasharray = ''
    path.style.strokeDashoffset = ''
    return length
  }
  path.style.strokeDasharray = `${length}`
  path.style.strokeDashoffset = `${length}`
  return length
}

/**
 * Where a scroll reveal fires: when the element's top reaches 88% of the
 * viewport. One number for the whole site, so every chapter enters on the same
 * beat (audit #18 -- thresholds had drifted section by section).
 */
export const REVEAL_START = 'top 88%'

/**
 * The site's clip reveal (CLAUDE.md §4: text enters by clip reveal, never by a
 * fade). Every `[data-reveal]` inside `scope` is split into masked lines that
 * rise into place, once, as it reaches `REVEAL_START`. After the rise the split
 * is reverted, so the finished heading is the original markup again -- nothing
 * stays clipped, and a lasso or a line break is never left inside a mask.
 *
 * Under reduced motion nothing is split or hidden: the markup is already the
 * finished page. The CSS layer in index.css covers the same ground.
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  const reduced = usePrefersReducedMotion()

  useIsoLayoutEffect(() => {
    const root = scope.current
    if (!root || reduced) return

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        let rise: gsap.core.Tween | undefined
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'tt-line',
          // A lasso (`<Circled>`) is one unit: never split into it.
          ignore: '[data-split-keep]',
          // Re-split on font load and resize until the rise has played, so a
          // line break measured against the fallback face never survives.
          autoSplit: true,
          onSplit(self) {
            rise?.revert()
            rise = gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: EASE.entrance,
              stagger: el.dataset.reveal === 'fast' ? STAGGER / 2 : STAGGER,
              scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
              onComplete: () => {
                self.kill()
                self.revert()
              },
            })
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])
}

const INTRO_KEY = 'tiny-tusk-preloader-seen'
const INTRO_DONE = 'tt:intro-done'

/** True while the first-visit preloader still owns the screen. */
export function introPending(): boolean {
  try {
    return sessionStorage.getItem(INTRO_KEY) !== 'yes'
  } catch {
    return false
  }
}

/** The preloader calls this when it hands the screen over, skipped or not. */
export function markIntroDone(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, 'yes')
  } catch {
    // Storage blocked: the preloader simply shows again next visit.
  }
  window.dispatchEvent(new Event(INTRO_DONE))
}

/**
 * Run `play` once the preloader has finished -- immediately if it is not
 * showing. The hero builds its entrance paused and plays it here, so it never
 * spends its only performance behind the cobalt intro screen.
 */
export function onIntroDone(play: () => void): () => void {
  if (!introPending()) {
    play()
    return () => {}
  }
  window.addEventListener(INTRO_DONE, play, { once: true })
  return () => window.removeEventListener(INTRO_DONE, play)
}
