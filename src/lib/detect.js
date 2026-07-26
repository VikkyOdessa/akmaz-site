/**
 * A working detector, running in the reader's browser.
 *
 * This exists so the privacy claim can be demonstrated rather than asserted. The
 * visitor types something into the page; detection happens here, in their own tab;
 * and the panel beside it shows exactly what would have reached a server. Nothing
 * is sent — which is the point, and is verifiable by opening the network tab.
 *
 * Deliberately a subset of the product's detectors. Cards and IBANs use published
 * algorithms (Luhn is on Wikipedia, the test numbers are published by the card
 * schemes), so demonstrating them gives nothing away. The full pattern set, and
 * especially the negative-context rules that keep false positives near zero, are
 * not published: a page explaining precisely which separators are tolerated is a
 * map for getting around them.
 */

/** Luhn checksum — the reason a tracking number of the same length is not a card. */
export function luhn(digits) {
  const d = digits.replace(/\D/g, '')
  if (d.length < 13 || d.length > 19) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i])
    if (i % 2 === 1) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}

/** IBAN mod-97, the standard's own check. */
export function ibanValid(raw) {
  const s = raw.replace(/[\s-]/g, '').toUpperCase()
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false
  const moved = s.slice(4) + s.slice(0, 4)
  const numeric = moved.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))
  // Chunked because a 30-digit IBAN exceeds Number.MAX_SAFE_INTEGER; taking the
  // remainder in pieces is exact where parseInt would silently round.
  let rem = 0
  for (const ch of numeric) rem = (rem * 10 + Number(ch)) % 97
  return rem === 1
}

/** Irish PPSN: seven digits, then a check letter derived from weighted digits. */
export function ppsnValid(raw) {
  const s = raw.replace(/\s/g, '').toUpperCase()
  if (!/^\d{7}[A-W][A-W]?$/.test(s)) return false
  const alphabet = 'WABCDEFGHIJKLMNOPQRSTUV'
  const weights = [8, 7, 6, 5, 4, 3, 2]
  let total = 0
  for (let i = 0; i < 7; i++) total += Number(s[i]) * weights[i]
  if (s.length === 9) total += (s.charCodeAt(8) - 64) * 9
  return alphabet[total % 23] === s[7]
}

/* Separators a real copy actually contains. Newlines matter most: pasting a column
   out of a spreadsheet produces "4111\n1111\n1111\n1111", and a pattern that only
   tolerates spaces and hyphens misses the bulk-export case entirely. */
const SEP = '(?:\\r\\n|[ \\-.\\u00A0_/\\n\\r\\t])?'
const CARD = new RegExp(`(?<![0-9A-Za-z])(?:\\d${SEP}){12,18}\\d(?![0-9A-Za-z])`, 'g')
const IBAN = /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{2,4}){2,8}\b/g
const PPSN = /\b\d{7}[A-W][A-W]?\b/g
const SECRET = /\b(?:sk-[A-Za-z0-9-]{16,}|AKIA[A-Z0-9]{16}|ghp_[A-Za-z0-9]{20,})\b/g
/* The name is allowed to carry a prefix: DB_PASSWORD, app.apiKey, STRIPE_SECRET.
   A lookbehind excluding word characters rejected all of them — every realistic
   variable name, in other words, which is the sort of pattern that passes a quick
   test on "password=x" and finds nothing in a real config file. */
const ASSIGNED_SECRET =
  /(?:^|[\s;,{["'`])[\w.-]*(?:password|passwd|pwd|api[_-]?key|apikey|secret|token|credential)\s*[:=]\s*["'`]?([^\s"'`;,}]{8,})/gi

/* Words that mean "this long number is an identifier, not a card". A card is very
   often copied bare, so requiring a nearby "card" or "CVV" would miss most real
   leaks — but an order or tracking number practically never appears without its
   label. Suppressing on the label rather than demanding one is what keeps false
   positives near zero, and it is the difference between a tool an accountant keeps
   and one she switches off in week two. */
const ANTI = ['order', 'ref', 'tracking', 'invoice', 'shipment', 'ticket', 'awb',
              'parcel', 'consignment', 'waybill']
const ANTI_WINDOW = 28

/* Known trade-off, worth stating rather than hiding: suppression cuts both ways.
   "invoice 4111 1111 1111 1111" is a real card next to an anti-word, and it will be
   let through. The alternative — demanding a positive marker like "card" or "CVV" —
   was measured and is worse: most real copies carry no marker at all, so the gate
   misses the majority of leaks instead of a narrow slice of them. Narrowing the
   window and weighting individual words is the improvement; removing suppression is
   not. */
function suppressedByContext(text, index, length) {
  const from = Math.max(0, index - ANTI_WINDOW)
  const to = Math.min(text.length, index + length + ANTI_WINDOW)
  const context = text.slice(from, to).toLowerCase()
  return ANTI.some((w) => context.includes(w))
}

/** Mask a value the way the agent does: last four kept, the rest gone. */
export function mask(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 4) return '*'.repeat(Math.max(4, digits.length - 4)) + digits.slice(-4)
  return '*'.repeat(Math.max(4, value.length))
}

/**
 * Findings for a piece of text.
 *
 * Returns what the agent would report — a type, a masked fragment, and the reason
 * it was certain — never the value itself. The shape of the return is the shape of
 * what the product transmits, which is why the demo can double as the privacy
 * explanation: there is nothing in here to leak.
 */
export function analyse(text) {
  if (!text?.trim()) return []
  const found = []
  const seen = new Set()

  const push = (type, raw, why, severity = 'critical') => {
    const m = mask(raw)
    const id = `${type}:${m}`
    if (seen.has(id)) return
    seen.add(id)
    found.push({ type, masked: m, why, severity })
  }

  for (const match of text.matchAll(CARD)) {
    const digits = match[0].replace(/\D/g, '')
    if (digits.length < 13 || digits.length > 19) continue
    if (suppressedByContext(text, match.index, match[0].length)) continue
    if (luhn(digits)) push('Payment card', digits, 'Luhn checksum valid')
    else push('Possible card', digits, 'right shape, checksum fails', 'warning')
  }

  for (const match of text.matchAll(IBAN)) {
    if (ibanValid(match[0])) push('IBAN', match[0].replace(/\s/g, ''), 'mod-97 check valid')
  }

  for (const match of text.matchAll(PPSN)) {
    if (ppsnValid(match[0])) push('PPSN (Ireland)', match[0], 'check letter valid')
  }

  for (const match of text.matchAll(SECRET)) {
    push('API key', match[0], 'known provider prefix')
  }

  for (const match of text.matchAll(ASSIGNED_SECRET)) {
    push('Credential', match[1], 'assigned to a named secret')
  }

  return found
}

/** Text people can try, so nobody has to invent a card number to test the demo. */
export const SAMPLES = [
  {
    label: 'A client record',
    text: 'Client M. Byrne — card 4111 1111 1111 1111, PPSN 1234567T',
  },
  {
    label: 'Pasted from a spreadsheet',
    text: '4111\n1111\n1111\n1111',
  },
  {
    label: 'A config file',
    text: 'DB_PASSWORD=Tr0ub4dor-3xKq9\nSTRIPE_KEY=sk-live51H8xYzAbCdEfGhIjKl',
  },
  {
    label: 'Ordinary business text',
    text: 'Order ref 4471112033458891, tracking 1Z999AA10123456784, due Thursday',
  },
]
