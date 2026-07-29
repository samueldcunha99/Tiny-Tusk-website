import type { DoodleName } from '@/components/Doodle'

interface ClinicConcept {
  id: string
  title: {
    lead: string
    rest: string
    fill: 'canary' | 'powder' | 'coral'
  }
  image: {
    stem: string
    alt: string
    width: number
    height: number
    logoTone: 'white' | 'cobalt'
    doodle: DoodleName
    doodleTone: 'canary' | 'coral'
  }
  className: string
}

/**
 * Generated concept imagery, not photography of the clinic. Keep the visible
 * disclosure in InsideClinic until approved real photography replaces it.
 */
export const CLINIC_CONCEPTS = [
  {
    id: 'reception',
    title: { lead: 'A warm', rest: 'welcome', fill: 'canary' },
    image: {
      stem: 'clinic-reception',
      alt: 'Concept image of a calm pediatric dental clinic reception',
      width: 1536,
      height: 1024,
      logoTone: 'cobalt',
      doodle: 'doodleHeart',
      doodleTone: 'coral',
    },
    className: 'lg:col-span-7 aspect-[4/3]',
  },
  {
    id: 'treatment-room',
    title: { lead: 'Calm', rest: 'care spaces', fill: 'powder' },
    image: {
      stem: 'clinic-treatment-room',
      alt: 'Concept image of a bright child-friendly dental treatment room',
      width: 1536,
      height: 1024,
      logoTone: 'cobalt',
      doodle: 'doodleToothpaste',
      doodleTone: 'canary',
    },
    className: 'lg:col-span-5 aspect-[4/3]',
  },
  {
    id: 'family-corner',
    title: { lead: 'Learn', rest: 'together', fill: 'coral' },
    image: {
      stem: 'clinic-family-corner',
      alt: 'Concept image of a family brushing-learning corner inside a pediatric clinic',
      width: 1536,
      height: 1024,
      logoTone: 'cobalt',
      doodle: 'doodleFace',
      doodleTone: 'canary',
    },
    className: 'lg:col-span-12 aspect-[16/7]',
  },
] satisfies readonly ClinicConcept[]
