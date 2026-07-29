import { useEffect, useRef } from 'react'
import { ART } from '@/assets/brand/paths'
import { colourVar } from './BrandArtView'
import { gsap, ScrollTrigger, usePrefersReducedMotion } from '@/lib/motion'
import type { BrandColour } from '@/design/pairings'

/**
 * The oversized looping background strokes (guide pp. 28-29): the logo's
 * single-stroke logic scaled up until it becomes a field.
 *
 * The guide distinguishes two registers, and they are not interchangeable:
 *   high -- the loop crosses colours (canary on powder, white on cobalt)
 *   low  -- the loop is tonal, a lighter value of the surface it sits on
 */
export interface LoopFieldProps {
  surface: BrandColour
  contrast?: 'high' | 'low'
  className?: string
  /** Parallax depth, 0.2-0.5x scroll speed per the motion direction. */
  depth?: number
  count?: 1 | 2 | 3
}

const HIGH_CONTRAST_STROKE: Partial<Record<BrandColour, BrandColour>> = {
  powder: 'canary',
  cobalt: 'white',
  coral: 'canary',
  canary: 'cobalt',
  paper: 'canary',
}

const LOW_CONTRAST_STROKE: Partial<Record<BrandColour, BrandColour>> = {
  powder: 'white',
  cobalt: 'cobalt-60',
  coral: 'white',
  canary: 'white',
  paper: 'canary',
}

export function LoopField({
  surface,
  contrast = 'high',
  className,
  depth = 0.3,
  count = 2,
}: LoopFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const art = ART.loopStroke
  const stroke =
    (contrast === 'high' ? HIGH_CONTRAST_STROKE : LOW_CONTRAST_STROKE)[surface] ?? 'canary'

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const loops = Array.from(el.querySelectorAll<SVGSVGElement>('[data-loop]'))
    const triggers: ScrollTrigger[] = []
    loops.forEach((loop, i) => {
      const tween = gsap.to(loop, {
        yPercent: -18 * depth * (i + 1),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })
    return () => {
      triggers.forEach((t) => t.kill())
      gsap.killTweensOf(loops)
    }
  }, [depth, reduced])

  const part = art.parts[0]
  if (!part || part.kind !== 'stroke') return null

  // Placements chosen to echo p28: loops run off the edges rather than sitting
  // politely inside the frame.
  const placements = [
    { top: '-18%', left: '-22%', width: '86%', rotate: 0 },
    { top: '34%', left: '52%', width: '78%', rotate: 18 },
    { top: '4%', left: '18%', width: '64%', rotate: -12 },
  ].slice(0, count)

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={['pointer-events-none absolute inset-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      {placements.map((p, i) => (
        <svg
          key={i}
          data-loop
          viewBox={art.viewBox}
          className="absolute"
          style={{
            top: p.top,
            left: p.left,
            width: p.width,
            transform: `rotate(${p.rotate}deg)`,
            overflow: 'visible',
          }}
          aria-hidden="true"
          focusable="false"
        >
          <path
            d={part.d}
            fill="none"
            stroke={colourVar(stroke)}
            strokeWidth={part.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}
