/* ==========================================================================
   ONYX STUDIO — SITE SETTINGS
   This is the only file you need to touch day-to-day.
   Edit the values below, save, and the whole site updates.

   All values below were taken from the live Onyx Studio presence
   (onyxstudio.melbourne + Fresha listing) on 12 July 2026.
   ========================================================================== */

const SITE = {

  // --- Booking ------------------------------------------------------------
  // Live Fresha booking page. Every "Book a chair" button points here.
  bookingUrl: "https://www.fresha.com/a/onyx-studio-melbourne-377-little-bourke-street-vw90huqt",

  // --- Social proof (update as the numbers grow) ---------------------------
  rating: "5.0",
  reviewCount: "1,320+",
  reviewSource: "Fresha",

  // --- Contact ------------------------------------------------------------
  phone: "(03) 9602 4625",        // shown on the site
  phoneHref: "+61396024625",      // dial format — no spaces, +61 and drop the 0
  email: "onyxstudio.melbourne@gmail.com",

  // --- Location -----------------------------------------------------------
  addressLine1: "Level 1, 377 Little Bourke Street",
  addressLine2: "Melbourne VIC 3000",
  mapsUrl: "https://maps.app.goo.gl/zm2etbhuZQbDkgJt7",

  // ⚠️ THE TWO LINES TO CHECK. Melbourne's top-rated barbers all tell people
  // how to find the door and how to get there, and it helps bookings — but a
  // wrong detail is worse than none, so these say only what can be read off
  // the address itself. Replace them with what you'd actually tell a client on
  // the phone (which floor, lift or stairs, which cross-streets, which tram).
  // Set either to "" to hide that line completely.
  //
  // An earlier draft of this site asserted "up the stairs" and "between
  // Elizabeth and Queen". Neither was ever confirmed by the studio, so both
  // have been removed rather than left on the page looking authoritative.
  locationNote: "The studio is on Level 1 — look for the entrance on Little Bourke Street.",
  transport: "Bourke Street trams run one block north.",

  // --- Hours --------------------------------------------------------------
  // Format: ["Day", "9am – 6pm"] · write "Closed" for a closed day.
  // These drive the hours table, the "open today" line, and the live
  // Open / Closed badge in the header. Change them here and nowhere else.
  hours: [
    ["Monday",    "9am – 6pm"],
    ["Tuesday",   "9am – 9pm"],
    ["Wednesday", "9am – 9pm"],
    ["Thursday",  "9am – 9pm"],
    ["Friday",    "9am – 9pm"],
    ["Saturday",  "10am – 5pm"],
    ["Sunday",    "11am – 5pm"],
  ],

  // The studio's own time zone, so the live Open / Closed badge is right for
  // Little Bourke Street rather than for wherever the visitor is sitting.
  timeZone: "Australia/Melbourne",

  // --- Social -------------------------------------------------------------
  instagram: "https://www.instagram.com/onyxstudio.melb/",
  instagramHandle: "@onyxstudio.melb",
};
