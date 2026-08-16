import { BrandImage } from '@/components/BrandImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { ServiceIcon } from '@/components/ServiceIcon'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextPanel } from '@/components/TextPanel'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Specialty Page: Treatment Under Laughing Gas (Nitrous Oxide)
 *
 * Redesign notes (see patch/README.md):
 *  - The page is now a dossier, not a card grid. Two facing panels answer the
 *    two lists a parent actually arrives with: what it is, what it isn't.
 *  - One benefits grid removed; four equal cards became one canary panel and
 *    one cobalt panel, so the section has a hierarchy instead of a rhythm.
 *  - Mixed weight is doing the work in the headings (p20): the lead word is
 *    600, the rest 400. Coral stays graphic — the lasso, the bullets, the step
 *    numerals — and never carries text.
 *  - Copy is rewritten for tone. No clinical claim, timing or instruction is
 *    new: safety, awake-throughout, 3-5 minutes on 100% oxygen and the light
 *    meal guidance are all carried over verbatim in substance from the
 *    previous page and the client-approved FAQ answers.
 */

const IS = [
  { lead: 'A mild inhaled sedative', rest: ', breathed through a tiny nose mask your child picks out.' },
  { lead: 'Awake the whole time', rest: ', so they can hear you, talk, and answer Dr. Nupur.' },
  { lead: 'Reversible in minutes', rest: ', because pure oxygen clears it in three to five, with no groggy afternoon.' },
  { lead: 'Kind to sensitive mouths', rest: ', easing a strong gag reflex as much as it eases nerves.' },
] as const

const ISNT = [
  { lead: 'Not general anaesthesia.', rest: 'Nobody is put to sleep. There is no breathing tube and no theatre.' },
  { lead: 'Not an injection.', rest: 'It is breathed in, so there is nothing to see and nothing to brace for.' },
  { lead: 'Not a lost day.', rest: 'There is no grogginess afterwards, so school and play carry on as normal.' },
  { lead: 'Not compulsory.', rest: "If your child is happy without it, we simply don't use it." },
] as const

const STEPS = [
  {
    step: '01',
    title: 'Pick a nose',
    body: 'Your child chooses the mask and settles back, breathing normally.',
    dark: false,
  },
  {
    step: '02',
    title: 'Float, about two minutes in',
    body: 'Warm, light, a little giggly. The room stops being frightening.',
    dark: false,
  },
  {
    step: '03',
    title: 'The treatment happens',
    body: 'Dr. Nupur works while your child stays relaxed and responsive. You stay in the room throughout.',
    dark: false,
  },
  {
    step: '04',
    title: 'Clear, and out the door',
    body: "Three to five minutes of 100% oxygen and it's gone. Back to school, back to the park.",
    dark: true,
  },
] as const

const LAUGHING_GAS_FAQS = [
  {
    question: 'Is laughing gas safe for children?',
    answer:
      'Yes. Nitrous oxide (laughing gas) is one of the safest and most widely used mild sedatives in pediatric dentistry. It is non-allergenic, works quickly, and is completely reversible within minutes.',
  },
  {
    question: 'Will my child fall asleep?',
    answer:
      'No. Laughing gas is not general anaesthesia. Your child remains fully awake, able to hear, talk, and follow instructions. They simply feel calm, relaxed, and comfortable.',
  },
  {
    question: 'How quickly does it wear off?',
    answer:
      'Very quickly! Once treatment ends, we switch to 100% pure oxygen for 3 to 5 minutes. The gas is completely eliminated from the body, and your child can walk out and return to normal activities immediately.',
  },
  {
    question: 'Can my child eat before the visit?',
    answer:
      'We recommend a light meal or snack 2 to 3 hours before the appointment, and avoiding heavy or fried foods right before treatment to ensure maximum comfort.',
  },
] as const

export function LaughingGas() {
  const meta = useSectionMeta('services')

  return (
    <div className="relative bg-paper">
      <CoralPageAccent />

      {/* ------------------------------------------------------------------
          Hero — a contained split, not a full-bleed field. Copy holds the
          left column at its own measure; the photo is a tile beside it with
          the N2O icon note beneath, so the mark and the service icon both
          sit on a surface that can carry them.
          ------------------------------------------------------------------ */}
      <section className="tt-section relative bg-paper px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
        <div className="relative z-10 mx-auto grid max-w-[1400px] items-stretch gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <SectionNumber number={meta.number} label="Specialty Care" tone="coral" />

            <h1 className="mt-6 font-display text-[clamp(2.7rem,5.6vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-cobalt">
              No needles first.
              <br />
              Just <Circled tone="coral">a little air</Circled>
              <br />
              <span className="font-normal">and a giggle.</span>
            </h1>

            <p className="mt-6 max-w-[52ch] font-sans text-[clamp(1.05rem,1.25vw,1.3rem)] leading-relaxed text-cobalt">
              Nitrous oxide, or laughing gas, is a sweet smelling breath of calm. Your child stays
              awake, chatty and in control. It just takes the worry out of the room.
            </p>

            {/* Client-stated fact (2026-08-14): centralized delivery, both
                operatories. It is the reason this is not a "special case"
                appointment, so it belongs beside the opening claim. */}
            <p className="mt-4 max-w-[52ch] font-sans text-base leading-relaxed text-cobalt">
              It is piped in centrally to both of our fully equipped operatories, so it is ready in
              whichever room your child is seen in, and it is never wheeled in as an exception.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <StylisedCTA lead="Book" rest="a calm visit" href="/book" fill="canary" />
              <a
                href="#dossier"
                className="font-sans text-base text-cobalt underline decoration-1 underline-offset-8"
              >
                What it is, plainly
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <BrandImage
              placeholder
              alt="A child resting back in the dental chair wearing the small nose mask."
              width={900}
              height={700}
              showCTA={false}
              logoTone="cobalt"
              doodle="doodleFace"
              doodleTone="coral"
              className="min-h-[clamp(20rem,46vh,30rem)] flex-1 rounded-[2.5rem]"
            />

            <div
              className="flex items-center gap-4 rounded-[2rem] bg-cobalt p-6 md:p-7"
              data-surface="cobalt"
            >
              <ServiceIcon slug="laughing-gas" className="h-12 w-14 shrink-0 text-canary" />
              <p className="font-sans text-[0.98rem] leading-relaxed text-canary">
                <span className="font-semibold text-white">N₂O + O₂, always monitored.</span>{' '}
                Dr. Nupur adjusts the mix breath by breath and finishes on 100% oxygen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          The dossier — canary panel and cobalt panel, facing each other.
          ------------------------------------------------------------------ */}
      <section id="dossier" className="tt-section bg-white px-6 py-20 md:px-10 md:py-24">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[20ch] font-display text-h1 font-semibold text-cobalt">
              The straight answer,{' '}
              <span className="font-normal">both ways round</span>
            </h2>
            <p className="max-w-[34ch] font-sans text-base leading-relaxed text-cobalt">
              Most parents arrive with the same two lists in their head. Here they are, side by
              side.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2.5rem] bg-canary p-8 md:p-12" data-surface="canary">
              <div className="flex items-start justify-between gap-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-cobalt">
                  What it is
                </p>
                <Doodle name="doodleHeart" tone="coral" drawOnScroll className="w-14 shrink-0" />
              </div>
              <ul className="mt-6 flex flex-col gap-[1.125rem]">
                {IS.map((item) => (
                  <li key={item.lead} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-coral"
                    />
                    <p className="font-sans text-[1.02rem] leading-relaxed text-cobalt">
                      <span className="font-semibold">{item.lead}</span>
                      {item.rest}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2.5rem] bg-cobalt p-8 md:p-12" data-surface="cobalt">
              <div className="flex items-start justify-between gap-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-canary">
                  What it isn&rsquo;t
                </p>
                <Doodle name="markDashes" tone="canary" drawOnScroll className="w-10 shrink-0" />
              </div>
              <ul className="mt-6 flex flex-col gap-[1.125rem]">
                {ISNT.map((item) => (
                  <li key={item.lead} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-2.5 w-2.5 shrink-0 rounded-full bg-coral"
                    />
                    <p className="font-sans text-[1.02rem] leading-relaxed text-white/90">
                      <span className="font-semibold text-white">{item.lead}</span> {item.rest}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          The visit — four steps on powder, the last one cobalt so the
          sequence lands rather than trailing off.
          ------------------------------------------------------------------ */}
      <section className="tt-section bg-powder px-6 py-20 md:px-10 md:py-24" data-surface="powder">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[22ch] font-display text-h1 font-semibold text-cobalt">
              Twenty minutes, <span className="font-normal">start to finish</span>
            </h2>
            <Doodle name="markArrow" tone="cobalt" drawOnScroll className="w-24" />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className={[
                  'flex flex-col rounded-[2rem] p-7 md:p-8',
                  step.dark ? 'bg-cobalt' : 'bg-paper',
                ].join(' ')}
                {...(step.dark ? { 'data-surface': 'cobalt' } : {})}
              >
                <span className="font-display text-[2.6rem] font-semibold leading-none text-coral">
                  {step.step}
                </span>
                <h3
                  className={[
                    'mt-4 font-display text-lg font-semibold',
                    step.dark ? 'text-canary' : 'text-cobalt',
                  ].join(' ')}
                >
                  {step.title}
                </h3>
                <p
                  className={[
                    'mt-2.5 font-sans text-sm leading-relaxed',
                    step.dark ? 'text-white/90' : 'text-cobalt/85',
                  ].join(' ')}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The incoming patch carried a Dr. Nupur pull quote here. It was written
          copy, not a statement she gave, so it is removed under the repo's
          no-invented-attribution rule (CLAUDE.md §1). Restore the section only
          with a client-verified line: placeholder BrandImage on the left,
          doodleFace + blockquote + figcaption on the right. */}

      {/* FAQ — unchanged answers, quieter rows. */}
      <section className="tt-section bg-paper px-6 pb-20 md:px-10 md:pb-24">
        <div className="relative z-10 mx-auto max-w-[1000px]">
          <h2 className="mb-10 text-center font-display text-h2 font-semibold text-cobalt">
            Still on your mind
          </h2>

          <div className="flex flex-col gap-3">
            {LAUGHING_GAS_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.5rem] border border-powder/60 bg-white p-6"
              >
                <summary className="flex cursor-pointer select-none items-center justify-between gap-4">
                  <h3 className="font-display text-lg font-medium text-cobalt">{faq.question}</h3>
                  <span className="flex w-6 shrink-0 items-center justify-center transition-transform duration-300 group-open:rotate-90">
                    <Doodle name="markArrow" tone="coral" className="w-6" />
                  </span>
                </summary>
                <p className="mt-4 font-sans text-body leading-relaxed text-cobalt/85">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — coral field, cobalt plate, per the contrast rule. */}
      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-10 overflow-hidden rounded-[2.5rem] bg-coral p-8 md:p-14">
          <TextPanel surface="coral" className="max-w-[620px] flex-1">
            <h2 className="font-display text-h1 font-semibold text-canary">
              Not sure it&rsquo;s right <span className="font-normal">for your child?</span>
            </h2>
            <p className="mt-4 max-w-[46ch] font-sans text-body leading-relaxed text-white">
              Neither are most parents on the first call. Talk it through with Dr. Nupur. There is
              no commitment, and no gas unless it genuinely helps.
            </p>
            <div className="mt-8">
              <StylisedCTA lead="Book" rest="an appointment" href="/book" fill="canary" />
            </div>
          </TextPanel>

          <Doodle
            name="doodleFace"
            tone="canary"
            drawOnScroll
            className="w-[clamp(7.5rem,14vw,12.5rem)] shrink-0"
          />
        </div>
      </section>
    </div>
  )
}
