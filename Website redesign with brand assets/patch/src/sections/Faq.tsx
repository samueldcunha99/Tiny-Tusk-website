import { Doodle } from '@/components/Doodle'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { TextOnPath } from '@/components/TextOnPath'
import { CLINIC } from '@/content/site'
import { FAQS } from '@/content/faq'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * 10 Questions -- paper.
 *
 * Eight questions do not need a search field and four category filters on top
 * of them; the controls were bigger than the content they filtered, and the
 * "no exact match" branch existed only to serve them. The rows are now native
 * `<details>` -- open/close state, keyboard behaviour and find-in-page all come
 * free, and the section drops its `useState` entirely.
 *
 * The coral `+` rotating to `x` is CSS on `details[open]`; see the snippet in
 * `patch/src/index.css.append.css`.
 */
export function Faq({ asPage = false }: { asPage?: boolean | undefined }) {
  const meta = useSectionMeta('faq')
  const Heading = asPage ? 'h1' : 'h2'
  const ItemHeading = asPage ? 'h2' : 'h3'

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
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionNumber number={meta.number} label={meta.label} tone="coral" />
          <Heading id="faq-heading" className="mt-4 max-w-[18ch] font-display text-h1 text-cobalt">
            Ask us anything, in advance
          </Heading>
          <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
            If your question is not here, ring the clinic and ask. Nothing about a child's teeth is
            too small to check.
          </p>

          <div className="mt-10 flex items-end gap-6">
            <TextOnPath text={CLINIC.tagline} mode="arc" tone="coral" className="w-[min(17.5rem,60%)]" />
            <Doodle name="markArrow" tone="cobalt" drawOnScroll className="w-20" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="rounded-[1.625rem] bg-white p-6 shadow-[0_12px_34px_rgba(24,82,142,0.06)] md:p-7"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-5">
                <ItemHeading className="font-display text-[clamp(1.05rem,1.5vw,1.3rem)] leading-snug text-cobalt">
                  {item.question}
                </ItemHeading>
                <span
                  data-plus
                  aria-hidden="true"
                  className="shrink-0 font-sans text-2xl leading-none text-coral transition-transform duration-300 ease-transform"
                >
                  +
                </span>
              </summary>
              <p className="mt-3.5 max-w-measure font-sans text-body leading-relaxed text-cobalt">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
