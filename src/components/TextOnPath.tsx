import { useId } from 'react'
import { colourVar } from './BrandArtView'
import type { BrandColour } from '@/design/pairings'

export interface TextOnPathProps {
  text: string
  tone?: BrandColour | 'current' | undefined
  className?: string | undefined
}

/** A restrained arc treatment for pull quotes and short editorial statements. */
export function TextOnPath({ text, tone = 'cobalt', className }: TextOnPathProps) {
  const pathId = useId().replace(/:/g, '')
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
