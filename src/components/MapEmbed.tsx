import { useEffect, useState } from 'react'

import { CLINIC, CLINIC_ADDRESS, MAP_EMBED_SRC } from '@/content/site'

/**
 * The Google Maps embed, held back until the page itself has finished loading.
 *
 * The embed pulls well over a megabyte across dozens of requests. Both call
 * sites set `loading="lazy"`, but the opening screen's frame sits in the
 * viewport from first paint, so the browser never deferred anything -- the map
 * competed with the fonts and the brand artwork for the first second.
 *
 * Waiting for `load` keeps the map always visible (no click, no interaction)
 * while letting everything above it paint first. A tinted tile holds the exact
 * same box in the meantime, so nothing shifts when the frame swaps in.
 */
export function MapEmbed({ className }: { className: string }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (document.readyState === 'complete') {
      setShown(true)
      return
    }
    const mount = () => setShown(true)
    window.addEventListener('load', mount, { once: true })
    return () => window.removeEventListener('load', mount)
  }, [])

  if (!shown) {
    return (
      <div
        aria-hidden="true"
        className={`${className} flex items-center justify-center bg-cobalt-80 font-sans text-[0.8125rem] text-canary/80`}
      >
        {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
      </div>
    )
  }

  return (
    <iframe
      src={MAP_EMBED_SRC}
      title={`Map showing ${CLINIC.fullName} in ${CLINIC_ADDRESS.locality}`}
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  )
}
