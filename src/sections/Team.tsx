import { useEffect, useRef } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextOnPath } from '@/components/TextOnPath'
import { colourVar } from '@/components/BrandArtView'
import { DR_NUPUR } from '@/content/team'
import { CLINIC, sectionMeta } from '@/content/site'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'

export function Team({ asPage = false }: { asPage?: boolean | undefined }) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = sectionMeta('team')
  const Heading = asPage ? 'h1' : 'h2'

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-nupur-panel]', {
        y: 36,
        opacity: 0,
        duration: 0.72,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="dr-nupur"
      ref={rootRef}
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      aria-labelledby="nupur-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Dr. Nupur portrait">
          <BrandImage
            placeholder
            alt={DR_NUPUR.portrait.alt}
            width={800}
            height={1000}
            title={{ lead: 'Meet', rest: 'Dr. Nupur', fill: 'powder', href: '/dr-nupur' }}
            logoTone="cobalt"
            doodle="doodleHeart"
            doodleTone="canary"
            className="aspect-[4/5]"
          />
          {/* The portrait production note is deliberately NOT rendered: it is
              an internal brief for the photographer, see content/team.ts. */}
        </aside>

        <div className="space-y-8">
          <header data-nupur-panel data-animate>
            <SectionNumber number={meta.number} label="Dr. Nupur" tone="cobalt" />
            <Heading id="nupur-heading" className="mt-4 font-display text-h1 text-cobalt">
              <MixedWeightLabel lead="Meet" rest="Dr." display />{' '}
              <Circled tone="cobalt"><span style={{ fontWeight: 400 }}>Nupur</span></Circled>
            </Heading>
          </header>

          <section data-nupur-panel data-surface="cobalt" className="rounded-[2rem] bg-cobalt p-7 md:p-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white">Qualifications</p>
            <p className="mt-3 font-display text-h2 text-white">{DR_NUPUR.credentials}</p>
          </section>

          <section data-nupur-panel className="overflow-hidden rounded-[2rem] bg-powder p-7 md:p-10" data-surface="powder">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">A calm start</p>
            <blockquote className="mt-4 font-display text-h2 text-cobalt">{DR_NUPUR.philosophy.quote}</blockquote>
            <p className="mt-4 max-w-measure font-sans text-body text-cobalt">{DR_NUPUR.philosophy.body}</p>
            {/* The arc carries the brand tagline, not a second copy of the
                quote above it: that duplication was a bug. */}
            <TextOnPath text={CLINIC.tagline} tone="cobalt" className="mt-6 h-auto w-full max-w-md" />
          </section>

          <section data-nupur-panel aria-labelledby="nupur-expect-heading">
            <h2 id="nupur-expect-heading" className="font-display text-h2 text-cobalt">What to expect when you meet her</h2>
            <p className="mt-3 max-w-measure font-sans text-body text-cobalt">A gentle visit is often made from small, ordinary choices. Here is what those choices can look like.</p>
            <div className="mt-7 grid gap-5">
              {DR_NUPUR.expectations.map((beat) => (
                <article
                  key={beat.title}
                  className="grid gap-5 rounded-[1.75rem] p-6 sm:grid-cols-[92px_1fr] sm:items-center"
                  style={{ background: colourVar(beat.surface) }}
                  data-surface={beat.surface}
                >
                  <Doodle name={beat.glyph} tone={beat.element} drawOnScroll className="w-20" />
                  <div>
                    <h3 className="font-display text-h2" style={{ color: colourVar(beat.element) }}>{beat.title}</h3>
                    <p className="mt-2 max-w-measure font-sans text-base leading-relaxed" style={{ color: colourVar(beat.element) }}>{beat.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Renders only once the clinic supplies real words — never a
              placeholder standing in for them. */}
          {DR_NUPUR.hasFavouritePart ? (
            <section data-nupur-panel className="rounded-[2rem] border-2 border-powder bg-white p-7 md:p-10">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">A warm human detail</p>
              <p className="mt-4 max-w-measure font-display text-h2 text-cobalt">{DR_NUPUR.favouritePart}</p>
            </section>
          ) : null}

          <div data-nupur-panel>
            <StylisedCTA lead="Schedule" rest="Appointment" href="/book" fill="canary" />
          </div>
        </div>
      </div>
    </section>
  )
}
