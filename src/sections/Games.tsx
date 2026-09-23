import { useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SmileEdge } from '@/components/SmileEdge'
import { GAMES_PAGE } from '@/content/games'
import { useReveal } from '@/lib/motion'
import { BrushTimer } from '@/sections/BrushTimer'
import { GamesArcade } from '@/sections/GamesArcade'

/**
 * Games for Kids. The intro is canary, so its words sit on a colour that can
 * carry them instead of in a cobalt box on coral; the coral belongs to the
 * brushing game that follows, as it does on the home page.
 */
export function Games() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <>
      <section
        ref={ref}
        data-surface="canary"
        aria-labelledby="games-heading"
        className="tt-section relative overflow-hidden bg-canary px-6 pb-20 pt-28 text-cobalt md:px-10 md:pb-28 md:pt-40"
      >
        <Doodle
          name="loopStroke"
          tone="white"
          drawOnScroll
          duration={1.8}
          className="pointer-events-none absolute -right-[38%] top-[10%] w-[100%] max-w-none md:-right-[8%] md:w-[36%]"
        />
        <div className="relative mx-auto max-w-[1200px]">
          <p className="font-sans text-[0.78rem] font-semibold uppercase tracking-[0.22em]">{GAMES_PAGE.eyebrow}</p>
          <h1 id="games-heading" data-reveal className="mt-5 font-display text-[clamp(3rem,13vw,6rem)] leading-[0.98] tracking-[-0.03em]">
            <MixedWeightLabel lead={GAMES_PAGE.title.lead} rest={GAMES_PAGE.title.rest} display />
          </h1>
          <p data-reveal="fast" className="mt-5 max-w-[44ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.2rem]">
            {GAMES_PAGE.intro}
          </p>
        </div>
      </section>

      <SmileEdge from="canary" />
      <BrushTimer />
      <SmileEdge from="coral" />
      <GamesArcade />
    </>
  )
}
