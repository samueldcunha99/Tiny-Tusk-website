import { useEffect, useRef, type ReactNode } from 'react'
import { ART, type BrandPart } from '@/assets/brand/paths'
import { sheetHref, useArtSheet } from './ArtSheet'
import { colourVar } from './BrandArtView'
import { MixedWeightLabel } from './MixedWeightLabel'
import { gsap, EASE, drawLength, onArrival, primeDraw, usePrefersReducedMotion } from '@/lib/motion'
import type { BrandColour } from '@/design/pairings'

type Fill = 'canary' | 'powder'

const ART_FOR: Record<Fill, keyof typeof ART> = {
  canary: 'ctaCanary',
  powder: 'ctaPowder',
}

/**
 * Label colour per fill.
 * Canary and powder are both high-contrast with cobalt text (6.37:1 and 4.92:1).
 */
const LABEL_ON: Record<Fill, BrandColour> = {
  canary: 'cobalt',
  powder: 'cobalt',
}

/**
 * `lg` is for a CTA that closes a column or a section rather than sitting in a
 * row of controls -- at the default size the ellipse reads as a chip lost in
 * the whitespace. Pair it with `className="w-full"` to stretch the ellipse to
 * the column; the artwork is drawn with `preserveAspectRatio="none"` precisely
 * so it can take that.
 */
type Size = 'md' | 'lg'

const BOX: Record<Size, string> = {
  md: 'min-h-[56px] px-[clamp(2rem,4vw,3.25rem)] py-[clamp(0.9rem,1.6vw,1.15rem)]',
  lg: 'min-h-[78px] px-[clamp(2.5rem,5vw,4rem)] py-[clamp(1.3rem,2.2vw,1.7rem)]',
}

const LABEL_SIZE: Record<Size, string> = {
  md: 'text-[clamp(1rem,1.4vw,1.125rem)]',
  lg: 'text-[clamp(1.2rem,1.9vw,1.5rem)]',
}

export interface StylisedCTAProps {
  lead: string
  rest: string
  href?: string
  onClick?: () => void
  fill?: Fill
  size?: Size | undefined
  className?: string
  children?: ReactNode
}

/**
 * The signature button (guide p33): a filled ellipse with a hand-drawn cobalt
 * outline that deliberately does not quite register with the fill.
 *
 * The outline draws itself in as the button scrolls into view, redraws on
 * hover, focus or tap, and the button is magnetic under a pointer. All of it is
 * skipped under reduced motion, where it stays a perfectly good static button.
 *
 * Note on colour: the guide permits canary elements on coral, but that pairing
 * is ~2.2:1. Button labels are never display-sized, so the label on a coral
 * fill is white, not canary. See docs/contrast-audit.md.
 */
export function StylisedCTA({
  lead,
  rest,
  href,
  onClick,
  fill = 'canary',
  size = 'md',
  className,
}: StylisedCTAProps) {
  const rootRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const reduced = usePrefersReducedMotion()
  const sheet = useArtSheet()
  const art = ART[ART_FOR[fill]]

  useEffect(() => {
    const root = rootRef.current
    // A `<path>`, or a `<use>` of one on the art sheet.
    const outline = root?.querySelector<SVGElement>('[data-draw]')
    if (!root || !outline || reduced) return

    // The outline sketches itself in once, as the button reaches the reveal
    // line -- on a phone, with no hover, that is the gesture's only showing. A
    // button already on screen as the page wakes keeps its outline
    // (`onArrival`).
    const stopArrival = onArrival(
      root,
      () => primeDraw(outline, false),
      () => gsap.to(outline, { strokeDashoffset: 0, duration: 0.9, ease: EASE.entrance }),
    )

    // Measured on the first hover rather than at load: taking a path's length
    // makes the browser lay the page out.
    const redraw = () => {
      const length = drawLength(outline)
      gsap.fromTo(
        outline,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.55, ease: EASE.entrance, overwrite: true },
      )
    }

    const quickX = gsap.quickTo(root, 'x', { duration: 0.4, ease: EASE.transform })
    const quickY = gsap.quickTo(root, 'y', { duration: 0.4, ease: EASE.transform })

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      // magnetic pull, capped so the button never drifts far from its slot
      quickX(gsap.utils.clamp(-12, 12, (e.clientX - (r.left + r.width / 2)) * 0.28))
      quickY(gsap.utils.clamp(-8, 8, (e.clientY - (r.top + r.height / 2)) * 0.28))
    }
    const onLeave = () => {
      quickX(0)
      quickY(0)
    }

    root.addEventListener('pointerenter', redraw)
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('focus', redraw)
    return () => {
      stopArrival()
      root.removeEventListener('pointerenter', redraw)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('focus', redraw)
      gsap.killTweensOf(root)
      gsap.killTweensOf(outline)
    }
  }, [reduced])

  const parts: readonly BrandPart[] = art.parts
  const fillPart = parts.find((p) => p.kind === 'fill')
  const outlinePart = parts.find((p) => p.kind === 'stroke')
  // A page carries ten of these; the ellipse and outline are drawn once on the
  // art sheet and `<use>`d, named by part index as BrandArtView names parts.
  const partId = (part: BrandPart) => `tt-${ART_FOR[fill]}-${parts.indexOf(part)}`
  const fillHref = fillPart ? sheetHref(sheet, partId(fillPart), fillPart.d) : null
  const outlineHref = outlinePart ? sheetHref(sheet, partId(outlinePart), outlinePart.d) : null

  const inner = (
    <>
      <svg
        viewBox={art.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full"
      >
        {fillPart ? (
          fillHref ? (
            <use href={fillHref} fill={colourVar(fill)} />
          ) : (
            <path d={fillPart.d} fill={colourVar(fill)} />
          )
        ) : null}
        {outlinePart && outlinePart.kind === 'stroke' ? (
          outlineHref ? (
            <use
              href={outlineHref}
              fill="none"
              stroke={colourVar('cobalt')}
              strokeWidth={outlinePart.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-draw
            />
          ) : (
            <path
              d={outlinePart.d}
              fill="none"
              stroke={colourVar('cobalt')}
              strokeWidth={outlinePart.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-draw
            />
          )
        ) : null}
      </svg>
      <MixedWeightLabel
        lead={lead}
        rest={rest}
        className={['relative z-10', LABEL_SIZE[size]].join(' ')}
      />
    </>
  )

  const classes = [
    'relative inline-flex items-center justify-center',
    BOX[size],
    'transition-colors duration-200',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const style = { color: colourVar(LABEL_ON[fill]) }

  if (href) {
    return (
      <a ref={rootRef} href={href} className={classes} style={style}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={rootRef} type="button" onClick={onClick} className={classes} style={style}>
      {inner}
    </button>
  )
}
