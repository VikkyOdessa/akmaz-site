# Akmaz — website

React 19 · Vite 8 · Tailwind 4 · Motion 12 · GSAP · Lenis

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
```

Verified: `npm install`, `npm run build` and `npm run dev` all pass, and every module
transforms without error. What has **not** been verified is how the animations look — that
needs a browser, so review the timings yourself and say what feels wrong.

## Part 1 of 4 — what is here

| File | Contains |
|---|---|
| `vite.config.js` | Build config, GitHub Pages base path |
| `index.html` | SEO, Open Graph, JSON-LD, no-JS fallback |
| `src/index.css` | Tailwind 4 tokens, film grain, Lenis rules |
| `src/lib/useLenis.js` | Smooth scroll, synchronised with GSAP |
| `src/components/Background.jsx` | Parallax grid, two light sources, vignette |
| `src/components/Navbar.jsx` | Fixed nav, materialises on scroll, mobile panel |
| `src/components/Hero.jsx` | Full-screen hero + the live interception demo |

Still to come: how-it-happens, what-it-watches, privacy, architecture, live dashboard,
pricing, FAQ, footer.

## Three traps this stack sets, and where they are handled

**Vite 8 bundles with Rolldown, not Rollup.** `manualChunks` must be a *function*; the
object form every tutorial shows fails the build outright with `manualChunks is not a
function`. Only visible on `npm run build` — dev mode never touches it. Handled in
`vite.config.js`.

**Tailwind 4 has no `tailwind.config.js`.** Tokens live in `src/index.css` under `@theme`,
and the compiler runs as a Vite plugin rather than through PostCSS. Following a v3 guide
produces a build that succeeds and ships no styles at all — the worst kind of failure,
because nothing reports it. Adding a config file back does nothing.

**Lenis replaces document scrolling.** Anything that reads scroll position independently
sees stale values, so GSAP ScrollTrigger fires at the wrong moment. Fixed in
`useLenis.js` by driving Lenis from the GSAP ticker and updating ScrollTrigger on every
Lenis frame — one clock for both. Framer Motion's `useScroll` needs nothing extra, because
Lenis still dispatches native scroll events; the commonly suggested `ScrollContainer`
wrapper is unnecessary here and breaks `position: sticky`.

## Publishing to GitHub Pages

A project repository is served from `/<repo-name>/`, not the domain root. Build with the
base path set, or every asset 404s and the page renders white with nothing in the UI to
explain why:

```bash
BASE_PATH=/akmaz-site/ npm run build
```

On a custom domain (`akmaz.eu`) the site *is* at the root, so build without `BASE_PATH`.

Add `.nojekyll` to `dist/` before publishing — GitHub's Jekyll step otherwise strips
directories beginning with an underscore, which is where bundlers like to put things.

## Before sharing a link publicly

`og.png` (1200×630) is referenced in `index.html` but not in the repository yet. A missing
Open Graph image renders as an empty grey card on LinkedIn and Slack, which looks worse
than having no preview at all.

## Fonts

Geist and Geist Mono, self-hosted from `public/fonts/`. SIL Open Font License 1.1 —
commercial use, self-hosting and bundling are permitted; the fonts may not be sold on
their own. `OFL.txt` sits beside the files because the licence requires it to travel
with them.

**Not Google Fonts, deliberately.** A webfont request sends the visitor's IP to a US
server before they interact with anything; LG München held in 2022 that this alone
breaches GDPR. On a site arguing that data stays in the EU, that is the inconsistency a
technical reader finds in the network tab.

Split by `unicode-range`: Latin (29 kB), Latin-Extended (16 kB), Cyrillic (15 kB). An
English reader downloads the first and never fetches the rest. Only Latin is preloaded.

To update: `npm pack @fontsource-variable/geist` and copy the `-wght-normal.woff2` files.

## Motion policy

`prefers-reduced-motion` is honoured properly rather than nominally:

- Lenis does not initialise at all — hijacked scroll can cause nausea, and there is no way
  for the reader to switch it off
- the film grain stops moving
- the interception demo jumps to its final frame instead of looping, because the result is
  the point and it reads perfectly well as a still image

## Two accent colours, each with one meaning

`--color-stamp` (red) appears only where something was **blocked**. `--color-safe` (green)
only where data is **confirmed clear**. Neither is used decoratively anywhere on the page,
which is what lets colour carry state on its own — a rule worth keeping as the remaining
sections are added.
