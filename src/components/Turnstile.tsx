import { useEffect, useRef } from 'react'

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: 'light'
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    },
  ): string
  remove(widgetId: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi | undefined
  }
}

export interface TurnstileProps {
  siteKey: string
  onToken: (token: string) => void
  onError: (message: string) => void
}

const SCRIPT_ID = 'tiny-tusk-turnstile'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export function Turnstile({ siteKey, onToken, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let widgetId: string | undefined
    let cancelled = false

    const renderWidget = () => {
      if (cancelled || widgetId || !containerRef.current || !window.turnstile) return
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: 'booking_request',
        theme: 'light',
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () =>
          onError('The anti-spam check could not load. Please refresh and try again.'),
      })
    }

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    const script = existingScript ?? document.createElement('script')
    if (!existingScript) {
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    script.addEventListener('load', renderWidget)
    if (window.turnstile) renderWidget()

    return () => {
      cancelled = true
      script.removeEventListener('load', renderWidget)
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [onError, onToken, siteKey])

  return (
    <div>
      <div ref={containerRef} />
      <p className="mt-2 font-sans text-xs leading-relaxed text-cobalt-80">
        Protected by Cloudflare Turnstile.
      </p>
    </div>
  )
}
