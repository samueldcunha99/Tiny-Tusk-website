import type { ReactNode } from 'react'
import { RouteMeta } from '@/components/RouteMeta'
import { Nav } from '@/sections/Nav'
import { Home } from '@/sections/Home'
import { Journey } from '@/sections/Journey'
import { LaughingGas } from '@/sections/LaughingGas'
import { Services } from '@/sections/Services'
import { InsideClinic } from '@/sections/InsideClinic'
import { Preloader } from '@/sections/Preloader'
import { Team } from '@/sections/Team'
import { Games } from '@/sections/Games'
import { ParentsCorner } from '@/sections/ParentsCorner'
import { ParentsArticle } from '@/sections/ParentsArticle'
import { parentArticle } from '@/content/parents'
import { NOT_FOUND_HEAD, ROUTE_HEADS, articleHead, type StaticPath } from '@/content/routes'
import { Faq } from '@/sections/Faq'
import { Booking } from '@/sections/Booking'
import { BookingClose } from '@/sections/BookingClose'
import { SmileEdge, SmileIntoFooter } from '@/components/SmileEdge'
import { Footer } from '@/sections/Footer'
import { NotFound } from '@/sections/NotFound'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { currentPath } from '@/lib/location'

/**
 * The full site, behind the pre-opening gate in `App.tsx`.
 *
 * It lives in its own module so that `App` can reach it through `lazy()`. While
 * `OPENING_SOON` is true none of these eighteen sections are on the page, and
 * importing them from `App` still shipped every one of them to every visitor --
 * a quarter of a megabyte of JavaScript parsed to render a holding screen.
 */

function PageRoute({
  title,
  description,
  children,
  noIndex = false,
}: {
  title: string
  description: string
  children: ReactNode
  noIndex?: boolean | undefined
}) {
  return (
    <>
      <RouteMeta title={title} description={description} noIndex={noIndex} />
      {children}
    </>
  )
}

/**
 * What each static path renders. Titles and descriptions live in `content/routes.ts`.
 *
 * A page that ends on a light ground closes on the home page's cobalt booking
 * chapter, so every route runs into the cobalt footer the same way.
 */
const PAGES: Record<StaticPath, () => ReactNode> = {
  '/': () => <Home />,
  '/dr-nupur': () => (
    <>
      <Team asPage />
      <SmileEdge from="canary" />
      <BookingClose />
    </>
  ),
  '/services': () => (
    <>
      <Services asPage />
      <SmileEdge from="canary" />
      <BookingClose
        heading={
          <>
            Not sure which one <span className="text-canary">you need?</span>
          </>
        }
        line="Tell us what you have noticed and we will work it out together."
      />
    </>
  ),
  '/laughing-gas': () => <LaughingGas />,
  '/journey': () => <Journey asPage />,
  '/inside-clinic': () => <InsideClinic asPage />,
  '/games': () => <Games />,
  // A non-indexed compatibility route for the old brush-timer link.
  '/brush-timer': () => <Games />,
  '/parents-corner': () => <ParentsCorner asPage />,
  '/faq': () => (
    <>
      <Faq asPage />
      <SmileEdge from="powder" />
      <BookingClose />
    </>
  ),
  '/book': () => <Booking asPage />,
}

// Every key starts with "/", so `in` cannot hit an inherited property.
const isStaticPath = (path: string): path is StaticPath => path in ROUTE_HEADS

function CurrentRoute() {
  const pathname = currentPath()

  // One blog post. Ahead of the static paths because it is the only route with
  // a variable segment; an unknown slug falls through to the 404 below.
  if (pathname.startsWith('/parents-corner/')) {
    const article = parentArticle(pathname.slice('/parents-corner/'.length))
    if (article) {
      return (
        <PageRoute {...articleHead(article)}>
          <ParentsArticle article={article} />
        </PageRoute>
      )
    }
  }

  if (isStaticPath(pathname)) {
    return <PageRoute {...ROUTE_HEADS[pathname]}>{PAGES[pathname]()}</PageRoute>
  }

  return (
    <PageRoute {...NOT_FOUND_HEAD}>
      <NotFound />
      <SmileIntoFooter from="powder" />
    </PageRoute>
  )
}

export default function Site() {
  return (
    <>
      <Preloader />
      <a className="tt-skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <CurrentRoute />
      </main>
      <Footer />
      {/* The client supplied this number for exactly this button. The phone
          line is in the nav bar ("Call us"), so it needs no floating twin. */}
      <WhatsAppButton variant="floating" />
    </>
  )
}
