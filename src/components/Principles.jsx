import { useMemo, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { Lock, Sparkles, EyeOff, ArrowUpRight, Check } from 'lucide-react'
import { analyse, SAMPLES } from '../lib/detect'
import { Heading } from './Problem'
import { SIGNUP } from '../lib/urls'

/**
 * Three principles, each shown working rather than claimed.
 *
 * Secure by default   — the switch panel starts fully on, and turning things off
 *                       visibly costs something.
 * Simple by design    — the entire configuration surface, on one screen, so the
 *                       claim "nothing to configure" can be checked.
 * Privacy by design   — a real detector running in the reader's own tab. They type,
 *                       it finds, and the panel shows precisely what would have
 *                       reached a server. Nothing is sent; the network tab proves it.
 *
 * The third one is the argument. Every vendor in this category writes "your data
 * never leaves your device" on a slide. This lets someone verify it in ten seconds
 * with their own text, which is a different kind of statement altogether.
 */
export default function Principles() {
  return (
    <>
      <SecureByDefault />
      <PrivacyByArchitecture />
    </>
  )
}

/* ------------------------------------------------------------------------- */

const DETECTORS = [
  { key: 'card', label: 'Payment cards', on: true, note: 'Luhn-checked' },
  { key: 'iban', label: 'IBAN', on: true, note: 'mod-97 checked' },
  { key: 'ppsn', label: 'PPSN (Ireland)', on: true, note: 'check letter' },
  { key: 'api', label: 'API keys', on: true, note: 'provider prefixes' },
  { key: 'aws', label: 'AWS keys', on: true, note: 'AKIA…' },
  { key: 'pk', label: 'Private keys', on: true, note: 'PEM blocks' },
  { key: 'pwd', label: 'Passwords', on: true, note: 'assigned secrets' },
  { key: 'email', label: 'Email addresses', on: false, note: 'noisy — opt in' },
  {
    key: 'keys',
    label: 'Keystroke capture',
    on: false,
    locked: true,
    note: 'restricted in DE, PT, NL, FI',
  },
]

function SecureByDefault() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [state, setState] = useState(() =>
    Object.fromEntries(DETECTORS.map((d) => [d.key, d.on]))
  )

  // The score is the product's own: protection on, minus what has been switched off.
  // Opt-in detectors are excluded from the denominator, because a company that
  // sensibly leaves them off should not be told it is at 84% — a number that cannot
  // reach 100 is a number an admin stops reading.
  const scored = DETECTORS.filter((d) => d.on)
  const score = Math.round(
    (scored.filter((d) => state[d.key]).length / scored.length) * 100
  )

  return (
    <section id="secure" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-fg-muted">
              <Lock className="size-4" />
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg-dim">
              Secure by default
            </span>
          </div>

          <h3
            className="display mt-7 max-w-[24ch] text-fg"
            style={{ fontSize: 'clamp(1.7rem,3vw,2.6rem)' }}
          >
            Protection is on before you open the dashboard.
          </h3>

          <p className="mt-6 max-w-[52ch] text-fg-muted" style={{ fontSize: 'var(--text-lead)' }}>
            There is no configuration step between installing and being protected. Every
            detector that belongs on is already on — the panel beside this is the real
            default, not an illustration of one.
          </p>

          <p className="mt-6 max-w-[52ch] text-[0.94rem] text-fg-dim">
            Two are deliberately off. Email addresses are noisy enough to bury real
            findings. Keystroke capture is restricted by law in Germany, Portugal, the
            Netherlands and Finland, and needs agreement with employee representatives in
            Austria, France, Sweden and the Netherlands — so it cannot be a default
            anywhere, and switching it on is a decision rather than a setting.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
            style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
              default policy
            </span>
            <span
              className={[
                'font-mono text-[0.78rem] tnum transition-colors duration-500',
                score === 100 ? 'text-safe' : score >= 70 ? 'text-fg' : 'text-stamp',
              ].join(' ')}
            >
              baseline {score}%
            </span>
          </div>

          <div className="divide-y divide-line">
            {DETECTORS.map((d, i) => (
              <motion.button
                key={d.key}
                type="button"
                disabled={d.locked}
                onClick={() => !d.locked && setState((s) => ({ ...s, [d.key]: !s[d.key] }))}
                initial={{ opacity: 0, x: -8 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
                className={[
                  'flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors',
                  d.locked ? 'cursor-not-allowed opacity-60' : 'hover:bg-surface-2',
                ].join(' ')}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[0.95rem] text-fg">{d.label}</span>
                  <span className="mt-0.5 block font-mono text-[0.68rem] text-fg-dim">
                    {d.note}
                  </span>
                </span>

                {/* A switch, not a checkbox — and one that reads as a state rather than
                    a control, because on this page it is documentation. */}
                <span
                  className={[
                    'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300',
                    state[d.key] ? 'bg-safe/80' : 'bg-line-bright',
                  ].join(' ')}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={[
                      'absolute top-0.5 size-4 rounded-full bg-void',
                      state[d.key] ? 'left-[1.15rem]' : 'left-0.5',
                    ].join(' ')}
                  />
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {score < 100 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-stamp/30 bg-stamp/5"
              >
                <p className="px-5 py-3.5 font-mono text-[0.74rem] text-stamp">
                  turning a detector off is recorded, and the reason is asked for
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------------- */

function PrivacyByArchitecture() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [text, setText] = useState(SAMPLES[0].text)
  const [active, setActive] = useState(0)

  // Runs on every keystroke, in this tab. That is the whole demonstration: the
  // detector is here, so there is nothing to send anywhere.
  const findings = useMemo(() => analyse(text), [text])

  return (
    <section id="privacy" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <Heading
          eyebrow="Privacy by architecture"
          title="Try it on your own text. Nothing leaves this tab."
          lead="The detector below is the real thing, running in your browser. Type anything — a card number, a config file, a client record — and watch what it finds. Then look at what would have been sent to a server."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ---------- input ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
                on your machine
              </span>
              <span className="font-mono text-[0.66rem] text-fg-dim tnum">
                {text.length} chars
              </span>
            </div>

            <label className="sr-only" htmlFor="probe">
              Text to analyse
            </label>
            <textarea
              id="probe"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              rows={7}
              className="w-full resize-none bg-transparent px-5 py-4 font-mono text-[0.92rem] leading-relaxed text-fg outline-none placeholder:text-fg-dim"
              placeholder="Paste or type something…"
            />

            <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3.5">
              {SAMPLES.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setText(s.text)
                    setActive(i)
                  }}
                  className={[
                    'rounded-full border px-3 py-1.5 text-[0.78rem] transition-colors',
                    active === i
                      ? 'border-line-bright bg-surface-2 text-fg'
                      : 'border-line text-fg-muted hover:text-fg',
                  ].join(' ')}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ---------- what would be transmitted ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
                what a server would receive
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.66rem] text-safe">
                <EyeOff className="size-3" />
                0 bytes sent
              </span>
            </div>

            <div className="min-h-[13rem] px-5 py-4">
              <AnimatePresence mode="popLayout">
                {findings.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[0.88rem] text-fg-dim"
                  >
                    {text.trim()
                      ? 'nothing sensitive found — no event, nothing recorded'
                      : 'waiting for input'}
                  </motion.p>
                ) : (
                  findings.map((f) => (
                    <motion.div
                      key={`${f.type}-${f.masked}`}
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.28 }}
                      className="mb-2.5 flex items-start justify-between gap-4 rounded-lg border border-line bg-surface-2 px-3.5 py-3"
                    >
                      <span className="min-w-0">
                        <span
                          className={[
                            'block text-[0.9rem]',
                            f.severity === 'critical' ? 'text-stamp' : 'text-fg',
                          ].join(' ')}
                        >
                          {f.type}
                        </span>
                        <span className="mt-0.5 block font-mono text-[0.7rem] text-fg-dim">
                          {f.why}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[0.88rem] text-fg-muted">
                        {f.masked}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 border-t border-line px-5 py-4 font-mono text-[0.74rem]">
              <Line ok>the masked fragment, the type, the time</Line>
              <Line ok>which computer, and which company</Line>
              <Line>the text itself, the file, or the document name</Line>
              <Line>which websites anyone visited, or which apps they used</Line>
            </div>
          </motion.div>
        </div>

        <p className="mt-8 max-w-[70ch] text-[0.95rem] text-fg-dim">
          The last two lines are the part worth comparing. Products in this category
          routinely report file names and application usage back to a console — useful for
          a security team, and a monitoring system your staff never agreed to. Akmaz does
          not collect it, which also means it cannot be subpoenaed, breached or resold.
        </p>

        <a
          href={SIGNUP}
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-line-bright bg-surface px-5 py-3 text-[0.92rem] font-medium transition-colors hover:border-stamp/60 hover:bg-surface-2"
        >
          See it on a real machine
          <ArrowUpRight className="size-4 text-fg-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stamp" />
        </a>
      </div>
    </section>
  )
}

function Line({ ok, children }) {
  return (
    <div className="flex items-start gap-2.5">
      {ok ? (
        <Check className="mt-px size-3.5 shrink-0 text-safe" />
      ) : (
        <span className="mt-1.5 h-px w-3.5 shrink-0 bg-fg-dim" />
      )}
      <span className={ok ? 'text-fg-muted' : 'text-fg-dim line-through decoration-fg-dim/40'}>
        {children}
      </span>
    </div>
  )
}
