import { CLINIC, CLINIC_PHONE } from '@/content/site'

/**
 * Standard phone handset icon in pure SVG fill.
 */
function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...(className ? { className } : {})}
    >
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  )
}

export interface PhoneButtonProps {
  /**
   * `floating`: Fixed circular action button stacked above WhatsApp in the bottom-right corner.
   * `icon`: Compact circular disc.
   * `row`: Full-width labelled button for panels/drawers.
   */
  variant?: 'icon' | 'row' | 'floating'
  label?: string
  className?: string
  onNavigate?: () => void
}

/**
 * Direct phone call action button linking to the clinic's telephone number.
 */
export function PhoneButton({
  variant = 'floating',
  label: rowLabel = `Call ${CLINIC_PHONE.display}`,
  className,
  onNavigate,
}: PhoneButtonProps) {
  const label = `Call ${CLINIC.name} at ${CLINIC_PHONE.display}`

  const shared = [
    variant === 'floating'
      ? 'fixed bottom-[5.5rem] right-6 z-50 inline-flex items-center justify-center rounded-full bg-cobalt text-white shadow-[0_8px_30px_rgba(24,82,142,0.32)] ring-2 ring-white/90 transition-transform duration-200 hover:scale-110 active:scale-95'
      : 'relative inline-flex items-center justify-center bg-cobalt text-white ring-1 ring-white/70 transition-opacity duration-200 hover:opacity-90',
  ]

  return (
    <a
      href={CLINIC_PHONE.href}
      onClick={onNavigate}
      aria-label={variant === 'icon' || variant === 'floating' ? label : undefined}
      title={label}
      className={[
        ...shared,
        variant === 'floating'
          ? 'h-14 w-14'
          : variant === 'icon'
          ? 'h-11 w-11 rounded-full'
          : 'w-full gap-2.5 whitespace-nowrap rounded-full px-5 py-3 font-display text-[1.15rem] leading-none text-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <PhoneGlyph
        className={
          variant === 'floating'
            ? 'h-6 w-6 text-white'
            : variant === 'icon'
            ? 'h-5 w-5 text-white'
            : 'h-5 w-5 text-white'
        }
      />
      {variant === 'row' ? <span aria-hidden="true">{rowLabel}</span> : null}
      <span className="sr-only">{variant === 'row' ? label : ''}</span>
    </a>
  )
}
