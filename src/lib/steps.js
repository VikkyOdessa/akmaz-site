/**
 * The interception sequence, defined once.
 *
 * Two components render this: the compact loop in the hero and the scroll-driven
 * walkthrough further down. Keeping it here is not tidiness — it is the reason the
 * two can never disagree. A hero that demonstrates five steps while the
 * explanation below lists six is the kind of inconsistency a careful reader
 * notices and quietly distrusts, and it happens the moment the same content is
 * typed in two places.
 *
 * `hold` is per-step because the steps are not equal: reading a card number takes
 * longer than watching a clipboard empty. A uniform interval makes the fast steps
 * feel padded and the slow ones rushed.
 *
 * `4111 1111 1111 1111` is the published Visa test number — Luhn-valid, belongs to
 * nobody. Using a plausible-looking invented number on a page about protecting
 * card data would be a poor joke at our own expense.
 */
export const STEPS = [
  {
    key: 'copy',
    label: 'Ctrl+C',
    value: 'Client M. Byrne — 4111 1111 1111 1111',
    hold: 2100,
    title: 'Someone copies a client record',
    note: 'A payment query at 17:40. The file is on the office machine; the answer is needed by morning.',
    tone: 'neutral',
  },
  {
    key: 'read',
    label: 'Clipboard',
    value: '4111 1111 1111 1111',
    hold: 1200,
    title: 'It lands on the clipboard',
    note: 'Which is shared by every application on the computer — the browser, the mail client, the chat window.',
    tone: 'neutral',
  },
  {
    key: 'detect',
    label: 'Akmaz',
    value: 'Payment card · checksum valid',
    hold: 1700,
    title: 'Akmaz reads it before anything else can',
    note: 'Pattern, then checksum. A tracking number of the same length is not a card, and is left alone.',
    tone: 'alert',
  },
  {
    key: 'clear',
    label: 'Sanitised',
    value: '****1111',
    hold: 1800,
    title: 'The clipboard is cleared',
    note: 'What remains is a masked fragment. The number itself is gone from memory, not merely hidden.',
    tone: 'blocked',
  },
  {
    key: 'paste',
    label: 'Ctrl+V',
    value: '(nothing to paste)',
    hold: 2200,
    title: 'The paste finds nothing',
    note: 'No warning to dismiss, no decision to make. The leak did not happen, and work continues.',
    tone: 'safe',
  },
]

/** Index from which the interception has occurred — drives the stamp and glow. */
export const BLOCK_FROM = 3
