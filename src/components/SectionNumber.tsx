import type { BrandColour } from '@/design/pairings'
import { colourVar } from './BrandArtView'

/**
 * The guide's own wayfinding, borrowed from its contents page (p2): a section
 * number set small beside the section name. Decorative for screen readers --
 * the heading beside it carries the meaning.
 */
export function SectionNumber({
  number,
  label,
  tone = 'cobalt',
  className,
}: {
  number: string
  label: string
  tone?: BrandColour | 'current'
  className?: string
}) {
  return (
    <p
      className={['flex items-center gap-3 font-sans text-xs uppercase', className]
        .filter(Boolean)
        .join(' ')}
      style={{ color: colourVar(tone), letterSpacing: '0.18em', opacity: 0.85 }}
    >
      <span aria-hidden="true" style={{ fontWeight: 600 }}>
        {number}
      </span>
      <span aria-hidden="true" className="h-px w-8" style={{ background: 'currentColor' }} />
      <span>{label}</span>
    </p>
  )
}
