import { useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { FAQS, type FaqCategory } from '@/content/faq'
import { sectionMeta } from '@/content/site'

export function Faq({ asPage = false }: { asPage?: boolean | undefined }) {
  const categories = ['All', 'Visits', 'At home', 'Support'] as const
  const [open, setOpen] = useState<string | null>(FAQS[0]?.question ?? null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | FaqCategory>('All')
  const meta = sectionMeta('faq')
  const Heading = asPage ? 'h1' : 'h2'
  const ItemHeading = asPage ? 'h2' : 'h3'
  const normalisedQuery = query.trim().toLocaleLowerCase()
  const filteredFaqs = FAQS.filter((item) => {
    const categoryMatches = category === 'All' || item.category === category
    const queryMatches = normalisedQuery.length === 0
      || item.question.toLocaleLowerCase().includes(normalisedQuery)
      || item.answer.toLocaleLowerCase().includes(normalisedQuery)

    return categoryMatches && queryMatches
  })

  return (
    <section
      id="faq"
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      aria-labelledby="faq-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
          <Heading id="faq-heading" className="mt-4 font-display text-h1 text-cobalt">
            Questions, answered kindly
          </Heading>
          <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
            If yours is not here, send an appointment request. A short
            conversation is often the quickest way to settle a worry.
          </p>

          <label className="mt-8 block font-sans font-semibold text-cobalt" htmlFor="faq-search">
            Search the questions
          </label>
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “first visit” or “toothpaste”"
            className="mt-3 min-h-14 w-full rounded-full border-2 border-powder bg-white px-6 font-sans text-base text-cobalt outline-none transition-colors placeholder:text-cobalt/60 focus:border-cobalt"
          />

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter frequently asked questions">
            {categories.map((option) => {
              const active = category === option

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(option)}
                  className={[
                    'min-h-11 rounded-full border-2 border-cobalt px-4 font-sans font-semibold transition-colors',
                    active ? 'bg-cobalt text-canary' : 'bg-white text-cobalt hover:bg-powder',
                  ].join(' ')}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <div className="mt-8 rounded-[2rem] bg-cobalt p-7 text-canary">
            <Doodle name="doodleHeart" tone="canary" className="w-16" />
            <p className="mt-5 font-display text-h2">Still unsure?</p>
            <p className="mt-3 max-w-sm font-sans text-base leading-relaxed">
              Send an appointment request and use the notes box to tell us what is on your mind.
            </p>
            <a
              href="/book"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-canary px-6 font-sans font-semibold text-cobalt"
            >
              Ask with your request
            </a>
          </div>
        </div>

        <div className="divide-y-2 divide-powder">
          {filteredFaqs.map((item, index) => {
            const active = open === item.question
            const panelId = `faq-panel-${index}`

            return (
              <article key={item.question}>
                <ItemHeading>
                  <button
                    type="button"
                    aria-expanded={active}
                    aria-controls={panelId}
                    onClick={() => setOpen(active ? null : item.question)}
                    className="flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left font-display text-h2 text-cobalt"
                  >
                    <span>{item.question}</span>
                    <Doodle
                      name="markArrow"
                      tone="cobalt"
                      className={[
                        'w-12 shrink-0 transition-transform duration-500 ease-transform',
                        active ? 'rotate-90' : '',
                      ].join(' ')}
                    />
                  </button>
                </ItemHeading>
                <div
                  id={panelId}
                  className={[
                    'grid transition-[grid-template-rows] duration-500 ease-transform',
                    active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  ].join(' ')}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-measure pb-6 font-sans text-body text-cobalt">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
          {filteredFaqs.length === 0 ? (
            <div className="rounded-[2rem] bg-powder p-8 text-cobalt">
              <Doodle name="doodleFace" tone="cobalt" className="w-16" />
              <p className="mt-5 font-display text-h2">No exact match yet</p>
              <p className="mt-3 font-sans text-body">
                Try another word, clear the filters, or add your question to an appointment request.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
