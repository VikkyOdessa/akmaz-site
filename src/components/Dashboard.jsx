import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { Activity, Monitor, ShieldAlert, Wifi, WifiOff } from 'lucide-react'
import { Heading } from './Problem'

/**
 * The dashboard, running rather than screenshotted.
 *
 * A screenshot of a console says "this exists". A console that ticks says "this is
 * what Thursday afternoon looks like" — and it is the honest way to show a product
 * whose normal state is *quiet*. Most of what an owner sees is three devices
 * reporting in and nothing happening, which no marketing screenshot ever conveys
 * because an empty table looks like a broken feature.
 *
 * Everything here is synthetic and labelled as such. Showing invented figures as if
 * they were a customer's would be exactly the sort of small dishonesty this page is
 * built to avoid.
 */

const DEVICES = [
  { name: 'RECEPTION-PC', user: 'Aoife', state: 'online' },
  { name: 'ACC-LAPTOP-02', user: 'Cian', state: 'online' },
  { name: 'BACKOFFICE-PC', user: 'Niamh', state: 'silent' },
]

/* A plausible afternoon: one real block, one near-miss correctly ignored, one
   routine check-in. The ratio matters — a feed of nonstop CRITICAL events would be
   a fantasy, and any owner who has run a business would know it. */
const FEED = [
  {
    at: '14:02',
    device: 'RECEPTION-PC',
    kind: 'critical',
    text: 'Payment card blocked — clipboard',
    detail: '****1111 · cleared before paste',
  },
  {
    at: '13:47',
    device: 'ACC-LAPTOP-02',
    kind: 'info',
    text: 'Order reference ignored',
    detail: 'right length, labelled "order ref" — not a card',
  },
  {
    at: '11:20',
    device: 'RECEPTION-PC',
    kind: 'warning',
    text: 'PPSN blocked — browser search',
    detail: '****4567 · context menu refused',
  },
  {
    at: '09:15',
    device: 'BACKOFFICE-PC',
    kind: 'info',
    text: 'Policy applied',
    detail: '8 detectors active · enforce mode',
  },
]

export default function Dashboard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="dashboard" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <Heading
          eyebrow="What you actually look at"
          title="Most days, it should be boring."
          lead="Three machines reporting in, and nothing happening. That is a working week — and the reason the interface is built around an email rather than a console you have to watch."
        />

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface/80 backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
                Akmaz · Byrne &amp; Co
              </span>
              <Heartbeat active={inView} />
            </div>
            <span className="font-mono text-[0.66rem] text-fg-dim">
              illustrative data
            </span>
          </div>

          <div className="grid gap-px bg-line sm:grid-cols-3">
            <Counter label="Blocked this month" to={14} active={inView} tone="stamp" />
            <Counter label="Ignored correctly" to={216} active={inView} tone="safe" suffix="" />
            <Counter label="Devices protected" to={3} active={inView} tone="fg" />
          </div>

          <div className="grid gap-px bg-line lg:grid-cols-[0.8fr_1.2fr]">
            {/* ---------- devices ---------- */}
            <div className="bg-surface p-5">
              <div className="mb-4 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
                <Monitor className="size-3.5" />
                devices
              </div>
              <div className="flex flex-col gap-2.5">
                {DEVICES.map((d, i) => (
                  <DeviceRow key={d.name} device={d} index={i} active={inView} />
                ))}
              </div>
              <p className="mt-4 border-t border-line pt-3.5 font-mono text-[0.68rem] text-fg-dim">
                a machine that has not checked in for 12 hours is flagged, not assumed fine
              </p>
            </div>

            {/* ---------- feed ---------- */}
            <div className="bg-surface p-5">
              <div className="mb-4 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
                <Activity className="size-3.5" />
                today
              </div>
              <div className="flex flex-col">
                {FEED.map((e, i) => (
                  <FeedRow key={e.at} event={e} index={i} active={inView} />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-line px-5 py-4">
            <p className="max-w-[70ch] text-[0.9rem] text-fg-muted">
              The second counter is the one that decides whether a tool survives. Two
              hundred and sixteen long numbers were examined and correctly left alone —
              order references, tracking numbers, invoice IDs. A product that flags those
              gets switched off in the second week, and then protects nothing at all.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- heartbeat: a pulse tied to nothing but time ---------- */
function Heartbeat({ active }) {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    if (!active) return
    // 4s matches the agent's real polling interval. Picking a prettier number would
    // make the animation lie about the product in a small, pointless way.
    const t = setInterval(() => setBeat((b) => b + 1), 4000)
    return () => clearInterval(t)
  }, [active])

  return (
    <span className="flex items-center gap-1.5">
      <span className="relative flex size-1.5">
        <AnimatePresence>
          <motion.span
            key={beat}
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 3.2 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-safe"
          />
        </AnimatePresence>
        <span className="relative size-1.5 rounded-full bg-safe" />
      </span>
      <span className="font-mono text-[0.64rem] text-fg-dim">live</span>
    </span>
  )
}

/* ---------- counters that count ---------- */
function Counter({ label, to, active, tone, suffix = '' }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf
    const started = performance.now()
    const duration = 1400
    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration)
      // Ease-out cubic: fast at the start, settling at the end. A linear count reads
      // as a loading bar rather than a figure arriving.
      setN(Math.round(to * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, to])

  return (
    <div className="bg-surface px-5 py-6">
      <div
        className={[
          'display tnum',
          tone === 'stamp' ? 'text-stamp' : tone === 'safe' ? 'text-safe' : 'text-fg',
        ].join(' ')}
        style={{ fontSize: 'clamp(1.9rem,3.2vw,2.6rem)' }}
      >
        {n}
        {suffix}
      </div>
      <div className="mt-2 text-[0.88rem] text-fg-muted">{label}</div>
    </div>
  )
}

function DeviceRow({ device, index, active }) {
  const online = device.state === 'online'
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="flex items-center justify-between gap-3 rounded-lg border border-line bg-void/40 px-3.5 py-2.5"
    >
      <span className="min-w-0">
        <span className="block truncate font-mono text-[0.84rem] text-fg">{device.name}</span>
        <span className="block text-[0.74rem] text-fg-dim">{device.user}</span>
      </span>
      <span
        className={[
          'flex shrink-0 items-center gap-1.5 font-mono text-[0.68rem]',
          online ? 'text-safe' : 'text-fg-dim',
        ].join(' ')}
      >
        {online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
        {online ? 'online' : 'silent 14h'}
      </span>
    </motion.div>
  )
}

function FeedRow({ event, index, active }) {
  const tone =
    event.kind === 'critical'
      ? 'text-stamp border-stamp/40'
      : event.kind === 'warning'
        ? 'text-fg border-line-bright'
        : 'text-fg-muted border-line'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.11 }}
      className={[
        'flex items-start gap-3.5 border-l-2 py-3 pl-4',
        tone.split(' ')[1],
      ].join(' ')}
    >
      <span className="mt-0.5 shrink-0 font-mono text-[0.7rem] text-fg-dim tnum">
        {event.at}
      </span>
      <span className="min-w-0">
        <span className={['block text-[0.92rem]', tone.split(' ')[0]].join(' ')}>
          {event.text}
        </span>
        <span className="mt-0.5 block font-mono text-[0.72rem] text-fg-dim">
          {event.detail}
        </span>
        <span className="mt-1 block font-mono text-[0.68rem] text-fg-dim/70">
          {event.device}
        </span>
      </span>
      {event.kind === 'critical' && (
        <ShieldAlert className="ml-auto mt-0.5 size-3.5 shrink-0 text-stamp" />
      )}
    </motion.div>
  )
}
