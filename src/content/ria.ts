import type { DoodleName } from '@/components/Doodle'

export interface RiaMoment {
  id: string
  eyebrow: string
  title: string
  body: string
  glyph: DoodleName
}

export const RIA_JOURNEY: readonly RiaMoment[] = [
  {
    id: 'arrive',
    eyebrow: 'Before the chair',
    title: 'Ria brought her rabbit.',
    body: 'At six, Ria was certain a dentist would be loud. So we met her at the door, found a seat for Rabbit, and spent a few minutes pressing the chair buttons together.',
    glyph: 'doodleHeart',
  },
  {
    id: 'look',
    eyebrow: 'A look, not a rush',
    title: 'She got to be in charge of the pace.',
    body: 'We counted her teeth with a tiny mirror while Mum stayed close. We named each tool before it came near her and stopped whenever Ria lifted a hand.',
    glyph: 'journeyDetection',
  },
  {
    id: 'leave',
    eyebrow: 'On the way home',
    title: 'She left grinning — rabbit too.',
    body: 'There was no treatment needed, just a clear plan for brushing the back teeth. At the next visit, Ria walked in first. That is the kind of confidence we want to build.',
    glyph: 'doodleFace',
  },
] as const
