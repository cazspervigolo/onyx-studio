/* Onyx Studio — ambient dust-mote field.
   Original code. The "signature" ambient system, echoing the raking window
   light in the studio photos. One low-amplitude drift; frozen for users who
   prefer reduced motion; paused when the tab is hidden. Attaches to any
   <canvas data-particles="dark|light">.  dark = faint dark motes on white,
   light = pale motes inside the black tiles. */

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function build(canvas) {
    var ctx = canvas.getContext("2d");
    var mode = canvas.getAttribute("data-particles") || "dark";
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, motes = [], raf = null;

    var rgb = mode === "light" ? "244,245,247" : "18,19,23";

    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // density scales with area, capped for mobile performance
      var count = Math.min(90, Math.round((w * h) / 14000));
      motes = [];
      for (var i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.4,
          a: Math.random() * 0.5 + 0.15,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.x += m.vx; m.y += m.vy; m.tw += 0.01;
        if (m.x < 0) m.x = w; if (m.x > w) m.x = 0;
        if (m.y < 0) m.y = h; if (m.y > h) m.y = 0;
        var alpha = m.a * (0.6 + 0.4 * Math.sin(m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf && !reduce) frame(); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size();
    if (reduce) { frame(); stop(); }   // paint one static frame, then hold
    else start();

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(function () { size(); }, 200);
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  document.querySelectorAll("canvas[data-particles]").forEach(build);
})();
