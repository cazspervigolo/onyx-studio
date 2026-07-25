/* Onyx Studio — the film.
   Two things live in here and nothing else:

     1. the light-field — a canvas of drifting dust in a slow shaft of window
        light, which is the page's one ambient signature; and
     2. the scroll engine — a single requestAnimationFrame loop that drives
        the pinned video, the horizontal studio rail, and the statement.

   There are no dependencies. If motion is switched off in the operating
   system, or JavaScript never runs, none of this loads and the page stays a
   complete, readable site — see the `html.motion` guards in styles.css.

   You shouldn't need to edit this file. Business details live in config.js. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Motion is opt-out: the class gates every animated rule in the stylesheet,
     so removing it returns the page to a clean static layout. */
  var enabled = !reduced.matches;
  if (enabled) root.classList.add("motion");

  reduced.addEventListener("change", function () {
    // Reload rather than try to unwind the film mid-scroll — safer, and this
    // is a preference people change roughly never.
    window.location.reload();
  });

  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var easeInOut = function (t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  /* Map v from [a,b] onto [0,1], clamped. The whole film is built out of
     this one function. */
  var range = function (v, a, b) { return clamp01((v - a) / (b - a)); };

  /* =======================================================================
     The light-field
     ======================================================================= */

  function LightField(canvas) {
    var night = canvas.dataset.light === "night";
    var ctx = canvas.getContext("2d", { alpha: true });
    var motes = [];
    var w = 0, h = 0, dpr = 1;
    var visible = false;
    var phase = Math.random() * Math.PI * 2;

    function size() {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density by area, hard-capped so a large desktop doesn't melt a laptop.
      var target = Math.min(Math.round((w * h) / 15000), 110);
      motes.length = 0;
      for (var i = 0; i < target; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.35,
          vx: (Math.random() - 0.5) * 0.11,
          vy: -(Math.random() * 0.12 + 0.02),
          a: Math.random() * 0.5 + 0.16,
          t: Math.random() * Math.PI * 2
        });
      }
      return true;
    }

    function shaft(t) {
      // A single soft diagonal of window light, breathing very slowly.
      var sway = Math.sin(t * 0.00007 + phase) * 0.09;
      var g = ctx.createLinearGradient(w * (0.16 + sway), 0, w * (0.72 + sway), h);
      if (night) {
        g.addColorStop(0, "rgba(232, 163, 61, 0.16)");
        g.addColorStop(0.45, "rgba(232, 163, 61, 0.05)");
        g.addColorStop(1, "rgba(232, 163, 61, 0)");
      } else {
        g.addColorStop(0, "rgba(255, 250, 240, 0.85)");
        g.addColorStop(0.5, "rgba(255, 246, 232, 0.34)");
        g.addColorStop(1, "rgba(255, 246, 232, 0)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function frame(t) {
      if (!visible || !w) return;
      ctx.clearRect(0, 0, w, h);
      shaft(t);

      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.t += 0.011;
        m.x += m.vx + Math.sin(m.t) * 0.16;
        m.y += m.vy;
        if (m.y < -6) { m.y = h + 6; m.x = Math.random() * w; }
        if (m.x < -6) m.x = w + 6;
        if (m.x > w + 6) m.x = -6;

        var a = m.a * (0.6 + 0.4 * Math.sin(m.t * 0.8));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = night
          ? "rgba(255, 244, 226, " + a + ")"
          : "rgba(18, 19, 23, " + a * 0.34 + ")";
        ctx.fill();
      }
    }

    // Only paint while the canvas is actually on screen.
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !w) size();
    }, { rootMargin: "120px" }).observe(canvas);

    size();
    return { frame: frame, size: size };
  }

  /* =======================================================================
     Scene 2 — the pinned video
     ======================================================================= */

  function Reel() {
    var track = document.querySelector("[data-reel-track]");
    var stage = document.querySelector("[data-reel-stage]");
    var frameEl = document.querySelector("[data-reel-frame]");
    var line = document.querySelector("[data-reel-line]");
    var video = document.querySelector("[data-reel-video]");
    if (!track || !stage || !frameEl) return null;

    var small = window.matchMedia("(max-width: 860px)");
    var startScale = function () { return small.matches ? 0.84 : 0.46; };

    /* The video pauses the moment it leaves the screen — a 22-second loop
       playing off-screen is just a flat battery.

       Fetching it is gated twice. The reel sits directly under the hero, so
       an IntersectionObserver alone fires at scroll position zero and puts
       half a megabyte on the critical path for a visitor who never scrolls.
       So the observer also waits for "primed": the first scroll, or an idle
       moment after load for someone who is just reading. */
    if (video) {
      var primed = false;
      var pending = false;

      function fetchVideo() {
        if (video.preload === "auto") return;
        video.preload = "auto";
        video.load();
      }
      function tryPlay() {
        var p = video.play();
        // A rejected play() is fine — the poster frame carries the section.
        if (p && p.catch) p.catch(function () {});
      }
      function prime() {
        if (primed) return;
        primed = true;
        window.removeEventListener("scroll", prime);
        if (pending) { fetchVideo(); tryPlay(); }
      }

      window.addEventListener("scroll", prime, { passive: true, once: true });
      /* A plain delay, not requestIdleCallback: on a static page the browser
         is idle immediately, so rIC primes at once and the gate does nothing.
         Three seconds is longer than a bounce and shorter than a read. */
      window.addEventListener("load", function () { setTimeout(prime, 3000); });

      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          pending = true;
          if (primed) { fetchVideo(); tryPlay(); }
        } else {
          pending = false;
          if (!video.paused) video.pause();
        }
      }, { rootMargin: "60% 0px" }).observe(track);

      // If autoplay was blocked at the time we asked, take the next chance.
      video.addEventListener("canplay", function () {
        if (primed && pending && video.paused) tryPlay();
      });
    }

    return function () {
      var rect = track.getBoundingClientRect();
      var span = rect.height - window.innerHeight;
      if (span <= 0) return;
      var p = clamp01(-rect.top / span);

      var s0 = startScale();
      var grow = easeInOut(range(p, 0.02, 0.44));
      var shrink = easeInOut(range(p, 0.72, 0.99));
      var scale = lerp(s0, 1, grow) - (1 - s0) * shrink;

      frameEl.style.setProperty("--s", scale.toFixed(4));

      var dark = range(p, 0.05, 0.4) * 0.92;
      stage.style.setProperty("--reel-dark", dark.toFixed(3));

      /* Flip the header to its dark state while the plate owns the screen.
         Test how far the frame has travelled between its own start scale and
         full bleed, not the raw scale — the start scale is 0.84 on a phone,
         which a fixed threshold would read as "expanded" forever. */
      var expanded = (scale - s0) / (1 - s0);
      root.classList.toggle("is-dark", dark > 0.5 && expanded > 0.6);

      // The line only exists while the frame is big enough to hold it.
      if (line) {
        var op = Math.min(range(p, 0.34, 0.5), 1 - range(p, 0.68, 0.8));
        line.style.setProperty("--reel-line", op.toFixed(3));
      }
    };
  }

  /* =======================================================================
     Scene 6 — the studio rail travels sideways as you scroll down
     ======================================================================= */

  function Rail() {
    var track = document.querySelector("[data-rail-track]");
    var rail = document.querySelector("[data-rail]");
    if (!track || !rail) return null;

    return function () {
      var rect = track.getBoundingClientRect();
      var span = rect.height - window.innerHeight;
      if (span <= 0) return;
      var p = easeInOut(range(clamp01(-rect.top / span), 0.06, 0.94));

      // Travel exactly far enough to bring the last plate fully into view.
      var distance = Math.max(rail.scrollWidth - rail.clientWidth, 0);
      rail.style.setProperty("--rail-x", (-distance * p).toFixed(1) + "px");
    };
  }

  /* =======================================================================
     Scene 3 — the statement lights word by word
     ======================================================================= */

  function Statement() {
    var el = document.querySelector("[data-words]");
    if (!el) return null;

    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      var span = document.createElement("span");
      span.className = "word";
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });

    var spans = el.querySelectorAll(".word");
    var section = el.closest(".statement");

    return function () {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      // Fully lit by the time the section sits in the middle of the screen.
      var p = range(vh - rect.top, vh * 0.35, vh * 1.05);
      var lit = Math.round(p * spans.length);
      for (var i = 0; i < spans.length; i++) {
        spans[i].classList.toggle("is-lit", i < lit);
      }
    };
  }

  /* =======================================================================
     Wiring
     ======================================================================= */

  var fields = [];
  var scenes = [];

  function boot() {
    document.querySelectorAll("[data-light]").forEach(function (c) {
      fields.push(new LightField(c));
    });

    if (enabled) {
      [Reel(), Rail(), Statement()].forEach(function (s) { if (s) scenes.push(s); });
    }

    var dirty = true;
    var onScroll = function () { dirty = true; };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      dirty = true;
      fields.forEach(function (f) { f.size(); });
    }, { passive: true });

    (function loop(t) {
      if (dirty) {
        dirty = false;
        for (var i = 0; i < scenes.length; i++) scenes[i]();
      }
      for (var j = 0; j < fields.length; j++) fields[j].frame(t);
      requestAnimationFrame(loop);
    })(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
