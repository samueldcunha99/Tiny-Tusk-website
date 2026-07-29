/**
 * Permitted colour interactions, transcribed from the identity guide pp. 24-27.
 *
 * The guide is explicit: "it is important to use only these and not switch
 * background colours and element colours." So a pairing is directional --
 * `powder` background with `cobalt` elements is legal; the reverse is not.
 *
 * Every coloured surface on the site goes through <Surface>, which looks its
 * combination up here. In development an illegal pairing throws; in production
 * it degrades to the nearest legal pairing rather than breaking the page.
 */

export type BrandColour =
  | 'cobalt'
  | 'coral'
  | 'canary'
  | 'powder'
  | 'paper'
  | 'white'
  /** lighter tint of cobalt, for the cobalt-on-cobalt "official" pairing (p26) */
  | 'cobalt-60'
export type Register = 'high' | 'low' | 'official' | 'monochrome'

export interface Pairing {
  /** surface colour */
  bg: BrandColour
  /** permitted colour for marks, strokes and display type on that surface */
  element: BrandColour
  /** the register this pairing belongs to */
  register: Register
  /** guide page this pairing is transcribed from */
  source: number
}

export const PAIRINGS: readonly Pairing[] = [
  // p24 -- high contrast. The playful register: marketing surfaces.
  { bg: 'cobalt', element: 'canary', register: 'high', source: 24 },
  { bg: 'coral', element: 'canary', register: 'high', source: 24 },
  { bg: 'powder', element: 'cobalt', register: 'high', source: 24 },
  { bg: 'canary', element: 'cobalt', register: 'high', source: 24 },

  // p25 -- low contrast. Tonal, quiet; for large calm fields.
  { bg: 'powder', element: 'white', register: 'low', source: 25 },
  { bg: 'paper', element: 'canary', register: 'low', source: 25 },
  { bg: 'canary', element: 'white', register: 'low', source: 25 },

  // p26 -- official. "meant for all official documentation to avoid
  // playfulness": booking form, legal pages, clinical information.
  { bg: 'cobalt', element: 'white', register: 'official', source: 26 },
  { bg: 'paper', element: 'powder', register: 'official', source: 26 },
  { bg: 'cobalt', element: 'cobalt-60', register: 'official', source: 26 },
  { bg: 'paper', element: 'cobalt', register: 'official', source: 26 },

  // p27 -- monochrome. White at 33% on any solid brand colour.
  { bg: 'cobalt', element: 'white', register: 'monochrome', source: 27 },
  { bg: 'coral', element: 'white', register: 'monochrome', source: 27 },
  { bg: 'canary', element: 'white', register: 'monochrome', source: 27 },
  { bg: 'powder', element: 'white', register: 'monochrome', source: 27 },
] as const

/** Opacity the guide specifies for monochrome supporting shapes (p27). */
export const MONOCHROME_OPACITY = 0.33

export function isPermitted(bg: BrandColour, element: BrandColour, register?: Register): boolean {
  return PAIRINGS.some(
    (p) => p.bg === bg && p.element === element && (register === undefined || p.register === register),
  )
}

export function elementsFor(bg: BrandColour, register?: Register): BrandColour[] {
  return PAIRINGS.filter((p) => p.bg === bg && (register === undefined || p.register === register)).map(
    (p) => p.element,
  )
}

/**
 * Resolve a requested pairing, complaining loudly in development.
 * Returns a legal element colour for the given surface.
 */
export function resolveElement(bg: BrandColour, element: BrandColour, register?: Register): BrandColour {
  if (isPermitted(bg, element, register)) return element
  const legal = elementsFor(bg, register)
  const message =
    `Illegal brand pairing: "${element}" elements on a "${bg}" surface` +
    (register ? ` in the "${register}" register` : '') +
    `. The guide permits: ${legal.length ? legal.join(', ') : 'nothing for this surface'}.`
  if (import.meta.env.DEV) throw new Error(message)
  console.warn(message)
  return legal[0] ?? 'cobalt'
}

/**
 * Surfaces that cannot legibly carry text in ANY brand colour.
 *
 * Measured against every candidate (see docs/contrast-audit.md):
 *   canary on coral 2.39 · white on coral 2.99 · cobalt on coral 2.67
 *
 * None reaches 4.5:1 for body text, and none reaches even the 3:1 large-text
 * threshold -- white misses it by 0.01. The brief's fallback ("body text on
 * coral must be cobalt or white") therefore does not hold either.
 *
 * So coral stays a full-strength colour field and a graphic colour, and text
 * placed over it sits on a cobalt panel. `<TextPanel>` is the enforcement.
 */
export const NON_TEXT_SURFACES: readonly BrandColour[] = ['coral'] as const

export function carriesText(bg: BrandColour): boolean {
  return !NON_TEXT_SURFACES.includes(bg)
}

/**
 * Guard a text/surface combination at the point of use. Throws in dev so an
 * illegible pairing cannot reach a screenshot, warns in production.
 */
export function assertLegibleText(bg: BrandColour, element: BrandColour): void {
  if (carriesText(bg)) return
  const message =
    `"${bg}" cannot carry text in any brand colour (best available is ` +
    `white at 2.99:1, below the 3:1 large-text floor). Requested "${element}". ` +
    `Wrap the copy in <TextPanel> so it sits on cobalt instead.`
  if (import.meta.env.DEV) throw new Error(message)
  console.warn(message)
}
