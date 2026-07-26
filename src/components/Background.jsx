import { useScroll, useTransform, motion } from 'motion/react'

/**
 * Ambient depth for the whole page: a grid that recedes, two slow light sources,
 * and a vignette. Everything here is decoration, so it is pointer-events-none,
 * aria-hidden, and moves at a fraction of scroll speed.
 *
 * The grid is drawn with gradients rather than an SVG pattern for one practical
 * reason: gradients are composited on the GPU and cost nothing to translate,
 * while a large repeating SVG repaints on every frame and turns a 60fps parallax
 * into a stutter on the exact machines this product is sold to — five-year-old
 * office laptops.
 */
export default function Background() {
  const { scrollYProgress } = useScroll()

  // Layers move at different rates. Depth comes from the difference between them,
  // not from any single element's speed.
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.5, 0.28, 0.12])
  const glowOneY = useTransform(scrollYProgress, [0, 1], ['0vh', '65vh'])
  const glowTwoY = useTransform(scrollYProgress, [0, 1], ['0vh', '-35vh'])
  const glowOneOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.55, 0.35, 0.2])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Perspective grid. Two crossed gradients, masked so the lines fade out
          instead of stopping at a hard edge. */}
      <motion.div
        style={{ y: gridY, opacity: gridOpacity }}
        className="absolute inset-x-0 -top-1/4 h-[150%]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 35%, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 35%, black 20%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Primary light, warm — the same red that means "blocked" everywhere else,
          held far below the intensity it has when it carries meaning. */}
      <motion.div
        style={{ y: glowOneY, opacity: glowOneOpacity }}
        className="absolute left-1/2 top-[-18vh] h-[70vh] w-[110vw] -translate-x-1/2"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(ellipse at center, color-mix(in oklab, var(--color-stamp) 16%, transparent) 0%, transparent 62%)',
            filter: 'blur(38px)',
          }}
        />
      </motion.div>

      {/* Secondary light, cool and much weaker: gives the warm one something to
          be warm against. A single glow on black just reads as a coloured blob. */}
      <motion.div
        style={{ y: glowTwoY }}
        className="absolute right-[-15vw] top-[55vh] h-[55vh] w-[70vw]"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(ellipse at center, color-mix(in oklab, #4c6ef5 9%, transparent) 0%, transparent 65%)',
            filter: 'blur(48px)',
          }}
        />
      </motion.div>

      {/* Vignette last, so it darkens everything above and keeps text legible
          wherever a glow happens to sit. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 50% 0%, transparent 40%, var(--color-void) 100%)',
        }}
      />
    </div>
  )
}
