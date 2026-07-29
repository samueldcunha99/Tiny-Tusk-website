import { forwardRef, useId } from 'react'
import type { BrandArt, BrandPart } from '@/assets/brand/paths'
import type { BrandColour } from '@/design/pairings'

const CSS_COLOUR: Record<BrandColour, string> = {
  cobalt: 'var(--tt-cobalt)',
  coral: 'var(--tt-coral)',
  canary: 'var(--tt-canary)',
  powder: 'var(--tt-powder)',
  paper: 'var(--tt-paper)',
  white: 'var(--tt-white)',
  'cobalt-60': 'var(--tt-cobalt-60)',
}

export function colourVar(c: BrandColour | 'current'): string {
  return c === 'current' ? 'currentColor' : CSS_COLOUR[c]
}

export interface BrandArtViewProps {
  art: BrandArt
  /** Override every part's colour. `current` inherits from CSS colour. */
  tone?: BrandColour | 'current' | undefined
  className?: string | undefined
  /**
   * Mark drawable geometry so animations can find it.
   * Strokes get `data-draw`; masked fills get `data-draw` on their mask strokes.
   */
  drawable?: boolean | undefined
  title?: string | undefined
}

/**
 * Renders extracted brand artwork.
 *
 * A part is one of three kinds. `stroke` parts are true recovered centrelines
 * and animate with stroke-dasharray directly. `maskedFill` parts are the
 * guide's variable-width brush artwork: the fill is exact and a skeleton mask
 * draws it on, which is the only way to animate a tapering stroke without
 * distorting it.
 */
export const BrandArtView = forwardRef<SVGSVGElement, BrandArtViewProps>(function BrandArtView(
  { art, tone, className, drawable = false, title },
  ref,
) {
  const uid = useId().replace(/:/g, '')

  const paint = (part: BrandPart): string => colourVar(tone ?? part.colour)

  return (
    <svg
      ref={ref}
      viewBox={art.viewBox}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {art.parts.map((part, i) => {
        if (part.kind === 'stroke') {
          return (
            <path
              key={i}
              d={part.d}
              fill="none"
              stroke={paint(part)}
              strokeWidth={part.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...(drawable ? { 'data-draw': '' } : {})}
            />
          )
        }
        if (part.kind === 'fill') {
          return <path key={i} d={part.d} fill={paint(part)} fillRule="nonzero" />
        }
        // maskedFill -- exact artwork revealed by an animatable skeleton stroke
        const maskId = `mask-${uid}-${i}`
        const [x, y, w, h] = art.viewBox.split(/\s+/).map(Number) as [number, number, number, number]
        return (
          <g key={i}>
            <defs>
              {/* userSpaceOnUse needs explicit bounds: the default -10%/120%
                  region resolves against the viewport, not the viewBox origin,
                  and this artwork does not sit near the origin. */}
              <mask id={maskId} maskUnits="userSpaceOnUse" x={x} y={y} width={w} height={h}>
                <g
                  fill="none"
                  stroke="#fff"
                  strokeWidth={part.maskWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {part.mask.map((d, k) => (
                    <path key={k} d={d} {...(drawable ? { 'data-draw': '' } : {})} />
                  ))}
                </g>
              </mask>
            </defs>
            <path d={part.d} fill={paint(part)} fillRule="nonzero" mask={`url(#${maskId})`} />
          </g>
        )
      })}
    </svg>
  )
})
