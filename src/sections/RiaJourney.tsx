import { useEffect, useRef } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { Doodle } from '@/components/Doodle'
import { LoopField } from '@/components/LoopField'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { RIA_JOURNEY } from '@/content/ria'
import { useSectionMeta } from '@/content/sectionOrder'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'

/**
 * 05 Ria's Journey -- canary.
 *
 * Two changes, both about reading the story rather than operating it:
 *  - The three moments were behind a tab strip with Previous/Next and a
 *    progress bar. It is a three-beat narrative; it should just be readable top
 *    to bottom. All three are now white cards in order, and the controls,
 *    `activeIndex` state and progressbar are gone.
 *  - Surface moves coral -> canary. Coral could not carry any of this copy, so
 *    the whole section lived inside cobalt `TextPanel`s -- a panel-in-panel
 *    stack. Canary carries cobalt text at 6.37:1, so the panels are unnecessary
 *    and coral stays what the guide uses it as: an accent.
 */
export function RiaJourney() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('ria')

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-ria-moment]', {
        y: 34,
        opacity: 0,
        duration: 0.72,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="ria"
      ref={rootRef}
      className="tt-section relative overflow-hidden bg-canary px-6 py-20 md:px-10 md:py-24"
      data-surface="canary"
      aria-labelledby="ria-heading"
    >
      <LoopField surface="canary" contrast="low" depth={0.2} count={2} className="opacity-50" />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />

        <div className="mt-4 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <h2 id="ria-heading" className="max-w-[20ch] font-display text-h1 text-cobalt">
              One child, one visit, start to finish
            </h2>
            <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
              For a child who feels unsure, the first visit can be about getting comfortable — and
              nothing more.
            </p>
            <BrandImage
              webp="/images/rias-journey-hero.webp"
              png="/images/rias-journey-hero.png"
              alt="Ria laughing in the dental chair with the team nearby."
              width={1600}
              height={1050}
              title={{ lead: "Ria's", rest: 'first visit', fill: 'powder', href: '/book' }}
              logoTone="cobalt"
              doodle="doodleFace"
              doodleTone="coral"
              eager
              className="mt-8 aspect-[4/3]"
            />
            <div className="mt-8">
              <StylisedCTA lead="Book" rest="a gentle first visit" href="/book" fill="powder" />
            </div>
          </div>

          <ol className="flex list-none flex-col gap-5">
            {RIA_JOURNEY.map((moment, index) => (
              <li
                key={moment.id}
                data-ria-moment
                data-surface="white"
                className="flex items-start gap-5 rounded-[2rem] bg-white p-7 md:p-8"
              >
                <Doodle
                  name={moment.glyph}
                  tone={index === 2 ? 'cobalt' : 'coral'}
                  drawOnScroll
                  className="w-14 shrink-0"
                />
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-cobalt-80">
                    {moment.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.3rem,2vw,1.7rem)] leading-snug text-cobalt">
                    {moment.title}
                  </h3>
                  <p className="mt-2.5 max-w-measure font-sans text-base leading-relaxed text-cobalt">
                    {moment.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
