/**
 * brand-source/TINY_TUSK_Icons-NN.svg  ->  src/assets/service-icons/<slug>.svg
 *
 * The client's Illustrator exports are print artwork, not web icons. Three
 * things have to change before they can go on the page:
 *
 *  1. Each file carries its caption as a live <text> in Avenir Next at 10px,
 *     filled #231f20. That is a font we do not have, a colour outside the
 *     palette, and a label that must be real HTML so it scales, translates and
 *     reads to a screen reader. It is removed; the section sets the label.
 *     Only the caption goes -- the N2O and Zzz lettering inside icons 15/16 is
 *     artwork, and is identified by being cobalt rather than #231f20.
 *
 *  2. The exports use near-miss hexes (#1c5695 against cobalt #18528E, #c2cce8
 *     against powder). Strokes become `currentColor` so a tile can tint the
 *     icon by setting `color`; fills become the palette's own custom
 *     properties. No raw hex survives (CLAUDE.md 6.3).
 *
 *  3. The viewBox was sized for artwork + caption, so dropping the caption
 *     leaves ~40% dead height. VIEWBOX below is the measured bounding box of
 *     the remaining artwork (+3 units of padding for the 1.5px stroke),
 *     measured with getBBox() in a browser.
 *
 * Idempotent. Re-run after replacing anything in brand-source/:
 *   node tools/clean-service-icons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const SRC = 'brand-source'
const OUT = 'src/assets/service-icons'

/** Order is the client's own numbering; slug is what the site refers to. */
const ICONS = [
  'infant-oral-care',
  'cleaning',
  'fluoride-sealants',
  'fillings',
  'root-canal',
  'crowns',
  'extraction-space-maintainer',
  'emergency-trauma',
  'braces',
  'invisalign',
  'smile-makeovers',
  'myofunctional-therapy',
  'sports-dentistry',
  'special-needs',
  'laughing-gas',
  'general-anaesthesia',
]

/** Measured artwork bounds, caption excluded: [x, y, w, h]. */
const VIEWBOX = [
  [39.2, 13.5, 45.8, 45.6],
  [33.1, 11, 47.7, 48.7],
  [38.3, 15.1, 47.5, 44.5],
  [43.6, 16.1, 37.1, 43],
  [43.6, 26.3, 37.1, 43],
  [23.9, 24.4, 76.4, 43.7],
  [33.7, 22.6, 56.9, 44.5],
  [39, 22.3, 46.1, 44.5],
  [28.8, 24.5, 66.6, 36.9],
  [24.3, 25.8, 75.7, 32.8],
  [41.1, 18.2, 42, 40.1],
  [45.1, 11.5, 33.9, 51],
  [39, 18.3, 46.1, 44.5],
  [43.6, 18.6, 37.1, 43],
  [36.6, 11.2, 51, 51.8],
  [36.6, 5.5, 51, 54.4],
]

/** Export hex -> what it is in the palette. Case-insensitive. */
const COLOURS = [
  [/#1c5695|#1a5694/gi, 'currentColor'], // cobalt, two roundings of it
  [/#f16c59/gi, 'var(--tt-coral)'],
  [/#fee598/gi, 'var(--tt-canary)'],
  [/#c2cce8/gi, 'var(--tt-powder)'],
  [/#fdfadd/gi, 'var(--tt-paper)'], // the pale bracket fill on `braces`
  [/#fff(?:fff)?\b/gi, 'var(--tt-white)'], // knock-outs, e.g. the N2O canister
]

const CAPTION_FILL = '#231f20'

mkdirSync(OUT, { recursive: true })

for (const [i, slug] of ICONS.entries()) {
  const file = `${SRC}/TINY_TUSK_Icons-${String(i + 1).padStart(2, '0')}.svg`
  let svg = readFileSync(file, 'utf8')

  // The caption's class is whichever rule fills with #231f20.
  const captionClasses = [...svg.matchAll(/\.(cls-\d+)\s*(?:,[^{]*)?\{([^}]*)\}/g)]
    .filter(([, , body]) => body.toLowerCase().includes(CAPTION_FILL))
    .map(([, cls]) => cls)
  if (captionClasses.length !== 1) {
    throw new Error(`${file}: expected exactly one caption class, got ${captionClasses}`)
  }
  const caption = captionClasses[0]

  svg = svg
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(new RegExp(`<text class="${caption}"[\\s\\S]*?</text>`, 'g'), '')
    .replace(new RegExp(`\\s*\\.${caption}\\s*\\{[^}]*\\}`, 'g'), '')
    .replace(/ id="Layer_1" data-name="Layer 1"/, '')
    .replace(/viewBox="[^"]*"/, `viewBox="${VIEWBOX[i].join(' ')}"`)
    // Avenir Next is not licensed here; the site's stand-ins are the two
    // families already loaded, so the in-artwork lettering matches the page.
    .replace(/'Avenir Next Condensed'/g, "'Encode Sans Condensed', sans-serif")
    .replace(/'Avenir Next'/g, "'Montserrat', sans-serif")

  for (const [hex, token] of COLOURS) svg = svg.replace(hex, token)

  // Every export names its classes `cls-1..n`. Inlined into the page, those
  // <style> blocks are document-scoped, so icon 2's `.cls-2` would restyle
  // icon 7's. Namespace them by slug.
  svg = svg.replace(/cls-(\d+)/g, `${slug}-$1`)

  // The caption was set as tspans, so its letter-spacing rules are left behind
  // referring to classes nothing uses any more. Inlined into the page they are
  // dead weight in every bundle, and they show up in the host element's
  // textContent. Drop any rule whose classes have all gone.
  const used = new Set(
    [...svg.matchAll(/class="([^"]+)"/g)].flatMap(([, value]) => value.split(/\s+/)),
  )
  svg = svg.replace(/\s*\.([\w-]+)((?:\s*,\s*\.[\w-]+)*)\s*\{[^}]*\}/g, (rule, first, more) => {
    const classes = [first, ...(more ? more.split(',').map((s) => s.trim().slice(1)) : [])]
    return classes.some((c) => used.has(c)) ? rule : ''
  })

  const leftover = svg.match(/#[0-9a-f]{3,8}\b/gi)
  if (leftover) throw new Error(`${file}: unmapped colour(s) ${[...new Set(leftover)]}`)

  writeFileSync(`${OUT}/${slug}.svg`, svg.replace(/\n{3,}/g, '\n\n').trim() + '\n', 'utf8')
}

console.log(`wrote ${ICONS.length} icons to ${OUT}/`)
