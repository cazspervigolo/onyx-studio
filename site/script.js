/* Onyx Studio — wiring.
   Binds config.js into the page, works out whether the studio is open right
   now, and handles the small interactions. Edit config.js, not this file. */

(function () {
  "use strict";

  /* If config.js fails to load, everything below would throw and take the
     menu, the hours and the reveals down with it. Fail quietly instead: the
     page keeps its hard-coded fallback text and stays usable. */
  if (typeof SITE === "undefined") {
    console.warn("Onyx: config.js did not load — showing fallback content.");
    return;
  }

  document.documentElement.classList.add("js");

  var $ = function (sel, ctx) { return (ctx || document).querySelectorAll(sel); };
  var booking = SITE.bookingUrl || "mailto:" + SITE.email;

  /* =======================================================================
     Analytics hooks
     Nothing is sent anywhere. Every Book / Call / Directions click pushes a
     named event onto window.dataLayer, so whoever Onyx choose as a provider
     later can read conversions by adding their one line of script — no
     third-party code, no cookie banner, no data leaving the page today.
     ======================================================================= */

  window.dataLayer = window.dataLayer || [];
  function track(name, el) {
    window.dataLayer.push({
      event: "onyx." + name,
      cta: el ? el.getAttribute("data-cta") : null,
      at: new Date().toISOString()
    });
  }

  /* =======================================================================
     Text and link bindings
     ======================================================================= */

  var text = {
    phone: SITE.phone,
    email: SITE.email,
    addressLine1: SITE.addressLine1,
    addressLine2: SITE.addressLine2,
    instagramHandle: SITE.instagramHandle,
    rating: SITE.rating,
    reviewCount: SITE.reviewCount,
    reviewSource: SITE.reviewSource
  };
  Object.keys(text).forEach(function (key) {
    $('[data-bind="' + key + '"]').forEach(function (el) { el.textContent = text[key]; });
  });

  var hrefs = {
    phone: "tel:" + SITE.phoneHref,
    email: "mailto:" + SITE.email,
    booking: booking,
    maps: SITE.mapsUrl,
    instagram: SITE.instagram
  };
  Object.keys(hrefs).forEach(function (key) {
    $('[data-bind-href="' + key + '"]').forEach(function (el) {
      el.href = hrefs[key];
      if (key === "booking" && SITE.bookingUrl) {
        el.target = "_blank";
        el.rel = "noopener";
      }
    });
  });

  $("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () {
      var cta = el.getAttribute("data-cta") || "";
      track(cta.indexOf("call") === 0 ? "call" : cta.indexOf("book") === 0 ? "book" : "click", el);
    });
  });

  /* =======================================================================
     Hours — one source of truth, three readouts
     ======================================================================= */

  var DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // "9am" / "9:30am" / "12pm" → minutes past midnight, or null.
  function toMinutes(str) {
    var m = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(String(str).trim());
    if (!m) return null;
    var h = parseInt(m[1], 10) % 12;
    if (/pm/i.test(m[3])) h += 12;
    return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
  }

  // ["Monday", "9am – 6pm"] → { open: 540, close: 1080 } or null when closed.
  function span(row) {
    var value = row[1];
    if (!value || /closed/i.test(value)) return null;
    var parts = String(value).split(/\s*[–—-]\s*/);
    if (parts.length !== 2) return null;
    var open = toMinutes(parts[0]);
    var close = toMinutes(parts[1]);
    return open === null || close === null ? null : { open: open, close: close };
  }

  // "now" in the studio's own time zone, not the visitor's.
  function studioNow() {
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-AU", {
        timeZone: SITE.timeZone || "Australia/Melbourne",
        weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
    } catch (e) {
      // An unknown time zone shouldn't break the page — fall back to local.
      var d = new Date();
      return { day: (d.getDay() + 6) % 7, minutes: d.getHours() * 60 + d.getMinutes() };
    }
    var got = {};
    parts.forEach(function (p) { got[p.type] = p.value; });
    var day = DAYS.indexOf(got.weekday);
    return {
      day: day < 0 ? 0 : day,
      minutes: (parseInt(got.hour, 10) % 24) * 60 + parseInt(got.minute, 10)
    };
  }

  function label(minutes) {
    var h = Math.floor(minutes / 60), m = minutes % 60;
    var suffix = h >= 12 ? "pm" : "am";
    var hour = h % 12 === 0 ? 12 : h % 12;
    return hour + (m ? ":" + String(m).padStart(2, "0") : "") + suffix;
  }

  var now = studioNow();
  var todayRow = SITE.hours[now.day];
  var todaySpan = todayRow ? span(todayRow) : null;
  var isOpen = !!todaySpan && now.minutes >= todaySpan.open && now.minutes < todaySpan.close;

  // The hours table, with today picked out.
  $("[data-hours]").forEach(function (list) {
    SITE.hours.forEach(function (row, i) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = row[0];
      dd.textContent = row[1];
      if (i === now.day) {
        dt.classList.add("is-today");
        dd.classList.add("is-today");
        dt.textContent = row[0] + " · today";
      }
      list.appendChild(dt);
      list.appendChild(dd);
    });
  });

  // The live badge. Says something useful in every state.
  function statusLine() {
    if (isOpen) return "Open now · until " + label(todaySpan.close);
    if (todaySpan && now.minutes < todaySpan.open) {
      return "Closed · opens " + label(todaySpan.open);
    }
    for (var i = 1; i <= 7; i++) {
      var idx = (now.day + i) % 7;
      var next = span(SITE.hours[idx]);
      if (next) {
        var when = i === 1 ? "tomorrow" : SITE.hours[idx][0];
        return "Closed · opens " + when + " " + label(next.open);
      }
    }
    return "Closed";
  }

  var line = statusLine();
  $("[data-status]").forEach(function (el) {
    el.hidden = false;
    el.classList.toggle("is-open", isOpen);
  });
  $("[data-status-text]").forEach(function (el) { el.textContent = line; });

  /* The line under the hero says the same thing in plainer words. "Today
     10am – 5pm" is misleading at 11pm on a Saturday — this never is. */
  $('[data-bind="todayHours"]').forEach(function (el) {
    el.textContent = isOpen ? "Open until " + label(todaySpan.close) : line;
  });

  /* "Open 7 days" is the kind of micro-trust line the top-rated Melbourne
     shops all run. It is computed from the hours above rather than typed, so
     it can never contradict them: change a day to "Closed" in config.js and
     this line disappears by itself. */
  var daysOpen = SITE.hours.filter(function (row) { return !!span(row); }).length;
  $("[data-open-every-day]").forEach(function (el) {
    if (daysOpen === SITE.hours.length && daysOpen === 7) {
      el.textContent = "Open 7 days";
      el.hidden = false;
    }
  });

  // The "how to get here" line, hidden unless config.js provides one.
  $('[data-bind="transport"]').forEach(function (el) {
    if (SITE.transport) {
      el.textContent = SITE.transport;
      el.hidden = false;
    }
  });

  $("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* =======================================================================
     Header, booking bar
     ======================================================================= */

  var nav = document.querySelector(".nav");
  var bar = document.querySelector(".book-bar");
  var finaleOnScreen = false;

  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
    // The sticky bar hides while the real booking card is on screen, so it
    // never covers or duplicates the primary call to action.
    if (bar) bar.classList.toggle("is-shown", window.scrollY > 620 && !finaleOnScreen);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var finale = document.querySelector(".finale");
  if (finale && bar) {
    new IntersectionObserver(function (entries) {
      finaleOnScreen = entries[0].isIntersecting;
      onScroll();
    }).observe(finale);
  }

  /* =======================================================================
     Mobile menu — opens, traps focus, gives it back
     ======================================================================= */

  var toggle = document.querySelector(".menu-toggle");
  var panel = document.getElementById("mobile-menu");

  if (toggle && panel) {
    var links = function () { return panel.querySelectorAll("a"); };

    function openMenu() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      var first = links()[0];
      if (first) first.focus();
    }
    function closeMenu(returnFocus) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      panel.hidden ? openMenu() : closeMenu(true);
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { closeMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (panel.hidden) return;
      if (e.key === "Escape") { closeMenu(true); return; }
      if (e.key !== "Tab") return;

      var items = links();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;

      if (e.shiftKey && (active === first || active === toggle)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* =======================================================================
     Reveals, tile glow, the score counting up
     ======================================================================= */

  /* Reveals are additive, never a gate on visibility.

     The hidden state is applied here in script, so a page without JavaScript
     — or one rendered by a crawler that doesn't run it — is simply complete
     and unanimated rather than a stack of blank sections.

     Nothing is measured. An earlier version only hid elements below the fold,
     but getBoundingClientRect() at parse time reports a page that hasn't
     finished laying out, so it classified nothing and no reveal ever ran.
     Instead every element is hidden and handed to the observer, whose first
     callback fires on the next frame and immediately reveals whatever is
     already on screen. Two backstops cover the observer never firing at all:
     a timer, and print. */
  var pending = [];
  $(".reveal").forEach(function (el) {
    el.classList.add("will-reveal");
    pending.push(el);
  });

  function show(el) {
    el.classList.remove("will-reveal");
    var i = pending.indexOf(el);
    if (i > -1) pending.splice(i, 1);
  }
  function showAll() { pending.slice().forEach(show); }

  if (pending.length) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        show(e.target);
        revealer.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    pending.slice().forEach(function (el) { revealer.observe(el); });

    setTimeout(showAll, 10000);
    window.addEventListener("beforeprint", showAll);
  }

  /* The studio rail is a real horizontal scroller only when motion is off.
     With the film running it is driven by page scroll and `overflow: visible`,
     so a focusable container would take a tab stop and then do nothing with
     the arrow keys. Drop the tab stop in that mode; page scrolling already
     moves the rail, so keyboard users still reach every photo. */
  var rail = document.querySelector("[data-rail]");
  if (rail && document.documentElement.classList.contains("motion")) {
    rail.removeAttribute("tabindex");
  }

  // The aura on the dark tiles follows the pointer.
  $("[data-tilt]").forEach(function (tile) {
    tile.addEventListener("pointermove", function (e) {
      var r = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      tile.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  });

  var counters = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counters.unobserve(e.target);

      var el = e.target;
      var target = parseFloat(el.getAttribute("data-count"));
      var dp = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
      if (isNaN(target)) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = target.toFixed(dp);
        return;
      }

      var start = performance.now();
      (function step(t) {
        var p = Math.min((t - start) / 1400, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dp);
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.6 });
  $("[data-count]").forEach(function (el) { counters.observe(el); });
})();
