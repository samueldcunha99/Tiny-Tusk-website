import { useRef } from 'react'
import { Circled } from '@/components/Circled'
import { colourVar } from '@/components/BrandArtView'
import { Doodle, type DoodleName } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { ServiceIcon } from '@/components/ServiceIcon'
import { SmileEdge } from '@/components/SmileEdge'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextOnPath } from '@/components/TextOnPath'
import { CLINIC_PHONE } from '@/content/site'
import { useReveal } from '@/lib/motion'
import { BookingClose } from './BookingClose'
import { QuestionRows } from './Faq'

/**
 * Specialty Page: Treatment Under Laughing Gas (Nitrous Oxide)
 *
 * Composed like the home page: colour chapters joined by the tagline's smile,
 * and no boxes.
 *
 *   powder -- the welcome, beside a badge: the treatment's own drawing on a
 *             cobalt disc, ringed with its names (p35's type on a path)
 *   cobalt -- what it is and what it isn't, side by side: clinical facts in
 *             the official register (p26), white on cobalt
 *   canary -- the visit in four steps, each drawing on a disc
 *   powder -- the parents' questions, ruled rows like the home page's
 *   cobalt -- the close, running on into the footer
 *
 * COPY: no clinical claim, timing or instruction here is new. Safety,
 * awake-throughout, 3-5 minutes on 100% oxygen and the light meal guidance are
 * carried over from the earlier page and the client-approved FAQ answers.
 *
 * An earlier patch carried a Dr. Nupur pull quote. It was written copy, not a
 * statement she gave, so it is gone under the no-invented-attribution rule
 * (CLAUDE.md §1). Restore it only with a client-verified line.
 */

const IS = [
  { lead: 'A mild inhaled sedative', rest: ', breathed through a tiny nose mask your child picks out.' },
  { lead: 'Awake the whole time', rest: ', so they can hear you, talk, and answer Dr. Nupur.' },
  { lead: 'Reversible in minutes', rest: ', because pure oxygen clears it in three to five, with no groggy afternoon.' },
  { lead: 'Kind to sensitive mouths', rest: ', easing a strong gag reflex as much as it eases nerves.' },
] as const

const ISNT = [
  { lead: 'Not general anaesthesia.', rest: ' Nobody is put to sleep. There is no breathing tube and no theatre.' },
  { lead: 'Not an injection.', rest: ' It is breathed in, so there is nothing to see and nothing to brace for.' },
  { lead: 'Not a lost day.', rest: ' There is no grogginess afterwards, so school and play carry on as normal.' },
  { lead: 'Not compulsory.', rest: " If your child is happy without it, we simply don't use it." },
] as const

/** The last step is coral, so the sequence lands rather than trailing off. */
const STEPS: readonly { title: string; body: string; glyph: DoodleName; disc: 'cobalt' | 'coral' }[] = [
  {
    title: 'Pick a nose',
    body: 'Your child chooses the mask and settles back, breathing normally.',
    glyph: 'doodleFace',
    disc: 'cobalt',
  },
  {
    title: 'Float, about two minutes in',
    body: 'Warm, light, a little giggly. The room stops being frightening.',
    glyph: 'doodleHeart',
    disc: 'cobalt',
  },
  {
    title: 'The treatment happens',
    body: 'Dr. Nupur works while your child stays relaxed and responsive. You stay in the room throughout.',
    glyph: 'journeyTreatment',
    disc: 'cobalt',
  },
  {
    title: 'Clear, and out the door',
    body: "Three to five minutes of 100% oxygen and it's gone. Back to school, back to the park.",
    glyph: 'journeySmile',
    disc: 'coral',
  },
]

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
  return (
    <>
      <Welcome />
      <SmileEdge from="powder" />
      <StraightAnswer />
      <SmileEdge from="cobalt" />
      <TheVisit />
      <SmileEdge from="canary" />
      <Questions />
      <SmileEdge from="powder" />
      <BookingClose
        heading={
          <>
            Not sure it&rsquo;s right <span className="text-canary">for your child?</span>
          </>
        }
        line="Neither are most parents on the first call. Talk it through with Dr. Nupur. There is no commitment, and no gas unless it genuinely helps."
      />
    </>
  )
}

/**
 * The welcome. On a phone the words come first and the badge follows; on
 * desktop the badge stands beside them, the way Dr. Nupur's portrait badge
 * stands beside her words.
 */
function Welcome() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section
      ref={ref}
      data-surface="powder"
      aria-labelledby="gas-heading"
      className="tt-section relative overflow-hidden bg-powder px-6 pb-20 pt-24 text-cobalt md:px-10 md:pb-28 md:pt-36"
    >
      <div className="relative mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
        <div>
          <SectionMarker label="Specialty care" />
          <h1
            id="gas-heading"
            data-reveal
            className="mt-5 font-display text-[clamp(2.6rem,11vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em] lg:text-[clamp(3.5rem,5.2vw,5rem)]"
          >
            No needles first.
            <br />
            Just <Circled tone="cobalt">a little air</Circled>
            <br />
            <span className="font-normal">and a giggle.</span>
          </h1>
          <p data-reveal="fast" className="mt-6 max-w-[46ch] font-sans text-[1.05rem] leading-[1.6] md:text-[1.2rem]">
            Nitrous oxide, or laughing gas, is a sweet smelling breath of calm. Your child stays
            awake, chatty and in control. It just takes the worry out of the room.
          </p>
          {/* Client-stated fact (2026-08-14): centralized delivery, both
              operatories. It is the reason this is not a "special case"
              appointment, so it belongs beside the opening claim. */}
          <p data-reveal="fast" className="mt-4 max-w-[46ch] font-sans text-[1rem] leading-[1.6] md:text-[1.05rem]">
            It is piped in centrally to both of our fully equipped operatories, so it is ready in
            whichever room your child is seen in, and it is never wheeled in as an exception.
          </p>
          <div className="-m-4 mt-4 flex flex-col items-start gap-1 p-4 sm:flex-row sm:items-center sm:gap-8">
            <StylisedCTA lead="Book" rest="a calm visit" href="/book/" fill="canary" />
            <a href="#dossier" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
              <span className="underline decoration-2 underline-offset-[6px]">What it is, plainly</span>
              <span className="block w-5 rotate-90" aria-hidden="true">
                <Doodle name="markArrow" tone="cobalt" />
              </span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="relative aspect-square w-[17rem] md:w-[20rem] lg:w-[23rem]" aria-hidden="true">
            <TextOnPath
              text="Laughing gas • Nitrous oxide • A little air"
              mode="ring"
              tone="cobalt"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-[13%] grid place-items-center rounded-full bg-cobalt" data-surface="cobalt">
              <ServiceIcon slug="laughing-gas" className="w-[58%] text-canary" />
            </div>
          </div>
          <p className="mt-6 max-w-[32ch] font-sans text-[1rem] leading-[1.6]">
            <span className="font-semibold">N₂O + O₂, always monitored.</span> Dr. Nupur adjusts the
            mix breath by breath and finishes on 100% oxygen.
          </p>
        </div>
      </div>
    </section>
  )
}

/** What it is, what it isn't -- white on cobalt, canary leads and hearts. */
function StraightAnswer() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section
      id="dossier"
      ref={ref}
      data-surface="cobalt"
      aria-labelledby="dossier-heading"
      className="tt-section relative overflow-hidden bg-cobalt px-6 pb-20 pt-20 text-white md:px-10 md:pb-28 md:pt-28"
    >
      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <h2
            id="dossier-heading"
            data-reveal
            className="max-w-[14ch] text-balance font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
          >
            The <Circled tone="canary">straight</Circled> answer, <span className="font-normal">both ways round</span>
          </h2>
          <p data-reveal="fast" className="max-w-[34ch] font-sans text-[1.05rem] leading-[1.6] text-white/90 md:text-[1.15rem] lg:pb-2">
            Most parents arrive with the same two lists in their head. Here they are, side by side.
          </p>
        </div>

        <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-2 lg:gap-20">
          <AnswerList label="What it is" items={IS} />
          <AnswerList label="What it isn’t" items={ISNT} />
        </div>
      </div>
    </section>
  )
}

function AnswerList({ label, items }: { label: string; items: readonly { lead: string; rest: string }[] }) {
  return (
    <div>
      <SectionMarker label={label} on="dark" />
      <ul className="mt-6 flex list-none flex-col gap-6">
        {items.map((item) => (
          <li key={item.lead} className="flex items-start gap-4">
            <span className="mt-0.5 block w-7 shrink-0" aria-hidden="true">
              <Doodle name="doodleHeart" tone="canary" drawOnScroll />
            </span>
            <p className="font-sans text-[1.05rem] leading-[1.6] md:text-[1.1rem]">
              <span className="font-semibold text-canary">{item.lead}</span>
              {item.rest}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The visit, in four steps on the canary plate: a list down the page on a
 * phone, four across on desktop. Each drawing sits on a disc, canary on cobalt
 * and the last on coral, the p24 partners.
 */
function TheVisit() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section
      ref={ref}
      data-surface="canary"
      aria-labelledby="gas-visit-heading"
      className="tt-section relative overflow-hidden bg-canary px-6 pb-20 pt-20 text-cobalt md:px-10 md:pb-28 md:pt-28"
    >
      <div className="relative mx-auto max-w-[1320px]">
        <div className="flex items-end gap-6">
          <h2
            id="gas-visit-heading"
            data-reveal
            className="max-w-[12ch] font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em] md:max-w-none"
          >
            Twenty minutes, <span className="font-normal">start to finish</span>
          </h2>
          <span className="mb-4 hidden w-20 shrink-0 md:block" aria-hidden="true">
            <Doodle name="markArrow" tone="cobalt" drawOnScroll />
          </span>
        </div>

        <ol className="mt-12 grid list-none gap-10 md:mt-16 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-x-5 lg:flex lg:flex-col lg:gap-6">
              <span
                className="grid aspect-square w-[4.5rem] place-items-center rounded-full lg:w-24"
                style={{ background: colourVar(step.disc) }}
              >
                <Doodle name={step.glyph} tone="canary" drawOnScroll tap duration={1.1} className="w-[56%]" />
              </span>
              <div>
                <h3 className="flex items-baseline gap-3 font-display text-[clamp(1.45rem,5.8vw,1.7rem)] font-semibold leading-[1.1]">
                  <span className="font-sans text-[0.8rem] font-semibold tracking-[0.14em]" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {step.title}
                </h3>
                <p data-reveal="fast" className="mt-2 max-w-[40ch] font-sans text-[1rem] leading-[1.6] md:text-[1.05rem]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * The parents' questions, set exactly like the home page's (Faq.tsx): ruled
 * rows that open without JavaScript. The laughing face stands beside the
 * heading, as the stamp does beside Parent Voices' -- set behind it, its
 * features ran through the words.
 */
function Questions() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section
      ref={ref}
      data-surface="powder"
      aria-labelledby="gas-questions-heading"
      className="tt-section relative overflow-hidden bg-powder px-6 pb-20 pt-20 text-cobalt md:px-10 md:pb-28 md:pt-28"
    >
      <div className="relative mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2
              id="gas-questions-heading"
              data-reveal
              className="max-w-[9ch] font-display text-[clamp(2.4rem,10vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.025em]"
            >
              Still on your mind
            </h2>
            <span className="mt-1 block w-24 shrink-0 rotate-[12deg] md:w-28 lg:w-24" aria-hidden="true">
              <Doodle name="doodleFace" tone="canary" drawOnScroll tap duration={1.4} />
            </span>
          </div>
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
          <QuestionRows items={LAUGHING_GAS_FAQS} ItemHeading="h3" />
        </div>
      </div>
    </section>
  )
}
