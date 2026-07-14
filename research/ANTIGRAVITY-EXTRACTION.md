# Design Extraction Blueprint — antigravity.google → Onyx Studio (levelled up)

*Extracted 12 July 2026 from the live site by reading computed styles and the DOM, not guessed from screenshots. Every value below is measured. The right-hand column translates each move into the barber-shop build.*

---

## 1. The one-sentence read

Antigravity is **"quiet luxury for software"**: a pure-white canvas, one near-black ink, a single variable typeface set at an unusual in-between weight, everything on **fully-rounded pill and big-radius card geometry**, with **one ambient signature** — a canvas particle starfield — and **one hero colour event** — a subtle spectral gradient. It is confident because it is restrained: no borders, no shadows to speak of, no second font, no decoration that isn't type, whitespace, or a glowing tile.

That restraint is exactly what a premium barber brand wants. The "level up" is not to copy the space theme — it's to steal the *system* (one ink, one variable font at a signature weight, pill + big-radius geometry, a single ambient signature, one colour event) and swap the content for barbering.

---

## 2. Measured design tokens

### Colour (they use essentially three)
| Token | Value | Usage |
|-------|-------|-------|
| Ink | `#121317` (rgb 18,19,23) | All headings, primary text, primary button bg |
| Muted ink | `#45474D` (rgb 69,71,77) | Body copy, nav links, captions |
| Canvas | `#FFFFFF` | Page background (body is transparent → white) |
| Secondary-btn tint | `rgba(183,191,217,0.09)` | The only "fill" — a 9%-opacity cool grey |
| Dark tile | `#000000` | Product tiles + the download card (starfield lives here) |
| Accent | spectral gradient (blue→red→amber), used *only* on the logo mark and a hairline caret | Never as a fill — accent is a rare event |

Takeaway: **two inks on white.** Colour is rationed to almost nothing, which is why the one gradient reads as special.

### Typography
- **Family:** `Google Sans Flex` (variable). One family for everything — display, body, UI.
- **Signature weight: 450.** Not 400, not 500 — a variable-font in-between that reads as "confident but not heavy." This single decision is most of the personality.
- **Body copy:** 15px / 22px line-height, weight 400, muted ink.
- **Section H2:** 28px / 29.6px (line-height ≈1.05 — very tight), weight 450.
- **Hero H1 (mobile):** 48px / 52.8px (line-height 1.1), weight 450, letter-spacing normal. Scales up substantially on desktop.
- **Case for tight leading:** headings sit at ~1.05–1.1 line-height so multi-line titles read as one tight block. Body opens up to ~1.45.

### Geometry — radius scale (measured)
`9999px` (all pills/buttons/nav), `50%` (circular icon buttons & play buttons), `45px`, `24px`, `16px`, `4px`. Cards cluster at **16–45px**; interactive controls are **fully round**. There are effectively **no square corners** and **no visible borders** anywhere.

### Layout & spacing
- **Container max-width:** 1632px (very wide — content breathes on big screens).
- **Section vertical rhythm:** 40–120px top/bottom. The flagship feature section uses **120px / 120px**; content sections **72px / 80px**; tighter bands **55px**.
- **Composition rule observed:** the **hero is centered**, **content sections are left-aligned**. Alternating alignment creates rhythm without new elements.

### Elevation
Almost no drop-shadows. Depth comes from (a) the dark tiles glowing against white, and (b) soft gradient vignettes on screenshots — not from box-shadow. Flat, but not sterile.

---

## 3. The signature moves (what makes it memorable)

1. **Ambient particle starfield.** A `<canvas>` (`main-particles-container`) renders drifting specks over the whole page — barely visible on white, vivid inside the black cards. It's the one piece of ambient motion and it ties the "liftoff" story together.
2. **Dark product tiles with a radial aura.** Big-radius near-black squares with a soft blue radial glow behind glowing embossed text (e.g. "Antigravity SDK"). High-contrast jewels dropped into an otherwise white page.
3. **Pill-everything.** Buttons, nav items, carousel controls, badges — all `border-radius: 9999px`. Primary = ink fill / white text; secondary = 9% cool-grey tint / ink text. Both same shape → cohesive.
4. **The single colour event.** The spectral gradient appears only on the logo and a hairline text caret. One accent, used once, so it lands.
5. **Scroll-driven text reveal.** The big statement ("…build in the agent-first era.") reveals with a coloured caret as you scroll — type *is* the animation.
6. **Floating UI motifs.** Circular badges carrying ⌘ / ↵ keyboard glyphs drift in around the statement — the product's own vocabulary used as decoration.
7. **Inverted download finale.** A full black rounded card with the starfield at full strength and inverted buttons — a deliberate dark "mirror" of the white hero to close the page.

---

## 4. Page architecture (measured section order)

```
header (sticky, frosted white rgba(255,255,255,.85), 52px tall, pill nav)
hero / welcome-wrapper   → centered logo + H1 + two pills, particle field, full viewport
landing-video-section    → thin band, product demo video
agent-first-section      → big left statement w/ floating glyph badges (scroll reveal)
feature-explorer-section → the flagship, 120/120 padding: dark glow tiles + product shots
landing-use-case-section → left heading + testimonial video card + pill carousel nav
try-solutions-section    → solution cards
landing-latest-blogs     → blog/resource cards
download-section-container→ inverted BLACK starfield card, white+dark pills
footer                   → "Experience liftoff" wordmark + link columns
```

---

## 5. Translation → Onyx Studio (the level-up)

Same system, barbering content. This is the build target.

| Antigravity move | Onyx Studio version |
|---|---|
| `Google Sans Flex` @ 450 | **Substitute (licensing, see §7):** a variable grotesque at weight ~450 — **Inter Variable** or **Instrument Sans** (already in the current build) pushed to a custom 450–470 axis. Keep the *one-family, one-signature-weight* rule. |
| Two inks on white | Keep near-black ink `#121317` on warm off-white. Optionally invert the palette toward the shop's onyx-black — but hold the "two inks, one canvas" discipline. |
| Particle starfield | **Ambient signature swap:** slow-drifting fine grain / dust motes in raking window light — matches the concrete-and-chrome studio photos. Same canvas technique, barbershop mood. Barely-there on light sections, richer inside dark cards. |
| Dark product tiles w/ radial glow | **Service tiles:** near-black cards, one per signature service (Fade, Scissor Cut, The Onyx Experience), soft radial glow behind the service name, price in the corner. The menu becomes a row of jewels. |
| Spectral gradient, used once | **One colour event:** a single chrome/steel or warm-amber gradient used *only* on the logo mark and one hairline accent. Everything else is ink. |
| Scroll text reveal | Reveal the positioning line — "Precision barbering in Melbourne CBD" — as type animation on scroll. |
| Floating ⌘/↵ glyph badges | **Floating tool glyphs:** scissors / straight-razor / comb icons drifting around the statement — the barber's own vocabulary, exactly as Antigravity uses keyboard keys. |
| Pill-everything | Keep. Book buttons, nav, hours toggles all `9999px`. Primary ink pill "Book a chair"; secondary tint pill "See services". |
| Inverted black download finale | **Inverted booking finale:** full-black rounded card with the dust-mote field at full strength, white "Book a chair" pill + secondary — the closing call to action. |
| Centered hero / left content | Keep the alternating-alignment rhythm. |
| Testimonial video card + pill carousel | **Reviews carousel:** the 5.0★ / 1,320+ Fresha reviews as cards in a pill-nav carousel. |

---

## 6. Motion spec (keep it restrained)

- **One ambient system** (the drift field) running continuously, very low amplitude. Respect `prefers-reduced-motion` → freeze it.
- **Scroll reveals:** fade + 24px rise, ~0.8s, soft ease-out (the current build already does this — keep).
- **Type reveal** on the one statement line only. Don't animate every heading.
- **Hover:** pills shift fill/tint; tiles lift the glow slightly. Nothing bouncy.
- Rule from the source: **one ambient motion + one signature reveal.** Everything else is still. More motion = less premium.

---

## 7. Build gotchas (must-read before coding)

1. **`Google Sans Flex` is not publicly licensable.** Do **not** try to load it. Use Inter Variable or Instrument Sans and set a **custom weight around 450–470** to reproduce the "in-between" confidence. This is the single most important token to get right — it carries the whole personality.
2. **The 450 weight only works with a variable font.** Load the variable (not static) file and set `font-weight: 450;` (or a `font-variation-settings` `wght` axis). A static 400 or 500 will lose the character.
3. **No borders, minimal shadows.** Depth must come from the dark glowing tiles and soft gradient vignettes, not `box-shadow`. If you reach for a border, reconsider.
4. **Ration the colour.** The whole effect collapses if the accent gets used more than ~twice. One gradient on the mark, one hairline accent — stop there.
5. **Particle field = `<canvas>`, not CSS.** Cheap to run (small drifting points), but cap particle count and pause offscreen / under reduced-motion for performance on mobile.
6. **Container is very wide (1632px).** Let hero type get large on desktop; the current build's hero clamp should be raised for big screens to match this generosity.
7. **Tight heading leading (~1.05–1.1), open body (~1.45).** Easy to miss; it's a big part of why the source looks composed.

---

## 8. What to reuse from the current Onyx build vs. change

**Reuse:** the config-driven architecture, the real Onyx data (Fresha booking, hours, menu, 5.0★/1,320+ proof), pill buttons, scroll reveals, the mirror-rail gallery (very on-brand with this system), `HairSalon` schema.

**Change to level up:** (1) swap the display face to a variable font at ~450 and unify to one family; (2) tighten heading leading; (3) add the ambient drift-field canvas; (4) rebuild the service menu as dark radial-glow tiles; (5) add the inverted black booking finale; (6) ration the accent to a single chrome/amber gradient on the mark; (7) add the floating tool-glyph badges around one scroll-reveal statement.

---

*Sources: computed styles + DOM read live from https://antigravity.google/ on 12 July 2026 (viewport 326×814, DPR 2). Companion to `research/BLUEPRINT.md` (the conversion/SEO evidence) — this file is the visual-system layer on top of it.*
