import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/Logo'
import { Doodle } from '@/components/Doodle'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { useIsMobile } from '@/lib/viewport'
import { CLINIC } from '@/content/site'

/**
 * Every destination below has a real route or home-page section. Keeping this
 * list small makes the navigation useful rather than a contents page.
 */
const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/inside-clinic', label: 'Inside clinic' },
  { href: '/dr-nupur', label: 'Meet Dr. Nupur' },
  { href: '/games', label: 'Games for Kids' },
  { href: '/parents-corner', label: "Parents' Corner" },
  { href: '/faq', label: 'FAQs' },
] as const

export function Nav() {
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const [pageProgress, setPageProgress] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastScrollRef = useRef(0)
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
  const needsTopNavSurface =
    currentPath === '/games' || currentPath === '/brush-timer'
  const isCurrent = (href: string) =>
    currentPath === href || (currentPath === '/brush-timer' && href === '/games')

  useEffect(() => {
    const onScroll = () => {
      const nextScroll = Math.max(0, window.scrollY)
      const previousScroll = lastScrollRef.current
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight

      setCondensed(nextScroll > 40)
      setPageProgress(
        scrollable > 0 ? Math.min(1, Math.max(0, nextScroll / scrollable)) : 0,
      )

      if (open || nextScroll < 80) {
        setNavVisible(true)
      } else if (nextScroll > previousScroll + 8) {
        setNavVisible(false)
      } else if (nextScroll < previousScroll - 4) {
        setNavVisible(true)
      }

      lastScrollRef.current = nextScroll
    }

    lastScrollRef.current = window.scrollY
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

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
    // Short travel: the panel is a card now, not a full screen, so a 28px
    // rise would read as items sliding in from outside their own container.
    const tl = gsap.fromTo(
      items,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.42, ease: EASE.entrance, stagger: STAGGER * 0.6 },
    )
    return () => {
      tl.kill()
    }
  }, [open, reduced])

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[60] h-1 bg-cobalt/10"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-coral"
          style={{ transform: `scaleX(${pageProgress})` }}
        />
      </div>

      <header
      className={[
        'fixed left-0 top-0 z-50 w-full transition-all duration-300',
        navVisible || open ? 'translate-y-0' : '-translate-y-[140%]',
        condensed ? 'px-3 py-3 md:px-6 md:py-4' : 'px-4 py-5 md:px-10 md:py-8',
      ].join(' ')}
    >
      <nav
        aria-label="Primary"
        className={[
          'mx-auto flex items-center justify-between transition-all duration-300',
          // On a phone the bar never takes a surface -- the mark and the menu
          // button float directly on the page. Branching in JS rather than with
          // a `max-md:` override so the desktop string stays byte-identical
          // and cannot depend on Tailwind's class-ordering.
          isMobile
            ? 'max-w-[1600px] bg-transparent'
            : condensed
            ? 'max-w-5xl rounded-full bg-white/85 px-4 py-2 shadow-[0_8px_30px_rgba(24,82,142,0.10)] backdrop-blur-md md:px-6'
            : needsTopNavSurface
              ? 'max-w-[1600px] rounded-full bg-paper/95 px-4 py-2 shadow-[0_8px_30px_rgba(24,82,142,0.12)] backdrop-blur-md md:px-6'
            : 'max-w-[1600px] bg-transparent',
        ].join(' ')}
      >
        {/* p8: the mark's default placement is top-left. */}
        <a id="nav-logo" href="/" className="flex items-center gap-3" aria-label={`${CLINIC.name} — home`}>
          {/* Never below 64px -- the guide's minimum digital size (p7). The nav
              condenses by tightening the pill, not by shrinking the mark. */}
          <Logo size={64} tone="cobalt" title={`${CLINIC.name} logo`} />
          <span className="sr-only">{CLINIC.fullName}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const active = isCurrent(l.href)
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className="relative pb-1 font-sans text-[0.95rem] text-cobalt transition-opacity hover:opacity-70"
                >
                  {l.label}
                  {active ? (
                    <span
                      className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-coral"
                      aria-hidden="true"
                    />
                  ) : null}
                </a>
              </li>
            )
          })}
          <li>
            <a
              href="/book"
              aria-current={currentPath === '/book' ? 'page' : undefined}
              className={[
                'rounded-full bg-cobalt px-5 py-2.5 font-sans text-[0.95rem] text-white transition-opacity hover:opacity-90',
                currentPath === '/book' ? 'ring-2 ring-coral ring-offset-2 ring-offset-paper' : '',
              ].join(' ')}
            >
              Book a visit
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => {
            setNavVisible(true)
            setOpen((v) => !v)
          }}
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
      </header>

      {/* Tapping anywhere off the panel closes it, which a dropdown needs and
          a full-screen overlay did not. Transparent: the page stays visible,
          that is the point of anchoring the menu rather than covering with it. */}
      {open ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 cursor-default md:hidden"
        >
          <span className="sr-only">Close menu</span>
        </button>
      ) : null}

      {/* Mobile: a powder dropdown anchored to the top right, under the menu
          button, with the staggered reveal and a doodle in its corner.

          This MUST stay a sibling of the header, never a child. The header
          carries a `translate-y` for its hide-on-scroll, and any transform
          other than `none` makes an element the containing block for its
          `position: fixed` descendants -- so nested here, the panel resolved
          against the ~90px header box instead of the viewport. The links
          simply overflowed it with no background behind them, and whatever
          was underneath showed through. It read as correct only while the
          page behind happened to be powder too.

          `top-28` clears the header in both its normal and condensed states.
          The header is transparent but still takes pointer events, so a panel
          tucked any higher would have its first link swallowed by it. */}
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
          'fixed right-3 top-28 z-40 w-[16rem] max-w-[calc(100vw-1.5rem)] flex-col',
          'overflow-hidden rounded-[1.5rem] bg-powder px-4 py-4',
          // The hero is powder too, so a powder card on it had only its shadow
          // to say where the panel stopped and the page began. A white edge
          // separates it on any surface -- the same white-on-powder rule the
          // divider below the links already uses.
          'ring-1 ring-white/70',
          'shadow-[0_18px_50px_rgba(24,82,142,0.22)] md:hidden',
          open ? 'flex' : 'hidden',
        ].join(' ')}
      >
        {/* Spacing lives in each row's padding, not in the gap between rows:
            at `gap-4` with no padding the links measured 22px tall, half the
            44px a thumb needs, with dead space between them doing nothing. */}
        <ul className="flex flex-col gap-1">
          {LINKS.map((l) => {
            const active = isCurrent(l.href)
            return (
              <li key={l.href} data-nav-item>
                <a
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-2 py-3 font-display text-[1.4rem] leading-none text-cobalt"
                >
                  {/* The rule tracks the word, not the tap target, so it stays
                      tight under the label now that the row is padded out. */}
                  <span className="relative inline-block">
                    {l.label}
                    {active ? (
                      <span
                        className="absolute -bottom-1.5 left-0 h-[3px] w-9 rounded-full bg-coral"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </a>
              </li>
            )
          })}
          {/* Booking is the one action worth separating from the list. In the
              full-screen panel its size did that; in a dropdown, a rule and a
              filled row do it instead. */}
          <li data-nav-item className="mx-2 mt-2 border-t-2 border-white/70 pt-4">
            <a
              href="/book"
              aria-current={currentPath === '/book' ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={[
                'block rounded-full bg-cobalt px-5 py-3 text-center font-display text-[1.25rem]',
                'leading-none text-white',
                currentPath === '/book' ? 'ring-2 ring-coral ring-offset-2 ring-offset-powder' : '',
              ].join(' ')}
            >
              Book a visit
            </a>
          </li>
        </ul>

        {/* Kept from the full-screen panel, sized for a card. It rests
            complete, so it is art rather than a third animation system. */}
        <div className="pointer-events-none mt-5 flex justify-end gap-2 opacity-90" aria-hidden="true">
          <span className="w-8 self-start pt-1">
            <Doodle name="markDashes" tone="cobalt" />
          </span>
          <span className="w-16">
            <Doodle name="doodleFace" tone="cobalt" />
          </span>
        </div>
      </div>
    </>
  )
}
