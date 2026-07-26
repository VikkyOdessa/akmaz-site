import { useScroll, useTransform, motion } from 'motion/react'

/**
 * Ambient surface for a light page.
 *
 * On dark, depth came from two glows. That does not translate: a coloured blur on a
 * light background reads as a print smudge, and raising its opacity enough to see
 * turns the page pastel. Light pages get their depth from a faint structural grid,
 * one very weak warm wash to keep the white from going flat, and a top-down
 * lightening — all composited on the GPU so parallax stays smooth on the five-year-
 * old office laptops this product is sold to.
 */
export default function Background() {
  const { scrollYProgress } = useScroll()

  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '32%'])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 0.55, 0.3])
  const washY = useTransform(scrollYProgress, [0, 1], ['0vh', '55vh'])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Structural grid, masked so it fades rather than stopping at an edge. */}
      <motion.div
        style={{ y: gridY, opacity: gridOpacity }}
        className="absolute inset-x-0 -top-1/4 h-[150%]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 75% 55% at 50% 30%, black 15%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 30%, black 15%, transparent 78%)',
          }}
        />
      </motion.div>

      {/* A single warm wash at 4%. Enough that the white has a temperature; not
          enough to be identifiable as a colour. */}
      <motion.div
        style={{ y: washY }}
        className="absolute left-1/2 top-[-20vh] h-[80vh] w-[130vw] -translate-x-1/2"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(ellipse at center, color-mix(in oklab, var(--color-stamp) 4%, transparent) 0%, transparent 65%)',
          }}
        />
      </motion.div>

      {/* Lighten toward the top so the header area is cleanest — the opposite of a
          dark page's vignette, and it does the same job of keeping text legible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, color-mix(in oklab, white 55%, transparent) 0%, transparent 30%)',
        }}
      />
    </div>
  )
}
