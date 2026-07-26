import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'

/* The scene, broken into beats. Told as a sequence because that is what it is —
   a Thursday evening with an ordinary decision in the middle of it — and because
   a paragraph of prose gives the reader nothing to scroll through. The turn is
   marked in data rather than styled by hand, so the emphasis stays consistent. */
const BEATS = [
  {
    time: '17:38',
    text: 'A client rings about a payment that has not cleared. The file is on the office machine, and the office is closing.',
  },
  {
    time: '17:40',
    text: 'She copies the client details into an email to herself, so she can finish the job properly at home.',
  },
  {
    time: '21:15',
    text: 'The query is answered from the kitchen table. The client is happy. Nobody was careless in a way she would recognise as careless.',
  },
  {
    time: 'and now',
    text: 'A client card number sits in a personal mailbox, outside every control the practice has — and will stay there for years.',
    turn: true,
  },
  {
    time: '6 weeks later',
    text: "An insurer's questionnaire asks what prevents exactly this. Somebody has to answer it honestly.",
  },
]

const STAKES = [
  {
    figure: '60%',
    body: 'of small firms do not survive six months after a serious data breach.',
  },
  {
    figure: 'Personally liable',
    small: true,
    body: 'Under NIS2, now Irish law, a director can be held responsible — up to temporary removal from the role.',
  },
  {
    figure: 'No exemption',
    small: true,
    body: 'GDPR never had a small-business carve-out, and Ireland’s DPC is among Europe’s most active regulators.',
  },
]

export default function Problem() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // The vertical rule draws itself as the section passes, so the timeline reads as
  // time advancing rather than as a decorative line that was always there.
  const lineHeight = useTransform(scrollYProgress, [0.12, 0.62], ['0%', '100%'])

  return (
    <section id="how" ref={ref} className="relative py-32 sm:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <Heading
          eyebrow="How it actually happens"
          title={<>Nobody meant any harm.<br />That is the problem.</>}
          lead="Data-loss products are sold against intruders. The leaks that close small firms look nothing like an intrusion — they look like a good employee solving a problem after hours."
        />

        {/* ---------- the timeline ---------- */}
        <div className="relative mt-20 pl-8 sm:pl-14">
          <div className="absolute left-0 top-2 h-full w-px bg-line sm:left-1.5">
            <motion.div
              style={{ height: lineHeight }}
              className="w-px origin-top bg-gradient-to-b from-fg-dim via-stamp/70 to-stamp"
            />
          </div>

          <div className="flex flex-col gap-12 sm:gap-14">
            {BEATS.map((b, i) => (
              <Beat key={b.time} beat={b} index={i} />
            ))}
          </div>
        </div>

        {/* ---------- the stakes ---------- */}
        <div className="mt-28 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {STAKES.map((s, i) => (
            <Stake key={s.figure} stake={s} index={i} />
          ))}
        </div>

        <p className="mt-8 max-w-[62ch] text-[0.95rem] text-fg-dim">
          Figures worth re-checking before you rely on them — regulation moves, and a page
          that quotes a stale deadline undermines its own argument.
        </p>
      </div>
    </section>
  )
}

function Beat({ beat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -18 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.04 * index }}
      className="relative"
    >
      {/* The marker sits on the rule. It fills in when the beat arrives — the dot
          and the line are one object, not a bullet next to a border. */}
      <span
        className={[
          'absolute -left-8 top-2 size-2.5 rounded-full border-2 transition-colors duration-700 sm:-left-[3.35rem]',
          inView
            ? beat.turn
              ? 'border-stamp bg-stamp'
              : 'border-fg-dim bg-void'
            : 'border-line bg-void',
        ].join(' ')}
      />
      <div className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fg-dim tnum">
        {beat.time}
      </div>
      <p
        className={[
          'mt-2.5 max-w-[58ch] text-[1.06rem] leading-relaxed sm:text-[1.15rem]',
          beat.turn ? 'text-fg' : 'text-fg-muted',
        ].join(' ')}
      >
        {beat.text}
      </p>
    </motion.div>
  )
}

function Stake({ stake, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.09 * index }}
      className="bg-surface/70 p-7 backdrop-blur-sm sm:p-8"
    >
      <div
        className={[
          'display text-fg',
          stake.small ? 'text-[1.5rem] leading-tight' : 'text-[2.6rem] tnum',
        ].join(' ')}
      >
        {stake.figure}
      </div>
      <p className="mt-4 text-[0.95rem] text-fg-muted">{stake.body}</p>
    </motion.div>
  )
}

/* Shared section heading. Extracted because four more sections need exactly this
   shape, and three of them will otherwise be typed slightly differently. */
export function Heading({ eyebrow, title, lead, align = 'left' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-18%' })

  return (
    <div ref={ref} className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={[
          'flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg-dim',
          align === 'center' ? 'justify-center' : '',
        ].join(' ')}
      >
        <span className="h-px w-6 bg-stamp/70" />
        {eyebrow}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        className="display mt-6 text-fg"
        style={{ fontSize: 'var(--text-display-sm)' }}
      >
        {title}
      </motion.h2>

      {lead && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          className={[
            'mt-6 text-fg-muted',
            align === 'center' ? 'mx-auto max-w-[58ch]' : 'max-w-[58ch]',
          ].join(' ')}
          style={{ fontSize: 'var(--text-lead)' }}
        >
          {lead}
        </motion.p>
      )}
    </div>
  )
}
