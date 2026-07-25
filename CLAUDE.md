# Onyx Studio — Barber Shop Website

A single-page static website for a barber shop. No build tools, no frameworks —
just static files you can host anywhere.

## Project structure
```
site/
├── index.html       the page itself (edit services & prices here)
├── styles.css       the look (rarely needs changes)
├── config.js        ★ booking link, address, hours, email — edit this one
├── script.js        wiring: binds config.js, hours, scroll reveals (don't touch)
├── particles.js     ambient dust-mote canvas (don't touch)
└── images/          shop photos
research/
├── BLUEPRINT.md     evidence-based website formula (Melbourne barber market analysis)
└── ANTIGRAVITY-EXTRACTION.md  design language reference
```

## Run locally
```bash
python3 -m http.server 8741 --directory site
```
Then open http://localhost:8741.

## Design system
The look is an original, legally-built interpretation of the antigravity.google
design language. See `research/ANTIGRAVITY-EXTRACTION.md` for the full spec.

## Editing rules
- **`config.js` is the single source of truth** for all business info (hours, address, booking link, email). Most updates go here.
- **Don't touch `script.js` or `particles.js`** unless fixing a bug — they're wiring.
- **`index.html`** is for structural changes only (adding/removing sections, services).
- **`styles.css`** is the look — rarely needs changes.

## ⚠️ Name collision warning
"Onyx Studio" already exists as an established barber in Melbourne CBD
(Level 1, 377 Little Bourke Street). See `research/BLUEPRINT.md` for full details.
Resolve the name before publishing.

## Git
This is a git repo. Use HTTPS with `gh` CLI (authenticated as cazspervigolo).
