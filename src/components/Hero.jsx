import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ArrowDown, ArrowUpRight, Check, Lock, Layers, ShieldOff } from 'lucide-react'
import { STEPS, BLOCK_FROM } from '../lib/steps'

const SIGNUP = 'https://hunter.website4u.tech/signup'

/**
 * The hero is the three principles, and nothing else competes with them.
 *
 * The previous version opened with "It won't be a hacker. It'll be someone helpful."
 * — a true sentence and a bad headline: set at display size, the largest words on
 * the screen were "a hacker", and a reader scanning for two seconds took away the
 * opposite of the point. A negation is the wrong shape for a headline, because
 * emphasis lands on the noun being denied.
 *
 * So the page now opens on what the product guarantees. Each principle states a
 * constraint in three words, and expands into the thing a buyer is actually looking
 * for — a specific, checkable claim rather than a paragraph of reassurance.
 */
const PILLARS = [
  {
    id: 'secure',
    icon: Lock,
    name: 'Secure by default',
    claim: 'Nothing to switch on.',
    expects: 'Am I protected before I understand this thing?',
    answer:
      'Every detector is active from the first minute — cards, IBANs, PPSNs, API keys, passwords. There is no setup wizard to complete, no policy to author, and no state in which the agent is installed but doing nothing.',
    proof: [
      ['7 detectors active', 'from install'],
      ['0 decisions required', 'to be protected'],
      ['2 deliberately off', 'noisy or legally restricted'],
    ],
  },
  {
    id: 'simple',
    icon: Layers,
    name: 'Simple by design',
    claim: 'Nothing to learn.',
    expects: 'Do I need to hire someone to run this?',
    answer:
      'Nine switches are the entire configuration surface. No rule language, no regex to write, no console anyone has to sit in front of. When something is blocked you get an email; the rest of the time there is nothing to look at, which is the point.',
    proof: [
      ['9 switches', 'the whole surface'],
      ['under 3 min', 'first machine protected'],
      ['1 file', 'to install'],
    ],
  },
  {
    id: 'privacy',
    icon: ShieldOff,
    name: 'Privacy by architecture',
    claim: 'Nothing to leak.',
    expects: 'What are you collecting about my staff?',
    answer:
      'Detection runs on the machine. What reaches the server is a masked fragment — ****1111 — the type of finding and the time. Never the text, the file, the file name, or a record of which sites anyone visited. You can verify it further down this page with your own data.',
    proof: [
      ['****1111', 'all that is sent'],
      ['0 file names', 'collected'],
      ['0 browsing history', 'collected'],
    ],
  },
]

export default function Hero() {
  const [open, setOpen] = useState('secure')

  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        {/* ---------- the claim, stated positively ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-safe opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-safe" />
          </span>
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-muted">
            Endpoint DLP · early access · built in Ireland
          </span>
        </motion.div>

        <div className="mt-9 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <div>
            <h1 className="display text-fg" style={{ fontSize: 'var(--text-display)' }}>
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                >
                  Client data
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.17 }}
                >
                  stops at the desk.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-7 max-w-[44ch] text-fg-muted"
              style={{ fontSize: 'var(--text-lead)' }}
            >
              Card numbers, IBANs, PPSNs and passwords are cleared from the clipboard
              before anyone can paste them into a browser, a chat window or an email
              home. Three rules decide how it behaves.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href={SIGNUP}
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-medium text-void transition-transform duration-300 hover:scale-[1.02]"
              >
                Try it free
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <span className="font-mono text-[0.76rem] text-fg-dim">
                14 days · no card · <span className="text-stamp">early access</span>
              </span>
            </motion.div>
          </div>

          {/* The live demo moves out of the headline's way — it belongs beside the
              principles, as evidence, not as the thing being announced. */}
          <InterceptDemo />
        </div>

        {/* ---------- the three principles, expanding ---------- */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3"
             style={{ boxShadow: 'var(--shadow-card)' }}>
          {PILLARS.map((p, i) => (
            <Pillar
              key={p.id}
              pillar={p}
              index={i}
              open={open === p.id}
              onOpen={() => setOpen(p.id)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-14 flex justify-center"
        >
          <a
            href="#how"
            className="flex flex-col items-center gap-2 text-fg-dim transition-colors hover:text-fg"
          >
            <span className="font-mono text-[0.64rem] uppercase tracking-[0.2em]">
              how a leak actually happens
            </span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="size-3.5" />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   One principle. Collapsed it shows the constraint; expanded it answers the
   question a buyer is actually holding.

   The question is printed explicitly — "Am I protected before I understand this
   thing?" — because naming the reader's doubt is more persuasive than answering it
   without acknowledgement. It also forces the copy to stay on the subject: an
   answer has to fit a question, where a feature list does not.
   --------------------------------------------------------------------------- */
function Pillar({ pillar, index, open, onOpen }) {
  const Icon = pillar.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 + index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'relative bg-surface transition-colors duration-300',
        open ? '' : 'hover:bg-surface-2',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        className="w-full p-6 text-left sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <Icon
            className={[
              'size-5 transition-colors duration-300',
              open ? 'text-stamp' : 'text-fg-dim',
            ].join(' ')}
          />
          <span className="font-mono text-[0.66rem] tabular-nums text-fg-dim">
            0{index + 1}
          </span>
        </div>

        <h2 className="mt-6 text-[0.92rem] font-medium text-fg-muted">{pillar.name}</h2>

        {/* The constraint is the largest text in the card: what the product refuses
            to require is more useful than what the principle is called. */}
        <p className="display mt-2 text-fg" style={{ fontSize: '1.55rem' }}>
          {pillar.claim}
        </p>

        <p className="mt-4 text-[0.9rem] italic text-fg-dim">"{pillar.expects}"</p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-6 pb-6 pt-5 sm:px-7">
              <p className="text-[0.94rem] text-fg-muted">{pillar.answer}</p>

              <dl className="mt-5 flex flex-col gap-2.5">
                {pillar.proof.map(([value, label]) => (
                  <div key={label} className="flex items-baseline gap-3">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-safe" />
                    <dt className="font-mono text-[0.86rem] text-fg tabular-nums">{value}</dt>
                    <dd className="text-[0.84rem] text-fg-dim">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active marker along the top edge, so the open card is identifiable at a
          glance on a light background where a filled panel would be too loud. */}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-stamp"
      />
    </motion.div>
  )
}

/* ---------- the interception, still running, now as supporting evidence ---------- */
function InterceptDemo() {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-line bg-surface"
        style={{ boxShadow: 'var(--shadow-card)' }}
        style={{ boxShadow: 'var(--shadow-lift)' }}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-fg-dim">
            clipboard monitor
          </span>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, si) => (
              <span
                key={s.key}
                className={[
                  'h-1 rounded-full transition-all duration-500',
                  si === i ? 'w-5 bg-stamp' : si < i ? 'w-1.5 bg-line-bright' : 'w-1.5 bg-line',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-6 font-mono text-[0.85rem]">
          <div className="flex min-h-[7rem] flex-col justify-center gap-3">
            <div className="text-[0.64rem] uppercase tracking-[0.16em] text-fg-dim">
              {step.label}
            </div>
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'break-all text-[0.98rem] leading-relaxed',
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
                className="text-[0.74rem] text-safe"
              >
                cleared before paste
              </motion.div>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-line">
          <motion.div
            className="h-px bg-stamp"
            animate={{ width: `${((i + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        animate={{ opacity: blocked ? 1 : 0, y: blocked ? 0 : 6 }}
        transition={{ duration: 0.4 }}
        className="absolute -bottom-3.5 right-5"
      >
        <span className="pill" style={{ background: 'var(--color-surface)' }}>
          blocked
        </span>
      </motion.div>
    </motion.div>
  )
}
