import { Nav } from '@/sections/Nav'
import { Hero } from '@/sections/Hero'
import { Journey } from '@/sections/Journey'
import { Services } from '@/sections/Services'

export default function App() {
  return (
    <>
      <a className="tt-skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Journey />
        <Services />
      </main>
    </>
  )
}
