import { Doodle } from './Doodle'
import { colourVar } from './BrandArtView'
import { JOURNEY } from '@/content/journey'

/**
 * The logo story, set the way the identity guide sets it (p3).
 *
 * The guide gives this one page and one row: five glyphs at the same small
 * size, the four coral stages either side of the finished cobalt mark, each
 * stage named on a thin leader line -- Detection and Care above, Treatment and
 * Smile! below. No panels, no body copy, no scrolling. The mark in the middle
 * is the payoff rather than a fifth step, which is why it is unlabelled.
 *
 * This component is that page, at phone width. It replaced a full section of
 * swipeable cards because the client asked for the book's own treatment: "can
 * we try fitting it as it is in the pdf, same page, a small one".
 *
 * `JOURNEY` is already in the book's order (beat, beat, hinge, beat, beat), so
 * the row maps straight over it -- do not reorder that array.
 *
 * Three grid rows of five columns rather than five stacked columns: the shared
 * column track is what keeps every glyph on the same baseline whatever its
 * label measures. Labels alternate by beat index, which reproduces the book's
 * above / below / above / below rhythm.
 */
function Leader({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 26"
      className={['h-[1.125rem] w-5', flip ? 'rotate-180' : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 1 C 5 13, 15 13, 15 25"
        fill="none"
        stroke={colourVar('cobalt')}
        strokeOpacity={0.4}
        strokeWidth={1.25}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LogoStory({ className }: { className?: string | undefined }) {
  const beats = JOURNEY.filter((panel) => panel.kind === 'beat')
  const hinge = JOURNEY.find((panel) => panel.kind === 'hinge')
  // Above for Detection and Care, below for Treatment and Smile!, as on p3.
  const isAbove = (id: string) => beats.findIndex((b) => b.id === id) % 2 === 0

  const columns = JOURNEY.map((panel) => ({
    id: panel.id,
    glyph: panel.glyph,
    label: panel.kind === 'beat' ? panel.title : null,
    above: panel.kind === 'beat' ? isAbove(panel.id) : false,
  }))

  const row = 'grid grid-cols-5 items-end gap-x-1.5'

  return (
    <figure className={className}>
      {/* Row 1: the labels that sit above their glyph. */}
      <div className={row} aria-hidden="true">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col items-center">
            {column.label && column.above ? (
              <>
                <span className="font-sans text-[0.65rem] leading-tight text-cobalt">
                  {column.label}
                </span>
                <Leader />
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* Row 2: the five glyphs, all one size. */}
      <ul className={`${row} mt-1 list-none`}>
        {columns.map((column) => (
          <li key={column.id} className="flex justify-center">
            <Doodle
              name={column.glyph}
              tone={column.id === hinge?.id ? 'cobalt' : 'coral'}
              drawOnScroll
              className="w-full max-w-[3.25rem]"
            />
          </li>
        ))}
      </ul>

      {/* Row 3: the labels that sit below. */}
      <div className={`${row} mt-1 items-start`} aria-hidden="true">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col items-center">
            {column.label && !column.above ? (
              <>
                <Leader flip />
                <span className="font-sans text-[0.65rem] leading-tight text-cobalt">
                  {column.label}
                </span>
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* The stages are decorative above; this is the accessible version, and
          the one line of copy the guide's own page carries. */}
      <figcaption className="mt-4 text-center font-sans text-[0.8rem] leading-[1.5] text-cobalt">
        {hinge?.caption}
        <span className="sr-only">
          {' '}
          The mark is drawn in four stages: {beats.map((b) => b.title).join(', ')}.
        </span>
      </figcaption>
    </figure>
  )
}
