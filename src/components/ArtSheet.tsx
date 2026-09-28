import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { ART, LOGO, WORDMARK } from '@/assets/brand/paths'
import { ROUNDEL_MARK, ROUNDEL_SMILE, ROUNDEL_TABS, ROUNDEL_TAGLINE } from '@/assets/roundelPaths'

/**
 * One copy of each heavy drawing per page.
 *
 * The prerendered home page came to 703 kB, and 370 kB of it was the same path
 * data printed again and again: the five journey glyphs (13-15 kB each) three
 * or four times over, the 23 kB tagline roundel three times, the arrow twenty
 * times. SEO checkers flagged the document size. Now a component points at a
 * heavy path with `<use>`, and the path is printed once, on a hidden sheet.
 *
 * Two sheets. The drawings on every page's first screen -- the roundel,
 * wordmark and mark of the intro, nav and footer, the button's ellipse, the
 * arrow, the dashes, the background loop -- are a fixed set printed at the
 * top, so they never wait for the end of the document to arrive. Everything
 * else registers as it renders and is printed after the page.
 *
 * Each copy is still styled and drawn on its own: a `<use>` hands its fill,
 * stroke and dash properties down to the copy it makes, so a doodle draws
 * itself in exactly as before (`drawLength` in lib/motion.ts measures the
 * sheet's path). The server and the browser register the same paths in the
 * same order, so both sheets hydrate like everything else; a drawing that
 * first appears after hydration -- a game card turning over -- is added then.
 */

/** Shorter paths stay inline: a `<use>` costs about as much as they do. */
const MIN_LENGTH = 200

/** The roundel's parts, in drawing order (Roundel.tsx names them by index). */
export const ROUNDEL_PARTS = [ROUNDEL_TAGLINE, ...ROUNDEL_SMILE, ...ROUNDEL_TABS, ...ROUNDEL_MARK]

/** Sheet ids for an `ART` drawing's parts, the way BrandArtView names them. */
const artParts = (name: keyof typeof ART): [string, string][] =>
  ART[name].parts.flatMap((part, i): [string, string][] =>
    part.kind === 'maskedFill'
      ? [[`tt-${name}-${i}`, part.d], ...part.mask.map((d, k): [string, string] => [`tt-${name}-${i}-m${k}`, d])]
      : [[`tt-${name}-${i}`, part.d]],
  )

const TOP: [string, string][] = [
  ...ROUNDEL_PARTS.map((d, i): [string, string] => [`tt-roundel-${i}`, d]),
  ...WORDMARK.paths.map((d, i): [string, string] => [`tt-wordmark-${i}`, d]),
  ['tt-logo-body', LOGO.body] as [string, string],
  ['tt-logo-trunk', LOGO.trunk] as [string, string],
  ...artParts('ctaCanary'),
  ...artParts('markArrow'),
  ...artParts('markDashes'),
  ...artParts('loopStroke'),
].filter(([, d]) => d.length >= MIN_LENGTH)

const TOP_IDS = new Set(TOP.map(([id]) => id))

export class Sheet {
  readonly paths = new Map<string, string>()
  private onAdd: (() => void) | null = null

  add(id: string, d: string) {
    if (this.paths.has(id)) return
    this.paths.set(id, d)
    if (this.onAdd) queueMicrotask(this.onAdd)
  }

  listen(onAdd: () => void) {
    this.onAdd = onAdd
    return () => {
      this.onAdd = null
    }
  }
}

const SheetContext = createContext<Sheet | null>(null)

export function useArtSheet() {
  return useContext(SheetContext)
}

/**
 * The `href` to `<use>` for this path, registering it on the sheet -- or null
 * to draw it inline (a short path, or no sheet above this component).
 */
export function sheetHref(sheet: Sheet | null, id: string, d: string): string | null {
  if (!sheet || d.length < MIN_LENGTH) return null
  if (!TOP_IDS.has(id)) sheet.add(id, d)
  return `#${id}`
}

export function ArtSheet({ children }: { children: ReactNode }) {
  const [sheet] = useState(() => new Sheet())
  return (
    <SheetContext.Provider value={sheet}>
      <SheetSvg paths={TOP} />
      {children}
      <LateSheet sheet={sheet} />
    </SheetContext.Provider>
  )
}

/** Rendered last, so everything above has registered by now. */
function LateSheet({ sheet }: { sheet: Sheet }) {
  const [, setVersion] = useState(0)
  useEffect(() => sheet.listen(() => setVersion((v) => v + 1)), [sheet])
  return <SheetSvg paths={[...sheet.paths]} />
}

function SheetSvg({ paths }: { paths: [string, string][] }) {
  // Not `display: none`: some browsers will not draw a `<use>` of a path in a
  // hidden subtree. A zero-size box draws nothing itself.
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute h-0 w-0 overflow-hidden">
      <defs>
        {paths.map(([id, d]) => (
          <path key={id} id={id} d={d} />
        ))}
      </defs>
    </svg>
  )
}
