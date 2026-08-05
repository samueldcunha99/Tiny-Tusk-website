import { Doodle } from '@/components/Doodle'
import { LoopField } from '@/components/LoopField'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextOnPath } from '@/components/TextOnPath'
import { CLINIC, HERO } from '@/content/site'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * 00 Welcome -- powder.
 *
 * Redesign notes:
 *  - Asymmetric two-column: the display headline runs flush left and the
 *    tagline roundel sits in a narrow right rail, so the p34 welcome copy gets
 *    a full measure instead of competing with artwork for the same column.
 *  - High-contrast LoopField (canary on powder, pp28-29) behind everything.
 *  - The nav keeps its wrapping link row, so its height is not a constant. The
 *    hero measures it and sets its own top padding, which is what stops the
 *    wayfinding row disappearing under a wrapped nav on narrow desktops.
 */
export function HeroDesktop() {
  const meta = useSectionMeta('hero')

  return (
    <section
      id="hero"
      data-surface="powder"
      className="tt-section relative flex min-h-svh items-center overflow-hidden bg-powder px-6 pb-20 pt-[clamp(9rem,16vh,12.5rem)] md:px-10"
      aria-labelledby="hero-heading"
      ref={(node) => {
        if (!node) return
        const nav = document.getElementById('site-nav') ?? document.querySelector('header')
        if (!nav) return
        const sync = () => {
          const height = Math.ceil(nav.getBoundingClientRect().height)
          node.style.paddingTop = `${Math.max(144, height + 44)}px`
        }
        sync()
        // The nav row wraps, so watch its box rather than the window alone.
        const observer = new ResizeObserver(sync)
        observer.observe(nav)
      }}
    >
      <LoopField surface="powder" contrast="high" count={2} depth={0.3} />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
        <div className="min-w-0">
          <SectionNumber number={meta.number} label={meta.label} tone="coral" />

          <h1
            id="hero-heading"
            className="mt-7 font-display text-[clamp(3.6rem,11vw,10rem)] font-semibold leading-[1.0] tracking-[-0.03em] text-cobalt"
          >
            {HERO.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="mt-[0.5em] block font-sans text-[clamp(1.35rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.02em]">
              {HERO.headlineTail}
            </span>
          </h1>

          <p className="mt-8 max-w-[62ch] font-sans text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed text-cobalt">
            {HERO.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
            <StylisedCTA lead={HERO.cta.lead} rest={HERO.cta.rest} href={HERO.cta.href} fill="canary" />
            <a
              href="#journey"
              className="font-sans text-cobalt underline decoration-1 underline-offset-8"
            >
              See how a visit works
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <TextOnPath
            text={CLINIC.tagline}
            mode="roundel"
            tone="cobalt"
            className="w-[clamp(9.5rem,15vw,13rem)]"
          />
          <Doodle name="markDashes" tone="coral" drawOnScroll className="w-[clamp(3.25rem,5vw,4.875rem)]" />
        </div>
      </div>
    </section>
  )
}
