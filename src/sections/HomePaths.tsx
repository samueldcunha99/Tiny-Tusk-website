import { useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { LoopField } from '@/components/LoopField'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { StylisedCTA } from '@/components/StylisedCTA'
import { HOME_PATHS } from '@/content/homePaths'
import { sectionMeta } from '@/content/site'

export function HomePaths() {
  const [selectedId, setSelectedId] =
    useState<(typeof HOME_PATHS)[number]['id']>('visit')
  const meta = sectionMeta('paths')
  const selected =
    HOME_PATHS.find((path) => path.id === selectedId) ?? HOME_PATHS[0]!

  return (
    <section
      id="start-here"
      className="tt-section relative overflow-hidden bg-powder px-6 py-20 md:px-10 md:py-24"
      data-surface="powder"
      aria-labelledby="start-here-heading"
    >
      <LoopField
        surface="powder"
        contrast="low"
        depth={0.16}
        count={1}
        className="opacity-60"
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
            <h2
              id="start-here-heading"
              className="mt-4 max-w-xl font-display text-h1 text-cobalt"
            >
              <MixedWeightLabel
                lead="Choose"
                rest="your starting point"
                display
              />
            </h2>
            <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
              Begin with the part that would be most useful today. Everything
              else will still be here when you need it.
            </p>
          </div>

          <article
            key={selected.id}
            className="relative min-h-[320px] overflow-hidden rounded-[2.5rem] bg-canary p-8 shadow-[0_16px_45px_rgba(24,82,142,0.12)] md:p-12"
            data-surface="canary"
            aria-live="polite"
          >
            <div className="relative z-10 max-w-2xl">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">
                {selected.tab}
              </p>
              <h3 className="mt-4 max-w-xl font-display text-h1 text-cobalt">
                {selected.title}
              </h3>
              <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
                {selected.body}
              </p>
              <div className="mt-8">
                <StylisedCTA
                  lead={selected.cta.lead}
                  rest={selected.cta.rest}
                  href={selected.href}
                  fill="powder"
                />
              </div>
            </div>

            <Doodle
              name={selected.glyph}
              tone="cobalt"
              className="pointer-events-none absolute -bottom-8 -right-8 w-44 opacity-20 md:w-64"
            />
          </article>
        </div>

        <div
          className="mt-8 grid gap-4 md:grid-cols-3"
          aria-label="Choose a place to begin"
        >
          {HOME_PATHS.map((path, index) => {
            const active = selected.id === path.id
            return (
              <button
                key={path.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(path.id)}
                className={[
                  'group min-h-28 rounded-[1.75rem] border-2 p-5 text-left transition-transform hover:-translate-y-1',
                  active
                    ? 'border-cobalt bg-cobalt text-white'
                    : 'border-powder bg-white text-cobalt',
                ].join(' ')}
              >
                <span className="block font-sans text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
                  0{index + 1}
                </span>
                <span className="mt-3 block font-display text-h2">
                  {path.tab}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
