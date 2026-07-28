import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { SIGNUP, LOGIN } from '../lib/urls'

const LINKS = [
  { label: 'How it happens', href: '#how' },
  { label: 'What it watches', href: '#watches' },
  { label: 'Limits', href: '#limits' },
  { label: 'Pricing', href: '#pricing' },
]


/**
 * Fixed navigation that is invisible over the hero and materialises once the page
 * moves: no border, no background until scroll, then a hairline and a blur.
 *
 * The state flips on a threshold rather than being mapped continuously to scroll
 * position. A border that fades in gradually spends a hundred pixels looking like
 * a rendering artefact; a clean switch at one point reads as intent.
 */
export default function Navbar() {
  const { scrollY } = useScroll()
  const [lifted, setLifted] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setLifted(v > 24))

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={[
            'transition-all duration-500',
            lifted
              // A light page needs a more opaque bar than a dark one: at 70% the
              // grid behind it shows through the text and the header looks smudged.
              ? 'border-b border-line bg-surface-xl'
              : 'border-b border-transparent bg-transparent',
          ].join(' ')}
        >
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
            <a href="#top" className="flex items-baseline gap-2.5 text-[1.15rem] font-semibold tracking-tight">
              akmaz<span className="text-stamp">.</span>
              {/* The status is part of the identity while the product is unfinished.
                  Putting it beside the name means nobody can miss it, and nobody
                  can later say they were not told. */}
              <span className="hidden font-mono text-[0.6rem] font-normal uppercase tracking-[0.16em] text-fg-dim sm:inline">
                early access
              </span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[0.9rem] text-fg-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <a href={LOGIN} className="text-[0.9rem] text-fg-muted transition-colors hover:text-fg">
                Sign in
              </a>
              <a
                href={SIGNUP}
                className="group inline-flex items-center gap-1.5 rounded-full border border-line-bright bg-surface px-4 py-2 text-[0.88rem] font-medium transition-colors hover:border-stamp/50 hover:bg-surface-2"
              >
                Try it free
                <ArrowUpRight className="size-3.5 text-fg-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stamp" />
              </a>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="rounded-md p-2 text-fg-muted transition-colors hover:text-fg md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile panel. Height animation rather than opacity, so links are never
          clickable while invisible — a real bug on touch, not a nicety. */}
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-16 z-40 overflow-hidden border-b border-line bg-void md:hidden"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-[1.05rem] text-fg-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-3 flex gap-3 border-t border-line pt-4">
            <a href={LOGIN} className="flex-1 rounded-full border border-line px-4 py-2.5 text-center text-[0.9rem] text-fg-muted">
              Sign in
            </a>
            <a href={SIGNUP} className="flex-1 rounded-full border border-stamp/50 bg-stamp/8 px-4 py-2.5 text-center text-[0.9rem] font-medium text-fg">
              Try it free
            </a>
          </div>
        </div>
      </motion.div>
    </>
  )
}
