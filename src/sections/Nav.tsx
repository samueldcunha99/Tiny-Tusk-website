import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/Logo'
import { Doodle } from '@/components/Doodle'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { CLINIC } from '@/content/site'

/**
 * Every destination below has a real route or home-page section. Keeping this
 * list small makes the navigation useful rather than a contents page.
 */
const LINKS = [
  { href: '/journey', label: 'How a visit goes' },
  { href: '/services', label: 'Services' },
  { href: '/laughing-gas', label: 'Laughing Gas' },
  { href: '/inside-clinic', label: 'Inside clinic' },
  { href: '/dr-nupur', label: 'Meet Dr. Nupur' },
  { href: '/games', label: 'Games for Kids' },
  { href: '/parents-corner', label: "Parents' Corner" },
  { href: '/faq', label: 'FAQs' },
] as const

export function Nav() {
  const [open, setOpen] = useState(false)
  const [pageProgress, setPageProgress] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
  // `condensed`, `navVisible` and `needsTopNavSurface` all lived here to decide
  // which surface the bar took and whether it was on screen at all. A permanent
  // canary rectangle answers every one of those questions the same way, so the
  // state, the media query and the /games and /brush-timer special case are gone.
  const isCurrent = (href: string) =>
    currentPath === href || (currentPath === '/brush-timer' && href === '/games')

  // Scroll only drives the progress line now. The bar itself is fixed in every
  // sense: it does not hide on the way down, does not condense, and does not
  // swap surface -- one canary rectangle from the top of the page to the end.
  useEffect(() => {
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      const nextScroll = Math.max(0, window.scrollY)

      setPageProgress(
        scrollable > 0 ? Math.min(1, Math.max(0, nextScroll / scrollable)) : 0,
      )
    }

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
      {/* One canary rectangle, edge to edge, square corners, always opaque.
          This replaces a floating pill that branched four ways on breakpoint,
          scroll position and route -- with the bar permanently on a surface
          none of that had anything left to decide.

          Canary is what makes the single bar possible. Coral could only ever
          be a field (1.84:1 as ink on powder, and no pairing lists it as an
          element), so a coral bar forced the desktop links off it. Cobalt on
          canary is 6.37:1 and a p24 pairing, so the mark, the links and the
          hamburger all sit on the one surface at full contrast. */}
      <header className="fixed left-0 top-0 z-50 w-full bg-canary">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 md:px-10"
        >
        {/* p8: the mark's default placement is top-left. */}
        <a id="nav-logo" href="/" className="flex items-center gap-3" aria-label={`${CLINIC.name} home`}>
          {/* Never below 64px -- the guide's minimum digital size (p7). The
              bar is sized around the mark rather than the other way round. */}
          <Logo size={64} tone="cobalt" title={`${CLINIC.name} logo`} />
          <span className="sr-only">{CLINIC.fullName}</span>
        </a>

        {/* The old `pr` here pulled the cluster in off the right edge, back
            when the bar was a pill that read as pinned to the window. The
            rectangle carries the nav's own `px`, so that inset is now the
            header's job and the list just ends where the row does.

            The list appears at 1360px, not `md`: eight labels plus the booking
            pill and the WhatsApp disc measure 1188px at `gap-6`, and with the
            64px mark and the header's own padding the row needs ~1340px, so
            below that there is no honest way to fit them and the menu button
            stays. `xl` (1280) was the old figure and stopped being true when
            the Laughing Gas link was added -- the disc then hung 35px outside
            the pill. Widths were measured in a browser -- do not lower this
            breakpoint without re-measuring, and note that a longer label eats
            the slack. */}
        <ul className="hidden items-center gap-6 min-[1360px]:flex 2xl:gap-8">
          {LINKS.map((l) => {
            const active = isCurrent(l.href)
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className="relative whitespace-nowrap pb-1 font-sans text-[0.95rem] text-cobalt transition-opacity hover:opacity-70"
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
                'whitespace-nowrap rounded-full bg-cobalt px-5 py-2.5 font-sans text-[0.95rem] text-white transition-opacity hover:opacity-90',
                currentPath === '/book' ? 'ring-2 ring-coral ring-offset-2 ring-offset-paper' : '',
              ].join(' ')}
            >
              Book a visit
            </a>
          </li>
          {/* Outboard of the booking pill, and smaller than it: booking stays
              the primary action, WhatsApp is the quicker informal route for a
              parent who just wants to ask something. Renders nothing until a
              real number exists. */}
          <li className="flex items-center">
            <WhatsAppButton />
          </li>
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full min-[1360px]:hidden"
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

        {/* On the bar's bottom edge rather than the window's: with a permanent
            full-width header the line reads as the bar's own underline, and at
            `top-0` it would have sat inside the canary instead of under it. */}
        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-cobalt/10"
          aria-hidden="true"
        >
          <div
            className="h-full origin-left bg-coral"
            style={{ transform: `scaleX(${pageProgress})` }}
          />
        </div>
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
          className="fixed inset-0 z-30 cursor-default min-[1360px]:hidden"
        >
          <span className="sr-only">Close menu</span>
        </button>
      ) : null}

      {/* Mobile: a powder dropdown anchored to the top right, under the menu
          button, with the staggered reveal and a doodle in its corner.

          This MUST stay a sibling of the header, never a child. Any transform
          other than `none` makes an element the containing block for its
          `position: fixed` descendants -- nested inside the header, back when
          it carried a `translate-y` for its hide-on-scroll, the panel resolved
          against the ~90px header box instead of the viewport. The links
          simply overflowed it with no background behind them, and whatever was
          underneath showed through. It read as correct only while the page
          behind happened to be powder too. The transform is gone with the
          hide-on-scroll, but a sibling is what the panel wants regardless.

          `top-24` (96px) clears the header, which is now one fixed height --
          `py-3` twice plus the 64px mark is 88px, and there is no condensed
          state left to also clear. The header takes pointer events across its
          full width, so a panel tucked any higher has its first link swallowed
          by it. Re-measure if the bar's padding or the mark's size changes. */}
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
          'fixed right-3 top-24 z-40 w-[16rem] max-w-[calc(100vw-1.5rem)] flex-col',
          'overflow-hidden rounded-[1.5rem] bg-powder px-4 py-4',
          // The hero is powder too, so a powder card on it had only its shadow
          // to say where the panel stopped and the page began. A white edge
          // separates it on any surface -- the same white-on-powder rule the
          // divider below the links already uses.
          'ring-1 ring-white/70',
          'shadow-[0_18px_50px_rgba(24,82,142,0.22)] min-[1360px]:hidden',
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
          {/* Labelled here, unlike the desktop disc: in a list of words an
              unlabelled icon reads as decoration rather than an action. */}
          <li data-nav-item className="mx-2 mt-2 flex">
            <WhatsAppButton variant="row" onNavigate={() => setOpen(false)} />
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
