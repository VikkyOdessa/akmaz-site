import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { Clipboard, Eye, ShieldAlert, Scissors, ClipboardX } from 'lucide-react'
import { STEPS, BLOCK_FROM } from '../lib/steps'
import { Heading } from './Problem'

const ICONS = [Clipboard, Eye, ShieldAlert, Scissors, ClipboardX]

/**
 * The interception, driven by scroll rather than a timer.
 *
 * Scroll rather than autoplay for a specific reason: the hero already loops on a
 * timer, and a second self-running animation lower down competes with reading. Here
 * the reader sets the pace, which also means they cannot miss a step by looking away
 * — the thing a five-second autoplay does constantly.
 *
 * Implemented with a tall spacer and a sticky panel: the section is
 * `STEPS.length * 90vh` high, the panel pins inside it, and scroll progress selects
 * the step. Framer's useScroll is used rather than GSAP ScrollTrigger because it
 * needs no pin machinery of its own — with Lenis in play, two systems both pinning
 * elements is where this kind of page usually breaks.
 */
export default function Walkthrough() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Clamp before indexing: progress reaches exactly 1 at the end and would select
    // one past the last step, blanking the panel at the moment the reader arrives.
    const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
    setActive(idx < 0 ? 0 : idx)
  })

  const step = STEPS[active]
  const blocked = active >= BLOCK_FROM

  return (
    <section id="demo" ref={ref} style={{ height: `${STEPS.length * 90}vh` }} className="relative">
      {/* Sticky viewport. min-h-svh rather than 100vh: on mobile Safari the toolbar
          makes 100vh taller than the visible area, so a pinned panel sits partly
          off-screen — the classic reason a scroll animation "works on desktop". */}
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* ---------- left: what is happening, in words ---------- */}
          <div>
            <Heading
              eyebrow="Ctrl+C → Ctrl+V"
              title="Five steps, about forty milliseconds."
              lead="Between the copy and the paste there is a gap. Everything Akmaz does happens inside it."
            />

            <ol className="mt-12 flex flex-col gap-1">
              {STEPS.map((s, i) => {
                const Icon = ICONS[i]
                const isActive = i === active
                const isPast = i < active
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => {
                        // Clickable as well as scrollable: keyboard users and anyone who
                        // wants to re-read step three should not have to scroll-hunt for it.
                        const el = ref.current
                        if (!el) return
                        const top = el.offsetTop + (el.offsetHeight / STEPS.length) * i + 40
                        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
                      }}
                      className="group flex w-full items-start gap-4 rounded-lg px-2 py-3 text-left transition-colors hover:bg-surface/50"
                    >
                      <span
                        className={[
                          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border transition-all duration-500',
                          isActive
                            ? blocked && i >= BLOCK_FROM
                              ? 'border-stamp/60 bg-stamp/10 text-stamp'
                              : 'border-line-bright bg-surface-2 text-fg'
                            : isPast
                              ? 'border-line bg-transparent text-fg-dim'
                              : 'border-line bg-transparent text-fg-dim/50',
                        ].join(' ')}
                      >
                        <Icon className="size-4" />
                      </span>

                      <span className="min-w-0">
                        <span
                          className={[
                            'block text-[1.02rem] transition-colors duration-500',
                            isActive ? 'text-fg' : 'text-fg-dim',
                          ].join(' ')}
                        >
                          {s.title}
                        </span>
                        {/* The note appears only for the current step. Showing all five
                            at once turns a walkthrough into a wall of text and removes
                            any reason to keep scrolling. */}
                        <motion.span
                          initial={false}
                          animate={{
                            height: isActive ? 'auto' : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-1.5 block max-w-[46ch] text-[0.92rem] text-fg-muted">
                            {s.note}
                          </span>
                        </motion.span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* ---------- right: the terminal, performing ---------- */}
          <Terminal step={step} active={active} blocked={blocked} reduced={reduced} />
        </div>
      </div>
    </section>
  )
}

function Terminal({ step, active, blocked, reduced }) {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/85 backdrop-blur-xl">
        {/* State light. Neutral while the data is in the clear, red once stopped —
            the panel reports status through colour before any text is read. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: blocked ? 0.55 : 0.14 }}
          transition={{ duration: 0.9 }}
          className="pointer-events-none absolute -inset-px"
          style={{
            background:
              'radial-gradient(130% 55% at 50% 0%, color-mix(in oklab, var(--color-stamp) 24%, transparent), transparent 72%)',
          }}
        />

        <div className="relative flex items-center justify-between border-b border-line px-5 py-3.5">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
            {step.label}
          </span>
          <span className="font-mono text-[0.68rem] text-fg-dim tnum">
            {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </span>
        </div>

        <div className="relative px-5 py-8 font-mono sm:px-7">
          {/* Fixed height. A panel that resizes between steps drags the whole sticky
              layout up and down, which reads as a bug rather than a transition. */}
          <div className="flex min-h-[9rem] flex-col justify-center gap-4">
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'break-all text-[1.05rem] leading-relaxed sm:text-[1.2rem]',
                step.tone === 'blocked' ? 'text-stamp' : '',
                step.tone === 'safe' ? 'text-fg-dim' : '',
                step.tone === 'alert' ? 'text-fg' : '',
                step.tone === 'neutral' ? 'text-fg-muted' : '',
              ].join(' ')}
            >
              {step.value}
            </motion.div>

            {step.key === 'clear' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[0.8rem] text-safe"
              >
                cleared from memory · nothing left to send
              </motion.div>
            )}

            {step.key === 'paste' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-[0.8rem] text-fg-dim"
              >
                <span className="inline-block h-4 w-[2px] animate-pulse bg-fg-dim" />
                the leak did not happen
              </motion.div>
            )}
          </div>

          {/* Detection sweep: fires only on the detect step, so the movement carries
              meaning instead of running as ambient decoration. */}
          {step.key === 'detect' && !reduced && (
            <motion.div
              aria-hidden="true"
              key="sweep"
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 180, opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-x-0 h-px"
              style={{
                background: 'linear-gradient(to right, transparent, var(--color-stamp), transparent)',
                boxShadow: '0 0 20px 1px color-mix(in oklab, var(--color-stamp) 65%, transparent)',
              }}
            />
          )}
        </div>

        {/* Progress bar along the bottom edge: scroll position, made legible without
            adding another element to the layout. */}
        <div className="relative h-px w-full bg-line">
          <motion.div
            className="absolute inset-y-0 left-0 bg-stamp"
            animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        animate={{ opacity: blocked ? 1 : 0, y: blocked ? 0 : 6 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-3.5 right-6"
      >
        <span className="pill">blocked</span>
      </motion.div>
    </div>
  )
}
