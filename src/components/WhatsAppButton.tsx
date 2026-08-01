import { CLINIC, whatsappHref, whatsappIsVerified } from '@/content/site'

/**
 * The WhatsApp mark: the outlined speech bubble with a handset inside it,
 * drawn as one fill so it can sit in white on the green disc exactly as the
 * platform specifies. Third-party artwork -- it is not brand art, so it does
 * not belong in `ART` and must not be restyled into a Tiny Tusk doodle.
 */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...(className ? { className } : {})}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export interface WhatsAppButtonProps {
  /**
   * `icon` is the round disc for the desktop bar, where the label would
   * crowd the booking pill. `row` is the full-width labelled version for the
   * mobile panel, where an unlabelled disc in a list of words reads as a
   * decoration rather than an action.
   */
  variant?: 'icon' | 'row'
  className?: string
  onNavigate?: () => void
}

/**
 * "Chat on WhatsApp" -- opens a conversation with the clinic, pre-filled with
 * an opening line so the parent does not have to compose one.
 *
 * Renders nothing at all when no number is available (see `whatsappHref`).
 * That is the intended production state until the clinic confirms its number:
 * a button that leads somewhere wrong is worse than an absent button.
 */
export function WhatsAppButton({
  variant = 'icon',
  className,
  onNavigate,
}: WhatsAppButtonProps) {
  const href = whatsappHref()
  if (!href) return null

  const verified = whatsappIsVerified()
  const label = `Chat with ${CLINIC.name} on WhatsApp`

  // The one place the sample number is surfaced. The footer labels its mock
  // block in the layout; a nav pill has no room for a caption, so the marker
  // is a coral dot plus the browser tooltip.
  const devNotice = verified
    ? undefined
    : 'Development sample number — not clinic information'

  const shared = [
    // Green is the logotype, so it is exempt from the contrast floor, but the
    // ring is not decoration: at 1.22:1 the disc would otherwise have no edge
    // against the powder bar behind it.
    'relative inline-flex items-center justify-center ring-1 ring-white/70',
    'transition-opacity duration-200 hover:opacity-90',
  ]

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      aria-label={variant === 'icon' ? label : undefined}
      {...(devNotice ? { title: devNotice } : {})}
      className={[
        ...shared,
        variant === 'icon'
          ? 'h-11 w-11 rounded-full'
          // `nowrap` and a step down from the booking pill's 1.25rem: at that
          // size the label wrapped to two lines inside the 16rem panel, which
          // left this pill taller than the booking one above it.
          : 'w-full gap-2.5 whitespace-nowrap rounded-full px-5 py-3 font-display text-[1.15rem] leading-none text-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'var(--wa-green)' }}
    >
      <WhatsAppGlyph
        className={variant === 'icon' ? 'h-[1.35rem] w-[1.35rem] text-white' : 'h-5 w-5 text-white'}
      />
      {variant === 'row' ? <span>Chat on WhatsApp</span> : null}

      {/* Opens in a new tab; announced rather than left as a surprise. */}
      <span className="sr-only">{variant === 'row' ? label : ''} (opens WhatsApp in a new tab)</span>

      {devNotice ? (
        <span
          aria-hidden="true"
          // Outside the shape in both variants: the row's label is centred and
          // runs the full width, so an inset dot lands on top of it.
          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-white"
        />
      ) : null}
    </a>
  )
}
