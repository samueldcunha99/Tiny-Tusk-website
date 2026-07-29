import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/Logo'
import { CLINIC } from '@/content/site'
import { gsap, EASE, primeDraw, usePrefersReducedMotion } from '@/lib/motion'

const STORAGE_KEY = 'tiny-tusk-preloader-seen'

export function Preloader() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(STORAGE_KEY) !== 'yes')
  const rootRef = useRef<HTMLDivElement>(null)
  const unitRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!visible) return
    const root = rootRef.current
    const unit = unitRef.current
    const arc = arcRef.current
    if (!root || !unit || !arc) return
    const paths = Array.from(unit.querySelectorAll<SVGPathElement>('[data-draw]'))
    const finish = () => {
      sessionStorage.setItem(STORAGE_KEY, 'yes')
      setVisible(false)
    }
    if (reduced) {
      paths.forEach((path) => primeDraw(path, true))
      finish()
      return
    }
    const ctx = gsap.context(() => {
      paths.forEach((path) => primeDraw(path, false))
      const arcLength = primeDraw(arc, false)

      const targetNav = document.getElementById('nav-logo')
      let targetX = -180
      let targetY = -240
      let targetScale = 0.24

      if (targetNav && unit) {
        const targetRect = targetNav.getBoundingClientRect()
        const unitRect = unit.getBoundingClientRect()
        targetScale = (targetRect.width || 64) / unitRect.width
        targetX = targetRect.left + targetRect.width / 2 - (unitRect.left + unitRect.width / 2)
        targetY = targetRect.top + targetRect.height / 2 - (unitRect.top + unitRect.height / 2)
      }

      const tl = gsap.timeline({ onComplete: finish })
      tl.to(paths, { strokeDashoffset: 0, duration: 0.62, ease: EASE.entrance, stagger: 0.08 })
        .to(arc, { strokeDashoffset: 0, duration: 0.36, ease: EASE.entrance }, 0.3)
        .fromTo('[data-tagline]', { rotation: -12, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.34, ease: EASE.entrance }, 0.42)
        .to(unit, { scale: targetScale, x: targetX, y: targetY, duration: 0.38, ease: EASE.transform }, 1.05)
        .to(root, { opacity: 0, duration: 0.22, ease: EASE.entrance }, 1.48)
      gsap.set(arc, { strokeDashoffset: arcLength })
    }, root)
    return () => ctx.revert()
  }, [reduced, visible])

  if (!visible) return null
  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] grid place-items-center bg-cobalt" data-surface="cobalt">
      <div ref={unitRef} className="relative flex w-[min(76vw,390px)] flex-col items-center" data-animate>
        <svg viewBox="0 0 420 110" className="absolute -top-16 w-full overflow-visible" aria-hidden="true">
          <path ref={arcRef} d="M 55 95 Q 210 0 365 95" fill="none" stroke="var(--tt-canary)" strokeWidth="3" strokeLinecap="round" data-draw />
          <text data-tagline x="210" y="44" textAnchor="middle" fill="var(--tt-canary)" className="font-sans text-[16px] tracking-[0.14em]">{CLINIC.tagline.toUpperCase()}</text>
        </svg>
        <Logo drawable size={260} tone="canary" title="Tiny Tusk" />
      </div>
      <button type="button" onClick={() => { sessionStorage.setItem(STORAGE_KEY, 'yes'); setVisible(false) }} className="absolute bottom-8 rounded-full bg-canary px-5 py-3 font-sans text-sm font-semibold text-cobalt">Skip intro</button>
    </div>
  )
}
