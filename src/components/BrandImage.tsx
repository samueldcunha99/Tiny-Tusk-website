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
  title?: { lead: string; rest: string; fill: 'canary' | 'powder' | 'coral'; href: string } | undefined
  showCTA?: boolean | undefined
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
  showCTA = true,
  logoTone,
  doodle,
  doodleTone,
  className,
  eager = false,
}: BrandImageProps) {
  return (
    <figure className={['relative overflow-hidden rounded-[1.5rem] bg-powder', className].filter(Boolean).join(' ')}>
      {webp && png ? (
        <picture className="block h-full w-full">
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
          className="relative grid h-full min-h-[320px] place-items-center bg-powder p-8 text-center"
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <Logo variant="mark" tone="cobalt" size={240} className="h-full w-full" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <Doodle name="doodleHeart" tone="cobalt" className="w-16" />
            <span className="font-display text-h2 text-cobalt">
              {title ? `${title.lead} ${title.rest}` : 'Dr. Nupur'}
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.15em] text-cobalt-80">Tiny Tusk Photography</span>
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute left-2 top-2 z-10" aria-hidden="true">
        <Logo variant="mark" tone={logoTone} size={64} clearSpace />
      </div>
      <Doodle name={doodle} tone={doodleTone} drawOnScroll className="pointer-events-none absolute right-4 top-[10%] z-10 w-[20%] max-w-24 opacity-90" />
      <Doodle name="markDashes" tone="coral" drawOnScroll className="pointer-events-none absolute right-4 top-4 z-10 w-10" />
      {showCTA && title ? (
        <div className="absolute bottom-2 left-2 right-2 z-20 sm:bottom-3 sm:left-3 sm:right-3">
          <StylisedCTA lead={title.lead} rest={title.rest} href={title.href} fill={title.fill} className="w-full text-center shadow-lg" />
        </div>
      ) : null}
    </figure>
  )
}
