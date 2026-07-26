import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Lock, Layers, ShieldOff, Check } from 'lucide-react'

/**
 * The three principles, introduced as the page's spine.
 *
 * They are not section headings borrowed from a pitch deck — each one is
 * demonstrated somewhere below, and this block exists to say which is which before
 * the reader meets them. Stated as constraints rather than benefits, because that is
 * what they are: things the product is not allowed to do, which is why they hold.
 */
const PRINCIPLES = [
  {
    icon: Lock,
    name: 'Secure by default',
    constraint: 'Nothing to switch on.',
    body: 'Protection is active before the dashboard is opened for the first time. Turning a detector off is the action that requires a decision — not turning one on.',
    anchor: '#secure',
  },
  {
    icon: Layers,
    name: 'Simple by design',
    constraint: 'Nothing to learn.',
    body: 'No policy language, no rule builder, no console to sit watching. The entire configuration surface fits on one screen, and you can see all of it below.',
    anchor: '#simple',
  },
  {
    icon: ShieldOff,
    name: 'Privacy by architecture',
    constraint: 'Nothing to leak.',
    body: 'Detection runs on the device. The server never receives the text, the file, or a record of what anyone browsed — so there is nothing to breach, subpoena or resell.',
    anchor: '#privacy',
  },
]

export function PrinciplesIntro() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <section ref={ref} className="relative border-t border-line/60 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg-dim"
        >
          <span className="h-px w-6 bg-stamp/70" />
          Three constraints
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="display mt-6 max-w-[30ch] text-fg"
          style={{ fontSize: 'var(--text-display-sm)' }}
        >
          Everything here follows from three rules.
        </motion.h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.anchor}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.14 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-surface p-7 backdrop-blur-sm transition-colors hover:bg-surface-2 sm:p-8"
            >
              <p.icon className="size-5 text-fg-dim transition-colors group-hover:text-stamp" />

              <h3 className="mt-6 text-[1.05rem] font-medium text-fg">{p.name}</h3>

              {/* The constraint, set larger than the name: what the product refuses to
                  do is more informative than what it is called. */}
              <p
                className="display mt-3 text-fg-muted transition-colors group-hover:text-fg"
                style={{ fontSize: '1.35rem' }}
              >
                {p.constraint}
              </p>

              <p className="mt-5 text-[0.94rem] text-fg-muted">{p.body}</p>

              <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fg-dim transition-colors group-hover:text-stamp">
                shown below
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Simple by design — demonstrated by showing the whole thing.

   The claim is not "our interface is clean", which everybody says and nobody can
   check. It is that the entire configuration surface fits on one screen — so the
   honest way to show it is to put the entire configuration surface on one screen
   and let the reader count.

   The timer runs against a real installation, not an aspiration: nine minutes on
   one machine, most of it Windows copying files.
   --------------------------------------------------------------------------- */
const SETUP = [
  { at: 0, label: 'Sign up', detail: 'email, company name', dur: 40 },
  { at: 40, label: 'Download', detail: 'licence already inside the installer', dur: 25 },
  { at: 65, label: 'Run it', detail: 'Next, Finish — no questions asked', dur: 95 },
  { at: 160, label: 'Protected', detail: 'the first device reports in', dur: 0 },
]

const TOTAL = 160

export function SimpleByDesign() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-25%' })
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const started = performance.now()
    const tick = (now) => {
      // Compressed 12× so the whole thing plays in about thirteen seconds. The
      // labels state real durations, so the compression is a presentation choice
      // rather than a claim — nobody is being told setup takes ten seconds.
      const elapsed = ((now - started) / 1000) * 12
      setT(Math.min(TOTAL, elapsed))
      if (elapsed < TOTAL) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const mm = String(Math.floor(t / 60)).padStart(2, '0')
  const ss = String(Math.floor(t % 60)).padStart(2, '0')

  return (
    <section id="simple" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-fg-muted">
              <Layers className="size-4" />
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg-dim">
              Simple by design
            </span>
          </div>

          <h3
            className="display mt-7 max-w-[24ch] text-fg"
            style={{ fontSize: 'clamp(1.7rem,3vw,2.6rem)' }}
          >
            Under three minutes, and then nothing.
          </h3>

          <p className="mt-6 max-w-[52ch] text-fg-muted" style={{ fontSize: 'var(--text-lead)' }}>
            Enterprise data-loss tools are priced for the consultant who configures them.
            There is no rule language here to be configured wrongly, and no console anyone
            has to sit in front of — the product's normal state is silence, and it reaches
            you by email when that changes.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            <Fact n="9" label="switches, in total" />
            <Fact n="0" label="rules to write" />
            <Fact n="1" label="file to install" />
          </div>

          <p className="mt-6 max-w-[52ch] text-[0.92rem] text-fg-dim">
            Nine switches is the whole surface — you saw them a moment ago, all of them.
            Compare that with the products this replaces, where the policy editor alone is
            a week of training.
          </p>
        </div>

        {/* ---------- the clock ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
            style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
              first device, start to protected
            </span>
            <span className="font-mono text-[0.95rem] text-fg tnum">
              {mm}:{ss}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-5">
            {SETUP.map((s, i) => {
              const started = t >= s.at
              const done = s.dur === 0 ? t >= s.at : t >= s.at + s.dur
              const progress =
                s.dur === 0 ? (done ? 1 : 0) : Math.max(0, Math.min(1, (t - s.at) / s.dur))

              return (
                <div key={s.label} className="flex items-start gap-3.5 py-2.5">
                  <span
                    className={[
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
                      done
                        ? 'border-safe bg-safe/15 text-safe'
                        : started
                          ? 'border-line-bright bg-surface-2 text-fg'
                          : 'border-line text-fg-dim',
                    ].join(' ')}
                  >
                    {done ? (
                      <Check className="size-3" />
                    ) : (
                      <span className="font-mono text-[0.6rem] tnum">{i + 1}</span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span
                        className={[
                          'text-[0.98rem] transition-colors duration-500',
                          started ? 'text-fg' : 'text-fg-dim',
                        ].join(' ')}
                      >
                        {s.label}
                      </span>
                      {s.dur > 0 && (
                        <span className="shrink-0 font-mono text-[0.68rem] text-fg-dim tnum">
                          {s.dur}s
                        </span>
                      )}
                    </span>

                    <span className="mt-0.5 block text-[0.84rem] text-fg-muted">
                      {s.detail}
                    </span>

                    {s.dur > 0 && (
                      <span className="mt-2 block h-[3px] w-full overflow-hidden rounded-full bg-line">
                        <span
                          className="block h-full rounded-full bg-fg-muted transition-[width] duration-100"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="border-t border-line px-5 py-4">
            <p className="font-mono text-[0.72rem] text-fg-dim">
              measured on one machine · most of it is Windows copying files
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Fact({ n, label }) {
  return (
    <div className="bg-surface px-4 py-5 text-center">
      <div className="display text-fg tnum" style={{ fontSize: '1.9rem' }}>
        {n}
      </div>
      <div className="mt-1.5 text-[0.82rem] text-fg-muted">{label}</div>
    </div>
  )
}
