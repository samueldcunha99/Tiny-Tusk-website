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
export const SECTIONS = [
  { id: 'hero', number: '00', label: 'Welcome' },
  { id: 'journey', number: '01', label: 'The Journey' },
  { id: 'services', number: '02', label: 'Services' },
  { id: 'ria', number: '03', label: "Ria's Journey" },
  { id: 'team', number: '04', label: 'Dr. Nupur' },
  { id: 'brush', number: '05', label: 'The 2-Minute Brush' },
  { id: 'parents', number: '06', label: "Parents' Corner" },
  { id: 'voices', number: '07', label: 'Parent Voices' },
  { id: 'faq', number: '08', label: 'Questions' },
  { id: 'book', number: '09', label: 'Book a Visit' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']
