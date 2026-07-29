import { useEffect, useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { BrandImage } from '@/components/BrandImage'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { RIA_JOURNEY } from '@/content/ria'
import { SECTIONS } from '@/content/site'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'

export function RiaJourney() {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = SECTIONS[3]

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-ria-moment]', { y: 34, opacity: 0, duration: 0.72, ease: EASE.entrance, stagger: STAGGER, scrollTrigger: { trigger: root, start: 'top 70%', once: true } })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="ria" ref={rootRef} className="tt-section bg-powder px-6 py-24 md:px-10 md:py-32" data-surface="powder" aria-labelledby="ria-heading">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
          <h2 id="ria-heading" className="mt-4 font-display text-h1 text-cobalt"><MixedWeightLabel lead="Ria's" rest="Journey" display /></h2>
          <p className="mt-5 max-w-measure font-sans text-body text-cobalt">For a child who feels unsure, the first visit can be about getting comfortable — and nothing more.</p>
          <BrandImage
            webp="/images/rias-journey-hero.webp"
            png="/images/rias-journey-hero.png"
            alt="Ria laughing in the dental chair with the team nearby."
            width={1600}
            height={1050}
            title={{ lead: "Ria's", rest: 'first visit', fill: 'coral', href: '/book' }}
            logoTone="cobalt"
            doodle="doodleFace"
            doodleTone="canary"
            eager
            className="mt-8 aspect-[16/10]"
          />
          <div className="mt-8"><StylisedCTA lead="Book" rest="a gentle first visit" href="/book" fill="coral" /></div>
          <div className="mt-12 hidden h-3 overflow-hidden rounded-full bg-white lg:block" aria-label="Ria's visit becomes more comfortable as the story continues"><div className="h-full w-full origin-left bg-canary" /></div>
        </div>
        <ol className="space-y-6">
          {RIA_JOURNEY.map((moment, index) => (
            <li key={moment.id} data-ria-moment className="grid gap-6 rounded-[2rem] bg-paper p-7 shadow-[0_12px_35px_rgba(24,82,142,0.08)] sm:grid-cols-[112px_1fr] sm:items-center md:p-10" data-animate>
              <div className="w-24 sm:w-28"><Doodle name={moment.glyph} tone="cobalt" drawOnScroll /></div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">0{index + 1} · {moment.eyebrow}</p>
                <h3 className="mt-3 font-display text-h2 text-cobalt">{moment.title}</h3>
                <p className="mt-3 max-w-measure font-sans text-body text-cobalt">{moment.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
