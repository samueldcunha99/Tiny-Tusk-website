import type { ReactNode } from 'react'
import { Doodle } from './Doodle'
import type { BrandColour } from '@/design/pairings'

/** Inline lasso treatment from the guide's image and article examples (p32). */
export function Circled({
  children,
  tone = 'cobalt',
}: {
  children: ReactNode
  tone?: BrandColour | undefined
}) {
  return (
    <span className="relative inline-block whitespace-nowrap px-1">
      <span className="relative z-10">{children}</span>
      <Doodle
        name="markLasso"
        tone={tone}
        drawOnScroll
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 z-0 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)]"
      />
    </span>
  )
}
