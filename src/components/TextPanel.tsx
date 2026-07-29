import type { ReactNode } from 'react'
import { colourVar } from './BrandArtView'
import { carriesText, type BrandColour } from '@/design/pairings'

/**
 * Puts copy on a legible bed when the surface behind it cannot carry text.
 *
 * Coral is the case this exists for: it is a full brand colour and the guide
 * uses it as a field, but nothing in the palette reaches even 3:1 on it. Rather
 * than drop coral or tint it (which would change the brand), we keep the coral
 * field and float the text on cobalt inside it.
 *
 * On surfaces that *can* carry text this renders nothing extra, so call sites
 * can wrap unconditionally.
 */
export function TextPanel({
  surface,
  children,
  className,
}: {
  surface: BrandColour
  children: ReactNode
  className?: string
}) {
  if (carriesText(surface)) {
    return <div className={className}>{children}</div>
  }
  return (
    <div
      className={['rounded-[1.5rem] p-6 md:p-7', className].filter(Boolean).join(' ')}
      style={{ background: colourVar('cobalt') }}
      data-surface="cobalt"
    >
      {children}
    </div>
  )
}

/** The element colour to use for text, given the surface it will sit on. */
export function textToneFor(surface: BrandColour, preferred: BrandColour): BrandColour {
  return carriesText(surface) ? preferred : 'canary'
}
