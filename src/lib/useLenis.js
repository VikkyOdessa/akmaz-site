import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth scrolling, plus the two wiring details that decide whether the rest of
 * the page animates correctly or fights itself.
 *
 * Lenis stops moving the document and starts transforming it instead. Anything
 * that reads scroll position independently therefore sees a value that no longer
 * matches what is on screen:
 *
 *   GSAP ScrollTrigger  — measures window.scrollY on its own schedule, so
 *                         triggers fire early, late, or twice. Fixed by driving
 *                         Lenis from GSAP's ticker and telling ScrollTrigger to
 *                         update on every Lenis frame: one clock for both.
 *
 *   Framer Motion       — useScroll works because Lenis still dispatches native
 *                         scroll events; no extra wiring needed. Worth knowing,
 *                         because the usual advice is to reach for a
 *                         ScrollContainer wrapper that is not required here and
 *                         breaks position: sticky when added.
 *
 * Returns nothing on purpose: components should react to scroll through
 * useScroll or ScrollTrigger, not by reading a Lenis instance directly.
 */
export function useLenis() {
  useEffect(() => {
    // Respect the OS setting. Hijacking scroll for someone who asked for reduced
    // motion is the one accessibility failure a marketing page really can inflict:
    // it can trigger nausea, and there is no way for them to switch it off.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.05,
      // Slightly overdamped: a long tail feels expensive, an over-long one feels
      // like the page is ignoring you.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch is left alone deliberately. Native momentum on a phone is better
      // than anything a library reproduces, and overriding it is the fastest way
      // to make a site feel broken on mobile.
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => lenis.raf(time * 1000)   // GSAP ticker is in seconds
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Anchor links stop working the moment scrolling is virtualised — the browser
    // jumps the real document while Lenis keeps its own position.
    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -80 })   // clear the fixed navbar
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
