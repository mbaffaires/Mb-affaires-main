(function () {
  "use strict";

  // ------------------------------------------------------------------
  // WhatsApp links
  // ------------------------------------------------------------------
  var WHATSAPP_NUMBER = "212777010882";

  var MESSAGES = {
    projet: "Bonjour MB Affaires, je souhaite échanger sur mon projet de société à Hong Kong (HK 360).",
    tarif: "Bonjour MB Affaires, je souhaite parler de mon projet et du forfait HK 360 (2 200 €).",
    concierge: "Bonjour MB Affaires, j’ai besoin d’aide sur une démarche administrative pour ma société à Hong Kong."
  };

  function waLink(msg) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
  }

  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var key = el.getAttribute("data-wa-msg") || "projet";
    el.setAttribute("href", waLink(MESSAGES[key] || MESSAGES.projet));
    el.addEventListener("click", function () {
      if (window.umami) window.umami.track("whatsapp_click", { context: key });
    });
  });

  // ------------------------------------------------------------------
  // Meta Pixel — Purchase event on any WhatsApp link click
  // ------------------------------------------------------------------
  document.addEventListener(
    "click",
    function (e) {
      var waAnchor = e.target.closest && e.target.closest('a[href*="wa.me"]');
      if (!waAnchor) return;
      if (typeof window.fbq === "function") {
        window.fbq("track", "Purchase", { content_name: "whatsapp" });
      }
    },
    true
  );

  // ------------------------------------------------------------------
  // Mobile menu
  // ------------------------------------------------------------------
  var mobileMenu = document.querySelector("[data-hk-mobile-menu]");
  var mobileToggle = document.querySelector("[data-hk-menu-toggle]");
  var mobileClosers = document.querySelectorAll("[data-hk-menu-close]");

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
    window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
      if (e.matches) closeMobileMenu();
    });
  }

  // ------------------------------------------------------------------
  // Mobile bottom WhatsApp bar — appears once the hero has been
  // scrolled past, mirrors the desktop sticky pill's behaviour
  // ------------------------------------------------------------------
  var mobileBar = document.querySelector("[data-hk-mobile-bar]");
  if (mobileBar) {
    var barTicking = false;
    function updateMobileBar() {
      mobileBar.classList.toggle("visible", window.scrollY > window.innerHeight * 0.6);
      barTicking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!barTicking) {
          window.requestAnimationFrame(updateMobileBar);
          barTicking = true;
        }
      },
      { passive: true }
    );
    updateMobileBar();
  }

  // ------------------------------------------------------------------
  // Scroll reveal (ported from the Claude Design reference's DCLogic)
  // ------------------------------------------------------------------
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = null;
  var sweepBound = false;

  function show(el) {
    if (el.__revealed) return;
    el.__revealed = true;
    var kids = el.hasAttribute("data-reveal-stagger") ? Array.from(el.children) : [el];
    var animate = document.visibilityState === "visible" && !reduceMotion;
    var diag = el.getAttribute("data-diag");
    var anim = diag === "l" ? "mre-diag-l" : diag === "r" ? "mre-diag-r" : "mre-rise";
    kids.forEach(function (k, i) {
      if (!animate) return;
      k.style.animation = anim + " .7s cubic-bezier(.22,.7,.25,1) " + i * 70 + "ms both";
      var clear = function () { k.style.animation = ""; };
      k.addEventListener("animationend", clear, { once: true });
      setTimeout(clear, 1600);
    });
    el.removeAttribute("data-reveal");
    if (io) io.unobserve(el);
  }

  function reveal() {
    var nodes = Array.from(document.querySelectorAll("[data-reveal]")).filter(function (n) {
      return !n.__revealBound;
    });
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }
    io = io || new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) show(e.target);
        });
      },
      { threshold: 0.01 }
    );
    if (!sweepBound) {
      sweepBound = true;
      var sweep = function () {
        Array.from(document.querySelectorAll("[data-reveal]")).forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.95) show(el);
        });
      };
      document.addEventListener("visibilitychange", function () {
        document.querySelectorAll('[style*="mre-rise"], [style*="mre-diag"]').forEach(function (k) { k.style.animation = ""; });
        sweep();
      });
      window.addEventListener("scroll", sweep, { passive: true });
      window.addEventListener("resize", sweep, { passive: true });
      setTimeout(sweep, 60);
    }
    nodes.forEach(function (el) {
      el.__revealBound = true;
      io.observe(el);
    });
    setTimeout(function () {
      Array.from(document.querySelectorAll("[data-reveal]")).forEach(show);
    }, 4000);
  }

  reveal();
})();
