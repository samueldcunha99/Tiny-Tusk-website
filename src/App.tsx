import type { ReactNode } from 'react'
import { RouteMeta } from '@/components/RouteMeta'
import { SectionOrder } from '@/content/sectionOrder'
import type { SectionId } from '@/content/site'
import { useIsMobile } from '@/lib/viewport'
import { Nav } from '@/sections/Nav'
import { Hero } from '@/sections/Hero'
import { HomeMobile } from '@/sections/Home.mobile'
import { HomePaths } from '@/sections/HomePaths'
import { Journey } from '@/sections/Journey'
import { Services } from '@/sections/Services'
import { InsideClinic } from '@/sections/InsideClinic'
import { Preloader } from '@/sections/Preloader'
import { RiaJourney } from '@/sections/RiaJourney'
import { Team } from '@/sections/Team'
import { BrushTimer } from '@/sections/BrushTimer'
import { Games } from '@/sections/Games'
import { ParentsCorner } from '@/sections/ParentsCorner'
import { Testimonials } from '@/sections/Testimonials'
import { Faq } from '@/sections/Faq'
import { Booking } from '@/sections/Booking'
import { Footer } from '@/sections/Footer'
import { NotFound } from '@/sections/NotFound'

/**
 * What the desktop home renders, in order. The section numbers are counted off
 * this list rather than off the registry, so dropping or reordering a section
 * here renumbers the rest instead of leaving a gap (see `sectionOrder.tsx`).
 * Keep it in step with the JSX below.
 */
const HOME_ORDER: readonly SectionId[] = [
  'hero',
  'paths',
  'journey',
  'services',
  'clinic',
  'ria',
  'team',
  'brush-timer',
  'parents',
  'voices',
  'faq',
  'book',
]

function Home() {
  // Mobile gets a different page, not a narrower one: see `Home.mobile.tsx`.
  // The desktop composition below is untouched and never mounts under `md`.
  if (useIsMobile()) return <HomeMobile />

  return (
    <SectionOrder ids={HOME_ORDER}>
      <Hero />
      <HomePaths />
      <Journey />
      <Services />
      <InsideClinic />
      <RiaJourney />
      <Team />
      <BrushTimer />
      <ParentsCorner />
      <Testimonials />
      <Faq />
      <Booking />
    </SectionOrder>
  )
}

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

function CurrentRoute() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  switch (pathname) {
    case '/':
      return (
        <PageRoute
          title="Tiny Tusk — Pediatric Dental Clinic"
          description="Gentle pediatric dental care explained with kindness, patience, and plain-spoken guidance for families."
        >
          <Home />
        </PageRoute>
      )
    case '/dr-nupur':
      return (
        <PageRoute
          title="Meet Dr. Nupur | Tiny Tusk"
          description="Meet Dr. Nupur, BDS · MDS in Pediatric Dentistry, and learn what families can expect from her calm approach."
        >
          <Team asPage />
        </PageRoute>
      )
    case '/services':
      return (
        <PageRoute
          title="Pediatric Dental Services | Tiny Tusk"
          description="A plain-spoken overview of the pediatric dental services Tiny Tusk is designed to provide for growing smiles."
        >
          <Services asPage />
        </PageRoute>
      )
    case '/inside-clinic':
      return (
        <PageRoute
          title="Inside the Clinic | Tiny Tusk"
          description="Explore branded concept visuals for Tiny Tusk's planned reception, treatment room, and family learning corner."
        >
          <InsideClinic asPage />
        </PageRoute>
      )
    case '/games':
      return (
        <PageRoute
          title="Games for Kids | Tiny Tusk"
          description="Play Tiny Tusk's friendly two-minute brushing game and follow along with everyday healthy-routine activities for kids."
        >
          <Games />
        </PageRoute>
      )
    case '/brush-timer':
      return (
        <PageRoute
          title="Games for Kids | Tiny Tusk"
          description="Play Tiny Tusk's friendly two-minute brushing game and follow along with everyday healthy-routine activities for kids."
          noIndex
        >
          <Games />
        </PageRoute>
      )
    case '/parents-corner':
      return (
        <PageRoute
          title="Parents' Corner | Tiny Tusk"
          description="Warm, practical guidance for everyday questions about children's teeth, brushing, and dental visits."
        >
          <ParentsCorner asPage />
        </PageRoute>
      )
    case '/faq':
      return (
        <PageRoute
          title="Frequently Asked Questions | Tiny Tusk"
          description="Kind, plain-spoken answers to common family questions about pediatric dental visits and care."
        >
          <Faq asPage />
        </PageRoute>
      )
    case '/book':
      return (
        <PageRoute
          title="Book a Visit | Tiny Tusk"
          description="Start a secure appointment request for Tiny Tusk Pediatric Dental Clinic."
        >
          <Booking asPage />
        </PageRoute>
      )
    default:
      return (
        <PageRoute
          title="Page Not Found | Tiny Tusk"
          description="The requested Tiny Tusk page could not be found."
          noIndex
        >
          <NotFound />
        </PageRoute>
      )
  }
}

export default function App() {
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
    </>
  )
}
