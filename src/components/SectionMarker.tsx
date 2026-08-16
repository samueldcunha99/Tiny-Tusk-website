import { colourVar } from './BrandArtView'

/**
 * The wayfinding row at the top of every mobile section: a short accent rule,
 * then the section label. Coral is the accent on light surfaces; on cobalt it
 * flips to canary, because coral on cobalt is 1.9:1.
 *
 * NO NUMERAL BY DEFAULT. It used to lead with the display-face section number.
 * On a phone that number is not wayfinding, it is a progress bar: "01" tells a
 * visitor there are at least nine more of these below. The registry numbering
 * is the brand book's contents page (p2) and it still runs on desktop, where
 * the whole page is visible at once. Pass `number` only where a section is
 * genuinely citing that contents page.
 *
 * `whitespace-nowrap` on the label is not cosmetic: at 390px "Book a Visit"
 * wrapped to two lines and pushed the heading down.
 *
 * The rule and numeral are decorative -- the heading beside them carries the
 * meaning -- so only the label is exposed to assistive tech.
 */
export function SectionMarker({
  number,
  label,
  on = 'light',
}: {
  number?: string | undefined
  label: string
  /** `dark` on cobalt surfaces. */
  on?: 'light' | 'dark' | undefined
}) {
  const accent = on === 'dark' ? 'canary' : 'coral'

  return (
    <p className="flex items-center gap-3.5">
      {number ? (
        <span
          aria-hidden="true"
          className="font-display text-[1.625rem] font-semibold leading-none"
          style={{ color: colourVar(accent) }}
        >
          {number}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className="h-0.5 w-11 shrink-0"
        style={{ background: colourVar(accent) }}
      />
      {/* Full-strength cobalt on light, not a tint. The label is 12.5px, so it
          needs 4.5:1, and cobalt on powder is only 4.92:1 to begin with -- at
          75% it drops to 3.17:1. Same finding as OpeningSoon's caption row.
          White on cobalt has the headroom, so the dark side keeps its 75%. */}
      <span
        className={[
          'whitespace-nowrap font-sans text-[0.78rem] font-semibold uppercase tracking-[0.22em]',
          on === 'dark' ? 'text-white/75' : 'text-cobalt',
        ].join(' ')}
      >
        {label}
      </span>
    </p>
  )
}
