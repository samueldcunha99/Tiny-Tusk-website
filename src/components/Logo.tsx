import { forwardRef, useEffect, useRef } from 'react'
import { LOGO, WORDMARK } from '@/assets/brand/paths'
import { colourVar } from './BrandArtView'
import type { BrandColour } from '@/design/pairings'

/**
 * Minimum digital size, guide p7. Below this the mark stops being legible.
 * Enforced as a dev-time warning rather than a hard clamp, so a designer can
 * still see what they did wrong instead of silently getting a different size.
 */
export const LOGO_MIN_PX = 64

export type LogoVariant = 'mark' | 'wordmark' | 'wordmark-mark' | 'wordmark-mark-tag'

export interface LogoProps {
  variant?: LogoVariant
  tone?: BrandColour | 'current'
  /** Rendered width of the mark in px. Clear space is derived from it. */
  size?: number
  className?: string
  /**
   * Clear space equal to the mark's own height on all sides (p7), applied as
   * padding on the component so it can never be forgotten at a call site.
   */
  clearSpace?: boolean
  drawable?: boolean
  title?: string
}

const [, , LOGO_W, LOGO_H] = LOGO.viewBox.split(/\s+/).map(Number) as [
  number,
  number,
  number,
  number,
]
const LOGO_RATIO = LOGO_H / LOGO_W

export const Logo = forwardRef<SVGSVGElement, LogoProps>(function Logo(
  {
    variant = 'mark',
    tone = 'cobalt',
    size = 96,
    className,
    clearSpace = false,
    drawable = false,
    title,
  },
  ref,
) {
  const warned = useRef(false)
  useEffect(() => {
    if (!import.meta.env.DEV || warned.current) return
    if (size < LOGO_MIN_PX) {
      warned.current = true
      console.warn(
        `[Logo] Rendered at ${size}px. The identity guide (p7) sets a minimum ` +
          `digital size of ${LOGO_MIN_PX}px so the mark stays legible.`,
      )
    }
  }, [size])

  const paint = colourVar(tone)
  // Clear space is the mark's own height, per p7.
  const pad = clearSpace ? size * LOGO_RATIO : 0

  const mark = (
    <svg
      ref={ref}
      viewBox={LOGO.viewBox}
      width={size}
      height={size * LOGO_RATIO}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {title ? <title>{title}</title> : null}
      <g
        fill="none"
        stroke={paint}
        strokeWidth={LOGO.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={LOGO.body} {...(drawable ? { 'data-draw': '' } : {})} />
        <path d={LOGO.trunk} {...(drawable ? { 'data-draw': '' } : {})} />
      </g>
      <circle cx={LOGO.eye.cx} cy={LOGO.eye.cy} r={LOGO.eye.r} fill={paint} data-logo-eye />
    </svg>
  )

  if (variant === 'mark') {
    return (
      <span className={className} style={{ display: 'inline-block', padding: pad }}>
        {mark}
      </span>
    )
  }

  const wordmarkWidth = variant === 'wordmark' ? size * 3.2 : size * 2.4
  const word = <Wordmark tone={tone} width={wordmarkWidth} />

  if (variant === 'wordmark') {
    return (
      <span className={className} style={{ display: 'inline-block', padding: pad }}>
        {word}
      </span>
    )
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: size * 0.18,
        padding: pad,
      }}
    >
      {mark}
      {word}
      {variant === 'wordmark-mark-tag' ? (
        <span
          className="font-sans uppercase"
          style={{
            color: paint,
            fontSize: Math.max(10, size * 0.13),
            letterSpacing: '0.18em',
            fontWeight: 500,
          }}
        >
          Pediatric Dental Clinic
        </span>
      ) : null}
    </span>
  )
})

export function Wordmark({
  tone = 'cobalt',
  width = 240,
  className,
  title,
}: {
  tone?: BrandColour | 'current'
  width?: number
  className?: string
  title?: string
}) {
  const [, , w, h] = WORDMARK.viewBox.split(/\s+/).map(Number) as [number, number, number, number]
  return (
    <svg
      viewBox={WORDMARK.viewBox}
      width={width}
      height={(width * h) / w}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ display: 'block' }}
    >
      {title ? <title>{title}</title> : null}
      <g fill={colourVar(tone)} fillRule="nonzero">
        {WORDMARK.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
