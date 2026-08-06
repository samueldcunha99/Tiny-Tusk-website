import { useEffect, useRef, useState } from 'react'

import { CLINIC, CLINIC_ADDRESS, MAP_EMBED_SRC } from '@/content/site'

/**
 * The Google Maps embed, mounted only once it is actually about to be seen.
 *
 * Measured on the live site: the embed is 402 KiB of transfer across dozens of
 * requests, and Lighthouse attributes every byte of its "227 KiB of unused
 * JavaScript" to it -- more than the whole rest of the page combined. The
 * iframe's own `loading="lazy"` does not help, because Chrome's lazy-loading
 * margin is generous enough on a throttled connection to fetch it anyway.
 *
 * An observer with a tight margin is the honest version: no click, no
 * interaction, the map is simply not built until the visitor scrolls near it.
 * On a phone it sits below the fold, so it stays out of the initial load
 * entirely. A tinted tile holds the identical box until then, so nothing
 * shifts.
 */
export function MapEmbed({ className }: { className: string }) {
  const [shown, setShown] = useState(false)
  const holder = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = holder.current
    if (!node) return

    // No IntersectionObserver (very old browsers): show the map rather than
    // leave a permanent placeholder.
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!shown) {
    return (
      <div
        ref={holder}
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
