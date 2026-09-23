import type { ReactNode } from 'react'
import { ART } from '@/assets/brand/paths'
import { colourVar } from '@/components/BrandArtView'

/**
 * The guide's stylised title (p33-34, "Do not use these!"): words set on a
 * filled ellipse with its hand-drawn outline sitting slightly off it,
 * stretched to whatever it holds. Canary with a cobalt line, or cobalt with a
 * canary line -- each the other's p24 partner (cobalt on canary is 6.37:1).
 *
 * It is how the brushing game puts words on coral without a box (coral carries
 * no text, hard rule 1), and how Parents' Corner turns a question into a
 * speech bubble. The outline keeps one weight however far the shape is
 * stretched (`non-scaling-stroke`); stretched art would otherwise thicken it
 * along the long sides.
 */
export function EllipseTitle({
  children,
  fill = 'canary',
  className = 'px-12 py-10 md:px-16 md:py-12',
}: {
  children: ReactNode
  fill?: 'canary' | 'cobalt' | undefined
  className?: string | undefined
}) {
  const art = ART.ctaCanary
  const shape = art.parts.find((part) => part.kind === 'fill')
  const outline = art.parts.find((part) => part.kind === 'stroke')
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox={art.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {shape ? <path d={shape.d} fill={colourVar(fill)} /> : null}
        {outline && outline.kind === 'stroke' ? (
          <path
            d={outline.d}
            fill="none"
            stroke={colourVar(fill === 'canary' ? 'cobalt' : 'canary')}
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
      <div className="relative">{children}</div>
    </div>
  )
}
