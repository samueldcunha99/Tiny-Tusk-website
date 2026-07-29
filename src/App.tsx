import { Nav } from '@/sections/Nav'
import { Hero } from '@/sections/Hero'
import { Journey } from '@/sections/Journey'
import { Services } from '@/sections/Services'
import { Preloader } from '@/sections/Preloader'
import { RiaJourney } from '@/sections/RiaJourney'
import { Team } from '@/sections/Team'
import { ParentsCorner } from '@/sections/ParentsCorner'
import { Testimonials } from '@/sections/Testimonials'
import { Faq } from '@/sections/Faq'
import { Booking } from '@/sections/Booking'
import { Route, Routes } from 'react-router-dom'

function Home() {
  return <><Hero /><Journey /><Services /><RiaJourney /><Team /><ParentsCorner /><Testimonials /><Faq /><Booking /></>
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dr-nupur" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/parents-corner" element={<ParentsCorner />} />
          <Route path="/book" element={<Booking />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
