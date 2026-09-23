import {
  ROUNDEL_MARK,
  ROUNDEL_SMILE,
  ROUNDEL_TABS,
  ROUNDEL_TAGLINE,
  ROUNDEL_VIEWBOX,
} from '@/assets/roundelPaths'
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
      <path d={ROUNDEL_TAGLINE} />
      {[...ROUNDEL_SMILE, ...ROUNDEL_TABS, ...ROUNDEL_MARK].map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  )
}
