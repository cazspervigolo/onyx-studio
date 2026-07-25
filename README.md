# Onyx Studio — website

A single-page site for the barber shop. No build tools, no frameworks, no
dependencies — static files you can host anywhere.

```
site/
├── index.html        the page (edit services & prices here)
├── config.js         ★ booking link, phone, address, hours — edit this one
├── styles.css        the look (rarely needs changing)
├── script.js         wiring: binds config.js, hours, menu, reveals
├── motion.js         the film: light-field canvas + scroll engine
├── fonts/            Archivo Variable, self-hosted (SIL Open Font License)
├── images/           the shop's own photos, video and icons
├── robots.txt        ⚠️ currently blocks search engines — see below
├── sitemap.xml
└── site.webmanifest
```

## ⚠️ Before this goes live

**This is a proposal, not Onyx Studio's official site.** It uses the real
studio's name, address, phone, Fresha booking link and review count. Until
Renee has seen it and said yes, it deliberately stays out of Google:

- `index.html` carries `<meta name="robots" content="noindex, nofollow">`
- `robots.txt` carries `Disallow: /`

Both files have a comment marking exactly what to delete. Publishing before
that conversation would put this page in competition with
`onyxstudio.melbourne` for the studio's own name.

## Run it locally

```bash
python3 -m http.server 8741 --directory site
```

Then open <http://localhost:8741>.

## Editing

**Almost everything lives in `config.js`** — booking URL, phone, email,
address, map link, hours, Instagram, rating and review count. Change it there
and the whole page updates, including the hours table, the "open until…" line
under the hero, and the live Open / Closed badge in the header.

**Two lines to check before this goes anywhere:** `locationNote` and
`transport` in `config.js`. Melbourne's top-rated barbers all tell people how
to find the door and how to get there, and it helps bookings — but a wrong
detail is worse than none, so the defaults say only what can be read off the
address itself. Replace them with what you'd tell a client on the phone (which
floor, lift or stairs, which cross-streets, which tram), or set either to `""`
to hide that line.

An earlier draft of this site asserted "up the stairs" and "in the heart of the
CBD between Elizabeth and Queen". Neither was ever confirmed by the studio, so
both have been removed rather than left on the page looking authoritative.

Two things are *not* in `config.js`:

- **Services and prices** — in `index.html`, in the `services` section.
- **The barbers' write-ups** — in `index.html`, in the `team` section.

If you change the phone, address or opening hours, they also appear in the
JSON-LD block at the top of `index.html` (the structured data Google reads).
Update both. That duplication is the price of having no build step.

After editing any file, bump the `?v=` number on the `styles.css`, `config.js`,
`motion.js` and `script.js` links in `index.html` so returning visitors don't
get a stale cached copy.

## The design

The palette comes from the studio's own photographs — polished concrete, black
leather and chrome, and the green of the plants by the window. Colour is
rationed to two events and nothing else:

- **Green** (`#2f6b43`) — the live Open badge, and only that.
- **Amber** (`#e8a33d`) — the warmth in the canvas light-field, and only that.

Type is Archivo Variable at weight **450**, self-hosted so nothing is
requested from a third party. Archivo was chosen over the obvious Inter for
two reasons: Inter is the default face of most of what's been built in the
last three years, and Archivo — a newsprint and signage grotesque — happens
to sit much closer to the Onyx wordmark, which is itself a heavy geometric
grotesque. Geometry is pills and big radii, with no borders.

There are deliberately no small tracked-uppercase labels above the section
headings, and no 01 / 02 / 03 markers. Both are the most over-used furniture
on the web right now, and every one of them was restating the heading
underneath it.

The page is a scroll-driven sequence: a light-and-dust hero, a pinned video
that expands to fill the screen and contracts again, a word-by-word statement,
the menu as leather tiles, the three barbers, a studio rail that travels
sideways as you scroll, the 5.0 score, the hours, and an inverted black
booking card. `research/ANTIGRAVITY-EXTRACTION.md` documents the system this
is built on.

**Motion is opt-out.** If a visitor has "reduce motion" set in their operating
system, `motion.js` never adds the `motion` class, every pinned section becomes
a normal stacked layout, and the page loses ~4,000px of height. Nothing is
hidden and nothing breaks.

## Verified

Measured on 25 July 2026, mobile Lighthouse, served locally:

| | |
|---|---|
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 69 as shipped — 100 with the `noindex` removed (verified on a copy) |
| First-paint payload | 202 KB · 698 KB once the video loads |
| Third-party requests | none |

Two claims on the page are computed rather than typed, so they cannot go
stale: the live Open / Closed badge, and "Open 7 days". Set any day to
`"Closed"` in `config.js` and the "Open 7 days" line removes itself.

The hero video is 640×360 — the only footage the studio has. It carries a
grain overlay and a light grade, which is how a soft plate is carried at size.
If Onyx can supply higher-resolution footage, drop it into
`images/onyx-hero.mp4` and `.webm` and it will improve with no code changes.
