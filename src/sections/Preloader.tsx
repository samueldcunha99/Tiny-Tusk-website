import { useRef, useState } from 'react'
import { Wordmark } from '@/components/Logo'
import { Roundel } from '@/components/Roundel'
import { SmileEdge } from '@/components/SmileEdge'
import { CLINIC } from '@/content/site'
import {
  EASE,
  STAGGER,
  gsap,
  introPending,
  markIntroDone,
  useIsoLayoutEffect,
  usePrefersReducedMotion,
} from '@/lib/motion'

/**
 * First visit of a session only: the guide's own cover (p1) on cobalt -- the
 * tagline roundel in white, the name and "Pediatric Dental Clinic" in canary
 * beneath it.
 *
 * The roundel is the client's artwork (`<Roundel>`), never re-set type, so it
 * keeps the guide's lettering. The mark sits alone first; then the tagline
 * writes itself round it in one clockwise sweep from its first letter, and the
 * sweep carries on underneath to draw the smile -- the tagline unit assembling
 * (`.tt-sweep` in index.css holds the geometry). The name rises by clip reveal,
 * and the whole cover lifts away like a page, its trailing edge the tagline's
 * smile. `markIntroDone` then hands the screen to the hero, whose own entrance
 * waits for it (see `onIntroDone`).
 *
 * It replaces a hand-set version -- the tagline typed flat in the body face
 * over a separate arc, and the mark flown to a measured nav position.
 */
export function Preloader() {
  const [visible, setVisible] = useState(introPending)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const finish = () => {
    markIntroDone()
    setVisible(false)
  }

  // Layout effect: the sweep's start state must be set before the first paint,
  // or the finished roundel flashes up and then vanishes.
  useIsoLayoutEffect(() => {
    if (!visible) return
    const root = rootRef.current
    if (!root) return
    if (reduced) {
      finish()
      return
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: finish })
        .fromTo('[data-sweep]', { '--sweep': '0deg' }, { '--sweep': '360deg', duration: 1.1, ease: EASE.transform })
        .from('[data-rise]', { yPercent: 110, duration: 0.7, ease: EASE.entrance, stagger: STAGGER }, 0.6)
        // Past -100% so the smile hanging under the cover clears the top too.
        .to(root, { yPercent: -120, duration: 0.75, ease: EASE.transform }, 1.9)
    }, root)
    return () => ctx.revert()
  }, [reduced, visible])

  if (!visible) return null
  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cobalt px-6"
      data-surface="cobalt"
    >
      <div data-sweep className="tt-sweep w-[clamp(12rem,56vw,17rem)]">
        <Roundel tone="white" title={CLINIC.tagline} className="block h-auto w-full" />
      </div>
      {/* Sizes keep the cover's proportions: the name is ~0.73 of the roundel's
          box, and the box's own margin already makes the gap above it. */}
      <div className="mt-1 overflow-hidden">
        <div data-rise data-animate>
          <Wordmark tone="canary" title={CLINIC.name} className="h-auto w-[clamp(8.75rem,41vw,12.4rem)]" />
        </div>
      </div>
      <p className="tt-mask mt-2">
        <span
          data-rise
          data-animate
          className="block font-sans text-[clamp(0.75rem,3.2vw,0.85rem)] font-medium text-canary"
        >
          {CLINIC.tag}
        </span>
      </p>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 min-h-11 px-4 font-sans text-sm font-semibold text-white/80 underline decoration-2 underline-offset-4 transition-colors hover:text-white"
      >
        Skip intro
      </button>

      {/* The cover's trailing edge as it lifts: the tagline's smile. */}
      <div className="absolute inset-x-0 top-full">
        <SmileEdge from="cobalt" />
      </div>
    </div>
  )
}
