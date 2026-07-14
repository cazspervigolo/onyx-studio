# Onyx Studio — website

A single-page site for the barber shop. No build tools, no frameworks — just
static files you can host anywhere.

```
site/
├── index.html    the page itself (edit services & prices here)
├── styles.css    the look (you rarely need to touch this)
├── config.js     ★ booking link, address, hours, email — edit this one
├── script.js     wiring: binds config.js, hours, scroll reveals (don't touch)
├── particles.js  the ambient dust-mote canvas (don't touch)
└── images/       the shop photos
```

## Design system

The look is an original, legally-built interpretation of the
antigravity.google design language (see `research/ANTIGRAVITY-EXTRACTION.md`):

- **Type:** Inter Variable, loaded from Google Fonts, set at the signature
  weight **450**. Inter is under the SIL Open Font License — free for any use,
  including commercial. (Google's own "Google Sans Flex" is *not* licensable, so
  Inter is the deliberate legal stand-in.)
- **Colour:** two inks (`#121317`, `#45474D`) on white; one "colour event" — a
  brushed-chrome gradient — used only on the `onyx` wordmark.
- **Signature:** a canvas dust-mote field (`particles.js`), dark radial-glow
  service tiles, and an inverted black booking finale.
- Everything respects `prefers-reduced-motion` (the field freezes, reveals show
  instantly).

## Day-to-day edits

**Booking link, address, hours, email, Instagram, review count** → open
`config.js`. Every value is labelled. Save and the whole site updates — the
booking link flows to every button, and the hours table highlights today.

**Services and prices** → open `index.html` and find the
`<!-- ===== Services -->` section. Each service is one `<a class="tile">` block
— copy one to add a service, delete one to remove it, change text/prices freely.
The wider highlighted tile is `tile tile-feature` (The Onyx Experience).

**Photos** → drop new images into `images/` and update the `src` in
`index.html`. Portrait photos (4:5) look best in the gallery.

## Connecting a booking system

The site is booking-system agnostic. Sign up with any of these (all popular
with barbers):

- **Fresha** — free, takes a cut of card payments
- **Booksy** — barber-focused, monthly fee
- **Square Appointments** — good if you already use Square for payments

Each gives you a public booking link (e.g. `https://booksy.com/…/onyx-studio`).
Paste that link into `bookingUrl` in `config.js` and **every "Book a chair"
button on the site points to it**, opening in a new tab.

Until you set it, the buttons fall back to calling the shop — so the site
works fine from day one.

## Going live

The site is static, so hosting is free almost everywhere:

1. **Netlify Drop** (easiest): go to https://app.netlify.com/drop and drag the
   `site` folder onto the page. Done — you get a URL instantly.
2. **GitHub Pages / Cloudflare Pages / Vercel**: push the folder to a repo and
   point the service at it.
3. Connect your own domain (e.g. `onyxstudio.com.au`) in the host's settings.

## Before launch checklist

Real business details were filled in on 12 July 2026 from onyxstudio.melbourne
and the live Fresha listing (booking link, address, hours, services/prices,
Instagram, email, 5.0★/1,320+ review proof line). Remaining items:

- [ ] Confirm you are authorised to publish for Onyx Studio (377 Little Bourke St)
- [ ] Confirm services/prices against Fresha before launch (they change there first)
- [ ] Keep the review count in `config.js` fresh as it grows
- [ ] The studio has no public phone — the site uses email + Fresha on purpose
- [ ] Claim/verify the Google Business Profile and keep hours identical to the site
