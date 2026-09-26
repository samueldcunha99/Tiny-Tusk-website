import { useEffect, useRef } from 'react'
import { ART } from '@/assets/brand/paths'
import { BrandArtView } from './BrandArtView'
import { gsap, EASE, onArrival, primeDraw, usePrefersReducedMotion } from '@/lib/motion'
import type { BrandColour } from '@/design/pairings'

export type DoodleName =
  | 'doodleToothbrush'
  | 'doodleToothpaste'
  | 'doodleHeart'
  | 'doodleFace'
  | 'markLasso'
  | 'markDashes'
  | 'markArrow'
  | 'markZigzag'
  | 'journeyDetection'
  | 'journeyTreatment'
  | 'journeyLogo'
  | 'journeyCare'
  | 'journeySmile'
  /** The p28 background loop, for a chapter that draws its own field on. */
  | 'loopStroke'

export interface DoodleProps {
  name: DoodleName
  tone?: BrandColour | 'current' | undefined
  className?: string | undefined
  title?: string | undefined
  /** Draw the doodle on when it scrolls into view. */
  drawOnScroll?: boolean | undefined
  /**
   * Replay the draw when this flips true (hover- and focus-driven cards).
   *
   * The doodle always rests *complete*: a card that is never hovered -- or a
   * touch device, where hover does not exist -- must still show a finished
   * icon. `play` re-runs the gesture, it does not gate visibility.
   */
  play?: boolean | undefined
  /**
   * Redraw the doodle by hand when it is tapped or clicked -- a small reward
   * for a curious child. Decorative only: nothing depends on it, so it needs
   * no keyboard equivalent. Skipped under reduced motion.
   */
  tap?: boolean | undefined
  duration?: number | undefined
  stagger?: number | undefined
  /** Pass `"none"` to stretch the mark to its box (see `<Circled>`). */
  preserveAspectRatio?: string | undefined
}

/**
 * A brand doodle or supporting mark, drawn on rather than faded in.
 *
 * Strokes animate their own dash offset. Variable-width artwork animates the
 * dash offset of its reveal mask instead, which produces the same gesture
 * without distorting the taper.
 */
export function Doodle({
  name,
  tone,
  className,
  title,
  drawOnScroll = false,
  play,
  tap = false,
  duration = 0.9,
  stagger = 0.12,
  preserveAspectRatio,
}: DoodleProps) {
  const ref = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()
  const art = ART[name]

  useEffect(() => {
    const svg = ref.current
    if (!svg || !art) return
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-draw]'))
    if (!paths.length) return

    if (reduced) {
      paths.forEach((p) => primeDraw(p, true))
      return
    }

    // Controlled mode: rest complete, replay the gesture when `play` is true.
    if (play !== undefined) {
      const lengths = paths.map((p) => primeDraw(p, false))
      if (play) {
        gsap.fromTo(
          paths,
          { strokeDashoffset: (i: number) => lengths[i] ?? 0 },
          {
            strokeDashoffset: 0,
            duration,
            ease: EASE.entrance,
            stagger,
            overwrite: true,
          },
        )
      } else {
        gsap.set(paths, { strokeDashoffset: 0 })
      }
      return () => {
        gsap.killTweensOf(paths)
      }
    }

    if (!drawOnScroll) {
      paths.forEach((p) => primeDraw(p, true))
      return
    }

    // Art already on screen as the page wakes stays drawn (`onArrival`).
    const stop = onArrival(
      svg,
      () => paths.forEach((p) => primeDraw(p, false)),
      () =>
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration,
          ease: EASE.entrance,
          stagger,
          overwrite: true,
        }),
    )
    return () => {
      stop()
      gsap.killTweensOf(paths)
      paths.forEach((p) => primeDraw(p, true))
    }
  }, [art, drawOnScroll, duration, play, reduced, stagger])

  useEffect(() => {
    const svg = ref.current
    if (!svg || !tap || reduced) return
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-draw]'))
    if (!paths.length) return
    const replay = () => {
      const lengths = paths.map((p) => p.getTotalLength())
      gsap.set(paths, { strokeDasharray: (i: number) => lengths[i] ?? 0 })
      gsap.fromTo(
        paths,
        { strokeDashoffset: (i: number) => lengths[i] ?? 0 },
        { strokeDashoffset: 0, duration, ease: EASE.entrance, stagger, overwrite: true },
      )
    }
    svg.addEventListener('pointerdown', replay)
    return () => svg.removeEventListener('pointerdown', replay)
  }, [tap, reduced, duration, stagger])

  if (!art) return null

  return (
    <BrandArtView
      ref={ref}
      art={art}
      tone={tone}
      className={className}
      title={title}
      preserveAspectRatio={preserveAspectRatio}
      drawable
    />
  )
}
