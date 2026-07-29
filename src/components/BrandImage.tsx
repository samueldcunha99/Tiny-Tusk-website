import { Doodle, type DoodleName } from './Doodle'
import { Logo } from './Logo'
import { StylisedCTA } from './StylisedCTA'
import type { BrandColour } from '@/design/pairings'

export interface BrandImageProps {
  webp?: string | undefined
  png?: string | undefined
  /** A branded portrait field used until approved photography is supplied. */
  placeholder?: boolean | undefined
  alt: string
  width: number
  height: number
  title: { lead: string; rest: string; fill: 'canary' | 'powder' | 'coral'; href: string }
  logoTone: Extract<BrandColour, 'white' | 'cobalt'>
  doodle: DoodleName
  doodleTone: Extract<BrandColour, 'canary' | 'coral'>
  className?: string | undefined
  eager?: boolean | undefined
}

/**
 * The guide's image-tile treatment: protected logo watermark, title ellipse,
 * a drawn doodle and small coral motion dashes over the photograph itself.
 */
export function BrandImage({
  webp,
  png,
  placeholder = false,
  alt,
  width,
  height,
  title,
  logoTone,
  doodle,
  doodleTone,
  className,
  eager = false,
}: BrandImageProps) {
  return (
    <figure className={['relative overflow-hidden rounded-[1.5rem] bg-powder', className].filter(Boolean).join(' ')}>
      {webp && png ? (
        <picture>
          <source srcSet={webp} type="image/webp" />
          <img
            src={png}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? 'eager' : 'lazy'}
            // React 18 passes this through verbatim, so it must be the
            // lowercase DOM attribute name or it logs a console error.
            {...{ fetchpriority: eager ? 'high' : 'auto' }}
            className="block h-full w-full object-cover"
          />
        </picture>
      ) : placeholder ? (
        <div
          role="img"
          aria-label={alt}
          className="grid h-full min-h-[320px] place-items-center bg-powder"
        >
          <span className="font-display text-[clamp(5rem,15vw,9rem)] text-cobalt">N</span>
        </div>
      ) : null}
      <div className="pointer-events-none absolute left-2 top-2" aria-hidden="true">
        <Logo variant="mark" tone={logoTone} size={64} clearSpace />
      </div>
      <Doodle name={doodle} tone={doodleTone} drawOnScroll className="pointer-events-none absolute right-4 top-[15%] w-[24%] max-w-28" />
      <Doodle name="markDashes" tone="coral" drawOnScroll className="pointer-events-none absolute right-5 top-5 w-12" />
      <div className="absolute bottom-3 left-3 right-3 z-10 sm:bottom-5 sm:left-5 sm:right-5">
        <StylisedCTA lead={title.lead} rest={title.rest} href={title.href} fill={title.fill} className="w-full text-center" />
      </div>
    </figure>
  )
}
