import { forwardRef, useId } from 'react'
import { ART, type BrandArt, type BrandPart } from '@/assets/brand/paths'
import type { BrandColour } from '@/design/pairings'
import { sheetHref, useArtSheet } from './ArtSheet'

/** artwork -> its name in `ART`, which names its paths on the art sheet. */
const ART_NAME = new Map<BrandArt, string>(Object.entries(ART).map(([name, art]) => [art, name]))

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
  /**
   * Set `"none"` to let the artwork stretch to its box instead of preserving
   * its aspect ratio — needed when a mark has to wrap a run of text.
   */
  preserveAspectRatio?: string | undefined
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
  { art, tone, className, drawable = false, title, preserveAspectRatio },
  ref,
) {
  const uid = useId().replace(/:/g, '')
  const sheet = useArtSheet()
  const name = ART_NAME.get(art)
  // A heavy path is drawn once per page on the art sheet and `<use>`d here.
  const shared = (key: string, d: string) => (name ? sheetHref(sheet, `tt-${name}-${key}`, d) : null)
  const draw = drawable ? { 'data-draw': '' } : {}

  const paint = (part: BrandPart): string => colourVar(tone ?? part.colour)

  return (
    <svg
      ref={ref}
      viewBox={art.viewBox}
      className={className}
      {...(preserveAspectRatio ? { preserveAspectRatio } : {})}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {art.parts.map((part, i) => {
        if (part.kind === 'stroke') {
          const href = shared(`${i}`, part.d)
          const stroke = {
            fill: 'none',
            stroke: paint(part),
            strokeWidth: part.width,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          } as const
          return href ? (
            <use key={i} href={href} {...stroke} {...draw} />
          ) : (
            <path key={i} d={part.d} {...stroke} {...draw} />
          )
        }
        if (part.kind === 'fill') {
          const href = shared(`${i}`, part.d)
          return href ? (
            <use key={i} href={href} fill={paint(part)} fillRule="nonzero" />
          ) : (
            <path key={i} d={part.d} fill={paint(part)} fillRule="nonzero" />
          )
        }
        // maskedFill -- exact artwork revealed by an animatable skeleton stroke
        const maskId = `mask-${uid}-${i}`
        const [x, y, w, h] = art.viewBox.split(/\s+/).map(Number) as [number, number, number, number]
        const fillHref = shared(`${i}`, part.d)
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
                  {part.mask.map((d, k) => {
                    const href = shared(`${i}-m${k}`, d)
                    return href ? <use key={k} href={href} {...draw} /> : <path key={k} d={d} {...draw} />
                  })}
                </g>
              </mask>
            </defs>
            {fillHref ? (
              <use href={fillHref} fill={paint(part)} fillRule="nonzero" mask={`url(#${maskId})`} />
            ) : (
              <path d={part.d} fill={paint(part)} fillRule="nonzero" mask={`url(#${maskId})`} />
            )}
          </g>
        )
      })}
    </svg>
  )
})
