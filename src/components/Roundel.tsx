import { ROUNDEL_VIEWBOX } from '@/assets/roundelPaths'
import { ROUNDEL_PARTS, sheetHref, useArtSheet } from './ArtSheet'
import { colourVar } from './BrandArtView'
import type { BrandColour } from '@/design/pairings'

export interface RoundelProps {
  tone?: BrandColour | 'current' | undefined
  /** Give it a title and it becomes an image to assistive tech, not decoration. */
  title?: string | undefined
  className?: string | undefined
}

/**
 * The tagline roundel exactly as the guide's cover (p1) sets it: curved
 * tagline, the mark, the smile and its two tabs, one unit. Geometry comes from
 * `tools/extract-roundel.py`, so the mark's size and position inside the ring
 * are the guide's, not a call site's guess -- do not re-compose this from
 * `<TextOnPath>` plus a separate `<Logo>`. (An earlier extraction from the
 * client's lollipop board drew the mark ~40% larger; the user rejected it.)
 *
 * The cover prints it white on cobalt; here it is a single tone on whatever
 * surface it sits on.
 */
export function Roundel({ tone = 'cobalt', title, className }: RoundelProps) {
  // The page can show it three times (intro, hero, footer); its heavy paths
  // are drawn once on the art sheet. They take the fill set here.
  const sheet = useArtSheet()
  return (
    <svg
      viewBox={ROUNDEL_VIEWBOX}
      className={className}
      fill={colourVar(tone)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {ROUNDEL_PARTS.map((d, i) => {
        const href = sheetHref(sheet, `tt-roundel-${i}`, d)
        return href ? <use key={i} href={href} /> : <path key={i} d={d} />
      })}
    </svg>
  )
}
