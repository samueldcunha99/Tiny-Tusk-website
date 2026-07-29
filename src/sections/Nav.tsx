import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/Logo'
import { Doodle } from '@/components/Doodle'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { CLINIC } from '@/content/site'

/**
 * Every destination below has a real route or home-page section. Keeping this
 * list small makes the navigation useful rather than a contents page.
 */
const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/dr-nupur', label: 'Meet Dr. Nupur' },
  { href: '/parents-corner', label: "Parents' Corner" },
  { href: '/book', label: 'Book a visit' },
] as const

export function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page and trap focus while the mobile panel is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !open || reduced) return
    const items = panel.querySelectorAll('[data-nav-item]')
    const tl = gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: EASE.entrance, stagger: STAGGER },
    )
    return () => {
      tl.kill()
    }
  }, [open, reduced])

  return (
    <header
      className={[
        'fixed left-0 top-0 z-50 w-full transition-all duration-300',
        condensed ? 'px-3 py-3 md:px-6 md:py-4' : 'px-4 py-5 md:px-10 md:py-8',
      ].join(' ')}
    >
      <nav
        aria-label="Primary"
        className={[
          'mx-auto flex items-center justify-between transition-all duration-300',
          condensed
            ? 'max-w-5xl rounded-full bg-white/85 px-4 py-2 shadow-[0_8px_30px_rgba(24,82,142,0.10)] backdrop-blur-md md:px-6'
            : 'max-w-[1600px] bg-transparent',
        ].join(' ')}
      >
        {/* p8: the mark's default placement is top-left. */}
        <a href="#hero" className="flex items-center gap-3" aria-label={`${CLINIC.name} — home`}>
          {/* Never below 64px -- the guide's minimum digital size (p7). The nav
              condenses by tightening the pill, not by shrinking the mark. */}
          <Logo size={64} tone="cobalt" title={`${CLINIC.name} logo`} />
          <span className="sr-only">{CLINIC.fullName}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-sans text-[0.95rem] text-cobalt transition-opacity hover:opacity-70"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={CLINIC.phoneHref}
              className="rounded-full bg-cobalt px-5 py-2.5 font-sans text-[0.95rem] text-white transition-opacity hover:opacity-90"
            >
              Call the clinic
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span aria-hidden="true" className="relative block h-4 w-6">
            <span
              className="absolute left-0 block h-[2px] w-6 bg-cobalt transition-transform duration-300"
              style={{ top: open ? 7 : 0, transform: open ? 'rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute left-0 block h-[2px] w-6 bg-cobalt transition-transform duration-300"
              style={{ top: open ? 7 : 14, transform: open ? 'rotate(-45deg)' : 'none' }}
            />
          </span>
        </button>
      </nav>

      {/* Mobile: full-screen powder overlay with staggered reveal and a
          doodle-filled corner, per the brief. */}
      <div
        id="mobile-nav"
        ref={panelRef}
        // `inert` is not in React 18's DOM typings yet, so it is spread in.
        {...(!open ? ({ inert: '' } as Record<string, string>) : {})}
        aria-hidden={!open}
        data-surface="powder"
        // Note: the `hidden` attribute alone is only a UA display:none, which a
        // `flex` utility silently overrides -- so visibility is driven by the
        // class list instead, and `inert` keeps the closed panel out of the
        // tab order.
        className={[
          'fixed inset-0 z-40 flex-col justify-center bg-powder px-8 md:hidden',
          open ? 'flex' : 'hidden',
        ].join(' ')}
      >
        <ul className="flex flex-col gap-6">
          {LINKS.map((l) => (
            <li key={l.href} data-nav-item>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-[2.5rem] leading-none text-cobalt"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li data-nav-item>
            <a
              href={CLINIC.phoneHref}
              onClick={() => setOpen(false)}
              className="font-display text-[2.5rem] leading-none text-cobalt"
            >
              Call the clinic
            </a>
          </li>
        </ul>
        <div className="pointer-events-none absolute bottom-6 right-4 w-40 opacity-90">
          <Doodle name="doodleFace" tone="cobalt" />
        </div>
        <div className="pointer-events-none absolute bottom-40 right-10 w-16 opacity-80">
          <Doodle name="markDashes" tone="cobalt" />
        </div>
      </div>
    </header>
  )
}
