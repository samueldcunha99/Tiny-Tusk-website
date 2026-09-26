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
 * Clearing measures nothing (and returns 0): `getTotalLength` makes the
 * browser lay the page out first, which is only worth paying to hide a stroke.
 */
export function primeDraw(path: SVGGeometryElement, reduced: boolean): number {
  if (reduced) {
    path.style.strokeDasharray = ''
    path.style.strokeDashoffset = ''
    return 0
  }
  const length = path.getTotalLength()
  path.style.strokeDasharray = `${length}`
  path.style.strokeDashoffset = `${length}`
  return length
}

/**
 * Where a scroll reveal fires: when the element's top reaches 88% of the
 * viewport. One number for the whole site, so every chapter enters on the same
 * beat (audit #18 -- thresholds had drifted section by section).
 */
const REVEAL_LINE = 0.88

interface Arrival {
  prepare: () => void
  play: () => void
  prepared: boolean
}

const arrivals = new Map<Element, Arrival>()
let nearing: IntersectionObserver | undefined
let crossing: IntersectionObserver | undefined

function forget(el: Element): void {
  arrivals.delete(el)
  nearing?.unobserve(el)
  crossing?.unobserve(el)
}

/**
 * An entrance for an element scrolling in from below: `prepare` runs once it
 * is within half a screen of the viewport -- still unseen, so it can be hidden
 * ready -- and `play` as its top crosses the reveal line. An element already on
 * screen when first seen gets neither: pages arrive as prerendered HTML, so it
 * was painted finished before any script ran, and hiding it to animate it back
 * in would only make it blink. Returns the cleanup.
 *
 * Two shared IntersectionObservers rather than a ScrollTrigger per element:
 * observers measure inside the browser's own rendering step, so a page full of
 * drawings and reveals forces no layouts as it wakes (Lighthouse's "forced
 * reflow", and much of the blocking time), and nothing is split or hidden
 * until it is about to be seen.
 */
export function onArrival(el: Element, prepare: () => void, play: () => void): () => void {
  const across =
    crossing ??
    (crossing = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const arrival = arrivals.get(entry.target)
          if (!arrival || !entry.isIntersecting) continue
          forget(entry.target)
          arrival.play()
        }
      },
      { rootMargin: `0px 0px -${Math.round((1 - REVEAL_LINE) * 100)}% 0px` },
    ))
  const near =
    nearing ??
    (nearing = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const arrival = arrivals.get(entry.target)
          if (!arrival || arrival.prepared || !entry.isIntersecting) continue
          if (entry.boundingClientRect.top < window.innerHeight) {
            forget(entry.target)
            continue
          }
          arrival.prepared = true
          arrival.prepare()
          across.observe(entry.target)
        }
      },
      { rootMargin: '0px 0px 50% 0px' },
    ))
  arrivals.set(el, { prepare, play, prepared: false })
  near.observe(el)
  return () => forget(el)
}

/**
 * The site's clip reveal (CLAUDE.md §4: text enters by clip reveal, never by a
 * fade). Every `[data-reveal]` inside `scope` is split into masked lines that
 * rise into place, once, as it reaches the reveal line (`onArrival`). After the
 * rise the split is reverted, so the finished heading is the original markup
 * again -- nothing stays clipped, and a lasso or a line break is never left
 * inside a mask. Text already on screen as the page wakes is left alone.
 *
 * Under reduced motion nothing is split or hidden: the markup is already the
 * finished page. The CSS layer in index.css covers the same ground.
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const root = scope.current
    if (!root || reduced) return

    // Splits made later, as each element nears, are still reverted with it.
    const ctx = gsap.context(() => {}, root)
    const stops = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).map((el) => {
      let rise: gsap.core.Tween | undefined
      let arrived = false
      return onArrival(
        el,
        () =>
          ctx.add(() => {
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'tt-line',
              // No aria-label on the element: on a paragraph it is a
              // prohibited attribute, and the split lines hold the same words
              // in the same order, so assistive tech reads them unchanged.
              aria: 'none',
              // A lasso (`<Circled>`) is one unit: never split into it.
              ignore: '[data-split-keep]',
              // Re-split on font load and resize until the rise has played, so
              // a line break measured against the fallback face never survives.
              // Returning the rise lets SplitText carry it across a re-split.
              autoSplit: true,
              onSplit(self) {
                rise = gsap.from(self.lines, {
                  yPercent: 110,
                  duration: 0.9,
                  ease: EASE.entrance,
                  stagger: el.dataset.reveal === 'fast' ? STAGGER / 2 : STAGGER,
                  paused: !arrived,
                  onComplete: () => {
                    self.kill()
                    self.revert()
                  },
                })
                return rise
              },
            })
          }),
        () => {
          arrived = true
          rise?.play()
        },
      )
    })

    return () => {
      stops.forEach((stop) => stop())
      ctx.revert()
    }
  }, [reduced])
}

const INTRO_KEY = 'tiny-tusk-preloader-seen'
const INTRO_DONE = 'tt:intro-done'

/**
 * True while the first-visit preloader still owns the screen. The inline
 * script at the top of index.html decides it, before the first paint, and marks
 * `<html>` with `tt-intro`: first page of the session (`INTRO_KEY` unset) and
 * motion allowed. The prerendered cover shows only under that class, so a
 * visitor with no script, or one who has already seen it, never sees it.
 */
export function introPending(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('tt-intro')
}

/** The preloader calls this when it hands the screen over, skipped or not. */
export function markIntroDone(): void {
  try {
    sessionStorage.setItem(INTRO_KEY, 'yes')
  } catch {
    // Storage blocked: the preloader simply shows again next visit.
  }
  document.documentElement.classList.remove('tt-intro')
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
