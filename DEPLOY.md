# Publishing the site

The build has to happen on GitHub, not in the repository. A workflow is included for
that — `.github/workflows/deploy.yml`.

## Why not simply point Pages at a branch

That publishes the repository exactly as it is. `index.html` then asks the browser for
`/src/main.jsx`, the browser cannot run JSX, and the page is blank — with the only
explanation sitting in a console nobody opens. The code must be compiled first, which is
the workflow's whole job.

---

## First publish

**1. A separate repository, or a separate folder**

The old single-file landing page and this project both want to own `index.html`. Two
options, both fine:

- new repository, e.g. `akmaz-site` — cleanest
- same repository, this project in a `web/` subfolder — then add
  `working-directory: web` to each `run:` step in the workflow

**2. Push everything**

```bash
git init
git add .
git commit -m "Site: React, Vite, Tailwind"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`node_modules` and `dist` are already excluded by `.gitignore`. `package-lock.json` must
be committed — `npm ci` in the workflow fails without it.

**3. Settings → Pages → Source: `GitHub Actions`**

Not "Deploy from a branch". This is the step people miss, and the symptom is a workflow
that runs green while the site never changes.

**4. Set `BASE_PATH` — the one setting that decides between a working site and a white screen**

Settings → Secrets and variables → Actions → **Variables** → New variable:

| Where the site will live | `BASE_PATH` |
|---|---|
| `https://<you>.github.io/akmaz-site/` | `/akmaz-site/` — with both slashes |
| `https://akmaz.eu` (custom domain) | leave it unset |

A project page is served from a subdirectory. Build with `base: '/'` and every asset
resolves to the domain root, 404s, and the page renders white — no error in the UI, just
a console full of missing files. It is the single most common way a Vite build "works
locally and is broken when published".

**5. Push again, or Actions → Deploy site → Run workflow**

Two to three minutes. The finished URL appears on the workflow run.

---

## Connecting akmaz.eu

**1.** Settings → Pages → Custom domain → `akmaz.eu` → Save.
This writes a `CNAME` file into the repository — leave it there.

**2.** At Namecheap, Advanced DNS:

| Type | Host | Value |
|---|---|---|
| ALIAS (or ANAME) | `@` | `<you>.github.io` |
| CNAME | `www` | `<you>.github.io` |

Namecheap supports ALIAS on the apex, which is what you want. If only A records are
available, GitHub's four addresses are `185.199.108.153`, `185.199.109.153`,
`185.199.110.153`, `185.199.111.153` — all four, as separate records.

**3.** **Remove `BASE_PATH`** and re-run the workflow. On a custom domain the site is at
the root, and leaving the variable set breaks every asset — the same white screen, arrived
at from the opposite direction.

**4.** Wait for the certificate, then tick **Enforce HTTPS**. Usually minutes; can take an
hour.

---

## Before sharing the link anywhere

**`og.png` is referenced and does not exist.** `index.html` points at a 1200×630 preview
image. Until it is added, every link posted to LinkedIn, Slack or WhatsApp renders as an
empty grey card — which looks worse than having no preview at all. A screenshot of the
hero is enough.

**Update the two product URLs when the server moves.** Every button points at
`hunter.website4u.tech`. When the product lives at `app.akmaz.eu`, search the source for
`website4u` — there are four occurrences.

---

## Checking it actually worked

Open the published URL and confirm:

- the hero paints, and the interception panel cycles through its five steps
- the walkthrough advances as you scroll rather than jumping
- the privacy demo responds as you type — then open DevTools → Network and confirm
  **nothing is sent**, which is the claim the section makes
- the dashboard counters count up when it comes into view
- on a phone: no horizontal scrolling, and the sticky walkthrough panel stays fully
  on screen

If the page is blank, check `BASE_PATH` first. It is nearly always `BASE_PATH`.
