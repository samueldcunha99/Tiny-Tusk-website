import type { ReactNode } from 'react'
import { Doodle } from './Doodle'
import type { BrandColour } from '@/design/pairings'

/**
 * The guide's signature inline move (p32): a hand-drawn lasso around ONE word
 * inside a headline — "the right", "2 minute".
 *
 * Two things this component gets wrong if you are not careful, both of which
 * were live bugs:
 *
 *  - The lasso is an SVG with its own aspect ratio. Without
 *    `preserveAspectRatio="none"` it letterboxes inside the span and the
 *    ellipse cuts straight through the letters instead of enclosing them.
 *  - `white-space: nowrap` is right for a single word, but if you wrap a whole
 *    multi-word title the line can no longer break and the heading clips
 *    mid-word. Wrap a word or two, never a full title.
 */
export function Circled({
  children,
  tone = 'cobalt',
  /** Allow the enclosed text to wrap. Only for deliberately longer phrases. */
  allowWrap = false,
}: {
  children: ReactNode
  tone?: BrandColour | undefined
  allowWrap?: boolean | undefined
}) {
  return (
    <span
      className={[
        'relative inline-block px-[0.35em] py-[0.05em]',
        allowWrap ? '' : 'whitespace-nowrap',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="relative z-10">{children}</span>
      <Doodle
        name="markLasso"
        tone={tone}
        drawOnScroll
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
      />
    </span>
  )
}
