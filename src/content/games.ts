import type { DoodleName } from '@/components/Doodle'

export const GAMES_PAGE = {
  eyebrow: 'Play · Practice · Celebrate',
  title: {
    lead: 'Games',
    rest: 'for Kids',
  },
  intro:
    'Follow along with small, screen-friendly activities for everyday routines. Start with a full two-minute brushing game.',
} as const

export const BRUSH_ROUNDS = [
  'Round one',
  'Round two',
  'Round three',
  'Final round',
] as const

export const GAMES_ARCADE = {
  eyebrow: 'More ways to play',
  title: {
    lead: 'Tiny',
    rest: 'Tusk Arcade',
  },
  intro:
    'Three quick games made from the same friendly shapes that run through the clinic.',
} as const

export interface MemoryCard {
  pair: 'heart' | 'brush' | 'smile'
  label: string
  glyph: DoodleName
}

export const MEMORY_CARDS: readonly MemoryCard[] = [
  { pair: 'heart', label: 'Heart', glyph: 'doodleHeart' },
  { pair: 'brush', label: 'Toothbrush', glyph: 'doodleToothbrush' },
  { pair: 'smile', label: 'Smile', glyph: 'doodleFace' },
  { pair: 'brush', label: 'Toothbrush', glyph: 'doodleToothbrush' },
  { pair: 'heart', label: 'Heart', glyph: 'doodleHeart' },
  { pair: 'smile', label: 'Smile', glyph: 'doodleFace' },
] as const

export interface SequenceStep {
  id: string
  order: number
  label: string
  glyph: DoodleName
}

export const SEQUENCE_STEPS: readonly SequenceStep[] = [
  {
    id: 'timer',
    order: 3,
    label: 'Start the timer',
    glyph: 'markDashes',
  },
  {
    id: 'brush',
    order: 1,
    label: 'Pick up the toothbrush',
    glyph: 'doodleToothbrush',
  },
  {
    id: 'finish',
    order: 4,
    label: 'Celebrate the finish',
    glyph: 'doodleFace',
  },
  {
    id: 'paste',
    order: 2,
    label: 'Add the toothpaste',
    glyph: 'doodleToothpaste',
  },
] as const

export const STICKER_CHOICES = [
  { id: 'heart', label: 'Heart sticker', glyph: 'doodleHeart' },
  { id: 'smile', label: 'Smile sticker', glyph: 'doodleFace' },
  { id: 'spark', label: 'Spark sticker', glyph: 'markDashes' },
] as const satisfies readonly {
  id: string
  label: string
  glyph: DoodleName
}[]
