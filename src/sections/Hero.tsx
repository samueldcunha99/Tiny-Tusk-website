import { useEffect, useRef } from 'react'
import { LoopField } from '@/components/LoopField'
import { StylisedCTA } from '@/components/StylisedCTA'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { HERO, sectionMeta } from '@/content/site'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = sectionMeta('hero')

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line] > span')
      gsap.set(lines, { yPercent: 110 })
      gsap
        .timeline({ delay: 0.15 })
        .to(lines, {
          yPercent: 0,
          duration: 1.05,
          ease: EASE.entrance,
          stagger: STAGGER,
        })
        .from(
          '[data-hero-fade]',
          { y: 22, opacity: 0, duration: 0.8, ease: EASE.entrance, stagger: STAGGER },
          '-=0.55',
        )
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="hero"
      ref={ref}
      data-surface="powder"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-powder"
    >
      {/* p28: oversized canary loops on powder, parallaxing slowly. */}
      <LoopField surface="powder" contrast="high" depth={0.35} count={2} />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-28 md:px-10 md:pt-32">
        <div data-hero-fade>
          <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        </div>

        <h1 className="mt-5 font-display text-display text-cobalt" data-animate>
          {HERO.headline.map((line) => (
            <span key={line} data-hero-line className="block overflow-hidden">
              <span className="block">{line}</span>
            </span>
          ))}
          <span data-hero-line className="block overflow-hidden">
            <span className="block font-sans text-h1" style={{ fontWeight: 500 }}>
              {HERO.headlineTail}
            </span>
          </span>
        </h1>

        {/* Coral motion dashes accenting the headline (p31 marks). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] top-[28%] hidden w-24 md:block"
          data-hero-fade
        >
          <Doodle name="markDashes" tone="coral" drawOnScroll />
        </div>

        <p
          className="mt-6 max-w-measure font-sans text-body text-cobalt"
          data-hero-fade
          data-animate
        >
          {HERO.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6" data-hero-fade data-animate>
          <StylisedCTA lead={HERO.cta.lead} rest={HERO.cta.rest} href={HERO.cta.href} fill="canary" />
          <a
            href="#journey"
            className="font-sans text-[0.95rem] text-cobalt underline underline-offset-8 transition-opacity hover:opacity-70"
          >
            See how a visit works
          </a>
        </div>
      </div>
    </section>
  )
}
