import { useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

/** Kill every ScrollTrigger created inside a context. Call on unmount. */
export function killTriggers(triggers: ScrollTrigger[]): void {
  triggers.forEach((t) => t.kill())
}
