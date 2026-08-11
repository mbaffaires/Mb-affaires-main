(function () {
  "use strict";

  // ------------------------------------------------------------------
  // WhatsApp links
  // ------------------------------------------------------------------
  var WHATSAPP_NUMBER = "212777010882";

  var MESSAGES = {
    projet: "Bonjour MB Consulting, je souhaite échanger sur mon projet MRE 360 à Marrakech.",
    tarif: "Bonjour MB Consulting, je souhaite parler de mon projet et du forfait MRE 360 (900 €).",
    concierge: "Bonjour MB Consulting, j’ai besoin d’aide sur une démarche administrative au Maroc."
  };

  function waLink(msg) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var key = el.getAttribute("data-wa-msg") || "projet";
    el.setAttribute("href", waLink(MESSAGES[key] || MESSAGES.projet));
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
