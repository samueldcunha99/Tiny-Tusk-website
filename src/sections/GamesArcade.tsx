import { useRef, useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionMarker } from '@/components/SectionMarker'
import { SmileEdge } from '@/components/SmileEdge'
import {
  GAMES_ARCADE,
  MEMORY_CARDS,
  SEQUENCE_STEPS,
  STICKER_CHOICES,
} from '@/content/games'
import { useReveal } from '@/lib/motion'

const BOARD_SIZE = 6

/** A game's own small controls: words, underlined, rather than a pill. */
const CONTROL =
  'inline-flex min-h-11 items-center font-sans text-[1rem] font-semibold underline decoration-2 underline-offset-[6px]'

/**
 * The arcade, composed like the rest of the site (audit 54): each game on a
 * colour chapter of its own, joined by the tagline's smile -- powder, canary,
 * then cobalt running on into the cobalt footer -- instead of three rounded,
 * shadowed panels. The pieces are the site's colour discs: a hidden card is a
 * cobalt disc, a found one a canary disc with its drawing; a step is a drawing
 * on a disc that turns cobalt once it is in place; a sticker lands as a canary
 * disc in a dashed ring.
 */
export function GamesArcade() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)
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
      setSequenceMessage('Almost, try a different step.')
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
    <div ref={ref}>
      <section
        data-surface="powder"
        aria-labelledby="arcade-heading"
        className="tt-section relative overflow-hidden bg-powder px-6 pb-20 pt-20 text-cobalt md:px-10 md:pb-28 md:pt-28"
      >
        <div className="mx-auto max-w-[1320px]">
          <SectionMarker label={GAMES_ARCADE.eyebrow} />
          <h2
            id="arcade-heading"
            data-reveal
            className="mt-5 font-display text-[clamp(2.4rem,10vw,4.5rem)] leading-[1.02] tracking-[-0.025em]"
          >
            <MixedWeightLabel lead={GAMES_ARCADE.title.lead} rest={GAMES_ARCADE.title.rest} display />
          </h2>
          <p data-reveal="fast" className="mt-5 max-w-[40ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.15rem]">
            {GAMES_ARCADE.intro}
          </p>

          <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
            <div>
              <SectionMarker label="Game 01" />
              <h3 data-reveal className="mt-4 font-display text-[clamp(1.9rem,7.5vw,3rem)] font-semibold leading-[1.05]">
                Match the doodles
              </h3>
              <p aria-live="polite" className="mt-3 font-sans text-[1.05rem] leading-[1.6]">
                {memoryMessage}
              </p>
              <button type="button" onClick={resetMemory} className={`mt-2 ${CONTROL}`}>
                Reset
              </button>
            </div>

            <ul className="grid max-w-[30rem] list-none grid-cols-3 gap-4 sm:gap-6">
              {MEMORY_CARDS.map((card, index) => {
                const matched = matches.includes(card.pair)
                const visible = matched || revealed.includes(index)
                return (
                  <li key={`${card.pair}-${index}`}>
                    <button
                      type="button"
                      onClick={() => chooseMemoryCard(index)}
                      aria-label={visible ? card.label : `Hidden card ${index + 1}`}
                      className={[
                        'grid aspect-square w-full place-items-center rounded-full transition-transform duration-200 hover:-translate-y-1 active:scale-95',
                        matched ? 'bg-canary' : visible ? 'bg-white' : 'bg-cobalt',
                      ].join(' ')}
                    >
                      {visible ? (
                        <Doodle name={card.glyph} tone="cobalt" className="w-[52%]" />
                      ) : (
                        <span aria-hidden="true" className="font-display text-[clamp(2rem,9vw,3rem)] leading-none text-canary">
                          ?
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <SmileEdge from="powder" />

      <section
        data-surface="canary"
        aria-labelledby="order-heading"
        className="tt-section relative overflow-hidden bg-canary px-6 pb-20 pt-20 text-cobalt md:px-10 md:pb-28 md:pt-28"
      >
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
          <div>
            <SectionMarker label="Game 02" />
            <h3 id="order-heading" data-reveal className="mt-4 font-display text-[clamp(1.9rem,7.5vw,3rem)] font-semibold leading-[1.05]">
              Put it in order
            </h3>
            <p aria-live="polite" className="mt-3 font-sans text-[1.05rem] leading-[1.6]">
              {sequenceMessage}
            </p>
            <button type="button" onClick={resetSequence} className={`mt-2 ${CONTROL}`}>
              Start over
            </button>
          </div>

          <ul className="grid list-none gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">
            {SEQUENCE_STEPS.map((step) => {
              const complete = step.order <= sequenceStep
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    disabled={complete}
                    onClick={() => chooseSequenceStep(step.order)}
                    className="flex min-h-11 w-full items-center gap-4 text-left transition-transform duration-200 enabled:hover:-translate-y-0.5 enabled:active:scale-[0.98]"
                  >
                    <span
                      className={[
                        'grid h-20 w-20 shrink-0 place-items-center rounded-full transition-colors duration-300',
                        complete ? 'bg-cobalt' : 'bg-white',
                      ].join(' ')}
                    >
                      <Doodle name={step.glyph} tone={complete ? 'canary' : 'cobalt'} className="w-[52%]" />
                    </span>
                    <span className="font-display text-[1.35rem] leading-tight">
                      {complete ? (
                        <span className="mr-2 font-sans text-[0.8rem] font-semibold tracking-[0.14em]">
                          {String(step.order).padStart(2, '0')}
                        </span>
                      ) : null}
                      {step.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <SmileEdge from="canary" />

      {/* Cobalt runs on into the cobalt footer, so the bottom stays short. */}
      <section
        data-surface="cobalt"
        aria-labelledby="sticker-heading"
        className="tt-section relative overflow-hidden bg-cobalt px-6 pb-16 pt-20 text-white md:px-10 md:pb-24 md:pt-28"
      >
        <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-20">
          <div>
            <SectionMarker label="Game 03" on="dark" />
            <h3 id="sticker-heading" data-reveal className="mt-4 font-display text-[clamp(1.9rem,7.5vw,3rem)] font-semibold leading-[1.05] text-canary">
              Build a sticker board
            </h3>
            <p className="mt-3 max-w-[34ch] font-sans text-[1.05rem] leading-[1.6] text-white/90">
              Pick a sticker, then tap any circle to place it.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {STICKER_CHOICES.map((sticker) => {
                const chosen = selectedSticker === sticker.id
                return (
                  <button
                    key={sticker.id}
                    type="button"
                    aria-pressed={chosen}
                    onClick={() => setSelectedSticker(sticker.id)}
                    className={[
                      'grid h-16 w-16 place-items-center rounded-full transition-transform duration-200',
                      chosen ? 'scale-110 bg-canary' : 'bg-white hover:-translate-y-0.5',
                    ].join(' ')}
                  >
                    <Doodle name={sticker.glyph} tone="cobalt" className="w-9" title={sticker.label} />
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setBoard(Array.from({ length: BOARD_SIZE }, () => null))}
              className={`mt-5 text-canary ${CONTROL}`}
            >
              Clear board
            </button>
          </div>

          <ul className="grid max-w-[30rem] list-none grid-cols-3 gap-4 sm:gap-6">
            {board.map((stickerId, index) => {
              const sticker = STICKER_CHOICES.find((choice) => choice.id === stickerId)
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => placeSticker(index)}
                    aria-label={`Sticker space ${index + 1}`}
                    className={[
                      'grid aspect-square w-full place-items-center rounded-full',
                      sticker ? 'bg-canary' : 'border-2 border-dashed border-white/50',
                    ].join(' ')}
                  >
                    {sticker ? (
                      <Doodle name={sticker.glyph} tone="cobalt" className="w-[52%]" />
                    ) : (
                      <span aria-hidden="true" className="font-display text-2xl text-white/75">
                        +
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
