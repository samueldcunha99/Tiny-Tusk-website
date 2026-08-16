import type { DoodleName } from '@/components/Doodle'

/**
 * The clinic's stated goal, CLIENT-SUPPLIED 2026-08-14 and rendered COMPLETE
 * AND VERBATIM — every sentence the client wrote, in their order, their
 * spelling ("Centralized", "ceiling mounted"), split into three paragraphs
 * purely so it is readable on a wide column. Do not paraphrase it and do not
 * trim it: an earlier pass cut the two middle sentences out into cards and the
 * client noticed. If something here needs to go, ask them first.
 *
 * NOTE for whoever picks this up: the client's line about caring for patients
 * "into adulthood, with treatment facilities available for parents too" is
 * rendered verbatim, but the site's information architecture is still written
 * child-only — nav, services and Hero all assume a child patient. Widening the
 * IA to families is a scope decision that has not been taken yet.
 */
export const CLINIC_VISION = {
  heading: { lead: 'Built around', rest: 'comfort and confidence' },
  paragraphs: [
    'Tiny Tusk is a state-of-the-art pediatric dental clinic designed to care for children at every stage, from infancy through adolescence into adulthood, with treatment facilities available for parents too, so the whole family’s smiles are in one place.',
    'Our clinic is built around comfort and confidence, with centralized nitrous oxide sedation across two fully equipped operatories to help even anxious little patients feel calm and safe. Every space is thoughtfully designed with today’s kids in mind, featuring an engaging play area, ceiling mounted TVs, and a comfort menu that makes each visit feel enjoyable rather than intimidating.',
    'Because at Tiny Tusk, our goal goes beyond treating pain. We aim to give every child a positive dental experience that builds a lifelong, fearless relationship with oral health.',
  ],
} as const

/**
 * The four things the clinic names as being in the space, pulled straight out
 * of `CLINIC_VISION` above as a scannable index beside it.
 *
 * LABELS ONLY, deliberately. They carried a line of description each until the
 * full vision text went back in; at that point the descriptions both repeated
 * the paragraph and were OUR words rather than the clinic's. Do not reintroduce
 * body copy here unless the clinic writes it.
 */
export const CLINIC_AMENITIES = [
  { label: 'Centralized nitrous oxide', glyph: 'doodleFace' },
  { label: 'Two fully equipped operatories', glyph: 'journeyTreatment' },
  { label: 'An engaging play area', glyph: 'doodleHeart' },
  { label: 'Ceiling mounted TVs', glyph: 'markZigzag' },
  { label: 'A comfort menu', glyph: 'doodleToothpaste' },
  { label: 'Treatment for parents too', glyph: 'doodleToothbrush' },
] satisfies readonly { label: string; glyph: DoodleName }[]

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
    className: 'lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:h-full',
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
