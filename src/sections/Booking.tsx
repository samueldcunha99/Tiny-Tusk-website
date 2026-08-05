import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Circled } from '@/components/Circled'
import { Doodle, type DoodleName } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { SectionNumber } from '@/components/SectionNumber'
import { ServiceIcon } from '@/components/ServiceIcon'
import { Turnstile } from '@/components/Turnstile'
import {
  BOOKING_STEPS,
  CONCERNS,
  EMPTY_BOOKING,
  TIMES,
  type BookingValues,
} from '@/content/booking'
import { useSectionMeta } from '@/content/sectionOrder'
import {
  isBookingApiConfigured,
  submitBooking,
} from '@/lib/bookingApi'
import { gsap, EASE, primeDraw, usePrefersReducedMotion } from '@/lib/motion'

type Errors = Partial<Record<keyof BookingValues, string>>
type SubmitState = 'idle' | 'submitting' | 'error'

const STEP_FIELDS: readonly (readonly (keyof BookingValues)[])[] = [
  ['childName', 'childAge'],
  ['concern'],
  ['preferredTime'],
  ['parentName', 'phone', 'email'],
]
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''

/**
 * Per-step dressing: a doodle, and the legend split so exactly ONE word takes
 * the guide's lasso (p32). Never lasso the whole legend -- `Circled` sets
 * `nowrap`, and a wrapped multi-word title clips (audit #8).
 */
const STEP_ART: readonly { glyph: DoodleName; lead: string; circled: string; rest: string }[] = [
  { glyph: 'doodleFace', lead: 'Tell us about your', circled: 'child', rest: '' },
  { glyph: 'journeyCare', lead: 'What can we', circled: 'help', rest: 'with?' },
  { glyph: 'journeySmile', lead: 'A', circled: 'time', rest: 'that might suit' },
  { glyph: 'doodleHeart', lead: 'How should we', circled: 'reach', rest: 'you?' },
]

/** One field treatment, five fields. Canary focus ring, powder at rest. */
const FIELD =
  'mt-2 min-h-14 w-full rounded-2xl border-2 border-powder bg-paper px-5 font-sans text-cobalt ' +
  'placeholder:text-cobalt/40 transition-colors focus:border-cobalt focus:outline-none ' +
  'focus:ring-4 focus:ring-canary'

/** The label above a field: small, uppercase, the guide's eyebrow treatment. */
const FIELD_LABEL = 'mt-6 block font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-cobalt/70'

/**
 * A choice row (steps 2 and 3).
 *
 * The native radio is `sr-only` rather than removed -- it keeps the arrow-key
 * behaviour, the label association and the focus stop, and `peer-*` drives the
 * visible card off its real checked state. Nothing here is styling-only state.
 */
/**
 * A choice row (steps 2 and 3).
 *
 * Selection is drawn from React's own value, not from `peer-checked:`. The
 * component already holds the answer, and a CSS rule keyed on `:checked` is a
 * second source of truth for the same state -- one that also has to survive
 * however the radio got checked.
 */
const choiceClass = (selected: boolean) =>
  [
    'flex min-h-14 items-center gap-3 rounded-2xl border-2 px-5 font-sans text-cobalt',
    'transition-colors peer-focus-visible:ring-4 peer-focus-visible:ring-canary',
    selected ? 'border-cobalt bg-canary' : 'border-powder bg-paper hover:border-cobalt-40',
  ].join(' ')

/**
 * The clinic's own icon for each reason-for-visit, so the form reads as the
 * same clinic as the services section rather than four bare radio rows. Keyed
 * by the exact string in `CONCERNS`; a concern with no obvious icon simply
 * renders without one rather than borrowing a misleading drawing.
 */
const CONCERN_ICON: Record<string, string | undefined> = {
  'First visit': 'infant-oral-care',
  'A toothache or break': 'emergency-trauma',
  'A check-up': 'cleaning',
  'Brushing or toothpaste advice': 'fluoride-sealants',
}

/** Empty circle at rest, cobalt disc with a canary tick when chosen. Selection
 *  must carry a shape cue, not colour alone. */
function Tick({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 text-[0.75rem]',
        'leading-none transition-colors',
        selected ? 'border-cobalt bg-cobalt text-canary' : 'border-powder bg-white text-transparent',
      ].join(' ')}
    >
      ✓
    </span>
  )
}

/** The step's question, with the guide's lasso around its one key word. */
function StepLegend({ step }: { step: number }) {
  const art = STEP_ART[step]
  if (!art) return null
  return (
    <legend className="max-w-[20ch] font-display text-h2 leading-[1.25] text-cobalt">
      {art.lead} <Circled>{art.circled}</Circled>
      {art.rest ? ` ${art.rest}` : null}
    </legend>
  )
}

function validate(values: BookingValues, step: number): Errors {
  const errors: Errors = {}
  STEP_FIELDS[step]?.forEach((field) => {
    const value = values[field].trim()
    if (!value) {
      errors[field] =
        field === 'email'
          ? 'An email helps us confirm the appointment.'
          : 'A little detail here will help us find the right visit.'
    }
  })
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'That email does not look quite complete — please check it once more.'
  }
  if (values.phone && !/^[+()\d][+()\d\s-]{4,31}$/.test(values.phone)) {
    errors.phone = 'Please enter a phone number we can use to reach you.'
  }
  const age = Number(values.childAge)
  if (
    values.childAge &&
    (!/^\d{1,2}$/.test(values.childAge) || !Number.isInteger(age) || age < 0 || age > 18)
  ) {
    errors.childAge = 'Please enter an age from 0 to 18.'
  }
  return errors
}

export function Booking({ asPage = false }: { asPage?: boolean | undefined }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<BookingValues>(EMPTY_BOOKING)
  const [errors, setErrors] = useState<Errors>({})
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileError, setTurnstileError] = useState('')
  const [website, setWebsite] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitError, setSubmitError] = useState('')
  const [referenceCode, setReferenceCode] = useState<string | null>(null)
  const [submissionId] = useState(() => crypto.randomUUID())

  const progressRef = useRef<SVGPathElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('book')
  const bookingConfigured = isBookingApiConfigured()
  const Heading = asPage ? 'h1' : 'h2'

  useEffect(() => {
    const path = progressRef.current
    if (!path) return
    const length = primeDraw(path, reduced)
    if (reduced) return
    gsap.fromTo(
      path,
      { strokeDashoffset: length },
      {
        strokeDashoffset: length * (1 - (step + 1) / 4),
        duration: 0.48,
        ease: EASE.entrance,
        overwrite: true,
      }
    )
  }, [reduced, step])

  useEffect(() => {
    const root = successRef.current
    if (!referenceCode || !root) return
    const paths = Array.from(root.querySelectorAll<SVGPathElement>('[data-draw]'))
    if (reduced) {
      paths.forEach((path) => primeDraw(path, true))
      return
    }
    const ctx = gsap.context(() => {
      paths.forEach((path) => primeDraw(path, false))
      gsap.to(paths, { strokeDashoffset: 0, duration: 0.65, ease: EASE.entrance, stagger: 0.08 })
    }, root)
    return () => ctx.revert()
  }, [referenceCode, reduced])

  const update = (field: keyof BookingValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  const focusFirstError = () => {
    window.requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus()
    })
  }

  const onTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token)
    setTurnstileError('')
    setSubmitError('')
  }, [])

  const onTurnstileError = useCallback((message: string) => {
    setTurnstileToken('')
    setTurnstileError(message)
  }, [])

  const next = async () => {
    const nextErrors = validate(values, step)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      focusFirstError()
      return
    }
    if (step < 3) {
      setStep((current) => current + 1)
      return
    }

    if (!bookingConfigured) {
      setSubmitState('error')
      setSubmitError(
        'Online appointment requests are not connected in this environment yet.',
      )
      return
    }

    const nextConsentError = consent
      ? ''
      : 'Please confirm that we may use these details to respond to this request.'
    const nextTurnstileError = turnstileToken
      ? ''
      : 'Please complete the anti-spam check.'
    setConsentError(nextConsentError)
    setTurnstileError(nextTurnstileError)

    if (nextConsentError || nextTurnstileError) {
      focusFirstError()
      return
    }

    setSubmitState('submitting')
    setSubmitError('')
    try {
      const receipt = await submitBooking({
        values,
        consent,
        submissionId,
        turnstileToken,
        website,
      })
      setReferenceCode(receipt.referenceCode)
      setSubmitState('idle')
    } catch (error) {
      setSubmitState('error')
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Your request could not be sent. Please try again.',
      )
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await next()
  }

  const errorFor = (field: keyof BookingValues) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-2 font-sans text-sm font-medium text-cobalt">
        {errors[field]}
      </p>
    ) : null

  if (referenceCode) {
    return (
      <section
        id="book"
        className="tt-section grid min-h-[70svh] place-items-center bg-cobalt px-6 py-24"
        data-surface="cobalt"
        aria-live="polite"
      >
        <div ref={successRef} className="text-center">
          <Logo drawable size={180} tone="canary" title="Tiny Tusk" />
          <Heading className="mt-8 font-display text-h1 text-canary">
            We have your note.
          </Heading>
          <p className="mx-auto mt-4 max-w-measure font-sans text-body text-white">
            Thank you, {values.parentName}. Your request was securely received. Keep this
            reference in case you need to follow up:
          </p>
          <p className="mx-auto mt-5 w-fit rounded-full bg-white px-6 py-3 font-sans text-lg font-semibold tracking-[0.08em] text-cobalt">
            {referenceCode}
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="book"
      className={[
        'tt-section bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
      aria-labelledby="book-heading"
    >
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
        <aside className="lg:sticky lg:top-28">
          <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
          <Heading id="book-heading" className="mt-4 font-display text-h1 text-cobalt">
            Book a visit
          </Heading>
          <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
            A few details now; a kind person will call to make the rest simple.
          </p>

          <div className="mt-8 rounded-[2rem] bg-powder p-6 text-cobalt md:p-8">
            <Doodle name="journeyCare" tone="cobalt" className="w-20" />
            <p className="mt-5 font-display text-h2">Four small steps</p>
            <ol className="mt-5 grid gap-3">
              {BOOKING_STEPS.map((label, index) => {
                const active = step === index
                const complete = step > index

                return (
                  <li key={label}>
                    <button
                      type="button"
                      disabled={!complete}
                      onClick={() => setStep(index)}
                      aria-current={active ? 'step' : undefined}
                      className={[
                        'flex min-h-12 w-full items-center gap-4 rounded-2xl px-4 text-left font-sans font-semibold transition-colors',
                        active ? 'bg-cobalt text-white' : 'bg-white/70 text-cobalt',
                        complete ? 'cursor-pointer hover:bg-canary' : '',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm',
                          active ? 'bg-canary text-cobalt' : 'bg-white text-cobalt',
                        ].join(' ')}
                      >
                        {complete ? '✓' : index + 1}
                      </span>
                      {label}
                    </button>
                  </li>
                )
              })}
            </ol>
            <p className="mt-5 border-t-2 border-white/60 pt-5 font-sans text-sm leading-relaxed">
              Please leave medical records and sensitive clinical details out of this form.
            </p>
          </div>
        </aside>

        <div>
          {/* Brand stroke progress rail */}
          <div aria-label={`Step ${step + 1} of 4`}>
            <svg viewBox="0 0 400 20" className="h-5 w-full overflow-visible" aria-hidden="true">
              <path
                d="M 6 10 Q 100 2, 200 10 T 394 10"
                fill="none"
                stroke="var(--tt-powder)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                ref={progressRef}
                d="M 6 10 Q 100 2, 200 10 T 394 10"
                fill="none"
                stroke="var(--tt-cobalt)"
                strokeWidth="8"
                strokeLinecap="round"
                data-draw
              />
            </svg>
            <p className="mt-3 flex flex-wrap items-center gap-3 font-sans text-sm font-semibold text-cobalt">
              <span className="rounded-full bg-canary px-3 py-1 text-cobalt">
                Step {step + 1} of 4
              </span>
              {BOOKING_STEPS[step]}
            </p>
          </div>

          <form
            ref={formRef}
            className={[
              'relative mt-6 overflow-hidden rounded-[2.5rem] border-2 border-powder bg-white',
              'p-6 shadow-[0_18px_50px_rgba(24,82,142,0.08)] md:p-10',
            ].join(' ')}
            onSubmit={onSubmit}
            noValidate
          >
          {/* The step's own doodle, sat in the card's corner. Rests complete --
              the card carries no second animation system, and the coral dashes
              are graphic only: nothing is ever set on coral (CLAUDE.md §6.1). */}
          <div className="pointer-events-none absolute right-6 top-6 flex items-start gap-3" aria-hidden="true">
            <span className="w-10">
              <Doodle name="markDashes" tone="coral" />
            </span>
            <span className="w-16">
              <Doodle name={STEP_ART[step]?.glyph ?? 'doodleFace'} tone="powder" />
            </span>
          </div>

          <div aria-live="assertive" className="sr-only">
            {[
              ...Object.values(errors).filter(Boolean),
              consentError,
              turnstileError,
            ]
              .filter(Boolean)
              .join(' ')}
          </div>

          {step === 0 && (
            <fieldset>
              <StepLegend step={0} />
              <label className={FIELD_LABEL}>
                Child's name
                <input
                  name="childName"
                  value={values.childName}
                  onChange={(e) => update('childName', e.target.value)}
                  aria-invalid={Boolean(errors.childName)}
                  aria-describedby={errors.childName ? 'childName-error' : undefined}
                  className={FIELD}
                  placeholder="The name they answer to"
                  autoComplete="off"
                />
              </label>
              {errorFor('childName')}
              <label className={FIELD_LABEL}>
                Age
                <input
                  name="childAge"
                  inputMode="numeric"
                  value={values.childAge}
                  onChange={(e) => update('childAge', e.target.value)}
                  aria-invalid={Boolean(errors.childAge)}
                  aria-describedby={errors.childAge ? 'childAge-error' : undefined}
                  className={FIELD}
                  placeholder="In years — 0 to 18"
                />
              </label>
              {errorFor('childAge')}
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <StepLegend step={1} />
              <div className="mt-6 grid gap-3">
                {CONCERNS.map((concern) => {
                  const selected = values.concern === concern
                  return (
                    <label key={concern} className="block cursor-pointer">
                      <input
                        type="radio"
                        name="concern"
                        className="peer sr-only"
                        checked={selected}
                        onChange={() => update('concern', concern)}
                        aria-invalid={Boolean(errors.concern)}
                        aria-describedby={errors.concern ? 'concern-error' : undefined}
                      />
                      <span className={choiceClass(selected)}>
                        <Tick selected={selected} />
                        {CONCERN_ICON[concern] ? (
                          <ServiceIcon slug={CONCERN_ICON[concern]} className="h-9 w-9 shrink-0" />
                        ) : null}
                        {concern}
                      </span>
                    </label>
                  )
                })}
              </div>
              {errorFor('concern')}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <StepLegend step={2} />
              <div className="mt-6 grid gap-3">
                {TIMES.map((time) => {
                  const selected = values.preferredTime === time
                  return (
                    <label key={time} className="block cursor-pointer">
                      <input
                        type="radio"
                        name="time"
                        className="peer sr-only"
                        checked={selected}
                        onChange={() => update('preferredTime', time)}
                        aria-invalid={Boolean(errors.preferredTime)}
                        aria-describedby={
                          errors.preferredTime ? 'preferredTime-error' : undefined
                        }
                      />
                      <span className={choiceClass(selected)}>
                        <Tick selected={selected} />
                        {time}
                      </span>
                    </label>
                  )
                })}
              </div>
              {errorFor('preferredTime')}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <StepLegend step={3} />
              <label className={FIELD_LABEL}>
                Your name
                <input
                  name="parentName"
                  value={values.parentName}
                  onChange={(e) => update('parentName', e.target.value)}
                  aria-invalid={Boolean(errors.parentName)}
                  aria-describedby={errors.parentName ? 'parentName-error' : undefined}
                  className={FIELD}
                  autoComplete="name"
                />
              </label>
              {errorFor('parentName')}
              <label className={FIELD_LABEL}>
                Phone
                <input
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={FIELD}
                  autoComplete="tel"
                />
              </label>
              {errorFor('phone')}
              <label className={FIELD_LABEL}>
                Email
                <input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={FIELD}
                  autoComplete="email"
                />
              </label>
              {errorFor('email')}

              <div
                hidden
                className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                aria-hidden="true"
              >
                <label>
                  Website
                  <input
                    name="website"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <label className="mt-7 flex items-start gap-3 font-sans text-sm leading-relaxed text-cobalt">
                <input
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked)
                    setConsentError('')
                  }}
                  aria-invalid={Boolean(consentError)}
                  aria-describedby={consentError ? 'consent-error' : 'consent-note'}
                  className="mt-1 h-5 w-5 shrink-0 accent-cobalt"
                />
                <span>
                  I agree that Tiny Tusk may use these details only to respond to this
                  appointment request.
                </span>
              </label>
              <p id="consent-note" className="mt-2 font-sans text-xs leading-relaxed text-cobalt-80">
                Requests are retained for up to 90 days. Please do not include medical records
                or sensitive clinical information.
              </p>
              {consentError ? (
                <p id="consent-error" className="mt-2 font-sans text-sm font-medium text-cobalt">
                  {consentError}
                </p>
              ) : null}

              {bookingConfigured && TURNSTILE_SITE_KEY ? (
                <div
                  className="mt-7"
                  aria-invalid={Boolean(turnstileError)}
                  aria-describedby={turnstileError ? 'turnstile-error' : undefined}
                >
                  <Turnstile
                    siteKey={TURNSTILE_SITE_KEY}
                    onToken={onTurnstileToken}
                    onError={onTurnstileError}
                  />
                </div>
              ) : !submitError ? (
                <p className="mt-7 rounded-xl border-2 border-powder bg-paper p-4 font-sans text-sm leading-relaxed text-cobalt">
                  Online appointment requests are not connected in this environment yet.
                </p>
              ) : null}
              {turnstileError ? (
                <p id="turnstile-error" className="mt-2 font-sans text-sm font-medium text-cobalt">
                  {turnstileError}
                </p>
              ) : null}
            </fieldset>
          )}

          {submitError ? (
            <p
              role="alert"
              className="mt-6 rounded-xl border-2 border-cobalt bg-paper p-4 font-sans text-sm leading-relaxed text-cobalt"
            >
              {submitError}
            </p>
          ) : null}

          <div className="mt-9 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="min-h-12 rounded-full bg-powder px-6 font-sans font-semibold text-cobalt transition-colors hover:bg-canary"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {/* Not `<StylisedCTA>`: that renders `type="button"` and has no
                disabled state, so the signature ellipse here would submit twice
                on a slow network. A real submit button keeps the guard. */}
            <button
              type="submit"
              disabled={submitState === 'submitting'}
              className={[
                'group inline-flex min-h-14 items-center gap-3 rounded-full bg-cobalt px-7',
                'font-sans font-semibold text-white transition-colors hover:bg-cobalt-80',
                'disabled:cursor-wait disabled:opacity-60',
              ].join(' ')}
            >
              {submitState === 'submitting'
                ? 'Sending securely…'
                : step === 3
                  ? 'Send my request'
                  : 'Continue'}
              <span className="w-5 -rotate-90 transition-transform group-hover:translate-x-1" aria-hidden="true">
                <Doodle name="markArrow" tone="canary" />
              </span>
            </button>
          </div>
          </form>
        </div>
      </div>
    </section>
  )
}
