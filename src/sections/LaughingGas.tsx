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
 * Designed as a dedicated marketing and parent-guidance page for Tiny Tusk's
 * signature pediatric comfort specialty.
 *
 * Pairings & Design Rules:
 *  - Official & Playful brand registers
 *  - Coral stays graphic/accent; copy on coral uses cobalt via TextPanel.
 *  - Mixed-weight titles and continuous continuous section flow.
 */

const BENEFITS = [
  {
    title: { lead: 'Calms', rest: 'nervous feelings' },
    body: 'Eases anxiety gently so children who feel worried or fearful can rest comfortably in the chair.',
    glyph: 'doodleHeart',
    surface: 'paper',
    element: 'coral',
  },
  {
    title: { lead: 'Relieves', rest: 'gag reflexes' },
    body: 'Helps children with sensitive gag reflexes or dental sensitivity relax without discomfort.',
    glyph: 'doodleToothbrush',
    surface: 'canary',
    element: 'cobalt',
  },
  {
    title: { lead: 'Fully', rest: 'awake & aware' },
    body: 'Your child stays completely awake, responsive, and able to talk with Dr. Nupur throughout the visit.',
    glyph: 'doodleFace',
    surface: 'paper',
    element: 'cobalt',
  },
  {
    title: { lead: 'Quick', rest: '5-minute recovery' },
    body: 'Wears off completely within minutes of breathing pure oxygen, leaving no groggy after-effects.',
    glyph: 'doodleToothpaste',
    surface: 'powder',
    element: 'cobalt',
  },
] as const

const STEPS = [
  {
    step: '01',
    title: 'Settling in comfortably',
    body: 'Your child picks out a tiny nose mask and rests back while breathing normally.',
  },
  {
    step: '02',
    title: 'Warm & giggly relaxation',
    body: 'Within a couple of minutes, a peaceful, floaty, or happy feeling sets in.',
  },
  {
    step: '03',
    title: 'Gentle dental treatment',
    body: 'Dr. Nupur completes the treatment smoothly while your child stays relaxed and responsive.',
  },
  {
    step: '04',
    title: 'Fresh & clear recovery',
    body: '100% oxygen clears the gas in 3 to 5 minutes so your child leaves feeling bright and normal.',
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

      {/* Hero Section */}
      <section className="tt-section relative bg-paper px-6 pb-16 pt-24 md:px-10 md:pb-24 md:pt-32">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <SectionNumber number={meta.number} label="Specialty Care" tone="coral" />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-canary px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cobalt mb-6">
                <ServiceIcon slug="laughing-gas" className="h-5 w-6 text-cobalt" />
                Tiny Tusk Specialty
              </div>

              <h1 className="font-display text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.05] tracking-[-0.03em] text-cobalt">
                Calm, gentle care under <Circled tone="coral">laughing gas</Circled>
              </h1>

              <p className="mt-6 max-w-[54ch] font-sans text-[clamp(1.05rem,1.25vw,1.3rem)] leading-relaxed text-cobalt">
                A safe, sweet-smelling, and comfortable way to help nervous or sensitive children
                feel completely relaxed and at ease during their dental visit.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <StylisedCTA lead="Book" rest="a calm visit" href="/book" fill="canary" />
                <a
                  href="#how-it-works"
                  className="font-sans text-base text-cobalt underline underline-offset-8 decoration-1"
                >
                  How nitrous oxide works
                </a>
              </div>
            </div>

            {/* Feature Tile */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-cobalt p-8 md:p-12 text-white shadow-xl">
              <div className="pointer-events-none absolute right-4 top-4 w-20 opacity-30">
                <ServiceIcon slug="laughing-gas" mono className="w-full text-canary" />
              </div>
              <Doodle name="doodleHeart" tone="canary" className="w-14" />
              <h2 className="mt-6 font-display text-[clamp(1.75rem,2.5vw,2.25rem)] leading-snug text-canary">
                Designed for gentle, worry-free visits
              </h2>
              <p className="mt-4 font-sans text-base leading-relaxed text-white/90">
                For a child who feels anxious about dental tools, sensitive gag reflexes, or longer
                treatments, laughing gas offers a soothing, giggle-filled experience where fear simply fades away.
              </p>
              <div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-6">
                <Doodle name="markDashes" tone="coral" className="w-10" />
                <span className="font-sans text-sm font-medium text-canary">
                  Recommended for nervous & first-time pediatric patients
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="how-it-works" className="tt-section bg-powder px-6 py-20 md:px-10 md:py-24" data-surface="powder">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <div className="text-center max-w-[32ch] mx-auto">
            <h2 className="font-display text-h1 text-cobalt">
              Why parents & kids <Circled tone="coral">love</Circled> it
            </h2>
            <p className="mt-4 font-sans text-body text-cobalt">
              Mild inhalation sedation (Nitrous Oxide) creates a gentle, stress-free environment.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((item) => (
              <div
                key={item.title.lead}
                className="flex flex-col justify-between rounded-[2rem] p-7 md:p-8 shadow-sm"
                style={{ backgroundColor: `var(--tt-colour-${item.surface})` }}
              >
                <div>
                  <Doodle name={item.glyph} tone={item.element} className="w-12 mb-6" />
                  <h3 className="font-display text-xl text-cobalt">
                    {item.title.lead} <span className="font-normal">{item.title.rest}</span>
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-cobalt/85">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Experience */}
      <section className="tt-section bg-paper px-6 py-20 md:px-10 md:py-24">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <h2 className="font-display text-h1 text-cobalt max-w-[24ch]">
            What to expect during the visit
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.step}
                className="rounded-[2rem] border-2 border-powder p-7 bg-white flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-3xl text-coral font-bold">{step.step}</span>
                  <h3 className="mt-4 font-display text-lg text-cobalt font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 font-sans text-sm leading-relaxed text-cobalt/80">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="tt-section bg-paper px-6 pb-20 md:px-10 md:pb-24">
        <div className="relative z-10 mx-auto max-w-[1000px]">
          <h2 className="font-display text-h2 text-cobalt mb-8 text-center">
            Common questions about laughing gas
          </h2>

          <div className="flex flex-col gap-3">
            {LAUGHING_GAS_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.5rem] bg-white p-6 shadow-sm border border-powder/50"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none">
                  <h3 className="font-display text-lg text-cobalt font-medium">{faq.question}</h3>
                  <div className="w-8 h-8 shrink-0 text-coral transition-transform duration-300 group-open:rotate-90 flex items-center justify-center">
                    <Doodle name="markArrow" tone="coral" className="w-6 h-6" />
                  </div>
                </summary>
                <p className="mt-4 font-sans text-body text-cobalt/85 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-coral p-8 md:p-14 text-white">
          <TextPanel surface="coral" className="max-w-[600px]">
            <h2 className="font-display text-h1 text-canary">
              Ready for a gentle visit?
            </h2>
            <p className="mt-4 font-sans text-body text-white">
              Speak with Dr. Nupur to see if treatment under laughing gas is right for your child.
            </p>
            <div className="mt-8">
              <StylisedCTA lead="Book" rest="an appointment" href="/book" fill="canary" />
            </div>
          </TextPanel>
        </div>
      </section>
    </div>
  )
}
