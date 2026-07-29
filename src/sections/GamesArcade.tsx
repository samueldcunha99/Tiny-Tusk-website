import { useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import {
  GAMES_ARCADE,
  MEMORY_CARDS,
  SEQUENCE_STEPS,
  STICKER_CHOICES,
} from '@/content/games'

const BOARD_SIZE = 6

export function GamesArcade() {
  const [revealed, setRevealed] = useState<number[]>([])
  const [matches, setMatches] = useState<string[]>([])
  const [memoryMessage, setMemoryMessage] = useState('Find the three matching pairs.')
  const [sequenceStep, setSequenceStep] = useState(0)
  const [sequenceMessage, setSequenceMessage] = useState(
    'Choose what comes first.',
  )
  const [selectedSticker, setSelectedSticker] =
    useState<(typeof STICKER_CHOICES)[number]['id']>(
      STICKER_CHOICES[0]!.id,
    )
  const [board, setBoard] = useState<Array<string | null>>(
    Array.from({ length: BOARD_SIZE }, () => null),
  )

  const chooseMemoryCard = (index: number) => {
    const card = MEMORY_CARDS[index]
    if (!card || matches.includes(card.pair) || revealed.includes(index)) return

    const nextRevealed = revealed.length >= 2 ? [index] : [...revealed, index]
    setRevealed(nextRevealed)

    if (nextRevealed.length < 2) {
      setMemoryMessage('Now find its match.')
      return
    }

    const first = MEMORY_CARDS[nextRevealed[0]!]
    const second = MEMORY_CARDS[nextRevealed[1]!]
    if (first?.pair === second?.pair) {
      const nextMatches = [...matches, card.pair]
      setMatches(nextMatches)
      setMemoryMessage(
        nextMatches.length === 3
          ? 'All three pairs found!'
          : 'A match! Keep going.',
      )
    } else {
      setMemoryMessage('Not a pair yet. Choose another card to try again.')
    }
  }

  const resetMemory = () => {
    setRevealed([])
    setMatches([])
    setMemoryMessage('Find the three matching pairs.')
  }

  const chooseSequenceStep = (order: number) => {
    if (order <= sequenceStep) return
    if (order !== sequenceStep + 1) {
      setSequenceMessage('Almost—try a different step.')
      return
    }

    const nextStep = sequenceStep + 1
    setSequenceStep(nextStep)
    setSequenceMessage(
      nextStep === SEQUENCE_STEPS.length
        ? 'Sequence complete!'
        : `Great. Now choose step ${nextStep + 1}.`,
    )
  }

  const resetSequence = () => {
    setSequenceStep(0)
    setSequenceMessage('Choose what comes first.')
  }

  const placeSticker = (index: number) => {
    setBoard((current) =>
      current.map((sticker, slot) =>
        slot === index ? selectedSticker : sticker,
      ),
    )
  }

  return (
    <section
      className="tt-section bg-powder px-6 py-14 md:px-10 md:py-20"
      data-surface="powder"
      aria-labelledby="arcade-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">
          {GAMES_ARCADE.eyebrow}
        </p>
        <h2 id="arcade-heading" className="mt-4 font-display text-h1 text-cobalt">
          <MixedWeightLabel
            lead={GAMES_ARCADE.title.lead}
            rest={GAMES_ARCADE.title.rest}
            display
          />
        </h2>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
          {GAMES_ARCADE.intro}
        </p>

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <article
            className="rounded-[2.5rem] bg-paper p-6 shadow-[0_12px_35px_rgba(24,82,142,0.10)] md:p-9"
            data-surface="paper"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">
                  Game 01
                </p>
                <h3 className="mt-2 font-display text-h2 text-cobalt">
                  Match the doodles
                </h3>
              </div>
              <button
                type="button"
                onClick={resetMemory}
                className="min-h-11 rounded-full border-2 border-powder px-4 font-sans text-sm font-semibold text-cobalt"
              >
                Reset
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {MEMORY_CARDS.map((card, index) => {
                const visible =
                  matches.includes(card.pair) || revealed.includes(index)
                return (
                  <button
                    key={`${card.pair}-${index}`}
                    type="button"
                    onClick={() => chooseMemoryCard(index)}
                    aria-label={visible ? card.label : `Hidden card ${index + 1}`}
                    className={[
                      'grid aspect-square place-items-center rounded-2xl border-2 transition-transform hover:-translate-y-1',
                      visible
                        ? 'border-cobalt bg-canary'
                        : 'border-powder bg-powder text-cobalt',
                    ].join(' ')}
                  >
                    {visible ? (
                      <Doodle name={card.glyph} tone="cobalt" className="w-16" />
                    ) : (
                      <span className="font-display text-4xl text-cobalt">?</span>
                    )}
                  </button>
                )
              })}
            </div>
            <p aria-live="polite" className="mt-5 font-sans text-sm text-cobalt">
              {memoryMessage}
            </p>
          </article>

          <article
            className="rounded-[2.5rem] bg-canary p-6 shadow-[0_12px_35px_rgba(24,82,142,0.10)] md:p-9"
            data-surface="canary"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">
                  Game 02
                </p>
                <h3 className="mt-2 font-display text-h2 text-cobalt">
                  Put it in order
                </h3>
              </div>
              <button
                type="button"
                onClick={resetSequence}
                className="min-h-11 rounded-full border-2 border-cobalt/30 px-4 font-sans text-sm font-semibold text-cobalt"
              >
                Start over
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SEQUENCE_STEPS.map((step) => {
                const complete = step.order <= sequenceStep
                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={complete}
                    onClick={() => chooseSequenceStep(step.order)}
                    className={[
                      'flex min-h-24 items-center gap-4 rounded-2xl border-2 p-4 text-left transition-transform hover:-translate-y-1',
                      complete
                        ? 'border-cobalt bg-cobalt text-white'
                        : 'border-cobalt/20 bg-paper text-cobalt',
                    ].join(' ')}
                  >
                    <Doodle
                      name={step.glyph}
                      tone={complete ? 'canary' : 'cobalt'}
                      className="w-12 shrink-0"
                    />
                    <span className="font-sans font-semibold">{step.label}</span>
                  </button>
                )
              })}
            </div>
            <p aria-live="polite" className="mt-5 font-sans text-sm text-cobalt">
              {sequenceMessage}
            </p>
          </article>

          <article
            className="rounded-[2.5rem] bg-cobalt p-6 text-white shadow-[0_12px_35px_rgba(24,82,142,0.16)] md:p-9 xl:col-span-2"
            data-surface="cobalt"
          >
            <div className="grid gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-canary">
                  Game 03
                </p>
                <h3 className="mt-2 font-display text-h2 text-canary">
                  Build a sticker board
                </h3>
                <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-white">
                  Pick a sticker, then tap any circle to place it.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {STICKER_CHOICES.map((sticker) => (
                    <button
                      key={sticker.id}
                      type="button"
                      aria-pressed={selectedSticker === sticker.id}
                      onClick={() => setSelectedSticker(sticker.id)}
                      className={[
                        'grid h-16 w-16 place-items-center rounded-full border-2',
                        selectedSticker === sticker.id
                          ? 'border-canary bg-canary'
                          : 'border-white/30 bg-white',
                      ].join(' ')}
                    >
                      <Doodle
                        name={sticker.glyph}
                        tone="cobalt"
                        className="w-9"
                        title={sticker.label}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setBoard(Array.from({ length: BOARD_SIZE }, () => null))
                  }
                  className="mt-6 min-h-11 rounded-full border-2 border-white/30 px-5 font-sans text-sm font-semibold text-white"
                >
                  Clear board
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-[2rem] bg-paper p-5 sm:p-8">
                {board.map((stickerId, index) => {
                  const sticker = STICKER_CHOICES.find(
                    (choice) => choice.id === stickerId,
                  )
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => placeSticker(index)}
                      aria-label={`Sticker space ${index + 1}`}
                      className="grid aspect-square place-items-center rounded-full border-2 border-dashed border-powder bg-white"
                    >
                      {sticker ? (
                        <Doodle
                          name={sticker.glyph}
                          tone="cobalt"
                          className="w-12 sm:w-16"
                        />
                      ) : (
                        <span className="font-display text-2xl text-cobalt-40">
                          +
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
