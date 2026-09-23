import { colourVar } from './BrandArtView'
import type { BrandColour } from '@/design/pairings'

/**
 * Where one ground hands over to the next. The home page steps through the
 * palette once -- powder, paper, canary, coral, cobalt (audit item 37: the
 * client asked for "a continuous flow" because the colours "jumped around") --
 * and each handover is the smile that completes the tagline unit (p14): the
 * outgoing colour dips into the incoming one in a curve instead of stopping at
 * a hard rule.
 *
 * Place it between the two sections, in the OUTGOING colour. It overlaps the
 * top of the next section, which carries enough top padding to clear it.
 */
export function SmileEdge({ from }: { from: BrandColour }) {
  return (
    <div aria-hidden="true" className="relative z-10 h-0">
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        focusable="false"
        className="absolute inset-x-0 -top-px block h-[clamp(1.75rem,7vw,4.5rem)] w-full"
      >
        <path d="M0 0H100Q50 20 0 0Z" fill={colourVar(from)} />
      </svg>
    </div>
  )
}
