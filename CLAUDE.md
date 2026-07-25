# Onyx Studio — Barber Shop Website

A single-page static website for a real Melbourne CBD barber shop. No build
tools, no frameworks, no dependencies — static files hostable anywhere.

## What this project actually is
This is an **unsolicited pitch** to the real Onyx Studio at Level 1, 377 Little
Bourke Street. Cazsper does not own the business. Every fact on the page —
name, address, phone, Fresha booking link, Instagram, the 5.0 / 1,320+ review
count, the three barbers' own words — belongs to them and was taken from their
live presence on 12 July 2026.

**Consequences that bind any work here:**
- Never invent a service, price, award, testimonial, or photograph. If a fact
  isn't already sourced from Onyx, it doesn't go on the page.
- The build ships `noindex` in `index.html` and `Disallow: /` in `robots.txt`.
  Both carry comments marking what to delete. They come off only when Onyx have
  seen the site and authorised publication — not before. Until then this page
  must not compete with `onyxstudio.melbourne` for their own name.
- The rating is shown on the page with Fresha named as its source, but is
  deliberately **not** declared as schema.org `aggregateRating` — those reviews
  were collected by Fresha, not by this site.

The old "name collision" warning is resolved: we are pitching *to* the
collision holder, not competing with them.

## Project structure
```
site/
├── index.html        the page (edit services & prices here)
├── config.js         ★ booking link, phone, address, hours — edit this one
├── styles.css        the look (rarely needs changes)
├── script.js         wiring: bindings, hours, open/closed, menu, reveals
├── motion.js         the film: light-field canvas + scroll engine
├── fonts/            Inter Variable, self-hosted (SIL OFL)
├── images/           the studio's own photos, video, icons
├── robots.txt · sitemap.xml · site.webmanifest
└── README.md         plain-English handover, written for the owner
assets/source/        original photos before cropping
research/
├── BLUEPRINT.md      evidence-based formula (Melbourne barber market analysis)
└── ANTIGRAVITY-EXTRACTION.md  design language reference
```

## Run locally
```bash
python3 -m http.server 8741 --directory site
```
Then open http://localhost:8741.

## Design system — "The Room"
The palette is taken from the studio's own photographs: polished concrete,
black leather and chrome, and the green of the plants by the window. Colour is
rationed to exactly two events — the live Open badge (green `#2f6b43`) and the
warmth in the light-field canvas (amber `#e8a33d`). Everything else is ink.
Inter Variable at weight 450, pills and big radii, no borders.

Built on the antigravity.google system documented in
`research/ANTIGRAVITY-EXTRACTION.md`, with the ambient signature swapped from a
starfield to raking window light and dust — which is what the photos show.

## Editing rules
- **`config.js` is the single source of truth** for business info. Most updates
  go there. Changing phone/address/hours also requires updating the JSON-LD in
  `index.html` — no build step means that duplication is manual.
- **`index.html`** holds services, prices and the barbers' write-ups.
- **`script.js` and `motion.js`** are wiring — don't touch unless fixing a bug.
- **`styles.css`** is the look — rarely needs changes.
- Bump the `?v=` query on the CSS/JS links in `index.html` after any edit.

## Non-negotiables
- **Zero dependencies and zero third-party requests.** Nothing is fetched from
  a CDN, including fonts. Keep it that way.
- **Motion is opt-out.** `motion.js` adds `html.motion`; every animated rule in
  the stylesheet is gated behind it. With reduced motion the pinned sections
  become a normal stacked layout. Never let content be hidden by default in a
  way that reduced motion can't recover.
- **Accessibility 100 in Lighthouse.** Greys are chosen against measured
  contrast ratios — see the comments on the `--ink-*` tokens. Don't lighten
  them by eye.

## Git
This is a git repo with **no remote** — there is no backup. Use HTTPS with the
`gh` CLI (authenticated as cazspervigolo) if one is added.
