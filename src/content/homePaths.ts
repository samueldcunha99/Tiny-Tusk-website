import type { DoodleName } from '@/components/Doodle'

export interface HomePath {
  id: 'visit' | 'brushing' | 'clinic'
  tab: string
  title: string
  body: string
  href: string
  cta: {
    lead: string
    rest: string
  }
  glyph: DoodleName
}

export const HOME_PATHS: readonly HomePath[] = [
  {
    id: 'visit',
    tab: 'Plan a first visit',
    title: 'Take the visit one step at a time',
    body:
      'See how the journey works, meet Dr. Nupur, and explore the services before you decide what comes next.',
    href: '/services',
    cta: {
      lead: 'Explore',
      rest: 'the first visit',
    },
    glyph: 'doodleHeart',
  },
  {
    id: 'brushing',
    tab: 'Make brushing playful',
    title: 'Turn two minutes into a small game',
    body:
      'Open the brushing game, start the timer, and follow the full two minutes together.',
    href: '/games',
    cta: {
      lead: 'Play',
      rest: 'the brushing game',
    },
    glyph: 'doodleToothbrush',
  },
  {
    id: 'clinic',
    tab: 'Look around the clinic',
    title: 'See the atmosphere we are building',
    body:
      'Explore concept visuals for the reception, treatment room, and family learning corner.',
    href: '/inside-clinic',
    cta: {
      lead: 'Step',
      rest: 'inside the clinic',
    },
    glyph: 'journeyCare',
  },
] as const
