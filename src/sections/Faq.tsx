import { useRef } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { FAQS } from '@/content/faq'
import { CLINIC_PHONE } from '@/content/site'
import { useSectionMeta } from '@/content/sectionOrder'
import { useReveal } from '@/lib/motion'

/**
 * Questions -- powder, straight on from parent voices, before the coral game.
 *
 * Native `<details>` rows, so they open without JavaScript and announce their
 * state for free. The p31 arrow points at its answer: right while closed, down
 * when open (index.css). Hairlines only -- no cards.
 */
export function Faq({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('faq')
  const Heading = asPage ? 'h1' : 'h2'
  const ItemHeading = asPage ? 'h2' : 'h3'
  useReveal(ref)

  return (
    <section
      id="faq"
      ref={ref}
      data-surface="powder"
      aria-labelledby="faq-heading"
      className={[
        'tt-section relative overflow-hidden bg-powder px-6 text-cobalt md:px-10',
        asPage ? 'pb-24 pt-24 md:pb-32 md:pt-36' : 'pb-16 pt-10 md:pb-20 md:pt-12',
      ].join(' ')}
    >
      {/* p32 exactly: a canary toothpaste scaled up into a field on powder,
          set behind the headline the way the guide sets it. */}
      <Doodle
        name="doodleToothpaste"
        tone="canary"
        drawOnScroll
        duration={1.4}
        className="pointer-events-none absolute -right-8 top-10 w-40 rotate-[18deg] md:right-[6%] md:w-52 lg:left-[24%] lg:right-auto lg:top-4 lg:w-40"
      />

      <div className="relative mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <SectionMarker label={meta.label} />
          <Heading
            id="faq-heading"
            data-reveal
            className="mt-5 max-w-[12ch] font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          >
            Ask us anything, in advance
          </Heading>
          <p data-reveal="fast" className="mt-4 max-w-[38ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.15rem]">
            If your question is not here, call the clinic and ask. Nothing about a child&rsquo;s
            teeth or comfort is too small to check.
          </p>
          <a
            href={CLINIC_PHONE.href}
            className="mt-5 inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold"
          >
            <span className="underline decoration-2 underline-offset-[6px]">Call {CLINIC_PHONE.display}</span>
          </a>
        </div>

        <div className="border-t-2 border-cobalt/20">
          <QuestionRows items={FAQS} ItemHeading={ItemHeading} />

          {asPage ? (
            <div className="-m-4 mt-10 p-4">
              <StylisedCTA lead="Book" rest="a visit" href="/book" fill="powder" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/** The ruled rows themselves, shared with the laughing gas page's questions. */
export function QuestionRows({
  items,
  ItemHeading,
}: {
  items: readonly { question: string; answer: string }[]
  ItemHeading: 'h2' | 'h3'
}) {
  return (
    <>
      {items.map((item) => (
        <details key={item.question} className="border-b-2 border-cobalt/20">
          <summary className="flex min-h-[4.5rem] items-center justify-between gap-6 py-4">
            <ItemHeading className="font-display text-[clamp(1.3rem,5.4vw,1.7rem)] leading-[1.15]">
              {item.question}
            </ItemHeading>
            <span data-faq-arrow aria-hidden="true" className="block w-6 shrink-0 transition-transform duration-300 ease-transform">
              <Doodle name="markArrow" tone="cobalt" />
            </span>
          </summary>
          <p className="max-w-[56ch] pb-6 font-sans text-[1.02rem] leading-[1.65] md:text-[1.1rem]">
            {item.answer}
          </p>
        </details>
      ))}
    </>
  )
}
