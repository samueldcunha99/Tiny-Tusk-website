import { useRef, useState } from 'react'
import { colourVar } from '@/components/BrandArtView'
import { Doodle } from '@/components/Doodle'
import { LogoStory } from '@/components/LogoStory'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { JOURNEY, type JourneyBeat } from '@/content/journey'
import { useSectionMeta } from '@/content/sectionOrder'
import {
  gsap,
  ScrollTrigger,
  primeDraw,
  useIsoLayoutEffect,
  usePrefersReducedMotion,
  useReveal,
} from '@/lib/motion'

const BEATS = JOURNEY.filter((panel): panel is JourneyBeat => panel.kind === 'beat')

interface Anchor {
  x: number
  y: number
}

/**
 * The thread's geometry, from where the glyphs actually landed: one unbroken
 * path through every glyph's centre, with a gentle S between each pair so it
 * reads as a hand-drawn line rather than a rule. It runs BEHIND the glyphs,
 * each sitting on a disc of the ground colour, so it appears to join them
 * rather than cross them -- and staying one subpath keeps the draw exact.
 */
function threadPath(anchors: Anchor[]): string {
  const [first] = anchors
  if (!first) return ''
  let { x } = first
  let y = first.y - 88
  let d = `M ${x} ${y}`
  for (const a of anchors) {
    const span = a.y - y
    d += ` C ${x + 24} ${y + span * 0.35} ${a.x - 24} ${y + span * 0.65} ${a.x} ${a.y}`
    x = a.x
    y = a.y
  }
  return d
}

/**
 * How a visit goes -- the cobalt plate. The home page's ground is powder, and
 * this chapter is set like the guide's cobalt "The Logo" chapter page (p4),
 * because it IS the logo's story: canary stages and a white mark, the p24 and
 * p26 pairings for cobalt.
 *
 * The p3 row sits under the heading exactly as the book prints it (the client
 * asked for it "as it is in the pdf, same page, a small one"). Below it the four
 * beats are told in full, joined by one canary thread that draws down the page
 * as you read, each glyph drawing itself as the thread arrives. That thread is
 * the site's through-line made literal: one continuous stroke.
 *
 * The row is also a storyboard: the stage you are reading lights up. On desktop
 * that is the row in the sticky left column. On a phone the row has scrolled
 * away by then, so a slim rail of the same five glyphs sticks under the nav
 * while the beats are on screen -- and tapping a stage jumps to it.
 */
export function Journey({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const threadRef = useRef<SVGPathElement>(null)
  const beatRefs = useRef<(HTMLLIElement | null)[]>([])
  const [thread, setThread] = useState('')
  const [active, setActive] = useState<string | undefined>(undefined)
  const [railVisible, setRailVisible] = useState(false)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('journey')
  const Heading = asPage ? 'h1' : 'h2'
  const BeatHeading = asPage ? 'h2' : 'h3'
  useReveal(ref)

  // Measure where the glyphs sit, and re-measure whenever the list reflows
  // (font load, rotation, a resize) so the thread always meets them. The
  // observer's own first report is the first measurement: it comes after the
  // browser has laid the page out, so reading positions then forces nothing.
  useIsoLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const box = list.getBoundingClientRect()
      const anchors = Array.from(list.querySelectorAll<HTMLElement>('[data-thread-anchor]')).map(
        (el) => {
          const r = el.getBoundingClientRect()
          return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }
        },
      )
      setThread(threadPath(anchors))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [])

  // The thread draws with the scroll -- its tip rides the same line the glyphs
  // trigger on, so each one draws as the stroke reaches it.
  useIsoLayoutEffect(() => {
    const path = threadRef.current
    const list = listRef.current
    if (!path || !list || !thread) return
    if (reduced) {
      primeDraw(path, true)
      return
    }
    const ctx = gsap.context(() => {
      primeDraw(path, false)
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 80%', end: 'bottom 70%', scrub: 0.6 },
      })
    })
    return () => ctx.revert()
  }, [thread, reduced])

  // Which beat is being read, and whether the phone rail should show. State,
  // not animation, so it runs under reduced motion too.
  useIsoLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const ctx = gsap.context(() => {
      beatRefs.current.forEach((li, i) => {
        const beat = BEATS[i]
        if (!li || !beat) return
        ScrollTrigger.create({
          trigger: li,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (self.isActive) setActive(beat.id)
          },
          ...(i === 0 ? { onLeaveBack: () => setActive(undefined) } : {}),
        })
      })
      ScrollTrigger.create({
        trigger: list,
        // Pixel offsets from the viewport top ("top top+140" is not GSAP
        // syntax -- it silently reads as "top top").
        start: 'top 140px',
        end: 'bottom 200px',
        onToggle: (self) => setRailVisible(self.isActive),
      })
    })
    return () => ctx.revert()
  }, [])

  const goToBeat = (index: number) => {
    beatRefs.current[index]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <section
      id="journey"
      ref={ref}
      data-surface="cobalt"
      aria-labelledby="journey-heading"
      className={[
        'tt-section relative bg-cobalt px-6 text-white md:px-10',
        asPage ? 'pb-24 pt-24 md:pb-32 md:pt-36' : 'pb-20 pt-20 md:pb-24 md:pt-28',
      ].join(' ')}
    >
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionMarker label={meta.label} on="dark" />
          <Heading
            id="journey-heading"
            data-reveal
            className="mt-5 max-w-[14ch] font-display text-[clamp(2.5rem,10.5vw,4.75rem)] font-semibold leading-[1.0] tracking-[-0.025em]"
          >
            How a visit actually goes
          </Heading>
          <p data-reveal="fast" className="mt-4 max-w-[34ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.15rem]">
            Four gentle beats, and the mark they draw between them.
          </p>
          <LogoStory on="dark" active={active} className="mt-10 max-w-[26rem]" />
        </div>

        <div className="relative">
          {/* The phone rail. Zero-height and sticky, so it takes no room in the
              flow and rides under the 44px nav bar for as long as the beats are
              on screen; it shows only once the full row above has gone. */}
          <div className="pointer-events-none sticky top-11 z-20 -mx-6 h-0 md:-mx-10 lg:hidden">
            <nav
              aria-label="Stages of a visit"
              {...(railVisible ? {} : ({ inert: '' } as Record<string, string>))}
              className={[
                'flex items-center justify-center gap-2 border-b border-white/15 bg-cobalt px-6 py-1 transition duration-300',
                railVisible ? 'pointer-events-auto translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
              ].join(' ')}
            >
              {JOURNEY.map((panel) => {
                if (panel.kind === 'hinge') {
                  return (
                    <span key={panel.id} aria-hidden="true" className="block w-8 px-0.5">
                      <Doodle name={panel.glyph} tone="white" />
                    </span>
                  )
                }
                const index = BEATS.findIndex((beat) => beat.id === panel.id)
                const isActive = active === panel.id
                return (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => goToBeat(index)}
                    aria-label={`Go to ${panel.number} ${panel.title}`}
                    aria-current={isActive ? 'step' : undefined}
                    className={[
                      'grid h-11 w-11 place-items-center transition duration-300',
                      isActive ? 'scale-110 opacity-100' : 'opacity-45',
                    ].join(' ')}
                  >
                    <Doodle name={panel.glyph} tone="canary" className="w-8" />
                  </button>
                )
              })}
            </nav>
          </div>

          <ol ref={listRef} className="relative flex list-none flex-col gap-14 md:gap-16 lg:pt-4">
            <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <path
                ref={threadRef}
                d={thread}
                fill="none"
                stroke={colourVar('canary')}
                strokeWidth={3}
                strokeLinecap="round"
                data-draw
              />
            </svg>

            {BEATS.map((beat, index) => (
              <li
                key={beat.id}
                ref={(el) => {
                  beatRefs.current[index] = el
                }}
                className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-x-8"
              >
                {/* The cobalt disc hides the thread where it passes behind. */}
                <span data-thread-anchor className="grid aspect-square place-items-center self-start rounded-full bg-cobalt p-1">
                  <Doodle name={beat.glyph} tone="canary" drawOnScroll tap duration={1.1} className="block w-full" />
                </span>
                <div>
                  <BeatHeading className="flex items-baseline gap-3 font-display text-[clamp(1.75rem,7vw,2.5rem)] font-semibold leading-none">
                    <span className="font-sans text-[0.8rem] font-semibold tracking-[0.14em] text-canary" aria-hidden="true">
                      {beat.number}
                    </span>
                    {beat.title}
                  </BeatHeading>
                  <p data-reveal="fast" className="mt-3 max-w-[46ch] font-sans text-[1rem] leading-[1.65] md:text-[1.1rem]">
                    {beat.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {asPage ? (
          <div className="-m-4 p-4 lg:col-start-2">
            <StylisedCTA lead="Book" rest="a first visit" href="/book/" fill="canary" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
