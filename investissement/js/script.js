(function () {
  "use strict";

  // ------------------------------------------------------------------
  // WhatsApp links
  // ------------------------------------------------------------------
  var WHATSAPP_NUMBER = "212777010882";

  var MESSAGES = {
    projet: "Bonjour MB Affaires, je souhaite faire analyser mon projet d’investissement au Maroc.",
    general: "Bonjour MB Affaires, je souhaite parler à un conseiller au sujet d’un investissement au Maroc.",
    mre: "Bonjour MB Affaires, je vis à l’étranger et je souhaite échanger sur mon projet d’investissement au Maroc.",
    dossier: "Bonjour MB Affaires, je souhaite être accompagné(e) pour structurer mon dossier de financement."
  };

  function waLink(msg) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var key = el.getAttribute("data-wa-msg") || "projet";
    el.setAttribute("href", waLink(MESSAGES[key] || MESSAGES.projet));
    el.addEventListener("click", function () {
      if (window.umami) window.umami.track("whatsapp_click_investissement", { context: key });
    });
  });

  // ------------------------------------------------------------------
  // Mobile menu
  // ------------------------------------------------------------------
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  var mobileClosers = document.querySelectorAll("[data-mobile-close]");

  function openMobileMenu() {
    mobileMenu.classList.add("open");
    mobileToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileMenu && mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileClosers.forEach(function (el) {
      el.addEventListener("click", closeMobileMenu);
    });

    var mqDesktop = window.matchMedia("(min-width: 1000px)");
    mqDesktop.addEventListener("change", function (e) {
      if (e.matches) closeMobileMenu();
    });
  }

  // ------------------------------------------------------------------
  // Scroll reveal — fade, diagonal (l/r), and staggered children
  // ------------------------------------------------------------------
  var revealEls = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealEl(el) {
    el.classList.add("revealed");
    if (el.hasAttribute("data-stagger")) {
      Array.from(el.children).forEach(function (child, i) {
        var anim = el.getAttribute("data-diag") === "l" ? "mbDiagL" : el.getAttribute("data-diag") === "r" ? "mbDiagR" : "mbFade";
        child.style.animation = anim + " 0.8s cubic-bezier(.22,.7,.3,1) " + (i * 0.09).toFixed(2) + "s both";
      });
    }
  }

  if (reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
      Array.from(el.children).forEach(function (child) { child.style.opacity = "1"; });
    });
  } else if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(revealEl);
  }

  // ------------------------------------------------------------------
  // Drift parallax
  // ------------------------------------------------------------------
  var driftEls = Array.from(document.querySelectorAll("[data-drift]")).map(function (el) {
    return { el: el, amt: parseFloat(el.getAttribute("data-drift")) || 0 };
  });

  if (driftEls.length && !reduceMotion) {
    var driftQueued = false;
    function paintDrift() {
      driftQueued = false;
      var h = window.innerHeight;
      driftEls.forEach(function (item) {
        var r = item.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) return;
        var p = ((r.top + r.height / 2) - h / 2) / h;
        item.el.style.transform = "translate3d(0," + (p * item.amt).toFixed(2) + "px,0)";
      });
    }
    function queueDrift() {
      if (!driftQueued) {
        driftQueued = true;
        window.requestAnimationFrame(paintDrift);
      }
    }
    window.addEventListener("scroll", queueDrift, { passive: true });
    window.addEventListener("resize", queueDrift);
    paintDrift();
  }

  // ------------------------------------------------------------------
  // Count-up numbers (stat figures)
  // ------------------------------------------------------------------
  var countEls = document.querySelectorAll("[data-count]");

  function parseCountTarget(text) {
    var m = text.match(/^([^\d]*)(\d+(?:[.,]\d+)?)([^\d]*)$/);
    if (!m) return null;
    var numStr = m[2];
    return { prefix: m[1], suffix: m[3], target: parseFloat(numStr.replace(",", ".")), decimal: numStr.indexOf(",") !== -1 };
  }

  function formatCount(cfg, value) {
    var numStr = cfg.decimal ? value.toFixed(1).replace(".", ",") : String(Math.round(value));
    return cfg.prefix + numStr + cfg.suffix;
  }

  function animateCount(el, cfg) {
    var duration = 1400;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(cfg, cfg.target * eased);
      if (progress < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }

  if (countEls.length) {
    var countConfigs = new WeakMap();
    countEls.forEach(function (el) {
      var cfg = parseCountTarget(el.textContent.trim());
      if (!cfg) return;
      countConfigs.set(el, cfg);
      if (!reduceMotion) el.textContent = formatCount(cfg, 0);
    });

    if (!reduceMotion && "IntersectionObserver" in window) {
      var countIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var cfg = countConfigs.get(entry.target);
              if (cfg) animateCount(entry.target, cfg);
              countIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      countEls.forEach(function (el) { countIo.observe(el); });
    }
  }

  // ------------------------------------------------------------------
  // Investment calculator (hero) — indicative "up to 20%" estimate
  // ------------------------------------------------------------------
  var budgetInput = document.querySelector("[data-budget-input]");
  var budgetOutput = document.querySelector("[data-budget-output]");

  function parseBudget(str) {
    var digits = str.replace(/[^\d]/g, "").slice(0, 10);
    return digits ? parseInt(digits, 10) : 0;
  }

  function formatThousands(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  if (budgetInput && budgetOutput) {
    function updateCalculator() {
      var value = parseBudget(budgetInput.value);
      budgetOutput.textContent = formatThousands(Math.round(value * 0.2));
    }

    budgetInput.addEventListener("input", function () {
      var caret = budgetInput.selectionStart;
      var lengthBefore = budgetInput.value.length;
      var raw = parseBudget(budgetInput.value);
      budgetInput.value = raw ? formatThousands(raw) : "";
      var lengthAfter = budgetInput.value.length;
      var newCaret = Math.max(0, (caret || 0) + (lengthAfter - lengthBefore));
      budgetInput.setSelectionRange(newCaret, newCaret);
      updateCalculator();
    });

    budgetInput.addEventListener("focus", function () {
      budgetInput.select();
    });

    budgetInput.addEventListener("change", function () {
      if (window.umami) window.umami.track("calculator_used", { budget: parseBudget(budgetInput.value) });
    });

    updateCalculator();
  }

  // ------------------------------------------------------------------
  // Leak visual — seals once the hero has been scrolled past
  // ------------------------------------------------------------------
  var leakVisual = document.querySelector("[data-leak-visual]");
  var heroSection = document.querySelector("[data-hero]");

  if (leakVisual && heroSection && "IntersectionObserver" in window) {
    var leakIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            leakVisual.classList.add("sealed");
            leakIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0 }
    );
    leakIo.observe(heroSection);
  }

  // ------------------------------------------------------------------
  // Floating WhatsApp button
  // ------------------------------------------------------------------
  var floatWa = document.querySelector("[data-float-wa]");

  if (floatWa) {
    var ticking = false;
    function updateFloat() {
      var show = window.scrollY > window.innerHeight * 0.7;
      floatWa.classList.toggle("visible", show);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateFloat);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateFloat();
  }

  // ------------------------------------------------------------------
  // Starfield background
  // ------------------------------------------------------------------
  var starsCanvas = document.getElementById("mb-stars");

  if (starsCanvas && starsCanvas.getContext) {
    var ctx = starsCanvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [];
    var raf = null;

    function resizeStars() {
      var w = window.innerWidth, h = window.innerHeight;
      starsCanvas.width = w * dpr;
      starsCanvas.height = h * dpr;
      var count = Math.round((w * h) / 11000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * starsCanvas.width,
          y: Math.random() * starsCanvas.height,
          r: (Math.random() * 1.2 + 0.25) * dpr,
          a: Math.random() * 0.45 + 0.12,
          speed: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawStars(t) {
      ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduceMotion ? s.a : s.a + Math.sin((t / 1000) * s.speed + s.phase) * 0.2;
        ctx.beginPath();
        ctx.fillStyle = "rgba(198,224,255," + Math.max(0, Math.min(1, tw)) + ")";
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) raf = window.requestAnimationFrame(drawStars);
    }

    resizeStars();
    window.addEventListener("resize", resizeStars);
    if (reduceMotion) {
      drawStars(0);
    } else {
      raf = window.requestAnimationFrame(drawStars);
    }
  }
})();
