/**
 * Site content. Typed so it reads like a CMS -- copy lives here, never inline
 * in components. Voice: warm, plain-spoken, parent-to-parent. Never babyish,
 * never clinical.
 */

export const CLINIC = {
  name: 'Tiny Tusk',
  fullName: 'Tiny Tusk Pediatric Dental Clinic',
  tagline: 'Gentle Care for Growing Smiles',
  tag: 'Pediatric Dental Clinic',
  phone: '+44 20 7946 0321',
  phoneHref: 'tel:+442079460321',
  email: 'hello@tinytusk.example',
  address: {
    street: '14 Maple Row',
    city: 'London',
    postcode: 'N1 4QP',
  },
  hours: [
    { days: 'Monday – Friday', time: '8:30am – 5:30pm' },
    { days: 'Saturday', time: '9:00am – 1:00pm' },
    { days: 'Sunday', time: 'Closed' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
} as const

/** The guide's own welcome copy, p34. Used verbatim. */
export const HERO = {
  headline: ['Welcome to', 'Tiny Tusk'],
  headlineTail: 'Pediatric Dental Clinic',
  body:
    'Where little smiles are cared for with kindness, patience, and a whole lot of heart. ' +
    'We believe every child deserves a dental experience that feels safe, gentle, and even ' +
    "a little magical. From a baby's very first tooth to growing confident smiles, we are " +
    'here to walk beside your child through every tiny milestone.',
  cta: { lead: 'Schedule', rest: 'Appointment', href: '#book' },
} as const

/**
 * Section numbering, borrowed from the guide's own contents page (p2).
 * It is the book's wayfinding; carrying it onto the site keeps the two in step.
 */
/**
 * Numbers must stay CONTINUOUS across what actually renders. A slot was
 * previously reserved here for a 2-Minute Brush section that does not exist,
 * so the page visibly counted 00,01,02,03,04,06,07,08,09.
 *
 * If you add a section, insert it here and renumber — do not leave a gap for
 * planned work. Look sections up by `id` (see `sectionMeta`), never by array
 * index, so inserting one cannot silently mislabel every section after it.
 */
export const SECTIONS = [
  { id: 'hero', number: '00', label: 'Welcome' },
  { id: 'journey', number: '01', label: 'The Journey' },
  { id: 'services', number: '02', label: 'Services' },
  { id: 'ria', number: '03', label: "Ria's Journey" },
  { id: 'team', number: '04', label: 'Dr. Nupur' },
  { id: 'parents', number: '05', label: "Parents' Corner" },
  { id: 'voices', number: '06', label: 'Parent Voices' },
  { id: 'faq', number: '07', label: 'Questions' },
  { id: 'book', number: '08', label: 'Book a Visit' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/**
 * Look a section's number and label up by id. Index-based access breaks the
 * moment a section is inserted; this does not.
 */
export function sectionMeta(id: SectionId): (typeof SECTIONS)[number] {
  const found = SECTIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown section id: ${id}`)
  return found
}
