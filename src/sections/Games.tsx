import { Doodle } from '@/components/Doodle'
import { LoopField } from '@/components/LoopField'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { TextPanel } from '@/components/TextPanel'
import { GAMES_PAGE } from '@/content/games'
import { BrushTimer } from '@/sections/BrushTimer'
import { GamesArcade } from '@/sections/GamesArcade'

export function Games() {
  return (
    <>
      <section
        className="tt-section relative overflow-hidden bg-coral px-6 pb-2 pt-36 md:px-10 md:pb-4 md:pt-40"
        data-surface="coral"
        aria-labelledby="games-heading"
      >
        <LoopField
          surface="coral"
          contrast="low"
          depth={0.2}
          count={1}
          className="opacity-[0.33]"
        />
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <TextPanel
            surface="coral"
            className="max-w-3xl shadow-[0_16px_45px_rgba(24,82,142,0.18)]"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {GAMES_PAGE.eyebrow}
            </p>
            <h1
              id="games-heading"
              className="mt-4 font-display text-h1 text-canary"
            >
              <MixedWeightLabel
                lead={GAMES_PAGE.title.lead}
                rest={GAMES_PAGE.title.rest}
                display
              />
            </h1>
            <p className="mt-5 max-w-measure font-sans text-body text-white">
              {GAMES_PAGE.intro}
            </p>
          </TextPanel>
        </div>

        <div
          className="pointer-events-none absolute bottom-4 right-8 hidden w-24 opacity-80 lg:block"
          aria-hidden="true"
        >
          <Doodle name="doodleToothbrush" tone="canary" />
        </div>
      </section>

      <BrushTimer surface="coral" />
      <GamesArcade />
    </>
  )
}
