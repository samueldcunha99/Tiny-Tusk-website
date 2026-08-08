import { useId } from 'react'
import { colourVar } from './BrandArtView'
import type { BrandColour } from '@/design/pairings'

export interface TextOnPathProps {
  text: string
  tone?: BrandColour | 'current' | undefined
  className?: string | undefined
}

export type TextOnPathMode = 'arc' | 'roundel' | 'ring'

export interface TextOnPathProps {
  text: string
  mode?: TextOnPathMode | undefined
  tone?: BrandColour | 'current' | undefined
  className?: string | undefined
}

/**
 * Text on a path supporting arc, roundel, and repeating-ring modes (identity guide p35).
 */
export function TextOnPath({ text, mode = 'arc', tone = 'cobalt', className }: TextOnPathProps) {
  const pathId = useId().replace(/:/g, '')

  if (mode === 'roundel') {
    return (
      <svg
        viewBox="0 0 300 300"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <path id={pathId} d="M 30 150 A 120 120 0 1 1 270 150 A 120 120 0 1 1 30 150" fill="none" />
        </defs>
        <text
          fill={colourVar(tone)}
          className="font-sans text-[15px] font-semibold tracking-[0.14em] uppercase"
        >
          {/* 25%, not 50%: the path starts at 9 o'clock and sweeps clockwise, so
              half way round is the 3 o'clock point -- the tagline read top-to-
              bottom down the right edge. A quarter of the way round is the top,
              which is where p14 sets it, with the smile arc closing the bottom. */}
          <textPath href={`#${pathId}`} startOffset="25%" textAnchor="middle">
            {text}
          </textPath>
        </text>
        <path
          d="M 90 205 Q 150 250 210 205"
          fill="none"
          stroke={colourVar(tone)}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (mode === 'ring') {
    const ringText = `${text} • ${text} • `
    return (
      <svg
        viewBox="0 0 240 240"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <path id={pathId} d="M 20 120 A 100 100 0 1 1 220 120 A 100 100 0 1 1 20 120" fill="none" />
        </defs>
        <text
          fill={colourVar(tone)}
          className="font-sans text-[13px] font-semibold tracking-[0.12em] uppercase"
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {ringText}
          </textPath>
        </text>
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 720 220"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={pathId} d="M 70 188 Q 360 18 650 188" fill="none" />
      </defs>
      <text
        fill={colourVar(tone)}
        className="font-display text-[29px] tracking-[0.015em]"
      >
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}
