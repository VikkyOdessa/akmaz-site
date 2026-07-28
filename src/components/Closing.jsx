import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { Minus, Plus, ArrowUpRight } from 'lucide-react'
import { Heading } from './Problem'
import { SIGNUP, LOGIN } from '../lib/urls'


/* ---------------------------------------------------------------------------
   Honest limits.

   Unusual for the category and kept deliberately. The buyer is a non-technical
   owner who is already braced to be oversold; naming the boundary before she finds
   it is the strongest trust signal available, and it costs nothing that was ever
   deliverable. Given the same visual weight as the features — a limitation in
   small grey print reads as something being hidden.
   --------------------------------------------------------------------------- */
const LIMITS = [
  {
    head: 'It will not stop someone determined',
    body: 'A photograph of the screen, a number written on paper, a file encrypted before it moves — no data-loss product prevents any of those, whatever the brochure says. Akmaz catches carelessness and habit, which is where the overwhelming majority of real leaks come from.',
  },
  {
    head: 'It protects the machines it is installed on',
    body: 'A personal phone, a home laptop, a tablet outside your control are not covered. That needs a different class of product, and anyone claiming one tool does both is selling you two things badly.',
  },
  {
    head: 'Windows only',
    body: 'Not macOS, not Linux. macOS requires explicit user consent for each resource an agent touches and blocks the deeper access outright — doing it properly is a project of its own, and doing it badly would be worse than not doing it.',
  },
  {
    head: 'It is not a compliance certificate',
    body: 'It gives you a control you can show an auditor and a record of what happened. Deciding what you must do, writing it down, and telling your staff remains yours.',
  },
  {
    head: 'Suppression cuts both ways',
    body: 'To avoid flagging every order reference, Akmaz ignores long numbers sitting next to words like "invoice" or "tracking". A genuine card number in an invoice line is therefore let through. The alternative — demanding the word "card" nearby — was measured and misses far more, because most copies carry no label at all.',
  },
]

export function Limits() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section id="limits" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <Heading
          eyebrow="Honest limits"
          title="What Akmaz does not do."
          lead="Every product in this category has a boundary. Most keep it in a datasheet footnote. Ours is here, at the same size as everything else, because you will find it eventually and it should not come as a surprise."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {LIMITS.map((l, i) => (
            <motion.div
              key={l.head}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'bg-surface p-7 backdrop-blur-sm sm:p-8',
                // The last card spans both columns when the count is odd, so the grid
                // does not end on a half-empty row.
                i === LIMITS.length - 1 && LIMITS.length % 2 === 1 ? 'sm:col-span-2' : '',
              ].join(' ')}
            >
              <h3 className="flex items-start gap-3 text-[1.05rem] font-medium text-fg">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-stamp" />
                {l.head}
              </h3>
              <p className="mt-4 pl-7 text-[0.95rem] text-fg-muted">{l.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 max-w-[64ch] text-[1.05rem] text-fg"
        >
          If a vendor tells you their product stops every leak, ask how it handles a phone
          camera. The answer is the same as ours — they just have not written it down.
        </motion.p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Pricing during early access.

   No figure is invented. The product is unfinished, the price is genuinely not
   settled, and publishing a number now would either be a guess presented as a fact
   or a discount from a list price that does not exist. Saying so plainly is both
   more honest and more attractive to the only customers worth having at this stage:
   the ones who want influence over what gets built.
   --------------------------------------------------------------------------- */
export function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section id="pricing" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto max-w-6xl px-6">
        <Heading
          eyebrow="Pricing"
          title="Free while it is early access."
          lead="Not a promotion, and not a discount from a list price — there is no list price yet. Akmaz is in active development, and what it should cost will be worked out with the people using it."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div className="border-b border-line px-7 py-6 text-center sm:px-9">
            <span className="pill">early access</span>
            <div className="display mt-6 text-fg" style={{ fontSize: 'clamp(2.6rem,6vw,4rem)' }}>
              €0
            </div>
            <p className="mt-3 text-fg-muted">
              for as long as it stays in early access
            </p>
          </div>

          <ul className="divide-y divide-line">
            {[
              ['Every detector', 'nothing held back for a higher tier'],
              ['As many devices as you have', 'no per-seat counting while we are testing'],
              ['Direct access to whoever built it', 'not a ticket queue'],
              ['A say in what gets built next', 'the reason early access is worth anything'],
              ['A fixed price when it settles', 'you will be told before anything changes'],
            ].map(([head, sub]) => (
              <li key={head} className="flex items-start gap-3.5 px-7 py-4 sm:px-9">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-safe" />
                <span>
                  <span className="block text-[0.98rem] text-fg">{head}</span>
                  <span className="mt-0.5 block text-[0.88rem] text-fg-muted">{sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-line px-7 py-6 sm:px-9">
            <a
              href={SIGNUP}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-fg px-6 py-3.5 font-medium text-void transition-transform duration-300 hover:scale-[1.015]"
            >
              Start now
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-4 text-center font-mono text-[0.72rem] text-fg-dim">
              no card · no call · uninstall removes everything
            </p>
          </div>
        </motion.div>

        <p className="mx-auto mt-10 max-w-[58ch] text-center text-[0.92rem] text-fg-dim">
          For reference, comparable products sit between €4 and €12 per device per month,
          usually with a minimum seat count and an onboarding fee. Whatever Akmaz costs
          will be below that, and it will be one number rather than three tiers.
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   FAQ.

   These are real objections, in the words they were actually put in — including the
   ones that are hardest to answer. An FAQ made of soft questions is recognisable
   immediately and does the opposite of what it is for.
   --------------------------------------------------------------------------- */
const FAQ = [
  {
    q: 'Cannot someone just get around this?',
    a: 'Yes, if they want to. Base64-encode the data, photograph the screen, write the number on paper — a determined insider defeats every product in this category, and any vendor who says otherwise has not measured it. What Akmaz stops is the ordinary case: a helpful employee, an end of day, a copy-paste that was never meant to be a breach.',
  },
  {
    q: 'Will it flag our order references and invoice numbers?',
    a: 'No — and this is the part that decides whether a tool survives contact with an accounts department. Every candidate is checksum-verified, so a tracking number of the same length is not a card. Long numbers next to words like "order" or "tracking" are ignored outright. Measured on two hundred realistic business documents: zero false alerts.',
  },
  {
    q: 'Is this legal? We are watching what staff copy.',
    a: 'Under GDPR the lawful basis is legitimate interest, not consent — employee consent is not considered freely given. A DPIA is required, staff must be told in advance, and some countries add their own rules. Keystroke capture in particular is prohibited in Germany, Portugal, the Netherlands and Finland, which is why it ships switched off. Akmaz collects the minimum that makes the control work, which is what makes the assessment straightforward rather than difficult.',
  },
  {
    q: 'What does your server actually see?',
    a: 'A masked fragment — ****1111 — the type of finding, the time, and which machine. Not the text, not the file, not the file name, and no record of which sites anyone visited. You can verify the principle yourself in the demo above: type into it and watch the network tab stay empty.',
  },
  {
    q: 'Who is behind it?',
    a: 'One engineer, in Ireland, building it in the open. That is the reason for early access pricing and the reason the limitations are written down — a small product cannot afford the gap between what it promises and what it does.',
  },
  {
    q: 'What happens when the trial ends?',
    a: 'While Akmaz is in early access, nothing. When there is a price you will be told first, and the figure you are given will not move afterwards. Uninstalling removes the agent, the configuration and the local key.',
  },
  {
    q: 'Does it slow the computer down?',
    a: 'Detection is pattern matching plus a checksum, measured in microseconds, and runs when the clipboard changes rather than continuously. The heaviest case measured is a 1.6 MB clipboard — a web page with embedded images — at roughly a third of a second, once.',
  },
  {
    q: 'How do we roll it out to twenty machines?',
    a: 'Through Group Policy or Intune, the same way as any other agent: the installer takes command-line arguments, so nobody has to touch each machine. The browser extension can be force-installed at the same time, which also means staff cannot remove it.',
  },
]

export function Faq() {
  const [open, setOpen] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section id="faq" ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
      <div className="mx-auto max-w-4xl px-6">
        <Heading
          eyebrow="Questions"
          title="The awkward ones first."
          lead="These were asked by people who were not trying to be kind about it."
        />

        <div className="mt-14 divide-y divide-line border-y border-line">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.04 * i }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-fg"
                >
                  <span
                    className={[
                      'text-[1.05rem] transition-colors sm:text-[1.12rem]',
                      isOpen ? 'text-fg' : 'text-fg-muted',
                    ].join(' ')}
                  >
                    {item.q}
                  </span>
                  <span
                    className={[
                      'mt-1 shrink-0 transition-colors',
                      isOpen ? 'text-stamp' : 'text-fg-dim',
                    ].join(' ')}
                  >
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[68ch] pb-6 pr-10 text-[0.98rem] leading-relaxed text-fg-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Footer, with the closing call above it.
   --------------------------------------------------------------------------- */
export function Footer() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <>
      <section ref={ref} className="relative border-t border-line/60 py-32 sm:py-44">
        {/* One warm light behind the last thing on the page. The only place a glow is
            allowed to be decorative, because there is nothing left to report. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
          style={{
            background:
              'radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in oklab, var(--color-stamp) 5%, transparent), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="display mx-auto max-w-[24ch] text-fg"
            style={{ fontSize: 'var(--text-display)' }}
          >
            One installer. Ten minutes.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto mt-7 max-w-[48ch] text-fg-muted"
            style={{ fontSize: 'var(--text-lead)' }}
          >
            Then the next time somebody copies a client's card number at twenty to six, it
            simply does not go anywhere.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-11 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href={SIGNUP}
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-7 py-4 font-medium text-void transition-transform duration-300 hover:scale-[1.02]"
            >
              Start free
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={LOGIN}
              className="inline-flex items-center rounded-full border border-line-bright px-7 py-4 text-fg-muted transition-colors hover:border-fg/40 hover:text-fg"
            >
              Sign in
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="relative border-t border-line bg-surface/40 py-14 backdrop-blur-sm">
        {/* A grid that fades out, echoing the one behind the hero: the page closes on
            the same surface it opened on. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-baseline gap-2 text-[1.15rem] font-semibold tracking-tight">
                akmaz<span className="text-stamp">.</span>
              </div>
              <p className="mt-3 max-w-[26ch] text-[0.88rem] text-fg-muted">
                Endpoint data-loss prevention for small businesses. Built in Ireland,
                hosted in the EU.
              </p>
              <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
                early access
              </p>
            </div>

            <FooterCol
              title="Product"
              links={[
                ['How it happens', '#how'],
                ['What it watches', '#watches'],
                ['Try the detector', '#privacy'],
                ['Dashboard', '#dashboard'],
              ]}
            />
            <FooterCol
              title="Before you decide"
              links={[
                ['Honest limits', '#limits'],
                ['Pricing', '#pricing'],
                ['Questions', '#faq'],
              ]}
            />
            <FooterCol
              title="Start"
              links={[
                ['Free trial', SIGNUP],
                ['Sign in', LOGIN],
              ]}
            />
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[0.72rem] text-fg-dim">
              © {new Date().getFullYear()} Akmaz · GDPR · NIS2 · EU-hosted
            </p>
            <p className="font-mono text-[0.72rem] text-fg-dim">
              in active development — protection is real, edges are rough
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-fg-dim">
        {title}
      </h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[0.9rem] text-fg-muted transition-colors hover:text-fg"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
