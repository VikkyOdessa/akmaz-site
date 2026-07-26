import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { Clipboard, Globe, Keyboard, HardDrive } from 'lucide-react'
import { Heading } from './Problem'

/**
 * Four channels, four sections, one idea each.
 *
 * Every block gets its own animation rather than a shared "card that fades in",
 * because the four things are genuinely different and a uniform treatment would
 * flatten that: a clipboard empties, a menu refuses to open, a sequence of
 * keystrokes is interrupted, a file is read before it is written. The visual
 * should be recognisable as the specific thing it describes.
 */
export default function Features() {
  return (
    <section id="watches" className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-32 sm:pt-44">
        <Heading
          eyebrow="What it watches"
          title="Four ways data walks out the door."
          lead="Not a threat catalogue — these are the routes ordinary leaks actually take. Detection runs on the computer itself; what reaches the server is a masked fragment and the fact it happened."
        />
      </div>

      <Panel
        index="01"
        icon={Clipboard}
        title="Clipboard"
        claim="Copy a card number and it is gone before it can be pasted."
        body="Card numbers, IBANs, Irish PPSNs, API keys and passwords. Anywhere the paste might have gone — a browser, a chat window, an AI assistant, an email to yourself — finds nothing waiting."
        visual={<ClipboardVisual />}
      />

      <Panel
        index="02"
        icon={Globe}
        title="Browser"
        claim="Select a client's details, right-click, and the menu does not open."
        body="Searching selected text is one keystroke away in every browser, and it sends that text to a third party. Akmaz's extension blocks the menu on a sensitive selection, and covers the shortcut and the address bar as well."
        reverse
        visual={<BrowserVisual />}
      />

      <Panel
        index="03"
        icon={Keyboard}
        title="Typing"
        claim="A card number entered by hand is caught mid-sequence."
        body="Some data never touches the clipboard — it is read aloud over the phone and typed straight into the wrong field."
        note="Off by default. Germany, Portugal, the Netherlands and Finland restrict keystroke capture, and Austria, France, Sweden and the Netherlands require agreement with employee representatives first. Enabling it is a decision, not a setting."
        visual={<TypingVisual />}
      />

      <Panel
        index="04"
        icon={HardDrive}
        title="Files and removable media"
        claim="A spreadsheet is judged by what is inside it, not by which port it went through."
        body="Blocking USB ports is free with Windows and useless in practice — staff need the stick for the things it is for. Akmaz reads the file as it is written and stops the one that holds four hundred client records."
        reverse
        visual={<FileVisual />}
      />
    </section>
  )
}

/* ---------------------------------------------------------------------------
   Layout shell. min-h-svh, not 100vh: on mobile Safari the toolbar makes 100vh
   larger than the visible area, so full-height sections quietly overflow.
   --------------------------------------------------------------------------- */
function Panel({ index, icon: Icon, title, claim, body, note, visual, reverse }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-25% 0px -25% 0px' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // A small counter-drift on the visual against the text. Enough to feel like two
  // planes, not enough to notice as an effect.
  const visualY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <div ref={ref} className="flex min-h-svh items-center border-t border-line/60 py-24">
      <div
        className={[
          'mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:gap-20',
          'lg:grid-cols-2',
        ].join(' ')}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={reverse ? 'lg:order-2' : ''}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-fg-muted">
              <Icon className="size-4" />
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fg-dim tnum">
              {index} · {title}
            </span>
          </div>

          <h3 className="display mt-7 max-w-[22ch] text-fg" style={{ fontSize: 'clamp(1.7rem,3vw,2.6rem)' }}>
            {claim}
          </h3>

          <p className="mt-6 max-w-[52ch] text-fg-muted" style={{ fontSize: 'var(--text-lead)' }}>
            {body}
          </p>

          {note && (
            <p className="mt-6 max-w-[52ch] border-l-2 border-stamp/40 pl-4 text-[0.92rem] text-fg-dim">
              {note}
            </p>
          )}
        </motion.div>

        <motion.div style={{ y: visualY }} className={reverse ? 'lg:order-1' : ''}>
          {visual}
        </motion.div>
      </div>
    </div>
  )
}

function Frame({ children, label }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface"
        style={{ boxShadow: 'var(--shadow-card)' }}>
      {label && (
        <div className="border-b border-line px-4 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-fg-dim">
          {label}
        </div>
      )}
      <div className="relative p-6 sm:p-8">{children}</div>
    </div>
  )
}

/* ---------- 01 clipboard: the characters are removed one by one ---------- */
function ClipboardVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30%' })
  const digits = '4111 1111 1111 1111'.split('')

  return (
    <div ref={ref}>
      <Frame label="clipboard contents">
        <div className="font-mono text-[1.15rem] sm:text-[1.4rem]">
          {digits.map((c, i) => {
            // The last four survive; everything before them is deleted from the end
            // inwards, which is how the masked form actually comes about.
            const kept = i >= digits.length - 4
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1 }}
                animate={inView && !kept ? { opacity: 0, y: -6, filter: 'blur(3px)' } : {}}
                transition={{
                  duration: 0.35,
                  delay: inView ? 0.5 + (digits.length - 1 - i) * 0.035 : 0,
                  ease: 'easeOut',
                }}
                className={kept ? 'text-fg' : 'text-fg-muted'}
              >
                {c === ' ' ? '\u00A0' : c}
              </motion.span>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.25, duration: 0.5 }}
          className="mt-5 font-mono text-[1.15rem] text-stamp sm:text-[1.4rem]"
        >
          ****1111
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-3 font-mono text-[0.75rem] text-safe"
        >
          19 characters removed · 0 sent
        </motion.div>
      </Frame>
    </div>
  )
}

/* ---------- 02 browser: the context menu is struck through ---------- */
function BrowserVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30%' })

  const items = [
    { t: 'Copy', dim: true },
    { t: 'Search Google for "4111 1111 1111 1111"', blocked: true },
    { t: 'Print…', dim: true },
    { t: 'Inspect', dim: true },
  ]

  return (
    <div ref={ref}>
      <Frame label="right-click on a selection">
        <div className="mb-5 font-mono text-[0.95rem]">
          <span className="rounded bg-stamp/20 px-1 text-fg">4111 1111 1111 1111</span>
        </div>

        <div className="w-full max-w-[22rem] overflow-hidden rounded-lg border border-line-bright bg-surface-2">
          {items.map((it, i) => (
            <motion.div
              key={it.t}
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
              className={[
                'relative flex items-center justify-between gap-3 px-3.5 py-2.5 text-[0.88rem]',
                i > 0 ? 'border-t border-line' : '',
                it.blocked ? 'text-fg-dim' : 'text-fg-muted',
              ].join(' ')}
            >
              <span className="truncate">{it.t}</span>
              {it.blocked && (
                <>
                  {/* The strike is drawn across the item, so the refusal is shown
                      happening rather than stated in a caption. */}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-3 top-1/2 h-[1.5px] origin-left bg-stamp"
                  />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.45 }}
                    className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-stamp"
                  >
                    blocked
                  </motion.span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </Frame>
    </div>
  )
}

/* ---------- 03 typing: the sequence is interrupted mid-keystroke ---------- */
function TypingVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30%' })
  const typed = '4111 1111 1111 1'

  return (
    <div ref={ref}>
      <Frame label="keystroke sequence">
        <div className="font-mono text-[1.15rem] sm:text-[1.35rem]">
          {typed.split('').map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.05, delay: 0.35 + i * 0.075 }}
              className="text-fg-muted"
            >
              {c === ' ' ? '\u00A0' : c}
            </motion.span>
          ))}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] bg-stamp"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.65, duration: 0.5 }}
          className="mt-6 flex items-center gap-2.5"
        >
          <span className="size-1.5 rounded-full bg-stamp" />
          <span className="font-mono text-[0.78rem] text-stamp">
            interrupted at character 16 of 19
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.9, duration: 0.5 }}
          className="mt-2 font-mono text-[0.72rem] text-fg-dim"
        >
          the full number was never assembled
        </motion.div>
      </Frame>
    </div>
  )
}

/* ---------- 04 files: the file is read, then refused ---------- */
function FileVisual() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30%' })

  return (
    <div ref={ref}>
      <Frame label="copy to E:\ (removable)">
        <div className="flex items-baseline justify-between gap-4 font-mono">
          <span className="truncate text-[0.98rem] text-fg">clients-2026.xlsx</span>
          <span className="shrink-0 text-[0.78rem] text-fg-dim tnum">1.2 MB</span>
        </div>

        {/* The bar advances, then stops. The transfer is refused after inspection,
            not before it — which is the whole distinction from blocking the port. */}
        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-line">
          <motion.div
            initial={{ width: '0%' }}
            animate={inView ? { width: '38%' } : {}}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 }}
            className="h-full rounded-full bg-fg-muted"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.45 }}
          className="mt-5 space-y-1.5 font-mono text-[0.78rem]"
        >
          <div className="text-fg-muted">inspected: 412 rows</div>
          <div className="text-stamp">found: 380 card numbers, 412 names</div>
          <div className="text-fg-dim">transfer refused · file did not leave the machine</div>
        </motion.div>
      </Frame>
    </div>
  )
}
