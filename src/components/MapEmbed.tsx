import { useState } from 'react'

import { CLINIC, CLINIC_ADDRESS, MAP_EMBED_SRC } from '@/content/site'

/**
 * Facade around the Google Maps embed.
 *
 * The embed pulls well over a megabyte across dozens of requests, and on the
 * opening screen the frame sits in the viewport from first paint, so the
 * iframe's own `loading="lazy"` never defers anything -- it competes with the
 * fonts and the brand artwork for the first second of the page. Nothing
 * third-party loads here until the visitor asks for the map.
 *
 * The address sits above both call sites and "Get directions" is beside them,
 * so the map is an extra, not the only way to find the clinic.
 */
export function MapEmbed({ className }: { className: string }) {
  const [shown, setShown] = useState(false)

  if (shown) {
    return (
      <iframe
        src={MAP_EMBED_SRC}
        title={`Map showing ${CLINIC.fullName} in ${CLINIC_ADDRESS.locality}`}
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShown(true)}
      className={`${className} flex flex-col items-center justify-center gap-1 bg-cobalt-80 font-sans text-canary`}
    >
      <span className="text-[0.9375rem] font-semibold">Show map</span>
      <span className="text-[0.8125rem] text-canary/80">
        {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
      </span>
    </button>
  )
}
