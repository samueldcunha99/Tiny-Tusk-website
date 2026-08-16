import { useId } from 'react'
import { colourVar } from './BrandArtView'
import type { BrandColour } from '@/design/pairings'

export type TextOnPathMode = 'arc' | 'ring'

export interface TextOnPathProps {
  text: string
  mode?: TextOnPathMode | undefined
  tone?: BrandColour | 'current' | undefined
  className?: string | undefined
}

/**
 * Type set on an arc or a repeating ring (identity guide p35).
 *
 * There is no roundel mode: the tagline roundel is fixed artwork on the
 * client's board, not type the site is free to re-set, so it lives in
 * `<Roundel>` as extracted outlines.
 */
export function TextOnPath({ text, mode = 'arc', tone = 'cobalt', className }: TextOnPathProps) {
  const pathId = useId().replace(/:/g, '')

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
