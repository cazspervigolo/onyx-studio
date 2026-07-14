/* Onyx Studio — wires config.js into the page + interactions.
   You shouldn't need to edit this file; edit config.js for business details. */

(function () {
  // Mark JS as available: scroll-reveals only hide content when this class
  // is present, so the page stays fully readable if scripts ever fail.
  document.documentElement.classList.add("js");
  var booking = SITE.bookingUrl || "mailto:" + SITE.email;

  // --- Text bindings ---
  var text = {
    email: SITE.email,
    addressLine1: SITE.addressLine1,
    addressLine2: SITE.addressLine2,
    addressShort: SITE.addressLine2,
    instagramHandle: SITE.instagramHandle,
    rating: SITE.rating,
    reviewCount: SITE.reviewCount,
    reviewSource: SITE.reviewSource,
  };
  Object.keys(text).forEach(function (key) {
    document.querySelectorAll('[data-bind="' + key + '"]').forEach(function (el) {
      el.textContent = text[key];
    });
  });

  // --- Link bindings ---
  var hrefs = {
    email: "mailto:" + SITE.email,
    booking: booking,
    maps: SITE.mapsUrl,
    instagram: SITE.instagram,
  };
  Object.keys(hrefs).forEach(function (key) {
    document.querySelectorAll('[data-bind-href="' + key + '"]').forEach(function (el) {
      el.href = hrefs[key];
      if (key === "booking" && SITE.bookingUrl) { el.target = "_blank"; el.rel = "noopener"; }
    });
  });

  // --- Hours table + "open today" ---
  var dayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  var hoursEl = document.querySelector("[data-hours]");
  if (hoursEl) {
    SITE.hours.forEach(function (row, i) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = row[0];
      dd.textContent = row[1];
      if (i === dayIndex) { dt.classList.add("is-today"); dd.classList.add("is-today"); }
      hoursEl.appendChild(dt); hoursEl.appendChild(dd);
    });
  }
  var today = SITE.hours[dayIndex];
  document.querySelectorAll('[data-bind="todayHours"]').forEach(function (el) {
    el.textContent = today[1] === "Closed" ? "Closed today" : "Open today · " + today[1];
  });

  // --- Footer year ---
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // --- Nav shadow + mobile book bar on scroll ---
  var nav = document.querySelector(".nav");
  var bookBar = document.querySelector(".mobile-book-bar");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    if (bookBar) bookBar.classList.toggle("is-shown", window.scrollY > 520);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Mobile menu ---
  var menuBtn = document.querySelector(".menu-toggle");
  var menuPanel = document.getElementById("mobile-menu");
  function closeMenu() {
    if (!menuPanel) return;
    menuPanel.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener("click", function () {
      var open = menuPanel.hidden;
      menuPanel.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    menuPanel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // --- Statement: split into words for the scroll reveal ---
  var stmt = document.getElementById("statement-text");
  if (stmt) {
    var words = stmt.textContent.trim().split(/\s+/);
    stmt.innerHTML = words.map(function (w) {
      return '<span class="reveal-word">' + w + "</span>";
    }).join(" ");
  }

  // --- Intersection reveals (blocks + the lit statement) ---
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add(e.target.classList.contains("statement") ? "is-lit" : "is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  var statement = document.querySelector(".statement");
  if (statement) io.observe(statement);
})();
