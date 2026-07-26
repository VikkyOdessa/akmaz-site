import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { ArrowDown, Clipboard, ShieldCheck } from 'lucide-react'
// Single source for the sequence — the walkthrough below renders the same array,
// so the demo and the explanation cannot drift apart (see lib/steps.js).
import { STEPS, BLOCK_FROM } from '../lib/steps'

const SIGNUP = 'https://hunter.website4u.tech/signup'

const HEADLINE = [
  [{ t: "It won't be a hacker." }],
  [{ t: "It'll be someone " }, { t: 'helpful', accent: true }, { t: '.' }],
]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // The hero recedes as the page moves past it: content lifts and dims while the
  // section itself stays put. Cheaper and steadier than moving the whole block.
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.965])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center pt-24 pb-16"
    >
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale }}
        className="relative z-10 mx-auto grid w-full max-w-6xl gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16"
      >
        {/* ---------- left: the claim ---------- */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 backdrop-blur"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-safe opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-safe" />
            </span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-muted">
              Endpoint DLP · built in Ireland
            </span>
          </motion.div>

          <h1 className="display text-fg" style={{ fontSize: 'var(--text-display)' }}>
            {HEADLINE.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 1.05,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + li * 0.11,
                  }}
                >
                  {line.map((part, pi) =>
                    part.accent ? (
                      <span key={pi} className="relative text-stamp">
                        {part.t}
                        {/* Underline drawn after the words land, so the emphasis
                            reads as a mark made on the sentence rather than a
                            style applied to it. */}
                        <motion.span
                          className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-stamp/45"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
                        />
                      </span>
                    ) : (
                      <span key={pi}>{part.t}</span>
                    )
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
            className="mt-8 max-w-[42ch] text-fg-muted"
            style={{ fontSize: 'var(--text-lead)' }}
          >
            Client data leaves an office the ordinary way — copied, pasted, taken home to
            finish a job. Akmaz clears it from the clipboard before that can happen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.54 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={SIGNUP}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fg px-6 py-3.5 font-medium text-void transition-transform duration-300 hover:scale-[1.02]"
            >
              <span className="relative z-10">Try it free</span>
              <ShieldCheck className="relative z-10 size-4" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <span className="font-mono text-[0.76rem] text-fg-dim">
              14 days · no card · <span className="text-stamp">early access</span>
            </span>
          </motion.div>
        </div>

        {/* ---------- right: the product, performing ---------- */}
        <InterceptDemo />
      </motion.div>

      {/* Scroll cue. Disappears the moment the page moves — a permanent arrow is
          an instruction the reader has already followed. */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-fg-dim"
        >
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.2em]">how it happens</span>
          <ArrowDown className="size-3.5" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   The signature element: the interception, running live.

   Written as a state machine over STEPS rather than a CSS keyframe sequence, for
   a reason that matters beyond taste — the same array will drive the walkthrough
   further down the page, so the demo and the explanation can never drift apart.
   A keyframe animation would have to be kept in sync by hand.
   --------------------------------------------------------------------------- */
function InterceptDemo() {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      // Show the outcome, skip the performance: the point of the demo is the
      // result, and the result is legible as a still frame.
      setI(STEPS.length - 1)
      return
    }
    const t = setTimeout(() => setI((v) => (v + 1) % STEPS.length), STEPS[i].hold)
    return () => clearTimeout(t)
  }, [i, reduced])

  const step = STEPS[i]
  const blocked = i >= BLOCK_FROM

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/80 backdrop-blur-xl">
        {/* A light that tracks the state instead of decorating the panel: neutral
            while data is in the clear, red once it has been stopped. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: blocked ? 0.5 : 0.16 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute -inset-px"
          style={{
            background:
              'radial-gradient(120% 60% at 50% 0%, color-mix(in oklab, var(--color-stamp) 22%, transparent), transparent 70%)',
          }}
        />

        <div className="relative flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
            <Clipboard className="size-3.5" />
            clipboard monitor
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, si) => (
              <span
                key={s.key}
                className={[
                  'h-1 rounded-full transition-all duration-500',
                  si === i ? 'w-5 bg-stamp' : si < i ? 'w-1.5 bg-fg-dim' : 'w-1.5 bg-line-bright',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        <div className="relative px-5 py-6 font-mono text-[0.84rem]">
          {/* Fixed height: a panel that resizes between steps makes the whole
              hero jump, which is the difference between a product demo and a
              page that looks unfinished. */}
          <div className="flex min-h-[7.5rem] flex-col justify-center gap-3">
            <div className="text-[0.66rem] uppercase tracking-[0.16em] text-fg-dim">
              {step.label}
            </div>

            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'break-all text-[1rem] leading-relaxed',
                step.key === 'clear' ? 'text-stamp' : '',
                step.key === 'paste' ? 'text-fg-dim' : '',
                step.key === 'detect' ? 'text-fg' : '',
              ].join(' ')}
            >
              {step.value}
            </motion.div>

            {step.key === 'clear' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-[0.74rem] text-safe"
              >
                cleared before paste · nothing left to send
              </motion.div>
            )}
          </div>

          {/* Sweep line: passes through the value exactly when detection happens,
              so the motion means something instead of running on a loop. */}
          {step.key === 'detect' && !reduced && (
            <motion.div
              aria-hidden="true"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 120, opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-x-0 h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, var(--color-stamp), transparent)',
                boxShadow: '0 0 18px 1px color-mix(in oklab, var(--color-stamp) 60%, transparent)',
              }}
            />
          )}
        </div>
      </div>

      {/* Status pill, not a rubber stamp. The earlier design pressed a rotated
          border onto the panel like ink onto paper; this reports a system state,
          which is what actually happened — a process decided, in memory, in the
          gap between two keystrokes. Nothing was stamped. */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: blocked ? 1 : 0, y: blocked ? 0 : 6 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-3.5 right-5"
      >
        <span className="pill">blocked</span>
      </motion.div>
    </motion.div>
  )
}
