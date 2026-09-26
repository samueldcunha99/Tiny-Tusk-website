import { Doodle, type DoodleName } from './Doodle'
import { Logo } from './Logo'
import { StylisedCTA } from './StylisedCTA'
import type { BrandColour } from '@/design/pairings'

export interface BrandImageProps {
  webp?: string | undefined
  /** Smaller WebP copies with their widths, plus `sizes`, so the browser can pick. */
  webpSrcSet?: string | undefined
  sizes?: string | undefined
  png?: string | undefined
  /** A branded portrait field used until approved photography is supplied. */
  placeholder?: boolean | undefined
  alt: string
  width: number
  height: number
  title?: { lead: string; rest: string; fill: 'canary' | 'powder' | 'coral'; href: string } | undefined
  showCTA?: boolean | undefined
  /**
   * The p31 overlay set: mark watermark, a drawn doodle, and the coral motion
   * dashes. All three are OPTIONAL. They are the guide's treatment for a
   * feature image standing alone -- repeated across a row of three tiles in one
   * section they stopped being a treatment and became noise, so a caller may
   * legitimately want the photograph clean. Omitting `logoTone` drops the
   * watermark; omitting `doodle` drops both the doodle and its dashes.
   */
  logoTone?: Extract<BrandColour, 'white' | 'cobalt'> | undefined
  doodle?: DoodleName | undefined
  doodleTone?: Extract<BrandColour, 'canary' | 'coral'> | undefined
  className?: string | undefined
  eager?: boolean | undefined
}

/**
 * The guide's image-tile treatment: protected logo watermark, title ellipse,
 * a drawn doodle and small coral motion dashes over the photograph itself.
 */
export function BrandImage({
  webp,
  webpSrcSet,
  sizes,
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
          <source srcSet={webpSrcSet ?? webp} sizes={sizes} type="image/webp" />
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
          {/* No "photography" caption: a brand field must not imply that a
              photograph exists. The title is the only words on it. */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <Doodle name="doodleHeart" tone="cobalt" className="w-16" />
            {title ? (
              <span className="font-display text-h2 text-cobalt">{`${title.lead} ${title.rest}`}</span>
            ) : null}
          </div>
        </div>
      ) : null}
      {logoTone ? (
        <div className="pointer-events-none absolute left-2 top-2 z-10" aria-hidden="true">
          <Logo variant="mark" tone={logoTone} size={64} clearSpace />
        </div>
      ) : null}
      {doodle ? (
        <>
          <Doodle name={doodle} tone={doodleTone ?? 'coral'} drawOnScroll className="pointer-events-none absolute right-4 top-[10%] z-10 w-[20%] max-w-24 opacity-90" />
          <Doodle name="markDashes" tone="coral" drawOnScroll className="pointer-events-none absolute right-4 top-4 z-10 w-10" />
        </>
      ) : null}
      {/* No box-shadow: on the link it drew a grey rectangle behind the
          ellipse. Capped width so the drawn ellipse keeps its proportions. */}
      {showCTA && title ? (
        <div className="absolute inset-x-3 bottom-3 z-20 flex justify-center">
          <StylisedCTA lead={title.lead} rest={title.rest} href={title.href} fill={title.fill} className="w-full max-w-[17rem] text-center" />
        </div>
      ) : null}
    </figure>
  )
}
